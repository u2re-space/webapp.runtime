import { access, constants, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parsePortableBoolean, resolveMaybeTextBoolean, resolvePortableTextValue } from "./parsing.ts";

const KEY_FILE_NAME = "multi.key";
const CRT_FILE_NAME = "multi.crt";
const CA_FILE_NAME = "rootCA.crt";

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
    cwd: string,
    explicitPaths: string[] = []
): Promise<{ key: unknown; cert: unknown; ca?: unknown } | undefined> => {
    const rootCandidates = certificateMjsRoots(moduleDir, cwd).map((root) => path.resolve(root, "https", "certificate.mjs"));
    const fileCandidates = unique([...explicitPaths, ...rootCandidates]);
    for (const file of fileCandidates) {
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

export type HttpsCandidateDiagnostics = {
    enabledByConfig: boolean;
    configDir: string;
    keyCandidates: string[];
    certCandidates: string[];
    caCandidates: string[];
    certModuleCandidates: string[];
    activePaths: {
        key?: string;
        cert?: string;
        ca?: string;
        certModule?: string;
    };
    inlineMaterial: {
        key: boolean;
        cert: boolean;
        ca: boolean;
    };
};

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
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.includes("\n") || trimmed.startsWith("-----BEGIN ")) return false;
    if (/^(data|inline):/i.test(trimmed)) return false;
    if (isLikelyBase64(trimmed)) return false;
    if (path.isAbsolute(trimmed)) return true;
    if (/^[a-zA-Z]:[\\/]/.test(trimmed)) return true;
    if (/^\\\\/.test(trimmed)) return true;
    if (trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
    if (/\.(pem|crt|key|csr|cer|pfx|p12)$/i.test(trimmed)) return true;
    if (trimmed.includes("/") || trimmed.includes("\\")) return true;
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
    const localDir = "https/local";
    const privateDir = "https/private";
    const keyNames = [KEY_FILE_NAME, "tls.key", "server.key"];
    const certNames = [CRT_FILE_NAME, "tls.crt", "server.crt"];
    const caNames = [CA_FILE_NAME, "ca.crt", "chain.crt"];
    const buildCandidates = (dirCandidates: string[], fileNames: string[]) =>
        unique(
            dirCandidates.flatMap((baseDir) => fileNames.map((fileName) => path.resolve(baseDir, fileName)))
        );
    const baseDirs = [
        path.resolve(cwd, localDir),
        path.resolve(cwd, privateDir),
        path.resolve(cwd),
        path.resolve(configDir, localDir),
        path.resolve(configDir, privateDir),
        path.resolve(configDir),
        path.resolve(moduleDir, localDir),
        path.resolve(moduleDir, privateDir),
        path.resolve(moduleDir, "..", localDir),
        path.resolve(moduleDir, "..", privateDir),
        path.resolve(moduleDir, ".."),
        path.resolve(moduleDir, "..", "..", localDir),
        path.resolve(moduleDir, "..", "..", privateDir),
        path.resolve(moduleDir, "..", ".."),
        path.resolve(moduleDir, "..", "..", "..", localDir),
        path.resolve(moduleDir, "..", "..", "..", privateDir)
    ];
    return {
        keys: buildCandidates(baseDirs, keyNames),
        certs: buildCandidates(baseDirs, certNames),
        cas: buildCandidates(baseDirs, caNames)
    };
};

export const resolveHttpsPaths = (moduleDir: string, cwd = process.cwd()) => {
    const candidates = buildHttpsCandidateFiles(moduleDir, cwd);
    return {
        key: candidates.keys[0] || path.resolve(moduleDir, "./https/local/" + KEY_FILE_NAME),
        cert: candidates.certs[0] || path.resolve(moduleDir, "./https/local/" + CRT_FILE_NAME),
        ca: candidates.cas[0] || path.resolve(moduleDir, "./https/local/" + CA_FILE_NAME),
        candidates
    };
};

const dedupePathsPreserveOrder = (items: string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of items) {
        if (typeof item !== "string" || !item.trim()) continue;
        const trimmed = item.trim();
        const identity = looksLikeFilesystemPath(trimmed) ? path.resolve(trimmed) : trimmed;
        if (seen.has(identity)) continue;
        seen.add(identity);
        out.push(trimmed);
    }
    return out;
};

