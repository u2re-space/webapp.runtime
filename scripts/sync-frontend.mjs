import { cp, mkdir, mkdtemp, readFile, realpath, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

function pathLooksAbsolute(p) {
    return p.startsWith("/") || /^[A-Za-z]:[\\/]/.test(p);
}

/**
 * Copy a directory tree into dest, following symlinks (materialize) without dest living inside src.
 */
async function materializeInto(srcDir, destDir) {
    const tmp = await mkdtemp(join(tmpdir(), "cwsp-fe-"));
    const stage = join(tmp, "root");
    try {
        await mkdir(stage, { recursive: true });
        try {
            await cp(srcDir, stage, { recursive: true, dereference: true });
        } catch (err) {
            // Broken outbound symlinks (e.g. apps/cw → monorepo path not in Docker context)
            if (err && (err.code === "ENOENT" || err.code === "EINVAL")) {
                await rm(stage, { recursive: true, force: true });
                await mkdir(stage, { recursive: true });
                await cp(srcDir, stage, { recursive: true, dereference: false });
            } else {
                throw err;
            }
        }
        await cp(stage, destDir, { recursive: true });
    } finally {
        await rm(tmp, { recursive: true, force: true });
    }
}

/**
 * Merge frontend static assets into destDir/frontend (later sources overlay earlier).
 * Sources: runtime/frontend, cwsp/frontend, then paths from CWS_FRONTEND_SRC (';' or ':' separated).
 */
export async function syncFrontendResources({ pkgRoot, destDir }) {
    const runtimeRoot = resolve(pkgRoot, "..");
    const destFrontend = resolve(destDir, "frontend");

    const envPaths = process.env.CWS_FRONTEND_SRC
        ? process.env.CWS_FRONTEND_SRC.split(/[:;]/)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((p) => (pathLooksAbsolute(p) ? p : resolve(pkgRoot, p)))
        : [];

    const sources = [resolve(runtimeRoot, "frontend"), resolve(pkgRoot, "frontend"), ...envPaths];

    await rm(destFrontend, { recursive: true, force: true });
    await mkdir(destFrontend, { recursive: true });

    let copied = false;
    const seenReal = new Set();
    for (const src of sources) {
        if (!existsSync(src)) continue;
        let real;
        try {
            real = await realpath(src);
        } catch {
            continue;
        }
        const st = await stat(real).catch(() => null);
        if (!st?.isDirectory()) continue;
        if (seenReal.has(real)) continue;
        seenReal.add(real);
        await materializeInto(real, destFrontend);
        copied = true;
        console.log(`[sync-frontend] merged ${real} -> ${destFrontend}`);
    }
    if (copied) {
        try {
            const html = await readFile(resolve(destFrontend, "index.html"), "utf8");
            if (
                /\/src\/index\.(tsx?|jsx?)/.test(html) ||
                html.includes("@vite-plugin-pwa") ||
                html.includes("html-proxy") ||
                (html.includes('href="/src/') && html.includes("manifest.json"))
            ) {
                console.warn(
                    "[sync-frontend] index.html looks like a Vite **dev** shell (e.g. CrossWord repo root). " +
                        "CWSP only serves **static** files — `/src/...` and Vite PWA hooks will fail on https://LAN:443.\n" +
                        "  Fix: set CWS_FRONTEND_SRC to **built** output, e.g. after `(cd apps/CrossWord && npm run build:pwa)` use the `dist/` folder.\n" +
                        "  If you already use dist, clear this origin’s **service worker** (Chrome → Application → Unregister)."
                );
            }
        } catch {
            /* no index yet */
        }
    }
    if (!copied) {
        console.warn(
            `[sync-frontend] No frontend directory found (checked runtime/frontend, cwsp/frontend, CWS_FRONTEND_SRC). ` +
                `Placing a minimal placeholder at ${destFrontend}`
        );
        const { writeFile } = await import("node:fs/promises");
        await writeFile(
            resolve(destFrontend, "index.html"),
            `<!doctype html><html><head><meta charset="utf-8"><title>CWSP</title></head><body>
<p>CWSP portable: add static frontend to <code>runtime/frontend</code> or set <code>CWS_FRONTEND_SRC</code> before build.</p>
</body></html>\n`,
            "utf8"
        );
    }
}
