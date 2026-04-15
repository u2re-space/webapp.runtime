import type { FastifyInstance } from "fastify";

export type ServerV2HttpRoute = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "ALL";
    path: string;
    notes?: string;
};

export type ServerV2HttpBranchMountContext = {
    app: FastifyInstance;
    networkContext?: any;
    socketIoBridge?: any;
    wsHub?: any;
};

export type ServerV2HttpBranch = {
    id: string;
    label: string;
    notes?: string;
    routes: ServerV2HttpRoute[];
    register?: (context: ServerV2HttpBranchMountContext) => Promise<void>;
};

export type ServerV2Http = {
    branches: ServerV2HttpBranch[];
    describe: () => ServerV2HttpBranch[];
    getBranch: (id: string) => ServerV2HttpBranch | undefined;
    listRoutes: () => Array<ServerV2HttpRoute & { branchId: string }>;
    register: (
        app: FastifyInstance,
        options?: {
            branchIds?: string[];
            networkContext?: any;
            socketIoBridge?: any;
            wsHub?: any;
        }
    ) => Promise<void>;
};
