import { WebSocket } from "ws";
import type { Packet } from "./types.ts";
import { handleAct, handleAsk } from "./handler.ts";

export const SELF_DATA = {
    ASSOCIATED_ID: "",
    ASSOCIATED_TOKEN: ""
};

export const internalNodeMap = new Map<string, Connection>();
export const knownClients = new Map<string, any>();

const normalizeRoutingToken = (value: unknown): string => String(value || "").trim();

const isBroadcastTarget = (value: string): boolean => {
    const normalized = normalizeRoutingToken(value).toLowerCase();
    return !normalized || normalized === "*" || normalized === "all" || normalized === "broadcast";
};

const extractPacketTargets = (packet: Packet): string[] => {
    const out = new Set<string>();
    const append = (value: unknown) => {
        const normalized = normalizeRoutingToken(value);
        if (normalized) out.add(normalized);
    };
    if (Array.isArray(packet.nodes)) {
        for (const value of packet.nodes) append(value);
    }
    if (Array.isArray(packet.destinations)) {
        for (const value of packet.destinations) append(value);
    }
    append((packet as any).target);
    append((packet as any).targetId);
    append((packet as any).deviceId);
    return Array.from(out);
};

const findGatewayRelayConnection = (excludeInstanceId: string | undefined, targetIds: string[]): Connection | null => {
    for (const [instanceId, conn] of internalNodeMap.entries()) {
        if (excludeInstanceId && areNodeIdsEquivalent(instanceId, excludeInstanceId)) continue;
        if (targetIds.some((target) => socketMatchesRoutingTarget(instanceId, target))) continue;
        const relayId = normalizeRoutingToken(conn.peerId || instanceId);
        if (!relayId || areNodeIdsEquivalent(relayId, SELF_DATA.ASSOCIATED_ID)) continue;
        const relayConfig = knownClients.get(relayId) || knownClients.get(instanceId);
        const flags = relayConfig && typeof relayConfig === "object" && !Array.isArray(relayConfig)
            ? (relayConfig as Record<string, any>).flags
            : undefined;
        if (flags && typeof flags === "object" && !Array.isArray(flags) && flags.gateway === true) {
            return conn;
        }
    }
    return null;
};

const routePacketToPeers = (packet: Packet, selfId: string, excludeInstanceId?: string): boolean => {
    const targets = extractPacketTargets(packet).filter((target) => !isBroadcastTarget(target));
    const externalTargets = targets.filter((target) => !areNodeIdsEquivalent(target, selfId));
    if (!externalTargets.length) return false;

    let delivered = false;
    const pendingTargets = [...externalTargets];
    for (const [instanceId, conn] of internalNodeMap.entries()) {
        if (excludeInstanceId && areNodeIdsEquivalent(instanceId, excludeInstanceId)) continue;
        if (pendingTargets.some((target) => socketMatchesRoutingTarget(conn.id, target))) {
            conn.send(packet);
            delivered = true;
            for (let index = pendingTargets.length - 1; index >= 0; index -= 1) {
                if (socketMatchesRoutingTarget(conn.id, pendingTargets[index])) {
                    pendingTargets.splice(index, 1);
                }
            }
        }
    }
    if (pendingTargets.length) {
        // WHY: direct-connected endpoints like `L-192.168.0.110` still need to
        // forward peer-addressed packets through an already-live gateway bridge
        // when the final target is not locally attached.
        const relay = findGatewayRelayConnection(excludeInstanceId, pendingTargets);
        if (relay) {
            relay.send({
                ...packet,
                nodes: pendingTargets,
                destinations: pendingTargets
            } as Packet);
            delivered = true;
        }
    }
    return delivered;
};

const normalizeActResult = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        const ok = typeof record.ok === "boolean" ? record.ok : true;
        const handled = typeof record.handled === "boolean" ? record.handled : ok;
        return {
            ok,
            handled,
            ...record
        };
    }
    const ok = value !== false;
    return {
        ok,
        handled: ok,
        value: value ?? true
    };
};