const findFirstExistingFileCandidate = (items: string[]): string | undefined => {
    for (const item of items) {
        if (!looksLikeFilesystemPath(item)) continue;
        try {
            const resolved = path.resolve(item);
            if (existsSync(resolved)) return resolved;
        } catch {
            // ignore bad path candidates during diagnostics
        }
    }
    return undefined;
};

const hasInlineMaterialCandidate = (items: string[]): boolean => {
    return items.some((item) => {
        const trimmed = String(item || "").trim();
        return Boolean(trimmed) && !looksLikeFilesystemPath(trimmed);
    });
};

const resolveFromPortableBases = (value: string, baseDirs: string[]): string => {
    const candidates = baseDirs.map((baseDir) => resolvePortableTextValue(value, baseDir));
    if (typeof value === "string" && value.trim().startsWith("fs:")) {
        for (const candidate of candidates) {
            try {
                if (candidate && path.isAbsolute(candidate) && existsSync(candidate)) {
                    return candidate;
                }
            } catch {
                // ignore
            }
        }
    }
    return candidates[0] || resolvePortableTextValue(value, baseDirs[0] || process.cwd());
};

const resolveHttpsConfigValue = (
    source: Record<string, any>,
    sourceKeys: string[],
    envCandidates: string[],
    fallback: string | undefined,
    baseDirs: string[]
) => {
    for (const name of envCandidates) {
        const value = process.env[name];
        if (typeof value === "string" && value.trim()) return resolveFromPortableBases(value, baseDirs);
    }
    for (const key of sourceKeys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) return resolveFromPortableBases(String(value), baseDirs);
    }
    return fallback;
};

const buildHttpsResolutionContext = (params: { httpsConfig: Record<string, any>; moduleDir: string; cwd?: string }) => {
    const { httpsConfig, moduleDir, cwd = process.cwd() } = params;
    const defaultHttpsPaths = resolveHttpsPaths(moduleDir, cwd);
    const { key: keyPath, cert: certPath, ca: caPath, candidates } = defaultHttpsPaths;
    const configPath = process.env.CWS_PORTABLE_CONFIG_PATH || process.env.ENDPOINT_CONFIG_JSON_PATH || process.env.PORTABLE_CONFIG_PATH;
    const configDir = typeof configPath === "string" && configPath.trim()
        ? path.dirname(path.resolve(configPath))
        : path.resolve(cwd, "config");
    const baseDirs = unique([configDir, cwd]);
    const keySource = resolveHttpsConfigValue(
        httpsConfig,
        ["key", "keyFile", "keyPath"],
        ["CWS_HTTPS_KEY", "CWS_HTTPS_KEY_FILE", "HTTPS_KEY", "HTTPS_KEY_FILE"],
        keyPath,
        baseDirs
    );
    const certSource = resolveHttpsConfigValue(
        httpsConfig,
        ["cert", "certFile", "certPath"],
        ["CWS_HTTPS_CERT", "CWS_HTTPS_CERT_FILE", "HTTPS_CERT", "HTTPS_CERT_FILE"],
        certPath,
        baseDirs
    );
    const caSource = resolveHttpsConfigValue(
        httpsConfig,
        ["ca", "caFile", "caPath"],
        ["CWS_HTTPS_CA", "CWS_HTTPS_CA_FILE", "HTTPS_CA", "HTTPS_CA_FILE"],
        caPath,
        baseDirs
    );
    const certModuleSource = resolveHttpsConfigValue(
        httpsConfig,
        ["certificateModule", "certificateMjs", "certificatePath"],
        ["CWS_HTTPS_CERT_MODULE", "CWS_HTTPS_CERTIFICATE_MODULE", "HTTPS_CERT_MODULE"],
        undefined,
        baseDirs
    );
    const certModuleCandidates = certModuleSource
        ? dedupePathsPreserveOrder([certModuleSource])
        : [];

    return {
        cwd,
        moduleDir,
        configDir,
        keyPath,
        certPath,
        caPath,
        keyCandidates: dedupePathsPreserveOrder([keySource || "", ...candidates.keys]),
        certCandidates: dedupePathsPreserveOrder([certSource || "", ...candidates.certs]),
        caCandidates: dedupePathsPreserveOrder([caSource || "", ...candidates.cas]),
        certModuleCandidates
    };
};

