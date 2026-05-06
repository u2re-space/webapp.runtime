//#region src/shared/routing/native/clipboard-device.ts
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
export { openAppClipboardRelatedSettings, openNativeNotificationSettings };
