import fs from "node:fs";
import path from "node:path";
import { hostname as getHostname, networkInterfaces } from "node:os";

import { CONFIG_DIR, SETTINGS_FILE, ensureDataDirs } from "@utils/paths.ts";
import { parsePortableBoolean, parsePortableInteger, resolvePortablePayload, safeJsonParse } from "@utils/parsing.ts";
import { pickEnvBoolLegacy, pickEnvListLegacy, pickEnvNumberLegacy, pickEnvStringLegacy } from "@utils/env.ts";

import { DEFAULT_SETTINGS, createSettingsStore, mergeSettings } from "./settings.ts";

export type ServerV2ConfigSnapshot = Record<string, any>;

type ConfigLoadReport = {
    configPath?: string;
    configDir?: string;
    dataDir?: string;
    selectedPortableConfig?: string;
    portableModules: string[];
};

const loadReport: ConfigLoadReport = {
    configDir: CONFIG_DIR,
    configPath: process.env.CWS_PORTABLE_CONFIG_PATH,
    dataDir: process.env.CWS_PORTABLE_DATA_PATH,
    portableModules: []
};

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const readJsonFile = <T>(filePath: string): T | undefined => {
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        return safeJsonParse<T>(raw);
    } catch {
        return undefined;
    }
};

const resolvePortableConfig = (): Record<string, unknown> => {
    const configPath = pickEnvStringLegacy("CWS_PORTABLE_CONFIG_PATH") || pickEnvStringLegacy("PORTABLE_CONFIG_PATH");
    if (!configPath) return {};
    const absolutePath = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
    const raw = readJsonFile<Record<string, unknown>>(absolutePath) || {};
    loadReport.selectedPortableConfig = absolutePath;
    loadReport.configPath = absolutePath;
    loadReport.configDir = path.dirname(absolutePath);
    return asRecord(resolvePortablePayload(raw, path.dirname(absolutePath)));
};

const PORTABLE_CONFIG = resolvePortableConfig();

const applyPortableLauncherEnvDefaults = () => {
    const launcherEnv = asRecord(PORTABLE_CONFIG.launcherEnv);
    for (const [key, rawValue] of Object.entries(launcherEnv)) {
        if (!key || process.env[key]?.trim()) continue;
        if (Array.isArray(rawValue)) {
            process.env[key] = rawValue.map((entry) => String(entry ?? "").trim()).filter(Boolean).join(",");
            continue;
        }
        if (rawValue === undefined || rawValue === null) continue;
        process.env[key] = typeof rawValue === "string" ? rawValue : String(rawValue);
    }
};

applyPortableLauncherEnvDefaults();

const resolvePortableModuleRecord = (key: string): Record<string, unknown> => {
    const modules = asRecord(PORTABLE_CONFIG.portableModules);
    const moduleRef = modules[key];
    let record: Record<string, unknown> = {};
    if (typeof moduleRef === "string") {
        const resolved = resolvePortablePayload(moduleRef, loadReport.configDir || process.cwd());
        record = asRecord(resolved);
    } else {
        record = asRecord(moduleRef);
    }
    if (Object.keys(record).length) loadReport.portableModules.push(key);
    return record;
};

const readPortableCore = (): Record<string, unknown> => {
    const direct = asRecord(PORTABLE_CONFIG.core);
    const fromModule = resolvePortableModuleRecord("core");
    return {
        ...fromModule,
        ...direct
    };
};

const readPortableEndpoint = (): Record<string, unknown> => {
    const direct = asRecord(PORTABLE_CONFIG.endpoint);
    const fromModule = resolvePortableModuleRecord("endpoint");
    return {
        ...fromModule,
        ...direct
    };
};

const readPortableClients = (): Record<string, unknown> => {
    return resolvePortableModuleRecord("clients");
};

const readPortableNetwork = (): Record<string, unknown> => {
    return resolvePortableModuleRecord("network");
};

const splitList = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((entry) => String(entry || "").trim()).filter(Boolean);
    if (typeof value === "string") return value.split(/[;,]/).map((entry) => entry.trim()).filter(Boolean);
    return [];
};

const normalizeHost = (value: unknown): string => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const withoutZone = raw.split("%")[0].replace(/^\[(.*)\]$/, "$1").trim();
    if (!withoutZone) return "";
    try {
        const parsed = new URL(withoutZone.includes("://") ? withoutZone : `https://${withoutZone}`);
        return String(parsed.hostname || "").trim().toLowerCase();
    } catch {
        return withoutZone.toLowerCase();
    }
};

const getLocalHosts = (): Set<string> => {
    const hosts = new Set<string>(["localhost", "127.0.0.1", "::1"]);
    const hostname = normalizeHost(getHostname());
    if (hostname) hosts.add(hostname);
    const interfaces = networkInterfaces();
    for (const entries of Object.values(interfaces || {})) {
        if (!entries) continue;
        for (const entry of entries) {
            const host = normalizeHost(entry?.address);
            if (host) hosts.add(host);
        }
    }
    return hosts;
};

