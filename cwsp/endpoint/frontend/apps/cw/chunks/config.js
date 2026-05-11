//#region ../../runtime/cwsp/endpoint/shared/wire-target-id.ts
function parseWireTargetEntry(raw) {
	const t = String(raw ?? "").trim();
	if (!t) return { nodeId: "" };
	const idx = t.lastIndexOf("::");
	if (idx <= 0) return { nodeId: t };
	const nodeId = t.slice(0, idx).trim();
	const accessToken = t.slice(idx + 2).trim();
	if (!nodeId) return { nodeId: t };
	return {
		nodeId,
		accessToken: accessToken || void 0
	};
}
/** Split comma/semicolon list into parsed entries (dedupe by nodeId + token). */
function parseWireTargetList(raw) {
	const parts = String(raw ?? "").split(/[;,]/).map((s) => s.trim()).filter(Boolean);
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const p of parts) {
		const e = parseWireTargetEntry(p);
		if (!e.nodeId) continue;
		const key = `${e.nodeId.toLowerCase()}::${e.accessToken ?? ""}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(e);
	}
	return out;
}
function resolveWireConnectionType(raw) {
	return (raw ?? "").trim() || "exchanger-initiator";
}
function resolveWireArchetype(raw) {
	return (raw ?? "").trim() || "server-v2";
}
//#endregion
//#region ../../modules/projects/subsystem/runtime/airpad-cwsp-client-parity.ts
/**
* **AirPad** web (`localStorage` key below) ↔ **CWSAndroid** (`ApplicationSettings`, `cwsp.*`) contracts.
* Canonical for shell / view builds that must not import from `runtime/cwsp` sources.
*
* **Storage:** {@link AIRPAD_REMOTE_CONFIG_STORAGE_KEY} holds JSON {@link CwspRemoteConnectionV1}.
* **Specs:** coordinator behaviour in `runtime/cwsp/endpoint/` (`SPECIFICATION-v2.md`, route query helpers).
*
* Import in Vite apps via `cwsp-shared/airpad-cwsp-client-parity` (see `tsconfig.vite-base.json`).
*/
/** AirPad popup / view persisted remote block (`airpad-view` / embedding shells). */
var AIRPAD_REMOTE_CONFIG_STORAGE_KEY = "airpad.remote.connection.v1";
//#endregion
//#region ../../modules/views/airpad-view/src/config/config.ts
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
var joinUniqueUrls = (...values) => {
	return Array.from(new Set(values.map((entry) => normalizeOriginUrl(entry)).filter(Boolean))).join(", ");
};
/** If AirPad storage says `https://<this-host>:8443` but the app tab is `https://<this-host>/` (443), use tab origin. */
/**
* Detect public (non-loopback) tab origins so we can ignore dev-only loopback remote URLs in stored settings.
*/
var isBrowserPublicOrigin = () => {
	if (typeof globalThis.location === "undefined") return false;
	const h = String(globalThis.location.hostname || "").toLowerCase();
	if (!h || h === "localhost" || h === "127.0.0.1" || h === "[::1]") return false;
	return true;
};
var urlHostIsLoopback = (urlStr) => {
	const trimmed = toTrimmedString(urlStr);
	if (!trimmed) return false;
	try {
		const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const h = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`).hostname.toLowerCase();
		return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
	} catch {
		return false;
	}
};
/**
* When the tab is on a real deployed host but every configured remote URL is loopback-only,
* use {@link globalThis.location.origin} at read-time instead so websocket probes reach this deployment.
* Does not rewrite IndexedDB / AirPad localStorage.
*/
var sanitizeLoopbackRemoteOnPublicOrigin = (value) => {
	const trimmed = value.trim();
	if (!trimmed || !isBrowserPublicOrigin()) return trimmed;
	const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
	if (!parts.length) return trimmed;
	if (!parts.every(urlHostIsLoopback)) return trimmed;
	try {
		return normalizeOriginUrl(globalThis.location.origin);
	} catch {
		return trimmed;
	}
};
var rewriteEndpointToMatchHttpsTab = (originLike) => {
	const trimmed = toTrimmedString(originLike);
	if (!trimmed || typeof globalThis.location === "undefined" || !globalThis.location.hostname) return trimmed;
	try {
		const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const u = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`);
		const tab = globalThis.location;
		if (u.hostname === tab.hostname && u.protocol === "https:" && u.port === "8443" && tab.protocol === "https:" && (tab.port === "" || tab.port === "443")) return normalizeOriginUrl(tab.origin);
	} catch {}
	return trimmed;
};
function loadStoredRemoteConfig() {
	try {
		const raw = globalThis?.localStorage?.getItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY);
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
		const payload = {
			v: 1,
			quickConnectValue: remoteConfig.quickConnectValue,
			endpointUrl: remoteConfig.endpointUrl,
			directUrl: remoteConfig.directUrl,
			destinationId: remoteConfig.destinationId,
			accessToken: remoteConfig.accessToken,
			clientId: remoteConfig.clientId,
			peerInstanceId: remoteConfig.peerInstanceId,
			identificationToken: remoteConfig.identificationToken.trim() || void 0,
			clientAccessToken: remoteConfig.clientAccessToken.trim() || void 0
		};
		if (remoteConfig.wireTransport === "ws" || remoteConfig.wireTransport === "socket.io") payload.wireTransport = remoteConfig.wireTransport;
		globalThis?.localStorage?.setItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY, JSON.stringify(payload));
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
	peerInstanceId: "",
	identificationToken: "",
	clientAccessToken: ""
};
/** IndexedDB “Server” tab: userId fallback for AirPad client identity (CWS_ASSOCIATED_*). */
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
var shellAcceptInboundClipboardData = true;
var shellClipboardInboundAllowIds = "";
var shellAccessTokenBypassesClipboardAllowlist = false;
var coreSocketProtocol = "auto";
var coreSocketRouteTarget = "";
var coreSocketSelfId = "";
var coreSocketAccessToken = "";
var coreSocketClientAccessToken = "";
var coreSocketTransportMode = "plaintext";
var coreSocketTransportSecret = "";
var coreSocketConnectionType = "";
var coreSocketArchetype = "";
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
	remoteConfig.endpointUrl = rewriteEndpointToMatchHttpsTab(endpointUrl);
	remoteConfig.directUrl = rewriteEndpointToMatchHttpsTab(directUrl);
	remoteConfig.accessToken = toTrimmedString(stored.accessToken) || toTrimmedString(stored.authToken) || "";
	remoteConfig.destinationId = toTrimmedString(stored.destinationId) || legacyRouteTarget;
	remoteConfig.quickConnectValue = quickConnectValue || remoteConfig.destinationId || remoteConfig.directUrl;
	remoteConfig.clientId = toTrimmedString(stored.clientId);
	const storedPeer = toTrimmedString(stored.peerInstanceId);
	if (storedPeer) remoteConfig.peerInstanceId = storedPeer;
	else if (!remoteConfig.peerInstanceId) remoteConfig.peerInstanceId = createPeerInstanceId();
	remoteConfig.identificationToken = toTrimmedString(stored.identificationToken);
	remoteConfig.clientAccessToken = toTrimmedString(stored.clientAccessToken);
	const wt = stored.wireTransport;
	remoteConfig.wireTransport = wt === "ws" || wt === "socket.io" ? wt : void 0;
	refreshRemoteHost();
}
var stored = loadStoredRemoteConfig();
hydrateFromStored(stored);
if (!toTrimmedString(stored.peerInstanceId)) remoteConfig.peerInstanceId = remoteConfig.peerInstanceId || createPeerInstanceId();
var storedAccessToken = toTrimmedString(stored.accessToken);
var storedLegacyAuthToken = toTrimmedString(stored.authToken);
if (stored._legacyMigrated === true || !stored.peerInstanceId || storedLegacyAuthToken && !storedAccessToken || stored.v !== 1) persistRemoteConfig();
function applyAirpadRemoteConfig(input, options) {
	if (input.endpointUrl !== void 0) remoteConfig.endpointUrl = normalizeOriginUrl(input.endpointUrl);
	else if (input.host !== void 0) remoteConfig.endpointUrl = normalizeOriginUrl(input.host);
	if (input.directUrl !== void 0) remoteConfig.directUrl = normalizeOriginUrl(input.directUrl);
	if (input.accessToken !== void 0) remoteConfig.accessToken = input.accessToken || "";
	else if (input.authToken !== void 0) remoteConfig.accessToken = input.authToken || "";
	if (input.destinationId !== void 0) remoteConfig.destinationId = (input.destinationId || "").trim();
	else if (input.routeTarget !== void 0) remoteConfig.destinationId = (input.routeTarget || "").trim();
	if (input.clientId !== void 0) remoteConfig.clientId = (input.clientId || "").trim();
	if (input.identificationToken !== void 0) remoteConfig.identificationToken = (input.identificationToken || "").trim();
	if (input.clientAccessToken !== void 0) remoteConfig.clientAccessToken = (input.clientAccessToken || "").trim();
	if (input.wireTransport === "ws" || input.wireTransport === "socket.io") remoteConfig.wireTransport = input.wireTransport;
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
	/** Only on when settings explicitly set shell.maintainHubSocketConnection === true (default off). */
	shellMaintainHubSocket = shell?.maintainHubSocketConnection === true;
	shellPreferNativeWebsocket = (shell?.preferNativeWebsocket ?? interop?.preferNativeWebsocket ?? true) !== false;
	shellNativeSmsEnabled = (shell?.enableNativeSms ?? true) !== false;
	shellNativeContactsEnabled = (shell?.enableNativeContacts ?? true) !== false;
	shellAcceptInboundClipboardData = (shell?.acceptInboundClipboardData ?? true) !== false;
	shellClipboardInboundAllowIds = (shell?.clipboardInboundAllowIds || "").trim();
	(shell?.clipboardShareDestinationIds || "").trim();
	shellAccessTokenBypassesClipboardAllowlist = (shell?.accessTokenBypassesClipboardAllowlist ?? false) === true;
	shell?.acceptContactsBridgeData;
	shell?.acceptSmsBridgeData;
	coreSocketProtocol = socket?.protocol === "http" || socket?.protocol === "https" ? socket.protocol : "auto";
	coreSocketRouteTarget = (socket?.routeTarget || "").trim();
	coreSocketSelfId = (socket?.selfId || "").trim();
	coreSocketAccessToken = (socket?.accessToken || socket?.airpadAuthToken || "").trim();
	coreSocketClientAccessToken = (socket?.clientAccessToken || "").trim();
	coreSocketTransportMode = socket?.transportMode === "secure" ? "secure" : "plaintext";
	coreSocketTransportSecret = (socket?.transportSecret || "").trim();
	(socket?.signingSecret || "").trim();
	coreSocketConnectionType = (socket?.connectionType || "").trim();
	coreSocketArchetype = (socket?.archetype || "").trim();
	(socket?.protocolLanesJson || "").trim();
	const input = {};
	if (core?.endpointUrl?.trim()) {
		const origin = endpointUrlToAirpadConnectHost(rewriteEndpointToMatchHttpsTab(core.endpointUrl.trim()));
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
function getClipboardBroadcastTargetEntries() {
	const fromExplicit = parseWireTargetList(shellClipboardBroadcastTargets);
	if (fromExplicit.length) return fromExplicit;
	const route = getRemoteRouteTarget().trim();
	return route ? parseWireTargetList(route) : [];
}
/** Parsed outbound clipboard entries including optional per-id access tokens. */
function getClipboardBroadcastWireTargets() {
	return getClipboardBroadcastTargetEntries();
}
/** When false, ignore inbound clipboard payloads (coordinator still may run for other ops). */
function isShellClipboardInboundEnabled() {
	return shellAcceptInboundClipboardData !== false;
}
/** True when access token bypass of inbound allow list is enabled and a token is configured. */
function shouldBypassClipboardInboundAllowlistWithAccessToken() {
	return shellAccessTokenBypassesClipboardAllowlist && Boolean(getAccessToken().trim());
}
/**
* Inbound clipboard from `senderId` (peer / device id on the wire). Respects allow list unless bypassed by access token.
*/
function isClipboardSenderAllowedForInbound(senderId) {
	if (!isShellClipboardInboundEnabled()) return false;
	if (!isShellRemoteClipboardBridgeEnabled()) return false;
	if (shouldBypassClipboardInboundAllowlistWithAccessToken()) return true;
	const allow = parseWireTargetList(shellClipboardInboundAllowIds);
	if (!allow.length) return true;
	const s = senderId.trim().toLowerCase();
	if (!s) return false;
	return allow.some((e) => e.nodeId.trim().toLowerCase() === s);
}
/** Background WebSocket to cwsp / endpoint hub (any shell, not only AirPad view). */
function isMaintainHubSocketConnectionEnabled() {
	return shellMaintainHubSocket === true;
}
function isPreferNativeWebsocketEnabled() {
	return shellPreferNativeWebsocket !== false;
}
function getRemoteHost() {
	return sanitizeLoopbackRemoteOnPublicOrigin(remoteHost);
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
function getAirPadClientId() {
	if (coreSocketSelfId.trim()) return coreSocketSelfId.trim();
	if (coreIdentityUseForAirpad && coreIdentityBridgeUserId.trim()) return coreIdentityBridgeUserId.trim();
	if (remoteConfig.clientId.trim()) return remoteConfig.clientId.trim();
	return readGlobalAirpadValue(["AIRPAD_CLIENT_ID", "AIRPAD_CLIENT"]);
}
function getAssociatedClientToken() {
	return coreIdentityBridgeUserKey.trim();
}
/** Optional future-facing access token when this client acts as an inbound WS / reverse-server peer. */
function getClientAccessToken() {
	const local = coreSocketClientAccessToken.trim();
	if (local) return local;
	const fromRemote = remoteConfig.clientAccessToken.trim();
	if (fromRemote) return fromRemote;
	return readGlobalAirpadValue(["CWS_CLIENT_ACCESS_TOKEN", "CLIENT_ACCESS_TOKEN"]);
}
function getAirPadPeerInstanceId() {
	const env = readGlobalAirpadValue(["AIRPAD_PEER_INSTANCE_ID", "AIRPAD_DEVICE_ID"]);
	if (env.trim()) return env.trim();
	return remoteConfig.peerInstanceId || "";
}
function getAirPadTransportSecret() {
	return coreSocketTransportSecret;
}
/** Handshake `connectionType` before gateway `first-order` normalization (Settings → env → default). */
function getAirPadHandshakeConnectionType() {
	const fromSettings = coreSocketConnectionType.trim();
	if (fromSettings) return resolveWireConnectionType(fromSettings);
	return resolveWireConnectionType(readGlobalAirpadValue(["CWS_CONNECTION_TYPE", "AIRPAD_CONNECTION_TYPE"]));
}
/** Handshake `archetype` (Settings → env → default). */
function getAirPadHandshakeArchetype() {
	const fromSettings = coreSocketArchetype.trim();
	if (fromSettings) return resolveWireArchetype(fromSettings);
	return resolveWireArchetype(readGlobalAirpadValue(["CWS_ARCHETYPE", "AIRPAD_ARCHETYPE"]));
}
//#endregion
export { isClipboardSenderAllowedForInbound as _, getAirPadHandshakeConnectionType as a, isPushLocalClipboardToLanEnabled as b, getAirPadTransportSecret as c, getClipboardBroadcastWireTargets as d, getClipboardPushIntervalMs as f, isApplyRemoteClipboardToDeviceEnabled as g, getRemoteRouteTarget as h, getAirPadHandshakeArchetype as i, getAssociatedClientToken as l, getRemoteProtocol as m, getAccessToken as n, getAirPadPeerInstanceId as o, getRemoteHost as p, getAirPadClientId as r, getAirPadTransportMode as s, applyAirpadRuntimeFromAppSettings as t, getClientAccessToken as u, isMaintainHubSocketConnectionEnabled as v, isShellRemoteClipboardBridgeEnabled as x, isPreferNativeWebsocketEnabled as y };
