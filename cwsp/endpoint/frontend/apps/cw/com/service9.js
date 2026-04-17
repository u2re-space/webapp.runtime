//#region src/core/utils/Runtime.ts
/**
* Runtime-safe helpers for mixed environments
* (window, service worker, worker, extension contexts).
*/
var getRuntimeLocation = () => globalThis?.location;
var getRuntimeLocationOrigin = () => getRuntimeLocation()?.origin;
var canParseURL = (value, base) => {
	const source = value?.trim?.() || "";
	if (!source) return false;
	const fallbackBase = base ?? getRuntimeLocationOrigin();
	if (typeof URL?.canParse === "function") return URL.canParse(source, fallbackBase);
	try {
		new URL(source, fallbackBase);
		return true;
	} catch {
		return false;
	}
};
var scheduleFrame = (cb) => {
	if (typeof globalThis?.requestAnimationFrame === "function") {
		globalThis.requestAnimationFrame(cb);
		return;
	}
	globalThis.setTimeout(cb, 0);
};
//#endregion
export { scheduleFrame as n, canParseURL as t };
