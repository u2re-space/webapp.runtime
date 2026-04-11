/**
 * Utility Functions Module
 *
 * Shared utility functions for the router
 */

import fs from "fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

// Generate UUIDv4
export const UUIDv4 = () => {
    return (crypto?.randomUUID ? crypto?.randomUUID() : ("10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16))));
};

/**
 * Check if path is a static file (has extension)
 */
export const isStaticFilePath = (pathname) => {
    const ext = path.extname(pathname);
    return ext && ext.length > 1 && !pathname.endsWith('/');
};

/**
 * Resolve asset paths with app and fallback lookup
 */
export const resolveAssetPaths = (pathname, __frontendDir, APPS_DIR) => {
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
 * SPA routes that should serve index.html
 */
export const SPA_ROUTES = [
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
export const isSpaRoute = (pathname) => {
    // Exact matches for known SPA routes
    if (SPA_ROUTES.includes(pathname)) return true;
    // Non-file paths that don't match static files
    if (!isStaticFilePath(pathname) && pathname !== '/' && !pathname.startsWith('/api/')) return true;
    return false;
};

const verboseProbe = (): boolean => process.env.CWS_VERBOSE_FRONTEND_PROBE === "1";

/**
 * Probe directories to find existing paths.
 * By default logs only warnings (e.g. fallback). Set `CWS_VERBOSE_FRONTEND_PROBE=1` for per-directory trace
 * (useful when `import.meta.dirname` differs between TS sources and bundled `cwsp.mjs`).
 */
export const probeDirectory = async (dirList, agr = "local/", testFile = "certificate.crt") => {
    const verbose = verboseProbe();
    if (verbose) {
        console.log(`[Probe] Looking for ${testFile} in directories:`);
    }

    for (const dir of dirList) {
        const baseDir = path.isAbsolute(dir)
            ? agr
                ? path.join(dir, agr)
                : dir
            : path.resolve(import.meta.dirname, String(dir) + agr);
        const fullPath = path.join(baseDir, testFile);
        let check = null;
        try {
            check = await fs.stat(fullPath).catch(() => null);

            if (check && check.isFile()) {
                if (verbose) {
                    console.log(`[Probe] ✓ Found ${testFile} in: ${baseDir}`);
                }
                return baseDir;
            }
            if (verbose) {
                console.log(`[Probe] ✗ Not found in: ${baseDir}`);
            }
        } catch (e) {
            if (verbose) {
                console.log(`[Probe] ✗ Error checking: ${baseDir} - ${e.message}`);
            }
        }
    }

    const first = dirList[0];
    const fallbackDir = path.isAbsolute(first)
        ? first
        : path.resolve(import.meta.dirname, String(first));
    console.warn(`[Probe] No ${testFile} matched — using fallback directory: ${fallbackDir}`);
    return fallbackDir;
};