/**
 * Copy the CWSP **TypeScript server** tree (same payload as `deploy:server:ssh`).
 * Includes `frontend/` (Fastify web plugin + static shell; symlink is dereferenced).
 * Used by Electron packaging and SSH deploy — not the esbuild `dist/portable` bundle.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Directory that contains `server/`, `package.json`, and deploy metadata for the TS backend.
 * Supports flat layout (`…/cwsp/server`) and nested layout (`…/cwsp/endpoint/server`).
 *
 * @param {string} pkgRoot — directory containing cwsp-runtime `package.json` (often `runtime/cwsp`)
 * @returns {string}
 */
export function resolveCwspServerLayoutRoot(pkgRoot) {
    const nestedRoot = join(pkgRoot, "endpoint");
    const nestedServer = join(nestedRoot, "server");
    const nestedPackage = join(nestedRoot, "package.json");
    if (existsSync(nestedServer) && existsSync(nestedPackage)) return nestedRoot;
    const rootServer = join(pkgRoot, "server");
    const rootPackage = join(pkgRoot, "package.json");
    if (existsSync(rootServer) && existsSync(rootPackage)) return pkgRoot;
    return pkgRoot;
}

/**
 * @param {string} pkgRoot — directory containing cwsp-runtime `package.json`
 * @returns {Promise<string[]>}
 */
export async function collectCwspServerRuntimeNames(pkgRoot) {
    const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);
    const names = new Set([
        "server",
        "config",
        "portable",
        "frontend",
        "web",
        "control",
        "package.json",
        "tsconfig.json",
        "ecosystem.server.config.cjs",
        "ecosystem.portable.config.cjs"
    ]);
    try {
        const entries = await readdir(layoutRoot);
        for (const f of entries) {
            if (/^portable\.config.*\.json$/i.test(f)) names.add(f);
        }
    } catch {
        /* ignore */
    }
    if (existsSync(join(layoutRoot, "https"))) names.add("https");
    return [...names].filter((n) => existsSync(join(layoutRoot, n)));
}

const resolveStageSourcePath = (pkgRoot, layoutRoot, name) => {
    const layoutPath = join(layoutRoot, name);
    if (existsSync(layoutPath)) return layoutPath;
    const pkgPath = join(pkgRoot, name);
    if (existsSync(pkgPath)) return pkgPath;
    return null;
};

/**
 * @param {string} pkgRoot
 * @param {string} destDir
 * @param {{ clean?: boolean }} [options] — if `clean`, remove `destDir` first (default true)
 * @returns {Promise<string[]>} copied entry names
 */
export async function stageCwspServerRuntime(pkgRoot, destDir, options = {}) {
    const { clean = true } = options;
    const layoutRoot = resolveCwspServerLayoutRoot(pkgRoot);
    const names = await collectCwspServerRuntimeNames(pkgRoot);
    const allNames = new Set(names);
    // Nested layout (`runtime/cwsp/endpoint`) keeps TS server files under endpoint/,
    // but static/runtime assets (`frontend`, `web`, `control`, `https`) may live in `runtime/cwsp/`.
    for (const candidate of ["frontend", "web", "control", "https"]) {
        if (resolveStageSourcePath(pkgRoot, layoutRoot, candidate)) {
            allNames.add(candidate);
        }
    }
    if (!names.includes("server")) {
        throw new Error(
            `[stage-cwsp-server-runtime] Missing server/ under ${join(pkgRoot, "server")} or ${join(pkgRoot, "endpoint", "server")}`
        );
    }
    if (clean && existsSync(destDir)) {
        await rm(destDir, { recursive: true, force: true });
    }
    await mkdir(destDir, { recursive: true });
    for (const name of allNames) {
        const src = resolveStageSourcePath(pkgRoot, layoutRoot, name);
        if (!src) continue;
        const dest = join(destDir, name);
        await cp(src, dest, { recursive: true, dereference: true, force: true });
    }

    // If config/ exists, ensure ecosystem PM2 files are also available there.
    // This keeps deploy/distribute layout consistent while avoiding config/config nesting.
    const stagedConfigDir = join(destDir, "config");
    if (existsSync(stagedConfigDir)) {
        const ecosystemFiles = ["ecosystem.server.config.cjs", "ecosystem.portable.config.cjs"];
        for (const fileName of ecosystemFiles) {
            const preferredSource = resolveStageSourcePath(pkgRoot, layoutRoot, join("config", fileName));
            const fallbackSource = resolveStageSourcePath(pkgRoot, layoutRoot, fileName);
            const sourcePath = preferredSource || fallbackSource;
            if (!sourcePath) continue;
            const targetPath = join(stagedConfigDir, fileName);
            await cp(sourcePath, targetPath, { force: true, recursive: false, dereference: true });
        }
    }
    return [...allNames];
}
