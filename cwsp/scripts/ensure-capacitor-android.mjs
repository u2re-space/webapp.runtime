#!/usr/bin/env node
/**
 * Ensure `android/` exists for Capacitor (non-interactive `npx cap add android`).
 * Capacitor requires `webDir` (dist/capacitor) to contain index.html before add — this script
 * runs build:capacitor:web when that file is missing.
 */
import { existsSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { buildCapacitorWeb } from "./build-capacitor-web.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgRoot = resolveCwspPackageRoot(__dirname);
const androidDir = resolve(pkgRoot, "android");
const webIndex = resolve(pkgRoot, "dist/capacitor/index.html");

export async function ensureCapacitorAndroid() {
    if (existsSync(androidDir)) {
        console.log("[cap] android/ already present");
        return 0;
    }
    if (!existsSync(webIndex)) {
        console.log("[cap] dist/capacitor/index.html missing — running build:capacitor:web …");
        const skipPortable = ["1", "true", "yes", "on"].includes(
            String(process.env.CWS_CAP_ADD_SKIP_PORTABLE || "").trim().toLowerCase()
        );
        await buildCapacitorWeb({ skipPortable });
    }
    if (!existsSync(webIndex)) {
        console.error(`[cap] Still missing ${webIndex} — set CWS_FRONTEND_SRC or run build:portable.`);
        return 1;
    }
    console.log("[cap] Adding Android platform: npx cap add android …");
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    const r = spawnSync(npx, ["cap", "add", "android"], {
        cwd: pkgRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
        env: { ...process.env }
    });
    if (r.status !== 0) {
        console.error("[cap] cap add android failed");
        return r.status ?? 1;
    }
    return 0;
}

const _entry = process.argv[1];
let isMain = false;
if (_entry) {
    try {
        isMain = realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(_entry));
    } catch {
        /* ignore */
    }
}
if (isMain) {
    ensureCapacitorAndroid()
        .then((code) => process.exit(code))
        .catch((err) => {
            console.error("[cap] ensure-capacitor-android failed:", err);
            process.exit(1);
        });
}
