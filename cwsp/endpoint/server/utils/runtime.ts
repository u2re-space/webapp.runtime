import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const isDenoRuntime = (): boolean => typeof (globalThis as any).Deno !== "undefined" && Boolean((globalThis as any).Deno?.version?.deno);

export const getEnv = (key: string): string | undefined => {
    if (isDenoRuntime()) {
        try {
            return (globalThis as any).Deno?.env?.get?.(key) ?? undefined;
        } catch {
            return undefined;
        }
    }
    return process.env[key];
};

export const getEnvObject = (): Record<string, string> => {
    if (isDenoRuntime()) {
        try {
            return ((globalThis as any).Deno?.env?.toObject?.() as Record<string, string>) || {};
        } catch {
            return {};
        }
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) {
        if (typeof v === "string") out[k] = v;
    }
    return out;
};

/**
 * Default public HTTPS port when env/JSON omit it: **443** so `https://host/` matches the bound port.
 * If bind fails (no root / no `cap_net_bind_service`), `server/index.ts` tries `CWS_PUBLIC_FALLBACK_PORTS`
 * (default includes 8444). Override with `CWS_PUBLIC_HTTPS_PORT` / portable config.
 */
export const defaultPublicHttpsPortForPlatform = (): number => 443;

/** Default public HTTP port when env/JSON omit it: **80**, with same fallback story as HTTPS. */
export const defaultPublicHttpPortForPlatform = (): number => 80;

/**
 * Walk upward from `fromDir` to find a directory containing portable config.
 * Preferred layout is `config/portable.config.json`; root `portable.config.json` is legacy fallback.
 */
export const findPortableConfigRoot = (fromDir: string, maxHops = 16): string | null => {
    let dir = path.resolve(fromDir);
    for (let i = 0; i < maxHops; i++) {
        try {
            if (fs.existsSync(path.join(dir, "config", "portable.config.json"))) return dir;
            if (fs.existsSync(path.join(dir, "portable.config.json"))) return dir;
        } catch {
            /* ignore */
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
};

export const moduleDirname = (meta: ImportMeta): string => {
    // Deno provides import.meta.dirname; Node does not.
    const anyMeta = meta as any;
    if (typeof anyMeta?.dirname === "string") return anyMeta.dirname;
    const rawUrl = typeof anyMeta?.url === "string" ? anyMeta.url : "";
    if (rawUrl) {
        try {
            return path.dirname(fileURLToPath(rawUrl));
        } catch {
            /* fallthrough */
        }
    }
    return process.cwd();
};

export const isMainModule = (meta: ImportMeta): boolean => {
    const anyMeta = meta as any;
    // Deno provides import.meta.main
    if (typeof anyMeta?.main === "boolean") return anyMeta.main;
    // Node: best-effort check (tsx / npx may use symlinked or relative argv[1])
    const rawUrl = anyMeta?.url;
    if (typeof rawUrl !== "string" || !rawUrl) return false;
    const entry = process.argv?.[1];
    if (!entry) return false;
    const metaPath = fileURLToPath(rawUrl);
    const resolvedEntry = path.resolve(entry);
    if (resolvedEntry === metaPath) return true;
    try {
        if (fs.existsSync(resolvedEntry) && fs.existsSync(metaPath)) {
            const realEntry = fs.realpathSync(resolvedEntry);
            const realMeta = fs.realpathSync(metaPath);
            if (realEntry === realMeta) return true;
        }
    } catch {
        /* ignore */
    }
    const fromCwd = path.resolve(process.cwd(), entry);
    if (fromCwd === metaPath) return true;
    try {
        if (fs.existsSync(fromCwd) && fs.existsSync(metaPath) && fs.realpathSync(fromCwd) === fs.realpathSync(metaPath)) {
            return true;
        }
    } catch {
        /* ignore */
    }
    return false;
};

export const runtimeArgs = (): string[] => {
    if (isDenoRuntime()) {
        return ((globalThis as any).Deno?.args as string[]) || [];
    }
    return process.argv.slice(2);
};
