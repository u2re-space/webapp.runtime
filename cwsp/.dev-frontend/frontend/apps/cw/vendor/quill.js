import { i as __toCommonJS, t as __commonJSMin } from "../chunks/rolldown-runtime.js";
import { n as lodash_exports, t as init_lodash } from "./lodash-es.js";
import { n as parchment_exports, t as init_parchment } from "./parchment.js";
import { t as require_diff } from "./fast-diff.js";
import { t as require_lodash_clonedeep } from "./lodash.clonedeep.js";
import { t as require_lodash_isequal } from "./lodash.isequal.js";
import { t as require_eventemitter3 } from "./eventemitter3.js";
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
	var colorIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-color-label ql-stroke ql-transparent\" x1=\"3\" x2=\"15\" y1=\"15\" y2=\"15\"/><polyline class=\"ql-stroke\" points=\"5.5 11 9 3 12.5 11\"/><line class=\"ql-stroke\" x1=\"11.63\" x2=\"6.38\" y1=\"9\" y2=\"9\"/></svg>";
	var directionLeftToRightIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"/><line class=\"ql-stroke ql-fill\" x1=\"15\" x2=\"11\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M11,3a3,3,0,0,0,0,6h1V3H11Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"11\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"13\" y=\"4\"/></svg>";
	var directionRightToLeftIcon = "<svg viewbox=\"0 0 18 18\"><polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"/><line class=\"ql-stroke ql-fill\" x1=\"9\" x2=\"5\" y1=\"4\" y2=\"4\"/><path class=\"ql-fill\" d=\"M5,3A3,3,0,0,0,5,9H6V3H5Z\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"5\" y=\"4\"/><rect class=\"ql-fill\" height=\"11\" width=\"1\" x=\"7\" y=\"4\"/></svg>";
	var formulaIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z\"/><rect class=\"ql-fill\" height=\"1.6\" rx=\"0.8\" ry=\"0.8\" width=\"5\" x=\"5.15\" y=\"6.2\"/><path class=\"ql-fill\" d=\"M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z\"/></svg>";
	var headerIcon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z\"/></svg>";
	var header2Icon = "<svg viewBox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z\"/></svg>";
	var italicIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"13\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"5\" x2=\"11\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"8\" x2=\"10\" y1=\"14\" y2=\"4\"/></svg>";
	var imageIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"10\" width=\"12\" x=\"3\" y=\"4\"/><circle class=\"ql-fill\" cx=\"6\" cy=\"7\" r=\"1\"/><polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"/></svg>";
	var indentIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"/></svg>";
	var outdentIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"5 7 5 11 3 9 5 7\"/></svg>";
	var linkIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"11\" y1=\"7\" y2=\"11\"/><path class=\"ql-even ql-stroke\" d=\"M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z\"/><path class=\"ql-even ql-stroke\" d=\"M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z\"/></svg>";
	var listBulletIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"6\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"3\" x2=\"3\" y1=\"14\" y2=\"14\"/></svg>";
	var listCheckIcon = "<svg class=\"\" viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"4\" y2=\"4\"/><polyline class=\"ql-stroke\" points=\"3 4 4 5 6 3\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"14\" y2=\"14\"/><polyline class=\"ql-stroke\" points=\"3 14 4 15 6 13\"/><line class=\"ql-stroke\" x1=\"9\" x2=\"15\" y1=\"9\" y2=\"9\"/><polyline class=\"ql-stroke\" points=\"3 9 4 10 6 8\"/></svg>";
	var listOrderedIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"4\" y2=\"4\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"9\" y2=\"9\"/><line class=\"ql-stroke\" x1=\"7\" x2=\"15\" y1=\"14\" y2=\"14\"/><line class=\"ql-stroke ql-thin\" x1=\"2.5\" x2=\"4.5\" y1=\"5.5\" y2=\"5.5\"/><path class=\"ql-fill\" d=\"M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z\"/><path class=\"ql-stroke ql-thin\" d=\"M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156\"/><path class=\"ql-stroke ql-thin\" d=\"M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109\"/></svg>";
	var subscriptIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z\"/><path class=\"ql-fill\" d=\"M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z\"/></svg>";
	var superscriptIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-fill\" d=\"M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z\"/><path class=\"ql-fill\" d=\"M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z\"/></svg>";
	var strikeIcon = "<svg viewbox=\"0 0 18 18\"><line class=\"ql-stroke ql-thin\" x1=\"15.5\" x2=\"2.5\" y1=\"8.5\" y2=\"9.5\"/><path class=\"ql-fill\" d=\"M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z\"/><path class=\"ql-fill\" d=\"M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z\"/></svg>";
	var tableIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"3\" x=\"5\" y=\"5\"/><rect class=\"ql-fill\" height=\"2\" width=\"4\" x=\"9\" y=\"5\"/><g class=\"ql-fill ql-transparent\"><rect height=\"2\" width=\"3\" x=\"5\" y=\"8\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"8\"/><rect height=\"2\" width=\"3\" x=\"5\" y=\"11\"/><rect height=\"2\" width=\"4\" x=\"9\" y=\"11\"/></g></svg>";
	var underlineIcon = "<svg viewbox=\"0 0 18 18\"><path class=\"ql-stroke\" d=\"M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3\"/><rect class=\"ql-fill\" height=\"1\" rx=\"0.5\" ry=\"0.5\" width=\"12\" x=\"3\" y=\"15\"/></svg>";
	var videoIcon = "<svg viewbox=\"0 0 18 18\"><rect class=\"ql-stroke\" height=\"12\" width=\"12\" x=\"3\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"5\" y=\"3\"/><rect class=\"ql-fill\" height=\"12\" width=\"1\" x=\"12\" y=\"3\"/><rect class=\"ql-fill\" height=\"2\" width=\"8\" x=\"5\" y=\"8\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"3\" y=\"12\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"5\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"7\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"10\"/><rect class=\"ql-fill\" height=\"1\" width=\"3\" x=\"12\" y=\"12\"/></svg>";
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
		color: colorIcon,
		direction: {
			"": directionLeftToRightIcon,
			rtl: directionRightToLeftIcon
		},
		formula: formulaIcon,
		header: {
			"1": headerIcon,
			"2": header2Icon
		},
		italic: italicIcon,
		image: imageIcon,
		indent: {
			"+1": indentIcon,
			"-1": outdentIcon
		},
		link: linkIcon,
		list: {
			bullet: listBulletIcon,
			check: listCheckIcon,
			ordered: listOrderedIcon
		},
		script: {
			sub: subscriptIcon,
			super: superscriptIcon
		},
		strike: strikeIcon,
		table: tableIcon,
		underline: underlineIcon,
		video: videoIcon
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
//#region ../../node_modules/quill/quill.js
var require_quill = /* @__PURE__ */ __commonJSMin(((exports) => {
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
}));
//#endregion
export { require_quill as t };
