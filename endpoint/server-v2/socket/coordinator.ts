import { Socket as SocketClient } from "socket.io";
import { Socket as SocketConnect, io } from "socket.io-client";

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
export const nodeMap = new Map<string, SocketWrapper>();

//
export const populateToOthers = (nodes: string[], packet: Packet, selfId: string) => { 
    const promisedArray = [];
    for (const nodeId of nodes) { 
        const promise = findOrInitiateConnection(nodeId, selfId);
        promisedArray.push(promise?.then?.((socket) => {
            packet.nodes = excludeSelf(packet.nodes, selfId);
            socket?.translate?.("op", packet as Packet);
        })?.catch?.((err) => { 
            console.error(err);
        }));
    }
    return promisedArray;
}

//
export interface Packet { 
    op?: "ask" | "act" | "resolve" | "result" | "error";
    what?: string;
    payload?: any;
    nodes?: string[];
    uuid?: string;
    result?: any;
    error?: any;
    byId?: string;
    from?: string;
    [key: string]: unknown;
}

//
export const excludeSelf = (lists: string[], self: string) => { 
    return lists.filter((node) => node !== self);
}

//
export class SocketWrapper {
    public selfId: string;
    public socket: SocketConnect | SocketClient;
    public socketId: string;
    public messages = new Map<string, any>();
    public resolvers = new Map<string, {
        promise: Promise<any>,
        resolve: (result: any) => void,
        reject: (result: any) => void
    }>();

    encodeAnswer(result: any, packet: Packet) { 
        return {
            op: "resolve",
            byId: this.selfId,
            uuid: packet.uuid,
            result
        }
    }

    encodeReport(result, packet: Packet) { 
        return {
            op: "result",
            byId: this.selfId,
            uuid: packet.uuid,
            result
        }
    }

    handleAsk(what: string, payload: any, packet: Packet) { 

    }

    handleAct(what: string, payload: any, packet: Packet) { 
        
    }

    translate(op: "ask" | "act" | "resolve" | "result" | "error", packet: Packet) { 
        const uuid = packet.uuid ?? UUIDv4();
        this.socket?.emit?.(op, packet as Packet);
        // @ts-ignore
        return this.resolvers?.getOrInsertComputed?.(uuid, () => { return Promise.withResolvers() })?.promise;
    }

    doAsk(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, Promise.withResolvers());
        this.socket.emit("data", {
            uuid, nodes, op: "act", what, payload
        } as Packet);
        return this.resolvers.get(uuid).promise;
    }

    doAct(what: string, payload: any, nodes: string[]) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, Promise.withResolvers());
        this.socket.emit("data", {
            uuid, nodes, op: "act", what, payload
        } as Packet);
        return this.resolvers.get(uuid).promise;
    }
    
    constructor(socket: SocketConnect | SocketClient, selfId: string) { 
        this.selfId = selfId;
        this.socket = socket;
        socketWrapper.set(socket, this);

        socket.on("hello", async (packet: Packet) => { 
            this.socketId = await identifyNodeIdFromIncomingConnection(socket, packet) as string;
            internalNodeMap.set(this.socketId, this.socket);
        });

        socket.on("data", (packet: Packet) => {
            if (packet.nodes?.includes(this.selfId)) {
                if (packet.op == "ask") {
                    const result = this.handleAsk(packet.what, packet.payload, packet);
                    socket.emit("resolve", this.encodeAnswer(result, packet));
                } else
                if (packet.op == "act") { 
                    const result = this.handleAct(packet.what, packet.payload, packet);
                    socket.emit("result", this.encodeReport(result, packet));
                } else
                if (packet.uuid && ["resolve", "result", "error"].includes(packet.op)) {
                    if (packet.result) {
                        this.resolvers?.get(packet.uuid)?.resolve?.(packet.result);
                    } else {
                        this.resolvers?.get(packet.uuid)?.reject?.(packet.error ?? {});
                    }
                    this.resolvers?.delete?.(packet.uuid);
                }
            }

            populateToOthers(excludeSelf(packet.nodes, this.selfId), packet, this.selfId);
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
    if (identifyNodeIdFromIncomingConnection(socket, packet)) return socket;
    return null;
}

//
export const formalizeOrigin = (origin: string) => { 
    const parsed = new URL(origin);
    return `${parsed.protocol}://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}`;
};

//
export const initiateConnection = async (forId: string, fromId: string) => { 
    for (const origin of knownClients.get(forId)?.origins) {
        const rawSocket = io(formalizeOrigin(origin));
        const promised = Promise.try(() => {
            return new Promise((resolve, reject) => {
                rawSocket.on("error", reject);
                rawSocket.on("connect", () => {
                    if (validateSocketNode(rawSocket, {})) {
                        resolve(new SocketWrapper(rawSocket, fromId));
                    }
                });
                rawSocket.on("hello", (packet) => {
                    if (validateSocketNode(rawSocket, packet)) {
                        resolve(new SocketWrapper(rawSocket, fromId));
                    } else {
                        reject({});
                    }
                });
            })
        })?.catch?.((err) => { 
            return err;
        });

        //
        const isSocket = await promised;
        if (isSocket instanceof SocketWrapper) {
            return promised;
        }
    }
}

//
export const findOrInitiateConnection = async (id: string, fromId: string) => { // @ts-ignore
    return nodeMap?.getOrInsertComputed?.(id, () => { 
        return initiateConnection(id, fromId);
    })
}
