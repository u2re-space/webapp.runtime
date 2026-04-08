import { registerGptRoutes } from "@protocol/http/routers/assistant/index.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const aiHttpBranch: ServerV2HttpBranch = {
    id: "ai",
    label: "AI",
    routes: [
        { method: "POST", path: "/core/ai/recognize" },
        { method: "POST", path: "/core/ai/analyze" },
        { method: "POST", path: "/core/ai/timeline" },
        { method: "POST", path: "/api/processing" },
        { method: "POST", path: "/api/ai/:suffix", notes: "Passthrough GPT proxy branch" },
        { method: "POST", path: "/core/ai/:suffix", notes: "Passthrough GPT proxy branch" }
    ],
    register: async ({ app }) => {
        await registerGptRoutes(app);
    }
};
