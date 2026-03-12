import { Promised } from "../../../utils/Promised.ts";import { Packet } from "../coordinator.ts";

//
export const handleAirpadAction = async (what: string, payload: any, packet: Packet) => {
    const mouseAccess = Promised(Promised(await import("../../../inputs/access/mouse.ts"))?.default);
    const keyboardAccess = Promised(Promised(await import("../../../inputs/access/keyboard.ts"))?.default);
    const clipboardAccess = Promised(Promised(await import("../../../inputs/access/clipboard.ts"))?.default);
    if (!mouseAccess || !keyboardAccess || !clipboardAccess) return null;
    switch (what) {
        case "mouse:move":
            return mouseAccess?.move?.(payload.x, payload.y);
        case "mouse:click":
            return mouseAccess?.click?.(payload.button, payload.double);
        case "keyboard:tap":
            return keyboardAccess?.tap?.(payload.key, payload.modifier);
        case "keyboard:toggle":
            return keyboardAccess?.toggle?.(payload.key, payload.state);
        case "keyboard:type":
            return keyboardAccess?.type?.(payload.text);
        case "clipboard:read":
            return clipboardAccess?.read?.();
        case "clipboard:write":
            return clipboardAccess?.write?.(payload.text);
        case "clipboard:clear":
            return clipboardAccess?.clear?.();
        default:
            return null;
    }
}

//
export const handleAirpadAsk = async (what: string, payload: any, packet: Packet) => {
    const mouseAccess = Promised(Promised(await import("../../../inputs/access/mouse.ts"))?.default);
    const keyboardAccess = Promised(Promised(await import("../../../inputs/access/keyboard.ts"))?.default);
    const clipboardAccess = Promised(Promised(await import("../../../inputs/access/clipboard.ts"))?.default);
    if (!mouseAccess || !keyboardAccess || !clipboardAccess) return null;
    switch (what) {
        case "mouse:isReady":
            return mouseAccess?.isReady?.();
        case "keyboard:isReady":
            return keyboardAccess?.isReady?.();
        case "clipboard:isReady":
            return clipboardAccess?.isReady?.();
        default:
            return null;
    }
}
