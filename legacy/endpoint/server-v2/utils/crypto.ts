import {
    createCipheriv,
    createDecipheriv,
    createHash,
    randomBytes,
    scryptSync
} from "node:crypto";

export const hashUserKey = (key: string): string => {
    return createHash("sha256").update(key).digest("hex");
};

export const deriveUserCipherKey = (userKey: string, userId: string): Buffer => {
    const salt = createHash("sha256").update(userId).digest();
    return scryptSync(userKey, salt, 32);
};

export const encryptUserBuffer = (buffer: Buffer, userKey: string, userId: string): Buffer => {
    const key = deriveUserCipherKey(userKey, userId);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]);
};

export const decryptUserBuffer = (buffer: Buffer, userKey: string, userId: string): Buffer => {
    if (buffer.byteLength < 28) return buffer;
    const key = deriveUserCipherKey(userKey, userId);
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const data = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]);
};

export const createRandomUserKey = (): string => {
    return randomBytes(24).toString("base64url");
};
