#!/usr/bin/env node
/**
 * Build CWSP portable (and synced frontend) from monorepo `runtime/` root.
 * Delegates to cwsp package (works with `cwsp/scripts` → ../scripts symlink).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwspRoot = path.join(__dirname, "cwsp");
const r = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build:portable"], {
    cwd: cwspRoot,
    stdio: "inherit",
    shell: true,
    env: { ...process.env }
});
process.exit(r.status ?? 1);
