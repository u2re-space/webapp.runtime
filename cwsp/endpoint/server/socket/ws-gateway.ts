import type { Server as HttpServer } from "node:http";
import type { Server as HttpsServer } from "node:https";
import { WebSocketServer } from "ws";
import { resolveWireAccessToken } from "../../shared/wire-access-token.ts";
import { Connection } from "./coordinator.ts";

type NodeServer = HttpServer | HttpsServer;

const WS_PATH = "/ws";

export class WsGatewayCanonical {
    private readonly wss = new WebSocketServer({ noServer: true });
    private readonly servers = new Set<NodeServer>();
    private sequence = 0;

    constructor(private readonly selfId: string, private readonly token: string) {
        this.wss.on("connection", (ws, req) => {
            const query = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).searchParams;
            
            // Extract identity from headers or query
            const peerId = String(
                req.headers["x-cws-client-id"] ||
                req.headers["x-client-id"] ||
                query.get("clientId") ||
                query.get("peerInstanceId") ||
                query.get("deviceInstanceId") ||
                query.get("userId") ||
                `anonymous-${++this.sequence}`
            ).trim();

            const clientToken = String(
                req.headers.authorization?.replace(/^Bearer\s+/i, "") ||
                req.headers["x-cws-token"] ||
                query.get("token") ||
                query.get("userKey") ||
                ""
            ).trim();
            const accessToken = resolveWireAccessToken(req.headers, query);

            const clientAccessToken = String(
                req.headers["x-cws-client-access-token"] ||
                query.get("clientAccessToken") ||
                ""
            ).trim();

            const connId = `ws-${++this.sequence}`;
            if (accessToken) {
                (ws as typeof ws & { accessToken?: string }).accessToken = accessToken;
            }
            if (clientAccessToken) {
                (ws as typeof ws & { clientAccessToken?: string }).clientAccessToken = clientAccessToken;
            }
            new Connection(connId, peerId, clientToken, ws, this.selfId);
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
        this.wss.close();
        this.servers.clear();
    }

    getStatus() {
        return {
            connected: this.wss.clients.size,
            ids: [] // We'd need to track this if we want to expose it
        };
    }
}

export const wsGatewayPath = () => WS_PATH;
