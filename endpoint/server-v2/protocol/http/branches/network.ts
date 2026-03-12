import type { ServerV2HttpBranch } from "../types.ts";

export const networkHttpBranch: ServerV2HttpBranch = {
    id: "network",
    label: "Network",
    notes: "Mounted today by the shared legacy ops registrar.",
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
    ]
};
