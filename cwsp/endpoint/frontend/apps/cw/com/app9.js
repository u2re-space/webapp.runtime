import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { V as H } from "./app3.js";
//#region ../../modules/projects/lur.e/src/extension/modules/HistoryManager.ts
var HistoryManager_exports = /* @__PURE__ */ __exportAll({
	HistoryManager: () => HistoryManager,
	createHistoryManager: () => createHistoryManager
});
var HistoryManager = class {
	storageKey;
	maxEntries;
	autoSave;
	entries = [];
	constructor(options = {}) {
		this.storageKey = options.storageKey || "rs-basic-history";
		this.maxEntries = options.maxEntries || 100;
		this.autoSave = options.autoSave !== false;
		this.loadHistory();
	}
	/**
	* Add a new history entry
	*/
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			ts: Date.now()
		};
		this.entries.unshift(fullEntry);
		if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
		if (this.autoSave) this.saveHistory();
		return fullEntry;
	}
	/**
	* Get all history entries
	*/
	getAllEntries() {
		return [...this.entries];
	}
	/**
	* Get recent entries (last N)
	*/
	getRecentEntries(limit = 10) {
		return this.entries.slice(0, limit);
	}
	/**
	* Get entry by ID
	*/
	getEntryById(id) {
		return this.entries.find((entry) => entry.id === id);
	}
	/**
	* Remove entry by ID
	*/
	removeEntry(id) {
		const index = this.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.entries.splice(index, 1);
		if (this.autoSave) this.saveHistory();
		return true;
	}
	/**
	* Clear all history
	*/
	clearHistory() {
		this.entries = [];
		if (this.autoSave) this.saveHistory();
	}
	/**
	* Search history entries
	*/
	searchEntries(query) {
		const lowercaseQuery = query.toLowerCase();
		return this.entries.filter((entry) => entry.prompt.toLowerCase().includes(lowercaseQuery) || entry.before.toLowerCase().includes(lowercaseQuery) || entry.after.toLowerCase().includes(lowercaseQuery));
	}
	/**
	* Get successful entries only
	*/
	getSuccessfulEntries() {
		return this.entries.filter((entry) => entry.ok);
	}
	/**
	* Get failed entries only
	*/
	getFailedEntries() {
		return this.entries.filter((entry) => !entry.ok);
	}
	/**
	* Get statistics
	*/
	getStatistics() {
		const total = this.entries.length;
		const successful = this.entries.filter((e) => e.ok).length;
		const failed = total - successful;
		const avgDuration = this.entries.filter((e) => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, this.entries.filter((e) => e.duration).length);
		return {
			total,
			successful,
			failed,
			successRate: total > 0 ? successful / total * 100 : 0,
			averageDuration: avgDuration || 0
		};
	}
	/**
	* Export history as JSON
	*/
	exportHistory() {
		return JSON.stringify(this.entries, null, 2);
	}
	/**
	* Import history from JSON
	*/
	importHistory(jsonData) {
		try {
			const importedEntries = JSON.parse(jsonData);
			if (!Array.isArray(importedEntries)) throw new Error("Invalid history data: not an array");
			for (const entry of importedEntries) if (typeof entry.ts !== "number" || typeof entry.prompt !== "string") throw new Error("Invalid history entry: missing required fields");
			const entriesWithIds = importedEntries.map((entry) => ({
				...entry,
				id: entry.id || this.generateId()
			}));
			const existingIds = new Set(this.entries.map((e) => e.id));
			const newEntries = entriesWithIds.filter((e) => !existingIds.has(e.id));
			this.entries.unshift(...newEntries);
			if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
			if (this.autoSave) this.saveHistory();
			return true;
		} catch (error) {
			console.error("Failed to import history:", error);
			return false;
		}
	}
	/**
	* Create history view component
	*/
	createHistoryView(onEntrySelect) {
		const container = H`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${this.entries.length === 0 ? H`<div class="empty-history">No history yet. Start processing some content!</div>` : this.entries.map((entry) => this.createHistoryItem(entry, onEntrySelect))}
      </div>
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "clear-history") {
				if (confirm("Are you sure you want to clear all history?")) {
					this.clearHistory();
					const newContainer = this.createHistoryView(onEntrySelect);
					container.replaceWith(newContainer);
				}
			} else if (action === "export-history") this.exportHistoryToFile();
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	/**
	* Create compact history display (for recent activity)
	*/
	createRecentHistoryView(limit = 3, onEntrySelect) {
		const recentEntries = this.getRecentEntries(limit);
		const container = H`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${recentEntries.length === 0 ? H`<div class="no-recent">No recent activity</div>` : recentEntries.map((entry) => this.createCompactHistoryItem(entry, onEntrySelect))}
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "view-full-history") console.log("View full history requested");
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	createStatsDisplay() {
		const stats = this.getStatistics();
		return H`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${stats.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${stats.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`;
	}
	createHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const duration = entry.duration ? ` (${(entry.duration / 1e3).toFixed(1)}s)` : "";
		return H`<div class="history-item ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">
          ${entry.ok ? "✓" : "✗"}
        </span>
        <span class="history-time">${time}${duration}</span>
        ${entry.model ? H`<span class="history-model">${entry.model}</span>` : ""}
      </div>

      <div class="history-content">
        <div class="history-prompt">${entry.prompt}</div>
        <div class="history-input">Input: ${entry.before}</div>
        ${entry.error ? H`<div class="history-error">Error: ${entry.error}</div>` : ""}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use Prompt</button>
        ${entry.ok ? H`<button class="btn small" data-action="view-result" data-entry-id="${entry.id}">View Result</button>` : ""}
      </div>
    </div>`;
	}
	createCompactHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const shortPrompt = entry.prompt.length > 40 ? entry.prompt.substring(0, 40) + "..." : entry.prompt;
		return H`<div class="history-item-compact ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">${entry.ok ? "✓" : "✗"}</span>
        <span class="history-prompt">${shortPrompt}</span>
      </div>
      <div class="history-time">${time}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use</button>
    </div>`;
	}
	exportHistoryToFile() {
		const data = this.exportHistory();
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ai-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	generateId() {
		return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) this.entries = JSON.parse(stored).map((entry) => ({
				...entry,
				id: entry.id || this.generateId()
			}));
		} catch (error) {
			console.warn("Failed to load history from storage:", error);
			this.entries = [];
		}
	}
	saveHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
		} catch (error) {
			console.warn("Failed to save history to storage:", error);
		}
	}
};
/**
* Utility function to create a history manager
*/
function createHistoryManager(options) {
	return new HistoryManager(options);
}
//#endregion
export { HistoryManager_exports as t };
