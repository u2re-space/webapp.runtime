import { a as initServiceWorker } from "../chunks/sw-handling.js";
import { P as H } from "../vendor/jsox.js";
import { n as loadSettings } from "../chunks/Settings.js";
import { a as onServerClipboardUpdate, c as sendCoordinatorAct, i as isWSConnected, l as sendCoordinatorAsk, n as disconnectWS, o as onVoiceResult, r as initWebSocket, s as onWSConnectionChange, t as connectWS, u as sendCoordinatorRequest } from "../chunks/websocket.js";
import { n as stopBubbling, r as waitForDomPaint, t as eventTargetElement } from "../chunks/DocTools.js";
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
//#region src/frontend/views/airpad/credential-cache-bridge.ts
var impl = null;
/** Clear AES/HMAC key caches when transport secrets or mode change. */
function invalidateAirpadTransportCredentials() {
	try {
		impl?.();
	} catch {}
}
//#endregion
//#region src/frontend/views/airpad/config/config.ts
var STORAGE_KEY = "airpad.remote.connection.v1";
var toTrimmedString = (value) => {
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
	return typeof value === "string" ? value.trim() : "";
};
var hasExplicitPort = (value) => {
	const valueTrimmed = value.trim();
	if (!valueTrimmed) return false;
	const hostSpec = valueTrimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
	const at = hostSpec.lastIndexOf(":");
	if (at <= 0) return false;
	const port = hostSpec.slice(at + 1);
	return /^\d{1,5}$/.test(port);
};
var appendPort = (value, port) => {
	const valueTrimmed = value.trim();
	if (!valueTrimmed) return "";
	const portTrimmed = port.trim();
	if (!portTrimmed) return valueTrimmed;
	if (hasExplicitPort(valueTrimmed)) return valueTrimmed;
	return `${valueTrimmed}:${portTrimmed}`;
};
var normalizeOriginUrl = (value) => {
	const trimmed = toTrimmedString(value);
	if (!trimmed) return "";
	try {
		const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
		return `${url.protocol}//${url.host}/`;
	} catch {
		return trimmed;
	}
};
var looksLikeConnectUrl = (value) => {
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return true;
	if (trimmed.startsWith("localhost")) return true;
	if (trimmed.includes("/")) return true;
	if (/^\[[0-9a-f:]+\](?::\d{1,5})?$/i.test(trimmed)) return true;
	if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?$/.test(trimmed)) return true;
	if (/^[^.\s:]+:\d{1,5}$/.test(trimmed)) return true;
	if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d{1,5})?$/i.test(trimmed)) return true;
	return false;
};
var joinUniqueUrls = (...values) => {
	return Array.from(new Set(values.map((entry) => normalizeOriginUrl(entry)).filter(Boolean))).join(", ");
};
function loadStoredRemoteConfig() {
	try {
		const raw = globalThis?.localStorage?.getItem?.(STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const source = parsed;
		const sourceHost = toTrimmedString(source.host);
		const sourceTunnelHost = toTrimmedString(source.tunnelHost);
		const sourcePort = toTrimmedString(source.port);
		if (!(sourcePort !== "" || sourceTunnelHost !== "")) return parsed;
		const hostParts = [];
		const seen = /* @__PURE__ */ new Set();
		const addHostPart = (hostValue) => {
			const normalized = (sourcePort ? appendPort(hostValue, sourcePort) : hostValue).trim();
			if (!normalized || seen.has(normalized)) return;
			seen.add(normalized);
			hostParts.push(normalized);
		};
		if (sourceHost) addHostPart(sourceHost);
		if (sourceTunnelHost) addHostPart(sourceTunnelHost);
		if (!sourceHost && !sourceTunnelHost && sourcePort && location?.hostname) addHostPart(`${location.hostname}:${sourcePort}`);
		return {
			...parsed,
			host: hostParts.join(", "),
			_legacyMigrated: true
		};
	} catch {
		return {};
	}
}
var readGlobalAirpadValue = (keys) => {
	const globalValue = globalThis.AIRPAD_CONFIG;
	for (const key of keys) {
		const direct = globalThis[key];
		if (typeof direct === "string" && direct.trim()) return direct.trim();
		const fromConfig = globalValue && typeof globalValue === "object" && typeof globalValue[key] === "string" ? globalValue[key] : "";
		if (fromConfig.trim()) return String(fromConfig).trim();
	}
	return "";
};
function persistRemoteConfig() {
	try {
		globalThis?.localStorage?.setItem?.(STORAGE_KEY, JSON.stringify({
			quickConnectValue: remoteConfig.quickConnectValue,
			endpointUrl: remoteConfig.endpointUrl,
			directUrl: remoteConfig.directUrl,
			destinationId: remoteConfig.destinationId,
			accessToken: remoteConfig.accessToken,
			clientId: remoteConfig.clientId,
			peerInstanceId: remoteConfig.peerInstanceId
		}));
	} catch {}
}
var createPeerInstanceId = () => {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	return `ap-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};
var remoteConfig = {
	quickConnectValue: "",
	endpointUrl: "",
	directUrl: "",
	accessToken: "",
	destinationId: "",
	clientId: "",
	peerInstanceId: ""
};
/** Shell / Capacitor toggles (coordinator + future native bridges). */
var shellRemoteClipboardEnabled = true;
var coreSocketProtocol = "auto";
var coreSocketRouteTarget = "";
var coreSocketAccessToken = "";
var remoteHost = "";
var refreshRemoteHost = () => {
	remoteHost = joinUniqueUrls(remoteConfig.directUrl, remoteConfig.endpointUrl);
};
/**
* Apply settings from a stored blob (localStorage shape). Safe to call on tab focus / storage events.
*/
function hydrateFromStored(stored) {
	const legacyHost = toTrimmedString(stored.host);
	const legacyRouteTarget = toTrimmedString(stored.routeTarget);
	const endpointUrl = normalizeOriginUrl(stored.endpointUrl) || (legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
	const directUrl = normalizeOriginUrl(stored.directUrl) || (!legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
	const quickConnectValue = toTrimmedString(stored.quickConnectValue);
	remoteConfig.endpointUrl = endpointUrl;
	remoteConfig.directUrl = directUrl;
	remoteConfig.accessToken = toTrimmedString(stored.accessToken) || toTrimmedString(stored.authToken) || "";
	remoteConfig.destinationId = toTrimmedString(stored.destinationId) || legacyRouteTarget;
	remoteConfig.quickConnectValue = quickConnectValue || remoteConfig.destinationId || remoteConfig.directUrl;
	remoteConfig.clientId = toTrimmedString(stored.clientId);
	const storedPeer = toTrimmedString(stored.peerInstanceId);
	if (storedPeer) remoteConfig.peerInstanceId = storedPeer;
	else if (!remoteConfig.peerInstanceId) remoteConfig.peerInstanceId = createPeerInstanceId();
	refreshRemoteHost();
}
var stored = loadStoredRemoteConfig();
hydrateFromStored(stored);
if (!toTrimmedString(stored.peerInstanceId)) remoteConfig.peerInstanceId = remoteConfig.peerInstanceId || createPeerInstanceId();
var storedAccessToken = toTrimmedString(stored.accessToken);
var storedLegacyAuthToken = toTrimmedString(stored.authToken);
if (stored._legacyMigrated === true || !stored.peerInstanceId || storedLegacyAuthToken && !storedAccessToken) persistRemoteConfig();
/** Re-read localStorage (e.g. after another tab saved, or before mounting AirPad). */
function reloadAirpadRemoteConfigFromStorage() {
	hydrateFromStored(loadStoredRemoteConfig());
}
/** When another tab updates AirPad settings, refresh in-memory state and crypto caches. */
function attachAirpadCrossTabConfigSync() {
	const onStorage = (e) => {
		if (e.key !== STORAGE_KEY || e.newValue == null) return;
		reloadAirpadRemoteConfigFromStorage();
		invalidateAirpadTransportCredentials();
	};
	globalThis.addEventListener?.("storage", onStorage);
	return () => globalThis.removeEventListener?.("storage", onStorage);
}
function isShellRemoteClipboardBridgeEnabled() {
	return shellRemoteClipboardEnabled !== false;
}
function getRemoteHost() {
	return remoteHost;
}
function getAirPadEndpointUrl() {
	if (remoteConfig.endpointUrl.trim()) return remoteConfig.endpointUrl.trim();
	return normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
}
/**
* Quick-connect value shown in the AirPad popup (plus optional auth pass field).
* Prefer an explicit target device id first, otherwise show the current direct/url target.
*/
function getAirPadQuickConnectTarget() {
	if (remoteConfig.quickConnectValue.trim()) return remoteConfig.quickConnectValue.trim();
	if (remoteConfig.destinationId.trim()) return remoteConfig.destinationId.trim();
	if (remoteConfig.directUrl.trim()) return remoteConfig.directUrl.trim();
	if (coreSocketRouteTarget.trim()) return coreSocketRouteTarget.trim();
	return getAirPadEndpointUrl();
}
/**
* Quick-connect accepts either a target device id (routed through the Server-tab
* endpoint URL) or a direct URL/host:port override.
*/
function setAirPadQuickConnectTarget(value) {
	const trimmed = toTrimmedString(value);
	remoteConfig.quickConnectValue = trimmed;
	if (!trimmed) {
		remoteConfig.directUrl = "";
		remoteConfig.destinationId = "";
		refreshRemoteHost();
		persistRemoteConfig();
		return;
	}
	if (looksLikeConnectUrl(trimmed)) {
		remoteConfig.directUrl = normalizeOriginUrl(trimmed);
		remoteConfig.destinationId = "";
	} else {
		remoteConfig.destinationId = trimmed;
		remoteConfig.directUrl = "";
	}
	refreshRemoteHost();
	persistRemoteConfig();
}
function getRemoteProtocol() {
	return coreSocketProtocol;
}
/** Resolved access / control token (local overlay, settings, then env globals). */
function getAccessToken() {
	const local = (remoteConfig.accessToken || "").trim();
	if (local) return local;
	if (coreSocketAccessToken.trim()) return coreSocketAccessToken.trim();
	return readGlobalAirpadValue([
		"CWS_ACCESS_TOKEN",
		"ACCESS_TOKEN",
		"AIRPAD_AUTH_TOKEN",
		"AIRPAD_TOKEN",
		"CWS_AUTH_TOKEN",
		"HUB_AUTH_TOKEN",
		"MASTER_AUTH_TOKEN",
		"CONTROL_TOKEN",
		"ADMIN_TOKEN"
	]);
}
function setAccessToken(token) {
	remoteConfig.accessToken = token || "";
	persistRemoteConfig();
}
var REL_ORIENT_DEADZONE = .001;
var REL_ORIENT_SMOOTH = .8;
//#endregion
//#region src/frontend/views/airpad/network/rails/packet-ws.ts
var sleep$1 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var toCoordinatorAction = (intent) => {
	switch (intent.type) {
		case "pointer.move": return {
			what: "mouse:move",
			payload: {
				x: intent.dx,
				y: intent.dy,
				z: intent.dz ?? 0
			}
		};
		case "pointer.click": return {
			what: "mouse:click",
			payload: {
				button: intent.button || "left",
				double: Boolean(intent.double || intent.count === 2)
			}
		};
		case "pointer.scroll": return {
			what: "mouse:scroll",
			payload: {
				dx: intent.dx || 0,
				dy: intent.dy || 0
			}
		};
		case "pointer.down": return {
			what: "mouse:down",
			payload: { button: intent.button || "left" }
		};
		case "pointer.up": return {
			what: "mouse:up",
			payload: { button: intent.button || "left" }
		};
		case "voice.submit": return {
			what: "voice:submit",
			payload: { text: intent.text }
		};
		case "keyboard.char": switch (intent.char) {
			case "\b":
			case "": return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case "\n":
			case "\r": return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case "	": return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default:
				if (intent.char === " ") return {
					what: "keyboard:tap",
					payload: { key: "space" }
				};
				return {
					what: "keyboard:type",
					payload: { text: intent.char }
				};
		}
		case "keyboard.binary": switch (intent.flags ?? 0) {
			case 1: return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case 2: return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case 3: return {
				what: "keyboard:tap",
				payload: { key: "space" }
			};
			case 4: return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default: return {
				what: "keyboard:type",
				payload: { text: String.fromCodePoint(intent.codePoint) }
			};
		}
		case "gesture.swipe": return null;
	}
};
var toSpecAirpadAction = (action) => {
	if (action.what.startsWith("mouse:")) return {
		what: "airpad:mouse",
		payload: {
			op: action.what,
			params: [action.what],
			data: action.payload
		}
	};
	if (action.what.startsWith("keyboard:")) return {
		what: "airpad:keyboard",
		payload: {
			op: action.what,
			params: [action.what],
			data: action.payload
		}
	};
	return action;
};
var sendKeyboardTapCompat = async (key, modifier) => {
	const payload = {
		op: "keyboard:tap",
		params: ["keyboard:tap"],
		data: {
			key,
			modifier: modifier || []
		}
	};
	try {
		await sendCoordinatorRequest("airpad:keyboard", payload);
	} catch {
		await sendCoordinatorRequest("keyboard:tap", {
			key,
			modifier: modifier || []
		});
	}
};
var requestClipboardReadCompat = async () => {
	try {
		const text = await sendCoordinatorRequest("airpad:clipboard:read", {
			op: "airpad:clipboard:read",
			params: ["airpad:clipboard:read"]
		});
		return typeof text === "string" ? text : String(text || "");
	} catch {
		const text = await sendCoordinatorRequest("clipboard:get", {});
		return typeof text === "string" ? text : String(text || "");
	}
};
var requestClipboardWriteCompat = async (text) => {
	try {
		await sendCoordinatorRequest("airpad:clipboard:write", {
			op: "airpad:clipboard:write",
			params: ["airpad:clipboard:write"],
			data: { text }
		});
	} catch {
		await sendCoordinatorRequest("clipboard:update", { text });
	}
};
var initPacketWsRail = (button) => {
	initWebSocket(button);
};
var connectPacketWsRail = () => {
	connectWS();
};
var disconnectPacketWsRail = () => {
	disconnectWS();
};
var isPacketWsRailConnected = () => {
	return isWSConnected();
};
var onPacketWsRailConnectionChange = (handler) => {
	return onWSConnectionChange(handler);
};
var onPacketWsClipboardUpdate = (handler) => {
	return onServerClipboardUpdate(handler);
};
var sendPacketWsIntent = (intent) => {
	if (intent.type === "gesture.swipe") return;
	const action = toCoordinatorAction(intent);
	if (!action) return;
	const specAction = toSpecAirpadAction(action);
	sendCoordinatorAct(specAction.what, specAction.payload);
};
var sendPacketWsBinary = (buffer) => {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	if (bytes.byteLength < 6) return;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (view.getUint8(4) !== 6) return;
	sendPacketWsIntent({
		type: "keyboard.binary",
		codePoint: view.getUint32(0, true),
		flags: view.getUint8(5)
	});
};
var createPacketWsKeyboardMessage = (codePoint, flags = 0) => {
	const buffer = /* @__PURE__ */ new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setUint32(0, codePoint, true);
	view.setUint8(4, 6);
	view.setUint8(5, flags);
	view.setUint16(6, 0, true);
	return buffer;
};
var requestPacketWsClipboardRead = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		return {
			ok: true,
			text: await requestClipboardReadCompat()
		};
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCopy = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardTapCompat("c", ["control"]);
		await sleep$1(60);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCut = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardTapCompat("x", ["control"]);
		await sleep$1(60);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardPaste = async (text) => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await requestClipboardWriteCompat(text);
		await sleep$1(20);
		await sendKeyboardTapCompat("v", ["control"]);
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
//#endregion
//#region src/frontend/views/airpad/network/coordinator.ts
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var snapshotState = () => {
	const connected = isPacketWsRailConnected();
	return {
		connected,
		state: connected ? "connected" : "disconnected",
		host: getRemoteHost(),
		protocol: getRemoteProtocol(),
		detail: connected ? null : "disconnected",
		timestampMs: Date.now()
	};
};
/**
* AirPad-specific coordinator abstraction that aligns with the CRX network
* coordinator contract while preserving existing rail-level features.
*/
var airPadNetworkCoordinator = {
	init(button) {
		initPacketWsRail(button);
	},
	connect() {
		connectPacketWsRail();
	},
	disconnect() {
		disconnectPacketWsRail();
	},
	reconnectAfterConfigChange(options) {
		disconnectPacketWsRail();
		invalidateAirpadTransportCredentials();
		sleep(options?.delayMs ?? 80).then(() => {
			connectPacketWsRail();
		}).catch(() => {
			console.warn("[AirPad] reconnect after config failed");
		});
	},
	isConnected() {
		return isWSConnected();
	},
	getRemoteHost() {
		return getRemoteHost();
	},
	getState() {
		return snapshotState();
	},
	onConnectionChange(handler) {
		return onPacketWsRailConnectionChange(handler);
	},
	onServerClipboardUpdate(handler) {
		return onPacketWsClipboardUpdate(handler);
	},
	onStateChange(handler) {
		handler(snapshotState().state, snapshotState().detail);
		const off = onPacketWsRailConnectionChange((connected) => {
			handler(connected ? "connected" : "disconnected", connected ? null : "disconnected");
		});
		return () => {
			off();
		};
	},
	onVoiceMessage(handler) {
		return onVoiceResult((message) => {
			handler(message);
		});
	},
	sendCoordinatorAct(what, payload, nodes) {
		return sendCoordinatorAct(what, payload, nodes);
	},
	sendCoordinatorAsk(what, payload, nodes) {
		return sendCoordinatorAsk(what, payload, nodes);
	},
	sendCoordinatorRequest(what, payload, nodes) {
		return sendCoordinatorRequest(what, payload, nodes);
	},
	sendAirPadIntent(intent) {
		sendPacketWsIntent(intent);
	},
	sendAirPadKeyboardChar(char) {
		sendPacketWsIntent({
			type: "keyboard.char",
			char
		});
	},
	createAirPadKeyboardMessage(codePoint, flags = 0) {
		return createPacketWsKeyboardMessage(codePoint, flags);
	},
	sendAirPadBinaryMessage(buffer) {
		sendPacketWsBinary(buffer);
	},
	requestClipboardRead() {
		return requestPacketWsClipboardRead();
	},
	requestClipboardCopy() {
		return requestPacketWsClipboardCopy();
	},
	requestClipboardCut() {
		return requestPacketWsClipboardCut();
	},
	requestClipboardPaste(text) {
		return requestPacketWsClipboardPaste(text);
	},
	requestClipboardHistory(target) {
		return sendCoordinatorRequest("clipboard:get", {
			request: "history",
			target
		}, [target]);
	},
	sendClipboardUpdate(text, target) {
		return sendCoordinatorRequest("clipboard:update", target ? {
			text,
			target
		} : { text }, target ? [target] : void 0);
	}
};
//#endregion
//#region src/frontend/views/airpad/network/session.ts
var initAirPadSessionTransport = (button) => {
	airPadNetworkCoordinator.init(button);
};
var connectAirPadSession = () => {
	airPadNetworkCoordinator.connect();
};
/**
* After changing host/secrets/mode: drop WebSocket, clear AES/HMAC caches, then connect again.
* Mirrors legacy "Save & Reconnect" behavior.
*/
function reconnectAirPadSessionAfterConfigChange(options) {
	airPadNetworkCoordinator.reconnectAfterConfigChange(options);
}
var isAirPadSessionConnected = () => {
	return airPadNetworkCoordinator.isConnected();
};
var onAirPadSessionConnectionChange = (handler) => {
	return airPadNetworkCoordinator.onConnectionChange(handler);
};
var onAirPadRemoteClipboardUpdate = (handler) => {
	return airPadNetworkCoordinator.onServerClipboardUpdate(handler);
};
var onAirPadVoiceMessage = (handler) => {
	return airPadNetworkCoordinator.onVoiceMessage(handler);
};
var sendAirPadIntent = (intent) => {
	airPadNetworkCoordinator.sendAirPadIntent(intent);
};
var sendAirPadKeyboardChar = (char) => {
	airPadNetworkCoordinator.sendAirPadKeyboardChar(char);
};
var requestAirPadClipboardRead = async () => {
	return airPadNetworkCoordinator.requestClipboardRead();
};
var requestAirPadClipboardCopy = async () => {
	return airPadNetworkCoordinator.requestClipboardCopy();
};
var requestAirPadClipboardCut = async () => {
	return airPadNetworkCoordinator.requestClipboardCut();
};
var requestAirPadClipboardPaste = async (text) => {
	return airPadNetworkCoordinator.requestClipboardPaste(text);
};
//#endregion
//#region src/frontend/views/airpad/input/speech.ts
var recognition = null;
var aiListening = false;
var aiModeActive = false;
var speechLanguage = "ru-RU";
var speechRecognitionInitialized = false;
var unsubscribeVoiceMessage = null;
var normalizeSpeechLanguage = (value) => {
	const lang = (value || "").trim();
	if (!lang) return "ru-RU";
	if (lang === "ru") return "ru-RU";
	if (lang === "en") return "en-US";
	if (lang === "en-GB") return "en-GB";
	if (lang === "en-US") return "en-US";
	return lang;
};
async function loadSpeechLanguagePreference() {
	try {
		speechLanguage = normalizeSpeechLanguage((await loadSettings())?.speech?.language);
		if (recognition) recognition.lang = speechLanguage;
	} catch {
		speechLanguage = "ru-RU";
	}
}
var checkIsAiModeActive = () => {
	return aiListening || aiModeActive;
};
function setAiStatus(text) {
	const aiStatusEl = getAiStatusEl();
	if (aiStatusEl) aiStatusEl.textContent = text;
}
function setupSpeechRecognition() {
	const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SR) {
		log("SpeechRecognition API не поддерживается.");
		return null;
	}
	const recog = new SR();
	recog.lang = speechLanguage;
	recog.interimResults = false;
	recog.maxAlternatives = 1;
	return recog;
}
function initSpeechRecognition() {
	if (speechRecognitionInitialized) return;
	speechRecognitionInitialized = true;
	loadSpeechLanguagePreference();
	recognition = setupSpeechRecognition();
	unsubscribeVoiceMessage?.();
	unsubscribeVoiceMessage = onAirPadVoiceMessage((message) => {
		const voiceTextEl = getVoiceTextEl();
		if (voiceTextEl) voiceTextEl.textContent = message.text;
	});
	if (recognition) {
		recognition.onstart = () => {
			const aiButton = getAiButton();
			const voiceTextEl = getVoiceTextEl();
			aiListening = true;
			aiModeActive = true;
			if (aiButton) aiButton.classList.add("listening");
			setAiStatus("listening");
			if (voiceTextEl) voiceTextEl.textContent = "Слушаю...";
			log("Speech: start");
		};
		recognition.onend = () => {
			const aiButton = getAiButton();
			aiListening = false;
			aiModeActive = false;
			if (aiButton) aiButton.classList.remove("listening");
			setAiStatus("idle");
			log("Speech: end");
		};
		recognition.onerror = (event) => {
			const voiceTextEl = getVoiceTextEl();
			if (voiceTextEl) voiceTextEl.textContent = "Ошибка распознавания: " + event.error;
			log("Speech error: " + event.error);
		};
		recognition.onresult = (event) => {
			const voiceTextEl = getVoiceTextEl();
			const normalized = (event.results[0][0].transcript || "").trim();
			const words = normalized.split(/\s+/).filter(Boolean);
			if (voiceTextEl) voiceTextEl.textContent = normalized ? "Команда: " + normalized : "Команда не распознана";
			log("Speech result: " + normalized);
			if (words.length < 2) {
				log("Speech: недостаточно слов (нужно >= 2) — не отправляем и не подключаем WS");
				return;
			}
			const trySend = (deadline) => {
				if (isAirPadSessionConnected()) {
					sendAirPadIntent({
						type: "voice.submit",
						text: normalized
					});
					return;
				}
				if (Date.now() > deadline) {
					log("Speech: не удалось дождаться WS, команда не отправлена");
					return;
				}
				setTimeout(() => trySend(deadline), 120);
			};
			if (!isAirPadSessionConnected()) {
				log("Speech: подключаем WS перед отправкой команды");
				connectAirPadSession();
				trySend(Date.now() + 2e3);
			} else sendAirPadIntent({
				type: "voice.submit",
				text: normalized
			});
		};
	}
}
function initAiButton() {
	const aiButton = getAiButton();
	if (!aiButton) return;
	let pointerActive = false;
	let pointerId = null;
	aiButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (pointerActive) return;
		pointerActive = true;
		pointerId = e.pointerId;
		aiButton.setPointerCapture(pointerId);
		if (!recognition) {
			log("SpeechRecognition недоступен");
			return;
		}
		try {
			recognition.start();
		} catch (err) {
			log("Recognition start error: " + err.message);
		}
	});
	aiButton.addEventListener("pointerup", (e) => {
		if (!pointerActive || e.pointerId !== pointerId) return;
		e.preventDefault();
		pointerActive = false;
		aiButton.releasePointerCapture(pointerId);
		pointerId = null;
		if (!recognition) return;
		try {
			recognition.stop();
		} catch (err) {
			log("Recognition stop error: " + err.message);
		}
	});
	aiButton.addEventListener("pointercancel", () => {
		if (!pointerActive) return;
		pointerActive = false;
		pointerId = null;
		if (recognition) try {
			recognition.stop();
		} catch {}
	});
}
//#endregion
//#region src/frontend/views/airpad/config/motion-state.ts
var accum = {
	dx: 0,
	dy: 0,
	dz: 0
};
var flushTimer = null;
function clearAccum() {
	accum.dx = 0;
	accum.dy = 0;
	accum.dz = 0;
}
function scheduleFlush() {
	if (flushTimer !== null) return;
	flushTimer = globalThis?.setTimeout?.(() => {
		flushTimer = null;
		if (accum.dx === 0 && accum.dy === 0 && accum.dz === 0) return;
		sendAirPadIntent({
			type: "pointer.move",
			dx: accum.dx,
			dy: accum.dy,
			dz: accum.dz
		});
		clearAccum();
	}, 7);
}
function enqueueMotion(dx, dy, dz = 0) {
	if (Math.abs(dx) < .001) dx = 0;
	if (Math.abs(dy) < .001) dy = 0;
	if (Math.abs(dz) < .001) dz = 0;
	if (dx === 0 && dy === 0 && dz === 0) return;
	accum.dx += dx;
	accum.dy += dy;
	accum.dz += dz;
	scheduleFlush();
}
function resetMotionAccum() {
	clearAccum();
	if (flushTimer !== null) {
		clearTimeout(flushTimer);
		flushTimer = null;
	}
}
//#endregion
//#region src/frontend/views/airpad/utils/math.ts
function n0(v) {
	return Number.isFinite(v) ? v : 0;
}
function clamp01(v) {
	const x = n0(v);
	return x < 0 ? 0 : x > 1 ? 1 : x;
}
function lerp(a, b, t) {
	return n0(a) + (n0(b) - n0(a)) * clamp01(t);
}
function expSmoothing(dtSeconds, ratePerSecond) {
	const dt = Math.max(0, n0(dtSeconds));
	const rate = Math.abs(n0(ratePerSecond));
	return 1 - Math.exp(-rate * dt);
}
function vec3Zero() {
	return {
		x: 0,
		y: 0,
		z: 0
	};
}
function vec3Mix(a, b, f = .5) {
	const ax = n0(a.x);
	const ay = n0(a.y);
	const az = n0(a.z);
	const bx = n0(b.x);
	const by = n0(b.y);
	const bz = n0(b.z);
	const ff = n0(f);
	return {
		x: ax + (bx - ax) * ff,
		y: ay + (by - ay) * ff,
		z: az + (bz - az) * ff
	};
}
function vec3Clamp(v, max) {
	const m = Math.abs(n0(max));
	if (m === 0) return vec3Zero();
	const x = n0(v.x);
	const y = n0(v.y);
	const z = n0(v.z);
	const length = Math.hypot(x, y, z);
	if (length === 0 || length <= m) return {
		x,
		y,
		z
	};
	const s = m / length;
	return {
		x: x * s,
		y: y * s,
		z: z * s
	};
}
function vec3IsNearZero(v, epsilon = .01) {
	const e = Math.abs(n0(epsilon) || .01);
	return Math.abs(n0(v.x)) < e && Math.abs(n0(v.y)) < e && Math.abs(n0(v.z)) < e;
}
function vec3Smooth(current, target, factor = .25) {
	return vec3Mix(current, target, factor);
}
function vec3Select(v, axisX, axisY, axisZ) {
	const componentMap = {
		ax: n0(v.x),
		ay: n0(v.y),
		az: n0(v.z)
	};
	return {
		x: componentMap[axisX],
		y: componentMap[axisY],
		z: componentMap[axisZ]
	};
}
function vec3RotateXYByAngle(v, angleRad, zOverride) {
	const a = n0(angleRad);
	const cosA = Math.cos(a);
	const sinA = Math.sin(a);
	const x = n0(v.x);
	const y = n0(v.y);
	return {
		x: x * cosA - y * sinA,
		y: x * sinA + y * cosA,
		z: zOverride !== void 0 ? n0(zOverride) : n0(v.z)
	};
}
vec3Zero();
performance.now();
function resetGyroState() {
	setMotionCalibrated(false);
	performance.now();
	resetMonteCarloSampling$1();
	gyroscopeSmoothed = vec3Zero();
	integratedAngles = vec3Zero();
	lastGyroMovement = vec3Zero();
}
function onEnterAirMove$1() {
	resetGyroState();
}
var gyroscopeSmoothed = vec3Zero();
vec3Zero();
var integratedAngles = vec3Zero();
vec3Zero();
function resetMonteCarloSampling$1() {
	vec3Zero();
	vec3Zero();
}
var lastGyroMovement = vec3Zero();
vec3Zero();
vec3Zero();
performance.now();
function resetAccelState() {
	setMotionCalibrated(false);
	performance.now();
	resetMonteCarloSampling();
	accelerometerSmoothed = vec3Zero();
	accelerometerResolved = vec3Zero();
	forSendingMovement = vec3Zero();
}
function onEnterAirMove() {
	resetAccelState();
}
var accelerometerSmoothed = vec3Zero();
var accelerometerResolved = vec3Zero();
vec3Zero();
function resetMonteCarloSampling() {
	vec3Zero();
	vec3Zero();
}
vec3Zero();
var forSendingMovement = vec3Zero();
//#endregion
//#region src/frontend/views/airpad/ui/air-button.ts
var airState = "IDLE";
var airDownTime = 0;
var airDownPos = null;
var airMoveTimer = null;
var dragActive = false;
var lastSwipePos = null;
var swipeDirection = null;
var lastTapEndTime = 0;
var lastTapWasClean = false;
var pendingDragOnHold = false;
var neighborPointerHandlersBound = /* @__PURE__ */ new WeakSet();
var airPointerDownBound = /* @__PURE__ */ new WeakSet();
var airSurfaceDocumentRoutingAttached = false;
var airSurfacePointerId = null;
var airSurfaceCaptureTarget = null;
var DOUBLE_TAP_WINDOW = 300;
var DRAG_HOLD_DELAY = 150;
var TAP_MOVE_FORGIVENESS = Math.max(6, 12);
var AIR_MOVE_TAP_GRACE_MS = 340;
var AIR_MOVE_TAP_GRACE_MOVE = Math.max(6, 16);
function getAirState() {
	return airState;
}
function setMotionCalibrated(value) {}
function resetMotionBaseline() {}
function setAirStatus(state) {
	const airStatusEl = getAirStatusEl();
	const airButton = getAirButton();
	airState = state;
	if (airStatusEl) airStatusEl.textContent = state + (dragActive ? " [DRAG]" : "");
	if (airButton) {
		airButton.classList.toggle("air-move", state === "AIR_MOVE");
		airButton.classList.toggle("active", state !== "IDLE");
		airButton.classList.toggle("drag-active", dragActive);
	}
}
function resetAirState() {
	setAirStatus("IDLE");
	airDownPos = null;
	lastSwipePos = null;
	swipeDirection = null;
	pendingDragOnHold = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	resetMotionBaseline();
}
/**
* Входит в режим AIR_MOVE — управление курсором через гироскоп/акселерометр.
* @param startDrag - если true, сразу активируется drag-режим (зажатая ЛКМ)
*/
function enterAirMove(startDrag = false) {
	setAirStatus("AIR_MOVE");
	resetMotionBaseline();
	onEnterAirMove$1();
	onEnterAirMove();
	if (startDrag && !dragActive) {
		dragActive = true;
		sendAirPadIntent({
			type: "pointer.down",
			button: "left"
		});
		log("Air: AIR_MOVE + DRAG started (mouse down)");
		setAirStatus("AIR_MOVE");
	} else log("Air: AIR_MOVE started (cursor control via sensors)");
}
/**
* Выход из AIR_MOVE режима
*/
function exitAirMove() {
	if (airState !== "AIR_MOVE") return;
	if (dragActive) {
		sendAirPadIntent({
			type: "pointer.up",
			button: "left"
		});
		log("Air: DRAG ended (mouse up)");
		dragActive = false;
	} else log("Air: AIR_MOVE ended");
}
function airOnDown(e) {
	connectAirPadSession();
	if (checkIsAiModeActive()) return;
	const now = Date.now();
	const timeSinceLastTap = now - lastTapEndTime;
	if (lastTapWasClean && timeSinceLastTap < DOUBLE_TAP_WINDOW) {
		pendingDragOnHold = true;
		log(`Air: double-tap detected (${timeSinceLastTap}ms since last tap), preparing for drag...`);
	} else pendingDragOnHold = false;
	lastTapWasClean = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	airDownTime = now;
	airDownPos = {
		x: e.clientX,
		y: e.clientY
	};
	setAirStatus("WAIT_TAP_OR_HOLD");
	const holdDelay = pendingDragOnHold ? DRAG_HOLD_DELAY : 100;
	airMoveTimer = globalThis?.setTimeout?.(() => {
		if (airState === "WAIT_TAP_OR_HOLD") enterAirMove(pendingDragOnHold);
	}, holdDelay);
}
function airOnUp(e) {
	if (checkIsAiModeActive()) {
		resetAirState();
		return;
	}
	const now = Date.now();
	const dt = now - airDownTime;
	const pointerUpX = e?.clientX ?? airDownPos?.x ?? 0;
	const pointerUpY = e?.clientY ?? airDownPos?.y ?? 0;
	let wasCleanTap = false;
	let shouldClickFromAirMoveGrace = false;
	if (airState === "AIR_MOVE" && !dragActive && airDownPos) {
		const dx = pointerUpX - airDownPos.x;
		const dy = pointerUpY - airDownPos.y;
		shouldClickFromAirMoveGrace = dt < AIR_MOVE_TAP_GRACE_MS && Math.hypot(dx, dy) < AIR_MOVE_TAP_GRACE_MOVE;
	}
	if (airState === "AIR_MOVE") exitAirMove();
	if (airState === "GESTURE_SWIPE") log("Air: swipe gesture ended");
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (airDownPos && dt < 200) {
			const dx = pointerUpX - airDownPos.x;
			const dy = pointerUpY - airDownPos.y;
			if (Math.hypot(dx, dy) < TAP_MOVE_FORGIVENESS) {
				wasCleanTap = true;
				if (!pendingDragOnHold) {
					sendAirPadIntent({
						type: "pointer.click",
						button: "left"
					});
					log("Air: tap → click");
				} else {
					sendAirPadIntent({
						type: "pointer.click",
						button: "left",
						count: 2
					});
					log("Air: tap-tap → double-click");
					wasCleanTap = false;
				}
			}
		}
	}
	if (shouldClickFromAirMoveGrace) {
		sendAirPadIntent({
			type: "pointer.click",
			button: "left"
		});
		log("Air: short hold + small move → click (grace)");
		wasCleanTap = true;
	}
	lastTapEndTime = now;
	lastTapWasClean = wasCleanTap;
	if (wasCleanTap) log(`Air: clean tap recorded, next tap+hold within ${DOUBLE_TAP_WINDOW}ms will start drag`);
	dragActive = false;
	resetAirState();
}
function handleAirSurfaceMove(x, y) {
	if (!airDownPos) return;
	const dxSurf = x - airDownPos.x;
	const dySurf = y - airDownPos.y;
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (Math.hypot(dxSurf, dySurf) > 40) {
			if (airMoveTimer !== null) {
				clearTimeout(airMoveTimer);
				airMoveTimer = null;
			}
			pendingDragOnHold = false;
			lastTapWasClean = false;
			setAirStatus("GESTURE_SWIPE");
			startSwipeGesture(dxSurf, dySurf);
		}
	} else if (airState === "GESTURE_SWIPE") continueSwipeGesture(x, y);
}
function startSwipeGesture(dxSurf, dySurf) {
	if (Math.abs(dySurf) > Math.abs(dxSurf)) {
		swipeDirection = "vertical";
		lastSwipePos = {
			x: airDownPos.x,
			y: airDownPos.y
		};
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dySurf * .8)
		});
		log(`Air: swipe ${dySurf > 0 ? "down" : "up"} → scroll`);
	} else {
		swipeDirection = "horizontal";
		const direction = dxSurf > 0 ? "right" : "left";
		log(`Air: swipe ${direction}`);
		sendAirPadIntent({
			type: "gesture.swipe",
			direction
		});
		resetAirState();
	}
}
function continueSwipeGesture(x, y) {
	if (!lastSwipePos || !airDownPos || swipeDirection !== "vertical") return;
	const dy = y - lastSwipePos.y;
	if (Math.abs(dy) > 2) {
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dy * .8)
		});
		lastSwipePos = {
			x,
			y
		};
	}
}
var neighborState = "IDLE";
var neighborDownTime = 0;
var neighborDownPos = null;
var neighborHoldTimer = null;
var neighborPointerId = null;
var NEIGHBOR_HOLD_DELAY = 250;
var NEIGHBOR_TAP_THRESHOLD = 200;
var NEIGHBOR_MOVE_THRESHOLD = 15;
function enterMiddleScrollMode() {
	neighborState = "MIDDLE_SCROLL";
	resetAirState();
	sendAirPadIntent({
		type: "pointer.down",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL started (sensors active)");
	getAirNeighborButton()?.classList.add("middle-scroll-active", "active");
	enterAirMove();
}
function exitMiddleScrollMode() {
	if (neighborState !== "MIDDLE_SCROLL") return;
	sendAirPadIntent({
		type: "pointer.up",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL ended");
	neighborState = "IDLE";
	resetAirState();
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
}
function resetNeighborState() {
	if (neighborHoldTimer !== null) {
		clearTimeout(neighborHoldTimer);
		neighborHoldTimer = null;
	}
	neighborDownPos = null;
	neighborState = "IDLE";
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
	resetAirState();
}
function initNeighborButton() {
	const neighborButton = getAirNeighborButton();
	if (!neighborButton) return;
	if (neighborPointerHandlersBound.has(neighborButton)) return;
	neighborPointerHandlersBound.add(neighborButton);
	neighborButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (neighborPointerId !== null && neighborPointerId !== e.pointerId) return;
		connectAirPadSession();
		if (checkIsAiModeActive()) return;
		neighborPointerId = e.pointerId;
		neighborButton.setPointerCapture(neighborPointerId);
		neighborDownTime = Date.now();
		neighborDownPos = {
			x: e.clientX,
			y: e.clientY
		};
		neighborState = "WAIT_TAP_OR_HOLD";
		neighborButton.classList.add("active");
		neighborHoldTimer = globalThis?.setTimeout?.(() => {
			neighborHoldTimer = null;
			if (neighborState === "WAIT_TAP_OR_HOLD") enterMiddleScrollMode();
		}, NEIGHBOR_HOLD_DELAY);
	});
	neighborButton.addEventListener("pointermove", (e) => {
		if (e.pointerId !== neighborPointerId || !neighborDownPos) return;
		e.preventDefault();
		if (neighborState === "WAIT_TAP_OR_HOLD") {
			const dx = e.clientX - neighborDownPos.x;
			const dy = e.clientY - neighborDownPos.y;
			if (Math.hypot(dx, dy) > NEIGHBOR_MOVE_THRESHOLD) {
				if (neighborHoldTimer !== null) {
					clearTimeout(neighborHoldTimer);
					neighborHoldTimer = null;
				}
			}
		}
	});
	neighborButton.addEventListener("pointerup", (e) => {
		if (e.pointerId !== neighborPointerId) return;
		e.preventDefault();
		const dt = Date.now() - neighborDownTime;
		if (neighborState === "MIDDLE_SCROLL") exitMiddleScrollMode();
		else if (neighborState === "WAIT_TAP_OR_HOLD" && dt < NEIGHBOR_TAP_THRESHOLD) {
			if (neighborDownPos) {
				const dx = e.clientX - neighborDownPos.x;
				const dy = e.clientY - neighborDownPos.y;
				if (Math.hypot(dx, dy) < NEIGHBOR_MOVE_THRESHOLD) {
					sendAirPadIntent({
						type: "pointer.click",
						button: "right"
					});
					log("Neighbor: tap → right-click (context menu)");
				}
			}
		}
		if (neighborPointerId !== null) {
			neighborButton.releasePointerCapture(neighborPointerId);
			neighborPointerId = null;
		}
		resetNeighborState();
	});
	neighborButton.addEventListener("pointercancel", (e) => {
		if (e?.pointerId === neighborPointerId || e?.pointerId == null) {
			if (neighborState === "MIDDLE_SCROLL") {
				sendAirPadIntent({
					type: "pointer.up",
					button: "middle"
				});
				log("Neighbor: middle-scroll cancelled");
			}
			if (neighborPointerId !== null) {
				neighborButton.releasePointerCapture(neighborPointerId);
				neighborPointerId = null;
			}
			resetNeighborState();
		}
	});
	neighborButton.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	log("Neighbor button initialized (tap: right-click, hold: middle-scroll via sensors)");
}
function initAirButton() {
	const airButton = getAirButton();
	if (!airButton) return;
	initNeighborButton();
	if (!airPointerDownBound.has(airButton)) {
		airPointerDownBound.add(airButton);
		airButton.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			if (airSurfacePointerId !== null && airSurfacePointerId !== e.pointerId) return;
			airSurfacePointerId = e.pointerId;
			airSurfaceCaptureTarget = airButton;
			airSurfaceCaptureTarget.setPointerCapture(airSurfacePointerId);
			airOnDown(e);
		});
	}
	if (!airSurfaceDocumentRoutingAttached) {
		airSurfaceDocumentRoutingAttached = true;
		const routingDoc = airButton.ownerDocument;
		routingDoc.addEventListener("pointermove", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			if (!airDownPos) return;
			if (checkIsAiModeActive()) return;
			handleAirSurfaceMove(e.clientX, e.clientY);
		});
		routingDoc.addEventListener("pointerup", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			if (airSurfacePointerId !== null && airSurfaceCaptureTarget) try {
				airSurfaceCaptureTarget.releasePointerCapture(airSurfacePointerId);
			} catch {}
			airSurfacePointerId = null;
			airSurfaceCaptureTarget = null;
			airOnUp(e);
		});
		routingDoc.addEventListener("pointercancel", (e) => {
			if (e?.pointerId !== airSurfacePointerId && e?.pointerId != null) return;
			if (airSurfacePointerId !== null && airSurfaceCaptureTarget) try {
				airSurfaceCaptureTarget.releasePointerCapture(airSurfacePointerId);
			} catch {}
			airSurfacePointerId = null;
			airSurfaceCaptureTarget = null;
			if (dragActive) {
				sendAirPadIntent({
					type: "pointer.up",
					button: "left"
				});
				dragActive = false;
				log("Air: drag cancelled (mouse up)");
			}
			resetAirState();
		});
	}
	log("Air button initialized");
}
//#endregion
//#region src/frontend/views/airpad/input/sensor/relative-orientation.ts
var relSensor = null;
var fallbackOrientationActive = false;
var fallbackHandler = null;
var lastQuat = null;
var smoothedDelta = vec3Zero();
var dynamicMaxStepPx = 60;
function resetRelativeOrientationRuntimeState() {
	lastQuat = null;
	smoothedDelta = vec3Zero();
	dynamicMaxStepPx = 60;
}
function stopRelativeOrientation() {
	try {
		if (relSensor) relSensor.stop?.();
	} catch {}
	relSensor = null;
	if (fallbackOrientationActive && fallbackHandler) globalThis.removeEventListener("deviceorientation", fallbackHandler);
	fallbackOrientationActive = false;
	fallbackHandler = null;
}
var quatNormalizeStable = (q, prev) => {
	const [x, y, z, w] = q;
	const len = Math.hypot(x, y, z, w) || 1;
	let nx = x / len, ny = y / len, nz = z / len, nw = w / len;
	if (prev) {
		if (nx * prev[0] + ny * prev[1] + nz * prev[2] + nw * prev[3] < 0) {
			nx = -nx;
			ny = -ny;
			nz = -nz;
			nw = -nw;
		}
	}
	return [
		nx,
		ny,
		nz,
		nw
	];
};
var quatConj = (q) => {
	const [x, y, z, w] = q;
	return [
		-x,
		-y,
		-z,
		w
	];
};
var quatMul = (a, b) => {
	const [ax, ay, az, aw] = a;
	const [bx, by, bz, bw] = b;
	return [
		aw * bx + ax * bw + ay * bz - az * by,
		aw * by - ax * bz + ay * bw + az * bx,
		aw * bz + ax * by - ay * bx + az * bw,
		aw * bw - ax * bx - ay * by - az * bz
	];
};
var quatDeltaToAxisAngle = (dq) => {
	const [x, y, z, w] = dq;
	const sinHalf = Math.hypot(x, y, z);
	const angle = 2 * Math.atan2(sinHalf, w || 1);
	if (sinHalf < 1e-6) return {
		x: 0,
		y: 0,
		z: 0
	};
	const inv = 1 / sinHalf;
	return {
		x: x * inv * angle,
		y: y * inv * angle,
		z: z * inv * angle
	};
};
function mapToPixelsRaw(movement) {
	const selected = vec3Select(movement, "az", "ay", "ax");
	const projected = vec3RotateXYByAngle(selected, selected.z * -1, 1);
	return {
		x: projected.x * -1 * 600,
		y: projected.y * -1 * 600,
		z: projected.z * -1 * 600
	};
}
function clampPxRadiusFromDeltaVec(deltaVec, dt) {
	const rawMapped = mapToPixelsRaw(deltaVec);
	const magPx = Math.hypot(rawMapped.x, rawMapped.y, rawMapped.z);
	const desired = Math.max(60, Math.min(800, magPx));
	const t = desired > dynamicMaxStepPx ? expSmoothing(dt, 6) : expSmoothing(dt, 14);
	dynamicMaxStepPx = lerp(dynamicMaxStepPx, desired, t);
	if (!Number.isFinite(dynamicMaxStepPx)) dynamicMaxStepPx = 60;
	dynamicMaxStepPx = Math.max(60, Math.min(800, dynamicMaxStepPx));
	return dynamicMaxStepPx;
}
function mapAndScale(movement, maxStepPx) {
	return vec3Clamp(mapToPixelsRaw(movement), maxStepPx);
}
function handleReading(quat, dt) {
	if (!quat || quat.length < 4) return vec3Zero();
	const curQuat = quatNormalizeStable([
		quat[0],
		quat[1],
		quat[2],
		quat[3]
	], lastQuat);
	if (!lastQuat) lastQuat = curQuat;
	const deltaQuat = quatMul(curQuat, quatConj(lastQuat));
	lastQuat = curQuat;
	const deltaVec = quatDeltaToAxisAngle(deltaQuat);
	const maxStepPx = clampPxRadiusFromDeltaVec(deltaVec, dt);
	const deltaPx = mapToPixelsRaw(deltaVec);
	const smoothFactor = clamp01(expSmoothing(dt, lerp(6, 24, clamp01((Math.hypot(deltaPx.x, deltaPx.y, deltaPx.z) - 60) / Math.max(1, 740)))) * clamp01(REL_ORIENT_SMOOTH));
	smoothedDelta = vec3Smooth(smoothedDelta, deltaVec, smoothFactor * .9);
	const maxStepRad = maxStepPx / Math.max(1e-6, Math.abs(600));
	smoothedDelta = vec3Clamp(smoothedDelta, Math.max(REL_ORIENT_DEADZONE, maxStepRad));
	const dz = {
		x: Math.abs(smoothedDelta.x) < .001 ? 0 : smoothedDelta.x,
		y: Math.abs(smoothedDelta.y) < .001 ? 0 : smoothedDelta.y,
		z: Math.abs(smoothedDelta.z) < .001 ? 0 : smoothedDelta.z
	};
	if (Math.abs(dz.x) < .001 && Math.abs(dz.y) < .001 && Math.abs(dz.z) < .001) return vec3Zero();
	const mapped = mapAndScale(dz, maxStepPx);
	if (vec3IsNearZero(mapped, .001)) return vec3Zero();
	return mapped;
}
function initRelativeOrientation() {
	stopRelativeOrientation();
	const startDeviceOrientationFallback = () => {
		if (fallbackOrientationActive) return;
		let lastTs = performance.now();
		let lastEuler = {
			x: 0,
			y: 0,
			z: 0
		};
		fallbackHandler = (event) => {
			const now = performance.now();
			const dt = Math.max(1e-5, (now - lastTs) / 1e3);
			lastTs = now;
			const alpha = Number(event.alpha ?? 0);
			const current = {
				x: Number(event.beta ?? 0),
				y: Number(event.gamma ?? 0),
				z: alpha
			};
			const deltaDeg = {
				x: current.x - lastEuler.x,
				y: current.y - lastEuler.y,
				z: current.z - lastEuler.z
			};
			lastEuler = current;
			const mapped = mapAndScale({
				x: deltaDeg.x * Math.PI / 180,
				y: deltaDeg.y * Math.PI / 180,
				z: deltaDeg.z * Math.PI / 180
			}, clampPxRadiusFromDeltaVec({
				x: deltaDeg.x * Math.PI / 180,
				y: deltaDeg.y * Math.PI / 180,
				z: deltaDeg.z * Math.PI / 180
			}, dt));
			if (getAirState && getAirState() !== "AIR_MOVE") return;
			if (!isAirPadSessionConnected()) return;
			if (aiModeActive) return;
			if (vec3IsNearZero(mapped, .001)) return;
			enqueueMotion(mapped.x, mapped.y, mapped.z);
		};
		globalThis.addEventListener("deviceorientation", fallbackHandler, { passive: true });
		fallbackOrientationActive = true;
		log("RelativeOrientation fallback active (deviceorientation)");
	};
	if (!window.RelativeOrientationSensor) {
		log("RelativeOrientationSensor API is not supported.");
		startDeviceOrientationFallback();
		return;
	}
	try {
		relSensor = new window.RelativeOrientationSensor({
			frequency: 120,
			referenceFrame: "device"
		});
	} catch (err) {
		log("Cannot create RelativeOrientationSensor: " + (err?.message || err));
		relSensor = null;
		return;
	}
	let lastTs = performance.now();
	relSensor.addEventListener("reading", () => {
		const now = performance.now();
		const dt = Math.max(1e-5, (now - lastTs) / 1e3);
		lastTs = now;
		const mapped = handleReading(relSensor.quaternion, dt);
		if (getAirState && getAirState() !== "AIR_MOVE") return;
		if (!isAirPadSessionConnected()) return;
		if (aiModeActive) return;
		enqueueMotion(mapped.x, mapped.y, mapped.z);
	});
	relSensor.addEventListener("error", (event) => {
		log("RelativeOrientationSensor error: " + (event?.error?.message || event?.message || event));
		startDeviceOrientationFallback();
	});
	try {
		relSensor.start();
		log("RelativeOrientationSensor started (120 Hz)");
	} catch (err) {
		log("RelativeOrientationSensor start failed: " + (err?.message || err));
	}
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/api.ts
var virtualKeyboardAPI = null;
function initVirtualKeyboardAPI() {
	if ("virtualKeyboard" in navigator && navigator.virtualKeyboard) {
		virtualKeyboardAPI = navigator.virtualKeyboard;
		virtualKeyboardAPI.overlaysContent = true;
		log("VirtualKeyboard API available");
		return true;
	}
	return false;
}
function getVirtualKeyboardAPI() {
	return virtualKeyboardAPI;
}
function hasVirtualKeyboardAPI() {
	return virtualKeyboardAPI !== null;
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/state.ts
var keyboardVisible = false;
var keyboardElement = null;
var toggleButton = null;
var remoteKeyboardEnabled = false;
function setKeyboardVisible(visible) {
	keyboardVisible = visible;
}
function isKeyboardVisible() {
	return keyboardVisible;
}
function setKeyboardElement(element) {
	keyboardElement = element;
}
function getKeyboardElement() {
	return keyboardElement;
}
function setToggleButton(button) {
	toggleButton = button;
}
function getToggleButton() {
	return toggleButton;
}
function setRemoteKeyboardEnabled$1(enabled) {
	remoteKeyboardEnabled = enabled;
}
function isRemoteKeyboardEnabled() {
	return remoteKeyboardEnabled;
}
if ("visualViewport" in globalThis) {
	const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = .75;
	globalThis?.visualViewport?.addEventListener?.("resize", function(event) {
		if (event.target.height * event.target.scale / globalThis?.screen?.height < VIEWPORT_VS_CLIENT_HEIGHT_RATIO) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
if ("virtualKeyboard" in globalThis?.navigator) {
	navigator.virtualKeyboard.overlaysContent = true;
	navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
		const { x, y, width, height } = event.target.boundingRect;
		if (height > 0) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/constants.ts
var EMOJI_CATEGORIES = {
	"smileys": [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"🤣",
		"😂",
		"🙂",
		"🙃",
		"😉",
		"😊",
		"😇",
		"🥰",
		"😍",
		"🤩",
		"😘",
		"😗",
		"😚",
		"😙"
	],
	"gestures": [
		"👋",
		"🤚",
		"🖐",
		"✋",
		"🖖",
		"👌",
		"🤌",
		"🤏",
		"✌️",
		"🤞",
		"🤟",
		"🤘",
		"🤙",
		"👈",
		"👉",
		"👆",
		"🖕",
		"👇",
		"☝️",
		"👍"
	],
	"symbols": [
		"❤️",
		"🧡",
		"💛",
		"💚",
		"💙",
		"💜",
		"🖤",
		"🤍",
		"🤎",
		"💔",
		"❣️",
		"💕",
		"💞",
		"💓",
		"💗",
		"💖",
		"💘",
		"💝",
		"💟",
		"☮️"
	],
	"objects": [
		"⌚",
		"📱",
		"📲",
		"💻",
		"⌨️",
		"🖥️",
		"🖨️",
		"🖱️",
		"🖲️",
		"🕹️",
		"🗜️",
		"💾",
		"💿",
		"📀",
		"📼",
		"📷",
		"📸",
		"📹",
		"🎥",
		"📽️"
	],
	"arrows": [
		"⬆️",
		"↗️",
		"➡️",
		"↘️",
		"⬇️",
		"↙️",
		"⬅️",
		"↖️",
		"↕️",
		"↔️",
		"↩️",
		"↪️",
		"⤴️",
		"⤵️",
		"🔃",
		"🔄",
		"🔙",
		"🔚",
		"🔛",
		"🔜"
	]
};
var KEYBOARD_LAYOUT = [
	[
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
	],
	[
		"q",
		"w",
		"e",
		"r",
		"t",
		"y",
		"u",
		"i",
		"o",
		"p"
	],
	[
		"a",
		"s",
		"d",
		"f",
		"g",
		"h",
		"j",
		"k",
		"l"
	],
	[
		"z",
		"x",
		"c",
		"v",
		"b",
		"n",
		"m"
	]
];
var KEYBOARD_LAYOUT_UPPER = [
	[
		"!",
		"@",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")"
	],
	[
		"Q",
		"W",
		"E",
		"R",
		"T",
		"Y",
		"U",
		"I",
		"O",
		"P"
	],
	[
		"A",
		"S",
		"D",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L"
	],
	[
		"Z",
		"X",
		"C",
		"V",
		"B",
		"N",
		"M"
	]
];
//#endregion
//#region src/frontend/views/airpad/input/keyboard/message.ts
function sendKeyboardChar(char) {
	if (!isAirPadSessionConnected()) return;
	sendAirPadKeyboardChar(char);
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/ui.ts
function createKeyboardHTML() {
	return `
        <div class="virtual-keyboard-container" data-hidden="true" aria-hidden="true">
            <div class="keyboard-header">
                <button type="button" name="airpad-keyboard-close" class="keyboard-close" aria-label="Close keyboard">✕</button>
                <div class="keyboard-tabs">
                    <button type="button" name="airpad-keyboard-tab-letters" class="keyboard-tab active" data-tab="letters">ABC</button>
                    <button type="button" name="airpad-keyboard-tab-emoji" class="keyboard-tab" data-tab="emoji">😀</button>
                </div>
            </div>
            <div class="keyboard-content">
                <div class="keyboard-panel active" data-panel="letters">
                    <div class="keyboard-shift-container">
                        <button type="button" name="airpad-keyboard-shift" class="keyboard-shift" data-shift="lower">⇧</button>
                    </div>
                    <div class="keyboard-rows" id="keyboardRows"></div>
                    <div class="keyboard-special">
                        <button class="keyboard-key special space" data-key=" ">Space</button>
                        <button class="keyboard-key special backspace" data-key="backspace">⌫</button>
                        <button class="keyboard-key special enter" data-key="enter">↵</button>
                    </div>
                </div>
                <div class="keyboard-panel" data-panel="emoji">
                    <div class="emoji-categories">
                        ${Object.keys(EMOJI_CATEGORIES).map((cat) => `<button class="emoji-category-btn" data-category="${cat}">${cat}</button>`).join("")}
                    </div>
                    <div class="emoji-grid" id="emojiGrid"></div>
                </div>
            </div>
        </div>
    `;
}
function renderKeyboard(isUpper = false) {
	const rowsEl = getKeyboardElement()?.querySelector("#keyboardRows");
	if (!rowsEl) return;
	rowsEl.innerHTML = "";
	(isUpper ? KEYBOARD_LAYOUT_UPPER : KEYBOARD_LAYOUT).forEach((row) => {
		const rowEl = document.createElement("div");
		rowEl.className = "keyboard-row";
		row.forEach((key) => {
			const keyEl = document.createElement("button");
			keyEl.className = "keyboard-key";
			keyEl.textContent = key;
			keyEl.setAttribute("data-key", key);
			keyEl.addEventListener("click", () => handleKeyPress(key));
			rowEl.appendChild(keyEl);
		});
		rowsEl.appendChild(rowEl);
	});
}
function renderEmoji(category) {
	const gridEl = getKeyboardElement()?.querySelector("#emojiGrid");
	if (!gridEl) return;
	const emojis = EMOJI_CATEGORIES[category] || [];
	gridEl.innerHTML = "";
	emojis.forEach((emoji) => {
		const emojiEl = document.createElement("button");
		emojiEl.className = "emoji-key";
		emojiEl.textContent = emoji;
		emojiEl.setAttribute("data-emoji", emoji);
		emojiEl.addEventListener("click", () => handleKeyPress(emoji));
		gridEl.appendChild(emojiEl);
	});
}
function handleKeyPress(key) {
	if (key === "backspace") sendKeyboardChar("\b");
	else if (key === "enter") sendKeyboardChar("\n");
	else sendKeyboardChar(key);
}
function restoreButtonIcon() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	toggleButton.textContent = "⌨️";
	if (!toggleButton.isConnected) return;
	const ownerDoc = toggleButton.ownerDocument;
	if (!ownerDoc) return;
	if (ownerDoc.activeElement !== toggleButton) return;
	const textNode = toggleButton.firstChild;
	const sel = globalThis?.getSelection?.();
	if (!(textNode instanceof Text) || !sel) return;
	try {
		const range = ownerDoc.createRange();
		range.setStart(textNode, Math.min(1, toggleButton.textContent?.length ?? 0));
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	} catch {}
}
//#endregion
//#region src/frontend/views/airpad/input/keyboard/handlers.ts
/** AbortController for document-level dismiss listeners (scoped to airpad owner document). */
var keyboardDismissAbort = null;
/** Remove focus/pointer dismiss listeners (call on Airpad unmount). */
function teardownKeyboardDismissListeners() {
	try {
		keyboardDismissAbort?.abort();
	} catch {}
	keyboardDismissAbort = null;
}
var keyboardToggleClickBound = /* @__PURE__ */ new WeakSet();
var keyboardToggleApiBound = /* @__PURE__ */ new WeakSet();
var keyboardContainerUiBound = /* @__PURE__ */ new WeakSet();
/** Outside taps must not close the keyboard when interacting with these regions. */
var KEYBOARD_STAYS_OPEN_MATCHES = "input,textarea,select,[contenteditable=\"true\"]";
var KEYBOARD_STAYS_OPEN_CLOSEST = ".config-overlay, .virtual-keyboard-container, .keyboard-toggle, .view-cwsp, .view-cwsp button, .view-cwsp .big-button, .view-cwsp .neighbor-button, .log-overlay.open, .log-panel, .airpad-config-overlay";
function isKeyboardStayOpenTarget(el) {
	if (!el) return false;
	return Boolean(el.matches?.(KEYBOARD_STAYS_OPEN_MATCHES) || el.closest?.(KEYBOARD_STAYS_OPEN_CLOSEST));
}
function isConfigOverlayVisible() {
	const doc = getAirpadOwnerDocument();
	const overlay = doc?.querySelector(".airpad-config-overlay") ?? doc?.querySelector(".config-overlay");
	if (!overlay) return false;
	return overlay.style.display === "flex" || overlay.classList.contains("flex");
}
function setVkStatus(text) {
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = text;
}
function showKeyboard() {
	if (!isRemoteKeyboardEnabled()) return;
	if (isConfigOverlayVisible()) return;
	const keyboardElement = getKeyboardElement();
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (virtualKeyboardAPI) {
		if (toggleButton) {
			toggleButton.contentEditable = "true";
			toggleButton.setAttribute("virtualkeyboardpolicy", "manual");
		}
		restoreButtonIcon();
		toggleButton?.focus({ preventScroll: true });
		virtualKeyboardAPI.show();
		setVkStatus("overlay:on / policy:manual");
	} else {
		setKeyboardVisible(true);
		keyboardElement?.classList?.add?.("visible");
		setVkStatus("overlay:off");
	}
	renderKeyboard(false);
	renderEmoji("smileys");
}
var isHidingKeyboard = false;
function hideKeyboard() {
	if (isHidingKeyboard) return;
	isHidingKeyboard = true;
	try {
		const keyboardElement = getKeyboardElement();
		const virtualKeyboardAPI = getVirtualKeyboardAPI();
		const toggleButton = getToggleButton();
		setKeyboardVisible(false);
		keyboardElement?.classList?.remove?.("visible");
		if (virtualKeyboardAPI) {
			restoreButtonIcon();
			virtualKeyboardAPI.hide();
			if (toggleButton) {
				toggleButton.contentEditable = "false";
				toggleButton.removeAttribute("virtualkeyboardpolicy");
			}
			toggleButton?.blur();
			setVkStatus("overlay:on / policy:auto");
		}
	} finally {
		isHidingKeyboard = false;
	}
}
function toggleKeyboard() {
	if (isKeyboardVisible()) hideKeyboard();
	else showKeyboard();
}
function setupToggleButtonHandler() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	if (keyboardToggleClickBound.has(toggleButton)) return;
	keyboardToggleClickBound.add(toggleButton);
	toggleButton.addEventListener("click", (e) => {
		stopBubbling(e);
		if (!isRemoteKeyboardEnabled()) {
			log("Keyboard is available after WS connection");
			return;
		}
		if (isConfigOverlayVisible()) return;
		toggleKeyboard();
	});
}
function setupVirtualKeyboardAPIHandlers() {
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (!virtualKeyboardAPI || !toggleButton) return;
	if (keyboardToggleApiBound.has(toggleButton)) return;
	keyboardToggleApiBound.add(toggleButton);
	const ICON = "⌨️";
	let pendingRestore = null;
	let lastHandledKey = null;
	let lastHandledTime = 0;
	const DEDUP_WINDOW_MS = 20;
	let waitingForInput = false;
	let lastKnownContent = ICON;
	let beforeInputFired = false;
	let isComposing = false;
	let lastCompositionText = "";
	let compositionTimeout = null;
	const COMPOSITION_TIMEOUT_MS = 600;
	const resetCompositionState = (immediate = false) => {
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		if (immediate) {
			isComposing = false;
			lastCompositionText = "";
		} else compositionTimeout = globalThis.setTimeout(() => {
			isComposing = false;
			lastCompositionText = "";
			compositionTimeout = null;
		}, COMPOSITION_TIMEOUT_MS);
	};
	const shouldSkipDuplicate = (key) => {
		const normalizedKey = key.includes(":") ? key.split(":").slice(1).join(":") : key;
		const now = Date.now();
		if (lastHandledKey === normalizedKey && now - lastHandledTime < DEDUP_WINDOW_MS) return true;
		lastHandledKey = normalizedKey;
		lastHandledTime = now;
		return false;
	};
	const scheduleRestore = () => {
		queueMicrotask(() => {
			pendingRestore = null;
			restoreButtonIcon();
			lastKnownContent = ICON;
		});
	};
	const sendAndRestore = (char) => {
		if (!isRemoteKeyboardEnabled()) return;
		sendKeyboardChar(char);
		scheduleRestore();
	};
	const TEXT_STREAM_CHUNK_SIZE = 256;
	const TEXT_STREAM_SOFT_LIMIT = 12e3;
	const TEXT_STREAM_HARD_LIMIT = 12e4;
	let streamToken = 0;
	const toUnicodeUnits = (text) => Array.from(String(text || ""));
	const sendTextChunked = (text, dedupeKey) => {
		const raw = String(text || "");
		if (!raw) {
			scheduleRestore();
			return;
		}
		if (dedupeKey && shouldSkipDuplicate(dedupeKey)) {
			scheduleRestore();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Input truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large input (${safeUnits.length} chars) in chunks.`);
		const token = ++streamToken;
		let index = 0;
		const pump = () => {
			if (token !== streamToken) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			scheduleRestore();
		};
		pump();
	};
	/** IME/composition: cancel in-flight chunked sends when a new update arrives (latest wins). */
	let compositionPumpGen = 0;
	const sendCompositionTextChunked = (text, onDone) => {
		const raw = String(text || "");
		if (!raw) {
			onDone?.();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition text truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large composition input (${safeUnits.length} chars) in chunks.`);
		const gen = compositionPumpGen;
		let index = 0;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionBackspacesChunked = (count, onDone) => {
		if (count <= 0) {
			onDone?.();
			return;
		}
		const gen = compositionPumpGen;
		let remaining = count;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const n = Math.min(remaining, TEXT_STREAM_CHUNK_SIZE);
			for (let i = 0; i < n; i++) sendKeyboardChar("\b");
			remaining -= n;
			if (remaining > 0) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionReplaceChunked = (backspaceCount, newText, onDone) => {
		let t = String(newText || "");
		if (t.length > TEXT_STREAM_HARD_LIMIT) {
			t = t.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition replacement truncated to ${TEXT_STREAM_HARD_LIMIT} chars.`);
		}
		sendCompositionBackspacesChunked(backspaceCount, () => {
			if (!t) {
				onDone();
				return;
			}
			sendCompositionTextChunked(t, onDone);
		});
	};
	/** Small IME deltas stay synchronous to preserve ordering with lastCompositionText. */
	const COMPOSITION_INLINE_MAX = 256;
	const getCleanText = (text) => {
		return text.replace(/⌨️/g, "").replace(/⌨\uFE0F?/g, "").replace(/\uFE0F/g, "");
	};
	const findNewCharacters = (currentText, previousText) => {
		const cleanCurrent = getCleanText(currentText);
		const cleanPrevious = getCleanText(previousText);
		if (cleanCurrent.startsWith(cleanPrevious)) return cleanCurrent.slice(cleanPrevious.length);
		if (cleanPrevious.startsWith(cleanCurrent)) return "";
		return cleanCurrent;
	};
	toggleButton.addEventListener("keydown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (e.isComposing) {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (isComposing && !e.isComposing) resetCompositionState(true);
		beforeInputFired = false;
		if ((e.ctrlKey || e.metaKey) && !e.altKey) {
			const lowerKey = String(e.key || "").toLowerCase();
			if (lowerKey === "c" || lowerKey === "x") {
				e.preventDefault();
				waitingForInput = false;
				resetCompositionState(true);
				return;
			}
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("backspace")) sendAndRestore("\b");
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			if (!shouldSkipDuplicate("enter")) sendAndRestore("\n");
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("tab")) sendAndRestore("	");
			return;
		}
		if (e.key === "Unidentified" || e.key === "Process" || e.key === "") {
			waitingForInput = true;
			lastKnownContent = toggleButton.textContent || ICON;
			return;
		}
		if (e.key === " ") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			return;
		}
		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			waitingForInput = false;
			return;
		}
		waitingForInput = false;
	});
	toggleButton.addEventListener("beforeinput", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		lastKnownContent = toggleButton.textContent || ICON;
		beforeInputFired = true;
		if (inputEvent.inputType === "insertCompositionText") {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (inputEvent.inputType === "insertText" && isComposing) resetCompositionState(true);
		if (waitingForInput && inputEvent.inputType === "insertText" && inputEvent.data) {
			e.preventDefault();
			waitingForInput = false;
			sendTextChunked(inputEvent.data, `text:${inputEvent.data}`);
			return;
		}
		if (inputEvent.inputType === "insertText") {
			e.preventDefault();
			const data = inputEvent.data;
			if (data) sendTextChunked(data, `text:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertReplacementText") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text");
			if (data) sendTextChunked(data, `replace:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertLineBreak" || inputEvent.inputType === "insertParagraph") {
			e.preventDefault();
			resetCompositionState(true);
			if (!shouldSkipDuplicate("linebreak")) sendAndRestore("\n");
			return;
		}
		if (inputEvent.inputType === "deleteContentBackward" || inputEvent.inputType === "deleteContentForward") {
			e.preventDefault();
			if (!shouldSkipDuplicate("deleteback")) sendAndRestore("\b");
			return;
		}
		if (inputEvent.inputType === "insertFromPaste") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text/plain");
			if (data) sendTextChunked(data);
			return;
		}
	});
	toggleButton.addEventListener("compositionstart", () => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = true;
		lastCompositionText = "";
		waitingForInput = false;
		compositionPumpGen++;
	});
	toggleButton.addEventListener("compositionupdate", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const currentText = e.data || "";
		const finishUpdate = () => {
			lastCompositionText = currentText;
			scheduleRestore();
		};
		if (currentText.startsWith(lastCompositionText)) {
			const newChars = currentText.slice(lastCompositionText.length);
			if (newChars.length > 0) if (newChars.length <= COMPOSITION_INLINE_MAX) {
				for (const char of newChars) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionTextChunked(newChars, finishUpdate);
			else finishUpdate();
		} else if (lastCompositionText.startsWith(currentText)) {
			const deletedCount = toUnicodeUnits(lastCompositionText).length - toUnicodeUnits(currentText).length;
			if (deletedCount <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < deletedCount; i++) sendKeyboardChar("\b");
				finishUpdate();
			} else sendCompositionBackspacesChunked(deletedCount, finishUpdate);
		} else {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const nextLength = toUnicodeUnits(currentText).length;
			if (bs <= COMPOSITION_INLINE_MAX && nextLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of currentText) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionReplaceChunked(bs, currentText, finishUpdate);
		}
	});
	toggleButton.addEventListener("compositionend", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const finalText = e.data || "";
		const finishEnd = () => {
			isComposing = false;
			lastCompositionText = "";
			scheduleRestore();
		};
		if (finalText !== lastCompositionText) {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const finalLength = toUnicodeUnits(finalText).length;
			if (bs <= COMPOSITION_INLINE_MAX && finalLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of finalText) sendKeyboardChar(char);
				finishEnd();
			} else sendCompositionReplaceChunked(bs, finalText, finishEnd);
		} else finishEnd();
	});
	toggleButton.addEventListener("input", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		if (inputEvent.inputType === "insertCompositionText" || inputEvent.inputType?.includes("Composition")) return;
		if (isComposing) return;
		const currentText = e.target.textContent || "";
		if (waitingForInput) {
			waitingForInput = false;
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`unidentified:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		if (!beforeInputFired) {
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`input:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		scheduleRestore();
		beforeInputFired = false;
	});
	toggleButton.addEventListener("paste", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const pastedText = e.clipboardData?.getData("text") || "";
		if (pastedText) sendTextChunked(pastedText);
	});
	toggleButton.addEventListener("drop", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const droppedText = e.dataTransfer?.getData("text") || "";
		if (droppedText) {
			sendTextChunked(droppedText);
			return;
		}
		scheduleRestore();
	});
	toggleButton.addEventListener("blur", () => {
		if (pendingRestore !== null) {
			clearTimeout(pendingRestore);
			pendingRestore = null;
		}
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = false;
		lastCompositionText = "";
		waitingForInput = false;
		lastHandledKey = null;
		beforeInputFired = false;
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
	toggleButton.addEventListener("focus", () => {
		lastHandledKey = null;
		lastHandledTime = 0;
		waitingForInput = false;
		beforeInputFired = false;
		isComposing = false;
		lastCompositionText = "";
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
}
function setupKeyboardUIHandlers() {
	const keyboardElement = getKeyboardElement();
	if (!keyboardElement) return;
	if (!keyboardContainerUiBound.has(keyboardElement)) {
		keyboardContainerUiBound.add(keyboardElement);
		keyboardElement.querySelector(".keyboard-close")?.addEventListener("click", hideKeyboard);
		const tabs = keyboardElement.querySelectorAll(".keyboard-tab");
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const targetTab = tab.getAttribute("data-tab");
				tabs.forEach((t) => t.classList.remove("active"));
				tab.classList.add("active");
				(keyboardElement?.querySelectorAll(".keyboard-panel"))?.forEach((panel) => {
					panel.classList.remove("active");
					if (panel.getAttribute("data-panel") === targetTab) panel.classList.add("active");
				});
			});
		});
		const shiftBtn = keyboardElement.querySelector(".keyboard-shift");
		let isUpper = false;
		shiftBtn?.addEventListener("click", () => {
			isUpper = !isUpper;
			renderKeyboard(isUpper);
			shiftBtn.classList.toggle("active", isUpper);
		});
		const categoryBtns = keyboardElement.querySelectorAll(".emoji-category-btn");
		if (categoryBtns.length > 0) {
			const firstBtn = categoryBtns[0];
			firstBtn.classList.add("active");
			const firstCategory = firstBtn.getAttribute("data-category");
			if (firstCategory) renderEmoji(firstCategory);
			categoryBtns.forEach((btn) => {
				btn.addEventListener("click", () => {
					const category = btn.getAttribute("data-category");
					if (category) {
						categoryBtns.forEach((b) => b.classList.remove("active"));
						btn.classList.add("active");
						renderEmoji(category);
					}
				});
			});
		}
		keyboardElement.addEventListener("click", (e) => {
			if (e.target === keyboardElement) hideKeyboard();
		});
	}
	const doc = getAirpadOwnerDocument();
	if (!doc) return;
	teardownKeyboardDismissListeners();
	keyboardDismissAbort = new AbortController();
	const { signal } = keyboardDismissAbort;
	doc.addEventListener("focusout", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		const fromEl = eventTargetElement(e);
		const rel = e.relatedTarget;
		const toEl = rel instanceof HTMLElement ? rel : null;
		if (!(isKeyboardStayOpenTarget(fromEl) || isKeyboardStayOpenTarget(toEl))) hideKeyboard();
	}, { signal });
	doc.addEventListener("pointerdown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		if (!isKeyboardStayOpenTarget(eventTargetElement(e))) hideKeyboard();
	}, {
		capture: false,
		passive: true,
		signal
	});
}
//#endregion
//#region src/frontend/views/airpad/input/virtual-keyboard.ts
function updateToggleButtonEnabledState(enabled) {
	const toggleButton = getToggleButton();
	if (!(toggleButton instanceof HTMLButtonElement)) return;
	toggleButton.disabled = false;
	toggleButton.setAttribute("aria-disabled", String(!enabled));
	toggleButton.classList.toggle("is-disabled", !enabled);
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = `${(vkStatusEl.textContent || "overlay:off").replace(/\s*\/\s*remote:(on|off)\s*$/i, "")} / remote:${enabled ? "on" : "off"}`;
}
function setRemoteKeyboardEnabled(enabled) {
	setRemoteKeyboardEnabled$1(enabled);
	updateToggleButtonEnabledState(enabled);
	if (!enabled) hideKeyboard();
}
/**
* @param mountRoot — node under which Airpad markup was mounted (e.g. `[data-cwsp-content]`).
*   Resolves `.view-cwsp` for portal placement; prefers mount root / `getAirpadDomRoot()` over global document queries.
*/
function initVirtualKeyboard(mountRoot) {
	initVirtualKeyboardAPI();
	const hasAPI = hasVirtualKeyboardAPI();
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = hasAPI ? "overlay:on / policy:auto" : "overlay:off";
	const scoped = getAirpadDomRoot();
	const container = mountRoot?.closest?.(".view-cwsp") ?? mountRoot ?? scoped?.closest?.(".view-cwsp") ?? scoped ?? document.body;
	let keyboardElement = container.querySelector(".virtual-keyboard-container");
	if (!keyboardElement) {
		const keyboardHTML = createKeyboardHTML();
		container.insertAdjacentHTML("beforeend", keyboardHTML);
		keyboardElement = container.querySelector(".virtual-keyboard-container");
	}
	if (!keyboardElement) {
		log("Failed to create keyboard element");
		return;
	}
	keyboardElement.classList.remove("visible");
	setKeyboardElement(keyboardElement);
	const toggleContainer = container.querySelector(".bottom-toolbar") ?? container;
	let toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	if (!toggleButton) {
		const toggleHTML = hasAPI ? "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" contenteditable=\"false\" virtualkeyboardpolicy=\"manual\" class=\"keyboard-toggle keyboard-toggle-editable\" aria-label=\"Toggle keyboard\">⌨️</button>" : "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" class=\"keyboard-toggle\" aria-label=\"Toggle keyboard\">⌨️</button>";
		toggleContainer.insertAdjacentHTML("beforeend", toggleHTML);
		toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	}
	if (!toggleButton) {
		log("Failed to create toggle button");
		return;
	}
	toggleButton.autofocus = false;
	toggleButton.removeAttribute("autofocus");
	if (toggleButton instanceof HTMLElement) {
		toggleButton.setAttribute("autocapitalize", "off");
		toggleButton.setAttribute("autocorrect", "off");
		toggleButton.setAttribute("spellcheck", "false");
	}
	setToggleButton(toggleButton);
	setRemoteKeyboardEnabled(false);
	setupToggleButtonHandler();
	setupVirtualKeyboardAPIHandlers();
	setupKeyboardUIHandlers();
	log("Virtual keyboard initialized");
}
//#endregion
//#region src/frontend/views/airpad/ui/clipboard-toolbar.ts
var unsubscribeClipboardUpdate = null;
var boundCopyButtons = /* @__PURE__ */ new WeakSet();
var boundCutButtons = /* @__PURE__ */ new WeakSet();
var boundPasteButtons = /* @__PURE__ */ new WeakSet();
/** Call when Airpad unmounts so a fresh DOM gets listeners on next mount. */
function resetClipboardToolbarState() {
	if (unsubscribeClipboardUpdate) {
		unsubscribeClipboardUpdate();
		unsubscribeClipboardUpdate = null;
	}
}
function setPreview(text, meta) {
	const clipboardPreviewEl = getClipboardPreviewEl();
	if (!clipboardPreviewEl || typeof clipboardPreviewEl === "undefined") return;
	const source = meta?.source ? String(meta.source) : "pc";
	const safeText = String(text ?? "");
	if (!safeText) {
		clipboardPreviewEl.classList.remove("visible");
		clipboardPreviewEl.innerHTML = "";
		return;
	}
	clipboardPreviewEl.innerHTML = `
        <div class="meta">Clipboard (${source})</div>
        <div class="text"></div>
    `;
	const textEl = clipboardPreviewEl.querySelector(".text");
	if (textEl) textEl.textContent = safeText;
	clipboardPreviewEl.classList.add("visible");
}
async function readPhoneClipboardText() {
	const nav = navigator;
	if (nav?.clipboard?.readText) return await nav.clipboard.readText();
	return globalThis?.prompt?.("Вставь текст из телефона (clipboard readText недоступен):", "") || "";
}
async function tryWritePhoneClipboardText(text) {
	const nav = navigator;
	if (nav?.clipboard?.writeText) try {
		await nav.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
	return false;
}
function initClipboardToolbar() {
	const btnCut = getBtnCut();
	const btnCopy = getBtnCopy();
	const btnPaste = getBtnPaste();
	if (unsubscribeClipboardUpdate) unsubscribeClipboardUpdate();
	unsubscribeClipboardUpdate = onAirPadRemoteClipboardUpdate((text, meta) => setPreview(text, meta));
	requestAirPadClipboardRead().then((res) => {
		if (res?.ok && typeof res.text === "string") setPreview(res.text, { source: "pc" });
	});
	if (btnCopy && !boundCopyButtons.has(btnCopy)) {
		boundCopyButtons.add(btnCopy);
		btnCopy.addEventListener("click", async () => {
			const res = await requestAirPadClipboardCopy();
			if (!res?.ok) {
				log("Copy failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			if (!await tryWritePhoneClipboardText(text)) log("PC clipboard received. If phone clipboard write is blocked, copy from the preview line.");
		});
	}
	if (btnCut && !boundCutButtons.has(btnCut)) {
		boundCutButtons.add(btnCut);
		btnCut.addEventListener("click", async () => {
			const res = await requestAirPadClipboardCut();
			if (!res?.ok) {
				log("Cut failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			if (!await tryWritePhoneClipboardText(text)) log("PC clipboard received (after cut). If phone clipboard write is blocked, copy from the preview line.");
		});
	}
	if (btnPaste && !boundPasteButtons.has(btnPaste)) {
		boundPasteButtons.add(btnPaste);
		btnPaste.addEventListener("click", async () => {
			const text = await readPhoneClipboardText();
			if (!text) {
				log("Paste: phone clipboard is empty (or permission denied).");
				return;
			}
			const res = await requestAirPadClipboardPaste(text);
			if (!res?.ok) {
				log("Paste failed: " + (res?.error || "unknown"));
				return;
			}
			setPreview(text, { source: "phone" });
		});
	}
}
//#endregion
//#region src/frontend/views/airpad/ui/config-ui.ts
/** Marker for teardown; do not reuse generic `.config-overlay` alone (other features could add one). */
var AIRPAD_CONFIG_MARKER = "airpad-config-overlay";
/**
* Mount on the owner `document.body` (not `cw-shell-minimal` / task-tab host).
* Minimal shell uses `contain: strict` + `overflow: hidden`; children with `position: fixed`
* are still clipped to that host, so the dialog stays in the DOM but is not visible.
*/
function getConfigOverlayMountParent() {
	const doc = getAirpadOwnerDocument() ?? document;
	return doc.body ?? doc.documentElement ?? document.body;
}
/** Body-portaled overlay is not under `[data-shell][data-theme]`, so copy theme for SCSS tokens. */
function syncAirpadConfigOverlayShellTheme(overlay, doc) {
	const theme = (doc.querySelector("cw-shell-minimal[data-theme]") ?? doc.querySelector("[data-shell-system=\"task-tab\"][data-theme]") ?? doc.querySelector("[data-shell][data-theme]"))?.getAttribute("data-theme");
	if (theme === "light" || theme === "dark") overlay.setAttribute("data-theme", theme);
	else overlay.removeAttribute("data-theme");
}
function createConfigUI() {
	const overlay = (getAirpadOwnerDocument() ?? document).createElement("div");
	overlay.className = `config-overlay ${AIRPAD_CONFIG_MARKER}`;
	overlay.innerHTML = `
        <div class="config-panel">
            <h3>Airpad Configuration</h3>
            <div class="config-panel__body">
                <div class="config-group">
                    <label for="airpadQuickConnect"><strong>Where to connect</strong>:</label>
                    <input
                        type="text"
                        id="airpadQuickConnect"
                        name="airpad-quick-connect"
                        placeholder="L-192.168.0.110 or https://192.168.0.110:8443/"
                    />
                    <label for="airpadAuthPass"><strong>Auth pass token</strong> (optional):</label>
                    <input
                        type="password"
                        id="airpadAuthPass"
                        name="airpad-auth-pass"
                        autocomplete="off"
                        placeholder="If the remote requires a control token for input/mouse"
                    />
                    <div class="field-hint">
                        Target device ID or URL:port. Default identity and tokens stay in Settings → Server; set an auth pass here when the peer rejects control without it.
                    </div>
                </div>
            </div>

            <div class="config-actions">
                <button id="saveConfig" type="button" name="airpad-config-save">Save & Reconnect</button>
                <button id="cancelConfig" type="button" name="airpad-config-cancel">Cancel</button>
            </div>
        </div>
    `;
	const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
	const authPassInput = overlay.querySelector("#airpadAuthPass");
	const saveButton = overlay.querySelector("#saveConfig");
	const cancelButton = overlay.querySelector("#cancelConfig");
	quickConnectInput.value = getAirPadQuickConnectTarget();
	authPassInput.value = getAccessToken();
	const closeOverlay = () => {
		overlay.classList.remove("flex");
		overlay.style.display = "none";
		overlay.setAttribute("aria-hidden", "true");
	};
	saveButton.addEventListener("click", () => {
		setAirPadQuickConnectTarget(quickConnectInput.value);
		setAccessToken(authPassInput.value);
		reconnectAirPadSessionAfterConfigChange({ delayMs: 100 });
		closeOverlay();
	});
	cancelButton.addEventListener("click", closeOverlay);
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeOverlay();
	});
	return overlay;
}
function showConfigUI() {
	try {
		hideKeyboard();
	} catch {}
	const doc = getAirpadOwnerDocument() ?? document;
	const host = getConfigOverlayMountParent();
	let overlay = doc.querySelector(`.${AIRPAD_CONFIG_MARKER}`);
	if (overlay && overlay.parentElement !== host) {
		overlay.remove();
		overlay = null;
	}
	if (!overlay) {
		overlay = createConfigUI();
		host.appendChild(overlay);
	} else {
		const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
		const authPassInput = overlay.querySelector("#airpadAuthPass");
		if (quickConnectInput) quickConnectInput.value = getAirPadQuickConnectTarget();
		if (authPassInput) authPassInput.value = getAccessToken();
	}
	syncAirpadConfigOverlayShellTheme(overlay, doc);
	overlay.classList.add("flex");
	overlay.style.display = "flex";
	overlay.style.zIndex = "120000";
	overlay.setAttribute("aria-hidden", "false");
}
/** Remove portaled overlay when Airpad unmounts (avoids stale node on body/shell). */
function teardownAirpadConfigOverlay() {
	(getAirpadOwnerDocument() ?? document).querySelectorAll(`.${AIRPAD_CONFIG_MARKER}`).forEach((el) => el.remove());
}
//#endregion
//#region src/frontend/views/airpad/component/AirpadEventBus.ts
var AirpadEventBus = class {
	handlers = /* @__PURE__ */ new Map();
	on(event, handler) {
		const existing = this.handlers.get(event) ?? /* @__PURE__ */ new Set();
		existing.add(handler);
		this.handlers.set(event, existing);
		return () => this.off(event, handler);
	}
	off(event, handler) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		existing.delete(handler);
		if (existing.size === 0) this.handlers.delete(event);
	}
	emit(event, payload) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		for (const handler of existing) handler(payload);
	}
	clear() {
		this.handlers.clear();
	}
};
//#endregion
//#region src/frontend/views/airpad/component/CwAirpadActionRail.ts
var TAG$1 = "cw-airpad-action-rail";
var CwAirpadActionRailElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		this.addEventListener("click", (e) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (!this.contains(t)) return;
			if (t.closest("#btnConfig")) bus.emit("ui.config.open", void 0);
			if (t.closest("#btnAdminDoor")) bus.emit("ui.admin.open", void 0);
		}, {
			capture: true,
			signal
		});
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#clipboardToolbar")) return;
		this.innerHTML = `
            <div class="bottom-toolbar" id="clipboardToolbar" aria-label="Clipboard actions">
                <button type="button" id="btnCut" name="airpad-clipboard-cut" class="toolbar-btn" aria-label="Cut (Ctrl+X)">✂️</button>
                <button type="button" id="btnCopy" name="airpad-clipboard-copy" class="toolbar-btn" aria-label="Copy (Ctrl+C)">📋</button>
                <button type="button" id="btnPaste" name="airpad-clipboard-paste" class="toolbar-btn" aria-label="Paste (Ctrl+V)">📥</button>
                <button type="button" id="btnConnect" name="airpad-ws-connect" class="toolbar-btn connect-fab connect-fab--ws">WS ↔</button>
                <button type="button" id="btnAdminDoor" name="airpad-admin-door" class="toolbar-btn toolbar-btn--admin-door" aria-label="Open server admin (HTTPS)" title="Server admin (HTTPS :8443)">ADM</button>
                <button type="button" id="btnConfig" name="airpad-config" class="toolbar-btn" aria-label="Configuration" title="Configuration">⚙️</button>
            </div>
            <div id="clipboardPreview" class="clipboard-preview" aria-live="polite"></div>
        `;
	}
};
function ensureCwAirpadActionRailDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG$1)) return;
	ce.define(TAG$1, CwAirpadActionRailElement);
}
//#endregion
//#region src/frontend/views/airpad/component/CwAirpadSidePanels.ts
var TAG = "cw-airpad-side-panels";
var CwAirpadSidePanelsElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		const byId = (id) => this.querySelector(`#${CSS.escape(id)}`);
		const hookOverlay = (toggleId, overlayId, closeId) => {
			const overlay = byId(overlayId);
			const toggle = byId(toggleId);
			const close = byId(closeId);
			if (!overlay || !toggle) return;
			const openOverlay = () => {
				overlay.classList.add("open");
				overlay.setAttribute("aria-hidden", "false");
				toggle.setAttribute("aria-expanded", "true");
			};
			const closeOverlay = () => {
				overlay.classList.remove("open");
				overlay.setAttribute("aria-hidden", "true");
				toggle.setAttribute("aria-expanded", "false");
			};
			toggle.addEventListener("click", openOverlay, { signal });
			close?.addEventListener("click", closeOverlay, { signal });
			overlay.addEventListener("click", (e) => {
				if (e.target === overlay) closeOverlay();
			}, { signal });
			this.addEventListener("keydown", (e) => {
				if (e.key === "Escape" && overlay.classList.contains("open")) closeOverlay();
			}, {
				capture: true,
				signal
			});
		};
		hookOverlay("logToggle", "logOverlay", "logClose");
		hookOverlay("hintToggle", "hintOverlay", "hintClose");
		byId("btnReload")?.addEventListener("click", () => bus.emit("ui.reload.request", void 0), { signal });
		byId("btnMotionReset")?.addEventListener("click", () => bus.emit("ui.motion.reset", void 0), { signal });
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#logOverlay")) return;
		this.innerHTML = `
            <div class="side-actions-row" role="group" aria-label="Panels">
                <button type="button" id="hintToggle" name="airpad-hints-toggle" class="side-log-toggle side-hint-toggle" aria-controls="hintOverlay" aria-expanded="false">Hints</button>
                <button type="button" id="logToggle" name="airpad-log-toggle" class="side-log-toggle" aria-controls="logOverlay" aria-expanded="false">Логи</button>
                <button type="button" id="btnMotionReset" name="airpad-motion-reset" class="side-log-toggle side-fix-toggle" aria-label="Reset motion calibration">Fix</button>
                <button type="button" id="btnReload" name="airpad-reload" class="side-log-toggle side-reload-toggle" aria-label="Reload">Reload</button>
            </div>

            <div id="logOverlay" class="log-overlay" aria-hidden="true">
                <div class="log-panel">
                    <div class="log-overlay-header">
                        <span>Журнал соединения</span>
                        <button type="button" id="logClose" name="airpad-log-close" class="ghost-btn" aria-label="Закрыть логи">Закрыть</button>
                    </div>
                    <div id="logContainer" class="log-container"></div>
                </div>
            </div>

            <div id="hintOverlay" class="log-overlay hint-overlay" aria-hidden="true">
                <div class="log-panel hint-panel">
                    <div class="log-overlay-header">
                        <span>Подсказки AirPad</span>
                        <button type="button" id="hintClose" name="airpad-hint-close" class="ghost-btn" aria-label="Закрыть подсказки">Закрыть</button>
                    </div>
                    <section class="hint hint-modal-content" id="hintPanel" aria-label="Airpad quick help">
                        <details class="hint-group" data-hint-group>
                            <summary>Жесты Air-кнопки</summary>
                            <ul><li>Короткий тап — клик.</li><li>Удержание &gt; 100ms — режим air-мыши.</li><li>Свайп вверх/вниз по кнопке — скролл.</li><li>Свайп влево/вправо — жест.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>AI-кнопка</summary>
                            <ul><li>Нажми и держи — идёт распознавание речи.</li><li>Отпусти — команда уйдёт в endpoint voice pipeline.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>Виртуальная клавиатура</summary>
                            <ul><li>Открой кнопкой ⌨️ на нижней панели.</li><li>Поддерживает текст, эмодзи и спецсимволы.</li><li>Передаёт ввод в бинарном формате.</li></ul>
                        </details>
                    </section>
                </div>
            </div>
        `;
	}
};
function ensureCwAirpadSidePanelsDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG)) return;
	ce.define(TAG, CwAirpadSidePanelsElement);
}
//#endregion
//#region src/frontend/views/airpad/main.ts
/**
* AirPad frontend entrypoint.
*
* This module owns the mount/unmount lifecycle for the AirPad view, including
* DOM replacement, transient controller wiring, cross-tab config sync, and the
* teardown path required for shell remounts.
*/
var unsubscribeWsKeyboardSync = null;
var airpadInitToken = 0;
var airpadInitAbort = null;
var airpadCrossTabUnsub = null;
/**
* Release every side effect created by `mountAirpad()`.
*
* WHY: AirPad can be mounted repeatedly by different shells or navigation
* flows. The view keeps process-local listeners and UI overlays, so remounting
* without explicit cleanup would duplicate handlers and leave stale state
* attached to the previous DOM tree.
*/
function unmountAirpadRuntime() {
	teardownKeyboardDismissListeners();
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	airpadInitAbort = null;
	airpadCrossTabUnsub?.();
	airpadCrossTabUnsub = null;
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = null;
	resetClipboardToolbarState();
	teardownAirpadConfigOverlay();
	setAirpadDomRoot(null);
	setRemoteKeyboardEnabled(false);
	stopRelativeOrientation();
}
/**
* Build the AirPad DOM and hand control to the async runtime initializer.
*
* INVARIANT: each mount gets a fresh abort signal and token so slow async work
* from an older mount cannot finish against a newer DOM instance.
*/
async function mountAirpad(mountElement) {
	console.log("[Airpad] Mounting airpad app...");
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	const initController = new AbortController();
	airpadInitAbort = initController;
	/** Stable for this mount — do not read `airpadInitAbort.signal` after `await`: unmount may set `airpadInitAbort` to null. */
	const initSignal = initController.signal;
	const currentInitToken = airpadInitToken;
	ensureCwAirpadActionRailDefined();
	ensureCwAirpadSidePanelsDefined();
	let appContainer = mountElement ?? document.body.querySelector("#app") ?? document.body;
	if (!appContainer) {
		appContainer = document.createElement("div");
		appContainer.id = "app";
	}
	appContainer.replaceChildren(H`
        <div class="container">
            <header class="hero">
                <div class="status-container">
                    <div class="status-bar">
                        <div class="status-item">
                            WS:
                            <span id="wsStatus" class="value ws-status-bad">disconnected</span>
                        </div>
                        <div class="status-item">
                            Air:
                            <span id="airStatus" class="value">IDLE</span>
                        </div>
                        <div class="status-item">
                            AI:
                            <span id="aiStatus" class="value">idle</span>
                        </div>
                        <div class="status-item">
                            VK:
                            <span id="vkStatus" class="value">overlay:off</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="stage">
                <div class="ai-block">
                    <div id="aiButton" name="airpad-ai" class="big-button ai" data-no-virtual-keyboard="true">
                        AI
                    </div>
                    <div class="label">Голосовой ассистент (удерживай для записи)</div>
                </div>

                <div class="air-block">
                    <div class="air-row">
                    <button type="button" id="airButton" name="airpad-air" class="big-button air" data-no-virtual-keyboard="true">
                        Air
                    </button>
                    <button type="button" id="airNeighborButton" name="airpad-neighbor-act" data-no-virtual-keyboard="true"
                        class="neighbor-button">Act</button>
                    </div>
                    <div class="label">Air‑трекбол/курсор и жесты</div>
                </div>
            </div>
            <div id="voiceText" class="voice-line"></div>
        </div>

        <cw-airpad-side-panels></cw-airpad-side-panels>
        <cw-airpad-action-rail></cw-airpad-action-rail>
    `);
	setAirpadDomRoot(appContainer);
	await waitForDomPaint();
	if (initSignal.aborted || currentInitToken !== airpadInitToken) {
		if (getAirpadDomRoot() === appContainer) setAirpadDomRoot(null);
		return;
	}
	await initAirpadApp(currentInitToken, initSignal, appContainer);
}
/**
* Wire controllers, UI components, and runtime services after the DOM exists.
*
* AI-READ: this function assumes the markup inserted by `mountAirpad()` is now
* stable in the document. Querying or binding before `waitForDomPaint()` can
* miss nodes in some shell/layout combinations.
*/
async function initAirpadApp(initToken, signal, domMountRoot) {
	const root = domMountRoot;
	if (!root) {
		console.warn("[Airpad] initAirpadApp: no mount root");
		return;
	}
	const byId = (id) => queryAirpad(`#${CSS.escape(id)}`);
	const bus = new AirpadEventBus();
	const sidePanels = root.querySelector("cw-airpad-side-panels");
	const actionRail = root.querySelector("cw-airpad-action-rail");
	sidePanels?.connect(bus);
	actionRail?.connect(bus);
	signal.addEventListener("abort", () => {
		sidePanels?.disconnect();
		actionRail?.disconnect();
		bus.clear();
	}, { once: true });
	const bindBus = (event, handler) => {
		const off = bus.on(event, handler);
		signal.addEventListener("abort", off, { once: true });
	};
	/** Reset all motion-calibration state so the next gesture starts from a clean baseline. */
	function resetMotionRuntime() {
		resetMotionAccum();
		resetMotionBaseline();
		resetRelativeOrientationRuntimeState();
		log("Motion runtime state reset (recalibrated).");
	}
	bindBus("ui.config.open", () => showConfigUI());
	bindBus("ui.motion.reset", () => resetMotionRuntime());
	bindBus("ui.reload.request", () => {
		try {
			globalThis?.location?.reload?.();
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.navigate?.("airpad");
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.reload?.();
		} catch (e) {
			console.error(e);
		}
	});
	/**
	* Collapse hint groups on tighter screens so the control surface remains
	* usable without hiding the hints entirely.
	*/
	function initAdaptiveHintPanel() {
		const hintRoot = byId("hintPanel");
		if (!hintRoot) return;
		const groups = Array.from(hintRoot.querySelectorAll("[data-hint-group]"));
		if (groups.length === 0) return;
		const compactMedia = globalThis.matchMedia("(max-width: 980px), (max-height: 860px)");
		const applyHintDensity = () => {
			const compact = compactMedia.matches;
			groups.forEach((group) => {
				if (compact) group.open = false;
			});
		};
		applyHintDensity();
		compactMedia.addEventListener?.("change", applyHintDensity, { signal });
	}
	const safeToString = (value) => {
		if (value instanceof Error) return `${value.name}: ${value.message}`;
		if (typeof value === "string") return value;
		return String(value);
	};
	const runInitializer = (label, initializer) => {
		try {
			initializer();
		} catch (error) {
			log(`Airpad init [${label}] failed: ${safeToString(error)}`);
		}
	};
	const aborted = () => Boolean(signal.aborted || initToken !== void 0 && initToken !== airpadInitToken);
	if (aborted()) return;
	reloadAirpadRemoteConfigFromStorage();
	airpadCrossTabUnsub ??= attachAirpadCrossTabConfigSync();
	runInitializer("websocket button", () => initAirPadSessionTransport(getBtnConnect()));
	runInitializer("speech", () => initSpeechRecognition());
	runInitializer("AI button", () => initAiButton());
	runInitializer("Air button", () => initAirButton());
	runInitializer("virtual keyboard", () => initVirtualKeyboard(root));
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = onAirPadSessionConnectionChange((connected) => {
		setRemoteKeyboardEnabled(connected);
	});
	runInitializer("clipboard toolbar", () => initClipboardToolbar());
	runInitializer("adaptive hint", () => initAdaptiveHintPanel());
	log("Готово. Нажми \"WS Connect\", затем используй Air/AI кнопки.");
	log("Движение мыши основано только на Gyroscope API (повороты телефона).");
	const startSensors = () => {
		if (aborted()) return;
		runInitializer("relative orientation", () => initRelativeOrientation());
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(startSensors, { timeout: 2e3 });
	else globalThis.setTimeout(startSensors, 0);
	const deferServiceWorker = () => {
		if (aborted()) return;
		if (globalThis.location?.protocol === "chrome-extension:") return;
		initServiceWorker({
			immediate: false,
			onRegistered() {
				log("PWA: service worker registered");
			},
			onRegisterError(error) {
				log("PWA: service worker register error: " + (error?.message ?? String(error)));
			}
		}).catch((err) => {
			log("PWA: service worker disabled: " + safeToString(err));
		});
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(deferServiceWorker, { timeout: 6e3 });
	else globalThis.setTimeout(deferServiceWorker, 2500);
}
//#endregion
export { mountAirpad as default, unmountAirpadRuntime };
