import cors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import fastifyCaching from "@fastify/caching"
import fastifyCompress from "@fastify/compress"
import Etag from "@fastify/etag"
import formbody from "@fastify/formbody"
import multipart from "@fastify/multipart"
import fs from "fs/promises"
import path from "node:path"
import zlib from "node:zlib"

// AI Proxy routes (fallback when service worker unavailable)
import { registerAIProxyRoutes } from "./ai-proxy.mjs"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Probe directories to find existing paths
 */
const probeDirectory = async (dirList, agr = "local/", testFile = "certificate.crt") => {
    console.log(`[Probe] Looking for ${testFile} in directories:`);

    for (const dir of dirList) {
        const fullPath = path.resolve(import.meta.dirname, dir + agr, testFile);
        let check = null;
        try {
            check = await fs
                .stat(fullPath)
                .catch(() => null);

            if (check && check.isFile()) {
                console.log(`[Probe] ✓ Found ${testFile} in: ${path.resolve(import.meta.dirname, dir)}`);
                return path.resolve(import.meta.dirname, dir);
            } else {
                console.log(`[Probe] ✗ Not found in: ${path.resolve(import.meta.dirname, dir)}`);
            }
        } catch(e) {
            console.log(`[Probe] ✗ Error checking: ${path.resolve(import.meta.dirname, dir)} - ${e.message}`);
        }
    }

    const fallbackDir = path.resolve(import.meta.dirname, dirList[0]);
    console.log(`[Probe] Using fallback directory: ${fallbackDir}`);
    return fallbackDir;
};

/**
 * Generate UUIDv4
 */
export const UUIDv4 = () => {
    return (crypto?.randomUUID ? crypto?.randomUUID() : ("10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16))));
};

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
            fallbackPath: path.resolve(__dirname, appRelativePath),
            rootPath: path.resolve(__dirname, pathname.slice(1)) // For non-app requests
        };
    }

    // Regular root-level request
    return {
        isAppRequest: false,
        appPath: null,
        fallbackPath: null,
        rootPath: path.resolve(__dirname, pathname.slice(1))
    };
};

/**
 * SPA routes that should serve index.html
 */
const SPA_ROUTES = [
    '/share-target',
    '/share_target',
    '/settings',
    '/about',
    '/help',
    '/privacy',
    '/terms'
];

/**
 * Check if path is an SPA route (should serve index.html)
 */
const isSpaRoute = (pathname) => {
    // Exact matches for known SPA routes
    if (SPA_ROUTES.includes(pathname)) return true;
    // Non-file paths that don't match static files
    if (!isStaticFilePath(pathname) && pathname !== '/' && !pathname.startsWith('/api/')) return true;
    return false;
};

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

// For backward compatibility, set __dirname to the app directory
const __dirname = __appDir;
// Load index.html from the main frontend directory, not the app directory
const LOADER = fs.readFile(path.resolve(__frontendDir, "index.html"), {encoding: 'utf-8'});

// Apps directory resolution (relative to frontend directory)
const APPS_DIR = path.resolve(__frontendDir, 'apps');

// ============================================================================
// 404 ERROR PAGE GENERATION
// ============================================================================

