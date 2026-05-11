import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as katex } from "./katex.js";
//#region ../../node_modules/marked-katex-extension/src/index.js
var src_exports = /* @__PURE__ */ __exportAll({ default: () => src_default });
var inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
var inlineRuleNonStandard = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/;
var blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;
function src_default(options = {}) {
	return { extensions: [inlineKatex(options, createRenderer(options, false)), blockKatex(options, createRenderer(options, true))] };
}
function createRenderer(options, newlineAfter) {
	return (token) => katex.renderToString(token.text, {
		...options,
		displayMode: token.displayMode
	}) + (newlineAfter ? "\n" : "");
}
function inlineKatex(options, renderer) {
	const nonStandard = options && options.nonStandard;
	const ruleReg = nonStandard ? inlineRuleNonStandard : inlineRule;
	return {
		name: "inlineKatex",
		level: "inline",
		start(src) {
			let index;
			let indexSrc = src;
			while (indexSrc) {
				index = indexSrc.indexOf("$");
				if (index === -1) return;
				if (nonStandard ? index > -1 : index === 0 || indexSrc.charAt(index - 1) === " ") {
					if (indexSrc.substring(index).match(ruleReg)) return index;
				}
				indexSrc = indexSrc.substring(index + 1).replace(/^\$+/, "");
			}
		},
		tokenizer(src, tokens) {
			const match = src.match(ruleReg);
			if (match) return {
				type: "inlineKatex",
				raw: match[0],
				text: match[2].trim(),
				displayMode: match[1].length === 2
			};
		},
		renderer
	};
}
function blockKatex(options, renderer) {
	return {
		name: "blockKatex",
		level: "block",
		tokenizer(src, tokens) {
			const match = src.match(blockRule);
			if (match) return {
				type: "blockKatex",
				raw: match[0],
				text: match[2].trim(),
				displayMode: match[1].length === 2
			};
		},
		renderer
	};
}
//#endregion
export { src_exports as n, src_default as t };
