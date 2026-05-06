import { P as H } from "../vendor/jsox.js";
import { t as ShellBase } from "../chunks/shells.js";
//#region src/frontend/shells/base/base-shell.scss?inline
var base_shell_default = "@layer shell.base{:host{block-size:100%;box-sizing:border-box;display:block;inline-size:100%;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0}.app-shell--base{box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inset:0;min-block-size:0;min-inline-size:0;overflow:hidden;position:absolute}.app-shell__content{block-size:stretch;flex-direction:column;inline-size:stretch;position:relative}.app-shell__content,.app-shell__content>[data-view]{box-sizing:border-box;display:flex;min-block-size:0;min-inline-size:0;overflow:hidden}.app-shell__content>[data-view]{flex:1 1 auto;flex-direction:column}.app-shell__content>[data-view=settings]{overflow:hidden}}";
//#endregion
//#region src/frontend/shells/base/index.ts
/**
* Base shell: single content region, no toolbar/sidebar/tabs (raw frame).
*/
var BaseShell = class extends ShellBase {
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
		return H`<div class="app-shell app-shell--base" data-shell="base">
            <div class="app-shell__content" data-shell-content></div>
        </div>`;
	}
	getStylesheet() {
		return base_shell_default;
	}
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-shell--base");
		if (inner) inner.dataset.theme = this.resolveShellColorScheme(theme);
		super.applyTheme(theme);
	}
};
function createShell(_container) {
	return new BaseShell();
}
//#endregion
export { BaseShell, createShell, createShell as default };
