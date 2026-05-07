import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as initializeLayers } from "../chunks/layer-manager.js";
import { f as isEnabledView, n as ENABLED_VIEW_IDS, p as pickEnabledView, t as DEFAULT_VIEW_ID } from "../chunks/views.js";
import { p as loadAsAdopted } from "../fest/dom.js";
import "../chunks/app-layers.js";
import { Y as defineElement } from "../com/app.js";
import "../chunks/Settings.js";
import { i as serviceChannels } from "../chunks/channel-mixin.js";
import { a as initializeRegistries, c as registerDefaultViews, i as defaultTheme, l as startImplicitViewMessagingBridge, o as lightTheme, r as darkTheme, s as registerDefaultShells, t as ShellRegistry } from "../chunks/registry.js";
import { n as initCwsNativeBridge } from "../chunks/cws-bridge.js";
import { t as loadSettings } from "../chunks/Settings2.js";
import { n as applyTheme, r as DEFAULT_SETTINGS, t as loadStyleSystem } from "../chunks/styles.js";
import "../chunks/config.js";
import "../views/prefetch.js";
import "../chunks/Theme.js";
import "../fest/icon.js";
import { t as UIElement } from "../com/app2.js";
import { t as __decorate } from "../chunks/decorate.js";
import { t as applyHubSocketFromSettings } from "../chunks/hub-socket-boot.js";
import "../chunks/websocket2.js";
//#region src/frontend/shells/boot/registry.ts
var ViewBase = class ViewBase extends UIElement {
	__options;
	__initialized = false;
	/** Per-element broadcast surface for intra-view messaging (slots, decorators, tooling). Separate from CWSP routing. */
	__viewChannel = null;
	set options(value) {
		this.__options = value;
	}
	get options() {
		return this.__options;
	}
	get viewChannel() {
		if (!this.__viewChannel) this.__viewChannel = new EventTarget();
		return this.__viewChannel;
	}
	dispatchViewChannel(type, detail, init) {
		return this.viewChannel.dispatchEvent(new CustomEvent(type, {
			...init,
			detail
		}));
	}
	subscribeViewChannel(type, listener) {
		const bus = this.viewChannel;
		bus.addEventListener(type, listener);
		return () => bus.removeEventListener(type, listener);
	}
	viewInitialize() {
		const opts = this.options;
		opts?.initializator?.call?.(this, this, opts);
		return this;
	}
	constructor() {
		super();
	}
	onInitialize() {
		super.onInitialize?.call?.(this);
		this?.viewInitialize?.call?.(this);
		return this;
	}
};
ViewBase = __decorate([defineElement("cw-view-base")], ViewBase);
//#endregion
//#region ../../modules/projects/subsystem/src/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
var LAST_ACTIVE_MAX_MS = 720 * 60 * 60 * 1e3;
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
	return "minimal";
}
/**
* Treat narrow and coarse-pointer layouts as “mobile shell” — prefer minimal shell there.
*/
function isMobileBootShellViewport() {
	if (typeof globalThis.matchMedia !== "function") return false;
	try {
		const narrow = globalThis.matchMedia("(max-width: 768px)").matches;
		const coarse = globalThis.matchMedia("(pointer: coarse)").matches;
		const coarseTablet = globalThis.matchMedia("(max-width: 1024px)").matches;
		return narrow || coarse && coarseTablet;
	} catch {
		return false;
	}
}
/** Experimental environment shell is not the default on mobile / small screens. */
function coerceShellForBootViewport(shell) {
	if (!isMobileBootShellViewport()) return shell;
	if (shell === "environment") return "minimal";
	return shell;
}
function readLastActiveBootShell() {
	try {
		const raw = globalThis.localStorage?.getItem(LS_BOOT_SHELL_LAST_ACTIVE);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.t !== "number" || typeof parsed.shell !== "string") return null;
		if (Date.now() - parsed.t > LAST_ACTIVE_MAX_MS) return null;
		return normalizeBootShellId(parsed.shell);
	} catch {
		return null;
	}
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
				const { initIngressPWA } = await import("../chunks/sw-handling.js").then((n) => n.s);
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
//#region ../../modules/projects/subsystem/src/boot/routing.ts
var normalizeShellPreference = (shell) => normalizeBootShellId(shell);
var getShellFromQuery = () => {
	try {
		const shell = (new URLSearchParams(location.search).get("shell") || "").trim().toLowerCase();
		if (shell === "minimal" || shell === "faint" || shell === "base" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return normalizeShellPreference(shell);
	} catch {}
	return null;
};
/** All registered view routes */
var VALID_VIEWS = [...ENABLED_VIEW_IDS];
pickEnabledView("home", DEFAULT_VIEW_ID);
/**
* Normalize pathname (remove base, leading/trailing slashes)
*/
function normalizePathname(pathname) {
	const base = document.querySelector("base")?.getAttribute("href") || "/";
	let normalized = pathname;
	if (base !== "/" && pathname.startsWith(base.replace(/\/$/, ""))) normalized = pathname.slice(base.replace(/\/$/, "").length);
	return normalized.replace(/^\/+|\/+$/g, "").toLowerCase();
}
/**
* Build URL from route
*/
function buildUrl(route) {
	let url = "/";
	if (route.params && Object.keys(route.params).length > 0) {
		const search = new URLSearchParams(route.params).toString();
		url += "?" + search;
	}
	return url;
}
/**
* Navigate to a route (view)
*/
function navigate(route, options = {}) {
	const url = buildUrl(route);
	if (options.replace) history.replaceState(options.state ?? route, "", url);
	else history.pushState(options.state ?? route, "", url);
	globalThis?.dispatchEvent?.(new CustomEvent("route-change", { detail: route }));
}
/**
* Navigate to a view
*/
function navigateToView(view, params) {
	navigate({
		view,
		params
	});
}
/**
* Check if a view is valid
*/
function isValidView(view) {
	return isEnabledView(view);
}
/**
* Get view from pathname
*/
function getViewFromPath() {
	const pathname = normalizePathname(location.pathname);
	if (!pathname || pathname === "/" || pathname === "") {
		const fromState = history.state?.viewId || "";
		if (fromState && isValidView(fromState)) return fromState;
		return null;
	}
	if (isValidView(pathname)) return pathname;
	return null;
}
/**
* Get saved shell preference
*/
function getSavedShellPreference() {
	const fromQuery = getShellFromQuery();
	if (fromQuery) {
		try {
			localStorage.setItem("rs-boot-shell", fromQuery);
		} catch {}
		return coerceShellForBootViewport(fromQuery);
	}
	try {
		const saved = localStorage.getItem("rs-boot-shell");
		if (saved === "minimal" || saved === "faint" || saved === "base" || saved === "window" || saved === "tabbed" || saved === "environment" || saved === "content" || saved === "immersive") {
			const normalized = normalizeShellPreference(saved);
			if (normalized !== saved) localStorage.setItem("rs-boot-shell", normalized);
			return coerceShellForBootViewport(normalized);
		}
		const lastActive = readLastActiveBootShell();
		if (lastActive && lastActive !== "immersive" && lastActive !== "content") return coerceShellForBootViewport(lastActive);
	} catch {}
	return null;
}
/**
* Resolve the shell/view pair to mount and return a lazy mount entrypoint.
*
* AI-READ: this function does not mount immediately. It chooses the canonical
* shell, normalizes legacy aliases, picks a default view for that shell, and
* returns a loader object that the outer app entry can mount into the chosen
* shell layer.
*/
var loadSubAppWithShell = async (shellId, initialView) => {
	const shell = normalizeShellPreference(shellId || getSavedShellPreference() || "minimal");
	const shellDefaultView = shell === "base" || shell === "immersive" || shell === "minimal" ? "viewer" : "home";
	const view = pickEnabledView(initialView || getViewFromPath() || shellDefaultView, "home");
	console.log("[App] Loading sub-app with shell:", shell, "view:", view);
	try {
		switch (shell) {
			case "faint":
			case "tabbed": return { mount: async (el) => {
				await bootTabbed(el, view);
			} };
			case "environment": return { mount: async (el) => {
				await bootEnvironment(el, view);
			} };
			case "base": return { mount: async (el) => {
				await bootBase(el, view);
			} };
			case "immersive": return { mount: async (el) => {
				await bootImmersive(el, view);
			} };
			case "content": return { mount: async (el) => {
				await bootContent(el, view);
			} };
			case "window": return { mount: async (el) => {
				await bootWindow(el, view);
			} };
			case "minimal": return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
			default: return { mount: async (el) => {
				await bootMinimal(el, view);
			} };
		}
	} catch (error) {
		console.error("[App] Failed to load sub-app:", shell, error);
		throw error;
	}
};
//#endregion
//#region src/frontend/shells/boot/index.ts
var boot_exports = /* @__PURE__ */ __exportAll({
	BootLoader: () => BootLoader,
	VALID_VIEWS: () => VALID_VIEWS,
	ViewBase: () => ViewBase,
	bootBase: () => bootBase,
	bootContent: () => bootContent,
	bootEnvironment: () => bootEnvironment,
	bootImmersive: () => bootImmersive,
	bootMinimal: () => bootMinimal,
	bootTabbed: () => bootTabbed,
	bootWindow: () => bootWindow,
	buildUrl: () => buildUrl,
	darkTheme: () => darkTheme,
	defaultTheme: () => defaultTheme,
	getSavedShellPreference: () => getSavedShellPreference,
	getShellFromQuery: () => getShellFromQuery,
	getViewFromPath: () => getViewFromPath,
	initializeRegistries: () => initializeRegistries,
	isValidView: () => isValidView,
	lightTheme: () => lightTheme,
	loadSubAppWithShell: () => loadSubAppWithShell,
	navigate: () => navigate,
	navigateToView: () => navigateToView,
	registerDefaultShells: () => registerDefaultShells,
	registerDefaultViews: () => registerDefaultViews
});
//#endregion
export { navigateToView as n, boot_exports as t };
