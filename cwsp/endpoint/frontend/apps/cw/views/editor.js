import { V as H } from "../com/app3.js";
import "../fest/icon.js";
import { ViewerView } from "./viewer.js";
//#region src/frontend/views/editor/editors/MarkdownEditor.ts
var MarkdownEditor = class MarkdownEditor {
	options;
	container = null;
	editor = null;
	preview = null;
	autoSaveTimeout = null;
	/** Coalesce live preview + stats so large docs do not parse/markdown on every keystroke. */
	previewStatsDebounce = null;
	static PREVIEW_STATS_DEBOUNCE_MS = 160;
	constructor(options = {}) {
		this.options = {
			initialContent: "",
			placeholder: "Start writing your markdown here...",
			autoSave: true,
			autoSaveDelay: 1e3,
			...options
		};
	}
	/**
	* Render the markdown editor with live preview
	*/
	render() {
		this.container = H`<div class="markdown-editor-container">
      <div class="editor-header">
        <h3>Markdown Editor</h3>
        <div class="editor-actions">
          <button class="btn" data-action="clear">Clear</button>
          <button class="btn primary" data-action="save">Save</button>
        </div>
      </div>

      <div class="editor-layout">
        <div class="editor-panel">
          <div class="editor-toolbar">
            <div class="toolbar-group">
              <button class="btn small" data-action="bold" title="Bold">**bold**</button>
              <button class="btn small" data-action="italic" title="Italic">*italic*</button>
              <button class="btn small" data-action="code" title="Code">\`code\`</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="link" title="Link">[link](url)</button>
              <button class="btn small" data-action="image" title="Image">![alt](url)</button>
              <button class="btn small" data-action="list" title="List">- item</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="heading" title="Heading"># Heading</button>
              <button class="btn small" data-action="quote" title="Quote">> quote</button>
              <button class="btn small" data-action="codeblock" title="Code Block">\`\`\`</button>
            </div>
          </div>

          <textarea
            class="markdown-textarea"
            placeholder="${this.options.placeholder}"
            spellcheck="false"
          >${this.options.initialContent}</textarea>

          <div class="editor-footer">
            <div class="editor-stats">
              <span class="char-count">0 characters</span>
              <span class="word-count">0 words</span>
              <span class="line-count">0 lines</span>
            </div>
            <div class="editor-actions">
              <button class="btn small" data-action="print" title="Print content">
                <ui-icon icon="printer" size="16" icon-style="duotone"></ui-icon>
                Print
              </button>
              <button class="btn small" data-action="export-docx" title="Export as DOCX">
                <ui-icon icon="file-doc" size="16" icon-style="duotone"></ui-icon>
                DOCX
              </button>
            </div>
            <div class="editor-mode">
              <button class="btn small active" data-mode="edit">Edit</button>
              <button class="btn small" data-mode="preview">Preview</button>
              <button class="btn small" data-mode="split">Split</button>
            </div>
          </div>
        </div>

        <div class="preview-panel">
          <div class="preview-header">
            <h4>Live Preview</h4>
          </div>
          <div class="preview-content"></div>
        </div>
      </div>
    </div>`;
		this.initializeEditor(this.container);
		return this.container;
	}
	/**
	* Get current content
	*/
	getContent() {
		return this.editor?.value || "";
	}
	/**
	* Print current content
	*/
	printContent() {
		if (!this.getContent().trim()) {
			console.warn("[MarkdownEditor] No content to print");
			return;
		}
		try {
			const previewContent = this.container?.querySelector(".markdown-viewer-content");
			if (!previewContent) {
				console.error("[MarkdownEditor] Could not find preview content for printing");
				return;
			}
			const printUrl = new URL("/print", globalThis?.location?.origin);
			printUrl.searchParams.set("content", previewContent.innerHTML);
			printUrl.searchParams.set("title", "Markdown Editor Content");
			if (!globalThis?.open(printUrl.toString(), "_blank", "width=800,height=600")) {
				console.warn("[MarkdownEditor] Failed to open print window - popup blocked?");
				this.printCurrentContent();
				return;
			}
			console.log("[MarkdownEditor] Print window opened successfully");
		} catch (error) {
			console.error("[MarkdownEditor] Error printing content:", error);
			this.printCurrentContent();
		}
	}
	async exportDocx() {
		const content = this.getContent();
		if (!content.trim()) return;
		const { downloadMarkdownAsDocx } = await import("../com/service19.js").then((n) => n.t);
		await downloadMarkdownAsDocx(content, {
			title: "Markdown Editor Content",
			filename: `markdown-editor-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.docx`
		});
	}
	/**
	* Print current content using browser's print dialog
	*/
	printCurrentContent() {
		const previewContent = this.container?.querySelector(".markdown-viewer-content");
		if (previewContent) {
			previewContent.setAttribute("data-print", "true");
			globalThis?.print?.();
			setTimeout(() => {
				previewContent.removeAttribute("data-print");
			}, 1e3);
		}
	}
	/**
	* Set content
	*/
	setContent(content) {
		if (this.editor) {
			this.editor.value = content;
			if (this.previewStatsDebounce !== null) {
				globalThis.clearTimeout(this.previewStatsDebounce);
				this.previewStatsDebounce = null;
			}
			this.updatePreview();
			this.updateStats();
		}
	}
	/**
	* Focus the editor
	*/
	focus() {
		this.editor?.focus();
	}
	/**
	* Clear the editor
	*/
	clear() {
		this.setContent("");
		this.options.onContentChange?.("");
	}
	/**
	* Save the content
	*/
	save() {
		const content = this.getContent();
		this.options.onSave?.(content);
	}
	initializeEditor(container) {
		this.editor = container.querySelector(".markdown-textarea");
		const previewContainer = container.querySelector(".preview-content");
		this.preview = new ViewerView({ initialContent: "" });
		const previewElement = this.preview.render();
		previewContainer.append(previewElement);
		this.setupEventListeners(container);
		this.updatePreview();
		this.updateStats();
	}
	setupEventListeners(container) {
		if (!this.editor) return;
		this.editor.addEventListener("input", () => {
			this.handleContentChange();
		});
		this.editor.addEventListener("change", () => {
			this.handleContentChange();
		});
		container.addEventListener("click", (e) => {
			const action = (e.target?.closest?.("[data-action]"))?.getAttribute("data-action");
			if (action) {
				e.preventDefault();
				this.handleToolbarAction(action);
			}
		});
		container.addEventListener("click", (e) => {
			const mode = e.target.getAttribute("data-mode");
			if (mode) this.switchMode(mode);
		});
	}
	handleContentChange() {
		const content = this.getContent();
		this.options.onContentChange?.(content);
		if (this.options.autoSave) this.scheduleAutoSave();
		this.schedulePreviewAndStatsUpdate();
	}
	schedulePreviewAndStatsUpdate() {
		if (this.previewStatsDebounce !== null) globalThis.clearTimeout(this.previewStatsDebounce);
		this.previewStatsDebounce = globalThis.setTimeout(() => {
			this.previewStatsDebounce = null;
			this.updatePreview();
			this.updateStats();
		}, MarkdownEditor.PREVIEW_STATS_DEBOUNCE_MS);
	}
	handleToolbarAction(action) {
		const textarea = this.editor;
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = textarea.value.substring(start, end);
		let replacement = "";
		switch (action) {
			case "bold":
				replacement = selectedText ? `**${selectedText}**` : "**bold text**";
				break;
			case "italic":
				replacement = selectedText ? `*${selectedText}*` : "*italic text*";
				break;
			case "code":
				replacement = selectedText ? `\`${selectedText}\`` : "`code`";
				break;
			case "link":
				replacement = selectedText ? `[${selectedText}](url)` : "[link text](url)";
				break;
			case "image":
				replacement = selectedText ? `![${selectedText}](image-url)` : "![alt text](image-url)";
				break;
			case "list":
				replacement = selectedText ? `- ${selectedText}` : "- list item";
				break;
			case "heading":
				replacement = selectedText ? `# ${selectedText}` : "# Heading";
				break;
			case "quote":
				replacement = selectedText ? `> ${selectedText}` : "> quote";
				break;
			case "codeblock":
				replacement = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : "```\ncode block\n```";
				break;
			case "clear":
				this.clear();
				return;
			case "save":
				this.save();
				return;
			case "print":
				this.printContent();
				return;
			case "export-docx":
				this.exportDocx();
				return;
		}
		if (replacement) this.insertText(replacement, start, end);
	}
	insertText(text, start, end) {
		const textarea = this.editor;
		if (!textarea) return;
		const currentStart = start ?? textarea.selectionStart;
		const currentEnd = end ?? textarea.selectionEnd;
		textarea.setRangeText(text, currentStart, currentEnd, "end");
		textarea.focus();
		textarea.dispatchEvent(new Event("input", { bubbles: true }));
	}
	switchMode(mode) {
		const container = this.editor?.closest(".markdown-editor-container");
		if (!container) return;
		const editorPanel = container.querySelector(".editor-panel");
		const previewPanel = container.querySelector(".preview-panel");
		container.querySelectorAll("[data-mode]").forEach((btn) => btn.classList.remove("active"));
		container.querySelector(`[data-mode="${mode}"]`)?.classList.add("active");
		switch (mode) {
			case "edit":
				editorPanel.style.display = "block";
				previewPanel.style.display = "none";
				this.editor?.focus();
				break;
			case "preview":
				editorPanel.style.display = "none";
				previewPanel.style.display = "block";
				break;
			case "split":
				editorPanel.style.display = "block";
				previewPanel.style.display = "block";
				this.editor?.focus();
				break;
		}
	}
	updatePreview() {
		if (this.preview && this.editor) this.preview.setContent(this.editor.value);
	}
	updateStats() {
		const container = this.editor?.closest(".markdown-editor-container");
		if (!container || !this.editor) return;
		const content = this.editor.value;
		const charCount = content.length;
		const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
		const lineCount = content.split("\n").length;
		const charCountEl = container.querySelector(".char-count");
		const wordCountEl = container.querySelector(".word-count");
		const lineCountEl = container.querySelector(".line-count");
		if (charCountEl) charCountEl.textContent = `${charCount} characters`;
		if (wordCountEl) wordCountEl.textContent = `${wordCount} words`;
		if (lineCountEl) lineCountEl.textContent = `${lineCount} lines`;
	}
	scheduleAutoSave() {
		if (this.autoSaveTimeout) globalThis?.clearTimeout?.(this.autoSaveTimeout);
		this.autoSaveTimeout = globalThis?.setTimeout?.(() => {
			this.save();
		}, this.options.autoSaveDelay);
	}
};
/**
* Create a markdown editor instance
*/
function createMarkdownEditor(options) {
	return new MarkdownEditor(options);
}
//#endregion
export { MarkdownEditor, createMarkdownEditor };
