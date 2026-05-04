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
    /**
     * Per-lane role specializations (config `Protocols` / `protocols`).
     * Keys: canonical lanes `websocket`, `http`, `socketio`, `tcp`, or other lowercase tokens.
     * Values: allowed archetypes for that lane (`requestor`, `initiator`, `initiated`, `responser`, `exchanger`, …).
     */
    protocols?: Record<string, string[]>;
};

export type EndpointIdPolicyMap = Record<string, EndpointIdPolicy>;

// WHY: native `/ws` is the canonical transport, so HTTP/TCP should be tried
// before the legacy Socket.IO compatibility layer unless a relation overrides it.
const DEFAULT_TRANSPORTS: EndpointTransportMode[] = ["ws", "http", "tcp", "socketio"];

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

const mergeIdentifierLists = (...parts: unknown[]): string[] => {
    const bucket = new Set<string>();
    for (const part of parts) {
        for (const entry of normalizeList(part, false)) {
            if (entry) bucket.add(entry);
        }
    }
    return Array.from(bucket);
};

const mergeOriginLists = (...parts: unknown[]): string[] => {
    const bucket = new Set<string>();
    let anyDefined = false;
    for (const part of parts) {
        if (part === undefined) continue;
        anyDefined = true;
        for (const entry of normalizeList(part, false)) {
            if (entry) bucket.add(entry);
        }
    }
    const merged = Array.from(bucket);
    if (merged.length) return merged;
    return anyDefined ? normalizeList([], false) : normalizeList(undefined);
};

const normalizeProtocolLaneKey = (key: string): string => {
    const k = normalizeToken(key);
    if (!k) return "";
    if (k === "websocket" || k === "ws" || k === "wss") return "websocket";
    if (k === "http" || k === "https") return "http";
    if (k === "socketio" || k === "socket.io" || k === "io") return "socketio";
    if (k === "tcp" || k === "tcp4" || k === "tcp6") return "tcp";
    return k;
};

/**
 * Normalize `protocols` / `Protocols` from endpoint JSON into canonical lane → role lists.
 * Merges `ws`/`wss`/`websocket` and `http`/`https` into `websocket` and `http` respectively.
 */
export const extractNormalizedProtocols = (source: Record<string, unknown>): Record<string, string[]> | undefined => {
    const lowerRec =
        source.protocols && typeof source.protocols === "object" && !Array.isArray(source.protocols)
            ? (source.protocols as Record<string, unknown>)
            : {};
    const upperRec =
        source.Protocols && typeof source.Protocols === "object" && !Array.isArray(source.Protocols)
            ? (source.Protocols as Record<string, unknown>)
            : {};
    const merged: Record<string, unknown> = { ...lowerRec, ...upperRec };
    if (!Object.keys(merged).length) return undefined;

    const out: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(merged)) {
        const lane = normalizeProtocolLaneKey(key);
        if (!lane) continue;
        const roles = normalizeList(value, false);
        if (!roles.length) continue;
        out[lane] = out[lane] ? Array.from(new Set([...out[lane], ...roles])) : roles;
    }
    return Object.keys(out).length ? out : undefined;
};

/** If `policy.protocols` is set, require lane role (or `*`). If unset, allow all (legacy configs). */
export const endpointSupportsProtocolRole = (policy: EndpointIdPolicy | undefined, lane: string, role: string): boolean => {
    if (!policy?.protocols || !Object.keys(policy.protocols).length) return true;
    const rn = normalizeToken(role);
    if (!rn) return false;
    const ln = normalizeToken(lane);
    const canonicalLane =
        ln === "ws" || ln === "wss" || ln === "websocket" ? "websocket" : ln === "http" || ln === "https" ? "http" : ln;
    const laneRoles = policy.protocols[canonicalLane];
    if (!laneRoles?.length) return true;
    return laneRoles.includes("*") || laneRoles.includes(rn);
};

const forwardFromSource = (source: Record<string, unknown>): string => {
    const direct = normalizeToken(source.forward);
    if (direct) return direct;
    const df = source.DirectForward;
    if (Array.isArray(df)) {
        for (const entry of df) {
            if (typeof entry === "string") {
                const t = normalizeToken(entry);
                if (t) return t;
            }
            if (entry && typeof entry === "object") {
                const id = normalizeToken((entry as Record<string, unknown>).id);
                const target = normalizeToken((entry as Record<string, unknown>).target);
                if (id) return id;
                if (target) return target;
            }
        }
        return "self";
    }
    if (typeof df === "string" && df.trim()) return normalizeToken(df) || "self";
    return "self";
};

const normalizePolicy = (id: string, raw: unknown): EndpointIdPolicy => {
    const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const originParts = mergeOriginLists(source.origins, source.allowedOrigins, source.Origins);
    const tokenParts = mergeIdentifierLists(
        source.tokens,
        source.allowedIdentify,
        typeof source.Identifier === "string" ? [source.Identifier] : source.Identifier,
        typeof source.AccessToken === "string" ? [source.AccessToken] : source.AccessToken
    );
    return {
        id,
        origins: originParts,
        tokens: tokenParts,
        forward: forwardFromSource(source),
        ports: normalizePorts(source.ports ?? source.Ports),
        modules: source.modules && typeof source.modules === "object" && !Array.isArray(source.modules) ? (source.modules as Record<string, unknown>) : undefined,
        flags: normalizeFlags(source.flags ?? source.Flags),
        relations: normalizeRelations(source.relations),
        allowedIncoming: normalizeList(source.allowedIncoming),
        allowedOutcoming: normalizeList(source.allowedOutcoming ?? source.allowedOutgoing ?? source.allowedForwards),
        roles: normalizeList(source.roles ?? source.Roles, false),
        protocols: extractNormalizedProtocols(source)
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
