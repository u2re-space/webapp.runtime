import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";
import { sendVoiceToPython } from "../../fastify/routers/assistant/python.ts";

type NormalizedAirpadAction = {
    what: string;
    payload: Record<string, unknown>;
};

const asObject = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
};

const asNumber = (value: unknown, fallback = 0): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

const asText = (value: unknown): string => (typeof value === "string" ? value : "").trim();

const resolveSpecOp = (payload: Record<string, unknown>): string => {
    const explicit = asText(payload.op || payload.action || payload.type).toLowerCase();
    if (explicit) return explicit;
    const params = Array.isArray(payload.params) ? payload.params : [];
    return asText(params[0]).toLowerCase();
};

const normalizeAirpadAction = (what: string, payload: unknown): NormalizedAirpadAction => {
    const normalizedWhat = String(what || "").trim().toLowerCase();
    const body = asObject(payload);
    if (normalizedWhat !== "airpad:mouse" && normalizedWhat !== "airpad:keyboard") {
        return { what: normalizedWhat, payload: body };
    }
    const data = asObject(body.data);
    const op = resolveSpecOp(body);
    if (normalizedWhat === "airpad:mouse") {
        switch (op) {
            case "mouse:move":
            case "move":
                return { what: "mouse:move", payload: { x: asNumber(data.x), y: asNumber(data.y), z: asNumber(data.z) } };
            case "mouse:click":
            case "click":
                return {
                    what: "mouse:click",
                    payload: { button: asText(data.button) || "left", double: Boolean(data.double || data.dbl || data.count === 2) }
                };
            case "mouse:scroll":
            case "scroll":
                return { what: "mouse:scroll", payload: { dx: asNumber(data.dx), dy: asNumber(data.dy) } };
            case "mouse:down":
            case "down":
                return { what: "mouse:down", payload: { button: asText(data.button) || "left" } };
            case "mouse:up":
            case "up":
                return { what: "mouse:up", payload: { button: asText(data.button) || "left" } };
            default:
                return { what: normalizedWhat, payload: body };
        }
    }
    if (op === "keyboard:type" || op === "type") {
        return { what: "keyboard:type", payload: { text: asText(data.text) } };
    }
    if (op === "keyboard:toggle" || op === "toggle") {
        return { what: "keyboard:toggle", payload: { key: asText(data.key), state: Boolean(data.state) } };
    }
    if (op === "keyboard:tap" || op === "tap") {
        return {
            what: "keyboard:tap",
            payload: {
                key: asText(data.key),
                modifier: Array.isArray(data.modifier) ? data.modifier : []
            }
        };
    }
    return { what: normalizedWhat, payload: body };
};

//
export const handleAirpadAction = async (what: string, payload: any, packet: Packet) => {
    const mouseAccess = Promised(Promised(await import("@inputs/access/mouse.ts"))?.default);
    const keyboardAccess = Promised(Promised(await import("@inputs/access/keyboard.ts"))?.default);
    if (!mouseAccess || !keyboardAccess) return null;
    const normalized = normalizeAirpadAction(what, payload);
    switch (normalized.what) {
        case "mouse:move":
            return mouseAccess?.move?.(normalized.payload.x, normalized.payload.y);
        case "mouse:click":
            return mouseAccess?.click?.(normalized.payload.button, normalized.payload.double);
        case "mouse:scroll":
            return mouseAccess?.scroll?.(normalized.payload.dx, normalized.payload.dy);
        case "mouse:down":
            return mouseAccess?.down?.(normalized.payload.button);
        case "mouse:up":
            return mouseAccess?.up?.(normalized.payload.button);
        case "keyboard:tap":
            return keyboardAccess?.tap?.(normalized.payload.key, normalized.payload.modifier);
        case "keyboard:toggle":
            return keyboardAccess?.toggle?.(normalized.payload.key, normalized.payload.state);
        case "keyboard:type":
            return keyboardAccess?.type?.(normalized.payload.text);
        case "voice:submit":
            return sendVoiceToPython((packet as any).__socket, String(normalized.payload.text || ""));
        default:
            return null;
    }
}

//
export const handleAirpadAsk = async (what: string, payload: any, packet: Packet) => {
    const mouseAccess = Promised(Promised(await import("@inputs/access/mouse.ts"))?.default);
    const keyboardAccess = Promised(Promised(await import("@inputs/access/keyboard.ts"))?.default);
    if (!mouseAccess || !keyboardAccess) return null;
    switch (what) {
        case "mouse:isReady":
            return mouseAccess?.isReady?.();
        case "keyboard:isReady":
            return keyboardAccess?.isReady?.();
        default:
            return null;
    }
}
