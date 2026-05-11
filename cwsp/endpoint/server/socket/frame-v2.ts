import type { NetworkFrame, Packet, PacketVerb } from "./types.ts";

/**
 * Canonical frame <-> packet mapping for the endpoint socket stack.
 *
 * AI-READ: this file is the narrow contract boundary between transport-shaped
 * websocket frames and coordinator-shaped packets used elsewhere in the runtime.
 */
const FRAME_TO_PACKET_OP: Record<string, PacketVerb> = {
    request: "ask",
    response: "result",
    signal: "act",
    notify: "act",
    redirect: "act",
    ack: "result",
    resolve: "result",
    error: "error",
    ask: "ask",
    act: "act",
    result: "result"
};

const PACKET_TO_FRAME_OP: Record<string, string> = {
    ask: "request",
    act: "act",
    result: "response",
    resolve: "response",
    error: "error"
};

const normalizeString = (value: unknown): string => String(value || "").trim();
const isRecord = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value);

const normalizeList = (...candidates: unknown[]): string[] => {
    const out = new Set<string>();
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            for (const item of candidate) {
                const normalized = normalizeString(item);
                if (normalized) out.add(normalized);
            }
            continue;
        }
        const normalized = normalizeString(candidate);
        if (normalized) out.add(normalized);
    }
    return Array.from(out);
};

const resolvePayload = (frame: Record<string, unknown>) => {
    // Preserve payload precedence so newer frame senders win, but legacy
    // `data` / `body` carriers still decode into the same coordinator packet.
    if (frame.payload !== undefined) return frame.payload;
    if (frame.data !== undefined) return frame.data;
    if (frame.body !== undefined) return frame.body;
    return undefined;
};

const normalizeIdsRecord = (value: unknown, sender: string, destinations: string[]): Record<string, unknown> => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    const out: Record<string, unknown> = {};
    if (sender) out.byId = sender;
    if (destinations.length) out.destinations = destinations;
    return out;
};

const inferPurpose = (what: string): string => {
    const normalized = what.trim().toLowerCase();
    if (normalized.startsWith("airpad:")) return "airpad";
    if (normalized.startsWith("clipboard:")) return "clipboard";
    if (normalized.startsWith("keyboard:") || normalized.startsWith("mouse:")) return "input";
    if (normalized.startsWith("sms:")) return "sms";
    if (normalized.startsWith("contact:") || normalized.startsWith("contacts:")) return "contact";
    if (normalized.startsWith("notification:") || normalized.startsWith("notifications:")) return "notification";
    return "generic";
};

export const normalizeIncomingFrameOp = (value: unknown): PacketVerb => {
    const raw = normalizeString(value).toLowerCase();
    return FRAME_TO_PACKET_OP[raw] || "act";
};

export const mapPacketOpToFrame = (value: unknown): string => {
    const raw = normalizeString(value).toLowerCase();
    return PACKET_TO_FRAME_OP[raw] || (raw || "act");
};

export const normalizeFrameV2 = (input: Record<string, unknown>): NetworkFrame => {
    const destinations = normalizeList(input.destinations, input.nodes, input.target, input.targetId);
    const sender = normalizeString(input.sender || input.byId || input.from);
    const what = normalizeString(input.what || input.type || input.action || input.op || "dispatch");
    const frameOp = mapPacketOpToFrame(input.op || input.type);
    const payload = resolvePayload(input);
    const protocol = normalizeString(input.protocol || input.transport || "ws");
    const timestamp = Number(input.timestamp);
    const statusRaw = Number(input.status);
    const normalized: NetworkFrame = {
        ...input,
        op: frameOp as NetworkFrame["op"],
        type: normalizeString(input.type || what || frameOp) || what || frameOp,
        what,
        purpose: normalizeString(input.purpose || inferPurpose(what)),
        protocol: protocol || "ws",
        // NOTE: both `sender` and `byId` appear in the wild; normalize to one
        // sender field here and let packet conversion mirror it back later.
        sender: sender || undefined,
        destinations,
        // Keep `ids` as an object-shaped compatibility slot because some older
        // bridges expect metadata there even when nodes/destinations already exist.
        ids: normalizeIdsRecord(input.ids, sender, destinations),
        payload,
        data: payload,
        uuid: normalizeString(input.uuid) || undefined,
        timestamp: Number.isFinite(timestamp) && timestamp > 0 ? Math.trunc(timestamp) : Date.now(),
        status: Number.isFinite(statusRaw) ? Math.trunc(statusRaw) : undefined
    };
    return normalized;
};

