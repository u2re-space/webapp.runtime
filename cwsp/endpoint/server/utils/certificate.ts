import { access, constants, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parsePortableBoolean, resolveMaybeTextBoolean, resolvePortableTextValue } from "./parsing.ts";

const KEY_FILE_NAME = "multi.key";
const CRT_FILE_NAME = "multi.crt";

const unique = (items: string[]) => [...new Set(items.map((item) => path.resolve(item)))];

const materialToString = (value: unknown): string | undefined => {
    if (typeof value === "string") return value;
    if (Buffer.isBuffer(value)) return value.toString("utf8");
    return undefined;
};

const certificateMjsRoots = (moduleDir: string, cwd: string): string[] =>
    unique([
        cwd,
        path.resolve(cwd, ".."),
        path.resolve(cwd, "config"),
        path.resolve(moduleDir, ".."),
        path.resolve(moduleDir, "..", ".."),
        path.resolve(moduleDir, "..", "..", "..")
    ]);

/** Same layout as legacy `endpoint` Fastify router: `https/certificate.mjs` exporting `{ key, cert [, ca] }`. */
const tryLoadCertificateMjs = async (
    moduleDir: string,
    cwd: string
): Promise<{ key: unknown; cert: unknown; ca?: unknown } | undefined> => {
    for (const root of certificateMjsRoots(moduleDir, cwd)) {
        const file = path.resolve(root, "https", "certificate.mjs");
        try {
            await access(file, constants.R_OK);
        } catch {
            continue;
        }
        try {
            const mod = await import(pathToFileURL(file).href);
            const exp = (mod as { default?: Record<string, unknown> } & Record<string, unknown>).default || mod;
            const key = exp?.key;
            const cert = exp?.cert;
            if (key && cert) {
                return { key, cert, ca: exp?.ca };
            }
        } catch (err) {
            console.warn(`[core-backend] https/certificate.mjs at ${file} failed:`, String((err as Error)?.message || err));
        }
    }
    return undefined;
};

const isLikelyBase64 = (value: string): boolean => {
    const normalized = value.replace(/\s/g, "");
    if (!normalized) return false;
    if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) return false;
    return normalized.length >= 12;
};

type Kind = "key" | "cert" | "ca" | "auto";

const inferPemKindTag = (kind: Kind): "CERTIFICATE" | "PRIVATE KEY" => {
    if (kind === "key") return "PRIVATE KEY";
    return "CERTIFICATE";
};

const wrapAsPem = (value: string, kind: Kind): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const beginTag = `-----BEGIN ${inferPemKindTag(kind)}-----`;
    const endTag = `-----END ${inferPemKindTag(kind)}-----`;
    const compact = trimmed.replace(/\s+/g, "");
    if (!compact) return "";
    if (trimmed.includes("-----BEGIN ")) return trimmed;
    const normalizedBody = trimmed.replace(/[ \t]+/g, "");
    const body = normalizedBody.replace(/(.{64})(?!$)/g, "$1\n");
    return `${beginTag}\n${body}\n${endTag}`;
};

const normalizePemMaterial = (value: string, kind: Kind): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.includes("-----BEGIN ") && trimmed.includes("-----END ")) return trimmed;
    if (isLikelyBase64(trimmed)) {
        const decoded = Buffer.from(trimmed.replace(/\s/g, ""), "base64").toString("utf8");
        if (decoded.includes("-----BEGIN ")) return decoded.trim();
    }
    return wrapAsPem(trimmed, kind);
};

const looksLikeFilesystemPath = (value: string): boolean => {
    if (path.isAbsolute(value)) return true;
    if (value.startsWith("./") || value.startsWith("../")) return true;
    if (/\.(pem|crt|key|csr)$/i.test(value)) return true;
    if (value.includes(path.sep)) return true;
    if (value.includes("\\")) return true;
    return false;
};

