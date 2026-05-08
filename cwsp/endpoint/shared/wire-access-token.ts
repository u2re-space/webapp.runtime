/**
 * Canonical access / control token on CWSP wire (unifies accessToken, control, master, hub, admin, legacy airpad).
 * Clients SHOULD send `accessToken` (query or `x-cws-access-token`); servers accept all aliases below.
 */

import type { IncomingHttpHeaders } from "node:http";

const trim = (value: unknown): string => String(value ?? "").trim();

/** First matching header wins (lowercase keys typical on Node). */
export const resolveAccessTokenFromHeaders = (headers: IncomingHttpHeaders | undefined): string => {
    if (!headers) return "";
    const get = (name: string): string => {
        const raw = headers[name.toLowerCase()] ?? headers[name];
        if (Array.isArray(raw)) return trim(raw[0]);
        return trim(raw);
    };
    return (
        get("x-cws-access-token") ||
        get("x-cws-control-token") ||
        get("x-cws-airpad-token") ||
        get("x-auth-token")
    );
};

/** First matching query param wins. */
export const resolveAccessTokenFromSearchParams = (params: URLSearchParams): string => {
    const keys = [
        "accessToken",
        "authToken", // legacy alias; prefer accessToken
        "controlToken",
        "adminToken",
        "masterToken",
        "hubToken",
        "airpadToken"
    ];
    for (const key of keys) {
        const v = trim(params.get(key));
        if (v) return v;
    }
    return "";
};

export const resolveWireAccessToken = (
    headers: IncomingHttpHeaders | undefined,
    searchParams: URLSearchParams
): string => {
    return resolveAccessTokenFromHeaders(headers) || resolveAccessTokenFromSearchParams(searchParams);
};
