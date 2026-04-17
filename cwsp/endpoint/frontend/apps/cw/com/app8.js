import { F as GLitElement, I as defineElement, L as property, V as H } from "./app3.js";
import { o as ensureStyleSheet } from "../fest/icon.js";
import { t as __decorate } from "../chunks/decorate.js";
//#region shared/fest/fl-ui/ui/base/UIElement.ts
var WINDOW_FRAME_TAG = "cw-window-frame";
var WindowFrameHostElement = class extends HTMLElement {
	titleEl = null;
	pidEl = null;
	dragHandle = null;
	resizeHandle = null;
	_initialized = false;
	connectedCallback() {
		if (this._initialized) return;
		this._initialized = true;
		const root = this.shadowRoot || this.attachShadow({ mode: "open" });
		root.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    overflow: visible;
                    user-select: none;
                    touch-action: none;
                    pointer-events: auto;
                    color-scheme: inherit;
                    --_size-x: calc(var(--initial-inline-size, 640px) + var(--resize-x, 0px));
                    --_size-y: calc(var(--initial-block-size, 480px) + var(--resize-y, 0px));
                    inset-inline-start: clamp(0px, var(--shift-x, 0px), calc(100% - var(--min-inline-size, 640px)));
                    inset-block-start: clamp(0px, var(--shift-y, 0px), calc(100% - var(--min-block-size, 480px)));
                    min-inline-size: var(--min-inline-size, 640px);
                    min-block-size: var(--min-block-size, 480px);
                    inline-size: clamp(var(--min-inline-size, 640px), var(--_size-x), calc(100% - var(--shift-x, 0px)));
                    block-size: clamp(var(--min-block-size, 480px), var(--_size-y), calc(100% - var(--shift-y, 0px)));
                    transform:
                        scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1))
                        translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0px);
                    transition: box-shadow 150ms ease;
                }
                :host(.is-maximized) {
                    inset-inline-start: 0 !important;
                    inset-block-start: 0 !important;
                    inline-size: 100% !important;
                    block-size: 100% !important;
                    transform: none !important;
                    --frame-radius: 0;
                }
                @media (max-width: 900px) {
                    :host(:not(.is-maximized)) {
                        --shift-x: 0 !important;
                        --shift-y: 0 !important;
                        --drag-x: 0 !important;
                        --drag-y: 0 !important;
                        inset-inline-start: 0 !important;
                        inset-block-start: 0 !important;
                        inline-size: 100% !important;
                        block-size: 100% !important;
                        min-inline-size: 0;
                        min-block-size: 0;
                        transform: none !important;
                        --frame-radius: 0;
                    }
                }
                .frame {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 0%;
                    min-block-size: 0;
                    min-inline-size: 0;
                    border: 1px solid light-dark(rgba(0, 0, 0, .1), rgba(120, 140, 180, .18));
                    border-radius: var(--frame-radius, 14px);
                    background: light-dark(rgba(255, 255, 255, .92), rgba(14, 18, 28, .88));
                    color: light-dark(#1a1c2b, #edf2ff);
                    overflow: hidden;
                    box-shadow: light-dark(
                        0 8px 32px rgba(0, 0, 0, .08), 0 0 0 0.5px rgba(0, 0, 0, .06),
                        0 8px 32px rgba(0, 0, 0, .35), 0 0 0 0.5px rgba(255, 255, 255, .06)
                    );
                    backdrop-filter: blur(2px);
                }
                :host(.is-active) .frame {
                    border-color: light-dark(rgba(59, 125, 219, .22), rgba(139, 183, 255, .22));
                    box-shadow: light-dark(
                        0 12px 42px rgba(0, 0, 0, .12), 0 0 0 0.5px rgba(59, 125, 219, .15),
                        0 12px 42px rgba(0, 0, 0, .42), 0 0 0 0.5px rgba(139, 183, 255, .15)
                    );
                }
                :host(.is-maximized) .frame {
                    border-radius: 0;
                    border-color: transparent;
                }
                :host(.is-drop-target) .frame {
                    border-color: light-dark(rgba(59, 125, 219, .35), rgba(139, 183, 255, .35));
                    box-shadow:
                        0 0 0 1px light-dark(rgba(59, 125, 219, .2), rgba(139, 183, 255, .2)),
                        0 12px 42px light-dark(rgba(0, 0, 0, .12), rgba(0, 0, 0, .42));
                }
                .bar {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    gap: .4rem;
                    min-block-size: 36px;
                    padding: .3rem .6rem;
                    background: light-dark(rgba(245, 247, 252, .95), rgba(22, 28, 42, .7));
                    border-block-end: 1px solid light-dark(rgba(0, 0, 0, .06), rgba(255, 255, 255, .04));
                    user-select: none;
                    cursor: default;
                }
                .title {
                    flex: 1 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: .84rem;
                    font-weight: 500;
                    opacity: .88;
                }
                .pid {
                    font-size: .7rem;
                    opacity: .4;
                    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                }
                .btns { display: flex; gap: .15rem; }
                button {
                    border: 0;
                    border-radius: 6px;
                    padding: .22rem .42rem;
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    font-size: .82rem;
                    line-height: 1;
                    opacity: .5;
                    transition: opacity 100ms ease, background 100ms ease;
                }
                button:hover { background: light-dark(rgba(0, 0, 0, .06), rgba(255, 255, 255, .1)); opacity: 1; }
                button[data-window-action="popout"] { font-size: .76rem; }
                button[data-window-action="close"]:hover { background: rgba(220, 60, 60, .45); opacity: 1; }
                .content {
                    position: relative;
                    flex: 1 1 0%;
                    inline-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                ::slotted(*) {
                    flex: 1 1 0%;
                    box-sizing: border-box;
                    inline-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overflow: auto;
                }
                .resize {
                    position: absolute;
                    inline-size: 18px;
                    block-size: 18px;
                    inset: auto 0 0 auto;
                    cursor: nwse-resize;
                    opacity: .3;
                    z-index: 10;
                    background: linear-gradient(
                        135deg,
                        transparent 40%, currentColor 41%, currentColor 49%,
                        transparent 50%, transparent 60%,
                        currentColor 61%, currentColor 69%, transparent 70%
                    );
                    transition: opacity 120ms ease;
                }
                .resize:hover { opacity: .55; }
                :host(.is-maximized) .resize { display: none; }
            </style>
            <div class="frame">
                <div class="bar" data-drag-handle>
                    <span class="title" data-title></span>
                    <span class="pid" data-pid></span>
                    <span class="btns">
                        <button type="button" data-window-action="popout" title="Open in new tab">&#8599;</button>
                        <button type="button" data-window-action="minimize" title="Minimize">&minus;</button>
                        <button type="button" data-window-action="maximize" title="Maximize">&#9633;</button>
                        <button type="button" data-window-action="close" title="Close">&#10005;</button>
                    </span>
                </div>
                <div class="content">
                    <slot name="window-view"></slot>
                </div>
            </div>
            <span class="resize" data-resize-handle></span>
        `;
		this.titleEl = root.querySelector("[data-title]");
		this.pidEl = root.querySelector("[data-pid]");
		this.dragHandle = root.querySelector("[data-drag-handle]");
		this.resizeHandle = root.querySelector("[data-resize-handle]");
		root.querySelectorAll("[data-window-action]").forEach((button) => {
			button.addEventListener("click", (event) => {
				const action = event.currentTarget.dataset.windowAction || "";
				this.dispatchEvent(new CustomEvent("window-action", {
					detail: { action },
					bubbles: true
				}));
			});
		});
		this.setTitle(this.getAttribute("data-title") || this.getAttribute("title") || "Window");
		this.setPidLabel(this.getAttribute("data-pid") || "");
	}
	setTitle(title) {
		if (this.titleEl) this.titleEl.textContent = title;
	}
	setPidLabel(pid) {
		if (this.pidEl) this.pidEl.textContent = pid ? `#${pid}` : "";
	}
	getDragHandle() {
		return this.dragHandle;
	}
	getResizeHandle() {
		return this.resizeHandle;
	}
};
var ensureDefined = (tagName, ctor) => {
	if (typeof customElements === "undefined") return;
	if (!customElements?.get?.(tagName)) customElements?.define?.(tagName, ctor);
};
var ensureWindowFrameElementDefined = () => {
	ensureDefined(WINDOW_FRAME_TAG, WindowFrameHostElement);
	return WINDOW_FRAME_TAG;
};
var BaseElement = class BaseElement extends GLitElement(HTMLElement) {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor(options = {}) {
		super(options);
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], BaseElement.prototype, "theme", void 0);
BaseElement = __decorate([defineElement("cw-base-element")], BaseElement);
var UIElement_default = BaseElement;
ensureWindowFrameElementDefined();
//#endregion
export { UIElement_default as n, BaseElement as t };
