import { registerTransportHttpHandlers } from "@protocol/http/handlers/transport.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const clipboardHttpBranch: ServerV2HttpBranch = {
    id: "clipboard",
    label: "Clipboard",
    routes: [
        { method: "POST", path: "/clipboard" }
    ],
    register: async ({ app, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] clipboard branch requires runtime context");
        }
        await registerTransportHttpHandlers(app, wsHub);
    }
};
