import { c as ROUTE_HASHES } from "./UniformInterop.js";
import { a as initializeComponent, s as registerComponent, u as sendMessage } from "./UnifiedMessaging.js";
import { n as consumeCachedShareTargetPayload, r as fetchCachedShareFiles } from "./ShareTargetGateway.js";
import { P as H, c as parseDataUrl, o as isBase64Like, s as normalizeDataAsset } from "../vendor/jsox.js";
import { t as summarizeForLog } from "./LogSanitizer.js";
import { t as renderMathInElement } from "../vendor/katex2.js";
import { t as g } from "../vendor/marked.js";
import { t as src_default } from "../vendor/marked-katex-extension.js";
import { i as buildInstructionPrompt } from "./utils.js";
import { a as getCustomInstructions, o as getInstructionRegistry, s as setActiveInstruction } from "./CustomInstructions.js";
import { o as toBase64 } from "../vendor/@toon-format_toon.js";
import { t as processDataWithInstruction } from "./unified.js";
import { t as WorkCenterStateManager } from "./WorkCenterState.js";
import { t as WorkCenterDataProcessing } from "./WorkCenterDataProcessing.js";
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterUI.ts
/**
* DOM composition layer for the Work Center view.
*
* This class assembles the visual shell around attachments, prompts, results,
* and history submodules so the higher-level controller can coordinate one
* unified AI workspace without hardcoding markup in every collaborator.
*/
/** View-composition facade for the Work Center feature. */
var WorkCenterUI = class {
	container = null;
	deps;
	attachments;
	prompts;
	results;
	history;
	constructor(dependencies, attachments, prompts, results, history) {
		this.deps = dependencies;
		this.attachments = attachments;
		this.prompts = prompts;
		this.results = results;
		this.history = history;
	}
	setContainer(container) {
		this.container = container;
		this.attachments.setContainer(container);
		this.prompts.setContainer(container);
		this.results.setContainer(container);
		this.history.setContainer(container);
	}
	getContainer() {
		return this.container;
	}
	/** Render the top-level Work Center layout and wire child modules to the new container. */
	renderWorkCenterView(state) {
		const container = H`<div class="workcenter-view">
      <div class="workcenter-header">
        <h2>AI Work Center</h2>
        <div class="header-controls" aria-label="AI work center output and processing options">
          <div class="control-selectors">
          <div class="format-selector">
            <label title="Output format for AI responses">Output</label>
            <select class="format-select">
              <option value="auto" ${state.outputFormat === "auto" ? "selected" : ""}>Auto</option>
              <option value="markdown" ${state.outputFormat === "markdown" ? "selected" : ""}>Markdown</option>
              <option value="json" ${state.outputFormat === "json" ? "selected" : ""}>JSON</option>
              <option value="code" ${state.outputFormat === "code" ? "selected" : ""}>Code</option>
              <option value="raw" ${state.outputFormat === "raw" ? "selected" : ""}>Raw Text</option>
              <option value="text" ${state.outputFormat === "text" ? "selected" : ""}>Plain Text</option>
              <option value="html" ${state.outputFormat === "html" ? "selected" : ""}>HTML</option>
            </select>
          </div>
          <div class="language-selector">
            <label title="Response language">Language</label>
            <select class="language-select">
              <option value="auto" ${state.selectedLanguage === "auto" ? "selected" : ""}>Auto</option>
              <option value="en" ${state.selectedLanguage === "en" ? "selected" : ""}>English</option>
              <option value="ru" ${state.selectedLanguage === "ru" ? "selected" : ""}>Русский</option>
            </select>
          </div>
          <div class="recognition-selector">
            <label title="How to recognize incoming content">Recognize</label>
            <select class="recognition-select">
              <option value="auto" ${state.recognitionFormat === "auto" ? "selected" : ""}>Auto</option>
              <option value="most-suitable" ${state.recognitionFormat === "most-suitable" ? "selected" : ""}>Most Suitable</option>
              <option value="most-optimized" ${state.recognitionFormat === "most-optimized" ? "selected" : ""}>Most Optimized</option>
              <option value="most-legibility" ${state.recognitionFormat === "most-legibility" ? "selected" : ""}>Most Legible</option>
              <option value="markdown" ${state.recognitionFormat === "markdown" ? "selected" : ""}>Markdown</option>
              <option value="html" ${state.recognitionFormat === "html" ? "selected" : ""}>HTML</option>
              <option value="text" ${state.recognitionFormat === "text" ? "selected" : ""}>Plain Text</option>
              <option value="json" ${state.recognitionFormat === "json" ? "selected" : ""}>JSON</option>
            </select>
          </div>
          <div class="processing-selector">
            <label title="Treat content as this format when processing">Process</label>
            <select class="processing-select">
              <option value="markdown" ${state.processingFormat === "markdown" ? "selected" : ""}>Markdown</option>
              <option value="html" ${state.processingFormat === "html" ? "selected" : ""}>HTML</option>
              <option value="json" ${state.processingFormat === "json" ? "selected" : ""}>JSON</option>
              <option value="text" ${state.processingFormat === "text" ? "selected" : ""}>Plain Text</option>
              <option value="typescript" ${state.processingFormat === "typescript" ? "selected" : ""}>TypeScript</option>
              <option value="javascript" ${state.processingFormat === "javascript" ? "selected" : ""}>JavaScript</option>
              <option value="python" ${state.processingFormat === "python" ? "selected" : ""}>Python</option>
              <option value="java" ${state.processingFormat === "java" ? "selected" : ""}>Java</option>
              <option value="cpp" ${state.processingFormat === "cpp" ? "selected" : ""}>C++</option>
              <option value="csharp" ${state.processingFormat === "csharp" ? "selected" : ""}>C#</option>
              <option value="php" ${state.processingFormat === "php" ? "selected" : ""}>PHP</option>
              <option value="ruby" ${state.processingFormat === "ruby" ? "selected" : ""}>Ruby</option>
              <option value="go" ${state.processingFormat === "go" ? "selected" : ""}>Go</option>
              <option value="rust" ${state.processingFormat === "rust" ? "selected" : ""}>Rust</option>
              <option value="xml" ${state.processingFormat === "xml" ? "selected" : ""}>XML</option>
              <option value="yaml" ${state.processingFormat === "yaml" ? "selected" : ""}>YAML</option>
              <option value="css" ${state.processingFormat === "css" ? "selected" : ""}>CSS</option>
              <option value="scss" ${state.processingFormat === "scss" ? "selected" : ""}>SCSS</option>
            </select>
          </div>
          </div>
        </div>
      </div>

      <div class="workcenter-content">
        <div class="workcenter-layout">

          <!-- Results & Processing Section -->
          <div class="workcenter-block results-block">
            <div class="results-section">
              ${this.renderResultsTabs(state)}
            </div>
          </div>

          <!-- Input Prompts Section -->
          <div class="workcenter-block prompts-block">
            ${this.renderInputTabs(state)}
          </div>
        </div>
      </div>
    </div>`;
		this.container = container;
		this.attachments.setContainer(container);
		this.prompts.setContainer(container);
		this.results.setContainer(container);
		this.history.setContainer(container);
		this.initializeUI(state);
		return container;
	}
	/** Synchronize child widgets after the root container has been created or replaced. */
	initializeUI(state) {
		this.attachments.setupDropZone(state);
		this.attachments.updateFileList(state);
		this.attachments.updateFileCounter(state);
		this.prompts.updatePromptFileCount(state);
		this.updateInputTabFileCount(state);
		this.updateResultsPipelineTabState(state);
		this.history.updateRecentHistory(state);
	}
	updateFileCounter(state) {
		this.attachments.updateFileCounter(state);
		this.prompts.updatePromptFileCount(state);
		this.updateInputTabFileCount(state);
	}
	updateFileList(state) {
		this.attachments.updateFileList(state);
		this.prompts.updatePromptFileCount(state);
		this.updateInputTabFileCount(state);
	}
	updatePromptInput(state) {
		this.prompts.updatePromptInput(state);
	}
	updateTemplateSelect(state) {
		this.prompts.updateTemplateSelect(state);
	}
	updateVoiceButton(state) {
		this.prompts.updateVoiceButton(state);
	}
	updateDataPipeline(state) {
		this.results.updateDataPipeline(state);
		this.updateResultsPipelineTabState(state);
	}
	updateDataCounters(state) {
		this.attachments.updateDataCounters(state);
	}
	showProcessingMessage(message) {
		this.results.showProcessingMessage(message);
	}
	showResult(state) {
		this.results.showResult(state);
	}
	showError(error) {
		this.results.showError(error);
	}
	clearResults() {
		this.results.clearResults();
	}
	revokeAllPreviewUrls(state) {
		this.attachments.revokeAllPreviewUrls(state);
	}
	renderInputTabs(state) {
		const activeTab = state.activeInputTab || "prompt";
		return `
            <div class="input-tabs-section" data-input-tabs data-active-tab="${activeTab}">
                <div class="wc-block-header">
                    <div class="input-tab-actions">
                        <button class="tab-btn ${activeTab === "prompt" ? "is-active" : ""}" data-action="switch-input-tab" data-tab="prompt" aria-selected="${activeTab === "prompt"}">Prompt</button>
                        <button class="tab-btn ${activeTab === "attachments" ? "is-active" : ""}" data-action="switch-input-tab" data-tab="attachments" aria-selected="${activeTab === "attachments"}">Files (${state.files.length})</button>
                    </div>
                    <h3>Work Inputs</h3>
                    <div class="file-actions">
                        <button class="btn btn-icon" data-action="select-files" title="Choose Files">
                            <ui-icon icon="folder-open" size="18" icon-style="duotone"></ui-icon>
                            <span class="btn-text">Add Files</span>
                        </button>
                        <button class="btn btn-icon" data-action="clear-all-files" title="Clear All Files">
                            <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                            <span class="btn-text">Clear All</span>
                        </button>
                    </div>
                </div>
                <div class="input-tab-panels">
                    <section class="tab-panel ${activeTab === "prompt" ? "is-active" : ""}" data-tab-panel="prompt">
                        ${this.prompts.renderPromptPanel(state)}
                    </section>
                    <section class="tab-panel ${activeTab === "attachments" ? "is-active" : ""}" data-tab-panel="attachments">
                        ${this.attachments.renderAttachmentsSection(state)}
                    </section>
                </div>
            </div>
        `;
	}
	renderResultsTabs(state) {
		const hasPipelineData = Boolean(state.recognizedData || state.processedData && state.processedData.length > 0);
		const pipelineCount = (state.recognizedData ? 1 : 0) + (state.processedData?.length || 0);
		const activeTab = state.activeResultsTab === "pipeline" && !hasPipelineData ? "output" : state.activeResultsTab;
		return `
            <div class="results-tabs-section" data-results-tabs data-active-tab="${activeTab}">
                <div class="wc-block-header results-tabs-header">
                    <div class="results-tab-actions">
                        <button class="tab-btn ${activeTab === "output" ? "is-active" : ""}" data-action="switch-results-tab" data-tab="output" aria-selected="${activeTab === "output"}">Output</button>
                        <button class="tab-btn ${activeTab === "pipeline" ? "is-active" : ""}" data-action="switch-results-tab" data-tab="pipeline" aria-selected="${activeTab === "pipeline"}"${hasPipelineData ? "" : " disabled"}>Pipeline (${pipelineCount})</button>
                        <button class="tab-btn ${activeTab === "history" ? "is-active" : ""}" data-action="switch-results-tab" data-tab="history" aria-selected="${activeTab === "history"}">History</button>
                    </div>
                    <h3>Results & Processing</h3>
                    ${this.results.renderOutputHeader()}
                </div>
                <div class="results-tab-panels">
                    <section class="results-tab-panel ${activeTab === "output" ? "is-active" : ""}" data-results-tab-panel="output">
                        <div class="wc-output-section">
                            ${this.results.renderOutputContent()}
                        </div>
                    </section>
                    <section class="results-tab-panel ${activeTab === "pipeline" ? "is-active" : ""}" data-results-tab-panel="pipeline">
                        ${hasPipelineData ? this.results.renderDataPipeline(state) : "<div class=\"wc-results-empty\">No data pipeline yet</div>"}
                    </section>
                    <section class="results-tab-panel ${activeTab === "history" ? "is-active" : ""}" data-results-tab-panel="history">
                        <div class="history-section">
                            <div class="history-header">
                                <h4>Recent Activity</h4>
                                <div class="result-actions">
                                    <button class="btn btn-icon" data-action="view-action-history" title="View Action History">
                                        <ui-icon icon="history" size="18" icon-style="duotone"></ui-icon>
                                        <span class="btn-text">History</span>
                                    </button>
                                    <button class="btn" data-action="view-full-history">View All History</button>
                                </div>
                            </div>
                            <div class="recent-history" data-recent-history></div>
                            <div class="action-stats" data-action-stats style="display: none;"></div>
                        </div>
                    </section>
                </div>
            </div>
        `;
	}
	updateInputTabFileCount(state) {
		if (!this.container) return;
		const filesTabBtn = this.container.querySelector("[data-action=\"switch-input-tab\"][data-tab=\"attachments\"]");
		if (filesTabBtn) filesTabBtn.textContent = `Files (${state.files.length})`;
	}
	updateResultsPipelineTabState(state) {
		if (!this.container) return;
		const hasPipelineData = Boolean(state.recognizedData || state.processedData && state.processedData.length > 0);
		const pipelineCount = (state.recognizedData ? 1 : 0) + (state.processedData?.length || 0);
		const tabsRoot = this.container.querySelector("[data-results-tabs]");
		const pipelineTabBtn = this.container.querySelector("[data-action=\"switch-results-tab\"][data-tab=\"pipeline\"]");
		if (!tabsRoot || !pipelineTabBtn) return;
		pipelineTabBtn.textContent = `Pipeline (${pipelineCount})`;
		pipelineTabBtn.disabled = !hasPipelineData;
		const activeTab = tabsRoot.getAttribute("data-active-tab") || "output";
		if (!hasPipelineData && activeTab === "pipeline") {
			tabsRoot.setAttribute("data-active-tab", "output");
			state.activeResultsTab = "output";
			const outputBtn = this.container.querySelector("[data-action=\"switch-results-tab\"][data-tab=\"output\"]");
			if (outputBtn) {
				outputBtn.classList.add("is-active");
				outputBtn.setAttribute("aria-selected", "true");
			}
			pipelineTabBtn.classList.remove("is-active");
			pipelineTabBtn.setAttribute("aria-selected", "false");
			const outputPanel = this.container.querySelector("[data-results-tab-panel=\"output\"]");
			const pipelinePanel = this.container.querySelector("[data-results-tab-panel=\"pipeline\"]");
			outputPanel?.classList.add("is-active");
			pipelinePanel?.classList.remove("is-active");
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterFileOps.ts
var WorkCenterFileOps = class {
	deps;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	async handleDroppedContent(state, content, sourceType) {
		switch (this.getCurrentHash()) {
			case ROUTE_HASHES.SHARE_TARGET_TEXT: if (sourceType === "text" || sourceType === "html") return this.handlePastedContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts text content. Please paste text or use the files route for file drops.");
				return;
			}
			case ROUTE_HASHES.SHARE_TARGET_IMAGE: if (this.isImageContent(content) || sourceType === "image") return this.handleImageContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts image content. Please drop images or use other routes for different content types.");
				return;
			}
			case ROUTE_HASHES.SHARE_TARGET_FILES: return this.handlePastedContent(state, content, sourceType);
			case ROUTE_HASHES.SHARE_TARGET_URL: if (this.isValidUrl(content)) return this.handlePastedContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts URLs. Please paste a valid URL.");
				return;
			}
			default: return this.handlePastedContent(state, content, sourceType);
		}
	}
	async handlePastedContent(state, content, sourceType) {
		const currentHash = this.getCurrentHash();
		try {
			switch (currentHash) {
				case ROUTE_HASHES.SHARE_TARGET_TEXT:
					if (sourceType === "text" || sourceType === "html") await this.handleTextContent(state, content, sourceType);
					else this.deps.showMessage?.("This route only accepts text content");
					break;
				case ROUTE_HASHES.SHARE_TARGET_URL:
					if (this.isValidUrl(content)) await this.handleUrlContent(state, content);
					else this.deps.showMessage?.("This route only accepts valid URLs");
					break;
				case ROUTE_HASHES.SHARE_TARGET_IMAGE:
					if (this.isImageContent(content) || this.isBase64Data(content)) await this.handleImageContent(state, content, sourceType);
					else this.deps.showMessage?.("This route only accepts image content");
					break;
				default:
					await this.handleDefaultPaste(state, content, sourceType);
					break;
			}
		} catch (error) {
			console.error("[WorkCenter] Failed to handle pasted content:", error);
			this.deps.showMessage?.("Failed to process pasted content");
		}
	}
	isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}
	isBase64Data(content) {
		const raw = (content || "").trim();
		return !!parseDataUrl(raw) || isBase64Like(raw);
	}
	async handleBase64Content(state, content) {
		try {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "pasted-data",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("Encoded content decoded and added to work center");
		} catch (error) {
			console.error("[WorkCenter] Failed to decode base64 content:", error);
			const fallbackAsset = await normalizeDataAsset(content, {
				namePrefix: "pasted-text",
				mimeType: "text/plain;charset=utf-8"
			});
			state.files.push(fallbackAsset.file);
			this.deps.showMessage?.("Base64 content added as text to work center");
		}
	}
	addFilesFromInput(state, files) {
		const fileArray = Array.from(files);
		const currentHash = this.getCurrentHash();
		let filteredFiles = fileArray;
		switch (currentHash) {
			case ROUTE_HASHES.SHARE_TARGET_IMAGE:
				filteredFiles = fileArray.filter((file) => file.type.startsWith("image/"));
				if (filteredFiles.length === 0) {
					this.deps.showMessage?.("This route only accepts image files. Please drop images or use other routes for different file types.");
					return;
				}
				break;
			case ROUTE_HASHES.SHARE_TARGET_TEXT:
				filteredFiles = fileArray.filter((file) => file.type.startsWith("text/") || file.type === "application/json" || file.type === "application/xml" || file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md") || file.name.toLowerCase().endsWith(".json") || file.name.toLowerCase().endsWith(".xml"));
				if (filteredFiles.length === 0) {
					this.deps.showMessage?.("This route only accepts text files. Please drop text files or use the files route for other file types.");
					return;
				}
				break;
			case ROUTE_HASHES.SHARE_TARGET_FILES:
				filteredFiles = fileArray;
				break;
			case ROUTE_HASHES.SHARE_TARGET_URL:
				this.deps.showMessage?.("This route only accepts URLs. Please paste a URL instead of dropping files.");
				return;
			default:
				filteredFiles = fileArray;
				break;
		}
		state.files.push(...filteredFiles);
		if (filteredFiles.length > 0) {
			const fileCount = filteredFiles.length;
			const fileWord = fileCount === 1 ? "file" : "files";
			this.deps.showMessage?.(`${fileCount} ${fileWord} added to work center`);
		}
	}
	removeFile(state, index) {
		if (index >= 0 && index < state.files.length) return state.files.splice(index, 1)[0];
		return null;
	}
	clearAllFiles(state) {
		const files = [...state.files];
		state.files.length = 0;
		return files;
	}
	getFilesForProcessing(state) {
		return [...state.files];
	}
	hasFiles(state) {
		return state.files.length > 0;
	}
	hasTextFiles(state) {
		return state.files.some((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f.name?.endsWith(".md") || f.name?.endsWith(".txt"));
	}
	determineRecognizedFormat(state) {
		if (!this.hasTextFiles(state)) return "markdown";
		else return "markdown";
	}
	validateFileForUpload(file) {
		if (file.size > 50 * 1024 * 1024) return {
			valid: false,
			reason: "File too large (max 50MB)"
		};
		if (![
			"image/",
			"text/",
			"application/pdf",
			"application/json",
			"application/markdown",
			"application/xml"
		].some((type) => file.type.startsWith(type) || file.name.toLowerCase().endsWith(type.replace("application/", ".")))) return {
			valid: false,
			reason: "File type not supported"
		};
		return { valid: true };
	}
	getCurrentHash() {
		return typeof globalThis !== "undefined" ? globalThis?.location?.hash : "";
	}
	async handleTextContent(state, content, sourceType) {
		const asset = await normalizeDataAsset(content, {
			namePrefix: sourceType === "html" ? "shared-html" : "shared-text",
			mimeType: sourceType === "html" ? "text/html" : "text/plain;charset=utf-8"
		});
		state.files.push(asset.file);
		this.deps.showMessage?.("Text content added to work center");
	}
	async handleUrlContent(state, content) {
		const asset = await normalizeDataAsset(content, {
			namePrefix: "shared-url",
			uriComponent: true
		});
		state.files.push(asset.file);
		this.deps.showMessage?.("URL added to work center");
	}
	async handleImageContent(state, content, sourceType) {
		if (this.isBase64Data(content)) await this.handleBase64Content(state, content);
		else {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "shared-image",
				mimeType: sourceType === "image" ? "image/png" : "text/plain;charset=utf-8",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("Image content added to work center");
		}
	}
	async handleDefaultPaste(state, content, sourceType) {
		if (this.isValidUrl(content)) {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "pasted-url",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("URL added to work center");
		} else if (this.isBase64Data(content)) await this.handleBase64Content(state, content);
		else {
			const asset = await normalizeDataAsset(content, {
				namePrefix: `pasted-${sourceType || "text"}`,
				mimeType: sourceType === "html" ? "text/html" : "text/plain;charset=utf-8"
			});
			state.files.push(asset.file);
			this.deps.showMessage?.(`${sourceType === "html" ? "HTML" : "Text"} content added to work center`);
		}
	}
	isImageContent(content) {
		return content.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(content);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterShareTarget.ts
var WorkCenterShareTarget = class {
	deps;
	_fileOps;
	constructor(dependencies, fileOps) {
		this.deps = dependencies;
		this._fileOps = fileOps;
		this._fileOps;
	}
	initShareTargetListener(_state) {
		console.log("[WorkCenter] Share target result listener initialized via unified messaging");
	}
	async processQueuedMessages(_state) {
		try {
			console.log("[WorkCenter] Queued message processing handled by unified messaging");
			const payload = await consumeCachedShareTargetPayload({ clear: true });
			if (payload) {
				const meta = payload.meta && typeof payload.meta === "object" ? payload.meta : {};
				await this.addShareTargetInput(_state, {
					files: payload.files,
					title: typeof meta.title === "string" ? meta.title : "",
					text: typeof meta.text === "string" ? meta.text : "",
					url: typeof meta.url === "string" ? meta.url : "",
					timestamp: typeof meta.timestamp === "number" ? meta.timestamp : Date.now(),
					source: "share-target-cache"
				});
			}
		} catch (error) {
			console.error("[WorkCenter] Failed to process queued messages:", error);
		}
	}
	handleShareTargetMessage(state, event) {
		const { type, data, pingId } = event.data || {};
		if (type === "ping" && pingId) return;
		else if (type === "share-target-result" && data) {
			console.log("[WorkCenter] Received share target result:", summarizeForLog(data));
			this.addShareTargetResult(state, data);
		} else if (type === "share-target-input" && data) {
			console.log("[WorkCenter] Received share target input:", summarizeForLog(data));
			this.addShareTargetInput(state, data);
		} else if (type === "ai-result" && data) {
			console.log("[WorkCenter] Received AI processing result:", summarizeForLog(data));
			this.handleAIResult(state, data);
		} else if (type === "content-cached" && data) {
			console.log("[WorkCenter] Received cached content from SW:", summarizeForLog(data));
			this.handleCachedContent(state, data);
		} else if (type === "content-received" && data) {
			console.log("[WorkCenter] Received content from SW:", summarizeForLog(data));
			this.handleReceivedContent(state, data);
		}
	}
	async addShareTargetResult(state, resultData) {
		const processedEntry = {
			content: resultData.content || "",
			timestamp: resultData.timestamp || Date.now(),
			action: resultData.action || "Share Target Processing",
			sourceData: resultData.rawData,
			metadata: {
				source: resultData.source || "share-target",
				...resultData.metadata
			}
		};
		const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
		WorkCenterStateManager.addProcessedStep(state, processedEntry);
		state.lastRawResult = resultData.rawData ?? resultData.content ?? null;
		WorkCenterStateManager.saveState(state);
		this.deps.showMessage?.(`Share target result added to work center`);
		this.deps.render?.();
	}
	async addShareTargetInput(state, inputData) {
		console.log("[WorkCenter] Adding share target input:", summarizeForLog(inputData));
		try {
			let filesAdded = 0;
			let textAdded = false;
			const fileFingerprint = (file) => `${String(file.name || "").trim().toLowerCase()}::${Number(file.size || 0)}::${String(file.type || "").trim().toLowerCase()}`;
			const seenFingerprints = new Set((state.files || []).map(fileFingerprint));
			const pushUniqueFile = (file) => {
				const key = fileFingerprint(file);
				if (seenFingerprints.has(key)) return false;
				seenFingerprints.add(key);
				state.files.push(file);
				return true;
			};
			const normalizeIncomingFile = async (raw) => {
				if (!raw) return null;
				if (raw instanceof File) return raw;
				if (raw instanceof Blob) return new File([raw], `shared-${Date.now()}`, { type: raw.type || "application/octet-stream" });
				const candidate = raw;
				if (candidate?.blob instanceof Blob) {
					const blob = candidate.blob;
					const name = typeof candidate.name === "string" && candidate.name.trim() ? candidate.name : `shared-${Date.now()}`;
					const lastModified = Number(candidate.lastModified || Date.now());
					return new File([blob], name, {
						type: String(candidate.type || blob.type || "application/octet-stream"),
						lastModified: Number.isFinite(lastModified) ? lastModified : Date.now()
					});
				}
				return null;
			};
			const attachmentFiles = Array.isArray(inputData.attachments) ? inputData.attachments.map((entry) => entry?.data).filter((entry) => entry instanceof File || entry instanceof Blob) : [];
			if ([...Array.isArray(inputData.files) ? inputData.files : [], ...attachmentFiles].length > 0) for (const file of inputData.files) {
				const normalized = await normalizeIncomingFile(file);
				if (normalized && pushUniqueFile(normalized)) filesAdded++;
			}
			if (filesAdded === 0 && Number(inputData?.fileCount || 0) > 0) try {
				const cached = await consumeCachedShareTargetPayload({ clear: false });
				const cachedFiles = Array.isArray(cached?.files) ? cached.files : [];
				if (cachedFiles.length > 0) {
					for (const cachedFile of cachedFiles) if (cachedFile instanceof File && pushUniqueFile(cachedFile)) filesAdded++;
				}
			} catch (cacheError) {
				console.warn("[WorkCenter] Failed to hydrate cached share files:", cacheError);
			}
			if (inputData.text && typeof inputData.text === "string" && inputData.text.trim()) {
				const textBlob = new Blob([inputData.text], { type: "text/plain" });
				if (pushUniqueFile(new File([textBlob], "shared-text.txt", { type: "text/plain" }))) {
					filesAdded++;
					textAdded = true;
				}
			}
			if (inputData.url && typeof inputData.url === "string") {
				const urlBlob = new Blob([inputData.url], { type: "text/plain" });
				if (pushUniqueFile(new File([urlBlob], "shared-url.txt", { type: "text/plain" }))) filesAdded++;
			}
			if (inputData.base64Data && typeof inputData.base64Data === "string") try {
				if (pushUniqueFile((await normalizeDataAsset(inputData.base64Data, {
					namePrefix: "shared",
					uriComponent: true
				})).file)) filesAdded++;
			} catch (error) {
				console.warn("[WorkCenter] Failed to decode base64 data:", error);
			}
			const { WorkCenterStateManager: StateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			StateManager.clearRecognizedData(state);
			StateManager.saveState(state);
			if (filesAdded > 0 || textAdded) {
				state.activeInputTab = "attachments";
				this.deps.onFilesChanged?.();
			}
			let message = "";
			if (filesAdded > 0) message += `${filesAdded} file(s) added to work center`;
			if (textAdded) message += (message ? " and " : "") + "text content added";
			if (message) this.deps.showMessage?.(message);
			if (filesAdded > 0 || textAdded) this.deps.render?.();
		} catch (error) {
			console.error("[WorkCenter] Failed to add share target input:", error);
			this.deps.showMessage?.("Failed to add share target input");
		}
	}
	sendShareTargetResult(resultData) {
		sendMessage({
			type: "share-target-result",
			source: "workcenter",
			destination: "workcenter",
			data: resultData,
			metadata: { priority: "high" }
		}).catch((error) => {
			console.error("[WorkCenter] Failed to send share target result:", error);
		});
	}
	sendShareTargetInput(inputData) {
		sendMessage({
			type: "share-target-input",
			source: "workcenter",
			destination: "workcenter",
			data: inputData,
			metadata: { priority: "high" }
		}).catch((error) => {
			console.error("[WorkCenter] Failed to send share target input:", error);
		});
	}
	async handleCachedContent(state, data) {
		const { cacheKey, context, content } = data;
		if (context === "share-target" && content) {
			console.log("[WorkCenter] Processing cached share-target content:", summarizeForLog(content));
			await this.addShareTargetInput(state, content);
			await this.retrieveCachedFiles(state, cacheKey);
		}
	}
	async handleReceivedContent(state, data) {
		const { content, context } = data;
		if (context === "share-target" && content) {
			console.log("[WorkCenter] Processing received share-target content:", summarizeForLog(content));
			await this.addShareTargetInput(state, content);
		}
	}
	async handleAIResult(state, resultData) {
		const { success, data, error } = resultData;
		if (!success) {
			console.warn("[WorkCenter] AI processing failed:", error);
			this.deps.showMessage?.("AI processing failed: " + (error || "Unknown error"));
			return;
		}
		if (!data) {
			console.warn("[WorkCenter] No data in AI result");
			return;
		}
		console.log("[WorkCenter] Adding AI processing result to work center");
		try {
			const processedEntry = {
				content: typeof data === "string" ? data : JSON.stringify(data, null, 2),
				timestamp: Date.now(),
				action: "AI Processing (Share Target)",
				sourceData: {
					aiResult: data,
					source: "share-target"
				},
				metadata: {
					source: "share-target-ai",
					processingType: "ai",
					resultType: typeof data
				}
			};
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.addProcessedStep(state, processedEntry);
			state.lastRawResult = data;
			WorkCenterStateManager.saveState(state);
			this.deps.render?.();
			this.deps.showMessage?.("AI processing result added to work center");
			if (this.deps.render) this.deps.render();
		} catch (error) {
			console.error("[WorkCenter] Failed to add AI result:", error);
			this.deps.showMessage?.("Failed to add AI processing result");
		}
	}
	async retrieveCachedFiles(state, cacheKey) {
		try {
			const files = await fetchCachedShareFiles(cacheKey || "latest");
			if (files.length > 0) {
				const fileFingerprint = (file) => `${String(file.name || "").trim().toLowerCase()}::${Number(file.size || 0)}::${String(file.type || "").trim().toLowerCase()}`;
				const seenFingerprints = new Set((state.files || []).map(fileFingerprint));
				let added = 0;
				for (const file of files) {
					if (!(file instanceof File)) continue;
					const key = fileFingerprint(file);
					if (seenFingerprints.has(key)) continue;
					seenFingerprints.add(key);
					console.log("[WorkCenter] Adding cached file:", file.name);
					state.files.push(file);
					added++;
				}
				if (added > 0) {
					this.deps.onFilesChanged?.();
					this.deps.showMessage?.(`Added ${added} cached file(s) from share-target`);
				}
			}
		} catch (error) {
			console.warn("[WorkCenter] Failed to retrieve cached files:", error);
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterTemplates.ts
var WorkCenterTemplates = class {
	deps;
	/** Cached custom instructions from settings */
	cachedInstructions = [];
	cachedActiveInstructionId = "";
	constructor(dependencies) {
		this.deps = dependencies;
	}
	/** Load custom instructions from app settings */
	async loadInstructions() {
		try {
			const snapshot = await getInstructionRegistry();
			this.cachedInstructions = snapshot.instructions;
			this.cachedActiveInstructionId = snapshot.activeId;
			return this.cachedInstructions;
		} catch (e) {
			console.warn("[WorkCenterTemplates] Failed to load custom instructions:", e);
			return [];
		}
	}
	/** Get cached instructions (sync, call loadInstructions first) */
	getInstructions() {
		return this.cachedInstructions;
	}
	/** Get cached active instruction id from settings */
	getActiveInstructionId() {
		return this.cachedActiveInstructionId;
	}
	/** Get the currently active instruction from settings */
	async getActiveInstruction() {
		if (this.cachedActiveInstructionId) {
			const cached = this.getInstructionById(this.cachedActiveInstructionId);
			if (cached) return cached;
		}
		const snapshot = await getInstructionRegistry();
		this.cachedInstructions = snapshot.instructions;
		this.cachedActiveInstructionId = snapshot.activeId;
		return snapshot.activeInstruction;
	}
	/** Set a specific instruction as active in settings */
	async setActiveInstruction(id) {
		await setActiveInstruction(id);
		this.cachedActiveInstructionId = id || "";
	}
	/** Build a combined prompt with the selected custom instruction */
	buildPromptWithInstruction(basePrompt, instruction) {
		if (!instruction?.instruction) return basePrompt;
		return buildInstructionPrompt(basePrompt, instruction.instruction);
	}
	/** Get a specific instruction by ID */
	getInstructionById(id) {
		return this.cachedInstructions.find((i) => i.id === id);
	}
	/** Resolve selected instruction, fallback to active settings instruction */
	resolveInstruction(selectedId) {
		if (selectedId) {
			const selected = this.getInstructionById(selectedId);
			if (selected) return selected;
		}
		if (!this.cachedActiveInstructionId) return null;
		return this.getInstructionById(this.cachedActiveInstructionId) || null;
	}
	/** Get default instruction templates (for seeding). Dynamic import avoids TDZ when workcenter loads before `com/app` finishes. */
	async getDefaultTemplates() {
		const { DEFAULT_INSTRUCTION_TEMPLATES } = await import("./templates.js").then((n) => n.n);
		return DEFAULT_INSTRUCTION_TEMPLATES;
	}
	renderInstructionPanel(state) {
		return `
            <div class="instruction-panel">
              <div class="instruction-selector-row wide">
                <label class="instruction-label">
                  <ui-icon icon="clipboard-text" size="16" icon-style="duotone"></ui-icon>
                  <span>Instruction:</span>
                </label>
                <select class="instruction-select" data-action="select-instruction">
                  <option value="">None (default)</option>
                </select>
                <button class="btn btn-icon btn-sm" data-action="refresh-instructions" title="Refresh from Settings">
                  <ui-icon icon="arrows-clockwise" size="14" icon-style="duotone"></ui-icon>
                </button>
              </div>
              <div class="instruction-help">
                Active instruction from Settings is appended to your prompt.
              </div>
            </div>
        `;
	}
	showTemplateEditor(state, container) {
		const modal = H`<div class="template-editor-modal">
      <div class="modal-content">
        <div class="modal-header">
            <h3>Prompt Templates</h3>
            <p class="modal-desc">Manage prompt templates used in Work Center. These define what action to perform on the content.</p>
        </div>
        ${this.renderInstructionPanel(state)}
        <div class="template-list">
          ${state.promptTemplates.map((template, index) => H`<div class="template-item" data-index="${index}">
              <div class="template-item-header">
                <input type="text" class="template-name" value="${template.name}" data-index="${index}" placeholder="Template name...">
                <button class="btn small btn-danger remove-template" data-index="${index}" title="Remove template">
                  <ui-icon icon="trash" size="14"></ui-icon>
                </button>
              </div>
              <textarea class="template-prompt" data-index="${index}" rows="3" placeholder="Enter prompt template...">${template.prompt}</textarea>
            </div>`)}
        </div>
        <div class="modal-actions">
          <div class="modal-actions-group modal-actions-group-start">
            <button class="btn" data-action="add-template">
              <ui-icon icon="plus" size="14"></ui-icon>
              <span>Add Template</span>
            </button>
            <button class="btn" data-action="import-instructions" title="Import from Custom Instructions (Settings)">
              <ui-icon icon="download" size="14"></ui-icon>
              <span>Import from Settings</span>
            </button>
          </div>
          <div class="modal-actions-group modal-actions-group-end">
            <button class="btn primary" data-action="save-templates">Save</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;
		modal.addEventListener("click", async (e) => {
			const target = e.target;
			const action = target.closest("[data-action]")?.getAttribute("data-action");
			const index = target.closest("[data-index]")?.getAttribute("data-index");
			if (action === "add-template") {
				this.addTemplate(state);
				modal.remove();
				this.showTemplateEditor(state, container);
			} else if (action === "save-templates") {
				await this.saveTemplates(state, modal);
				modal.remove();
				this.deps.render?.();
			} else if (action === "close-editor") modal.remove();
			else if (action === "import-instructions") {
				await this.importFromCustomInstructions(state);
				modal.remove();
				this.showTemplateEditor(state, container);
			} else if (target.classList.contains("remove-template") && index) {
				this.removeTemplate(state, parseInt(index));
				modal.remove();
				this.showTemplateEditor(state, container);
			}
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		container.append(modal);
	}
	addTemplate(state) {
		state.promptTemplates.push({
			name: "New Template",
			prompt: "Enter your prompt here..."
		});
	}
	removeTemplate(state, index) {
		if (index >= 0 && index < state.promptTemplates.length) state.promptTemplates.splice(index, 1);
	}
	async saveTemplates(state, modal) {
		const nameInputs = modal.querySelectorAll(".template-name");
		const promptInputs = modal.querySelectorAll(".template-prompt");
		state.promptTemplates = Array.from(nameInputs).map((input, i) => ({
			name: input.value,
			prompt: promptInputs[i].value
		}));
		const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
		WorkCenterStateManager.savePromptTemplates(state.promptTemplates);
		this.deps.showMessage?.("Templates saved");
	}
	/**
	* Import custom instructions from app settings as prompt templates.
	* Maps each CustomInstruction into the WorkCenter template format.
	*/
	async importFromCustomInstructions(state) {
		try {
			const instructions = await getCustomInstructions();
			if (!instructions.length) {
				this.deps.showMessage?.("No custom instructions found in Settings");
				return;
			}
			const existingNames = new Set(state.promptTemplates.map((t) => t.name));
			let added = 0;
			for (const instr of instructions) if (!existingNames.has(instr.label)) {
				state.promptTemplates.push({
					name: instr.label,
					prompt: instr.instruction
				});
				added++;
			}
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.savePromptTemplates(state.promptTemplates);
			if (added > 0) this.deps.showMessage?.(`Imported ${added} instruction${added > 1 ? "s" : ""} as templates`);
			else this.deps.showMessage?.("All instructions already exist as templates");
		} catch (e) {
			console.warn("[WorkCenterTemplates] Failed to import instructions:", e);
			this.deps.showMessage?.("Failed to import instructions");
		}
	}
	selectTemplate(state, prompt) {
		state.selectedTemplate = prompt;
		if (prompt) state.currentPrompt = prompt;
	}
	getTemplateByPrompt(state, prompt) {
		return state.promptTemplates.find((t) => t.prompt === prompt);
	}
	hasTemplate(state, prompt) {
		return state.promptTemplates.some((t) => t.prompt === prompt);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterVoice.ts
var WorkCenterVoice = class {
	deps;
	voiceTimeout = null;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	async startVoiceRecording(state) {
		if (state.voiceRecording) return;
		state.voiceRecording = true;
		try {
			const prompt = await this.deps.getSpeechPrompt();
			if (prompt) state.currentPrompt = prompt;
		} catch (e) {
			console.warn("Voice recording failed:", e);
			this.deps.showMessage?.("Voice recording failed");
		} finally {
			state.voiceRecording = false;
		}
	}
	stopVoiceRecording(state) {
		state.voiceRecording = false;
		if (this.voiceTimeout) {
			globalThis?.clearTimeout?.(this.voiceTimeout);
			this.voiceTimeout = null;
		}
	}
	isRecording(state) {
		return state.voiceRecording;
	}
	setVoiceTimeout(callback, delay = 3e4) {
		if (this.voiceTimeout) globalThis?.clearTimeout?.(this.voiceTimeout);
		this.voiceTimeout = globalThis?.setTimeout?.(() => {
			callback();
			this.voiceTimeout = null;
		}, delay);
	}
	clearVoiceTimeout() {
		if (this.voiceTimeout) {
			globalThis?.clearTimeout?.(this.voiceTimeout);
			this.voiceTimeout = null;
		}
	}
};
//#endregion
//#region src/shared/service/misc/ActionHistory.ts
/** In-memory history store with optional browser persistence and lightweight filtering. */
var ActionHistoryStore = class {
	state;
	storageKey = "rs-action-history";
	constructor(maxEntries = 500, autoSave = true) {
		this.state = {
			entries: [],
			maxEntries,
			autoSave,
			filters: {}
		};
		this.loadHistory();
	}
	/** Insert a new entry at the front of the timeline and enforce the retention limit. */
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			timestamp: Date.now()
		};
		this.state.entries.unshift(fullEntry);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		return fullEntry;
	}
	/**
	* Update an existing entry
	*/
	updateEntry(id, updates) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		Object.assign(this.state.entries[index], updates);
		return true;
	}
	/**
	* Get entry by ID
	*/
	getEntry(id) {
		return this.state.entries.find((entry) => entry.id === id);
	}
	/** Return entries matching the supplied filters without mutating store state. */
	getEntries(filters) {
		let entries = [...this.state.entries];
		if (filters?.source) entries = entries.filter((entry) => entry.context.source === filters.source);
		if (filters?.action) entries = entries.filter((entry) => entry.action === filters.action);
		if (filters?.status) entries = entries.filter((entry) => entry.status === filters.status);
		if (filters?.dateRange) entries = entries.filter((entry) => entry.timestamp >= filters.dateRange.start && entry.timestamp <= filters.dateRange.end);
		return entries;
	}
	/**
	* Get recent entries
	*/
	getRecentEntries(limit = 50) {
		return this.state.entries.slice(0, limit);
	}
	/**
	* Remove entry
	*/
	removeEntry(id) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.state.entries.splice(index, 1);
		return true;
	}
	/**
	* Clear all entries
	*/
	clearEntries() {
		this.state.entries = [];
	}
	/**
	* Set filters
	*/
	setFilters(filters) {
		Object.assign(this.state.filters, filters);
	}
	/** Summarize history health and distribution by source/action. */
	getStats() {
		const entries = this.state.entries;
		const total = entries.length;
		const completed = entries.filter((e) => e.status === "completed").length;
		const failed = entries.filter((e) => e.status === "failed").length;
		const pending = entries.filter((e) => e.status === "pending" || e.status === "processing").length;
		const bySource = entries.reduce((acc, entry) => {
			acc[entry.context.source] = (acc[entry.context.source] || 0) + 1;
			return acc;
		}, {});
		const byAction = entries.reduce((acc, entry) => {
			acc[entry.action] = (acc[entry.action] || 0) + 1;
			return acc;
		}, {});
		return {
			total,
			completed,
			failed,
			pending,
			successRate: total > 0 ? completed / total * 100 : 0,
			bySource,
			byAction
		};
	}
	/**
	* Export entries
	*/
	exportEntries(format = "json", filters) {
		const entries = this.getEntries(filters);
		if (format === "csv") return [[
			"ID",
			"Timestamp",
			"Source",
			"Action",
			"Status",
			"Input Type",
			"Result Type",
			"Processing Time"
		], ...entries.map((entry) => [
			entry.id,
			new Date(entry.timestamp).toISOString(),
			entry.context.source,
			entry.action,
			entry.status,
			entry.input.type,
			entry.result?.type || "",
			entry.result?.processingTime || ""
		])].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		return JSON.stringify(entries, null, 2);
	}
	/**
	* Import entries
	*/
	importEntries(data, format = "json") {
		let entries = [];
		if (format === "json") try {
			entries = JSON.parse(data);
		} catch (e) {
			throw new Error("Invalid JSON format");
		}
		else throw new Error("CSV import not implemented yet");
		const validEntries = entries.filter((entry) => entry.id && entry.timestamp && entry.context && entry.action);
		validEntries.forEach((entry) => {
			if (!this.getEntry(entry.id)) this.state.entries.push(entry);
		});
		this.state.entries.sort((a, b) => b.timestamp - a.timestamp);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		this.saveHistory();
		return validEntries.length;
	}
	generateId() {
		return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const data = JSON.parse(stored);
				if (Array.isArray(data)) this.state.entries = data.map((entry) => ({
					...entry,
					context: entry.context || { source: "unknown" },
					input: entry.input || { type: "unknown" },
					status: entry.status || "completed"
				}));
			}
		} catch (e) {
			console.warn("Failed to load action history:", e);
			this.state.entries = [];
		}
	}
	saveHistory() {
		if (!this.state.autoSave) return;
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.state.entries));
		} catch (e) {
			console.warn("Failed to save action history:", e);
		}
	}
};
var actionHistory = new ActionHistoryStore();
//#endregion
//#region src/shared/service/misc/ExecutionCore.ts
/**
* Rule-based execution engine for recognition and post-processing flows.
*
* It selects the best rule for a given input/context pair, records execution
* history, runs the processor, and optionally propagates clipboard/broadcast
* side effects after success.
*/
/** Main rule engine shared by workcenter, share-target, launch-queue, and CRX flows. */
var ExecutionCore = class {
	rules = [];
	ruleSets = /* @__PURE__ */ new Map();
	constructor(rules) {
		this.initializeDefaultRules(rules ?? {
			recognitionFormat: "markdown",
			processingFormat: "markdown"
		});
	}
	/** Register one execution rule and keep rules sorted by descending priority. */
	registerRule(rule) {
		this.rules.push(rule);
		this.rules.sort((a, b) => b.priority - a.priority);
	}
	/** Register a named rule subset for callers that want to restrict matching. */
	registerRuleSet(name, rules) {
		this.ruleSets.set(name, rules);
	}
	/**
	* Resolve the best rule for this request, execute it, and mirror the result
	* into action history plus any configured follow-up side effects.
	*/
	async execute(input, context, options = {}) {
		const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const entry = {
			context,
			action: options.forceAction || "auto",
			input,
			status: "processing",
			ruleSet: options.ruleSet,
			executionId
		};
		const historyEntry = actionHistory.addEntry(entry);
		try {
			const rule = this.findMatchingRule(input, context, options);
			if (!rule) throw new Error("No matching execution rule found");
			actionHistory.updateEntry(historyEntry.id, { action: rule.action });
			const startTime = Date.now();
			const result = await rule.processor(input, context, options);
			const processingTime = Date.now() - startTime;
			const enhancedResult = {
				...result,
				processingTime,
				autoCopied: rule.autoCopy
			};
			actionHistory.updateEntry(historyEntry.id, {
				result: enhancedResult,
				status: "completed",
				dataCategory: enhancedResult.dataCategory
			});
			if (rule.autoCopy && enhancedResult.type !== "error") await this.autoCopyResult(enhancedResult, context);
			return enhancedResult;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			actionHistory.updateEntry(historyEntry.id, {
				status: "failed",
				error: errorMessage
			});
			return {
				type: "error",
				content: errorMessage
			};
		}
	}
	/**
	* Find the best matching rule for the given input and context
	*/
	findMatchingRule(input, context, options) {
		if (options.forceAction) {
			const forcedRule = this.rules.find((rule) => rule.action === options.forceAction && rule.source === context.source && rule.inputTypes.includes(input.type));
			if (forcedRule) return forcedRule;
		}
		if (options.ruleSet) {
			const ruleSet = this.ruleSets.get(options.ruleSet);
			if (ruleSet) {
				const matchingRule = ruleSet.find((rule) => rule.source === context.source && rule.inputTypes.includes(input.type) && rule.condition(input, context));
				if (matchingRule) return matchingRule;
			}
		}
		return this.rules.find((rule) => rule.source === context.source && rule.inputTypes.includes(input.type) && rule.condition(input, context)) || null;
	}
	/**
	* Auto-copy result to clipboard
	*/
	async autoCopyResult(result, context) {
		try {
			let textToCopy = "";
			switch (result.type) {
				case "markdown":
				case "text":
					textToCopy = result.content;
					break;
				case "json":
					try {
						const data = JSON.parse(result.content);
						if (typeof data === "string") textToCopy = data;
						else if (data.recognized_data) textToCopy = Array.isArray(data.recognized_data) ? data.recognized_data.join("\n\n") : String(data.recognized_data);
						else textToCopy = result.content;
					} catch {
						textToCopy = result.content;
					}
					break;
				case "html":
					textToCopy = result.content.replace(/<[^>]*>/g, "");
					break;
				default: return;
			}
			if (textToCopy.trim()) {
				if (context.source === "chrome-extension") {
					if (typeof chrome !== "undefined" && chrome.runtime) return;
				} else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) await navigator.clipboard.writeText(textToCopy.trim());
				else if (typeof document !== "undefined" && document.body) {
					const textArea = document.createElement("textarea");
					textArea.value = textToCopy.trim();
					document.body.appendChild(textArea);
					textArea.select();
					document.body.removeChild(textArea);
				} else {
					console.log("[ExecutionCore] Cannot auto-copy in service worker context - DOM not available");
					return;
				}
				this.notifyCopySuccess(context);
			}
		} catch (error) {
			console.warn("Failed to auto-copy result:", error);
		}
	}
	/**
	* Notify about successful copy
	*/
	notifyCopySuccess(context) {
		const message = {
			type: "copy-success",
			context
		};
		if (context.source === "chrome-extension") {
			if (typeof chrome !== "undefined" && chrome.runtime) chrome.runtime.sendMessage(message);
		} else try {
			const bc = new BroadcastChannel("rs-clipboard");
			bc.postMessage(message);
			bc.close();
		} catch (e) {
			console.warn("Failed to broadcast copy success:", e);
		}
	}
	/**
	* Initialize default execution rules
	*/
	initializeDefaultRules(options) {
		this.registerRule({
			id: "workcenter-text-files-source",
			name: "Work Center Text File Source",
			description: "Process text/markdown files as source data",
			source: "workcenter",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 11
		});
		this.registerRule({
			id: "workcenter-files-recognize",
			name: "Work Center File Recognition",
			description: "Recognize content from uploaded files",
			source: "workcenter",
			inputTypes: ["files", "image"],
			action: "recognize",
			condition: (input) => Boolean((input?.files?.length ?? 0) > 0),
			processor: async (input, context, options) => {
				let result;
				const formatInstruction = this.getRecognitionFormatInstruction(options?.recognitionFormat);
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Analyze and recognize content from the following ${input.files.length} files. ${formatInstruction}`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						const FileCtor = globalThis.File;
						const isFile = FileCtor && file instanceof FileCtor;
						const header = {
							type: "input_text",
							text: `\n--- File ${index + 1}: ${file.name} ---\n`
						};
						if (isFile && file.type.startsWith("image/")) try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [header, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process image ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to process image: ${file.name}]`
							}];
						}
						else try {
							return [header, {
								type: "input_text",
								text: await file.text()
							}];
						} catch (error) {
							console.warn(`Failed to read file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to read file: ${file.name}]`
							}];
						}
					}))).flat()].filter((item) => item !== null)
				}], {
					instruction: `Analyze and recognize content from the provided files. ${formatInstruction}`,
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: `Analyze and recognize content from the provided image. ${formatInstruction}`,
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: `Analyze and recognize content from the provided file. ${formatInstruction}`,
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Analyze and recognize content from the provided file",
						outputFormat: options?.recognitionFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 10
		});
		this.registerRule({
			id: "workcenter-text-analyze",
			name: "Work Center Text Analysis",
			description: "Analyze provided text content",
			source: "workcenter",
			inputTypes: ["text", "markdown"],
			action: "analyze",
			condition: (input) => Boolean(input.text || input.recognizedContent),
			processor: async (input, context, options) => {
				const content = input.recognizedContent || input.recognizedData?.content || input.text || "";
				const hasImages = input.files?.some((f) => f.type.startsWith("image/") || f.type === "image/svg+xml") || false;
				const hasSvgContent = typeof content === "string" && content.includes("<svg");
				const instructions = input.text && input.text.trim() && input.text.trim() !== "Analyze and process the provided content intelligently" ? input?.text?.trim?.() : `Analyze the provided content. ${this.getProcessingFormatInstruction(options?.processingFormat)}`;
				const result = await processDataWithInstruction(hasImages || hasSvgContent ? [content, ...input.files || []] : content, {
					instruction: instructions,
					outputFormat: options?.processingFormat || "auto",
					outputLanguage: "auto",
					enableSVGImageGeneration: "auto",
					intermediateRecognition: {
						enabled: hasImages,
						outputFormat: options?.recognitionFormat || "markdown",
						dataPriorityInstruction: void 0,
						cacheResults: true
					},
					dataType: hasSvgContent ? "svg" : hasImages ? "image" : "text",
					processingEffort: "medium",
					processingVerbosity: "medium"
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "processed"
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 9
		});
		this.registerRule({
			id: "share-target-text-files-source",
			name: "Share Target Text File Source",
			description: "Process shared text/markdown files as source data",
			source: "share-target",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some?.((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter?.((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `share_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 16
		});
		this.registerRule({
			id: "share-target-images-recognize",
			name: "Share Target Image Recognition",
			description: "Recognize content from shared images",
			source: "share-target",
			inputTypes: ["image", "files"],
			action: "recognize",
			condition: (input) => input.files?.some((f) => f.type.startsWith("image/")) || false,
			processor: async (input) => {
				const imageFiles = input.files.filter((f) => f.type.startsWith("image/"));
				let result;
				if (imageFiles.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Recognize and extract text/content from the following ${imageFiles.length} shared images:`
					}, ...(await Promise.all(imageFiles.map(async (file, index) => {
						try {
							const arrayBuffer = await file.arrayBuffer();
							const bytes = new Uint8Array(arrayBuffer);
							const base64 = btoa(String.fromCharCode(...bytes));
							return [{
								type: "input_text",
								text: `\n--- Image ${index + 1}: ${file?.name ?? "unknown file"} ---\n`
							}, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
							return [{
								type: "input_text",
								text: `\n--- Image ${index + 1}: ${file?.name ?? "unknown file"} ---\n`
							}, {
								type: "input_text",
								text: `[Failed to process image: ${file?.name ?? "unknown file"}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Recognize and extract text/content from the shared images",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else result = await processDataWithInstruction(imageFiles[0], {
					instruction: "Recognize and extract text/content from the shared image",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 15
		});
		this.registerRule({
			id: "share-target-markdown-view",
			name: "Share Target Markdown View",
			description: "View shared markdown content",
			source: "share-target",
			inputTypes: ["text", "markdown"],
			action: "view",
			condition: (input) => this.isMarkdownContent(input.text || ""),
			processor: async (input) => {
				return {
					type: "markdown",
					content: input.text || ""
				};
			},
			autoCopy: false,
			autoSave: true,
			priority: 14
		});
		this.registerRule({
			id: "share-target-url-analyze",
			name: "Share Target URL Analysis",
			description: "Analyze shared URL content",
			source: "share-target",
			inputTypes: ["url"],
			action: "analyze",
			condition: () => true,
			processor: async (input, context, options) => {
				const instructions = `Analyze the content from this URL and provide insights. ${this.getProcessingFormatInstruction(options?.processingFormat)}`;
				const result = await processDataWithInstruction(input.url, {
					instruction: instructions,
					outputFormat: options?.processingFormat || "auto",
					outputLanguage: "auto",
					enableSVGImageGeneration: "auto",
					intermediateRecognition: { enabled: false },
					dataType: "text"
				});
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 13
		});
		this.registerRule({
			id: "chrome-extension-text-files-source",
			name: "Chrome Extension Text File Source",
			description: "Process Chrome extension text/markdown files as source data",
			source: "chrome-extension",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f?.type?.startsWith?.("text/") || f?.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `crx_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 26
		});
		this.registerRule({
			id: "chrome-extension-screenshot-recognize",
			name: "Chrome Extension Screenshot Recognition",
			description: "Recognize content from screenshot",
			source: "chrome-extension",
			inputTypes: ["image"],
			action: "recognize",
			condition: () => true,
			processor: async (input) => {
				let result;
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Analyze the following ${input.files.length} screenshots and extract any visible text or content:`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [{
								type: "input_text",
								text: `\n--- Screenshot ${index + 1}: ${file.name} ---\n`
							}, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process screenshot ${file.name}:`, error);
							return [{
								type: "input_text",
								text: `\n--- Screenshot ${index + 1}: ${file.name} ---\n`
							}, {
								type: "input_text",
								text: `[Failed to process screenshot: ${file.name}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Analyze the screenshots and extract any visible text or content",
					outputFormat: options?.recognitionFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: "Analyze the screenshot and extract any visible text or content",
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process screenshot ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: "Analyze the screenshot and extract any visible text or content",
							outputFormat: options?.recognitionFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Analyze the screenshot and extract any visible text or content",
						outputFormat: options?.recognitionFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 20
		});
		this.registerRule({
			id: "launch-queue-text-files-source",
			name: "Launch Queue Text File Source",
			description: "Process launch queue text/markdown files as source data",
			source: "launch-queue",
			inputTypes: ["files"],
			action: "source",
			condition: (input) => {
				return input.files?.some((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt")) ?? false;
			},
			processor: async (input) => {
				const textFiles = input.files.filter((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f?.name?.endsWith?.(".md") || f?.name?.endsWith?.(".txt"));
				let combinedContent = "";
				for (const file of textFiles) try {
					const content = await file.text();
					combinedContent += content + "\n\n";
				} catch (error) {
					console.warn(`Failed to read text file ${file?.name ?? "unknown file"}:`, error);
				}
				return {
					type: "markdown",
					content: combinedContent.trim(),
					dataCategory: "recognized",
					responseId: `launch_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 21
		});
		this.registerRule({
			id: "launch-queue-files-process",
			name: "Launch Queue File Processing",
			description: "Process files from launch queue",
			source: "launch-queue",
			inputTypes: ["files", "mixed"],
			action: "process",
			condition: () => true,
			processor: async (input) => {
				let result;
				if (input.files.length > 1) result = await processDataWithInstruction([{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text: `Process the following ${input.files.length} files:`
					}, ...(await Promise.all(input.files.map(async (file, index) => {
						const FileCtor = globalThis.File;
						const isFile = FileCtor && file instanceof FileCtor;
						const header = {
							type: "input_text",
							text: `\n--- File ${index + 1}: ${file.name} ---\n`
						};
						if (isFile && file.type.startsWith("image/")) try {
							const arrayBuffer = await file.arrayBuffer();
							const base64 = toBase64(new Uint8Array(arrayBuffer));
							return [header, {
								type: "input_image",
								detail: "auto",
								image_url: `data:${file.type};base64,${base64}`
							}];
						} catch (error) {
							console.warn(`Failed to process file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to process file: ${file.name}]`
							}];
						}
						else try {
							return [header, {
								type: "input_text",
								text: await file.text()
							}];
						} catch (error) {
							console.warn(`Failed to read file ${file.name}:`, error);
							return [header, {
								type: "input_text",
								text: `[Failed to read file: ${file.name}]`
							}];
						}
					}))).flat()]
				}], {
					instruction: "Process the provided content",
					outputFormat: options?.processingFormat || "auto",
					intermediateRecognition: { enabled: false }
				});
				else {
					const file = input.files[0];
					const FileCtor = globalThis.File;
					if (FileCtor && file instanceof FileCtor && file.type.startsWith("image/")) try {
						const arrayBuffer = await file.arrayBuffer();
						const base64 = toBase64(new Uint8Array(arrayBuffer));
						result = await processDataWithInstruction(`data:${file.type};base64,${base64}`, {
							instruction: "Process the provided image content",
							outputFormat: options?.processingFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					} catch (error) {
						console.warn(`Failed to process image ${file?.name ?? "unknown file"}:`, error);
						result = await processDataWithInstruction(file, {
							instruction: "Process the provided content",
							outputFormat: options?.processingFormat || "auto",
							intermediateRecognition: { enabled: false }
						});
					}
					else result = await processDataWithInstruction(file, {
						instruction: "Process the provided content",
						outputFormat: options?.processingFormat || "auto",
						intermediateRecognition: { enabled: false }
					});
				}
				return {
					type: this.detectResultFormat(result),
					content: this.formatAIResult(result),
					rawData: result,
					responseId: result.responseId,
					dataCategory: "recognized"
				};
			},
			autoCopy: true,
			autoSave: true,
			priority: 12
		});
	}
	/**
	* Check if content is markdown
	*/
	isMarkdownContent(text) {
		if (!text || typeof text !== "string") return false;
		const trimmed = text.trim();
		if (trimmed.startsWith("<") && trimmed.endsWith(">")) return false;
		if (/<[a-zA-Z][^>]*>/.test(trimmed)) return false;
		return [
			/^---[\s\S]+?---/,
			/^#{1,6}\s+.+$/m,
			/^\s*[-*+]\s+\S+/m,
			/^\s*\d+\.\s+\S+/m,
			/`{1,3}[^`]*`{1,3}/,
			/\[([^\]]+)\]\(([^)]+)\)/,
			/!\[([^\]]+)\]\(([^)]+)\)/
		].some((pattern) => pattern.test(text));
	}
	/**
	* Format AI result for display
	*/
	detectResultFormat(result) {
		if (!result) return "text";
		try {
			const data = result.data || result;
			if (data && typeof data === "object") {
				if ([
					"recognized_data",
					"verbose_data",
					"keywords_and_tags",
					"confidence",
					"suggested_type",
					"using_ready"
				].some((field) => field in data)) return "json";
				if (data.content || data.text || data.message) return "markdown";
				return "json";
			}
			if (typeof data === "string") {
				if (data.includes("\n") || data.includes("#") || data.includes("*") || data.includes("`")) return "markdown";
				return "text";
			}
			return "json";
		} catch (error) {
			console.warn("Failed to detect result format:", error);
			return "text";
		}
	}
	formatAIResult(result) {
		if (!result) return "No result";
		try {
			let content = "";
			if (result.data) if (typeof result.data === "string") content = result.data;
			else if (result.data.recognized_data) {
				const recognized = result.data.recognized_data;
				content = Array.isArray(recognized) ? recognized.join("\n\n") : String(recognized);
			} else content = JSON.stringify(result.data, null, 2);
			else if (typeof result === "string") content = result;
			else content = JSON.stringify(result, null, 2);
			content = this.unwrapUnwantedCodeBlocks(content);
			return content;
		} catch (error) {
			console.warn("Failed to format AI result:", error);
			return String(result);
		}
	}
	unwrapUnwantedCodeBlocks(content) {
		if (!content) return content;
		const match = content.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);
		if (match) {
			const unwrapped = match[1].trim();
			const lines = unwrapped.split("\n");
			if (lines.length === 1 || unwrapped.includes("<math") || unwrapped.includes("<span class=\"katex") || unwrapped.includes("<content") || unwrapped.startsWith("<") && unwrapped.endsWith(">") || /^\s*<[^>]+>/.test(unwrapped)) {
				console.log("[AI Response] Unwrapped unwanted code block formatting");
				return unwrapped;
			}
			if (lines.length > 3 || lines.some((line) => line.match(/^\s{4,}/) || line.includes("function") || line.includes("const ") || line.includes("let "))) return content;
			console.log("[AI Response] Unwrapped unwanted code block formatting");
			return unwrapped;
		}
		return content;
	}
	getRecognitionFormatInstruction(format) {
		if (!format || format === "auto") return "Output the content in the most appropriate format (markdown is preferred for structured content).";
		switch (format) {
			case "most-suitable": return "Analyze the content and output it in the most suitable format for its type and structure. Choose the format that best represents the content's nature and purpose.";
			case "most-optimized": return "Output the content in the most optimized format for storage and transmission efficiency. Prefer compact representations while maintaining essential information.";
			case "most-legibility": return "Output the content in the most human-readable and legible format. Prioritize clarity, readability, and ease of understanding over compactness.";
			case "markdown": return "Output the recognized content in Markdown format.";
			case "html": return "Output the recognized content in HTML format.";
			case "text": return "Output the recognized content as plain text.";
			case "json": return "Output the recognized content as structured JSON data.";
			default: return "Output the content in the most appropriate format (markdown is preferred for structured content).";
		}
	}
	getProcessingFormatInstruction(format) {
		if (!format || format === "markdown") return "Output the processed result in Markdown format.";
		switch (format) {
			case "html": return "Output the processed result in HTML format.";
			case "json": return "Output the processed result as structured JSON data.";
			case "text": return "Output the processed result as plain text.";
			case "typescript": return "Output the processed result as TypeScript code.";
			case "javascript": return "Output the processed result as JavaScript code.";
			case "python": return "Output the processed result as Python code.";
			case "java": return "Output the processed result as Java code.";
			case "cpp": return "Output the processed result as C++ code.";
			case "csharp": return "Output the processed result as C# code.";
			case "php": return "Output the processed result as PHP code.";
			case "ruby": return "Output the processed result as Ruby code.";
			case "go": return "Output the processed result as Go code.";
			case "rust": return "Output the processed result as Rust code.";
			case "xml": return "Output the processed result in XML format.";
			case "yaml": return "Output the processed result in YAML format.";
			case "css": return "Output the processed result as CSS code.";
			case "scss": return "Output the processed result as SCSS code.";
			default: return "Output the processed result in Markdown format.";
		}
	}
};
var executionCore = new ExecutionCore();
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterActions.ts
var WorkCenterActions = class {
	deps;
	ui;
	fileOps;
	dataProcessing;
	results;
	history;
	templates;
	constructor(dependencies, ui, fileOps, dataProcessing, results, history, templates) {
		this.deps = dependencies;
		this.ui = ui;
		this.fileOps = fileOps;
		this.dataProcessing = dataProcessing;
		this.results = results;
		this.history = history;
		this.templates = templates;
	}
	async executeUnifiedAction(state) {
		if (this.fileOps.getFilesForProcessing(state).length === 0 && !state.currentPrompt.trim() && !state.recognizedData) {
			this.deps.showMessage("Please select files or enter a prompt first");
			return;
		}
		let processingMessage = "Processing...";
		if (state.recognizedData) processingMessage = `Processing ${state.recognizedData.source} content...`;
		else if (this.fileOps.hasFiles(state)) processingMessage = `Processing ${state.files.length} file${state.files.length > 1 ? "s" : ""}...`;
		this.results.showProcessingMessage(processingMessage);
		try {
			let basePrompt = state.currentPrompt.trim() || (state.autoAction ? this.getLastSuccessfulPrompt() : "Analyze and process the provided content intelligently");
			if (this.templates) {
				let instruction = this.templates.resolveInstruction(state.selectedInstruction);
				if (!instruction && !state.selectedInstruction) instruction = await this.templates.getActiveInstruction();
				if (instruction?.instruction) {
					if (!state.selectedInstruction) state.selectedInstruction = instruction.id;
					basePrompt = this.templates.buildPromptWithInstruction(basePrompt, instruction);
				}
			}
			const actionInput = {
				type: state.recognizedData ? "text" : this.fileOps.hasFiles(state) ? "files" : "text",
				files: this.fileOps.hasFiles(state) ? [...state.files] : void 0,
				text: basePrompt,
				recognizedData: state.recognizedData || void 0,
				recognizedContent: state.recognizedData?.content || void 0
			};
			if (state.selectedTemplate && state.selectedTemplate.includes("Translate the following content to the selected language") && state.selectedLanguage !== "auto") {
				const targetLanguage = state.selectedLanguage === "ru" ? "Russian" : "English";
				actionInput.text = `Translate the following content to ${targetLanguage}. Maintain the original formatting and structure where possible. If the content is already in ${targetLanguage}, provide a natural rephrasing or improvement instead.`;
			} else if (state.selectedLanguage !== "auto") actionInput.text = `${state.selectedLanguage === "ru" ? "Please respond in Russian language." : "Please respond in English language."} ${actionInput.text}`;
			const context = {
				source: "workcenter",
				sessionId: this.generateSessionId()
			};
			let forceAction;
			if (state.currentPrompt.trim() && state.currentPrompt.trim() !== "Analyze and process the provided content intelligently") forceAction = void 0;
			else if (state.recognizedData) forceAction = "analyze";
			else if (this.fileOps.hasFiles(state)) if (this.fileOps.hasTextFiles(state)) forceAction = "source";
			else forceAction = "recognize";
			else forceAction = "analyze";
			const result = await executionCore.execute(actionInput, context, {
				forceAction,
				recognitionFormat: state.recognitionFormat,
				processingFormat: state.processingFormat
			});
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(state);
			state.lastRawResult = result.rawData;
			const formattedResult = this.dataProcessing.formatResult(result.rawData || result, state.outputFormat);
			const outputContent = this.ui.getContainer()?.querySelector("[data-output]");
			if (outputContent) outputContent.innerHTML = `<div class="result-content">${formattedResult}</div>`;
			if (this.fileOps.hasFiles(state) && result.rawData?.ok && !state.recognizedData) {
				const isTextFile = this.fileOps.hasTextFiles(state);
				state.recognizedData = {
					content: result.content,
					timestamp: Date.now(),
					source: isTextFile ? "text" : "files",
					recognizedAs: this.fileOps.determineRecognizedFormat(state),
					metadata: { fileCount: state.files.length },
					responseId: result.responseId || "unknown"
				};
				this.results.updateDataPipeline(state);
				this.ui.updateDataCounters(state);
				if (state.selectedTemplate && state.selectedTemplate.trim()) {
					console.log("[WorkCenter] Auto-processing with template:", state.selectedTemplate);
					setTimeout(async () => {
						await this.executeUnifiedAction(state);
					}, 100);
				}
			} else if (state.recognizedData && result.rawData?.ok) {
				const processedEntry = {
					content: result.content,
					timestamp: Date.now(),
					action: state.currentPrompt.trim() || "additional processing",
					sourceData: state.recognizedData,
					metadata: { step: state.currentProcessingStep + 1 }
				};
				const { WorkCenterStateManager: StateManager } = await import("./WorkCenterState.js").then((n) => n.n);
				StateManager.addProcessedStep(state, processedEntry);
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			this.results.showError(errorMsg);
		}
		this.history.updateRecentHistory(state);
		this.ui.updateDataPipeline(state);
		this.ui.updateDataCounters(state);
	}
	getLastSuccessfulPrompt() {
		return this.history.getLastSuccessfulPrompt();
	}
	generateSessionId() {
		return `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	async copyResults(state) {
		if (!state.lastRawResult) return;
		try {
			await this.dataProcessing.copyResultsToClipboard(state.lastRawResult, state.outputFormat);
			this.deps.showMessage("Results copied to clipboard");
		} catch (error) {
			console.error("Failed to copy results:", error);
			this.deps.showMessage("Failed to copy results");
		}
	}
	async viewResultsInViewer(state) {
		if (!state.lastRawResult) {
			this.deps.showMessage("No results to view");
			return;
		}
		try {
			const { unifiedMessaging } = await import("./UnifiedMessaging.js").then((n) => n.t);
			let resultContent = typeof state.lastRawResult === "string" ? state.lastRawResult : JSON.stringify(state.lastRawResult, null, 2);
			try {
				resultContent = JSON.parse(resultContent)?.data || resultContent;
			} catch (error) {}
			await unifiedMessaging.sendMessage({
				id: crypto.randomUUID(),
				type: "content-view",
				source: "workcenter",
				destination: "viewer",
				contentType: state.outputFormat === "markdown" ? "markdown" : "text",
				data: {
					text: resultContent,
					filename: `workcenter-output-${Date.now()}.${state.outputFormat === "markdown" ? "md" : state.outputFormat === "json" ? "json" : state.outputFormat === "html" ? "html" : state.outputFormat === "code" ? "ts" : "txt"}`
				},
				metadata: {
					title: "Work Center Output",
					timestamp: Date.now(),
					source: "workcenter",
					format: state.outputFormat
				}
			});
			await this.navigateToViewer();
		} catch (error) {
			console.error("Failed to open output in viewer:", error);
			this.deps.showMessage("Failed to open output in viewer");
		}
	}
	async navigateToViewer() {
		if (this.deps.navigate) {
			await this.deps.navigate("viewer");
			return;
		}
		if (this.deps?.state) {
			this.deps.state.view = "markdown-viewer";
			this.deps.render?.();
		}
	}
	clearResults(state) {
		state.lastRawResult = null;
		this.results.clearResults();
	}
	async saveResultsToExplorer(state) {
		if (!state.lastRawResult) {
			this.deps.showMessage("No results to save");
			return;
		}
		try {
			const { unifiedMessaging } = await import("./UnifiedMessaging.js").then((n) => n.t);
			const resultContent = typeof state.lastRawResult === "string" ? state.lastRawResult : JSON.stringify(state.lastRawResult, null, 2);
			await unifiedMessaging.sendMessage({
				id: crypto.randomUUID(),
				type: "content-save",
				source: "workcenter",
				destination: "explorer",
				data: {
					action: "save",
					text: resultContent,
					filename: `workcenter-result-${Date.now()}.${state.outputFormat === "json" ? "json" : state.outputFormat === "html" ? "html" : state.outputFormat === "code" ? "ts" : "txt"}`,
					path: "/workcenter-results/"
				},
				metadata: {
					title: "Work Center Result",
					timestamp: Date.now(),
					source: "workcenter",
					format: state.outputFormat
				}
			});
			this.deps.showMessage("Results saved to Explorer");
		} catch (error) {
			console.error("Failed to save results to explorer:", error);
			this.deps.showMessage("Failed to save results to Explorer");
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterEvents.ts
var WorkCenterEvents = class {
	deps;
	ui;
	fileOps;
	actions;
	templates;
	voice;
	shareTarget;
	history;
	attachments;
	prompts;
	state;
	container = null;
	isHandlingPaste = false;
	constructor(dependencies, ui, fileOps, actions, templates, voice, shareTarget, history, attachments, prompts, state) {
		this.deps = dependencies;
		this.ui = ui;
		this.fileOps = fileOps;
		this.actions = actions;
		this.templates = templates;
		this.voice = voice;
		this.shareTarget = shareTarget;
		this.history = history;
		this.attachments = attachments;
		this.prompts = prompts;
		this.state = state;
	}
	setContainer(container) {
		this.container = container;
	}
	setupWorkCenterEvents() {
		if (!this.container) return;
		this.setupFileSelection();
		this.setupPasteSupport();
		this.setupTemplateSelection();
		this.setupInstructionSelection();
		this.setupPromptInput();
		this.setupPromptDropzone();
		this.setupVoiceInput();
		this.setupInputTabs();
		this.setupResultsTabs();
		this.setupFormatSelectors();
		this.setupAutoActionCheckbox();
		this.setupActionButtons();
		this.setupPipelineRestoration();
	}
	setupFileSelection() {
		if (!this.container) return;
		const fileSelectBtns = Array.from(this.container.querySelectorAll("[data-action=\"select-files\"]"));
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.accept = "image/*,.pdf,.txt,.md,.json,.html,.css,.js,.ts";
		fileInput.style.display = "none";
		this.container.append(fileInput);
		for (const btn of fileSelectBtns) btn.addEventListener("click", () => fileInput.click());
		fileInput.addEventListener("change", async (e) => {
			const files = Array.from(e.target.files || []);
			this.fileOps.addFilesFromInput(this.state, files);
			this.ui.updateFileList(this.state);
			this.ui.updateFileCounter(this.state);
			this.deps.onFilesChanged?.();
			if (files.filter((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f.name.endsWith(".md") || f.name.endsWith(".txt")).length > 0 && this.state.selectedTemplate && this.state.selectedTemplate.trim()) {
				console.log("[WorkCenter] Auto-processing text/markdown files with template:", this.state.selectedTemplate);
				setTimeout(async () => {
					await this.actions.executeUnifiedAction(this.state);
				}, 100);
			}
		});
	}
	setupPasteSupport() {
		if (!this.container) return;
		this.container.addEventListener("paste", async (e) => {
			if (this.isHandlingPaste) return;
			if (!e.clipboardData) return;
			const target = e.target;
			const isEditableTarget = this.isEditableTarget(target);
			const hasClipboardFiles = this.hasClipboardFiles(e.clipboardData);
			if (isEditableTarget && !hasClipboardFiles) return;
			let contentAdded = false;
			this.isHandlingPaste = true;
			try {
				const itemFiles = [];
				for (const item of Array.from(e.clipboardData.items || [])) {
					if (item.kind !== "file" || !item.getAsFile) continue;
					const file = item.getAsFile();
					if (file) itemFiles.push(file);
				}
				if (itemFiles.length > 0) {
					e.preventDefault();
					this.fileOps.addFilesFromInput(this.state, itemFiles);
					this.ui.updateFileList(this.state);
					this.ui.updateFileCounter(this.state);
					this.deps.onFilesChanged?.();
					contentAdded = true;
				}
				if (!contentAdded) {
					const files = Array.from(e.clipboardData.files || []);
					if (files.length > 0) {
						e.preventDefault();
						this.fileOps.addFilesFromInput(this.state, files);
						this.ui.updateFileList(this.state);
						this.ui.updateFileCounter(this.state);
						this.deps.onFilesChanged?.();
						contentAdded = true;
					}
				}
				if (!contentAdded) {
					const textContent = e.clipboardData.getData("text/plain")?.trim();
					if (textContent) {
						e.preventDefault();
						await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
						await this.fileOps.handlePastedContent(this.state, textContent, "text");
						contentAdded = true;
					}
				}
				if (!contentAdded) {
					const htmlContent = e.clipboardData.getData("text/html");
					if (htmlContent) {
						e.preventDefault();
						const tempDiv = document.createElement("div");
						tempDiv.innerHTML = htmlContent;
						const extractedText = tempDiv.textContent || tempDiv.innerText || "";
						if (extractedText.trim()) {
							await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
							await this.fileOps.handlePastedContent(this.state, extractedText.trim(), "html");
							contentAdded = true;
						}
					}
				}
				if (!contentAdded) {
					e.preventDefault();
					this.deps.showMessage?.("Clipboard content detected but no supported payload was extracted");
				}
			} finally {
				this.isHandlingPaste = false;
			}
		});
	}
	isEditableTarget(target) {
		if (!(target instanceof HTMLElement)) return false;
		if (target.isContentEditable) return true;
		if (target.closest("[contenteditable=\"true\"]")) return true;
		return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
	}
	hasClipboardFiles(clipboardData) {
		if ((clipboardData.files || []).length > 0) return true;
		return Array.from(clipboardData.items || []).some((item) => item.kind === "file");
	}
	setupTemplateSelection() {
		if (!this.container) return;
		const templateSelect = this.container.querySelector(".template-select");
		templateSelect?.addEventListener("change", async () => {
			const selectedPrompt = templateSelect.value;
			this.templates.selectTemplate(this.state, selectedPrompt);
			if (selectedPrompt) {
				this.prompts.updatePromptInput(this.state);
				if (this.state.recognizedData || this.fileOps.hasFiles(this.state)) {
					console.log("[WorkCenter] Auto-processing with selected template:", selectedPrompt);
					await this.actions.executeUnifiedAction(this.state);
				}
			}
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
	}
	setupInstructionSelection() {
		if (!this.container) return;
		this.prompts.populateInstructionSelect(this.state).then(async () => {
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
		const instructionSelect = this.container.querySelector(".instruction-select");
		instructionSelect?.addEventListener("change", async () => {
			const selectedId = instructionSelect.value;
			this.prompts.handleInstructionSelection(this.state, selectedId);
			await this.templates.setActiveInstruction(selectedId || null);
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
	}
	setupPromptInput() {
		if (!this.container) return;
		const promptInput = this.container.querySelector(".prompt-input");
		if (!promptInput) return;
		promptInput.addEventListener("input", async () => {
			this.state.currentPrompt = promptInput.value;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
			if (this.state.recognizedData && promptInput.value.trim()) {
				console.log("[WorkCenter] Auto-processing recognized data with manual prompt");
				clearTimeout(this.container._autoProcessTimeout);
				this.container._autoProcessTimeout = setTimeout(async () => {
					await this.actions.executeUnifiedAction(this.state);
				}, 1e3);
			}
		});
	}
	setupVoiceInput() {
		if (!this.container) return;
		const voiceBtn = this.container.querySelector("[data-action=\"voice-input\"]");
		if (!voiceBtn) return;
		voiceBtn.addEventListener("mousedown", () => this.voice.startVoiceRecording(this.state));
		voiceBtn.addEventListener("mouseup", () => {
			this.voice.stopVoiceRecording(this.state);
			this.ui.updateVoiceButton(this.state);
		});
		voiceBtn.addEventListener("mouseleave", () => {
			this.voice.stopVoiceRecording(this.state);
			this.ui.updateVoiceButton(this.state);
		});
	}
	setupFormatSelectors() {
		if (!this.container) return;
		const formatSelect = this.container.querySelector(".format-select");
		if (!formatSelect) return;
		formatSelect.addEventListener("change", async () => {
			const newFormat = formatSelect.value;
			this.state.outputFormat = newFormat;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
			if (this.state.lastRawResult) {
				const outputContent = this.container?.querySelector("[data-output]");
				const { WorkCenterDataProcessing } = await import("./WorkCenterDataProcessing.js").then((n) => n.n);
				outputContent.innerHTML = `<div class="result-content">${new WorkCenterDataProcessing().formatResult(this.state.lastRawResult, newFormat)}</div>`;
			}
		});
		const languageSelect = this.container.querySelector(".language-select");
		if (!languageSelect) return;
		languageSelect.addEventListener("change", async () => {
			this.state.selectedLanguage = languageSelect.value;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
		const recognitionSelect = this.container.querySelector(".recognition-select");
		if (!recognitionSelect) return;
		recognitionSelect.addEventListener("change", async () => {
			this.state.recognitionFormat = recognitionSelect.value;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
		const processingSelect = this.container.querySelector(".processing-select");
		if (!processingSelect) return;
		processingSelect.addEventListener("change", async () => {
			this.state.processingFormat = processingSelect.value;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
	}
	setupAutoActionCheckbox() {
		if (!this.container) return;
		const autoCheckbox = this.container.querySelector(".auto-action-checkbox");
		if (!autoCheckbox) return;
		autoCheckbox.addEventListener("change", async () => {
			this.state.autoAction = autoCheckbox.checked;
			const { WorkCenterStateManager } = await import("./WorkCenterState.js").then((n) => n.n);
			WorkCenterStateManager.saveState(this.state);
		});
	}
	setupActionButtons() {
		if (!this.container) return;
		this.container.addEventListener("click", async (e) => {
			const target = e.target;
			const action = target.closest("[data-action]")?.getAttribute("data-action");
			if (!action) return;
			switch (action) {
				case "edit-templates":
					this.templates.showTemplateEditor(this.state, this.container);
					break;
				case "refresh-instructions":
					await this.prompts.populateInstructionSelect(this.state);
					this.prompts.updateInstructionSelect(this.state);
					break;
				case "clear-prompt":
					this.prompts.clearPrompt(this.state);
					break;
				case "copy-results":
					await this.actions.copyResults(this.state);
					break;
				case "view-output":
					await this.actions.viewResultsInViewer(this.state);
					break;
				case "save-to-explorer":
					await this.actions.saveResultsToExplorer(this.state);
					break;
				case "clear-results":
					this.actions.clearResults(this.state);
					break;
				case "clear-all-files":
					this.attachments.clearAllFiles(this.state);
					break;
				case "view-full-history":
					this.deps.state.view = "history";
					this.deps.render();
					break;
				case "view-action-history":
					this.showActionHistory();
					break;
				case "execute":
					await this.actions.executeUnifiedAction(this.state);
					break;
				case "switch-input-tab":
					this.switchInputTab(String(target.closest("[data-tab]")?.getAttribute("data-tab") || "prompt"));
					break;
				case "switch-results-tab":
					this.switchResultsTab(String(target.closest("[data-tab]")?.getAttribute("data-tab") || "output"));
					break;
				case "clear-recognized":
					const { WorkCenterStateManager: StateManager1 } = await import("./WorkCenterState.js").then((n) => n.n);
					StateManager1.clearRecognizedData(this.state);
					const statusElement = this.container?.querySelector(".wc-recognized-status");
					if (statusElement) statusElement.remove();
					this.ui.updateDataPipeline(this.state);
					break;
				case "clear-pipeline":
					const { WorkCenterStateManager: StateManager2 } = await import("./WorkCenterState.js").then((n) => n.n);
					StateManager2.clearRecognizedData(this.state);
					this.ui.revokeAllPreviewUrls(this.state);
					this.state.files = [];
					this.ui.updateFileList(this.state);
					this.ui.updateFileCounter(this.state);
					this.deps.onFilesChanged?.();
					const statusEl = this.container?.querySelector(".wc-recognized-status");
					if (statusEl) statusEl.remove();
					this.ui.updateDataPipeline(this.state);
					break;
			}
		});
	}
	setupPipelineRestoration() {
		if (!this.container) return;
		this.container.addEventListener("click", async (e) => {
			const stepIndex = e.target.getAttribute("data-restore-step");
			if (stepIndex !== null) {
				const index = parseInt(stepIndex);
				if (this.state.processedData && this.state.processedData[index]) {
					const step = this.state.processedData[index];
					const outputContent = this.container?.querySelector("[data-output]");
					const { WorkCenterDataProcessing } = await import("./WorkCenterDataProcessing.js").then((n) => n.n);
					outputContent.innerHTML = `<div class="result-content">${new WorkCenterDataProcessing().formatResult({ content: step.content }, this.state.outputFormat)}</div>`;
					this.state.lastRawResult = { data: step.content };
				}
			}
		});
	}
	setupInputTabs() {
		if (!this.container) return;
		this.switchInputTab(this.state.activeInputTab || "prompt");
	}
	setupResultsTabs() {
		if (!this.container) return;
		this.switchResultsTab(this.state.activeResultsTab || "output");
	}
	switchInputTab(tab) {
		if (!this.container) return;
		if (!["prompt", "attachments"].includes(tab)) return;
		this.state.activeInputTab = tab;
		this.container.querySelector("[data-input-tabs]")?.setAttribute("data-active-tab", tab);
		const tabButtons = this.container.querySelectorAll("[data-action=\"switch-input-tab\"][data-tab]");
		for (const tabButton of Array.from(tabButtons)) {
			const btn = tabButton;
			const isActive = btn.getAttribute("data-tab") === tab;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-selected", String(isActive));
		}
		const tabPanels = this.container.querySelectorAll("[data-tab-panel]");
		for (const panel of Array.from(tabPanels)) {
			const el = panel;
			const isActive = el.getAttribute("data-tab-panel") === tab;
			el.classList.toggle("is-active", isActive);
		}
		import("./WorkCenterState.js").then((n) => n.n).then(({ WorkCenterStateManager }) => WorkCenterStateManager.saveState(this.state)).catch(() => {});
	}
	switchResultsTab(tab) {
		if (!this.container) return;
		if (![
			"output",
			"pipeline",
			"history"
		].includes(tab)) return;
		const hasPipelineData = Boolean(this.state.recognizedData || this.state.processedData && this.state.processedData.length > 0);
		const nextTab = tab === "pipeline" && !hasPipelineData ? "output" : tab;
		this.state.activeResultsTab = nextTab;
		this.container.querySelector("[data-results-tabs]")?.setAttribute("data-active-tab", nextTab);
		const tabButtons = this.container.querySelectorAll("[data-action=\"switch-results-tab\"][data-tab]");
		for (const tabButton of Array.from(tabButtons)) {
			const btn = tabButton;
			const isActive = btn.getAttribute("data-tab") === nextTab;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-selected", String(isActive));
		}
		const tabPanels = this.container.querySelectorAll("[data-results-tab-panel]");
		for (const panel of Array.from(tabPanels)) {
			const el = panel;
			const isActive = el.getAttribute("data-results-tab-panel") === nextTab;
			el.classList.toggle("is-active", isActive);
		}
		import("./WorkCenterState.js").then((n) => n.n).then(({ WorkCenterStateManager }) => WorkCenterStateManager.saveState(this.state)).catch(() => {});
	}
	setupPromptDropzone() {
		if (!this.container) return;
		const promptDropzone = this.container.querySelector("[data-prompt-dropzone]");
		if (!promptDropzone) return;
		const overlay = this.container.querySelector("[data-prompt-drop-hint]");
		promptDropzone.addEventListener("dragover", (e) => {
			e.preventDefault();
			promptDropzone.classList.add("drag-over");
			overlay?.classList.add("visible");
		});
		promptDropzone.addEventListener("dragleave", (e) => {
			const rect = promptDropzone.getBoundingClientRect();
			const x = e.clientX;
			const y = e.clientY;
			if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
				promptDropzone.classList.remove("drag-over");
				overlay?.classList.remove("visible");
			}
		});
		promptDropzone.addEventListener("drop", async (e) => {
			e.preventDefault();
			promptDropzone.classList.remove("drag-over");
			overlay?.classList.remove("visible");
			const dt = e.dataTransfer;
			if (!dt) return;
			const files = Array.from(dt.files || []);
			if (files.length > 0) {
				this.fileOps.addFilesFromInput(this.state, files);
				this.ui.updateFileList(this.state);
				this.ui.updateFileCounter(this.state);
				this.deps.onFilesChanged?.();
				return;
			}
			if (dt.types.includes("text/plain")) {
				const text = dt.getData("text/plain")?.trim();
				if (text) {
					await this.fileOps.handleDroppedContent(this.state, text, "text");
					this.ui.updateFileList(this.state);
					this.ui.updateFileCounter(this.state);
					this.deps.onFilesChanged?.();
					return;
				}
			}
			if (dt.types.includes("text/uri-list")) {
				const firstUrl = dt.getData("text/uri-list").split("\n").filter((url) => url.trim() && !url.startsWith("#"))[0]?.trim();
				if (firstUrl) {
					await this.fileOps.handleDroppedContent(this.state, firstUrl, "url");
					this.ui.updateFileList(this.state);
					this.ui.updateFileCounter(this.state);
					this.deps.onFilesChanged?.();
					return;
				}
			}
			if (dt.types.includes("text/html")) {
				const html = dt.getData("text/html");
				if (html) {
					const temp = document.createElement("div");
					temp.innerHTML = html;
					const extracted = (temp.textContent || temp.innerText || "").trim();
					if (extracted) {
						await this.fileOps.handleDroppedContent(this.state, extracted, "html");
						this.ui.updateFileList(this.state);
						this.ui.updateFileCounter(this.state);
						this.deps.onFilesChanged?.();
						return;
					}
				}
			}
		});
	}
	showActionHistory() {
		this.history.showActionHistory();
	}
	isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterResults.ts
var WorkCenterResults = class {
	container = null;
	deps;
	dataProcessing;
	constructor(dependencies, dataProcessing) {
		this.deps = dependencies;
		this.dataProcessing = dataProcessing;
	}
	setContainer(container) {
		this.container = container;
	}
	showProcessingMessage(message) {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = `<div class="wc-loading">${message}</div>`;
	}
	showResult(state) {
		if (!this.container || !state.lastRawResult) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (!outputContent) return;
		outputContent.innerHTML = `<div class="result-content">${this.dataProcessing.formatResult(state.lastRawResult, state.outputFormat)}</div>`;
	}
	showError(error) {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = `<div class="error">Error: ${error}</div>`;
	}
	clearResults() {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = "<div class=\"wc-results-empty\">Results cleared</div>";
	}
	renderDataPipeline(state) {
		if (!state.recognizedData && (!state.processedData || state.processedData.length === 0)) return "";
		return H`<div class="data-pipeline-section">
            <div class="pipeline-content">
              <div class="pipeline-header">
                <h3>Data Processing Pipeline</h3>
                <div class="pipeline-actions">
                  <button class="btn btn-icon" data-action="clear-pipeline" title="Clear all data">
                    <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                  </button>
                </div>
              </div>
              <div class="pipeline-steps">
              ${state.recognizedData ? H`<div class="pipeline-step recognized-step">
                <div class="step-header">
                  <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                  <span class="step-title">Recognized Data</span>
                  <span class="step-time">${new Date(state.recognizedData.timestamp).toLocaleTimeString()}</span>
                  <span class="step-source">${state.recognizedData.source}</span>
                  <span class="step-format">${state.recognizedData.recognizedAs}</span>
                </div>
                <div class="step-content">
                  <div class="step-preview">${state.recognizedData.content.substring(0, 100)}${state.recognizedData.content.length > 100 ? "..." : ""}</div>
                </div>
              </div>` : ""}

              ${state.processedData ? state.processedData.map((step, index) => {
			const isShareTarget = step.metadata?.source === "share-target";
			return H`<div class="${isShareTarget ? "pipeline-step share-target-step" : "pipeline-step processed-step"}">
                <div class="step-header">
                  <ui-icon icon="${isShareTarget ? "share" : "cogs"}" size="16" icon-style="duotone"></ui-icon>
                  <span class="step-title">Step ${index + 1}: ${step.action}</span>
                  <span class="step-time">${new Date(step.timestamp).toLocaleTimeString()}</span>
                  ${isShareTarget ? H`<span class="step-badge share-target-badge" title="Share Target Result">Share</span>` : ""}
                  <button class="btn small" data-restore-step="${index}">Use Result</button>
                </div>
                <div class="step-content">
                  <div class="step-preview">${step.content.substring(0, 100)}${step.content.length > 100 ? "..." : ""}</div>
                </div>
              </div>`;
		}) : ""}
              </div>
            </div>
          </div>`;
	}
	updateDataPipeline(state) {
		if (!this.container) return;
		const pipelinePanel = this.container.querySelector("[data-results-tab-panel=\"pipeline\"]");
		if (!pipelinePanel) return;
		const pipelineHTML = this.renderDataPipeline(state);
		if (typeof pipelineHTML === "string") pipelinePanel.innerHTML = `<div class="wc-results-empty">No data pipeline yet</div>`;
		else {
			pipelinePanel.innerHTML = "";
			pipelinePanel.appendChild(pipelineHTML);
		}
	}
	updateRecognizedStatus(state) {
		if (!this.container) return;
		const statusElement = this.container.querySelector(".wc-recognized-status");
		if (state.recognizedData) {
			if (!statusElement) {
				const fileInputArea = this.container.querySelector(".wc-file-drop-overlay");
				if (fileInputArea) {
					const newStatus = H`<div class="wc-recognized-status">
                        <ui-icon icon="check-circle" size="16" icon-style="duotone" class="status-icon"></ui-icon>
                        <span>Content recognized - ready for actions</span>
                        <button class="btn small clear-recognized" data-action="clear-recognized">Clear</button>
                    </div>`;
					fileInputArea.appendChild(newStatus);
				}
			}
		} else if (statusElement) statusElement.remove();
	}
	renderOutputHeader() {
		return `
            <div class="wc-output-header">
                <div class="wc-output-actions">
                    <button class="btn btn-icon" data-action="view-output" title="View output in Viewer">
                        <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">View</span>
                    </button>
                    <button class="btn btn-icon" data-action="copy-results" title="Copy results">
                        <ui-icon icon="copy" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Copy</span>
                    </button>
                    <button class="btn btn-icon" data-action="save-to-explorer" title="Save to Explorer">
                        <ui-icon icon="floppy-disk" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Save</span>
                    </button>
                    <button class="btn btn-icon" data-action="clear-results" title="Clear results">
                        <ui-icon icon="trash" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Clear</span>
                    </button>
                </div>
            </div>
        `;
	}
	renderOutputContent() {
		return `
            <div class="wc-output-content" data-output>
                <div class="wc-results-empty">No results yet</div>
            </div>
        `;
	}
	restorePipelineStep(state, stepIndex) {
		if (!this.container) return;
		if (state.processedData && state.processedData[stepIndex]) {
			const step = state.processedData[stepIndex];
			const outputContent = this.container.querySelector("[data-output]");
			if (outputContent) {
				outputContent.innerHTML = `<div class="result-content">${this.dataProcessing.formatResult({ content: step.content }, state.outputFormat)}</div>`;
				state.lastRawResult = { data: step.content };
			}
		}
	}
	updateAllResultsUI(state) {
		this.updateDataPipeline(state);
		this.updateRecognizedStatus(state);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterAttachments.ts
var WorkCenterAttachments = class {
	container = null;
	deps;
	fileOps;
	previewUrlCache = /* @__PURE__ */ new WeakMap();
	constructor(dependencies, fileOps) {
		this.deps = dependencies;
		this.fileOps = fileOps;
	}
	setContainer(container) {
		this.container = container;
	}
	renderAttachmentsSection(state) {
		return `
            <div class="wc-attachments-section">
              <div class="file-attachment-area" data-file-drop-zone="" data-dropzone="">
                <div class="file-drop-zone" >
                  <div class="drop-zone-content">
                    <ui-icon icon="folder" size="4rem" icon-style="duotone" class="drop-icon"></ui-icon>
                    <div class="drop-text">Drop files here or click to select files</div>
                    <div class="drop-hint" data-drop-hint>Supports: Images, Documents, Text files, PDFs, URLs, Base64 data</div>
                  </div>
                </div>
                <div class="file-list" data-file-list></div>
                ${this.renderRecognizedStatus(state)}
              </div>
              <div class="wc-block-header wc-attachments-toolbar">
                <div class="file-stats">
                  <div class="file-counter" data-file-count>
                    <ui-icon icon="file" size="16" icon-style="duotone"></ui-icon>
                    <span class="count">${state.files.length}</span>
                    <span class="label">files attached</span>
                  </div>
                  ${state.recognizedData ? `
                    <div class="data-counter recognized">
                      <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                      <span>Content recognized</span>
                    </div>
                  ` : ""}
                  ${state.processedData && state.processedData.length > 0 ? `
                    <div class="data-counter processed">
                      <ui-icon icon="cogs" size="16" icon-style="duotone"></ui-icon>
                      <span>${state.processedData.length} processing steps</span>
                    </div>
                  ` : ""}
                </div>
              </div>
            </div>
        `;
	}
	renderRecognizedStatus(state) {
		if (!state.recognizedData) return "";
		return `
            <div class="wc-recognized-status">
              <ui-icon icon="check-circle" size="16" icon-style="duotone" class="status-icon"></ui-icon>
              <span>Content recognized - ready for processing</span>
              <button class="btn small clear-recognized" data-action="clear-recognized">Clear</button>
            </div>
        `;
	}
	updateFileList(state) {
		if (!this.container) return;
		const fileList = this.container.querySelector("[data-file-list]");
		if (!fileList) return;
		fileList.innerHTML = "";
		if (state.files.length === 0) {
			fileList.innerHTML = "<div class=\"wc-attachments-empty\">No files attached</div>";
			return;
		}
		state.files.forEach((file, index) => {
			const fileItem = this.createFileItem(file, index, state);
			fileList.append(fileItem);
		});
	}
	createFileItem(file, index, state) {
		const isImage = this.isImageFile(file);
		const isMarkdown = this.isMarkdownFile(file);
		const previewUrl = isImage ? this.getOrCreatePreviewUrl(file) : null;
		const fileSize = this.formatFileSize(file.size);
		const fileItem = H`<div class="file-item" data-file-index="${index}">
      <div class="file-info">
        <span class="file-icon">${this.createFileIconElement(file.type)}</span>
        ${previewUrl ? H`<img class="file-preview" alt=${file.name || "image"} src=${previewUrl} loading="lazy" decoding="async" />` : ""}
        <div class="file-details">
          <span class="file-name">${file.name || "Unnamed file"}</span>
          <span class="file-size">(${fileSize})</span>
          <span class="file-type">${this.getReadableFileType(file.type)}</span>
        </div>
        ${isMarkdown ? H`<button class="btn small" data-open-md="${index}" title="Open in Markdown Viewer">Open</button>` : ""}
      </div>
      <button class="btn small remove-btn" data-remove="${index}" title="Remove file">✕</button>
    </div>`;
		const openBtn = fileItem.querySelector(`[data-open-md="${index}"]`);
		if (openBtn) openBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this.openMarkdownInViewer(file);
		});
		fileItem.querySelector(".remove-btn").addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeFile(state, index);
		});
		return fileItem;
	}
	removeFile(state, index) {
		const removedFile = state.files[index];
		if (removedFile) {
			this.revokePreviewUrl(removedFile);
			state.files.splice(index, 1);
			this.updateFileList(state);
			this.updateFileCounter(state);
			this.deps.onFilesChanged?.();
		}
	}
	setupDropZone(state) {
		if (!this.container) return;
		const dropZone = this.container.querySelector("[data-file-drop-zone]");
		if (!dropZone) return;
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.accept = "image/*,.pdf,.txt,.md,.json,.html,.css,.js,.ts";
		fileInput.style.display = "none";
		this.container.append(fileInput);
		this.updateDropHint();
		dropZone.addEventListener("click", (e) => {
			if (e.target?.closest("button, a, input, select, textarea, label, [data-remove], [data-open-md]")) return;
			fileInput.click();
		});
		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZone.classList.add("drag-over");
		});
		dropZone.addEventListener("dragleave", (e) => {
			const rect = dropZone.getBoundingClientRect();
			const x = e.clientX;
			const y = e.clientY;
			if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) dropZone.classList.remove("drag-over");
		});
		dropZone.addEventListener("drop", async (e) => {
			e.preventDefault();
			dropZone.classList.remove("drag-over");
			const dataTransfer = e.dataTransfer;
			if (!dataTransfer) return;
			let contentAdded = false;
			const files = Array.from(dataTransfer.files || []);
			if (files.length > 0) {
				this.fileOps.addFilesFromInput(state, files);
				this.updateFileList(state);
				this.updateFileCounter(state);
				this.deps.onFilesChanged?.();
				contentAdded = true;
			}
			if (!contentAdded && dataTransfer.types.includes("text/plain")) try {
				const textContent = dataTransfer.getData("text/plain");
				if (textContent?.trim()) {
					await this.fileOps.handleDroppedContent(state, textContent.trim(), "text");
					contentAdded = true;
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged text:", error);
			}
			if (!contentAdded && dataTransfer.types.includes("text/uri-list")) try {
				const urls = dataTransfer.getData("text/uri-list").split("\n").filter((url) => url.trim() && !url.startsWith("#"));
				if (urls.length > 0) {
					for (const url of urls) if (this.isValidUrl(url.trim())) {
						await this.fileOps.handleDroppedContent(state, url.trim(), "url");
						break;
					}
					contentAdded = true;
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged URLs:", error);
			}
			if (!contentAdded && dataTransfer.types.includes("text/html")) try {
				const htmlContent = dataTransfer.getData("text/html");
				if (htmlContent) {
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = htmlContent;
					const extractedText = tempDiv.textContent || tempDiv.innerText || "";
					if (extractedText.trim()) {
						await this.fileOps.handleDroppedContent(state, extractedText.trim(), "html");
						contentAdded = true;
					}
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged HTML:", error);
			}
		});
		fileInput.addEventListener("change", async (e) => {
			const files = Array.from(e.target.files || []);
			this.fileOps.addFilesFromInput(state, files);
			this.updateFileList(state);
			this.updateFileCounter(state);
			this.deps.onFilesChanged?.();
			if (files.filter((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f.name?.endsWith(".md") || f.name?.endsWith(".txt")).length > 0 && state.selectedTemplate && state.selectedTemplate.trim()) {
				console.log("[WorkCenter] Auto-processing text/markdown files with template:", state.selectedTemplate);
				setTimeout(async () => {
					this.deps.showMessage?.("Files attached and ready for processing");
				}, 100);
			}
		});
	}
	updateFileCounter(state) {
		if (!this.container) return;
		const counter = this.container.querySelector("[data-file-count] .count");
		if (counter) counter.textContent = state.files.length.toString();
	}
	updateDataCounters(state) {
		if (!this.container) return;
		const recognizedCounter = this.container.querySelector(".data-counter.recognized");
		if (state.recognizedData) {
			if (!recognizedCounter) {
				const statsContainer = this.container.querySelector(".file-stats");
				if (statsContainer) {
					const newCounter = H`<div class="data-counter recognized">
                        <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                        <span>Content recognized</span>
                    </div>`;
					statsContainer.appendChild(newCounter);
				}
			}
		} else if (recognizedCounter) recognizedCounter.remove();
		const processedCounter = this.container.querySelector(".data-counter.processed");
		if (state.processedData && state.processedData.length > 0) if (processedCounter) {
			const span = processedCounter.querySelector("span");
			if (span) span.textContent = `${state.processedData.length} processing steps`;
		} else {
			const statsContainer = this.container.querySelector(".file-stats");
			if (statsContainer) {
				const newCounter = H`<div class="data-counter processed">
                        <ui-icon icon="cogs" size="16" icon-style="duotone"></ui-icon>
                        <span>${state.processedData.length} processing steps</span>
                    </div>`;
				statsContainer.appendChild(newCounter);
			}
		}
		else if (processedCounter) processedCounter.remove();
	}
	clearAllFiles(state) {
		this.revokeAllPreviewUrls(state);
		state.files.length = 0;
		this.updateFileList(state);
		this.updateFileCounter(state);
		this.updateDataCounters(state);
		this.deps.onFilesChanged?.();
	}
	isImageFile(file) {
		return (file?.type || "").toLowerCase().startsWith("image/");
	}
	isMarkdownFile(file) {
		const name = (file?.name || "").toLowerCase();
		return (file?.type || "").toLowerCase() === "text/markdown" || name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".mdown") || name.endsWith(".mkd") || name.endsWith(".mkdn");
	}
	getOrCreatePreviewUrl(file) {
		if (!file) return null;
		if (!this.isImageFile(file)) return null;
		const cached = this.previewUrlCache.get(file);
		if (cached) return cached;
		try {
			const url = URL.createObjectURL(file);
			this.previewUrlCache.set(file, url);
			return url;
		} catch {
			return null;
		}
	}
	revokePreviewUrl(file) {
		const url = this.previewUrlCache.get(file);
		if (url) try {
			URL.revokeObjectURL(url);
		} catch {}
		this.previewUrlCache.delete(file);
	}
	async openMarkdownInViewer(file) {
		try {
			const md = await file.text();
			try {
				localStorage.setItem("rs-markdown", md);
			} catch {}
			try {
				if (this.deps?.state) {
					this.deps.state.markdown = md;
					this.deps.state.view = "markdown-viewer";
				}
			} catch {}
			this.deps.render?.();
			setTimeout(() => {
				this.deps.showMessage?.(`Opened ${file.name || "file"} in Markdown Viewer`);
			}, 0);
		} catch (e) {
			this.deps.showMessage?.(`Failed to open ${file.name || "file"}`);
			console.warn("[WorkCenter] Failed to open markdown file:", e);
		}
	}
	createFileIconElement(mimeType) {
		return H`<ui-icon icon="${this.getFileIconName(mimeType)}" size="20" icon-style="duotone" class="file-type-icon"></ui-icon>`;
	}
	getFileIconName(mimeType) {
		if (mimeType.startsWith("image/")) return "image";
		if (mimeType === "application/pdf") return "file-pdf";
		if (mimeType.includes("json")) return "file-text";
		if (mimeType.includes("text") || mimeType.includes("markdown")) return "file-text";
		return "file";
	}
	getReadableFileType(mimeType) {
		if (!mimeType) return "Unknown";
		const typeMap = {
			"image/jpeg": "JPEG Image",
			"image/png": "PNG Image",
			"image/gif": "GIF Image",
			"image/webp": "WebP Image",
			"image/svg+xml": "SVG Image",
			"application/pdf": "PDF Document",
			"text/plain": "Text File",
			"text/markdown": "Markdown",
			"application/json": "JSON",
			"text/html": "HTML",
			"text/css": "CSS",
			"application/javascript": "JavaScript",
			"application/typescript": "TypeScript"
		};
		if (typeMap[mimeType]) return typeMap[mimeType];
		if (mimeType.startsWith("image/")) return "Image";
		if (mimeType.startsWith("text/")) return "Text File";
		if (mimeType.startsWith("application/")) return "Document";
		return mimeType.split("/")[1]?.toUpperCase() || "File";
	}
	formatFileSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
	revokeAllPreviewUrls(state) {
		try {
			for (const f of state.files) this.revokePreviewUrl(f);
		} catch {}
	}
	isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}
	updateDropHint() {
		if (!this.container) return;
		const hintElement = this.container.querySelector("[data-drop-hint]");
		if (!hintElement) return;
		switch (globalThis?.location?.hash) {
			case ROUTE_HASHES.SHARE_TARGET_TEXT:
				hintElement.textContent = "Drop text files or paste text content here";
				break;
			case ROUTE_HASHES.SHARE_TARGET_IMAGE:
				hintElement.textContent = "Drop image files here (PNG, JPG, GIF, WebP, etc.)";
				break;
			case ROUTE_HASHES.SHARE_TARGET_FILES:
				hintElement.textContent = "Drop any files here (images, documents, text files, PDFs, etc.)";
				break;
			case ROUTE_HASHES.SHARE_TARGET_URL:
				hintElement.textContent = "Paste URLs here (file drops not accepted on this route)";
				break;
			default:
				hintElement.textContent = "Supports: Images, Documents, Text files, PDFs, URLs, Base64 data";
				break;
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterPrompts.ts
var WorkCenterPrompts = class {
	container = null;
	deps;
	templates;
	voice;
	constructor(dependencies, templates, voice) {
		this.deps = dependencies;
		this.templates = templates;
		this.voice = voice;
	}
	setContainer(container) {
		this.container = container;
	}
	renderPromptPanel(state) {
		return `
            <div class="prompt-panel">
              <div class="prompt-controls">
                <select class="template-select">
                  <option value="">Select Template...</option>
                  ${state.promptTemplates.map((t) => `<option value="${t.prompt.replace(/"/g, "&quot;")}" ${state.selectedTemplate === t.prompt ? "selected" : ""}>${t.name}</option>`).join("")}
                </select>
                <button class="btn btn-icon" data-action="edit-templates" title="Edit Templates">
                  <ui-icon icon="gear" size="18" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Templates</span>
                </button>
                <button class="btn btn-icon prompt-attach-btn" data-action="select-files" title="Attach files">
                  <ui-icon icon="paperclip" size="18" icon-style="duotone"></ui-icon>
                  <span class="attach-count" data-prompt-file-count>${state.files.length}</span>
                </button>
              </div>

              <div class="prompt-input-group" data-prompt-dropzone data-dropzone="">
                <div class="prompt-input-overlay" data-prompt-drop-hint>
                  <ui-icon icon="paperclip" size="16" icon-style="duotone"></ui-icon>
                  <span>Drop files, links or text to attach</span>
                </div>
                <textarea
                  class="prompt-input"
                  placeholder="Describe what you want to do with the attached content... (or use voice input)"
                  rows="4"
                >${state.currentPrompt}</textarea>
              </div>

              <div class="prompt-actions">
                
                <button class="btn voice-btn ${state.voiceRecording ? "recording" : ""}" data-action="voice-input">
                  <ui-icon icon="microphone" size="20" icon-style="duotone"></ui-icon>
                  ${state.voiceRecording ? "Recording..." : "Hold for Voice"}
                </button>
                <label class="auto-action-label" title="Auto-action (use last successful)">
                  <input type="checkbox" class="auto-action-checkbox" ${state.autoAction ? "checked" : ""}>
                  <ui-icon icon="lightning-a" size="20" icon-style="duotone"></ui-icon>
                </label>
                <button class="btn primary action-btn" data-action="execute">
                  <ui-icon icon="brain" size="20" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Process Content</span>
                </button>
                <button class="btn btn-icon clear-btn" data-action="clear-prompt" title="Clear Prompt">
                  <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                </button>
              </div>
            </div>
        `;
	}
	renderPromptsSection(state) {
		return `
            <div class="prompts-section">
              ${this.renderPromptPanel(state)}
            </div>
        `;
	}
	/** Populate the instruction selector with custom instructions from settings */
	async populateInstructionSelect(state) {
		if (!this.container) return;
		const select = this.container.querySelector(".instruction-select");
		if (!select) return;
		const instructions = await this.templates.loadInstructions();
		const hasStoredSelection = Boolean(state.selectedInstruction) && instructions.some((i) => i.id === state.selectedInstruction);
		const selectedId = hasStoredSelection ? state.selectedInstruction : this.templates.getActiveInstructionId();
		select.innerHTML = "<option value=\"\">None (default)</option>";
		for (const instr of instructions) {
			const opt = document.createElement("option");
			opt.value = instr.id;
			opt.textContent = instr.label;
			if (instr.id === selectedId) opt.selected = true;
			select.append(opt);
		}
		if ((!state.selectedInstruction || !hasStoredSelection) && selectedId) state.selectedInstruction = selectedId;
	}
	/** Update the instruction selector options (sync, after loadInstructions) */
	updateInstructionSelect(state) {
		if (!this.container) return;
		const select = this.container.querySelector(".instruction-select");
		if (!select) return;
		const instructions = this.templates.getInstructions();
		const selectedId = Boolean(state.selectedInstruction) && instructions.some((i) => i.id === state.selectedInstruction) ? state.selectedInstruction : this.templates.getActiveInstructionId();
		select.innerHTML = "<option value=\"\">None (default)</option>";
		for (const instr of instructions) {
			const opt = document.createElement("option");
			opt.value = instr.id;
			opt.textContent = instr.label;
			if (instr.id === selectedId) opt.selected = true;
			select.append(opt);
		}
	}
	/** Get the currently selected instruction object */
	getSelectedInstruction(state) {
		if (!state.selectedInstruction) return null;
		return this.templates.getInstructionById(state.selectedInstruction) || null;
	}
	updatePromptInput(state) {
		if (!this.container) return;
		const promptInput = this.container.querySelector(".prompt-input");
		if (promptInput) promptInput.value = state.currentPrompt;
	}
	updateTemplateSelect(state) {
		if (!this.container) return;
		const templateSelect = this.container.querySelector(".template-select");
		if (templateSelect) {
			const currentValue = templateSelect.value;
			templateSelect.innerHTML = "<option value=\"\">Select Template...</option>" + state.promptTemplates.map((t) => `<option value="${t.prompt.replace(/"/g, "&quot;")}" ${state.selectedTemplate === t.prompt ? "selected" : ""}>${t.name}</option>`).join("");
			if (state.selectedTemplate && state.promptTemplates.some((t) => t.prompt === state.selectedTemplate)) templateSelect.value = state.selectedTemplate;
			else templateSelect.value = currentValue;
		}
	}
	updateVoiceButton(state) {
		if (!this.container) return;
		const voiceBtn = this.container.querySelector("[data-action=\"voice-input\"]");
		if (voiceBtn) {
			voiceBtn.innerHTML = state.voiceRecording ? "<ui-icon icon=\"microphone\" size=\"20\" icon-style=\"duotone\"></ui-icon> Recording..." : "<ui-icon icon=\"microphone\" size=\"20\" icon-style=\"duotone\"></ui-icon> Hold for Voice";
			voiceBtn.classList.toggle("recording", state.voiceRecording);
		}
	}
	updatePromptFileCount(state) {
		if (!this.container) return;
		const count = this.container.querySelector("[data-prompt-file-count]");
		if (count) count.textContent = String(state.files.length);
	}
	clearPrompt(state) {
		state.currentPrompt = "";
		this.updatePromptInput(state);
	}
	handleTemplateSelection(state, selectedPrompt) {
		state.selectedTemplate = selectedPrompt;
		if (selectedPrompt) {
			state.currentPrompt = selectedPrompt;
			this.updatePromptInput(state);
		}
	}
	handleInstructionSelection(state, instructionId) {
		state.selectedInstruction = instructionId;
	}
	handleAutoActionToggle(state, checked) {
		state.autoAction = checked;
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterHistory.ts
var WorkCenterHistory = class {
	container = null;
	deps;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	setContainer(container) {
		this.container = container;
	}
	updateRecentHistory(state) {
		if (!this.container) return;
		const historyContainer = this.container.querySelector("[data-recent-history]");
		if (!historyContainer) return;
		historyContainer.innerHTML = "";
		const recentItems = actionHistory.getRecentEntries(10).filter((entry) => entry.context.source === "workcenter" && entry.status === "completed");
		if (recentItems.length === 0) {
			historyContainer.innerHTML = "<div class=\"wc-history-empty\">No recent activity</div>";
			return;
		}
		recentItems.slice(0, 3).forEach((item) => {
			const historyItem = H`<div class="history-item-compact">
        <div class="history-meta">
          <span class="history-status ${item.result?.type !== "error" ? "success" : "error"}">${item.result?.type !== "error" ? "✓" : "✗"}</span>
          <span class="history-prompt">${item.input.text?.substring(0, 50) || item.action}${item.input.text && item.input.text.length > 50 ? "..." : ""}</span>
          ${item.result?.processingTime ? H`<span class="history-time">${Math.round(item.result.processingTime / 1e3)}s</span>` : ""}
        </div>
        <button class="btn small" data-restore="${item.id}">Use</button>
      </div>`;
			historyItem.querySelector("button")?.addEventListener("click", () => {
				if (item.input.text) {
					state.currentPrompt = item.input.text;
					this.deps.showMessage?.("Restored prompt from history");
				}
			});
			historyContainer.append(historyItem);
		});
	}
	updateActionHistory() {
		if (!this.container) return;
		const statsContainer = this.container.querySelector("[data-action-stats]");
		if (statsContainer) {
			const stats = actionHistory.getStats();
			statsContainer.innerHTML = `
                <div class="stats-item">Total: ${stats.total}</div>
                <div class="stats-item">Success: ${stats.completed}</div>
                <div class="stats-item">Failed: ${stats.failed}</div>
            `;
		}
	}
	showActionHistory() {
		if (!this.container) return;
		const actionEntries = actionHistory.getRecentEntries(50).filter((entry) => entry.context.source === "workcenter");
		const modal = H`<div class="action-history-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Action History</h3>
          <div class="modal-actions">
            <button class="btn btn-icon" data-action="export-history" title="Export History">
              <ui-icon icon="download" size="18" icon-style="duotone"></ui-icon>
            </button>
            <button class="btn btn-icon" data-action="clear-history" title="Clear History">
              <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
            </button>
            <button class="btn" data-action="close-modal">Close</button>
          </div>
        </div>

        <div class="history-stats">
          ${(() => {
			const stats = actionHistory.getStats();
			return H`
              <div class="stat-card">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Actions</div>
              </div>
              <div class="stat-card">
                <div class="stat-value success">${stats.completed}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value error">${stats.failed}</div>
                <div class="stat-label">Failed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.byAction["recognize"] || 0}</div>
                <div class="stat-label">Recognitions</div>
              </div>
            `;
		})()}
        </div>

        <div class="history-filters">
          <select class="filter-select" data-filter="status">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
          <select class="filter-select" data-filter="action">
            <option value="">All Actions</option>
            <option value="recognize">Recognize</option>
            <option value="analyze">Analyze</option>
            <option value="process">Process</option>
          </select>
        </div>

        <div class="action-history-list">
          ${actionEntries.length === 0 ? H`<div class="wc-history-empty">No actions found</div>` : actionEntries.map((entry) => H`<div class="action-history-item ${entry.status}">
              <div class="action-header">
                <div class="action-meta">
                  <span class="action-status ${entry.status}">${this.getStatusIcon(entry.status)}</span>
                  <span class="action-type">${entry.action}</span>
                  <span class="action-time">${this.formatTimeAgo(entry.timestamp)}</span>
                  ${entry.result?.processingTime ? H`<span class="action-duration">${Math.round(entry.result.processingTime / 1e3)}s</span>` : ""}
                </div>
                <div class="action-actions">
                  ${entry.result ? H`<button class="btn small" data-restore-action="${entry.id}">Use Result</button>` : ""}
                  <button class="btn small" data-view-details="${entry.id}">Details</button>
                </div>
              </div>

              <div class="action-content">
                <div class="input-preview">
                  <strong>Input:</strong>
                  ${entry.input.files?.length ? `${entry.input.files.length} file(s): ${entry.input.files.map((f) => f.name).join(", ")}` : entry.input.text?.substring(0, 100) || "No input"}
                  ${entry.input.text && entry.input.text.length > 100 ? "..." : ""}
                </div>

                ${entry.result ? H`<div class="result-preview">
                  <strong>Result:</strong>
                  <div class="result-content">${entry.result.content.substring(0, 200)}${entry.result.content.length > 200 ? "..." : ""}</div>
                </div>` : ""}

                ${entry.error ? H`<div class="error-preview">
                  <strong>Error:</strong> ${entry.error}
                </div>` : ""}
              </div>
            </div>`)}
        </div>
      </div>
    </div>`;
		modal.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action") || target.closest("[data-action]")?.getAttribute("data-action");
			const entryId = target.getAttribute("data-restore-action") || target.getAttribute("data-view-details");
			if (action === "close-modal") modal.remove();
			else if (action === "export-history") this.exportActionHistory();
			else if (action === "clear-history") {
				if (confirm("Are you sure you want to clear all action history?")) {
					actionHistory.clearEntries();
					modal.remove();
					this.updateRecentHistory({});
				}
			} else if (entryId) {
				const entry = actionHistory.getEntry(entryId);
				if (entry) {
					if (target.hasAttribute("data-restore-action") && entry.result) {
						this.deps.showMessage?.("Result restored from history");
						modal.remove();
					} else if (target.hasAttribute("data-view-details")) this.showActionDetails(entry);
				}
			}
		});
		modal.querySelectorAll(".filter-select").forEach((select) => {
			select.addEventListener("change", () => this.applyHistoryFilters(modal));
		});
		this.container.append(modal);
	}
	showActionDetails(entry) {
		const modal = H`<div class="action-details-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Action Details</h3>
          <button class="btn" data-action="close-modal">Close</button>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <label>ID:</label>
            <span>${entry.id}</span>
          </div>
          <div class="detail-item">
            <label>Timestamp:</label>
            <span>${new Date(entry.timestamp).toLocaleString()}</span>
          </div>
          <div class="detail-item">
            <label>Source:</label>
            <span>${entry.context.source}</span>
          </div>
          <div class="detail-item">
            <label>Action:</label>
            <span>${entry.action}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status-${entry.status}">${entry.status}</span>
          </div>
          ${entry.result?.processingTime ? H`<div class="detail-item">
            <label>Processing Time:</label>
            <span>${Math.round(entry.result.processingTime / 1e3)}s</span>
          </div>` : ""}
        </div>

        <div class="details-section">
          <h4>Input</h4>
          <div class="input-details">
            <div>Type: ${entry.input.type}</div>
            ${entry.input.files ? H`<div>Files: ${entry.input.files.map((f) => f.name).join(", ")}</div>` : ""}
            ${entry.input.text ? H`<div>Text: <pre>${entry.input.text}</pre></div>` : ""}
          </div>
        </div>

        ${entry.result ? H`<div class="details-section">
          <h4>Result</h4>
          <div class="result-details">
            <div>Type: ${entry.result.type}</div>
            <div>Auto Copied: ${entry.result.autoCopied ? "Yes" : "No"}</div>
            <div>Content: <pre>${entry.result.content}</pre></div>
          </div>
        </div>` : ""}

        ${entry.error ? H`<div class="details-section">
          <h4>Error</h4>
          <div class="error-details">${entry.error}</div>
        </div>` : ""}
      </div>
    </div>`;
		modal.addEventListener("click", (e) => {
			if (e.target.getAttribute("data-action") === "close-modal") modal.remove();
		});
		document.body.append(modal);
	}
	applyHistoryFilters(modal) {
		const statusFilter = modal.querySelector("[data-filter=\"status\"]").value;
		const actionFilter = modal.querySelector("[data-filter=\"action\"]").value;
		modal.querySelectorAll(".action-history-item").forEach((item) => {
			const status = item.classList[1];
			const action = item.querySelector(".action-type")?.textContent || "";
			const statusMatch = !statusFilter || status === statusFilter;
			const actionMatch = !actionFilter || action === actionFilter;
			item.style.display = statusMatch && actionMatch ? "block" : "none";
		});
	}
	exportActionHistory() {
		const data = actionHistory.exportEntries("json");
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `action-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
		this.deps.showMessage?.("History exported successfully");
	}
	getStatusIcon(status) {
		switch (status) {
			case "completed": return "✓";
			case "failed": return "✗";
			case "processing": return "⟳";
			case "pending": return "⏳";
			case "cancelled": return "⊗";
			default: return "?";
		}
	}
	formatTimeAgo(timestamp) {
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 6e4);
		const hours = Math.floor(diff / 36e5);
		const days = Math.floor(diff / 864e5);
		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return "Just now";
	}
	getLastSuccessfulPrompt() {
		return this.deps.history.find((h) => h.ok)?.prompt || "Process the provided content";
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenter.ts
var MATH_DELIMITER_PATTERN = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|(?<!\$)\$[^$\n]+\$|\\\([\s\S]*?\\\)/;
var FENCED_CODE_PATTERN = /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
var INLINE_CODE_PATTERN = /`[^`\n]+`/g;
function maskCodeSegments(markdown) {
	const maskedValues = [];
	const tokenPrefix = "__MD_MASK_";
	const tokenSuffix = "__";
	const mask = (value) => value.replace(FENCED_CODE_PATTERN, (segment) => {
		const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
		maskedValues.push(segment);
		return token;
	});
	const maskInline = (value) => value.replace(INLINE_CODE_PATTERN, (segment) => {
		const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
		maskedValues.push(segment);
		return token;
	});
	return {
		masked: maskInline(mask(markdown)),
		restore: (value) => value.replace(/__MD_MASK_(\d+)__/g, (_, index) => maskedValues[Number(index)] ?? "")
	};
}
g?.use?.(src_default({
	throwOnError: false,
	nonStandard: true,
	output: "mathml",
	strict: false
}), { hooks: { preprocess: (markdown) => {
	if (!MATH_DELIMITER_PATTERN.test(markdown)) return markdown;
	const { masked, restore } = maskCodeSegments(markdown);
	const katexNode = document.createElement("div");
	katexNode.textContent = masked;
	renderMathInElement(katexNode, {
		throwOnError: false,
		nonStandard: true,
		output: "mathml",
		strict: false,
		delimiters: [
			{
				left: "$$",
				right: "$$",
				display: true
			},
			{
				left: "\\[",
				right: "\\]",
				display: true
			},
			{
				left: "$",
				right: "$",
				display: false
			},
			{
				left: "\\(",
				right: "\\)",
				display: false
			}
		]
	});
	return restore(katexNode.innerHTML);
} } });
var WorkCenterManager = class {
	state;
	deps;
	ui;
	fileOps;
	shareTarget;
	templates;
	voice;
	actions;
	dataProcessing;
	attachments;
	prompts;
	results;
	history;
	events;
	processedMessageIds = /* @__PURE__ */ new Set();
	constructor(dependencies) {
		this.deps = dependencies;
		this.state = WorkCenterStateManager.createDefaultState();
		this.dataProcessing = new WorkCenterDataProcessing();
		this.templates = new WorkCenterTemplates(dependencies);
		this.voice = new WorkCenterVoice(dependencies);
		this.fileOps = new WorkCenterFileOps(dependencies);
		this.history = new WorkCenterHistory(dependencies);
		this.attachments = new WorkCenterAttachments(dependencies, this.fileOps);
		this.prompts = new WorkCenterPrompts(dependencies, this.templates, this.voice);
		this.results = new WorkCenterResults(dependencies, this.dataProcessing);
		this.ui = new WorkCenterUI(dependencies, this.attachments, this.prompts, this.results, this.history);
		this.shareTarget = new WorkCenterShareTarget(dependencies, this.fileOps);
		this.actions = new WorkCenterActions(dependencies, this.ui, this.fileOps, this.dataProcessing, this.results, this.history, this.templates);
		this.events = new WorkCenterEvents(dependencies, this.ui, this.fileOps, this.actions, this.templates, this.voice, this.shareTarget, this.history, this.attachments, this.prompts, this.state);
		this.shareTarget.initShareTargetListener(this.state);
		registerComponent("workcenter-core", "workcenter");
		this.shareTarget.processQueuedMessages(this.state);
		const pendingMessages = initializeComponent("workcenter-core");
		for (const message of pendingMessages) {
			console.log(`[WorkCenter] Processing pending message:`, message);
			this.handleExternalMessage(message);
		}
		if (typeof globalThis !== "undefined") globalThis?.addEventListener?.("hashchange", () => {
			this.attachments.updateDropHint?.();
		});
	}
	async handleDroppedContent(content, sourceType) {
		return this.fileOps.handleDroppedContent(this.state, content, sourceType);
	}
	async handlePastedContent(content, sourceType) {
		return this.fileOps.handlePastedContent(this.state, content, sourceType);
	}
	async handleIncomingContent(data, contentType) {
		try {
			let fileToAttach = null;
			if (data.file instanceof File) fileToAttach = data.file;
			else if (data.blob instanceof Blob) {
				const filename = data.filename || `attachment-${Date.now()}.${contentType === "markdown" ? "md" : "txt"}`;
				fileToAttach = new File([data.blob], filename, { type: data.blob.type });
			} else if (data.text || data.content) {
				const content = data.text || data.content;
				const textContent = typeof content === "string" ? content : JSON.stringify(content, null, 2);
				const filename = data.filename || `content-${Date.now()}.${contentType === "markdown" ? "md" : "txt"}`;
				fileToAttach = new File([textContent], filename, { type: contentType === "markdown" ? "text/markdown" : "text/plain" });
			}
			if (fileToAttach) {
				this.state.files.push(fileToAttach);
				this.ui.updateFileList(this.state);
				this.ui.updateFileCounter(this.state);
				this.deps.showMessage(`Attached ${fileToAttach.name} to Work Center`);
			}
		} catch (error) {
			console.warn("[WorkCenter] Failed to handle incoming content:", error);
			this.deps.showMessage("Failed to attach content");
		}
	}
	/**
	* Public entry for Basic/Main unified-messaging handler and pending inbox replay.
	* Handles share-target inputs/results and general content-share attachment.
	*/
	async handleExternalMessage(message) {
		if (!message) return;
		const messageId = typeof message?.id === "string" ? message.id : "";
		if (messageId) {
			if (this.processedMessageIds.has(messageId)) return;
			this.processedMessageIds.add(messageId);
			if (this.processedMessageIds.size > 256) {
				const [first] = this.processedMessageIds;
				if (first) this.processedMessageIds.delete(first);
			}
		}
		if (message.type === "share-target-input" && message.data) {
			await this.shareTarget.addShareTargetInput(this.state, message.data);
			this.ui.updateFileList(this.state);
			this.ui.updateFileCounter(this.state);
			this.ui.updateDataPipeline(this.state);
			return;
		}
		if (message.type === "share-target-result" && message.data) {
			await this.shareTarget.addShareTargetResult(this.state, message.data);
			this.ui.updateDataPipeline(this.state);
			return;
		}
		if (message.type === "ai-result" && message.data) {
			await this.shareTarget.handleAIResult(this.state, message.data);
			this.ui.updateDataPipeline(this.state);
			return;
		}
		if (message.type === "content-share" && message.data) await this.handleIncomingContent(message.data, message.contentType || "text");
	}
	getState() {
		return this.state;
	}
	destroy() {
		this.ui.setContainer(null);
		this.attachments.setContainer(null);
		this.prompts.setContainer(null);
		this.results.setContainer(null);
		this.history.setContainer(null);
		console.log("[WorkCenter] WorkCenterManager destroyed");
	}
	renderWorkCenterView() {
		const container = this.ui.renderWorkCenterView(this.state);
		this.events.setContainer(container);
		this.events.setupWorkCenterEvents();
		this.ui.updateFileList(this.state);
		this.ui.updateFileCounter(this.state);
		this.history.updateRecentHistory(this.state);
		return container;
	}
};
//#endregion
export { WorkCenterManager };
