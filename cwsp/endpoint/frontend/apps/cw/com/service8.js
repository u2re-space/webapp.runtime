import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as JSOX } from "../vendor/jsox.js";
//#region src/core/storage/WriteFileSmart-v2.ts
var WriteFileSmart_v2_exports = /* @__PURE__ */ __exportAll({ writeFileSmart: () => writeFileSmart });
var lureFsPromise = null;
var getLureFs = () => {
	if (!lureFsPromise) lureFsPromise = import("./app3.js").then((n) => n.t).then((m) => ({
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
export { writeFileSmart as n, WriteFileSmart_v2_exports as t };
