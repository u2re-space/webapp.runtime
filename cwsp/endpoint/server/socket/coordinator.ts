/**
 * Coordinator and routing core for the endpoint's realtime transport stack.
 *
 * This file keeps the live peer registry, maps policy/client identities onto
 * active sockets, performs outbound dialing to known peers, normalizes routing
 * aliases, and emits the trace lines used when diagnosing delivery failures.
 */
import { Server, Socket as SocketClient } from "socket.io";
import { Socket as SocketConnect, io } from "socket.io-client";
import { handleAct, handleAsk,makePostHandler } from "./handler.ts";
import { buildServerV2SocketHandshake, normalizeWireNodeId } from "./client-contract.ts";
import { normalizeInboundPacket } from "./packet.ts";
import type { Packet } from "./types.ts";
import { normalizeIpForMatch } from "@utils/ip-match.ts";
import { readServerV2ConfigSnapshot } from "@config/storage.ts";
import { normalizeNetworkAliasMap, resolveNetworkAlias } from "@utils/topology.ts";

/** Process-local identity used when the endpoint itself sends coordinator frames. */
export const SELF_DATA = {
    ASSOCIATED_ID: "",
    ASSOCIATED_TOKEN: ""
}

/** Lightweight UUID helper used for request/response correlation and peer instance ids. */
export const UUIDv4 = () => { 
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
    uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
    uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    return uuid.map((x) => x.toString(16)).join('');
}

/**
 * Core registries used by routing and diagnostics.
 *
 * AI-READ: `internalNodeMap` is the live truth for connected peers, while
 * `knownClients` is the policy/config view of who *could* exist.
 */
export const socketWrapper = new WeakMap<SocketConnect | SocketClient, SocketWrapper>();
export const internalNodeMap = new Map<string, SocketConnect | SocketClient>();
export const knownClients = new Map<string, any>();
export const nodeMap = new Map<string, SocketWrapper | Promise<SocketWrapper | undefined> | undefined>();
const failedNodeRetryAt = new Map<string, number>();
/** Lowercase account / alias key -> peer instance ids that share that identity (same token, different devices). */
const accountPeerByAlias = new Map<string, Set<string>>();
const peerAccountKeys = new Map<string, Set<string>>();
// Keep reconnect/cooldown close to "about a second" by default.
// Can be overridden for tuning in noisy network scenarios.
const FAILED_NODE_RETRY_MS = Math.max(1000, Number(process.env.CWS_SOCKET_FAILED_NODE_RETRY_MS || 1000) || 1000);

const isSocketTraceEnabled = () => {
    const verbose = String(process.env.CWS_AIRPAD_VERBOSE || "").trim().toLowerCase();
    const tunnelDebug = String(process.env.CWS_TUNNEL_DEBUG || "").trim().toLowerCase();
    const socketTrace = String(process.env.CWS_SOCKET_TRACE || "").trim().toLowerCase();
    return (
        ["1", "true", "yes", "on"].includes(verbose) ||
        ["1", "true", "yes", "on"].includes(tunnelDebug) ||
        ["1", "true", "yes", "on"].includes(socketTrace)
    );
};

const isRouteLogEnabled = () =>
    ["1", "true", "yes", "on"].includes(String(process.env.CWS_ROUTE_LOG || "").trim().toLowerCase());

const routeLog = (msg: string, details: Record<string, unknown> = {}) => {
    if (!isRouteLogEnabled()) return;
    console.log(
        JSON.stringify({
            ts: new Date().toISOString(),
            channel: "cwsp-route",
            msg,
            ...details
        })
    );
};

const TRACE_SUPPRESSION_WINDOW_MS = 1000;
const suppressedSocketTraces = new Map<string, { lastAt: number; count: number }>();
const activePeerFilterRaw = String(process.env.CWS_ACTIVE_PEERS || "")
    .split(/[;,]/)
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);

