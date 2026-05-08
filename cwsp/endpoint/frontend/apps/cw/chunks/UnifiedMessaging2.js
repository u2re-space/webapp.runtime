import { n as getUnifiedMessaging$1 } from "../fest/uniform.js";
import { a as DESTINATIONS, l as getDestinationAliases, n as BROADCAST_CHANNELS, s as createDestinationChannelMappings, u as normalizeDestination } from "./Names.js";
import "./core.js";
import "./templates.js";
import "./UniformInterop2.js";
//#region src/shared/routing/channel/ShareTargetGateway.ts
var SHARE_CACHE_NAME = "share-target-data";
var SHARE_CACHE_KEY = "/share-target-data";
var SHARE_FILES_MANIFEST_KEY = "/share-target-files";
var SHARE_FILE_PREFIX = "/share-target-file/";
var hasCaches = () => typeof globalThis !== "undefined" && "caches" in globalThis;
/** Persist the last share-target payload so the app can recover it after navigation or cold start. */
var storeShareTargetPayloadToCache = async (payload) => {
	if (!hasCaches()) return false;
	const files = Array.isArray(payload.files) ? payload.files : [];
	const meta = payload.meta ?? {};
	try {
		const cache = await caches.open(SHARE_CACHE_NAME);
		const timestamp = Number(meta?.timestamp) || Date.now();
		await cache.put(SHARE_CACHE_KEY, new Response(JSON.stringify({
			...meta,
			title: meta?.title,
			text: meta?.text,
			url: meta?.url,
			sharedUrl: meta?.sharedUrl,
			source: meta?.source || "share-target",
			route: meta?.route || meta?.source || "share-target",
			timestamp,
			fileCount: files.length,
			imageCount: files.filter((f) => (f?.type || "").toLowerCase().startsWith("image/")).length
		}), { headers: { "Content-Type": "application/json" } }));
		const fileManifest = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const key = `${SHARE_FILE_PREFIX}${timestamp}-${i}`;
			const headers = new Headers();
			headers.set("Content-Type", file.type || "application/octet-stream");
			headers.set("X-File-Name", encodeURIComponent(file.name || `file-${i}`));
			headers.set("X-File-Size", String(file.size || 0));
			headers.set("X-File-LastModified", String(file.lastModified ?? 0));
			await cache.put(key, new Response(file, { headers }));
			fileManifest.push({
				key,
				name: file.name || `file-${i}`,
				type: file.type || "application/octet-stream",
				size: file.size || 0,
				lastModified: file.lastModified ?? void 0
			});
		}
		await cache.put(SHARE_FILES_MANIFEST_KEY, new Response(JSON.stringify({
			files: fileManifest,
			timestamp
		}), { headers: { "Content-Type": "application/json" } }));
		return true;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to store payload to cache:", error);
		return false;
	}
};
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
/**
* Convert the staged cache payload back into a share/launch transfer object that
* the foreground pipeline can route without caring whether the ingress was
* share-target, launch-queue, or another staged producer.
*/
var buildShareDataFromCachedPayload = (payload) => {
	const meta = payload?.meta || {};
	const files = Array.isArray(payload?.files) ? payload.files : [];
	const fileMeta = Array.isArray(payload?.fileMeta) ? payload.fileMeta : [];
	const manifestName = typeof fileMeta[0]?.name === "string" && fileMeta[0].name.trim().length > 0 ? fileMeta[0].name.trim() : void 0;
	const rawHint = meta.hint;
	const baseHint = rawHint && typeof rawHint === "object" && !Array.isArray(rawHint) ? { ...rawHint } : {};
	let hintOut = Object.keys(baseHint).length > 0 ? { ...baseHint } : void 0;
	if (manifestName && !files.length) {
		if (!(typeof baseHint.filename === "string" ? String(baseHint.filename).trim() : "")) hintOut = {
			...hintOut || baseHint,
			filename: manifestName
		};
	}
	const out = {
		...meta,
		title: typeof meta.title === "string" ? meta.title : void 0,
		text: typeof meta.text === "string" ? meta.text : void 0,
		url: typeof meta.url === "string" ? meta.url : void 0,
		sharedUrl: typeof meta.sharedUrl === "string" ? meta.sharedUrl : void 0,
		source: typeof meta.source === "string" ? meta.source : "share-target",
		route: typeof meta.route === "string" ? meta.route : typeof meta.source === "string" ? meta.source : "share-target",
		timestamp: Number(meta.timestamp || Date.now()),
		files,
		fileCount: files.length || Number(meta.fileCount || 0),
		imageCount: Number(meta.imageCount || files.filter((file) => (file?.type || "").toLowerCase().startsWith("image/")).length)
	};
	if (hintOut !== void 0) out.hint = hintOut;
	return out;
};
Object.fromEntries(Object.entries({
	"share-target": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: true
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"url"
		],
		defaultOverrideFactors: []
	},
	"launch-queue": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: true
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: []
	},
	"crx-snip": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: false
		},
		supportedContentTypes: ["text", "image"],
		defaultOverrideFactors: ["force-processing"]
	},
	"paste": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"text": ["user-action"],
			"markdown": ["user-action"]
		}
	},
	"drop": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"file": ["user-action"],
			"blob": ["user-action"]
		}
	},
	"button-attach-workcenter": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-workcenter",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"file"
		],
		defaultOverrideFactors: ["explicit-workcenter"],
		associationOverrides: {
			"markdown": ["explicit-workcenter"],
			"text": ["explicit-workcenter"],
			"image": ["explicit-workcenter"],
			"file": ["explicit-workcenter"]
		}
	}
}).map(([key, config]) => [key, {
	processingUrl: config.processingUrl,
	contentAction: config.contentAction,
	...config.supportedContentTypes && { supportedContentTypes: config.supportedContentTypes }
}]));
//#endregion
//#region src/shared/routing/channel/UnifiedMessaging.ts
/**
* Unified Messaging System for CrossWord
* Extends fest/uniform messaging with app-specific configuration
*/
var APP_CHANNEL_MAPPINGS = {
	...createDestinationChannelMappings(),
	[DESTINATIONS.WORKCENTER]: BROADCAST_CHANNELS.WORK_CENTER,
	[DESTINATIONS.CLIPBOARD]: BROADCAST_CHANNELS.CLIPBOARD
};
var appMessagingInstance = null;
/**
* Get the app-configured UnifiedMessagingManager
*/
function getUnifiedMessaging() {
	if (!appMessagingInstance) appMessagingInstance = getUnifiedMessaging$1({
		channelMappings: APP_CHANNEL_MAPPINGS,
		queueOptions: {
			dbName: "CrossWordMessageQueue",
			storeName: "messages",
			maxRetries: 3,
			defaultExpirationMs: 1440 * 60 * 1e3
		},
		pendingStoreOptions: {
			storageKey: "rs-unified-messaging-pending",
			maxMessages: 200,
			defaultTTLMs: 1440 * 60 * 1e3
		}
	});
	return appMessagingInstance;
}
var unifiedMessaging = getUnifiedMessaging();
/**
* Register a handler using the app-configured manager
*/
function registerHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.registerHandler(name, handler);
}
function unregisterHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.unregisterHandler(name, handler);
}
function initializeComponent(componentId) {
	return unifiedMessaging.initializeComponent(componentId);
}
function registerComponent(componentId, destination) {
	unifiedMessaging.registerComponent(componentId, normalizeDestination(destination) || destination);
}
//#endregion
export { unregisterHandler as a, storeShareTargetPayloadToCache as c, unifiedMessaging as i, registerComponent as n, buildShareDataFromCachedPayload as o, registerHandler as r, consumeCachedShareTargetPayload as s, initializeComponent as t };