export const describeHttpsCandidates = (params: { httpsConfig: Record<string, any>; moduleDir: string; cwd?: string }): HttpsCandidateDiagnostics => {
    const { httpsConfig } = params;
    const envEnabled = process.env.CWS_HTTPS_ENABLED ?? process.env.HTTPS_ENABLED;
    const enabledByConfig = !(
        (typeof envEnabled === "string" && resolveMaybeTextBoolean(envEnabled) === false) ||
        httpsConfig.enabled === false
    );
    const resolved = buildHttpsResolutionContext(params);
    return {
        enabledByConfig,
        configDir: resolved.configDir,
        keyCandidates: resolved.keyCandidates,
        certCandidates: resolved.certCandidates,
        caCandidates: resolved.caCandidates,
        certModuleCandidates: resolved.certModuleCandidates,
        activePaths: {
            key: findFirstExistingFileCandidate(resolved.keyCandidates),
            cert: findFirstExistingFileCandidate(resolved.certCandidates),
            ca: findFirstExistingFileCandidate(resolved.caCandidates),
            certModule: findFirstExistingFileCandidate(resolved.certModuleCandidates)
        },
        inlineMaterial: {
            key: hasInlineMaterialCandidate(resolved.keyCandidates),
            cert: hasInlineMaterialCandidate(resolved.certCandidates),
            ca: hasInlineMaterialCandidate(resolved.caCandidates)
        }
    };
};

export const loadHttpsOptions = async (params: { httpsConfig: Record<string, any>; moduleDir: string; cwd?: string }) => {
    const { httpsConfig, moduleDir, cwd = process.cwd() } = params;
    const envEnabled = process.env.CWS_HTTPS_ENABLED ?? process.env.HTTPS_ENABLED;
    if (typeof envEnabled === "string" && resolveMaybeTextBoolean(envEnabled) === false) return undefined;
    if (httpsConfig.enabled === false) return undefined;
    const resolved = buildHttpsResolutionContext({ httpsConfig, moduleDir, cwd });
    const {
        keyPath,
        certPath,
        caPath,
        keyCandidates,
        certCandidates,
        caCandidates,
        certModuleCandidates
    } = resolved;

    try {
        const findFirstMaterial = async (items: string[], kind: Kind): Promise<string | Buffer | undefined> => {
            for (const candidate of items) {
                const material = await readCertificateMaterial(candidate, kind);
                if (material) return material;
            }
            return undefined;
        };

        let key: string | Buffer | undefined;
        let cert: string | Buffer | undefined;

        // Prefer matching key/cert from the same candidate index first.
        const pairCount = Math.min(keyCandidates.length, certCandidates.length);
        for (let i = 0; i < pairCount; i++) {
            const [k, c] = await Promise.all([
                readCertificateMaterial(keyCandidates[i], "key"),
                readCertificateMaterial(certCandidates[i], "cert")
            ]);
            if (k && c) {
                key = k;
                cert = c;
                break;
            }
        }
        // Fallback: accept first key and first cert independently.
        if (!key) key = await findFirstMaterial(keyCandidates, "key");
        if (!cert) cert = await findFirstMaterial(certCandidates, "cert");

        const needCertificateMjs = !key || !cert;
        const mjsBundle = needCertificateMjs ? await tryLoadCertificateMjs(moduleDir, cwd, certModuleCandidates) : undefined;
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

        let ca = await findFirstMaterial(caCandidates, "ca");
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
                `key=${keyCandidates[0] || keyPath}, cert=${certCandidates[0] || certPath}, ca=${caCandidates[0] || caPath}. ${details}`
        );
        return undefined;
    }
};
