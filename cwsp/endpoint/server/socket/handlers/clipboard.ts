import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";
import { normalizeClipboardText } from "../../utils/routes.ts";
import { logger } from "../../utils/logger.ts";

const loadClipboardAccess = async () => {
    return Promised(Promised(await import("@inputs/access/clipboard.ts"))?.default);
};

//
export const handleClipboardAction = async (what: string, payload: any, packet: Packet) => {
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    try {
        switch (what) {
            case "clipboard:update":
            case "clipboard:write":
            case "airpad:clipboard:write":
            case "airpad:clipboard:delivery":
                const text = normalizeClipboardText(packet);
                logger.info("[clipboard:sync]", { what, textLength: text.length }, "Handling clipboard write");
                return clipboardAccess?.write?.(text);
            case "clipboard:read":
            case "clipboard:get":
            case "airpad:clipboard:read":
                logger.info("[clipboard:sync]", { what }, "Handling clipboard read");
                return clipboardAccess?.read?.();
            case "clipboard:clear":
                logger.info("[clipboard:sync]", { what }, "Handling clipboard clear");
                return clipboardAccess?.clear?.();
            default:
                return null;
        }
    } catch (error: any) {
        logger.error("[clipboard:sync]", { what, error: error?.message }, "Clipboard action failed");
        return {
            ok: false,
            reason: "clipboard-action-failed",
            what,
            error: error?.message || String(error)
        };
    }
}

//
export const handleClipboardAsk = async (what: string, payload: any, packet: Packet) => {
    const clipboardAccess = await loadClipboardAccess();
    if (!clipboardAccess) return null;
    try {
        switch (what) {
            case "clipboard:isReady":
            case "airpad:clipboard:isReady":
                return clipboardAccess?.isReady?.();
            default:
                return null;
        }
    } catch (error: any) {
        return {
            ok: false,
            reason: "clipboard-ask-failed",
            what,
            error: error?.message || String(error)
        };
    }
}
