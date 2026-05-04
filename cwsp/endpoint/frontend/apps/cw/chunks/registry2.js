import "../fest/object.js";
import { G as defineElement } from "../com/app.js";
import { l as UIElement, u as __decorate } from "../com/app4.js";
//#region src/frontend/views/registry.ts
/** Registered custom element constructors produced through `createViewConstructor` / `extendViewConstructor`. */
var registeredViewConstructors = /* @__PURE__ */ new Map();
/** Merge additive `ConstructorOptions` (later wins on overlapping shallow keys except lifecycle hooks chain). */
function mergeConstructorOptions(base, extra) {
	const a = base ?? {};
	const b = extra ?? {};
	return {
		...a,
		...b,
		lifecycle: {
			...a.lifecycle,
			...b.lifecycle
		}
	};
}
function extendPrototypeMethod(proto, key, extension) {
	const desc = Object.getOwnPropertyDescriptor(proto, key);
	const old = desc?.value;
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: desc?.enumerable ?? true,
		writable: true,
		value: function(...args) {
			const prev = old?.apply(this, args);
			const next = extension.apply(this, args);
			return next !== void 0 ? next : prev ?? this;
		}
	});
}
function mergeLifecycle(proto, lifecycle) {
	for (const k of [
		"onInitialize",
		"onMount",
		"onUnmount",
		"onShow",
		"onHide"
	]) {
		const fn = lifecycle[k];
		if (typeof fn === "function") extendPrototypeMethod(proto, k, fn);
	}
}
/** Apply declarative patches after the class exists (chains with any existing prototype implementation). */
function applyConstructorOptions(Ctor, opts) {
	const proto = Ctor.prototype;
	if (opts.contextMenu) extendPrototypeMethod(proto, "contextMenu", opts.contextMenu);
	if (opts.initialization) extendPrototypeMethod(proto, "onInitialize", opts.initialization);
	if (opts.rendering) extendPrototypeMethod(proto, "onRender", opts.rendering);
	if (opts.render) extendPrototypeMethod(proto, "render", opts.render);
	if (opts.styles) extendPrototypeMethod(proto, "styles", opts.styles);
	if (opts.lifecycle) mergeLifecycle(proto, opts.lifecycle);
}
var ViewBase = class ViewBase extends UIElement {
	__options;
	__initialized = false;
	/** Per-element broadcast surface for intra-view messaging (slots, decorators, tooling). Separate from CWSP routing. */
	__viewChannel = null;
	set options(value) {
		this.__options = value;
	}
	get options() {
		return this.__options;
	}
	get viewChannel() {
		if (!this.__viewChannel) this.__viewChannel = new EventTarget();
		return this.__viewChannel;
	}
	dispatchViewChannel(type, detail, init) {
		return this.viewChannel.dispatchEvent(new CustomEvent(type, {
			...init,
			detail
		}));
	}
	subscribeViewChannel(type, listener) {
		const bus = this.viewChannel;
		bus.addEventListener(type, listener);
		return () => bus.removeEventListener(type, listener);
	}
	viewInitialize() {
		const opts = this.options;
		opts?.initializator?.call?.(this, this, opts);
		return this;
	}
	constructor() {
		super();
	}
	onInitialize() {
		super.onInitialize?.call?.(this);
		this?.viewInitialize?.call?.(this);
		return this;
	}
};
ViewBase = __decorate([defineElement("cw-view-base")], ViewBase);
var createViewConstructor = (elementName, options, extension) => {
	const patch = typeof options === "function" ? extension ?? {} : mergeConstructorOptions(options, extension ?? {});
	const definitionOpts = patch.extends ? { extends: patch.extends } : void 0;
	let Ctor;
	if (typeof options === "function") Ctor = options(ViewBase);
	else {
		class GeneratedView extends ViewBase {
			constructor() {
				super();
			}
		}
		Ctor = GeneratedView;
	}
	defineElement(elementName, definitionOpts)(Ctor);
	applyConstructorOptions(Ctor, patch);
	registeredViewConstructors.set(elementName, Ctor);
	return Ctor;
};
//#endregion
export { createViewConstructor as t };
