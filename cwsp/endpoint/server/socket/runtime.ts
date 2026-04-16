/**
 * Canonical socket runtime for the endpoint's peer-to-peer transport layer.
 *
 * The runtime attaches WebSocket and optional Socket.IO servers, keeps endpoint
 * identity/config in sync with the coordinator tables, and provides the
 * transport-facing status/dispatch helpers used by HTTP and plugin layers.
 */
import type { Server as HttpServer } from "node:http";
import type { Server as HttpsServer } from "node:https";
import WebSocket from "ws";

import type { Packet } from "./types.ts";
import { inferWhatFromLegacyType, normalizeInboundPacket } from "./packet.ts";
import {
    Connection,
    SELF_DATA,
    areNodeIdsEquivalent,
    findOrInitiateConnection,
    getConnectionRegistrySnapshot,
    internalNodeMap,
    knownClients,
    loadFromClientsConfig,
    makeSocketServer,
    resolveKnownClientIdForPeerInstance,
    resolveKnownClientId,
    socketMatchesRoutingTarget
} from "./coordinator.ts";
import { buildServerV2SocketHandshake, resolveServerV2WireIdentity } from "./client-contract.ts";
import { WsGatewayCanonical, wsGatewayPath } from "./ws-gateway.ts";

type SocketServerInput = HttpServer | HttpsServer;

type ConnectionProfile = {
    id: string;
    aliases: string[];
    userId: string;
    deviceId: string;
    label: string;
    socketId: string;
    transport: "ws" | "socketio";
    connectedAt: number;
    lastSeenAt: number;
};

const normalizeToken = (value: unknown): string => String(value || "").trim().toLowerCase();
const COORDINATOR_VERBS = new Set(["ask", "act", "resolve", "result", "error"]);

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const toStringArray = (values: unknown[]): string[] => {
    return values.map((entry) => String(entry || "").trim()).filter(Boolean);
};

const normalizeString = (value: unknown): string => String(value || "").trim();

const toPositiveInteger = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
        return Math.trunc(parsed);
    }
    return fallback;
};

const splitList = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((entry) => normalizeString(entry)).filter(Boolean);
    if (typeof value === "string") return value.split(/[;,]/).map((entry) => entry.trim()).filter(Boolean);
    return [];
};

const packetClone = (packet: Packet): Packet => JSON.parse(JSON.stringify(packet || {})) as Packet;

const normalizeCoordinatorOp = (value: unknown): Packet["op"] => {
    const op = normalizeString(value).toLowerCase();
    if (!op) return "act";
    if (op === "request") return "ask";
    if (op === "response") return "result";
    if (op === "signal" || op === "notify" || op === "redirect") return "act";
    if (COORDINATOR_VERBS.has(op)) return op as Packet["op"];
    return "act";
};

const inferPurposeFromWhat = (what: string): string => {
    const normalized = normalizeString(what).toLowerCase();
    if (normalized.startsWith("airpad:")) return "airpad";
    if (normalized.startsWith("mouse:")) return "mouse";
    if (normalized.startsWith("keyboard:")) return "input";
    if (normalized.startsWith("clipboard:")) return "clipboard";
    if (normalized.startsWith("contacts:") || normalized.startsWith("contact:")) return "contact";
    if (normalized.startsWith("sms:")) return "sms";
    if (normalized.startsWith("storage:")) return "storage";
    return "general";
};

const resolveCoordinatorWhat = (typeOrWhat: unknown, data: unknown): string => {
    const preferred = inferWhatFromLegacyType(typeOrWhat) || normalizeString(typeOrWhat);
    if (preferred) return preferred;
    const payload = asRecord(data);
    const fromPayload = normalizeString(payload.what || payload.type || payload.action);
    if (fromPayload) return inferWhatFromLegacyType(fromPayload) || fromPayload;
    const payloadOp = normalizeString(payload.op || "");
    if (payloadOp && !COORDINATOR_VERBS.has(payloadOp.toLowerCase())) {
        return payloadOp;
    }
    return "dispatch";
};

