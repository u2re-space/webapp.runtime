import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { C as MOCElement, D as createElementVanilla, E as containsOrSelf, F as setIdleInterval$1, M as makeRAFCycle, N as setAttributesIfNull, O as indexOf, P as setChecked, S as fixedClientZoom, T as addEventsList, _ as setStyleProperty, a as handleStyleChange, b as observeBySelector, c as reflectMixins, d as getAdoptedStyleRule, f as getPadding, i as handleProperty, j as isValidParent$1, k as isElement, l as reflectStores, m as loadInlineStyle, n as handleDataset, o as DOMMixin, p as loadAsAdopted, r as handleHidden, s as addRoot, t as handleAttribute, u as reflectBehaviors, v as observeAttribute, w as addEvent, y as observeAttributeBySelector } from "../fest/dom.js";
import { B as normalizePrimitive, C as camelToKebab$1, D as handleListeners, E as getValue, F as isPrimitive, L as isValueRef, N as isObject, O as hasValue, P as isObservable, S as UUIDv4, T as deref, V as toRef$1, a as numberRef, b as $getValue, c as ref, d as addToCallChain, f as safe, h as $triggerControl, i as booleanRef, l as stringRef, m as $affected, n as affected, o as observe, p as unwrap, r as iterated, t as DoubleWeakMap, v as isNotEqual, w as canBeInteger, x as $set$1, y as $avoidTrigger } from "../fest/object.js";
import { n as stripUserScopePrefix, r as userPathCandidates } from "../fest/core.js";
import { o as createWorkerChannel, s as QueuedWorkerChannel } from "../fest/uniform.js";
//#region ../../node_modules/jsox/lib/jsox.mjs
var _JSON = JSON;
/**
* JSOX container for all JSOX methods.
* @namespace
*/
var JSOX = {};
JSOX.JSOX = JSOX;
JSOX.version = "1.2.125";
var hasBigInt = typeof BigInt === "function";
var VALUE_UNDEFINED = -1;
var VALUE_UNSET = 0;
var VALUE_NULL = 1;
var VALUE_TRUE = 2;
var VALUE_FALSE = 3;
var VALUE_STRING = 4;
var VALUE_NUMBER = 5;
var VALUE_OBJECT = 6;
var VALUE_NEG_NAN = 7;
var VALUE_NAN = 8;
var VALUE_NEG_INFINITY = 9;
var VALUE_INFINITY = 10;
var VALUE_EMPTY = 12;
var VALUE_ARRAY = 13;
var knownArrayTypeNames = [
	"ab",
	"u8",
	"cu8",
	"s8",
	"u16",
	"s16",
	"u32",
	"s32",
	"u64",
	"s64",
	"f32",
	"f64"
];
var arrayToJSOX = null;
var mapToJSOX = null;
var knownArrayTypes = [
	ArrayBuffer,
	Uint8Array,
	Uint8ClampedArray,
	Int8Array,
	Uint16Array,
	Int16Array,
	Uint32Array,
	Int32Array,
	null,
	null,
	Float32Array,
	Float64Array
];
var WORD_POS_RESET = 0;
var WORD_POS_TRUE_1 = 1;
var WORD_POS_TRUE_2 = 2;
var WORD_POS_TRUE_3 = 3;
var WORD_POS_FALSE_1 = 5;
var WORD_POS_FALSE_2 = 6;
var WORD_POS_FALSE_3 = 7;
var WORD_POS_FALSE_4 = 8;
var WORD_POS_NULL_1 = 9;
var WORD_POS_NULL_2 = 10;
var WORD_POS_NULL_3 = 11;
var WORD_POS_UNDEFINED_1 = 12;
var WORD_POS_UNDEFINED_2 = 13;
var WORD_POS_UNDEFINED_3 = 14;
var WORD_POS_UNDEFINED_4 = 15;
var WORD_POS_UNDEFINED_5 = 16;
var WORD_POS_UNDEFINED_6 = 17;
var WORD_POS_UNDEFINED_7 = 18;
var WORD_POS_UNDEFINED_8 = 19;
var WORD_POS_NAN_1 = 20;
var WORD_POS_NAN_2 = 21;
var WORD_POS_INFINITY_1 = 22;
var WORD_POS_INFINITY_2 = 23;
var WORD_POS_INFINITY_3 = 24;
var WORD_POS_INFINITY_4 = 25;
var WORD_POS_INFINITY_5 = 26;
var WORD_POS_INFINITY_6 = 27;
var WORD_POS_INFINITY_7 = 28;
var WORD_POS_FIELD = 29;
var WORD_POS_AFTER_FIELD = 30;
var WORD_POS_END = 31;
var WORD_POS_AFTER_FIELD_VALUE = 32;
var CONTEXT_UNKNOWN = 0;
var CONTEXT_IN_ARRAY = 1;
var CONTEXT_OBJECT_FIELD = 2;
var CONTEXT_OBJECT_FIELD_VALUE = 3;
var CONTEXT_CLASS_FIELD = 4;
var CONTEXT_CLASS_VALUE = 5;
var CONTEXT_CLASS_FIELD_VALUE = 6;
var keywords = {
	["true"]: true,
	["false"]: false,
	["null"]: null,
	["NaN"]: NaN,
	["Infinity"]: Infinity,
	["undefined"]: void 0
};
/**
* Extend Date type with a nanosecond field.
* @constructor
* @param {Date} original_date
* @param {Number} nanoseconds in milli-seconds of Date ( 0 to 1_000_000 )
*/
var DateNS = class extends Date {
	constructor(a, b) {
		super(a);
		this.ns = b || 0;
	}
};
JSOX.DateNS = DateNS;
var contexts = [];
/**
* get a context from stack (reuse contexts)
* @internal
*/
function getContext() {
	let ctx = contexts.pop();
	if (!ctx) ctx = {
		context: CONTEXT_UNKNOWN,
		current_proto: null,
		current_class: null,
		current_class_field: 0,
		arrayType: -1,
		valueType: VALUE_UNSET,
		elements: null
	};
	return ctx;
}
/**
* return a context to the stack (reuse contexts)
* @internal
*/
function dropContext(ctx) {
	contexts.push(ctx);
}
/**
* SACK jsox compatibility; hands maps to internal C++ code in other case.
* @internal
*/
JSOX.updateContext = function() {};
var buffers = [];
function getBuffer() {
	let buf = buffers.pop();
	if (!buf) buf = {
		buf: null,
		n: 0
	};
	else buf.n = 0;
	return buf;
}
function dropBuffer(buf) {
	buffers.push(buf);
}
/**
* Provide minimal escapes for a string to be encapsulated as a JSOX string in quotes.
*
* @param {string} string 
* @returns {string}
*/
JSOX.escape = function(string) {
	let n;
	let output = "";
	if (!string) return string;
	for (n = 0; n < string.length; n++) {
		if (string[n] == "\"" || string[n] == "\\" || string[n] == "`" || string[n] == "'") output += "\\";
		output += string[n];
	}
	return output;
};
var toProtoTypes = /* @__PURE__ */ new WeakMap();
var toObjectTypes = /* @__PURE__ */ new Map();
var fromProtoTypes = /* @__PURE__ */ new Map();
var commonClasses = [];
/**
* reset JSOX parser entirely; clears all type mappings
*
* @returns {void}
*/
JSOX.reset = function() {
	toProtoTypes = /* @__PURE__ */ new WeakMap();
	toObjectTypes = /* @__PURE__ */ new Map();
	fromProtoTypes = /* @__PURE__ */ new Map();
	commonClasses = [];
};
/**
* Create a streaming parser.  Add data with parser.write(data); values that
* are found are dispatched to the callback.
*
* @param {(value:any) => void} [cb]
* @param {(this: any, key: string, value: any) => any} [reviver] 
* @returns {JSOXParser}
*/
JSOX.begin = function(cb, reviver) {
	const val = {
		name: null,
		value_type: VALUE_UNSET,
		string: "",
		contains: null,
		className: null
	};
	const pos = {
		line: 1,
		col: 1
	};
	let n = 0;
	let str;
	let localFromProtoTypes = /* @__PURE__ */ new Map();
	let word = WORD_POS_RESET, status = true, redefineClass = false, negative = false, result = null, rootObject = null, elements = void 0, context_stack = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
			this.length++;
		},
		pop() {
			let result = this.last;
			if (!(this.last = result.prior)) this.first = null;
			result.next = this.saved;
			if (this.last) this.last.next = null;
			if (!result.next) result.first = null;
			this.saved = result;
			this.length--;
			return result.node;
		},
		length: 0
	}, classes = [], protoTypes = {}, current_proto = null, current_class = null, current_class_field = 0, arrayType = -1, parse_context = CONTEXT_UNKNOWN, comment = 0, fromHex = false, decimal = false, exponent = false, exponent_sign = false, exponent_digit = false, inQueue = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
		},
		shift() {
			let result = this.first;
			if (!result) return null;
			if (!(this.first = result.next)) this.last = null;
			result.next = this.saved;
			this.saved = result;
			return result.node;
		},
		unshift(node) {
			let recover = this.saved;
			this.saved = recover.next;
			recover.node = node;
			recover.next = this.first;
			recover.prior = null;
			if (!this.first) this.last = recover;
			this.first = recover;
		}
	}, gatheringStringFirstChar = null, gatheringString = false, gatheringNumber = false, stringEscape = false, cr_escaped = false, unicodeWide = false, stringUnicode = false, stringHex = false, hex_char = 0, hex_char_len = 0, completed = false, date_format = false, isBigInt = false;
	function throwEndError(leader) {
		throw new Error(`${leader} at ${n} [${pos.line}:${pos.col}]`);
	}
	return {
		fromJSOX(prototypeName, o, f) {
			if (localFromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
			function privateProto() {}
			if (!o) o = privateProto;
			if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
			localFromProtoTypes.set(prototypeName, {
				protoCon: o.prototype.constructor,
				cb: f
			});
		},
		registerFromJSOX(prototypeName, o) {
			throw new Error("registerFromJSOX is deprecated, please update to use fromJSOX instead:" + prototypeName + o.toString());
		},
		finalError() {
			if (comment !== 0) {
				if (comment === 1) throwEndError("Comment began at end of document");
				if (comment === 2);
				if (comment === 3) throwEndError("Open comment '/*' is missing close at end of document");
				if (comment === 4) throwEndError("Incomplete '/* *' close at end of document");
			}
			if (gatheringString) throwEndError("Incomplete string");
		},
		value() {
			this.finalError();
			let r = result;
			result = void 0;
			return r;
		},
		reset() {
			word = WORD_POS_RESET;
			status = true;
			if (inQueue.last) inQueue.last.next = inQueue.save;
			inQueue.save = inQueue.first;
			inQueue.first = inQueue.last = null;
			if (context_stack.last) context_stack.last.next = context_stack.save;
			context_stack.length = 0;
			context_stack.save = inQueue.first;
			context_stack.first = context_stack.last = null;
			elements = void 0;
			parse_context = CONTEXT_UNKNOWN;
			classes = [];
			protoTypes = {};
			current_proto = null;
			current_class = null;
			current_class_field = 0;
			val.value_type = VALUE_UNSET;
			val.name = null;
			val.string = "";
			val.className = null;
			pos.line = 1;
			pos.col = 1;
			negative = false;
			comment = 0;
			completed = false;
			gatheringString = false;
			stringEscape = false;
			cr_escaped = false;
			date_format = false;
		},
		usePrototype(className, protoType) {
			protoTypes[className] = protoType;
		},
		write(msg) {
			let retcode;
			if (typeof msg !== "string" && typeof msg !== "undefined") msg = String(msg);
			if (!status) throw new Error("Parser is still in an error state, please reset before resuming");
			for (retcode = this._write(msg, false); retcode > 0; retcode = this._write()) {
				if (typeof reviver === "function") (function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				})({ "": result }, "");
				result = cb(result);
				if (retcode < 2) break;
			}
		},
		parse(msg, reviver) {
			if (typeof msg !== "string") msg = String(msg);
			this.reset();
			const writeResult = this._write(msg, true);
			if (writeResult > 0) {
				if (writeResult > 1) {}
				let result = this.value();
				if ("undefined" === typeof result && writeResult > 1) throw new Error("Pending value could not complete");
				result = typeof reviver === "function" ? function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				}({ "": result }, "") : result;
				return result;
			}
			this.finalError();
		},
		_write(msg, complete_at_end) {
			let cInt;
			let input;
			let buf;
			let retval = 0;
			function throwError(leader, c) {
				throw new Error(`${leader} '${String.fromCodePoint(c)}' unexpected at ${n} (near '${buf.substr(n > 4 ? n - 4 : 0, n > 4 ? 3 : n - 1)}[${String.fromCodePoint(c)}]${buf.substr(n, 10)}') [${pos.line}:${pos.col}]`);
			}
			function RESET_VAL() {
				val.value_type = VALUE_UNSET;
				val.string = "";
				val.contains = null;
			}
			function convertValue() {
				let fp = null;
				switch (val.value_type) {
					case VALUE_NUMBER:
						if ((val.string.length > 13 || val.string.length == 13 && val[0] > "2") && !date_format && !exponent_digit && !exponent_sign && !decimal) isBigInt = true;
						if (isBigInt) if (hasBigInt) return BigInt(val.string);
						else throw new Error("no builtin BigInt()", 0);
						if (date_format) {
							const r = val.string.match(/\.(\d\d\d\d*)/);
							const frac = r ? r[1] : null;
							if (!frac || frac.length < 4) {
								const r = new Date(val.string);
								if (isNaN(r.getTime())) throwError("Bad Date format", cInt);
								return r;
							} else {
								let ns = frac.substr(3);
								while (ns.length < 6) ns = ns + "0";
								const r = new DateNS(val.string, Number(ns));
								if (isNaN(r.getTime())) throwError("Bad DateNS format" + r + r.getTime(), cInt);
								return r;
							}
						}
						return (negative ? -1 : 1) * Number(val.string);
					case VALUE_STRING:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							if (fp && fp.cb) {
								val.className = null;
								return fp.cb.call(val.string);
							} else throw new Error("Double string error, no constructor for: new " + val.className + "(" + val.string + ")");
						}
						return val.string;
					case VALUE_TRUE: return true;
					case VALUE_FALSE: return false;
					case VALUE_NEG_NAN: return NaN;
					case VALUE_NAN: return NaN;
					case VALUE_NEG_INFINITY: return -Infinity;
					case VALUE_INFINITY: return Infinity;
					case VALUE_NULL: return null;
					case VALUE_UNDEFINED: return;
					case VALUE_EMPTY: return;
					case VALUE_OBJECT:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return val.contains = fp.cb.call(val.contains);
						}
						return val.contains;
					case VALUE_ARRAY:
						if (arrayType >= 0) {
							let ab;
							if (val.contains.length) ab = DecodeBase64(val.contains[0]);
							else ab = DecodeBase64(val.string);
							if (arrayType === 0) {
								arrayType = -1;
								return ab;
							} else {
								const newab = new knownArrayTypes[arrayType](ab);
								arrayType = -1;
								return newab;
							}
						} else if (arrayType === -2) {
							let obj = rootObject;
							let lvl;
							const pathlen = val.contains.length;
							for (lvl = 0; lvl < pathlen; lvl++) {
								const idx = val.contains[lvl];
								let nextObj = obj[idx];
								if (!nextObj) {
									let ctx = context_stack.first;
									let p = 0;
									while (ctx && p < pathlen && p < context_stack.length) {
										const thisKey = val.contains[p];
										if (!ctx.next || thisKey !== ctx.next.node.name) break;
										if (ctx.next) if ("number" === typeof thisKey) {
											const actualObject = ctx.next.node.elements;
											if (actualObject && thisKey >= actualObject.length) if (p === context_stack.length - 1) {
												console.log("This is actually at the current object so use that", p, val.contains, elements);
												nextObj = elements;
												p++;
												ctx = ctx.next;
												break;
											} else {
												if (ctx.next.next && thisKey === actualObject.length) {
													nextObj = ctx.next.next.node.elements;
													ctx = ctx.next;
													p++;
													obj = nextObj;
													continue;
												}
												nextObj = elements;
												p++;
												break;
											}
										} else if (thisKey !== ctx.next.node.name) {
											nextObj = ctx.next.node.elements[thisKey];
											lvl = p;
											break;
										} else if (ctx.next.next) nextObj = ctx.next.next.node.elements;
										else nextObj = elements;
										else nextObj = nextObj[thisKey];
										ctx = ctx.next;
										p++;
									}
									if (p < pathlen) lvl = p - 1;
									else lvl = p;
								}
								if ("object" === typeof nextObj && !nextObj) throw new Error("Path did not resolve properly:" + val.contains + " at " + idx + "(" + lvl + ")");
								obj = nextObj;
							}
							arrayType = -3;
							return obj;
						}
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return fp.cb.call(val.contains);
						}
						return val.contains;
					default:
						console.log("Unhandled value conversion.", val);
						break;
				}
			}
			function arrayPush() {
				if (arrayType == -3) {
					if (val.value_type === VALUE_OBJECT) elements.push(val.contains);
					arrayType = -1;
					return;
				}
				switch (val.value_type) {
					case VALUE_EMPTY:
						elements.push(void 0);
						delete elements[elements.length - 1];
						break;
					default:
						elements.push(convertValue());
						break;
				}
				RESET_VAL();
			}
			function objectPush() {
				if (arrayType === -3 && val.value_type === VALUE_ARRAY) {
					RESET_VAL();
					arrayType = -1;
					return;
				}
				if (val.value_type === VALUE_EMPTY) return;
				if (!val.name && current_class) val.name = current_class.fields[current_class_field++];
				let value = convertValue();
				if (current_proto && current_proto.protoDef && current_proto.protoDef.cb) {
					value = current_proto.protoDef.cb.call(elements, val.name, value);
					if (value) elements[val.name] = value;
				} else elements[val.name] = value;
				RESET_VAL();
			}
			function recoverIdent(cInt) {
				if (word !== WORD_POS_RESET) {
					if (negative) throwError("Negative outside of quotes, being converted to a string (would lose count of leading '-' characters)", cInt);
					switch (word) {
						case WORD_POS_END:
							switch (val.value_type) {
								case VALUE_TRUE:
									val.string += "true";
									break;
								case VALUE_FALSE:
									val.string += "false";
									break;
								case VALUE_NULL:
									val.string += "null";
									break;
								case VALUE_INFINITY:
									val.string += "Infinity";
									break;
								case VALUE_NEG_INFINITY:
									val.string += "-Infinity";
									throwError("Negative outside of quotes, being converted to a string", cInt);
									break;
								case VALUE_NAN:
									val.string += "NaN";
									break;
								case VALUE_NEG_NAN:
									val.string += "-NaN";
									throwError("Negative outside of quotes, being converted to a string", cInt);
									break;
								case VALUE_UNDEFINED:
									val.string += "undefined";
									break;
								case VALUE_STRING: break;
								case VALUE_UNSET: break;
								default: console.log("Value of type " + val.value_type + " is not restored...");
							}
							break;
						case WORD_POS_TRUE_1:
							val.string += "t";
							break;
						case WORD_POS_TRUE_2:
							val.string += "tr";
							break;
						case WORD_POS_TRUE_3:
							val.string += "tru";
							break;
						case WORD_POS_FALSE_1:
							val.string += "f";
							break;
						case WORD_POS_FALSE_2:
							val.string += "fa";
							break;
						case WORD_POS_FALSE_3:
							val.string += "fal";
							break;
						case WORD_POS_FALSE_4:
							val.string += "fals";
							break;
						case WORD_POS_NULL_1:
							val.string += "n";
							break;
						case WORD_POS_NULL_2:
							val.string += "nu";
							break;
						case WORD_POS_NULL_3:
							val.string += "nul";
							break;
						case WORD_POS_UNDEFINED_1:
							val.string += "u";
							break;
						case WORD_POS_UNDEFINED_2:
							val.string += "un";
							break;
						case WORD_POS_UNDEFINED_3:
							val.string += "und";
							break;
						case WORD_POS_UNDEFINED_4:
							val.string += "unde";
							break;
						case WORD_POS_UNDEFINED_5:
							val.string += "undef";
							break;
						case WORD_POS_UNDEFINED_6:
							val.string += "undefi";
							break;
						case WORD_POS_UNDEFINED_7:
							val.string += "undefin";
							break;
						case WORD_POS_UNDEFINED_8:
							val.string += "undefine";
							break;
						case WORD_POS_NAN_1:
							val.string += "N";
							break;
						case WORD_POS_NAN_2:
							val.string += "Na";
							break;
						case WORD_POS_INFINITY_1:
							val.string += "I";
							break;
						case WORD_POS_INFINITY_2:
							val.string += "In";
							break;
						case WORD_POS_INFINITY_3:
							val.string += "Inf";
							break;
						case WORD_POS_INFINITY_4:
							val.string += "Infi";
							break;
						case WORD_POS_INFINITY_5:
							val.string += "Infin";
							break;
						case WORD_POS_INFINITY_6:
							val.string += "Infini";
							break;
						case WORD_POS_INFINITY_7:
							val.string += "Infinit";
							break;
						case WORD_POS_RESET: break;
						case WORD_POS_FIELD: break;
						case WORD_POS_AFTER_FIELD: break;
						case WORD_POS_AFTER_FIELD_VALUE:
							throwError("String-keyword recovery fail (after whitespace)", cInt);
							break;
						default:
					}
					val.value_type = VALUE_STRING;
					if (word < WORD_POS_FIELD) word = WORD_POS_END;
				} else {
					word = WORD_POS_END;
					val.value_type = VALUE_STRING;
				}
				if (cInt == 123) openObject();
				else if (cInt == 91) openArray();
				else if (cInt == 44) {} else {
					if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 65279 || cInt == 8232 || cInt == 8233) return;
					if (cInt == 44 || cInt == 125 || cInt == 93 || cInt == 58);
					else val.string += str;
				}
			}
			function gatherString(start_c) {
				let retval = 0;
				while (retval == 0 && n < buf.length) {
					str = buf.charAt(n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					pos.col++;
					if (cInt == start_c) if (stringEscape) {
						if (stringHex) throwError("Incomplete hexidecimal sequence", cInt);
						else if (stringUnicode) throwError("Incomplete long unicode sequence", cInt);
						else if (unicodeWide) throwError("Incomplete unicode sequence", cInt);
						if (cr_escaped) {
							cr_escaped = false;
							retval = 1;
						} else val.string += str;
						stringEscape = false;
					} else retval = 1;
					else if (stringEscape) {
						if (unicodeWide) {
							if (cInt == 125) {
								val.string += String.fromCodePoint(hex_char);
								unicodeWide = false;
								stringUnicode = false;
								stringEscape = false;
								continue;
							}
							hex_char *= 16;
							if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
							else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
							else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
							else {
								throwError("(escaped character, parsing hex of \\u)", cInt);
								retval = -1;
								unicodeWide = false;
								stringEscape = false;
								continue;
							}
							continue;
						} else if (stringHex || stringUnicode) {
							if (hex_char_len === 0 && cInt === 123) {
								unicodeWide = true;
								continue;
							}
							if (hex_char_len < 2 || stringUnicode && hex_char_len < 4) {
								hex_char *= 16;
								if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
								else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
								else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
								else {
									throwError(stringUnicode ? "(escaped character, parsing hex of \\u)" : "(escaped character, parsing hex of \\x)", cInt);
									retval = -1;
									stringHex = false;
									stringEscape = false;
									continue;
								}
								hex_char_len++;
								if (stringUnicode) {
									if (hex_char_len == 4) {
										val.string += String.fromCodePoint(hex_char);
										stringUnicode = false;
										stringEscape = false;
									}
								} else if (hex_char_len == 2) {
									val.string += String.fromCodePoint(hex_char);
									stringHex = false;
									stringEscape = false;
								}
								continue;
							}
						}
						switch (cInt) {
							case 13:
								cr_escaped = true;
								pos.col = 1;
								continue;
							case 8232:
							case 8233: pos.col = 1;
							case 10:
								if (!cr_escaped) pos.col = 1;
								else cr_escaped = false;
								pos.line++;
								break;
							case 116:
								val.string += "	";
								break;
							case 98:
								val.string += "\b";
								break;
							case 110:
								val.string += "\n";
								break;
							case 114:
								val.string += "\r";
								break;
							case 102:
								val.string += "\f";
								break;
							case 118:
								val.string += "\v";
								break;
							case 48:
								val.string += "\0";
								break;
							case 120:
								stringHex = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							case 117:
								stringUnicode = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							default:
								val.string += str;
								break;
						}
						stringEscape = false;
					} else if (cInt === 92) if (stringEscape) {
						val.string += "\\";
						stringEscape = false;
					} else {
						stringEscape = true;
						hex_char = 0;
						hex_char_len = 0;
					}
					else {
						if (cr_escaped) {
							cr_escaped = false;
							pos.line++;
							pos.col = 2;
						}
						val.string += str;
					}
				}
				return retval;
			}
			function collectNumber() {
				let _n;
				while ((_n = n) < buf.length) {
					str = buf.charAt(_n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 256) {
						pos.col -= n - _n;
						n = _n;
						break;
					} else {
						if (cInt == 95) continue;
						pos.col++;
						if (cInt >= 48 && cInt <= 57) {
							if (exponent) exponent_digit = true;
							val.string += str;
						} else if (cInt == 45 || cInt == 43) if (val.string.length == 0 || exponent && !exponent_sign && !exponent_digit) {
							if (cInt == 45 && !exponent) negative = !negative;
							val.string += str;
							exponent_sign = true;
						} else {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						}
						else if (cInt == 78) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_NAN_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 73) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_INFINITY_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 58 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 84 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 90 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 46) if (!decimal && !fromHex && !exponent) {
							val.string += str;
							decimal = true;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 110) {
							isBigInt = true;
							break;
						} else if (fromHex && (cInt >= 95 && cInt <= 102 || cInt >= 65 && cInt <= 70)) val.string += str;
						else if (cInt == 120 || cInt == 98 || cInt == 111 || cInt == 88 || cInt == 66 || cInt == 79) if (!fromHex && val.string == "0") {
							fromHex = true;
							val.string += str;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 101 || cInt == 69) if (!exponent) {
							val.string += str;
							exponent = true;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 47 || cInt == 35 || cInt == 44 || cInt == 125 || cInt == 93 || cInt == 123 || cInt == 91 || cInt == 34 || cInt == 39 || cInt == 96 || cInt == 58) {
							pos.col -= n - _n;
							n = _n;
							break;
						} else {
							if (complete_at_end) {
								status = false;
								throwError("fault while parsing number;", cInt);
							}
							break;
						}
					}
				}
				if (!complete_at_end && n == buf.length) gatheringNumber = true;
				else {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
				}
			}
			function openObject() {
				let nextMode = CONTEXT_OBJECT_FIELD;
				let cls = null;
				let tmpobj = {};
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(123);
				let protoDef;
				protoDef = getProto();
				if (parse_context == CONTEXT_UNKNOWN) if (word == WORD_POS_FIELD || word == WORD_POS_END && (protoDef || val.string.length)) {
					if (protoDef && protoDef.protoDef && protoDef.protoDef.protoCon) tmpobj = new protoDef.protoDef.protoCon();
					if (!protoDef || !protoDef.protoDef && val.string) {
						cls = classes.find((cls) => cls.name === val.string);
						if (!cls) {
							function privateProto() {}
							classes.push(cls = {
								name: val.string,
								protoCon: protoDef && protoDef.protoDef && protoDef.protoDef.protoCon || privateProto.constructor,
								fields: []
							});
							nextMode = CONTEXT_CLASS_FIELD;
						} else if (redefineClass) {
							cls.fields.length = 0;
							nextMode = CONTEXT_CLASS_FIELD;
						} else {
							tmpobj = new cls.protoCon();
							nextMode = CONTEXT_CLASS_VALUE;
						}
						redefineClass = false;
					}
					current_class = cls;
					word = WORD_POS_RESET;
				} else word = WORD_POS_FIELD;
				else if (word == WORD_POS_FIELD || parse_context === CONTEXT_IN_ARRAY || parse_context === CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) if (word != WORD_POS_RESET || val.value_type == VALUE_STRING) {
					if (protoDef && protoDef.protoDef) tmpobj = new protoDef.protoDef.protoCon();
					else {
						cls = classes.find((cls) => cls.name === val.string);
						if (!cls) {
							function privateProto() {}
							localFromProtoTypes.set(val.string, {
								protoCon: privateProto.prototype.constructor,
								cb: null
							});
							tmpobj = new privateProto();
						} else {
							nextMode = CONTEXT_CLASS_VALUE;
							tmpobj = {};
						}
					}
					word = WORD_POS_RESET;
				} else word = WORD_POS_RESET;
				else if (parse_context == CONTEXT_OBJECT_FIELD && word == WORD_POS_RESET) {
					throwError("fault while parsing; getting field name unexpected ", cInt);
					status = false;
					return false;
				}
				let old_context = getContext();
				val.value_type = VALUE_OBJECT;
				if (parse_context === CONTEXT_UNKNOWN) elements = tmpobj;
				else if (parse_context == CONTEXT_IN_ARRAY) {
					if (arrayType == -1) {}
					val.name = elements.length;
				} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) {
					if (!val.name && current_class) val.name = current_class.fields[current_class_field++];
					elements[val.name] = tmpobj;
				}
				old_context.context = parse_context;
				old_context.elements = elements;
				old_context.name = val.name;
				old_context.current_proto = current_proto;
				old_context.current_class = current_class;
				old_context.current_class_field = current_class_field;
				old_context.valueType = val.value_type;
				old_context.arrayType = arrayType;
				old_context.className = val.className;
				val.className = null;
				val.name = null;
				current_proto = protoDef;
				current_class = cls;
				current_class_field = 0;
				elements = tmpobj;
				if (!rootObject) rootObject = elements;
				context_stack.push(old_context);
				RESET_VAL();
				parse_context = nextMode;
				return true;
			}
			function openArray() {
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(91);
				if (word == WORD_POS_END && val.string.length) {
					let typeIndex = knownArrayTypeNames.findIndex((type) => type === val.string);
					word = WORD_POS_RESET;
					if (typeIndex >= 0) {
						arrayType = typeIndex;
						val.className = val.string;
						val.string = null;
					} else if (val.string === "ref") {
						val.className = null;
						arrayType = -2;
					} else if (localFromProtoTypes.get(val.string)) val.className = val.string;
					else if (fromProtoTypes.get(val.string)) val.className = val.string;
					else throwError(`Unknown type '${val.string}' specified for array`, cInt);
				} else if (parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD) {
					throwError("Fault while parsing; while getting field name unexpected", cInt);
					status = false;
					return false;
				}
				{
					let old_context = getContext();
					val.value_type = VALUE_ARRAY;
					let tmparr = [];
					if (parse_context == CONTEXT_UNKNOWN) elements = tmparr;
					else if (parse_context == CONTEXT_IN_ARRAY) {
						if (arrayType == -1) elements.push(tmparr);
						val.name = elements.length;
					} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
						if (!val.name) {
							console.log("This says it's resolved.......");
							arrayType = -3;
						}
						if (current_proto && current_proto.protoDef) if (current_proto.protoDef.cb) {
							const newarr = current_proto.protoDef.cb.call(elements, val.name, tmparr);
							if (newarr !== void 0) tmparr = elements[val.name] = newarr;
						} else elements[val.name] = tmparr;
						else elements[val.name] = tmparr;
					}
					old_context.context = parse_context;
					old_context.elements = elements;
					old_context.name = val.name;
					old_context.current_proto = current_proto;
					old_context.current_class = current_class;
					old_context.current_class_field = current_class_field;
					old_context.valueType = val.value_type;
					old_context.arrayType = arrayType == -1 ? -3 : arrayType;
					old_context.className = val.className;
					arrayType = -1;
					val.className = null;
					val.name = null;
					current_proto = null;
					current_class = null;
					current_class_field = 0;
					elements = tmparr;
					if (!rootObject) rootObject = tmparr;
					context_stack.push(old_context);
					RESET_VAL();
					parse_context = CONTEXT_IN_ARRAY;
				}
				return true;
			}
			function getProto() {
				const result = {
					protoDef: null,
					cls: null
				};
				if (result.protoDef = localFromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				} else if (result.protoDef = fromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				}
				if (val.string) {
					result.cls = classes.find((cls) => cls.name === val.string);
					if (!result.protoDef && !result.cls) {}
				}
				return result.protoDef || result.cls ? result : null;
			}
			if (!status) return -1;
			if (msg && msg.length) {
				input = getBuffer();
				input.buf = msg;
				inQueue.push(input);
			} else {
				if (gatheringNumber) {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
					retval = 1;
				}
				if (parse_context !== CONTEXT_UNKNOWN) throwError("Unclosed object at end of stream.", cInt);
			}
			while (status && (input = inQueue.shift())) {
				n = input.n;
				buf = input.buf;
				if (gatheringString) {
					let string_status = gatherString(gatheringStringFirstChar);
					if (string_status < 0) status = false;
					else if (string_status > 0) {
						gatheringString = false;
						if (status) val.value_type = VALUE_STRING;
					}
				}
				if (gatheringNumber) collectNumber();
				while (!completed && status && n < buf.length) {
					str = buf.charAt(n);
					cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					pos.col++;
					if (comment) {
						if (comment == 1) if (cInt == 42) comment = 3;
						else if (cInt != 47) return throwError("fault while parsing;", cInt);
						else comment = 2;
						else if (comment == 2) {
							if (cInt == 10 || cInt == 13) comment = 0;
						} else if (comment == 3) {
							if (cInt == 42) comment = 4;
						} else if (cInt == 47) comment = 0;
						else comment = 3;
						continue;
					}
					switch (cInt) {
						case 35:
							comment = 2;
							break;
						case 47:
							comment = 1;
							break;
						case 123:
							openObject();
							break;
						case 91:
							openArray();
							break;
						case 58:
							if (parse_context == CONTEXT_CLASS_VALUE) {
								word = WORD_POS_RESET;
								val.name = val.string;
								val.string = "";
								val.value_type = VALUE_UNSET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_FIELD) if (parse_context == CONTEXT_CLASS_FIELD) {
								if (!Object.keys(elements).length) {
									console.log("This is a full object, not a class def...", val.className);
									const privateProto = () => {};
									localFromProtoTypes.set(context_stack.last.node.current_class.name, {
										protoCon: privateProto.prototype.constructor,
										cb: null
									});
									elements = new privateProto();
									parse_context = CONTEXT_OBJECT_FIELD_VALUE;
									val.name = val.string;
									word = WORD_POS_RESET;
									val.string = "";
									val.value_type = VALUE_UNSET;
									console.log("don't do default;s do a revive...");
								}
							} else {
								if (word != WORD_POS_RESET && word != WORD_POS_END && word != WORD_POS_FIELD && word != WORD_POS_AFTER_FIELD) recoverIdent(32);
								word = WORD_POS_RESET;
								val.name = val.string;
								val.string = "";
								parse_context = parse_context === CONTEXT_OBJECT_FIELD ? CONTEXT_OBJECT_FIELD_VALUE : CONTEXT_CLASS_FIELD_VALUE;
								val.value_type = VALUE_UNSET;
							}
							else if (parse_context == CONTEXT_UNKNOWN) {
								console.log("Override colon found, allow class redefinition", parse_context);
								redefineClass = true;
								break;
							} else {
								if (parse_context == CONTEXT_IN_ARRAY) throwError("(in array, got colon out of string):parsing fault;", cInt);
								else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
								else throwError("(outside any object, got colon out of string):parsing fault;", cInt);
								status = false;
							}
							break;
						case 125:
							if (word == WORD_POS_END) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) if (current_class) {
								if (val.string) current_class.fields.push(val.string);
								RESET_VAL();
								let old_context = context_stack.pop();
								parse_context = CONTEXT_UNKNOWN;
								word = WORD_POS_RESET;
								val.name = old_context.name;
								elements = old_context.elements;
								current_class = old_context.current_class;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								rootObject = null;
								dropContext(old_context);
							} else throwError("State error; gathering class fields, and lost the class", cInt);
							else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_VALUE) {
								if (val.value_type != VALUE_UNSET) {
									if (current_class) val.name = current_class.fields[current_class_field++];
									objectPush();
								}
								val.value_type = VALUE_OBJECT;
								if (current_proto && current_proto.protoDef) {
									console.log("SOMETHING SHOULD AHVE BEEN REPLACED HERE??", current_proto);
									console.log("The other version only revives on init");
									elements = new current_proto.protoDef.cb(elements, void 0, void 0);
								}
								val.contains = elements;
								val.string = "";
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_class = old_context.current_class;
								current_proto = old_context.current_proto;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
								if (val.value_type === VALUE_UNSET) if (word == WORD_POS_RESET) throwError("Fault while parsing; unexpected", cInt);
								else recoverIdent(cInt);
								objectPush();
								val.value_type = VALUE_OBJECT;
								val.contains = elements;
								word = WORD_POS_RESET;
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_proto = old_context.current_proto;
								current_class = old_context.current_class;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError("Fault while parsing; unexpected", cInt);
								status = false;
							}
							negative = false;
							break;
						case 93:
							if (word >= WORD_POS_AFTER_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type != VALUE_UNSET) arrayPush();
								else if (word !== WORD_POS_RESET) {
									recoverIdent(cInt);
									arrayPush();
								}
								val.contains = elements;
								{
									let old_context = context_stack.pop();
									val.name = old_context.name;
									val.className = old_context.className;
									parse_context = old_context.context;
									elements = old_context.elements;
									current_proto = old_context.current_proto;
									current_class = old_context.current_class;
									current_class_field = old_context.current_class_field;
									arrayType = old_context.arrayType;
									val.value_type = old_context.valueType;
									dropContext(old_context);
								}
								val.value_type = VALUE_ARRAY;
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError(`bad context ${parse_context}; fault while parsing`, cInt);
								status = false;
							}
							negative = false;
							break;
						case 44:
							if (word < WORD_POS_AFTER_FIELD && word != WORD_POS_RESET) recoverIdent(cInt);
							if (word == WORD_POS_END || word == WORD_POS_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) if (current_class) {
								current_class.fields.push(val.string);
								val.string = "";
								word = WORD_POS_FIELD;
							} else throwError("State error; gathering class fields, and lost the class", cInt);
							else if (parse_context == CONTEXT_OBJECT_FIELD) {
								if (current_class) {
									val.name = current_class.fields[current_class_field++];
									if (val.value_type != VALUE_UNSET) {
										objectPush();
										RESET_VAL();
									}
								} else if (val.string || val.value_type) throwError("State error; comma in field name and/or lost the class", cInt);
							} else if (parse_context == CONTEXT_CLASS_VALUE) {
								if (current_class) {
									if (arrayType != -3 && !val.name) val.name = current_class.fields[current_class_field++];
									if (val.value_type != VALUE_UNSET) {
										if (arrayType != -3) objectPush();
										RESET_VAL();
									}
								} else if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								val.name = null;
							} else if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type == VALUE_UNSET) val.value_type = VALUE_EMPTY;
								arrayPush();
								RESET_VAL();
								word = WORD_POS_RESET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE && val.value_type != VALUE_UNSET) {
								parse_context = CONTEXT_OBJECT_FIELD;
								if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								word = WORD_POS_RESET;
							} else {
								status = false;
								throwError("bad context; excessive commas while parsing;", cInt);
							}
							negative = false;
							break;
						default:
							switch (cInt) {
								default:
									if (parse_context == CONTEXT_UNKNOWN || parse_context == CONTEXT_OBJECT_FIELD_VALUE && word == WORD_POS_FIELD || parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || parse_context == CONTEXT_CLASS_FIELD) switch (cInt) {
										case 96:
										case 34:
										case 39:
											if (word == WORD_POS_RESET || word == WORD_POS_FIELD) {
												if (val.string.length) {
													console.log("IN ARRAY AND FIXING?");
													val.className = val.string;
													val.string = "";
												}
												if (gatherString(cInt)) val.value_type = VALUE_STRING;
												else {
													gatheringStringFirstChar = cInt;
													gatheringString = true;
												}
											} else throwError("fault while parsing; quote not at start of field name", cInt);
											break;
										case 10:
											pos.line++;
											pos.col = 1;
										case 13:
										case 32:
										case 8232:
										case 8233:
										case 9:
										case 65279:
											if (parse_context === CONTEXT_UNKNOWN && word === WORD_POS_END) {
												word = WORD_POS_RESET;
												if (parse_context === CONTEXT_UNKNOWN) completed = true;
												break;
											}
											if (word === WORD_POS_RESET || word === WORD_POS_AFTER_FIELD) {
												if (parse_context == CONTEXT_UNKNOWN && val.value_type) completed = true;
												break;
											} else if (word === WORD_POS_FIELD) {
												if (parse_context === CONTEXT_UNKNOWN) {
													word = WORD_POS_RESET;
													completed = true;
													break;
												}
												if (val.string.length) console.log("STEP TO NEXT TOKEN.");
												word = WORD_POS_AFTER_FIELD;
											} else {
												status = false;
												throwError("fault while parsing; whitepsace unexpected", cInt);
											}
											break;
										default:
											if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
												fromHex = false;
												exponent = false;
												date_format = false;
												isBigInt = false;
												exponent_sign = false;
												exponent_digit = false;
												decimal = false;
												val.string = str;
												input.n = n;
												collectNumber();
												break;
											}
											if (word === WORD_POS_AFTER_FIELD) {
												status = false;
												throwError("fault while parsing; character unexpected", cInt);
											}
											if (word === WORD_POS_RESET) {
												word = WORD_POS_FIELD;
												val.value_type = VALUE_STRING;
												val.string += str;
												break;
											}
											if (val.value_type == VALUE_UNSET) {
												if (word !== WORD_POS_RESET && word !== WORD_POS_END) recoverIdent(cInt);
											} else {
												if (word === WORD_POS_END || word === WORD_POS_FIELD) {
													val.string += str;
													break;
												}
												if (parse_context == CONTEXT_OBJECT_FIELD) {
													if (word == WORD_POS_FIELD) {
														val.string += str;
														break;
													}
													throwError("Multiple values found in field name", cInt);
												}
												if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
											}
											break;
									}
									else {
										if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
											fromHex = false;
											exponent = false;
											date_format = false;
											isBigInt = false;
											exponent_sign = false;
											exponent_digit = false;
											decimal = false;
											val.string = str;
											input.n = n;
											collectNumber();
										} else if (val.value_type == VALUE_UNSET) if (word != WORD_POS_RESET) recoverIdent(cInt);
										else {
											word = WORD_POS_END;
											val.string += str;
											val.value_type = VALUE_STRING;
										}
										else if (parse_context == CONTEXT_OBJECT_FIELD) throwError("Multiple values found in field name", cInt);
										else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											if (val.value_type != VALUE_STRING) {
												if (val.value_type == VALUE_OBJECT || val.value_type == VALUE_ARRAY) throwError("String unexpected", cInt);
												recoverIdent(cInt);
											}
											if (word == WORD_POS_AFTER_FIELD) if (getProto()) val.string = str;
											else throwError("String unexpected", cInt);
											else if (word == WORD_POS_END) val.string += str;
											else throwError("String unexpected", cInt);
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											if (word == WORD_POS_AFTER_FIELD) {
												if (!val.className) {
													val.className = val.string;
													val.string = "";
												}
												val.string += str;
												break;
											} else if (word == WORD_POS_END) val.string += str;
										}
										break;
									}
									break;
								case 96:
								case 34:
								case 39:
									if (val.string) val.className = val.string;
									val.string = "";
									if (gatherString(cInt)) {
										val.value_type = VALUE_STRING;
										word = WORD_POS_END;
									} else {
										gatheringStringFirstChar = cInt;
										gatheringString = true;
									}
									break;
								case 10:
									pos.line++;
									pos.col = 1;
								case 32:
								case 9:
								case 13:
								case 8232:
								case 8233:
								case 65279:
									if (word == WORD_POS_END) {
										if (parse_context == CONTEXT_UNKNOWN) {
											word = WORD_POS_RESET;
											completed = true;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											word = WORD_POS_AFTER_FIELD_VALUE;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD) {
											word = WORD_POS_AFTER_FIELD;
											break;
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											word = WORD_POS_AFTER_FIELD;
											break;
										}
									}
									if (word == WORD_POS_RESET || word == WORD_POS_AFTER_FIELD) break;
									else if (word == WORD_POS_FIELD) {
										if (val.string.length) word = WORD_POS_AFTER_FIELD;
									} else if (word < WORD_POS_END) recoverIdent(cInt);
									break;
								case 116:
									if (word == WORD_POS_RESET) word = WORD_POS_TRUE_1;
									else if (word == WORD_POS_INFINITY_6) word = WORD_POS_INFINITY_7;
									else recoverIdent(cInt);
									break;
								case 114:
									if (word == WORD_POS_TRUE_1) word = WORD_POS_TRUE_2;
									else recoverIdent(cInt);
									break;
								case 117:
									if (word == WORD_POS_TRUE_2) word = WORD_POS_TRUE_3;
									else if (word == WORD_POS_NULL_1) word = WORD_POS_NULL_2;
									else if (word == WORD_POS_RESET) word = WORD_POS_UNDEFINED_1;
									else recoverIdent(cInt);
									break;
								case 101:
									if (word == WORD_POS_TRUE_3) {
										val.value_type = VALUE_TRUE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_4) {
										val.value_type = VALUE_FALSE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_UNDEFINED_3) word = WORD_POS_UNDEFINED_4;
									else if (word == WORD_POS_UNDEFINED_7) word = WORD_POS_UNDEFINED_8;
									else recoverIdent(cInt);
									break;
								case 110:
									if (word == WORD_POS_RESET) word = WORD_POS_NULL_1;
									else if (word == WORD_POS_UNDEFINED_1) word = WORD_POS_UNDEFINED_2;
									else if (word == WORD_POS_UNDEFINED_6) word = WORD_POS_UNDEFINED_7;
									else if (word == WORD_POS_INFINITY_1) word = WORD_POS_INFINITY_2;
									else if (word == WORD_POS_INFINITY_4) word = WORD_POS_INFINITY_5;
									else recoverIdent(cInt);
									break;
								case 100:
									if (word == WORD_POS_UNDEFINED_2) word = WORD_POS_UNDEFINED_3;
									else if (word == WORD_POS_UNDEFINED_8) {
										val.value_type = VALUE_UNDEFINED;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 105:
									if (word == WORD_POS_UNDEFINED_5) word = WORD_POS_UNDEFINED_6;
									else if (word == WORD_POS_INFINITY_3) word = WORD_POS_INFINITY_4;
									else if (word == WORD_POS_INFINITY_5) word = WORD_POS_INFINITY_6;
									else recoverIdent(cInt);
									break;
								case 108:
									if (word == WORD_POS_NULL_2) word = WORD_POS_NULL_3;
									else if (word == WORD_POS_NULL_3) {
										val.value_type = VALUE_NULL;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_2) word = WORD_POS_FALSE_3;
									else recoverIdent(cInt);
									break;
								case 102:
									if (word == WORD_POS_RESET) word = WORD_POS_FALSE_1;
									else if (word == WORD_POS_UNDEFINED_4) word = WORD_POS_UNDEFINED_5;
									else if (word == WORD_POS_INFINITY_2) word = WORD_POS_INFINITY_3;
									else recoverIdent(cInt);
									break;
								case 97:
									if (word == WORD_POS_FALSE_1) word = WORD_POS_FALSE_2;
									else if (word == WORD_POS_NAN_1) word = WORD_POS_NAN_2;
									else recoverIdent(cInt);
									break;
								case 115:
									if (word == WORD_POS_FALSE_3) word = WORD_POS_FALSE_4;
									else recoverIdent(cInt);
									break;
								case 73:
									if (word == WORD_POS_RESET) word = WORD_POS_INFINITY_1;
									else recoverIdent(cInt);
									break;
								case 78:
									if (word == WORD_POS_RESET) word = WORD_POS_NAN_1;
									else if (word == WORD_POS_NAN_2) {
										val.value_type = negative ? VALUE_NEG_NAN : VALUE_NAN;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 121:
									if (word == WORD_POS_INFINITY_7) {
										val.value_type = negative ? VALUE_NEG_INFINITY : VALUE_INFINITY;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 45:
									if (word == WORD_POS_RESET) negative = !negative;
									else recoverIdent(cInt);
									break;
								case 43:
									if (word !== WORD_POS_RESET) recoverIdent(cInt);
									break;
							}
							break;
					}
					if (completed) {
						if (word == WORD_POS_END) word = WORD_POS_RESET;
						break;
					}
				}
				if (n == buf.length) {
					dropBuffer(input);
					if (val.value_type == VALUE_UNSET && complete_at_end && word != WORD_POS_RESET) recoverIdent(32);
					if (gatheringString || gatheringNumber || parse_context == CONTEXT_OBJECT_FIELD) retval = 0;
					else if (parse_context == CONTEXT_UNKNOWN && (val.value_type != VALUE_UNSET || result)) {
						completed = true;
						retval = 1;
					}
				} else {
					input.n = n;
					inQueue.unshift(input);
					retval = 2;
				}
				if (completed) {
					rootObject = null;
					break;
				}
			}
			if (!status) return -1;
			if (completed && val.value_type != VALUE_UNSET) {
				word = WORD_POS_RESET;
				result = convertValue();
				negative = false;
				val.string = "";
				val.value_type = VALUE_UNSET;
			}
			completed = false;
			return retval;
		}
	};
};
var _parser = [Object.freeze(JSOX.begin())];
var _parse_level = 0;
/**
* parse a string resulting with one value from it.
*
* @template T
* @param {string} msg 
* @param {(this: any, key: string, value: any) => any} [reviver] 
* @returns {T}
*/
JSOX.parse = function(msg, reviver) {
	let parse_level = _parse_level++;
	let parser;
	if (_parser.length <= parse_level) _parser.push(Object.freeze(JSOX.begin()));
	parser = _parser[parse_level];
	if (typeof msg !== "string") msg = String(msg);
	parser.reset();
	const writeResult = parser._write(msg, true);
	if (writeResult > 0) {
		if (writeResult > 1) {}
		let result = parser.value();
		if ("undefined" === typeof result && writeResult > 1) throw new Error("Pending value could not complete");
		result = typeof reviver === "function" ? function walk(holder, key) {
			let k, v, value = holder[key];
			if (value && typeof value === "object") {
				for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				}
			}
			return reviver.call(holder, key, value);
		}({ "": result }, "") : result;
		_parse_level--;
		return result;
	}
	parser.finalError();
};
function this_value() {
	return this && this.valueOf();
}
/**
* Define a class to be used for serialization; the class allows emitting the class fields ahead of time, and just provide values later.
* @param {string} name 
* @param {object} obj 
*/
JSOX.defineClass = function(name, obj) {
	let cls;
	let denormKeys = Object.keys(obj);
	for (let i = 1; i < denormKeys.length; i++) {
		let a, b;
		if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
			denormKeys[i - 1] = b;
			denormKeys[i] = a;
			if (i) i -= 2;
			else i--;
		}
	}
	commonClasses.push(cls = {
		name,
		tag: denormKeys.toString(),
		proto: Object.getPrototypeOf(obj),
		fields: Object.keys(obj)
	});
	for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
		let tmp = cls.fields[n - 1];
		cls.fields[n - 1] = cls.fields[n];
		cls.fields[n] = tmp;
		if (n > 1) n -= 2;
	}
	if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
};
/**
* deprecated; define a class to be used for serialization
*
* @param {string} named
* @param {class} ptype
* @param {(any)=>any} f
*/
JSOX.registerToJSOX = function(name, ptype, f) {
	throw new Error("registerToJSOX deprecated; please use toJSOX:" + prototypeName + prototype.toString());
};
/**
* define a class with special serialization rules.
*
* @param {string} named
* @param {class} ptype
* @param {(any)=>any} f
*/
JSOX.toJSOX = function(name, ptype, f) {
	if (!ptype.prototype || ptype.prototype !== Object.prototype) {
		if (toProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
		toProtoTypes.set(ptype.prototype, {
			external: true,
			name: name || f.constructor.name,
			cb: f
		});
	} else {
		let key = Object.keys(ptype).toString();
		if (toObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
		toObjectTypes.set(key, {
			external: true,
			name,
			cb: f
		});
	}
};
/**
* define a class to be used for deserialization
* @param {string} prototypeName 
* @param {class} o 
* @param {(any)=>any} f 
*/
JSOX.fromJSOX = function(prototypeName, o, f) {
	function privateProto() {}
	if (!o) o = privateProto.prototype;
	if (fromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
	if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
	fromProtoTypes.set(prototypeName, {
		protoCon: o.prototype.constructor,
		cb: f
	});
};
/**
* deprecated; use fromJSOX instead
*/
JSOX.registerFromJSOX = function(prototypeName, o) {
	throw new Error("deprecated; please adjust code to use fromJSOX:" + prototypeName + o.toString());
};
/**
* Define serialization and deserialization methods for a class.
* This is the same as registering separately with toJSOX and fromJSOX methods.
* 
* @param {string} name - Name used to prefix objects of this type encoded in JSOX
* @param {class} prototype - prototype to match when serializing, and to create instaces of when deserializing.
* @param {(stringifier:JSOXStringifier)=>{string}} to - `this` is the value to convert; function to call to encode JSOX from an object
* @param {(field:string,val:any)=>{any}} from - handle storing revived value in class
*/
JSOX.addType = function(prototypeName, prototype, to, from) {
	JSOX.toJSOX(prototypeName, prototype, to);
	JSOX.fromJSOX(prototypeName, prototype, from);
};
JSOX.registerToFrom = function(prototypeName, prototype) {
	throw new Error("registerToFrom deprecated; please use addType:" + prototypeName + prototype.toString());
};
/**
* Create a stringifier to convert objects to JSOX text.  Allows defining custom serialization for objects.
* @returns {JSOXStringifier}
*/
JSOX.stringifier = function() {
	let classes = [];
	let useQuote = "\"";
	let fieldMap = /* @__PURE__ */ new WeakMap();
	const path = [];
	let encoding = [];
	const localToProtoTypes = /* @__PURE__ */ new WeakMap();
	const localToObjectTypes = /* @__PURE__ */ new Map();
	let objectToJSOX = null;
	const stringifying = [];
	let ignoreNonEnumerable = false;
	function getIdentifier(s) {
		if ("string" === typeof s && s === "") return "\"\"";
		if ("number" === typeof s && !isNaN(s)) return [
			"'",
			s.toString(),
			"'"
		].join("");
		if (s.includes("﻿")) return useQuote + JSOX.escape(s) + useQuote;
		return s in keywords || /[0-9\-]/.test(s[0]) || /[\n\r\t #\[\]{}()<>\~!+*/.:,\-"'`]/.test(s) ? useQuote + JSOX.escape(s) + useQuote : s;
	}
	if (!toProtoTypes.get(Object.prototype)) {
		toProtoTypes.set(Object.prototype, {
			external: false,
			name: Object.prototype.constructor.name,
			cb: null
		});
		toProtoTypes.set(Date.prototype, {
			external: false,
			name: "Date",
			cb: function() {
				if (this.getTime() === -621672192e5) return "0000-01-01T00:00:00.000Z";
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(DateNS.prototype, {
			external: false,
			name: "DateNS",
			cb: function() {
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				}, pad6 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 1e5 ? "0" : "") + (norm < 1e4 ? "0" : "") + (norm < 1e3 ? "0" : "") + (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + pad6(this.ns) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(Boolean.prototype, {
			external: false,
			name: "Boolean",
			cb: this_value
		});
		toProtoTypes.set(Number.prototype, {
			external: false,
			name: "Number",
			cb: function() {
				if (isNaN(this)) return "NaN";
				return isFinite(this) ? String(this) : this < 0 ? "-Infinity" : "Infinity";
			}
		});
		toProtoTypes.set(String.prototype, {
			external: false,
			name: "String",
			cb: function() {
				return "\"" + JSOX.escape(this_value.apply(this)) + "\"";
			}
		});
		if (typeof BigInt === "function") toProtoTypes.set(BigInt.prototype, {
			external: false,
			name: "BigInt",
			cb: function() {
				return this + "n";
			}
		});
		toProtoTypes.set(ArrayBuffer.prototype, {
			external: true,
			name: "ab",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this)) + "]";
			}
		});
		toProtoTypes.set(Uint8Array.prototype, {
			external: true,
			name: "u8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint8ClampedArray.prototype, {
			external: true,
			name: "uc8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int8Array.prototype, {
			external: true,
			name: "s8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint16Array.prototype, {
			external: true,
			name: "u16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int16Array.prototype, {
			external: true,
			name: "s16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint32Array.prototype, {
			external: true,
			name: "u32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int32Array.prototype, {
			external: true,
			name: "s32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float32Array.prototype, {
			external: true,
			name: "f32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(RegExp.prototype, mapToJSOX = {
			external: true,
			name: "regex",
			cb: function(o, stringifier) {
				return "'" + escape(this.source) + "'";
			}
		});
		fromProtoTypes.set("regex", {
			protoCon: RegExp,
			cb: function(field, val) {
				return new RegExp(this);
			}
		});
		toProtoTypes.set(Map.prototype, mapToJSOX = {
			external: true,
			name: "map",
			cb: null
		});
		fromProtoTypes.set("map", {
			protoCon: Map,
			cb: function(field, val) {
				if (field) {
					this.set(field, val);
					return;
				}
				return this;
			}
		});
		toProtoTypes.set(Array.prototype, arrayToJSOX = {
			external: false,
			name: Array.prototype.constructor.name,
			cb: null
		});
	}
	const stringifier = {
		defineClass(name, obj) {
			let cls;
			let denormKeys = Object.keys(obj);
			for (let i = 1; i < denormKeys.length; i++) {
				let a, b;
				if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
					denormKeys[i - 1] = b;
					denormKeys[i] = a;
					if (i) i -= 2;
					else i--;
				}
			}
			classes.push(cls = {
				name,
				tag: denormKeys.toString(),
				proto: Object.getPrototypeOf(obj),
				fields: Object.keys(obj)
			});
			for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
				let tmp = cls.fields[n - 1];
				cls.fields[n - 1] = cls.fields[n];
				cls.fields[n] = tmp;
				if (n > 1) n -= 2;
			}
			if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
		},
		setDefaultObjectToJSOX(cb) {
			objectToJSOX = cb;
		},
		isEncoding(o) {
			return !!encoding.find((eo, i) => eo === o && i < encoding.length - 1);
		},
		encodeObject(o) {
			if (objectToJSOX) return objectToJSOX.apply(o, [this]);
			return o;
		},
		stringify(o, r, s) {
			return stringify(o, r, s);
		},
		setQuote(q) {
			useQuote = q;
		},
		registerToJSOX(n, p, f) {
			return this.toJSOX(n, p, f);
		},
		toJSOX(name, ptype, f) {
			if (ptype.prototype && ptype.prototype !== Object.prototype) {
				if (localToProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
				localToProtoTypes.set(ptype.prototype, {
					external: true,
					name: name || f.constructor.name,
					cb: f
				});
			} else {
				let key = Object.keys(ptype).toString();
				if (localToObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
				localToObjectTypes.set(key, {
					external: true,
					name,
					cb: f
				});
			}
		},
		get ignoreNonEnumerable() {
			return ignoreNonEnumerable;
		},
		set ignoreNonEnumerable(val) {
			ignoreNonEnumerable = val;
		}
	};
	return stringifier;
	/**
	* get a reference to a previously seen object
	* @param {any} here 
	* @returns reference to existing object, or undefined if not found.
	*/
	function getReference(here) {
		if (here === null) return void 0;
		let field = fieldMap.get(here);
		if (!field) {
			fieldMap.set(here, _JSON.stringify(path));
			return;
		}
		return "ref" + field;
	}
	/**
	* find the prototype definition for a class
	* @param {object} o 
	* @param {map} useK 
	* @returns object
	*/
	function matchObject(o, useK) {
		let k;
		let cls;
		let prt = Object.getPrototypeOf(o);
		cls = classes.find((cls) => {
			if (cls.proto && cls.proto === prt) return true;
		});
		if (cls) return cls;
		if (classes.length || commonClasses.length) {
			if (useK) {
				useK = useK.map((v) => {
					if (typeof v === "string") return v;
					else return void 0;
				});
				k = useK.toString();
			} else {
				let denormKeys = Object.keys(o);
				for (let i = 1; i < denormKeys.length; i++) {
					let a, b;
					if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
						denormKeys[i - 1] = b;
						denormKeys[i] = a;
						if (i) i -= 2;
						else i--;
					}
				}
				k = denormKeys.toString();
			}
			cls = classes.find((cls) => {
				if (cls.tag === k) return true;
			});
			if (!cls) cls = commonClasses.find((cls) => {
				if (cls.tag === k) return true;
			});
		}
		return cls;
	}
	/**
	* Serialize an object to JSOX text.
	* @param {any} object 
	* @param {(key:string,value:any)=>string} replacer 
	* @param {string|number} space 
	* @returns 
	*/
	function stringify(object, replacer, space) {
		if (object === void 0) return "undefined";
		if (object === null) return;
		let gap;
		let indent;
		let rep;
		let i;
		const spaceType = typeof space;
		const repType = typeof replacer;
		gap = "";
		indent = "";
		if (spaceType === "number") for (i = 0; i < space; i += 1) indent += " ";
		else if (spaceType === "string") indent = space;
		rep = replacer;
		if (replacer && repType !== "function" && (repType !== "object" || typeof replacer.length !== "number")) throw new Error("JSOX.stringify");
		path.length = 0;
		fieldMap = /* @__PURE__ */ new WeakMap();
		const finalResult = str("", { "": object });
		commonClasses.length = 0;
		return finalResult;
		function str(key, holder) {
			var mind = gap;
			const doArrayToJSOX_ = arrayToJSOX.cb;
			const mapToObject_ = mapToJSOX.cb;
			arrayToJSOX.cb = doArrayToJSOX;
			mapToJSOX.cb = mapToObject;
			const v = str_(key, holder);
			arrayToJSOX.cb = doArrayToJSOX_;
			mapToJSOX.cb = mapToObject_;
			return v;
			function doArrayToJSOX() {
				let v;
				let partial = [];
				let thisNodeNameIndex = path.length;
				for (let i = 0; i < this.length; i += 1) {
					path[thisNodeNameIndex] = i;
					partial[i] = str(i, this) || "null";
				}
				path.length = thisNodeNameIndex;
				encoding.length = thisNodeNameIndex;
				v = partial.length === 0 ? "[]" : gap ? [
					"[\n",
					gap,
					partial.join(",\n" + gap),
					"\n",
					mind,
					"]"
				].join("") : "[" + partial.join(",") + "]";
				return v;
			}
			function mapToObject() {
				let tmp = { tmp: null };
				let out = "{";
				let first = true;
				for (let [key, value] of this) {
					tmp.tmp = value;
					let thisNodeNameIndex = path.length;
					path[thisNodeNameIndex] = key;
					out += (first ? "" : ",") + getIdentifier(key) + ":" + str("tmp", tmp);
					path.length = thisNodeNameIndex;
					first = false;
				}
				out += "}";
				return out;
			}
			function str_(key, holder) {
				let i;
				let k;
				let v;
				let length;
				let partialClass;
				let partial;
				let thisNodeNameIndex = path.length;
				let isValue = true;
				let value = holder[key];
				let isObject = typeof value === "object";
				let c;
				if (isObject && value !== null) {
					if (objectToJSOX) {
						if (!stringifying.find((val) => val === value)) {
							stringifying.push(value);
							encoding[thisNodeNameIndex] = value;
							isValue = false;
							value = objectToJSOX.apply(value, [stringifier]);
							isObject = typeof value === "object";
							stringifying.pop();
							encoding.length = thisNodeNameIndex;
							isObject = typeof value === "object";
						}
					}
				}
				const objType = value !== void 0 && value !== null && Object.getPrototypeOf(value);
				let protoConverter = objType && (localToProtoTypes.get(objType) || toProtoTypes.get(objType) || null);
				let objectConverter = !protoConverter && value !== void 0 && value !== null && (localToObjectTypes.get(Object.keys(value).toString()) || toObjectTypes.get(Object.keys(value).toString()) || null);
				if (typeof rep === "function") {
					isValue = false;
					value = rep.call(holder, key, value);
				}
				let toJSOX = protoConverter && protoConverter.cb || objectConverter && objectConverter.cb;
				if (value !== void 0 && value !== null && typeof value === "object" && typeof toJSOX === "function") if (!stringifying.find((val) => val === value)) {
					if (typeof value === "object") {
						v = getReference(value);
						if (v) return v;
					}
					stringifying.push(value);
					encoding[thisNodeNameIndex] = value;
					value = toJSOX.call(value, stringifier);
					isValue = false;
					stringifying.pop();
					if (protoConverter && protoConverter.name) {
						if ("string" === typeof value && value[0] !== "-" && (value[0] < "0" || value[0] > "9") && value[0] !== "\"" && value[0] !== "'" && value[0] !== "`" && value[0] !== "[" && value[0] !== "{") value = " " + value;
					}
					encoding.length = thisNodeNameIndex;
				} else v = getReference(value);
				else if (typeof value === "object") {
					v = getReference(value);
					if (v) return v;
				}
				switch (typeof value) {
					case "bigint": return value + "n";
					case "string": {
						value = isValue ? getIdentifier(value) : value;
						let c = "";
						if (key === "") c = classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + (gap ? "\n" : "");
						if (protoConverter && protoConverter.external) return c + protoConverter.name + value;
						if (objectConverter && objectConverter.external) return c + objectConverter.name + value;
						return c + value;
					}
					case "number":
					case "boolean":
					case "null": return String(value);
					case "object":
						if (v) return v;
						if (!value) return "null";
						gap += indent;
						partialClass = null;
						partial = [];
						if (rep && typeof rep === "object") {
							length = rep.length;
							partialClass = matchObject(value, rep);
							for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
								k = rep[i];
								path[thisNodeNameIndex] = k;
								v = str(k, value);
								if (v !== void 0) if (partialClass) partial.push(v);
								else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
							}
							path.splice(thisNodeNameIndex, 1);
						} else {
							partialClass = matchObject(value);
							let keys = [];
							for (k in value) {
								if (ignoreNonEnumerable) {
									if (!Object.prototype.propertyIsEnumerable.call(value, k)) continue;
								}
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									let n;
									for (n = 0; n < keys.length; n++) if (keys[n] > k) {
										keys.splice(n, 0, k);
										break;
									}
									if (n == keys.length) keys.push(k);
								}
							}
							for (let n = 0; n < keys.length; n++) {
								k = keys[n];
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									path[thisNodeNameIndex] = k;
									v = str(k, value);
									if (v !== void 0) if (partialClass) partial.push(v);
									else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
								}
							}
							path.splice(thisNodeNameIndex, 1);
						}
						if (key === "") c = (classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") || commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "")) + (gap ? "\n" : "");
						else c = "";
						if (protoConverter && protoConverter.external) c = c + getIdentifier(protoConverter.name);
						let ident = null;
						if (partialClass) ident = getIdentifier(partialClass.name);
						v = c + (partial.length === 0 ? "{}" : gap ? (partialClass ? ident : "") + "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : (partialClass ? ident : "") + "{" + partial.join(",") + "}");
						gap = mind;
						return v;
				}
			}
		}
	}
};
var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_";
var decodings = {
	"~": -1,
	"=": -1,
	"$": 62,
	"_": 63,
	"+": 62,
	"-": 62,
	".": 62,
	"/": 63,
	",": 63
};
for (let x = 0; x < 64; x++) decodings[encodings[x]] = x;
Object.freeze(decodings);
function base64ArrayBuffer(arrayBuffer) {
	let base64 = "";
	let bytes = new Uint8Array(arrayBuffer);
	let byteLength = bytes.byteLength;
	let byteRemainder = byteLength % 3;
	let mainLength = byteLength - byteRemainder;
	let a, b, c, d;
	let chunk;
	for (let i = 0; i < mainLength; i = i + 3) {
		chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
		a = (chunk & 16515072) >> 18;
		b = (chunk & 258048) >> 12;
		c = (chunk & 4032) >> 6;
		d = chunk & 63;
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}
	if (byteRemainder == 1) {
		chunk = bytes[mainLength];
		a = (chunk & 252) >> 2;
		b = (chunk & 3) << 4;
		base64 += encodings[a] + encodings[b] + "==";
	} else if (byteRemainder == 2) {
		chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
		a = (chunk & 64512) >> 10;
		b = (chunk & 1008) >> 4;
		c = (chunk & 15) << 2;
		base64 += encodings[a] + encodings[b] + encodings[c] + "=";
	}
	return base64;
}
function DecodeBase64(buf) {
	let outsize;
	if (buf.length % 4 == 1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (buf.length % 4 == 2) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (buf.length % 4 == 3) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else if (decodings[buf[buf.length - 3]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (decodings[buf[buf.length - 2]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (decodings[buf[buf.length - 1]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else outsize = ((buf.length + 3) / 4 | 0) * 3;
	let ab = new ArrayBuffer(outsize);
	let out = new Uint8Array(ab);
	let n;
	let l = buf.length + 3 >> 2;
	for (n = 0; n < l; n++) {
		let index0 = decodings[buf[n * 4]];
		let index1 = n * 4 + 1 < buf.length ? decodings[buf[n * 4 + 1]] : -1;
		let index2 = index1 >= 0 && n * 4 + 2 < buf.length ? decodings[buf[n * 4 + 2]] : -1;
		let index3 = index2 >= 0 && n * 4 + 3 < buf.length ? decodings[buf[n * 4 + 3]] : -1;
		if (index1 >= 0) out[n * 3 + 0] = index0 << 2 | index1 >> 4;
		if (index2 >= 0) out[n * 3 + 1] = index1 << 4 | index2 >> 2 & 15;
		if (index3 >= 0) out[n * 3 + 2] = index2 << 6 | index3 & 63;
	}
	return ab;
}
/**
* @param {unknown} object 
* @param {(this: unknown, key: string, value: unknown)} [replacer] 
* @param {string | number} [space] 
* @returns {string}
*/
JSOX.stringify = function(object, replacer, space) {
	return JSOX.stringifier().stringify(object, replacer, space);
};
[[
	0,
	256,
	[
		16767487,
		16739071,
		130048,
		3670016,
		0,
		16777208,
		16777215,
		8388607
	]
]].map((row) => {
	return {
		firstChar: row[0],
		lastChar: row[1],
		bits: row[2]
	};
});
observe({
	index: 0,
	length: 0,
	action: "MANUAL",
	view: "",
	canBack: false,
	canForward: false,
	entries: []
});
typeof history != "undefined" && history.pushState.bind(history);
typeof history != "undefined" && history.replaceState.bind(history);
typeof history != "undefined" && history.go.bind(history);
typeof history != "undefined" && history.forward.bind(history);
typeof history != "undefined" && history.back.bind(history);
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/tasking/BackNavigation.ts
var ClosePriority = /* @__PURE__ */ function(ClosePriority) {
	ClosePriority[ClosePriority["CONTEXT_MENU"] = 100] = "CONTEXT_MENU";
	ClosePriority[ClosePriority["DROPDOWN"] = 90] = "DROPDOWN";
	ClosePriority[ClosePriority["MODAL"] = 80] = "MODAL";
	ClosePriority[ClosePriority["DIALOG"] = 70] = "DIALOG";
	ClosePriority[ClosePriority["SIDEBAR"] = 60] = "SIDEBAR";
	ClosePriority[ClosePriority["OVERLAY"] = 50] = "OVERLAY";
	ClosePriority[ClosePriority["PANEL"] = 40] = "PANEL";
	ClosePriority[ClosePriority["TOAST"] = 30] = "TOAST";
	ClosePriority[ClosePriority["TASK"] = 20] = "TASK";
	ClosePriority[ClosePriority["VIEW"] = 10] = "VIEW";
	ClosePriority[ClosePriority["DEFAULT"] = 0] = "DEFAULT";
	return ClosePriority;
}({});
var registry = /* @__PURE__ */ new Map();
var options = {};
var generateId = () => `closeable-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
/**
* Register a closeable element/callback with the back navigation system
*/
var registerCloseable = (entry) => {
	const id = entry.id || generateId();
	const fullEntry = Object.assign(entry, { id });
	if (fullEntry?.hashId == null) fullEntry.hashId = id;
	registry.set(id, fullEntry);
	if (options.debug) console.log("[BackNav] Registered:", id, "priority:", entry.priority);
	return () => unregisterCloseable(id);
};
/**
* Unregister a closeable by ID
*/
var unregisterCloseable = (id) => {
	const removed = registry.delete(id);
	if (options.debug && removed) console.log("[BackNav] Unregistered:", id);
	return removed;
};
/**
* Register a context menu as closeable
*/
var registerContextMenu = (element, visibleRef, onClose) => {
	return registerCloseable({
		id: `ctx-menu-${element.id || generateId()}`,
		priority: ClosePriority.CONTEXT_MENU,
		element: new WeakRef(element),
		group: "context-menu",
		isActive: () => visibleRef.value === true,
		close: () => {
			visibleRef.value = false;
			onClose?.();
			return false;
		}
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/core/Links.ts
var localStorageLinkMap = /* @__PURE__ */ new Map();
var cleanupOf = (cleanup) => {
	if (!cleanup) return;
	if (typeof cleanup == "function") return cleanup;
	const target = cleanup;
	if (typeof target?.disconnect == "function") return () => target.disconnect?.();
	if (typeof target?.unsubscribe == "function") return () => target.unsubscribe?.();
};
var runWithoutSetterTrigger = (target, cb) => {
	const control = target?.[$triggerControl];
	if (typeof control?.without == "function") return control.without(["setter", "set"], cb);
	return $avoidTrigger(target, cb);
};
var setRefValue = (target, value, forProp = "value") => {
	if (!target || !(typeof target == "object" || typeof target == "function")) return value;
	if (isNotEqual(target[forProp], value)) return runWithoutSetterTrigger(target, () => {
		target[forProp] = value;
	});
	return value;
};
var selectSourceInput = (source, event, selector = "input") => {
	const target = event?.target ?? source;
	if (target?.matches?.(selector)) return target;
	return target?.querySelector?.(selector) ?? source;
};
var eventTrigger = (events, options) => {
	const eventList = Array.isArray(events) ? events : [events];
	return ({ source, commit }) => {
		const target = source?.element ?? source?.self ?? source;
		if (!target?.addEventListener) return;
		const listener = (event) => commit(event);
		eventList.forEach((name) => target.addEventListener(name, listener, options));
		return () => eventList.forEach((name) => target.removeEventListener?.(name, listener, options));
	};
};
var mutationTrigger = (attribute) => {
	return ({ source, commit }) => {
		const target = source?.element ?? source?.self ?? source;
		if (!target || typeof MutationObserver == "undefined") return;
		const observer = new MutationObserver((records) => {
			if (!attribute || records.some((record) => record.type == "attributes" && record.attributeName == attribute)) commit(records);
		});
		observer.observe(target, {
			attributes: true,
			attributeFilter: attribute ? [attribute] : void 0
		});
		return () => observer.disconnect();
	};
};
var makeLinker = (options) => {
	const source = typeof options.source == "function" ? options.source() : options.source;
	const defaultForProp = options.forProp ?? "value";
	const linker = {
		source,
		ref: options.ref,
		forProp: defaultForProp,
		get(event, forProp = defaultForProp) {
			return options.getter?.({
				source,
				ref: linker.ref,
				linker,
				forProp,
				event,
				reason: event ? "source" : "manual"
			});
		},
		set(value, event, forProp = defaultForProp) {
			return options.setter?.(value, {
				source,
				ref: linker.ref,
				linker,
				forProp,
				event,
				reason: "ref"
			});
		},
		store(value, event, forProp = defaultForProp) {
			const ctx = {
				source,
				ref: linker.ref,
				linker,
				forProp,
				event,
				reason: "source"
			};
			return options.store ? options.store(value, ctx) : setRefValue(linker.ref, value, forProp);
		},
		trigger(event, forProp = defaultForProp) {
			const value = linker.get(event, forProp);
			return linker.store(value, event, forProp);
		},
		bind() {
			linker.unbind();
			if (options.bindImmediately) linker.trigger();
			const triggerCleanup = cleanupOf(options.trigger?.({
				source,
				ref: linker.ref,
				linker,
				forProp: defaultForProp,
				reason: "initial",
				commit: (event, forProp = defaultForProp) => linker.trigger(event, forProp)
			}));
			const setterCleanup = linker.ref && options.setter ? affected([linker.ref, defaultForProp], (value) => {
				linker.set(value, void 0, defaultForProp);
			}, {
				affectTypes: options.affectTypes ?? ["setter", "manual"],
				triggerImmediately: options.triggerImmediately ?? true
			}) : null;
			linker.__cleanup = () => {
				triggerCleanup?.();
				setterCleanup?.();
			};
			return linker;
		},
		unbind() {
			linker.__cleanup?.();
			linker.__cleanup = null;
		},
		[Symbol.dispose]() {
			linker.unbind();
		},
		__cleanup: null
	};
	return linker;
};
var localStorageLink = (existsStorage, exists, key, initial) => {
	if (key == null) return;
	if (localStorageLinkMap.has(key)) {
		localStorageLinkMap.get(key)?.[0]?.();
		localStorageLinkMap.delete(key);
	}
	return localStorageLinkMap.getOrInsertComputed?.(key, () => {
		const def = (existsStorage ?? localStorage).getItem(key) ?? initial?.value ?? initial;
		const ref = isValueRef(exists) ? exists : stringRef(def);
		ref.value ??= def;
		const $val = new WeakRef(ref);
		const unsb = affected([ref, "value"], (val) => {
			$avoidTrigger($val?.deref?.(), () => {
				(existsStorage ?? localStorage).setItem(key, val);
			});
		});
		const list = (ev) => {
			if (ev.storageArea == (existsStorage ?? localStorage) && ev.key == key) {
				if (isNotEqual(ref.value, ev.newValue)) ref.value = ev.newValue;
			}
		};
		addEventListener("storage", list);
		return [() => {
			unsb?.();
			removeEventListener("storage", list);
		}, ref];
	});
};
var matchMediaLink = (existsMedia, exists, condition) => {
	if (condition == null) return;
	const med = existsMedia ?? matchMedia(condition), def = med?.matches || false;
	const ref = isValueRef(exists) ? exists : booleanRef(def);
	ref.value ??= def;
	const evf = (ev) => ref.value = ev.matches;
	med?.addEventListener?.("change", evf);
	return () => {
		med?.removeEventListener?.("change", evf);
	};
};
var visibleLink = (element, exists, initial) => {
	if (element == null) return;
	const def = initial?.value ?? (typeof initial != "object" ? initial : null) ?? element?.getAttribute?.("data-hidden") == null;
	const linker = makeLinker({
		source: element,
		ref: isValueRef(exists) ? exists : booleanRef(!!def),
		getter: ({ event }) => event?.type == "u2-hidden" ? false : true,
		setter: (value, { source }) => handleHidden(source, "data-hidden", value),
		trigger: eventTrigger(["u2-hidden", "u2-appear"], { passive: true })
	}).bind();
	return () => linker.unbind();
};
var attrLink = (element, exists, attribute, initial) => {
	const def = element?.getAttribute?.(attribute) ?? (typeof initial == "boolean" ? initial ? "" : null : getValue(initial));
	if (!element) return;
	const val = isValueRef(exists) ? exists : stringRef(def);
	if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
	const linker = makeLinker({
		source: element,
		ref: val,
		getter: ({ source }) => source?.getAttribute?.(attribute),
		setter: (value, { source }) => handleAttribute(source, attribute, normalizePrimitive(value)),
		trigger: mutationTrigger(attribute)
	}).bind();
	return () => linker.unbind();
};
var sizeLink = (element, exists, axis, box) => {
	const def = box == "border-box" ? element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"] : element?.[axis == "inline" ? "clientWidth" : "clientHeight"] - getPadding(element, axis);
	const val = isValueRef(exists) ? exists : numberRef(def);
	if (isObject(val)) val.value ||= (def ?? val.value) || 1;
	const obs = new ResizeObserver((entries) => {
		if (isObject(val)) {
			if (box == "border-box") val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize;
			if (box == "content-box") val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize;
			if (box == "device-pixel-content-box") val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize;
		}
	});
	if ((element?.element ?? element?.self ?? element) instanceof HTMLElement) obs?.observe?.(element?.element ?? element?.self ?? element, { box });
	return () => obs?.disconnect?.();
};
var scrollLink = (element, exists, axis, initial) => {
	if (initial != null && typeof (initial?.value ?? initial) == "number") element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: initial?.value ?? initial });
	const def = element?.[axis == "block" ? "scrollTop" : "scrollLeft"];
	const val = isValueRef(exists) ? exists : numberRef(def || 0);
	if (isObject(val)) val.value ||= (def ?? val.value) || 1;
	val.value ||= (def ?? val.value) || 0;
	const prop = axis == "block" ? "scrollTop" : "scrollLeft";
	const scrollProp = axis == "block" ? "top" : "left";
	const linker = makeLinker({
		source: element,
		ref: val,
		getter: ({ source }) => source?.[prop] || 0,
		setter: (value, { source }) => {
			if (Math.abs((source?.[prop] || 0) - Number(value || 0)) > .001) source?.scrollTo?.({ [scrollProp]: Number(value || 0) });
		},
		trigger: eventTrigger("scroll", { passive: true })
	}).bind();
	return () => linker.unbind();
};
var checkedLink = (element, exists) => {
	const def = !!element?.checked || false;
	const val = isValueRef(exists) ? exists : booleanRef(def);
	if (isObject(val) && val.value !== def) val.value = def;
	const linker = makeLinker({
		source: (element?.type == "radio" ? element?.closest?.("input[type='radio']") : element) ?? element,
		ref: val,
		getter: ({ source, event }) => selectSourceInput(source, event, `input[type="checkbox"], input:checked`)?.checked ?? element?.checked ?? val?.value,
		setter: (value) => {
			if (element && element?.checked != value) setChecked(element, value);
		},
		trigger: eventTrigger([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => linker.unbind();
};
var valueLink = (element, exists) => {
	if (isPrimitive(element)) return;
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	const def = element?.value ?? "";
	const val = isValueRef(exists) ? exists : stringRef(def);
	if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
	const linker = makeLinker({
		source: element,
		ref: val,
		getter: ({ source, event }) => selectSourceInput(source, event)?.value ?? source?.value ?? val?.value ?? "",
		setter: (value, { source }) => {
			const next = $getValue(value);
			if (source && isNotEqual(source?.value, next)) {
				source.value = next ?? "";
				source?.dispatchEvent?.(new Event("change", { bubbles: true }));
			}
		},
		trigger: eventTrigger([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => linker.unbind();
};
var valueAsNumberLink = (element, exists) => {
	if (isPrimitive(element)) return;
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	const def = Number(element?.valueAsNumber) || 0;
	const val = isValueRef(exists) ? exists : numberRef(def);
	if (isObject(val) && !val.value && def) val.value = def;
	const linker = makeLinker({
		source: element,
		ref: val,
		getter: ({ source, event }) => Number(selectSourceInput(source, event)?.valueAsNumber || source?.valueAsNumber || 0) || 0,
		setter: (value, { source }) => {
			if (source && (source.type == "range" || source.type == "number") && typeof source?.valueAsNumber == "number" && isNotEqual(source?.valueAsNumber, value)) {
				source.valueAsNumber = Number(value);
				source?.dispatchEvent?.(new Event("change", { bubbles: true }));
			}
		},
		trigger: eventTrigger([
			"click",
			"input",
			"change"
		])
	}).bind();
	return () => linker.unbind();
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/core/Refs.ts
var makeRef = (host, type, link, ...args) => {
	if (link == attrLink || link == handleAttribute) {
		const exists = elMap$1?.get?.(host)?.get?.(handleAttribute)?.get?.(args[0])?.[0];
		if (exists) return exists;
	}
	const rf = (type ?? ref)?.(null), result = link?.(host, rf, ...args);
	const linker = result && typeof result == "object" && typeof result?.unbind == "function" ? result : null;
	const targetRef = linker?.ref ?? rf;
	const usub = linker ? () => linker.unbind() : result;
	if (usub && targetRef) addToCallChain(targetRef, Symbol.dispose, usub);
	return targetRef;
};
var attrRef = (host, ...args) => makeRef(host, stringRef, attrLink, ...args);
var valueRef = (host, ...args) => makeRef(host, stringRef, valueLink, ...args);
var valueAsNumberRef = (host, ...args) => makeRef(host, numberRef, valueAsNumberLink, ...args);
var localStorageRef = (...args) => {
	if (localStorageLinkMap.has(args[0])) return localStorageLinkMap.get(args[0])?.[1];
	const link = localStorageLink;
	const rf = (stringRef ?? ref)?.(null);
	const [usub, _] = link?.(null, rf, ...args);
	if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
	return rf;
};
var sizeRef = (host, ...args) => makeRef(host, numberRef, sizeLink, ...args);
var checkedRef = (host, ...args) => makeRef(host, booleanRef, checkedLink, ...args);
var scrollRef = (host, ...args) => makeRef(host, numberRef, scrollLink, ...args);
var visibleRef = (host, ...args) => makeRef(host, booleanRef, visibleLink, ...args);
var matchMediaRef = (...args) => makeRef(null, booleanRef, matchMediaLink, ...args);
//#endregion
//#region ../../modules/projects/lur.e/src/utils/math/Operations.ts
var flattenRefs = (input) => {
	const refs = [];
	const traverse = (item) => {
		if (item && typeof item === "object" && "value" in item) refs.push(item);
		else if (Array.isArray(item)) item.forEach(traverse);
		else if (item && typeof item === "object") Object.values(item).forEach(traverse);
	};
	traverse(input);
	return refs;
};
var operated = (args, fn) => {
	const getCurrentValues = () => args.map((arg) => {
		if (arg && typeof arg === "object" && "value" in arg) return arg.value;
		return arg;
	});
	const initialResult = fn(...getCurrentValues());
	if (typeof initialResult === "number") {
		const result = numberRef(initialResult);
		const updateResult = () => {
			result.value = fn(...getCurrentValues());
		};
		flattenRefs(args).forEach((ref) => affected(ref, updateResult));
		return result;
	}
	let currentResult = initialResult;
	const updateResult = () => {
		currentResult = fn(...getCurrentValues());
	};
	flattenRefs(args).forEach((ref) => affected(ref, updateResult));
	return currentResult;
};
//#endregion
//#region ../../modules/projects/lur.e/src/design/anchor/CSSAdapter.ts
var CSSCalc = class {
	static add(a, b, unit = "px") {
		return operated([a, b], () => `calc(${a.value}${unit} + ${b.value}${unit})`);
	}
	static subtract(a, b, unit = "px") {
		return operated([a, b], () => `calc(${a.value}${unit} - ${b.value}${unit})`);
	}
	static multiply(a, b) {
		return operated([a, b], () => `calc(${a.value} * ${b.value})`);
	}
	static divide(a, b) {
		return operated([a, b], () => `calc(${a.value} / ${b.value})`);
	}
	static clamp(value, min, max, unit = "px") {
		return operated([
			value,
			min,
			max
		], () => `clamp(${min.value}${unit}, ${value.value}${unit}, ${max.value}${unit})`);
	}
	static min(a, b, unit = "px") {
		return operated([a, b], () => `min(${a.value}${unit}, ${b.value}${unit})`);
	}
	static max(a, b, unit = "px") {
		return operated([a, b], () => `max(${a.value}${unit}, ${b.value}${unit})`);
	}
};
//#endregion
//#region ../../modules/projects/lur.e/src/design/anchor/Utils.ts
var ReactiveViewport = class {
	static width = numberRef(typeof window != "undefined" ? window?.innerWidth : 0);
	static height = numberRef(typeof window != "undefined" ? window?.innerHeight : 0);
	static init() {
		const updateSize = () => {
			this.width.value = window?.innerWidth;
			this.height.value = window?.innerHeight;
		};
		if (typeof window != "undefined") window?.addEventListener?.("resize", updateSize);
	}
	static center() {
		return {
			x: CSSCalc.divide(this.width, numberRef(2)),
			y: CSSCalc.divide(this.height, numberRef(2))
		};
	}
};
ReactiveViewport.init();
//#endregion
//#region ../../modules/projects/lur.e/src/lure/core/Binding.ts
var elMap$1 = new DoubleWeakMap();
var alives = new FinalizationRegistry((unsub) => unsub?.());
var $mapped = Symbol.for("@mapped");
var $virtual = Symbol.for("@virtual");
var $behavior = Symbol.for("@behavior");
var isLinkerLike = (value) => {
	return !!value && typeof value == "object" && "ref" in value && typeof value?.unbind == "function";
};
var bindCtrl = (element, ctrlCb) => {
	if (isLinkerLike(ctrlCb)) {
		ctrlCb.bind?.();
		const unsub = () => ctrlCb.unbind?.();
		addToCallChain(element, Symbol.dispose, unsub);
		return unsub;
	}
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	const unsub = handleListeners?.(element, "addEventListener", hdl);
	addToCallChain(element, Symbol.dispose, unsub);
	return unsub;
};
var reflectControllers = (element, ctrls) => {
	if (ctrls) for (let ctrl of ctrls) bindCtrl(element, ctrl);
	return element;
};
var $observeInput = (element, ref, prop = "value") => {
	const wel = toRef$1(element);
	const rf = toRef$1(ref);
	const ctrlCb = (_ev) => {
		$set$1(rf, "value", deref(wel)?.[prop ?? "value"] ?? $getValue(deref(rf)));
	};
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	handleListeners?.(element, "addEventListener", hdl);
	$set$1(rf, "value", element?.[prop ?? "value"] ?? $getValue(deref(ref)));
	return () => handleListeners?.(element, "removeEventListener", hdl);
};
var $observeAttribute = (el, ref, prop = "") => {
	toRef$1(el);
	const wv = toRef$1(ref);
	const attrName = camelToKebab$1(prop);
	const cb = (mutation) => {
		if (mutation.type == "attributes" && mutation.attributeName == attrName) {
			const value = mutation?.target?.getAttribute?.(mutation.attributeName);
			const valRef = deref(wv), reVal = $getValue(valRef);
			if (isNotEqual(mutation.oldValue, value) && valRef != null && (typeof valRef == "object" || typeof valRef == "function")) {
				if (isNotEqual(reVal, value) || reVal == null) $set$1(valRef, "value", value);
			}
		}
	};
	return observeAttribute(el, attrName, cb);
};
var removeFromBank = (el, handler, prop) => {
	const bank = elMap$1.get([el, handler]);
	if (bank) {
		const old = bank[prop]?.[1];
		delete bank[prop];
		old?.();
	}
};
var addToBank = (el, handler, prop, forLink) => {
	const bank = elMap$1.getOrInsertComputed([el, handler], () => ({}));
	bank?.[prop]?.[1]?.();
	bank[prop] = forLink;
	return true;
};
var bindHandler = (element, value, prop, handler, set, withObserver) => {
	const linker = isLinkerLike(value) ? value : null;
	if (linker) {
		linker.bind?.();
		value = linker.ref;
	}
	const wel = toRef$1(element);
	element = deref(wel);
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	let controller = void 0;
	if (controller) controller?.abort?.();
	controller = new AbortController();
	const wv = toRef$1(value);
	handler?.(element, prop, value);
	const un = affected?.([value, "value"], (curr, _p, old) => {
		const valueRef = deref(wv);
		const setRef = deref(set);
		const elementRef = deref(wel);
		const v = $getValue(valueRef) ?? $getValue(curr);
		if (!setRef || setRef?.[prop] == valueRef) if (typeof valueRef?.[$behavior] == "function") valueRef?.[$behavior]?.((_val = curr) => handler(elementRef, prop, v), [
			curr,
			prop,
			old
		], [
			controller?.signal,
			prop,
			wel
		]);
		else handler(elementRef, prop, v);
	});
	let obs = null;
	if (typeof withObserver == "boolean" && withObserver) {
		if (handler == handleAttribute) obs = $observeAttribute(element, value, prop);
		if (handler == handleProperty) obs = $observeInput(element, value, prop);
	}
	if (typeof withObserver == "function") obs = withObserver(element, prop, value);
	const unsub = () => {
		obs?.disconnect?.();
		obs != null && typeof obs == "function" && obs?.();
		linker?.unbind?.();
		un?.();
		controller?.abort?.();
		removeFromBank?.(element, handler, prop);
	};
	addToCallChain(value, Symbol.dispose, unsub);
	alives.register(element, unsub);
	if (!addToBank(element, handler, prop, [value, unsub])) return unsub;
};
var bindWith = (el, prop, value, handler, set, withObserver) => {
	handler(el, prop, isLinkerLike(value) ? value.ref : value);
	return bindHandler(el, value, prop, handler, set, withObserver);
};
/** WHY: DOM stores `--client-*` via stringification; bare numbers become `"450"` (invalid `<length>`), so `.ux-anchor` inset resolves to (0,0). */
var asPointerInsetLength = (v) => {
	if (typeof v === "number" && Number.isFinite(v)) return `${v}px`;
	return v;
};
var withInsetWithPointer = (exists, pRef) => {
	if (!exists) return () => {};
	const ubs = [bindWith(exists, "--client-x", asPointerInsetLength(pRef?.[0]), handleStyleChange), bindWith(exists, "--client-y", asPointerInsetLength(pRef?.[1]), handleStyleChange)];
	if (pRef?.[2] != null) ubs.push(bindWith(exists, "--anchor-width", asPointerInsetLength(pRef?.[2]), handleStyleChange));
	if (pRef?.[3] != null) ubs.push(bindWith(exists, "--anchor-height", asPointerInsetLength(pRef?.[3]), handleStyleChange));
	return () => ubs?.forEach?.((ub) => ub?.());
};
var bindWhileConnected = (element, bind) => {
	if (!element) return () => {};
	let cleanup = null;
	let disposed = false;
	const ensureBound = () => {
		if (disposed) return;
		if (!element.isConnected) {
			if (cleanup) {
				cleanup();
				cleanup = null;
			}
			return;
		}
		if (!cleanup) {
			const c = bind();
			cleanup = typeof c === "function" ? c : null;
		}
	};
	const root = typeof document !== "undefined" ? document.documentElement : null;
	const elAny = element?.element ?? element;
	const el = elAny instanceof Node ? elAny : null;
	if (!el) return () => {};
	const mo = typeof MutationObserver !== "undefined" && root ? new MutationObserver((records) => {
		for (const r of records) {
			const target = r.target;
			if (target === el || target instanceof Node && target.contains(el)) {
				ensureBound();
				return;
			}
			const nodes = [...Array.from(r?.addedNodes || []), ...Array.from(r?.removedNodes || [])];
			for (const n of nodes) if (n === el || n instanceof Node && n.contains(el)) {
				ensureBound();
				return;
			}
		}
	}) : null;
	if (mo && root) mo.observe(root, {
		childList: true,
		subtree: true
	});
	queueMicrotask(() => ensureBound());
	return () => {
		disposed = true;
		mo?.disconnect?.();
		cleanup?.();
		cleanup = null;
	};
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Styles.ts
/** True when there is no non-empty declaration value (handles `prop: ` / `prop:` after empty `${...}` in html templates). */
var isEffectivelyEmptyStyleText = (cssText) => {
	const s = typeof cssText == "string" ? cssText.trim() : "";
	if (!s) return true;
	for (const chunk of s.split(";")) {
		const t = chunk.trim();
		if (!t) continue;
		const ci = t.indexOf(":");
		if (ci < 0) return false;
		if (t.slice(ci + 1).trim().length > 0) return false;
	}
	return true;
};
/** Drop a useless `style` attribute left over from empty template interpolations. */
var pruneEmptyStyleAttribute = (element) => {
	if (element == null) return;
	const raw = element.getAttribute("style");
	if (raw == null) return;
	if (isEffectivelyEmptyStyleText(raw)) {
		element.removeAttribute("style");
		element.style.cssText = "";
	}
};
/** Set inline styles or remove the attribute when the effective CSS text is empty. */
var applyNormalizedInlineStyle = (element, cssText) => {
	if (isEffectivelyEmptyStyleText(cssText)) {
		element.style.cssText = "";
		element.removeAttribute("style");
	} else element.style.cssText = cssText;
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Queried.ts
var existsQueries = /* @__PURE__ */ new WeakMap();
var alreadyUsed = /* @__PURE__ */ new WeakMap();
var queryExtensions = {
	logAll(ctx) {
		return () => console.log("attributes:", [...ctx?.attributes].map((x) => ({
			name: x.name,
			value: x.value
		})));
	},
	append(ctx) {
		return (...args) => ctx?.append?.(...[...args || []]?.map?.((e) => e?.element ?? e) || args);
	},
	current(ctx) {
		return ctx;
	}
};
var UniversalElementHandler = class {
	direction = "children";
	selector;
	index = 0;
	_eventMap = /* @__PURE__ */ new WeakMap();
	constructor(selector, index = 0, direction = "children") {
		this.index = index;
		this.selector = selector;
		this.direction = direction;
	}
	_observeDOMChange(target, selector, cb) {
		return typeof selector == "string" ? observeBySelector(target, selector, cb) : null;
	}
	_observeAttributes(target, attribute, cb) {
		return typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb);
	}
	_getArray(target) {
		if (typeof target == "function") target = this.selector || target?.(this.selector);
		if (!this.selector) return [target];
		if (typeof this.selector == "string") {
			const inclusion = typeof target?.matches == "function" && target?.element != null && target?.matches?.(this.selector) ? [target] : [];
			if (this.direction == "children") {
				const list = typeof target?.querySelectorAll == "function" && target?.element != null ? [...target?.querySelectorAll?.(this.selector)] : [];
				return list?.length >= 1 ? [...list] : inclusion;
			} else if (this.direction == "parent") {
				const closest = target?.closest?.(this.selector);
				return closest ? [closest] : inclusion;
			}
			return inclusion;
		}
		return Array.isArray(this.selector) ? this.selector : [this.selector];
	}
	_getSelected(target) {
		const tg = target?.self ?? target;
		const sel = this._selector(target);
		if (typeof sel == "string") {
			if (this.direction == "children") return tg?.matches?.(sel) ? tg : tg?.querySelector?.(sel);
			if (this.direction == "parent") return tg?.matches?.(sel) ? tg : tg?.closest?.(sel);
		}
		return tg == (sel?.element ?? sel) ? sel?.element ?? sel : null;
	}
	_redirectToBubble(eventName) {
		if (typeof this._selector() == "string") return {
			["pointerenter"]: "pointerover",
			["pointerleave"]: "pointerout",
			["mouseenter"]: "mouseover",
			["mouseleave"]: "mouseout",
			["focus"]: "focusin",
			["blur"]: "focusout"
		}?.[eventName] || eventName;
		return eventName;
	}
	_addEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.addEventListener?.(name, cb, option);
			return cb;
		}
		const eventName = this._redirectToBubble(name);
		const parent = target?.self ?? target;
		const wrap = (ev) => {
			const sel = this._selector(target);
			const rot = ev?.currentTarget ?? parent;
			let tg = null;
			if (ev?.composedPath && typeof ev.composedPath === "function") {
				const path = ev.composedPath();
				for (const node of path) if (node instanceof HTMLElement || node instanceof Element) {
					const nodeEl = node?.element ?? node;
					if (typeof sel == "string") {
						if (MOCElement(nodeEl, sel, ev)) {
							tg = nodeEl;
							break;
						}
					} else if (containsOrSelf(sel, nodeEl, ev)) {
						tg = nodeEl;
						break;
					}
				}
			}
			if (!tg) {
				tg = ev?.target ?? this._getSelected(target) ?? rot;
				tg = tg?.element ?? tg;
			}
			if (typeof sel == "string") {
				if (containsOrSelf(rot, MOCElement(tg, sel, ev), ev)) cb?.call?.(tg, ev);
			} else if (containsOrSelf(rot, sel, ev) && containsOrSelf(sel, tg, ev)) cb?.call?.(tg, ev);
		};
		parent?.addEventListener?.(eventName, wrap, option);
		this._eventMap.getOrInsert(parent, /* @__PURE__ */ new Map()).getOrInsert(eventName, /* @__PURE__ */ new WeakMap()).set(cb, {
			wrap,
			option
		});
		return wrap;
	}
	_removeEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.removeEventListener?.(name, cb, option);
			return cb;
		}
		const parent = target?.self ?? target;
		const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(parent);
		if (!eventMap) return;
		const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
		parent?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
		cbMap?.delete?.(cb);
		if (cbMap?.size == 0) eventMap?.delete?.(eventName);
		if (eventMap.size == 0) this._eventMap.delete(parent);
	}
	_selector(tg) {
		if (typeof this.selector == "string" && typeof tg?.selector == "string") return ((tg?.selector || "") + " " + this.selector)?.trim?.();
		return this.selector;
	}
	get(target, name, ctx) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (name in queryExtensions) return queryExtensions?.[name]?.(selected);
		if (name == "length" && array?.length != null) return array?.length;
		if (name == "_updateSelector") return (sel) => this.selector = sel || this.selector;
		if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
			const tg = target?.self ?? target;
			const selector = this._selector(target);
			const basis = typeof selector == "string" ? getAdoptedStyleRule(selector, "ux-query", tg) : selected;
			if (name == "attributeStyleMap") return basis?.styleMap ?? basis?.attributeStyleMap;
			return basis?.[name];
		}
		if (name == "self") return target?.self ?? target;
		if (name == "selector") return this._selector(target);
		if (name == "observeAttr") return (name, cb) => this._observeAttributes(target, name, cb);
		if (name == "DOMChange") return (cb) => this._observeDOMChange(target, this.selector, cb);
		if (name == "addEventListener") return (name, cb, opt) => this._addEventListener(target, name, cb, opt);
		if (name == "removeEventListener") return (name, cb, opt) => this._removeEventListener(target, name, cb, opt);
		if (name == "getAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[0];
			return selected?.getAttribute?.(key);
		};
		if (name == "setAttribute") return (key, value) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			if (typeof value == "object" && (value?.value != null || "value" in value)) return bindWith(selected, key, value, handleAttribute, null, true);
			return selected?.setAttribute?.(key, value);
		};
		if (name == "removeAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[1]?.();
			return selected?.removeAttribute?.(key);
		};
		if (name == "hasAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return true;
			return selected?.hasAttribute?.(key);
		};
		if (name == "element") {
			if (array?.length <= 1) return selected?.element ?? selected;
			const fragment = document.createDocumentFragment();
			fragment.append(...array);
			return fragment;
		}
		if (name == Symbol.toPrimitive) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (hint) => {
				if (hint == "number") return (selected?.element ?? selected)?.valueAsNumber ?? parseFloat((selected?.element ?? selected)?.value);
				if (hint == "string") return String((selected?.element ?? selected)?.value ?? selected?.element ?? selected);
				if (hint == "boolean") return (selected?.element ?? selected)?.checked;
				return (selected?.element ?? selected)?.checked ?? (selected?.element ?? selected)?.value ?? selected?.element ?? selected;
			};
		}
		if (name == "checked") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.checked;
		}
		if (name == "value") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.valueAsNumber ?? (selected?.element ?? selected)?.valueAsDate ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected)?.checked;
		}
		if (name == $affected) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (cb) => {
				let oldValue = selected?.value;
				const evt = [(ev) => {
					const input = this._getSelected(ev?.target);
					cb?.(input?.value, "value", oldValue);
					oldValue = input?.value;
				}, { passive: true }];
				this._addEventListener(target, "change", ...evt);
				return () => this._removeEventListener(target, "change", ...evt);
			};
		}
		if (name == "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
			const wk = new WeakRef(selected);
			return () => wk?.deref?.()?.element ?? wk?.deref?.();
		}
		if (typeof name == "string" && /^\d+$/.test(name)) return array[parseInt(name)];
		const origin = selected;
		if (origin?.[name] != null) return typeof origin[name] == "function" ? origin[name].bind(origin) : origin[name];
		if (array?.[name] != null) return typeof array[name] == "function" ? array[name].bind(array) : array[name];
		return typeof target?.[name] == "function" ? target?.[name].bind(origin) : target?.[name];
	}
	set(target, name, value) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (typeof name == "string" && /^\d+$/.test(name)) return false;
		if (array[name] != null) return false;
		if (selected) {
			selected[name] = value;
			return true;
		}
		return true;
	}
	has(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		return typeof name == "string" && /^\d+$/.test(name) && array[parseInt(name)] != null || array[name] != null || selected && name in selected;
	}
	deleteProperty(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected && name in selected) {
			delete selected[name];
			return true;
		}
		return false;
	}
	ownKeys(target) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		const keys = /* @__PURE__ */ new Set();
		array.forEach((el, i) => keys.add(i.toString()));
		Object.getOwnPropertyNames(array).forEach((k) => keys.add(k));
		if (selected) Object.getOwnPropertyNames(selected).forEach((k) => keys.add(k));
		return Array.from(keys);
	}
	defineProperty(target, name, desc) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected) {
			Object.defineProperty(selected, name, desc);
			return true;
		}
		return false;
	}
	apply(target, self, args) {
		args[0] ||= this.selector;
		this.selector = target?.apply?.(self, args) || this.selector;
		return new Proxy(target, this);
	}
};
var Q = (selector, host = document.documentElement, index = 0, direction = "children") => {
	if ((selector?.element ?? selector) instanceof HTMLElement) {
		const el = selector?.element ?? selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (typeof selector == "function") {
		const el = selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (host == null || typeof host == "string" || typeof host == "number" || typeof host == "boolean" || typeof host == "symbol" || typeof host == "undefined") return null;
	if (existsQueries?.get?.(host)?.has?.(selector)) return existsQueries?.get?.(host)?.get?.(selector);
	return existsQueries?.getOrInsert?.(host, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(selector, () => {
		return new Proxy(host, new UniversalElementHandler(selector, index, direction));
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/Reflect.ts
var $entries = (obj) => {
	if (isPrimitive(obj)) return [];
	if (Array.isArray(obj)) return obj.map((item, idx) => [idx, item]);
	if (obj instanceof Map) return Array.from(obj.entries());
	if (obj instanceof Set) return Array.from(obj.values());
	return Array.from(Object.entries(obj));
};
var reflectAttributes = (element, attributes) => {
	if (!attributes) return element;
	const weak = new WeakRef(attributes), wel = new WeakRef(element);
	if (typeof attributes == "object" || typeof attributes == "function") {
		$entries(attributes).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), prop, value);
		});
		const usub = affected(attributes, (value, prop) => {
			handleAttribute(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleAttribute, weak, true);
		});
		addToCallChain(attributes, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid attributes object:", attributes);
};
var reflectARIA = (element, aria) => {
	if (!aria) return element;
	const weak = new WeakRef(aria), wel = new WeakRef(element);
	if (typeof aria == "object" || typeof aria == "function") {
		$entries(aria).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value);
		});
		const usub = affected(aria, (value, prop) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value, true);
			bindHandler(wel, value, prop, handleAttribute, weak, true);
		});
		addToCallChain(aria, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid ARIA object:", aria);
	return element;
};
var reflectDataset = (element, dataset) => {
	if (!dataset) return element;
	const weak = new WeakRef(dataset), wel = new WeakRef(element);
	if (typeof dataset == "object" || typeof dataset == "function") {
		$entries(dataset).forEach(([prop, value]) => {
			handleDataset(wel?.deref?.(), prop, value);
		});
		const usub = affected(dataset, (value, prop) => {
			handleDataset(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
		});
		addToCallChain(dataset, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid dataset object:", dataset);
	return element;
};
var reflectStyles = (element, styles) => {
	if (!styles) return element;
	if (typeof styles == "string") applyNormalizedInlineStyle(element, styles);
	else if (typeof styles?.value == "string") affected([styles, "value"], (val) => {
		applyNormalizedInlineStyle(element, val ?? "");
	});
	else if (typeof styles == "object" || typeof styles == "function") {
		const weak = new WeakRef(styles), wel = new WeakRef(element);
		$entries(styles).forEach(([prop, value]) => {
			handleStyleChange(wel?.deref?.(), prop, value);
		});
		const usub = affected(styles, (value, prop) => {
			handleStyleChange(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleStyleChange, weak?.deref?.());
		});
		addToCallChain(styles, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid styles object:", styles);
	return element;
};
var reflectWithStyleRules = async (element, rule) => {
	return reflectStyles(element, await rule?.(element));
};
var reflectProperties = (element, properties) => {
	if (!properties) return element;
	const weak = new WeakRef(properties), wel = new WeakRef(element);
	const onChange = (ev) => {
		const input = Q("input", ev?.target);
		if (input?.value != null && isNotEqual(input?.value, properties?.value)) properties.value = input?.value;
		if (input?.valueAsNumber != null && isNotEqual(input?.valueAsNumber, properties?.valueAsNumber)) properties.valueAsNumber = input?.valueAsNumber;
		if (input?.checked != null && isNotEqual(input?.checked, properties?.checked)) properties.checked = input?.checked;
	};
	$entries(properties).forEach(([prop, value]) => {
		handleProperty(wel?.deref?.(), prop, value);
	});
	const usub = affected(properties, (value, prop) => {
		const el = wel.deref();
		if (el) if (prop == "checked") setChecked(el, value);
		else bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
	});
	addToCallChain(properties, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	element.addEventListener("change", onChange);
	return element;
};
var reflectClassList = (element, classList) => {
	if (!classList) return element;
	const wel = new WeakRef(element);
	$entries(classList).forEach(([prop, value]) => {
		const el = element;
		if (typeof value == "undefined" || value == null) {
			if (el.classList.contains(value)) el.classList.remove(value);
		} else if (!el.classList.contains(value)) el.classList.add(value);
	});
	const usub = iterated(classList, (value) => {
		const el = wel?.deref?.();
		if (el) {
			if (typeof value == "undefined" || value == null) {
				if (el.classList.contains(value)) el.classList.remove(value);
			} else if (!el.classList.contains(value)) el.classList.add(value);
		}
	});
	addToCallChain(classList, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	return element;
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/ReflectChildren.ts
var makeUpdater = (defaultParent = null, mapper, isArray = true) => {
	const commandBuffer = [];
	const merge = () => {
		commandBuffer?.forEach?.(([fn, args]) => fn?.(...args));
		commandBuffer?.splice?.(0, commandBuffer?.length);
	};
	const updateChildList = (newEl, idx, oldEl, op, boundParent = null) => {
		const $requestor = isValidParent$1(boundParent) ?? isValidParent$1(defaultParent);
		const newNode = getNode(newEl, mapper, idx, $requestor);
		const oldNode = getNode(oldEl, mapper, idx, $requestor);
		let element = isValidParent$1(newNode?.parentElement ?? oldNode?.parentElement) ?? $requestor;
		if (!element) return;
		if (defaultParent != element) defaultParent = element;
		const oldIdx = indexOf(element, oldNode);
		if ([
			"add",
			"set",
			"delete"
		].indexOf(op || "") >= 0 || !op) {
			if (newNode == null && oldNode != null || op == "delete") commandBuffer?.push?.([removeChild, [
				element,
				oldNode,
				null,
				oldIdx >= 0 ? oldIdx : idx
			]]);
			else if (newNode != null && oldNode == null || op == "add") commandBuffer?.push?.([appendChild, [
				element,
				newNode,
				null,
				idx
			]]);
			else if (newNode != null && oldNode != null || op == "set") commandBuffer?.push?.([replaceChildren, [
				element,
				newNode,
				null,
				oldIdx >= 0 ? oldIdx : idx,
				oldNode
			]]);
		}
		if (op && op != "get" && [
			"add",
			"set",
			"delete"
		].indexOf(op) >= 0 || !op && !isArray) merge?.();
	};
	return updateChildList;
};
var asArray$2 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var reformChildren = (element, children = [], mapper) => {
	if (!children || !element) return element;
	mapper = (children?.[$mapped] ? children?.mapper : mapper) ?? mapper;
	children = (children?.[$mapped] ? children?.children : children) ?? children;
	const keys = Array.from(children?.keys?.() || []);
	const cvt = asArray$2(children)?.map?.((nd, index) => getNode(nd, mapper, keys?.[index] ?? index, element));
	removeNotExists(element, cvt);
	cvt?.forEach?.((nd) => appendChild(element, nd));
	return element;
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Changeable.ts
var Ch = class {
	#stub = document.createComment("");
	#valueRef;
	#fragments;
	#updater = null;
	#internal = null;
	#updating = false;
	#options = {};
	#oldNode;
	#mapCb = null;
	#T = null;
	#boundParent = null;
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, null, false);
			this.#internal ??= affected?.([this.#valueRef, "value"], this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (value instanceof HTMLElement && isValidParent$1(value) && value != this.#boundParent) {
			this.#boundParent = value;
			this.makeUpdater(value);
			if (this.#oldNode) {
				this.#oldNode?.parentNode != null && this.#oldNode?.remove?.();
				this.#oldNode = null;
			}
			this.element;
		}
	}
	constructor(valueRef, mapCb = (el) => el, options = null) {
		this.#stub = document.createComment("");
		if (hasValue(mapCb) && (typeof valueRef == "function" || typeof valueRef == "object") && !hasValue(valueRef)) [valueRef, mapCb] = [mapCb, valueRef];
		if (!options && mapCb != null && typeof mapCb == "object" && !hasValue(mapCb)) options = mapCb;
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#oldNode = null;
		this.#valueRef = (!hasValue(valueRef) ? mapCb?.(valueRef, -1) : valueRef) ?? valueRef;
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
	}
	$getNodeBy(requestor, value) {
		const node = isPrimitive(hasValue(value) ? value?.value : value) ? this.#T ??= T(value) : getNode(value, value == requestor ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(value) || hasValue(value))) this.#T.textContent = "" + (value?.value ?? (isPrimitive(value) ? value : ""));
		return node;
	}
	$getNode(requestor, reassignOldNode = true) {
		const node = isPrimitive(this.#valueRef?.value) ? this.#T ??= T(this.#valueRef) : getNode(this.#valueRef?.value, requestor == this.#valueRef?.value ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(this.#valueRef) || hasValue(this.#valueRef))) this.#T.textContent = "" + (isPrimitive(this.#valueRef) ? this.#valueRef : this.#valueRef?.value ?? "");
		if (node != null && reassignOldNode) this.#oldNode = node;
		return node;
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		Promise.try(() => {
			const element = this.$getNode(requestor);
			if (!element || !requestor || element?.contains?.(requestor) || requestor == element) return;
			if (requestor instanceof HTMLElement && isValidParent$1(requestor)) if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				observer.observe(requestor, { childList: true });
			}
		})?.catch?.(console.warn.bind(console));
		return this.element;
	}
	get self() {
		const existsNode = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? existsNode;
	}
	get element() {
		const children = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	_onUpdate(newVal, idx, oldVal, op) {
		if (isPrimitive(oldVal) && isPrimitive(newVal)) return;
		let oldEl = isPrimitive(oldVal) ? this.#oldNode : this.$getNodeBy(this.boundParent, oldVal);
		let newEl = this.$getNode(this.boundParent, false) ?? this.#stub;
		if (oldEl && !oldEl?.parentNode || this.#oldNode?.parentNode) oldEl = this.#oldNode ?? oldEl;
		let updated = this.#updater?.(newEl, indexOf(this.boundParent, oldEl), oldEl, op, this.boundParent);
		if (newEl != null && newEl != this.#oldNode) this.#oldNode = newEl;
		else if (newEl == null && oldEl != this.#oldNode) this.#oldNode = oldEl;
		return updated;
	}
};
var isWeakCompatible$1 = (key) => {
	return (typeof key == "object" || typeof key == "function" || typeof key == "symbol") && key != null;
};
var C = (observable, mapCb, boundParent = null) => {
	let Te = null;
	if (observable instanceof HTMLElement) return Q(observable);
	if (observable == null) return document.createComment(":NULL:");
	const checkable = (typeof mapCb == "function" ? mapCb(observable, -1) : observable) ?? observable;
	if (isPrimitive(checkable)) return Te ??= T(checkable);
	if (Te != null && isPrimitive(checkable)) Te.textContent = "" + checkable;
	if (checkable != null && hasValue(checkable)) {
		if (isPrimitive(checkable?.value)) return checkable?.value != null ? Te ??= T(checkable?.value) : document.createComment(":NULL:");
		else if (typeof checkable == "object" || typeof checkable == "function") return elMap.getOrInsertComputed(isWeakCompatible$1(observable) ? observable : checkable, () => {
			return new Ch(observable, mapCb, boundParent);
		});
	}
	return getNode(checkable, null, -1, boundParent);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/Utils.ts
var KIDNAP_WITHOUT_HANG = (el, requestor) => {
	return (requestor && requestor != el && !el?.contains?.(requestor) && isValidParent$1(requestor) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
};
var isElementValue = (el, requestor) => {
	return KIDNAP_WITHOUT_HANG(el, requestor) ?? (hasValue(el) && isElement(el?.value) ? el?.value : el);
};
var elMap = /* @__PURE__ */ new WeakMap();
var tmMap = /* @__PURE__ */ new WeakMap();
var getMapped = (obj) => {
	if (isPrimitive(obj)) return obj;
	if (hasValue(obj) && isPrimitive(obj?.value)) return tmMap?.get(obj);
	return elMap?.get?.(obj);
};
var $promiseResolvedMap = /* @__PURE__ */ new WeakMap();
var $makePromisePlaceholder = (promised, getNodeCb) => {
	if ($promiseResolvedMap?.has?.(promised)) return $promiseResolvedMap?.get?.(promised);
	const comment = document.createComment(":PROMISE:");
	promised?.then?.((elem) => {
		const element = typeof getNodeCb == "function" ? getNodeCb(elem) : elem;
		$promiseResolvedMap?.set?.(promised, element);
		queueMicrotask(() => {
			try {
				if (typeof comment?.replaceWith == "function") {
					if (!comment?.isConnected) return;
					if (isElement(element)) comment?.replaceWith?.(element);
				} else if (comment?.isConnected && isElement(element)) comment?.parentNode?.replaceChild?.(comment, element);
			} catch (error) {
				if (!comment?.isConnected) return;
				comment?.remove?.();
			}
		});
	});
	return comment;
};
var $getBase = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = $getBase(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => $getBase(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return el;
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el);
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return $getBase(el?.(), mapper, index, requestor);
	if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var $getLeaf = (el, requestor) => {
	return isElementValue(el, requestor) ?? isElement(el);
};
var $getNode = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = getNode(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => getNode(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return isElementValue(el, requestor);
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el)?.element;
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return getNode(el?.(), mapper, index, requestor);
	else if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var isWeakCompatible = (el) => {
	return (typeof el == "object" || typeof el == "function" || typeof el == "symbol") && el != null;
};
var __nodeGuard = /* @__PURE__ */ new WeakSet();
var __getNode = (el, mapper, index = -1, requestor) => {
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => __getNode(nd, mapper, index, requestor));
	if (isWeakCompatible(el) && !isElement(el)) {
		if (elMap.has(el)) {
			const obj = getMapped(el) ?? $getBase(el, mapper, index, requestor);
			return $getLeaf(obj instanceof WeakRef ? obj?.deref?.() : obj, requestor);
		}
		const $node = $getBase(el, mapper, index, requestor);
		if (!mapper && $node != null && $node != el && isWeakCompatible(el) && !isElement(el)) elMap.set(el, $node);
		return $getLeaf($node, requestor);
	}
	return $getNode(el, mapper, index, requestor);
};
var getNode = (el, mapper, index = -1, requestor) => {
	if (isWeakCompatible(el) && __nodeGuard.has(el)) return getMapped(el) ?? isElement(el);
	if (isWeakCompatible(el)) __nodeGuard.add(el);
	const result = __getNode(el, mapper, index, requestor);
	if (isWeakCompatible(el)) __nodeGuard.delete(el);
	return result;
};
var appendOrEmplaceByIndex = (parent, child, index = -1) => {
	if (isElement(child) && child != null && child?.parentNode != parent) if (Number.isInteger(index) && index >= 0 && index < parent?.childNodes?.length) parent?.insertBefore?.(child, parent?.childNodes?.[index]);
	else parent?.append?.(child);
};
var appendFix = (parent, child, index = -1) => {
	if (!isElement(child) || parent == child || child?.parentNode == parent) return;
	child = child?._onUpdate ? KIDNAP_WITHOUT_HANG(child, parent) : child;
	if (!child?.parentNode && isElement(child)) {
		appendOrEmplaceByIndex(parent, child, index);
		return;
	}
	if (parent?.parentNode == child?.parentNode) return;
	if (isElement(child)) appendOrEmplaceByIndex(parent, child, index);
};
var asArray$1 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var appendArray = (parent, children, mapper, index = -1) => {
	const len = children?.length ?? 0;
	if (Array.isArray(unwrap(children)) || children instanceof Map || children instanceof Set) {
		const list = asArray$1(children)?.map?.((cl, I) => getNode(cl, mapper, I, parent))?.filter?.((el) => el != null);
		const frag = document.createDocumentFragment();
		list?.forEach?.((cl) => appendFix(frag, cl));
		appendFix(parent, frag, index);
	} else {
		const node = getNode(children, mapper, len, parent);
		if (node != null) appendFix(parent, node, index);
	}
};
var appendChild = (element, cp, mapper, index = -1) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) appendArray(element, cp?.children, null, index);
	else appendArray(element, cp, null, index);
};
var dePhantomNode = (parent, node, index = -1) => {
	if (!parent) return node;
	if (node?.parentNode == parent && node?.parentNode != null) return node;
	else if (node?.parentNode != parent && !isValidParent$1(node?.parentNode)) {
		if (Number.isInteger(index) && index >= 0 && Array.from(parent?.childNodes || [])?.length > index) return parent.childNodes?.[index];
	}
	return node;
};
var replaceOrSwap = (parent, oldEl, newEl) => {
	if (oldEl?.parentNode) if (oldEl?.parentNode == newEl?.parentNode) {
		parent = oldEl?.parentNode ?? parent;
		if (oldEl.nextSibling === newEl) parent.insertBefore(newEl, oldEl);
		else if (newEl.nextSibling === oldEl) parent.insertBefore(oldEl, newEl);
		else {
			const nextSiblingOfElement1 = oldEl.nextSibling;
			parent.replaceChild(newEl, oldEl);
			parent.insertBefore(oldEl, nextSiblingOfElement1);
		}
	} else oldEl?.replaceWith?.(newEl);
};
var replaceChildren = (element, cp, mapper, index = -1, old) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (!element) element = old?.parentNode;
	const cn = dePhantomNode(element, getNode(old, mapper, index), index);
	if (cn instanceof Text && typeof cp == "string") cn.textContent = cp;
	else if (cp != null) {
		const node = getNode(cp);
		if (cn?.parentNode == element && cn != node && cn instanceof Text && node instanceof Text) {
			if (cn?.textContent != node?.textContent) cn.textContent = node?.textContent?.trim?.() ?? "";
		} else if (cn?.parentNode == element && cn != node && cn != null && cn?.parentNode != null) replaceOrSwap(element, cn, node);
		else if (cn?.parentNode != element || cn?.parentNode == null) appendChild(element, node, null, index);
	}
};
var removeChild = (element, cp, mapper, index = -1) => {
	const $node = getNode(cp, mapper);
	if (!element) element = $node?.parentNode;
	if (Array.from(element?.childNodes ?? [])?.length < 1) return;
	const whatToRemove = dePhantomNode(element, $node, index);
	if (whatToRemove?.parentNode == element) whatToRemove?.remove?.();
	return element;
};
var removeNotExists = (element, children, mapper) => {
	const list = Array.from(unwrap(children) || [])?.map?.((cp, index) => getNode(cp, mapper, index));
	Array.from(element.childNodes).forEach((nd) => {
		if (!list?.find?.((cp) => !isNotEqual?.(cp, nd))) nd?.remove?.();
	});
	return element;
};
var T = (ref) => {
	if (isPrimitive(ref) && ref != null) return document.createTextNode(ref);
	if (ref == null) return document.createComment(":NULL:");
	return tmMap.getOrInsertComputed(ref, () => {
		const element = document.createTextNode(((hasValue(ref) ? ref?.value : ref) ?? "")?.trim?.() ?? "");
		affected([ref, "value"], (val) => {
			element.textContent = ("" + (val?.innerText ?? val?.textContent ?? val?.value ?? val ?? ""))?.trim?.() ?? "";
		});
		return element;
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Mapped.ts
var asArray = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var Mp = class {
	#observable;
	#fragments;
	#mapCb;
	#reMap;
	#pmMap;
	#updater = null;
	#internal = null;
	#options = {};
	#stub = document.createComment("");
	#indexMap = /* @__PURE__ */ new Map();
	#boundParent = null;
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), Array.isArray(this.#observable));
			this.#internal ??= iterated?.(this.#observable, this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (value instanceof HTMLElement && isValidParent$1(value) && value != this.#boundParent) {
			this.#boundParent = value;
			this.makeUpdater(value);
			this.element;
		}
	}
	constructor(observable, mapCb = (el) => el, options = null) {
		if (isObservable(mapCb) && (typeof observable == "function" || typeof observable == "object") && !isObservable(observable)) [observable, mapCb] = [mapCb, observable];
		if (!options && mapCb != null && typeof mapCb == "object" && !isObservable(mapCb)) options = mapCb;
		this.#stub = document.createComment("");
		this.#reMap = /* @__PURE__ */ new WeakMap();
		this.#pmMap = /* @__PURE__ */ new Map();
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#observable = (isObservable(observable) ? observable : observable?.iterator ?? mapCb?.iterator ?? observable) ?? [];
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
		if (!this.boundParent) {
			if (this.#options.preMap) {
				reformChildren(this.#fragments, this.#observable, this.mapper.bind(this));
				if (this.#fragments.childNodes.length === 0) this.#fragments.appendChild(this.#stub);
			}
		}
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		Promise.try(() => {
			const element = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
			if (!element || !requestor || element?.contains?.(requestor) || requestor == element) return;
			if (requestor instanceof HTMLElement && isValidParent$1(requestor)) if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				observer.observe(requestor, { childList: true });
			}
		})?.catch?.(console.warn.bind(console));
		return this.element;
	}
	get children() {
		return asArray(this.#observable);
	}
	get self() {
		const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? reformChildren(this.#fragments, this.#observable, this.mapper.bind(this));
	}
	get element() {
		const children = this.#fragments?.childNodes?.length > 0 ? this.#fragments : getNode(this.#observable?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	get mapper() {
		return (...args) => {
			if (args?.[0] == null) return null;
			if (args?.[0] instanceof Node) return args?.[0];
			if (args?.[0] instanceof Promise || typeof (args?.[0])?.then == "function") return null;
			if ((args?.[1] == null || args?.[1] < 0 || typeof args?.[1] != "number" || !canBeInteger(args?.[1])) && (Array.isArray(this.#observable) || this.#observable instanceof Set)) return;
			if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null && this.#observable instanceof Set) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null && this.#observable instanceof Map) if (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol") return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
			else if (typeof args?.[1] == "object" || typeof args?.[1] == "function" || typeof args?.[1] == "symbol") return this.#reMap.getOrInsert(args?.[1], this.#mapCb(...args));
			else return this.#pmMap.getOrInsert(args?.[1], this.#mapCb(...args));
			if (args?.[0] != null) if (this.#options?.uniquePrimitives && isPrimitive(args?.[0])) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			else return this.#mapCb(...args);
		};
	}
	_onUpdate(newEl, idx, oldEl, op = "") {
		if (op == "add" || newEl != null && oldEl == null) {
			if (this.#indexMap.has(idx)) return;
			const withElement = C(ref(this.#observable, idx), (...args) => {
				if (args?.[1] == null || args?.[1] < 0) args[1] = idx ?? args?.[1];
				return this.mapper(...args);
			});
			this.#indexMap.set(idx, withElement);
			appendChild(this.boundParent, withElement, null, idx);
		}
		if (op == "delete" || newEl == null && oldEl != null) {
			const withElement = this.#indexMap.get(idx);
			if (withElement) removeChild(this.boundParent, withElement, null, idx);
			this.#indexMap.delete(idx);
		}
	}
	*[Symbol.iterator]() {
		let i = 0;
		if (this.#observable) for (let el of this.#observable) yield this.mapper(el, i++);
	}
};
var M = (observable, mapCb, boundParent = null) => {
	return new Mp(observable, mapCb, boundParent);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Bindings.ts
var Qp = (ref, host = document.documentElement) => {
	if (ref?.value == null) return Q(ref, host);
	const actual = Q(ref?.value, host);
	affected(ref, (value, prop) => actual?._updateSelector(value));
	return actual;
};
var $createElement = (selector) => {
	if (typeof selector == "string") {
		const nl = Qp(createElementVanilla(selector));
		return nl?.element ?? nl;
	} else if (selector instanceof HTMLElement || selector instanceof Element || selector instanceof DocumentFragment || selector instanceof Document || selector instanceof Node) return selector;
	else return null;
};
var E = (selector, params = {}, children) => {
	const element = getNode(typeof selector == "string" ? $createElement(selector) : selector, null, -1);
	if (element && children) M(children, (el) => el, element);
	if (element && params) {
		if (params.ctrls != null) reflectControllers(element, params.ctrls);
		if (params.attributes != null) reflectAttributes(element, params.attributes);
		if (params.properties != null) reflectProperties(element, params.properties);
		if (params.classList != null) reflectClassList(element, params.classList);
		if (params.behaviors != null) reflectBehaviors(element, params.behaviors);
		if (params.dataset != null) reflectDataset(element, params.dataset);
		if (params.stores != null) reflectStores(element, params.stores);
		if (params.mixins != null) reflectMixins(element, params.mixins);
		if (params.style != null) reflectStyles(element, params.style);
		if (params.aria != null) reflectARIA(element, params.aria);
		if ("value" in params) bindWith(element, "value", params.value, handleProperty, params, true);
		if ("placeholder" in params) bindWith(element, "placeholder", params.placeholder, handleProperty, params, true);
		if (params.is != null) bindWith(element, "is", params.is, handleAttribute, params, true);
		if (params.role != null) bindWith(element, "role", params.role, handleProperty, params);
		if (params.slot != null) bindWith(element, "slot", params.slot, handleProperty, params);
		if (params.part != null) bindWith(element, "part", params.part, handleAttribute, params, true);
		if (params.name != null) bindWith(element, "name", params.name, handleAttribute, params, true);
		if (params.type != null) bindWith(element, "type", params.type, handleAttribute, params, true);
		if (params.icon != null) bindWith(element, "icon", params.icon, handleAttribute, params, true);
		if (params.inert != null) bindWith(element, "inert", params.inert, handleAttribute, params, true);
		if (params.hidden != null) bindWith(element, "hidden", params.visible ?? params.hidden, handleHidden, params);
		if (params.on != null) addEventsList(element, params.on);
		if (params.rules != null) params.rules.forEach?.((rule) => reflectWithStyleRules(element, rule));
	}
	return Q(element);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Normalizer.ts
function getIndentColumns(line, tabWidth = 4) {
	let col = 0;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === " ") col += 1;
		else if (ch === "	") col += tabWidth - col % tabWidth;
		else break;
	}
	return col;
}
function stripIndentColumns(line, columns, tabWidth = 4) {
	let col = 0, i = 0;
	while (i < line.length && col < columns) {
		const ch = line[i];
		if (ch === " ") {
			col += 1;
			i++;
		} else if (ch === "	") {
			col += tabWidth - col % tabWidth;
			i++;
		} else break;
	}
	return line.slice(i);
}
function pickEOL(s) {
	if (s.includes("\r\n")) return "\r\n";
	if (s.includes("\r")) return "\r";
	return "\n";
}
function gcd(a, b) {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b) [a, b] = [b, a % b];
	return a;
}
function detectIndentStep(text, { ignoreFirstLine = true, tabWidth = 4 } = {}) {
	const lines = text.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const indents = [];
	for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		indents.push(getIndentColumns(ln, tabWidth));
	}
	if (indents.length === 0) return {
		min: 0,
		step: 0,
		allEven: true,
		allDiv4: true
	};
	const min = Math.min(...indents);
	const shifted = indents.map((v) => v - min).filter((v) => v > 0);
	let step = 0;
	for (const v of shifted) step = step ? gcd(step, v) : v;
	const allEven = indents.every((v) => v % 2 === 0);
	const allDiv4 = indents.every((v) => v % 4 === 0);
	if (step === 0) step = allDiv4 ? 4 : allEven ? 2 : 1;
	else if (step % 4 === 0) step = 4;
	else if (step % 2 === 0) step = 2;
	else step = 1;
	return {
		min,
		step,
		allEven,
		allDiv4
	};
}
function adjustIndentToGrid(line, step, mode = "floor", tabWidth = 4) {
	if (!step || step <= 1) return line;
	const cur = getIndentColumns(line, tabWidth);
	if (cur === 0) return line;
	let target;
	if (mode === "nearest") target = Math.round(cur / step) * step;
	else if (mode === "ceil") target = Math.ceil(cur / step) * step;
	else target = Math.floor(cur / step) * step;
	const delta = cur - target;
	if (delta > 0) return stripIndentColumns(line, delta, tabWidth);
	else if (delta < 0) return " ".repeat(-delta) + line;
	return line;
}
function normalizeStartTagWhitespace(html, { scope = "void-only" } = {}) {
	if (!html || typeof html !== "string") return html;
	const VOID = new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	let out = "";
	let i = 0;
	const n = html.length;
	while (i < n) {
		const ch = html[i];
		if (ch !== "<") {
			out += ch;
			i++;
			continue;
		}
		if (html.startsWith("<!--", i)) {
			const end = html.indexOf("-->", i + 4);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 3);
			i = end + 3;
			continue;
		}
		if (html[i + 1] === "!" || html[i + 1] === "?") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		if (html[i + 1] === "/") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		let j = i + 1;
		while (j < n && /\s/.test(html[j])) j++;
		const nameStart = j;
		while (j < n && /[A-Za-z0-9:-]/.test(html[j])) j++;
		const tagName = html.slice(nameStart, j).toLowerCase();
		let k = j;
		let quote = null;
		while (k < n) {
			const c = html[k];
			if (quote) {
				if (c === quote) quote = null;
				k++;
			} else if (c === "\"" || c === "'") {
				quote = c;
				k++;
			} else if (c === ">") break;
			else k++;
		}
		if (k >= n) {
			out += html.slice(i);
			break;
		}
		const rawTag = html.slice(i, k + 1);
		if (!(scope === "all" || scope === "input-only" && tagName === "input" || scope === "void-only" && VOID.has(tagName))) {
			out += rawTag;
			i = k + 1;
			continue;
		}
		let res = "";
		let q = null;
		let ws = false;
		for (let p = 0; p < rawTag.length; p++) {
			const c = rawTag[p];
			if (q) {
				res += c;
				if (c === q) q = null;
				continue;
			}
			if (c === "\"" || c === "'") {
				q = c;
				res += c;
				ws = false;
				continue;
			}
			if (c === "\n" || c === "\r" || c === "	" || c === " ") {
				if (!ws) {
					res += " ";
					ws = true;
				}
				continue;
			}
			res += c;
			ws = false;
		}
		res = res.replace(/\s*(\/?)\s*>$/, "$1>");
		out += res;
		i = k + 1;
	}
	return out;
}
function collapseInterTagWhitespaceSmart(html, { preserveCommentGaps = true } = {}) {
	if (!html || typeof html !== "string") return html;
	if (!preserveCommentGaps) return html.replace(/>\s+</g, "><");
	const SENT = "";
	let s = html;
	s = s.replace(/-->([^\S\r\n]+)<!--/g, `-->${SENT}<!--`).replace(/-->([^\S\r\n]+)</g, `-->${SENT}<`).replace(/>([^\S\r\n]+)<!--/g, `>${SENT}<!--`);
	s = s.replace(/>\s+</g, "><");
	s = s.replace(new RegExp(SENT, "g"), " ");
	return s;
}
function cleanupInterTagWhitespaceAndIndent(html, { normalizeIndent = true, ignoreFirstLine = true, tabWidth = 4, alignStep = "auto", quantize = "none" } = {}) {
	if (!html || typeof html !== "string" || html.indexOf("<") === -1) return html;
	html = html?.trim?.();
	const placeholders = [];
	const protectedHtml = html.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
		return `\u0000${placeholders.push(m) - 1}\u0000`;
	});
	const eol = pickEOL(protectedHtml);
	const lines = protectedHtml.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const { min, step: autoStep } = detectIndentStep(protectedHtml, {
		ignoreFirstLine,
		tabWidth
	});
	if (normalizeIndent && min > 0) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = stripIndentColumns(ln, min, tabWidth);
	}
	let step = alignStep === "auto" ? autoStep : alignStep;
	if (quantize !== "none" && step > 1) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = adjustIndentToGrid(ln, step, quantize, tabWidth);
	}
	let working = lines.join(eol);
	working = normalizeStartTagWhitespace(working, { scope: "void-only" });
	working = collapseInterTagWhitespaceSmart(working);
	return working.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i])?.trim?.();
}
function checkInsideTagBlock(contextParts, ...str) {
	const current = str?.[0] ?? "";
	const idx = contextParts.indexOf(current);
	if (idx < 0) {
		const tail = str?.join?.("") ?? "";
		return /<([A-Za-z\/!?])[\w\W]*$/.test(tail) && !/>[\w\W]*$/.test(tail);
	}
	const prefix = contextParts.slice(0, idx + 1).join("");
	let inTag = false, inSingle = false, inDouble = false;
	for (let i = 0; i < prefix.length; i++) {
		const ch = prefix[i];
		const next = prefix[i + 1] ?? "";
		if (!inTag) {
			if (ch === "<") {
				if (/[A-Za-z\/!?]/.test(next)) {
					inTag = true;
					inSingle = false;
					inDouble = false;
				}
			}
			continue;
		}
		if (!inSingle && !inDouble) {
			if (ch === "\"") {
				inDouble = true;
				continue;
			}
			if (ch === "'") {
				inSingle = true;
				continue;
			}
			if (ch === ">") {
				inTag = false;
				continue;
			}
		} else if (inDouble) {
			if (ch === "\"") {
				inDouble = false;
				continue;
			}
		} else if (inSingle) {
			if (ch === "'") {
				inSingle = false;
				continue;
			}
		}
	}
	return inTag;
}
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Syntax.ts
var EMap = /* @__PURE__ */ new WeakMap(), parseTag = (str) => {
	const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/);
	if (!match) return {
		tag: str,
		id: null,
		className: null
	};
	const [, tag = "div", id, classStr] = match;
	return {
		tag,
		id,
		className: classStr ? classStr.replace(/\./g, " ").trim() : null
	};
};
var parseIndex = (value) => {
	if (typeof value != "string" || !value?.trim?.()) return -1;
	const exact = value.match(/^#\{(\d+)\}$/);
	if (exact) return parseInt(exact[1] ?? "-1", 10);
	const embedded = value.match(/#\{(\d+)\}/);
	return embedded ? parseInt(embedded[1] ?? "-1", 10) : -1;
};
var connectElement = (el, atb, psh, mapped) => {
	if (!el) return el;
	if (el != null) {
		const entriesIdc = [];
		const addEntryIfExists = (name) => {
			const attr = Array.from(el?.attributes || []).find((attr) => attr.name == name && attr.value?.includes?.("#{"));
			if (attr) {
				const pair = [name, parseIndex(attr?.value) ?? -1];
				entriesIdc.push(pair);
				return pair;
			}
			return [name, -1];
		};
		[
			"dataset",
			"style",
			"classList",
			"visible",
			"aria",
			"value",
			"placeholder",
			"ref"
		].forEach((name) => addEntryIfExists(name));
		const makeEntries = (startsWith, except) => {
			const entries = [];
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value);
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "") && atbIndex >= 0 && !excepted) entries.push([trueAttributeName, atbIndex]);
			}
			return entries;
		};
		const makeCumulativeEntries = (startsWith, except, specific = "") => {
			const entriesMap = /* @__PURE__ */ new Map();
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value) ?? -1;
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				const isSpecific = (Array.isArray(specific) ? specific?.some?.((str) => attr.name === str) : attr.name === specific) && specific !== "";
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "" || isSpecific) && atbIndex >= 0 && !excepted) {
					const key = isSpecific ? attr.name : trueAttributeName;
					if (!entriesMap.has(key)) entriesMap.set(key, []);
					entriesMap.get(key)?.push(atbIndex);
				}
			}
			return Array.from(entriesMap.entries());
		};
		let attributesEntries = makeEntries(["attr:", ""], [
			"ref",
			"value",
			"placeholder"
		]);
		let propertiesEntries = makeEntries(["prop:"], []);
		let onEntries = makeCumulativeEntries(["on:", "@"], [], "");
		let refEntries = makeCumulativeEntries(["ref:"], [], ["ref"]);
		const bindings = Object.fromEntries(entriesIdc?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.attributes = Object.fromEntries(attributesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.properties = Object.fromEntries(propertiesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.on = Object.fromEntries(onEntries?.filter?.((pair) => pair[1]?.some?.((idx) => idx >= 0))?.map?.((pair) => [pair[0], pair[1]?.map?.((idx) => atb?.[idx]).filter((v) => v != null)]) ?? []);
		const refIndex = entriesIdc?.find?.((pair) => pair[0] == "ref" && pair[1] >= 0)?.[1];
		if (refIndex != null && refIndex >= 0) {
			const ref = atb?.[refIndex];
			if (typeof ref == "function") ref?.(el);
			else if (ref != null && typeof ref == "object") ref.value = el;
		}
		refEntries?.forEach?.((pair) => {
			(pair?.[1]?.filter?.((idx) => idx != null && idx >= 0)?.map?.((idx) => atb?.[idx])?.filter?.((v) => v != null))?.forEach?.((ref) => {
				if (typeof ref == "function") ref?.(el);
				else if (ref != null && typeof ref == "object") ref.value = el;
			});
		});
		const clearPlaceholdersFromAttributesOfElement = (el) => {
			if (el == null) return;
			const attributeIsInRegistry = (name) => {
				return attributesEntries?.some?.((pair) => pair[0] == name) || entriesIdc?.some?.((pair) => pair[0] == name) || name?.startsWith?.("ref:") || name == "ref";
			};
			for (const attr of Array.from(el?.attributes || [])) if (attr.value?.includes?.("#{") && attr.value?.includes?.("}") && attributeIsInRegistry(attr.name) || attr.value?.startsWith?.("#{") && attr.value?.endsWith?.("}") || attr.name?.includes?.(":") || attr.name?.includes?.("ref:") || attr.name == "ref") el?.removeAttribute?.(attr.name);
			for (const attr of Array.from(el?.attributes || [])) if (typeof attr.value == "string" && /#\{\d+\}/.test(attr.value)) el?.removeAttribute?.(attr.name);
		};
		clearPlaceholdersFromAttributesOfElement(el);
		pruneEmptyStyleAttribute(el);
		if (!EMap?.has?.(el)) EMap?.set?.(el, E(el, bindings));
	}
	return EMap?.get?.(el) ?? el;
};
var linearBuilder = (strings, ...values) => {
	const nodes = [];
	for (let i = 0; i < strings?.length; i++) {
		const str = strings?.[i];
		const val = values?.[i];
		nodes.push(H(str));
		nodes.push(val);
	}
	if (nodes?.length <= 1) return getNode(nodes?.[0], null, 0);
	const fragment = document.createDocumentFragment();
	fragment.append(...nodes?.filter?.((nd) => nd != null)?.map?.((en, i) => getNode(en, null, i))?.filter?.((nd) => nd != null));
	return fragment;
};
function html(strings, ...values) {
	if (strings?.at?.(0)?.trim?.()?.startsWith?.("<") && strings?.at?.(-1)?.trim?.()?.endsWith?.(">")) return htmlBuilder({ createElement: null })(strings, ...values);
	return linearBuilder(strings, ...values);
}
var isValidParent = (parent) => {
	return parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement && parent != document.body);
};
var replaceNode = (parent, node, el) => {
	if (el != null) el.boundParent = parent;
	let newNode = getNode(el, null, -1, parent);
	if (isElement(newNode)) {
		if (newNode?.parentNode != parent && !newNode?.contains?.(parent) && newNode != null) node?.replaceWith?.(hasValue(newNode) && (typeof newNode?.value == "object" || typeof newNode?.value == "function") && isElement(newNode?.value) ? newNode?.value : newNode);
	} else node?.remove?.();
};
function htmlBuilder({ createElement = null } = {}) {
	return function(strings, ...values) {
		let parts = [];
		const psh = [], atb = [];
		for (let i = 0; i < strings.length; i++) {
			parts.push(strings?.[i] || "");
			if (i < values.length) if (strings[i]?.trim()?.endsWith?.("<")) {
				const dat = parseTag(values?.[i]);
				parts.push(dat.tag || "div");
				if (dat.id) parts.push(` id="${dat.id}"`);
				if (dat.className) parts.push(` class="${dat.className}"`);
			} else {
				const $inTagOpen = checkInsideTagBlock(strings, strings?.[i] || "", strings?.[i + 1] || "");
				const $afterEquals = /[\w:\-\.\]]\s*=\s*$/.test(strings[i]?.trim?.() ?? "") || strings[i]?.trim?.()?.endsWith?.("=");
				const $isQuoteBegin = strings[i]?.trim?.()?.match?.(/['"]$/);
				const $isQuoteEnd = strings[i + 1]?.trim?.()?.match?.(/^['"]/) ?? $isQuoteBegin;
				const $betweenQuotes = $isQuoteBegin && $isQuoteEnd;
				const $attributePattern = $afterEquals;
				if (($attributePattern || $betweenQuotes) && $inTagOpen) {
					const $needsToQuoteWrap = $attributePattern && !$betweenQuotes;
					const ati = atb.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? $needsToQuoteWrap ? `"#{${ati}}"` : `#{${ati}}` : "");
					atb.push(values?.[i]);
				} else if (!$inTagOpen) {
					const psi = psh.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? isPrimitive(values?.[i]) ? String(values?.[i])?.trim?.() : `<!--o:${psi}-->` : "");
					psh.push(values?.[i]);
				}
			}
		}
		const sourceCode = cleanupInterTagWhitespaceAndIndent(parts.join("").trim());
		const mapped = /* @__PURE__ */ new WeakMap(), doc = new DOMParser().parseFromString(sourceCode, "text/html");
		const sources = (doc instanceof HTMLTemplateElement || doc?.matches?.("template") ? doc : doc.querySelector("template"))?.content ?? doc.body ?? doc;
		const frag = document.createDocumentFragment();
		const bucket = Array.from(sources.childNodes)?.filter((e) => {
			return e instanceof Node;
		}).map((node) => {
			if (!isValidParent(node?.parentNode) && node?.parentNode != frag) {
				node?.remove?.();
				if (node != null) frag?.append?.(node);
			}
			return node;
		});
		let walkedNodes = [];
		bucket.forEach((nodeSet) => {
			const walker = nodeSet ? document.createTreeWalker(nodeSet, NodeFilter.SHOW_ALL, null) : null;
			do {
				const node = walker?.currentNode;
				walkedNodes.push(node);
			} while (walker?.nextNode?.());
		});
		walkedNodes?.filter?.((node) => node?.nodeType == Node.COMMENT_NODE)?.forEach?.((node) => {
			if (node?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
				let el = psh?.[parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];
				if (el == null || el === void 0 || (typeof el == "string" ? el : null)?.trim?.() == "") node?.remove?.();
				else {
					const $parent = node?.parentNode;
					if (Array.isArray(el) || el instanceof Map || el instanceof Set) replaceNode?.($parent, node, el = M(el, null, $parent));
					else if (el != null) replaceNode?.($parent, node, el);
				}
			}
			if (node?.isConnected) node?.remove?.();
		});
		walkedNodes?.filter((node) => node.nodeType == Node.ELEMENT_NODE)?.map?.((node) => {
			connectElement(node, atb, psh, mapped);
		});
		return Array.from(frag?.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
	};
}
var H = (str, ...values) => {
	if (typeof str == "string") {
		if (str?.trim?.()?.startsWith?.("<") && str?.trim?.()?.endsWith?.(">")) {
			const doc = new DOMParser().parseFromString(cleanupInterTagWhitespaceAndIndent(str?.trim?.()), "text/html");
			const basis = doc.querySelector("template")?.content ?? doc.body;
			if (basis instanceof HTMLBodyElement) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis.childNodes ?? []));
				return Array.from(frag.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
			}
			if (basis instanceof DocumentFragment) return basis;
			if (basis?.childNodes?.length > 1) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis?.childNodes ?? []));
				return frag;
			}
			return basis?.childNodes?.[0] ?? new Text(str);
		}
		return new Text(str);
	} else if (typeof str == "function") return H(str?.());
	else if (Array.isArray(str) && values) return html(str, ...values);
	else if (str instanceof Node) return str;
	return getNode(str);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Glit.ts
var styleCache = /* @__PURE__ */ new Map();
var styleElementCache = /* @__PURE__ */ new WeakMap();
var propStore = /* @__PURE__ */ new WeakMap();
var CSM = /* @__PURE__ */ new WeakMap();
var camelToKebab = (str) => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
var whenBoxValid = (name) => {
	const cb = camelToKebab(name);
	if ([
		"border-box",
		"content-box",
		"device-pixel-content-box"
	].indexOf(cb) >= 0) return cb;
	return null;
};
var whenAxisValid = (name) => {
	const cb = camelToKebab(name);
	if (cb?.startsWith?.("inline")) return "inline";
	if (cb?.startsWith?.("block")) return "block";
	return null;
};
var inRenderKey = Symbol.for("@render@");
var defKeys = Symbol.for("@defKeys@");
var defaultStyle = typeof document != "undefined" ? document?.createElement?.("style") : null;
var defineSource = (source, holder, name) => {
	if (source == "attr") return attrRef.bind(null, holder, name || "");
	if (source == "media") return matchMediaRef;
	if (source == "query") return (val) => Q?.(name || val || "", holder);
	if (source == "query-shadow") return (val) => Q?.(name || val || "", holder?.shadowRoot ?? holder);
	if (source == "localStorage") return localStorageRef;
	if (source == "inline-size") return sizeRef.bind(null, holder, "inline", whenBoxValid(name) || "border-box");
	if (source == "content-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "content-box");
	if (source == "block-size") return sizeRef.bind(null, holder, "block", whenBoxValid(name) || "border-box");
	if (source == "border-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "border-box");
	if (source == "scroll") return scrollRef.bind(null, holder, whenAxisValid(name) || "inline");
	if (source == "device-pixel-content-box") return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "device-pixel-content-box");
	if (source == "checked") return checkedRef.bind(null, holder);
	if (source == "value") return valueRef.bind(null, holder);
	if (source == "value-as-number") return valueAsNumberRef.bind(null, holder);
	return ref;
};
if (defaultStyle) typeof document != "undefined" && document.querySelector?.("head")?.appendChild?.(defaultStyle);
var getDef = (source) => {
	if (source == "query") return "input";
	if (source == "query-shadow") return "input";
	if (source == "media") return false;
	if (source == "localStorage") return null;
	if (source == "attr") return null;
	if (source == "inline-size") return 0;
	if (source == "block-size") return 0;
	if (source == "border-box") return 0;
	if (source == "content-box") return 0;
	if (source == "scroll") return 0;
	if (source == "device-pixel-content-box") return 0;
	if (source == "checked") return false;
	if (source == "value") return "";
	if (source == "value-as-number") return 0;
	return null;
};
if (defaultStyle) defaultStyle.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`;
function withProperties(ctr) {
	const proto = ctr.prototype ?? Object.getPrototypeOf(ctr) ?? ctr;
	const $prev = proto?.$init ?? ctr?.$init;
	proto.$init = function(...args) {
		$prev?.call?.(this, ...args);
		const allDefs = {};
		let p = Object.getPrototypeOf(this) ?? this;
		while (p) {
			if (Object.hasOwn(p, defKeys)) {
				const defs = Object.assign({}, Object.getOwnPropertyDescriptors(p), p[defKeys] ?? {});
				for (const k of Object.keys(defs)) if (!(k in allDefs)) allDefs[k] = defs[k];
			}
			p = Object.getPrototypeOf(p);
		}
		for (const [key, def] of Object.entries(allDefs)) {
			const exists = this[key];
			if (def != null) Object.defineProperty(this, key, def);
			try {
				this[key] = exists || this[key];
			} catch (e) {}
		}
		return this;
	};
	return ctr;
}
function defineElement(name, options) {
	return function(target, _key) {
		const registry = globalThis?.customElements;
		try {
			if (!registry || !name) return target;
			if (typeof registry.get !== "function" || typeof registry.define !== "function") return target;
			const existing = registry.get(name);
			if (existing) return existing;
			registry?.define?.(name, target, options);
		} catch (e) {
			if (e?.name === "NotSupportedError" || /has already been used|already been defined/i.test(e?.message || "")) return registry?.get?.(name) ?? target;
			throw e;
		}
		return target;
	};
}
function property(options = {}) {
	const { attribute, source, name, from } = options;
	return function(target, key) {
		const attrName = typeof attribute == "string" ? attribute : name ?? key;
		if (attribute !== false && attrName != null) {
			const ctor = target.constructor;
			if (!ctor.observedAttributes) ctor.observedAttributes = [];
			if (ctor.observedAttributes.indexOf(attrName) < 0) ctor.observedAttributes.push(attrName);
		}
		if (!Object.hasOwn(target, defKeys)) target[defKeys] = {};
		target[defKeys][key] = {
			get() {
				const ROOT = this;
				const inRender = ROOT[inRenderKey];
				const sourceTarget = !from ? ROOT : from instanceof HTMLElement ? from : typeof from == "string" ? Q?.(from, ROOT) : ROOT;
				let store = propStore.get(ROOT);
				let stored = store?.get?.(key);
				if (stored == null && source != null) {
					if (!store) propStore.set(ROOT, store = /* @__PURE__ */ new Map());
					if (!store?.has?.(key)) store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source)));
				}
				if (inRender) return stored;
				if (stored?.element instanceof HTMLElement) return stored?.element;
				return (typeof stored == "object" || typeof stored == "function") && (stored?.value != null || "value" in stored) ? stored?.value : stored;
			},
			set(newValue) {
				const ROOT = this;
				const sourceTarget = !from ? ROOT : from instanceof HTMLElement ? from : typeof from == "string" ? Q?.(from, ROOT) : ROOT;
				let store = propStore.get(ROOT);
				let stored = store?.get?.(key);
				if (stored == null && source != null) {
					if (!store) propStore.set(ROOT, store = /* @__PURE__ */ new Map());
					if (!store?.has?.(key)) {
						const initialValue = (typeof newValue == "object" || typeof newValue == "function" ? newValue?.value : null) ?? newValue ?? getDef(source);
						store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(initialValue));
					}
				} else if (typeof stored == "object" || typeof stored == "function") try {
					if (typeof newValue == "object" && newValue != null && (newValue?.value == null && !("value" in newValue) || typeof newValue?.value == "object" || typeof newValue?.value == "function")) Object.assign(stored, newValue?.value ?? newValue);
					else stored.value = (typeof newValue == "object" || typeof newValue == "function" ? newValue?.value : null) ?? newValue;
				} catch (e) {
					console.warn("Error setting property value:", e);
				}
			},
			enumerable: true,
			configurable: true
		};
	};
}
var adoptedStyleSheetsCache = /* @__PURE__ */ new WeakMap();
var addAdoptedSheetToElement = (bTo, sheet) => {
	let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
	if (!adoptedSheets) adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
	if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
	if (bTo.shadowRoot) bTo.shadowRoot.adoptedStyleSheets = [...bTo.shadowRoot.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
};
var loadCachedStyles = (bTo, src) => {
	if (!src) return null;
	let resolvedSrc = src;
	if (typeof src == "function") try {
		const weak = new WeakRef(bTo);
		resolvedSrc = src.call(bTo, weak);
	} catch (e) {
		console.warn("Error calling styles function:", e);
		return null;
	}
	if (resolvedSrc && typeof CSSStyleSheet != "undefined" && resolvedSrc instanceof CSSStyleSheet) {
		addAdoptedSheetToElement(bTo, resolvedSrc);
		return null;
	}
	if (resolvedSrc instanceof Promise) {
		resolvedSrc.then((result) => {
			if (result instanceof CSSStyleSheet) addAdoptedSheetToElement(bTo, result);
			else if (result != null) loadCachedStyles(bTo, result);
		}).catch((e) => {
			console.warn("Error loading adopted stylesheet:", e);
		});
		return null;
	}
	if (typeof resolvedSrc == "string" || resolvedSrc instanceof Blob || resolvedSrc instanceof File) {
		const adopted = loadAsAdopted(resolvedSrc, "");
		if (adopted) {
			let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
			if (!adoptedSheets) adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
			const addAdoptedSheet = (sheet) => {
				if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
				if (bTo.shadowRoot) bTo.shadowRoot.adoptedStyleSheets = [...bTo.shadowRoot.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
			};
			if (adopted instanceof Promise) {
				adopted.then(addAdoptedSheet).catch((e) => {
					console.warn("Error loading adopted stylesheet:", e);
				});
				return null;
			} else {
				addAdoptedSheet(adopted);
				return null;
			}
		}
	}
	const source = typeof src == "function" || typeof src == "object" ? styleElementCache : styleCache;
	const cached = source.get(src);
	let styleElement = cached?.styleElement;
	let vars = cached?.vars;
	if (!cached) {
		let styles = ``;
		let props = [];
		if (typeof resolvedSrc == "string") styles = resolvedSrc || "";
		else if (typeof resolvedSrc == "object" && resolvedSrc != null) if (resolvedSrc instanceof HTMLStyleElement) styleElement = resolvedSrc;
		else {
			styles = typeof resolvedSrc.css == "string" ? resolvedSrc.css : typeof resolvedSrc == "string" ? resolvedSrc : String(resolvedSrc);
			props = resolvedSrc?.props ?? props;
			vars = resolvedSrc?.vars ?? vars;
		}
		if (!styleElement && styles) styleElement = loadInlineStyle(styles, bTo, "ux-layer");
		source.set(src, {
			css: styles,
			props,
			vars,
			styleElement
		});
	}
	return styleElement;
};
var isNotExtended = (el) => {
	return !(el instanceof HTMLDivElement || el instanceof HTMLImageElement || el instanceof HTMLVideoElement || el instanceof HTMLCanvasElement) && !(el?.hasAttribute?.("is") || el?.getAttribute?.("is") != null);
};
/**
* GLitElement: Создаёт базовый класс для кастомных элементов с расширенными возможностями.
* Поддерживает все lifecycle callbacks Web Components.
* 
* @param derivate - Базовый класс для расширения (по умолчанию HTMLElement).
* @returns Конструктор расширенного класса с полной поддержкой lifecycle.
* 
* @example
* ```typescript
* // Базовое использование
* class MyElement extends GLitElement() {
*     connectedCallback() {
*         super.connectedCallback();
*         console.log('Connected!');
*     }
*     
*     render() {
*         return H`<div>Hello</div>`;
*     }
* }
* 
* // С наследованием от другого элемента
* class MyButton extends GLitElement(HTMLButtonElement) {
*     static observedAttributes = ['disabled'];
*     
*     attributeChangedCallback(name, oldVal, newVal) {
*         console.log(`${name} changed from ${oldVal} to ${newVal}`);
*     }
* }
* 
* // С декоратором
* @defineElement('my-element')
* class MyElement extends GLitElement() {
*     @property({ source: 'attr', name: 'value' })
*     value: string = '';
*     
*     disconnectedCallback() {
*         console.log('Disconnected!');
*     }
* }
* ```
*/
function GLitElement(derivate) {
	const fallbackBase = globalThis.HTMLElement ?? class {};
	const Base = derivate ?? fallbackBase;
	const cached = CSM.get(Base);
	if (cached) return cached;
	/**
	* Внутренний класс с полной реализацией lifecycle
	*/
	class GLitElementImpl extends Base {
		#shadowDOM;
		#styleElement;
		#defaultStyle;
		#initialized = false;
		styleLibs = [];
		adoptedStyleSheets = [];
		get styles() {}
		get initialAttributes() {}
		styleLayers() {
			return [];
		}
		render(_weak) {
			return document.createElement("slot");
		}
		constructor(...args) {
			super(...args);
			if (isNotExtended(this)) {
				const shadowRoot = addRoot(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" }));
				const defStyle = this.#defaultStyle ??= defaultStyle?.cloneNode?.(true);
				const layersStyle = shadowRoot.querySelector(`style[data-type="ux-layer"]`);
				if (layersStyle) layersStyle.after(defStyle);
				else shadowRoot.prepend(defStyle);
			}
			this.styleLibs ??= [];
		}
		$makeLayers() {
			return `@layer ${[
				"ux-preload",
				"ux-layer",
				...this.styleLayers?.() ?? []
			].join?.(",") ?? ""};`;
		}
		onInitialize(_weak) {
			return this;
		}
		onRender(_weak) {
			return this;
		}
		getProperty(key) {
			const current = this[inRenderKey];
			this[inRenderKey] = true;
			const cp = this[key];
			this[inRenderKey] = current;
			if (!current) delete this[inRenderKey];
			return cp;
		}
		loadStyleLibrary($module) {
			const root = this.shadowRoot;
			const module = typeof $module == "function" ? $module?.(root) : $module;
			if (module instanceof HTMLStyleElement) {
				this.styleLibs?.push?.(module);
				if (this.#styleElement?.isConnected) this.#styleElement?.before?.(module);
				else this.shadowRoot?.prepend?.(module);
			} else if (module instanceof CSSStyleSheet) {
				let adoptedSheets = adoptedStyleSheetsCache.get(this);
				if (!adoptedSheets) adoptedStyleSheetsCache.set(this, adoptedSheets = []);
				if (adoptedSheets.indexOf(module) < 0) adoptedSheets.push(module);
				if (root) root.adoptedStyleSheets = [...root.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))];
			} else {
				const adopted = loadAsAdopted(module, "ux-layer");
				let adoptedSheets = adoptedStyleSheetsCache.get(this);
				if (!adoptedSheets) adoptedStyleSheetsCache.set(this, adoptedSheets = []);
				const addAdoptedSheet = (sheet) => {
					if (sheet && adoptedSheets.indexOf(sheet) < 0) adoptedSheets.push(sheet);
					if (root) root.adoptedStyleSheets = [...root.adoptedStyleSheets || [], ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))];
				};
				if (adopted instanceof Promise) adopted.then(addAdoptedSheet).catch(() => {});
				else if (adopted) addAdoptedSheet(adopted);
			}
			return this;
		}
		createShadowRoot() {
			return this.shadowRoot ?? this.attachShadow({ mode: "open" });
		}
		/**
		* Вызывается когда элемент добавлен в DOM
		*/
		connectedCallback() {
			if (super.connectedCallback) super.connectedCallback();
			const weak = new WeakRef(this);
			if (!this.#initialized) {
				this.#initialized = true;
				const shadowRoot = isNotExtended(this) ? this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" }) : this.shadowRoot;
				const ctor = this.constructor;
				const init = this.$init ?? ctor.prototype?.$init;
				if (typeof init === "function") init.call(this);
				const attrs = typeof this.initialAttributes == "function" ? this.initialAttributes() : this.initialAttributes;
				setAttributesIfNull(this, attrs);
				this.onInitialize?.call(this, weak);
				this[inRenderKey] = true;
				if (isNotExtended(this) && shadowRoot) {
					const rendered = this.render?.call?.(this, weak) ?? document.createElement("slot");
					const styleElement = loadCachedStyles(this, this.styles);
					if (styleElement instanceof HTMLStyleElement) this.#styleElement = styleElement;
					const elements = [
						H`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
						this.#defaultStyle,
						...this.styleLibs.map((x) => x.cloneNode?.(true)) || [],
						styleElement,
						rendered
					].filter((x) => x != null && isElement(x));
					shadowRoot.append(...elements);
					const adoptedSheets = adoptedStyleSheetsCache.get(this) || [];
					if (adoptedSheets.length > 0) shadowRoot.adoptedStyleSheets = [...adoptedSheets.filter((s) => !shadowRoot.adoptedStyleSheets?.includes(s)), ...new Set([...shadowRoot.adoptedStyleSheets || []])];
				}
				this.onRender?.call?.(this, weak);
				delete this[inRenderKey];
				if (shadowRoot) addRoot(shadowRoot);
			}
		}
		/**
		* Вызывается когда элемент удалён из DOM
		*/
		disconnectedCallback() {
			if (super.disconnectedCallback) super.disconnectedCallback();
		}
		/**
		* Вызывается когда элемент перемещён в новый документ
		*/
		adoptedCallback() {
			if (super.adoptedCallback) super.adoptedCallback();
		}
		/**
		* Вызывается когда наблюдаемый атрибут изменился
		*/
		attributeChangedCallback(name, oldValue, newValue) {
			if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldValue, newValue);
		}
	}
	const result = withProperties(GLitElementImpl);
	CSM.set(Base, result);
	console.log("result", result);
	return result;
}
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/controllers/LazyEvents.ts
var hubsByTarget = /* @__PURE__ */ new WeakMap();
var keyOf = (type, options) => {
	return `${type}|c:${options?.capture ? "1" : "0"}|p:${options?.passive ? "1" : "0"}`;
};
var lazyAddEventListener = (target, type, handler, options = {}) => {
	if (!target || typeof target.addEventListener !== "function") return () => {};
	const normalized = {
		capture: Boolean(options.capture),
		passive: Boolean(options.passive)
	};
	const key = keyOf(type, normalized);
	let hubs = hubsByTarget.get(target);
	if (!hubs) {
		hubs = /* @__PURE__ */ new Map();
		hubsByTarget.set(target, hubs);
	}
	let hub = hubs.get(key);
	if (!hub) {
		const handlers = /* @__PURE__ */ new Set();
		const listener = (ev) => {
			for (const cb of Array.from(handlers)) try {
				cb(ev);
			} catch (e) {
				console.warn(e);
			}
		};
		hubs.set(key, hub = {
			handlers,
			listener,
			options: normalized
		});
		target.addEventListener(type, listener, normalized);
	}
	hub.handlers.add(handler);
	return () => {
		const hubsNow = hubsByTarget.get(target);
		const hubNow = hubsNow?.get(key);
		if (!hubNow) return;
		hubNow.handlers.delete(handler);
		if (hubNow.handlers.size > 0) return;
		target.removeEventListener(type, hubNow.listener, hubNow.options);
		hubsNow?.delete(key);
		if (hubsNow && hubsNow.size === 0) hubsByTarget.delete(target);
	};
};
var proxiedByRoot = /* @__PURE__ */ new WeakMap();
var resolveHTMLElement = (el) => {
	const resolved = el?.element ?? el;
	return resolved instanceof HTMLElement ? resolved : null;
};
var shouldApply = (when, hadMatch, hadHandled) => {
	if (!when) return false;
	if (when === "handled") return hadHandled;
	return hadMatch;
};
/**
* Proxied events:
* - Installs **one** real DOM listener on `root` (per event/options/config), but only after the first element handler registers.
* - Routes events to registered element handlers based on the composed path.
* - Can conditionally call preventDefault/stop* only when a trigger matches (or when handled).
*/
var addProxiedEvent = (root, type, options = {
	capture: true,
	passive: false
}, config = {}) => {
	const target = root;
	if (!target || typeof target.addEventListener !== "function") return (_element, _handler) => () => {};
	const normalized = {
		capture: Boolean(options.capture),
		passive: Boolean(options.passive)
	};
	const strategy = config.strategy ?? "closest";
	const key = `${type}|c:${normalized.capture ? "1" : "0"}|p:${normalized.passive ? "1" : "0"}|s:${strategy}|pd:${String(config.preventDefault ?? "")}|sp:${String(config.stopPropagation ?? "")}|sip:${String(config.stopImmediatePropagation ?? "")}`;
	let hubs = proxiedByRoot.get(target);
	if (!hubs) {
		hubs = /* @__PURE__ */ new Map();
		proxiedByRoot.set(target, hubs);
	}
	let hub = hubs.get(key);
	if (!hub) {
		const targets = /* @__PURE__ */ new Map();
		const dispatch = (ev) => {
			let hadMatch = false;
			let hadHandled = false;
			const callSet = (set) => {
				if (!set || set.size === 0) return;
				hadMatch = true;
				for (const cb of Array.from(set)) if (cb(ev)) hadHandled = true;
			};
			const path = ev?.composedPath?.();
			if (Array.isArray(path)) if (strategy === "closest") for (const n of path) {
				const el = resolveHTMLElement(n);
				if (!el) continue;
				const set = targets.get(el);
				if (!set) continue;
				callSet(set);
				break;
			}
			else for (const n of path) {
				const el = resolveHTMLElement(n);
				if (!el) continue;
				callSet(targets.get(el));
			}
			else {
				let cur = resolveHTMLElement(ev?.target);
				while (cur) {
					const set = targets.get(cur);
					if (set) {
						callSet(set);
						if (strategy === "closest") break;
					}
					const r = cur.getRootNode?.();
					cur = cur.parentElement || (r instanceof ShadowRoot ? r.host : null);
				}
			}
			if (shouldApply(config.preventDefault, hadMatch, hadHandled)) ev?.preventDefault?.();
			if (shouldApply(config.stopImmediatePropagation, hadMatch, hadHandled)) ev?.stopImmediatePropagation?.();
			if (shouldApply(config.stopPropagation, hadMatch, hadHandled)) ev?.stopPropagation?.();
		};
		hub = {
			targets,
			unbindGlobal: null,
			options: normalized,
			strategy,
			config,
			dispatch
		};
		hubs.set(key, hub);
	}
	return (element, handler) => {
		const el = resolveHTMLElement(element);
		if (!el) return () => {};
		if (hub.targets.size === 0 && !hub.unbindGlobal) hub.unbindGlobal = lazyAddEventListener(target, type, hub.dispatch, hub.options);
		let set = hub.targets.get(el);
		if (!set) {
			set = /* @__PURE__ */ new Set();
			hub.targets.set(el, set);
		}
		set.add(handler);
		return () => {
			const hubsNow = proxiedByRoot.get(target);
			const h = hubsNow?.get(key);
			if (!h) return;
			const resolved = resolveHTMLElement(element);
			if (!resolved) return;
			const s = h.targets.get(resolved);
			if (!s) return;
			s.delete(handler);
			if (s.size === 0) h.targets.delete(resolved);
			if (h.targets.size === 0) {
				h.unbindGlobal?.();
				h.unbindGlobal = null;
				hubsNow?.delete(key);
				if (hubsNow && hubsNow.size === 0) proxiedByRoot.delete(target);
			}
		};
	};
};
typeof document != "undefined" && document?.documentElement;
var $set = (rv, key, val) => {
	if (rv?.deref?.() != null) return rv.deref()[key] = val;
};
function makeInterruptTrigger(except = null, ref = booleanRef(false), closeEvents = [
	"pointerdown",
	"click",
	"contextmenu",
	"scroll"
], element = document?.documentElement) {
	if (!element) return () => {};
	const wr = new WeakRef(ref);
	const close = typeof ref === "function" ? ref : (ev) => {
		(!(except?.contains?.(ev?.target) || ev?.target == (except?.element ?? except)) || !except) && $set(wr, "value", false);
	};
	const listening = closeEvents.map((event) => lazyAddEventListener(element, event, close, {
		capture: false,
		passive: false
	}));
	const dispose = () => listening.forEach((ub) => ub?.());
	addToCallChain(ref, Symbol.dispose, dispose);
	return dispose;
}
if (typeof PointerEvent != "undefined");
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/mixins/types.ts
function junctionToBox(a, b) {
	const left = Math.min(a.x, b.x);
	const top = Math.min(a.y, b.y);
	const right = Math.max(a.x, b.x);
	const bottom = Math.max(a.y, b.y);
	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top
	};
}
var JUNCTION_SELECT_EVENTS = {
	start: "junction-select:start",
	move: "junction-select:move",
	end: "junction-select:end",
	cancel: "junction-select:cancel"
};
var JUNCTION_DRAG_EVENTS = {
	start: "junction-drag:start",
	move: "junction-drag:move",
	end: "junction-drag:end"
};
var JUNCTION_RESIZE_EVENTS = {
	start: "junction-resize:start",
	move: "junction-resize:move",
	end: "junction-resize:end"
};
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/mixins/Junction.ts
/**
* Junction-based DOM mixins: selection (A/B), drag, resize.
*/
var mixinDisposers = /* @__PURE__ */ new WeakMap();
var pushDisposable = (host, mixinName, fn) => {
	const map = mixinDisposers.get(host) ?? /* @__PURE__ */ new Map();
	const list = map.get(mixinName) ?? [];
	list.push(fn);
	map.set(mixinName, list);
	mixinDisposers.set(host, map);
};
var runDisposers = (host, mixinName) => {
	const map = mixinDisposers.get(host);
	const list = map?.get(mixinName);
	if (!list) return;
	for (const fn of list) try {
		fn();
	} catch {}
	map.delete(mixinName);
	if (map.size === 0) mixinDisposers.delete(host);
};
var parsePxVar = (host, name) => {
	const raw = globalThis.getComputedStyle?.(host)?.getPropertyValue?.(name)?.trim?.() ?? "";
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : 0;
};
var queryHandle = (host, attr, fallback) => {
	const sel = host.getAttribute(attr)?.trim();
	if (!sel) return fallback;
	const found = host.querySelector(sel);
	return found instanceof HTMLElement ? found : fallback;
};
var JunctionSelectMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-select");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		const overlay = document.createElement("div");
		overlay.className = "ui-junction-select-overlay";
		overlay.setAttribute("data-junction-overlay", "");
		overlay.style.cssText = "position:absolute;pointer-events:none;z-index:9999;box-sizing:border-box;border:1px dashed color-mix(in oklab, #3794ff 70%, transparent);background:color-mix(in oklab, #3794ff 14%, transparent);display:none;inset:auto;min-width:0;min-height:0;";
		const ensurePositioned = () => {
			if ((globalThis.getComputedStyle?.(host))?.position === "static") host.style.position = "relative";
		};
		ensurePositioned();
		host.appendChild(overlay);
		let active = false;
		let a = {
			x: 0,
			y: 0
		};
		let b = {
			x: 0,
			y: 0
		};
		const localPoint = (ev) => {
			const r = host.getBoundingClientRect();
			return {
				x: ev.clientX - r.left,
				y: ev.clientY - r.top
			};
		};
		const applyOverlay = () => {
			const box = junctionToBox(a, b);
			if (box.width < 1 && box.height < 1) {
				overlay.style.display = "none";
				return;
			}
			overlay.style.display = "block";
			overlay.style.left = `${box.left}px`;
			overlay.style.top = `${box.top}px`;
			overlay.style.width = `${box.width}px`;
			overlay.style.height = `${box.height}px`;
		};
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target?.closest?.("[data-junction-ignore-select], [data-junction-drag-handle], [data-junction-resize-handle], button, a, input, textarea, select")) return;
			if (!(ev.target === host || host.contains(ev.target))) return;
			active = true;
			a = localPoint(ev);
			b = { ...a };
			host.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.start, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					host
				}
			}));
			applyOverlay();
		};
		const onMove = (ev) => {
			if (!active) return;
			b = localPoint(ev);
			applyOverlay();
			const box = junctionToBox(a, b);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.move, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					box,
					host
				}
			}));
		};
		const end = (ev) => {
			if (!active) return;
			active = false;
			try {
				host.releasePointerCapture(ev.pointerId);
			} catch {}
			const box = junctionToBox(a, b);
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.end, {
				bubbles: true,
				detail: {
					a: { ...a },
					b: { ...b },
					box,
					host
				}
			}));
		};
		const onUp = (ev) => {
			if (!active) return;
			end(ev);
		};
		const onCancel = (ev) => {
			if (!active) return;
			active = false;
			overlay.style.display = "none";
			try {
				host.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_SELECT_EVENTS.cancel, {
				bubbles: true,
				detail: { host }
			}));
		};
		pushDisposable(host, "ui-junction-select", () => {
			overlay.remove();
		});
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointermove", onMove));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointerup", onUp));
		pushDisposable(host, "ui-junction-select", addEvent(host, "pointercancel", onCancel));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-select");
		return this;
	}
};
var JunctionDragMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-drag");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		setStyleProperty(host, "--jx-drag-x", parsePxVar(host, "--jx-drag-x"));
		setStyleProperty(host, "--jx-drag-y", parsePxVar(host, "--jx-drag-y"));
		const previousTransform = host.style.transform;
		if (!host.style.transform || host.style.transform === "none") host.style.transform = "translate3d(calc(var(--jx-drag-x, 0) * 1px), calc(var(--jx-drag-y, 0) * 1px), 0)";
		const handle = queryHandle(host, "data-junction-drag-handle", host);
		let dragging = false;
		let startX = 0;
		let startY = 0;
		let baseX = 0;
		let baseY = 0;
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target !== handle && !handle.contains(ev.target)) return;
			dragging = true;
			startX = ev.clientX;
			startY = ev.clientY;
			baseX = parsePxVar(host, "--jx-drag-x");
			baseY = parsePxVar(host, "--jx-drag-y");
			handle.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.start, {
				bubbles: true,
				detail: {
					host,
					clientX: ev.clientX,
					clientY: ev.clientY,
					baseX,
					baseY
				}
			}));
		};
		const onMove = (ev) => {
			if (!dragging) return;
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			const nx = baseX + dx;
			const ny = baseY + dy;
			setStyleProperty(host, "--jx-drag-x", nx);
			setStyleProperty(host, "--jx-drag-y", ny);
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.move, {
				bubbles: true,
				detail: {
					host,
					dx,
					dy,
					x: nx,
					y: ny
				}
			}));
		};
		const onUp = (ev) => {
			if (!dragging) return;
			dragging = false;
			try {
				handle.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_DRAG_EVENTS.end, {
				bubbles: true,
				detail: {
					host,
					x: parsePxVar(host, "--jx-drag-x"),
					y: parsePxVar(host, "--jx-drag-y")
				}
			}));
		};
		pushDisposable(host, "ui-junction-drag", () => {
			host.style.transform = previousTransform;
		});
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointermove", onMove));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointerup", onUp));
		pushDisposable(host, "ui-junction-drag", addEvent(handle, "pointercancel", onUp));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-drag");
		return this;
	}
};
var JunctionResizeMixin = class extends DOMMixin {
	constructor() {
		super("ui-junction-resize");
	}
	connect(wEl) {
		const host = wEl?.deref?.();
		if (!host) return this;
		const handle = queryHandle(host, "data-junction-resize-handle", host);
		let resizing = false;
		let sx = 0;
		let sy = 0;
		let sw = 0;
		let sh = 0;
		const minW = Math.max(120, parseFloat(host.getAttribute("data-junction-resize-min-w") || "") || 120);
		const minH = Math.max(80, parseFloat(host.getAttribute("data-junction-resize-min-h") || "") || 80);
		const onDown = (ev) => {
			if (ev.button !== 0) return;
			if (ev.target !== handle && !handle.contains(ev.target)) return;
			resizing = true;
			sx = ev.clientX;
			sy = ev.clientY;
			sw = host.offsetWidth;
			sh = host.offsetHeight;
			handle.setPointerCapture(ev.pointerId);
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.start, {
				bubbles: true,
				detail: {
					host,
					width: sw,
					height: sh
				}
			}));
		};
		const onMove = (ev) => {
			if (!resizing) return;
			const nw = Math.max(minW, sw + (ev.clientX - sx));
			const nh = Math.max(minH, sh + (ev.clientY - sy));
			host.style.width = `${nw}px`;
			host.style.height = `${nh}px`;
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.move, {
				bubbles: true,
				detail: {
					host,
					width: nw,
					height: nh
				}
			}));
		};
		const onUp = (ev) => {
			if (!resizing) return;
			resizing = false;
			try {
				handle.releasePointerCapture(ev.pointerId);
			} catch {}
			host.dispatchEvent(new CustomEvent(JUNCTION_RESIZE_EVENTS.end, {
				bubbles: true,
				detail: {
					host,
					width: host.offsetWidth,
					height: host.offsetHeight
				}
			}));
		};
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointerdown", onDown));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointermove", onMove));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointerup", onUp));
		pushDisposable(host, "ui-junction-resize", addEvent(handle, "pointercancel", onUp));
		return this;
	}
	disconnect(wEl) {
		const host = wEl?.deref?.();
		if (host) runDisposers(host, "ui-junction-resize");
		return this;
	}
};
new JunctionSelectMixin();
new JunctionDragMixin();
new JunctionResizeMixin();
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/CtxMenu.ts
var itemClickHandle = (ev, ctxMenuDesc) => {
	const id = Q(`[data-id]`, ev?.target, 0, "parent")?.getAttribute?.("data-id");
	const item = ctxMenuDesc?.items?.find?.((I) => I?.some?.((I) => I?.id == id))?.find?.((I) => I?.id == id);
	(item?.action ?? ctxMenuDesc?.defaultAction)?.(ctxMenuDesc?.openedWith?.initiator, item, ctxMenuDesc?.openedWith?.event ?? ev);
	ctxMenuDesc?.openedWith?.close?.();
	const vr = getBoundVisibleRef(ctxMenuDesc?.openedWith?.element);
	if (vr != null) vr.value = false;
};
var visibleMap = /* @__PURE__ */ new WeakMap();
var registerCtxMenu = typeof document !== "undefined" && document?.documentElement ? addProxiedEvent(document.documentElement, "contextmenu", {
	capture: true,
	passive: false
}, {
	strategy: "closest",
	preventDefault: "handled",
	stopImmediatePropagation: "handled"
}) : (_el, _handler) => () => {};
var getBoundVisibleRef = (menuElement) => {
	if (menuElement == null) return null;
	return visibleMap?.getOrInsertComputed?.(menuElement, () => visibleRef(menuElement, false));
};
var bindMenuItemClickHandler = (menuElement, menuDesc) => {
	const handler = (ev) => {
		itemClickHandle(ev, menuDesc);
	};
	const listening = addEvent(menuElement, "click", handler, { composed: true });
	return () => listening?.();
};
var getGlobalContextMenu = (parent = document) => {
	let menu = Q("ui-modal[type=\"contextmenu\"]", parent);
	if (!menu) {
		menu = H`<ui-modal type="contextmenu"></ui-modal>`;
		(parent instanceof Document ? parent.body : parent).append(menu);
	}
	return menu;
};
var makeMenuHandler = (triggerElement, placement, ctxMenuDesc, menuElement) => {
	return (ev) => {
		let handled = false;
		const menu = menuElement || getGlobalContextMenu();
		const visibleRef = getBoundVisibleRef(menu);
		const initiator = ev?.target ?? triggerElement ?? document.elementFromPoint(ev?.clientX || 0, ev?.clientY || 0);
		const details = {
			event: ev,
			initiator,
			trigger: triggerElement,
			menu,
			ctxMenuDesc
		};
		ctxMenuDesc.context = details;
		if (ctxMenuDesc?.onBeforeOpen?.(details) === false) return handled;
		const builtItems = ctxMenuDesc?.buildItems?.(details);
		if (Array.isArray(builtItems) && builtItems.length) ctxMenuDesc.items = builtItems;
		if (visibleRef?.value && ev?.type !== "contextmenu") {
			visibleRef.value = false;
			ctxMenuDesc?.openedWith?.close?.();
			return handled;
		}
		if (initiator && visibleRef) {
			handled = true;
			menu.innerHTML = "";
			visibleRef.value = true;
			menu?.append?.(...ctxMenuDesc?.items?.map?.((section, sIdx) => {
				const items = section?.map?.((item) => H`<li data-id=${item?.id || ""}><ui-icon icon=${item?.icon || ""}></ui-icon><span>${item?.label || ""}</span></li>`);
				const separator = section?.length > 1 && sIdx !== (ctxMenuDesc?.items?.length || 0) - 1 ? H`<li class="ctx-menu-separator"></li>` : null;
				return [...items, separator];
			})?.flat?.()?.filter?.((E) => !!E) || []);
			const where = withInsetWithPointer?.(menu, placement?.(ev, initiator));
			const unbindClick = bindMenuItemClickHandler(menu, ctxMenuDesc);
			const untrigger = makeInterruptTrigger?.(menu, (e) => {
				const menuAny = menu;
				if (!(menu?.contains?.(e?.target ?? null) || e?.target == (menuAny?.element ?? menuAny)) || !e?.target) {
					ctxMenuDesc?.openedWith?.close?.();
					const vr = getBoundVisibleRef(menu);
					if (vr != null) vr.value = false;
				}
			}, [
				"click",
				"pointerdown",
				"scroll"
			]);
			const unmenuCtx = registerCtxMenu(menu, () => true);
			ctxMenuDesc.openedWith = {
				initiator,
				element: menu,
				event: ev,
				context: ctxMenuDesc?.context,
				close() {
					visibleRef.value = false;
					ctxMenuDesc.openedWith = null;
					unbindClick?.();
					where?.();
					untrigger?.();
					unmenuCtx?.();
					if (ctxMenuDesc._backUnreg) {
						ctxMenuDesc._backUnreg();
						ctxMenuDesc._backUnreg = null;
					}
				}
			};
			if (!ctxMenuDesc._backUnreg && visibleRef) ctxMenuDesc._backUnreg = registerContextMenu(menu, visibleRef, () => {
				ctxMenuDesc?.openedWith?.close?.();
			});
		}
		return handled;
	};
};
var ctxMenuTrigger = (triggerElement, ctxMenuDesc, menuElement) => {
	const evHandler = makeMenuHandler(triggerElement, (ev) => [
		ev?.clientX,
		ev?.clientY,
		200
	], ctxMenuDesc, menuElement);
	const unbindConnected = bindWhileConnected(triggerElement, () => {
		return registerCtxMenu(triggerElement, evHandler);
	});
	return () => {
		unbindConnected?.();
	};
};
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/Clipboard.ts
/**
* Standalone Clipboard API
* Works independently in any context: PWA, Chrome Extension, service worker, vanilla JS
* Provides unified clipboard operations with fallbacks
*/
var CLIPBOARD_CHANNEL = "rs-clipboard";
/** Beyond this, legacy execCommand + textarea.select() can freeze the tab for seconds. */
var CLIPBOARD_LEGACY_MAX_CHARS = 256e3;
/** Hard cap — clipboard APIs and string work degrade badly above this. */
var CLIPBOARD_TEXT_MAX_CHARS = 2e6;
/** Failsafe if the browser never settles clipboard read/write. */
var CLIPBOARD_OPERATION_TIMEOUT_MS = 12e3;
var scheduleClipboardFrame = (cb) => {
	if (typeof globalThis.requestAnimationFrame === "function") {
		globalThis.requestAnimationFrame(cb);
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => cb();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => cb(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => cb());
		return;
	}
	cb();
};
/**
* Convert data to string safely
*/
var toText = (data) => {
	if (data == null) return "";
	if (typeof data === "string") return data;
	try {
		return JSON.stringify(data, null, 2);
	} catch {
		return String(data);
	}
};
var raceClipboardWrite = (write, ms) => Promise.race([write.then(() => "ok").catch(() => "error"), new Promise((res) => {
	globalThis.setTimeout(() => res("timeout"), ms);
})]);
/**
* Write text to clipboard using modern API
*/
var writeText = async (text) => {
	const raw = toText(text);
	if (!raw.trim()) return {
		ok: false,
		error: "Empty content"
	};
	if (raw.length > CLIPBOARD_TEXT_MAX_CHARS) return {
		ok: false,
		error: "Content too large to copy safely"
	};
	const trimmed = raw.trim();
	return new Promise((resolve) => {
		scheduleClipboardFrame(() => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			const tryClipboardAPI = async () => {
				const tryWriteText = async () => {
					if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
					const outcome = await raceClipboardWrite(navigator.clipboard.writeText(trimmed), CLIPBOARD_OPERATION_TIMEOUT_MS);
					if (outcome === "ok") return true;
					if (outcome === "timeout") console.warn("[Clipboard] writeText timed out");
					return false;
				};
				try {
					if (await tryWriteText()) {
						resolve({
							ok: true,
							data: trimmed,
							method: "clipboard-api"
						});
						return;
					}
				} catch (err) {
					console.warn("[Clipboard] Direct write failed:", err);
				}
				if (trimmed.length > CLIPBOARD_LEGACY_MAX_CHARS) {
					resolve({
						ok: false,
						error: "Content too large for fallback copy"
					});
					return;
				}
				try {
					if (typeof document !== "undefined") {
						const textarea = document.createElement("textarea");
						textarea.value = trimmed;
						textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
						document.body.appendChild(textarea);
						textarea.select();
						textarea.remove();
					}
				} catch (err) {
					console.warn("[Clipboard] Legacy execCommand failed:", err);
				}
				resolve({
					ok: false,
					error: "All clipboard methods failed"
				});
			};
			tryClipboardAPI();
		});
	});
};
/**
* Write HTML content to clipboard (with text fallback)
*/
var writeHTML = async (html, plainText) => {
	const htmlContent = html.trim();
	const textContent = (plainText ?? htmlContent).trim();
	if (!htmlContent) return {
		ok: false,
		error: "Empty content"
	};
	return new Promise((resolve) => {
		scheduleClipboardFrame(() => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			const tryHTMLClipboard = async () => {
				try {
					if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
						const htmlBlob = new Blob([htmlContent], { type: "text/html" });
						const textBlob = new Blob([textContent], { type: "text/plain" });
						await navigator.clipboard.write([new ClipboardItem({
							"text/html": htmlBlob,
							"text/plain": textBlob
						})]);
						return resolve({
							ok: true,
							data: htmlContent,
							method: "clipboard-api"
						});
					}
				} catch (err) {
					console.warn("[Clipboard] HTML write failed:", err);
				}
				resolve(await writeText(textContent));
			};
			tryHTMLClipboard();
		});
	});
};
/**
* Write image to clipboard
*/
var writeImage = async (blob) => {
	return new Promise((resolve) => {
		scheduleClipboardFrame(async () => {
			if (typeof document !== "undefined" && document.hasFocus && !document.hasFocus()) globalThis?.focus?.();
			try {
				let imageBlob;
				if (typeof blob === "string") if (blob.startsWith("data:")) imageBlob = await (await fetch(blob)).blob();
				else imageBlob = await (await fetch(blob)).blob();
				else imageBlob = blob;
				if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
					const pngBlob = imageBlob.type === "image/png" ? imageBlob : await convertToPng(imageBlob);
					await navigator.clipboard.write([new ClipboardItem({ [pngBlob.type]: pngBlob })]);
					resolve({
						ok: true,
						method: "clipboard-api"
					});
					return;
				}
			} catch (err) {
				console.warn("[Clipboard] Image write failed:", err);
			}
			resolve({
				ok: false,
				error: "Image clipboard not supported"
			});
		});
	});
};
/**
* Convert image blob to PNG
*/
var convertToPng = async (blob) => {
	return new Promise((resolve, reject) => {
		if (typeof document === "undefined") {
			reject(/* @__PURE__ */ new Error("No document context"));
			return;
		}
		const img = new Image();
		const url = URL.createObjectURL(blob);
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("Canvas context failed"));
				return;
			}
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((pngBlob) => {
				URL.revokeObjectURL(url);
				if (pngBlob) resolve(pngBlob);
				else reject(/* @__PURE__ */ new Error("PNG conversion failed"));
			}, "image/png");
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Image load failed"));
		};
		img.src = url;
	});
};
/**
* Unified copy function with automatic type detection
*/
var copy = async (data, options = {}) => {
	const { type, showFeedback = false, silentOnError = false } = options;
	return new Promise((resolve) => {
		scheduleClipboardFrame(async () => {
			let result;
			if (data instanceof Blob) if (data.type.startsWith("image/")) result = await writeImage(data);
			else result = await writeText(await data.text());
			else if (type === "html" || typeof data === "string" && data.trim().startsWith("<")) result = await writeHTML(String(data));
			else if (type === "image") result = await writeImage(data);
			else result = await writeText(toText(data));
			if (showFeedback && (result.ok || !silentOnError)) broadcastClipboardFeedback(result);
			resolve(result);
		});
	});
};
/**
* Broadcast clipboard feedback for toast display
*/
var broadcastClipboardFeedback = (result) => {
	try {
		const channel = new BroadcastChannel("rs-toast");
		channel.postMessage({
			type: "show-toast",
			options: {
				message: result.ok ? "Copied to clipboard" : result.error || "Copy failed",
				kind: result.ok ? "success" : "error",
				duration: 2e3
			}
		});
		channel.close();
	} catch (e) {
		console.warn("[Clipboard] Feedback broadcast failed:", e);
	}
};
/** One logical listener for rs-clipboard — multiple initClipboardReceiver calls must not stack handlers (duplicate copy() freezes UI). */
var _clipboardBroadcastChannel = null;
var _clipboardBroadcastRefCount = 0;
var _clipboardBroadcastHandler = null;
/** Serialize SW/client broadcast copies so overlapping clipboard API work does not wedge the main thread. */
var _clipboardBroadcastQueue = Promise.resolve();
/**
* Listen for clipboard operation requests
*/
var listenForClipboardRequests = () => {
	if (typeof BroadcastChannel === "undefined") return () => {};
	if (_clipboardBroadcastRefCount === 0) {
		const channel = new BroadcastChannel(CLIPBOARD_CHANNEL);
		const handler = (event) => {
			if (event.data?.type !== "copy") return;
			const opts = event.data.options || {};
			const data = event.data.data;
			_clipboardBroadcastQueue = _clipboardBroadcastQueue.then(async () => {
				try {
					await copy(data, {
						...opts,
						showFeedback: opts.showFeedback !== false,
						silentOnError: opts.silentOnError === true
					});
				} catch (err) {
					console.warn("[Clipboard] Broadcast copy failed:", err);
				}
			});
		};
		channel.addEventListener("message", handler);
		_clipboardBroadcastChannel = channel;
		_clipboardBroadcastHandler = handler;
	}
	_clipboardBroadcastRefCount++;
	return () => {
		_clipboardBroadcastRefCount--;
		if (_clipboardBroadcastRefCount <= 0) {
			const ch = _clipboardBroadcastChannel;
			const h = _clipboardBroadcastHandler;
			if (ch && h) {
				ch.removeEventListener("message", h);
				ch.close();
			}
			_clipboardBroadcastChannel = null;
			_clipboardBroadcastHandler = null;
			_clipboardBroadcastRefCount = 0;
		}
	};
};
/**
* Initialize clipboard listener for receiving copy requests
*/
var initClipboardReceiver = () => {
	return listenForClipboardRequests();
};
var collectProviders = (ev, action) => {
	const providers = /* @__PURE__ */ new Set();
	let el = ev?.target || document.activeElement || document.body;
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el.isContentEditable) return [];
	let current = el;
	while (current) {
		if (typeof current[action] === "function") providers.add(current);
		if (current.operativeInstance && typeof current.operativeInstance[action] === "function") providers.add(current.operativeInstance);
		if (current.shadowRoot && current.shadowRoot.host) current = current.shadowRoot.host;
		else current = current.parentElement || current.getRootNode()?.host;
	}
	if (ev.currentTarget instanceof Node || typeof document !== "undefined") {
		const root = ev.currentTarget instanceof Node ? ev.currentTarget instanceof Document ? ev.currentTarget.body : ev.currentTarget : document.body;
		if (root) {
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode(node) {
				if (typeof node[action] === "function" || node.operativeInstance && typeof node.operativeInstance[action] === "function") return NodeFilter.FILTER_ACCEPT;
				return NodeFilter.FILTER_SKIP;
			} });
			while (walker.nextNode()) {
				const node = walker.currentNode;
				if (typeof node[action] === "function") providers.add(node);
				if (node.operativeInstance && typeof node.operativeInstance[action] === "function") providers.add(node.operativeInstance);
			}
		}
	}
	return Array.from(providers);
};
var handleClipboardEvent = (ev, type) => {
	const providers = collectProviders(ev, type);
	for (const provider of providers) provider[type]?.(ev);
};
var initialized = false;
var initGlobalClipboard = () => {
	if (typeof window === "undefined" || initialized) return;
	initialized = true;
	lazyAddEventListener(window, "copy", (ev) => handleClipboardEvent(ev, "onCopy"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "cut", (ev) => handleClipboardEvent(ev, "onCut"), {
		capture: false,
		passive: true
	});
	lazyAddEventListener(window, "paste", (ev) => handleClipboardEvent(ev, "onPaste"), {
		capture: false,
		passive: false
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/DesktopStateStorage.ts
/**
* Versioned JSON persistence for the orient-layer speed dial / desktop grid.
* - Main key: canonical layout + items
* - Draft key: debounced snapshot while dragging (crash recovery if main never flushed)
*/
var DESKTOP_MAIN_KEY = "cw-oriented-desktop-layout-v1";
`${DESKTOP_MAIN_KEY}`;
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/HistoryManager.ts
var HistoryManager_exports = /* @__PURE__ */ __exportAll({
	HistoryManager: () => HistoryManager,
	createHistoryManager: () => createHistoryManager
});
var HistoryManager = class {
	storageKey;
	maxEntries;
	autoSave;
	entries = [];
	constructor(options = {}) {
		this.storageKey = options.storageKey || "rs-basic-history";
		this.maxEntries = options.maxEntries || 100;
		this.autoSave = options.autoSave !== false;
		this.loadHistory();
	}
	/**
	* Add a new history entry
	*/
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			ts: Date.now()
		};
		this.entries.unshift(fullEntry);
		if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
		if (this.autoSave) this.saveHistory();
		return fullEntry;
	}
	/**
	* Get all history entries
	*/
	getAllEntries() {
		return [...this.entries];
	}
	/**
	* Get recent entries (last N)
	*/
	getRecentEntries(limit = 10) {
		return this.entries.slice(0, limit);
	}
	/**
	* Get entry by ID
	*/
	getEntryById(id) {
		return this.entries.find((entry) => entry.id === id);
	}
	/**
	* Remove entry by ID
	*/
	removeEntry(id) {
		const index = this.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.entries.splice(index, 1);
		if (this.autoSave) this.saveHistory();
		return true;
	}
	/**
	* Clear all history
	*/
	clearHistory() {
		this.entries = [];
		if (this.autoSave) this.saveHistory();
	}
	/**
	* Search history entries
	*/
	searchEntries(query) {
		const lowercaseQuery = query.toLowerCase();
		return this.entries.filter((entry) => entry.prompt.toLowerCase().includes(lowercaseQuery) || entry.before.toLowerCase().includes(lowercaseQuery) || entry.after.toLowerCase().includes(lowercaseQuery));
	}
	/**
	* Get successful entries only
	*/
	getSuccessfulEntries() {
		return this.entries.filter((entry) => entry.ok);
	}
	/**
	* Get failed entries only
	*/
	getFailedEntries() {
		return this.entries.filter((entry) => !entry.ok);
	}
	/**
	* Get statistics
	*/
	getStatistics() {
		const total = this.entries.length;
		const successful = this.entries.filter((e) => e.ok).length;
		const failed = total - successful;
		const avgDuration = this.entries.filter((e) => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, this.entries.filter((e) => e.duration).length);
		return {
			total,
			successful,
			failed,
			successRate: total > 0 ? successful / total * 100 : 0,
			averageDuration: avgDuration || 0
		};
	}
	/**
	* Export history as JSON
	*/
	exportHistory() {
		return JSON.stringify(this.entries, null, 2);
	}
	/**
	* Import history from JSON
	*/
	importHistory(jsonData) {
		try {
			const importedEntries = JSON.parse(jsonData);
			if (!Array.isArray(importedEntries)) throw new Error("Invalid history data: not an array");
			for (const entry of importedEntries) if (typeof entry.ts !== "number" || typeof entry.prompt !== "string") throw new Error("Invalid history entry: missing required fields");
			const entriesWithIds = importedEntries.map((entry) => ({
				...entry,
				id: entry.id || this.generateId()
			}));
			const existingIds = new Set(this.entries.map((e) => e.id));
			const newEntries = entriesWithIds.filter((e) => !existingIds.has(e.id));
			this.entries.unshift(...newEntries);
			if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
			if (this.autoSave) this.saveHistory();
			return true;
		} catch (error) {
			console.error("Failed to import history:", error);
			return false;
		}
	}
	/**
	* Create history view component
	*/
	createHistoryView(onEntrySelect) {
		const container = H`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${this.entries.length === 0 ? H`<div class="empty-history">No history yet. Start processing some content!</div>` : this.entries.map((entry) => this.createHistoryItem(entry, onEntrySelect))}
      </div>
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "clear-history") {
				if (confirm("Are you sure you want to clear all history?")) {
					this.clearHistory();
					const newContainer = this.createHistoryView(onEntrySelect);
					container.replaceWith(newContainer);
				}
			} else if (action === "export-history") this.exportHistoryToFile();
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	/**
	* Create compact history display (for recent activity)
	*/
	createRecentHistoryView(limit = 3, onEntrySelect) {
		const recentEntries = this.getRecentEntries(limit);
		const container = H`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${recentEntries.length === 0 ? H`<div class="no-recent">No recent activity</div>` : recentEntries.map((entry) => this.createCompactHistoryItem(entry, onEntrySelect))}
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "view-full-history") console.log("View full history requested");
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	createStatsDisplay() {
		const stats = this.getStatistics();
		return H`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${stats.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${stats.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`;
	}
	createHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const duration = entry.duration ? ` (${(entry.duration / 1e3).toFixed(1)}s)` : "";
		return H`<div class="history-item ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">
          ${entry.ok ? "✓" : "✗"}
        </span>
        <span class="history-time">${time}${duration}</span>
        ${entry.model ? H`<span class="history-model">${entry.model}</span>` : ""}
      </div>

      <div class="history-content">
        <div class="history-prompt">${entry.prompt}</div>
        <div class="history-input">Input: ${entry.before}</div>
        ${entry.error ? H`<div class="history-error">Error: ${entry.error}</div>` : ""}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use Prompt</button>
        ${entry.ok ? H`<button class="btn small" data-action="view-result" data-entry-id="${entry.id}">View Result</button>` : ""}
      </div>
    </div>`;
	}
	createCompactHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const shortPrompt = entry.prompt.length > 40 ? entry.prompt.substring(0, 40) + "..." : entry.prompt;
		return H`<div class="history-item-compact ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">${entry.ok ? "✓" : "✗"}</span>
        <span class="history-prompt">${shortPrompt}</span>
      </div>
      <div class="history-time">${time}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use</button>
    </div>`;
	}
	exportHistoryToFile() {
		const data = this.exportHistory();
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ai-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	generateId() {
		return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) this.entries = JSON.parse(stored).map((entry) => ({
				...entry,
				id: entry.id || this.generateId()
			}));
		} catch (error) {
			console.warn("Failed to load history from storage:", error);
			this.entries = [];
		}
	}
	saveHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
		} catch (error) {
			console.warn("Failed to save history to storage:", error);
		}
	}
};
/**
* Utility function to create a history manager
*/
function createHistoryManager(options) {
	return new HistoryManager(options);
}
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/UIState.ts
var mapEntriesFrom = (source) => {
	if (!source) return [];
	if (source instanceof Map) return Array.from(source.entries());
	if (Array.isArray(source)) return source.map((value, index) => {
		if (Array.isArray(value) && value.length === 2) return value;
		return [index, value];
	});
	if (source instanceof Set) return Array.from(source.values()).map((value, index) => [index, value]);
	if (typeof source === "object") return Object.entries(source);
	return [];
};
var ownProp = Object.prototype.hasOwnProperty;
var isPlainObject$1 = (value) => {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) return false;
	return !(value instanceof Map) && !(value instanceof Set);
};
var identityOf = (value, fallback) => {
	if (value && typeof value === "object") {
		if ("id" in value && value.id != null) return value.id;
		if ("key" in value && value.key != null) return value.key;
	}
	return fallback;
};
var resolveEntryKey = (entryKey, value, fallback) => {
	if (entryKey != null) return entryKey;
	const identity = identityOf(value);
	if (identity != null) return identity;
	return fallback;
};
var mergePlainObject = (target, source) => {
	for (const key of Object.keys(source)) {
		const nextValue = source[key];
		const currentValue = target[key];
		if (isPlainObject$1(currentValue) && isPlainObject$1(nextValue)) {
			mergePlainObject(currentValue, nextValue);
			continue;
		}
		if (currentValue !== nextValue) target[key] = nextValue;
	}
	return target;
};
var mergeValue = (target, source) => {
	if (target === source) return target;
	const sourceIsObject = source && typeof source === "object";
	if (target instanceof Map && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (target instanceof Set && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (Array.isArray(target) && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (isPlainObject$1(target) && isPlainObject$1(source)) {
		mergePlainObject(target, source);
		return target;
	}
	return source;
};
var reloadInto = (items, map) => {
	if (!items || !map) return items;
	const entries = mapEntriesFrom(map);
	if (!entries.length) return items;
	if (items instanceof Set) {
		const existingByKey = /* @__PURE__ */ new Map();
		for (const value of items.values()) {
			const key = identityOf(value);
			if (key != null) existingByKey.set(key, value);
		}
		const usedKeys = /* @__PURE__ */ new Set();
		for (const [entryKey, incoming] of entries) {
			const key = resolveEntryKey(entryKey, incoming);
			if (key == null) {
				if (!items.has(incoming)) items.add(incoming);
				continue;
			}
			const hasCurrent = existingByKey.has(key);
			const current = hasCurrent ? existingByKey.get(key) : void 0;
			if (hasCurrent) {
				const merged = mergeValue(current, incoming);
				if (merged !== current) {
					items.delete(current);
					items.add(merged);
					existingByKey.set(key, merged);
				}
			} else {
				items.add(incoming);
				existingByKey.set(key, incoming);
			}
			usedKeys.add(key);
		}
		if (usedKeys.size) for (const value of Array.from(items.values())) {
			const key = identityOf(value);
			if (key != null && !usedKeys.has(key)) items.delete(value);
		}
		return items;
	}
	if (items instanceof Map) {
		const nextMap = new Map(entries);
		for (const key of Array.from(items.keys())) if (!nextMap.has(key)) items.delete(key);
		for (const [key, incoming] of nextMap.entries()) if (items.has(key)) {
			const current = items.get(key);
			const merged = mergeValue(current, incoming);
			if (merged !== current) items.set(key, merged);
		} else items.set(key, incoming);
		return items;
	}
	if (Array.isArray(items)) {
		const availableIndexes = /* @__PURE__ */ new Set();
		const existingByKey = /* @__PURE__ */ new Map();
		const existingByObject = /* @__PURE__ */ new WeakMap();
		items.forEach((value, index) => {
			availableIndexes.add(index);
			const key = identityOf(value, index);
			if (key != null && !existingByKey.has(key)) existingByKey.set(key, index);
			if (value && typeof value === "object") existingByObject.set(value, index);
		});
		const takeIndex = (index) => {
			if (index == null) return void 0;
			if (!availableIndexes.has(index)) return void 0;
			availableIndexes.delete(index);
			return index;
		};
		const takeNextAvailable = () => {
			const iterator = availableIndexes.values().next();
			if (iterator.done) return void 0;
			const index = iterator.value;
			availableIndexes.delete(index);
			return index;
		};
		let writeIndex = 0;
		let fallbackIndex = 0;
		for (const [entryKey, incoming] of entries) {
			const key = resolveEntryKey(entryKey, incoming, fallbackIndex++);
			let claimedIndex = takeIndex(key != null ? existingByKey.get(key) : void 0);
			if (claimedIndex == null && incoming && typeof incoming === "object") claimedIndex = takeIndex(existingByObject.get(incoming));
			if (claimedIndex == null) claimedIndex = takeNextAvailable();
			const current = claimedIndex != null ? items[claimedIndex] : void 0;
			const merged = current !== void 0 ? mergeValue(current, incoming) : incoming;
			if (writeIndex < items.length) {
				if (items[writeIndex] !== merged) items[writeIndex] = merged;
			} else items.push(merged);
			writeIndex++;
		}
		while (items.length > writeIndex) items.pop();
		return items;
	}
	if (typeof items === "object") {
		const nextKeys = new Set(entries.map(([key]) => String(key)));
		for (const prop of Object.keys(items)) if (!nextKeys.has(prop)) delete items[prop];
		for (const [entryKey, incoming] of entries) {
			const prop = String(entryKey);
			if (ownProp.call(items, prop)) {
				const current = items[prop];
				const merged = mergeValue(current, incoming);
				if (merged !== current) items[prop] = merged;
			} else items[prop] = incoming;
		}
		return items;
	}
	return items;
};
var mergeByKey = (items, key = "id") => {
	if (items && (items instanceof Set || Array.isArray(items))) {
		const entries = Array.from(items?.values?.() || []).map((I) => [I?.[key], I]).filter((I) => I?.[0] != null);
		return reloadInto(items, new Map(entries));
	}
	return items;
};
var hasChromeStorage = () => typeof chrome !== "undefined" && chrome?.storage?.local;
var makeUIState = (storageKey, initialCb, unpackCb, packCb = (items) => safe(items), key = "id", saveInterval = 6e3) => {
	let state = null;
	state = mergeByKey(initialCb?.() || {}, key);
	if (hasChromeStorage()) chrome.storage.local.get([storageKey], (result) => {
		if (result[storageKey]) {
			const unpacked = unpackCb(JSOX.parse(result?.[storageKey] || "{}"));
			reloadInto(state, unpacked);
		}
	});
	else if (typeof localStorage !== "undefined") if (localStorage.getItem(storageKey)) {
		state = unpackCb(JSOX.parse(localStorage.getItem(storageKey) || "{}"));
		mergeByKey(state, key);
	} else localStorage.setItem(storageKey, JSOX.stringify(packCb(state)));
	const saveInStorage = (ev) => {
		const packed = JSOX.stringify(packCb(mergeByKey(state, key)));
		if (hasChromeStorage()) chrome.storage.local.set({ [storageKey]: packed });
		else if (typeof localStorage !== "undefined") localStorage.setItem(storageKey, packed);
	};
	setIdleInterval$1(saveInStorage, saveInterval);
	if (typeof window !== "undefined" && typeof document !== "undefined") {
		const listening = [
			addEvent(document, "visibilitychange", (ev) => {
				if (document.visibilityState === "hidden") saveInStorage(ev);
			}),
			addEvent(window, "beforeunload", (ev) => saveInStorage(ev)),
			addEvent(window, "pagehide", (ev) => saveInStorage(ev)),
			addEvent(window, "storage", (ev) => {
				if (ev.storageArea == localStorage && ev.key == storageKey) reloadInto(state, unpackCb(JSOX.parse(ev?.newValue || JSOX.stringify(packCb(mergeByKey(state, key))))));
			})
		];
		addToCallChain(state, Symbol.dispose, () => listening.forEach((ub) => ub?.()));
	}
	if (hasChromeStorage()) {
		const listener = (changes, area) => {
			if (area === "local" && changes[storageKey]) {
				const newValue = changes[storageKey].newValue;
				if (newValue) reloadInto(state, unpackCb(JSOX.parse(newValue)));
			}
		};
		chrome.storage.onChanged.addListener(listener);
	}
	if (state && typeof state === "object") try {
		Object.defineProperty(state, "$save", {
			value: saveInStorage,
			configurable: true,
			enumerable: false,
			writable: true
		});
	} catch (e) {
		state.$save = saveInStorage;
	}
	return state;
};
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/VoiceInput.ts
var VoiceInputManager = class {
	recognition = null;
	isListening = false;
	options;
	constructor(options = {}) {
		this.options = {
			language: "en-US",
			continuous: false,
			interimResults: false,
			maxAlternatives: 1,
			...options
		};
		this.initializeRecognition();
	}
	/**
	* Initialize speech recognition if supported
	*/
	initializeRecognition() {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) {
			console.warn("Speech recognition not supported in this browser");
			return;
		}
		this.recognition = new SpeechRecognition();
		this.recognition.lang = this.options.language;
		this.recognition.continuous = this.options.continuous;
		this.recognition.interimResults = this.options.interimResults;
		this.recognition.maxAlternatives = this.options.maxAlternatives;
	}
	/**
	* Check if speech recognition is supported
	*/
	isSupported() {
		return this.recognition !== null;
	}
	/**
	* Start listening for speech input
	*/
	startListening() {
		return new Promise((resolve, reject) => {
			if (!this.recognition) {
				reject(/* @__PURE__ */ new Error("Speech recognition not supported"));
				return;
			}
			if (this.isListening) {
				reject(/* @__PURE__ */ new Error("Already listening"));
				return;
			}
			let done = false;
			const finish = (value) => {
				if (done) return;
				done = true;
				this.isListening = false;
				try {
					this.recognition.stop();
				} catch {}
				if (value) resolve(value);
				else reject(/* @__PURE__ */ new Error("No speech detected"));
			};
			this.recognition.onresult = (e) => {
				finish(String(e?.results?.[0]?.[0]?.transcript || "").trim() || null);
			};
			this.recognition.onerror = () => finish(null);
			this.recognition.onend = () => finish(null);
			try {
				this.isListening = true;
				this.recognition.start();
			} catch (error) {
				this.isListening = false;
				reject(error);
			}
		});
	}
	/**
	* Stop listening
	*/
	stopListening() {
		if (this.recognition && this.isListening) {
			try {
				this.recognition.stop();
			} catch {}
			this.isListening = false;
		}
	}
	/**
	* Check if currently listening
	*/
	getIsListening() {
		return this.isListening;
	}
	/**
	* Set recognition language
	*/
	setLanguage(language) {
		this.options.language = language;
		if (this.recognition) this.recognition.lang = language;
	}
	/**
	* Get available languages (limited support in browsers)
	*/
	getAvailableLanguages() {
		return [
			"en-US",
			"en-GB",
			"en-AU",
			"en-CA",
			"en-IN",
			"en-IE",
			"es-ES",
			"es-US",
			"es-MX",
			"es-AR",
			"es-CO",
			"es-CL",
			"fr-FR",
			"fr-CA",
			"de-DE",
			"it-IT",
			"pt-BR",
			"pt-PT",
			"ru-RU",
			"ja-JP",
			"ko-KR",
			"zh-CN",
			"zh-TW",
			"ar-SA",
			"hi-IN",
			"nl-NL",
			"sv-SE",
			"no-NO",
			"da-DK",
			"fi-FI"
		];
	}
	/**
	* Clean up resources
	*/
	destroy() {
		this.stopListening();
		this.recognition = null;
	}
};
/**
* Get speech prompt with timeout
*/
async function getSpeechPrompt(options = {}) {
	const { timeout = 1e4, ...voiceOptions } = options;
	const voiceManager = new VoiceInputManager(voiceOptions);
	if (!voiceManager.isSupported()) {
		console.warn("Speech recognition not supported");
		return null;
	}
	try {
		const speechPromise = voiceManager.startListening();
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				voiceManager.stopListening();
				reject(/* @__PURE__ */ new Error("Speech recognition timeout"));
			}, timeout);
		});
		return await Promise.race([speechPromise, timeoutPromise]);
	} catch (error) {
		console.warn("Speech recognition failed:", error);
		return null;
	} finally {
		voiceManager.destroy();
	}
}
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/ScrollBar.ts
makeRAFCycle();
try {
	CSS.registerProperty({
		name: "--percent-x",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--percent-y",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--scroll-coef",
		syntax: "<number>",
		inherits: true,
		initialValue: "1"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--determinant",
		syntax: "<number>",
		inherits: true,
		initialValue: "0"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--scroll-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--content-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--clamped-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--thumb-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--max-offset",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
try {
	CSS.registerProperty({
		name: "--max-size",
		syntax: "<length-percentage>",
		inherits: true,
		initialValue: "0px"
	});
} catch (e) {}
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/TemplateManager.ts
var TemplateManager = class {
	storageKey;
	templates = [];
	defaultTemplates;
	constructor(options = {}) {
		this.storageKey = options.storageKey || "rs-prompt-templates";
		this.defaultTemplates = options.defaultTemplates || this.getDefaultTemplates();
		this.loadTemplates();
	}
	/**
	* Get all templates
	*/
	getAllTemplates() {
		return [...this.templates];
	}
	/**
	* Get template by ID
	*/
	getTemplateById(id) {
		return this.templates.find((t) => t.id === id);
	}
	/**
	* Add a new template
	*/
	addTemplate(template) {
		const newTemplate = {
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		};
		this.templates.push(newTemplate);
		this.saveTemplates();
		return newTemplate;
	}
	/**
	* Update an existing template
	*/
	updateTemplate(id, updates) {
		const index = this.templates.findIndex((t) => t.id === id);
		if (index === -1) return false;
		this.templates[index] = {
			...this.templates[index],
			...updates,
			updatedAt: Date.now()
		};
		this.saveTemplates();
		return true;
	}
	/**
	* Remove a template
	*/
	removeTemplate(id) {
		const index = this.templates.findIndex((t) => t.id === id);
		if (index === -1) return false;
		this.templates.splice(index, 1);
		this.saveTemplates();
		return true;
	}
	/**
	* Increment usage count for a template
	*/
	incrementUsageCount(id) {
		const template = this.templates.find((t) => t.id === id);
		if (template) {
			template.usageCount = (template.usageCount || 0) + 1;
			this.saveTemplates();
		}
	}
	/**
	* Search templates by name or content
	*/
	searchTemplates(query) {
		const lowercaseQuery = query.toLowerCase();
		return this.templates.filter((template) => template.name.toLowerCase().includes(lowercaseQuery) || template.prompt.toLowerCase().includes(lowercaseQuery) || template.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)));
	}
	/**
	* Get templates by category
	*/
	getTemplatesByCategory(category) {
		return this.templates.filter((template) => template.category === category);
	}
	/**
	* Get most used templates
	*/
	getMostUsedTemplates(limit = 5) {
		return this.templates.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, limit);
	}
	/**
	* Export templates as JSON
	*/
	exportTemplates() {
		return JSON.stringify(this.templates, null, 2);
	}
	/**
	* Import templates from JSON
	*/
	importTemplates(jsonData) {
		try {
			const importedTemplates = JSON.parse(jsonData);
			if (!Array.isArray(importedTemplates)) throw new Error("Invalid template data: not an array");
			for (const template of importedTemplates) if (!template.name || !template.prompt) throw new Error("Invalid template: missing name or prompt");
			const templatesWithIds = importedTemplates.map((template) => ({
				...template,
				id: this.generateId(),
				createdAt: template.createdAt || Date.now(),
				updatedAt: Date.now()
			}));
			this.templates.push(...templatesWithIds);
			this.saveTemplates();
			return true;
		} catch (error) {
			console.error("Failed to import templates:", error);
			return false;
		}
	}
	/**
	* Reset to default templates
	*/
	resetToDefaults() {
		this.templates = this.defaultTemplates.map((template) => ({
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		}));
		this.saveTemplates();
	}
	/**
	* Create template editor modal
	*/
	createTemplateEditor(container, onSave) {
		const modal = H`<div class="template-editor-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Prompt Templates</h3>
          </div>

          <div class="template-list">
            ${this.templates.map((template, index) => H`<div class="template-item">
                <div class="template-header">
                  <input type="text" class="template-name" value="${template.name}" data-index="${index}" placeholder="Template name">
                  <button class="btn small remove-template" data-index="${index}" title="Remove template">✕</button>
                </div>
                <textarea class="template-prompt" data-index="${index}" placeholder="Enter your prompt template...">${template.prompt}</textarea>
                <div class="template-meta">
                  ${template.usageCount ? H`<span class="usage-count">Used ${template.usageCount} times</span>` : ""}
                  ${template.category ? H`<span class="category">${template.category}</span>` : ""}
                </div>
              </div>`)}
          </div>

          <div class="modal-actions">
            <button class="btn" data-action="add-template">Add Template</button>
            <button class="btn" data-action="reset-defaults">Reset to Defaults</button>
            <button class="btn primary" data-action="save-templates">Save Changes</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;
		modal.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const index = target.getAttribute("data-index");
			if (action === "add-template") {
				this.addTemplate({
					name: "New Template",
					prompt: "Enter your prompt template here...",
					category: "Custom"
				});
				modal.remove();
				this.createTemplateEditor(container, onSave);
			} else if (action === "reset-defaults") {
				if (confirm("Are you sure you want to reset all templates to defaults? This will remove all custom templates.")) {
					this.resetToDefaults();
					modal.remove();
					this.createTemplateEditor(container, onSave);
				}
			} else if (action === "save-templates") {
				const nameInputs = modal.querySelectorAll(".template-name");
				const promptInputs = modal.querySelectorAll(".template-prompt");
				this.templates = Array.from(nameInputs).map((input, i) => {
					const index = parseInt(input.getAttribute("data-index") || "0");
					return {
						...this.templates[index],
						name: input.value.trim() || "Untitled Template",
						prompt: promptInputs[i].value.trim() || "Enter your prompt...",
						updatedAt: Date.now()
					};
				});
				this.saveTemplates();
				modal.remove();
				onSave?.();
			} else if (action === "close-editor") modal.remove();
			else if (target.classList.contains("remove-template") && index !== null) {
				const templateIndex = parseInt(index);
				const template = this.templates[templateIndex];
				if (confirm(`Remove template "${template.name}"?`)) {
					this.removeTemplate(template.id);
					modal.remove();
					this.createTemplateEditor(container, onSave);
				}
			}
		});
		container.append(modal);
	}
	/**
	* Create template selector dropdown
	*/
	createTemplateSelect(selectedPrompt) {
		const select = document.createElement("select");
		select.className = "template-select";
		const defaultOption = document.createElement("option");
		defaultOption.value = "";
		defaultOption.textContent = "Select Template...";
		select.append(defaultOption);
		this.templates.forEach((template) => {
			const option = document.createElement("option");
			option.value = template.prompt;
			option.textContent = template.name;
			if (template.category) option.textContent += ` (${template.category})`;
			select.append(option);
		});
		if (selectedPrompt) select.value = selectedPrompt;
		return select;
	}
	getDefaultTemplates() {
		return [].map((template) => ({
			...template,
			id: this.generateId(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			usageCount: 0
		}));
	}
	generateId() {
		return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadTemplates() {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) this.templates = JSON.parse(stored).map((template) => ({
				...template,
				id: template.id || this.generateId(),
				createdAt: template.createdAt || Date.now(),
				updatedAt: template.updatedAt || Date.now(),
				usageCount: template.usageCount || 0
			}));
			else this.resetToDefaults();
		} catch (error) {
			console.warn("Failed to load templates from storage:", error);
			this.resetToDefaults();
		}
	}
	saveTemplates() {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
		} catch (error) {
			console.warn("Failed to save templates to storage:", error);
		}
	}
};
/**
* Utility function to create a template manager
*/
function createTemplateManager(options) {
	return new TemplateManager(options);
}
//#endregion
//#region ../../modules/projects/lur.e/src/design/color/DynamicEngine.ts
var runWhenIdle = (cb, timeout = 100) => {
	if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(cb, { timeout });
	return setTimeout(() => cb({
		didTimeout: false,
		timeRemaining: () => 0
	}), 0);
};
var electronAPI = "electronBridge";
function extractAlpha(input) {
	if (typeof input !== "string") return null;
	let color = input.trim().toLowerCase();
	if (color === "transparent") return 0;
	if (color.startsWith("#")) {
		const hex = color;
		if (hex.length === 4) return 1;
		if (hex.length === 7) return 1;
		if (hex.length === 5) {
			const a = hex[4];
			const aa = a + a;
			return clamp(parseInt(aa, 16) / 255, 0, 1);
		}
		if (hex.length === 9) {
			const aa = hex.slice(7, 9);
			return clamp(parseInt(aa, 16) / 255, 0, 1);
		}
		return null;
	}
	const fnMatch = color.match(/^([a-z-]+)\((.*)\)$/i);
	if (!fnMatch) return null;
	fnMatch[1];
	const body = fnMatch[2].trim();
	{
		const slashIdx = body.lastIndexOf("/");
		if (slashIdx !== -1) {
			const a = parseAlphaComponent(body.slice(slashIdx + 1).trim());
			if (a != null) return clamp(a, 0, 1);
			return null;
		}
	}
	if (body.includes(",")) {
		const parts = body.split(",").map((s) => s.trim());
		if (parts.length >= 4) {
			const a = parseAlphaComponent(parts[3]);
			if (a != null) return clamp(a, 0, 1);
			return null;
		}
		return 1;
	}
	return 1;
}
function parseAlphaComponent(str) {
	if (!str) return null;
	if (str.endsWith("%")) {
		const n = parseFloat(str);
		if (Number.isNaN(n)) return null;
		return n / 100;
	}
	const n = parseFloat(str);
	if (Number.isNaN(n)) return null;
	return n;
}
function clamp(v, min, max) {
	return Math.min(max, Math.max(min, v));
}
var tacp = (color) => {
	if (!color || color == null) return 0;
	return (extractAlpha?.(color) || 0) > .1;
};
var setIdleInterval = (cb, timeout = 1e3, ...args) => {
	runWhenIdle(async () => {
		if (!cb || typeof cb != "function") return;
		while (true) {
			await Promise.try(cb, ...args);
			await new Promise((r) => setTimeout(r, timeout));
			await new Promise((r) => runWhenIdle(r, 100));
			await new Promise((r) => requestAnimationFrame(r));
		}
	}, 1e3);
};
/** Prefer real shell chrome (minimal nav / faint toolbar) for PWA title bar / WCO tint. */
var sampleShellToolbarBackgroundColor = () => {
	if (typeof document === "undefined") return null;
	try {
		const hosts = document.querySelectorAll("[data-shell]");
		for (const host of hosts) {
			const sr = host.shadowRoot;
			if (!sr) continue;
			const bar = sr.querySelector(".app-shell__nav, .app-shell__toolbar");
			if (!bar) continue;
			const bg = getComputedStyle(bar).backgroundColor;
			if (tacp(bg)) return bg;
		}
	} catch {}
	return null;
};
/** Under window-controls-overlay, sample inside env(titlebar-area-*) — not under OS control buttons. */
var sampleWcoTitlebarStripColor = () => {
	if (typeof document === "undefined") return null;
	if (!globalThis.matchMedia?.("(display-mode: window-controls-overlay)")?.matches) return null;
	const probe = document.createElement("div");
	probe.setAttribute("data-wco-theme-probe", "true");
	probe.style.cssText = [
		"position:fixed",
		"visibility:hidden",
		"pointer-events:none",
		"z-index:-2147483648",
		"left:env(titlebar-area-x,0px)",
		"top:env(titlebar-area-y,0px)",
		"width:env(titlebar-area-width,0px)",
		"height:env(titlebar-area-height,0px)"
	].join(";");
	document.documentElement.appendChild(probe);
	try {
		const r = probe.getBoundingClientRect();
		if (r.width < 1 || r.height < 1) return null;
		const c = pickBgColor(Math.floor(r.left + Math.min(40, r.width * .2)), Math.floor(r.top + r.height * .5));
		return tacp(c) ? c : null;
	} finally {
		probe.remove();
	}
};
var pickBgColor = (x, y, holder = null) => {
	const opaque = Array.from(document.elementsFromPoint(x, y))?.filter?.((el) => el instanceof HTMLElement && el != holder && (el?.dataset?.alpha != null ? parseFloat(el?.dataset?.alpha) > .01 : true) && el?.checkVisibility?.({
		contentVisibilityAuto: true,
		opacityProperty: true,
		visibilityProperty: true
	}) && el?.matches?.(":not([data-hidden])") && el?.style?.getPropertyValue("display") != "none").map((element) => {
		const computed = getComputedStyle?.(element);
		return {
			element,
			zIndex: parseInt(computed?.zIndex || "0", 10) || 0,
			color: computed?.backgroundColor || "transparent"
		};
	}).sort((a, b) => Math.sign(b.zIndex - a.zIndex)).filter(({ color }) => tacp(color));
	if (opaque?.[0]?.element instanceof HTMLElement) return opaque?.[0]?.color || "transparent";
	return "transparent";
};
var pickFromCenter = (holder) => {
	const box = holder?.getBoundingClientRect();
	if (box) {
		const Z = .5 * (fixedClientZoom?.() || 1);
		return pickBgColor(...[(box.left + box.right) * Z, (box.top + box.bottom) * Z], holder);
	}
};
var dynamicNativeFrame = (root = document.documentElement) => {
	let media = root?.querySelector?.("meta[data-theme-color]") ?? root?.querySelector?.("meta[name=\"theme-color\"]");
	if (!media && root == document.documentElement) {
		media = document.createElement("meta");
		media.setAttribute("name", "theme-color");
		media.setAttribute("data-theme-color", "");
		media.setAttribute("content", "transparent");
		document.head.appendChild(media);
	}
	const fromShell = sampleShellToolbarBackgroundColor();
	const fromWco = !fromShell ? sampleWcoTitlebarStripColor() : null;
	const fallbackX = Math.max(8, Math.floor(globalThis.innerWidth * .12));
	const picked = !fromShell && !fromWco ? pickBgColor(fallbackX, 20) : null;
	const color = fromShell || fromWco || (picked && tacp(picked) ? picked : null);
	if (color && color !== "transparent" && (media || window?.["electronBridge"]) && root == document.documentElement) media?.setAttribute?.("content", color);
};
var dynamicBgColors = (root = document.documentElement) => {
	root.querySelectorAll("body, body > *, body > * > *").forEach((target) => {
		if (target) pickFromCenter(target);
	});
};
var dynamicTheme = (ROOT = document.documentElement) => {
	const startedKey = "__LURE_DYNAMIC_THEME_STARTED__";
	if (globalThis?.[startedKey]) return;
	globalThis[startedKey] = true;
	matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({}) => dynamicBgColors(ROOT));
	const updater = () => {
		dynamicNativeFrame(ROOT);
		dynamicBgColors(ROOT);
	};
	addEvent(ROOT, "u2-appear", () => runWhenIdle(updater, 100));
	addEvent(ROOT, "u2-hidden", () => runWhenIdle(updater, 100));
	addEvent(ROOT, "u2-theme-change", () => runWhenIdle(updater, 100));
	addEvent(window, "load", () => runWhenIdle(updater, 100));
	addEvent(document, "visibilitychange", () => runWhenIdle(updater, 100));
	setIdleInterval(updater, 500);
};
//#endregion
//#region ../../modules/projects/lur.e/src/design/color/ThemeEngine.ts
var colorScheme = async () => {
	dynamicNativeFrame();
	dynamicBgColors();
};
/**
* Opt-in autostart only.
* This module is re-exported from `fest/lure` root, so unconditional side effects
* here can start a competing theme-color loop in host apps.
*/
var maybeStartThemeEngine = () => {
	if (typeof document === "undefined") return;
	if (globalThis?.__LURE_AUTO_THEME_ENGINE__ !== true) return;
	requestAnimationFrame(() => colorScheme?.());
	dynamicTheme?.();
};
maybeStartThemeEngine();
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/OPFS.uniform.worker.ts?worker
function WorkerWrapper(options) {
	return new Worker("" + new URL("../workers/opfs/OPFS.uniform.worker.js", import.meta.url).href, {
		type: "module",
		name: options?.name
	});
}
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/OPFS.ts
var workerChannel = null;
var isServiceWorker = typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope;
var SW_BRIDGE_CHANNEL_NAME = "opfs-sw-bridge-v1";
var observers = /* @__PURE__ */ new Map();
var workerInitPromise = null;
var swBridgeChannel = null;
var swBridgeRequestCounter = 0;
var ensureSwBridgeChannel = () => {
	if (!isServiceWorker) return null;
	if (swBridgeChannel) return swBridgeChannel;
	try {
		if (typeof BroadcastChannel === "undefined") return null;
		swBridgeChannel = new BroadcastChannel(SW_BRIDGE_CHANNEL_NAME);
		return swBridgeChannel;
	} catch {
		return null;
	}
};
var postViaSwBridge = (type, payload = {}, timeoutMs = 2500) => {
	const channel = ensureSwBridgeChannel();
	if (!channel) return Promise.reject(/* @__PURE__ */ new Error("SW OPFS bridge is unavailable"));
	const requestId = `sw-opfs-${Date.now()}-${++swBridgeRequestCounter}`;
	return new Promise((resolve, reject) => {
		let timeoutId = null;
		const onMessage = (event) => {
			const data = event?.data || {};
			if (!data || typeof data !== "object") return;
			if (data?.type !== "opfs-sw-response") return;
			if (String(data?.requestId || "") !== requestId) return;
			channel.removeEventListener("message", onMessage);
			if (timeoutId) clearTimeout(timeoutId);
			if (data?.ok) resolve(data?.result);
			else reject(new Error(String(data?.error || "Unknown bridge error")));
		};
		channel.addEventListener("message", onMessage);
		timeoutId = setTimeout(() => {
			channel.removeEventListener("message", onMessage);
			reject(/* @__PURE__ */ new Error("SW OPFS bridge timeout"));
		}, timeoutMs);
		channel.postMessage({
			type: "opfs-sw-request",
			requestId,
			action: type,
			payload
		});
	});
};
var ensureWorker = () => {
	if (workerInitPromise) return workerInitPromise;
	workerInitPromise = new Promise(async (resolve) => {
		if (typeof Worker !== "undefined" && !isServiceWorker) try {
			const baseChannel = await createWorkerChannel({
				name: "opfs-worker",
				script: WorkerWrapper
			});
			workerChannel = new QueuedWorkerChannel("opfs-worker", async () => baseChannel, {
				timeout: 3e4,
				retries: 3,
				batching: true,
				compression: false
			});
			resolve(workerChannel);
		} catch (e) {
			console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", e);
			workerChannel = null;
			resolve(null);
		}
		else {
			workerChannel = null;
			resolve(null);
		}
	});
	return workerInitPromise;
};
var directHandlers = {
	readDirectory: async ({ rootId, path, create }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			let current = root;
			for (const part of parts) current = await current.getDirectoryHandle(part, { create });
			const entries = [];
			for await (const [name, entry] of current.entries()) entries.push([name, entry]);
			return entries;
		} catch (e) {
			console.warn("Direct readDirectory error:", e);
			return [];
		}
	},
	readFile: async ({ rootId, path, type }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			const file = await (await dir.getFileHandle(filename, { create: false })).getFile();
			if (type === "text") return await file.text();
			if (type === "arrayBuffer") return await file.arrayBuffer();
			return file;
		} catch (e) {
			console.warn("Direct readFile error:", e);
			return null;
		}
	},
	writeFile: async ({ rootId, path, data }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const filename = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true });
			const writable = await (await dir.getFileHandle(filename, { create: true })).createWritable();
			await writable.write(data);
			await writable.close();
			return true;
		} catch (e) {
			console.warn("Direct writeFile error:", e);
			return false;
		}
	},
	remove: async ({ rootId, path, recursive }) => {
		try {
			const root = await navigator.storage.getDirectory();
			const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
			const name = parts.pop();
			let dir = root;
			for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
			await dir.removeEntry(name, { recursive });
			return true;
		} catch {
			return false;
		}
	},
	copy: async ({ from, to }) => {
		try {
			const copyRecursive = async (source, dest) => {
				if (source.kind === "directory") for await (const [name, entry] of source.entries()) if (entry.kind === "directory") await copyRecursive(entry, await dest.getDirectoryHandle(name, { create: true }));
				else {
					const file = await entry.getFile();
					const writable = await (await dest.getFileHandle(name, { create: true })).createWritable();
					await writable.write(file);
					await writable.close();
				}
				else {
					const file = await source.getFile();
					const writable = await dest.createWritable();
					await writable.write(file);
					await writable.close();
				}
			};
			await copyRecursive(from, to);
			return true;
		} catch (e) {
			console.warn("Direct copy error:", e);
			return false;
		}
	},
	observe: async () => false,
	unobserve: async () => true,
	mount: async () => true,
	unmount: async () => true
};
var post = (type, payload = {}, transfer = []) => {
	if (isServiceWorker && directHandlers[type]) return postViaSwBridge(type, payload).catch(() => directHandlers[type](payload));
	return new Promise(async (resolve, reject) => {
		try {
			const channel = await ensureWorker();
			if (!channel) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				return reject(/* @__PURE__ */ new Error("No worker channel available"));
			}
			let result;
			try {
				result = await channel.request(type, payload);
			} catch (requestError) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
				throw requestError;
			}
			if (result === false && (type === "writeFile" || type === "remove" || type === "copy")) {
				if (directHandlers[type]) return resolve(directHandlers[type](payload));
			}
			resolve(result);
		} catch (err) {
			if (directHandlers[type]) try {
				return resolve(directHandlers[type](payload));
			} catch (fallbackError) {
				return reject(fallbackError);
			}
			reject(err);
		}
	});
};
var getDir = (dest) => {
	if (typeof dest != "string") return dest;
	dest = dest?.trim?.() || dest;
	if (!dest?.endsWith?.("/")) dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest;
	const p1 = !dest?.trim()?.endsWith("/") ? dest + "/" : dest;
	return !p1?.startsWith("/") ? "/" + p1 : p1;
};
var generalFileImportDesc = {
	startIn: "documents",
	multiple: false,
	types: [{
		description: "files",
		accept: { "application/*": [
			".txt",
			".md",
			".html",
			".htm",
			".css",
			".js",
			".json",
			".csv",
			".xml",
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".svg",
			".ico",
			".mp3",
			".wav",
			".mp4",
			".webm",
			".pdf",
			".zip",
			".rar",
			".7z"
		] }
	}]
};
var mappedRoots = new Map([
	["/", async () => await navigator?.storage?.getDirectory?.()],
	["/user/", async () => await navigator?.storage?.getDirectory?.()],
	["/assets/", async () => {
		console.warn("Backend related API not implemented!");
		return null;
	}]
]);
var currentHandleMap = /* @__PURE__ */ new Map();
async function resolveRootHandle(rootHandle, relPath = "") {
	if (rootHandle == null || rootHandle == void 0 || rootHandle?.trim?.()?.length == 0) rootHandle = "/user/";
	const cleanId = typeof rootHandle == "string" ? rootHandle?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((p) => !!p?.trim?.())?.at?.(0) : null;
	if (cleanId) {
		if (typeof localStorage != "undefined" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(cleanId)) rootHandle = currentHandleMap?.get(cleanId);
		if (!rootHandle) rootHandle = await mappedRoots?.get?.(`/${cleanId}/`)?.() ?? await navigator.storage.getDirectory();
	}
	if (rootHandle instanceof FileSystemDirectoryHandle) return rootHandle;
	const normalizedPath = relPath?.trim?.() || "/";
	const pathForMatch = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
	let bestMatch = null;
	let bestMatchLength = 0;
	for (const [rootPath, rootResolver] of mappedRoots.entries()) if (pathForMatch.startsWith(rootPath) && rootPath.length > bestMatchLength) {
		bestMatch = rootResolver;
		bestMatchLength = rootPath.length;
	}
	try {
		return (bestMatch ? await bestMatch() : null) || await navigator?.storage?.getDirectory?.();
	} catch (error) {
		console.warn("Failed to resolve root handle, falling back to OPFS root:", error);
		return await navigator?.storage?.getDirectory?.();
	}
}
function normalizePath(basePath = "", relPath) {
	if (!relPath?.trim()) return basePath;
	const cleanRelPath = relPath.trim();
	if (cleanRelPath.startsWith("/")) return cleanRelPath;
	const baseParts = basePath.split("/").filter((p) => p?.trim());
	const relParts = cleanRelPath.split("/").filter((p) => p?.trim());
	for (const part of relParts) if (part === ".") continue;
	else if (part === "..") {
		if (baseParts.length > 0) baseParts.pop();
	} else baseParts.push(part);
	return "/" + baseParts.join("/");
}
async function resolvePath(rootHandle, relPath, basePath = "") {
	const normalizedRelPath = normalizePath(basePath, relPath);
	return {
		rootHandle: await resolveRootHandle(rootHandle, normalizedRelPath),
		resolvedPath: normalizedRelPath
	};
}
function handleError(logger, status, message) {
	logger?.(status, message);
	return null;
}
function defaultLogger(status, message) {
	console.trace(`[${status}] ${message}`);
}
function detectTypeByRelPath(relPath) {
	if (relPath?.trim()?.endsWith?.("/")) return "directory";
	return "file";
}
function getMimeTypeByFilename(filename) {
	return {
		"txt": "text/plain",
		"md": "text/markdown",
		"html": "text/html",
		"htm": "text/html",
		"css": "text/css",
		"js": "application/javascript",
		"json": "application/json",
		"csv": "text/csv",
		"xml": "application/xml",
		"jpg": "image/jpeg",
		"jpeg": "image/jpeg",
		"png": "image/png",
		"gif": "image/gif",
		"webp": "image/webp",
		"svg": "image/svg+xml",
		"ico": "image/x-icon",
		"mp3": "audio/mpeg",
		"wav": "audio/wav",
		"mp4": "video/mp4",
		"webm": "video/webm",
		"pdf": "application/pdf",
		"zip": "application/zip",
		"rar": "application/vnd.rar",
		"7z": "application/x-7z-compressed"
	}[filename?.split?.(".")?.pop?.()?.toLowerCase?.()] || "application/octet-stream";
}
var hasFileExtension = (path) => {
	return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
};
async function getDirectoryHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const parts = stripUserScopePrefix(resolvedPath).split("/").filter((p) => !!p?.trim?.());
		if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) parts?.pop?.();
		let dir = resolvedRoot;
		if (parts?.length > 0) for (const part of parts) {
			dir = await dir?.getDirectoryHandle?.(part, { create });
			if (!dir) break;
		}
		return dir;
	} catch (e) {
		return handleError(logger, "error", `getDirectoryHandle: ${e.message}`);
	}
}
async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
		const cleanPath = stripUserScopePrefix(resolvedPath);
		const parts = cleanPath.split("/").filter((d) => !!d?.trim?.());
		if (parts?.length == 0) return null;
		const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, "-") : "";
		const dirName = parts.length > 1 ? parts?.slice(0, -1)?.join?.("/")?.trim?.()?.replace?.(/\s+/g, "-") : "";
		if (cleanPath?.trim?.()?.endsWith?.("/")) return null;
		return (await getDirectoryHandle(resolvedRoot, dirName, {
			create,
			basePath
		}, logger))?.getFileHandle?.(filePath, { create });
	} catch (e) {
		return handleError(logger, "error", `getFileHandle: ${e.message}`);
	}
}
async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		if (detectTypeByRelPath(resolvedPath) == "directory") {
			const dir = await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ""), options, logger);
			if (dir) return {
				type: "directory",
				handle: dir
			};
		} else {
			const file = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
			if (file) return {
				type: "file",
				handle: file
			};
		}
		return null;
	} catch (e) {
		return handleError(logger, "error", `getHandler: ${e.message}`);
	}
}
var directoryCacheMap = /* @__PURE__ */ new Map();
function openDirectory(rootHandle, relPath, options = { create: false }, logger = defaultLogger) {
	let cacheKey = "";
	let localMapCache = observe(/* @__PURE__ */ new Map());
	const statePromise = (async () => {
		try {
			const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
			cacheKey = `${resolvedRootHandle?.name || "root"}:${resolvedPath}`;
			return {
				rootHandle: resolvedRootHandle,
				resolvedPath
			};
		} catch {
			return {
				rootHandle: null,
				resolvedPath: ""
			};
		}
	})().then(async ({ rootHandle, resolvedPath }) => {
		if (!resolvedPath) return null;
		const existing = directoryCacheMap.get(cacheKey);
		if (existing) {
			existing.refCount++;
			localMapCache = existing.mapCache;
			return existing;
		}
		const mapCache = observe(/* @__PURE__ */ new Map());
		localMapCache = mapCache;
		const observationId = UUIDv4();
		const dirHandlePromise = getDirectoryHandle(rootHandle, resolvedPath, options, logger);
		const updateCache = async () => {
			const entries = await post("readDirectory", {
				rootId: "",
				path: stripUserScopePrefix(resolvedPath),
				create: options.create
			}, rootHandle ? [rootHandle] : []);
			if (!entries) return mapCache;
			const entryMap = new Map(entries);
			for (const key of mapCache.keys()) if (!entryMap.has(key)) mapCache.delete(key);
			for (const [key, handle] of entryMap) if (!mapCache.has(key)) mapCache.set(key, handle);
			return mapCache;
		};
		const cleanup = () => {
			post("unobserve", { id: observationId });
			observers.delete(observationId);
			directoryCacheMap.delete(cacheKey);
		};
		observers.set(observationId, (changes) => {
			for (const change of changes) {
				if (!change?.name) continue;
				if (change.type === "modified" || change.type === "created" || change.type === "appeared") mapCache.set(change.name, change.handle);
				else if (change.type === "deleted" || change.type === "disappeared") mapCache.delete(change.name);
			}
		});
		post("observe", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			id: observationId
		}, rootHandle ? [rootHandle] : []);
		updateCache();
		const newState = {
			mapCache,
			dirHandle: dirHandlePromise,
			resolvePath: resolvedPath,
			observationId,
			refCount: 1,
			cleanup,
			updateCache
		};
		directoryCacheMap.set(cacheKey, newState);
		const entries = await Promise.all(await Array.fromAsync((await dirHandlePromise)?.entries?.() ?? []));
		for (const [name, handle] of entries) if (!mapCache.has(name)) mapCache.set(name, handle);
		return {
			...newState,
			mapCache
		};
	});
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		statePromise.then((s) => {
			if (!s) return;
			s.refCount--;
			if (s.refCount <= 0) s.cleanup();
		}).catch(console.warn);
	};
	const handler = {
		get(_target, prop) {
			if (prop === Symbol.toStringTag || prop === Symbol.iterator || prop === "toString" || prop === "valueOf" || prop === "inspect" || prop === "constructor" || prop === "__proto__" || prop === "prototype") return;
			if (prop === "dispose") return dispose;
			if (prop === "getMap") return () => localMapCache;
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === Symbol.iterator) return () => localMapCache[Symbol.iterator]();
			if (prop === "size") return localMapCache.size;
			if (prop === "has") return (k) => localMapCache.has(k);
			if (prop === "get") return (k) => localMapCache.get(k);
			if (prop === "entries") return () => localMapCache.entries();
			if (prop === "keys") return () => localMapCache.keys();
			if (prop === "values") return () => localMapCache.values();
			if (prop === "refresh") return () => statePromise.then((s) => s?.updateCache?.()).then(() => pxy);
			if (prop === "then" || prop === "catch" || prop === "finally") {
				const p = statePromise.then(() => true);
				return p[prop].bind(p);
			}
			return (...args) => statePromise.then(async (s) => {
				if (!s) return void 0;
				const dh = await s.dirHandle;
				const v = dh?.[prop];
				if (typeof v === "function") return v.apply(dh, args);
				return v;
			});
		},
		ownKeys() {
			return Array.from(localMapCache.keys());
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	};
	const fx = function() {};
	const pxy = new Proxy(fx, handler);
	return pxy;
}
async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		return await post("readFile", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			type: "blob"
		}, resolvedRoot ? [resolvedRoot] : []);
	} catch (e) {
		return handleError(logger, "error", `readFile: ${e.message}`);
	}
}
async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
	if (data instanceof FileSystemFileHandle) data = await data.getFile();
	if (data instanceof FileSystemDirectoryHandle) {
		const dstHandle = await getDirectoryHandle(await resolveRootHandle(rootHandle), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, "-"), { create: true });
		return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
	} else try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, "");
		return await post("writeFile", {
			rootId: "",
			path: stripUserScopePrefix(resolvedPath),
			data
		}, resolvedRoot ? [resolvedRoot] : []) !== false;
	} catch (e) {
		return handleError(logger, "error", `writeFile: ${e.message}`);
	}
}
async function removeFile(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
	try {
		const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
		const candidates = userPathCandidates(resolvedPath);
		let lastResult = false;
		for (const candidate of candidates) {
			lastResult = await post("remove", {
				rootId: "",
				path: candidate,
				recursive: options.recursive
			}, resolvedRoot ? [resolvedRoot] : []);
			if (lastResult !== false) return true;
		}
		return lastResult !== false;
	} catch (e) {
		return handleError(logger, "error", `removeFile: ${e.message}`);
	}
}
async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
	try {
		return removeFile(rootHandle, relPath, {
			recursive: true,
			...options
		}, logger);
	} catch (e) {
		return handleError(logger, "error", `remove: ${e.message}`);
	}
}
var downloadFile = async (file, filename) => {
	if (file instanceof FileSystemFileHandle) file = await file.getFile();
	if (typeof file == "string") file = await provide(file);
	filename = filename ?? file?.name;
	if (!filename) return;
	if ("msSaveOrOpenBlob" in self.navigator) self.navigator.msSaveOrOpenBlob(file, filename);
	if (file instanceof FileSystemDirectoryHandle) {
		let dstHandle = await showDirectoryPicker?.({ mode: "readwrite" })?.catch?.(console.warn.bind(console));
		if (file && dstHandle) {
			dstHandle = await getDirectoryHandle(dstHandle, file?.name || "", { create: true })?.catch?.(console.warn.bind(console)) || dstHandle;
			return await copyFromOneHandlerToAnother(file, dstHandle, {})?.catch?.(console.warn.bind(console));
		}
		return;
	}
	const fx = await (self?.showOpenFilePicker ? new Promise((r) => r({
		showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
		showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
	})) : import(
		/* @vite-ignore */
		"../../../../../subsystem/fest/polyfill/showOpenFilePicker.mjs"
));
	if (window?.showSaveFilePicker) {
		const writableFileStream = await (await fx?.showSaveFilePicker?.({ suggestedName: filename })?.catch?.(console.warn.bind(console)))?.createWritable?.({ keepExistingData: true })?.catch?.(console.warn.bind(console));
		await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
		await writableFileStream?.close?.()?.catch?.(console.warn.bind(console));
	} else {
		const a = document.createElement("a");
		try {
			a.href = URL.createObjectURL(file);
		} catch (e) {
			console.warn(e);
		}
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			globalThis.URL.revokeObjectURL(a.href);
		}, 0);
	}
};
var provide = async (req = "", rw = false) => {
	const requestUrl = (typeof req === "string" ? req : req?.url || "").trim();
	if (!requestUrl) return null;
	let pathname = requestUrl;
	try {
		pathname = new URL(requestUrl, location?.origin || self?.location?.origin || "http://localhost").pathname || requestUrl;
	} catch {}
	const cleanPath = pathname?.trim?.() || "/";
	if (cleanPath?.startsWith?.("/user")) {
		const path = stripUserScopePrefix(cleanPath);
		const root = await navigator?.storage?.getDirectory?.();
		if (!root) return null;
		const handle = await getFileHandle(root, path, { create: !!rw }).catch(() => null);
		if (!handle) return null;
		if (rw) return handle?.createWritable?.();
		return handle?.getFile?.();
	}
	if (rw) return null;
	try {
		const baseOrigin = String(location?.origin || self?.location?.origin || "").trim();
		const fetchTarget = cleanPath.startsWith("/") ? new URL(cleanPath, baseOrigin || "http://localhost").toString() : requestUrl;
		const r = await fetch(fetchTarget);
		const blob = await r?.blob()?.catch?.(console.warn.bind(console));
		const lastModifiedHeader = r?.headers?.get?.("Last-Modified");
		const lastModified = lastModifiedHeader ? Date.parse(lastModifiedHeader) : 0;
		if (blob) {
			const fallbackName = cleanPath?.substring?.(cleanPath?.lastIndexOf?.("/") + 1) || "resource";
			return new File([blob], fallbackName, {
				type: blob?.type,
				lastModified: isNaN(lastModified) ? 0 : lastModified
			});
		}
	} catch (e) {
		return handleError(defaultLogger, "error", `provide: ${e.message}`);
	}
	return null;
};
var dropFile = async (file, dest = "/user/"?.trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const fs = await resolveRootHandle(null);
	const user = getDir(stripUserScopePrefix(dest))?.replace?.("/user", "")?.trim?.();
	file = file instanceof File ? file : new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp"));
	const fp = user + (file?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, "-");
	await writeFile(fs, fp, file);
	current?.set?.("/user" + fp?.trim?.()?.replace?.(/\s+/g, "-"), file);
	return "/user" + fp?.trim?.();
};
var uploadFile = async (dest = "/user/"?.trim?.()?.replace?.(/\s+/g, "-"), current) => {
	const $e = "showOpenFilePicker";
	dest = stripUserScopePrefix(dest);
	return (window?.[$e]?.bind?.(window) ?? (await import("../chunks/showOpenFilePicker.js"))?.[$e])({
		...generalFileImportDesc,
		multiple: true
	})?.then?.(async (handles = []) => {
		for (const handle of handles) await dropFile(handle instanceof File ? handle : await handle?.getFile?.(), dest, current);
	});
};
var ghostImage = typeof Image != "undefined" ? new Image() : null;
if (ghostImage) {
	ghostImage.decoding = "async";
	ghostImage.width = 24;
	ghostImage.height = 24;
	try {
		ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], { type: "image/svg+xml" }));
	} catch (e) {}
}
var copyFromOneHandlerToAnother = async (fromHandle, toHandle, options = {}, logger = defaultLogger) => {
	return post("copy", {
		from: fromHandle,
		to: toHandle
	}, [fromHandle, toHandle]);
};
var handleIncomingEntries = (data, destPath = "/user/", rootHandle = null, onItemHandled) => {
	const tasks = [];
	const items = Array.from(data?.items ?? []);
	const files = Array.from(data?.files ?? []);
	const dataArray = Array.isArray(data) ? data : [...data?.[Symbol.iterator] ? data : [data]];
	return Promise.try(async () => {
		const resolvedRoot = await resolveRootHandle(rootHandle);
		const processItem = async (item) => {
			let handle;
			if (item.kind === "file" || item.kind === "directory") try {
				handle = await item.getAsFileSystemHandle?.();
			} catch {}
			if (handle) {
				if (handle.kind === "directory") {
					const nwd = await getDirectoryHandle(resolvedRoot, destPath + (handle.name || "").trim().replace(/\s+/g, "-"), { create: true });
					if (nwd) tasks.push(copyFromOneHandlerToAnother(handle, nwd, { create: true }));
				} else {
					const file = await handle.getFile();
					const path = destPath + (file.name || handle.name).trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
			if (item.kind === "file" || item instanceof File) {
				const file = item instanceof File ? item : item.getAsFile();
				if (file) {
					const path = destPath + file.name.trim().replace(/\s+/g, "-");
					tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
				}
				return;
			}
		};
		if (items?.length > 0) for (const item of items) await processItem(item);
		if (files?.length > 0) for (const file of files) await processItem(file);
		if (dataArray?.length > 0) for (const item of dataArray) await processItem(item);
		const uriList = data?.getData?.("text/uri-list") || data?.getData?.("text/plain");
		if (uriList && typeof uriList === "string") {
			const urls = uriList.split(/\r?\n/).filter(Boolean);
			for (const url of urls) {
				if (url.startsWith("file://")) continue;
				if (url.startsWith("/user/")) {
					const src = url.trim();
					tasks.push(Promise.try(async () => {
						const srcHandle = await getHandler(resolvedRoot, src);
						if (srcHandle?.handle) {
							const name = src.split("/").filter(Boolean).pop();
							if (srcHandle.type === "directory") {
								const nwd = await getDirectoryHandle(resolvedRoot, destPath + name, { create: true });
								await copyFromOneHandlerToAnother(srcHandle.handle, nwd, { create: true });
							} else {
								const file = await srcHandle.handle.getFile();
								const path = destPath + name;
								await writeFile(resolvedRoot, path, file);
								onItemHandled?.(file, path);
							}
						}
					}));
				} else tasks.push(Promise.try(async () => {
					const file = await provide(url);
					if (file) {
						const path = destPath + file.name;
						await writeFile(resolvedRoot, path, file);
						onItemHandled?.(file, path);
					}
				}));
			}
		}
		if (dataArray?.[0] instanceof ClipboardItem) {
			for (const item of dataArray) for (const type of item.types) if (type.startsWith("image/") || type.startsWith("text/")) {
				const blob = await item.getType(type);
				const ext = type.split("/")[1].split("+")[0] || "txt";
				const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
				const path = destPath + file.name;
				tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
			}
		}
		await Promise.allSettled(tasks).catch(console.warn.bind(console));
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/Base64Data.ts
var DEFAULT_MIME = "application/octet-stream";
var DATA_URL_RE = /^data:(?<mime>[^;,]+)?(?<params>(?:;[^,]*)*?),(?<data>[\s\S]*)$/i;
function canUseFromBase64() {
	return typeof Uint8Array.fromBase64 === "function";
}
function tryDecodeURIComponent(s) {
	try {
		return decodeURIComponent(s);
	} catch {
		return s;
	}
}
function likelyUriComponent(s) {
	return /%[0-9A-Fa-f]{2}/.test(s) || s.includes("+");
}
function bytesToArrayBuffer(bytes) {
	const buf = bytes.buffer;
	if (buf instanceof ArrayBuffer) return buf.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
	const ab = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(ab).set(bytes);
	return ab;
}
function parseDataUrl(input) {
	const s = (input || "").trim();
	if (!s.toLowerCase().startsWith("data:")) return null;
	const m = s.match(DATA_URL_RE);
	if (!m?.groups) return null;
	return {
		mimeType: (m.groups.mime || DEFAULT_MIME).trim() || DEFAULT_MIME,
		isBase64: (m.groups.params || "").toLowerCase().includes(";base64"),
		data: m.groups.data ?? ""
	};
}
function decodeBase64ToBytes(base64, options = {}) {
	const alphabet = options.alphabet || "base64";
	const lastChunkHandling = options.lastChunkHandling || "loose";
	const s = (base64 || "").trim();
	if (canUseFromBase64()) return Uint8Array.fromBase64(s, {
		alphabet,
		lastChunkHandling
	});
	const normalized = alphabet === "base64url" ? s.replace(/-/g, "+").replace(/_/g, "/") : s;
	const padLen = (4 - normalized.length % 4) % 4;
	const padded = normalized + "=".repeat(padLen);
	const binary = typeof atob === "function" ? atob(padded) : "";
	const out = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
	return out;
}
async function blobToBytes(blob) {
	const ab = await blob.arrayBuffer();
	return new Uint8Array(ab);
}
function looksLikeBase64(s) {
	const t = (s || "").trim();
	if (!t) return {
		isBase64: false,
		alphabet: "base64"
	};
	const alphabet = /[-_]/.test(t) && !/[+/]/.test(t) ? "base64url" : "base64";
	const cleaned = (alphabet === "base64url" ? t.replace(/-/g, "+").replace(/_/g, "/") : t).replace(/[\r\n\s]/g, "");
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) return {
		isBase64: false,
		alphabet
	};
	if (cleaned.length < 8) return {
		isBase64: false,
		alphabet
	};
	return {
		isBase64: true,
		alphabet
	};
}
function canParseUrl(value) {
	try {
		if (typeof URL === "undefined") return false;
		if (typeof URL.canParse === "function") return URL.canParse(value);
		new URL(value);
		return true;
	} catch {
		return false;
	}
}
function extensionByMimeType(mimeType) {
	const t = (mimeType || "").toLowerCase().split(";")[0].trim();
	if (!t) return "bin";
	const mapped = {
		"text/plain": "txt",
		"text/markdown": "md",
		"text/html": "html",
		"application/json": "json",
		"application/xml": "xml",
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/webp": "webp",
		"image/gif": "gif",
		"image/svg+xml": "svg",
		"application/pdf": "pdf"
	};
	if (mapped[t]) return mapped[t];
	const slashIdx = t.indexOf("/");
	if (slashIdx <= 0 || slashIdx >= t.length - 1) return "bin";
	let subtype = t.slice(slashIdx + 1);
	if (subtype.includes("+")) subtype = subtype.split("+")[0];
	if (subtype.includes(".")) subtype = subtype.split(".").pop() || subtype;
	return subtype || "bin";
}
function fallbackHashHex(bytes) {
	let h = 2166136261;
	for (let i = 0; i < bytes.length; i++) {
		h ^= bytes[i];
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0").repeat(8);
}
async function sha256Hex(bytes) {
	try {
		const subtle = globalThis.crypto?.subtle;
		if (!subtle) return fallbackHashHex(bytes);
		const digest = await subtle.digest("SHA-256", bytes);
		const out = new Uint8Array(digest);
		return Array.from(out, (b) => b.toString(16).padStart(2, "0")).join("");
	} catch {
		return fallbackHashHex(bytes);
	}
}
function isBase64Like(input) {
	return looksLikeBase64(input).isBase64;
}
async function normalizeDataAsset(input, options = {}) {
	const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
	const namePrefix = (options.namePrefix || "asset").trim() || "asset";
	const preserveFileName = options.preserveFileName ?? false;
	let source = "text";
	let blob;
	let incomingFile = null;
	if (input instanceof File) {
		source = "file";
		incomingFile = input;
		blob = options.mimeType && options.mimeType !== input.type ? new Blob([await input.arrayBuffer()], { type: options.mimeType }) : input;
	} else if (input instanceof Blob) {
		source = "blob";
		blob = options.mimeType && options.mimeType !== input.type ? new Blob([await input.arrayBuffer()], { type: options.mimeType }) : input;
	} else {
		const raw = (input instanceof URL ? input.toString() : String(input ?? "")).trim();
		const parsed = parseDataUrl(raw);
		const decodedUri = options.uriComponent ? tryDecodeURIComponent(raw) : likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw;
		if (parsed) source = "data-url";
		else if (canParseUrl(raw)) source = "url";
		else if (isBase64Like(raw)) source = "base64";
		else if (decodedUri !== raw && (parseDataUrl(decodedUri) || isBase64Like(decodedUri) || canParseUrl(decodedUri))) source = "uri";
		else source = "text";
		blob = await stringToBlob(source === "uri" ? decodedUri : raw, {
			mimeType: options.mimeType,
			uriComponent: options.uriComponent,
			isBase64: source === "base64" ? true : void 0,
			maxBytes
		});
	}
	const bytes = await blobToBytes(blob);
	if (bytes.byteLength > maxBytes) throw new Error(`Data too large: ${bytes.byteLength} bytes`);
	const hash = await sha256Hex(bytes);
	const mimeType = (options.mimeType || blob.type || DEFAULT_MIME).trim() || DEFAULT_MIME;
	const extension = extensionByMimeType(mimeType);
	const hashedName = options.filename || `${namePrefix}-${hash.slice(0, 16)}.${extension}`;
	const finalName = preserveFileName && incomingFile?.name ? incomingFile.name : hashedName;
	const file = incomingFile && preserveFileName && !options.mimeType ? incomingFile : new File([blob], finalName, { type: mimeType });
	return {
		hash,
		name: file.name,
		type: file.type || mimeType,
		size: file.size,
		source,
		file
	};
}
async function stringToBlobOrFile(input, options = {}) {
	const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
	const raw = (input ?? "").trim();
	const parsedDataUrl = parseDataUrl(raw);
	if (parsedDataUrl) {
		const mimeType = options.mimeType || parsedDataUrl.mimeType || DEFAULT_MIME;
		const payload = options.uriComponent ? tryDecodeURIComponent(parsedDataUrl.data) : likelyUriComponent(parsedDataUrl.data) ? tryDecodeURIComponent(parsedDataUrl.data) : parsedDataUrl.data;
		if (options.isBase64 ?? parsedDataUrl.isBase64) {
			const bytes = decodeBase64ToBytes(payload, {
				alphabet: options.base64?.alphabet || "base64",
				lastChunkHandling: options.base64?.lastChunkHandling || "loose"
			});
			if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
			const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
			if (!options.asFile) return blob;
			return new File([blob], options.filename || "file", { type: mimeType });
		}
		const blob = new Blob([payload], { type: mimeType });
		if (!options.asFile) return blob;
		return new File([blob], options.filename || "file", { type: mimeType });
	}
	try {
		if (typeof URL !== "undefined" && URL.canParse?.(raw)) {
			const blob = await (await fetch(raw)).blob();
			const mimeType = options.mimeType || blob.type || DEFAULT_MIME;
			const typed = blob.type === mimeType ? blob : new Blob([await blob.arrayBuffer()], { type: mimeType });
			if (!options.asFile) return typed;
			return new File([typed], options.filename || "file", { type: mimeType });
		}
	} catch {}
	const maybeDecoded = options.uriComponent ? tryDecodeURIComponent(raw) : likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw;
	const base64Hint = looksLikeBase64(maybeDecoded);
	const isBase64 = options.isBase64 ?? base64Hint.isBase64;
	const mimeType = options.mimeType || (isBase64 ? DEFAULT_MIME : "text/plain;charset=utf-8");
	if (isBase64) {
		const bytes = decodeBase64ToBytes(maybeDecoded, {
			alphabet: options.base64?.alphabet || base64Hint.alphabet,
			lastChunkHandling: options.base64?.lastChunkHandling || "loose"
		});
		if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
		const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
		if (!options.asFile) return blob;
		return new File([blob], options.filename || "file", { type: mimeType });
	}
	const blob = new Blob([maybeDecoded], { type: mimeType });
	if (!options.asFile) return blob;
	return new File([blob], options.filename || "file", { type: mimeType });
}
async function stringToBlob(input, options = {}) {
	return await stringToBlobOrFile(input, {
		...options,
		asFile: false
	});
}
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/WriteFileSmart-v2.ts
var lureFsPromise = null;
var getLureFs = () => {
	if (!lureFsPromise) lureFsPromise = Promise.resolve().then(() => src_exports).then((m) => ({
		readFile: m.readFile,
		writeFile: m.writeFile
	}));
	return lureFsPromise;
};
var toSlug = (input, toLower = true) => {
	let s = String(input || "").trim();
	if (toLower) s = s.toLowerCase();
	s = s.replace(/\s+/g, "-");
	s = s.replace(/[^a-z0-9_.\-+#&]/g, "-");
	s = s.replace(/-+/g, "-");
	return s;
};
var inferExtFromMime = (mime = "") => {
	if (!mime) return "";
	if (mime.includes("json")) return "json";
	if (mime.includes("markdown")) return "md";
	if (mime.includes("plain")) return "txt";
	if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
	if (mime === "image/png") return "png";
	if (mime.startsWith("image/")) return mime.split("/").pop() || "";
	if (mime.includes("html")) return "html";
	return "";
};
var splitPath = (path) => String(path || "").split("/").filter(Boolean);
var ensureDir = (p) => p.endsWith("/") ? p : p + "/";
var joinPath = (parts, absolute = true) => (absolute ? "/" : "") + parts.filter(Boolean).join("/");
var sanitizePathSegments = (path) => {
	return joinPath(splitPath(path).map((p) => toSlug(p)));
};
var DEFAULT_ARRAY_KEYS = [
	"id",
	"_id",
	"key",
	"slug",
	"name"
];
var isPlainObject = (v) => Object.prototype.toString.call(v) === "[object Object]";
function dedupeArray(items, opts) {
	const keys = Array.isArray(opts.arrayKey) ? opts.arrayKey : opts.arrayKey ? [opts.arrayKey] : DEFAULT_ARRAY_KEYS;
	const result = [];
	const primitiveSet = /* @__PURE__ */ new Set();
	const objMap = /* @__PURE__ */ new Map();
	const stringifiedSet = /* @__PURE__ */ new Set();
	for (const it of items) {
		if (it == null) continue;
		if (isPlainObject(it)) {
			let dedupeKey;
			for (const k of keys) if (k in it && it[k] != null) {
				dedupeKey = String(it[k]);
				break;
			}
			if (dedupeKey != null) {
				if (!objMap.has(dedupeKey)) {
					objMap.set(dedupeKey, it);
					result.push(it);
				}
			} else {
				const sig = safeStableStringify(it);
				if (!stringifiedSet.has(sig)) {
					stringifiedSet.add(sig);
					result.push(it);
				}
			}
		} else if (Array.isArray(it)) {
			const sig = safeStableStringify(it);
			if (!stringifiedSet.has(sig)) {
				stringifiedSet.add(sig);
				result.push(it);
			}
		} else if (!primitiveSet.has(it)) {
			primitiveSet.add(it);
			result.push(it);
		}
	}
	return result;
}
function mergeDeepUnique(a, b, opts) {
	if (Array.isArray(a) && Array.isArray(b)) switch (opts.arrayStrategy) {
		case "replace": return b.slice();
		case "concat": return a.concat(b);
		default: return dedupeArray(a.concat(b), { arrayKey: opts.arrayKey });
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const out = { ...a };
		for (const k of Object.keys(b)) if (k in a) out[k] = mergeDeepUnique(a[k], b[k], opts);
		else out[k] = b[k];
		return out;
	}
	return b;
}
function safeStableStringify(obj) {
	if (!isPlainObject(obj)) return JSON.stringify(obj);
	const keys = Object.keys(obj).sort();
	const o = {};
	for (const k of keys) o[k] = obj[k];
	return JSON.stringify(o);
}
async function blobToText(blob) {
	return await blob.text();
}
async function readFileAsJson(root, fullPath) {
	try {
		const { readFile } = await getLureFs();
		const existing = await readFile(root, fullPath)?.catch?.(console.warn.bind(console));
		if (!existing) return null;
		const text = await blobToText(existing);
		if (!text?.trim()) return null;
		return JSOX.parse(text);
	} catch {
		return null;
	}
}
var writeFileSmart = async (root, dirOrPath, file, options = {}) => {
	const { writeFile } = await getLureFs();
	const { forceExt, ensureJson, toLower = true, sanitize = true, mergeJson, arrayStrategy = "union", arrayKey, jsonSpace = 2 } = options;
	let raw = String(dirOrPath || "").trim();
	const isDirHint = raw.endsWith("/");
	const hasFileToken = !isDirHint && splitPath(raw).length > 0 && raw.includes(".");
	let dirPath = isDirHint ? raw : hasFileToken ? raw.split("/").slice(0, -1).join("/") : raw;
	let desiredName = hasFileToken ? raw.split("/").pop() || "" : file?.name || "";
	dirPath = dirPath || "/";
	desiredName = desiredName || Date.now() + "";
	const lastDot = desiredName.lastIndexOf(".");
	let base = lastDot > 0 ? desiredName.slice(0, lastDot) : desiredName;
	let ext = forceExt || (ensureJson ? "json" : lastDot > 0 ? desiredName.slice(lastDot + 1) : inferExtFromMime(file?.type || "")) || "";
	if (sanitize) {
		dirPath = sanitizePathSegments(dirPath);
		base = toSlug(base, toLower);
	}
	const finalName = ext ? `${base}.${ext}` : base;
	const fullPath = ensureDir(dirPath) + finalName;
	if (mergeJson !== false && (ensureJson || ext.toLowerCase() === "json" || file?.type === "application/json")) try {
		let incomingJson;
		if (file instanceof File || file instanceof Blob) {
			const txt = await blobToText(file);
			incomingJson = txt?.trim() ? JSOX.parse(txt) : {};
		} else incomingJson = file;
		const existingJson = await readFileAsJson(root, fullPath)?.catch?.(console.warn.bind(console));
		let merged = existingJson != null ? mergeDeepUnique(existingJson, incomingJson, {
			arrayStrategy,
			arrayKey
		}) : incomingJson;
		const jsonString = JSON.stringify(merged, void 0, jsonSpace);
		const rs = await writeFile(root, fullPath, new File([jsonString], finalName, { type: "application/json" }))?.catch?.(console.warn.bind(console));
		if (typeof document !== "undefined") document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
			detail: rs,
			bubbles: true,
			composed: true,
			cancelable: true
		}));
		return rs;
	} catch (err) {
		console.warn("writeFileSmart JSON merge failed, falling back to raw write:", err);
	}
	let toWrite;
	if (file instanceof File) if (file.name === finalName) toWrite = file;
	else {
		const type = file.type || (ext ? `application/${ext}` : "application/octet-stream");
		const buf = await file.arrayBuffer();
		toWrite = new File([buf], finalName, { type });
	}
	else {
		const type = file.type || (ext ? `application/${ext}` : "application/octet-stream");
		toWrite = new File([await file.arrayBuffer()], finalName, { type });
	}
	const rs = await writeFile(root, fullPath, toWrite)?.catch?.(console.warn.bind(console));
	if (typeof document !== "undefined") document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
		detail: rs,
		bubbles: true,
		composed: true,
		cancelable: true
	}));
	return rs;
};
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/FsWatch.ts
var matchPath = (path = "", dir = "") => {
	const normalizedDir = dir.endsWith("/") ? dir : `${dir}/`;
	return path.startsWith(normalizedDir);
};
var channel = new BroadcastChannel("rs-fs"), watchers = /* @__PURE__ */ new Map();
channel.addEventListener("close", () => watchers.clear());
channel.addEventListener("message", (event) => {
	const payload = event?.data;
	if (!payload || payload.type !== "commit-result" && payload.type !== "commit-to-clipboard") return;
	const results = payload?.results ?? [];
	if (!Array.isArray(results) || !results.length) return;
	for (const [dir, listeners] of watchers.entries()) {
		if (!listeners.size) continue;
		if (!results.some((item) => matchPath(item?.path, dir))) continue;
		for (const listener of listeners) try {
			listener();
		} catch (e) {
			console.warn(e);
		}
	}
});
//#endregion
//#region ../../modules/projects/lur.e/src/utils/opfs/FileHandling.ts
var FileHandler = class {
	options;
	dragOverElements = /* @__PURE__ */ new Set();
	constructor(options) {
		this.options = { ...options };
	}
	/**
	* Programmatically add files into the same pipeline as UI selection / DnD / paste.
	* Used by PWA share-target and launchQueue ingestion.
	*/
	addFiles(files) {
		if (!Array.isArray(files) || files.length === 0) return;
		return this.options.onFilesAdded(files);
	}
	/**
	* Set up file input element with file selection
	*/
	setupFileInput(container, accept = "*") {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.accept = accept;
		fileInput.style.display = "none";
		fileInput.addEventListener("change", (e) => {
			const files = Array.from(e.target.files || []);
			if (files.length > 0) this.options.onFilesAdded(files);
			fileInput.value = "";
		});
		container.append(fileInput);
		return fileInput;
	}
	/**
	* Set up drag and drop handling for an element
	*/
	setupDragAndDrop(element) {
		element.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.addDragOver(element);
		});
		element.addEventListener("dragleave", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeDragOver(element);
		});
		element.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeDragOver(element);
			const files = Array.from(e.dataTransfer?.files || []);
			if (files.length > 0) this.options.onFilesAdded(files);
		});
	}
	/**
	* Set up paste handling for an element
	*/
	setupPasteHandling(element) {
		element.addEventListener("paste", (e) => {
			const files = Array.from(e.clipboardData?.files || []);
			if (files.length > 0) {
				e.preventDefault();
				this.options.onFilesAdded(files);
			}
		});
	}
	/**
	* Set up all file handling for a container (file input button, drag & drop, paste)
	*/
	setupCompleteFileHandling(container, fileSelectButton, dropZone, accept = "*") {
		const fileInput = this.setupFileInput(container, accept);
		fileSelectButton.addEventListener("click", () => {
			fileInput.click();
		});
		if (dropZone) this.setupDragAndDrop(dropZone);
		this.setupPasteHandling(container);
	}
	/**
	* Validate file types and sizes
	*/
	validateFiles(files, options = {}) {
		const { maxSize, allowedTypes, maxFiles } = options;
		const valid = [];
		const invalid = [];
		if (maxFiles && files.length > maxFiles) {
			invalid.push(...files.slice(maxFiles).map((file) => ({
				file,
				reason: `Too many files. Maximum ${maxFiles} files allowed.`
			})));
			files = files.slice(0, maxFiles);
		}
		for (const file of files) {
			let isValid = true;
			let reason = "";
			if (maxSize && file.size > maxSize) {
				isValid = false;
				reason = `File too large. Maximum size is ${this.formatFileSize(maxSize)}.`;
			}
			if (allowedTypes && allowedTypes.length > 0) {
				if (!allowedTypes.some((type) => {
					if (type.includes("*")) return file.type.startsWith(type.replace("/*", "/"));
					return file.type === type;
				})) {
					isValid = false;
					reason = reason || `File type not allowed. Allowed types: ${allowedTypes.join(", ")}.`;
				}
			}
			if (isValid) valid.push(file);
			else invalid.push({
				file,
				reason
			});
		}
		return {
			valid,
			invalid
		};
	}
	/**
	* Read file content as text
	*/
	async readFileAsText(file, onProgress) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			if (onProgress) reader.onprogress = (e) => {
				if (e.lengthComputable) onProgress(e.loaded, e.total);
			};
			reader.readAsText(file);
		});
	}
	/**
	* Read file content as ArrayBuffer
	*/
	async readFileAsArrayBuffer(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			reader.readAsArrayBuffer(file);
		});
	}
	/**
	* Read file content as Data URL
	*/
	async readFileAsDataURL(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			reader.readAsDataURL(file);
		});
	}
	/**
	* Read multiple files as text
	*/
	async readFilesAsText(files, onProgress) {
		const results = [];
		for (const file of files) try {
			const content = await this.readFileAsText(file, (loaded, total) => {
				onProgress?.(file, loaded, total);
			});
			results.push({
				file,
				content
			});
		} catch (error) {
			console.warn(`Failed to read file ${file.name}:`, error);
		}
		return results;
	}
	/**
	* Get file icon based on MIME type
	*/
	getFileIcon(mimeType) {
		if (mimeType.startsWith("image/")) return "🖼️";
		if (mimeType === "application/pdf") return "📄";
		if (mimeType.includes("json")) return "📋";
		if (mimeType.includes("text") || mimeType.includes("markdown")) return "📝";
		if (mimeType.includes("javascript") || mimeType.includes("typescript")) return "📜";
		if (mimeType.includes("css")) return "🎨";
		if (mimeType.includes("html")) return "🌐";
		if (mimeType.startsWith("video/")) return "🎥";
		if (mimeType.startsWith("audio/")) return "🎵";
		if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
		return "📄";
	}
	/**
	* Format file size for display
	*/
	formatFileSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	}
	/**
	* Check if a file is likely a markdown file
	*/
	isMarkdownFile(file) {
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".mdown") || name.endsWith(".mkd") || name.endsWith(".mkdn") || name.endsWith(".mdtxt") || name.endsWith(".mdtext") || type.includes("markdown") || type.includes("text");
	}
	/**
	* Check if a file is an image
	*/
	isImageFile(file) {
		return file.type.startsWith("image/");
	}
	/**
	* Check if a file is a text file
	*/
	isTextFile(file) {
		return file.type.startsWith("text/") || this.isMarkdownFile(file) || file.type.includes("javascript") || file.type.includes("typescript") || file.type.includes("css") || file.type.includes("html") || file.type.includes("json") || file.type.includes("xml");
	}
	/**
	* Check if a file is a binary file
	*/
	isBinaryFile(file) {
		return !this.isTextFile(file) && !this.isImageFile(file);
	}
	/**
	* Get file metadata
	*/
	getFileMetadata(file) {
		const extension = file.name.split(".").pop()?.toLowerCase() || "";
		const isText = this.isTextFile(file);
		const isImage = this.isImageFile(file);
		const isBinary = this.isBinaryFile(file);
		return {
			name: file.name,
			extension,
			size: file.size,
			type: file.type,
			lastModified: file.lastModified,
			isText,
			isImage,
			isBinary,
			formattedSize: this.formatFileSize(file.size),
			icon: this.getFileIcon(file.type)
		};
	}
	/**
	* Get files metadata for multiple files
	*/
	getFilesMetadata(files) {
		return files.map((file) => this.getFileMetadata(file));
	}
	addDragOver(element) {
		if (!this.dragOverElements.has(element)) {
			this.dragOverElements.add(element);
			element.classList.add("drag-over");
		}
	}
	removeDragOver(element) {
		if (this.dragOverElements.has(element)) {
			this.dragOverElements.delete(element);
			element.classList.remove("drag-over");
		}
	}
	/**
	* Manually trigger file processing with the provided files
	*/
	processFiles(files) {
		this.options.onFilesAdded(files);
	}
	/**
	* Create a downloadable file from content
	*/
	createDownloadableFile(content, filename, mimeType) {
		let blob;
		if (content instanceof Blob) blob = content;
		else if (content instanceof ArrayBuffer) blob = new Blob([content], { type: mimeType || "application/octet-stream" });
		else blob = new Blob([content], { type: mimeType || "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(() => URL.revokeObjectURL(url), 100);
	}
	/**
	* Create a shareable file URL
	*/
	createFileURL(file) {
		return URL.createObjectURL(file);
	}
	/**
	* Revoke a file URL to free memory
	*/
	revokeFileURL(url) {
		URL.revokeObjectURL(url);
	}
	/**
	* Clean up event listeners and references
	*/
	destroy() {
		this.dragOverElements.clear();
	}
};
/**
* Utility function to create a file handler with default options
*/
function createFileHandler(options) {
	return new FileHandler(options);
}
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/LazyLoader.ts
/**
* Lazy load a component and its CSS
*/
async function lazyLoadComponent(importFn, options) {
	const { cssPath, componentName } = options;
	console.log(`[LazyLoader] Loading component: ${componentName}`);
	if (cssPath) try {
		await loadCSS(cssPath);
	} catch (error) {
		console.warn(`[LazyLoader] Failed to load CSS for ${componentName}:`, error);
	}
	try {
		const component = await importFn();
		console.log(`[LazyLoader] Successfully loaded component: ${componentName}`);
		return { component };
	} catch (error) {
		console.error(`[LazyLoader] Failed to load component ${componentName}:`, error);
		throw error;
	}
}
/**
* Load CSS dynamically
*/
async function loadCSS(href) {
	return new Promise((resolve, reject) => {
		if (document.querySelectorAll(`link[href="${href}"]`).length > 0) {
			resolve();
			return;
		}
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		link.onload = () => resolve();
		link.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load CSS: ${href}`));
		document.head.appendChild(link);
	});
}
/**
* Cache for loaded components to avoid re-loading
*/
var componentCache = /* @__PURE__ */ new Map();
/**
* Get or load a cached component
*/
async function getCachedComponent(cacheKey, importFn, options) {
	if (componentCache.has(cacheKey)) return componentCache.get(cacheKey);
	const lazyComponent = await lazyLoadComponent(importFn, options);
	componentCache.set(cacheKey, lazyComponent);
	return lazyComponent;
}
//#endregion
//#region ../../modules/projects/lur.e/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$behavior: () => $behavior,
	$createElement: () => $createElement,
	$mapped: () => $mapped,
	$observeAttribute: () => $observeAttribute,
	$observeInput: () => $observeInput,
	$virtual: () => $virtual,
	C: () => C,
	CSSCalc: () => CSSCalc,
	ClosePriority: () => ClosePriority,
	DESKTOP_MAIN_KEY: () => DESKTOP_MAIN_KEY,
	E: () => E,
	FileHandler: () => FileHandler,
	GLitElement: () => GLitElement,
	H: () => H,
	HistoryManager: () => HistoryManager,
	ITEM_COMPACT_KIND: () => ITEM_COMPACT_KIND,
	JUNCTION_DRAG_EVENTS: () => JUNCTION_DRAG_EVENTS,
	JUNCTION_RESIZE_EVENTS: () => JUNCTION_RESIZE_EVENTS,
	JUNCTION_SELECT_EVENTS: () => JUNCTION_SELECT_EVENTS,
	JunctionDragMixin: () => JunctionDragMixin,
	JunctionResizeMixin: () => JunctionResizeMixin,
	JunctionSelectMixin: () => JunctionSelectMixin,
	M: () => M,
	Q: () => Q,
	Qp: () => Qp,
	ReactiveViewport: () => ReactiveViewport,
	TemplateManager: () => TemplateManager,
	VoiceInputManager: () => VoiceInputManager,
	addProxiedEvent: () => addProxiedEvent,
	addToBank: () => addToBank,
	alives: () => alives,
	applyNormalizedInlineStyle: () => applyNormalizedInlineStyle,
	attrLink: () => attrLink,
	attrRef: () => attrRef,
	bindCtrl: () => bindCtrl,
	bindHandler: () => bindHandler,
	bindMenuItemClickHandler: () => bindMenuItemClickHandler,
	bindWhileConnected: () => bindWhileConnected,
	bindWith: () => bindWith,
	blobToBytes: () => blobToBytes,
	checkedLink: () => checkedLink,
	checkedRef: () => checkedRef,
	colorScheme: () => colorScheme,
	copy: () => copy,
	copyFromOneHandlerToAnother: () => copyFromOneHandlerToAnother,
	createFileHandler: () => createFileHandler,
	createHistoryManager: () => createHistoryManager,
	createTemplateManager: () => createTemplateManager,
	ctxMenuTrigger: () => ctxMenuTrigger,
	currentHandleMap: () => currentHandleMap,
	decodeBase64ToBytes: () => decodeBase64ToBytes,
	defaultLogger: () => defaultLogger,
	defineElement: () => defineElement,
	detectTypeByRelPath: () => detectTypeByRelPath,
	directHandlers: () => directHandlers,
	directoryCacheMap: () => directoryCacheMap,
	downloadFile: () => downloadFile,
	dropFile: () => dropFile,
	dynamicBgColors: () => dynamicBgColors,
	dynamicNativeFrame: () => dynamicNativeFrame,
	dynamicTheme: () => dynamicTheme,
	elMap: () => elMap$1,
	electronAPI: () => electronAPI,
	ensureWorker: () => ensureWorker,
	eventTrigger: () => eventTrigger,
	generalFileImportDesc: () => generalFileImportDesc,
	getCachedComponent: () => getCachedComponent,
	getDir: () => getDir,
	getDirectoryHandle: () => getDirectoryHandle,
	getFileHandle: () => getFileHandle,
	getGlobalContextMenu: () => getGlobalContextMenu,
	getHandler: () => getHandler,
	getMimeTypeByFilename: () => getMimeTypeByFilename,
	getSpeechPrompt: () => getSpeechPrompt,
	ghostImage: () => ghostImage,
	handleError: () => handleError,
	handleIncomingEntries: () => handleIncomingEntries,
	hasFileExtension: () => hasFileExtension,
	html: () => html,
	htmlBuilder: () => htmlBuilder,
	initClipboardReceiver: () => initClipboardReceiver,
	initGlobalClipboard: () => initGlobalClipboard,
	isBase64Like: () => isBase64Like,
	isEffectivelyEmptyStyleText: () => isEffectivelyEmptyStyleText,
	isNotExtended: () => isNotExtended,
	itemClickHandle: () => itemClickHandle,
	junctionToBox: () => junctionToBox,
	lazyAddEventListener: () => lazyAddEventListener,
	lazyLoadComponent: () => lazyLoadComponent,
	listenForClipboardRequests: () => listenForClipboardRequests,
	loadCachedStyles: () => loadCachedStyles,
	localStorageLink: () => localStorageLink,
	localStorageLinkMap: () => localStorageLinkMap,
	localStorageRef: () => localStorageRef,
	makeInterruptTrigger: () => makeInterruptTrigger,
	makeLinker: () => makeLinker,
	makeMenuHandler: () => makeMenuHandler,
	makeRef: () => makeRef,
	makeUIState: () => makeUIState,
	mappedRoots: () => mappedRoots,
	matchMediaLink: () => matchMediaLink,
	matchMediaRef: () => matchMediaRef,
	maybeStartThemeEngine: () => maybeStartThemeEngine,
	mergeByKey: () => mergeByKey,
	mutationTrigger: () => mutationTrigger,
	normalizeDataAsset: () => normalizeDataAsset,
	normalizePath: () => normalizePath,
	openDirectory: () => openDirectory,
	parseDataUrl: () => parseDataUrl,
	pickBgColor: () => pickBgColor,
	pickFromCenter: () => pickFromCenter,
	post: () => post,
	property: () => property,
	provide: () => provide,
	pruneEmptyStyleAttribute: () => pruneEmptyStyleAttribute,
	readFile: () => readFile,
	reflectControllers: () => reflectControllers,
	registerCloseable: () => registerCloseable,
	registerContextMenu: () => registerContextMenu,
	reloadInto: () => reloadInto,
	remove: () => remove,
	removeFile: () => removeFile,
	removeFromBank: () => removeFromBank,
	resolvePath: () => resolvePath,
	resolveRootHandle: () => resolveRootHandle,
	scrollLink: () => scrollLink,
	scrollRef: () => scrollRef,
	sizeLink: () => sizeLink,
	sizeRef: () => sizeRef,
	stringToBlob: () => stringToBlob,
	stringToBlobOrFile: () => stringToBlobOrFile,
	toText: () => toText,
	unregisterCloseable: () => unregisterCloseable,
	uploadFile: () => uploadFile,
	valueAsNumberLink: () => valueAsNumberLink,
	valueAsNumberRef: () => valueAsNumberRef,
	valueLink: () => valueLink,
	valueRef: () => valueRef,
	visibleLink: () => visibleLink,
	visibleRef: () => visibleRef,
	withInsetWithPointer: () => withInsetWithPointer,
	withProperties: () => withProperties,
	writeFile: () => writeFile,
	writeFileSmart: () => writeFileSmart,
	writeHTML: () => writeHTML,
	writeImage: () => writeImage,
	writeText: () => writeText
});
//#endregion
export { ctxMenuTrigger as A, getSpeechPrompt as C, initClipboardReceiver as D, copy as E, bindWith as F, JSOX as I, defineElement as M, property as N, initGlobalClipboard as O, H as P, createTemplateManager as S, HistoryManager_exports as T, readFile as _, decodeBase64ToBytes as a, writeFile as b, parseDataUrl as c, getDirectoryHandle as d, getFileHandle as f, provide as g, openDirectory as h, writeFileSmart as i, GLitElement as j, writeText as k, downloadFile as l, handleIncomingEntries as m, getCachedComponent as n, isBase64Like as o, getMimeTypeByFilename as p, createFileHandler as r, normalizeDataAsset as s, src_exports as t, getDir as u, remove as v, makeUIState as w, dynamicTheme as x, uploadFile as y };
