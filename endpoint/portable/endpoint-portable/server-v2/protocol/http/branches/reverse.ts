import { registerTransportHttpHandlers } from "@protocol/http/handlers/transport.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const reverseHttpBranch: ServerV2HttpBranch = {
    id: "reverse",
    label: "Reverse",
    notes: "Server-v2 owned reverse send/device aliases.",
    routes: [
        { method: "POST", path: "/core/reverse/send" },
        { method: "POST", path: "/api/reverse/send" },
        { method: "POST", path: "/core/reverse/devices" },
        { method: "POST", path: "/api/reverse/devices" }
    ],
    register: async ({ app, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] reverse branch requires runtime context");
        }
        await registerTransportHttpHandlers(app, wsHub);
    }
};