const resolveAliasId = (policies: Record<string, unknown>, candidateId: string, depth = 0): string => {
    const trimmed = String(candidateId || "").trim();
    if (!trimmed || depth > 8) return trimmed;
    const value = policies[trimmed];
    if (typeof value !== "string") return trimmed;
    const aliasMatch = /^alias:(.+)$/i.exec(value.trim());
    if (!aliasMatch) return trimmed;
    return resolveAliasId(policies, aliasMatch[1].trim(), depth + 1);
};

const inferBridgeIdentityFromEndpointIds = (policies: Record<string, unknown>): string => {
    if (!Object.keys(policies).length) return "";
    const localHosts = getLocalHosts();
    for (const [rawId, rawPolicy] of Object.entries(policies)) {
        const canonicalId = resolveAliasId(policies, rawId);
        const policy = asRecord(typeof rawPolicy === "string" ? policies[canonicalId] : rawPolicy);
        const origins = splitList(policy.origins);
        if (!origins.length) continue;
        for (const origin of origins) {
            const host = normalizeHost(origin);
            if (host && localHosts.has(host)) {
                return canonicalId || rawId;
            }
        }
    }
    return "";
};

const PORTABLE_CORE = readPortableCore();
const PORTABLE_ENDPOINT = readPortableEndpoint();
const PORTABLE_CLIENTS = readPortableClients();
const PORTABLE_NETWORK = readPortableNetwork();

const resolveRoles = (): string[] => {
    const envRoles = pickEnvListLegacy("CWS_ROLES");
    const portableRoles = splitList(PORTABLE_ENDPOINT.roles).length ? splitList(PORTABLE_ENDPOINT.roles) : splitList(PORTABLE_CORE.roles);
    return envRoles?.length ? envRoles : portableRoles.length ? portableRoles : [...(DEFAULT_SETTINGS.core?.roles || [])];
};

const resolveBridgeConfig = () => {
    const portableBridge = asRecord(PORTABLE_ENDPOINT.bridge);
    const coreBridge = asRecord(PORTABLE_CORE.bridge);
    const networkBridge = asRecord(PORTABLE_NETWORK.bridge);
    const endpointPolicies = resolveEndpointIds();
    const inferredSelfId = inferBridgeIdentityFromEndpointIds(endpointPolicies);
    const endpoints = [
        ...(pickEnvListLegacy("CWS_BRIDGE_ENDPOINTS") || []),
        ...splitList(portableBridge.endpoints),
        ...splitList(coreBridge.endpoints),
        ...splitList(networkBridge.endpoints || PORTABLE_NETWORK.endpoints)
    ].filter(Boolean);
    const preconnectTargets = [
        ...(pickEnvListLegacy("CWS_BRIDGE_PRECONNECT_TARGETS") || []),
        ...splitList(asRecord(portableBridge.preconnect).targets),
        ...splitList(asRecord(coreBridge.preconnect).targets),
        ...splitList(portableBridge.preconnectTargets),
        ...splitList(coreBridge.preconnectTargets)
    ].filter(Boolean);
    const endpointUrl =
        pickEnvStringLegacy("CWS_BRIDGE_ENDPOINT_URL") ||
        String(portableBridge.endpointUrl || coreBridge.endpointUrl || endpoints[0] || "").trim();
    const reconnectMs =
        pickEnvNumberLegacy("CWS_BRIDGE_RECONNECT_MS") ??
        parsePortableInteger(portableBridge.reconnectMs) ??
        parsePortableInteger(coreBridge.reconnectMs) ??
        5000;

    return {
        enabled:
            pickEnvBoolLegacy("CWS_BRIDGE_ENABLED") ??
            parsePortableBoolean(portableBridge.enabled) ??
            parsePortableBoolean(coreBridge.enabled) ??
            true,
        mode: pickEnvStringLegacy("CWS_BRIDGE_MODE") || String(portableBridge.mode || coreBridge.mode || "active"),
        endpointUrl,
        endpoints: Array.from(new Set(endpoints)),
        reconnectMs: reconnectMs > 0 ? reconnectMs : 5000,
        userId:
            pickEnvStringLegacy("CWS_BRIDGE_USER_ID") ||
            pickEnvStringLegacy("CWS_ASSOCIATED_ID") ||
            String(portableBridge.userId || coreBridge.userId || "").trim() ||
            inferredSelfId,
        userKey:
            pickEnvStringLegacy("CWS_BRIDGE_USER_KEY") ||
            pickEnvStringLegacy("CWS_ASSOCIATED_TOKEN") ||
            String(portableBridge.userKey || coreBridge.userKey || "").trim(),
        deviceId:
            pickEnvStringLegacy("CWS_BRIDGE_DEVICE_ID") ||
            pickEnvStringLegacy("CWS_DEVICE_ID") ||
            pickEnvStringLegacy("CWS_ASSOCIATED_ID") ||
            String(portableBridge.deviceId || coreBridge.deviceId || "").trim() ||
            inferredSelfId,
        preconnect: {
            enabled:
                pickEnvBoolLegacy("CWS_BRIDGE_PRECONNECT") ??
                parsePortableBoolean(asRecord(portableBridge.preconnect).enabled) ??
                parsePortableBoolean(asRecord(coreBridge.preconnect).enabled) ??
                true,
            targets: Array.from(new Set(preconnectTargets))
        }
    };
};

