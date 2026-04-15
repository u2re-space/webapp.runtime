import { EventEmitter } from "node:events";
import type { Server as HttpServer, IncomingMessage } from "node:http";
import type { Server as HttpsServer } from "node:https";

import { WebSocket, WebSocketServer } from "ws";
import { normalizeInboundPacket, normalizeOutboundFrame } from "./packet.ts";
import { SocketWrapper, identifyNodeIdFromIncomingConnection } from "./coordinator.ts";
import type { Packet } from "./types.ts";

type NodeServer = HttpServer | HttpsServer;

const WS_PATH = "/ws";

const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const parseQuery = (urlRaw: string): Record<string, unknown> => {
    try {
        const base = urlRaw.startsWith("ws://") || urlRaw.startsWith("wss://") ? urlRaw : `ws://local${urlRaw}`;
        const url = new URL(base);
        const out: Record<string, unknown> = {};
        for (const [key, value] of url.searchParams.entries()) {
            out[key] = value;
        }
        return out;
    } catch {
        return {};
    }
};

const firstNonEmpty = (...values: unknown[]): string => {
    for (const value of values) {
        const normalized = String(value || "").trim();
        if (normalized) return normalized;
    }
    return "";
};

const parseBearerToken = (raw: unknown): string => {
    const value = String(raw || "").trim();
    if (!value) return "";
    const match = value.match(/^Bearer\s+(.+)$/i);
    return match?.[1]?.trim() || "";
};

class WsSocketShim extends EventEmitter {
    public readonly id: string;
    public connected = true;
    public readonly conn: { remoteAddress: string };
    public readonly handshake: {
        query: Record<string, unknown>;
        auth: Record<string, unknown>;
        address: string;
        issued: number;
        headers: Record<string, unknown>;
    };

    constructor(
        private readonly ws: WebSocket,
        private readonly req: IncomingMessage,
        id: string
    ) {
        super();
        this.id = id;
        const remoteAddress = String(req.socket?.remoteAddress || "").replace(/^::ffff:/i, "");
        const query = parseQuery(req.url || "/");
        const headers = req.headers as Record<string, unknown>;
        const headerToken = firstNonEmpty(
            parseBearerToken(headers.authorization),
            headers["x-cws-token"],
            headers["x-auth-token"],
            headers["x-user-key"],
            headers["x-airpad-token"]
        );
        const headerClientId = firstNonEmpty(
            headers["x-cws-client-id"],
            headers["x-client-id"],
            headers["x-device-id"]
        );
        const headerUserId = firstNonEmpty(
            headers["x-cws-user-id"],
            headers["x-user-id"]
        );
        const headerNodeId = firstNonEmpty(
            headers["x-cws-node-id"],
            headers["x-node-id"],
            headers["x-by-id"]
        );
        const headerAliases = firstNonEmpty(
            headers["x-cws-node-aliases"],
            headers["x-cws-origin-aliases"],
            headers["x-node-aliases"]
        );
        const headerConnectionType = firstNonEmpty(
            headers["x-cws-connection-type"],
            headers["x-connection-type"]
        );
        const headerArchetype = firstNonEmpty(
            headers["x-cws-archetype"],
            headers["x-archetype"]
        );
        const auth = {
            clientId: firstNonEmpty(headerClientId, query.clientId, query.__airpad_client, query.__airpad_src),
            userId: firstNonEmpty(headerUserId, query.userId),
            byId: firstNonEmpty(headerNodeId, query.byId, query.nodeId),
            aliases: firstNonEmpty(headerAliases, query.aliases),
            token: firstNonEmpty(headerToken, query.token, query.airpadToken, query.userKey),
            connectionType: firstNonEmpty(headerConnectionType, query.connectionType),
            archetype: firstNonEmpty(headerArchetype, query.archetype)
        };
        if (!query.connectionType && auth.connectionType) {
            query.connectionType = auth.connectionType;
        }
        if (!query.archetype && auth.archetype) {
            query.archetype = auth.archetype;
        }
        if (!query.clientId && auth.clientId) {
            query.clientId = auth.clientId;
        }
        if (!query.userId && auth.userId) {
            query.userId = auth.userId;
        }
        if (!query.byId && auth.byId) {
            query.byId = auth.byId;
        }
        if (!query.aliases && auth.aliases) {
            query.aliases = auth.aliases;
        }
        if (!query.token && auth.token) {
            query.token = auth.token;
        }
        this.conn = { remoteAddress };
        this.handshake = {
            query,
            auth,
            address: remoteAddress,
            issued: Date.now(),
            headers
        };
    }

