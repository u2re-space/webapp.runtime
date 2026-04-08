/**
 * Static File Serving Module
 *
 * Handles static asset serving with complex fallback logic
 */

import fastifyStatic from "@fastify/static"
import fs from "fs/promises"
import path from "node:path"

let __frontendDir, __appDir, APPS_DIR;

/**
 * Initialize directory paths
 */
export function initializeDirectories(frontendDir, appDir, appsDir) {
    __frontendDir = frontendDir;
    __appDir = appDir;
    APPS_DIR = appsDir;
}

/**
 * Check if path is a static file (has extension)
 */
const isStaticFilePath = (pathname) => {
    const ext = path.extname(pathname);
    return ext && ext.length > 1 && !pathname.endsWith('/');
};

const ROOT_ASSET_PREFIXES = [
    '/index.js',
    '/assets/',
    '/chunks/',
    '/vendor/',
    '/views/',
    '/shells/',
    '/fest/',
    '/core/',
    '/com/',
    '/workers/',
    '/pwa/',
];

const NON_HASHED_SCRIPT_STYLE_RE = /\.(js|mjs|css)$/i;
const HASHED_ASSET_RE = /\.[a-f0-9]{8,}\.(css|js|mjs|woff2|png|webp|svg|jpg|jpeg|gif|ico)$/i;

/** Root `index.html` is served by `registerRootDocumentRoutes` / SPA — do not register GET/HEAD via @fastify/static (duplicate route). */
const SHELL_INDEX_GLOB_IGNORE = ["**/index.html"];
const shellIndexAllowedPath = (pathName) => {
    const base = path.basename(String(pathName || "").split("?")[0]);
    return base.toLowerCase() !== "index.html";
};

/**
 * Resolve asset paths with app and fallback lookup
 */
const resolveAssetPaths = (pathname) => {
    const url = new URL(pathname, 'http://localhost');
    const pathParts = url.pathname.split('/').filter(Boolean);

    // Check if this is an app-specific request (e.g., /apps/cw/...)
    if (pathParts[0] === 'apps' && pathParts.length > 1) {
        const appName = pathParts[1];
        const appRelativePath = pathParts.slice(2).join('/');

        return {
            isAppRequest: true,
            appName,
            appRelativePath,
            appPath: path.resolve(APPS_DIR, appName, appRelativePath),
            fallbackPath: path.resolve(__frontendDir, appRelativePath),
            rootPath: path.resolve(__frontendDir, pathname.slice(1)) // For non-app requests
        };
    }

    // Regular root-level request
    return {
        isAppRequest: false,
        appPath: null,
        fallbackPath: null,
        rootPath: path.resolve(__frontendDir, pathname.slice(1))
    };
};

/**
 * Custom asset lookup with fallback mechanism
 */
const lookupAssetWithFallback = async (pathname, reply) => {
    const paths = resolveAssetPaths(pathname);

    // Only handle app-specific requests
    if (!paths.isAppRequest) {
        return null; // Let default static serving handle this
    }

    // Try app directory first
    try {
        const appStats = await fs.stat(paths.appPath);
        if (appStats.isFile()) {
            console.log(`[Asset] Serving from app directory: ${paths.appPath}`);
            const fileStream = await fs.readFile(paths.appPath);
            setStaticHeaders(reply.raw, paths.appPath);
            return reply.send(fileStream);
        }
    } catch (error) {
        // App file not found, continue to fallback
        console.log(`[Asset] App file not found: ${paths.appPath}, trying fallback`);
    }

    // Try root frontend directory as fallback
    try {
        const fallbackStats = await fs.stat(paths.fallbackPath);
        if (fallbackStats.isFile()) {
            console.log(`[Asset] Serving from fallback directory: ${paths.fallbackPath}`);
            const fileStream = await fs.readFile(paths.fallbackPath);
            setStaticHeaders(reply.raw, paths.fallbackPath);
            return reply.send(fileStream);
        }
    } catch (error) {
        // Fallback also not found
        console.log(`[Asset] Fallback file not found: ${paths.fallbackPath}`);
    }

    // PWA manifest: HTML often requests `/apps/<name>/pwa/manifest.json` while Vite puts it under `dist/pwa/` or `public/pwa/`.
    const rel = String(paths.appRelativePath || "");
    if (rel === "pwa/manifest.json" || rel.endsWith("/pwa/manifest.json")) {
        const { appName } = paths;
        const manifestExtras = [
            path.resolve(APPS_DIR, appName, "dist", "pwa", "manifest.json"),
            path.resolve(APPS_DIR, appName, "public", "pwa", "manifest.json"),
            path.resolve(APPS_DIR, appName, "src", "pwa", "manifest.json"),
            path.resolve(__appDir, "pwa", "manifest.json"),
            path.resolve(__appDir, "dist", "pwa", "manifest.json"),
            path.resolve(__appDir, "public", "pwa", "manifest.json"),
            path.resolve(__appDir, "src", "pwa", "manifest.json"),
            path.resolve(__appDir, "pwa", "manifest.webmanifest"),
            path.resolve(__appDir, "dist", "pwa", "manifest.webmanifest"),
            path.resolve(__frontendDir, "pwa", "manifest.json"),
            path.resolve(__frontendDir, "dist", "pwa", "manifest.json")
        ];
        for (const candidate of manifestExtras) {
            try {
                const st = await fs.stat(candidate);
                if (st.isFile()) {
                    console.log(`[Asset] Serving manifest from extra path: ${candidate}`);
                    const fileStream = await fs.readFile(candidate);
                    setStaticHeaders(reply.raw, candidate);
                    return reply.send(fileStream);
                }
            } catch {
                /* try next */
            }
        }
    }

    // Neither app nor fallback found
    return null;
};

