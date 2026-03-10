import { randomUUID } from "node:crypto";

export type AirpadPacketKind = "object" | "binary";
export type AirpadRouteAction = "local" | "socket" | "bridge" | "reverse" | "broadcast" | "drop";

export type AirpadPacketEnvelope = {
    packetId: string;
    seq: number;
    sessionId: string;
    hop: number;
    kind: AirpadPacketKind;
    from: string;
    to: string;
    routeSource: string;
    routeTarget: string;
    targetSource: "explicit" | "fallback";
    payload: unknown;
    createdAt: number;
};

type SessionState = { id: string; seq: number };

const normalizeHint = (value: unknown): string => String(value || "").trim().toLowerCase();

const payloadSignature = (value: unknown): string => {
    if (value == null) return "null";
    if (typeof value === "string") return `s:${value.length}`;
    if (typeof value === "number" || typeof value === "boolean") return `p:${String(value)}`;
    if (Array.isArray(value)) return `a:${value.length}`;
    if (typeof value === "object") {
        const keys = Object.keys(value as Record<string, unknown>).sort();
        return `o:${keys.join("|").slice(0, 120)}`;
    }
    return typeof value;
};

export const createSessionSequencer = () => {
    const sessions = new Map<string, SessionState>();
    return {
        next(sourceKey: string): SessionState {
            const key = normalizeHint(sourceKey) || "unknown";
            const existing = sessions.get(key);
            if (!existing) {
                const state = { id: randomUUID(), seq: 1 };
                sessions.set(key, state);
                return { ...state };
            }
            existing.seq += 1;
            return { ...existing };
        }
    };
};

export const createRecentPacketCache = (ttlMs: number, maxEntries: number) => {
    const cache = new Map<string, number>();
    const safeTtl = Math.max(100, Number(ttlMs) || 1200);
    const safeMax = Math.max(256, Number(maxEntries) || 4096);
    const prune = (now = Date.now()) => {
        for (const [key, ts] of cache.entries()) {
            if (now - ts > safeTtl) cache.delete(key);
        }
        if (cache.size > safeMax) {
            const overflow = cache.size - safeMax;
            let i = 0;
            for (const key of cache.keys()) {
                cache.delete(key);
                i += 1;
                if (i >= overflow) break;
            }
        }
    };
    return {
        seen(signature: string, now = Date.now()): boolean {
            prune(now);
            return cache.has(signature);
        },
        remember(signature: string, now = Date.now()): void {
            prune(now);
            cache.set(signature, now);
        }
    };
};

export const fingerprintPacket = (packet: Pick<AirpadPacketEnvelope, "packetId" | "from" | "to" | "kind" | "payload">): string => {
    const packetId = normalizeHint(packet.packetId);
    // Dedupe only by explicit packet IDs; value-derived fingerprints can
    // accidentally collapse high-frequency control traffic (mouse move stream).
    if (!packetId) return "";
    return `id:${packetId}`;
};

export const createPacketEnvelope = (input: {
    kind: AirpadPacketKind;
    sourceId: string;
    targetId: string;
    routeSource?: string;
    routeTarget?: string;
    targetSource?: "explicit" | "fallback";
    packetId?: string;
    hop?: number;
    payload: unknown;
    sequencer: ReturnType<typeof createSessionSequencer>;
}): AirpadPacketEnvelope => {
    const sourceId = normalizeHint(input.sourceId);
    const targetId = normalizeHint(input.targetId);
    const seqState = input.sequencer.next(sourceId || "unknown");
    return {
        packetId: normalizeHint(input.packetId) || randomUUID(),
        seq: seqState.seq,
        sessionId: seqState.id,
        hop: Math.max(0, Number(input.hop) || 0),
        kind: input.kind,
        from: sourceId,
        to: targetId,
        routeSource: normalizeHint(input.routeSource) || sourceId,
        routeTarget: normalizeHint(input.routeTarget) || targetId,
        targetSource: input.targetSource === "fallback" ? "fallback" : "explicit",
        payload: input.payload,
        createdAt: Date.now()
    };
};
