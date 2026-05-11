/**
 * Phosphor icon upstream: local `@phosphor-icons/core` assets first (offline / no CDN), then CDN mirrors + LRU cache.
 * - String SVG helpers for direct icon routes.
 * - Buffer + content-type helpers for icon proxy / fixed-path assets.
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

export const PHOSPHOR_STYLES = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;
export type PhosphorStyle = (typeof PHOSPHOR_STYLES)[number];

const PHOSPHOR_STYLE_SET = new Set<string>([...PHOSPHOR_STYLES]);

const MAX_CACHE_ENTRIES = 512;
const FETCH_TIMEOUT_MS = 8000;
const DEFAULT_WARM_CONCURRENCY = 6;
const MAX_WARM_ITEMS = 120;
const FETCH_PARALLEL = 2;

const svgCache = new Map<string, string>();
const phosphorAssetCache = new Map<string, { body: Buffer; contentType: string }>();

function lruTouchGet<V>(map: Map<string, V>, key: string): V | undefined {
    const v = map.get(key);
    if (v === undefined) return undefined;
    map.delete(key);
    map.set(key, v);
    return v;
}

function lruTouchSet<V>(map: Map<string, V>, key: string, value: V, maxEntries: number): void {
    map.delete(key);
    map.set(key, value);
    while (map.size > maxEntries) {
        const first = map.keys().next().value;
        if (first !== undefined) map.delete(first);
    }
}

const cacheKey = (style: PhosphorStyle, iconName: string): string => `${style}:${iconName}`;

const withStyleSuffix = (style: PhosphorStyle, iconName: string): string => {
    if (style === "duotone") return `${iconName}-duotone`;
    if (style === "regular") return iconName;
    return `${iconName}-${style}`;
};

export const isValidPhosphorStyle = (value: string): value is PhosphorStyle => {
    return (PHOSPHOR_STYLES as readonly string[]).includes(value);
};

export const isValidPhosphorIconName = (value: string): boolean => /^[a-z0-9-]+$/i.test(value);

export const phosphorMirrorUrls = (style: PhosphorStyle, iconName: string): string[] => {
    const file = `${withStyleSuffix(style, iconName)}.svg`;
    const rel = `${style}/${file}`;
    return [
        `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${rel}`,
        `https://unpkg.com/@phosphor-icons/core@2/assets/${rel}`,
    ];
};

/** Relative path under assets/, e.g. `duotone/house-duotone.svg` */
export const phosphorMirrorUrlsFromRelativePath = (relativePath: string): string[] => {
    const base = relativePath.replace(/^\/+/, "");
    return [
        `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${base}`,
        `https://unpkg.com/@phosphor-icons/core@2/assets/${base}`,
    ];
};

/** Alias for mirror URLs from a normalized relative path (proxy / fixed-path naming). */
export const phosphorUrlsFromFixedPath = phosphorMirrorUrlsFromRelativePath;

async function fetchSvgText(url: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { accept: "image/svg+xml,text/plain,*/*;q=0.8" },
            signal: controller.signal,
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const text = await res.text();
        if (!text.includes("<svg")) {
            throw new Error("Invalid SVG body");
        }
        return text;
    } finally {
        clearTimeout(timer);
    }
}

async function fetchFirstFromMirrors(urls: string[]): Promise<string> {
    for (let i = 0; i < urls.length; i += FETCH_PARALLEL) {
        const wave = urls.slice(i, i + FETCH_PARALLEL).map((u) => fetchSvgText(u));
        try {
            return await Promise.any(wave);
        } catch {
            /* try next wave */
        }
    }
    throw new Error("All phosphor upstream mirrors failed");
}

async function fetchOneBuffer(url: string): Promise<{ body: Buffer; contentType: string }> {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const r = await fetch(url, {
            method: "GET",
            headers: {
                accept: "image/svg+xml,*/*;q=0.8",
                "user-agent": "u2re-runtime-fastify/1.0",
            },
            signal: controller.signal,
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length === 0) throw new Error("empty body");
        const ct = r.headers.get("content-type") || "image/svg+xml; charset=utf-8";
        return { body: buf, contentType: ct };
    } finally {
        clearTimeout(t);
    }
}

async function fetchFirstBufferFromMirrors(urls: string[]): Promise<{ body: Buffer; contentType: string }> {
    for (let i = 0; i < urls.length; i += FETCH_PARALLEL) {
        const wave = urls.slice(i, i + FETCH_PARALLEL).map((u) => fetchOneBuffer(u));
        try {
            return await Promise.any(wave);
        } catch {
            /* next wave */
        }
    }
    throw new Error("All phosphor upstream mirrors failed");
}

let cachedPhosphorAssetsRoot: string | null | undefined;

