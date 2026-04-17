import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { n as getUnifiedMessaging$1, r as createProtocolEnvelope } from "../fest/uniform.js";
import { a as DESTINATIONS, d as normalizeDestination, i as CONTENT_TYPES, l as getDestinationAliases, n as BROADCAST_CHANNELS, s as createDestinationChannelMappings } from "./service.js";
import "./service2.js";
import "./service3.js";
//#region src/com/core/UnifiedAIConfig.ts
var UNIFIED_PROCESSING_RULES = {
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
};
Object.fromEntries(Object.entries(UNIFIED_PROCESSING_RULES).map(([key, config]) => [key, {
	processingUrl: config.processingUrl,
	contentAction: config.contentAction,
	...config.supportedContentTypes && { supportedContentTypes: config.supportedContentTypes }
}]));
//#endregion
//#region src/com/core/ContentAssociations.ts
var normalizeContentType = (t) => {
	const v = String(t || "").toLowerCase().trim();
	if (!v) return CONTENT_TYPES.OTHER;
	if (v === "md") return CONTENT_TYPES.MARKDOWN;
	if (v === "markdown") return CONTENT_TYPES.MARKDOWN;
	if (v === "txt") return CONTENT_TYPES.TEXT;
	if (v === "text") return CONTENT_TYPES.TEXT;
	if (v === "url") return CONTENT_TYPES.URL;
	if (v === "image") return CONTENT_TYPES.IMAGE;
	if (v === "file" || v === "blob") return CONTENT_TYPES.FILE;
	if (v === "pdf") return CONTENT_TYPES.PDF;
	if (v === "html") return CONTENT_TYPES.HTML;
	if (v === "json") return CONTENT_TYPES.JSON;
	if (v === "base64") return CONTENT_TYPES.FILE;
	if (new Set(Object.values(CONTENT_TYPES)).has(v)) return v;
	return CONTENT_TYPES.OTHER;
};
var coerceOverrideFactors = (factors) => {
	const out = [];
	const list = Array.isArray(factors) ? factors : [];
	for (const f of list) {
		const v = String(f || "").trim();
		if (!v) continue;
		out.push(v);
	}
	return out;
};
var pickExplicitDestination = (factors) => {
	if (factors.includes("explicit-explorer")) return "explorer";
	if (factors.includes("explicit-workcenter")) return "workcenter";
	if (factors.includes("explicit-viewer")) return "viewer";
	return null;
};
var defaultDestinationForType = (normalizedContentType) => {
	switch (normalizedContentType) {
		case CONTENT_TYPES.TEXT:
		case CONTENT_TYPES.MARKDOWN:
		case CONTENT_TYPES.HTML:
		case CONTENT_TYPES.JSON: return "viewer";
		case CONTENT_TYPES.URL: return "workcenter";
		case CONTENT_TYPES.IMAGE:
		case CONTENT_TYPES.PDF:
		case CONTENT_TYPES.FILE:
		case CONTENT_TYPES.OTHER:
		default: return "workcenter";
	}
};
var mergeRuleOverrideFactors = (intent, normalizedContentType) => {
	const base = coerceOverrideFactors(intent.overrideFactors);
	const src = String(intent.processingSource || "").trim();
	if (!src) return base;
	const rule = UNIFIED_PROCESSING_RULES[src];
	if (!rule) return base;
	const merged = [];
	merged.push(...rule.defaultOverrideFactors || []);
	const perType = rule.associationOverrides?.[normalizedContentType] || rule.associationOverrides?.[String(intent.contentType || "")] || [];
	merged.push(...perType);
	merged.push(...base);
	return merged;
};
function resolveAssociation(intent) {
	const normalizedContentType = normalizeContentType(intent.contentType);
	const mergedFactors = mergeRuleOverrideFactors(intent, normalizedContentType);
	const explicit = pickExplicitDestination(mergedFactors);
	if (explicit) return {
		destination: explicit,
		normalizedContentType,
		overrideFactors: mergedFactors
	};
	return {
		destination: defaultDestinationForType(normalizedContentType),
		normalizedContentType,
		overrideFactors: mergedFactors
	};
}
function resolveAssociationPipeline(intent) {
	const primary = resolveAssociation(intent);
	const factors = primary.overrideFactors;
	const pipeline = [];
	if (factors.includes("explicit-explorer")) pipeline.push("explorer");
	if (factors.includes("explicit-workcenter")) pipeline.push("workcenter");
	if (factors.includes("explicit-viewer")) pipeline.push("viewer");
	if (pipeline.length === 0) pipeline.push(primary.destination);
	if ((factors.includes("force-attachment") || factors.includes("force-processing")) && !pipeline.includes("workcenter")) pipeline.push("workcenter");
	const unique = [];
	for (const d of pipeline) if (!unique.includes(d)) unique.push(d);
	return {
		...primary,
		pipeline: unique
	};
}
//#endregion
//#region src/com/core/UniformInterop.ts
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
//#region src/com/core/UnifiedMessaging.ts
/**
* Unified Messaging System for CrossWord
* Extends fest/uniform messaging with app-specific configuration
*/
var UnifiedMessaging_exports = /* @__PURE__ */ __exportAll({
	createMessageWithOverrides: () => createMessageWithOverrides,
	createProtocolEnvelope: () => createProtocolEnvelope,
	enqueuePendingMessage: () => enqueuePendingMessage,
	getUnifiedMessaging: () => getUnifiedMessaging,
	hasPendingMessages: () => hasPendingMessages,
	initializeComponent: () => initializeComponent,
	processInitialContent: () => processInitialContent,
	registerComponent: () => registerComponent,
	registerHandler: () => registerHandler,
	sendMessage: () => sendMessage,
	sendProtocolMessage: () => sendProtocolMessage,
	unifiedMessaging: () => unifiedMessaging,
	unregisterHandler: () => unregisterHandler
});
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
* Send a message using the app-configured manager
*/
function sendMessage(message) {
	return unifiedMessaging.sendMessage(toUnifiedInteropMessage({
		...message,
		source: message.source ?? "unified-messaging"
	}));
}
function sendProtocolMessage(message) {
	const interop = createInteropEnvelope({
		...message,
		source: message.source ?? "crossword-unified-messaging",
		protocol: message.protocol ?? "window",
		purpose: message.purpose ?? "mail",
		srcChannel: message.srcChannel ?? message.source ?? "crossword-unified-messaging",
		dstChannel: message.dstChannel ?? message.destination
	});
	const envelope = createProtocolEnvelope({
		...interop,
		source: interop.source,
		destination: interop.destination,
		data: interop.data,
		payload: interop.payload,
		metadata: interop.metadata,
		protocol: interop.protocol,
		purpose: interop.purpose,
		srcChannel: interop.srcChannel,
		dstChannel: interop.dstChannel,
		redirect: interop.redirect,
		flags: interop.flags,
		op: interop.op,
		timestamp: interop.timestamp,
		result: interop.result,
		error: interop.error ? String(interop.error) : void 0
	});
	return unifiedMessaging.sendMessage(envelope);
}
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
function hasPendingMessages(destination) {
	return unifiedMessaging.hasPendingMessages(normalizeDestination(destination) || destination);
}
function enqueuePendingMessage(destination, message) {
	const dest = normalizeDestination(destination) || String(destination ?? "").trim();
	if (!dest || !message) return;
	unifiedMessaging.enqueuePendingMessage(dest, message);
}
function registerComponent(componentId, destination) {
	unifiedMessaging.registerComponent(componentId, normalizeDestination(destination) || destination);
}
function processInitialContent(content) {
	const contentType = String(content?.contentType ?? content?.type ?? CONTENT_TYPES.OTHER);
	const contentMetadata = content?.metadata ?? {};
	const resolved = resolveAssociationPipeline({
		contentType,
		context: content?.context,
		processingSource: content?.processingSource,
		overrideFactors: content?.overrideFactors ?? contentMetadata.overrideFactors
	});
	const payload = content?.content ?? content?.data ?? content;
	const meta = contentMetadata;
	const source = String(content?.source ?? meta?.source ?? "content-association");
	const tasks = resolved.pipeline.map((dest) => {
		if (dest === DESTINATIONS.VIEWER) return sendMessage({
			type: "content-view",
			source,
			destination: DESTINATIONS.VIEWER,
			contentType: resolved.normalizedContentType,
			data: {
				content: payload?.text ?? payload?.content ?? payload,
				text: payload?.text,
				filename: payload?.filename ?? meta?.filename
			},
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
		if (dest === DESTINATIONS.EXPLORER) return sendMessage({
			type: "content-explorer",
			source,
			destination: DESTINATIONS.EXPLORER,
			contentType: resolved.normalizedContentType,
			data: {
				action: "save",
				...payload
			},
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
		return sendMessage({
			type: "content-share",
			source,
			destination: DESTINATIONS.WORKCENTER,
			contentType: resolved.normalizedContentType,
			data: payload,
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
	});
	return Promise.allSettled(tasks).then(() => {});
}
function createMessageWithOverrides(type, source, contentType, data, overrideFactors = [], processingSource) {
	const resolved = resolveAssociation({
		contentType,
		context: processingSource,
		processingSource,
		overrideFactors
	});
	return {
		id: crypto.randomUUID(),
		type,
		source,
		destination: resolved.destination === DESTINATIONS.VIEWER ? DESTINATIONS.VIEWER : resolved.destination === DESTINATIONS.EXPLORER ? DESTINATIONS.EXPLORER : DESTINATIONS.WORKCENTER,
		contentType,
		data,
		metadata: {
			timestamp: Date.now(),
			overrideFactors,
			processingSource,
			priority: "normal"
		}
	};
}
//#endregion
export { initializeComponent as a, registerHandler as c, unifiedMessaging as d, unregisterHandler as f, hasPendingMessages as i, sendMessage as l, createMessageWithOverrides as n, processInitialContent as o, createInteropEnvelope as p, enqueuePendingMessage as r, registerComponent as s, UnifiedMessaging_exports as t, sendProtocolMessage as u };
