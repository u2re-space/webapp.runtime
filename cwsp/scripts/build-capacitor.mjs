#!/usr/bin/env node
/**
 * Capacitor native sync: portable frontend → dist/capacitor, then `cap sync android`.
 * Primary Android shell remains Kotlin CWSAndroid (`build:cws-android`); this is the
 * WebView/Capacitor alternative with artifacts under dist/capacitor/.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { buildCapacitorWeb } from "./build-capacitor-web.mjs";
import { patchCapacitorAndroidNetwork } from "./patch-capacitor-android-network.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

async function main() {
    const argv = new Set(process.argv.slice(2));
    const skipPortable = argv.has("--skip-portable");
    await buildCapacitorWeb({ skipPortable });

    const androidDir = resolve(pkgRoot, "android");
    if (!existsSync(androidDir)) {
        const r = spawnSync(process.execPath, [resolve(__dirname, "ensure-capacitor-android.mjs")], {
            cwd: pkgRoot,
            stdio: "inherit"
        });
        if (r.status !== 0) process.exit(r.status ?? 1);
    }

    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    const r2 = spawnSync(npx, ["cap", "sync", "android"], {
        cwd: pkgRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
        env: { ...process.env }
    });
    if (r2.status !== 0) process.exit(r2.status ?? 1);
    console.log("[build:capacitor] cap sync android complete");
    patchCapacitorAndroidNetwork(pkgRoot);
}

main().catch((err) => {
    console.error("[build:capacitor] Failed:", err);
    process.exit(1);
});
