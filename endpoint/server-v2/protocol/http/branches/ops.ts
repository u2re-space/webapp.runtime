import { registerOpsHttpRouter } from "@protocol/http/routers/ops/ops.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const opsHttpBranch: ServerV2HttpBranch = {
    id: "ops",
    label: "Ops",
    notes: "Operational feature endpoints. Legacy registrar still mounts request, dispatch, reverse, and network sub-branches together.",
    routes: [
        { method: "POST", path: "/core/ops/devices" },
        { method: "POST", path: "/api/devices" },
        { method: "POST", path: "/core/ops/sms" },
        { method: "POST", path: "/api/sms" },
        { method: "POST", path: "/core/ops/contacts" },
        { method: "POST", path: "/api/contacts" },
        { method: "POST", path: "/core/ops/notifications" },
        { method: "POST", path: "/api/notifications" },
        { method: "POST", path: "/core/ops/notifications/speak" },
        { method: "POST", path: "/api/notifications/speak" },
        { method: "POST", path: "/core/ops/notify" },
        { method: "POST", path: "/api/action" }
    ],
    register: async ({ app, networkContext, socketIoBridge, wsHub }) => {
        if (!wsHub) {
            throw new Error("[server-v2/http] ops branch requires wsHub");
        }
        await registerOpsHttpRouter(app, wsHub, networkContext, socketIoBridge);
    }
};
