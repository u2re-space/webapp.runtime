import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { r as CORE_IMAGE_INSTRUCTION, t as CORE_DATA_CONVERSION_INSTRUCTION } from "./service2.js";
import { i as buildInstructionPrompt, n as SVG_GRAPHICS_ADDON, o as getIntermediateRecognitionInstruction, r as TRANSLATE_INSTRUCTION, s as getOutputFormatInstruction, t as LANGUAGE_INSTRUCTIONS } from "./service7.js";
import { r as loadSettings } from "./service11.js";
import "./service20.js";
import { n as getRuntimeSettings } from "./service22.js";
import { a as unwrapUnwantedCodeBlocks, i as isImageData, n as getGPTInstance, o as getUsableData, r as getResponseFormat } from "./service25.js";
//#region src/com/service/processing/adapters.ts
var detectPlatform = () => {
	try {
		if (typeof chrome !== "undefined" && chrome?.runtime?.id) return "crx";
		if (typeof self !== "undefined" && "ServiceWorkerGlobalScope" in self) return "pwa";
		if (typeof navigator !== "undefined" && "standalone" in navigator) return "pwa";
		return "core";
	} catch {
		return "unknown";
	}
};
//#endregion
//#region src/com/service/processing/settings.ts
var loadAISettings = async () => {
	const platform = detectPlatform();
	try {
		if (platform === "crx") return await loadSettings();
		else return await getRuntimeSettings();
	} catch (e) {
		console.error(`[AI-Service] Failed to load settings for platform ${platform}:`, e);
		return null;
	}
};
var getActiveCustomInstruction = async () => {
	try {
		const { getActiveInstructionText } = await import("./service24.js").then((n) => n.t);
		return await getActiveInstructionText();
	} catch {
		return "";
	}
};
var getLanguageInstruction = async () => {
	try {
		const settings = await loadAISettings();
		const lang = settings?.ai?.responseLanguage || "auto";
		const translate = settings?.ai?.translateResults || false;
		let instruction = LANGUAGE_INSTRUCTIONS[lang] || "";
		if (translate && lang !== "auto" && lang !== "follow") instruction += TRANSLATE_INSTRUCTION;
		return instruction;
	} catch {
		return "";
	}
};
var getSvgGraphicsAddon = async () => {
	try {
		return (await loadAISettings())?.ai?.generateSvgGraphics ? SVG_GRAPHICS_ADDON : "";
	} catch {
		return "";
	}
};
//#endregion
//#region src/com/service/recognition/cache.ts
var RecognitionCache = class {
	cache = /* @__PURE__ */ new Map();
	maxEntries = 100;
	ttl = 1440 * 60 * 1e3;
	generateDataHash(data) {
		if (data instanceof File) return `${data.name}-${data.size}-${data.lastModified}`;
		if (typeof data === "string") return btoa(data).substring(0, 32);
		return JSON.stringify(data).substring(0, 32);
	}
	get(data, format) {
		const hash = this.generateDataHash(data);
		const entry = this.cache.get(hash);
		if (!entry) return null;
		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(hash);
			return null;
		}
		if (format && entry.recognizedAs !== format) return null;
		return entry;
	}
	set(data, recognizedData, recognizedAs, responseId, metadata) {
		const hash = this.generateDataHash(data);
		if (this.cache.size >= this.maxEntries) {
			const oldestKey = Array.from(this.cache.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
			this.cache.delete(oldestKey);
		}
		this.cache.set(hash, {
			dataHash: hash,
			recognizedData,
			recognizedAs,
			timestamp: Date.now(),
			responseId,
			metadata
		});
	}
	clear() {
		this.cache.clear();
	}
	getStats() {
		return {
			entries: this.cache.size,
			maxEntries: this.maxEntries,
			ttl: this.ttl
		};
	}
};
//#endregion
//#region src/com/service/recognition/core.ts
var recognizeImageData = async (input, sendResponse, config, options) => {
	const { recognizeByInstructions } = await Promise.resolve().then(() => unified_exports);
	return recognizeByInstructions(input, CORE_IMAGE_INSTRUCTION, sendResponse, config, options);
};
var convertTextualData = async (input, sendResponse, config, options) => {
	const { recognizeByInstructions } = await Promise.resolve().then(() => unified_exports);
	return recognizeByInstructions(input, CORE_DATA_CONVERSION_INSTRUCTION, sendResponse, config, options);
};
var analyzeRecognizeUnified = async (rawData, sendResponse, config, options) => {
	const content = await getUsableData({ dataSource: rawData });
	const input = [{
		type: "message",
		role: "user",
		content: [content]
	}];
	return content?.[0]?.type === "input_image" || content?.type === "input_image" ? recognizeImageData(input, sendResponse, config, options) : convertTextualData(input, sendResponse, config, options);
};
//#endregion
//#region src/com/service/processing/unified.ts
var unified_exports = /* @__PURE__ */ __exportAll({
	processDataWithInstruction: () => processDataWithInstruction,
	recognizeByInstructions: () => recognizeByInstructions
});
var recognitionCache = new RecognitionCache();
var processDataWithInstruction = async (input, options = {}, sendResponse) => {
	const settings = (await loadSettings())?.ai;
	const { instruction = "", outputFormat = "auto", outputLanguage = "auto", enableSVGImageGeneration = "auto", intermediateRecognition, processingEffort = "low", processingVerbosity = "low", customInstruction, useActiveInstruction = false, includeImageRecognition, dataType } = options;
	const token = settings?.apiKey;
	if (!token) {
		const result = {
			ok: false,
			error: "No API key available"
		};
		sendResponse?.(result);
		return result;
	}
	if (!input) {
		const result = {
			ok: false,
			error: "No input provided"
		};
		sendResponse?.(result);
		return result;
	}
	let finalInstruction = instruction;
	if (customInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, customInstruction);
	else if (useActiveInstruction) {
		const activeInstruction = await getActiveCustomInstruction();
		if (activeInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, activeInstruction);
	}
	const languageInstruction = await getLanguageInstruction();
	if (languageInstruction) finalInstruction += languageInstruction;
	if (enableSVGImageGeneration === true || enableSVGImageGeneration === "auto" && outputFormat === "html") {
		const svgAddon = await getSvgGraphicsAddon();
		if (svgAddon) finalInstruction += svgAddon;
	}
	if (outputFormat !== "auto") {
		const formatInstruction = getOutputFormatInstruction(outputFormat);
		if (formatInstruction) finalInstruction += formatInstruction;
	}
	const gpt = await getGPTInstance({
		apiKey: token,
		baseUrl: settings?.baseUrl,
		model: settings?.model,
		mcp: settings?.mcp
	});
	if (!gpt) {
		const result = {
			ok: false,
			error: "AI initialization failed"
		};
		sendResponse?.(result);
		return result;
	}
	gpt.clearPending();
	let processingStages = 1;
	let recognizedImages = false;
	const intermediateRecognizedData = [];
	if (Array.isArray(input) && (input?.[0]?.type === "message" || input?.[0]?.["role"])) await gpt.getPending()?.push(...input);
	else {
		const inputData = Array.isArray(input) ? input : [input];
		for (const item of inputData) {
			let processedItem = item;
			if (typeof item === "string" && dataType === "svg" || typeof item === "string" && item.trim().startsWith("<svg")) processedItem = item;
			else if (isImageData(item)) {
				recognizedImages = true;
				if (intermediateRecognition?.enabled !== false && (intermediateRecognition?.enabled || includeImageRecognition)) {
					processingStages = 2;
					const cachedResult = !intermediateRecognition?.forceRefresh ? recognitionCache.get(item, intermediateRecognition?.outputFormat) : null;
					let recognizedContent;
					let recognitionResponseId;
					if (cachedResult) {
						recognizedContent = cachedResult.recognizedData;
						recognitionResponseId = cachedResult.responseId;
					} else {
						const recognitionResult = await recognizeByInstructions(item, intermediateRecognition?.dataPriorityInstruction || getIntermediateRecognitionInstruction(intermediateRecognition?.outputFormat || "markdown"), void 0, {
							apiKey: token,
							baseUrl: settings?.baseUrl,
							model: settings?.model,
							mcp: settings?.mcp
						}, {
							customInstruction: void 0,
							useActiveInstruction: false
						});
						if (!recognitionResult.ok || !recognitionResult.data) {
							recognizedContent = "";
							recognitionResponseId = "";
						} else {
							recognizedContent = recognitionResult.data;
							recognitionResponseId = recognitionResult.responseId || "";
							if (intermediateRecognition?.cacheResults !== false) {
								const recognizedAs = intermediateRecognition?.outputFormat || "markdown";
								recognitionCache.set(item, recognizedContent, recognizedAs, recognitionResponseId);
							}
						}
					}
					intermediateRecognizedData.push({
						originalData: item,
						recognizedData: recognizedContent,
						recognizedAs: intermediateRecognition?.outputFormat || "markdown",
						responseId: recognitionResponseId
					});
					if (recognizedContent) processedItem = recognizedContent;
				}
			}
			if (processedItem !== null && processedItem !== void 0) await gpt?.attachToRequest?.(processedItem);
		}
	}
	await gpt.askToDoAction(finalInstruction);
	let response;
	let error;
	try {
		response = await gpt?.sendRequest?.(processingEffort, processingVerbosity, null, {
			responseFormat: getResponseFormat(outputFormat),
			temperature: .3
		});
	} catch (e) {
		error = String(e);
	}
	let parsedResponse = response;
	if (typeof response === "string") try {
		parsedResponse = JSON.parse(response);
	} catch {
		parsedResponse = null;
	}
	const responseContent = parsedResponse?.choices?.[0]?.message?.content;
	let cleanedResponse = responseContent ? unwrapUnwantedCodeBlocks(responseContent.trim()) : null;
	let finalData = cleanedResponse;
	if (cleanedResponse && instruction?.includes("Recognize data from image")) try {
		const parsedJson = JSON.parse(cleanedResponse);
		if (parsedJson?.recognized_data) if (Array.isArray(parsedJson.recognized_data)) finalData = parsedJson.recognized_data.join("\n");
		else if (typeof parsedJson.recognized_data === "string") finalData = parsedJson.recognized_data;
		else finalData = JSON.stringify(parsedJson.recognized_data);
		else if (parsedJson?.ok === false) finalData = null;
		else finalData = cleanedResponse;
	} catch {
		finalData = cleanedResponse;
	}
	const result = {
		ok: !!finalData && !error,
		data: finalData || void 0,
		error: error || (!finalData ? "No data recognized" : void 0),
		responseId: parsedResponse?.id || gpt?.getResponseId?.(),
		processingStages,
		recognizedImages,
		intermediateRecognizedData: intermediateRecognizedData.length > 0 ? intermediateRecognizedData : void 0
	};
	sendResponse?.(result);
	return result;
};
var recognizeByInstructions = async (input, instructions, sendResponse, config, options) => {
	const result = await processDataWithInstruction(input, {
		instruction: instructions,
		customInstruction: options?.customInstruction,
		useActiveInstruction: options?.useActiveInstruction,
		processingEffort: options?.recognitionEffort || "low",
		processingVerbosity: options?.recognitionVerbosity || "low",
		outputFormat: "auto",
		outputLanguage: "auto",
		enableSVGImageGeneration: "auto"
	});
	const legacyResult = {
		ok: result.ok,
		data: result.data,
		error: result.error,
		responseId: result.responseId
	};
	sendResponse?.(legacyResult);
	return legacyResult;
};
//#endregion
export { unified_exports as n, analyzeRecognizeUnified as r, processDataWithInstruction as t };
