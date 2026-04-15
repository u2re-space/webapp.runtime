/**
 * Public web/router assembly for the CWSP Fastify server.
 *
 * It resolves the correct frontend build directory, initializes shared static
 * serving helpers, and registers middleware plus route branches in the order
 * required for the browser shell, share-target flow, and fallback pages.
 */
import fs from "fs/promises"
import path from "node:path"

// Import modular components
import { registerMiddleware } from "./middleware.ts"
import { registerAPIRoutes } from "./api-routes.ts"
import { registerShareTargetRoutes } from "./share-target-routes.ts"
import { registerStaticServing, initializeDirectories } from "./static-serving.ts"
import { registerSPARouting, registerRootDocumentRoutes, initializeSPARouting } from "./spa-routing.ts"
import { registerErrorHandling } from "./error-handling.ts"
import { probeDirectory } from "./utils.ts"
import { looksLikeViteDevIndexHtml } from "./vite-dev-detect.ts"

// AI Proxy routes (fallback when service worker unavailable)
import { registerAIProxyRoutes } from "./ai-proxy.ts"
import { findPortableConfigRoot } from "../utils/runtime.ts"

// ============================================================================
// DIRECTORY & FILE RESOLUTION
// ============================================================================

const DIRNAME = "webapp.runtime";
// Probe for frontend directory and app directories
const APP_NAME = "cw";

/**
 * `portable.config.json` lives at the cwsp **package root**. TS modules live under `web/fastify/`, `server/`, …
 * so we must walk up — not only check `import.meta.dirname` (that broke deployed `tsx server` + Fastify static on :80/:443).
 */
const bundleOrModuleDir = import.meta.dirname;
/** Directory that contains `web/` and `server/` (always `web/fastify/../..`), regardless of `portable.config.json`. */
const moduleCwspRoot = path.resolve(bundleOrModuleDir, "../..");
const portableRoot = findPortableConfigRoot(bundleOrModuleDir);
const cwspPackageRoot = portableRoot ?? moduleCwspRoot;
const pathLooksAbsolute = (p) => p.startsWith("/") || /^[A-Za-z]:[\\/]/.test(p);

/** Explicit dirs (highest priority): CWS_FRONTEND_DIR, then each path in CWS_FRONTEND_SRC (same as sync-frontend). */
const envFrontendDirs = () => {
    const out = [];
    const explicit = String(process.env.CWS_FRONTEND_DIR || "").trim();
    if (explicit) out.push(path.resolve(explicit));
    const src = process.env.CWS_FRONTEND_SRC;
    if (src) {
        for (const part of String(src).split(/[:;]/)) {
            const t = part.trim();
            if (!t) continue;
            out.push(pathLooksAbsolute(t) ? path.resolve(t) : path.resolve(cwspPackageRoot, t));
        }
    }
    return out;
};

const devMonorepoFrontendCandidates = [
    "../../.dev-frontend/frontend",
    "../../dist/portable/frontend",
    "../../frontend",
    "../frontend",
    "./frontend",
    "../../" + DIRNAME + "/frontend",
    "../" + DIRNAME + "/frontend",
    "./" + DIRNAME + "/frontend"
];

/**
 * Absolute roots under the cwsp package. SSH / TS deploy stages `web/` with materialized copies of PWA files
 * (`index.html`, `load.mjs`, …). Without `portable.config.json`, relative `../../frontend` probes missed `web/`
 * and fell back to a non-existent path → 404 for all static assets.
 */
const cwspRootFrontendCandidates = [
    path.join(moduleCwspRoot, "web"),
    path.join(moduleCwspRoot, "frontend"),
    path.join(moduleCwspRoot, "dist", "portable", "frontend"),
    path.join(moduleCwspRoot, DIRNAME, "frontend")
];

// First, find the main frontend directory (for shared assets)
const __frontendDir = await probeDirectory(
    [...envFrontendDirs(), ...cwspRootFrontendCandidates, ...devMonorepoFrontendCandidates],
    "",
    "index.html"
);

console.log(`[Router] Main frontend directory: ${__frontendDir}`);

const __indexPath = path.resolve(__frontendDir, "index.html");
try {
    await fs.access(__indexPath);
} catch {
    console.error(
        "[Router] No index.html at resolved frontend dir. Set CWS_FRONTEND_DIR to built PWA output, " +
            "or CWS_FRONTEND_SRC (see dev.env), or run dev without CWS_SKIP_DEV_FRONTEND_SYNC so .dev-frontend is merged."
    );
}

