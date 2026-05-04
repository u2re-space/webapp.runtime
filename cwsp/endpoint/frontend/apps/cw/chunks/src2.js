import { P as H } from "../vendor/jsox.js";
import { t as ShellBase } from "./shells.js";
//#region ../../modules/shells/immersive-shell/src/base.scss?inline
var base_default = "@layer shell.tokens, shell.immersive, shell.components, shell.utilities, shell.overrides;@layer shell.tokens{:root:has(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]),:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]){color-scheme:light dark;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high));--shell-nav-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-border:light-dark(var(--color-outline-variant),var(--color-outline-variant));--shell-btn-hover:light-dark(var(--color-surface-container),var(--color-surface-container));--shell-btn-active-bg:light-dark(var(--color-surface-container-low),var(--color-surface-container-low));--shell-btn-active-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-status-bg:light-dark(var(--color-surface-container-low),var(--color-surface-container-low));--shell-status-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-height:var(--shell-nav-height-immersive,48px);--shell-sidebar-width:0;--shell-status-height:24px;--shell-padding:0}:is(:root,html):has([data-shell=immersive][data-theme=dark]){--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-bg:light-dark(var(--color-surface-container-high),var(--color-surface-container-high));--shell-nav-fg:light-dark(var(--color-on-surface),var(--color-on-surface));--shell-nav-border:light-dark(var(--color-outline-variant),var(--color-outline-variant))}:host:has(>.app-shell){align-self:stretch;block-size:100%;display:block;inline-size:100%;justify-self:stretch;min-block-size:0;min-inline-size:0;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface))}:host([data-theme=dark]):has(>.app-shell){--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface)}}@layer shell.immersive{:host:has(>.app-shell){background-color:var(--shell-bg)}:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]){align-items:stretch;background:var(--color-background);background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);color-scheme:light dark;contain:layout style;display:flex;flex-direction:column;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,BlinkMacSystemFont,sans-serif;gap:0;inline-size:stretch;inset:0;justify-content:flex-start;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:absolute;-webkit-tap-highlight-color:transparent;border-radius:0;transition:background-color .2s ease,color .2s ease}:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw])[data-theme=light]{color-scheme:light}:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw])[data-theme=dark]{color-scheme:dark}@media print{:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]){display:contents!important}}}@layer shell.components{:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]) .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid rgba(128,128,128,.2);border-radius:50%;border-top:3px solid var(--shell-btn-active-fg);inline-size:32px}:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]) slot{display:contents!important}.app-shell__viewport{align-self:stretch;flex:1 1 0;isolation:isolate;min-block-size:0;min-inline-size:0;overflow:hidden;position:relative}.app-shell__content{block-size:stretch;border-radius:0;container-type:size;display:flex;flex-direction:column;inline-size:stretch;inset:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;position:absolute;scrollbar-color:rgba(128,128,128,.4) transparent;scrollbar-width:thin}.app-shell__content>*{flex:1 1 auto;min-block-size:0;min-inline-size:0}.app-shell__content::-webkit-scrollbar{inline-size:8px}.app-shell__content::-webkit-scrollbar-track{background:transparent}.app-shell__content::-webkit-scrollbar-thumb{background-color:rgba(128,128,128,.4);border-radius:4px}.app-shell__overlays{inset:0;overflow:visible;pointer-events:none;position:absolute;z-index:3}.app-shell__overlays>*{pointer-events:auto}.app-shell__status{animation:b .2s ease-out;background-color:var(--shell-status-bg);border-radius:var(--radius-lg,8px);box-shadow:var(--elev-3,0 4px 12px rgba(0,0,0,.15));color:var(--shell-status-fg);font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);inset-block-end:var(--space-2xl,1.5rem);inset-inline-start:50%;padding:var(--space-md,.75rem) var(--space-xl,1.5rem);position:fixed;transform:translateX(-50%);z-index:2}.app-shell__status:empty,.app-shell__status[hidden]{display:none}.app-shell__loading{align-items:center;background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);display:flex;flex-direction:column;gap:var(--space-lg,1rem);inline-size:stretch;inset:0;justify-content:center;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;padding:var(--space-2xl,2rem);position:absolute;z-index:1}.app-shell__loading[hidden]{display:none!important}.app-shell__loading .loading-spinner{animation:a .8s linear infinite;block-size:32px;border:3px solid var(--color-outline-variant);border-radius:50%;border-top-color:var(--color-primary);inline-size:32px}}@layer shell.utilities{@keyframes a{to{transform:rotate(1turn)}}@keyframes b{0%{opacity:0;transform:translate(-50%,.5rem)}to{opacity:1;transform:translate(-50%)}}}@layer shell.overrides{@media (max-width:480px){:where(.app-shell,.app-shell[data-style=immersive],.app-shell[data-style=raw]){--shell-nav-height:48px}}@media print{.app-shell{background:white;color:black;contain:none;overflow:visible}.app-shell,.app-shell__viewport{display:contents!important}.app-shell__overlays{display:none!important}.app-shell__content{contain:none;display:contents!important;overflow:visible;position:static!important}}@media print{.app-shell__content::-webkit-scrollbar{display:none}.app-shell__content>[data-view]{block-size:auto!important;inline-size:auto!important;inset:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.cw-view-viewer-shell,.cw-view-viewer__prose,.markdown-body,.markdown-viewer-content,.result-content,[data-cw-view-host=true],[data-cw-view-host=true]>.cw-view-element__mount,[data-cw-viewer-prose],markdown-viewer,md-view{block-size:auto!important;contain:none!important;container-type:normal!important;max-block-size:none!important;overflow:visible!important}}:is(html,body):has([data-shell=immersive]){--shell-nav-height:0;--shell-content-padding:0;--shell-sidebar-width:0;--shell-status-height:0;--shell-bg:light-dark(var(--color-surface),var(--color-surface));--shell-fg:light-dark(var(--color-on-surface),var(--color-on-surface))}:root:has(.app-shell) .app-shell{background-color:var(--shell-bg,var(--color-surface,#ffffff));color:var(--shell-fg,var(--color-on-surface,#1a1a1a));display:flex;flex-direction:column;inset:0;position:absolute;transition:background-color .2s ease,color .2s ease}.app-shell__content{scroll-behavior:smooth;scrollbar-color:var(--shell-scrollbar,rgba(128,128,128,.3)) transparent}.app-shell__content::-webkit-scrollbar{inline-size:6px}.app-shell__content::-webkit-scrollbar-thumb{background-color:var(--shell-scrollbar,rgba(128,128,128,.3));border-radius:3px}.app-shell__status{animation:b .2s ease-out;background-color:var(--shell-status-bg,rgba(0,0,0,.8));border-radius:8px;color:var(--shell-status-fg,#ffffff);font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:.875rem;inset-block-end:1rem;inset-inline-start:50%;padding:.75rem 1.5rem;position:fixed;transform:translateX(-50%);z-index:2}.app-shell__status:empty,.app-shell__status[hidden]{display:none}}";
//#endregion
//#region ../../modules/shells/immersive-shell/src/index.ts
/**
* Immersive Shell
*
* Immersive shell with no frames, navigation UI, or chrome.
* Just a content container with theme support.
*
* Use cases:
* - Fullscreen views
* - Print layouts
* - Embedded views
* - Single-component rendering
*/
var ImmersiveShell = class extends ShellBase {
	constructor(..._args) {
		super(..._args);
		this.id = "immersive";
		this.name = "Immersive";
		this.layout = {
			hasSidebar: false,
			hasToolbar: false,
			hasTabs: false,
			supportsMultiView: false,
			supportsWindowing: false
		};
		this.wcoGeometryHandler = null;
		this.wcoResizeHandler = null;
	}
	createLayout() {
		return H`
            <div class="app-shell" data-shell="immersive" data-style="immersive">
                <div class="app-shell__viewport">
                    <main class="app-shell__content" data-shell-content role="main">
                        <div class="app-shell__loading">
                            <div class="loading-spinner"></div>
                            <span>Loading...</span>
                        </div>
                        <slot name="view"></slot>
                    </main>
                    <div class="app-shell__overlays" data-shell-overlays></div>
                </div>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;
	}
	getStylesheet() {
		return base_default;
	}
	/**
	* Theme lives on `cw-shell-*` in `applyTheme`; inner `.app-shell` needs the same `data-theme`
	* so shell SCSS `&[data-theme="light"|"dark"]` and token rules apply (matches MinimalShell).
	*/
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-shell");
		if (inner) inner.dataset.theme = this.resolveShellColorScheme(theme);
		super.applyTheme(theme);
	}
	/**
	* Match MinimalShell: assign `slot="view"` and append the view to the shell host (light DOM).
	* Document-level view CSS (`views.scss`, adopted view sheets) does not pierce shadow roots; views
	* must not live only under `.app-shell__content` inside the shadow tree.
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
	async mount(container) {
		await super.mount(container);
		this.setupHashNavigation();
		this.setupPopstateNavigation();
		this.bindWindowControlsOverlay();
	}
	unmount() {
		this.unbindWindowControlsOverlay();
		super.unmount();
	}
	bindWindowControlsOverlay() {
		const overlay = (globalThis?.navigator || {})?.windowControlsOverlay;
		const host = this.rootElement;
		if (!host || !overlay) return;
		const update = () => {
			const isVisible = Boolean(overlay?.visible);
			host.setAttribute("data-wco-visible", isVisible ? "true" : "false");
			const rect = overlay?.getTitlebarAreaRect?.();
			if (isVisible && rect) {
				host.style.setProperty("--wco-titlebar-x", `${Math.max(0, Number(rect.x) || 0)}px`);
				host.style.setProperty("--wco-titlebar-y", `${Math.max(0, Number(rect.y) || 0)}px`);
				host.style.setProperty("--wco-titlebar-width", `${Math.max(0, Number(rect.width) || 0)}px`);
				host.style.setProperty("--wco-titlebar-height", `${Math.max(0, Number(rect.height) || 0)}px`);
			} else {
				host.style.setProperty("--wco-titlebar-x", "0px");
				host.style.setProperty("--wco-titlebar-y", "0px");
				host.style.setProperty("--wco-titlebar-width", "0px");
				host.style.setProperty("--wco-titlebar-height", "0px");
			}
		};
		this.wcoGeometryHandler = () => update();
		this.wcoResizeHandler = () => update();
		try {
			overlay?.addEventListener?.("geometrychange", this.wcoGeometryHandler);
		} catch {}
		globalThis?.addEventListener?.("resize", this.wcoResizeHandler);
		update();
	}
	unbindWindowControlsOverlay() {
		const overlay = (globalThis?.navigator || {})?.windowControlsOverlay;
		if (overlay && this.wcoGeometryHandler) try {
			overlay?.removeEventListener?.("geometrychange", this.wcoGeometryHandler);
		} catch {}
		if (this.wcoResizeHandler) globalThis?.removeEventListener?.("resize", this.wcoResizeHandler);
		this.wcoGeometryHandler = null;
		this.wcoResizeHandler = null;
	}
};
/**
* Create a immersive shell instance
*/
function createShell(_container) {
	return new ImmersiveShell();
}
//#endregion
export { ImmersiveShell, createShell, createShell as default };
