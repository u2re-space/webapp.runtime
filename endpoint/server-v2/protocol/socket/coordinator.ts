import { Server, Socket as SocketClient } from "socket.io";
import { Socket as SocketConnect, io } from "socket.io-client";
import { handleAct, handleAsk,makePostHandler } from "./handler.ts";
import type { Packet } from "./types.ts";

const inferWhatFromLegacyType = (value: unknown): string | undefined => {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return undefined;
    if (normalized.includes(":")) return normalized;
    if (normalized === "clipboard") return "clipboard:update";
    if (normalized === "sms") return "sms:send";
    if (normalized === "notifications" || normalized === "notify") return "notification:speak";
    if (normalized === "dispatch") return "network:dispatch";
    return normalized;
};

const normalizeInboundPacket = (raw: unknown): Packet | undefined => {
    try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!parsed || typeof parsed !== "object") return undefined;
        const packet = parsed as Packet;
        if (!packet.what) {
            packet.what = inferWhatFromLegacyType((packet as any)?.type);
        }
        if (packet.payload === undefined && (packet as any)?.data !== undefined) {
            packet.payload = (packet as any).data;
        }
        if (!packet.op) {
            packet.op = packet.result !== undefined ? "result" : packet.error !== undefined ? "error" : "act";
        }
        return packet;
    } catch {
        return undefined;
    }
};

//
export const SELF_DATA = {
    ASSOCIATED_ID: "",
    ASSOCIATED_TOKEN: ""
}

//
export const UUIDv4 = () => { 
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
    uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
    uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    return uuid.map((x) => x.toString(16)).join('');
}

//
export const socketWrapper = new WeakMap<SocketConnect | SocketClient, SocketWrapper>();
export const internalNodeMap = new Map<string, SocketConnect | SocketClient>();
export const knownClients = new Map<string, any>();
export const nodeMap = new Map<string, SocketWrapper | Promise<SocketWrapper | undefined> | undefined>();

//
export const populateToOthers = (op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet, nodes: string[] = ["*"], selfId: string) => { 
    const promisedArray = [];
    for (const nodeId of uniqueNodeIds(excludeSelf([...nodes, ...Array.from(knownClients.keys()), ...Array.from(nodeMap.keys())], selfId))) { 
        const promise = Promise.resolve(
            findOrInitiateConnection(nodeId, selfId) as SocketWrapper | Promise<SocketWrapper | undefined> | undefined
        );
        promisedArray.push(promise.then((socket) => {
            packet.nodes = uniqueNodeIds(excludeSelf(packet.nodes, selfId));
            packet.op = (op ||= packet?.op);
            socket?.direct?.(packet as Packet);
        })?.catch?.((err) => { 
            console.error(err);
        }));
    }
    return promisedArray;
}

//
export const excludeSelf = (lists: string[], self: string) => { 
    return (lists || []).filter((node) => !areNodeIdsEquivalent(node, self));
}

const normalizeNodeId = (value: unknown): string => {
    return String(value || "").trim();
};

//
const getKnownClientConfig = (nodeId: unknown) => {
    const normalized = normalizeNodeId(nodeId);
    if (!normalized) return null;

    const directEntry = knownClients.get(normalized);
    return directEntry ?? [...knownClients.entries()].find(([candidateId]) => {
        return candidateId.toLowerCase() === normalized.toLowerCase();
    })?.[1];
};

//
export const getKnownClientAliases = (nodeId: unknown): string[] => {
    const normalized = normalizeNodeId(nodeId);
    if (!normalized) return [];

    const fallbackEntry = getKnownClientConfig(normalized);

    const aliases = new Set<string>([normalized, normalized.toLowerCase()]);
    if (!fallbackEntry) {
        return Array.from(aliases);
    }

    for (const [candidateId, candidateConfig] of knownClients.entries()) {
        if (candidateConfig === fallbackEntry) {
            const aliasId = normalizeNodeId(candidateId);
            if (!aliasId) continue;
            aliases.add(aliasId);
            aliases.add(aliasId.toLowerCase());
        }
    }

    return Array.from(aliases);
};

