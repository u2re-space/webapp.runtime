import type { ServerV2HttpBranch } from "../types.ts";

export const reverseHttpBranch: ServerV2HttpBranch = {
    id: "reverse",
    label: "Reverse",
    notes: "Mounted today by the shared legacy ops registrar.",
    routes: [
        { method: "POST", path: "/core/reverse/send" },
        { method: "POST", path: "/api/reverse/send" },
        { method: "POST", path: "/core/reverse/devices" },
        { method: "POST", path: "/api/reverse/devices" }
    ]
};