try {
    const idx = await fs.readFile(__indexPath, "utf-8");
    if (looksLikeViteDevIndexHtml(idx)) {
        console.error(
            "[Router] index.html looks like a Vite **dev** shell (references /src/, html-proxy, or @vite-plugin-pwa). " +
                "CWSP cannot serve that. Build PWA (e.g. npm run build:pwa in CrossWord) and set CWS_FRONTEND_DIR or CWS_FRONTEND_SRC to dist. " +
                "Opening / will show an explanation page unless CWS_ALLOW_VITE_DEV_HTML=true."
        );
    }
} catch {
    /* already logged access error */
}

const devMonorepoAppCandidates = [
    "../../.dev-frontend/frontend/apps/" + APP_NAME,
    "../../dist/portable/frontend/apps/" + APP_NAME,
    "../../frontend/apps/" + APP_NAME,
    "../frontend/apps/" + APP_NAME,
    "./frontend/apps/" + APP_NAME,
    "../../" + DIRNAME + "/frontend/apps/" + APP_NAME,
    "../" + DIRNAME + "/frontend/apps/" + APP_NAME,
    "./" + DIRNAME + "/frontend/apps/" + APP_NAME,
    "../../frontend",
    "../frontend",
    "./frontend",
    "../../" + DIRNAME + "/frontend",
    "../" + DIRNAME + "/frontend",
    "./" + DIRNAME + "/frontend"
];

const cwspRootAppCandidates = [
    path.join(moduleCwspRoot, "web", "apps", APP_NAME),
    path.join(moduleCwspRoot, "frontend", "apps", APP_NAME),
    path.join(moduleCwspRoot, "dist", "portable", "frontend", "apps", APP_NAME),
    path.join(moduleCwspRoot, DIRNAME, "frontend", "apps", APP_NAME)
];

// Then, try to find app-specific directory (relative to found frontend directory)
const __appDir = await probeDirectory(
    [path.resolve(__frontendDir, "apps", APP_NAME), ...cwspRootAppCandidates, ...devMonorepoAppCandidates],
    "",
    "index.js"
);

console.log(`[Router] App directory resolved to: ${__appDir}`);

// Keep index loader dynamic so runtime html updates do not require process restart.
const LOADER = () => fs.readFile(path.resolve(__frontendDir, "index.html"), { encoding: "utf-8" });

// Apps directory resolution (relative to frontend directory)
const APPS_DIR = path.resolve(__frontendDir, 'apps');

// Initialize SPA routing with required dependencies
initializeSPARouting(__frontendDir, LOADER);

// Initialize static serving with directory paths
initializeDirectories(__frontendDir, __appDir, APPS_DIR);

// ============================================================================
// MAIN APP REGISTRATION
// ============================================================================

/**
 * Register the full web-facing Fastify surface for the public app server.
 *
 * INVARIANT: middleware and root-document routes must be registered before the
 * catch-all SPA/error handlers so the app shell keeps predictable routing.
 */
export default async function (fastify, options = {}) {
    if (!fastify) throw Error("No Fastify instance provided");

    // Register middleware first (security, compression, CORS, etc.)
    await registerMiddleware(fastify, options);

    // Register API routes (processing, analysis, icons, etc.)
    await registerAPIRoutes(fastify, options);

    // Register share target routes (PWA share handling)
    await registerShareTargetRoutes(fastify, options);

    // Register AI proxy routes (fallback when service worker unavailable)
    await registerAIProxyRoutes(fastify);

    // SPA shell for `/` and `/index.html` (static plugin must not register those paths — see allowedPath).
    await registerRootDocumentRoutes(fastify);

    await registerStaticServing(fastify, options);

    // Register SPA routing (index.html serving)
    await registerSPARouting(fastify, options);

    // Register error handling last (404 pages, error responses)
    await registerErrorHandling(fastify, options);

    console.log('[Router] All modules registered successfully');
}

// HTTPS configuration is now handled by the CWSP core server.
export const options = {
    http2: true,
    esm: true,
    debug: true,
    logger: true,
    routerOptions: {
        ignoreTrailingSlash: true,
    }
};
