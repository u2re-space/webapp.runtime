import { Server, Socket as SocketConnect } from "socket.io";
import { io, Socket as SocketClient } from "socket.io-client";

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
export const internalNodeMap = new Map<string, SocketConnect | SocketClient>();
export const knownClients = new Map<string, any>();
export const nodeMap = new Map<string, SocketWrapper>();

//
export const populateToOthers = (nodes, packet, selfId) => { 
    for (const nodeId of nodes) { 
        const promise = findOrInitiateConnection(nodeId, selfId);
        promise?.then?.((socket) => {
            packet.nodes = excludeSelf(packet.nodes, selfId);
            socket?.translate?.("op", packet);
        });
    }
}

//
export const excludeSelf = (lists, self) => { 
    return lists;
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

    encodeAnswer(result, packet) { 
        return {
            op: "resolve",
            byId: this.selfId,
            uuid: packet.uuid,
            result
        }
    }

    encodeReport(result, packet) { 
        return {
            op: "result",
            byId: this.selfId,
            uuid: packet.uuid,
            result
        }
    }

    handleAsk(what, payload, packet) { 

    }

    handleAct(what, payload, packet) { 
        
    }

    translate(op, packet) { 
        this.socket.emit(op, packet);
    }

    doAsk(what, payload, nodes) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, Promise.withResolvers());
        this.socket.emit("op", {
            uuid, nodes, op: "act", what, payload
        });
        return this.resolvers.get(uuid).promise;
    }

    doAct(what, payload, nodes) { 
        const uuid = UUIDv4();
        this.resolvers.set(uuid, Promise.withResolvers());
        this.socket.emit("op", {
            uuid, nodes, op: "act", what, payload
        });
        return this.resolvers.get(uuid).promise;
    }
    
    constructor(socket, selfId) { 
        this.selfId = selfId;
        this.socket = socket;

        socket.on("hello", (packet) => { 
            this.socketId = identifyNodeIdFromIncomingConnection(socket, packet);
            internalNodeMap.set(this.socketId, this.socket);
        });

        socket.on("op", (packet) => {
            if (packet.nodes.includes(this.selfId)) {
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
                }
            }

            populateToOthers(excludeSelf(packet.nodes, this.selfId), packet, this.selfId);
        });
    }
}

//
export const loadFromClientsConfig = (clientsData) => { 

}

//
export const identifyNodeIdFromIncomingConnection = (socket, packet) => { 
    if (packet?.nodeId) { 
        return packet?.nodeId;
    }
    const possibleNodeId = [...knownClients?.entries?.()].find(([nodeId, { origins, tokens }]) => {
        return origins.some((ip)=>ip==socket.address) || tokens.some((token)=>token==packet.token);
    });
    if (possibleNodeId) {
        return possibleNodeId;
    }
}

//
export const validateSocketNode = (socket, packet) => { 
    if (identifyNodeIdFromIncomingConnection(socket, packet)) return socket;
    return null;
}

//
export const formalizeOrigin = () => { 
    
}

//
export const initiateConnection = async (forId, fromId) => { 
    for (const origin of knownClients.get(forId)?.origins) {
        const rawSocket = io(origin);
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
export const findOrInitiateConnection = async (id, fromId) => { // @ts-ignore
    return nodeMap?.getOrInsertComputed?.(id, () => { 
        return initiateConnection(id, fromId);
    })
}
