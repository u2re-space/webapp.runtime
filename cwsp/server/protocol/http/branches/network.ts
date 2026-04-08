import { registerTransportHttpHandlers } from "@protocol/http/handlers/transport.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const networkHttpBranch: ServerV2HttpBranch = {
    id: "network",
    label: "Network",
    notes: "Server-v2 owned network status/topology/dispatch aliases.",
    routes: [
        { method: "POST", path: "/core/network/topology" },
        { method: "POST", path: "/api/network/topology" },
        { method: "POST", path: "/core/network/connections" },
        { method: "POST", path: "/api/network/connections" },
        { method: "POST", path: "/core/network/status" },
        { method: "POST", path: "/api/network/status" },
        { method: "POST", path: "/core/network/dispatch" },
        { method: "POST", path: "/api/network/dispatch" },
        { method: "POST", path: "/core/network/fetch" },
        { method: "POST", path: "/api/network/fetch" }
    ],
    register: async ({ app, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] network branch requires runtime context");
        }
        await registerTransportHttpHandlers(app, wsHub);
    }
};
