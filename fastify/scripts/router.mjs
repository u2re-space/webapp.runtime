import fs from "fs/promises"
import path from "node:path"

// Import modular components
import { registerMiddleware } from "./middleware.mjs"
import { registerAPIRoutes } from "./api-routes.mjs"
import { registerShareTargetRoutes } from "./share-target-routes.mjs"
import { registerStaticServing, initializeDirectories } from "./static-serving.mjs"
import { registerSPARouting, initializeSPARouting } from "./spa-routing.mjs"
import { registerErrorHandling } from "./error-handling.mjs"
import { probeDirectory } from "./utils.mjs"

// AI Proxy routes (fallback when service worker unavailable)
import { registerAIProxyRoutes } from "./ai-proxy.mjs"

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

// Load index.html from the main frontend directory, not the app directory
const LOADER = fs.readFile(path.resolve(__frontendDir, "index.html"), {encoding: 'utf-8'});

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

// ============================================================================
// HTTPS CONFIGURATION & OPTIONS
// ============================================================================

// Load HTTPS certificate if not disabled
let httpsConfig = {};
if (!Array.from(process.argv).some((e) => e.endsWith("no-https"))) {
    try {
        console.log(`[Router] Looking for HTTPS certificates...`);

        // Look for certificate directory
        const certDir = await probeDirectory(["../../https/", "../https/", "./https/"], "./", "certificate.crt");
        console.log(`[Router] Found certificate directory: ${certDir}`);

        // Check for certificate.mjs file
        const certPath = path.resolve(certDir, "certificate.mjs");
        console.log(`[Router] Looking for certificate.mjs at: ${certPath}`);

        // Check if certificate file actually exists before trying to import
        await fs.access(certPath);
        console.log(`[Router] Certificate file exists, loading...`);

        httpsConfig = (await import("file://" + certPath)).default;
        console.log(`[Router] HTTPS certificate loaded successfully from: ${certPath}`);
    } catch (error) {
        console.log(`[Router] HTTPS certificate setup failed:`);
        console.log(`  Error: ${error.message}`);
        console.log(`  Certificate directory probe failed or certificate.mjs not found`);
        console.log(`  Starting server without HTTPS (add certificate.crt and certificate.mjs to https/ directory)`);
        console.log(`  Or use --no-https to disable HTTPS completely`);
        httpsConfig = {}; // Fallback to no HTTPS
    }
}

// Server configuration options
let port = 443;
if (Array.from(process.argv).some((e) => e.endsWith("port"))) {
    const index = Array.from(process.argv).findIndex((e) => e.endsWith("port"));
    port = parseInt(process.argv[index + 1]);
}

export const options = {
    http2: true,
    esm: true,
    debug: true,
    logger: true,
    routerOptions: {
        ignoreTrailingSlash: true,
    },
    port: port || 443,
    https: { allowHTTP1: true, ...httpsConfig },
    address: "0.0.0.0",
    host: "0.0.0.0",
};
