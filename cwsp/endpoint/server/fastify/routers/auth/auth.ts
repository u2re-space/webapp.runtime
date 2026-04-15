import type { FastifyInstance, FastifyRequest } from "fastify";

import { parsePortableBoolean } from "@utils/parsing.ts";
import {
    deleteUser,
    listUsers,
    registerUser,
    rotateUserKey,
    verifyUser
} from "./users.ts";

export const registerAuthRoutes = async (app: FastifyInstance): Promise<void> => {
    const listUsersHandler = async (userId?: string, userKey?: string) => {
        const valid = userId && userKey ? await verifyUser(userId, userKey) : null;
        if (!valid) return { ok: false, error: "Invalid credentials" };
        return { ok: true, users: await listUsers() };
    };

    app.post("/core/auth/register", async (request: FastifyRequest<{ Body: { userId?: string; userKey?: string; encrypt?: boolean } }>) => {
        const { userId, userKey, encrypt } = request.body || {};
        const encrypted = parsePortableBoolean(encrypt) ?? false;
        const result = await registerUser(userId, encrypted, userKey);
        return { ok: true, ...result };
    });

    app.post("/core/auth/rotate", async (request: FastifyRequest<{ Body: { userId: string; userKey: string; encrypt?: boolean } }>) => {
        const { userId, userKey, encrypt } = request.body || {};
        if (!userId || !userKey) return { ok: false, error: "Missing credentials" };
        const encrypted = parsePortableBoolean(encrypt);
        const result = await rotateUserKey(userId, userKey, encrypted);
        if (!result) return { ok: false, error: "Invalid credentials" };
        return { ok: true, ...result };
    });

    app.post("/core/auth/users", async (request: FastifyRequest<{ Body: { userId?: string; userKey?: string } }>) => {
        const { userId, userKey } = request.body || {};
        return listUsersHandler(userId, userKey);
    });

    // Legacy compatibility: old clients may still call GET with query params.
    app.get("/core/auth/users", async (request: FastifyRequest<{ Querystring: { userId?: string; userKey?: string } }>) => {
        const { userId, userKey } = request.query || {};
        return listUsersHandler(userId, userKey);
    });

    app.post("/core/auth/delete", async (request: FastifyRequest<{ Body: { userId: string; userKey: string; targetId?: string } }>) => {
        const { userId, userKey, targetId } = request.body || {};
        const valid = await verifyUser(userId, userKey);
        if (!valid) return { ok: false, error: "Invalid credentials" };
        const target = targetId || userId;
        const ok = await deleteUser(target);
        return { ok, targetId: target };
    });
};
