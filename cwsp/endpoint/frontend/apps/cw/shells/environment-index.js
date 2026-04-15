import { v as ENABLED_VIEW_IDS } from "./base.js";
import { r as WindowShell } from "./content-index.js";
//#region src/frontend/shells/environment/index.ts
/**
* Environment shell: canonical desktop/webtop orchestrator.
*
* Inherits the full window process system (processes, PIDs, channels,
* drag-and-drop attach, parameterized view opening) and enables
* desktop chrome (dock bar + status bar) rendered into the shell layer.
*
* Entry URLs like `/{view}?key=val` are normalized to `/#pid` on boot,
* making the environment the primary desktop experience for PWA.
*/
var EnvironmentShell = class extends WindowShell {
	id = "environment";
	name = "Environment";
	layout = {
		hasSidebar: true,
		hasToolbar: true,
		hasTabs: true,
		supportsMultiView: true,
		supportsWindowing: true
	};
	shouldRenderDesktopChrome() {
		return true;
	}
	getPinnedViews() {
		return [
			"viewer",
			"explorer",
			"workcenter",
			"editor",
			"airpad",
			"settings"
		].filter((v) => ENABLED_VIEW_IDS.includes(v));
	}
};
function createShell(_container) {
	return new EnvironmentShell();
}
//#endregion
export { createShell as n, EnvironmentShell as t };
