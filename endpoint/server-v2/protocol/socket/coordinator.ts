import { Server, Socket as SocketClient } from "socket.io";
import { Socket as SocketConnect, io } from "socket.io-client";
import { handleAct, handleAsk,makePostHandler } from "./handler.ts";
import { buildServerV2SocketHandshake, normalizeWireNodeId } from "./client-contract.ts";
import { normalizeInboundPacket } from "./packet.ts";
import type { Packet } from "./types.ts";

//
export const SELF_DATA = {
    ASSOCIATED_ID: "",
    ASSOCIATED_TOKEN: ""
}

//
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

//
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
    return ["1", "true", "yes", "on"].includes(verbose) || ["1", "true", "yes", "on"].includes(tunnelDebug);
};

const TRACE_SUPPRESSION_WINDOW_MS = 1000;
const suppressedSocketTraces = new Map<string, { lastAt: number; count: number }>();

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
        if (existing.count % 50 === 0) {
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

//
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
    const candidateNodes = requestedNodes.includes("*")
        ? [...Array.from(knownClients.keys()), ...Array.from(nodeMap.keys())]
        : requestedNodes;
    const rejectOnFailure = options?.rejectOnFailure === true;
    for (const nodeId of uniqueNodeIds(excludeSelf(candidateNodes, selfId)).filter((nodeId) => nodeId && nodeId !== "*")) { 
        const localWrappers = resolveLocalSocketWrappersForTarget(nodeId);
        const dispatchList =
            localWrappers.length > 0
                ? localWrappers
                : [findOrInitiateConnection(nodeId, selfId) as SocketWrapper | Promise<SocketWrapper | undefined> | undefined];
        for (const entry of dispatchList) {
            const promise = Promise.resolve(entry);
            promisedArray.push(promise.then((socket) => {
                packet.nodes = uniqueNodeIds(excludeSelf(packet.nodes, selfId));
                packet.op = (op ||= packet?.op);
                packet.byId ||= selfId;
                if (!socket) {
                    if (!rejectOnFailure) {
                        return undefined;
                    }
                    throw new Error(`Unable to connect to node: ${nodeId}`);
                }
                return socket.direct(channel, sanitizePacketForWire(packet as Packet));
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

//
const getKnownClientConfig = (nodeId: unknown) => {
    const normalized = normalizeNodeId(nodeId);
    if (!normalized) return null;

    const directEntry = knownClients.get(normalized);
    return directEntry ?? [...knownClients.entries()].find(([candidateId]) => {
        return candidateId.toLowerCase() === normalized.toLowerCase();
    })?.[1];
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

    const directEntry = getKnownClientConfig(normalized);
    if (directEntry) {
        return pickCanonicalKnownClientId(directEntry, normalized);
    }

    const candidateOrigin = formalizeOrigin(normalized);
    let candidateHost = "";
    if (candidateOrigin) {
        try {
            candidateHost = new URL(candidateOrigin).hostname;
        } catch {
            candidateHost = "";
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
            const normalizedOrigin = formalizeOrigin(origin as string);
            if (!normalizedOrigin) continue;
            if (candidateOrigin && normalizedOrigin === candidateOrigin) {
                return pickCanonicalKnownClientId(entry);
            }
            if (!candidateHost) continue;
            try {
                if (new URL(normalizedOrigin).hostname === candidateHost) {
                    return pickCanonicalKnownClientId(entry);
                }
            } catch {
                continue;
            }
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

const resolveLegacyTargetNode = (socket: SocketConnect | SocketClient, selfId: string): string => {
    const query = getSocketHandshakeQuery(socket);
    const candidates = [
        query.__airpad_route_target,
        query.routeTarget,
        query.target,
        query.targetId,
        query.__airpad_route
    ];

    for (const candidate of candidates) {
        const normalized = normalizeNodeId(candidate);
        if (!normalized) continue;
        if (areNodeIdsEquivalent(normalized, selfId)) {
            return selfId;
        }
        if (getKnownClientConfig(normalized)) {
            return normalized;
        }
    }

    const configuredForward = resolveConfiguredForwardNode(selfId);
    if (configuredForward) {
        return configuredForward;
    }

    return selfId;
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
        nodes: Array.isArray(base.nodes) && base.nodes.length > 0 ? base.nodes : [resolveLegacyTargetNode(socket, selfId)],
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
            out.push(cached);
            return out;
        }
    }
    const direct = nodeMap.get(targetId);
    if (direct) {
        out.push(direct);
        return out;
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

    rememberPeerId(candidate?: unknown) {
        const peerInstance = this.peerInstanceId || resolvePeerInstanceIdFromSocket(this.socket);
        this.peerInstanceId = peerInstance;
        this.peerId = peerInstance;
        this.socketId = peerInstance;
        internalNodeMap.set(peerInstance, this.socket);
        cachePeerInstanceOnly(peerInstance, this);
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
        return peerInstance;
    }

    //
    populate(channel: "data" | "message", packet: Packet, op?: "ask" | "act" | "resolve" | "result" | "error") {
        return populateToOthers(channel, { op: op || packet?.op || "ask", ...packet }, uniqueNodeIds(excludeSelf([this.socketId, this.peerId, ...packet?.nodes], this.selfId)), this.selfId, op);
    }

    //
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

        //
        if (directly) {
            this.socket.emit("data", sanitizePacketForWire(packet));
        } else {
            populateToOthers("data", { op: "ask", ...packet }, excludeSelf(packet?.nodes, this.selfId), this.selfId, "ask");
        }
        this.token = packet?.result?.token ?? "";
        this.origin = formalizeOrigin((this.socket as any)?.address || (this.socket as any)?.origin || this.origin || "");
        return this.token;
    }

    private buildReplyNodes(packet: Packet): string[] {
        return uniqueNodeIds(
            excludeSelf([packet.byId, ...(Array.isArray(packet.nodes) ? packet.nodes : [])], this.selfId)
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
        this.socket?.emit?.(channel, sanitizePacketForWire(packet as Packet));
        // @ts-ignore
        return this.resolvers?.getOrInsertComputed?.(uuid, () => { return makePostHandler(packet.op, packet.what, packet.payload) })?.promise;
    }

    handleAsk(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAsk(what, payload, packet, selfId);
    }

    handleAct(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAct(what, payload, packet, selfId);
    }

    reply(packet: Packet) {
        //this.socket?.emit?.("data", packet as Packet);
        //this.socket?.emit?.("message", packet as Packet);
        this.populate("data", packet as Packet);
        this.populate("message", packet as Packet);
        return packet;
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
        this.origin = formalizeOrigin((socket as any)?.address || (socket as any)?.origin || "");
        this.socket = socket;
        this.peerInstanceId = resolvePeerInstanceIdFromSocket(socket);
        this.socketId = this.peerInstanceId;
        this.peerId = this.peerInstanceId;
        socketWrapper.set(socket, this);

        const handlePacket = async (packet: Packet) => {
            this.rememberPeerId(packet?.byId || packet?.from || this.socketId || this.peerId);
            const payload = this.unpackPayload(packet?.payload);
            const uuid = packet?.uuid;
            const isTokenHandshake = (packet?.op || "") === "ask" && (packet?.what || "") === "token";
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
            if (uuid && this.resolvers.has(uuid) && ["resolve", "result", "error"].includes(packet?.op || "")) {
                if (packet.result) {
                    this.resolvers.get(uuid)?.resolve?.(this.unpackPayload(packet?.result));
                } else {
                    this.resolvers.get(uuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                }
                this.resolvers.delete(uuid);
                return;
            }
            const shouldRejectForwarded = !targetsSelf && uuid && ["ask", "act"].includes(packet?.op || "");
            const forwarded = isTokenHandshake
                ? []
                : populateToOthers("data", packet, excludeSelf(packet?.nodes, this.selfId), this.selfId, packet?.op, {
                    rejectOnFailure: shouldRejectForwarded
                });
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
            if (!targetsSelf && uuid && ["ask", "act"].includes(packet?.op || "") && forwarded.length > 0) {
                try {
                    const result = await Promise.any(forwarded);
                    this.reply(packet?.op === "ask" ? this.encodeAnswer(result, packet) : this.encodeReport(result, packet));
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
            if (forwarded.length > 0) {
                void Promise.allSettled(forwarded);
            }
            if (targetsSelf) {
                if (uuid) {
                    if (this.acceptedUUIDs.has(uuid)) { return; }
                    this.acceptedUUIDs.add(uuid);
                    setTimeout(() => { this.acceptedUUIDs.delete(uuid); }, 10000);
                }
                
                if (packet?.op == "ask") {
                    const result = await this.handleAsk(packet?.what, payload, packet, this.selfId);
                    this.reply(this.encodeAnswer(result, packet));
                } else
                if (packet?.op == "act") { 
                    const result = await this.handleAct(packet?.what, payload, packet, this.selfId);
                    this.reply(this.encodeReport(result, packet));
                } else
                if (uuid && ["resolve", "result", "error"].includes(packet?.op)) {
                    if (packet.result) {
                        this.resolvers?.get(uuid)?.resolve?.(this.unpackPayload(packet?.result));
                    } else {
                        this.resolvers?.get(uuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                    }
                    this.resolvers?.delete?.(uuid);
                }
            }
        };

        //
        socket.on("disconnect", () => {
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("connect", async () => {
            this.rememberPeerId(await identifyNodeIdFromIncomingConnection(socket, {}) as string);
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
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("close", () => {
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("reconnect", async () => {
            this.isConnected = false;
            this.rememberPeerId(await identifyNodeIdFromIncomingConnection(socket, {}) as string);
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
                this.origin = formalizeOrigin((socket as any)?.address || (socket as any)?.origin || "");
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
                    packet.nodes = [resolveLegacyTargetNode(socket, this.selfId)];
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
                const text = typeof data?.text === "string" ? data.text : String(data?.text ?? "");
                const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:update", payload: { text } });
                await this.handleAct("clipboard:update", { text }, packet, this.selfId);
                void this.reply(packet);
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
                const packet = makeLegacyLocalPacket(socket, this.selfId, { what: "clipboard:update", payload: { text } });
                await this.handleAct("clipboard:update", { text }, packet, this.selfId);
                void this.reply(packet);
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
    }
}

//
export const loadFromClientsConfig = (clientsData: Record<string, any>[]) => { 
    for (const clientId of Object.keys(clientsData)) {
        const isAlias = clientsData[clientId]?.startsWith?.("alias:");
        const fromId = isAlias ? clientsData[clientId]?.replace?.("alias:", "") : clientId;
        knownClients.set(clientId, clientsData[fromId]);
    }
}

//socket.emit("data", { op: "ask", what: "token"})

//
export const identifyNodeIdFromIncomingConnection = async (socket: SocketConnect | SocketClient, packet?: Packet): Promise<string | null> => { 
    if (packet?.byId) { return packet?.byId as string; }
    const hintedId = normalizeNodeId((socket as any)?.handshake?.auth?.clientId || getSocketHandshakeQuery(socket).clientId);
    if (hintedId && getKnownClientConfig(hintedId)) {
        return hintedId;
    }
    const gotToken = packet?.token ?? (await socketWrapper.get(socket)?.doAsk?.("token", {}, []));
    const possibleNodeId = [...knownClients?.entries?.()].find(([byId, { origins, tokens }]) => {
        return origins.some((ip)=>ip==(socket as any)?.address) || tokens.some((token)=>token==(packet?.token ?? gotToken));
    })?.[0];
    if (possibleNodeId) { return possibleNodeId; }
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

//
export const initiateConnection = async (forId: string, fromId: string): Promise<SocketWrapper | undefined> => { 
    const targetConfig = getKnownClientConfig(forId);
    if (!targetConfig) {
        traceSocket("initiate-skip", {
            from: fromId,
            target: forId,
            reason: "missing-target-config"
        });
        return undefined;
    }
    const origins = Array.isArray(targetConfig?.origins) ? targetConfig.origins : [];
    const configuredPorts = Array.from(new Set([
        ...((Array.isArray(targetConfig?.ports?.https) ? targetConfig.ports.https : []) as Array<string | number>),
        ...((Array.isArray(targetConfig?.ports?.wss) ? targetConfig.ports.wss : []) as Array<string | number>),
        8443
    ].map((value) => String(value || "").trim()).filter(Boolean)));
    const configuredTokens = Array.isArray(targetConfig?.tokens) ? targetConfig.tokens.map((value) => String(value || "").trim()).filter(Boolean) : [];
    const token = configuredTokens[0] || SELF_DATA.ASSOCIATED_TOKEN || "";
    const rejectUnauthorized = String(process.env.CWS_BRIDGE_REJECT_UNAUTHORIZED || "").trim().toLowerCase() !== "false";
    const candidateOrigins = origins.flatMap((origin) => {
        const normalizedOrigin = formalizeOrigin(origin);
        if (!normalizedOrigin) {
            return [];
        }
        try {
            const parsed = new URL(normalizedOrigin);
            if (parsed.port) {
                return [normalizedOrigin];
            }
            return configuredPorts.map((port) => `${parsed.protocol}//${parsed.hostname}:${port}`);
        } catch {
            return [];
        }
    });
    traceSocket("initiate-start", {
        from: fromId,
        target: forId,
        origins,
        candidateOrigins,
        rejectUnauthorized
    });
    for (const normalizedOrigin of candidateOrigins) {
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
            timeout: 10000,
            rejectUnauthorized
        });
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
                    origin: normalizedOrigin,
                    socketId: (rawSocket as any)?.id
                });
                finish(new SocketWrapper(rawSocket, fromId, token));
            };
            const onError = (error?: unknown) => {
                traceSocket("initiate-error", {
                    from: fromId,
                    target: forId,
                    origin: normalizedOrigin,
                    reason: error instanceof Error ? error.message : String(error || "")
                });
                rawSocket.close();
                finish(undefined);
            };
            const timeoutId = setTimeout(() => {
                traceSocket("initiate-timeout", {
                    from: fromId,
                    target: forId,
                    origin: normalizedOrigin
                });
                rawSocket.close();
                finish(undefined);
            }, 10000);
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
        target: forId
    });
    return undefined;
}

//
export const findOrInitiateConnection = (id: string, selfId: string): SocketWrapper | Promise<SocketWrapper | undefined> | undefined => {
    const localPeers = resolveLocalSocketWrappersForTarget(id);
    if (localPeers.length > 0) {
        const first = localPeers[0];
        traceSocket("find-cache-hit", {
            from: selfId,
            target: id,
            cachedType: first instanceof SocketWrapper ? "socket" : "promise",
            localPeerCount: localPeers.length
        });
        return first;
    }
    const retryInMs = getFailedNodeRetryDelay(id);
    if (retryInMs > 0) {
        traceSocket("find-cooldown", {
            from: selfId,
            target: id,
            retryInMs
        });
        return undefined;
    }
    traceSocket("find-cache-miss", {
        from: selfId,
        target: id
    });

    const initiated: Promise<SocketWrapper | undefined> = initiateConnection(id, selfId)
        .then((socket) => {
            if (socket) {
                clearFailedNodeConnection(id, socket.socketId, socket.peerId);
                traceSocket("find-cache-store", {
                    from: selfId,
                    target: id,
                    socketId: socket.socketId,
                    peer: socket.peerId
                });
                cacheNodeConnection(id, socket);
                cacheNodeConnection(socket.socketId, socket);
            } else {
                markFailedNodeConnection(id);
                traceSocket("find-empty", {
                    from: selfId,
                    target: id
                });
                deleteCachedNodeConnection(id);
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
export class SocketServer {
    public server: Server;
    public selfId: string = SELF_DATA.ASSOCIATED_ID;
    public token: string = SELF_DATA.ASSOCIATED_TOKEN;

    //
    public constructor(server: Server, selfId: string = SELF_DATA.ASSOCIATED_ID, token: string = SELF_DATA.ASSOCIATED_TOKEN) {
        this.server = server;
        this.selfId = selfId;
        this.token = token;

        //
        server.on("connection", async (socket) => {
            try {
                const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
                socketWrapper.rememberPeerId(await identifyNodeIdFromIncomingConnection(socket, {}) as string);
                await socketWrapper?.hello?.(true) ?? null;
                traceSocket("server-connection", {
                    local: socketWrapper?.selfId,
                    peer: socketWrapper?.peerId || socketWrapper?.socketId,
                    origin: socketWrapper?.origin
                });
                console.log(`[Server] Connected to ${socketWrapper?.selfId} from ${socketWrapper?.peerId || socketWrapper?.socketId || socketWrapper?.origin}`);
                return socketWrapper;
            } catch (err) {
                console.error(err);
            }
        });

        //
        server.on("reconnect", async (socket) => {
            try {
                const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
                socketWrapper.rememberPeerId(await identifyNodeIdFromIncomingConnection(socket, {}) as string);
                await socketWrapper?.hello?.() ?? null;
                traceSocket("server-reconnect", {
                    local: socketWrapper?.selfId,
                    peer: socketWrapper?.peerId || socketWrapper?.socketId,
                    origin: socketWrapper?.origin
                });
                console.log(`[Server] Reconnected to ${socketWrapper?.selfId} from ${socketWrapper?.peerId || socketWrapper?.socketId || socketWrapper?.origin}`);
                return socketWrapper;
            } catch (err) {
                console.error(err);
            }
        });
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
export const makeSocketServer = (originOrServer: any, selfId: string) => {
    return (existsSocketServer ??= new SocketServer(new Server(originOrServer, {  }), selfId));
}

//
export default makeSocketServer;
