import "./service11.js";
import { r as applyGridSettings } from "./app4.js";
//#region src/core/utils/Theme.ts
/** Convert getComputedStyle background (rgb/rgba or hex) to #rrggbb for meta theme-color / PWA chrome. */
var cssBackgroundToOpaqueHex = (css) => {
	const t = css.trim();
	if (!t || t === "transparent") return null;
	const hexMatch = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hexMatch) {
		let h = hexMatch[1];
		if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
		return `#${h.toLowerCase()}`;
	}
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
	if (!m) return null;
	const alpha = m[4] !== void 0 ? Number(m[4]) : 1;
	if (!Number.isFinite(alpha) || alpha < .98) return null;
	return `#${[
		Math.max(0, Math.min(255, Math.round(Number(m[1])))),
		Math.max(0, Math.min(255, Math.round(Number(m[2])))),
		Math.max(0, Math.min(255, Math.round(Number(m[3]))))
	].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};
/**
* Sample the top shell chrome (minimal nav or faint toolbar) from mounted shell shadow roots
* so PWA Window Controls Overlay / title bar can match the real toolbar background.
*/
var samplePwaToolbarBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	const hosts = document.querySelectorAll("[data-shell]");
	for (const host of hosts) {
		const sr = host.shadowRoot;
		if (!sr) continue;
		const bar = sr.querySelector(".app-shell__nav, .app-shell__toolbar");
		if (!bar) continue;
		const bg = getComputedStyle(bar).backgroundColor;
		const hex = cssBackgroundToOpaqueHex(bg);
		if (hex) return hex;
	}
	return null;
};
var resolveColorScheme = (theme) => {
	if (theme === "dark" || theme === "light") return theme;
	return globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
};
var resolveFontSize = (size) => {
	switch (size) {
		case "small": return "14px";
		case "large": return "18px";
		default: return "16px";
	}
};
/** Keep <html> + PWA chrome aligned with resolved light/dark and user preference (auto/light/dark). */
var syncBrowserChromeTheme = (resolved, preference) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const scheme = preference === "dark" ? "dark" : preference === "light" ? "light" : "auto";
	root.setAttribute("data-scheme", scheme);
	root.setAttribute("data-theme", resolved);
	root.style.colorScheme = resolved;
	if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ === true) return;
	const applyMetaThemeColor = () => {
		if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ === true) return;
		const meta = document.querySelector("meta[name=\"theme-color\"]");
		if (!meta) return;
		const sampled = samplePwaToolbarBackgroundColor();
		const fallback = resolved === "dark" ? "#0f1419" : "#007acc";
		meta.setAttribute("content", sampled ?? fallback);
	};
	applyMetaThemeColor();
	requestAnimationFrame(applyMetaThemeColor);
};
var applyTheme = (settings) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const theme = settings.appearance?.theme || "auto";
	syncBrowserChromeTheme(resolveColorScheme(theme), theme);
	root.style.fontSize = resolveFontSize(settings.appearance?.fontSize);
	if (settings.appearance?.color) {
		document.body.style.setProperty("--current", settings.appearance.color);
		document.body.style.setProperty("--primary", settings.appearance.color);
		root.style.setProperty("--current", settings.appearance.color);
		root.style.setProperty("--primary", settings.appearance.color);
	}
	if (settings.grid) applyGridSettings(settings);
};
//#endregion
export { syncBrowserChromeTheme as n, applyTheme as t };