const normalizeOutgoingPacket = (payload: Record<string, unknown>, fallbackFrom: string): Packet => {
    const normalized = normalizeInboundPacket(payload);
    if (normalized) {
        normalized.op = normalizeCoordinatorOp(normalized.op);
        normalized.byId ||= fallbackFrom;
        normalized.from ||= fallbackFrom;
        normalized.timestamp ||= Date.now();
        return normalized;
    }
    const packet = payload as Packet;
    const what = resolveCoordinatorWhat(packet.what || packet.type || packet.op, packet.payload ?? packet.data ?? packet);
    return {
        ...packet,
        op: normalizeCoordinatorOp(packet.op),
        what,
        purpose: normalizeString((packet as any).purpose) || inferPurposeFromWhat(what),
        protocol: normalizeString((packet as any).protocol) || "socket",
        byId: packet.byId || fallbackFrom,
        from: packet.from || fallbackFrom,
        timestamp: packet.timestamp || Date.now(),
        nodes: Array.isArray(packet.nodes) ? packet.nodes : Array.isArray((packet as any).destinations) ? (packet as any).destinations : packet.nodes
    } as Packet;
};

const collectTargetIds = (packet: Packet): string[] => {
    const targets = new Set<string>();
    if (Array.isArray(packet.nodes)) {
        for (const entry of packet.nodes) {
            const normalized = normalizeToken(entry);
            if (normalized) targets.add(normalized);
        }
    }
    for (const candidate of [(packet as any).target, (packet as any).targetId, (packet as any).deviceId]) {
        const normalized = normalizeToken(candidate);
        if (normalized) targets.add(normalized);
    }
    if (Array.isArray((packet as any).destinations)) {
        for (const entry of (packet as any).destinations as unknown[]) {
            const normalized = normalizeToken(entry);
            if (normalized) targets.add(normalized);
        }
    }
    return Array.from(targets);
};

/**
 * Bridge-aware transport runtime shared by the endpoint's socket-facing entrypoints.
 */
export class ServerV2SocketRuntime {
    private readonly selfId: string;
    private readonly token: string;
    private readonly clientSeed: Record<string, any>;
    private readonly bridgeConfig: Record<string, unknown>;
    private socketServer?: ReturnType<typeof makeSocketServer>;
    private wsGateway?: WsGatewayCanonical;
    private preconnectTimer?: ReturnType<typeof setInterval>;
    private canonicalBridgeSocket?: WebSocket;
    private canonicalBridgeConnId?: string;
    private bridgeEndpointCursor = 0;
    private readonly compatSocketIo: boolean = ["1", "true", "yes", "on"].includes(String(process.env.CWS_COMPAT_SOCKETIO || "false").trim().toLowerCase());

    constructor(selfId: string, token: string, clientSeed: Record<string, any> = {}, bridgeConfig: Record<string, unknown> = {}) {
        this.selfId = selfId || "server-v2";
        this.token = token || "";
        this.clientSeed = clientSeed;
        this.bridgeConfig = bridgeConfig;
    }

    /**
     * Attach one or more HTTP(S) servers to the canonical WS gateway and the
     * optional compatibility Socket.IO layer.
     */
    attach(server: SocketServerInput | SocketServerInput[]): void {
        if (this.socketServer) return;
        const nodes = (Array.isArray(server) ? server : [server]).filter(Boolean) as SocketServerInput[];
        if (!nodes.length) return;
        SELF_DATA.ASSOCIATED_ID = this.selfId;
        SELF_DATA.ASSOCIATED_TOKEN = this.token;
        if (this.clientSeed && Object.keys(this.clientSeed).length > 0) {
            loadFromClientsConfig(this.clientSeed as any);
        }
        const [primary, ...extras] = nodes;
        if (this.compatSocketIo) {
            this.socketServer = makeSocketServer(primary as any, this.selfId, extras as any);
        }
        this.wsGateway = new WsGatewayCanonical(this.selfId, this.token);
        for (const node of nodes) {
            this.wsGateway.attach(node);
        }
        this.startBridgePreconnect();
    }

    /** Tear down listeners and background preconnect timers created by `attach()`. */
    close(): void {
        if (this.preconnectTimer) {
            clearInterval(this.preconnectTimer);
            this.preconnectTimer = undefined;
        }
        for (const io of this.socketServer?.servers ?? []) {
            io.close();
        }
        this.wsGateway?.close();
        this.wsGateway = undefined;
        this.socketServer = undefined;
        this.canonicalBridgeSocket?.terminate();
        this.canonicalBridgeSocket = undefined;
        this.canonicalBridgeConnId = undefined;
    }

    /** Return peer instance ids currently visible through the shared coordinator map. */
    getConnectedDevices(_ownerId?: string): string[] {
        return Array.from(new Set(Array.from(internalNodeMap.keys()).filter(Boolean)));
    }

