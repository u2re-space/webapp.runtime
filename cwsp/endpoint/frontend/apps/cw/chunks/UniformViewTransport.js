import { r as createProtocolEnvelope } from "../fest/uniform.js";
import { d as sendProtocolMessage } from "./UnifiedMessaging.js";
import { s as normalizeDataAsset } from "../com/app.js";
//#region src/shared/channel/UniformViewTransport.ts
var asNamePrefix = (source) => {
	return String(source || "attachment").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "attachment";
};
var normalizeIpcAttachments = async (inputs, source = "view-ipc") => {
	const out = [];
	for (const raw of inputs) {
		const candidate = raw && typeof raw === "object" && "data" in raw ? raw.data : raw;
		if (!candidate) continue;
		try {
			const inferredSource = raw && typeof raw === "object" && "source" in raw ? String(raw.source || source) : source;
			const asset = await normalizeDataAsset(candidate, {
				namePrefix: asNamePrefix(inferredSource),
				uriComponent: true
			});
			out.push({
				hash: String(asset.hash || ""),
				name: String(asset.name || asset.file?.name || "attachment"),
				mimeType: String(asset.mimeType || asset.type || asset.file?.type || "application/octet-stream"),
				size: Number(asset.size || asset.file?.size || 0),
				source: inferredSource,
				data: asset.file
			});
		} catch (error) {
			console.warn("[UniformViewTransport] Attachment normalization failed:", error);
		}
	}
	return out;
};
var sendViewProtocolMessage = async (input) => {
	const attachments = await normalizeIpcAttachments(input.attachments || [], input.source);
	const data = {
		...input.data || {},
		...attachments.length > 0 ? {
			attachments,
			file: attachments[0]?.data,
			files: attachments.map((entry) => entry.data)
		} : {}
	};
	return sendProtocolMessage(createProtocolEnvelope({
		type: input.type,
		source: input.source,
		destination: input.destination,
		contentType: input.contentType,
		data,
		purpose: input.purpose || (attachments.length > 0 ? ["attach", "deliver"] : ["deliver", "mail"]),
		protocol: "window",
		op: input.op || (attachments.length > 0 ? "attach" : "deliver"),
		srcChannel: input.source,
		dstChannel: input.destination,
		metadata: {
			...input.metadata || {},
			attachmentCount: attachments.length
		}
	}));
};
//#endregion
export { sendViewProtocolMessage as n, normalizeIpcAttachments as t };
