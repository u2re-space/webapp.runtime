import { t as createServiceChannelManager } from "../fest/uniform.js";
import { d as normalizeViewId$1, f as viewBroadcastChannelName, n as BROADCAST_CHANNELS$1, o as ROUTE_HASHES$1, r as COMPONENTS$1 } from "./Names.js";
import "./UnifiedMessaging.js";
import { a as unregisterHandler, n as registerComponent, r as registerHandler, t as initializeComponent } from "./UnifiedMessaging2.js";
import { n as toUnifiedInteropMessage } from "./UniformInterop2.js";
import { i as shouldDeferUnifiedIngressUntilStable, r as settleIngressTargetBeforeDelivery, t as scheduleSerialViewIngressDelivery } from "../views/inbound-timing.js";
import { r as validateIngressBeforeViewHandle } from "../views/ingress-validation.js";
//#region src/shared/routing/channel/ServiceChannels.ts
/**
* Service Channels for CrossWord
* Extends fest/uniform ServiceChannelManager with app-specific configuration
*/
var SERVICE_CHANNEL_CONFIG = {
	workcenter: {
		broadcastName: BROADCAST_CHANNELS$1.WORK_CENTER,
		routeHash: ROUTE_HASHES$1.WORKCENTER,
		component: COMPONENTS$1.WORK_CENTER,
		description: "AI work center for processing files and content"
	},
	settings: {
		broadcastName: BROADCAST_CHANNELS$1.SETTINGS,
		routeHash: ROUTE_HASHES$1.SETTINGS,
		component: COMPONENTS$1.SETTINGS,
		description: "Application settings and configuration"
	},
	viewer: {
		broadcastName: BROADCAST_CHANNELS$1.MARKDOWN_VIEWER,
		routeHash: ROUTE_HASHES$1.MARKDOWN_VIEWER,
		component: COMPONENTS$1.MARKDOWN_VIEWER,
		description: "Content viewer for markdown and files"
	},
	explorer: {
		broadcastName: BROADCAST_CHANNELS$1.FILE_EXPLORER,
		routeHash: ROUTE_HASHES$1.FILE_EXPLORER,
		component: COMPONENTS$1.FILE_EXPLORER,
		description: "File explorer and browser"
	},
	print: {
		broadcastName: BROADCAST_CHANNELS$1.PRINT_CHANNEL,
		routeHash: ROUTE_HASHES$1.PRINT,
		component: COMPONENTS$1.BASIC_PRINT,
		description: "Print preview and export"
	},
	history: {
		broadcastName: BROADCAST_CHANNELS$1.HISTORY_CHANNEL,
		routeHash: ROUTE_HASHES$1.HISTORY,
		component: COMPONENTS$1.HISTORY,
		description: "Action history and undo/redo"
	},
	editor: {
		broadcastName: "rs-editor",
		routeHash: ROUTE_HASHES$1.MARKDOWN_EDITOR,
		component: COMPONENTS$1.MARKDOWN_EDITOR,
		description: "Content editor"
	},
	home: {
		broadcastName: "rs-home",
		routeHash: "#home",
		component: "home",
		description: "Home/landing view"
	}
};
var appServiceChannelManager = null;
/**
* Get the app-configured ServiceChannelManager
*/
function getServiceChannels() {
	if (!appServiceChannelManager) appServiceChannelManager = createServiceChannelManager({
		channels: SERVICE_CHANNEL_CONFIG,
		logPrefix: "[ServiceChannels]"
	});
	return appServiceChannelManager;
}
var serviceChannels = getServiceChannels();
//#endregion
//#region src/shared/routing/core/view-message-routing.ts
var VIEW_MESSAGE_FALLBACKS = {
	viewer: [
		"content-view",
		"content-load",
		"markdown-content"
	],
	workcenter: [
		"content-attach",
		"file-attach",
		"share-target-input",
		"content-share"
	],
	explorer: [
		"file-save",
		"navigate-path",
		"content-explorer"
	],
	editor: ["content-load", "content-edit"],
	settings: ["settings-update"],
	history: ["history-update"],
	home: ["home-update"],
	print: ["content-view"]
};
var inferViewDestination = (viewId) => {
	return normalizeViewId$1(viewId);
};
var selectMessageTypeForView = (view, incomingType) => {
	const checks = [incomingType, ...VIEW_MESSAGE_FALLBACKS[view.id] || []];
	for (const type of checks) {
		if (!type) continue;
		if (!view.canHandleMessage || view.canHandleMessage(type)) return type;
	}
	return null;
};
var mapUnifiedMessageToView = (view, message) => {
	const selectedType = selectMessageTypeForView(view, message.type);
	if (!selectedType) return null;
	const id = typeof message.id === "string" && message.id.trim() ? message.id : void 0;
	return {
		...id ? { id } : {},
		type: selectedType,
		data: message.data,
		metadata: message.metadata
	};
};
//#endregion
//#region src/shared/routing/core/view-api.ts
/**
* View-scoped POST API + BroadcastChannel bridge.
* - Production: service worker intercepts POST /{view} and fans out to clients.
* - Dev (no SW): Vite middleware returns devRelay JSON; this module posts to rs-view-* locally.
*/
function subscribeViewChannel(viewId, handler) {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const bc = new BroadcastChannel(viewBroadcastChannelName(normalizeViewId$1(viewId)));
	bc.addEventListener("message", handler);
	return () => {
		bc.removeEventListener("message", handler);
		bc.close();
	};
}
//#endregion
//#region ../../modules/projects/subsystem/src/other/config/Names.ts
/**
* Centralized naming system for CrossWord application
* Consolidates component names, channel names, route names, etc.
*/
/**
* Broadcast channel names used throughout the application
*/
var BROADCAST_CHANNELS = {
	SHARE_TARGET: "rs-share-target",
	TOAST: "rs-toast",
	CLIPBOARD: "rs-clipboard",
	WORK_CENTER: "rs-workcenter",
	MARKDOWN_VIEWER: "rs-markdown-viewer",
	SETTINGS: "rs-settings",
	GENERAL: "rs-app-general",
	MINIMAL_APP: "minimal-app",
	MAIN_APP: "main-app",
	FILE_EXPLORER: "file-explorer",
	PRINT_VIEWER: "print-viewer",
	SETTINGS_VIEWER: "settings-viewer",
	HISTORY_VIEWER: "history-viewer",
	MARKDOWN_VIEWER_CHANNEL: "markdown-viewer",
	FILE_EXPLORER_CHANNEL: "file-explorer",
	SETTINGS_CHANNEL: "settings",
	HISTORY_CHANNEL: "history",
	PRINT_CHANNEL: "print",
	SERVICE_WORKCENTER: "rs-service-workcenter",
	SERVICE_SETTINGS: "rs-service-settings",
	SERVICE_VIEWER: "rs-service-viewer",
	SERVICE_EXPLORER: "rs-service-explorer",
	SERVICE_AIRPAD: "rs-service-airpad",
	SERVICE_PRINT: "rs-service-print",
	SERVICE_HISTORY: "rs-service-history",
	SERVICE_EDITOR: "rs-service-editor",
	SERVICE_HOME: "rs-service-home"
};
/**
* Component and module identifiers
*/
var COMPONENTS = {
	WORK_CENTER: "workcenter",
	MARKDOWN_VIEWER: "markdown-viewer",
	MARKDOWN_EDITOR: "markdown-editor",
	RICH_EDITOR: "rich-editor",
	SETTINGS: "settings",
	HISTORY: "history",
	FILE_PICKER: "file-picker",
	FILE_EXPLORER: "file-explorer",
	WORKCENTER_CORE: "workcenter-core",
	BASIC_WORKCENTER: "basic-workcenter",
	BASIC_VIEWER: "basic-viewer",
	BASIC_EXPLORER: "basic-explorer",
	BASIC_SETTINGS: "basic-settings",
	BASIC_HISTORY: "basic-history",
	BASIC_PRINT: "basic-print",
	AIRPAD: "airpad",
	HOME: "home",
	EDITOR: "editor",
	VIEWER: "viewer",
	EXPLORER: "explorer",
	PRINT: "print"
};
/**
* Location hash identifiers for app navigation
*/
var ROUTE_HASHES = {
	MARKDOWN_VIEWER: "#markdown-viewer",
	MARKDOWN_EDITOR: "#markdown-editor",
	RICH_EDITOR: "#rich-editor",
	SETTINGS: "#settings",
	HISTORY: "#history",
	WORKCENTER: "#workcenter",
	FILE_PICKER: "#file-picker",
	FILE_EXPLORER: "#file-explorer",
	PRINT: "#print",
	WORKCENTER_FILES: "#workcenter-files",
	WORKCENTER_TEXT: "#workcenter-text",
	WORKCENTER_IMAGES: "#workcenter-images",
	WORKCENTER_PROCESSING: "#workcenter-processing",
	SHARE_TARGET_TEXT: "#share-target-text",
	SHARE_TARGET_FILES: "#share-target-files",
	SHARE_TARGET_URL: "#share-target-url",
	SHARE_TARGET_IMAGE: "#share-target-image"
};
/**
* Destination identifiers for unified messaging
*/
var DESTINATIONS = {
	WORKCENTER: "workcenter",
	CLIPBOARD: "clipboard",
	VIEWER: "viewer",
	MARKDOWN_VIEWER: "markdown-viewer",
	SETTINGS: "settings",
	HISTORY: "history",
	EXPLORER: "explorer",
	FILE_EXPLORER: "file-explorer",
	PRINT: "print",
	PRINT_VIEWER: "print-viewer",
	EDITOR: "editor",
	AIRPAD: "airpad",
	HOME: "home",
	BASIC_APP: "basic-app",
	MAIN_APP: "main-app"
};
var CANONICAL_VIEW_IDS = [
	"viewer",
	"workcenter",
	"explorer",
	"editor",
	"settings",
	"history",
	"home",
	"airpad",
	"print"
];
/**
* COMPAT: legacy shells still emit `markdown-viewer`, `file-explorer`, and
* `basic-*` destinations. Keep alias resolution centralized here so transports,
* views, and workers can agree on one canonical target vocabulary.
*/
var DESTINATION_ALIASES = {
	viewer: [
		DESTINATIONS.VIEWER,
		DESTINATIONS.MARKDOWN_VIEWER,
		COMPONENTS.BASIC_VIEWER
	],
	workcenter: [
		DESTINATIONS.WORKCENTER,
		COMPONENTS.BASIC_WORKCENTER,
		COMPONENTS.WORKCENTER_CORE
	],
	explorer: [
		DESTINATIONS.EXPLORER,
		DESTINATIONS.FILE_EXPLORER,
		COMPONENTS.BASIC_EXPLORER
	],
	editor: [
		DESTINATIONS.EDITOR,
		COMPONENTS.MARKDOWN_EDITOR,
		COMPONENTS.RICH_EDITOR
	],
	settings: [
		DESTINATIONS.SETTINGS,
		BROADCAST_CHANNELS.SETTINGS_CHANNEL,
		COMPONENTS.BASIC_SETTINGS
	],
	history: [
		DESTINATIONS.HISTORY,
		BROADCAST_CHANNELS.HISTORY_CHANNEL,
		COMPONENTS.BASIC_HISTORY
	],
	print: [
		DESTINATIONS.PRINT,
		DESTINATIONS.PRINT_VIEWER,
		COMPONENTS.BASIC_PRINT
	],
	airpad: [DESTINATIONS.AIRPAD],
	home: [DESTINATIONS.HOME],
	clipboard: [DESTINATIONS.CLIPBOARD],
	"basic-app": [DESTINATIONS.BASIC_APP],
	"main-app": [DESTINATIONS.MAIN_APP]
};
var DESTINATION_LOOKUP = Object.entries(DESTINATION_ALIASES).reduce((out, [canonical, aliases]) => {
	out[canonical] = canonical;
	for (const alias of aliases) out[String(alias).toLowerCase()] = canonical;
	return out;
}, {});
var normalizeDestination = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return "";
	return DESTINATION_LOOKUP[raw] || raw;
};
var getDestinationAliases = (value) => {
	const canonical = normalizeDestination(value);
	if (!canonical) return [];
	return [...new Set([canonical, ...DESTINATION_ALIASES[canonical] || []])];
};
var matchesDestination = (candidate, expected) => Boolean(normalizeDestination(candidate) && normalizeDestination(candidate) === normalizeDestination(expected));
var normalizeViewId = (value) => {
	const canonical = normalizeDestination(value);
	if (CANONICAL_VIEW_IDS.includes(canonical)) return canonical;
	return "viewer";
};
BROADCAST_CHANNELS.SERVICE_WORKCENTER, BROADCAST_CHANNELS.SERVICE_SETTINGS, BROADCAST_CHANNELS.SERVICE_VIEWER, BROADCAST_CHANNELS.SERVICE_EXPLORER, BROADCAST_CHANNELS.SERVICE_AIRPAD, BROADCAST_CHANNELS.SERVICE_PRINT, BROADCAST_CHANNELS.SERVICE_HISTORY, BROADCAST_CHANNELS.SERVICE_EDITOR, BROADCAST_CHANNELS.SERVICE_HOME;
ROUTE_HASHES.WORKCENTER, ROUTE_HASHES.SETTINGS, ROUTE_HASHES.MARKDOWN_VIEWER, ROUTE_HASHES.FILE_EXPLORER, ROUTE_HASHES.PRINT, ROUTE_HASHES.HISTORY, ROUTE_HASHES.MARKDOWN_EDITOR;
//#endregion
//#region src/shared/routing/core/channel-mixin.ts
/**
* Burst opens (recent list, launch queue replay): supersede older queued work so only the latest
* payload pays settle + paint (serial queue still orders; skipped tasks exit cheaply).
*/
var ingressSupersedeGeneration = /* @__PURE__ */ new WeakMap();
var bumpIngressGeneration = (view) => {
	const next = (ingressSupersedeGeneration.get(view) ?? 0) + 1;
	ingressSupersedeGeneration.set(view, next);
	return next;
};
/** Mirrors {@link dispatchViewTransfer} + BroadcastChannel can deliver the same ingress twice; ReplayGuard only covers the manager path. */
var recentViewIngressByMessageId = /* @__PURE__ */ new Map();
var INGRESS_DEDUP_MS = 600;
/** Attached to routed view messages so views can discard stale async work after `await` (file read, fetch). */
var UNIFIED_INGRESS_STAMP_META = "__ingressStamp";
/** True when newer ingress has bumped the counter vs this delivery's stamp (`handleMessage` should no-op). */
function ingressStampWasSuperseded(view, stamp) {
	if (typeof stamp !== "number" || !Number.isFinite(stamp)) return false;
	return (ingressSupersedeGeneration.get(view) ?? 0) !== stamp;
}
function stampMappedMessageForIngressDelivery(mapped, generation) {
	const prevMeta = mapped.metadata && typeof mapped.metadata === "object" && !Array.isArray(mapped.metadata) ? mapped.metadata : {};
	return {
		...mapped,
		metadata: {
			...prevMeta,
			[UNIFIED_INGRESS_STAMP_META]: generation
		}
	};
}
var pruneViewIngressDedup = (now) => {
	for (const [k, t] of recentViewIngressByMessageId) if (now - t > INGRESS_DEDUP_MS) recentViewIngressByMessageId.delete(k);
};
var deliverUnifiedMessageToView = async (view, message) => {
	const mid = typeof message.id === "string" ? message.id.trim() : "";
	if (mid) {
		const dest = normalizeViewId(inferViewDestination(String(view.id || "")));
		const now = Date.now();
		pruneViewIngressDedup(now);
		const dedupKey = `${dest}::${mid}`;
		const prev = recentViewIngressByMessageId.get(dedupKey);
		if (prev !== void 0 && now - prev < INGRESS_DEDUP_MS) return;
		recentViewIngressByMessageId.set(dedupKey, now);
	}
	const mapped = mapUnifiedMessageToView(view, message);
	if (!mapped) return;
	const ingressCheck = validateIngressBeforeViewHandle(message, mapped.type);
	if (!ingressCheck.ok) {
		console.warn("[ViewIngress] Skipped malformed envelope:", ingressCheck.reason, mapped.type);
		return;
	}
	const generation = bumpIngressGeneration(view);
	await scheduleSerialViewIngressDelivery(view, async () => {
		if (ingressSupersedeGeneration.get(view) !== generation) return;
		if (shouldDeferUnifiedIngressUntilStable(message, mapped.type)) await settleIngressTargetBeforeDelivery(view, message, mapped.type);
		if (ingressSupersedeGeneration.get(view) !== generation) return;
		await view.handleMessage?.(stampMappedMessageForIngressDelivery(mapped, generation));
	});
};
function bindViewReceiveChannel(view, options = {}) {
	if (!view.handleMessage) return () => {};
	const destination = options.destination || inferViewDestination(String(view.id || ""));
	const componentId = options.componentId || `view:${view.id}`;
	const receiveDestinations = getDestinationAliases(destination);
	const handler = {
		canHandle: (message) => matchesDestination(message.destination, destination),
		handle: async (message) => {
			await deliverUnifiedMessageToView(view, message);
		}
	};
	const pendingSeen = /* @__PURE__ */ new Set();
	for (const alias of receiveDestinations) {
		const aliasComponentId = `${componentId}:${alias}`;
		registerComponent(aliasComponentId, alias);
		registerHandler(alias, handler);
		const pending = initializeComponent(aliasComponentId);
		if (pending.length > 0) for (const message of pending) {
			if (pendingSeen.has(message.id)) continue;
			pendingSeen.add(message.id);
			handler.handle(message);
		}
	}
	const viewChannelCleanup = subscribeViewChannel(normalizeViewId(destination), (event) => {
		const payload = event.data;
		if (!payload || typeof payload !== "object") return;
		if (payload.type === "view-transfer" && payload.message && typeof payload.message === "object") {
			deliverUnifiedMessageToView(view, toUnifiedInteropMessage(payload.message));
			return;
		}
		if (payload.type === "view-post") {
			const viewId = normalizeViewId(payload.viewId);
			if (viewId !== normalizeViewId(String(view.id || destination))) return;
			const vm = {
				id: typeof payload.id === "string" ? String(payload.id) : crypto.randomUUID(),
				type: "view-post",
				destination: viewId,
				source: "view-channel",
				data: {
					bodyText: String(payload.bodyText || ""),
					contentType: String(payload.contentType || ""),
					viewId
				},
				metadata: {
					source: "view-channel",
					destination: viewId
				}
			};
			const generation = bumpIngressGeneration(view);
			scheduleSerialViewIngressDelivery(view, async () => {
				if (ingressSupersedeGeneration.get(view) !== generation) return;
				if (shouldDeferUnifiedIngressUntilStable(vm, "view-post")) await settleIngressTargetBeforeDelivery(view, vm, "view-post");
				if (ingressSupersedeGeneration.get(view) !== generation) return;
				await view.handleMessage?.(stampMappedMessageForIngressDelivery({
					type: "view-post",
					data: {
						bodyText: String(payload.bodyText || ""),
						contentType: String(payload.contentType || ""),
						viewId
					},
					metadata: vm.metadata
				}, generation));
			});
		}
	});
	return () => {
		for (const alias of receiveDestinations) unregisterHandler(alias, handler);
		viewChannelCleanup();
	};
}
//#endregion
export { serviceChannels as i, ingressStampWasSuperseded as n, inferViewDestination as r, bindViewReceiveChannel as t };
