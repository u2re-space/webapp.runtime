import { D as RAFBehavior, E as MOCElement, I as isInFocus, b as resolveGridCellFromClientPoint, h as loadAsAdopted, v as removeAdopted, y as setStyleProperty } from "../fest/dom.js";
import { c as observe, f as makeObjectAssignable, l as propRef, r as affected, s as numberRef, x as redirectCell } from "../fest/object.js";
import { A as LongPressHandler, H as E, M as bindDraggable, N as makeShiftTrigger, R as orientRef, U as M, V as H, b as handleIncomingEntries, j as clampCell, m as pointerAnchorRef, z as registerModal } from "../com/app3.js";
import { n as writeFileSmart } from "../com/service8.js";
import { r as isEnabledView } from "../chunks/views.js";
import { _ as speedDialItems, a as createSpeedDialItemFromClipboard, b as wallpaperState, c as getSpeedDialMeta, d as parseSpeedDialItemFromURL, f as persistSpeedDialItems, h as removeSpeedDialItem, i as createEmptySpeedDialItem, l as gridLayoutState, m as persistWallpaper, n as addSpeedDialItem, o as ensureSpeedDialMeta, p as persistSpeedDialMeta, s as findSpeedDialItem, t as NAVIGATION_SHORTCUTS, u as parseSpeedDialItemFromJSON, v as speedDialMeta, y as upsertSpeedDialItem } from "../com/app4.js";
import { i as showSuccess, r as showError } from "../com/app5.js";
import { n as openUnifiedContextMenu } from "../com/app6.js";
import { n as iconsPerAction, r as labelsPerAction, t as actionRegistry } from "../com/service15.js";
//#region src/frontend/views/home/ts/Interact.ts
/**
* Grid/tile interaction helpers for the home/orient workspace.
*
* This module centralizes draggable tile behavior, CSS custom-property based
* animation state, and cell reflection logic so the home view can keep its
* layout deterministic across HMR, resize, and drag/drop interactions.
*/
var registeredCSSProperties = /* @__PURE__ */ new Set();
[
	{
		name: "--drag-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--drag-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-drag-x",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-drag-y",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--resize-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--shift-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--shift-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-transition-r",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-transition-c",
		syntax: "<length-percentage>",
		inherits: false,
		initialValue: "0px"
	},
	{
		name: "--cs-p-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cs-p-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--os-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-r",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--rv-grid-c",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-x",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<number>",
		inherits: false,
		initialValue: "0"
	}
].forEach((prop) => {
	if (typeof CSS !== "undefined" && !registeredCSSProperties.has(prop.name)) try {
		CSS.registerProperty?.(prop);
		registeredCSSProperties.add(prop.name);
	} catch {}
});
/** Apply redirected grid coordinates back onto the element's style-driven layout state. */
var reflectCell = async (newItem, pArgs, _withAnimate = false) => {
	const layout = [(pArgs?.layout)?.columns || pArgs?.layout?.[0] || 4, (pArgs?.layout)?.rows || pArgs?.layout?.[1] || 8];
	const { item, list, items } = pArgs;
	await new Promise((r) => queueMicrotask(() => r(true)));
	return affected?.(item, (_state, property) => {
		const gridSystem = newItem?.parentElement;
		layout[0] = parseInt(gridSystem?.getAttribute?.("data-grid-columns") || "4") || layout[0];
		layout[1] = parseInt(gridSystem?.getAttribute?.("data-grid-rows") || "8") || layout[1];
		const args = {
			item,
			list,
			items,
			layout,
			size: [gridSystem?.clientWidth, gridSystem?.clientHeight]
		};
		if (item && !item?.cell) item.cell = makeObjectAssignable(observe([0, 0]));
		if (property === "cell") {
			const nc = redirectCell(item?.cell || [0, 0], args);
			if (nc[0] !== item?.cell?.[0] && item?.cell) item.cell[0] = nc?.[0];
			if (nc[1] !== item?.cell?.[1] && item?.cell) item.cell[1] = nc?.[1];
			setStyleProperty(newItem, "--p-cell-x", nc?.[0]);
			setStyleProperty(newItem, "--p-cell-y", nc?.[1]);
			setStyleProperty(newItem, "--cell-x", nc?.[0]);
			setStyleProperty(newItem, "--cell-y", nc?.[1]);
		}
	});
};
var makeDragEvents = async (newItem, { layout, dragging, currentCell, syncDragStyles }, { item, items, list }) => {
	let settleTimer = null;
	const setState = (state, coord) => {
		newItem.dataset.interactionState = state;
		newItem.dataset.gridCoordinateState = coord;
	};
	const clearSettleTimer = () => {
		if (settleTimer) {
			clearTimeout(settleTimer);
			settleTimer = null;
		}
	};
	setState("onHover", "source");
	const refreshLayout = () => {
		const grid = newItem?.parentElement;
		if (!grid) return layout;
		layout[0] = parseInt(grid.getAttribute?.("data-grid-columns") || "4") || layout[0];
		layout[1] = parseInt(grid.getAttribute?.("data-grid-rows") || "8") || layout[1];
		return layout;
	};
	const computeDropCell = () => {
		const grid = newItem?.parentElement;
		if (!grid) return null;
		const snap = [...refreshLayout()];
		const args = {
			layout: {
				columns: snap[0],
				rows: snap[1]
			},
			item,
			list,
			items
		};
		const gridRect = grid.getBoundingClientRect();
		const itemRect = newItem.getBoundingClientRect();
		const cx = (itemRect.left + itemRect.right) / 2;
		const cy = (itemRect.top + itemRect.bottom) / 2;
		if (cx < gridRect.left || cx > gridRect.right || cy < gridRect.top || cy > gridRect.bottom) return null;
		return resolveGridCellFromClientPoint(grid, [cx, cy], args, "floor");
	};
	const setCellAxis = (cell, axis) => {
		if (currentCell?.[axis]?.value !== cell[axis]) try {
			currentCell[axis].value = cell[axis];
		} catch {}
	};
	const commitCell = (cell) => {
		const clamped = clampCell(redirectCell(cell, {
			item,
			items,
			list,
			layout,
			size: [newItem?.clientWidth || 0, newItem?.clientHeight || 0]
		}), layout);
		const final = [clamped.x.value, clamped.y.value];
		setCellAxis(final, 0);
		setCellAxis(final, 1);
	};
	const resetDragRefs = () => {
		try {
			dragging[0].value = 0;
		} catch {}
		try {
			dragging[1].value = 0;
		} catch {}
	};
	const onGrab = (dragRefs) => {
		clearSettleTimer();
		const stableCell = [currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0, currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0];
		setStyleProperty(newItem, "--p-cell-x", stableCell[0]);
		setStyleProperty(newItem, "--p-cell-y", stableCell[1]);
		setStyleProperty(newItem, "--cell-x", stableCell[0]);
		setStyleProperty(newItem, "--cell-y", stableCell[1]);
		newItem.setAttribute("data-dragging", "");
		if (dragRefs && Array.isArray(dragRefs)) try {
			dragRefs[0].value = 0;
			dragRefs[1].value = 0;
		} catch {}
		setStyleProperty(newItem, "--drag-settle-ms", "0ms");
		syncDragStyles?.(true);
		setState("onGrab", "source");
		return [0, 0];
	};
	const onDrop = (_dragRefs) => {
		clearSettleTimer();
		const cell = computeDropCell();
		requestAnimationFrame(async () => {
			setStyleProperty(newItem, "--p-cell-x", currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
			setStyleProperty(newItem, "--p-cell-y", currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
			if (cell) {
				setStyleProperty(newItem, "--cell-x", cell[0]);
				setStyleProperty(newItem, "--cell-y", cell[1]);
			}
			const grid = newItem.parentElement;
			if (grid) {
				const cs = getComputedStyle(grid);
				const pl = parseFloat(cs.paddingLeft) || 0;
				const pr = parseFloat(cs.paddingRight) || 0;
				const pt = parseFloat(cs.paddingTop) || 0;
				const pb = parseFloat(cs.paddingBottom) || 0;
				const contentW = Math.max(1, grid.clientWidth - pl - pr);
				const contentH = Math.max(1, grid.clientHeight - pt - pb);
				const csLayoutC = parseFloat(cs.getPropertyValue("--cs-layout-c")) || 4;
				const csLayoutR = parseFloat(cs.getPropertyValue("--cs-layout-r")) || 8;
				setStyleProperty(newItem, "--cs-sw-unit-x", `${contentW / csLayoutC}px`);
				setStyleProperty(newItem, "--cs-sw-unit-y", `${contentH / csLayoutR}px`);
			}
			syncDragStyles?.(true);
			setStyleProperty(newItem, "--drag-settle-ms", "240ms");
			setStyleProperty(newItem, "will-change", "transform");
			setState("onRelax", "destination");
			newItem.style.removeProperty("--cs-transition-c");
			newItem.style.removeProperty("--cs-transition-r");
			const dragX = parseFloat(newItem.style.getPropertyValue("--drag-x") || "0") || 0;
			const dragY = parseFloat(newItem.style.getPropertyValue("--drag-y") || "0") || 0;
			const shouldAnimate = !matchMedia?.("(prefers-reduced-motion: reduce)")?.matches && (Math.abs(dragX) > .5 || Math.abs(dragY) > .5 || cell != null);
			let animation = null;
			if (shouldAnimate) {
				const computed = getComputedStyle(newItem);
				const csPGridC = parseFloat(computed.getPropertyValue("--cs-p-grid-c")) || 0;
				const csPGridR = parseFloat(computed.getPropertyValue("--cs-p-grid-r")) || 0;
				const csGridC = parseFloat(computed.getPropertyValue("--cs-grid-c")) || 0;
				const csGridR = parseFloat(computed.getPropertyValue("--cs-grid-r")) || 0;
				animation = newItem.animate([{
					"--rv-grid-c": csPGridC,
					"--rv-grid-r": csPGridR,
					"--drag-x": dragX,
					"--drag-y": dragY,
					"--cs-drag-x": `${dragX}px`,
					"--cs-drag-y": `${dragY}px`
				}, {
					"--rv-grid-c": csGridC,
					"--rv-grid-r": csGridR,
					"--drag-x": 0,
					"--drag-y": 0,
					"--cs-drag-x": "0px",
					"--cs-drag-y": "0px"
				}], {
					fill: "forwards",
					duration: 240,
					easing: "cubic-bezier(0.22, 0.8, 0.3, 1)"
				});
				const onInterrupt = () => animation?.finish?.();
				newItem.addEventListener("m-dragstart", onInterrupt, { once: true });
				await animation.finished.catch(console.warn.bind(console));
				newItem.removeEventListener("m-dragstart", onInterrupt);
			}
			requestAnimationFrame(() => {
				setStyleProperty(newItem, "will-change", "auto");
				resetDragRefs();
				syncDragStyles?.(true);
				if (cell) {
					commitCell(cell);
					setStyleProperty(newItem, "--p-cell-x", cell[0]);
					setStyleProperty(newItem, "--p-cell-y", cell[1]);
					setStyleProperty(newItem, "--cell-x", cell[0]);
					setStyleProperty(newItem, "--cell-y", cell[1]);
				}
				animation?.cancel?.();
				newItem.removeAttribute("data-dragging");
				setState("onPlace", "destination");
				settleTimer = setTimeout(() => {
					setState("onHover", "source");
					settleTimer = null;
				}, 280);
				newItem.dispatchEvent(new CustomEvent("m-dragsettled", {
					bubbles: true,
					detail: {
						cell: cell ? [cell[0], cell[1]] : null,
						interactionState: "onPlace",
						coordinateState: "destination"
					}
				}));
			});
		});
		return [0, 0];
	};
	const customTrigger = (doGrab) => new LongPressHandler(newItem, {
		handler: "*",
		anyPointer: true,
		mouseImmediate: true,
		minHoldTime: 60 * 3600,
		maxHoldTime: 100
	}, makeShiftTrigger((ev) => {
		onGrab(dragging);
		doGrab?.(ev, newItem);
	}));
	return bindDraggable(customTrigger, onDrop, dragging);
};
typeof document !== "undefined" && document?.documentElement;
var bindInteraction = (newItem, pArgs) => {
	reflectCell(newItem, pArgs, true);
	const { item, items, list } = pArgs;
	const layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
	const immediateDragStyles = Boolean(pArgs?.immediateDragStyles);
	const dragging = [numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior())];
	const currentCell = [numberRef(item?.cell?.[0] || 0), numberRef(item?.cell?.[1] || 0)];
	setStyleProperty(newItem, "--cell-x", currentCell?.[0]?.value || 0);
	setStyleProperty(newItem, "--cell-y", currentCell?.[1]?.value || 0);
	const applyDragStyles = () => {
		const dx = dragging?.[0]?.value || 0;
		const dy = dragging?.[1]?.value || 0;
		setStyleProperty(newItem, "--drag-x", dx);
		setStyleProperty(newItem, "--cs-drag-x", `${dx}px`);
		setStyleProperty(newItem, "--drag-y", dy);
		setStyleProperty(newItem, "--cs-drag-y", `${dy}px`);
	};
	let pendingRaf = null;
	const syncDragStyles = (flush = false) => {
		if (immediateDragStyles || flush) {
			applyDragStyles();
			if (pendingRaf) {
				cancelAnimationFrame(pendingRaf);
				pendingRaf = null;
			}
		} else if (!pendingRaf) pendingRaf = requestAnimationFrame(() => {
			applyDragStyles();
			pendingRaf = null;
		});
	};
	affected([dragging[0], "value"], (_, prop) => {
		if (prop === "value") syncDragStyles();
	});
	affected([dragging[1], "value"], (_, prop) => {
		if (prop === "value") syncDragStyles();
	});
	const checkMoving = () => {
		if (Math.abs(dragging[0]?.value || 0) > .5 || Math.abs(dragging[1]?.value || 0) > .5) {
			newItem.dataset.interactionState = "onMoving";
			newItem.dataset.gridCoordinateState = "intermediate";
		}
	};
	affected([dragging[0], "value"], (_, prop) => {
		if (prop === "value") checkMoving();
	});
	affected([dragging[1], "value"], (_, prop) => {
		if (prop === "value") checkMoving();
	});
	syncDragStyles(true);
	affected([currentCell[0], "value"], (val, prop) => {
		if (prop === "value" && item.cell != null && val != null) setStyleProperty(newItem, "--cell-x", (item.cell[0] = val) || 0);
	});
	affected([currentCell[1], "value"], (val, prop) => {
		if (prop === "value" && item.cell != null && val != null) setStyleProperty(newItem, "--cell-y", (item.cell[1] = val) || 0);
	});
	if (!newItem.dataset.dragResetBound) {
		newItem.dataset.dragResetBound = "1";
		newItem.addEventListener("m-dragstart", () => {
			setStyleProperty(newItem, "--drag-settle-ms", "0ms");
			newItem.style.removeProperty("--cs-transition-c");
			newItem.style.removeProperty("--cs-transition-r");
		});
	}
	makeDragEvents(newItem, {
		layout,
		currentCell,
		dragging,
		syncDragStyles
	}, {
		item,
		items,
		list
	});
	return currentCell;
};
//#endregion
//#region src/frontend/views/home/ts/ShortcutEditor.ts
var isDefaultViewAction = (action) => action === "open-view";
var isDefaultHrefAction = (action) => action === "open-link";
var setSelectOptions = (select, options, selectedValue, placeholder) => {
	if (!select) return;
	select.innerHTML = "";
	if (placeholder) {
		const placeholderOption = document.createElement("option");
		placeholderOption.value = placeholder.value;
		placeholderOption.textContent = placeholder.label;
		placeholderOption.selected = selectedValue === placeholder.value;
		select.append(placeholderOption);
	}
	for (const option of options) {
		const node = document.createElement("option");
		node.value = option.value;
		node.textContent = option.label;
		node.selected = option.value === selectedValue;
		select.append(node);
	}
	if (selectedValue && !options.some((option) => option.value === selectedValue)) {
		const fallbackOption = document.createElement("option");
		fallbackOption.value = selectedValue;
		fallbackOption.textContent = selectedValue;
		fallbackOption.selected = true;
		select.append(fallbackOption);
	}
};
var openShortcutEditor = (options) => {
	const { mode, initial, actionOptions, viewOptions, onSave, onDelete, isViewAction = isDefaultViewAction, isHrefAction = isDefaultHrefAction, registerForBackNavigation = false } = options;
	const modal = document.createElement("div");
	modal.className = "rs-modal-backdrop speed-dial-editor";
	modal.innerHTML = `
        <form class="modal-form speed-dial-editor__form">
            <header class="modal-header">
                <h2 class="modal-title">${mode === "create" ? "Create shortcut" : "Edit shortcut"}</h2>
                <p class="modal-description">Configure quick access tiles for frequently used views or links.</p>
            </header>
            <div class="modal-fields">
                <label class="modal-field">
                    <span>Label</span>
                    <input name="label" type="text" minlength="1" required />
                </label>
                <label class="modal-field">
                    <span>Icon</span>
                    <input name="icon" type="text" placeholder="phosphor icon name" />
                </label>
                <label class="modal-field">
                    <span>Shape</span>
                    <select name="shape">
                        <option value="squircle">Squircle</option>
                        <option value="circle">Circle</option>
                        <option value="square">Rounded square</option>
                    </select>
                </label>
                <label class="modal-field">
                    <span>Action</span>
                    <select name="action"></select>
                </label>
                <label class="modal-field" data-field="view">
                    <span>View</span>
                    <select name="view"></select>
                </label>
                <label class="modal-field" data-field="href">
                    <span>Link</span>
                    <input name="href" type="text" inputmode="url" autocomplete="off" placeholder="https://…, mailto:…" />
                </label>
                <label class="modal-field">
                    <span>Description</span>
                    <textarea name="description" rows="2" placeholder="Optional description"></textarea>
                </label>
            </div>
            <footer class="modal-actions">
                <div class="modal-actions-left">
                    ${mode === "edit" ? "<button type=\"button\" data-action=\"delete\" class=\"btn danger\">Delete</button>" : ""}
                </div>
                <div class="modal-actions-right">
                    <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                    <button type="submit" class="btn save">Save</button>
                </div>
            </footer>
        </form>
    `;
	const form = modal.querySelector("form");
	const labelInput = form?.querySelector("input[name=\"label\"]");
	const iconInput = form?.querySelector("input[name=\"icon\"]");
	const shapeSelect = form?.querySelector("select[name=\"shape\"]");
	const actionSelect = form?.querySelector("select[name=\"action\"]");
	const viewSelect = form?.querySelector("select[name=\"view\"]");
	const hrefInput = form?.querySelector("input[name=\"href\"]");
	const descriptionInput = form?.querySelector("textarea[name=\"description\"]");
	const viewField = form?.querySelector("[data-field=\"view\"]");
	const hrefField = form?.querySelector("[data-field=\"href\"]");
	if (labelInput) labelInput.value = String(initial.label || "New shortcut");
	if (iconInput) iconInput.value = String(initial.icon || "sparkle");
	const shapeVal = String(initial.shape || "squircle").toLowerCase();
	if (shapeSelect) shapeSelect.value = [
		"circle",
		"square",
		"squircle"
	].includes(shapeVal) ? shapeVal : "squircle";
	if (hrefInput) hrefInput.value = String(initial.href || "");
	if (descriptionInput) descriptionInput.value = String(initial.description || "");
	setSelectOptions(actionSelect, actionOptions, String(initial.action || ""));
	setSelectOptions(viewSelect, viewOptions, String(initial.view || ""), {
		value: "",
		label: "Choose view"
	});
	const syncFieldVisibility = () => {
		const action = String(actionSelect?.value || "");
		if (viewField) viewField.hidden = !isViewAction(action);
		if (hrefField) hrefField.hidden = !isHrefAction(action);
	};
	let unregisterBackNav = null;
	const escHandler = (event) => {
		if (event.key === "Escape") closeModal();
	};
	const closeModal = () => {
		unregisterBackNav?.();
		unregisterBackNav = null;
		document.removeEventListener("keydown", escHandler);
		modal.remove();
	};
	actionSelect?.addEventListener("change", syncFieldVisibility);
	syncFieldVisibility();
	document.addEventListener("keydown", escHandler);
	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});
	form?.addEventListener("click", (event) => {
		const action = event.target?.dataset?.action || "";
		if (action === "cancel") {
			event.preventDefault();
			closeModal();
			return;
		}
		if (action === "delete" && mode === "edit") {
			event.preventDefault();
			onDelete?.();
			closeModal();
		}
	});
	form?.addEventListener("submit", (event) => {
		event.preventDefault();
		onSave({
			label: String(labelInput?.value || "").trim() || "Item",
			icon: String(iconInput?.value || "").trim() || "sparkle",
			action: String(actionSelect?.value || "open-view"),
			view: String(viewSelect?.value || "").trim(),
			href: String(hrefInput?.value || "").trim(),
			description: String(descriptionInput?.value || "").trim(),
			shape: String(shapeSelect?.value || "squircle").toLowerCase()
		});
		closeModal();
	});
	if (registerForBackNavigation) unregisterBackNav = registerModal(modal, void 0, closeModal);
	document.body.append(modal);
};
//#endregion
//#region src/frontend/views/home/ts/SpeedDial.ts
var ctxMenuBound = false;
var homeViewOpener = null;
var persistItemsTimer = null;
/** Lazy-init: top-level `observe` + `pointerAnchorRef` ran during chunk eval and hit TDZ vs `com-app` (see vite-chunk-placement). */
var layoutSingleton = null;
function getLayout() {
	if (!layoutSingleton) {
		layoutSingleton = observe([gridLayoutState.columns ?? 4, gridLayoutState.rows ?? 8]);
		affected(gridLayoutState, () => {
			layoutSingleton[0] = gridLayoutState.columns ?? 4;
			layoutSingleton[1] = gridLayoutState.rows ?? 8;
		});
	}
	return layoutSingleton;
}
var coordinateRefSingleton = null;
function getCoordinateRef() {
	if (!coordinateRefSingleton) coordinateRefSingleton = typeof document !== "undefined" ? pointerAnchorRef() : [numberRef(0), numberRef(0)];
	return coordinateRefSingleton;
}
var schedulePersistItems = () => {
	if (persistItemsTimer) clearTimeout(persistItemsTimer);
	persistItemsTimer = setTimeout(() => {
		persistItemsTimer = null;
		persistSpeedDialItems();
	}, 80);
};
var resolveItemAction = (item, override) => {
	if (override) return override;
	return getSpeedDialMeta(item.id)?.action || item?.action || "open-view";
};
var ACTION_OPTIONS = [
	{
		value: "open-view",
		label: "Open view"
	},
	{
		value: "open-link",
		label: "Open link"
	},
	{
		value: "copy-link",
		label: "Copy link"
	},
	{
		value: "copy-state-desc",
		label: "Copy state + desc"
	}
];
var WALLPAPER_EXTENSIONS = new Set([
	"png",
	"jpg",
	"jpeg",
	"webp",
	"gif",
	"bmp",
	"svg",
	"avif"
]);
var getRefValue = (ref, fallback = "") => {
	if (ref && typeof ref === "object" && "value" in ref) return ref.value ?? fallback;
	return ref ?? fallback;
};
var buildDescriptor = (item) => {
	const meta = getSpeedDialMeta(item.id);
	return {
		label: getRefValue(item?.label),
		type: meta?.view || "speed-dial",
		DIR: "/",
		href: meta?.href,
		view: meta?.view,
		action: resolveItemAction(item)
	};
};
var bindCell = (el, args) => {
	const { item } = args;
	const cell = item?.cell ?? [0, 0];
	E(el, { style: {
		"--cell-x": propRef(cell, 0),
		"--cell-y": propRef(cell, 1),
		"--p-cell-x": propRef(cell, 0),
		"--p-cell-y": propRef(cell, 1)
	} });
};
var runItemAction = (item, actionId, extras = {}, makeView) => {
	const resolvedAction = resolveItemAction(item, actionId);
	const action = actionRegistry.get(resolvedAction);
	if (!action) {
		showError("Action is unavailable");
		return;
	}
	const context = {
		id: item.id,
		items: speedDialItems,
		meta: speedDialMeta,
		action: resolvedAction,
		viewMaker: makeView
	};
	try {
		action(context, item, extras?.initiator);
	} catch (error) {
		console.warn(error);
		showError("Failed to run action");
	}
};
var attachItemNode = (item, el, interactive = true, makeView) => {
	if (!el) return;
	const args = {
		layout: getLayout(),
		items: speedDialItems,
		item,
		meta: speedDialMeta
	};
	el.dataset.id = item.id;
	el.dataset.speedDialItem = "true";
	el.addEventListener("dragstart", (ev) => ev.preventDefault());
	if (interactive) {
		let pointerDownAt = null;
		let pointerDownTs = 0;
		let suppressClickUntil = 0;
		const blockTapUntil = (ms = 280) => {
			suppressClickUntil = Math.max(suppressClickUntil, Date.now() + ms);
		};
		if (!el.dataset.dragGuardBound) {
			el.dataset.dragGuardBound = "1";
			el.addEventListener("m-dragstart", () => blockTapUntil(420));
			el.addEventListener("m-dragsettled", () => {
				blockTapUntil(320);
				schedulePersistItems();
			});
		}
		el.addEventListener("click", (ev) => {
			if (Date.now() < suppressClickUntil) {
				ev?.preventDefault?.();
				ev?.stopPropagation?.();
				return;
			}
			ev?.preventDefault?.();
			const interactionState = String(el?.dataset?.interactionState || "");
			if (!(interactionState === "onGrab" || interactionState === "onMoving" || interactionState === "onRelax") && !MOCElement(ev?.target, "[data-interaction-state=\"onMoving\"],[data-interaction-state=\"onGrab\"],[data-interaction-state=\"onRelax\"]")) runItemAction(item, void 0, {
				event: ev,
				initiator: el
			}, makeView);
		});
		el.addEventListener("pointerdown", (ev) => {
			pointerDownAt = [ev.clientX, ev.clientY];
			pointerDownTs = Date.now();
		});
		el.addEventListener("pointerup", (ev) => {
			if (!pointerDownAt) return;
			const dx = ev.clientX - pointerDownAt[0];
			const dy = ev.clientY - pointerDownAt[1];
			const distance = Math.hypot(dx, dy);
			const elapsed = Date.now() - pointerDownTs;
			pointerDownAt = null;
			if (distance <= 6 && elapsed <= 350) {
				blockTapUntil(250);
				runItemAction(item, void 0, {
					event: ev,
					initiator: el
				}, makeView);
			}
		});
		el.addEventListener("dblclick", (ev) => {
			ev?.preventDefault?.();
			openItemEditor(item);
		});
	}
	if (el.dataset.layer === "labels") {
		el.style.pointerEvents = "none";
		bindCell(el, args);
	}
	if (el.dataset.layer === "icons") {
		bindInteraction(el, {
			...args,
			immediateDragStyles: true
		});
		const cell = item?.cell ?? [0, 0];
		E(el, { style: {
			"--cell-x": propRef(cell, 0),
			"--cell-y": propRef(cell, 1)
		} });
	}
};
var deriveCellFromEvent = (ev) => {
	const grid = document.querySelector("#home .speed-dial-grid[data-grid-layer=\"icons\"]") || document.querySelector("#home .speed-dial-grid:last-of-type") || document.querySelector("#home .speed-dial-grid");
	if (!grid || !ev) return [0, 0];
	return resolveGridCellFromClientPoint(grid, [ev.clientX, ev.clientY], { layout: getLayout() }, "floor");
};
var deriveCellFromCoordinate = (coordinate) => {
	const grid = document.querySelector("#home .speed-dial-grid[data-grid-layer=\"icons\"]") || document.querySelector("#home .speed-dial-grid:last-of-type") || document.querySelector("#home .speed-dial-grid");
	if (!grid || !coordinate) return [0, 0];
	return resolveGridCellFromClientPoint(grid, coordinate, { layout: getLayout() }, "floor");
};
var deriveCellFromAnchor = () => {
	const ref = getCoordinateRef();
	return deriveCellFromCoordinate([ref[0].value, ref[1].value]);
};
var looksLikeImageFile = (file) => {
	if (!file) return false;
	if (String(file.type || "").toLowerCase().startsWith("image/")) return true;
	const name = String(file.name || "").trim().toLowerCase();
	const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
	return WALLPAPER_EXTENSIONS.has(ext);
};
var parseUrlFromHtml = (html) => {
	const source = String(html || "").trim();
	if (!source) return null;
	const hrefMatch = source.match(/href\s*=\s*["']([^"']+)["']/i);
	const href = String(hrefMatch?.[1] || "").trim();
	if (!href) return null;
	return href;
};
var parseShortcutFromTransfer = (transfer, suggestedCell) => {
	if (!transfer) return null;
	const plain = String(transfer.getData("text/plain") || "").trim();
	const uriList = String(transfer.getData("text/uri-list") || "").trim();
	const html = String(transfer.getData("text/html") || "").trim();
	const preferred = plain || uriList || parseUrlFromHtml(html) || "";
	if (!preferred) return null;
	return parseSpeedDialItemFromJSON(preferred, suggestedCell) || parseSpeedDialItemFromURL(preferred, suggestedCell);
};
var createMenuEntryForAction = (actionId, item, fallbackLabel = "", makeView) => {
	const descriptor = buildDescriptor(item);
	return {
		id: actionId,
		label: labelsPerAction.get(actionId)?.(descriptor) || fallbackLabel,
		icon: iconsPerAction.get(actionId) || "command",
		action: (initiator, _menuItem, ev) => runItemAction(item, actionId, {
			event: ev,
			initiator
		}, makeView)
	};
};
var pickWallpaper = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = async () => {
		const file = input.files?.[0];
		if (!file) return;
		try {
			const dir = "/images/wallpaper/";
			await writeFileSmart(null, dir, file);
			wallpaperState.src = `${dir}${file.name}`;
			persistWallpaper();
			showSuccess("Wallpaper updated");
		} catch (e) {
			console.warn(e);
			showError("Failed to set wallpaper");
		}
	};
	input.click();
};
var handleSpeedDialPaste = async (event, suggestedCell) => {
	if (!isInFocus(event?.target, "#home") && !isInFocus(event?.target, "#home:is(:hover, :focus, :focus-visible), #home:has(:hover, :focus, :focus-visible)", "child")) return false;
	event.preventDefault();
	event.stopPropagation();
	try {
		const targetCell = suggestedCell ?? deriveCellFromAnchor();
		const item = parseShortcutFromTransfer(event.clipboardData, targetCell) || await createSpeedDialItemFromClipboard(targetCell);
		if (!item) return false;
		addSpeedDialItem(item);
		persistSpeedDialItems();
		persistSpeedDialMeta();
		showSuccess("Shortcut created from clipboard");
		return true;
	} catch (e) {
		console.warn("Failed to paste speed dial item:", e);
		return false;
	}
};
var handleWallpaperDropOrPaste = (event) => {
	if (isInFocus(event?.target, "#home") || isInFocus(event?.target, "#home:is(:hover, :focus, :focus-visible), #home:has(:hover, :focus, :focus-visible)", "child")) {
		const isPaste = event instanceof ClipboardEvent;
		const droppedOnItem = !!event.target?.closest?.("[data-speed-dial-item]");
		const suggestedCell = deriveCellFromAnchor();
		const dataTransfer = isPaste ? event.clipboardData : event.dataTransfer;
		if (isPaste) {
			const fromTransfer = parseShortcutFromTransfer(dataTransfer, suggestedCell);
			if (fromTransfer) {
				event.preventDefault();
				event.stopPropagation();
				addSpeedDialItem(fromTransfer);
				persistSpeedDialItems();
				persistSpeedDialMeta();
				showSuccess("Shortcut created from pasted link");
				return;
			}
			handleSpeedDialPaste(event, suggestedCell);
		}
		if (!isPaste) {
			const parsed = parseShortcutFromTransfer(dataTransfer, suggestedCell);
			if (parsed) {
				event.preventDefault();
				event.stopPropagation();
				addSpeedDialItem(parsed);
				persistSpeedDialItems();
				persistSpeedDialMeta();
				showSuccess("Shortcut created from dropped link");
				return;
			}
		}
		event.preventDefault();
		event.stopPropagation();
		const dt = dataTransfer || event.clipboardData || event.dataTransfer;
		if (!!!Array.from(dt?.files || []).find((file) => looksLikeImageFile(file)) || droppedOnItem) return;
		queueMicrotask(() => {
			handleIncomingEntries(dt, "/images/wallpaper/", null, (file, path) => {
				console.log(file, path);
				if (looksLikeImageFile(file)) {
					wallpaperState.src = path;
					persistWallpaper();
					showSuccess("Wallpaper updated");
				}
			});
		});
	}
};
function SpeedDial(makeView) {
	getLayout();
	getCoordinateRef();
	homeViewOpener = makeView;
	const columnsRef = propRef(gridLayoutState, "columns", 4);
	const rowsRef = propRef(gridLayoutState, "rows", 8);
	const shapeRef = propRef(gridLayoutState, "shape", "square");
	const tileShapeForItem = (item) => {
		const raw = String(getSpeedDialMeta(item.id)?.shape || "squircle").toLowerCase();
		return raw === "circle" || raw === "square" || raw === "squircle" ? raw : "squircle";
	};
	const renderIconItem = (item) => {
		return H`<div class="ui-ws-item" data-speed-dial-item data-layer="icons" ref=${(el) => attachItemNode(item, el, true, makeView)}>
            <div data-shape=${tileShapeForItem(item)} class="ui-ws-item-icon shaped">
                <ui-icon icon=${item.icon}></ui-icon>
            </div>
        </div>`;
	};
	const renderLabelItem = (item) => {
		return H`<div style="background-color: transparent;" class="ui-ws-item" data-speed-dial-item data-layer="labels" ref=${(el) => attachItemNode(item, el, true, makeView)}>
            <div class="ui-ws-item-label" style="background-color: transparent;">
                <span style="background-color: transparent;">${getRefValue(item.label)}</span>
            </div>
        </div>`;
	};
	const oRef = orientRef();
	return H`<div slot="underlay" style="pointer-events: auto; position: relative; contain: strict; overflow: hidden; display: grid;" id="home" data-mixin="ui-orientbox" class="speed-dial-root" prop:orient=${oRef} ref=${(el) => E(el, { style: { "--orient": oRef } })} on:dragover=${(ev) => ev.preventDefault()} on:drop=${(ev) => handleWallpaperDropOrPaste(ev)} prop:onPaste=${async (ev) => await handleWallpaperDropOrPaste(ev)}>
        <div style="background-color: transparent; color-scheme: dark; pointer-events: none;" class="speed-dial-grid speed-dial-grid--labels ui-launcher-grid" data-layer="items" data-grid-layer="labels" data-grid-columns=${columnsRef} data-grid-rows=${rowsRef} data-grid-shape=${shapeRef} ref=${(el) => E(el, { style: {
		"--layout-c": columnsRef,
		"--layout-r": rowsRef
	} })}>
            ${M(speedDialItems, renderLabelItem)}
        </div>
        <div style="background-color: transparent; pointer-events: none;" class="speed-dial-grid speed-dial-grid--icons ui-launcher-grid" data-layer="items" data-grid-layer="icons" data-grid-columns=${columnsRef} data-grid-rows=${rowsRef} data-grid-shape=${shapeRef} ref=${(el) => E(el, { style: {
		"--layout-c": columnsRef,
		"--layout-r": rowsRef
	} })}>
            ${M(speedDialItems, renderIconItem)}
        </div>
    </div>`;
}
var openItemEditor = (item, opts) => {
	const workingItem = item ?? createEmptySpeedDialItem(opts?.suggestedCell ?? deriveCellFromAnchor());
	const isNew = !item;
	const workingMeta = ensureSpeedDialMeta(workingItem.id);
	const seed = opts?.seed || {};
	if (isNew && seed?.action) {
		workingItem.action = seed.action;
		workingMeta.action = seed.action;
	}
	if (isNew && seed?.label) workingItem.label.value = seed.label;
	if (isNew && seed?.icon) workingItem.icon.value = seed.icon;
	if (isNew && seed?.view) workingMeta.view = seed.view;
	if (isNew && seed?.href) workingMeta.href = seed.href;
	if (isNew && seed?.description) workingMeta.description = seed.description;
	const draft = {
		label: getRefValue(workingItem.label, "New shortcut"),
		icon: getRefValue(workingItem.icon, "sparkle"),
		action: resolveItemAction(workingItem),
		href: workingMeta?.href || "",
		view: workingMeta?.view || "",
		description: workingMeta?.description || "",
		shape: String(workingMeta?.shape || "squircle")
	};
	openShortcutEditor({
		mode: isNew ? "create" : "edit",
		initial: {
			label: draft.label,
			icon: draft.icon,
			action: draft.action,
			href: draft.href,
			view: draft.view,
			description: draft.description,
			shape: draft.shape
		},
		actionOptions: ACTION_OPTIONS,
		viewOptions: NAVIGATION_SHORTCUTS.map((shortcut) => ({
			value: String(shortcut.view || ""),
			label: String(shortcut.label || shortcut.view || "")
		})),
		registerForBackNavigation: true,
		isViewAction: (value) => value === "open-view",
		isHrefAction: (value) => value === "open-link" || value === "copy-link",
		onSave: (next) => {
			workingItem.label.value = next.label;
			workingItem.icon.value = next.icon || "sparkle";
			workingItem.action = next.action || "open-view";
			workingMeta.action = workingItem.action;
			workingMeta.view = next.view;
			workingMeta.href = next.href;
			workingMeta.description = next.description;
			workingMeta.shape = next.shape;
			if (isNew) addSpeedDialItem(workingItem);
			else upsertSpeedDialItem(workingItem);
			persistSpeedDialItems();
			persistSpeedDialMeta();
			showSuccess(isNew ? "Shortcut created" : "Shortcut updated");
		},
		onDelete: isNew ? void 0 : () => {
			removeSpeedDialItem(workingItem.id);
			persistSpeedDialItems();
			persistSpeedDialMeta();
			showSuccess("Shortcut removed");
		}
	});
};
function createCtxMenu(makeView) {
	getLayout();
	getCoordinateRef();
	homeViewOpener = makeView || homeViewOpener;
	if (!ctxMenuBound) {
		ctxMenuBound = true;
		document.addEventListener("contextmenu", (event) => {
			if (!event.target?.closest?.("#home")) return;
			event.preventDefault();
			const targetEl = event.target?.closest?.("[data-speed-dial-item]");
			const itemId = targetEl?.getAttribute?.("data-id");
			const item = findSpeedDialItem(itemId);
			const guessedCell = deriveCellFromEvent(event) ?? deriveCellFromAnchor();
			const toLeaf = (entry) => ({
				id: String(entry?.id || "menu-action"),
				label: String(entry?.label || "Action"),
				icon: String(entry?.icon || "command"),
				action: () => entry?.action?.(targetEl, entry, event)
			});
			const openViewTask = (view, params = {}) => {
				const opener = homeViewOpener || makeView;
				if (opener) {
					opener(view, {
						...params,
						newTask: "1"
					});
					return;
				}
				actionRegistry.get(`open-view-${view}`)?.({
					id: "",
					items: speedDialItems,
					meta: speedDialMeta
				}, {});
			};
			const menuItems = item ? [
				{
					id: "open",
					label: "Open",
					icon: "play",
					action: () => runItemAction(item, void 0, {
						event,
						initiator: targetEl
					}, homeViewOpener)
				},
				{
					id: "actions",
					label: "Actions",
					icon: "dots-three",
					action: () => {},
					children: [
						toLeaf(createMenuEntryForAction(resolveItemAction(item) || "open-view", item, "Run action", homeViewOpener)),
						...getSpeedDialMeta(item.id)?.href ? [toLeaf(createMenuEntryForAction("open-link", item, "Open link", homeViewOpener)), toLeaf(createMenuEntryForAction("copy-link", item, "Copy link", homeViewOpener))] : [],
						toLeaf(createMenuEntryForAction("copy-state-desc", item, "Copy shortcut JSON", homeViewOpener))
					]
				},
				{
					id: "open-in",
					label: "Open In New",
					icon: "app-window",
					action: () => {},
					children: [{
						id: "open-in-regular-window",
						label: "Regular window",
						icon: "app-window",
						action: () => {
							openViewTask(String(getSpeedDialMeta(item.id)?.view || "viewer"), { windowType: "regular" });
						}
					}, {
						id: "open-in-tabbed-window",
						label: "Tabbed window",
						icon: "rows-plus-bottom",
						action: () => {
							openViewTask(String(getSpeedDialMeta(item.id)?.view || "viewer"), { windowType: "tabbed" });
						}
					}]
				},
				{
					id: "manage",
					label: "Manage",
					icon: "wrench",
					action: () => {},
					children: [{
						id: "edit",
						label: "Edit Properties",
						icon: "pencil-simple-line",
						action: () => openItemEditor(item)
					}, {
						id: "remove",
						label: "Remove",
						icon: "trash",
						danger: true,
						action: () => {
							removeSpeedDialItem(item.id);
							persistSpeedDialItems();
							persistSpeedDialMeta();
							showSuccess("Shortcut removed");
						}
					}]
				}
			] : [
				{
					id: "new",
					label: "New",
					icon: "plus",
					action: () => {},
					children: [
						{
							id: "create-shortcut",
							label: "Create shortcut",
							icon: "plus",
							action: () => {
								openItemEditor(void 0, { suggestedCell: guessedCell });
							}
						},
						{
							id: "create-link-shortcut",
							label: "Create link shortcut",
							icon: "link",
							action: () => {
								openItemEditor(void 0, {
									suggestedCell: guessedCell,
									seed: {
										action: "open-link",
										icon: "link",
										label: "New link",
										href: "",
										description: ""
									}
								});
							}
						},
						{
							id: "paste-shortcut",
							label: "Paste shortcut",
							icon: "clipboard",
							action: async () => {
								try {
									const speedDialItem = await createSpeedDialItemFromClipboard(guessedCell);
									if (!speedDialItem) {
										showError("Clipboard does not contain a valid URL or shortcut JSON");
										return;
									}
									addSpeedDialItem(speedDialItem);
									persistSpeedDialItems();
									persistSpeedDialMeta();
									showSuccess("Shortcut created from clipboard");
								} catch (e) {
									console.warn(e);
									showError("Failed to paste shortcut");
								}
							}
						}
					]
				},
				{
					id: "open",
					label: "Open",
					icon: "squares-four",
					action: () => {},
					children: [
						{
							id: "open-explorer",
							label: "Explorer",
							icon: "books",
							action: () => {
								actionRegistry.get("open-view-explorer")?.({
									id: "",
									items: speedDialItems,
									meta: speedDialMeta,
									viewMaker: homeViewOpener
								}, {});
							}
						},
						{
							id: "open-settings",
							label: "Settings",
							icon: "gear-six",
							action: () => {
								actionRegistry.get("open-view-settings")?.({
									id: "",
									items: speedDialItems,
									meta: speedDialMeta,
									viewMaker: homeViewOpener
								}, {});
							}
						},
						{
							id: "open-window-type",
							label: "New Window",
							icon: "app-window",
							action: () => {},
							children: [{
								id: "open-viewer-regular",
								label: "Viewer (regular)",
								icon: "article",
								action: () => openViewTask("viewer", { windowType: "regular" })
							}, {
								id: "open-viewer-tabbed",
								label: "Viewer (tabbed)",
								icon: "rows-plus-bottom",
								action: () => openViewTask("viewer", { windowType: "tabbed" })
							}]
						}
					]
				},
				{
					id: "wallpaper",
					label: "Wallpaper",
					icon: "image",
					action: () => {},
					children: [{
						id: "change-wallpaper",
						label: "Change wallpaper",
						icon: "image",
						action: pickWallpaper
					}]
				}
			];
			openUnifiedContextMenu({
				x: event.clientX,
				y: event.clientY,
				items: menuItems,
				compact: true
			});
		}, { capture: true });
	}
	return H`<div data-home-ctx-menu style="display:none;"></div>`;
}
//#endregion
//#region src/frontend/views/home/ts/SpeedDial.scss?inline
var SpeedDial_default = "@layer views{.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.speed-dial-root{background-color:initial;block-size:100%;border-radius:0;box-sizing:border-box;display:grid;grid-column:1/-1;grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:auto;position:absolute}.speed-dial-grid,.speed-dial-root>*{grid-column:1/-1;grid-row:1/-1}.speed-dial-grid{--grid-cols:4;--grid-rows:8;padding:var(--padding-lg)}.speed-dial-grid[data-grid-columns=\"4\"]{--grid-cols:4}.speed-dial-grid[data-grid-columns=\"5\"]{--grid-cols:5}.speed-dial-grid[data-grid-columns=\"6\"]{--grid-cols:6}.speed-dial-grid[data-grid-columns=\"7\"]{--grid-cols:7}.speed-dial-grid[data-grid-columns=\"8\"]{--grid-cols:8}.speed-dial-grid[data-grid-rows=\"6\"]{--grid-rows:6}.speed-dial-grid[data-grid-rows=\"7\"]{--grid-rows:7}.speed-dial-grid[data-grid-rows=\"8\"]{--grid-rows:8}.speed-dial-grid[data-grid-rows=\"9\"]{--grid-rows:9}.speed-dial-grid[data-grid-rows=\"10\"]{--grid-rows:10}.speed-dial-grid[data-grid-rows=\"11\"]{--grid-rows:11}.speed-dial-grid[data-grid-rows=\"12\"]{--grid-rows:12}.speed-dial-grid{--layout-c:var(--grid-cols,4);--layout-r:var(--grid-rows,8);border-radius:0}.speed-dial-grid[data-grid-layer=icons]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none;z-index:1}.speed-dial-grid[data-grid-layer=icons]:has([data-dragging]){z-index:3}.speed-dial-grid[data-grid-layer=labels]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none!important;z-index:2}.speed-dial-grid .ui-ws-item{--drag-x:0;--drag-y:0;--cs-drag-x:calc(var(--drag-x, 0) * 1px);--cs-drag-y:calc(var(--drag-y, 0) * 1px);--tile-size:clamp(3.2rem,7.5vmin,4.6rem);aspect-ratio:1/1;background-color:initial;display:grid;grid-column:clamp(1,1 + round(nearest,var(--cs-grid-c,0),1),var(--cs-layout-c,4));grid-row:clamp(1,1 + round(nearest,var(--cs-grid-r,0),1),var(--cs-layout-r,8));grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);min-block-size:var(--tile-size);min-inline-size:var(--tile-size);place-content:center;place-items:center;place-self:center;pointer-events:auto;position:relative;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;contain:none;filter:none;overflow:visible;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0);transform-origin:50% 50%;transition:transform var(--drag-settle-ms,.2s) cubic-bezier(.22,.8,.3,1),scale .18s var(--ease-out,ease-out),filter .18s var(--ease-out,ease-out);z-index:1}.speed-dial-grid .ui-ws-item:hover{scale:1.06}.speed-dial-grid .ui-ws-item:hover .ui-ws-item-icon{background:color-mix(in oklab,var(--color-surface-container-high,#1f2937) 60%,transparent);box-shadow:0 10px 36px -10px color-mix(in oklab,#000 40%,transparent)}.speed-dial-grid .ui-ws-item:active{scale:.94}.speed-dial-grid .ui-ws-item .ui-ws-item-icon{aspect-ratio:1/1;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);background:color-mix(in oklab,var(--color-surface-container,#111827) 56%,transparent);block-size:var(--tile-size);border:none;border-radius:22%;box-shadow:0 6px 24px -8px color-mix(in oklab,#000 38%,transparent);contain:layout style;cursor:pointer;display:grid;filter:none;grid-column:1/-1;grid-row:1/-1;inline-size:var(--tile-size);line-height:0;max-block-size:100%;max-inline-size:100%;min-block-size:fit-content;min-inline-size:fit-content;overflow:hidden;padding:.8rem;place-content:center;place-items:center;pointer-events:auto;position:relative;text-align:center;transition:background-color .2s ease,box-shadow .2s ease}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=circle]{border-radius:50%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=square]{border-radius:max(.55rem,14%)}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=squircle]{border-radius:22%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon .ui-ws-item-icon-image{block-size:calc(100% - .9rem);filter:drop-shadow(0 1px 3px rgba(0,0,0,.2));inline-size:calc(100% - .9rem);inset:.45rem;object-fit:contain;object-position:center;pointer-events:none;position:absolute;z-index:3}.speed-dial-grid .ui-ws-item .ui-ws-item-icon ui-icon{--icon-size:clamp(1.6rem,60%,2.4rem);aspect-ratio:1/1;block-size:var(--icon-size,1.8rem);color:var(--on-surface-variant,var(--on-surface-color,currentColor));filter:drop-shadow(0 1px 2px rgba(0,0,0,.1333333333));inline-size:var(--icon-size,1.8rem);line-height:0;max-block-size:var(--icon-size,1.8rem);max-inline-size:var(--icon-size,1.8rem);min-block-size:fit-content;min-inline-size:fit-content;object-fit:contain;object-position:center;pointer-events:none;z-index:2}.speed-dial-grid .ui-ws-item .ui-ws-item-label{align-items:flex-start;background:transparent;color:var(--on-surface-color,currentColor);display:flex;filter:none;inset-block-start:100%;inset-inline:0;justify-content:center;overflow:visible;padding-block-start:.35rem;pointer-events:none;position:absolute;text-align:center;white-space:nowrap}.speed-dial-grid .ui-ws-item .ui-ws-item-label span{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;border:none;border-radius:6px;box-shadow:none;color:color-mix(in oklab,var(--on-surface-color,#e5e7eb) 90%,transparent);display:inline-flex;font-size:.72rem;font-weight:500;inline-size:max-content;letter-spacing:.01em;line-height:1.25;max-inline-size:min(100%,9rem);overflow:hidden;padding-block:.15rem;padding-inline:.4rem;place-content:center;place-items:center;pointer-events:none;text-align:center;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.4);white-space:nowrap}.speed-dial-grid .ui-ws-item:active{will-change:transform}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving]{cursor:grabbing;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;transition:none!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab] .ui-ws-item-label,.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving] .ui-ws-item-label{opacity:1;pointer-events:none}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace],.speed-dial-grid .ui-ws-item[data-interaction-state=onRelax]{transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace]{transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1),filter var(--transition-fast) var(--ease-out)!important}.speed-dial-grid .ui-ws-item[data-layer=labels]{filter:none;transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1);z-index:0}.speed-dial-grid .ui-ws-item[data-layer=labels],.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label{background:transparent!important;pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label span{pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onLabelDocked]{cursor:default;transform:none!important;transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onMoving]{transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=icons]{filter:none;touch-action:none;z-index:4}.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onMoving],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onRelax]{z-index:5}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.35rem,2.8cqh,var(--padding-lg));padding-inline:clamp(.35rem,3.2cqw,var(--padding-lg))}}@container (max-height: 29rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.3rem,2.2cqh,var(--padding-md))}}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .ui-ws-item{--tile-size:clamp(2.6rem,11cqmin,4.2rem)}.speed-dial-root.app-oriented-desktop .ui-ws-item .ui-ws-item-icon{padding:.65rem}}.speed-dial-editor{backdrop-filter:blur(8px) saturate(1.05);-webkit-backdrop-filter:blur(8px) saturate(1.05);background:color-mix(in oklab,#020617 58%,transparent);display:grid;inset:0;padding:1rem;place-items:center;pointer-events:auto;position:fixed;z-index:6}.speed-dial-editor__form{background:color-mix(in oklab,var(--color-surface,#0b1220) 88%,#000);border:none;border-radius:18px;box-shadow:0 24px 64px -28px color-mix(in oklab,#000 65%,transparent),0 0 0 1px color-mix(in oklab,var(--color-outline-variant,#334155) 35%,transparent) inset;color:var(--color-on-surface,#e2e8f0);display:grid;grid-template-rows:auto minmax(0,1fr) auto;inline-size:min(100%,980px);margin-inline:auto;max-block-size:min(86vh,760px);overflow:hidden}.speed-dial-editor__form .modal-header{border-block-end:none;box-shadow:0 1px 0 color-mix(in oklab,var(--color-outline-variant,#334155) 28%,transparent);display:grid;gap:.4rem;padding:1rem 1rem .75rem}.speed-dial-editor__form .modal-title{font-size:1.2rem;font-weight:650;line-height:1.25;margin:0}.speed-dial-editor__form .modal-description{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 72%,transparent);font-size:.86rem;line-height:1.35;margin:0}.speed-dial-editor__form .modal-fields{align-content:start;display:grid;gap:.75rem;min-block-size:0;overflow:auto;padding:.9rem 1rem 1rem}.speed-dial-editor__form .modal-field{display:grid;gap:.35rem}.speed-dial-editor__form .modal-field>span{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 76%,transparent);font-size:.84rem}.speed-dial-editor__form :is(input,select,textarea){appearance:none;background:color-mix(in oklab,var(--color-surface-container-low,#101827) 88%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 75%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);inline-size:100%;min-inline-size:0;outline:none;padding:.55rem .7rem}.speed-dial-editor__form textarea{min-block-size:4.4rem;resize:vertical}.speed-dial-editor__form :is(input,select,textarea):focus{border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 64%,#fff 8%);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3b82f6) 26%,transparent)}.speed-dial-editor__form .modal-actions{align-items:center;background:color-mix(in oklab,var(--color-surface-container,#172032) 42%,transparent);border-block-start:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 64%,transparent);display:flex;gap:.5rem;justify-content:space-between;padding:.75rem 1rem}.speed-dial-editor__form :is(.modal-actions-left,.modal-actions-right){align-items:center;display:inline-flex;gap:.5rem}.speed-dial-editor__form .btn{background:color-mix(in oklab,var(--color-surface-container,#172032) 62%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 72%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);cursor:pointer;font-size:.86rem;line-height:1.2;padding:.46rem .86rem}.speed-dial-editor__form .btn.secondary{background:color-mix(in oklab,var(--color-surface-container,#172032) 48%,transparent)}.speed-dial-editor__form .btn.save{background:color-mix(in oklab,var(--color-primary,#3b82f6) 40%,#0b1220);border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 60%,transparent);color:#fff}.speed-dial-editor__form .btn.danger{background:color-mix(in oklab,var(--color-error,#ef4444) 28%,#1f0a0a);border-color:color-mix(in oklab,var(--color-error,#ef4444) 64%,transparent);color:#fff}.speed-dial-editor__form .btn:hover{filter:brightness(1.08)}.speed-dial-editor__form [hidden]{display:none!important}@media (max-width:820px){.speed-dial-editor{place-items:center}.speed-dial-editor__form{inline-size:100%;max-block-size:94vh}}}@layer view.home{:root:has([data-view=home]),html:has([data-view=home]){--view-home-bg:linear-gradient(135deg,light-dark(#f8f9fa,#1b1f24),light-dark(#e9ecef,#0f1216));--view-fg:light-dark(#1a1a1a,#e9ecef);--view-border:light-dark(rgba(0,0,0,0.08),rgba(255,255,255,0.12));--view-card-bg:light-dark(#ffffff,#1a1f26);--view-primary:light-dark(#007acc,#66b7ff);--view-layout:\"flex\";--view-padding:var(--space-8);--view-content-max-width:1200px;--view-hero-padding:var(--space-16);--view-card-gap:var(--space-6)}.view-home{align-items:center;background:var(--view-home-bg);block-size:100%;color:var(--view-fg);display:flex;justify-content:center;overflow-y:auto;padding:2rem}.view-home__content{max-inline-size:800px;text-align:center}.view-home__header{margin-block-end:3rem}.view-home__title{background:linear-gradient(135deg,var(--view-primary) 0,light-dark(#0059a6,#3a8ad6) 100%);-webkit-background-clip:text;font-size:3rem;font-weight:800;margin:0;-webkit-text-fill-color:transparent;background-clip:text}.view-home__subtitle{color:var(--view-fg);font-size:1.125rem;margin:.5rem 0 0;opacity:.7}.view-home__actions{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.view-home__action{align-items:center;background-color:var(--view-card-bg);border:1px solid var(--view-border);border-radius:16px;color:var(--view-fg);cursor:pointer;display:flex;flex-direction:column;gap:.75rem;padding:1.5rem;text-align:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.view-home__action ui-icon{color:var(--view-primary);opacity:.8}.view-home__action:hover{border-color:var(--view-primary);box-shadow:0 8px 24px light-dark(rgba(0,0,0,.1),rgba(0,0,0,.4));transform:translateY(-4px)}.view-home__action:hover ui-icon{opacity:1}.view-home__action:focus-visible{outline:2px solid var(--view-primary);outline-offset:2px}.view-home__action-title{font-size:1rem;font-weight:600}.view-home__action-desc{font-size:.8125rem;opacity:.6}.view-home--grid{align-items:stretch;background:transparent;block-size:100%;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;justify-items:stretch;overflow:hidden;padding:0;position:relative}.view-home--grid .speed-dial-root{block-size:100%;inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;overflow:hidden;position:absolute}@container (max-width: 768px){.view-home{--view-hero-padding:var(--space-8);--view-card-gap:var(--space-4)}}@container (max-width: 480px){.view-home__actions{grid-template-columns:1fr}}}";
//#endregion
//#region src/frontend/views/home/ts/outdated.ts
/**
* Home View
*
* Shell-agnostic home/dashboard component.
* Provides quick access to main features.
*/
var HomeView = class {
	id = "home";
	name = "Home";
	icon = "house";
	options;
	shellContext;
	element = null;
	_sheet = null;
	lifecycle = {
		onShow: () => {
			this._sheet ??= loadAsAdopted(SpeedDial_default);
		},
		onHide: () => {
			removeAdopted(this._sheet);
			this._sheet = null;
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
		this._sheet ??= loadAsAdopted(SpeedDial_default);
		const shellId = String(this.shellContext?.shellId || "").toLowerCase();
		if (shellId === "window" || shellId === "base" || shellId === "minimal") {
			const navigateHomeView = (view, params) => {
				if (!view) return;
				this.shellContext?.navigate?.(view, params);
			};
			const desktop = H`
                <div class="view-home view-home--grid" data-home-layout="grid"></div>
            `;
			const speedDial = SpeedDial(navigateHomeView);
			desktop.append(speedDial);
			createCtxMenu(navigateHomeView);
			this.element = desktop;
			return desktop;
		}
		this.element = H`
            <div class="view-home">
                <div class="view-home__content">
                    <div class="view-home__header">
                        <h1 class="view-home__title">CrossWord</h1>
                        <p class="view-home__subtitle">Markdown viewer, editor, and AI assistant</p>
                    </div>
                    
                    <div class="view-home__actions">
                        <button class="view-home__action" data-view="viewer" type="button">
                            <ui-icon icon="eye" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Viewer</span>
                            <span class="view-home__action-desc">View markdown documents</span>
                        </button>
                        
                        <button class="view-home__action" data-view="editor" type="button">
                            <ui-icon icon="pencil" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Editor</span>
                            <span class="view-home__action-desc">Write and edit markdown</span>
                        </button>
                        
                        <button class="view-home__action" data-view="workcenter" type="button">
                            <ui-icon icon="lightning" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Work Center</span>
                            <span class="view-home__action-desc">AI-powered processing</span>
                        </button>
                        
                        <button class="view-home__action" data-view="explorer" type="button">
                            <ui-icon icon="folder" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Explorer</span>
                            <span class="view-home__action-desc">Browse local files</span>
                        </button>
                        
                        <button class="view-home__action" data-view="airpad" type="button">
                            <ui-icon icon="hand-pointing" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Airpad</span>
                            <span class="view-home__action-desc">Remote trackpad control</span>
                        </button>
                        
                        <button class="view-home__action" data-view="settings" type="button">
                            <ui-icon icon="gear" icon-style="duotone" size="32"></ui-icon>
                            <span class="view-home__action-title">Settings</span>
                            <span class="view-home__action-desc">Configure the app</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
		this.setupEventHandlers();
		return this.element;
	}
	getToolbar() {
		return null;
	}
	setupEventHandlers() {
		if (!this.element) return;
		this.element.querySelectorAll("[data-view]").forEach((button) => {
			if (!isEnabledView(button.dataset.view || "")) button.remove();
		});
		this.element.addEventListener("click", (e) => {
			const button = e.target.closest("[data-view]");
			if (!button) return;
			const viewId = button.dataset.view;
			if (viewId && isEnabledView(viewId)) this.shellContext?.navigate(viewId);
		});
	}
	canHandleMessage() {
		return false;
	}
	async handleMessage() {}
};
function createView(options) {
	return new HomeView(options);
}
/** Alias for createView */
var createHomeView = createView;
//#endregion
export { HomeView, createHomeView, createView, createView as default };
