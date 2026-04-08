#!/usr/bin/env node
/**
 * Cross-platform: build CrossWord CRX output and copy to ./pack/crx/
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const cw = path.join(repoRoot, "apps", "CrossWord");
const srcOut = path.join(cw, "dist-crx");
const dest = path.join(__dirname, "pack", "crx");

const run = (cmd, args, opts) => {
    const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, ...opts });
    return r.status ?? 1;
};

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
if (run(npmCmd, ["run", "build:crx"], { cwd: cw })) process.exit(1);
if (!existsSync(srcOut)) {
    console.error(`[pack-extension] missing ${srcOut} after build:crx`);
    process.exit(1);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(srcOut, dest, { recursive: true });
const n = (await readdir(dest)).length;
console.log(`[pack-extension] copied ${n} top entries to ${dest}`);
