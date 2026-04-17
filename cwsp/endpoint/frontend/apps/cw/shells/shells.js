import { _ as preloadStyle, g as loadInlineStyle } from "../fest/dom.js";
import { u as ref } from "../fest/object.js";
import { c as MinimalShellHostElement, l as ensureShellElementDefined, n as ViewRegistry } from "../com/app2.js";
import { l as dynamicTheme } from "../com/app3.js";
import { o as ensureStyleSheet } from "../fest/icon.js";
import { n as ENABLED_VIEW_IDS, r as isEnabledView } from "../chunks/views.js";
import { r as initBootShellWindowActivity } from "./preference.js";
import { i as saveSettings, r as loadSettings } from "../com/service11.js";
import { n as syncBrowserChromeTheme, t as applyTheme } from "../com/service12.js";
import { a as showToast } from "../com/app5.js";
//#region src/frontend/shared/routing/view-transitions.ts
/**
* Canonical view order used to determine navigation direction.
* Earlier index = "back", later index = "forward".
*/
var VIEW_ORDER = [
	"home",
	"viewer",
	"editor",
	"explorer",
	"workcenter",
	"airpad",
	"history",
	"settings",
	"print"
];
/** `true` when `document.startViewTransition` is available (Chrome 111+). */
var supportsViewTransitions = () => typeof document !== "undefined" && "startViewTransition" in document;
/**
* Compute navigation direction based on the ordered view list.
*
* Unknown view IDs fall back to `"fade"` (no slide animation).
*/
function getTransitionDirection(from, to) {
	const fi = VIEW_ORDER.indexOf(from);
	const ti = VIEW_ORDER.indexOf(to);
	if (fi === -1 || ti === -1 || fi === ti) return "fade";
	return fi < ti ? "forward" : "backward";
}
/**
* Wrap a DOM mutation in a View Transition, with a transparent fallback.
*
* Before starting the transition, `data-vt-direction` is set on `:root` so
* CSS `::view-transition-old/new(active-view)` can select the right keyframe
* animation via inherited CSS custom properties.
*
* If a transition is already running, the browser will abort the previous one
* and start the new one — this is intentional and handled gracefully.
*/
async function withViewTransition(update, options = {}) {
	if (!supportsViewTransitions()) {
		await update();
		return;
	}
	const { direction = "fade", types } = options;
	document.documentElement.dataset.vtDirection = direction;
	const doc = document;
	const transition = types?.length ? doc.startViewTransition({
		update,
		types
	}) : doc.startViewTransition(update);
	try {
		await (transition.updateCallbackDone ?? transition.finished);
	} catch {} finally {
		delete document.documentElement.dataset.vtDirection;
	}
	transition.finished.catch(() => {});
}
//#endregion
//#region src/frontend/shared/routing/view-prefetch.ts
/**
* Low-priority prefetch of view chunks after the focused view is interactive.
*/
function scheduleIdle(fn, timeoutMs) {
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(fn, { timeout: timeoutMs });
	else globalThis.setTimeout?.(fn, 32);
}
/**
* Stagger dynamic imports for non-current views so the next navigation is faster
* without competing with the active view's work.
*/
function scheduleViewModulePrefetch(currentViewId) {
	const others = ENABLED_VIEW_IDS.filter((id) => id !== currentViewId);
	if (others.length === 0) return;
	let index = 0;
	const step = () => {
		const id = others[index++];
		if (!id) return;
		ViewRegistry.prefetchModule(id);
		scheduleIdle(step, 6e3);
	};
	scheduleIdle(step, 2500);
}
//#endregion
//#region src/frontend/shells/shells.ts
/**
* Abstract base shell with common functionality
*/
var ShellBase = class {
	theme = ref({
		id: "auto",
		name: "Auto",
		colorScheme: "auto"
	});
	currentView = ref("home");
	navigationState = {
		currentView: "home",
		viewHistory: []
	};
	container = null;
	rootElement = null;
	contentContainer = null;
	toolbarContainer = null;
	toolbarViewSlot = null;
	toolbarThemeSlot = null;
	statusContainer = null;
	overlayContainer = null;
	loadedViews = /* @__PURE__ */ new Map();
	currentViewElement = null;
	navigationToken = 0;
	mounted = false;
	themeCycleButton = null;
	themeCycleIcon = null;
	themeAttrObserver = null;
	shellActivityDispose = null;
	async mount(container) {
		if (this.mounted) {
			console.warn(`[${this.id}] Shell already mounted`);
			return;
		}
		this.container = container;
		const stylesheet = this.getStylesheet();
		if (stylesheet) {
			if (await preloadStyle(stylesheet)) await loadInlineStyle(stylesheet);
		}
		const shellTagName = ensureShellElementDefined(this.id);
		const shellHost = document.createElement(shellTagName);
		const shellLayout = this.createLayout();
		shellHost.mountShellLayout(shellLayout);
		this.rootElement = shellHost;
		const shellCss = this.getStylesheet();
		if (shellCss && shellHost.shadowRoot) loadInlineStyle(shellCss, shellHost.shadowRoot);
		if (shellHost instanceof MinimalShellHostElement && shellHost.shadowRoot) {
			const iconSheet = ensureStyleSheet();
			if (iconSheet) try {
				const cur = [...shellHost.shadowRoot.adoptedStyleSheets];
				if (!cur.includes(iconSheet)) shellHost.shadowRoot.adoptedStyleSheets = [...cur, iconSheet];
			} catch (e) {
				console.warn("[Shell] Could not adopt icon registry stylesheet into minimal shell shadow:", e);
			}
		}
		this.rootElement.setAttribute("data-shell", this.id);
		this.rootElement.setAttribute("data-shell-system", "task-tab");
		this.rootElement.style.gridColumn = "content-column";
		this.rootElement.style.gridRow = "content-row";
		this.rootElement.style.alignSelf = "stretch";
		this.rootElement.style.justifySelf = "stretch";
		this.rootElement.style.minInlineSize = "0";
		this.rootElement.style.minBlockSize = "0";
		this.rootElement.style.pointerEvents = "auto";
		this.contentContainer = shellLayout.querySelector("[data-shell-content]") || shellLayout;
		this.toolbarContainer = shellLayout.querySelector("[data-shell-toolbar]");
		this.statusContainer = shellLayout.querySelector("[data-shell-status]");
		this.overlayContainer = shellLayout.querySelector("[data-shell-overlays]");
		this.ensureToolbarChrome();
		this.applyTheme(this.getThemeRefValue());
		this.bindThemeAttrObserver();
		container.replaceChildren(this.rootElement);
		this.mounted = true;
		this.shellActivityDispose = initBootShellWindowActivity(this.id);
		this.syncNavigationFromUrl();
		try {
			globalThis.__LURE_DYNAMIC_THEME_PRIORITY__ = true;
			dynamicTheme(document.documentElement);
		} catch (e) {
			console.warn(`[${this.id}] dynamicTheme init failed:`, e);
		}
		console.log(`[${this.id}] Shell mounted with data-shell="${this.id}"`);
	}
	/** Match route search params (order-insensitive). */
	sameRouteParams(a, b) {
		const ea = new URLSearchParams(a || {});
		const eb = new URLSearchParams(b || {});
		if (ea.toString() === eb.toString()) return true;
		const keys = new Set([...ea.keys(), ...eb.keys()]);
		for (const k of keys) if (ea.get(k) !== eb.get(k)) return false;
		return true;
	}
	/**
	* When the shell mounts on a path-backed view, mirror it into navigation state so
	* boot / first navigate() does not treat a placeholder as the previous view.
	*/
	syncNavigationFromUrl() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		const stateView = (globalThis?.history?.state)?.viewId;
		const fromPath = this.getViewFromPathname();
		const resolved = stateView && isEnabledView(String(stateView)) ? stateView : fromPath && isEnabledView(String(fromPath)) ? fromPath : null;
		if (!resolved) return;
		this.navigationState.currentView = resolved;
		this.navigationState.previousView = void 0;
		this.navigationState.params = Object.fromEntries(new URLSearchParams(globalThis.location?.search || ""));
		this.currentView.value = resolved;
		this.navigationState.viewHistory = [resolved];
	}
	unmount() {
		if (!this.mounted) return;
		this.shellActivityDispose?.();
		this.shellActivityDispose = null;
		for (const [viewId] of this.loadedViews) try {
			ViewRegistry.unload(viewId);
		} catch (e) {
			console.warn(`[${this.id}] View ${viewId} unmount error:`, e);
		}
		this.loadedViews.clear();
		this.rootElement?.remove();
		this.rootElement = null;
		this.contentContainer = null;
		this.toolbarContainer = null;
		this.statusContainer = null;
		this.overlayContainer = null;
		this.container = null;
		this.mounted = false;
		this.themeAttrObserver?.disconnect();
		this.themeAttrObserver = null;
		console.log(`[${this.id}] Shell unmounted`);
	}
	async navigate(viewId, params) {
		console.log(`[${this.id}] Navigating to: ${viewId}`, params);
		const navToken = ++this.navigationToken;
		if (viewId === this.currentView.value && this.sameRouteParams(params, this.navigationState.params)) {
			const entry = this.loadedViews.get(viewId);
			if (entry?.element.isConnected && (this.contentContainer?.contains(entry.element) || this.rootElement?.contains(entry.element)) && !entry.element.hidden) return;
		}
		const previousView = this.navigationState.currentView;
		this.navigationState.previousView = previousView;
		this.navigationState.currentView = viewId;
		this.navigationState.params = params;
		if (this.navigationState.viewHistory[this.navigationState.viewHistory.length - 1] !== viewId) {
			this.navigationState.viewHistory.push(viewId);
			if (this.navigationState.viewHistory.length > 50) this.navigationState.viewHistory.shift();
		}
		this.currentView.value = viewId;
		if (typeof window !== "undefined" && typeof window != "undefined") {
			const searchParams = new URLSearchParams(params || {});
			const isPathRoutedShell = this.id === "base" || this.id === "minimal";
			if (isPathRoutedShell) searchParams.set("shell", this.id);
			const search = searchParams.toString() ? "?" + searchParams.toString() : "";
			const newPathAndSearch = (isPathRoutedShell ? `/${String(viewId || "home").replace(/^\/+/, "")}` : "/") + search;
			try {
				const next = new URL(newPathAndSearch, globalThis.location.origin);
				const cur = new URL(globalThis.location.href);
				if (next.pathname !== cur.pathname || next.search !== cur.search) globalThis?.history?.pushState?.({
					viewId,
					params
				}, "", next.pathname + next.search);
			} catch {
				if (globalThis?.location?.pathname !== "/" || (globalThis?.location?.search || "") !== search) globalThis?.history?.pushState?.({
					viewId,
					params
				}, "", newPathAndSearch);
			}
		}
		try {
			const element = await this.loadView(viewId, params);
			if (navToken !== this.navigationToken) return;
			await this.renderViewWithTransition(element);
			if (navToken !== this.navigationToken) return;
			scheduleViewModulePrefetch(viewId);
		} catch (error) {
			console.error(`[${this.id}] Failed to load view ${viewId}:`, error);
			this.showMessage(`Failed to load ${viewId}`);
		}
	}
	async loadView(viewId, params) {
		let initialData;
		const bodyToken = params?._bodyToken;
		if (bodyToken) try {
			const raw = globalThis?.sessionStorage?.getItem?.(bodyToken);
			if (raw != null) {
				globalThis?.sessionStorage?.removeItem?.(bodyToken);
				try {
					initialData = JSON.parse(raw);
				} catch {
					initialData = raw;
				}
			}
		} catch {}
		const cached = this.loadedViews.get(viewId);
		if (cached) {
			if (!cached.element.isConnected) {
				const refreshed = cached.view.render({
					shellContext: this.getContext(),
					params,
					initialData
				});
				this.loadedViews.set(viewId, {
					view: cached.view,
					element: refreshed
				});
				if (cached.view.lifecycle?.onMount) await cached.view.lifecycle.onMount();
				return refreshed;
			}
			if (cached.view.getToolbar && this.toolbarContainer) {
				const toolbar = cached.view.getToolbar();
				this.setViewToolbar(toolbar);
			}
			return cached.element;
		}
		const view = await ViewRegistry.load(viewId, {
			shellContext: this.getContext(),
			params,
			initialData
		});
		const element = view.render({
			shellContext: this.getContext(),
			params,
			initialData
		});
		this.loadedViews.set(viewId, {
			view,
			element
		});
		if (view.getToolbar && this.toolbarContainer) {
			const toolbar = view.getToolbar();
			this.setViewToolbar(toolbar);
		}
		if (view.lifecycle?.onMount) await view.lifecycle.onMount();
		return element;
	}
	setTheme(theme) {
		this.theme.value = theme;
		this.applyTheme(theme);
		this.syncThemeToolbarControls();
	}
	getContext() {
		return {
			shellId: this.id,
			navigate: (viewId, params) => this.navigate(viewId, params),
			goBack: () => this.goBack(),
			showMessage: (msg, duration) => this.showMessage(msg, duration),
			navigationState: this.navigationState,
			theme: this.getThemeRefValue(),
			layout: this.layout,
			getContentContainer: () => this.contentContainer,
			getOverlayContainer: () => this.overlayContainer,
			getToolbarContainer: () => this.toolbarContainer,
			setViewToolbar: (toolbar) => this.setViewToolbar(toolbar)
		};
	}
	getElement() {
		if (!this.rootElement) throw new Error(`[${this.id}] Shell not mounted`);
		return this.rootElement;
	}
	/**
	* Perform the raw DOM swap for a view change (no transition animation).
	*
	* This is the synchronous inner mutation used both as a standalone call
	* and as the update callback inside `renderViewWithTransition`.
	* `onHide` must be called by the caller BEFORE invoking this when using
	* a view transition so the old view's final state is captured correctly.
	*/
	renderView(element) {
		if (!this.contentContainer) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.contentContainer.contains(prev.element)) prev.element.remove();
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		if (!this.contentContainer.contains(element)) this.contentContainer.appendChild(element);
		this.currentViewElement = element;
	}
	/**
	* Render a view with a View Transition animation.
	*
	* Calls `onHide` on the outgoing view BEFORE the transition starts so the
	* browser captures the old view in its final settled state.  The actual
	* DOM swap runs inside `document.startViewTransition()` so the browser can
	* capture before/after snapshots and cross-fade (or slide) between them.
	*
	* Falls back to a plain `renderView` call on browsers that do not support
	* the View Transition API.
	*/
	async renderViewWithTransition(element) {
		if (!this.contentContainer) {
			this.renderView(element);
			this.invokeCurrentViewOnShow();
			return;
		}
		const previousId = this.navigationState.previousView;
		const prevEntry = previousId && previousId !== this.currentView.value ? this.loadedViews.get(previousId) : void 0;
		if (prevEntry?.view.lifecycle?.onHide) prevEntry.view.lifecycle.onHide();
		const direction = getTransitionDirection(previousId ?? "", this.currentView.value);
		await withViewTransition(() => this.renderView(element), {
			direction,
			types: [direction, `to-${this.currentView.value}`]
		});
		this.invokeCurrentViewOnShow();
	}
	resolveShellColorScheme(theme) {
		const prefersDark = globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
		return theme.colorScheme === "dark" ? "dark" : theme.colorScheme === "light" ? "light" : prefersDark ? "dark" : "light";
	}
	/**
	* Apply theme to the shell
	*/
	applyTheme(theme) {
		if (!this.rootElement) return;
		const resolved = this.resolveShellColorScheme(theme);
		this.rootElement.dataset.theme = resolved;
		this.rootElement.style.colorScheme = resolved;
		syncBrowserChromeTheme(resolved, theme.colorScheme);
		if (theme.cssVariables) for (const [key, value] of Object.entries(theme.cssVariables)) this.rootElement.style.setProperty(key, value);
	}
	getThemeRefValue() {
		return this.theme?.value;
	}
	/**
	* Go back in navigation history
	*/
	goBack() {
		const history = this.navigationState.viewHistory;
		if (history.length > 1) {
			history.pop();
			const previous = history[history.length - 1];
			if (previous) this.navigate(previous);
		}
	}
	/**
	* Show a status message
	*/
	showMessage(message, duration = 3e3) {
		showToast({
			message,
			duration,
			kind: "info"
		});
	}
	/**
	* Set the current view's toolbar
	*/
	setViewToolbar(toolbar) {
		this.ensureToolbarChrome();
		if (!this.toolbarViewSlot) return;
		this.toolbarViewSlot.replaceChildren();
		if (toolbar) this.toolbarViewSlot.appendChild(toolbar);
	}
	ensureToolbarChrome() {
		if (!this.toolbarContainer) return;
		if (this.toolbarViewSlot && this.toolbarThemeSlot) return;
		this.toolbarContainer.replaceChildren();
		this.toolbarContainer.style.display = "flex";
		this.toolbarContainer.style.alignItems = "center";
		this.toolbarContainer.style.justifyContent = "space-between";
		this.toolbarContainer.style.gap = "0.5rem";
		this.toolbarContainer.style.flexWrap = "wrap";
		const themeSlot = document.createElement("div");
		themeSlot.className = "shell-theme-controls";
		themeSlot.setAttribute("data-shell-toolbar-theme", "true");
		themeSlot.style.display = "inline-flex";
		themeSlot.style.alignItems = "center";
		themeSlot.style.gap = "0.35rem";
		const cycleBtn = document.createElement("button");
		cycleBtn.type = "button";
		cycleBtn.className = "app-shell__nav-btn shell-theme-cycle-btn";
		cycleBtn.setAttribute("aria-label", "Theme: follow system");
		cycleBtn.title = "Theme: follow system — click to pin dark or light, then click again to return to auto";
		const icon = document.createElement("ui-icon");
		icon.setAttribute("icon", "lamp");
		icon.setAttribute("icon-style", "duotone");
		cycleBtn.appendChild(icon);
		cycleBtn.addEventListener("click", () => {
			if (this.getThemeModeFromShellTheme() === "auto") {
				const eff = this.resolveEffectiveSystemScheme();
				this.applyThemeMode(eff === "light" ? "dark" : "light");
			} else this.applyThemeMode("auto");
		});
		themeSlot.append(cycleBtn);
		const viewSlot = document.createElement("div");
		viewSlot.className = "shell-view-toolbar-slot";
		viewSlot.setAttribute("data-shell-toolbar-view", "true");
		viewSlot.style.display = "inline-flex";
		viewSlot.style.alignItems = "center";
		viewSlot.style.gap = "0.5rem";
		viewSlot.style.flex = "1 1 auto";
		viewSlot.style.justifyContent = "flex-end";
		this.toolbarContainer.append(themeSlot, viewSlot);
		this.toolbarThemeSlot = themeSlot;
		this.toolbarViewSlot = viewSlot;
		this.themeCycleButton = cycleBtn;
		this.themeCycleIcon = icon;
		this.syncThemeToolbarControls();
	}
	getThemeModeFromShellTheme() {
		const theme = this.getThemeRefValue();
		const id = (theme?.id || "").toLowerCase();
		if (id === "dark" || theme?.colorScheme === "dark") return "dark";
		if (id === "light" || theme?.colorScheme === "light") return "light";
		return "auto";
	}
	resolveEffectiveSystemScheme() {
		return globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	}
	createShellTheme(mode) {
		if (mode === "dark") return {
			id: "dark",
			name: "Dark",
			colorScheme: "dark"
		};
		if (mode === "light") return {
			id: "light",
			name: "Light",
			colorScheme: "light"
		};
		return {
			id: "auto",
			name: "Auto",
			colorScheme: "auto"
		};
	}
	syncThemeToolbarControls() {
		const mode = this.getThemeModeFromShellTheme();
		const effectiveMode = mode === "auto" ? this.getExternalThemeModeHint() : mode;
		const iconEl = this.themeCycleIcon;
		const btn = this.themeCycleButton;
		if (!iconEl || !btn) return;
		const iconName = effectiveMode === "light" ? "sun-dim" : effectiveMode === "dark" ? "moon-stars" : "lamp";
		iconEl.setAttribute("icon", iconName);
		if (mode === "auto") {
			btn.title = "Theme: follow system — click to pin the opposite of the current appearance, then click again for auto";
			btn.setAttribute("aria-label", "Theme follows system. Activate to pin light or dark.");
		} else if (mode === "light") {
			btn.title = "Theme: light — click to follow system again";
			btn.setAttribute("aria-label", "Light theme is on. Activate to follow system appearance.");
		} else {
			btn.title = "Theme: dark — click to follow system again";
			btn.setAttribute("aria-label", "Dark theme is on. Activate to follow system appearance.");
		}
	}
	async applyThemeMode(mode) {
		this.setTheme(this.createShellTheme(mode));
		try {
			const current = await loadSettings();
			applyTheme(await saveSettings({
				...current,
				appearance: {
					...current.appearance || {},
					theme: mode
				}
			}));
		} catch (error) {
			console.warn(`[${this.id}] Failed to save theme mode:`, error);
		}
	}
	getExternalThemeModeHint() {
		const scheme = (document?.documentElement?.getAttribute?.("data-scheme") || "").toLowerCase();
		if (scheme === "light" || scheme === "dark") return scheme;
		return "auto";
	}
	bindThemeAttrObserver() {
		this.themeAttrObserver?.disconnect();
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		this.themeAttrObserver = new MutationObserver(() => {
			this.syncThemeToolbarControls();
		});
		this.themeAttrObserver.observe(root, {
			attributes: true,
			attributeFilter: ["data-scheme", "data-theme"]
		});
	}
	/**
	* Setup path-based navigation (listen to route-change events)
	* @deprecated Use setupPopstateNavigation instead
	*/
	setupHashNavigation() {}
	/**
	* Setup popstate navigation (back/forward buttons)
	*/
	setupPopstateNavigation() {
		if (typeof window === "undefined" || typeof window == "undefined") return;
		globalThis?.addEventListener?.("popstate", (event) => {
			const navToken = ++this.navigationToken;
			const fallbackView = this.getViewFromPathname();
			const viewId = event.state?.viewId || fallbackView || "home";
			const popParams = event.state?.params ?? Object.fromEntries(new URLSearchParams(globalThis.location.search || ""));
			if (viewId !== this.currentView.value || !this.sameRouteParams(popParams, this.navigationState.params)) {
				const previousViewId = this.navigationState.currentView;
				this.navigationState.previousView = previousViewId;
				this.navigationState.currentView = viewId;
				this.navigationState.params = popParams;
				this.currentView.value = viewId;
				const hist = this.navigationState.viewHistory;
				const idx = hist.lastIndexOf(viewId);
				if (idx >= 0) this.navigationState.viewHistory = hist.slice(0, idx + 1);
				else this.navigationState.viewHistory = [viewId];
				this.loadView(viewId, popParams).then((element) => {
					if (navToken !== this.navigationToken) return;
					return this.renderViewWithTransition(element);
				}).then(() => {
					if (navToken !== this.navigationToken) return;
					scheduleViewModulePrefetch(viewId);
				}).catch(console.error);
			}
		});
	}
	invokeCurrentViewOnShow() {
		const entry = this.loadedViews.get(this.currentView.value);
		if (!entry?.view?.lifecycle?.onShow) return;
		try {
			entry.view.lifecycle.onShow();
		} catch (error) {
			console.warn(`[${this.id}] View ${this.currentView.value} onShow error:`, error);
		}
	}
	/**
	* Get view ID from current pathname
	*/
	getViewFromPathname() {
		if (typeof window === "undefined" || typeof window == "undefined") return null;
		const pathname = globalThis?.location?.pathname?.replace(/^\//, "").toLowerCase();
		if (!pathname || pathname === "/") {
			const stateView = (globalThis?.history?.state)?.viewId;
			return stateView && isEnabledView(String(stateView)) ? stateView : null;
		}
		return isEnabledView(pathname) ? pathname : null;
	}
};
//#endregion
export { ShellBase as t };