const readCertificateMaterial = async (candidate: string | undefined, kind: Kind = "auto"): Promise<string | Buffer | undefined> => {
    if (typeof candidate !== "string") return undefined;
    const trimmed = candidate.trim();
    if (!trimmed) return undefined;
    if (trimmed.includes("\n") || trimmed.startsWith("-----BEGIN ")) return normalizePemMaterial(trimmed, kind);
    try {
        const fileMaterial = await readFile(trimmed);
        if (!fileMaterial.length) return undefined;
        return normalizePemMaterial(fileMaterial.toString("utf8"), kind);
    } catch {
        // Do not wrap a missing/invalid file path as PEM (OpenSSL: ERR_OSSL_PEM_BAD_BASE64_DECODE).
        if (looksLikeFilesystemPath(trimmed)) return undefined;
        const normalized = normalizePemMaterial(trimmed, kind);
        return normalized.includes("-----BEGIN ") ? normalized : undefined;
    }
};

export const buildHttpsCandidateFiles = (moduleDir: string, cwd = process.cwd()) => {
    const configDir = path.resolve(cwd, "config");
    return {
        keys: unique([path.resolve(cwd, "./https/local/" + KEY_FILE_NAME), path.resolve(cwd, "./" + KEY_FILE_NAME), path.resolve(configDir, "./https/local/" + KEY_FILE_NAME), path.resolve(configDir, "./" + KEY_FILE_NAME), path.resolve(moduleDir, "./https/local/" + KEY_FILE_NAME), path.resolve(moduleDir, "../https/local/" + KEY_FILE_NAME), path.resolve(moduleDir, "../" + KEY_FILE_NAME), path.resolve(moduleDir, "../../https/local/" + KEY_FILE_NAME), path.resolve(moduleDir, "../../" + KEY_FILE_NAME), path.resolve(moduleDir, "../../../" + KEY_FILE_NAME)]),
        certs: unique([path.resolve(cwd, "./https/local/" + CRT_FILE_NAME), path.resolve(cwd, "./" + CRT_FILE_NAME), path.resolve(configDir, "./https/local/" + CRT_FILE_NAME), path.resolve(configDir, "./" + CRT_FILE_NAME), path.resolve(moduleDir, "./https/local/" + CRT_FILE_NAME), path.resolve(moduleDir, "../https/local/" + CRT_FILE_NAME), path.resolve(moduleDir, "../" + CRT_FILE_NAME), path.resolve(moduleDir, "../../https/local/" + CRT_FILE_NAME), path.resolve(moduleDir, "../../" + CRT_FILE_NAME), path.resolve(moduleDir, "../../../" + CRT_FILE_NAME)])
    };
};

export const resolveHttpsPaths = (moduleDir: string, cwd = process.cwd()) => {
    const candidates = buildHttpsCandidateFiles(moduleDir, cwd);
    return {
        key: candidates.keys[0] || path.resolve(moduleDir, "./https/local/" + KEY_FILE_NAME),
        cert: candidates.certs[0] || path.resolve(moduleDir, "./https/local/" + CRT_FILE_NAME),
        candidates
    };
};

const dedupePathsPreserveOrder = (items: string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of items) {
        if (typeof item !== "string" || !item.trim()) continue;
        const resolved = path.resolve(item.trim());
        if (seen.has(resolved)) continue;
        seen.add(resolved);
        out.push(item.trim());
    }
    return out;
};

const resolveHttpsConfigValue = (source: Record<string, any>, sourceKeys: string[], envCandidates: string[], fallback?: string, baseDir = process.cwd()) => {
    for (const name of envCandidates) {
        const value = process.env[name];
        if (typeof value === "string" && value.trim()) return resolvePortableTextValue(value, baseDir);
    }
    for (const key of sourceKeys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) return resolvePortableTextValue(String(value), baseDir);
    }
    return fallback;
};

