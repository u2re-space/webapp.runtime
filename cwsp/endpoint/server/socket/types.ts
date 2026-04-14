export interface Packet {
    op?: PacketVerb;
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

export type PacketVerb =
    | "ask"
    | "act"
    | "resolve"
    | "result"
    | "error";

export type FrameVerb =
    | "signal"
    | "request"
    | "response"
    | "redirect"
    | "notify";

export interface NetworkFrame {
    op?: PacketVerb | FrameVerb;
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

    version?: number;
    frameVersion?: number;
    protocol?: string;
    purpose?: string;
    type?: string;
    destinations?: string[];
    toRoles?: string[];
    ids?: Record<string, unknown>;
    urls?: Record<string, unknown>;
    tokens?: Record<string, unknown> | string[];
    flags?: Record<string, unknown>;
    params?: unknown[];
    data?: unknown;
    body?: unknown;
    results?: unknown;
}

export type ServerV2SocketVerb = NonNullable<Packet["op"]>;
