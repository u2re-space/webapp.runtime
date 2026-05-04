//#region src/frontend/views/types.ts
/**
* Create a simple view state persistence helper
*/
function createViewState(key) {
	return {
		load() {
			try {
				const stored = localStorage.getItem(key);
				return stored ? JSON.parse(stored) : null;
			} catch {
				return null;
			}
		},
		save(state) {
			try {
				localStorage.setItem(key, JSON.stringify(state));
			} catch {}
		},
		clear() {
			try {
				localStorage.removeItem(key);
			} catch {}
		}
	};
}
//#endregion
export { createViewState as t };