export const frameToPacket = (frameInput: Record<string, unknown>): Packet => {
    const frame = normalizeFrameV2(frameInput);
    const op = normalizeIncomingFrameOp(frame.op);
    const destinations = normalizeList(frame.destinations, frame.nodes);
    const sender = normalizeString(frame.sender || frame.byId || frame.from);
    return {
        ...frame,
        op,
        what: normalizeString(frame.what || frame.type || "dispatch"),
        payload: frame.payload ?? frame.data ?? frame.body,
        // WHY: coordinator routing still keys off `nodes`, even when newer
        // websocket/native frame senders prefer `destinations`.
        nodes: destinations,
        destinations,
        byId: sender || undefined,
        from: normalizeString(frame.from || sender) || undefined,
        sender: sender || undefined,
        uuid: normalizeString(frame.uuid) || undefined,
        protocol: normalizeString(frame.protocol || "ws"),
        purpose: normalizeString(frame.purpose || inferPurpose(normalizeString(frame.what || ""))) || "generic",
        timestamp: Number.isFinite(Number(frame.timestamp)) ? Number(frame.timestamp) : Date.now(),
        result: frame.result ?? frame.results,
        results: frame.results
    } as Packet;
};

export const packetToFrame = (packetInput: Record<string, unknown>, defaultSender: string): NetworkFrame => {
    const packet = packetInput as Packet;
    const sender = normalizeString(packet.sender || packet.byId || packet.from || defaultSender);
    const destinations = normalizeList(packet.destinations, packet.nodes, (packet as any).target, (packet as any).targetId);
    const what = normalizeString(packet.what || packet.type || packet.op || "dispatch");
    const rawPayload = packet.payload ?? (packet as any).data ?? packet.body;
    const compatNodes = isRecord(rawPayload) && Array.isArray(rawPayload.nodes) ? rawPayload.nodes : undefined;
    const compatDestinations = isRecord(rawPayload) && Array.isArray(rawPayload.destinations) ? rawPayload.destinations : undefined;
    const payload = isRecord(rawPayload)
        ? {
              ...rawPayload,
              op: normalizeString((rawPayload as Record<string, unknown>).op || packet.op || "act"),
              what: normalizeString((rawPayload as Record<string, unknown>).what || what),
              type: normalizeString((rawPayload as Record<string, unknown>).type || packet.type || what),
              byId: normalizeString((rawPayload as Record<string, unknown>).byId || sender) || undefined,
              from: normalizeString((rawPayload as Record<string, unknown>).from || sender) || undefined,
              nodes: compatNodes && compatNodes.length > 0 ? compatNodes : destinations,
              destinations: compatDestinations && compatDestinations.length > 0 ? compatDestinations : destinations
          }
        : rawPayload === undefined
          ? {
                op: normalizeString(packet.op || "act"),
                what,
                type: normalizeString(packet.type || what),
                byId: sender || undefined,
                from: sender || undefined,
                nodes: destinations,
                destinations
            }
          : rawPayload;
    const frame = normalizeFrameV2({
        ...packet,
        op: mapPacketOpToFrame(packet.op),
        what,
        type: normalizeString(packet.type || what),
        protocol: normalizeString(packet.protocol || "ws"),
        purpose: normalizeString(packet.purpose || inferPurpose(what)),
        sender,
        destinations,
        ids: normalizeIdsRecord(packet.ids, sender, destinations),
        payload,
        data: payload,
        result: packet.result,
        results: packet.results,
        status: (packet as any).status
    });
    if (!frame.sender && sender) frame.sender = sender;
    // NOTE: packet callers are allowed to omit uuid/timestamp; the frame layer
    // fills them in so diagnostics and resolver tracking always have anchors.
    if (!frame.uuid) frame.uuid = normalizeString(packet.uuid) || undefined;
    if (!frame.timestamp || frame.timestamp <= 0) frame.timestamp = Date.now();
    return frame;
};
