// =========================
// Clipboard Management
// =========================

import clipboardy from "clipboardy";
import axios from "axios";
import { createHash } from "node:crypto";
import config from "../config/config.ts";
import { pickEnvBoolLegacy, pickEnvListLegacy } from "../lib/env.ts";
import { parsePortableInteger } from "../lib/parsing.ts";

const { peers, secret, pollInterval } = config;
const clipboardReadTimeoutMs = Math.max(200, parsePortableInteger((config as any)?.clipboardReadTimeoutMs) ?? 2000);
const clipboardErrorLogIntervalMs = Math.max(1000, parsePortableInteger((config as any)?.clipboardErrorLogIntervalMs) ?? 15000);
const clipboardUnsupportedRetryIntervalMs = Math.max(5000, parsePortableInteger((config as any)?.clipboardUnsupportedRetryIntervalMs) ?? 60000);
const clipboardFeatureEnabled = pickEnvBoolLegacy("CWS_CLIPBOARD_ENABLED", true) !== false;
const stopClipboardRetryOnUnsupported = pickEnvBoolLegacy("CWS_CLIPBOARD_STOP_ON_UNSUPPORTED", true) !== false;
const clipboardLoggingEnabled = pickEnvBoolLegacy("CWS_CLIPBOARD_LOGGING", true) !== false;
const clipboardLogHashEnabled = pickEnvBoolLegacy("CWS_CLIPBOARD_LOG_HASH", true) !== false;
const clipboardPreviewLength = Math.max(8, parsePortableInteger((config as any)?.clipboardLogPreviewLength ?? process.env.CWS_CLIPBOARD_LOG_PREVIEW) ?? 64);
const clipboardNodeLabel = String(process.env.CWS_ASSOCIATED_ID || process.env.CWS_BRIDGE_CLIENT_ID || process.env.HOSTNAME || "").trim() || "endpoint";
const logClipboard = (level: "info" | "warn" | "error" | "debug", ...args: any[]) => {
    if (!clipboardLoggingEnabled) return;
    const logger = (app as any)?.log;
    if (typeof logger?.[level] === "function") {
        logger[level](...args);
        return;
    }
    if (level === "error") {
        console.error(...args);
    } else if (level === "warn") {
        console.warn(...args);
    } else {
        console.log(...args);
    }
};

const summarizeClipboardText = (text: string) => {
    const value = String(text ?? "");
    const compact = value.replace(/\s+/g, " ").trim();
    const preview = compact.length > clipboardPreviewLength ? `${compact.slice(0, clipboardPreviewLength)}...` : compact;
    const result: { len: number; preview: string; sha256_12?: string } = {
        len: value.length,
        preview
    };
    if (clipboardLogHashEnabled) {
        result.sha256_12 = createHash("sha256").update(value, "utf8").digest("hex").slice(0, 12);
    }
    return result;
};

type ClipboardProtocol = "http" | "https";
type ClipboardPeerTarget = { protocol: ClipboardProtocol; port: number };

type ClipboardBroadcastResult = {
    target: string;
    ok: boolean;
    error?: string;
};

const DEFAULT_CLIPBOARD_PEER_TARGETS: ClipboardPeerTarget[] = [
    { protocol: "https", port: 443 },
    { protocol: "https", port: 8443 },
    { protocol: "http", port: 8080 },
    { protocol: "http", port: 80 }
];

const parseClipboardPeerTargets = (value: unknown): ClipboardPeerTarget[] => {
    const items = Array.isArray((config as any)?.clipboardPeerTargets) ? (config as any).clipboardPeerTargets : typeof value === "string" ? value.split(/[;,]/) : [];

    const parsed = items
        .map((entry: any) => String(entry ?? "").trim())
        .filter(Boolean)
        .map((entry: string) => {
            const [rawProtocol, rawPort] = entry.split(":").map((part) => part.trim());
            if (!rawProtocol || !rawPort) return null;
            const protocol = rawProtocol.toLowerCase() as ClipboardProtocol;
            const port = parsePortableInteger(rawPort);
            if ((protocol !== "http" && protocol !== "https") || !Number.isInteger(port) || port <= 0 || port > 65535) {
                return null;
            }
            return { protocol, port };
        })
        .filter((entry: ClipboardPeerTarget | null): entry is ClipboardPeerTarget => entry !== null);

    return parsed.length ? parsed : [];
};