const traceSocket = (event: string, details: Record<string, unknown>) => {
    if (!isSocketTraceEnabled()) return;
    const payload = Object.entries(details)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : String(value)}`)
        .join(" ");
    const line = `[socket:${event}]${payload ? ` ${payload}` : ""}`;
    const now = Date.now();
    const existing = suppressedSocketTraces.get(line);
    if (existing && now - existing.lastAt < TRACE_SUPPRESSION_WINDOW_MS) {
        existing.lastAt = now;
        existing.count += 1;
        // NOTE: repeated reconnect / routing misses can flood logs extremely
        // fast; emit sampled suppression summaries instead of every duplicate.
        const step = existing.count > 20000 ? 2000 : existing.count > 2000 ? 500 : existing.count > 200 ? 50 : 10;
        if (existing.count % step === 0) {
            console.log(`[socket:${event}-suppressed] repeats=${existing.count} windowMs=${TRACE_SUPPRESSION_WINDOW_MS}`);
        }
        return;
    }
    if (existing && existing.count > 1) {
        console.log(`[socket:${event}-suppressed] repeats=${existing.count - 1} windowMs=${TRACE_SUPPRESSION_WINDOW_MS}`);
    }
    suppressedSocketTraces.set(line, { lastAt: now, count: 1 });
    console.log(line);
};

const describeSocketError = (error: unknown): string => {
    if (error instanceof AggregateError) {
        return error.errors?.map?.((entry) => describeSocketError(entry)).filter(Boolean).join(" | ") || error.message || "aggregate-error";
    }
    if (error instanceof Error) {
        return error.message || error.name || "error";
    }
    return String(error || "");
};

const CLIPBOARD_DEDUP_WINDOW_MS = Math.max(
    100,
    Number(process.env.CWS_CLIPBOARD_DEDUP_WINDOW_MS || 300) || 300
);

const isRecordLike = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value);

const isProtocolEnvelopeLike = (value: Record<string, unknown>): boolean => {
    const keys = Object.keys(value);
    if (keys.length === 0) return false;
    const hasProtocolKey = keys.some((key) =>
        ["op", "what", "nodes", "byId", "from", "uuid", "event", "payload", "result", "error"].includes(key)
    );
    if (!hasProtocolKey) return false;
    const hasDirectText = ["text", "content", "body"].some((key) => typeof value[key] === "string");
    return !hasDirectText;
};

const extractClipboardText = (value: unknown, depth = 0): string | undefined => {
    if (depth > 4) return undefined;
    if (value == null) return undefined;
    if (typeof value === "string") {
        const raw = value.trim();
        if (!raw) return "";
        if (raw.startsWith("{") || raw.startsWith("[")) {
            try {
                return extractClipboardText(JSON.parse(raw), depth + 1);
            } catch {
                // keep plain text if this is not JSON
            }
        }
        if (raw.startsWith("{text=") && raw.endsWith("}")) {
            return raw.slice(6, -1).trim();
        }
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (Array.isArray(value)) {
        for (const entry of value) {
            const nested = extractClipboardText(entry, depth + 1);
            if (nested !== undefined) return nested;
        }
        return undefined;
    }
    if (!isRecordLike(value)) return undefined;
    const candidateKeys = [
        "text",
        "content",
        "body",
        "data",
        "payload",
        "result",
        "value",
        "message",
        "clipboard"
    ] as const;
    for (const key of candidateKeys) {
        const nested = extractClipboardText(value[key], depth + 1);
        if (nested !== undefined) return nested;
    }
    if (isProtocolEnvelopeLike(value)) return undefined;
    return undefined;
};

const normalizeClipboardEventText = (data: unknown): string | undefined => {
    const text = extractClipboardText(data);
    if (text === undefined) return undefined;
    return String(text).replace(/\r\n/g, "\n");
};

const sanitizeWireValue = (value: unknown, seen = new WeakSet<object>()): unknown => {
    if (value == null) return value;
    const valueType = typeof value;
    if (valueType === "string" || valueType === "number" || valueType === "boolean") {
        return value;
    }
    if (valueType === "bigint") {
        return value.toString();
    }
    if (valueType === "function" || valueType === "symbol") {
        return undefined;
    }
    if (
        value instanceof ArrayBuffer ||
        ArrayBuffer.isView(value) ||
        (typeof Blob !== "undefined" && value instanceof Blob) ||
        (typeof File !== "undefined" && value instanceof File)
    ) {
        return value;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack
        };
    }
    if (Array.isArray(value)) {
        return value
            .map((entry) => sanitizeWireValue(entry, seen))
            .filter((entry) => entry !== undefined);
    }
    if (typeof value === "object") {
        if (seen.has(value as object)) {
            return undefined;
        }
        seen.add(value as object);
        const sanitized: Record<string, unknown> = {};
        for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
            if (!key || key.startsWith("__")) continue;
            const normalized = sanitizeWireValue(entry, seen);
            if (normalized !== undefined) {
                sanitized[key] = normalized;
            }
        }
        return sanitized;
    }
    return undefined;
};

const sanitizePacketForWire = (packet: Packet): Packet => {
    return (sanitizeWireValue(packet) || {}) as Packet;
};

/**
 * Prefer an already-live gateway socket as a relay hop before opening a fresh
 * direct dial to a target that may only be reachable through WAN/LAN proxying.
 *
 * WHY: external/mobile peers like `L-192.168.0.196` often cannot reach
 * `L-192.168.0.110` directly, but they can already be connected to
 * `L-192.168.0.200` / `45.147.121.152`, which should relay the packet.
 */
const resolveLiveGatewayRelayWrappers = (targetId: string, selfId?: string): SocketWrapper[] => {
    const targetAlias = resolveKnownClientId(targetId) || normalizeNodeId(targetId);
    const seenPeerInstances = new Set<string>();
    const out: SocketWrapper[] = [];
    for (const [candidateId, candidateConfig] of knownClients.entries()) {
        const flags = candidateConfig && typeof candidateConfig === "object"
            ? ((candidateConfig as any).flags && typeof (candidateConfig as any).flags === "object" ? (candidateConfig as any).flags : {})
            : {};
        if (flags.gateway !== true) continue;
        if (selfId && areNodeIdsEquivalent(candidateId, selfId)) continue;
        if (targetAlias && areNodeIdsEquivalent(candidateId, targetAlias)) continue;
        for (const wrapper of resolveLocalSocketWrappersForTarget(candidateId)) {
            const peerInstance = normalizeNodeId(wrapper?.peerInstanceId || wrapper?.socketId || wrapper?.peerId);
            if (!peerInstance || seenPeerInstances.has(peerInstance)) continue;
            seenPeerInstances.add(peerInstance);
            out.push(wrapper);
        }
    }
    return out;
};

//
/**
 * Deliver one packet to one or more peers, dialing known endpoints on demand.
 *
 * WHY: most higher-level helpers eventually flow through here, so trace lines
 * from `forward-error`, `forward-skip`, and the populate path all share one
 * delivery contract.
 */
export const populateToOthers = (
    channel: "data" | "message",
    packet: Packet,
    nodes: string[] = ["*"],
    selfId?: string,
    op?: "ask" | "act" | "resolve" | "result" | "error",
    options?: { rejectOnFailure?: boolean }
) => { 
    const promisedArray: Array<Promise<any>> = [];
    const requestedNodes = Array.isArray(nodes)
        ? uniqueNodeIds(nodes.filter((nodeId) => String(nodeId || "").trim().length > 0))
        : ["*"];
    // WHY: active-peer scoping is applied before dialing so ops/debug sessions
    // can temporarily suppress noisy/offline peers without rewriting config.
    const scopedRequestedNodes = filterByActivePeers(requestedNodes);
    const candidateNodes = scopedRequestedNodes.includes("*")
        ? [...Array.from(knownClients.keys()), ...Array.from(nodeMap.keys())]
        : scopedRequestedNodes;
    const rejectOnFailure = options?.rejectOnFailure === true;
    for (const nodeId of uniqueNodeIds(filterByActivePeers(excludeSelf(candidateNodes, selfId))).filter((nodeId) => nodeId && nodeId !== "*")) { 
        const localWrappers = resolveLocalSocketWrappersForTarget(nodeId).filter((entry) => doesWrapperMatchTarget(entry, nodeId));
        const relayWrappers = localWrappers.length > 0 ? [] : resolveLiveGatewayRelayWrappers(nodeId, selfId);
        const dispatchList =
            localWrappers.length > 0
                ? localWrappers
                : relayWrappers.length > 0
                  ? relayWrappers.slice(0, 1)
                  : [findOrInitiateConnection(nodeId, selfId) as SocketWrapper | Promise<SocketWrapper | undefined> | undefined];
        if (packet?.what?.startsWith?.("clipboard:")) {
            const describe = (entry: SocketWrapper | Promise<SocketWrapper | undefined> | undefined) => {
                if (!entry) return "none";
                if (entry instanceof SocketWrapper) {
                    return `socket:${entry.peerId || entry.socketId || entry.peerInstanceId}`;
                }
                if (typeof (entry as any)?.then === "function") {
                    return "promise";
                }
                return typeof entry;
            };
            console.log(
                `[clipboard-debug] populate target=${nodeId} local=${localWrappers.map(describe).join(",") || "-"} ` +
                `relay=${relayWrappers.map(describe).join(",") || "-"} dispatch=${dispatchList.map(describe).join(",") || "-"} ` +
                `from=${selfId || "-"} what=${packet?.what || "-"}`
            );
        }
        for (const entry of dispatchList) {
            const promise = Promise.resolve(entry);
            promisedArray.push(promise.then((socket) => {
                const explicitNodes = Array.isArray(packet?.nodes)
                    ? uniqueNodeIds(packet.nodes)
                    : [];
                const outboundNodes = explicitNodes.length > 0 && !explicitNodes.includes("*")
                    ? uniqueNodeIds([...explicitNodes, nodeId])
                    : uniqueNodeIds([nodeId]);
                const scopedOutboundNodes = filterByActivePeers(outboundNodes);
                const outbound = {
                    ...packet,
                    nodes: scopedOutboundNodes,
                    op: (op ||= packet?.op),
                    byId: packet?.byId || selfId
                } as Packet;
                if (!socket) {
                    if (!rejectOnFailure) {
                        return undefined;
                    }
                    throw new Error(`Unable to connect to node: ${nodeId}`);
                }
                if (relayWrappers.length > 0 && relayWrappers.includes(socket)) {
                    traceSocket("forward-via-gateway", {
                        from: selfId,
                        target: nodeId,
                        relay: socket.peerId || socket.socketId,
                        op: packet?.op,
                        what: packet?.what
                    });
                }
                // `direct()` keeps one resolver chain per outbound UUID, so all
                // ask/result/error diagnostics converge on the same call path.
                return socket.direct(channel, sanitizePacketForWire(outbound));
            })?.catch?.((err) => { 
                if (rejectOnFailure) {
                    traceSocket("forward-error", {
                        from: selfId,
                        target: nodeId,
                        op: packet?.op,
                        what: packet?.what,
                        reason: describeSocketError(err)
                    });
                    throw err;
                }
                traceSocket("forward-skip", {
                    from: selfId,
                    target: nodeId,
                    op: packet?.op,
                    what: packet?.what,
                    reason: describeSocketError(err)
                });
                return undefined;
            }));
        }
    }
    return promisedArray;
}

//
export const excludeSelf = (lists: string[], self: string) => { 
    return (lists || []).filter((node) => !areNodeIdsEquivalent(node, self));
}

const normalizeNodeId = (value: unknown): string => {
    return String(value || "").trim();
};

/** `packet.nodes` often carries the raw engine id; `peerInstanceId` is usually `io-` + id */
const looksLikeSocketEngineSessionId = (raw: unknown): boolean => {
    const t = normalizeNodeId(raw);
    if (!t || t.includes(".") || /^L-/i.test(t)) return false;
    if (/^l-\d{1,3}\.\d/.test(t)) return false;
    const body = t.toLowerCase().startsWith("io-") ? t.slice(3) : t;
    if (!/^[a-zA-Z0-9_-]{8,32}$/.test(body)) return false;
    if (/^[a-z]+(-[a-z]+)+$/i.test(body)) return false;
    return /[0-9]/.test(body) || /[A-Z]/.test(body);
};

const looksLikeRoutingUuid = (raw: unknown): boolean => {
    const t = normalizeNodeId(raw);
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t);
};

//
const getKnownClientConfig = (nodeId: unknown) => {
    const normalized = normalizeNodeId(nodeId);
    if (!normalized) return null;

    const directEntry = knownClients.get(normalized);
    if (directEntry) return directEntry;

    const caseInsensitive = [...knownClients.entries()].find(([candidateId]) => {
        return candidateId.toLowerCase() === normalized.toLowerCase();
    })?.[1];
    if (caseInsensitive) return caseInsensitive;

    // Same host may appear as L-192.168.0.200, l-45.x, bare 192.168.x, or WAN IP — tie to policy via origins.
    const candidateOrigin = formalizeOrigin(normalized);
    let candidateHostLc = "";
    if (candidateOrigin) {
        try {
            candidateHostLc = new URL(candidateOrigin).hostname.toLowerCase();
        } catch {
            candidateHostLc = "";
        }
    }

    const visited = new Set<unknown>();
    for (const [, entry] of knownClients.entries()) {
        if (!entry || typeof entry !== "object" || visited.has(entry)) continue;
        visited.add(entry);
        const origins = Array.isArray((entry as Record<string, unknown>)?.origins)
            ? ((entry as Record<string, unknown>).origins as unknown[])
            : [];
        for (const origin of origins) {
            const normalizedOrigin = formalizeOrigin(String(origin || ""));
            if (!normalizedOrigin) continue;
            if (candidateOrigin && normalizedOrigin === candidateOrigin) {
                return entry;
            }
            if (candidateHostLc) {
                try {
                    if (new URL(normalizedOrigin).hostname.toLowerCase() === candidateHostLc) {
                        return entry;
                    }
                } catch {
                    continue;
                }
            }
        }
    }
    return null;
};

const pickCanonicalKnownClientId = (entry: unknown, fallback?: string): string | null => {
    if (!entry || typeof entry !== "object") {
        return fallback ? normalizeNodeId(fallback) || null : null;
    }
    const matches = [...knownClients.entries()]
        .filter(([, candidateEntry]) => candidateEntry === entry)
        .map(([candidateId]) => normalizeNodeId(candidateId))
        .filter(Boolean);
    if (!matches.length) {
        return fallback ? normalizeNodeId(fallback) || null : null;
    }
    const exactFallback = normalizeNodeId(fallback);
    if (exactFallback) {
        const matchedFallback = matches.find((candidateId) => candidateId.toLowerCase() === exactFallback.toLowerCase());
        if (matchedFallback) return matchedFallback;
    }
    return (
        matches.find((candidateId) => /^[A-Z]-/.test(candidateId)) ||
        matches.find((candidateId) => /^[A-Z]/.test(candidateId)) ||
        matches[0]
    );
};

export const resolveKnownClientId = (candidate: unknown): string | null => {
    const normalized = normalizeNodeId(candidate);
    if (!normalized) return null;
    const entry = getKnownClientConfig(normalized);
    if (!entry) return null;
    return pickCanonicalKnownClientId(entry, normalized);
};

/** Map portable `networkAliases` + knownClients so outbound dial uses the canonical endpointIDs key. */
const resolveDialTargetId = (rawId: string): string | null => {
    const normalized = normalizeNodeId(rawId);
    if (!normalized) return null;
    const directEntry = getKnownClientConfig(normalized);
    if (directEntry) {
        return pickCanonicalKnownClientId(directEntry, normalized) || normalized;
    }
    const snap = readServerV2ConfigSnapshot() as Record<string, unknown>;
    const aliasMap = normalizeNetworkAliasMap(snap.networkAliases || {});
    const mapped = resolveNetworkAlias(aliasMap, normalized.toLowerCase());
    if (!mapped || mapped === normalized.toLowerCase()) return null;
    for (const key of knownClients.keys()) {
        if (!key) continue;
        if (key.toLowerCase() === mapped || normalizeNodeId(key).toLowerCase() === mapped) {
            const entry = knownClients.get(key);
            return entry ? pickCanonicalKnownClientId(entry, key) || key : key;
        }
    }
    return null;
};

const resolveConfiguredForwardNode = (selfId: string): string | null => {
    const selfConfig = getKnownClientConfig(selfId);
    if (!selfConfig?.flags?.gateway) {
        return null;
    }
    const candidates: string[] = [];
    if (Array.isArray(selfConfig?.allowedForwards)) {
        candidates.push(...selfConfig.allowedForwards);
    }
    if (Array.isArray(selfConfig?.forward)) {
        for (const entry of selfConfig.forward) {
            if (typeof entry === "string") {
                candidates.push(entry);
            } else
            if (entry && typeof entry === "object" && typeof (entry as any).id === "string") {
                candidates.push((entry as any).id);
            }
        }
    }
    for (const candidate of candidates) {
        const normalized = normalizeNodeId(candidate);
        if (!normalized || normalized === "self" || areNodeIdsEquivalent(normalized, selfId)) continue;
        if (getKnownClientConfig(normalized)) {
            return normalized;
        }
    }
    return null;
};

//
export const getKnownClientAliases = (nodeId: unknown): string[] => {
    const normalized = normalizeNodeId(nodeId);
    if (!normalized) return [];

    const fallbackEntry = getKnownClientConfig(normalized);

    const aliases = new Set<string>([normalized, normalized.toLowerCase()]);
    if (!fallbackEntry) {
        return Array.from(aliases);
    }

    for (const [candidateId, candidateConfig] of knownClients.entries()) {
        if (candidateConfig === fallbackEntry) {
            const aliasId = normalizeNodeId(candidateId);
            if (!aliasId) continue;
            aliases.add(aliasId);
            aliases.add(aliasId.toLowerCase());
        }
    }

    return Array.from(aliases);
};

const getNodeAliasSignature = (nodeId: unknown): string => {
    return getKnownClientAliases(nodeId)
        .map((alias) => alias.toLowerCase())
        .sort()
        .join("|");
};

export const areNodeIdsEquivalent = (left: unknown, right: unknown): boolean => {
    const leftAliases = new Set(getKnownClientAliases(left));
    if (leftAliases.size === 0) return false;
    for (const alias of getKnownClientAliases(right)) {
        if (leftAliases.has(alias)) {
            return true;
        }
    }
    return false;
};

const filterByActivePeers = (nodes: string[]): string[] => {
    if (!activePeerFilterRaw.length) return nodes;
    const activePeers = activePeerFilterRaw
        .map((entry) => normalizeNodeId(entry))
        .filter(Boolean);
    if (!activePeers.length) return nodes;
    if (nodes.some((nodeId) => String(nodeId || "").trim() === "*")) {
        return activePeers;
    }
    return nodes.filter((nodeId) => activePeers.some((allowed) => areNodeIdsEquivalent(nodeId, allowed)));
};

export const uniqueNodeIds = (nodes: unknown): string[] => {
    if (!Array.isArray(nodes)) return [];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const nodeId of nodes) {
        const normalized = normalizeNodeId(nodeId);
        if (!normalized) continue;
        const signature = getNodeAliasSignature(normalized);
        if (seen.has(signature)) continue;
        seen.add(signature);
        unique.push(normalized);
    }
    return unique;
};

//
export const packetTargetsSelf = (nodes: unknown, selfId: string): boolean => {
    if (!Array.isArray(nodes) || nodes.length === 0) return false;

    for (const nodeId of nodes) {
        if (areNodeIdsEquivalent(nodeId, selfId)) {
            return true;
        }
    }

    return false;
};

const getSocketHandshakeQuery = (socket: SocketConnect | SocketClient): Record<string, unknown> => {
    const query = (socket as any)?.handshake?.query;
    return query && typeof query === "object" ? query : {};
};

/** Socket.IO stores the peer on `handshake.address`, not `socket.address`. */
export const collectNormalizedRemoteIps = (socket: SocketConnect | SocketClient): string[] => {
    const out = new Set<string>();
    const push = (raw: unknown) => {
        const n = normalizeIpForMatch(String(raw || ""));
        if (n) out.add(n);
    };
    const forwarded = String((socket as any)?.handshake?.headers?.["x-forwarded-for"] || "").trim();
    if (forwarded) {
        for (const part of forwarded.split(",")) {
            push(part.trim());
        }
    }
    push((socket as any)?.handshake?.address);
    push((socket as any)?.request?.socket?.remoteAddress);
    push((socket as any)?.conn?.remoteAddress);
    push((socket as any)?.address);
    return Array.from(out);
};

const normalizePolicyOriginToRemoteIps = (origin: unknown): string[] => {
    const raw = String(origin || "").trim();
    if (!raw) return [];
    if (raw.includes("://") || raw.includes("/")) {
        try {
            const normalizedUrl = raw.includes("://") ? raw : `https://${raw}`;
            const hostname = new URL(normalizedUrl).hostname;
            const ip = normalizeIpForMatch(hostname);
            if (ip && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) {
                return [ip];
            }
            return [];
        } catch {
            const fallback = normalizeIpForMatch(raw);
            return fallback ? [fallback] : [];
        }
    }
    const ip = normalizeIpForMatch(raw);
    return ip ? [ip] : [];
};

