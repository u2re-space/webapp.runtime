import { t as MinimalShell } from "./preview.js";
//#region src/frontend/ai-slop/window/index.ts
/**
* `shells/window` path target: window / tabbed / environment hosts (extends {@link MinimalShell}).
* Each needs a distinct {@link ShellId} so routing, `cw-shell-*` tags, and path-based URL rules stay consistent.
*/
var windowLikeLayout = {
	hasSidebar: false,
	hasToolbar: true,
	hasTabs: false,
	supportsMultiView: true,
	supportsWindowing: true
};
var WindowShell = class extends MinimalShell {
	id = "window";
	name = "Window";
	layout = windowLikeLayout;
};
var EnvironmentShell = class extends WindowShell {
	id = "environment";
	name = "Environment";
};
function createEnvironmentShell(_container) {
	return new EnvironmentShell();
}
//#endregion
export { createEnvironmentShell as n, WindowShell as t };