    override emit(event: string, ...args: unknown[]): boolean {
        if (event === "data" || event === "message") {
            const payload = normalizeOutboundFrame(asRecord(args[0] || {}), String(this.handshake.auth.clientId || ""));
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(payload));
            }
            return true;
        }
        if (event === "hello" || event === "hello-ack") {
            if (this.ws.readyState === WebSocket.OPEN) {
                const payload = asRecord(args[0] || {});
                this.ws.send(JSON.stringify({ event, payload }));
            }
            return true;
        }
        return super.emit(event, ...args);
    }

    disconnect() {
        this.connected = false;
        try {
            this.ws.close();
        } catch {
            // noop
        }
    }

    receive(raw: unknown) {
        const packet = normalizeInboundPacket(raw);
        if (!packet) return;
        super.emit("data", packet);
        super.emit("message", packet);
    }
}

export class WsGatewayCanonical {
    private readonly wss = new WebSocketServer({ noServer: true });
    private readonly servers = new Set<NodeServer>();
    private wrappers = new Map<WebSocket, SocketWrapper>();
    private sequence = 0;

    constructor(private readonly selfId: string, private readonly token: string) {
        this.wss.on("connection", (ws, req) => {
            const shim = new WsSocketShim(ws, req, `ws-${++this.sequence}`);
            const wrapper = new SocketWrapper(shim as any, this.selfId, this.token);
            this.wrappers.set(ws, wrapper);
            Promise.resolve(identifyNodeIdFromIncomingConnection(shim as any, {} as Packet))
                .then((candidate) => {
                    wrapper.rememberPeerId(candidate || shim.id);
                    wrapper.hello(true);
                    shim.connected = true;
                    shim.emit("connect");
                })
                .catch(() => {
                    wrapper.rememberPeerId(shim.id);
                    shim.emit("connect");
                });

            ws.on("message", (raw) => {
                const text = typeof raw === "string" ? raw : raw.toString("utf8");
                try {
                    const decoded = JSON.parse(text);
                    const event = String((decoded as any)?.event || "").trim();
                    const payload = (decoded as any)?.payload ?? decoded;
                    if (event) {
                        shim.emit(event, payload);
                        return;
                    }
                    shim.receive(payload);
                } catch {
                    shim.receive(text);
                }
            });

            ws.on("close", () => {
                shim.connected = false;
                shim.emit("close");
                shim.emit("disconnect");
                this.wrappers.delete(ws);
            });

            ws.on("error", (err) => {
                shim.connected = false;
                shim.emit("error", err);
            });
        });
    }

    attach(server: NodeServer) {
        if (this.servers.has(server)) return;
        this.servers.add(server);
        server.on("upgrade", (req, socket, head) => {
            const pathname = String(req.url || "").split("?")[0] || "/";
            if (pathname !== WS_PATH) return;
            this.wss.handleUpgrade(req, socket, head, (ws) => {
                this.wss.emit("connection", ws, req);
            });
        });
    }

    close() {
        for (const ws of this.wrappers.keys()) {
            try {
                ws.close();
            } catch {
                // noop
            }
        }
        this.wrappers.clear();
        this.wss.close();
        this.servers.clear();
    }

    getStatus() {
        const entries = Array.from(this.wrappers.values());
        return {
            connected: entries.length,
            ids: entries.map((entry) => entry.peerInstanceId || entry.peerId || entry.socketId).filter(Boolean)
        };
    }
}

export const wsGatewayPath = () => WS_PATH;

