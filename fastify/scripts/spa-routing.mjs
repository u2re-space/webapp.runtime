/**
 * SPA Routing Module
 *
 * Handles Single Page Application routing and index.html serving
 */

import fs from "fs/promises"
import path from "node:path"

let LOADER, __frontendDir;

/**
 * Initialize SPA routing with required dependencies
 */
export function initializeSPARouting(frontendDir, loader) {
    __frontendDir = frontendDir;
    LOADER = loader;
}

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

/**
 * Check if path is a static file (has extension)
 */
const isStaticFilePath = (pathname) => {
    const ext = path.extname(pathname);
    return ext && ext.length > 1 && !pathname.endsWith('/');
};

/**
 * Helper to serve index.html with early hints
 */
export const serveIndexHtml = async (req, reply) => {
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
        ?.send?.(await LOADER);
};

/**
 * Create the main app HTML (used for various app entry points)
 */
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

export async function registerSPARouting(fastify, options = {}) {
    // ========================================================================
    // APP ENTRY POINTS
    // ========================================================================

    // Helper function to create the main app HTML
    const createMainAppHTMLContent = createMainAppHTML;

    // All app routes serve the main app (client handles all routing)
    fastify.get('/basic', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTMLContent());
    });

    fastify.get('/faint', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTMLContent());
    });

    fastify.get('/print', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTMLContent());
    });

    // ========================================================================
    // SPA ROUTES (serve index.html for client-side routing)
    // ========================================================================

    // Root route - serves main app (client handles all routing)
    fastify.get('/', async (req, reply) => {
        return reply
            .code(200)
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(createMainAppHTMLContent());
    });
}