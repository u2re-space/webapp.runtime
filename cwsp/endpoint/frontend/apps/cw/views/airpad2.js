import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { E as setAirpadCredentialInvalidator, S as isShellRemoteClipboardBridgeEnabled, _ as getRemoteRouteTarget, c as getAirPadPeerInstanceId, d as getAirPadTransportSecret, f as getAssociatedClientToken, g as getRemoteProtocol, h as getRemoteHost, m as getClipboardPushIntervalMs, o as getAirPadAuthToken, p as getClipboardBroadcastTargetNodes, s as getAirPadClientId, u as getAirPadTransportMode, v as isApplyRemoteClipboardToDeviceEnabled, x as isPushLocalClipboardToLanEnabled } from "./airpad.js";
import { i as writeClipboardTextToDevice, n as isCapacitorNativeShell, r as readClipboardTextFromDevice } from "../chunks/clipboard-device.js";
//#region ../../runtime/cwsp/endpoint/shared/cwsp-route-query.ts
/**
* CWSP v2 route diagnostic query keys for `/ws` and Socket.IO handshakes.
* Standard CWSP v2 keys for route diagnostics (replacing legacy pre-v2 transport-hint names).
*
* @see runtime/cwsp/endpoint/SPECIFICATION-v2.md
*/
var CWSP_ROUTE_QUERY = {
	via: "cwsp_via",
	localEndpoint: "cwsp_local_endpoint",
	route: "cwsp_route",
	routeTarget: "cwsp_route_target",
	hop: "cwsp_hop",
	host: "cwsp_host",
	target: "cwsp_target",
	targetPort: "cwsp_target_port",
	viaPort: "cwsp_via_port",
	protocol: "cwsp_protocol"
};
//#endregion
//#region src/frontend/shared/transport/native-socket.ts
var NativeSocket = class {
	connected = false;
	id = "";
	ws = null;
	listeners = /* @__PURE__ */ new Map();
	connectTimeout;
	constructor(url, options) {
		this.url = url;
		this.options = options;
		this.connect();
	}
	connect() {
		try {
			const urlObj = new URL(this.url);
			if (this.options.query) for (const [key, value] of Object.entries(this.options.query)) urlObj.searchParams.set(key, String(value));
			if (this.options.auth) for (const [key, value] of Object.entries(this.options.auth)) urlObj.searchParams.set(key, String(value));
			if (urlObj.protocol === "http:") urlObj.protocol = "ws:";
			if (urlObj.protocol === "https:") urlObj.protocol = "wss:";
			if (!urlObj.pathname || urlObj.pathname === "/") urlObj.pathname = "/ws";
			this.ws = new WebSocket(urlObj.toString());
			this.ws.onopen = () => {
				this.connected = true;
				this.emitLocal("connect");
			};
			this.ws.onclose = (event) => {
				this.connected = false;
				this.emitLocal("disconnect", event.reason || "closed");
				this.emitLocal("close", event.code, event.reason);
			};
			this.ws.onerror = (error) => {
				this.emitLocal("connect_error", /* @__PURE__ */ new Error("WebSocket error"));
				this.emitLocal("error", error);
			};
			this.ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data.event && data.payload) this.emitLocal(data.event, data.payload);
					else this.emitLocal("data", data);
				} catch (err) {
					this.emitLocal("data", event.data);
				}
			};
			if (this.options.timeout) this.connectTimeout = setTimeout(() => {
				if (!this.connected) {
					this.ws?.close();
					this.emitLocal("connect_error", /* @__PURE__ */ new Error("timeout"));
				}
			}, this.options.timeout);
		} catch (err) {
			setTimeout(() => this.emitLocal("connect_error", err), 0);
		}
	}
	on(event, listener) {
		if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
		this.listeners.get(event).add(listener);
	}
	off(event, listener) {
		this.listeners.get(event)?.delete(listener);
	}
	emit(event, ...args) {
		if (event === "data" || event === "message") {
			if (this.connected && this.ws) this.ws.send(typeof args[0] === "string" ? args[0] : JSON.stringify(args[0]));
		} else if (this.connected && this.ws) this.ws.send(JSON.stringify({
			event,
			payload: args[0]
		}));
	}
	emitLocal(event, ...args) {
		const handlers = this.listeners.get(event);
		if (handlers) for (const handler of handlers) handler(...args);
	}
	removeAllListeners() {
		this.listeners.clear();
	}
	close() {
		if (this.connectTimeout) clearTimeout(this.connectTimeout);
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.connected = false;
	}
	disconnect() {
		this.close();
	}
};
function io(url, options) {
	return new NativeSocket(url, options);
}
//#endregion
//#region src/frontend/views/airpad/utils/utils.ts
/** Airpad markup mount node (set on mount, cleared on unmount). Avoid `document.getElementById` — IDs may not be in the document tree (routed host, shadow, iframe). */
var airpadDomRoot = null;
function setAirpadDomRoot(root) {
	airpadDomRoot = root;
}
function getAirpadDomRoot() {
	return airpadDomRoot;
}
/** Document that owns the Airpad mount (correct when embedded in an iframe). */
function getAirpadOwnerDocument() {
	return airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
}
function byId(id) {
	const r = airpadDomRoot;
	if (!r) return null;
	try {
		return r.querySelector(`#${CSS.escape(id)}`);
	} catch {
		return null;
	}
}
/** Scoped `querySelector` under the current Airpad mount root. */
function queryAirpad(selector) {
	if (!airpadDomRoot) return null;
	return airpadDomRoot.querySelector(selector);
}
var getWsStatusEl = () => byId("wsStatus");
var getAirStatusEl = () => byId("airStatus");
var getAiStatusEl = () => byId("aiStatus");
var getLogEl = () => byId("logContainer");
var getVoiceTextEl = () => byId("voiceText");
var getVkStatusEl = () => byId("vkStatus");
var getBtnConnect = () => byId("btnConnect");
var getAirButton = () => byId("airButton");
var getAiButton = () => byId("aiButton");
var getAirNeighborButton = () => byId("airNeighborButton");
var getBtnCut = () => byId("btnCut");
var getBtnCopy = () => byId("btnCopy");
var getBtnPaste = () => byId("btnPaste");
var getClipboardPreviewEl = () => byId("clipboardPreview");
function log(msg) {
	const doc = airpadDomRoot?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
	if (!doc) {
		console.log("[LOG]", msg);
		return;
	}
	const line = doc.createElement("div");
	line.textContent = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`;
	const logContainer = getLogEl();
	if (logContainer) {
		logContainer.appendChild(line);
		logContainer.scrollTop = logContainer.scrollHeight;
	}
	console.log("[LOG]", msg);
}
//#endregion
//#region src/frontend/shared/transport/websocket.ts
/**
* AirPad/remote transport hub for the frontend.
*
* This module owns the client-side WebSocket connection, secure-envelope
* wrapping, coordinator ask/act flows, clipboard bridging, and the candidate
* probing logic used to discover a reachable CWSP endpoint from web, PWA, or
* extension contexts.
*
* AI-READ: this file is a compatibility layer, not only a raw websocket
* wrapper. It preserves behavior for several runtimes whose network
* restrictions differ, especially Chromium extension pages versus normal tabs.
*/
var websocket_exports = /* @__PURE__ */ __exportAll({
	connectWS: () => connectWS,
	disconnectWS: () => disconnectWS,
	initWebSocket: () => initWebSocket,
	isWSConnected: () => isWSConnected,
	onServerClipboardUpdate: () => onServerClipboardUpdate,
	onVoiceResult: () => onVoiceResult,
	onWSConnectionChange: () => onWSConnectionChange,
	sendCoordinatorAct: () => sendCoordinatorAct,
	sendCoordinatorAsk: () => sendCoordinatorAsk,
	sendCoordinatorRequest: () => sendCoordinatorRequest
});
var socket = null;
var wsConnected = false;
var isConnecting = false;
var btnEl = null;
var wsConnectButton = null;
var connectAttemptId = 0;
/** Parallel candidate probes — close all on success or disconnect. */
var activeProbeSockets = /* @__PURE__ */ new Set();
var manualDisconnectRequested = false;
var autoReconnectAttempts = 0;
var lastWsCandidates = [];
var nextWsCandidateOffset = 0;
var localNetworkPermissionProbeDone = /* @__PURE__ */ new Set();
var AUTO_RECONNECT_MAX_ATTEMPTS = 0;
var AUTO_RECONNECT_BASE_DELAY_MS = 800;
/** WebSocket handshake timeout per candidate (dead hosts fail faster). */
var AIRPAD_PROBE_IO_TIMEOUT_MS = 4800;
/** Wall-clock cap per probe if connect_error is slow to fire. */
var AIRPAD_PROBE_HARD_CAP_MS = AIRPAD_PROBE_IO_TIMEOUT_MS + 800;
/** Try this many candidates in parallel; first success wins. */
var AIRPAD_CANDIDATE_PARALLEL = 3;
var AIRPAD_VERBOSE_QUERY_KEY = "CWS_AIRPAD_VERBOSE_QUERY";
/** Coordinator ask/act wait — was 12s, tighter for snappier UI. */
var AIRPAD_COORDINATOR_TIMEOUT_MS = 8e3;
var AIRPAD_CONNECTION_TYPE = "exchanger-initiator";
var AIRPAD_ARCHETYPE = "server-v2";
/**
* Chrome/Edge MV3: content-script XHR (Engine.IO polling) to LAN often fails with
* `xhr poll error` / `unsafeHeaders` / `net::ERR_FAILED` while `wss:` still works.
* Normal tabs keep polling-first for Private Network Access; extension skips polling to private IPs.
*/
var isChromiumExtensionRuntime = () => {
	try {
		const chromeApi = globalThis.chrome;
		return typeof chromeApi?.runtime?.id === "string" && chromeApi.runtime.id.length > 0;
	} catch {
		return false;
	}
};
var shouldUseVerboseAirpadQuery = () => {
	try {
		const local = String(globalThis?.localStorage?.getItem?.(AIRPAD_VERBOSE_QUERY_KEY) || "").trim().toLowerCase();
		if ([
			"1",
			"true",
			"yes",
			"on"
		].includes(local)) return true;
	} catch {}
	const runtimeFlag = String(globalThis?.[AIRPAD_VERBOSE_QUERY_KEY] || "").trim().toLowerCase();
	return [
		"1",
		"true",
		"yes",
		"on"
	].includes(runtimeFlag);
};
var wsConnectionHandlers = /* @__PURE__ */ new Set();
var clipboardHandlers = /* @__PURE__ */ new Set();
var voiceResultHandlers = /* @__PURE__ */ new Set();
var FRAME_PROTOCOL_SOCKET = "socket";
var LEGACY_SOCKET_TRANSPORT = "ws";
var normalizeCoordinatorProtocol = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return FRAME_PROTOCOL_SOCKET;
	if (raw === "ws" || raw === "wss" || raw === "socket.io" || raw === "socketio") return FRAME_PROTOCOL_SOCKET;
	return raw;
};
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var aesKeyCache = /* @__PURE__ */ new Map();
var hmacKeyCache = /* @__PURE__ */ new Map();
setAirpadCredentialInvalidator(() => {
	aesKeyCache.clear();
	hmacKeyCache.clear();
});
var coordinatorPending = /* @__PURE__ */ new Map();
var queuedCoordinatorActs = [];
var MAX_QUEUED_COORDINATOR_ACTS = 128;
var flushQueuedCoordinatorActs = () => {
	if (!socket?.connected) return;
	while (queuedCoordinatorActs.length > 0) {
		const packet = queuedCoordinatorActs.shift();
		if (!packet) continue;
		emitCoordinatorPacket(packet);
	}
};
var ensureCoordinatorSocketConnected = async (timeoutMs = 7e3) => {
	if (socket?.connected) return true;
	connectWS();
	return await new Promise((resolve) => {
		let done = false;
		const finish = (value) => {
			if (done) return;
			done = true;
			try {
				off?.();
			} catch {}
			globalThis.clearTimeout(timeoutId);
			resolve(value);
		};
		const off = onWSConnectionChange((connected) => {
			if (connected) finish(true);
		});
		const timeoutId = globalThis.setTimeout(() => finish(Boolean(socket?.connected)), timeoutMs);
	});
};
/** Report whether the primary transport socket is currently connected. */
function isWSConnected() {
	return wsConnected;
}
/**
* Subscribe to transport connectivity updates.
*
* WHY: several AirPad UI widgets and retry flows need a shared source of truth
* without directly depending on the socket object.
*/
function onWSConnectionChange(handler) {
	wsConnectionHandlers.add(handler);
	try {
		handler(wsConnected);
	} catch {}
	return () => wsConnectionHandlers.delete(handler);
}
function onServerClipboardUpdate(handler) {
	clipboardHandlers.add(handler);
	return () => clipboardHandlers.delete(handler);
}
function onVoiceResult(handler) {
	voiceResultHandlers.add(handler);
	return () => voiceResultHandlers.delete(handler);
}
function notifyClipboardHandlers(text, meta) {
	for (const h of clipboardHandlers) try {
		h(text, meta);
	} catch {}
}
/** Suppress echo when applying remote text to the device clipboard vs. push polling. */
var lastClipboardPushSent = "";
var lastClipboardWrittenFromRemote = "";
var clipboardPushIntervalId = null;
var stopClipboardPushLoop = () => {
	if (clipboardPushIntervalId) {
		globalThis.clearInterval(clipboardPushIntervalId);
		clipboardPushIntervalId = null;
	}
};
var startClipboardPushLoop = () => {
	stopClipboardPushLoop();
	if (!isPushLocalClipboardToLanEnabled() || !isShellRemoteClipboardBridgeEnabled()) return;
	const ms = getClipboardPushIntervalMs();
	clipboardPushIntervalId = globalThis.setInterval(() => {
		tickLocalClipboardPush();
	}, ms);
};
async function tickLocalClipboardPush() {
	if (!socket?.connected) return;
	if (!isShellRemoteClipboardBridgeEnabled() || !isPushLocalClipboardToLanEnabled()) return;
	const nodes = getClipboardBroadcastTargetNodes();
	if (!nodes.length) return;
	try {
		const text = await readClipboardTextFromDevice();
		const t = String(text ?? "");
		if (!t || t === lastClipboardPushSent) return;
		lastClipboardPushSent = t;
		sendCoordinatorAct("clipboard:update", { text: t }, nodes);
	} catch {}
}
async function applyIncomingClipboardText(text, meta) {
	if (!isShellRemoteClipboardBridgeEnabled()) return;
	const t = typeof text === "string" ? text : "";
	notifyClipboardHandlers(t, meta);
	if (!isApplyRemoteClipboardToDeviceEnabled() || !t) return;
	if (t === lastClipboardWrittenFromRemote) return;
	try {
		await writeClipboardTextToDevice(t);
		lastClipboardWrittenFromRemote = t;
		lastClipboardPushSent = t;
	} catch {}
}
function safeJson(value) {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}
var extractClipboardText = (value) => {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	if (typeof value.text === "string") return value.text;
	if (typeof value.content === "string") return value.content;
	if (typeof value.data === "string") return value.data;
	if (typeof value.result === "string") return value.result;
	return "";
};
var inferPacketPurpose = (what) => {
	const normalized = String(what || "").trim().toLowerCase();
	if (normalized.startsWith("clipboard:")) return "clipboard";
	if (normalized.startsWith("mouse:")) return "mouse";
	if (normalized.startsWith("keyboard:")) return "input";
	if (normalized.startsWith("airpad:")) return "airpad";
	if (normalized.startsWith("sms:")) return "sms";
	if (normalized.startsWith("contacts:")) return "contact";
	if (normalized.startsWith("notification:") || normalized.startsWith("notifications:")) return "general";
	return "general";
};
var describeError = (error) => {
	if (!error) return String(error);
	if (typeof error === "string") return error;
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	return safeJson(error);
};
function getTransportMode() {
	return getAirPadTransportMode() === "secure" ? "secure" : "plaintext";
}
var fromBase64 = (value) => {
	try {
		const binary = atob(value);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
		return bytes;
	} catch {
		return null;
	}
};
var isSignedEnvelope = (value) => typeof value === "object" && value !== null && typeof value.cipher === "string" && typeof value.sig === "string";
var toSafeObject = (value) => {
	if (!value || typeof value !== "string") return null;
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};
var shouldAutoReconnectAfterDisconnect = (reason) => {
	if (!reason) return true;
	if (reason === "io client disconnect" || reason === "forced close") return false;
	return true;
};
var shouldRotateCandidateOnDisconnect = (reason) => {
	if (!reason) return true;
	if (reason === "io server disconnect" || reason === "io client disconnect") return false;
	return true;
};
var getSecret = () => (getAirPadTransportSecret() || "").trim();
var getClientId = () => (getAirPadClientId() || "").trim() || "airpad-client";
var getClientToken = () => (getAssociatedClientToken() || "").trim();
var getControlAuthToken = () => (getAirPadAuthToken() || "").trim();
var parseNodeList = (value) => {
	return Array.from(new Set(value.split(",").map((item) => item.trim()).filter(Boolean)));
};
var getCoordinatorNodes = () => {
	return parseNodeList(getRemoteRouteTarget().trim());
};
var nextPacketId = () => {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	return `airpad-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
var isCoordinatorPacket = (value) => {
	return !!value && typeof value === "object" && ("op" in value || "what" in value || "uuid" in value || "result" in value || "error" in value);
};
var mapFrameOpToRuntimeOp = (value) => {
	if (value === "request") return "ask";
	if (value === "response") return "result";
	if (value === "signal" || value === "notify" || value === "redirect") return "act";
	return value;
};
var mapRuntimeOpToFrameOp = (value) => {
	if (value === "ask") return "request";
	if (value === "result" || value === "resolve") return "response";
	return value;
};
var toCanonicalCoordinatorPacket = (packet) => {
	const clientId = getClientId();
	const clientToken = getClientToken();
	const airpadToken = getControlAuthToken();
	const sender = String(packet.sender || packet.byId || packet.from || clientId || "").trim() || void 0;
	const from = String(packet.from || sender || "").trim() || void 0;
	const byId = String(packet.byId || sender || "").trim() || void 0;
	const destinations = Array.isArray(packet.destinations) && packet.destinations.length ? packet.destinations : Array.isArray(packet.nodes) ? packet.nodes : getCoordinatorNodes();
	const uuid = typeof packet.uuid === "string" && packet.uuid.trim() ? packet.uuid.trim() : nextPacketId();
	const now = Date.now();
	return {
		...packet,
		op: mapRuntimeOpToFrameOp(packet.op),
		type: String(packet.type || packet.what || "").trim() || packet.what,
		protocol: normalizeCoordinatorProtocol(packet.protocol),
		transport: String(packet.transport || LEGACY_SOCKET_TRANSPORT).trim() || LEGACY_SOCKET_TRANSPORT,
		purpose: String(packet.purpose || inferPacketPurpose(String(packet.what || packet.type || ""))).trim() || "general",
		sender,
		byId,
		from,
		nodes: destinations,
		destinations,
		ids: typeof packet.ids === "object" && packet.ids != null ? packet.ids : {
			byId,
			from,
			sender,
			destinations
		},
		urls: Array.isArray(packet.urls) && packet.urls.length ? packet.urls : [getRemoteHost()],
		tokens: Array.isArray(packet.tokens) && packet.tokens.length ? packet.tokens : clientToken ? [clientToken] : [],
		token: packet.token || clientToken || void 0,
		userKey: typeof packet.userKey === "string" && packet.userKey.trim() ? packet.userKey : clientToken || void 0,
		airpadToken: typeof packet.airpadToken === "string" && packet.airpadToken.trim() ? packet.airpadToken : airpadToken || void 0,
		flags: packet.flags || { canonicalV2: true },
		uuid,
		timestamp: Number(packet.timestamp || 0) > 0 ? Number(packet.timestamp) : now
	};
};
var handleCoordinatorPacket = async (packet) => {
	const op = mapFrameOpToRuntimeOp(packet.op);
	const what = (packet.what || packet.type || "").trim();
	const uuid = typeof packet.uuid === "string" ? packet.uuid : "";
	if (uuid && coordinatorPending.has(uuid)) {
		const pending = coordinatorPending.get(uuid);
		if (pending) {
			clearTimeout(pending.timeoutId);
			coordinatorPending.delete(uuid);
			if (op === "error" || packet.error !== void 0) pending.reject(packet.error ?? {
				ok: false,
				error: "Unknown coordinator error"
			});
			else pending.resolve(packet.result ?? packet.results);
		}
		return;
	}
	if (op === "ask" && what === "clipboard:get") {
		try {
			const text = await readClipboardTextFromDevice();
			emitCoordinatorPacket({
				...buildCoordinatorPacket("result", what, null, {
					uuid,
					nodes: packet.from ? [packet.from] : void 0
				}),
				result: typeof text === "string" ? text : String(text || "")
			});
		} catch (error) {
			emitCoordinatorPacket({
				...buildCoordinatorPacket("error", what, null, {
					uuid,
					nodes: packet.from ? [packet.from] : void 0
				}),
				error: error?.message || String(error)
			});
		}
		return;
	}
	if (what === "clipboard:update") {
		const clipboardPayload = packet.result ?? packet.results ?? packet.payload;
		applyIncomingClipboardText(extractClipboardText(clipboardPayload), { source: clipboardPayload?.source });
	}
};
/** Emit one already-built coordinator packet if the live socket is ready. */
var emitCoordinatorPacket = (packet) => {
	if (!socket || !socket.connected) return false;
	socket.emit("data", toCanonicalCoordinatorPacket(packet));
	return true;
};
/** Normalize the frontend's higher-level action/request inputs into the shared coordinator packet shape. */
var buildCoordinatorPacket = (op, what, payload, options = {}) => {
	const clientId = getClientId();
	const clientToken = getClientToken();
	const airpadToken = getControlAuthToken();
	return {
		op: mapRuntimeOpToFrameOp(op),
		what,
		type: what,
		purpose: inferPacketPurpose(what),
		protocol: FRAME_PROTOCOL_SOCKET,
		transport: LEGACY_SOCKET_TRANSPORT,
		payload,
		nodes: options.nodes ?? getCoordinatorNodes(),
		destinations: options.nodes ?? getCoordinatorNodes(),
		uuid: options.uuid,
		sender: clientId,
		byId: clientId,
		from: clientId,
		ids: {
			byId: clientId,
			from: clientId,
			sender: clientId,
			destinations: options.nodes ?? getCoordinatorNodes()
		},
		urls: [getRemoteHost()],
		tokens: clientToken ? [clientToken] : [],
		flags: { canonicalV2: true },
		token: clientToken || void 0,
		userKey: clientToken || void 0,
		airpadToken: airpadToken || void 0,
		timestamp: Date.now()
	};
};
var getAesKey = async (secret) => {
	if (!secret || !globalThis.crypto?.subtle) return null;
	if (aesKeyCache.has(secret)) return aesKeyCache.get(secret) || null;
	const material = textEncoder.encode(secret);
	const digest = await globalThis.crypto.subtle.digest("SHA-256", material);
	const key = await globalThis.crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
	aesKeyCache.set(secret, key);
	return key;
};
var unwrapSignedPayload = async (envelope) => {
	if (!isSignedEnvelope(envelope)) return envelope;
	const secret = getSecret();
	const cipherBytes = fromBase64(envelope.cipher);
	if (!cipherBytes) return envelope;
	if (!secret || !globalThis.crypto?.subtle) return toSafeObject(textDecoder.decode(cipherBytes)) ?? envelope;
	const key = await getAesKey(secret);
	if (!key) return envelope;
	if (cipherBytes.length < 28) return toSafeObject(textDecoder.decode(cipherBytes)) ?? envelope;
	const iv = cipherBytes.slice(0, 12);
	const encrypted = cipherBytes.slice(12);
	try {
		const decrypted = new Uint8Array(await globalThis.crypto.subtle.decrypt({
			name: "AES-GCM",
			iv
		}, key, encrypted));
		return toSafeObject(textDecoder.decode(decrypted)) ?? envelope;
	} catch {
		return envelope;
	}
};
var unwrapIncomingPayload = async (payload) => {
	if (!isSignedEnvelope(payload)) return payload;
	if (getTransportMode() !== "secure") return payload;
	return unwrapSignedPayload(payload);
};
/** Strip `L-` node id prefix (e.g. `L-192.168.0.110` → `192.168.0.110`) for IP / LNA checks. */
function stripWireEndpointIdPrefix(host) {
	const t = host.trim();
	return /^l-/i.test(t) ? t.slice(2).trim() : t;
}
function isPrivateOrLocalTarget(host) {
	if (!host) return false;
	const bare = stripWireEndpointIdPrefix(host);
	if (bare === "localhost" || host === "localhost") return true;
	if (host.endsWith(".local")) return true;
	if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(bare)) return false;
	return bare.startsWith("10.") || bare.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(bare) || bare.startsWith("127.") || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(bare);
}
var getCurrentOriginHostname = () => {
	try {
		return String(new URL(location.href).hostname).toLowerCase();
	} catch {
		return "";
	}
};
var isNetworkFetchAllowed = (rawUrl) => {
	if (!rawUrl || typeof rawUrl !== "string") return false;
	let parsed;
	try {
		parsed = new URL(rawUrl, location.href);
	} catch {
		return false;
	}
	const host = parsed.hostname.toLowerCase();
	const protocol = parsed.protocol.toLowerCase();
	if (protocol !== "http:" && protocol !== "https:") return false;
	const localPageHost = getCurrentOriginHostname();
	return isPrivateOrLocalTarget(host) || host === "localhost" || host === localPageHost;
};
var normalizeNetworkFetchHeaders = (headers) => {
	const next = {};
	if (!headers) return next;
	for (const [key, value] of Object.entries(headers)) {
		if (typeof key !== "string" || !key.trim()) continue;
		if (typeof value !== "string") continue;
		next[key] = value;
	}
	return next;
};
var responseHeadersToObject = (value) => {
	const result = {};
	value.forEach((headerValue, headerName) => {
		result[headerName] = headerValue;
	});
	return result;
};
var handleServerNetworkFetchRequest = async (request) => {
	const requestId = typeof request?.requestId === "string" ? request.requestId.trim() : "";
	const method = typeof request?.method === "string" ? request.method.toUpperCase() : "GET";
	const url = typeof request?.url === "string" ? request.url : "";
	const timeoutMsRaw = request && typeof request.timeoutMs === "number" ? request.timeoutMs : 12e3;
	const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? Math.min(Math.max(Math.round(timeoutMsRaw), 1e3), 6e4) : 12e3;
	if (!requestId) return {
		ok: false,
		status: 400,
		statusText: "Bad Request",
		error: "Missing requestId"
	};
	if (!isNetworkFetchAllowed(url)) return {
		requestId,
		ok: false,
		status: 400,
		statusText: "Bad Request",
		error: "URL not allowed"
	};
	const controller = new AbortController();
	const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
	try {
		const headers = normalizeNetworkFetchHeaders(request?.headers);
		const hasBody = !["GET", "HEAD"].includes(method);
		const payload = request?.body;
		const body = hasBody ? typeof payload === "string" ? payload : safeJson(payload) : void 0;
		const response = await fetch(url, {
			method,
			headers,
			body,
			signal: controller.signal
		});
		const responseBody = await response.text();
		return {
			requestId,
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			headers: responseHeadersToObject(response.headers),
			body: responseBody
		};
	} catch (error) {
		return {
			requestId,
			ok: false,
			status: 0,
			statusText: "Network Error",
			error: describeError(error)
		};
	} finally {
		clearTimeout(timer);
	}
};
/**
* Best-effort Chrome Local Network Access warm-up for private-IP targets.
*
* WHY: probing `/lna-probe` early makes permission/PNA failures visible before
* the heavier WebSocket candidate rotation starts reporting generic timeouts.
*/
async function tryRequestLocalNetworkPermission(origin, host) {
	if (!origin || !host) return;
	if (!isPrivateOrLocalTarget(host)) return;
	if (location.protocol !== "https:") return;
	if (localNetworkPermissionProbeDone.has(origin)) return;
	localNetworkPermissionProbeDone.add(origin);
	try {
		await fetch(`${origin}/lna-probe`, {
			method: "GET",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			targetAddressSpace: "local"
		});
	} catch (error) {
		log(`LNA probe: ${String(error?.message || error || "") || "request failed"}`);
	}
}
/**
* Fire-and-forget coordinator action.
*
* NOTE: acts are queued briefly while the socket is reconnecting so clipboard
* and UI actions do not disappear during short transport flaps.
*/
function sendCoordinatorAct(what, payload, nodes) {
	const packet = buildCoordinatorPacket("act", what, payload, { nodes });
	if (emitCoordinatorPacket(packet)) return true;
	if (queuedCoordinatorActs.length >= MAX_QUEUED_COORDINATOR_ACTS) queuedCoordinatorActs.shift();
	queuedCoordinatorActs.push(packet);
	connectWS();
	return true;
}
/** Send a request/response-style coordinator ask and wait for one correlated reply. */
function sendCoordinatorAsk(what, payload, nodes) {
	return new Promise((resolve, reject) => {
		(async () => {
			if (!await ensureCoordinatorSocketConnected() || !socket?.connected) {
				reject({
					ok: false,
					error: "WS not connected"
				});
				return;
			}
			const uuid = nextPacketId();
			const timeoutId = globalThis.setTimeout(() => {
				coordinatorPending.delete(uuid);
				reject({
					ok: false,
					error: `Timeout waiting for ${what}`
				});
			}, AIRPAD_COORDINATOR_TIMEOUT_MS);
			coordinatorPending.set(uuid, {
				resolve,
				reject,
				timeoutId
			});
			emitCoordinatorPacket(buildCoordinatorPacket("ask", what, payload, {
				nodes,
				uuid
			}));
		})();
	});
}
/** Legacy request helper that currently routes through the same transport path as `act`. */
function sendCoordinatorRequest(what, payload, nodes) {
	return new Promise((resolve, reject) => {
		(async () => {
			if (!await ensureCoordinatorSocketConnected() || !socket?.connected) {
				reject({
					ok: false,
					error: "WS not connected"
				});
				return;
			}
			const uuid = nextPacketId();
			const timeoutId = globalThis.setTimeout(() => {
				coordinatorPending.delete(uuid);
				reject({
					ok: false,
					error: `Timeout waiting for ${what}`
				});
			}, AIRPAD_COORDINATOR_TIMEOUT_MS);
			coordinatorPending.set(uuid, {
				resolve,
				reject,
				timeoutId
			});
			emitCoordinatorPacket(buildCoordinatorPacket("act", what, payload, {
				nodes,
				uuid
			}));
		})();
	});
}
function updateButtonLabel() {
	if (!btnEl) return;
	if (isConnecting || socket && socket.connected === false) {
		btnEl.textContent = "WS…";
		return;
	}
	if (wsConnected || socket && socket.connected) btnEl.textContent = "WS ✓";
	else btnEl.textContent = "WS ↔";
}
function logWsState(event, payload) {
	const trimmedPayload = payload.trim();
	log(`[ws-state] event=${event}${trimmedPayload ? ` ${trimmedPayload}` : ""}`);
}
var WS_STATUS_TLS_HINT_CLASS = "ws-status-tls-hint";
function setWsStatusTlsHint(originUrl) {
	const wsStatusEl = getWsStatusEl();
	if (!wsStatusEl) return;
	wsStatusEl.textContent = isCapacitorNativeShell() ? `TLS failed — install your CA in Android Settings → Security → Encryption & credentials (or use Remote host = name on the cert). Try HTTP :8080 if the server allows. ${originUrl}` : `Untrusted cert — open ${originUrl} in this browser, accept, then retry`;
	wsStatusEl.classList.add(WS_STATUS_TLS_HINT_CLASS);
	wsStatusEl.classList.remove("ws-status-ok");
	wsStatusEl.classList.add("ws-status-bad");
}
/** When the server cert is issued for a hostname, https://&lt;public-ip&gt; fails before the user can "trust" it. */
function setWsStatusTlsHostnameHint(hostname) {
	const wsStatusEl = getWsStatusEl();
	if (wsStatusEl) {
		wsStatusEl.textContent = `TLS name mismatch for raw IP — set Remote host to ${hostname} (name on certificate), keep ports as needed`;
		wsStatusEl.classList.add(WS_STATUS_TLS_HINT_CLASS);
		wsStatusEl.classList.remove("ws-status-ok");
		wsStatusEl.classList.add("ws-status-bad");
	}
}
function setWsStatus(connected) {
	wsConnected = connected;
	if (connected) flushQueuedCoordinatorActs();
	const wsStatusEl = getWsStatusEl();
	if (wsStatusEl) {
		wsStatusEl.classList.remove(WS_STATUS_TLS_HINT_CLASS);
		if (connected) {
			wsStatusEl.textContent = "connected";
			wsStatusEl.classList.remove("ws-status-bad");
			wsStatusEl.classList.add("ws-status-ok");
		} else {
			wsStatusEl.textContent = "disconnected";
			wsStatusEl.classList.remove("ws-status-ok");
			wsStatusEl.classList.add("ws-status-bad");
		}
	}
	updateButtonLabel();
	for (const handler of wsConnectionHandlers) try {
		handler(connected);
	} catch {}
}
function handleServerMessage(msg) {
	if (msg.type === "voice_result" || msg.type === "voice_error") {
		const text = msg.error || msg.message || "Actions: " + JSON.stringify(msg.actions || []);
		for (const handler of voiceResultHandlers) try {
			handler({
				text,
				type: msg.type === "voice_error" ? "voice_error" : "voice_result",
				actions: msg.actions,
				error: msg.error
			});
		} catch {}
		log("Voice result: " + text);
	}
}
/**
* Probe candidate origins and establish the primary WebSocket transport.
*
* AI-READ: this function is intentionally large because it combines UI-state
* updates, candidate generation, PNA/LNA warm-up, TLS hints, and reconnect
* behavior for browser tabs, extensions, and native shells.
*/
function connectWS() {
	if (isConnecting) return;
	if (socket && (socket.connected || socket.connecting)) return;
	if (activeProbeSockets.size > 0) return;
	connectAttemptId += 1;
	const attemptId = connectAttemptId;
	manualDisconnectRequested = false;
	const remoteHost = getRemoteHost().trim();
	const resolvedRemoteHost = remoteHost || location.hostname;
	const remoteProtocol = getRemoteProtocol();
	const isIpv4Literal = (host) => !!host && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
	const isPrivateIp = (host) => {
		if (!host) return false;
		if (!isIpv4Literal(host)) return false;
		return host.startsWith("10.") || host.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host);
	};
	/**
	* HTTPS probe order: LAN / private IPs first (where CWSP admin usually listens), then DNS names
	* from **remote** settings, then **page** origin (PWA shell). Putting `u2re.space` last avoids
	* timeouts and PNA noise when the real gateway is 192.168.x.x only.
	*/
	const reorderHostEntriesForHttps = (entries) => {
		const dnsRemote = [];
		const dnsPage = [];
		const privateIpv4 = [];
		const publicIpv4 = [];
		for (const e of entries) if (!isIpv4Literal(e.host)) if (e.source === "page") dnsPage.push(e);
		else dnsRemote.push(e);
		else if (isPrivateIp(e.host) || e.host === "127.0.0.1") privateIpv4.push(e);
		else publicIpv4.push(e);
		return [
			...privateIpv4,
			...dnsRemote,
			...dnsPage,
			...publicIpv4
		];
	};
	const isLikelyPort = (value) => /^\d{1,5}$/.test(value);
	const stripProtocol = (value) => {
		return value.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
	};
	const parseHostAndPort = (value) => {
		const hostSpec = stripProtocol(value).trim();
		if (!hostSpec) return null;
		const at = hostSpec.lastIndexOf(":");
		if (at <= 0) return { host: hostSpec };
		const host = hostSpec.slice(0, at);
		const port = hostSpec.slice(at + 1);
		if (!host || !isLikelyPort(port)) return { host: hostSpec };
		return {
			host,
			port
		};
	};
	const splitHostList = (value) => value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
	const remoteHostSpecs = splitHostList(remoteHost).map((entry) => parseHostAndPort(entry)).filter((entry) => !!entry && !!entry.host);
	const remotePort = (remoteHostSpecs[0]?.port || "").trim();
	const configuredRouteTarget = getRemoteRouteTarget().trim();
	const parsedConfiguredRouteTarget = configuredRouteTarget ? parseHostAndPort(configuredRouteTarget) : void 0;
	const pageHost = location.hostname || "";
	const isLocalPageHost = /^(localhost|127\.0\.0\.1)$/.test(pageHost) || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(pageHost) && (pageHost.startsWith("10.") || pageHost.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(pageHost));
	if (location.protocol === "https:" && remoteProtocol === "http" && !isCapacitorNativeShell()) {
		log("WebSocket error: browser blocks ws/http from https page (mixed content). Open Airpad via http:// or use valid HTTPS cert on endpoint.");
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	const remoteHostSpec = remoteHostSpecs[0];
	const parsedRemoteHost = remoteHostSpec?.host || resolvedRemoteHost;
	const parsedRemotePort = remoteHostSpec?.port;
	const routeTargetForQuery = parsedConfiguredRouteTarget?.host || configuredRouteTarget || "";
	const routeTargetPortForQuery = (parsedConfiguredRouteTarget?.port || "").trim();
	const rawProbeHostEarly = (parsedRemoteHost || resolvedRemoteHost || "").trim();
	const firstHostBare = rawProbeHostEarly.length > 0 ? stripWireEndpointIdPrefix(rawProbeHostEarly) || rawProbeHostEarly : "";
	const firstHostIpv4 = (() => {
		const b = firstHostBare.trim();
		if (!b) return "";
		const at = b.lastIndexOf(":");
		if (at > 0 && isLikelyPort(b.slice(at + 1))) return b.slice(0, at);
		return b;
	})();
	const inferProtocol = () => {
		if (remoteProtocol === "http" || remoteProtocol === "https") return remoteProtocol;
		if (remotePort === "443" || remotePort === "8443" || remotePort === "8444") return "https";
		if (remotePort === "80" || remotePort === "8080") return "http";
		if (isCapacitorNativeShell() && firstHostIpv4 && isIpv4Literal(firstHostIpv4) && isPrivateIp(firstHostIpv4)) return "http";
		return location.protocol === "https:" ? "https" : "http";
	};
	const primaryProtocol = inferProtocol();
	const rawProbeHost = rawProbeHostEarly;
	const probeHost = stripWireEndpointIdPrefix(rawProbeHost) || rawProbeHost;
	tryRequestLocalNetworkPermission(`${primaryProtocol}://${probeHost}:${remotePort || (primaryProtocol === "https" ? "8443" : "8080")}`, probeHost);
	const fallbackProtocol = primaryProtocol === "https" ? "http" : "https";
	const defaultPortsByProtocol = {
		http: ["8080", "80"],
		https: [
			"8443",
			"443",
			"8444"
		]
	};
	const locationPort = location.port?.trim?.() || "";
	const protocolOrder = remoteProtocol === "http" ? ["http"] : remoteProtocol === "https" ? ["https"] : [primaryProtocol, fallbackProtocol];
	const isLikelyHttpsPort = (port) => port === "443" || port === "8443" || port === "8444";
	const isLikelyHttpPort = (port) => port === "80" || port === "8080";
	const getPortsForProtocol = (protocol, preferredPort) => {
		const ports = [];
		if (preferredPort && isLikelyPort(preferredPort) && !ports.includes(preferredPort)) ports.push(preferredPort);
		if (remotePort) {
			if (protocol === "https" && isLikelyHttpsPort(remotePort)) ports.push(remotePort);
			if (protocol === "http" && isLikelyHttpPort(remotePort)) ports.push(remotePort);
			if (remoteProtocol === protocol && !ports.includes(remotePort)) ports.push(remotePort);
		}
		for (const defaultPort of defaultPortsByProtocol[protocol]) ports.push(defaultPort);
		if (locationPort) ports.push(locationPort);
		return ports.filter((port, idx) => ports.indexOf(port) === idx);
	};
	const connectHostFromRemote = (h) => {
		return stripWireEndpointIdPrefix(h.trim()) || h.trim();
	};
	const hostEntries = [];
	for (const remoteHostSpecEntry of remoteHostSpecs) {
		const ch = connectHostFromRemote(remoteHostSpecEntry.host);
		if (!ch) continue;
		hostEntries.push({
			host: ch,
			source: "remote",
			preferPort: remoteHostSpecEntry.port
		});
	}
	if (remoteHostSpecs.length === 0 && remoteHost) {
		const ch = connectHostFromRemote(remoteHost);
		if (ch) hostEntries.push({
			host: ch,
			source: "remote"
		});
	}
	/** Hostnames the user configured for the transport (Connect URL), lowercased. */
	const normalizedRemoteHosts = /* @__PURE__ */ new Set();
	for (const spec of remoteHostSpecs) if (spec.host) normalizedRemoteHosts.add(spec.host.toLowerCase());
	if (remoteHostSpecs.length === 0 && remoteHost.trim()) for (const part of splitHostList(remoteHost.trim())) {
		const parsed = parseHostAndPort(part);
		if (parsed?.host) normalizedRemoteHosts.add(parsed.host.toLowerCase());
	}
	/**
	* If the user configured **any** LAN / local transport host, skip adding `location.hostname`
	* unless it is already listed as a remote host. (Connect URL may list both 192.168.x.x and a
	* public name — we still drop the redundant **page** copy of u2re.space when remotes already
	* include a private gateway.)
	*/
	const hasPrivateOrLocalTransportHost = () => {
		for (const h of normalizedRemoteHosts) {
			const bare = stripWireEndpointIdPrefix(h).toLowerCase();
			if (bare === "localhost" || bare === "127.0.0.1") return true;
			if (isIpv4Literal(bare) && isPrivateIp(bare)) return true;
		}
		return false;
	};
	const pageHostnameLower = pageHost.toLowerCase();
	const skipPageOriginForDirectLan = Boolean(pageHost) && normalizedRemoteHosts.size > 0 && hasPrivateOrLocalTransportHost() && !isLocalPageHost && !normalizedRemoteHosts.has(pageHostnameLower);
	if (location.hostname && !skipPageOriginForDirectLan) hostEntries.push({
		host: location.hostname,
		source: "page"
	});
	const uniqueHostEntries = /* @__PURE__ */ new Map();
	for (const entry of hostEntries) if (entry.host && !uniqueHostEntries.has(entry.host)) uniqueHostEntries.set(entry.host, entry);
	const candidateHostEntries = Array.from(uniqueHostEntries.values());
	const httpsOrderedHostEntries = reorderHostEntriesForHttps(candidateHostEntries);
	const candidates = [];
	/** Capacitor WebView: mixed content allowed in {@code CapacitorWebActivity} so `ws:` to LAN HTTP works. */
	const allowHttpSocketFromHttpsShell = isCapacitorNativeShell();
	for (const protocol of protocolOrder) {
		if (location.protocol === "https:" && protocol === "http" && !allowHttpSocketFromHttpsShell) continue;
		const hostList = protocol === "https" ? httpsOrderedHostEntries : candidateHostEntries;
		for (const hostEntry of hostList) {
			const { host, source, preferPort } = hostEntry;
			const hostPortOverride = preferPort;
			for (const port of getPortsForProtocol(protocol, hostPortOverride)) {
				const hostBare = stripWireEndpointIdPrefix(host).trim() || host.trim();
				const hostLooksPrivate = isIpv4Literal(hostBare) && isPrivateIp(hostBare);
				const crossOriginHttpsToPrivateLan = location.protocol === "https:" && !isLocalPageHost && hostLooksPrivate;
				const inExtension = isChromiumExtensionRuntime();
				const nativeShell = isCapacitorNativeShell();
				const preferPollingFirst = !nativeShell && crossOriginHttpsToPrivateLan && !inExtension;
				const useWebSocketOnly = nativeShell && hostLooksPrivate || location.protocol === "https:" && isLocalPageHost && hostLooksPrivate || inExtension && crossOriginHttpsToPrivateLan && hostLooksPrivate;
				candidates.push({
					url: `${protocol}://${host}:${port}`,
					protocol,
					host,
					source,
					port,
					useWebSocketOnly,
					preferPollingFirst
				});
			}
		}
	}
	const deduplicatedCandidates = candidates.filter((item, idx) => candidates.findIndex((x) => x.url === item.url) === idx);
	if (deduplicatedCandidates.length === 0) {
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	const normalizedOffset = deduplicatedCandidates.length > 0 ? nextWsCandidateOffset % deduplicatedCandidates.length : 0;
	const uniqueCandidates = deduplicatedCandidates.slice(normalizedOffset).concat(deduplicatedCandidates.slice(0, normalizedOffset));
	nextWsCandidateOffset = normalizedOffset;
	lastWsCandidates = uniqueCandidates;
	if (lastWsCandidates.length <= 1) nextWsCandidateOffset = 0;
	const rotateCandidate = () => {
		if (lastWsCandidates.length > 1) nextWsCandidateOffset = (nextWsCandidateOffset + 1) % lastWsCandidates.length;
	};
	isConnecting = true;
	updateButtonLabel();
	const maxRounds = 3;
	const retryDelayMs = 450;
	const targetHost = connectHostFromRemote(parsedRemoteHost || remoteHost || "");
	const targetPort = routeTargetPortForQuery || parsedRemotePort || remotePort || (primaryProtocol === "https" ? "8443" : "8080");
	const routeTarget = routeTargetForQuery;
	const resolvedRouteTarget = routeTarget || targetHost || "";
	const isSameAsTargetHost = () => {
		if (!routeTarget || !targetHost) return true;
		const normalizedRouteTarget = routeTarget.trim().toLowerCase();
		const normalizedTargetHost = targetHost.trim().toLowerCase();
		if (!normalizedRouteTarget || !normalizedTargetHost) return true;
		if (normalizedRouteTarget === normalizedTargetHost) return true;
		if (normalizedRouteTarget === `l-${normalizedTargetHost}`) return true;
		return false;
	};
	const buildHandshakeForCandidate = (candidate) => {
		const url = candidate.url;
		const clientToken = getClientToken();
		const airpadToken = getControlAuthToken();
		const clientId = getClientId();
		const peerInstanceId = getAirPadPeerInstanceId().trim();
		const handshakeAuth = {};
		if (clientToken) {
			handshakeAuth.token = clientToken;
			handshakeAuth.userKey = clientToken;
		}
		if (airpadToken) handshakeAuth.airpadToken = airpadToken;
		if (clientId) handshakeAuth.clientId = clientId;
		if (peerInstanceId) {
			handshakeAuth.peerInstanceId = peerInstanceId;
			handshakeAuth.deviceInstanceId = peerInstanceId;
		}
		const queryParams = {};
		if (peerInstanceId) {
			queryParams.peerInstanceId = peerInstanceId;
			queryParams.deviceInstanceId = peerInstanceId;
		}
		queryParams.connectionType = AIRPAD_CONNECTION_TYPE;
		queryParams.archetype = AIRPAD_ARCHETYPE;
		queryParams[CWSP_ROUTE_QUERY.via] = !isSameAsTargetHost() ? "tunnel" : candidate.source || "unknown";
		queryParams[CWSP_ROUTE_QUERY.localEndpoint] = isSameAsTargetHost() ? "1" : "0";
		if (resolvedRouteTarget) {
			queryParams[CWSP_ROUTE_QUERY.route] = resolvedRouteTarget;
			queryParams[CWSP_ROUTE_QUERY.routeTarget] = routeTarget || targetHost || resolvedRouteTarget;
		}
		if (shouldUseVerboseAirpadQuery()) {
			queryParams[CWSP_ROUTE_QUERY.hop] = candidate.host || remoteHost || "unknown";
			queryParams[CWSP_ROUTE_QUERY.host] = candidate.host || remoteHost || "";
			queryParams[CWSP_ROUTE_QUERY.target] = targetHost || "";
			queryParams[CWSP_ROUTE_QUERY.targetPort] = targetPort;
			queryParams[CWSP_ROUTE_QUERY.viaPort] = candidate.port || "";
			queryParams[CWSP_ROUTE_QUERY.protocol] = candidate.protocol || "https";
		}
		return {
			url,
			clientToken,
			airpadToken,
			clientId,
			peerInstanceId,
			handshakeAuth,
			queryParams
		};
	};
	const finalizeConnectedSocket = (probeSocket, candidate, index, url, clientToken, airpadToken, clientId, peerInstanceId, engine, onEngineClose, onEngineError) => {
		socket = probeSocket;
		logWsState("connected", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} transport=${candidate.protocol} parallel=${AIRPAD_CANDIDATE_PARALLEL}`);
		isConnecting = false;
		autoReconnectAttempts = 0;
		setWsStatus(true);
		startClipboardPushLoop();
		socket.emit("hello", {
			id: peerInstanceId || clientId,
			byId: clientId,
			from: clientId,
			peerInstanceId: peerInstanceId || void 0,
			token: clientToken || void 0,
			userKey: clientToken || void 0,
			airpadToken: airpadToken || void 0,
			nodes: getCoordinatorNodes()
		});
		socket.on("disconnect", (reason) => {
			stopClipboardPushLoop();
			logWsState("disconnected", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${reason || "unknown"}`);
			engine?.off?.("close", onEngineClose);
			engine?.off?.("error", onEngineError);
			isConnecting = false;
			setWsStatus(false);
			updateButtonLabel();
			const manual = manualDisconnectRequested;
			manualDisconnectRequested = false;
			for (const [uuid, pending] of coordinatorPending.entries()) {
				clearTimeout(pending.timeoutId);
				pending.reject({
					ok: false,
					error: `Disconnected before response for ${uuid}`
				});
				coordinatorPending.delete(uuid);
			}
			socket = null;
			if (manual) {
				autoReconnectAttempts = 0;
				return;
			}
			if (shouldRotateCandidateOnDisconnect(reason)) {
				rotateCandidate();
				if (lastWsCandidates.length > 1) log(`WebSocket disconnect reason "${reason || "unknown"}", trying next candidate on reconnect`);
			}
			const attempt = autoReconnectAttempts + 1;
			const hasMaxAttemptLimit = AUTO_RECONNECT_MAX_ATTEMPTS > 0;
			if (!shouldAutoReconnectAfterDisconnect(reason) || hasMaxAttemptLimit && attempt > AUTO_RECONNECT_MAX_ATTEMPTS) return;
			autoReconnectAttempts = attempt;
			const delay = Math.min(AUTO_RECONNECT_BASE_DELAY_MS * attempt, 5e3);
			setTimeout(() => {
				if (isConnecting || wsConnected || socket && socket.connected || socket?.connecting) return;
				logWsState("auto-reconnect", `attempt=${hasMaxAttemptLimit ? `${attempt}/${AUTO_RECONNECT_MAX_ATTEMPTS}` : `${attempt}/unlimited`} reason=${reason || "unknown reason"}`);
				connectWS();
			}, delay);
		});
		socket.on("hello-ack", (data) => {
			if (data?.id) log(`WebSocket hello ack: ${String(data.id)}`);
		});
		socket.on("connect_error", (error) => {
			logWsState("socket-connect-error", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${error?.message || "unknown"}`);
			isConnecting = false;
			updateButtonLabel();
		});
		socket.on("voice_result", async (msg) => {
			handleServerMessage(await unwrapIncomingPayload(msg));
		});
		socket.on("voice_error", async (msg) => {
			handleServerMessage(await unwrapIncomingPayload(msg));
		});
		socket.on("clipboard:update", async (msg) => {
			const decoded = await unwrapIncomingPayload(msg);
			applyIncomingClipboardText(extractClipboardText(decoded), { source: decoded?.source });
		});
		socket.on("data", async (packet) => {
			const decoded = await unwrapIncomingPayload(packet);
			if (!isCoordinatorPacket(decoded)) return;
			handleCoordinatorPacket(decoded);
		});
		socket.on("message", async (packet) => {
			const decoded = await unwrapIncomingPayload(packet);
			if (!isCoordinatorPacket(decoded)) return;
			handleCoordinatorPacket(decoded);
		});
		socket.on("network.fetch", async (request, ack) => {
			const response = await handleServerNetworkFetchRequest(request);
			if (typeof ack === "function") ack(response);
		});
		if (typeof window !== "undefined") window.__socket = socket;
	};
	const probeBatch = (startIndex, round) => new Promise((resolve) => {
		if (attemptId !== connectAttemptId) {
			resolve(false);
			return;
		}
		const batch = uniqueCandidates.slice(startIndex, startIndex + AIRPAD_CANDIDATE_PARALLEL);
		if (!batch.length) {
			resolve(false);
			return;
		}
		if (startIndex === 0 && round === 0) {
			const el = getWsStatusEl();
			if (el) {
				el.classList.remove(WS_STATUS_TLS_HINT_CLASS);
				el.textContent = "connecting…";
			}
		}
		let won = false;
		let settled = false;
		let deadCount = 0;
		const batchSize = batch.length;
		let batchTlsCertUrl = null;
		let batchTlsHostname = null;
		const finishWin = (winner, candidate, index, url, hs, engine, oec, oee) => {
			if (settled) return;
			settled = true;
			won = true;
			const clearProbeTimer = (s) => {
				const t = s.__cwspProbeTimer;
				if (t) globalThis.clearTimeout(t);
				delete s.__cwspProbeTimer;
			};
			for (const s of [...activeProbeSockets]) if (s !== winner) {
				clearProbeTimer(s);
				s.removeAllListeners();
				s.close();
				activeProbeSockets.delete(s);
			}
			clearProbeTimer(winner);
			activeProbeSockets.delete(winner);
			finalizeConnectedSocket(winner, candidate, index, url, hs.clientToken, hs.airpadToken, hs.clientId, hs.peerInstanceId, engine, oec, oee);
			resolve(true);
		};
		const finishAllDead = () => {
			if (settled || won) return;
			deadCount++;
			if (deadCount < batchSize) return;
			settled = true;
			if (batchTlsCertUrl) setWsStatusTlsHint(batchTlsCertUrl);
			else if (batchTlsHostname) setWsStatusTlsHostnameHint(batchTlsHostname);
			resolve(false);
		};
		for (let localIdx = 0; localIdx < batch.length; localIdx++) {
			const candidate = batch[localIdx];
			const index = startIndex + localIdx;
			const hs = buildHandshakeForCandidate(candidate);
			const { url, handshakeAuth, queryParams } = hs;
			logWsState("connecting", `batch=${startIndex}-${startIndex + batchSize - 1} candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} transport=${candidate.protocol} source=${candidate.source} host=${candidate.host}:${candidate.port} target=${targetHost}:${targetPort}`);
			const probeSocket = io(url, {
				auth: handshakeAuth,
				query: queryParams,
				transports: candidate.useWebSocketOnly ? ["websocket"] : candidate.preferPollingFirst ? ["polling", "websocket"] : ["websocket", "polling"],
				upgrade: !candidate.useWebSocketOnly,
				reconnection: false,
				timeout: AIRPAD_PROBE_IO_TIMEOUT_MS,
				secure: candidate.protocol === "https",
				forceNew: true
			});
			const engine = probeSocket.io?.engine;
			const onEngineClose = (...args) => {
				const code = typeof args[0] === "number" ? args[0] : void 0;
				const reason = args.length > 1 ? args[1] : void 0;
				logWsState("engine-close", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} code=${code ?? "n/a"} reason=${typeof reason === "string" ? reason : safeJson(reason)} transport=${engine?.transport?.name || "unknown"}`);
			};
			const onEngineError = (error) => {
				logWsState("engine-error", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${describeError(error)}`);
			};
			engine?.on?.("close", onEngineClose);
			engine?.on?.("error", onEngineError);
			activeProbeSockets.add(probeSocket);
			const hardTimer = globalThis.setTimeout(() => {
				if (won || settled || probeSocket.connected) return;
				probeSocket.removeAllListeners();
				probeSocket.close();
				activeProbeSockets.delete(probeSocket);
				engine?.off?.("close", onEngineClose);
				engine?.off?.("error", onEngineError);
				logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=probe-hard-timeout`);
				finishAllDead();
			}, AIRPAD_PROBE_HARD_CAP_MS);
			probeSocket.__cwspProbeTimer = hardTimer;
			probeSocket.on("connect", () => {
				globalThis.clearTimeout(hardTimer);
				if (attemptId !== connectAttemptId) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					activeProbeSockets.delete(probeSocket);
					engine?.off?.("close", onEngineClose);
					engine?.off?.("error", onEngineError);
					return;
				}
				if (won || settled) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					activeProbeSockets.delete(probeSocket);
					engine?.off?.("close", onEngineClose);
					engine?.off?.("error", onEngineError);
					return;
				}
				finishWin(probeSocket, candidate, index, url, hs, engine, onEngineClose, onEngineError);
			});
			probeSocket.on("connect_error", (error) => {
				globalThis.clearTimeout(hardTimer);
				activeProbeSockets.delete(probeSocket);
				engine?.off?.("close", onEngineClose);
				engine?.off?.("error", onEngineError);
				if (won || settled) {
					probeSocket.removeAllListeners();
					probeSocket.close();
					return;
				}
				probeSocket.removeAllListeners();
				probeSocket.close();
				const details = error?.description || error?.context || "";
				const errorMessage = String(error?.message || error || "");
				const combinedProbeErr = `${errorMessage} ${String(details)}`;
				const weakEngineIoTlsSuspect = candidate.protocol === "https" && isPrivateIp(candidate.host) && /xhr poll error|websocket error/i.test(errorMessage);
				/** Capacitor/WebView often reports generic xhr/WS errors; do not label "Untrusted cert" without TLS signals. */
				const tlsKeywordsInErr = /certificate|cert\.|ssl|tls|trust|ERR_CERT|ERR_SSL|handshake|authority|SELF_SIGNED|unknown.*cert|invalid.*cert|unable to verify|pkix|hostname|name mismatch/i.test(combinedProbeErr);
				const plainTransportFailure = /refused|ECONNREFUSED|ENOTFOUND|timed out|timeout|unreachable|ERR_CONNECTION|ADDRESS_UNREACHABLE|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|network.*lost/i.test(combinedProbeErr);
				const nativeAir = isCapacitorNativeShell();
				if (weakEngineIoTlsSuspect && !batchTlsCertUrl && (tlsKeywordsInErr || !nativeAir && !plainTransportFailure)) batchTlsCertUrl = url;
				const publicIpv4Https = candidate.protocol === "https" && isIpv4Literal(candidate.host) && !isPrivateIp(candidate.host) && candidate.host !== "127.0.0.1";
				const combinedErr = `${errorMessage} ${String(details)}`;
				if (publicIpv4Https && /xhr poll error|websocket error|certificate|CERT|common name|ssl|tls|failed to fetch|name invalid/i.test(combinedErr) && !batchTlsHostname) {
					const suggested = pageHost && !isIpv4Literal(pageHost) && pageHost !== "localhost" ? pageHost : "";
					if (suggested) batchTlsHostname = suggested;
				}
				if (candidate.useWebSocketOnly && /xhr poll error|cors|private network|address space|failed fetch/i.test(errorMessage)) logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${errorMessage} hint=private-network-cors`);
				logWsState("connect-failed", `candidate=${index + 1}/${uniqueCandidates.length} candidate_url=${url} reason=${errorMessage} details=${details ? safeJson(details) : "none"}`);
				finishAllDead();
			});
		}
	});
	(async () => {
		for (let round = 0; round < maxRounds; round++) {
			for (let start = 0; start < uniqueCandidates.length; start += AIRPAD_CANDIDATE_PARALLEL) {
				if (attemptId !== connectAttemptId) return;
				if (await probeBatch(start, round)) return;
			}
			if (round + 1 < maxRounds) {
				logWsState("retry", `round=${round + 2}/${maxRounds} next=0`);
				await new Promise((r) => globalThis.setTimeout(r, retryDelayMs));
			}
		}
		if (attemptId !== connectAttemptId) return;
		logWsState("failed", `round=${maxRounds}/${maxRounds} all-candidates`);
		isConnecting = false;
		setWsStatus(false);
		updateButtonLabel();
	})();
}
/** Stop probe sockets, tear down the primary transport, and mark the disconnect as user-requested. */
function disconnectWS() {
	stopClipboardPushLoop();
	connectAttemptId += 1;
	manualDisconnectRequested = true;
	for (const probe of [...activeProbeSockets]) {
		probe.removeAllListeners();
		probe.close();
		activeProbeSockets.delete(probe);
	}
	isConnecting = false;
	if (!socket) {
		setWsStatus(false);
		updateButtonLabel();
		return;
	}
	log("Disconnecting WebSocket...");
	socket.disconnect();
	socket = null;
	if (typeof window !== "undefined") window.__socket = null;
	setWsStatus(false);
}
/** Bind the optional connect button UI to the shared transport lifecycle. */
function initWebSocket(btnConnect) {
	btnEl = btnConnect;
	updateButtonLabel();
	if (!btnConnect) return;
	if (wsConnectButton === btnConnect) return;
	if (wsConnectButton) wsConnectButton.removeEventListener("click", handleWsConnectButtonClick);
	wsConnectButton = btnConnect;
	wsConnectButton.addEventListener("click", handleWsConnectButtonClick);
}
function handleWsConnectButtonClick() {
	if (isConnecting || wsConnected || socket && socket.connected || socket?.connecting) disconnectWS();
	else connectWS();
}
//#endregion
export { getClipboardPreviewEl as C, queryAirpad as D, log as E, setAirpadDomRoot as O, getBtnPaste as S, getVoiceTextEl as T, getAirpadDomRoot as _, onServerClipboardUpdate as a, getBtnCopy as b, sendCoordinatorAct as c, websocket_exports as d, getAiButton as f, getAirStatusEl as g, getAirNeighborButton as h, isWSConnected as i, sendCoordinatorAsk as l, getAirButton as m, disconnectWS as n, onVoiceResult as o, getAiStatusEl as p, initWebSocket as r, onWSConnectionChange as s, connectWS as t, sendCoordinatorRequest as u, getAirpadOwnerDocument as v, getVkStatusEl as w, getBtnCut as x, getBtnConnect as y };
