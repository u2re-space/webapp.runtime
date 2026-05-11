import { registerAuthRoutes } from "@protocol/http/routers/auth/index.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const authHttpBranch: ServerV2HttpBranch = {
    id: "auth",
    label: "Auth",
    routes: [
        { method: "POST", path: "/core/auth/register" },
        { method: "POST", path: "/core/auth/rotate" },
        { method: "GET", path: "/core/auth/users" },
        { method: "POST", path: "/core/auth/delete" }
    ],
    register: async ({ app }) => {
        await registerAuthRoutes(app);
    }
};
