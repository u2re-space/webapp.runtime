import type { Packet } from "./types.ts";

export type ServerV2WireIdentity = {
    archetype?: string;
    airpadToken?: string;
    connectionType?: string;
    deviceId?: string;
    /** Unique per device/session; avoids Socket.IO routing collisions when userId/clientId match. */
    peerInstanceId?: string;
    endpointUrl?: string;
    rejectUnauthorized?: boolean;
    token?: string;
    userId?: string;
};

type ServerV2SocketHandshake = {
    auth: Record<string, string>;
    query: Record<string, string>;
    secure: boolean;
    transports: string[];
};

const IPV4_RE = /^\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?$/;
const NODE_PREFIX_RE = /^(?:l-|h-|p-|l_|h_|p_)/i;
const TYPE_PREFIX_RE = /^(?:device:|local-device:|id:|client:|peer:)/i;

const normalizeString = (value: unknown): string => String(value || "").trim();

const withUpperPrefix = (value: string): string => {
    const normalized = normalizeString(value);
    if (!normalized) return "";
    const prefix = normalized.slice(0, 1).toUpperCase();
    const suffix = normalized.slice(2).replace(/^[-_]+/, "");
    return suffix ? `${prefix}-${suffix}` : prefix;
};

export const normalizeWireNodeId = (value: unknown): string => {
    const raw = normalizeString(value);
    if (!raw) return "";
    const lower = raw.toLowerCase();
    if (lower === "broadcast" || lower === "all" || raw === "*") return "*";
    if (NODE_PREFIX_RE.test(raw)) {
        return withUpperPrefix(raw);
    }
    const canonical = raw.replace(TYPE_PREFIX_RE, "").trim();
    if (!canonical) return "";
    if (IPV4_RE.test(canonical)) {
        return `L-${canonical}`;
    }
    return canonical;
};

export const normalizeServerV2EndpointUrl = (value: unknown, defaultPath = "/"): string => {
    const raw = normalizeString(value).replace(/^\/+/, "");
    if (!raw) return "";
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    try {
        const parsed = new URL(withProtocol);
        const rawPath = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : defaultPath;
        const lowerPath = rawPath.toLowerCase();
        const pathName =
            lowerPath === "/api" ||
            lowerPath.startsWith("/api/") ||
            lowerPath === "/socket.io" ||
            lowerPath.startsWith("/socket.io/")
                ? "/"
                : rawPath;
        parsed.pathname = pathName;
        // Drop stale engine.io/socket.io query keys on canonical endpoint URLs.
        parsed.searchParams.delete("EIO");
        parsed.searchParams.delete("eio");
        parsed.searchParams.delete("transport");
        parsed.searchParams.delete("sid");
        parsed.searchParams.delete("j");
        parsed.searchParams.delete("t");
        return parsed.toString();
    } catch {
        return "";
    }
};

export const resolveServerV2WireIdentity = (identity: ServerV2WireIdentity): Required<ServerV2WireIdentity> & { clientId: string } => {
    const endpointUrl = normalizeServerV2EndpointUrl(identity.endpointUrl, "/");
    const userId = normalizeWireNodeId(identity.userId || identity.deviceId);
    const deviceId = normalizeWireNodeId(identity.deviceId || identity.userId);
    const clientId = normalizeWireNodeId(userId || deviceId);
    return {
        archetype: normalizeString(identity.archetype) || "server-v2",
        clientId: clientId || "server-v2-client",
        connectionType: normalizeString(identity.connectionType) || "exchanger-initiator",
        deviceId: deviceId || clientId || "server-v2-client",
        endpointUrl,
        peerInstanceId: normalizeString(identity.peerInstanceId),
        rejectUnauthorized: identity.rejectUnauthorized !== false,
        airpadToken: normalizeString(identity.airpadToken),
        token: normalizeString(identity.token),
        userId: userId || clientId || "server-v2-client"
    };
};

