import { H as setIdleInterval, O as addEvent } from "../fest/dom.js";
import { c as observe, d as stringRef, f as makeObjectAssignable, m as safe, p as addToCallChain } from "../fest/object.js";
import { t as JSOX } from "../vendor/jsox.js";
import { n as scheduleFrame } from "./service9.js";
import { r as readText } from "../core/clipboard.js";
//#region shared/fest/lure/extension/core/UIState.ts
var mapEntriesFrom = (source) => {
	if (!source) return [];
	if (source instanceof Map) return Array.from(source.entries());
	if (Array.isArray(source)) return source.map((value, index) => {
		if (Array.isArray(value) && value.length === 2) return value;
		return [index, value];
	});
	if (source instanceof Set) return Array.from(source.values()).map((value, index) => [index, value]);
	if (typeof source === "object") return Object.entries(source);
	return [];
};
var ownProp = Object.prototype.hasOwnProperty;
var isPlainObject = (value) => {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) return false;
	return !(value instanceof Map) && !(value instanceof Set);
};
var identityOf = (value, fallback) => {
	if (value && typeof value === "object") {
		if ("id" in value && value.id != null) return value.id;
		if ("key" in value && value.key != null) return value.key;
	}
	return fallback;
};
var resolveEntryKey = (entryKey, value, fallback) => {
	if (entryKey != null) return entryKey;
	const identity = identityOf(value);
	if (identity != null) return identity;
	return fallback;
};
var mergePlainObject = (target, source) => {
	for (const key of Object.keys(source)) {
		const nextValue = source[key];
		const currentValue = target[key];
		if (isPlainObject(currentValue) && isPlainObject(nextValue)) {
			mergePlainObject(currentValue, nextValue);
			continue;
		}
		if (currentValue !== nextValue) target[key] = nextValue;
	}
	return target;
};
var mergeValue = (target, source) => {
	if (target === source) return target;
	const sourceIsObject = source && typeof source === "object";
	if (target instanceof Map && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (target instanceof Set && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (Array.isArray(target) && sourceIsObject) {
		reloadInto(target, source);
		return target;
	}
	if (isPlainObject(target) && isPlainObject(source)) {
		mergePlainObject(target, source);
		return target;
	}
	return source;
};
var reloadInto = (items, map) => {
	if (!items || !map) return items;
	const entries = mapEntriesFrom(map);
	if (!entries.length) return items;
	if (items instanceof Set) {
		const existingByKey = /* @__PURE__ */ new Map();
		for (const value of items.values()) {
			const key = identityOf(value);
			if (key != null) existingByKey.set(key, value);
		}
		const usedKeys = /* @__PURE__ */ new Set();
		for (const [entryKey, incoming] of entries) {
			const key = resolveEntryKey(entryKey, incoming);
			if (key == null) {
				if (!items.has(incoming)) items.add(incoming);
				continue;
			}
			const hasCurrent = existingByKey.has(key);
			const current = hasCurrent ? existingByKey.get(key) : void 0;
			if (hasCurrent) {
				const merged = mergeValue(current, incoming);
				if (merged !== current) {
					items.delete(current);
					items.add(merged);
					existingByKey.set(key, merged);
				}
			} else {
				items.add(incoming);
				existingByKey.set(key, incoming);
			}
			usedKeys.add(key);
		}
		if (usedKeys.size) for (const value of Array.from(items.values())) {
			const key = identityOf(value);
			if (key != null && !usedKeys.has(key)) items.delete(value);
		}
		return items;
	}
	if (items instanceof Map) {
		const nextMap = new Map(entries);
		for (const key of Array.from(items.keys())) if (!nextMap.has(key)) items.delete(key);
		for (const [key, incoming] of nextMap.entries()) if (items.has(key)) {
			const current = items.get(key);
			const merged = mergeValue(current, incoming);
			if (merged !== current) items.set(key, merged);
		} else items.set(key, incoming);
		return items;
	}
	if (Array.isArray(items)) {
		const availableIndexes = /* @__PURE__ */ new Set();
		const existingByKey = /* @__PURE__ */ new Map();
		const existingByObject = /* @__PURE__ */ new WeakMap();
		items.forEach((value, index) => {
			availableIndexes.add(index);
			const key = identityOf(value, index);
			if (key != null && !existingByKey.has(key)) existingByKey.set(key, index);
			if (value && typeof value === "object") existingByObject.set(value, index);
		});
		const takeIndex = (index) => {
			if (index == null) return void 0;
			if (!availableIndexes.has(index)) return void 0;
			availableIndexes.delete(index);
			return index;
		};
		const takeNextAvailable = () => {
			const iterator = availableIndexes.values().next();
			if (iterator.done) return void 0;
			const index = iterator.value;
			availableIndexes.delete(index);
			return index;
		};
		let writeIndex = 0;
		let fallbackIndex = 0;
		for (const [entryKey, incoming] of entries) {
			const key = resolveEntryKey(entryKey, incoming, fallbackIndex++);
			let claimedIndex = takeIndex(key != null ? existingByKey.get(key) : void 0);
			if (claimedIndex == null && incoming && typeof incoming === "object") claimedIndex = takeIndex(existingByObject.get(incoming));
			if (claimedIndex == null) claimedIndex = takeNextAvailable();
			const current = claimedIndex != null ? items[claimedIndex] : void 0;
			const merged = current !== void 0 ? mergeValue(current, incoming) : incoming;
			if (writeIndex < items.length) {
				if (items[writeIndex] !== merged) items[writeIndex] = merged;
			} else items.push(merged);
			writeIndex++;
		}
		while (items.length > writeIndex) items.pop();
		return items;
	}
	if (typeof items === "object") {
		const nextKeys = new Set(entries.map(([key]) => String(key)));
		for (const prop of Object.keys(items)) if (!nextKeys.has(prop)) delete items[prop];
		for (const [entryKey, incoming] of entries) {
			const prop = String(entryKey);
			if (ownProp.call(items, prop)) {
				const current = items[prop];
				const merged = mergeValue(current, incoming);
				if (merged !== current) items[prop] = merged;
			} else items[prop] = incoming;
		}
		return items;
	}
	return items;
};
var mergeByKey = (items, key = "id") => {
	if (items && (items instanceof Set || Array.isArray(items))) {
		const entries = Array.from(items?.values?.() || []).map((I) => [I?.[key], I]).filter((I) => I?.[0] != null);
		return reloadInto(items, new Map(entries));
	}
	return items;
};
var hasChromeStorage = () => typeof chrome !== "undefined" && chrome?.storage?.local;
var makeUIState = (storageKey, initialCb, unpackCb, packCb = (items) => safe(items), key = "id", saveInterval = 6e3) => {
	let state = null;
	state = mergeByKey(initialCb?.() || {}, key);
	if (hasChromeStorage()) chrome.storage.local.get([storageKey], (result) => {
		if (result[storageKey]) {
			const unpacked = unpackCb(JSOX.parse(result?.[storageKey] || "{}"));
			reloadInto(state, unpacked);
		}
	});
	else if (typeof localStorage !== "undefined") if (localStorage.getItem(storageKey)) {
		state = unpackCb(JSOX.parse(localStorage.getItem(storageKey) || "{}"));
		mergeByKey(state, key);
	} else localStorage.setItem(storageKey, JSOX.stringify(packCb(state)));
	const saveInStorage = (ev) => {
		const packed = JSOX.stringify(packCb(mergeByKey(state, key)));
		if (hasChromeStorage()) chrome.storage.local.set({ [storageKey]: packed });
		else if (typeof localStorage !== "undefined") localStorage.setItem(storageKey, packed);
	};
	setIdleInterval(saveInStorage, saveInterval);
	if (typeof window !== "undefined" && typeof document !== "undefined") {
		const listening = [
			addEvent(document, "visibilitychange", (ev) => {
				if (document.visibilityState === "hidden") saveInStorage(ev);
			}),
			addEvent(window, "beforeunload", (ev) => saveInStorage(ev)),
			addEvent(window, "pagehide", (ev) => saveInStorage(ev)),
			addEvent(window, "storage", (ev) => {
				if (ev.storageArea == localStorage && ev.key == storageKey) reloadInto(state, unpackCb(JSOX.parse(ev?.newValue || JSOX.stringify(packCb(mergeByKey(state, key))))));
			})
		];
		addToCallChain(state, Symbol.dispose, () => listening.forEach((ub) => ub?.()));
	}
	if (hasChromeStorage()) {
		const listener = (changes, area) => {
			if (area === "local" && changes[storageKey]) {
				const newValue = changes[storageKey].newValue;
				if (newValue) reloadInto(state, unpackCb(JSOX.parse(newValue)));
			}
		};
		chrome.storage.onChanged.addListener(listener);
	}
	if (state && typeof state === "object") try {
		Object.defineProperty(state, "$save", {
			value: saveInStorage,
			configurable: true,
			enumerable: false,
			writable: true
		});
	} catch (e) {
		state.$save = saveInStorage;
	}
	return state;
};
//#endregion
//#region src/core/storage/StateStorage.ts
/**
* Persistent UI/workspace state for the home speed-dial surface.
*
* This module owns the default shortcut catalog, conversion between persisted
* storage records and reactive UI state, and the metadata registry that keeps
* richer shortcut configuration separate from the compact visible item list.
*/
/** Built-in navigation shortcuts exposed by the home/workspace launcher. */
var NAVIGATION_SHORTCUTS = [
	{
		view: "home",
		label: "Home",
		icon: "house-line"
	},
	{
		view: "task",
		label: "Plan",
		icon: "calendar-dots"
	},
	{
		view: "event",
		label: "Events",
		icon: "calendar-star"
	},
	{
		view: "bonus",
		label: "Bonuses",
		icon: "ticket"
	},
	{
		view: "person",
		label: "Contacts",
		icon: "address-book"
	},
	{
		view: "explorer",
		label: "Explorer",
		icon: "books"
	},
	{
		view: "settings",
		label: "Settings",
		icon: "gear-six"
	}
];
var STORAGE_KEY = "cw::workspace::speed-dial";
var META_STORAGE_KEY = `${STORAGE_KEY}::meta`;
var fallbackClone = (value) => {
	if (typeof structuredClone === "function") return structuredClone(safe(value));
	return JSOX.parse(JSOX.stringify(value));
};
var generateItemId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `sd-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e3)}`;
};
var EXTERNAL_SHORTCUTS = [
	{
		id: "shortcut-docs",
		cell: observe([0, 1]),
		icon: "book-open-text",
		label: "Docs",
		action: "open-link",
		meta: {
			href: "https://github.com/fest-live",
			description: "Project documentation"
		}
	},
	{
		id: "shortcut-roadmap",
		cell: observe([1, 1]),
		icon: "signpost",
		label: "Roadmap",
		action: "open-link",
		meta: {
			href: "https://github.com/u2re-space/unite-2.man",
			description: "Manifest notes"
		}
	},
	{
		id: "shortcut-fest-live",
		cell: observe([2, 1]),
		icon: "github-logo",
		label: "Fest Live",
		action: "open-link",
		meta: {
			href: "https://github.com/fest-live",
			description: "Fest Live Organization"
		}
	},
	{
		id: "shortcut-l2ne-dev",
		cell: observe([3, 1]),
		icon: "user",
		label: "L2NE Dev",
		action: "open-link",
		meta: {
			href: "https://github.com/L2NE-dev",
			description: "L2NE Developer Profile"
		}
	},
	{
		id: "shortcut-u2re-space",
		cell: observe([0, 2]),
		icon: "planet",
		label: "U2RE Space",
		action: "open-link",
		meta: {
			href: "https://github.com/u2re-space/",
			description: "U2RE Space Organization"
		}
	},
	{
		id: "shortcut-telegram",
		cell: observe([1, 2]),
		icon: "telegram-logo",
		label: "Telegram",
		action: "open-link",
		meta: {
			href: "https://t.me/u2re_space",
			description: "U2RE Space Telegram"
		}
	}
];
var DEFAULT_SPEED_DIAL_DATA = [
	{
		id: "shortcut-explorer",
		cell: observe([2, 0]),
		icon: "books",
		label: "Explorer",
		action: "open-view",
		meta: { view: "explorer" }
	},
	{
		id: "shortcut-settings",
		cell: observe([3, 0]),
		icon: "gear-six",
		label: "Settings",
		action: "open-view",
		meta: { view: "settings" }
	},
	...EXTERNAL_SHORTCUTS
];
var splitDefaultEntries = (entries) => {
	const records = [];
	const metaEntries = [];
	entries.forEach((entry) => {
		const { meta, ...record } = entry;
		records.push(record);
		const normalizedMeta = {
			action: entry.action,
			...meta || {}
		};
		metaEntries.push([entry.id, normalizedMeta]);
	});
	return {
		records,
		metaEntries
	};
};
var { records: DEFAULT_SPEED_DIAL_RECORDS, metaEntries: DEFAULT_META_ENTRIES } = splitDefaultEntries(DEFAULT_SPEED_DIAL_DATA);
var legacyMetaBuffer = [];
var ensureCell = (cell) => {
	if (cell && Array.isArray(cell) && cell.length >= 2) return observe([Number(cell[0]) || 0, Number(cell[1]) || 0]);
	return observe([0, 0]);
};
var createMetaState = (meta = {}) => {
	return makeObjectAssignable(observe({
		action: meta.action || "open-view",
		view: meta.view || "",
		href: meta.href || "",
		description: meta.description || "",
		entityType: meta.entityType || "",
		tags: Array.isArray(meta.tags) ? [...meta.tags] : [],
		...meta
	}));
};
var registryFromEntries = (entries) => {
	const registry = /* @__PURE__ */ new Map();
	for (const [id, meta] of entries) registry.set(id, createMetaState(meta));
	return registry;
};
var normalizeMetaEntries = (raw) => {
	if (!raw) return [];
	if (raw instanceof Map) return Array.from(raw.entries());
	if (Array.isArray(raw)) return raw.map((entry) => {
		if (entry && typeof entry === "object" && "id" in entry) return [entry.id, entry.meta || entry];
		return null;
	}).filter(Boolean);
	if (typeof raw === "object") return Object.entries(raw);
	return [];
};
var packMetaRegistry = (registry) => {
	const payload = {};
	registry?.forEach((meta, id) => {
		payload[id] = fallbackClone(meta ?? {});
	});
	return payload;
};
var createInitialMetaRegistry = () => registryFromEntries(DEFAULT_META_ENTRIES);
var unpackMetaRegistry = (raw) => {
	const entries = normalizeMetaEntries(raw);
	return registryFromEntries(entries.length ? entries : DEFAULT_META_ENTRIES);
};
var unwrapRef = (value, fallback) => {
	if (value && typeof value === "object" && "value" in value) return value.value ?? fallback;
	return value ?? fallback;
};
var serializeItemState = (item) => {
	return {
		id: item.id,
		cell: observe([item.cell?.[0] ?? 0, item.cell?.[1] ?? 0]),
		icon: unwrapRef(item.icon, "sparkle"),
		label: unwrapRef(item.label, "Shortcut"),
		action: item.action
	};
};
var createStatefulItem = (config) => {
	return observe({
		id: config.id || generateItemId(),
		cell: observe(ensureCell(config.cell)),
		icon: stringRef(config.icon || "sparkle"),
		label: stringRef(config.label || "Shortcut"),
		action: config.action || "open-view"
	});
};
var createInitialState = () => observe(DEFAULT_SPEED_DIAL_RECORDS.map(createStatefulItem));
var unpackState = (raw) => {
	return observe((Array.isArray(raw) && raw.length ? raw : DEFAULT_SPEED_DIAL_DATA).map((entry) => {
		const { meta, ...record } = entry;
		if (meta) legacyMetaBuffer.push([entry.id, {
			action: entry.action,
			...meta
		}]);
		else legacyMetaBuffer.push([entry.id, { action: entry.action }]);
		return record;
	}).map(createStatefulItem));
};
var packState = (collection) => collection.map(serializeItemState);
var speedDialMeta = makeUIState(META_STORAGE_KEY, createInitialMetaRegistry, unpackMetaRegistry, packMetaRegistry);
var speedDialItems = makeUIState(STORAGE_KEY, createInitialState, unpackState, packState);
var persistSpeedDialItems = () => speedDialItems?.$save?.();
var persistSpeedDialMeta = () => speedDialMeta?.$save?.();
var getSpeedDialMeta = (id) => {
	if (!id) return null;
	return speedDialMeta?.get?.(id) ?? null;
};
var ensureSpeedDialMeta = (id, defaults = {}) => {
	let meta = speedDialMeta?.get?.(id);
	if (!meta) {
		meta = createMetaState(defaults);
		speedDialMeta?.set?.(id, meta);
		persistSpeedDialMeta();
	}
	if (defaults?.action && meta.action !== defaults.action) meta.action = defaults.action;
	return meta;
};
var removeSpeedDialMeta = (id) => {
	const removed = speedDialMeta?.delete?.(id);
	if (removed) persistSpeedDialMeta();
	return removed;
};
var syncMetaActionFromItem = (item) => {
	if (!item) return false;
	const desiredAction = item.action || "open-view";
	const meta = ensureSpeedDialMeta(item.id, { action: desiredAction });
	if (meta.action !== desiredAction) {
		meta.action = desiredAction;
		return true;
	}
	return false;
};
var syncMetaActionsForAllItems = () => {
	let changed = false;
	speedDialItems?.forEach?.((item) => {
		if (syncMetaActionFromItem(item)) changed = true;
	});
	if (changed) persistSpeedDialMeta();
};
var flushLegacyMetaBuffer = () => {
	if (!legacyMetaBuffer.length) return;
	legacyMetaBuffer.forEach(([id, meta]) => {
		const target = ensureSpeedDialMeta(id, meta);
		Object.assign(target, meta);
	});
	legacyMetaBuffer.length = 0;
	persistSpeedDialMeta();
};
flushLegacyMetaBuffer();
syncMetaActionsForAllItems();
var ensureExternalShortcuts = () => {
	let changed = false;
	EXTERNAL_SHORTCUTS.forEach((shortcut) => {
		if (!speedDialItems?.find?.((item) => item?.id === shortcut.id)) {
			const item = createStatefulItem(shortcut);
			if (shortcut.label && item.label && typeof item.label === "object" && "value" in item.label) item.label.value = shortcut.label;
			if (shortcut.icon && item.icon && typeof item.icon === "object" && "value" in item.icon) item.icon.value = shortcut.icon;
			speedDialItems.push(observe(item));
			ensureSpeedDialMeta(item.id, shortcut.meta);
			changed = true;
		} else {
			const currentMeta = getSpeedDialMeta(shortcut.id);
			if (shortcut.meta && currentMeta) {
				if (shortcut.meta.href !== currentMeta.href) {
					currentMeta.href = shortcut.meta.href;
					changed = true;
				}
				if (shortcut.meta.description !== currentMeta.description) {
					currentMeta.description = shortcut.meta.description;
					changed = true;
				}
			} else if (shortcut.meta && !currentMeta) {
				ensureSpeedDialMeta(shortcut.id, shortcut.meta);
				changed = true;
			}
		}
	});
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
ensureExternalShortcuts();
var findSpeedDialItem = (id) => {
	if (!id) return null;
	return speedDialItems?.find?.((item) => item?.id === id) || null;
};
var createEmptySpeedDialItem = (cell = observe([0, 0])) => {
	const item = createStatefulItem({
		id: generateItemId(),
		cell,
		icon: "sparkle",
		label: "New shortcut",
		action: "open-link"
	});
	ensureSpeedDialMeta(item.id, {
		action: item.action,
		href: "",
		description: ""
	});
	return item;
};
var addSpeedDialItem = (item) => {
	speedDialItems?.push?.(observe(item));
	const metaChanged = syncMetaActionFromItem(item);
	persistSpeedDialItems();
	if (metaChanged) persistSpeedDialMeta();
	return item;
};
var upsertSpeedDialItem = (item) => {
	const existingIndex = speedDialItems?.findIndex?.((entry) => entry?.id === item?.id) ?? -1;
	if (existingIndex === -1) speedDialItems?.push?.(observe(item));
	else if (speedDialItems[existingIndex] !== item) speedDialItems.splice(existingIndex, 1, observe(item));
	const metaChanged = syncMetaActionFromItem(item);
	persistSpeedDialItems();
	if (metaChanged) persistSpeedDialMeta();
	return item;
};
var removeSpeedDialItem = (id) => {
	const index = speedDialItems?.findIndex?.((entry) => entry?.id === id) ?? -1;
	if (index === -1) return false;
	speedDialItems.splice(index, 1);
	removeSpeedDialMeta(id);
	persistSpeedDialItems();
	return true;
};
var snapshotSpeedDialItem = (item) => {
	const meta = getSpeedDialMeta(item.id);
	const resolvedAction = meta?.action || item.action;
	const metaSnapshot = fallbackClone(meta ?? {});
	if (!metaSnapshot.action) metaSnapshot.action = resolvedAction;
	return {
		state: {
			id: item.id,
			cell: observe([item.cell?.[0] ?? 0, item.cell?.[1] ?? 0]),
			icon: unwrapRef(item.icon, ""),
			label: unwrapRef(item.label, "")
		},
		desc: {
			action: resolvedAction,
			meta: metaSnapshot
		}
	};
};
var wallpaperState = makeUIState("cw::workspace::wallpaper", () => observe({
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (raw) => observe(raw || {
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (state) => ({ ...state }));
var persistWallpaper = () => wallpaperState?.$save?.();
var gridLayoutState = makeUIState("cw::workspace::grid-layout", () => observe({
	columns: 4,
	rows: 8,
	shape: "square"
}), (raw) => observe(raw || {
	columns: 4,
	rows: 8,
	shape: "square"
}), (state) => ({ ...state }));
var persistGridLayout = () => gridLayoutState?.$save?.();
var applyGridSettings = (settings) => {
	const gridConfig = settings?.grid || gridLayoutState;
	const columns = gridConfig?.columns ?? 4;
	const rows = gridConfig?.rows ?? 8;
	const shape = gridConfig?.shape ?? "square";
	if (gridLayoutState) {
		gridLayoutState.columns = columns;
		gridLayoutState.rows = rows;
		gridLayoutState.shape = shape;
		persistGridLayout();
	}
	if (typeof document === "undefined") return;
	document.querySelectorAll(".speed-dial-grid").forEach((grid) => {
		const el = grid;
		el.dataset.gridColumns = String(columns);
		el.dataset.gridRows = String(rows);
		el.dataset.gridShape = shape;
	});
	document.documentElement.dataset.gridColumns = String(columns);
	document.documentElement.dataset.gridRows = String(rows);
	document.documentElement.dataset.gridShape = shape;
};
if (typeof globalThis !== "undefined" && typeof document !== "undefined") scheduleFrame(() => applyGridSettings());
var parseSpeedDialItemFromJSON = (jsonText, suggestedCell) => {
	try {
		const parsed = JSOX.parse(jsonText);
		if (!parsed || typeof parsed !== "object") return null;
		const state = parsed.state || parsed;
		const desc = parsed.desc || parsed.meta || {};
		if (!state || typeof state !== "object") return null;
		const cellValue = state.cell && Array.isArray(state.cell) && state.cell.length >= 2 ? [Number(state.cell[0]) || 0, Number(state.cell[1]) || 0] : suggestedCell || [0, 0];
		const item = createStatefulItem({
			id: state.id || generateItemId(),
			cell: cellValue,
			icon: state.icon || desc.icon || "sparkle",
			label: state.label || desc.label || "Shortcut",
			action: desc.action || state.action || "open-view"
		});
		const meta = {
			action: desc.action || state.action || "open-view",
			...desc.meta || desc || {},
			...state.meta || {}
		};
		if (meta.href) meta.action = meta.action || "open-link";
		else if (meta.view) meta.action = meta.action || "open-view";
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse JSON for speed dial item:", e);
		return null;
	}
};
var parseSpeedDialItemFromURL = (urlText, suggestedCell) => {
	try {
		const trimmed = urlText.trim();
		if (!trimmed) return null;
		let url;
		try {
			url = new URL(trimmed);
		} catch {
			try {
				url = new URL(trimmed, globalThis?.location?.href);
			} catch {
				return null;
			}
		}
		const domain = (url.hostname || "").replace(/^www\./, "");
		const pathname = url.pathname || "";
		const label = domain || url.host || "Link";
		const item = createStatefulItem({
			id: generateItemId(),
			cell: suggestedCell || [0, 0],
			icon: "link",
			label,
			action: "open-link"
		});
		const meta = {
			action: "open-link",
			href: url.href,
			description: `${label}${pathname ? ` - ${pathname}` : ""}`
		};
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse URL for speed dial item:", e);
		return null;
	}
};
var createSpeedDialItemFromClipboard = async (suggestedCell) => {
	try {
		const clipboardResult = await readText();
		if (!clipboardResult.ok || !clipboardResult.data) {
			console.warn("Failed to read clipboard text:", clipboardResult.error);
			return null;
		}
		const clipboardText = String(clipboardResult.data);
		if (!clipboardText.trim()) return null;
		const trimmed = clipboardText.trim();
		if ((/^https?:\/\/[^\s]+$/i.test(trimmed) || /^[^\s]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) && URL.canParse(trimmed, globalThis?.location?.origin)) return parseSpeedDialItemFromURL(trimmed, suggestedCell);
		if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) {
			const parsed = parseSpeedDialItemFromJSON(trimmed, suggestedCell);
			if (parsed) return parsed;
		}
		return null;
	} catch (e) {
		console.warn("Failed to create speed dial item from clipboard:", e);
		return null;
	}
};
//#endregion
export { speedDialItems as _, createSpeedDialItemFromClipboard as a, wallpaperState as b, getSpeedDialMeta as c, parseSpeedDialItemFromURL as d, persistSpeedDialItems as f, snapshotSpeedDialItem as g, removeSpeedDialItem as h, createEmptySpeedDialItem as i, gridLayoutState as l, persistWallpaper as m, addSpeedDialItem as n, ensureSpeedDialMeta as o, persistSpeedDialMeta as p, applyGridSettings as r, findSpeedDialItem as s, NAVIGATION_SHORTCUTS as t, parseSpeedDialItemFromJSON as u, speedDialMeta as v, upsertSpeedDialItem as y };
