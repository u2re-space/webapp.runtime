/**
 * True when {@link candidate} matches the endpoint master/control secret (same as HTTP transport /devices checks).
 * Used to allow access-token-only sessions when the associated peer {@code userKey} is omitted.
 */

import config from "@config/config.ts";

const normalizeToken = (value: unknown): string => String(value ?? "").trim().toLowerCase();

export const matchesEndpointControlToken = (candidate: unknown): boolean => {
    const t = normalizeToken(candidate);
    if (!t) return false;
    const secret = normalizeToken((config as { secret?: unknown })?.secret);
    return Boolean(secret && secret === t);
};
