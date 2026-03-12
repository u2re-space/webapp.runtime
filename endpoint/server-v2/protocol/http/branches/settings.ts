import { registerCoreSettingsEndpoints, registerCoreSettingsRoutes } from "@protocol/http/routers/settings/settings.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const settingsHttpBranch: ServerV2HttpBranch = {
    id: "settings",
    label: "Settings",
    notes: "Mounted through legacy settings registrars until server-v2 gets independent handlers.",
    routes: [
        { method: "GET", path: "/health" },
        { method: "GET", path: "/core/admin/prefs" },
        { method: "POST", path: "/core/admin/prefs" },
        { method: "GET", path: "/api/config/:filename" },
        { method: "GET", path: "/core/user/settings" },
        { method: "POST", path: "/core/user/settings" }
    ],
    register: async ({ app }) => {
        await registerCoreSettingsEndpoints(app);
        await registerCoreSettingsRoutes(app);
    }
};