const getNodeAliasSignature = (nodeId: unknown): string => {
    return getKnownClientAliases(nodeId)
        .map((alias) => alias.toLowerCase())
        .sort()
        .join("|");
};

export const areNodeIdsEquivalent = (left: unknown, right: unknown): boolean => {
    const leftAliases = new Set(getKnownClientAliases(left));
    if (leftAliases.size === 0) return false;
    for (const alias of getKnownClientAliases(right)) {
        if (leftAliases.has(alias)) {
            return true;
        }
    }
    return false;
};

export const uniqueNodeIds = (nodes: unknown): string[] => {
    if (!Array.isArray(nodes)) return [];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const nodeId of nodes) {
        const normalized = normalizeNodeId(nodeId);
        if (!normalized) continue;
        const signature = getNodeAliasSignature(normalized);
        if (seen.has(signature)) continue;
        seen.add(signature);
        unique.push(normalized);
    }
    return unique;
};

//
export const packetTargetsSelf = (nodes: unknown, selfId: string): boolean => {
    if (!Array.isArray(nodes) || nodes.length === 0) return false;

    for (const nodeId of nodes) {
        if (areNodeIdsEquivalent(nodeId, selfId)) {
            return true;
        }
    }

    return false;
};

const getCachedNodeConnection = (nodeId: string) => {
    for (const alias of getKnownClientAliases(nodeId)) {
        const cached = nodeMap.get(alias);
        if (cached) return cached;
    }
    return undefined;
};

const cacheNodeConnection = (
    nodeId: string,
    connection: SocketWrapper | Promise<SocketWrapper | undefined> | undefined
) => {
    for (const alias of getKnownClientAliases(nodeId)) {
        nodeMap.set(alias, connection);
    }
};

const deleteCachedNodeConnection = (...nodeIds: Array<string | undefined>) => {
    for (const nodeId of nodeIds) {
        for (const alias of getKnownClientAliases(nodeId)) {
            nodeMap.delete(alias);
        }
    }
};

//
export class SocketWrapper {
    public selfId: string;
    public socket: SocketConnect | SocketClient;
    public socketId: string;
    public isConnected: boolean = false;
    public messages = new Map<string, any>();
    public resolvers = new Map<string, {
        promise: Promise<any>,
        resolve: (result: any) => void,
        reject: (result: any) => void
    }>();
    public token: string;
    public origin: string;

    // guardian from duplicated messages (which may be caused by network latency)
    // saves every for 10 seconds after handled first one
    public acceptedUUIDs: Set<string> = new Set();

    //
    populate(op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet) {
        return populateToOthers(op || packet?.op || "ask", packet, uniqueNodeIds(excludeSelf(packet?.nodes, this.selfId)), this.selfId);
    }

    //
    async hello(directly: boolean = false) {
        const packet = {
            op: "ask",
            byId: this.selfId,
            uuid: UUIDv4(), nodes: ["*", this.socketId || this.selfId || "*"],
            what: "token", payload: {},
            timestamp: Date.now()
        } as Packet;

        //
        if (directly) {
            this.socket.emit("data", packet);
        } else {
            populateToOthers("ask", packet, excludeSelf(packet?.nodes, this.selfId), this.selfId);
        }
        this.token = packet?.result?.token ?? "";
        this.origin = formalizeOrigin((this.socket as any)?.address || (this.socket as any)?.origin || this.origin || "");
        return this.token;
    }

    encodeAnswer(result: any, packet: Packet): Packet { 
        return {
            op: "resolve",
            what: packet.what,
            byId: this.selfId,
            uuid: packet.uuid,
            nodes: [packet.byId],
            result: this.packPayload(result),
            timestamp: Date.now()
        }
    }

    encodeReport(result: any, packet: Packet): Packet { 
        return {
            op: "result",
            what: packet.what,
            byId: this.selfId,
            uuid: packet.uuid,
            nodes: [packet.byId],
            result: this.packPayload(result),
            timestamp: Date.now()
        }
    }

