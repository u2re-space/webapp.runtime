import { r as __exportAll } from "./rolldown-runtime.js";
import { t as initializeLayers } from "./layer-manager.js";
import { f as isEnabledView, p as pickEnabledView } from "./views.js";
import { p as loadAsAdopted } from "../fest/dom.js";
import { n as DEFAULT_SETTINGS } from "./SettingsTypes.js";
import { n as loadSettings } from "./Settings.js";
import { i as serviceChannels } from "./channel-mixin.js";
import { c as darkTheme, d as lightTheme, l as defaultTheme, m as startImplicitViewMessagingBridge, o as ShellRegistry, t as LS_BOOT_SHELL_LAST_ACTIVE, u as initializeRegistries } from "../shells/preference.js";
import { n as applyTheme } from "./Theme.js";
import { n as core_default, t as scss_default } from "../fest/veela.js";
import { n as initCwsNativeBridge } from "../vendor/@capacitor_core.js";
import { t as applyHubSocketFromSettings } from "./hub-socket-boot.js";
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
//#region src/shared/styles.ts
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
var STYLE_CONFIGS$1 = {
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
	const config = STYLE_CONFIGS$1[styleId] || STYLE_CONFIGS$1["vl-basic"];
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
//#region ../../modules/projects/subsystem/src/boot/BootLoader.ts
/**
* Boot Loader - Shell/Style Initialization System
* 
* Manages the boot sequence for the CrossWord application:
* 1. Load settings and apply document theme (`:root` / color-scheme before Veela paints)
* 2. Load style system (Veela CSS or Minimal)
* 3. Initialize shell (frame/layout/environment)
* 4. Load view/component/module and connect uniform channels
* 
* Shell/Style Matrix:
* | Shells/Styles: | Faint | Minimal | Raw |
* |----------------|-------|-------|-----|
* | Veela          |  [r]  |  [o]  | [o] |
* | Minimal        |  [o]  |  [r]  | [r] |
* 
* [r] - recommended, [o] - optional
*/
var BootLoader_exports = /* @__PURE__ */ __exportAll({
	BootLoader: () => BootLoader,
	bootBase: () => bootBase,
	bootContent: () => bootContent,
	bootEnvironment: () => bootEnvironment,
	bootImmersive: () => bootImmersive,
	bootLoader: () => bootLoader,
	bootMinimal: () => bootMinimal,
	bootTabbed: () => bootTabbed,
	bootWindow: () => bootWindow,
	default: () => bootLoader
});
var normalizeShellId = (shell) => {
	if (shell === "faint") return "tabbed";
	if (shell === "base") return "immersive";
	return shell;
};
/**
* Style system configurations
*/
var STYLE_CONFIGS = {
	"raw": {
		name: "Raw (No Framework)",
		stylesheets: [],
		description: "No CSS framework, raw browser defaults",
		recommendedShells: ["immersive"]
	},
	"vl-core": {
		name: "Core (Shared Foundation)",
		stylesheets: [],
		description: "Shared foundation styles for all veela variants",
		recommendedShells: ["immersive", "minimal"]
	},
	"vl-basic": {
		name: "Basic Veela Styles",
		stylesheets: [],
		description: "Minimal styling for basic functionality",
		recommendedShells: [
			"window",
			"tabbed",
			"minimal",
			"environment",
			"immersive",
			"content"
		]
	},
	"vl-advanced": {
		name: "Advanced (Full-Featured Styling)",
		stylesheets: [],
		description: "Full-featured styling with design tokens and effects",
		recommendedShells: [
			"tabbed",
			"minimal",
			"environment"
		]
	},
	"vl-beercss": {
		name: "BeerCSS (Beer CSS Compatible)",
		stylesheets: [],
		description: "Beer CSS compatible styling with Material Design 3",
		recommendedShells: ["tabbed"]
	}
};
/**
* Boot Loader
* 
* Manages the application boot sequence with proper ordering:
* Styles → Shell → View → Channels
*/
var BootLoader = class BootLoader {
	static instance;
	state = {
		phase: "idle",
		styleSystem: null,
		shell: null,
		view: null,
		error: null
	};
	stateChangeHandlers = /* @__PURE__ */ new Set();
	shellInstance = null;
	/** MutationObserver-driven view host bindings (shared routing); disconnected between boots. */
	implicitBridgeCleanup = null;
	phaseHandlers = /* @__PURE__ */ new Map();
	constructor() {
		initializeRegistries();
	}
	static getInstance() {
		if (!BootLoader.instance) BootLoader.instance = new BootLoader();
		return BootLoader.instance;
	}
	/**
	* Execute the boot sequence
	*/
	async boot(container, config) {
		console.log("[BootLoader] Starting boot sequence:", config);
		try {
			if (this.shellInstance) try {
				this.implicitBridgeCleanup?.();
				this.implicitBridgeCleanup = null;
				ShellRegistry.unload(this.shellInstance.id);
			} catch (error) {
				console.warn("[BootLoader] Failed to unload previous shell:", error);
			} finally {
				this.shellInstance = null;
			}
			initializeLayers();
			initCwsNativeBridge().catch(() => {});
			const persistedSettings = await loadSettings().catch((error) => {
				console.warn("[BootLoader] Failed to load settings:", error);
				return null;
			});
			if (persistedSettings) applyHubSocketFromSettings(persistedSettings).catch(() => void 0);
			applyTheme(persistedSettings ?? DEFAULT_SETTINGS);
			try {
				const { initIngressPWA } = await import("./sw-handling.js").then((n) => n.s);
				await initIngressPWA();
			} catch (e) {
				console.warn("[BootLoader] Share-target / service worker ingress failed (non-fatal):", e);
			}
			await this.loadStyles(config.styleSystem);
			const persistedTheme = this.resolveThemeFromSettings(persistedSettings);
			const shell = await this.loadShell(config.shell, container);
			shell.setTheme(config.theme || persistedTheme);
			await shell.mount(container);
			this.implicitBridgeCleanup?.();
			this.implicitBridgeCleanup = startImplicitViewMessagingBridge();
			if (config.channels && config.channels.length > 0) await this.initChannels(config.channels, config.channelPriorityId);
			if (config.skipInitialNavigate) this.dismissShellLoadingSpinner(shell);
			else await shell.navigate(config.defaultView);
			this.setPhase("ready");
			if (config.rememberChoice) this.savePreferences(config);
			console.log("[BootLoader] Boot complete");
			return shell;
		} catch (error) {
			console.error("[BootLoader] Boot failed:", error);
			this.updateState({
				phase: "error",
				error
			});
			throw error;
		}
	}
	resolveThemeFromSettings(settings) {
		const theme = settings?.appearance?.theme || "auto";
		if (theme === "dark") return darkTheme;
		if (theme === "light") return lightTheme;
		return defaultTheme;
	}
	/** Hide immersive/minimal shell loading row when skipping {@link Shell.navigate}. */
	dismissShellLoadingSpinner(shell) {
		try {
			const loading = shell.getElement().shadowRoot?.querySelector(".app-shell__loading");
			if (loading) loading.hidden = true;
		} catch {}
	}
	/**
	* Load style system
	*/
	async loadStyles(styleSystem) {
		this.setPhase("styles");
		console.log(`[BootLoader] Loading style system: ${styleSystem}`);
		const config = STYLE_CONFIGS[styleSystem] || STYLE_CONFIGS["vl-basic"];
		try {
			await loadStyleSystem(styleSystem);
		} catch (error) {
			console.error(`[BootLoader] Failed to load style system: ${styleSystem}`, error);
			throw error;
		}
		for (const sheet of config.stylesheets) try {
			await loadAsAdopted(sheet);
		} catch (error) {
			console.warn(`[BootLoader] Failed to load stylesheet: ${sheet}`, error);
		}
		this.updateState({ styleSystem });
		console.log(`[BootLoader] Style system ${styleSystem} loaded`);
	}
	/**
	* Load and initialize shell
	*/
	async loadShell(shellId, container) {
		this.setPhase("shell");
		const normalizedShell = normalizeShellId(shellId);
		if (normalizedShell !== shellId) console.warn(`[BootLoader] Shell "${shellId}" is temporarily disabled, redirecting to "${normalizedShell}"`);
		console.log(`[BootLoader] Loading shell: ${normalizedShell}`);
		const shell = await ShellRegistry.load(normalizedShell, container);
		this.shellInstance = shell;
		this.updateState({ shell: normalizedShell });
		console.log(`[BootLoader] Shell ${normalizedShell} loaded`);
		return shell;
	}
	/**
	* Initialize service channels: one high-priority channel blocks boot, the rest
	* run when the browser is idle so startup stays within interactive budgets.
	*/
	async initChannels(channelIds, priorityId) {
		this.setPhase("channels");
		const unique = [...new Set(channelIds)];
		if (unique.length === 0) return;
		const primary = (priorityId && unique.includes(priorityId) ? priorityId : null) ?? unique[0];
		const rest = unique.filter((id) => id !== primary);
		console.log(`[BootLoader] Initializing primary channel:`, primary, rest.length ? `(+${rest.length} deferred)` : "");
		try {
			await serviceChannels.initChannel(primary);
		} catch (error) {
			console.warn(`[BootLoader] Failed to init primary channel ${primary}:`, error);
		}
		if (rest.length === 0) {
			console.log("[BootLoader] Channels initialized");
			return;
		}
		const runDeferred = () => {
			(async () => {
				for (const channelId of rest) try {
					await serviceChannels.initChannel(channelId);
				} catch (error) {
					console.warn(`[BootLoader] Failed to init channel ${channelId}:`, error);
				}
				console.log("[BootLoader] Deferred channels initialized:", rest);
			})();
		};
		if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(runDeferred, { timeout: 5e3 });
		else globalThis.setTimeout?.(runDeferred, 0);
	}
	/**
	* Update state and notify handlers
	*/
	updateState(partial) {
		Object.assign(this.state, partial);
		this.notifyStateChange();
	}
	/**
	* Set current phase and notify handlers
	*/
	setPhase(phase) {
		this.updateState({ phase });
		const handlers = this.phaseHandlers.get(phase);
		if (handlers) for (const handler of handlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] Phase handler error:`, error);
		}
	}
	/**
	* Notify all state change handlers
	*/
	notifyStateChange() {
		for (const handler of this.stateChangeHandlers) try {
			handler(this.state);
		} catch (error) {
			console.error(`[BootLoader] State handler error:`, error);
		}
	}
	/**
	* Subscribe to state changes
	*/
	onStateChange(handler) {
		this.stateChangeHandlers.add(handler);
		return () => {
			this.stateChangeHandlers.delete(handler);
		};
	}
	/**
	* Register a phase handler
	*/
	onPhase(phase, handler) {
		if (!this.phaseHandlers.has(phase)) this.phaseHandlers.set(phase, /* @__PURE__ */ new Set());
		this.phaseHandlers.get(phase).add(handler);
		return () => {
			this.phaseHandlers.get(phase)?.delete(handler);
		};
	}
	/**
	* Get current state
	*/
	getState() {
		return { ...this.state };
	}
	/**
	* Get current shell instance
	*/
	getShell() {
		return this.shellInstance;
	}
	/**
	* Save boot preferences
	*/
	savePreferences(config) {
		try {
			const normalizedShell = normalizeShellId(config.shell);
			localStorage.setItem("rs-boot-style", config.styleSystem);
			localStorage.setItem("rs-boot-shell", normalizedShell);
			localStorage.setItem("rs-boot-view", config.defaultView);
			localStorage.setItem("rs-boot-remember", "1");
		} catch (error) {
			console.warn("[BootLoader] Failed to save preferences:", error);
		}
	}
	/**
	* Load boot preferences
	*/
	loadPreferences() {
		try {
			if (localStorage.getItem("rs-boot-remember") !== "1") return null;
			const shell = normalizeShellId(localStorage.getItem("rs-boot-shell") || "minimal");
			return {
				styleSystem: localStorage.getItem("rs-boot-style") || void 0,
				shell,
				defaultView: localStorage.getItem("rs-boot-view") || void 0
			};
		} catch {
			return null;
		}
	}
	/**
	* Clear preferences
	*/
	clearPreferences() {
		try {
			localStorage.removeItem("rs-boot-style");
			localStorage.removeItem("rs-boot-shell");
			localStorage.removeItem("rs-boot-view");
			localStorage.removeItem("rs-boot-remember");
			localStorage.removeItem(LS_BOOT_SHELL_LAST_ACTIVE);
		} catch {}
	}
};
/**
* Get the singleton boot loader
*/
var bootLoader = BootLoader.getInstance();
async function bootTabbed(container, view = "home") {
	const channels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"airpad",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "tabbed",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
async function bootEnvironment(container, view = "home") {
	const channels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"airpad",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "environment",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
/**
* Boot with Minimal shell
*/
async function bootMinimal(container, view = "viewer", options) {
	const defaultView = pickEnabledView(view, "viewer");
	/** Minimal shell: init only the active view's channel — others register on first navigate (see ShellBase.loadView). */
	const channels = isEnabledView(defaultView) ? [defaultView] : ["viewer"];
	const channelPriorityId = channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "minimal",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
async function bootWindow(container, view = "home") {
	const channels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"airpad",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.find((c) => c === defaultView) ?? channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "window",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: true
	});
}
/**
* Boot with Raw shell (minimal)
*/
async function bootBase(container, view = "viewer") {
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "base",
		defaultView: pickEnabledView(view, "viewer"),
		channels: [],
		rememberChoice: false
	});
}
async function bootContent(container, view = "home", options) {
	const defaultChannels = [
		"workcenter",
		"settings",
		"viewer",
		"explorer",
		"history",
		"editor",
		"airpad",
		"home"
	].filter((channelId) => isEnabledView(channelId));
	const channels = options?.channels !== void 0 ? options.channels : defaultChannels;
	const defaultView = pickEnabledView(view, "home");
	const channelPriorityId = channels.length > 0 ? channels.find((c) => c === defaultView) ?? channels[0] : void 0;
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "content",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
/**
* Immersive (chromeless): extension side panels / fullscreen single-view contexts.
*/
async function bootImmersive(container, view = "viewer", options) {
	const defaultView = pickEnabledView(view, "viewer");
	const channels = isEnabledView(defaultView) ? [defaultView] : ["viewer"];
	const channelPriorityId = channels[0];
	return bootLoader.boot(container, {
		styleSystem: "vl-basic",
		shell: "immersive",
		defaultView,
		channels,
		channelPriorityId,
		rememberChoice: options?.rememberChoice ?? true,
		skipInitialNavigate: options?.skipInitialNavigate ?? false
	});
}
//#endregion
export { bootEnvironment as a, bootTabbed as c, bootContent as i, bootWindow as l, BootLoader_exports as n, bootImmersive as o, bootBase as r, bootMinimal as s, BootLoader as t };
