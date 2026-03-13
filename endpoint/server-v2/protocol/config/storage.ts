import fs from "node:fs";
import path from "node:path";

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
    const endpoints = [
        ...(pickEnvListLegacy("CWS_BRIDGE_ENDPOINTS") || []),
        ...splitList(portableBridge.endpoints),
        ...splitList(coreBridge.endpoints)
    ].filter(Boolean);
    const endpointUrl =
        pickEnvStringLegacy("CWS_BRIDGE_ENDPOINT_URL") ||
        String(portableBridge.endpointUrl || coreBridge.endpointUrl || endpoints[0] || "").trim();

    return {
        enabled:
            pickEnvBoolLegacy("CWS_BRIDGE_ENABLED") ??
            parsePortableBoolean(portableBridge.enabled) ??
            parsePortableBoolean(coreBridge.enabled) ??
            true,
        mode: pickEnvStringLegacy("CWS_BRIDGE_MODE") || String(portableBridge.mode || coreBridge.mode || "active"),
        endpointUrl,
        endpoints: Array.from(new Set(endpoints)),
        userId: pickEnvStringLegacy("CWS_ASSOCIATED_ID") || String(portableBridge.userId || coreBridge.userId || "").trim(),
        userKey: pickEnvStringLegacy("CWS_ASSOCIATED_TOKEN") || String(portableBridge.userKey || coreBridge.userKey || "").trim(),
        deviceId: pickEnvStringLegacy("CWS_DEVICE_ID") || String(portableBridge.deviceId || coreBridge.deviceId || "").trim()
    };
};

const resolveRuntimeDefaults = () => {
    const endpointRuntime = asRecord(PORTABLE_ENDPOINT.runtime);
    const coreRuntime = asRecord(PORTABLE_CORE.runtime);
    const runtime = { ...coreRuntime, ...endpointRuntime };
    return {
        listenPort: pickEnvNumberLegacy("CWS_HTTPS_PORT", parsePortableInteger(runtime.listenPort) ?? 8443) ?? 8443,
        httpPort: pickEnvNumberLegacy("CWS_HTTP_PORT", parsePortableInteger(runtime.httpPort) ?? 8080) ?? 8080,
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
