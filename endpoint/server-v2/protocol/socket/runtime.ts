import type { Server as HttpServer } from "node:http";
import type { Server as HttpsServer } from "node:https";

import type { Packet } from "./types.ts";
import { inferWhatFromLegacyType } from "./packet.ts";
import {
    SELF_DATA,
    internalNodeMap,
    knownClients,
    loadFromClientsConfig,
    makeSocketServer
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
    private socketServer?: ReturnType<typeof makeSocketServer>;

    constructor(selfId: string, token: string, clientSeed: Record<string, any> = {}) {
        this.selfId = selfId || "server-v2";
        this.token = token || "";
        this.clientSeed = clientSeed;
    }

    attach(server: SocketServerInput): void {
        if (this.socketServer) return;
        SELF_DATA.ASSOCIATED_ID = this.selfId;
        SELF_DATA.ASSOCIATED_TOKEN = this.token;
        if (this.clientSeed && Object.keys(this.clientSeed).length > 0) {
            loadFromClientsConfig(this.clientSeed as any);
        }
        this.socketServer = makeSocketServer(server as any, this.selfId);
    }

    close(): void {
        this.socketServer?.server?.close?.();
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
        for (const [nodeId, socket] of internalNodeMap.entries()) {
            const normalizedNodeId = normalizeToken(nodeId);
            if (!targets.includes(normalizedNodeId)) continue;
            socket.emit("data", outbound);
            delivered = true;
        }
        if (!delivered && this.socketServer) {
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
