//#region ../../modules/projects/subsystem/src/routing/policies/event-handling-policy.ts
/**
* Shared rules for UI event handlers:
* - Do not use stopImmediatePropagation unless one listener must exclude every other on the same target.
* - Prefer stopPropagation only to block bubble to known parents (stacked overlays, toolbars).
* - Avoid document/window capture listeners that call stop* unless strictly scoped to a feature.
* - Use passive: true when preventDefault is never called.
*/
function stopBubbling(ev) {
	ev.stopPropagation();
}
/**
* Wait until after the next two animation frames so layout/style for freshly inserted nodes
* is flushed before querying the DOM and attaching listeners (Airpad, overlays, keyboard).
*/
function waitForDomPaint() {
	const raf = globalThis.requestAnimationFrame?.bind(globalThis);
	if (typeof raf !== "function") return Promise.resolve();
	return new Promise((resolve) => {
		raf(() => {
			raf(() => resolve());
		});
	});
}
//#endregion
//#region src/shared/other/document/DocTools.ts
var coordinate = [0, 0];
var lastElement = [null];
/** Resolve event target to an HTMLElement (e.g. parent of a Text node). */
function eventTargetElement(ev) {
	const t = ev.target;
	if (t instanceof HTMLElement) return t;
	if (t instanceof Node && t.nodeType === Node.TEXT_NODE && t.parentElement) return t.parentElement;
	const path = ev.composedPath?.() ?? [];
	for (const n of path) if (n instanceof HTMLElement) return n;
	return null;
}
/** Update last pointer coordinates when the event carries client geometry (Mouse/Pointer). */
var saveCoordinate = (e) => {
	if (e instanceof PointerEvent || e instanceof MouseEvent) {
		const x = e.clientX;
		const y = e.clientY;
		if (Number.isFinite(x) && Number.isFinite(y)) {
			coordinate[0] = x;
			coordinate[1] = y;
		}
	}
};
if (typeof document !== "undefined") try {
	document.addEventListener("pointerup", saveCoordinate, { passive: true });
	document.addEventListener("pointerdown", saveCoordinate, { passive: true });
	document.addEventListener("click", saveCoordinate, { passive: true });
	document.addEventListener("contextmenu", (e) => {
		saveCoordinate(e);
		lastElement[0] = eventTargetElement(e) ?? lastElement[0];
	}, { passive: true });
} catch {}
//#endregion
export { stopBubbling as n, waitForDomPaint as r, eventTargetElement as t };
