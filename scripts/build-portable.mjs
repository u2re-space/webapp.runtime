import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { resolveCwspServerLayoutRoot } from "../cwsp/scripts/stage-cwsp-server-runtime.mjs";
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
const serverLayoutRoot = resolveCwspServerLayoutRoot(pkgRoot);

const outDir = resolve(pkgRoot, "dist/portable");

/** Match the resolved CWSP server layout (`cwsp/` or `cwsp/endpoint/`) for esbuild aliases. */
const cwspTsPathAliases = {
    // `@server-v2` must precede `@server` (prefix overlap).
    "@server-v2": resolve(serverLayoutRoot, "server"),
    "@server": resolve(serverLayoutRoot, "server"),
    "@protocol": resolve(serverLayoutRoot, "server/protocol"),
    "@admin": resolve(serverLayoutRoot, "server/admin"),
    "@config": resolve(serverLayoutRoot, "server/config"),
    "@legacy": resolve(serverLayoutRoot, "server/legacy"),
    "@inputs": resolve(serverLayoutRoot, "server/inputs"),
    "@utils": resolve(serverLayoutRoot, "server/utils"),
    "@old": resolve(pkgRoot, "../endpoint/endpoint/server")
};

const readableBundle =
    process.argv.includes("--readable") ||
    process.argv.includes("--no-minify") ||
    process.env.CWS_PORTABLE_READABLE_BUNDLE === "1";

async function runBuild() {
    await mkdir(outDir, { recursive: true });
    const entry = resolve(serverLayoutRoot, "server/index.ts");
    console.log(
        `[build:portable] Bundling CWSP server entry${readableBundle ? " (readable: sourcemap + keepNames, no minify)" : ""}...`
    );
    try {
        await build({
            entryPoints: [entry],
            bundle: true,
            platform: "node",
            /** Emit for Node 24. TS `compilerOptions.target` in tsconfig.json is for tsc/editor only. */
            target: "node24",
            outfile: resolve(outDir, "cwsp.mjs"),
            minify: false,
            keepNames: readableBundle,
            sourcemap: readableBundle ? "linked" : false,
            legalComments: readableBundle ? "inline" : "eof",
            /**
             * Keep Socket.IO + Fastify external: bundling them into one ESM file breaks on Node
             * (nested CJS uses `require("http")` / `require("crypto")`). Portable **must** run
             * `install.cmd` / `npm install --omit=dev` so `node_modules` is complete.
             */
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
                "ws",
                "@rs-core/service/AI-ops/RecognizeData"
            ],
            format: "esm",
            alias: cwspTsPathAliases
        });
        console.log(`[build:portable] Done: ${resolve(outDir, "cwsp.mjs")}`);
        await import(pathToFileURL(resolve(__dirname, "verify-portable.mjs")).href);
        await syncFrontendResources({ pkgRoot, destDir: outDir });
        await bundlePortableExtra(pkgRoot, outDir);
    } catch (err) {
        console.error("[build:portable] Failed:", err);
        process.exit(1);
    }
}

runBuild();
