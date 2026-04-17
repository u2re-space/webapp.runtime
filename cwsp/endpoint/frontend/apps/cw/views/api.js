import { f as normalizeViewId, p as viewBroadcastChannelName } from "../com/service.js";
import "../com/service4.js";
//#region src/frontend/shared/routing/view-api.ts
/**
* View-scoped POST API + BroadcastChannel bridge.
* - Production: service worker intercepts POST /{view} and fans out to clients.
* - Dev (no SW): Vite middleware returns devRelay JSON; this module posts to rs-view-* locally.
*/
function subscribeViewChannel(viewId, handler) {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const bc = new BroadcastChannel(viewBroadcastChannelName(normalizeViewId(viewId)));
	bc.addEventListener("message", handler);
	return () => {
		bc.removeEventListener("message", handler);
		bc.close();
	};
}
/**
* Ask active shell/router to open a view using query-like envelope semantics.
* Window shell listens to this event and can map request to a process frame.
*/
function requestOpenView(request) {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target: request?.target || "window",
		params: request?.params || {},
		pid: request?.pid || null,
		body: request?.body,
		contentType: request?.contentType,
		channel: request?.channel,
		attachments: request?.attachments,
		windowType: request?.windowType,
		newTask: request?.newTask
	} }));
}
//#endregion
export { subscribeViewChannel as n, requestOpenView as t };
