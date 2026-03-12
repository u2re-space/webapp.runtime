import { registerClipboardHttpRouter } from "@protocol/http/routers/clipboard/index.ts";

import type { ServerV2HttpBranch } from "../types.ts";

export const clipboardHttpBranch: ServerV2HttpBranch = {
    id: "clipboard",
    label: "Clipboard",
    routes: [
        { method: "POST", path: "/clipboard" }
    ],
    register: async ({ app }) => {
        registerClipboardHttpRouter(app);
    }
};
