/**
 * Fastify plugin that wires the endpoint's live transport runtime.
 *
 * This is the hand-off point between bootstrap/config code and the actual
 * socket transport layer: it creates clipboard access, resolves the endpoint's
 * bridge identity, attaches the shared socket runtime to both Fastify servers,
 * and exposes `wsHub` for HTTP handlers that need live transport access.
 */
import type { FastifyInstance } from "fastify";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { createClipboardAccess } from "../../inputs/access/clipboard.ts";
import { getSuppressedClipboardText, isClipboardBroadcasting } from "../../inputs/clipboard.ts";
import { normalizeWireNodeId, resolveServerV2WireIdentity } from "../../socket/client-contract.ts";
import { ServerV2SocketRuntime } from "../../socket/runtime.ts";
import { setupClipboard } from "./clipboard.ts";

let socketRuntime: ServerV2SocketRuntime | undefined;
let clipboardPoller: ReturnType<typeof setInterval> | undefined;

const normalizeString = (value: unknown): string => String(value || "").trim();

const splitList = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((entry) => normalizeString(entry)).filter(Boolean);
    if (typeof value === "string") return value.split(/[;,]/).map((entry) => entry.trim()).filter(Boolean);
    return [];
};

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const findPolicyRecord = (seed: Record<string, unknown>, id: string): Record<string, unknown> => {
    const normalizedId = normalizeWireNodeId(id).toLowerCase();
    for (const [key, value] of Object.entries(seed)) {
        if (normalizeWireNodeId(key).toLowerCase() === normalizedId) {
            const record = asRecord(value);
            if (Object.keys(record).length > 0) {
                return record;
            }
        }
    }
    return {};
};

const resolveClipboardModuleConfig = (seed: Record<string, unknown>, selfId: string): Record<string, unknown> => {
    const policy = findPolicyRecord(seed, selfId);
    const modules = asRecord(policy.modules);
    const clipboard = modules.clipboard;
    if (Array.isArray(clipboard)) {
        return clipboard.find((entry) => entry && typeof entry === "object" && !Array.isArray(entry)) as Record<string, unknown> || {};
    }
    return asRecord(clipboard);
};

const resolveRelationTargets = (seed: Record<string, unknown>, selfId: string): string[] => {
    const policy = findPolicyRecord(seed, selfId);
    return Object.keys(asRecord(policy.relations)).map((entry) => normalizeWireNodeId(entry)).filter(Boolean);
};

const isGatewayTarget = (seed: Record<string, unknown>, target: string): boolean => {
    const policy = findPolicyRecord(seed, target);
    return asRecord(policy.flags).gateway === true;
};

const resolveClipboardTargetsFromDisk = (selfId: string): string[] => {
    const configDir = path.resolve(process.cwd(), "config");
    const networkPath = path.join(configDir, "network.json");
    const clientsPath = path.join(configDir, "clients.json");
    const out = new Set<string>();
    try {
        if (existsSync(networkPath)) {
            const network = JSON.parse(readFileSync(networkPath, "utf8")) as Record<string, unknown>;
            const runtime = asRecord(network.runtime);
            for (const entry of Array.isArray(runtime.clipboardPeerTargets) ? runtime.clipboardPeerTargets : splitList(runtime.clipboardPeerTargets)) {
                const normalized = normalizeWireNodeId(entry);
                if (normalized) out.add(normalized);
            }
        }
    } catch {
        // ignore disk fallback parse errors
    }
    try {
        if (existsSync(clientsPath)) {
            const clients = JSON.parse(readFileSync(clientsPath, "utf8")) as Record<string, unknown>;
            const moduleConfig = resolveClipboardModuleConfig(clients, selfId);
            for (const entry of Array.isArray(moduleConfig.shareTo) ? moduleConfig.shareTo : splitList(moduleConfig.shareTo)) {
                const normalized = normalizeWireNodeId(entry);
                if (normalized) out.add(normalized);
            }
        }
    } catch {
        // ignore disk fallback parse errors
    }
    return Array.from(out);
};

const resolveGatewayTargetsFromDisk = (): Set<string> => {
    const clientsPath = path.join(path.resolve(process.cwd(), "config"), "clients.json");
    const out = new Set<string>();
    try {
        if (!existsSync(clientsPath)) return out;
        const clients = JSON.parse(readFileSync(clientsPath, "utf8")) as Record<string, unknown>;
        for (const [key, value] of Object.entries(clients)) {
            const record = asRecord(value);
            if (Object.keys(record).length === 0) continue;
            if (asRecord(record.flags).gateway === true) {
                const normalized = normalizeWireNodeId(key);
                if (normalized) out.add(normalized);
            }
        }
    } catch {
        // ignore disk fallback parse errors
    }
    return out;
};

