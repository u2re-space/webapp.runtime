import { g as loadAsAdopted, y as removeAdopted } from "../fest/dom.js";
import { q as H } from "../com/app.js";
import { t as createViewConstructor } from "../chunks/registry2.js";
import { a as disconnectAirPadSession, i as waitForDomPaint, n as unmountAirpadRuntime, r as setRemoteKeyboardEnabled } from "./airpad3.js";
import { t as AirpadChannelAction } from "./apis.js";
//#region src/frontend/views/airpad/component/AirpadController.ts
var AirpadController = class {
	initialized = false;
	mountPromise = null;
	async mount(contentHost) {
		if (this.initialized) return;
		if (this.mountPromise) return this.mountPromise;
		this.mountPromise = (async () => {
			const { default: mountAirpad } = await import("./airpad3.js").then((n) => n.t);
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
//#region src/frontend/views/airpad/component/CwAirpadApp.ts
var TAG$1 = "cw-airpad-app";
var CwAirpadAppElement = class extends HTMLElement {
	controller = new AirpadController();
	started = false;
	contentHost = null;
	connectedCallback() {
		if (!this.isConnected) return;
		this.renderShell();
		this.start();
	}
	disconnectedCallback() {
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
		if (this.contentHost?.isConnected && this.querySelector(".view-cwsp")) return;
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
//#region src/frontend/views/airpad/airpad.scss?inline
var airpad_default = "@layer view.airpad{[data-shell-content]:has(>[data-view=airpad]){overflow:hidden;overscroll-behavior:none}:where(.app-shell__content)>:where([data-view=airpad]){overflow:visible}cw-airpad-app[data-view=airpad]{align-self:stretch;flex:1 1 auto;flex-direction:column;min-block-size:0;min-inline-size:0}.view-cwsp,cw-airpad-app[data-view=airpad]{block-size:100%;display:flex;overflow:visible}.view-cwsp{background-color:var(--view-bg,var(--color-surface,var(--surface,#0a0a0a)));color:var(--view-fg,var(--color-on-surface,var(--on-surface,#fff)));flex-direction:column;--action-rail-edge:0.75rem;pointer-events:auto}.view-cwsp__content{display:flex;flex:1;flex-direction:column;min-block-size:0;overflow:visible;pointer-events:auto}.view-cwsp__content>.container{flex:1 1 auto;min-block-size:0;overflow-block:auto;overflow-inline:hidden;pointer-events:auto}.view-cwsp .log-overlay:not(.open){pointer-events:none}.bottom-toolbar{touch-action:pan-x}.bottom-toolbar button{-webkit-tap-highlight-color:transparent}.view-cwsp__loading{align-items:center;block-size:100%;color:var(--view-fg,var(--on-surface));display:flex;flex-direction:column;gap:1rem;justify-content:center;opacity:.6}.view-cwsp__spinner{animation:airpad-spin .8s linear infinite;block-size:32px;border:3px solid color-mix(in sRGB,currentColor 20%,transparent);border-block-start-color:var(--color-primary,var(--primary,#3794ff));border-radius:50%;inline-size:32px}.view-cwsp__error{align-items:center;block-size:100%;display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem;text-align:center}.view-cwsp__error p{margin:0}.view-cwsp__error p:first-child{color:#ff5555;font-size:1.125rem;font-weight:600}.view-cwsp__error button{background-color:var(--color-primary,#3794ff);border:none;border-radius:6px;color:white;cursor:pointer;padding:.5rem 1rem}.view-cwsp__error button:hover{filter:brightness(1.1)}.view-cwsp__error-detail{font-size:.875rem;max-inline-size:400px;opacity:.6}}";
//#endregion
//#region src/frontend/views/airpad/index.ts
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
			onMount: () => this.initAirpad(),
			onUnmount: () => this.cleanup(),
			onShow: () => {
				this._sheet = loadAsAdopted(airpad_default);
				this.lockOrientationForAirpad();
				if (!this.initialized) this.initAirpad();
			},
			onHide: () => {
				setRemoteKeyboardEnabled(false);
				this.unlockOrientationForAirpad();
				removeAdopted(this._sheet);
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
			this._sheet = loadAsAdopted(airpad_default);
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
