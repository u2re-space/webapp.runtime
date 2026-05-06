import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { frameToPacket, packetToFrame } from "../socket/frame-v2.ts";
import {
    buildServerV2SocketHandshake,
    normalizeServerV2EndpointUrl,
    resolveServerV2WireIdentity
} from "./client-contract.ts";

type JsonRecord = Record<string, unknown>;

type CheckResult = {
    name: string;
    ok: boolean;
    detail: string;
};

const checks: CheckResult[] = [];

const addCheck = (name: string, ok: boolean, detail: string) => {
    checks.push({ name, ok, detail });
};

const readJson = (targetPath: string): JsonRecord => {
    const raw = fs.readFileSync(targetPath, "utf8");
    return JSON.parse(raw) as JsonRecord;
};

const asRecord = (value: unknown): JsonRecord => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as JsonRecord;
    }
    return {};
};

const asStringList = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map((entry) => String(entry || "").trim()).filter(Boolean);
};

const main = () => {
    const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
    const configDir = path.resolve(rootDir, "config");

    const clients = readJson(path.resolve(configDir, "clients.json"));
    const network = readJson(path.resolve(configDir, "network.json"));
    const gateways = readJson(path.resolve(configDir, "gateways.json"));
    const portableVds = readJson(path.resolve(configDir, "portable.config.vds.json"));

    // 1) Endpoint normalization and wire handshake compatibility.
    const normalizedEndpoint = normalizeServerV2EndpointUrl("https://45.147.121.152:8443/socket.io/?EIO=4&transport=websocket");
    addCheck(
        "normalize endpoint strips socket.io path",
        normalizedEndpoint === "https://45.147.121.152:8443/",
        `normalized=${normalizedEndpoint}`
    );

    const identity = resolveServerV2WireIdentity({
        endpointUrl: "https://45.147.121.152:8443/",
        userId: "L-192.168.0.196",
        deviceId: "L-192.168.0.196",
        token: "n3v3rm1nd",
        connectionType: "exchanger-initiator",
        archetype: "server-v2"
    });
    const handshake = buildServerV2SocketHandshake(identity);
    addCheck(
        "handshake emits first-order wire connectionType",
        handshake.query.connectionType === "first-order",
        `connectionType=${String(handshake.query.connectionType || "")}`
    );
    addCheck(
        "handshake carries auth token",
        handshake.query.token === "n3v3rm1nd" && handshake.auth.token === "n3v3rm1nd",
        `query.token=${String(handshake.query.token || "")}`
    );

    // 2) Canonical frame/packet roundtrip for clipboard transport.
    const clipboardFrame = packetToFrame(
        {
            op: "act",
            what: "clipboard:update",
            payload: { text: "compat-test" },
            destinations: ["L-192.168.0.110"],
            byId: "L-192.168.0.196",
            protocol: "ws"
        },
        "L-192.168.0.196"
    );
    const clipboardPacket = frameToPacket(clipboardFrame as JsonRecord);
    addCheck(
        "frame->packet keeps clipboard:update",
        clipboardPacket.what === "clipboard:update" && clipboardPacket.op === "act",
        `what=${String(clipboardPacket.what || "")} op=${String(clipboardPacket.op || "")}`
    );
    addCheck(
        "frame->packet keeps destination",
        Array.isArray(clipboardPacket.nodes) && clipboardPacket.nodes.includes("L-192.168.0.110"),
        `nodes=${JSON.stringify(clipboardPacket.nodes || [])}`
    );

    // 3) Node relation coverage: L-196 <-> L-110 + proxy H-200.
    const node196 = asRecord(clients["L-192.168.0.196"]);
    const node110 = asRecord(clients["L-192.168.0.110"]);
    const rel196 = asRecord(node196.relations);
    const rel110 = asRecord(node110.relations);
    addCheck(
        "clients config has direct relation L-196 -> L-110",
        typeof rel196["L-192.168.0.110"] === "string",
        `relation=${String(rel196["L-192.168.0.110"] || "")}`
    );
    addCheck(
        "clients config has direct relation L-110 -> L-196",
        typeof rel110["L-192.168.0.196"] === "string",
        `relation=${String(rel110["L-192.168.0.196"] || "")}`
    );

    const h200 = asRecord(gateways["H-192.168.0.200"]);
    const gatewayClients = asStringList(h200.clients);
    addCheck(
        "gateway H-200 includes L-110 and L-196",
        gatewayClients.includes("L-192.168.0.110") && gatewayClients.includes("L-192.168.0.196"),
        `clients=${gatewayClients.join(",")}`
    );

    // 4) Network endpoints/scheme matrix include all required lanes.
    const endpoints = asStringList(network.endpoints);
    const needEndpoints = [
        "https://45.147.121.152:8443/",
        "https://192.168.0.200:8443/",
        "https://192.168.0.110:8443/",
        "https://192.168.0.196:8443/"
    ];
    const missing = needEndpoints.filter((entry) => !endpoints.includes(entry));
    addCheck(
        "network endpoints include WAN+LAN route matrix",
        missing.length === 0,
        missing.length ? `missing=${missing.join(",")}` : "all-present"
    );

    // 5) VDS stock profile must map to L-192.168.0.196 + n3v3rm1nd.
    const vdsEnv = asRecord(portableVds.launcherEnv);
    addCheck(
        "portable.vds uses L-192.168.0.196 identity",
        String(vdsEnv.CWS_ASSOCIATED_ID || "") === "L-192.168.0.196",
        `id=${String(vdsEnv.CWS_ASSOCIATED_ID || "")}`
    );
    addCheck(
        "portable.vds uses n3v3rm1nd token",
        String(vdsEnv.CWS_ASSOCIATED_TOKEN || "") === "n3v3rm1nd",
        `token=${String(vdsEnv.CWS_ASSOCIATED_TOKEN || "")}`
    );
    addCheck(
        "portable.vds primary endpoint uses WAN gateway ingress",
        String(vdsEnv.CWS_BRIDGE_ENDPOINT_URL || "") === "https://45.147.121.152:8443/",
        `endpoint=${String(vdsEnv.CWS_BRIDGE_ENDPOINT_URL || "")}`
    );
    const vdsEndpoints = asStringList(vdsEnv.CWS_BRIDGE_ENDPOINTS);
    addCheck(
        "portable.vds endpoint candidates start with WAN gateway ingress",
        vdsEndpoints[0] === "https://45.147.121.152:8443/",
        `first=${String(vdsEndpoints[0] || "")}`
    );
    const vdsPreconnectTargets = asStringList(vdsEnv.CWS_BRIDGE_PRECONNECT_TARGETS);
    addCheck(
        "portable.vds preconnect targets only gateway relay",
        vdsPreconnectTargets.length === 1 && vdsPreconnectTargets[0] === "L-192.168.0.200",
        `targets=${vdsPreconnectTargets.join(",")}`
    );

    let failures = 0;
    for (const result of checks) {
        const mark = result.ok ? "PASS" : "FAIL";
        if (!result.ok) failures += 1;
        console.log(`[compat-matrix] ${mark} ${result.name} :: ${result.detail}`);
    }

    if (failures > 0) {
        console.error(`[compat-matrix] failed checks=${failures}/${checks.length}`);
        process.exit(1);
    }
    console.log(`[compat-matrix] all checks passed (${checks.length})`);
};

main();