/** Resolved once: `.../node_modules/@phosphor-icons/core/assets` or `null` if package missing. */
function getPhosphorAssetsRoot(): string | null {
    if (cachedPhosphorAssetsRoot !== undefined) return cachedPhosphorAssetsRoot;
    try {
        const require = createRequire(import.meta.url);
        const pkgJson = require.resolve("@phosphor-icons/core/package.json");
        cachedPhosphorAssetsRoot = path.join(path.dirname(pkgJson), "assets");
        return cachedPhosphorAssetsRoot;
    } catch {
        cachedPhosphorAssetsRoot = null;
        return null;
    }
}

async function readPhosphorSvgFromPackage(style: PhosphorStyle, iconName: string): Promise<string | undefined> {
    const root = getPhosphorAssetsRoot();
    if (!root) return undefined;
    const file = `${withStyleSuffix(style, iconName)}.svg`;
    const abs = path.resolve(path.join(root, style, file));
    const rootResolved = path.resolve(root);
    if (!abs.startsWith(rootResolved + path.sep) && abs !== rootResolved) return undefined;
    try {
        const text = await readFile(abs, "utf8");
        if (!text.includes("<svg")) return undefined;
        return text;
    } catch {
        return undefined;
    }
}

export async function getPhosphorSvgCached(style: PhosphorStyle, iconName: string): Promise<string> {
    const key = cacheKey(style, iconName);
    const hit = lruTouchGet(svgCache, key);
    if (hit !== undefined) return hit;

    const fromDisk = await readPhosphorSvgFromPackage(style, iconName);
    if (fromDisk !== undefined) {
        lruTouchSet(svgCache, key, fromDisk, MAX_CACHE_ENTRIES);
        return fromDisk;
    }

    const urls = phosphorMirrorUrls(style, iconName);
    const svg = await fetchFirstFromMirrors(urls);
    lruTouchSet(svgCache, key, svg, MAX_CACHE_ENTRIES);
    return svg;
}

export async function getPhosphorSvgByRelativePathCached(relativePath: string): Promise<string> {
    const norm = relativePath.replace(/^\/+/, "").toLowerCase();
    const hit = lruTouchGet(svgCache, `path:${norm}`);
    if (hit !== undefined) return hit;

    const root = getPhosphorAssetsRoot();
    if (root) {
        const abs = path.resolve(path.join(root, norm));
        const rootResolved = path.resolve(root);
        if ((abs.startsWith(rootResolved + path.sep) || abs === rootResolved) && norm.length > 0) {
            try {
                const text = await readFile(abs, "utf8");
                if (text.includes("<svg")) {
                    lruTouchSet(svgCache, `path:${norm}`, text, MAX_CACHE_ENTRIES);
                    return text;
                }
            } catch {
                /* fall through to CDN */
            }
        }
    }

    const urls = phosphorMirrorUrlsFromRelativePath(norm);
    const svg = await fetchFirstFromMirrors(urls);
    lruTouchSet(svgCache, `path:${norm}`, svg, MAX_CACHE_ENTRIES);
    return svg;
}

export type PhosphorWarmItem = { style: PhosphorStyle; icon: string };

export async function warmPhosphorIcons(
    items: ReadonlyArray<PhosphorWarmItem>,
    concurrency = DEFAULT_WARM_CONCURRENCY
): Promise<{ ok: number; fail: number; skipped: number }> {
    const slice = items.slice(0, MAX_WARM_ITEMS);
    let ok = 0;
    let fail = 0;
    const queue = [...slice];
    const n = Math.max(1, Math.min(16, Math.floor(concurrency)));

    const worker = async (): Promise<void> => {
        for (;;) {
            const it = queue.shift();
            if (!it) return;
            try {
                await getPhosphorSvgCached(it.style, it.icon);
                ok += 1;
            } catch {
                fail += 1;
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(n, queue.length) }, () => worker()));
    return { ok, fail, skipped: items.length - slice.length };
}

export function phosphorCacheStats(): { entries: number; maxEntries: number } {
    return { entries: svgCache.size, maxEntries: MAX_CACHE_ENTRIES };
}

/** e.g. duotone/copy-duotone.svg — normalized lowercase relative path under assets/. */
async function readPhosphorBufferFromDisk(relativeNormLower: string): Promise<{ body: Buffer; contentType: string } | null> {
    const root = getPhosphorAssetsRoot();
    if (!root) return null;
    const abs = path.resolve(path.join(root, relativeNormLower));
    const rootResolved = path.resolve(root);
    if (!abs.startsWith(rootResolved + path.sep) && abs !== rootResolved) return null;
    try {
        const buf = await readFile(abs);
        if (buf.length === 0 || !buf.includes("<svg")) return null;
        return { body: buf, contentType: "image/svg+xml; charset=utf-8" };
    } catch {
        return null;
    }
}

function relativePathFromPhosphorProxyUrl(targetUrl: URL): string | null {
    try {
        const p = targetUrl.pathname;
        if (targetUrl.hostname === "cdn.jsdelivr.net" && p.includes("/npm/@phosphor-icons/core@2/assets/")) {
            const rel = p.split("/npm/@phosphor-icons/core@2/assets/")[1];
            return rel ? rel.toLowerCase() : null;
        }
        if (targetUrl.hostname === "unpkg.com" && p.startsWith("/@phosphor-icons/core@2/assets/")) {
            const rel = p.slice("/@phosphor-icons/core@2/assets/".length);
            return rel ? rel.toLowerCase() : null;
        }
    } catch {
        /* noop */
    }
    return null;
}

