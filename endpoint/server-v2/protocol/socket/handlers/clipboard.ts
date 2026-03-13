import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";

const loadClipboardAccess = async () => {
    return Promised(Promised(await import("../../../inputs/access/clipboard.ts"))?.default);
};

//
export const handleClipboardAction = async (what: string, payload: any, packet: Packet) => {
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    switch (what) {
        case "clipboard:update":
        case "clipboard:write":
            return clipboardAccess?.write?.(payload.text);
        case "clipboard:read":
        case "clipboard:get":
            return clipboardAccess?.read?.();
        case "clipboard:clear":
            return clipboardAccess?.clear?.();
        default:
            return null;
    }
}

//
export const handleClipboardAsk = async (what: string, payload: any, packet: Packet) => {
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    switch (what) {
        case "clipboard:isReady":
            return clipboardAccess?.isReady?.();
        default:
            return null;
    }
}
