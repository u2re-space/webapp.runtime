import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import WebSocket from "ws";

import type { Packet } from "../socket/types.ts";
import {
    buildClipboardPacket,
    buildHelloPacket,
    buildPacketReply,
    buildServerV2SocketHandshake,
    extractClipboardText,
    normalizePacketForWire,
    normalizeWireNodeId,
    resolveServerV2WireIdentity
} from "../socket/client-contract.ts";

type CliOptions = {
    clipboardText: string;
    configPath: string;
    deviceId: string;
    endpointUrl: string;
    exitIdleMs: number;
    label: string;
    once: boolean;
    targetIds: string[];
    token: string;
    userId: string;
};

type RuntimeSnapshot = {
    launcherEnv?: Record<string, unknown>;
};

const parseList = (value: string): string[] => {
    return String(value || "")
        .split(/[;,]/)
        .map((entry) => normalizeWireNodeId(entry))
        .filter(Boolean);
};

const parseBooleanFlag = (value: string): boolean => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

const parseCliOptions = (): CliOptions => {
    const args = process.argv.slice(2);
    const readValue = (flag: string): string => {
        const index = args.findIndex((entry) => entry === flag || entry.startsWith(`${flag}=`));
        if (index < 0) return "";
        const current = args[index];
        if (current.startsWith(`${flag}=`)) {
            return current.slice(flag.length + 1).trim();
        }
        return String(args[index + 1] || "").trim();
    };
    return {
        clipboardText: readValue("--clipboard-text") || "compat-clipboard-test",
        configPath: readValue("--config") || String(process.env.CWS_PORTABLE_CONFIG_PATH || "").trim(),
        deviceId: normalizeWireNodeId(readValue("--device-id") || String(process.env.CWS_FAKE_CLIENT_DEVICE_ID || "").trim()),
        endpointUrl: readValue("--endpoint-url") || String(process.env.CWS_FAKE_CLIENT_ENDPOINT_URL || "").trim(),
        exitIdleMs: Number(readValue("--exit-idle-ms") || process.env.CWS_FAKE_CLIENT_EXIT_IDLE_MS || 12000) || 12000,
        label: readValue("--label") || "vds-fake-client-ws",
        once: parseBooleanFlag(readValue("--once") || String(process.env.CWS_FAKE_CLIENT_ONCE || "true")),
        targetIds: parseList(readValue("--targets") || String(process.env.CWS_FAKE_CLIENT_TARGETS || "L-192.168.0.110")),
        token: readValue("--token") || String(process.env.CWS_FAKE_CLIENT_TOKEN || "").trim(),
        userId: normalizeWireNodeId(readValue("--user-id") || String(process.env.CWS_FAKE_CLIENT_USER_ID || "").trim())
    };
};

const parseUrlList = (value: string): string[] => {
    return String(value || "")
        .split(/[;,]/)
        .map((entry) => String(entry || "").trim())
        .filter(Boolean);
};

const normalizePortableConfigPath = (configPath: string): string => {
    if (!configPath) return "";
    return path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
};

const emitLog = (label: string, event: string, details: Record<string, unknown> = {}) => {
    console.log(JSON.stringify({
        ts: new Date().toISOString(),
        label,
        event,
        ...details
    }));
};

const toWsUrl = (endpointUrl: string, query: Record<string, string>): string => {
    const parsed = new URL(endpointUrl);
    parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    parsed.pathname = "/ws";
    parsed.search = "";
    for (const [key, value] of Object.entries(query)) {
        if (!key || !value) continue;
        parsed.searchParams.set(key, value);
    }
    return parsed.toString();
};

const parsePacket = (raw: WebSocket.RawData): Packet | null => {
    try {
        const text = typeof raw === "string" ? raw : raw.toString("utf8");
        const decoded = JSON.parse(text) as Record<string, unknown>;
        if (decoded && typeof decoded === "object" && decoded.event && decoded.payload) {
            return decoded.payload as Packet;
        }
        return decoded as Packet;
    } catch {
        return null;
    }
};

const toRuntimeOp = (value: unknown): string => {
    const op = String(value || "").trim().toLowerCase();
    if (op === "request") return "ask";
    if (op === "response") return "result";
    if (op === "notify" || op === "signal" || op === "redirect") return "act";
    return op;
};

