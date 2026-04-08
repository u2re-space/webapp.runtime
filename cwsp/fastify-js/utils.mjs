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

/**
 * Probe directories to find existing paths
 */
export const probeDirectory = async (dirList, agr = "local/", testFile = "certificate.crt") => {
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