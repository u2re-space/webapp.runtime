//#region src/frontend/views/airpad/credential-cache-bridge.ts
var impl = null;
/** Called from websocket.ts at module load. */
function setAirpadCredentialInvalidator(fn) {
	impl = fn;
}
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
			authToken: remoteConfig.authToken,
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
	authToken: "",
	destinationId: "",
	clientId: "",
	peerInstanceId: ""
};
/** IndexedDB “Server” tab: userId/userKey as fallbacks for AirPad when local client/token empty (CWS_ASSOCIATED_*). */
var coreIdentityBridgeUserId = "";
var coreIdentityBridgeUserKey = "";
var coreIdentityUseForAirpad = true;
/** Shell / Capacitor toggles (coordinator + future native bridges). */
var shellRemoteClipboardEnabled = true;
var shellApplyRemoteToDevice = true;
var shellPushLocalClipboard = false;
var shellClipboardPushIntervalMs = 2e3;
var shellClipboardBroadcastTargets = "";
var shellMaintainHubSocket = false;
var shellPreferNativeWebsocket = true;
var shellNativeSmsEnabled = true;
var shellNativeContactsEnabled = true;
var coreSocketProtocol = "auto";
var coreSocketRouteTarget = "";
var coreSocketSelfId = "";
var coreSocketTransportMode = "plaintext";
var coreSocketTransportSecret = "";
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
	remoteConfig.authToken = stored.authToken || "";
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
if (stored._legacyMigrated === true || !stored.peerInstanceId) persistRemoteConfig();
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
function applyAirpadRemoteConfig(input, options) {
	if (input.endpointUrl !== void 0) remoteConfig.endpointUrl = normalizeOriginUrl(input.endpointUrl);
	else if (input.host !== void 0) remoteConfig.endpointUrl = normalizeOriginUrl(input.host);
	if (input.directUrl !== void 0) remoteConfig.directUrl = normalizeOriginUrl(input.directUrl);
	if (input.authToken !== void 0) remoteConfig.authToken = input.authToken || "";
	if (input.destinationId !== void 0) remoteConfig.destinationId = (input.destinationId || "").trim();
	else if (input.routeTarget !== void 0) remoteConfig.destinationId = (input.routeTarget || "").trim();
	if (input.clientId !== void 0) remoteConfig.clientId = (input.clientId || "").trim();
	refreshRemoteHost();
	if (options?.persist !== false) persistRemoteConfig();
}
var endpointUrlToAirpadConnectHost = (endpointUrl) => {
	try {
		const u = new URL(endpointUrl);
		return `${u.protocol}//${u.host}`;
	} catch {
		return "";
	}
};
/**
* Apply CrossWord AppSettings shell + identity overlay (call after load/save settings and on boot).
* Does not clear AirPad localStorage fields; only updates in-memory host/route when shell requests it.
*/
function applyAirpadRuntimeFromAppSettings(settings) {
	const core = settings.core;
	const shell = settings.shell;
	const socket = core?.socket;
	const interop = core?.interop;
	coreIdentityBridgeUserId = (core?.userId || "").trim();
	coreIdentityBridgeUserKey = (core?.userKey || "").trim();
	coreIdentityUseForAirpad = (core?.useCoreIdentityForAirPad ?? true) !== false;
	shellRemoteClipboardEnabled = (shell?.enableRemoteClipboardBridge ?? true) !== false;
	shellApplyRemoteToDevice = (shell?.applyRemoteClipboardToDevice ?? true) !== false;
	shellPushLocalClipboard = Boolean(shell?.pushLocalClipboardToLan);
	const intervalRaw = Number(shell?.clipboardPushIntervalMs);
	shellClipboardPushIntervalMs = Number.isFinite(intervalRaw) && intervalRaw >= 800 ? Math.min(Math.round(intervalRaw), 6e4) : 2e3;
	shellClipboardBroadcastTargets = (shell?.clipboardBroadcastTargets || "").trim();
	shellMaintainHubSocket = Boolean(shell?.maintainHubSocketConnection);
	shellPreferNativeWebsocket = (shell?.preferNativeWebsocket ?? interop?.preferNativeWebsocket ?? true) !== false;
	shellNativeSmsEnabled = (shell?.enableNativeSms ?? true) !== false;
	shellNativeContactsEnabled = (shell?.enableNativeContacts ?? true) !== false;
	coreSocketProtocol = socket?.protocol === "http" || socket?.protocol === "https" ? socket.protocol : "auto";
	coreSocketRouteTarget = (socket?.routeTarget || "").trim();
	coreSocketSelfId = (socket?.selfId || "").trim();
	coreSocketTransportMode = socket?.transportMode === "secure" ? "secure" : "plaintext";
	coreSocketTransportSecret = (socket?.transportSecret || "").trim();
	(socket?.signingSecret || "").trim();
	const input = {};
	if (core?.endpointUrl?.trim()) {
		const origin = endpointUrlToAirpadConnectHost(core.endpointUrl.trim());
		if (origin) input.endpointUrl = origin;
	}
	if (Object.keys(input).length) applyAirpadRemoteConfig(input, { persist: false });
	try {
		globalThis.__CWS_SHELL_FEATURES__ = {
			clipboardBridge: shellRemoteClipboardEnabled,
			applyRemoteClipboard: shellApplyRemoteToDevice,
			pushLocalClipboard: shellPushLocalClipboard,
			maintainHubSocket: shellMaintainHubSocket,
			preferNativeWebsocket: shellPreferNativeWebsocket,
			sms: shellNativeSmsEnabled,
			contacts: shellNativeContactsEnabled
		};
	} catch {}
}
function isShellRemoteClipboardBridgeEnabled() {
	return shellRemoteClipboardEnabled !== false;
}
function isApplyRemoteClipboardToDeviceEnabled() {
	return shellApplyRemoteToDevice !== false;
}
function isPushLocalClipboardToLanEnabled() {
	return shellPushLocalClipboard === true;
}
function getClipboardPushIntervalMs() {
	return shellClipboardPushIntervalMs;
}
var parseClipboardTargetList = (value) => {
	return Array.from(new Set(value.split(/[;,]/).map((item) => item.trim()).filter(Boolean)));
};
/** Device ids for outbound clipboard acts (Settings → clipboard broadcast targets). */
function getClipboardBroadcastTargetNodes() {
	const explicit = parseClipboardTargetList(shellClipboardBroadcastTargets);
	if (explicit.length) return explicit;
	return [];
}
/** Background WebSocket to cwsp / endpoint hub (any shell, not only AirPad view). */
function isMaintainHubSocketConnectionEnabled() {
	return shellMaintainHubSocket === true;
}
function isPreferNativeWebsocketEnabled() {
	return shellPreferNativeWebsocket !== false;
}
function getRemoteHost() {
	return remoteHost;
}
function getAirPadEndpointUrl() {
	if (remoteConfig.endpointUrl.trim()) return remoteConfig.endpointUrl.trim();
	return normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
}
/**
* Quick-connect value shown in the AirPad popup.
*
* INVARIANT: the popup only exposes one field now, so prefer an explicit target
* device id first, otherwise show the current direct/url target.
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
function getRemoteRouteTarget() {
	if (remoteConfig.destinationId.trim()) return remoteConfig.destinationId.trim();
	return coreSocketRouteTarget;
}
function getAirPadTransportMode() {
	return coreSocketTransportMode;
}
function getAirPadAuthToken() {
	if (coreIdentityUseForAirpad && coreIdentityBridgeUserKey.trim()) return coreIdentityBridgeUserKey.trim();
	const local = (remoteConfig.authToken || "").trim();
	if (local) return local;
	return readGlobalAirpadValue(["AIRPAD_AUTH_TOKEN", "AIRPAD_TOKEN"]);
}
function getAirPadClientId() {
	if (coreSocketSelfId.trim()) return coreSocketSelfId.trim();
	if (coreIdentityUseForAirpad && coreIdentityBridgeUserId.trim()) return coreIdentityBridgeUserId.trim();
	if (remoteConfig.clientId.trim()) return remoteConfig.clientId.trim();
	return readGlobalAirpadValue(["AIRPAD_CLIENT_ID", "AIRPAD_CLIENT"]);
}
function getAirPadPeerInstanceId() {
	const env = readGlobalAirpadValue(["AIRPAD_PEER_INSTANCE_ID", "AIRPAD_DEVICE_ID"]);
	if (env.trim()) return env.trim();
	return remoteConfig.peerInstanceId || "";
}
function getAirPadTransportSecret() {
	return coreSocketTransportSecret;
}
var MOTION_JITTER_EPS = .001;
var REL_ORIENT_DEADZONE = .001;
var REL_ORIENT_SMOOTH = .8;
//#endregion
export { setAirPadQuickConnectTarget as C, reloadAirpadRemoteConfigFromStorage as S, setAirpadCredentialInvalidator as T, isApplyRemoteClipboardToDeviceEnabled as _, attachAirpadCrossTabConfigSync as a, isPushLocalClipboardToLanEnabled as b, getAirPadPeerInstanceId as c, getAirPadTransportSecret as d, getClipboardBroadcastTargetNodes as f, getRemoteRouteTarget as g, getRemoteProtocol as h, applyAirpadRuntimeFromAppSettings as i, getAirPadQuickConnectTarget as l, getRemoteHost as m, REL_ORIENT_DEADZONE as n, getAirPadAuthToken as o, getClipboardPushIntervalMs as p, REL_ORIENT_SMOOTH as r, getAirPadClientId as s, MOTION_JITTER_EPS as t, getAirPadTransportMode as u, isMaintainHubSocketConnectionEnabled as v, invalidateAirpadTransportCredentials as w, isShellRemoteClipboardBridgeEnabled as x, isPreferNativeWebsocketEnabled as y };
