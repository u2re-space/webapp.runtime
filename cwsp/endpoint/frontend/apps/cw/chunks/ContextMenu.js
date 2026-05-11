import { E as MOCElement } from "../fest/dom.js";
import { H as ctxMenuTrigger, Z as H } from "../com/app.js";
import { n as resolveOverlayMountPoint } from "../shells/slots.js";
//#region ../../modules/views/explorer-view/src/ts/ContextMenu.ts
/** WHY: Must sit above `.env-shell-chrome` (see environment-shell `_variables.scss` $z-shell-chrome ~2.1e9) and near `[data-env-shell-overlays]` pass-through layer. */
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var styleMounted = false;
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var IMP_CSS = "important";
/**
* WHY: Host apps load FL-UI native `button { … !important … }`; CSS files alone lose to style-attribute precedence.
* Stamping palette + transparent rows avoids “gray slab per row”.
*/
function stampUnifiedContextMenuPanelChrome(menu, compact) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	menu.style.setProperty("position", "fixed", IMP_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMP_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMP_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMP_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMP_CSS);
	menu.style.setProperty("border-radius", "14px", IMP_CSS);
	menu.style.setProperty("pointer-events", "auto", IMP_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menu.style.setProperty("backdrop-filter", "none", IMP_CSS);
	if (light) {
		menu.style.setProperty("border", "1px solid rgba(15, 23, 42, 0.14)", IMP_CSS);
		menu.style.setProperty("background", "rgba(241, 245, 249, 0.98)", IMP_CSS);
		menu.style.setProperty("color", "#0f172a", IMP_CSS);
		menu.style.setProperty("box-shadow", "0 14px 36px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.06)", IMP_CSS);
	} else {
		menu.style.setProperty("border", "1px solid rgba(255, 255, 255, 0.1)", IMP_CSS);
		menu.style.setProperty("background", "rgba(15, 23, 42, 0.97)", IMP_CSS);
		menu.style.setProperty("color", "#e8eaed", IMP_CSS);
		menu.style.setProperty("box-shadow", "0 14px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06)", IMP_CSS);
	}
}
function stampUnifiedContextMenuListChrome(list) {
	list.style.setProperty("list-style", "none", IMP_CSS);
	list.style.setProperty("list-style-type", "none", IMP_CSS);
	list.style.setProperty("margin", "0", IMP_CSS);
	list.style.setProperty("padding", "0", IMP_CSS);
	list.style.setProperty("display", "flex", IMP_CSS);
	list.style.setProperty("flex-direction", "column", IMP_CSS);
	list.style.setProperty("align-items", "stretch", IMP_CSS);
	list.style.setProperty("gap", "0.2rem", IMP_CSS);
	list.style.setProperty("width", "100%", IMP_CSS);
	list.style.setProperty("box-sizing", "border-box", IMP_CSS);
	list.style.setProperty("text-align", "left", IMP_CSS);
}
function stampUnifiedContextMenuLiChrome(li) {
	li.style.setProperty("list-style", "none", IMP_CSS);
	li.style.setProperty("list-style-type", "none", IMP_CSS);
	li.style.setProperty("margin", "0", IMP_CSS);
	li.style.setProperty("padding", "0", IMP_CSS);
	li.style.setProperty("width", "100%", IMP_CSS);
	li.style.setProperty("display", "block", IMP_CSS);
	li.style.setProperty("box-sizing", "border-box", IMP_CSS);
}
function stampUnifiedContextMenuRowChrome(button, danger) {
	const light = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches;
	button.style.setProperty("appearance", "none", IMP_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMP_CSS);
	button.style.setProperty("box-sizing", "border-box", IMP_CSS);
	button.style.setProperty("width", "100%", IMP_CSS);
	button.style.setProperty("max-width", "100%", IMP_CSS);
	button.style.setProperty("margin", "0", IMP_CSS);
	button.style.setProperty("display", "grid", IMP_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMP_CSS);
	button.style.setProperty("align-items", "center", IMP_CSS);
	button.style.setProperty("justify-items", "start", IMP_CSS);
	button.style.setProperty("gap", "0.55rem", IMP_CSS);
	button.style.setProperty("border-style", "none", IMP_CSS);
	button.style.setProperty("border-width", "0", IMP_CSS);
	button.style.setProperty("outline", "none", IMP_CSS);
	button.style.setProperty("border-radius", "10px", IMP_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMP_CSS);
	button.style.setProperty("min-height", "2.35rem", IMP_CSS);
	button.style.setProperty("font-family", "inherit", IMP_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMP_CSS);
	button.style.setProperty("font-weight", "400", IMP_CSS);
	button.style.setProperty("line-height", "1.25", IMP_CSS);
	button.style.setProperty("text-align", "start", IMP_CSS);
	button.style.setProperty("cursor", "pointer", IMP_CSS);
	button.style.setProperty("background", "none", IMP_CSS);
	button.style.setProperty("background-color", "transparent", IMP_CSS);
	button.style.setProperty("background-image", "none", IMP_CSS);
	button.style.setProperty("box-shadow", "none", IMP_CSS);
	button.style.setProperty("transition", "none", IMP_CSS);
	if (!danger) button.style.setProperty("color", "inherit", IMP_CSS);
	else if (light) button.style.setProperty("color", "#b91c1c", IMP_CSS);
	else button.style.setProperty("color", "#fca5a5", IMP_CSS);
}
var ensureStyle = () => {
	if (styleMounted) return;
	styleMounted = true;
	const style = document.createElement("style");
	style.id = "cw-unified-context-menu-style";
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: light dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.97);
            color: #e8eaed;
            box-shadow:
                0 14px 36px rgba(0, 0, 0, 0.45),
                0 0 0 1px rgba(255, 255, 255, 0.06);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu {
                border: 1px solid rgba(15, 23, 42, 0.14);
                background: rgba(241, 245, 249, 0.98);
                color: #0f172a;
                box-shadow:
                    0 14px 36px rgba(15, 23, 42, 0.12),
                    0 0 0 1px rgba(15, 23, 42, 0.06);
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        @media (prefers-color-scheme: light) {
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: rgba(15, 23, 42, 0.08) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: #fca5a5 !important;
        }

        @media (prefers-color-scheme: light) {
            .cw-context-menu__item--danger {
                color: #b91c1c !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be fully transparent — force currentColor.
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: inherit !important;
            --icon-color: currentColor !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        @supports (color: color-mix(in oklab, white 50%, black)) {
            .cw-context-menu {
                border: 1px solid color-mix(in oklab, var(--wf-md-outline-variant, transparent) 100%, transparent);
                background: color-mix(in oklab, var(--wf-md-surf-container, rgba(30, 41, 59, 0.92)) 96%, transparent);
                color: var(--wf-md-on-surface, var(--color-on-surface, inherit));
                box-shadow:
                    var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                    0 0 0 1px color-mix(in oklab, var(--wf-md-on-surface, #fff) 7%, transparent);
            }
            button.cw-context-menu__item:hover,
            .cw-context-menu button.cw-context-menu__item:hover,
            button.cw-context-menu__item:focus-visible,
            .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--wf-md-on-surface, #fff) 8%, transparent) !important;
            }
        }
    `;
	document.head.appendChild(style);
};
/** Re-run phosphor hydration after DOM connect (helps IO-deferred raster icons). */
function refreshContextMenuUiIcons(root) {
	if (typeof customElements !== "undefined" && typeof customElements.upgrade === "function") try {
		customElements.upgrade(root);
	} catch {}
	for (const node of root.querySelectorAll("ui-icon")) {
		const el = node;
		if (typeof el.updateIcon === "function") el.updateIcon.call(node);
	}
}
function appendUiIcon(target, iconName) {
	const el = document.createElement("ui-icon");
	el.setAttribute("icon", iconName);
	el.setAttribute("icon-style", "duotone");
	target.append(el);
}
var clearCleanup = () => {
	for (const fn of cleanupFns) try {
		fn();
	} catch {}
	cleanupFns = [];
};
var clearTimersFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuOpenTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuOpenTimers.delete(key);
	}
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var placeMenu = (menu, x, y) => {
	menu.style.left = `${x}px`;
	menu.style.top = `${y}px`;
	const rect = menu.getBoundingClientRect();
	const maxX = Math.max(8, window.innerWidth - rect.width - 8);
	const maxY = Math.max(8, window.innerHeight - rect.height - 8);
	menu.style.left = `${Math.min(Math.max(8, x), maxX)}px`;
	menu.style.top = `${Math.min(Math.max(8, y), maxY)}px`;
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var placeSubmenuWithFallback = (submenu, anchor) => {
	const rect = anchor.getBoundingClientRect();
	placeMenu(submenu, Math.round(rect.right + 4), Math.round(rect.top));
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampUnifiedContextMenuListChrome(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		placeSubmenuWithFallback(submenu, anchorButton);
	};
	const scheduleOpenSubmenu = (item, anchorButton, nextDepth) => {
		const existingOpen = submenuOpenTimers.get(nextDepth);
		if (existingOpen) clearTimeout(existingOpen);
		cancelScheduledCloseFromDepth(nextDepth);
		const timer = setTimeout(() => {
			submenuOpenTimers.delete(nextDepth);
			openSubmenu(item, anchorButton, nextDepth);
		}, SUBMENU_HOVER_OPEN_MS);
		submenuOpenTimers.set(nextDepth, timer);
	};
	const scheduleCloseSubmenuFromDepth = (nextDepth) => {
		const existingClose = submenuCloseTimers.get(nextDepth);
		if (existingClose) clearTimeout(existingClose);
		const timer = setTimeout(() => {
			submenuCloseTimers.delete(nextDepth);
			closeSubmenusFromDepth(nextDepth);
		}, SUBMENU_HOVER_CLOSE_MS);
		submenuCloseTimers.set(nextDepth, timer);
	};
	for (const item of entries) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `cw-context-menu__item${item.danger ? " cw-context-menu__item--danger" : ""}`;
		button.setAttribute("role", "menuitem");
		button.disabled = Boolean(item.disabled);
		const hasChildren = Boolean(item.children?.length);
		const iconWrap = document.createElement("span");
		iconWrap.className = "cw-context-menu__icon";
		if (item.icon) appendUiIcon(iconWrap, item.icon);
		const labelSpan = document.createElement("span");
		labelSpan.className = "cw-context-menu__label";
		labelSpan.textContent = item.label;
		const chevronWrap = document.createElement("span");
		chevronWrap.className = "cw-context-menu__chevron";
		if (hasChildren) appendUiIcon(chevronWrap, "caret-right");
		button.append(iconWrap, labelSpan, chevronWrap);
		stampUnifiedContextMenuRowChrome(button, Boolean(item.danger));
		if (hasChildren) {
			const nextDepth = depth + 1;
			button.setAttribute("aria-haspopup", "menu");
			button.addEventListener("pointerenter", () => scheduleOpenSubmenu(item, button, nextDepth));
			button.addEventListener("pointerleave", () => scheduleCloseSubmenuFromDepth(nextDepth));
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (session !== menuSession || !rootMenu?.isConnected) return;
				cancelScheduledCloseFromDepth(nextDepth);
				const existing = submenuByDepth.get(nextDepth);
				const activeAnchor = submenuAnchorByDepth.get(nextDepth);
				if (existing?.isConnected && activeAnchor === button) {
					closeSubmenusFromDepth(nextDepth);
					return;
				}
				openSubmenu(item, button, nextDepth);
			});
		} else button.addEventListener("click", async (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (session !== menuSession || !rootMenu?.isConnected) return;
			closeUnifiedContextMenu();
			if (item.disabled) return;
			await item.action();
		});
		const li = document.createElement("li");
		stampUnifiedContextMenuLiChrome(li);
		li.appendChild(button);
		list.appendChild(li);
	}
	stampUnifiedContextMenuPanelChrome(menu, compact);
	menu.addEventListener("pointerenter", () => cancelScheduledCloseFromDepth(depth));
	menu.addEventListener("pointerleave", () => {
		if (depth > 0) {
			const existingClose = submenuCloseTimers.get(depth);
			if (existingClose) clearTimeout(existingClose);
			const timer = setTimeout(() => {
				submenuCloseTimers.delete(depth);
				closeSubmenusFromDepth(depth);
			}, SUBMENU_HOVER_CLOSE_MS);
			submenuCloseTimers.set(depth, timer);
		}
	});
	return menu;
};
var closeUnifiedContextMenu = () => {
	clearCleanup();
	clearTimersFromDepth(0);
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	rootMenu?.remove();
	rootMenu = null;
	menuLayer?.remove();
	menuLayer = null;
	menuSession += 1;
};
var openUnifiedContextMenu = (request) => {
	const entries = (request.items || []).filter((item) => item && item.id && item.label);
	if (!entries.length) {
		closeUnifiedContextMenu();
		return;
	}
	ensureStyle();
	closeUnifiedContextMenu();
	const session = menuSession;
	const mount = request.resolveOverlayMountPoint?.(request.anchor ?? null) ?? resolveOverlayMountPoint(request.anchor ?? null);
	if (mount !== document.body) mount.style.pointerEvents = mount.style.pointerEvents || "none";
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	mount.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
	queueMicrotask(() => {
		if (session !== menuSession || !menu.isConnected) return;
		refreshContextMenuUiIcons(menu);
		requestAnimationFrame(() => {
			if (session !== menuSession || !menu.isConnected) return;
			refreshContextMenuUiIcons(menu);
		});
	});
	/**
	* WHY: `menuLayer.contains(event.target)` is false for nodes inside open shadow trees (e.g. ui-icon internals).
	* That made document-capture pointerdown treat in-menu presses as "outside" → menu removed before click fires.
	*/
	const eventPathTouchesOpenMenu = (event) => {
		if (!menuLayer?.isConnected || !rootMenu) return false;
		const rawPath = typeof event.composedPath === "function" ? event.composedPath() : [];
		const path = Array.isArray(rawPath) && rawPath.length ? rawPath : [];
		for (const node of path) {
			if (!(node instanceof Element)) continue;
			if (node === menuLayer || node === rootMenu) return true;
			if (menuLayer.contains(node)) return true;
			if (node.classList?.contains?.("cw-context-menu") || node.closest?.(".cw-context-menu")) return true;
		}
		const t = event.target;
		if (t instanceof Node && menuLayer.contains(t)) return true;
		if (t instanceof Element && t.closest?.(".cw-context-menu")) return true;
		return false;
	};
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		if (eventPathTouchesOpenMenu(event)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		let parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem && typeof event.composedPath === "function") {
			for (const node of event.composedPath()) if (node instanceof Element && node.classList?.contains?.("cw-context-menu__item")) {
				parentItem = node;
				break;
			}
		}
		if (!parentItem) {
			closeSubmenusFromDepth(1);
			return;
		}
		if (!(parentItem.getAttribute("aria-haspopup") === "menu")) closeSubmenusFromDepth(1);
	};
	const onEscape = (event) => {
		if (session !== menuSession) return;
		if (event.key === "Escape") closeUnifiedContextMenu();
	};
	const close = () => closeUnifiedContextMenu();
	queueMicrotask(() => {
		if (session !== menuSession) return;
		document.addEventListener("pointerdown", onPointerDown, { capture: true });
		document.addEventListener("contextmenu", onPointerDown, { capture: true });
		document.addEventListener("keydown", onEscape);
		menu.addEventListener("click", onMenuInternalClick, { capture: true });
		window.addEventListener("resize", close, { passive: true });
		window.addEventListener("blur", close, { passive: true });
		cleanupFns.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("contextmenu", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("keydown", onEscape));
		cleanupFns.push(() => menu.removeEventListener("click", onMenuInternalClick, { capture: true }));
		cleanupFns.push(() => window.removeEventListener("resize", close));
		cleanupFns.push(() => window.removeEventListener("blur", close));
	});
};
var disconnectRegistry = new FinalizationRegistry((ctxMenu) => {});
var makeFileActionOps = () => {
	return [
		{
			id: "open",
			label: "Open",
			icon: "function"
		},
		{
			id: "view",
			label: "View",
			icon: "eye"
		},
		{
			id: "view-base",
			label: "View (Base tab)",
			icon: "arrow-square-out"
		},
		{
			id: "attach-workcenter",
			label: "Attach to Work Center",
			icon: "lightning"
		},
		{
			id: "attach-workcenter-queued",
			label: "Queue attach (pending)",
			icon: "clock-counter-clockwise"
		},
		{
			id: "attach-workcenter-headless",
			label: "Queue attach (headless)",
			icon: "wave-sine"
		},
		{
			id: "pin-home",
			label: "Pin to Home Screen",
			icon: "push-pin-simple"
		},
		{
			id: "download",
			label: "Download",
			icon: "download"
		}
	];
};
var makeFileSystemOps = () => {
	return [
		{
			id: "delete",
			label: "Delete",
			icon: "trash"
		},
		{
			id: "rename",
			label: "Rename",
			icon: "pencil"
		},
		{
			id: "copyPath",
			label: "Copy Path",
			icon: "copy"
		},
		{
			id: "movePath",
			label: "Move Path",
			icon: "hand-withdraw"
		}
	];
};
var makeContextMenu = (anchor) => {
	const ctxMenu = H`<ul class="round-decor ctx-menu ux-anchor" style="position: fixed; z-index: 99999;" data-hidden></ul>`;
	resolveOverlayMountPoint(anchor ?? null).append(ctxMenu);
	return ctxMenu;
};
var createItemCtxMenu = async (fileManager, onMenuAction, entries) => {
	const ctxMenuDesc = {
		openedWith: null,
		items: [makeFileActionOps(), makeFileSystemOps()],
		defaultAction: (initiator, menuItem, ev) => {
			const rowFromCompose = Array.from(ev?.composedPath?.() || []).find((element) => element?.classList?.contains?.("row")) || MOCElement(initiator, ".row");
			onMenuAction?.((entries?.value ?? entries)?.find?.((item) => item?.name === rowFromCompose?.getAttribute?.("data-id")), menuItem?.id, ev);
		}
	};
	const initiatorElement = fileManager;
	const ctxMenu = makeContextMenu(initiatorElement);
	ctxMenuTrigger(initiatorElement, ctxMenuDesc, ctxMenu);
	disconnectRegistry.register(initiatorElement, ctxMenu);
	return ctxMenu;
};
//#endregion
export { createItemCtxMenu as n, openUnifiedContextMenu as r, closeUnifiedContextMenu as t };
