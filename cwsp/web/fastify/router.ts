import fs from "fs/promises"
import path from "node:path"

// Import modular components
import { registerMiddleware } from "./middleware.ts"
import { registerAPIRoutes } from "./api-routes.ts"
import { registerShareTargetRoutes } from "./share-target-routes.ts"
import { registerStaticServing, initializeDirectories } from "./static-serving.ts"
import { registerSPARouting, initializeSPARouting } from "./spa-routing.ts"
import { registerErrorHandling } from "./error-handling.ts"
import { probeDirectory } from "./utils.ts"

// AI Proxy routes (fallback when service worker unavailable)
import { registerAIProxyRoutes } from "./ai-proxy.ts"

// ============================================================================
// DIRECTORY & FILE RESOLUTION
// ============================================================================

const DIRNAME = "webapp.runtime";
// Probe for frontend directory and app directories
const APP_NAME = "cw";

// First, find the main frontend directory (for shared assets)
const __frontendDir = (await probeDirectory([
    "../../frontend",
    "../frontend",
    "./frontend",
    "../../"+DIRNAME+"/frontend",
    "../"+DIRNAME+"/frontend",
    "./"+DIRNAME+"/frontend"
], "./", "index.html"));

console.log(`[Router] Main frontend directory: ${__frontendDir}`);

// Then, try to find app-specific directory (relative to found frontend directory)
const __appDir = (await probeDirectory([
    // First try app directory relative to the found frontend directory
    path.resolve(__frontendDir, "apps", APP_NAME),
    // Also try absolute paths as fallback
    "../../frontend/apps/" + APP_NAME,
    "../frontend/apps/" + APP_NAME,
    "./frontend/apps/" + APP_NAME,
    "../../"+DIRNAME+"/frontend/apps/" + APP_NAME,
    "../"+DIRNAME+"/frontend/apps/" + APP_NAME,
    "./"+DIRNAME+"/frontend/apps/" + APP_NAME,
    // Ultimate fallback to main frontend if no app directory found
    "../../frontend",
    "../frontend",
    "./frontend",
    "../../"+DIRNAME+"/frontend",
    "../"+DIRNAME+"/frontend",
    "./"+DIRNAME+"/frontend"
], "./", "index.js"));

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

    // Register static file serving (assets, fallbacks, etc.)
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
