import { g as loadAsAdopted, y as removeAdopted } from "../fest/dom.js";
import { o as observe } from "../fest/object.js";
import { q as H } from "../com/app.js";
import { n as writeText } from "../com/app2.js";
import { i as HistoryChannelAction } from "./apis.js";
import { i as setItem, n as getItem } from "../com/app6.js";
//#region src/frontend/views/history/scss/history.scss?inline
var history_default = "@layer view.history{:is(html,body):has([data-view=history]){--view-layout:\"flex\";--view-content-max-width:1000px}.view-history{background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:flex;flex-direction:column;padding:1.5rem}.view-history__header{align-items:center;display:flex;justify-content:space-between;margin-block-end:1.5rem}.view-history__header h1{font-size:1.5rem;font-weight:700;margin:0}.view-history__clear-btn{align-items:center;background:transparent;border:none;border-radius:6px;color:#d32f2f;cursor:pointer;display:flex;font-size:.8125rem;font-weight:500;gap:.5rem;padding:.5rem .75rem}.view-history__clear-btn:hover{background-color:rgba(211,47,47,.1)}.view-history__list{flex:1;overflow-y:auto}.view-history__empty{align-items:center;block-size:100%;color:var(--view-fg);display:flex;flex-direction:column;gap:1rem;justify-content:center;opacity:.4}.view-history__empty p{font-size:1rem;margin:0}.view-history__item{background-color:var(--view-item-bg,rgba(0,0,0,.02));border-inline-start:3px solid var(--color-primary,#007acc);border-radius:8px;margin-block-end:.75rem;padding:1rem}.view-history__item.error{border-inline-start-color:#d32f2f}.view-history__item-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:.5rem}.view-history__item-action{font-size:.875rem;font-weight:600}.view-history__item-time{color:var(--view-fg);font-size:.75rem;opacity:.6}.view-history__item-desc{color:var(--view-fg);font-size:.875rem;margin:0;opacity:.8}.view-history__item-error{color:#d32f2f;font-size:.8125rem;margin:.5rem 0 0}.view-history__item-actions{display:flex;gap:.5rem;margin-block-start:.75rem}.view-history__action-btn{align-items:center;background-color:rgba(0,0,0,.05);border:none;border-radius:4px;color:var(--view-fg);cursor:pointer;display:flex;font-size:.75rem;gap:.375rem;padding:.375rem .625rem}.view-history__action-btn:hover{background-color:rgba(0,0,0,.1)}}";
//#endregion
//#region src/frontend/views/history/index.ts
/**
* History View
* 
* Shell-agnostic history component.
* Shows operation history with replay/restore capabilities.
*/
var STORAGE_KEY = "rs-history";
var HistoryView = class {
	id = "history";
	name = "History";
	icon = "clock-counter-clockwise";
	options;
	shellContext;
	element = null;
	entries = observe([]);
	_sheet = null;
	lifecycle = {
		onMount: () => {
			this.loadHistory();
			this._sheet ??= loadAsAdopted(history_default);
		},
		onUnmount: () => {
			removeAdopted(this._sheet);
		},
		onShow: () => {
			this._sheet ??= loadAsAdopted(history_default);
			this.loadHistory();
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this._sheet = loadAsAdopted(history_default);
		this.loadHistory();
		this.element = H`
            <div class="view-history">
                <div class="view-history__header">
                    <h1>History</h1>
                    <button class="view-history__clear-btn" data-action="clear" type="button">
                        <ui-icon icon="trash" icon-style="duotone"></ui-icon>
                        <span>Clear History</span>
                    </button>
                </div>
                <div class="view-history__list" data-history-list>
                    ${this.renderEntries()}
                </div>
            </div>
        `;
		this.setupEventHandlers();
		return this.element;
	}
	getToolbar() {
		return null;
	}
	renderEntries() {
		if (this.entries.length === 0) return H`
                <div class="view-history__empty">
                    <ui-icon icon="clock-counter-clockwise" icon-style="duotone" size="48"></ui-icon>
                    <p>No history yet</p>
                </div>
            `;
		const fragment = document.createDocumentFragment();
		for (const entry of [...this.entries].reverse()) {
			const item = H`
                <div class="view-history__item ${entry.ok ? "" : "error"}" data-entry="${entry.id}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">${entry.action}</span>
                        <span class="view-history__item-time">${this.formatTime(entry.timestamp)}</span>
                    </div>
                    <p class="view-history__item-desc">${entry.description}</p>
                    ${entry.error ? H`<p class="view-history__item-error">${entry.error}</p>` : ""}
                    ${entry.content ? H`
                        <div class="view-history__item-actions">
                            <button class="view-history__action-btn" data-action="copy" data-id="${entry.id}" type="button">
                                <ui-icon icon="copy" icon-style="duotone" size="14"></ui-icon>
                                Copy
                            </button>
                            <button class="view-history__action-btn" data-action="view" data-id="${entry.id}" type="button">
                                <ui-icon icon="eye" icon-style="duotone" size="14"></ui-icon>
                                View
                            </button>
                        </div>
                    ` : ""}
                </div>
            `;
			fragment.appendChild(item);
		}
		return fragment;
	}
	setupEventHandlers() {
		if (!this.element) return;
		this.element.addEventListener("click", async (e) => {
			const button = e.target.closest("[data-action]");
			if (!button) return;
			const action = button.dataset.action;
			const entryId = button.dataset.id;
			if (action === "clear") this.clearHistory();
			else if (action === "copy" && entryId) {
				const entry = this.entries.find((e) => e.id === entryId);
				if (entry?.content) try {
					const result = await writeText(entry.content);
					if (!result.ok) throw new Error(result.error || "Clipboard write failed");
					this.showMessage("Copied to clipboard");
				} catch {
					this.showMessage("Failed to copy");
				}
			} else if (action === "view" && entryId) {
				const entry = this.entries.find((e) => e.id === entryId);
				if (entry?.content) this.shellContext?.navigate("viewer", { content: entry.content });
			}
		});
	}
	loadHistory() {
		const saved = getItem(STORAGE_KEY, []);
		this.entries.length = 0;
		this.entries.push(...saved);
		this.updateList();
	}
	/** Pull latest history entries from storage into the list UI. */
	reloadHistory() {
		this.loadHistory();
	}
	clearHistory() {
		this.entries.length = 0;
		setItem(STORAGE_KEY, []);
		this.updateList();
		this.showMessage("History cleared");
	}
	updateList() {
		const list = this.element?.querySelector("[data-history-list]");
		if (!list) return;
		list.replaceChildren();
		const rendered = this.renderEntries();
		if (typeof rendered !== "string") list.appendChild(rendered);
	}
	formatTime(timestamp) {
		const date = new Date(timestamp);
		const now = /* @__PURE__ */ new Date();
		if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric"
		}) + " " + date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	invokeChannelApi(action, _payload) {
		if (action === HistoryChannelAction.Reload || action === HistoryChannelAction.Refresh) {
			this.reloadHistory();
			return true;
		}
	}
	canHandleMessage() {
		return false;
	}
	async handleMessage() {}
};
function createView(options) {
	return new HistoryView(options);
}
/** Alias for createView */
var createHistoryView = createView;
//#endregion
export { HistoryView, createHistoryView, createView, createView as default };
