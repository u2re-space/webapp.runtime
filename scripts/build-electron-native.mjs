#!/usr/bin/env node
/**
 * Run electron-builder in dist/electron (after npm run build:electron).
 * Artifacts: dist/electron/out/
 *
 * Examples (from runtime/cwsp):
 *   node scripts/build-electron-native.mjs
 *   node scripts/build-electron-native.mjs --win --x64
 *   node scripts/build-electron-native.mjs --linux AppImage
 *   node scripts/build-electron-native.mjs --mac --dir
 *
 * Android: Electron does not ship APK — use build:cws-android (Kotlin) or build:capacitor:android (Capacitor).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const appDir = resolve(pkgRoot, "dist", "electron");

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`Usage: node scripts/build-electron-native.mjs [electron-builder args...]

Default: electron-builder --publish never
  --dir          unpacked app only (fast debug)
  --win          Windows targets from package.json
  --linux        Linux targets
  --mac          macOS targets
  -w / -l / -m   shorthand for win/linux/mac

Requires: npm run build:electron (staged app under dist/electron/)`);
    process.exit(0);
}

if (!existsSync(resolve(appDir, "package.json"))) {
    console.error("[build:electron:native] Missing dist/electron/package.json — run npm run build:electron first.");
    process.exit(1);
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const shell = true;

const run = (cmd, args, opts = {}) => {
    const r = spawnSync(cmd, args, { stdio: "inherit", shell, cwd: appDir, ...opts });
    return r.status ?? 1;
};

let st = run(npm, ["install", "--no-audit", "--no-fund"]);
if (st !== 0) process.exit(st);

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const hasPublishFlag = argv.some((a) => a === "--publish" || a.startsWith("--publish="));
const ebArgs = ["electron-builder", ...argv];
if (!hasPublishFlag) {
    ebArgs.push("--publish", "never");
}
st = run(npx, ebArgs);
process.exit(st);