const clipboardPeerTargetsFromEnv = pickEnvListLegacy("CWS_CLIPBOARD_PEER_TARGETS");
const peerTargets = parseClipboardPeerTargets((config as any).clipboardPeerTargets ?? clipboardPeerTargetsFromEnv);
const fallbackPeerTargets = peerTargets.length ? peerTargets : DEFAULT_CLIPBOARD_PEER_TARGETS;

let lastClipboard = "";
let lastNetworkClipboard = "";
let isBroadcasting = false;
let httpClient = axios;
let app: any = null;
let clipboardUnsupported = false;
let lastClipboardErrorLogAt = 0;
let pollingTimer: NodeJS.Timeout | null = null;
let clipboardUnavailableNotified = false;

type ClipboardChangeSource = "local" | "network";
type ClipboardListener = (text: string, meta: { source: ClipboardChangeSource }) => void;
const clipboardListeners = new Set<ClipboardListener>();

export function setApp(application: any) {
    app = application;
}

export function setHttpClient(client: any) {
    httpClient = client;
}

export function isClipboardBroadcasting(): boolean {
    return isBroadcasting;
}

export function setBroadcasting(value: boolean) {
    isBroadcasting = value;
}

function normalizeText(text: string) {
    return String(text ?? "");
}

const buildClipboardPeerUrlCandidates = (raw: string): string[] => {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const normalized: string[] = [];

    const parseWithProtocol = (input: string): URL | undefined => {
        try {
            return new URL(input);
        } catch {
            return undefined;
        }
    };

    if (hasProtocol) {
        const parsed = parseWithProtocol(trimmed);
        if (!parsed) {
            logClipboard("warn", `[Clipboard] Invalid peer URL: ${trimmed}`);
            return [];
        }
        if (!parsed.pathname || parsed.pathname === "/") {
            parsed.pathname = "/clipboard";
        }
        normalized.push(parsed.toString());
        return normalized;
    }

    const baseUrl = parseWithProtocol(`https://${trimmed}`);
    if (!baseUrl) {
        logClipboard("warn", `[Clipboard] Invalid peer URL: ${trimmed}`);
        return [];
    }

    const targetVariants = baseUrl.port
        ? [
            { protocol: "https" as const, port: parsePortableInteger(baseUrl.port) ?? 443 },
            { protocol: "http" as const, port: parsePortableInteger(baseUrl.port) ?? 80 }
        ]
        : fallbackPeerTargets;

    for (const target of targetVariants) {
        try {
            const parsed = new URL(baseUrl.toString());
            parsed.protocol = `${target.protocol}:`;
            const shouldUseDefaultPort = (target.protocol === "https" && target.port === 443) || (target.protocol === "http" && target.port === 80);
            parsed.port = shouldUseDefaultPort ? "" : String(target.port);
            if (!parsed.pathname || parsed.pathname === "/") {
                parsed.pathname = "/clipboard";
            }
            const normalizedUrl = parsed.toString();
            if (!normalized.includes(normalizedUrl)) {
                normalized.push(normalizedUrl);
            }
        } catch (_: unknown) {
            logClipboard("warn", `[Clipboard] Invalid peer URL: ${trimmed}`);
        }
    }

    return normalized;
};

async function sendClipboardToPeer(candidate: string, body: string | Record<string, any>, headers: Record<string, string>): Promise<void> {
    const client = httpClient || axios;
    await client.post(candidate, body, { headers });
    logClipboard("info", "[ClipboardTx] Sent clipboard payload to peer", {
        from: clipboardNodeLabel,
        candidate,
        text: summarizeClipboardText(typeof body === "string" ? body : String(body?.text || ""))
    });
}

const formatBroadcastError = (err: unknown): string => [err instanceof Error ? err.message : String(err), (err as any)?.code ? `code=${(err as any).code}` : "", (err as any)?.response?.status ? `status=${(err as any).response.status}` : ""].filter(Boolean).join(" ");

async function sendClipboardToPeerCandidates(rawPeer: string, body: string | Record<string, any>, headers: Record<string, string>): Promise<ClipboardBroadcastResult> {
    const candidates = buildClipboardPeerUrlCandidates(rawPeer);
    if (!candidates.length) {
        return { target: rawPeer, ok: false, error: `[Broadcast] No valid peer URL: ${rawPeer}` };
    }

    const attempts = candidates.map(async (candidate) => {
        try {
            await sendClipboardToPeer(candidate, body, headers);
            return { ok: true, candidate };
        } catch (err: any) {
            return { ok: false, candidate, error: formatBroadcastError(err) };
        }
    });

    const settled = await Promise.all(attempts);
    const firstSuccess = settled.find((item) => item.ok);
    if (firstSuccess?.ok) {
        return { target: rawPeer, ok: true };
    }

    const lastError = settled[settled.length - 1]?.error || "unknown error";
    return { target: rawPeer, ok: false, error: `[Broadcast] Failed to send to ${rawPeer}: ${lastError}` };
}

