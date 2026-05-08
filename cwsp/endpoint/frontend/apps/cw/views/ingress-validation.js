//#region ../../modules/projects/subsystem/src/core/view-ingress-validation.ts
var MAX_DIRECT_FILE_BYTES = 48 * 1024 * 1024;
/** Types that must carry at least one substantive body carrier (file, blob, text, or url). */
var TYPES_REQUIRING_BODY = new Set([
	"content-load",
	"content-view",
	"markdown-content",
	"content-share",
	"content-attach",
	"file-attach"
].map((s) => s.toLowerCase()));
function asDataRecord(message) {
	const d = message.data;
	return d && typeof d === "object" && !Array.isArray(d) ? d : {};
}
function hasFileLike(v) {
	return typeof File !== "undefined" && v instanceof File || typeof Blob !== "undefined" && v instanceof Blob;
}
function carrierPresent(data) {
	if (hasFileLike(data.file) || hasFileLike(data.blob)) return true;
	const files = data.files;
	if (Array.isArray(files) && files.some((x) => hasFileLike(x))) return true;
	if (String(data.path ?? data.into ?? "").trim().length > 0) return true;
	if (String(data.text ?? data.content ?? "").trim().length > 0) return true;
	return String(data.url ?? "").trim().length > 0;
}
/**
* Drop structurally empty envelopes before shell settle / handleMessage (noise from replays).
*/
function validateIngressBeforeViewHandle(message, mappedType) {
	const mt = String(mappedType || "").toLowerCase();
	if (!TYPES_REQUIRING_BODY.has(mt)) return { ok: true };
	const data = asDataRecord(message);
	if (!carrierPresent(data)) return {
		ok: false,
		reason: "missing-body-carrier"
	};
	const f = data.file;
	if (typeof File !== "undefined" && f instanceof File && f.size > MAX_DIRECT_FILE_BYTES) return {
		ok: false,
		reason: `file-too-large>${MAX_DIRECT_FILE_BYTES}`
	};
	if (Array.isArray(data.files)) {
		for (const x of data.files) if (typeof File !== "undefined" && x instanceof File && x.size > MAX_DIRECT_FILE_BYTES) return {
			ok: false,
			reason: `files-array-too-large>${MAX_DIRECT_FILE_BYTES}`
		};
	}
	return { ok: true };
}
/**
* After `File#text()` / network read: refuse obvious binary garbage mis-tagged as markdown.
* WHY: avoids blanking the viewer with mojibake or PDF bytes when MIME/name were wrong.
*/
function textIngressLooksCorrupt(text) {
	if (!text || text.length === 0) return false;
	const cap = Math.min(text.length, 16384);
	let nul = 0;
	let control = 0;
	for (let i = 0; i < cap; i++) {
		const c = text.charCodeAt(i);
		if (c === 0) nul++;
		if (c < 32 && c !== 9 && c !== 10 && c !== 13) control++;
	}
	if (nul > 2) return true;
	if (control / cap > .02 && text.length < 64 * 1024) return true;
	const head = text.slice(0, 512).trimStart();
	if (head.startsWith("%PDF")) return true;
	if (head.startsWith("PK")) return true;
	return false;
}
/**
* Pick authoritative file for staged transfers: optional hint match, then text-like, then markdown extension.
*/
function pickAuthoritativeTransferFiles(files, opts) {
	const list = files.filter((f) => f instanceof File);
	if (list.length === 0) return null;
	const hint = (opts.hintFilename || "").trim().toLowerCase();
	if (hint) {
		const byHint = list.find((f) => String(f.name || "").trim().toLowerCase() === hint);
		if (byHint) return byHint;
		const partial = list.find((f) => String(f.name || "").trim().toLowerCase().endsWith(hint));
		if (partial) return partial;
	}
	const texty = list.find((f) => opts.isTextLike(f));
	if (texty) return texty;
	return list.find((f) => /\.(md|markdown|mdown|mkdn|mkd)(?:$|\?)/i.test(f.name || "")) ?? list[0] ?? null;
}
function validateReadableFileForIngress(file) {
	if (!(file instanceof File)) return {
		ok: false,
		reason: "not-a-file"
	};
	if (file.size > MAX_DIRECT_FILE_BYTES) return {
		ok: false,
		reason: "file-too-large"
	};
	return { ok: true };
}
//#endregion
export { validateReadableFileForIngress as i, textIngressLooksCorrupt as n, validateIngressBeforeViewHandle as r, pickAuthoritativeTransferFiles as t };
