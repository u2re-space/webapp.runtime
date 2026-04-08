/**
 * Normalize IPv4/IPv6-ish strings for comparisons (clipboard HTTP, socket peer match).
 * Mirrors legacy behavior in routes.ts.
 */
export const normalizeIpForMatch = (value: string): string => {
    const trimmed = String(value || "").trim().toLowerCase();
    if (!trimmed) return "";
    const first = trimmed.split(",")[0]?.trim() || trimmed;
    const noZone = first.split("%")[0];
    const noBrackets = noZone.replace(/^\[(.*)\]$/, "$1");
    const noV4Prefix = noBrackets.replace(/^::ffff:/, "");
    if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(noV4Prefix)) {
        return noV4Prefix.replace(/:\d+$/, "");
    }
    return noV4Prefix;
};
