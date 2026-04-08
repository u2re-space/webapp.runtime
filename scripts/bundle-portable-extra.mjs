import { cp, mkdir, writeFile, readFile, access } from "node:fs/promises";
import { chmodSync } from "node:fs";
import { constants as fsConstants } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function exists(p) {
    try {
        await access(p, fsConstants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * After esbuild + frontend sync: npm deps, endpoint configs, PM2 ecosystem, launch scripts.
 */
export async function bundlePortableExtra(pkgRoot, outDir) {
    const runtimeRoot = resolve(pkgRoot, "..");
    const endpointRoot = resolve(runtimeRoot, "endpoint", "endpoint");

    const pkgRaw = await readFile(resolve(pkgRoot, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw);
    const slimPkg = {
        name: "cwsp-portable-bundle",
        private: true,
        type: "module",
        version: pkg.version || "1.0.0",
        description: "CWSP portable runtime dependencies (generated)",
        dependencies: { ...(pkg.dependencies || {}) }
    };
    await writeFile(resolve(outDir, "package.json"), `${JSON.stringify(slimPkg, null, 2)}\n`, "utf8");

    const configSrc = resolve(endpointRoot, "config");
    if (await exists(configSrc)) {
        await cp(configSrc, resolve(outDir, "config"), { recursive: true, force: true });
        console.log("[bundle-portable-extra] copied config/ from endpoint");
    }

    for (const name of ["portable.config.json", "portable.config.110.json", "portable.config.vds.json"]) {
        const src = resolve(endpointRoot, name);
        if (await exists(src)) {
            await cp(src, resolve(outDir, name));
            console.log(`[bundle-portable-extra] copied ${name}`);
        }
    }

    const epPortable = resolve(endpointRoot, "portable", "endpoint-portable");
    if (await exists(epPortable)) {
        const altConfig = resolve(epPortable, "config");
        if (await exists(altConfig)) {
            await mkdir(resolve(outDir, "config"), { recursive: true });
            await cp(altConfig, resolve(outDir, "config"), { recursive: true, force: true });
            console.log("[bundle-portable-extra] merged portable/endpoint-portable/config");
        }
        for (const name of ["portable.config.json", "portable.config.110.json", "portable.config.vds.json"]) {
            const src = resolve(epPortable, name);
            if (await exists(src)) {
                await cp(src, resolve(outDir, name));
            }
        }
    }

    const ecosystemDist = `'use strict';
const path = require('path');
module.exports = {
    apps: [
        {
            name: 'cwsp-portable',
            script: 'cwsp.mjs',
            cwd: __dirname,
            interpreter: 'node',
            instances: 1,
            autorestart: true,
            max_restarts: 30,
            min_uptime: '10s',
            env: { NODE_ENV: 'production' }
        }
    ]
};
`;
    await writeFile(resolve(outDir, "ecosystem.portable.config.cjs"), ecosystemDist, "utf8");
    await writeFile(resolve(outDir, "ecosystem.config.cjs"), ecosystemDist, "utf8");

    const webappSh =
        "#!/usr/bin/env bash\n" +
        "set -euo pipefail\n" +
        'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"\n' +
        'cd "$SCRIPT_DIR"\n' +
        'exec node cwsp.mjs "$@"\n';
    await writeFile(resolve(outDir, "webapp.sh"), webappSh, "utf8");
    if (process.platform !== "win32") {
        try {
            chmodSync(resolve(outDir, "webapp.sh"), 0o755);
        } catch {
            /* ignore */
        }
    }

    const installCmd = `@echo off
setlocal
cd /d "%~dp0"
if not exist "package.json" (
  echo [install] missing package.json in this folder
  exit /b 1
)
call npm install --omit=dev --no-audit --no-fund
endlocal
`;
    await writeFile(resolve(outDir, "install.cmd"), installCmd, "utf8");

    if (process.env.CWS_SKIP_PORTABLE_NPM_INSTALL === "1" || process.env.CWS_SKIP_NPM_INSTALL === "1") {
        console.log("[bundle-portable-extra] skipped npm install (CWS_SKIP_PORTABLE_NPM_INSTALL=1)");
        return;
    }

    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const r = spawnSync(npm, ["install", "--omit=dev", "--no-audit", "--no-fund"], {
        cwd: outDir,
        stdio: "inherit",
        shell: true,
        env: { ...process.env }
    });
    if (r.status !== 0) {
        console.error("[bundle-portable-extra] npm install in dist/portable failed");
        process.exit(r.status ?? 1);
    }
    console.log("[bundle-portable-extra] npm install --omit=dev completed in dist/portable");
}
