import { t as WindowShell } from "./window.js";
//#region ../../modules/shells/content-shell/src/index.ts
/**
* Content shell: CRX/content-script focused host.
* It keeps window/task behavior but never mounts desktop chrome bars.
*/
var ContentShell = class extends WindowShell {
	constructor(..._args) {
		super(..._args);
		this.layout = {
			hasSidebar: false,
			hasToolbar: false,
			hasTabs: false,
			supportsMultiView: true,
			supportsWindowing: true
		};
		this.id = "content";
		this.name = "Content";
	}
	shouldRenderDesktopChrome() {
		return false;
	}
};
function createShell(_container) {
	return new ContentShell();
}
//#endregion
export { ContentShell, createShell, createShell as default };
