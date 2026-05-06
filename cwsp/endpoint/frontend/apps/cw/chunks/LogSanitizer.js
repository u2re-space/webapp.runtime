import { c as parseDataUrl, o as isBase64Like } from "../vendor/jsox.js";
//#region ../../modules/projects/subsystem/src/routing/channel/LogSanitizer.ts
var DEFAULT_OPTIONS = {
	maxStringLength: 180,
	maxArrayLength: 8,
	maxObjectKeys: 20,
	maxDepth: 3
};
var isFileLike = (value) => typeof File !== "undefined" && value instanceof File;
var isBlobLike = (value) => typeof Blob !== "undefined" && value instanceof Blob;
var summarizeString = (value, maxStringLength) => {
	if (!value) return value;
	const parsedDataUrl = parseDataUrl(value);
	if (parsedDataUrl) return `[data-url ${parsedDataUrl.mimeType || "application/octet-stream"}, length=${value.length}]`;
	if (value.length > maxStringLength && isBase64Like(value)) return `[base64-like string, length=${value.length}]`;
	if (value.length > maxStringLength) return `${value.slice(0, maxStringLength)}... [truncated ${value.length - maxStringLength} chars]`;
	return value;
};
var summarizeFormData = (formData, options) => {
	const entries = Array.from(formData.entries());
	const keys = [...new Set(entries.map(([key]) => key))];
	const preview = {};
	for (const key of keys.slice(0, options.maxObjectKeys)) preview[key] = formData.getAll(key).slice(0, options.maxArrayLength).map((entry) => {
		if (typeof entry === "string") return summarizeString(entry, options.maxStringLength);
		if (isFileLike(entry)) return {
			file: entry.name,
			type: entry.type,
			size: entry.size
		};
		return summarizeForLog(entry, options);
	});
	return {
		kind: "FormData",
		keyCount: keys.length,
		keys,
		preview
	};
};
var summarizeRecord = (value, options, depth, seen) => {
	if (depth >= options.maxDepth) return `[object depth>${options.maxDepth}]`;
	if (seen.has(value)) return "[circular]";
	seen.add(value);
	const entries = Object.entries(value);
	const sliced = entries.slice(0, options.maxObjectKeys);
	const summary = {};
	for (const [key, entryValue] of sliced) summary[key] = summarizeUnknown(entryValue, options, depth + 1, seen);
	if (entries.length > options.maxObjectKeys) summary.__truncatedKeys = entries.length - options.maxObjectKeys;
	return summary;
};
var summarizeUnknown = (value, options, depth, seen) => {
	if (value == null) return value;
	if (typeof value === "string") return summarizeString(value, options.maxStringLength);
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return value;
	if (typeof value === "symbol") return value.toString();
	if (typeof value === "function") return `[function ${value.name || "anonymous"}]`;
	if (typeof FormData !== "undefined" && value instanceof FormData) return summarizeFormData(value, options);
	if (isFileLike(value)) return {
		file: value.name,
		type: value.type,
		size: value.size
	};
	if (isBlobLike(value)) return {
		blob: true,
		type: value.type,
		size: value.size
	};
	if (Array.isArray(value)) {
		if (depth >= options.maxDepth) return `[array(${value.length}) depth>${options.maxDepth}]`;
		const summary = value.slice(0, options.maxArrayLength).map((item) => summarizeUnknown(item, options, depth + 1, seen));
		if (value.length > options.maxArrayLength) summary.push(`[${value.length - options.maxArrayLength} more items]`);
		return summary;
	}
	if (typeof value === "object") return summarizeRecord(value, options, depth, seen);
	return String(value);
};
var summarizeForLog = (value, partialOptions = {}) => {
	return summarizeUnknown(value, {
		...DEFAULT_OPTIONS,
		...partialOptions
	}, 0, /* @__PURE__ */ new WeakSet());
};
//#endregion
export { summarizeForLog as t };
