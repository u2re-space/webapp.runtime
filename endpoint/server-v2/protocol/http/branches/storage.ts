import { registerStorageRoutes } from "@protocol/http/routers/storage/storage.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const storageHttpBranch: ServerV2HttpBranch = {
    id: "storage",
    label: "Storage",
    routes: [
        { method: "POST", path: "/core/storage/list" },
        { method: "POST", path: "/core/storage/get" },
        { method: "POST", path: "/core/storage/put" },
        { method: "POST", path: "/core/storage/delete" },
        { method: "POST", path: "/core/storage/sync" },
        { method: "POST", path: "/api/storage/list" },
        { method: "POST", path: "/api/storage/get" },
        { method: "POST", path: "/api/storage/put" },
        { method: "POST", path: "/api/storage/delete" },
        { method: "POST", path: "/api/storage/sync" },
        { method: "POST", path: "/api/storage" }
    ],
    register: async ({ app }) => {
        await registerStorageRoutes(app);
    }
};
