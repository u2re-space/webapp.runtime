import { f as safe, l as stringRef, o as observe, u as makeObjectAssignable } from "../fest/object.js";
import { t as JSOX } from "../vendor/jsox.js";
import { C as makeUIState } from "../com/app.js";
import "../com/app2.js";
import { n as scheduleFrame } from "./Runtime.js";
//#region src/shared/store/StateStorage.ts
/**
* Persistent UI/workspace state for the home speed-dial surface.
*
* This module owns the default shortcut catalog, conversion between persisted
* storage records and reactive UI state, and the metadata registry that keeps
* richer shortcut configuration separate from the compact visible item list.
*/
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
//#endregion
export { persistSpeedDialItems as a, speedDialItems as c, ensureSpeedDialMeta as i, wallpaperState as l, applyGridSettings as n, persistSpeedDialMeta as o, createEmptySpeedDialItem as r, persistWallpaper as s, addSpeedDialItem as t };
