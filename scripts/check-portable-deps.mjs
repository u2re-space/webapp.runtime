#!/usr/bin/env node
/**
 * Run on the portable folder (e.g. C:\Users\U2RE\cwsp-portable) after copy:
 *   node scripts/check-portable-deps.mjs
 *   node path/to/check-portable-deps.mjs "C:\Users\U2RE\cwsp-portable"
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const portableRoot = process.argv[2]?.trim() || process.cwd();

const required = [
    "cwsp.mjs",
    "package.json",
    "node_modules/socket.io/package.json",
    "node_modules/fastify/package.json",
    "node_modules/@fastify/cors/package.json"
];

let ok = true;
for (const rel of required) {
    const p = join(portableRoot, rel);
    if (!existsSync(p)) {
        console.error(`[check-portable] MISSING: ${rel}`);
        ok = false;
    }
}

if (!ok) {
    console.error(`[check-portable] Run install.cmd or: cd "${portableRoot}" && npm install --omit=dev`);
    process.exit(1);
}

const { statSync } = await import("node:fs");
const st = statSync(join(portableRoot, "cwsp.mjs"));
if (st.size < 50_000) {
    console.error(`[check-portable] cwsp.mjs too small (${st.size} B) — corrupt?`);
    process.exit(1);
}

console.log(`[check-portable] OK ${portableRoot} (cwsp.mjs ${Math.round(st.size / 1024)} KiB)`);
console.log(`[check-portable] Tip: copy the whole dist/portable folder, not cwsp.mjs alone.`);
