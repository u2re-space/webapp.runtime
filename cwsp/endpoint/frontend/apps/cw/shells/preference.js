//#region src/frontend/boot/shell-preference.ts
var LS_BOOT_SHELL_LAST_ACTIVE = "rs-boot-shell-last-active";
function normalizeBootShellId(shell) {
	if (shell === "faint") return "tabbed";
	if (shell === "base" || shell === "minimal" || shell === "window" || shell === "tabbed" || shell === "environment" || shell === "content" || shell === "immersive") return shell;
	return "minimal";
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
export { initBootShellWindowActivity as n, LS_BOOT_SHELL_LAST_ACTIVE as t };
