import type { ServerV2HttpBranch } from "../types.ts";

export const dispatchHttpBranch: ServerV2HttpBranch = {
    id: "dispatch",
    label: "Dispatch",
    notes: "Mounted today by the shared legacy ops registrar.",
    routes: [
        { method: "POST", path: "/core/ops/http/dispatch" },
        { method: "POST", path: "/core/ops/http/disp" },
        { method: "POST", path: "/api/broadcast" },
        { method: "POST", path: "/core/ops/ws/send" },
        { method: "POST", path: "/api/ws" }
    ]
};
