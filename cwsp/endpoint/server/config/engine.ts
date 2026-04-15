/**
 * Thin runtime engine derived from the resolved portable config snapshot.
 *
 * The engine packages the raw snapshot together with normalized endpoint
 * policies, alias maps, and a compact profile that other server modules can
 * consume without reinterpreting config on every call.
 */
import config from "./config.ts";
import { createServerV2ConfigStorage } from "./storage.ts";
import {
    normalizeEndpointPolicies,
    type EndpointIdPolicyMap
} from "@utils/endpoint-policy.ts";
import { normalizeNetworkAliasMap, type NetworkAliasMap } from "@utils/topology.ts";

type ServerV2Transport =
    | "http"
    | "https"
    | "ws"
    | "socketio"
    | "bridge";

export type ServerV2RuntimeProfile = {
    bridgeEnabled: boolean;
    bridgeMode: string;
    httpPort?: number;
    httpsPort?: number;
    /** Public site HTTPS (default 443 when TLS). */
    publicListenPort?: number;
    /** Public site HTTP (default 80 when plain HTTP). */
    publicHttpPort?: number;
    policyCount: number;
    roles: string[];
    topologyLinks: number;
    topologyNodes: number;
    transports: ServerV2Transport[];
};

const uniqueStrings = (items: unknown[]): string[] => {
    const values = items
        .map((item) => String(item || "").trim())
        .filter(Boolean);
    return Array.from(new Set(values));
};

const collectTransports = (snapshot: Record<string, any>): ServerV2Transport[] => {
    const transports = new Set<ServerV2Transport>();
    if (Number.isFinite(snapshot?.httpPort)) {
        transports.add("http");
        transports.add("ws");
        transports.add("socketio");
    }
    if (Number.isFinite(snapshot?.publicHttpPort)) {
        transports.add("http");
        transports.add("ws");
        transports.add("socketio");
    }
    if (Number.isFinite(snapshot?.listenPort)) {
        transports.add("https");
        transports.add("ws");
        transports.add("socketio");
    }
    if (Number.isFinite(snapshot?.publicListenPort)) {
        transports.add("https");
        transports.add("ws");
        transports.add("socketio");
    }
    if (snapshot?.bridge?.enabled !== false) {
        transports.add("bridge");
    }
    return Array.from(transports);
};

const resolveRoles = (snapshot: Record<string, any>): string[] => {
    return uniqueStrings(Array.isArray(snapshot?.roles) ? snapshot.roles : []);
};

export type ServerV2Engine = ReturnType<typeof createServerV2Engine>;

/** Build the normalized runtime view used by Fastify, socket transport, and admin handlers. */
export const createServerV2Engine = () => {
    const storage = createServerV2ConfigStorage();
    const snapshot = storage.readSnapshot();
    const policyMap: EndpointIdPolicyMap = normalizeEndpointPolicies(snapshot?.endpointIDs || {});
    const aliasMap: NetworkAliasMap = normalizeNetworkAliasMap(
        snapshot?.networkAliases || snapshot?.networkAliasMap || {}
    );

    const profile: ServerV2RuntimeProfile = {
        bridgeEnabled: snapshot?.bridge?.enabled !== false,
        bridgeMode: String(snapshot?.bridge?.mode || "active"),
        httpPort: Number.isFinite(snapshot?.httpPort) ? Number(snapshot.httpPort) : undefined,
        httpsPort: Number.isFinite(snapshot?.listenPort) ? Number(snapshot.listenPort) : undefined,
        publicListenPort: Number.isFinite(snapshot?.publicListenPort) ? Number(snapshot.publicListenPort) : undefined,
        publicHttpPort: Number.isFinite(snapshot?.publicHttpPort) ? Number(snapshot.publicHttpPort) : undefined,
        policyCount: Object.keys(policyMap).length,
        roles: resolveRoles(snapshot),
        topologyLinks: Array.isArray(snapshot?.topology?.links) ? snapshot.topology.links.length : 0,
        topologyNodes: Array.isArray(snapshot?.topology?.nodes) ? snapshot.topology.nodes.length : 0,
        transports: collectTransports(snapshot)
    };

    return {
        aliasMap,
        config: snapshot,
        policyMap,
        profile,
        storage
    };
};

export { config };
