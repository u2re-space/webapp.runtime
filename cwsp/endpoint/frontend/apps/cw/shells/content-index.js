import { WindowShell } from "./window-index.scss?inline.js";
//#region src/frontend/shells/content/index.ts
/**
* Content shell: CRX/content-script focused host.
* It keeps window/task behavior but never mounts desktop chrome bars.
*/
var ContentShell = class extends WindowShell {
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: false,
		supportsMultiView: true,
		supportsWindowing: true
	};
	id = "content";
	name = "Content";
	shouldRenderDesktopChrome() {
		return false;
	}
};
function createShell(_container) {
	return new ContentShell();
}
//#endregion
export { ContentShell, createShell, createShell as default };
