import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { io, type Socket } from "socket.io-client";

import type { Packet } from "../protocol/socket/types.ts";
import {
    buildClipboardPacket,
    buildPacketReply,
    buildServerV2SocketHandshake,
    extractClipboardText,
    normalizePacketForWire,
    normalizeWireNodeId,
    resolveServerV2WireIdentity
} from "../protocol/socket/client-contract.ts";

type CliOptions = {
    clipboardText: string;
    configPath: string;
    deviceId: string;
    endpointUrl: string;
    exitAfterSend: boolean;
    exitIdleMs: number;
    label: string;
    logJson: boolean;
    targetIds: string[];
    token: string;
    userId: string;
};

type RuntimeSnapshot = {
    launcherEnv?: Record<string, unknown>;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseBooleanFlag = (value: string): boolean => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

const parseList = (value: string): string[] => {
    return String(value || "")
        .split(/[;,]/)
        .map((entry) => normalizeWireNodeId(entry))
        .filter(Boolean);
};

const parseUrlList = (value: string): string[] => {
    return String(value || "")
        .split(/[;,]/)
        .map((entry) => String(entry || "").trim())
        .filter(Boolean);
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

    const configPath = readValue("--config") || String(process.env.CWS_PORTABLE_CONFIG_PATH || "").trim();
    if (configPath) {
        process.env.CWS_PORTABLE_CONFIG_PATH = configPath;
    }
    const clipboardText = readValue("--clipboard-text") || String(process.env.CWS_FAKE_CLIENT_CLIPBOARD_TEXT || "").trim();
    const endpointUrl = readValue("--endpoint-url") || String(process.env.CWS_FAKE_CLIENT_ENDPOINT_URL || "").trim();
    const userId = normalizeWireNodeId(readValue("--user-id") || String(process.env.CWS_FAKE_CLIENT_USER_ID || "").trim());
    const deviceId = normalizeWireNodeId(readValue("--device-id") || String(process.env.CWS_FAKE_CLIENT_DEVICE_ID || "").trim());
    const token = readValue("--token") || String(process.env.CWS_FAKE_CLIENT_TOKEN || "").trim();
    const targetIds = parseList(readValue("--targets") || String(process.env.CWS_FAKE_CLIENT_TARGETS || "L-192.168.0.110"));
    return {
        clipboardText,
        configPath,
        deviceId,
        endpointUrl,
        exitAfterSend: parseBooleanFlag(readValue("--once") || String(process.env.CWS_FAKE_CLIENT_ONCE || "")),
        exitIdleMs: Number(readValue("--exit-idle-ms") || process.env.CWS_FAKE_CLIENT_EXIT_IDLE_MS || 15000) || 15000,
        label: readValue("--label") || String(process.env.CWS_FAKE_CLIENT_LABEL || "vds-fake-client").trim() || "vds-fake-client",
        logJson: parseBooleanFlag(readValue("--log-json") || String(process.env.CWS_FAKE_CLIENT_LOG_JSON || "true")),
        targetIds,
        token,
        userId
    };
};

const parseIncomingPacket = (raw: unknown): Packet | null => {
    if (!raw) return null;
    if (typeof raw === "string") {
        try {
            return parseIncomingPacket(JSON.parse(raw));
        } catch {
            return null;
        }
    }
    if (typeof raw === "object") {
        const packet = raw as Packet & Record<string, unknown>;
        if (packet.op || packet.what || packet.result !== undefined || packet.error !== undefined) {
            return packet;
        }
        const type = String(packet.type || "").trim().toLowerCase();
        if (type === "clipboard") {
            return {
                op: "act",
                what: "clipboard:update",
                payload: (packet.data ?? packet.payload ?? packet) as Record<string, unknown>,
                byId: String(packet.byId || packet.from || "").trim() || undefined,
                from: String(packet.from || packet.byId || "").trim() || undefined,
                nodes: Array.isArray(packet.nodes) ? packet.nodes.map((entry) => String(entry || "").trim()).filter(Boolean) : []
            };
        }
        return packet;
    }
    return null;
};

const emitLog = (options: CliOptions, event: string, details: Record<string, unknown> = {}) => {
    const payload = {
        ts: new Date().toISOString(),
        label: options.label,
        event,
        ...details
    };
    if (options.logJson) {
        console.log(JSON.stringify(payload));
        return;
    }
    console.log(`[${payload.label}] ${event}`, details);
};

const normalizePortableConfigPath = (configPath: string): string => {
    if (!configPath) return "";
    return path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
};

const main = async () => {
    const options = parseCliOptions();
    const absoluteConfigPath = normalizePortableConfigPath(options.configPath || process.env.CWS_PORTABLE_CONFIG_PATH || "./portable.config.json");
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
    const userId = normalizeWireNodeId(options.userId || readLauncher("CWS_BRIDGE_USER_ID") || readLauncher("CWS_ASSOCIATED_ID") || "L-wan-client");
    const deviceId = normalizeWireNodeId(options.deviceId || readLauncher("CWS_BRIDGE_DEVICE_ID") || readLauncher("CWS_DEVICE_ID") || userId);
    const rejectUnauthorized = readLauncher("CWS_BRIDGE_REJECT_UNAUTHORIZED").toLowerCase() !== "false";
    const identity = resolveServerV2WireIdentity({
        endpointUrl,
        userId,
        deviceId,
        token,
        rejectUnauthorized,
        connectionType: readLauncher("CWS_BRIDGE_CONNECTION_TYPE") || "exchanger-initiator",
        archetype: "server-v2"
    });

    if (!identity.endpointUrl) {
        throw new Error(`Missing endpoint URL. config=${absoluteConfigPath}`);
    }

    const handshake = buildServerV2SocketHandshake(identity);
    const socket: Socket = io(identity.endpointUrl, {
        auth: handshake.auth,
        query: handshake.query,
        transports: handshake.transports,
        secure: handshake.secure,
        upgrade: false,
        reconnection: true,
        timeout: 10000,
        rejectUnauthorized: identity.rejectUnauthorized
    });

    let clipboardState = options.clipboardText;
    const initialClipboardText = options.clipboardText;
    let sentInitialClipboard = false;
    let idleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
        if (!options.exitAfterSend) return;
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        idleTimer = setTimeout(() => {
            emitLog(options, "exit-idle-timeout", { exitIdleMs: options.exitIdleMs });
            socket.close();
            process.exit(0);
        }, options.exitIdleMs);
    };

    const sendPacket = (packet: Packet) => {
        const normalized = normalizePacketForWire(packet, identity);
        socket.emit("data", JSON.stringify(normalized));
        emitLog(options, "packet-sent", {
            op: normalized.op,
            what: normalized.what,
            nodes: normalized.nodes,
            uuid: normalized.uuid
        });
    };

    const maybeSendInitialClipboard = async () => {
        if (sentInitialClipboard || !initialClipboardText || !options.targetIds.length) return;
        sentInitialClipboard = true;
        await wait(250);
        sendPacket(buildClipboardPacket(identity, initialClipboardText, options.targetIds));
        resetIdleTimer();
    };

    socket.on("connect", async () => {
        emitLog(options, "connected", {
            endpointUrl: identity.endpointUrl,
            id: socket.id,
            deviceId: identity.deviceId,
            userId: identity.userId,
            clientId: identity.clientId,
            targets: options.targetIds
        });
    });

    socket.on("disconnect", (reason) => {
        emitLog(options, "disconnected", { reason });
    });

    socket.on("connect_error", (error) => {
        emitLog(options, "connect-error", {
            message: error?.message || "unknown",
            stack: error?.stack || ""
        });
        resetIdleTimer();
    });

    socket.on("data", (raw) => {
        const packet = parseIncomingPacket(raw);
        if (!packet) {
            emitLog(options, "packet-ignored", { reason: "invalid-packet" });
            return;
        }

        emitLog(options, "packet-received", {
            op: packet.op,
            what: packet.what,
            byId: packet.byId,
            from: packet.from,
            nodes: packet.nodes,
            uuid: packet.uuid
        });

        switch (packet.op) {
            case "ask":
                if (packet.what === "token") {
                    sendPacket(buildPacketReply(packet, identity, {
                        result: {
                            id: identity.userId,
                            token: identity.token
                        }
                    }));
                    void maybeSendInitialClipboard();
                    return;
                }
                if (packet.what === "clipboard:get" || packet.what === "clipboard:read") {
                    sendPacket(buildPacketReply(packet, identity, {
                        result: clipboardState
                    }));
                    return;
                }
                if (packet.what === "clipboard:isReady") {
                    sendPacket(buildPacketReply(packet, identity, {
                        result: true
                    }));
                    return;
                }
                sendPacket(buildPacketReply(packet, identity, {
                    error: {
                        ok: false,
                        handled: false,
                        reason: "unhandled-ask",
                        what: packet.what
                    }
                }));
                return;
            case "act":
                if (packet.what === "clipboard:update" || packet.what === "clipboard:write") {
                    clipboardState = extractClipboardText(packet);
                    emitLog(options, "clipboard-updated", {
                        textPreview: clipboardState.slice(0, 120),
                        length: clipboardState.length
                    });
                    sendPacket(buildPacketReply(packet, identity, {
                        op: "result",
                        result: {
                            ok: true,
                            handled: true,
                            source: "vds-fake-client",
                            text: clipboardState
                        }
                    }));
                    resetIdleTimer();
                    return;
                }
                sendPacket(buildPacketReply(packet, identity, {
                    op: "error",
                    error: {
                        ok: false,
                        handled: false,
                        reason: "unhandled-act",
                        what: packet.what
                    }
                }));
                return;
            default:
                if ((packet.op === "resolve" || packet.op === "result") && packet.what === "token") {
                    void maybeSendInitialClipboard();
                }
                resetIdleTimer();
        }
    });

    process.on("SIGINT", () => {
        emitLog(options, "signal", { signal: "SIGINT" });
        socket.close();
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        emitLog(options, "signal", { signal: "SIGTERM" });
        socket.close();
        process.exit(0);
    });

    emitLog(options, "starting", {
        configPath: options.configPath || "<auto>",
        configPathResolved: absoluteConfigPath,
        deviceId: identity.deviceId,
        endpointUrl: identity.endpointUrl,
        userId: identity.userId,
        targetIds: options.targetIds
    });
};

main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error || "unknown error");
    const stack = error instanceof Error ? error.stack : undefined;
    console.error(JSON.stringify({
        ts: new Date().toISOString(),
        label: "vds-fake-client",
        event: "fatal",
        message,
        stack
    }));
    process.exit(1);
});
