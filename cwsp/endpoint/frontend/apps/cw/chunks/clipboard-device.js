import { r as __exportAll } from "./rolldown-runtime.js";
//#region src/shared/native/clipboard-device.ts
var clipboard_device_exports = /* @__PURE__ */ __exportAll({
	isCapacitorNativeShell: () => isCapacitorNativeShell,
	openAppClipboardRelatedSettings: () => openAppClipboardRelatedSettings,
	openNativeNotificationSettings: () => openNativeNotificationSettings,
	readClipboardTextFromDevice: () => readClipboardTextFromDevice,
	writeClipboardTextToDevice: () => writeClipboardTextToDevice
});
/**
* Device clipboard I/O: prefers Capacitor on cwsp Android, else Web Clipboard API.
* Used for LAN clipboard sync (CWSAndroid-style) from WebSocket / coordinator.
*/
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Same check — use when "clipboard" naming is misleading (e.g. AirPad WebSocket transport). */
var isCapacitorNativeShell = () => isCapacitorNative();
async function writeClipboardTextToDevice(text) {
	const value = String(text ?? "");
	if (isCapacitorNative()) try {
		const { Clipboard } = await import(
			/* @vite-ignore */
			"@capacitor/clipboard"
);
		await Clipboard.write({ string: value });
		return;
	} catch {}
	if (globalThis.navigator?.clipboard?.writeText) {
		await globalThis.navigator.clipboard.writeText(value);
		return;
	}
	throw new Error("Clipboard write unavailable");
}
async function readClipboardTextFromDevice() {
	if (isCapacitorNative()) try {
		const { Clipboard } = await import(
			/* @vite-ignore */
			"@capacitor/clipboard"
);
		const v = (await Clipboard.read())?.value;
		if (typeof v === "string") return v;
	} catch {}
	if (globalThis.navigator?.clipboard?.readText) return String(await globalThis.navigator.clipboard.readText());
	throw new Error("Clipboard read unavailable");
}
/** Opens notification settings for this app (Android / iOS). Best-effort. */
async function openNativeNotificationSettings() {
	if (!isCapacitorNative()) return;
	try {
		const { NativeSettings, AndroidSettings, IOSSettings } = await import(
			/* @vite-ignore */
			"capacitor-native-settings"
);
		await NativeSettings.open({
			optionAndroid: AndroidSettings.AppNotification,
			optionIOS: IOSSettings.AppNotification
		});
	} catch {}
}
/** Opens system UI where the user can adjust app permissions (Android / iOS). Best-effort. */
async function openAppClipboardRelatedSettings() {
	if (!isCapacitorNative()) return;
	try {
		const { NativeSettings, AndroidSettings, IOSSettings } = await import(
			/* @vite-ignore */
			"capacitor-native-settings"
);
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
	} catch {}
}
//#endregion
export { writeClipboardTextToDevice as i, isCapacitorNativeShell as n, readClipboardTextFromDevice as r, clipboard_device_exports as t };
