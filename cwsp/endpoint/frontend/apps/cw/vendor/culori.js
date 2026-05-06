import { C as getCorrectOrientation, D as RAFBehavior, R as makeRAFCycle, _ as setStyleProperty, o as DOMMixin, p as loadAsAdopted, w as orientationNumberMap, x as resolveGridCellFromClientPoint } from "../fest/dom.js";
import { a as numberRef, f as safe, l as stringRef, n as affected, o as observe, u as makeObjectAssignable } from "../fest/object.js";
import { a as redirectCell } from "../fest/core.js";
import { n as setAppWallpaper } from "../chunks/Canvas-2.js";
import { $ as vector2Ref, A as hostnameToFaviconRef, F as loadDesktopRaw, G as elementPointerMap, I as persistDesktopDraft, K as clampCell$1, L as persistDesktopMain, M as parseDesktopItemCompact, N as serializeDesktopItemCompact, O as compactIconSrcForStorage, P as decodeDesktopState, U as LongPressHandler, W as bindDraggable, et as registerModal, j as normalizeIconSrcFromPayload, k as expandIconSrcForDom, q as makeShiftTrigger, tt as navigate, w as makeUIState } from "../com/app.js";
import { a as HomeChannelAction } from "../chunks/channel-actions.js";
import { r as openUnifiedContextMenu, t as closeUnifiedContextMenu } from "../chunks/ContextMenu.js";
//#region ../../modules/views/home-view/src/ts/Interact.ts
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
		syntax: "<integer>",
		inherits: false,
		initialValue: "0"
	},
	{
		name: "--cell-y",
		syntax: "<integer>",
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
		const clamped = clampCell$1(redirectCell(cell, {
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
//#region ../../modules/views/home-view/src/ts/ShortcutEditor.ts
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
//#region ../../modules/views/home-view/src/ts/SpeedDial.scss?inline
var SpeedDial_default = "@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@function --get-oriented-size-num(--orient <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number>{--go-orient:round(nearest,var(--orient,0),1);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary:var(--osx,0);--go-secondary:var(--osy,0);--go-inline:calc(var(--go-primary) * var(--go-swap-inline) + var(--go-secondary) * var(--go-swap));--go-block:calc(var(--go-secondary) * var(--go-swap-inline) + var(--go-primary) * var(--go-swap));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-size(--orient <number>: 0, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary:var(--osx,0px);--go-secondary:var(--osy,0px);--go-inline:calc(var(--go-primary) * var(--go-swap-inline) + var(--go-secondary) * var(--go-swap));--go-block:calc(var(--go-secondary) * var(--go-swap-inline) + var(--go-primary) * var(--go-swap));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-vector(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0px);--go-secondary-direct:var(--ocy,0px);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-inverted:calc(0px - var(--go-inline-direct));--go-block-inverted:calc(0px - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-coord-num(--orient <number>: 0, --ocx <number>: 0, --ocy <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0);--go-secondary-direct:var(--ocy,0);--go-primary-size:var(--osx,0);--go-secondary-size:var(--osy,0);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-size:calc(var(--go-primary-size) * var(--go-swap-inline) + var(--go-secondary-size) * var(--go-swap));--go-block-size:calc(var(--go-secondary-size) * var(--go-swap-inline) + var(--go-primary-size) * var(--go-swap));--go-inline-inverted:calc(var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) - var(--go-inline-direct));--go-block-inverted:calc(var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-coordinate(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0px);--go-secondary-direct:var(--ocy,0px);--go-primary-size:var(--osx,0px);--go-secondary-size:var(--osy,0px);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-size:calc(var(--go-primary-size) * var(--go-swap-inline) + var(--go-secondary-size) * var(--go-swap));--go-block-size:calc(var(--go-secondary-size) * var(--go-swap-inline) + var(--go-primary-size) * var(--go-swap));--go-inline-inverted:calc(var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) - var(--go-inline-direct));--go-block-inverted:calc(var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@layer views{.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.speed-dial-root{background-color:initial;block-size:100%;border-radius:0;box-sizing:border-box;display:grid;grid-column:1/-1;grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;pointer-events:auto;position:absolute}.speed-dial-root>*{grid-column:1/-1;grid-row:1/-1}.speed-dial-root.app-oriented-desktop.ui-orientbox{pointer-events:auto}.speed-dial-grid{--grid-cols:4;--grid-rows:8;grid-column:1/-1;grid-row:1/-1;padding:var(--padding-lg)}.speed-dial-grid[data-grid-columns=\"4\"]{--grid-cols:4}.speed-dial-grid[data-grid-columns=\"5\"]{--grid-cols:5}.speed-dial-grid[data-grid-columns=\"6\"]{--grid-cols:6}.speed-dial-grid[data-grid-columns=\"7\"]{--grid-cols:7}.speed-dial-grid[data-grid-columns=\"8\"]{--grid-cols:8}.speed-dial-grid[data-grid-rows=\"6\"]{--grid-rows:6}.speed-dial-grid[data-grid-rows=\"7\"]{--grid-rows:7}.speed-dial-grid[data-grid-rows=\"8\"]{--grid-rows:8}.speed-dial-grid[data-grid-rows=\"9\"]{--grid-rows:9}.speed-dial-grid[data-grid-rows=\"10\"]{--grid-rows:10}.speed-dial-grid[data-grid-rows=\"11\"]{--grid-rows:11}.speed-dial-grid[data-grid-rows=\"12\"]{--grid-rows:12}.speed-dial-grid{--layout-c:var(--grid-cols,4);--layout-r:var(--grid-rows,8);--sd-inherit-layout-c:var(--layout-c,4);--sd-inherit-layout-r:var(--layout-r,8);--sd-inherit-cs-layout-c:var(--cs-layout-c,var(--layout-c,4));--sd-inherit-cs-layout-r:var(--cs-layout-r,var(--layout-r,8));--os-layout-c:var(--layout-c,4);--os-layout-r:var(--layout-r,8);--cs-layout-c:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),0);--cs-layout-r:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),1);block-size:stretch;border-radius:0;box-sizing:border-box;container-type:size;display:grid;gap:0;grid-template-columns:repeat(var(--cs-layout-c,4),minmax(0,1fr));grid-template-rows:repeat(var(--cs-layout-r,8),minmax(0,1fr));inline-size:stretch;min-block-size:0;min-inline-size:0;place-content:start;place-items:center;position:relative}.speed-dial-grid[data-grid-layer=icons]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none;z-index:1}.speed-dial-grid[data-grid-layer=icons]:has([data-dragging]){z-index:3}.speed-dial-grid[data-grid-layer=labels]{background:transparent!important;contain:layout style;isolation:isolate;pointer-events:none!important;z-index:2}.speed-dial-grid .ui-ws-item{--layout-c:inherit;--layout-r:inherit;--orient:inherit;--cs-sw-unit-x:calc(var(--cs-size-x, 100cqi) / var(--cs-layout-c, 1));--cs-sw-unit-y:calc(var(--cs-size-y, 100cqb) / var(--cs-layout-r, 1));--cs-transition-c:0px;--cs-transition-r:0px}.speed-dial-grid .ui-ws-item[data-dragging]{--cs-transition-c:calc((var(--rv-grid-c, 0) - var(--cs-grid-c, 0)) * var(--cs-sw-unit-x, 1px));--cs-transition-r:calc((var(--rv-grid-r, 0) - var(--cs-grid-r, 0)) * var(--cs-sw-unit-y, 1px))}.speed-dial-grid .ui-ws-item{--p-cell-x:var(--cell-x);--p-cell-y:var(--cell-y);--f-col:clamp(1,var(--layout-c,4),16);--f-row:clamp(1,var(--layout-r,8),16);--grid-c:clamp(0,var(--cell-x),var(--f-col) - 1);--grid-r:clamp(0,var(--cell-y),var(--f-row) - 1);--p-grid-c:clamp(0,var(--p-cell-x),var(--f-col) - 1);--p-grid-r:clamp(0,var(--p-cell-y),var(--f-row) - 1);--fc-cell-x:clamp(0,var(--cs-grid-c,0),var(--f-col) - 1);--fc-cell-y:clamp(0,var(--cs-grid-r,0),var(--f-row) - 1);--fp-cell-x:clamp(0,var(--cs-p-grid-c,0),var(--f-col) - 1);--fp-cell-y:clamp(0,var(--cs-p-grid-r,0),var(--f-row) - 1);--dir-x:calc(var(--cs-grid-c, 0) - var(--cs-p-grid-c, 0));--dir-y:calc(var(--cs-grid-r, 0) - var(--cs-p-grid-r, 0));--rv-grid-c:var(--cs-grid-c,1);--rv-grid-r:var(--cs-grid-r,1)}.speed-dial-grid .ui-ws-item[data-dragging]{--rv-grid-c:var(--cs-p-grid-c,1);--rv-grid-r:var(--cs-p-grid-r,1)}.speed-dial-grid .ui-ws-item{--os-grid-c:var(--grid-c,1);--os-grid-r:var(--grid-r,1);--cs-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1);--os-p-grid-c:var(--p-cell-x,0);--os-p-grid-r:var(--p-cell-y,0);--cs-p-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-p-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1);--ox-c-unit:calc(var(--os-size-x, 100cqi) / var(--os-layout-c, 1));--ox-r-unit:calc(var(--os-size-y, 100cqb) / var(--os-layout-r, 1));--os-inset-x:calc((var(--grid-c, 1) + 0.5) * var(--ox-c-unit, 1px));--os-inset-y:calc((var(--grid-r, 1) + 0.5) * var(--ox-r-unit, 1px));--f-col:clamp(1,var(--sd-inherit-layout-c,var(--layout-c,4)),16);--f-row:clamp(1,var(--sd-inherit-layout-r,var(--layout-r,8)),16);--drag-x:0;--drag-y:0;--cs-drag-x:calc(var(--drag-x, 0) * 1px);--cs-drag-y:calc(var(--drag-y, 0) * 1px);--tile-size:clamp(3.2rem,7.5vmin,4.6rem);aspect-ratio:1/1;background-color:initial;display:grid;grid-column:clamp(1,1 + round(nearest,var(--cs-grid-c,0),1),var(--sd-inherit-cs-layout-c,var(--cs-layout-c,4)));grid-row:clamp(1,1 + round(nearest,var(--cs-grid-r,0),1),var(--sd-inherit-cs-layout-r,var(--cs-layout-r,8)));grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);min-block-size:var(--tile-size);min-inline-size:var(--tile-size);place-content:center;place-items:center;place-self:center;pointer-events:auto;position:relative;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;contain:none;filter:none;overflow:visible;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0);transform-origin:50% 50%;transition:transform var(--drag-settle-ms,.2s) cubic-bezier(.22,.8,.3,1),scale .18s var(--ease-out,ease-out),filter .18s var(--ease-out,ease-out);z-index:1}.speed-dial-grid .ui-ws-item:hover{scale:1.06}.speed-dial-grid .ui-ws-item:hover .ui-ws-item-icon{background:color-mix(in oklab,var(--color-surface-container-high,#1f2937) 60%,transparent);box-shadow:0 10px 36px -10px color-mix(in oklab,#000 40%,transparent)}.speed-dial-grid .ui-ws-item:active{scale:.94}.speed-dial-grid .ui-ws-item .ui-ws-item-icon{aspect-ratio:1/1;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);background:color-mix(in oklab,var(--color-surface-container,#111827) 56%,transparent);block-size:var(--tile-size);border:none;border-radius:22%;box-shadow:0 6px 24px -8px color-mix(in oklab,#000 38%,transparent);contain:layout style;cursor:pointer;display:grid;filter:none;grid-column:1/-1;grid-row:1/-1;inline-size:var(--tile-size);line-height:0;max-block-size:100%;max-inline-size:100%;min-block-size:fit-content;min-inline-size:fit-content;overflow:hidden;padding:.8rem;place-content:center;place-items:center;pointer-events:auto;position:relative;text-align:center;transition:background-color .2s ease,box-shadow .2s ease}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=circle]{border-radius:50%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=square]{border-radius:max(.55rem,14%)}.speed-dial-grid .ui-ws-item .ui-ws-item-icon[data-shape=squircle]{border-radius:22%}.speed-dial-grid .ui-ws-item .ui-ws-item-icon .ui-ws-item-icon-image{block-size:calc(100% - .9rem);filter:drop-shadow(0 1px 3px rgba(0,0,0,.2));inline-size:calc(100% - .9rem);inset:.45rem;object-fit:contain;object-position:center;pointer-events:none;position:absolute;z-index:3}.speed-dial-grid .ui-ws-item .ui-ws-item-icon ui-icon{--icon-size:clamp(1.6rem,60%,2.4rem);--icon-color:var(\n        --on-surface-variant,var(--color-on-surface-variant,var(--on-surface-color,var(--color-on-surface,currentColor)))\n    );aspect-ratio:1/1;block-size:var(--icon-size,1.8rem);color:var(--icon-color,currentColor);filter:drop-shadow(0 1px 2px rgba(0,0,0,.1333333333));inline-size:var(--icon-size,1.8rem);line-height:0;max-block-size:var(--icon-size,1.8rem);max-inline-size:var(--icon-size,1.8rem);min-block-size:fit-content;min-inline-size:fit-content;object-fit:contain;object-position:center;pointer-events:none;z-index:2}.speed-dial-grid .ui-ws-item .ui-ws-item-label{align-items:flex-start;background:transparent;color:var(--on-surface-color,currentColor);display:flex;filter:none;inset-block-start:100%;inset-inline:0;justify-content:center;overflow:visible;padding-block-start:.35rem;pointer-events:none;position:absolute;text-align:center;white-space:nowrap}.speed-dial-grid .ui-ws-item .ui-ws-item-label span{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;border:none;border-radius:6px;box-shadow:none;color:color-mix(in oklab,var(--on-surface-color,currentColor) 90%,transparent);display:inline-flex;font-size:.72rem;font-weight:500;inline-size:max-content;letter-spacing:.01em;line-height:1.25;max-inline-size:min(100%,9rem);overflow:hidden;padding-block:.15rem;padding-inline:.4rem;place-content:center;place-items:center;pointer-events:none;text-align:center;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.4);white-space:nowrap}.speed-dial-grid .ui-ws-item:active{will-change:transform}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving]{cursor:grabbing;transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;transition:none!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onGrab] .ui-ws-item-label,.speed-dial-grid .ui-ws-item[data-interaction-state=onMoving] .ui-ws-item-label{opacity:1;pointer-events:none}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace],.speed-dial-grid .ui-ws-item[data-interaction-state=onRelax]{transform:translate3d(calc(var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px)),calc(var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px)),0)!important;will-change:transform;z-index:5}.speed-dial-grid .ui-ws-item[data-interaction-state=onPlace]{transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1),filter var(--transition-fast) var(--ease-out)!important}.speed-dial-grid .ui-ws-item[data-layer=labels]{filter:none;transition:transform var(--drag-settle-ms,.24s) cubic-bezier(.22,.8,.3,1);z-index:0}.speed-dial-grid .ui-ws-item[data-layer=labels],.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label{background:transparent!important;pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels] .ui-ws-item-label span{pointer-events:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onLabelDocked]{cursor:default;transform:none!important;transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=labels][data-interaction-state=onMoving]{transition:none!important}.speed-dial-grid .ui-ws-item[data-layer=icons]{filter:none;touch-action:none;z-index:4}.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onGrab],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onMoving],.speed-dial-grid .ui-ws-item[data-layer=icons][data-interaction-state=onRelax]{z-index:5}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.35rem,2.8cqh,var(--padding-lg));padding-inline:clamp(.35rem,3.2cqw,var(--padding-lg))}}@container (max-height: 29rem){.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--icons,.speed-dial-root.app-oriented-desktop .speed-dial-grid.app-oriented-desktop__grid--labels{padding-block:clamp(.3rem,2.2cqh,var(--padding-md))}}@container (max-width: 28rem){.speed-dial-root.app-oriented-desktop .ui-ws-item{--tile-size:clamp(2.6rem,11cqmin,4.2rem)}.speed-dial-root.app-oriented-desktop .ui-ws-item .ui-ws-item-icon{padding:.65rem}}.speed-dial-editor{backdrop-filter:blur(8px) saturate(1.05);-webkit-backdrop-filter:blur(8px) saturate(1.05);background:color-mix(in oklab,#020617 58%,transparent);display:grid;inset:0;padding:1rem;place-items:center;pointer-events:auto;position:fixed;z-index:6}.speed-dial-editor__form{background:color-mix(in oklab,var(--color-surface,#0b1220) 88%,#000);border:none;border-radius:18px;box-shadow:0 24px 64px -28px color-mix(in oklab,#000 65%,transparent),0 0 0 1px color-mix(in oklab,var(--color-outline-variant,#334155) 35%,transparent) inset;color:var(--color-on-surface,#e2e8f0);display:grid;grid-template-rows:auto minmax(0,1fr) auto;inline-size:min(100%,980px);margin-inline:auto;max-block-size:min(86vh,760px);overflow:hidden}.speed-dial-editor__form .modal-header{border-block-end:none;box-shadow:0 1px 0 color-mix(in oklab,var(--color-outline-variant,#334155) 28%,transparent);display:grid;gap:.4rem;padding:1rem 1rem .75rem}.speed-dial-editor__form .modal-title{font-size:1.2rem;font-weight:650;line-height:1.25;margin:0}.speed-dial-editor__form .modal-description{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 72%,transparent);font-size:.86rem;line-height:1.35;margin:0}.speed-dial-editor__form .modal-fields{align-content:start;display:grid;gap:.75rem;min-block-size:0;overflow:auto;padding:.9rem 1rem 1rem}.speed-dial-editor__form .modal-field{display:grid;gap:.35rem}.speed-dial-editor__form .modal-field>span{color:color-mix(in oklab,var(--color-on-surface,#e2e8f0) 76%,transparent);font-size:.84rem}.speed-dial-editor__form :is(input,select,textarea){appearance:none;background:color-mix(in oklab,var(--color-surface-container-low,#101827) 88%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 75%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);inline-size:100%;min-inline-size:0;outline:none;padding:.55rem .7rem}.speed-dial-editor__form textarea{min-block-size:4.4rem;resize:vertical}.speed-dial-editor__form :is(input,select,textarea):focus{border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 64%,#fff 8%);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3b82f6) 26%,transparent)}.speed-dial-editor__form .modal-actions{align-items:center;background:color-mix(in oklab,var(--color-surface-container,#172032) 42%,transparent);border-block-start:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 64%,transparent);display:flex;gap:.5rem;justify-content:space-between;padding:.75rem 1rem}.speed-dial-editor__form :is(.modal-actions-left,.modal-actions-right){align-items:center;display:inline-flex;gap:.5rem}.speed-dial-editor__form .btn{background:color-mix(in oklab,var(--color-surface-container,#172032) 62%,transparent);border:1px solid color-mix(in oklab,var(--color-outline-variant,#334155) 72%,transparent);border-radius:8px;color:var(--color-on-surface,#e2e8f0);cursor:pointer;font-size:.86rem;line-height:1.2;padding:.46rem .86rem}.speed-dial-editor__form .btn.secondary{background:color-mix(in oklab,var(--color-surface-container,#172032) 48%,transparent)}.speed-dial-editor__form .btn.save{background:color-mix(in oklab,var(--color-primary,#3b82f6) 40%,#0b1220);border-color:color-mix(in oklab,var(--color-primary,#3b82f6) 60%,transparent);color:#fff}.speed-dial-editor__form .btn.danger{background:color-mix(in oklab,var(--color-error,#ef4444) 28%,#1f0a0a);border-color:color-mix(in oklab,var(--color-error,#ef4444) 64%,transparent);color:#fff}.speed-dial-editor__form .btn:hover{filter:brightness(1.08)}.speed-dial-editor__form [hidden]{display:none!important}@media (max-width:820px){.speed-dial-editor{place-items:center}.speed-dial-editor__form{inline-size:100%;max-block-size:94vh}}}@layer view.home{:root:has([data-view=home]),html:has([data-view=home]){--view-home-bg:linear-gradient(135deg,light-dark(#f8f9fa,#1b1f24),light-dark(#e9ecef,#0f1216));--view-fg:light-dark(#1a1a1a,#e9ecef);--view-border:light-dark(rgba(0,0,0,0.08),rgba(255,255,255,0.12));--view-card-bg:light-dark(#ffffff,#1a1f26);--view-primary:light-dark(#007acc,#66b7ff);--view-layout:\"flex\";--view-padding:var(--space-8);--view-content-max-width:1200px;--view-hero-padding:var(--space-16);--view-card-gap:var(--space-6)}.view-home{align-items:center;background:var(--view-home-bg);block-size:100%;color:var(--view-fg);display:flex;justify-content:center;overflow-y:auto;padding:2rem}.view-home__content{max-inline-size:800px;text-align:center}.view-home__header{margin-block-end:3rem}.view-home__title{background:linear-gradient(135deg,var(--view-primary) 0,light-dark(#0059a6,#3a8ad6) 100%);-webkit-background-clip:text;font-size:3rem;font-weight:800;margin:0;-webkit-text-fill-color:transparent;background-clip:text}.view-home__subtitle{color:var(--view-fg);font-size:1.125rem;margin:.5rem 0 0;opacity:.7}.view-home__actions{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.view-home__action{align-items:center;background-color:var(--view-card-bg);border:1px solid var(--view-border);border-radius:16px;color:var(--view-fg);cursor:pointer;display:flex;flex-direction:column;gap:.75rem;padding:1.5rem;text-align:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.view-home__action ui-icon{color:var(--view-primary);opacity:.8}.view-home__action:hover{border-color:var(--view-primary);box-shadow:0 8px 24px light-dark(rgba(0,0,0,.1),rgba(0,0,0,.4));transform:translateY(-4px)}.view-home__action:hover ui-icon{opacity:1}.view-home__action:focus-visible{outline:2px solid var(--view-primary);outline-offset:2px}.view-home__action-title{font-size:1rem;font-weight:600}.view-home__action-desc{font-size:.8125rem;opacity:.6}.view-home--grid{align-items:stretch;background:transparent;block-size:100%;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:100%;justify-items:stretch;overflow:hidden;padding:0;position:relative}.view-home--grid .speed-dial-root{block-size:100%;inline-size:100%;inset:0;max-block-size:100%;max-inline-size:100%;overflow:hidden;position:absolute}@container (max-width: 768px){.view-home{--view-hero-padding:var(--space-8);--view-card-gap:var(--space-4)}}@container (max-width: 480px){.view-home__actions{grid-template-columns:1fr}}}";
//#endregion
//#region ../../modules/views/home-view/src/ts/OrientBox.ts
var UIOrientBox = class extends DOMMixin {
	constructor(name) {
		super(name);
	}
	connect(ws) {
		const self = ws?.deref?.() ?? ws;
		self.classList.add("ui-orientbox");
		const zoom = numberRef(1), orient = numberRef(orientationNumberMap?.[getCorrectOrientation()] || 0);
		self.style.setProperty("--zoom", zoom.value);
		self.style.setProperty("--orient", orient.value);
		Object.defineProperty(self, "size", { get: () => size });
		Object.defineProperty(self, "zoom", {
			get: () => parseFloat(zoom.value) || 1,
			set: (value) => {
				zoom.value = value;
				self.style.setProperty("--zoom", value);
			}
		});
		Object.defineProperty(self, "orient", {
			get: () => parseInt(orient.value) || 0,
			set: (value) => {
				orient.value = value;
				self.style.setProperty("--orient", value);
			}
		});
		const size = vector2Ref(self.clientWidth, self.clientHeight);
		new ResizeObserver((entries) => {
			for (const entry of entries) if (entry?.contentBoxSize) {
				const contentBoxSize = entry?.contentBoxSize?.[0];
				size.x.value = contentBoxSize?.inlineSize || size.x.value || 0;
				size.y.value = contentBoxSize?.blockSize || size.y.value || 0;
			}
		}).observe(self, { box: "content-box" });
		elementPointerMap.set(self, {
			pointerMap: /* @__PURE__ */ new Map(),
			pointerCache: /* @__PURE__ */ new Map()
		});
		return this;
	}
};
new UIOrientBox("ui-orientbox");
//#endregion
//#region ../../node_modules/culori/src/rgb/parseNumber.js
var parseNumber = (color, len) => {
	if (typeof color !== "number") return;
	if (len === 3) return {
		mode: "rgb",
		r: (color >> 8 & 15 | color >> 4 & 240) / 255,
		g: (color >> 4 & 15 | color & 240) / 255,
		b: (color & 15 | color << 4 & 240) / 255
	};
	if (len === 4) return {
		mode: "rgb",
		r: (color >> 12 & 15 | color >> 8 & 240) / 255,
		g: (color >> 8 & 15 | color >> 4 & 240) / 255,
		b: (color >> 4 & 15 | color & 240) / 255,
		alpha: (color & 15 | color << 4 & 240) / 255
	};
	if (len === 6) return {
		mode: "rgb",
		r: (color >> 16 & 255) / 255,
		g: (color >> 8 & 255) / 255,
		b: (color & 255) / 255
	};
	if (len === 8) return {
		mode: "rgb",
		r: (color >> 24 & 255) / 255,
		g: (color >> 16 & 255) / 255,
		b: (color >> 8 & 255) / 255,
		alpha: (color & 255) / 255
	};
};
//#endregion
//#region ../../node_modules/culori/src/colors/named.js
var named = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseNamed.js
var parseNamed = (color) => {
	return parseNumber(named[color.toLowerCase()], 6);
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseHex.js
var hex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
var parseHex = (color) => {
	let match;
	return (match = color.match(hex)) ? parseNumber(parseInt(match[1], 16), match[1].length) : void 0;
};
//#endregion
//#region ../../node_modules/culori/src/util/regex.js
var num$1 = "([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)";
`${num$1}`;
var per = `${num$1}%`;
`${num$1}`;
var num_per = `(?:${num$1}%|${num$1})`;
var num_per_none = `(?:${num$1}%|${num$1}|none)`;
var hue$1 = `(?:${num$1}(deg|grad|rad|turn)|${num$1})`;
`${num$1}${num$1}`;
var c = `\\s*,\\s*`;
new RegExp("^" + num_per_none + "$");
//#endregion
//#region ../../node_modules/culori/src/rgb/parseRgbLegacy.js
var rgb_num_old = new RegExp(`^rgba?\\(\\s*${num$1}${c}${num$1}${c}${num$1}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
var rgb_per_old = new RegExp(`^rgba?\\(\\s*${per}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
var parseRgbLegacy = (color) => {
	let res = { mode: "rgb" };
	let match;
	if (match = color.match(rgb_num_old)) {
		if (match[1] !== void 0) res.r = match[1] / 255;
		if (match[2] !== void 0) res.g = match[2] / 255;
		if (match[3] !== void 0) res.b = match[3] / 255;
	} else if (match = color.match(rgb_per_old)) {
		if (match[1] !== void 0) res.r = match[1] / 100;
		if (match[2] !== void 0) res.g = match[2] / 100;
		if (match[3] !== void 0) res.b = match[3] / 100;
	} else return;
	if (match[4] !== void 0) res.alpha = Math.max(0, Math.min(1, match[4] / 100));
	else if (match[5] !== void 0) res.alpha = Math.max(0, Math.min(1, +match[5]));
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/_prepare.js
var prepare = (color, mode) => color === void 0 ? void 0 : typeof color !== "object" ? parse(color) : color.mode !== void 0 ? color : mode ? {
	...color,
	mode
} : void 0;
//#endregion
//#region ../../node_modules/culori/src/converter.js
var converter = (target_mode = "rgb") => (color) => (color = prepare(color, target_mode)) !== void 0 ? color.mode === target_mode ? color : converters[color.mode][target_mode] ? converters[color.mode][target_mode](color) : target_mode === "rgb" ? converters[color.mode].rgb(color) : converters.rgb[target_mode](converters[color.mode].rgb(color)) : void 0;
//#endregion
//#region ../../node_modules/culori/src/modes.js
var converters = {};
var modes = {};
var parsers = [];
var colorProfiles = {};
var identity = (v) => v;
var useMode = (definition) => {
	converters[definition.mode] = {
		...converters[definition.mode],
		...definition.toMode
	};
	Object.keys(definition.fromMode || {}).forEach((k) => {
		if (!converters[k]) converters[k] = {};
		converters[k][definition.mode] = definition.fromMode[k];
	});
	if (!definition.ranges) definition.ranges = {};
	if (!definition.difference) definition.difference = {};
	definition.channels.forEach((channel) => {
		if (definition.ranges[channel] === void 0) definition.ranges[channel] = [0, 1];
		if (!definition.interpolate[channel]) throw new Error(`Missing interpolator for: ${channel}`);
		if (typeof definition.interpolate[channel] === "function") definition.interpolate[channel] = { use: definition.interpolate[channel] };
		if (!definition.interpolate[channel].fixup) definition.interpolate[channel].fixup = identity;
	});
	modes[definition.mode] = definition;
	(definition.parse || []).forEach((parser) => {
		useParser(parser, definition.mode);
	});
	return converter(definition.mode);
};
var getMode = (mode) => modes[mode];
var useParser = (parser, mode) => {
	if (typeof parser === "string") {
		if (!mode) throw new Error(`'mode' required when 'parser' is a string`);
		colorProfiles[parser] = mode;
	} else if (typeof parser === "function") {
		if (parsers.indexOf(parser) < 0) parsers.push(parser);
	}
};
//#endregion
//#region ../../node_modules/culori/src/parse.js
var IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;
var IdentCodePoint = /[^\x00-\x7F]|[-\w]/;
var Tok = {
	Function: "function",
	Ident: "ident",
	Number: "number",
	Percentage: "percentage",
	ParenClose: ")",
	None: "none",
	Hue: "hue",
	Alpha: "alpha"
};
var _i = 0;
function is_num(chars) {
	let ch = chars[_i];
	let ch1 = chars[_i + 1];
	if (ch === "-" || ch === "+") return /\d/.test(ch1) || ch1 === "." && /\d/.test(chars[_i + 2]);
	if (ch === ".") return /\d/.test(ch1);
	return /\d/.test(ch);
}
function is_ident(chars) {
	if (_i >= chars.length) return false;
	let ch = chars[_i];
	if (IdentStartCodePoint.test(ch)) return true;
	if (ch === "-") {
		if (chars.length - _i < 2) return false;
		let ch1 = chars[_i + 1];
		if (ch1 === "-" || IdentStartCodePoint.test(ch1)) return true;
		return false;
	}
	return false;
}
var huenits = {
	deg: 1,
	rad: 180 / Math.PI,
	grad: 9 / 10,
	turn: 360
};
function num(chars) {
	let value = "";
	if (chars[_i] === "-" || chars[_i] === "+") value += chars[_i++];
	value += digits(chars);
	if (chars[_i] === "." && /\d/.test(chars[_i + 1])) value += chars[_i++] + digits(chars);
	if (chars[_i] === "e" || chars[_i] === "E") {
		if ((chars[_i + 1] === "-" || chars[_i + 1] === "+") && /\d/.test(chars[_i + 2])) value += chars[_i++] + chars[_i++] + digits(chars);
		else if (/\d/.test(chars[_i + 1])) value += chars[_i++] + digits(chars);
	}
	if (is_ident(chars)) {
		let id = ident(chars);
		if (id === "deg" || id === "rad" || id === "turn" || id === "grad") return {
			type: Tok.Hue,
			value: value * huenits[id]
		};
		return;
	}
	if (chars[_i] === "%") {
		_i++;
		return {
			type: Tok.Percentage,
			value: +value
		};
	}
	return {
		type: Tok.Number,
		value: +value
	};
}
function digits(chars) {
	let v = "";
	while (/\d/.test(chars[_i])) v += chars[_i++];
	return v;
}
function ident(chars) {
	let v = "";
	while (_i < chars.length && IdentCodePoint.test(chars[_i])) v += chars[_i++];
	return v;
}
function identlike(chars) {
	let v = ident(chars);
	if (chars[_i] === "(") {
		_i++;
		return {
			type: Tok.Function,
			value: v
		};
	}
	if (v === "none") return {
		type: Tok.None,
		value: void 0
	};
	return {
		type: Tok.Ident,
		value: v
	};
}
function tokenize(str = "") {
	let chars = str.trim();
	let tokens = [];
	let ch;
	_i = 0;
	while (_i < chars.length) {
		ch = chars[_i++];
		if (ch === "\n" || ch === "	" || ch === " ") {
			while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) _i++;
			continue;
		}
		if (ch === ",") return;
		if (ch === ")") {
			tokens.push({ type: Tok.ParenClose });
			continue;
		}
		if (ch === "+") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return;
		}
		if (ch === "-") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			if (is_ident(chars)) {
				tokens.push({
					type: Tok.Ident,
					value: ident(chars)
				});
				continue;
			}
			return;
		}
		if (ch === ".") {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return;
		}
		if (ch === "/") {
			while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) _i++;
			let alpha;
			if (is_num(chars)) {
				alpha = num(chars);
				if (alpha.type !== Tok.Hue) {
					tokens.push({
						type: Tok.Alpha,
						value: alpha
					});
					continue;
				}
			}
			if (is_ident(chars)) {
				if (ident(chars) === "none") {
					tokens.push({
						type: Tok.Alpha,
						value: {
							type: Tok.None,
							value: void 0
						}
					});
					continue;
				}
			}
			return;
		}
		if (/\d/.test(ch)) {
			_i--;
			tokens.push(num(chars));
			continue;
		}
		if (IdentStartCodePoint.test(ch)) {
			_i--;
			tokens.push(identlike(chars));
			continue;
		}
		return;
	}
	return tokens;
}
function parseColorSyntax(tokens) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function || token.value !== "color") return;
	token = tokens[tokens._i++];
	if (token.type !== Tok.Ident) return;
	const mode = colorProfiles[token.value];
	if (!mode) return;
	const res = { mode };
	const coords = consumeCoords(tokens, false);
	if (!coords) return;
	const channels = getMode(mode).channels;
	for (let ii = 0, c, ch; ii < channels.length; ii++) {
		c = coords[ii];
		ch = channels[ii];
		if (c.type !== Tok.None) {
			res[ch] = c.type === Tok.Number ? c.value : c.value / 100;
			if (ch === "alpha") res[ch] = Math.max(0, Math.min(1, res[ch]));
		}
	}
	return res;
}
function consumeCoords(tokens, includeHue) {
	const coords = [];
	let token;
	while (tokens._i < tokens.length) {
		token = tokens[tokens._i++];
		if (token.type === Tok.None || token.type === Tok.Number || token.type === Tok.Alpha || token.type === Tok.Percentage || includeHue && token.type === Tok.Hue) {
			coords.push(token);
			continue;
		}
		if (token.type === Tok.ParenClose) {
			if (tokens._i < tokens.length) return;
			continue;
		}
		return;
	}
	if (coords.length < 3 || coords.length > 4) return;
	if (coords.length === 4) {
		if (coords[3].type !== Tok.Alpha) return;
		coords[3] = coords[3].value;
	}
	if (coords.length === 3) coords.push({
		type: Tok.None,
		value: void 0
	});
	return coords.every((c) => c.type !== Tok.Alpha) ? coords : void 0;
}
function parseModernSyntax(tokens, includeHue) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function) return;
	let coords = consumeCoords(tokens, includeHue);
	if (!coords) return;
	coords.unshift(token.value);
	return coords;
}
var parse = (color) => {
	if (typeof color !== "string") return;
	const tokens = tokenize(color);
	const parsed = tokens ? parseModernSyntax(tokens, true) : void 0;
	let result = void 0;
	let i = 0;
	let len = parsers.length;
	while (i < len) if ((result = parsers[i++](color, parsed)) !== void 0) return result;
	return tokens ? parseColorSyntax(tokens) : void 0;
};
//#endregion
//#region ../../node_modules/culori/src/rgb/parseRgb.js
function parseRgb(color, parsed) {
	if (!parsed || parsed[0] !== "rgb" && parsed[0] !== "rgba") return;
	const res = { mode: "rgb" };
	const [, r, g, b, alpha] = parsed;
	if (r.type === Tok.Hue || g.type === Tok.Hue || b.type === Tok.Hue) return;
	if (r.type !== Tok.None) res.r = r.type === Tok.Number ? r.value / 255 : r.value / 100;
	if (g.type !== Tok.None) res.g = g.type === Tok.Number ? g.value / 255 : g.value / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value / 255 : b.value / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/rgb/parseTransparent.js
var parseTransparent = (c) => c === "transparent" ? {
	mode: "rgb",
	r: 0,
	g: 0,
	b: 0,
	alpha: 0
} : void 0;
//#endregion
//#region ../../node_modules/culori/src/interpolate/lerp.js
var lerp = (a, b, t) => a + t * (b - a);
//#endregion
//#region ../../node_modules/culori/src/interpolate/piecewise.js
var get_classes = (arr) => {
	let classes = [];
	for (let i = 0; i < arr.length - 1; i++) {
		let a = arr[i];
		let b = arr[i + 1];
		if (a === void 0 && b === void 0) classes.push(void 0);
		else if (a !== void 0 && b !== void 0) classes.push([a, b]);
		else classes.push(a !== void 0 ? [a, a] : [b, b]);
	}
	return classes;
};
var interpolatorPiecewise = (interpolator) => (arr) => {
	let classes = get_classes(arr);
	return (t) => {
		let cls = t * classes.length;
		let idx = t >= 1 ? classes.length - 1 : Math.max(Math.floor(cls), 0);
		let pair = classes[idx];
		return pair === void 0 ? void 0 : interpolator(pair[0], pair[1], cls - idx);
	};
};
//#endregion
//#region ../../node_modules/culori/src/interpolate/linear.js
var interpolatorLinear = interpolatorPiecewise(lerp);
//#endregion
//#region ../../node_modules/culori/src/fixup/alpha.js
var fixupAlpha = (arr) => {
	let some_defined = false;
	let res = arr.map((v) => {
		if (v !== void 0) {
			some_defined = true;
			return v;
		}
		return 1;
	});
	return some_defined ? res : arr;
};
//#endregion
//#region ../../node_modules/culori/src/rgb/definition.js
var definition$27 = {
	mode: "rgb",
	channels: [
		"r",
		"g",
		"b",
		"alpha"
	],
	parse: [
		parseRgb,
		parseHex,
		parseRgbLegacy,
		parseNamed,
		parseTransparent,
		"srgb"
	],
	serialize: "srgb",
	interpolate: {
		r: interpolatorLinear,
		g: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	gamut: true,
	white: {
		r: 1,
		g: 1,
		b: 1
	},
	black: {
		r: 0,
		g: 0,
		b: 0
	}
};
//#endregion
//#region ../../node_modules/culori/src/a98/convertA98ToXyz65.js
var linearize$2 = (v = 0) => Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);
var convertA98ToXyz65 = (a98) => {
	let r = linearize$2(a98.r);
	let g = linearize$2(a98.g);
	let b = linearize$2(a98.b);
	let res = {
		mode: "xyz65",
		x: .5766690429101305 * r + .1855582379065463 * g + .1882286462349947 * b,
		y: .297344975250536 * r + .6273635662554661 * g + .0752914584939979 * b,
		z: .0270313613864123 * r + .0706888525358272 * g + .9913375368376386 * b
	};
	if (a98.alpha !== void 0) res.alpha = a98.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/a98/convertXyz65ToA98.js
var gamma$2 = (v) => Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);
var convertXyz65ToA98 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "a98",
		r: gamma$2(x * 2.0415879038107465 - y * .5650069742788597 - .3447313507783297 * z),
		g: gamma$2(x * -.9692436362808798 + y * 1.8759675015077206 + .0415550574071756 * z),
		b: gamma$2(x * .0134442806320312 - y * .1183623922310184 + 1.0151749943912058 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/convertRgbToLrgb.js
var fn$3 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs <= .04045) return c / 12.92;
	return (Math.sign(c) || 1) * Math.pow((abs + .055) / 1.055, 2.4);
};
var convertRgbToLrgb = ({ r, g, b, alpha }) => {
	let res = {
		mode: "lrgb",
		r: fn$3(r),
		g: fn$3(g),
		b: fn$3(b)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertRgbToXyz65.js
var convertRgbToXyz65 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz65",
		x: .4123907992659593 * r + .357584339383878 * g + .1804807884018343 * b,
		y: .2126390058715102 * r + .715168678767756 * g + .0721923153607337 * b,
		z: .0193308187155918 * r + .119194779794626 * g + .9505321522496607 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/convertLrgbToRgb.js
var fn$2 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs > .0031308) return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - .055);
	return c * 12.92;
};
var convertLrgbToRgb = ({ r, g, b, alpha }, mode = "rgb") => {
	let res = {
		mode,
		r: fn$2(r),
		g: fn$2(g),
		b: fn$2(b)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz65ToRgb.js
var convertXyz65ToRgb = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 3.2409699419045226 - y * 1.537383177570094 - .4986107602930034 * z,
		g: x * -.9692436362808796 + y * 1.8759675015077204 + .0415550574071756 * z,
		b: x * .0556300796969936 - y * .2039769588889765 + 1.0569715142428784 * z
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/a98/definition.js
var definition$26 = {
	...definition$27,
	mode: "a98",
	parse: ["a98-rgb"],
	serialize: "a98-rgb",
	fromMode: {
		rgb: (color) => convertXyz65ToA98(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToA98
	},
	toMode: {
		rgb: (color) => convertXyz65ToRgb(convertA98ToXyz65(color)),
		xyz65: convertA98ToXyz65
	}
};
//#endregion
//#region ../../node_modules/culori/src/util/normalizeHue.js
var normalizeHue = (hue) => (hue = hue % 360) < 0 ? hue + 360 : hue;
//#endregion
//#region ../../node_modules/culori/src/fixup/hue.js
var hue = (hues, fn) => {
	return hues.map((hue, idx, arr) => {
		if (hue === void 0) return hue;
		let normalized = normalizeHue(hue);
		if (idx === 0 || hues[idx - 1] === void 0) return normalized;
		return fn(normalized - normalizeHue(arr[idx - 1]));
	}).reduce((acc, curr) => {
		if (!acc.length || curr === void 0 || acc[acc.length - 1] === void 0) {
			acc.push(curr);
			return acc;
		}
		acc.push(curr + acc[acc.length - 1]);
		return acc;
	}, []);
};
var fixupHueShorter = (arr) => hue(arr, (d) => Math.abs(d) <= 180 ? d : d - 360 * Math.sign(d));
//#endregion
//#region ../../node_modules/culori/src/cubehelix/constants.js
var M = [
	-.14861,
	1.78277,
	-.29227,
	-.90649,
	1.97294,
	0
];
var degToRad = Math.PI / 180;
var radToDeg = 180 / Math.PI;
//#endregion
//#region ../../node_modules/culori/src/cubehelix/convertRgbToCubehelix.js
var DE = M[3] * M[4];
var BE = M[1] * M[4];
var BCAD = M[1] * M[2] - M[0] * M[3];
var convertRgbToCubehelix = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let l = (BCAD * b + r * DE - g * BE) / (BCAD + DE - BE);
	let x = b - l;
	let y = (M[4] * (g - l) - M[2] * x) / M[3];
	let res = {
		mode: "cubehelix",
		l,
		s: l === 0 || l === 1 ? void 0 : Math.sqrt(x * x + y * y) / (M[4] * l * (1 - l))
	};
	if (res.s) res.h = Math.atan2(y, x) * radToDeg - 120;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/cubehelix/convertCubehelixToRgb.js
var convertCubehelixToRgb = ({ h, s, l, alpha }) => {
	let res = { mode: "rgb" };
	h = (h === void 0 ? 0 : h + 120) * degToRad;
	if (l === void 0) l = 0;
	let amp = s === void 0 ? 0 : s * l * (1 - l);
	let cosh = Math.cos(h);
	let sinh = Math.sin(h);
	res.r = l + amp * (M[0] * cosh + M[1] * sinh);
	res.g = l + amp * (M[2] * cosh + M[3] * sinh);
	res.b = l + amp * (M[4] * cosh + M[5] * sinh);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/difference.js
var differenceHueSaturation = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0 || !std.s || !smp.s) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(std.s * smp.s) * dH;
};
var differenceHueNaive = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	if (Math.abs(smp_h - std_h) > 180) return std_h - (smp_h - 360 * Math.sign(smp_h - std_h));
	return smp_h - std_h;
};
var differenceHueChroma = (std, smp) => {
	if (std.h === void 0 || smp.h === void 0 || !std.c || !smp.c) return 0;
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
	return 2 * Math.sqrt(std.c * smp.c) * dH;
};
//#endregion
//#region ../../node_modules/culori/src/average.js
var averageAngle = (val) => {
	let sum = val.reduce((sum, val) => {
		if (val !== void 0) {
			let rad = val * Math.PI / 180;
			sum.sin += Math.sin(rad);
			sum.cos += Math.cos(rad);
		}
		return sum;
	}, {
		sin: 0,
		cos: 0
	});
	let angle = Math.atan2(sum.sin, sum.cos) * 180 / Math.PI;
	return angle < 0 ? 360 + angle : angle;
};
//#endregion
//#region ../../node_modules/culori/src/cubehelix/definition.js
var definition$25 = {
	mode: "cubehelix",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--cubehelix"],
	serialize: "--cubehelix",
	ranges: {
		h: [0, 360],
		s: [0, 4.614],
		l: [0, 1]
	},
	fromMode: { rgb: convertRgbToCubehelix },
	toMode: { rgb: convertCubehelixToRgb },
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lch/convertLabToLch.js
var convertLabToLch = ({ l, a, b, alpha }, mode = "lch") => {
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = {
		mode,
		l,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lch/convertLchToLab.js
var convertLchToLab = ({ l, c, h, alpha }, mode = "lab") => {
	if (h === void 0) h = 0;
	let res = {
		mode,
		l,
		a: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		b: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/constants.js
var k$2 = Math.pow(29, 3) / Math.pow(3, 3);
var e$2 = Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/constants.js
var D50 = {
	X: .3457 / .3585,
	Y: 1,
	Z: .2958 / .3585
};
var D65 = {
	X: .3127 / .329,
	Y: 1,
	Z: .3583 / .329
};
Math.pow(29, 3) / Math.pow(3, 3);
Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/lab65/convertLab65ToXyz65.js
var fn$1 = (v) => Math.pow(v, 3) > e$2 ? Math.pow(v, 3) : (116 * v - 16) / k$2;
var convertLab65ToXyz65 = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;
	let res = {
		mode: "xyz65",
		x: fn$1(fx) * D65.X,
		y: fn$1(fy) * D65.Y,
		z: fn$1(fz) * D65.Z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab65/convertLab65ToRgb.js
var convertLab65ToRgb = (lab) => convertXyz65ToRgb(convertLab65ToXyz65(lab));
//#endregion
//#region ../../node_modules/culori/src/lab65/convertXyz65ToLab65.js
var f$1 = (value) => value > e$2 ? Math.cbrt(value) : (k$2 * value + 16) / 116;
var convertXyz65ToLab65 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let f0 = f$1(x / D65.X);
	let f1 = f$1(y / D65.Y);
	let f2 = f$1(z / D65.Z);
	let res = {
		mode: "lab65",
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab65/convertRgbToLab65.js
var convertRgbToLab65 = (rgb) => {
	let res = convertXyz65ToLab65(convertRgbToXyz65(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlch/constants.js
var θ = 26 / 180 * Math.PI;
var cosθ = Math.cos(θ);
var sinθ = Math.sin(θ);
var factor = 100 / Math.log(139 / 100);
//#endregion
//#region ../../node_modules/culori/src/dlch/convertDlchToLab65.js
var convertDlchToLab65 = ({ l, c, h, alpha }) => {
	if (l === void 0) l = 0;
	if (c === void 0) c = 0;
	if (h === void 0) h = 0;
	let res = {
		mode: "lab65",
		l: (Math.exp(l * 1 / factor) - 1) / .0039
	};
	let G = (Math.exp(.0435 * c * 1 * 1) - 1) / .075;
	let e = G * Math.cos(h / 180 * Math.PI - θ);
	let f = G * Math.sin(h / 180 * Math.PI - θ);
	res.a = e * cosθ - f / .83 * sinθ;
	res.b = e * sinθ + f / .83 * cosθ;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlch/convertLab65ToDlch.js
var convertLab65ToDlch = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let e = a * cosθ + b * sinθ;
	let f = .83 * (b * cosθ - a * sinθ);
	let G = Math.sqrt(e * e + f * f);
	let res = {
		mode: "dlch",
		l: factor / 1 * Math.log(1 + .0039 * l),
		c: Math.log(1 + .075 * G) / (.0435 * 1 * 1)
	};
	if (res.c) res.h = normalizeHue((Math.atan2(f, e) + θ) / Math.PI * 180);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/dlab/definition.js
var convertDlabToLab65 = (c) => convertDlchToLab65(convertLabToLch(c, "dlch"));
var convertLab65ToDlab = (c) => convertLchToLab(convertLab65ToDlch(c), "dlab");
var definition$24 = {
	mode: "dlab",
	parse: ["--din99o-lab"],
	serialize: "--din99o-lab",
	toMode: {
		lab65: convertDlabToLab65,
		rgb: (c) => convertLab65ToRgb(convertDlabToLab65(c))
	},
	fromMode: {
		lab65: convertLab65ToDlab,
		rgb: (c) => convertLab65ToDlab(convertRgbToLab65(c))
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-40.09, 45.501],
		b: [-40.469, 44.344]
	},
	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/dlch/definition.js
var definition$23 = {
	mode: "dlch",
	parse: ["--din99o-lch"],
	serialize: "--din99o-lch",
	toMode: {
		lab65: convertDlchToLab65,
		dlab: (c) => convertLchToLab(c, "dlab"),
		rgb: (c) => convertLab65ToRgb(convertDlchToLab65(c))
	},
	fromMode: {
		lab65: convertLab65ToDlch,
		dlab: (c) => convertLabToLch(c, "dlch"),
		rgb: (c) => convertLab65ToDlch(convertRgbToLab65(c))
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 51.484],
		h: [0, 360]
	},
	interpolate: {
		l: interpolatorLinear,
		c: interpolatorLinear,
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsi/convertHsiToRgb.js
function convertHsiToRgb({ h, s, i, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (i === void 0) i = 0;
	let f = Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 1:
			res = {
				r: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 2:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 + s * (3 * (1 - f) / (2 - f) - 1))
			};
			break;
		case 3:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 4:
			res = {
				r: i * (1 + s * (3 * (1 - f) / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 5:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * (3 * (1 - f) / (2 - f) - 1))
			};
			break;
		default: res = {
			r: i * (1 - s),
			g: i * (1 - s),
			b: i * (1 - s)
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsi/convertRgbToHsi.js
function convertRgbToHsi({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsi",
		s: r + g + b === 0 ? 0 : 1 - 3 * m / (r + g + b),
		i: (r + g + b) / 3
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsi/definition.js
var definition$22 = {
	mode: "hsi",
	toMode: { rgb: convertHsiToRgb },
	parse: ["--hsi"],
	serialize: "--hsi",
	fromMode: { rgb: convertRgbToHsi },
	channels: [
		"h",
		"s",
		"i",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		i: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsl/convertHslToRgb.js
function convertHslToRgb({ h, s, l, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (l === void 0) l = 0;
	let m1 = l + s * (l < .5 ? l : 1 - l);
	let m2 = m1 - (m1 - l) * 2 * Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: m1,
				g: m2,
				b: 2 * l - m1
			};
			break;
		case 1:
			res = {
				r: m2,
				g: m1,
				b: 2 * l - m1
			};
			break;
		case 2:
			res = {
				r: 2 * l - m1,
				g: m1,
				b: m2
			};
			break;
		case 3:
			res = {
				r: 2 * l - m1,
				g: m2,
				b: m1
			};
			break;
		case 4:
			res = {
				r: m2,
				g: 2 * l - m1,
				b: m1
			};
			break;
		case 5:
			res = {
				r: m1,
				g: 2 * l - m1,
				b: m2
			};
			break;
		default: res = {
			r: 2 * l - m1,
			g: 2 * l - m1,
			b: 2 * l - m1
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsl/convertRgbToHsl.js
function convertRgbToHsl({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsl",
		s: M === m ? 0 : (M - m) / (1 - Math.abs(M + m - 1)),
		l: .5 * (M + m)
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/util/hue.js
var hueToDeg = (val, unit) => {
	switch (unit) {
		case "deg": return +val;
		case "rad": return val / Math.PI * 180;
		case "grad": return val / 10 * 9;
		case "turn": return val * 360;
	}
};
//#endregion
//#region ../../node_modules/culori/src/hsl/parseHslLegacy.js
var hsl_old = new RegExp(`^hsla?\\(\\s*${hue$1}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`);
var parseHslLegacy = (color) => {
	let match = color.match(hsl_old);
	if (!match) return;
	let res = { mode: "hsl" };
	if (match[3] !== void 0) res.h = +match[3];
	else if (match[1] !== void 0 && match[2] !== void 0) res.h = hueToDeg(match[1], match[2]);
	if (match[4] !== void 0) res.s = Math.min(Math.max(0, match[4] / 100), 1);
	if (match[5] !== void 0) res.l = Math.min(Math.max(0, match[5] / 100), 1);
	if (match[6] !== void 0) res.alpha = Math.max(0, Math.min(1, match[6] / 100));
	else if (match[7] !== void 0) res.alpha = Math.max(0, Math.min(1, +match[7]));
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/hsl/parseHsl.js
function parseHsl(color, parsed) {
	if (!parsed || parsed[0] !== "hsl" && parsed[0] !== "hsla") return;
	const res = { mode: "hsl" };
	const [, h, s, l, alpha] = parsed;
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (s.type !== Tok.None) {
		if (s.type === Tok.Hue) return;
		res.s = s.value / 100;
	}
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = l.value / 100;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsl/definition.js
var definition$21 = {
	mode: "hsl",
	toMode: { rgb: convertHslToRgb },
	fromMode: { rgb: convertRgbToHsl },
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [parseHsl, parseHslLegacy],
	serialize: (c) => `hsl(${c.h !== void 0 ? c.h : "none"} ${c.s !== void 0 ? c.s * 100 + "%" : "none"} ${c.l !== void 0 ? c.l * 100 + "%" : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hsv/convertHsvToRgb.js
function convertHsvToRgb({ h, s, v, alpha }) {
	h = normalizeHue(h !== void 0 ? h : 0);
	if (s === void 0) s = 0;
	if (v === void 0) v = 0;
	let f = Math.abs(h / 60 % 2 - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: v,
				g: v * (1 - s * f),
				b: v * (1 - s)
			};
			break;
		case 1:
			res = {
				r: v * (1 - s * f),
				g: v,
				b: v * (1 - s)
			};
			break;
		case 2:
			res = {
				r: v * (1 - s),
				g: v,
				b: v * (1 - s * f)
			};
			break;
		case 3:
			res = {
				r: v * (1 - s),
				g: v * (1 - s * f),
				b: v
			};
			break;
		case 4:
			res = {
				r: v * (1 - s * f),
				g: v * (1 - s),
				b: v
			};
			break;
		case 5:
			res = {
				r: v,
				g: v * (1 - s),
				b: v * (1 - s * f)
			};
			break;
		default: res = {
			r: v * (1 - s),
			g: v * (1 - s),
			b: v * (1 - s)
		};
	}
	res.mode = "rgb";
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsv/convertRgbToHsv.js
function convertRgbToHsv({ r, g, b, alpha }) {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let M = Math.max(r, g, b), m = Math.min(r, g, b);
	let res = {
		mode: "hsv",
		s: M === 0 ? 0 : 1 - m / M,
		v: M
	};
	if (M - m !== 0) res.h = (M === r ? (g - b) / (M - m) + (g < b) * 6 : M === g ? (b - r) / (M - m) + 2 : (r - g) / (M - m) + 4) * 60;
	if (alpha !== void 0) res.alpha = alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hsv/definition.js
var definition$20 = {
	mode: "hsv",
	toMode: { rgb: convertHsvToRgb },
	parse: ["--hsv"],
	serialize: "--hsv",
	fromMode: { rgb: convertRgbToHsv },
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		s: interpolatorLinear,
		v: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueSaturation },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hwb/convertHwbToRgb.js
function convertHwbToRgb({ h, w, b, alpha }) {
	if (w === void 0) w = 0;
	if (b === void 0) b = 0;
	if (w + b > 1) {
		let s = w + b;
		w /= s;
		b /= s;
	}
	return convertHsvToRgb({
		h,
		s: b === 1 ? 1 : 1 - w / (1 - b),
		v: 1 - b,
		alpha
	});
}
//#endregion
//#region ../../node_modules/culori/src/hwb/convertRgbToHwb.js
function convertRgbToHwb(rgba) {
	let hsv = convertRgbToHsv(rgba);
	if (hsv === void 0) return void 0;
	let s = hsv.s !== void 0 ? hsv.s : 0;
	let v = hsv.v !== void 0 ? hsv.v : 0;
	let res = {
		mode: "hwb",
		w: (1 - s) * v,
		b: 1 - v
	};
	if (hsv.h !== void 0) res.h = hsv.h;
	if (hsv.alpha !== void 0) res.alpha = hsv.alpha;
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hwb/parseHwb.js
function ParseHwb(color, parsed) {
	if (!parsed || parsed[0] !== "hwb") return;
	const res = { mode: "hwb" };
	const [, h, w, b, alpha] = parsed;
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (w.type !== Tok.None) {
		if (w.type === Tok.Hue) return;
		res.w = w.value / 100;
	}
	if (b.type !== Tok.None) {
		if (b.type === Tok.Hue) return;
		res.b = b.value / 100;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/hwb/definition.js
var definition$19 = {
	mode: "hwb",
	toMode: { rgb: convertHwbToRgb },
	fromMode: { rgb: convertRgbToHwb },
	channels: [
		"h",
		"w",
		"b",
		"alpha"
	],
	ranges: { h: [0, 360] },
	gamut: "rgb",
	parse: [ParseHwb],
	serialize: (c) => `hwb(${c.h !== void 0 ? c.h : "none"} ${c.w !== void 0 ? c.w * 100 + "%" : "none"} ${c.b !== void 0 ? c.b * 100 + "%" : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		w: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueNaive },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/hdr/transfer.js
var M1 = .1593017578125;
var M2 = 78.84375;
var C1 = .8359375;
var C2 = 18.8515625;
var C3 = 18.6875;
function transferPqDecode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v, 1 / M2);
	return 1e4 * Math.pow(Math.max(0, c - C1) / (C2 - C3 * c), 1 / M1);
}
function transferPqEncode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v / 1e4, M1);
	return Math.pow((C1 + C2 * c) / (1 + C3 * c), M2);
}
//#endregion
//#region ../../node_modules/culori/src/itp/convertItpToXyz65.js
var toRel = (c) => Math.max(c / 203, 0);
var convertItpToXyz65 = ({ i, t, p, alpha }) => {
	if (i === void 0) i = 0;
	if (t === void 0) t = 0;
	if (p === void 0) p = 0;
	const l = transferPqDecode(i + .008609037037932761 * t + .11102962500302593 * p);
	const m = transferPqDecode(i - .00860903703793275 * t - .11102962500302599 * p);
	const s = transferPqDecode(i + .5600313357106791 * t - .32062717498731885 * p);
	const res = {
		mode: "xyz65",
		x: toRel(2.070152218389422 * l - 1.3263473389671556 * m + .2066510476294051 * s),
		y: toRel(.3647385209748074 * l + .680566024947227 * m - .0453045459220346 * s),
		z: toRel(-.049747207535812 * l - .0492609666966138 * m + 1.1880659249923042 * s)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/itp/convertXyz65ToItp.js
var toAbs = (c = 0) => Math.max(c * 203, 0);
var convertXyz65ToItp = ({ x, y, z, alpha }) => {
	const absX = toAbs(x);
	const absY = toAbs(y);
	const absZ = toAbs(z);
	const l = transferPqEncode(.3592832590121217 * absX + .6976051147779502 * absY - .0358915932320289 * absZ);
	const m = transferPqEncode(-.1920808463704995 * absX + 1.1004767970374323 * absY + .0753748658519118 * absZ);
	const s = transferPqEncode(.0070797844607477 * absX + .0748396662186366 * absY + .8433265453898765 * absZ);
	const res = {
		mode: "itp",
		i: .5 * l + .5 * m,
		t: 1.61376953125 * l - 3.323486328125 * m + 1.709716796875 * s,
		p: 4.378173828125 * l - 4.24560546875 * m - .132568359375 * s
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/itp/definition.js
var definition$18 = {
	mode: "itp",
	channels: [
		"i",
		"t",
		"p",
		"alpha"
	],
	parse: ["--ictcp"],
	serialize: "--ictcp",
	toMode: {
		xyz65: convertItpToXyz65,
		rgb: (color) => convertXyz65ToRgb(convertItpToXyz65(color))
	},
	fromMode: {
		xyz65: convertXyz65ToItp,
		rgb: (color) => convertXyz65ToItp(convertRgbToXyz65(color))
	},
	ranges: {
		i: [0, .581],
		t: [-.369, .272],
		p: [-.164, .331]
	},
	interpolate: {
		i: interpolatorLinear,
		t: interpolatorLinear,
		p: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertXyz65ToJab.js
var p$1 = 134.03437499999998;
var d0$1 = 16295499532821565e-27;
var jabPqEncode = (v) => {
	if (v < 0) return 0;
	let vn = Math.pow(v / 1e4, M1);
	return Math.pow((C1 + C2 * vn) / (1 + C3 * vn), p$1);
};
var abs = (v = 0) => Math.max(v * 203, 0);
var convertXyz65ToJab = ({ x, y, z, alpha }) => {
	x = abs(x);
	y = abs(y);
	z = abs(z);
	let xp = 1.15 * x - .15 * z;
	let yp = .66 * y + .34 * x;
	let l = jabPqEncode(.41478972 * xp + .579999 * yp + .014648 * z);
	let m = jabPqEncode(-.20151 * xp + 1.120649 * yp + .0531008 * z);
	let s = jabPqEncode(-.0166008 * xp + .2648 * yp + .6684799 * z);
	let i = (l + m) / 2;
	let res = {
		mode: "jab",
		j: .44 * i / (1 - .56 * i) - d0$1,
		a: 3.524 * l - 4.066708 * m + .542708 * s,
		b: .199076 * l + 1.096799 * m - 1.295875 * s
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertJabToXyz65.js
var p = 134.03437499999998;
var d0 = 16295499532821565e-27;
var jabPqDecode = (v) => {
	if (v < 0) return 0;
	let vp = Math.pow(v, 1 / p);
	return 1e4 * Math.pow((C1 - vp) / (C3 * vp - C2), 1 / M1);
};
var rel = (v) => v / 203;
var convertJabToXyz65 = ({ j, a, b, alpha }) => {
	if (j === void 0) j = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let i = (j + d0) / (.44 + .56 * (j + d0));
	let l = jabPqDecode(i + .13860504 * a + .058047316 * b);
	let m = jabPqDecode(i - .13860504 * a - .058047316 * b);
	let s = jabPqDecode(i - .096019242 * a - .8118919 * b);
	let res = {
		mode: "xyz65",
		x: rel(1.661373024652174 * l - .914523081304348 * m + .23136208173913045 * s),
		y: rel(-.3250758611844533 * l + 1.571847026732543 * m - .21825383453227928 * s),
		z: rel(-.090982811 * l - .31272829 * m + 1.5227666 * s)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertRgbToJab.js
var convertRgbToJab = (rgb) => {
	let res = convertXyz65ToJab(convertRgbToXyz65(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jab/convertJabToRgb.js
var convertJabToRgb = (color) => convertXyz65ToRgb(convertJabToXyz65(color));
//#endregion
//#region ../../node_modules/culori/src/jab/definition.js
var definition$17 = {
	mode: "jab",
	channels: [
		"j",
		"a",
		"b",
		"alpha"
	],
	parse: ["--jzazbz"],
	serialize: "--jzazbz",
	fromMode: {
		rgb: convertRgbToJab,
		xyz65: convertXyz65ToJab
	},
	toMode: {
		rgb: convertJabToRgb,
		xyz65: convertJabToXyz65
	},
	ranges: {
		j: [0, .222],
		a: [-.109, .129],
		b: [-.185, .134]
	},
	interpolate: {
		j: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/jch/convertJabToJch.js
var convertJabToJch = ({ j, a, b, alpha }) => {
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = {
		mode: "jch",
		j,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jch/convertJchToJab.js
var convertJchToJab = ({ j, c, h, alpha }) => {
	if (h === void 0) h = 0;
	let res = {
		mode: "jab",
		j,
		a: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		b: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/jch/definition.js
var definition$16 = {
	mode: "jch",
	parse: ["--jzczhz"],
	serialize: "--jzczhz",
	toMode: {
		jab: convertJchToJab,
		rgb: (c) => convertJabToRgb(convertJchToJab(c))
	},
	fromMode: {
		rgb: (c) => convertJabToJch(convertRgbToJab(c)),
		jab: convertJabToJch
	},
	channels: [
		"j",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		j: [0, .221],
		c: [0, .19],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		j: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/constants.js
var k = Math.pow(29, 3) / Math.pow(3, 3);
var e = Math.pow(6, 3) / Math.pow(29, 3);
//#endregion
//#region ../../node_modules/culori/src/lab/convertLabToXyz50.js
var fn = (v) => Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k;
var convertLabToXyz50 = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;
	let res = {
		mode: "xyz50",
		x: fn(fx) * D50.X,
		y: fn(fy) * D50.Y,
		z: fn(fz) * D50.Z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/convertXyz50ToRgb.js
var convertXyz50ToRgb = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 3.1341359569958707 - y * 1.6173863321612538 - .4906619460083532 * z,
		g: x * -.978795502912089 + y * 1.916254567259524 + .03344273116131949 * z,
		b: x * .07195537988411677 - y * .2289768264158322 + 1.405386058324125 * z
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertLabToRgb.js
var convertLabToRgb = (lab) => convertXyz50ToRgb(convertLabToXyz50(lab));
//#endregion
//#region ../../node_modules/culori/src/xyz50/convertRgbToXyz50.js
var convertRgbToXyz50 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz50",
		x: .436065742824811 * r + .3851514688337912 * g + .14307845442264197 * b,
		y: .22249319175623702 * r + .7168870538238823 * g + .06061979053616537 * b,
		z: .013923904500943465 * r + .09708128566574634 * g + .7140993584005155 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertXyz50ToLab.js
var f = (value) => value > e ? Math.cbrt(value) : (k * value + 16) / 116;
var convertXyz50ToLab = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let f0 = f(x / D50.X);
	let f1 = f(y / D50.Y);
	let f2 = f(z / D50.Z);
	let res = {
		mode: "lab",
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/convertRgbToLab.js
var convertRgbToLab = (rgb) => {
	let res = convertXyz50ToLab(convertRgbToXyz50(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lab/parseLab.js
function parseLab(color, parsed) {
	if (!parsed || parsed[0] !== "lab") return;
	const res = { mode: "lab" };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) return;
	if (l.type !== Tok.None) res.l = Math.min(Math.max(0, l.value), 100);
	if (a.type !== Tok.None) res.a = a.type === Tok.Number ? a.value : a.value * 125 / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value : b.value * 125 / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/lab/definition.js
var definition$15 = {
	mode: "lab",
	toMode: {
		xyz50: convertLabToXyz50,
		rgb: convertLabToRgb
	},
	fromMode: {
		xyz50: convertXyz50ToLab,
		rgb: convertRgbToLab
	},
	channels: [
		"l",
		"a",
		"b",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	},
	parse: [parseLab],
	serialize: (c) => `lab(${c.l !== void 0 ? c.l : "none"} ${c.a !== void 0 ? c.a : "none"} ${c.b !== void 0 ? c.b : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/lab65/definition.js
var definition$14 = {
	...definition$15,
	mode: "lab65",
	parse: ["--lab-d65"],
	serialize: "--lab-d65",
	toMode: {
		xyz65: convertLab65ToXyz65,
		rgb: convertLab65ToRgb
	},
	fromMode: {
		xyz65: convertXyz65ToLab65,
		rgb: convertRgbToLab65
	},
	ranges: {
		l: [0, 100],
		a: [-125, 125],
		b: [-125, 125]
	}
};
//#endregion
//#region ../../node_modules/culori/src/lch/parseLch.js
function parseLch(color, parsed) {
	if (!parsed || parsed[0] !== "lch") return;
	const res = { mode: "lch" };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = Math.min(Math.max(0, l.value), 100);
	}
	if (c.type !== Tok.None) res.c = Math.max(0, c.type === Tok.Number ? c.value : c.value * 150 / 100);
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/lch/definition.js
var definition$13 = {
	mode: "lch",
	toMode: {
		lab: convertLchToLab,
		rgb: (c) => convertLabToRgb(convertLchToLab(c))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToLab(c)),
		lab: convertLabToLch
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	},
	parse: [parseLch],
	serialize: (c) => `lch(${c.l !== void 0 ? c.l : "none"} ${c.c !== void 0 ? c.c : "none"} ${c.h !== void 0 ? c.h : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lch65/definition.js
var definition$12 = {
	...definition$13,
	mode: "lch65",
	parse: ["--lch-d65"],
	serialize: "--lch-d65",
	toMode: {
		lab65: (c) => convertLchToLab(c, "lab65"),
		rgb: (c) => convertLab65ToRgb(convertLchToLab(c, "lab65"))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToLab65(c), "lch65"),
		lab65: (c) => convertLabToLch(c, "lch65")
	},
	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	}
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/convertLuvToLchuv.js
var convertLuvToLchuv = ({ l, u, v, alpha }) => {
	if (u === void 0) u = 0;
	if (v === void 0) v = 0;
	let c = Math.sqrt(u * u + v * v);
	let res = {
		mode: "lchuv",
		l,
		c
	};
	if (c) res.h = normalizeHue(Math.atan2(v, u) * 180 / Math.PI);
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/convertLchuvToLuv.js
var convertLchuvToLuv = ({ l, c, h, alpha }) => {
	if (h === void 0) h = 0;
	let res = {
		mode: "luv",
		l,
		u: c ? c * Math.cos(h / 180 * Math.PI) : 0,
		v: c ? c * Math.sin(h / 180 * Math.PI) : 0
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/luv/convertXyz50ToLuv.js
var u_fn$1 = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
var v_fn$1 = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
var un$1 = u_fn$1(D50.X, D50.Y, D50.Z);
var vn$1 = v_fn$1(D50.X, D50.Y, D50.Z);
var l_fn = (value) => value <= e ? k * value : 116 * Math.cbrt(value) - 16;
var convertXyz50ToLuv = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let l = l_fn(y / D50.Y);
	let u = u_fn$1(x, y, z);
	let v = v_fn$1(x, y, z);
	if (!isFinite(u) || !isFinite(v)) l = u = v = 0;
	else {
		u = 13 * l * (u - un$1);
		v = 13 * l * (v - vn$1);
	}
	let res = {
		mode: "luv",
		l,
		u,
		v
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/luv/convertLuvToXyz50.js
var u_fn = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
var v_fn = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
var un = u_fn(D50.X, D50.Y, D50.Z);
var vn = v_fn(D50.X, D50.Y, D50.Z);
var convertLuvToXyz50 = ({ l, u, v, alpha }) => {
	if (l === void 0) l = 0;
	if (l === 0) return {
		mode: "xyz50",
		x: 0,
		y: 0,
		z: 0
	};
	if (u === void 0) u = 0;
	if (v === void 0) v = 0;
	let up = u / (13 * l) + un;
	let vp = v / (13 * l) + vn;
	let y = D50.Y * (l <= 8 ? l / k : Math.pow((l + 16) / 116, 3));
	let res = {
		mode: "xyz50",
		x: y * (9 * up) / (4 * vp),
		y,
		z: y * (12 - 3 * up - 20 * vp) / (4 * vp)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/lchuv/definition.js
var convertRgbToLchuv = (rgb) => convertLuvToLchuv(convertXyz50ToLuv(convertRgbToXyz50(rgb)));
var convertLchuvToRgb = (lchuv) => convertXyz50ToRgb(convertLuvToXyz50(convertLchuvToLuv(lchuv)));
var definition$11 = {
	mode: "lchuv",
	toMode: {
		luv: convertLchuvToLuv,
		rgb: convertLchuvToRgb
	},
	fromMode: {
		rgb: convertRgbToLchuv,
		luv: convertLuvToLchuv
	},
	channels: [
		"l",
		"c",
		"h",
		"alpha"
	],
	parse: ["--lchuv"],
	serialize: "--lchuv",
	ranges: {
		l: [0, 100],
		c: [0, 176.956],
		h: [0, 360]
	},
	interpolate: {
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},
	difference: { h: differenceHueChroma },
	average: { h: averageAngle }
};
//#endregion
//#region ../../node_modules/culori/src/lrgb/definition.js
var definition$10 = {
	...definition$27,
	mode: "lrgb",
	toMode: { rgb: convertLrgbToRgb },
	fromMode: { rgb: convertRgbToLrgb },
	parse: ["srgb-linear"],
	serialize: "srgb-linear"
};
//#endregion
//#region ../../node_modules/culori/src/luv/definition.js
var definition$9 = {
	mode: "luv",
	toMode: {
		xyz50: convertLuvToXyz50,
		rgb: (luv) => convertXyz50ToRgb(convertLuvToXyz50(luv))
	},
	fromMode: {
		xyz50: convertXyz50ToLuv,
		rgb: (rgb) => convertXyz50ToLuv(convertRgbToXyz50(rgb))
	},
	channels: [
		"l",
		"u",
		"v",
		"alpha"
	],
	parse: ["--luv"],
	serialize: "--luv",
	ranges: {
		l: [0, 100],
		u: [-84.936, 175.042],
		v: [-125.882, 87.243]
	},
	interpolate: {
		l: interpolatorLinear,
		u: interpolatorLinear,
		v: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertLrgbToOklab.js
var convertLrgbToOklab = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	let L = Math.cbrt(.412221469470763 * r + .5363325372617348 * g + .0514459932675022 * b);
	let M = Math.cbrt(.2119034958178252 * r + .6806995506452344 * g + .1073969535369406 * b);
	let S = Math.cbrt(.0883024591900564 * r + .2817188391361215 * g + .6299787016738222 * b);
	let res = {
		mode: "oklab",
		l: .210454268309314 * L + .7936177747023054 * M - .0040720430116193 * S,
		a: 1.9779985324311684 * L - 2.42859224204858 * M + .450593709617411 * S,
		b: .0259040424655478 * L + .7827717124575296 * M - .8086757549230774 * S
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertRgbToOklab.js
var convertRgbToOklab = (rgb) => {
	let res = convertLrgbToOklab(convertRgbToLrgb(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) res.a = res.b = 0;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertOklabToLrgb.js
var convertOklabToLrgb = ({ l, a, b, alpha }) => {
	if (l === void 0) l = 0;
	if (a === void 0) a = 0;
	if (b === void 0) b = 0;
	let L = Math.pow(l + .3963377773761749 * a + .2158037573099136 * b, 3);
	let M = Math.pow(l - .1055613458156586 * a - .0638541728258133 * b, 3);
	let S = Math.pow(l - .0894841775298119 * a - 1.2914855480194092 * b, 3);
	let res = {
		mode: "lrgb",
		r: 4.076741636075957 * L - 3.3077115392580616 * M + .2309699031821044 * S,
		g: -1.2684379732850317 * L + 2.6097573492876887 * M - .3413193760026573 * S,
		b: -.0041960761386756 * L - .7034186179359362 * M + 1.7076146940746117 * S
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/oklab/convertOklabToRgb.js
var convertOklabToRgb = (c) => convertLrgbToRgb(convertOklabToLrgb(c));
//#endregion
//#region ../../node_modules/culori/src/okhsl/helpers.js
function toe(x) {
	const k_1 = .206;
	const k_2 = .03;
	const k_3 = (1 + k_1) / (1 + k_2);
	return .5 * (k_3 * x - k_1 + Math.sqrt((k_3 * x - k_1) * (k_3 * x - k_1) + 4 * k_2 * k_3 * x));
}
function toe_inv(x) {
	const k_1 = .206;
	const k_2 = .03;
	const k_3 = (1 + k_1) / (1 + k_2);
	return (x * x + k_1 * x) / (k_3 * (x + k_2));
}
function compute_max_saturation(a, b) {
	let k0, k1, k2, k3, k4, wl, wm, ws;
	if (-1.88170328 * a - .80936493 * b > 1) {
		k0 = 1.19086277;
		k1 = 1.76576728;
		k2 = .59662641;
		k3 = .75515197;
		k4 = .56771245;
		wl = 4.0767416621;
		wm = -3.3077115913;
		ws = .2309699292;
	} else if (1.81444104 * a - 1.19445276 * b > 1) {
		k0 = .73956515;
		k1 = -.45954404;
		k2 = .08285427;
		k3 = .1254107;
		k4 = .14503204;
		wl = -1.2684380046;
		wm = 2.6097574011;
		ws = -.3413193965;
	} else {
		k0 = 1.35733652;
		k1 = -.00915799;
		k2 = -1.1513021;
		k3 = -.50559606;
		k4 = .00692167;
		wl = -.0041960863;
		wm = -.7034186147;
		ws = 1.707614701;
	}
	let S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b;
	let k_l = .3963377774 * a + .2158037573 * b;
	let k_m = -.1055613458 * a - .0638541728 * b;
	let k_s = -.0894841775 * a - 1.291485548 * b;
	{
		let l_ = 1 + S * k_l;
		let m_ = 1 + S * k_m;
		let s_ = 1 + S * k_s;
		let l = l_ * l_ * l_;
		let m = m_ * m_ * m_;
		let s = s_ * s_ * s_;
		let l_dS = 3 * k_l * l_ * l_;
		let m_dS = 3 * k_m * m_ * m_;
		let s_dS = 3 * k_s * s_ * s_;
		let l_dS2 = 6 * k_l * k_l * l_;
		let m_dS2 = 6 * k_m * k_m * m_;
		let s_dS2 = 6 * k_s * k_s * s_;
		let f = wl * l + wm * m + ws * s;
		let f1 = wl * l_dS + wm * m_dS + ws * s_dS;
		let f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;
		S = S - f * f1 / (f1 * f1 - .5 * f * f2);
	}
	return S;
}
function find_cusp(a, b) {
	let S_cusp = compute_max_saturation(a, b);
	let rgb = convertOklabToLrgb({
		l: 1,
		a: S_cusp * a,
		b: S_cusp * b
	});
	let L_cusp = Math.cbrt(1 / Math.max(rgb.r, rgb.g, rgb.b));
	return [L_cusp, L_cusp * S_cusp];
}
function find_gamut_intersection(a, b, L1, C1, L0, cusp = null) {
	if (!cusp) cusp = find_cusp(a, b);
	let t;
	if ((L1 - L0) * cusp[1] - (cusp[0] - L0) * C1 <= 0) t = cusp[1] * L0 / (C1 * cusp[0] + cusp[1] * (L0 - L1));
	else {
		t = cusp[1] * (L0 - 1) / (C1 * (cusp[0] - 1) + cusp[1] * (L0 - L1));
		{
			let dL = L1 - L0;
			let dC = C1;
			let k_l = .3963377774 * a + .2158037573 * b;
			let k_m = -.1055613458 * a - .0638541728 * b;
			let k_s = -.0894841775 * a - 1.291485548 * b;
			let l_dt = dL + dC * k_l;
			let m_dt = dL + dC * k_m;
			let s_dt = dL + dC * k_s;
			{
				let L = L0 * (1 - t) + t * L1;
				let C = t * C1;
				let l_ = L + C * k_l;
				let m_ = L + C * k_m;
				let s_ = L + C * k_s;
				let l = l_ * l_ * l_;
				let m = m_ * m_ * m_;
				let s = s_ * s_ * s_;
				let ldt = 3 * l_dt * l_ * l_;
				let mdt = 3 * m_dt * m_ * m_;
				let sdt = 3 * s_dt * s_ * s_;
				let ldt2 = 6 * l_dt * l_dt * l_;
				let mdt2 = 6 * m_dt * m_dt * m_;
				let sdt2 = 6 * s_dt * s_dt * s_;
				let r = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s - 1;
				let r1 = 4.0767416621 * ldt - 3.3077115913 * mdt + .2309699292 * sdt;
				let r2 = 4.0767416621 * ldt2 - 3.3077115913 * mdt2 + .2309699292 * sdt2;
				let u_r = r1 / (r1 * r1 - .5 * r * r2);
				let t_r = -r * u_r;
				let g = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s - 1;
				let g1 = -1.2684380046 * ldt + 2.6097574011 * mdt - .3413193965 * sdt;
				let g2 = -1.2684380046 * ldt2 + 2.6097574011 * mdt2 - .3413193965 * sdt2;
				let u_g = g1 / (g1 * g1 - .5 * g * g2);
				let t_g = -g * u_g;
				let b = -.0041960863 * l - .7034186147 * m + 1.707614701 * s - 1;
				let b1 = -.0041960863 * ldt - .7034186147 * mdt + 1.707614701 * sdt;
				let b2 = -.0041960863 * ldt2 - .7034186147 * mdt2 + 1.707614701 * sdt2;
				let u_b = b1 / (b1 * b1 - .5 * b * b2);
				let t_b = -b * u_b;
				t_r = u_r >= 0 ? t_r : 1e6;
				t_g = u_g >= 0 ? t_g : 1e6;
				t_b = u_b >= 0 ? t_b : 1e6;
				t += Math.min(t_r, Math.min(t_g, t_b));
			}
		}
	}
	return t;
}
function get_ST_max(a_, b_, cusp = null) {
	if (!cusp) cusp = find_cusp(a_, b_);
	let L = cusp[0];
	let C = cusp[1];
	return [C / L, C / (1 - L)];
}
function get_Cs(L, a_, b_) {
	let cusp = find_cusp(a_, b_);
	let C_max = find_gamut_intersection(a_, b_, L, 1, L, cusp);
	let ST_max = get_ST_max(a_, b_, cusp);
	let S_mid = .11516993 + 1 / (7.4477897 + 4.1590124 * b_ + a_ * (-2.19557347 + 1.75198401 * b_ + a_ * (-2.13704948 - 10.02301043 * b_ + a_ * (-4.24894561 + 5.38770819 * b_ + 4.69891013 * a_))));
	let T_mid = .11239642 + 1 / (1.6132032 - .68124379 * b_ + a_ * (.40370612 + .90148123 * b_ + a_ * (-.27087943 + .6122399 * b_ + a_ * (.00299215 - .45399568 * b_ - .14661872 * a_))));
	let k = C_max / Math.min(L * ST_max[0], (1 - L) * ST_max[1]);
	let C_a = L * S_mid;
	let C_b = (1 - L) * T_mid;
	let C_mid = .9 * k * Math.sqrt(Math.sqrt(1 / (1 / (C_a * C_a * C_a * C_a) + 1 / (C_b * C_b * C_b * C_b))));
	C_a = L * .4;
	C_b = (1 - L) * .8;
	return [
		Math.sqrt(1 / (1 / (C_a * C_a) + 1 / (C_b * C_b))),
		C_mid,
		C_max
	];
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/convertOklabToOkhsl.js
function convertOklabToOkhsl(lab) {
	const l = lab.l !== void 0 ? lab.l : 0;
	const a = lab.a !== void 0 ? lab.a : 0;
	const b = lab.b !== void 0 ? lab.b : 0;
	const ret = {
		mode: "okhsl",
		l: toe(l)
	};
	if (lab.alpha !== void 0) ret.alpha = lab.alpha;
	let c = Math.sqrt(a * a + b * b);
	if (!c) {
		ret.s = 0;
		return ret;
	}
	let [C_0, C_mid, C_max] = get_Cs(l, a / c, b / c);
	let s;
	if (c < C_mid) {
		let k_0 = 0;
		let k_1 = .8 * C_0;
		let k_2 = 1 - k_1 / C_mid;
		s = (c - k_0) / (k_1 + k_2 * (c - k_0)) * .8;
	} else {
		let k_0 = C_mid;
		let k_1 = .2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
		let k_2 = 1 - k_1 / (C_max - C_mid);
		s = .8 + .2 * ((c - k_0) / (k_1 + k_2 * (c - k_0)));
	}
	if (s) {
		ret.s = s;
		ret.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	}
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/convertOkhslToOklab.js
function convertOkhslToOklab(hsl) {
	let h = hsl.h !== void 0 ? hsl.h : 0;
	let s = hsl.s !== void 0 ? hsl.s : 0;
	let l = hsl.l !== void 0 ? hsl.l : 0;
	const ret = {
		mode: "oklab",
		l: toe_inv(l)
	};
	if (hsl.alpha !== void 0) ret.alpha = hsl.alpha;
	if (!s || l === 1) {
		ret.a = ret.b = 0;
		return ret;
	}
	let a_ = Math.cos(h / 180 * Math.PI);
	let b_ = Math.sin(h / 180 * Math.PI);
	let [C_0, C_mid, C_max] = get_Cs(ret.l, a_, b_);
	let t, k_0, k_1, k_2;
	if (s < .8) {
		t = 1.25 * s;
		k_0 = 0;
		k_1 = .8 * C_0;
		k_2 = 1 - k_1 / C_mid;
	} else {
		t = 5 * (s - .8);
		k_0 = C_mid;
		k_1 = .2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
		k_2 = 1 - k_1 / (C_max - C_mid);
	}
	let C = k_0 + t * k_1 / (1 - k_2 * t);
	ret.a = C * a_;
	ret.b = C * b_;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsl/modeOkhsl.js
var modeOkhsl = {
	...definition$21,
	mode: "okhsl",
	channels: [
		"h",
		"s",
		"l",
		"alpha"
	],
	parse: ["--okhsl"],
	serialize: "--okhsl",
	fromMode: {
		oklab: convertOklabToOkhsl,
		rgb: (c) => convertOklabToOkhsl(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhslToOklab,
		rgb: (c) => convertOklabToRgb(convertOkhslToOklab(c))
	}
};
//#endregion
//#region ../../node_modules/culori/src/okhsv/convertOklabToOkhsv.js
function convertOklabToOkhsv(lab) {
	let l = lab.l !== void 0 ? lab.l : 0;
	let a = lab.a !== void 0 ? lab.a : 0;
	let b = lab.b !== void 0 ? lab.b : 0;
	let c = Math.sqrt(a * a + b * b);
	let a_ = c ? a / c : 1;
	let b_ = c ? b / c : 1;
	let [S_max, T] = get_ST_max(a_, b_);
	let S_0 = .5;
	let k = 1 - S_0 / S_max;
	let t = T / (c + l * T);
	let L_v = t * l;
	let C_v = t * c;
	let L_vt = toe_inv(L_v);
	let C_vt = C_v * L_vt / L_v;
	let rgb_scale = convertOklabToLrgb({
		l: L_vt,
		a: a_ * C_vt,
		b: b_ * C_vt
	});
	let scale_L = Math.cbrt(1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0));
	l = l / scale_L;
	c = c / scale_L * toe(l) / l;
	l = toe(l);
	const ret = {
		mode: "okhsv",
		s: c ? (S_0 + T) * C_v / (T * S_0 + T * k * C_v) : 0,
		v: l ? l / L_v : 0
	};
	if (ret.s) ret.h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
	if (lab.alpha !== void 0) ret.alpha = lab.alpha;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsv/convertOkhsvToOklab.js
function convertOkhsvToOklab(hsv) {
	const ret = { mode: "oklab" };
	if (hsv.alpha !== void 0) ret.alpha = hsv.alpha;
	const h = hsv.h !== void 0 ? hsv.h : 0;
	const s = hsv.s !== void 0 ? hsv.s : 0;
	const v = hsv.v !== void 0 ? hsv.v : 0;
	const a_ = Math.cos(h / 180 * Math.PI);
	const b_ = Math.sin(h / 180 * Math.PI);
	const [S_max, T] = get_ST_max(a_, b_);
	const S_0 = .5;
	const k = 1 - S_0 / S_max;
	const L_v = 1 - s * S_0 / (S_0 + T - T * k * s);
	const C_v = s * T * S_0 / (S_0 + T - T * k * s);
	const L_vt = toe_inv(L_v);
	const C_vt = C_v * L_vt / L_v;
	const rgb_scale = convertOklabToLrgb({
		l: L_vt,
		a: a_ * C_vt,
		b: b_ * C_vt
	});
	const scale_L = Math.cbrt(1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0));
	const L_new = toe_inv(v * L_v);
	const C = C_v * L_new / L_v;
	ret.l = L_new * scale_L;
	ret.a = C * a_ * scale_L;
	ret.b = C * b_ * scale_L;
	return ret;
}
//#endregion
//#region ../../node_modules/culori/src/okhsv/modeOkhsv.js
var modeOkhsv = {
	...definition$20,
	mode: "okhsv",
	channels: [
		"h",
		"s",
		"v",
		"alpha"
	],
	parse: ["--okhsv"],
	serialize: "--okhsv",
	fromMode: {
		oklab: convertOklabToOkhsv,
		rgb: (c) => convertOklabToOkhsv(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhsvToOklab,
		rgb: (c) => convertOklabToRgb(convertOkhsvToOklab(c))
	}
};
//#endregion
//#region ../../node_modules/culori/src/oklab/parseOklab.js
function parseOklab(color, parsed) {
	if (!parsed || parsed[0] !== "oklab") return;
	const res = { mode: "oklab" };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) return;
	if (l.type !== Tok.None) res.l = Math.min(Math.max(0, l.type === Tok.Number ? l.value : l.value / 100), 1);
	if (a.type !== Tok.None) res.a = a.type === Tok.Number ? a.value : a.value * .4 / 100;
	if (b.type !== Tok.None) res.b = b.type === Tok.Number ? b.value : b.value * .4 / 100;
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/oklab/definition.js
var definition$8 = {
	...definition$15,
	mode: "oklab",
	toMode: {
		lrgb: convertOklabToLrgb,
		rgb: convertOklabToRgb
	},
	fromMode: {
		lrgb: convertLrgbToOklab,
		rgb: convertRgbToOklab
	},
	ranges: {
		l: [0, 1],
		a: [-.4, .4],
		b: [-.4, .4]
	},
	parse: [parseOklab],
	serialize: (c) => `oklab(${c.l !== void 0 ? c.l : "none"} ${c.a !== void 0 ? c.a : "none"} ${c.b !== void 0 ? c.b : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`
};
//#endregion
//#region ../../node_modules/culori/src/oklch/parseOklch.js
function parseOklch(color, parsed) {
	if (!parsed || parsed[0] !== "oklch") return;
	const res = { mode: "oklch" };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) return;
		res.l = Math.min(Math.max(0, l.type === Tok.Number ? l.value : l.value / 100), 1);
	}
	if (c.type !== Tok.None) res.c = Math.max(0, c.type === Tok.Number ? c.value : c.value * .4 / 100);
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) return;
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) res.alpha = Math.min(1, Math.max(0, alpha.type === Tok.Number ? alpha.value : alpha.value / 100));
	return res;
}
//#endregion
//#region ../../node_modules/culori/src/oklch/definition.js
var definition$7 = {
	...definition$13,
	mode: "oklch",
	toMode: {
		oklab: (c) => convertLchToLab(c, "oklab"),
		rgb: (c) => convertOklabToRgb(convertLchToLab(c, "oklab"))
	},
	fromMode: {
		rgb: (c) => convertLabToLch(convertRgbToOklab(c), "oklch"),
		oklab: (c) => convertLabToLch(c, "oklch")
	},
	parse: [parseOklch],
	serialize: (c) => `oklch(${c.l !== void 0 ? c.l : "none"} ${c.c !== void 0 ? c.c : "none"} ${c.h !== void 0 ? c.h : "none"}${c.alpha < 1 ? ` / ${c.alpha}` : ""})`,
	ranges: {
		l: [0, 1],
		c: [0, .4],
		h: [0, 360]
	}
};
//#endregion
//#region ../../node_modules/culori/src/p3/convertP3ToXyz65.js
var convertP3ToXyz65 = (rgb) => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: "xyz65",
		x: .486570948648216 * r + .265667693169093 * g + .1982172852343625 * b,
		y: .2289745640697487 * r + .6917385218365062 * g + .079286914093745 * b,
		z: 0 * r + .0451133818589026 * g + 1.043944368900976 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/p3/convertXyz65ToP3.js
var convertXyz65ToP3 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = convertLrgbToRgb({
		r: x * 2.4934969119414263 - y * .9313836179191242 - .402710784450717 * z,
		g: x * -.8294889695615749 + y * 1.7626640603183465 + .0236246858419436 * z,
		b: x * .0358458302437845 - y * .0761723892680418 + .9568845240076871 * z
	}, "p3");
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/p3/definition.js
var definition$6 = {
	...definition$27,
	mode: "p3",
	parse: ["display-p3"],
	serialize: "display-p3",
	fromMode: {
		rgb: (color) => convertXyz65ToP3(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToP3
	},
	toMode: {
		rgb: (color) => convertXyz65ToRgb(convertP3ToXyz65(color)),
		xyz65: convertP3ToXyz65
	}
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/convertXyz50ToProphoto.js
var gamma$1 = (v) => {
	let abs = Math.abs(v);
	if (abs >= 1 / 512) return Math.sign(v) * Math.pow(abs, 1 / 1.8);
	return 16 * v;
};
var convertXyz50ToProphoto = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "prophoto",
		r: gamma$1(x * 1.3457868816471585 - y * .2555720873797946 - .0511018649755453 * z),
		g: gamma$1(x * -.5446307051249019 + y * 1.5082477428451466 + .0205274474364214 * z),
		b: gamma$1(x * 0 + y * 0 + 1.2119675456389452 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/convertProphotoToXyz50.js
var linearize$1 = (v = 0) => {
	let abs = Math.abs(v);
	if (abs >= 16 / 512) return Math.sign(v) * Math.pow(abs, 1.8);
	return v / 16;
};
var convertProphotoToXyz50 = (prophoto) => {
	let r = linearize$1(prophoto.r);
	let g = linearize$1(prophoto.g);
	let b = linearize$1(prophoto.b);
	let res = {
		mode: "xyz50",
		x: .7977666449006423 * r + .1351812974005331 * g + .0313477341283922 * b,
		y: .2880748288194013 * r + .7118352342418731 * g + 899369387256e-16 * b,
		z: 0 * r + 0 * g + .8251046025104602 * b
	};
	if (prophoto.alpha !== void 0) res.alpha = prophoto.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/prophoto/definition.js
var definition$5 = {
	...definition$27,
	mode: "prophoto",
	parse: ["prophoto-rgb"],
	serialize: "prophoto-rgb",
	fromMode: {
		xyz50: convertXyz50ToProphoto,
		rgb: (color) => convertXyz50ToProphoto(convertRgbToXyz50(color))
	},
	toMode: {
		xyz50: convertProphotoToXyz50,
		rgb: (color) => convertXyz50ToRgb(convertProphotoToXyz50(color))
	}
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/convertXyz65ToRec2020.js
var α$1 = 1.09929682680944;
var β$1 = .018053968510807;
var gamma = (v) => {
	const abs = Math.abs(v);
	if (abs > β$1) return (Math.sign(v) || 1) * (α$1 * Math.pow(abs, .45) - (α$1 - 1));
	return 4.5 * v;
};
var convertXyz65ToRec2020 = ({ x, y, z, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "rec2020",
		r: gamma(x * 1.7166511879712683 - y * .3556707837763925 - .2533662813736599 * z),
		g: gamma(x * -.6666843518324893 + y * 1.6164812366349395 + .0157685458139111 * z),
		b: gamma(x * .0176398574453108 - y * .0427706132578085 + .9421031212354739 * z)
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/convertRec2020ToXyz65.js
var α = 1.09929682680944;
var β = .018053968510807;
var linearize = (v = 0) => {
	let abs = Math.abs(v);
	if (abs < β * 4.5) return v / 4.5;
	return (Math.sign(v) || 1) * Math.pow((abs + α - 1) / α, 1 / .45);
};
var convertRec2020ToXyz65 = (rec2020) => {
	let r = linearize(rec2020.r);
	let g = linearize(rec2020.g);
	let b = linearize(rec2020.b);
	let res = {
		mode: "xyz65",
		x: .6369580483012911 * r + .1446169035862083 * g + .1688809751641721 * b,
		y: .262700212011267 * r + .6779980715188708 * g + .059301716469862 * b,
		z: 0 * r + .0280726930490874 * g + 1.0609850577107909 * b
	};
	if (rec2020.alpha !== void 0) res.alpha = rec2020.alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/rec2020/definition.js
var definition$4 = {
	...definition$27,
	mode: "rec2020",
	fromMode: {
		xyz65: convertXyz65ToRec2020,
		rgb: (color) => convertXyz65ToRec2020(convertRgbToXyz65(color))
	},
	toMode: {
		xyz65: convertRec2020ToXyz65,
		rgb: (color) => convertXyz65ToRgb(convertRec2020ToXyz65(color))
	},
	parse: ["rec2020"],
	serialize: "rec2020"
};
//#endregion
//#region ../../node_modules/culori/src/xyb/constants.js
var bias = .0037930732552754493;
var bias_cbrt = Math.cbrt(bias);
//#endregion
//#region ../../node_modules/culori/src/xyb/convertRgbToXyb.js
var transfer$1 = (v) => Math.cbrt(v) - bias_cbrt;
var convertRgbToXyb = (color) => {
	const { r, g, b, alpha } = convertRgbToLrgb(color);
	const l = transfer$1(.3 * r + .622 * g + .078 * b + bias);
	const m = transfer$1(.23 * r + .692 * g + .078 * b + bias);
	const s = transfer$1(.2434226892454782 * r + .2047674442449682 * g + .5518098665095535 * b + bias);
	const res = {
		mode: "xyb",
		x: (l - m) / 2,
		y: (l + m) / 2,
		b: s - (l + m) / 2
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyb/convertXybToRgb.js
var transfer = (v) => Math.pow(v + bias_cbrt, 3);
var convertXybToRgb = ({ x, y, b, alpha }) => {
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (b === void 0) b = 0;
	const l = transfer(x + y) - bias;
	const m = transfer(y - x) - bias;
	const s = transfer(b + y) - bias;
	const res = convertLrgbToRgb({
		r: 11.031566904639861 * l - 9.866943908131562 * m - .16462299650829934 * s,
		g: -3.2541473810744237 * l + 4.418770377582723 * m - .16462299650829934 * s,
		b: -3.6588512867136815 * l + 2.7129230459360922 * m + 1.9459282407775895 * s
	});
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyb/definition.js
var definition$3 = {
	mode: "xyb",
	channels: [
		"x",
		"y",
		"b",
		"alpha"
	],
	parse: ["--xyb"],
	serialize: "--xyb",
	toMode: { rgb: convertXybToRgb },
	fromMode: { rgb: convertRgbToXyb },
	ranges: {
		x: [-.0154, .0281],
		y: [0, .8453],
		b: [-.2778, .388]
	},
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		b: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/xyz50/definition.js
var definition$2 = {
	mode: "xyz50",
	parse: ["xyz-d50"],
	serialize: "xyz-d50",
	toMode: {
		rgb: convertXyz50ToRgb,
		lab: convertXyz50ToLab
	},
	fromMode: {
		rgb: convertRgbToXyz50,
		lab: convertLabToXyz50
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	ranges: {
		x: [0, .964],
		y: [0, .999],
		z: [0, .825]
	},
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz65ToXyz50.js
var convertXyz65ToXyz50 = (xyz65) => {
	let { x, y, z, alpha } = xyz65;
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "xyz50",
		x: 1.0479298208405488 * x + .0229467933410191 * y - .0501922295431356 * z,
		y: .0296278156881593 * x + .990434484573249 * y - .0170738250293851 * z,
		z: -.0092430581525912 * x + .0150551448965779 * y + .7518742899580008 * z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/convertXyz50ToXyz65.js
var convertXyz50ToXyz65 = (xyz50) => {
	let { x, y, z, alpha } = xyz50;
	if (x === void 0) x = 0;
	if (y === void 0) y = 0;
	if (z === void 0) z = 0;
	let res = {
		mode: "xyz65",
		x: .9554734527042182 * x - .0230985368742614 * y + .0632593086610217 * z,
		y: -.0283697069632081 * x + 1.0099954580058226 * y + .021041398966943 * z,
		z: .0123140016883199 * x - .0205076964334779 * y + 1.3303659366080753 * z
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/xyz65/definition.js
var definition$1 = {
	mode: "xyz65",
	toMode: {
		rgb: convertXyz65ToRgb,
		xyz50: convertXyz65ToXyz50
	},
	fromMode: {
		rgb: convertRgbToXyz65,
		xyz50: convertXyz50ToXyz65
	},
	ranges: {
		x: [0, .95],
		y: [0, 1],
		z: [0, 1.088]
	},
	channels: [
		"x",
		"y",
		"z",
		"alpha"
	],
	parse: ["xyz", "xyz-d65"],
	serialize: "xyz-d65",
	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
//#endregion
//#region ../../node_modules/culori/src/yiq/convertRgbToYiq.js
var convertRgbToYiq = ({ r, g, b, alpha }) => {
	if (r === void 0) r = 0;
	if (g === void 0) g = 0;
	if (b === void 0) b = 0;
	const res = {
		mode: "yiq",
		y: .29889531 * r + .58662247 * g + .11448223 * b,
		i: .59597799 * r - .2741761 * g - .32180189 * b,
		q: .21147017 * r - .52261711 * g + .31114694 * b
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/yiq/convertYiqToRgb.js
var convertYiqToRgb = ({ y, i, q, alpha }) => {
	if (y === void 0) y = 0;
	if (i === void 0) i = 0;
	if (q === void 0) q = 0;
	const res = {
		mode: "rgb",
		r: y + .95608445 * i + .6208885 * q,
		g: y - .27137664 * i - .6486059 * q,
		b: y - 1.10561724 * i + 1.70250126 * q
	};
	if (alpha !== void 0) res.alpha = alpha;
	return res;
};
//#endregion
//#region ../../node_modules/culori/src/yiq/definition.js
var definition = {
	mode: "yiq",
	toMode: { rgb: convertYiqToRgb },
	fromMode: { rgb: convertRgbToYiq },
	channels: [
		"y",
		"i",
		"q",
		"alpha"
	],
	parse: ["--yiq"],
	serialize: "--yiq",
	ranges: {
		i: [-.595, .595],
		q: [-.522, .522]
	},
	interpolate: {
		y: interpolatorLinear,
		i: interpolatorLinear,
		q: interpolatorLinear,
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	}
};
useMode(definition$26);
useMode(definition$25);
useMode(definition$24);
useMode(definition$23);
useMode(definition$22);
useMode(definition$21);
useMode(definition$20);
useMode(definition$19);
useMode(definition$18);
useMode(definition$17);
useMode(definition$16);
useMode(definition$15);
useMode(definition$14);
useMode(definition$13);
useMode(definition$12);
useMode(definition$11);
useMode(definition$10);
useMode(definition$9);
useMode(modeOkhsl);
useMode(modeOkhsv);
useMode(definition$8);
useMode(definition$7);
useMode(definition$6);
useMode(definition$5);
useMode(definition$4);
useMode(definition$27);
useMode(definition$3);
useMode(definition$2);
useMode(definition$1);
useMode(definition);
//#endregion
//#region ../../modules/projects/image.ts/src/canvas/Canvas.ts
var blobImageMap = /* @__PURE__ */ new WeakMap();
var sheduler = makeRAFCycle();
var getImgWidth = (img) => {
	return img?.naturalWidth || img?.width || 1;
};
var getImgHeight = (img) => {
	return img?.naturalHeight || img?.height || 1;
};
var cover = (ctx, img, scale = 1, port, orient = 0) => {
	const canvas = ctx.canvas;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((-orient || 0) * (Math.PI * .5));
	ctx.rotate((1 - port) * (Math.PI / 2));
	ctx.translate(-(getImgWidth(img) / 2) * scale, -(getImgHeight(img) / 2) * scale);
};
var createImageBitmapCache = (blob) => {
	if (!blobImageMap.has(blob) && (blob instanceof Blob || blob instanceof File || blob instanceof OffscreenCanvas || blob instanceof ImageBitmap || blob instanceof Image)) blobImageMap.set(blob, createImageBitmap(blob));
	return blobImageMap.get(blob);
};
var bindCache = /* @__PURE__ */ new WeakMap();
var bindCached = (cb, ctx) => {
	return bindCache?.getOrInsertComputed?.(cb, () => cb?.bind?.(ctx));
};
var UICanvas = null;
if (typeof HTMLCanvasElement != "undefined") UICanvas = class UICanvas extends HTMLCanvasElement {
	static observedAttributes = ["data-src", "data-orient"];
	ctx = null;
	image = null;
	#size = [1, 1];
	#loading = "";
	#ready = "";
	get #orient() {
		return parseInt(this.getAttribute("data-orient") || "0") || 0;
	}
	set #orient(value) {
		this.setAttribute("data-orient", value.toString());
	}
	attributeChangedCallback(name, _, newValue) {
		if (name == "data-src") this.#preload(newValue);
		if (name == "data-orient") this.#render(this.#ready);
	}
	connectedCallback() {
		const parent = this.parentNode;
		this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
		this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
		this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
		this.#preload(this.#loading = this.dataset.src || this.#loading);
	}
	constructor() {
		super();
		const canvas = this;
		const parent = this.parentNode;
		const fixSize = () => {
			const old = this.#size;
			this.#size = [Math.min(Math.min(Math.max(this.clientWidth || parent?.clientWidth || 1, 1), parent?.clientWidth || 1) * (this.currentCSSZoom || 1), screen?.width || 1) * (devicePixelRatio || 1), Math.min(Math.min(Math.max(this.clientHeight || parent?.clientHeight || 1, 1), parent?.clientHeight || 1) * (this.currentCSSZoom || 1), screen?.height || 1) * (devicePixelRatio || 1)];
			if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
		};
		sheduler?.shedule?.(() => {
			this.ctx = canvas.getContext("2d", {
				alpha: true,
				desynchronized: true,
				powerPreference: "high-performance",
				preserveDrawingBuffer: true
			});
			this.inert = true;
			this.style.objectFit = "cover";
			this.style.objectPosition = "center";
			this.classList.add("u-canvas");
			this.classList.add("u2-canvas");
			this.classList.add("ui-canvas");
			this.style.setProperty("max-inline-size", "min(100%, min(100cqi, 100dvi))");
			this.style.setProperty("max-block-size", "min(100%, min(100cqb, 100dvb))");
			fixSize();
			new ResizeObserver((entries) => {
				for (const entry of entries) {
					const box = entry?.devicePixelContentBoxSize?.[0];
					if (box) {
						const old = this.#size;
						this.#size = [Math.max(box.inlineSize || this.width, 1), Math.max(box.blockSize || this.height, 1)];
						if (old?.[0] != this.#size[0] || old?.[1] != this.#size[1]) this.#render(this.#ready);
					}
				}
			}).observe(this, { box: "device-pixel-content-box" });
			this.#preload(this.#loading = this.dataset.src || this.#loading);
		});
	}
	async $useImageAsSource(blob, ready) {
		ready ||= this.#loading;
		const img = blob instanceof ImageBitmap ? blob : await createImageBitmapCache(blob).catch(console.warn.bind(console));
		if (img && ready == this.#loading) {
			this.image = img;
			this.#render(ready);
		}
		return blob;
	}
	$renderPass(whatIsReady) {
		const canvas = this, ctx = this.ctx, img = this.image;
		if (img && ctx && (whatIsReady == this.#loading || !whatIsReady)) {
			if (whatIsReady) this.#ready = whatIsReady;
			if (this.width != this.#size[0]) this.width = this.#size[0];
			if (this.height != this.#size[1]) this.height = this.#size[1];
			this.style.aspectRatio = `${this.width || 1} / ${this.height || 1}`;
			const ox = this.#orient % 2 || 0;
			const port = getImgWidth(img) <= getImgHeight(img) ? 1 : 0;
			const scale = Math.max(canvas[["height", "width"][ox]] / (port ? getImgHeight(img) : getImgWidth(img)), canvas[["width", "height"][ox]] / (port ? getImgWidth(img) : getImgHeight(img)));
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			cover(ctx, img, scale, port, this.#orient);
			ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
			ctx.restore();
		}
	}
	#preload(src) {
		const ready = src || this.#loading;
		this.#loading = ready;
		return fetch(src, {
			cache: "force-cache",
			mode: "same-origin",
			priority: "high"
		})?.then?.(async (rsp) => this.$useImageAsSource(await rsp.blob(), ready)?.catch(console.warn.bind(console)))?.catch?.(console.warn.bind(console));
	}
	#render(whatIsReady) {
		const ctx = this.ctx;
		if (this.image && ctx && (whatIsReady == this.#loading || !whatIsReady)) sheduler?.shedule?.(bindCached(this.$renderPass, this));
	}
};
else UICanvas = class UICanvas {
	constructor() {}
	$renderPass(whatIsReady) {}
	$useImageAsSource(blob, ready) {
		return blob;
	}
	#preload(src) {
		return Promise.resolve();
	}
	#render(whatIsReady) {}
	#orient = 0;
	#loading = "";
	#ready = "";
	#size = [1, 1];
	ctx = null;
	image = null;
};
try {
	customElements.define("ui-canvas", UICanvas, { extends: "canvas" });
} catch (e) {}
//#endregion
//#region ../../modules/views/home-view/src/ts/view-opener.ts
var viewOpener = null;
/** Register how "open-view" shortcuts reach your shell (tabs, router, etc.). */
function setSpeedDialViewOpener(opener) {
	viewOpener = typeof opener === "function" ? opener : null;
}
function getSpeedDialViewOpener() {
	return viewOpener;
}
//#endregion
//#region ../../modules/shells/window-frame/src/views/markdown-view-window.ts
/**
* Contract for opening `views/markdown-view` (CwViewViewer) inside `mountWindowFrame`.
*
* - **`viewer`** — primary id (registry, IPC, demo `readerWindow` map key).
* - **`markdown`** (and related strings) — aliases; same module, same managed window row as `viewer`.
*
* Shells MUST collapse aliases via {@link normalizeMarkdownViewWindowId} before `Map` lookups / `focusWindow`.
*/
var MARKDOWN_VIEW_MANAGED_WINDOW_KEY = "viewer";
var ALIASES = new Set([
	"markdown",
	"markdown-view",
	"markdown-viewer",
	"reader",
	"env-viewer"
]);
/**
* Strip legacy desktop typos, normalize markdown family → {@link MARKDOWN_VIEW_MANAGED_WINDOW_KEY};
* leave all other ids unchanged (`explorer`, `settings`, …).
*/
function normalizeMarkdownViewWindowId(raw) {
	let id = String(raw ?? "").trim().toLowerCase();
	id = id.replace(/^#/, "");
	const todo = /^todo:\s*(.*)$/i.exec(id);
	if (todo) id = String(todo[1] ?? "").trim().toLowerCase();
	id = id.replace(/\s+/g, "");
	if (!id) return "";
	if (id === "viewer" || ALIASES.has(id)) return MARKDOWN_VIEW_MANAGED_WINDOW_KEY;
	return id;
}
//#endregion
//#region ../../modules/views/home-view/src/ts/launcher-state.ts
/**
* Speed-dial / launcher persistence for fl.ui only (no core).
* Storage keys match CrossWord `StateStorage` so shells sharing one origin keep one grid.
*/
var NAVIGATION_SHORTCUTS = [
	{
		view: "home",
		label: "Home",
		icon: "house-line"
	},
	{
		view: "viewer",
		label: "Markdown",
		icon: "article"
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
	if (typeof structuredClone === "function") try {
		return structuredClone(safe(value));
	} catch {}
	try {
		return JSON.parse(JSON.stringify(safe(value)));
	} catch {
		return value;
	}
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
				const nextHref = String(shortcut.meta.href ?? "");
				if (nextHref !== String(currentMeta.href ?? "")) {
					currentMeta.href = nextHref;
					changed = true;
				}
				const nextDesc = String(shortcut.meta.description ?? "");
				if (nextDesc !== String(currentMeta.description ?? "")) {
					currentMeta.description = nextDesc;
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
makeUIState("cw::workspace::wallpaper", () => observe({
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (raw) => observe(raw || {
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (state) => ({ ...state }));
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
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
	const run = () => applyGridSettings();
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
	else queueMicrotask(run);
}
//#endregion
//#region ../../modules/views/home-view/src/ts/action-registry.ts
/**
* Resolve speed-dial / shortcut `meta.view` and desktop `viewId` strings to a canonical `ViewId`.
* WHY: Persisted rows may store the human label ("Markdown", "Plan") or legacy ids; {@link normalizeMarkdownViewWindowId}
* only covers the markdown family.
*/
function resolveOpenViewTarget(raw) {
	const t = String(raw ?? "").trim();
	if (!t) return "";
	const tLower = t.toLowerCase().replace(/^#/, "");
	const byShortcut = NAVIGATION_SHORTCUTS.find((s) => String(s.view).toLowerCase() === tLower || String(s.label).trim().toLowerCase() === tLower);
	if (byShortcut) return String(byShortcut.view);
	return normalizeMarkdownViewWindowId(t) || t.replace(/^#/, "").trim();
}
//#endregion
//#region ../../modules/views/home-view/src/ts/OrientDesktop.ts
/** Orient-layer desktop shares SpeedDial styles; HomeView only adopts this sheet while home is visible, so load once here. */
var orientDesktopStyleSheet = null;
var ensureOrientDesktopStyles = () => {
	if (orientDesktopStyleSheet) return;
	orientDesktopStyleSheet = loadAsAdopted(SpeedDial_default);
};
var SUPPRESS_CLICK_MS = 280;
var ITEM_ENVELOPE_KIND = "cw-speed-dial-item";
var REGISTRY_ENVELOPE_KIND = "cw-speed-dial-registry";
var URL_PATTERN = /(https?:\/\/[^\s<>"']+)/i;
var ACTION_OPTIONS = [{
	value: "open-view",
	label: "Open view"
}, {
	value: "open-link",
	label: "Open link"
}];
var normalizeTileShape = (raw) => {
	const s = String(raw || "").toLowerCase();
	if (s === "circle" || s === "square" || s === "squircle") return s;
	return "squircle";
};
/** `data-grid-shape` on launcher grids: dominant tile shape, or `mixed` if icons disagree (per-tile is still `data-shape` on `.ui-ws-item-icon`). */
var gridShapeAttributeFromItems = (items) => {
	if (!items.length) return "squircle";
	if (new Set(items.map((it) => normalizeTileShape(it.shape))).size === 1) return normalizeTileShape(items[0].shape);
	return "mixed";
};
var DEFAULT_STATE = {
	columns: 4,
	rows: 8,
	items: [
		{
			id: "viewer",
			label: "Markdown",
			icon: "article",
			viewId: "viewer",
			cell: [0, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "explorer",
			label: "Explorer",
			icon: "books",
			viewId: "explorer",
			cell: [1, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "settings",
			label: "Settings",
			icon: "gear-six",
			viewId: "settings",
			cell: [2, 0],
			action: "open-view",
			shape: "squircle"
		},
		{
			id: "airpad",
			label: "AirPad",
			icon: "paper-plane-tilt",
			viewId: "airpad",
			cell: [3, 0],
			action: "open-view",
			shape: "squircle"
		}
	]
};
var protectedIds = new Set(DEFAULT_STATE.items.map((item) => item.id));
var createDesktopItemId = (prefix = "item") => {
	return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;
};
var clampCell = (cell, columns, rows) => {
	return [Math.max(0, Math.min(columns - 1, Math.round(cell[0]))), Math.max(0, Math.min(rows - 1, Math.round(cell[1])))];
};
var cellKey = (cell) => `${cell[0]}:${cell[1]}`;
var findNearestFreeCell = (preferred, occupied, columns, rows) => {
	const start = clampCell(preferred, columns, rows);
	if (!occupied.has(cellKey(start))) return start;
	const maxRadius = Math.max(columns, rows);
	for (let radius = 1; radius <= maxRadius; radius += 1) for (let y = Math.max(0, start[1] - radius); y <= Math.min(rows - 1, start[1] + radius); y += 1) for (let x = Math.max(0, start[0] - radius); x <= Math.min(columns - 1, start[0] + radius); x += 1) {
		if (!(Math.abs(x - start[0]) === radius || Math.abs(y - start[1]) === radius)) continue;
		const candidate = [x, y];
		if (!occupied.has(cellKey(candidate))) return candidate;
	}
	return start;
};
var enforceUniqueCells = (items, columns, rows) => {
	const occupied = /* @__PURE__ */ new Set();
	for (const item of items) {
		const nextCell = findNearestFreeCell(item.cell, occupied, columns, rows);
		item.cell = nextCell;
		occupied.add(cellKey(nextCell));
	}
	return items;
};
var normalizeItem = (raw, columns, rows) => {
	const id = String(raw?.id || "").trim();
	if (!id) return null;
	if (id === "home") return null;
	const action = String(raw?.action || (raw?.href ? "open-link" : "open-view"));
	const item = {
		id,
		label: String(raw?.label || "Item"),
		icon: String(raw?.icon || (action === "open-link" ? "link" : "sparkle")),
		iconSrc: normalizeIconSrcFromPayload(raw?.iconSrc, raw?.href, action),
		viewId: String(raw?.viewId || "home"),
		cell: clampCell([Number(raw?.cell?.[0] || 0), Number(raw?.cell?.[1] || 0)], columns, rows),
		action: action === "open-link" ? "open-link" : "open-view",
		href: raw?.href ? String(raw.href) : "",
		shape: normalizeTileShape(raw?.shape)
	};
	if (item.action === "open-link") item.viewId = "home";
	return item;
};
var readState = () => {
	try {
		const raw = loadDesktopRaw();
		if (!raw) return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
		const decoded = decodeDesktopState(raw);
		if (!decoded) return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
		const columns = Math.max(4, Math.min(8, Number(decoded.columns || DEFAULT_STATE.columns)));
		const rows = Math.max(6, Math.min(12, Number(decoded.rows || DEFAULT_STATE.rows)));
		const fallbackItems = [...DEFAULT_STATE.items];
		const items = enforceUniqueCells((Array.isArray(decoded.items) && decoded.items.length ? decoded.items : fallbackItems).map((item) => normalizeItem(item, columns, rows)).filter((item) => Boolean(item)), columns, rows);
		return {
			columns,
			rows,
			items: items.length ? items : enforceUniqueCells(fallbackItems.map((entry) => normalizeItem({
				...entry,
				cell: [entry.cell[0], entry.cell[1]]
			}, columns, rows)).filter((item) => Boolean(item)), columns, rows)
		};
	} catch {
		return {
			...DEFAULT_STATE,
			items: [...DEFAULT_STATE.items]
		};
	}
};
var applyCellVars = (node, cell) => {
	node.style.setProperty("--cell-x", String(cell[0]));
	node.style.setProperty("--cell-y", String(cell[1]));
	node.style.setProperty("--p-cell-x", String(cell[0]));
	node.style.setProperty("--p-cell-y", String(cell[1]));
};
var readImageFileFromClipboard = (event) => {
	const items = Array.from(event.clipboardData?.items || []);
	for (const item of items) if (item.type?.startsWith("image/")) {
		const file = item.getAsFile();
		if (file) return file;
	}
	return null;
};
var pickDroppedImageFile = (event) => {
	return Array.from(event.dataTransfer?.files || []).find((file) => file.type?.startsWith("image/")) || null;
};
var readAsDataUrl = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result || ""));
		reader.onerror = () => reject(reader.error || /* @__PURE__ */ new Error("Failed to read image"));
		reader.readAsDataURL(file);
	});
};
var applyWallpaperFromFile = async (file) => {
	if (!file?.type?.startsWith("image/")) return false;
	const dataUrl = await readAsDataUrl(file);
	if (!dataUrl) return false;
	setAppWallpaper(dataUrl);
	return true;
};
var parseUrlFromText = (text) => {
	const value = String(text || "").trim();
	if (!value) return null;
	const direct = (() => {
		try {
			return new URL(value);
		} catch {
			return null;
		}
	})();
	if (direct && /^https?:$/i.test(direct.protocol)) return direct;
	const match = value.match(URL_PATTERN);
	if (!match?.[1]) return null;
	try {
		const parsed = new URL(match[1]);
		if (!/^https?:$/i.test(parsed.protocol)) return null;
		return parsed;
	} catch {
		return null;
	}
};
var parseUrlFromHtml = (html) => {
	const content = String(html || "").trim();
	if (!content) return null;
	try {
		const href = new DOMParser().parseFromString(content, "text/html").querySelector("a[href]")?.getAttribute("href") || "";
		if (!href) return null;
		const parsed = new URL(href, window.location.href);
		if (!/^https?:$/i.test(parsed.protocol)) return null;
		return parsed;
	} catch {
		return null;
	}
};
var createLinkItem = (url, cell, labelHint = "") => {
	const label = String(labelHint || "").trim() || url.hostname.replace(/^www\./, "") || "Link";
	return {
		id: createDesktopItemId("link"),
		label,
		icon: "link",
		iconSrc: hostnameToFaviconRef(url.hostname),
		viewId: "home",
		cell,
		action: "open-link",
		href: url.href,
		shape: "squircle"
	};
};
var parseUrlItemFromText = (text, cell) => {
	const parsed = parseUrlFromText(text);
	if (!parsed) return null;
	return createLinkItem(parsed, cell);
};
var normalizeImportedItems = (payload, columns, rows, preferredCell) => {
	if (!payload) return [];
	const base = payload;
	return (Array.isArray(base?.items) ? base.items : Array.isArray(payload) ? payload : base?.item ? [base.item] : [payload]).map((raw, index) => normalizeItem({
		...raw || {},
		id: String(raw?.id || createDesktopItemId("import")),
		cell: raw?.cell ?? [preferredCell[0], preferredCell[1] + index]
	}, columns, rows)).filter((item) => Boolean(item));
};
var parseItemsFromTextPayload = (textPlain, textHtml, columns, rows, preferredCell) => {
	const plain = String(textPlain || "").trim();
	const html = String(textHtml || "").trim();
	if (plain.startsWith("{") || plain.startsWith("[")) try {
		const parsed = JSON.parse(plain);
		if (parsed?.k === "cw-sdi") {
			const flat = parseDesktopItemCompact(parsed);
			if (flat?.id) return normalizeImportedItems({ items: [flat] }, columns, rows, preferredCell);
		}
		if (parsed?.kind === ITEM_ENVELOPE_KIND || parsed?.kind === REGISTRY_ENVELOPE_KIND || parsed?.items || parsed?.item || Array.isArray(parsed)) return normalizeImportedItems(parsed, columns, rows, preferredCell);
	} catch {}
	const htmlUrl = parseUrlFromHtml(html);
	if (htmlUrl) return [createLinkItem(htmlUrl, preferredCell, (() => {
		try {
			const text = new DOMParser().parseFromString(html, "text/html").querySelector("a[href]")?.textContent || "";
			return String(text || "").trim();
		} catch {
			return "";
		}
	})())];
	const plainItem = parseUrlItemFromText(plain, preferredCell);
	return plainItem ? [plainItem] : [];
};
var itemsForStoragePayload = (items) => items.map((it) => ({
	...it,
	iconSrc: compactIconSrcForStorage(it.iconSrc || "", it.action, it.href)
}));
var serializeRegistryEnvelope = (state) => {
	return JSON.stringify({
		kind: REGISTRY_ENVELOPE_KIND,
		version: 1,
		columns: state.columns,
		rows: state.rows,
		items: itemsForStoragePayload(state.items)
	}, null, 2);
};
var downloadJson = (filename, content) => {
	const blob = new Blob([content], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
var openDesktopItem = (item) => {
	if (item.action === "open-link") {
		if (!item.href) return;
		window.open(item.href, "_blank", "noopener,noreferrer");
		return;
	}
	const target = resolveDesktopShellViewId(item.viewId, MARKDOWN_VIEW_MANAGED_WINDOW_KEY);
	const opener = getSpeedDialViewOpener();
	if (opener) {
		opener(target, {
			source: "home",
			itemId: item.id
		});
		return;
	}
	console.warn("[OrientDesktop] No view opener registered; using hash fallback for:", target);
	navigate(`#${target}`);
};
var prettifyView = (viewId) => {
	const value = String(viewId || "").trim();
	if (!value) return "View";
	if (value.toLowerCase() === "viewer") return "Markdown";
	return value.charAt(0).toUpperCase() + value.slice(1);
};
/**
* Desktop tile `viewId` → shell `openView` id (collapses `markdown` → `viewer` per {@link MARKDOWN_VIEW_MANAGED_WINDOW_KEY}).
*/
var resolveDesktopShellViewId = (raw, fallback) => {
	const t = String(raw ?? "").trim();
	if (!t) return fallback;
	return resolveOpenViewTarget(t) || fallback;
};
/** See `markdown-view-window.ts`: primary id is {@link MARKDOWN_VIEW_MANAGED_WINDOW_KEY}; label “Markdown”. */
var DESKTOP_SHELL_VIEW_OPTIONS = [
	MARKDOWN_VIEW_MANAGED_WINDOW_KEY,
	"explorer",
	"settings",
	"airpad",
	"workcenter",
	"history",
	"editor"
].map((viewId) => ({
	value: viewId,
	label: prettifyView(viewId)
}));
var initializeOrientedDesktop = (host) => {
	if (!host || host.dataset.desktopMounted === "true") return;
	host.dataset.desktopMounted = "true";
	ensureOrientDesktopStyles();
	const state = readState();
	const itemById = new Map(state.items.map((item) => [item.id, item]));
	const itemIdList = state.items.map((item) => item.id);
	let draftTimer = null;
	const DRAFT_DEBOUNCE_MS = 400;
	const desktopRoot = document.createElement("div");
	desktopRoot.className = "speed-dial-root app-oriented-desktop ui-orientbox";
	desktopRoot.setAttribute("data-mixin", "ui-orientbox");
	desktopRoot.style.position = "absolute";
	desktopRoot.style.inset = "0";
	desktopRoot.style.pointerEvents = "auto";
	desktopRoot.style.background = "transparent";
	desktopRoot.style.display = "grid";
	desktopRoot.tabIndex = 0;
	const syncDesktopOrient = () => {
		const n = orientationNumberMap?.[getCorrectOrientation()] ?? 0;
		desktopRoot.style.setProperty("--orient", String(n));
	};
	syncDesktopOrient();
	screen.orientation?.addEventListener?.("change", syncDesktopOrient);
	window.addEventListener("resize", syncDesktopOrient);
	const applyGridLayoutVars = (el) => {
		el.style.setProperty("--layout-c", String(state.columns));
		el.style.setProperty("--layout-r", String(state.rows));
	};
	const shapeStack = document.createElement("div");
	shapeStack.className = "speed-dial-grid speed-dial-grid--labels ui-launcher-grid app-oriented-desktop__grid app-oriented-desktop__grid--labels";
	shapeStack.dataset.gridLayer = "icons";
	shapeStack.setAttribute("data-grid-columns", String(state.columns));
	shapeStack.setAttribute("data-grid-rows", String(state.rows));
	applyGridLayoutVars(shapeStack);
	shapeStack.dataset.dialStack = "shapes";
	const textStack = document.createElement("div");
	textStack.className = "speed-dial-grid speed-dial-grid--icons ui-launcher-grid app-oriented-desktop__grid app-oriented-desktop__grid--icons";
	textStack.dataset.gridLayer = "labels";
	textStack.setAttribute("data-grid-columns", String(state.columns));
	textStack.setAttribute("data-grid-rows", String(state.rows));
	applyGridLayoutVars(textStack);
	textStack.dataset.dialStack = "text";
	desktopRoot.append(shapeStack, textStack);
	host.appendChild(desktopRoot);
	const applyGridShapeMetadata = () => {
		const attr = gridShapeAttributeFromItems(state.items);
		shapeStack.setAttribute("data-grid-shape", attr);
		textStack.setAttribute("data-grid-shape", attr);
	};
	applyGridShapeMetadata();
	const commitDesktop = () => {
		if (draftTimer !== null) {
			clearTimeout(draftTimer);
			draftTimer = null;
		}
		persistDesktopMain(state.columns, state.rows, itemsForStoragePayload(state.items));
		applyGridShapeMetadata();
	};
	const scheduleDesktopDraft = () => {
		if (draftTimer !== null) clearTimeout(draftTimer);
		draftTimer = setTimeout(() => {
			draftTimer = null;
			persistDesktopDraft(state.columns, state.rows, itemsForStoragePayload(state.items));
		}, DRAFT_DEBOUNCE_MS);
	};
	let suppressClickUntil = 0;
	const iconNodeById = /* @__PURE__ */ new Map();
	const labelNodeById = /* @__PURE__ */ new Map();
	const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[char] || char);
	const occupiedSet = (exceptId = "") => {
		const occupied = /* @__PURE__ */ new Set();
		for (const entry of state.items) {
			if (exceptId && entry.id === exceptId) continue;
			occupied.add(cellKey(entry.cell));
		}
		return occupied;
	};
	const applyItemCell = (item, cell) => {
		item.cell = clampCell(cell, state.columns, state.rows);
		const iconNode = iconNodeById.get(item.id);
		const labelNode = labelNodeById.get(item.id);
		if (iconNode) applyCellVars(iconNode, item.cell);
		if (labelNode) applyCellVars(labelNode, item.cell);
	};
	const placeItemIntoFreeCell = (item, preferred, exceptId = "") => {
		const target = findNearestFreeCell(preferred, occupiedSet(exceptId), state.columns, state.rows);
		applyItemCell(item, target);
		return target;
	};
	const addItems = (items, preferredCell) => {
		let added = 0;
		for (let index = 0; index < items.length; index += 1) {
			const incoming = items[index];
			if (!incoming) continue;
			const item = normalizeItem({
				...incoming,
				id: incoming.id || createDesktopItemId("item"),
				cell: incoming.cell || [preferredCell[0], preferredCell[1] + index]
			}, state.columns, state.rows);
			if (!item || itemById.has(item.id)) continue;
			item.cell = findNearestFreeCell(item.cell, occupiedSet(), state.columns, state.rows);
			state.items.push(item);
			itemById.set(item.id, item);
			itemIdList.push(item.id);
			mountDesktopItem(item);
			added += 1;
		}
		if (added > 0) commitDesktop();
		return added;
	};
	const refreshDesktopItemNodes = (item) => {
		const iconNode = iconNodeById.get(item.id);
		const labelNode = labelNodeById.get(item.id);
		if (labelNode) {
			const span = labelNode.querySelector(".ui-ws-item-label span");
			if (span) span.textContent = item.label || "Item";
			applyCellVars(labelNode, item.cell);
		}
		if (iconNode) {
			const iconShape = iconNode.querySelector(".ui-ws-item-icon");
			if (iconShape) {
				iconShape.dataset.shape = normalizeTileShape(item.shape);
				const existingImage = iconShape.querySelector(".ui-ws-item-icon-image");
				let iconElement = iconShape.querySelector("ui-icon");
				const domIconSrc = expandIconSrcForDom(item.iconSrc || "");
				if (domIconSrc) {
					iconElement?.remove();
					if (existingImage) existingImage.src = domIconSrc;
					else {
						const image = document.createElement("img");
						image.className = "ui-ws-item-icon-image";
						image.alt = "";
						image.loading = "lazy";
						image.decoding = "async";
						image.referrerPolicy = "no-referrer";
						image.src = domIconSrc;
						image.addEventListener("error", () => image.remove());
						iconShape.insertBefore(image, iconShape.firstChild);
					}
				} else {
					if (existingImage) existingImage.remove();
					if (!iconElement) {
						iconElement = document.createElement("ui-icon");
						iconShape.appendChild(iconElement);
					}
					iconElement.setAttribute("icon", item.icon || "sparkle");
				}
			}
			applyCellVars(iconNode, item.cell);
		}
	};
	const guessCellFromPoint = (x, y) => {
		return resolveGridCellFromClientPoint(shapeStack, [x, y], {
			layout: {
				columns: state.columns,
				rows: state.rows
			},
			items: itemById,
			list: itemIdList,
			item: {
				id: "__menu__",
				cell: [0, 0]
			}
		}, "round");
	};
	const importFromClipboard = async (cell) => {
		try {
			if (navigator.clipboard?.read) {
				const records = await navigator.clipboard.read();
				for (const record of records) {
					if (record.types.includes("image/png") || record.types.includes("image/jpeg") || record.types.includes("image/webp")) {
						const imageType = record.types.find((type) => type.startsWith("image/"));
						if (!imageType) continue;
						const blob = await record.getType(imageType);
						if (await applyWallpaperFromFile(new File([blob], "wallpaper", { type: blob.type }))) return true;
					}
					const plainType = record.types.includes("text/plain") ? "text/plain" : "";
					const htmlType = record.types.includes("text/html") ? "text/html" : "";
					const imported = parseItemsFromTextPayload(plainType ? await (await record.getType(plainType)).text() : "", htmlType ? await (await record.getType(htmlType)).text() : "", state.columns, state.rows, cell);
					if (imported.length) return addItems(imported, cell) > 0;
				}
			}
			return addItems(parseItemsFromTextPayload(await navigator.clipboard.readText(), "", state.columns, state.rows, cell), cell) > 0;
		} catch {
			return false;
		}
	};
	const makeIconItem = (item) => {
		const el = document.createElement("div");
		el.className = "ui-ws-item";
		el.dataset.desktopId = item.id;
		el.dataset.layer = "icons";
		el.setAttribute("draggable", "false");
		applyCellVars(el, item.cell);
		applyGridLayoutVars(el);
		const icon = document.createElement("div");
		icon.className = "ui-ws-item-icon shaped";
		icon.dataset.shape = normalizeTileShape(item.shape);
		const mountIconSrc = expandIconSrcForDom(item.iconSrc || "");
		if (mountIconSrc) {
			const image = document.createElement("img");
			image.className = "ui-ws-item-icon-image";
			image.alt = "";
			image.loading = "lazy";
			image.decoding = "async";
			image.referrerPolicy = "no-referrer";
			image.src = mountIconSrc;
			image.addEventListener("error", () => image.remove());
			icon.appendChild(image);
		} else {
			const iconElement = document.createElement("ui-icon");
			iconElement.setAttribute("icon", item.icon || "sparkle");
			icon.appendChild(iconElement);
		}
		el.appendChild(icon);
		return el;
	};
	const makeLabelItem = (item) => {
		const el = document.createElement("div");
		el.className = "ui-ws-item";
		el.dataset.desktopId = item.id;
		el.dataset.layer = "labels";
		el.style.pointerEvents = "none";
		el.style.background = "transparent";
		applyCellVars(el, item.cell);
		applyGridLayoutVars(el);
		el.innerHTML = `<div class="ui-ws-item-label"><span>${escapeHtml(item.label)}</span></div>`;
		return el;
	};
	const removeDesktopItem = (itemId) => {
		const index = state.items.findIndex((item) => item.id === itemId);
		if (index === -1) return;
		if (desktopRoot.dataset.dialDraggingId === itemId) desktopRoot.dataset.dialDraggingId = "";
		state.items.splice(index, 1);
		itemById.delete(itemId);
		const listIndex = itemIdList.indexOf(itemId);
		if (listIndex >= 0) itemIdList.splice(listIndex, 1);
		iconNodeById.get(itemId)?.remove();
		labelNodeById.get(itemId)?.remove();
		iconNodeById.delete(itemId);
		labelNodeById.delete(itemId);
		enforceUniqueCells(state.items, state.columns, state.rows);
		commitDesktop();
	};
	const mountDesktopItem = (item) => {
		const iconNode = makeIconItem(item);
		const labelNode = makeLabelItem(item);
		iconNodeById.set(item.id, iconNode);
		labelNodeById.set(item.id, labelNode);
		shapeStack.appendChild(iconNode);
		textStack.appendChild(labelNode);
		const iconShape = iconNode.querySelector(".ui-ws-item-icon");
		if (iconShape) {
			iconShape.style.pointerEvents = "auto";
			iconShape.style.touchAction = "none";
		}
		bindInteraction(iconNode, {
			layout: [state.columns, state.rows],
			items: itemById,
			list: itemIdList,
			item,
			immediateDragStyles: true
		});
		iconNode.addEventListener("m-dragstart", () => {
			closeUnifiedContextMenu();
			desktopRoot.dataset.dialDraggingId = item.id;
			iconNode.dataset.interactionState = "onGrab";
			iconNode.dataset.gridCoordinateState = "source";
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onLabelDocked";
				labelNode.dataset.gridCoordinateState = "source";
				applyCellVars(labelNode, item.cell);
				labelNode.style.setProperty("--drag-x", "0");
				labelNode.style.setProperty("--drag-y", "0");
				labelNode.style.setProperty("--cs-drag-x", "0px");
				labelNode.style.setProperty("--cs-drag-y", "0px");
			}
		});
		iconNode.addEventListener("m-dragging", () => {
			scheduleDesktopDraft();
			iconNode.dataset.interactionState = "onMoving";
			iconNode.dataset.gridCoordinateState = "intermediate";
		});
		iconNode.addEventListener("m-dragend", () => {
			suppressClickUntil = performance.now() + SUPPRESS_CLICK_MS;
			iconNode.dataset.interactionState = "onRelax";
			iconNode.dataset.gridCoordinateState = "destination";
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onLabelDocked";
				labelNode.dataset.gridCoordinateState = "source";
			}
		});
		iconNode.addEventListener("m-dragsettled", (event) => {
			const settledCell = event?.detail?.cell || null;
			const finalCell = placeItemIntoFreeCell(item, settledCell ? [settledCell[0], settledCell[1]] : [item.cell[0], item.cell[1]], item.id);
			const labelNode = labelNodeById.get(item.id);
			if (labelNode) {
				labelNode.dataset.interactionState = "onPlace";
				labelNode.dataset.gridCoordinateState = "destination";
				labelNode.style.setProperty("--drag-x", "0");
				labelNode.style.setProperty("--drag-y", "0");
				labelNode.style.setProperty("--cs-drag-x", "0px");
				labelNode.style.setProperty("--cs-drag-y", "0px");
				applyCellVars(labelNode, finalCell);
			}
			iconNode.dataset.interactionState = "onPlace";
			iconNode.dataset.gridCoordinateState = "destination";
			iconNode.style.setProperty("--drag-x", "0");
			iconNode.style.setProperty("--drag-y", "0");
			iconNode.style.setProperty("--cs-drag-x", "0px");
			iconNode.style.setProperty("--cs-drag-y", "0px");
			applyCellVars(iconNode, finalCell);
			commitDesktop();
			desktopRoot.dataset.dialDraggingId = "";
			setTimeout(() => {
				iconNode.dataset.interactionState = "onHover";
				iconNode.dataset.gridCoordinateState = "source";
				const nextLabelNode = labelNodeById.get(item.id);
				if (nextLabelNode) {
					nextLabelNode.dataset.interactionState = "onHover";
					nextLabelNode.dataset.gridCoordinateState = "source";
				}
			}, 280);
		});
		(iconShape ?? iconNode).addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (performance.now() < suppressClickUntil) return;
			openDesktopItem(item);
		});
	};
	const createLinkShortcutFromClipboard = async (cell) => {
		return importFromClipboard(cell);
	};
	const openItemEditor = (item, opts) => {
		const isNew = !item;
		const seed = opts?.seed || {};
		const suggestedCell = opts?.suggestedCell || [0, 0];
		const workingItem = item ? item : {
			id: createDesktopItemId("item"),
			label: seed.label || "New shortcut",
			icon: seed.icon || "sparkle",
			iconSrc: "",
			viewId: resolveDesktopShellViewId(seed.viewId, MARKDOWN_VIEW_MANAGED_WINDOW_KEY),
			cell: suggestedCell,
			action: seed.action || "open-view",
			href: seed.href || "",
			shape: normalizeTileShape(seed.shape)
		};
		openShortcutEditor({
			mode: isNew ? "create" : "edit",
			registerForBackNavigation: true,
			initial: {
				label: workingItem.label || "Item",
				icon: workingItem.icon || "sparkle",
				action: workingItem.action || "open-view",
				view: workingItem.viewId || "",
				href: workingItem.href || "",
				description: String(seed.description || ""),
				shape: normalizeTileShape(workingItem.shape)
			},
			actionOptions: ACTION_OPTIONS,
			viewOptions: DESKTOP_SHELL_VIEW_OPTIONS,
			onSave: (next) => {
				const action = String(next.action || "open-view");
				const nextHref = String(next.href || "").trim();
				workingItem.label = String(next.label || "Item").trim() || "Item";
				workingItem.icon = String(next.icon || "sparkle").trim() || "sparkle";
				workingItem.action = action;
				workingItem.href = action === "open-link" ? nextHref : "";
				workingItem.viewId = action === "open-link" ? "home" : resolveDesktopShellViewId(next.view, MARKDOWN_VIEW_MANAGED_WINDOW_KEY);
				workingItem.shape = normalizeTileShape(next.shape);
				if (action === "open-link" && nextHref) try {
					const u = new URL(nextHref, window.location.href);
					workingItem.iconSrc = /^https?:$/i.test(u.protocol) ? hostnameToFaviconRef(u.hostname) : "";
				} catch {
					workingItem.iconSrc = "";
				}
				else workingItem.iconSrc = "";
				if (isNew) addItems([workingItem], suggestedCell);
				else {
					const existing = itemById.get(workingItem.id);
					if (existing) {
						Object.assign(existing, workingItem);
						itemById.set(existing.id, existing);
						refreshDesktopItemNodes(existing);
						commitDesktop();
					}
				}
			},
			onDelete: isNew ? void 0 : () => {
				removeDesktopItem(workingItem.id);
			}
		});
	};
	const openDesktopMenu = (event, item, cellHint) => {
		const entries = item ? [
			{
				id: "open",
				label: "Open",
				icon: item.action === "open-link" ? "arrow-square-out" : "play",
				action: () => openDesktopItem(item)
			},
			{
				id: "actions",
				label: "Actions",
				icon: "dots-three",
				action: () => {},
				children: [...item.action === "open-link" && item.href ? [{
					id: "copy-link",
					label: "Copy link",
					icon: "link",
					action: async () => {
						try {
							await navigator.clipboard.writeText(item.href || "");
						} catch {}
					}
				}, {
					id: "open-link-new-window",
					label: "Open link in new tab",
					icon: "arrow-square-out",
					action: () => {
						if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
					}
				}] : [], {
					id: "copy-item-json",
					label: "Copy item (compact JSON)",
					icon: "clipboard-text",
					action: async () => {
						try {
							await navigator.clipboard.writeText(serializeDesktopItemCompact(item));
						} catch {}
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
					action: () => openItemEditor(item, { suggestedCell: item.cell })
				}, {
					id: "remove",
					label: "Remove",
					icon: "trash",
					danger: true,
					disabled: protectedIds.has(item.id),
					action: () => removeDesktopItem(item.id)
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
						action: () => openItemEditor(void 0, { suggestedCell: cellHint })
					},
					{
						id: "paste-link",
						label: "Paste shortcut",
						icon: "clipboard",
						action: async () => {
							if (!await createLinkShortcutFromClipboard(cellHint)) {}
						}
					},
					{
						id: "create-link-shortcut",
						label: "Create link shortcut",
						icon: "link",
						action: () => {
							openItemEditor(void 0, {
								suggestedCell: cellHint,
								seed: {
									action: "open-link",
									label: "New link",
									icon: "link",
									href: "",
									description: ""
								}
							});
						}
					}
				]
			},
			{
				id: "registry",
				label: "Registry",
				icon: "database",
				action: () => {},
				children: [
					{
						id: "copy-registry-json",
						label: "Copy registry JSON",
						icon: "clipboard-text",
						action: async () => {
							try {
								await navigator.clipboard.writeText(serializeRegistryEnvelope(state));
							} catch {}
						}
					},
					{
						id: "export-registry-json",
						label: "Export registry",
						icon: "download-simple",
						action: () => {
							const date = /* @__PURE__ */ new Date();
							downloadJson(`cw-home-registry-${`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}.json`, serializeRegistryEnvelope(state));
						}
					},
					{
						id: "import-registry-json",
						label: "Import from clipboard",
						icon: "upload-simple",
						action: async () => {
							await importFromClipboard(cellHint);
						}
					}
				]
			},
			{
				id: "open",
				label: "Open",
				icon: "squares-four",
				action: () => {},
				children: [{
					id: "open-explorer",
					label: "Explorer",
					icon: "books",
					action: () => {}
				}, {
					id: "open-settings",
					label: "Settings",
					icon: "gear-six",
					action: () => {}
				}]
			},
			{
				id: "wallpaper",
				label: "Wallpaper",
				icon: "image",
				action: () => {},
				children: [{
					id: "change-wallpaper",
					label: "Choose image",
					icon: "image",
					action: async () => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = "image/*";
						input.onchange = async () => {
							const file = input.files?.[0];
							if (!file) return;
							await applyWallpaperFromFile(file);
						};
						input.click();
					}
				}]
			}
		];
		openUnifiedContextMenu({
			x: event.clientX,
			y: event.clientY,
			items: entries,
			compact: true
		});
	};
	const handlePaste = async (event) => {
		const image = readImageFileFromClipboard(event);
		if (image) {
			event.preventDefault();
			event.stopPropagation();
			await applyWallpaperFromFile(image);
			return;
		}
		const items = parseItemsFromTextPayload(event.clipboardData?.getData("text/plain") || "", event.clipboardData?.getData("text/html") || "", state.columns, state.rows, [0, 0]);
		if (!items.length) return;
		event.preventDefault();
		event.stopPropagation();
		addItems(items, [0, 0]);
	};
	desktopRoot.addEventListener("pointerdown", () => desktopRoot.focus());
	desktopRoot.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	desktopRoot.addEventListener("drop", async (event) => {
		const file = pickDroppedImageFile(event);
		if (file) {
			event.preventDefault();
			event.stopPropagation();
			await applyWallpaperFromFile(file);
			return;
		}
		const plain = event.dataTransfer?.getData("text/plain") || "";
		const html = event.dataTransfer?.getData("text/html") || "";
		let items = parseItemsFromTextPayload([event.dataTransfer?.getData("text/uri-list") || "", plain].filter(Boolean).join("\n").trim(), html, state.columns, state.rows, [0, 0]);
		if (!items.length) {
			const droppedTextFile = Array.from(event.dataTransfer?.files || []).find((entry) => entry.type === "text/plain" || entry.type === "text/html");
			if (droppedTextFile) {
				const payload = await droppedTextFile.text();
				items = parseItemsFromTextPayload(payload, droppedTextFile.type === "text/html" ? payload : "", state.columns, state.rows, [0, 0]);
			}
		}
		if (!items.length) return;
		event.preventDefault();
		event.stopPropagation();
		addItems(items, [0, 0]);
	});
	desktopRoot.addEventListener("paste", (event) => {
		handlePaste(event);
	});
	desktopRoot.addEventListener("contextmenu", (event) => {
		event.preventDefault();
		const itemId = (event.target?.closest?.(".ui-ws-item[data-desktop-id]"))?.dataset.desktopId || "";
		openDesktopMenu(event, itemId ? itemById.get(itemId) || null : null, guessCellFromPoint(event.clientX, event.clientY));
	});
	for (const item of state.items) mountDesktopItem(item);
};
//#endregion
//#region ../../modules/views/home-view/src/index.ts
var HomeView = class {
	id = "home";
	name = "Home";
	icon = "house";
	options;
	shellContext;
	element = null;
	lifecycle = { onUnmount: () => {
		setSpeedDialViewOpener(null);
		this.element = null;
	} };
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	/**
	* WHY: {@link ShellBase.getContext} exposes `navigate` but not `openView`. Calling both caused a double
	* `navigate("viewer")`; the second hit the same-view short-circuit so the overlay never opened reliably.
	* Prefer `openView` when the host (e.g. environment-shell) provides it.
	*/
	dispatchShellRoute(viewId, opts) {
		const id = resolveOpenViewTarget(viewId);
		if (!id) return;
		const shellContext = this.shellContext;
		if (!shellContext) {
			console.warn("[HomeView] No shellContext; cannot open:", id);
			return;
		}
		if (typeof shellContext.openView === "function") Promise.resolve(shellContext.openView(id, opts)).catch((e) => console.warn("[HomeView] shellContext.openView failed", id, e));
		else if (typeof shellContext.navigate === "function") Promise.resolve(shellContext.navigate(id, opts)).catch((e) => console.warn("[HomeView] shellContext.navigate failed", id, e));
		else console.warn("[HomeView] shellContext has no navigate/openView; cannot open:", id);
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext ?? this.shellContext;
		}
		const root = document.createElement("section");
		root.className = "view-home env-home-workspace";
		root.dataset.view = "home";
		root.id = "home";
		setSpeedDialViewOpener((viewId, params) => {
			this.dispatchShellRoute(viewId, { params });
		});
		initializeOrientedDesktop(root);
		this.element = root;
		return root;
	}
	invokeChannelApi(action, payload) {
		if (action !== HomeChannelAction.Navigate && action !== HomeChannelAction.OpenView) return void 0;
		const viewId = typeof payload === "string" ? payload : payload && typeof payload === "object" && "viewId" in payload ? String(payload.viewId) : "";
		if (!viewId.trim()) return false;
		this.dispatchShellRoute(viewId.trim());
		return true;
	}
};
function createView(options) {
	return new HomeView(options);
}
var createHomeView = createView;
//#endregion
export { HomeView, createHomeView, createView, createView as default, initializeOrientedDesktop };
