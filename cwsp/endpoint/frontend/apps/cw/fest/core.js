//#region ../../modules/projects/core.ts/src/utils/Convert.ts
/**
* Orientation-space transforms for grids and drag vectors.
* Used by `GridItemUtils` / `resolveLocalPointToGridCell` and `fest/dom` launcher hit-testing.
*
* Convert position from client space to orientation space.
* @param pos_in_cs - Position in client space [x, y]
* @param size_in_cs - Size in client space [width, height]
* @param or_i - Orientation index (0=normal, 1=90° swapped, 2=180°, 3=270° swapped)
* @returns Position in orientation space [x, y]
*/
var cvt_cs_to_os = (pos_in_cs, size_in_cs, or_i = 0) => {
	const size_in_os = [...size_in_cs];
	const pos_in_swap = [...pos_in_cs];
	if (or_i % 2) {
		pos_in_swap.reverse();
		size_in_os.reverse();
	}
	return [(or_i == 0 || or_i == 3 ? pos_in_swap[0] : size_in_os[0] - pos_in_swap[0]) || 0, (or_i == 0 || or_i == 1 ? pos_in_swap[1] : size_in_os[1] - pos_in_swap[1]) || 0];
};
//#endregion
//#region ../../modules/projects/core.ts/src/utils/GridItemUtils.ts
/** Canonical `[columns, rows]` for launcher / speed-dial style grids. */
var normalizeGridLayout = (layout, fallback = [4, 8]) => {
	if (Array.isArray(layout) && layout.length >= 2) return [Math.max(1, Math.floor(Number(layout[0]) || fallback[0])), Math.max(1, Math.floor(Number(layout[1]) || fallback[1]))];
	if (layout && typeof layout === "object") {
		const o = layout;
		return [Math.max(1, Math.floor(Number(o.columns) || fallback[0])), Math.max(1, Math.floor(Number(o.rows) || fallback[1]))];
	}
	return [fallback[0], fallback[1]];
};
/** Clamp cell indices to grid bounds (inclusive). */
var clampGridCellTuple = (cell, layout) => {
	const [cols, rows] = normalizeGridLayout(layout);
	return [Math.max(0, Math.min(cols - 1, Math.floor(Number(cell[0]) || 0))), Math.max(0, Math.min(rows - 1, Math.floor(Number(cell[1]) || 0)))];
};
/**
* Point in grid **local** CSS pixels (origin top-left of grid content box), orientation index from `orientOf(grid)`.
* Used by launcher hit-testing; DOM wrappers live in `fest/dom`.
*/
var resolveLocalPointToGridCell = (localPx, size, layout, orient, options) => {
	const L = normalizeGridLayout(layout);
	const w = Math.max(1, size[0] || 1);
	const h = Math.max(1, size[1] || 1);
	const osCoord = cvt_cs_to_os(localPx, [w, h], orient);
	const normalizedArgs = {
		item: options?.redirect?.item ?? { id: "" },
		list: options?.redirect?.list ?? [],
		items: options?.redirect?.items ?? /* @__PURE__ */ new Map(),
		layout: L,
		size: [w, h]
	};
	const projected = convertOrientPxToCX(osCoord, normalizedArgs, orient);
	return clampGridCellTuple(redirectCell((options?.mode ?? "floor") === "round" ? [Math.round(projected[0]), Math.round(projected[1])] : [Math.floor(projected[0]), Math.floor(projected[1])], normalizedArgs), L);
};
/** Normalize grid item collections for algorithms that expect an array (Orient desktop uses `Map`, SpeedDial uses arrays). */
var gridItemsAsArray = (items) => {
	if (items == null) return [];
	if (Array.isArray(items)) return items;
	if (items instanceof Map) return Array.from(items.values());
	if (items instanceof Set) return Array.from(items);
	if (typeof items[Symbol.iterator] === "function") return Array.from(items);
	return [];
};
/**
* Find a non-busy cell near the preferred cell in a grid layout.
* If the preferred cell is busy, searches nearby cells to find an available one.
* @param $preCell - Preferred cell coordinates [column, row]
* @param gridArgs - Grid arguments containing items, layout, and size information
* @returns Cell coordinates [column, row] that are not busy
*/
var redirectCell = ($preCell, gridArgs) => {
	const layout = normalizeGridLayout(gridArgs?.layout ?? [4, 8]);
	const normalizedArgs = {
		...gridArgs,
		layout
	};
	const icons = gridItemsAsArray(normalizedArgs?.items);
	const item = normalizedArgs?.item || {};
	const checkBusy = (cell) => {
		return icons.filter((e) => !(e == item || e?.id == item?.id)).some((one) => (one?.cell?.[0] || 0) == (cell[0] || 0) && (one?.cell?.[1] || 0) == (cell[1] || 0));
	};
	const preCell = [...$preCell];
	if (!checkBusy(preCell)) return [...preCell];
	const columns = layout[0] || 4;
	const rows = layout[1] || 8;
	const suitable = ([
		[preCell[0] + 1, preCell[1]],
		[preCell[0] - 1, preCell[1]],
		[preCell[0], preCell[1] + 1],
		[preCell[0], preCell[1] - 1]
	].filter((v) => {
		return v[0] >= 0 && v[0] < columns && v[1] >= 0 && v[1] < rows;
	}) || []).find((v) => !checkBusy(v));
	if (suitable) return [...suitable];
	let exceed = 0, busy = true, comp = [...preCell];
	while (busy && exceed++ < columns * rows) {
		if (!(busy = checkBusy(comp))) return [...comp];
		comp[0]++;
		if (comp[0] >= columns) {
			comp[0] = 0;
			comp[1]++;
			if (comp[1] >= rows) comp[1] = 0;
		}
	}
	return [...preCell];
};
var convertOrientPxToCX = ($orientPx, gridArgs, orient = 0) => {
	const boxInPx = [...gridArgs.size];
	const orientPx = [...$orientPx];
	const layout = normalizeGridLayout(gridArgs.layout ?? [4, 8]);
	if (orient % 2) boxInPx.reverse();
	const gridPxToCX = [layout[0] / boxInPx[0], layout[1] / boxInPx[1]];
	return [orientPx[0] * gridPxToCX[0], orientPx[1] * gridPxToCX[1]];
};
//#endregion
//#region ../../modules/projects/core.ts/src/utils/UserPath.ts
var normalizeSlashes = (input) => {
	const value = String(input ?? "").trim();
	if (!value) return "/";
	return (value.startsWith("/") ? value : `/${value}`).replace(/\/+/g, "/");
};
var isUserScopePath = (input) => {
	const normalized = normalizeSlashes(input);
	return normalized === "/user" || normalized.startsWith("/user/");
};
var stripUserScopePrefix = (input) => {
	const normalized = normalizeSlashes(input);
	if (normalized === "/user") return "/";
	if (normalized.startsWith("/user/")) return normalized.slice(5) || "/";
	return normalized;
};
var userPathCandidates = (input) => {
	const normalized = normalizeSlashes(input);
	const stripped = stripUserScopePrefix(normalized);
	if (isUserScopePath(normalized)) return Array.from(new Set([stripped, normalized]));
	return [stripped];
};
//#endregion
export { redirectCell as a, normalizeGridLayout as i, stripUserScopePrefix as n, resolveLocalPointToGridCell as o, userPathCandidates as r, isUserScopePath as t };