export class Connection {
    constructor(
        public readonly id: string,
        public peerId: string,
        public readonly token: string,
        public readonly ws: WebSocket,
        private readonly selfId: string
    ) {
        this.ws.on("message", async (data) => {
            try {
                const text = typeof data === "string" ? data : data.toString("utf8");
                const packet = JSON.parse(text) as Packet;
                await this.handlePacket(packet);
            } catch (err) {
                console.error(`[coordinator] Error handling message from ${this.peerId}:`, err);
            }
        });

        this.ws.on("close", () => {
            internalNodeMap.delete(this.id);
            console.log(`[coordinator] Connection closed: ${this.peerId} (${this.id})`);
        });

        this.ws.on("error", (err) => {
            console.error(`[coordinator] Connection error for ${this.peerId} (${this.id}):`, err);
            internalNodeMap.delete(this.id);
        });

        internalNodeMap.set(this.id, this);
        console.log(`[coordinator] New connection registered: ${this.peerId} (${this.id})`);
    }

    send(packet: Packet): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(packet));
        }
    }

    close(): void {
        this.ws.close();
        internalNodeMap.delete(this.id);
    }

    private async handlePacket(packet: Packet) {
        if (!packet || typeof packet !== "object") return;

        const senderId = String(packet.byId || packet.from || this.peerId || "").trim() || this.peerId;
        const normalizedPacket = {
            ...packet,
            byId: senderId,
            from: String(packet.from || packet.byId || senderId).trim() || senderId
        } as Packet;
        if (routePacketToPeers(normalizedPacket, this.selfId, this.id)) {
            return;
        }

        const op = normalizedPacket.op || "act";
        const what = normalizeRoutingToken(normalizedPacket.what || normalizedPacket.type || "unknown") || "unknown";
        const payload = normalizedPacket.payload ?? normalizedPacket.data ?? {};

        try {
            if (op === "ask") {
                const result = await handleAsk(what, payload, normalizedPacket, this.selfId);
                this.send({
                    ...normalizedPacket,
                    op: "result",
                    payload: result,
                    data: result,
                    nodes: [normalizedPacket.byId || normalizedPacket.from || this.peerId],
                    byId: this.selfId,
                    from: this.selfId
                });
            } else if (op === "act") {
                const result = await handleAct(what, payload, normalizedPacket, this.selfId);
                if (normalizedPacket.uuid && result !== null && result !== undefined) {
                    const reply = normalizeActResult(result);
                    this.send({
                        ...normalizedPacket,
                        op: "result",
                        result: reply,
                        payload: reply,
                        data: reply,
                        nodes: [normalizedPacket.byId || normalizedPacket.from || this.peerId],
                        byId: this.selfId,
                        from: this.selfId
                    });
                }
            }
        } catch (err) {
            console.error(`[coordinator] Error processing packet ${op}:${what}:`, err);
            if (op === "ask") {
                this.send({
                    ...normalizedPacket,
                    op: "error",
                    payload: { error: String(err) },
                    data: { error: String(err) },
                    nodes: [normalizedPacket.byId || normalizedPacket.from || this.peerId],
                    byId: this.selfId,
                    from: this.selfId
                });
            }
        }
    }
}

export function areNodeIdsEquivalent(a: string, b: string): boolean {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

export function resolveKnownClientId(candidate: unknown): string | null {
    const normalized = String(candidate || "").trim();
    if (!normalized) return null;
    return normalized;
}

export function resolveKnownClientIdForPeerInstance(instanceId: string): string | null {
    const conn = internalNodeMap.get(instanceId);
    return conn ? conn.peerId : null;
}

export function socketMatchesRoutingTarget(instanceId: string, targetId: string): boolean {
    if (areNodeIdsEquivalent(instanceId, targetId)) return true;
    const conn = internalNodeMap.get(instanceId);
    if (conn && areNodeIdsEquivalent(conn.peerId, targetId)) return true;
    return false;
}

export function getConnectionRegistrySnapshot() {
    const snapshot: Record<string, any> = {};
    for (const [id, conn] of internalNodeMap.entries()) {
        snapshot[id] = { peerId: conn.peerId };
    }
    return snapshot;
}

export function loadFromClientsConfig(seed: Record<string, any>) {
    knownClients.clear();
    for (const [key, value] of Object.entries(seed)) {
        knownClients.set(key, value);
    }
}

export async function findOrInitiateConnection(targetId: string, selfId?: string): Promise<Connection | undefined> {
    for (const conn of internalNodeMap.values()) {
        if (socketMatchesRoutingTarget(conn.id, targetId)) return conn;
    }
    // In a full implementation, we might dial out here if it's a known bridge
    return undefined;
}

// Dummy for compatibility with runtime.ts which still calls it
export function makeSocketServer() {
    return {
        servers: [],
        populate: () => {}
    };
}
