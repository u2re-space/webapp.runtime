import type { ServerV2HttpBranch } from "../types.ts";
import { registerFallbackHttpHandlers } from "../handlers/fallback.ts";

export const fallbackHttpBranch: ServerV2HttpBranch = {
    id: "fallback",
    label: "Fallback",
    routes: [
        { method: "ALL", path: "/api/*", notes: "Unknown API endpoint fallback" }
    ],
    register: async ({ app }) => {
        await registerFallbackHttpHandlers(app);
    }
};
