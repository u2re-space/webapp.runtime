import type { ServerV2HttpBranch } from "../types.ts";

export const bridgeHttpBranch: ServerV2HttpBranch = {
    id: "bridge",
    label: "Bridge",
    notes: "Bridge routes are exposed by the Socket.IO bridge transport during transport bootstrap.",
    routes: [
        { method: "GET", path: "/core/bridge/devices" },
        { method: "GET", path: "/core/bridge/history" }
    ]
};