const resolveHandshakeTokenString = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "object" && value && "token" in (value as Record<string, unknown>)) {
        return String((value as Record<string, unknown>).token ?? "").trim();
    }
    return String(value).trim();
};

const isCanonicalServerV2Peer = (socket: SocketConnect | SocketClient): boolean => {
    const query = getSocketHandshakeQuery(socket);
    const auth = ((socket as any)?.handshake?.auth && typeof (socket as any).handshake.auth === "object")
        ? ((socket as any).handshake.auth as Record<string, unknown>)
        : {};
    const archetype = normalizeNodeId(auth.archetype || query.archetype).toLowerCase();
    if (archetype === "server-v2") return true;
    const connectionType = normalizeNodeId(auth.connectionType || query.connectionType).toLowerCase();
    return connectionType.startsWith("exchanger-");
};

const splitLegacyTargets = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeNodeId(entry)).filter(Boolean);
    }
    const raw = String(value || "").trim();
    if (!raw) return [];
    return raw.split(/[;,]/).map((entry) => normalizeNodeId(entry)).filter(Boolean);
};

/**
 * When the client route only names the gateway, `populate()` drops that id via excludeSelf(serverSelfId)
 * and clipboard fan-out never reaches other LAN peers (e.g. Android). Union `runtime.clipboardPeerTargets`
 * (portable config) and exclude the sender — mirrors the HTTP `/clipboard` fallback in `utils/routes.ts`.
 */
