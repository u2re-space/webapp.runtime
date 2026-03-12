import { registerSettingsHttpHandlers } from "@protocol/http/handlers/settings.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const settingsHttpBranch: ServerV2HttpBranch = {
    id: "settings",
    label: "Settings",
    notes: "Server-v2 owned settings, prefs, health, and config inspection endpoints.",
    routes: [
        { method: "GET", path: "/health" },
        { method: "GET", path: "/core/admin/prefs" },
        { method: "POST", path: "/core/admin/prefs" },
        { method: "GET", path: "/api/config/:filename" },
        { method: "GET", path: "/core/user/settings" },
        { method: "POST", path: "/core/user/settings" }
    ],
    register: async ({ app }) => {
        await registerSettingsHttpHandlers(app);
    }
};