export function isClipboardUnavailableError(err: unknown): boolean {
    const message = String((err as any)?.message || "");
    const fallbackMessage = String((err as any)?.fallbackError?.message || "");
    const stack = String((err as any)?.stack || "");
    const joined = `${message}\n${fallbackMessage}\n${stack}`;
    return joined.includes("xsel") || joined.includes("xclip") || joined.includes("Can't open display") || joined.includes("fallback didn't work");
}

function markClipboardUnavailable(err: unknown): void {
    if (!isClipboardUnavailableError(err)) return;
    clipboardUnsupported = true;
}

async function readClipboardWithTimeout(): Promise<string> {
    if (!clipboardFeatureEnabled) return "";
    return await Promise.race<string>([
        clipboardy.read().catch((err) => {
            markClipboardUnavailable(err);
            throw err;
        }),
        new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error(`Clipboard read timeout (${clipboardReadTimeoutMs}ms)`)), clipboardReadTimeoutMs);
        })
    ]);
}

function shouldLogClipboardErrorNow(): boolean {
    const now = Date.now();
    if (now - lastClipboardErrorLogAt < clipboardErrorLogIntervalMs) return false;
    lastClipboardErrorLogAt = now;
    return true;
}

function emitClipboardChange(text: string, source: ClipboardChangeSource) {
    for (const listener of clipboardListeners) {
        try {
            listener(text, { source });
        } catch (err) {
            logClipboard("warn", "[Clipboard] listener error", { err });
        }
    }
}

export function onClipboardChange(listener: ClipboardListener): () => void {
    clipboardListeners.add(listener);
    return () => clipboardListeners.delete(listener);
}

async function broadcastClipboard(text: string) {
    const payloadText = String(text ?? "");
    if (!payloadText) return;
    // /clipboard normalizes with trim; skip whitespace-only values to avoid 400/fallback noise.
    if (!payloadText.trim()) return;
    if (!peers || peers.length === 0) return;

    const sourceId = String(process.env.CWS_ASSOCIATED_ID || process.env.CWS_BRIDGE_USER_ID || process.env.CWS_BRIDGE_CLIENT_ID || "").trim();
    const sourceToken = String(process.env.CWS_ASSOCIATED_TOKEN || process.env.CWS_BRIDGE_USER_KEY || "").trim();
    const body: string | Record<string, any> = sourceId || sourceToken
        ? {
            text: payloadText,
            from: sourceId,
            source: sourceId,
            userId: sourceId,
            clientId: sourceId,
            ...(sourceToken ? { token: sourceToken } : {})
        }
        : payloadText;
    const headers: any = typeof body === "string"
        ? { "Content-Type": "text/plain; charset=utf-8" }
        : { "Content-Type": "application/json; charset=utf-8" };
    if (secret) {
        headers["x-auth-token"] = secret;
    }

    const traceId = `clip-${Date.now().toString(36)}`;
    logClipboard("info", "[ClipboardTx] Broadcasting clipboard payload", {
        traceId,
        from: clipboardNodeLabel,
        peers,
        text: summarizeClipboardText(payloadText)
    });

    // Prefer local dispatch pipeline first to keep behavior identical to external /clipboard calls.
    // This path uses policy-aware routing (reverse/ws/bridge) and avoids protocol drift between
    // manual API tests and real OS clipboard polling.
    const localDispatcher = (app as any)?.inject;
    if (typeof localDispatcher === "function" && sourceId) {
        try {
            const injectHeaders: Record<string, string> = {
                "content-type": "application/json"
            };
            if (secret) {
                injectHeaders["x-auth-token"] = secret;
            } else if (sourceToken) {
                injectHeaders["x-auth-token"] = sourceToken;
            }
            const relayBody: Record<string, any> = {
                text: payloadText,
                from: sourceId,
                source: sourceId,
                userId: sourceId,
                clientId: sourceId,
                ...(sourceToken ? { token: sourceToken } : {})
            };
            const relayResponse = await localDispatcher({
                method: "POST",
                url: "/clipboard",
                headers: injectHeaders,
                payload: relayBody
            });
            const relayStatus = Number((relayResponse as any)?.statusCode || 0);
            if (relayStatus >= 200 && relayStatus < 300) {
                logClipboard("info", "[ClipboardTx] Local dispatch relay completed", {
                    traceId,
                    from: sourceId,
                    status: relayStatus
                });
                return;
            }
            logClipboard("warn", "[ClipboardTx] Local dispatch relay returned non-success status", {
                traceId,
                from: sourceId,
                status: relayStatus
            });
        } catch (err: any) {
            logClipboard("warn", "[ClipboardTx] Local dispatch relay failed; fallback to peer broadcast", {
                traceId,
                from: sourceId,
                error: formatBroadcastError(err)
            });
        }
    }

    isBroadcasting = true;
    const results = await Promise.all(peers.map((rawUrl) => sendClipboardToPeerCandidates(rawUrl, body, headers)));

    for (const result of results) {
        if (!result.ok) {
            logClipboard("warn", "[ClipboardTx] Peer delivery failed", {
                traceId,
                from: clipboardNodeLabel,
                target: result.target,
                error: result.error || "unknown error"
            });
        }
    }

    const delivered = results.filter((entry) => entry.ok).map((entry) => entry.target);
    logClipboard("info", "[ClipboardTx] Broadcast cycle finished", {
        traceId,
        from: clipboardNodeLabel,
        deliveredCount: delivered.length,
        delivered
    });

    isBroadcasting = false;
}

