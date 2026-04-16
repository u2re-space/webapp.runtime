import { cp, mkdir, rm, writeFile, readFile, access, copyFile, readdir } from "node:fs/promises";
import { chmodSync } from "node:fs";
import { constants as fsConstants } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Everything listed as `external` in `build-portable.mjs` must be installed in portable `node_modules`.
 */
/** Shipped next to `cwsp.mjs` for `CWS_PORTABLE_CONFIG_PATH` defaults and multi-target presets. */
const PORTABLE_CONFIG_NAMES = ["portable.config.json", "portable.config.110.json", "portable.config.vds.json"];

const PORTABLE_BUNDLE_DEPENDENCIES = {
    fastify: "^5.8.4",
    "@fastify/caching": ">=9.0.3",
    "@fastify/compress": ">=8.3.1",
    "@fastify/cors": ">=11.2.0",
    "@fastify/etag": ">=6.1.0",
    "@fastify/formbody": ">=8.0.2",
    "@fastify/multipart": ">=10.0.0",
    "@fastify/static": ">=9.1.0",
    clipboardy: ">=5.3.1"
};

async function exists(p) {
    try {
        await access(p, fsConstants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * TLS material for `loadHttpsOptions` (`./https/local/multi.{key,crt}`, etc.).
 * Usually gitignored under `runtime/`; copy when present so a local `npm run build:portable`
 * ships certs next to `config/` and `portable.config.json`.
 */
/** Copy preset portable JSON into `outDir`; later calls overwrite. Symlinks are dereferenced so the bundle has real files. */
async function copyPortableConfigFiles(srcRoot, label, outDir) {
    await mkdir(resolve(outDir, "config"), { recursive: true });
    for (const name of PORTABLE_CONFIG_NAMES) {
        const configScoped = resolve(srcRoot, "config", name);
        const legacyScoped = resolve(srcRoot, name);
        const src = (await exists(configScoped)) ? configScoped : legacyScoped;
        if (!(await exists(src))) continue;
        const dest = resolve(outDir, "config", name);
        await cp(src, dest, { force: true, dereference: true });
        console.log(`[bundle-portable-extra] copied config/${name} (${label})`);
    }
}

async function copyHttpsTree(srcRoot, label, outDir) {
    const httpsSrc = resolve(srcRoot, "https");
    if (!(await exists(httpsSrc))) return;
    /** Follow symlinks (e.g. `cwsp/https` → `runtime/https`) so the bundle contains real files, not broken links. */
    await cp(httpsSrc, resolve(outDir, "https"), { recursive: true, force: true, dereference: true });
    console.log(`[bundle-portable-extra] copied https/ from ${label}`);
}

/**
 * After esbuild + frontend sync: npm deps, endpoint configs, PM2 ecosystem, launch scripts.
 */
export async function bundlePortableExtra(pkgRoot, outDir) {
    const endpointRoot = resolve(pkgRoot, "endpoint");

    const pkgRaw = await readFile(resolve(pkgRoot, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw);
    const slimPkg = {
        name: "cwsp-portable-bundle",
        private: true,
        type: "module",
        version: pkg.version || "1.0.0",
        description: "CWSP portable runtime dependencies (generated)",
        engines: pkg.engines,
        dependencies: {
            ...PORTABLE_BUNDLE_DEPENDENCIES,
            ...(pkg.dependencies || {})
        }
    };
    await writeFile(resolve(outDir, "package.json"), `${JSON.stringify(slimPkg, null, 2)}\n`, "utf8");

    const configSrc = resolve(endpointRoot, "config");
    if (await exists(configSrc)) {
        await mkdir(resolve(outDir, "config"), { recursive: true });
        // Copy only config contents to avoid producing config/config.
        const configEntries = await readdir(configSrc);
        for (const entry of configEntries) {
            await cp(resolve(configSrc, entry), resolve(outDir, "config", entry), {
                recursive: true,
                force: true,
                dereference: true
            });
        }
        console.log("[bundle-portable-extra] copied config/ from endpoint");
    }

    const httpsOut = resolve(outDir, "https");
    try {
        await rm(httpsOut, { recursive: true, force: true });
    } catch {
        /* ignore */
    }
    await copyHttpsTree(pkgRoot, "cwsp (package https/ → dereferenced)", outDir);
    await copyHttpsTree(endpointRoot, "endpoint", outDir);

    await copyPortableConfigFiles(pkgRoot, "cwsp package", outDir);
    await copyPortableConfigFiles(endpointRoot, "endpoint", outDir);

    const epPortable = resolve(endpointRoot, "portable", "endpoint-portable");
    if (await exists(epPortable)) {
        const altConfig = resolve(epPortable, "config");
        if (await exists(altConfig)) {
            await mkdir(resolve(outDir, "config"), { recursive: true });
            // Merge config entries directly, do not create config/config.
            const altEntries = await readdir(altConfig);
            for (const entry of altEntries) {
                await cp(resolve(altConfig, entry), resolve(outDir, "config", entry), {
                    recursive: true,
                    force: true,
                    dereference: true
                });
            }
            console.log("[bundle-portable-extra] merged portable/endpoint-portable/config");
        }
        await copyHttpsTree(epPortable, "endpoint-portable", outDir);
        await copyPortableConfigFiles(epPortable, "endpoint-portable", outDir);
    }

    const requiredDefault = resolve(outDir, "config", "portable.config.json");
    if (!(await exists(requiredDefault))) {
        console.warn(
            "[bundle-portable-extra] missing config/portable.config.json in bundle — add it under runtime/cwsp/endpoint/config"
        );
    }

    const ecosystemDist = `'use strict';
module.exports = {
    apps: [
        {
            name: 'cwsp',
            script: 'cwsp.mjs',
            cwd: __dirname,
            interpreter: 'node',
            instances: 1,
            autorestart: true,
            max_restarts: 30,
            min_uptime: '10s',
            windowsHide: true,
            env: {
                NODE_ENV: 'production',
                CWS_PORTABLE_CONFIG_PATH: './config/portable.config.json',
                CWS_PORTABLE_DATA_PATH: './.data',
                CWS_HTTPS_ENABLED: 'true',
                CWS_COMPAT_SOCKETIO: 'false'
            }
        }
    ]
};
`;
    await writeFile(resolve(outDir, "ecosystem.portable.config.cjs"), ecosystemDist, "utf8");
    await writeFile(resolve(outDir, "ecosystem.config.cjs"), ecosystemDist, "utf8");
    const configDir = resolve(outDir, "config");
    if (await exists(configDir)) {
        await writeFile(resolve(configDir, "ecosystem.portable.config.cjs"), ecosystemDist, "utf8");
        // Keep server ecosystem co-located when config/ exists (no config/config nesting).
        if (await exists(resolve(endpointRoot, "config", "ecosystem.server.config.cjs"))) {
            const serverEco = await readFile(resolve(endpointRoot, "config", "ecosystem.server.config.cjs"), "utf8");
            await writeFile(resolve(configDir, "ecosystem.server.config.cjs"), serverEco, "utf8");
        }
    }

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

    const webappCmd =
        "@echo off\r\n" +
        "setlocal\r\n" +
        'cd /d "%~dp0"\r\n' +
        'set "CWS_PORTABLE_CONFIG_PATH=%~dp0config\\portable.config.json"\r\n' +
        'set "CWS_PORTABLE_DATA_PATH=%~dp0.data"\r\n' +
        "node cwsp.mjs %*\r\n" +
        "endlocal\r\n";
    await writeFile(resolve(outDir, "webapp.cmd"), webappCmd, "utf8");

    const readPortableTxt =
        "CWSP portable bundle\n" +
        "======================\n\n" +
        "cwsp.mjs is an esbuild slice of the TS server; Fastify + native WebSocket support load from node_modules.\n" +
        "Always run install.cmd (or npm install --omit=dev) in this folder after copy — partial copies break AirPad.\n\n" +
        "Check: node check-portable-deps.mjs\n\n" +
        "Typical cwsp.mjs size: ~200–400 KiB (deps are in node_modules, not inside cwsp.mjs).\n\n" +
        "Start: webapp.cmd | node cwsp.mjs | pm2 start ecosystem.config.cjs\n" +
        "TLS: https/local/multi.key + multi.crt or config/certificate.mjs (proxy to https/certificate.mjs).\n";
    await writeFile(resolve(outDir, "READ_PORTABLE.txt"), readPortableTxt, "utf8");

    const checkDeps = resolve(pkgRoot, "scripts", "check-portable-deps.mjs");
    if (await exists(checkDeps)) {
        await copyFile(checkDeps, resolve(outDir, "check-portable-deps.mjs"));
        console.log("[bundle-portable-extra] copied check-portable-deps.mjs");
    }

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
