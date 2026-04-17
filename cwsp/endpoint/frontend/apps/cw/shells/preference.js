//#region src/frontend/shells/boot/ts/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
var LAST_ACTIVE_MAX_MS = 720 * 60 * 60 * 1e3;
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content") return shell;
	return "minimal";
}
/**
* Treat narrow and coarse-pointer layouts as “mobile shell” — prefer minimal shell there.
*/
function isMobileBootShellViewport() {
	if (typeof globalThis.matchMedia !== "function") return false;
	try {
		const narrow = globalThis.matchMedia("(max-width: 768px)").matches;
		const coarse = globalThis.matchMedia("(pointer: coarse)").matches;
		const coarseTablet = globalThis.matchMedia("(max-width: 1024px)").matches;
		return narrow || coarse && coarseTablet;
	} catch {
		return false;
	}
}
/** Experimental environment shell is not the default on mobile / small screens. */
function coerceShellForBootViewport(shell) {
	if (!isMobileBootShellViewport()) return shell;
	if (shell === "environment") return "minimal";
	return shell;
}
function readLastActiveBootShell() {
	try {
		const raw = globalThis.localStorage?.getItem(LS_BOOT_SHELL_LAST_ACTIVE);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.t !== "number" || typeof parsed.shell !== "string") return null;
		if (Date.now() - parsed.t > LAST_ACTIVE_MAX_MS) return null;
		return normalizeBootShellId(parsed.shell);
	} catch {
		return null;
	}
}
function recordBootShellWindowActivity(shellId) {
	try {
		const payload = {
			shell: normalizeBootShellId(shellId),
			t: Date.now()
		};
		globalThis.localStorage?.setItem(LS_BOOT_SHELL_LAST_ACTIVE, JSON.stringify(payload));
	} catch {}
}
/**
* Track this tab/window as the last-used shell context (focus + pointer).
* Returns a dispose function for unmount.
*/
function initBootShellWindowActivity(shellId) {
	const shell = normalizeBootShellId(shellId);
	const onWinFocus = () => recordBootShellWindowActivity(shell);
	const onPointer = () => recordBootShellWindowActivity(shell);
	const w = globalThis;
	w.addEventListener("focus", onWinFocus);
	w.addEventListener("pointerdown", onPointer, {
		capture: true,
		passive: true
	});
	queueMicrotask(() => recordBootShellWindowActivity(shell));
	return () => {
		w.removeEventListener("focus", onWinFocus);
		w.removeEventListener("pointerdown", onPointer, { capture: true });
	};
}
//#endregion
export { readLastActiveBootShell as a, normalizeBootShellId as i, coerceShellForBootViewport as n, initBootShellWindowActivity as r, LS_BOOT_SHELL_LAST_ACTIVE as t };
