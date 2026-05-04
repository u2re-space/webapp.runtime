import { a as HomeChannelAction } from "./channel-actions.js";
//#region ../../modules/views/home-view/src/index.ts
var HomeView = class {
	constructor(options = {}) {
		this.id = "home";
		this.name = "Home";
		this.icon = "house";
		this.element = null;
		this.lifecycle = { onUnmount: () => {
			this.element = null;
		} };
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext ?? this.shellContext;
		}
		const root = document.createElement("section");
		root.className = "view-home";
		root.dataset.view = "home";
		root.innerHTML = `
            <header class="view-home__header">
                <h1 class="view-home__title">U2RE Space</h1>
                <p class="view-home__subtitle">Pick a workspace view to continue.</p>
            </header>
            <nav class="view-home__nav" aria-label="Quick open">
                <button type="button" class="view-home__btn" data-open="workcenter">Work Center</button>
                <button type="button" class="view-home__btn" data-open="viewer">Viewer</button>
                <button type="button" class="view-home__btn" data-open="explorer">Explorer</button>
                <button type="button" class="view-home__btn" data-open="settings">Settings</button>
            </nav>
        `;
		root.querySelectorAll("[data-open]").forEach((button) => {
			button.addEventListener("click", () => {
				const viewId = button.dataset.open;
				if (viewId) this.shellContext?.navigate?.(viewId);
			});
		});
		this.element = root;
		return root;
	}
	invokeChannelApi(action, payload) {
		if (action !== HomeChannelAction.Navigate && action !== HomeChannelAction.OpenView) return void 0;
		const viewId = typeof payload === "string" ? payload : payload && typeof payload === "object" && "viewId" in payload ? String(payload.viewId) : "";
		if (!viewId.trim()) return false;
		this.shellContext?.navigate?.(viewId.trim());
		return true;
	}
};
function createView(options) {
	return new HomeView(options);
}
var createHomeView = createView;
//#endregion
export { HomeView, createHomeView, createView, createView as default };
