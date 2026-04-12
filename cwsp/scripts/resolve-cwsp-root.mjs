import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * `cwsp/scripts` may symlink to `runtime/scripts`; realpath leaves __dirname at runtime/scripts.
 * Resolve the directory that contains cwsp-runtime's package.json.
 */
export function resolveCwspPackageRoot(scriptsDir) {
    const candidates = [resolve(scriptsDir, ".."), resolve(scriptsDir, "../cwsp")];
    for (const dir of candidates) {
        const pkgPath = resolve(dir, "package.json");
        if (!existsSync(pkgPath)) continue;
        try {
            const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
            if (pkg.name === "cwsp-runtime") return dir;
        } catch {
            /* ignore */
        }
    }
    throw new Error(`[cwsp] Could not find cwsp-runtime package.json (from ${scriptsDir})`);
}
