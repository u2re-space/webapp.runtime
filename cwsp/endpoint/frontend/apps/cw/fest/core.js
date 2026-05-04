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
export { stripUserScopePrefix as n, userPathCandidates as r, isUserScopePath as t };
