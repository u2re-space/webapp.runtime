import type { Packet } from "../types.ts";

export const handleAiAction = async (what: string, payload: any, packet: Packet) => {
    if (!what.startsWith("ai:")) return null;
    return { ok: true, handled: true, reason: "ai-action-received" };
};

export const handleAiAsk = async (what: string, payload: any, packet: Packet) => {
    if (!what.startsWith("ai:")) return null;
    if (what === "ai:proxy") {
        // Basic AI proxy capability placeholder
        return { ok: true, handled: true, result: "AI response placeholder" };
    }
    return { ok: false, handled: false, reason: "unsupported-ai-ask" };
};
