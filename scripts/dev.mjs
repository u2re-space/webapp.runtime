import { config } from "dotenv";
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

config({ path: resolve(__dirname, "dev.env"), quiet: true });

const defaults = {
    NODE_ENV: "development",
    CWS_BRIDGE_MODE: "active",
    CWS_TUNNEL_DEBUG: "1",
    CWS_AIRPAD_VERBOSE: "1"
};
for (const [key, value] of Object.entries(defaults)) {
    if (process.env[key] === undefined || process.env[key] === "") {
        process.env[key] = value;
    }
}

const child = spawn("npx", ["tsx", "watch", "--clear-screen=false", "server/index.ts"], {
    cwd: pkgRoot,
    stdio: "inherit",
    env: process.env,
    shell: true
});

child.on("exit", (code) => process.exit(code ?? 0));
