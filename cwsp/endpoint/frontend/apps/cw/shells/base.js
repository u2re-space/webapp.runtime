import { f as isEnabledView } from "../chunks/views.js";
import { h as preloadStyle, m as loadInlineStyle } from "../fest/dom.js";
import { c as ref } from "../fest/object.js";
import { Z as H, x as dynamicTheme } from "../com/app.js";
import { n as loadSettings, r as saveSettings } from "../chunks/Settings.js";
import { n as ViewRegistry, u as serviceChannels } from "../chunks/registry.js";
import { n as getTransitionDirection, r as withViewTransition, t as scheduleViewModulePrefetch } from "../views/prefetch.js";
import { i as syncBrowserChromeTheme, n as applyTheme, r as resyncThemeAfterAdoptedViewSheet } from "../chunks/Theme.js";
import { a as ensureStyleSheet } from "../fest/icon.js";
//#region src/shared/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
	return "minimal";
}
function recordBootShellWindowActivity(shellId) {
	try {
		const payload = {
			shell: normalizeBootShellId(shellId),
			t: Date.now()
		};
		globalThis.localStorage?.setItem(LS_BOOT_SHELL_LAST_ACTIVE, JSON.stringify(payload));
	} catch {}
}
/**
* Track this tab/window as the last-used shell context (focus + pointer).
* Returns a dispose function for unmount.
*/
function initBootShellWindowActivity(shellId) {
	const shell = normalizeBootShellId(shellId);
	const onWinFocus = () => recordBootShellWindowActivity(shell);
	const onPointer = () => recordBootShellWindowActivity(shell);
	const w = globalThis;
	w.addEventListener("focus", onWinFocus);
	w.addEventListener("pointerdown", onPointer, {
		capture: true,
		passive: true
	});
	queueMicrotask(() => recordBootShellWindowActivity(shell));
	return () => {
		w.removeEventListener("focus", onWinFocus);
		w.removeEventListener("pointerdown", onPointer, { capture: true });
	};
}
//#endregion
//#region src/shared/boot/shell-elements.ts
var ShellHost = class extends HTMLElement {
	mountShellLayout(layout) {
		if (!this.shadowRoot) this.attachShadow({ mode: "open" });
		this.style.display = "block";
		this.style.boxSizing = "border-box";
		this.shadowRoot.replaceChildren(layout);
	}
};
function ensureShellElementDefined(id) {
	const tag = `cw-shell-${id}`;
	if (!customElements.get(tag)) customElements.define(tag, ShellHost);
	return tag;
}
//#endregion
//#region src/shared/boot/shells.ts
/** Views backed by {@link SERVICE_CHANNEL_CONFIG}; lazily initialized on first navigate when not boot-preloaded. */
var VIEW_SERVICE_CHANNEL_IDS = new Set([
	"workcenter",
	"settings",
	"viewer",
	"explorer",
	"airpad",
	"print",
	"history",
	"editor",
	"home"
]);
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
	/** When `colorScheme` is `auto`, re-run `applyTheme` on OS light/dark changes. */
	systemColorSchemeMq = null;
	systemColorSchemeHandler = null;
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
		if (this.id === "minimal" && shellHost.shadowRoot) {
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
		if (this.id !== "immersive" && this.id !== "content") this.rootElement.style.minBlockSize = "0";
		else this.rootElement.style.minBlockSize = "";
		this.rootElement.style.pointerEvents = this.id === "content" ? "none" : "auto";
		this.contentContainer = shellLayout.querySelector("[data-shell-content]") || shellLayout;
		this.toolbarContainer = shellLayout.querySelector("[data-shell-toolbar]");
		this.statusContainer = shellLayout.querySelector("[data-shell-status]");
		this.overlayContainer = shellLayout.querySelector("[data-shell-overlays]");
		this.ensureToolbarChrome();
		this.applyTheme(this.getThemeRefValue());
		this.bindThemeAttrObserver();
		container.replaceChildren(this.rootElement);
		this.mounted = true;
		this.shellActivityDispose = this.id === "immersive" || this.id === "content" ? null : initBootShellWindowActivity(this.id);
		this.syncNavigationFromUrl();
		this.reconcileBootShellQueryParam();
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
	/**
	* If the address bar carries `?shell=` from another host/tab (e.g. immersive) while this
	* instance is content/minimal/…, fix the hint so routing and mental model match reality.
	*/
	reconcileBootShellQueryParam() {
		if (typeof globalThis.window === "undefined") return;
		try {
			const raw = (globalThis.location?.search || "").replace(/^\?/, "");
			const params = new URLSearchParams(raw);
			const qs = (params.get("shell") || "").trim().toLowerCase();
			if (!qs) return;
			if (qs === String(this.id)) return;
			params.set("shell", this.id);
			const search = params.toString();
			const next = globalThis.location.pathname + (search ? `?${search}` : "");
			globalThis.history?.replaceState?.(globalThis.history.state ?? null, "", next);
		} catch {}
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
		this.teardownSystemColorSchemeListener();
		try {
			delete document.documentElement.dataset.activeView;
		} catch {}
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
			searchParams.set("shell", this.id);
			const isPathRoutedShell = this.id === "base" || this.id === "minimal" || this.id === "immersive";
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
			this.hideShellLoadingPlaceholder();
		}
	}
	/** Dismiss shell chrome loading row after a failed navigation (avoids infinite spinner). */
	hideShellLoadingPlaceholder() {
		try {
			const loading = this.contentContainer?.querySelector(".app-shell__loading");
			if (loading) loading.hidden = true;
		} catch {}
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
		if (VIEW_SERVICE_CHANNEL_IDS.has(viewId)) try {
			await serviceChannels.initChannel(viewId);
		} catch (err) {
			console.warn(`[${this.id}] initChannel(${viewId}) failed:`, err);
		}
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
		const navigateFn = (viewId, params) => this.navigate(viewId, params);
		return {
			shellId: this.id,
			navigate: navigateFn,
			openView: navigateFn,
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
		try {
			const vid = this.currentView.value;
			document.documentElement.dataset.activeView = vid;
			if (this.rootElement) this.rootElement.dataset.activeView = vid;
		} catch {}
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
		this.syncSystemColorSchemeListener();
	}
	teardownSystemColorSchemeListener() {
		if (this.systemColorSchemeMq && this.systemColorSchemeHandler) this.systemColorSchemeMq.removeEventListener("change", this.systemColorSchemeHandler);
		this.systemColorSchemeMq = null;
		this.systemColorSchemeHandler = null;
	}
	/** Keep shell + document chrome aligned when settings use `auto` and the OS scheme changes. */
	syncSystemColorSchemeListener() {
		this.teardownSystemColorSchemeListener();
		if (typeof globalThis.matchMedia !== "function") return;
		if (this.getThemeRefValue().colorScheme !== "auto") return;
		const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (!this.mounted || this.getThemeRefValue().colorScheme !== "auto") return;
			this.applyTheme(this.getThemeRefValue());
		};
		this.systemColorSchemeMq = mq;
		this.systemColorSchemeHandler = handler;
		mq.addEventListener("change", handler);
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
		if (entry?.view?.lifecycle?.onShow) try {
			entry.view.lifecycle.onShow();
		} catch (error) {
			console.warn(`[${this.id}] View ${this.currentView.value} onShow error:`, error);
		}
		if (this.currentView.value === "settings") this.resyncDocumentThemeAfterSettingsShown();
	}
	/**
	* Re-run theme bridge + token consumers after Settings view adopts its document stylesheet.
	* WHY: Fixes hybrid light chrome / dark content on first paint when deep-linking to /settings.
	*/
	resyncDocumentThemeAfterSettingsShown() {
		resyncThemeAfterAdoptedViewSheet();
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
//#region src/frontend/shells/base/base-shell.scss?inline
var base_shell_default = "@layer shell.base{@keyframes a{to{transform:rotate(1turn)}}:host{block-size:100%;box-sizing:border-box;display:block;inline-size:100%;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0}.app-shell--base{box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inset:0;min-block-size:0;min-inline-size:0;overflow:hidden;position:absolute}.app-shell__content{block-size:stretch;flex-direction:column;inline-size:stretch;position:relative}.app-shell__content,.app-shell__content>[data-view]{box-sizing:border-box;display:flex;min-block-size:0;min-inline-size:0;overflow:hidden}.app-shell__content>[data-view]{flex:1 1 auto;flex-direction:column}.app-shell__content>[data-view=settings]{overflow:hidden}.app-shell__loading{align-items:center;background:light-dark(#fff,#121820);color:light-dark(#555,#aaa);display:flex;flex-direction:column;font:400 1rem/1.4 system-ui,sans-serif;gap:.75rem;inset:0;justify-content:center;pointer-events:none;position:absolute;z-index:1}.app-shell__loading .loading-spinner{animation:a .9s linear infinite;block-size:32px;border:3px solid light-dark(#e8e8e8,#333);border-block-start-color:light-dark(#007acc,#5ab0ff);border-radius:50%;inline-size:32px}}";
//#endregion
//#region src/frontend/shells/base/index.ts
/**
* Raw/base shell: chromeless content host with slot-projected views. Registry id: `base`.
*
* WHY: `ShellRegistry.load` requires `default` or `createShell` on this module. Re-exporting only
* {@link ShellBase} breaks `bootBase` / print flows and yields an invalid shell module error or
* a stuck `.app-shell__loading` row.
*/
var BaseChromeShell = class extends ShellBase {
	id = "base";
	name = "Base";
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: false,
		supportsWindowing: false
	};
	createLayout() {
		return H`
            <div class="app-shell app-shell--base" data-shell="base">
                <main class="app-shell__content" data-shell-content role="main">
                    <div class="app-shell__loading">
                        <div class="loading-spinner"></div>
                        <span>Loading...</span>
                    </div>
                    <slot name="view"></slot>
                </main>
            </div>
        `;
	}
	getStylesheet() {
		return base_shell_default;
	}
	/**
	* Same projection model as {@link MinimalShell}: view roots stay in the shell host light DOM
	* with `slot="view"` so document-level view CSS applies.
	*/
	renderView(element) {
		if (!this.contentContainer || !this.rootElement) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.rootElement.contains(prev.element)) prev.element.remove();
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		element.slot = "view";
		if (!this.rootElement.contains(element)) this.rootElement.appendChild(element);
		const loading = this.contentContainer.querySelector(".app-shell__loading");
		if (loading) loading.hidden = true;
		this.currentViewElement = element;
		try {
			const vid = this.currentView.value;
			document.documentElement.dataset.activeView = vid;
			if (this.rootElement) this.rootElement.dataset.activeView = vid;
		} catch {}
	}
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-shell");
		if (inner) inner.dataset.theme = this.resolveShellColorScheme(theme);
		super.applyTheme(theme);
	}
	async mount(container) {
		await super.mount(container);
		this.setupPopstateNavigation();
	}
};
function createShell(_container) {
	return new BaseChromeShell();
}
//#endregion
export { BaseChromeShell, ShellBase, createShell, createShell as default };
