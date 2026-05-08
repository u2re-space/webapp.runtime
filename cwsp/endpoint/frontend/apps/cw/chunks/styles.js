import { p as loadAsAdopted } from "../fest/dom.js";
import "./Settings.js";
import { n as applyGridSettings } from "./StateStorage.js";
import { n as core_default, t as scss_default } from "../fest/veela.js";
//#region ../../modules/projects/subsystem/src/other/config/SettingsTypes.ts
var defaultSpeechLanguage = () => {
	const fallback = "en-US";
	if (typeof navigator === "undefined") return fallback;
	const normalized = (navigator.language || "").trim();
	if (normalized === "ru" || normalized.startsWith("ru-")) return "ru";
	if (normalized === "en-GB") return "en-GB";
	if (normalized === "en-US") return "en-US";
	if (normalized === "en" || normalized.startsWith("en-")) return "en";
	return fallback;
};
var DEFAULT_SETTINGS = {
	core: {
		mode: "native",
		endpointUrl: "http://localhost:6065",
		userId: "",
		userKey: "",
		encrypt: false,
		preferBackendSync: true,
		ntpEnabled: false,
		appClientId: "",
		useCoreIdentityForAirPad: true,
		allowInsecureTls: false,
		network: {
			listenPortHttps: 8443,
			listenPortHttp: 8080,
			bridgeEnabled: true,
			reconnectMs: 3e3,
			destinations: []
		},
		socket: {
			protocol: "auto",
			routeTarget: "",
			selfId: "",
			accessToken: "",
			clientAccessToken: "",
			allowAccessTokenWithoutUserKey: false,
			transportMode: "plaintext",
			transportSecret: "",
			signingSecret: "",
			connectionType: "",
			archetype: "",
			protocolLanesJson: ""
		},
		interop: {
			ipcProtocol: "uniform",
			platformInterop: true,
			preferNativeIpc: true,
			preferNativeWebsocket: true
		},
		admin: {
			httpsOrigin: "https://localhost:8443",
			httpOrigin: "http://localhost:8080",
			path: "/"
		},
		ops: {
			allowUnencrypted: false,
			httpTargets: [],
			wsTargets: [],
			syncTargets: []
		}
	},
	shell: {
		preferNativeWebsocket: true,
		maintainHubSocketConnection: true,
		enableRemoteClipboardBridge: true,
		applyRemoteClipboardToDevice: true,
		pushLocalClipboardToLan: false,
		clipboardPushIntervalMs: 2e3,
		clipboardBroadcastTargets: "",
		enableNativeSms: true,
		enableNativeContacts: true,
		acceptInboundClipboardData: true,
		clipboardInboundAllowIds: "",
		clipboardShareDestinationIds: "",
		accessTokenBypassesClipboardAllowlist: false,
		acceptContactsBridgeData: false,
		acceptSmsBridgeData: false
	},
	ai: {
		apiKey: "",
		baseUrl: "",
		model: "gpt-5.2",
		customModel: "",
		defaultReasoningEffort: "medium",
		defaultVerbosity: "medium",
		maxOutputTokens: 4e5,
		contextTruncation: "disabled",
		promptCacheRetention: "in-memory",
		maxToolCalls: 8,
		parallelToolCalls: true,
		mcp: [],
		shareTargetMode: "recognize",
		autoProcessShared: true,
		customInstructions: [],
		activeInstructionId: "",
		responseLanguage: "auto",
		translateResults: false,
		generateSvgGraphics: false,
		requestTimeout: {
			low: 60,
			medium: 300,
			high: 900
		},
		maxRetries: 2
	},
	webdav: {
		url: "http://localhost:6065",
		username: "",
		password: "",
		token: ""
	},
	timeline: { source: "" },
	appearance: {
		theme: "auto",
		fontSize: "medium",
		color: "",
		markdown: {
			customCss: "",
			printCss: "",
			extensions: [],
			preset: "default",
			fontFamily: "system",
			fontSizePx: 16,
			lineHeight: 1.7,
			contentMaxWidthPx: 860,
			printScale: 1,
			page: {
				size: "auto",
				orientation: "portrait",
				marginMm: 12
			},
			modules: {
				typography: true,
				lists: true,
				tables: true,
				codeBlocks: true,
				blockquotes: true,
				media: true,
				printBreaks: true
			},
			plugins: {
				smartTypography: false,
				softBreaksAsBr: false,
				externalLinksNewTab: true
			}
		}
	},
	speech: { language: defaultSpeechLanguage() },
	grid: {
		columns: 4,
		rows: 8,
		shape: "square"
	}
};
//#endregion
//#region ../../modules/projects/subsystem/src/other/utils/Theme.ts
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
//#endregion
//#region ../../modules/projects/subsystem/src/boot/veela-variant-runtime.ts
/**
* Veela stylesheet loader for CrossWord (no `fest/fl-ui` runtime SCSS dependency).
*
* Uses the canonical forwarded stack in `veela.css/src/scss/index.scss` (core + curated basic surface).
* `advanced` / `beercss` currently share that stack until a standalone advanced bundle exists with stable `@use` paths.
*/
var loadedVariant = null;
/**
* Loads Veela stylesheet slices for the coarse variant presets used by BootLoader.
*/
async function loadVeelaVariant(variant) {
	if (loadedVariant === variant) return;
	console.log("[Veela] Loading variant:", variant);
	const apply = async (text) => {
		if (typeof text === "string" && text.length) await loadAsAdopted(text);
	};
	if (variant === "core") {
		await apply(core_default);
		loadedVariant = variant;
		return;
	}
	await apply(scss_default);
	loadedVariant = variant;
}
//#endregion
//#region ../../modules/projects/subsystem/src/styles.ts
/**
* CrossWord Styles Module
*
* Provides style system integration for the CrossWord application.
* Supports multiple style systems based on veela CSS variants.
*
* Style Systems:
* - veela-advanced: Full-featured CSS framework (default)
* - veela-basic: Lightweight minimal styling
* - veela-beercss: Beer CSS compatible styling
* - raw: No styling framework (browser defaults)
*/
var STYLE_CONFIGS = {
	"vl-advanced": {
		id: "vl-advanced",
		name: "Veela Advanced",
		description: "Full-featured CSS framework with design tokens and effects",
		variant: "advanced",
		initFn: async () => {
			try {
				await loadVeelaVariant("advanced");
				console.log("[Styles] Veela Advanced loaded");
			} catch (e) {}
		}
	},
	"vl-basic": {
		id: "vl-basic",
		name: "Veela Basic Styles",
		description: "Lightweight minimal styling for basic functionality",
		variant: "basic",
		initFn: async () => {
			try {
				await loadVeelaVariant("basic");
				console.log("[Styles] Veela Basic Styles loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela Basic Styles:", e);
			}
		}
	},
	"vl-beercss": {
		id: "vl-beercss",
		name: "Veela BeerCSS",
		description: "Beer CSS compatible styling with Material Design 3",
		variant: "beercss",
		initFn: async () => {
			try {
				await loadVeelaVariant("beercss");
				console.log("[Styles] Veela BeerCSS loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela BeerCSS:", e);
			}
		}
	},
	"vl-core": {
		id: "vl-core",
		name: "Veela Core",
		description: "Shared foundation styles for all veela variants",
		variant: "core",
		initFn: async () => {
			try {
				await loadVeelaVariant("core");
				console.log("[Styles] Veela Core loaded");
			} catch (e) {
				console.warn("[Styles] Failed to load Veela Core:", e);
			}
		}
	},
	"raw": {
		id: "raw",
		name: "Raw",
		description: "No styling framework, browser defaults",
		variant: "core",
		initFn: async () => {
			console.log("[Styles] Raw mode - no styles loaded");
		}
	}
};
var _currentStyle = null;
/**
* Load a style system
*
* @param styleId - Style system identifier
*/
async function loadStyleSystem(styleId) {
	const config = STYLE_CONFIGS[styleId] || STYLE_CONFIGS["vl-basic"];
	if (!config) throw new Error(`Unknown style system: ${styleId}`);
	if (_currentStyle === styleId) {
		console.log(`[Styles] Style system '${styleId}' already loaded`);
		return;
	}
	console.log(`[Styles] Loading style system: ${config.name}`);
	if (config.initFn) await config.initFn();
	_currentStyle = styleId;
	console.log(`[Styles] Style system ${config.name} loaded`);
}
//#endregion
export { applyTheme as n, DEFAULT_SETTINGS as r, loadStyleSystem as t };
