import type { ServerV2HttpBranch } from "../types.ts";
import { registerSystemHttpHandlers } from "../handlers/system.ts";

export const systemHttpBranch: ServerV2HttpBranch = {
    id: "system",
    label: "System",
    notes: "Server-v2 owned health, readiness, API surface, and probe routes.",
    routes: [
        { method: "GET", path: "/api" },
        { method: "GET", path: "/healthz" },
        { method: "GET", path: "/readyz" },
        { method: "GET", path: "/api/system/status" },
        { method: "GET", path: "/api/system/tls" },
        { method: "GET", path: "/api/system/tls/rootCA.crt" },
        { method: "OPTIONS", path: "/lna-probe" },
        { method: "GET", path: "/lna-probe" }
    ],
    register: async ({ app }) => {
        await registerSystemHttpHandlers(app);
    }
};
