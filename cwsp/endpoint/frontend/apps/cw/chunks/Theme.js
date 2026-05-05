import { r as __exportAll } from "./rolldown-runtime.js";
import { n as loadSettings } from "./Settings.js";
import { n as applyGridSettings } from "./StateStorage.js";
//#region src/shared/other/utils/Theme.ts
var Theme_exports = /* @__PURE__ */ __exportAll({
	applyTheme: () => applyTheme,
	cssBackgroundToOpaqueHex: () => cssBackgroundToOpaqueHex,
	initTheme: () => initTheme,
	resyncThemeAfterAdoptedViewSheet: () => resyncThemeAfterAdoptedViewSheet,
	samplePwaToolbarBackgroundColor: () => samplePwaToolbarBackgroundColor,
	syncBrowserChromeTheme: () => syncBrowserChromeTheme
});
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
/** Keep minimal / immersive shell hosts + inner `.app-shell` in sync when only `applyTheme()` runs (Settings saves / preview) — `shell.setTheme` is not always invoked. */
var syncShellHostVisualScheme = (resolved) => {
	try {
		document.querySelectorAll("[data-shell]").forEach((el) => {
			const h = el;
			h.dataset.theme = resolved;
			h.style.colorScheme = resolved;
			const inner = h.shadowRoot?.querySelector?.(".app-shell");
			if (inner) {
				inner.dataset.theme = resolved;
				inner.style.colorScheme = resolved;
			}
		});
	} catch {}
};
/** Keep <html> + PWA chrome aligned with resolved light/dark and user preference (auto/light/dark). */
var syncBrowserChromeTheme = (resolved, preference) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const scheme = preference === "dark" ? "dark" : preference === "light" ? "light" : "auto";
	root.setAttribute("data-scheme", scheme);
	root.setAttribute("data-theme", resolved);
	root.style.colorScheme = resolved;
	try {
		const body = document.body;
		if (body) body.style.colorScheme = resolved;
	} catch {}
	try {
		document.querySelectorAll("[data-shell='content']").forEach((el) => {
			el.style.colorScheme = resolved;
		});
	} catch {}
	if (globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__ !== true) {
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
	}
	syncShellHostVisualScheme(resolved);
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
/**
* Re-apply persisted appearance after a view adopts a document-level constructed stylesheet (e.g. Settings.scss).
* WHY: First paint on `/settings` can show mixed shell chrome vs Veela `light-dark()` token resolution until
* something triggers a full style pass; microtask + rAF + idle re-run matches what happens after navigating away/back.
* INVARIANT: Safe to call multiple times; each pass is idempotent `applyTheme(loadSettings())`.
*/
var resyncThemeAfterAdoptedViewSheet = () => {
	if (typeof document === "undefined") return;
	const run = async () => {
		try {
			applyTheme(await loadSettings());
		} catch {}
		try {
			document.documentElement.offsetHeight;
		} catch {}
	};
	(async () => {
		await run();
		queueMicrotask(() => {
			run();
		});
		requestAnimationFrame(() => {
			run();
			try {
				document.documentElement.dispatchEvent(new CustomEvent("u2-theme-change", { bubbles: true }));
			} catch {}
			requestAnimationFrame(() => {
				run();
				const ric = globalThis.requestIdleCallback;
				if (typeof ric === "function") ric(() => {
					run();
				}, { timeout: 200 });
				else globalThis.setTimeout(() => {
					run();
				}, 50);
			});
		});
	})();
};
var initTheme = async () => {
	try {
		if (typeof document === "undefined") return;
		applyTheme(await loadSettings());
		globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", async () => {
			applyTheme(await loadSettings());
		});
	} catch (e) {
		console.warn("Failed to init theme", e);
	}
};
//#endregion
export { syncBrowserChromeTheme as i, applyTheme as n, resyncThemeAfterAdoptedViewSheet as r, Theme_exports as t };
