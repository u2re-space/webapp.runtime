//#region src/shared/routing/views.ts
var VIEW_ENABLED_VIEWER = "viewer";
var VIEW_ENABLED_EDITOR = "editor";
var VIEW_ENABLED_WORKCENTER = "workcenter";
var VIEW_ENABLED_EXPLORER = "explorer";
var VIEW_ENABLED_AIRPAD = "airpad";
var VIEW_ENABLED_SETTINGS = "settings";
var VIEW_ENABLED_HISTORY = "history";
var VIEW_ENABLED_HOME = "home";
var VIEW_ENABLED_PRINT = "print";
var DEFAULT_VIEW_ID = "viewer";
var VIEW_FLAGS = {
	viewer: VIEW_ENABLED_VIEWER,
	editor: VIEW_ENABLED_EDITOR,
	workcenter: VIEW_ENABLED_WORKCENTER,
	explorer: VIEW_ENABLED_EXPLORER,
	airpad: VIEW_ENABLED_AIRPAD,
	settings: VIEW_ENABLED_SETTINGS,
	history: VIEW_ENABLED_HISTORY,
	home: VIEW_ENABLED_HOME,
	print: VIEW_ENABLED_PRINT
};
var ENABLED_VIEW_IDS = Object.entries(VIEW_FLAGS).filter(([, enabled]) => Boolean(enabled)).map(([viewId]) => viewId);
var isEnabledView = (viewId) => {
	return Boolean(VIEW_FLAGS[viewId]);
};
var pickEnabledView = (preferred = DEFAULT_VIEW_ID, fallback = DEFAULT_VIEW_ID) => {
	if (isEnabledView(preferred)) return preferred;
	if (isEnabledView(fallback)) return fallback;
	if (ENABLED_VIEW_IDS.length > 0) return ENABLED_VIEW_IDS[0];
	return "viewer";
};
//#endregion
export { VIEW_ENABLED_EXPLORER as a, VIEW_ENABLED_PRINT as c, VIEW_ENABLED_WORKCENTER as d, isEnabledView as f, VIEW_ENABLED_EDITOR as i, VIEW_ENABLED_SETTINGS as l, ENABLED_VIEW_IDS as n, VIEW_ENABLED_HISTORY as o, pickEnabledView as p, VIEW_ENABLED_AIRPAD as r, VIEW_ENABLED_HOME as s, DEFAULT_VIEW_ID as t, VIEW_ENABLED_VIEWER as u };
