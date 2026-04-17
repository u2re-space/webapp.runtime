import { a as __toESM, i as __toCommonJS, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../chunks/rolldown-runtime.js";
import { V as H } from "../com/app3.js";
import "../fest/icon.js";
//#region ../../node_modules/lodash-es/_freeGlobal.js
var freeGlobal;
var init__freeGlobal = __esmMin((() => {
	freeGlobal = typeof global == "object" && global && global.Object === Object && global;
}));
//#endregion
//#region ../../node_modules/lodash-es/_root.js
var freeSelf, root;
var init__root = __esmMin((() => {
	init__freeGlobal();
	freeSelf = typeof self == "object" && self && self.Object === Object && self;
	root = freeGlobal || freeSelf || Function("return this")();
}));
//#endregion
//#region ../../node_modules/lodash-es/_Symbol.js
var Symbol;
var init__Symbol = __esmMin((() => {
	init__root();
	Symbol = root.Symbol;
}));
//#endregion
//#region ../../node_modules/lodash-es/_getRawTag.js
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value) {
	var isOwn = hasOwnProperty$25.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = void 0;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$3.call(value);
	if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
	else delete value[symToStringTag$1];
	return result;
}
var objectProto$7, hasOwnProperty$25, nativeObjectToString$3, symToStringTag$1;
var init__getRawTag = __esmMin((() => {
	init__Symbol();
	objectProto$7 = Object.prototype;
	hasOwnProperty$25 = objectProto$7.hasOwnProperty;
	nativeObjectToString$3 = objectProto$7.toString;
	symToStringTag$1 = Symbol ? Symbol.toStringTag : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_objectToString.js
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
	return nativeObjectToString$2.call(value);
}
var nativeObjectToString$2;
var init__objectToString = __esmMin((() => {
	nativeObjectToString$2 = Object.prototype.toString;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseGetTag.js
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value) {
	if (value == null) return value === void 0 ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var nullTag, undefinedTag, symToStringTag;
var init__baseGetTag = __esmMin((() => {
	init__Symbol();
	init__getRawTag();
	init__objectToString();
	nullTag = "[object Null]", undefinedTag = "[object Undefined]";
	symToStringTag = Symbol ? Symbol.toStringTag : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/isObjectLike.js
/**
* Checks if `value` is object-like. A value is object-like if it's not `null`
* and has a `typeof` result of "object".
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
* @example
*
* _.isObjectLike({});
* // => true
*
* _.isObjectLike([1, 2, 3]);
* // => true
*
* _.isObjectLike(_.noop);
* // => false
*
* _.isObjectLike(null);
* // => false
*/
function isObjectLike(value) {
	return value != null && typeof value == "object";
}
var init_isObjectLike = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isSymbol.js
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
}
var symbolTag$3;
var init_isSymbol = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	symbolTag$3 = "[object Symbol]";
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseToNumber.js
/**
* The base implementation of `_.toNumber` which doesn't ensure correct
* conversions of binary, hexadecimal, or octal string values.
*
* @private
* @param {*} value The value to process.
* @returns {number} Returns the number.
*/
function baseToNumber(value) {
	if (typeof value == "number") return value;
	if (isSymbol(value)) return NAN$2;
	return +value;
}
var NAN$2;
var init__baseToNumber = __esmMin((() => {
	init_isSymbol();
	NAN$2 = NaN;
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayMap.js
/**
* A specialized version of `_.map` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function arrayMap(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length, result = Array(length);
	while (++index < length) result[index] = iteratee(array[index], index, array);
	return result;
}
var init__arrayMap = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isArray.js
var isArray;
var init_isArray = __esmMin((() => {
	isArray = Array.isArray;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseToString.js
/**
* The base implementation of `_.toString` which doesn't convert nullish
* values to empty strings.
*
* @private
* @param {*} value The value to process.
* @returns {string} Returns the string.
*/
function baseToString(value) {
	if (typeof value == "string") return value;
	if (isArray(value)) return arrayMap(value, baseToString) + "";
	if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$4 ? "-0" : result;
}
var INFINITY$4, symbolProto$2, symbolToString;
var init__baseToString = __esmMin((() => {
	init__Symbol();
	init__arrayMap();
	init_isArray();
	init_isSymbol();
	INFINITY$4 = Infinity;
	symbolProto$2 = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_createMathOperation.js
/**
* Creates a function that performs a mathematical operation on two values.
*
* @private
* @param {Function} operator The function to perform the operation.
* @param {number} [defaultValue] The value used for `undefined` arguments.
* @returns {Function} Returns the new mathematical operation function.
*/
function createMathOperation(operator, defaultValue) {
	return function(value, other) {
		var result;
		if (value === void 0 && other === void 0) return defaultValue;
		if (value !== void 0) result = value;
		if (other !== void 0) {
			if (result === void 0) return other;
			if (typeof value == "string" || typeof other == "string") {
				value = baseToString(value);
				other = baseToString(other);
			} else {
				value = baseToNumber(value);
				other = baseToNumber(other);
			}
			result = operator(value, other);
		}
		return result;
	};
}
var init__createMathOperation = __esmMin((() => {
	init__baseToNumber();
	init__baseToString();
}));
//#endregion
//#region ../../node_modules/lodash-es/add.js
var add;
var init_add = __esmMin((() => {
	init__createMathOperation();
	add = createMathOperation(function(augend, addend) {
		return augend + addend;
	}, 0);
}));
//#endregion
//#region ../../node_modules/lodash-es/_trimmedEndIndex.js
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
* character of `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the index of the last non-whitespace character.
*/
function trimmedEndIndex(string) {
	var index = string.length;
	while (index-- && reWhitespace.test(string.charAt(index)));
	return index;
}
var reWhitespace;
var init__trimmedEndIndex = __esmMin((() => {
	reWhitespace = /\s/;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseTrim.js
/**
* The base implementation of `_.trim`.
*
* @private
* @param {string} string The string to trim.
* @returns {string} Returns the trimmed string.
*/
function baseTrim(string) {
	return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart$2, "") : string;
}
var reTrimStart$2;
var init__baseTrim = __esmMin((() => {
	init__trimmedEndIndex();
	reTrimStart$2 = /^\s+/;
}));
//#endregion
//#region ../../node_modules/lodash-es/isObject.js
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
var init_isObject = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/toNumber.js
/**
* Converts `value` to a number.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to process.
* @returns {number} Returns the number.
* @example
*
* _.toNumber(3.2);
* // => 3.2
*
* _.toNumber(Number.MIN_VALUE);
* // => 5e-324
*
* _.toNumber(Infinity);
* // => Infinity
*
* _.toNumber('3.2');
* // => 3.2
*/
function toNumber(value) {
	if (typeof value == "number") return value;
	if (isSymbol(value)) return NAN$1;
	if (isObject(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject(other) ? other + "" : other;
	}
	if (typeof value != "string") return value === 0 ? value : +value;
	value = baseTrim(value);
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN$1 : +value;
}
var NAN$1, reIsBadHex, reIsBinary, reIsOctal, freeParseInt;
var init_toNumber = __esmMin((() => {
	init__baseTrim();
	init_isObject();
	init_isSymbol();
	NAN$1 = NaN;
	reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	reIsBinary = /^0b[01]+$/i;
	reIsOctal = /^0o[0-7]+$/i;
	freeParseInt = parseInt;
}));
//#endregion
//#region ../../node_modules/lodash-es/toFinite.js
/**
* Converts `value` to a finite number.
*
* @static
* @memberOf _
* @since 4.12.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted number.
* @example
*
* _.toFinite(3.2);
* // => 3.2
*
* _.toFinite(Number.MIN_VALUE);
* // => 5e-324
*
* _.toFinite(Infinity);
* // => 1.7976931348623157e+308
*
* _.toFinite('3.2');
* // => 3.2
*/
function toFinite(value) {
	if (!value) return value === 0 ? value : 0;
	value = toNumber(value);
	if (value === INFINITY$3 || value === -INFINITY$3) return (value < 0 ? -1 : 1) * MAX_INTEGER;
	return value === value ? value : 0;
}
var INFINITY$3, MAX_INTEGER;
var init_toFinite = __esmMin((() => {
	init_toNumber();
	INFINITY$3 = Infinity, MAX_INTEGER = 17976931348623157e292;
}));
//#endregion
//#region ../../node_modules/lodash-es/toInteger.js
/**
* Converts `value` to an integer.
*
* **Note:** This method is loosely based on
* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted integer.
* @example
*
* _.toInteger(3.2);
* // => 3
*
* _.toInteger(Number.MIN_VALUE);
* // => 0
*
* _.toInteger(Infinity);
* // => 1.7976931348623157e+308
*
* _.toInteger('3.2');
* // => 3
*/
function toInteger(value) {
	var result = toFinite(value), remainder = result % 1;
	return result === result ? remainder ? result - remainder : result : 0;
}
var init_toInteger = __esmMin((() => {
	init_toFinite();
}));
//#endregion
//#region ../../node_modules/lodash-es/after.js
/**
* The opposite of `_.before`; this method creates a function that invokes
* `func` once it's called `n` or more times.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {number} n The number of calls before `func` is invoked.
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new restricted function.
* @example
*
* var saves = ['profile', 'settings'];
*
* var done = _.after(saves.length, function() {
*   console.log('done saving!');
* });
*
* _.forEach(saves, function(type) {
*   asyncSave({ 'type': type, 'complete': done });
* });
* // => Logs 'done saving!' after the two async saves have completed.
*/
function after(n, func) {
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$11);
	n = toInteger(n);
	return function() {
		if (--n < 1) return func.apply(this, arguments);
	};
}
var FUNC_ERROR_TEXT$11;
var init_after = __esmMin((() => {
	init_toInteger();
	FUNC_ERROR_TEXT$11 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/identity.js
/**
* This method returns the first argument it receives.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {*} value Any value.
* @returns {*} Returns `value`.
* @example
*
* var object = { 'a': 1 };
*
* console.log(_.identity(object) === object);
* // => true
*/
function identity(value) {
	return value;
}
var init_identity = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isFunction.js
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction(value) {
	if (!isObject(value)) return false;
	var tag = baseGetTag(value);
	return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var asyncTag, funcTag$2, genTag$1, proxyTag;
var init_isFunction = __esmMin((() => {
	init__baseGetTag();
	init_isObject();
	asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
}));
//#endregion
//#region ../../node_modules/lodash-es/_coreJsData.js
var coreJsData;
var init__coreJsData = __esmMin((() => {
	init__root();
	coreJsData = root["__core-js_shared__"];
}));
//#endregion
//#region ../../node_modules/lodash-es/_isMasked.js
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
var maskSrcKey;
var init__isMasked = __esmMin((() => {
	init__coreJsData();
	maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
}));
//#endregion
//#region ../../node_modules/lodash-es/_toSource.js
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$2.call(func);
		} catch (e) {}
		try {
			return func + "";
		} catch (e) {}
	}
	return "";
}
var funcToString$2;
var init__toSource = __esmMin((() => {
	funcToString$2 = Function.prototype.toString;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsNative.js
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value) {
	if (!isObject(value) || isMasked(value)) return false;
	return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
}
var reRegExpChar$1, reIsHostCtor, funcProto$1, objectProto$6, funcToString$1, hasOwnProperty$24, reIsNative;
var init__baseIsNative = __esmMin((() => {
	init_isFunction();
	init__isMasked();
	init_isObject();
	init__toSource();
	reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
	reIsHostCtor = /^\[object .+?Constructor\]$/;
	funcProto$1 = Function.prototype, objectProto$6 = Object.prototype;
	funcToString$1 = funcProto$1.toString;
	hasOwnProperty$24 = objectProto$6.hasOwnProperty;
	reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$24).replace(reRegExpChar$1, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
}));
//#endregion
//#region ../../node_modules/lodash-es/_getValue.js
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? void 0 : object[key];
}
var init__getValue = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_getNative.js
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : void 0;
}
var init__getNative = __esmMin((() => {
	init__baseIsNative();
	init__getValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/_WeakMap.js
var WeakMap$1;
var init__WeakMap = __esmMin((() => {
	init__getNative();
	init__root();
	WeakMap$1 = getNative(root, "WeakMap");
}));
//#endregion
//#region ../../node_modules/lodash-es/_metaMap.js
var metaMap;
var init__metaMap = __esmMin((() => {
	init__WeakMap();
	metaMap = WeakMap$1 && new WeakMap$1();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSetData.js
var baseSetData;
var init__baseSetData = __esmMin((() => {
	init_identity();
	init__metaMap();
	baseSetData = !metaMap ? identity : function(func, data) {
		metaMap.set(func, data);
		return func;
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseCreate.js
var objectCreate, baseCreate;
var init__baseCreate = __esmMin((() => {
	init_isObject();
	objectCreate = Object.create;
	baseCreate = function() {
		function object() {}
		return function(proto) {
			if (!isObject(proto)) return {};
			if (objectCreate) return objectCreate(proto);
			object.prototype = proto;
			var result = new object();
			object.prototype = void 0;
			return result;
		};
	}();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createCtor.js
/**
* Creates a function that produces an instance of `Ctor` regardless of
* whether it was invoked as part of a `new` expression or by `call` or `apply`.
*
* @private
* @param {Function} Ctor The constructor to wrap.
* @returns {Function} Returns the new wrapped function.
*/
function createCtor(Ctor) {
	return function() {
		var args = arguments;
		switch (args.length) {
			case 0: return new Ctor();
			case 1: return new Ctor(args[0]);
			case 2: return new Ctor(args[0], args[1]);
			case 3: return new Ctor(args[0], args[1], args[2]);
			case 4: return new Ctor(args[0], args[1], args[2], args[3]);
			case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
			case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
			case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
		}
		var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
		return isObject(result) ? result : thisBinding;
	};
}
var init__createCtor = __esmMin((() => {
	init__baseCreate();
	init_isObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createBind.js
/**
* Creates a function that wraps `func` to invoke it with the optional `this`
* binding of `thisArg`.
*
* @private
* @param {Function} func The function to wrap.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @param {*} [thisArg] The `this` binding of `func`.
* @returns {Function} Returns the new wrapped function.
*/
function createBind(func, bitmask, thisArg) {
	var isBind = bitmask & WRAP_BIND_FLAG$7, Ctor = createCtor(func);
	function wrapper() {
		return (this && this !== root && this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, arguments);
	}
	return wrapper;
}
var WRAP_BIND_FLAG$7;
var init__createBind = __esmMin((() => {
	init__createCtor();
	init__root();
	WRAP_BIND_FLAG$7 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/_apply.js
/**
* A faster alternative to `Function#apply`, this function invokes `func`
* with the `this` binding of `thisArg` and the arguments of `args`.
*
* @private
* @param {Function} func The function to invoke.
* @param {*} thisArg The `this` binding of `func`.
* @param {Array} args The arguments to invoke `func` with.
* @returns {*} Returns the result of `func`.
*/
function apply(func, thisArg, args) {
	switch (args.length) {
		case 0: return func.call(thisArg);
		case 1: return func.call(thisArg, args[0]);
		case 2: return func.call(thisArg, args[0], args[1]);
		case 3: return func.call(thisArg, args[0], args[1], args[2]);
	}
	return func.apply(thisArg, args);
}
var init__apply = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_composeArgs.js
/**
* Creates an array that is the composition of partially applied arguments,
* placeholders, and provided arguments into a single array of arguments.
*
* @private
* @param {Array} args The provided arguments.
* @param {Array} partials The arguments to prepend to those provided.
* @param {Array} holders The `partials` placeholder indexes.
* @params {boolean} [isCurried] Specify composing for a curried function.
* @returns {Array} Returns the new array of composed arguments.
*/
function composeArgs(args, partials, holders, isCurried) {
	var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax$16(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
	while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
	while (++argsIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[holders[argsIndex]] = args[argsIndex];
	while (rangeLength--) result[leftIndex++] = args[argsIndex++];
	return result;
}
var nativeMax$16;
var init__composeArgs = __esmMin((() => {
	nativeMax$16 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/_composeArgsRight.js
/**
* This function is like `composeArgs` except that the arguments composition
* is tailored for `_.partialRight`.
*
* @private
* @param {Array} args The provided arguments.
* @param {Array} partials The arguments to append to those provided.
* @param {Array} holders The `partials` placeholder indexes.
* @params {boolean} [isCurried] Specify composing for a curried function.
* @returns {Array} Returns the new array of composed arguments.
*/
function composeArgsRight(args, partials, holders, isCurried) {
	var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$15(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
	while (++argsIndex < rangeLength) result[argsIndex] = args[argsIndex];
	var offset = argsIndex;
	while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
	while (++holdersIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[offset + holders[holdersIndex]] = args[argsIndex++];
	return result;
}
var nativeMax$15;
var init__composeArgsRight = __esmMin((() => {
	nativeMax$15 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/_countHolders.js
/**
* Gets the number of `placeholder` occurrences in `array`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} placeholder The placeholder to search for.
* @returns {number} Returns the placeholder count.
*/
function countHolders(array, placeholder) {
	var length = array.length, result = 0;
	while (length--) if (array[length] === placeholder) ++result;
	return result;
}
var init__countHolders = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseLodash.js
/**
* The function whose prototype chain sequence wrappers inherit from.
*
* @private
*/
function baseLodash() {}
var init__baseLodash = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_LazyWrapper.js
/**
* Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
*
* @private
* @constructor
* @param {*} value The value to wrap.
*/
function LazyWrapper(value) {
	this.__wrapped__ = value;
	this.__actions__ = [];
	this.__dir__ = 1;
	this.__filtered__ = false;
	this.__iteratees__ = [];
	this.__takeCount__ = MAX_ARRAY_LENGTH$4;
	this.__views__ = [];
}
var MAX_ARRAY_LENGTH$4;
var init__LazyWrapper = __esmMin((() => {
	init__baseCreate();
	init__baseLodash();
	MAX_ARRAY_LENGTH$4 = 4294967295;
	LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	LazyWrapper.prototype.constructor = LazyWrapper;
}));
//#endregion
//#region ../../node_modules/lodash-es/noop.js
/**
* This method returns `undefined`.
*
* @static
* @memberOf _
* @since 2.3.0
* @category Util
* @example
*
* _.times(2, _.noop);
* // => [undefined, undefined]
*/
function noop() {}
var init_noop = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_getData.js
var getData;
var init__getData = __esmMin((() => {
	init__metaMap();
	init_noop();
	getData = !metaMap ? noop : function(func) {
		return metaMap.get(func);
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_realNames.js
var realNames;
var init__realNames = __esmMin((() => {
	realNames = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/_getFuncName.js
/**
* Gets the name of `func`.
*
* @private
* @param {Function} func The function to query.
* @returns {string} Returns the function name.
*/
function getFuncName(func) {
	var result = func.name + "", array = realNames[result], length = hasOwnProperty$23.call(realNames, result) ? array.length : 0;
	while (length--) {
		var data = array[length], otherFunc = data.func;
		if (otherFunc == null || otherFunc == func) return data.name;
	}
	return result;
}
var hasOwnProperty$23;
var init__getFuncName = __esmMin((() => {
	init__realNames();
	hasOwnProperty$23 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_LodashWrapper.js
/**
* The base constructor for creating `lodash` wrapper objects.
*
* @private
* @param {*} value The value to wrap.
* @param {boolean} [chainAll] Enable explicit method chain sequences.
*/
function LodashWrapper(value, chainAll) {
	this.__wrapped__ = value;
	this.__actions__ = [];
	this.__chain__ = !!chainAll;
	this.__index__ = 0;
	this.__values__ = void 0;
}
var init__LodashWrapper = __esmMin((() => {
	init__baseCreate();
	init__baseLodash();
	LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	LodashWrapper.prototype.constructor = LodashWrapper;
}));
//#endregion
//#region ../../node_modules/lodash-es/_copyArray.js
/**
* Copies the values of `source` to `array`.
*
* @private
* @param {Array} source The array to copy values from.
* @param {Array} [array=[]] The array to copy values to.
* @returns {Array} Returns `array`.
*/
function copyArray(source, array) {
	var index = -1, length = source.length;
	array || (array = Array(length));
	while (++index < length) array[index] = source[index];
	return array;
}
var init__copyArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_wrapperClone.js
/**
* Creates a clone of `wrapper`.
*
* @private
* @param {Object} wrapper The wrapper to clone.
* @returns {Object} Returns the cloned wrapper.
*/
function wrapperClone(wrapper) {
	if (wrapper instanceof LazyWrapper) return wrapper.clone();
	var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	result.__actions__ = copyArray(wrapper.__actions__);
	result.__index__ = wrapper.__index__;
	result.__values__ = wrapper.__values__;
	return result;
}
var init__wrapperClone = __esmMin((() => {
	init__LazyWrapper();
	init__LodashWrapper();
	init__copyArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/wrapperLodash.js
/**
* Creates a `lodash` object which wraps `value` to enable implicit method
* chain sequences. Methods that operate on and return arrays, collections,
* and functions can be chained together. Methods that retrieve a single value
* or may return a primitive value will automatically end the chain sequence
* and return the unwrapped value. Otherwise, the value must be unwrapped
* with `_#value`.
*
* Explicit chain sequences, which must be unwrapped with `_#value`, may be
* enabled using `_.chain`.
*
* The execution of chained methods is lazy, that is, it's deferred until
* `_#value` is implicitly or explicitly called.
*
* Lazy evaluation allows several methods to support shortcut fusion.
* Shortcut fusion is an optimization to merge iteratee calls; this avoids
* the creation of intermediate arrays and can greatly reduce the number of
* iteratee executions. Sections of a chain sequence qualify for shortcut
* fusion if the section is applied to an array and iteratees accept only
* one argument. The heuristic for whether a section qualifies for shortcut
* fusion is subject to change.
*
* Chaining is supported in custom builds as long as the `_#value` method is
* directly or indirectly included in the build.
*
* In addition to lodash methods, wrappers have `Array` and `String` methods.
*
* The wrapper `Array` methods are:
* `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
*
* The wrapper `String` methods are:
* `replace` and `split`
*
* The wrapper methods that support shortcut fusion are:
* `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
* `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
* `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
*
* The chainable wrapper methods are:
* `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
* `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
* `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
* `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
* `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
* `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
* `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
* `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
* `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
* `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
* `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
* `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
* `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
* `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
* `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
* `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
* `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
* `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
* `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
* `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
* `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
* `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
* `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
* `zipObject`, `zipObjectDeep`, and `zipWith`
*
* The wrapper methods that are **not** chainable by default are:
* `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
* `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
* `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
* `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
* `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
* `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
* `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
* `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
* `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
* `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
* `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
* `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
* `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
* `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
* `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
* `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
* `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
* `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
* `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
* `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
* `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
* `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
* `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
* `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
* `upperFirst`, `value`, and `words`
*
* @name _
* @constructor
* @category Seq
* @param {*} value The value to wrap in a `lodash` instance.
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* var wrapped = _([1, 2, 3]);
*
* // Returns an unwrapped value.
* wrapped.reduce(_.add);
* // => 6
*
* // Returns a wrapped value.
* var squares = wrapped.map(square);
*
* _.isArray(squares);
* // => false
*
* _.isArray(squares.value());
* // => true
*/
function lodash(value) {
	if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
		if (value instanceof LodashWrapper) return value;
		if (hasOwnProperty$22.call(value, "__wrapped__")) return wrapperClone(value);
	}
	return new LodashWrapper(value);
}
var hasOwnProperty$22;
var init_wrapperLodash = __esmMin((() => {
	init__LazyWrapper();
	init__LodashWrapper();
	init__baseLodash();
	init_isArray();
	init_isObjectLike();
	init__wrapperClone();
	hasOwnProperty$22 = Object.prototype.hasOwnProperty;
	lodash.prototype = baseLodash.prototype;
	lodash.prototype.constructor = lodash;
}));
//#endregion
//#region ../../node_modules/lodash-es/_isLaziable.js
/**
* Checks if `func` has a lazy counterpart.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` has a lazy counterpart,
*  else `false`.
*/
function isLaziable(func) {
	var funcName = getFuncName(func), other = lodash[funcName];
	if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) return false;
	if (func === other) return true;
	var data = getData(other);
	return !!data && func === data[0];
}
var init__isLaziable = __esmMin((() => {
	init__LazyWrapper();
	init__getData();
	init__getFuncName();
	init_wrapperLodash();
}));
//#endregion
//#region ../../node_modules/lodash-es/_shortOut.js
/**
* Creates a function that'll short out and invoke `identity` instead
* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
* milliseconds.
*
* @private
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new shortable function.
*/
function shortOut(func) {
	var count = 0, lastCalled = 0;
	return function() {
		var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
		lastCalled = stamp;
		if (remaining > 0) {
			if (++count >= HOT_COUNT) return arguments[0];
		} else count = 0;
		return func.apply(void 0, arguments);
	};
}
var HOT_COUNT, HOT_SPAN, nativeNow;
var init__shortOut = __esmMin((() => {
	HOT_COUNT = 800, HOT_SPAN = 16;
	nativeNow = Date.now;
}));
//#endregion
//#region ../../node_modules/lodash-es/_setData.js
var setData;
var init__setData = __esmMin((() => {
	init__baseSetData();
	init__shortOut();
	setData = shortOut(baseSetData);
}));
//#endregion
//#region ../../node_modules/lodash-es/_getWrapDetails.js
/**
* Extracts wrapper details from the `source` body comment.
*
* @private
* @param {string} source The source to inspect.
* @returns {Array} Returns the wrapper details.
*/
function getWrapDetails(source) {
	var match = source.match(reWrapDetails);
	return match ? match[1].split(reSplitDetails) : [];
}
var reWrapDetails, reSplitDetails;
var init__getWrapDetails = __esmMin((() => {
	reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
}));
//#endregion
//#region ../../node_modules/lodash-es/_insertWrapDetails.js
/**
* Inserts wrapper `details` in a comment at the top of the `source` body.
*
* @private
* @param {string} source The source to modify.
* @returns {Array} details The details to insert.
* @returns {string} Returns the modified source.
*/
function insertWrapDetails(source, details) {
	var length = details.length;
	if (!length) return source;
	var lastIndex = length - 1;
	details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
	details = details.join(length > 2 ? ", " : " ");
	return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
}
var reWrapComment;
var init__insertWrapDetails = __esmMin((() => {
	reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
}));
//#endregion
//#region ../../node_modules/lodash-es/constant.js
/**
* Creates a function that returns `value`.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {*} value The value to return from the new function.
* @returns {Function} Returns the new constant function.
* @example
*
* var objects = _.times(2, _.constant({ 'a': 1 }));
*
* console.log(objects);
* // => [{ 'a': 1 }, { 'a': 1 }]
*
* console.log(objects[0] === objects[1]);
* // => true
*/
function constant(value) {
	return function() {
		return value;
	};
}
var init_constant = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_defineProperty.js
var defineProperty;
var init__defineProperty = __esmMin((() => {
	init__getNative();
	defineProperty = function() {
		try {
			var func = getNative(Object, "defineProperty");
			func({}, "", {});
			return func;
		} catch (e) {}
	}();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSetToString.js
var baseSetToString;
var init__baseSetToString = __esmMin((() => {
	init_constant();
	init__defineProperty();
	init_identity();
	baseSetToString = !defineProperty ? identity : function(func, string) {
		return defineProperty(func, "toString", {
			"configurable": true,
			"enumerable": false,
			"value": constant(string),
			"writable": true
		});
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_setToString.js
var setToString;
var init__setToString = __esmMin((() => {
	init__baseSetToString();
	init__shortOut();
	setToString = shortOut(baseSetToString);
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayEach.js
/**
* A specialized version of `_.forEach` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns `array`.
*/
function arrayEach(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (iteratee(array[index], index, array) === false) break;
	return array;
}
var init__arrayEach = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFindIndex.js
/**
* The base implementation of `_.findIndex` and `_.findLastIndex` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {number} fromIndex The index to search from.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
	while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
	return -1;
}
var init__baseFindIndex = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsNaN.js
/**
* The base implementation of `_.isNaN` without support for number objects.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
*/
function baseIsNaN(value) {
	return value !== value;
}
var init__baseIsNaN = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_strictIndexOf.js
/**
* A specialized version of `_.indexOf` which performs strict equality
* comparisons of values, i.e. `===`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function strictIndexOf(array, value, fromIndex) {
	var index = fromIndex - 1, length = array.length;
	while (++index < length) if (array[index] === value) return index;
	return -1;
}
var init__strictIndexOf = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIndexOf.js
/**
* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseIndexOf(array, value, fromIndex) {
	return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
var init__baseIndexOf = __esmMin((() => {
	init__baseFindIndex();
	init__baseIsNaN();
	init__strictIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayIncludes.js
/**
* A specialized version of `_.includes` for arrays without support for
* specifying an index to search from.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludes(array, value) {
	return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
}
var init__arrayIncludes = __esmMin((() => {
	init__baseIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_updateWrapDetails.js
/**
* Updates wrapper `details` based on `bitmask` flags.
*
* @private
* @returns {Array} details The details to modify.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @returns {Array} Returns `details`.
*/
function updateWrapDetails(details, bitmask) {
	arrayEach(wrapFlags, function(pair) {
		var value = "_." + pair[0];
		if (bitmask & pair[1] && !arrayIncludes(details, value)) details.push(value);
	});
	return details.sort();
}
var wrapFlags;
var init__updateWrapDetails = __esmMin((() => {
	init__arrayEach();
	init__arrayIncludes();
	wrapFlags = [
		["ary", 128],
		["bind", 1],
		["bindKey", 2],
		["curry", 8],
		["curryRight", 16],
		["flip", 512],
		["partial", 32],
		["partialRight", 64],
		["rearg", 256]
	];
}));
//#endregion
//#region ../../node_modules/lodash-es/_setWrapToString.js
/**
* Sets the `toString` method of `wrapper` to mimic the source of `reference`
* with wrapper details in a comment at the top of the source body.
*
* @private
* @param {Function} wrapper The function to modify.
* @param {Function} reference The reference function.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @returns {Function} Returns `wrapper`.
*/
function setWrapToString(wrapper, reference, bitmask) {
	var source = reference + "";
	return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}
var init__setWrapToString = __esmMin((() => {
	init__getWrapDetails();
	init__insertWrapDetails();
	init__setToString();
	init__updateWrapDetails();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createRecurry.js
/**
* Creates a function that wraps `func` to continue currying.
*
* @private
* @param {Function} func The function to wrap.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @param {Function} wrapFunc The function to create the `func` wrapper.
* @param {*} placeholder The placeholder value.
* @param {*} [thisArg] The `this` binding of `func`.
* @param {Array} [partials] The arguments to prepend to those provided to
*  the new function.
* @param {Array} [holders] The `partials` placeholder indexes.
* @param {Array} [argPos] The argument positions of the new function.
* @param {number} [ary] The arity cap of `func`.
* @param {number} [arity] The arity of `func`.
* @returns {Function} Returns the new wrapped function.
*/
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
	var isCurry = bitmask & WRAP_CURRY_FLAG$5, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
	bitmask |= isCurry ? WRAP_PARTIAL_FLAG$5 : WRAP_PARTIAL_RIGHT_FLAG$2;
	bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$2 : WRAP_PARTIAL_FLAG$5);
	if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) bitmask &= ~(WRAP_BIND_FLAG$6 | WRAP_BIND_KEY_FLAG$5);
	var newData = [
		func,
		bitmask,
		thisArg,
		newPartials,
		newHolders,
		newPartialsRight,
		newHoldersRight,
		argPos,
		ary,
		arity
	];
	var result = wrapFunc.apply(void 0, newData);
	if (isLaziable(func)) setData(result, newData);
	result.placeholder = placeholder;
	return setWrapToString(result, func, bitmask);
}
var WRAP_BIND_FLAG$6, WRAP_BIND_KEY_FLAG$5, WRAP_CURRY_BOUND_FLAG$1, WRAP_CURRY_FLAG$5, WRAP_PARTIAL_FLAG$5, WRAP_PARTIAL_RIGHT_FLAG$2;
var init__createRecurry = __esmMin((() => {
	init__isLaziable();
	init__setData();
	init__setWrapToString();
	WRAP_BIND_FLAG$6 = 1, WRAP_BIND_KEY_FLAG$5 = 2, WRAP_CURRY_BOUND_FLAG$1 = 4, WRAP_CURRY_FLAG$5 = 8, WRAP_PARTIAL_FLAG$5 = 32, WRAP_PARTIAL_RIGHT_FLAG$2 = 64;
}));
//#endregion
//#region ../../node_modules/lodash-es/_getHolder.js
/**
* Gets the argument placeholder value for `func`.
*
* @private
* @param {Function} func The function to inspect.
* @returns {*} Returns the placeholder value.
*/
function getHolder(func) {
	return func.placeholder;
}
var init__getHolder = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_isIndex.js
/**
* Checks if `value` is a valid array-like index.
*
* @private
* @param {*} value The value to check.
* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
*/
function isIndex(value, length) {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER$5 : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
var MAX_SAFE_INTEGER$5, reIsUint;
var init__isIndex = __esmMin((() => {
	MAX_SAFE_INTEGER$5 = 9007199254740991;
	reIsUint = /^(?:0|[1-9]\d*)$/;
}));
//#endregion
//#region ../../node_modules/lodash-es/_reorder.js
/**
* Reorder `array` according to the specified indexes where the element at
* the first index is assigned as the first element, the element at
* the second index is assigned as the second element, and so on.
*
* @private
* @param {Array} array The array to reorder.
* @param {Array} indexes The arranged array indexes.
* @returns {Array} Returns `array`.
*/
function reorder(array, indexes) {
	var arrLength = array.length, length = nativeMin$14(indexes.length, arrLength), oldArray = copyArray(array);
	while (length--) {
		var index = indexes[length];
		array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
	}
	return array;
}
var nativeMin$14;
var init__reorder = __esmMin((() => {
	init__copyArray();
	init__isIndex();
	nativeMin$14 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/_replaceHolders.js
/**
* Replaces all `placeholder` elements in `array` with an internal placeholder
* and returns an array of their indexes.
*
* @private
* @param {Array} array The array to modify.
* @param {*} placeholder The placeholder to replace.
* @returns {Array} Returns the new array of placeholder indexes.
*/
function replaceHolders(array, placeholder) {
	var index = -1, length = array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (value === placeholder || value === PLACEHOLDER$1) {
			array[index] = PLACEHOLDER$1;
			result[resIndex++] = index;
		}
	}
	return result;
}
var PLACEHOLDER$1;
var init__replaceHolders = __esmMin((() => {
	PLACEHOLDER$1 = "__lodash_placeholder__";
}));
//#endregion
//#region ../../node_modules/lodash-es/_createHybrid.js
/**
* Creates a function that wraps `func` to invoke it with optional `this`
* binding of `thisArg`, partial application, and currying.
*
* @private
* @param {Function|string} func The function or method name to wrap.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @param {*} [thisArg] The `this` binding of `func`.
* @param {Array} [partials] The arguments to prepend to those provided to
*  the new function.
* @param {Array} [holders] The `partials` placeholder indexes.
* @param {Array} [partialsRight] The arguments to append to those provided
*  to the new function.
* @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
* @param {Array} [argPos] The argument positions of the new function.
* @param {number} [ary] The arity cap of `func`.
* @param {number} [arity] The arity of `func`.
* @returns {Function} Returns the new wrapped function.
*/
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	var isAry = bitmask & WRAP_ARY_FLAG$3, isBind = bitmask & WRAP_BIND_FLAG$5, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4, isCurried = bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2), isFlip = bitmask & WRAP_FLIP_FLAG$1, Ctor = isBindKey ? void 0 : createCtor(func);
	function wrapper() {
		var length = arguments.length, args = Array(length), index = length;
		while (index--) args[index] = arguments[index];
		if (isCurried) var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
		if (partials) args = composeArgs(args, partials, holders, isCurried);
		if (partialsRight) args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
		length -= holdersCount;
		if (isCurried && length < arity) {
			var newHolders = replaceHolders(args, placeholder);
			return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
		}
		var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
		length = args.length;
		if (argPos) args = reorder(args, argPos);
		else if (isFlip && length > 1) args.reverse();
		if (isAry && ary < length) args.length = ary;
		if (this && this !== root && this instanceof wrapper) fn = Ctor || createCtor(fn);
		return fn.apply(thisBinding, args);
	}
	return wrapper;
}
var WRAP_BIND_FLAG$5, WRAP_BIND_KEY_FLAG$4, WRAP_CURRY_FLAG$4, WRAP_CURRY_RIGHT_FLAG$2, WRAP_ARY_FLAG$3, WRAP_FLIP_FLAG$1;
var init__createHybrid = __esmMin((() => {
	init__composeArgs();
	init__composeArgsRight();
	init__countHolders();
	init__createCtor();
	init__createRecurry();
	init__getHolder();
	init__reorder();
	init__replaceHolders();
	init__root();
	WRAP_BIND_FLAG$5 = 1, WRAP_BIND_KEY_FLAG$4 = 2, WRAP_CURRY_FLAG$4 = 8, WRAP_CURRY_RIGHT_FLAG$2 = 16, WRAP_ARY_FLAG$3 = 128, WRAP_FLIP_FLAG$1 = 512;
}));
//#endregion
//#region ../../node_modules/lodash-es/_createCurry.js
/**
* Creates a function that wraps `func` to enable currying.
*
* @private
* @param {Function} func The function to wrap.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @param {number} arity The arity of `func`.
* @returns {Function} Returns the new wrapped function.
*/
function createCurry(func, bitmask, arity) {
	var Ctor = createCtor(func);
	function wrapper() {
		var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
		while (index--) args[index] = arguments[index];
		var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
		length -= holders.length;
		if (length < arity) return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, void 0, args, holders, void 0, void 0, arity - length);
		return apply(this && this !== root && this instanceof wrapper ? Ctor : func, this, args);
	}
	return wrapper;
}
var init__createCurry = __esmMin((() => {
	init__apply();
	init__createCtor();
	init__createHybrid();
	init__createRecurry();
	init__getHolder();
	init__replaceHolders();
	init__root();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createPartial.js
/**
* Creates a function that wraps `func` to invoke it with the `this` binding
* of `thisArg` and `partials` prepended to the arguments it receives.
*
* @private
* @param {Function} func The function to wrap.
* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
* @param {*} thisArg The `this` binding of `func`.
* @param {Array} partials The arguments to prepend to those provided to
*  the new function.
* @returns {Function} Returns the new wrapped function.
*/
function createPartial(func, bitmask, thisArg, partials) {
	var isBind = bitmask & WRAP_BIND_FLAG$4, Ctor = createCtor(func);
	function wrapper() {
		var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
		while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
		while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
		return apply(fn, isBind ? thisArg : this, args);
	}
	return wrapper;
}
var WRAP_BIND_FLAG$4;
var init__createPartial = __esmMin((() => {
	init__apply();
	init__createCtor();
	init__root();
	WRAP_BIND_FLAG$4 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/_mergeData.js
/**
* Merges the function metadata of `source` into `data`.
*
* Merging metadata reduces the number of wrappers used to invoke a function.
* This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
* may be applied regardless of execution order. Methods like `_.ary` and
* `_.rearg` modify function arguments, making the order in which they are
* executed important, preventing the merging of metadata. However, we make
* an exception for a safe combined case where curried functions have `_.ary`
* and or `_.rearg` applied.
*
* @private
* @param {Array} data The destination metadata.
* @param {Array} source The source metadata.
* @returns {Array} Returns `data`.
*/
function mergeData(data, source) {
	var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$3 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);
	var isCombo = srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_CURRY_FLAG$3 || srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_REARG_FLAG$2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$3;
	if (!(isCommon || isCombo)) return data;
	if (srcBitmask & WRAP_BIND_FLAG$3) {
		data[2] = source[2];
		newBitmask |= bitmask & WRAP_BIND_FLAG$3 ? 0 : WRAP_CURRY_BOUND_FLAG;
	}
	var value = source[3];
	if (value) {
		var partials = data[3];
		data[3] = partials ? composeArgs(partials, value, source[4]) : value;
		data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
	}
	value = source[5];
	if (value) {
		partials = data[5];
		data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
		data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
	}
	value = source[7];
	if (value) data[7] = value;
	if (srcBitmask & WRAP_ARY_FLAG$2) data[8] = data[8] == null ? source[8] : nativeMin$13(data[8], source[8]);
	if (data[9] == null) data[9] = source[9];
	data[0] = source[0];
	data[1] = newBitmask;
	return data;
}
var PLACEHOLDER, WRAP_BIND_FLAG$3, WRAP_BIND_KEY_FLAG$3, WRAP_CURRY_BOUND_FLAG, WRAP_CURRY_FLAG$3, WRAP_ARY_FLAG$2, WRAP_REARG_FLAG$2, nativeMin$13;
var init__mergeData = __esmMin((() => {
	init__composeArgs();
	init__composeArgsRight();
	init__replaceHolders();
	PLACEHOLDER = "__lodash_placeholder__";
	WRAP_BIND_FLAG$3 = 1, WRAP_BIND_KEY_FLAG$3 = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG$3 = 8, WRAP_ARY_FLAG$2 = 128, WRAP_REARG_FLAG$2 = 256;
	nativeMin$13 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/_createWrap.js
/**
* Creates a function that either curries or invokes `func` with optional
* `this` binding and partially applied arguments.
*
* @private
* @param {Function|string} func The function or method name to wrap.
* @param {number} bitmask The bitmask flags.
*    1 - `_.bind`
*    2 - `_.bindKey`
*    4 - `_.curry` or `_.curryRight` of a bound function
*    8 - `_.curry`
*   16 - `_.curryRight`
*   32 - `_.partial`
*   64 - `_.partialRight`
*  128 - `_.rearg`
*  256 - `_.ary`
*  512 - `_.flip`
* @param {*} [thisArg] The `this` binding of `func`.
* @param {Array} [partials] The arguments to be partially applied.
* @param {Array} [holders] The `partials` placeholder indexes.
* @param {Array} [argPos] The argument positions of the new function.
* @param {number} [ary] The arity cap of `func`.
* @param {number} [arity] The arity of `func`.
* @returns {Function} Returns the new wrapped function.
*/
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2;
	if (!isBindKey && typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$10);
	var length = partials ? partials.length : 0;
	if (!length) {
		bitmask &= ~(WRAP_PARTIAL_FLAG$4 | WRAP_PARTIAL_RIGHT_FLAG$1);
		partials = holders = void 0;
	}
	ary = ary === void 0 ? ary : nativeMax$14(toInteger(ary), 0);
	arity = arity === void 0 ? arity : toInteger(arity);
	length -= holders ? holders.length : 0;
	if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$1) {
		var partialsRight = partials, holdersRight = holders;
		partials = holders = void 0;
	}
	var data = isBindKey ? void 0 : getData(func);
	var newData = [
		func,
		bitmask,
		thisArg,
		partials,
		holders,
		partialsRight,
		holdersRight,
		argPos,
		ary,
		arity
	];
	if (data) mergeData(newData, data);
	func = newData[0];
	bitmask = newData[1];
	thisArg = newData[2];
	partials = newData[3];
	holders = newData[4];
	arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax$14(newData[9] - length, 0);
	if (!arity && bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1)) bitmask &= ~(WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1);
	if (!bitmask || bitmask == WRAP_BIND_FLAG$2) var result = createBind(func, bitmask, thisArg);
	else if (bitmask == WRAP_CURRY_FLAG$2 || bitmask == WRAP_CURRY_RIGHT_FLAG$1) result = createCurry(func, bitmask, arity);
	else if ((bitmask == WRAP_PARTIAL_FLAG$4 || bitmask == (WRAP_BIND_FLAG$2 | WRAP_PARTIAL_FLAG$4)) && !holders.length) result = createPartial(func, bitmask, thisArg, partials);
	else result = createHybrid.apply(void 0, newData);
	return setWrapToString((data ? baseSetData : setData)(result, newData), func, bitmask);
}
var FUNC_ERROR_TEXT$10, WRAP_BIND_FLAG$2, WRAP_BIND_KEY_FLAG$2, WRAP_CURRY_FLAG$2, WRAP_CURRY_RIGHT_FLAG$1, WRAP_PARTIAL_FLAG$4, WRAP_PARTIAL_RIGHT_FLAG$1, nativeMax$14;
var init__createWrap = __esmMin((() => {
	init__baseSetData();
	init__createBind();
	init__createCurry();
	init__createHybrid();
	init__createPartial();
	init__getData();
	init__mergeData();
	init__setData();
	init__setWrapToString();
	init_toInteger();
	FUNC_ERROR_TEXT$10 = "Expected a function";
	WRAP_BIND_FLAG$2 = 1, WRAP_BIND_KEY_FLAG$2 = 2, WRAP_CURRY_FLAG$2 = 8, WRAP_CURRY_RIGHT_FLAG$1 = 16, WRAP_PARTIAL_FLAG$4 = 32, WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
	nativeMax$14 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/ary.js
/**
* Creates a function that invokes `func`, with up to `n` arguments,
* ignoring any additional arguments.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Function
* @param {Function} func The function to cap arguments for.
* @param {number} [n=func.length] The arity cap.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Function} Returns the new capped function.
* @example
*
* _.map(['6', '8', '10'], _.ary(parseInt, 1));
* // => [6, 8, 10]
*/
function ary(func, n, guard) {
	n = guard ? void 0 : n;
	n = func && n == null ? func.length : n;
	return createWrap(func, WRAP_ARY_FLAG$1, void 0, void 0, void 0, void 0, n);
}
var WRAP_ARY_FLAG$1;
var init_ary = __esmMin((() => {
	init__createWrap();
	WRAP_ARY_FLAG$1 = 128;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseAssignValue.js
/**
* The base implementation of `assignValue` and `assignMergeValue` without
* value checks.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function baseAssignValue(object, key, value) {
	if (key == "__proto__" && defineProperty) defineProperty(object, key, {
		"configurable": true,
		"enumerable": true,
		"value": value,
		"writable": true
	});
	else object[key] = value;
}
var init__baseAssignValue = __esmMin((() => {
	init__defineProperty();
}));
//#endregion
//#region ../../node_modules/lodash-es/eq.js
/**
* Performs a
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* comparison between two values to determine if they are equivalent.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.eq(object, object);
* // => true
*
* _.eq(object, other);
* // => false
*
* _.eq('a', 'a');
* // => true
*
* _.eq('a', Object('a'));
* // => false
*
* _.eq(NaN, NaN);
* // => true
*/
function eq(value, other) {
	return value === other || value !== value && other !== other;
}
var init_eq = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_assignValue.js
/**
* Assigns `value` to `key` of `object` if the existing value is not equivalent
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function assignValue(object, key, value) {
	var objValue = object[key];
	if (!(hasOwnProperty$21.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
var hasOwnProperty$21;
var init__assignValue = __esmMin((() => {
	init__baseAssignValue();
	init_eq();
	hasOwnProperty$21 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_copyObject.js
/**
* Copies properties of `source` to `object`.
*
* @private
* @param {Object} source The object to copy properties from.
* @param {Array} props The property identifiers to copy.
* @param {Object} [object={}] The object to copy properties to.
* @param {Function} [customizer] The function to customize copied values.
* @returns {Object} Returns `object`.
*/
function copyObject(source, props, object, customizer) {
	var isNew = !object;
	object || (object = {});
	var index = -1, length = props.length;
	while (++index < length) {
		var key = props[index];
		var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
		if (newValue === void 0) newValue = source[key];
		if (isNew) baseAssignValue(object, key, newValue);
		else assignValue(object, key, newValue);
	}
	return object;
}
var init__copyObject = __esmMin((() => {
	init__assignValue();
	init__baseAssignValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/_overRest.js
/**
* A specialized version of `baseRest` which transforms the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @param {Function} transform The rest array transform.
* @returns {Function} Returns the new function.
*/
function overRest(func, start, transform) {
	start = nativeMax$13(start === void 0 ? func.length - 1 : start, 0);
	return function() {
		var args = arguments, index = -1, length = nativeMax$13(args.length - start, 0), array = Array(length);
		while (++index < length) array[index] = args[start + index];
		index = -1;
		var otherArgs = Array(start + 1);
		while (++index < start) otherArgs[index] = args[index];
		otherArgs[start] = transform(array);
		return apply(func, this, otherArgs);
	};
}
var nativeMax$13;
var init__overRest = __esmMin((() => {
	init__apply();
	nativeMax$13 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseRest.js
/**
* The base implementation of `_.rest` which doesn't validate or coerce arguments.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @returns {Function} Returns the new function.
*/
function baseRest(func, start) {
	return setToString(overRest(func, start, identity), func + "");
}
var init__baseRest = __esmMin((() => {
	init_identity();
	init__overRest();
	init__setToString();
}));
//#endregion
//#region ../../node_modules/lodash-es/isLength.js
/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3);
* // => true
*
* _.isLength(Number.MIN_VALUE);
* // => false
*
* _.isLength(Infinity);
* // => false
*
* _.isLength('3');
* // => false
*/
function isLength(value) {
	return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$4;
}
var MAX_SAFE_INTEGER$4;
var init_isLength = __esmMin((() => {
	MAX_SAFE_INTEGER$4 = 9007199254740991;
}));
//#endregion
//#region ../../node_modules/lodash-es/isArrayLike.js
/**
* Checks if `value` is array-like. A value is considered array-like if it's
* not a function and has a `value.length` that's an integer greater than or
* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
* @example
*
* _.isArrayLike([1, 2, 3]);
* // => true
*
* _.isArrayLike(document.body.children);
* // => true
*
* _.isArrayLike('abc');
* // => true
*
* _.isArrayLike(_.noop);
* // => false
*/
function isArrayLike(value) {
	return value != null && isLength(value.length) && !isFunction(value);
}
var init_isArrayLike = __esmMin((() => {
	init_isFunction();
	init_isLength();
}));
//#endregion
//#region ../../node_modules/lodash-es/_isIterateeCall.js
/**
* Checks if the given arguments are from an iteratee call.
*
* @private
* @param {*} value The potential iteratee value argument.
* @param {*} index The potential iteratee index or key argument.
* @param {*} object The potential iteratee object argument.
* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
*  else `false`.
*/
function isIterateeCall(value, index, object) {
	if (!isObject(object)) return false;
	var type = typeof index;
	if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
	return false;
}
var init__isIterateeCall = __esmMin((() => {
	init_eq();
	init_isArrayLike();
	init__isIndex();
	init_isObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createAssigner.js
/**
* Creates a function like `_.assign`.
*
* @private
* @param {Function} assigner The function to assign values.
* @returns {Function} Returns the new assigner function.
*/
function createAssigner(assigner) {
	return baseRest(function(object, sources) {
		var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
		customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
		if (guard && isIterateeCall(sources[0], sources[1], guard)) {
			customizer = length < 3 ? void 0 : customizer;
			length = 1;
		}
		object = Object(object);
		while (++index < length) {
			var source = sources[index];
			if (source) assigner(object, source, index, customizer);
		}
		return object;
	});
}
var init__createAssigner = __esmMin((() => {
	init__baseRest();
	init__isIterateeCall();
}));
//#endregion
//#region ../../node_modules/lodash-es/_isPrototype.js
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor;
	return value === (typeof Ctor == "function" && Ctor.prototype || objectProto$5);
}
var objectProto$5;
var init__isPrototype = __esmMin((() => {
	objectProto$5 = Object.prototype;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseTimes.js
/**
* The base implementation of `_.times` without support for iteratee shorthands
* or max array length checks.
*
* @private
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the array of results.
*/
function baseTimes(n, iteratee) {
	var index = -1, result = Array(n);
	while (++index < n) result[index] = iteratee(index);
	return result;
}
var init__baseTimes = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsArguments.js
/**
* The base implementation of `_.isArguments`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*/
function baseIsArguments(value) {
	return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
var argsTag$3;
var init__baseIsArguments = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	argsTag$3 = "[object Arguments]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isArguments.js
var objectProto$4, hasOwnProperty$20, propertyIsEnumerable$1, isArguments;
var init_isArguments = __esmMin((() => {
	init__baseIsArguments();
	init_isObjectLike();
	objectProto$4 = Object.prototype;
	hasOwnProperty$20 = objectProto$4.hasOwnProperty;
	propertyIsEnumerable$1 = objectProto$4.propertyIsEnumerable;
	isArguments = baseIsArguments(function() {
		return arguments;
	}()) ? baseIsArguments : function(value) {
		return isObjectLike(value) && hasOwnProperty$20.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/stubFalse.js
/**
* This method returns `false`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `false`.
* @example
*
* _.times(2, _.stubFalse);
* // => [false, false]
*/
function stubFalse() {
	return false;
}
var init_stubFalse = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isBuffer.js
var freeExports$2, freeModule$2, Buffer$1, isBuffer;
var init_isBuffer = __esmMin((() => {
	init__root();
	init_stubFalse();
	freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
	freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
	Buffer$1 = freeModule$2 && freeModule$2.exports === freeExports$2 ? root.Buffer : void 0;
	isBuffer = (Buffer$1 ? Buffer$1.isBuffer : void 0) || stubFalse;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsTypedArray.js
/**
* The base implementation of `_.isTypedArray` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
*/
function baseIsTypedArray(value) {
	return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
var argsTag$2, arrayTag$2, boolTag$4, dateTag$4, errorTag$3, funcTag$1, mapTag$9, numberTag$4, objectTag$4, regexpTag$4, setTag$9, stringTag$4, weakMapTag$3, arrayBufferTag$4, dataViewTag$4, float32Tag$2, float64Tag$2, int8Tag$2, int16Tag$2, int32Tag$2, uint8Tag$2, uint8ClampedTag$2, uint16Tag$2, uint32Tag$2, typedArrayTags;
var init__baseIsTypedArray = __esmMin((() => {
	init__baseGetTag();
	init_isLength();
	init_isObjectLike();
	argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$4 = "[object Boolean]", dateTag$4 = "[object Date]", errorTag$3 = "[object Error]", funcTag$1 = "[object Function]", mapTag$9 = "[object Map]", numberTag$4 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$4 = "[object RegExp]", setTag$9 = "[object Set]", stringTag$4 = "[object String]", weakMapTag$3 = "[object WeakMap]";
	arrayBufferTag$4 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
	typedArrayTags = {};
	typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
	typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$4] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$4] = typedArrayTags[errorTag$3] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$9] = typedArrayTags[numberTag$4] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$4] = typedArrayTags[setTag$9] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$3] = false;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseUnary.js
/**
* The base implementation of `_.unary` without support for storing metadata.
*
* @private
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
*/
function baseUnary(func) {
	return function(value) {
		return func(value);
	};
}
var init__baseUnary = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_nodeUtil.js
var freeExports$1, freeModule$1, freeProcess, nodeUtil;
var init__nodeUtil = __esmMin((() => {
	init__freeGlobal();
	freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
	freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
	freeProcess = freeModule$1 && freeModule$1.exports === freeExports$1 && freeGlobal.process;
	nodeUtil = function() {
		try {
			var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
			if (types) return types;
			return freeProcess && freeProcess.binding && freeProcess.binding("util");
		} catch (e) {}
	}();
}));
//#endregion
//#region ../../node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray, isTypedArray;
var init_isTypedArray = __esmMin((() => {
	init__baseIsTypedArray();
	init__baseUnary();
	init__nodeUtil();
	nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayLikeKeys.js
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value, inherited) {
	var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
	for (var key in value) if ((inherited || hasOwnProperty$19.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
	return result;
}
var hasOwnProperty$19;
var init__arrayLikeKeys = __esmMin((() => {
	init__baseTimes();
	init_isArguments();
	init_isArray();
	init_isBuffer();
	init__isIndex();
	init_isTypedArray();
	hasOwnProperty$19 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_overArg.js
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
var init__overArg = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_nativeKeys.js
var nativeKeys;
var init__nativeKeys = __esmMin((() => {
	init__overArg();
	nativeKeys = overArg(Object.keys, Object);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseKeys.js
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!isPrototype(object)) return nativeKeys(object);
	var result = [];
	for (var key in Object(object)) if (hasOwnProperty$18.call(object, key) && key != "constructor") result.push(key);
	return result;
}
var hasOwnProperty$18;
var init__baseKeys = __esmMin((() => {
	init__isPrototype();
	init__nativeKeys();
	hasOwnProperty$18 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/keys.js
/**
* Creates an array of the own enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects. See the
* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* for more details.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keys(new Foo);
* // => ['a', 'b'] (iteration order is not guaranteed)
*
* _.keys('hi');
* // => ['0', '1']
*/
function keys(object) {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
var init_keys = __esmMin((() => {
	init__arrayLikeKeys();
	init__baseKeys();
	init_isArrayLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/assign.js
var hasOwnProperty$17, assign;
var init_assign = __esmMin((() => {
	init__assignValue();
	init__copyObject();
	init__createAssigner();
	init_isArrayLike();
	init__isPrototype();
	init_keys();
	hasOwnProperty$17 = Object.prototype.hasOwnProperty;
	assign = createAssigner(function(object, source) {
		if (isPrototype(source) || isArrayLike(source)) {
			copyObject(source, keys(source), object);
			return;
		}
		for (var key in source) if (hasOwnProperty$17.call(source, key)) assignValue(object, key, source[key]);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_nativeKeysIn.js
/**
* This function is like
* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* except that it includes inherited enumerable properties.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function nativeKeysIn(object) {
	var result = [];
	if (object != null) for (var key in Object(object)) result.push(key);
	return result;
}
var init__nativeKeysIn = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseKeysIn.js
/**
* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeysIn(object) {
	if (!isObject(object)) return nativeKeysIn(object);
	var isProto = isPrototype(object), result = [];
	for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty$16.call(object, key)))) result.push(key);
	return result;
}
var hasOwnProperty$16;
var init__baseKeysIn = __esmMin((() => {
	init_isObject();
	init__isPrototype();
	init__nativeKeysIn();
	hasOwnProperty$16 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/keysIn.js
/**
* Creates an array of the own and inherited enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keysIn(new Foo);
* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
*/
function keysIn(object) {
	return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var init_keysIn = __esmMin((() => {
	init__arrayLikeKeys();
	init__baseKeysIn();
	init_isArrayLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/assignIn.js
var assignIn;
var init_assignIn = __esmMin((() => {
	init__copyObject();
	init__createAssigner();
	init_keysIn();
	assignIn = createAssigner(function(object, source) {
		copyObject(source, keysIn(source), object);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/assignInWith.js
var assignInWith;
var init_assignInWith = __esmMin((() => {
	init__copyObject();
	init__createAssigner();
	init_keysIn();
	assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
		copyObject(source, keysIn(source), object, customizer);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/assignWith.js
var assignWith;
var init_assignWith = __esmMin((() => {
	init__copyObject();
	init__createAssigner();
	init_keys();
	assignWith = createAssigner(function(object, source, srcIndex, customizer) {
		copyObject(source, keys(source), object, customizer);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_isKey.js
/**
* Checks if `value` is a property name and not a property path.
*
* @private
* @param {*} value The value to check.
* @param {Object} [object] The object to query keys on.
* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
*/
function isKey(value, object) {
	if (isArray(value)) return false;
	var type = typeof value;
	if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var reIsDeepProp, reIsPlainProp;
var init__isKey = __esmMin((() => {
	init_isArray();
	init_isSymbol();
	reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
}));
//#endregion
//#region ../../node_modules/lodash-es/_nativeCreate.js
var nativeCreate;
var init__nativeCreate = __esmMin((() => {
	init__getNative();
	nativeCreate = getNative(Object, "create");
}));
//#endregion
//#region ../../node_modules/lodash-es/_hashClear.js
/**
* Removes all key-value entries from the hash.
*
* @private
* @name clear
* @memberOf Hash
*/
function hashClear() {
	this.__data__ = nativeCreate ? nativeCreate(null) : {};
	this.size = 0;
}
var init__hashClear = __esmMin((() => {
	init__nativeCreate();
}));
//#endregion
//#region ../../node_modules/lodash-es/_hashDelete.js
/**
* Removes `key` and its value from the hash.
*
* @private
* @name delete
* @memberOf Hash
* @param {Object} hash The hash to modify.
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function hashDelete(key) {
	var result = this.has(key) && delete this.__data__[key];
	this.size -= result ? 1 : 0;
	return result;
}
var init__hashDelete = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_hashGet.js
/**
* Gets the hash value for `key`.
*
* @private
* @name get
* @memberOf Hash
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function hashGet(key) {
	var data = this.__data__;
	if (nativeCreate) {
		var result = data[key];
		return result === HASH_UNDEFINED$2 ? void 0 : result;
	}
	return hasOwnProperty$15.call(data, key) ? data[key] : void 0;
}
var HASH_UNDEFINED$2, hasOwnProperty$15;
var init__hashGet = __esmMin((() => {
	init__nativeCreate();
	HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
	hasOwnProperty$15 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_hashHas.js
/**
* Checks if a hash value for `key` exists.
*
* @private
* @name has
* @memberOf Hash
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function hashHas(key) {
	var data = this.__data__;
	return nativeCreate ? data[key] !== void 0 : hasOwnProperty$14.call(data, key);
}
var hasOwnProperty$14;
var init__hashHas = __esmMin((() => {
	init__nativeCreate();
	hasOwnProperty$14 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_hashSet.js
/**
* Sets the hash `key` to `value`.
*
* @private
* @name set
* @memberOf Hash
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the hash instance.
*/
function hashSet(key, value) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
	return this;
}
var HASH_UNDEFINED$1;
var init__hashSet = __esmMin((() => {
	init__nativeCreate();
	HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
}));
//#endregion
//#region ../../node_modules/lodash-es/_Hash.js
/**
* Creates a hash object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Hash(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
var init__Hash = __esmMin((() => {
	init__hashClear();
	init__hashDelete();
	init__hashGet();
	init__hashHas();
	init__hashSet();
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
}));
//#endregion
//#region ../../node_modules/lodash-es/_listCacheClear.js
/**
* Removes all key-value entries from the list cache.
*
* @private
* @name clear
* @memberOf ListCache
*/
function listCacheClear() {
	this.__data__ = [];
	this.size = 0;
}
var init__listCacheClear = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_assocIndexOf.js
/**
* Gets the index at which the `key` is found in `array` of key-value pairs.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} key The key to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) if (eq(array[length][0], key)) return length;
	return -1;
}
var init__assocIndexOf = __esmMin((() => {
	init_eq();
}));
//#endregion
//#region ../../node_modules/lodash-es/_listCacheDelete.js
/**
* Removes `key` and its value from the list cache.
*
* @private
* @name delete
* @memberOf ListCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function listCacheDelete(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) return false;
	if (index == data.length - 1) data.pop();
	else splice$2.call(data, index, 1);
	--this.size;
	return true;
}
var splice$2;
var init__listCacheDelete = __esmMin((() => {
	init__assocIndexOf();
	splice$2 = Array.prototype.splice;
}));
//#endregion
//#region ../../node_modules/lodash-es/_listCacheGet.js
/**
* Gets the list cache value for `key`.
*
* @private
* @name get
* @memberOf ListCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function listCacheGet(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	return index < 0 ? void 0 : data[index][1];
}
var init__listCacheGet = __esmMin((() => {
	init__assocIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_listCacheHas.js
/**
* Checks if a list cache value for `key` exists.
*
* @private
* @name has
* @memberOf ListCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function listCacheHas(key) {
	return assocIndexOf(this.__data__, key) > -1;
}
var init__listCacheHas = __esmMin((() => {
	init__assocIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_listCacheSet.js
/**
* Sets the list cache `key` to `value`.
*
* @private
* @name set
* @memberOf ListCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the list cache instance.
*/
function listCacheSet(key, value) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) {
		++this.size;
		data.push([key, value]);
	} else data[index][1] = value;
	return this;
}
var init__listCacheSet = __esmMin((() => {
	init__assocIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_ListCache.js
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
var init__ListCache = __esmMin((() => {
	init__listCacheClear();
	init__listCacheDelete();
	init__listCacheGet();
	init__listCacheHas();
	init__listCacheSet();
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
}));
//#endregion
//#region ../../node_modules/lodash-es/_Map.js
var Map;
var init__Map = __esmMin((() => {
	init__getNative();
	init__root();
	Map = getNative(root, "Map");
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapCacheClear.js
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	this.size = 0;
	this.__data__ = {
		"hash": new Hash(),
		"map": new (Map || ListCache)(),
		"string": new Hash()
	};
}
var init__mapCacheClear = __esmMin((() => {
	init__Hash();
	init__ListCache();
	init__Map();
}));
//#endregion
//#region ../../node_modules/lodash-es/_isKeyable.js
/**
* Checks if `value` is suitable for use as unique object key.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
*/
function isKeyable(value) {
	var type = typeof value;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var init__isKeyable = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_getMapData.js
/**
* Gets the data for `map`.
*
* @private
* @param {Object} map The map to query.
* @param {string} key The reference key.
* @returns {*} Returns the map data.
*/
function getMapData(map, key) {
	var data = map.__data__;
	return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var init__getMapData = __esmMin((() => {
	init__isKeyable();
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapCacheDelete.js
/**
* Removes `key` and its value from the map.
*
* @private
* @name delete
* @memberOf MapCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function mapCacheDelete(key) {
	var result = getMapData(this, key)["delete"](key);
	this.size -= result ? 1 : 0;
	return result;
}
var init__mapCacheDelete = __esmMin((() => {
	init__getMapData();
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapCacheGet.js
/**
* Gets the map value for `key`.
*
* @private
* @name get
* @memberOf MapCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function mapCacheGet(key) {
	return getMapData(this, key).get(key);
}
var init__mapCacheGet = __esmMin((() => {
	init__getMapData();
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapCacheHas.js
/**
* Checks if a map value for `key` exists.
*
* @private
* @name has
* @memberOf MapCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function mapCacheHas(key) {
	return getMapData(this, key).has(key);
}
var init__mapCacheHas = __esmMin((() => {
	init__getMapData();
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapCacheSet.js
/**
* Sets the map `key` to `value`.
*
* @private
* @name set
* @memberOf MapCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the map cache instance.
*/
function mapCacheSet(key, value) {
	var data = getMapData(this, key), size = data.size;
	data.set(key, value);
	this.size += data.size == size ? 0 : 1;
	return this;
}
var init__mapCacheSet = __esmMin((() => {
	init__getMapData();
}));
//#endregion
//#region ../../node_modules/lodash-es/_MapCache.js
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
var init__MapCache = __esmMin((() => {
	init__mapCacheClear();
	init__mapCacheDelete();
	init__mapCacheGet();
	init__mapCacheHas();
	init__mapCacheSet();
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
}));
//#endregion
//#region ../../node_modules/lodash-es/memoize.js
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize(func, resolver) {
	if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT$9);
	var memoized = function() {
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
		if (cache.has(key)) return cache.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache.set(key, result) || cache;
		return result;
	};
	memoized.cache = new (memoize.Cache || MapCache)();
	return memoized;
}
var FUNC_ERROR_TEXT$9;
var init_memoize = __esmMin((() => {
	init__MapCache();
	FUNC_ERROR_TEXT$9 = "Expected a function";
	memoize.Cache = MapCache;
}));
//#endregion
//#region ../../node_modules/lodash-es/_memoizeCapped.js
/**
* A specialized version of `_.memoize` which clears the memoized function's
* cache when it exceeds `MAX_MEMOIZE_SIZE`.
*
* @private
* @param {Function} func The function to have its output memoized.
* @returns {Function} Returns the new memoized function.
*/
function memoizeCapped(func) {
	var result = memoize(func, function(key) {
		if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
		return key;
	});
	var cache = result.cache;
	return result;
}
var MAX_MEMOIZE_SIZE;
var init__memoizeCapped = __esmMin((() => {
	init_memoize();
	MAX_MEMOIZE_SIZE = 500;
}));
//#endregion
//#region ../../node_modules/lodash-es/_stringToPath.js
var rePropName, reEscapeChar, stringToPath;
var init__stringToPath = __esmMin((() => {
	init__memoizeCapped();
	rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
	reEscapeChar = /\\(\\)?/g;
	stringToPath = memoizeCapped(function(string) {
		var result = [];
		if (string.charCodeAt(0) === 46) result.push("");
		string.replace(rePropName, function(match, number, quote, subString) {
			result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
		});
		return result;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/toString.js
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values. The sign of `-0` is preserved.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString(-0);
* // => '-0'
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString(value) {
	return value == null ? "" : baseToString(value);
}
var init_toString = __esmMin((() => {
	init__baseToString();
}));
//#endregion
//#region ../../node_modules/lodash-es/_castPath.js
/**
* Casts `value` to a path array if it's not one.
*
* @private
* @param {*} value The value to inspect.
* @param {Object} [object] The object to query keys on.
* @returns {Array} Returns the cast property path array.
*/
function castPath(value, object) {
	if (isArray(value)) return value;
	return isKey(value, object) ? [value] : stringToPath(toString(value));
}
var init__castPath = __esmMin((() => {
	init_isArray();
	init__isKey();
	init__stringToPath();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/_toKey.js
/**
* Converts `value` to a string key if it's not a string or symbol.
*
* @private
* @param {*} value The value to inspect.
* @returns {string|symbol} Returns the key.
*/
function toKey(value) {
	if (typeof value == "string" || isSymbol(value)) return value;
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
}
var INFINITY$2;
var init__toKey = __esmMin((() => {
	init_isSymbol();
	INFINITY$2 = Infinity;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseGet.js
/**
* The base implementation of `_.get` without support for default values.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @returns {*} Returns the resolved value.
*/
function baseGet(object, path) {
	path = castPath(path, object);
	var index = 0, length = path.length;
	while (object != null && index < length) object = object[toKey(path[index++])];
	return index && index == length ? object : void 0;
}
var init__baseGet = __esmMin((() => {
	init__castPath();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/get.js
/**
* Gets the value at `path` of `object`. If the resolved value is
* `undefined`, the `defaultValue` is returned in its place.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @param {*} [defaultValue] The value returned for `undefined` resolved values.
* @returns {*} Returns the resolved value.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.get(object, 'a[0].b.c');
* // => 3
*
* _.get(object, ['a', '0', 'b', 'c']);
* // => 3
*
* _.get(object, 'a.b.c', 'default');
* // => 'default'
*/
function get(object, path, defaultValue) {
	var result = object == null ? void 0 : baseGet(object, path);
	return result === void 0 ? defaultValue : result;
}
var init_get = __esmMin((() => {
	init__baseGet();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseAt.js
/**
* The base implementation of `_.at` without support for individual paths.
*
* @private
* @param {Object} object The object to iterate over.
* @param {string[]} paths The property paths to pick.
* @returns {Array} Returns the picked elements.
*/
function baseAt(object, paths) {
	var index = -1, length = paths.length, result = Array(length), skip = object == null;
	while (++index < length) result[index] = skip ? void 0 : get(object, paths[index]);
	return result;
}
var init__baseAt = __esmMin((() => {
	init_get();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayPush.js
/**
* Appends the elements of `values` to `array`.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to append.
* @returns {Array} Returns `array`.
*/
function arrayPush(array, values) {
	var index = -1, length = values.length, offset = array.length;
	while (++index < length) array[offset + index] = values[index];
	return array;
}
var init__arrayPush = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_isFlattenable.js
/**
* Checks if `value` is a flattenable `arguments` object or array.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
*/
function isFlattenable(value) {
	return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var spreadableSymbol;
var init__isFlattenable = __esmMin((() => {
	init__Symbol();
	init_isArguments();
	init_isArray();
	spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFlatten.js
/**
* The base implementation of `_.flatten` with support for restricting flattening.
*
* @private
* @param {Array} array The array to flatten.
* @param {number} depth The maximum recursion depth.
* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
* @param {Array} [result=[]] The initial result value.
* @returns {Array} Returns the new flattened array.
*/
function baseFlatten(array, depth, predicate, isStrict, result) {
	var index = -1, length = array.length;
	predicate || (predicate = isFlattenable);
	result || (result = []);
	while (++index < length) {
		var value = array[index];
		if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
		else arrayPush(result, value);
		else if (!isStrict) result[result.length] = value;
	}
	return result;
}
var init__baseFlatten = __esmMin((() => {
	init__arrayPush();
	init__isFlattenable();
}));
//#endregion
//#region ../../node_modules/lodash-es/flatten.js
/**
* Flattens `array` a single level deep.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to flatten.
* @returns {Array} Returns the new flattened array.
* @example
*
* _.flatten([1, [2, [3, [4]], 5]]);
* // => [1, 2, [3, [4]], 5]
*/
function flatten(array) {
	return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
}
var init_flatten = __esmMin((() => {
	init__baseFlatten();
}));
//#endregion
//#region ../../node_modules/lodash-es/_flatRest.js
/**
* A specialized version of `baseRest` which flattens the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @returns {Function} Returns the new function.
*/
function flatRest(func) {
	return setToString(overRest(func, void 0, flatten), func + "");
}
var init__flatRest = __esmMin((() => {
	init_flatten();
	init__overRest();
	init__setToString();
}));
//#endregion
//#region ../../node_modules/lodash-es/at.js
var at;
var init_at = __esmMin((() => {
	init__baseAt();
	init__flatRest();
	at = flatRest(baseAt);
}));
//#endregion
//#region ../../node_modules/lodash-es/_getPrototype.js
var getPrototype;
var init__getPrototype = __esmMin((() => {
	init__overArg();
	getPrototype = overArg(Object.getPrototypeOf, Object);
}));
//#endregion
//#region ../../node_modules/lodash-es/isPlainObject.js
/**
* Checks if `value` is a plain object, that is, an object created by the
* `Object` constructor or one with a `[[Prototype]]` of `null`.
*
* @static
* @memberOf _
* @since 0.8.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
* @example
*
* function Foo() {
*   this.a = 1;
* }
*
* _.isPlainObject(new Foo);
* // => false
*
* _.isPlainObject([1, 2, 3]);
* // => false
*
* _.isPlainObject({ 'x': 0, 'y': 0 });
* // => true
*
* _.isPlainObject(Object.create(null));
* // => true
*/
function isPlainObject(value) {
	if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) return false;
	var proto = getPrototype(value);
	if (proto === null) return true;
	var Ctor = hasOwnProperty$13.call(proto, "constructor") && proto.constructor;
	return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var objectTag$3, funcProto, objectProto$3, funcToString, hasOwnProperty$13, objectCtorString;
var init_isPlainObject = __esmMin((() => {
	init__baseGetTag();
	init__getPrototype();
	init_isObjectLike();
	objectTag$3 = "[object Object]";
	funcProto = Function.prototype, objectProto$3 = Object.prototype;
	funcToString = funcProto.toString;
	hasOwnProperty$13 = objectProto$3.hasOwnProperty;
	objectCtorString = funcToString.call(Object);
}));
//#endregion
//#region ../../node_modules/lodash-es/isError.js
/**
* Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
* `SyntaxError`, `TypeError`, or `URIError` object.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an error object, else `false`.
* @example
*
* _.isError(new Error);
* // => true
*
* _.isError(Error);
* // => false
*/
function isError(value) {
	if (!isObjectLike(value)) return false;
	var tag = baseGetTag(value);
	return tag == errorTag$2 || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
}
var domExcTag, errorTag$2;
var init_isError = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	init_isPlainObject();
	domExcTag = "[object DOMException]", errorTag$2 = "[object Error]";
}));
//#endregion
//#region ../../node_modules/lodash-es/attempt.js
var attempt;
var init_attempt = __esmMin((() => {
	init__apply();
	init__baseRest();
	init_isError();
	attempt = baseRest(function(func, args) {
		try {
			return apply(func, void 0, args);
		} catch (e) {
			return isError(e) ? e : new Error(e);
		}
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/before.js
/**
* Creates a function that invokes `func`, with the `this` binding and arguments
* of the created function, while it's called less than `n` times. Subsequent
* calls to the created function return the result of the last `func` invocation.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Function
* @param {number} n The number of calls at which `func` is no longer invoked.
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new restricted function.
* @example
*
* jQuery(element).on('click', _.before(5, addContactToList));
* // => Allows adding up to 4 contacts to the list.
*/
function before(n, func) {
	var result;
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$8);
	n = toInteger(n);
	return function() {
		if (--n > 0) result = func.apply(this, arguments);
		if (n <= 1) func = void 0;
		return result;
	};
}
var FUNC_ERROR_TEXT$8;
var init_before = __esmMin((() => {
	init_toInteger();
	FUNC_ERROR_TEXT$8 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/bind.js
var WRAP_BIND_FLAG$1, WRAP_PARTIAL_FLAG$3, bind;
var init_bind = __esmMin((() => {
	init__baseRest();
	init__createWrap();
	init__getHolder();
	init__replaceHolders();
	WRAP_BIND_FLAG$1 = 1, WRAP_PARTIAL_FLAG$3 = 32;
	bind = baseRest(function(func, thisArg, partials) {
		var bitmask = WRAP_BIND_FLAG$1;
		if (partials.length) {
			var holders = replaceHolders(partials, getHolder(bind));
			bitmask |= WRAP_PARTIAL_FLAG$3;
		}
		return createWrap(func, bitmask, thisArg, partials, holders);
	});
	bind.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/bindAll.js
var bindAll;
var init_bindAll = __esmMin((() => {
	init__arrayEach();
	init__baseAssignValue();
	init_bind();
	init__flatRest();
	init__toKey();
	bindAll = flatRest(function(object, methodNames) {
		arrayEach(methodNames, function(key) {
			key = toKey(key);
			baseAssignValue(object, key, bind(object[key], object));
		});
		return object;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/bindKey.js
var WRAP_BIND_FLAG, WRAP_BIND_KEY_FLAG$1, WRAP_PARTIAL_FLAG$2, bindKey;
var init_bindKey = __esmMin((() => {
	init__baseRest();
	init__createWrap();
	init__getHolder();
	init__replaceHolders();
	WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG$1 = 2, WRAP_PARTIAL_FLAG$2 = 32;
	bindKey = baseRest(function(object, key, partials) {
		var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG$1;
		if (partials.length) {
			var holders = replaceHolders(partials, getHolder(bindKey));
			bitmask |= WRAP_PARTIAL_FLAG$2;
		}
		return createWrap(key, bitmask, object, partials, holders);
	});
	bindKey.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSlice.js
/**
* The base implementation of `_.slice` without an iteratee call guard.
*
* @private
* @param {Array} array The array to slice.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns the slice of `array`.
*/
function baseSlice(array, start, end) {
	var index = -1, length = array.length;
	if (start < 0) start = -start > length ? 0 : length + start;
	end = end > length ? length : end;
	if (end < 0) end += length;
	length = start > end ? 0 : end - start >>> 0;
	start >>>= 0;
	var result = Array(length);
	while (++index < length) result[index] = array[index + start];
	return result;
}
var init__baseSlice = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_castSlice.js
/**
* Casts `array` to a slice if it's needed.
*
* @private
* @param {Array} array The array to inspect.
* @param {number} start The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns the cast slice.
*/
function castSlice(array, start, end) {
	var length = array.length;
	end = end === void 0 ? length : end;
	return !start && end >= length ? array : baseSlice(array, start, end);
}
var init__castSlice = __esmMin((() => {
	init__baseSlice();
}));
//#endregion
//#region ../../node_modules/lodash-es/_hasUnicode.js
/**
* Checks if `string` contains Unicode symbols.
*
* @private
* @param {string} string The string to inspect.
* @returns {boolean} Returns `true` if a symbol is found, else `false`.
*/
function hasUnicode(string) {
	return reHasUnicode.test(string);
}
var reHasUnicode;
var init__hasUnicode = __esmMin((() => {
	reHasUnicode = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
}));
//#endregion
//#region ../../node_modules/lodash-es/_asciiToArray.js
/**
* Converts an ASCII `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function asciiToArray(string) {
	return string.split("");
}
var init__asciiToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_unicodeToArray.js
/**
* Converts a Unicode `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function unicodeToArray(string) {
	return string.match(reUnicode$1) || [];
}
var rsAstralRange$2, rsComboRange$2, rsVarRange$2, rsAstral$1, rsCombo$2, rsFitz$1, rsModifier$2, rsNonAstral$2, rsRegional$2, rsSurrPair$2, rsZWJ$2, reOptMod$2, rsOptVar$2, rsOptJoin$2, rsSeq$2, rsSymbol$1, reUnicode$1;
var init__unicodeToArray = __esmMin((() => {
	rsAstralRange$2 = "\\ud800-\\udfff", rsComboRange$2 = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", rsVarRange$2 = "\\ufe0e\\ufe0f";
	rsAstral$1 = "[" + rsAstralRange$2 + "]", rsCombo$2 = "[" + rsComboRange$2 + "]", rsFitz$1 = "\\ud83c[\\udffb-\\udfff]", rsModifier$2 = "(?:" + rsCombo$2 + "|" + rsFitz$1 + ")", rsNonAstral$2 = "[^" + rsAstralRange$2 + "]", rsRegional$2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ$2 = "\\u200d";
	reOptMod$2 = rsModifier$2 + "?", rsOptVar$2 = "[" + rsVarRange$2 + "]?", rsOptJoin$2 = "(?:" + rsZWJ$2 + "(?:" + [
		rsNonAstral$2,
		rsRegional$2,
		rsSurrPair$2
	].join("|") + ")" + rsOptVar$2 + reOptMod$2 + ")*", rsSeq$2 = rsOptVar$2 + reOptMod$2 + rsOptJoin$2, rsSymbol$1 = "(?:" + [
		rsNonAstral$2 + rsCombo$2 + "?",
		rsCombo$2,
		rsRegional$2,
		rsSurrPair$2,
		rsAstral$1
	].join("|") + ")";
	reUnicode$1 = RegExp(rsFitz$1 + "(?=" + rsFitz$1 + ")|" + rsSymbol$1 + rsSeq$2, "g");
}));
//#endregion
//#region ../../node_modules/lodash-es/_stringToArray.js
/**
* Converts `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function stringToArray(string) {
	return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
var init__stringToArray = __esmMin((() => {
	init__asciiToArray();
	init__hasUnicode();
	init__unicodeToArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createCaseFirst.js
/**
* Creates a function like `_.lowerFirst`.
*
* @private
* @param {string} methodName The name of the `String` case method to use.
* @returns {Function} Returns the new case function.
*/
function createCaseFirst(methodName) {
	return function(string) {
		string = toString(string);
		var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
		var chr = strSymbols ? strSymbols[0] : string.charAt(0);
		var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
		return chr[methodName]() + trailing;
	};
}
var init__createCaseFirst = __esmMin((() => {
	init__castSlice();
	init__hasUnicode();
	init__stringToArray();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/upperFirst.js
var upperFirst;
var init_upperFirst = __esmMin((() => {
	init__createCaseFirst();
	upperFirst = createCaseFirst("toUpperCase");
}));
//#endregion
//#region ../../node_modules/lodash-es/capitalize.js
/**
* Converts the first character of `string` to upper case and the remaining
* to lower case.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to capitalize.
* @returns {string} Returns the capitalized string.
* @example
*
* _.capitalize('FRED');
* // => 'Fred'
*/
function capitalize(string) {
	return upperFirst(toString(string).toLowerCase());
}
var init_capitalize = __esmMin((() => {
	init_toString();
	init_upperFirst();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayReduce.js
/**
* A specialized version of `_.reduce` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @param {boolean} [initAccum] Specify using the first element of `array` as
*  the initial value.
* @returns {*} Returns the accumulated value.
*/
function arrayReduce(array, iteratee, accumulator, initAccum) {
	var index = -1, length = array == null ? 0 : array.length;
	if (initAccum && length) accumulator = array[++index];
	while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
	return accumulator;
}
var init__arrayReduce = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_basePropertyOf.js
/**
* The base implementation of `_.propertyOf` without support for deep paths.
*
* @private
* @param {Object} object The object to query.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyOf(object) {
	return function(key) {
		return object == null ? void 0 : object[key];
	};
}
var init__basePropertyOf = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_deburrLetter.js
var deburrLetter;
var init__deburrLetter = __esmMin((() => {
	init__basePropertyOf();
	deburrLetter = basePropertyOf({
		"À": "A",
		"Á": "A",
		"Â": "A",
		"Ã": "A",
		"Ä": "A",
		"Å": "A",
		"à": "a",
		"á": "a",
		"â": "a",
		"ã": "a",
		"ä": "a",
		"å": "a",
		"Ç": "C",
		"ç": "c",
		"Ð": "D",
		"ð": "d",
		"È": "E",
		"É": "E",
		"Ê": "E",
		"Ë": "E",
		"è": "e",
		"é": "e",
		"ê": "e",
		"ë": "e",
		"Ì": "I",
		"Í": "I",
		"Î": "I",
		"Ï": "I",
		"ì": "i",
		"í": "i",
		"î": "i",
		"ï": "i",
		"Ñ": "N",
		"ñ": "n",
		"Ò": "O",
		"Ó": "O",
		"Ô": "O",
		"Õ": "O",
		"Ö": "O",
		"Ø": "O",
		"ò": "o",
		"ó": "o",
		"ô": "o",
		"õ": "o",
		"ö": "o",
		"ø": "o",
		"Ù": "U",
		"Ú": "U",
		"Û": "U",
		"Ü": "U",
		"ù": "u",
		"ú": "u",
		"û": "u",
		"ü": "u",
		"Ý": "Y",
		"ý": "y",
		"ÿ": "y",
		"Æ": "Ae",
		"æ": "ae",
		"Þ": "Th",
		"þ": "th",
		"ß": "ss",
		"Ā": "A",
		"Ă": "A",
		"Ą": "A",
		"ā": "a",
		"ă": "a",
		"ą": "a",
		"Ć": "C",
		"Ĉ": "C",
		"Ċ": "C",
		"Č": "C",
		"ć": "c",
		"ĉ": "c",
		"ċ": "c",
		"č": "c",
		"Ď": "D",
		"Đ": "D",
		"ď": "d",
		"đ": "d",
		"Ē": "E",
		"Ĕ": "E",
		"Ė": "E",
		"Ę": "E",
		"Ě": "E",
		"ē": "e",
		"ĕ": "e",
		"ė": "e",
		"ę": "e",
		"ě": "e",
		"Ĝ": "G",
		"Ğ": "G",
		"Ġ": "G",
		"Ģ": "G",
		"ĝ": "g",
		"ğ": "g",
		"ġ": "g",
		"ģ": "g",
		"Ĥ": "H",
		"Ħ": "H",
		"ĥ": "h",
		"ħ": "h",
		"Ĩ": "I",
		"Ī": "I",
		"Ĭ": "I",
		"Į": "I",
		"İ": "I",
		"ĩ": "i",
		"ī": "i",
		"ĭ": "i",
		"į": "i",
		"ı": "i",
		"Ĵ": "J",
		"ĵ": "j",
		"Ķ": "K",
		"ķ": "k",
		"ĸ": "k",
		"Ĺ": "L",
		"Ļ": "L",
		"Ľ": "L",
		"Ŀ": "L",
		"Ł": "L",
		"ĺ": "l",
		"ļ": "l",
		"ľ": "l",
		"ŀ": "l",
		"ł": "l",
		"Ń": "N",
		"Ņ": "N",
		"Ň": "N",
		"Ŋ": "N",
		"ń": "n",
		"ņ": "n",
		"ň": "n",
		"ŋ": "n",
		"Ō": "O",
		"Ŏ": "O",
		"Ő": "O",
		"ō": "o",
		"ŏ": "o",
		"ő": "o",
		"Ŕ": "R",
		"Ŗ": "R",
		"Ř": "R",
		"ŕ": "r",
		"ŗ": "r",
		"ř": "r",
		"Ś": "S",
		"Ŝ": "S",
		"Ş": "S",
		"Š": "S",
		"ś": "s",
		"ŝ": "s",
		"ş": "s",
		"š": "s",
		"Ţ": "T",
		"Ť": "T",
		"Ŧ": "T",
		"ţ": "t",
		"ť": "t",
		"ŧ": "t",
		"Ũ": "U",
		"Ū": "U",
		"Ŭ": "U",
		"Ů": "U",
		"Ű": "U",
		"Ų": "U",
		"ũ": "u",
		"ū": "u",
		"ŭ": "u",
		"ů": "u",
		"ű": "u",
		"ų": "u",
		"Ŵ": "W",
		"ŵ": "w",
		"Ŷ": "Y",
		"ŷ": "y",
		"Ÿ": "Y",
		"Ź": "Z",
		"Ż": "Z",
		"Ž": "Z",
		"ź": "z",
		"ż": "z",
		"ž": "z",
		"Ĳ": "IJ",
		"ĳ": "ij",
		"Œ": "Oe",
		"œ": "oe",
		"ŉ": "'n",
		"ſ": "s"
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/deburr.js
/**
* Deburrs `string` by converting
* [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
* and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
* letters to basic Latin letters and removing
* [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to deburr.
* @returns {string} Returns the deburred string.
* @example
*
* _.deburr('déjà vu');
* // => 'deja vu'
*/
function deburr(string) {
	string = toString(string);
	return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
}
var reLatin, reComboMark;
var init_deburr = __esmMin((() => {
	init__deburrLetter();
	init_toString();
	reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
	reComboMark = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g");
}));
//#endregion
//#region ../../node_modules/lodash-es/_asciiWords.js
/**
* Splits an ASCII `string` into an array of its words.
*
* @private
* @param {string} The string to inspect.
* @returns {Array} Returns the words of `string`.
*/
function asciiWords(string) {
	return string.match(reAsciiWord) || [];
}
var reAsciiWord;
var init__asciiWords = __esmMin((() => {
	reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
}));
//#endregion
//#region ../../node_modules/lodash-es/_hasUnicodeWord.js
/**
* Checks if `string` contains a word composed of Unicode symbols.
*
* @private
* @param {string} string The string to inspect.
* @returns {boolean} Returns `true` if a word is found, else `false`.
*/
function hasUnicodeWord(string) {
	return reHasUnicodeWord.test(string);
}
var reHasUnicodeWord;
var init__hasUnicodeWord = __esmMin((() => {
	reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
}));
//#endregion
//#region ../../node_modules/lodash-es/_unicodeWords.js
/**
* Splits a Unicode `string` into an array of its words.
*
* @private
* @param {string} The string to inspect.
* @returns {Array} Returns the words of `string`.
*/
function unicodeWords(string) {
	return string.match(reUnicodeWord) || [];
}
var rsAstralRange$1, rsComboRange$1, rsDingbatRange, rsLowerRange, rsMathOpRange, rsNonCharRange, rsPunctuationRange, rsSpaceRange, rsUpperRange, rsVarRange$1, rsBreakRange, rsApos, rsBreak, rsCombo$1, rsDigits, rsDingbat, rsLower, rsMisc, rsModifier$1, rsNonAstral$1, rsRegional$1, rsSurrPair$1, rsUpper, rsZWJ$1, rsMiscLower, rsMiscUpper, rsOptContrLower, rsOptContrUpper, reOptMod$1, rsOptVar$1, rsOptJoin$1, rsOrdLower, rsOrdUpper, rsSeq$1, rsEmoji, reUnicodeWord;
var init__unicodeWords = __esmMin((() => {
	rsAstralRange$1 = "\\ud800-\\udfff", rsComboRange$1 = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange$1 = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
	rsApos = "['’]", rsBreak = "[" + rsBreakRange + "]", rsCombo$1 = "[" + rsComboRange$1 + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange$1 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsModifier$1 = "(?:" + rsCombo$1 + "|\\ud83c[\\udffb-\\udfff])", rsNonAstral$1 = "[^" + rsAstralRange$1 + "]", rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ$1 = "\\u200d";
	rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod$1 = rsModifier$1 + "?", rsOptVar$1 = "[" + rsVarRange$1 + "]?", rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [
		rsNonAstral$1,
		rsRegional$1,
		rsSurrPair$1
	].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1, rsEmoji = "(?:" + [
		rsDingbat,
		rsRegional$1,
		rsSurrPair$1
	].join("|") + ")" + rsSeq$1;
	reUnicodeWord = RegExp([
		rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [
			rsBreak,
			rsUpper,
			"$"
		].join("|") + ")",
		rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [
			rsBreak,
			rsUpper + rsMiscLower,
			"$"
		].join("|") + ")",
		rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
		rsUpper + "+" + rsOptContrUpper,
		rsOrdUpper,
		rsOrdLower,
		rsDigits,
		rsEmoji
	].join("|"), "g");
}));
//#endregion
//#region ../../node_modules/lodash-es/words.js
/**
* Splits `string` into an array of its words.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to inspect.
* @param {RegExp|string} [pattern] The pattern to match words.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the words of `string`.
* @example
*
* _.words('fred, barney, & pebbles');
* // => ['fred', 'barney', 'pebbles']
*
* _.words('fred, barney, & pebbles', /[^, ]+/g);
* // => ['fred', 'barney', '&', 'pebbles']
*/
function words(string, pattern, guard) {
	string = toString(string);
	pattern = guard ? void 0 : pattern;
	if (pattern === void 0) return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
	return string.match(pattern) || [];
}
var init_words = __esmMin((() => {
	init__asciiWords();
	init__hasUnicodeWord();
	init_toString();
	init__unicodeWords();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createCompounder.js
/**
* Creates a function like `_.camelCase`.
*
* @private
* @param {Function} callback The function to combine each word.
* @returns {Function} Returns the new compounder function.
*/
function createCompounder(callback) {
	return function(string) {
		return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
	};
}
var reApos;
var init__createCompounder = __esmMin((() => {
	init__arrayReduce();
	init_deburr();
	init_words();
	reApos = RegExp("['’]", "g");
}));
//#endregion
//#region ../../node_modules/lodash-es/camelCase.js
var camelCase;
var init_camelCase = __esmMin((() => {
	init_capitalize();
	init__createCompounder();
	camelCase = createCompounder(function(result, word, index) {
		word = word.toLowerCase();
		return result + (index ? capitalize(word) : word);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/castArray.js
/**
* Casts `value` as an array if it's not one.
*
* @static
* @memberOf _
* @since 4.4.0
* @category Lang
* @param {*} value The value to inspect.
* @returns {Array} Returns the cast array.
* @example
*
* _.castArray(1);
* // => [1]
*
* _.castArray({ 'a': 1 });
* // => [{ 'a': 1 }]
*
* _.castArray('abc');
* // => ['abc']
*
* _.castArray(null);
* // => [null]
*
* _.castArray(undefined);
* // => [undefined]
*
* _.castArray();
* // => []
*
* var array = [1, 2, 3];
* console.log(_.castArray(array) === array);
* // => true
*/
function castArray() {
	if (!arguments.length) return [];
	var value = arguments[0];
	return isArray(value) ? value : [value];
}
var init_castArray = __esmMin((() => {
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createRound.js
/**
* Creates a function like `_.round`.
*
* @private
* @param {string} methodName The name of the `Math` method to use when rounding.
* @returns {Function} Returns the new round function.
*/
function createRound(methodName) {
	var func = Math[methodName];
	return function(number, precision) {
		number = toNumber(number);
		precision = precision == null ? 0 : nativeMin$12(toInteger(precision), 292);
		if (precision && nativeIsFinite$1(number)) {
			var pair = (toString(number) + "e").split("e");
			pair = (toString(func(pair[0] + "e" + (+pair[1] + precision))) + "e").split("e");
			return +(pair[0] + "e" + (+pair[1] - precision));
		}
		return func(number);
	};
}
var nativeIsFinite$1, nativeMin$12;
var init__createRound = __esmMin((() => {
	init__root();
	init_toInteger();
	init_toNumber();
	init_toString();
	nativeIsFinite$1 = root.isFinite, nativeMin$12 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/ceil.js
var ceil;
var init_ceil = __esmMin((() => {
	init__createRound();
	ceil = createRound("ceil");
}));
//#endregion
//#region ../../node_modules/lodash-es/chain.js
/**
* Creates a `lodash` wrapper instance that wraps `value` with explicit method
* chain sequences enabled. The result of such sequences must be unwrapped
* with `_#value`.
*
* @static
* @memberOf _
* @since 1.3.0
* @category Seq
* @param {*} value The value to wrap.
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* var users = [
*   { 'user': 'barney',  'age': 36 },
*   { 'user': 'fred',    'age': 40 },
*   { 'user': 'pebbles', 'age': 1 }
* ];
*
* var youngest = _
*   .chain(users)
*   .sortBy('age')
*   .map(function(o) {
*     return o.user + ' is ' + o.age;
*   })
*   .head()
*   .value();
* // => 'pebbles is 1'
*/
function chain(value) {
	var result = lodash(value);
	result.__chain__ = true;
	return result;
}
var init_chain = __esmMin((() => {
	init_wrapperLodash();
}));
//#endregion
//#region ../../node_modules/lodash-es/chunk.js
/**
* Creates an array of elements split into groups the length of `size`.
* If `array` can't be split evenly, the final chunk will be the remaining
* elements.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to process.
* @param {number} [size=1] The length of each chunk
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the new array of chunks.
* @example
*
* _.chunk(['a', 'b', 'c', 'd'], 2);
* // => [['a', 'b'], ['c', 'd']]
*
* _.chunk(['a', 'b', 'c', 'd'], 3);
* // => [['a', 'b', 'c'], ['d']]
*/
function chunk(array, size, guard) {
	if (guard ? isIterateeCall(array, size, guard) : size === void 0) size = 1;
	else size = nativeMax$12(toInteger(size), 0);
	var length = array == null ? 0 : array.length;
	if (!length || size < 1) return [];
	var index = 0, resIndex = 0, result = Array(nativeCeil$3(length / size));
	while (index < length) result[resIndex++] = baseSlice(array, index, index += size);
	return result;
}
var nativeCeil$3, nativeMax$12;
var init_chunk = __esmMin((() => {
	init__baseSlice();
	init__isIterateeCall();
	init_toInteger();
	nativeCeil$3 = Math.ceil, nativeMax$12 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseClamp.js
/**
* The base implementation of `_.clamp` which doesn't coerce arguments.
*
* @private
* @param {number} number The number to clamp.
* @param {number} [lower] The lower bound.
* @param {number} upper The upper bound.
* @returns {number} Returns the clamped number.
*/
function baseClamp(number, lower, upper) {
	if (number === number) {
		if (upper !== void 0) number = number <= upper ? number : upper;
		if (lower !== void 0) number = number >= lower ? number : lower;
	}
	return number;
}
var init__baseClamp = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/clamp.js
/**
* Clamps `number` within the inclusive `lower` and `upper` bounds.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Number
* @param {number} number The number to clamp.
* @param {number} [lower] The lower bound.
* @param {number} upper The upper bound.
* @returns {number} Returns the clamped number.
* @example
*
* _.clamp(-10, -5, 5);
* // => -5
*
* _.clamp(10, -5, 5);
* // => 5
*/
function clamp(number, lower, upper) {
	if (upper === void 0) {
		upper = lower;
		lower = void 0;
	}
	if (upper !== void 0) {
		upper = toNumber(upper);
		upper = upper === upper ? upper : 0;
	}
	if (lower !== void 0) {
		lower = toNumber(lower);
		lower = lower === lower ? lower : 0;
	}
	return baseClamp(toNumber(number), lower, upper);
}
var init_clamp = __esmMin((() => {
	init__baseClamp();
	init_toNumber();
}));
//#endregion
//#region ../../node_modules/lodash-es/_stackClear.js
/**
* Removes all key-value entries from the stack.
*
* @private
* @name clear
* @memberOf Stack
*/
function stackClear() {
	this.__data__ = new ListCache();
	this.size = 0;
}
var init__stackClear = __esmMin((() => {
	init__ListCache();
}));
//#endregion
//#region ../../node_modules/lodash-es/_stackDelete.js
/**
* Removes `key` and its value from the stack.
*
* @private
* @name delete
* @memberOf Stack
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function stackDelete(key) {
	var data = this.__data__, result = data["delete"](key);
	this.size = data.size;
	return result;
}
var init__stackDelete = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_stackGet.js
/**
* Gets the stack value for `key`.
*
* @private
* @name get
* @memberOf Stack
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function stackGet(key) {
	return this.__data__.get(key);
}
var init__stackGet = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_stackHas.js
/**
* Checks if a stack value for `key` exists.
*
* @private
* @name has
* @memberOf Stack
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function stackHas(key) {
	return this.__data__.has(key);
}
var init__stackHas = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_stackSet.js
/**
* Sets the stack `key` to `value`.
*
* @private
* @name set
* @memberOf Stack
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the stack cache instance.
*/
function stackSet(key, value) {
	var data = this.__data__;
	if (data instanceof ListCache) {
		var pairs = data.__data__;
		if (!Map || pairs.length < LARGE_ARRAY_SIZE$2 - 1) {
			pairs.push([key, value]);
			this.size = ++data.size;
			return this;
		}
		data = this.__data__ = new MapCache(pairs);
	}
	data.set(key, value);
	this.size = data.size;
	return this;
}
var LARGE_ARRAY_SIZE$2;
var init__stackSet = __esmMin((() => {
	init__ListCache();
	init__Map();
	init__MapCache();
	LARGE_ARRAY_SIZE$2 = 200;
}));
//#endregion
//#region ../../node_modules/lodash-es/_Stack.js
/**
* Creates a stack cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Stack(entries) {
	this.size = (this.__data__ = new ListCache(entries)).size;
}
var init__Stack = __esmMin((() => {
	init__ListCache();
	init__stackClear();
	init__stackDelete();
	init__stackGet();
	init__stackHas();
	init__stackSet();
	Stack.prototype.clear = stackClear;
	Stack.prototype["delete"] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseAssign.js
/**
* The base implementation of `_.assign` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssign(object, source) {
	return object && copyObject(source, keys(source), object);
}
var init__baseAssign = __esmMin((() => {
	init__copyObject();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseAssignIn.js
/**
* The base implementation of `_.assignIn` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssignIn(object, source) {
	return object && copyObject(source, keysIn(source), object);
}
var init__baseAssignIn = __esmMin((() => {
	init__copyObject();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneBuffer.js
/**
* Creates a clone of  `buffer`.
*
* @private
* @param {Buffer} buffer The buffer to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Buffer} Returns the cloned buffer.
*/
function cloneBuffer(buffer, isDeep) {
	if (isDeep) return buffer.slice();
	var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	buffer.copy(result);
	return result;
}
var freeExports, freeModule, Buffer, allocUnsafe;
var init__cloneBuffer = __esmMin((() => {
	init__root();
	freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayFilter.js
/**
* A specialized version of `_.filter` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function arrayFilter(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (predicate(value, index, array)) result[resIndex++] = value;
	}
	return result;
}
var init__arrayFilter = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/stubArray.js
/**
* This method returns a new empty array.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {Array} Returns the new empty array.
* @example
*
* var arrays = _.times(2, _.stubArray);
*
* console.log(arrays);
* // => [[], []]
*
* console.log(arrays[0] === arrays[1]);
* // => false
*/
function stubArray() {
	return [];
}
var init_stubArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_getSymbols.js
var propertyIsEnumerable, nativeGetSymbols, getSymbols;
var init__getSymbols = __esmMin((() => {
	init__arrayFilter();
	init_stubArray();
	propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
	nativeGetSymbols = Object.getOwnPropertySymbols;
	getSymbols = !nativeGetSymbols ? stubArray : function(object) {
		if (object == null) return [];
		object = Object(object);
		return arrayFilter(nativeGetSymbols(object), function(symbol) {
			return propertyIsEnumerable.call(object, symbol);
		});
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_copySymbols.js
/**
* Copies own symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbols(source, object) {
	return copyObject(source, getSymbols(source), object);
}
var init__copySymbols = __esmMin((() => {
	init__copyObject();
	init__getSymbols();
}));
//#endregion
//#region ../../node_modules/lodash-es/_getSymbolsIn.js
var getSymbolsIn;
var init__getSymbolsIn = __esmMin((() => {
	init__arrayPush();
	init__getPrototype();
	init__getSymbols();
	init_stubArray();
	getSymbolsIn = !Object.getOwnPropertySymbols ? stubArray : function(object) {
		var result = [];
		while (object) {
			arrayPush(result, getSymbols(object));
			object = getPrototype(object);
		}
		return result;
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_copySymbolsIn.js
/**
* Copies own and inherited symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbolsIn(source, object) {
	return copyObject(source, getSymbolsIn(source), object);
}
var init__copySymbolsIn = __esmMin((() => {
	init__copyObject();
	init__getSymbolsIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseGetAllKeys.js
/**
* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
* `keysFunc` and `symbolsFunc` to get the enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Function} keysFunc The function to get the keys of `object`.
* @param {Function} symbolsFunc The function to get the symbols of `object`.
* @returns {Array} Returns the array of property names and symbols.
*/
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	var result = keysFunc(object);
	return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
var init__baseGetAllKeys = __esmMin((() => {
	init__arrayPush();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_getAllKeys.js
/**
* Creates an array of own enumerable property names and symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeys(object) {
	return baseGetAllKeys(object, keys, getSymbols);
}
var init__getAllKeys = __esmMin((() => {
	init__baseGetAllKeys();
	init__getSymbols();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_getAllKeysIn.js
/**
* Creates an array of own and inherited enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeysIn(object) {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}
var init__getAllKeysIn = __esmMin((() => {
	init__baseGetAllKeys();
	init__getSymbolsIn();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_DataView.js
var DataView;
var init__DataView = __esmMin((() => {
	init__getNative();
	init__root();
	DataView = getNative(root, "DataView");
}));
//#endregion
//#region ../../node_modules/lodash-es/_Promise.js
var Promise$1;
var init__Promise = __esmMin((() => {
	init__getNative();
	init__root();
	Promise$1 = getNative(root, "Promise");
}));
//#endregion
//#region ../../node_modules/lodash-es/_Set.js
var Set;
var init__Set = __esmMin((() => {
	init__getNative();
	init__root();
	Set = getNative(root, "Set");
}));
//#endregion
//#region ../../node_modules/lodash-es/_getTag.js
var mapTag$8, objectTag$2, promiseTag, setTag$8, weakMapTag$2, dataViewTag$3, dataViewCtorString, mapCtorString, promiseCtorString, setCtorString, weakMapCtorString, getTag, _getTag_default;
var init__getTag = __esmMin((() => {
	init__DataView();
	init__Map();
	init__Promise();
	init__Set();
	init__WeakMap();
	init__baseGetTag();
	init__toSource();
	mapTag$8 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$8 = "[object Set]", weakMapTag$2 = "[object WeakMap]";
	dataViewTag$3 = "[object DataView]";
	dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap$1);
	getTag = baseGetTag;
	if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag$3 || Map && getTag(new Map()) != mapTag$8 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$8 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$2) getTag = function(value) {
		var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
		if (ctorString) switch (ctorString) {
			case dataViewCtorString: return dataViewTag$3;
			case mapCtorString: return mapTag$8;
			case promiseCtorString: return promiseTag;
			case setCtorString: return setTag$8;
			case weakMapCtorString: return weakMapTag$2;
		}
		return result;
	};
	_getTag_default = getTag;
}));
//#endregion
//#region ../../node_modules/lodash-es/_initCloneArray.js
/**
* Initializes an array clone.
*
* @private
* @param {Array} array The array to clone.
* @returns {Array} Returns the initialized clone.
*/
function initCloneArray(array) {
	var length = array.length, result = new array.constructor(length);
	if (length && typeof array[0] == "string" && hasOwnProperty$12.call(array, "index")) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}
var hasOwnProperty$12;
var init__initCloneArray = __esmMin((() => {
	hasOwnProperty$12 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_Uint8Array.js
var Uint8Array;
var init__Uint8Array = __esmMin((() => {
	init__root();
	Uint8Array = root.Uint8Array;
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneArrayBuffer.js
/**
* Creates a clone of `arrayBuffer`.
*
* @private
* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
* @returns {ArrayBuffer} Returns the cloned array buffer.
*/
function cloneArrayBuffer(arrayBuffer) {
	var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	return result;
}
var init__cloneArrayBuffer = __esmMin((() => {
	init__Uint8Array();
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneDataView.js
/**
* Creates a clone of `dataView`.
*
* @private
* @param {Object} dataView The data view to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned data view.
*/
function cloneDataView(dataView, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var init__cloneDataView = __esmMin((() => {
	init__cloneArrayBuffer();
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneRegExp.js
/**
* Creates a clone of `regexp`.
*
* @private
* @param {Object} regexp The regexp to clone.
* @returns {Object} Returns the cloned regexp.
*/
function cloneRegExp(regexp) {
	var result = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
	result.lastIndex = regexp.lastIndex;
	return result;
}
var reFlags$1;
var init__cloneRegExp = __esmMin((() => {
	reFlags$1 = /\w*$/;
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneSymbol.js
/**
* Creates a clone of the `symbol` object.
*
* @private
* @param {Object} symbol The symbol object to clone.
* @returns {Object} Returns the cloned symbol object.
*/
function cloneSymbol(symbol) {
	return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
var symbolProto$1, symbolValueOf$1;
var init__cloneSymbol = __esmMin((() => {
	init__Symbol();
	symbolProto$1 = Symbol ? Symbol.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_cloneTypedArray.js
/**
* Creates a clone of `typedArray`.
*
* @private
* @param {Object} typedArray The typed array to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned typed array.
*/
function cloneTypedArray(typedArray, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var init__cloneTypedArray = __esmMin((() => {
	init__cloneArrayBuffer();
}));
//#endregion
//#region ../../node_modules/lodash-es/_initCloneByTag.js
/**
* Initializes an object clone based on its `toStringTag`.
*
* **Note:** This function only supports cloning values with tags of
* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
*
* @private
* @param {Object} object The object to clone.
* @param {string} tag The `toStringTag` of the object to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneByTag(object, tag, isDeep) {
	var Ctor = object.constructor;
	switch (tag) {
		case arrayBufferTag$3: return cloneArrayBuffer(object);
		case boolTag$3:
		case dateTag$3: return new Ctor(+object);
		case dataViewTag$2: return cloneDataView(object, isDeep);
		case float32Tag$1:
		case float64Tag$1:
		case int8Tag$1:
		case int16Tag$1:
		case int32Tag$1:
		case uint8Tag$1:
		case uint8ClampedTag$1:
		case uint16Tag$1:
		case uint32Tag$1: return cloneTypedArray(object, isDeep);
		case mapTag$7: return new Ctor();
		case numberTag$3:
		case stringTag$3: return new Ctor(object);
		case regexpTag$3: return cloneRegExp(object);
		case setTag$7: return new Ctor();
		case symbolTag$2: return cloneSymbol(object);
	}
}
var boolTag$3, dateTag$3, mapTag$7, numberTag$3, regexpTag$3, setTag$7, stringTag$3, symbolTag$2, arrayBufferTag$3, dataViewTag$2, float32Tag$1, float64Tag$1, int8Tag$1, int16Tag$1, int32Tag$1, uint8Tag$1, uint8ClampedTag$1, uint16Tag$1, uint32Tag$1;
var init__initCloneByTag = __esmMin((() => {
	init__cloneArrayBuffer();
	init__cloneDataView();
	init__cloneRegExp();
	init__cloneSymbol();
	init__cloneTypedArray();
	boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", mapTag$7 = "[object Map]", numberTag$3 = "[object Number]", regexpTag$3 = "[object RegExp]", setTag$7 = "[object Set]", stringTag$3 = "[object String]", symbolTag$2 = "[object Symbol]";
	arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
}));
//#endregion
//#region ../../node_modules/lodash-es/_initCloneObject.js
/**
* Initializes an object clone.
*
* @private
* @param {Object} object The object to clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneObject(object) {
	return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
var init__initCloneObject = __esmMin((() => {
	init__baseCreate();
	init__getPrototype();
	init__isPrototype();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsMap.js
/**
* The base implementation of `_.isMap` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
*/
function baseIsMap(value) {
	return isObjectLike(value) && _getTag_default(value) == mapTag$6;
}
var mapTag$6;
var init__baseIsMap = __esmMin((() => {
	init__getTag();
	init_isObjectLike();
	mapTag$6 = "[object Map]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isMap.js
var nodeIsMap, isMap;
var init_isMap = __esmMin((() => {
	init__baseIsMap();
	init__baseUnary();
	init__nodeUtil();
	nodeIsMap = nodeUtil && nodeUtil.isMap;
	isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsSet.js
/**
* The base implementation of `_.isSet` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
*/
function baseIsSet(value) {
	return isObjectLike(value) && _getTag_default(value) == setTag$6;
}
var setTag$6;
var init__baseIsSet = __esmMin((() => {
	init__getTag();
	init_isObjectLike();
	setTag$6 = "[object Set]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isSet.js
var nodeIsSet, isSet;
var init_isSet = __esmMin((() => {
	init__baseIsSet();
	init__baseUnary();
	init__nodeUtil();
	nodeIsSet = nodeUtil && nodeUtil.isSet;
	isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseClone.js
/**
* The base implementation of `_.clone` and `_.cloneDeep` which tracks
* traversed objects.
*
* @private
* @param {*} value The value to clone.
* @param {boolean} bitmask The bitmask flags.
*  1 - Deep clone
*  2 - Flatten inherited properties
*  4 - Clone symbols
* @param {Function} [customizer] The function to customize cloning.
* @param {string} [key] The key of `value`.
* @param {Object} [object] The parent object of `value`.
* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
* @returns {*} Returns the cloned value.
*/
function baseClone(value, bitmask, customizer, key, object, stack) {
	var result, isDeep = bitmask & CLONE_DEEP_FLAG$7, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$5;
	if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
	if (result !== void 0) return result;
	if (!isObject(value)) return value;
	var isArr = isArray(value);
	if (isArr) {
		result = initCloneArray(value);
		if (!isDeep) return copyArray(value, result);
	} else {
		var tag = _getTag_default(value), isFunc = tag == funcTag || tag == genTag;
		if (isBuffer(value)) return cloneBuffer(value, isDeep);
		if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
			result = isFlat || isFunc ? {} : initCloneObject(value);
			if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
		} else {
			if (!cloneableTags[tag]) return object ? value : {};
			result = initCloneByTag(value, tag, isDeep);
		}
	}
	stack || (stack = new Stack());
	var stacked = stack.get(value);
	if (stacked) return stacked;
	stack.set(value, result);
	if (isSet(value)) value.forEach(function(subValue) {
		result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	});
	else if (isMap(value)) value.forEach(function(subValue, key) {
		result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	var props = isArr ? void 0 : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
	arrayEach(props || value, function(subValue, key) {
		if (props) {
			key = subValue;
			subValue = value[key];
		}
		assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	return result;
}
var CLONE_DEEP_FLAG$7, CLONE_FLAT_FLAG$1, CLONE_SYMBOLS_FLAG$5, argsTag$1, arrayTag$1, boolTag$2, dateTag$2, errorTag$1, funcTag, genTag, mapTag$5, numberTag$2, objectTag$1, regexpTag$2, setTag$5, stringTag$2, symbolTag$1, weakMapTag$1, arrayBufferTag$2, dataViewTag$1, float32Tag, float64Tag, int8Tag, int16Tag, int32Tag, uint8Tag, uint8ClampedTag, uint16Tag, uint32Tag, cloneableTags;
var init__baseClone = __esmMin((() => {
	init__Stack();
	init__arrayEach();
	init__assignValue();
	init__baseAssign();
	init__baseAssignIn();
	init__cloneBuffer();
	init__copyArray();
	init__copySymbols();
	init__copySymbolsIn();
	init__getAllKeys();
	init__getAllKeysIn();
	init__getTag();
	init__initCloneArray();
	init__initCloneByTag();
	init__initCloneObject();
	init_isArray();
	init_isBuffer();
	init_isMap();
	init_isObject();
	init_isSet();
	init_keys();
	init_keysIn();
	CLONE_DEEP_FLAG$7 = 1, CLONE_FLAT_FLAG$1 = 2, CLONE_SYMBOLS_FLAG$5 = 4;
	argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$5 = "[object Map]", numberTag$2 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$2 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag$1 = "[object WeakMap]";
	arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
	cloneableTags = {};
	cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$5] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$2] = cloneableTags[setTag$5] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag$1] = false;
}));
//#endregion
//#region ../../node_modules/lodash-es/clone.js
/**
* Creates a shallow clone of `value`.
*
* **Note:** This method is loosely based on the
* [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
* and supports cloning arrays, array buffers, booleans, date objects, maps,
* numbers, `Object` objects, regexes, sets, strings, symbols, and typed
* arrays. The own enumerable properties of `arguments` objects are cloned
* as plain objects. An empty object is returned for uncloneable values such
* as error objects, functions, DOM nodes, and WeakMaps.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to clone.
* @returns {*} Returns the cloned value.
* @see _.cloneDeep
* @example
*
* var objects = [{ 'a': 1 }, { 'b': 2 }];
*
* var shallow = _.clone(objects);
* console.log(shallow[0] === objects[0]);
* // => true
*/
function clone(value) {
	return baseClone(value, CLONE_SYMBOLS_FLAG$4);
}
var CLONE_SYMBOLS_FLAG$4;
var init_clone = __esmMin((() => {
	init__baseClone();
	CLONE_SYMBOLS_FLAG$4 = 4;
}));
//#endregion
//#region ../../node_modules/lodash-es/cloneDeep.js
/**
* This method is like `_.clone` except that it recursively clones `value`.
*
* @static
* @memberOf _
* @since 1.0.0
* @category Lang
* @param {*} value The value to recursively clone.
* @returns {*} Returns the deep cloned value.
* @see _.clone
* @example
*
* var objects = [{ 'a': 1 }, { 'b': 2 }];
*
* var deep = _.cloneDeep(objects);
* console.log(deep[0] === objects[0]);
* // => false
*/
function cloneDeep(value) {
	return baseClone(value, CLONE_DEEP_FLAG$6 | CLONE_SYMBOLS_FLAG$3);
}
var CLONE_DEEP_FLAG$6, CLONE_SYMBOLS_FLAG$3;
var init_cloneDeep = __esmMin((() => {
	init__baseClone();
	CLONE_DEEP_FLAG$6 = 1, CLONE_SYMBOLS_FLAG$3 = 4;
}));
//#endregion
//#region ../../node_modules/lodash-es/cloneDeepWith.js
/**
* This method is like `_.cloneWith` except that it recursively clones `value`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to recursively clone.
* @param {Function} [customizer] The function to customize cloning.
* @returns {*} Returns the deep cloned value.
* @see _.cloneWith
* @example
*
* function customizer(value) {
*   if (_.isElement(value)) {
*     return value.cloneNode(true);
*   }
* }
*
* var el = _.cloneDeepWith(document.body, customizer);
*
* console.log(el === document.body);
* // => false
* console.log(el.nodeName);
* // => 'BODY'
* console.log(el.childNodes.length);
* // => 20
*/
function cloneDeepWith(value, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	return baseClone(value, CLONE_DEEP_FLAG$5 | CLONE_SYMBOLS_FLAG$2, customizer);
}
var CLONE_DEEP_FLAG$5, CLONE_SYMBOLS_FLAG$2;
var init_cloneDeepWith = __esmMin((() => {
	init__baseClone();
	CLONE_DEEP_FLAG$5 = 1, CLONE_SYMBOLS_FLAG$2 = 4;
}));
//#endregion
//#region ../../node_modules/lodash-es/cloneWith.js
/**
* This method is like `_.clone` except that it accepts `customizer` which
* is invoked to produce the cloned value. If `customizer` returns `undefined`,
* cloning is handled by the method instead. The `customizer` is invoked with
* up to four arguments; (value [, index|key, object, stack]).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to clone.
* @param {Function} [customizer] The function to customize cloning.
* @returns {*} Returns the cloned value.
* @see _.cloneDeepWith
* @example
*
* function customizer(value) {
*   if (_.isElement(value)) {
*     return value.cloneNode(false);
*   }
* }
*
* var el = _.cloneWith(document.body, customizer);
*
* console.log(el === document.body);
* // => false
* console.log(el.nodeName);
* // => 'BODY'
* console.log(el.childNodes.length);
* // => 0
*/
function cloneWith(value, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	return baseClone(value, CLONE_SYMBOLS_FLAG$1, customizer);
}
var CLONE_SYMBOLS_FLAG$1;
var init_cloneWith = __esmMin((() => {
	init__baseClone();
	CLONE_SYMBOLS_FLAG$1 = 4;
}));
//#endregion
//#region ../../node_modules/lodash-es/commit.js
/**
* Executes the chain sequence and returns the wrapped result.
*
* @name commit
* @memberOf _
* @since 3.2.0
* @category Seq
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* var array = [1, 2];
* var wrapped = _(array).push(3);
*
* console.log(array);
* // => [1, 2]
*
* wrapped = wrapped.commit();
* console.log(array);
* // => [1, 2, 3]
*
* wrapped.last();
* // => 3
*
* console.log(array);
* // => [1, 2, 3]
*/
function wrapperCommit() {
	return new LodashWrapper(this.value(), this.__chain__);
}
var init_commit = __esmMin((() => {
	init__LodashWrapper();
}));
//#endregion
//#region ../../node_modules/lodash-es/compact.js
/**
* Creates an array with all falsey values removed. The values `false`, `null`,
* `0`, `-0`, `0n`, `""`, `undefined`, and `NaN` are falsy.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to compact.
* @returns {Array} Returns the new array of filtered values.
* @example
*
* _.compact([0, 1, false, 2, '', 3]);
* // => [1, 2, 3]
*/
function compact(array) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (value) result[resIndex++] = value;
	}
	return result;
}
var init_compact = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/concat.js
/**
* Creates a new array concatenating `array` with any additional arrays
* and/or values.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to concatenate.
* @param {...*} [values] The values to concatenate.
* @returns {Array} Returns the new concatenated array.
* @example
*
* var array = [1];
* var other = _.concat(array, 2, [3], [[4]]);
*
* console.log(other);
* // => [1, 2, 3, [4]]
*
* console.log(array);
* // => [1]
*/
function concat() {
	var length = arguments.length;
	if (!length) return [];
	var args = Array(length - 1), array = arguments[0], index = length;
	while (index--) args[index - 1] = arguments[index];
	return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
var init_concat = __esmMin((() => {
	init__arrayPush();
	init__baseFlatten();
	init__copyArray();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_setCacheAdd.js
/**
* Adds `value` to the array cache.
*
* @private
* @name add
* @memberOf SetCache
* @alias push
* @param {*} value The value to cache.
* @returns {Object} Returns the cache instance.
*/
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}
var HASH_UNDEFINED;
var init__setCacheAdd = __esmMin((() => {
	HASH_UNDEFINED = "__lodash_hash_undefined__";
}));
//#endregion
//#region ../../node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
var init__setCacheHas = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_SetCache.js
/**
*
* Creates an array cache object to store unique values.
*
* @private
* @constructor
* @param {Array} [values] The values to cache.
*/
function SetCache(values) {
	var index = -1, length = values == null ? 0 : values.length;
	this.__data__ = new MapCache();
	while (++index < length) this.add(values[index]);
}
var init__SetCache = __esmMin((() => {
	init__MapCache();
	init__setCacheAdd();
	init__setCacheHas();
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
}));
//#endregion
//#region ../../node_modules/lodash-es/_arraySome.js
/**
* A specialized version of `_.some` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function arraySome(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (predicate(array[index], index, array)) return true;
	return false;
}
var init__arraySome = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_cacheHas.js
/**
* Checks if a `cache` value for `key` exists.
*
* @private
* @param {Object} cache The cache to query.
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function cacheHas(cache, key) {
	return cache.has(key);
}
var init__cacheHas = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_equalArrays.js
/**
* A specialized version of `baseIsEqualDeep` for arrays with support for
* partial deep comparisons.
*
* @private
* @param {Array} array The array to compare.
* @param {Array} other The other array to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `array` and `other` objects.
* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
*/
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
	if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
	var arrStacked = stack.get(array);
	var othStacked = stack.get(other);
	if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
	var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
	stack.set(array, other);
	stack.set(other, array);
	while (++index < arrLength) {
		var arrValue = array[index], othValue = other[index];
		if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
		if (compared !== void 0) {
			if (compared) continue;
			result = false;
			break;
		}
		if (seen) {
			if (!arraySome(other, function(othValue, othIndex) {
				if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
			})) {
				result = false;
				break;
			}
		} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
			result = false;
			break;
		}
	}
	stack["delete"](array);
	stack["delete"](other);
	return result;
}
var COMPARE_PARTIAL_FLAG$5, COMPARE_UNORDERED_FLAG$3;
var init__equalArrays = __esmMin((() => {
	init__SetCache();
	init__arraySome();
	init__cacheHas();
	COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
}));
//#endregion
//#region ../../node_modules/lodash-es/_mapToArray.js
/**
* Converts `map` to its key-value pairs.
*
* @private
* @param {Object} map The map to convert.
* @returns {Array} Returns the key-value pairs.
*/
function mapToArray(map) {
	var index = -1, result = Array(map.size);
	map.forEach(function(value, key) {
		result[++index] = [key, value];
	});
	return result;
}
var init__mapToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_setToArray.js
/**
* Converts `set` to an array of its values.
*
* @private
* @param {Object} set The set to convert.
* @returns {Array} Returns the values.
*/
function setToArray(set) {
	var index = -1, result = Array(set.size);
	set.forEach(function(value) {
		result[++index] = value;
	});
	return result;
}
var init__setToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_equalByTag.js
/**
* A specialized version of `baseIsEqualDeep` for comparing objects of
* the same `toStringTag`.
*
* **Note:** This function only supports comparing values with tags of
* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {string} tag The `toStringTag` of the objects to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	switch (tag) {
		case dataViewTag:
			if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
			object = object.buffer;
			other = other.buffer;
		case arrayBufferTag$1:
			if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
			return true;
		case boolTag$1:
		case dateTag$1:
		case numberTag$1: return eq(+object, +other);
		case errorTag: return object.name == other.name && object.message == other.message;
		case regexpTag$1:
		case stringTag$1: return object == other + "";
		case mapTag$4: var convert = mapToArray;
		case setTag$4:
			var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
			convert || (convert = setToArray);
			if (object.size != other.size && !isPartial) return false;
			var stacked = stack.get(object);
			if (stacked) return stacked == other;
			bitmask |= COMPARE_UNORDERED_FLAG$2;
			stack.set(object, other);
			var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack["delete"](object);
			return result;
		case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
	}
	return false;
}
var COMPARE_PARTIAL_FLAG$4, COMPARE_UNORDERED_FLAG$2, boolTag$1, dateTag$1, errorTag, mapTag$4, numberTag$1, regexpTag$1, setTag$4, stringTag$1, symbolTag, arrayBufferTag$1, dataViewTag, symbolProto, symbolValueOf;
var init__equalByTag = __esmMin((() => {
	init__Symbol();
	init__Uint8Array();
	init_eq();
	init__equalArrays();
	init__mapToArray();
	init__setToArray();
	COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
	boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag = "[object Error]", mapTag$4 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
	arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
	symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/_equalObjects.js
/**
* A specialized version of `baseIsEqualDeep` for objects with support for
* partial deep comparisons.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length;
	if (objLength != getAllKeys(other).length && !isPartial) return false;
	var index = objLength;
	while (index--) {
		var key = objProps[index];
		if (!(isPartial ? key in other : hasOwnProperty$11.call(other, key))) return false;
	}
	var objStacked = stack.get(object);
	var othStacked = stack.get(other);
	if (objStacked && othStacked) return objStacked == other && othStacked == object;
	var result = true;
	stack.set(object, other);
	stack.set(other, object);
	var skipCtor = isPartial;
	while (++index < objLength) {
		key = objProps[index];
		var objValue = object[key], othValue = other[key];
		if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
		if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
			result = false;
			break;
		}
		skipCtor || (skipCtor = key == "constructor");
	}
	if (result && !skipCtor) {
		var objCtor = object.constructor, othCtor = other.constructor;
		if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
	}
	stack["delete"](object);
	stack["delete"](other);
	return result;
}
var COMPARE_PARTIAL_FLAG$3, hasOwnProperty$11;
var init__equalObjects = __esmMin((() => {
	init__getAllKeys();
	COMPARE_PARTIAL_FLAG$3 = 1;
	hasOwnProperty$11 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsEqualDeep.js
/**
* A specialized version of `baseIsEqual` for arrays and objects which performs
* deep comparisons and tracks traversed objects enabling objects with circular
* references to be compared.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} [stack] Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : _getTag_default(object), othTag = othIsArr ? arrayTag : _getTag_default(other);
	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;
	var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
	if (isSameTag && isBuffer(object)) {
		if (!isBuffer(other)) return false;
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack || (stack = new Stack());
		return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
		var objIsWrapped = objIsObj && hasOwnProperty$10.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$10.call(other, "__wrapped__");
		if (objIsWrapped || othIsWrapped) {
			var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
			stack || (stack = new Stack());
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) return false;
	stack || (stack = new Stack());
	return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
var COMPARE_PARTIAL_FLAG$2, argsTag, arrayTag, objectTag, hasOwnProperty$10;
var init__baseIsEqualDeep = __esmMin((() => {
	init__Stack();
	init__equalArrays();
	init__equalByTag();
	init__equalObjects();
	init__getTag();
	init_isArray();
	init_isBuffer();
	init_isTypedArray();
	COMPARE_PARTIAL_FLAG$2 = 1;
	argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
	hasOwnProperty$10 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsEqual.js
/**
* The base implementation of `_.isEqual` which supports partial comparisons
* and tracks traversed objects.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @param {boolean} bitmask The bitmask flags.
*  1 - Unordered comparison
*  2 - Partial comparison
* @param {Function} [customizer] The function to customize comparisons.
* @param {Object} [stack] Tracks traversed `value` and `other` objects.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
*/
function baseIsEqual(value, other, bitmask, customizer, stack) {
	if (value === other) return true;
	if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
	return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
var init__baseIsEqual = __esmMin((() => {
	init__baseIsEqualDeep();
	init_isObjectLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsMatch.js
/**
* The base implementation of `_.isMatch` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @param {Array} matchData The property names, values, and compare flags to match.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
*/
function baseIsMatch(object, source, matchData, customizer) {
	var index = matchData.length, length = index, noCustomizer = !customizer;
	if (object == null) return !length;
	object = Object(object);
	while (index--) {
		var data = matchData[index];
		if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
	}
	while (++index < length) {
		data = matchData[index];
		var key = data[0], objValue = object[key], srcValue = data[1];
		if (noCustomizer && data[2]) {
			if (objValue === void 0 && !(key in object)) return false;
		} else {
			var stack = new Stack();
			if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
			if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) return false;
		}
	}
	return true;
}
var COMPARE_PARTIAL_FLAG$1, COMPARE_UNORDERED_FLAG$1;
var init__baseIsMatch = __esmMin((() => {
	init__Stack();
	init__baseIsEqual();
	COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
}));
//#endregion
//#region ../../node_modules/lodash-es/_isStrictComparable.js
/**
* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` if suitable for strict
*  equality comparisons, else `false`.
*/
function isStrictComparable(value) {
	return value === value && !isObject(value);
}
var init__isStrictComparable = __esmMin((() => {
	init_isObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/_getMatchData.js
/**
* Gets the property names, values, and compare flags of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the match data of `object`.
*/
function getMatchData(object) {
	var result = keys(object), length = result.length;
	while (length--) {
		var key = result[length], value = object[key];
		result[length] = [
			key,
			value,
			isStrictComparable(value)
		];
	}
	return result;
}
var init__getMatchData = __esmMin((() => {
	init__isStrictComparable();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_matchesStrictComparable.js
/**
* A specialized version of `matchesProperty` for source values suitable
* for strict equality comparisons, i.e. `===`.
*
* @private
* @param {string} key The key of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function matchesStrictComparable(key, srcValue) {
	return function(object) {
		if (object == null) return false;
		return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
	};
}
var init__matchesStrictComparable = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMatches.js
/**
* The base implementation of `_.matches` which doesn't clone `source`.
*
* @private
* @param {Object} source The object of property values to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatches(source) {
	var matchData = getMatchData(source);
	if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	return function(object) {
		return object === source || baseIsMatch(object, source, matchData);
	};
}
var init__baseMatches = __esmMin((() => {
	init__baseIsMatch();
	init__getMatchData();
	init__matchesStrictComparable();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseHasIn.js
/**
* The base implementation of `_.hasIn` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHasIn(object, key) {
	return object != null && key in Object(object);
}
var init__baseHasIn = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_hasPath.js
/**
* Checks if `path` exists on `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @param {Function} hasFunc The function to check properties.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
*/
function hasPath(object, path, hasFunc) {
	path = castPath(path, object);
	var index = -1, length = path.length, result = false;
	while (++index < length) {
		var key = toKey(path[index]);
		if (!(result = object != null && hasFunc(object, key))) break;
		object = object[key];
	}
	if (result || ++index != length) return result;
	length = object == null ? 0 : object.length;
	return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}
var init__hasPath = __esmMin((() => {
	init__castPath();
	init_isArguments();
	init_isArray();
	init__isIndex();
	init_isLength();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/hasIn.js
/**
* Checks if `path` is a direct or inherited property of `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.hasIn(object, 'a');
* // => true
*
* _.hasIn(object, 'a.b');
* // => true
*
* _.hasIn(object, ['a', 'b']);
* // => true
*
* _.hasIn(object, 'b');
* // => false
*/
function hasIn(object, path) {
	return object != null && hasPath(object, path, baseHasIn);
}
var init_hasIn = __esmMin((() => {
	init__baseHasIn();
	init__hasPath();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMatchesProperty.js
/**
* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
*
* @private
* @param {string} path The path of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatchesProperty(path, srcValue) {
	if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
	return function(object) {
		var objValue = get(object, path);
		return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	};
}
var COMPARE_PARTIAL_FLAG, COMPARE_UNORDERED_FLAG;
var init__baseMatchesProperty = __esmMin((() => {
	init__baseIsEqual();
	init_get();
	init_hasIn();
	init__isKey();
	init__isStrictComparable();
	init__matchesStrictComparable();
	init__toKey();
	COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseProperty.js
/**
* The base implementation of `_.property` without support for deep paths.
*
* @private
* @param {string} key The key of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function baseProperty(key) {
	return function(object) {
		return object == null ? void 0 : object[key];
	};
}
var init__baseProperty = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_basePropertyDeep.js
/**
* A specialized version of `baseProperty` which supports deep paths.
*
* @private
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyDeep(path) {
	return function(object) {
		return baseGet(object, path);
	};
}
var init__basePropertyDeep = __esmMin((() => {
	init__baseGet();
}));
//#endregion
//#region ../../node_modules/lodash-es/property.js
/**
* Creates a function that returns the value at `path` of a given object.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
* @example
*
* var objects = [
*   { 'a': { 'b': 2 } },
*   { 'a': { 'b': 1 } }
* ];
*
* _.map(objects, _.property('a.b'));
* // => [2, 1]
*
* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
* // => [1, 2]
*/
function property(path) {
	return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
var init_property = __esmMin((() => {
	init__baseProperty();
	init__basePropertyDeep();
	init__isKey();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIteratee.js
/**
* The base implementation of `_.iteratee`.
*
* @private
* @param {*} [value=_.identity] The value to convert to an iteratee.
* @returns {Function} Returns the iteratee.
*/
function baseIteratee(value) {
	if (typeof value == "function") return value;
	if (value == null) return identity;
	if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
	return property(value);
}
var init__baseIteratee = __esmMin((() => {
	init__baseMatches();
	init__baseMatchesProperty();
	init_identity();
	init_isArray();
	init_property();
}));
//#endregion
//#region ../../node_modules/lodash-es/cond.js
/**
* Creates a function that iterates over `pairs` and invokes the corresponding
* function of the first predicate to return truthy. The predicate-function
* pairs are invoked with the `this` binding and arguments of the created
* function.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Util
* @param {Array} pairs The predicate-function pairs.
* @returns {Function} Returns the new composite function.
* @example
*
* var func = _.cond([
*   [_.matches({ 'a': 1 }),           _.constant('matches A')],
*   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
*   [_.stubTrue,                      _.constant('no match')]
* ]);
*
* func({ 'a': 1, 'b': 2 });
* // => 'matches A'
*
* func({ 'a': 0, 'b': 1 });
* // => 'matches B'
*
* func({ 'a': '1', 'b': '2' });
* // => 'no match'
*/
function cond(pairs) {
	var length = pairs == null ? 0 : pairs.length, toIteratee = baseIteratee;
	pairs = !length ? [] : arrayMap(pairs, function(pair) {
		if (typeof pair[1] != "function") throw new TypeError(FUNC_ERROR_TEXT$7);
		return [toIteratee(pair[0]), pair[1]];
	});
	return baseRest(function(args) {
		var index = -1;
		while (++index < length) {
			var pair = pairs[index];
			if (apply(pair[0], this, args)) return apply(pair[1], this, args);
		}
	});
}
var FUNC_ERROR_TEXT$7;
var init_cond = __esmMin((() => {
	init__apply();
	init__arrayMap();
	init__baseIteratee();
	init__baseRest();
	FUNC_ERROR_TEXT$7 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseConformsTo.js
/**
* The base implementation of `_.conformsTo` which accepts `props` to check.
*
* @private
* @param {Object} object The object to inspect.
* @param {Object} source The object of property predicates to conform to.
* @returns {boolean} Returns `true` if `object` conforms, else `false`.
*/
function baseConformsTo(object, source, props) {
	var length = props.length;
	if (object == null) return !length;
	object = Object(object);
	while (length--) {
		var key = props[length], predicate = source[key], value = object[key];
		if (value === void 0 && !(key in object) || !predicate(value)) return false;
	}
	return true;
}
var init__baseConformsTo = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseConforms.js
/**
* The base implementation of `_.conforms` which doesn't clone `source`.
*
* @private
* @param {Object} source The object of property predicates to conform to.
* @returns {Function} Returns the new spec function.
*/
function baseConforms(source) {
	var props = keys(source);
	return function(object) {
		return baseConformsTo(object, source, props);
	};
}
var init__baseConforms = __esmMin((() => {
	init__baseConformsTo();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/conforms.js
/**
* Creates a function that invokes the predicate properties of `source` with
* the corresponding property values of a given object, returning `true` if
* all predicates return truthy, else `false`.
*
* **Note:** The created function is equivalent to `_.conformsTo` with
* `source` partially applied.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Util
* @param {Object} source The object of property predicates to conform to.
* @returns {Function} Returns the new spec function.
* @example
*
* var objects = [
*   { 'a': 2, 'b': 1 },
*   { 'a': 1, 'b': 2 }
* ];
*
* _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
* // => [{ 'a': 1, 'b': 2 }]
*/
function conforms(source) {
	return baseConforms(baseClone(source, CLONE_DEEP_FLAG$4));
}
var CLONE_DEEP_FLAG$4;
var init_conforms = __esmMin((() => {
	init__baseClone();
	init__baseConforms();
	CLONE_DEEP_FLAG$4 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/conformsTo.js
/**
* Checks if `object` conforms to `source` by invoking the predicate
* properties of `source` with the corresponding property values of `object`.
*
* **Note:** This method is equivalent to `_.conforms` when `source` is
* partially applied.
*
* @static
* @memberOf _
* @since 4.14.0
* @category Lang
* @param {Object} object The object to inspect.
* @param {Object} source The object of property predicates to conform to.
* @returns {boolean} Returns `true` if `object` conforms, else `false`.
* @example
*
* var object = { 'a': 1, 'b': 2 };
*
* _.conformsTo(object, { 'b': function(n) { return n > 1; } });
* // => true
*
* _.conformsTo(object, { 'b': function(n) { return n > 2; } });
* // => false
*/
function conformsTo(object, source) {
	return source == null || baseConformsTo(object, source, keys(source));
}
var init_conformsTo = __esmMin((() => {
	init__baseConformsTo();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayAggregator.js
/**
* A specialized version of `baseAggregator` for arrays.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} setter The function to set `accumulator` values.
* @param {Function} iteratee The iteratee to transform keys.
* @param {Object} accumulator The initial aggregated object.
* @returns {Function} Returns `accumulator`.
*/
function arrayAggregator(array, setter, iteratee, accumulator) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) {
		var value = array[index];
		setter(accumulator, value, iteratee(value), array);
	}
	return accumulator;
}
var init__arrayAggregator = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_createBaseFor.js
/**
* Creates a base function for methods like `_.forIn` and `_.forOwn`.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseFor(fromRight) {
	return function(object, iteratee, keysFunc) {
		var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
		while (length--) {
			var key = props[fromRight ? length : ++index];
			if (iteratee(iterable[key], key, iterable) === false) break;
		}
		return object;
	};
}
var init__createBaseFor = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFor.js
var baseFor;
var init__baseFor = __esmMin((() => {
	init__createBaseFor();
	baseFor = createBaseFor();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseForOwn.js
/**
* The base implementation of `_.forOwn` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwn(object, iteratee) {
	return object && baseFor(object, iteratee, keys);
}
var init__baseForOwn = __esmMin((() => {
	init__baseFor();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createBaseEach.js
/**
* Creates a `baseEach` or `baseEachRight` function.
*
* @private
* @param {Function} eachFunc The function to iterate over a collection.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseEach(eachFunc, fromRight) {
	return function(collection, iteratee) {
		if (collection == null) return collection;
		if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
		var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
		while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
		return collection;
	};
}
var init__createBaseEach = __esmMin((() => {
	init_isArrayLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseEach.js
var baseEach;
var init__baseEach = __esmMin((() => {
	init__baseForOwn();
	init__createBaseEach();
	baseEach = createBaseEach(baseForOwn);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseAggregator.js
/**
* Aggregates elements of `collection` on `accumulator` with keys transformed
* by `iteratee` and values set by `setter`.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} setter The function to set `accumulator` values.
* @param {Function} iteratee The iteratee to transform keys.
* @param {Object} accumulator The initial aggregated object.
* @returns {Function} Returns `accumulator`.
*/
function baseAggregator(collection, setter, iteratee, accumulator) {
	baseEach(collection, function(value, key, collection) {
		setter(accumulator, value, iteratee(value), collection);
	});
	return accumulator;
}
var init__baseAggregator = __esmMin((() => {
	init__baseEach();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createAggregator.js
/**
* Creates a function like `_.groupBy`.
*
* @private
* @param {Function} setter The function to set accumulator values.
* @param {Function} [initializer] The accumulator object initializer.
* @returns {Function} Returns the new aggregator function.
*/
function createAggregator(setter, initializer) {
	return function(collection, iteratee) {
		var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
		return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
	};
}
var init__createAggregator = __esmMin((() => {
	init__arrayAggregator();
	init__baseAggregator();
	init__baseIteratee();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/countBy.js
var hasOwnProperty$9, countBy;
var init_countBy = __esmMin((() => {
	init__baseAssignValue();
	init__createAggregator();
	hasOwnProperty$9 = Object.prototype.hasOwnProperty;
	countBy = createAggregator(function(result, value, key) {
		if (hasOwnProperty$9.call(result, key)) ++result[key];
		else baseAssignValue(result, key, 1);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/create.js
/**
* Creates an object that inherits from the `prototype` object. If a
* `properties` object is given, its own enumerable string keyed properties
* are assigned to the created object.
*
* @static
* @memberOf _
* @since 2.3.0
* @category Object
* @param {Object} prototype The object to inherit from.
* @param {Object} [properties] The properties to assign to the object.
* @returns {Object} Returns the new object.
* @example
*
* function Shape() {
*   this.x = 0;
*   this.y = 0;
* }
*
* function Circle() {
*   Shape.call(this);
* }
*
* Circle.prototype = _.create(Shape.prototype, {
*   'constructor': Circle
* });
*
* var circle = new Circle;
* circle instanceof Circle;
* // => true
*
* circle instanceof Shape;
* // => true
*/
function create(prototype, properties) {
	var result = baseCreate(prototype);
	return properties == null ? result : baseAssign(result, properties);
}
var init_create = __esmMin((() => {
	init__baseAssign();
	init__baseCreate();
}));
//#endregion
//#region ../../node_modules/lodash-es/curry.js
/**
* Creates a function that accepts arguments of `func` and either invokes
* `func` returning its result, if at least `arity` number of arguments have
* been provided, or returns a function that accepts the remaining `func`
* arguments, and so on. The arity of `func` may be specified if `func.length`
* is not sufficient.
*
* The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
* may be used as a placeholder for provided arguments.
*
* **Note:** This method doesn't set the "length" property of curried functions.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Function
* @param {Function} func The function to curry.
* @param {number} [arity=func.length] The arity of `func`.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Function} Returns the new curried function.
* @example
*
* var abc = function(a, b, c) {
*   return [a, b, c];
* };
*
* var curried = _.curry(abc);
*
* curried(1)(2)(3);
* // => [1, 2, 3]
*
* curried(1, 2)(3);
* // => [1, 2, 3]
*
* curried(1, 2, 3);
* // => [1, 2, 3]
*
* // Curried with placeholders.
* curried(1)(_, 3)(2);
* // => [1, 2, 3]
*/
function curry(func, arity, guard) {
	arity = guard ? void 0 : arity;
	var result = createWrap(func, WRAP_CURRY_FLAG$1, void 0, void 0, void 0, void 0, void 0, arity);
	result.placeholder = curry.placeholder;
	return result;
}
var WRAP_CURRY_FLAG$1;
var init_curry = __esmMin((() => {
	init__createWrap();
	WRAP_CURRY_FLAG$1 = 8;
	curry.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/curryRight.js
/**
* This method is like `_.curry` except that arguments are applied to `func`
* in the manner of `_.partialRight` instead of `_.partial`.
*
* The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
* builds, may be used as a placeholder for provided arguments.
*
* **Note:** This method doesn't set the "length" property of curried functions.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Function
* @param {Function} func The function to curry.
* @param {number} [arity=func.length] The arity of `func`.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Function} Returns the new curried function.
* @example
*
* var abc = function(a, b, c) {
*   return [a, b, c];
* };
*
* var curried = _.curryRight(abc);
*
* curried(3)(2)(1);
* // => [1, 2, 3]
*
* curried(2, 3)(1);
* // => [1, 2, 3]
*
* curried(1, 2, 3);
* // => [1, 2, 3]
*
* // Curried with placeholders.
* curried(3)(1, _)(2);
* // => [1, 2, 3]
*/
function curryRight(func, arity, guard) {
	arity = guard ? void 0 : arity;
	var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, void 0, void 0, void 0, void 0, void 0, arity);
	result.placeholder = curryRight.placeholder;
	return result;
}
var WRAP_CURRY_RIGHT_FLAG;
var init_curryRight = __esmMin((() => {
	init__createWrap();
	WRAP_CURRY_RIGHT_FLAG = 16;
	curryRight.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/now.js
var now;
var init_now = __esmMin((() => {
	init__root();
	now = function() {
		return root.Date.now();
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/debounce.js
/**
* Creates a debounced function that delays invoking `func` until after `wait`
* milliseconds have elapsed since the last time the debounced function was
* invoked. The debounced function comes with a `cancel` method to cancel
* delayed `func` invocations and a `flush` method to immediately invoke them.
* Provide `options` to indicate whether `func` should be invoked on the
* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
* with the last arguments provided to the debounced function. Subsequent
* calls to the debounced function return the result of the last `func`
* invocation.
*
* **Note:** If `leading` and `trailing` options are `true`, `func` is
* invoked on the trailing edge of the timeout only if the debounced function
* is invoked more than once during the `wait` timeout.
*
* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
* until to the next tick, similar to `setTimeout` with a timeout of `0`.
*
* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
* for details over the differences between `_.debounce` and `_.throttle`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to debounce.
* @param {number} [wait=0] The number of milliseconds to delay.
* @param {Object} [options={}] The options object.
* @param {boolean} [options.leading=false]
*  Specify invoking on the leading edge of the timeout.
* @param {number} [options.maxWait]
*  The maximum time `func` is allowed to be delayed before it's invoked.
* @param {boolean} [options.trailing=true]
*  Specify invoking on the trailing edge of the timeout.
* @returns {Function} Returns the new debounced function.
* @example
*
* // Avoid costly calculations while the window size is in flux.
* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
*
* // Invoke `sendMail` when clicked, debouncing subsequent calls.
* jQuery(element).on('click', _.debounce(sendMail, 300, {
*   'leading': true,
*   'trailing': false
* }));
*
* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
* var source = new EventSource('/stream');
* jQuery(source).on('message', debounced);
*
* // Cancel the trailing debounced invocation.
* jQuery(window).on('popstate', debounced.cancel);
*/
function debounce(func, wait, options) {
	var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$6);
	wait = toNumber(wait) || 0;
	if (isObject(options)) {
		leading = !!options.leading;
		maxing = "maxWait" in options;
		maxWait = maxing ? nativeMax$11(toNumber(options.maxWait) || 0, wait) : maxWait;
		trailing = "trailing" in options ? !!options.trailing : trailing;
	}
	function invokeFunc(time) {
		var args = lastArgs, thisArg = lastThis;
		lastArgs = lastThis = void 0;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}
	function leadingEdge(time) {
		lastInvokeTime = time;
		timerId = setTimeout(timerExpired, wait);
		return leading ? invokeFunc(time) : result;
	}
	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
		return maxing ? nativeMin$11(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	}
	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
		return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	}
	function timerExpired() {
		var time = now();
		if (shouldInvoke(time)) return trailingEdge(time);
		timerId = setTimeout(timerExpired, remainingWait(time));
	}
	function trailingEdge(time) {
		timerId = void 0;
		if (trailing && lastArgs) return invokeFunc(time);
		lastArgs = lastThis = void 0;
		return result;
	}
	function cancel() {
		if (timerId !== void 0) clearTimeout(timerId);
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = void 0;
	}
	function flush() {
		return timerId === void 0 ? result : trailingEdge(now());
	}
	function debounced() {
		var time = now(), isInvoking = shouldInvoke(time);
		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;
		if (isInvoking) {
			if (timerId === void 0) return leadingEdge(lastCallTime);
			if (maxing) {
				clearTimeout(timerId);
				timerId = setTimeout(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === void 0) timerId = setTimeout(timerExpired, wait);
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	return debounced;
}
var FUNC_ERROR_TEXT$6, nativeMax$11, nativeMin$11;
var init_debounce = __esmMin((() => {
	init_isObject();
	init_now();
	init_toNumber();
	FUNC_ERROR_TEXT$6 = "Expected a function";
	nativeMax$11 = Math.max, nativeMin$11 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/defaultTo.js
/**
* Checks `value` to determine whether a default value should be returned in
* its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
* or `undefined`.
*
* @static
* @memberOf _
* @since 4.14.0
* @category Util
* @param {*} value The value to check.
* @param {*} defaultValue The default value.
* @returns {*} Returns the resolved value.
* @example
*
* _.defaultTo(1, 10);
* // => 1
*
* _.defaultTo(undefined, 10);
* // => 10
*/
function defaultTo(value, defaultValue) {
	return value == null || value !== value ? defaultValue : value;
}
var init_defaultTo = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/defaults.js
var objectProto$2, hasOwnProperty$8, defaults;
var init_defaults = __esmMin((() => {
	init__baseRest();
	init_eq();
	init__isIterateeCall();
	init_keysIn();
	objectProto$2 = Object.prototype;
	hasOwnProperty$8 = objectProto$2.hasOwnProperty;
	defaults = baseRest(function(object, sources) {
		object = Object(object);
		var index = -1;
		var length = sources.length;
		var guard = length > 2 ? sources[2] : void 0;
		if (guard && isIterateeCall(sources[0], sources[1], guard)) length = 1;
		while (++index < length) {
			var source = sources[index];
			var props = keysIn(source);
			var propsIndex = -1;
			var propsLength = props.length;
			while (++propsIndex < propsLength) {
				var key = props[propsIndex];
				var value = object[key];
				if (value === void 0 || eq(value, objectProto$2[key]) && !hasOwnProperty$8.call(object, key)) object[key] = source[key];
			}
		}
		return object;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_assignMergeValue.js
/**
* This function is like `assignValue` except that it doesn't assign
* `undefined` values.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function assignMergeValue(object, key, value) {
	if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
var init__assignMergeValue = __esmMin((() => {
	init__baseAssignValue();
	init_eq();
}));
//#endregion
//#region ../../node_modules/lodash-es/isArrayLikeObject.js
/**
* This method is like `_.isArrayLike` except that it also checks if `value`
* is an object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array-like object,
*  else `false`.
* @example
*
* _.isArrayLikeObject([1, 2, 3]);
* // => true
*
* _.isArrayLikeObject(document.body.children);
* // => true
*
* _.isArrayLikeObject('abc');
* // => false
*
* _.isArrayLikeObject(_.noop);
* // => false
*/
function isArrayLikeObject(value) {
	return isObjectLike(value) && isArrayLike(value);
}
var init_isArrayLikeObject = __esmMin((() => {
	init_isArrayLike();
	init_isObjectLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/_safeGet.js
/**
* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function safeGet(object, key) {
	if (key === "constructor" && typeof object[key] === "function") return;
	if (key == "__proto__") return;
	return object[key];
}
var init__safeGet = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/toPlainObject.js
/**
* Converts `value` to a plain object flattening inherited enumerable string
* keyed properties of `value` to own properties of the plain object.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {Object} Returns the converted plain object.
* @example
*
* function Foo() {
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.assign({ 'a': 1 }, new Foo);
* // => { 'a': 1, 'b': 2 }
*
* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
* // => { 'a': 1, 'b': 2, 'c': 3 }
*/
function toPlainObject(value) {
	return copyObject(value, keysIn(value));
}
var init_toPlainObject = __esmMin((() => {
	init__copyObject();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMergeDeep.js
/**
* A specialized version of `baseMerge` for arrays and objects which performs
* deep merges and tracks traversed objects enabling objects with circular
* references to be merged.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @param {string} key The key of the value to merge.
* @param {number} srcIndex The index of `source`.
* @param {Function} mergeFunc The function to merge values.
* @param {Function} [customizer] The function to customize assigned values.
* @param {Object} [stack] Tracks traversed source values and their merged
*  counterparts.
*/
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
	if (stacked) {
		assignMergeValue(object, key, stacked);
		return;
	}
	var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
	var isCommon = newValue === void 0;
	if (isCommon) {
		var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
		newValue = srcValue;
		if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
		else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
		else if (isBuff) {
			isCommon = false;
			newValue = cloneBuffer(srcValue, true);
		} else if (isTyped) {
			isCommon = false;
			newValue = cloneTypedArray(srcValue, true);
		} else newValue = [];
		else if (isPlainObject(srcValue) || isArguments(srcValue)) {
			newValue = objValue;
			if (isArguments(objValue)) newValue = toPlainObject(objValue);
			else if (!isObject(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
		} else isCommon = false;
	}
	if (isCommon) {
		stack.set(srcValue, newValue);
		mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
		stack["delete"](srcValue);
	}
	assignMergeValue(object, key, newValue);
}
var init__baseMergeDeep = __esmMin((() => {
	init__assignMergeValue();
	init__cloneBuffer();
	init__cloneTypedArray();
	init__copyArray();
	init__initCloneObject();
	init_isArguments();
	init_isArray();
	init_isArrayLikeObject();
	init_isBuffer();
	init_isFunction();
	init_isObject();
	init_isPlainObject();
	init_isTypedArray();
	init__safeGet();
	init_toPlainObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMerge.js
/**
* The base implementation of `_.merge` without support for multiple sources.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @param {number} srcIndex The index of `source`.
* @param {Function} [customizer] The function to customize merged values.
* @param {Object} [stack] Tracks traversed source values and their merged
*  counterparts.
*/
function baseMerge(object, source, srcIndex, customizer, stack) {
	if (object === source) return;
	baseFor(source, function(srcValue, key) {
		stack || (stack = new Stack());
		if (isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
		else {
			var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
			if (newValue === void 0) newValue = srcValue;
			assignMergeValue(object, key, newValue);
		}
	}, keysIn);
}
var init__baseMerge = __esmMin((() => {
	init__Stack();
	init__assignMergeValue();
	init__baseFor();
	init__baseMergeDeep();
	init_isObject();
	init_keysIn();
	init__safeGet();
}));
//#endregion
//#region ../../node_modules/lodash-es/_customDefaultsMerge.js
/**
* Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
* objects into destination objects that are passed thru.
*
* @private
* @param {*} objValue The destination value.
* @param {*} srcValue The source value.
* @param {string} key The key of the property to merge.
* @param {Object} object The parent object of `objValue`.
* @param {Object} source The parent object of `srcValue`.
* @param {Object} [stack] Tracks traversed source values and their merged
*  counterparts.
* @returns {*} Returns the value to assign.
*/
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
	if (isObject(objValue) && isObject(srcValue)) {
		stack.set(srcValue, objValue);
		baseMerge(objValue, srcValue, void 0, customDefaultsMerge, stack);
		stack["delete"](srcValue);
	}
	return objValue;
}
var init__customDefaultsMerge = __esmMin((() => {
	init__baseMerge();
	init_isObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/mergeWith.js
var mergeWith;
var init_mergeWith = __esmMin((() => {
	init__baseMerge();
	init__createAssigner();
	mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
		baseMerge(object, source, srcIndex, customizer);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/defaultsDeep.js
var defaultsDeep;
var init_defaultsDeep = __esmMin((() => {
	init__apply();
	init__baseRest();
	init__customDefaultsMerge();
	init_mergeWith();
	defaultsDeep = baseRest(function(args) {
		args.push(void 0, customDefaultsMerge);
		return apply(mergeWith, void 0, args);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseDelay.js
/**
* The base implementation of `_.delay` and `_.defer` which accepts `args`
* to provide to `func`.
*
* @private
* @param {Function} func The function to delay.
* @param {number} wait The number of milliseconds to delay invocation.
* @param {Array} args The arguments to provide to `func`.
* @returns {number|Object} Returns the timer id or timeout object.
*/
function baseDelay(func, wait, args) {
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$5);
	return setTimeout(function() {
		func.apply(void 0, args);
	}, wait);
}
var FUNC_ERROR_TEXT$5;
var init__baseDelay = __esmMin((() => {
	FUNC_ERROR_TEXT$5 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/defer.js
var defer;
var init_defer = __esmMin((() => {
	init__baseDelay();
	init__baseRest();
	defer = baseRest(function(func, args) {
		return baseDelay(func, 1, args);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/delay.js
var delay;
var init_delay = __esmMin((() => {
	init__baseDelay();
	init__baseRest();
	init_toNumber();
	delay = baseRest(function(func, wait, args) {
		return baseDelay(func, toNumber(wait) || 0, args);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayIncludesWith.js
/**
* This function is like `arrayIncludes` except that it accepts a comparator.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @param {Function} comparator The comparator invoked per element.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludesWith(array, value, comparator) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (comparator(value, array[index])) return true;
	return false;
}
var init__arrayIncludesWith = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseDifference.js
/**
* The base implementation of methods like `_.difference` without support
* for excluding multiple arrays or iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Array} values The values to exclude.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new array of filtered values.
*/
function baseDifference(array, values, iteratee, comparator) {
	var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
	if (!length) return result;
	if (iteratee) values = arrayMap(values, baseUnary(iteratee));
	if (comparator) {
		includes = arrayIncludesWith;
		isCommon = false;
	} else if (values.length >= LARGE_ARRAY_SIZE$1) {
		includes = cacheHas;
		isCommon = false;
		values = new SetCache(values);
	}
	outer: while (++index < length) {
		var value = array[index], computed = iteratee == null ? value : iteratee(value);
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var valuesIndex = valuesLength;
			while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
			result.push(value);
		} else if (!includes(values, computed, comparator)) result.push(value);
	}
	return result;
}
var LARGE_ARRAY_SIZE$1;
var init__baseDifference = __esmMin((() => {
	init__SetCache();
	init__arrayIncludes();
	init__arrayIncludesWith();
	init__arrayMap();
	init__baseUnary();
	init__cacheHas();
	LARGE_ARRAY_SIZE$1 = 200;
}));
//#endregion
//#region ../../node_modules/lodash-es/difference.js
var difference;
var init_difference = __esmMin((() => {
	init__baseDifference();
	init__baseFlatten();
	init__baseRest();
	init_isArrayLikeObject();
	difference = baseRest(function(array, values) {
		return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/last.js
/**
* Gets the last element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to query.
* @returns {*} Returns the last element of `array`.
* @example
*
* _.last([1, 2, 3]);
* // => 3
*/
function last(array) {
	var length = array == null ? 0 : array.length;
	return length ? array[length - 1] : void 0;
}
var init_last = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/differenceBy.js
var differenceBy;
var init_differenceBy = __esmMin((() => {
	init__baseDifference();
	init__baseFlatten();
	init__baseIteratee();
	init__baseRest();
	init_isArrayLikeObject();
	init_last();
	differenceBy = baseRest(function(array, values) {
		var iteratee = last(values);
		if (isArrayLikeObject(iteratee)) iteratee = void 0;
		return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2)) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/differenceWith.js
var differenceWith;
var init_differenceWith = __esmMin((() => {
	init__baseDifference();
	init__baseFlatten();
	init__baseRest();
	init_isArrayLikeObject();
	init_last();
	differenceWith = baseRest(function(array, values) {
		var comparator = last(values);
		if (isArrayLikeObject(comparator)) comparator = void 0;
		return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), void 0, comparator) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/divide.js
var divide;
var init_divide = __esmMin((() => {
	init__createMathOperation();
	divide = createMathOperation(function(dividend, divisor) {
		return dividend / divisor;
	}, 1);
}));
//#endregion
//#region ../../node_modules/lodash-es/drop.js
/**
* Creates a slice of `array` with `n` elements dropped from the beginning.
*
* @static
* @memberOf _
* @since 0.5.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to drop.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.drop([1, 2, 3]);
* // => [2, 3]
*
* _.drop([1, 2, 3], 2);
* // => [3]
*
* _.drop([1, 2, 3], 5);
* // => []
*
* _.drop([1, 2, 3], 0);
* // => [1, 2, 3]
*/
function drop(array, n, guard) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	return baseSlice(array, n < 0 ? 0 : n, length);
}
var init_drop = __esmMin((() => {
	init__baseSlice();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/dropRight.js
/**
* Creates a slice of `array` with `n` elements dropped from the end.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to drop.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.dropRight([1, 2, 3]);
* // => [1, 2]
*
* _.dropRight([1, 2, 3], 2);
* // => [1]
*
* _.dropRight([1, 2, 3], 5);
* // => []
*
* _.dropRight([1, 2, 3], 0);
* // => [1, 2, 3]
*/
function dropRight(array, n, guard) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	n = length - n;
	return baseSlice(array, 0, n < 0 ? 0 : n);
}
var init_dropRight = __esmMin((() => {
	init__baseSlice();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseWhile.js
/**
* The base implementation of methods like `_.dropWhile` and `_.takeWhile`
* without support for iteratee shorthands.
*
* @private
* @param {Array} array The array to query.
* @param {Function} predicate The function invoked per iteration.
* @param {boolean} [isDrop] Specify dropping elements instead of taking them.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Array} Returns the slice of `array`.
*/
function baseWhile(array, predicate, isDrop, fromRight) {
	var length = array.length, index = fromRight ? length : -1;
	while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array));
	return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
}
var init__baseWhile = __esmMin((() => {
	init__baseSlice();
}));
//#endregion
//#region ../../node_modules/lodash-es/dropRightWhile.js
/**
* Creates a slice of `array` excluding elements dropped from the end.
* Elements are dropped until `predicate` returns falsey. The predicate is
* invoked with three arguments: (value, index, array).
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the slice of `array`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': true },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': false }
* ];
*
* _.dropRightWhile(users, function(o) { return !o.active; });
* // => objects for ['barney']
*
* // The `_.matches` iteratee shorthand.
* _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
* // => objects for ['barney', 'fred']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.dropRightWhile(users, ['active', false]);
* // => objects for ['barney']
*
* // The `_.property` iteratee shorthand.
* _.dropRightWhile(users, 'active');
* // => objects for ['barney', 'fred', 'pebbles']
*/
function dropRightWhile(array, predicate) {
	return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true, true) : [];
}
var init_dropRightWhile = __esmMin((() => {
	init__baseIteratee();
	init__baseWhile();
}));
//#endregion
//#region ../../node_modules/lodash-es/dropWhile.js
/**
* Creates a slice of `array` excluding elements dropped from the beginning.
* Elements are dropped until `predicate` returns falsey. The predicate is
* invoked with three arguments: (value, index, array).
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the slice of `array`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': false },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': true }
* ];
*
* _.dropWhile(users, function(o) { return !o.active; });
* // => objects for ['pebbles']
*
* // The `_.matches` iteratee shorthand.
* _.dropWhile(users, { 'user': 'barney', 'active': false });
* // => objects for ['fred', 'pebbles']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.dropWhile(users, ['active', false]);
* // => objects for ['pebbles']
*
* // The `_.property` iteratee shorthand.
* _.dropWhile(users, 'active');
* // => objects for ['barney', 'fred', 'pebbles']
*/
function dropWhile(array, predicate) {
	return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true) : [];
}
var init_dropWhile = __esmMin((() => {
	init__baseIteratee();
	init__baseWhile();
}));
//#endregion
//#region ../../node_modules/lodash-es/_castFunction.js
/**
* Casts `value` to `identity` if it's not a function.
*
* @private
* @param {*} value The value to inspect.
* @returns {Function} Returns cast function.
*/
function castFunction(value) {
	return typeof value == "function" ? value : identity;
}
var init__castFunction = __esmMin((() => {
	init_identity();
}));
//#endregion
//#region ../../node_modules/lodash-es/forEach.js
/**
* Iterates over elements of `collection` and invokes `iteratee` for each element.
* The iteratee is invoked with three arguments: (value, index|key, collection).
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* **Note:** As with other "Collections" methods, objects with a "length"
* property are iterated like arrays. To avoid this behavior use `_.forIn`
* or `_.forOwn` for object iteration.
*
* @static
* @memberOf _
* @since 0.1.0
* @alias each
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
* @see _.forEachRight
* @example
*
* _.forEach([1, 2], function(value) {
*   console.log(value);
* });
* // => Logs `1` then `2`.
*
* _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
*   console.log(key);
* });
* // => Logs 'a' then 'b' (iteration order is not guaranteed).
*/
function forEach(collection, iteratee) {
	return (isArray(collection) ? arrayEach : baseEach)(collection, castFunction(iteratee));
}
var init_forEach = __esmMin((() => {
	init__arrayEach();
	init__baseEach();
	init__castFunction();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/each.js
var init_each = __esmMin((() => {
	init_forEach();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayEachRight.js
/**
* A specialized version of `_.forEachRight` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns `array`.
*/
function arrayEachRight(array, iteratee) {
	var length = array == null ? 0 : array.length;
	while (length--) if (iteratee(array[length], length, array) === false) break;
	return array;
}
var init__arrayEachRight = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseForRight.js
var baseForRight;
var init__baseForRight = __esmMin((() => {
	init__createBaseFor();
	baseForRight = createBaseFor(true);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseForOwnRight.js
/**
* The base implementation of `_.forOwnRight` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwnRight(object, iteratee) {
	return object && baseForRight(object, iteratee, keys);
}
var init__baseForOwnRight = __esmMin((() => {
	init__baseForRight();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseEachRight.js
var baseEachRight;
var init__baseEachRight = __esmMin((() => {
	init__baseForOwnRight();
	init__createBaseEach();
	baseEachRight = createBaseEach(baseForOwnRight, true);
}));
//#endregion
//#region ../../node_modules/lodash-es/forEachRight.js
/**
* This method is like `_.forEach` except that it iterates over elements of
* `collection` from right to left.
*
* @static
* @memberOf _
* @since 2.0.0
* @alias eachRight
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
* @see _.forEach
* @example
*
* _.forEachRight([1, 2], function(value) {
*   console.log(value);
* });
* // => Logs `2` then `1`.
*/
function forEachRight(collection, iteratee) {
	return (isArray(collection) ? arrayEachRight : baseEachRight)(collection, castFunction(iteratee));
}
var init_forEachRight = __esmMin((() => {
	init__arrayEachRight();
	init__baseEachRight();
	init__castFunction();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/eachRight.js
var init_eachRight = __esmMin((() => {
	init_forEachRight();
}));
//#endregion
//#region ../../node_modules/lodash-es/endsWith.js
/**
* Checks if `string` ends with the given target string.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to inspect.
* @param {string} [target] The string to search for.
* @param {number} [position=string.length] The position to search up to.
* @returns {boolean} Returns `true` if `string` ends with `target`,
*  else `false`.
* @example
*
* _.endsWith('abc', 'c');
* // => true
*
* _.endsWith('abc', 'b');
* // => false
*
* _.endsWith('abc', 'b', 2);
* // => true
*/
function endsWith(string, target, position) {
	string = toString(string);
	target = baseToString(target);
	var length = string.length;
	position = position === void 0 ? length : baseClamp(toInteger(position), 0, length);
	var end = position;
	position -= target.length;
	return position >= 0 && string.slice(position, end) == target;
}
var init_endsWith = __esmMin((() => {
	init__baseClamp();
	init__baseToString();
	init_toInteger();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseToPairs.js
/**
* The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
* of key-value pairs for `object` corresponding to the property names of `props`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} props The property names to get values for.
* @returns {Object} Returns the key-value pairs.
*/
function baseToPairs(object, props) {
	return arrayMap(props, function(key) {
		return [key, object[key]];
	});
}
var init__baseToPairs = __esmMin((() => {
	init__arrayMap();
}));
//#endregion
//#region ../../node_modules/lodash-es/_setToPairs.js
/**
* Converts `set` to its value-value pairs.
*
* @private
* @param {Object} set The set to convert.
* @returns {Array} Returns the value-value pairs.
*/
function setToPairs(set) {
	var index = -1, result = Array(set.size);
	set.forEach(function(value) {
		result[++index] = [value, value];
	});
	return result;
}
var init__setToPairs = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_createToPairs.js
/**
* Creates a `_.toPairs` or `_.toPairsIn` function.
*
* @private
* @param {Function} keysFunc The function to get the keys of a given object.
* @returns {Function} Returns the new pairs function.
*/
function createToPairs(keysFunc) {
	return function(object) {
		var tag = _getTag_default(object);
		if (tag == mapTag$3) return mapToArray(object);
		if (tag == setTag$3) return setToPairs(object);
		return baseToPairs(object, keysFunc(object));
	};
}
var mapTag$3, setTag$3;
var init__createToPairs = __esmMin((() => {
	init__baseToPairs();
	init__getTag();
	init__mapToArray();
	init__setToPairs();
	mapTag$3 = "[object Map]", setTag$3 = "[object Set]";
}));
//#endregion
//#region ../../node_modules/lodash-es/toPairs.js
var toPairs;
var init_toPairs = __esmMin((() => {
	init__createToPairs();
	init_keys();
	toPairs = createToPairs(keys);
}));
//#endregion
//#region ../../node_modules/lodash-es/entries.js
var init_entries = __esmMin((() => {
	init_toPairs();
}));
//#endregion
//#region ../../node_modules/lodash-es/toPairsIn.js
var toPairsIn;
var init_toPairsIn = __esmMin((() => {
	init__createToPairs();
	init_keysIn();
	toPairsIn = createToPairs(keysIn);
}));
//#endregion
//#region ../../node_modules/lodash-es/entriesIn.js
var init_entriesIn = __esmMin((() => {
	init_toPairsIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_escapeHtmlChar.js
var escapeHtmlChar;
var init__escapeHtmlChar = __esmMin((() => {
	init__basePropertyOf();
	escapeHtmlChar = basePropertyOf({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/escape.js
/**
* Converts the characters "&", "<", ">", '"', and "'" in `string` to their
* corresponding HTML entities.
*
* **Note:** No other characters are escaped. To escape additional
* characters use a third-party library like [_he_](https://mths.be/he).
*
* Though the ">" character is escaped for symmetry, characters like
* ">" and "/" don't need escaping in HTML and have no special meaning
* unless they're part of a tag or unquoted attribute value. See
* [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
* (under "semi-related fun fact") for more details.
*
* When working with HTML you should always
* [quote attribute values](http://wonko.com/post/html-escaping) to reduce
* XSS vectors.
*
* @static
* @since 0.1.0
* @memberOf _
* @category String
* @param {string} [string=''] The string to escape.
* @returns {string} Returns the escaped string.
* @example
*
* _.escape('fred, barney, & pebbles');
* // => 'fred, barney, &amp; pebbles'
*/
function escape(string) {
	string = toString(string);
	return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}
var reUnescapedHtml, reHasUnescapedHtml;
var init_escape = __esmMin((() => {
	init__escapeHtmlChar();
	init_toString();
	reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
}));
//#endregion
//#region ../../node_modules/lodash-es/escapeRegExp.js
/**
* Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
* "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to escape.
* @returns {string} Returns the escaped string.
* @example
*
* _.escapeRegExp('[lodash](https://lodash.com/)');
* // => '\[lodash\]\(https://lodash\.com/\)'
*/
function escapeRegExp(string) {
	string = toString(string);
	return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
}
var reRegExpChar, reHasRegExpChar;
var init_escapeRegExp = __esmMin((() => {
	init_toString();
	reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayEvery.js
/**
* A specialized version of `_.every` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`.
*/
function arrayEvery(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (!predicate(array[index], index, array)) return false;
	return true;
}
var init__arrayEvery = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseEvery.js
/**
* The base implementation of `_.every` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`
*/
function baseEvery(collection, predicate) {
	var result = true;
	baseEach(collection, function(value, index, collection) {
		result = !!predicate(value, index, collection);
		return result;
	});
	return result;
}
var init__baseEvery = __esmMin((() => {
	init__baseEach();
}));
//#endregion
//#region ../../node_modules/lodash-es/every.js
/**
* Checks if `predicate` returns truthy for **all** elements of `collection`.
* Iteration is stopped once `predicate` returns falsey. The predicate is
* invoked with three arguments: (value, index|key, collection).
*
* **Note:** This method returns `true` for
* [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
* [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
* elements of empty collections.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`.
* @example
*
* _.every([true, 1, null, 'yes'], Boolean);
* // => false
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': false },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* // The `_.matches` iteratee shorthand.
* _.every(users, { 'user': 'barney', 'active': false });
* // => false
*
* // The `_.matchesProperty` iteratee shorthand.
* _.every(users, ['active', false]);
* // => true
*
* // The `_.property` iteratee shorthand.
* _.every(users, 'active');
* // => false
*/
function every(collection, predicate, guard) {
	var func = isArray(collection) ? arrayEvery : baseEvery;
	if (guard && isIterateeCall(collection, predicate, guard)) predicate = void 0;
	return func(collection, baseIteratee(predicate, 3));
}
var init_every = __esmMin((() => {
	init__arrayEvery();
	init__baseEvery();
	init__baseIteratee();
	init_isArray();
	init__isIterateeCall();
}));
//#endregion
//#region ../../node_modules/lodash-es/extend.js
var init_extend = __esmMin((() => {
	init_assignIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/extendWith.js
var init_extendWith = __esmMin((() => {
	init_assignInWith();
}));
//#endregion
//#region ../../node_modules/lodash-es/toLength.js
/**
* Converts `value` to an integer suitable for use as the length of an
* array-like object.
*
* **Note:** This method is based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted integer.
* @example
*
* _.toLength(3.2);
* // => 3
*
* _.toLength(Number.MIN_VALUE);
* // => 0
*
* _.toLength(Infinity);
* // => 4294967295
*
* _.toLength('3.2');
* // => 3
*/
function toLength(value) {
	return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH$3) : 0;
}
var MAX_ARRAY_LENGTH$3;
var init_toLength = __esmMin((() => {
	init__baseClamp();
	init_toInteger();
	MAX_ARRAY_LENGTH$3 = 4294967295;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFill.js
/**
* The base implementation of `_.fill` without an iteratee call guard.
*
* @private
* @param {Array} array The array to fill.
* @param {*} value The value to fill `array` with.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns `array`.
*/
function baseFill(array, value, start, end) {
	var length = array.length;
	start = toInteger(start);
	if (start < 0) start = -start > length ? 0 : length + start;
	end = end === void 0 || end > length ? length : toInteger(end);
	if (end < 0) end += length;
	end = start > end ? 0 : toLength(end);
	while (start < end) array[start++] = value;
	return array;
}
var init__baseFill = __esmMin((() => {
	init_toInteger();
	init_toLength();
}));
//#endregion
//#region ../../node_modules/lodash-es/fill.js
/**
* Fills elements of `array` with `value` from `start` up to, but not
* including, `end`.
*
* **Note:** This method mutates `array`.
*
* @static
* @memberOf _
* @since 3.2.0
* @category Array
* @param {Array} array The array to fill.
* @param {*} value The value to fill `array` with.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns `array`.
* @example
*
* var array = [1, 2, 3];
*
* _.fill(array, 'a');
* console.log(array);
* // => ['a', 'a', 'a']
*
* _.fill(Array(3), 2);
* // => [2, 2, 2]
*
* _.fill([4, 6, 8, 10], '*', 1, 3);
* // => [4, '*', '*', 10]
*/
function fill(array, value, start, end) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
		start = 0;
		end = length;
	}
	return baseFill(array, value, start, end);
}
var init_fill = __esmMin((() => {
	init__baseFill();
	init__isIterateeCall();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFilter.js
/**
* The base implementation of `_.filter` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function baseFilter(collection, predicate) {
	var result = [];
	baseEach(collection, function(value, index, collection) {
		if (predicate(value, index, collection)) result.push(value);
	});
	return result;
}
var init__baseFilter = __esmMin((() => {
	init__baseEach();
}));
//#endregion
//#region ../../node_modules/lodash-es/filter.js
/**
* Iterates over elements of `collection`, returning an array of all elements
* `predicate` returns truthy for. The predicate is invoked with three
* arguments: (value, index|key, collection).
*
* **Note:** Unlike `_.remove`, this method returns a new array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
* @see _.reject
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': true },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* _.filter(users, function(o) { return !o.active; });
* // => objects for ['fred']
*
* // The `_.matches` iteratee shorthand.
* _.filter(users, { 'age': 36, 'active': true });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.filter(users, ['active', false]);
* // => objects for ['fred']
*
* // The `_.property` iteratee shorthand.
* _.filter(users, 'active');
* // => objects for ['barney']
*
* // Combining several predicates using `_.overEvery` or `_.overSome`.
* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
* // => objects for ['fred', 'barney']
*/
function filter(collection, predicate) {
	return (isArray(collection) ? arrayFilter : baseFilter)(collection, baseIteratee(predicate, 3));
}
var init_filter = __esmMin((() => {
	init__arrayFilter();
	init__baseFilter();
	init__baseIteratee();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createFind.js
/**
* Creates a `_.find` or `_.findLast` function.
*
* @private
* @param {Function} findIndexFunc The function to find the collection index.
* @returns {Function} Returns the new find function.
*/
function createFind(findIndexFunc) {
	return function(collection, predicate, fromIndex) {
		var iterable = Object(collection);
		if (!isArrayLike(collection)) {
			var iteratee = baseIteratee(predicate, 3);
			collection = keys(collection);
			predicate = function(key) {
				return iteratee(iterable[key], key, iterable);
			};
		}
		var index = findIndexFunc(collection, predicate, fromIndex);
		return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
	};
}
var init__createFind = __esmMin((() => {
	init__baseIteratee();
	init_isArrayLike();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/findIndex.js
/**
* This method is like `_.find` except that it returns the index of the first
* element `predicate` returns truthy for instead of the element itself.
*
* @static
* @memberOf _
* @since 1.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param {number} [fromIndex=0] The index to search from.
* @returns {number} Returns the index of the found element, else `-1`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': false },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': true }
* ];
*
* _.findIndex(users, function(o) { return o.user == 'barney'; });
* // => 0
*
* // The `_.matches` iteratee shorthand.
* _.findIndex(users, { 'user': 'fred', 'active': false });
* // => 1
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findIndex(users, ['active', false]);
* // => 0
*
* // The `_.property` iteratee shorthand.
* _.findIndex(users, 'active');
* // => 2
*/
function findIndex(array, predicate, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = fromIndex == null ? 0 : toInteger(fromIndex);
	if (index < 0) index = nativeMax$10(length + index, 0);
	return baseFindIndex(array, baseIteratee(predicate, 3), index);
}
var nativeMax$10;
var init_findIndex = __esmMin((() => {
	init__baseFindIndex();
	init__baseIteratee();
	init_toInteger();
	nativeMax$10 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/find.js
var find;
var init_find = __esmMin((() => {
	init__createFind();
	init_findIndex();
	find = createFind(findIndex);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFindKey.js
/**
* The base implementation of methods like `_.findKey` and `_.findLastKey`,
* without support for iteratee shorthands, which iterates over `collection`
* using `eachFunc`.
*
* @private
* @param {Array|Object} collection The collection to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {Function} eachFunc The function to iterate over `collection`.
* @returns {*} Returns the found element or its key, else `undefined`.
*/
function baseFindKey(collection, predicate, eachFunc) {
	var result;
	eachFunc(collection, function(value, key, collection) {
		if (predicate(value, key, collection)) {
			result = key;
			return false;
		}
	});
	return result;
}
var init__baseFindKey = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/findKey.js
/**
* This method is like `_.find` except that it returns the key of the first
* element `predicate` returns truthy for instead of the element itself.
*
* @static
* @memberOf _
* @since 1.1.0
* @category Object
* @param {Object} object The object to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {string|undefined} Returns the key of the matched element,
*  else `undefined`.
* @example
*
* var users = {
*   'barney':  { 'age': 36, 'active': true },
*   'fred':    { 'age': 40, 'active': false },
*   'pebbles': { 'age': 1,  'active': true }
* };
*
* _.findKey(users, function(o) { return o.age < 40; });
* // => 'barney' (iteration order is not guaranteed)
*
* // The `_.matches` iteratee shorthand.
* _.findKey(users, { 'age': 1, 'active': true });
* // => 'pebbles'
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findKey(users, ['active', false]);
* // => 'fred'
*
* // The `_.property` iteratee shorthand.
* _.findKey(users, 'active');
* // => 'barney'
*/
function findKey(object, predicate) {
	return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}
var init_findKey = __esmMin((() => {
	init__baseFindKey();
	init__baseForOwn();
	init__baseIteratee();
}));
//#endregion
//#region ../../node_modules/lodash-es/findLastIndex.js
/**
* This method is like `_.findIndex` except that it iterates over elements
* of `collection` from right to left.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param {number} [fromIndex=array.length-1] The index to search from.
* @returns {number} Returns the index of the found element, else `-1`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': true },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': false }
* ];
*
* _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
* // => 2
*
* // The `_.matches` iteratee shorthand.
* _.findLastIndex(users, { 'user': 'barney', 'active': true });
* // => 0
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findLastIndex(users, ['active', false]);
* // => 2
*
* // The `_.property` iteratee shorthand.
* _.findLastIndex(users, 'active');
* // => 0
*/
function findLastIndex(array, predicate, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = length - 1;
	if (fromIndex !== void 0) {
		index = toInteger(fromIndex);
		index = fromIndex < 0 ? nativeMax$9(length + index, 0) : nativeMin$10(index, length - 1);
	}
	return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}
var nativeMax$9, nativeMin$10;
var init_findLastIndex = __esmMin((() => {
	init__baseFindIndex();
	init__baseIteratee();
	init_toInteger();
	nativeMax$9 = Math.max, nativeMin$10 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/findLast.js
var findLast;
var init_findLast = __esmMin((() => {
	init__createFind();
	init_findLastIndex();
	findLast = createFind(findLastIndex);
}));
//#endregion
//#region ../../node_modules/lodash-es/findLastKey.js
/**
* This method is like `_.findKey` except that it iterates over elements of
* a collection in the opposite order.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Object
* @param {Object} object The object to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {string|undefined} Returns the key of the matched element,
*  else `undefined`.
* @example
*
* var users = {
*   'barney':  { 'age': 36, 'active': true },
*   'fred':    { 'age': 40, 'active': false },
*   'pebbles': { 'age': 1,  'active': true }
* };
*
* _.findLastKey(users, function(o) { return o.age < 40; });
* // => returns 'pebbles' assuming `_.findKey` returns 'barney'
*
* // The `_.matches` iteratee shorthand.
* _.findLastKey(users, { 'age': 36, 'active': true });
* // => 'barney'
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findLastKey(users, ['active', false]);
* // => 'fred'
*
* // The `_.property` iteratee shorthand.
* _.findLastKey(users, 'active');
* // => 'pebbles'
*/
function findLastKey(object, predicate) {
	return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}
var init_findLastKey = __esmMin((() => {
	init__baseFindKey();
	init__baseForOwnRight();
	init__baseIteratee();
}));
//#endregion
//#region ../../node_modules/lodash-es/head.js
/**
* Gets the first element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @alias first
* @category Array
* @param {Array} array The array to query.
* @returns {*} Returns the first element of `array`.
* @example
*
* _.head([1, 2, 3]);
* // => 1
*
* _.head([]);
* // => undefined
*/
function head(array) {
	return array && array.length ? array[0] : void 0;
}
var init_head = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/first.js
var init_first = __esmMin((() => {
	init_head();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMap.js
/**
* The base implementation of `_.map` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function baseMap(collection, iteratee) {
	var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
	baseEach(collection, function(value, key, collection) {
		result[++index] = iteratee(value, key, collection);
	});
	return result;
}
var init__baseMap = __esmMin((() => {
	init__baseEach();
	init_isArrayLike();
}));
//#endregion
//#region ../../node_modules/lodash-es/map.js
/**
* Creates an array of values by running each element in `collection` thru
* `iteratee`. The iteratee is invoked with three arguments:
* (value, index|key, collection).
*
* Many lodash methods are guarded to work as iteratees for methods like
* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
*
* The guarded methods are:
* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* _.map([4, 8], square);
* // => [16, 64]
*
* _.map({ 'a': 4, 'b': 8 }, square);
* // => [16, 64] (iteration order is not guaranteed)
*
* var users = [
*   { 'user': 'barney' },
*   { 'user': 'fred' }
* ];
*
* // The `_.property` iteratee shorthand.
* _.map(users, 'user');
* // => ['barney', 'fred']
*/
function map(collection, iteratee) {
	return (isArray(collection) ? arrayMap : baseMap)(collection, baseIteratee(iteratee, 3));
}
var init_map = __esmMin((() => {
	init__arrayMap();
	init__baseIteratee();
	init__baseMap();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/flatMap.js
/**
* Creates a flattened array of values by running each element in `collection`
* thru `iteratee` and flattening the mapped results. The iteratee is invoked
* with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [n, n];
* }
*
* _.flatMap([1, 2], duplicate);
* // => [1, 1, 2, 2]
*/
function flatMap(collection, iteratee) {
	return baseFlatten(map(collection, iteratee), 1);
}
var init_flatMap = __esmMin((() => {
	init__baseFlatten();
	init_map();
}));
//#endregion
//#region ../../node_modules/lodash-es/flatMapDeep.js
/**
* This method is like `_.flatMap` except that it recursively flattens the
* mapped results.
*
* @static
* @memberOf _
* @since 4.7.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [[[n, n]]];
* }
*
* _.flatMapDeep([1, 2], duplicate);
* // => [1, 1, 2, 2]
*/
function flatMapDeep(collection, iteratee) {
	return baseFlatten(map(collection, iteratee), INFINITY$1);
}
var INFINITY$1;
var init_flatMapDeep = __esmMin((() => {
	init__baseFlatten();
	init_map();
	INFINITY$1 = Infinity;
}));
//#endregion
//#region ../../node_modules/lodash-es/flatMapDepth.js
/**
* This method is like `_.flatMap` except that it recursively flattens the
* mapped results up to `depth` times.
*
* @static
* @memberOf _
* @since 4.7.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @param {number} [depth=1] The maximum recursion depth.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [[[n, n]]];
* }
*
* _.flatMapDepth([1, 2], duplicate, 2);
* // => [[1, 1], [2, 2]]
*/
function flatMapDepth(collection, iteratee, depth) {
	depth = depth === void 0 ? 1 : toInteger(depth);
	return baseFlatten(map(collection, iteratee), depth);
}
var init_flatMapDepth = __esmMin((() => {
	init__baseFlatten();
	init_map();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/flattenDeep.js
/**
* Recursively flattens `array`.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to flatten.
* @returns {Array} Returns the new flattened array.
* @example
*
* _.flattenDeep([1, [2, [3, [4]], 5]]);
* // => [1, 2, 3, 4, 5]
*/
function flattenDeep(array) {
	return (array == null ? 0 : array.length) ? baseFlatten(array, INFINITY) : [];
}
var INFINITY;
var init_flattenDeep = __esmMin((() => {
	init__baseFlatten();
	INFINITY = Infinity;
}));
//#endregion
//#region ../../node_modules/lodash-es/flattenDepth.js
/**
* Recursively flatten `array` up to `depth` times.
*
* @static
* @memberOf _
* @since 4.4.0
* @category Array
* @param {Array} array The array to flatten.
* @param {number} [depth=1] The maximum recursion depth.
* @returns {Array} Returns the new flattened array.
* @example
*
* var array = [1, [2, [3, [4]], 5]];
*
* _.flattenDepth(array, 1);
* // => [1, 2, [3, [4]], 5]
*
* _.flattenDepth(array, 2);
* // => [1, 2, 3, [4], 5]
*/
function flattenDepth(array, depth) {
	if (!(array == null ? 0 : array.length)) return [];
	depth = depth === void 0 ? 1 : toInteger(depth);
	return baseFlatten(array, depth);
}
var init_flattenDepth = __esmMin((() => {
	init__baseFlatten();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/flip.js
/**
* Creates a function that invokes `func` with arguments reversed.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Function
* @param {Function} func The function to flip arguments for.
* @returns {Function} Returns the new flipped function.
* @example
*
* var flipped = _.flip(function() {
*   return _.toArray(arguments);
* });
*
* flipped('a', 'b', 'c', 'd');
* // => ['d', 'c', 'b', 'a']
*/
function flip(func) {
	return createWrap(func, WRAP_FLIP_FLAG);
}
var WRAP_FLIP_FLAG;
var init_flip = __esmMin((() => {
	init__createWrap();
	WRAP_FLIP_FLAG = 512;
}));
//#endregion
//#region ../../node_modules/lodash-es/floor.js
var floor;
var init_floor = __esmMin((() => {
	init__createRound();
	floor = createRound("floor");
}));
//#endregion
//#region ../../node_modules/lodash-es/_createFlow.js
/**
* Creates a `_.flow` or `_.flowRight` function.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new flow function.
*/
function createFlow(fromRight) {
	return flatRest(function(funcs) {
		var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
		if (fromRight) funcs.reverse();
		while (index--) {
			var func = funcs[index];
			if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$4);
			if (prereq && !wrapper && getFuncName(func) == "wrapper") var wrapper = new LodashWrapper([], true);
		}
		index = wrapper ? index : length;
		while (++index < length) {
			func = funcs[index];
			var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : void 0;
			if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG$1 | WRAP_REARG_FLAG$1) && !data[4].length && data[9] == 1) wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
			else wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
		}
		return function() {
			var args = arguments, value = args[0];
			if (wrapper && args.length == 1 && isArray(value)) return wrapper.plant(value).value();
			var index = 0, result = length ? funcs[index].apply(this, args) : value;
			while (++index < length) result = funcs[index].call(this, result);
			return result;
		};
	});
}
var FUNC_ERROR_TEXT$4, WRAP_CURRY_FLAG, WRAP_PARTIAL_FLAG$1, WRAP_ARY_FLAG, WRAP_REARG_FLAG$1;
var init__createFlow = __esmMin((() => {
	init__LodashWrapper();
	init__flatRest();
	init__getData();
	init__getFuncName();
	init_isArray();
	init__isLaziable();
	FUNC_ERROR_TEXT$4 = "Expected a function";
	WRAP_CURRY_FLAG = 8, WRAP_PARTIAL_FLAG$1 = 32, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG$1 = 256;
}));
//#endregion
//#region ../../node_modules/lodash-es/flow.js
var flow;
var init_flow = __esmMin((() => {
	init__createFlow();
	flow = createFlow();
}));
//#endregion
//#region ../../node_modules/lodash-es/flowRight.js
var flowRight;
var init_flowRight = __esmMin((() => {
	init__createFlow();
	flowRight = createFlow(true);
}));
//#endregion
//#region ../../node_modules/lodash-es/forIn.js
/**
* Iterates over own and inherited enumerable string keyed properties of an
* object and invokes `iteratee` for each property. The iteratee is invoked
* with three arguments: (value, key, object). Iteratee functions may exit
* iteration early by explicitly returning `false`.
*
* @static
* @memberOf _
* @since 0.3.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns `object`.
* @see _.forInRight
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.forIn(new Foo, function(value, key) {
*   console.log(key);
* });
* // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
*/
function forIn(object, iteratee) {
	return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}
var init_forIn = __esmMin((() => {
	init__baseFor();
	init__castFunction();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/forInRight.js
/**
* This method is like `_.forIn` except that it iterates over properties of
* `object` in the opposite order.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns `object`.
* @see _.forIn
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.forInRight(new Foo, function(value, key) {
*   console.log(key);
* });
* // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
*/
function forInRight(object, iteratee) {
	return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}
var init_forInRight = __esmMin((() => {
	init__baseForRight();
	init__castFunction();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/forOwn.js
/**
* Iterates over own enumerable string keyed properties of an object and
* invokes `iteratee` for each property. The iteratee is invoked with three
* arguments: (value, key, object). Iteratee functions may exit iteration
* early by explicitly returning `false`.
*
* @static
* @memberOf _
* @since 0.3.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns `object`.
* @see _.forOwnRight
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.forOwn(new Foo, function(value, key) {
*   console.log(key);
* });
* // => Logs 'a' then 'b' (iteration order is not guaranteed).
*/
function forOwn(object, iteratee) {
	return object && baseForOwn(object, castFunction(iteratee));
}
var init_forOwn = __esmMin((() => {
	init__baseForOwn();
	init__castFunction();
}));
//#endregion
//#region ../../node_modules/lodash-es/forOwnRight.js
/**
* This method is like `_.forOwn` except that it iterates over properties of
* `object` in the opposite order.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns `object`.
* @see _.forOwn
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.forOwnRight(new Foo, function(value, key) {
*   console.log(key);
* });
* // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
*/
function forOwnRight(object, iteratee) {
	return object && baseForOwnRight(object, castFunction(iteratee));
}
var init_forOwnRight = __esmMin((() => {
	init__baseForOwnRight();
	init__castFunction();
}));
//#endregion
//#region ../../node_modules/lodash-es/fromPairs.js
/**
* The inverse of `_.toPairs`; this method returns an object composed
* from key-value `pairs`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} pairs The key-value pairs.
* @returns {Object} Returns the new object.
* @example
*
* _.fromPairs([['a', 1], ['b', 2]]);
* // => { 'a': 1, 'b': 2 }
*/
function fromPairs(pairs) {
	var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
	while (++index < length) {
		var pair = pairs[index];
		baseAssignValue(result, pair[0], pair[1]);
	}
	return result;
}
var init_fromPairs = __esmMin((() => {
	init__baseAssignValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseFunctions.js
/**
* The base implementation of `_.functions` which creates an array of
* `object` function property names filtered from `props`.
*
* @private
* @param {Object} object The object to inspect.
* @param {Array} props The property names to filter.
* @returns {Array} Returns the function names.
*/
function baseFunctions(object, props) {
	return arrayFilter(props, function(key) {
		return isFunction(object[key]);
	});
}
var init__baseFunctions = __esmMin((() => {
	init__arrayFilter();
	init_isFunction();
}));
//#endregion
//#region ../../node_modules/lodash-es/functions.js
/**
* Creates an array of function property names from own enumerable properties
* of `object`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to inspect.
* @returns {Array} Returns the function names.
* @see _.functionsIn
* @example
*
* function Foo() {
*   this.a = _.constant('a');
*   this.b = _.constant('b');
* }
*
* Foo.prototype.c = _.constant('c');
*
* _.functions(new Foo);
* // => ['a', 'b']
*/
function functions(object) {
	return object == null ? [] : baseFunctions(object, keys(object));
}
var init_functions = __esmMin((() => {
	init__baseFunctions();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/functionsIn.js
/**
* Creates an array of function property names from own and inherited
* enumerable properties of `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to inspect.
* @returns {Array} Returns the function names.
* @see _.functions
* @example
*
* function Foo() {
*   this.a = _.constant('a');
*   this.b = _.constant('b');
* }
*
* Foo.prototype.c = _.constant('c');
*
* _.functionsIn(new Foo);
* // => ['a', 'b', 'c']
*/
function functionsIn(object) {
	return object == null ? [] : baseFunctions(object, keysIn(object));
}
var init_functionsIn = __esmMin((() => {
	init__baseFunctions();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/groupBy.js
var hasOwnProperty$7, groupBy;
var init_groupBy = __esmMin((() => {
	init__baseAssignValue();
	init__createAggregator();
	hasOwnProperty$7 = Object.prototype.hasOwnProperty;
	groupBy = createAggregator(function(result, value, key) {
		if (hasOwnProperty$7.call(result, key)) result[key].push(value);
		else baseAssignValue(result, key, [value]);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseGt.js
/**
* The base implementation of `_.gt` which doesn't coerce arguments.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if `value` is greater than `other`,
*  else `false`.
*/
function baseGt(value, other) {
	return value > other;
}
var init__baseGt = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_createRelationalOperation.js
/**
* Creates a function that performs a relational operation on two values.
*
* @private
* @param {Function} operator The function to perform the operation.
* @returns {Function} Returns the new relational operation function.
*/
function createRelationalOperation(operator) {
	return function(value, other) {
		if (!(typeof value == "string" && typeof other == "string")) {
			value = toNumber(value);
			other = toNumber(other);
		}
		return operator(value, other);
	};
}
var init__createRelationalOperation = __esmMin((() => {
	init_toNumber();
}));
//#endregion
//#region ../../node_modules/lodash-es/gt.js
var gt;
var init_gt = __esmMin((() => {
	init__baseGt();
	init__createRelationalOperation();
	gt = createRelationalOperation(baseGt);
}));
//#endregion
//#region ../../node_modules/lodash-es/gte.js
var gte;
var init_gte = __esmMin((() => {
	init__createRelationalOperation();
	gte = createRelationalOperation(function(value, other) {
		return value >= other;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseHas.js
/**
* The base implementation of `_.has` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHas(object, key) {
	return object != null && hasOwnProperty$6.call(object, key);
}
var hasOwnProperty$6;
var init__baseHas = __esmMin((() => {
	hasOwnProperty$6 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/has.js
/**
* Checks if `path` is a direct property of `object`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = { 'a': { 'b': 2 } };
* var other = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.has(object, 'a');
* // => true
*
* _.has(object, 'a.b');
* // => true
*
* _.has(object, ['a', 'b']);
* // => true
*
* _.has(other, 'a');
* // => false
*/
function has(object, path) {
	return object != null && hasPath(object, path, baseHas);
}
var init_has = __esmMin((() => {
	init__baseHas();
	init__hasPath();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseInRange.js
/**
* The base implementation of `_.inRange` which doesn't coerce arguments.
*
* @private
* @param {number} number The number to check.
* @param {number} start The start of the range.
* @param {number} end The end of the range.
* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
*/
function baseInRange(number, start, end) {
	return number >= nativeMin$9(start, end) && number < nativeMax$8(start, end);
}
var nativeMax$8, nativeMin$9;
var init__baseInRange = __esmMin((() => {
	nativeMax$8 = Math.max, nativeMin$9 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/inRange.js
/**
* Checks if `n` is between `start` and up to, but not including, `end`. If
* `end` is not specified, it's set to `start` with `start` then set to `0`.
* If `start` is greater than `end` the params are swapped to support
* negative ranges.
*
* @static
* @memberOf _
* @since 3.3.0
* @category Number
* @param {number} number The number to check.
* @param {number} [start=0] The start of the range.
* @param {number} end The end of the range.
* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
* @see _.range, _.rangeRight
* @example
*
* _.inRange(3, 2, 4);
* // => true
*
* _.inRange(4, 8);
* // => true
*
* _.inRange(4, 2);
* // => false
*
* _.inRange(2, 2);
* // => false
*
* _.inRange(1.2, 2);
* // => true
*
* _.inRange(5.2, 4);
* // => false
*
* _.inRange(-3, -2, -6);
* // => true
*/
function inRange(number, start, end) {
	start = toFinite(start);
	if (end === void 0) {
		end = start;
		start = 0;
	} else end = toFinite(end);
	number = toNumber(number);
	return baseInRange(number, start, end);
}
var init_inRange = __esmMin((() => {
	init__baseInRange();
	init_toFinite();
	init_toNumber();
}));
//#endregion
//#region ../../node_modules/lodash-es/isString.js
/**
* Checks if `value` is classified as a `String` primitive or object.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a string, else `false`.
* @example
*
* _.isString('abc');
* // => true
*
* _.isString(1);
* // => false
*/
function isString(value) {
	return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
var stringTag;
var init_isString = __esmMin((() => {
	init__baseGetTag();
	init_isArray();
	init_isObjectLike();
	stringTag = "[object String]";
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseValues.js
/**
* The base implementation of `_.values` and `_.valuesIn` which creates an
* array of `object` property values corresponding to the property names
* of `props`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} props The property names to get values for.
* @returns {Object} Returns the array of property values.
*/
function baseValues(object, props) {
	return arrayMap(props, function(key) {
		return object[key];
	});
}
var init__baseValues = __esmMin((() => {
	init__arrayMap();
}));
//#endregion
//#region ../../node_modules/lodash-es/values.js
/**
* Creates an array of the own enumerable string keyed property values of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property values.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.values(new Foo);
* // => [1, 2] (iteration order is not guaranteed)
*
* _.values('hi');
* // => ['h', 'i']
*/
function values(object) {
	return object == null ? [] : baseValues(object, keys(object));
}
var init_values = __esmMin((() => {
	init__baseValues();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/includes.js
/**
* Checks if `value` is in `collection`. If `collection` is a string, it's
* checked for a substring of `value`, otherwise
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* is used for equality comparisons. If `fromIndex` is negative, it's used as
* the offset from the end of `collection`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object|string} collection The collection to inspect.
* @param {*} value The value to search for.
* @param {number} [fromIndex=0] The index to search from.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
* @example
*
* _.includes([1, 2, 3], 1);
* // => true
*
* _.includes([1, 2, 3], 1, 2);
* // => false
*
* _.includes({ 'a': 1, 'b': 2 }, 1);
* // => true
*
* _.includes('abcd', 'bc');
* // => true
*/
function includes(collection, value, fromIndex, guard) {
	collection = isArrayLike(collection) ? collection : values(collection);
	fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
	var length = collection.length;
	if (fromIndex < 0) fromIndex = nativeMax$7(length + fromIndex, 0);
	return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
var nativeMax$7;
var init_includes = __esmMin((() => {
	init__baseIndexOf();
	init_isArrayLike();
	init_isString();
	init_toInteger();
	init_values();
	nativeMax$7 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/indexOf.js
/**
* Gets the index at which the first occurrence of `value` is found in `array`
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons. If `fromIndex` is negative, it's used as the
* offset from the end of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} [fromIndex=0] The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
* @example
*
* _.indexOf([1, 2, 1, 2], 2);
* // => 1
*
* // Search from the `fromIndex`.
* _.indexOf([1, 2, 1, 2], 2, 2);
* // => 3
*/
function indexOf(array, value, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = fromIndex == null ? 0 : toInteger(fromIndex);
	if (index < 0) index = nativeMax$6(length + index, 0);
	return baseIndexOf(array, value, index);
}
var nativeMax$6;
var init_indexOf = __esmMin((() => {
	init__baseIndexOf();
	init_toInteger();
	nativeMax$6 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/initial.js
/**
* Gets all but the last element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to query.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.initial([1, 2, 3]);
* // => [1, 2]
*/
function initial(array) {
	return (array == null ? 0 : array.length) ? baseSlice(array, 0, -1) : [];
}
var init_initial = __esmMin((() => {
	init__baseSlice();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIntersection.js
/**
* The base implementation of methods like `_.intersection`, without support
* for iteratee shorthands, that accepts an array of arrays to inspect.
*
* @private
* @param {Array} arrays The arrays to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new array of shared values.
*/
function baseIntersection(arrays, iteratee, comparator) {
	var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
	while (othIndex--) {
		var array = arrays[othIndex];
		if (othIndex && iteratee) array = arrayMap(array, baseUnary(iteratee));
		maxLength = nativeMin$8(array.length, maxLength);
		caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : void 0;
	}
	array = arrays[0];
	var index = -1, seen = caches[0];
	outer: while (++index < length && result.length < maxLength) {
		var value = array[index], computed = iteratee ? iteratee(value) : value;
		value = comparator || value !== 0 ? value : 0;
		if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
			othIndex = othLength;
			while (--othIndex) {
				var cache = caches[othIndex];
				if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) continue outer;
			}
			if (seen) seen.push(computed);
			result.push(value);
		}
	}
	return result;
}
var nativeMin$8;
var init__baseIntersection = __esmMin((() => {
	init__SetCache();
	init__arrayIncludes();
	init__arrayIncludesWith();
	init__arrayMap();
	init__baseUnary();
	init__cacheHas();
	nativeMin$8 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/_castArrayLikeObject.js
/**
* Casts `value` to an empty array if it's not an array like object.
*
* @private
* @param {*} value The value to inspect.
* @returns {Array|Object} Returns the cast array-like object.
*/
function castArrayLikeObject(value) {
	return isArrayLikeObject(value) ? value : [];
}
var init__castArrayLikeObject = __esmMin((() => {
	init_isArrayLikeObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/intersection.js
var intersection;
var init_intersection = __esmMin((() => {
	init__arrayMap();
	init__baseIntersection();
	init__baseRest();
	init__castArrayLikeObject();
	intersection = baseRest(function(arrays) {
		var mapped = arrayMap(arrays, castArrayLikeObject);
		return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/intersectionBy.js
var intersectionBy;
var init_intersectionBy = __esmMin((() => {
	init__arrayMap();
	init__baseIntersection();
	init__baseIteratee();
	init__baseRest();
	init__castArrayLikeObject();
	init_last();
	intersectionBy = baseRest(function(arrays) {
		var iteratee = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
		if (iteratee === last(mapped)) iteratee = void 0;
		else mapped.pop();
		return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee, 2)) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/intersectionWith.js
var intersectionWith;
var init_intersectionWith = __esmMin((() => {
	init__arrayMap();
	init__baseIntersection();
	init__baseRest();
	init__castArrayLikeObject();
	init_last();
	intersectionWith = baseRest(function(arrays) {
		var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
		comparator = typeof comparator == "function" ? comparator : void 0;
		if (comparator) mapped.pop();
		return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, void 0, comparator) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseInverter.js
/**
* The base implementation of `_.invert` and `_.invertBy` which inverts
* `object` with values transformed by `iteratee` and set by `setter`.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} setter The function to set `accumulator` values.
* @param {Function} iteratee The iteratee to transform values.
* @param {Object} accumulator The initial inverted object.
* @returns {Function} Returns `accumulator`.
*/
function baseInverter(object, setter, iteratee, accumulator) {
	baseForOwn(object, function(value, key, object) {
		setter(accumulator, iteratee(value), key, object);
	});
	return accumulator;
}
var init__baseInverter = __esmMin((() => {
	init__baseForOwn();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createInverter.js
/**
* Creates a function like `_.invertBy`.
*
* @private
* @param {Function} setter The function to set accumulator values.
* @param {Function} toIteratee The function to resolve iteratees.
* @returns {Function} Returns the new inverter function.
*/
function createInverter(setter, toIteratee) {
	return function(object, iteratee) {
		return baseInverter(object, setter, toIteratee(iteratee), {});
	};
}
var init__createInverter = __esmMin((() => {
	init__baseInverter();
}));
//#endregion
//#region ../../node_modules/lodash-es/invert.js
var nativeObjectToString$1, invert;
var init_invert = __esmMin((() => {
	init_constant();
	init__createInverter();
	init_identity();
	nativeObjectToString$1 = Object.prototype.toString;
	invert = createInverter(function(result, value, key) {
		if (value != null && typeof value.toString != "function") value = nativeObjectToString$1.call(value);
		result[value] = key;
	}, constant(identity));
}));
//#endregion
//#region ../../node_modules/lodash-es/invertBy.js
var objectProto$1, hasOwnProperty$5, nativeObjectToString, invertBy;
var init_invertBy = __esmMin((() => {
	init__baseIteratee();
	init__createInverter();
	objectProto$1 = Object.prototype;
	hasOwnProperty$5 = objectProto$1.hasOwnProperty;
	nativeObjectToString = objectProto$1.toString;
	invertBy = createInverter(function(result, value, key) {
		if (value != null && typeof value.toString != "function") value = nativeObjectToString.call(value);
		if (hasOwnProperty$5.call(result, value)) result[value].push(key);
		else result[value] = [key];
	}, baseIteratee);
}));
//#endregion
//#region ../../node_modules/lodash-es/_parent.js
/**
* Gets the parent value at `path` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} path The path to get the parent value of.
* @returns {*} Returns the parent value.
*/
function parent(object, path) {
	return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}
var init__parent = __esmMin((() => {
	init__baseGet();
	init__baseSlice();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseInvoke.js
/**
* The base implementation of `_.invoke` without support for individual
* method arguments.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path of the method to invoke.
* @param {Array} args The arguments to invoke the method with.
* @returns {*} Returns the result of the invoked method.
*/
function baseInvoke(object, path, args) {
	path = castPath(path, object);
	object = parent(object, path);
	var func = object == null ? object : object[toKey(last(path))];
	return func == null ? void 0 : apply(func, object, args);
}
var init__baseInvoke = __esmMin((() => {
	init__apply();
	init__castPath();
	init_last();
	init__parent();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/invoke.js
var invoke;
var init_invoke = __esmMin((() => {
	init__baseInvoke();
	init__baseRest();
	invoke = baseRest(baseInvoke);
}));
//#endregion
//#region ../../node_modules/lodash-es/invokeMap.js
var invokeMap;
var init_invokeMap = __esmMin((() => {
	init__apply();
	init__baseEach();
	init__baseInvoke();
	init__baseRest();
	init_isArrayLike();
	invokeMap = baseRest(function(collection, path, args) {
		var index = -1, isFunc = typeof path == "function", result = isArrayLike(collection) ? Array(collection.length) : [];
		baseEach(collection, function(value) {
			result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
		});
		return result;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsArrayBuffer.js
/**
* The base implementation of `_.isArrayBuffer` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
*/
function baseIsArrayBuffer(value) {
	return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
}
var arrayBufferTag;
var init__baseIsArrayBuffer = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	arrayBufferTag = "[object ArrayBuffer]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isArrayBuffer.js
var nodeIsArrayBuffer, isArrayBuffer;
var init_isArrayBuffer = __esmMin((() => {
	init__baseIsArrayBuffer();
	init__baseUnary();
	init__nodeUtil();
	nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
	isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
}));
//#endregion
//#region ../../node_modules/lodash-es/isBoolean.js
/**
* Checks if `value` is classified as a boolean primitive or object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
* @example
*
* _.isBoolean(false);
* // => true
*
* _.isBoolean(null);
* // => false
*/
function isBoolean(value) {
	return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}
var boolTag;
var init_isBoolean = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	boolTag = "[object Boolean]";
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsDate.js
/**
* The base implementation of `_.isDate` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a date object, else `false`.
*/
function baseIsDate(value) {
	return isObjectLike(value) && baseGetTag(value) == dateTag;
}
var dateTag;
var init__baseIsDate = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	dateTag = "[object Date]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isDate.js
var nodeIsDate, isDate;
var init_isDate = __esmMin((() => {
	init__baseIsDate();
	init__baseUnary();
	init__nodeUtil();
	nodeIsDate = nodeUtil && nodeUtil.isDate;
	isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
}));
//#endregion
//#region ../../node_modules/lodash-es/isElement.js
/**
* Checks if `value` is likely a DOM element.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
* @example
*
* _.isElement(document.body);
* // => true
*
* _.isElement('<body>');
* // => false
*/
function isElement(value) {
	return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}
var init_isElement = __esmMin((() => {
	init_isObjectLike();
	init_isPlainObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/isEmpty.js
/**
* Checks if `value` is an empty object, collection, map, or set.
*
* Objects are considered empty if they have no own enumerable string keyed
* properties.
*
* Array-like values such as `arguments` objects, arrays, buffers, strings, or
* jQuery-like collections are considered empty if they have a `length` of `0`.
* Similarly, maps and sets are considered empty if they have a `size` of `0`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is empty, else `false`.
* @example
*
* _.isEmpty(null);
* // => true
*
* _.isEmpty(true);
* // => true
*
* _.isEmpty(1);
* // => true
*
* _.isEmpty([1, 2, 3]);
* // => false
*
* _.isEmpty({ 'a': 1 });
* // => false
*/
function isEmpty(value) {
	if (value == null) return true;
	if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
	var tag = _getTag_default(value);
	if (tag == mapTag$2 || tag == setTag$2) return !value.size;
	if (isPrototype(value)) return !baseKeys(value).length;
	for (var key in value) if (hasOwnProperty$4.call(value, key)) return false;
	return true;
}
var mapTag$2, setTag$2, hasOwnProperty$4;
var init_isEmpty = __esmMin((() => {
	init__baseKeys();
	init__getTag();
	init_isArguments();
	init_isArray();
	init_isArrayLike();
	init_isBuffer();
	init__isPrototype();
	init_isTypedArray();
	mapTag$2 = "[object Map]", setTag$2 = "[object Set]";
	hasOwnProperty$4 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/isEqual.js
/**
* Performs a deep comparison between two values to determine if they are
* equivalent.
*
* **Note:** This method supports comparing arrays, array buffers, booleans,
* date objects, error objects, maps, numbers, `Object` objects, regexes,
* sets, strings, symbols, and typed arrays. `Object` objects are compared
* by their own, not inherited, enumerable properties. Functions and DOM
* nodes are compared by strict equality, i.e. `===`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.isEqual(object, other);
* // => true
*
* object === other;
* // => false
*/
function isEqual$1(value, other) {
	return baseIsEqual(value, other);
}
var init_isEqual = __esmMin((() => {
	init__baseIsEqual();
}));
//#endregion
//#region ../../node_modules/lodash-es/isEqualWith.js
/**
* This method is like `_.isEqual` except that it accepts `customizer` which
* is invoked to compare values. If `customizer` returns `undefined`, comparisons
* are handled by the method instead. The `customizer` is invoked with up to
* six arguments: (objValue, othValue [, index|key, object, other, stack]).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* function isGreeting(value) {
*   return /^h(?:i|ello)$/.test(value);
* }
*
* function customizer(objValue, othValue) {
*   if (isGreeting(objValue) && isGreeting(othValue)) {
*     return true;
*   }
* }
*
* var array = ['hello', 'goodbye'];
* var other = ['hi', 'goodbye'];
*
* _.isEqualWith(array, other, customizer);
* // => true
*/
function isEqualWith(value, other, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	var result = customizer ? customizer(value, other) : void 0;
	return result === void 0 ? baseIsEqual(value, other, void 0, customizer) : !!result;
}
var init_isEqualWith = __esmMin((() => {
	init__baseIsEqual();
}));
//#endregion
//#region ../../node_modules/lodash-es/isFinite.js
/**
* Checks if `value` is a finite primitive number.
*
* **Note:** This method is based on
* [`Number.isFinite`](https://mdn.io/Number/isFinite).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
* @example
*
* _.isFinite(3);
* // => true
*
* _.isFinite(Number.MIN_VALUE);
* // => true
*
* _.isFinite(Infinity);
* // => false
*
* _.isFinite('3');
* // => false
*/
function isFinite(value) {
	return typeof value == "number" && nativeIsFinite(value);
}
var nativeIsFinite;
var init_isFinite = __esmMin((() => {
	init__root();
	nativeIsFinite = root.isFinite;
}));
//#endregion
//#region ../../node_modules/lodash-es/isInteger.js
/**
* Checks if `value` is an integer.
*
* **Note:** This method is based on
* [`Number.isInteger`](https://mdn.io/Number/isInteger).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an integer, else `false`.
* @example
*
* _.isInteger(3);
* // => true
*
* _.isInteger(Number.MIN_VALUE);
* // => false
*
* _.isInteger(Infinity);
* // => false
*
* _.isInteger('3');
* // => false
*/
function isInteger(value) {
	return typeof value == "number" && value == toInteger(value);
}
var init_isInteger = __esmMin((() => {
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/isMatch.js
/**
* Performs a partial deep comparison between `object` and `source` to
* determine if `object` contains equivalent property values.
*
* **Note:** This method is equivalent to `_.matches` when `source` is
* partially applied.
*
* Partial comparisons will match empty array and empty object `source`
* values against any array or object value, respectively. See `_.isEqual`
* for a list of supported value comparisons.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
* @example
*
* var object = { 'a': 1, 'b': 2 };
*
* _.isMatch(object, { 'b': 2 });
* // => true
*
* _.isMatch(object, { 'b': 1 });
* // => false
*/
function isMatch(object, source) {
	return object === source || baseIsMatch(object, source, getMatchData(source));
}
var init_isMatch = __esmMin((() => {
	init__baseIsMatch();
	init__getMatchData();
}));
//#endregion
//#region ../../node_modules/lodash-es/isMatchWith.js
/**
* This method is like `_.isMatch` except that it accepts `customizer` which
* is invoked to compare values. If `customizer` returns `undefined`, comparisons
* are handled by the method instead. The `customizer` is invoked with five
* arguments: (objValue, srcValue, index|key, object, source).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
* @example
*
* function isGreeting(value) {
*   return /^h(?:i|ello)$/.test(value);
* }
*
* function customizer(objValue, srcValue) {
*   if (isGreeting(objValue) && isGreeting(srcValue)) {
*     return true;
*   }
* }
*
* var object = { 'greeting': 'hello' };
* var source = { 'greeting': 'hi' };
*
* _.isMatchWith(object, source, customizer);
* // => true
*/
function isMatchWith(object, source, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	return baseIsMatch(object, source, getMatchData(source), customizer);
}
var init_isMatchWith = __esmMin((() => {
	init__baseIsMatch();
	init__getMatchData();
}));
//#endregion
//#region ../../node_modules/lodash-es/isNumber.js
/**
* Checks if `value` is classified as a `Number` primitive or object.
*
* **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
* classified as numbers, use the `_.isFinite` method.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a number, else `false`.
* @example
*
* _.isNumber(3);
* // => true
*
* _.isNumber(Number.MIN_VALUE);
* // => true
*
* _.isNumber(Infinity);
* // => true
*
* _.isNumber('3');
* // => false
*/
function isNumber(value) {
	return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
}
var numberTag;
var init_isNumber = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	numberTag = "[object Number]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isNaN.js
/**
* Checks if `value` is `NaN`.
*
* **Note:** This method is based on
* [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
* global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
* `undefined` and other non-number values.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
* @example
*
* _.isNaN(NaN);
* // => true
*
* _.isNaN(new Number(NaN));
* // => true
*
* isNaN(undefined);
* // => true
*
* _.isNaN(undefined);
* // => false
*/
function isNaN(value) {
	return isNumber(value) && value != +value;
}
var init_isNaN = __esmMin((() => {
	init_isNumber();
}));
//#endregion
//#region ../../node_modules/lodash-es/_isMaskable.js
var isMaskable;
var init__isMaskable = __esmMin((() => {
	init__coreJsData();
	init_isFunction();
	init_stubFalse();
	isMaskable = coreJsData ? isFunction : stubFalse;
}));
//#endregion
//#region ../../node_modules/lodash-es/isNative.js
/**
* Checks if `value` is a pristine native function.
*
* **Note:** This method can't reliably detect native functions in the presence
* of the core-js package because core-js circumvents this kind of detection.
* Despite multiple requests, the core-js maintainer has made it clear: any
* attempt to fix the detection will be obstructed. As a result, we're left
* with little choice but to throw an error. Unfortunately, this also affects
* packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
* which rely on core-js.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
* @example
*
* _.isNative(Array.prototype.push);
* // => true
*
* _.isNative(_);
* // => false
*/
function isNative(value) {
	if (isMaskable(value)) throw new Error(CORE_ERROR_TEXT);
	return baseIsNative(value);
}
var CORE_ERROR_TEXT;
var init_isNative = __esmMin((() => {
	init__baseIsNative();
	init__isMaskable();
	CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
}));
//#endregion
//#region ../../node_modules/lodash-es/isNil.js
/**
* Checks if `value` is `null` or `undefined`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is nullish, else `false`.
* @example
*
* _.isNil(null);
* // => true
*
* _.isNil(void 0);
* // => true
*
* _.isNil(NaN);
* // => false
*/
function isNil(value) {
	return value == null;
}
var init_isNil = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isNull.js
/**
* Checks if `value` is `null`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `null`, else `false`.
* @example
*
* _.isNull(null);
* // => true
*
* _.isNull(void 0);
* // => false
*/
function isNull(value) {
	return value === null;
}
var init_isNull = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIsRegExp.js
/**
* The base implementation of `_.isRegExp` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
*/
function baseIsRegExp(value) {
	return isObjectLike(value) && baseGetTag(value) == regexpTag;
}
var regexpTag;
var init__baseIsRegExp = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	regexpTag = "[object RegExp]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isRegExp.js
var nodeIsRegExp, isRegExp;
var init_isRegExp = __esmMin((() => {
	init__baseIsRegExp();
	init__baseUnary();
	init__nodeUtil();
	nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
	isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
}));
//#endregion
//#region ../../node_modules/lodash-es/isSafeInteger.js
/**
* Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
* double precision number which isn't the result of a rounded unsafe integer.
*
* **Note:** This method is based on
* [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
* @example
*
* _.isSafeInteger(3);
* // => true
*
* _.isSafeInteger(Number.MIN_VALUE);
* // => false
*
* _.isSafeInteger(Infinity);
* // => false
*
* _.isSafeInteger('3');
* // => false
*/
function isSafeInteger(value) {
	return isInteger(value) && value >= -MAX_SAFE_INTEGER$3 && value <= MAX_SAFE_INTEGER$3;
}
var MAX_SAFE_INTEGER$3;
var init_isSafeInteger = __esmMin((() => {
	init_isInteger();
	MAX_SAFE_INTEGER$3 = 9007199254740991;
}));
//#endregion
//#region ../../node_modules/lodash-es/isUndefined.js
/**
* Checks if `value` is `undefined`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
* @example
*
* _.isUndefined(void 0);
* // => true
*
* _.isUndefined(null);
* // => false
*/
function isUndefined(value) {
	return value === void 0;
}
var init_isUndefined = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/isWeakMap.js
/**
* Checks if `value` is classified as a `WeakMap` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
* @example
*
* _.isWeakMap(new WeakMap);
* // => true
*
* _.isWeakMap(new Map);
* // => false
*/
function isWeakMap(value) {
	return isObjectLike(value) && _getTag_default(value) == weakMapTag;
}
var weakMapTag;
var init_isWeakMap = __esmMin((() => {
	init__getTag();
	init_isObjectLike();
	weakMapTag = "[object WeakMap]";
}));
//#endregion
//#region ../../node_modules/lodash-es/isWeakSet.js
/**
* Checks if `value` is classified as a `WeakSet` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
* @example
*
* _.isWeakSet(new WeakSet);
* // => true
*
* _.isWeakSet(new Set);
* // => false
*/
function isWeakSet(value) {
	return isObjectLike(value) && baseGetTag(value) == weakSetTag;
}
var weakSetTag;
var init_isWeakSet = __esmMin((() => {
	init__baseGetTag();
	init_isObjectLike();
	weakSetTag = "[object WeakSet]";
}));
//#endregion
//#region ../../node_modules/lodash-es/iteratee.js
/**
* Creates a function that invokes `func` with the arguments of the created
* function. If `func` is a property name, the created function returns the
* property value for a given element. If `func` is an array or object, the
* created function returns `true` for elements that contain the equivalent
* source properties, otherwise it returns `false`.
*
* @static
* @since 4.0.0
* @memberOf _
* @category Util
* @param {*} [func=_.identity] The value to convert to a callback.
* @returns {Function} Returns the callback.
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': true },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* // The `_.matches` iteratee shorthand.
* _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
* // => [{ 'user': 'barney', 'age': 36, 'active': true }]
*
* // The `_.matchesProperty` iteratee shorthand.
* _.filter(users, _.iteratee(['user', 'fred']));
* // => [{ 'user': 'fred', 'age': 40 }]
*
* // The `_.property` iteratee shorthand.
* _.map(users, _.iteratee('user'));
* // => ['barney', 'fred']
*
* // Create custom iteratee shorthands.
* _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
*   return !_.isRegExp(func) ? iteratee(func) : function(string) {
*     return func.test(string);
*   };
* });
*
* _.filter(['abc', 'def'], /ef/);
* // => ['def']
*/
function iteratee(func) {
	return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG$3));
}
var CLONE_DEEP_FLAG$3;
var init_iteratee = __esmMin((() => {
	init__baseClone();
	init__baseIteratee();
	CLONE_DEEP_FLAG$3 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/join.js
/**
* Converts all elements in `array` into a string separated by `separator`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to convert.
* @param {string} [separator=','] The element separator.
* @returns {string} Returns the joined string.
* @example
*
* _.join(['a', 'b', 'c'], '~');
* // => 'a~b~c'
*/
function join(array, separator) {
	return array == null ? "" : nativeJoin.call(array, separator);
}
var nativeJoin;
var init_join = __esmMin((() => {
	nativeJoin = Array.prototype.join;
}));
//#endregion
//#region ../../node_modules/lodash-es/kebabCase.js
var kebabCase;
var init_kebabCase = __esmMin((() => {
	init__createCompounder();
	kebabCase = createCompounder(function(result, word, index) {
		return result + (index ? "-" : "") + word.toLowerCase();
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/keyBy.js
var keyBy;
var init_keyBy = __esmMin((() => {
	init__baseAssignValue();
	init__createAggregator();
	keyBy = createAggregator(function(result, value, key) {
		baseAssignValue(result, key, value);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_strictLastIndexOf.js
/**
* A specialized version of `_.lastIndexOf` which performs strict equality
* comparisons of values, i.e. `===`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function strictLastIndexOf(array, value, fromIndex) {
	var index = fromIndex + 1;
	while (index--) if (array[index] === value) return index;
	return index;
}
var init__strictLastIndexOf = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/lastIndexOf.js
/**
* This method is like `_.indexOf` except that it iterates over elements of
* `array` from right to left.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} [fromIndex=array.length-1] The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
* @example
*
* _.lastIndexOf([1, 2, 1, 2], 2);
* // => 3
*
* // Search from the `fromIndex`.
* _.lastIndexOf([1, 2, 1, 2], 2, 2);
* // => 1
*/
function lastIndexOf(array, value, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = length;
	if (fromIndex !== void 0) {
		index = toInteger(fromIndex);
		index = index < 0 ? nativeMax$5(length + index, 0) : nativeMin$7(index, length - 1);
	}
	return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
}
var nativeMax$5, nativeMin$7;
var init_lastIndexOf = __esmMin((() => {
	init__baseFindIndex();
	init__baseIsNaN();
	init__strictLastIndexOf();
	init_toInteger();
	nativeMax$5 = Math.max, nativeMin$7 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/lowerCase.js
var lowerCase;
var init_lowerCase = __esmMin((() => {
	init__createCompounder();
	lowerCase = createCompounder(function(result, word, index) {
		return result + (index ? " " : "") + word.toLowerCase();
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/lowerFirst.js
var lowerFirst;
var init_lowerFirst = __esmMin((() => {
	init__createCaseFirst();
	lowerFirst = createCaseFirst("toLowerCase");
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseLt.js
/**
* The base implementation of `_.lt` which doesn't coerce arguments.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if `value` is less than `other`,
*  else `false`.
*/
function baseLt(value, other) {
	return value < other;
}
var init__baseLt = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/lt.js
var lt;
var init_lt = __esmMin((() => {
	init__baseLt();
	init__createRelationalOperation();
	lt = createRelationalOperation(baseLt);
}));
//#endregion
//#region ../../node_modules/lodash-es/lte.js
var lte;
var init_lte = __esmMin((() => {
	init__createRelationalOperation();
	lte = createRelationalOperation(function(value, other) {
		return value <= other;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/mapKeys.js
/**
* The opposite of `_.mapValues`; this method creates an object with the
* same values as `object` and keys generated by running each own enumerable
* string keyed property of `object` thru `iteratee`. The iteratee is invoked
* with three arguments: (value, key, object).
*
* @static
* @memberOf _
* @since 3.8.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns the new mapped object.
* @see _.mapValues
* @example
*
* _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
*   return key + value;
* });
* // => { 'a1': 1, 'b2': 2 }
*/
function mapKeys(object, iteratee) {
	var result = {};
	iteratee = baseIteratee(iteratee, 3);
	baseForOwn(object, function(value, key, object) {
		baseAssignValue(result, iteratee(value, key, object), value);
	});
	return result;
}
var init_mapKeys = __esmMin((() => {
	init__baseAssignValue();
	init__baseForOwn();
	init__baseIteratee();
}));
//#endregion
//#region ../../node_modules/lodash-es/mapValues.js
/**
* Creates an object with the same keys as `object` and values generated
* by running each own enumerable string keyed property of `object` thru
* `iteratee`. The iteratee is invoked with three arguments:
* (value, key, object).
*
* @static
* @memberOf _
* @since 2.4.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Object} Returns the new mapped object.
* @see _.mapKeys
* @example
*
* var users = {
*   'fred':    { 'user': 'fred',    'age': 40 },
*   'pebbles': { 'user': 'pebbles', 'age': 1 }
* };
*
* _.mapValues(users, function(o) { return o.age; });
* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
*
* // The `_.property` iteratee shorthand.
* _.mapValues(users, 'age');
* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
*/
function mapValues(object, iteratee) {
	var result = {};
	iteratee = baseIteratee(iteratee, 3);
	baseForOwn(object, function(value, key, object) {
		baseAssignValue(result, key, iteratee(value, key, object));
	});
	return result;
}
var init_mapValues = __esmMin((() => {
	init__baseAssignValue();
	init__baseForOwn();
	init__baseIteratee();
}));
//#endregion
//#region ../../node_modules/lodash-es/matches.js
/**
* Creates a function that performs a partial deep comparison between a given
* object and `source`, returning `true` if the given object has equivalent
* property values, else `false`.
*
* **Note:** The created function is equivalent to `_.isMatch` with `source`
* partially applied.
*
* Partial comparisons will match empty array and empty object `source`
* values against any array or object value, respectively. See `_.isEqual`
* for a list of supported value comparisons.
*
* **Note:** Multiple values can be checked by combining several matchers
* using `_.overSome`
*
* @static
* @memberOf _
* @since 3.0.0
* @category Util
* @param {Object} source The object of property values to match.
* @returns {Function} Returns the new spec function.
* @example
*
* var objects = [
*   { 'a': 1, 'b': 2, 'c': 3 },
*   { 'a': 4, 'b': 5, 'c': 6 }
* ];
*
* _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
* // => [{ 'a': 4, 'b': 5, 'c': 6 }]
*
* // Checking for several possible values
* _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
*/
function matches(source) {
	return baseMatches(baseClone(source, CLONE_DEEP_FLAG$2));
}
var CLONE_DEEP_FLAG$2;
var init_matches = __esmMin((() => {
	init__baseClone();
	init__baseMatches();
	CLONE_DEEP_FLAG$2 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/matchesProperty.js
/**
* Creates a function that performs a partial deep comparison between the
* value at `path` of a given object to `srcValue`, returning `true` if the
* object value is equivalent, else `false`.
*
* **Note:** Partial comparisons will match empty array and empty object
* `srcValue` values against any array or object value, respectively. See
* `_.isEqual` for a list of supported value comparisons.
*
* **Note:** Multiple values can be checked by combining several matchers
* using `_.overSome`
*
* @static
* @memberOf _
* @since 3.2.0
* @category Util
* @param {Array|string} path The path of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
* @example
*
* var objects = [
*   { 'a': 1, 'b': 2, 'c': 3 },
*   { 'a': 4, 'b': 5, 'c': 6 }
* ];
*
* _.find(objects, _.matchesProperty('a', 4));
* // => { 'a': 4, 'b': 5, 'c': 6 }
*
* // Checking for several possible values
* _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
*/
function matchesProperty(path, srcValue) {
	return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG$1));
}
var CLONE_DEEP_FLAG$1;
var init_matchesProperty = __esmMin((() => {
	init__baseClone();
	init__baseMatchesProperty();
	CLONE_DEEP_FLAG$1 = 1;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseExtremum.js
/**
* The base implementation of methods like `_.max` and `_.min` which accepts a
* `comparator` to determine the extremum value.
*
* @private
* @param {Array} array The array to iterate over.
* @param {Function} iteratee The iteratee invoked per iteration.
* @param {Function} comparator The comparator used to compare values.
* @returns {*} Returns the extremum value.
*/
function baseExtremum(array, iteratee, comparator) {
	var index = -1, length = array.length;
	while (++index < length) {
		var value = array[index], current = iteratee(value);
		if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
	}
	return result;
}
var init__baseExtremum = __esmMin((() => {
	init_isSymbol();
}));
//#endregion
//#region ../../node_modules/lodash-es/max.js
/**
* Computes the maximum value of `array`. If `array` is empty or falsey,
* `undefined` is returned.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Math
* @param {Array} array The array to iterate over.
* @returns {*} Returns the maximum value.
* @example
*
* _.max([4, 2, 8, 6]);
* // => 8
*
* _.max([]);
* // => undefined
*/
function max(array) {
	return array && array.length ? baseExtremum(array, identity, baseGt) : void 0;
}
var init_max = __esmMin((() => {
	init__baseExtremum();
	init__baseGt();
	init_identity();
}));
//#endregion
//#region ../../node_modules/lodash-es/maxBy.js
/**
* This method is like `_.max` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the criterion by which
* the value is ranked. The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Math
* @param {Array} array The array to iterate over.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {*} Returns the maximum value.
* @example
*
* var objects = [{ 'n': 1 }, { 'n': 2 }];
*
* _.maxBy(objects, function(o) { return o.n; });
* // => { 'n': 2 }
*
* // The `_.property` iteratee shorthand.
* _.maxBy(objects, 'n');
* // => { 'n': 2 }
*/
function maxBy(array, iteratee) {
	return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : void 0;
}
var init_maxBy = __esmMin((() => {
	init__baseExtremum();
	init__baseGt();
	init__baseIteratee();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSum.js
/**
* The base implementation of `_.sum` and `_.sumBy` without support for
* iteratee shorthands.
*
* @private
* @param {Array} array The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {number} Returns the sum.
*/
function baseSum(array, iteratee) {
	var result, index = -1, length = array.length;
	while (++index < length) {
		var current = iteratee(array[index]);
		if (current !== void 0) result = result === void 0 ? current : result + current;
	}
	return result;
}
var init__baseSum = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseMean.js
/**
* The base implementation of `_.mean` and `_.meanBy` without support for
* iteratee shorthands.
*
* @private
* @param {Array} array The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {number} Returns the mean.
*/
function baseMean(array, iteratee) {
	var length = array == null ? 0 : array.length;
	return length ? baseSum(array, iteratee) / length : NAN;
}
var NAN;
var init__baseMean = __esmMin((() => {
	init__baseSum();
	NAN = NaN;
}));
//#endregion
//#region ../../node_modules/lodash-es/mean.js
/**
* Computes the mean of the values in `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Math
* @param {Array} array The array to iterate over.
* @returns {number} Returns the mean.
* @example
*
* _.mean([4, 2, 8, 6]);
* // => 5
*/
function mean(array) {
	return baseMean(array, identity);
}
var init_mean = __esmMin((() => {
	init__baseMean();
	init_identity();
}));
//#endregion
//#region ../../node_modules/lodash-es/meanBy.js
/**
* This method is like `_.mean` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the value to be averaged.
* The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.7.0
* @category Math
* @param {Array} array The array to iterate over.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {number} Returns the mean.
* @example
*
* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
*
* _.meanBy(objects, function(o) { return o.n; });
* // => 5
*
* // The `_.property` iteratee shorthand.
* _.meanBy(objects, 'n');
* // => 5
*/
function meanBy(array, iteratee) {
	return baseMean(array, baseIteratee(iteratee, 2));
}
var init_meanBy = __esmMin((() => {
	init__baseIteratee();
	init__baseMean();
}));
//#endregion
//#region ../../node_modules/lodash-es/merge.js
var merge;
var init_merge = __esmMin((() => {
	init__baseMerge();
	init__createAssigner();
	merge = createAssigner(function(object, source, srcIndex) {
		baseMerge(object, source, srcIndex);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/method.js
var method;
var init_method = __esmMin((() => {
	init__baseInvoke();
	init__baseRest();
	method = baseRest(function(path, args) {
		return function(object) {
			return baseInvoke(object, path, args);
		};
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/methodOf.js
var methodOf;
var init_methodOf = __esmMin((() => {
	init__baseInvoke();
	init__baseRest();
	methodOf = baseRest(function(object, args) {
		return function(path) {
			return baseInvoke(object, path, args);
		};
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/min.js
/**
* Computes the minimum value of `array`. If `array` is empty or falsey,
* `undefined` is returned.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Math
* @param {Array} array The array to iterate over.
* @returns {*} Returns the minimum value.
* @example
*
* _.min([4, 2, 8, 6]);
* // => 2
*
* _.min([]);
* // => undefined
*/
function min(array) {
	return array && array.length ? baseExtremum(array, identity, baseLt) : void 0;
}
var init_min = __esmMin((() => {
	init__baseExtremum();
	init__baseLt();
	init_identity();
}));
//#endregion
//#region ../../node_modules/lodash-es/minBy.js
/**
* This method is like `_.min` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the criterion by which
* the value is ranked. The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Math
* @param {Array} array The array to iterate over.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {*} Returns the minimum value.
* @example
*
* var objects = [{ 'n': 1 }, { 'n': 2 }];
*
* _.minBy(objects, function(o) { return o.n; });
* // => { 'n': 1 }
*
* // The `_.property` iteratee shorthand.
* _.minBy(objects, 'n');
* // => { 'n': 1 }
*/
function minBy(array, iteratee) {
	return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : void 0;
}
var init_minBy = __esmMin((() => {
	init__baseExtremum();
	init__baseIteratee();
	init__baseLt();
}));
//#endregion
//#region ../../node_modules/lodash-es/mixin.js
/**
* Adds all own enumerable string keyed function properties of a source
* object to the destination object. If `object` is a function, then methods
* are added to its prototype as well.
*
* **Note:** Use `_.runInContext` to create a pristine `lodash` function to
* avoid conflicts caused by modifying the original.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {Function|Object} [object=lodash] The destination object.
* @param {Object} source The object of functions to add.
* @param {Object} [options={}] The options object.
* @param {boolean} [options.chain=true] Specify whether mixins are chainable.
* @returns {Function|Object} Returns `object`.
* @example
*
* function vowels(string) {
*   return _.filter(string, function(v) {
*     return /[aeiou]/i.test(v);
*   });
* }
*
* _.mixin({ 'vowels': vowels });
* _.vowels('fred');
* // => ['e']
*
* _('fred').vowels().value();
* // => ['e']
*
* _.mixin({ 'vowels': vowels }, { 'chain': false });
* _('fred').vowels();
* // => ['e']
*/
function mixin$1(object, source, options) {
	var methodNames = baseFunctions(source, keys(source));
	var chain = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
	arrayEach(methodNames, function(methodName) {
		var func = source[methodName];
		object[methodName] = func;
		if (isFunc) object.prototype[methodName] = function() {
			var chainAll = this.__chain__;
			if (chain || chainAll) {
				var result = object(this.__wrapped__);
				(result.__actions__ = copyArray(this.__actions__)).push({
					"func": func,
					"args": arguments,
					"thisArg": object
				});
				result.__chain__ = chainAll;
				return result;
			}
			return func.apply(object, arrayPush([this.value()], arguments));
		};
	});
	return object;
}
var init_mixin = __esmMin((() => {
	init__arrayEach();
	init__arrayPush();
	init__baseFunctions();
	init__copyArray();
	init_isFunction();
	init_isObject();
	init_keys();
}));
//#endregion
//#region ../../node_modules/lodash-es/multiply.js
var multiply;
var init_multiply = __esmMin((() => {
	init__createMathOperation();
	multiply = createMathOperation(function(multiplier, multiplicand) {
		return multiplier * multiplicand;
	}, 1);
}));
//#endregion
//#region ../../node_modules/lodash-es/negate.js
/**
* Creates a function that negates the result of the predicate `func`. The
* `func` predicate is invoked with the `this` binding and arguments of the
* created function.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Function
* @param {Function} predicate The predicate to negate.
* @returns {Function} Returns the new negated function.
* @example
*
* function isEven(n) {
*   return n % 2 == 0;
* }
*
* _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
* // => [1, 3, 5]
*/
function negate(predicate) {
	if (typeof predicate != "function") throw new TypeError(FUNC_ERROR_TEXT$3);
	return function() {
		var args = arguments;
		switch (args.length) {
			case 0: return !predicate.call(this);
			case 1: return !predicate.call(this, args[0]);
			case 2: return !predicate.call(this, args[0], args[1]);
			case 3: return !predicate.call(this, args[0], args[1], args[2]);
		}
		return !predicate.apply(this, args);
	};
}
var FUNC_ERROR_TEXT$3;
var init_negate = __esmMin((() => {
	FUNC_ERROR_TEXT$3 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/_iteratorToArray.js
/**
* Converts `iterator` to an array.
*
* @private
* @param {Object} iterator The iterator to convert.
* @returns {Array} Returns the converted array.
*/
function iteratorToArray(iterator) {
	var data, result = [];
	while (!(data = iterator.next()).done) result.push(data.value);
	return result;
}
var init__iteratorToArray = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/toArray.js
/**
* Converts `value` to an array.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to convert.
* @returns {Array} Returns the converted array.
* @example
*
* _.toArray({ 'a': 1, 'b': 2 });
* // => [1, 2]
*
* _.toArray('abc');
* // => ['a', 'b', 'c']
*
* _.toArray(1);
* // => []
*
* _.toArray(null);
* // => []
*/
function toArray(value) {
	if (!value) return [];
	if (isArrayLike(value)) return isString(value) ? stringToArray(value) : copyArray(value);
	if (symIterator$1 && value[symIterator$1]) return iteratorToArray(value[symIterator$1]());
	var tag = _getTag_default(value);
	return (tag == mapTag$1 ? mapToArray : tag == setTag$1 ? setToArray : values)(value);
}
var mapTag$1, setTag$1, symIterator$1;
var init_toArray = __esmMin((() => {
	init__Symbol();
	init__copyArray();
	init__getTag();
	init_isArrayLike();
	init_isString();
	init__iteratorToArray();
	init__mapToArray();
	init__setToArray();
	init__stringToArray();
	init_values();
	mapTag$1 = "[object Map]", setTag$1 = "[object Set]";
	symIterator$1 = Symbol ? Symbol.iterator : void 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/next.js
/**
* Gets the next value on a wrapped object following the
* [iterator protocol](https://mdn.io/iteration_protocols#iterator).
*
* @name next
* @memberOf _
* @since 4.0.0
* @category Seq
* @returns {Object} Returns the next iterator value.
* @example
*
* var wrapped = _([1, 2]);
*
* wrapped.next();
* // => { 'done': false, 'value': 1 }
*
* wrapped.next();
* // => { 'done': false, 'value': 2 }
*
* wrapped.next();
* // => { 'done': true, 'value': undefined }
*/
function wrapperNext() {
	if (this.__values__ === void 0) this.__values__ = toArray(this.value());
	var done = this.__index__ >= this.__values__.length;
	return {
		"done": done,
		"value": done ? void 0 : this.__values__[this.__index__++]
	};
}
var init_next = __esmMin((() => {
	init_toArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseNth.js
/**
* The base implementation of `_.nth` which doesn't coerce arguments.
*
* @private
* @param {Array} array The array to query.
* @param {number} n The index of the element to return.
* @returns {*} Returns the nth element of `array`.
*/
function baseNth(array, n) {
	var length = array.length;
	if (!length) return;
	n += n < 0 ? length : 0;
	return isIndex(n, length) ? array[n] : void 0;
}
var init__baseNth = __esmMin((() => {
	init__isIndex();
}));
//#endregion
//#region ../../node_modules/lodash-es/nth.js
/**
* Gets the element at index `n` of `array`. If `n` is negative, the nth
* element from the end is returned.
*
* @static
* @memberOf _
* @since 4.11.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=0] The index of the element to return.
* @returns {*} Returns the nth element of `array`.
* @example
*
* var array = ['a', 'b', 'c', 'd'];
*
* _.nth(array, 1);
* // => 'b'
*
* _.nth(array, -2);
* // => 'c';
*/
function nth(array, n) {
	return array && array.length ? baseNth(array, toInteger(n)) : void 0;
}
var init_nth = __esmMin((() => {
	init__baseNth();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/nthArg.js
/**
* Creates a function that gets the argument at index `n`. If `n` is negative,
* the nth argument from the end is returned.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Util
* @param {number} [n=0] The index of the argument to return.
* @returns {Function} Returns the new pass-thru function.
* @example
*
* var func = _.nthArg(1);
* func('a', 'b', 'c', 'd');
* // => 'b'
*
* var func = _.nthArg(-2);
* func('a', 'b', 'c', 'd');
* // => 'c'
*/
function nthArg(n) {
	n = toInteger(n);
	return baseRest(function(args) {
		return baseNth(args, n);
	});
}
var init_nthArg = __esmMin((() => {
	init__baseNth();
	init__baseRest();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseUnset.js
/**
* The base implementation of `_.unset`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The property path to unset.
* @returns {boolean} Returns `true` if the property is deleted, else `false`.
*/
function baseUnset(object, path) {
	path = castPath(path, object);
	var index = -1, length = path.length;
	if (!length) return true;
	while (++index < length) {
		var key = toKey(path[index]);
		if (key === "__proto__" && !hasOwnProperty$3.call(object, "__proto__")) return false;
		if ((key === "constructor" || key === "prototype") && index < length - 1) return false;
	}
	var obj = parent(object, path);
	return obj == null || delete obj[toKey(last(path))];
}
var hasOwnProperty$3;
var init__baseUnset = __esmMin((() => {
	init__castPath();
	init_last();
	init__parent();
	init__toKey();
	hasOwnProperty$3 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_customOmitClone.js
/**
* Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
* objects.
*
* @private
* @param {*} value The value to inspect.
* @param {string} key The key of the property to inspect.
* @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
*/
function customOmitClone(value) {
	return isPlainObject(value) ? void 0 : value;
}
var init__customOmitClone = __esmMin((() => {
	init_isPlainObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/omit.js
var CLONE_DEEP_FLAG, CLONE_FLAT_FLAG, CLONE_SYMBOLS_FLAG, omit;
var init_omit = __esmMin((() => {
	init__arrayMap();
	init__baseClone();
	init__baseUnset();
	init__castPath();
	init__copyObject();
	init__customOmitClone();
	init__flatRest();
	init__getAllKeysIn();
	CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
	omit = flatRest(function(object, paths) {
		var result = {};
		if (object == null) return result;
		var isDeep = false;
		paths = arrayMap(paths, function(path) {
			path = castPath(path, object);
			isDeep || (isDeep = path.length > 1);
			return path;
		});
		copyObject(object, getAllKeysIn(object), result);
		if (isDeep) result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
		var length = paths.length;
		while (length--) baseUnset(result, paths[length]);
		return result;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSet.js
/**
* The base implementation of `_.set`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @param {Function} [customizer] The function to customize path creation.
* @returns {Object} Returns `object`.
*/
function baseSet(object, path, value, customizer) {
	if (!isObject(object)) return object;
	path = castPath(path, object);
	var index = -1, length = path.length, lastIndex = length - 1, nested = object;
	while (nested != null && ++index < length) {
		var key = toKey(path[index]), newValue = value;
		if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
		if (index != lastIndex) {
			var objValue = nested[key];
			newValue = customizer ? customizer(objValue, key, nested) : void 0;
			if (newValue === void 0) newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
		}
		assignValue(nested, key, newValue);
		nested = nested[key];
	}
	return object;
}
var init__baseSet = __esmMin((() => {
	init__assignValue();
	init__castPath();
	init__isIndex();
	init_isObject();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/_basePickBy.js
/**
* The base implementation of  `_.pickBy` without support for iteratee shorthands.
*
* @private
* @param {Object} object The source object.
* @param {string[]} paths The property paths to pick.
* @param {Function} predicate The function invoked per property.
* @returns {Object} Returns the new object.
*/
function basePickBy(object, paths, predicate) {
	var index = -1, length = paths.length, result = {};
	while (++index < length) {
		var path = paths[index], value = baseGet(object, path);
		if (predicate(value, path)) baseSet(result, castPath(path, object), value);
	}
	return result;
}
var init__basePickBy = __esmMin((() => {
	init__baseGet();
	init__baseSet();
	init__castPath();
}));
//#endregion
//#region ../../node_modules/lodash-es/pickBy.js
/**
* Creates an object composed of the `object` properties `predicate` returns
* truthy for. The predicate is invoked with two arguments: (value, key).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The source object.
* @param {Function} [predicate=_.identity] The function invoked per property.
* @returns {Object} Returns the new object.
* @example
*
* var object = { 'a': 1, 'b': '2', 'c': 3 };
*
* _.pickBy(object, _.isNumber);
* // => { 'a': 1, 'c': 3 }
*/
function pickBy(object, predicate) {
	if (object == null) return {};
	var props = arrayMap(getAllKeysIn(object), function(prop) {
		return [prop];
	});
	predicate = baseIteratee(predicate);
	return basePickBy(object, props, function(value, path) {
		return predicate(value, path[0]);
	});
}
var init_pickBy = __esmMin((() => {
	init__arrayMap();
	init__baseIteratee();
	init__basePickBy();
	init__getAllKeysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/omitBy.js
/**
* The opposite of `_.pickBy`; this method creates an object composed of
* the own and inherited enumerable string keyed properties of `object` that
* `predicate` doesn't return truthy for. The predicate is invoked with two
* arguments: (value, key).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The source object.
* @param {Function} [predicate=_.identity] The function invoked per property.
* @returns {Object} Returns the new object.
* @example
*
* var object = { 'a': 1, 'b': '2', 'c': 3 };
*
* _.omitBy(object, _.isNumber);
* // => { 'b': '2' }
*/
function omitBy(object, predicate) {
	return pickBy(object, negate(baseIteratee(predicate)));
}
var init_omitBy = __esmMin((() => {
	init__baseIteratee();
	init_negate();
	init_pickBy();
}));
//#endregion
//#region ../../node_modules/lodash-es/once.js
/**
* Creates a function that is restricted to invoking `func` once. Repeat calls
* to the function return the value of the first invocation. The `func` is
* invoked with the `this` binding and arguments of the created function.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new restricted function.
* @example
*
* var initialize = _.once(createApplication);
* initialize();
* initialize();
* // => `createApplication` is invoked once
*/
function once(func) {
	return before(2, func);
}
var init_once = __esmMin((() => {
	init_before();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSortBy.js
/**
* The base implementation of `_.sortBy` which uses `comparer` to define the
* sort order of `array` and replaces criteria objects with their corresponding
* values.
*
* @private
* @param {Array} array The array to sort.
* @param {Function} comparer The function to define sort order.
* @returns {Array} Returns `array`.
*/
function baseSortBy(array, comparer) {
	var length = array.length;
	array.sort(comparer);
	while (length--) array[length] = array[length].value;
	return array;
}
var init__baseSortBy = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_compareAscending.js
/**
* Compares values to sort them in ascending order.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {number} Returns the sort order indicator for `value`.
*/
function compareAscending(value, other) {
	if (value !== other) {
		var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
		var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
		if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) return 1;
		if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) return -1;
	}
	return 0;
}
var init__compareAscending = __esmMin((() => {
	init_isSymbol();
}));
//#endregion
//#region ../../node_modules/lodash-es/_compareMultiple.js
/**
* Used by `_.orderBy` to compare multiple properties of a value to another
* and stable sort them.
*
* If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
* specify an order of "desc" for descending or "asc" for ascending sort order
* of corresponding values.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {boolean[]|string[]} orders The order to sort by for each property.
* @returns {number} Returns the sort order indicator for `object`.
*/
function compareMultiple(object, other, orders) {
	var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
	while (++index < length) {
		var result = compareAscending(objCriteria[index], othCriteria[index]);
		if (result) {
			if (index >= ordersLength) return result;
			return result * (orders[index] == "desc" ? -1 : 1);
		}
	}
	return object.index - other.index;
}
var init__compareMultiple = __esmMin((() => {
	init__compareAscending();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseOrderBy.js
/**
* The base implementation of `_.orderBy` without param guards.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
* @param {string[]} orders The sort orders of `iteratees`.
* @returns {Array} Returns the new sorted array.
*/
function baseOrderBy(collection, iteratees, orders) {
	if (iteratees.length) iteratees = arrayMap(iteratees, function(iteratee) {
		if (isArray(iteratee)) return function(value) {
			return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
		};
		return iteratee;
	});
	else iteratees = [identity];
	var index = -1;
	iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
	return baseSortBy(baseMap(collection, function(value, key, collection) {
		return {
			"criteria": arrayMap(iteratees, function(iteratee) {
				return iteratee(value);
			}),
			"index": ++index,
			"value": value
		};
	}), function(object, other) {
		return compareMultiple(object, other, orders);
	});
}
var init__baseOrderBy = __esmMin((() => {
	init__arrayMap();
	init__baseGet();
	init__baseIteratee();
	init__baseMap();
	init__baseSortBy();
	init__baseUnary();
	init__compareMultiple();
	init_identity();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/orderBy.js
/**
* This method is like `_.sortBy` except that it allows specifying the sort
* orders of the iteratees to sort by. If `orders` is unspecified, all values
* are sorted in ascending order. Otherwise, specify an order of "desc" for
* descending or "asc" for ascending sort order of corresponding values.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
*  The iteratees to sort by.
* @param {string[]} [orders] The sort orders of `iteratees`.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
* @returns {Array} Returns the new sorted array.
* @example
*
* var users = [
*   { 'user': 'fred',   'age': 48 },
*   { 'user': 'barney', 'age': 34 },
*   { 'user': 'fred',   'age': 40 },
*   { 'user': 'barney', 'age': 36 }
* ];
*
* // Sort by `user` in ascending order and by `age` in descending order.
* _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
* // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
*/
function orderBy(collection, iteratees, orders, guard) {
	if (collection == null) return [];
	if (!isArray(iteratees)) iteratees = iteratees == null ? [] : [iteratees];
	orders = guard ? void 0 : orders;
	if (!isArray(orders)) orders = orders == null ? [] : [orders];
	return baseOrderBy(collection, iteratees, orders);
}
var init_orderBy = __esmMin((() => {
	init__baseOrderBy();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createOver.js
/**
* Creates a function like `_.over`.
*
* @private
* @param {Function} arrayFunc The function to iterate over iteratees.
* @returns {Function} Returns the new over function.
*/
function createOver(arrayFunc) {
	return flatRest(function(iteratees) {
		iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
		return baseRest(function(args) {
			var thisArg = this;
			return arrayFunc(iteratees, function(iteratee) {
				return apply(iteratee, thisArg, args);
			});
		});
	});
}
var init__createOver = __esmMin((() => {
	init__apply();
	init__arrayMap();
	init__baseIteratee();
	init__baseRest();
	init__baseUnary();
	init__flatRest();
}));
//#endregion
//#region ../../node_modules/lodash-es/over.js
var over;
var init_over = __esmMin((() => {
	init__arrayMap();
	init__createOver();
	over = createOver(arrayMap);
}));
//#endregion
//#region ../../node_modules/lodash-es/_castRest.js
var castRest;
var init__castRest = __esmMin((() => {
	init__baseRest();
	castRest = baseRest;
}));
//#endregion
//#region ../../node_modules/lodash-es/overArgs.js
var nativeMin$6, overArgs;
var init_overArgs = __esmMin((() => {
	init__apply();
	init__arrayMap();
	init__baseFlatten();
	init__baseIteratee();
	init__baseRest();
	init__baseUnary();
	init__castRest();
	init_isArray();
	nativeMin$6 = Math.min;
	overArgs = castRest(function(func, transforms) {
		transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
		var funcsLength = transforms.length;
		return baseRest(function(args) {
			var index = -1, length = nativeMin$6(args.length, funcsLength);
			while (++index < length) args[index] = transforms[index].call(this, args[index]);
			return apply(func, this, args);
		});
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/overEvery.js
var overEvery;
var init_overEvery = __esmMin((() => {
	init__arrayEvery();
	init__createOver();
	overEvery = createOver(arrayEvery);
}));
//#endregion
//#region ../../node_modules/lodash-es/overSome.js
var overSome;
var init_overSome = __esmMin((() => {
	init__arraySome();
	init__createOver();
	overSome = createOver(arraySome);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseRepeat.js
/**
* The base implementation of `_.repeat` which doesn't coerce arguments.
*
* @private
* @param {string} string The string to repeat.
* @param {number} n The number of times to repeat the string.
* @returns {string} Returns the repeated string.
*/
function baseRepeat(string, n) {
	var result = "";
	if (!string || n < 1 || n > MAX_SAFE_INTEGER$2) return result;
	do {
		if (n % 2) result += string;
		n = nativeFloor$3(n / 2);
		if (n) string += string;
	} while (n);
	return result;
}
var MAX_SAFE_INTEGER$2, nativeFloor$3;
var init__baseRepeat = __esmMin((() => {
	MAX_SAFE_INTEGER$2 = 9007199254740991;
	nativeFloor$3 = Math.floor;
}));
//#endregion
//#region ../../node_modules/lodash-es/_asciiSize.js
var asciiSize;
var init__asciiSize = __esmMin((() => {
	init__baseProperty();
	asciiSize = baseProperty("length");
}));
//#endregion
//#region ../../node_modules/lodash-es/_unicodeSize.js
/**
* Gets the size of a Unicode `string`.
*
* @private
* @param {string} string The string inspect.
* @returns {number} Returns the string size.
*/
function unicodeSize(string) {
	var result = reUnicode.lastIndex = 0;
	while (reUnicode.test(string)) ++result;
	return result;
}
var rsAstralRange, rsComboRange, rsVarRange, rsAstral, rsCombo, rsFitz, rsModifier, rsNonAstral, rsRegional, rsSurrPair, rsZWJ, reOptMod, rsOptVar, rsOptJoin, rsSeq, rsSymbol, reUnicode;
var init__unicodeSize = __esmMin((() => {
	rsAstralRange = "\\ud800-\\udfff", rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", rsVarRange = "\\ufe0e\\ufe0f";
	rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
	reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [
		rsNonAstral,
		rsRegional,
		rsSurrPair
	].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [
		rsNonAstral + rsCombo + "?",
		rsCombo,
		rsRegional,
		rsSurrPair,
		rsAstral
	].join("|") + ")";
	reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
}));
//#endregion
//#region ../../node_modules/lodash-es/_stringSize.js
/**
* Gets the number of symbols in `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the string size.
*/
function stringSize(string) {
	return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
}
var init__stringSize = __esmMin((() => {
	init__asciiSize();
	init__hasUnicode();
	init__unicodeSize();
}));
//#endregion
//#region ../../node_modules/lodash-es/_createPadding.js
/**
* Creates the padding for `string` based on `length`. The `chars` string
* is truncated if the number of characters exceeds `length`.
*
* @private
* @param {number} length The padding length.
* @param {string} [chars=' '] The string used as padding.
* @returns {string} Returns the padding for `string`.
*/
function createPadding(length, chars) {
	chars = chars === void 0 ? " " : baseToString(chars);
	var charsLength = chars.length;
	if (charsLength < 2) return charsLength ? baseRepeat(chars, length) : chars;
	var result = baseRepeat(chars, nativeCeil$2(length / stringSize(chars)));
	return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
}
var nativeCeil$2;
var init__createPadding = __esmMin((() => {
	init__baseRepeat();
	init__baseToString();
	init__castSlice();
	init__hasUnicode();
	init__stringSize();
	init__stringToArray();
	nativeCeil$2 = Math.ceil;
}));
//#endregion
//#region ../../node_modules/lodash-es/pad.js
/**
* Pads `string` on the left and right sides if it's shorter than `length`.
* Padding characters are truncated if they can't be evenly divided by `length`.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to pad.
* @param {number} [length=0] The padding length.
* @param {string} [chars=' '] The string used as padding.
* @returns {string} Returns the padded string.
* @example
*
* _.pad('abc', 8);
* // => '  abc   '
*
* _.pad('abc', 8, '_-');
* // => '_-abc_-_'
*
* _.pad('abc', 3);
* // => 'abc'
*/
function pad(string, length, chars) {
	string = toString(string);
	length = toInteger(length);
	var strLength = length ? stringSize(string) : 0;
	if (!length || strLength >= length) return string;
	var mid = (length - strLength) / 2;
	return createPadding(nativeFloor$2(mid), chars) + string + createPadding(nativeCeil$1(mid), chars);
}
var nativeCeil$1, nativeFloor$2;
var init_pad = __esmMin((() => {
	init__createPadding();
	init__stringSize();
	init_toInteger();
	init_toString();
	nativeCeil$1 = Math.ceil, nativeFloor$2 = Math.floor;
}));
//#endregion
//#region ../../node_modules/lodash-es/padEnd.js
/**
* Pads `string` on the right side if it's shorter than `length`. Padding
* characters are truncated if they exceed `length`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to pad.
* @param {number} [length=0] The padding length.
* @param {string} [chars=' '] The string used as padding.
* @returns {string} Returns the padded string.
* @example
*
* _.padEnd('abc', 6);
* // => 'abc   '
*
* _.padEnd('abc', 6, '_-');
* // => 'abc_-_'
*
* _.padEnd('abc', 3);
* // => 'abc'
*/
function padEnd(string, length, chars) {
	string = toString(string);
	length = toInteger(length);
	var strLength = length ? stringSize(string) : 0;
	return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
}
var init_padEnd = __esmMin((() => {
	init__createPadding();
	init__stringSize();
	init_toInteger();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/padStart.js
/**
* Pads `string` on the left side if it's shorter than `length`. Padding
* characters are truncated if they exceed `length`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to pad.
* @param {number} [length=0] The padding length.
* @param {string} [chars=' '] The string used as padding.
* @returns {string} Returns the padded string.
* @example
*
* _.padStart('abc', 6);
* // => '   abc'
*
* _.padStart('abc', 6, '_-');
* // => '_-_abc'
*
* _.padStart('abc', 3);
* // => 'abc'
*/
function padStart(string, length, chars) {
	string = toString(string);
	length = toInteger(length);
	var strLength = length ? stringSize(string) : 0;
	return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}
var init_padStart = __esmMin((() => {
	init__createPadding();
	init__stringSize();
	init_toInteger();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/parseInt.js
/**
* Converts `string` to an integer of the specified radix. If `radix` is
* `undefined` or `0`, a `radix` of `10` is used unless `value` is a
* hexadecimal, in which case a `radix` of `16` is used.
*
* **Note:** This method aligns with the
* [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
*
* @static
* @memberOf _
* @since 1.1.0
* @category String
* @param {string} string The string to convert.
* @param {number} [radix=10] The radix to interpret `value` by.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {number} Returns the converted integer.
* @example
*
* _.parseInt('08');
* // => 8
*
* _.map(['6', '08', '10'], _.parseInt);
* // => [6, 8, 10]
*/
function parseInt$1(string, radix, guard) {
	if (guard || radix == null) radix = 0;
	else if (radix) radix = +radix;
	return nativeParseInt(toString(string).replace(reTrimStart$1, ""), radix || 0);
}
var reTrimStart$1, nativeParseInt;
var init_parseInt = __esmMin((() => {
	init__root();
	init_toString();
	reTrimStart$1 = /^\s+/;
	nativeParseInt = root.parseInt;
}));
//#endregion
//#region ../../node_modules/lodash-es/partial.js
var WRAP_PARTIAL_FLAG, partial;
var init_partial = __esmMin((() => {
	init__baseRest();
	init__createWrap();
	init__getHolder();
	init__replaceHolders();
	WRAP_PARTIAL_FLAG = 32;
	partial = baseRest(function(func, partials) {
		return createWrap(func, WRAP_PARTIAL_FLAG, void 0, partials, replaceHolders(partials, getHolder(partial)));
	});
	partial.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/partialRight.js
var WRAP_PARTIAL_RIGHT_FLAG, partialRight;
var init_partialRight = __esmMin((() => {
	init__baseRest();
	init__createWrap();
	init__getHolder();
	init__replaceHolders();
	WRAP_PARTIAL_RIGHT_FLAG = 64;
	partialRight = baseRest(function(func, partials) {
		return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, void 0, partials, replaceHolders(partials, getHolder(partialRight)));
	});
	partialRight.placeholder = {};
}));
//#endregion
//#region ../../node_modules/lodash-es/partition.js
var partition;
var init_partition = __esmMin((() => {
	init__createAggregator();
	partition = createAggregator(function(result, value, key) {
		result[key ? 0 : 1].push(value);
	}, function() {
		return [[], []];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_basePick.js
/**
* The base implementation of `_.pick` without support for individual
* property identifiers.
*
* @private
* @param {Object} object The source object.
* @param {string[]} paths The property paths to pick.
* @returns {Object} Returns the new object.
*/
function basePick(object, paths) {
	return basePickBy(object, paths, function(value, path) {
		return hasIn(object, path);
	});
}
var init__basePick = __esmMin((() => {
	init__basePickBy();
	init_hasIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/pick.js
var pick;
var init_pick = __esmMin((() => {
	init__basePick();
	init__flatRest();
	pick = flatRest(function(object, paths) {
		return object == null ? {} : basePick(object, paths);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/plant.js
/**
* Creates a clone of the chain sequence planting `value` as the wrapped value.
*
* @name plant
* @memberOf _
* @since 3.2.0
* @category Seq
* @param {*} value The value to plant.
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* var wrapped = _([1, 2]).map(square);
* var other = wrapped.plant([3, 4]);
*
* other.value();
* // => [9, 16]
*
* wrapped.value();
* // => [1, 4]
*/
function wrapperPlant(value) {
	var result, parent = this;
	while (parent instanceof baseLodash) {
		var clone = wrapperClone(parent);
		clone.__index__ = 0;
		clone.__values__ = void 0;
		if (result) previous.__wrapped__ = clone;
		else result = clone;
		var previous = clone;
		parent = parent.__wrapped__;
	}
	previous.__wrapped__ = value;
	return result;
}
var init_plant = __esmMin((() => {
	init__baseLodash();
	init__wrapperClone();
}));
//#endregion
//#region ../../node_modules/lodash-es/propertyOf.js
/**
* The opposite of `_.property`; this method creates a function that returns
* the value at a given path of `object`.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Util
* @param {Object} object The object to query.
* @returns {Function} Returns the new accessor function.
* @example
*
* var array = [0, 1, 2],
*     object = { 'a': array, 'b': array, 'c': array };
*
* _.map(['a[2]', 'c[0]'], _.propertyOf(object));
* // => [2, 0]
*
* _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
* // => [2, 0]
*/
function propertyOf(object) {
	return function(path) {
		return object == null ? void 0 : baseGet(object, path);
	};
}
var init_propertyOf = __esmMin((() => {
	init__baseGet();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseIndexOfWith.js
/**
* This function is like `baseIndexOf` except that it accepts a comparator.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @param {Function} comparator The comparator invoked per element.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseIndexOfWith(array, value, fromIndex, comparator) {
	var index = fromIndex - 1, length = array.length;
	while (++index < length) if (comparator(array[index], value)) return index;
	return -1;
}
var init__baseIndexOfWith = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_basePullAll.js
/**
* The base implementation of `_.pullAllBy` without support for iteratee
* shorthands.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to remove.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns `array`.
*/
function basePullAll(array, values, iteratee, comparator) {
	var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
	if (array === values) values = copyArray(values);
	if (iteratee) seen = arrayMap(array, baseUnary(iteratee));
	while (++index < length) {
		var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
		while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
			if (seen !== array) splice$1.call(seen, fromIndex, 1);
			splice$1.call(array, fromIndex, 1);
		}
	}
	return array;
}
var splice$1;
var init__basePullAll = __esmMin((() => {
	init__arrayMap();
	init__baseIndexOf();
	init__baseIndexOfWith();
	init__baseUnary();
	init__copyArray();
	splice$1 = Array.prototype.splice;
}));
//#endregion
//#region ../../node_modules/lodash-es/pullAll.js
/**
* This method is like `_.pull` except that it accepts an array of values to remove.
*
* **Note:** Unlike `_.difference`, this method mutates `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to modify.
* @param {Array} values The values to remove.
* @returns {Array} Returns `array`.
* @example
*
* var array = ['a', 'b', 'c', 'a', 'b', 'c'];
*
* _.pullAll(array, ['a', 'c']);
* console.log(array);
* // => ['b', 'b']
*/
function pullAll(array, values) {
	return array && array.length && values && values.length ? basePullAll(array, values) : array;
}
var init_pullAll = __esmMin((() => {
	init__basePullAll();
}));
//#endregion
//#region ../../node_modules/lodash-es/pull.js
var pull;
var init_pull = __esmMin((() => {
	init__baseRest();
	init_pullAll();
	pull = baseRest(pullAll);
}));
//#endregion
//#region ../../node_modules/lodash-es/pullAllBy.js
/**
* This method is like `_.pullAll` except that it accepts `iteratee` which is
* invoked for each element of `array` and `values` to generate the criterion
* by which they're compared. The iteratee is invoked with one argument: (value).
*
* **Note:** Unlike `_.differenceBy`, this method mutates `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to modify.
* @param {Array} values The values to remove.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {Array} Returns `array`.
* @example
*
* var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
*
* _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
* console.log(array);
* // => [{ 'x': 2 }]
*/
function pullAllBy(array, values, iteratee) {
	return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee, 2)) : array;
}
var init_pullAllBy = __esmMin((() => {
	init__baseIteratee();
	init__basePullAll();
}));
//#endregion
//#region ../../node_modules/lodash-es/pullAllWith.js
/**
* This method is like `_.pullAll` except that it accepts `comparator` which
* is invoked to compare elements of `array` to `values`. The comparator is
* invoked with two arguments: (arrVal, othVal).
*
* **Note:** Unlike `_.differenceWith`, this method mutates `array`.
*
* @static
* @memberOf _
* @since 4.6.0
* @category Array
* @param {Array} array The array to modify.
* @param {Array} values The values to remove.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns `array`.
* @example
*
* var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
*
* _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
* console.log(array);
* // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
*/
function pullAllWith(array, values, comparator) {
	return array && array.length && values && values.length ? basePullAll(array, values, void 0, comparator) : array;
}
var init_pullAllWith = __esmMin((() => {
	init__basePullAll();
}));
//#endregion
//#region ../../node_modules/lodash-es/_basePullAt.js
/**
* The base implementation of `_.pullAt` without support for individual
* indexes or capturing the removed elements.
*
* @private
* @param {Array} array The array to modify.
* @param {number[]} indexes The indexes of elements to remove.
* @returns {Array} Returns `array`.
*/
function basePullAt(array, indexes) {
	var length = array ? indexes.length : 0, lastIndex = length - 1;
	while (length--) {
		var index = indexes[length];
		if (length == lastIndex || index !== previous) {
			var previous = index;
			if (isIndex(index)) splice.call(array, index, 1);
			else baseUnset(array, index);
		}
	}
	return array;
}
var splice;
var init__basePullAt = __esmMin((() => {
	init__baseUnset();
	init__isIndex();
	splice = Array.prototype.splice;
}));
//#endregion
//#region ../../node_modules/lodash-es/pullAt.js
var pullAt;
var init_pullAt = __esmMin((() => {
	init__arrayMap();
	init__baseAt();
	init__basePullAt();
	init__compareAscending();
	init__flatRest();
	init__isIndex();
	pullAt = flatRest(function(array, indexes) {
		var length = array == null ? 0 : array.length, result = baseAt(array, indexes);
		basePullAt(array, arrayMap(indexes, function(index) {
			return isIndex(index, length) ? +index : index;
		}).sort(compareAscending));
		return result;
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseRandom.js
/**
* The base implementation of `_.random` without support for returning
* floating-point numbers.
*
* @private
* @param {number} lower The lower bound.
* @param {number} upper The upper bound.
* @returns {number} Returns the random number.
*/
function baseRandom(lower, upper) {
	return lower + nativeFloor$1(nativeRandom$1() * (upper - lower + 1));
}
var nativeFloor$1, nativeRandom$1;
var init__baseRandom = __esmMin((() => {
	nativeFloor$1 = Math.floor, nativeRandom$1 = Math.random;
}));
//#endregion
//#region ../../node_modules/lodash-es/random.js
/**
* Produces a random number between the inclusive `lower` and `upper` bounds.
* If only one argument is provided a number between `0` and the given number
* is returned. If `floating` is `true`, or either `lower` or `upper` are
* floats, a floating-point number is returned instead of an integer.
*
* **Note:** JavaScript follows the IEEE-754 standard for resolving
* floating-point values which can produce unexpected results.
*
* **Note:** If `lower` is greater than `upper`, the values are swapped.
*
* @static
* @memberOf _
* @since 0.7.0
* @category Number
* @param {number} [lower=0] The lower bound.
* @param {number} [upper=1] The upper bound.
* @param {boolean} [floating] Specify returning a floating-point number.
* @returns {number} Returns the random number.
* @example
*
* _.random(0, 5);
* // => an integer between 0 and 5
*
* // when lower is greater than upper the values are swapped
* _.random(5, 0);
* // => an integer between 0 and 5
*
* _.random(5);
* // => also an integer between 0 and 5
*
* _.random(-5);
* // => an integer between -5 and 0
*
* _.random(5, true);
* // => a floating-point number between 0 and 5
*
* _.random(1.2, 5.2);
* // => a floating-point number between 1.2 and 5.2
*/
function random(lower, upper, floating) {
	if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) upper = floating = void 0;
	if (floating === void 0) {
		if (typeof upper == "boolean") {
			floating = upper;
			upper = void 0;
		} else if (typeof lower == "boolean") {
			floating = lower;
			lower = void 0;
		}
	}
	if (lower === void 0 && upper === void 0) {
		lower = 0;
		upper = 1;
	} else {
		lower = toFinite(lower);
		if (upper === void 0) {
			upper = lower;
			lower = 0;
		} else upper = toFinite(upper);
	}
	if (lower > upper) {
		var temp = lower;
		lower = upper;
		upper = temp;
	}
	if (floating || lower % 1 || upper % 1) {
		var rand = nativeRandom();
		return nativeMin$5(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
	}
	return baseRandom(lower, upper);
}
var freeParseFloat, nativeMin$5, nativeRandom;
var init_random = __esmMin((() => {
	init__baseRandom();
	init__isIterateeCall();
	init_toFinite();
	freeParseFloat = parseFloat;
	nativeMin$5 = Math.min, nativeRandom = Math.random;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseRange.js
/**
* The base implementation of `_.range` and `_.rangeRight` which doesn't
* coerce arguments.
*
* @private
* @param {number} start The start of the range.
* @param {number} end The end of the range.
* @param {number} step The value to increment or decrement by.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Array} Returns the range of numbers.
*/
function baseRange(start, end, step, fromRight) {
	var index = -1, length = nativeMax$4(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
	while (length--) {
		result[fromRight ? length : ++index] = start;
		start += step;
	}
	return result;
}
var nativeCeil, nativeMax$4;
var init__baseRange = __esmMin((() => {
	nativeCeil = Math.ceil, nativeMax$4 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/_createRange.js
/**
* Creates a `_.range` or `_.rangeRight` function.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new range function.
*/
function createRange(fromRight) {
	return function(start, end, step) {
		if (step && typeof step != "number" && isIterateeCall(start, end, step)) end = step = void 0;
		start = toFinite(start);
		if (end === void 0) {
			end = start;
			start = 0;
		} else end = toFinite(end);
		step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
		return baseRange(start, end, step, fromRight);
	};
}
var init__createRange = __esmMin((() => {
	init__baseRange();
	init__isIterateeCall();
	init_toFinite();
}));
//#endregion
//#region ../../node_modules/lodash-es/range.js
var range;
var init_range = __esmMin((() => {
	init__createRange();
	range = createRange();
}));
//#endregion
//#region ../../node_modules/lodash-es/rangeRight.js
var rangeRight;
var init_rangeRight = __esmMin((() => {
	init__createRange();
	rangeRight = createRange(true);
}));
//#endregion
//#region ../../node_modules/lodash-es/rearg.js
var WRAP_REARG_FLAG, rearg;
var init_rearg = __esmMin((() => {
	init__createWrap();
	init__flatRest();
	WRAP_REARG_FLAG = 256;
	rearg = flatRest(function(func, indexes) {
		return createWrap(func, WRAP_REARG_FLAG, void 0, void 0, void 0, indexes);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseReduce.js
/**
* The base implementation of `_.reduce` and `_.reduceRight`, without support
* for iteratee shorthands, which iterates over `collection` using `eachFunc`.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {*} accumulator The initial value.
* @param {boolean} initAccum Specify using the first or last element of
*  `collection` as the initial value.
* @param {Function} eachFunc The function to iterate over `collection`.
* @returns {*} Returns the accumulated value.
*/
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	eachFunc(collection, function(value, index, collection) {
		accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
	});
	return accumulator;
}
var init__baseReduce = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/reduce.js
/**
* Reduces `collection` to a value which is the accumulated result of running
* each element in `collection` thru `iteratee`, where each successive
* invocation is supplied the return value of the previous. If `accumulator`
* is not given, the first element of `collection` is used as the initial
* value. The iteratee is invoked with four arguments:
* (accumulator, value, index|key, collection).
*
* Many lodash methods are guarded to work as iteratees for methods like
* `_.reduce`, `_.reduceRight`, and `_.transform`.
*
* The guarded methods are:
* `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
* and `sortBy`
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @returns {*} Returns the accumulated value.
* @see _.reduceRight
* @example
*
* _.reduce([1, 2], function(sum, n) {
*   return sum + n;
* }, 0);
* // => 3
*
* _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
*   (result[value] || (result[value] = [])).push(key);
*   return result;
* }, {});
* // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
*/
function reduce(collection, iteratee, accumulator) {
	var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
	return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
var init_reduce = __esmMin((() => {
	init__arrayReduce();
	init__baseEach();
	init__baseIteratee();
	init__baseReduce();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayReduceRight.js
/**
* A specialized version of `_.reduceRight` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @param {boolean} [initAccum] Specify using the last element of `array` as
*  the initial value.
* @returns {*} Returns the accumulated value.
*/
function arrayReduceRight(array, iteratee, accumulator, initAccum) {
	var length = array == null ? 0 : array.length;
	if (initAccum && length) accumulator = array[--length];
	while (length--) accumulator = iteratee(accumulator, array[length], length, array);
	return accumulator;
}
var init__arrayReduceRight = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/reduceRight.js
/**
* This method is like `_.reduce` except that it iterates over elements of
* `collection` from right to left.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @returns {*} Returns the accumulated value.
* @see _.reduce
* @example
*
* var array = [[0, 1], [2, 3], [4, 5]];
*
* _.reduceRight(array, function(flattened, other) {
*   return flattened.concat(other);
* }, []);
* // => [4, 5, 2, 3, 0, 1]
*/
function reduceRight(collection, iteratee, accumulator) {
	var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
	return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
}
var init_reduceRight = __esmMin((() => {
	init__arrayReduceRight();
	init__baseEachRight();
	init__baseIteratee();
	init__baseReduce();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/reject.js
/**
* The opposite of `_.filter`; this method returns the elements of `collection`
* that `predicate` does **not** return truthy for.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
* @see _.filter
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': false },
*   { 'user': 'fred',   'age': 40, 'active': true }
* ];
*
* _.reject(users, function(o) { return !o.active; });
* // => objects for ['fred']
*
* // The `_.matches` iteratee shorthand.
* _.reject(users, { 'age': 40, 'active': true });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.reject(users, ['active', false]);
* // => objects for ['fred']
*
* // The `_.property` iteratee shorthand.
* _.reject(users, 'active');
* // => objects for ['barney']
*/
function reject(collection, predicate) {
	return (isArray(collection) ? arrayFilter : baseFilter)(collection, negate(baseIteratee(predicate, 3)));
}
var init_reject = __esmMin((() => {
	init__arrayFilter();
	init__baseFilter();
	init__baseIteratee();
	init_isArray();
	init_negate();
}));
//#endregion
//#region ../../node_modules/lodash-es/remove.js
/**
* Removes all elements from `array` that `predicate` returns truthy for
* and returns an array of the removed elements. The predicate is invoked
* with three arguments: (value, index, array).
*
* **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
* to pull elements from an array by value.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Array
* @param {Array} array The array to modify.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new array of removed elements.
* @example
*
* var array = [1, 2, 3, 4];
* var evens = _.remove(array, function(n) {
*   return n % 2 == 0;
* });
*
* console.log(array);
* // => [1, 3]
*
* console.log(evens);
* // => [2, 4]
*/
function remove(array, predicate) {
	var result = [];
	if (!(array && array.length)) return result;
	var index = -1, indexes = [], length = array.length;
	predicate = baseIteratee(predicate, 3);
	while (++index < length) {
		var value = array[index];
		if (predicate(value, index, array)) {
			result.push(value);
			indexes.push(index);
		}
	}
	basePullAt(array, indexes);
	return result;
}
var init_remove = __esmMin((() => {
	init__baseIteratee();
	init__basePullAt();
}));
//#endregion
//#region ../../node_modules/lodash-es/repeat.js
/**
* Repeats the given string `n` times.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to repeat.
* @param {number} [n=1] The number of times to repeat the string.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {string} Returns the repeated string.
* @example
*
* _.repeat('*', 3);
* // => '***'
*
* _.repeat('abc', 2);
* // => 'abcabc'
*
* _.repeat('abc', 0);
* // => ''
*/
function repeat(string, n, guard) {
	if (guard ? isIterateeCall(string, n, guard) : n === void 0) n = 1;
	else n = toInteger(n);
	return baseRepeat(toString(string), n);
}
var init_repeat = __esmMin((() => {
	init__baseRepeat();
	init__isIterateeCall();
	init_toInteger();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/replace.js
/**
* Replaces matches for `pattern` in `string` with `replacement`.
*
* **Note:** This method is based on
* [`String#replace`](https://mdn.io/String/replace).
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to modify.
* @param {RegExp|string} pattern The pattern to replace.
* @param {Function|string} replacement The match replacement.
* @returns {string} Returns the modified string.
* @example
*
* _.replace('Hi Fred', 'Fred', 'Barney');
* // => 'Hi Barney'
*/
function replace() {
	var args = arguments, string = toString(args[0]);
	return args.length < 3 ? string : string.replace(args[1], args[2]);
}
var init_replace = __esmMin((() => {
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/rest.js
/**
* Creates a function that invokes `func` with the `this` binding of the
* created function and arguments from `start` and beyond provided as
* an array.
*
* **Note:** This method is based on the
* [rest parameter](https://mdn.io/rest_parameters).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Function
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @returns {Function} Returns the new function.
* @example
*
* var say = _.rest(function(what, names) {
*   return what + ' ' + _.initial(names).join(', ') +
*     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
* });
*
* say('hello', 'fred', 'barney', 'pebbles');
* // => 'hello fred, barney, & pebbles'
*/
function rest(func, start) {
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$2);
	start = start === void 0 ? start : toInteger(start);
	return baseRest(func, start);
}
var FUNC_ERROR_TEXT$2;
var init_rest = __esmMin((() => {
	init__baseRest();
	init_toInteger();
	FUNC_ERROR_TEXT$2 = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/result.js
/**
* This method is like `_.get` except that if the resolved value is a
* function it's invoked with the `this` binding of its parent object and
* its result is returned.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to resolve.
* @param {*} [defaultValue] The value returned for `undefined` resolved values.
* @returns {*} Returns the resolved value.
* @example
*
* var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
*
* _.result(object, 'a[0].b.c1');
* // => 3
*
* _.result(object, 'a[0].b.c2');
* // => 4
*
* _.result(object, 'a[0].b.c3', 'default');
* // => 'default'
*
* _.result(object, 'a[0].b.c3', _.constant('default'));
* // => 'default'
*/
function result(object, path, defaultValue) {
	path = castPath(path, object);
	var index = -1, length = path.length;
	if (!length) {
		length = 1;
		object = void 0;
	}
	while (++index < length) {
		var value = object == null ? void 0 : object[toKey(path[index])];
		if (value === void 0) {
			index = length;
			value = defaultValue;
		}
		object = isFunction(value) ? value.call(object) : value;
	}
	return object;
}
var init_result = __esmMin((() => {
	init__castPath();
	init_isFunction();
	init__toKey();
}));
//#endregion
//#region ../../node_modules/lodash-es/reverse.js
/**
* Reverses `array` so that the first element becomes the last, the second
* element becomes the second to last, and so on.
*
* **Note:** This method mutates `array` and is based on
* [`Array#reverse`](https://mdn.io/Array/reverse).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to modify.
* @returns {Array} Returns `array`.
* @example
*
* var array = [1, 2, 3];
*
* _.reverse(array);
* // => [3, 2, 1]
*
* console.log(array);
* // => [3, 2, 1]
*/
function reverse(array) {
	return array == null ? array : nativeReverse.call(array);
}
var nativeReverse;
var init_reverse = __esmMin((() => {
	nativeReverse = Array.prototype.reverse;
}));
//#endregion
//#region ../../node_modules/lodash-es/round.js
var round;
var init_round = __esmMin((() => {
	init__createRound();
	round = createRound("round");
}));
//#endregion
//#region ../../node_modules/lodash-es/_arraySample.js
/**
* A specialized version of `_.sample` for arrays.
*
* @private
* @param {Array} array The array to sample.
* @returns {*} Returns the random element.
*/
function arraySample(array) {
	var length = array.length;
	return length ? array[baseRandom(0, length - 1)] : void 0;
}
var init__arraySample = __esmMin((() => {
	init__baseRandom();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSample.js
/**
* The base implementation of `_.sample`.
*
* @private
* @param {Array|Object} collection The collection to sample.
* @returns {*} Returns the random element.
*/
function baseSample(collection) {
	return arraySample(values(collection));
}
var init__baseSample = __esmMin((() => {
	init__arraySample();
	init_values();
}));
//#endregion
//#region ../../node_modules/lodash-es/sample.js
/**
* Gets a random element from `collection`.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Collection
* @param {Array|Object} collection The collection to sample.
* @returns {*} Returns the random element.
* @example
*
* _.sample([1, 2, 3, 4]);
* // => 2
*/
function sample(collection) {
	return (isArray(collection) ? arraySample : baseSample)(collection);
}
var init_sample = __esmMin((() => {
	init__arraySample();
	init__baseSample();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_shuffleSelf.js
/**
* A specialized version of `_.shuffle` which mutates and sets the size of `array`.
*
* @private
* @param {Array} array The array to shuffle.
* @param {number} [size=array.length] The size of `array`.
* @returns {Array} Returns `array`.
*/
function shuffleSelf(array, size) {
	var index = -1, length = array.length, lastIndex = length - 1;
	size = size === void 0 ? length : size;
	while (++index < size) {
		var rand = baseRandom(index, lastIndex), value = array[rand];
		array[rand] = array[index];
		array[index] = value;
	}
	array.length = size;
	return array;
}
var init__shuffleSelf = __esmMin((() => {
	init__baseRandom();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arraySampleSize.js
/**
* A specialized version of `_.sampleSize` for arrays.
*
* @private
* @param {Array} array The array to sample.
* @param {number} n The number of elements to sample.
* @returns {Array} Returns the random elements.
*/
function arraySampleSize(array, n) {
	return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}
var init__arraySampleSize = __esmMin((() => {
	init__baseClamp();
	init__copyArray();
	init__shuffleSelf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSampleSize.js
/**
* The base implementation of `_.sampleSize` without param guards.
*
* @private
* @param {Array|Object} collection The collection to sample.
* @param {number} n The number of elements to sample.
* @returns {Array} Returns the random elements.
*/
function baseSampleSize(collection, n) {
	var array = values(collection);
	return shuffleSelf(array, baseClamp(n, 0, array.length));
}
var init__baseSampleSize = __esmMin((() => {
	init__baseClamp();
	init__shuffleSelf();
	init_values();
}));
//#endregion
//#region ../../node_modules/lodash-es/sampleSize.js
/**
* Gets `n` random elements at unique keys from `collection` up to the
* size of `collection`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to sample.
* @param {number} [n=1] The number of elements to sample.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the random elements.
* @example
*
* _.sampleSize([1, 2, 3], 2);
* // => [3, 1]
*
* _.sampleSize([1, 2, 3], 4);
* // => [2, 3, 1]
*/
function sampleSize(collection, n, guard) {
	if (guard ? isIterateeCall(collection, n, guard) : n === void 0) n = 1;
	else n = toInteger(n);
	return (isArray(collection) ? arraySampleSize : baseSampleSize)(collection, n);
}
var init_sampleSize = __esmMin((() => {
	init__arraySampleSize();
	init__baseSampleSize();
	init_isArray();
	init__isIterateeCall();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/set.js
/**
* Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
* it's created. Arrays are created for missing index properties while objects
* are created for all other missing properties. Use `_.setWith` to customize
* `path` creation.
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @returns {Object} Returns `object`.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.set(object, 'a[0].b.c', 4);
* console.log(object.a[0].b.c);
* // => 4
*
* _.set(object, ['x', '0', 'y', 'z'], 5);
* console.log(object.x[0].y.z);
* // => 5
*/
function set(object, path, value) {
	return object == null ? object : baseSet(object, path, value);
}
var init_set = __esmMin((() => {
	init__baseSet();
}));
//#endregion
//#region ../../node_modules/lodash-es/setWith.js
/**
* This method is like `_.set` except that it accepts `customizer` which is
* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
* path creation is handled by the method instead. The `customizer` is invoked
* with three arguments: (nsValue, key, nsObject).
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @param {Function} [customizer] The function to customize assigned values.
* @returns {Object} Returns `object`.
* @example
*
* var object = {};
*
* _.setWith(object, '[0][1]', 'a', Object);
* // => { '0': { '1': 'a' } }
*/
function setWith(object, path, value, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	return object == null ? object : baseSet(object, path, value, customizer);
}
var init_setWith = __esmMin((() => {
	init__baseSet();
}));
//#endregion
//#region ../../node_modules/lodash-es/_arrayShuffle.js
/**
* A specialized version of `_.shuffle` for arrays.
*
* @private
* @param {Array} array The array to shuffle.
* @returns {Array} Returns the new shuffled array.
*/
function arrayShuffle(array) {
	return shuffleSelf(copyArray(array));
}
var init__arrayShuffle = __esmMin((() => {
	init__copyArray();
	init__shuffleSelf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseShuffle.js
/**
* The base implementation of `_.shuffle`.
*
* @private
* @param {Array|Object} collection The collection to shuffle.
* @returns {Array} Returns the new shuffled array.
*/
function baseShuffle(collection) {
	return shuffleSelf(values(collection));
}
var init__baseShuffle = __esmMin((() => {
	init__shuffleSelf();
	init_values();
}));
//#endregion
//#region ../../node_modules/lodash-es/shuffle.js
/**
* Creates an array of shuffled values, using a version of the
* [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to shuffle.
* @returns {Array} Returns the new shuffled array.
* @example
*
* _.shuffle([1, 2, 3, 4]);
* // => [4, 1, 3, 2]
*/
function shuffle(collection) {
	return (isArray(collection) ? arrayShuffle : baseShuffle)(collection);
}
var init_shuffle = __esmMin((() => {
	init__arrayShuffle();
	init__baseShuffle();
	init_isArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/size.js
/**
* Gets the size of `collection` by returning its length for array-like
* values or the number of own enumerable string keyed properties for objects.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object|string} collection The collection to inspect.
* @returns {number} Returns the collection size.
* @example
*
* _.size([1, 2, 3]);
* // => 3
*
* _.size({ 'a': 1, 'b': 2 });
* // => 2
*
* _.size('pebbles');
* // => 7
*/
function size(collection) {
	if (collection == null) return 0;
	if (isArrayLike(collection)) return isString(collection) ? stringSize(collection) : collection.length;
	var tag = _getTag_default(collection);
	if (tag == mapTag || tag == setTag) return collection.size;
	return baseKeys(collection).length;
}
var mapTag, setTag;
var init_size = __esmMin((() => {
	init__baseKeys();
	init__getTag();
	init_isArrayLike();
	init_isString();
	init__stringSize();
	mapTag = "[object Map]", setTag = "[object Set]";
}));
//#endregion
//#region ../../node_modules/lodash-es/slice.js
/**
* Creates a slice of `array` from `start` up to, but not including, `end`.
*
* **Note:** This method is used instead of
* [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
* returned.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to slice.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns the slice of `array`.
*/
function slice(array, start, end) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
		start = 0;
		end = length;
	} else {
		start = start == null ? 0 : toInteger(start);
		end = end === void 0 ? length : toInteger(end);
	}
	return baseSlice(array, start, end);
}
var init_slice = __esmMin((() => {
	init__baseSlice();
	init__isIterateeCall();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/snakeCase.js
var snakeCase;
var init_snakeCase = __esmMin((() => {
	init__createCompounder();
	snakeCase = createCompounder(function(result, word, index) {
		return result + (index ? "_" : "") + word.toLowerCase();
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSome.js
/**
* The base implementation of `_.some` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function baseSome(collection, predicate) {
	var result;
	baseEach(collection, function(value, index, collection) {
		result = predicate(value, index, collection);
		return !result;
	});
	return !!result;
}
var init__baseSome = __esmMin((() => {
	init__baseEach();
}));
//#endregion
//#region ../../node_modules/lodash-es/some.js
/**
* Checks if `predicate` returns truthy for **any** element of `collection`.
* Iteration is stopped once `predicate` returns truthy. The predicate is
* invoked with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
* @example
*
* _.some([null, 0, 'yes', false], Boolean);
* // => true
*
* var users = [
*   { 'user': 'barney', 'active': true },
*   { 'user': 'fred',   'active': false }
* ];
*
* // The `_.matches` iteratee shorthand.
* _.some(users, { 'user': 'barney', 'active': false });
* // => false
*
* // The `_.matchesProperty` iteratee shorthand.
* _.some(users, ['active', false]);
* // => true
*
* // The `_.property` iteratee shorthand.
* _.some(users, 'active');
* // => true
*/
function some(collection, predicate, guard) {
	var func = isArray(collection) ? arraySome : baseSome;
	if (guard && isIterateeCall(collection, predicate, guard)) predicate = void 0;
	return func(collection, baseIteratee(predicate, 3));
}
var init_some = __esmMin((() => {
	init__arraySome();
	init__baseIteratee();
	init__baseSome();
	init_isArray();
	init__isIterateeCall();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortBy.js
var sortBy;
var init_sortBy = __esmMin((() => {
	init__baseFlatten();
	init__baseOrderBy();
	init__baseRest();
	init__isIterateeCall();
	sortBy = baseRest(function(collection, iteratees) {
		if (collection == null) return [];
		var length = iteratees.length;
		if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) iteratees = [];
		else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) iteratees = [iteratees[0]];
		return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSortedIndexBy.js
/**
* The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
* which invokes `iteratee` for `value` and each element of `array` to compute
* their sort ranking. The iteratee is invoked with one argument; (value).
*
* @private
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @param {Function} iteratee The iteratee invoked per element.
* @param {boolean} [retHighest] Specify returning the highest qualified index.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
*/
function baseSortedIndexBy(array, value, iteratee, retHighest) {
	var low = 0, high = array == null ? 0 : array.length;
	if (high === 0) return 0;
	value = iteratee(value);
	var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === void 0;
	while (low < high) {
		var mid = nativeFloor((low + high) / 2), computed = iteratee(array[mid]), othIsDefined = computed !== void 0, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
		if (valIsNaN) var setLow = retHighest || othIsReflexive;
		else if (valIsUndefined) setLow = othIsReflexive && (retHighest || othIsDefined);
		else if (valIsNull) setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
		else if (valIsSymbol) setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
		else if (othIsNull || othIsSymbol) setLow = false;
		else setLow = retHighest ? computed <= value : computed < value;
		if (setLow) low = mid + 1;
		else high = mid;
	}
	return nativeMin$4(high, MAX_ARRAY_INDEX);
}
var MAX_ARRAY_INDEX, nativeFloor, nativeMin$4;
var init__baseSortedIndexBy = __esmMin((() => {
	init_isSymbol();
	MAX_ARRAY_INDEX = 4294967294;
	nativeFloor = Math.floor, nativeMin$4 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSortedIndex.js
/**
* The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
* performs a binary search of `array` to determine the index at which `value`
* should be inserted into `array` in order to maintain its sort order.
*
* @private
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @param {boolean} [retHighest] Specify returning the highest qualified index.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
*/
function baseSortedIndex(array, value, retHighest) {
	var low = 0, high = array == null ? low : array.length;
	if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
		while (low < high) {
			var mid = low + high >>> 1, computed = array[mid];
			if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) low = mid + 1;
			else high = mid;
		}
		return high;
	}
	return baseSortedIndexBy(array, value, identity, retHighest);
}
var HALF_MAX_ARRAY_LENGTH;
var init__baseSortedIndex = __esmMin((() => {
	init__baseSortedIndexBy();
	init_identity();
	init_isSymbol();
	HALF_MAX_ARRAY_LENGTH = 2147483647;
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedIndex.js
/**
* Uses a binary search to determine the lowest index at which `value`
* should be inserted into `array` in order to maintain its sort order.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
* @example
*
* _.sortedIndex([30, 50], 40);
* // => 1
*/
function sortedIndex(array, value) {
	return baseSortedIndex(array, value);
}
var init_sortedIndex = __esmMin((() => {
	init__baseSortedIndex();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedIndexBy.js
/**
* This method is like `_.sortedIndex` except that it accepts `iteratee`
* which is invoked for `value` and each element of `array` to compute their
* sort ranking. The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
* @example
*
* var objects = [{ 'x': 4 }, { 'x': 5 }];
*
* _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
* // => 0
*
* // The `_.property` iteratee shorthand.
* _.sortedIndexBy(objects, { 'x': 4 }, 'x');
* // => 0
*/
function sortedIndexBy(array, value, iteratee) {
	return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}
var init_sortedIndexBy = __esmMin((() => {
	init__baseIteratee();
	init__baseSortedIndexBy();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedIndexOf.js
/**
* This method is like `_.indexOf` except that it performs a binary
* search on a sorted `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
* @example
*
* _.sortedIndexOf([4, 5, 5, 5, 6], 5);
* // => 1
*/
function sortedIndexOf(array, value) {
	var length = array == null ? 0 : array.length;
	if (length) {
		var index = baseSortedIndex(array, value);
		if (index < length && eq(array[index], value)) return index;
	}
	return -1;
}
var init_sortedIndexOf = __esmMin((() => {
	init__baseSortedIndex();
	init_eq();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedLastIndex.js
/**
* This method is like `_.sortedIndex` except that it returns the highest
* index at which `value` should be inserted into `array` in order to
* maintain its sort order.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
* @example
*
* _.sortedLastIndex([4, 5, 5, 5, 6], 5);
* // => 4
*/
function sortedLastIndex(array, value) {
	return baseSortedIndex(array, value, true);
}
var init_sortedLastIndex = __esmMin((() => {
	init__baseSortedIndex();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedLastIndexBy.js
/**
* This method is like `_.sortedLastIndex` except that it accepts `iteratee`
* which is invoked for `value` and each element of `array` to compute their
* sort ranking. The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The sorted array to inspect.
* @param {*} value The value to evaluate.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {number} Returns the index at which `value` should be inserted
*  into `array`.
* @example
*
* var objects = [{ 'x': 4 }, { 'x': 5 }];
*
* _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
* // => 1
*
* // The `_.property` iteratee shorthand.
* _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
* // => 1
*/
function sortedLastIndexBy(array, value, iteratee) {
	return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}
var init_sortedLastIndexBy = __esmMin((() => {
	init__baseIteratee();
	init__baseSortedIndexBy();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedLastIndexOf.js
/**
* This method is like `_.lastIndexOf` except that it performs a binary
* search on a sorted `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
* @example
*
* _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
* // => 3
*/
function sortedLastIndexOf(array, value) {
	if (array == null ? 0 : array.length) {
		var index = baseSortedIndex(array, value, true) - 1;
		if (eq(array[index], value)) return index;
	}
	return -1;
}
var init_sortedLastIndexOf = __esmMin((() => {
	init__baseSortedIndex();
	init_eq();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseSortedUniq.js
/**
* The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @returns {Array} Returns the new duplicate free array.
*/
function baseSortedUniq(array, iteratee) {
	var index = -1, length = array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index], computed = iteratee ? iteratee(value) : value;
		if (!index || !eq(computed, seen)) {
			var seen = computed;
			result[resIndex++] = value === 0 ? 0 : value;
		}
	}
	return result;
}
var init__baseSortedUniq = __esmMin((() => {
	init_eq();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedUniq.js
/**
* This method is like `_.uniq` except that it's designed and optimized
* for sorted arrays.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.sortedUniq([1, 1, 2]);
* // => [1, 2]
*/
function sortedUniq(array) {
	return array && array.length ? baseSortedUniq(array) : [];
}
var init_sortedUniq = __esmMin((() => {
	init__baseSortedUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/sortedUniqBy.js
/**
* This method is like `_.uniqBy` except that it's designed and optimized
* for sorted arrays.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
* // => [1.1, 2.3]
*/
function sortedUniqBy(array, iteratee) {
	return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}
var init_sortedUniqBy = __esmMin((() => {
	init__baseIteratee();
	init__baseSortedUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/split.js
/**
* Splits `string` by `separator`.
*
* **Note:** This method is based on
* [`String#split`](https://mdn.io/String/split).
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to split.
* @param {RegExp|string} separator The separator pattern to split by.
* @param {number} [limit] The length to truncate results to.
* @returns {Array} Returns the string segments.
* @example
*
* _.split('a-b-c', '-', 2);
* // => ['a', 'b']
*/
function split(string, separator, limit) {
	if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) separator = limit = void 0;
	limit = limit === void 0 ? MAX_ARRAY_LENGTH$2 : limit >>> 0;
	if (!limit) return [];
	string = toString(string);
	if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
		separator = baseToString(separator);
		if (!separator && hasUnicode(string)) return castSlice(stringToArray(string), 0, limit);
	}
	return string.split(separator, limit);
}
var MAX_ARRAY_LENGTH$2;
var init_split = __esmMin((() => {
	init__baseToString();
	init__castSlice();
	init__hasUnicode();
	init__isIterateeCall();
	init_isRegExp();
	init__stringToArray();
	init_toString();
	MAX_ARRAY_LENGTH$2 = 4294967295;
}));
//#endregion
//#region ../../node_modules/lodash-es/spread.js
/**
* Creates a function that invokes `func` with the `this` binding of the
* create function and an array of arguments much like
* [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
*
* **Note:** This method is based on the
* [spread operator](https://mdn.io/spread_operator).
*
* @static
* @memberOf _
* @since 3.2.0
* @category Function
* @param {Function} func The function to spread arguments over.
* @param {number} [start=0] The start position of the spread.
* @returns {Function} Returns the new function.
* @example
*
* var say = _.spread(function(who, what) {
*   return who + ' says ' + what;
* });
*
* say(['fred', 'hello']);
* // => 'fred says hello'
*
* var numbers = Promise.all([
*   Promise.resolve(40),
*   Promise.resolve(36)
* ]);
*
* numbers.then(_.spread(function(x, y) {
*   return x + y;
* }));
* // => a Promise of 76
*/
function spread(func, start) {
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$1);
	start = start == null ? 0 : nativeMax$3(toInteger(start), 0);
	return baseRest(function(args) {
		var array = args[start], otherArgs = castSlice(args, 0, start);
		if (array) arrayPush(otherArgs, array);
		return apply(func, this, otherArgs);
	});
}
var FUNC_ERROR_TEXT$1, nativeMax$3;
var init_spread = __esmMin((() => {
	init__apply();
	init__arrayPush();
	init__baseRest();
	init__castSlice();
	init_toInteger();
	FUNC_ERROR_TEXT$1 = "Expected a function";
	nativeMax$3 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/startCase.js
var startCase;
var init_startCase = __esmMin((() => {
	init__createCompounder();
	init_upperFirst();
	startCase = createCompounder(function(result, word, index) {
		return result + (index ? " " : "") + upperFirst(word);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/startsWith.js
/**
* Checks if `string` starts with the given target string.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to inspect.
* @param {string} [target] The string to search for.
* @param {number} [position=0] The position to search from.
* @returns {boolean} Returns `true` if `string` starts with `target`,
*  else `false`.
* @example
*
* _.startsWith('abc', 'a');
* // => true
*
* _.startsWith('abc', 'b');
* // => false
*
* _.startsWith('abc', 'b', 1);
* // => true
*/
function startsWith(string, target, position) {
	string = toString(string);
	position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
	target = baseToString(target);
	return string.slice(position, position + target.length) == target;
}
var init_startsWith = __esmMin((() => {
	init__baseClamp();
	init__baseToString();
	init_toInteger();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/stubObject.js
/**
* This method returns a new empty object.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {Object} Returns the new empty object.
* @example
*
* var objects = _.times(2, _.stubObject);
*
* console.log(objects);
* // => [{}, {}]
*
* console.log(objects[0] === objects[1]);
* // => false
*/
function stubObject() {
	return {};
}
var init_stubObject = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/stubString.js
/**
* This method returns an empty string.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {string} Returns the empty string.
* @example
*
* _.times(2, _.stubString);
* // => ['', '']
*/
function stubString() {
	return "";
}
var init_stubString = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/stubTrue.js
/**
* This method returns `true`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `true`.
* @example
*
* _.times(2, _.stubTrue);
* // => [true, true]
*/
function stubTrue() {
	return true;
}
var init_stubTrue = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/subtract.js
var subtract;
var init_subtract = __esmMin((() => {
	init__createMathOperation();
	subtract = createMathOperation(function(minuend, subtrahend) {
		return minuend - subtrahend;
	}, 0);
}));
//#endregion
//#region ../../node_modules/lodash-es/sum.js
/**
* Computes the sum of the values in `array`.
*
* @static
* @memberOf _
* @since 3.4.0
* @category Math
* @param {Array} array The array to iterate over.
* @returns {number} Returns the sum.
* @example
*
* _.sum([4, 2, 8, 6]);
* // => 20
*/
function sum(array) {
	return array && array.length ? baseSum(array, identity) : 0;
}
var init_sum = __esmMin((() => {
	init__baseSum();
	init_identity();
}));
//#endregion
//#region ../../node_modules/lodash-es/sumBy.js
/**
* This method is like `_.sum` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the value to be summed.
* The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Math
* @param {Array} array The array to iterate over.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {number} Returns the sum.
* @example
*
* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
*
* _.sumBy(objects, function(o) { return o.n; });
* // => 20
*
* // The `_.property` iteratee shorthand.
* _.sumBy(objects, 'n');
* // => 20
*/
function sumBy(array, iteratee) {
	return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}
var init_sumBy = __esmMin((() => {
	init__baseIteratee();
	init__baseSum();
}));
//#endregion
//#region ../../node_modules/lodash-es/tail.js
/**
* Gets all but the first element of `array`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to query.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.tail([1, 2, 3]);
* // => [2, 3]
*/
function tail(array) {
	var length = array == null ? 0 : array.length;
	return length ? baseSlice(array, 1, length) : [];
}
var init_tail = __esmMin((() => {
	init__baseSlice();
}));
//#endregion
//#region ../../node_modules/lodash-es/take.js
/**
* Creates a slice of `array` with `n` elements taken from the beginning.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to take.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.take([1, 2, 3]);
* // => [1]
*
* _.take([1, 2, 3], 2);
* // => [1, 2]
*
* _.take([1, 2, 3], 5);
* // => [1, 2, 3]
*
* _.take([1, 2, 3], 0);
* // => []
*/
function take(array, n, guard) {
	if (!(array && array.length)) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	return baseSlice(array, 0, n < 0 ? 0 : n);
}
var init_take = __esmMin((() => {
	init__baseSlice();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/takeRight.js
/**
* Creates a slice of `array` with `n` elements taken from the end.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to take.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.takeRight([1, 2, 3]);
* // => [3]
*
* _.takeRight([1, 2, 3], 2);
* // => [2, 3]
*
* _.takeRight([1, 2, 3], 5);
* // => [1, 2, 3]
*
* _.takeRight([1, 2, 3], 0);
* // => []
*/
function takeRight(array, n, guard) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	n = length - n;
	return baseSlice(array, n < 0 ? 0 : n, length);
}
var init_takeRight = __esmMin((() => {
	init__baseSlice();
	init_toInteger();
}));
//#endregion
//#region ../../node_modules/lodash-es/takeRightWhile.js
/**
* Creates a slice of `array` with elements taken from the end. Elements are
* taken until `predicate` returns falsey. The predicate is invoked with
* three arguments: (value, index, array).
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the slice of `array`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': true },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': false }
* ];
*
* _.takeRightWhile(users, function(o) { return !o.active; });
* // => objects for ['fred', 'pebbles']
*
* // The `_.matches` iteratee shorthand.
* _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
* // => objects for ['pebbles']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.takeRightWhile(users, ['active', false]);
* // => objects for ['fred', 'pebbles']
*
* // The `_.property` iteratee shorthand.
* _.takeRightWhile(users, 'active');
* // => []
*/
function takeRightWhile(array, predicate) {
	return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), false, true) : [];
}
var init_takeRightWhile = __esmMin((() => {
	init__baseIteratee();
	init__baseWhile();
}));
//#endregion
//#region ../../node_modules/lodash-es/takeWhile.js
/**
* Creates a slice of `array` with elements taken from the beginning. Elements
* are taken until `predicate` returns falsey. The predicate is invoked with
* three arguments: (value, index, array).
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the slice of `array`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': false },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': true }
* ];
*
* _.takeWhile(users, function(o) { return !o.active; });
* // => objects for ['barney', 'fred']
*
* // The `_.matches` iteratee shorthand.
* _.takeWhile(users, { 'user': 'barney', 'active': false });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.takeWhile(users, ['active', false]);
* // => objects for ['barney', 'fred']
*
* // The `_.property` iteratee shorthand.
* _.takeWhile(users, 'active');
* // => []
*/
function takeWhile(array, predicate) {
	return array && array.length ? baseWhile(array, baseIteratee(predicate, 3)) : [];
}
var init_takeWhile = __esmMin((() => {
	init__baseIteratee();
	init__baseWhile();
}));
//#endregion
//#region ../../node_modules/lodash-es/tap.js
/**
* This method invokes `interceptor` and returns `value`. The interceptor
* is invoked with one argument; (value). The purpose of this method is to
* "tap into" a method chain sequence in order to modify intermediate results.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Seq
* @param {*} value The value to provide to `interceptor`.
* @param {Function} interceptor The function to invoke.
* @returns {*} Returns `value`.
* @example
*
* _([1, 2, 3])
*  .tap(function(array) {
*    // Mutate input array.
*    array.pop();
*  })
*  .reverse()
*  .value();
* // => [2, 1]
*/
function tap(value, interceptor) {
	interceptor(value);
	return value;
}
var init_tap = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_customDefaultsAssignIn.js
/**
* Used by `_.defaults` to customize its `_.assignIn` use to assign properties
* of source objects to the destination object for all destination properties
* that resolve to `undefined`.
*
* @private
* @param {*} objValue The destination value.
* @param {*} srcValue The source value.
* @param {string} key The key of the property to assign.
* @param {Object} object The parent object of `objValue`.
* @returns {*} Returns the value to assign.
*/
function customDefaultsAssignIn(objValue, srcValue, key, object) {
	if (objValue === void 0 || eq(objValue, objectProto[key]) && !hasOwnProperty$2.call(object, key)) return srcValue;
	return objValue;
}
var objectProto, hasOwnProperty$2;
var init__customDefaultsAssignIn = __esmMin((() => {
	init_eq();
	objectProto = Object.prototype;
	hasOwnProperty$2 = objectProto.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/_escapeStringChar.js
/**
* Used by `_.template` to escape characters for inclusion in compiled string literals.
*
* @private
* @param {string} chr The matched character to escape.
* @returns {string} Returns the escaped character.
*/
function escapeStringChar(chr) {
	return "\\" + stringEscapes[chr];
}
var stringEscapes;
var init__escapeStringChar = __esmMin((() => {
	stringEscapes = {
		"\\": "\\",
		"'": "'",
		"\n": "n",
		"\r": "r",
		"\u2028": "u2028",
		"\u2029": "u2029"
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_reInterpolate.js
var reInterpolate;
var init__reInterpolate = __esmMin((() => {
	reInterpolate = /<%=([\s\S]+?)%>/g;
}));
//#endregion
//#region ../../node_modules/lodash-es/_reEscape.js
var reEscape;
var init__reEscape = __esmMin((() => {
	reEscape = /<%-([\s\S]+?)%>/g;
}));
//#endregion
//#region ../../node_modules/lodash-es/_reEvaluate.js
var reEvaluate;
var init__reEvaluate = __esmMin((() => {
	reEvaluate = /<%([\s\S]+?)%>/g;
}));
//#endregion
//#region ../../node_modules/lodash-es/templateSettings.js
var templateSettings;
var init_templateSettings = __esmMin((() => {
	init_escape();
	init__reEscape();
	init__reEvaluate();
	init__reInterpolate();
	templateSettings = {
		"escape": reEscape,
		"evaluate": reEvaluate,
		"interpolate": reInterpolate,
		"variable": "",
		"imports": { "_": { "escape": escape } }
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/template.js
/**
* Creates a compiled template function that can interpolate data properties
* in "interpolate" delimiters, HTML-escape interpolated data properties in
* "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
* properties may be accessed as free variables in the template. If a setting
* object is given, it takes precedence over `_.templateSettings` values.
*
* **Security:** `_.template` is insecure and should not be used. It will be
* removed in Lodash v5. Avoid untrusted input. See
* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md).
*
* **Note:** In the development build `_.template` utilizes
* [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
* for easier debugging.
*
* For more information on precompiling templates see
* [lodash's custom builds documentation](https://lodash.com/custom-builds).
*
* For more information on Chrome extension sandboxes see
* [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
*
* @static
* @since 0.1.0
* @memberOf _
* @category String
* @param {string} [string=''] The template string.
* @param {Object} [options={}] The options object.
* @param {RegExp} [options.escape=_.templateSettings.escape]
*  The HTML "escape" delimiter.
* @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
*  The "evaluate" delimiter.
* @param {Object} [options.imports=_.templateSettings.imports]
*  An object to import into the template as free variables.
* @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
*  The "interpolate" delimiter.
* @param {string} [options.sourceURL='templateSources[n]']
*  The sourceURL of the compiled template.
* @param {string} [options.variable='obj']
*  The data object variable name.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Function} Returns the compiled template function.
* @example
*
* // Use the "interpolate" delimiter to create a compiled template.
* var compiled = _.template('hello <%= user %>!');
* compiled({ 'user': 'fred' });
* // => 'hello fred!'
*
* // Use the HTML "escape" delimiter to escape data property values.
* var compiled = _.template('<b><%- value %></b>');
* compiled({ 'value': '<script>' });
* // => '<b>&lt;script&gt;</b>'
*
* // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
* var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
* compiled({ 'users': ['fred', 'barney'] });
* // => '<li>fred</li><li>barney</li>'
*
* // Use the internal `print` function in "evaluate" delimiters.
* var compiled = _.template('<% print("hello " + user); %>!');
* compiled({ 'user': 'barney' });
* // => 'hello barney!'
*
* // Use the ES template literal delimiter as an "interpolate" delimiter.
* // Disable support by replacing the "interpolate" delimiter.
* var compiled = _.template('hello ${ user }!');
* compiled({ 'user': 'pebbles' });
* // => 'hello pebbles!'
*
* // Use backslashes to treat delimiters as plain text.
* var compiled = _.template('<%= "\\<%- value %\\>" %>');
* compiled({ 'value': 'ignored' });
* // => '<%- value %>'
*
* // Use the `imports` option to import `jQuery` as `jq`.
* var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
* var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
* compiled({ 'users': ['fred', 'barney'] });
* // => '<li>fred</li><li>barney</li>'
*
* // Use the `sourceURL` option to specify a custom sourceURL for the template.
* var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
* compiled(data);
* // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
*
* // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
* var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
* compiled.source;
* // => function(data) {
* //   var __t, __p = '';
* //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
* //   return __p;
* // }
*
* // Use custom template delimiters.
* _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
* var compiled = _.template('hello {{ user }}!');
* compiled({ 'user': 'mustache' });
* // => 'hello mustache!'
*
* // Use the `source` property to inline compiled templates for meaningful
* // line numbers in error messages and stack traces.
* fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
*   var JST = {\
*     "main": ' + _.template(mainText).source + '\
*   };\
* ');
*/
function template(string, options, guard) {
	var settings = templateSettings.imports._.templateSettings || templateSettings;
	if (guard && isIterateeCall(string, options, guard)) options = void 0;
	string = toString(string);
	options = assignWith({}, options, settings, customDefaultsAssignIn);
	var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
	arrayEach(importsKeys, function(key) {
		if (reForbiddenIdentifierChars.test(key)) throw new Error(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
	});
	var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
	var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
	var sourceURL = hasOwnProperty$1.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
	string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
		interpolateValue || (interpolateValue = esTemplateValue);
		source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
		if (escapeValue) {
			isEscaping = true;
			source += "' +\n__e(" + escapeValue + ") +\n'";
		}
		if (evaluateValue) {
			isEvaluating = true;
			source += "';\n" + evaluateValue + ";\n__p += '";
		}
		if (interpolateValue) source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
		index = offset + match.length;
		return match;
	});
	source += "';\n";
	var variable = hasOwnProperty$1.call(options, "variable") && options.variable;
	if (!variable) source = "with (obj) {\n" + source + "\n}\n";
	else if (reForbiddenIdentifierChars.test(variable)) throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
	source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
	source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
	var result = attempt(function() {
		return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
	});
	result.source = source;
	if (isError(result)) throw result;
	return result;
}
var INVALID_TEMPL_VAR_ERROR_TEXT, INVALID_TEMPL_IMPORTS_ERROR_TEXT, reEmptyStringLeading, reEmptyStringMiddle, reEmptyStringTrailing, reForbiddenIdentifierChars, reEsTemplate, reNoMatch, reUnescapedString, hasOwnProperty$1;
var init_template = __esmMin((() => {
	init__arrayEach();
	init_assignWith();
	init_attempt();
	init__baseValues();
	init__customDefaultsAssignIn();
	init__escapeStringChar();
	init_isError();
	init__isIterateeCall();
	init_keys();
	init__reInterpolate();
	init_templateSettings();
	init_toString();
	INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
	reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
	reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	reNoMatch = /($^)/;
	reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	hasOwnProperty$1 = Object.prototype.hasOwnProperty;
}));
//#endregion
//#region ../../node_modules/lodash-es/throttle.js
/**
* Creates a throttled function that only invokes `func` at most once per
* every `wait` milliseconds. The throttled function comes with a `cancel`
* method to cancel delayed `func` invocations and a `flush` method to
* immediately invoke them. Provide `options` to indicate whether `func`
* should be invoked on the leading and/or trailing edge of the `wait`
* timeout. The `func` is invoked with the last arguments provided to the
* throttled function. Subsequent calls to the throttled function return the
* result of the last `func` invocation.
*
* **Note:** If `leading` and `trailing` options are `true`, `func` is
* invoked on the trailing edge of the timeout only if the throttled function
* is invoked more than once during the `wait` timeout.
*
* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
* until to the next tick, similar to `setTimeout` with a timeout of `0`.
*
* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
* for details over the differences between `_.throttle` and `_.debounce`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to throttle.
* @param {number} [wait=0] The number of milliseconds to throttle invocations to.
* @param {Object} [options={}] The options object.
* @param {boolean} [options.leading=true]
*  Specify invoking on the leading edge of the timeout.
* @param {boolean} [options.trailing=true]
*  Specify invoking on the trailing edge of the timeout.
* @returns {Function} Returns the new throttled function.
* @example
*
* // Avoid excessively updating the position while scrolling.
* jQuery(window).on('scroll', _.throttle(updatePosition, 100));
*
* // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
* var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
* jQuery(element).on('click', throttled);
*
* // Cancel the trailing throttled invocation.
* jQuery(window).on('popstate', throttled.cancel);
*/
function throttle(func, wait, options) {
	var leading = true, trailing = true;
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
	if (isObject(options)) {
		leading = "leading" in options ? !!options.leading : leading;
		trailing = "trailing" in options ? !!options.trailing : trailing;
	}
	return debounce(func, wait, {
		"leading": leading,
		"maxWait": wait,
		"trailing": trailing
	});
}
var FUNC_ERROR_TEXT;
var init_throttle = __esmMin((() => {
	init_debounce();
	init_isObject();
	FUNC_ERROR_TEXT = "Expected a function";
}));
//#endregion
//#region ../../node_modules/lodash-es/thru.js
/**
* This method is like `_.tap` except that it returns the result of `interceptor`.
* The purpose of this method is to "pass thru" values replacing intermediate
* results in a method chain sequence.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Seq
* @param {*} value The value to provide to `interceptor`.
* @param {Function} interceptor The function to invoke.
* @returns {*} Returns the result of `interceptor`.
* @example
*
* _('  abc  ')
*  .chain()
*  .trim()
*  .thru(function(value) {
*    return [value];
*  })
*  .value();
* // => ['abc']
*/
function thru(value, interceptor) {
	return interceptor(value);
}
var init_thru = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/times.js
/**
* Invokes the iteratee `n` times, returning an array of the results of
* each invocation. The iteratee is invoked with one argument; (index).
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the array of results.
* @example
*
* _.times(3, String);
* // => ['0', '1', '2']
*
*  _.times(4, _.constant(0));
* // => [0, 0, 0, 0]
*/
function times(n, iteratee) {
	n = toInteger(n);
	if (n < 1 || n > MAX_SAFE_INTEGER$1) return [];
	var index = MAX_ARRAY_LENGTH$1, length = nativeMin$3(n, MAX_ARRAY_LENGTH$1);
	iteratee = castFunction(iteratee);
	n -= MAX_ARRAY_LENGTH$1;
	var result = baseTimes(length, iteratee);
	while (++index < n) iteratee(index);
	return result;
}
var MAX_SAFE_INTEGER$1, MAX_ARRAY_LENGTH$1, nativeMin$3;
var init_times = __esmMin((() => {
	init__baseTimes();
	init__castFunction();
	init_toInteger();
	MAX_SAFE_INTEGER$1 = 9007199254740991;
	MAX_ARRAY_LENGTH$1 = 4294967295;
	nativeMin$3 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/toIterator.js
/**
* Enables the wrapper to be iterable.
*
* @name Symbol.iterator
* @memberOf _
* @since 4.0.0
* @category Seq
* @returns {Object} Returns the wrapper object.
* @example
*
* var wrapped = _([1, 2]);
*
* wrapped[Symbol.iterator]() === wrapped;
* // => true
*
* Array.from(wrapped);
* // => [1, 2]
*/
function wrapperToIterator() {
	return this;
}
var init_toIterator = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/_baseWrapperValue.js
/**
* The base implementation of `wrapperValue` which returns the result of
* performing a sequence of actions on the unwrapped `value`, where each
* successive action is supplied the return value of the previous.
*
* @private
* @param {*} value The unwrapped value.
* @param {Array} actions Actions to perform to resolve the unwrapped value.
* @returns {*} Returns the resolved value.
*/
function baseWrapperValue(value, actions) {
	var result = value;
	if (result instanceof LazyWrapper) result = result.value();
	return arrayReduce(actions, function(result, action) {
		return action.func.apply(action.thisArg, arrayPush([result], action.args));
	}, result);
}
var init__baseWrapperValue = __esmMin((() => {
	init__LazyWrapper();
	init__arrayPush();
	init__arrayReduce();
}));
//#endregion
//#region ../../node_modules/lodash-es/wrapperValue.js
/**
* Executes the chain sequence to resolve the unwrapped value.
*
* @name value
* @memberOf _
* @since 0.1.0
* @alias toJSON, valueOf
* @category Seq
* @returns {*} Returns the resolved unwrapped value.
* @example
*
* _([1, 2, 3]).value();
* // => [1, 2, 3]
*/
function wrapperValue() {
	return baseWrapperValue(this.__wrapped__, this.__actions__);
}
var init_wrapperValue = __esmMin((() => {
	init__baseWrapperValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/toJSON.js
var init_toJSON = __esmMin((() => {
	init_wrapperValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/toLower.js
/**
* Converts `string`, as a whole, to lower case just like
* [String#toLowerCase](https://mdn.io/toLowerCase).
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to convert.
* @returns {string} Returns the lower cased string.
* @example
*
* _.toLower('--Foo-Bar--');
* // => '--foo-bar--'
*
* _.toLower('fooBar');
* // => 'foobar'
*
* _.toLower('__FOO_BAR__');
* // => '__foo_bar__'
*/
function toLower(value) {
	return toString(value).toLowerCase();
}
var init_toLower = __esmMin((() => {
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/toPath.js
/**
* Converts `value` to a property path array.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Util
* @param {*} value The value to convert.
* @returns {Array} Returns the new property path array.
* @example
*
* _.toPath('a.b.c');
* // => ['a', 'b', 'c']
*
* _.toPath('a[0].b.c');
* // => ['a', '0', 'b', 'c']
*/
function toPath(value) {
	if (isArray(value)) return arrayMap(value, toKey);
	return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}
var init_toPath = __esmMin((() => {
	init__arrayMap();
	init__copyArray();
	init_isArray();
	init_isSymbol();
	init__stringToPath();
	init__toKey();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/toSafeInteger.js
/**
* Converts `value` to a safe integer. A safe integer can be compared and
* represented correctly.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted integer.
* @example
*
* _.toSafeInteger(3.2);
* // => 3
*
* _.toSafeInteger(Number.MIN_VALUE);
* // => 0
*
* _.toSafeInteger(Infinity);
* // => 9007199254740991
*
* _.toSafeInteger('3.2');
* // => 3
*/
function toSafeInteger(value) {
	return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
}
var MAX_SAFE_INTEGER;
var init_toSafeInteger = __esmMin((() => {
	init__baseClamp();
	init_toInteger();
	MAX_SAFE_INTEGER = 9007199254740991;
}));
//#endregion
//#region ../../node_modules/lodash-es/toUpper.js
/**
* Converts `string`, as a whole, to upper case just like
* [String#toUpperCase](https://mdn.io/toUpperCase).
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to convert.
* @returns {string} Returns the upper cased string.
* @example
*
* _.toUpper('--foo-bar--');
* // => '--FOO-BAR--'
*
* _.toUpper('fooBar');
* // => 'FOOBAR'
*
* _.toUpper('__foo_bar__');
* // => '__FOO_BAR__'
*/
function toUpper(value) {
	return toString(value).toUpperCase();
}
var init_toUpper = __esmMin((() => {
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/transform.js
/**
* An alternative to `_.reduce`; this method transforms `object` to a new
* `accumulator` object which is the result of running each of its own
* enumerable string keyed properties thru `iteratee`, with each invocation
* potentially mutating the `accumulator` object. If `accumulator` is not
* provided, a new object with the same `[[Prototype]]` will be used. The
* iteratee is invoked with four arguments: (accumulator, value, key, object).
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* @static
* @memberOf _
* @since 1.3.0
* @category Object
* @param {Object} object The object to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @param {*} [accumulator] The custom accumulator value.
* @returns {*} Returns the accumulated value.
* @example
*
* _.transform([2, 3, 4], function(result, n) {
*   result.push(n *= n);
*   return n % 2 == 0;
* }, []);
* // => [4, 9]
*
* _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
*   (result[value] || (result[value] = [])).push(key);
* }, {});
* // => { '1': ['a', 'c'], '2': ['b'] }
*/
function transform(object, iteratee, accumulator) {
	var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
	iteratee = baseIteratee(iteratee, 4);
	if (accumulator == null) {
		var Ctor = object && object.constructor;
		if (isArrLike) accumulator = isArr ? new Ctor() : [];
		else if (isObject(object)) accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
		else accumulator = {};
	}
	(isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
		return iteratee(accumulator, value, index, object);
	});
	return accumulator;
}
var init_transform = __esmMin((() => {
	init__arrayEach();
	init__baseCreate();
	init__baseForOwn();
	init__baseIteratee();
	init__getPrototype();
	init_isArray();
	init_isBuffer();
	init_isFunction();
	init_isObject();
	init_isTypedArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_charsEndIndex.js
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
* that is not found in the character symbols.
*
* @private
* @param {Array} strSymbols The string symbols to inspect.
* @param {Array} chrSymbols The character symbols to find.
* @returns {number} Returns the index of the last unmatched string symbol.
*/
function charsEndIndex(strSymbols, chrSymbols) {
	var index = strSymbols.length;
	while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
	return index;
}
var init__charsEndIndex = __esmMin((() => {
	init__baseIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/_charsStartIndex.js
/**
* Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
* that is not found in the character symbols.
*
* @private
* @param {Array} strSymbols The string symbols to inspect.
* @param {Array} chrSymbols The character symbols to find.
* @returns {number} Returns the index of the first unmatched string symbol.
*/
function charsStartIndex(strSymbols, chrSymbols) {
	var index = -1, length = strSymbols.length;
	while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
	return index;
}
var init__charsStartIndex = __esmMin((() => {
	init__baseIndexOf();
}));
//#endregion
//#region ../../node_modules/lodash-es/trim.js
/**
* Removes leading and trailing whitespace or specified characters from `string`.
*
* @static
* @memberOf _
* @since 3.0.0
* @category String
* @param {string} [string=''] The string to trim.
* @param {string} [chars=whitespace] The characters to trim.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {string} Returns the trimmed string.
* @example
*
* _.trim('  abc  ');
* // => 'abc'
*
* _.trim('-_-abc-_-', '_-');
* // => 'abc'
*
* _.map(['  foo  ', '  bar  '], _.trim);
* // => ['foo', 'bar']
*/
function trim(string, chars, guard) {
	string = toString(string);
	if (string && (guard || chars === void 0)) return baseTrim(string);
	if (!string || !(chars = baseToString(chars))) return string;
	var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars);
	return castSlice(strSymbols, charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("");
}
var init_trim = __esmMin((() => {
	init__baseToString();
	init__baseTrim();
	init__castSlice();
	init__charsEndIndex();
	init__charsStartIndex();
	init__stringToArray();
	init_toString();
}));
//#endregion
//#region ../../node_modules/lodash-es/trimEnd.js
/**
* Removes trailing whitespace or specified characters from `string`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to trim.
* @param {string} [chars=whitespace] The characters to trim.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {string} Returns the trimmed string.
* @example
*
* _.trimEnd('  abc  ');
* // => '  abc'
*
* _.trimEnd('-_-abc-_-', '_-');
* // => '-_-abc'
*/
function trimEnd(string, chars, guard) {
	string = toString(string);
	if (string && (guard || chars === void 0)) return string.slice(0, trimmedEndIndex(string) + 1);
	if (!string || !(chars = baseToString(chars))) return string;
	var strSymbols = stringToArray(string);
	return castSlice(strSymbols, 0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join("");
}
var init_trimEnd = __esmMin((() => {
	init__baseToString();
	init__castSlice();
	init__charsEndIndex();
	init__stringToArray();
	init_toString();
	init__trimmedEndIndex();
}));
//#endregion
//#region ../../node_modules/lodash-es/trimStart.js
/**
* Removes leading whitespace or specified characters from `string`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to trim.
* @param {string} [chars=whitespace] The characters to trim.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {string} Returns the trimmed string.
* @example
*
* _.trimStart('  abc  ');
* // => 'abc  '
*
* _.trimStart('-_-abc-_-', '_-');
* // => 'abc-_-'
*/
function trimStart(string, chars, guard) {
	string = toString(string);
	if (string && (guard || chars === void 0)) return string.replace(reTrimStart, "");
	if (!string || !(chars = baseToString(chars))) return string;
	var strSymbols = stringToArray(string);
	return castSlice(strSymbols, charsStartIndex(strSymbols, stringToArray(chars))).join("");
}
var reTrimStart;
var init_trimStart = __esmMin((() => {
	init__baseToString();
	init__castSlice();
	init__charsStartIndex();
	init__stringToArray();
	init_toString();
	reTrimStart = /^\s+/;
}));
//#endregion
//#region ../../node_modules/lodash-es/truncate.js
/**
* Truncates `string` if it's longer than the given maximum string length.
* The last characters of the truncated string are replaced with the omission
* string which defaults to "...".
*
* @static
* @memberOf _
* @since 4.0.0
* @category String
* @param {string} [string=''] The string to truncate.
* @param {Object} [options={}] The options object.
* @param {number} [options.length=30] The maximum string length.
* @param {string} [options.omission='...'] The string to indicate text is omitted.
* @param {RegExp|string} [options.separator] The separator pattern to truncate to.
* @returns {string} Returns the truncated string.
* @example
*
* _.truncate('hi-diddly-ho there, neighborino');
* // => 'hi-diddly-ho there, neighbo...'
*
* _.truncate('hi-diddly-ho there, neighborino', {
*   'length': 24,
*   'separator': ' '
* });
* // => 'hi-diddly-ho there,...'
*
* _.truncate('hi-diddly-ho there, neighborino', {
*   'length': 24,
*   'separator': /,? +/
* });
* // => 'hi-diddly-ho there...'
*
* _.truncate('hi-diddly-ho there, neighborino', {
*   'omission': ' [...]'
* });
* // => 'hi-diddly-ho there, neig [...]'
*/
function truncate(string, options) {
	var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
	if (isObject(options)) {
		var separator = "separator" in options ? options.separator : separator;
		length = "length" in options ? toInteger(options.length) : length;
		omission = "omission" in options ? baseToString(options.omission) : omission;
	}
	string = toString(string);
	var strLength = string.length;
	if (hasUnicode(string)) {
		var strSymbols = stringToArray(string);
		strLength = strSymbols.length;
	}
	if (length >= strLength) return string;
	var end = length - stringSize(omission);
	if (end < 1) return omission;
	var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
	if (separator === void 0) return result + omission;
	if (strSymbols) end += result.length - end;
	if (isRegExp(separator)) {
		if (string.slice(end).search(separator)) {
			var match, substring = result;
			if (!separator.global) separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
			separator.lastIndex = 0;
			while (match = separator.exec(substring)) var newEnd = match.index;
			result = result.slice(0, newEnd === void 0 ? end : newEnd);
		}
	} else if (string.indexOf(baseToString(separator), end) != end) {
		var index = result.lastIndexOf(separator);
		if (index > -1) result = result.slice(0, index);
	}
	return result + omission;
}
var DEFAULT_TRUNC_LENGTH, DEFAULT_TRUNC_OMISSION, reFlags;
var init_truncate = __esmMin((() => {
	init__baseToString();
	init__castSlice();
	init__hasUnicode();
	init_isObject();
	init_isRegExp();
	init__stringSize();
	init__stringToArray();
	init_toInteger();
	init_toString();
	DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
	reFlags = /\w*$/;
}));
//#endregion
//#region ../../node_modules/lodash-es/unary.js
/**
* Creates a function that accepts up to one argument, ignoring any
* additional arguments.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Function
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
* @example
*
* _.map(['6', '8', '10'], _.unary(parseInt));
* // => [6, 8, 10]
*/
function unary(func) {
	return ary(func, 1);
}
var init_unary = __esmMin((() => {
	init_ary();
}));
//#endregion
//#region ../../node_modules/lodash-es/_unescapeHtmlChar.js
var unescapeHtmlChar;
var init__unescapeHtmlChar = __esmMin((() => {
	init__basePropertyOf();
	unescapeHtmlChar = basePropertyOf({
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": "\"",
		"&#39;": "'"
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/unescape.js
/**
* The inverse of `_.escape`; this method converts the HTML entities
* `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
* their corresponding characters.
*
* **Note:** No other HTML entities are unescaped. To unescape additional
* HTML entities use a third-party library like [_he_](https://mths.be/he).
*
* @static
* @memberOf _
* @since 0.6.0
* @category String
* @param {string} [string=''] The string to unescape.
* @returns {string} Returns the unescaped string.
* @example
*
* _.unescape('fred, barney, &amp; pebbles');
* // => 'fred, barney, & pebbles'
*/
function unescape(string) {
	string = toString(string);
	return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}
var reEscapedHtml, reHasEscapedHtml;
var init_unescape = __esmMin((() => {
	init_toString();
	init__unescapeHtmlChar();
	reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reHasEscapedHtml = RegExp(reEscapedHtml.source);
}));
//#endregion
//#region ../../node_modules/lodash-es/_createSet.js
var createSet;
var init__createSet = __esmMin((() => {
	init__Set();
	init_noop();
	init__setToArray();
	createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == Infinity) ? noop : function(values) {
		return new Set(values);
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseUniq.js
/**
* The base implementation of `_.uniqBy` without support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new duplicate free array.
*/
function baseUniq(array, iteratee, comparator) {
	var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
	if (comparator) {
		isCommon = false;
		includes = arrayIncludesWith;
	} else if (length >= LARGE_ARRAY_SIZE) {
		var set = iteratee ? null : createSet(array);
		if (set) return setToArray(set);
		isCommon = false;
		includes = cacheHas;
		seen = new SetCache();
	} else seen = iteratee ? [] : result;
	outer: while (++index < length) {
		var value = array[index], computed = iteratee ? iteratee(value) : value;
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var seenIndex = seen.length;
			while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
			if (iteratee) seen.push(computed);
			result.push(value);
		} else if (!includes(seen, computed, comparator)) {
			if (seen !== result) seen.push(computed);
			result.push(value);
		}
	}
	return result;
}
var LARGE_ARRAY_SIZE;
var init__baseUniq = __esmMin((() => {
	init__SetCache();
	init__arrayIncludes();
	init__arrayIncludesWith();
	init__cacheHas();
	init__createSet();
	init__setToArray();
	LARGE_ARRAY_SIZE = 200;
}));
//#endregion
//#region ../../node_modules/lodash-es/union.js
var union;
var init_union = __esmMin((() => {
	init__baseFlatten();
	init__baseRest();
	init__baseUniq();
	init_isArrayLikeObject();
	union = baseRest(function(arrays) {
		return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/unionBy.js
var unionBy;
var init_unionBy = __esmMin((() => {
	init__baseFlatten();
	init__baseIteratee();
	init__baseRest();
	init__baseUniq();
	init_isArrayLikeObject();
	init_last();
	unionBy = baseRest(function(arrays) {
		var iteratee = last(arrays);
		if (isArrayLikeObject(iteratee)) iteratee = void 0;
		return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/unionWith.js
var unionWith;
var init_unionWith = __esmMin((() => {
	init__baseFlatten();
	init__baseRest();
	init__baseUniq();
	init_isArrayLikeObject();
	init_last();
	unionWith = baseRest(function(arrays) {
		var comparator = last(arrays);
		comparator = typeof comparator == "function" ? comparator : void 0;
		return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), void 0, comparator);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/uniq.js
/**
* Creates a duplicate-free version of an array, using
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons, in which only the first occurrence of each element
* is kept. The order of result values is determined by the order they occur
* in the array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.uniq([2, 1, 2]);
* // => [2, 1]
*/
function uniq(array) {
	return array && array.length ? baseUniq(array) : [];
}
var init_uniq = __esmMin((() => {
	init__baseUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/uniqBy.js
/**
* This method is like `_.uniq` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the criterion by which
* uniqueness is computed. The order of result values is determined by the
* order they occur in the array. The iteratee is invoked with one argument:
* (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.uniqBy([2.1, 1.2, 2.3], Math.floor);
* // => [2.1, 1.2]
*
* // The `_.property` iteratee shorthand.
* _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
* // => [{ 'x': 1 }, { 'x': 2 }]
*/
function uniqBy(array, iteratee) {
	return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}
var init_uniqBy = __esmMin((() => {
	init__baseIteratee();
	init__baseUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/uniqWith.js
/**
* This method is like `_.uniq` except that it accepts `comparator` which
* is invoked to compare elements of `array`. The order of result values is
* determined by the order they occur in the array.The comparator is invoked
* with two arguments: (arrVal, othVal).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
*
* _.uniqWith(objects, _.isEqual);
* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
*/
function uniqWith(array, comparator) {
	comparator = typeof comparator == "function" ? comparator : void 0;
	return array && array.length ? baseUniq(array, void 0, comparator) : [];
}
var init_uniqWith = __esmMin((() => {
	init__baseUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/uniqueId.js
/**
* Generates a unique ID. If `prefix` is given, the ID is appended to it.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {string} [prefix=''] The value to prefix the ID with.
* @returns {string} Returns the unique ID.
* @example
*
* _.uniqueId('contact_');
* // => 'contact_104'
*
* _.uniqueId();
* // => '105'
*/
function uniqueId(prefix) {
	var id = ++idCounter;
	return toString(prefix) + id;
}
var idCounter;
var init_uniqueId = __esmMin((() => {
	init_toString();
	idCounter = 0;
}));
//#endregion
//#region ../../node_modules/lodash-es/unset.js
/**
* Removes the property at `path` of `object`.
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to unset.
* @returns {boolean} Returns `true` if the property is deleted, else `false`.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 7 } }] };
* _.unset(object, 'a[0].b.c');
* // => true
*
* console.log(object);
* // => { 'a': [{ 'b': {} }] };
*
* _.unset(object, ['a', '0', 'b', 'c']);
* // => true
*
* console.log(object);
* // => { 'a': [{ 'b': {} }] };
*/
function unset(object, path) {
	return object == null ? true : baseUnset(object, path);
}
var init_unset = __esmMin((() => {
	init__baseUnset();
}));
//#endregion
//#region ../../node_modules/lodash-es/unzip.js
/**
* This method is like `_.zip` except that it accepts an array of grouped
* elements and creates an array regrouping the elements to their pre-zip
* configuration.
*
* @static
* @memberOf _
* @since 1.2.0
* @category Array
* @param {Array} array The array of grouped elements to process.
* @returns {Array} Returns the new array of regrouped elements.
* @example
*
* var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
* // => [['a', 1, true], ['b', 2, false]]
*
* _.unzip(zipped);
* // => [['a', 'b'], [1, 2], [true, false]]
*/
function unzip(array) {
	if (!(array && array.length)) return [];
	var length = 0;
	array = arrayFilter(array, function(group) {
		if (isArrayLikeObject(group)) {
			length = nativeMax$2(group.length, length);
			return true;
		}
	});
	return baseTimes(length, function(index) {
		return arrayMap(array, baseProperty(index));
	});
}
var nativeMax$2;
var init_unzip = __esmMin((() => {
	init__arrayFilter();
	init__arrayMap();
	init__baseProperty();
	init__baseTimes();
	init_isArrayLikeObject();
	nativeMax$2 = Math.max;
}));
//#endregion
//#region ../../node_modules/lodash-es/unzipWith.js
/**
* This method is like `_.unzip` except that it accepts `iteratee` to specify
* how regrouped values should be combined. The iteratee is invoked with the
* elements of each group: (...group).
*
* @static
* @memberOf _
* @since 3.8.0
* @category Array
* @param {Array} array The array of grouped elements to process.
* @param {Function} [iteratee=_.identity] The function to combine
*  regrouped values.
* @returns {Array} Returns the new array of regrouped elements.
* @example
*
* var zipped = _.zip([1, 2], [10, 20], [100, 200]);
* // => [[1, 10, 100], [2, 20, 200]]
*
* _.unzipWith(zipped, _.add);
* // => [3, 30, 300]
*/
function unzipWith(array, iteratee) {
	if (!(array && array.length)) return [];
	var result = unzip(array);
	if (iteratee == null) return result;
	return arrayMap(result, function(group) {
		return apply(iteratee, void 0, group);
	});
}
var init_unzipWith = __esmMin((() => {
	init__apply();
	init__arrayMap();
	init_unzip();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseUpdate.js
/**
* The base implementation of `_.update`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to update.
* @param {Function} updater The function to produce the updated value.
* @param {Function} [customizer] The function to customize path creation.
* @returns {Object} Returns `object`.
*/
function baseUpdate(object, path, updater, customizer) {
	return baseSet(object, path, updater(baseGet(object, path)), customizer);
}
var init__baseUpdate = __esmMin((() => {
	init__baseGet();
	init__baseSet();
}));
//#endregion
//#region ../../node_modules/lodash-es/update.js
/**
* This method is like `_.set` except that accepts `updater` to produce the
* value to set. Use `_.updateWith` to customize `path` creation. The `updater`
* is invoked with one argument: (value).
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 4.6.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {Function} updater The function to produce the updated value.
* @returns {Object} Returns `object`.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.update(object, 'a[0].b.c', function(n) { return n * n; });
* console.log(object.a[0].b.c);
* // => 9
*
* _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
* console.log(object.x[0].y.z);
* // => 0
*/
function update(object, path, updater) {
	return object == null ? object : baseUpdate(object, path, castFunction(updater));
}
var init_update = __esmMin((() => {
	init__baseUpdate();
	init__castFunction();
}));
//#endregion
//#region ../../node_modules/lodash-es/updateWith.js
/**
* This method is like `_.update` except that it accepts `customizer` which is
* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
* path creation is handled by the method instead. The `customizer` is invoked
* with three arguments: (nsValue, key, nsObject).
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 4.6.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {Function} updater The function to produce the updated value.
* @param {Function} [customizer] The function to customize assigned values.
* @returns {Object} Returns `object`.
* @example
*
* var object = {};
*
* _.updateWith(object, '[0][1]', _.constant('a'), Object);
* // => { '0': { '1': 'a' } }
*/
function updateWith(object, path, updater, customizer) {
	customizer = typeof customizer == "function" ? customizer : void 0;
	return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}
var init_updateWith = __esmMin((() => {
	init__baseUpdate();
	init__castFunction();
}));
//#endregion
//#region ../../node_modules/lodash-es/upperCase.js
var upperCase;
var init_upperCase = __esmMin((() => {
	init__createCompounder();
	upperCase = createCompounder(function(result, word, index) {
		return result + (index ? " " : "") + word.toUpperCase();
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/value.js
var init_value = __esmMin((() => {
	init_wrapperValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/valueOf.js
var init_valueOf = __esmMin((() => {
	init_wrapperValue();
}));
//#endregion
//#region ../../node_modules/lodash-es/valuesIn.js
/**
* Creates an array of the own and inherited enumerable string keyed property
* values of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property values.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.valuesIn(new Foo);
* // => [1, 2, 3] (iteration order is not guaranteed)
*/
function valuesIn(object) {
	return object == null ? [] : baseValues(object, keysIn(object));
}
var init_valuesIn = __esmMin((() => {
	init__baseValues();
	init_keysIn();
}));
//#endregion
//#region ../../node_modules/lodash-es/without.js
var without;
var init_without = __esmMin((() => {
	init__baseDifference();
	init__baseRest();
	init_isArrayLikeObject();
	without = baseRest(function(array, values) {
		return isArrayLikeObject(array) ? baseDifference(array, values) : [];
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/wrap.js
/**
* Creates a function that provides `value` to `wrapper` as its first
* argument. Any additional arguments provided to the function are appended
* to those provided to the `wrapper`. The wrapper is invoked with the `this`
* binding of the created function.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {*} value The value to wrap.
* @param {Function} [wrapper=identity] The wrapper function.
* @returns {Function} Returns the new function.
* @example
*
* var p = _.wrap(_.escape, function(func, text) {
*   return '<p>' + func(text) + '</p>';
* });
*
* p('fred, barney, & pebbles');
* // => '<p>fred, barney, &amp; pebbles</p>'
*/
function wrap(value, wrapper) {
	return partial(castFunction(wrapper), value);
}
var init_wrap = __esmMin((() => {
	init__castFunction();
	init_partial();
}));
//#endregion
//#region ../../node_modules/lodash-es/wrapperAt.js
var wrapperAt;
var init_wrapperAt = __esmMin((() => {
	init__LazyWrapper();
	init__LodashWrapper();
	init__baseAt();
	init__flatRest();
	init__isIndex();
	init_thru();
	wrapperAt = flatRest(function(paths) {
		var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
			return baseAt(object, paths);
		};
		if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) return this.thru(interceptor);
		value = value.slice(start, +start + (length ? 1 : 0));
		value.__actions__.push({
			"func": thru,
			"args": [interceptor],
			"thisArg": void 0
		});
		return new LodashWrapper(value, this.__chain__).thru(function(array) {
			if (length && !array.length) array.push(void 0);
			return array;
		});
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/wrapperChain.js
/**
* Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
*
* @name chain
* @memberOf _
* @since 0.1.0
* @category Seq
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36 },
*   { 'user': 'fred',   'age': 40 }
* ];
*
* // A sequence without explicit chaining.
* _(users).head();
* // => { 'user': 'barney', 'age': 36 }
*
* // A sequence with explicit chaining.
* _(users)
*   .chain()
*   .head()
*   .pick('user')
*   .value();
* // => { 'user': 'barney' }
*/
function wrapperChain() {
	return chain(this);
}
var init_wrapperChain = __esmMin((() => {
	init_chain();
}));
//#endregion
//#region ../../node_modules/lodash-es/wrapperReverse.js
/**
* This method is the wrapper version of `_.reverse`.
*
* **Note:** This method mutates the wrapped array.
*
* @name reverse
* @memberOf _
* @since 0.1.0
* @category Seq
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* var array = [1, 2, 3];
*
* _(array).reverse().value()
* // => [3, 2, 1]
*
* console.log(array);
* // => [3, 2, 1]
*/
function wrapperReverse() {
	var value = this.__wrapped__;
	if (value instanceof LazyWrapper) {
		var wrapped = value;
		if (this.__actions__.length) wrapped = new LazyWrapper(this);
		wrapped = wrapped.reverse();
		wrapped.__actions__.push({
			"func": thru,
			"args": [reverse],
			"thisArg": void 0
		});
		return new LodashWrapper(wrapped, this.__chain__);
	}
	return this.thru(reverse);
}
var init_wrapperReverse = __esmMin((() => {
	init__LazyWrapper();
	init__LodashWrapper();
	init_reverse();
	init_thru();
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseXor.js
/**
* The base implementation of methods like `_.xor`, without support for
* iteratee shorthands, that accepts an array of arrays to inspect.
*
* @private
* @param {Array} arrays The arrays to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new array of values.
*/
function baseXor(arrays, iteratee, comparator) {
	var length = arrays.length;
	if (length < 2) return length ? baseUniq(arrays[0]) : [];
	var index = -1, result = Array(length);
	while (++index < length) {
		var array = arrays[index], othIndex = -1;
		while (++othIndex < length) if (othIndex != index) result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
	}
	return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}
var init__baseXor = __esmMin((() => {
	init__baseDifference();
	init__baseFlatten();
	init__baseUniq();
}));
//#endregion
//#region ../../node_modules/lodash-es/xor.js
var xor;
var init_xor = __esmMin((() => {
	init__arrayFilter();
	init__baseRest();
	init__baseXor();
	init_isArrayLikeObject();
	xor = baseRest(function(arrays) {
		return baseXor(arrayFilter(arrays, isArrayLikeObject));
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/xorBy.js
var xorBy;
var init_xorBy = __esmMin((() => {
	init__arrayFilter();
	init__baseIteratee();
	init__baseRest();
	init__baseXor();
	init_isArrayLikeObject();
	init_last();
	xorBy = baseRest(function(arrays) {
		var iteratee = last(arrays);
		if (isArrayLikeObject(iteratee)) iteratee = void 0;
		return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee, 2));
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/xorWith.js
var xorWith;
var init_xorWith = __esmMin((() => {
	init__arrayFilter();
	init__baseRest();
	init__baseXor();
	init_isArrayLikeObject();
	init_last();
	xorWith = baseRest(function(arrays) {
		var comparator = last(arrays);
		comparator = typeof comparator == "function" ? comparator : void 0;
		return baseXor(arrayFilter(arrays, isArrayLikeObject), void 0, comparator);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/zip.js
var zip;
var init_zip = __esmMin((() => {
	init__baseRest();
	init_unzip();
	zip = baseRest(unzip);
}));
//#endregion
//#region ../../node_modules/lodash-es/_baseZipObject.js
/**
* This base implementation of `_.zipObject` which assigns values using `assignFunc`.
*
* @private
* @param {Array} props The property identifiers.
* @param {Array} values The property values.
* @param {Function} assignFunc The function to assign values.
* @returns {Object} Returns the new object.
*/
function baseZipObject(props, values, assignFunc) {
	var index = -1, length = props.length, valsLength = values.length, result = {};
	while (++index < length) {
		var value = index < valsLength ? values[index] : void 0;
		assignFunc(result, props[index], value);
	}
	return result;
}
var init__baseZipObject = __esmMin((() => {}));
//#endregion
//#region ../../node_modules/lodash-es/zipObject.js
/**
* This method is like `_.fromPairs` except that it accepts two arrays,
* one of property identifiers and one of corresponding values.
*
* @static
* @memberOf _
* @since 0.4.0
* @category Array
* @param {Array} [props=[]] The property identifiers.
* @param {Array} [values=[]] The property values.
* @returns {Object} Returns the new object.
* @example
*
* _.zipObject(['a', 'b'], [1, 2]);
* // => { 'a': 1, 'b': 2 }
*/
function zipObject(props, values) {
	return baseZipObject(props || [], values || [], assignValue);
}
var init_zipObject = __esmMin((() => {
	init__assignValue();
	init__baseZipObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/zipObjectDeep.js
/**
* This method is like `_.zipObject` except that it supports property paths.
*
* @static
* @memberOf _
* @since 4.1.0
* @category Array
* @param {Array} [props=[]] The property identifiers.
* @param {Array} [values=[]] The property values.
* @returns {Object} Returns the new object.
* @example
*
* _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
* // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
*/
function zipObjectDeep(props, values) {
	return baseZipObject(props || [], values || [], baseSet);
}
var init_zipObjectDeep = __esmMin((() => {
	init__baseSet();
	init__baseZipObject();
}));
//#endregion
//#region ../../node_modules/lodash-es/zipWith.js
var zipWith;
var init_zipWith = __esmMin((() => {
	init__baseRest();
	init_unzipWith();
	zipWith = baseRest(function(arrays) {
		var length = arrays.length, iteratee = length > 1 ? arrays[length - 1] : void 0;
		iteratee = typeof iteratee == "function" ? (arrays.pop(), iteratee) : void 0;
		return unzipWith(arrays, iteratee);
	});
}));
//#endregion
//#region ../../node_modules/lodash-es/array.default.js
var array_default_default;
var init_array_default = __esmMin((() => {
	init_chunk();
	init_compact();
	init_concat();
	init_difference();
	init_differenceBy();
	init_differenceWith();
	init_drop();
	init_dropRight();
	init_dropRightWhile();
	init_dropWhile();
	init_fill();
	init_findIndex();
	init_findLastIndex();
	init_first();
	init_flatten();
	init_flattenDeep();
	init_flattenDepth();
	init_fromPairs();
	init_head();
	init_indexOf();
	init_initial();
	init_intersection();
	init_intersectionBy();
	init_intersectionWith();
	init_join();
	init_last();
	init_lastIndexOf();
	init_nth();
	init_pull();
	init_pullAll();
	init_pullAllBy();
	init_pullAllWith();
	init_pullAt();
	init_remove();
	init_reverse();
	init_slice();
	init_sortedIndex();
	init_sortedIndexBy();
	init_sortedIndexOf();
	init_sortedLastIndex();
	init_sortedLastIndexBy();
	init_sortedLastIndexOf();
	init_sortedUniq();
	init_sortedUniqBy();
	init_tail();
	init_take();
	init_takeRight();
	init_takeRightWhile();
	init_takeWhile();
	init_union();
	init_unionBy();
	init_unionWith();
	init_uniq();
	init_uniqBy();
	init_uniqWith();
	init_unzip();
	init_unzipWith();
	init_without();
	init_xor();
	init_xorBy();
	init_xorWith();
	init_zip();
	init_zipObject();
	init_zipObjectDeep();
	init_zipWith();
	array_default_default = {
		chunk,
		compact,
		concat,
		difference,
		differenceBy,
		differenceWith,
		drop,
		dropRight,
		dropRightWhile,
		dropWhile,
		fill,
		findIndex,
		findLastIndex,
		first: head,
		flatten,
		flattenDeep,
		flattenDepth,
		fromPairs,
		head,
		indexOf,
		initial,
		intersection,
		intersectionBy,
		intersectionWith,
		join,
		last,
		lastIndexOf,
		nth,
		pull,
		pullAll,
		pullAllBy,
		pullAllWith,
		pullAt,
		remove,
		reverse,
		slice,
		sortedIndex,
		sortedIndexBy,
		sortedIndexOf,
		sortedLastIndex,
		sortedLastIndexBy,
		sortedLastIndexOf,
		sortedUniq,
		sortedUniqBy,
		tail,
		take,
		takeRight,
		takeRightWhile,
		takeWhile,
		union,
		unionBy,
		unionWith,
		uniq,
		uniqBy,
		uniqWith,
		unzip,
		unzipWith,
		without,
		xor,
		xorBy,
		xorWith,
		zip,
		zipObject,
		zipObjectDeep,
		zipWith
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/array.js
var init_array = __esmMin((() => {
	init_chunk();
	init_compact();
	init_concat();
	init_difference();
	init_differenceBy();
	init_differenceWith();
	init_drop();
	init_dropRight();
	init_dropRightWhile();
	init_dropWhile();
	init_fill();
	init_findIndex();
	init_findLastIndex();
	init_first();
	init_flatten();
	init_flattenDeep();
	init_flattenDepth();
	init_fromPairs();
	init_head();
	init_indexOf();
	init_initial();
	init_intersection();
	init_intersectionBy();
	init_intersectionWith();
	init_join();
	init_last();
	init_lastIndexOf();
	init_nth();
	init_pull();
	init_pullAll();
	init_pullAllBy();
	init_pullAllWith();
	init_pullAt();
	init_remove();
	init_reverse();
	init_slice();
	init_sortedIndex();
	init_sortedIndexBy();
	init_sortedIndexOf();
	init_sortedLastIndex();
	init_sortedLastIndexBy();
	init_sortedLastIndexOf();
	init_sortedUniq();
	init_sortedUniqBy();
	init_tail();
	init_take();
	init_takeRight();
	init_takeRightWhile();
	init_takeWhile();
	init_union();
	init_unionBy();
	init_unionWith();
	init_uniq();
	init_uniqBy();
	init_uniqWith();
	init_unzip();
	init_unzipWith();
	init_without();
	init_xor();
	init_xorBy();
	init_xorWith();
	init_zip();
	init_zipObject();
	init_zipObjectDeep();
	init_zipWith();
	init_array_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/collection.default.js
var collection_default_default;
var init_collection_default = __esmMin((() => {
	init_countBy();
	init_each();
	init_eachRight();
	init_every();
	init_filter();
	init_find();
	init_findLast();
	init_flatMap();
	init_flatMapDeep();
	init_flatMapDepth();
	init_forEach();
	init_forEachRight();
	init_groupBy();
	init_includes();
	init_invokeMap();
	init_keyBy();
	init_map();
	init_orderBy();
	init_partition();
	init_reduce();
	init_reduceRight();
	init_reject();
	init_sample();
	init_sampleSize();
	init_shuffle();
	init_size();
	init_some();
	init_sortBy();
	collection_default_default = {
		countBy,
		each: forEach,
		eachRight: forEachRight,
		every,
		filter,
		find,
		findLast,
		flatMap,
		flatMapDeep,
		flatMapDepth,
		forEach,
		forEachRight,
		groupBy,
		includes,
		invokeMap,
		keyBy,
		map,
		orderBy,
		partition,
		reduce,
		reduceRight,
		reject,
		sample,
		sampleSize,
		shuffle,
		size,
		some,
		sortBy
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/collection.js
var init_collection = __esmMin((() => {
	init_countBy();
	init_each();
	init_eachRight();
	init_every();
	init_filter();
	init_find();
	init_findLast();
	init_flatMap();
	init_flatMapDeep();
	init_flatMapDepth();
	init_forEach();
	init_forEachRight();
	init_groupBy();
	init_includes();
	init_invokeMap();
	init_keyBy();
	init_map();
	init_orderBy();
	init_partition();
	init_reduce();
	init_reduceRight();
	init_reject();
	init_sample();
	init_sampleSize();
	init_shuffle();
	init_size();
	init_some();
	init_sortBy();
	init_collection_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/date.default.js
var date_default_default;
var init_date_default = __esmMin((() => {
	init_now();
	date_default_default = { now };
}));
//#endregion
//#region ../../node_modules/lodash-es/date.js
var init_date = __esmMin((() => {
	init_now();
	init_date_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/function.default.js
var function_default_default;
var init_function_default = __esmMin((() => {
	init_after();
	init_ary();
	init_before();
	init_bind();
	init_bindKey();
	init_curry();
	init_curryRight();
	init_debounce();
	init_defer();
	init_delay();
	init_flip();
	init_memoize();
	init_negate();
	init_once();
	init_overArgs();
	init_partial();
	init_partialRight();
	init_rearg();
	init_rest();
	init_spread();
	init_throttle();
	init_unary();
	init_wrap();
	function_default_default = {
		after,
		ary,
		before,
		bind,
		bindKey,
		curry,
		curryRight,
		debounce,
		defer,
		delay,
		flip,
		memoize,
		negate,
		once,
		overArgs,
		partial,
		partialRight,
		rearg,
		rest,
		spread,
		throttle,
		unary,
		wrap
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/function.js
var init_function = __esmMin((() => {
	init_after();
	init_ary();
	init_before();
	init_bind();
	init_bindKey();
	init_curry();
	init_curryRight();
	init_debounce();
	init_defer();
	init_delay();
	init_flip();
	init_memoize();
	init_negate();
	init_once();
	init_overArgs();
	init_partial();
	init_partialRight();
	init_rearg();
	init_rest();
	init_spread();
	init_throttle();
	init_unary();
	init_wrap();
	init_function_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/lang.default.js
var lang_default_default;
var init_lang_default = __esmMin((() => {
	init_castArray();
	init_clone();
	init_cloneDeep();
	init_cloneDeepWith();
	init_cloneWith();
	init_conformsTo();
	init_eq();
	init_gt();
	init_gte();
	init_isArguments();
	init_isArray();
	init_isArrayBuffer();
	init_isArrayLike();
	init_isArrayLikeObject();
	init_isBoolean();
	init_isBuffer();
	init_isDate();
	init_isElement();
	init_isEmpty();
	init_isEqual();
	init_isEqualWith();
	init_isError();
	init_isFinite();
	init_isFunction();
	init_isInteger();
	init_isLength();
	init_isMap();
	init_isMatch();
	init_isMatchWith();
	init_isNaN();
	init_isNative();
	init_isNil();
	init_isNull();
	init_isNumber();
	init_isObject();
	init_isObjectLike();
	init_isPlainObject();
	init_isRegExp();
	init_isSafeInteger();
	init_isSet();
	init_isString();
	init_isSymbol();
	init_isTypedArray();
	init_isUndefined();
	init_isWeakMap();
	init_isWeakSet();
	init_lt();
	init_lte();
	init_toArray();
	init_toFinite();
	init_toInteger();
	init_toLength();
	init_toNumber();
	init_toPlainObject();
	init_toSafeInteger();
	init_toString();
	lang_default_default = {
		castArray,
		clone,
		cloneDeep,
		cloneDeepWith,
		cloneWith,
		conformsTo,
		eq,
		gt,
		gte,
		isArguments,
		isArray,
		isArrayBuffer,
		isArrayLike,
		isArrayLikeObject,
		isBoolean,
		isBuffer,
		isDate,
		isElement,
		isEmpty,
		isEqual: isEqual$1,
		isEqualWith,
		isError,
		isFinite,
		isFunction,
		isInteger,
		isLength,
		isMap,
		isMatch,
		isMatchWith,
		isNaN,
		isNative,
		isNil,
		isNull,
		isNumber,
		isObject,
		isObjectLike,
		isPlainObject,
		isRegExp,
		isSafeInteger,
		isSet,
		isString,
		isSymbol,
		isTypedArray,
		isUndefined,
		isWeakMap,
		isWeakSet,
		lt,
		lte,
		toArray,
		toFinite,
		toInteger,
		toLength,
		toNumber,
		toPlainObject,
		toSafeInteger,
		toString
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/lang.js
var init_lang = __esmMin((() => {
	init_castArray();
	init_clone();
	init_cloneDeep();
	init_cloneDeepWith();
	init_cloneWith();
	init_conformsTo();
	init_eq();
	init_gt();
	init_gte();
	init_isArguments();
	init_isArray();
	init_isArrayBuffer();
	init_isArrayLike();
	init_isArrayLikeObject();
	init_isBoolean();
	init_isBuffer();
	init_isDate();
	init_isElement();
	init_isEmpty();
	init_isEqual();
	init_isEqualWith();
	init_isError();
	init_isFinite();
	init_isFunction();
	init_isInteger();
	init_isLength();
	init_isMap();
	init_isMatch();
	init_isMatchWith();
	init_isNaN();
	init_isNative();
	init_isNil();
	init_isNull();
	init_isNumber();
	init_isObject();
	init_isObjectLike();
	init_isPlainObject();
	init_isRegExp();
	init_isSafeInteger();
	init_isSet();
	init_isString();
	init_isSymbol();
	init_isTypedArray();
	init_isUndefined();
	init_isWeakMap();
	init_isWeakSet();
	init_lt();
	init_lte();
	init_toArray();
	init_toFinite();
	init_toInteger();
	init_toLength();
	init_toNumber();
	init_toPlainObject();
	init_toSafeInteger();
	init_toString();
	init_lang_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/math.default.js
var math_default_default;
var init_math_default = __esmMin((() => {
	init_add();
	init_ceil();
	init_divide();
	init_floor();
	init_max();
	init_maxBy();
	init_mean();
	init_meanBy();
	init_min();
	init_minBy();
	init_multiply();
	init_round();
	init_subtract();
	init_sum();
	init_sumBy();
	math_default_default = {
		add,
		ceil,
		divide,
		floor,
		max,
		maxBy,
		mean,
		meanBy,
		min,
		minBy,
		multiply,
		round,
		subtract,
		sum,
		sumBy
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/math.js
var init_math = __esmMin((() => {
	init_add();
	init_ceil();
	init_divide();
	init_floor();
	init_max();
	init_maxBy();
	init_mean();
	init_meanBy();
	init_min();
	init_minBy();
	init_multiply();
	init_round();
	init_subtract();
	init_sum();
	init_sumBy();
	init_math_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/number.default.js
var number_default_default;
var init_number_default = __esmMin((() => {
	init_clamp();
	init_inRange();
	init_random();
	number_default_default = {
		clamp,
		inRange,
		random
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/number.js
var init_number = __esmMin((() => {
	init_clamp();
	init_inRange();
	init_random();
	init_number_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/object.default.js
var object_default_default;
var init_object_default = __esmMin((() => {
	init_assign();
	init_assignIn();
	init_assignInWith();
	init_assignWith();
	init_at();
	init_create();
	init_defaults();
	init_defaultsDeep();
	init_entries();
	init_entriesIn();
	init_extend();
	init_extendWith();
	init_findKey();
	init_findLastKey();
	init_forIn();
	init_forInRight();
	init_forOwn();
	init_forOwnRight();
	init_functions();
	init_functionsIn();
	init_get();
	init_has();
	init_hasIn();
	init_invert();
	init_invertBy();
	init_invoke();
	init_keys();
	init_keysIn();
	init_mapKeys();
	init_mapValues();
	init_merge();
	init_mergeWith();
	init_omit();
	init_omitBy();
	init_pick();
	init_pickBy();
	init_result();
	init_set();
	init_setWith();
	init_toPairs();
	init_toPairsIn();
	init_transform();
	init_unset();
	init_update();
	init_updateWith();
	init_values();
	init_valuesIn();
	object_default_default = {
		assign,
		assignIn,
		assignInWith,
		assignWith,
		at,
		create,
		defaults,
		defaultsDeep,
		entries: toPairs,
		entriesIn: toPairsIn,
		extend: assignIn,
		extendWith: assignInWith,
		findKey,
		findLastKey,
		forIn,
		forInRight,
		forOwn,
		forOwnRight,
		functions,
		functionsIn,
		get,
		has,
		hasIn,
		invert,
		invertBy,
		invoke,
		keys,
		keysIn,
		mapKeys,
		mapValues,
		merge,
		mergeWith,
		omit,
		omitBy,
		pick,
		pickBy,
		result,
		set,
		setWith,
		toPairs,
		toPairsIn,
		transform,
		unset,
		update,
		updateWith,
		values,
		valuesIn
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/object.js
var init_object = __esmMin((() => {
	init_assign();
	init_assignIn();
	init_assignInWith();
	init_assignWith();
	init_at();
	init_create();
	init_defaults();
	init_defaultsDeep();
	init_entries();
	init_entriesIn();
	init_extend();
	init_extendWith();
	init_findKey();
	init_findLastKey();
	init_forIn();
	init_forInRight();
	init_forOwn();
	init_forOwnRight();
	init_functions();
	init_functionsIn();
	init_get();
	init_has();
	init_hasIn();
	init_invert();
	init_invertBy();
	init_invoke();
	init_keys();
	init_keysIn();
	init_mapKeys();
	init_mapValues();
	init_merge();
	init_mergeWith();
	init_omit();
	init_omitBy();
	init_pick();
	init_pickBy();
	init_result();
	init_set();
	init_setWith();
	init_toPairs();
	init_toPairsIn();
	init_transform();
	init_unset();
	init_update();
	init_updateWith();
	init_values();
	init_valuesIn();
	init_object_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/seq.default.js
var seq_default_default;
var init_seq_default = __esmMin((() => {
	init_wrapperAt();
	init_chain();
	init_commit();
	init_wrapperLodash();
	init_next();
	init_plant();
	init_wrapperReverse();
	init_tap();
	init_thru();
	init_toIterator();
	init_toJSON();
	init_wrapperValue();
	init_valueOf();
	init_wrapperChain();
	seq_default_default = {
		at: wrapperAt,
		chain,
		commit: wrapperCommit,
		lodash,
		next: wrapperNext,
		plant: wrapperPlant,
		reverse: wrapperReverse,
		tap,
		thru,
		toIterator: wrapperToIterator,
		toJSON: wrapperValue,
		value: wrapperValue,
		valueOf: wrapperValue,
		wrapperChain
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/seq.js
var init_seq = __esmMin((() => {
	init_wrapperAt();
	init_chain();
	init_commit();
	init_wrapperLodash();
	init_next();
	init_plant();
	init_wrapperReverse();
	init_tap();
	init_thru();
	init_toIterator();
	init_toJSON();
	init_wrapperValue();
	init_valueOf();
	init_wrapperChain();
	init_seq_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/string.default.js
var string_default_default;
var init_string_default = __esmMin((() => {
	init_camelCase();
	init_capitalize();
	init_deburr();
	init_endsWith();
	init_escape();
	init_escapeRegExp();
	init_kebabCase();
	init_lowerCase();
	init_lowerFirst();
	init_pad();
	init_padEnd();
	init_padStart();
	init_parseInt();
	init_repeat();
	init_replace();
	init_snakeCase();
	init_split();
	init_startCase();
	init_startsWith();
	init_template();
	init_templateSettings();
	init_toLower();
	init_toUpper();
	init_trim();
	init_trimEnd();
	init_trimStart();
	init_truncate();
	init_unescape();
	init_upperCase();
	init_upperFirst();
	init_words();
	string_default_default = {
		camelCase,
		capitalize,
		deburr,
		endsWith,
		escape,
		escapeRegExp,
		kebabCase,
		lowerCase,
		lowerFirst,
		pad,
		padEnd,
		padStart,
		parseInt: parseInt$1,
		repeat,
		replace,
		snakeCase,
		split,
		startCase,
		startsWith,
		template,
		templateSettings,
		toLower,
		toUpper,
		trim,
		trimEnd,
		trimStart,
		truncate,
		unescape,
		upperCase,
		upperFirst,
		words
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/string.js
var init_string = __esmMin((() => {
	init_camelCase();
	init_capitalize();
	init_deburr();
	init_endsWith();
	init_escape();
	init_escapeRegExp();
	init_kebabCase();
	init_lowerCase();
	init_lowerFirst();
	init_pad();
	init_padEnd();
	init_padStart();
	init_parseInt();
	init_repeat();
	init_replace();
	init_snakeCase();
	init_split();
	init_startCase();
	init_startsWith();
	init_template();
	init_templateSettings();
	init_toLower();
	init_toUpper();
	init_trim();
	init_trimEnd();
	init_trimStart();
	init_truncate();
	init_unescape();
	init_upperCase();
	init_upperFirst();
	init_words();
	init_string_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/util.default.js
var util_default_default;
var init_util_default = __esmMin((() => {
	init_attempt();
	init_bindAll();
	init_cond();
	init_conforms();
	init_constant();
	init_defaultTo();
	init_flow();
	init_flowRight();
	init_identity();
	init_iteratee();
	init_matches();
	init_matchesProperty();
	init_method();
	init_methodOf();
	init_mixin();
	init_noop();
	init_nthArg();
	init_over();
	init_overEvery();
	init_overSome();
	init_property();
	init_propertyOf();
	init_range();
	init_rangeRight();
	init_stubArray();
	init_stubFalse();
	init_stubObject();
	init_stubString();
	init_stubTrue();
	init_times();
	init_toPath();
	init_uniqueId();
	util_default_default = {
		attempt,
		bindAll,
		cond,
		conforms,
		constant,
		defaultTo,
		flow,
		flowRight,
		identity,
		iteratee,
		matches,
		matchesProperty,
		method,
		methodOf,
		mixin: mixin$1,
		noop,
		nthArg,
		over,
		overEvery,
		overSome,
		property,
		propertyOf,
		range,
		rangeRight,
		stubArray,
		stubFalse,
		stubObject,
		stubString,
		stubTrue,
		times,
		toPath,
		uniqueId
	};
}));
//#endregion
//#region ../../node_modules/lodash-es/util.js
var init_util = __esmMin((() => {
	init_attempt();
	init_bindAll();
	init_cond();
	init_conforms();
	init_constant();
	init_defaultTo();
	init_flow();
	init_flowRight();
	init_identity();
	init_iteratee();
	init_matches();
	init_matchesProperty();
	init_method();
	init_methodOf();
	init_mixin();
	init_noop();
	init_nthArg();
	init_over();
	init_overEvery();
	init_overSome();
	init_property();
	init_propertyOf();
	init_range();
	init_rangeRight();
	init_stubArray();
	init_stubFalse();
	init_stubObject();
	init_stubString();
	init_stubTrue();
	init_times();
	init_toPath();
	init_uniqueId();
	init_util_default();
}));
//#endregion
//#region ../../node_modules/lodash-es/_lazyClone.js
/**
* Creates a clone of the lazy wrapper object.
*
* @private
* @name clone
* @memberOf LazyWrapper
* @returns {Object} Returns the cloned `LazyWrapper` object.
*/
function lazyClone() {
	var result = new LazyWrapper(this.__wrapped__);
	result.__actions__ = copyArray(this.__actions__);
	result.__dir__ = this.__dir__;
	result.__filtered__ = this.__filtered__;
	result.__iteratees__ = copyArray(this.__iteratees__);
	result.__takeCount__ = this.__takeCount__;
	result.__views__ = copyArray(this.__views__);
	return result;
}
var init__lazyClone = __esmMin((() => {
	init__LazyWrapper();
	init__copyArray();
}));
//#endregion
//#region ../../node_modules/lodash-es/_lazyReverse.js
/**
* Reverses the direction of lazy iteration.
*
* @private
* @name reverse
* @memberOf LazyWrapper
* @returns {Object} Returns the new reversed `LazyWrapper` object.
*/
function lazyReverse() {
	if (this.__filtered__) {
		var result = new LazyWrapper(this);
		result.__dir__ = -1;
		result.__filtered__ = true;
	} else {
		result = this.clone();
		result.__dir__ *= -1;
	}
	return result;
}
var init__lazyReverse = __esmMin((() => {
	init__LazyWrapper();
}));
//#endregion
//#region ../../node_modules/lodash-es/_getView.js
/**
* Gets the view, applying any `transforms` to the `start` and `end` positions.
*
* @private
* @param {number} start The start of the view.
* @param {number} end The end of the view.
* @param {Array} transforms The transformations to apply to the view.
* @returns {Object} Returns an object containing the `start` and `end`
*  positions of the view.
*/
function getView(start, end, transforms) {
	var index = -1, length = transforms.length;
	while (++index < length) {
		var data = transforms[index], size = data.size;
		switch (data.type) {
			case "drop":
				start += size;
				break;
			case "dropRight":
				end -= size;
				break;
			case "take":
				end = nativeMin$2(end, start + size);
				break;
			case "takeRight":
				start = nativeMax$1(start, end - size);
				break;
		}
	}
	return {
		"start": start,
		"end": end
	};
}
var nativeMax$1, nativeMin$2;
var init__getView = __esmMin((() => {
	nativeMax$1 = Math.max, nativeMin$2 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/_lazyValue.js
/**
* Extracts the unwrapped value from its lazy wrapper.
*
* @private
* @name value
* @memberOf LazyWrapper
* @returns {*} Returns the unwrapped value.
*/
function lazyValue() {
	var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin$1(length, this.__takeCount__);
	if (!isArr || !isRight && arrLength == length && takeCount == length) return baseWrapperValue(array, this.__actions__);
	var result = [];
	outer: while (length-- && resIndex < takeCount) {
		index += dir;
		var iterIndex = -1, value = array[index];
		while (++iterIndex < iterLength) {
			var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type, computed = iteratee(value);
			if (type == LAZY_MAP_FLAG) value = computed;
			else if (!computed) if (type == LAZY_FILTER_FLAG$1) continue outer;
			else break outer;
		}
		result[resIndex++] = value;
	}
	return result;
}
var LAZY_FILTER_FLAG$1, LAZY_MAP_FLAG, nativeMin$1;
var init__lazyValue = __esmMin((() => {
	init__baseWrapperValue();
	init__getView();
	init_isArray();
	LAZY_FILTER_FLAG$1 = 1, LAZY_MAP_FLAG = 2;
	nativeMin$1 = Math.min;
}));
//#endregion
//#region ../../node_modules/lodash-es/lodash.default.js
var VERSION, WRAP_BIND_KEY_FLAG, LAZY_FILTER_FLAG, LAZY_WHILE_FLAG, MAX_ARRAY_LENGTH, arrayProto, hasOwnProperty, symIterator, nativeMax, nativeMin, mixin, lodash_default_default;
var init_lodash_default = __esmMin((() => {
	init_array();
	init_collection();
	init_date();
	init_function();
	init_lang();
	init_math();
	init_number();
	init_object();
	init_seq();
	init_string();
	init_util();
	init__LazyWrapper();
	init__LodashWrapper();
	init__Symbol();
	init__arrayEach();
	init__arrayPush();
	init__baseForOwn();
	init__baseFunctions();
	init__baseInvoke();
	init__baseIteratee();
	init__baseRest();
	init__createHybrid();
	init_identity();
	init_isArray();
	init_isObject();
	init_keys();
	init_last();
	init__lazyClone();
	init__lazyReverse();
	init__lazyValue();
	init_mixin();
	init_negate();
	init__realNames();
	init_thru();
	init_toInteger();
	init_wrapperLodash();
	VERSION = "4.18.1";
	WRAP_BIND_KEY_FLAG = 2;
	LAZY_FILTER_FLAG = 1, LAZY_WHILE_FLAG = 3;
	MAX_ARRAY_LENGTH = 4294967295;
	arrayProto = Array.prototype;
	hasOwnProperty = Object.prototype.hasOwnProperty;
	symIterator = Symbol ? Symbol.iterator : void 0;
	nativeMax = Math.max, nativeMin = Math.min;
	mixin = function(func) {
		return function(object, source, options) {
			if (options == null) {
				var isObj = isObject(source), props = isObj && keys(source), methodNames = props && props.length && baseFunctions(source, props);
				if (!(methodNames ? methodNames.length : isObj)) {
					options = source;
					source = object;
					object = this;
				}
			}
			return func(object, source, options);
		};
	}(mixin$1);
	lodash.after = function_default_default.after;
	lodash.ary = function_default_default.ary;
	lodash.assign = object_default_default.assign;
	lodash.assignIn = object_default_default.assignIn;
	lodash.assignInWith = object_default_default.assignInWith;
	lodash.assignWith = object_default_default.assignWith;
	lodash.at = object_default_default.at;
	lodash.before = function_default_default.before;
	lodash.bind = function_default_default.bind;
	lodash.bindAll = util_default_default.bindAll;
	lodash.bindKey = function_default_default.bindKey;
	lodash.castArray = lang_default_default.castArray;
	lodash.chain = seq_default_default.chain;
	lodash.chunk = array_default_default.chunk;
	lodash.compact = array_default_default.compact;
	lodash.concat = array_default_default.concat;
	lodash.cond = util_default_default.cond;
	lodash.conforms = util_default_default.conforms;
	lodash.constant = util_default_default.constant;
	lodash.countBy = collection_default_default.countBy;
	lodash.create = object_default_default.create;
	lodash.curry = function_default_default.curry;
	lodash.curryRight = function_default_default.curryRight;
	lodash.debounce = function_default_default.debounce;
	lodash.defaults = object_default_default.defaults;
	lodash.defaultsDeep = object_default_default.defaultsDeep;
	lodash.defer = function_default_default.defer;
	lodash.delay = function_default_default.delay;
	lodash.difference = array_default_default.difference;
	lodash.differenceBy = array_default_default.differenceBy;
	lodash.differenceWith = array_default_default.differenceWith;
	lodash.drop = array_default_default.drop;
	lodash.dropRight = array_default_default.dropRight;
	lodash.dropRightWhile = array_default_default.dropRightWhile;
	lodash.dropWhile = array_default_default.dropWhile;
	lodash.fill = array_default_default.fill;
	lodash.filter = collection_default_default.filter;
	lodash.flatMap = collection_default_default.flatMap;
	lodash.flatMapDeep = collection_default_default.flatMapDeep;
	lodash.flatMapDepth = collection_default_default.flatMapDepth;
	lodash.flatten = array_default_default.flatten;
	lodash.flattenDeep = array_default_default.flattenDeep;
	lodash.flattenDepth = array_default_default.flattenDepth;
	lodash.flip = function_default_default.flip;
	lodash.flow = util_default_default.flow;
	lodash.flowRight = util_default_default.flowRight;
	lodash.fromPairs = array_default_default.fromPairs;
	lodash.functions = object_default_default.functions;
	lodash.functionsIn = object_default_default.functionsIn;
	lodash.groupBy = collection_default_default.groupBy;
	lodash.initial = array_default_default.initial;
	lodash.intersection = array_default_default.intersection;
	lodash.intersectionBy = array_default_default.intersectionBy;
	lodash.intersectionWith = array_default_default.intersectionWith;
	lodash.invert = object_default_default.invert;
	lodash.invertBy = object_default_default.invertBy;
	lodash.invokeMap = collection_default_default.invokeMap;
	lodash.iteratee = util_default_default.iteratee;
	lodash.keyBy = collection_default_default.keyBy;
	lodash.keys = keys;
	lodash.keysIn = object_default_default.keysIn;
	lodash.map = collection_default_default.map;
	lodash.mapKeys = object_default_default.mapKeys;
	lodash.mapValues = object_default_default.mapValues;
	lodash.matches = util_default_default.matches;
	lodash.matchesProperty = util_default_default.matchesProperty;
	lodash.memoize = function_default_default.memoize;
	lodash.merge = object_default_default.merge;
	lodash.mergeWith = object_default_default.mergeWith;
	lodash.method = util_default_default.method;
	lodash.methodOf = util_default_default.methodOf;
	lodash.mixin = mixin;
	lodash.negate = negate;
	lodash.nthArg = util_default_default.nthArg;
	lodash.omit = object_default_default.omit;
	lodash.omitBy = object_default_default.omitBy;
	lodash.once = function_default_default.once;
	lodash.orderBy = collection_default_default.orderBy;
	lodash.over = util_default_default.over;
	lodash.overArgs = function_default_default.overArgs;
	lodash.overEvery = util_default_default.overEvery;
	lodash.overSome = util_default_default.overSome;
	lodash.partial = function_default_default.partial;
	lodash.partialRight = function_default_default.partialRight;
	lodash.partition = collection_default_default.partition;
	lodash.pick = object_default_default.pick;
	lodash.pickBy = object_default_default.pickBy;
	lodash.property = util_default_default.property;
	lodash.propertyOf = util_default_default.propertyOf;
	lodash.pull = array_default_default.pull;
	lodash.pullAll = array_default_default.pullAll;
	lodash.pullAllBy = array_default_default.pullAllBy;
	lodash.pullAllWith = array_default_default.pullAllWith;
	lodash.pullAt = array_default_default.pullAt;
	lodash.range = util_default_default.range;
	lodash.rangeRight = util_default_default.rangeRight;
	lodash.rearg = function_default_default.rearg;
	lodash.reject = collection_default_default.reject;
	lodash.remove = array_default_default.remove;
	lodash.rest = function_default_default.rest;
	lodash.reverse = array_default_default.reverse;
	lodash.sampleSize = collection_default_default.sampleSize;
	lodash.set = object_default_default.set;
	lodash.setWith = object_default_default.setWith;
	lodash.shuffle = collection_default_default.shuffle;
	lodash.slice = array_default_default.slice;
	lodash.sortBy = collection_default_default.sortBy;
	lodash.sortedUniq = array_default_default.sortedUniq;
	lodash.sortedUniqBy = array_default_default.sortedUniqBy;
	lodash.split = string_default_default.split;
	lodash.spread = function_default_default.spread;
	lodash.tail = array_default_default.tail;
	lodash.take = array_default_default.take;
	lodash.takeRight = array_default_default.takeRight;
	lodash.takeRightWhile = array_default_default.takeRightWhile;
	lodash.takeWhile = array_default_default.takeWhile;
	lodash.tap = seq_default_default.tap;
	lodash.throttle = function_default_default.throttle;
	lodash.thru = thru;
	lodash.toArray = lang_default_default.toArray;
	lodash.toPairs = object_default_default.toPairs;
	lodash.toPairsIn = object_default_default.toPairsIn;
	lodash.toPath = util_default_default.toPath;
	lodash.toPlainObject = lang_default_default.toPlainObject;
	lodash.transform = object_default_default.transform;
	lodash.unary = function_default_default.unary;
	lodash.union = array_default_default.union;
	lodash.unionBy = array_default_default.unionBy;
	lodash.unionWith = array_default_default.unionWith;
	lodash.uniq = array_default_default.uniq;
	lodash.uniqBy = array_default_default.uniqBy;
	lodash.uniqWith = array_default_default.uniqWith;
	lodash.unset = object_default_default.unset;
	lodash.unzip = array_default_default.unzip;
	lodash.unzipWith = array_default_default.unzipWith;
	lodash.update = object_default_default.update;
	lodash.updateWith = object_default_default.updateWith;
	lodash.values = object_default_default.values;
	lodash.valuesIn = object_default_default.valuesIn;
	lodash.without = array_default_default.without;
	lodash.words = string_default_default.words;
	lodash.wrap = function_default_default.wrap;
	lodash.xor = array_default_default.xor;
	lodash.xorBy = array_default_default.xorBy;
	lodash.xorWith = array_default_default.xorWith;
	lodash.zip = array_default_default.zip;
	lodash.zipObject = array_default_default.zipObject;
	lodash.zipObjectDeep = array_default_default.zipObjectDeep;
	lodash.zipWith = array_default_default.zipWith;
	lodash.entries = object_default_default.toPairs;
	lodash.entriesIn = object_default_default.toPairsIn;
	lodash.extend = object_default_default.assignIn;
	lodash.extendWith = object_default_default.assignInWith;
	mixin(lodash, lodash);
	lodash.add = math_default_default.add;
	lodash.attempt = util_default_default.attempt;
	lodash.camelCase = string_default_default.camelCase;
	lodash.capitalize = string_default_default.capitalize;
	lodash.ceil = math_default_default.ceil;
	lodash.clamp = number_default_default.clamp;
	lodash.clone = lang_default_default.clone;
	lodash.cloneDeep = lang_default_default.cloneDeep;
	lodash.cloneDeepWith = lang_default_default.cloneDeepWith;
	lodash.cloneWith = lang_default_default.cloneWith;
	lodash.conformsTo = lang_default_default.conformsTo;
	lodash.deburr = string_default_default.deburr;
	lodash.defaultTo = util_default_default.defaultTo;
	lodash.divide = math_default_default.divide;
	lodash.endsWith = string_default_default.endsWith;
	lodash.eq = lang_default_default.eq;
	lodash.escape = string_default_default.escape;
	lodash.escapeRegExp = string_default_default.escapeRegExp;
	lodash.every = collection_default_default.every;
	lodash.find = collection_default_default.find;
	lodash.findIndex = array_default_default.findIndex;
	lodash.findKey = object_default_default.findKey;
	lodash.findLast = collection_default_default.findLast;
	lodash.findLastIndex = array_default_default.findLastIndex;
	lodash.findLastKey = object_default_default.findLastKey;
	lodash.floor = math_default_default.floor;
	lodash.forEach = collection_default_default.forEach;
	lodash.forEachRight = collection_default_default.forEachRight;
	lodash.forIn = object_default_default.forIn;
	lodash.forInRight = object_default_default.forInRight;
	lodash.forOwn = object_default_default.forOwn;
	lodash.forOwnRight = object_default_default.forOwnRight;
	lodash.get = object_default_default.get;
	lodash.gt = lang_default_default.gt;
	lodash.gte = lang_default_default.gte;
	lodash.has = object_default_default.has;
	lodash.hasIn = object_default_default.hasIn;
	lodash.head = array_default_default.head;
	lodash.identity = identity;
	lodash.includes = collection_default_default.includes;
	lodash.indexOf = array_default_default.indexOf;
	lodash.inRange = number_default_default.inRange;
	lodash.invoke = object_default_default.invoke;
	lodash.isArguments = lang_default_default.isArguments;
	lodash.isArray = isArray;
	lodash.isArrayBuffer = lang_default_default.isArrayBuffer;
	lodash.isArrayLike = lang_default_default.isArrayLike;
	lodash.isArrayLikeObject = lang_default_default.isArrayLikeObject;
	lodash.isBoolean = lang_default_default.isBoolean;
	lodash.isBuffer = lang_default_default.isBuffer;
	lodash.isDate = lang_default_default.isDate;
	lodash.isElement = lang_default_default.isElement;
	lodash.isEmpty = lang_default_default.isEmpty;
	lodash.isEqual = lang_default_default.isEqual;
	lodash.isEqualWith = lang_default_default.isEqualWith;
	lodash.isError = lang_default_default.isError;
	lodash.isFinite = lang_default_default.isFinite;
	lodash.isFunction = lang_default_default.isFunction;
	lodash.isInteger = lang_default_default.isInteger;
	lodash.isLength = lang_default_default.isLength;
	lodash.isMap = lang_default_default.isMap;
	lodash.isMatch = lang_default_default.isMatch;
	lodash.isMatchWith = lang_default_default.isMatchWith;
	lodash.isNaN = lang_default_default.isNaN;
	lodash.isNative = lang_default_default.isNative;
	lodash.isNil = lang_default_default.isNil;
	lodash.isNull = lang_default_default.isNull;
	lodash.isNumber = lang_default_default.isNumber;
	lodash.isObject = isObject;
	lodash.isObjectLike = lang_default_default.isObjectLike;
	lodash.isPlainObject = lang_default_default.isPlainObject;
	lodash.isRegExp = lang_default_default.isRegExp;
	lodash.isSafeInteger = lang_default_default.isSafeInteger;
	lodash.isSet = lang_default_default.isSet;
	lodash.isString = lang_default_default.isString;
	lodash.isSymbol = lang_default_default.isSymbol;
	lodash.isTypedArray = lang_default_default.isTypedArray;
	lodash.isUndefined = lang_default_default.isUndefined;
	lodash.isWeakMap = lang_default_default.isWeakMap;
	lodash.isWeakSet = lang_default_default.isWeakSet;
	lodash.join = array_default_default.join;
	lodash.kebabCase = string_default_default.kebabCase;
	lodash.last = last;
	lodash.lastIndexOf = array_default_default.lastIndexOf;
	lodash.lowerCase = string_default_default.lowerCase;
	lodash.lowerFirst = string_default_default.lowerFirst;
	lodash.lt = lang_default_default.lt;
	lodash.lte = lang_default_default.lte;
	lodash.max = math_default_default.max;
	lodash.maxBy = math_default_default.maxBy;
	lodash.mean = math_default_default.mean;
	lodash.meanBy = math_default_default.meanBy;
	lodash.min = math_default_default.min;
	lodash.minBy = math_default_default.minBy;
	lodash.stubArray = util_default_default.stubArray;
	lodash.stubFalse = util_default_default.stubFalse;
	lodash.stubObject = util_default_default.stubObject;
	lodash.stubString = util_default_default.stubString;
	lodash.stubTrue = util_default_default.stubTrue;
	lodash.multiply = math_default_default.multiply;
	lodash.nth = array_default_default.nth;
	lodash.noop = util_default_default.noop;
	lodash.now = date_default_default.now;
	lodash.pad = string_default_default.pad;
	lodash.padEnd = string_default_default.padEnd;
	lodash.padStart = string_default_default.padStart;
	lodash.parseInt = string_default_default.parseInt;
	lodash.random = number_default_default.random;
	lodash.reduce = collection_default_default.reduce;
	lodash.reduceRight = collection_default_default.reduceRight;
	lodash.repeat = string_default_default.repeat;
	lodash.replace = string_default_default.replace;
	lodash.result = object_default_default.result;
	lodash.round = math_default_default.round;
	lodash.sample = collection_default_default.sample;
	lodash.size = collection_default_default.size;
	lodash.snakeCase = string_default_default.snakeCase;
	lodash.some = collection_default_default.some;
	lodash.sortedIndex = array_default_default.sortedIndex;
	lodash.sortedIndexBy = array_default_default.sortedIndexBy;
	lodash.sortedIndexOf = array_default_default.sortedIndexOf;
	lodash.sortedLastIndex = array_default_default.sortedLastIndex;
	lodash.sortedLastIndexBy = array_default_default.sortedLastIndexBy;
	lodash.sortedLastIndexOf = array_default_default.sortedLastIndexOf;
	lodash.startCase = string_default_default.startCase;
	lodash.startsWith = string_default_default.startsWith;
	lodash.subtract = math_default_default.subtract;
	lodash.sum = math_default_default.sum;
	lodash.sumBy = math_default_default.sumBy;
	lodash.template = string_default_default.template;
	lodash.times = util_default_default.times;
	lodash.toFinite = lang_default_default.toFinite;
	lodash.toInteger = toInteger;
	lodash.toLength = lang_default_default.toLength;
	lodash.toLower = string_default_default.toLower;
	lodash.toNumber = lang_default_default.toNumber;
	lodash.toSafeInteger = lang_default_default.toSafeInteger;
	lodash.toString = lang_default_default.toString;
	lodash.toUpper = string_default_default.toUpper;
	lodash.trim = string_default_default.trim;
	lodash.trimEnd = string_default_default.trimEnd;
	lodash.trimStart = string_default_default.trimStart;
	lodash.truncate = string_default_default.truncate;
	lodash.unescape = string_default_default.unescape;
	lodash.uniqueId = util_default_default.uniqueId;
	lodash.upperCase = string_default_default.upperCase;
	lodash.upperFirst = string_default_default.upperFirst;
	lodash.each = collection_default_default.forEach;
	lodash.eachRight = collection_default_default.forEachRight;
	lodash.first = array_default_default.head;
	mixin(lodash, function() {
		var source = {};
		baseForOwn(lodash, function(func, methodName) {
			if (!hasOwnProperty.call(lodash.prototype, methodName)) source[methodName] = func;
		});
		return source;
	}(), { "chain": false });
	/**
	* The semantic version number.
	*
	* @static
	* @memberOf _
	* @type {string}
	*/
	lodash.VERSION = VERSION;
	(lodash.templateSettings = string_default_default.templateSettings).imports._ = lodash;
	arrayEach([
		"bind",
		"bindKey",
		"curry",
		"curryRight",
		"partial",
		"partialRight"
	], function(methodName) {
		lodash[methodName].placeholder = lodash;
	});
	arrayEach(["drop", "take"], function(methodName, index) {
		LazyWrapper.prototype[methodName] = function(n) {
			n = n === void 0 ? 1 : nativeMax(toInteger(n), 0);
			var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
			if (result.__filtered__) result.__takeCount__ = nativeMin(n, result.__takeCount__);
			else result.__views__.push({
				"size": nativeMin(n, MAX_ARRAY_LENGTH),
				"type": methodName + (result.__dir__ < 0 ? "Right" : "")
			});
			return result;
		};
		LazyWrapper.prototype[methodName + "Right"] = function(n) {
			return this.reverse()[methodName](n).reverse();
		};
	});
	arrayEach([
		"filter",
		"map",
		"takeWhile"
	], function(methodName, index) {
		var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
		LazyWrapper.prototype[methodName] = function(iteratee) {
			var result = this.clone();
			result.__iteratees__.push({
				"iteratee": baseIteratee(iteratee, 3),
				"type": type
			});
			result.__filtered__ = result.__filtered__ || isFilter;
			return result;
		};
	});
	arrayEach(["head", "last"], function(methodName, index) {
		var takeName = "take" + (index ? "Right" : "");
		LazyWrapper.prototype[methodName] = function() {
			return this[takeName](1).value()[0];
		};
	});
	arrayEach(["initial", "tail"], function(methodName, index) {
		var dropName = "drop" + (index ? "" : "Right");
		LazyWrapper.prototype[methodName] = function() {
			return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
		};
	});
	LazyWrapper.prototype.compact = function() {
		return this.filter(identity);
	};
	LazyWrapper.prototype.find = function(predicate) {
		return this.filter(predicate).head();
	};
	LazyWrapper.prototype.findLast = function(predicate) {
		return this.reverse().find(predicate);
	};
	LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
		if (typeof path == "function") return new LazyWrapper(this);
		return this.map(function(value) {
			return baseInvoke(value, path, args);
		});
	});
	LazyWrapper.prototype.reject = function(predicate) {
		return this.filter(negate(baseIteratee(predicate)));
	};
	LazyWrapper.prototype.slice = function(start, end) {
		start = toInteger(start);
		var result = this;
		if (result.__filtered__ && (start > 0 || end < 0)) return new LazyWrapper(result);
		if (start < 0) result = result.takeRight(-start);
		else if (start) result = result.drop(start);
		if (end !== void 0) {
			end = toInteger(end);
			result = end < 0 ? result.dropRight(-end) : result.take(end - start);
		}
		return result;
	};
	LazyWrapper.prototype.takeRightWhile = function(predicate) {
		return this.reverse().takeWhile(predicate).reverse();
	};
	LazyWrapper.prototype.toArray = function() {
		return this.take(MAX_ARRAY_LENGTH);
	};
	baseForOwn(LazyWrapper.prototype, function(func, methodName) {
		var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
		if (!lodashFunc) return;
		lodash.prototype[methodName] = function() {
			var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
			var interceptor = function(value) {
				var result = lodashFunc.apply(lodash, arrayPush([value], args));
				return isTaker && chainAll ? result[0] : result;
			};
			if (useLazy && checkIteratee && typeof iteratee == "function" && iteratee.length != 1) isLazy = useLazy = false;
			var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
			if (!retUnwrapped && useLazy) {
				value = onlyLazy ? value : new LazyWrapper(this);
				var result = func.apply(value, args);
				result.__actions__.push({
					"func": thru,
					"args": [interceptor],
					"thisArg": void 0
				});
				return new LodashWrapper(result, chainAll);
			}
			if (isUnwrapped && onlyLazy) return func.apply(this, args);
			result = this.thru(interceptor);
			return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
		};
	});
	arrayEach([
		"pop",
		"push",
		"shift",
		"sort",
		"splice",
		"unshift"
	], function(methodName) {
		var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
		lodash.prototype[methodName] = function() {
			var args = arguments;
			if (retUnwrapped && !this.__chain__) {
				var value = this.value();
				return func.apply(isArray(value) ? value : [], args);
			}
			return this[chainName](function(value) {
				return func.apply(isArray(value) ? value : [], args);
			});
		};
	});
	baseForOwn(LazyWrapper.prototype, function(func, methodName) {
		var lodashFunc = lodash[methodName];
		if (lodashFunc) {
			var key = lodashFunc.name + "";
			if (!hasOwnProperty.call(realNames, key)) realNames[key] = [];
			realNames[key].push({
				"name": methodName,
				"func": lodashFunc
			});
		}
	});
	realNames[createHybrid(void 0, WRAP_BIND_KEY_FLAG).name] = [{
		"name": "wrapper",
		"func": void 0
	}];
	LazyWrapper.prototype.clone = lazyClone;
	LazyWrapper.prototype.reverse = lazyReverse;
	LazyWrapper.prototype.value = lazyValue;
	lodash.prototype.at = seq_default_default.at;
	lodash.prototype.chain = seq_default_default.wrapperChain;
	lodash.prototype.commit = seq_default_default.commit;
	lodash.prototype.next = seq_default_default.next;
	lodash.prototype.plant = seq_default_default.plant;
	lodash.prototype.reverse = seq_default_default.reverse;
	lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = seq_default_default.value;
	lodash.prototype.first = lodash.prototype.head;
	if (symIterator) lodash.prototype[symIterator] = seq_default_default.toIterator;
	lodash_default_default = lodash;
}));
//#endregion
//#region ../../node_modules/lodash-es/lodash.js
var lodash_exports = /* @__PURE__ */ __exportAll({
	add: () => add,
	after: () => after,
	ary: () => ary,
	assign: () => assign,
	assignIn: () => assignIn,
	assignInWith: () => assignInWith,
	assignWith: () => assignWith,
	at: () => at,
	attempt: () => attempt,
	before: () => before,
	bind: () => bind,
	bindAll: () => bindAll,
	bindKey: () => bindKey,
	camelCase: () => camelCase,
	capitalize: () => capitalize,
	castArray: () => castArray,
	ceil: () => ceil,
	chain: () => chain,
	chunk: () => chunk,
	clamp: () => clamp,
	clone: () => clone,
	cloneDeep: () => cloneDeep,
	cloneDeepWith: () => cloneDeepWith,
	cloneWith: () => cloneWith,
	commit: () => wrapperCommit,
	compact: () => compact,
	concat: () => concat,
	cond: () => cond,
	conforms: () => conforms,
	conformsTo: () => conformsTo,
	constant: () => constant,
	countBy: () => countBy,
	create: () => create,
	curry: () => curry,
	curryRight: () => curryRight,
	debounce: () => debounce,
	deburr: () => deburr,
	default: () => lodash_default_default,
	defaultTo: () => defaultTo,
	defaults: () => defaults,
	defaultsDeep: () => defaultsDeep,
	defer: () => defer,
	delay: () => delay,
	difference: () => difference,
	differenceBy: () => differenceBy,
	differenceWith: () => differenceWith,
	divide: () => divide,
	drop: () => drop,
	dropRight: () => dropRight,
	dropRightWhile: () => dropRightWhile,
	dropWhile: () => dropWhile,
	each: () => forEach,
	eachRight: () => forEachRight,
	endsWith: () => endsWith,
	entries: () => toPairs,
	entriesIn: () => toPairsIn,
	eq: () => eq,
	escape: () => escape,
	escapeRegExp: () => escapeRegExp,
	every: () => every,
	extend: () => assignIn,
	extendWith: () => assignInWith,
	fill: () => fill,
	filter: () => filter,
	find: () => find,
	findIndex: () => findIndex,
	findKey: () => findKey,
	findLast: () => findLast,
	findLastIndex: () => findLastIndex,
	findLastKey: () => findLastKey,
	first: () => head,
	flatMap: () => flatMap,
	flatMapDeep: () => flatMapDeep,
	flatMapDepth: () => flatMapDepth,
	flatten: () => flatten,
	flattenDeep: () => flattenDeep,
	flattenDepth: () => flattenDepth,
	flip: () => flip,
	floor: () => floor,
	flow: () => flow,
	flowRight: () => flowRight,
	forEach: () => forEach,
	forEachRight: () => forEachRight,
	forIn: () => forIn,
	forInRight: () => forInRight,
	forOwn: () => forOwn,
	forOwnRight: () => forOwnRight,
	fromPairs: () => fromPairs,
	functions: () => functions,
	functionsIn: () => functionsIn,
	get: () => get,
	groupBy: () => groupBy,
	gt: () => gt,
	gte: () => gte,
	has: () => has,
	hasIn: () => hasIn,
	head: () => head,
	identity: () => identity,
	inRange: () => inRange,
	includes: () => includes,
	indexOf: () => indexOf,
	initial: () => initial,
	intersection: () => intersection,
	intersectionBy: () => intersectionBy,
	intersectionWith: () => intersectionWith,
	invert: () => invert,
	invertBy: () => invertBy,
	invoke: () => invoke,
	invokeMap: () => invokeMap,
	isArguments: () => isArguments,
	isArray: () => isArray,
	isArrayBuffer: () => isArrayBuffer,
	isArrayLike: () => isArrayLike,
	isArrayLikeObject: () => isArrayLikeObject,
	isBoolean: () => isBoolean,
	isBuffer: () => isBuffer,
	isDate: () => isDate,
	isElement: () => isElement,
	isEmpty: () => isEmpty,
	isEqual: () => isEqual$1,
	isEqualWith: () => isEqualWith,
	isError: () => isError,
	isFinite: () => isFinite,
	isFunction: () => isFunction,
	isInteger: () => isInteger,
	isLength: () => isLength,
	isMap: () => isMap,
	isMatch: () => isMatch,
	isMatchWith: () => isMatchWith,
	isNaN: () => isNaN,
	isNative: () => isNative,
	isNil: () => isNil,
	isNull: () => isNull,
	isNumber: () => isNumber,
	isObject: () => isObject,
	isObjectLike: () => isObjectLike,
	isPlainObject: () => isPlainObject,
	isRegExp: () => isRegExp,
	isSafeInteger: () => isSafeInteger,
	isSet: () => isSet,
	isString: () => isString,
	isSymbol: () => isSymbol,
	isTypedArray: () => isTypedArray,
	isUndefined: () => isUndefined,
	isWeakMap: () => isWeakMap,
	isWeakSet: () => isWeakSet,
	iteratee: () => iteratee,
	join: () => join,
	kebabCase: () => kebabCase,
	keyBy: () => keyBy,
	keys: () => keys,
	keysIn: () => keysIn,
	last: () => last,
	lastIndexOf: () => lastIndexOf,
	lodash: () => lodash,
	lowerCase: () => lowerCase,
	lowerFirst: () => lowerFirst,
	lt: () => lt,
	lte: () => lte,
	map: () => map,
	mapKeys: () => mapKeys,
	mapValues: () => mapValues,
	matches: () => matches,
	matchesProperty: () => matchesProperty,
	max: () => max,
	maxBy: () => maxBy,
	mean: () => mean,
	meanBy: () => meanBy,
	memoize: () => memoize,
	merge: () => merge,
	mergeWith: () => mergeWith,
	method: () => method,
	methodOf: () => methodOf,
	min: () => min,
	minBy: () => minBy,
	mixin: () => mixin$1,
	multiply: () => multiply,
	negate: () => negate,
	next: () => wrapperNext,
	noop: () => noop,
	now: () => now,
	nth: () => nth,
	nthArg: () => nthArg,
	omit: () => omit,
	omitBy: () => omitBy,
	once: () => once,
	orderBy: () => orderBy,
	over: () => over,
	overArgs: () => overArgs,
	overEvery: () => overEvery,
	overSome: () => overSome,
	pad: () => pad,
	padEnd: () => padEnd,
	padStart: () => padStart,
	parseInt: () => parseInt$1,
	partial: () => partial,
	partialRight: () => partialRight,
	partition: () => partition,
	pick: () => pick,
	pickBy: () => pickBy,
	plant: () => wrapperPlant,
	property: () => property,
	propertyOf: () => propertyOf,
	pull: () => pull,
	pullAll: () => pullAll,
	pullAllBy: () => pullAllBy,
	pullAllWith: () => pullAllWith,
	pullAt: () => pullAt,
	random: () => random,
	range: () => range,
	rangeRight: () => rangeRight,
	rearg: () => rearg,
	reduce: () => reduce,
	reduceRight: () => reduceRight,
	reject: () => reject,
	remove: () => remove,
	repeat: () => repeat,
	replace: () => replace,
	rest: () => rest,
	result: () => result,
	reverse: () => reverse,
	round: () => round,
	sample: () => sample,
	sampleSize: () => sampleSize,
	set: () => set,
	setWith: () => setWith,
	shuffle: () => shuffle,
	size: () => size,
	slice: () => slice,
	snakeCase: () => snakeCase,
	some: () => some,
	sortBy: () => sortBy,
	sortedIndex: () => sortedIndex,
	sortedIndexBy: () => sortedIndexBy,
	sortedIndexOf: () => sortedIndexOf,
	sortedLastIndex: () => sortedLastIndex,
	sortedLastIndexBy: () => sortedLastIndexBy,
	sortedLastIndexOf: () => sortedLastIndexOf,
	sortedUniq: () => sortedUniq,
	sortedUniqBy: () => sortedUniqBy,
	split: () => split,
	spread: () => spread,
	startCase: () => startCase,
	startsWith: () => startsWith,
	stubArray: () => stubArray,
	stubFalse: () => stubFalse,
	stubObject: () => stubObject,
	stubString: () => stubString,
	stubTrue: () => stubTrue,
	subtract: () => subtract,
	sum: () => sum,
	sumBy: () => sumBy,
	tail: () => tail,
	take: () => take,
	takeRight: () => takeRight,
	takeRightWhile: () => takeRightWhile,
	takeWhile: () => takeWhile,
	tap: () => tap,
	template: () => template,
	templateSettings: () => templateSettings,
	throttle: () => throttle,
	thru: () => thru,
	times: () => times,
	toArray: () => toArray,
	toFinite: () => toFinite,
	toInteger: () => toInteger,
	toIterator: () => wrapperToIterator,
	toJSON: () => wrapperValue,
	toLength: () => toLength,
	toLower: () => toLower,
	toNumber: () => toNumber,
	toPairs: () => toPairs,
	toPairsIn: () => toPairsIn,
	toPath: () => toPath,
	toPlainObject: () => toPlainObject,
	toSafeInteger: () => toSafeInteger,
	toString: () => toString,
	toUpper: () => toUpper,
	transform: () => transform,
	trim: () => trim,
	trimEnd: () => trimEnd,
	trimStart: () => trimStart,
	truncate: () => truncate,
	unary: () => unary,
	unescape: () => unescape,
	union: () => union,
	unionBy: () => unionBy,
	unionWith: () => unionWith,
	uniq: () => uniq,
	uniqBy: () => uniqBy,
	uniqWith: () => uniqWith,
	uniqueId: () => uniqueId,
	unset: () => unset,
	unzip: () => unzip,
	unzipWith: () => unzipWith,
	update: () => update,
	updateWith: () => updateWith,
	upperCase: () => upperCase,
	upperFirst: () => upperFirst,
	value: () => wrapperValue,
	valueOf: () => wrapperValue,
	values: () => values,
	valuesIn: () => valuesIn,
	without: () => without,
	words: () => words,
	wrap: () => wrap,
	wrapperAt: () => wrapperAt,
	wrapperChain: () => wrapperChain,
	wrapperCommit: () => wrapperCommit,
	wrapperLodash: () => lodash,
	wrapperNext: () => wrapperNext,
	wrapperPlant: () => wrapperPlant,
	wrapperReverse: () => wrapperReverse,
	wrapperToIterator: () => wrapperToIterator,
	wrapperValue: () => wrapperValue,
	xor: () => xor,
	xorBy: () => xorBy,
	xorWith: () => xorWith,
	zip: () => zip,
	zipObject: () => zipObject,
	zipObjectDeep: () => zipObjectDeep,
	zipWith: () => zipWith
});
var init_lodash = __esmMin((() => {
	init_add();
	init_after();
	init_ary();
	init_assign();
	init_assignIn();
	init_assignInWith();
	init_assignWith();
	init_at();
	init_attempt();
	init_before();
	init_bind();
	init_bindAll();
	init_bindKey();
	init_camelCase();
	init_capitalize();
	init_castArray();
	init_ceil();
	init_chain();
	init_chunk();
	init_clamp();
	init_clone();
	init_cloneDeep();
	init_cloneDeepWith();
	init_cloneWith();
	init_commit();
	init_compact();
	init_concat();
	init_cond();
	init_conforms();
	init_conformsTo();
	init_constant();
	init_countBy();
	init_create();
	init_curry();
	init_curryRight();
	init_debounce();
	init_deburr();
	init_defaultTo();
	init_defaults();
	init_defaultsDeep();
	init_defer();
	init_delay();
	init_difference();
	init_differenceBy();
	init_differenceWith();
	init_divide();
	init_drop();
	init_dropRight();
	init_dropRightWhile();
	init_dropWhile();
	init_each();
	init_eachRight();
	init_endsWith();
	init_entries();
	init_entriesIn();
	init_eq();
	init_escape();
	init_escapeRegExp();
	init_every();
	init_extend();
	init_extendWith();
	init_fill();
	init_filter();
	init_find();
	init_findIndex();
	init_findKey();
	init_findLast();
	init_findLastIndex();
	init_findLastKey();
	init_first();
	init_flatMap();
	init_flatMapDeep();
	init_flatMapDepth();
	init_flatten();
	init_flattenDeep();
	init_flattenDepth();
	init_flip();
	init_floor();
	init_flow();
	init_flowRight();
	init_forEach();
	init_forEachRight();
	init_forIn();
	init_forInRight();
	init_forOwn();
	init_forOwnRight();
	init_fromPairs();
	init_functions();
	init_functionsIn();
	init_get();
	init_groupBy();
	init_gt();
	init_gte();
	init_has();
	init_hasIn();
	init_head();
	init_identity();
	init_inRange();
	init_includes();
	init_indexOf();
	init_initial();
	init_intersection();
	init_intersectionBy();
	init_intersectionWith();
	init_invert();
	init_invertBy();
	init_invoke();
	init_invokeMap();
	init_isArguments();
	init_isArray();
	init_isArrayBuffer();
	init_isArrayLike();
	init_isArrayLikeObject();
	init_isBoolean();
	init_isBuffer();
	init_isDate();
	init_isElement();
	init_isEmpty();
	init_isEqual();
	init_isEqualWith();
	init_isError();
	init_isFinite();
	init_isFunction();
	init_isInteger();
	init_isLength();
	init_isMap();
	init_isMatch();
	init_isMatchWith();
	init_isNaN();
	init_isNative();
	init_isNil();
	init_isNull();
	init_isNumber();
	init_isObject();
	init_isObjectLike();
	init_isPlainObject();
	init_isRegExp();
	init_isSafeInteger();
	init_isSet();
	init_isString();
	init_isSymbol();
	init_isTypedArray();
	init_isUndefined();
	init_isWeakMap();
	init_isWeakSet();
	init_iteratee();
	init_join();
	init_kebabCase();
	init_keyBy();
	init_keys();
	init_keysIn();
	init_last();
	init_lastIndexOf();
	init_wrapperLodash();
	init_lowerCase();
	init_lowerFirst();
	init_lt();
	init_lte();
	init_map();
	init_mapKeys();
	init_mapValues();
	init_matches();
	init_matchesProperty();
	init_max();
	init_maxBy();
	init_mean();
	init_meanBy();
	init_memoize();
	init_merge();
	init_mergeWith();
	init_method();
	init_methodOf();
	init_min();
	init_minBy();
	init_mixin();
	init_multiply();
	init_negate();
	init_next();
	init_noop();
	init_now();
	init_nth();
	init_nthArg();
	init_omit();
	init_omitBy();
	init_once();
	init_orderBy();
	init_over();
	init_overArgs();
	init_overEvery();
	init_overSome();
	init_pad();
	init_padEnd();
	init_padStart();
	init_parseInt();
	init_partial();
	init_partialRight();
	init_partition();
	init_pick();
	init_pickBy();
	init_plant();
	init_property();
	init_propertyOf();
	init_pull();
	init_pullAll();
	init_pullAllBy();
	init_pullAllWith();
	init_pullAt();
	init_random();
	init_range();
	init_rangeRight();
	init_rearg();
	init_reduce();
	init_reduceRight();
	init_reject();
	init_remove();
	init_repeat();
	init_replace();
	init_rest();
	init_result();
	init_reverse();
	init_round();
	init_sample();
	init_sampleSize();
	init_set();
	init_setWith();
	init_shuffle();
	init_size();
	init_slice();
	init_snakeCase();
	init_some();
	init_sortBy();
	init_sortedIndex();
	init_sortedIndexBy();
	init_sortedIndexOf();
	init_sortedLastIndex();
	init_sortedLastIndexBy();
	init_sortedLastIndexOf();
	init_sortedUniq();
	init_sortedUniqBy();
	init_split();
	init_spread();
	init_startCase();
	init_startsWith();
	init_stubArray();
	init_stubFalse();
	init_stubObject();
	init_stubString();
	init_stubTrue();
	init_subtract();
	init_sum();
	init_sumBy();
	init_tail();
	init_take();
	init_takeRight();
	init_takeRightWhile();
	init_takeWhile();
	init_tap();
	init_template();
	init_templateSettings();
	init_throttle();
	init_thru();
	init_times();
	init_toArray();
	init_toFinite();
	init_toInteger();
	init_toIterator();
	init_toJSON();
	init_toLength();
	init_toLower();
	init_toNumber();
	init_toPairs();
	init_toPairsIn();
	init_toPath();
	init_toPlainObject();
	init_toSafeInteger();
	init_toString();
	init_toUpper();
	init_transform();
	init_trim();
	init_trimEnd();
	init_trimStart();
	init_truncate();
	init_unary();
	init_unescape();
	init_union();
	init_unionBy();
	init_unionWith();
	init_uniq();
	init_uniqBy();
	init_uniqWith();
	init_uniqueId();
	init_unset();
	init_unzip();
	init_unzipWith();
	init_update();
	init_updateWith();
	init_upperCase();
	init_upperFirst();
	init_value();
	init_valueOf();
	init_values();
	init_valuesIn();
	init_without();
	init_words();
	init_wrap();
	init_wrapperAt();
	init_wrapperChain();
	init_wrapperReverse();
	init_wrapperValue();
	init_xor();
	init_xorBy();
	init_xorWith();
	init_zip();
	init_zipObject();
	init_zipObjectDeep();
	init_zipWith();
	init_lodash_default();
}));
//#endregion
//#region ../../node_modules/parchment/dist/parchment.js
var parchment_exports = /* @__PURE__ */ __exportAll({
	Attributor: () => Attributor,
	AttributorStore: () => AttributorStore$1,
	BlockBlot: () => BlockBlot$1,
	ClassAttributor: () => ClassAttributor$1,
	ContainerBlot: () => ContainerBlot$1,
	EmbedBlot: () => EmbedBlot$1,
	InlineBlot: () => InlineBlot$1,
	LeafBlot: () => LeafBlot$1,
	ParentBlot: () => ParentBlot$1,
	Registry: () => Registry,
	Scope: () => Scope,
	ScrollBlot: () => ScrollBlot$1,
	StyleAttributor: () => StyleAttributor$1,
	TextBlot: () => TextBlot$1
});
function match(node, prefix) {
	return (node.getAttribute("class") || "").split(/\s+/).filter((name) => name.indexOf(`${prefix}-`) === 0);
}
function camelize(name) {
	const parts = name.split("-"), rest = parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
	return parts[0] + rest;
}
function makeAttachedBlot(node, scroll) {
	const found = scroll.find(node);
	if (found) return found;
	try {
		return scroll.create(node);
	} catch {
		const blot = scroll.create(Scope.INLINE);
		return Array.from(node.childNodes).forEach((child) => {
			blot.domNode.appendChild(child);
		}), node.parentNode && node.parentNode.replaceChild(blot.domNode, node), blot.attach(), blot;
	}
}
function isEqual(obj1, obj2) {
	if (Object.keys(obj1).length !== Object.keys(obj2).length) return !1;
	for (const prop in obj1) if (obj1[prop] !== obj2[prop]) return !1;
	return !0;
}
var Scope, Attributor, ParchmentError, _Registry, Registry, ClassAttributor, ClassAttributor$1, StyleAttributor, StyleAttributor$1, AttributorStore, AttributorStore$1, _ShadowBlot, ShadowBlot, _LeafBlot, LeafBlot$1, LinkedList, _ParentBlot, ParentBlot$1, _InlineBlot, InlineBlot$1, _BlockBlot, BlockBlot$1, _ContainerBlot, ContainerBlot$1, EmbedBlot, EmbedBlot$1, OBSERVER_CONFIG, MAX_OPTIMIZE_ITERATIONS, _ScrollBlot, ScrollBlot$1, _TextBlot, TextBlot$1;
var init_parchment = __esmMin((() => {
	Scope = /* @__PURE__ */ ((Scope2) => (Scope2[Scope2.TYPE = 3] = "TYPE", Scope2[Scope2.LEVEL = 12] = "LEVEL", Scope2[Scope2.ATTRIBUTE = 13] = "ATTRIBUTE", Scope2[Scope2.BLOT = 14] = "BLOT", Scope2[Scope2.INLINE = 7] = "INLINE", Scope2[Scope2.BLOCK = 11] = "BLOCK", Scope2[Scope2.BLOCK_BLOT = 10] = "BLOCK_BLOT", Scope2[Scope2.INLINE_BLOT = 6] = "INLINE_BLOT", Scope2[Scope2.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", Scope2[Scope2.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", Scope2[Scope2.ANY = 15] = "ANY", Scope2))(Scope || {});
	Attributor = class {
		constructor(attrName, keyName, options = {}) {
			this.attrName = attrName, this.keyName = keyName;
			const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
			this.scope = options.scope != null ? options.scope & Scope.LEVEL | attributeBit : Scope.ATTRIBUTE, options.whitelist != null && (this.whitelist = options.whitelist);
		}
		static keys(node) {
			return Array.from(node.attributes).map((item) => item.name);
		}
		add(node, value) {
			return this.canAdd(node, value) ? (node.setAttribute(this.keyName, value), !0) : !1;
		}
		canAdd(_node, value) {
			return this.whitelist == null ? !0 : typeof value == "string" ? this.whitelist.indexOf(value.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(value) > -1;
		}
		remove(node) {
			node.removeAttribute(this.keyName);
		}
		value(node) {
			const value = node.getAttribute(this.keyName);
			return this.canAdd(node, value) && value ? value : "";
		}
	};
	ParchmentError = class extends Error {
		constructor(message) {
			message = "[Parchment] " + message, super(message), this.message = message, this.name = this.constructor.name;
		}
	};
	_Registry = class _Registry {
		constructor() {
			this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
		}
		static find(node, bubble = !1) {
			if (node == null) return null;
			if (this.blots.has(node)) return this.blots.get(node) || null;
			if (bubble) {
				let parentNode = null;
				try {
					parentNode = node.parentNode;
				} catch {
					return null;
				}
				return this.find(parentNode, bubble);
			}
			return null;
		}
		create(scroll, input, value) {
			const match2 = this.query(input);
			if (match2 == null) throw new ParchmentError(`Unable to create ${input} blot`);
			const blotClass = match2, blot = new blotClass(scroll, input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value), value);
			return _Registry.blots.set(blot.domNode, blot), blot;
		}
		find(node, bubble = !1) {
			return _Registry.find(node, bubble);
		}
		query(query, scope = Scope.ANY) {
			let match2;
			return typeof query == "string" ? match2 = this.types[query] || this.attributes[query] : query instanceof Text || query.nodeType === Node.TEXT_NODE ? match2 = this.types.text : typeof query == "number" ? query & Scope.LEVEL & Scope.BLOCK ? match2 = this.types.block : query & Scope.LEVEL & Scope.INLINE && (match2 = this.types.inline) : query instanceof Element && ((query.getAttribute("class") || "").split(/\s+/).some((name) => (match2 = this.classes[name], !!match2)), match2 = match2 || this.tags[query.tagName]), match2 == null ? null : "scope" in match2 && scope & Scope.LEVEL & match2.scope && scope & Scope.TYPE & match2.scope ? match2 : null;
		}
		register(...definitions) {
			return definitions.map((definition) => {
				const isBlot = "blotName" in definition, isAttr = "attrName" in definition;
				if (!isBlot && !isAttr) throw new ParchmentError("Invalid definition");
				if (isBlot && definition.blotName === "abstract") throw new ParchmentError("Cannot register abstract class");
				const key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
				return this.types[key] = definition, isAttr ? typeof definition.keyName == "string" && (this.attributes[definition.keyName] = definition) : isBlot && (definition.className && (this.classes[definition.className] = definition), definition.tagName && (Array.isArray(definition.tagName) ? definition.tagName = definition.tagName.map((tagName) => tagName.toUpperCase()) : definition.tagName = definition.tagName.toUpperCase(), (Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName]).forEach((tag) => {
					(this.tags[tag] == null || definition.className == null) && (this.tags[tag] = definition);
				}))), definition;
			});
		}
	};
	_Registry.blots = /* @__PURE__ */ new WeakMap();
	Registry = _Registry;
	ClassAttributor = class extends Attributor {
		static keys(node) {
			return (node.getAttribute("class") || "").split(/\s+/).map((name) => name.split("-").slice(0, -1).join("-"));
		}
		add(node, value) {
			return this.canAdd(node, value) ? (this.remove(node), node.classList.add(`${this.keyName}-${value}`), !0) : !1;
		}
		remove(node) {
			match(node, this.keyName).forEach((name) => {
				node.classList.remove(name);
			}), node.classList.length === 0 && node.removeAttribute("class");
		}
		value(node) {
			const value = (match(node, this.keyName)[0] || "").slice(this.keyName.length + 1);
			return this.canAdd(node, value) ? value : "";
		}
	};
	ClassAttributor$1 = ClassAttributor;
	StyleAttributor = class extends Attributor {
		static keys(node) {
			return (node.getAttribute("style") || "").split(";").map((value) => value.split(":")[0].trim());
		}
		add(node, value) {
			return this.canAdd(node, value) ? (node.style[camelize(this.keyName)] = value, !0) : !1;
		}
		remove(node) {
			node.style[camelize(this.keyName)] = "", node.getAttribute("style") || node.removeAttribute("style");
		}
		value(node) {
			const value = node.style[camelize(this.keyName)];
			return this.canAdd(node, value) ? value : "";
		}
	};
	StyleAttributor$1 = StyleAttributor;
	AttributorStore = class {
		constructor(domNode) {
			this.attributes = {}, this.domNode = domNode, this.build();
		}
		attribute(attribute, value) {
			value ? attribute.add(this.domNode, value) && (attribute.value(this.domNode) != null ? this.attributes[attribute.attrName] = attribute : delete this.attributes[attribute.attrName]) : (attribute.remove(this.domNode), delete this.attributes[attribute.attrName]);
		}
		build() {
			this.attributes = {};
			const blot = Registry.find(this.domNode);
			if (blot == null) return;
			const attributes = Attributor.keys(this.domNode), classes = ClassAttributor$1.keys(this.domNode), styles = StyleAttributor$1.keys(this.domNode);
			attributes.concat(classes).concat(styles).forEach((name) => {
				const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
				attr instanceof Attributor && (this.attributes[attr.attrName] = attr);
			});
		}
		copy(target) {
			Object.keys(this.attributes).forEach((key) => {
				const value = this.attributes[key].value(this.domNode);
				target.format(key, value);
			});
		}
		move(target) {
			this.copy(target), Object.keys(this.attributes).forEach((key) => {
				this.attributes[key].remove(this.domNode);
			}), this.attributes = {};
		}
		values() {
			return Object.keys(this.attributes).reduce((attributes, name) => (attributes[name] = this.attributes[name].value(this.domNode), attributes), {});
		}
	};
	AttributorStore$1 = AttributorStore, _ShadowBlot = class _ShadowBlot {
		constructor(scroll, domNode) {
			this.scroll = scroll, this.domNode = domNode, Registry.blots.set(domNode, this), this.prev = null, this.next = null;
		}
		static create(rawValue) {
			if (this.tagName == null) throw new ParchmentError("Blot definition missing tagName");
			let node, value;
			return Array.isArray(this.tagName) ? (typeof rawValue == "string" ? (value = rawValue.toUpperCase(), parseInt(value, 10).toString() === value && (value = parseInt(value, 10))) : typeof rawValue == "number" && (value = rawValue), typeof value == "number" ? node = document.createElement(this.tagName[value - 1]) : value && this.tagName.indexOf(value) > -1 ? node = document.createElement(value) : node = document.createElement(this.tagName[0])) : node = document.createElement(this.tagName), this.className && node.classList.add(this.className), node;
		}
		get statics() {
			return this.constructor;
		}
		attach() {}
		clone() {
			const domNode = this.domNode.cloneNode(!1);
			return this.scroll.create(domNode);
		}
		detach() {
			this.parent != null && this.parent.removeChild(this), Registry.blots.delete(this.domNode);
		}
		deleteAt(index, length) {
			this.isolate(index, length).remove();
		}
		formatAt(index, length, name, value) {
			const blot = this.isolate(index, length);
			if (this.scroll.query(name, Scope.BLOT) != null && value) blot.wrap(name, value);
			else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
				const parent = this.scroll.create(this.statics.scope);
				blot.wrap(parent), parent.format(name, value);
			}
		}
		insertAt(index, value, def) {
			const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def), ref = this.split(index);
			this.parent.insertBefore(blot, ref || void 0);
		}
		isolate(index, length) {
			const target = this.split(index);
			if (target == null) throw new Error("Attempt to isolate at end");
			return target.split(length), target;
		}
		length() {
			return 1;
		}
		offset(root = this.parent) {
			return this.parent == null || this === root ? 0 : this.parent.children.offset(this) + this.parent.offset(root);
		}
		optimize(_context) {
			this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
		}
		remove() {
			this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
		}
		replaceWith(name, value) {
			const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
			return this.parent != null && (this.parent.insertBefore(replacement, this.next || void 0), this.remove()), replacement;
		}
		split(index, _force) {
			return index === 0 ? this : this.next;
		}
		update(_mutations, _context) {}
		wrap(name, value) {
			const wrapper = typeof name == "string" ? this.scroll.create(name, value) : name;
			if (this.parent != null && this.parent.insertBefore(wrapper, this.next || void 0), typeof wrapper.appendChild != "function") throw new ParchmentError(`Cannot wrap ${name}`);
			return wrapper.appendChild(this), wrapper;
		}
	};
	_ShadowBlot.blotName = "abstract";
	ShadowBlot = _ShadowBlot;
	_LeafBlot = class _LeafBlot extends ShadowBlot {
		/**
		* Returns the value represented by domNode if it is this Blot's type
		* No checking that domNode can represent this Blot type is required so
		* applications needing it should check externally before calling.
		*/
		static value(_domNode) {
			return !0;
		}
		/**
		* Given location represented by node and offset from DOM Selection Range,
		* return index to that location.
		*/
		index(node, offset) {
			return this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(offset, 1) : -1;
		}
		/**
		* Given index to location within blot, return node and offset representing
		* that location, consumable by DOM Selection Range
		*/
		position(index, _inclusive) {
			let offset = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
			return index > 0 && (offset += 1), [this.parent.domNode, offset];
		}
		/**
		* Return value represented by this blot
		* Should not change without interaction from API or
		* user change detectable by update()
		*/
		value() {
			return { [this.statics.blotName]: this.statics.value(this.domNode) || !0 };
		}
	};
	_LeafBlot.scope = Scope.INLINE_BLOT;
	LeafBlot$1 = _LeafBlot;
	LinkedList = class {
		constructor() {
			this.head = null, this.tail = null, this.length = 0;
		}
		append(...nodes) {
			if (this.insertBefore(nodes[0], null), nodes.length > 1) {
				const rest = nodes.slice(1);
				this.append(...rest);
			}
		}
		at(index) {
			const next = this.iterator();
			let cur = next();
			for (; cur && index > 0;) index -= 1, cur = next();
			return cur;
		}
		contains(node) {
			const next = this.iterator();
			let cur = next();
			for (; cur;) {
				if (cur === node) return !0;
				cur = next();
			}
			return !1;
		}
		indexOf(node) {
			const next = this.iterator();
			let cur = next(), index = 0;
			for (; cur;) {
				if (cur === node) return index;
				index += 1, cur = next();
			}
			return -1;
		}
		insertBefore(node, refNode) {
			node != null && (this.remove(node), node.next = refNode, refNode != null ? (node.prev = refNode.prev, refNode.prev != null && (refNode.prev.next = node), refNode.prev = node, refNode === this.head && (this.head = node)) : this.tail != null ? (this.tail.next = node, node.prev = this.tail, this.tail = node) : (node.prev = null, this.head = this.tail = node), this.length += 1);
		}
		offset(target) {
			let index = 0, cur = this.head;
			for (; cur != null;) {
				if (cur === target) return index;
				index += cur.length(), cur = cur.next;
			}
			return -1;
		}
		remove(node) {
			this.contains(node) && (node.prev != null && (node.prev.next = node.next), node.next != null && (node.next.prev = node.prev), node === this.head && (this.head = node.next), node === this.tail && (this.tail = node.prev), this.length -= 1);
		}
		iterator(curNode = this.head) {
			return () => {
				const ret = curNode;
				return curNode != null && (curNode = curNode.next), ret;
			};
		}
		find(index, inclusive = !1) {
			const next = this.iterator();
			let cur = next();
			for (; cur;) {
				const length = cur.length();
				if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) return [cur, index];
				index -= length, cur = next();
			}
			return [null, 0];
		}
		forEach(callback) {
			const next = this.iterator();
			let cur = next();
			for (; cur;) callback(cur), cur = next();
		}
		forEachAt(index, length, callback) {
			if (length <= 0) return;
			const [startNode, offset] = this.find(index);
			let curIndex = index - offset;
			const next = this.iterator(startNode);
			let cur = next();
			for (; cur && curIndex < index + length;) {
				const curLength = cur.length();
				index > curIndex ? callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index)) : callback(cur, 0, Math.min(curLength, index + length - curIndex)), curIndex += curLength, cur = next();
			}
		}
		map(callback) {
			return this.reduce((memo, cur) => (memo.push(callback(cur)), memo), []);
		}
		reduce(callback, memo) {
			const next = this.iterator();
			let cur = next();
			for (; cur;) memo = callback(memo, cur), cur = next();
			return memo;
		}
	};
	_ParentBlot = class _ParentBlot extends ShadowBlot {
		constructor(scroll, domNode) {
			super(scroll, domNode), this.uiNode = null, this.build();
		}
		appendChild(other) {
			this.insertBefore(other);
		}
		attach() {
			super.attach(), this.children.forEach((child) => {
				child.attach();
			});
		}
		attachUI(node) {
			this.uiNode != null && this.uiNode.remove(), this.uiNode = node, _ParentBlot.uiClass && this.uiNode.classList.add(_ParentBlot.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
		}
		/**
		* Called during construction, should fill its own children LinkedList.
		*/
		build() {
			this.children = new LinkedList(), Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).reverse().forEach((node) => {
				try {
					const child = makeAttachedBlot(node, this.scroll);
					this.insertBefore(child, this.children.head || void 0);
				} catch (err) {
					if (err instanceof ParchmentError) return;
					throw err;
				}
			});
		}
		deleteAt(index, length) {
			if (index === 0 && length === this.length()) return this.remove();
			this.children.forEachAt(index, length, (child, offset, childLength) => {
				child.deleteAt(offset, childLength);
			});
		}
		descendant(criteria, index = 0) {
			const [child, offset] = this.children.find(index);
			return criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria ? [child, offset] : child instanceof _ParentBlot ? child.descendant(criteria, offset) : [null, -1];
		}
		descendants(criteria, index = 0, length = Number.MAX_VALUE) {
			let descendants = [], lengthLeft = length;
			return this.children.forEachAt(index, length, (child, childIndex, childLength) => {
				(criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) && descendants.push(child), child instanceof _ParentBlot && (descendants = descendants.concat(child.descendants(criteria, childIndex, lengthLeft))), lengthLeft -= childLength;
			}), descendants;
		}
		detach() {
			this.children.forEach((child) => {
				child.detach();
			}), super.detach();
		}
		enforceAllowedChildren() {
			let done = !1;
			this.children.forEach((child) => {
				done || this.statics.allowedChildren.some((def) => child instanceof def) || (child.statics.scope === Scope.BLOCK_BLOT ? (child.next != null && this.splitAfter(child), child.prev != null && this.splitAfter(child.prev), child.parent.unwrap(), done = !0) : child instanceof _ParentBlot ? child.unwrap() : child.remove());
			});
		}
		formatAt(index, length, name, value) {
			this.children.forEachAt(index, length, (child, offset, childLength) => {
				child.formatAt(offset, childLength, name, value);
			});
		}
		insertAt(index, value, def) {
			const [child, offset] = this.children.find(index);
			if (child) child.insertAt(offset, value, def);
			else {
				const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
				this.appendChild(blot);
			}
		}
		insertBefore(childBlot, refBlot) {
			childBlot.parent != null && childBlot.parent.children.remove(childBlot);
			let refDomNode = null;
			this.children.insertBefore(childBlot, refBlot || null), childBlot.parent = this, refBlot != null && (refDomNode = refBlot.domNode), (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) && this.domNode.insertBefore(childBlot.domNode, refDomNode), childBlot.attach();
		}
		length() {
			return this.children.reduce((memo, child) => memo + child.length(), 0);
		}
		moveChildren(targetParent, refNode) {
			this.children.forEach((child) => {
				targetParent.insertBefore(child, refNode);
			});
		}
		optimize(context) {
			if (super.optimize(context), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0) if (this.statics.defaultChild != null) {
				const child = this.scroll.create(this.statics.defaultChild.blotName);
				this.appendChild(child);
			} else this.remove();
		}
		path(index, inclusive = !1) {
			const [child, offset] = this.children.find(index, inclusive), position = [[this, index]];
			return child instanceof _ParentBlot ? position.concat(child.path(offset, inclusive)) : (child != null && position.push([child, offset]), position);
		}
		removeChild(child) {
			this.children.remove(child);
		}
		replaceWith(name, value) {
			const replacement = typeof name == "string" ? this.scroll.create(name, value) : name;
			return replacement instanceof _ParentBlot && this.moveChildren(replacement), super.replaceWith(replacement);
		}
		split(index, force = !1) {
			if (!force) {
				if (index === 0) return this;
				if (index === this.length()) return this.next;
			}
			const after = this.clone();
			return this.parent && this.parent.insertBefore(after, this.next || void 0), this.children.forEachAt(index, this.length(), (child, offset, _length) => {
				const split = child.split(offset, force);
				split != null && after.appendChild(split);
			}), after;
		}
		splitAfter(child) {
			const after = this.clone();
			for (; child.next != null;) after.appendChild(child.next);
			return this.parent && this.parent.insertBefore(after, this.next || void 0), after;
		}
		unwrap() {
			this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
		}
		update(mutations, _context) {
			const addedNodes = [], removedNodes = [];
			mutations.forEach((mutation) => {
				mutation.target === this.domNode && mutation.type === "childList" && (addedNodes.push(...mutation.addedNodes), removedNodes.push(...mutation.removedNodes));
			}), removedNodes.forEach((node) => {
				if (node.parentNode != null && node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) return;
				const blot = this.scroll.find(node);
				blot != null && (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) && blot.detach();
			}), addedNodes.filter((node) => node.parentNode === this.domNode && node !== this.uiNode).sort((a, b) => a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((node) => {
				let refBlot = null;
				node.nextSibling != null && (refBlot = this.scroll.find(node.nextSibling));
				const blot = makeAttachedBlot(node, this.scroll);
				(blot.next !== refBlot || blot.next == null) && (blot.parent != null && blot.parent.removeChild(this), this.insertBefore(blot, refBlot || void 0));
			}), this.enforceAllowedChildren();
		}
	};
	_ParentBlot.uiClass = "";
	ParentBlot$1 = _ParentBlot;
	_InlineBlot = class _InlineBlot extends ParentBlot$1 {
		static create(value) {
			return super.create(value);
		}
		static formats(domNode, scroll) {
			const match2 = scroll.query(_InlineBlot.blotName);
			if (!(match2 != null && domNode.tagName === match2.tagName)) {
				if (typeof this.tagName == "string") return !0;
				if (Array.isArray(this.tagName)) return domNode.tagName.toLowerCase();
			}
		}
		constructor(scroll, domNode) {
			super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
		}
		format(name, value) {
			if (name === this.statics.blotName && !value) this.children.forEach((child) => {
				child instanceof _InlineBlot || (child = child.wrap(_InlineBlot.blotName, !0)), this.attributes.copy(child);
			}), this.unwrap();
			else {
				const format = this.scroll.query(name, Scope.INLINE);
				if (format == null) return;
				format instanceof Attributor ? this.attributes.attribute(format, value) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value);
			}
		}
		formats() {
			const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
			return format != null && (formats[this.statics.blotName] = format), formats;
		}
		formatAt(index, length, name, value) {
			this.formats()[name] != null || this.scroll.query(name, Scope.ATTRIBUTE) ? this.isolate(index, length).format(name, value) : super.formatAt(index, length, name, value);
		}
		optimize(context) {
			super.optimize(context);
			const formats = this.formats();
			if (Object.keys(formats).length === 0) return this.unwrap();
			const next = this.next;
			next instanceof _InlineBlot && next.prev === this && isEqual(formats, next.formats()) && (next.moveChildren(this), next.remove());
		}
		replaceWith(name, value) {
			const replacement = super.replaceWith(name, value);
			return this.attributes.copy(replacement), replacement;
		}
		update(mutations, context) {
			super.update(mutations, context), mutations.some((mutation) => mutation.target === this.domNode && mutation.type === "attributes") && this.attributes.build();
		}
		wrap(name, value) {
			const wrapper = super.wrap(name, value);
			return wrapper instanceof _InlineBlot && this.attributes.move(wrapper), wrapper;
		}
	};
	_InlineBlot.allowedChildren = [_InlineBlot, LeafBlot$1], _InlineBlot.blotName = "inline", _InlineBlot.scope = Scope.INLINE_BLOT, _InlineBlot.tagName = "SPAN";
	InlineBlot$1 = _InlineBlot, _BlockBlot = class _BlockBlot extends ParentBlot$1 {
		static create(value) {
			return super.create(value);
		}
		static formats(domNode, scroll) {
			const match2 = scroll.query(_BlockBlot.blotName);
			if (!(match2 != null && domNode.tagName === match2.tagName)) {
				if (typeof this.tagName == "string") return !0;
				if (Array.isArray(this.tagName)) return domNode.tagName.toLowerCase();
			}
		}
		constructor(scroll, domNode) {
			super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
		}
		format(name, value) {
			const format = this.scroll.query(name, Scope.BLOCK);
			format != null && (format instanceof Attributor ? this.attributes.attribute(format, value) : name === this.statics.blotName && !value ? this.replaceWith(_BlockBlot.blotName) : value && (name !== this.statics.blotName || this.formats()[name] !== value) && this.replaceWith(name, value));
		}
		formats() {
			const formats = this.attributes.values(), format = this.statics.formats(this.domNode, this.scroll);
			return format != null && (formats[this.statics.blotName] = format), formats;
		}
		formatAt(index, length, name, value) {
			this.scroll.query(name, Scope.BLOCK) != null ? this.format(name, value) : super.formatAt(index, length, name, value);
		}
		insertAt(index, value, def) {
			if (def == null || this.scroll.query(value, Scope.INLINE) != null) super.insertAt(index, value, def);
			else {
				const after = this.split(index);
				if (after != null) {
					const blot = this.scroll.create(value, def);
					after.parent.insertBefore(blot, after);
				} else throw new Error("Attempt to insertAt after block boundaries");
			}
		}
		replaceWith(name, value) {
			const replacement = super.replaceWith(name, value);
			return this.attributes.copy(replacement), replacement;
		}
		update(mutations, context) {
			super.update(mutations, context), mutations.some((mutation) => mutation.target === this.domNode && mutation.type === "attributes") && this.attributes.build();
		}
	};
	_BlockBlot.blotName = "block", _BlockBlot.scope = Scope.BLOCK_BLOT, _BlockBlot.tagName = "P", _BlockBlot.allowedChildren = [
		InlineBlot$1,
		_BlockBlot,
		LeafBlot$1
	];
	BlockBlot$1 = _BlockBlot, _ContainerBlot = class _ContainerBlot extends ParentBlot$1 {
		checkMerge() {
			return this.next !== null && this.next.statics.blotName === this.statics.blotName;
		}
		deleteAt(index, length) {
			super.deleteAt(index, length), this.enforceAllowedChildren();
		}
		formatAt(index, length, name, value) {
			super.formatAt(index, length, name, value), this.enforceAllowedChildren();
		}
		insertAt(index, value, def) {
			super.insertAt(index, value, def), this.enforceAllowedChildren();
		}
		optimize(context) {
			super.optimize(context), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
		}
	};
	_ContainerBlot.blotName = "container", _ContainerBlot.scope = Scope.BLOCK_BLOT;
	ContainerBlot$1 = _ContainerBlot;
	EmbedBlot = class extends LeafBlot$1 {
		static formats(_domNode, _scroll) {}
		format(name, value) {
			super.formatAt(0, this.length(), name, value);
		}
		formatAt(index, length, name, value) {
			index === 0 && length === this.length() ? this.format(name, value) : super.formatAt(index, length, name, value);
		}
		formats() {
			return this.statics.formats(this.domNode, this.scroll);
		}
	};
	EmbedBlot$1 = EmbedBlot, OBSERVER_CONFIG = {
		attributes: !0,
		characterData: !0,
		characterDataOldValue: !0,
		childList: !0,
		subtree: !0
	}, MAX_OPTIMIZE_ITERATIONS = 100, _ScrollBlot = class _ScrollBlot extends ParentBlot$1 {
		constructor(registry, node) {
			super(null, node), this.registry = registry, this.scroll = this, this.build(), this.observer = new MutationObserver((mutations) => {
				this.update(mutations);
			}), this.observer.observe(this.domNode, OBSERVER_CONFIG), this.attach();
		}
		create(input, value) {
			return this.registry.create(this, input, value);
		}
		find(node, bubble = !1) {
			const blot = this.registry.find(node, bubble);
			return blot ? blot.scroll === this ? blot : bubble ? this.find(blot.scroll.domNode.parentNode, !0) : null : null;
		}
		query(query, scope = Scope.ANY) {
			return this.registry.query(query, scope);
		}
		register(...definitions) {
			return this.registry.register(...definitions);
		}
		build() {
			this.scroll != null && super.build();
		}
		detach() {
			super.detach(), this.observer.disconnect();
		}
		deleteAt(index, length) {
			this.update(), index === 0 && length === this.length() ? this.children.forEach((child) => {
				child.remove();
			}) : super.deleteAt(index, length);
		}
		formatAt(index, length, name, value) {
			this.update(), super.formatAt(index, length, name, value);
		}
		insertAt(index, value, def) {
			this.update(), super.insertAt(index, value, def);
		}
		optimize(mutations = [], context = {}) {
			super.optimize(context);
			const mutationsMap = context.mutationsMap || /* @__PURE__ */ new WeakMap();
			let records = Array.from(this.observer.takeRecords());
			for (; records.length > 0;) mutations.push(records.pop());
			const mark = (blot, markParent = !0) => {
				blot == null || blot === this || blot.domNode.parentNode != null && (mutationsMap.has(blot.domNode) || mutationsMap.set(blot.domNode, []), markParent && mark(blot.parent));
			}, optimize = (blot) => {
				mutationsMap.has(blot.domNode) && (blot instanceof ParentBlot$1 && blot.children.forEach(optimize), mutationsMap.delete(blot.domNode), blot.optimize(context));
			};
			let remaining = mutations;
			for (let i = 0; remaining.length > 0; i += 1) {
				if (i >= MAX_OPTIMIZE_ITERATIONS) throw new Error("[Parchment] Maximum optimize iterations reached");
				for (remaining.forEach((mutation) => {
					const blot = this.find(mutation.target, !0);
					blot != null && (blot.domNode === mutation.target && (mutation.type === "childList" ? (mark(this.find(mutation.previousSibling, !1)), Array.from(mutation.addedNodes).forEach((node) => {
						const child = this.find(node, !1);
						mark(child, !1), child instanceof ParentBlot$1 && child.children.forEach((grandChild) => {
							mark(grandChild, !1);
						});
					})) : mutation.type === "attributes" && mark(blot.prev)), mark(blot));
				}), this.children.forEach(optimize), remaining = Array.from(this.observer.takeRecords()), records = remaining.slice(); records.length > 0;) mutations.push(records.pop());
			}
		}
		update(mutations, context = {}) {
			mutations = mutations || this.observer.takeRecords();
			const mutationsMap = /* @__PURE__ */ new WeakMap();
			mutations.map((mutation) => {
				const blot = this.find(mutation.target, !0);
				return blot == null ? null : mutationsMap.has(blot.domNode) ? (mutationsMap.get(blot.domNode).push(mutation), null) : (mutationsMap.set(blot.domNode, [mutation]), blot);
			}).forEach((blot) => {
				blot != null && blot !== this && mutationsMap.has(blot.domNode) && blot.update(mutationsMap.get(blot.domNode) || [], context);
			}), context.mutationsMap = mutationsMap, mutationsMap.has(this.domNode) && super.update(mutationsMap.get(this.domNode), context), this.optimize(mutations, context);
		}
	};
	_ScrollBlot.blotName = "scroll", _ScrollBlot.defaultChild = BlockBlot$1, _ScrollBlot.allowedChildren = [BlockBlot$1, ContainerBlot$1], _ScrollBlot.scope = Scope.BLOCK_BLOT, _ScrollBlot.tagName = "DIV";
	ScrollBlot$1 = _ScrollBlot, _TextBlot = class _TextBlot extends LeafBlot$1 {
		static create(value) {
			return document.createTextNode(value);
		}
		static value(domNode) {
			return domNode.data;
		}
		constructor(scroll, node) {
			super(scroll, node), this.text = this.statics.value(this.domNode);
		}
		deleteAt(index, length) {
			this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
		}
		index(node, offset) {
			return this.domNode === node ? offset : -1;
		}
		insertAt(index, value, def) {
			def == null ? (this.text = this.text.slice(0, index) + value + this.text.slice(index), this.domNode.data = this.text) : super.insertAt(index, value, def);
		}
		length() {
			return this.text.length;
		}
		optimize(context) {
			super.optimize(context), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof _TextBlot && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
		}
		position(index, _inclusive = !1) {
			return [this.domNode, index];
		}
		split(index, force = !1) {
			if (!force) {
				if (index === 0) return this;
				if (index === this.length()) return this.next;
			}
			const after = this.scroll.create(this.domNode.splitText(index));
			return this.parent.insertBefore(after, this.next || void 0), this.text = this.statics.value(this.domNode), after;
		}
		update(mutations, _context) {
			mutations.some((mutation) => mutation.type === "characterData" && mutation.target === this.domNode) && (this.text = this.statics.value(this.domNode));
		}
		value() {
			return this.text;
		}
	};
	_TextBlot.blotName = "text", _TextBlot.scope = Scope.INLINE_BLOT;
	TextBlot$1 = _TextBlot;
}));
//#endregion
//#region ../../node_modules/fast-diff/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This library modifies the diff-patch-match library by Neil Fraser
	* by removing the patch and match functionality and certain advanced
	* options in the diff function. The original license is as follows:
	*
	* ===
	*
	* Diff Match and Patch
	*
	* Copyright 2006 Google Inc.
	* http://code.google.com/p/google-diff-match-patch/
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*   http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	/**
	* The data structure representing a diff is an array of tuples:
	* [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	* which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	*/
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;
	/**
	* Find the differences between two texts.  Simplifies the problem by stripping
	* any common prefix or suffix off the texts before diffing.
	* @param {string} text1 Old string to be diffed.
	* @param {string} text2 New string to be diffed.
	* @param {Int|Object} [cursor_pos] Edit position in text1 or object with more info
	* @param {boolean} [cleanup] Apply semantic cleanup before returning.
	* @return {Array} Array of diff tuples.
	*/
	function diff_main(text1, text2, cursor_pos, cleanup, _fix_unicode) {
		if (text1 === text2) {
			if (text1) return [[DIFF_EQUAL, text1]];
			return [];
		}
		if (cursor_pos != null) {
			var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
			if (editdiff) return editdiff;
		}
		var commonlength = diff_commonPrefix(text1, text2);
		var commonprefix = text1.substring(0, commonlength);
		text1 = text1.substring(commonlength);
		text2 = text2.substring(commonlength);
		commonlength = diff_commonSuffix(text1, text2);
		var commonsuffix = text1.substring(text1.length - commonlength);
		text1 = text1.substring(0, text1.length - commonlength);
		text2 = text2.substring(0, text2.length - commonlength);
		var diffs = diff_compute_(text1, text2);
		if (commonprefix) diffs.unshift([DIFF_EQUAL, commonprefix]);
		if (commonsuffix) diffs.push([DIFF_EQUAL, commonsuffix]);
		diff_cleanupMerge(diffs, _fix_unicode);
		if (cleanup) diff_cleanupSemantic(diffs);
		return diffs;
	}
	/**
	* Find the differences between two texts.  Assumes that the texts do not
	* have any common prefix or suffix.
	* @param {string} text1 Old string to be diffed.
	* @param {string} text2 New string to be diffed.
	* @return {Array} Array of diff tuples.
	*/
	function diff_compute_(text1, text2) {
		var diffs;
		if (!text1) return [[DIFF_INSERT, text2]];
		if (!text2) return [[DIFF_DELETE, text1]];
		var longtext = text1.length > text2.length ? text1 : text2;
		var shorttext = text1.length > text2.length ? text2 : text1;
		var i = longtext.indexOf(shorttext);
		if (i !== -1) {
			diffs = [
				[DIFF_INSERT, longtext.substring(0, i)],
				[DIFF_EQUAL, shorttext],
				[DIFF_INSERT, longtext.substring(i + shorttext.length)]
			];
			if (text1.length > text2.length) diffs[0][0] = diffs[2][0] = DIFF_DELETE;
			return diffs;
		}
		if (shorttext.length === 1) return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
		var hm = diff_halfMatch_(text1, text2);
		if (hm) {
			var text1_a = hm[0];
			var text1_b = hm[1];
			var text2_a = hm[2];
			var text2_b = hm[3];
			var mid_common = hm[4];
			var diffs_a = diff_main(text1_a, text2_a);
			var diffs_b = diff_main(text1_b, text2_b);
			return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
		}
		return diff_bisect_(text1, text2);
	}
	/**
	* Find the 'middle snake' of a diff, split the problem in two
	* and return the recursively constructed diff.
	* See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	* @param {string} text1 Old string to be diffed.
	* @param {string} text2 New string to be diffed.
	* @return {Array} Array of diff tuples.
	* @private
	*/
	function diff_bisect_(text1, text2) {
		var text1_length = text1.length;
		var text2_length = text2.length;
		var max_d = Math.ceil((text1_length + text2_length) / 2);
		var v_offset = max_d;
		var v_length = 2 * max_d;
		var v1 = new Array(v_length);
		var v2 = new Array(v_length);
		for (var x = 0; x < v_length; x++) {
			v1[x] = -1;
			v2[x] = -1;
		}
		v1[v_offset + 1] = 0;
		v2[v_offset + 1] = 0;
		var delta = text1_length - text2_length;
		var front = delta % 2 !== 0;
		var k1start = 0;
		var k1end = 0;
		var k2start = 0;
		var k2end = 0;
		for (var d = 0; d < max_d; d++) {
			for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
				var k1_offset = v_offset + k1;
				var x1;
				if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) x1 = v1[k1_offset + 1];
				else x1 = v1[k1_offset - 1] + 1;
				var y1 = x1 - k1;
				while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
					x1++;
					y1++;
				}
				v1[k1_offset] = x1;
				if (x1 > text1_length) k1end += 2;
				else if (y1 > text2_length) k1start += 2;
				else if (front) {
					var k2_offset = v_offset + delta - k1;
					if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
						var x2 = text1_length - v2[k2_offset];
						if (x1 >= x2) return diff_bisectSplit_(text1, text2, x1, y1);
					}
				}
			}
			for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
				var k2_offset = v_offset + k2;
				var x2;
				if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) x2 = v2[k2_offset + 1];
				else x2 = v2[k2_offset - 1] + 1;
				var y2 = x2 - k2;
				while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
					x2++;
					y2++;
				}
				v2[k2_offset] = x2;
				if (x2 > text1_length) k2end += 2;
				else if (y2 > text2_length) k2start += 2;
				else if (!front) {
					var k1_offset = v_offset + delta - k2;
					if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
						var x1 = v1[k1_offset];
						var y1 = v_offset + x1 - k1_offset;
						x2 = text1_length - x2;
						if (x1 >= x2) return diff_bisectSplit_(text1, text2, x1, y1);
					}
				}
			}
		}
		return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	}
	/**
	* Given the location of the 'middle snake', split the diff in two parts
	* and recurse.
	* @param {string} text1 Old string to be diffed.
	* @param {string} text2 New string to be diffed.
	* @param {number} x Index of split point in text1.
	* @param {number} y Index of split point in text2.
	* @return {Array} Array of diff tuples.
	*/
	function diff_bisectSplit_(text1, text2, x, y) {
		var text1a = text1.substring(0, x);
		var text2a = text2.substring(0, y);
		var text1b = text1.substring(x);
		var text2b = text2.substring(y);
		var diffs = diff_main(text1a, text2a);
		var diffsb = diff_main(text1b, text2b);
		return diffs.concat(diffsb);
	}
	/**
	* Determine the common prefix of two strings.
	* @param {string} text1 First string.
	* @param {string} text2 Second string.
	* @return {number} The number of characters common to the start of each
	*     string.
	*/
	function diff_commonPrefix(text1, text2) {
		if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) return 0;
		var pointermin = 0;
		var pointermax = Math.min(text1.length, text2.length);
		var pointermid = pointermax;
		var pointerstart = 0;
		while (pointermin < pointermid) {
			if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
				pointermin = pointermid;
				pointerstart = pointermin;
			} else pointermax = pointermid;
			pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
		}
		if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) pointermid--;
		return pointermid;
	}
	/**
	* Determine if the suffix of one string is the prefix of another.
	* @param {string} text1 First string.
	* @param {string} text2 Second string.
	* @return {number} The number of characters common to the end of the first
	*     string and the start of the second string.
	* @private
	*/
	function diff_commonOverlap_(text1, text2) {
		var text1_length = text1.length;
		var text2_length = text2.length;
		if (text1_length == 0 || text2_length == 0) return 0;
		if (text1_length > text2_length) text1 = text1.substring(text1_length - text2_length);
		else if (text1_length < text2_length) text2 = text2.substring(0, text1_length);
		var text_length = Math.min(text1_length, text2_length);
		if (text1 == text2) return text_length;
		var best = 0;
		var length = 1;
		while (true) {
			var pattern = text1.substring(text_length - length);
			var found = text2.indexOf(pattern);
			if (found == -1) return best;
			length += found;
			if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
				best = length;
				length++;
			}
		}
	}
	/**
	* Determine the common suffix of two strings.
	* @param {string} text1 First string.
	* @param {string} text2 Second string.
	* @return {number} The number of characters common to the end of each string.
	*/
	function diff_commonSuffix(text1, text2) {
		if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) return 0;
		var pointermin = 0;
		var pointermax = Math.min(text1.length, text2.length);
		var pointermid = pointermax;
		var pointerend = 0;
		while (pointermin < pointermid) {
			if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
				pointermin = pointermid;
				pointerend = pointermin;
			} else pointermax = pointermid;
			pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
		}
		if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) pointermid--;
		return pointermid;
	}
	/**
	* Do the two texts share a substring which is at least half the length of the
	* longer text?
	* This speedup can produce non-minimal diffs.
	* @param {string} text1 First string.
	* @param {string} text2 Second string.
	* @return {Array.<string>} Five element Array, containing the prefix of
	*     text1, the suffix of text1, the prefix of text2, the suffix of
	*     text2 and the common middle.  Or null if there was no match.
	*/
	function diff_halfMatch_(text1, text2) {
		var longtext = text1.length > text2.length ? text1 : text2;
		var shorttext = text1.length > text2.length ? text2 : text1;
		if (longtext.length < 4 || shorttext.length * 2 < longtext.length) return null;
		/**
		* Does a substring of shorttext exist within longtext such that the substring
		* is at least half the length of longtext?
		* Closure, but does not reference any external variables.
		* @param {string} longtext Longer string.
		* @param {string} shorttext Shorter string.
		* @param {number} i Start index of quarter length substring within longtext.
		* @return {Array.<string>} Five element Array, containing the prefix of
		*     longtext, the suffix of longtext, the prefix of shorttext, the suffix
		*     of shorttext and the common middle.  Or null if there was no match.
		* @private
		*/
		function diff_halfMatchI_(longtext, shorttext, i) {
			var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
			var j = -1;
			var best_common = "";
			var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
			while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
				var prefixLength = diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
				var suffixLength = diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
				if (best_common.length < suffixLength + prefixLength) {
					best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
					best_longtext_a = longtext.substring(0, i - suffixLength);
					best_longtext_b = longtext.substring(i + prefixLength);
					best_shorttext_a = shorttext.substring(0, j - suffixLength);
					best_shorttext_b = shorttext.substring(j + prefixLength);
				}
			}
			if (best_common.length * 2 >= longtext.length) return [
				best_longtext_a,
				best_longtext_b,
				best_shorttext_a,
				best_shorttext_b,
				best_common
			];
			else return null;
		}
		var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
		var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
		var hm;
		if (!hm1 && !hm2) return null;
		else if (!hm2) hm = hm1;
		else if (!hm1) hm = hm2;
		else hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
		var text1_a, text1_b, text2_a, text2_b;
		if (text1.length > text2.length) {
			text1_a = hm[0];
			text1_b = hm[1];
			text2_a = hm[2];
			text2_b = hm[3];
		} else {
			text2_a = hm[0];
			text2_b = hm[1];
			text1_a = hm[2];
			text1_b = hm[3];
		}
		var mid_common = hm[4];
		return [
			text1_a,
			text1_b,
			text2_a,
			text2_b,
			mid_common
		];
	}
	/**
	* Reduce the number of edits by eliminating semantically trivial equalities.
	* @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	*/
	function diff_cleanupSemantic(diffs) {
		var changes = false;
		var equalities = [];
		var equalitiesLength = 0;
		/** @type {?string} */
		var lastequality = null;
		var pointer = 0;
		var length_insertions1 = 0;
		var length_deletions1 = 0;
		var length_insertions2 = 0;
		var length_deletions2 = 0;
		while (pointer < diffs.length) {
			if (diffs[pointer][0] == DIFF_EQUAL) {
				equalities[equalitiesLength++] = pointer;
				length_insertions1 = length_insertions2;
				length_deletions1 = length_deletions2;
				length_insertions2 = 0;
				length_deletions2 = 0;
				lastequality = diffs[pointer][1];
			} else {
				if (diffs[pointer][0] == DIFF_INSERT) length_insertions2 += diffs[pointer][1].length;
				else length_deletions2 += diffs[pointer][1].length;
				if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
					diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
					diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
					equalitiesLength--;
					equalitiesLength--;
					pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
					length_insertions1 = 0;
					length_deletions1 = 0;
					length_insertions2 = 0;
					length_deletions2 = 0;
					lastequality = null;
					changes = true;
				}
			}
			pointer++;
		}
		if (changes) diff_cleanupMerge(diffs);
		diff_cleanupSemanticLossless(diffs);
		pointer = 1;
		while (pointer < diffs.length) {
			if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
				var deletion = diffs[pointer - 1][1];
				var insertion = diffs[pointer][1];
				var overlap_length1 = diff_commonOverlap_(deletion, insertion);
				var overlap_length2 = diff_commonOverlap_(insertion, deletion);
				if (overlap_length1 >= overlap_length2) {
					if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
						diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
						diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
						diffs[pointer + 1][1] = insertion.substring(overlap_length1);
						pointer++;
					}
				} else if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
					diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
					diffs[pointer - 1][0] = DIFF_INSERT;
					diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
					diffs[pointer + 1][0] = DIFF_DELETE;
					diffs[pointer + 1][1] = deletion.substring(overlap_length2);
					pointer++;
				}
				pointer++;
			}
			pointer++;
		}
	}
	var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
	var whitespaceRegex_ = /\s/;
	var linebreakRegex_ = /[\r\n]/;
	var blanklineEndRegex_ = /\n\r?\n$/;
	var blanklineStartRegex_ = /^\r?\n\r?\n/;
	/**
	* Look for single edits surrounded on both sides by equalities
	* which can be shifted sideways to align the edit to a word boundary.
	* e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
	* @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	*/
	function diff_cleanupSemanticLossless(diffs) {
		/**
		* Given two strings, compute a score representing whether the internal
		* boundary falls on logical boundaries.
		* Scores range from 6 (best) to 0 (worst).
		* Closure, but does not reference any external variables.
		* @param {string} one First string.
		* @param {string} two Second string.
		* @return {number} The score.
		* @private
		*/
		function diff_cleanupSemanticScore_(one, two) {
			if (!one || !two) return 6;
			var char1 = one.charAt(one.length - 1);
			var char2 = two.charAt(0);
			var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
			var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
			var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
			var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
			var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
			var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
			var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
			var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
			if (blankLine1 || blankLine2) return 5;
			else if (lineBreak1 || lineBreak2) return 4;
			else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) return 3;
			else if (whitespace1 || whitespace2) return 2;
			else if (nonAlphaNumeric1 || nonAlphaNumeric2) return 1;
			return 0;
		}
		var pointer = 1;
		while (pointer < diffs.length - 1) {
			if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
				var equality1 = diffs[pointer - 1][1];
				var edit = diffs[pointer][1];
				var equality2 = diffs[pointer + 1][1];
				var commonOffset = diff_commonSuffix(equality1, edit);
				if (commonOffset) {
					var commonString = edit.substring(edit.length - commonOffset);
					equality1 = equality1.substring(0, equality1.length - commonOffset);
					edit = commonString + edit.substring(0, edit.length - commonOffset);
					equality2 = commonString + equality2;
				}
				var bestEquality1 = equality1;
				var bestEdit = edit;
				var bestEquality2 = equality2;
				var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
				while (edit.charAt(0) === equality2.charAt(0)) {
					equality1 += edit.charAt(0);
					edit = edit.substring(1) + equality2.charAt(0);
					equality2 = equality2.substring(1);
					var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
					if (score >= bestScore) {
						bestScore = score;
						bestEquality1 = equality1;
						bestEdit = edit;
						bestEquality2 = equality2;
					}
				}
				if (diffs[pointer - 1][1] != bestEquality1) {
					if (bestEquality1) diffs[pointer - 1][1] = bestEquality1;
					else {
						diffs.splice(pointer - 1, 1);
						pointer--;
					}
					diffs[pointer][1] = bestEdit;
					if (bestEquality2) diffs[pointer + 1][1] = bestEquality2;
					else {
						diffs.splice(pointer + 1, 1);
						pointer--;
					}
				}
			}
			pointer++;
		}
	}
	/**
	* Reorder and merge like edit sections.  Merge equalities.
	* Any edit section can move as long as it doesn't cross an equality.
	* @param {Array} diffs Array of diff tuples.
	* @param {boolean} fix_unicode Whether to normalize to a unicode-correct diff
	*/
	function diff_cleanupMerge(diffs, fix_unicode) {
		diffs.push([DIFF_EQUAL, ""]);
		var pointer = 0;
		var count_delete = 0;
		var count_insert = 0;
		var text_delete = "";
		var text_insert = "";
		var commonlength;
		while (pointer < diffs.length) {
			if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
				diffs.splice(pointer, 1);
				continue;
			}
			switch (diffs[pointer][0]) {
				case DIFF_INSERT:
					count_insert++;
					text_insert += diffs[pointer][1];
					pointer++;
					break;
				case DIFF_DELETE:
					count_delete++;
					text_delete += diffs[pointer][1];
					pointer++;
					break;
				case DIFF_EQUAL:
					var previous_equality = pointer - count_insert - count_delete - 1;
					if (fix_unicode) {
						if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
							var stray = diffs[previous_equality][1].slice(-1);
							diffs[previous_equality][1] = diffs[previous_equality][1].slice(0, -1);
							text_delete = stray + text_delete;
							text_insert = stray + text_insert;
							if (!diffs[previous_equality][1]) {
								diffs.splice(previous_equality, 1);
								pointer--;
								var k = previous_equality - 1;
								if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
									count_insert++;
									text_insert = diffs[k][1] + text_insert;
									k--;
								}
								if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
									count_delete++;
									text_delete = diffs[k][1] + text_delete;
									k--;
								}
								previous_equality = k;
							}
						}
						if (starts_with_pair_end(diffs[pointer][1])) {
							var stray = diffs[pointer][1].charAt(0);
							diffs[pointer][1] = diffs[pointer][1].slice(1);
							text_delete += stray;
							text_insert += stray;
						}
					}
					if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
						diffs.splice(pointer, 1);
						break;
					}
					if (text_delete.length > 0 || text_insert.length > 0) {
						if (text_delete.length > 0 && text_insert.length > 0) {
							commonlength = diff_commonPrefix(text_insert, text_delete);
							if (commonlength !== 0) {
								if (previous_equality >= 0) diffs[previous_equality][1] += text_insert.substring(0, commonlength);
								else {
									diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
									pointer++;
								}
								text_insert = text_insert.substring(commonlength);
								text_delete = text_delete.substring(commonlength);
							}
							commonlength = diff_commonSuffix(text_insert, text_delete);
							if (commonlength !== 0) {
								diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
								text_insert = text_insert.substring(0, text_insert.length - commonlength);
								text_delete = text_delete.substring(0, text_delete.length - commonlength);
							}
						}
						var n = count_insert + count_delete;
						if (text_delete.length === 0 && text_insert.length === 0) {
							diffs.splice(pointer - n, n);
							pointer = pointer - n;
						} else if (text_delete.length === 0) {
							diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
							pointer = pointer - n + 1;
						} else if (text_insert.length === 0) {
							diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
							pointer = pointer - n + 1;
						} else {
							diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
							pointer = pointer - n + 2;
						}
					}
					if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
						diffs[pointer - 1][1] += diffs[pointer][1];
						diffs.splice(pointer, 1);
					} else pointer++;
					count_insert = 0;
					count_delete = 0;
					text_delete = "";
					text_insert = "";
					break;
			}
		}
		if (diffs[diffs.length - 1][1] === "") diffs.pop();
		var changes = false;
		pointer = 1;
		while (pointer < diffs.length - 1) {
			if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
				if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
					diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
					diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
					diffs.splice(pointer - 1, 1);
					changes = true;
				} else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
					diffs[pointer - 1][1] += diffs[pointer + 1][1];
					diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
					diffs.splice(pointer + 1, 1);
					changes = true;
				}
			}
			pointer++;
		}
		if (changes) diff_cleanupMerge(diffs, fix_unicode);
	}
	function is_surrogate_pair_start(charCode) {
		return charCode >= 55296 && charCode <= 56319;
	}
	function is_surrogate_pair_end(charCode) {
		return charCode >= 56320 && charCode <= 57343;
	}
	function starts_with_pair_end(str) {
		return is_surrogate_pair_end(str.charCodeAt(0));
	}
	function ends_with_pair_start(str) {
		return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
	}
	function remove_empty_tuples(tuples) {
		var ret = [];
		for (var i = 0; i < tuples.length; i++) if (tuples[i][1].length > 0) ret.push(tuples[i]);
		return ret;
	}
	function make_edit_splice(before, oldMiddle, newMiddle, after) {
		if (ends_with_pair_start(before) || starts_with_pair_end(after)) return null;
		return remove_empty_tuples([
			[DIFF_EQUAL, before],
			[DIFF_DELETE, oldMiddle],
			[DIFF_INSERT, newMiddle],
			[DIFF_EQUAL, after]
		]);
	}
	function find_cursor_edit_diff(oldText, newText, cursor_pos) {
		var oldRange = typeof cursor_pos === "number" ? {
			index: cursor_pos,
			length: 0
		} : cursor_pos.oldRange;
		var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
		var oldLength = oldText.length;
		var newLength = newText.length;
		if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
			var oldCursor = oldRange.index;
			var oldBefore = oldText.slice(0, oldCursor);
			var oldAfter = oldText.slice(oldCursor);
			var maybeNewCursor = newRange ? newRange.index : null;
			editBefore: {
				var newCursor = oldCursor + newLength - oldLength;
				if (maybeNewCursor !== null && maybeNewCursor !== newCursor) break editBefore;
				if (newCursor < 0 || newCursor > newLength) break editBefore;
				var newBefore = newText.slice(0, newCursor);
				var newAfter = newText.slice(newCursor);
				if (newAfter !== oldAfter) break editBefore;
				var prefixLength = Math.min(oldCursor, newCursor);
				var oldPrefix = oldBefore.slice(0, prefixLength);
				var newPrefix = newBefore.slice(0, prefixLength);
				if (oldPrefix !== newPrefix) break editBefore;
				var oldMiddle = oldBefore.slice(prefixLength);
				var newMiddle = newBefore.slice(prefixLength);
				return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
			}
			editAfter: {
				if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) break editAfter;
				var cursor = oldCursor;
				var newBefore = newText.slice(0, cursor);
				var newAfter = newText.slice(cursor);
				if (newBefore !== oldBefore) break editAfter;
				var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
				var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
				var newSuffix = newAfter.slice(newAfter.length - suffixLength);
				if (oldSuffix !== newSuffix) break editAfter;
				var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
				var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
				return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
			}
		}
		if (oldRange.length > 0 && newRange && newRange.length === 0) replaceRange: {
			var oldPrefix = oldText.slice(0, oldRange.index);
			var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
			var prefixLength = oldPrefix.length;
			var suffixLength = oldSuffix.length;
			if (newLength < prefixLength + suffixLength) break replaceRange;
			var newPrefix = newText.slice(0, prefixLength);
			var newSuffix = newText.slice(newLength - suffixLength);
			if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) break replaceRange;
			var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
			var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
			return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
		}
		return null;
	}
	function diff(text1, text2, cursor_pos, cleanup) {
		return diff_main(text1, text2, cursor_pos, cleanup, true);
	}
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;
	module.exports = diff;
}));
//#endregion
//#region ../../node_modules/lodash.clonedeep/index.js
var require_lodash_clonedeep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* lodash (Custom Build) <https://lodash.com/>
	* Build: `lodash modularize exports="npm" -o ./`
	* Copyright jQuery Foundation and other contributors <https://jquery.org/>
	* Released under MIT license <https://lodash.com/license>
	* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	*/
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
	var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function("return this")();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	/**
	* Adds the key-value `pair` to `map`.
	*
	* @private
	* @param {Object} map The map to modify.
	* @param {Array} pair The key-value pair to add.
	* @returns {Object} Returns `map`.
	*/
	function addMapEntry(map, pair) {
		map.set(pair[0], pair[1]);
		return map;
	}
	/**
	* Adds `value` to `set`.
	*
	* @private
	* @param {Object} set The set to modify.
	* @param {*} value The value to add.
	* @returns {Object} Returns `set`.
	*/
	function addSetEntry(set, value) {
		set.add(value);
		return set;
	}
	/**
	* A specialized version of `_.forEach` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns `array`.
	*/
	function arrayEach(array, iteratee) {
		var index = -1, length = array ? array.length : 0;
		while (++index < length) if (iteratee(array[index], index, array) === false) break;
		return array;
	}
	/**
	* Appends the elements of `values` to `array`.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {Array} values The values to append.
	* @returns {Array} Returns `array`.
	*/
	function arrayPush(array, values) {
		var index = -1, length = values.length, offset = array.length;
		while (++index < length) array[offset + index] = values[index];
		return array;
	}
	/**
	* A specialized version of `_.reduce` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @param {*} [accumulator] The initial value.
	* @param {boolean} [initAccum] Specify using the first element of `array` as
	*  the initial value.
	* @returns {*} Returns the accumulated value.
	*/
	function arrayReduce(array, iteratee, accumulator, initAccum) {
		var index = -1, length = array ? array.length : 0;
		if (initAccum && length) accumulator = array[++index];
		while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
		return accumulator;
	}
	/**
	* The base implementation of `_.times` without support for iteratee shorthands
	* or max array length checks.
	*
	* @private
	* @param {number} n The number of times to invoke `iteratee`.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the array of results.
	*/
	function baseTimes(n, iteratee) {
		var index = -1, result = Array(n);
		while (++index < n) result[index] = iteratee(index);
		return result;
	}
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	/**
	* Checks if `value` is a host object in IE < 9.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	*/
	function isHostObject(value) {
		var result = false;
		if (value != null && typeof value.toString != "function") try {
			result = !!(value + "");
		} catch (e) {}
		return result;
	}
	/**
	* Converts `map` to its key-value pairs.
	*
	* @private
	* @param {Object} map The map to convert.
	* @returns {Array} Returns the key-value pairs.
	*/
	function mapToArray(map) {
		var index = -1, result = Array(map.size);
		map.forEach(function(value, key) {
			result[++index] = [key, value];
		});
		return result;
	}
	/**
	* Creates a unary function that invokes `func` with its argument transformed.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {Function} transform The argument transform.
	* @returns {Function} Returns the new function.
	*/
	function overArg(func, transform) {
		return function(arg) {
			return func(transform(arg));
		};
	}
	/**
	* Converts `set` to an array of its values.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the values.
	*/
	function setToArray(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}
	/** Used for built-in method references. */
	var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root["__core-js_shared__"];
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var objectToString = objectProto.toString;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : void 0, Symbol = root.Symbol, Uint8Array = root.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
	var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
	var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries ? entries.length : 0;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		return this.has(key) && delete this.__data__[key];
	}
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? void 0 : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : void 0;
	}
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries ? entries.length : 0;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
	}
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		return true;
	}
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) data.push([key, value]);
		else data[index][1] = value;
		return this;
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries ? entries.length : 0;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		return getMapData(this, key)["delete"](key);
	}
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		getMapData(this, key).set(key, value);
		return this;
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	/**
	* Creates a stack cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Stack(entries) {
		this.__data__ = new ListCache(entries);
	}
	/**
	* Removes all key-value entries from the stack.
	*
	* @private
	* @name clear
	* @memberOf Stack
	*/
	function stackClear() {
		this.__data__ = new ListCache();
	}
	/**
	* Removes `key` and its value from the stack.
	*
	* @private
	* @name delete
	* @memberOf Stack
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function stackDelete(key) {
		return this.__data__["delete"](key);
	}
	/**
	* Gets the stack value for `key`.
	*
	* @private
	* @name get
	* @memberOf Stack
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function stackGet(key) {
		return this.__data__.get(key);
	}
	/**
	* Checks if a stack value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Stack
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function stackHas(key) {
		return this.__data__.has(key);
	}
	/**
	* Sets the stack `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Stack
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the stack cache instance.
	*/
	function stackSet(key, value) {
		var cache = this.__data__;
		if (cache instanceof ListCache) {
			var pairs = cache.__data__;
			if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
				pairs.push([key, value]);
				return this;
			}
			cache = this.__data__ = new MapCache(pairs);
		}
		cache.set(key, value);
		return this;
	}
	Stack.prototype.clear = stackClear;
	Stack.prototype["delete"] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	/**
	* Creates an array of the enumerable property names of the array-like `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @param {boolean} inherited Specify returning inherited property names.
	* @returns {Array} Returns the array of property names.
	*/
	function arrayLikeKeys(value, inherited) {
		var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
		var length = result.length, skipIndexes = !!length;
		for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) result.push(key);
		return result;
	}
	/**
	* Assigns `value` to `key` of `object` if the existing value is not equivalent
	* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* for equality comparisons.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {string} key The key of the property to assign.
	* @param {*} value The value to assign.
	*/
	function assignValue(object, key, value) {
		var objValue = object[key];
		if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) object[key] = value;
	}
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	/**
	* The base implementation of `_.assign` without support for multiple sources
	* or `customizer` functions.
	*
	* @private
	* @param {Object} object The destination object.
	* @param {Object} source The source object.
	* @returns {Object} Returns `object`.
	*/
	function baseAssign(object, source) {
		return object && copyObject(source, keys(source), object);
	}
	/**
	* The base implementation of `_.clone` and `_.cloneDeep` which tracks
	* traversed objects.
	*
	* @private
	* @param {*} value The value to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @param {boolean} [isFull] Specify a clone including symbols.
	* @param {Function} [customizer] The function to customize cloning.
	* @param {string} [key] The key of `value`.
	* @param {Object} [object] The parent object of `value`.
	* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	* @returns {*} Returns the cloned value.
	*/
	function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
		var result;
		if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
		if (result !== void 0) return result;
		if (!isObject(value)) return value;
		var isArr = isArray(value);
		if (isArr) {
			result = initCloneArray(value);
			if (!isDeep) return copyArray(value, result);
		} else {
			var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
			if (isBuffer(value)) return cloneBuffer(value, isDeep);
			if (tag == objectTag || tag == argsTag || isFunc && !object) {
				if (isHostObject(value)) return object ? value : {};
				result = initCloneObject(isFunc ? {} : value);
				if (!isDeep) return copySymbols(value, baseAssign(result, value));
			} else {
				if (!cloneableTags[tag]) return object ? value : {};
				result = initCloneByTag(value, tag, baseClone, isDeep);
			}
		}
		stack || (stack = new Stack());
		var stacked = stack.get(value);
		if (stacked) return stacked;
		stack.set(value, result);
		if (!isArr) var props = isFull ? getAllKeys(value) : keys(value);
		arrayEach(props || value, function(subValue, key) {
			if (props) {
				key = subValue;
				subValue = value[key];
			}
			assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
		});
		return result;
	}
	/**
	* The base implementation of `_.create` without support for assigning
	* properties to the created object.
	*
	* @private
	* @param {Object} prototype The object to inherit from.
	* @returns {Object} Returns the new object.
	*/
	function baseCreate(proto) {
		return isObject(proto) ? objectCreate(proto) : {};
	}
	/**
	* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	* `keysFunc` and `symbolsFunc` to get the enumerable property names and
	* symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Function} keysFunc The function to get the keys of `object`.
	* @param {Function} symbolsFunc The function to get the symbols of `object`.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		var result = keysFunc(object);
		return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}
	/**
	* The base implementation of `getTag`.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		return objectToString.call(value);
	}
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	/**
	* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function baseKeys(object) {
		if (!isPrototype(object)) return nativeKeys(object);
		var result = [];
		for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
		return result;
	}
	/**
	* Creates a clone of  `buffer`.
	*
	* @private
	* @param {Buffer} buffer The buffer to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Buffer} Returns the cloned buffer.
	*/
	function cloneBuffer(buffer, isDeep) {
		if (isDeep) return buffer.slice();
		var result = new buffer.constructor(buffer.length);
		buffer.copy(result);
		return result;
	}
	/**
	* Creates a clone of `arrayBuffer`.
	*
	* @private
	* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	* @returns {ArrayBuffer} Returns the cloned array buffer.
	*/
	function cloneArrayBuffer(arrayBuffer) {
		var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
		new Uint8Array(result).set(new Uint8Array(arrayBuffer));
		return result;
	}
	/**
	* Creates a clone of `dataView`.
	*
	* @private
	* @param {Object} dataView The data view to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned data view.
	*/
	function cloneDataView(dataView, isDeep) {
		var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
		return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}
	/**
	* Creates a clone of `map`.
	*
	* @private
	* @param {Object} map The map to clone.
	* @param {Function} cloneFunc The function to clone values.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned map.
	*/
	function cloneMap(map, isDeep, cloneFunc) {
		return arrayReduce(isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map), addMapEntry, new map.constructor());
	}
	/**
	* Creates a clone of `regexp`.
	*
	* @private
	* @param {Object} regexp The regexp to clone.
	* @returns {Object} Returns the cloned regexp.
	*/
	function cloneRegExp(regexp) {
		var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
		result.lastIndex = regexp.lastIndex;
		return result;
	}
	/**
	* Creates a clone of `set`.
	*
	* @private
	* @param {Object} set The set to clone.
	* @param {Function} cloneFunc The function to clone values.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned set.
	*/
	function cloneSet(set, isDeep, cloneFunc) {
		return arrayReduce(isDeep ? cloneFunc(setToArray(set), true) : setToArray(set), addSetEntry, new set.constructor());
	}
	/**
	* Creates a clone of the `symbol` object.
	*
	* @private
	* @param {Object} symbol The symbol object to clone.
	* @returns {Object} Returns the cloned symbol object.
	*/
	function cloneSymbol(symbol) {
		return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}
	/**
	* Creates a clone of `typedArray`.
	*
	* @private
	* @param {Object} typedArray The typed array to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned typed array.
	*/
	function cloneTypedArray(typedArray, isDeep) {
		var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
		return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}
	/**
	* Copies the values of `source` to `array`.
	*
	* @private
	* @param {Array} source The array to copy values from.
	* @param {Array} [array=[]] The array to copy values to.
	* @returns {Array} Returns `array`.
	*/
	function copyArray(source, array) {
		var index = -1, length = source.length;
		array || (array = Array(length));
		while (++index < length) array[index] = source[index];
		return array;
	}
	/**
	* Copies properties of `source` to `object`.
	*
	* @private
	* @param {Object} source The object to copy properties from.
	* @param {Array} props The property identifiers to copy.
	* @param {Object} [object={}] The object to copy properties to.
	* @param {Function} [customizer] The function to customize copied values.
	* @returns {Object} Returns `object`.
	*/
	function copyObject(source, props, object, customizer) {
		object || (object = {});
		var index = -1, length = props.length;
		while (++index < length) {
			var key = props[index];
			var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
			assignValue(object, key, newValue === void 0 ? source[key] : newValue);
		}
		return object;
	}
	/**
	* Copies own symbol properties of `source` to `object`.
	*
	* @private
	* @param {Object} source The object to copy symbols from.
	* @param {Object} [object={}] The object to copy symbols to.
	* @returns {Object} Returns `object`.
	*/
	function copySymbols(source, object) {
		return copyObject(source, getSymbols(source), object);
	}
	/**
	* Creates an array of own enumerable property names and symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function getAllKeys(object) {
		return baseGetAllKeys(object, keys, getSymbols);
	}
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	/**
	* Creates an array of the own enumerable symbol properties of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of symbols.
	*/
	var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
	/**
	* Gets the `toStringTag` of `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	var getTag = baseGetTag;
	if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
		var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
		if (ctorString) switch (ctorString) {
			case dataViewCtorString: return dataViewTag;
			case mapCtorString: return mapTag;
			case promiseCtorString: return promiseTag;
			case setCtorString: return setTag;
			case weakMapCtorString: return weakMapTag;
		}
		return result;
	};
	/**
	* Initializes an array clone.
	*
	* @private
	* @param {Array} array The array to clone.
	* @returns {Array} Returns the initialized clone.
	*/
	function initCloneArray(array) {
		var length = array.length, result = array.constructor(length);
		if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
			result.index = array.index;
			result.input = array.input;
		}
		return result;
	}
	/**
	* Initializes an object clone.
	*
	* @private
	* @param {Object} object The object to clone.
	* @returns {Object} Returns the initialized clone.
	*/
	function initCloneObject(object) {
		return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
	}
	/**
	* Initializes an object clone based on its `toStringTag`.
	*
	* **Note:** This function only supports cloning values with tags of
	* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	*
	* @private
	* @param {Object} object The object to clone.
	* @param {string} tag The `toStringTag` of the object to clone.
	* @param {Function} cloneFunc The function to clone values.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the initialized clone.
	*/
	function initCloneByTag(object, tag, cloneFunc, isDeep) {
		var Ctor = object.constructor;
		switch (tag) {
			case arrayBufferTag: return cloneArrayBuffer(object);
			case boolTag:
			case dateTag: return new Ctor(+object);
			case dataViewTag: return cloneDataView(object, isDeep);
			case float32Tag:
			case float64Tag:
			case int8Tag:
			case int16Tag:
			case int32Tag:
			case uint8Tag:
			case uint8ClampedTag:
			case uint16Tag:
			case uint32Tag: return cloneTypedArray(object, isDeep);
			case mapTag: return cloneMap(object, isDeep, cloneFunc);
			case numberTag:
			case stringTag: return new Ctor(object);
			case regexpTag: return cloneRegExp(object);
			case setTag: return cloneSet(object, isDeep, cloneFunc);
			case symbolTag: return cloneSymbol(object);
		}
	}
	/**
	* Checks if `value` is a valid array-like index.
	*
	* @private
	* @param {*} value The value to check.
	* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	*/
	function isIndex(value, length) {
		length = length == null ? MAX_SAFE_INTEGER : length;
		return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	/**
	* Checks if `value` is likely a prototype object.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	*/
	function isPrototype(value) {
		var Ctor = value && value.constructor;
		return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
	}
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to process.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	/**
	* This method is like `_.clone` except that it recursively clones `value`.
	*
	* @static
	* @memberOf _
	* @since 1.0.0
	* @category Lang
	* @param {*} value The value to recursively clone.
	* @returns {*} Returns the deep cloned value.
	* @see _.clone
	* @example
	*
	* var objects = [{ 'a': 1 }, { 'b': 2 }];
	*
	* var deep = _.cloneDeep(objects);
	* console.log(deep[0] === objects[0]);
	* // => false
	*/
	function cloneDeep(value) {
		return baseClone(value, true, true);
	}
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	/**
	* Checks if `value` is likely an `arguments` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*  else `false`.
	* @example
	*
	* _.isArguments(function() { return arguments; }());
	* // => true
	*
	* _.isArguments([1, 2, 3]);
	* // => false
	*/
	function isArguments(value) {
		return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
	}
	/**
	* Checks if `value` is classified as an `Array` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an array, else `false`.
	* @example
	*
	* _.isArray([1, 2, 3]);
	* // => true
	*
	* _.isArray(document.body.children);
	* // => false
	*
	* _.isArray('abc');
	* // => false
	*
	* _.isArray(_.noop);
	* // => false
	*/
	var isArray = Array.isArray;
	/**
	* Checks if `value` is array-like. A value is considered array-like if it's
	* not a function and has a `value.length` that's an integer greater than or
	* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	* @example
	*
	* _.isArrayLike([1, 2, 3]);
	* // => true
	*
	* _.isArrayLike(document.body.children);
	* // => true
	*
	* _.isArrayLike('abc');
	* // => true
	*
	* _.isArrayLike(_.noop);
	* // => false
	*/
	function isArrayLike(value) {
		return value != null && isLength(value.length) && !isFunction(value);
	}
	/**
	* This method is like `_.isArrayLike` except that it also checks if `value`
	* is an object.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an array-like object,
	*  else `false`.
	* @example
	*
	* _.isArrayLikeObject([1, 2, 3]);
	* // => true
	*
	* _.isArrayLikeObject(document.body.children);
	* // => true
	*
	* _.isArrayLikeObject('abc');
	* // => false
	*
	* _.isArrayLikeObject(_.noop);
	* // => false
	*/
	function isArrayLikeObject(value) {
		return isObjectLike(value) && isArrayLike(value);
	}
	/**
	* Checks if `value` is a buffer.
	*
	* @static
	* @memberOf _
	* @since 4.3.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	* @example
	*
	* _.isBuffer(new Buffer(2));
	* // => true
	*
	* _.isBuffer(new Uint8Array(2));
	* // => false
	*/
	var isBuffer = nativeIsBuffer || stubFalse;
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		var tag = isObject(value) ? objectToString.call(value) : "";
		return tag == funcTag || tag == genTag;
	}
	/**
	* Checks if `value` is a valid array-like length.
	*
	* **Note:** This method is loosely based on
	* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	* @example
	*
	* _.isLength(3);
	* // => true
	*
	* _.isLength(Number.MIN_VALUE);
	* // => false
	*
	* _.isLength(Infinity);
	* // => false
	*
	* _.isLength('3');
	* // => false
	*/
	function isLength(value) {
		return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return !!value && (type == "object" || type == "function");
	}
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return !!value && typeof value == "object";
	}
	/**
	* Creates an array of the own enumerable property names of `object`.
	*
	* **Note:** Non-object values are coerced to objects. See the
	* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	* for more details.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.keys(new Foo);
	* // => ['a', 'b'] (iteration order is not guaranteed)
	*
	* _.keys('hi');
	* // => ['0', '1']
	*/
	function keys(object) {
		return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	/**
	* This method returns a new empty array.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {Array} Returns the new empty array.
	* @example
	*
	* var arrays = _.times(2, _.stubArray);
	*
	* console.log(arrays);
	* // => [[], []]
	*
	* console.log(arrays[0] === arrays[1]);
	* // => false
	*/
	function stubArray() {
		return [];
	}
	/**
	* This method returns `false`.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {boolean} Returns `false`.
	* @example
	*
	* _.times(2, _.stubFalse);
	* // => [false, false]
	*/
	function stubFalse() {
		return false;
	}
	module.exports = cloneDeep;
}));
//#endregion
//#region ../../node_modules/lodash.isequal/index.js
var require_lodash_isequal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Lodash (Custom Build) <https://lodash.com/>
	* Build: `lodash modularize exports="npm" -o ./`
	* Copyright JS Foundation and other contributors <https://js.foundation/>
	* Released under MIT license <https://lodash.com/license>
	* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	*/
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
	var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function("return this")();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;
	/** Used to access faster Node.js helpers. */
	var nodeUtil = function() {
		try {
			return freeProcess && freeProcess.binding && freeProcess.binding("util");
		} catch (e) {}
	}();
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	/**
	* A specialized version of `_.filter` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {Array} Returns the new filtered array.
	*/
	function arrayFilter(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
		while (++index < length) {
			var value = array[index];
			if (predicate(value, index, array)) result[resIndex++] = value;
		}
		return result;
	}
	/**
	* Appends the elements of `values` to `array`.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {Array} values The values to append.
	* @returns {Array} Returns `array`.
	*/
	function arrayPush(array, values) {
		var index = -1, length = values.length, offset = array.length;
		while (++index < length) array[offset + index] = values[index];
		return array;
	}
	/**
	* A specialized version of `_.some` for arrays without support for iteratee
	* shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {boolean} Returns `true` if any element passes the predicate check,
	*  else `false`.
	*/
	function arraySome(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length;
		while (++index < length) if (predicate(array[index], index, array)) return true;
		return false;
	}
	/**
	* The base implementation of `_.times` without support for iteratee shorthands
	* or max array length checks.
	*
	* @private
	* @param {number} n The number of times to invoke `iteratee`.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the array of results.
	*/
	function baseTimes(n, iteratee) {
		var index = -1, result = Array(n);
		while (++index < n) result[index] = iteratee(index);
		return result;
	}
	/**
	* The base implementation of `_.unary` without support for storing metadata.
	*
	* @private
	* @param {Function} func The function to cap arguments for.
	* @returns {Function} Returns the new capped function.
	*/
	function baseUnary(func) {
		return function(value) {
			return func(value);
		};
	}
	/**
	* Checks if a `cache` value for `key` exists.
	*
	* @private
	* @param {Object} cache The cache to query.
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function cacheHas(cache, key) {
		return cache.has(key);
	}
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	/**
	* Converts `map` to its key-value pairs.
	*
	* @private
	* @param {Object} map The map to convert.
	* @returns {Array} Returns the key-value pairs.
	*/
	function mapToArray(map) {
		var index = -1, result = Array(map.size);
		map.forEach(function(value, key) {
			result[++index] = [key, value];
		});
		return result;
	}
	/**
	* Creates a unary function that invokes `func` with its argument transformed.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {Function} transform The argument transform.
	* @returns {Function} Returns the new function.
	*/
	function overArg(func, transform) {
		return function(arg) {
			return func(transform(arg));
		};
	}
	/**
	* Converts `set` to an array of its values.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the values.
	*/
	function setToArray(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}
	/** Used for built-in method references. */
	var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root["__core-js_shared__"];
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = objectProto.toString;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : void 0, Symbol = root.Symbol, Uint8Array = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
	var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? void 0 : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : void 0;
	}
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		--this.size;
		return true;
	}
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else data[index][1] = value;
		return this;
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		var result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		var data = getMapData(this, key), size = data.size;
		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	/**
	*
	* Creates an array cache object to store unique values.
	*
	* @private
	* @constructor
	* @param {Array} [values] The values to cache.
	*/
	function SetCache(values) {
		var index = -1, length = values == null ? 0 : values.length;
		this.__data__ = new MapCache();
		while (++index < length) this.add(values[index]);
	}
	/**
	* Adds `value` to the array cache.
	*
	* @private
	* @name add
	* @memberOf SetCache
	* @alias push
	* @param {*} value The value to cache.
	* @returns {Object} Returns the cache instance.
	*/
	function setCacheAdd(value) {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}
	/**
	* Checks if `value` is in the array cache.
	*
	* @private
	* @name has
	* @memberOf SetCache
	* @param {*} value The value to search for.
	* @returns {number} Returns `true` if `value` is found, else `false`.
	*/
	function setCacheHas(value) {
		return this.__data__.has(value);
	}
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	/**
	* Creates a stack cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Stack(entries) {
		this.size = (this.__data__ = new ListCache(entries)).size;
	}
	/**
	* Removes all key-value entries from the stack.
	*
	* @private
	* @name clear
	* @memberOf Stack
	*/
	function stackClear() {
		this.__data__ = new ListCache();
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the stack.
	*
	* @private
	* @name delete
	* @memberOf Stack
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function stackDelete(key) {
		var data = this.__data__, result = data["delete"](key);
		this.size = data.size;
		return result;
	}
	/**
	* Gets the stack value for `key`.
	*
	* @private
	* @name get
	* @memberOf Stack
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function stackGet(key) {
		return this.__data__.get(key);
	}
	/**
	* Checks if a stack value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Stack
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function stackHas(key) {
		return this.__data__.has(key);
	}
	/**
	* Sets the stack `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Stack
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the stack cache instance.
	*/
	function stackSet(key, value) {
		var data = this.__data__;
		if (data instanceof ListCache) {
			var pairs = data.__data__;
			if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
				pairs.push([key, value]);
				this.size = ++data.size;
				return this;
			}
			data = this.__data__ = new MapCache(pairs);
		}
		data.set(key, value);
		this.size = data.size;
		return this;
	}
	Stack.prototype.clear = stackClear;
	Stack.prototype["delete"] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	/**
	* Creates an array of the enumerable property names of the array-like `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @param {boolean} inherited Specify returning inherited property names.
	* @returns {Array} Returns the array of property names.
	*/
	function arrayLikeKeys(value, inherited) {
		var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
		for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
		return result;
	}
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	/**
	* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	* `keysFunc` and `symbolsFunc` to get the enumerable property names and
	* symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Function} keysFunc The function to get the keys of `object`.
	* @param {Function} symbolsFunc The function to get the symbols of `object`.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		var result = keysFunc(object);
		return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	/**
	* The base implementation of `_.isArguments`.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*/
	function baseIsArguments(value) {
		return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	/**
	* The base implementation of `_.isEqual` which supports partial comparisons
	* and tracks traversed objects.
	*
	* @private
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @param {boolean} bitmask The bitmask flags.
	*  1 - Unordered comparison
	*  2 - Partial comparison
	* @param {Function} [customizer] The function to customize comparisons.
	* @param {Object} [stack] Tracks traversed `value` and `other` objects.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	*/
	function baseIsEqual(value, other, bitmask, customizer, stack) {
		if (value === other) return true;
		if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
		return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}
	/**
	* A specialized version of `baseIsEqual` for arrays and objects which performs
	* deep comparisons and tracks traversed objects enabling objects with circular
	* references to be compared.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} [stack] Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
		var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
		objTag = objTag == argsTag ? objectTag : objTag;
		othTag = othTag == argsTag ? objectTag : othTag;
		var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
		if (isSameTag && isBuffer(object)) {
			if (!isBuffer(other)) return false;
			objIsArr = true;
			objIsObj = false;
		}
		if (isSameTag && !objIsObj) {
			stack || (stack = new Stack());
			return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
		}
		if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
			var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
			if (objIsWrapped || othIsWrapped) {
				var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
				stack || (stack = new Stack());
				return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
			}
		}
		if (!isSameTag) return false;
		stack || (stack = new Stack());
		return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	/**
	* The base implementation of `_.isTypedArray` without Node.js optimizations.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	*/
	function baseIsTypedArray(value) {
		return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	/**
	* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function baseKeys(object) {
		if (!isPrototype(object)) return nativeKeys(object);
		var result = [];
		for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
		return result;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for arrays with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Array} array The array to compare.
	* @param {Array} other The other array to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `array` and `other` objects.
	* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	*/
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
		if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
		var stacked = stack.get(array);
		if (stacked && stack.get(other)) return stacked == other;
		var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
		stack.set(array, other);
		stack.set(other, array);
		while (++index < arrLength) {
			var arrValue = array[index], othValue = other[index];
			if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
			if (compared !== void 0) {
				if (compared) continue;
				result = false;
				break;
			}
			if (seen) {
				if (!arraySome(other, function(othValue, othIndex) {
					if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
				})) {
					result = false;
					break;
				}
			} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
				result = false;
				break;
			}
		}
		stack["delete"](array);
		stack["delete"](other);
		return result;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for comparing objects of
	* the same `toStringTag`.
	*
	* **Note:** This function only supports comparing values with tags of
	* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {string} tag The `toStringTag` of the objects to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
		switch (tag) {
			case dataViewTag:
				if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
				object = object.buffer;
				other = other.buffer;
			case arrayBufferTag:
				if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
				return true;
			case boolTag:
			case dateTag:
			case numberTag: return eq(+object, +other);
			case errorTag: return object.name == other.name && object.message == other.message;
			case regexpTag:
			case stringTag: return object == other + "";
			case mapTag: var convert = mapToArray;
			case setTag:
				var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
				convert || (convert = setToArray);
				if (object.size != other.size && !isPartial) return false;
				var stacked = stack.get(object);
				if (stacked) return stacked == other;
				bitmask |= COMPARE_UNORDERED_FLAG;
				stack.set(object, other);
				var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
				stack["delete"](object);
				return result;
			case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
		}
		return false;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for objects with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
		if (objLength != getAllKeys(other).length && !isPartial) return false;
		var index = objLength;
		while (index--) {
			var key = objProps[index];
			if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
		}
		var stacked = stack.get(object);
		if (stacked && stack.get(other)) return stacked == other;
		var result = true;
		stack.set(object, other);
		stack.set(other, object);
		var skipCtor = isPartial;
		while (++index < objLength) {
			key = objProps[index];
			var objValue = object[key], othValue = other[key];
			if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
			if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
				result = false;
				break;
			}
			skipCtor || (skipCtor = key == "constructor");
		}
		if (result && !skipCtor) {
			var objCtor = object.constructor, othCtor = other.constructor;
			if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
		}
		stack["delete"](object);
		stack["delete"](other);
		return result;
	}
	/**
	* Creates an array of own enumerable property names and symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function getAllKeys(object) {
		return baseGetAllKeys(object, keys, getSymbols);
	}
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		try {
			value[symToStringTag] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString.call(value);
		if (unmasked) if (isOwn) value[symToStringTag] = tag;
		else delete value[symToStringTag];
		return result;
	}
	/**
	* Creates an array of the own enumerable symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of symbols.
	*/
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
		if (object == null) return [];
		object = Object(object);
		return arrayFilter(nativeGetSymbols(object), function(symbol) {
			return propertyIsEnumerable.call(object, symbol);
		});
	};
	/**
	* Gets the `toStringTag` of `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	var getTag = baseGetTag;
	if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
		var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
		if (ctorString) switch (ctorString) {
			case dataViewCtorString: return dataViewTag;
			case mapCtorString: return mapTag;
			case promiseCtorString: return promiseTag;
			case setCtorString: return setTag;
			case weakMapCtorString: return weakMapTag;
		}
		return result;
	};
	/**
	* Checks if `value` is a valid array-like index.
	*
	* @private
	* @param {*} value The value to check.
	* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	*/
	function isIndex(value, length) {
		length = length == null ? MAX_SAFE_INTEGER : length;
		return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	/**
	* Checks if `value` is likely a prototype object.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	*/
	function isPrototype(value) {
		var Ctor = value && value.constructor;
		return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
	}
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to convert.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	/**
	* Checks if `value` is likely an `arguments` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*  else `false`.
	* @example
	*
	* _.isArguments(function() { return arguments; }());
	* // => true
	*
	* _.isArguments([1, 2, 3]);
	* // => false
	*/
	var isArguments = baseIsArguments(function() {
		return arguments;
	}()) ? baseIsArguments : function(value) {
		return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
	};
	/**
	* Checks if `value` is classified as an `Array` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an array, else `false`.
	* @example
	*
	* _.isArray([1, 2, 3]);
	* // => true
	*
	* _.isArray(document.body.children);
	* // => false
	*
	* _.isArray('abc');
	* // => false
	*
	* _.isArray(_.noop);
	* // => false
	*/
	var isArray = Array.isArray;
	/**
	* Checks if `value` is array-like. A value is considered array-like if it's
	* not a function and has a `value.length` that's an integer greater than or
	* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	* @example
	*
	* _.isArrayLike([1, 2, 3]);
	* // => true
	*
	* _.isArrayLike(document.body.children);
	* // => true
	*
	* _.isArrayLike('abc');
	* // => true
	*
	* _.isArrayLike(_.noop);
	* // => false
	*/
	function isArrayLike(value) {
		return value != null && isLength(value.length) && !isFunction(value);
	}
	/**
	* Checks if `value` is a buffer.
	*
	* @static
	* @memberOf _
	* @since 4.3.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	* @example
	*
	* _.isBuffer(new Buffer(2));
	* // => true
	*
	* _.isBuffer(new Uint8Array(2));
	* // => false
	*/
	var isBuffer = nativeIsBuffer || stubFalse;
	/**
	* Performs a deep comparison between two values to determine if they are
	* equivalent.
	*
	* **Note:** This method supports comparing arrays, array buffers, booleans,
	* date objects, error objects, maps, numbers, `Object` objects, regexes,
	* sets, strings, symbols, and typed arrays. `Object` objects are compared
	* by their own, not inherited, enumerable properties. Functions and DOM
	* nodes are compared by strict equality, i.e. `===`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.isEqual(object, other);
	* // => true
	*
	* object === other;
	* // => false
	*/
	function isEqual(value, other) {
		return baseIsEqual(value, other);
	}
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		if (!isObject(value)) return false;
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	/**
	* Checks if `value` is a valid array-like length.
	*
	* **Note:** This method is loosely based on
	* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	* @example
	*
	* _.isLength(3);
	* // => true
	*
	* _.isLength(Number.MIN_VALUE);
	* // => false
	*
	* _.isLength(Infinity);
	* // => false
	*
	* _.isLength('3');
	* // => false
	*/
	function isLength(value) {
		return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == "object" || type == "function");
	}
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	/**
	* Checks if `value` is classified as a typed array.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	* @example
	*
	* _.isTypedArray(new Uint8Array);
	* // => true
	*
	* _.isTypedArray([]);
	* // => false
	*/
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	/**
	* Creates an array of the own enumerable property names of `object`.
	*
	* **Note:** Non-object values are coerced to objects. See the
	* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	* for more details.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.keys(new Foo);
	* // => ['a', 'b'] (iteration order is not guaranteed)
	*
	* _.keys('hi');
	* // => ['0', '1']
	*/
	function keys(object) {
		return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	/**
	* This method returns a new empty array.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {Array} Returns the new empty array.
	* @example
	*
	* var arrays = _.times(2, _.stubArray);
	*
	* console.log(arrays);
	* // => [[], []]
	*
	* console.log(arrays[0] === arrays[1]);
	* // => false
	*/
	function stubArray() {
		return [];
	}
	/**
	* This method returns `false`.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {boolean} Returns `false`.
	* @example
	*
	* _.times(2, _.stubFalse);
	* // => [false, false]
	*/
	function stubFalse() {
		return false;
	}
	module.exports = isEqual;
}));
//#endregion
//#region ../../node_modules/quill-delta/dist/AttributeMap.js
var require_AttributeMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var cloneDeep = require_lodash_clonedeep();
	var isEqual = require_lodash_isequal();
	var AttributeMap;
	(function(AttributeMap) {
		function compose(a = {}, b = {}, keepNull = false) {
			if (typeof a !== "object") a = {};
			if (typeof b !== "object") b = {};
			let attributes = cloneDeep(b);
			if (!keepNull) attributes = Object.keys(attributes).reduce((copy, key) => {
				if (attributes[key] != null) copy[key] = attributes[key];
				return copy;
			}, {});
			for (const key in a) if (a[key] !== void 0 && b[key] === void 0) attributes[key] = a[key];
			return Object.keys(attributes).length > 0 ? attributes : void 0;
		}
		AttributeMap.compose = compose;
		function diff(a = {}, b = {}) {
			if (typeof a !== "object") a = {};
			if (typeof b !== "object") b = {};
			const attributes = Object.keys(a).concat(Object.keys(b)).reduce((attrs, key) => {
				if (!isEqual(a[key], b[key])) attrs[key] = b[key] === void 0 ? null : b[key];
				return attrs;
			}, {});
			return Object.keys(attributes).length > 0 ? attributes : void 0;
		}
		AttributeMap.diff = diff;
		function invert(attr = {}, base = {}) {
			attr = attr || {};
			const baseInverted = Object.keys(base).reduce((memo, key) => {
				if (base[key] !== attr[key] && attr[key] !== void 0) memo[key] = base[key];
				return memo;
			}, {});
			return Object.keys(attr).reduce((memo, key) => {
				if (attr[key] !== base[key] && base[key] === void 0) memo[key] = null;
				return memo;
			}, baseInverted);
		}
		AttributeMap.invert = invert;
		function transform(a, b, priority = false) {
			if (typeof a !== "object") return b;
			if (typeof b !== "object") return;
			if (!priority) return b;
			const attributes = Object.keys(b).reduce((attrs, key) => {
				if (a[key] === void 0) attrs[key] = b[key];
				return attrs;
			}, {});
			return Object.keys(attributes).length > 0 ? attributes : void 0;
		}
		AttributeMap.transform = transform;
	})(AttributeMap || (AttributeMap = {}));
	exports.default = AttributeMap;
}));
//#endregion
//#region ../../node_modules/quill-delta/dist/Op.js
var require_Op = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Op;
	(function(Op) {
		function length(op) {
			if (typeof op.delete === "number") return op.delete;
			else if (typeof op.retain === "number") return op.retain;
			else if (typeof op.retain === "object" && op.retain !== null) return 1;
			else return typeof op.insert === "string" ? op.insert.length : 1;
		}
		Op.length = length;
	})(Op || (Op = {}));
	exports.default = Op;
}));
//#endregion
//#region ../../node_modules/quill-delta/dist/OpIterator.js
var require_OpIterator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Op_1 = require_Op();
	var Iterator = class {
		constructor(ops) {
			this.ops = ops;
			this.index = 0;
			this.offset = 0;
		}
		hasNext() {
			return this.peekLength() < Infinity;
		}
		next(length) {
			if (!length) length = Infinity;
			const nextOp = this.ops[this.index];
			if (nextOp) {
				const offset = this.offset;
				const opLength = Op_1.default.length(nextOp);
				if (length >= opLength - offset) {
					length = opLength - offset;
					this.index += 1;
					this.offset = 0;
				} else this.offset += length;
				if (typeof nextOp.delete === "number") return { delete: length };
				else {
					const retOp = {};
					if (nextOp.attributes) retOp.attributes = nextOp.attributes;
					if (typeof nextOp.retain === "number") retOp.retain = length;
					else if (typeof nextOp.retain === "object" && nextOp.retain !== null) retOp.retain = nextOp.retain;
					else if (typeof nextOp.insert === "string") retOp.insert = nextOp.insert.substr(offset, length);
					else retOp.insert = nextOp.insert;
					return retOp;
				}
			} else return { retain: Infinity };
		}
		peek() {
			return this.ops[this.index];
		}
		peekLength() {
			if (this.ops[this.index]) return Op_1.default.length(this.ops[this.index]) - this.offset;
			else return Infinity;
		}
		peekType() {
			const op = this.ops[this.index];
			if (op) if (typeof op.delete === "number") return "delete";
			else if (typeof op.retain === "number" || typeof op.retain === "object" && op.retain !== null) return "retain";
			else return "insert";
			return "retain";
		}
		rest() {
			if (!this.hasNext()) return [];
			else if (this.offset === 0) return this.ops.slice(this.index);
			else {
				const offset = this.offset;
				const index = this.index;
				const next = this.next();
				const rest = this.ops.slice(this.index);
				this.offset = offset;
				this.index = index;
				return [next].concat(rest);
			}
		}
	};
	exports.default = Iterator;
}));
//#endregion
//#region ../../node_modules/quill-delta/dist/Delta.js
var require_Delta = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AttributeMap = exports.OpIterator = exports.Op = void 0;
	var diff = require_diff();
	var cloneDeep = require_lodash_clonedeep();
	var isEqual = require_lodash_isequal();
	var AttributeMap_1 = require_AttributeMap();
	exports.AttributeMap = AttributeMap_1.default;
	var Op_1 = require_Op();
	exports.Op = Op_1.default;
	var OpIterator_1 = require_OpIterator();
	exports.OpIterator = OpIterator_1.default;
	var NULL_CHARACTER = String.fromCharCode(0);
	var getEmbedTypeAndData = (a, b) => {
		if (typeof a !== "object" || a === null) throw new Error(`cannot retain a ${typeof a}`);
		if (typeof b !== "object" || b === null) throw new Error(`cannot retain a ${typeof b}`);
		const embedType = Object.keys(a)[0];
		if (!embedType || embedType !== Object.keys(b)[0]) throw new Error(`embed types not matched: ${embedType} != ${Object.keys(b)[0]}`);
		return [
			embedType,
			a[embedType],
			b[embedType]
		];
	};
	var Delta = class Delta {
		constructor(ops) {
			if (Array.isArray(ops)) this.ops = ops;
			else if (ops != null && Array.isArray(ops.ops)) this.ops = ops.ops;
			else this.ops = [];
		}
		static registerEmbed(embedType, handler) {
			this.handlers[embedType] = handler;
		}
		static unregisterEmbed(embedType) {
			delete this.handlers[embedType];
		}
		static getHandler(embedType) {
			const handler = this.handlers[embedType];
			if (!handler) throw new Error(`no handlers for embed type "${embedType}"`);
			return handler;
		}
		insert(arg, attributes) {
			const newOp = {};
			if (typeof arg === "string" && arg.length === 0) return this;
			newOp.insert = arg;
			if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) newOp.attributes = attributes;
			return this.push(newOp);
		}
		delete(length) {
			if (length <= 0) return this;
			return this.push({ delete: length });
		}
		retain(length, attributes) {
			if (typeof length === "number" && length <= 0) return this;
			const newOp = { retain: length };
			if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) newOp.attributes = attributes;
			return this.push(newOp);
		}
		push(newOp) {
			let index = this.ops.length;
			let lastOp = this.ops[index - 1];
			newOp = cloneDeep(newOp);
			if (typeof lastOp === "object") {
				if (typeof newOp.delete === "number" && typeof lastOp.delete === "number") {
					this.ops[index - 1] = { delete: lastOp.delete + newOp.delete };
					return this;
				}
				if (typeof lastOp.delete === "number" && newOp.insert != null) {
					index -= 1;
					lastOp = this.ops[index - 1];
					if (typeof lastOp !== "object") {
						this.ops.unshift(newOp);
						return this;
					}
				}
				if (isEqual(newOp.attributes, lastOp.attributes)) {
					if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
						this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
						if (typeof newOp.attributes === "object") this.ops[index - 1].attributes = newOp.attributes;
						return this;
					} else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
						this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
						if (typeof newOp.attributes === "object") this.ops[index - 1].attributes = newOp.attributes;
						return this;
					}
				}
			}
			if (index === this.ops.length) this.ops.push(newOp);
			else this.ops.splice(index, 0, newOp);
			return this;
		}
		chop() {
			const lastOp = this.ops[this.ops.length - 1];
			if (lastOp && typeof lastOp.retain === "number" && !lastOp.attributes) this.ops.pop();
			return this;
		}
		filter(predicate) {
			return this.ops.filter(predicate);
		}
		forEach(predicate) {
			this.ops.forEach(predicate);
		}
		map(predicate) {
			return this.ops.map(predicate);
		}
		partition(predicate) {
			const passed = [];
			const failed = [];
			this.forEach((op) => {
				(predicate(op) ? passed : failed).push(op);
			});
			return [passed, failed];
		}
		reduce(predicate, initialValue) {
			return this.ops.reduce(predicate, initialValue);
		}
		changeLength() {
			return this.reduce((length, elem) => {
				if (elem.insert) return length + Op_1.default.length(elem);
				else if (elem.delete) return length - elem.delete;
				return length;
			}, 0);
		}
		length() {
			return this.reduce((length, elem) => {
				return length + Op_1.default.length(elem);
			}, 0);
		}
		slice(start = 0, end = Infinity) {
			const ops = [];
			const iter = new OpIterator_1.default(this.ops);
			let index = 0;
			while (index < end && iter.hasNext()) {
				let nextOp;
				if (index < start) nextOp = iter.next(start - index);
				else {
					nextOp = iter.next(end - index);
					ops.push(nextOp);
				}
				index += Op_1.default.length(nextOp);
			}
			return new Delta(ops);
		}
		compose(other) {
			const thisIter = new OpIterator_1.default(this.ops);
			const otherIter = new OpIterator_1.default(other.ops);
			const ops = [];
			const firstOther = otherIter.peek();
			if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
				let firstLeft = firstOther.retain;
				while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
					firstLeft -= thisIter.peekLength();
					ops.push(thisIter.next());
				}
				if (firstOther.retain - firstLeft > 0) otherIter.next(firstOther.retain - firstLeft);
			}
			const delta = new Delta(ops);
			while (thisIter.hasNext() || otherIter.hasNext()) if (otherIter.peekType() === "insert") delta.push(otherIter.next());
			else if (thisIter.peekType() === "delete") delta.push(thisIter.next());
			else {
				const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
				const thisOp = thisIter.next(length);
				const otherOp = otherIter.next(length);
				if (otherOp.retain) {
					const newOp = {};
					if (typeof thisOp.retain === "number") newOp.retain = typeof otherOp.retain === "number" ? length : otherOp.retain;
					else if (typeof otherOp.retain === "number") if (thisOp.retain == null) newOp.insert = thisOp.insert;
					else newOp.retain = thisOp.retain;
					else {
						const action = thisOp.retain == null ? "insert" : "retain";
						const [embedType, thisData, otherData] = getEmbedTypeAndData(thisOp[action], otherOp.retain);
						const handler = Delta.getHandler(embedType);
						newOp[action] = { [embedType]: handler.compose(thisData, otherData, action === "retain") };
					}
					const attributes = AttributeMap_1.default.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
					if (attributes) newOp.attributes = attributes;
					delta.push(newOp);
					if (!otherIter.hasNext() && isEqual(delta.ops[delta.ops.length - 1], newOp)) {
						const rest = new Delta(thisIter.rest());
						return delta.concat(rest).chop();
					}
				} else if (typeof otherOp.delete === "number" && (typeof thisOp.retain === "number" || typeof thisOp.retain === "object" && thisOp.retain !== null)) delta.push(otherOp);
			}
			return delta.chop();
		}
		concat(other) {
			const delta = new Delta(this.ops.slice());
			if (other.ops.length > 0) {
				delta.push(other.ops[0]);
				delta.ops = delta.ops.concat(other.ops.slice(1));
			}
			return delta;
		}
		diff(other, cursor) {
			if (this.ops === other.ops) return new Delta();
			const strings = [this, other].map((delta) => {
				return delta.map((op) => {
					if (op.insert != null) return typeof op.insert === "string" ? op.insert : NULL_CHARACTER;
					throw new Error("diff() called " + (delta === other ? "on" : "with") + " non-document");
				}).join("");
			});
			const retDelta = new Delta();
			const diffResult = diff(strings[0], strings[1], cursor, true);
			const thisIter = new OpIterator_1.default(this.ops);
			const otherIter = new OpIterator_1.default(other.ops);
			diffResult.forEach((component) => {
				let length = component[1].length;
				while (length > 0) {
					let opLength = 0;
					switch (component[0]) {
						case diff.INSERT:
							opLength = Math.min(otherIter.peekLength(), length);
							retDelta.push(otherIter.next(opLength));
							break;
						case diff.DELETE:
							opLength = Math.min(length, thisIter.peekLength());
							thisIter.next(opLength);
							retDelta.delete(opLength);
							break;
						case diff.EQUAL:
							opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
							const thisOp = thisIter.next(opLength);
							const otherOp = otherIter.next(opLength);
							if (isEqual(thisOp.insert, otherOp.insert)) retDelta.retain(opLength, AttributeMap_1.default.diff(thisOp.attributes, otherOp.attributes));
							else retDelta.push(otherOp).delete(opLength);
							break;
					}
					length -= opLength;
				}
			});
			return retDelta.chop();
		}
		eachLine(predicate, newline = "\n") {
			const iter = new OpIterator_1.default(this.ops);
			let line = new Delta();
			let i = 0;
			while (iter.hasNext()) {
				if (iter.peekType() !== "insert") return;
				const thisOp = iter.peek();
				const start = Op_1.default.length(thisOp) - iter.peekLength();
				const index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
				if (index < 0) line.push(iter.next());
				else if (index > 0) line.push(iter.next(index));
				else {
					if (predicate(line, iter.next(1).attributes || {}, i) === false) return;
					i += 1;
					line = new Delta();
				}
			}
			if (line.length() > 0) predicate(line, {}, i);
		}
		invert(base) {
			const inverted = new Delta();
			this.reduce((baseIndex, op) => {
				if (op.insert) inverted.delete(Op_1.default.length(op));
				else if (typeof op.retain === "number" && op.attributes == null) {
					inverted.retain(op.retain);
					return baseIndex + op.retain;
				} else if (op.delete || typeof op.retain === "number") {
					const length = op.delete || op.retain;
					base.slice(baseIndex, baseIndex + length).forEach((baseOp) => {
						if (op.delete) inverted.push(baseOp);
						else if (op.retain && op.attributes) inverted.retain(Op_1.default.length(baseOp), AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
					});
					return baseIndex + length;
				} else if (typeof op.retain === "object" && op.retain !== null) {
					const slice = base.slice(baseIndex, baseIndex + 1);
					const baseOp = new OpIterator_1.default(slice.ops).next();
					const [embedType, opData, baseOpData] = getEmbedTypeAndData(op.retain, baseOp.insert);
					const handler = Delta.getHandler(embedType);
					inverted.retain({ [embedType]: handler.invert(opData, baseOpData) }, AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
					return baseIndex + 1;
				}
				return baseIndex;
			}, 0);
			return inverted.chop();
		}
		transform(arg, priority = false) {
			priority = !!priority;
			if (typeof arg === "number") return this.transformPosition(arg, priority);
			const other = arg;
			const thisIter = new OpIterator_1.default(this.ops);
			const otherIter = new OpIterator_1.default(other.ops);
			const delta = new Delta();
			while (thisIter.hasNext() || otherIter.hasNext()) if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) delta.retain(Op_1.default.length(thisIter.next()));
			else if (otherIter.peekType() === "insert") delta.push(otherIter.next());
			else {
				const length = Math.min(thisIter.peekLength(), otherIter.peekLength());
				const thisOp = thisIter.next(length);
				const otherOp = otherIter.next(length);
				if (thisOp.delete) continue;
				else if (otherOp.delete) delta.push(otherOp);
				else {
					const thisData = thisOp.retain;
					const otherData = otherOp.retain;
					let transformedData = typeof otherData === "object" && otherData !== null ? otherData : length;
					if (typeof thisData === "object" && thisData !== null && typeof otherData === "object" && otherData !== null) {
						const embedType = Object.keys(thisData)[0];
						if (embedType === Object.keys(otherData)[0]) {
							const handler = Delta.getHandler(embedType);
							if (handler) transformedData = { [embedType]: handler.transform(thisData[embedType], otherData[embedType], priority) };
						}
					}
					delta.retain(transformedData, AttributeMap_1.default.transform(thisOp.attributes, otherOp.attributes, priority));
				}
			}
			return delta.chop();
		}
		transformPosition(index, priority = false) {
			priority = !!priority;
			const thisIter = new OpIterator_1.default(this.ops);
			let offset = 0;
			while (thisIter.hasNext() && offset <= index) {
				const length = thisIter.peekLength();
				const nextType = thisIter.peekType();
				thisIter.next();
				if (nextType === "delete") {
					index -= Math.min(length, index - offset);
					continue;
				} else if (nextType === "insert" && (offset < index || !priority)) index += length;
				offset += length;
			}
			return index;
		}
	};
	Delta.Op = Op_1.default;
	Delta.OpIterator = OpIterator_1.default;
	Delta.AttributeMap = AttributeMap_1.default;
	Delta.handlers = {};
	exports.default = Delta;
	if (typeof module === "object") {
		module.exports = Delta;
		module.exports.default = Delta;
	}
}));
//#endregion
//#region ../../node_modules/quill/blots/break.js
var require_break = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var Break = class extends _parchment.EmbedBlot {
		static value() {}
		optimize() {
			if (this.prev || this.next) this.remove();
		}
		length() {
			return 0;
		}
		value() {
			return "";
		}
	};
	Break.blotName = "break";
	Break.tagName = "BR";
	exports.default = Break;
}));
//#endregion
//#region ../../node_modules/quill/blots/text.js
var require_text = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.escapeText = escapeText;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var Text = class extends _parchment.TextBlot {};
	exports.default = Text;
	function escapeText(text) {
		return text.replace(/[&<>"']/g, (s) => {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				"\"": "&quot;",
				"'": "&#39;"
			}[s];
		});
	}
}));
//#endregion
//#region ../../node_modules/quill/blots/inline.js
var require_inline = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _break = _interopRequireDefault(require_break());
	var _text = _interopRequireDefault(require_text());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = class Inline extends _parchment.InlineBlot {
		static allowedChildren = [
			Inline,
			_break.default,
			_parchment.EmbedBlot,
			_text.default
		];
		static order = [
			"cursor",
			"inline",
			"link",
			"underline",
			"strike",
			"italic",
			"bold",
			"script",
			"code"
		];
		static compare(self, other) {
			const selfIndex = Inline.order.indexOf(self);
			const otherIndex = Inline.order.indexOf(other);
			if (selfIndex >= 0 || otherIndex >= 0) return selfIndex - otherIndex;
			if (self === other) return 0;
			if (self < other) return -1;
			return 1;
		}
		formatAt(index, length, name, value) {
			if (Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, _parchment.Scope.BLOT)) {
				const blot = this.isolate(index, length);
				if (value) blot.wrap(name, value);
			} else super.formatAt(index, length, name, value);
		}
		optimize(context) {
			super.optimize(context);
			if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
				const parent = this.parent.isolate(this.offset(), this.length());
				this.moveChildren(parent);
				parent.wrap(this);
			}
		}
	};
}));
//#endregion
//#region ../../node_modules/quill/blots/block.js
var require_block = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BlockEmbed = void 0;
	exports.blockDelta = blockDelta;
	exports.bubbleFormats = bubbleFormats;
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _break = _interopRequireDefault(require_break());
	var _inline = _interopRequireDefault(require_inline());
	var _text = _interopRequireDefault(require_text());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var NEWLINE_LENGTH = 1;
	var Block = class extends _parchment.BlockBlot {
		cache = {};
		delta() {
			if (this.cache.delta == null) this.cache.delta = blockDelta(this);
			return this.cache.delta;
		}
		deleteAt(index, length) {
			super.deleteAt(index, length);
			this.cache = {};
		}
		formatAt(index, length, name, value) {
			if (length <= 0) return;
			if (this.scroll.query(name, _parchment.Scope.BLOCK)) {
				if (index + length === this.length()) this.format(name, value);
			} else super.formatAt(index, Math.min(length, this.length() - index - 1), name, value);
			this.cache = {};
		}
		insertAt(index, value, def) {
			if (def != null) {
				super.insertAt(index, value, def);
				this.cache = {};
				return;
			}
			if (value.length === 0) return;
			const lines = value.split("\n");
			const text = lines.shift();
			if (text.length > 0) {
				if (index < this.length() - 1 || this.children.tail == null) super.insertAt(Math.min(index, this.length() - 1), text);
				else this.children.tail.insertAt(this.children.tail.length(), text);
				this.cache = {};
			}
			let block = this;
			lines.reduce((lineIndex, line) => {
				block = block.split(lineIndex, true);
				block.insertAt(0, line);
				return line.length;
			}, index + text.length);
		}
		insertBefore(blot, ref) {
			const { head } = this.children;
			super.insertBefore(blot, ref);
			if (head instanceof _break.default) head.remove();
			this.cache = {};
		}
		length() {
			if (this.cache.length == null) this.cache.length = super.length() + NEWLINE_LENGTH;
			return this.cache.length;
		}
		moveChildren(target, ref) {
			super.moveChildren(target, ref);
			this.cache = {};
		}
		optimize(context) {
			super.optimize(context);
			this.cache = {};
		}
		path(index) {
			return super.path(index, true);
		}
		removeChild(child) {
			super.removeChild(child);
			this.cache = {};
		}
		split(index) {
			let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
				const clone = this.clone();
				if (index === 0) {
					this.parent.insertBefore(clone, this);
					return this;
				}
				this.parent.insertBefore(clone, this.next);
				return clone;
			}
			const next = super.split(index, force);
			this.cache = {};
			return next;
		}
	};
	exports.default = Block;
	Block.blotName = "block";
	Block.tagName = "P";
	Block.defaultChild = _break.default;
	Block.allowedChildren = [
		_break.default,
		_inline.default,
		_parchment.EmbedBlot,
		_text.default
	];
	var BlockEmbed = class extends _parchment.EmbedBlot {
		attach() {
			super.attach();
			this.attributes = new _parchment.AttributorStore(this.domNode);
		}
		delta() {
			return new _quillDelta.default().insert(this.value(), {
				...this.formats(),
				...this.attributes.values()
			});
		}
		format(name, value) {
			const attribute = this.scroll.query(name, _parchment.Scope.BLOCK_ATTRIBUTE);
			if (attribute != null) this.attributes.attribute(attribute, value);
		}
		formatAt(index, length, name, value) {
			this.format(name, value);
		}
		insertAt(index, value, def) {
			if (def != null) {
				super.insertAt(index, value, def);
				return;
			}
			const lines = value.split("\n");
			const text = lines.pop();
			const blocks = lines.map((line) => {
				const block = this.scroll.create(Block.blotName);
				block.insertAt(0, line);
				return block;
			});
			const ref = this.split(index);
			blocks.forEach((block) => {
				this.parent.insertBefore(block, ref);
			});
			if (text) this.parent.insertBefore(this.scroll.create("text", text), ref);
		}
	};
	exports.BlockEmbed = BlockEmbed;
	BlockEmbed.scope = _parchment.Scope.BLOCK_BLOT;
	function blockDelta(blot) {
		let filter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
		return blot.descendants(_parchment.LeafBlot).reduce((delta, leaf) => {
			if (leaf.length() === 0) return delta;
			return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
		}, new _quillDelta.default()).insert("\n", bubbleFormats(blot));
	}
	function bubbleFormats(blot) {
		let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let filter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
		if (blot == null) return formats;
		if ("formats" in blot && typeof blot.formats === "function") {
			formats = {
				...formats,
				...blot.formats()
			};
			if (filter) delete formats["code-token"];
		}
		if (blot.parent == null || blot.parent.statics.blotName === "scroll" || blot.parent.statics.scope !== blot.statics.scope) return formats;
		return bubbleFormats(blot.parent, formats, filter);
	}
}));
//#endregion
//#region ../../node_modules/quill/blots/cursor.js
var require_cursor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _text = _interopRequireDefault(require_text());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = class Cursor extends _parchment.EmbedBlot {
		static blotName = "cursor";
		static className = "ql-cursor";
		static tagName = "span";
		static CONTENTS = "﻿";
		static value() {}
		constructor(scroll, domNode, selection) {
			super(scroll, domNode);
			this.selection = selection;
			this.textNode = document.createTextNode(Cursor.CONTENTS);
			this.domNode.appendChild(this.textNode);
			this.savedLength = 0;
		}
		detach() {
			if (this.parent != null) this.parent.removeChild(this);
		}
		format(name, value) {
			if (this.savedLength !== 0) {
				super.format(name, value);
				return;
			}
			let target = this;
			let index = 0;
			while (target != null && target.statics.scope !== _parchment.Scope.BLOCK_BLOT) {
				index += target.offset(target.parent);
				target = target.parent;
			}
			if (target != null) {
				this.savedLength = Cursor.CONTENTS.length;
				target.optimize();
				target.formatAt(index, Cursor.CONTENTS.length, name, value);
				this.savedLength = 0;
			}
		}
		index(node, offset) {
			if (node === this.textNode) return 0;
			return super.index(node, offset);
		}
		length() {
			return this.savedLength;
		}
		position() {
			return [this.textNode, this.textNode.data.length];
		}
		remove() {
			super.remove();
			this.parent = null;
		}
		restore() {
			if (this.selection.composing || this.parent == null) return null;
			const range = this.selection.getNativeRange();
			while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
			const prevTextBlot = this.prev instanceof _text.default ? this.prev : null;
			const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
			const nextTextBlot = this.next instanceof _text.default ? this.next : null;
			const nextText = nextTextBlot ? nextTextBlot.text : "";
			const { textNode } = this;
			const newText = textNode.data.split(Cursor.CONTENTS).join("");
			textNode.data = Cursor.CONTENTS;
			let mergedTextBlot;
			if (prevTextBlot) {
				mergedTextBlot = prevTextBlot;
				if (newText || nextTextBlot) {
					prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
					if (nextTextBlot) nextTextBlot.remove();
				}
			} else if (nextTextBlot) {
				mergedTextBlot = nextTextBlot;
				nextTextBlot.insertAt(0, newText);
			} else {
				const newTextNode = document.createTextNode(newText);
				mergedTextBlot = this.scroll.create(newTextNode);
				this.parent.insertBefore(mergedTextBlot, this);
			}
			this.remove();
			if (range) {
				const remapOffset = (node, offset) => {
					if (prevTextBlot && node === prevTextBlot.domNode) return offset;
					if (node === textNode) return prevTextLength + offset - 1;
					if (nextTextBlot && node === nextTextBlot.domNode) return prevTextLength + newText.length + offset;
					return null;
				};
				const start = remapOffset(range.start.node, range.start.offset);
				const end = remapOffset(range.end.node, range.end.offset);
				if (start !== null && end !== null) return {
					startNode: mergedTextBlot.domNode,
					startOffset: start,
					endNode: mergedTextBlot.domNode,
					endOffset: end
				};
			}
			return null;
		}
		update(mutations, context) {
			if (mutations.some((mutation) => {
				return mutation.type === "characterData" && mutation.target === this.textNode;
			})) {
				const range = this.restore();
				if (range) context.range = range;
			}
		}
		optimize(context) {
			super.optimize(context);
			let { parent } = this;
			while (parent) {
				if (parent.domNode.tagName === "A") {
					this.savedLength = Cursor.CONTENTS.length;
					parent.isolate(this.offset(parent), this.length()).unwrap();
					this.savedLength = 0;
					break;
				}
				parent = parent.parent;
			}
		}
		value() {
			return "";
		}
	};
}));
//#endregion
//#region ../../node_modules/eventemitter3/index.js
var require_eventemitter3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty, prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
}));
//#endregion
//#region ../../node_modules/quill/core/instances.js
var require_instances = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = /* @__PURE__ */ new WeakMap();
}));
//#endregion
//#region ../../node_modules/quill/core/logger.js
var require_logger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var levels = [
		"error",
		"warn",
		"log",
		"info"
	];
	var level = "warn";
	function debug(method) {
		if (level) {
			if (levels.indexOf(method) <= levels.indexOf(level)) {
				for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
				console[method](...args);
			}
		}
	}
	function namespace(ns) {
		return levels.reduce((logger, method) => {
			logger[method] = debug.bind(console, method, ns);
			return logger;
		}, {});
	}
	namespace.level = (newLevel) => {
		level = newLevel;
	};
	debug.level = namespace.level;
	exports.default = namespace;
}));
//#endregion
//#region ../../node_modules/quill/core/emitter.js
var require_emitter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _eventemitter = _interopRequireDefault(require_eventemitter3());
	var _instances = _interopRequireDefault(require_instances());
	var _logger = _interopRequireDefault(require_logger());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var debug = (0, _logger.default)("quill:events");
	[
		"selectionchange",
		"mousedown",
		"mouseup",
		"click"
	].forEach((eventName) => {
		document.addEventListener(eventName, function() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			Array.from(document.querySelectorAll(".ql-container")).forEach((node) => {
				const quill = _instances.default.get(node);
				if (quill && quill.emitter) quill.emitter.handleDOM(...args);
			});
		});
	});
	var Emitter = class extends _eventemitter.default {
		static events = {
			EDITOR_CHANGE: "editor-change",
			SCROLL_BEFORE_UPDATE: "scroll-before-update",
			SCROLL_BLOT_MOUNT: "scroll-blot-mount",
			SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
			SCROLL_OPTIMIZE: "scroll-optimize",
			SCROLL_UPDATE: "scroll-update",
			SCROLL_EMBED_UPDATE: "scroll-embed-update",
			SELECTION_CHANGE: "selection-change",
			TEXT_CHANGE: "text-change",
			COMPOSITION_BEFORE_START: "composition-before-start",
			COMPOSITION_START: "composition-start",
			COMPOSITION_BEFORE_END: "composition-before-end",
			COMPOSITION_END: "composition-end"
		};
		static sources = {
			API: "api",
			SILENT: "silent",
			USER: "user"
		};
		constructor() {
			super();
			this.domListeners = {};
			this.on("error", debug.error);
		}
		emit() {
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
			debug.log.call(debug, ...args);
			return super.emit(...args);
		}
		handleDOM(event) {
			for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
			(this.domListeners[event.type] || []).forEach((_ref) => {
				let { node, handler } = _ref;
				if (event.target === node || node.contains(event.target)) handler(event, ...args);
			});
		}
		listenDOM(eventName, node, handler) {
			if (!this.domListeners[eventName]) this.domListeners[eventName] = [];
			this.domListeners[eventName].push({
				node,
				handler
			});
		}
	};
	exports.default = Emitter;
}));
//#endregion
//#region ../../node_modules/quill/core/selection.js
var require_selection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.Range = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _emitter = _interopRequireDefault(require_emitter());
	var _logger = _interopRequireDefault(require_logger());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var debug = (0, _logger.default)("quill:selection");
	var Range = class {
		constructor(index) {
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			this.index = index;
			this.length = length;
		}
	};
	exports.Range = Range;
	var Selection = class {
		constructor(scroll, emitter) {
			this.emitter = emitter;
			this.scroll = scroll;
			this.composing = false;
			this.mouseDown = false;
			this.root = this.scroll.domNode;
			this.cursor = this.scroll.create("cursor", this);
			this.savedRange = new Range(0, 0);
			this.lastRange = this.savedRange;
			this.lastNative = null;
			this.handleComposition();
			this.handleDragging();
			this.emitter.listenDOM("selectionchange", document, () => {
				if (!this.mouseDown && !this.composing) setTimeout(this.update.bind(this, _emitter.default.sources.USER), 1);
			});
			this.emitter.on(_emitter.default.events.SCROLL_BEFORE_UPDATE, () => {
				if (!this.hasFocus()) return;
				const native = this.getNativeRange();
				if (native == null) return;
				if (native.start.node === this.cursor.textNode) return;
				this.emitter.once(_emitter.default.events.SCROLL_UPDATE, (source, mutations) => {
					try {
						if (this.root.contains(native.start.node) && this.root.contains(native.end.node)) this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
						const triggeredByTyping = mutations.some((mutation) => mutation.type === "characterData" || mutation.type === "childList" || mutation.type === "attributes" && mutation.target === this.root);
						this.update(triggeredByTyping ? _emitter.default.sources.SILENT : source);
					} catch (ignored) {}
				});
			});
			this.emitter.on(_emitter.default.events.SCROLL_OPTIMIZE, (mutations, context) => {
				if (context.range) {
					const { startNode, startOffset, endNode, endOffset } = context.range;
					this.setNativeRange(startNode, startOffset, endNode, endOffset);
					this.update(_emitter.default.sources.SILENT);
				}
			});
			this.update(_emitter.default.sources.SILENT);
		}
		handleComposition() {
			this.emitter.on(_emitter.default.events.COMPOSITION_BEFORE_START, () => {
				this.composing = true;
			});
			this.emitter.on(_emitter.default.events.COMPOSITION_END, () => {
				this.composing = false;
				if (this.cursor.parent) {
					const range = this.cursor.restore();
					if (!range) return;
					setTimeout(() => {
						this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
					}, 1);
				}
			});
		}
		handleDragging() {
			this.emitter.listenDOM("mousedown", document.body, () => {
				this.mouseDown = true;
			});
			this.emitter.listenDOM("mouseup", document.body, () => {
				this.mouseDown = false;
				this.update(_emitter.default.sources.USER);
			});
		}
		focus() {
			if (this.hasFocus()) return;
			this.root.focus({ preventScroll: true });
			this.setRange(this.savedRange);
		}
		format(format, value) {
			this.scroll.update();
			const nativeRange = this.getNativeRange();
			if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(format, _parchment.Scope.BLOCK)) return;
			if (nativeRange.start.node !== this.cursor.textNode) {
				const blot = this.scroll.find(nativeRange.start.node, false);
				if (blot == null) return;
				if (blot instanceof _parchment.LeafBlot) {
					const after = blot.split(nativeRange.start.offset);
					blot.parent.insertBefore(this.cursor, after);
				} else blot.insertBefore(this.cursor, nativeRange.start.node);
				this.cursor.attach();
			}
			this.cursor.format(format, value);
			this.scroll.optimize();
			this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
			this.update();
		}
		getBounds(index) {
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			const scrollLength = this.scroll.length();
			index = Math.min(index, scrollLength - 1);
			length = Math.min(index + length, scrollLength - 1) - index;
			let node;
			let [leaf, offset] = this.scroll.leaf(index);
			if (leaf == null) return null;
			[node, offset] = leaf.position(offset, true);
			const range = document.createRange();
			if (length > 0) {
				range.setStart(node, offset);
				[leaf, offset] = this.scroll.leaf(index + length);
				if (leaf == null) return null;
				[node, offset] = leaf.position(offset, true);
				range.setEnd(node, offset);
				return range.getBoundingClientRect();
			}
			let side = "left";
			let rect;
			if (node instanceof Text) {
				if (!node.data.length) return null;
				if (offset < node.data.length) {
					range.setStart(node, offset);
					range.setEnd(node, offset + 1);
				} else {
					range.setStart(node, offset - 1);
					range.setEnd(node, offset);
					side = "right";
				}
				rect = range.getBoundingClientRect();
			} else {
				if (!(leaf.domNode instanceof Element)) return null;
				rect = leaf.domNode.getBoundingClientRect();
				if (offset > 0) side = "right";
			}
			return {
				bottom: rect.top + rect.height,
				height: rect.height,
				left: rect[side],
				right: rect[side],
				top: rect.top,
				width: 0
			};
		}
		getNativeRange() {
			const selection = document.getSelection();
			if (selection == null || selection.rangeCount <= 0) return null;
			const nativeRange = selection.getRangeAt(0);
			if (nativeRange == null) return null;
			const range = this.normalizeNative(nativeRange);
			debug.info("getNativeRange", range);
			return range;
		}
		getRange() {
			const root = this.scroll.domNode;
			if ("isConnected" in root && !root.isConnected) return [null, null];
			const normalized = this.getNativeRange();
			if (normalized == null) return [null, null];
			return [this.normalizedToRange(normalized), normalized];
		}
		hasFocus() {
			return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
		}
		normalizedToRange(range) {
			const positions = [[range.start.node, range.start.offset]];
			if (!range.native.collapsed) positions.push([range.end.node, range.end.offset]);
			const indexes = positions.map((position) => {
				const [node, offset] = position;
				const blot = this.scroll.find(node, true);
				const index = blot.offset(this.scroll);
				if (offset === 0) return index;
				if (blot instanceof _parchment.LeafBlot) return index + blot.index(node, offset);
				return index + blot.length();
			});
			const end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
			const start = Math.min(end, ...indexes);
			return new Range(start, end - start);
		}
		normalizeNative(nativeRange) {
			if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) return null;
			const range = {
				start: {
					node: nativeRange.startContainer,
					offset: nativeRange.startOffset
				},
				end: {
					node: nativeRange.endContainer,
					offset: nativeRange.endOffset
				},
				native: nativeRange
			};
			[range.start, range.end].forEach((position) => {
				let { node, offset } = position;
				while (!(node instanceof Text) && node.childNodes.length > 0) if (node.childNodes.length > offset) {
					node = node.childNodes[offset];
					offset = 0;
				} else if (node.childNodes.length === offset) {
					node = node.lastChild;
					if (node instanceof Text) offset = node.data.length;
					else if (node.childNodes.length > 0) offset = node.childNodes.length;
					else offset = node.childNodes.length + 1;
				} else break;
				position.node = node;
				position.offset = offset;
			});
			return range;
		}
		rangeToNative(range) {
			const scrollLength = this.scroll.length();
			const getPosition = (index, inclusive) => {
				index = Math.min(scrollLength - 1, index);
				const [leaf, leafOffset] = this.scroll.leaf(index);
				return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
			};
			return [...getPosition(range.index, false), ...getPosition(range.index + range.length, true)];
		}
		setNativeRange(startNode, startOffset) {
			let endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
			let endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
			let force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
			debug.info("setNativeRange", startNode, startOffset, endNode, endOffset);
			if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) return;
			const selection = document.getSelection();
			if (selection == null) return;
			if (startNode != null) {
				if (!this.hasFocus()) this.root.focus({ preventScroll: true });
				const { native } = this.getNativeRange() || {};
				if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
					if (startNode instanceof Element && startNode.tagName === "BR") {
						startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
						startNode = startNode.parentNode;
					}
					if (endNode instanceof Element && endNode.tagName === "BR") {
						endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
						endNode = endNode.parentNode;
					}
					const range = document.createRange();
					range.setStart(startNode, startOffset);
					range.setEnd(endNode, endOffset);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			} else {
				selection.removeAllRanges();
				this.root.blur();
			}
		}
		setRange(range) {
			let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter.default.sources.API;
			if (typeof force === "string") {
				source = force;
				force = false;
			}
			debug.info("setRange", range);
			if (range != null) {
				const args = this.rangeToNative(range);
				this.setNativeRange(...args, force);
			} else this.setNativeRange(null);
			this.update(source);
		}
		update() {
			let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter.default.sources.USER;
			const oldRange = this.lastRange;
			const [lastRange, nativeRange] = this.getRange();
			this.lastRange = lastRange;
			this.lastNative = nativeRange;
			if (this.lastRange != null) this.savedRange = this.lastRange;
			if (!(0, _lodashEs.isEqual)(oldRange, this.lastRange)) {
				if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
					const range = this.cursor.restore();
					if (range) this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
				}
				const args = [
					_emitter.default.events.SELECTION_CHANGE,
					(0, _lodashEs.cloneDeep)(this.lastRange),
					(0, _lodashEs.cloneDeep)(oldRange),
					source
				];
				this.emitter.emit(_emitter.default.events.EDITOR_CHANGE, ...args);
				if (source !== _emitter.default.sources.SILENT) this.emitter.emit(...args);
			}
		}
	};
	exports.default = Selection;
	function contains(parent, descendant) {
		try {
			descendant.parentNode;
		} catch (e) {
			return false;
		}
		return parent.contains(descendant);
	}
}));
//#endregion
//#region ../../node_modules/quill/core/editor.js
var require_editor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quillDelta = _interopRequireWildcard(require_Delta());
	var _block = _interopRequireWildcard(require_block());
	var _break = _interopRequireDefault(require_break());
	var _cursor = _interopRequireDefault(require_cursor());
	var _text = _interopRequireWildcard(require_text());
	var _selection = require_selection();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	var ASCII = /^[ -~]*$/;
	var Editor = class {
		constructor(scroll) {
			this.scroll = scroll;
			this.delta = this.getDelta();
		}
		applyDelta(delta) {
			this.scroll.update();
			let scrollLength = this.scroll.length();
			this.scroll.batchStart();
			const normalizedDelta = normalizeDelta(delta);
			const deleteDelta = new _quillDelta.default();
			splitOpLines(normalizedDelta.ops.slice()).reduce((index, op) => {
				const length = _quillDelta.Op.length(op);
				let attributes = op.attributes || {};
				let isImplicitNewlinePrepended = false;
				let isImplicitNewlineAppended = false;
				if (op.insert != null) {
					deleteDelta.retain(length);
					if (typeof op.insert === "string") {
						const text = op.insert;
						isImplicitNewlineAppended = !text.endsWith("\n") && (scrollLength <= index || !!this.scroll.descendant(_block.BlockEmbed, index)[0]);
						this.scroll.insertAt(index, text);
						const [line, offset] = this.scroll.line(index);
						let formats = (0, _lodashEs.merge)({}, (0, _block.bubbleFormats)(line));
						if (line instanceof _block.default) {
							const [leaf] = line.descendant(_parchment.LeafBlot, offset);
							if (leaf) formats = (0, _lodashEs.merge)(formats, (0, _block.bubbleFormats)(leaf));
						}
						attributes = _quillDelta.AttributeMap.diff(formats, attributes) || {};
					} else if (typeof op.insert === "object") {
						const key = Object.keys(op.insert)[0];
						if (key == null) return index;
						const isInlineEmbed = this.scroll.query(key, _parchment.Scope.INLINE) != null;
						if (isInlineEmbed) {
							if (scrollLength <= index || !!this.scroll.descendant(_block.BlockEmbed, index)[0]) isImplicitNewlineAppended = true;
						} else if (index > 0) {
							const [leaf, offset] = this.scroll.descendant(_parchment.LeafBlot, index - 1);
							if (leaf instanceof _text.default) {
								if (leaf.value()[offset] !== "\n") isImplicitNewlinePrepended = true;
							} else if (leaf instanceof _parchment.EmbedBlot && leaf.statics.scope === _parchment.Scope.INLINE_BLOT) isImplicitNewlinePrepended = true;
						}
						this.scroll.insertAt(index, key, op.insert[key]);
						if (isInlineEmbed) {
							const [leaf] = this.scroll.descendant(_parchment.LeafBlot, index);
							if (leaf) {
								const formats = (0, _lodashEs.merge)({}, (0, _block.bubbleFormats)(leaf));
								attributes = _quillDelta.AttributeMap.diff(formats, attributes) || {};
							}
						}
					}
					scrollLength += length;
				} else {
					deleteDelta.push(op);
					if (op.retain !== null && typeof op.retain === "object") {
						const key = Object.keys(op.retain)[0];
						if (key == null) return index;
						this.scroll.updateEmbedAt(index, key, op.retain[key]);
					}
				}
				Object.keys(attributes).forEach((name) => {
					this.scroll.formatAt(index, length, name, attributes[name]);
				});
				const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
				const addedLength = isImplicitNewlineAppended ? 1 : 0;
				scrollLength += prependedLength + addedLength;
				deleteDelta.retain(prependedLength);
				deleteDelta.delete(addedLength);
				return index + length + prependedLength + addedLength;
			}, 0);
			deleteDelta.reduce((index, op) => {
				if (typeof op.delete === "number") {
					this.scroll.deleteAt(index, op.delete);
					return index;
				}
				return index + _quillDelta.Op.length(op);
			}, 0);
			this.scroll.batchEnd();
			this.scroll.optimize();
			return this.update(normalizedDelta);
		}
		deleteText(index, length) {
			this.scroll.deleteAt(index, length);
			return this.update(new _quillDelta.default().retain(index).delete(length));
		}
		formatLine(index, length) {
			let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			this.scroll.update();
			Object.keys(formats).forEach((format) => {
				this.scroll.lines(index, Math.max(length, 1)).forEach((line) => {
					line.format(format, formats[format]);
				});
			});
			this.scroll.optimize();
			const delta = new _quillDelta.default().retain(index).retain(length, (0, _lodashEs.cloneDeep)(formats));
			return this.update(delta);
		}
		formatText(index, length) {
			let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			Object.keys(formats).forEach((format) => {
				this.scroll.formatAt(index, length, format, formats[format]);
			});
			const delta = new _quillDelta.default().retain(index).retain(length, (0, _lodashEs.cloneDeep)(formats));
			return this.update(delta);
		}
		getContents(index, length) {
			return this.delta.slice(index, index + length);
		}
		getDelta() {
			return this.scroll.lines().reduce((delta, line) => {
				return delta.concat(line.delta());
			}, new _quillDelta.default());
		}
		getFormat(index) {
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			let lines = [];
			let leaves = [];
			if (length === 0) this.scroll.path(index).forEach((path) => {
				const [blot] = path;
				if (blot instanceof _block.default) lines.push(blot);
				else if (blot instanceof _parchment.LeafBlot) leaves.push(blot);
			});
			else {
				lines = this.scroll.lines(index, length);
				leaves = this.scroll.descendants(_parchment.LeafBlot, index, length);
			}
			const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
				const blot = blots.shift();
				if (blot == null) return {};
				let formats = (0, _block.bubbleFormats)(blot);
				while (Object.keys(formats).length > 0) {
					const blot = blots.shift();
					if (blot == null) return formats;
					formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
				}
				return formats;
			});
			return {
				...lineFormats,
				...leafFormats
			};
		}
		getHTML(index, length) {
			const [line, lineOffset] = this.scroll.line(index);
			if (line) {
				const lineLength = line.length();
				if (line.length() >= lineOffset + length) return convertHTML(line, lineOffset, length, !(lineOffset === 0 && length === lineLength));
				return convertHTML(this.scroll, index, length, true);
			}
			return "";
		}
		getText(index, length) {
			return this.getContents(index, length).filter((op) => typeof op.insert === "string").map((op) => op.insert).join("");
		}
		insertContents(index, contents) {
			const normalizedDelta = normalizeDelta(contents);
			const change = new _quillDelta.default().retain(index).concat(normalizedDelta);
			this.scroll.insertContents(index, normalizedDelta);
			return this.update(change);
		}
		insertEmbed(index, embed, value) {
			this.scroll.insertAt(index, embed, value);
			return this.update(new _quillDelta.default().retain(index).insert({ [embed]: value }));
		}
		insertText(index, text) {
			let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			this.scroll.insertAt(index, text);
			Object.keys(formats).forEach((format) => {
				this.scroll.formatAt(index, text.length, format, formats[format]);
			});
			return this.update(new _quillDelta.default().retain(index).insert(text, (0, _lodashEs.cloneDeep)(formats)));
		}
		isBlank() {
			if (this.scroll.children.length === 0) return true;
			if (this.scroll.children.length > 1) return false;
			const blot = this.scroll.children.head;
			if (blot?.statics.blotName !== _block.default.blotName) return false;
			const block = blot;
			if (block.children.length > 1) return false;
			return block.children.head instanceof _break.default;
		}
		removeFormat(index, length) {
			const text = this.getText(index, length);
			const [line, offset] = this.scroll.line(index + length);
			let suffixLength = 0;
			let suffix = new _quillDelta.default();
			if (line != null) {
				suffixLength = line.length() - offset;
				suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
			}
			const diff = this.getContents(index, length + suffixLength).diff(new _quillDelta.default().insert(text).concat(suffix));
			const delta = new _quillDelta.default().retain(index).concat(diff);
			return this.applyDelta(delta);
		}
		update(change) {
			let mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
			let selectionInfo = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
			const oldDelta = this.delta;
			if (mutations.length === 1 && mutations[0].type === "characterData" && mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
				const textBlot = this.scroll.find(mutations[0].target);
				const formats = (0, _block.bubbleFormats)(textBlot);
				const index = textBlot.offset(this.scroll);
				const oldValue = mutations[0].oldValue.replace(_cursor.default.CONTENTS, "");
				const oldText = new _quillDelta.default().insert(oldValue);
				const newText = new _quillDelta.default().insert(textBlot.value());
				const relativeSelectionInfo = selectionInfo && {
					oldRange: shiftRange(selectionInfo.oldRange, -index),
					newRange: shiftRange(selectionInfo.newRange, -index)
				};
				change = new _quillDelta.default().retain(index).concat(oldText.diff(newText, relativeSelectionInfo)).reduce((delta, op) => {
					if (op.insert) return delta.insert(op.insert, formats);
					return delta.push(op);
				}, new _quillDelta.default());
				this.delta = oldDelta.compose(change);
			} else {
				this.delta = this.getDelta();
				if (!change || !(0, _lodashEs.isEqual)(oldDelta.compose(change), this.delta)) change = oldDelta.diff(this.delta, selectionInfo);
			}
			return change;
		}
	};
	function convertListHTML(items, lastIndent, types) {
		if (items.length === 0) {
			const [endTag] = getListType(types.pop());
			if (lastIndent <= 0) return `</li></${endTag}>`;
			return `</li></${endTag}>${convertListHTML([], lastIndent - 1, types)}`;
		}
		const [{ child, offset, length, indent, type }, ...rest] = items;
		const [tag, attribute] = getListType(type);
		if (indent > lastIndent) {
			types.push(type);
			if (indent === lastIndent + 1) return `<${tag}><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
			return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
		}
		const previousType = types[types.length - 1];
		if (indent === lastIndent && type === previousType) return `</li><li${attribute}>${convertHTML(child, offset, length)}${convertListHTML(rest, indent, types)}`;
		const [endTag] = getListType(types.pop());
		return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
	}
	function convertHTML(blot, index, length) {
		let excludeOuterTag = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
		if ("html" in blot && typeof blot.html === "function") return blot.html(index, length);
		if (blot instanceof _text.default) return (0, _text.escapeText)(blot.value().slice(index, index + length));
		if (blot instanceof _parchment.ParentBlot) {
			if (blot.statics.blotName === "list-container") {
				const items = [];
				blot.children.forEachAt(index, length, (child, offset, childLength) => {
					const formats = "formats" in child && typeof child.formats === "function" ? child.formats() : {};
					items.push({
						child,
						offset,
						length: childLength,
						indent: formats.indent || 0,
						type: formats.list
					});
				});
				return convertListHTML(items, -1, []);
			}
			const parts = [];
			blot.children.forEachAt(index, length, (child, offset, childLength) => {
				parts.push(convertHTML(child, offset, childLength));
			});
			if (excludeOuterTag || blot.statics.blotName === "list") return parts.join("");
			const { outerHTML, innerHTML } = blot.domNode;
			const [start, end] = outerHTML.split(`>${innerHTML}<`);
			if (start === "<table") return `<table style="border: 1px solid #000;">${parts.join("")}<${end}`;
			return `${start}>${parts.join("")}<${end}`;
		}
		return blot.domNode instanceof Element ? blot.domNode.outerHTML : "";
	}
	function combineFormats(formats, combined) {
		return Object.keys(combined).reduce((merged, name) => {
			if (formats[name] == null) return merged;
			const combinedValue = combined[name];
			if (combinedValue === formats[name]) merged[name] = combinedValue;
			else if (Array.isArray(combinedValue)) if (combinedValue.indexOf(formats[name]) < 0) merged[name] = combinedValue.concat([formats[name]]);
			else merged[name] = combinedValue;
			else merged[name] = [combinedValue, formats[name]];
			return merged;
		}, {});
	}
	function getListType(type) {
		const tag = type === "ordered" ? "ol" : "ul";
		switch (type) {
			case "checked": return [tag, " data-list=\"checked\""];
			case "unchecked": return [tag, " data-list=\"unchecked\""];
			default: return [tag, ""];
		}
	}
	function normalizeDelta(delta) {
		return delta.reduce((normalizedDelta, op) => {
			if (typeof op.insert === "string") {
				const text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
				return normalizedDelta.insert(text, op.attributes);
			}
			return normalizedDelta.push(op);
		}, new _quillDelta.default());
	}
	function shiftRange(_ref, amount) {
		let { index, length } = _ref;
		return new _selection.Range(index + amount, length);
	}
	function splitOpLines(ops) {
		const split = [];
		ops.forEach((op) => {
			if (typeof op.insert === "string") op.insert.split("\n").forEach((line, index) => {
				if (index) split.push({
					insert: "\n",
					attributes: op.attributes
				});
				if (line) split.push({
					insert: line,
					attributes: op.attributes
				});
			});
			else split.push(op);
		});
		return split;
	}
	exports.default = Editor;
}));
//#endregion
//#region ../../node_modules/quill/core/module.js
var require_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var Module = class {
		static DEFAULTS = {};
		constructor(quill) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			this.quill = quill;
			this.options = options;
		}
	};
	exports.default = Module;
}));
//#endregion
//#region ../../node_modules/quill/blots/embed.js
var require_embed = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _text = _interopRequireDefault(require_text());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var GUARD_TEXT = "﻿";
	var Embed = class extends _parchment.EmbedBlot {
		constructor(scroll, node) {
			super(scroll, node);
			this.contentNode = document.createElement("span");
			this.contentNode.setAttribute("contenteditable", "false");
			Array.from(this.domNode.childNodes).forEach((childNode) => {
				this.contentNode.appendChild(childNode);
			});
			this.leftGuard = document.createTextNode(GUARD_TEXT);
			this.rightGuard = document.createTextNode(GUARD_TEXT);
			this.domNode.appendChild(this.leftGuard);
			this.domNode.appendChild(this.contentNode);
			this.domNode.appendChild(this.rightGuard);
		}
		index(node, offset) {
			if (node === this.leftGuard) return 0;
			if (node === this.rightGuard) return 1;
			return super.index(node, offset);
		}
		restore(node) {
			let range = null;
			let textNode;
			const text = node.data.split(GUARD_TEXT).join("");
			if (node === this.leftGuard) if (this.prev instanceof _text.default) {
				const prevLength = this.prev.length();
				this.prev.insertAt(prevLength, text);
				range = {
					startNode: this.prev.domNode,
					startOffset: prevLength + text.length
				};
			} else {
				textNode = document.createTextNode(text);
				this.parent.insertBefore(this.scroll.create(textNode), this);
				range = {
					startNode: textNode,
					startOffset: text.length
				};
			}
			else if (node === this.rightGuard) if (this.next instanceof _text.default) {
				this.next.insertAt(0, text);
				range = {
					startNode: this.next.domNode,
					startOffset: text.length
				};
			} else {
				textNode = document.createTextNode(text);
				this.parent.insertBefore(this.scroll.create(textNode), this.next);
				range = {
					startNode: textNode,
					startOffset: text.length
				};
			}
			node.data = GUARD_TEXT;
			return range;
		}
		update(mutations, context) {
			mutations.forEach((mutation) => {
				if (mutation.type === "characterData" && (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
					const range = this.restore(mutation.target);
					if (range) context.range = range;
				}
			});
		}
	};
	exports.default = Embed;
}));
//#endregion
//#region ../../node_modules/quill/core/composition.js
var require_composition = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _embed = _interopRequireDefault(require_embed());
	var _emitter = _interopRequireDefault(require_emitter());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Composition = class {
		isComposing = false;
		constructor(scroll, emitter) {
			this.scroll = scroll;
			this.emitter = emitter;
			this.setupListeners();
		}
		setupListeners() {
			this.scroll.domNode.addEventListener("compositionstart", (event) => {
				if (!this.isComposing) this.handleCompositionStart(event);
			});
			this.scroll.domNode.addEventListener("compositionend", (event) => {
				if (this.isComposing) queueMicrotask(() => {
					this.handleCompositionEnd(event);
				});
			});
		}
		handleCompositionStart(event) {
			const blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
			if (blot && !(blot instanceof _embed.default)) {
				this.emitter.emit(_emitter.default.events.COMPOSITION_BEFORE_START, event);
				this.scroll.batchStart();
				this.emitter.emit(_emitter.default.events.COMPOSITION_START, event);
				this.isComposing = true;
			}
		}
		handleCompositionEnd(event) {
			this.emitter.emit(_emitter.default.events.COMPOSITION_BEFORE_END, event);
			this.scroll.batchEnd();
			this.emitter.emit(_emitter.default.events.COMPOSITION_END, event);
			this.isComposing = false;
		}
	};
	exports.default = Composition;
}));
//#endregion
//#region ../../node_modules/quill/core/theme.js
var require_theme = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = class Theme {
		static DEFAULTS = { modules: {} };
		static themes = { default: Theme };
		modules = {};
		constructor(quill, options) {
			this.quill = quill;
			this.options = options;
		}
		init() {
			Object.keys(this.options.modules).forEach((name) => {
				if (this.modules[name] == null) this.addModule(name);
			});
		}
		addModule(name) {
			const ModuleClass = this.quill.constructor.import(`modules/${name}`);
			this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
			return this.modules[name];
		}
	};
}));
//#endregion
//#region ../../node_modules/quill/core/utils/scrollRectIntoView.js
var require_scrollRectIntoView = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var getParentElement = (element) => element.parentElement || element.getRootNode().host || null;
	var getElementRect = (element) => {
		const rect = element.getBoundingClientRect();
		const scaleX = "offsetWidth" in element && Math.abs(rect.width) / element.offsetWidth || 1;
		const scaleY = "offsetHeight" in element && Math.abs(rect.height) / element.offsetHeight || 1;
		return {
			top: rect.top,
			right: rect.left + element.clientWidth * scaleX,
			bottom: rect.top + element.clientHeight * scaleY,
			left: rect.left
		};
	};
	var paddingValueToInt = (value) => {
		const number = parseInt(value, 10);
		return Number.isNaN(number) ? 0 : number;
	};
	var getScrollDistance = (targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) => {
		if (targetStart < scrollStart && targetEnd > scrollEnd) return 0;
		if (targetStart < scrollStart) return -(scrollStart - targetStart + scrollPaddingStart);
		if (targetEnd > scrollEnd) return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
		return 0;
	};
	var scrollRectIntoView = (root, targetRect) => {
		const document = root.ownerDocument;
		let rect = targetRect;
		let current = root;
		while (current) {
			const isDocumentBody = current === document.body;
			const bounding = isDocumentBody ? {
				top: 0,
				right: window.visualViewport?.width ?? document.documentElement.clientWidth,
				bottom: window.visualViewport?.height ?? document.documentElement.clientHeight,
				left: 0
			} : getElementRect(current);
			const style = getComputedStyle(current);
			const scrollDistanceX = getScrollDistance(rect.left, rect.right, bounding.left, bounding.right, paddingValueToInt(style.scrollPaddingLeft), paddingValueToInt(style.scrollPaddingRight));
			const scrollDistanceY = getScrollDistance(rect.top, rect.bottom, bounding.top, bounding.bottom, paddingValueToInt(style.scrollPaddingTop), paddingValueToInt(style.scrollPaddingBottom));
			if (scrollDistanceX || scrollDistanceY) if (isDocumentBody) document.defaultView?.scrollBy(scrollDistanceX, scrollDistanceY);
			else {
				const { scrollLeft, scrollTop } = current;
				if (scrollDistanceY) current.scrollTop += scrollDistanceY;
				if (scrollDistanceX) current.scrollLeft += scrollDistanceX;
				const scrolledLeft = current.scrollLeft - scrollLeft;
				const scrolledTop = current.scrollTop - scrollTop;
				rect = {
					left: rect.left - scrolledLeft,
					top: rect.top - scrolledTop,
					right: rect.right - scrolledLeft,
					bottom: rect.bottom - scrolledTop
				};
			}
			current = isDocumentBody || style.position === "fixed" ? null : getParentElement(current);
		}
	};
	exports.default = scrollRectIntoView;
}));
//#endregion
//#region ../../node_modules/quill/core/quill.js
var require_quill$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.expandConfig = expandConfig;
	exports.globalRegistry = void 0;
	exports.overload = overload;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var Parchment = _interopRequireWildcard((init_parchment(), __toCommonJS(parchment_exports)));
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _editor = _interopRequireDefault(require_editor());
	var _emitter = _interopRequireDefault(require_emitter());
	var _instances = _interopRequireDefault(require_instances());
	var _logger = _interopRequireDefault(require_logger());
	var _module = _interopRequireDefault(require_module());
	var _selection = _interopRequireWildcard(require_selection());
	var _composition = _interopRequireDefault(require_composition());
	var _theme = _interopRequireDefault(require_theme());
	var _scrollRectIntoView = _interopRequireDefault(require_scrollRectIntoView());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	var debug = (0, _logger.default)("quill");
	var globalRegistry = exports.globalRegistry = new Parchment.Registry();
	Parchment.ParentBlot.uiClass = "ql-ui";
	var Quill = class Quill {
		static DEFAULTS = {
			bounds: null,
			modules: {},
			placeholder: "",
			readOnly: false,
			registry: globalRegistry,
			theme: "default"
		};
		static events = _emitter.default.events;
		static sources = _emitter.default.sources;
		static version = "2.0.0-beta.2";
		static imports = {
			delta: _quillDelta.default,
			parchment: Parchment,
			"core/module": _module.default,
			"core/theme": _theme.default
		};
		static debug(limit) {
			if (limit === true) limit = "log";
			_logger.default.level(limit);
		}
		static find(node) {
			let bubble = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			return _instances.default.get(node) || globalRegistry.find(node, bubble);
		}
		static import(name) {
			if (this.imports[name] == null) debug.error(`Cannot import ${name}. Are you sure it was registered?`);
			return this.imports[name];
		}
		static register(path, target) {
			let overwrite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
			if (typeof path !== "string") {
				const name = "attrName" in path ? path.attrName : path.blotName;
				if (typeof name === "string") this.register(`formats/${name}`, path, target);
				else Object.keys(path).forEach((key) => {
					this.register(key, path[key], target);
				});
			} else {
				if (this.imports[path] != null && !overwrite) debug.warn(`Overwriting ${path} with`, target);
				this.imports[path] = target;
				if ((path.startsWith("blots/") || path.startsWith("formats/")) && target && typeof target !== "boolean" && target.blotName !== "abstract") globalRegistry.register(target);
				if (typeof target.register === "function") target.register(globalRegistry);
			}
		}
		constructor(container) {
			this.options = expandConfig(container, arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {});
			this.container = this.options.container;
			if (this.container == null) {
				debug.error("Invalid Quill container", container);
				return;
			}
			if (this.options.debug) Quill.debug(this.options.debug);
			const html = this.container.innerHTML.trim();
			this.container.classList.add("ql-container");
			this.container.innerHTML = "";
			_instances.default.set(this.container, this);
			this.root = this.addContainer("ql-editor");
			this.root.classList.add("ql-blank");
			this.emitter = new _emitter.default();
			const scrollBlotName = Parchment.ScrollBlot.blotName;
			const ScrollBlot = this.options.registry.query(scrollBlotName);
			if (!ScrollBlot || !("blotName" in ScrollBlot)) throw new Error(`Cannot initialize Quill without "${scrollBlotName}" blot`);
			this.scroll = new ScrollBlot(this.options.registry, this.root, { emitter: this.emitter });
			this.editor = new _editor.default(this.scroll);
			this.selection = new _selection.default(this.scroll, this.emitter);
			this.composition = new _composition.default(this.scroll, this.emitter);
			this.theme = new this.options.theme(this, this.options);
			this.keyboard = this.theme.addModule("keyboard");
			this.clipboard = this.theme.addModule("clipboard");
			this.history = this.theme.addModule("history");
			this.uploader = this.theme.addModule("uploader");
			this.theme.addModule("input");
			this.theme.addModule("uiNode");
			this.theme.init();
			this.emitter.on(_emitter.default.events.EDITOR_CHANGE, (type) => {
				if (type === _emitter.default.events.TEXT_CHANGE) this.root.classList.toggle("ql-blank", this.editor.isBlank());
			});
			this.emitter.on(_emitter.default.events.SCROLL_UPDATE, (source, mutations) => {
				const oldRange = this.selection.lastRange;
				const [newRange] = this.selection.getRange();
				const selectionInfo = oldRange && newRange ? {
					oldRange,
					newRange
				} : void 0;
				modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
			});
			this.emitter.on(_emitter.default.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
				const oldRange = this.selection.lastRange;
				const [newRange] = this.selection.getRange();
				const selectionInfo = oldRange && newRange ? {
					oldRange,
					newRange
				} : void 0;
				modify.call(this, () => {
					const change = new _quillDelta.default().retain(blot.offset(this)).retain({ [blot.statics.blotName]: delta });
					return this.editor.update(change, [], selectionInfo);
				}, Quill.sources.USER);
			});
			if (html) {
				const contents = this.clipboard.convert({
					html: `${html}<p><br></p>`,
					text: "\n"
				});
				this.setContents(contents);
			}
			this.history.clear();
			if (this.options.placeholder) this.root.setAttribute("data-placeholder", this.options.placeholder);
			if (this.options.readOnly) this.disable();
			this.allowReadOnlyEdits = false;
		}
		addContainer(container) {
			let refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
			if (typeof container === "string") {
				const className = container;
				container = document.createElement("div");
				container.classList.add(className);
			}
			this.container.insertBefore(container, refNode);
			return container;
		}
		blur() {
			this.selection.setRange(null);
		}
		deleteText(index, length, source) {
			[index, length, , source] = overload(index, length, source);
			return modify.call(this, () => {
				return this.editor.deleteText(index, length);
			}, source, index, -1 * length);
		}
		disable() {
			this.enable(false);
		}
		editReadOnly(modifier) {
			this.allowReadOnlyEdits = true;
			const value = modifier();
			this.allowReadOnlyEdits = false;
			return value;
		}
		enable() {
			let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
			this.scroll.enable(enabled);
			this.container.classList.toggle("ql-disabled", !enabled);
		}
		focus() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			this.selection.focus();
			if (!options.preventScroll) this.scrollSelectionIntoView();
		}
		format(name, value) {
			let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter.default.sources.API;
			return modify.call(this, () => {
				const range = this.getSelection(true);
				let change = new _quillDelta.default();
				if (range == null) return change;
				if (this.scroll.query(name, Parchment.Scope.BLOCK)) change = this.editor.formatLine(range.index, range.length, { [name]: value });
				else if (range.length === 0) {
					this.selection.format(name, value);
					return change;
				} else change = this.editor.formatText(range.index, range.length, { [name]: value });
				this.setSelection(range, _emitter.default.sources.SILENT);
				return change;
			}, source);
		}
		formatLine(index, length, name, value, source) {
			let formats;
			[index, length, formats, source] = overload(index, length, name, value, source);
			return modify.call(this, () => {
				return this.editor.formatLine(index, length, formats);
			}, source, index, 0);
		}
		formatText(index, length, name, value, source) {
			let formats;
			[index, length, formats, source] = overload(index, length, name, value, source);
			return modify.call(this, () => {
				return this.editor.formatText(index, length, formats);
			}, source, index, 0);
		}
		getBounds(index) {
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			let bounds = null;
			if (typeof index === "number") bounds = this.selection.getBounds(index, length);
			else bounds = this.selection.getBounds(index.index, index.length);
			if (!bounds) return null;
			const containerBounds = this.container.getBoundingClientRect();
			return {
				bottom: bounds.bottom - containerBounds.top,
				height: bounds.height,
				left: bounds.left - containerBounds.left,
				right: bounds.right - containerBounds.left,
				top: bounds.top - containerBounds.top,
				width: bounds.width
			};
		}
		getContents() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
			[index, length] = overload(index, length);
			return this.editor.getContents(index, length);
		}
		getFormat() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			if (typeof index === "number") return this.editor.getFormat(index, length);
			return this.editor.getFormat(index.index, index.length);
		}
		getIndex(blot) {
			return blot.offset(this.scroll);
		}
		getLength() {
			return this.scroll.length();
		}
		getLeaf(index) {
			return this.scroll.leaf(index);
		}
		getLine(index) {
			return this.scroll.line(index);
		}
		getLines() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
			if (typeof index !== "number") return this.scroll.lines(index.index, index.length);
			return this.scroll.lines(index, length);
		}
		getModule(name) {
			return this.theme.modules[name];
		}
		getSelection() {
			if (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false) this.focus();
			this.update();
			return this.selection.getRange()[0];
		}
		getSemanticHTML() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
			let length = arguments.length > 1 ? arguments[1] : void 0;
			if (typeof index === "number") length = length ?? this.getLength() - index;
			[index, length] = overload(index, length);
			return this.editor.getHTML(index, length);
		}
		getText() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
			let length = arguments.length > 1 ? arguments[1] : void 0;
			if (typeof index === "number") length = length ?? this.getLength() - index;
			[index, length] = overload(index, length);
			return this.editor.getText(index, length);
		}
		hasFocus() {
			return this.selection.hasFocus();
		}
		insertEmbed(index, embed, value) {
			let source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Quill.sources.API;
			return modify.call(this, () => {
				return this.editor.insertEmbed(index, embed, value);
			}, source, index);
		}
		insertText(index, text, name, value, source) {
			let formats;
			[index, , formats, source] = overload(index, 0, name, value, source);
			return modify.call(this, () => {
				return this.editor.insertText(index, text, formats);
			}, source, index, text.length);
		}
		isEnabled() {
			return this.scroll.isEnabled();
		}
		off() {
			return this.emitter.off(...arguments);
		}
		on() {
			return this.emitter.on(...arguments);
		}
		once() {
			return this.emitter.once(...arguments);
		}
		removeFormat() {
			const [index, length, , source] = overload(...arguments);
			return modify.call(this, () => {
				return this.editor.removeFormat(index, length);
			}, source, index);
		}
		scrollRectIntoView(rect) {
			(0, _scrollRectIntoView.default)(this.root, rect);
		}
		/**
		* @deprecated Use Quill#scrollSelectionIntoView() instead.
		*/
		scrollIntoView() {
			console.warn("Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.");
			this.scrollSelectionIntoView();
		}
		/**
		* Scroll the current selection into the visible area.
		* If the selection is already visible, no scrolling will occur.
		*/
		scrollSelectionIntoView() {
			const range = this.selection.lastRange;
			const bounds = range && this.selection.getBounds(range.index, range.length);
			if (bounds) this.scrollRectIntoView(bounds);
		}
		setContents(delta) {
			let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter.default.sources.API;
			return modify.call(this, () => {
				delta = new _quillDelta.default(delta);
				const length = this.getLength();
				const delete1 = this.editor.deleteText(0, length);
				const applied = this.editor.insertContents(0, delta);
				const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
				return delete1.compose(applied).compose(delete2);
			}, source);
		}
		setSelection(index, length, source) {
			if (index == null) this.selection.setRange(null, length || Quill.sources.API);
			else {
				[index, length, , source] = overload(index, length, source);
				this.selection.setRange(new _selection.Range(Math.max(0, index), length), source);
				if (source !== _emitter.default.sources.SILENT) this.scrollSelectionIntoView();
			}
		}
		setText(text) {
			let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter.default.sources.API;
			const delta = new _quillDelta.default().insert(text);
			return this.setContents(delta, source);
		}
		update() {
			let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter.default.sources.USER;
			const change = this.scroll.update(source);
			this.selection.update(source);
			return change;
		}
		updateContents(delta) {
			let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter.default.sources.API;
			return modify.call(this, () => {
				delta = new _quillDelta.default(delta);
				return this.editor.applyDelta(delta);
			}, source, true);
		}
	};
	exports.default = Quill;
	function expandConfig(container, userConfig) {
		let expandedConfig = (0, _lodashEs.merge)({
			container,
			modules: {
				clipboard: true,
				keyboard: true,
				history: true,
				uploader: true
			}
		}, userConfig);
		if (!expandedConfig.theme || expandedConfig.theme === Quill.DEFAULTS.theme) expandedConfig.theme = _theme.default;
		else {
			expandedConfig.theme = Quill.import(`themes/${expandedConfig.theme}`);
			if (expandedConfig.theme == null) throw new Error(`Invalid theme ${expandedConfig.theme}. Did you register it?`);
		}
		const themeConfig = (0, _lodashEs.cloneDeep)(expandedConfig.theme.DEFAULTS);
		[themeConfig, expandedConfig].forEach((config) => {
			config.modules = config.modules || {};
			Object.keys(config.modules).forEach((module$3) => {
				if (config.modules[module$3] === true) config.modules[module$3] = {};
			});
		});
		const moduleConfig = Object.keys(themeConfig.modules).concat(Object.keys(expandedConfig.modules)).reduce((config, name) => {
			const moduleClass = Quill.import(`modules/${name}`);
			if (moduleClass == null) debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
			else config[name] = moduleClass.DEFAULTS || {};
			return config;
		}, {});
		if (expandedConfig.modules != null && expandedConfig.modules.toolbar && expandedConfig.modules.toolbar.constructor !== Object) expandedConfig.modules.toolbar = { container: expandedConfig.modules.toolbar };
		expandedConfig = (0, _lodashEs.merge)({}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, expandedConfig);
		["bounds", "container"].forEach((key) => {
			const selector = expandedConfig[key];
			if (typeof selector === "string") expandedConfig[key] = document.querySelector(selector);
		});
		expandedConfig.modules = Object.keys(expandedConfig.modules).reduce((config, name) => {
			if (expandedConfig.modules[name]) config[name] = expandedConfig.modules[name];
			return config;
		}, {});
		return expandedConfig;
	}
	function modify(modifier, source, index, shift) {
		if (!this.isEnabled() && source === _emitter.default.sources.USER && !this.allowReadOnlyEdits) return new _quillDelta.default();
		let range = index == null ? null : this.getSelection();
		const oldDelta = this.editor.delta;
		const change = modifier();
		if (range != null) {
			if (index === true) index = range.index;
			if (shift == null) range = shiftRange(range, change, source);
			else if (shift !== 0) range = shiftRange(range, index, shift, source);
			this.setSelection(range, _emitter.default.sources.SILENT);
		}
		if (change.length() > 0) {
			const args = [
				_emitter.default.events.TEXT_CHANGE,
				change,
				oldDelta,
				source
			];
			this.emitter.emit(_emitter.default.events.EDITOR_CHANGE, ...args);
			if (source !== _emitter.default.sources.SILENT) this.emitter.emit(...args);
		}
		return change;
	}
	function overload(index, length, name, value, source) {
		let formats = {};
		if (typeof index.index === "number" && typeof index.length === "number") if (typeof length !== "number") {
			source = value;
			value = name;
			name = length;
			length = index.length;
			index = index.index;
		} else {
			length = index.length;
			index = index.index;
		}
		else if (typeof length !== "number") {
			source = value;
			value = name;
			name = length;
			length = 0;
		}
		if (typeof name === "object") {
			formats = name;
			source = value;
		} else if (typeof name === "string") if (value != null) formats[name] = value;
		else source = name;
		source = source || _emitter.default.sources.API;
		return [
			index,
			length,
			formats,
			source
		];
	}
	function shiftRange(range, index, lengthOrSource, source) {
		const length = typeof lengthOrSource === "number" ? lengthOrSource : 0;
		if (range == null) return null;
		let start;
		let end;
		if (index && typeof index.transformPosition === "function") [start, end] = [range.index, range.index + range.length].map((pos) => index.transformPosition(pos, source !== _emitter.default.sources.USER));
		else [start, end] = [range.index, range.index + range.length].map((pos) => {
			if (pos < index || pos === index && source === _emitter.default.sources.USER) return pos;
			if (length >= 0) return pos + length;
			return Math.max(index, pos + length);
		});
		return new _selection.Range(start, end - start);
	}
}));
//#endregion
//#region ../../node_modules/quill/blots/container.js
var require_container = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var Container = class extends _parchment.ContainerBlot {};
	exports.default = Container;
}));
//#endregion
//#region ../../node_modules/quill/blots/scroll.js
var require_scroll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quillDelta = _interopRequireWildcard(require_Delta());
	var _emitter = _interopRequireDefault(require_emitter());
	var _block = _interopRequireWildcard(require_block());
	var _break = _interopRequireDefault(require_break());
	var _container = _interopRequireDefault(require_container());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function isLine(blot) {
		return blot instanceof _block.default || blot instanceof _block.BlockEmbed;
	}
	function isUpdatable(blot) {
		return typeof blot.updateContent === "function";
	}
	var Scroll = class extends _parchment.ScrollBlot {
		static blotName = "scroll";
		static className = "ql-editor";
		static tagName = "DIV";
		static defaultChild = _block.default;
		static allowedChildren = [
			_block.default,
			_block.BlockEmbed,
			_container.default
		];
		constructor(registry, domNode, _ref) {
			let { emitter } = _ref;
			super(registry, domNode);
			this.emitter = emitter;
			this.batch = false;
			this.optimize();
			this.enable();
			this.domNode.addEventListener("dragstart", (e) => this.handleDragStart(e));
		}
		batchStart() {
			if (!Array.isArray(this.batch)) this.batch = [];
		}
		batchEnd() {
			if (!this.batch) return;
			const mutations = this.batch;
			this.batch = false;
			this.update(mutations);
		}
		emitMount(blot) {
			this.emitter.emit(_emitter.default.events.SCROLL_BLOT_MOUNT, blot);
		}
		emitUnmount(blot) {
			this.emitter.emit(_emitter.default.events.SCROLL_BLOT_UNMOUNT, blot);
		}
		emitEmbedUpdate(blot, change) {
			this.emitter.emit(_emitter.default.events.SCROLL_EMBED_UPDATE, blot, change);
		}
		deleteAt(index, length) {
			const [first, offset] = this.line(index);
			const [last] = this.line(index + length);
			super.deleteAt(index, length);
			if (last != null && first !== last && offset > 0) {
				if (first instanceof _block.BlockEmbed || last instanceof _block.BlockEmbed) {
					this.optimize();
					return;
				}
				const ref = last.children.head instanceof _break.default ? null : last.children.head;
				first.moveChildren(last, ref);
				first.remove();
			}
			this.optimize();
		}
		enable() {
			let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
			this.domNode.setAttribute("contenteditable", enabled ? "true" : "false");
		}
		formatAt(index, length, format, value) {
			super.formatAt(index, length, format, value);
			this.optimize();
		}
		insertAt(index, value, def) {
			if (index >= this.length()) if (def == null || this.scroll.query(value, _parchment.Scope.BLOCK) == null) {
				const blot = this.scroll.create(this.statics.defaultChild.blotName);
				this.appendChild(blot);
				if (def == null && value.endsWith("\n")) blot.insertAt(0, value.slice(0, -1), def);
				else blot.insertAt(0, value, def);
			} else {
				const embed = this.scroll.create(value, def);
				this.appendChild(embed);
			}
			else super.insertAt(index, value, def);
			this.optimize();
		}
		insertBefore(blot, ref) {
			if (blot.statics.scope === _parchment.Scope.INLINE_BLOT) {
				const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
				wrapper.appendChild(blot);
				super.insertBefore(wrapper, ref);
			} else super.insertBefore(blot, ref);
		}
		insertContents(index, delta) {
			const renderBlocks = this.deltaToRenderBlocks(delta.concat(new _quillDelta.default().insert("\n")));
			const last = renderBlocks.pop();
			if (last == null) return;
			this.batchStart();
			const first = renderBlocks.shift();
			if (first) {
				const shouldInsertNewlineChar = first.type === "block" && (first.delta.length() === 0 || !this.descendant(_block.BlockEmbed, index)[0] && index < this.length());
				const delta = first.type === "block" ? first.delta : new _quillDelta.default().insert({ [first.key]: first.value });
				insertInlineContents(this, index, delta);
				const newlineCharLength = first.type === "block" ? 1 : 0;
				const lineEndIndex = index + delta.length() + newlineCharLength;
				if (shouldInsertNewlineChar) this.insertAt(lineEndIndex - 1, "\n");
				const formats = (0, _block.bubbleFormats)(this.line(index)[0]);
				const attributes = _quillDelta.AttributeMap.diff(formats, first.attributes) || {};
				Object.keys(attributes).forEach((name) => {
					this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
				});
				index = lineEndIndex;
			}
			let [refBlot, refBlotOffset] = this.children.find(index);
			if (renderBlocks.length) {
				if (refBlot) {
					refBlot = refBlot.split(refBlotOffset);
					refBlotOffset = 0;
				}
				renderBlocks.forEach((renderBlock) => {
					if (renderBlock.type === "block") insertInlineContents(this.createBlock(renderBlock.attributes, refBlot || void 0), 0, renderBlock.delta);
					else {
						const blockEmbed = this.create(renderBlock.key, renderBlock.value);
						this.insertBefore(blockEmbed, refBlot || void 0);
						Object.keys(renderBlock.attributes).forEach((name) => {
							blockEmbed.format(name, renderBlock.attributes[name]);
						});
					}
				});
			}
			if (last.type === "block" && last.delta.length()) {
				const offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
				insertInlineContents(this, offset, last.delta);
			}
			this.batchEnd();
			this.optimize();
		}
		isEnabled() {
			return this.domNode.getAttribute("contenteditable") === "true";
		}
		leaf(index) {
			const last = this.path(index).pop();
			if (!last) return [null, -1];
			const [blot, offset] = last;
			return blot instanceof _parchment.LeafBlot ? [blot, offset] : [null, -1];
		}
		line(index) {
			if (index === this.length()) return this.line(index - 1);
			return this.descendant(isLine, index);
		}
		lines() {
			let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
			let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
			const getLines = (blot, blotIndex, blotLength) => {
				let lines = [];
				let lengthLeft = blotLength;
				blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
					if (isLine(child)) lines.push(child);
					else if (child instanceof _parchment.ContainerBlot) lines = lines.concat(getLines(child, childIndex, lengthLeft));
					lengthLeft -= childLength;
				});
				return lines;
			};
			return getLines(this, index, length);
		}
		optimize() {
			let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
			let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			if (this.batch) return;
			super.optimize(mutations, context);
			if (mutations.length > 0) this.emitter.emit(_emitter.default.events.SCROLL_OPTIMIZE, mutations, context);
		}
		path(index) {
			return super.path(index).slice(1);
		}
		remove() {}
		update(mutations) {
			if (this.batch) {
				if (Array.isArray(mutations)) this.batch = this.batch.concat(mutations);
				return;
			}
			let source = _emitter.default.sources.USER;
			if (typeof mutations === "string") source = mutations;
			if (!Array.isArray(mutations)) mutations = this.observer.takeRecords();
			mutations = mutations.filter((_ref2) => {
				let { target } = _ref2;
				const blot = this.find(target, true);
				return blot && !isUpdatable(blot);
			});
			if (mutations.length > 0) this.emitter.emit(_emitter.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
			super.update(mutations.concat([]));
			if (mutations.length > 0) this.emitter.emit(_emitter.default.events.SCROLL_UPDATE, source, mutations);
		}
		updateEmbedAt(index, key, change) {
			const [blot] = this.descendant((b) => b instanceof _block.BlockEmbed, index);
			if (blot && blot.statics.blotName === key && isUpdatable(blot)) blot.updateContent(change);
		}
		handleDragStart(event) {
			event.preventDefault();
		}
		deltaToRenderBlocks(delta) {
			const renderBlocks = [];
			let currentBlockDelta = new _quillDelta.default();
			delta.forEach((op) => {
				const insert = op?.insert;
				if (!insert) return;
				if (typeof insert === "string") {
					const splitted = insert.split("\n");
					splitted.slice(0, -1).forEach((text) => {
						currentBlockDelta.insert(text, op.attributes);
						renderBlocks.push({
							type: "block",
							delta: currentBlockDelta,
							attributes: op.attributes ?? {}
						});
						currentBlockDelta = new _quillDelta.default();
					});
					const last = splitted[splitted.length - 1];
					if (last) currentBlockDelta.insert(last, op.attributes);
				} else {
					const key = Object.keys(insert)[0];
					if (!key) return;
					if (this.query(key, _parchment.Scope.INLINE)) currentBlockDelta.push(op);
					else {
						if (currentBlockDelta.length()) renderBlocks.push({
							type: "block",
							delta: currentBlockDelta,
							attributes: {}
						});
						currentBlockDelta = new _quillDelta.default();
						renderBlocks.push({
							type: "blockEmbed",
							key,
							value: insert[key],
							attributes: op.attributes ?? {}
						});
					}
				}
			});
			if (currentBlockDelta.length()) renderBlocks.push({
				type: "block",
				delta: currentBlockDelta,
				attributes: {}
			});
			return renderBlocks;
		}
		createBlock(attributes, refBlot) {
			let blotName;
			const formats = {};
			Object.entries(attributes).forEach((_ref3) => {
				let [key, value] = _ref3;
				if (this.query(key, _parchment.Scope.BLOCK & _parchment.Scope.BLOT) != null) blotName = key;
				else formats[key] = value;
			});
			const block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : void 0);
			this.insertBefore(block, refBlot || void 0);
			const length = block.length();
			Object.entries(formats).forEach((_ref4) => {
				let [key, value] = _ref4;
				block.formatAt(0, length, key, value);
			});
			return block;
		}
	};
	function insertInlineContents(parent, index, inlineContents) {
		inlineContents.reduce((index, op) => {
			const length = _quillDelta.Op.length(op);
			let attributes = op.attributes || {};
			if (op.insert != null) {
				if (typeof op.insert === "string") {
					const text = op.insert;
					parent.insertAt(index, text);
					const [leaf] = parent.descendant(_parchment.LeafBlot, index);
					const formats = (0, _block.bubbleFormats)(leaf);
					attributes = _quillDelta.AttributeMap.diff(formats, attributes) || {};
				} else if (typeof op.insert === "object") {
					const key = Object.keys(op.insert)[0];
					if (key == null) return index;
					parent.insertAt(index, key, op.insert[key]);
					if (parent.scroll.query(key, _parchment.Scope.INLINE) != null) {
						const [leaf] = parent.descendant(_parchment.LeafBlot, index);
						const formats = (0, _block.bubbleFormats)(leaf);
						attributes = _quillDelta.AttributeMap.diff(formats, attributes) || {};
					}
				}
			}
			Object.keys(attributes).forEach((key) => {
				parent.formatAt(index, length, key, attributes[key]);
			});
			return index + length;
		}, index);
	}
	exports.default = Scroll;
}));
//#endregion
//#region ../../node_modules/quill/formats/align.js
var require_align = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AlignStyle = exports.AlignClass = exports.AlignAttribute = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var config = {
		scope: _parchment.Scope.BLOCK,
		whitelist: [
			"right",
			"center",
			"justify"
		]
	};
	exports.AlignAttribute = new _parchment.Attributor("align", "align", config);
	exports.AlignClass = new _parchment.ClassAttributor("align", "ql-align", config);
	exports.AlignStyle = new _parchment.StyleAttributor("align", "text-align", config);
}));
//#endregion
//#region ../../node_modules/quill/formats/color.js
var require_color = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var ColorAttributor = class extends _parchment.StyleAttributor {
		value(domNode) {
			let value = super.value(domNode);
			if (!value.startsWith("rgb(")) return value;
			value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
			return `#${value.split(",").map((component) => `00${parseInt(component, 10).toString(16)}`.slice(-2)).join("")}`;
		}
	};
	exports.ColorAttributor = ColorAttributor;
	exports.ColorClass = new _parchment.ClassAttributor("color", "ql-color", { scope: _parchment.Scope.INLINE });
	exports.ColorStyle = new ColorAttributor("color", "color", { scope: _parchment.Scope.INLINE });
}));
//#endregion
//#region ../../node_modules/quill/formats/background.js
var require_background = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BackgroundStyle = exports.BackgroundClass = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _color = require_color();
	exports.BackgroundClass = new _parchment.ClassAttributor("background", "ql-bg", { scope: _parchment.Scope.INLINE });
	exports.BackgroundStyle = new _color.ColorAttributor("background", "background-color", { scope: _parchment.Scope.INLINE });
}));
//#endregion
//#region ../../node_modules/quill/formats/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.CodeBlockContainer = exports.Code = void 0;
	var _block = _interopRequireDefault(require_block());
	var _break = _interopRequireDefault(require_break());
	var _cursor = _interopRequireDefault(require_cursor());
	var _inline = _interopRequireDefault(require_inline());
	var _text = _interopRequireWildcard(require_text());
	var _container = _interopRequireDefault(require_container());
	var _quill = _interopRequireDefault(require_quill$1());
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var CodeBlockContainer = class extends _container.default {
		static create(value) {
			const domNode = super.create(value);
			domNode.setAttribute("spellcheck", "false");
			return domNode;
		}
		code(index, length) {
			return this.children.map((child) => child.length() <= 1 ? "" : child.domNode.innerText).join("\n").slice(index, index + length);
		}
		html(index, length) {
			return `<pre>\n${(0, _text.escapeText)(this.code(index, length))}\n</pre>`;
		}
	};
	exports.CodeBlockContainer = CodeBlockContainer;
	var CodeBlock = class extends _block.default {
		static TAB = "  ";
		static register() {
			_quill.default.register(CodeBlockContainer);
		}
	};
	exports.default = CodeBlock;
	var Code = class extends _inline.default {};
	exports.Code = Code;
	Code.blotName = "code";
	Code.tagName = "CODE";
	CodeBlock.blotName = "code-block";
	CodeBlock.className = "ql-code-block";
	CodeBlock.tagName = "DIV";
	CodeBlockContainer.blotName = "code-block-container";
	CodeBlockContainer.className = "ql-code-block-container";
	CodeBlockContainer.tagName = "DIV";
	CodeBlockContainer.allowedChildren = [CodeBlock];
	CodeBlock.allowedChildren = [
		_text.default,
		_break.default,
		_cursor.default
	];
	CodeBlock.requiredContainer = CodeBlockContainer;
}));
//#endregion
//#region ../../node_modules/quill/formats/direction.js
var require_direction = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DirectionStyle = exports.DirectionClass = exports.DirectionAttribute = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var config = {
		scope: _parchment.Scope.BLOCK,
		whitelist: ["rtl"]
	};
	exports.DirectionAttribute = new _parchment.Attributor("direction", "dir", config);
	exports.DirectionClass = new _parchment.ClassAttributor("direction", "ql-direction", config);
	exports.DirectionStyle = new _parchment.StyleAttributor("direction", "direction", config);
}));
//#endregion
//#region ../../node_modules/quill/formats/font.js
var require_font = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FontStyle = exports.FontClass = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var config = {
		scope: _parchment.Scope.INLINE,
		whitelist: ["serif", "monospace"]
	};
	exports.FontClass = new _parchment.ClassAttributor("font", "ql-font", config);
	var FontStyleAttributor = class extends _parchment.StyleAttributor {
		value(node) {
			return super.value(node).replace(/["']/g, "");
		}
	};
	exports.FontStyle = new FontStyleAttributor("font", "font-family", config);
}));
//#endregion
//#region ../../node_modules/quill/formats/size.js
var require_size = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SizeStyle = exports.SizeClass = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	exports.SizeClass = new _parchment.ClassAttributor("size", "ql-size", {
		scope: _parchment.Scope.INLINE,
		whitelist: [
			"small",
			"large",
			"huge"
		]
	});
	exports.SizeStyle = new _parchment.StyleAttributor("size", "font-size", {
		scope: _parchment.Scope.INLINE,
		whitelist: [
			"10px",
			"18px",
			"32px"
		]
	});
}));
//#endregion
//#region ../../node_modules/quill/modules/keyboard.js
var require_keyboard = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.SHORTKEY = void 0;
	exports.deleteRange = deleteRange;
	exports.normalize = normalize;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _quillDelta = _interopRequireWildcard(require_Delta());
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quill = _interopRequireDefault(require_quill$1());
	var _logger = _interopRequireDefault(require_logger());
	var _module = _interopRequireDefault(require_module());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	var debug = (0, _logger.default)("quill:keyboard");
	var SHORTKEY = exports.SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
	var Keyboard = class Keyboard extends _module.default {
		static match(evt, binding) {
			if ([
				"altKey",
				"ctrlKey",
				"metaKey",
				"shiftKey"
			].some((key) => {
				return !!binding[key] !== evt[key] && binding[key] !== null;
			})) return false;
			return binding.key === evt.key || binding.key === evt.which;
		}
		constructor(quill, options) {
			super(quill, options);
			this.bindings = {};
			Object.keys(this.options.bindings).forEach((name) => {
				if (this.options.bindings[name]) this.addBinding(this.options.bindings[name]);
			});
			this.addBinding({
				key: "Enter",
				shiftKey: null
			}, this.handleEnter);
			this.addBinding({
				key: "Enter",
				metaKey: null,
				ctrlKey: null,
				altKey: null
			}, () => {});
			if (/Firefox/i.test(navigator.userAgent)) {
				this.addBinding({ key: "Backspace" }, { collapsed: true }, this.handleBackspace);
				this.addBinding({ key: "Delete" }, { collapsed: true }, this.handleDelete);
			} else {
				this.addBinding({ key: "Backspace" }, {
					collapsed: true,
					prefix: /^.?$/
				}, this.handleBackspace);
				this.addBinding({ key: "Delete" }, {
					collapsed: true,
					suffix: /^.?$/
				}, this.handleDelete);
			}
			this.addBinding({ key: "Backspace" }, { collapsed: false }, this.handleDeleteRange);
			this.addBinding({ key: "Delete" }, { collapsed: false }, this.handleDeleteRange);
			this.addBinding({
				key: "Backspace",
				altKey: null,
				ctrlKey: null,
				metaKey: null,
				shiftKey: null
			}, {
				collapsed: true,
				offset: 0
			}, this.handleBackspace);
			this.listen();
		}
		addBinding(keyBinding) {
			let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			let handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			const binding = normalize(keyBinding);
			if (binding == null) {
				debug.warn("Attempted to add invalid keyboard binding", binding);
				return;
			}
			if (typeof context === "function") context = { handler: context };
			if (typeof handler === "function") handler = { handler };
			(Array.isArray(binding.key) ? binding.key : [binding.key]).forEach((key) => {
				const singleBinding = {
					...binding,
					key,
					...context,
					...handler
				};
				this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
				this.bindings[singleBinding.key].push(singleBinding);
			});
		}
		listen() {
			this.quill.root.addEventListener("keydown", (evt) => {
				if (evt.defaultPrevented || evt.isComposing) return;
				const matches = (this.bindings[evt.key] || []).concat(this.bindings[evt.which] || []).filter((binding) => Keyboard.match(evt, binding));
				if (matches.length === 0) return;
				const blot = _quill.default.find(evt.target, true);
				if (blot && blot.scroll !== this.quill.scroll) return;
				const range = this.quill.getSelection();
				if (range == null || !this.quill.hasFocus()) return;
				const [line, offset] = this.quill.getLine(range.index);
				const [leafStart, offsetStart] = this.quill.getLeaf(range.index);
				const [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
				const prefixText = leafStart instanceof _parchment.TextBlot ? leafStart.value().slice(0, offsetStart) : "";
				const suffixText = leafEnd instanceof _parchment.TextBlot ? leafEnd.value().slice(offsetEnd) : "";
				const curContext = {
					collapsed: range.length === 0,
					empty: range.length === 0 && line.length() <= 1,
					format: this.quill.getFormat(range),
					line,
					offset,
					prefix: prefixText,
					suffix: suffixText,
					event: evt
				};
				if (matches.some((binding) => {
					if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
					if (binding.empty != null && binding.empty !== curContext.empty) return false;
					if (binding.offset != null && binding.offset !== curContext.offset) return false;
					if (Array.isArray(binding.format)) {
						if (binding.format.every((name) => curContext.format[name] == null)) return false;
					} else if (typeof binding.format === "object") {
						if (!Object.keys(binding.format).every((name) => {
							if (binding.format[name] === true) return curContext.format[name] != null;
							if (binding.format[name] === false) return curContext.format[name] == null;
							return (0, _lodashEs.isEqual)(binding.format[name], curContext.format[name]);
						})) return false;
					}
					if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
					if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
					return binding.handler.call(this, range, curContext, binding) !== true;
				})) evt.preventDefault();
			});
		}
		handleBackspace(range, context) {
			const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
			if (range.index === 0 || this.quill.getLength() <= 1) return;
			let formats = {};
			const [line] = this.quill.getLine(range.index);
			let delta = new _quillDelta.default().retain(range.index - length).delete(length);
			if (context.offset === 0) {
				const [prev] = this.quill.getLine(range.index - 1);
				if (prev) {
					if (!(prev.statics.blotName === "block" && prev.length() <= 1)) {
						const curFormats = line.formats();
						const prevFormats = this.quill.getFormat(range.index - 1, 1);
						formats = _quillDelta.AttributeMap.diff(curFormats, prevFormats) || {};
						if (Object.keys(formats).length > 0) {
							const formatDelta = new _quillDelta.default().retain(range.index + line.length() - 2).retain(1, formats);
							delta = delta.compose(formatDelta);
						}
					}
				}
			}
			this.quill.updateContents(delta, _quill.default.sources.USER);
			this.quill.focus();
		}
		handleDelete(range, context) {
			const length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
			if (range.index >= this.quill.getLength() - length) return;
			let formats = {};
			const [line] = this.quill.getLine(range.index);
			let delta = new _quillDelta.default().retain(range.index).delete(length);
			if (context.offset >= line.length() - 1) {
				const [next] = this.quill.getLine(range.index + 1);
				if (next) {
					const curFormats = line.formats();
					const nextFormats = this.quill.getFormat(range.index, 1);
					formats = _quillDelta.AttributeMap.diff(curFormats, nextFormats) || {};
					if (Object.keys(formats).length > 0) delta = delta.retain(next.length() - 1).retain(1, formats);
				}
			}
			this.quill.updateContents(delta, _quill.default.sources.USER);
			this.quill.focus();
		}
		handleDeleteRange(range) {
			deleteRange({
				range,
				quill: this.quill
			});
			this.quill.focus();
		}
		handleEnter(range, context) {
			const lineFormats = Object.keys(context.format).reduce((formats, format) => {
				if (this.quill.scroll.query(format, _parchment.Scope.BLOCK) && !Array.isArray(context.format[format])) formats[format] = context.format[format];
				return formats;
			}, {});
			const delta = new _quillDelta.default().retain(range.index).delete(range.length).insert("\n", lineFormats);
			this.quill.updateContents(delta, _quill.default.sources.USER);
			this.quill.setSelection(range.index + 1, _quill.default.sources.SILENT);
			this.quill.focus();
		}
	};
	exports.default = Keyboard;
	Keyboard.DEFAULTS = { bindings: {
		bold: makeFormatHandler("bold"),
		italic: makeFormatHandler("italic"),
		underline: makeFormatHandler("underline"),
		indent: {
			key: "Tab",
			format: [
				"blockquote",
				"indent",
				"list"
			],
			handler(range, context) {
				if (context.collapsed && context.offset !== 0) return true;
				this.quill.format("indent", "+1", _quill.default.sources.USER);
				return false;
			}
		},
		outdent: {
			key: "Tab",
			shiftKey: true,
			format: [
				"blockquote",
				"indent",
				"list"
			],
			handler(range, context) {
				if (context.collapsed && context.offset !== 0) return true;
				this.quill.format("indent", "-1", _quill.default.sources.USER);
				return false;
			}
		},
		"outdent backspace": {
			key: "Backspace",
			collapsed: true,
			shiftKey: null,
			metaKey: null,
			ctrlKey: null,
			altKey: null,
			format: ["indent", "list"],
			offset: 0,
			handler(range, context) {
				if (context.format.indent != null) this.quill.format("indent", "-1", _quill.default.sources.USER);
				else if (context.format.list != null) this.quill.format("list", false, _quill.default.sources.USER);
			}
		},
		"indent code-block": makeCodeBlockHandler(true),
		"outdent code-block": makeCodeBlockHandler(false),
		"remove tab": {
			key: "Tab",
			shiftKey: true,
			collapsed: true,
			prefix: /\t$/,
			handler(range) {
				this.quill.deleteText(range.index - 1, 1, _quill.default.sources.USER);
			}
		},
		tab: {
			key: "Tab",
			handler(range, context) {
				if (context.format.table) return true;
				this.quill.history.cutoff();
				const delta = new _quillDelta.default().retain(range.index).delete(range.length).insert("	");
				this.quill.updateContents(delta, _quill.default.sources.USER);
				this.quill.history.cutoff();
				this.quill.setSelection(range.index + 1, _quill.default.sources.SILENT);
				return false;
			}
		},
		"blockquote empty enter": {
			key: "Enter",
			collapsed: true,
			format: ["blockquote"],
			empty: true,
			handler() {
				this.quill.format("blockquote", false, _quill.default.sources.USER);
			}
		},
		"list empty enter": {
			key: "Enter",
			collapsed: true,
			format: ["list"],
			empty: true,
			handler(range, context) {
				const formats = { list: false };
				if (context.format.indent) formats.indent = false;
				this.quill.formatLine(range.index, range.length, formats, _quill.default.sources.USER);
			}
		},
		"checklist enter": {
			key: "Enter",
			collapsed: true,
			format: { list: "checked" },
			handler(range) {
				const [line, offset] = this.quill.getLine(range.index);
				const formats = {
					...line.formats(),
					list: "checked"
				};
				const delta = new _quillDelta.default().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, { list: "unchecked" });
				this.quill.updateContents(delta, _quill.default.sources.USER);
				this.quill.setSelection(range.index + 1, _quill.default.sources.SILENT);
				this.quill.scrollSelectionIntoView();
			}
		},
		"header enter": {
			key: "Enter",
			collapsed: true,
			format: ["header"],
			suffix: /^$/,
			handler(range, context) {
				const [line, offset] = this.quill.getLine(range.index);
				const delta = new _quillDelta.default().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, { header: null });
				this.quill.updateContents(delta, _quill.default.sources.USER);
				this.quill.setSelection(range.index + 1, _quill.default.sources.SILENT);
				this.quill.scrollSelectionIntoView();
			}
		},
		"table backspace": {
			key: "Backspace",
			format: ["table"],
			collapsed: true,
			offset: 0,
			handler() {}
		},
		"table delete": {
			key: "Delete",
			format: ["table"],
			collapsed: true,
			suffix: /^$/,
			handler() {}
		},
		"table enter": {
			key: "Enter",
			shiftKey: null,
			format: ["table"],
			handler(range) {
				const module$2 = this.quill.getModule("table");
				if (module$2) {
					const [table, row, cell, offset] = module$2.getTable(range);
					const shift = tableSide(table, row, cell, offset);
					if (shift == null) return;
					let index = table.offset();
					if (shift < 0) {
						const delta = new _quillDelta.default().retain(index).insert("\n");
						this.quill.updateContents(delta, _quill.default.sources.USER);
						this.quill.setSelection(range.index + 1, range.length, _quill.default.sources.SILENT);
					} else if (shift > 0) {
						index += table.length();
						const delta = new _quillDelta.default().retain(index).insert("\n");
						this.quill.updateContents(delta, _quill.default.sources.USER);
						this.quill.setSelection(index, _quill.default.sources.USER);
					}
				}
			}
		},
		"table tab": {
			key: "Tab",
			shiftKey: null,
			format: ["table"],
			handler(range, context) {
				const { event, line: cell } = context;
				const offset = cell.offset(this.quill.scroll);
				if (event.shiftKey) this.quill.setSelection(offset - 1, _quill.default.sources.USER);
				else this.quill.setSelection(offset + cell.length(), _quill.default.sources.USER);
			}
		},
		"list autofill": {
			key: " ",
			shiftKey: null,
			collapsed: true,
			format: {
				"code-block": false,
				blockquote: false,
				table: false
			},
			prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
			handler(range, context) {
				if (this.quill.scroll.query("list") == null) return true;
				const { length } = context.prefix;
				const [line, offset] = this.quill.getLine(range.index);
				if (offset > length) return true;
				let value;
				switch (context.prefix.trim()) {
					case "[]":
					case "[ ]":
						value = "unchecked";
						break;
					case "[x]":
						value = "checked";
						break;
					case "-":
					case "*":
						value = "bullet";
						break;
					default: value = "ordered";
				}
				this.quill.insertText(range.index, " ", _quill.default.sources.USER);
				this.quill.history.cutoff();
				const delta = new _quillDelta.default().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, { list: value });
				this.quill.updateContents(delta, _quill.default.sources.USER);
				this.quill.history.cutoff();
				this.quill.setSelection(range.index - length, _quill.default.sources.SILENT);
				return false;
			}
		},
		"code exit": {
			key: "Enter",
			collapsed: true,
			format: ["code-block"],
			prefix: /^$/,
			suffix: /^\s*$/,
			handler(range) {
				const [line, offset] = this.quill.getLine(range.index);
				let numLines = 2;
				let cur = line;
				while (cur != null && cur.length() <= 1 && cur.formats()["code-block"]) {
					cur = cur.prev;
					numLines -= 1;
					if (numLines <= 0) {
						const delta = new _quillDelta.default().retain(range.index + line.length() - offset - 2).retain(1, { "code-block": null }).delete(1);
						this.quill.updateContents(delta, _quill.default.sources.USER);
						this.quill.setSelection(range.index - 1, _quill.default.sources.SILENT);
						return false;
					}
				}
				return true;
			}
		},
		"embed left": makeEmbedArrowHandler("ArrowLeft", false),
		"embed left shift": makeEmbedArrowHandler("ArrowLeft", true),
		"embed right": makeEmbedArrowHandler("ArrowRight", false),
		"embed right shift": makeEmbedArrowHandler("ArrowRight", true),
		"table down": makeTableArrowHandler(false),
		"table up": makeTableArrowHandler(true)
	} };
	function makeCodeBlockHandler(indent) {
		return {
			key: "Tab",
			shiftKey: !indent,
			format: { "code-block": true },
			handler(range, _ref) {
				let { event } = _ref;
				const { TAB } = this.quill.scroll.query("code-block");
				if (range.length === 0 && !event.shiftKey) {
					this.quill.insertText(range.index, TAB, _quill.default.sources.USER);
					this.quill.setSelection(range.index + TAB.length, _quill.default.sources.SILENT);
					return;
				}
				const lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
				let { index, length } = range;
				lines.forEach((line, i) => {
					if (indent) {
						line.insertAt(0, TAB);
						if (i === 0) index += TAB.length;
						else length += TAB.length;
					} else if (line.domNode.textContent.startsWith(TAB)) {
						line.deleteAt(0, TAB.length);
						if (i === 0) index -= TAB.length;
						else length -= TAB.length;
					}
				});
				this.quill.update(_quill.default.sources.USER);
				this.quill.setSelection(index, length, _quill.default.sources.SILENT);
			}
		};
	}
	function makeEmbedArrowHandler(key, shiftKey) {
		return {
			key,
			shiftKey,
			altKey: null,
			[key === "ArrowLeft" ? "prefix" : "suffix"]: /^$/,
			handler(range) {
				let { index } = range;
				if (key === "ArrowRight") index += range.length + 1;
				const [leaf] = this.quill.getLeaf(index);
				if (!(leaf instanceof _parchment.EmbedBlot)) return true;
				if (key === "ArrowLeft") if (shiftKey) this.quill.setSelection(range.index - 1, range.length + 1, _quill.default.sources.USER);
				else this.quill.setSelection(range.index - 1, _quill.default.sources.USER);
				else if (shiftKey) this.quill.setSelection(range.index, range.length + 1, _quill.default.sources.USER);
				else this.quill.setSelection(range.index + range.length + 1, _quill.default.sources.USER);
				return false;
			}
		};
	}
	function makeFormatHandler(format) {
		return {
			key: format[0],
			shortKey: true,
			handler(range, context) {
				this.quill.format(format, !context.format[format], _quill.default.sources.USER);
			}
		};
	}
	function makeTableArrowHandler(up) {
		return {
			key: up ? "ArrowUp" : "ArrowDown",
			collapsed: true,
			format: ["table"],
			handler(range, context) {
				const key = up ? "prev" : "next";
				const cell = context.line;
				const targetRow = cell.parent[key];
				if (targetRow != null) {
					if (targetRow.statics.blotName === "table-row") {
						let targetCell = targetRow.children.head;
						let cur = cell;
						while (cur.prev != null) {
							cur = cur.prev;
							targetCell = targetCell.next;
						}
						const index = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
						this.quill.setSelection(index, 0, _quill.default.sources.USER);
					}
				} else {
					const targetLine = cell.table()[key];
					if (targetLine != null) if (up) this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, _quill.default.sources.USER);
					else this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, _quill.default.sources.USER);
				}
				return false;
			}
		};
	}
	function normalize(binding) {
		if (typeof binding === "string" || typeof binding === "number") binding = { key: binding };
		else if (typeof binding === "object") binding = (0, _lodashEs.cloneDeep)(binding);
		else return null;
		if (binding.shortKey) {
			binding[SHORTKEY] = binding.shortKey;
			delete binding.shortKey;
		}
		return binding;
	}
	function deleteRange(_ref2) {
		let { quill, range } = _ref2;
		const lines = quill.getLines(range);
		let formats = {};
		if (lines.length > 1) {
			const firstFormats = lines[0].formats();
			const lastFormats = lines[lines.length - 1].formats();
			formats = _quillDelta.AttributeMap.diff(lastFormats, firstFormats) || {};
		}
		quill.deleteText(range, _quill.default.sources.USER);
		if (Object.keys(formats).length > 0) quill.formatLine(range.index, 1, formats, _quill.default.sources.USER);
		quill.setSelection(range.index, _quill.default.sources.SILENT);
	}
	function tableSide(_table, row, cell, offset) {
		if (row.prev == null && row.next == null) {
			if (cell.prev == null && cell.next == null) return offset === 0 ? -1 : 1;
			return cell.prev == null ? -1 : 1;
		}
		if (row.prev == null) return -1;
		if (row.next == null) return 1;
		return null;
	}
}));
//#endregion
//#region ../../node_modules/quill/modules/clipboard.js
var require_clipboard = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.matchAttributor = matchAttributor;
	exports.matchBlot = matchBlot;
	exports.matchNewline = matchNewline;
	exports.matchText = matchText;
	exports.traverse = traverse;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _block = require_block();
	var _logger = _interopRequireDefault(require_logger());
	var _module = _interopRequireDefault(require_module());
	var _quill = _interopRequireDefault(require_quill$1());
	var _align = require_align();
	var _background = require_background();
	var _code = _interopRequireDefault(require_code());
	var _color = require_color();
	var _direction = require_direction();
	var _font = require_font();
	var _size = require_size();
	var _keyboard = require_keyboard();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var debug = (0, _logger.default)("quill:clipboard");
	var CLIPBOARD_CONFIG = [
		[Node.TEXT_NODE, matchText],
		[Node.TEXT_NODE, matchNewline],
		["br", matchBreak],
		[Node.ELEMENT_NODE, matchNewline],
		[Node.ELEMENT_NODE, matchBlot],
		[Node.ELEMENT_NODE, matchAttributor],
		[Node.ELEMENT_NODE, matchStyles],
		["li", matchIndent],
		["ol, ul", matchList],
		["pre", matchCodeBlock],
		["tr", matchTable],
		["b", matchAlias.bind(matchAlias, "bold")],
		["i", matchAlias.bind(matchAlias, "italic")],
		["strike", matchAlias.bind(matchAlias, "strike")],
		["style", matchIgnore]
	];
	var ATTRIBUTE_ATTRIBUTORS = [_align.AlignAttribute, _direction.DirectionAttribute].reduce((memo, attr) => {
		memo[attr.keyName] = attr;
		return memo;
	}, {});
	var STYLE_ATTRIBUTORS = [
		_align.AlignStyle,
		_background.BackgroundStyle,
		_color.ColorStyle,
		_direction.DirectionStyle,
		_font.FontStyle,
		_size.SizeStyle
	].reduce((memo, attr) => {
		memo[attr.keyName] = attr;
		return memo;
	}, {});
	var Clipboard = class extends _module.default {
		constructor(quill, options) {
			super(quill, options);
			this.quill.root.addEventListener("copy", (e) => this.onCaptureCopy(e, false));
			this.quill.root.addEventListener("cut", (e) => this.onCaptureCopy(e, true));
			this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this));
			this.matchers = [];
			CLIPBOARD_CONFIG.concat(this.options.matchers).forEach((_ref) => {
				let [selector, matcher] = _ref;
				this.addMatcher(selector, matcher);
			});
		}
		addMatcher(selector, matcher) {
			this.matchers.push([selector, matcher]);
		}
		convert(_ref2) {
			let { html, text } = _ref2;
			let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			if (formats[_code.default.blotName]) return new _quillDelta.default().insert(text || "", { [_code.default.blotName]: formats[_code.default.blotName] });
			if (!html) return new _quillDelta.default().insert(text || "", formats);
			const delta = this.convertHTML(html);
			if (deltaEndsWith(delta, "\n") && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) return delta.compose(new _quillDelta.default().retain(delta.length() - 1).delete(1));
			return delta;
		}
		convertHTML(html) {
			const container = new DOMParser().parseFromString(html, "text/html").body;
			const nodeMatches = /* @__PURE__ */ new WeakMap();
			const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
			return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
		}
		dangerouslyPasteHTML(index, html) {
			let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _quill.default.sources.API;
			if (typeof index === "string") {
				const delta = this.convert({
					html: index,
					text: ""
				});
				this.quill.setContents(delta, html);
				this.quill.setSelection(0, _quill.default.sources.SILENT);
			} else {
				const paste = this.convert({
					html,
					text: ""
				});
				this.quill.updateContents(new _quillDelta.default().retain(index).concat(paste), source);
				this.quill.setSelection(index + paste.length(), _quill.default.sources.SILENT);
			}
		}
		onCaptureCopy(e) {
			let isCut = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			if (e.defaultPrevented) return;
			e.preventDefault();
			const [range] = this.quill.selection.getRange();
			if (range == null) return;
			const { html, text } = this.onCopy(range, isCut);
			e.clipboardData?.setData("text/plain", text);
			e.clipboardData?.setData("text/html", html);
			if (isCut) (0, _keyboard.deleteRange)({
				range,
				quill: this.quill
			});
		}
		onCapturePaste(e) {
			if (e.defaultPrevented || !this.quill.isEnabled()) return;
			e.preventDefault();
			const range = this.quill.getSelection(true);
			if (range == null) return;
			const html = e.clipboardData?.getData("text/html");
			const text = e.clipboardData?.getData("text/plain");
			const files = Array.from(e.clipboardData?.files || []);
			if (!html && files.length > 0) {
				this.quill.uploader.upload(range, files);
				return;
			}
			if (html && files.length > 0) {
				const doc = new DOMParser().parseFromString(html, "text/html");
				if (doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === "IMG") {
					this.quill.uploader.upload(range, files);
					return;
				}
			}
			this.onPaste(range, {
				html,
				text
			});
		}
		onCopy(range) {
			const text = this.quill.getText(range);
			return {
				html: this.quill.getSemanticHTML(range),
				text
			};
		}
		onPaste(range, _ref3) {
			let { text, html } = _ref3;
			const formats = this.quill.getFormat(range.index);
			const pastedDelta = this.convert({
				text,
				html
			}, formats);
			debug.log("onPaste", pastedDelta, {
				text,
				html
			});
			const delta = new _quillDelta.default().retain(range.index).delete(range.length).concat(pastedDelta);
			this.quill.updateContents(delta, _quill.default.sources.USER);
			this.quill.setSelection(delta.length() - range.length, _quill.default.sources.SILENT);
			this.quill.scrollSelectionIntoView();
		}
		prepareMatching(container, nodeMatches) {
			const elementMatchers = [];
			const textMatchers = [];
			this.matchers.forEach((pair) => {
				const [selector, matcher] = pair;
				switch (selector) {
					case Node.TEXT_NODE:
						textMatchers.push(matcher);
						break;
					case Node.ELEMENT_NODE:
						elementMatchers.push(matcher);
						break;
					default:
						Array.from(container.querySelectorAll(selector)).forEach((node) => {
							if (nodeMatches.has(node)) nodeMatches.get(node)?.push(matcher);
							else nodeMatches.set(node, [matcher]);
						});
						break;
				}
			});
			return [elementMatchers, textMatchers];
		}
	};
	exports.default = Clipboard;
	Clipboard.DEFAULTS = { matchers: [] };
	function applyFormat(delta, format, value) {
		if (typeof format === "object") return Object.keys(format).reduce((newDelta, key) => {
			return applyFormat(newDelta, key, format[key]);
		}, delta);
		return delta.reduce((newDelta, op) => {
			if (op.attributes && op.attributes[format]) return newDelta.push(op);
			const formats = value ? { [format]: value } : {};
			return newDelta.insert(op.insert, {
				...formats,
				...op.attributes
			});
		}, new _quillDelta.default());
	}
	function deltaEndsWith(delta, text) {
		let endText = "";
		for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
			const op = delta.ops[i];
			if (typeof op.insert !== "string") break;
			endText = op.insert + endText;
		}
		return endText.slice(-1 * text.length) === text;
	}
	function isLine(node) {
		if (node.childNodes.length === 0) return false;
		return [
			"address",
			"article",
			"blockquote",
			"canvas",
			"dd",
			"div",
			"dl",
			"dt",
			"fieldset",
			"figcaption",
			"figure",
			"footer",
			"form",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"header",
			"iframe",
			"li",
			"main",
			"nav",
			"ol",
			"output",
			"p",
			"pre",
			"section",
			"table",
			"td",
			"tr",
			"ul",
			"video"
		].includes(node.tagName.toLowerCase());
	}
	var preNodes = /* @__PURE__ */ new WeakMap();
	function isPre(node) {
		if (node == null) return false;
		if (!preNodes.has(node)) if (node.tagName === "PRE") preNodes.set(node, true);
		else preNodes.set(node, isPre(node.parentNode));
		return preNodes.get(node);
	}
	function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
		if (node.nodeType === node.TEXT_NODE) return textMatchers.reduce((delta, matcher) => {
			return matcher(node, delta, scroll);
		}, new _quillDelta.default());
		if (node.nodeType === node.ELEMENT_NODE) return Array.from(node.childNodes || []).reduce((delta, childNode) => {
			let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
			if (childNode.nodeType === node.ELEMENT_NODE) {
				childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
					return matcher(childNode, reducedDelta, scroll);
				}, childrenDelta);
				childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
					return matcher(childNode, reducedDelta, scroll);
				}, childrenDelta);
			}
			return delta.concat(childrenDelta);
		}, new _quillDelta.default());
		return new _quillDelta.default();
	}
	function matchAlias(format, node, delta) {
		return applyFormat(delta, format, true);
	}
	function matchAttributor(node, delta, scroll) {
		const attributes = _parchment.Attributor.keys(node);
		const classes = _parchment.ClassAttributor.keys(node);
		const styles = _parchment.StyleAttributor.keys(node);
		const formats = {};
		attributes.concat(classes).concat(styles).forEach((name) => {
			let attr = scroll.query(name, _parchment.Scope.ATTRIBUTE);
			if (attr != null) {
				formats[attr.attrName] = attr.value(node);
				if (formats[attr.attrName]) return;
			}
			attr = ATTRIBUTE_ATTRIBUTORS[name];
			if (attr != null && (attr.attrName === name || attr.keyName === name)) formats[attr.attrName] = attr.value(node) || void 0;
			attr = STYLE_ATTRIBUTORS[name];
			if (attr != null && (attr.attrName === name || attr.keyName === name)) {
				attr = STYLE_ATTRIBUTORS[name];
				formats[attr.attrName] = attr.value(node) || void 0;
			}
		});
		if (Object.keys(formats).length > 0) return applyFormat(delta, formats);
		return delta;
	}
	function matchBlot(node, delta, scroll) {
		const match = scroll.query(node);
		if (match == null) return delta;
		if (match.prototype instanceof _parchment.EmbedBlot) {
			const embed = {};
			const value = match.value(node);
			if (value != null) {
				embed[match.blotName] = value;
				return new _quillDelta.default().insert(embed, match.formats(node, scroll));
			}
		} else {
			if (match.prototype instanceof _parchment.BlockBlot && !deltaEndsWith(delta, "\n")) delta.insert("\n");
			if (typeof match.formats === "function") return applyFormat(delta, match.blotName, match.formats(node, scroll));
		}
		return delta;
	}
	function matchBreak(node, delta) {
		if (!deltaEndsWith(delta, "\n")) delta.insert("\n");
		return delta;
	}
	function matchCodeBlock(node, delta, scroll) {
		const match = scroll.query("code-block");
		return applyFormat(delta, "code-block", match ? match.formats(node, scroll) : true);
	}
	function matchIgnore() {
		return new _quillDelta.default();
	}
	function matchIndent(node, delta, scroll) {
		const match = scroll.query(node);
		if (match == null || match.blotName !== "list" || !deltaEndsWith(delta, "\n")) return delta;
		let indent = -1;
		let parent = node.parentNode;
		while (parent != null) {
			if (["OL", "UL"].includes(parent.tagName)) indent += 1;
			parent = parent.parentNode;
		}
		if (indent <= 0) return delta;
		return delta.reduce((composed, op) => {
			if (op.attributes && typeof op.attributes.indent === "number") return composed.push(op);
			return composed.insert(op.insert, {
				indent,
				...op.attributes || {}
			});
		}, new _quillDelta.default());
	}
	function matchList(node, delta) {
		return applyFormat(delta, "list", node.tagName === "OL" ? "ordered" : "bullet");
	}
	function matchNewline(node, delta, scroll) {
		if (!deltaEndsWith(delta, "\n")) {
			if (isLine(node)) return delta.insert("\n");
			if (delta.length() > 0 && node.nextSibling) {
				let nextSibling = node.nextSibling;
				while (nextSibling != null) {
					if (isLine(nextSibling)) return delta.insert("\n");
					const match = scroll.query(nextSibling);
					if (match && match.prototype instanceof _block.BlockEmbed) return delta.insert("\n");
					nextSibling = nextSibling.firstChild;
				}
			}
		}
		return delta;
	}
	function matchStyles(node, delta) {
		const formats = {};
		const style = node.style || {};
		if (style.fontStyle === "italic") formats.italic = true;
		if (style.textDecoration === "underline") formats.underline = true;
		if (style.textDecoration === "line-through") formats.strike = true;
		if (style.fontWeight?.startsWith("bold") || parseInt(style.fontWeight, 10) >= 700) formats.bold = true;
		if (Object.keys(formats).length > 0) delta = applyFormat(delta, formats);
		if (parseFloat(style.textIndent || 0) > 0) return new _quillDelta.default().insert("	").concat(delta);
		return delta;
	}
	function matchTable(node, delta) {
		const table = node.parentElement?.tagName === "TABLE" ? node.parentElement : node.parentElement?.parentElement;
		if (table != null) return applyFormat(delta, "table", Array.from(table.querySelectorAll("tr")).indexOf(node) + 1);
	}
	function matchText(node, delta) {
		let text = node.data;
		if (node.parentElement?.tagName === "O:P") return delta.insert(text.trim());
		if (!isPre(node)) {
			if (text.trim().length === 0 && text.includes("\n")) return delta;
			const replacer = (collapse, match) => {
				const replaced = match.replace(/[^\u00a0]/g, "");
				return replaced.length < 1 && collapse ? " " : replaced;
			};
			text = text.replace(/\r\n/g, " ").replace(/\n/g, " ");
			text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
			if (node.previousSibling == null && node.parentElement != null && isLine(node.parentElement) || node.previousSibling instanceof Element && isLine(node.previousSibling)) text = text.replace(/^\s+/, replacer.bind(replacer, false));
			if (node.nextSibling == null && node.parentElement != null && isLine(node.parentElement) || node.nextSibling instanceof Element && isLine(node.nextSibling)) text = text.replace(/\s+$/, replacer.bind(replacer, false));
		}
		return delta.insert(text);
	}
}));
//#endregion
//#region ../../node_modules/quill/modules/history.js
var require_history = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.getLastChangeIndex = getLastChangeIndex;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _module = _interopRequireDefault(require_module());
	var _quill = _interopRequireDefault(require_quill$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var History = class extends _module.default {
		lastRecorded = 0;
		ignoreChange = false;
		stack = {
			undo: [],
			redo: []
		};
		currentRange = null;
		constructor(quill, options) {
			super(quill, options);
			this.quill.on(_quill.default.events.EDITOR_CHANGE, (eventName, value, oldValue, source) => {
				if (eventName === _quill.default.events.SELECTION_CHANGE) {
					if (value && source !== _quill.default.sources.SILENT) this.currentRange = value;
				} else if (eventName === _quill.default.events.TEXT_CHANGE) {
					if (!this.ignoreChange) if (!this.options.userOnly || source === _quill.default.sources.USER) this.record(value, oldValue);
					else this.transform(value);
					this.currentRange = transformRange(this.currentRange, value);
				}
			});
			this.quill.keyboard.addBinding({
				key: "z",
				shortKey: true
			}, this.undo.bind(this));
			this.quill.keyboard.addBinding({
				key: ["z", "Z"],
				shortKey: true,
				shiftKey: true
			}, this.redo.bind(this));
			if (/Win/i.test(navigator.platform)) this.quill.keyboard.addBinding({
				key: "y",
				shortKey: true
			}, this.redo.bind(this));
			this.quill.root.addEventListener("beforeinput", (event) => {
				if (event.inputType === "historyUndo") {
					this.undo();
					event.preventDefault();
				} else if (event.inputType === "historyRedo") {
					this.redo();
					event.preventDefault();
				}
			});
		}
		change(source, dest) {
			if (this.stack[source].length === 0) return;
			const item = this.stack[source].pop();
			if (!item) return;
			const base = this.quill.getContents();
			const inverseDelta = item.delta.invert(base);
			this.stack[dest].push({
				delta: inverseDelta,
				range: transformRange(item.range, inverseDelta)
			});
			this.lastRecorded = 0;
			this.ignoreChange = true;
			this.quill.updateContents(item.delta, _quill.default.sources.USER);
			this.ignoreChange = false;
			this.restoreSelection(item);
		}
		clear() {
			this.stack = {
				undo: [],
				redo: []
			};
		}
		cutoff() {
			this.lastRecorded = 0;
		}
		record(changeDelta, oldDelta) {
			if (changeDelta.ops.length === 0) return;
			this.stack.redo = [];
			let undoDelta = changeDelta.invert(oldDelta);
			let undoRange = this.currentRange;
			const timestamp = Date.now();
			if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
				const item = this.stack.undo.pop();
				if (item) {
					undoDelta = undoDelta.compose(item.delta);
					undoRange = item.range;
				}
			} else this.lastRecorded = timestamp;
			if (undoDelta.length() === 0) return;
			this.stack.undo.push({
				delta: undoDelta,
				range: undoRange
			});
			if (this.stack.undo.length > this.options.maxStack) this.stack.undo.shift();
		}
		redo() {
			this.change("redo", "undo");
		}
		transform(delta) {
			transformStack(this.stack.undo, delta);
			transformStack(this.stack.redo, delta);
		}
		undo() {
			this.change("undo", "redo");
		}
		restoreSelection(stackItem) {
			if (stackItem.range) this.quill.setSelection(stackItem.range, _quill.default.sources.USER);
			else {
				const index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
				this.quill.setSelection(index, _quill.default.sources.USER);
			}
		}
	};
	exports.default = History;
	History.DEFAULTS = {
		delay: 1e3,
		maxStack: 100,
		userOnly: false
	};
	function transformStack(stack, delta) {
		let remoteDelta = delta;
		for (let i = stack.length - 1; i >= 0; i -= 1) {
			const oldItem = stack[i];
			stack[i] = {
				delta: remoteDelta.transform(oldItem.delta, true),
				range: oldItem.range && transformRange(oldItem.range, remoteDelta)
			};
			remoteDelta = oldItem.delta.transform(remoteDelta);
			if (stack[i].delta.length() === 0) stack.splice(i, 1);
		}
	}
	function endsWithNewlineChange(scroll, delta) {
		const lastOp = delta.ops[delta.ops.length - 1];
		if (lastOp == null) return false;
		if (lastOp.insert != null) return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
		if (lastOp.attributes != null) return Object.keys(lastOp.attributes).some((attr) => {
			return scroll.query(attr, _parchment.Scope.BLOCK) != null;
		});
		return false;
	}
	function getLastChangeIndex(scroll, delta) {
		const deleteLength = delta.reduce((length, op) => {
			return length + (op.delete || 0);
		}, 0);
		let changeIndex = delta.length() - deleteLength;
		if (endsWithNewlineChange(scroll, delta)) changeIndex -= 1;
		return changeIndex;
	}
	function transformRange(range, delta) {
		if (!range) return range;
		const start = delta.transformPosition(range.index);
		return {
			index: start,
			length: delta.transformPosition(range.index + range.length) - start
		};
	}
}));
//#endregion
//#region ../../node_modules/quill/modules/uploader.js
var require_uploader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _emitter = _interopRequireDefault(require_emitter());
	var _module = _interopRequireDefault(require_module());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Uploader = class extends _module.default {
		constructor(quill, options) {
			super(quill, options);
			quill.root.addEventListener("drop", (e) => {
				e.preventDefault();
				let native = null;
				if (document.caretRangeFromPoint) native = document.caretRangeFromPoint(e.clientX, e.clientY);
				else if (document.caretPositionFromPoint) {
					const position = document.caretPositionFromPoint(e.clientX, e.clientY);
					native = document.createRange();
					native.setStart(position.offsetNode, position.offset);
					native.setEnd(position.offsetNode, position.offset);
				}
				const normalized = native && quill.selection.normalizeNative(native);
				if (normalized) {
					const range = quill.selection.normalizedToRange(normalized);
					if (e.dataTransfer?.files) this.upload(range, e.dataTransfer.files);
				}
			});
		}
		upload(range, files) {
			const uploads = [];
			Array.from(files).forEach((file) => {
				if (file && this.options.mimetypes?.includes(file.type)) uploads.push(file);
			});
			if (uploads.length > 0) this.options.handler.call(this, range, uploads);
		}
	};
	Uploader.DEFAULTS = {
		mimetypes: ["image/png", "image/jpeg"],
		handler(range, files) {
			const promises = files.map((file) => {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = (e) => {
						resolve(e.target.result);
					};
					reader.readAsDataURL(file);
				});
			});
			Promise.all(promises).then((images) => {
				const update = images.reduce((delta, image) => {
					return delta.insert({ image });
				}, new _quillDelta.default().retain(range.index).delete(range.length));
				this.quill.updateContents(update, _emitter.default.sources.USER);
				this.quill.setSelection(range.index + images.length, _emitter.default.sources.SILENT);
			});
		}
	};
	exports.default = Uploader;
}));
//#endregion
//#region ../../node_modules/quill/modules/input.js
var require_input = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _module = _interopRequireDefault(require_module());
	var _quill = _interopRequireDefault(require_quill$1());
	var _keyboard = require_keyboard();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var INSERT_TYPES = ["insertText", "insertReplacementText"];
	var Input = class extends _module.default {
		constructor(quill, options) {
			super(quill, options);
			quill.root.addEventListener("beforeinput", (event) => {
				this.handleBeforeInput(event);
			});
			if (!/Android/i.test(navigator.userAgent)) quill.on(_quill.default.events.COMPOSITION_BEFORE_START, () => {
				this.handleCompositionStart();
			});
		}
		deleteRange(range) {
			(0, _keyboard.deleteRange)({
				range,
				quill: this.quill
			});
		}
		replaceText(range) {
			let text = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
			if (range.length === 0) return false;
			if (text) {
				const formats = this.quill.getFormat(range.index, 1);
				this.deleteRange(range);
				this.quill.updateContents(new _quillDelta.default().retain(range.index).insert(text, formats), _quill.default.sources.USER);
			} else this.deleteRange(range);
			this.quill.setSelection(range.index + text.length, 0, _quill.default.sources.SILENT);
			return true;
		}
		handleBeforeInput(event) {
			if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) return;
			const staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
			if (!staticRange || staticRange.collapsed === true) return;
			const text = getPlainTextFromInputEvent(event);
			if (text == null) return;
			const normalized = this.quill.selection.normalizeNative(staticRange);
			const range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
			if (range && this.replaceText(range, text)) event.preventDefault();
		}
		handleCompositionStart() {
			const range = this.quill.getSelection();
			if (range) this.replaceText(range);
		}
	};
	function getPlainTextFromInputEvent(event) {
		if (typeof event.data === "string") return event.data;
		if (event.dataTransfer?.types.includes("text/plain")) return event.dataTransfer.getData("text/plain");
		return null;
	}
	exports.default = Input;
}));
//#endregion
//#region ../../node_modules/quill/modules/uiNode.js
var require_uiNode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.TTL_FOR_VALID_SELECTION_CHANGE = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _module = _interopRequireDefault(require_module());
	var _quill = _interopRequireDefault(require_quill$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var isMac = /Mac/i.test(navigator.platform);
	var TTL_FOR_VALID_SELECTION_CHANGE = exports.TTL_FOR_VALID_SELECTION_CHANGE = 100;
	var canMoveCaretBeforeUINode = (event) => {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Home") return true;
		if (isMac && event.key === "a" && event.ctrlKey === true) return true;
		return false;
	};
	var UINode = class extends _module.default {
		isListening = false;
		selectionChangeDeadline = 0;
		constructor(quill, options) {
			super(quill, options);
			this.handleArrowKeys();
			this.handleNavigationShortcuts();
		}
		handleArrowKeys() {
			this.quill.keyboard.addBinding({
				key: ["ArrowLeft", "ArrowRight"],
				offset: 0,
				shiftKey: null,
				handler(range, _ref) {
					let { line, event } = _ref;
					if (!(line instanceof _parchment.ParentBlot) || !line.uiNode) return true;
					const isRTL = getComputedStyle(line.domNode)["direction"] === "rtl";
					if (isRTL && event.key !== "ArrowRight" || !isRTL && event.key !== "ArrowLeft") return true;
					this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), _quill.default.sources.USER);
					return false;
				}
			});
		}
		handleNavigationShortcuts() {
			this.quill.root.addEventListener("keydown", (event) => {
				if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) this.ensureListeningToSelectionChange();
			});
		}
		/**
		* We only listen to the `selectionchange` event when
		* there is an intention of moving the caret to the beginning using shortcuts.
		* This is primarily implemented to prevent infinite loops, as we are changing
		* the selection within the handler of a `selectionchange` event.
		*/
		ensureListeningToSelectionChange() {
			this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
			if (this.isListening) return;
			this.isListening = true;
			const listener = () => {
				this.isListening = false;
				if (Date.now() <= this.selectionChangeDeadline) this.handleSelectionChange();
			};
			document.addEventListener("selectionchange", listener, { once: true });
		}
		handleSelectionChange() {
			const selection = document.getSelection();
			if (!selection) return;
			const range = selection.getRangeAt(0);
			if (range.collapsed !== true || range.startOffset !== 0) return;
			const line = this.quill.scroll.find(range.startContainer);
			if (!(line instanceof _parchment.ParentBlot) || !line.uiNode) return;
			const newRange = document.createRange();
			newRange.setStartAfter(line.uiNode);
			newRange.setEndAfter(line.uiNode);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	};
	exports.default = UINode;
}));
//#endregion
//#region ../../node_modules/quill/core.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "AttributeMap", {
		enumerable: true,
		get: function() {
			return _quillDelta.AttributeMap;
		}
	});
	Object.defineProperty(exports, "Delta", {
		enumerable: true,
		get: function() {
			return _quillDelta.default;
		}
	});
	Object.defineProperty(exports, "Op", {
		enumerable: true,
		get: function() {
			return _quillDelta.Op;
		}
	});
	Object.defineProperty(exports, "OpIterator", {
		enumerable: true,
		get: function() {
			return _quillDelta.OpIterator;
		}
	});
	exports.default = void 0;
	var _quill = _interopRequireDefault(require_quill$1());
	var _block = _interopRequireWildcard(require_block());
	var _break = _interopRequireDefault(require_break());
	var _container = _interopRequireDefault(require_container());
	var _cursor = _interopRequireDefault(require_cursor());
	var _embed = _interopRequireDefault(require_embed());
	var _inline = _interopRequireDefault(require_inline());
	var _scroll = _interopRequireDefault(require_scroll());
	var _text = _interopRequireDefault(require_text());
	var _clipboard = _interopRequireDefault(require_clipboard());
	var _history = _interopRequireDefault(require_history());
	var _keyboard = _interopRequireDefault(require_keyboard());
	var _uploader = _interopRequireDefault(require_uploader());
	var _quillDelta = _interopRequireWildcard(require_Delta());
	var _input = _interopRequireDefault(require_input());
	var _uiNode = _interopRequireDefault(require_uiNode());
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	_quill.default.register({
		"blots/block": _block.default,
		"blots/block/embed": _block.BlockEmbed,
		"blots/break": _break.default,
		"blots/container": _container.default,
		"blots/cursor": _cursor.default,
		"blots/embed": _embed.default,
		"blots/inline": _inline.default,
		"blots/scroll": _scroll.default,
		"blots/text": _text.default,
		"modules/clipboard": _clipboard.default,
		"modules/history": _history.default,
		"modules/keyboard": _keyboard.default,
		"modules/uploader": _uploader.default,
		"modules/input": _input.default,
		"modules/uiNode": _uiNode.default
	});
	exports.default = _quill.default;
}));
//#endregion
//#region ../../node_modules/quill/formats/indent.js
var require_indent = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var IndentAttributor = class extends _parchment.ClassAttributor {
		add(node, value) {
			let normalizedValue = 0;
			if (value === "+1" || value === "-1") {
				const indent = this.value(node) || 0;
				normalizedValue = value === "+1" ? indent + 1 : indent - 1;
			} else if (typeof value === "number") normalizedValue = value;
			if (normalizedValue === 0) {
				this.remove(node);
				return true;
			}
			return super.add(node, normalizedValue.toString());
		}
		canAdd(node, value) {
			return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
		}
		value(node) {
			return parseInt(super.value(node), 10) || void 0;
		}
	};
	exports.default = new IndentAttributor("indent", "ql-indent", {
		scope: _parchment.Scope.BLOCK,
		whitelist: [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		]
	});
}));
//#endregion
//#region ../../node_modules/quill/formats/blockquote.js
var require_blockquote = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _block = _interopRequireDefault(require_block());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Blockquote = class extends _block.default {
		static blotName = "blockquote";
		static tagName = "blockquote";
	};
	exports.default = Blockquote;
}));
//#endregion
//#region ../../node_modules/quill/formats/header.js
var require_header = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _block = _interopRequireDefault(require_block());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Header = class extends _block.default {
		static blotName = "header";
		static tagName = [
			"H1",
			"H2",
			"H3",
			"H4",
			"H5",
			"H6"
		];
		static formats(domNode) {
			return this.tagName.indexOf(domNode.tagName) + 1;
		}
	};
	exports.default = Header;
}));
//#endregion
//#region ../../node_modules/quill/formats/list.js
var require_list = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.ListContainer = void 0;
	var _block = _interopRequireDefault(require_block());
	var _container = _interopRequireDefault(require_container());
	var _quill = _interopRequireDefault(require_quill$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var ListContainer = class extends _container.default {};
	exports.ListContainer = ListContainer;
	ListContainer.blotName = "list-container";
	ListContainer.tagName = "OL";
	var ListItem = class extends _block.default {
		static create(value) {
			const node = super.create();
			node.setAttribute("data-list", value);
			return node;
		}
		static formats(domNode) {
			return domNode.getAttribute("data-list") || void 0;
		}
		static register() {
			_quill.default.register(ListContainer);
		}
		constructor(scroll, domNode) {
			super(scroll, domNode);
			const ui = domNode.ownerDocument.createElement("span");
			const listEventHandler = (e) => {
				if (!scroll.isEnabled()) return;
				const format = this.statics.formats(domNode, scroll);
				if (format === "checked") {
					this.format("list", "unchecked");
					e.preventDefault();
				} else if (format === "unchecked") {
					this.format("list", "checked");
					e.preventDefault();
				}
			};
			ui.addEventListener("mousedown", listEventHandler);
			ui.addEventListener("touchstart", listEventHandler);
			this.attachUI(ui);
		}
		format(name, value) {
			if (name === this.statics.blotName && value) this.domNode.setAttribute("data-list", value);
			else super.format(name, value);
		}
	};
	exports.default = ListItem;
	ListItem.blotName = "list";
	ListItem.tagName = "LI";
	ListContainer.allowedChildren = [ListItem];
	ListItem.requiredContainer = ListContainer;
}));
//#endregion
//#region ../../node_modules/quill/formats/bold.js
var require_bold = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _inline = _interopRequireDefault(require_inline());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Bold = class extends _inline.default {
		static blotName = "bold";
		static tagName = ["STRONG", "B"];
		static create() {
			return super.create();
		}
		static formats() {
			return true;
		}
		optimize(context) {
			super.optimize(context);
			if (this.domNode.tagName !== this.statics.tagName[0]) this.replaceWith(this.statics.blotName);
		}
	};
	exports.default = Bold;
}));
//#endregion
//#region ../../node_modules/quill/formats/italic.js
var require_italic = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _bold = _interopRequireDefault(require_bold());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Italic = class extends _bold.default {
		static blotName = "italic";
		static tagName = ["EM", "I"];
	};
	exports.default = Italic;
}));
//#endregion
//#region ../../node_modules/quill/formats/link.js
var require_link = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.sanitize = sanitize;
	var _inline = _interopRequireDefault(require_inline());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Link = class extends _inline.default {
		static blotName = "link";
		static tagName = "A";
		static SANITIZED_URL = "about:blank";
		static PROTOCOL_WHITELIST = [
			"http",
			"https",
			"mailto",
			"tel",
			"sms"
		];
		static create(value) {
			const node = super.create(value);
			node.setAttribute("href", this.sanitize(value));
			node.setAttribute("rel", "noopener noreferrer");
			node.setAttribute("target", "_blank");
			return node;
		}
		static formats(domNode) {
			return domNode.getAttribute("href");
		}
		static sanitize(url) {
			return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
		}
		format(name, value) {
			if (name !== this.statics.blotName || !value) super.format(name, value);
			else this.domNode.setAttribute("href", this.constructor.sanitize(value));
		}
	};
	exports.default = Link;
	function sanitize(url, protocols) {
		const anchor = document.createElement("a");
		anchor.href = url;
		const protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
		return protocols.indexOf(protocol) > -1;
	}
}));
//#endregion
//#region ../../node_modules/quill/formats/script.js
var require_script = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _inline = _interopRequireDefault(require_inline());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Script = class extends _inline.default {
		static blotName = "script";
		static tagName = ["SUB", "SUP"];
		static create(value) {
			if (value === "super") return document.createElement("sup");
			if (value === "sub") return document.createElement("sub");
			return super.create(value);
		}
		static formats(domNode) {
			if (domNode.tagName === "SUB") return "sub";
			if (domNode.tagName === "SUP") return "super";
		}
	};
	exports.default = Script;
}));
//#endregion
//#region ../../node_modules/quill/formats/strike.js
var require_strike = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _bold = _interopRequireDefault(require_bold());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Strike = class extends _bold.default {
		static blotName = "strike";
		static tagName = ["S", "STRIKE"];
	};
	exports.default = Strike;
}));
//#endregion
//#region ../../node_modules/quill/formats/underline.js
var require_underline = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _inline = _interopRequireDefault(require_inline());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Underline = class extends _inline.default {
		static blotName = "underline";
		static tagName = "U";
	};
	exports.default = Underline;
}));
//#endregion
//#region ../../node_modules/quill/formats/formula.js
var require_formula = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _embed = _interopRequireDefault(require_embed());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Formula = class extends _embed.default {
		static blotName = "formula";
		static className = "ql-formula";
		static tagName = "SPAN";
		static create(value) {
			if (window.katex == null) throw new Error("Formula module requires KaTeX.");
			const node = super.create(value);
			if (typeof value === "string") {
				window.katex.render(value, node, {
					throwOnError: false,
					errorColor: "#f00"
				});
				node.setAttribute("data-value", value);
			}
			return node;
		}
		static value(domNode) {
			return domNode.getAttribute("data-value");
		}
		html() {
			const { formula } = this.value();
			return `<span>${formula}</span>`;
		}
	};
	exports.default = Formula;
}));
//#endregion
//#region ../../node_modules/quill/formats/image.js
var require_image = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _link = require_link();
	var ATTRIBUTES = [
		"alt",
		"height",
		"width"
	];
	var Image = class extends _parchment.EmbedBlot {
		static blotName = "image";
		static tagName = "IMG";
		static create(value) {
			const node = super.create(value);
			if (typeof value === "string") node.setAttribute("src", this.sanitize(value));
			return node;
		}
		static formats(domNode) {
			return ATTRIBUTES.reduce((formats, attribute) => {
				if (domNode.hasAttribute(attribute)) formats[attribute] = domNode.getAttribute(attribute);
				return formats;
			}, {});
		}
		static match(url) {
			return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
		}
		static register() {
			if (/Firefox/i.test(navigator.userAgent)) setTimeout(() => {
				document.execCommand("enableObjectResizing", false, false);
			}, 1);
		}
		static sanitize(url) {
			return (0, _link.sanitize)(url, [
				"http",
				"https",
				"data"
			]) ? url : "//:0";
		}
		static value(domNode) {
			return domNode.getAttribute("src");
		}
		format(name, value) {
			if (ATTRIBUTES.indexOf(name) > -1) if (value) this.domNode.setAttribute(name, value);
			else this.domNode.removeAttribute(name);
			else super.format(name, value);
		}
	};
	exports.default = Image;
}));
//#endregion
//#region ../../node_modules/quill/formats/video.js
var require_video = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _block = require_block();
	var _link = _interopRequireDefault(require_link());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var ATTRIBUTES = ["height", "width"];
	var Video = class extends _block.BlockEmbed {
		static blotName = "video";
		static className = "ql-video";
		static tagName = "IFRAME";
		static create(value) {
			const node = super.create(value);
			node.setAttribute("frameborder", "0");
			node.setAttribute("allowfullscreen", "true");
			node.setAttribute("src", this.sanitize(value));
			return node;
		}
		static formats(domNode) {
			return ATTRIBUTES.reduce((formats, attribute) => {
				if (domNode.hasAttribute(attribute)) formats[attribute] = domNode.getAttribute(attribute);
				return formats;
			}, {});
		}
		static sanitize(url) {
			return _link.default.sanitize(url);
		}
		static value(domNode) {
			return domNode.getAttribute("src");
		}
		format(name, value) {
			if (ATTRIBUTES.indexOf(name) > -1) if (value) this.domNode.setAttribute(name, value);
			else this.domNode.removeAttribute(name);
			else super.format(name, value);
		}
		html() {
			const { video } = this.value();
			return `<a href="${video}">${video}</a>`;
		}
	};
	exports.default = Video;
}));
//#endregion
//#region ../../node_modules/quill/modules/syntax.js
var require_syntax = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.CodeToken = exports.CodeBlock = void 0;
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _inline = _interopRequireDefault(require_inline());
	var _quill = _interopRequireDefault(require_quill$1());
	var _module = _interopRequireDefault(require_module());
	var _block = require_block();
	var _break = _interopRequireDefault(require_break());
	var _cursor = _interopRequireDefault(require_cursor());
	var _text = _interopRequireWildcard(require_text());
	var _code = _interopRequireWildcard(require_code());
	var _clipboard = require_clipboard();
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var TokenAttributor = new _parchment.ClassAttributor("code-token", "hljs", { scope: _parchment.Scope.INLINE });
	var CodeToken = class CodeToken extends _inline.default {
		static formats(node, scroll) {
			while (node != null && node !== scroll.domNode) {
				if (node.classList && node.classList.contains(_code.default.className)) return super.formats(node, scroll);
				node = node.parentNode;
			}
		}
		constructor(scroll, domNode, value) {
			super(scroll, domNode, value);
			TokenAttributor.add(this.domNode, value);
		}
		format(format, value) {
			if (format !== CodeToken.blotName) super.format(format, value);
			else if (value) TokenAttributor.add(this.domNode, value);
			else {
				TokenAttributor.remove(this.domNode);
				this.domNode.classList.remove(this.statics.className);
			}
		}
		optimize() {
			super.optimize(...arguments);
			if (!TokenAttributor.value(this.domNode)) this.unwrap();
		}
	};
	exports.CodeToken = CodeToken;
	CodeToken.blotName = "code-token";
	CodeToken.className = "ql-token";
	var SyntaxCodeBlock = class extends _code.default {
		static create(value) {
			const domNode = super.create(value);
			if (typeof value === "string") domNode.setAttribute("data-language", value);
			return domNode;
		}
		static formats(domNode) {
			return domNode.getAttribute("data-language") || "plain";
		}
		static register() {}
		format(name, value) {
			if (name === this.statics.blotName && value) this.domNode.setAttribute("data-language", value);
			else super.format(name, value);
		}
		replaceWith(name, value) {
			this.formatAt(0, this.length(), CodeToken.blotName, false);
			return super.replaceWith(name, value);
		}
	};
	exports.CodeBlock = SyntaxCodeBlock;
	var SyntaxCodeBlockContainer = class extends _code.CodeBlockContainer {
		attach() {
			super.attach();
			this.forceNext = false;
			this.scroll.emitMount(this);
		}
		format(name, value) {
			if (name === SyntaxCodeBlock.blotName) {
				this.forceNext = true;
				this.children.forEach((child) => {
					child.format(name, value);
				});
			}
		}
		formatAt(index, length, name, value) {
			if (name === SyntaxCodeBlock.blotName) this.forceNext = true;
			super.formatAt(index, length, name, value);
		}
		highlight(highlight) {
			let forced = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			if (this.children.head == null) return;
			const text = `${Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).map((node) => node.textContent).join("\n")}\n`;
			const language = SyntaxCodeBlock.formats(this.children.head.domNode);
			if (forced || this.forceNext || this.cachedText !== text) {
				if (text.trim().length > 0 || this.cachedText == null) {
					const oldDelta = this.children.reduce((delta, child) => {
						return delta.concat((0, _block.blockDelta)(child, false));
					}, new _quillDelta.default());
					const delta = highlight(text, language);
					oldDelta.diff(delta).reduce((index, _ref) => {
						let { retain, attributes } = _ref;
						if (!retain) return index;
						if (attributes) Object.keys(attributes).forEach((format) => {
							if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) this.formatAt(index, retain, format, attributes[format]);
						});
						return index + retain;
					}, 0);
				}
				this.cachedText = text;
				this.forceNext = false;
			}
		}
		html(index, length) {
			const [codeBlock] = this.children.find(index);
			return `<pre data-language="${codeBlock ? SyntaxCodeBlock.formats(codeBlock.domNode) : "plain"}">\n${(0, _text.escapeText)(this.code(index, length))}\n</pre>`;
		}
		optimize(context) {
			super.optimize(context);
			if (this.parent != null && this.children.head != null && this.uiNode != null) {
				const language = SyntaxCodeBlock.formats(this.children.head.domNode);
				if (language !== this.uiNode.value) this.uiNode.value = language;
			}
		}
	};
	SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
	SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
	SyntaxCodeBlock.allowedChildren = [
		CodeToken,
		_cursor.default,
		_text.default,
		_break.default
	];
	var Syntax = class extends _module.default {
		static register() {
			_quill.default.register(CodeToken, true);
			_quill.default.register(SyntaxCodeBlock, true);
			_quill.default.register(SyntaxCodeBlockContainer, true);
		}
		constructor(quill, options) {
			super(quill, options);
			if (this.options.hljs == null) throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
			this.languages = this.options.languages.reduce((memo, _ref2) => {
				let { key } = _ref2;
				memo[key] = true;
				return memo;
			}, {});
			this.highlightBlot = this.highlightBlot.bind(this);
			this.initListener();
			this.initTimer();
		}
		initListener() {
			this.quill.on(_quill.default.events.SCROLL_BLOT_MOUNT, (blot) => {
				if (!(blot instanceof SyntaxCodeBlockContainer)) return;
				const select = this.quill.root.ownerDocument.createElement("select");
				this.options.languages.forEach((_ref3) => {
					let { key, label } = _ref3;
					const option = select.ownerDocument.createElement("option");
					option.textContent = label;
					option.setAttribute("value", key);
					select.appendChild(option);
				});
				select.addEventListener("change", () => {
					blot.format(SyntaxCodeBlock.blotName, select.value);
					this.quill.root.focus();
					this.highlight(blot, true);
				});
				if (blot.uiNode == null) {
					blot.attachUI(select);
					if (blot.children.head) select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
				}
			});
		}
		initTimer() {
			let timer = null;
			this.quill.on(_quill.default.events.SCROLL_OPTIMIZE, () => {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => {
					this.highlight();
					timer = null;
				}, this.options.interval);
			});
		}
		highlight() {
			let blot = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
			let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			if (this.quill.selection.composing) return;
			this.quill.update(_quill.default.sources.USER);
			const range = this.quill.getSelection();
			(blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot]).forEach((container) => {
				container.highlight(this.highlightBlot, force);
			});
			this.quill.update(_quill.default.sources.SILENT);
			if (range != null) this.quill.setSelection(range, _quill.default.sources.SILENT);
		}
		highlightBlot(text) {
			let language = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
			language = this.languages[language] ? language : "plain";
			if (language === "plain") return (0, _text.escapeText)(text).split("\n").reduce((delta, line, i) => {
				if (i !== 0) delta.insert("\n", { [_code.default.blotName]: language });
				return delta.insert(line);
			}, new _quillDelta.default());
			const container = this.quill.root.ownerDocument.createElement("div");
			container.classList.add(_code.default.className);
			container.innerHTML = this.options.hljs.highlight(language, text).value;
			return (0, _clipboard.traverse)(this.quill.scroll, container, [(node, delta) => {
				const value = TokenAttributor.value(node);
				if (value) return delta.compose(new _quillDelta.default().retain(delta.length(), { [CodeToken.blotName]: value }));
				return delta;
			}], [(node, delta) => {
				return node.data.split("\n").reduce((memo, nodeText, i) => {
					if (i !== 0) memo.insert("\n", { [_code.default.blotName]: language });
					return memo.insert(nodeText);
				}, delta);
			}], /* @__PURE__ */ new WeakMap());
		}
	};
	exports.default = Syntax;
	Syntax.DEFAULTS = {
		hljs: window.hljs,
		interval: 1e3,
		languages: [
			{
				key: "plain",
				label: "Plain"
			},
			{
				key: "bash",
				label: "Bash"
			},
			{
				key: "cpp",
				label: "C++"
			},
			{
				key: "cs",
				label: "C#"
			},
			{
				key: "css",
				label: "CSS"
			},
			{
				key: "diff",
				label: "Diff"
			},
			{
				key: "xml",
				label: "HTML/XML"
			},
			{
				key: "java",
				label: "Java"
			},
			{
				key: "javascript",
				label: "JavaScript"
			},
			{
				key: "markdown",
				label: "Markdown"
			},
			{
				key: "php",
				label: "PHP"
			},
			{
				key: "python",
				label: "Python"
			},
			{
				key: "ruby",
				label: "Ruby"
			},
			{
				key: "sql",
				label: "SQL"
			}
		]
	};
}));
//#endregion
//#region ../../node_modules/quill/formats/table.js
var require_table$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TableRow = exports.TableContainer = exports.TableCell = exports.TableBody = void 0;
	exports.tableId = tableId;
	var _block = _interopRequireDefault(require_block());
	var _container = _interopRequireDefault(require_container());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var TableCell = class TableCell extends _block.default {
		static blotName = "table";
		static tagName = "TD";
		static create(value) {
			const node = super.create();
			if (value) node.setAttribute("data-row", value);
			else node.setAttribute("data-row", tableId());
			return node;
		}
		static formats(domNode) {
			if (domNode.hasAttribute("data-row")) return domNode.getAttribute("data-row");
		}
		cellOffset() {
			if (this.parent) return this.parent.children.indexOf(this);
			return -1;
		}
		format(name, value) {
			if (name === TableCell.blotName && value) this.domNode.setAttribute("data-row", value);
			else super.format(name, value);
		}
		row() {
			return this.parent;
		}
		rowOffset() {
			if (this.row()) return this.row().rowOffset();
			return -1;
		}
		table() {
			return this.row() && this.row().table();
		}
	};
	exports.TableCell = TableCell;
	var TableRow = class extends _container.default {
		static blotName = "table-row";
		static tagName = "TR";
		checkMerge() {
			if (super.checkMerge() && this.next.children.head != null) {
				const thisHead = this.children.head.formats();
				const thisTail = this.children.tail.formats();
				const nextHead = this.next.children.head.formats();
				const nextTail = this.next.children.tail.formats();
				return thisHead.table === thisTail.table && thisHead.table === nextHead.table && thisHead.table === nextTail.table;
			}
			return false;
		}
		optimize(context) {
			super.optimize(context);
			this.children.forEach((child) => {
				if (child.next == null) return;
				const childFormats = child.formats();
				const nextFormats = child.next.formats();
				if (childFormats.table !== nextFormats.table) {
					const next = this.splitAfter(child);
					if (next) next.optimize();
					if (this.prev) this.prev.optimize();
				}
			});
		}
		rowOffset() {
			if (this.parent) return this.parent.children.indexOf(this);
			return -1;
		}
		table() {
			return this.parent && this.parent.parent;
		}
	};
	exports.TableRow = TableRow;
	var TableBody = class extends _container.default {
		static blotName = "table-body";
		static tagName = "TBODY";
	};
	exports.TableBody = TableBody;
	var TableContainer = class extends _container.default {
		static blotName = "table-container";
		static tagName = "TABLE";
		balanceCells() {
			const rows = this.descendants(TableRow);
			const maxColumns = rows.reduce((max, row) => {
				return Math.max(row.children.length, max);
			}, 0);
			rows.forEach((row) => {
				new Array(maxColumns - row.children.length).fill(0).forEach(() => {
					let value;
					if (row.children.head != null) value = TableCell.formats(row.children.head.domNode);
					const blot = this.scroll.create(TableCell.blotName, value);
					row.appendChild(blot);
					blot.optimize();
				});
			});
		}
		cells(column) {
			return this.rows().map((row) => row.children.at(column));
		}
		deleteColumn(index) {
			const [body] = this.descendant(TableBody);
			if (body == null || body.children.head == null) return;
			body.children.forEach((row) => {
				const cell = row.children.at(index);
				if (cell != null) cell.remove();
			});
		}
		insertColumn(index) {
			const [body] = this.descendant(TableBody);
			if (body == null || body.children.head == null) return;
			body.children.forEach((row) => {
				const ref = row.children.at(index);
				const value = TableCell.formats(row.children.head.domNode);
				const cell = this.scroll.create(TableCell.blotName, value);
				row.insertBefore(cell, ref);
			});
		}
		insertRow(index) {
			const [body] = this.descendant(TableBody);
			if (body == null || body.children.head == null) return;
			const id = tableId();
			const row = this.scroll.create(TableRow.blotName);
			body.children.head.children.forEach(() => {
				const cell = this.scroll.create(TableCell.blotName, id);
				row.appendChild(cell);
			});
			const ref = body.children.at(index);
			body.insertBefore(row, ref);
		}
		rows() {
			const body = this.children.head;
			if (body == null) return [];
			return body.children.map((row) => row);
		}
	};
	exports.TableContainer = TableContainer;
	TableContainer.allowedChildren = [TableBody];
	TableBody.requiredContainer = TableContainer;
	TableBody.allowedChildren = [TableRow];
	TableRow.requiredContainer = TableBody;
	TableRow.allowedChildren = [TableCell];
	TableCell.requiredContainer = TableRow;
	function tableId() {
		return `row-${Math.random().toString(36).slice(2, 6)}`;
	}
}));
//#endregion
//#region ../../node_modules/quill/modules/table.js
var require_table = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _quill = _interopRequireDefault(require_quill$1());
	var _module = _interopRequireDefault(require_module());
	var _table = require_table$1();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var Table = class extends _module.default {
		static register() {
			_quill.default.register(_table.TableCell);
			_quill.default.register(_table.TableRow);
			_quill.default.register(_table.TableBody);
			_quill.default.register(_table.TableContainer);
		}
		constructor() {
			super(...arguments);
			this.listenBalanceCells();
		}
		balanceTables() {
			this.quill.scroll.descendants(_table.TableContainer).forEach((table) => {
				table.balanceCells();
			});
		}
		deleteColumn() {
			const [table, , cell] = this.getTable();
			if (cell == null) return;
			table.deleteColumn(cell.cellOffset());
			this.quill.update(_quill.default.sources.USER);
		}
		deleteRow() {
			const [, row] = this.getTable();
			if (row == null) return;
			row.remove();
			this.quill.update(_quill.default.sources.USER);
		}
		deleteTable() {
			const [table] = this.getTable();
			if (table == null) return;
			const offset = table.offset();
			table.remove();
			this.quill.update(_quill.default.sources.USER);
			this.quill.setSelection(offset, _quill.default.sources.SILENT);
		}
		getTable() {
			let range = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
			if (range == null) return [
				null,
				null,
				null,
				-1
			];
			const [cell, offset] = this.quill.getLine(range.index);
			if (cell == null || cell.statics.blotName !== _table.TableCell.blotName) return [
				null,
				null,
				null,
				-1
			];
			const row = cell.parent;
			return [
				row.parent.parent,
				row,
				cell,
				offset
			];
		}
		insertColumn(offset) {
			const range = this.quill.getSelection();
			if (!range) return;
			const [table, row, cell] = this.getTable(range);
			if (cell == null) return;
			const column = cell.cellOffset();
			table.insertColumn(column + offset);
			this.quill.update(_quill.default.sources.USER);
			let shift = row.rowOffset();
			if (offset === 0) shift += 1;
			this.quill.setSelection(range.index + shift, range.length, _quill.default.sources.SILENT);
		}
		insertColumnLeft() {
			this.insertColumn(0);
		}
		insertColumnRight() {
			this.insertColumn(1);
		}
		insertRow(offset) {
			const range = this.quill.getSelection();
			if (!range) return;
			const [table, row, cell] = this.getTable(range);
			if (cell == null) return;
			const index = row.rowOffset();
			table.insertRow(index + offset);
			this.quill.update(_quill.default.sources.USER);
			if (offset > 0) this.quill.setSelection(range, _quill.default.sources.SILENT);
			else this.quill.setSelection(range.index + row.children.length, range.length, _quill.default.sources.SILENT);
		}
		insertRowAbove() {
			this.insertRow(0);
		}
		insertRowBelow() {
			this.insertRow(1);
		}
		insertTable(rows, columns) {
			const range = this.quill.getSelection();
			if (range == null) return;
			const delta = new Array(rows).fill(0).reduce((memo) => {
				const text = new Array(columns).fill("\n").join("");
				return memo.insert(text, { table: (0, _table.tableId)() });
			}, new _quillDelta.default().retain(range.index));
			this.quill.updateContents(delta, _quill.default.sources.USER);
			this.quill.setSelection(range.index, _quill.default.sources.SILENT);
			this.balanceTables();
		}
		listenBalanceCells() {
			this.quill.on(_quill.default.events.SCROLL_OPTIMIZE, (mutations) => {
				mutations.some((mutation) => {
					if ([
						"TD",
						"TR",
						"TBODY",
						"TABLE"
					].includes(mutation.target.tagName)) {
						this.quill.once(_quill.default.events.TEXT_CHANGE, (delta, old, source) => {
							if (source !== _quill.default.sources.USER) return;
							this.balanceTables();
						});
						return true;
					}
					return false;
				});
			});
		}
	};
	exports.default = Table;
}));
//#endregion
//#region ../../node_modules/quill/modules/toolbar.js
var require_toolbar = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.addControls = addControls;
	exports.default = void 0;
	var _quillDelta = _interopRequireDefault(require_Delta());
	var _parchment = (init_parchment(), __toCommonJS(parchment_exports));
	var _quill = _interopRequireDefault(require_quill$1());
	var _logger = _interopRequireDefault(require_logger());
	var _module = _interopRequireDefault(require_module());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var debug = (0, _logger.default)("quill:toolbar");
	var Toolbar = class extends _module.default {
		constructor(quill, options) {
			super(quill, options);
			if (Array.isArray(this.options.container)) {
				const container = document.createElement("div");
				container.setAttribute("role", "toolbar");
				addControls(container, this.options.container);
				quill.container?.parentNode?.insertBefore(container, quill.container);
				this.container = container;
			} else if (typeof this.options.container === "string") this.container = document.querySelector(this.options.container);
			else this.container = this.options.container;
			if (!(this.container instanceof HTMLElement)) {
				debug.error("Container required for toolbar", this.options);
				return;
			}
			this.container.classList.add("ql-toolbar");
			this.controls = [];
			this.handlers = {};
			if (this.options.handlers) Object.keys(this.options.handlers).forEach((format) => {
				const handler = this.options.handlers?.[format];
				if (handler) this.addHandler(format, handler);
			});
			Array.from(this.container.querySelectorAll("button, select")).forEach((input) => {
				this.attach(input);
			});
			this.quill.on(_quill.default.events.EDITOR_CHANGE, (type, range) => {
				if (type === _quill.default.events.SELECTION_CHANGE) this.update(range);
			});
			this.quill.on(_quill.default.events.SCROLL_OPTIMIZE, () => {
				const [range] = this.quill.selection.getRange();
				this.update(range);
			});
		}
		addHandler(format, handler) {
			this.handlers[format] = handler;
		}
		attach(input) {
			let format = Array.from(input.classList).find((className) => {
				return className.indexOf("ql-") === 0;
			});
			if (!format) return;
			format = format.slice(3);
			if (input.tagName === "BUTTON") input.setAttribute("type", "button");
			if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
				debug.warn("ignoring attaching to nonexistent format", format, input);
				return;
			}
			const eventName = input.tagName === "SELECT" ? "change" : "click";
			input.addEventListener(eventName, (e) => {
				let value;
				if (input.tagName === "SELECT") {
					if (input.selectedIndex < 0) return;
					const selected = input.options[input.selectedIndex];
					if (selected.hasAttribute("selected")) value = false;
					else value = selected.value || false;
				} else {
					if (input.classList.contains("ql-active")) value = false;
					else value = input.value || !input.hasAttribute("value");
					e.preventDefault();
				}
				this.quill.focus();
				const [range] = this.quill.selection.getRange();
				if (this.handlers[format] != null) this.handlers[format].call(this, value);
				else if (this.quill.scroll.query(format).prototype instanceof _parchment.EmbedBlot) {
					value = prompt(`Enter ${format}`);
					if (!value) return;
					this.quill.updateContents(new _quillDelta.default().retain(range.index).delete(range.length).insert({ [format]: value }), _quill.default.sources.USER);
				} else this.quill.format(format, value, _quill.default.sources.USER);
				this.update(range);
			});
			this.controls.push([format, input]);
		}
		update(range) {
			const formats = range == null ? {} : this.quill.getFormat(range);
			this.controls.forEach((pair) => {
				const [format, input] = pair;
				if (input.tagName === "SELECT") {
					let option = null;
					if (range == null) option = null;
					else if (formats[format] == null) option = input.querySelector("option[selected]");
					else if (!Array.isArray(formats[format])) {
						let value = formats[format];
						if (typeof value === "string") value = value.replace(/"/g, "\\\"");
						option = input.querySelector(`option[value="${value}"]`);
					}
					if (option == null) {
						input.value = "";
						input.selectedIndex = -1;
					} else option.selected = true;
				} else if (range == null) {
					input.classList.remove("ql-active");
					input.setAttribute("aria-pressed", "false");
				} else if (input.hasAttribute("value")) {
					const value = formats[format];
					const isActive = value === input.getAttribute("value") || value != null && value.toString() === input.getAttribute("value") || value == null && !input.getAttribute("value");
					input.classList.toggle("ql-active", isActive);
					input.setAttribute("aria-pressed", isActive.toString());
				} else {
					const isActive = formats[format] != null;
					input.classList.toggle("ql-active", isActive);
					input.setAttribute("aria-pressed", isActive.toString());
				}
			});
		}
	};
	exports.default = Toolbar;
	Toolbar.DEFAULTS = {};
	function addButton(container, format, value) {
		const input = document.createElement("button");
		input.setAttribute("type", "button");
		input.classList.add(`ql-${format}`);
		input.setAttribute("aria-pressed", "false");
		if (value != null) {
			input.value = value;
			input.setAttribute("aria-label", `${format}: ${value}`);
		} else input.setAttribute("aria-label", format);
		container.appendChild(input);
	}
	function addControls(container, groups) {
		if (!Array.isArray(groups[0])) groups = [groups];
		groups.forEach((controls) => {
			const group = document.createElement("span");
			group.classList.add("ql-formats");
			controls.forEach((control) => {
				if (typeof control === "string") addButton(group, control);
				else {
					const format = Object.keys(control)[0];
					const value = control[format];
					if (Array.isArray(value)) addSelect(group, format, value);
					else addButton(group, format, value);
				}
			});
			container.appendChild(group);
		});
	}
	function addSelect(container, format, values) {
		const input = document.createElement("select");
		input.classList.add(`ql-${format}`);
		values.forEach((value) => {
			const option = document.createElement("option");
			if (value !== false) option.setAttribute("value", String(value));
			else option.setAttribute("selected", "selected");
			input.appendChild(option);
		});
		container.appendChild(input);
	}
	Toolbar.DEFAULTS = {
		container: null,
		handlers: {
			clean() {
				const range = this.quill.getSelection();
				if (range == null) return;
				if (range.length === 0) {
					const formats = this.quill.getFormat();
					Object.keys(formats).forEach((name) => {
						if (this.quill.scroll.query(name, _parchment.Scope.INLINE) != null) this.quill.format(name, false, _quill.default.sources.USER);
					});
				} else this.quill.removeFormat(range, _quill.default.sources.USER);
			},
			direction(value) {
				const { align } = this.quill.getFormat();
				if (value === "rtl" && align == null) this.quill.format("align", "right", _quill.default.sources.USER);
				else if (!value && align === "right") this.quill.format("align", false, _quill.default.sources.USER);
				this.quill.format("direction", value, _quill.default.sources.USER);
			},
			indent(value) {
				const range = this.quill.getSelection();
				const formats = this.quill.getFormat(range);
				const indent = parseInt(formats.indent || 0, 10);
				if (value === "+1" || value === "-1") {
					let modifier = value === "+1" ? 1 : -1;
					if (formats.direction === "rtl") modifier *= -1;
					this.quill.format("indent", indent + modifier, _quill.default.sources.USER);
				}
			},
			link(value) {
				if (value === true) value = prompt("Enter link URL:");
				this.quill.format("link", value, _quill.default.sources.USER);
			},
			list(value) {
				const range = this.quill.getSelection();
				const formats = this.quill.getFormat(range);
				if (value === "check") if (formats.list === "checked" || formats.list === "unchecked") this.quill.format("list", false, _quill.default.sources.USER);
				else this.quill.format("list", "unchecked", _quill.default.sources.USER);
				else this.quill.format("list", value, _quill.default.sources.USER);
			}
		}
	};
}));
//#endregion
//#region ../../node_modules/quill/ui/icons.js
var require_icons = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var alignLeftIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"13\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"9\" y1=\"4\" y2=\"4\"/></svg>";
	var alignCenterIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"14\" x2=\"4\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"12\" x2=\"6\" y1=\"4\" y2=\"4\"/></svg>";
	var alignRightIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"5\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"9\" y1=\"4\" y2=\"4\"/></svg>";
	var alignJustifyIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"3\" y1=\"4\" y2=\"4\"/></svg>";
	var backgroundIcon = "<svg viewbox=\"0 0 18 18\"><g class=\"ql-fill ql-color-label\"><polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"/><rect height=\"1\" width=\"1\" x=\"4\" y=\"4\"/><polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"6\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"4\" y=\"7\"/><polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"12\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"9\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"15\"/><polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"8\"/><path d=\"M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z\"/><path d=\"M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z\"/><path d=\"M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z\"/><rect height=\"1\" width=\"1\" x=\"12\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"11\" y=\"3\"/><path d=\"M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z\"/><rect height=\"1\" width=\"1\" x=\"2\" y=\"3\"/><rect height=\"1\" width=\"1\" x=\"6\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"3\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"5\" y=\"3\"/><rect height=\"1\" width=\"1\" x=\"9\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"14\"/><polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"/><rect height=\"1\" width=\"1\" x=\"13\" y=\"7\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"6\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"8\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"9\"/><path d=\"M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"3\"/><polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"2\"/><rect height=\"1\" width=\"1\" x=\"12\" y=\"5\"/><rect height=\"1\" width=\"1\" x=\"13\" y=\"4\"/><polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"/><rect height=\"1\" width=\"1\" x=\"9\" y=\"14\"/><rect height=\"1\" width=\"1\" x=\"8\" y=\"15\"/><path d=\"M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z\"/><rect height=\"1\" width=\"1\" x=\"5\" y=\"15\"/><path d=\"M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z\"/><rect height=\"1\" width=\"1\" x=\"11\" y=\"15\"/><path d=\"M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z\"/><rect height=\"1\" width=\"1\" x=\"14\" y=\"15\"/><rect height=\"1\" width=\"1\" x=\"15\" y=\"11\"/></g><polyline class=\"ql-stroke\" points=\"5.5 13 9 5 12.5 13\"/><line class=\"ql-stroke\" x1=\"11.63\" x2=\"6.38\" y1=\"11\" y2=\"11\"/></svg>";
	var blockquoteIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-fill ql-stroke\" height=\"3\" width=\"3\" x=\"4\" y=\"5\"/><rect class=\"ql-fill ql-stroke\" height=\"3\" width=\"3\" x=\"11\" y=\"5\"/><path class=\"ql-even ql-fill ql-stroke\" d=\"M7,8c0,4.031-3,5-3,5\"/><path class=\"ql-even ql-fill ql-stroke\" d=\"M14,8c0,4.031-3,5-3,5\"/></svg>";
	var boldIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-stroke\" d=\"M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z\"/><path class=\"ql-stroke\" d=\"M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z\"/></svg>";
	var cleanIcon = "<svg class=\"\" viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"5\" x2=\"13\" y1=\"3\" y2=\"3\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"9.35\" y1=\"12\" y2=\"3\"/><line class=\"ql-stroke\" x1=\"11\" x2=\"15\" y1=\"11\" y2=\"15\"/><line class=\"ql-stroke\" x1=\"15\" x2=\"11\" y1=\"11\" y2=\"15\"/><rect class=\"ql-fill\" height=\"1\" rx=\"0.5\" ry=\"0.5\" width=\"7\" x=\"2\" y=\"14\"/></svg>";
	var codeIcon = "<svg viewbox=\"0 0 18 18\"><polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"/><polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"/><line class=\"ql-stroke\" x1=\"10\" x2=\"8\" y1=\"5\" y2=\"13\"/></svg>";
	exports.default = {
		align: {
			"": alignLeftIcon,
			center: alignCenterIcon,
			right: alignRightIcon,
			justify: alignJustifyIcon
		},
		background: backgroundIcon,
		blockquote: blockquoteIcon,
		bold: boldIcon,
		clean: cleanIcon,
		code: codeIcon,
		"code-block": codeIcon,
		color: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-color-label ql-stroke ql-transparent\" x1=\"3\" x2=\"15\" y1=\"15\" y2=\"15\"/><polyline class=\"ql-stroke\" points=\"5.5 11 9 3 12.5 11\"/><line class=\"ql-stroke\" x1=\"11.63\" x2=\"6.38\" y1=\"9\" y2=\"9\"/></svg>",
		direction: {
			"": "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"/><line class=\"ql-stroke ql-fill\" x1=\"15\" x2=\"11\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M11,3a3,3,0,0,0,0,6h1V3H11Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"11\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"13\" y=\"4\"/></svg>",
			rtl: "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"/><line class=\"ql-stroke ql-fill\" x1=\"9\" x2=\"5\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M5,3A3,3,0,0,0,5,9H6V3H5Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"5\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"7\" y=\"4\"/></svg>"
		},
		formula: "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z\"/><rect class=\"ql-fill\" height=\"1.6\" rx=\"0.8\" ry=\"0.8\" width=\"5\" x=\"5.15\" y=\"6.2\"/><path class=\"ql-fill\" d=\"M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z\"/></svg>",
		header: {
			"1": "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z\"/></svg>",
			"2": "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z\"/></svg>"
		},
		italic: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"13\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"5\" x2=\"11\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"8\" x2=\"10\" y1=\"14\" y2=\"4\"/></svg>",
		image: "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"10\" width=\"12\" x=\"3\" y=\"4\"/><circle class=\"ql-fill\" cx=\"6\" cy=\"7\" r=\"1\"/><polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"/></svg>",
		indent: {
			"+1": "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"/></svg>",
			"-1": "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"5 7 5 11 3 9 5 7\"/></svg>"
		},
		link: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"11\" y1=\"7\" y2=\"11\"/><path class=\"ql-even ql-stroke\" d=\"M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z\"/><path class=\"ql-even ql-stroke\" d=\"M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z\"/></svg>",
		list: {
			bullet: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"14\" y2=\"14\"/></svg>",
			check: "<svg class=\"\" viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"4\" y2=\"4\"/><polyline class=\"ql-stroke\" points=\"3 4 4 5 6 3\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"14\" y2=\"14\"/><polyline class=\"ql-stroke\" points=\"3 14 4 15 6 13\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"3 9 4 10 6 8\"/></svg>",
			ordered: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke ql-thin\" x1=\"2.5\" x2=\"4.5\" y1=\"5.5\" y2=\"5.5\"/><path class=\"ql-fill\" d=\"M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z\"/><path class=\"ql-stroke ql-thin\" d=\"M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156\"/><path class=\"ql-stroke ql-thin\" d=\"M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109\"/></svg>"
		},
		script: {
			sub: "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z\"/><path class=\"ql-fill\" d=\"M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z\"/></svg>",
			super: "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z\"/><path class=\"ql-fill\" d=\"M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z\"/></svg>"
		},
		strike: "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke ql-thin\" x1=\"15.5\" x2=\"2.5\" y1=\"8.5\" y2=\"9.5\"/><path class=\"ql-fill\" d=\"M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z\"/><path class=\"ql-fill\" d=\"M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z\"/></svg>",
		table: "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"3\" x=\"5\" y=\"5\"/><rect class=\"ql-fill\" height=\"2\" width=\"4\" x=\"9\" y=\"5\"/><g class=\"ql-fill ql-transparent\"><rect height=\"2\" width=\"3\" x=\"5\" y=\"8\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"8\"/><rect height=\"2\" width=\"3\" x=\"5\" y=\"11\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"11\"/></g></svg>",
		underline: "<svg viewbox=\"0 0 18 18\"><path class=\"ql-stroke\" d=\"M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3\"/><rect class=\"ql-fill\" height=\"1\" rx=\"0.5\" ry=\"0.5\" width=\"12\" x=\"3\" y=\"15\"/></svg>",
		video: "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"5\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"12\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"8\" x=\"5\" y=\"8\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"12\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"12\"/></svg>"
	};
}));
//#endregion
//#region ../../node_modules/quill/ui/picker.js
var require_picker = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var DropdownIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke\" points=\"7 11 9 13 11 11 7 11\"/><polygon class=\"ql-stroke\" points=\"7 7 9 5 11 7 7 7\"/></svg>";
	var optionsCounter = 0;
	function toggleAriaAttribute(element, attribute) {
		element.setAttribute(attribute, `${!(element.getAttribute(attribute) === "true")}`);
	}
	var Picker = class {
		constructor(select) {
			this.select = select;
			this.container = document.createElement("span");
			this.buildPicker();
			this.select.style.display = "none";
			this.select.parentNode.insertBefore(this.container, this.select);
			this.label.addEventListener("mousedown", () => {
				this.togglePicker();
			});
			this.label.addEventListener("keydown", (event) => {
				switch (event.key) {
					case "Enter":
						this.togglePicker();
						break;
					case "Escape":
						this.escape();
						event.preventDefault();
						break;
					default:
				}
			});
			this.select.addEventListener("change", this.update.bind(this));
		}
		togglePicker() {
			this.container.classList.toggle("ql-expanded");
			toggleAriaAttribute(this.label, "aria-expanded");
			toggleAriaAttribute(this.options, "aria-hidden");
		}
		buildItem(option) {
			const item = document.createElement("span");
			item.tabIndex = "0";
			item.setAttribute("role", "button");
			item.classList.add("ql-picker-item");
			const value = option.getAttribute("value");
			if (value) item.setAttribute("data-value", value);
			if (option.textContent) item.setAttribute("data-label", option.textContent);
			item.addEventListener("click", () => {
				this.selectItem(item, true);
			});
			item.addEventListener("keydown", (event) => {
				switch (event.key) {
					case "Enter":
						this.selectItem(item, true);
						event.preventDefault();
						break;
					case "Escape":
						this.escape();
						event.preventDefault();
						break;
					default:
				}
			});
			return item;
		}
		buildLabel() {
			const label = document.createElement("span");
			label.classList.add("ql-picker-label");
			label.innerHTML = DropdownIcon;
			label.tabIndex = "0";
			label.setAttribute("role", "button");
			label.setAttribute("aria-expanded", "false");
			this.container.appendChild(label);
			return label;
		}
		buildOptions() {
			const options = document.createElement("span");
			options.classList.add("ql-picker-options");
			options.setAttribute("aria-hidden", "true");
			options.tabIndex = "-1";
			options.id = `ql-picker-options-${optionsCounter}`;
			optionsCounter += 1;
			this.label.setAttribute("aria-controls", options.id);
			this.options = options;
			Array.from(this.select.options).forEach((option) => {
				const item = this.buildItem(option);
				options.appendChild(item);
				if (option.selected === true) this.selectItem(item);
			});
			this.container.appendChild(options);
		}
		buildPicker() {
			Array.from(this.select.attributes).forEach((item) => {
				this.container.setAttribute(item.name, item.value);
			});
			this.container.classList.add("ql-picker");
			this.label = this.buildLabel();
			this.buildOptions();
		}
		escape() {
			this.close();
			setTimeout(() => this.label.focus(), 1);
		}
		close() {
			this.container.classList.remove("ql-expanded");
			this.label.setAttribute("aria-expanded", "false");
			this.options.setAttribute("aria-hidden", "true");
		}
		selectItem(item) {
			let trigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			const selected = this.container.querySelector(".ql-selected");
			if (item === selected) return;
			if (selected != null) selected.classList.remove("ql-selected");
			if (item == null) return;
			item.classList.add("ql-selected");
			this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(item);
			if (item.hasAttribute("data-value")) this.label.setAttribute("data-value", item.getAttribute("data-value"));
			else this.label.removeAttribute("data-value");
			if (item.hasAttribute("data-label")) this.label.setAttribute("data-label", item.getAttribute("data-label"));
			else this.label.removeAttribute("data-label");
			if (trigger) {
				this.select.dispatchEvent(new Event("change"));
				this.close();
			}
		}
		update() {
			let option;
			if (this.select.selectedIndex > -1) {
				const item = this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex];
				option = this.select.options[this.select.selectedIndex];
				this.selectItem(item);
			} else this.selectItem(null);
			const isActive = option != null && option !== this.select.querySelector("option[selected]");
			this.label.classList.toggle("ql-active", isActive);
		}
	};
	exports.default = Picker;
}));
//#endregion
//#region ../../node_modules/quill/ui/color-picker.js
var require_color_picker = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _picker = _interopRequireDefault(require_picker());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var ColorPicker = class extends _picker.default {
		constructor(select, label) {
			super(select);
			this.label.innerHTML = label;
			this.container.classList.add("ql-color-picker");
			Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((item) => {
				item.classList.add("ql-primary");
			});
		}
		buildItem(option) {
			const item = super.buildItem(option);
			item.style.backgroundColor = option.getAttribute("value") || "";
			return item;
		}
		selectItem(item, trigger) {
			super.selectItem(item, trigger);
			const colorLabel = this.label.querySelector(".ql-color-label");
			const value = item ? item.getAttribute("data-value") || "" : "";
			if (colorLabel) if (colorLabel.tagName === "line") colorLabel.style.stroke = value;
			else colorLabel.style.fill = value;
		}
	};
	exports.default = ColorPicker;
}));
//#endregion
//#region ../../node_modules/quill/ui/icon-picker.js
var require_icon_picker = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _picker = _interopRequireDefault(require_picker());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var IconPicker = class extends _picker.default {
		constructor(select, icons) {
			super(select);
			this.container.classList.add("ql-icon-picker");
			Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((item) => {
				item.innerHTML = icons[item.getAttribute("data-value") || ""];
			});
			this.defaultItem = this.container.querySelector(".ql-selected");
			this.selectItem(this.defaultItem);
		}
		selectItem(target, trigger) {
			super.selectItem(target, trigger);
			const item = target || this.defaultItem;
			if (item != null) {
				if (this.label.innerHTML === item.innerHTML) return;
				this.label.innerHTML = item.innerHTML;
			}
		}
	};
	exports.default = IconPicker;
}));
//#endregion
//#region ../../node_modules/quill/ui/tooltip.js
var require_tooltip = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var isScrollable = (el) => {
		const { overflowY } = getComputedStyle(el, null);
		return overflowY !== "visible" && overflowY !== "clip";
	};
	var Tooltip = class {
		constructor(quill, boundsContainer) {
			this.quill = quill;
			this.boundsContainer = boundsContainer || document.body;
			this.root = quill.addContainer("ql-tooltip");
			this.root.innerHTML = this.constructor.TEMPLATE;
			if (isScrollable(this.quill.root)) this.quill.root.addEventListener("scroll", () => {
				this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
			});
			this.hide();
		}
		hide() {
			this.root.classList.add("ql-hidden");
		}
		position(reference) {
			const left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
			const top = reference.bottom + this.quill.root.scrollTop;
			this.root.style.left = `${left}px`;
			this.root.style.top = `${top}px`;
			this.root.classList.remove("ql-flip");
			const containerBounds = this.boundsContainer.getBoundingClientRect();
			const rootBounds = this.root.getBoundingClientRect();
			let shift = 0;
			if (rootBounds.right > containerBounds.right) {
				shift = containerBounds.right - rootBounds.right;
				this.root.style.left = `${left + shift}px`;
			}
			if (rootBounds.left < containerBounds.left) {
				shift = containerBounds.left - rootBounds.left;
				this.root.style.left = `${left + shift}px`;
			}
			if (rootBounds.bottom > containerBounds.bottom) {
				const height = rootBounds.bottom - rootBounds.top;
				const verticalShift = reference.bottom - reference.top + height;
				this.root.style.top = `${top - verticalShift}px`;
				this.root.classList.add("ql-flip");
			}
			return shift;
		}
		show() {
			this.root.classList.remove("ql-editing");
			this.root.classList.remove("ql-hidden");
		}
	};
	exports.default = Tooltip;
}));
//#endregion
//#region ../../node_modules/quill/themes/base.js
var require_base = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.BaseTooltip = void 0;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _emitter = _interopRequireDefault(require_emitter());
	var _theme = _interopRequireDefault(require_theme());
	var _colorPicker = _interopRequireDefault(require_color_picker());
	var _iconPicker = _interopRequireDefault(require_icon_picker());
	var _picker = _interopRequireDefault(require_picker());
	var _tooltip = _interopRequireDefault(require_tooltip());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var ALIGNS = [
		false,
		"center",
		"right",
		"justify"
	];
	var COLORS = [
		"#000000",
		"#e60000",
		"#ff9900",
		"#ffff00",
		"#008a00",
		"#0066cc",
		"#9933ff",
		"#ffffff",
		"#facccc",
		"#ffebcc",
		"#ffffcc",
		"#cce8cc",
		"#cce0f5",
		"#ebd6ff",
		"#bbbbbb",
		"#f06666",
		"#ffc266",
		"#ffff66",
		"#66b966",
		"#66a3e0",
		"#c285ff",
		"#888888",
		"#a10000",
		"#b26b00",
		"#b2b200",
		"#006100",
		"#0047b2",
		"#6b24b2",
		"#444444",
		"#5c0000",
		"#663d00",
		"#666600",
		"#003700",
		"#002966",
		"#3d1466"
	];
	var FONTS = [
		false,
		"serif",
		"monospace"
	];
	var HEADERS = [
		"1",
		"2",
		"3",
		false
	];
	var SIZES = [
		"small",
		false,
		"large",
		"huge"
	];
	var BaseTheme = class extends _theme.default {
		constructor(quill, options) {
			super(quill, options);
			const listener = (e) => {
				if (!document.body.contains(quill.root)) {
					document.body.removeEventListener("click", listener);
					return;
				}
				if (this.tooltip != null && !this.tooltip.root.contains(e.target) && document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus()) this.tooltip.hide();
				if (this.pickers != null) this.pickers.forEach((picker) => {
					if (!picker.container.contains(e.target)) picker.close();
				});
			};
			quill.emitter.listenDOM("click", document.body, listener);
		}
		addModule(name) {
			const module$1 = super.addModule(name);
			if (name === "toolbar") this.extendToolbar(module$1);
			return module$1;
		}
		buildButtons(buttons, icons) {
			Array.from(buttons).forEach((button) => {
				(button.getAttribute("class") || "").split(/\s+/).forEach((name) => {
					if (!name.startsWith("ql-")) return;
					name = name.slice(3);
					if (icons[name] == null) return;
					if (name === "direction") button.innerHTML = icons[name][""] + icons[name].rtl;
					else if (typeof icons[name] === "string") button.innerHTML = icons[name];
					else {
						const value = button.value || "";
						if (value != null && icons[name][value]) button.innerHTML = icons[name][value];
					}
				});
			});
		}
		buildPickers(selects, icons) {
			this.pickers = Array.from(selects).map((select) => {
				if (select.classList.contains("ql-align")) {
					if (select.querySelector("option") == null) fillSelect(select, ALIGNS);
					if (typeof icons.align === "object") return new _iconPicker.default(select, icons.align);
				}
				if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
					const format = select.classList.contains("ql-background") ? "background" : "color";
					if (select.querySelector("option") == null) fillSelect(select, COLORS, format === "background" ? "#ffffff" : "#000000");
					return new _colorPicker.default(select, icons[format]);
				}
				if (select.querySelector("option") == null) {
					if (select.classList.contains("ql-font")) fillSelect(select, FONTS);
					else if (select.classList.contains("ql-header")) fillSelect(select, HEADERS);
					else if (select.classList.contains("ql-size")) fillSelect(select, SIZES);
				}
				return new _picker.default(select);
			});
			const update = () => {
				this.pickers.forEach((picker) => {
					picker.update();
				});
			};
			this.quill.on(_emitter.default.events.EDITOR_CHANGE, update);
		}
	};
	exports.default = BaseTheme;
	BaseTheme.DEFAULTS = (0, _lodashEs.merge)({}, _theme.default.DEFAULTS, { modules: { toolbar: { handlers: {
		formula() {
			this.quill.theme.tooltip.edit("formula");
		},
		image() {
			let fileInput = this.container.querySelector("input.ql-image[type=file]");
			if (fileInput == null) {
				fileInput = document.createElement("input");
				fileInput.setAttribute("type", "file");
				fileInput.setAttribute("accept", this.quill.uploader.options.mimetypes.join(", "));
				fileInput.classList.add("ql-image");
				fileInput.addEventListener("change", () => {
					const range = this.quill.getSelection(true);
					this.quill.uploader.upload(range, fileInput.files);
					fileInput.value = "";
				});
				this.container.appendChild(fileInput);
			}
			fileInput.click();
		},
		video() {
			this.quill.theme.tooltip.edit("video");
		}
	} } } });
	var BaseTooltip = class extends _tooltip.default {
		constructor(quill, boundsContainer) {
			super(quill, boundsContainer);
			this.textbox = this.root.querySelector("input[type=\"text\"]");
			this.listen();
		}
		listen() {
			this.textbox.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					this.save();
					event.preventDefault();
				} else if (event.key === "Escape") {
					this.cancel();
					event.preventDefault();
				}
			});
		}
		cancel() {
			this.hide();
			this.restoreFocus();
		}
		edit() {
			let mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link";
			let preview = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
			this.root.classList.remove("ql-hidden");
			this.root.classList.add("ql-editing");
			if (this.textbox == null) return;
			if (preview != null) this.textbox.value = preview;
			else if (mode !== this.root.getAttribute("data-mode")) this.textbox.value = "";
			const bounds = this.quill.getBounds(this.quill.selection.savedRange);
			if (bounds != null) this.position(bounds);
			this.textbox.select();
			this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${mode}`) || "");
			this.root.setAttribute("data-mode", mode);
		}
		restoreFocus() {
			this.quill.focus({ preventScroll: true });
		}
		save() {
			let { value } = this.textbox;
			switch (this.root.getAttribute("data-mode")) {
				case "link": {
					const { scrollTop } = this.quill.root;
					if (this.linkRange) {
						this.quill.formatText(this.linkRange, "link", value, _emitter.default.sources.USER);
						delete this.linkRange;
					} else {
						this.restoreFocus();
						this.quill.format("link", value, _emitter.default.sources.USER);
					}
					this.quill.root.scrollTop = scrollTop;
					break;
				}
				case "video": value = extractVideoUrl(value);
				case "formula": {
					if (!value) break;
					const range = this.quill.getSelection(true);
					if (range != null) {
						const index = range.index + range.length;
						this.quill.insertEmbed(index, this.root.getAttribute("data-mode"), value, _emitter.default.sources.USER);
						if (this.root.getAttribute("data-mode") === "formula") this.quill.insertText(index + 1, " ", _emitter.default.sources.USER);
						this.quill.setSelection(index + 2, _emitter.default.sources.USER);
					}
					break;
				}
				default:
			}
			this.textbox.value = "";
			this.hide();
		}
	};
	exports.BaseTooltip = BaseTooltip;
	function extractVideoUrl(url) {
		let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
		if (match) return `${match[1] || "https"}://www.youtube.com/embed/${match[2]}?showinfo=0`;
		if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) return `${match[1] || "https"}://player.vimeo.com/video/${match[2]}/`;
		return url;
	}
	function fillSelect(select, values) {
		let defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
		values.forEach((value) => {
			const option = document.createElement("option");
			if (value === defaultValue) option.setAttribute("selected", "selected");
			else option.setAttribute("value", String(value));
			select.appendChild(option);
		});
	}
}));
//#endregion
//#region ../../node_modules/quill/themes/bubble.js
var require_bubble = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.BubbleTooltip = void 0;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _emitter = _interopRequireDefault(require_emitter());
	var _base = _interopRequireWildcard(require_base());
	var _selection = require_selection();
	var _icons = _interopRequireDefault(require_icons());
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var TOOLBAR_CONFIG = [[
		"bold",
		"italic",
		"link"
	], [
		{ header: 1 },
		{ header: 2 },
		"blockquote"
	]];
	var BubbleTooltip = class extends _base.BaseTooltip {
		static TEMPLATE = [
			"<span class=\"ql-tooltip-arrow\"></span>",
			"<div class=\"ql-tooltip-editor\">",
			"<input type=\"text\" data-formula=\"e=mc^2\" data-link=\"https://quilljs.com\" data-video=\"Embed URL\">",
			"<a class=\"ql-close\"></a>",
			"</div>"
		].join("");
		constructor(quill, bounds) {
			super(quill, bounds);
			this.quill.on(_emitter.default.events.EDITOR_CHANGE, (type, range, oldRange, source) => {
				if (type !== _emitter.default.events.SELECTION_CHANGE) return;
				if (range != null && range.length > 0 && source === _emitter.default.sources.USER) {
					this.show();
					this.root.style.left = "0px";
					this.root.style.width = "";
					this.root.style.width = `${this.root.offsetWidth}px`;
					const lines = this.quill.getLines(range.index, range.length);
					if (lines.length === 1) {
						const bounds = this.quill.getBounds(range);
						if (bounds != null) this.position(bounds);
					} else {
						const lastLine = lines[lines.length - 1];
						const index = this.quill.getIndex(lastLine);
						const length = Math.min(lastLine.length() - 1, range.index + range.length - index);
						const indexBounds = this.quill.getBounds(new _selection.Range(index, length));
						if (indexBounds != null) this.position(indexBounds);
					}
				} else if (document.activeElement !== this.textbox && this.quill.hasFocus()) this.hide();
			});
		}
		listen() {
			super.listen();
			this.root.querySelector(".ql-close").addEventListener("click", () => {
				this.root.classList.remove("ql-editing");
			});
			this.quill.on(_emitter.default.events.SCROLL_OPTIMIZE, () => {
				setTimeout(() => {
					if (this.root.classList.contains("ql-hidden")) return;
					const range = this.quill.getSelection();
					if (range != null) {
						const bounds = this.quill.getBounds(range);
						if (bounds != null) this.position(bounds);
					}
				}, 1);
			});
		}
		cancel() {
			this.show();
		}
		position(reference) {
			const shift = super.position(reference);
			const arrow = this.root.querySelector(".ql-tooltip-arrow");
			arrow.style.marginLeft = "";
			if (shift !== 0) arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
			return shift;
		}
	};
	exports.BubbleTooltip = BubbleTooltip;
	var BubbleTheme = class extends _base.default {
		constructor(quill, options) {
			if (options.modules.toolbar != null && options.modules.toolbar.container == null) options.modules.toolbar.container = TOOLBAR_CONFIG;
			super(quill, options);
			this.quill.container.classList.add("ql-bubble");
		}
		extendToolbar(toolbar) {
			this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
			if (toolbar.container != null) {
				this.tooltip.root.appendChild(toolbar.container);
				this.buildButtons(toolbar.container.querySelectorAll("button"), _icons.default);
				this.buildPickers(toolbar.container.querySelectorAll("select"), _icons.default);
			}
		}
	};
	exports.default = BubbleTheme;
	BubbleTheme.DEFAULTS = (0, _lodashEs.merge)({}, _base.default.DEFAULTS, { modules: { toolbar: { handlers: { link(value) {
		if (!value) this.quill.format("link", false);
		else this.quill.theme.tooltip.edit();
	} } } } });
}));
//#endregion
//#region ../../node_modules/quill/themes/snow.js
var require_snow = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _lodashEs = (init_lodash(), __toCommonJS(lodash_exports));
	var _emitter = _interopRequireDefault(require_emitter());
	var _base = _interopRequireWildcard(require_base());
	var _link = _interopRequireDefault(require_link());
	var _selection = require_selection();
	var _icons = _interopRequireDefault(require_icons());
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var TOOLBAR_CONFIG = [
		[{ header: [
			"1",
			"2",
			"3",
			false
		] }],
		[
			"bold",
			"italic",
			"underline",
			"link"
		],
		[{ list: "ordered" }, { list: "bullet" }],
		["clean"]
	];
	var SnowTooltip = class extends _base.BaseTooltip {
		static TEMPLATE = [
			"<a class=\"ql-preview\" rel=\"noopener noreferrer\" target=\"_blank\" href=\"about:blank\"></a>",
			"<input type=\"text\" data-formula=\"e=mc^2\" data-link=\"https://quilljs.com\" data-video=\"Embed URL\">",
			"<a class=\"ql-action\"></a>",
			"<a class=\"ql-remove\"></a>"
		].join("");
		preview = this.root.querySelector("a.ql-preview");
		listen() {
			super.listen();
			this.root.querySelector("a.ql-action").addEventListener("click", (event) => {
				if (this.root.classList.contains("ql-editing")) this.save();
				else this.edit("link", this.preview.textContent);
				event.preventDefault();
			});
			this.root.querySelector("a.ql-remove").addEventListener("click", (event) => {
				if (this.linkRange != null) {
					const range = this.linkRange;
					this.restoreFocus();
					this.quill.formatText(range, "link", false, _emitter.default.sources.USER);
					delete this.linkRange;
				}
				event.preventDefault();
				this.hide();
			});
			this.quill.on(_emitter.default.events.SELECTION_CHANGE, (range, oldRange, source) => {
				if (range == null) return;
				if (range.length === 0 && source === _emitter.default.sources.USER) {
					const [link, offset] = this.quill.scroll.descendant(_link.default, range.index);
					if (link != null) {
						this.linkRange = new _selection.Range(range.index - offset, link.length());
						const preview = _link.default.formats(link.domNode);
						this.preview.textContent = preview;
						this.preview.setAttribute("href", preview);
						this.show();
						const bounds = this.quill.getBounds(this.linkRange);
						if (bounds != null) this.position(bounds);
						return;
					}
				} else delete this.linkRange;
				this.hide();
			});
		}
		show() {
			super.show();
			this.root.removeAttribute("data-mode");
		}
	};
	var SnowTheme = class extends _base.default {
		constructor(quill, options) {
			if (options.modules.toolbar != null && options.modules.toolbar.container == null) options.modules.toolbar.container = TOOLBAR_CONFIG;
			super(quill, options);
			this.quill.container.classList.add("ql-snow");
		}
		extendToolbar(toolbar) {
			if (toolbar.container != null) {
				toolbar.container.classList.add("ql-snow");
				this.buildButtons(toolbar.container.querySelectorAll("button"), _icons.default);
				this.buildPickers(toolbar.container.querySelectorAll("select"), _icons.default);
				this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
				if (toolbar.container.querySelector(".ql-link")) this.quill.keyboard.addBinding({
					key: "k",
					shortKey: true
				}, (_range, context) => {
					toolbar.handlers.link.call(toolbar, !context.format.link);
				});
			}
		}
	};
	SnowTheme.DEFAULTS = (0, _lodashEs.merge)({}, _base.default.DEFAULTS, { modules: { toolbar: { handlers: { link(value) {
		if (value) {
			const range = this.quill.getSelection();
			if (range == null || range.length === 0) return;
			let preview = this.quill.getText(range);
			if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) preview = `mailto:${preview}`;
			const { tooltip } = this.quill.theme;
			tooltip.edit("link", preview);
		} else this.quill.format("link", false);
	} } } } });
	exports.default = SnowTheme;
}));
//#endregion
//#region ../../node_modules/quill/dist/quill.snow.css
var import_quill = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _core = _interopRequireDefault(require_core());
	var _align = require_align();
	var _direction = require_direction();
	var _indent = _interopRequireDefault(require_indent());
	var _blockquote = _interopRequireDefault(require_blockquote());
	var _header = _interopRequireDefault(require_header());
	var _list = _interopRequireDefault(require_list());
	var _background = require_background();
	var _color = require_color();
	var _font = require_font();
	var _size = require_size();
	var _bold = _interopRequireDefault(require_bold());
	var _italic = _interopRequireDefault(require_italic());
	var _link = _interopRequireDefault(require_link());
	var _script = _interopRequireDefault(require_script());
	var _strike = _interopRequireDefault(require_strike());
	var _underline = _interopRequireDefault(require_underline());
	var _formula = _interopRequireDefault(require_formula());
	var _image = _interopRequireDefault(require_image());
	var _video = _interopRequireDefault(require_video());
	var _code = _interopRequireWildcard(require_code());
	var _syntax = _interopRequireDefault(require_syntax());
	var _table = _interopRequireDefault(require_table());
	var _toolbar = _interopRequireDefault(require_toolbar());
	var _icons = _interopRequireDefault(require_icons());
	var _picker = _interopRequireDefault(require_picker());
	var _colorPicker = _interopRequireDefault(require_color_picker());
	var _iconPicker = _interopRequireDefault(require_icon_picker());
	var _tooltip = _interopRequireDefault(require_tooltip());
	var _bubble = _interopRequireDefault(require_bubble());
	var _snow = _interopRequireDefault(require_snow());
	function _getRequireWildcardCache(e) {
		if ("function" != typeof WeakMap) return null;
		var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function(e) {
			return e ? t : r;
		})(e);
	}
	function _interopRequireWildcard(e, r) {
		if (!r && e && e.__esModule) return e;
		if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
		var t = _getRequireWildcardCache(r);
		if (t && t.has(e)) return t.get(e);
		var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
			var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
			i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
		}
		return n.default = e, t && t.set(e, n), n;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	_core.default.register({
		"attributors/attribute/direction": _direction.DirectionAttribute,
		"attributors/class/align": _align.AlignClass,
		"attributors/class/background": _background.BackgroundClass,
		"attributors/class/color": _color.ColorClass,
		"attributors/class/direction": _direction.DirectionClass,
		"attributors/class/font": _font.FontClass,
		"attributors/class/size": _size.SizeClass,
		"attributors/style/align": _align.AlignStyle,
		"attributors/style/background": _background.BackgroundStyle,
		"attributors/style/color": _color.ColorStyle,
		"attributors/style/direction": _direction.DirectionStyle,
		"attributors/style/font": _font.FontStyle,
		"attributors/style/size": _size.SizeStyle
	}, true);
	_core.default.register({
		"formats/align": _align.AlignClass,
		"formats/direction": _direction.DirectionClass,
		"formats/indent": _indent.default,
		"formats/background": _background.BackgroundStyle,
		"formats/color": _color.ColorStyle,
		"formats/font": _font.FontClass,
		"formats/size": _size.SizeClass,
		"formats/blockquote": _blockquote.default,
		"formats/code-block": _code.default,
		"formats/header": _header.default,
		"formats/list": _list.default,
		"formats/bold": _bold.default,
		"formats/code": _code.Code,
		"formats/italic": _italic.default,
		"formats/link": _link.default,
		"formats/script": _script.default,
		"formats/strike": _strike.default,
		"formats/underline": _underline.default,
		"formats/formula": _formula.default,
		"formats/image": _image.default,
		"formats/video": _video.default,
		"modules/syntax": _syntax.default,
		"modules/table": _table.default,
		"modules/toolbar": _toolbar.default,
		"themes/bubble": _bubble.default,
		"themes/snow": _snow.default,
		"ui/icons": _icons.default,
		"ui/picker": _picker.default,
		"ui/icon-picker": _iconPicker.default,
		"ui/color-picker": _colorPicker.default,
		"ui/tooltip": _tooltip.default
	}, true);
	exports.default = _core.default;
})))(), 1);
//#endregion
//#region src/frontend/views/editor/editors/QuillEditor.ts
var QuillEditor = class {
	options;
	quill = null;
	container = null;
	autoSaveTimeout = null;
	content = "";
	constructor(options = {}) {
		this.options = {
			initialContent: "",
			placeholder: "Start writing...",
			theme: "snow",
			toolbar: [
				[{ "header": [
					1,
					2,
					3,
					4,
					5,
					6,
					false
				] }],
				[
					"bold",
					"italic",
					"underline",
					"strike"
				],
				[{ "color": [] }, { "background": [] }],
				[{ "list": "ordered" }, { "list": "bullet" }],
				[{ "script": "sub" }, { "script": "super" }],
				[{ "indent": "-1" }, { "indent": "+1" }],
				[{ "align": [] }],
				["blockquote", "code-block"],
				[
					"link",
					"image",
					"video"
				],
				["clean"]
			],
			autoSave: true,
			autoSaveDelay: 2e3,
			...options
		};
		this.content = this.options.initialContent || "";
	}
	/**
	* Render the Quill editor
	*/
	render() {
		const container = H`<div class="quill-editor-container">
      <div class="editor-header">
        <h3>Rich Text Editor</h3>
        <div class="editor-actions">
          <button class="btn btn-icon" data-action="clear" title="Clear content" aria-label="Clear content">
            <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Clear</span>
          </button>
          <button class="btn btn-icon primary" data-action="save" title="Save content" aria-label="Save content">
            <ui-icon icon="floppy-disk" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Save</span>
          </button>
          <button class="btn btn-icon" data-action="export-html" title="Export as HTML" aria-label="Export as HTML">
            <ui-icon icon="code" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">HTML</span>
          </button>
          <button class="btn btn-icon" data-action="export-text" title="Export as text" aria-label="Export as text">
            <ui-icon icon="file-text" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Text</span>
          </button>
        </div>
      </div>

      <div class="quill-wrapper">
        <div class="quill-editor" data-editor></div>
      </div>

      <div class="editor-footer">
        <div class="editor-stats">
          <span class="word-count">0 words</span>
          <span class="char-count">0 characters</span>
        </div>
        <div class="editor-info">
          <span class="format-indicator">Rich Text</span>
        </div>
      </div>
    </div>`;
		this.initializeQuill(container);
		return container;
	}
	/**
	* Get current content as HTML
	*/
	getContent() {
		if (!this.quill) return this.content;
		return this.quill.root.innerHTML;
	}
	/**
	* Get current content as plain text
	*/
	getText() {
		if (!this.quill) return "";
		return this.quill.getText();
	}
	/**
	* Get current content as Delta format (Quill's internal format)
	*/
	getContents() {
		if (!this.quill) return null;
		return this.quill.getContents();
	}
	/**
	* Set content from HTML
	*/
	setContent(content) {
		this.content = content;
		if (this.quill) {
			this.quill.root.innerHTML = content;
			this.updateStats();
		}
	}
	/**
	* Set content from Delta format
	*/
	setContents(delta) {
		if (this.quill) {
			this.quill.setContents(delta);
			this.updateStats();
		}
	}
	/**
	* Focus the editor
	*/
	focus() {
		if (this.quill) this.quill.focus();
	}
	/**
	* Clear the editor
	*/
	clear() {
		if (this.quill) {
			this.quill.setContents([]);
			this.content = "";
			this.updateStats();
			this.options.onContentChange?.("");
		}
	}
	/**
	* Save the content
	*/
	save() {
		const content = this.getContent();
		this.content = content;
		this.options.onSave?.(content);
	}
	/**
	* Export as HTML
	*/
	exportHTML() {
		const content = this.getContent();
		this.downloadContent(content, "rich-text-content.html", "text/html");
	}
	/**
	* Export as plain text
	*/
	exportText() {
		const content = this.getText();
		this.downloadContent(content, "rich-text-content.txt", "text/plain");
	}
	initializeQuill(container) {
		const editorElement = container.querySelector("[data-editor]");
		if (!editorElement) {
			console.error("Quill editor element not found");
			return;
		}
		this.quill = new import_quill.default(editorElement, {
			theme: this.options.theme,
			placeholder: this.options.placeholder,
			modules: { toolbar: this.options.toolbar }
		});
		if (this.content) this.quill.root.innerHTML = this.content;
		this.setupEventListeners(container);
		this.updateStats();
	}
	setupEventListeners(container) {
		if (!this.quill) return;
		this.quill.on("text-change", () => {
			this.handleContentChange();
		});
		container.addEventListener("click", (e) => {
			const action = e.target.getAttribute("data-action");
			if (action) {
				e.preventDefault();
				this.handleAction(action);
			}
		});
		this.quill.on("selection-change", () => {
			this.updateStats();
		});
	}
	handleContentChange() {
		const content = this.getContent();
		this.content = content;
		this.updateStats();
		this.options.onContentChange?.(content);
		if (this.options.autoSave) this.scheduleAutoSave();
	}
	handleAction(action) {
		switch (action) {
			case "clear":
				this.clear();
				break;
			case "save":
				this.save();
				break;
			case "export-html":
				this.exportHTML();
				break;
			case "export-text":
				this.exportText();
				break;
		}
	}
	updateStats() {
		if (!this.quill || !this.container) return;
		const text = this.quill.getText();
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		const chars = text.length;
		const wordCountEl = this.container.querySelector(".word-count");
		const charCountEl = this.container.querySelector(".char-count");
		if (wordCountEl) wordCountEl.textContent = `${words} words`;
		if (charCountEl) charCountEl.textContent = `${chars} characters`;
	}
	scheduleAutoSave() {
		if (this.autoSaveTimeout) clearTimeout(this.autoSaveTimeout);
		this.autoSaveTimeout = globalThis?.setTimeout?.(() => {
			this.save();
		}, this.options.autoSaveDelay);
	}
	downloadContent(content, filename, mimeType) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	/**
	* Clean up resources
	*/
	destroy() {
		if (this.autoSaveTimeout) globalThis?.clearTimeout?.(this.autoSaveTimeout);
		if (this.quill) this.quill = null;
	}
};
/**
* Create a Quill editor instance
*/
function createQuillEditor(options) {
	return new QuillEditor(options);
}
/**
* Convert Quill Delta to HTML
*/
function deltaToHtml(delta) {
	if (!delta || !delta.ops) return "";
	let html = "";
	let inList = false;
	let listType = "";
	for (const op of delta.ops) if (typeof op.insert === "string") {
		let text = op.insert;
		let attributes = op.attributes || {};
		if (text.includes("\n")) {
			const lines = text.split("\n");
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (attributes.bold) line = `<strong>${line}</strong>`;
				if (attributes.italic) line = `<em>${line}</em>`;
				if (attributes.underline) line = `<u>${line}</u>`;
				if (attributes.strike) line = `<s>${line}</s>`;
				if (attributes.color) line = `<span style="color: ${attributes.color}">${line}</span>`;
				if (attributes.background) line = `<span style="background-color: ${attributes.background}">${line}</span>`;
				if (attributes.list) {
					if (!inList || listType !== attributes.list) {
						if (inList) html += "</ul>";
						html += attributes.list === "ordered" ? "<ol>" : "<ul>";
						inList = true;
						listType = attributes.list;
					}
					html += `<li>${line}</li>`;
				} else {
					if (inList) {
						html += "</ul>";
						inList = false;
					}
					if (attributes.header) html += `<h${attributes.header}>${line}</h${attributes.header}>`;
					else if (attributes.blockquote) html += `<blockquote>${line}</blockquote>`;
					else if (attributes["code-block"]) html += `<pre><code>${line}</code></pre>`;
					else html += `<p>${line}</p>`;
				}
				if (i < lines.length - 1) {}
			}
		} else {
			if (attributes.bold) text = `<strong>${text}</strong>`;
			if (attributes.italic) text = `<em>${text}</em>`;
			if (attributes.underline) text = `<u>${text}</u>`;
			if (attributes.strike) text = `<s>${text}</s>`;
			if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`;
			if (attributes.background) text = `<span style="background-color: ${attributes.background}">${text}</span>`;
			html += text;
		}
	}
	if (inList) html += "</ul>";
	return html;
}
//#endregion
export { QuillEditor, createQuillEditor, deltaToHtml };