const mergeConfiguredClipboardPeerTargets = (socket: SocketConnect | SocketClient, current: string[]): string[] => {
    if (Array.isArray(current) && current.length > 0) {
        // Respect explicit route targets. Do not fan-out to extra peers when caller already resolved
        // concrete nodes; otherwise clipboard traffic can echo through unrelated nodes.
        return current;
    }
    const snap = readServerV2ConfigSnapshot() as Record<string, unknown>;
    let extra: unknown[] | undefined = Array.isArray(snap.clipboardPeerTargets) ? [...snap.clipboardPeerTargets] : undefined;
    const enableLabFallback = ["1", "true", "yes", "on"].includes(
        String(process.env.CWS_CLIPBOARD_PEER_FALLBACK || "").trim().toLowerCase()
    );
    if (!extra?.length && enableLabFallback) {
        // Same deterministic lab fallback as `resolveSourceEndpointPolicy` (HTTP clipboard relay).
        const ips = collectNormalizedRemoteIps(socket);
        const hintedLc = normalizeNodeId(
            (socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId
        ).toLowerCase();
        const looksLikeLaptop110 = ips.includes("192.168.0.110") || hintedLc === "l-192.168.0.110";
        if (looksLikeLaptop110) {
            extra = ["L-192.168.0.196", "L-192.168.0.208"];
        }
    }
    if (!extra?.length) return current;

    const hinted = normalizeNodeId(
        (socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId
    );
    const senderCanon = hinted ? resolveKnownClientId(hinted) || hinted : "";

    const filtered = extra
        .map((entry: unknown) => normalizeNodeId(entry))
        .filter((id) => id && !(senderCanon && areNodeIdsEquivalent(id, senderCanon)));

    if (!filtered.length) return current;
    return uniqueNodeIds([...current, ...filtered]);
};

const resolveLegacyTargetNodes = (socket: SocketConnect | SocketClient, selfId: string): string[] => {
    const query = getSocketHandshakeQuery(socket);
    const candidates = [
        query.__airpad_route_target,
        query.routeTarget,
        query.target,
        query.targetId,
        query.__airpad_route
    ];

    const resolved: string[] = [];
    for (const candidate of candidates) {
        const parts = splitLegacyTargets(candidate);
        for (const normalized of parts) {
            if (areNodeIdsEquivalent(normalized, selfId)) {
                if (!resolved.some((entry) => areNodeIdsEquivalent(entry, selfId))) {
                    resolved.push(selfId);
                }
                continue;
            }
            // Accept explicit node ids even if the local known-clients map is stale;
            // this keeps clipboard fan-out working for multiple Android targets.
            if (!resolved.some((entry) => areNodeIdsEquivalent(entry, normalized))) {
                resolved.push(normalized);
            }
        }
    }
    const knownOnly = resolved.filter((nodeId) => getKnownClientConfig(nodeId));
    const hasUnknownExplicitTarget = resolved.some((nodeId) => !getKnownClientConfig(nodeId));
    // If any handshake target is not in endpointIDs, keep the full explicit list — otherwise
    // "knownOnly ⊂ resolved" drops LAN peers (e.g. L-192.168.0.110) when only the gateway id was registered.
    let out: string[] =
        resolved.length === 0
            ? []
            : hasUnknownExplicitTarget
              ? uniqueNodeIds(resolved)
              : knownOnly.length > 0
                ? [...knownOnly]
                : [...resolved];

    // Tunnel clients often send __airpad_route = WAN IP or host that aliases to this gateway (L-192.168.0.200).
    // populateToOthers excludes selfId, so "only gateway" collapses to [] and nothing reaches AirPad PC.
    const isTunnelClient =
        String(query.__airpad_endpoint || "").trim() === "0" ||
        String(query.__airpad_via || "").trim().toLowerCase() === "tunnel";
    if (isTunnelClient) {
        out = out.filter((id) => !areNodeIdsEquivalent(id, selfId));
        // Only inject gateway.forward when the route collapsed to "this server" (WAN/LAN IP of gateway).
        const forward = resolveConfiguredForwardNode(selfId);
        if (out.length === 0 && forward) {
            out.push(forward);
            routeLog("tunnel-inject-forward", { selfId, forward, query: { __airpad_via: query.__airpad_via, __airpad_endpoint: query.__airpad_endpoint } });
        }
    }

    out = mergeConfiguredClipboardPeerTargets(socket, out);

    routeLog("resolve-legacy-targets", {
        selfId,
        resolved,
        out,
        isTunnelClient,
        hasUnknownExplicitTarget
    });

    if (out.length > 0) {
        return uniqueNodeIds(out);
    }

    const configuredForward = resolveConfiguredForwardNode(selfId);
    if (configuredForward) {
        return [configuredForward];
    }

    return [selfId];
};

const makeLegacyLocalPacket = (
    socket: SocketConnect | SocketClient,
    selfId: string,
    base: Partial<Packet>
): Packet => {
    const byId = normalizeNodeId((socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId || (socket as any)?.id);
    return {
        op: base.op || "act",
        what: base.what,
        payload: base.payload,
        nodes: Array.isArray(base.nodes) && base.nodes.length > 0 ? base.nodes : resolveLegacyTargetNodes(socket, selfId),
        byId: base.byId || byId || undefined,
        from: base.from || byId || undefined,
        timestamp: base.timestamp || Date.now(),
        ...(base as Packet)
    };
};

const cachePeerInstanceOnly = (
    peerInstanceId: string,
    connection: SocketWrapper | Promise<SocketWrapper | undefined> | undefined
) => {
    const key = normalizeNodeId(peerInstanceId);
    if (!key) return;
    nodeMap.set(key, connection);
};

const unregisterAccountPeersForSocket = (peerInstanceId: string) => {
    const keys = peerAccountKeys.get(peerInstanceId);
    if (!keys) return;
    for (const k of keys) {
        const bucket = accountPeerByAlias.get(k);
        if (!bucket) continue;
        bucket.delete(peerInstanceId);
        if (bucket.size === 0) accountPeerByAlias.delete(k);
    }
    peerAccountKeys.delete(peerInstanceId);
};

const registerAccountPeersForSocket = (peerInstanceId: string, accountAliases: string[]) => {
    unregisterAccountPeersForSocket(peerInstanceId);
    const keyBucket = new Set<string>();
    peerAccountKeys.set(peerInstanceId, keyBucket);
    const seen = new Set<string>();
    for (const alias of accountAliases) {
        const k = normalizeNodeId(alias).toLowerCase();
        if (!k || seen.has(k)) continue;
        seen.add(k);
        keyBucket.add(k);
        if (!accountPeerByAlias.has(k)) accountPeerByAlias.set(k, new Set());
        accountPeerByAlias.get(k)!.add(peerInstanceId);
    }
};

export const resolveLocalSocketWrappersForTarget = (
    targetId: string
): Array<SocketWrapper | Promise<SocketWrapper | undefined> | undefined> => {
    const out: Array<SocketWrapper | Promise<SocketWrapper | undefined> | undefined> = [];
    for (const alias of getKnownClientAliases(targetId)) {
        const cached = nodeMap.get(alias);
        if (cached) {
            // Fast path: policy ids and alias ids should collapse onto one live wrapper.
            out.push(cached);
            return out;
        }
    }
    const direct = nodeMap.get(targetId);
    if (direct) {
        out.push(direct);
        return out;
    }
    const tid = normalizeNodeId(targetId);
    if (tid && !/^io-/i.test(tid) && looksLikeSocketEngineSessionId(tid)) {
        const ioPrefixed = nodeMap.get(`io-${tid}`);
        if (ioPrefixed) {
            out.push(ioPrefixed);
            return out;
        }
    }
    const peerIds = new Set<string>();
    const token = normalizeNodeId(targetId).toLowerCase();
    const fromDirect = accountPeerByAlias.get(token);
    if (fromDirect) {
        for (const pid of fromDirect) peerIds.add(pid);
    }
    for (const alias of getKnownClientAliases(targetId)) {
        const bucket = accountPeerByAlias.get(normalizeNodeId(alias).toLowerCase());
        if (bucket) {
            for (const pid of bucket) peerIds.add(pid);
        }
    }
    for (const pid of peerIds) {
        const cached = nodeMap.get(pid);
        if (cached) out.push(cached);
    }
    return out;
};

const doesWrapperMatchTarget = (
    entry: SocketWrapper | Promise<SocketWrapper | undefined> | undefined,
    targetId: string
): boolean => {
    if (!(entry instanceof SocketWrapper)) {
        return true;
    }
    const peerInstance = normalizeNodeId(entry.peerInstanceId || entry.socketId);
    if (peerInstance && socketMatchesRoutingTarget(peerInstance, targetId)) {
        return true;
    }
    const peerId = normalizeNodeId(entry.peerId || entry.socketId);
    return !!peerId && areNodeIdsEquivalent(peerId, targetId);
};

export const socketMatchesRoutingTarget = (peerInstanceId: string, targetId: string): boolean => {
    if (areNodeIdsEquivalent(peerInstanceId, targetId)) return true;
    const t = normalizeNodeId(targetId).toLowerCase();
    if (normalizeNodeId(peerInstanceId).toLowerCase() === t) return true;
    if (accountPeerByAlias.get(t)?.has(peerInstanceId)) return true;
    for (const alias of getKnownClientAliases(targetId)) {
        if (accountPeerByAlias.get(normalizeNodeId(alias).toLowerCase())?.has(peerInstanceId)) return true;
    }
    return false;
};

export const resolveKnownClientIdForPeerInstance = (peerInstanceId: string): string | null => {
    const direct = resolveKnownClientId(peerInstanceId);
    if (direct) return direct;
    const keys = peerAccountKeys.get(normalizeNodeId(peerInstanceId));
    if (!keys || keys.size === 0) return null;
    for (const key of keys) {
        const canonical = resolveKnownClientId(key);
        if (canonical) return canonical;
    }
    for (const key of keys) {
        if (knownClients.has(key)) return key;
    }
    return null;
};

const resolvePeerInstanceIdFromSocket = (socket: SocketConnect | SocketClient): string => {
    const q = getSocketHandshakeQuery(socket);
    const raw = normalizeNodeId(q.peerInstanceId || q.deviceInstanceId || q.sessionPeerId);
    if (raw) {
        const wired = normalizeWireNodeId(raw);
        return wired || raw;
    }
    const sid = normalizeNodeId((socket as any)?.id);
    if (sid) return `io-${sid}`;
    return `io-${UUIDv4()}`;
};

const cacheNodeConnection = (
    nodeId: string,
    connection: SocketWrapper | Promise<SocketWrapper | undefined> | undefined
) => {
    for (const alias of getKnownClientAliases(nodeId)) {
        nodeMap.set(alias, connection);
    }
};

const deleteCachedNodeConnection = (...nodeIds: Array<string | undefined>) => {
    for (const nodeId of nodeIds) {
        const normalized = normalizeNodeId(nodeId);
        if (!normalized) continue;
        if (peerAccountKeys.has(normalized)) {
            unregisterAccountPeersForSocket(normalized);
        }
        for (const alias of getKnownClientAliases(nodeId)) {
            nodeMap.delete(alias);
        }
    }
};

const markFailedNodeConnection = (nodeId: string, retryMs: number = FAILED_NODE_RETRY_MS) => {
    const retryAt = Date.now() + Math.max(1000, retryMs);
    for (const alias of getKnownClientAliases(nodeId)) {
        failedNodeRetryAt.set(alias, retryAt);
    }
};

const clearFailedNodeConnection = (...nodeIds: Array<string | undefined>) => {
    for (const nodeId of nodeIds) {
        for (const alias of getKnownClientAliases(nodeId)) {
            failedNodeRetryAt.delete(alias);
        }
    }
};

const getFailedNodeRetryDelay = (nodeId: string): number => {
    let maxRetryAt = 0;
    for (const alias of getKnownClientAliases(nodeId)) {
        const retryAt = failedNodeRetryAt.get(alias) || 0;
        if (retryAt > maxRetryAt) {
            maxRetryAt = retryAt;
        }
    }
    if (!maxRetryAt) {
        return 0;
    }
    const delay = maxRetryAt - Date.now();
    if (delay <= 0) {
        clearFailedNodeConnection(nodeId);
        return 0;
    }
    return delay;
};

//
/**
 * One connected peer plus its routing state, dedupe caches, request resolvers,
 * and helpers for emitting hello/ask/act/result/error frames.
 */
export class SocketWrapper {
    public selfId: string;
    public socket: SocketConnect | SocketClient;
    public socketId: string;
    public peerId: string;
    /** Unique Socket.IO routing id (per device); avoids collisions when clientId matches across AirPad/Android. */
    public peerInstanceId: string;
    private accountRoutingHints = new Set<string>();
    public isConnected: boolean = false;
    public messages = new Map<string, any>();
    public resolvers = new Map<string, {
        promise: Promise<any>,
        resolve: (result: any) => void,
        reject: (result: any) => void
    }>();
    public token: string;
    public origin: string;

    // guardian from duplicated messages (which may be caused by network latency)
    // saves every for 10 seconds after handled first one
    public acceptedUUIDs: Set<string> = new Set();
    public recentReplyFingerprints = new Map<string, number>();
    public recentClipboardFingerprints = new Map<string, number>();
    private lastOutboundResolverUuid: string | null = null;

    shouldSuppressDuplicateReply(packet: Packet) {
        const uuid = normalizeNodeId(packet?.uuid);
        const op = normalizeNodeId(packet?.op);
        if (!uuid || !["resolve", "result", "error"].includes(op)) {
            return false;
        }
        const fingerprint = [
            op,
            normalizeNodeId(packet?.what),
            uuid,
            normalizeNodeId(packet?.byId || packet?.from)
        ].join("|");
        const now = Date.now();
        for (const [key, seenAt] of this.recentReplyFingerprints.entries()) {
            if (now - seenAt > 2000) {
                this.recentReplyFingerprints.delete(key);
            }
        }
        const lastSeenAt = this.recentReplyFingerprints.get(fingerprint);
        this.recentReplyFingerprints.set(fingerprint, now);
        return typeof lastSeenAt === "number" && now - lastSeenAt < 2000;
    }

    shouldSuppressDuplicateClipboardUpdate(senderId: string, text: string) {
        const fingerprint = `${normalizeNodeId(senderId) || "unknown"}|${text}`;
        const now = Date.now();
        for (const [key, seenAt] of this.recentClipboardFingerprints.entries()) {
            if (now - seenAt > CLIPBOARD_DEDUP_WINDOW_MS) {
                this.recentClipboardFingerprints.delete(key);
            }
        }
        const lastSeenAt = this.recentClipboardFingerprints.get(fingerprint);
        this.recentClipboardFingerprints.set(fingerprint, now);
        return typeof lastSeenAt === "number" && now - lastSeenAt < CLIPBOARD_DEDUP_WINDOW_MS;
    }

    rememberPeerId(candidate?: unknown) {
        const peerInstance = this.peerInstanceId || resolvePeerInstanceIdFromSocket(this.socket);
        this.peerInstanceId = peerInstance;
        this.socketId = peerInstance;
        internalNodeMap.set(peerInstance, this.socket);
        cachePeerInstanceOnly(peerInstance, this);
        const rawEngineId = normalizeNodeId((this.socket as any)?.id);
        if (rawEngineId) {
            if (peerInstance !== rawEngineId) {
                cachePeerInstanceOnly(rawEngineId, this);
            }
            const ioEngine = `io-${rawEngineId}`;
            if (peerInstance !== ioEngine) {
                cachePeerInstanceOnly(ioEngine, this);
            }
        }
        const cand = normalizeNodeId(candidate);
        const handshakeClient = normalizeNodeId(
            (this.socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(this.socket).clientId
        );
        if (cand) this.accountRoutingHints.add(cand);
        if (handshakeClient) this.accountRoutingHints.add(handshakeClient);
        const expanded: string[] = [];
        for (const h of this.accountRoutingHints) {
            expanded.push(...getKnownClientAliases(h));
        }
        registerAccountPeersForSocket(peerInstance, expanded);
        const preferredPeerId =
            resolveKnownClientId(cand) ||
            resolveKnownClientId(handshakeClient) ||
            resolveKnownClientIdForPeerInstance(peerInstance) ||
            cand ||
            handshakeClient ||
            peerInstance;
        this.peerId = preferredPeerId;
        // Ensure `nodeMap` resolves policy ids (e.g. `L-192.168.0.196`) to this live socket, not only
        // peerInstance / accountPeerByAlias — avoids intermittent fan-out misses when routing by endpoint key.
        try {
            const canonFromPeer = resolveKnownClientIdForPeerInstance(peerInstance);
            if (canonFromPeer) {
                cacheNodeConnection(canonFromPeer, this);
            }
            for (const hint of this.accountRoutingHints) {
                const rid = resolveKnownClientId(hint);
                if (rid) {
                    cacheNodeConnection(rid, this);
                }
            }
        } catch {
            /* ignore cache failures */
        }
        return peerInstance;
    }

    //
    populate(channel: "data" | "message", packet: Packet, op?: "ask" | "act" | "resolve" | "result" | "error") {
        return populateToOthers(channel, { op: op || packet?.op || "ask", ...packet }, uniqueNodeIds(excludeSelf([this.socketId, this.peerId, ...packet?.nodes], this.selfId)), this.selfId, op);
    }

    //
    /**
     * Send the canonical token/identity probe to a peer.
     *
     * NOTE: this is often the first frame after connect and is one of the key
     * places to inspect when peers connect but never become routable.
     */
    async hello(directly: boolean = false) {
        const targetNode = this.peerId || this.socketId || "*";
        const packet = {
            op: "ask",
            byId: this.selfId,
            from: this.selfId,
            token: this.token || undefined,
            uuid: UUIDv4(), nodes: uniqueNodeIds([targetNode, this.socketId, this.peerId]),
            what: "token", payload: {},
            timestamp: Date.now()
        } as Packet;

        // NOTE: direct hello is used when we already know the exact socket to
        // probe; populated hello uses the broader routing layer/caches instead.
        if (directly) {
            this.socket.emit("data", sanitizePacketForWire(packet));
        } else {
            populateToOthers("data", { op: "ask", ...packet }, excludeSelf(packet?.nodes, this.selfId), this.selfId, "ask");
        }
        this.token = packet?.result?.token ?? "";
        this.origin = formalizeSocketVisibleOrigin(this.socket) || this.origin || "";
        return this.token;
    }

    private buildReplyNodes(packet: Packet): string[] {
        const directReplyTargets = uniqueNodeIds(
            excludeSelf([packet.byId, packet.from, packet.sender], this.selfId)
        ).filter((nodeId) => nodeId !== "*");
        if (directReplyTargets.length > 0) {
            return directReplyTargets;
        }
        return uniqueNodeIds(
            excludeSelf(Array.isArray(packet.nodes) ? packet.nodes : [], this.selfId)
        ).filter((nodeId) => nodeId !== "*");
    }

    encodeAnswer(result: any, packet: Packet): Packet { 
        return {
            op: "resolve",
            what: packet.what,
            byId: this.selfId,
            uuid: packet.uuid,
            nodes: this.buildReplyNodes(packet),
            result: this.packPayload(result),
            timestamp: Date.now()
        }
    }

    encodeReport(result: any, packet: Packet): Packet { 
        return {
            op: "result",
            what: packet.what,
            byId: this.selfId,
            uuid: packet.uuid,
            nodes: this.buildReplyNodes(packet),
            result: this.packPayload(result),
            timestamp: Date.now()
        }
    }

    direct(channel: "data" | "message" | Packet, packet?: Packet) { 
        if (typeof channel != "string" || packet == null) {
            packet = channel as Packet;channel = "data";
        }
        const uuid = packet.uuid ?? UUIDv4();
        const outbound = {
            ...(packet as Packet),
            uuid
        } as Packet;
        this.lastOutboundResolverUuid = uuid;
        this.socket?.emit?.(channel, sanitizePacketForWire(outbound));
        // WHY: even fire-and-forget sends share the same post-handler map so a
        // later resolve/result/error can still be correlated if it arrives.
        // @ts-ignore
        return this.resolvers?.getOrInsertComputed?.(uuid, () => { return makePostHandler(outbound.op, outbound.what, outbound.payload) })?.promise;
    }

    handleAsk(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAsk(what, payload, packet, selfId);
    }

    handleAct(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAct(what, payload, packet, selfId);
    }

    reply(packet: Packet) {
        this.populate("data", packet as Packet);
        if (process.env.CWS_REPLY_DUAL_CHANNEL === "1") {
            this.populate("message", packet as Packet);
        }
        return packet;
    }

    private async awaitForwardAck(forwarded: Array<Promise<any>>): Promise<any> {
        const timeoutMs = Math.max(
            1000,
            Number(process.env.CWS_FORWARD_ACK_TIMEOUT_MS || 9000) || 9000
        );
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`forward-ack-timeout:${timeoutMs}`)), timeoutMs);
        });
        const settled = await Promise.race([
            Promise.allSettled(forwarded),
            timeoutPromise
        ]);
        if (!Array.isArray(settled)) {
            throw new Error("forward-ack-timeout");
        }
        const fulfilled = settled.find(
            (entry): entry is PromiseFulfilledResult<any> => entry.status === "fulfilled"
        );
        if (fulfilled) return fulfilled.value;
        const failures = settled
            .filter((entry): entry is PromiseRejectedResult => entry.status === "rejected")
            .map((entry) => entry.reason);
        throw new AggregateError(failures, "forward-all-rejected");
    }
    
    doAsk(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, makePostHandler("ask", what, payload));
        const directNodes = uniqueNodeIds(nodes?.length ? nodes : [this.peerId || this.socketId]).filter(Boolean);
        this.socket.emit("data", sanitizePacketForWire({
            uuid,
            nodes: directNodes,
            op: "ask",
            what,
            payload: this.packPayload(payload),
            byId: this.selfId,
            from: this.selfId,
            token: this.token || undefined,
            timestamp: Date.now()
        } as Packet));
        return this.resolvers.get(uuid).promise;
    }

    doAct(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, makePostHandler("act", what, payload));
        const directNodes = uniqueNodeIds(nodes?.length ? nodes : [this.peerId || this.socketId]).filter(Boolean);
        this.socket.emit("data", sanitizePacketForWire({
            uuid,
            nodes: directNodes,
            op: "act",
            what,
            payload: this.packPayload(payload),
            byId: this.selfId,
            from: this.selfId,
            token: this.token || undefined,
            timestamp: Date.now()
        } as Packet));
        return this.resolvers.get(uuid).promise;
    }

    unpackPayload(payload: any) {
        return payload;
    }

    packPayload(payload: any) {
        return payload;
    }

    // If connection is not established, remove socket quickly so reconnect
    // can recover without waiting for long stale timers.
    removeSocket() { 
        setTimeout(() => {
            if (!this.isConnected) {
                this.socket.disconnect();
                socketWrapper.delete(this.socket);
                const pid = this.peerInstanceId || this.socketId;
                internalNodeMap.delete(pid);
                deleteCachedNodeConnection(pid);
            }
        }, 1000);
    }

    //
    constructor(socket: SocketConnect | SocketClient, selfId: string, token: string) { 
        this.selfId = selfId;
        this.token = token;
        this.origin = formalizeSocketVisibleOrigin(socket);
        this.socket = socket;
        this.peerInstanceId = resolvePeerInstanceIdFromSocket(socket);
        this.socketId = this.peerInstanceId;
        this.peerId = this.peerInstanceId;
        socketWrapper.set(socket, this);

        const handlePacket = async (packet: Packet) => {
            const normalizeRuntimeOp = (value: unknown): "ask" | "act" | "result" | "error" => {
                const op = String(value || "").trim().toLowerCase();
                if (op === "request") return "ask";
                if (op === "response" || op === "resolve" || op === "result") return "result";
                if (op === "notify" || op === "signal" || op === "redirect") return "act";
                if (op === "error") return "error";
                if (op === "ask" || op === "act") return op;
                return "act";
            };
            const resolvePacketResultPayload = (entry: Packet): unknown => {
                if (entry?.result !== undefined) return entry.result;
                if ((entry as any)?.results !== undefined) return (entry as any).results;
                if (entry?.payload !== undefined) return entry.payload;
                if ((entry as any)?.data !== undefined) return (entry as any).data;
                if ((entry as any)?.body !== undefined) return (entry as any).body;
                return undefined;
            };
            const packetSourceHint = normalizeNodeId(packet?.byId || packet?.from);
            const handshakeClientId = normalizeNodeId(
                (this.socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(this.socket).clientId
            );
            const currentPeerInstance = normalizeNodeId(this.peerInstanceId || this.socketId);
            const currentPeerId = normalizeNodeId(this.peerId);
            const canRefreshPeerIdentity =
                !currentPeerId ||
                !packetSourceHint ||
                areNodeIdsEquivalent(packetSourceHint, currentPeerId) ||
                areNodeIdsEquivalent(packetSourceHint, currentPeerInstance) ||
                (handshakeClientId && areNodeIdsEquivalent(packetSourceHint, handshakeClientId));
            if (canRefreshPeerIdentity) {
                this.rememberPeerId(packetSourceHint || this.socketId || this.peerId);
            }
            const payload = this.unpackPayload(packet?.payload);
            const uuid = packet?.uuid;
            const runtimeOp = normalizeRuntimeOp(packet?.op);
            const isTokenHandshake = runtimeOp === "ask" && (packet?.what || "") === "token";
            const targetsSelf = isTokenHandshake || packetTargetsSelf(packet?.nodes, this.selfId);
            traceSocket("packet-in", {
                local: this.selfId,
                peer: this.peerId || this.socketId,
                byId: packet?.byId || this.socketId || this.peerId,
                from: packet?.from || this.socketId || this.peerId,
                op: packet?.op || "ask",
                what: packet?.what,
                nodes: uniqueNodeIds([packet?.byId || this.socketId || this.peerId, ...packet?.nodes, this.socketId, this.peerId]),
                uuid
            });
            if (uuid && this.resolvers.has(uuid) && (runtimeOp === "result" || runtimeOp === "error")) {
                const isErrorReply = runtimeOp === "error" || packet?.error !== undefined;
                if (isErrorReply) {
                    this.resolvers.get(uuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                } else {
                    this.resolvers.get(uuid)?.resolve?.(this.unpackPayload(resolvePacketResultPayload(packet)));
                }
                this.resolvers.delete(uuid);
                if (this.lastOutboundResolverUuid === uuid) {
                    this.lastOutboundResolverUuid = null;
                }
                return;
            }
            if (!uuid && (runtimeOp === "result" || runtimeOp === "error") && this.resolvers.size > 0) {
                const fallbackUuid = (
                    (this.lastOutboundResolverUuid && this.resolvers.has(this.lastOutboundResolverUuid))
                        ? this.lastOutboundResolverUuid
                        : this.resolvers.keys().next().value
                ) as string | undefined;
                if (fallbackUuid && this.resolvers.has(fallbackUuid)) {
                    const isErrorReply = runtimeOp === "error" || packet?.error !== undefined;
                    if (isErrorReply) {
                        this.resolvers.get(fallbackUuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                    } else {
                        this.resolvers.get(fallbackUuid)?.resolve?.(this.unpackPayload(resolvePacketResultPayload(packet)));
                    }
                    this.resolvers.delete(fallbackUuid);
                    if (this.lastOutboundResolverUuid === fallbackUuid) {
                        this.lastOutboundResolverUuid = null;
                    }
                    return;
                }
            }
            const shouldRejectForwarded = !targetsSelf && uuid && ["ask", "act"].includes(runtimeOp);
            const forwarded = isTokenHandshake
                ? []
                : populateToOthers("data", packet, excludeSelf(packet?.nodes, this.selfId), this.selfId, runtimeOp, {
                    rejectOnFailure: shouldRejectForwarded
                });
            if (packet?.what?.startsWith?.("clipboard:")) {
                console.log(
                    `[clipboard-debug] packet local=${this.selfId} peer=${this.peerId || this.socketId} ` +
                    `byId=${packet?.byId || "-"} from=${packet?.from || "-"} op=${runtimeOp} ` +
                    `what=${packet?.what || "-"} nodes=${(Array.isArray(packet?.nodes) ? packet.nodes.join(",") : "") || "-"} ` +
                    `targetSelf=${targetsSelf} forwarded=${forwarded.length}`
                );
            }
            traceSocket("route-decision", {
                local: this.selfId,
                peer: this.peerId || this.socketId,
                byId: packet?.byId || this.socketId || this.peerId,
                op: packet?.op,
                what: packet?.what,
                nodes: uniqueNodeIds([...packet?.nodes, this.socketId, this.peerId]),
                targetSelf: targetsSelf,
                forwards: forwarded.length
            });
            if (!targetsSelf && uuid && ["ask", "act"].includes(runtimeOp) && forwarded.length > 0) {
                try {
                    const result = await this.awaitForwardAck(forwarded);
                    this.reply(runtimeOp === "ask" ? this.encodeAnswer(result, packet) : this.encodeReport(result, packet));
                } catch (error) {
                    const details = error instanceof AggregateError
                        ? error.errors?.map?.((entry) => entry instanceof Error ? { message: entry.message, stack: entry.stack } : entry)
                        : (error instanceof Error ? { message: error.message, stack: error.stack } : error);
                    this.reply({
                        op: "error",
                        what: packet.what,
                        byId: this.selfId,
                        uuid: packet.uuid,
                        nodes: [packet.byId],
                        error: this.packPayload(details),
                        timestamp: Date.now()
                    } as Packet);
                }
                return;
            }
            if (!targetsSelf && uuid && ["ask", "act"].includes(runtimeOp) && forwarded.length === 0) {
                this.reply({
                    op: "error",
                    what: packet.what,
                    byId: this.selfId,
                    uuid: packet.uuid,
                    nodes: [packet.byId],
                    error: this.packPayload({
                        ok: false,
                        reason: "no-forward-path",
                        local: this.selfId,
                        nodes: packet.nodes || [],
                        byId: packet.byId || "",
                        from: packet.from || "",
                    }),
                    timestamp: Date.now()
                } as Packet);
                return;
            }
            if (forwarded.length > 0) {
                void Promise.allSettled(forwarded);
            }
            if (targetsSelf) {
                if (uuid) {
                    if (this.acceptedUUIDs.has(uuid)) { return; }
                    this.acceptedUUIDs.add(uuid);
                    setTimeout(() => { this.acceptedUUIDs.delete(uuid); }, 10000);
                }
                
                if (runtimeOp === "ask") {
                    const result = await this.handleAsk(packet?.what, payload, packet, this.selfId);
                    this.reply(this.encodeAnswer(result, packet));
                } else
                if (runtimeOp === "act") { 
                    const result = await this.handleAct(packet?.what, payload, packet, this.selfId);
                    this.reply(this.encodeReport(result, packet));
                } else
                if (uuid && (runtimeOp === "result" || runtimeOp === "error")) {
                    const isErrorReply = runtimeOp === "error" || packet?.error !== undefined;
                    if (isErrorReply) {
                        this.resolvers?.get(uuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                    } else {
                        this.resolvers?.get(uuid)?.resolve?.(this.unpackPayload(resolvePacketResultPayload(packet)));
                    }
                    this.resolvers?.delete?.(uuid);
                }
            }
        };
        let clipboardWatchTimer: ReturnType<typeof setInterval> | null = null;
        let clipboardWatchBusy = false;
        let lastObservedClipboardText: string | null = null;
        let suppressClipboardWatchUntil = 0;
        const clipboardWatchIntervalMs = Math.max(
            300,
            Number(process.env.CWS_CLIPBOARD_WATCH_INTERVAL_MS || 900) || 900
        );

        const stopClipboardWatch = () => {
            if (clipboardWatchTimer) {
                clearInterval(clipboardWatchTimer);
                clipboardWatchTimer = null;
            }
        };

        //
        socket.on("disconnect", () => {
            stopClipboardWatch();
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("connect", async () => {
            const expectedPeerId = normalizeNodeId((socket as any)?.__cwsExpectedPeerId);
            this.rememberPeerId((expectedPeerId || await identifyNodeIdFromIncomingConnection(socket, {})) as string);
            this.isConnected = true;
            traceSocket("transport-connect", {
                local: this.selfId,
                peer: this.peerId || this.socketId,
                origin: this.origin
            });
        });

        //
        socket.on("error", (err) => {
            console.error(err);
            stopClipboardWatch();
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("close", () => {
            stopClipboardWatch();
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("reconnect", async () => {
            this.isConnected = false;
            const expectedPeerId = normalizeNodeId((socket as any)?.__cwsExpectedPeerId);
            this.rememberPeerId((expectedPeerId || await identifyNodeIdFromIncomingConnection(socket, {})) as string);
            this.isConnected = true;
            traceSocket("transport-reconnect", {
                local: this.selfId,
                peer: this.peerId || this.socketId,
                origin: this.origin
            });
        });



        // TODO! needs unified function
        const makeHelloMsgHandler = () => {
            
        }

        // hello v2
        socket.on("data", async (packetRaw: unknown) => { 
            const packet = normalizeInboundPacket(packetRaw);
            if (!packet) return;
            if (packet?.op == "resolve" && packet?.what == "token") {
                this.token = packet?.result?.token ?? "";
                this.origin = formalizeSocketVisibleOrigin(socket) || this.origin || "";
                this.rememberPeerId(packet?.byId || await identifyNodeIdFromIncomingConnection(socket, packet) as string);
                this.isConnected = true;
            }
        });

        // hello v1
        socket.on("hello", (data: any) => {
            const hintedId = normalizeNodeId(data?.id || (socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId);
            if (hintedId) {
                this.rememberPeerId(data?.byId || hintedId);
            }
            traceSocket("hello", {
                local: this.selfId,
                peer: this.peerId || this.socketId,
                hinted: hintedId,
                byId: data?.byId,
                from: data?.from,
                nodes: data?.nodes
            });
            socket.emit("hello-ack", {
                id: hintedId || this.socketId || this.selfId,
                status: "connected"
            });
        });


        //
        // Legacy clipboard socket events.
        // Keep them compatible with `runtime/endpoint/server/airpad/socket-airpad.ts`:
        // - clipboard:get/copy/cut respond with `clipboard:update`
        // - clipboard:update/paste write local clipboard, then forward coordinator packets
        const readLocalClipboardText = async (): Promise<string> => {
            const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:get", payload: {} });
            const text = await this.handleAct("clipboard:get", {}, packet, this.selfId);
            return typeof text === "string" ? text : String(text ?? "");
        };

        const startClipboardWatch = () => {
            if (isCanonicalServerV2Peer(socket)) {
                stopClipboardWatch();
                return;
            }
            const targets = resolveLegacyTargetNodes(socket, this.selfId).filter((target) => !areNodeIdsEquivalent(target, this.selfId));
            if (targets.length === 0) {
                stopClipboardWatch();
                return;
            }
            stopClipboardWatch();
            clipboardWatchTimer = setInterval(async () => {
                if (!this.isConnected || clipboardWatchBusy) return;
                clipboardWatchBusy = true;
                try {
                    const text = await readLocalClipboardText();
                    if (!text && text !== "") return;
                    if (Date.now() < suppressClipboardWatchUntil) return;
                    if (lastObservedClipboardText === text) return;
                    lastObservedClipboardText = text;
                    socket.emit("clipboard:update", { text, source: "watch" });
                    const packet = makeLegacyLocalPacket(socket, this.selfId, {
                        what: "clipboard:update",
                        payload: { text },
                        nodes: targets
                    });
                    void this.reply(packet);
                } catch {
                    // keep loop alive on transient clipboard read failures
                } finally {
                    clipboardWatchBusy = false;
                }
            }, clipboardWatchIntervalMs);
        };

        const tapCtrlKey = async (key: string): Promise<void> => {
            const payload = { key, modifier: ["control"] };
            const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "keyboard:tap", payload });
            await this.handleAct("keyboard:tap", payload, packet, this.selfId);
        };

        //
        const makePacketHandler = () => { 
            return (packetRaw: unknown) => {
                const packet = normalizeInboundPacket(packetRaw);
                if (!packet) return;
                if ((!packet.nodes || packet.nodes.length === 0) && ["ask", "act"].includes(packet.op || "")) {
                    packet.nodes = resolveLegacyTargetNodes(socket, this.selfId);
                    packet.byId ||= normalizeNodeId((socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId || (socket as any)?.id) || undefined;
                    packet.from ||= packet.byId;
                    packet.timestamp ||= Date.now();
                }
                if (this.shouldSuppressDuplicateReply(packet)) {
                    traceSocket("packet-duplicate-suppressed", {
                        local: this.selfId,
                        peer: this.peerId || this.socketId,
                        byId: packet?.byId,
                        op: packet?.op,
                        what: packet?.what,
                        uuid: packet?.uuid
                    });
                    return;
                }
                traceSocket("packet-normalized", {
                    local: this.selfId,
                    peer: this.peerId || this.socketId,
                    byId: packet?.byId,
                    from: packet?.from,
                    op: packet?.op,
                    what: packet?.what,
                    nodes: packet?.nodes
                });
                // Keep transport context available to local handlers without
                // serializing the live socket object back through Socket.IO.
                Object.defineProperty(packet, "__socket", {
                    value: socket,
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                void handlePacket(packet);
            }
        }
        
        //
        socket.on("clipboard:get", async (ack?: any) => {
            try {
                const text = await readLocalClipboardText();
                const payload = { ok: true, text };
                if (typeof ack === "function") ack(payload);
                socket.emit("clipboard:update", { text, source: "local" });
            } catch (error: any) {
                if (typeof ack === "function") {
                    ack({ ok: false, error: error?.message || String(error) });
                }
            }
        });

        socket.on("clipboard:copy", async (ack?: any) => {
            try {
                await tapCtrlKey("c");
                await new Promise((resolve) => setTimeout(resolve, 60));
                const text = await readLocalClipboardText();
                const payload = { ok: true, text };
                if (typeof ack === "function") ack(payload);
                socket.emit("clipboard:update", { text, source: "local" });

                // Forward the resulting clipboard update to the targeted node(s).
                const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:update", payload: { text } });
                void this.reply(packet);
            } catch (error: any) {
                if (typeof ack === "function") {
                    ack({ ok: false, error: error?.message || String(error) });
                }
            }
        });

        socket.on("clipboard:cut", async (ack?: any) => {
            try {
                await tapCtrlKey("x");
                await new Promise((resolve) => setTimeout(resolve, 60));
                const text = await readLocalClipboardText();
                const payload = { ok: true, text };
                if (typeof ack === "function") ack(payload);
                socket.emit("clipboard:update", { text, source: "local" });

                const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:update", payload: { text } });
                void this.reply(packet);
            } catch (error: any) {
                if (typeof ack === "function") {
                    ack({ ok: false, error: error?.message || String(error) });
                }
            }
        });

        socket.on("clipboard:update", async (data: any, ack?: any) => {
            try {
                const text = normalizeClipboardEventText(data);
                const allowEmpty = data?.allowEmpty === true || String(data?.op || "").trim().toLowerCase() === "clipboard:clear";
                if ((text === undefined || (text === "" && !allowEmpty))) {
                    if (typeof ack === "function") ack({ ok: true, skipped: "clipboard-nontext" });
                    return;
                }
                const senderId = normalizeNodeId(
                    data?.byId ||
                    data?.from ||
                    (socket as any)?.handshake?.auth?.clientId ||
                    getSocketHandshakeQuery(socket).clientId ||
                    this.peerId ||
                    this.socketId
                );
                if (this.shouldSuppressDuplicateClipboardUpdate(senderId, text)) {
                    if (typeof ack === "function") ack({ ok: true, skipped: "clipboard-duplicate-window" });
                    return;
                }
                lastObservedClipboardText = text;
                suppressClipboardWatchUntil = Date.now() + clipboardWatchIntervalMs * 2;
                const targets = resolveLegacyTargetNodes(socket, this.selfId).filter((target) =>
                    !areNodeIdsEquivalent(target, this.selfId) &&
                    !(senderId && areNodeIdsEquivalent(target, senderId))
                );
                const packet = makeLegacyLocalPacket(socket, this.selfId, {
                    what: "clipboard:update",
                    payload: { text },
                    nodes: targets
                });
                // Fan-out first: `handleAct` writes the **server** clipboard (clipboardy / headless) and must not
                // block delivery to `L-*` peers when that I/O is slow, stalls, or throws.
                if (targets.length > 0) {
                    void this.reply(packet);
                }
                void Promise.resolve(this.handleAct("clipboard:update", { text }, packet, this.selfId)).catch((err) => {
                    console.warn("[clipboard:update] server local clipboard write failed (non-fatal):", err);
                });
                if (typeof ack === "function") ack({ ok: true });
            } catch (error: any) {
                if (typeof ack === "function") {
                    ack({ ok: false, error: error?.message || String(error) });
                }
            }
        });

        socket.on("clipboard:paste", async (data: any, ack?: any) => {
            try {
                const text = typeof data?.text === "string" ? data.text : String(data?.text ?? "");
                lastObservedClipboardText = text;
                suppressClipboardWatchUntil = Date.now() + clipboardWatchIntervalMs * 2;
                const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:update", payload: { text } });
                void this.reply(packet);
                void Promise.resolve(this.handleAct("clipboard:update", { text }, packet, this.selfId)).catch((err) => {
                    console.warn("[clipboard:paste] server local clipboard write failed (non-fatal):", err);
                });
                socket.emit("clipboard:update", { text, source: "local" });

                // Best-effort: paste the clipboard content via Ctrl+V.
                await new Promise((resolve) => setTimeout(resolve, 20));
                await tapCtrlKey("v");

                if (typeof ack === "function") ack({ ok: true });
            } catch (error: any) {
                if (typeof ack === "function") {
                    ack({ ok: false, error: error?.message || String(error) });
                }
            }
        });

        //
        socket.on("data", makePacketHandler());
        socket.on("message", makePacketHandler());
        socket.on("connect", startClipboardWatch);
        socket.on("reconnect", startClipboardWatch);
        startClipboardWatch();
    }
}

//
/** Seed the known-client registry from config so runtime routing can resolve policy ids and aliases. */
export const loadFromClientsConfig = (clientsData: Record<string, any>[]) => { 
    for (const clientId of Object.keys(clientsData)) {
        const isAlias = clientsData[clientId]?.startsWith?.("alias:");
        const fromId = isAlias ? clientsData[clientId]?.replace?.("alias:", "") : clientId;
        knownClients.set(clientId, clientsData[fromId]);
    }
}

//socket.emit("data", { op: "ask", what: "token"})

//
/**
 * Infer the canonical endpoint id for an inbound connection.
 *
 * WHY: routing/debugging depends on mapping raw socket handshakes to the same
 * ids used by `clients.json`, policy tables, and HTTP transport targets.
 */
export const identifyNodeIdFromIncomingConnection = async (socket: SocketConnect | SocketClient, packet?: Packet): Promise<string | null> => { 
    const expectedPeerId = normalizeNodeId((socket as any)?.__cwsExpectedPeerId);
    if (expectedPeerId) {
        const expectedEntry = getKnownClientConfig(expectedPeerId);
        if (expectedEntry) {
            return pickCanonicalKnownClientId(expectedEntry, expectedPeerId);
        }
        return expectedPeerId;
    }
    if (packet?.byId) { return packet?.byId as string; }
    const hintedId = normalizeNodeId((socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId);
    if (hintedId) {
        const hintedEntry = getKnownClientConfig(hintedId);
        if (hintedEntry) {
            return pickCanonicalKnownClientId(hintedEntry, hintedId);
        }
    }

    const remoteIps = collectNormalizedRemoteIps(socket);
    for (const ip of remoteIps) {
        const byIp = getKnownClientConfig(ip);
        if (byIp) {
            const canon = pickCanonicalKnownClientId(byIp, ip);
            if (canon) return canon;
        }
    }

    const gotToken = packet?.token ?? (await socketWrapper.get(socket)?.doAsk?.("token", {}, []));
    const tokenStr = resolveHandshakeTokenString(packet?.token ?? gotToken).toLowerCase();

    const matched = [...knownClients.entries()].find(([, cfg]) => {
        if (!cfg || typeof cfg !== "object") return false;
        const origins = Array.isArray((cfg as Record<string, unknown>).origins)
            ? ((cfg as Record<string, unknown>).origins as unknown[])
            : [];
        const tokens = Array.isArray((cfg as Record<string, unknown>).tokens)
            ? ((cfg as Record<string, unknown>).tokens as unknown[])
            : [];
        const originHit = origins.some((origin) =>
            normalizePolicyOriginToRemoteIps(origin).some((slice) => remoteIps.includes(slice))
        );
        const tokenHit =
            !!tokenStr &&
            tokens.some((t) => {
                const ts = String(t || "").trim().toLowerCase();
                return ts === "*" || ts === tokenStr;
            });
        return originHit || tokenHit;
    });

    if (matched) {
        const [byId, cfg] = matched;
        return pickCanonicalKnownClientId(cfg, byId);
    }
    return null;
}

//
export const validateSocketNode = async (socket: SocketConnect | SocketClient, packet: Packet) => { 
    const nodeId = await identifyNodeIdFromIncomingConnection(socket, packet);
    if (nodeId) return nodeId;
    return false;
}

//
export const formalizeOrigin = (origin: string) => { 
    const trimmed = String(origin || "").trim();
    if (!trimmed) return "";
    try {
        const parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
        return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}`;
    } catch {
        return "";
    }
};

/** Prefer the Host the client used (WAN vs LAN), then normalized remote IP — not the broken `socket.address` field. */
export const formalizeSocketVisibleOrigin = (socket: SocketConnect | SocketClient): string => {
    const s = socket as any;
    const headers = s?.handshake?.headers;
    const host = String(headers?.host || headers?.[":authority"] || "").trim();
    if (host) {
        const protoRaw = String(headers?.["x-forwarded-proto"] || "https").split(",")[0]?.trim() || "https";
        const proto = protoRaw === "http" ? "http:" : "https:";
        return formalizeOrigin(`${proto}//${host}`);
    }
    const ips = collectNormalizedRemoteIps(socket);
    if (ips[0]) {
        return formalizeOrigin(`https://${ips[0]}`);
    }
    return formalizeOrigin(String(s?.address || s?.origin || ""));
};

let cachedRuntimePorts: { listenPort: number; httpPort: number } | null = null;
const getRuntimeSocketPorts = (): { listenPort: number; httpPort: number } => {
    if (!cachedRuntimePorts) {
        const snap = readServerV2ConfigSnapshot() as Record<string, unknown>;
        const lp = Number(snap.listenPort);
        const hp = Number(snap.httpPort);
        cachedRuntimePorts = {
            listenPort: Number.isFinite(lp) && lp > 0 ? lp : 8443,
            httpPort: Number.isFinite(hp) && hp > 0 ? hp : 8080
        };
    }
    return cachedRuntimePorts;
};

const mergeOrderedPorts = (primary: number, extra: Array<string | number | undefined>): number[] => {
    const out: number[] = [];
    const seen = new Set<number>();
    const push = (value: number) => {
        if (!Number.isFinite(value) || value <= 0) return;
        const n = Math.trunc(value);
        if (seen.has(n)) return;
        seen.add(n);
        out.push(n);
    };
    push(primary);
    for (const raw of extra) {
        if (raw === undefined || raw === null) continue;
        const n = typeof raw === "number" ? raw : Number.parseInt(String(raw).trim(), 10);
        if (Number.isFinite(n)) push(n);
    }
    return out;
};

const resolveTlsServername = (targetConfig: any, normalizedOrigin: string): string | undefined => {
    const explicit = normalizeNodeId(targetConfig?.tls?.servername || targetConfig?.tls?.serverName);
    if (explicit) return explicit;
    const origins = Array.isArray(targetConfig?.origins) ? targetConfig.origins : [];
    if (!origins.length) return undefined;
    let connectedHost = "";
    try {
        connectedHost = new URL(normalizedOrigin).hostname;
    } catch {
        connectedHost = "";
    }
    const privateIpv4 = origins
        .map((value: unknown) => normalizeNodeId(value))
        .filter(Boolean)
        .find((host) => {
            if (host === connectedHost) return false;
            if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return false;
            return /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
        });
    return privateIpv4 || undefined;
};

//
/**
 * Dial a known peer over Socket.IO websocket transport using its configured
 * origins and token policy, logging each candidate attempt for diagnostics.
 */
export const initiateConnection = async (forId: string, fromId: string): Promise<SocketWrapper | undefined> => { 
    const dialId = resolveDialTargetId(forId) || forId;
    const targetConfig = getKnownClientConfig(dialId);
    if (!targetConfig) {
        traceSocket("initiate-skip", {
            from: fromId,
            target: forId,
            dialId,
            reason: "missing-target-config"
        });
        routeLog("initiate-skip", { from: fromId, target: forId, dialId, reason: "missing-target-config" });
        return undefined;
    }
    const origins = Array.isArray(targetConfig?.origins) ? targetConfig.origins : [];
    const { listenPort: defaultSecurePort, httpPort: defaultPlainPort } = getRuntimeSocketPorts();
    const policyHttps = (Array.isArray(targetConfig?.ports?.https) ? targetConfig.ports.https : []) as Array<string | number>;
    const policyWss = (Array.isArray(targetConfig?.ports?.wss) ? targetConfig.ports.wss : []) as Array<string | number>;
    const policyHttp = (Array.isArray(targetConfig?.ports?.http) ? targetConfig.ports.http : []) as Array<string | number>;
    const policyWs = (Array.isArray(targetConfig?.ports?.ws) ? targetConfig.ports.ws : []) as Array<string | number>;
    const securePorts = mergeOrderedPorts(defaultSecurePort, [...policyHttps, ...policyWss]);
    const plainPorts = mergeOrderedPorts(defaultPlainPort, [...policyHttp, ...policyWs]);
    const configuredTokens = Array.isArray(targetConfig?.tokens) ? targetConfig.tokens.map((value) => String(value || "").trim()).filter(Boolean) : [];
    const token = configuredTokens[0] || SELF_DATA.ASSOCIATED_TOKEN || "";
    const rejectUnauthorized = String(process.env.CWS_BRIDGE_REJECT_UNAUTHORIZED || "").trim().toLowerCase() !== "false";
    const candidateOrigins = origins.flatMap((origin) => {
        const raw = String(origin || "").trim();
        if (!raw) return [];
        const hasScheme = raw.includes("://");
        const normalized = hasScheme ? raw : `https://${raw}`;
        try {
            const parsed = new URL(normalized);
            const host = parsed.hostname;
            if (!host) return [];
            if (parsed.port) {
                const proto = parsed.protocol.toLowerCase();
                if (proto === "https:" || proto === "wss:") return [`https://${host}:${parsed.port}`];
                if (proto === "http:" || proto === "ws:") return [`http://${host}:${parsed.port}`];
                return [`https://${host}:${parsed.port}`];
            }
            if (hasScheme) {
                const proto = parsed.protocol.toLowerCase();
                if (proto === "http:" || proto === "ws:") {
                    return plainPorts.map((port) => `http://${host}:${port}`);
                }
                return securePorts.map((port) => `https://${host}:${port}`);
            }
            return [
                ...securePorts.map((port) => `https://${host}:${port}`),
                ...plainPorts.map((port) => `http://${host}:${port}`)
            ];
        } catch {
            return [];
        }
    });
    traceSocket("initiate-start", {
        from: fromId,
        target: forId,
        dialId,
        origins,
        candidateOrigins,
        rejectUnauthorized
    });
    routeLog("initiate-start", { from: fromId, target: forId, dialId, candidateOriginsCount: candidateOrigins.length });
    for (const normalizedOrigin of candidateOrigins) {
        const tlsServername = resolveTlsServername(targetConfig, normalizedOrigin);
        const handshake = buildServerV2SocketHandshake({
            endpointUrl: normalizedOrigin,
            userId: fromId,
            deviceId: fromId,
            token,
            rejectUnauthorized,
            connectionType: "exchanger-initiator",
            archetype: "server-v2",
            peerInstanceId: UUIDv4()
        });
        const rawSocket = io(normalizedOrigin, {
            auth: handshake.auth,
            query: handshake.query,
            transports: ["websocket"],
            secure: handshake.secure,
            upgrade: false,
            reconnection: false,
            timeout: 6500,
            rejectUnauthorized,
            ...(tlsServername ? { servername: tlsServername } : {})
        });
        (rawSocket as any).__cwsExpectedPeerId = dialId;
        const connectedSocket = await new Promise<SocketWrapper | undefined>((resolve) => {
            let settled = false;
            const finish = (value?: SocketWrapper) => {
                if (settled) return;
                settled = true;
                rawSocket.off("connect", onConnect);
                rawSocket.off("connect_error", onError);
                rawSocket.off("error", onError);
                clearTimeout(timeoutId);
                resolve(value);
            };
            const onConnect = () => {
                traceSocket("initiate-connect", {
                    from: fromId,
                    target: forId,
                    dialId,
                    origin: normalizedOrigin,
                    tlsServername,
                    socketId: (rawSocket as any)?.id
                });
                finish(new SocketWrapper(rawSocket, fromId, token));
            };
            const onError = (error?: unknown) => {
                const normalizedError = String((error as any)?.message || error || "");
                traceSocket("initiate-error", {
                    from: fromId,
                    target: forId,
                    dialId,
                    origin: normalizedOrigin,
                    reason: normalizedError,
                    tlsHint: /ssl|tls|certificate|self[-\s]?signed|wrong version number|protocol/i.test(normalizedError)
                        ? "tls-or-protocol-mismatch"
                        : undefined
                });
                rawSocket.close();
                finish(undefined);
            };
            const timeoutId = setTimeout(() => {
                traceSocket("initiate-timeout", {
                    from: fromId,
                    target: forId,
                    dialId,
                    origin: normalizedOrigin
                });
                rawSocket.close();
                finish(undefined);
            }, 6500);
            rawSocket.on("connect", onConnect);
            rawSocket.on("connect_error", onError);
            rawSocket.on("error", onError);
        });
        if (connectedSocket instanceof SocketWrapper) {
            return connectedSocket;
        }
    }
    traceSocket("initiate-failed", {
        from: fromId,
        target: forId,
        dialId
    });
    routeLog("initiate-failed", { from: fromId, target: forId, dialId });
    return undefined;
}

//
/**
 * Reuse a live local connection when possible, otherwise start one outbound
 * dial attempt unless the target is ephemeral or currently in cooldown.
 */
export const findOrInitiateConnection = (id: string, selfId: string): SocketWrapper | Promise<SocketWrapper | undefined> | undefined => {
    const dialId = resolveDialTargetId(id) || id;
    let localPeers = resolveLocalSocketWrappersForTarget(id).filter((entry) => doesWrapperMatchTarget(entry, id));
    if (localPeers.length === 0 && dialId !== id) {
        localPeers = resolveLocalSocketWrappersForTarget(dialId).filter((entry) => doesWrapperMatchTarget(entry, dialId));
    }
    if (localPeers.length > 0) {
        const first = localPeers[0];
        traceSocket("find-cache-hit", {
            from: selfId,
            target: id,
            dialId,
            cachedType: first instanceof SocketWrapper ? "socket" : "promise",
            localPeerCount: localPeers.length
        });
        return first;
    }
    if (
        !getKnownClientConfig(dialId) &&
        (looksLikeSocketEngineSessionId(id) ||
            looksLikeSocketEngineSessionId(dialId) ||
            looksLikeRoutingUuid(id) ||
            looksLikeRoutingUuid(dialId))
    ) {
        traceSocket("find-skip-ephemeral", {
            from: selfId,
            target: id,
            dialId,
            reason: "non-endpoint-routing-token"
        });
        return undefined;
    }
    const retryInMs = getFailedNodeRetryDelay(id) || (dialId !== id ? getFailedNodeRetryDelay(dialId) : 0);
    if (retryInMs > 0) {
        traceSocket("find-cooldown", {
            from: selfId,
            target: id,
            dialId,
            retryInMs
        });
        return undefined;
    }
    traceSocket("find-cache-miss", {
        from: selfId,
        target: id,
        dialId
    });

    const initiated: Promise<SocketWrapper | undefined> = initiateConnection(id, selfId)
        .then((socket) => {
            if (socket) {
                clearFailedNodeConnection(id, dialId, socket.socketId, socket.peerId);
                traceSocket("find-cache-store", {
                    from: selfId,
                    target: id,
                    dialId,
                    socketId: socket.socketId,
                    peer: socket.peerId
                });
                if (doesWrapperMatchTarget(socket, id)) {
                    cacheNodeConnection(id, socket);
                }
                if (dialId !== id && doesWrapperMatchTarget(socket, dialId)) {
                    cacheNodeConnection(dialId, socket);
                }
                cacheNodeConnection(socket.socketId, socket);
            } else {
                const policyId = resolveDialTargetId(id) || id;
                if (getKnownClientConfig(policyId)) {
                    markFailedNodeConnection(id);
                    if (dialId !== id) {
                        markFailedNodeConnection(dialId);
                    }
                    traceSocket("find-empty", {
                        from: selfId,
                        target: id,
                        dialId,
                        reason: "dial-failed"
                    });
                } else {
                    traceSocket("find-empty", {
                        from: selfId,
                        target: id,
                        dialId,
                        reason: "no-endpoint-policy"
                    });
                }
                deleteCachedNodeConnection(id);
                if (dialId !== id) {
                    deleteCachedNodeConnection(dialId);
                }
            }
            return socket;
        })
        ?.catch?.((error) => {
            markFailedNodeConnection(id);
            traceSocket("find-error", {
                from: selfId,
                target: id,
                reason: error instanceof Error ? error.message : String(error || "")
            });
            deleteCachedNodeConnection(id);
            throw error;
        });

    cacheNodeConnection(id, initiated);
    return initiated;
}

//
const wireSocketIoServer = (server: Server, selfId: string, token: string) => {
    server.on("connection", async (socket) => {
        try {
            const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
            socketWrapper.rememberPeerId((await identifyNodeIdFromIncomingConnection(socket, {})) as string);
            await socketWrapper?.hello?.(true) ?? null;
            traceSocket("server-connection", {
                local: socketWrapper?.selfId,
                peer: socketWrapper?.peerId || socketWrapper?.socketId,
                origin: socketWrapper?.origin
            });
            console.log(
                `[Server] Connected to ${socketWrapper?.selfId} from ${socketWrapper?.peerId || socketWrapper?.socketId || socketWrapper?.origin}`
            );
            return socketWrapper;
        } catch (err) {
            console.error(err);
        }
    });

    server.on("reconnect", async (socket) => {
        try {
            const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
            socketWrapper.rememberPeerId((await identifyNodeIdFromIncomingConnection(socket, {})) as string);
            await socketWrapper?.hello?.() ?? null;
            traceSocket("server-reconnect", {
                local: socketWrapper?.selfId,
                peer: socketWrapper?.peerId || socketWrapper?.socketId,
                origin: socketWrapper?.origin
            });
            console.log(
                `[Server] Reconnected to ${socketWrapper?.selfId} from ${socketWrapper?.peerId || socketWrapper?.socketId || socketWrapper?.origin}`
            );
            return socketWrapper;
        } catch (err) {
            console.error(err);
        }
    });
};

export type ConnectionRegistryRow = {
    id: string;
    peerId: string;
    deviceId: string;
    userId: string;
    remoteAddress: string;
    reverse: boolean;
    connectedAt: number;
};

/** HTTP clipboard relay + reverse-peer matching (`utils/routes.ts` reads `app.wsHub.getConnectionRegistry`). */
export const getConnectionRegistrySnapshot = (): ConnectionRegistryRow[] => {
    const rows: ConnectionRegistryRow[] = [];
    for (const [peerInstanceId, socket] of internalNodeMap.entries()) {
        const wrap = socketWrapper.get(socket);
        const q = getSocketHandshakeQuery(socket);
        const rawAddr = String((socket as any)?.handshake?.address || (socket as any)?.conn?.remoteAddress || "").trim();
        const remoteAddress = rawAddr.replace(/^::ffff:/i, "");
        const isTunnel =
            String(q.__airpad_endpoint || "").trim() === "0" ||
            String(q.__airpad_via || "").trim().toLowerCase() === "tunnel";
        const reverse =
            isTunnel ||
            String(q.reverse || "").trim().toLowerCase() === "true" ||
            String(q.connectionType || "")
                .toLowerCase()
                .includes("reverse");
        const deviceId = resolveKnownClientIdForPeerInstance(peerInstanceId) || peerInstanceId;
        const issued = Number((socket as any)?.handshake?.issued);
        rows.push({
            id: peerInstanceId,
            peerId: String(wrap?.peerId || peerInstanceId),
            deviceId,
            userId: String(wrap?.peerId || deviceId),
            remoteAddress,
            reverse,
            connectedAt: Number.isFinite(issued) ? issued : Date.now()
        });
    }
    return rows;
};

/** Compatibility Socket.IO server facade kept for legacy callers and relay paths. */
export class SocketServer {
    /** All Socket.IO servers (e.g. public + admin Fastify HTTP(S) listeners). */
    public readonly servers: Server[];
    /** Primary instance (first listener); kept for callers that expect a single `Server`. */
    public readonly server: Server;
    public selfId: string = SELF_DATA.ASSOCIATED_ID;
    public token: string = SELF_DATA.ASSOCIATED_TOKEN;

    //
    public constructor(
        servers: Server | Server[],
        selfId: string = SELF_DATA.ASSOCIATED_ID,
        token: string = SELF_DATA.ASSOCIATED_TOKEN
    ) {
        this.servers = Array.isArray(servers) ? servers : [servers];
        this.server = this.servers[0]!;
        this.selfId = selfId;
        this.token = token;

        for (const io of this.servers) {
            wireSocketIoServer(io, selfId, token);
        }
    }

    //
    public act(what: string, payload: any, nodes: string[]) { 
        return populateToOthers("data", {
            op: "act",
            what, payload,
            byId: this.selfId,
            timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public ask(what: string, payload: any, nodes: string[]) { 
        return populateToOthers("data", {
            op: "ask",
            what, payload,
            byId: this.selfId,
            timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public hello(nodes: string[] = ["*"]) { 
        return populateToOthers("data", {
            op: "ask",
            what: "token",
            payload: {},
            byId: this.selfId, timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId, "ask");
    }

    //
    public populate(packet: Packet = {}, nodes: string[] = ["*"]) { 
        return populateToOthers("data", packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId, packet?.op || "ask");
    }

    //
    public emit(op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet, nodes: string[] = ["*"]) { 
        return populateToOthers("data", { op: op, ...packet }, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId, op);
    }

    //
    public useConnection(id: string) { 
        return findOrInitiateConnection(id, this.selfId);
    }
}

//
export let existsSocketServer: SocketServer | undefined = undefined;
const isTruthyEnv = (value: unknown): boolean => ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
const buildSocketIoServerOptions = () => {
    const allowAnyOrigin = !isTruthyEnv(process.env.CWS_SOCKET_STRICT_CORS);
    const corsOrigin: any = allowAnyOrigin
        ? (origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) => cb(null, true)
        : (
            process.env.CWS_SOCKET_CORS_ORIGINS
                ? process.env.CWS_SOCKET_CORS_ORIGINS.split(",").map((entry) => entry.trim()).filter(Boolean)
                : true
        );
    return {
        transports: ["websocket", "polling"] as const,
        cors: {
            origin: corsOrigin,
            credentials: true,
            methods: ["GET", "POST", "OPTIONS"]
        },
        allowRequest: (_req: any, callback: (err: string | null, ok: boolean) => void) => callback(null, true)
    } as any;
};
/** Build the shared Socket.IO server(s) once and reuse them across the endpoint runtime. */
export const makeSocketServer = (primaryHttpServer: any, selfId: string, extraHttpServers: any[] = []) => {
    if (existsSocketServer) return existsSocketServer;
    const opts = buildSocketIoServerOptions();
    const ioServers = [new Server(primaryHttpServer, opts), ...extraHttpServers.map((srv) => new Server(srv, opts))];
    existsSocketServer = new SocketServer(ioServers, selfId);
    return existsSocketServer;
};

//
export default makeSocketServer;
