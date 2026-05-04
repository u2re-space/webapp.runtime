import { r as __exportAll } from "./rolldown-runtime.js";
import { g as loadAsAdopted } from "../fest/dom.js";
import { a as initializeRegistries, c as startImplicitViewMessagingBridge, i as defaultTheme, o as lightTheme, r as darkTheme, t as ShellRegistry, u as serviceChannels } from "./registry.js";
import { f as isEnabledView, p as pickEnabledView } from "./views.js";
import { r as LS_BOOT_SHELL_LAST_ACTIVE, t as applyTheme } from "./Theme.js";
import { n as DEFAULT_SETTINGS } from "./SettingsTypes.js";
import { n as loadSettings } from "./Settings.js";
import { t as loadVeelaVariant } from "../fest/veela.js";
import { n as initCwsNativeBridge } from "../vendor/@capacitor_core.js";
import { t as applyHubSocketFromSettings } from "./hub-socket-boot.js";
//#region src/shared/routing/layer-manager.ts
/**
* Unified layer hierarchy - ORDER MATTERS!
*
* Layers are declared in this order to ensure:
* 1. Reset/normalize come first (lowest specificity wins)
* 2. Tokens (CSS custom properties) are available early
* 3. Runtime provides base component styles
* 4. Shell styles can override runtime
* 5. View styles can override shell
* 6. Overrides (theme, print, a11y) win last
*/
var LAYER_HIERARCHY = [
	{
		name: "ux-normalize",
		category: "system",
		order: 0,
		description: "Veela normalize layer"
	},
	{
		name: "layer.reset",
		category: "system",
		order: 0,
		description: "CSS reset rules"
	},
	{
		name: "layer.normalize",
		category: "system",
		order: 10,
		description: "Normalize browser defaults"
	},
	{
		name: "tokens",
		category: "system",
		order: 20,
		description: "Legacy tokens layer"
	},
	{
		name: "ux-tokens",
		category: "system",
		order: 20,
		description: "Veela token layer"
	},
	{
		name: "layer.tokens",
		category: "system",
		order: 20,
		description: "CSS custom properties (variables)"
	},
	{
		name: "base",
		category: "system",
		order: 30,
		description: "Legacy base layer"
	},
	{
		name: "ux-base",
		category: "system",
		order: 30,
		description: "Veela base layer"
	},
	{
		name: "layout",
		category: "system",
		order: 40,
		description: "Legacy layout layer"
	},
	{
		name: "ux-layout",
		category: "system",
		order: 40,
		description: "Veela layout layer"
	},
	{
		name: "components",
		category: "system",
		order: 50,
		description: "Legacy components layer"
	},
	{
		name: "ux-components",
		category: "system",
		order: 50,
		description: "Veela components layer"
	},
	{
		name: "utilities",
		category: "system",
		order: 60,
		description: "Legacy utilities layer"
	},
	{
		name: "ux-utilities",
		category: "system",
		order: 60,
		description: "Veela utilities layer"
	},
	{
		name: "ux-theme",
		category: "system",
		order: 70,
		description: "Veela theme layer"
	},
	{
		name: "ux-overrides",
		category: "system",
		order: 80,
		description: "Veela overrides layer"
	},
	{
		name: "layer.properties.shell",
		category: "system",
		order: 30,
		description: "Shell context custom properties"
	},
	{
		name: "layer.properties.views",
		category: "system",
		order: 35,
		description: "View context custom properties"
	},
	{
		name: "layer.runtime.base",
		category: "runtime",
		order: 100,
		description: "Veela runtime base styles"
	},
	{
		name: "layer.runtime.components",
		category: "runtime",
		order: 110,
		description: "Reusable component styles"
	},
	{
		name: "layer.runtime.forms",
		category: "runtime",
		order: 115,
		description: "Form element base styles"
	},
	{
		name: "layer.runtime.utilities",
		category: "runtime",
		order: 120,
		description: "Utility classes"
	},
	{
		name: "layer.runtime.animations",
		category: "runtime",
		order: 130,
		description: "Keyframes and animation definitions"
	},
	{
		name: "layer.boot",
		category: "runtime",
		order: 140,
		description: "Boot/choice screen styles"
	},
	{
		name: "boot.tokens",
		category: "runtime",
		order: 142,
		description: "Boot tokens layer"
	},
	{
		name: "boot.base",
		category: "runtime",
		order: 144,
		description: "Boot base layer"
	},
	{
		name: "boot.components",
		category: "runtime",
		order: 146,
		description: "Boot components layer"
	},
	{
		name: "boot.responsive",
		category: "runtime",
		order: 148,
		description: "Boot responsive adjustments"
	},
	{
		name: "layer.shell.common",
		category: "shell",
		order: 200,
		description: "Shared shell styles"
	},
	{
		name: "shell.tokens",
		category: "shell",
		order: 202,
		description: "Legacy shell tokens"
	},
	{
		name: "shell.base",
		category: "shell",
		order: 204,
		description: "Legacy shell base"
	},
	{
		name: "shell.components",
		category: "shell",
		order: 206,
		description: "Legacy shell components"
	},
	{
		name: "shell.utilities",
		category: "shell",
		order: 208,
		description: "Legacy shell utilities"
	},
	{
		name: "shell.overrides",
		category: "shell",
		order: 209,
		description: "Legacy shell overrides"
	},
	{
		name: "layer.shell.raw",
		category: "shell",
		order: 210,
		description: "Raw shell (minimal)"
	},
	{
		name: "layer.shell.minimal",
		category: "shell",
		order: 220,
		description: "Minimal shell (toolbar navigation)"
	},
	{
		name: "layer.shell.minimal.layout",
		category: "shell",
		order: 222,
		description: "Minimal shell layout rules"
	},
	{
		name: "layer.shell.minimal.components",
		category: "shell",
		order: 224,
		description: "Minimal shell component styles"
	},
	{
		name: "layer.shell.window",
		category: "shell",
		order: 226,
		description: "Window shell (desktop/process frames)"
	},
	{
		name: "layer.shell.faint",
		category: "shell",
		order: 230,
		description: "Faint shell (tabbed sidebar)"
	},
	{
		name: "layer.shell.faint.layout",
		category: "shell",
		order: 232,
		description: "Faint shell layout"
	},
	{
		name: "layer.shell.faint.sidebar",
		category: "shell",
		order: 234,
		description: "Faint shell sidebar"
	},
	{
		name: "layer.shell.faint.toolbar",
		category: "shell",
		order: 236,
		description: "Faint shell toolbar"
	},
	{
		name: "layer.shell.faint.forms",
		category: "shell",
		order: 238,
		description: "Faint shell form components"
	},
	{
		name: "layer.view.common",
		category: "view",
		order: 300,
		description: "Shared view styles"
	},
	{
		name: "layer.view.viewer",
		category: "view",
		order: 310,
		description: "Markdown viewer"
	},
	{
		name: "layer.view.workcenter",
		category: "view",
		order: 320,
		description: "Work center (AI prompts)"
	},
	{
		name: "layer.view.workcenter.keyframes",
		category: "view",
		order: 322,
		description: "Work center animations"
	},
	{
		name: "view.workcenter",
		category: "view",
		order: 324,
		description: "Work center styles (legacy name)"
	},
	{
		name: "view.workcenter.animations",
		category: "view",
		order: 326,
		description: "Work center animations (legacy name)"
	},
	{
		name: "layer.view.settings",
		category: "view",
		order: 330,
		description: "Settings view"
	},
	{
		name: "layer.view.explorer",
		category: "view",
		order: 340,
		description: "File explorer"
	},
	{
		name: "layer.view.history",
		category: "view",
		order: 350,
		description: "History view"
	},
	{
		name: "layer.view.editor",
		category: "view",
		order: 360,
		description: "Editor view"
	},
	{
		name: "layer.view.editor.markdown",
		category: "view",
		order: 362,
		description: "Markdown editor sublayer"
	},
	{
		name: "layer.view.editor.quill",
		category: "view",
		order: 364,
		description: "Quill editor sublayer"
	},
	{
		name: "layer.view.airpad",
		category: "view",
		order: 370,
		description: "Airpad (touch input)"
	},
	{
		name: "view.airpad",
		category: "view",
		order: 371,
		description: "Airpad SCSS @layer view.airpad (alias)"
	},
	{
		name: "layer.view.home",
		category: "view",
		order: 380,
		description: "Home/landing view"
	},
	{
		name: "layer.view.print",
		category: "view",
		order: 390,
		description: "Print view"
	},
	{
		name: "view-explorer",
		category: "view",
		order: 392,
		description: "Explorer legacy layered scope"
	},
	{
		name: "view-transitions",
		category: "override",
		order: 850,
		description: "View Transition API named targets and keyframes"
	},
	{
		name: "layer.override.theme",
		category: "override",
		order: 900,
		description: "Theme customizations"
	},
	{
		name: "layer.override.print",
		category: "override",
		order: 910,
		description: "Print media styles"
	},
	{
		name: "layer.override.a11y",
		category: "override",
		order: 920,
		description: "Accessibility enhancements"
	}
];
var _initialized = false;
/**
* Initialize CSS layer order
*
* MUST be called before any other styles are loaded to ensure
* the cascade layer order is established correctly.
*
* This function is idempotent - calling it multiple times is safe.
*
* @example
* ```ts
* // In application entry point
* import { initializeLayers } from './shared/layer-manager';
*
* async function main() {
*     // Initialize layers FIRST
*     initializeLayers();
*
*     // Then load styles
*     await loadStyleSystem('vl-advanced');
*     // ...
* }
* ```
*/
function initializeLayers() {
	if (_initialized) {
		console.debug("[LayerManager] Already initialized");
		return;
	}
	if (typeof document === "undefined") {
		console.warn("[LayerManager] No document available (SSR context?)");
		return;
	}
	const layerNames = [...LAYER_HIERARCHY].sort((a, b) => a.order - b.order).map((l) => l.name);
	const layerRule = `@layer ${layerNames.join(", ")};`;
	const style = document.createElement("style");
	style.id = "css-layer-init";
	style.setAttribute("data-layer-manager", "true");
	style.textContent = layerRule;
	const head = document.head;
	head.insertBefore(style, head.firstChild);
	_initialized = true;
	console.log(`[LayerManager] Initialized ${layerNames.length} layers`);
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
//#region src/frontend/boot/ts/BootLoader.ts
/**
* Boot Loader - Shell/Style Initialization System
* 
* Manages the boot sequence for the CrossWord application:
* 1. Load style system (Veela CSS or Minimal)
* 2. Initialize shell (frame/layout/environment)
* 3. Load view/component/module
* 4. Connect uniform channels
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
	bootEnvironment: () => bootEnvironment,
	bootLoader: () => bootLoader,
	bootMinimal: () => bootMinimal,
	bootTabbed: () => bootTabbed,
	bootWindow: () => bootWindow,
	default: () => bootLoader
});
var normalizeShellId = (shell) => {
	if (shell === "faint") return "tabbed";
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
		recommendedShells: ["base"]
	},
	"vl-core": {
		name: "Core (Shared Foundation)",
		stylesheets: [],
		description: "Shared foundation styles for all veela variants",
		recommendedShells: ["base", "minimal"]
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
			"base",
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
			const [persistedSettings] = await Promise.all([loadSettings().catch((error) => {
				console.warn("[BootLoader] Failed to load settings:", error);
				return null;
			}), this.loadStyles(config.styleSystem)]);
			if (persistedSettings) applyHubSocketFromSettings(persistedSettings).catch(() => void 0);
			const persistedTheme = this.resolveThemeFromSettings(persistedSettings);
			const shell = await this.loadShell(config.shell, container);
			shell.setTheme(config.theme || persistedTheme);
			applyTheme(persistedSettings ?? DEFAULT_SETTINGS);
			await shell.mount(container);
			this.implicitBridgeCleanup?.();
			this.implicitBridgeCleanup = startImplicitViewMessagingBridge();
			if (config.channels && config.channels.length > 0) await this.initChannels(config.channels, config.channelPriorityId);
			await shell.navigate(config.defaultView);
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
async function bootMinimal(container, view = "viewer") {
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
		rememberChoice: true
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
//#endregion
export { bootTabbed as a, bootMinimal as i, bootBase as n, bootWindow as o, bootEnvironment as r, initializeLayers as s, BootLoader_exports as t };
