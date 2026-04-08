#!/usr/bin/env node
/**
 * Materialize the same static frontend as `dist/portable/frontend` into `dist/capacitor`
 * (Capacitor `webDir`). Runs full portable build unless `--skip-portable`.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

/**
 * @param {{ skipPortable?: boolean }} [opts]
 */
export async function buildCapacitorWeb(opts = {}) {
    const { skipPortable = false } = opts;
    const portableFrontend = resolve(pkgRoot, "dist/portable/frontend");
    const out = resolve(pkgRoot, "dist/capacitor");

    if (!skipPortable) {
        const r = spawnSync(process.execPath, [resolve(__dirname, "build-portable.mjs")], {
            cwd: pkgRoot,
            stdio: "inherit"
        });
        if (r.status !== 0) process.exit(r.status ?? 1);
    } else if (!existsSync(portableFrontend)) {
        console.error(
            "[build:capacitor:web] Missing dist/portable/frontend — run build:portable first or omit --skip-portable"
        );
        process.exit(1);
    }

    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });
    /** Copy directory *contents* so index.html lives at webDir root (not webDir/frontend/). */
    for (const name of await readdir(portableFrontend)) {
        await cp(join(portableFrontend, name), join(out, name), { recursive: true });
    }
    console.log(`[build:capacitor:web] ${portableFrontend}/* -> ${out}`);
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
