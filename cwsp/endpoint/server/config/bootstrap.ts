/**
 * Bootstrap resolver for the CWSP endpoint runtime.
 *
 * This module decides where `portable.config.json`, the runtime data directory,
 * and launcher-provided env defaults come from before the rest of the server
 * reads configuration.
 */
import fs from "node:fs";
import path from "node:path";

import { resolvePortableTextValuePath, safeJsonParse } from "../utils/parsing.ts";
import { findPortableConfigRoot, moduleDirname, runtimeArgs } from "../utils/runtime.ts";

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

const MODULE_DIR = moduleDirname(import.meta);

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

const argvHasFlag = (args: string[], ...flags: string[]): boolean => {
    const set = new Set(flags);
    for (const entry of args) {
        if (set.has(entry)) return true;
    }
    return false;
};

/**
 * Linux/default gateway profile (`portable.config.json`) vs Windows laptop (`portable.config.110.json`).
 * Precedence: `--config` / env (handled earlier) → `--110` / `--200` / `-200` → `CWS_DEFAULT_PORTABLE_PROFILE`
 * → platform (`win32` → 110, else → 200).
 */
const resolvePortableProfileConfigPath = (args: string[]): string => {
    const configFolder = path.join(MODULE_DIR, "..", "..", "config");
    const p110 = path.join(configFolder, "portable.config.110.json");
    const p200 = path.join(configFolder, "portable.config.json");

    if (argvHasFlag(args, "--110", "--profile-110")) {
        return fs.existsSync(p110) ? p110 : "";
    }
    if (argvHasFlag(args, "--200", "-200", "--profile-200")) {
        return fs.existsSync(p200) ? p200 : "";
    }

    const pe = String(process.env.CWS_DEFAULT_PORTABLE_PROFILE || "")
        .trim()
        .toLowerCase();
    if (pe === "110" && fs.existsSync(p110)) return p110;
    if (pe === "200" && fs.existsSync(p200)) return p200;

    if (process.platform === "win32" && fs.existsSync(p110)) return p110;
    if (process.platform !== "win32" && fs.existsSync(p200)) return p200;

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
    const profilePick = !resolveArgValue(explicit) ? resolvePortableProfileConfigPath(args) : "";
    const cwdConfigCandidate = path.resolve(process.cwd(), "config", "portable.config.json");
    const cwdCandidate = path.resolve(process.cwd(), "portable.config.json");
    /** Nearest ancestor with `portable.config.json` (cwsp root for TS; bundle dir for `cwsp.mjs`). */
    const portableRootFromModule = findPortableConfigRoot(MODULE_DIR);
    const bundleConfigCandidate = path.join(
        portableRootFromModule || MODULE_DIR,
        "config",
        "portable.config.json"
    );
    const bundleCandidate = path.join(
        portableRootFromModule || MODULE_DIR,
        "portable.config.json"
    );
    const legacyConfigCandidate = path.resolve(MODULE_DIR, "../../config/portable.config.json");
    const legacyCandidate = path.resolve(MODULE_DIR, "../../portable.config.json");
    const defaultCandidate = fs.existsSync(bundleConfigCandidate)
        ? bundleConfigCandidate
        : fs.existsSync(bundleCandidate)
          ? bundleCandidate
          : fs.existsSync(cwdConfigCandidate)
            ? cwdConfigCandidate
            : fs.existsSync(legacyConfigCandidate)
              ? legacyConfigCandidate
        : fs.existsSync(cwdCandidate)
          ? cwdCandidate
          : fs.existsSync(legacyCandidate)
            ? legacyCandidate
            : cwdCandidate;
    const candidate = resolveArgValue(explicit) || profilePick || defaultCandidate;
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

/**
 * Resolve config/data paths and apply launcher-provided env defaults once for
 * the current process.
 *
 * WHY: many downstream modules read from `process.env` directly, so bootstrap
 * has to normalize CLI args, bundle-relative defaults, and portable launcher
 * overrides before config storage is initialized.
 */
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
