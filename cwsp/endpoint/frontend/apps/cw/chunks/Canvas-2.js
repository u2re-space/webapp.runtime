import "../fest/dom.js";
//#region ../../modules/projects/image.ts/src/canvas/Canvas-2.ts
var WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
var DEFAULT_WALLPAPER_URL = "/assets/wallpaper.jpg";
var initializeAppCanvasLayer = (container) => {
	const root = container;
	root.replaceChildren();
	root.dataset.appLayer = "canvas";
	root.style.position = "absolute";
	root.style.inset = "0";
	root.style.overflow = "hidden";
	root.style.background = "radial-gradient(circle at 18% 12%, #1b2a45 0%, #0f1728 42%, #060910 100%)";
	const glow = document.createElement("div");
	glow.className = "app-canvas__glow";
	glow.style.position = "absolute";
	glow.style.inset = "-20%";
	glow.style.pointerEvents = "none";
	glow.style.opacity = "0.7";
	glow.style.background = "radial-gradient(circle at 15% 20%, rgba(145,185,255,0.45) 0%, transparent 40%), radial-gradient(circle at 75% 72%, rgba(91,134,235,0.35) 0%, transparent 43%)";
	const canvas = document.createElement("canvas", { is: "ui-canvas" });
	canvas.className = "app-canvas__image";
	canvas.style.position = "absolute";
	canvas.style.inset = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.inlineSize = "100%";
	canvas.style.blockSize = "100%";
	canvas.style.maxInlineSize = "100%";
	canvas.style.maxBlockSize = "100%";
	canvas.style.opacity = "0.88";
	canvas.style.mixBlendMode = "normal";
	canvas.setAttribute("is", "ui-canvas");
	root.append(glow, canvas);
	const wallpaper = loadWallpaperUrl();
	canvas.setAttribute("data-src", wallpaper);
	return {
		root,
		canvas,
		glow
	};
};
var setAppWallpaper = (wallpaperUrl) => {
	const value = String(wallpaperUrl || "").trim() || DEFAULT_WALLPAPER_URL;
	try {
		localStorage.setItem(WALLPAPER_STORAGE_KEY, value);
	} catch {}
	document.querySelectorAll("[data-app-layer=\"canvas\"] canvas[is=\"ui-canvas\"]").forEach((canvas) => canvas.setAttribute("data-src", value));
};
var loadWallpaperUrl = () => {
	try {
		const value = localStorage.getItem(WALLPAPER_STORAGE_KEY);
		return value && value.trim() ? value.trim() : DEFAULT_WALLPAPER_URL;
	} catch {
		return DEFAULT_WALLPAPER_URL;
	}
};
//#endregion
export { setAppWallpaper as n, initializeAppCanvasLayer as t };
