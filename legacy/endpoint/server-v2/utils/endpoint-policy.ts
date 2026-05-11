type EndpointIdFlags = {
    mobile?: boolean;
    gateway?: boolean;
    direct?: boolean;
    [key: string]: boolean | undefined;
};

export type EndpointTransportMode = "http" | "ws" | "socketio" | "tcp";
export type EndpointTransportDirection = "both" | "outbound" | "inbound";

export type EndpointTransportHint = {
    transports: EndpointTransportMode[];
    direction: EndpointTransportDirection;
};

export type EndpointIdPolicy = {
    id: string;
    origins: string[];
    tokens: string[];
    forward: string;
    ports?: Record<string, number[]>;
    modules?: Record<string, unknown>;
    flags: EndpointIdFlags;
    relations?: Record<string, EndpointTransportHint>;
    allowedIncoming: string[];
    allowedOutcoming: string[];
    roles: string[];
};

export type EndpointIdPolicyMap = Record<string, EndpointIdPolicy>;

const DEFAULT_TRANSPORTS: EndpointTransportMode[] = ["ws", "socketio", "http", "tcp"];

const normalizeToken = (value: unknown): string => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return "";
    return normalized.startsWith("{") && normalized.endsWith("}") ? normalized.slice(1, -1).trim() : normalized;
};

const hasRuleMatch = (ruleValue: string, candidate: string): boolean => {
    if (!ruleValue || !candidate) return false;
    if (ruleValue === "*" || candidate === "*") return true;
    return ruleValue === candidate || ruleValue.includes(candidate) || candidate.includes(ruleValue);
};

const normalizeList = (raw: unknown, wildcard = true): string[] => {
    if (raw == null) return wildcard ? ["*"] : [];
    const items = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/[;,]/) : [];
    const normalized = items.map((entry) => normalizeToken(entry)).filter(Boolean);
    if (!normalized.length && wildcard) return ["*"];
    return Array.from(new Set(normalized));
};

const normalizeTransport = (value: unknown): EndpointTransportMode | undefined => {
    const normalized = normalizeToken(value);
    if (normalized === "ws" || normalized === "websocket") return "ws";
    if (normalized === "socketio" || normalized === "socket.io" || normalized === "io") return "socketio";
    if (normalized === "http" || normalized === "https") return "http";
    if (normalized === "tcp" || normalized === "tcp4" || normalized === "tcp6") return "tcp";
    return undefined;
};

const normalizeDirection = (value: unknown): EndpointTransportDirection | undefined => {
    const normalized = normalizeToken(value);
    if (!normalized) return undefined;
    if (normalized === "both" || normalized === "bidi" || normalized === "bidirectional") return "both";
    if (["outbound", "out", "send", "source"].includes(normalized)) return "outbound";
    if (["inbound", "in", "target", "reverse"].includes(normalized)) return "inbound";
    return undefined;
};

const normalizeTransportHint = (raw: unknown): EndpointTransportHint | undefined => {
    if (raw == null) return undefined;
    if (typeof raw === "string" || Array.isArray(raw)) {
        const values = Array.isArray(raw) ? raw : String(raw).split(/[,\s;|]+/);
        const transports = values.map((entry) => normalizeTransport(entry)).filter((entry): entry is EndpointTransportMode => Boolean(entry));
        if (!transports.length) return undefined;
        return {
            transports: Array.from(new Set(transports)),
            direction: "both"
        };
    }
    if (typeof raw !== "object") return undefined;
    const source = raw as Record<string, unknown>;
    const values: unknown[] = [];
    if (Array.isArray(source.transports)) values.push(...source.transports);
    if (source.transport != null) values.push(source.transport);
    if (source.via != null) values.push(source.via);
    const transports = values.map((entry) => normalizeTransport(entry)).filter((entry): entry is EndpointTransportMode => Boolean(entry));
    if (!transports.length) return undefined;
    return {
        transports: Array.from(new Set(transports)),
        direction: normalizeDirection(source.direction ?? source.dir) || "both"
    };
};

