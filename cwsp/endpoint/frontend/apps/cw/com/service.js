//#region src/com/config/Names.ts
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
export { DESTINATIONS as a, getBroadcastChannelForDestination as c, normalizeDestination as d, normalizeViewId as f, CONTENT_TYPES as i, getDestinationAliases as l, BROADCAST_CHANNELS as n, ROUTE_HASHES as o, viewBroadcastChannelName as p, COMPONENTS as r, createDestinationChannelMappings as s, API_ENDPOINTS as t, matchesDestination as u };
