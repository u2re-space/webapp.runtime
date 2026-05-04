import { P as H } from "../vendor/jsox.js";
import { t as ShellBase } from "../chunks/shells.js";
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
            <div class="app-shell__content" data-content></div>
        </div>`;
	}
	getStylesheet() {
		return null;
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
