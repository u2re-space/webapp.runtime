import { _ as isMaintainHubSocketConnectionEnabled, g as getRemoteHost, h as applyAirpadRuntimeFromAppSettings } from "../views/airpad.js";
import { r as loadSettings } from "../com/service.js";
//#region src/frontend/shared/transport/hub-socket-boot.ts
/**
* Load stored settings, apply AirPad / shell runtime, then connect or disconnect the hub socket.
*/
async function bootHubSocketFromStoredSettings() {
	await applyHubSocketFromSettings(await loadSettings());
}
/**
* Apply after any settings mutation (Save, storage sync). Idempotent with {@link applyAirpadRuntimeFromAppSettings}.
*/
async function applyHubSocketFromSettings(settings) {
	applyAirpadRuntimeFromAppSettings(settings);
	if (!isMaintainHubSocketConnectionEnabled()) return;
	if (!getRemoteHost().trim()) return;
	const { initWebSocket, connectWS } = await import("./websocket.js");
	initWebSocket(null);
	connectWS();
}
//#endregion
export { applyHubSocketFromSettings, bootHubSocketFromStoredSettings };
