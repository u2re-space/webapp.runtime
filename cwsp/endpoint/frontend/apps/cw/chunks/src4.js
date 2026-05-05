import { g as removeAdopted, p as loadAsAdopted } from "../fest/dom.js";
import { c as ref } from "../fest/object.js";
import { P as H } from "../vendor/jsox.js";
import { t as createViewState } from "./types.js";
import { n as EditorChannelAction } from "./channel-actions.js";
//#region ../../modules/views/editor-view/src/editor.scss?inline
var editor_default = "@layer view.editor{:is(html,body):has([data-view=editor]){--view-layout:\"flex\";--view-content-max-width:none}.view-editor{background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:flex;flex-direction:column}.view-editor__toolbar{align-items:center;background-color:var(--view-toolbar-bg,rgba(0,0,0,.02));border-block-end:1px solid var(--view-border,rgba(0,0,0,.08));display:flex;flex-shrink:0;gap:.5rem;justify-content:space-between;padding:.5rem 1rem}.view-editor__toolbar-left,.view-editor__toolbar-right{align-items:center;display:flex;gap:.25rem}.view-editor__btn{align-items:center;background:transparent;border:none;border-radius:6px;color:var(--view-fg);cursor:pointer;display:flex;font-size:.8125rem;font-weight:500;gap:.5rem;padding:.5rem .75rem;transition:background-color .15s ease}.view-editor__btn ui-icon{font-size:1rem;opacity:.7}@media (max-width:640px){.view-editor__btn span{display:none}}.view-editor__btn:hover{background-color:rgba(0,0,0,.06)}.view-editor__content{display:flex;flex:1;overflow:hidden}.view-editor__textarea{background-color:var(--view-editor-bg,#fafafa);border:none;color:var(--view-fg);flex:1;font-family:SF Mono,Fira Code,JetBrains Mono,Consolas,monospace;font-size:.9375rem;line-height:1.6;padding:1.5rem 2rem;resize:none}.view-editor__textarea:focus{outline:none}.view-editor__textarea::placeholder{color:var(--view-fg);opacity:.4}@media print{.view-editor__toolbar{display:none}.view-editor__textarea{padding:0}}}";
//#endregion
//#region ../../modules/projects/subsystem/runtime/clipboard-device.ts
async function writeClipboardText(text) {
	await globalThis.navigator?.clipboard?.writeText?.(text);
}
//#endregion
//#region ../../modules/views/editor-view/src/index.ts
/**
* Editor View
*
* Shell-agnostic markdown editor component.
*/
var STORAGE_KEY = "rs-editor-state";
var DEFAULT_CONTENT = "# New Document\n\nStart writing here...";
var EditorView = class {
	id = "editor";
	name = "Editor";
	icon = "pencil";
	options;
	shellContext;
	element = null;
	contentRef = ref("");
	stateManager = createViewState(STORAGE_KEY);
	textarea = null;
	_sheet = null;
	lifecycle = {
		onMount: () => this.onMount(),
		onUnmount: () => this.saveState(),
		onShow: () => {
			this._sheet ??= loadAsAdopted(editor_default);
		},
		onHide: () => {
			try {
				if (this._sheet) removeAdopted(this._sheet);
			} catch {}
			this._sheet = null;
			this.saveState();
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
		const saved = this.stateManager.load();
		this.contentRef.value = options.initialContent || saved?.content || DEFAULT_CONTENT;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.element = H`
            <div class="view-editor">
                <div class="view-editor__toolbar">
                    <div class="view-editor__toolbar-left">
                        <button class="view-editor__btn" data-action="open" type="button" title="Open file">
                            <ui-icon icon="folder-open" icon-style="duotone"></ui-icon>
                            <span>Open</span>
                        </button>
                        <button class="view-editor__btn" data-action="save" type="button" title="Save file">
                            <ui-icon icon="floppy-disk" icon-style="duotone"></ui-icon>
                            <span>Save</span>
                        </button>
                    </div>
                    <div class="view-editor__toolbar-right">
                        <button class="view-editor__btn" data-action="preview" type="button" title="Preview">
                            <ui-icon icon="eye" icon-style="duotone"></ui-icon>
                            <span>Preview</span>
                        </button>
                        <button class="view-editor__btn" data-action="copy" type="button" title="Copy all">
                            <ui-icon icon="copy" icon-style="duotone"></ui-icon>
                            <span>Copy</span>
                        </button>
                    </div>
                </div>
                <div class="view-editor__content">
                    <textarea
                        class="view-editor__textarea"
                        placeholder="Start writing markdown..."
                        data-editor-input
                    >${this.contentRef.value}</textarea>
                </div>
            </div>
        `;
		this.textarea = this.element.querySelector("[data-editor-input]");
		this.setupEventHandlers();
		return this.element;
	}
	getToolbar() {
		return null;
	}
	setContent(content) {
		this.contentRef.value = content;
		if (this.textarea) this.textarea.value = content;
	}
	getContent() {
		return this.contentRef.value;
	}
	setupEventHandlers() {
		if (!this.element) return;
		this.textarea?.addEventListener("input", () => {
			this.contentRef.value = this.textarea?.value || "";
			this.options.onContentChange?.(this.contentRef.value);
		});
		this.element.addEventListener("click", async (e) => {
			const button = e.target.closest("[data-action]");
			if (!button) return;
			switch (button.dataset.action) {
				case "open":
					this.handleOpen();
					break;
				case "save":
					this.handleSave();
					break;
				case "preview":
					this.handlePreview();
					break;
				case "copy":
					await this.handleCopy();
					break;
			}
		});
	}
	handleOpen() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".md,.markdown,.txt,text/markdown,text/plain";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) try {
				const content = await file.text();
				this.setContent(content);
				this.options.filename = file.name;
				this.showMessage(`Opened ${file.name}`);
			} catch {
				this.showMessage("Failed to open file");
			}
		};
		input.click();
	}
	handleSave() {
		const content = this.contentRef.value;
		const filename = this.options.filename || "document.md";
		const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 250);
		this.options.onSave?.(content);
		this.showMessage(`Saved ${filename}`);
	}
	handlePreview() {
		this.shellContext?.navigate("viewer");
	}
	async handleCopy() {
		try {
			const result = await writeClipboardText(this.contentRef.value);
			if (!result.ok) throw new Error(result.error || "Clipboard write failed");
			this.showMessage("Copied to clipboard");
		} catch {
			this.showMessage("Failed to copy");
		}
	}
	saveState() {
		this.stateManager.save({
			content: this.contentRef.value,
			filename: this.options.filename
		});
	}
	onMount() {
		console.log("[Editor] Mounted");
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	async invokeChannelApi(action, payload) {
		const p = payload != null && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
		const text = typeof p.text === "string" ? p.text : typeof p.content === "string" ? p.content : typeof payload === "string" ? payload : "";
		if (action === EditorChannelAction.SetContent || action === EditorChannelAction.ContentLoad || action === EditorChannelAction.ContentEdit) {
			if (text) this.setContent(text);
			return true;
		}
		await this.handleMessage({
			type: action,
			data: {
				text,
				content: text
			}
		});
		return true;
	}
	canHandleMessage(messageType) {
		return ["content-edit", "content-load"].includes(messageType);
	}
	async handleMessage(message) {
		const msg = message;
		if (msg.data?.text || msg.data?.content) this.setContent(msg.data.text || msg.data.content || "");
	}
};
function createView(options) {
	return new EditorView(options);
}
/** Alias for createView */
var createEditorView = createView;
//#endregion
export { EditorView, createEditorView, createView, createView as default };
