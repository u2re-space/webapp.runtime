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

    // Neither app nor fallback found
    return null;
};

/**
 * Static file headers helper
 */
const setStaticHeaders = (res, filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();

    // Set explicit Content-Type for critical file types
    if (ext === 'js' || ext === 'mjs') {
        res.setHeader('Content-Type', 'application/javascript');
        // Ensure CORS headers for ES modules
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
    } else if (ext === 'css') {
        res.setHeader('Content-Type', 'text/css');
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
    } else if (ext === 'webmanifest' || (ext === 'json' && filePath.includes('manifest'))) {
        res.setHeader('Content-Type', 'application/manifest+json');
    }

    // Immutable cache for hashed assets
    if (/\.(?:[a-f0-9]{8,})\.(css|js|mjs|woff2|png|webp|svg|jpg|jpeg|gif|ico)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // Priority hints for critical resources
        if (/\.(css)$/.test(filePath)) res.setHeader('Priority', 'u=0');
        if (/\.(js|mjs)$/.test(filePath)) res.setHeader('Priority', 'u=1');
        if (/\.(woff2)$/.test(filePath)) res.setHeader('Priority', 'u=2');
    } else if (/\.(js|mjs|css)$/.test(filePath)) {
        // Non-hashed scripts/styles: shorter cache
        res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
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
        const timeout = 10000; // 10s timeout
        if (req.raw.setTimeout) {
            req.raw.setTimeout(timeout, () => {
                req.raw.destroy(new Error("Request Timeout"));
            });
        }
        if (req.raw.stream?.setTimeout) {
            req.raw.stream.setTimeout(timeout, () => {
                req.raw.stream.destroy(new Error("Stream Timeout"));
            });
        }
    });

    // Custom asset lookup middleware (before static serving)
    fastify.addHook("preHandler", async (req, reply) => {
        // Only intercept static file requests
        if (!isStaticFilePath(req.url)) {
            return; // Let other routes handle this
        }

        // For root-level requests, try multiple fallback locations
        const pathname = req.url.split('?')[0]; // Remove query string
        if (pathname.startsWith('/index.js') || pathname.startsWith('/assets/') || pathname.startsWith('/modules/') || pathname.startsWith('/pwa/')) {
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
        root: path.resolve(__frontendDir, './'),
        prefix: '/',
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
            root: path.resolve(__appDir, './'),
            prefix: '/',
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