//#region ../../modules/projects/subsystem/types.ts
var safeParse = (raw) => {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
};
function createViewState(key, storage = globalThis.localStorage) {
	return {
		load: () => safeParse(storage?.getItem?.(key) ?? null),
		save: (next) => {
			storage?.setItem?.(key, JSON.stringify(next));
		},
		clear: () => {
			storage?.removeItem?.(key);
		}
	};
}
//#endregion
export { createViewState as t };
