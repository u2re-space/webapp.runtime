import { r as __exportAll } from "./rolldown-runtime.js";
import { n as getUnifiedMessaging$1, r as createProtocolEnvelope } from "../fest/uniform.js";
import { d as getDestinationAliases, i as BROADCAST_CHANNELS, l as createDestinationChannelMappings, n as toUnifiedInteropMessage, o as CONTENT_TYPES, p as normalizeDestination, s as DESTINATIONS, t as createInteropEnvelope } from "./UniformInterop.js";
import "./core.js";
import "./templates.js";
//#region src/shared/channel/UnifiedAIConfig.ts
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
//#region src/shared/channel/ContentAssociations.ts
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
//#region src/shared/channel/UnifiedMessaging.ts
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
	replayQueuedMessagesForDestination: () => replayQueuedMessagesForDestination,
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
/**
* Replay IndexedDB-backed queued messages for a destination (mail/deferred pipeline).
* Safe after handlers register — implicit view bridge calls this post-bind.
*/
function replayQueuedMessagesForDestination(destination) {
	return unifiedMessaging.processQueuedMessages(destination);
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
export { initializeComponent as a, registerHandler as c, sendProtocolMessage as d, unifiedMessaging as f, hasPendingMessages as i, replayQueuedMessagesForDestination as l, createMessageWithOverrides as n, processInitialContent as o, unregisterHandler as p, enqueuePendingMessage as r, registerComponent as s, UnifiedMessaging_exports as t, sendMessage as u };