/** e.g. duotone/house-duotone.svg */
export async function getCachedPhosphorAsset(fixedIconPath: string): Promise<{ body: Buffer; contentType: string }> {
    const key = String(fixedIconPath || "").replace(/^\/+/, "").toLowerCase();
    const hit = lruTouchGet(phosphorAssetCache, key);
    if (hit !== undefined) return hit;

    const local = await readPhosphorBufferFromDisk(key);
    if (local) {
        lruTouchSet(phosphorAssetCache, key, local, MAX_CACHE_ENTRIES);
        return local;
    }

    const urls = phosphorUrlsFromFixedPath(key);
    const out = await fetchFirstBufferFromMirrors(urls);
    lruTouchSet(phosphorAssetCache, key, out, MAX_CACHE_ENTRIES);
    return out;
}

export function mirrorUrlsForIconProxy(targetUrl: URL): string[] {
    const list = [targetUrl.href];
    try {
        const p = targetUrl.pathname;
        if (targetUrl.hostname === "cdn.jsdelivr.net" && p.includes("/npm/@phosphor-icons/core@2/assets/")) {
            const rel = p.split("/npm/@phosphor-icons/core@2/assets/")[1];
            if (rel) list.push(`https://unpkg.com/@phosphor-icons/core@2/assets/${rel}`);
        } else if (targetUrl.hostname === "unpkg.com" && p.startsWith("/@phosphor-icons/core@2/assets/")) {
            const rel = p.slice("/@phosphor-icons/core@2/assets/".length);
            if (rel) list.push(`https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${rel}`);
        }
    } catch {
        /* noop */
    }
    return [...new Set(list)];
}

function normalizePhosphorProxyKey(targetUrl: URL): string {
    const p = targetUrl.pathname;
    if (targetUrl.hostname === "unpkg.com" && p.startsWith("/@phosphor-icons/core@2/assets/")) {
        return `p:${p.slice("/@phosphor-icons/core@2/assets/".length).toLowerCase()}`;
    }
    if (targetUrl.hostname === "cdn.jsdelivr.net" && p.includes("/npm/@phosphor-icons/core@2/assets/")) {
        const rel = p.split("/npm/@phosphor-icons/core@2/assets/")[1];
        return rel ? `p:${rel.toLowerCase()}` : `raw:${targetUrl.href}`;
    }
    return `raw:${targetUrl.href}`;
}

export async function fetchIconProxyCached(targetUrl: URL): Promise<{ body: Buffer; contentType: string }> {
    const key = normalizePhosphorProxyKey(targetUrl);
    const hit = lruTouchGet(phosphorAssetCache, key);
    if (hit !== undefined) return hit;

    const rel = relativePathFromPhosphorProxyUrl(targetUrl);
    if (rel) {
        const local = await readPhosphorBufferFromDisk(rel);
        if (local) {
            lruTouchSet(phosphorAssetCache, key, local, MAX_CACHE_ENTRIES);
            return local;
        }
    }

    const urls = mirrorUrlsForIconProxy(targetUrl);
    const out = await fetchFirstBufferFromMirrors(urls);
    lruTouchSet(phosphorAssetCache, key, out, MAX_CACHE_ENTRIES);
    return out;
}

export async function warmPhosphorItems(
    items: ReadonlyArray<{ style: string; icon: string }>,
    concurrency = 6
): Promise<{ ok: number; fail: number; skipped: number; cacheEntries: number }> {
    const slice = items.slice(0, MAX_WARM_ITEMS);
    let ok = 0;
    let fail = 0;
    const queue: string[] = [];

    for (const it of slice) {
        const st = String(it?.style ?? "").trim().toLowerCase();
        const ic = String(it?.icon ?? "")
            .replace(/\.svg$/i, "")
            .trim()
            .toLowerCase();
        if (!PHOSPHOR_STYLE_SET.has(st) || !isValidPhosphorIconName(ic)) continue;
        const file =
            st === "duotone"
                ? `${ic}-duotone.svg`
                : st === "regular"
                  ? `${ic}.svg`
                  : `${ic}-${st}.svg`;
        queue.push(`${st}/${file}`);
    }

    const n = Math.max(1, Math.min(16, Math.floor(concurrency)));
    const worker = async (): Promise<void> => {
        while (queue.length) {
            const rel = queue.shift();
            if (!rel) return;
            try {
                await getCachedPhosphorAsset(rel);
                ok += 1;
            } catch {
                fail += 1;
            }
        }
    };

    const workerCount = queue.length === 0 ? 0 : Math.min(n, queue.length);
    if (workerCount > 0) {
        await Promise.all(Array.from({ length: workerCount }, () => worker()));
    }
    return { ok, fail, skipped: items.length - slice.length, cacheEntries: phosphorAssetCache.size };
}
