#!/usr/bin/env node
/**
 * Materialize static web assets into `dist/capacitor` (Capacitor `webDir`).
 * Uses the same merge as portable/Electron: `sync-frontend` → **no** esbuild `cwsp.mjs` / full portable build.
 *
 * `--skip-portable` — skip re-sync; use existing `dist/portable/frontend` if present, else keep/update `dist/capacitor` only when it already has `index.html`.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { syncFrontendResources } from "./sync-frontend.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

const portableFrontend = resolve(pkgRoot, "dist", "portable", "frontend");
const feStageDir = resolve(pkgRoot, "dist", ".cwsp-capacitor-fe-stage");
const out = resolve(pkgRoot, "dist", "capacitor");

/**
 * @param {{ skipPortable?: boolean }} [opts]
 */
export async function buildCapacitorWeb(opts = {}) {
    const { skipPortable = false } = opts;
    let mergedFrontend;

    if (!skipPortable) {
        await syncFrontendResources({ pkgRoot, destDir: feStageDir });
        mergedFrontend = join(feStageDir, "frontend");
        if (!existsSync(join(mergedFrontend, "index.html"))) {
            console.error(
                "[build:capacitor:web] sync-frontend did not produce index.html — set CWS_FRONTEND_SRC to built PWA dist or populate runtime/frontend"
            );
            process.exit(1);
        }
    } else if (existsSync(join(portableFrontend, "index.html"))) {
        mergedFrontend = portableFrontend;
        console.log("[build:capacitor:web] --skip-portable: using dist/portable/frontend");
    } else if (existsSync(join(out, "index.html"))) {
        console.log("[build:capacitor:web] --skip-portable: leaving existing dist/capacitor");
        return;
    } else {
        console.error(
            "[build:capacitor:web] --skip-portable: no dist/portable/frontend and no dist/capacitor — run without --skip-portable once"
        );
        process.exit(1);
    }

    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });
    for (const name of await readdir(mergedFrontend)) {
        await cp(join(mergedFrontend, name), join(out, name), { recursive: true });
    }
    console.log(`[build:capacitor:web] ${mergedFrontend}/* -> ${out}`);
}

const entry = process.argv[1];
let isMain = false;
if (entry) {
    try {
        isMain = realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(entry));
    } catch {
        /* ignore */
    }
}
if (isMain) {
    const skipPortable = process.argv.includes("--skip-portable");
    buildCapacitorWeb({ skipPortable }).catch((err) => {
        console.error("[build:capacitor:web] Failed:", err);
        process.exit(1);
    });
}