    direct(packet: Packet) { 
        const uuid = packet.uuid ?? UUIDv4();
        this.socket?.emit?.("data", packet as Packet);
        // @ts-ignore
        return this.resolvers?.getOrInsertComputed?.(uuid, () => { return makePostHandler(packet.op, packet.what, packet.payload) })?.promise;
    }

    handleAsk(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAsk(what, payload, packet, selfId);
    }

    handleAct(what: string, payload: any, packet: Packet, selfId: string) { 
        return handleAct(what, payload, packet, selfId);
    }

    emit(op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet) { 
        const uuid = packet.uuid ?? UUIDv4();
        packet.op = op || packet.op;
        this.socket?.emit?.("data", packet as Packet);
        // @ts-ignore
        return this.resolvers?.getOrInsertComputed?.(uuid, () => { return makePostHandler(op, what, payload) })?.promise;
    }

    doAsk(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, makePostHandler("ask", what, payload));
        this.socket.emit("data", {
            uuid, nodes, op: "ask", what, payload: this.packPayload(payload), timestamp: Date.now()
        } as Packet);
        return this.resolvers.get(uuid).promise;
    }

    doAct(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, makePostHandler("act", what, payload));
        this.socket.emit("data", {
            uuid, nodes, op: "act", what, payload: this.packPayload(payload), timestamp: Date.now()
        } as Packet);
        return this.resolvers.get(uuid).promise;
    }

    unpackPayload(payload: any) {
        return payload;
    }

    packPayload(payload: any) {
        return payload;
    }

    // if connection is not established, remove socket after 3 second
    removeSocket() { 
        setTimeout(() => {
            if (!this.isConnected) {
                this.socket.disconnect();
                socketWrapper.delete(this.socket);
                internalNodeMap.delete(this.socketId);
                knownClients.delete(this.selfId);
                deleteCachedNodeConnection(this.socketId, this.selfId);
            }
        }, 3000);
    }

    //
    constructor(socket: SocketConnect | SocketClient, selfId: string, token: string) { 
        this.selfId = selfId;
        this.token = token;
        this.origin = formalizeOrigin((socket as any)?.address || (socket as any)?.origin || "");
        this.socket = socket;
        socketWrapper.set(socket, this);

        const handlePacket = async (packet: Packet) => {
            populateToOthers(packet?.op, packet, excludeSelf(packet?.nodes, this.selfId), this.selfId);
            const payload = this.unpackPayload(packet?.payload);
            const uuid = packet?.uuid;
            if (packetTargetsSelf(packet?.nodes, this.selfId)) {
                if (this.acceptedUUIDs.has(uuid ?? "")) { return; }
                this.acceptedUUIDs.add(uuid ?? "");
                setTimeout(() => { this.acceptedUUIDs.delete(uuid ?? ""); }, 10000);
                
                if (packet?.op == "ask") {
                    const result = await this.handleAsk(packet?.what, payload, packet, this.selfId);
                    this.populate("resolve", this.encodeAnswer(result, packet));
                    //this.direct(this.encodeAnswer(result, packet));
                } else
                if (packet?.op == "act") { 
                    const result = await this.handleAct(packet?.what, payload, packet, this.selfId);
                    this.populate("result", this.encodeReport(result, packet));
                    //this.direct(this.encodeReport(result, packet));
                } else
                if (uuid && ["resolve", "result", "error"].includes(packet?.op)) {
                    if (packet.result) {
                        this.resolvers?.get(uuid)?.resolve?.(this.unpackPayload(packet?.result));
                    } else {
                        this.resolvers?.get(uuid)?.reject?.(this.unpackPayload(packet?.error ?? {}));
                    }
                    this.resolvers?.delete?.(uuid);
                }
            }
        };

        //
        socket.on("data", async (packetRaw: unknown) => { 
            const packet = normalizeInboundPacket(packetRaw);
            if (!packet) return;
            if (packet?.op == "resolve" && packet?.what == "token") {
                this.token = packet?.result?.token ?? "";
                this.origin = formalizeOrigin((socket as any)?.address || (socket as any)?.origin || "");
                this.socketId = await identifyNodeIdFromIncomingConnection(socket, packet) as string;
                internalNodeMap.set(this.socketId, this.socket);
                this.isConnected = true;
            }
        });

        //
        socket.on("disconnect", () => {
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("connect", async () => {
            this.socketId = await identifyNodeIdFromIncomingConnection(socket, {}) as string;
            internalNodeMap.set(this.socketId, this.socket);
            this.isConnected = true;
        });

        //
        socket.on("error", (err) => {
            console.error(err);
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("close", () => {
            this.isConnected = false;
            this.removeSocket();
        });

        //
        socket.on("reconnect", async () => {
            this.isConnected = false;
            this.socketId = await identifyNodeIdFromIncomingConnection(socket, {}) as string;
            internalNodeMap.set(this.socketId, this.socket);
            this.isConnected = true;
        });

        //
        socket.on("data", (packetRaw: unknown) => {
            const packet = normalizeInboundPacket(packetRaw);
            if (!packet) return;
            void handlePacket(packet);
        });

        //
        socket.on("message", (packetRaw: unknown) => {
            const packet = normalizeInboundPacket(packetRaw);
            if (!packet) return;
            void handlePacket(packet);
        });
    }
}

//
export const loadFromClientsConfig = (clientsData: Record<string, any>[]) => { 
    for (const clientId of Object.keys(clientsData)) {
        const isAlias = clientsData[clientId]?.startsWith?.("alias:");
        const fromId = isAlias ? clientsData[clientId]?.replace?.("alias:", "") : clientId;
        knownClients.set(clientId, clientsData[fromId]);
    }
}

//socket.emit("data", { op: "ask", what: "token"})

//
export const identifyNodeIdFromIncomingConnection = async (socket: SocketConnect | SocketClient, packet?: Packet): Promise<string | null> => { 
    if (packet?.byId) { return packet?.byId as string; }
    const gotToken = packet?.token ?? (await socketWrapper.get(socket)?.doAsk?.("token", {}, []));
    const possibleNodeId = [...knownClients?.entries?.()].find(([byId, { origins, tokens }]) => {
        return origins.some((ip)=>ip==(socket as any)?.address) || tokens.some((token)=>token==(packet?.token ?? gotToken));
    })?.[0];
    if (possibleNodeId) { return possibleNodeId; }
    return null;
}

//
export const validateSocketNode = (socket: SocketConnect | SocketClient, packet: Packet) => { 
    const nodeId = identifyNodeIdFromIncomingConnection(socket, packet);
    if (nodeId) return nodeId;
    return false;
}

//
export const formalizeOrigin = (origin: string) => { 
    const trimmed = String(origin || "").trim();
    if (!trimmed) return "";
    try {
        const parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
        return `${parsed.protocol}://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}`;
    } catch {
        return "";
    }
};

//
export const initiateConnection = async (forId: string, fromId: string): Promise<SocketWrapper | undefined> => { 
    const targetConfig = getKnownClientConfig(forId);
    const origins = Array.isArray(targetConfig?.origins) ? targetConfig.origins : [];
    for (const origin of origins) {
        const normalizedOrigin = formalizeOrigin(origin);
        if (!normalizedOrigin) continue;
        const rawSocket = io(normalizedOrigin);
        const promised: Promise<SocketWrapper | undefined> = Promise.try(() => {
            return new Promise<SocketWrapper>((resolve, reject) => {
                rawSocket.on("error", reject);
                rawSocket.on("connect", () => {
                    if (validateSocketNode(rawSocket, { byId: fromId, token: targetConfig?.token || "", timestamp: Date.now() })) {
                        resolve(new SocketWrapper(rawSocket, fromId, targetConfig?.token || ""));
                    } else {
                        reject(new Error("Invalid socket node", { cause: { byId: fromId, token: targetConfig?.token || "", timestamp: Date.now() } }));
                    }
                });
                rawSocket.on("resolve", (packet) => {
                    if (packet?.op == "ask" && packet?.what == "token" && validateSocketNode(rawSocket, packet)) {
                        resolve(new SocketWrapper(rawSocket, fromId, packet?.result?.token || ""));
                    } else {
                        reject(new Error("Invalid socket node", { cause: { byId: fromId, token: targetConfig?.token || "", timestamp: Date.now() } }));
                    }
                });
                rawSocket?.emit?.("data", { op: "ask", what: "token", payload: {}, byId: fromId, timestamp: Date.now() });
            })
        })?.catch?.(console.error.bind(console));

        //
        const isSocket = await promised;
        if (isSocket instanceof SocketWrapper) {
            return isSocket;
        }
    }
    return undefined;
}

//
export const findOrInitiateConnection = (id: string, selfId: string): SocketWrapper | Promise<SocketWrapper | undefined> | undefined => {
    const cached = getCachedNodeConnection(id);
    if (cached) return cached;

    const initiated: Promise<SocketWrapper | undefined> = initiateConnection(id, selfId)
        .then((socket) => {
            if (socket) {
                cacheNodeConnection(id, socket);
                cacheNodeConnection(socket.socketId, socket);
            } else {
                deleteCachedNodeConnection(id);
            }
            return socket;
        })
        ?.catch?.((error) => {
            deleteCachedNodeConnection(id);
            throw error;
        });

    cacheNodeConnection(id, initiated);
    return initiated;
}

//
export class SocketServer {
    public server: Server;
    public selfId: string = SELF_DATA.ASSOCIATED_ID;
    public token: string = SELF_DATA.ASSOCIATED_TOKEN;

    //
    public constructor(server: Server, selfId: string = SELF_DATA.ASSOCIATED_ID, token: string = SELF_DATA.ASSOCIATED_TOKEN) {
        this.server = server;
        this.selfId = selfId;
        this.token = token;

        //
        server.on("connection", async (socket) => {
            try {
                const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
                await socketWrapper?.hello?.(true) ?? null;
                console.log(`[Server] Connected to ${socketWrapper?.selfId} from ${socketWrapper?.origin}`);
                return socketWrapper;
            } catch (err) {
                console.error(err);
            }
        });

        //
        server.on("reconnect", async (socket) => {
            try {
                const socketWrapper = new SocketWrapper(socket, selfId, token) as SocketWrapper;
                await socketWrapper?.hello?.() ?? null;
                console.log(`[Server] Reconnected to ${socketWrapper?.selfId} from ${socketWrapper?.origin}`);
                return socketWrapper;
            } catch (err) {
                console.error(err);
            }
        });
    }

    //
    public act(what: string, payload: any, nodes: string[]) { 
        return populateToOthers("act", {
            what, payload,
            byId: this.selfId,
            timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public ask(what: string, payload: any, nodes: string[]) { 
        return populateToOthers("ask", {
            what, payload,
            byId: this.selfId,
            timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public hello(nodes: string[] = ["*"]) { 
        return populateToOthers("ask", {
            what: "token",
            payload: {},
            byId: this.selfId,
            timestamp: Date.now()
        } as Packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public populate(packet: Packet = {}, nodes: string[] = ["*"]) { 
        return populateToOthers(packet?.op || "ask", packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public emit(op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet, nodes: string[] = ["*"]) { 
        return populateToOthers(op || "ask", packet, uniqueNodeIds(excludeSelf([...nodes, this.selfId], this.selfId)), this.selfId);
    }

    //
    public useConnection(id: string) { 
        return findOrInitiateConnection(id, this.selfId);
    }
}

//
export let existsSocketServer: SocketServer | undefined = undefined;
export const makeSocketServer = (originOrServer: any, selfId: string) => {
    return (existsSocketServer ??= new SocketServer(new Server(originOrServer, {  }), selfId));
}

//
export default makeSocketServer;