export const buildServerV2SocketHandshake = (identity: ServerV2WireIdentity): ServerV2SocketHandshake => {
    const resolved = resolveServerV2WireIdentity(identity);
    // Dual-wire compatibility:
    // some gateway nodes only understand `connectionType=first-order`,
    // while we still want to keep "exchanger-*" semantics in identity/archetype.
    const rawConnectionType = String(resolved.connectionType || "").trim().toLowerCase();
    const wireConnectionType = rawConnectionType.includes("exchanger") ? "first-order" : resolved.connectionType;
    const auth: Record<string, string> = {};
    const query: Record<string, string> = {
        connectionType: wireConnectionType,
        archetype: resolved.archetype
    };

    if (resolved.token) {
        auth.token = resolved.token;
        auth.userKey = resolved.token;
        query.token = resolved.token;
        query.userKey = resolved.token;
    }

    if (resolved.airpadToken) {
        auth.airpadToken = resolved.airpadToken;
        query.airpadToken = resolved.airpadToken;
    }

    if (resolved.clientId) {
        auth.clientId = resolved.clientId;
        auth.userId = resolved.userId;
        query.clientId = resolved.clientId;
        query.userId = resolved.userId;
    }

    const peerInstance = normalizeString(identity.peerInstanceId);
    if (peerInstance) {
        auth.peerInstanceId = peerInstance;
        auth.deviceInstanceId = peerInstance;
        query.peerInstanceId = peerInstance;
        query.deviceInstanceId = peerInstance;
    }

    return {
        auth,
        query,
        secure: resolved.endpointUrl.startsWith("https://") || resolved.endpointUrl.startsWith("wss://"),
        transports: ["websocket", "polling"]
    };
};

export const normalizePacketForWire = (packet: Packet, identity: ServerV2WireIdentity): Packet => {
    const resolved = resolveServerV2WireIdentity(identity);
    const nodes = Array.isArray(packet.nodes)
        ? packet.nodes.map((entry) => normalizeWireNodeId(entry)).filter(Boolean)
        : [];
    return {
        ...packet,
        op: packet.op || (packet.result !== undefined ? "result" : packet.error !== undefined ? "error" : "ask"),
        byId: normalizeWireNodeId(packet.byId) || resolved.userId,
        from: normalizeWireNodeId(packet.from) || resolved.userId,
        nodes,
        timestamp: packet.timestamp && packet.timestamp > 0 ? packet.timestamp : Date.now()
    };
};

export const buildHelloPacket = (identity: ServerV2WireIdentity): Packet => {
    return normalizePacketForWire({
        op: "ask",
        what: "token",
        payload: {},
        nodes: ["*"]
    }, identity);
};

export const buildClipboardPacket = (identity: ServerV2WireIdentity, text: string, targets: string[]): Packet => {
    return normalizePacketForWire({
        op: "act",
        what: "clipboard:update",
        payload: {
            text
        },
        nodes: targets
    }, identity);
};

export const buildPacketReply = (
    request: Packet,
    identity: ServerV2WireIdentity,
    payload: { error?: unknown; op?: Packet["op"]; result?: unknown; }
): Packet => {
    const resolved = resolveServerV2WireIdentity(identity);
    const nextNodes = new Set<string>();
    for (const entry of [request.byId, ...(Array.isArray(request.nodes) ? request.nodes : [])]) {
        const normalized = normalizeWireNodeId(entry);
        if (normalized && normalized !== resolved.userId) {
            nextNodes.add(normalized);
        }
    }
    const op = payload.op || (payload.error !== undefined ? "error" : request.op === "ask" ? "resolve" : "result");
    return normalizePacketForWire({
        op,
        what: request.what,
        uuid: request.uuid,
        nodes: [...nextNodes],
        result: payload.result,
        error: payload.error
    }, identity);
};

export const extractClipboardText = (packet: Packet): string => {
    const payload = packet.payload && typeof packet.payload === "object" ? packet.payload as Record<string, unknown> : {};
    const result = packet.result && typeof packet.result === "object" ? packet.result as Record<string, unknown> : {};
    return normalizeString(payload.text ?? payload.data ?? payload.payload ?? result.text ?? result.data ?? packet.result);
};