const startClipboardPolling = async (
    app: FastifyInstance,
    clipboard: ReturnType<typeof createClipboardAccess>,
    sockets: ServerV2SocketRuntime,
    cfg: Record<string, unknown>,
    clientSeed: Record<string, unknown>,
    selfId: string
) => {
    if (clipboardPoller) {
        clearInterval(clipboardPoller);
        clipboardPoller = undefined;
    }

    const diskGatewayTargets = resolveGatewayTargetsFromDisk();
    const moduleConfig = resolveClipboardModuleConfig(clientSeed, selfId);
    const targets = (Array.isArray(cfg.clipboardPeerTargets) ? cfg.clipboardPeerTargets : splitList(cfg.clipboardPeerTargets))
        .concat(Array.isArray(moduleConfig.shareTo) ? moduleConfig.shareTo : splitList(moduleConfig.shareTo))
        .concat(Array.isArray(cfg.peers) ? cfg.peers : splitList(cfg.peers))
        .concat(resolveRelationTargets(clientSeed, selfId))
        .concat(resolveClipboardTargetsFromDisk(selfId))
        .map((entry) => normalizeWireNodeId(entry))
        .filter((entry) => entry && entry !== "*" && entry.toLowerCase() !== selfId.toLowerCase())
        .filter((entry, index, array) => array.indexOf(entry) === index)
        .filter((entry) => !isGatewayTarget(clientSeed, entry) && !diskGatewayTargets.has(entry));
    const pollInterval = Math.max(500, Number(cfg.pollInterval || moduleConfig.pollInterval || 1500) || 1500);
    if (!targets.length) {
        app.log.info({ selfId }, "Clipboard polling disabled: no peer targets");
        return;
    }

    let lastClipboardText = normalizeString(await clipboard.read().catch(() => ""));
    let pollInFlight = false;
    clipboardPoller = setInterval(async () => {
        if (pollInFlight) return;
        pollInFlight = true;
        try {
            const text = normalizeString(await clipboard.read().catch(() => ""));
            if (isClipboardBroadcasting()) {
                if (text === getSuppressedClipboardText()) {
                    lastClipboardText = text;
                }
                return;
            }
            if (!text || text === lastClipboardText) return;
            lastClipboardText = text;
            const delivered = sockets.sendCoordinatorMessage(
                targets,
                "clipboard:update",
                {
                    text,
                    source: selfId,
                    from: selfId,
                    userId: selfId,
                    clientId: selfId
                },
                selfId,
                "act"
            );
            app.log.info(
                {
                    selfId,
                    targets,
                    delivered,
                    textLength: text.length
                },
                "Clipboard polling emitted outbound sync"
            );
        } catch (error) {
            app.log.warn({ err: error, selfId }, "Clipboard polling iteration failed");
        } finally {
            pollInFlight = false;
        }
    }, pollInterval);
    app.log.info({ selfId, targets, pollInterval }, "Clipboard polling active");
};

/** Return the singleton runtime created during plugin registration, if any. */
export const getCwspSocketRuntime = (): ServerV2SocketRuntime | undefined => socketRuntime;

/**
 * Register the live IO/socket bridge onto both admin and public Fastify apps.
 *
 * WHY: HTTP handlers, clipboard relays, and diagnostics must all see the same
 * runtime instance regardless of which Fastify app received the request.
 */
export const registerIoPlugin = async (adminApp: FastifyInstance, publicApp: FastifyInstance, context: any) => {
    setupClipboard(adminApp);

    const engine = context.engine;
    const cfg = engine.config as Record<string, unknown>;
    const bridge = (cfg.bridge || {}) as Record<string, unknown>;

    const identity = resolveServerV2WireIdentity({
        endpointUrl: String(bridge.endpointUrl || "").trim(),
        userId: String(bridge.userId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        deviceId: String(bridge.deviceId || process.env.CWS_ASSOCIATED_ID || "").trim(),
        token: String(bridge.userKey || process.env.CWS_ASSOCIATED_TOKEN || "").trim()
    });

    const selfId = identity.userId || identity.deviceId || "cwsp-server";
    const token = identity.token;

    const clientSeed = (cfg.endpointIDs && typeof cfg.endpointIDs === "object" ? cfg.endpointIDs : {}) as Record<
        string,
        unknown
    >;

    const clipboard = createClipboardAccess();
    clipboard.attachApp(adminApp);

    socketRuntime = new ServerV2SocketRuntime(selfId, token, clientSeed, bridge);
    socketRuntime.attach([publicApp.server, adminApp.server]);

    const policySource =
        engine.policyMap && Object.keys(engine.policyMap as object).length > 0
            ? (engine.policyMap as Record<string, unknown>)
            : clientSeed;

    await startClipboardPolling(adminApp, clipboard, socketRuntime, cfg, policySource, selfId);

    // AI-READ: `wsHub` is the shared transport surface read by HTTP handlers,
    // clipboard relays, and diagnostics routes; keep it stable across both apps.
    const wsHub = {
        clipboard,
        sockets: socketRuntime,
        selfId,
        endpointPolicies: policySource,
        getConnectionRegistry: () => socketRuntime!.getConnectionRegistry()
    };

    (adminApp as any).wsHub = wsHub;
    (publicApp as any).wsHub = wsHub;
};
