import fs from "node:fs";
import path from "node:path";

import { resolvePortableTextValuePath, safeJsonParse } from "../utils/parsing.ts";
import { moduleDirname, runtimeArgs } from "../utils/runtime.ts";

export type ServerV2BootstrapOptions = {
    argv?: string[];
    configPath?: string;
    configDir?: string;
    dataDir?: string;
};

export type ServerV2BootstrapResult = {
    argv: string[];
    configDir?: string;
    configPath?: string;
    dataDir?: string;
    launcherEnvKeys: string[];
};

const ROOT = moduleDirname(import.meta);

const resolveArgValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(",");
    return typeof value === "string" ? value.trim() : "";
};

const getCliArg = (args: string[], flag: string): string => {
    for (let idx = args.length - 1; idx >= 0; idx -= 1) {
        const current = args[idx];
        if (current === flag && args.length > idx + 1 && !args[idx + 1].startsWith("--")) {
            return resolveArgValue(args[idx + 1]);
        }
        if (current.startsWith(`${flag}=`)) {
            return resolveArgValue(current.slice(flag.length + 1));
        }
    }
    return "";
};

const normalizeEnvValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(",");
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    return resolveArgValue(value);
};

const resolvePortableConfigPath = (args: string[], override?: string): string => {
    const explicit =
        resolveArgValue(override) ||
        getCliArg(args, "--config") ||
        resolveArgValue(process.env.CWS_PORTABLE_CONFIG_PATH) ||
        resolveArgValue(process.env.ENDPOINT_CONFIG_JSON_PATH) ||
        resolveArgValue(process.env.PORTABLE_CONFIG_PATH);
    const candidate = explicit || path.resolve(ROOT, "../../portable.config.json");
    if (!candidate) return "";
    return resolvePortableTextValuePath(candidate, process.cwd());
};

const resolvePortableDataPath = (args: string[], override?: string): string => {
    const explicit =
        resolveArgValue(override) ||
        getCliArg(args, "--data") ||
        resolveArgValue(process.env.CWS_PORTABLE_DATA_PATH) ||
        resolveArgValue(process.env.CWS_DATA_DIR);
    if (!explicit) return "";
    return resolvePortableTextValuePath(explicit, process.cwd());
};

const resolveExplicitConfigDir = (args: string[], override?: string): string => {
    const explicit =
        resolveArgValue(override) ||
        getCliArg(args, "--config-dir") ||
        resolveArgValue(process.env.CWS_CONFIG_DIR);
    if (!explicit) return "";
    return resolvePortableTextValuePath(explicit, process.cwd());
};

const readLauncherEnv = (portableConfigPath: string): Record<string, unknown> => {
    if (!portableConfigPath) return {};
    try {
        const raw = fs.readFileSync(portableConfigPath, "utf8");
        const parsed = safeJsonParse<Record<string, unknown>>(raw);
        const launcherEnv = parsed && typeof parsed === "object" ? parsed.launcherEnv : undefined;
        return launcherEnv && typeof launcherEnv === "object" && !Array.isArray(launcherEnv) ? (launcherEnv as Record<string, unknown>) : {};
    } catch {
        return {};
    }
};

let bootstrapCache: ServerV2BootstrapResult | null = null;

export const applyServerV2Bootstrap = (options: ServerV2BootstrapOptions = {}): ServerV2BootstrapResult => {
    if (!options.argv && !options.configPath && !options.configDir && !options.dataDir && bootstrapCache) {
        return bootstrapCache;
    }

    const argv = options.argv || runtimeArgs();
    const configPath = resolvePortableConfigPath(argv, options.configPath);
    const dataDir = resolvePortableDataPath(argv, options.dataDir);
    const configDir = resolveExplicitConfigDir(argv, options.configDir) || (configPath ? path.dirname(configPath) : "");
    const launcherEnv = readLauncherEnv(configPath);
    const launcherEnvKeys: string[] = [];

    for (const [key, rawValue] of Object.entries(launcherEnv)) {
        const value = normalizeEnvValue(rawValue);
        if (!value) continue;
        launcherEnvKeys.push(key);
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }

    if (configPath) {
        process.env.CWS_PORTABLE_CONFIG_PATH = configPath;
    }
    if (dataDir) {
        process.env.CWS_PORTABLE_DATA_PATH = dataDir;
    }
    if (configDir && !process.env.CWS_CONFIG_DIR) {
        process.env.CWS_CONFIG_DIR = configDir;
    }

    const result: ServerV2BootstrapResult = {
        argv,
        configDir: configDir || undefined,
        configPath: configPath || undefined,
        dataDir: dataDir || undefined,
        launcherEnvKeys
    };

    if (!options.argv && !options.configPath && !options.configDir && !options.dataDir) {
        bootstrapCache = result;
    }

    return result;
};