/**
 * Static file headers helper
 */
const setStaticHeaders = (res, filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const fileName = path.basename(filePath).toLowerCase();
    const isServiceWorkerRuntimeFile =
        fileName === 'sw.js' ||
        /^workbox-[\w.-]+\.js$/.test(fileName) ||
        /^registersw\.js$/.test(fileName);

    // Helps document COEP (require-corp) load same-origin subresources reliably in Chromium.
    if (!res.getHeader("Cross-Origin-Resource-Policy")) {
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    }

    // Set explicit Content-Type for critical file types
    if (ext === 'js' || ext === 'mjs') {
        res.setHeader('Content-Type', 'application/javascript');
        // Ensure CORS headers for ES modules
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
    } else if (ext === 'css') {
        res.setHeader('Content-Type', 'text/css');
    } else if (ext === 'webmanifest' || (ext === 'json' && filePath.includes('manifest'))) {
        res.setHeader('Content-Type', 'application/manifest+json');
    } else if (ext === 'json') {
        res.setHeader('Content-Type', 'application/json');
    } else if (ext === 'html') {
        res.setHeader('Content-Type', 'text/html');
    } else if (ext === 'svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
    } else if (ext === 'woff2') {
        res.setHeader('Content-Type', 'font/woff2');
    } else if (ext === 'png') {
        res.setHeader('Content-Type', 'image/png');
    } else if (ext === 'jpg' || ext === 'jpeg') {
        res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === 'webp') {
        res.setHeader('Content-Type', 'image/webp');
    } else if (ext === 'ico') {
        res.setHeader('Content-Type', 'image/x-icon');
    }

    // Service worker and Workbox runtime must bypass HTTP caches for fast update pickup.
    if (isServiceWorkerRuntimeFile) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    // Immutable cache for hashed assets
    else if (/\.(?:[a-f0-9]{8,})\.(css|js|mjs|woff2|png|webp|svg|jpg|jpeg|gif|ico)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // Priority hints for critical resources
        if (/\.(css)$/.test(filePath)) res.setHeader('Priority', 'u=0');
        if (/\.(js|mjs)$/.test(filePath)) res.setHeader('Priority', 'u=1');
        if (/\.(woff2)$/.test(filePath)) res.setHeader('Priority', 'u=2');
    } else if (/\.(js|mjs|css)$/.test(filePath)) {
        // Non-hashed scripts/styles can change between deploys/chunk strategies.
        // Keep them uncached to avoid stale entry/chunk URL mismatches (e.g. old index.js -> missing core/main.js).
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else if (/\.(png|webp|svg|jpg|jpeg|gif|ico|woff2|woff|ttf|otf)$/.test(filePath)) {
        // Static assets: moderate cache
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (/\.(json|webmanifest)$/.test(filePath)) {
        // Manifest files: shorter cache for updates
        res.setHeader('Cache-Control', 'public, max-age=1800');
    } else {
        res.setHeader('Cache-Control', 'public, max-age=1800');
    }
};

export async function registerStaticServing(fastify, options = {}) {
    // Request timeout hook
    fastify.addHook("onRequest", async (req, reply) => {
        const timeout = Number(options?.requestTimeoutMs ?? 30000);
        if (!Number.isFinite(timeout) || timeout <= 0) return;
        if (!reply?.raw?.setTimeout) return;

        // Avoid low-level socket/stream destroys (especially under HTTP/2),
        // because they surface as browser protocol errors instead of HTTP status responses.
        reply.raw.setTimeout(timeout, () => {
            if (reply.sent || reply.raw.headersSent) return;
            reply.code(408).type("application/json").send({
                error: "Request Timeout",
                timeoutMs: timeout,
            });
        });
    });

    // Final cache-header guard: when serving non-hashed JS/CSS, always disable HTTP caching.
    // This prevents stale entry/chunk URL mismatches after deploys/chunk-layout changes.
    fastify.addHook("onSend", async (req, reply, payload) => {
        const pathname = String(req.url || "").split("?")[0];
        if (!NON_HASHED_SCRIPT_STYLE_RE.test(pathname) || HASHED_ASSET_RE.test(pathname)) {
            return payload;
        }
        const raw = reply.raw;
        if (raw.headersSent) {
            return payload;
        }
        try {
            raw.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
            raw.setHeader("Pragma", "no-cache");
            raw.setHeader("Expires", "0");
        } catch {
            /* ignore — avoid ERR_HTTP_HEADERS_SENT crashing the process */
        }
        return payload;
    });

    // Custom asset lookup middleware (before static serving)
    fastify.addHook("preHandler", async (req, reply) => {
        // Only intercept static file requests
        if (!isStaticFilePath(req.url)) {
            return; // Let other routes handle this
        }

        // For root-level requests, try multiple fallback locations
        const pathname = req.url.split('?')[0]; // Remove query string
        if (ROOT_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
            const appRelativePath = pathname.slice(1); // Remove leading /

            // Priority order for root-level assets:
            // 1. App-specific directory (highest priority)
            // 2. Shared frontend directory
            // 3. Default static serving

            // Try app directory first
            const appPath = path.resolve(__appDir, appRelativePath);
            try {
                const appStats = await fs.stat(appPath);
                if (appStats.isFile()) {
                    console.log(`[Asset] Serving root request from app directory: ${appPath}`);
                    const fileStream = await fs.readFile(appPath);
                    setStaticHeaders(reply.raw, appPath);
                    return reply.send(fileStream);
                }
            } catch (error) {
                console.log(`[Asset] App asset not found: ${appPath}`);
            }

            // Try shared frontend directory
            if (__appDir !== __frontendDir) {
                const sharedPath = path.resolve(__frontendDir, appRelativePath);
                try {
                    const sharedStats = await fs.stat(sharedPath);
                    if (sharedStats.isFile()) {
                        console.log(`[Asset] Serving root request from shared frontend: ${sharedPath}`);
                        const fileStream = await fs.readFile(sharedPath);
                        setStaticHeaders(reply.raw, sharedPath);
                        return reply.send(fileStream);
                    }
                } catch (error) {
                    console.log(`[Asset] Shared asset not found: ${sharedPath}`);
                }
            }
        }

        // Try custom asset lookup with fallback for app-specific requests
        const result = await lookupAssetWithFallback(req.url, reply);
        if (result !== null) {
            return result; // Asset was found and served
        }

        // Continue to normal static file serving if not handled
    });

    // Shared frontend static files (from main frontend directory)
    await fastify.register(fastifyStatic, {
        decorateReply: true,
        list: false,
        cacheControl: false,
        root: path.resolve(__frontendDir, './'),
        prefix: '/',
        globIgnore: SHELL_INDEX_GLOB_IGNORE,
        allowedPath: shellIndexAllowedPath,
        setHeaders: (res, filePath) => {
            console.log(`[Static] Serving shared asset from frontend: ${filePath}`);
            setStaticHeaders(res, filePath);
        },
        // Don't serve index.html as static - handled by route
        index: false,
        wildcard: false,
    });

    // App-specific static files (from resolved app directory) - higher priority
    if (__appDir !== __frontendDir) {
        await fastify.register(fastifyStatic, {
            decorateReply: false, // Don't decorate again, already done above
            list: false,
            cacheControl: false,
            root: path.resolve(__appDir, './'),
            prefix: '/',
            globIgnore: SHELL_INDEX_GLOB_IGNORE,
            allowedPath: shellIndexAllowedPath,
            setHeaders: (res, filePath) => {
                console.log(`[Static] Serving app asset from ${__appDir}: ${filePath}`);
                setStaticHeaders(res, filePath);
            },
            // Don't serve index.html as static - handled by route
            index: false,
            wildcard: false,
        });
    }

    // Apps directory (e.g., /apps/cw/*) - primary for app-specific assets
    await fastify.register(fastifyStatic, {
        decorateReply: false,
        list: false,
        cacheControl: false,
        root: APPS_DIR,
        prefix: '/apps/',
        setHeaders: (res, filePath) => {
            console.log(`[Static] Serving from apps: ${filePath}`);
            setStaticHeaders(res, filePath);
        },
        index: false,
        wildcard: true,
    });
}