async function pollClipboard() {
    if (clipboardUnsupported || !clipboardFeatureEnabled) return;
    try {
        const current = normalizeText(await readClipboardWithTimeout());

        if (current === lastClipboard) {
            return;
        }

        logClipboard("info", "[ClipboardPoll] Local clipboard changed", {
            node: clipboardNodeLabel,
            text: summarizeClipboardText(current)
        });
        lastClipboard = current;

        if (current === lastNetworkClipboard) {
            logClipboard("info", "[ClipboardPoll] Skip rebroadcast: change originated from network", {
                node: clipboardNodeLabel,
                text: summarizeClipboardText(current)
            });
            emitClipboardChange(current, "network");
            return;
        }

        if (isBroadcasting) {
            logClipboard("info", "[Local] Currently broadcasting, skip this change.");
            emitClipboardChange(current, "local");
            return;
        }

        emitClipboardChange(current, "local");
        await broadcastClipboard(current);
    } catch (err) {
        if (isClipboardUnavailableError(err)) {
            clipboardUnsupported = true;
            if (!clipboardUnavailableNotified) {
                logClipboard("warn", "[Poll] Clipboard backend is unavailable; polling is temporarily disabled.");
                clipboardUnavailableNotified = true;
            }
            return;
        }
        if (shouldLogClipboardErrorNow()) {
            logClipboard("error", "[Poll] Error reading clipboard", { err });
        }
    }
}

export function startClipboardPolling() {
    if (!clipboardFeatureEnabled) {
        return;
    }
    if (pollingTimer) return;
    const intervalMs = Math.max(10, parsePortableInteger(pollInterval) || 100);
    const loop = () => {
        const delay = clipboardUnsupported ? clipboardUnsupportedRetryIntervalMs : intervalMs;
        pollingTimer = setTimeout(async () => {
            if (clipboardUnsupported) {
                try {
                    await readClipboardWithTimeout();
                    clipboardUnsupported = false;
                    logClipboard("info", "[Poll] Clipboard backend became available again; polling resumed.");
                } catch (err) {
                    if (isClipboardUnavailableError(err)) {
                        if (stopClipboardRetryOnUnsupported) {
                            return;
                        }
                        if (shouldLogClipboardErrorNow()) {
                            logClipboard("warn", "[Poll] Clipboard backend still unavailable.");
                        }
                    } else if (shouldLogClipboardErrorNow()) {
                        logClipboard("warn", "[Poll] Clipboard backend still unavailable.");
                    }
                    loop();
                    return;
                }
            }
            await pollClipboard();
            loop();
        }, delay);
    };
    loop();
}

export async function readClipboard(): Promise<string> {
    if (!clipboardFeatureEnabled) return "";
    try {
        return await clipboardy.read();
    } catch (err) {
        markClipboardUnavailable(err);
        return "";
    }
}

export async function writeClipboard(text: string): Promise<boolean> {
    if (!clipboardFeatureEnabled) return false;
    try {
        await clipboardy.write(text);
    } catch (err) {
        markClipboardUnavailable(err);
        return false;
    }
    lastNetworkClipboard = text;
    lastClipboard = text;
    logClipboard("info", "[ClipboardRx] Clipboard payload applied", {
        node: clipboardNodeLabel,
        text: summarizeClipboardText(text)
    });
    emitClipboardChange(text, "network");
    return true;
}
