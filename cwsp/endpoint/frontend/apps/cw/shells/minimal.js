import { r as affected } from "../fest/object.js";
import { V as H } from "../com/app3.js";
import "../fest/icon.js";
import { r as isEnabledView } from "../chunks/views.js";
import { t as ShellBase } from "./shells.js";
//#region src/frontend/shells/minimal/minimal.scss?inline
var minimal_default = "@layer shell.tokens, shell.base, shell.components, shell.utilities, shell.overrides;@layer shell.tokens{:where(:root,.app-shell,.app-shell[data-style=minimal]):has(.app-shell,.app-shell[data-style=minimal]){color-scheme:light dark;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high));--shell-nav-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-border:light-dark(var(--color-outline-variant),var(--color-outline-variant));--shell-btn-hover:light-dark(var(--color-surface-container,var(--color-surface-container)),var(--color-surface-container,var(--color-surface-container)));--shell-btn-active-bg:light-dark(var(--color-surface-container-low,var(--color-surface-container-low)),var(--color-surface-container-low,var(--color-surface-container-low)));--shell-btn-active-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-status-bg:light-dark(var(--color-surface-container-low,var(--color-surface-container-low)),var(--color-surface-container-low,var(--color-surface-container-low)));--shell-status-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-height:var(--shell-nav-height-base,48px);--shell-sidebar-width:0;--shell-status-height:24px;--shell-padding:0}:is(:root,html):has([data-shell=minimal][data-theme=dark]){--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface);--shell-nav-bg:var(--color-surface-container-high);--shell-nav-fg:var(--color-on-surface);--shell-nav-border:var(--color-outline-variant)}:host:has(>.app-shell){--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high))}:host([data-theme=dark]):has(>.app-shell){--shell-bg:var(--color-surface);--shell-nav-bg:var(--color-surface-container-high)}}@layer shell.base{:host:has(>.app-shell){background-color:var(--shell-nav-bg)}:where(.app-shell,.app-shell[data-style=minimal]){align-items:stretch;background:var(--color-background);background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);color-scheme:light dark;contain:strict;display:grid;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,BlinkMacSystemFont,sans-serif;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:[toolbar-row] auto [content-row] minmax(0,1fr);inline-size:stretch;inset:0;justify-content:start;justify-items:stretch;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:absolute;-webkit-tap-highlight-color:transparent;border-radius:0;transition:background-color .2s ease,color .2s ease}:where(.app-shell,.app-shell[data-style=minimal])[data-theme=light]{color-scheme:light}:where(.app-shell,.app-shell[data-style=minimal])[data-theme=dark]{color-scheme:dark}@media print{:where(.app-shell,.app-shell[data-style=minimal]){display:contents!important}}}@layer shell.components{:where(.app-shell,.app-shell[data-style=minimal]){border-radius:0}:where(.app-shell,.app-shell[data-style=minimal]) .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid rgba(128,128,128,.2);border-block-start-color:var(--shell-btn-active-fg);border-radius:50%;inline-size:32px}:where(.app-shell,.app-shell[data-style=minimal]) slot{display:contents!important}.app-shell__nav{align-items:center;background:var(--shell-nav-bg);background-color:var(--shell-nav-bg);block-size:auto;border-block-end:1px solid var(--shell-nav-border);border-radius:0;box-sizing:border-box;display:flex;flex-shrink:0;gap:var(--gap-sm,.5rem);justify-content:space-between;margin:0;min-block-size:max(var(--shell-nav-height) + max(env(safe-area-inset-top,0px),env(titlebar-area-y,0px)),env(titlebar-area-y,0px) + env(titlebar-area-height,0px));padding-block-end:0;padding-block-start:max(env(safe-area-inset-top,0px),env(titlebar-area-y,0px));padding-inline-end:max(env(safe-area-inset-right,0px),max(0px,100vi - env(titlebar-area-x,0px) - env(titlebar-area-width,100vi)),var(--space-md,.75rem));padding-inline-start:max(env(safe-area-inset-left,0px),env(titlebar-area-x,0px),var(--space-md,.75rem));transition:background-color var(--motion-normal,.2s ease),border-color var(--motion-normal,.2s ease)}.app-shell__nav select{block-size:fit-content!important;box-sizing:border-box!important;max-block-size:min(2rem,100%)!important;min-block-size:0!important;padding-block:.125rem!important}.app-shell__nav-left,.app-shell__nav-right{align-items:center;display:flex}.app-shell__nav-left select,.app-shell__nav-right select{block-size:fit-content!important;box-sizing:border-box!important;max-block-size:min(2rem,100%)!important;min-block-size:0!important;padding-block:.125rem!important}.app-shell__nav-left{gap:var(--gap-xs,.25rem)}.app-shell__nav-right{gap:var(--gap-sm,.5rem)}.app-shell__nav-right>*{align-items:center;display:flex;gap:var(--gap-xs,.25rem)}.app-shell__admin-door{background:color-mix(in srgb,var(--color-error,#c62828) 16%,var(--shell-nav-bg));border:1px solid color-mix(in srgb,var(--color-error,#c62828) 40%,var(--shell-nav-border));border-radius:var(--radius-sm,6px);color:color-mix(in srgb,var(--color-error,#b71c1c) 70%,var(--shell-nav-fg));cursor:pointer;flex-shrink:0;font-size:.7rem;font-weight:700;letter-spacing:.04em;padding:.3rem .5rem;-webkit-tap-highlight-color:transparent;transition:background-color .15s ease,border-color .15s ease}.app-shell__admin-door:hover{background:color-mix(in srgb,var(--color-error,#c62828) 24%,var(--shell-nav-bg))}.app-shell__admin-door:active{background:color-mix(in srgb,var(--color-error,#c62828) 30%,var(--shell-nav-bg))}@media (display-mode:window-controls-overlay){:where(.app-shell,.app-shell[data-style=minimal]) .app-shell__nav{-webkit-app-region:drag;app-region:drag}:where(.app-shell,.app-shell[data-style=minimal]) .app-shell__nav-left,:where(.app-shell,.app-shell[data-style=minimal]) .app-shell__nav-right{-webkit-app-region:no-drag;app-region:no-drag}}.shell-theme-cycle-btn{justify-content:center;min-inline-size:2.5rem;padding-inline:var(--space-sm,.5rem)}.shell-theme-cycle-btn ui-icon{margin:0}.app-shell__nav-btn{align-items:center;background:transparent;block-size:max-content;border:none;border-radius:var(--radius-lg,8px);color:var(--shell-fg);cursor:pointer;display:flex;flex-shrink:0;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);gap:var(--gap-sm,.5rem);line-height:normal;min-block-size:2.5rem;padding:var(--space-xs,.5rem) var(--space-md,.75rem);transition:background-color var(--motion-fast,.15s ease),color var(--motion-fast,.15s ease);user-select:none;white-space:nowrap}.app-shell__nav-btn ui-icon{--icon-size:clamp(1.25rem,5.5vmin,1.75rem);flex-shrink:0;font-size:var(--icon-size);min-block-size:1.25rem;min-inline-size:1.25rem;opacity:.8}.app-shell__nav-btn:hover{background-color:var(--shell-btn-hover)}.app-shell__nav-btn:active{background-color:var(--shell-btn-active-bg);color:var(--shell-btn-active-fg)}.app-shell__nav-btn:focus-visible{box-shadow:var(--focus-ring,none);outline:2px solid var(--shell-btn-active-fg);outline-offset:2px}.app-shell__nav-btn.active{background-color:var(--shell-btn-active-bg);color:var(--shell-btn-active-fg)}.app-shell__nav-btn.active ui-icon{opacity:1}.app-shell__content{background:var(--shell-bg);background-color:var(--shell-bg);border:0 transparent;border-radius:0;box-sizing:border-box;contain:strict;container-type:size;display:flex;flex:1;flex-direction:column;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;padding:0;position:relative;scrollbar-color:var(--shell-scrollbar,rgba(128,128,128,.3)) transparent}.app-shell__content,.app-shell__content [data-view]{block-size:stretch;inline-size:stretch;min-inline-size:0;overflow:auto;scrollbar-width:thin}.app-shell__content [data-view]{inset:0;min-block-size:fit-content;position:absolute}.app-shell__content [data-view=settings]{min-block-size:0;overflow:hidden}.app-shell__content slot[name=view]::slotted([data-view]){block-size:stretch;inline-size:stretch;inset:0;min-block-size:fit-content;min-inline-size:0;overflow:auto;position:absolute;scrollbar-width:thin}.app-shell__content slot[name=view]::slotted([data-view=settings]){min-block-size:0;overflow:hidden}.app-shell__content>*{flex:1;overflow:auto}.app-shell__content slot[name=view]::slotted(*){flex:1 1 auto;min-block-size:0;min-inline-size:0;overflow:auto}.app-shell__content::-webkit-scrollbar{inline-size:8px}.app-shell__content::-webkit-scrollbar-track{background:transparent}.app-shell__content::-webkit-scrollbar-thumb{background-color:rgba(128,128,128,.4);border-radius:4px}.app-shell__status{animation:c .2s ease-out;background-color:var(--shell-status-bg);border-radius:var(--radius-lg,8px);box-shadow:var(--elev-3,0 4px 12px rgba(0,0,0,.15));color:var(--shell-status-fg);font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);inset-block-end:var(--space-2xl,1.5rem);inset-inline-start:50%;padding:var(--space-md,.75rem) var(--space-xl,1.5rem);position:fixed;transform:translateX(-50%);z-index:1}.app-shell__status:empty,.app-shell__status[hidden]{display:none}.app-shell__loading{align-items:center;block-size:stretch;display:none;flex-direction:column;gap:var(--space-lg,1rem);inline-size:stretch;inset:0;justify-content:center;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;padding:var(--space-2xl,2rem);position:absolute}.app-shell__loading .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid var(--color-outline-variant);border-radius:50%;border-top-color:var(--color-primary);inline-size:32px}}@layer shell.utilities{@keyframes a{to{transform:rotate(1turn)}}@keyframes c{0%{opacity:0;transform:translate(-50%,.5rem)}to{opacity:1;transform:translate(-50%)}}}@layer shell.overrides{@media (max-width:640px){.app-shell__nav-label{display:none}}@media (max-width:768px){:where(.app-shell,.app-shell[data-style=minimal]){--shell-nav-height:52px}.app-shell__nav{gap:var(--gap-xs,.35rem)}.app-shell__nav-btn{min-block-size:2.75rem;padding:var(--space-sm,.5rem) var(--space-sm,.65rem)}.app-shell__nav-btn ui-icon{--icon-size:clamp(1.35rem,6vmin,1.85rem);font-size:var(--icon-size);min-block-size:1.35rem;min-inline-size:1.35rem}}@media print{.app-shell__content{contain:none;display:contents!important;overflow:visible}.app-shell__content::-webkit-scrollbar{display:none}.app-shell__content slot[name=view]::slotted([data-view]),.app-shell__content>[data-view]{block-size:auto!important;inline-size:auto!important;inset:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.cw-view-viewer-shell,.cw-view-viewer__prose,.markdown-body,.markdown-viewer-content,.result-content,[data-cw-view-host=true],[data-cw-view-host=true]>.cw-view-element__mount,[data-cw-viewer-prose],markdown-viewer,md-view{block-size:auto!important;contain:none!important;container-type:normal!important;max-block-size:none!important;overflow:visible!important}.app-shell__nav,.app-shell__status{display:none!important}}}";
//#endregion
//#region src/frontend/shells/minimal/preview.ts
/**
* Minimal Shell
*
* Simple toolbar-based single-view shell.
* Features:
* - Top navigation toolbar with view buttons
* - Status bar for messages
* - Single content area for one active view
* - NO split view, NO sidebar, NO tabs
*/
var MAIN_NAV_ITEMS = [
	{
		id: "viewer",
		name: "Viewer",
		icon: "eye"
	},
	{
		id: "explorer",
		name: "Explorer",
		icon: "folder"
	},
	{
		id: "workcenter",
		name: "Work Center",
		icon: "lightning"
	},
	{
		id: "airpad",
		name: "Airpad",
		icon: "hand-pointing"
	},
	{
		id: "settings",
		name: "Settings",
		icon: "gear"
	},
	{
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise"
	}
].filter((item) => isEnabledView(item.id));
/** Set of valid nav view IDs for fast lookup */
var VALID_NAV_VIEW_IDS = new Set(MAIN_NAV_ITEMS.map((item) => item.id));
/** Type guard for valid navigation view IDs */
function isValidNavViewId(id) {
	return VALID_NAV_VIEW_IDS.has(id);
}
var MinimalShell = class extends ShellBase {
	id = "minimal";
	name = "Minimal";
	layout = {
		hasSidebar: false,
		hasToolbar: true,
		hasTabs: false,
		supportsMultiView: false,
		supportsWindowing: false
	};
	createLayout() {
		const root = H`
            <div class="app-shell" data-shell="minimal">
                <nav class="app-shell__nav" role="navigation" aria-label="Main navigation">
                    <div class="app-shell__nav-left" data-nav-left>
                        ${this.renderNavButtons()}
                    </div>
                    <div class="app-shell__nav-right" data-shell-toolbar>
                        <!-- View-specific toolbar actions go here -->
                    </div>
                </nav>
                <main class="app-shell__content" data-shell-content role="main">
                    <div class="app-shell__loading">
                        <div class="loading-spinner"></div>
                        <span>Loading...</span>
                    </div>
                </main>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;
		this.setupNavClickHandlers(root);
		return root;
	}
	renderNavButtons() {
		const fragment = document.createDocumentFragment();
		for (const item of MAIN_NAV_ITEMS) {
			const button = H`
                <button
                    class="app-shell__nav-btn"
                    data-view="${item.id}"
                    type="button"
                    title="${item.name}"
                >
                    <ui-icon icon="${item.icon}" icon-style="duotone"></ui-icon>
                    <span class="app-shell__nav-label">${item.name}</span>
                </button>
            `;
			fragment.appendChild(button);
		}
		return fragment;
	}
	setupNavClickHandlers(root) {
		const navLeft = root.querySelector("[data-nav-left]");
		if (!navLeft) return;
		navLeft.addEventListener("click", (e) => {
			const button = e.target.closest("[data-view]");
			if (!button) return;
			const viewId = button.dataset.view;
			if (viewId && isValidNavViewId(viewId)) this.navigate(viewId);
		});
		affected(this.currentView, (viewId) => {
			this.updateActiveNavButton(navLeft, viewId);
		});
	}
	updateActiveNavButton(navContainer, activeViewId) {
		navContainer.querySelectorAll("[data-view]").forEach((btn) => {
			const isActive = btn.dataset.view === activeViewId;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-current", isActive ? "page" : "false");
		});
	}
	getStylesheet() {
		return minimal_default;
	}
	/**
	* View hosts (`cw-view-*`) stay in the shell host's light DOM with `slot="view"` so they project
	* into shadow `<main>` (see `MinimalShellHostElement`).
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
/**
* Factory function for creating MinimalShell instances.
* 
* Note: The container parameter is required by ShellRegistration interface
* but not used here - the shell is mounted later via shell.mount(container).
*/
function createShell(_container) {
	return new MinimalShell();
}
//#endregion
export { MinimalShell, createShell, createShell as default };