const main = async () => {
    const options = parseCliOptions();
    const absoluteConfigPath = normalizePortableConfigPath(
        options.configPath || process.env.CWS_PORTABLE_CONFIG_PATH || "./portable.config.json"
    );
    const portableConfig = JSON.parse(fs.readFileSync(absoluteConfigPath, "utf8")) as RuntimeSnapshot;
    const launcherEnv = portableConfig.launcherEnv && typeof portableConfig.launcherEnv === "object"
        ? portableConfig.launcherEnv as Record<string, unknown>
        : {};

    const readLauncher = (key: string): string => {
        const envValue = process.env[key];
        if (typeof envValue === "string" && envValue.trim()) return envValue.trim();
        const value = launcherEnv[key];
        if (Array.isArray(value)) return value.map((entry) => String(entry || "").trim()).filter(Boolean).join(",");
        return String(value || "").trim();
    };

    const endpointCandidate = options.endpointUrl || readLauncher("CWS_BRIDGE_ENDPOINT_URL");
    const endpointList = parseUrlList(readLauncher("CWS_BRIDGE_ENDPOINTS"));
    const endpointUrl = endpointCandidate || endpointList[0] || "";
    const token = options.token || readLauncher("CWS_BRIDGE_USER_KEY") || readLauncher("CWS_ASSOCIATED_TOKEN");
    const userId = normalizeWireNodeId(options.userId || readLauncher("CWS_BRIDGE_USER_ID") || readLauncher("CWS_ASSOCIATED_ID") || "L-192.168.0.196");
    const deviceId = normalizeWireNodeId(options.deviceId || readLauncher("CWS_BRIDGE_DEVICE_ID") || readLauncher("CWS_DEVICE_ID") || userId);

    const identity = resolveServerV2WireIdentity({
        endpointUrl,
        userId,
        deviceId,
        token,
        connectionType: readLauncher("CWS_BRIDGE_CONNECTION_TYPE") || "exchanger-initiator",
        archetype: "server-v2",
        rejectUnauthorized: false
    });
    if (!identity.endpointUrl) {
        throw new Error(`Missing endpoint URL. config=${absoluteConfigPath}`);
    }
    const handshake = buildServerV2SocketHandshake(identity);
    const wsUrl = toWsUrl(identity.endpointUrl, handshake.query);
    const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

    let clipboardState = options.clipboardText;
    let clipboardSent = false;
    let closed = false;
    let hadConnected = false;
    const exitTimer = setTimeout(() => {
        if (closed) return;
        emitLog(options.label, "timeout", { exitIdleMs: options.exitIdleMs });
        ws.close();
        process.exit(hadConnected ? 0 : 2);
    }, options.exitIdleMs);

    const sendPacket = (packet: Packet) => {
        const normalized = normalizePacketForWire(packet, identity);
        ws.send(JSON.stringify(normalized));
        emitLog(options.label, "packet-sent", {
            op: normalized.op,
            what: normalized.what,
            uuid: normalized.uuid,
            nodes: normalized.nodes
        });
    };

    ws.on("open", () => {
        hadConnected = true;
        emitLog(options.label, "connected", {
            endpointUrl: identity.endpointUrl,
            wsUrl,
            userId: identity.userId,
            deviceId: identity.deviceId,
            targets: options.targetIds
        });
        sendPacket(buildHelloPacket(identity));
    });

    ws.on("message", (raw) => {
        const packet = parsePacket(raw);
        if (!packet) return;
        const op = toRuntimeOp(packet.op);
        emitLog(options.label, "packet-received", {
            op: packet.op,
            what: packet.what,
            byId: packet.byId,
            from: packet.from,
            uuid: packet.uuid
        });

        if (op === "ask" && packet.what === "token") {
            sendPacket(buildPacketReply(packet, identity, {
                result: { id: identity.userId, token: identity.token }
            }));
            if (!clipboardSent && options.targetIds.length > 0) {
                clipboardSent = true;
                sendPacket(buildClipboardPacket(identity, options.clipboardText, options.targetIds));
                if (options.once) {
                    setTimeout(() => {
                        if (!closed) {
                            closed = true;
                            ws.terminate();
                            clearTimeout(exitTimer);
                            emitLog(options.label, "once-complete", { mode: "timer-after-send" });
                            process.exit(0);
                        }
                    }, 1200);
                }
            }
            return;
        }

        if (packet.what === "clipboard:update" || packet.what === "clipboard:write") {
            clipboardState = extractClipboardText(packet);
            emitLog(options.label, "clipboard-updated", {
                textPreview: clipboardState.slice(0, 120),
                length: clipboardState.length
            });
            sendPacket(buildPacketReply(packet, identity, {
                result: { ok: true, text: clipboardState, source: "vds-fake-client-ws" }
            }));
            return;
        }

        if (op === "result" || op === "resolve") {
            emitLog(options.label, "result", { what: packet.what, result: packet.result });
            if (options.once && !closed) {
                closed = true;
                ws.terminate();
                clearTimeout(exitTimer);
                emitLog(options.label, "once-complete", { mode: "result" });
                process.exit(0);
            }
        }
    });

    ws.on("error", (error) => {
        emitLog(options.label, "connect-error", { message: error.message });
    });

    ws.on("close", (code, reason) => {
        if (closed) return;
        closed = true;
        clearTimeout(exitTimer);
        emitLog(options.label, "disconnected", { code, reason: String(reason || "") });
        process.exit(0);
    });

    process.on("SIGINT", () => {
        ws.close();
        process.exit(0);
    });
    process.on("SIGTERM", () => {
        ws.close();
        process.exit(0);
    });
};

main().catch((error) => {
    emitLog("vds-fake-client-ws", "fatal", {
        message: error instanceof Error ? error.message : String(error || "unknown"),
        stack: error instanceof Error ? error.stack : ""
    });
    process.exit(1);
});
