//#region ../../modules/projects/subsystem/registry.ts
var ViewBase = class extends HTMLElement {
	id = "view";
	name = "View";
	icon = "square";
	options = {};
	lifecycle = {};
	constructor(options) {
		super();
		if (options) this.options = options;
	}
	render(options) {
		if (options) this.options = {
			...this.options,
			...options
		};
		return this;
	}
};
function createViewConstructor(tagName, build) {
	const existing = globalThis.customElements?.get?.(tagName);
	if (existing) return existing;
	const Ctor = build(ViewBase);
	globalThis.customElements?.define?.(tagName, Ctor);
	return Ctor;
}
//#endregion
export { createViewConstructor as t };
