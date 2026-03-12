import { registerTransportHttpHandlers } from "@protocol/http/handlers/transport.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const dispatchHttpBranch: ServerV2HttpBranch = {
    id: "dispatch",
    label: "Dispatch",
    notes: "Server-v2 owned dispatch and ws-send aliases.",
    routes: [
        { method: "POST", path: "/core/ops/http/dispatch" },
        { method: "POST", path: "/core/ops/http/disp" },
        { method: "POST", path: "/api/broadcast" },
        { method: "POST", path: "/core/ops/ws/send" },
        { method: "POST", path: "/api/ws" }
    ],
    register: async ({ app, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] dispatch branch requires runtime context");
        }
        await registerTransportHttpHandlers(app, wsHub);
    }
};
