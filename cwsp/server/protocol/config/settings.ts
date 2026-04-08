import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type HttpTarget = {
    id?: string;
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    unencrypted?: boolean;
};

export type CoreSettings = {
    mode?: "native" | "web" | "desktop" | "mobile" | "server" | "daemon" | "client" | "daemon-client" | "endpoint";
    roles?: string[];
    bridge?: Record<string, unknown>;
    topology?: {
        enabled?: boolean;
        nodes?: Array<Record<string, unknown>>;
        links?: Array<Record<string, unknown>>;
    };
    endpointIDs?: Record<string, Record<string, unknown>>;
    ops?: {
        httpTargets?: HttpTarget[];
        allowUnencrypted?: boolean;
        allowInsecureTls?: boolean;
        logLevel?: "debug" | "info" | "warn" | "error";
        [key: string]: unknown;
    };
    [key: string]: unknown;
};

export type AiSettings = {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    customModel?: string;
    bearerToken?: string;
    proxyPath?: string;
    customInstructions?: unknown[];
    activeInstructionId?: string;
    [key: string]: unknown;
};

export type WebdavSettings = {
    url?: string;
    username?: string;
    password?: string;
    [key: string]: unknown;
};

export type TimelineSettings = {
    enabled?: boolean;
    [key: string]: unknown;
};

export type AppearanceSettings = {
    theme?: string;
    language?: string;
    [key: string]: unknown;
};

export type SpeechSettings = {
    voice?: string;
    [key: string]: unknown;
};

export type GridSettings = {
    columns?: number;
    rows?: number;
    [key: string]: unknown;
};

export type Settings = {
    core?: CoreSettings;
    ai?: AiSettings;
    webdav?: WebdavSettings;
    timeline?: TimelineSettings;
    appearance?: AppearanceSettings;
    speech?: SpeechSettings;
    grid?: GridSettings;
    [key: string]: unknown;
};

const cloneValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const mergeUnknown = (baseValue: unknown, nextValue: unknown): unknown => {
    if (Array.isArray(nextValue)) return [...nextValue];
    if (isPlainObject(baseValue) && isPlainObject(nextValue)) {
        const out: Record<string, unknown> = { ...baseValue };
        for (const [key, value] of Object.entries(nextValue)) {
            if (value === undefined) continue;
            out[key] = mergeUnknown(baseValue[key], value);
        }
        return out;
    }
    return nextValue === undefined ? baseValue : nextValue;
};

export const DEFAULT_SETTINGS: Settings = {
    core: {
        mode: "endpoint",
        roles: ["endpoint", "requestor-initiated", "responser-initiated", "requestor-initiator", "responser-initiator"],
        bridge: {
            enabled: true,
            mode: "active",
            endpoints: []
        },
        topology: {
            enabled: true,
            nodes: [],
            links: []
        },
        endpointIDs: {},
        ops: {
            httpTargets: [],
            allowUnencrypted: false,
            allowInsecureTls: false,
            logLevel: "info"
        }
    },
    ai: {
        customInstructions: [],
        activeInstructionId: ""
    },
    webdav: {},
    timeline: {
        enabled: false
    },
    appearance: {},
    speech: {},
    grid: {
        columns: 0,
        rows: 0
    }
};

export const mergeSettings = <T extends Settings>(defaults: T, next: Partial<T> | null | undefined): T => {
    if (!next || typeof next !== "object") return cloneValue(defaults);
    return mergeUnknown(cloneValue(defaults), next) as T;
};

export const makeSettingsMerger = <T extends Settings>(defaults: T) => (next: Partial<T> | null | undefined): T => mergeSettings(defaults, next);

export const createSettingsStore = <T extends Settings>(filePath: string | undefined, defaults: T) => {
    const merger = makeSettingsMerger(defaults);
    return {
        async readCoreSettings(): Promise<T> {
            if (!filePath) return merger({});
            try {
                const raw = await readFile(filePath, "utf-8");
                const parsed = JSON.parse(raw) as Partial<T>;
                return merger(parsed);
            } catch {
                return merger({});
            }
        },
        async writeCoreSettings(next: Partial<T>): Promise<T> {
            const merged = merger(next);
            if (filePath) {
                await mkdir(path.dirname(filePath), { recursive: true });
                await writeFile(filePath, JSON.stringify(merged, null, 2), "utf-8");
            }
            return merged;
        }
    };
};
