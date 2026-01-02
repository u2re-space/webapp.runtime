import { fixFx, unwrap, isPrimitive, tryParseByHint } from './Settings.js';

const resolvedMap = /* @__PURE__ */ new WeakMap(), handledMap = /* @__PURE__ */ new WeakMap();
const actWith = (promiseOrPlain, cb) => {
  if (promiseOrPlain instanceof Promise || typeof promiseOrPlain?.then == "function") {
    if (resolvedMap?.has?.(promiseOrPlain)) {
      return cb(resolvedMap?.get?.(promiseOrPlain));
    }
    return Promise.try?.(async () => {
      const item = await promiseOrPlain;
      resolvedMap?.set?.(promiseOrPlain, item);
      return item;
    })?.then?.(cb);
  }
  return cb(promiseOrPlain);
};
class PromiseHandler {
  #resolve;
  #reject;
  //
  constructor(resolve, reject) {
    this.#resolve = resolve;
    this.#reject = reject;
  }
  //
  defineProperty(target, prop, descriptor) {
    if (unwrap(target) instanceof Promise) return Reflect.defineProperty(target, prop, descriptor);
    return actWith(unwrap(target), (obj) => Reflect.defineProperty(obj, prop, descriptor));
  }
  //
  deleteProperty(target, prop) {
    if (unwrap(target) instanceof Promise) return Reflect.deleteProperty(target, prop);
    return actWith(unwrap(target), (obj) => Reflect.deleteProperty(obj, prop));
  }
  //
  getPrototypeOf(target) {
    if (unwrap(target) instanceof Promise) return Reflect.getPrototypeOf(target);
    return actWith(unwrap(target), (obj) => Reflect.getPrototypeOf(obj));
  }
  //
  setPrototypeOf(target, proto) {
    if (unwrap(target) instanceof Promise) return Reflect.setPrototypeOf(target, proto);
    return actWith(unwrap(target), (obj) => Reflect.setPrototypeOf(obj, proto));
  }
  //
  isExtensible(target) {
    if (unwrap(target) instanceof Promise) return Reflect.isExtensible(target);
    return actWith(unwrap(target), (obj) => Reflect.isExtensible(obj));
  }
  //
  preventExtensions(target) {
    if (unwrap(target) instanceof Promise) return Reflect.ownKeys(target);
    return actWith(unwrap(target), (obj) => Reflect.preventExtensions(obj));
  }
  //
  ownKeys(target) {
    const uwp = unwrap(target);
    if (uwp instanceof Promise) return Object.keys(uwp);
    const keys = actWith(uwp, (obj) => {
      return (typeof obj == "object" || typeof obj == "function") && obj != null ? Object.keys(obj) : [];
    });
    return keys ?? [];
  }
  //
  getOwnPropertyDescriptor(target, prop) {
    if (unwrap(target) instanceof Promise) return Reflect.getOwnPropertyDescriptor(target, prop);
    return actWith(unwrap(target), (obj) => Reflect.getOwnPropertyDescriptor(obj, prop));
  }
  //
  construct(target, args, newTarget) {
    return actWith(unwrap(target), (ct) => Reflect.construct(ct, args, newTarget));
  }
  //
  has(target, prop) {
    if (unwrap(target) instanceof Promise) return Reflect.has(target, prop);
    return actWith(unwrap(target), (obj) => Reflect.has(obj, prop));
  }
  //
  get(target, prop, receiver) {
    target = unwrap(target);
    if (prop == "promise") {
      return target;
    }
    if (prop == "resolve" && this.#resolve) {
      return (...args) => {
        const result2 = this.#resolve?.(...args);
        this.#resolve = null;
        return result2;
      };
    }
    if (prop == "reject" && this.#reject) {
      return (...args) => {
        const result2 = this.#reject?.(...args);
        this.#reject = null;
        return result2;
      };
    }
    if (prop == "then" || prop == "catch" || prop == "finally") {
      if (target instanceof Promise) {
        return target?.[prop]?.bind?.(target);
      } else {
        const $tmp = Promise.try(() => target);
        return $tmp?.[prop]?.bind?.($tmp);
      }
    }
    const result = Promised(actWith(target, async (obj) => {
      if (unwrap(obj) instanceof Promise) return Reflect.get(obj, prop, receiver);
      if (isPrimitive(obj)) {
        return prop == Symbol.toPrimitive || prop == Symbol.toStringTag ? obj : void 0;
      }
      let value = void 0;
      try {
        value = Reflect.get(obj, prop, receiver);
      } catch (e) {
        value = target?.[prop];
      }
      if (typeof value == "function") {
        return value?.bind?.(obj);
      }
      return value;
    }));
    if (prop == Symbol.toStringTag) {
      if (isPrimitive(result)) {
        return String(result ?? "") || "";
      }
      return result?.[Symbol.toStringTag]?.() || String(result ?? "") || "";
    }
    if (prop == Symbol.toPrimitive) {
      return (hint) => {
        if (isPrimitive(result)) {
          return tryParseByHint(result, hint);
        }
        return null;
      };
    }
    return result;
  }
  //
  set(target, prop, value) {
    return actWith(unwrap(target), (obj) => Reflect.set(obj, prop, value));
  }
  //
  apply(target, thisArg, args) {
    if (this.#resolve) {
      const result = this.#resolve?.(...args);
      this.#resolve = null;
      return result;
    }
    return actWith(unwrap(target, this.#resolve), (obj) => {
      if (typeof obj == "function") {
        if (unwrap(obj) instanceof Promise) return Reflect.apply(obj, thisArg, args);
        return Reflect.apply(obj, thisArg, args);
      }
    });
  }
}
function Promised(promise, resolve, reject) {
  if (!(promise instanceof Promise || typeof promise?.then == "function")) {
    return promise;
  }
  if (resolvedMap?.has?.(promise)) {
    return resolvedMap?.get?.(promise);
  }
  if (!handledMap?.has?.(promise)) {
    promise?.then?.((item) => resolvedMap?.set?.(promise, item));
  }
  return handledMap?.getOrInsertComputed?.(promise, () => new Proxy(fixFx(promise), new PromiseHandler(resolve, reject)));
}

export { Promised };
//# sourceMappingURL=Promised.js.map
