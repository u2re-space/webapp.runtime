import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { syncFrontendResources } from "./sync-frontend.mjs";
import { bundlePortableExtra } from "./bundle-portable-extra.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

/**
 * Load esbuild from cwsp's devDependency (via package.json), not from a hoisted root node_modules.
 * Otherwise `import "esbuild"` resolves relative to runtime/scripts/ and can pick a different copy
 * that still warns on extended tsconfig targets (e.g. ES2025 in base tsconfig.json).
 */
const requireFromCwsp = createRequire(resolve(pkgRoot, "package.json"));
const { build } = requireFromCwsp("esbuild");

const outDir = resolve(pkgRoot, "dist/portable");

async function runBuild() {
    await mkdir(outDir, { recursive: true });
    const entry = resolve(pkgRoot, "server/index.ts");
    console.log("[build:portable] Bundling CWSP server entry...");
    try {
        await build({
            entryPoints: [entry],
            bundle: true,
            platform: "node",
            /** Emit for Node 24. TS `compilerOptions.target` in tsconfig.json is for tsc/editor only. */
            target: "node24",
            outfile: resolve(outDir, "cwsp.mjs"),
            external: [
                "clipboardy",
                "fastify",
                "@fastify/cors",
                "@fastify/formbody",
                "@fastify/caching",
                "@fastify/compress",
                "@fastify/etag",
                "@fastify/multipart",
                "@fastify/static",
                "socket.io",
                "socket.io-client",
                "@rs-core/service/AI-ops/RecognizeData"
            ],
            format: "esm"
        });
        console.log(`[build:portable] Done: ${resolve(outDir, "cwsp.mjs")}`);
        await syncFrontendResources({ pkgRoot, destDir: outDir });
        await bundlePortableExtra(pkgRoot, outDir);
    } catch (err) {
        console.error("[build:portable] Failed:", err);
        process.exit(1);
    }
}

runBuild();
