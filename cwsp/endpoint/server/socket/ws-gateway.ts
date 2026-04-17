import type { Server as HttpServer, IncomingMessage } from "node:http";
import type { Server as HttpsServer } from "node:https";
import { WebSocketServer } from "ws";
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
                query.get("__airpad_client") ||
                `anonymous-${++this.sequence}`
            ).trim();

            const clientToken = String(
                req.headers.authorization?.replace(/^Bearer\s+/i, "") ||
                req.headers["x-cws-token"] ||
                query.get("token") ||
                query.get("userKey") ||
                ""
            ).trim();
            const airpadToken = String(
                req.headers["x-cws-control-token"] ||
                req.headers["x-cws-airpad-token"] ||
                req.headers["x-auth-token"] ||
                query.get("authToken") ||
                query.get("hubToken") ||
                query.get("masterToken") ||
                query.get("airpadToken") ||
                ""
            ).trim();

            const connId = `ws-${++this.sequence}`;
            if (airpadToken) {
                (ws as typeof ws & { airpadToken?: string }).airpadToken = airpadToken;
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
