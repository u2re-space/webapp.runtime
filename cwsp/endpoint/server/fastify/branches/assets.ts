import type { ServerV2HttpBranch } from "../types.ts";
import { registerAssetsHttpHandlers } from "@protocol/http/handlers/assets.ts";

export const assetsHttpBranch: ServerV2HttpBranch = {
    id: "assets",
    label: "Assets",
    notes: "Server-v2 owned admin and icon asset routes.",
    routes: [
        { method: "GET", path: "/admin" },
        { method: "GET", path: "/admin/icon.svg" },
        { method: "GET", path: "/icon.svg" },
        { method: "GET", path: "/assets/icons/phosphor" },
        { method: "GET", path: "/assets/icons/phosphor/:style/:icon" },
        { method: "GET", path: "/assets/icons/duotone" },
        { method: "GET", path: "/assets/icons/duotone/:icon" },
        { method: "GET", path: "/assets/icons" },
        { method: "GET", path: "/assets/icons/:style/:icon" },
        { method: "GET", path: "/assets/icons/:icon" }
    ],
    register: async ({ app }) => {
        await registerAssetsHttpHandlers(app);
    }
};
