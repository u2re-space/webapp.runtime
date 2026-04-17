var DEFAULT_VIEW_ID = "viewer";
var VIEW_FLAGS = {
	viewer: true,
	editor: true,
	workcenter: true,
	explorer: true,
	airpad: true,
	settings: true,
	history: true,
	home: true,
	print: true
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
export { pickEnabledView as i, ENABLED_VIEW_IDS as n, isEnabledView as r, DEFAULT_VIEW_ID as t };