    /** Build lightweight peer rows for admin/status endpoints without exposing raw socket objects. */
    getConnectedPeerProfiles(_ownerId?: string): Array<{ id: string; label: string; userId: string; deviceId: string; transport: string }> {
        return this.getConnectedDevices().map((id) => this.profileFor(id));
    }

    /** Return a transport summary suitable for diagnostics and admin endpoints. */
    getStatus() {
        return {
            ws: {
                path: wsGatewayPath(),
                ...(this.wsGateway?.getStatus() || { connected: 0, ids: [] as string[] })
            },
            socketio: {
                enabled: this.compatSocketIo,
                connected: this.compatSocketIo ? this.getConnectedDevices().length : 0,
                ids: this.compatSocketIo ? this.getConnectedDevices() : []
            }
        };
    }

    /** For HTTP handlers (`/clipboard` policy relay) — tunnel / reverse Socket.IO clients. */
    getConnectionRegistry() {
        return getConnectionRegistrySnapshot();
    }

    /**
     * Broadcast one normalized payload to every live local connection.
     *
     * NOTE: this is the fan-out path used when an HTTP route does not target a
     * specific endpoint and when coordinator packets intentionally address `*`.
     */
    multicast(_ownerId: string, payload: Record<string, unknown>, _namespace?: string): boolean {
        const outbound = normalizeOutgoingPacket(payload, this.selfId);
        let delivered = false;
        for (const socket of internalNodeMap.values()) {
            socket.send(outbound);
            delivered = true;
        }
        return delivered;
    }

    /** Convenience wrapper for legacy callers that still think in `{type,data}` messages. */
    notify(ownerId: string, type: string, data: unknown): boolean {
        return this.multicast(ownerId, {
            type,
            data,
            from: this.selfId,
            byId: this.selfId,
            timestamp: Date.now()
        });
    }

    /**
     * Route one already-normalized packet to local peers and, if needed,
     * compatibility relay sockets that can reach remote targets.
     */
    dispatchPacket(packet: Packet): boolean {
        const normalized = normalizeInboundPacket(packet) || packet;
        const targets = collectTargetIds(normalized).filter((entry) => entry !== normalizeToken(this.selfId));
        const outbound = packetClone(normalized);
        if (!outbound.byId) outbound.byId = this.selfId;
        if (!outbound.from) outbound.from = this.selfId;
        if (!outbound.timestamp) outbound.timestamp = Date.now();

        // AI-READ: empty targets and wildcard targets both mean "fan out to
        // every live local peer", not "drop because no routing key exists".
        if (!targets.length || targets.includes("*")) {
            return this.multicast(this.selfId, outbound);
        }

        let delivered = false;
        const pendingTargets = [...targets];
        for (const [peerInstanceId, socket] of internalNodeMap.entries()) {
            const matches = pendingTargets.some((targetId) => socketMatchesRoutingTarget(peerInstanceId, targetId));
            if (!matches) continue;
            socket.send(outbound);
            delivered = true;
            for (let index = pendingTargets.length - 1; index >= 0; index -= 1) {
                if (socketMatchesRoutingTarget(peerInstanceId, pendingTargets[index])) {
                    pendingTargets.splice(index, 1);
                }
            }
        }
        if (pendingTargets.length) {
            const relaySocket = this.findGatewayRelayConnection(pendingTargets);
            if (relaySocket) {
                // WHY: when the local runtime cannot satisfy every target, reuse
                // an already-live gateway socket before dialing new relay paths.
                relaySocket.send({ ...outbound, nodes: pendingTargets });
                delivered = true;
            } else if (this.socketServer) {
                // `populate()` can dial or reuse remote-compatible relay sockets.
                this.socketServer.populate({ ...outbound, nodes: pendingTargets }, pendingTargets);
                delivered = true;
            }
        } else if (!delivered && this.socketServer) {
            this.socketServer.populate(outbound, targets);
            delivered = true;
        }
        return delivered;
    }

