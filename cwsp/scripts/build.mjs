import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwspRoot = resolve(__dirname, "../cwsp");

console.log("[build] Delegating to cwsp-runtime build:portable → dist/portable");
const r = spawnSync(process.execPath, [resolve(cwspRoot, "scripts/build-portable.mjs")], {
    cwd: cwspRoot,
    stdio: "inherit"
});
if (r.status !== 0) process.exit(r.status ?? 1);
console.log("[build] CWSP Portable: runtime/cwsp/dist/portable/cwsp.mjs");
