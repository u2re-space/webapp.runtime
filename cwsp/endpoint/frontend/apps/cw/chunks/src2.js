import { ImmersiveShell, t as base_default } from "./src.js";
//#region ../../modules/shells/content-shell/src/content-overrides.scss?inline
var content_overrides_default = "@layer shell.overrides{:host([data-shell=content]){background:transparent;pointer-events:none}:host([data-shell=content]):has(>.app-shell){--shell-bg:transparent}:host([data-shell=content]) .app-shell,:host([data-shell=content]) .app-shell__content,:host([data-shell=content]) .app-shell__viewport{pointer-events:none}:host([data-shell=content]) ::slotted([data-view]){pointer-events:auto}:host([data-shell=content]) .app-shell__overlays>*{pointer-events:auto}}";
//#endregion
//#region ../../modules/shells/content-shell/src/index.ts
/**
* Content shell: CRX / content-script host.
* Chromeless like ImmersiveShell, but allows multi-view routing like window/content-script UX.
* INVARIANT: `cw-shell-content` and in-shadow chrome use `pointer-events: none`; only slotted views,
* shell overlay children (modals), and document-level toasts/context UI opt into hits.
*/
var ContentShell = class extends ImmersiveShell {
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: true,
		supportsWindowing: true
	};
	id = "content";
	name = "Content";
	getStylesheet() {
		return `${base_default}${content_overrides_default}`;
	}
	renderView(element) {
		super.renderView(element);
		element.style.pointerEvents = "auto";
	}
	async mount(container) {
		await super.mount(container);
		const root = this.rootElement;
		if (root) root.style.pointerEvents = "none";
		const viewport = root?.shadowRoot?.querySelector(".app-shell__viewport");
		if (viewport) viewport.style.pointerEvents = "none";
		if (this.contentContainer) this.contentContainer.style.pointerEvents = "none";
		if (this.overlayContainer) this.overlayContainer.style.pointerEvents = "none";
	}
};
function createShell(_container) {
	return new ContentShell();
}
//#endregion
export { ContentShell, createShell, createShell as default };
