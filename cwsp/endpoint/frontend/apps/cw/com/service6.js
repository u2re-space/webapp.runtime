import { d as normalizeDestination, l as getDestinationAliases } from "./service.js";
//#region src/frontend/shared/core/UniformInterop.ts
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
export { toUnifiedInteropMessage as n, createInteropEnvelope as t };
