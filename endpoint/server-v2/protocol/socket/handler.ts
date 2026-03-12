import { Packet } from "./coordinator.ts";
import { handleAirpadAction } from "./handlers/airpad.ts";
import { handleClipboardAction } from "./handlers/clipboard.ts";
import { handleAirpadAsk } from "./handlers/airpad.ts";
import { handleClipboardAsk } from "./handlers/clipboard.ts";

// post-handler for act
export const makePostHandler = (op, what, payload) => { 
    if (op == "act") {
        switch (what) {
            case "clipboard:read": {
                const withResolvers = Promise.withResolvers();
                return {
                    promise: withResolvers.promise,
                    resolve: (result: any) => {
                        // TODO: locally clipboard write
                        withResolvers.resolve?.({ result });
                        return result;
                    },
                    reject: (error: any) => {
                        withResolvers.reject?.({ error });
                        return error;
                    }
                }
            }
            default: return Promise.withResolvers();
        }
    }
    return Promise.withResolvers();
}

//
export const handleAct = (what: string, payload: any, packet: Packet) => {
    const airpadResult = handleAirpadAction(what, payload, packet);
    if (airpadResult) return airpadResult;
    const clipboardResult = handleClipboardAction(what, payload, packet);
    if (clipboardResult) return clipboardResult;
    return packet;
}

//
export const handleAsk = (what: string, payload: any, packet: Packet) => {
    const airpadResult = handleAirpadAsk(what, payload, packet);
    if (airpadResult) return airpadResult;
    const clipboardResult = handleClipboardAsk(what, payload, packet);
    if (clipboardResult) return clipboardResult;
    return packet;
}

