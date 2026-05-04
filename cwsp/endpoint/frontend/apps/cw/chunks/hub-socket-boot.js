import { r as __exportAll } from "./rolldown-runtime.js";
import { i as shouldDeferCrxHubSocketBootstrap, n as loadSettings } from "./Settings.js";
import { r as isCapacitorCwsNativeShell } from "../vendor/@capacitor_core.js";
import { C as isMaintainHubSocketConnectionEnabled, i as applyAirpadRuntimeFromAppSettings, v as getRemoteHost, w as isPreferNativeWebsocketEnabled } from "./config.js";
//#region ../../modules/projects/subsystem/src/boot/hub-socket-boot.ts
var hub_socket_boot_exports = /* @__PURE__ */ __exportAll({
	applyHubSocketFromSettings: () => applyHubSocketFromSettings,
	bootHubSocketFromStoredSettings: () => bootHubSocketFromStoredSettings,
	installAirpadHubLifecycleRecovery: () => installAirpadHubLifecycleRecovery
});
/** After this long in the background, force a full reconnect (zombie TCP / suspended workers). */
var PWA_STALE_BACKGROUND_MS = 12e3;
var hubLifecycleRecoveryInstalled = false;
var lastDocumentHiddenAt = 0;
function shouldRunHubRecovery() {
	if (isCapacitorCwsNativeShell() && isPreferNativeWebsocketEnabled()) return false;
	if (!isMaintainHubSocketConnectionEnabled()) return false;
	if (!getRemoteHost().trim()) return false;
	return true;
}
/**
* PWA / mobile: restore hub ↔ endpoint after suspend, offline, or bfcache restore.
* Requires Settings → maintain hub socket + a remote host (same rules as {@link applyHubSocketFromSettings}).
*/
function installAirpadHubLifecycleRecovery() {
	if (hubLifecycleRecoveryInstalled || typeof window === "undefined" || typeof document === "undefined") return;
	hubLifecycleRecoveryInstalled = true;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "hidden") return;
		lastDocumentHiddenAt = Date.now();
	});
	const schedule = (fn) => {
		globalThis.setTimeout(fn, 280);
	};
	const recoverAfterVisibility = () => {
		if (!shouldRunHubRecovery()) return;
		(async () => {
			const { connectWS, getWS, initWebSocket, isWSConnected, reconnectTransportAfterLifecycleResume } = await import("./websocket.js").then((n) => n.d);
			initWebSocket(null);
			const live = Boolean(getWS()?.connected);
			if (lastDocumentHiddenAt > 0 && Date.now() - lastDocumentHiddenAt >= PWA_STALE_BACKGROUND_MS && (live || isWSConnected())) {
				reconnectTransportAfterLifecycleResume("visibility");
				return;
			}
			if (!live && !isWSConnected()) connectWS();
		})();
	};
	const recoverAfterNetworkOrRestore = (reason) => {
		if (!shouldRunHubRecovery()) return;
		(async () => {
			const { initWebSocket, reconnectTransportAfterLifecycleResume } = await import("./websocket.js").then((n) => n.d);
			initWebSocket(null);
			reconnectTransportAfterLifecycleResume(reason);
		})();
	};
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		schedule(recoverAfterVisibility);
	});
	window.addEventListener("online", () => schedule(() => recoverAfterNetworkOrRestore("online")));
	window.addEventListener("pageshow", (ev) => {
		if (!ev.persisted) return;
		schedule(() => recoverAfterNetworkOrRestore("bfcache"));
	});
}
/**
* Load stored settings, apply AirPad / shell runtime, then connect or disconnect the hub socket.
*/
async function bootHubSocketFromStoredSettings() {
	installAirpadHubLifecycleRecovery();
	await applyHubSocketFromSettings(await loadSettings());
}
/**
* Apply after any settings mutation (Save, storage sync). Idempotent with {@link applyAirpadRuntimeFromAppSettings}.
*/
async function applyHubSocketFromSettings(settings) {
	if (await shouldDeferCrxHubSocketBootstrap(settings)) return;
	applyAirpadRuntimeFromAppSettings(settings);
	if (isCapacitorCwsNativeShell() && isPreferNativeWebsocketEnabled()) return;
	if (!isMaintainHubSocketConnectionEnabled()) return;
	if (!getRemoteHost().trim()) return;
	const { initWebSocket, connectWS } = await import("./websocket.js").then((n) => n.d);
	initWebSocket(null);
	connectWS();
}
//#endregion
export { hub_socket_boot_exports as n, applyHubSocketFromSettings as t };
