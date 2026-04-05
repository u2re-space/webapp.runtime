import { registerTransportHttpHandlers } from "@protocol/http/handlers/transport.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const requestHttpBranch: ServerV2HttpBranch = {
    id: "request",
    label: "Request",
    notes: "Server-v2 owned request/fetch passthrough aliases.",
    routes: [
        { method: "POST", path: "/core/ops/http" },
        { method: "POST", path: "/core/ops/https" },
        { method: "POST", path: "/api/request" },
        { method: "POST", path: "/" },
        { method: "POST", path: "/core/request/fetch" },
        { method: "POST", path: "/api/request/fetch" }
    ],
    register: async ({ app, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] request branch requires runtime context");
        }
        await registerTransportHttpHandlers(app, wsHub);
    }
};
