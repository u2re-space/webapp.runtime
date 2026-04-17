import { WindowShell } from "./window-index.scss?inline.js";
//#region src/frontend/shells/tabbed/index.ts
/**
* Tabbed shell: window-style host with tab-oriented identity.
* This keeps runtime behavior aligned with window shell while boot/routing
* can target an explicit "tabbed" anatomy slot.
*/
var TabbedShell = class extends WindowShell {
	id = "tabbed";
	name = "Tabbed";
	layout = {
		hasSidebar: false,
		hasToolbar: false,
		hasTabs: true,
		supportsMultiView: true,
		supportsWindowing: true
	};
};
function createShell(_container) {
	return new TabbedShell();
}
//#endregion
export { TabbedShell, createShell, createShell as default };
