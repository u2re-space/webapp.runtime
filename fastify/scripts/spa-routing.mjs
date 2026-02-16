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

const INDEX_HTML_FILE = "index.html";
const EARLY_HINT_REL_SET = new Set(["modulepreload", "preload", "prefetch"]);
const SHELL_QUERY_ALIASES = new Map([
    ["minimal", "minimal"],
    ["faint", "minimal"],
    ["base", "base"],
    ["raw", "base"],
    ["core", "base"],
]);
const RESERVED_ROOT_SEGMENTS = new Set([
    "api",
    "assets",
    "apps",
    "modules",
    "pwa",
    "admin",
    "health",
    "sw.js",
    "favicon.ico",
    "favicon.png",
    "favicon.svg",
]);

const toEarlyHintHref = (hrefRaw) => {
    const href = (hrefRaw || "").trim();
    if (!href) return "";
    if (/^(https?:|wss?:|data:|blob:)/i.test(href)) return href;
    if (href.startsWith("/")) return href;
    if (href.startsWith("./")) return `/${href.slice(2)}`;
    return `/${href}`;
};

const extractEarlyHintLinks = (htmlText) => {
    const html = typeof htmlText === "string" ? htmlText : "";
    const out = [];
    const pattern = /<link\b[^>]*>/gi;
    const tags = html.match(pattern) || [];

    for (const tag of tags) {
        const relMatch = tag.match(/\brel\s*=\s*["']?([^"'\s>]+)["']?/i);
        if (!relMatch || !EARLY_HINT_REL_SET.has((relMatch[1] || "").toLowerCase())) continue;

        const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
        if (!hrefMatch) continue;

        const href = toEarlyHintHref(hrefMatch[1]);
        if (!href) continue;

        const attrs = [];
        const asMatch = tag.match(/\bas\s*=\s*["']?([^"'\s>]+)["']?/i);
        const crossoriginMatch = tag.match(/\bcrossorigin(?:\s*=\s*["']?([^"'\s>]+)["']?)?/i);
        const fetchPriorityMatch = tag.match(/\bfetchpriority\s*=\s*["']?([^"'\s>]+)["']?/i);

        attrs.push(`rel=${relMatch[1].toLowerCase()}`);
        if (asMatch?.[1]) attrs.push(`as=${asMatch[1]}`);
        if (crossoriginMatch) attrs.push("crossorigin");
        if (fetchPriorityMatch?.[1]) attrs.push(`fetchpriority=${fetchPriorityMatch[1]}`);

        out.push(`<${href}>; ${attrs.join("; ")}`);
    }

    // De-duplicate while preserving order.
    return Array.from(new Set(out));
};

const getIndexHtmlPath = () => {
    if (!__frontendDir) throw new Error("SPA routing is not initialized");
    return path.resolve(__frontendDir, INDEX_HTML_FILE);
};

const readIndexHtml = async () => {
    const htmlPath = getIndexHtmlPath();

    if (typeof LOADER === "function") {
        const loaded = await LOADER();
        const stats = await fs.stat(htmlPath);
        return { htmlPath, content: loaded, stats };
    }

    if (LOADER && typeof LOADER.then === "function") {
        const loaded = await LOADER;
        const stats = await fs.stat(htmlPath);
        return { htmlPath, content: loaded, stats };
    }

    const [content, stats] = await Promise.all([
        fs.readFile(htmlPath, "utf-8"),
        fs.stat(htmlPath)
    ]);
    return { htmlPath, content, stats };
};

const normalizeShellQueryValue = (value) => {
    const normalized = (value || "").trim().toLowerCase();
    return SHELL_QUERY_ALIASES.get(normalized) || null;
};

const buildCanonicalPathWithShellQuery = (requestUrl) => {
    const current = requestUrl || "/";
    const url = new URL(current, "http://localhost");
    const rawShell = url.searchParams.get("shell");
    if (rawShell === null) return null;

    const mapped = normalizeShellQueryValue(rawShell);
    const currentNormalized = rawShell.trim().toLowerCase();
    if (!mapped) {
        url.searchParams.delete("shell");
    } else if (mapped !== currentNormalized) {
        url.searchParams.set("shell", mapped);
    } else {
        return null;
    }

    const search = url.searchParams.toString();
    return `${url.pathname}${search ? `?${search}` : ""}`;
};

/**
 * Helper to serve index.html with early hints
 */
export const serveIndexHtml = async (req, reply) => {
    const canonicalPath = buildCanonicalPathWithShellQuery(req?.raw?.url || req?.url || "/");
    if (canonicalPath) {
        return reply.redirect(302, canonicalPath);
    }

    const { content, stats } = await readIndexHtml();
    const links = extractEarlyHintLinks(content);
    const etag = `W/"${Number(stats.mtimeMs || Date.now()).toString(36)}-${stats.size.toString(36)}"`;
    const lastModified = stats.mtime.toUTCString();

    const ifNoneMatch = req?.headers?.["if-none-match"];
    const ifModifiedSince = req?.headers?.["if-modified-since"];
    const modifiedSinceMs = typeof ifModifiedSince === "string" ? Date.parse(ifModifiedSince) : NaN;
    const notModifiedByEtag = typeof ifNoneMatch === "string" && ifNoneMatch === etag;
    const notModifiedByDate = Number.isFinite(modifiedSinceMs) && stats.mtimeMs <= modifiedSinceMs;

    if (reply.raw.writeEarlyHints && links.length > 0) {
        reply.raw.writeEarlyHints({ link: links });
    }

    reply.header("ETag", etag);
    reply.header("Last-Modified", lastModified);
    reply.header("Vary", "Accept-Encoding");
    // HTML should be quickly revalidated to keep runtime updates responsive.
    reply.header("Cache-Control", "public, max-age=0, must-revalidate");

    if (notModifiedByEtag || notModifiedByDate) {
        return reply.code(304).send();
    }

    return reply
        ?.code(200)
        ?.header?.('Content-Type', 'text/html; charset=utf-8')
        ?.type?.('text/html')
        ?.send?.(content);
};

export async function registerSPARouting(fastify, options = {}) {
    // ========================================================================
    // APP ENTRY POINTS
    // ========================================================================

    // Dynamic shell/view routes:
    // - /:view
    // - /:view/*
    // Reserved roots (api/assets/apps/...) are excluded.
    const shouldHandleAsViewRoute = (view) => {
        const normalized = (view || "").trim().toLowerCase();
        if (!normalized) return false;
        if (RESERVED_ROOT_SEGMENTS.has(normalized)) return false;
        if (normalized.includes(".")) return false;
        return true;
    };

    fastify.get('/:view', async (req, reply) => {
        const view = req?.params?.view;
        if (!shouldHandleAsViewRoute(view)) {
            return reply.callNotFound();
        }
        return serveIndexHtml(req, reply);
    });

    fastify.get('/:view/*', async (req, reply) => {
        const view = req?.params?.view;
        if (!shouldHandleAsViewRoute(view)) {
            return reply.callNotFound();
        }
        return serveIndexHtml(req, reply);
    });

    // ========================================================================
    // SPA ROUTES (serve index.html for client-side routing)
    // ========================================================================

    // Root route - serves main app (client handles all routing)
    fastify.get('/', async (req, reply) => {
        return serveIndexHtml(req, reply);
    });
}