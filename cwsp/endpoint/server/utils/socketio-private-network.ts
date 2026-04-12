import type { IncomingMessage, ServerResponse } from "node:http";
import type { Server as HttpServer } from "node:http";
import type { Server as HttpsServer } from "node:https";

const SOCKET_IO_PREFIX = "/socket.io";

const mergeVary = (res: ServerResponse, token: string): void => {
    const v = res.getHeader("Vary");
    const parts = (Array.isArray(v) ? v.join(", ") : String(v ?? ""))
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (!parts.includes(token)) {
        parts.push(token);
    }
    if (parts.length > 0) {
        res.setHeader("Vary", parts.join(", "));
    }
};

const injectPrivateNetworkAccessHeaders = (res: ServerResponse): void => {
    if (res.headersSent) return;
    try {
        res.setHeader("Access-Control-Allow-Private-Network", "true");
        mergeVary(res, "Access-Control-Request-Private-Network");
    } catch {
        /* ignore races with Engine.IO / Fastify */
    }
};

/**
 * PWA on a public origin (e.g. https://u2re.space) → LAN CWSP (e.g. https://192.168.0.110:8443/socket.io):
 * Chrome sends a Private Network Access preflight; responses must include
 * `Access-Control-Allow-Private-Network: true`. Engine.IO sets CORS but not this header.
 */
export const prependSocketIoPrivateNetworkAccessHandler = (server: HttpServer | HttpsServer): void => {
    server.prependListener("request", (req: IncomingMessage, res: ServerResponse) => {
        const path = (req.url ?? "").split("?")[0] ?? "";
        if (!path.startsWith(SOCKET_IO_PREFIX)) {
            return;
        }

        const resAny = res as ServerResponse & {
            writeHead: ServerResponse["writeHead"];
            write: ServerResponse["write"];
            end: ServerResponse["end"];
        };
        const origWriteHead = resAny.writeHead.bind(resAny);
        resAny.writeHead = (...args: unknown[]) => {
            injectPrivateNetworkAccessHeaders(resAny);
            return (origWriteHead as (...a: unknown[]) => ReturnType<ServerResponse["writeHead"]>)(...args);
        };

        const origWrite = resAny.write.bind(resAny);
        resAny.write = (...args: unknown[]) => {
            injectPrivateNetworkAccessHeaders(resAny);
            return (origWrite as (...a: unknown[]) => boolean)(...args);
        };

        const origEnd = resAny.end.bind(resAny);
        resAny.end = (...args: unknown[]) => {
            injectPrivateNetworkAccessHeaders(resAny);
            return (origEnd as (...a: unknown[]) => ServerResponse)(...args);
        };
    });
};