    /**
     * Build and dispatch a coordinator-style packet from legacy HTTP/socket
     * call sites that only know the high-level `what + payload + targets` shape.
     */
    sendCoordinatorMessage(
        targets: string[],
        typeOrWhat: string,
        data: unknown,
        from?: string,
        op: Packet["op"] = "act"
    ): boolean {
        const what = resolveCoordinatorWhat(typeOrWhat, data);
        const normalizedOp = normalizeCoordinatorOp(op);
        return this.dispatchPacket({
            op: normalizedOp,
            what,
            type: normalizeString(typeOrWhat) || what,
            purpose: inferPurposeFromWhat(what),
            protocol: "socket",
            data,
            payload: data,
            nodes: targets,
            destinations: targets,
            byId: from || this.selfId,
            from: from || this.selfId,
            timestamp: Date.now()
        } as Packet);
    }

    sendLegacyMessage(targets: string[], type: string, data: unknown, from?: string): boolean {
        return this.sendCoordinatorMessage(targets, type, data, from, "act");
    }

    private hasEquivalentLiveConnection(targetId: string): boolean {
        for (const connectedId of internalNodeMap.keys()) {
            if (socketMatchesRoutingTarget(connectedId, targetId)) {
                return true;
            }
        }
        return false;
    }

    private findGatewayRelayConnection(targetIds: string[]): { send: (payload: unknown) => void } | null {
        const seenSockets = new Set<object>();
        for (const [peerInstanceId, socket] of internalNodeMap.entries()) {
            if (!socket || typeof socket !== "object") continue;
            if (seenSockets.has(socket as object)) continue;
            seenSockets.add(socket as object);
            const relayId = resolveKnownClientIdForPeerInstance(peerInstanceId) || normalizeString(peerInstanceId);
            if (!relayId || areNodeIdsEquivalent(relayId, this.selfId)) continue;
            if (targetIds.some((targetId) => socketMatchesRoutingTarget(peerInstanceId, targetId))) continue;
            const relayConfig = asRecord(knownClients.get(relayId) || knownClients.get(peerInstanceId));
            if (asRecord(relayConfig.flags).gateway === true && typeof (socket as any).send === "function") {
                return socket as { send: (payload: unknown) => void };
            }
        }
        return null;
    }

    private resolveBridgePreconnectTargets(): string[] {
        const bridge = asRecord(this.bridgeConfig);
        const preconnect = asRecord(bridge.preconnect);
        const rawTargets = [
            ...splitList(preconnect.targets),
            ...splitList(bridge.preconnectTargets),
            ...splitList(bridge.endpoints),
            normalizeString(bridge.endpointUrl)
        ];
        const resolved: string[] = [];
        for (const candidate of rawTargets) {
            const targetId = resolveKnownClientId(candidate) || normalizeString(candidate);
            if (!targetId) continue;
            if (areNodeIdsEquivalent(targetId, this.selfId)) continue;
            const canonicalTargetId = resolveKnownClientId(targetId);
            if (!canonicalTargetId) continue;
            if (resolved.some((entry) => areNodeIdsEquivalent(entry, canonicalTargetId))) continue;
            resolved.push(canonicalTargetId);
        }
        return resolved;
    }

    private startBridgePreconnect(): void {
        const bridge = asRecord(this.bridgeConfig);
        if (bridge.enabled === false) return;

        const preconnect = asRecord(bridge.preconnect);
        if (preconnect.enabled === false) return;

        const targets = this.resolveBridgePreconnectTargets();
        if (!targets.length) return;

        // Prefer preconnect-specific reconnect interval.
        // Default to ~1s so connections can recover quickly after a link drop.
        const reconnectMs = Math.max(1000, toPositiveInteger(preconnect.reconnectMs ?? bridge.reconnectMs, 1000));
        const connectTargets = () => {
            if (this.compatSocketIo) {
                for (const targetId of targets) {
                    // Skip already-routable peers so the preconnect loop stays a
                    // background safety net rather than a noisy reconnect storm.
                    if (this.hasEquivalentLiveConnection(targetId)) continue;
                    void Promise.resolve(findOrInitiateConnection(targetId, this.selfId)).catch(() => undefined);
                }
            }
            this.ensureCanonicalBridgeConnection(targets);
        };

        connectTargets();
        this.preconnectTimer = setInterval(connectTargets, reconnectMs);
        console.log(`[server-v2] bridge preconnect active: ${targets.join(", ")} (${reconnectMs}ms)`);
    }

