//#region src/shared/routing/core/layer-manager.ts
/**
* Unified layer hierarchy - ORDER MATTERS!
*
* Layers are declared in this order to ensure:
* 1. Reset/normalize come first (lowest specificity wins)
* 2. Tokens (CSS custom properties) are available early
* 3. Runtime provides base component styles
* 4. Shell styles can override runtime
* 5. View styles can override shell
* 6. Overrides (theme, print, a11y) win last
*/
var LAYER_HIERARCHY = [
	{
		name: "ux-normalize",
		category: "system",
		order: 0,
		description: "Veela normalize layer"
	},
	{
		name: "layer.reset",
		category: "system",
		order: 0,
		description: "CSS reset rules"
	},
	{
		name: "layer.normalize",
		category: "system",
		order: 10,
		description: "Normalize browser defaults"
	},
	{
		name: "tokens",
		category: "system",
		order: 20,
		description: "Legacy tokens layer"
	},
	{
		name: "ux-tokens",
		category: "system",
		order: 20,
		description: "Veela token layer"
	},
	{
		name: "layer.tokens",
		category: "system",
		order: 20,
		description: "CSS custom properties (variables)"
	},
	{
		name: "base",
		category: "system",
		order: 30,
		description: "Legacy base layer"
	},
	{
		name: "ux-base",
		category: "system",
		order: 30,
		description: "Veela base layer"
	},
	{
		name: "layout",
		category: "system",
		order: 40,
		description: "Legacy layout layer"
	},
	{
		name: "ux-layout",
		category: "system",
		order: 40,
		description: "Veela layout layer"
	},
	{
		name: "components",
		category: "system",
		order: 50,
		description: "Legacy components layer"
	},
	{
		name: "ux-components",
		category: "system",
		order: 50,
		description: "Veela components layer"
	},
	{
		name: "utilities",
		category: "system",
		order: 60,
		description: "Legacy utilities layer"
	},
	{
		name: "ux-utilities",
		category: "system",
		order: 60,
		description: "Veela utilities layer"
	},
	{
		name: "ux-theme",
		category: "system",
		order: 70,
		description: "Veela theme layer"
	},
	{
		name: "ux-overrides",
		category: "system",
		order: 80,
		description: "Veela overrides layer"
	},
	{
		name: "layer.properties.shell",
		category: "system",
		order: 30,
		description: "Shell context custom properties"
	},
	{
		name: "layer.properties.views",
		category: "system",
		order: 35,
		description: "View context custom properties"
	},
	{
		name: "layer.runtime.base",
		category: "runtime",
		order: 100,
		description: "Veela runtime base styles"
	},
	{
		name: "layer.runtime.components",
		category: "runtime",
		order: 110,
		description: "Reusable component styles"
	},
	{
		name: "layer.runtime.forms",
		category: "runtime",
		order: 115,
		description: "Form element base styles"
	},
	{
		name: "layer.runtime.utilities",
		category: "runtime",
		order: 120,
		description: "Utility classes"
	},
	{
		name: "layer.runtime.animations",
		category: "runtime",
		order: 130,
		description: "Keyframes and animation definitions"
	},
	{
		name: "layer.boot",
		category: "runtime",
		order: 140,
		description: "Boot/choice screen styles"
	},
	{
		name: "boot.tokens",
		category: "runtime",
		order: 142,
		description: "Boot tokens layer"
	},
	{
		name: "boot.base",
		category: "runtime",
		order: 144,
		description: "Boot base layer"
	},
	{
		name: "boot.components",
		category: "runtime",
		order: 146,
		description: "Boot components layer"
	},
	{
		name: "boot.responsive",
		category: "runtime",
		order: 148,
		description: "Boot responsive adjustments"
	},
	{
		name: "layer.shell.common",
		category: "shell",
		order: 200,
		description: "Shared shell styles"
	},
	{
		name: "shell.tokens",
		category: "shell",
		order: 202,
		description: "Legacy shell tokens"
	},
	{
		name: "shell.base",
		category: "shell",
		order: 204,
		description: "Legacy shell base"
	},
	{
		name: "shell.components",
		category: "shell",
		order: 206,
		description: "Legacy shell components"
	},
	{
		name: "shell.utilities",
		category: "shell",
		order: 208,
		description: "Legacy shell utilities"
	},
	{
		name: "shell.overrides",
		category: "shell",
		order: 209,
		description: "Legacy shell overrides"
	},
	{
		name: "layer.shell.raw",
		category: "shell",
		order: 210,
		description: "Raw shell (minimal)"
	},
	{
		name: "layer.shell.minimal",
		category: "shell",
		order: 220,
		description: "Minimal shell (toolbar navigation)"
	},
	{
		name: "layer.shell.minimal.layout",
		category: "shell",
		order: 222,
		description: "Minimal shell layout rules"
	},
	{
		name: "layer.shell.minimal.components",
		category: "shell",
		order: 224,
		description: "Minimal shell component styles"
	},
	{
		name: "layer.shell.window",
		category: "shell",
		order: 226,
		description: "Window shell (desktop/process frames)"
	},
	{
		name: "layer.shell.faint",
		category: "shell",
		order: 230,
		description: "Faint shell (tabbed sidebar)"
	},
	{
		name: "layer.shell.faint.layout",
		category: "shell",
		order: 232,
		description: "Faint shell layout"
	},
	{
		name: "layer.shell.faint.sidebar",
		category: "shell",
		order: 234,
		description: "Faint shell sidebar"
	},
	{
		name: "layer.shell.faint.toolbar",
		category: "shell",
		order: 236,
		description: "Faint shell toolbar"
	},
	{
		name: "layer.shell.faint.forms",
		category: "shell",
		order: 238,
		description: "Faint shell form components"
	},
	{
		name: "layer.view.common",
		category: "view",
		order: 300,
		description: "Shared view styles"
	},
	{
		name: "layer.view.viewer",
		category: "view",
		order: 310,
		description: "Markdown viewer"
	},
	{
		name: "layer.view.workcenter",
		category: "view",
		order: 320,
		description: "Work center (AI prompts)"
	},
	{
		name: "layer.view.workcenter.keyframes",
		category: "view",
		order: 322,
		description: "Work center animations"
	},
	{
		name: "view.workcenter",
		category: "view",
		order: 324,
		description: "Work center styles (legacy name)"
	},
	{
		name: "view.workcenter.animations",
		category: "view",
		order: 326,
		description: "Work center animations (legacy name)"
	},
	{
		name: "layer.view.settings",
		category: "view",
		order: 330,
		description: "Settings view"
	},
	{
		name: "layer.view.explorer",
		category: "view",
		order: 340,
		description: "File explorer"
	},
	{
		name: "layer.view.history",
		category: "view",
		order: 350,
		description: "History view"
	},
	{
		name: "layer.view.editor",
		category: "view",
		order: 360,
		description: "Editor view"
	},
	{
		name: "layer.view.editor.markdown",
		category: "view",
		order: 362,
		description: "Markdown editor sublayer"
	},
	{
		name: "layer.view.editor.quill",
		category: "view",
		order: 364,
		description: "Quill editor sublayer"
	},
	{
		name: "layer.view.home",
		category: "view",
		order: 380,
		description: "Home/landing view"
	},
	{
		name: "layer.view.print",
		category: "view",
		order: 390,
		description: "Print view"
	},
	{
		name: "view-explorer",
		category: "view",
		order: 392,
		description: "Explorer legacy layered scope"
	},
	{
		name: "view-transitions",
		category: "override",
		order: 850,
		description: "View Transition API named targets and keyframes"
	},
	{
		name: "layer.override.theme",
		category: "override",
		order: 900,
		description: "Theme customizations"
	},
	{
		name: "layer.override.print",
		category: "override",
		order: 910,
		description: "Print media styles"
	},
	{
		name: "layer.override.a11y",
		category: "override",
		order: 920,
		description: "Accessibility enhancements"
	}
];
var _initialized = false;
/**
* Initialize CSS layer order
*
* MUST be called before any other styles are loaded to ensure
* the cascade layer order is established correctly.
*
* This function is idempotent - calling it multiple times is safe.
*
* @example
* ```ts
* // In application entry point
* import { initializeLayers } from './shared/layer-manager';
*
* async function main() {
*     // Initialize layers FIRST
*     initializeLayers();
*
*     // Then load styles
*     await loadStyleSystem('vl-advanced');
*     // ...
* }
* ```
*/
function initializeLayers() {
	if (_initialized) {
		console.debug("[LayerManager] Already initialized");
		return;
	}
	if (typeof document === "undefined") {
		console.warn("[LayerManager] No document available (SSR context?)");
		return;
	}
	const layerNames = [...LAYER_HIERARCHY].sort((a, b) => a.order - b.order).map((l) => l.name);
	const layerRule = `@layer ${layerNames.join(", ")};`;
	const style = document.createElement("style");
	style.id = "css-layer-init";
	style.setAttribute("data-layer-manager", "true");
	style.textContent = layerRule;
	const head = document.head;
	head.insertBefore(style, head.firstChild);
	_initialized = true;
	console.log(`[LayerManager] Initialized ${layerNames.length} layers`);
}
//#endregion
export { initializeLayers as t };
