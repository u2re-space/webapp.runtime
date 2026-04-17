//#region src/core/storage/index.ts
/**
* Storage Module
*
* Unified storage utilities for persistent state.
* Provides wrappers for localStorage, sessionStorage, and IndexedDB.
*/
/**
* Common storage keys used across the app
*/
var StorageKeys = {
	FRONTEND_CHOICE: "rs-frontend-choice",
	FRONTEND_REMEMBER: "rs-frontend-choice-remember",
	THEME: "rs-theme",
	SETTINGS: "rs-settings",
	BOOT_STYLE: "rs-boot-style",
	BOOT_SHELL: "rs-boot-shell",
	BOOT_SHELL_LAST_ACTIVE: "rs-boot-shell-last-active",
	BOOT_VIEW: "rs-boot-view",
	BOOT_REMEMBER: "rs-boot-remember",
	SHELL_CHOICE: "rs-shell-choice",
	SHELL_REMEMBER: "rs-shell-remember",
	WORKCENTER_STATE: "rs-workcenter-state",
	VIEWER_STATE: "rs-viewer-state",
	EDITOR_STATE: "rs-editor-state",
	EXPLORER_STATE: "view-explorer-state",
	EXPLORER_PATH: "view-explorer-path",
	LAST_MARKDOWN: "rs-last-markdown",
	HISTORY: "rs-history",
	RECENT_FILES: "rs-recent-files",
	AI_CONFIG: "rs-ai-config"
};
/**
* Get item from localStorage with type safety
*/
function getItem(key, defaultValue) {
	try {
		const stored = localStorage.getItem(key);
		if (stored === null) return defaultValue;
		return JSON.parse(stored);
	} catch {
		return defaultValue;
	}
}
/**
* Set item in localStorage
*/
function setItem(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
}
/**
* Get raw string from localStorage
*/
function getString(key, defaultValue = "") {
	try {
		return localStorage.getItem(key) || defaultValue;
	} catch {
		return defaultValue;
	}
}
/**
* Set raw string to localStorage
*/
function setString(key, value) {
	try {
		localStorage.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}
/**
* IndexedDB wrapper for structured object storage
*/
var IDBStorage = class {
	dbName;
	storeName;
	db = null;
	constructor(dbName, storeName) {
		this.dbName = dbName;
		this.storeName = storeName;
	}
	async open() {
		if (this.db) return this.db;
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);
			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};
			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName, { keyPath: "id" });
			};
		});
	}
	async get(id) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.storeName], "readonly").objectStore(this.storeName).get(id);
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result || null);
		});
	}
	async set(id, value) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.storeName], "readwrite").objectStore(this.storeName).put({
				id,
				...value
			});
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
	async delete(id) {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.storeName], "readwrite").objectStore(this.storeName).delete(id);
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
	async getAll() {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.storeName], "readonly").objectStore(this.storeName).getAll();
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result || []);
		});
	}
	async clear() {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const request = db.transaction([this.storeName], "readwrite").objectStore(this.storeName).clear();
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
	close() {
		this.db?.close();
		this.db = null;
	}
};
new IDBStorage("rs-workcenter", "data");
new IDBStorage("rs-history", "entries");
new IDBStorage("rs-settings", "config");
//#endregion
export { setString as a, setItem as i, getItem as n, getString as r, StorageKeys as t };
