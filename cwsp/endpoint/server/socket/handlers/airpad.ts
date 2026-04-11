import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";
import { sendVoiceToPython } from "../../fastify/routers/assistant/python.ts";

//
export const handleAirpadAction = async (what: string, payload: any, packet: Packet) => {
    const mouseAccess = Promised(Promised(await import("@inputs/access/mouse.ts"))?.default);
    const keyboardAccess = Promised(Promised(await import("@inputs/access/keyboard.ts"))?.default);
    if (!mouseAccess || !keyboardAccess) return null;
    switch (what) {
        case "mouse:move":
            return mouseAccess?.move?.(payload.x, payload.y);
        case "mouse:click":
            return mouseAccess?.click?.(payload.button, payload.double);
        case "mouse:scroll":
            return mouseAccess?.scroll?.(payload.dx, payload.dy);
        case "mouse:down":
            return mouseAccess?.down?.(payload.button);
        case "mouse:up":
            return mouseAccess?.up?.(payload.button);
        case "keyboard:tap":
            return keyboardAccess?.tap?.(payload.key, payload.modifier);
        case "keyboard:toggle":
            return keyboardAccess?.toggle?.(payload.key, payload.state);
        case "keyboard:type":
            return keyboardAccess?.type?.(payload.text);
        case "voice:submit":
            return sendVoiceToPython((packet as any).__socket, payload.text);
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