    private resolveCanonicalBridgeEndpoints(): string[] {
        const bridge = asRecord(this.bridgeConfig);
        const preconnect = asRecord(bridge.preconnect);
        const raw = [
            normalizeString(bridge.endpointUrl),
            ...splitList(bridge.endpoints),
            ...splitList(bridge.endpointUrls),
            ...splitList(preconnect.endpoints)
        ];
        return Array.from(
            new Set(
                raw
                    .map((entry) => {
                        try {
                            const parsed = new URL(entry.includes("://") ? entry : `https://${entry}`);
                            parsed.protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
                            parsed.pathname = "/ws";
                            parsed.search = "";
                            return parsed.toString();
                        } catch {
                            return "";
                        }
                    })
                    .filter(Boolean)
            )
        );
    }

    private ensureCanonicalBridgeConnection(targets: string[]): void {
        const relayId = targets.find((targetId) => {
            const relayConfig = asRecord(knownClients.get(targetId));
            return asRecord(relayConfig.flags).gateway === true;
        }) || targets[0];
        if (!relayId || this.hasEquivalentLiveConnection(relayId)) return;
        if (this.canonicalBridgeSocket && (this.canonicalBridgeSocket.readyState === WebSocket.OPEN || this.canonicalBridgeSocket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const endpoints = this.resolveCanonicalBridgeEndpoints();
        if (!endpoints.length) return;
        const endpoint = endpoints[this.bridgeEndpointCursor % endpoints.length];
        this.bridgeEndpointCursor = (this.bridgeEndpointCursor + 1) % endpoints.length;

        const bridge = asRecord(this.bridgeConfig);
        const identity = resolveServerV2WireIdentity({
            endpointUrl: endpoint,
            userId: this.selfId,
            deviceId: this.selfId,
            token: this.token,
            connectionType: normalizeString(bridge.connectionType) || "exchanger-initiator",
            archetype: "server-v2-bridge",
            rejectUnauthorized: false
        });
        const handshake = buildServerV2SocketHandshake(identity);
        const parsed = new URL(identity.endpointUrl);
        for (const [key, value] of Object.entries(handshake.query)) {
            if (!key || !value) continue;
            parsed.searchParams.set(key, value);
        }

        const ws = new WebSocket(parsed.toString(), {
            rejectUnauthorized: identity.rejectUnauthorized,
            headers: {
                ...(handshake.auth.token ? { Authorization: `Bearer ${handshake.auth.token}` } : {}),
                ...(handshake.auth.token ? { "X-CWS-Token": handshake.auth.token } : {}),
                ...(handshake.auth.clientId ? { "X-CWS-Client-Id": handshake.auth.clientId } : {}),
                ...(handshake.auth.userId ? { "X-CWS-User-Id": handshake.auth.userId } : {}),
                ...(handshake.query.connectionType ? { "X-CWS-Connection-Type": handshake.query.connectionType } : {}),
                ...(handshake.query.archetype ? { "X-CWS-Archetype": handshake.query.archetype } : {})
            }
        });
        this.canonicalBridgeSocket = ws;
        const connId = `bridge:${relayId}`;
        this.canonicalBridgeConnId = connId;

        const clearSocket = () => {
            if (this.canonicalBridgeSocket === ws) {
                this.canonicalBridgeSocket = undefined;
            }
            if (this.canonicalBridgeConnId === connId) {
                this.canonicalBridgeConnId = undefined;
            }
        };

        ws.once("open", () => {
            internalNodeMap.get(connId)?.close();
            new Connection(connId, relayId, this.token, ws, this.selfId);
            console.log(`[server-v2] canonical bridge connected: ${relayId} <- ${parsed.toString()}`);
        });
        ws.once("close", clearSocket);
        ws.once("error", (error) => {
            console.warn(`[server-v2] canonical bridge connect failed: ${relayId} <- ${parsed.toString()} :: ${String((error as Error)?.message || error)}`);
            clearSocket();
        });
    }

    private profileFor(id: string): ConnectionProfile {
        const known = asRecord(knownClients.get(id));
        const aliases = Array.from(
            new Set(
                toStringArray([id, ...(Array.isArray(known.aliases) ? known.aliases : []), ...(Array.isArray(known.tokens) ? known.tokens : [])]).map((entry) => normalizeToken(entry))
            )
        );
        return {
            id,
            aliases,
            userId: String(known.userId || id).trim(),
            deviceId: String(known.deviceId || id).trim(),
            label: String(known.label || known.name || id).trim(),
            socketId: id,
            // NOTE: `internalNodeMap` contains canonical live socket wrappers, so
            // peer-profile diagnostics should report the current transport as WS.
            transport: "ws",
            connectedAt: Date.now(),
            lastSeenAt: Date.now()
        };
    }
}
