import type { ServerV2HttpBranch } from "../types.ts";

export const requestHttpBranch: ServerV2HttpBranch = {
    id: "request",
    label: "Request",
    notes: "Mounted today by the shared legacy ops registrar.",
    routes: [
        { method: "POST", path: "/core/ops/http" },
        { method: "POST", path: "/core/ops/https" },
        { method: "POST", path: "/api/request" },
        { method: "POST", path: "/" },
        { method: "POST", path: "/core/request/fetch" },
        { method: "POST", path: "/api/request/fetch" }
    ]
};