export const loadHttpsOptions = async (params: { httpsConfig: Record<string, any>; moduleDir: string; cwd?: string }) => {
    const { httpsConfig, moduleDir, cwd = process.cwd() } = params;
    const envEnabled = process.env.CWS_HTTPS_ENABLED ?? process.env.HTTPS_ENABLED;
    if (typeof envEnabled === "string" && resolveMaybeTextBoolean(envEnabled) === false) return undefined;
    if (httpsConfig.enabled === false) return undefined;

    const defaultHttpsPaths = resolveHttpsPaths(moduleDir, cwd);
    const { key: keyPath, cert: certPath, candidates } = defaultHttpsPaths;
    const baseDir = cwd;
    const keySource = resolveHttpsConfigValue(
        httpsConfig,
        ["key", "keyFile", "keyPath"],
        ["CWS_HTTPS_KEY", "CWS_HTTPS_KEY_FILE", "HTTPS_KEY", "HTTPS_KEY_FILE"],
        keyPath,
        baseDir
    );
    const certSource = resolveHttpsConfigValue(
        httpsConfig,
        ["cert", "certFile", "certPath"],
        ["CWS_HTTPS_CERT", "CWS_HTTPS_CERT_FILE", "HTTPS_CERT", "HTTPS_CERT_FILE"],
        certPath,
        baseDir
    );
    const caSource = resolveHttpsConfigValue(
        httpsConfig,
        ["ca", "caFile", "caPath"],
        ["CWS_HTTPS_CA", "CWS_HTTPS_CA_FILE", "HTTPS_CA", "HTTPS_CA_FILE"],
        undefined,
        baseDir
    );

    const keyCandidates = dedupePathsPreserveOrder([keySource, ...candidates.keys]);
    const certCandidates = dedupePathsPreserveOrder([certSource, ...candidates.certs]);

    try {
        const caFile = caSource && typeof caSource === "string" && caSource.trim().length > 0 ? caSource : undefined;

        const pairCount = Math.min(keyCandidates.length, certCandidates.length);
        let key: string | Buffer | undefined;
        let cert: string | Buffer | undefined;
        for (let i = 0; i < pairCount; i++) {
            const [k, c] = await Promise.all([readCertificateMaterial(keyCandidates[i], "key"), readCertificateMaterial(certCandidates[i], "cert")]);
            if (k && c) {
                key = k;
                cert = c;
                break;
            }
        }

        const needCertificateMjs = !key || !cert || !caFile;
        const mjsBundle = needCertificateMjs ? await tryLoadCertificateMjs(moduleDir, cwd) : undefined;
        if ((!key || !cert) && mjsBundle) {
            const keyStr = materialToString(mjsBundle.key);
            const certStr = materialToString(mjsBundle.cert);
            if (keyStr && certStr) {
                const [k2, c2] = await Promise.all([readCertificateMaterial(keyStr, "key"), readCertificateMaterial(certStr, "cert")]);
                if (k2 && c2) {
                    key = k2;
                    cert = c2;
                }
            }
        }

        let ca = caFile ? await readCertificateMaterial(caFile, "ca") : undefined;
        if (!ca && mjsBundle?.ca) {
            const caStr = materialToString(mjsBundle.ca);
            if (caStr) {
                ca = (await readCertificateMaterial(caStr, "ca")) ?? undefined;
            }
        }

        if (!key || !cert) {
            throw new Error("[core-backend] HTTPS disabled: missing key or cert material");
        }

        const requestClientCerts = parsePortableBoolean(
            process.env.CWS_HTTPS_REQUEST_CLIENT_CERTS ??
            process.env.HTTPS_REQUEST_CLIENT_CERTS ??
            resolvePortableTextValue(String(httpsConfig.requestClientCerts ?? "false"), moduleDir)
        ) ?? false;

        const allowUntrustedClientCerts = parsePortableBoolean(
            process.env.CWS_HTTPS_ALLOW_UNTRUSTED_CLIENT_CERTS ??
            process.env.HTTPS_ALLOW_UNTRUSTED_CLIENT_CERTS ??
            resolvePortableTextValue(String(httpsConfig.allowUntrustedClientCerts ?? "false"), moduleDir)
        ) ?? false;

        return {
            key,
            cert,
            allowHTTP1: true,
            ...(ca ? { ca } : {}),
            ...(requestClientCerts ? (allowUntrustedClientCerts ? { requestCert: true, rejectUnauthorized: false } : { requestCert: true }) : {})
        };
    } catch (error) {
        const details = String((error as any)?.message || error || "unknown");
        console.warn(
            `[core-backend] HTTPS disabled: failed to load certificate files ` +
                `key=${keyCandidates[0] || keyPath}, cert=${certCandidates[0] || certPath}. ${details}`
        );
        return undefined;
    }
};
