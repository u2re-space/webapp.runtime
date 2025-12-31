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
    for (const dir of dirList) {
        let check = null;
        try {
            check = await fs
                .stat(path.resolve(import.meta.dirname, dir + agr, testFile))
                .catch(() => false);
        } catch(e) {
            console.warn(e);
        }
        if (check) {
            return path.resolve(import.meta.dirname, dir);
        }
    }
    return path.resolve(import.meta.dirname, dirList[0]);
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
const __dirname = (await probeDirectory(["../../frontend", "../frontend", "./frontend", "../../"+DIRNAME+"/frontend", "../"+DIRNAME+"/frontend", "./"+DIRNAME+"/frontend"], "./", "index.html"));
const LOADER = fs.readFile(path.resolve(__dirname, "index.html"), {encoding: 'utf-8'});

// Apps directory resolution
const APPS_DIR = path.resolve(__dirname, 'apps');

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
            "style-src 'self' 'unsafe-inline' blob: data:;" +
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
            '</apps/cw/index.js>; rel=modulepreload; as=script; crossorigin; fetchpriority=high',
            '</init.mjs>; rel=modulepreload; as=script; crossorigin',
            '</load.mjs>; rel=modulepreload; as=script; crossorigin',
            '</vital.mjs>; rel=modulepreload; as=script; crossorigin',
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
    // SPA ROUTES (serve index.html for client-side routing)
    // ========================================================================

    // Root route
    fastify.get('/', async (req, reply) => serveIndexHtml(req, reply));

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

        // Static file headers helper
        const setStaticHeaders = (res, filePath) => {
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

        // Main frontend static files (root level)
        await instance.register(fastifyStatic, {
            decorateReply: true,
            list: false,
            root: path.resolve(__dirname, './'),
            prefix: '/',
            setHeaders: setStaticHeaders,
            // Don't serve index.html as static - handled by route
            index: false,
            wildcard: false,
        });

        // Apps directory (e.g., /apps/cw/*)
        await instance.register(fastifyStatic, {
            decorateReply: false,
            list: false,
            root: APPS_DIR,
            prefix: '/apps/',
            setHeaders: setStaticHeaders,
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
export const options = {
    http2: true,
    esm: true,
    debug: true,
    logger: true,
    ignoreTrailingSlash: true,
    port: port || 443,
    https: { allowHTTP1: true, ...(Array.from(process.argv).some((e) => e.endsWith("no-https")) ? {} : (await import("file://" + (await probeDirectory(["../../https/", "../https/", "./https/"]) + "/certificate.mjs"))).default)},
    address: "0.0.0.0",
    host: "0.0.0.0",
};
