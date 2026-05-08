import { t as API_ENDPOINTS } from "./Names.js";
//#region ../../modules/projects/subsystem/src/routing/channel/ShareTargetGateway.ts
/**
* Helpers for moving share-target payloads between the service worker, Cache
* Storage, and the foreground app.
*
* WHY: share-target launches often happen before the main app is ready. These
* helpers persist the payload in browser-managed caches so the UI can consume
* it later without depending on a live in-memory handoff.
*/
var SHARE_CACHE_NAME = "share-target-data";
var SHARE_CACHE_KEY = "/share-target-data";
var SHARE_FILES_MANIFEST_KEY = "/share-target-files";
var hasCaches = () => typeof globalThis !== "undefined" && "caches" in globalThis;
/**
* Rehydrate the cached share-target payload and optionally clear the consumed
* cache entries so they are not replayed on the next app load.
*/
var consumeCachedShareTargetPayload = async (opts = {}) => {
	const clear = opts.clear !== false;
	if (!hasCaches()) return null;
	try {
		const cache = await caches.open(SHARE_CACHE_NAME);
		const metaResp = await cache.match(SHARE_CACHE_KEY);
		const manifestResp = await cache.match(SHARE_FILES_MANIFEST_KEY);
		if (!metaResp && !manifestResp) return null;
		const meta = metaResp ? await metaResp.json().catch(() => null) : null;
		const manifest = manifestResp ? await manifestResp.json().catch(() => null) : null;
		const fileMeta = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const fm of fileMeta) {
			const fileKey = typeof fm?.key === "string" ? fm.key.trim() : String(fm?.key ?? "").trim();
			if (!fileKey) continue;
			const response = await cache.match(fileKey);
			if (!response) continue;
			const blob = await response.blob();
			files.push(new File([blob], fm.name || "shared-file", {
				type: fm.type || blob.type || "application/octet-stream",
				lastModified: Number(fm.lastModified) || Date.now()
			}));
		}
		if (clear) {
			await cache.delete(SHARE_CACHE_KEY).catch(() => {});
			await cache.delete(SHARE_FILES_MANIFEST_KEY).catch(() => {});
			for (const fm of fileMeta) if (fm?.key) await cache.delete(fm.key).catch(() => {});
		}
		return {
			meta: meta || {},
			files,
			fileMeta
		};
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to consume cached payload:", error);
		return null;
	}
};
/** Read the service worker's advertised cached content entries through the HTTP bridge. */
var fetchSwCachedEntries = async () => {
	try {
		const response = await fetch(API_ENDPOINTS.SW_CONTENT_AVAILABLE);
		if (!response.ok) return [];
		const data = await response.json();
		const keys = Array.isArray(data?.cacheKeys) ? data.cacheKeys : [];
		const content = [];
		for (const cacheKey of keys) {
			const key = String(cacheKey?.key || "");
			if (!key) continue;
			try {
				const contentResponse = await fetch(`${API_ENDPOINTS.SW_CONTENT}/${key}`);
				if (!contentResponse.ok) continue;
				content.push({
					key,
					context: String(cacheKey?.context || ""),
					content: await contentResponse.json()
				});
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch SW cache item:", error);
			}
		}
		return content;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch SW cache entries:", error);
		return [];
	}
};
/** Fetch share-target files exposed by the service worker-side manifest endpoint. */
var fetchCachedShareFiles = async (cacheKey = "latest") => {
	try {
		const response = await fetch(`/share-target-files?cacheKey=${encodeURIComponent(cacheKey)}`);
		if (!response.ok) return [];
		const manifest = await response.json();
		const fileItems = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const item of fileItems) {
			const fileUrl = typeof item?.key === "string" ? item.key : "";
			if (!fileUrl) continue;
			try {
				const fileResponse = await fetch(fileUrl);
				if (!fileResponse.ok) continue;
				const fileBlob = await fileResponse.blob();
				files.push(new File([fileBlob], item.name || "shared-file", { type: item.type || fileBlob.type || "application/octet-stream" }));
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch file from cache:", error);
			}
		}
		return files;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch cached share files:", error);
		return [];
	}
};
//#endregion
export { fetchCachedShareFiles as n, fetchSwCachedEntries as r, consumeCachedShareTargetPayload as t };
