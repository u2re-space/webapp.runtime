import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import type { FastifyInstance, FastifyRequest } from "fastify";

import { ADMIN_PREFS_FILE, CONFIG_DIR } from "@utils/paths.ts";
import { DEFAULT_SETTINGS, mergeSettings, readCoreSettings, type Settings } from "@config/config.ts";
import { readUserFile, verifyUser, writeUserFile } from "@protocol/http/routers/auth/users.ts";

export const registerSettingsHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    const readUserSettings = async (userId: string, userKey: string) => {
        const record = await verifyUser(userId, userKey);
        if (!record) return { ok: false, error: "Invalid credentials" };
        try {
            const buffer = await readUserFile(userId, "settings.json", record.encrypt, userKey);
            const parsed = JSON.parse(buffer.toString("utf-8")) as Partial<Settings>;
            return { ok: true, settings: mergeSettings(DEFAULT_SETTINGS, parsed), encrypt: record.encrypt };
        } catch {
            return { ok: true, settings: DEFAULT_SETTINGS, encrypt: record.encrypt };
        }
    };

    app.get("/health", async () => {
        const settings = await readCoreSettings();
        return {
            ok: true,
            mode: (settings.core?.mode ?? "endpoint") as string,
            roles: settings.core?.roles ?? (DEFAULT_SETTINGS.core?.roles || ["endpoint"]),
            bridgeEnabled: settings.core?.bridge?.enabled === true
        };
    });

    app.get("/core/admin/prefs", async () => {
        try {
            const data = await readFile(ADMIN_PREFS_FILE, "utf-8");
            return { ok: true, prefs: JSON.parse(data) };
        } catch {
            return { ok: true, prefs: {} };
        }
    });

    app.post("/core/admin/prefs", async (request: FastifyRequest<{ Body: { prefs?: unknown } }>) => {
        try {
            await writeFile(ADMIN_PREFS_FILE, JSON.stringify(request.body?.prefs || {}, null, 2), "utf-8");
            return { ok: true };
        } catch (error) {
            return { ok: false, error: String(error) };
        }
    });

    app.get("/api/config/:filename", async (request: FastifyRequest<{ Params: { filename: string } }>, reply) => {
        const { filename } = request.params;
        if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
            return reply.code(400).send({ ok: false, error: "Bad Request" });
        }
        try {
            const targetPath = path.join(CONFIG_DIR, filename);
            const data = await readFile(targetPath, "utf-8");
            reply.header("Content-Type", filename.endsWith(".json") ? "application/json" : "text/plain");
            return reply.send(data);
        } catch {
            return reply.code(404).send({ ok: false, error: "Not Found" });
        }
    });

    // Legacy compatibility: old clients may still call GET with query params.
    app.get("/core/user/settings", async (request: FastifyRequest<{ Querystring: { userId: string; userKey: string } }>) => {
        const { userId, userKey } = request.query || {};
        return readUserSettings(userId, userKey);
    });

    app.post("/core/user/settings", async (request: FastifyRequest<{ Body: { userId: string; userKey: string; settings?: Partial<Settings> } }>) => {
        const { userId, userKey, settings } = request.body || {};
        if (!settings) {
            return readUserSettings(userId, userKey);
        }
        const record = await verifyUser(userId, userKey);
        if (!record) return { ok: false, error: "Invalid credentials" };
        const merged = mergeSettings(DEFAULT_SETTINGS, settings);
        await writeUserFile(userId, "settings.json", Buffer.from(JSON.stringify(merged, null, 2)), record.encrypt, userKey);
        return { ok: true, settings: merged };
    });
};