const resolveRuntimeDefaults = () => {
    const endpointRuntime = asRecord(PORTABLE_ENDPOINT.runtime);
    const coreRuntime = asRecord(PORTABLE_CORE.runtime);
    const networkRuntime = asRecord(PORTABLE_NETWORK.runtime);
    const runtime = { ...coreRuntime, ...endpointRuntime };
    const networkListen =
        parsePortableInteger((PORTABLE_NETWORK as Record<string, unknown>).listenPort) ??
        parsePortableInteger(networkRuntime.listenPort);
    const networkHttp =
        parsePortableInteger((PORTABLE_NETWORK as Record<string, unknown>).httpPort) ??
        parsePortableInteger(networkRuntime.httpPort);
    return {
        listenPort:
            pickEnvNumberLegacy(
                "CWS_HTTPS_PORT",
                parsePortableInteger(runtime.listenPort) ?? networkListen ?? 8443
            ) ?? 8443,
        httpPort:
            pickEnvNumberLegacy("CWS_HTTP_PORT", parsePortableInteger(runtime.httpPort) ?? networkHttp ?? 8080) ??
            8080,
        broadcastForceHttps: parsePortableBoolean(runtime.broadcastForceHttps) ?? true,
        peers: splitList(runtime.peers),
        broadcastTargets: splitList(runtime.broadcastTargets),
        clipboardPeerTargets: splitList(runtime.clipboardPeerTargets),
        pollInterval: parsePortableInteger(runtime.pollInterval) ?? 1500,
        httpTimeoutMs: parsePortableInteger(runtime.httpTimeoutMs) ?? 8000,
        secret: String(runtime.secret || "").trim()
    };
};

const resolveNetworkAliases = (): Record<string, unknown> => {
    return asRecord(PORTABLE_NETWORK.aliases || PORTABLE_NETWORK.networkAliases || PORTABLE_NETWORK.aliasMap);
};

const resolveEndpointIds = (): Record<string, unknown> => {
    const explicit = asRecord(PORTABLE_ENDPOINT.endpointIDs || PORTABLE_CORE.endpointIDs);
    if (Object.keys(explicit).length) return explicit;
    const fromEndpointIdsModule = resolvePortableModuleRecord("endpointIDs");
    if (Object.keys(fromEndpointIdsModule).length) return fromEndpointIdsModule;
    return asRecord(PORTABLE_CLIENTS);
};

const buildSnapshot = (): ServerV2ConfigSnapshot => {
    const bridge = resolveBridgeConfig();
    const runtime = resolveRuntimeDefaults();
    return {
        ...runtime,
        roles: resolveRoles(),
        bridge,
        topology: {
            enabled: parsePortableBoolean(asRecord(PORTABLE_ENDPOINT.topology).enabled) ?? true,
            nodes: Array.isArray(asRecord(PORTABLE_ENDPOINT.topology).nodes) ? asRecord(PORTABLE_ENDPOINT.topology).nodes : [],
            links: Array.isArray(asRecord(PORTABLE_ENDPOINT.topology).links) ? asRecord(PORTABLE_ENDPOINT.topology).links : []
        },
        endpointIDs: resolveEndpointIds(),
        networkAliases: resolveNetworkAliases(),
        ai: mergeSettings(DEFAULT_SETTINGS, asRecord(PORTABLE_CONFIG)).ai,
        core: mergeSettings(DEFAULT_SETTINGS, asRecord(PORTABLE_CONFIG)).core
    };
};

let snapshotCache: ServerV2ConfigSnapshot | null = null;

export const readServerV2ConfigSnapshot = (): ServerV2ConfigSnapshot => {
    if (snapshotCache) return { ...snapshotCache };
    snapshotCache = buildSnapshot();
    return { ...snapshotCache };
};

export const getConfigLoadReportSnapshot = (): ConfigLoadReport => ({
    ...loadReport,
    portableModules: [...loadReport.portableModules]
});

const settingsStore = createSettingsStore(SETTINGS_FILE, DEFAULT_SETTINGS);
export const readCoreSettings = settingsStore.readCoreSettings;
export const writeCoreSettings = settingsStore.writeCoreSettings;

export const createServerV2ConfigStorage = () => {
    const readSnapshot = (): ServerV2ConfigSnapshot => readServerV2ConfigSnapshot();
    return {
        defaults: DEFAULT_SETTINGS,
        getLoadReport: () => getConfigLoadReportSnapshot(),
        mergeSettings,
        readCoreSettings,
        readSnapshot,
        settingsStore: createSettingsStore(undefined, DEFAULT_SETTINGS),
        writeCoreSettings,
        ensureDataDirs
    };
};

export { DEFAULT_SETTINGS, createSettingsStore, mergeSettings };
