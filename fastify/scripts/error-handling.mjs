/**
 * Error Handling Module
 *
 * Handles 404 pages, error responses, and custom error handlers
 */

import path from "node:path"

/**
 * Generate 404 error page HTML
 */
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

/**
 * Check if path is a static file (has extension)
 */
const isStaticFilePath = (pathname) => {
    const ext = path.extname(pathname);
    return ext && ext.length > 1 && !pathname.endsWith('/');
};

export function registerErrorHandling(fastify, options = {}) {
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

        // Import the SPA serving function dynamically
        const { serveIndexHtml } = await import('./spa-routing.mjs');
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