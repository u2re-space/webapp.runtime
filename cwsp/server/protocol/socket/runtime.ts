import type { Server as HttpServer } from "node:http";
import type { Server as HttpsServer } from "node:https";

import type { Packet } from "./types.ts";
import { inferWhatFromLegacyType } from "./packet.ts";
import {
    SELF_DATA,
    areNodeIdsEquivalent,
    findOrInitiateConnection,
    internalNodeMap,
    knownClients,
    loadFromClientsConfig,
    makeSocketServer,
    resolveKnownClientIdForPeerInstance,
    resolveKnownClientId,
    socketMatchesRoutingTarget
} from "./coordinator.ts";

type SocketServerInput = HttpServer | HttpsServer;

type ConnectionProfile = {
    id: string;
    aliases: string[];
    userId: string;
    deviceId: string;
    label: string;
    socketId: string;
    transport: "socketio";
    connectedAt: number;
    lastSeenAt: number;
};

const normalizeToken = (value: unknown): string => String(value || "").trim().toLowerCase();

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
    return Array.from(targets);
};

export class ServerV2SocketRuntime {
    private readonly selfId: string;
    private readonly token: string;
    private readonly clientSeed: Record<string, any>;
    private readonly bridgeConfig: Record<string, unknown>;
    private socketServer?: ReturnType<typeof makeSocketServer>;
    private preconnectTimer?: ReturnType<typeof setInterval>;

    constructor(selfId: string, token: string, clientSeed: Record<string, any> = {}, bridgeConfig: Record<string, unknown> = {}) {
        this.selfId = selfId || "server-v2";
        this.token = token || "";
        this.clientSeed = clientSeed;
        this.bridgeConfig = bridgeConfig;
    }

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
        this.socketServer = makeSocketServer(primary as any, this.selfId, extras as any);
        this.startBridgePreconnect();
    }

    close(): void {
        if (this.preconnectTimer) {
            clearInterval(this.preconnectTimer);
            this.preconnectTimer = undefined;
        }
        for (const io of this.socketServer?.servers ?? []) {
            io.close();
        }
        this.socketServer = undefined;
    }

    getConnectedDevices(_ownerId?: string): string[] {
        return Array.from(new Set(Array.from(internalNodeMap.keys()).filter(Boolean)));
    }

    getConnectedPeerProfiles(_ownerId?: string): Array<{ id: string; label: string; userId: string; deviceId: string; transport: string }> {
        return this.getConnectedDevices().map((id) => this.profileFor(id));
    }

    getStatus() {
        return {
            socketio: {
                connected: this.getConnectedDevices().length,
                ids: this.getConnectedDevices()
            }
        };
    }

    multicast(_ownerId: string, payload: Record<string, unknown>, _namespace?: string): boolean {
        let delivered = false;
        for (const socket of internalNodeMap.values()) {
            socket.emit("data", payload);
            delivered = true;
        }
        return delivered;
    }

    notify(ownerId: string, type: string, data: unknown): boolean {
        return this.multicast(ownerId, {
            type,
            data,
            from: this.selfId,
            byId: this.selfId,
            timestamp: Date.now()
        });
    }

    dispatchPacket(packet: Packet): boolean {
        const targets = collectTargetIds(packet).filter((entry) => entry !== normalizeToken(this.selfId));
        const outbound = packetClone(packet);
        if (!outbound.byId) outbound.byId = this.selfId;
        if (!outbound.from) outbound.from = this.selfId;
        if (!outbound.timestamp) outbound.timestamp = Date.now();

        if (!targets.length || targets.includes("*")) {
            return this.multicast(this.selfId, outbound);
        }

        let delivered = false;
        const pendingTargets = [...targets];
        for (const [peerInstanceId, socket] of internalNodeMap.entries()) {
            const matches = pendingTargets.some((targetId) => socketMatchesRoutingTarget(peerInstanceId, targetId));
            if (!matches) continue;
            socket.emit("data", outbound);
            delivered = true;
            for (let index = pendingTargets.length - 1; index >= 0; index -= 1) {
                if (socketMatchesRoutingTarget(peerInstanceId, pendingTargets[index])) {
                    pendingTargets.splice(index, 1);
                }
            }
        }
        if (pendingTargets.length && this.socketServer) {
            const relaySocket = this.findGatewayRelayConnection(pendingTargets);
            if (relaySocket) {
                relaySocket.emit("data", { ...outbound, nodes: pendingTargets });
                delivered = true;
            } else {
                this.socketServer.populate({ ...outbound, nodes: pendingTargets }, pendingTargets);
                delivered = true;
            }
        } else if (!delivered && this.socketServer) {
            this.socketServer.populate(outbound, targets);
            delivered = true;
        }
        return delivered;
    }

    sendLegacyMessage(targets: string[], type: string, data: unknown, from?: string): boolean {
        return this.dispatchPacket({
            op: "act",
            what: inferWhatFromLegacyType(type),
            type,
            data,
            payload: data,
            nodes: targets,
            byId: from || this.selfId,
            from: from || this.selfId,
            timestamp: Date.now()
        } as Packet);
    }

    private hasEquivalentLiveConnection(targetId: string): boolean {
        for (const connectedId of internalNodeMap.keys()) {
            if (socketMatchesRoutingTarget(connectedId, targetId)) {
                return true;
            }
        }
        return false;
    }

    private findGatewayRelayConnection(targetIds: string[]): { emit: (event: string, payload: unknown) => void } | null {
        const seenSockets = new Set<object>();
        for (const [peerInstanceId, socket] of internalNodeMap.entries()) {
            if (!socket || typeof socket !== "object") continue;
            if (seenSockets.has(socket as object)) continue;
            seenSockets.add(socket as object);
            const relayId = resolveKnownClientIdForPeerInstance(peerInstanceId) || normalizeString(peerInstanceId);
            if (!relayId || areNodeIdsEquivalent(relayId, this.selfId)) continue;
            if (targetIds.some((targetId) => socketMatchesRoutingTarget(peerInstanceId, targetId))) continue;
            const relayConfig = asRecord(knownClients.get(relayId) || knownClients.get(peerInstanceId));
            if (asRecord(relayConfig.flags).gateway === true && typeof (socket as any).emit === "function") {
                return socket as { emit: (event: string, payload: unknown) => void };
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
            for (const targetId of targets) {
                if (this.hasEquivalentLiveConnection(targetId)) continue;
                void Promise.resolve(findOrInitiateConnection(targetId, this.selfId)).catch(() => undefined);
            }
        };

        connectTargets();
        this.preconnectTimer = setInterval(connectTargets, reconnectMs);
        console.log(`[server-v2] bridge preconnect active: ${targets.join(", ")} (${reconnectMs}ms)`);
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
            transport: "socketio",
            connectedAt: Date.now(),
            lastSeenAt: Date.now()
        };
    }
}