const generate404Page = (pathname) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e8e8e8;
            font-family: system-ui, -apple-system, sans-serif;
            padding: 2rem;
            text-align: center;
        }
        .container { max-width: 480px; }
        h1 { font-size: 6rem; font-weight: 200; color: #7c3aed; margin-bottom: 0.5rem; }
        h2 { font-size: 1.5rem; font-weight: 400; margin-bottom: 1rem; }
        p { color: #9ca3af; margin-bottom: 2rem; word-break: break-word; }
        code { background: rgba(124, 58, 237, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.9em; }
        .actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        a, button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-size: 1rem;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
        }
        .primary { background: #7c3aed; color: white; }
        .primary:hover { background: #6d28d9; transform: translateY(-2px); }
        .secondary { background: rgba(255,255,255,0.1); color: #e8e8e8; }
        .secondary:hover { background: rgba(255,255,255,0.15); }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The requested path <code>${pathname}</code> could not be found.</p>
        <div class="actions">
            <a href="/" class="primary">Go Home</a>
            <button onclick="history.back()" class="secondary">Go Back</button>
        </div>
    </div>
</body>
</html>`;

// ============================================================================
// MAIN APP REGISTRATION
// ============================================================================

export default async function (fastify, options = {}) {
    if (!fastify) throw Error("No Fastify...");

    // Register form body parser for POST requests
    await fastify.register(formbody);

    // Register multipart for file uploads (share target)
    await fastify.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB max
            files: 10
        }
    });

    // Compression
    await fastify.register(fastifyCompress, {
        global: true,
        inflateIfDeflated: true,
        threshold: 128,
        brotliOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
            },
        },
        encodings: ['br', 'deflate', 'gzip', 'identity'],
        zlibOptions: { level: 4 },
    });

    // ETag & Caching
    await fastify.register(Etag, { algorithm: "fnv1a" });
    await fastify.register(fastifyCaching, {
        cacheSegment: UUIDv4(),
        expiresIn: 1800,
        privacy: fastifyCaching.privacy.PUBLIC
    });

    const cacheControl = [
        `public`,
        `max-age=1800`,
        `stale-while-revalidate=86400`,
        `stale-if-error=86400`,
    ].join(", ");

    //
    fastify.addHook("onSend", function (req, reply, payload, next) {
        reply.header("Cross-Origin-Embedder-Policy", "require-corp");
        reply.header("Cross-Origin-Opener-Policy", "same-origin");
        reply.header("Content-Security-Policy",
            "default-src https: 'self' blob: data:;" +
            "img-src 'self' * blob: data:;" +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com blob: data:;" +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' node: blob: data:;" + //'strict-dynamic'
            "script-src-elem 'self' 'unsafe-inline' node: blob: data:;" +
            "worker-src 'self' blob:* data:*;");

        reply.header("Content-Language", "*");
        reply.header("Access-Control-Request-Headers", "*");
        reply.header("Access-Control-Allow-Methods", "*");
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "*");
        reply.header(
            "Permissions-Policy",
            [
                "clipboard-write=*",
                "clipboard-read=*",
                "microphone=*",
                "geolocation=*",
                "storage-access=*",
                "fullscreen=*",
                "gyroscope=*",
                "window-management=*",
                "picture-in-picture=*",
                "magnetometer=*",
                "accelerometer=*",
                "display-capture=*",
                "serial=*",
            ].join(", ")
        );
        reply.header("Cache-Control", cacheControl);
        reply.header("Service-Worker-Allowed", "/");
        reply.removeHeader("Clear-Site-Data");
        next();
    });

    //
    fastify.register(cors, {
        hook: "preHandler",
        delegator: (req, callback) => {
            const corsOptions = { origin: false };
            callback(null, corsOptions);
        },
        origin: "*",
        allowedHeaders:
            "Cache-Control, Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Service-Worker-Allowed, X-Access-Secret, X-Access-Key",
        cacheControl,
    });

    // Load index.html template
    const CODE = await LOADER;

    // Helper to serve index.html with early hints
    const serveIndexHtml = async (req, reply) => {
        const links = [
            '</load.mjs>; rel=modulepreload; as=script; crossorigin; fetchpriority=high',
            '</apps/cw/index.js>; rel=modulepreload; as=script; crossorigin',
        ];
        if (reply.raw.writeEarlyHints) {
            reply.raw.writeEarlyHints({ link: links });
        }
        return reply
            ?.code(200)
            ?.header?.('Content-Type', 'text/html; charset=utf-8')
            ?.type?.('text/html')
            ?.send?.(CODE);
    };

    // ========================================================================
    // API & UTILITY ROUTES
    // ========================================================================

    // Health check endpoint
    fastify.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

    // Same-origin SVG proxy for icons (fixes CSS CORS issues with external CDNs).
    // Example:
    //   /api/icon-proxy?url=https%3A%2F%2Funpkg.com%2F%40phosphor-icons%2Fcore%402%2Fassets%2Fduotone%2Ffile-duotone.svg
    fastify.get('/api/icon-proxy', async (req, reply) => {
        const urlParam = req?.query?.url;
        if (typeof urlParam !== 'string' || !urlParam) {
            return reply.code(400).type('text/plain; charset=utf-8').send('Missing "url" query param');
        }

        let target;
        try {
            target = new URL(urlParam);
        } catch {
            return reply.code(400).type('text/plain; charset=utf-8').send('Invalid "url" query param');
        }

        // Restrict proxy to known icon CDNs + phosphor asset paths only.
        const allowedHosts = new Set(['cdn.jsdelivr.net', 'unpkg.com']);
        if (!allowedHosts.has(target.hostname)) {
            return reply.code(403).type('text/plain; charset=utf-8').send('Forbidden host');
        }

        const allowedPrefixes = [
            // jsDelivr npm assets
            '/npm/@phosphor-icons/core@2/assets/',
            // unpkg assets
            '/@phosphor-icons/core@2/assets/',
        ];
        const allowed = allowedPrefixes.some((p) => target.pathname.startsWith(p));
        if (!allowed || !target.pathname.endsWith('.svg')) {
            return reply.code(403).type('text/plain; charset=utf-8').send('Forbidden path');
        }

        try {
            const upstream = await fetch(target.href, {
                redirect: 'follow',
                headers: {
                    'accept': 'image/svg+xml,*/*;q=0.8',
                    'user-agent': 'u2re-icon-proxy/1.0',
                },
            });

            if (!upstream.ok) {
                return reply
                    .code(502)
                    .type('text/plain; charset=utf-8')
                    .send(`Upstream error: ${upstream.status} ${upstream.statusText}`);
            }

            const arrayBuffer = await upstream.arrayBuffer();
            const contentType = upstream.headers.get('content-type') || 'image/svg+xml; charset=utf-8';
            const etag = upstream.headers.get('etag');

            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=31536000, immutable');
            reply.header('Vary', 'Accept-Encoding');
            if (etag) {
                reply.header('ETag', etag);
            }

            return reply.send(Buffer.from(arrayBuffer));
        } catch (e) {
            return reply.code(502).type('text/plain; charset=utf-8').send(`Proxy fetch failed: ${e?.message || e}`);
        }
    });

    // Register AI proxy routes (fallback for when service worker is unavailable)
    await registerAIProxyRoutes(fastify);

    // ========================================================================
    // SHARE TARGET ROUTES (PWA share handling)
    // ========================================================================

    // Share target POST handler (when service worker isn't available)
    // This provides fallback handling for share target when SW is not loaded
    fastify.post('/share-target', async (req, reply) => {
        console.log('[ShareTarget] POST received at server level');

        try {
            // Extract data from multipart form or body
            let shareData = { title: '', text: '', url: '', files: [], timestamp: Date.now() };

            if (req.isMultipart?.()) {
                // Handle multipart form data
                const parts = req.parts?.();
                if (parts) {
                    for await (const part of parts) {
                        if (part.type === 'file') {
                            // Store file info (actual processing done client-side)
                            shareData.files.push({
                                filename: part.filename,
                                mimetype: part.mimetype,
                                size: part.file?.bytesRead || 0
                            });
                        } else if (part.type === 'field') {
                            if (part.fieldname === 'title') shareData.title = part.value || '';
                            if (part.fieldname === 'text') shareData.text = part.value || '';
                            if (part.fieldname === 'url') shareData.url = part.value || '';
                        }
                    }
                }
            } else if (req.body) {
                // Handle JSON or form-urlencoded body
                const body = req.body;
                shareData.title = body.title || '';
                shareData.text = body.text || '';
                shareData.url = body.url || '';
            }

            console.log('[ShareTarget] Processed data:', {
                title: shareData.title,
                text: shareData.text?.substring?.(0, 50),
                url: shareData.url,
                filesCount: shareData.files?.length || 0
            });

            // Encode share data for query string
            const params = new URLSearchParams();
            params.set('shared', '1');
            if (shareData.title) params.set('title', shareData.title);
            if (shareData.text) params.set('text', shareData.text);
            if (shareData.url) params.set('sharedUrl', shareData.url);

            // Redirect to app with share data in query
            return reply.redirect(`/?${params.toString()}`);
        } catch (err) {
            console.error('[ShareTarget] Error handling share:', err);
            return reply.redirect('/?error=share_failed');
        }
    });

    // Share target with underscore (alternative URL)
    fastify.post('/share_target', async (req, reply) => {
        // Redirect to canonical share-target handler
        return reply.redirect(307, '/share-target');
    });

    // Share target GET handlers (for direct navigation)
    fastify.get('/share-target', async (req, reply) => {
        console.log('[ShareTarget] GET request - serving SPA');
        return serveIndexHtml(req, reply);
    });

    fastify.get('/share_target', async (req, reply) => {
        return reply.redirect('/?shared=test');
    });

    // ========================================================================
    // PRINT ROUTE
    // ========================================================================

    // Print route - serves a clean markdown viewer for printing
    // ========================================================================
    // SIMPLIFIED ROUTING: All routes serve the main app
    // ========================================================================

    // Helper function to create the main app HTML
    const createMainAppHTML = () => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
            <title>CrossWord</title>
            <base href="/">
            <link rel="icon" type="image/svg+xml" href="favicon.svg">
            <link rel="icon" type="image/png" href="favicon.png">

            <!-- Critical initial styles to prevent FOUC and ensure proper rendering -->
            <style data-owner="critical-init">
                /* Hide undefined custom elements and problematic elements during load */
                :where(*):not(:defined) {
                    opacity: 0 !important;
                    visibility: collapse !important;
                    pointer-events: none !important;
                    display: none !important;
                }

                /* Hide script, link, style elements to prevent visual glitches */
                :where(link, script, style) {
                    display: none !important;
                    pointer-events: none !important;
                    visibility: hidden !important;
                }

                /* Ensure html and body have no padding/margin and correct sizing */
                html, body {
                    padding: 0 !important;
                    margin: 0 !important;
                    box-sizing: border-box !important;
                    border: none !important;
                    outline: none !important;
                    overflow: hidden !important;
                }

                /* Full viewport body sizing */
                html {
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    max-inline-size: 100% !important;
                    max-block-size: 100% !important;
                    min-inline-size: 100% !important;
                    min-block-size: 100% !important;
                }

                body {
                    display: grid !important;
                    grid-template-columns: 1fr !important;
                    grid-template-rows: 1fr !important;
                    place-content: stretch !important;
                    place-items: stretch !important;
                    position: relative !important;
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    max-inline-size: 100% !important;
                    max-block-size: 100% !important;
                    min-inline-size: 100% !important;
                    min-block-size: 100% !important;
                    container-type: size !important;
                    contain: strict !important;
                }

                /* App container styling */
                #app {
                    display: grid !important;
                    grid-template-columns: 1fr !important;
                    grid-template-rows: 1fr !important;
                    place-content: stretch !important;
                    place-items: stretch !important;
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    max-inline-size: 100% !important;
                    max-block-size: 100% !important;
                    min-inline-size: 0 !important;
                    min-block-size: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                    outline: none !important;
                    overflow: hidden !important;
                    position: relative !important;
                    container-type: size !important;
                    contain: strict !important;
                }

                /* Loading state */
                #app:empty::before {
                    content: "Loading CrossWord..." !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    font-family: system-ui, -apple-system, sans-serif !important;
                    font-size: 1.2rem !important;
                    color: #666 !important;
                    background: #fff !important;
                    position: absolute !important;
                    inset: 0 !important;
                    z-index: 9999 !important;
                }
            </style>
        </head>
        <body>
            <div id="app"></div>
            <script type="module" src="./load.mjs"></script>
        </body>
        </html>
    `;

    // All app routes serve the main app (client handles routing)
    fastify.get('/basic', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTML());
    });

    fastify.get('/faint', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTML());
    });

    fastify.get('/print', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTML());
    });

    // ========================================================================
    // SPA ROUTES (serve index.html for client-side routing)
    // ========================================================================

    // Root route - serves main app (client handles all routing)
    fastify.get('/', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTML());
    });

    // ========================================================================
    // CUSTOM ASSET LOOKUP WITH FALLBACK
    // ========================================================================

    /**
     * Custom asset lookup with fallback mechanism
     * Tries app directory first, then root frontend directory
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

    // ========================================================================
    // STATIC FILE SERVING
    // ========================================================================

    await fastify.register(async (instance) => {
        // Request timeout hook
        instance.addHook("onRequest", async (req, reply) => {
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
        instance.addHook("preHandler", async (req, reply) => {
            // Only intercept static file requests
            if (!isStaticFilePath(req.url)) {
                return; // Let other routes handle this
            }

            // For root-level requests, try multiple fallback locations
            const pathname = req.url.split('?')[0]; // Remove query string
            if (pathname.startsWith('/index.js') || pathname.startsWith('/assets/') || pathname.startsWith('/modules/')) {
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

        // Static file headers helper
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
            } else if (ext === 'webmanifest') {
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

        // Shared frontend static files (from main frontend directory)
        await instance.register(fastifyStatic, {
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
            await instance.register(fastifyStatic, {
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
        await instance.register(fastifyStatic, {
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
    });

    // ========================================================================
    // SPA FALLBACK & 404 HANDLING
    // ========================================================================

    // Catch-all for SPA routes (serve index.html)
    fastify.setNotFoundHandler(async (req, reply) => {
        const pathname = req.url?.split?.('?')?.[0] || req.url || '';

        // Check if this looks like a static file request
        if (isStaticFilePath(pathname)) {
            // Return styled 404 for missing static files
            console.log(`[404] Static file not found: ${pathname}`);
            return reply
                .code(404)
                .header('Content-Type', 'text/html; charset=utf-8')
                .send(generate404Page(pathname));
        }

        // For non-file paths, treat as SPA route and serve index.html
        console.log(`[SPA] Serving index.html for: ${pathname}`);
        return serveIndexHtml(req, reply);
    });

    // Custom error handler for 500s and other errors
    fastify.setErrorHandler(async (error, req, reply) => {
        const statusCode = error.statusCode || 500;
        console.error(`[Error ${statusCode}]`, error.message, req.url);

        if (statusCode === 404) {
            return reply
                .code(404)
                .header('Content-Type', 'text/html; charset=utf-8')
                .send(generate404Page(req.url));
        }

        // For other errors, return JSON error response
        return reply.code(statusCode).send({
            ok: false,
            error: error.message || 'Internal Server Error',
            statusCode
        });
    });
}

//
let port = 443;
if (Array.from(process.argv).some((e) => e.endsWith("port"))) {
    const index = Array.from(process.argv).findIndex((e) => e.endsWith("port"));
    port = parseInt(process.argv[index + 1]);
}

//
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
