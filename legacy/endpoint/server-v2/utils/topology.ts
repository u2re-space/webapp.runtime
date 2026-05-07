export type NetworkAliasMap = Record<string, string>;

const normalizeAddress = (value: unknown): string => String(value || "").trim().toLowerCase();

export const normalizeNetworkAliasMap = (value: unknown): NetworkAliasMap => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const out: NetworkAliasMap = {};
    for (const [alias, rawTarget] of Object.entries(value as Record<string, unknown>)) {
        const normalizedAlias = normalizeAddress(alias);
        const normalizedTarget = normalizeAddress(rawTarget);
        if (!normalizedAlias || !normalizedTarget) continue;
        out[normalizedAlias] = normalizedTarget;
    }
    return out;
};

export const resolveNetworkAlias = (aliasMap: NetworkAliasMap | undefined, token: string): string => {
    const normalizedToken = normalizeAddress(token);
    if (!normalizedToken) return "";
    return aliasMap?.[normalizedToken] || normalizedToken;
};
