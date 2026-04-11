import {
    buttonFromFlags,
    isKeyboardMessage,
    isMouseMessage,
    parseBinaryMessage
} from "../inputs/drivers/adapters/message.ts";
import {
    FLAG_DOUBLE,
    MSG_TYPE_CLICK,
    MSG_TYPE_MOUSE_DOWN,
    MSG_TYPE_MOUSE_UP,
    MSG_TYPE_MOVE,
    MSG_TYPE_SCROLL
} from "../inputs/drivers/adapters/constants.ts";
import type { Packet } from "./types.ts";

export const inferWhatFromLegacyType = (value: unknown): string | undefined => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return undefined;
    if (normalized.includes(":")) return normalized;
    if (normalized === "clipboard") return "clipboard:update";
    if (normalized === "sms") return "sms:send";
    if (normalized === "notifications" || normalized === "notify") return "notification:speak";
    if (normalized === "dispatch") return "network:dispatch";
    return normalized;
};

const isBinaryEnvelope = (value: unknown): value is Uint8Array | ArrayBuffer => {
    return value instanceof Uint8Array || value instanceof ArrayBuffer;
};

const isPacketLike = (value: unknown): value is Packet => {
    return !!value && typeof value === "object" && (
        "op" in (value as Record<string, unknown>) ||
        "what" in (value as Record<string, unknown>) ||
        "nodes" in (value as Record<string, unknown>) ||
        "result" in (value as Record<string, unknown>) ||
        "error" in (value as Record<string, unknown>)
    );
};

const normalizeLegacyKeyboardKey = (codePoint: number, flags: number): { what: string; payload: any } | undefined => {
    switch (flags) {
        case 1:
            return { what: "keyboard:tap", payload: { key: "backspace" } };
        case 2:
            return { what: "keyboard:tap", payload: { key: "enter" } };
        case 3:
            return { what: "keyboard:tap", payload: { key: "space" } };
        case 4:
            return { what: "keyboard:tap", payload: { key: "tab" } };
        default:
            break;
    }

    try {
        return {
            what: "keyboard:type",
            payload: { text: String.fromCodePoint(codePoint || 0) }
        };
    } catch {
        return undefined;
    }
};

export const normalizeLegacyIncomingPacket = (raw: unknown): Packet | unknown => {
    if (isBinaryEnvelope(raw)) {
        const message = parseBinaryMessage(raw);
        if (!message) return undefined;

        if (isKeyboardMessage(message)) {
            const normalized = normalizeLegacyKeyboardKey(message.codePoint, message.flags);
            if (!normalized) return undefined;
            return {
                op: "act",
                what: normalized.what,
                payload: normalized.payload
            } as Packet;
        }

        if (!isMouseMessage(message)) {
            return undefined;
        }

        switch (message.type) {
            case MSG_TYPE_MOVE:
                return { op: "act", what: "mouse:move", payload: { x: message.dx || 0, y: message.dy || 0 } } as Packet;
            case MSG_TYPE_CLICK:
                return {
                    op: "act",
                    what: "mouse:click",
                    payload: {
                        button: buttonFromFlags(message.flags),
                        double: !!(message.flags && (message.flags & FLAG_DOUBLE))
                    }
                } as Packet;
            case MSG_TYPE_SCROLL:
                return {
                    op: "act",
                    what: "mouse:scroll",
                    payload: { dx: message.dx || 0, dy: message.dy || 0 }
                } as Packet;
            case MSG_TYPE_MOUSE_DOWN:
                return { op: "act", what: "mouse:down", payload: { button: buttonFromFlags(message.flags) } } as Packet;
            case MSG_TYPE_MOUSE_UP:
                return { op: "act", what: "mouse:up", payload: { button: buttonFromFlags(message.flags) } } as Packet;
            default:
                return undefined;
        }
    }

    if (typeof raw === "string") {
        try {
            return JSON.parse(raw);
        } catch {
            return undefined;
        }
    }

    if (!raw || typeof raw !== "object" || isPacketLike(raw)) {
        return raw;
    }

    const legacy = raw as Record<string, unknown>;
    const type = String(legacy.type || "").trim().toLowerCase();
    if (!type) return legacy;

    switch (type) {
        case "move":
            return { op: "act", what: "mouse:move", payload: { x: legacy.dx || 0, y: legacy.dy || 0 } } as Packet;
        case "click":
            return {
                op: "act",
                what: "mouse:click",
                payload: {
                    button: legacy.button || "left",
                    double: Boolean(legacy.double || Number(legacy.count || 0) >= 2)
                }
            } as Packet;
        case "scroll":
            return { op: "act", what: "mouse:scroll", payload: { dx: legacy.dx || 0, dy: legacy.dy || 0 } } as Packet;
        case "mouse_down":
            return { op: "act", what: "mouse:down", payload: { button: legacy.button || "left" } } as Packet;
        case "mouse_up":
            return { op: "act", what: "mouse:up", payload: { button: legacy.button || "left" } } as Packet;
        case "keyboard":
            if (typeof legacy.char === "string" && legacy.char) {
                return { op: "act", what: "keyboard:type", payload: { text: legacy.char } } as Packet;
            }
            if (typeof legacy.codePoint === "number") {
                const normalized = normalizeLegacyKeyboardKey(legacy.codePoint, Number(legacy.flags || 0));
                if (normalized) {
                    return { op: "act", what: normalized.what, payload: normalized.payload } as Packet;
                }
            }
            return undefined;
        case "voice_command":
            return { op: "act", what: "voice:submit", payload: { text: legacy.text || "" } } as Packet;
        default:
            return legacy;
    }
};

export const normalizeInboundPacket = (raw: unknown): Packet | undefined => {
    try {
        const parsed = normalizeLegacyIncomingPacket(raw);
        if (!parsed || typeof parsed !== "object") return undefined;
        const packet = parsed as Packet;
        if (!packet.what) {
            packet.what = inferWhatFromLegacyType((packet as any)?.type);
        }
        if (packet.payload === undefined && (packet as any)?.data !== undefined) {
            packet.payload = (packet as any).data;
        }
        if (!packet.op) {
            packet.op = packet.result !== undefined ? "result" : packet.error !== undefined ? "error" : "act";
        }
        return packet;
    } catch {
        return undefined;
    }
};

export const ensurePacket = (raw: unknown): Packet | null => {
    return normalizeInboundPacket(raw) || null;
};
