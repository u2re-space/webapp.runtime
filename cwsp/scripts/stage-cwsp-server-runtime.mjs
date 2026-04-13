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
    if (existsSync(join(pkgRoot, "server"))) return pkgRoot;
    const nested = join(pkgRoot, "endpoint", "server");
    if (existsSync(nested)) return join(pkgRoot, "endpoint");
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
        "frontend",
        "web",
        "control",
        "package.json",
        "tsconfig.json",
        "ecosystem.server.config.cjs"
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
    if (!names.includes("server")) {
        throw new Error(
            `[stage-cwsp-server-runtime] Missing server/ under ${join(pkgRoot, "server")} or ${join(pkgRoot, "endpoint", "server")}`
        );
    }
    if (clean && existsSync(destDir)) {
        await rm(destDir, { recursive: true, force: true });
    }
    await mkdir(destDir, { recursive: true });
    for (const name of names) {
        const src = join(layoutRoot, name);
        const dest = join(destDir, name);
        await cp(src, dest, { recursive: true, dereference: true, force: true });
    }
    return names;
}
