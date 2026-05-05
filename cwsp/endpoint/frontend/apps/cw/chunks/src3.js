import { g as removeAdopted, p as loadAsAdopted } from "../fest/dom.js";
import { P as H } from "../vendor/jsox.js";
import { r as waitForDomPaint } from "./DocTools.js";
import { t as createViewConstructor } from "./registry.js";
import { t as AirpadChannelAction } from "./channel-actions.js";
import { i as disconnectAirPadSession, n as unmountAirpadRuntime, r as setRemoteKeyboardEnabled } from "./main.js";
//#region ../../modules/views/airpad-view/src/component/AirpadController.ts
var AirpadController = class {
	initialized = false;
	mountPromise = null;
	async mount(contentHost) {
		if (this.initialized) return;
		if (this.mountPromise) return this.mountPromise;
		this.mountPromise = (async () => {
			const { default: mountAirpad } = await import("./main.js").then((n) => n.t);
			contentHost.innerHTML = "";
			await waitForDomPaint();
			await mountAirpad(contentHost);
			this.initialized = true;
		})().finally(() => {
			this.mountPromise = null;
		});
		return this.mountPromise;
	}
	unmount() {
		unmountAirpadRuntime();
		setRemoteKeyboardEnabled(false);
		disconnectAirPadSession();
		this.initialized = false;
		this.mountPromise = null;
	}
	reset() {
		this.initialized = false;
		this.mountPromise = null;
	}
};
//#endregion
//#region ../../modules/views/airpad-view/src/component/CwAirpadApp.ts
var TAG$1 = "cw-airpad-app";
var CwAirpadAppElement = class extends HTMLElement {
	controller = new AirpadController();
	started = false;
	contentHost = null;
	/** WHY: Airpad styles read `data-theme` on `.view-cwsp`; document-level `:root …` selectors can miss nested/shadow hosts. */
	themeObserver = null;
	connectedCallback() {
		if (!this.isConnected) return;
		this.renderShell();
		this.attachDocumentThemeObserver();
		this.start();
	}
	disconnectedCallback() {
		this.themeObserver?.disconnect();
		this.themeObserver = null;
		this.dispose();
	}
	async start() {
		if (this.started) return;
		this.renderShell();
		const mount = this.contentHost;
		if (!mount) return;
		try {
			await this.controller.mount(mount);
			this.started = true;
		} catch (error) {
			this.started = false;
			this.renderError(error);
		}
	}
	retry() {
		this.started = false;
		this.controller.reset();
		this.renderShell();
		this.start();
	}
	dispose() {
		this.controller.unmount();
		this.started = false;
	}
	renderShell() {
		if (this.contentHost?.isConnected && this.querySelector(".view-cwsp")) {
			this.syncViewSurfaceThemeFromDocument();
			return;
		}
		this.replaceChildren(H`
            <div class="view-cwsp">
                <div class="view-cwsp__content" data-cwsp-content>
                    <div class="view-cwsp__loading">
                        <div class="view-cwsp__spinner"></div>
                        <span>Loading Airpad...</span>
                    </div>
                </div>
            </div>
        `);
		this.contentHost = this.querySelector("[data-cwsp-content]");
		this.syncViewSurfaceThemeFromDocument();
	}
	syncViewSurfaceThemeFromDocument() {
		try {
			const view = this.querySelector(".view-cwsp");
			if (!view) return;
			const t = document.documentElement.getAttribute("data-theme");
			if (t === "light" || t === "dark") view.setAttribute("data-theme", t);
			else view.removeAttribute("data-theme");
		} catch {}
	}
	attachDocumentThemeObserver() {
		if (typeof MutationObserver === "undefined") return;
		this.themeObserver?.disconnect();
		this.syncViewSurfaceThemeFromDocument();
		this.themeObserver = new MutationObserver(() => this.syncViewSurfaceThemeFromDocument());
		try {
			this.themeObserver.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["data-theme"]
			});
		} catch {
			this.themeObserver = null;
		}
	}
	renderError(error) {
		if (!this.contentHost) return;
		this.contentHost.innerHTML = `
            <div class="view-cwsp__error">
                <p>Failed to load Airpad</p>
                <p class="view-cwsp__error-detail">${String(error)}</p>
                <button type="button" data-action="retry">Try Again</button>
            </div>
        `;
		this.contentHost.querySelector("[data-action=\"retry\"]")?.addEventListener("click", () => this.retry());
	}
};
function ensureCwAirpadAppDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG$1)) return;
	ce.define(TAG$1, CwAirpadAppElement);
}
//#endregion
//#region ../../modules/views/airpad-view/src/airpad.scss?inline
var airpad_default = "@layer view.airpad{.airpad-config-overlay :is(*,:before,:after),.view-cwsp :is(*,:before,:after){box-sizing:border-box;font-variant-emoji:text}.view-cwsp{user-select:none;-webkit-user-select:none}.airpad-config-overlay,.view-cwsp{-webkit-tap-highlight-color:transparent;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;line-height:1.5;touch-action:manipulation}.view-cwsp{--view-layout:\"flex\";--view-content-max-width:none}.airpad-config-overlay,.view-cwsp{color-scheme:dark light;--primary:#0061a4;--primary-container:#d1e4ff;--on-primary:#ffffff;--on-primary-container:#001d36;--secondary:#565f71;--secondary-container:#dae2f9;--on-secondary:#ffffff;--on-secondary-container:#131c2b;--tertiary:#705575;--tertiary-container:#fbd7fc;--on-tertiary:#ffffff;--on-tertiary-container:#28132e;--error:#ba1a1a;--error-container:#ffdad6;--on-error:#ffffff;--on-error-container:#410002;--surface:#0f1419;--surface-variant:#1e2124;--surface-container:#1a1d20;--surface-container-low:#16191c;--surface-container-high:#1f2225;--surface-container-highest:#2a2d30;--on-surface:#e0e2e8;--on-surface-variant:#bfc8cc;--outline:#40484c;--outline-variant:#2a3236;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.30),0 1px 3px 1px rgba(0,0,0,0.15);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.30),0 2px 6px 2px rgba(0,0,0,0.15);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.30),0 4px 8px 3px rgba(0,0,0,0.15);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.30),0 6px 10px 4px rgba(0,0,0,0.15);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.30),0 8px 12px 6px rgba(0,0,0,0.15);--state-hover:rgba(255,255,255,0.08);--state-focus:rgba(255,255,255,0.12);--state-pressed:rgba(255,255,255,0.10);--state-selected:rgba(255,255,255,0.16);--state-dragged:rgba(255,255,255,0.16);--space-0:0;--space-1:0.25rem;--space-2:0.5rem;--space-3:0.75rem;--space-4:1rem;--space-5:1.25rem;--space-6:1.5rem;--space-8:2rem;--space-10:2.5rem;--space-12:3rem;--space-16:4rem;--space-20:5rem;--space-24:6rem;--radius-none:0;--radius-xs:0.25rem;--radius-sm:0.5rem;--radius-md:0.75rem;--radius-lg:1rem;--radius-xl:1.5rem;--radius-2xl:2rem;--radius-3xl:3rem;--radius-full:9999px;--text-xs:0.75rem;--text-sm:0.875rem;--text-base:1rem;--text-lg:1.125rem;--text-xl:1.25rem;--text-2xl:1.5rem;--text-3xl:1.875rem;--text-4xl:2.25rem;--text-5xl:3rem;--line-height-tight:1.25;--line-height-normal:1.5;--line-height-relaxed:1.75;--font-weight-thin:100;--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-black:900;--transition-fast:150ms cubic-bezier(0.4,0,0.2,1);--transition-normal:250ms cubic-bezier(0.4,0,0.2,1);--transition-slow:400ms cubic-bezier(0.4,0,0.2,1);--transition-slow-in:400ms cubic-bezier(0.05,0.7,0.1,1);--transition-slow-out:400ms cubic-bezier(0.3,0,0.8,0.15);--motion-easing-standard:cubic-bezier(0.2,0,0,1);--motion-easing-decelerate:cubic-bezier(0,0,0,1);--motion-easing-accelerate:cubic-bezier(0.3,0,1,1);--side-action-bg:#2f3940;--side-action-fg:#f2f6fa;--side-action-border:#6f8694;--side-action-shadow:0 2px 4px rgba(0,0,0,0.32),0 8px 14px rgba(0,0,0,0.24);--side-action-hover-bg:#3a4852;--side-action-active-bg:#26323a;--side-action-hint-bg:#2f536e;--side-action-hint-fg:#e6f2ff;--side-action-hint-border:#6ca3c9;--side-action-hint-hover-bg:#3b6482;--side-action-hint-active-bg:#25485f;--side-action-fix-bg:#6b4b1b;--side-action-fix-fg:#fff0cf;--side-action-fix-border:#f1b654;--side-action-fix-hover-bg:#7c5821;--side-action-fix-active-bg:#5b3e12;--side-action-reload-bg:#9c3d3d;--side-action-reload-fg:#fff5f5;--side-action-reload-border:#c85a5a;--side-action-reload-hover-bg:#b34646;--side-action-reload-active-bg:#7a2f2f}}@layer view.airpad{@media (prefers-color-scheme:light){.airpad-config-overlay:not([data-theme=dark]),.view-cwsp:not([data-theme=dark]){color-scheme:light;--surface:#fafafa;--surface-variant:#e7e5e5;--surface-container:#f3f1f1;--surface-container-low:#eceaea;--surface-container-high:#e6e4e4;--surface-container-highest:#e0dede;--on-surface:#1c1b1f;--on-surface-variant:#49454f;--outline:#79747e;--outline-variant:#cac4d0;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.06),0 1px 3px 1px rgba(0,0,0,0.08);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.06),0 2px 6px 2px rgba(0,0,0,0.08);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.06),0 4px 8px 3px rgba(0,0,0,0.08);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.06),0 6px 10px 4px rgba(0,0,0,0.08);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.06),0 8px 12px 6px rgba(0,0,0,0.08);--state-hover:rgba(0,0,0,0.08);--state-focus:rgba(0,0,0,0.12);--state-pressed:rgba(0,0,0,0.10);--state-selected:rgba(0,0,0,0.16);--state-dragged:rgba(0,0,0,0.16);--side-action-bg:color-mix(in srgb,#ffffff,var(--surface-container-highest) 14%);--side-action-fg:#21303a;--side-action-border:color-mix(in srgb,#8fa2af,transparent 24%);--side-action-shadow:0 1px 2px rgba(10,31,48,0.16),0 4px 10px rgba(10,31,48,0.14);--side-action-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 16%);--side-action-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 26%);--side-action-hint-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 38%);--side-action-hint-fg:#1f2c40;--side-action-hint-border:color-mix(in srgb,var(--secondary),transparent 56%);--side-action-hint-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 54%);--side-action-hint-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 68%);--side-action-fix-bg:#ffe5b5;--side-action-fix-fg:#5b3600;--side-action-fix-border:#c88b1a;--side-action-fix-hover-bg:#ffdd9e;--side-action-fix-active-bg:#ffd187;--side-action-reload-bg:#fa8080;--side-action-reload-fg:#641010;--side-action-reload-border:#ff9999;--side-action-reload-hover-bg:#ffb3b3;--side-action-reload-active-bg:#ff9999}}.airpad-config-overlay[data-theme=light],.view-cwsp[data-theme=light],:root[data-theme=light] .airpad-config-overlay:not([data-theme=dark]){color-scheme:light;--surface:#fafafa;--surface-variant:#e7e5e5;--surface-container:#f3f1f1;--surface-container-low:#eceaea;--surface-container-high:#e6e4e4;--surface-container-highest:#e0dede;--on-surface:#1c1b1f;--on-surface-variant:#49454f;--outline:#79747e;--outline-variant:#cac4d0;--elevation-0:none;--elevation-1:0 1px 2px 0 rgba(0,0,0,0.06),0 1px 3px 1px rgba(0,0,0,0.08);--elevation-2:0 1px 2px 0 rgba(0,0,0,0.06),0 2px 6px 2px rgba(0,0,0,0.08);--elevation-3:0 1px 3px 0 rgba(0,0,0,0.06),0 4px 8px 3px rgba(0,0,0,0.08);--elevation-4:0 2px 3px 0 rgba(0,0,0,0.06),0 6px 10px 4px rgba(0,0,0,0.08);--elevation-5:0 4px 4px 0 rgba(0,0,0,0.06),0 8px 12px 6px rgba(0,0,0,0.08);--state-hover:rgba(0,0,0,0.08);--state-focus:rgba(0,0,0,0.12);--state-pressed:rgba(0,0,0,0.10);--state-selected:rgba(0,0,0,0.16);--state-dragged:rgba(0,0,0,0.16);--side-action-bg:color-mix(in srgb,#ffffff,var(--surface-container-highest) 14%);--side-action-fg:#21303a;--side-action-border:color-mix(in srgb,#8fa2af,transparent 24%);--side-action-shadow:0 1px 2px rgba(10,31,48,0.16),0 4px 10px rgba(10,31,48,0.14);--side-action-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 16%);--side-action-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 26%);--side-action-hint-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 38%);--side-action-hint-fg:#1f2c40;--side-action-hint-border:color-mix(in srgb,var(--secondary),transparent 56%);--side-action-hint-hover-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 54%);--side-action-hint-active-bg:color-mix(in srgb,#ffffff,var(--secondary-container) 68%);--side-action-fix-bg:#ffe5b5;--side-action-fix-fg:#5b3600;--side-action-fix-border:#c88b1a;--side-action-fix-hover-bg:#ffdd9e;--side-action-fix-active-bg:#ffd187;--side-action-reload-bg:#fa8080;--side-action-reload-fg:#641010;--side-action-reload-border:#ff9999;--side-action-reload-hover-bg:#ffb3b3;--side-action-reload-active-bg:#ff9999}.airpad-config-overlay[data-theme=dark],.view-cwsp[data-theme=dark]{color-scheme:dark}.container{flex:1;flex-direction:column;gap:var(--space-4);inline-size:100%;justify-content:flex-start;margin:0 auto;padding:var(--space-4) var(--space-4) calc(var(--space-16) + var(--space-6));position:relative}.bottom-toolbar,.container{align-items:center;display:flex}.bottom-toolbar{gap:var(--space-3);inset-block-end:max(var(--space-4),env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));inset-inline-start:var(--space-4);position:fixed;z-index:4}.primary-btn{align-items:center;background:var(--primary);border:none;border-radius:var(--radius-lg);box-shadow:var(--elevation-1);color:var(--on-primary);cursor:pointer;display:inline-flex;font-family:inherit;font-size:var(--text-base);font-weight:var(--font-weight-medium);gap:var(--space-2);justify-content:center;line-height:var(--line-height-tight);min-inline-size:calc-size(min-content,min(12rem,size));overflow:hidden;padding:var(--space-3) var(--space-6);position:relative;text-decoration:none;touch-action:manipulation;transition:all var(--transition-fast);user-select:none;-webkit-user-select:none}.primary-btn:before{background:var(--state-hover);content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.primary-btn:hover{box-shadow:var(--elevation-2)}.primary-btn:hover:before{opacity:1}.primary-btn:active{box-shadow:var(--elevation-1);transform:scale(.98)}.primary-btn:active:before{background:var(--state-pressed);opacity:0}.primary-btn:focus-visible{box-shadow:var(--elevation-1),0 0 0 4px color-mix(in srgb,var(--primary),transparent 25%);outline:2px solid var(--primary);outline-offset:2px}.primary-btn:disabled{box-shadow:none;cursor:not-allowed;opacity:.38;pointer-events:none;transform:none}.primary-btn:disabled:before{display:none}.toolbar-btn{background:var(--surface-container-high);block-size:3.5rem;border:none;border-radius:var(--radius-2xl);box-shadow:var(--elevation-3);color:var(--on-surface-variant);font-size:var(--text-xl);inline-size:3.5rem;overflow:hidden;position:relative;transition:all var(--transition-fast)}.toolbar-btn:before{background:var(--state-hover);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.toolbar-btn:hover{box-shadow:var(--elevation-4);transform:translateY(-1px)}.toolbar-btn:hover:before{opacity:1}.toolbar-btn:active{box-shadow:var(--elevation-2);transform:scale(.92) translateY(0)}.toolbar-btn:active:before{background:var(--state-pressed);opacity:0}.toolbar-btn:focus-visible{box-shadow:var(--elevation-3),0 0 0 4px color-mix(in srgb,var(--primary),transparent 25%);outline:2px solid var(--primary);outline-offset:2px}.ws-status{align-items:center;border:1px solid transparent;border-radius:var(--radius-2xl);box-shadow:var(--elevation-1);display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-2);letter-spacing:.05em;overflow:hidden;padding:var(--space-1) var(--space-4);position:relative;text-transform:uppercase}.ws-status:before{background:linear-gradient(135deg,var(--outline-variant),transparent);border-radius:inherit;content:\"\";inset:0;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;opacity:.5;padding:1px;position:absolute}.ws-status.ws-status-ok{background:color-mix(in srgb,var(--primary),transparent 12%);border-color:color-mix(in srgb,var(--primary),transparent 30%);color:var(--primary)}.ws-status.ws-status-bad{background:color-mix(in srgb,var(--error),transparent 12%);border-color:color-mix(in srgb,var(--error),transparent 30%);color:var(--error)}.ws-status.ws-status-tls-hint{font-size:var(--text-xs);letter-spacing:0;line-height:1.3;max-inline-size:min(100%,320px);text-transform:none;white-space:normal}.clipboard-preview{background:var(--surface);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);box-shadow:var(--elevation-3);color:var(--on-surface);display:none;font-size:var(--text-sm);inline-size:calc(100% - var(--space-8));inset-block-end:calc(var(--space-16) + var(--space-4));inset-inline:var(--space-4);inset-inline-start:50%;margin:0 auto;max-block-size:4rem;max-inline-size:47.5rem;overflow:hidden;padding:var(--space-3) var(--space-4);position:fixed;transform:translateX(-50%);z-index:3}.clipboard-preview.visible{display:block}.clipboard-preview .meta{color:var(--on-surface-variant);font-size:var(--text-xs);margin-block-end:var(--space-1)}.clipboard-preview .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.config-overlay{align-items:center;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--shadow,#000),transparent 40%);color:var(--on-surface,#e0e2e8);display:none;inset:0;justify-content:center;overflow:hidden;overscroll-behavior:contain;padding:var(--space-4);position:fixed;scrollbar-color:transparent transparent;scrollbar-width:none;z-index:8}.config-overlay.flex{display:flex}.config-panel{animation:scaleIn .2s cubic-bezier(.4,0,.2,1);background:var(--surface-container-high);block-size:min(80cqb,48rem,80dvb)!important;border:1px solid var(--outline-variant);border-radius:var(--radius-2xl);box-shadow:var(--elevation-5);contain:strict!important;container-name:config-panel!important;container-type:size!important;display:flex;flex-basis:auto;flex-direction:column;flex-grow:0;flex-shrink:1;inline-size:min(min(100cqi,100%) - var(--space-8),min(28rem,100cqi,100%));max-block-size:min(80cqb,48rem,80dvb)!important;max-inline-size:max-content;min-block-size:0;min-inline-size:min(28rem,100cqi,100%);overflow:hidden;overscroll-behavior:contain;padding:var(--space-1,4px);pointer-events:auto;touch-action:pan-y;user-select:none}.config-panel h3{color:var(--on-surface);font-size:var(--text-2xl);font-weight:var(--font-weight-semibold);line-height:var(--line-height-tight);margin:0 0 var(--space-6) 0;margin-block-start:var(--space-4,16px);text-align:center}.config-panel__body{block-size:stretch;box-sizing:border-box;contain:strict!important;flex:1;inline-size:stretch;min-block-size:0;overflow-block:auto;overflow-inline:visible;overscroll-behavior:contain;padding-inline:0;scrollbar-color:var(--outline-variant) transparent;scrollbar-width:thin}.config-group{margin-block-end:var(--space-5);overflow:visible;padding-inline:var(--space-4,16px)}.config-group label{color:var(--on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);line-height:var(--line-height-normal);margin-block-end:var(--space-2)}.config-group input,.config-group select,.config-group textarea{background:var(--surface-container-highest);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);box-sizing:border-box;color:var(--on-surface);font-family:inherit;font-size:var(--text-base);inline-size:100%;line-height:var(--line-height-normal);padding:var(--space-4) var(--space-4);pointer-events:auto;transition:all var(--transition-fast);user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.config-group input:hover,.config-group select:hover,.config-group textarea:hover{background:var(--surface-container);border-color:var(--outline)}.config-group input:focus,.config-group select:focus,.config-group textarea:focus{background:var(--surface-container-highest);border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary),transparent 20%);outline:none}.config-group input::placeholder,.config-group select::placeholder,.config-group textarea::placeholder{color:var(--on-surface-variant);opacity:.7}.config-group input:invalid,.config-group select:invalid,.config-group textarea:invalid{border-color:var(--error);box-shadow:0 0 0 3px color-mix(in srgb,var(--error),transparent 20%)}.config-actions{display:flex;gap:var(--space-3);justify-content:flex-end;margin-block-start:var(--space-6)}.config-actions button{border:none;border-radius:var(--radius-lg);cursor:pointer;font-family:inherit;font-size:var(--text-base);font-weight:var(--font-weight-medium);min-inline-size:6rem;padding:var(--space-3) var(--space-5);transition:all var(--transition-fast)}.config-actions button:first-child{background:var(--primary);color:var(--on-primary)}.config-actions button:first-child:hover{background:color-mix(in srgb,var(--primary),black 8%)}.config-actions button:first-child:active{background:color-mix(in srgb,var(--primary),black 12%);transform:scale(.98)}.config-actions button:last-child{background:var(--surface-container-high);border:1px solid var(--outline-variant);color:var(--on-surface-variant)}.config-actions button:last-child:hover{background:var(--surface-container-highest);border-color:var(--outline)}.config-actions button:last-child:active{background:color-mix(in srgb,var(--surface-container-high),var(--state-pressed));transform:scale(.98)}.config-actions button:focus-visible{outline:2px solid var(--primary);outline-offset:2px}.config-actions button:disabled{cursor:not-allowed;opacity:.38;pointer-events:none}.log-overlay{align-items:center;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--shadow,#000),transparent 35%);display:none;inset:0;justify-content:center;padding:var(--space-4);position:fixed;z-index:9}.log-overlay.open,.log-panel{display:flex}.log-panel{background:var(--surface);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);box-shadow:var(--elevation-5);flex-direction:column;inline-size:min(35rem,100vw - var(--space-8));max-block-size:calc(100vb - var(--space-8));overflow:hidden}.log-overlay-header{align-items:center;border-block-end:1px solid var(--outline-variant);display:flex;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);justify-content:space-between;padding:var(--space-3) var(--space-4)}.ghost-btn{background:var(--surface-variant);border:1px solid var(--outline-variant);border-radius:var(--radius-lg);color:var(--on-surface-variant);cursor:pointer;font-size:var(--text-xs);padding:var(--space-2) var(--space-3)}.ghost-btn:active{filter:brightness(.92)}.log-container{color:var(--on-surface);flex:1;font-family:JetBrains Mono,Fira Code,Courier New,monospace;font-size:var(--text-xs);line-height:1.5;max-block-size:25rem;overflow-y:auto;padding:var(--space-4) var(--space-5)}.hero{align-items:center;display:flex;flex-direction:column;gap:var(--space-4);inline-size:100%;padding:var(--space-2) 0;text-align:center}.hero h1{color:var(--on-surface);font-size:var(--text-4xl);font-weight:var(--font-weight-bold);letter-spacing:-.025em;line-height:var(--line-height-tight);margin:0 0 var(--space-2) 0}.hero .subtitle{color:var(--on-surface-variant);font-size:var(--text-lg);line-height:var(--line-height-normal);max-inline-size:48rem;opacity:.87}.status-container{display:flex;flex-direction:row;flex-wrap:nowrap;gap:var(--space-2);place-content:center;place-items:center;align-items:start;justify-content:center;text-align:start}.status-bar{align-items:center;background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);color:var(--on-surface-variant);display:flex;flex-wrap:wrap;font-size:var(--text-sm);gap:var(--space-4);justify-content:center;padding:var(--space-2) var(--space-4)}.status-bar .status-item{align-items:start;background:var(--surface);border-radius:var(--radius-lg);display:flex;flex-wrap:nowrap;gap:var(--space-2);justify-items:center;overflow:hidden;padding:var(--space-1) var(--space-2);text-align:start;text-overflow:ellipsis;white-space:nowrap}.status-bar .status-item span.value{font-variant-numeric:tabular-nums;font-weight:var(--font-weight-semibold);margin-inline-start:var(--space-1)}.big-button{align-items:center;background:var(--surface-container-high);block-size:10rem;border:none;border-radius:50%;box-shadow:var(--elevation-3);color:var(--on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-xl);font-weight:var(--font-weight-semibold);inline-size:10rem;justify-content:center;overflow:hidden;position:relative;touch-action:none;transition:all var(--transition-normal);user-select:none;-webkit-user-select:none}.big-button:before{background:var(--state-hover);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.big-button:hover{box-shadow:var(--elevation-4);transform:translateY(-2px)}.big-button:hover:before{opacity:1}.big-button:active{box-shadow:var(--elevation-2);transform:translateY(0) scale(.96)}.big-button:active:before{background:var(--state-pressed);opacity:0}.big-button.active{background:var(--primary-container);box-shadow:var(--elevation-4),0 0 0 6px color-mix(in srgb,var(--primary),transparent 15%);color:var(--on-primary-container)}.big-button.air{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--surface-container-high),color-mix(in srgb,var(--surface-container-high),var(--primary) 8%))}.big-button.air.active{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--primary-container),var(--primary));color:var(--on-primary-container)}.big-button.ai{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--surface-container-high),color-mix(in srgb,var(--surface-container-high),var(--secondary) 8%))}.big-button.ai.active{animation:pulse 2s infinite;background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--secondary-container),var(--secondary));color:var(--on-secondary-container)}.big-button.air-move{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--primary),color-mix(in srgb,var(--primary),black 10%));color:var(--on-primary)}.big-button.ai.listening{background:radial-gradient(ellipse 80% 60% at 50% 20%,var(--error),color-mix(in srgb,var(--error),black 10%));box-shadow:var(--elevation-4),0 0 0 6px color-mix(in srgb,var(--error),transparent 15%);color:var(--on-error)}.ai-block,.air-block,.air-row{gap:.5rem;position:relative}.air-row{align-items:end;display:flex;flex-direction:row}.neighbor-button{inset-block-end:-1rem;inset-inline-end:-4.5rem;position:absolute;transform:translate(-50%)}.ai-block{margin-block-end:.75rem}.label{color:#bfc8cc;font-size:1rem;line-height:1.4}.voice-line{color:#e0e2e8;margin-block-start:.25rem;min-block-size:18px}.hint,.voice-line{font-size:1rem;max-inline-size:560px}.hint{color:#bfc8cc;display:flex;flex-direction:column;margin-block-start:.75rem}.hint ul{margin:.25rem 0 0;padding-inline-start:1.25rem}.hint li{margin-block-start:.25rem}.stage{block-size:max-content;flex:1;gap:var(--space-8);inline-size:100%;justify-content:flex-end;min-block-size:20rem}.ai-block,.air-block,.stage{align-items:center;display:flex;flex-direction:column}.ai-block,.air-block{gap:var(--space-2)}.ai-block{margin-block-end:var(--space-3)}.label{color:var(--on-surface-variant);font-size:min(var(--text-base),.8rem);line-height:var(--line-height-normal);opacity:.87}.label,.voice-line{font-weight:var(--font-weight-medium);text-align:center}.voice-line{background:var(--surface-container);border:1px solid var(--outline-variant);border-radius:var(--radius-xl);color:var(--on-surface);font-size:var(--text-xl);font-variant-numeric:tabular-nums;inline-size:100%;line-height:var(--line-height-tight);margin-block-start:var(--space-2);max-inline-size:40rem;min-block-size:1.5rem;padding:var(--space-3) var(--space-4);position:relative}.voice-line:before{background:var(--state-focus);border-radius:inherit;content:\"\";inset:0;opacity:0;position:absolute;transition:opacity var(--transition-fast)}.voice-line.listening{background:color-mix(in srgb,var(--secondary-container),transparent 20%);border-color:var(--secondary)}.voice-line.listening:before{background:var(--secondary);opacity:.3}.hint{color:var(--on-surface-variant);font-size:var(--text-sm);line-height:var(--line-height-relaxed);margin-block-start:var(--space-6);max-inline-size:48rem;opacity:.8;text-align:center}.hint ul{display:inline-block;margin:var(--space-3) 0 0;padding-inline-start:var(--space-6);text-align:left}.hint li{margin-block-start:var(--space-2);padding-inline-start:var(--space-3);position:relative}.hint li::marker{color:var(--primary);font-weight:var(--font-weight-semibold)}.hint li:before{background:var(--primary);block-size:4px;border-radius:var(--radius-full);content:\"\";inline-size:4px;inset-block-start:.5em;inset-inline-start:0;position:absolute}.side-log-toggle{background:#40484c;border:1px solid #40484c;border-radius:1rem;box-shadow:0 1px 3px 0 rgba(0,0,0,.3),0 4px 8px 3px rgba(0,0,0,.15);color:#e0e2e8;cursor:pointer;font-size:.875rem;inset-block-start:50%;inset-inline-end:1rem;padding:.75rem 1rem;position:fixed;transform:translateY(-50%);transition:all .15s cubic-bezier(.4,0,.2,1);z-index:5}.side-log-toggle:active{transform:translateY(-50%) scale(.98)}.neighbor-button{align-items:center;background:#40484c;block-size:60px;border:1px solid #40484c;border-radius:9999px;box-shadow:0 1px 2px 0 rgba(0,0,0,.3),0 2px 6px 2px rgba(0,0,0,.15);color:#e0e2e8;cursor:pointer;display:inline-flex;font-size:1rem;font-weight:600;inline-size:60px;justify-content:center;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none;-webkit-user-select:none}.neighbor-button:active{background:#353d41;transform:scale(.95)}.air-button-container{align-items:center;display:flex;gap:.75rem}.keyboard-toggle{align-items:center;background:linear-gradient(135deg,#0061a4,#004d7a);block-size:56px;border:none;border-radius:9999px;box-shadow:0 2px 3px 0 rgba(0,0,0,.3),0 6px 10px 4px rgba(0,0,0,.15);color:white;cursor:pointer;display:flex;font-size:24px;inline-size:56px;inset-block-end:1.25rem;inset-inline-end:1.25rem;justify-content:center;position:fixed;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none;-webkit-user-select:none;z-index:4}.keyboard-toggle:active{box-shadow:0 1px 2px 0 rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15);transform:scale(.95)}.keyboard-toggle-editable{caret-color:transparent;color:transparent!important;outline:none;overflow:hidden;text-shadow:none!important}.keyboard-toggle-editable:before{color:white;content:\"⌨️\";font-size:24px;inset-block-start:50%;inset-inline-start:50%;line-height:1;pointer-events:none;position:absolute;transform:translate(-50%,-50%);z-index:2}.keyboard-toggle-editable:focus{caret-color:transparent}.keyboard-toggle-editable:focus:after{border-radius:9999px;box-shadow:0 0 0 2px rgba(255,255,255,.3);content:\"\";inset:0;pointer-events:none;position:absolute;z-index:1}.virtual-keyboard-container{background:transparent;display:none;flex-direction:column;inset:0;max-block-size:50vh;pointer-events:none;position:fixed;transform:translateY(100%);transition:transform .25s cubic-bezier(.4,0,.2,1);z-index:8}.virtual-keyboard-container.visible{display:flex;pointer-events:auto;transform:translateY(0)}.keyboard-header{align-items:center;border-block-end:1px solid #40484c;display:flex;justify-content:space-between;padding:.5rem .75rem}.keyboard-close{background:transparent;border:none;color:#bfc8cc;cursor:pointer;font-size:20px;line-height:1;padding:.25rem .5rem}.keyboard-close:active{color:#e0e2e8}.keyboard-tabs{display:flex;gap:.5rem}.keyboard-tab{background:#40484c;border:none;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:.875rem;padding:.5rem .75rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.keyboard-tab.active{background:#0061a4;color:white}.keyboard-content{flex:1;overflow-y:auto;padding:.5rem}.keyboard-panel{display:none}.keyboard-panel.active{display:block}.keyboard-shift-container{margin-block-end:.5rem}.keyboard-shift{background:#40484c;border:1px solid #40484c;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:1rem;inline-size:100%;padding:.5rem 1rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.keyboard-shift.active{background:#0061a4;color:white}.keyboard-rows{display:flex;flex-direction:column;gap:.5rem;margin-block-end:.5rem}.keyboard-row{display:flex;gap:.25rem;justify-content:center}.keyboard-key{background:#40484c;block-size:44px;border:1px solid #40484c;border-radius:.75rem;color:#e0e2e8;cursor:pointer;flex:1;font-size:1rem;font-weight:500;max-inline-size:48px;min-inline-size:32px;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1);user-select:none}.keyboard-key:active{background:#0061a4;color:white;transform:scale(.95)}.keyboard-key.special{flex:2;font-size:.875rem;max-inline-size:none}.keyboard-key.space{flex:4}.keyboard-special{display:flex;gap:.25rem;margin-block-start:.5rem}.emoji-categories{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-end:.75rem}.emoji-category-btn{background:#40484c;border:none;border-radius:.75rem;color:#bfc8cc;cursor:pointer;font-size:.75rem;padding:.5rem .75rem;transition:all .15s cubic-bezier(.4,0,.2,1)}.emoji-category-btn.active{background:#0061a4;color:white}.emoji-grid{display:grid;gap:.5rem;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));max-block-size:200px;overflow-y:auto}.emoji-key{align-items:center;background:#40484c;block-size:44px;border:1px solid #40484c;border-radius:.75rem;cursor:pointer;display:flex;font-size:24px;inline-size:44px;justify-content:center;touch-action:manipulation;transition:all .15s cubic-bezier(.4,0,.2,1)}.emoji-key:active{background:#0061a4;transform:scale(.95)}}@layer view.airpad{}@layer view.airpad{}@layer view.airpad{@media (max-width:520px){.big-button{block-size:140px;border-radius:9999px;inline-size:140px}.neighbor-button{block-size:50px;border-radius:9999px;font-size:.875rem;inline-size:50px}.air-button-container{gap:.75rem}.stage{gap:1.5rem}.side-log-toggle{inset-inline-end:.75rem}.bottom-toolbar{gap:.5rem;inset-block-end:max(1rem,env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));inset-inline-start:1rem}.toolbar-btn{block-size:48px;border-radius:1rem;font-size:20px;inline-size:48px}.clipboard-preview{inset-block-end:5rem}.keyboard-toggle{block-size:48px;border-radius:9999px;font-size:20px;inline-size:48px;inset-block-end:1rem;inset-inline-end:1rem}.virtual-keyboard-container{max-block-size:calc(100vh - 4rem)}.keyboard-key{block-size:40px;font-size:.875rem;max-inline-size:40px;min-inline-size:28px}.emoji-key{block-size:40px;font-size:20px;inline-size:40px}}}@layer view.airpad{.view-cwsp{background:var(--surface);color:var(--on-surface);min-block-size:100%;position:relative;--action-rail-btn-size:3.25rem;--action-rail-height:4.15rem;--action-rail-bottom:max(var(--space-4),env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));--action-rail-edge:clamp(0.35rem,1.1vw,0.7rem)}.view-cwsp .container{margin-inline:auto;max-inline-size:min(1080px,100%);min-block-size:100%;padding:clamp(.55rem,1.25vh,1.05rem) clamp(.75rem,1.8vw,1.25rem) calc(var(--action-rail-height) + var(--space-4))}.view-cwsp .hero h1{font-size:clamp(1.5rem,3.6vh,2.5rem);margin-block-end:clamp(.25rem,.8vh,.75rem)}.view-cwsp .hero .subtitle{font-size:clamp(.875rem,1.6vh,1rem)}.view-cwsp .status-container{align-items:start;display:flex;flex-direction:column;gap:clamp(.35rem,.8vh,.75rem);inline-size:min(100%,680px);justify-items:center;text-align:start}.view-cwsp .status-bar{align-items:stretch;display:grid;gap:clamp(.22rem,.5vh,.55rem);grid-template-columns:repeat(2,minmax(0,1fr));inline-size:100%;padding:clamp(.25rem,.8vh,.5rem) clamp(.5rem,1vw,.875rem)}.view-cwsp .status-bar .status-item{justify-content:start;min-inline-size:0}.view-cwsp .stage{gap:clamp(.5rem,1.15vh,.9rem);justify-content:center;min-block-size:clamp(10rem,24vh,14.5rem)}.view-cwsp .air-row{align-items:flex-end;position:relative}.view-cwsp .big-button{block-size:clamp(6.2rem,14vh,8.75rem);flex-shrink:0;font-size:clamp(1rem,2.3vh,1.4rem);inline-size:clamp(6.2rem,14vh,8.75rem);min-block-size:6.2rem;min-inline-size:6.2rem}.view-cwsp .neighbor-button{block-size:clamp(2.8rem,5.5vh,3.35rem);flex-shrink:0;inline-size:clamp(2.8rem,5.5vh,3.35rem);inset-block-end:.2rem;inset-inline-end:clamp(-2.2rem,-3.5vw,-1.6rem);min-block-size:2.8rem;min-inline-size:2.8rem;transform:none}.view-cwsp .big-button.active,.view-cwsp .big-button.air-move,.view-cwsp .big-button:active,.view-cwsp .neighbor-button.active,.view-cwsp .neighbor-button:active{transform:none}.view-cwsp .voice-line{font-size:clamp(.85rem,1.8vh,1rem);inline-size:100%;margin-block-start:clamp(.1rem,.35vh,.3rem);max-inline-size:40rem;padding:clamp(.4rem,1vh,.65rem) clamp(.5rem,1.2vw,.9rem)}.view-cwsp .hint{display:grid;font-size:clamp(.72rem,1.5vh,.86rem);gap:clamp(.35rem,1vh,.7rem);grid-template-columns:repeat(3,minmax(0,1fr));inline-size:100%;margin-block-start:clamp(.15rem,.55vh,.5rem);max-inline-size:min(1080px,100%);text-align:initial}.view-cwsp .hint-group{background:color-mix(in srgb,var(--surface-container),transparent 10%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 22%);border-radius:var(--radius-lg);line-height:1.35;margin:0;overflow:clip;padding:clamp(.35rem,.9vh,.65rem) clamp(.45rem,1vw,.8rem)}.view-cwsp .hint-group summary{color:var(--on-surface);cursor:pointer;font-size:clamp(.76rem,1.65vh,.92rem);font-weight:var(--font-weight-semibold);list-style:none;padding:.05rem 0}.view-cwsp .hint-group summary::-webkit-details-marker{display:none}.view-cwsp .hint-group summary:after{content:\"▾\";float:inline-end;opacity:.75;transition:transform var(--transition-fast)}.view-cwsp .hint-group:not([open]) summary:after{transform:rotate(-90deg)}.view-cwsp .hint-group ul{margin:clamp(.25rem,.8vh,.45rem) 0 0;padding-inline-start:1rem}.view-cwsp .hint-group li{margin-block:clamp(.15rem,.45vh,.3rem)}.view-cwsp .hint-group code{background:color-mix(in srgb,var(--surface-container-high),transparent 8%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 30%);border-radius:.4rem;font-size:.9em;padding:.1rem .35rem}.view-cwsp .side-actions-row{align-items:center;display:flex;flex-direction:column;gap:var(--space-2);inline-size:fit-content;inset-block-end:calc(var(--action-rail-bottom) + var(--action-rail-height) + var(--space-2));inset-inline-start:var(--action-rail-edge);position:fixed;z-index:7}.view-cwsp .side-actions-row .side-log-toggle{background:var(--side-action-bg);block-size:auto;border:1px solid var(--side-action-border);border-radius:.95rem;box-shadow:var(--side-action-shadow);color:var(--side-action-fg);font-weight:var(--font-weight-semibold);inline-size:100%;inset:auto;letter-spacing:.01em;line-height:1;min-block-size:2.3rem;min-inline-size:5.25rem;order:1;padding:.55rem .9rem;position:relative;text-align:center;transform:none;transition:background var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast),transform var(--transition-fast),color var(--transition-fast);white-space:nowrap;writing-mode:horizontal-tb}.view-cwsp .side-actions-row .side-log-toggle:hover{background:var(--side-action-hover-bg);border-color:color-mix(in srgb,var(--side-action-border),var(--side-action-fg) 22%);box-shadow:0 3px 6px rgba(0,0,0,.34),0 10px 18px rgba(0,0,0,.28)}.view-cwsp .side-actions-row .side-log-toggle:focus-visible{outline:2px solid color-mix(in srgb,var(--primary),white 20%);outline-offset:1px}.view-cwsp .side-actions-row .side-log-toggle:active{background:var(--side-action-active-bg);transform:translateY(1px)}.view-cwsp .side-actions-row .side-hint-toggle{background:var(--side-action-hint-bg);border-color:var(--side-action-hint-border);color:var(--side-action-hint-fg);order:2}.view-cwsp .side-actions-row .side-hint-toggle:hover{background:var(--side-action-hint-hover-bg,var(--side-action-hint-bg))}.view-cwsp .side-actions-row .side-hint-toggle:active{background:var(--side-action-hint-active-bg,var(--side-action-active-bg))}.view-cwsp .side-actions-row .side-fix-toggle{background:var(--side-action-fix-bg);border-color:var(--side-action-fix-border);color:var(--side-action-fix-fg);order:3}.view-cwsp .side-actions-row .side-fix-toggle:hover{background:var(--side-action-fix-hover-bg,var(--side-action-fix-bg))}.view-cwsp .side-actions-row .side-fix-toggle:active{background:var(--side-action-fix-active-bg,var(--side-action-active-bg))}.view-cwsp .side-actions-row .side-reload-toggle{background:var(--side-action-reload-bg);border-color:var(--side-action-reload-border);color:var(--side-action-reload-fg);order:4}.view-cwsp .side-actions-row .side-reload-toggle:hover{background:var(--side-action-reload-hover-bg,var(--side-action-reload-bg))}.view-cwsp .side-actions-row .side-reload-toggle:active{background:var(--side-action-reload-active-bg,var(--side-action-active-bg))}.view-cwsp .keyboard-toggle{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);font-size:1.125rem;inline-size:var(--action-rail-btn-size);inset:auto;opacity:1;pointer-events:auto;position:relative;z-index:auto}.view-cwsp .keyboard-toggle.is-disabled{filter:saturate(.85) brightness(.95);opacity:.94}.view-cwsp .bottom-toolbar{align-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);background:color-mix(in srgb,var(--surface-container-high),transparent 12%);block-size:auto;border:1px solid color-mix(in srgb,var(--outline),transparent 35%);border-radius:clamp(.7rem,1.9vw,.95rem);box-shadow:var(--elevation-4);display:grid;gap:var(--space-1);grid-auto-columns:max-content;grid-auto-flow:column;inline-size:fit-content;inset-block-end:var(--action-rail-bottom);inset-inline:50%;justify-content:center;max-inline-size:calc(min(100cqi, 100%) - var(--action-rail-edge) * 2);overflow-x:auto;overflow-y:hidden;padding:.38rem;position:fixed;scrollbar-width:none;transform:translateX(-50%);z-index:6;-ms-overflow-style:none}.view-cwsp .bottom-toolbar::-webkit-scrollbar{display:none}.view-cwsp .bottom-toolbar .toolbar-btn{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);font-size:1.125rem;inline-size:var(--action-rail-btn-size)}.view-cwsp .bottom-toolbar .keyboard-toggle,.view-cwsp .bottom-toolbar .toolbar-btn{background:color-mix(in srgb,var(--surface-container),transparent 8%);border:1px solid color-mix(in srgb,var(--outline-variant),transparent 20%);box-shadow:var(--elevation-2);flex:0 0 auto}.view-cwsp .bottom-toolbar .keyboard-toggle{color:var(--on-surface)}.view-cwsp .bottom-toolbar .toolbar-btn:hover{box-shadow:var(--elevation-3);transform:translateY(-1px)}.view-cwsp .bottom-toolbar .toolbar-btn:active{transform:scale(.94)}.view-cwsp .bottom-toolbar #btnConfig{background:color-mix(in srgb,var(--primary),var(--surface-container-high) 65%);border-color:color-mix(in srgb,var(--primary),transparent 45%);color:var(--on-primary);order:10}.view-cwsp .bottom-toolbar #btnCut{order:20}.view-cwsp .bottom-toolbar #btnCopy{order:30}.view-cwsp .bottom-toolbar #btnPaste{order:40}.view-cwsp .bottom-toolbar #btnConnect{order:50}.view-cwsp .bottom-toolbar .keyboard-toggle{order:60}.view-cwsp .connect-fab{block-size:var(--action-rail-btn-size);border-radius:var(--radius-xl);box-shadow:var(--elevation-2);font-size:.92rem;font-weight:700;inline-size:fit-content;inset:auto;letter-spacing:.01em;margin:0;max-inline-size:100%;min-inline-size:4.25rem;overflow:hidden;padding-inline:.8rem;position:relative;text-overflow:clip;white-space:nowrap;z-index:auto}.view-cwsp .connect-fab.connect-fab--ws{background:color-mix(in srgb,var(--primary),var(--surface-container-high) 72%);border-color:color-mix(in srgb,var(--primary),transparent 40%);color:var(--on-primary)}.view-cwsp .bottom-toolbar #btnAdminDoor{order:55}.view-cwsp .toolbar-btn.toolbar-btn--admin-door{background:color-mix(in srgb,var(--color-error,#c62828) 20%,var(--surface-container-high));border-color:color-mix(in srgb,var(--color-error,#c62828) 45%,var(--surface-outline,transparent));color:color-mix(in srgb,var(--color-error,#b71c1c) 75%,var(--on-surface));font-size:.68rem;font-weight:800;letter-spacing:.03em;padding-inline:.45rem}.view-cwsp .hint-overlay .hint-panel{inline-size:min(44rem,100vw - var(--space-8))}.view-cwsp .hint-modal-content.hint{inline-size:100%;margin:0;max-block-size:min(68vh,36rem);max-inline-size:none;opacity:1;overflow-y:auto;padding:var(--space-3) var(--space-4) var(--space-4);text-align:start}@media (max-width:520px){.view-cwsp{--action-rail-btn-size:2.8rem;--action-rail-height:3.55rem;--action-rail-bottom:max(0.75rem,env(safe-area-inset-bottom,0px),env(keyboard-inset-height,0px));--action-rail-edge:0.3rem}.view-cwsp .container{padding:.5rem .6rem calc(var(--action-rail-height) + .6rem)}.view-cwsp .hero h1{font-size:clamp(1.2rem,3vh,1.5rem)}.view-cwsp .hero .subtitle{font-size:.82rem}.view-cwsp .status-bar{font-size:.74rem;gap:.3rem;grid-template-columns:repeat(2,minmax(0,1fr));inline-size:100%}.view-cwsp .status-container{inline-size:100%}.view-cwsp .neighbor-button{block-size:2.45rem;font-size:.82rem;inline-size:2.45rem;inset-inline-end:-1.35rem}.view-cwsp .bottom-toolbar{border-radius:.78rem;gap:.3rem;inline-size:100%;inset-block-end:var(--action-rail-bottom);inset-inline:50%;padding:.32rem;transform:translateX(-50%)}.view-cwsp .bottom-toolbar .keyboard-toggle,.view-cwsp .bottom-toolbar .toolbar-btn{block-size:var(--action-rail-btn-size);border-radius:var(--radius-lg);font-size:1rem;inline-size:var(--action-rail-btn-size)}.view-cwsp .connect-fab{font-size:.86rem;min-inline-size:4rem;padding-inline:.65rem}.view-cwsp .side-actions-row{gap:.38rem;inset-block-end:calc(var(--action-rail-bottom) + var(--action-rail-height) + 3.35rem);inset-inline-start:var(--action-rail-edge)}.view-cwsp .side-actions-row .side-log-toggle{border-radius:.8rem;font-size:.8rem;min-block-size:2rem;padding:.46rem .68rem}.view-cwsp .hint-overlay .hint-panel{inline-size:calc(100vw - 1rem);max-block-size:calc(100vh - 2rem)}.view-cwsp .hint-modal-content.hint{max-block-size:calc(100vh - 7.5rem);padding:var(--space-2) var(--space-3) var(--space-3)}.view-cwsp .hint{font-size:.76rem;gap:.4rem;grid-template-columns:1fr}.view-cwsp .hint-group{padding:.45rem .55rem}}@media (max-height:860px),(max-width:980px){.view-cwsp .hint{grid-template-columns:1fr;max-inline-size:min(620px,100%)}.view-cwsp .stage{min-block-size:clamp(9.4rem,21vh,12.6rem)}}}@layer view.airpad{:where(.app-shell__content)>:where([data-view=airpad]){overflow:visible}cw-airpad-app[data-view=airpad]{align-self:stretch;block-size:100%;display:flex;flex:1 1 auto;flex-direction:column;min-block-size:0;min-inline-size:0;overflow:visible}}";
//#endregion
//#region ../../modules/views/airpad-view/src/index.ts
/**
* Airpad View
* 
* Shell-agnostic air trackpad + AI assistant component.
* Wraps the existing airpad functionality as a view.
*/
var TAG = "cw-airpad-view";
var CwAirpadView = createViewConstructor(TAG, (Base) => {
	return class AirpadView extends Base {
		id = "airpad";
		name = "Airpad";
		icon = "hand-pointing";
		element = null;
		appElement = null;
		initialized = false;
		initPromise = null;
		_sheet = null;
		_orientationLocked = false;
		lifecycle = {
			onMount: () => {
				this._sheet ??= loadAsAdopted(airpad_default);
				this.initAirpad();
			},
			onUnmount: () => this.cleanup(),
			onShow: () => {
				this._sheet ??= loadAsAdopted(airpad_default);
				this.lockOrientationForAirpad();
				if (!this.initialized) this.initAirpad();
			},
			onHide: () => {
				setRemoteKeyboardEnabled(false);
				this.unlockOrientationForAirpad();
				try {
					if (this._sheet) removeAdopted(this._sheet);
				} catch {}
				this._sheet = null;
			}
		};
		constructor(options) {
			super();
			if (options) this.options = options;
		}
		/** Shell passes shell `ViewOptions`; registry `ViewBase` uses a narrower options bag — merge via cast. */
		render = (options) => {
			if (options) this.options = {
				...this.options,
				...options
			};
			if (this.initialized) this.cleanup();
			ensureCwAirpadAppDefined();
			this.element = H`
            <cw-airpad-app data-airpad-app></cw-airpad-app>
        `;
			this.appElement = this.element;
			return this.element;
		};
		getToolbar() {
			return null;
		}
		async initAirpad() {
			if (this.initialized) return;
			if (this.initPromise) return this.initPromise;
			this.initPromise = (async () => {
				const app = this.appElement ?? this.element;
				if (!app) return;
				try {
					await app.start?.();
					await this.lockOrientationForAirpad()?.catch?.((error) => {
						console.error("[Airpad] Failed to lock orientation:", error);
					});
					this.initialized = true;
				} catch (error) {
					console.error("[Airpad] Failed to initialize:", error);
					this.appElement?.retry?.();
				} finally {
					this.initPromise = null;
				}
			})();
			return this.initPromise;
		}
		cleanup() {
			this.appElement?.dispose?.();
			this.unlockOrientationForAirpad();
			this.initialized = false;
			this.initPromise = null;
			this.appElement = null;
		}
		async lockOrientationForAirpad() {
			try {
				const orientationApi = globalThis?.screen?.orientation;
				if (!orientationApi || typeof orientationApi.lock !== "function") return;
				const lockType = String(orientationApi.type || "").toLowerCase() || "natural";
				await orientationApi.lock(lockType);
				this._orientationLocked = true;
			} catch {
				this._orientationLocked = false;
			}
		}
		unlockOrientationForAirpad() {
			try {
				if (!this._orientationLocked) return;
				const orientationApi = globalThis?.screen?.orientation;
				if (!orientationApi || typeof orientationApi.unlock !== "function") return;
				orientationApi.unlock();
			} catch {} finally {
				this._orientationLocked = false;
			}
		}
		async invokeChannelApi(action, _payload) {
			switch (action) {
				case AirpadChannelAction.Start:
				case AirpadChannelAction.AirpadStart: return this.initAirpad();
				case AirpadChannelAction.Retry:
					this.appElement?.retry?.();
					return true;
				default: return;
			}
		}
		canHandleMessage() {
			return false;
		}
		async handleMessage() {}
	};
});
function createAirpadView(options) {
	return new CwAirpadView(options);
}
//#endregion
export { CwAirpadView, TAG, createAirpadView, createAirpadView as default };
