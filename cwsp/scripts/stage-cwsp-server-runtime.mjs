/**
 * Copy the CWSP **TypeScript server** tree (same payload as `deploy:server:ssh`).
 * Used by Electron packaging and SSH deploy — not the esbuild `dist/portable` bundle.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {string} pkgRoot — directory containing cwsp-runtime `package.json`
 * @returns {Promise<string[]>}
 */
export async function collectCwspServerRuntimeNames(pkgRoot) {
    const names = new Set([
        "server",
        "web",
        "control",
        "package.json",
        "tsconfig.json",
        "ecosystem.server.config.cjs"
    ]);
    try {
        const entries = await readdir(pkgRoot);
        for (const f of entries) {
            if (/^portable\.config.*\.json$/i.test(f)) names.add(f);
        }
    } catch {
        /* ignore */
    }
    if (existsSync(join(pkgRoot, "https"))) names.add("https");
    return [...names].filter((n) => existsSync(join(pkgRoot, n)));
}

/**
 * @param {string} pkgRoot
 * @param {string} destDir
 * @param {{ clean?: boolean }} [options] — if `clean`, remove `destDir` first (default true)
 * @returns {Promise<string[]>} copied entry names
 */
export async function stageCwspServerRuntime(pkgRoot, destDir, options = {}) {
    const { clean = true } = options;
    const names = await collectCwspServerRuntimeNames(pkgRoot);
    if (!names.includes("server")) {
        throw new Error(`[stage-cwsp-server-runtime] Missing server/ under ${pkgRoot}`);
    }
    if (clean && existsSync(destDir)) {
        await rm(destDir, { recursive: true, force: true });
    }
    await mkdir(destDir, { recursive: true });
    for (const name of names) {
        const src = join(pkgRoot, name);
        const dest = join(destDir, name);
        await cp(src, dest, { recursive: true, dereference: true, force: true });
    }
    return names;
}