const normalizeRelations = (raw: unknown): Record<string, EndpointTransportHint> => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out: Record<string, EndpointTransportHint> = {};
    for (const [target, hintRaw] of Object.entries(raw as Record<string, unknown>)) {
        const normalizedTarget = normalizeToken(target);
        const hint = normalizeTransportHint(hintRaw);
        if (!normalizedTarget || !hint) continue;
        out[normalizedTarget] = hint;
    }
    return out;
};

const normalizePorts = (raw: unknown): Record<string, number[]> => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out: Record<string, number[]> = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
        const ports = (Array.isArray(value) ? value : [])
            .map((entry) => Number(entry))
            .filter((entry) => Number.isFinite(entry) && entry > 0 && entry <= 65535)
            .map((entry) => Math.trunc(entry));
        if (ports.length) out[key.trim()] = Array.from(new Set(ports));
    }
    return out;
};

const normalizeFlags = (raw: unknown): EndpointIdFlags => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const source = raw as Record<string, unknown>;
    const flags: EndpointIdFlags = {};
    for (const [key, value] of Object.entries(source)) {
        if (typeof value === "boolean") flags[key] = value;
    }
    return flags;
};

const normalizePolicy = (id: string, raw: unknown): EndpointIdPolicy => {
    const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    return {
        id,
        origins: normalizeList(source.origins),
        tokens: normalizeList(source.tokens, false),
        forward: normalizeToken(source.forward) || "self",
        ports: normalizePorts(source.ports),
        modules: source.modules && typeof source.modules === "object" && !Array.isArray(source.modules) ? (source.modules as Record<string, unknown>) : undefined,
        flags: normalizeFlags(source.flags),
        relations: normalizeRelations(source.relations),
        allowedIncoming: normalizeList(source.allowedIncoming),
        allowedOutcoming: normalizeList(source.allowedOutcoming),
        roles: normalizeList(source.roles, false)
    };
};

export const normalizeEndpointPolicies = (raw: unknown): EndpointIdPolicyMap => {
    const source = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
    const out: EndpointIdPolicyMap = {};
    for (const [id, entry] of Object.entries(source)) {
        const normalizedId = normalizeToken(id);
        if (!normalizedId) continue;
        out[normalizedId] = normalizePolicy(normalizedId, entry);
    }
    if (!out["*"]) {
        out["*"] = normalizePolicy("*", {
            allowedIncoming: ["*"],
            allowedOutcoming: ["*"],
            forward: "self"
        });
    }
    return out;
};

export const resolveEndpointIdPolicyStrict = (policies: EndpointIdPolicyMap, raw: string): EndpointIdPolicy | undefined => {
    const normalized = normalizeToken(raw);
    if (!normalized) return undefined;
    if (policies[normalized] && normalized !== "*") return policies[normalized];
    for (const [id, policy] of Object.entries(policies)) {
        if (!id || id === "*") continue;
        const aliases = [...(policy.tokens || []), ...(policy.origins || [])];
        if (aliases.some((entry) => hasRuleMatch(entry, normalized) || hasRuleMatch(normalized, entry))) {
            return policy;
        }
    }
    return undefined;
};

const resolvePolicy = (policies: EndpointIdPolicyMap, raw: string): EndpointIdPolicy | undefined => {
    return resolveEndpointIdPolicyStrict(policies, raw) || policies["*"];
};

export const resolveEndpointTransportPreference = (
    sourceId: string,
    targetId: string,
    policies: EndpointIdPolicyMap
): EndpointTransportHint => {
    const sourcePolicy = resolvePolicy(policies, sourceId);
    const targetPolicy = resolvePolicy(policies, targetId);
    const normalizedTarget = normalizeToken(targetId);
    const normalizedSource = normalizeToken(sourceId);
    const relationHint =
        sourcePolicy?.relations?.[normalizedTarget] ||
        targetPolicy?.relations?.[normalizedSource] ||
        Object.entries(sourcePolicy?.relations || {}).find(([key]) => hasRuleMatch(key, normalizedTarget))?.[1] ||
        Object.entries(targetPolicy?.relations || {}).find(([key]) => hasRuleMatch(key, normalizedSource))?.[1];

    if (relationHint?.transports?.length) {
        return {
            direction: relationHint.direction || "both",
            transports: relationHint.transports
        };
    }

    return {
        direction: "both",
        transports: DEFAULT_TRANSPORTS
    };
};
