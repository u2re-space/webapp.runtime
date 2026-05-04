import { r as __exportAll } from "./rolldown-runtime.js";
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterState.ts
var WorkCenterState_exports = /* @__PURE__ */ __exportAll({ WorkCenterStateManager: () => WorkCenterStateManager });
var WorkCenterStateManager = class {
	static {
		this.STORAGE_KEY = "rs-workcenter-state";
	}
	static {
		this.TEMPLATES_STORAGE_KEY = "rs-workcenter-templates";
	}
	static createDefaultState() {
		return {
			files: [],
			selectedFiles: [],
			currentPrompt: "",
			autoAction: false,
			selectedInstruction: "",
			outputFormat: "auto",
			activeInputTab: "prompt",
			activeResultsTab: "output",
			selectedLanguage: "auto",
			selectedTemplate: "",
			recognitionFormat: "auto",
			processingFormat: "markdown",
			voiceRecording: false,
			promptTemplates: this.loadPromptTemplates(),
			lastRawResult: null,
			recognizedData: null,
			processedData: null,
			currentProcessingStep: 0,
			...this.loadWorkCenterState()
		};
	}
	static saveState(state) {
		try {
			const stateToSave = {
				currentPrompt: state.currentPrompt,
				autoAction: state.autoAction,
				selectedInstruction: state.selectedInstruction,
				outputFormat: state.outputFormat,
				activeInputTab: state.activeInputTab,
				activeResultsTab: state.activeResultsTab,
				selectedLanguage: state.selectedLanguage,
				selectedTemplate: state.selectedTemplate,
				recognitionFormat: state.recognitionFormat,
				processingFormat: state.processingFormat,
				currentProcessingStep: state.currentProcessingStep,
				recognizedData: state.recognizedData ? {
					timestamp: state.recognizedData.timestamp,
					source: state.recognizedData.source,
					contentLength: state.recognizedData.content.length,
					metadata: state.recognizedData.metadata
				} : null,
				processedData: state.processedData ? state.processedData.map((p) => ({
					timestamp: p.timestamp,
					action: p.action,
					contentLength: p.content.length,
					metadata: p.metadata
				})) : null
			};
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
		} catch (e) {
			console.warn("Failed to save workcenter state:", e);
		}
	}
	static loadWorkCenterState() {
		try {
			const saved = localStorage.getItem(this.STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					currentPrompt: parsed.currentPrompt || "",
					autoAction: parsed.autoAction || false,
					selectedInstruction: parsed.selectedInstruction || "",
					outputFormat: parsed.outputFormat || "auto",
					activeInputTab: (() => {
						const tab = String(parsed.activeInputTab || "prompt");
						return tab === "attachments" || tab === "prompt" ? tab : "prompt";
					})(),
					activeResultsTab: (() => {
						const tab = String(parsed.activeResultsTab || "output");
						return tab === "pipeline" || tab === "history" || tab === "output" ? tab : "output";
					})(),
					selectedLanguage: parsed.selectedLanguage || "auto",
					selectedTemplate: parsed.selectedTemplate || "",
					recognitionFormat: parsed.recognitionFormat || "auto",
					processingFormat: parsed.processingFormat || "markdown",
					currentProcessingStep: parsed.currentProcessingStep || 0
				};
			}
		} catch (e) {
			console.warn("Failed to load workcenter state:", e);
		}
		return {};
	}
	static loadPromptTemplates() {
		const safeJsonParse = (raw, fallback) => {
			if (!raw) return fallback;
			try {
				return JSON.parse(raw) ?? fallback;
			} catch {
				return fallback;
			}
		};
		return safeJsonParse(localStorage.getItem(this.TEMPLATES_STORAGE_KEY), [
			{
				name: "Analyze & Extract",
				prompt: "Analyze the provided content and extract key information, formulas, data, and insights. Identify the main topics, recognize any mathematical expressions or equations, and provide a structured summary."
			},
			{
				name: "Solve Equations",
				prompt: "Find and solve any mathematical equations, problems, or calculations in the content. Show your work step-by-step and provide the final answers."
			},
			{
				name: "Generate Code",
				prompt: "Based on the description or requirements in the content, generate appropriate code. Include comments and explain the implementation."
			},
			{
				name: "Extract Styles",
				prompt: "Analyze the visual content or design description and extract/generate CSS styles, color schemes, and layout information."
			},
			{
				name: "Document Analysis",
				prompt: "Perform a comprehensive analysis of the document, including structure, key points, relationships, and actionable insights."
			},
			{
				name: "Data Processing",
				prompt: "Process and transform the provided data. Extract structured information, identify patterns, and present results in a clear format."
			}
		]);
	}
	static savePromptTemplates(templates) {
		try {
			localStorage.setItem(this.TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
		} catch (e) {
			console.warn("Failed to save prompt templates:", e);
		}
	}
	static clearRecognizedData(state) {
		state.recognizedData = null;
		state.processedData = null;
		state.currentProcessingStep = 0;
	}
	static addProcessedStep(state, step) {
		if (!state.processedData) state.processedData = [];
		state.processedData.push(step);
		state.currentProcessingStep++;
	}
};
//#endregion
export { WorkCenterState_exports as n, WorkCenterStateManager as t };
