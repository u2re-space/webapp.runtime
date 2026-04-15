import { Promised } from "@utils/Promised.ts";
import type { Packet } from "../types.ts";

const loadClipboardAccess = async () => {
    return Promised(Promised(await import("@inputs/access/clipboard.ts"))?.default);
};

const asObject = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
};

const extractClipboardText = (payload: any): string => {
    if (typeof payload === "string") return payload;
    const top = asObject(payload);
    const data = asObject(top.data);
    if (typeof top.text === "string") return top.text;
    if (typeof top.content === "string") return top.content;
    if (typeof top.body === "string") return top.body;
    if (typeof data.text === "string") return data.text;
    if (typeof data.content === "string") return data.content;
    if (typeof data.body === "string") return data.body;
    return "";
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
                return clipboardAccess?.write?.(extractClipboardText(payload));
            case "clipboard:read":
            case "clipboard:get":
            case "airpad:clipboard:read":
                return clipboardAccess?.read?.();
            case "clipboard:clear":
                return clipboardAccess?.clear?.();
            default:
                return null;
        }
    } catch (error: any) {
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
