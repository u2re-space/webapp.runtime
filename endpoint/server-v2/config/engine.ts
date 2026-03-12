import config from "./config.ts";
import { createServerV2ConfigStorage } from "./storage.ts";
import {
    normalizeEndpointPolicies,
    type EndpointIdPolicyMap
} from "../../server/network/stack/endpoint-policy.ts";
import { normalizeNetworkAliasMap, type NetworkAliasMap } from "../../server/network/stack/topology.ts";

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
    if (Number.isFinite(snapshot?.listenPort)) {
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
