import { r as __exportAll } from "./rolldown-runtime.js";
import { n as DEFAULT_SETTINGS } from "./SettingsTypes.js";
//#region src/shared/config/RuntimeSettings.ts
var RuntimeSettings_exports = /* @__PURE__ */ __exportAll({ getRuntimeSettings: () => getRuntimeSettings });
var provider;
/** Lazily resolved so we never read `loadSettings` at module init (avoids TDZ when Rollup splits com-app ↔ boot chunks). */
var defaultProvider = null;
async function getDefaultProvider() {
	if (defaultProvider) return defaultProvider;
	const { loadSettings } = await import("./Settings.js").then((n) => n.t);
	defaultProvider = loadSettings;
	return defaultProvider;
}
var getRuntimeSettings = async () => {
	try {
		return await (provider ?? await getDefaultProvider())() || DEFAULT_SETTINGS;
	} catch {
		return DEFAULT_SETTINGS;
	}
};
//#endregion
export { getRuntimeSettings as n, RuntimeSettings_exports as t };
