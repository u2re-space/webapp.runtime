import { Promised } from "../../../utils/Promised.ts";import { Packet } from "../coordinator.ts";

//
export const handleClipboardAction = async (what: string, payload: any, packet: Packet) => {
    const driver = Promised(Promised(await import("../../../inputs/drivers/clipboardy.ts"))?.default);
    if (!driver) return null;
    switch (what) {
        case "clipboard:update":
            return driver?.write?.(payload.text);
        case "clipboard:read":
            return driver?.read?.();
        case "clipboard:get":
            return driver?.write?.(payload.text);
        case "clipboard:clear":
            return driver?.clear?.();
        default:
            return null;
    }
}

//
export const handleClipboardAsk = async (what: string, payload: any, packet: Packet) => {
    const driver = Promised(Promised(await import("../../../inputs/drivers/clipboardy.ts"))?.default);
    if (!driver) return null;
    switch (what) {
        case "clipboard:isReady":
            return driver?.isReady?.();
        default:
            return null;
    }
}
