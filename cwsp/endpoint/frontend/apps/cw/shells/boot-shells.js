import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { f as isEnabledView, n as ENABLED_VIEW_IDS, p as pickEnabledView, t as DEFAULT_VIEW_ID } from "../chunks/views.js";
import "../fest/dom.js";
import "../chunks/app-layers.js";
import { Y as defineElement } from "../com/app.js";
import "../chunks/Settings.js";
import "../chunks/channel-mixin.js";
import { a as readLastActiveBootShell, c as darkTheme, d as lightTheme, f as registerDefaultShells, i as normalizeBootShellId, l as defaultTheme, n as coerceShellForBootViewport, p as registerDefaultViews, u as initializeRegistries } from "./preference.js";
import "../views/prefetch.js";
import "../chunks/Theme.js";
import "../fest/icon.js";
import { t as UIElement } from "../com/app2.js";
import { t as __decorate } from "../chunks/decorate.js";
import { a as bootEnvironment, c as bootTabbed, i as bootContent, l as bootWindow, o as bootImmersive, r as bootBase, s as bootMinimal, t as BootLoader } from "../chunks/BootLoader.js";
import "../vendor/@capacitor_core.js";
import "../chunks/config.js";
import "../chunks/hub-socket-boot.js";
import "../chunks/websocket.js";
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
