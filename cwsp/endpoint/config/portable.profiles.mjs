export const PORTABLE_CORE_PAYLOAD = {
    version: 2,
    core: {
        endpointIDs: "fs:./clients.json",
        gateways: "fs:./gateways.json",
        network: "fs:./network.json",
        identity: {
            byId: true,
            aliases: true
        },
        tunnel: {
            enabled: true,
            keepalive: true,
            keepaliveIntervalMs: 15000
        }
    }
};

export const PORTABLE_ENDPOINT_PAYLOAD = {
    version: 2,
    endpoint: {
        routing: {
            byId: true,
            aliases: true,
            reverseTunnel: true
        },
        websocket: {
            keepalive: true,
            keepaliveIntervalMs: 15000,
            staleAfterMs: 45000
        }
    }
};

export const PORTABLE_MODULES_BY_SCOPE = {
    rootLike: {
        clients: "fs:./config/clients.json",
        gateways: "fs:./config/gateways.json",
        endpointIDs: "fs:./config/clients.json",
        network: "fs:./config/network.json",
        core: "fs:./config/portable-core.json",
        endpoint: "fs:./config/portable-endpoint.json"
    },
    configDir: {
        clients: "fs:./clients.json",
        gateways: "fs:./gateways.json",
        endpointIDs: "fs:./clients.json",
        network: "fs:./network.json",
        core: "fs:./portable-core.json",
        endpoint: "fs:./portable-endpoint.json"
    },
    portableDir: {
        clients: "fs:../config/clients.json",
        gateways: "fs:../config/gateways.json",
        endpointIDs: "fs:../config/clients.json",
        network: "fs:../config/network.json",
        core: "fs:../config/portable-core.json",
        endpoint: "fs:../config/portable-endpoint.json"
    }
};

export const PORTABLE_CONFIG_PROFILES = {
    "config/portable.config.json": {
        modulesScope: "configDir",
        envConfigPath: "./config/portable.config.json",
        remote: {
            pathCandidates: [
                "C:/Users/U2RE/endpoint-portable",
                "C:/Users/U2RE/cwsp-server",
                "/home/u2re-dev/U2RE.space/runtime/cwsp/endpoint",
                "/home/u2re-dev/cwsp-server"
            ]
        }
    },
    "config/portable.config.110.json": {
        modulesScope: "configDir",
        envConfigPath: "./config/portable.config.110.json",
        remote: {
            pathCandidates: [
                "C:/Users/U2RE/endpoint-portable",
                "C:/Users/U2RE/cwsp-server",
                "C:/Users/U2RE/U2RE.space/runtime/cwsp/endpoint"
            ]
        }
    },
    "config/portable.config.vds.json": {
        modulesScope: "configDir",
        envConfigPath: "./config/portable.config.vds.json",
        remote: {
            pathCandidates: [
                "/root/endpoint-portable",
                "/root/cwsp-server",
                "/home/u2re-dev/U2RE.space/runtime/cwsp/endpoint"
            ]
        }
    }
};
