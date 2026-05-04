//#region src/shared/config/Names.ts
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
var viewBroadcastChannelName = (viewId) => {
	return `rs-view-${normalizeViewId(viewId) || "app"}`;
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
* API endpoint paths
*/
var API_ENDPOINTS = {
	PROCESSING: "/api/processing",
	ANALYZE: "/api/analyze",
	TEST: "/api/test",
	HEALTH: "/health",
	ICONS: "/assets/icons",
	DUOTONE_ICONS: "/assets/icons/duotone",
	PHOSPHOR_ICONS: "/assets/icons/phosphor",
	ICON_PROXY: "/api/icon-proxy",
	SHARE_TARGET: "/share-target",
	SHARE_TARGET_ALT: "/share_target",
	LAUNCH_QUEUE: "/launch-queue",
	SW_CONTENT: "/sw-content",
	SW_CONTENT_AVAILABLE: "/sw-content/available",
	CLIPBOARD_PENDING: "/clipboard/pending",
	CLIPBOARD_CLEAR: "/clipboard/clear"
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
* Content type identifiers
*/
var CONTENT_TYPES = {
	TEXT: "text",
	URL: "url",
	FILE: "file",
	IMAGE: "image",
	MARKDOWN: "markdown",
	HTML: "html",
	JSON: "json",
	PDF: "pdf",
	AUDIO: "audio",
	VIDEO: "video",
	OTHER: "other"
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
var getBroadcastChannelForDestination = (value) => {
	switch (normalizeDestination(value)) {
		case "viewer": return BROADCAST_CHANNELS.MARKDOWN_VIEWER;
		case "workcenter": return BROADCAST_CHANNELS.WORK_CENTER;
		case "explorer": return BROADCAST_CHANNELS.FILE_EXPLORER;
		case "settings": return BROADCAST_CHANNELS.SETTINGS;
		case "history": return BROADCAST_CHANNELS.HISTORY_VIEWER;
		case "print": return BROADCAST_CHANNELS.PRINT_VIEWER;
		case "clipboard": return BROADCAST_CHANNELS.CLIPBOARD;
		case "main-app": return BROADCAST_CHANNELS.MAIN_APP;
		case "basic-app": return BROADCAST_CHANNELS.MINIMAL_APP;
		default: return null;
	}
};
var createDestinationChannelMappings = () => {
	const mappings = {};
	for (const canonical of Object.keys(DESTINATION_ALIASES)) {
		const channel = getBroadcastChannelForDestination(canonical);
		if (!channel) continue;
		for (const alias of getDestinationAliases(canonical)) mappings[alias] = channel;
	}
	return mappings;
};
BROADCAST_CHANNELS.SERVICE_WORKCENTER, BROADCAST_CHANNELS.SERVICE_SETTINGS, BROADCAST_CHANNELS.SERVICE_VIEWER, BROADCAST_CHANNELS.SERVICE_EXPLORER, BROADCAST_CHANNELS.SERVICE_AIRPAD, BROADCAST_CHANNELS.SERVICE_PRINT, BROADCAST_CHANNELS.SERVICE_HISTORY, BROADCAST_CHANNELS.SERVICE_EDITOR, BROADCAST_CHANNELS.SERVICE_HOME;
ROUTE_HASHES.WORKCENTER, ROUTE_HASHES.SETTINGS, ROUTE_HASHES.MARKDOWN_VIEWER, ROUTE_HASHES.FILE_EXPLORER, ROUTE_HASHES.PRINT, ROUTE_HASHES.HISTORY, ROUTE_HASHES.MARKDOWN_EDITOR;
//#endregion
//#region src/shared/channel/UniformInterop.ts
/**
* Shared interop helpers for CrossWord transport envelopes.
*
* WHY: the main thread, service worker, CRX runtime, and native/worker bridges
* all need the same destination, protocol, and envelope normalization without
* each importing the full `fest/uniform` runtime graph.
*/
var PROTOCOL_ALIASES = {
	"chrome-runtime": "chrome",
	"chrome-tabs": "chrome",
	"chrome-port": "chrome",
	"chrome-external": "chrome",
	"service-worker": "worker",
	"service-worker:http": "worker",
	"service": "worker",
	"sw": "worker",
	"broadcast-channel": "broadcast",
	"broadcastchannel": "broadcast",
	"websocket": "socket",
	"ws": "socket",
	"socket-io": "socket",
	"socketio": "socket"
};
var TRANSPORT_ALIASES = {
	"service": "service-worker",
	"service-worker:http": "service-worker",
	"sw": "service-worker",
	"ws": "websocket",
	"socket": "websocket",
	"socketio": "socket-io",
	"chrome": "chrome-runtime"
};
var PURPOSES = new Set([
	"invoke",
	"mail",
	"attach",
	"deliver",
	"defer"
]);
var randomId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `interop_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};
var normalizePurpose = (value) => {
	const raw = Array.isArray(value) ? value : value ? [value] : ["mail"];
	const deduped = [];
	for (const entry of raw) if (PURPOSES.has(entry) && !deduped.includes(entry)) deduped.push(entry);
	return deduped.length > 0 ? deduped : ["mail"];
};
/**
* Normalize the protocol family advertised in envelopes and bridge packets.
*/
var normalizeInteropProtocolName = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return "unknown";
	return PROTOCOL_ALIASES[raw] || raw;
};
/**
* Normalize transport hints to one transport taxonomy for diagnostics and docs.
*/
var normalizeInteropTransportName = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return void 0;
	return TRANSPORT_ALIASES[raw] || raw;
};
/**
* Create one shared envelope shape that can be used by main-thread, SW, and CRX
* adapters before converting to `fest/uniform` runtime objects.
*/
var createInteropEnvelope = (input) => {
	const id = String(input.id || input.uuid || "").trim() || randomId();
	const source = String(input.source || input.sender || input.srcChannel || "interop").trim() || "interop";
	const destination = normalizeDestination(input.destination || input.target);
	const destinations = Array.isArray(input.destinations) && input.destinations.length > 0 ? [...new Set(input.destinations.map((entry) => normalizeDestination(entry)).filter(Boolean))] : destination ? getDestinationAliases(destination) : [];
	const payload = input.payload ?? input.data;
	const timestamp = Number(input.timestamp ?? Date.now()) || Date.now();
	return {
		id,
		uuid: id,
		type: String(input.type || "request"),
		source,
		sender: String(input.sender || source),
		destination: destination || void 0,
		target: destination || void 0,
		contentType: input.contentType ? String(input.contentType) : void 0,
		data: payload,
		payload,
		metadata: {
			timestamp,
			...input.metadata || {}
		},
		purpose: normalizePurpose(input.purpose),
		protocol: normalizeInteropProtocolName(input.protocol),
		transport: normalizeInteropTransportName(input.transport),
		redirect: Boolean(input.redirect),
		flags: { ...input.flags || {} },
		op: String(input.op || (String(input.type || "").startsWith("response:") ? "response" : "deliver")),
		timestamp,
		srcChannel: String(input.srcChannel || source),
		dstChannel: input.dstChannel ?? (destination || void 0),
		destinations,
		ids: {
			byId: source,
			from: source,
			sender: source,
			destinations,
			...input.ids || {}
		},
		urls: Array.isArray(input.urls) ? [...input.urls] : [],
		tokens: Array.isArray(input.tokens) ? [...input.tokens] : [],
		toRoles: Array.isArray(input.toRoles) ? [...input.toRoles] : [],
		tabId: input.tabId,
		frameId: input.frameId,
		status: typeof input.status === "number" ? input.status : void 0,
		result: input.result,
		results: input.results,
		error: input.error
	};
};
/**
* Map an envelope-like payload into the app's unified-message shape.
*/
var toUnifiedInteropMessage = (input) => {
	const envelope = createInteropEnvelope(input);
	return {
		id: envelope.id,
		type: envelope.type,
		source: envelope.source,
		destination: envelope.destination,
		contentType: envelope.contentType,
		data: envelope.data,
		metadata: {
			...envelope.metadata,
			protocol: envelope.protocol,
			transport: envelope.transport,
			sender: envelope.sender,
			srcChannel: envelope.srcChannel,
			dstChannel: envelope.dstChannel,
			destinations: envelope.destinations,
			ids: envelope.ids,
			flags: envelope.flags,
			status: envelope.status,
			error: envelope.error
		}
	};
};
//#endregion
export { COMPONENTS as a, ROUTE_HASHES as c, getDestinationAliases as d, matchesDestination as f, viewBroadcastChannelName as h, BROADCAST_CHANNELS as i, createDestinationChannelMappings as l, normalizeViewId as m, toUnifiedInteropMessage as n, CONTENT_TYPES as o, normalizeDestination as p, API_ENDPOINTS as r, DESTINATIONS as s, createInteropEnvelope as t, getBroadcastChannelForDestination as u };
