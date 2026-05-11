import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
    createRandomUserKey,
    decryptUserBuffer,
    encryptUserBuffer,
    hashUserKey
} from "@utils/crypto.ts";

import { ensureDataDirs, safeJoin, USER_STORAGE_DIR, USERS_FILE } from "@utils/paths.ts";
import { DEFAULT_SETTINGS, mergeSettings, Settings } from "../../../config/config.ts";

export type UserRecord = {
    userId: string;
    userKeyHash: string;
    encrypt: boolean;
    createdAt: number;
};

export type UsersIndex = Record<string, UserRecord>;

const DEFAULT_USER_ID = "test";
const DEFAULT_USER_KEY = "developer123";

const ensureDefaultUser = (users: UsersIndex): UsersIndex => {
    if (users[DEFAULT_USER_ID]) return users;
    return {
        ...users,
        [DEFAULT_USER_ID]: {
            userId: DEFAULT_USER_ID,
            userKeyHash: hashUserKey(DEFAULT_USER_KEY),
            encrypt: false,
            createdAt: Date.now()
        }
    };
};

const loadJson = async <T>(filePath: string, fallback: T): Promise<T> => {
    try {
        const raw = await readFile(filePath, "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

export const loadUsers = async (): Promise<UsersIndex> => {
    const loaded = await loadJson<UsersIndex>(USERS_FILE, {});
    const users = ensureDefaultUser(loaded);
    if (users !== loaded) await saveUsers(users);
    return users;
};

export const saveUsers = async (users: UsersIndex): Promise<void> => {
    await ensureDataDirs();
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
};

export const getUser = async (userId: string): Promise<UserRecord | undefined> => {
    const users = await loadUsers();
    return users[userId];
};

export const verifyUser = async (userId: string, userKey: string): Promise<UserRecord | null> => {
    const record = await getUser(userId);
    if (!record) return null;
    if (record.userKeyHash !== hashUserKey(userKey)) return null;
    return record;
};

export const ensureUserDir = async (userId: string): Promise<string> => {
    const dir = safeJoin(USER_STORAGE_DIR, userId);
    await mkdir(dir, { recursive: true });
    return dir;
};

export const writeUserFile = async (
    userId: string,
    relPath: string,
    contents: Buffer,
    encrypt: boolean,
    userKey?: string
): Promise<string> => {
    const dir = await ensureUserDir(userId);
    const destination = safeJoin(dir, relPath);
    await mkdir(path.dirname(destination), { recursive: true });
    const data = encrypt && userKey ? encryptUserBuffer(contents, userKey, userId) : contents;
    await writeFile(destination, data);
    return destination;
};

export const readUserFile = async (
    userId: string,
    relPath: string,
    encrypt: boolean,
    userKey?: string
): Promise<Buffer> => {
    const dir = await ensureUserDir(userId);
    const destination = safeJoin(dir, relPath);
    const buffer = await readFile(destination);
    if (encrypt && userKey) {
        try {
            return decryptUserBuffer(buffer, userKey, userId);
        } catch {
            return buffer;
        }
    }
    return buffer;
};

export const loadUserSettings = async (userId: string, userKey: string): Promise<Settings> => {
    const record = await verifyUser(userId, userKey);
    if (!record) throw new Error("Invalid credentials");
    try {
        const buffer = await readUserFile(userId, "settings.json", record.encrypt, userKey);
        const parsed = JSON.parse(buffer.toString("utf-8")) as Settings;
        return mergeSettings(DEFAULT_SETTINGS, parsed);
    } catch {
        return mergeSettings(DEFAULT_SETTINGS, {});
    }
};

export const registerUser = async (userId: string | undefined, encrypt = false, userKey?: string) => {
    const users = await loadUsers();
    const resolvedUserId = userId?.trim() || randomUUID();
    const resolvedUserKey = (typeof userKey === "string" ? userKey.trim() : "") || createRandomUserKey();
    users[resolvedUserId] = {
        userId: resolvedUserId,
        userKeyHash: hashUserKey(resolvedUserKey),
        encrypt: Boolean(encrypt),
        createdAt: Date.now()
    };
    await saveUsers(users);
    await ensureUserDir(resolvedUserId);
    return {
        userId: resolvedUserId,
        userKey: resolvedUserKey,
        encrypt: users[resolvedUserId].encrypt
    };
};

export const rotateUserKey = async (userId: string, userKey: string, encrypt?: boolean) => {
    const users = await loadUsers();
    const record = users[userId];
    if (!record || record.userKeyHash !== hashUserKey(userKey)) return null;
    const nextKey = createRandomUserKey();
    record.userKeyHash = hashUserKey(nextKey);
    if (typeof encrypt === "boolean") record.encrypt = encrypt;
    users[userId] = record;
    await saveUsers(users);
    return { userId, userKey: nextKey, encrypt: record.encrypt };
};

export const listUsers = async () => {
    const users = await loadUsers();
    return Object.values(users).map(({ userId, encrypt, createdAt }) => ({
        userId,
        encrypt,
        createdAt
    }));
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    const users = await loadUsers();
    if (!users[userId]) return false;
    delete users[userId];
    await saveUsers(users);
    return true;
};
