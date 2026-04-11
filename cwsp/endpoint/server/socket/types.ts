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
    timestamp?: number;
    [key: string]: unknown;
}

export type ServerV2SocketVerb = NonNullable<Packet["op"]>;
