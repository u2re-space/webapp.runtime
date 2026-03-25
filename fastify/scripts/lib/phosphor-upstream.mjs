/**
 * Phosphor CDN fetch: LRU cache + parallel mirror racing (jsDelivr + unpkg, 2 at a time).
 * Keep behavior aligned with server-v2/protocol/http/lib/phosphor-upstream.ts
 */

const MAX_CACHE_ENTRIES = 512;
const FETCH_TIMEOUT_MS = 8000;
const FETCH_PARALLEL = 2;
const MAX_WARM_ITEMS = 120;

const PHOSPHOR_STYLES = new Set(["thin", "light", "regular", "bold", "fill", "duotone"]);

/** @type {Map<string, { body: Buffer, contentType: string }>} */
const pathCache = new Map();

const touchGet = (key) => {
    const v = pathCache.get(key);
    if (!v) return null;
    pathCache.delete(key);
    pathCache.set(key, v);
    return v;
};

const touchSet = (key, value) => {
    pathCache.delete(key);
    pathCache.set(key, value);
    while (pathCache.size > MAX_CACHE_ENTRIES) {
        const first = pathCache.keys().next().value;
        if (first !== undefined) pathCache.delete(first);
    }
};

export const phosphorUrlsFromFixedPath = (fixedIconPath) => {
    const base = String(fixedIconPath || "").replace(/^\/+/, "");
    return [
        `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${base}`,
        `https://unpkg.com/@phosphor-icons/core@2/assets/${base}`,
    ];
};

async function fetchOneBuffer(url) {
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

async function fetchFirstWave(urls) {
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

/**
 * @param {string} fixedIconPath e.g. duotone/house-duotone.svg
 */
export async function getCachedPhosphorAsset(fixedIconPath) {
    const key = String(fixedIconPath || "").replace(/^\/+/, "").toLowerCase();
    const hit = touchGet(key);
    if (hit) return hit;
    const urls = phosphorUrlsFromFixedPath(key);
    const out = await fetchFirstWave(urls);
    touchSet(key, out);
    return out;
}

export function mirrorUrlsForIconProxy(targetUrl) {
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

const normalizePhosphorProxyKey = (targetUrl) => {
    const p = targetUrl.pathname;
    if (targetUrl.hostname === "unpkg.com" && p.startsWith("/@phosphor-icons/core@2/assets/")) {
        return `p:${p.slice("/@phosphor-icons/core@2/assets/".length).toLowerCase()}`;
    }
    if (targetUrl.hostname === "cdn.jsdelivr.net" && p.includes("/npm/@phosphor-icons/core@2/assets/")) {
        const rel = p.split("/npm/@phosphor-icons/core@2/assets/")[1];
        return rel ? `p:${rel.toLowerCase()}` : `raw:${targetUrl.href}`;
    }
    return `raw:${targetUrl.href}`;
};

export async function fetchIconProxyCached(targetUrl) {
    const urls = mirrorUrlsForIconProxy(targetUrl);
    const key = normalizePhosphorProxyKey(targetUrl);
    const hit = touchGet(key);
    if (hit) return hit;
    const out = await fetchFirstWave(urls);
    touchSet(key, out);
    return out;
}

const isValidIconName = (s) => /^[a-z0-9-]+$/i.test(s);

/**
 * @param {Array<{ style: string, icon: string }>} items
 * @param {number} [concurrency]
 */
export async function warmPhosphorItems(items, concurrency = 6) {
    const slice = items.slice(0, MAX_WARM_ITEMS);
    let ok = 0;
    let fail = 0;
    const queue = [];

    for (const it of slice) {
        const st = String(it?.style ?? "").trim().toLowerCase();
        const ic = String(it?.icon ?? "")
            .replace(/\.svg$/i, "")
            .trim()
            .toLowerCase();
        if (!PHOSPHOR_STYLES.has(st) || !isValidIconName(ic)) continue;
        const file =
            st === "duotone"
                ? `${ic}-duotone.svg`
                : st === "regular"
                  ? `${ic}.svg`
                  : `${ic}-${st}.svg`;
        queue.push(`${st}/${file}`);
    }

    const n = Math.max(1, Math.min(16, Math.floor(concurrency)));
    const worker = async () => {
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
    return { ok, fail, skipped: items.length - slice.length, cacheEntries: pathCache.size };
}

export { PHOSPHOR_STYLES };
