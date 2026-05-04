import "../chunks/registry.js";
import { q as H } from "../com/app.js";
import { i as ensureSpeedDialMeta, l as wallpaperState, r as createEmptySpeedDialItem, s as persistWallpaper, t as addSpeedDialItem } from "../chunks/StateStorage.js";
import { a as HomeChannelAction } from "./apis.js";
//#region src/shared/routing/workspace-files-api.ts
/**
* Cross-cutting file/workspace helpers for channels: attachment (viewer/workcenter),
* “use” surfaces (speed-dial, wallpaper, explorer toolbar), and explorer save (FL-UI OPFS).
*/
/** Merge wallpaper reactive state + persist (SpeedDial/home shell reads `wallpaperState`). */
function workspaceApplyWallpaper(patch) {
	Object.assign(wallpaperState, patch);
	persistWallpaper();
}
/** Use an object URL as wallpaper background (caller may revoke URL later if replacing often). */
function workspaceApplyWallpaperFromFile(file) {
	workspaceApplyWallpaper({ src: URL.createObjectURL(file) });
}
/** Pin an arbitrary href on the speed-dial grid (open-link). */
function workspacePinHrefToSpeedDial(input) {
	const item = createEmptySpeedDialItem();
	const labelRef = item.label;
	const iconRef = item.icon;
	if (labelRef && typeof labelRef === "object") labelRef.value = input.label;
	if (iconRef && typeof iconRef === "object" && input.icon) iconRef.value = input.icon;
	item.action = input.action || "open-link";
	const meta = ensureSpeedDialMeta(item.id, {
		action: item.action,
		href: input.href,
		description: input.label
	});
	meta.href = input.href;
	addSpeedDialItem(item);
	return item;
}
/** Pin a local file tile (blob URL) for quick open from home/speed-dial. */
function workspacePinFileToSpeedDial(file, label) {
	return workspacePinHrefToSpeedDial({
		href: URL.createObjectURL(file),
		label: label || file.name || "File",
		icon: "file",
		action: "open-link"
	});
}
//#endregion
//#region src/frontend/views/home/index.ts
/**
* Home view — lightweight landing / shortcuts shell when `home` is the default view.
*/
var HomeView = class {
	id = "home";
	name = "Home";
	icon = "house";
	options;
	shellContext;
	element = null;
	lifecycle = {
		onMount: () => void 0,
		onUnmount: () => void 0,
		onShow: () => void 0,
		onHide: () => void 0
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		const navigate = (viewId) => this.shellContext?.navigate(viewId);
		this.element = H`
            <div class="view-home" data-view="home">
                <header class="view-home__header">
                    <h1 class="view-home__title">CrossWord</h1>
                    <p class="view-home__subtitle">Pick a workspace to continue.</p>
                </header>
                <nav class="view-home__nav" aria-label="Quick open">
                    <button type="button" class="view-home__btn" data-open="workcenter">Work Center</button>
                    <button type="button" class="view-home__btn" data-open="viewer">Viewer</button>
                    <button type="button" class="view-home__btn" data-open="explorer">Explorer</button>
                    <button type="button" class="view-home__btn" data-open="settings">Settings</button>
                </nav>
            </div>
        `;
		this.element.querySelectorAll("[data-open]").forEach((btn) => {
			btn.addEventListener("click", () => {
				const id = btn.dataset.open;
				if (id) navigate(id);
			});
		});
		return this.element;
	}
	canHandleMessage() {
		return false;
	}
	async handleMessage() {}
	invokeChannelApi(action, payload) {
		if (action === HomeChannelAction.Navigate || action === HomeChannelAction.OpenView) {
			const trimmed = (typeof payload === "string" ? payload : payload && typeof payload === "object" && payload !== null && "viewId" in payload ? String(payload.viewId) : "").trim();
			if (trimmed) this.shellContext?.navigate(trimmed);
			return Boolean(trimmed);
		}
		if (action === HomeChannelAction.WallpaperSet) {
			const p = payload && typeof payload === "object" ? payload : {};
			workspaceApplyWallpaper({
				src: typeof p.src === "string" ? p.src : void 0,
				opacity: typeof p.opacity === "number" ? p.opacity : void 0,
				blur: typeof p.blur === "number" ? p.blur : void 0
			});
			return true;
		}
		if (action === HomeChannelAction.WallpaperFromFile && payload instanceof File) {
			workspaceApplyWallpaperFromFile(payload);
			return true;
		}
		if (action === HomeChannelAction.SpeedDialPinHref) {
			const p = payload && typeof payload === "object" ? payload : {};
			const href = typeof p.href === "string" ? p.href : "";
			const label = typeof p.label === "string" ? p.label : href;
			if (!href.trim()) return false;
			workspacePinHrefToSpeedDial({
				href,
				label,
				icon: typeof p.icon === "string" ? p.icon : void 0,
				action: typeof p.action === "string" ? p.action : void 0
			});
			return true;
		}
		if (action === HomeChannelAction.SpeedDialPinFile && payload instanceof File) {
			workspacePinFileToSpeedDial(payload);
			return true;
		}
	}
};
function createView(options) {
	return new HomeView(options);
}
var createHomeView = createView;
//#endregion
export { HomeView, createHomeView, createView, createView as default };
