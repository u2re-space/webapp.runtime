/**
 * Phosphor icon upstream: local `@phosphor-icons/core` assets first (offline / no CDN), then CDN mirrors + LRU cache.
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

export const PHOSPHOR_STYLES = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;
export type PhosphorStyle = (typeof PHOSPHOR_STYLES)[number];

const MAX_CACHE_ENTRIES = 512;
const FETCH_TIMEOUT_MS = 8000;
const DEFAULT_WARM_CONCURRENCY = 6;
const MAX_WARM_ITEMS = 120;

const svgCache = new Map<string, string>();

const cacheKey = (style: PhosphorStyle, iconName: string): string => `${style}:${iconName}`;

const touchGet = (key: string): string | undefined => {
    const v = svgCache.get(key);
    if (v === undefined) return undefined;
    svgCache.delete(key);
    svgCache.set(key, v);
    return v;
};

const touchSet = (key: string, svg: string): void => {
    svgCache.delete(key);
    svgCache.set(key, svg);
    while (svgCache.size > MAX_CACHE_ENTRIES) {
        const first = svgCache.keys().next().value;
        if (first !== undefined) svgCache.delete(first);
    }
};

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

const FETCH_PARALLEL = 2;

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
    const hit = touchGet(key);
    if (hit !== undefined) return hit;

    const fromDisk = await readPhosphorSvgFromPackage(style, iconName);
    if (fromDisk !== undefined) {
        touchSet(key, fromDisk);
        return fromDisk;
    }

    const urls = phosphorMirrorUrls(style, iconName);
    const svg = await fetchFirstFromMirrors(urls);
    touchSet(key, svg);
    return svg;
}

export async function getPhosphorSvgByRelativePathCached(relativePath: string): Promise<string> {
    const norm = relativePath.replace(/^\/+/, "").toLowerCase();
    const hit = touchGet(`path:${norm}`);
    if (hit !== undefined) return hit;

    const root = getPhosphorAssetsRoot();
    if (root) {
        const abs = path.resolve(path.join(root, norm));
        const rootResolved = path.resolve(root);
        if ((abs.startsWith(rootResolved + path.sep) || abs === rootResolved) && norm.length > 0) {
            try {
                const text = await readFile(abs, "utf8");
                if (text.includes("<svg")) {
                    touchSet(`path:${norm}`, text);
                    return text;
                }
            } catch {
                /* fall through to CDN */
            }
        }
    }

    const urls = phosphorMirrorUrlsFromRelativePath(norm);
    const svg = await fetchFirstFromMirrors(urls);
    touchSet(`path:${norm}`, svg);
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
