/**
 * Shared deploy device manifest loader for CWSP endpoint distribution.
 * Manifest: endpoint/config/devices.deploy.json (also via runtime/cwsp/config symlink).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** @typedef {{ id: string, os: "windows"|"linux", ssh: string, portableConfig?: string, pathCandidates?: string[], profiles?: string[], legacyProfile?: string, sshPort?: string }} DeployDevice */

const parseList = (value) =>
    String(value || "")
        .split(/[,\n;]/)
        .map((item) => item.trim())
        .filter(Boolean);

/** PowerShell snippet after `Set-Location` to cwsp root (used with deploy + PM2). */
export const psSetPortableEnv = (portableRelative) => {
    const rel = String(portableRelative || "")
        .trim()
        .replace(/\//g, "\\")
        .replace(/^\\+/, "");
    if (!rel) return "";
    const esc = rel.replace(/'/g, "''");
    return `$env:CWS_PORTABLE_CONFIG_PATH = Join-Path (Get-Location) '${esc}'; `;
};

/**
 * @param {string} layoutRoot cwsp endpoint root (contains config/)
 */
export const readDeployDevicesManifest = (layoutRoot) => {
    const manifestPath = join(layoutRoot, "config", "devices.deploy.json");
    if (!existsSync(manifestPath)) return null;
    try {
        const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
        const devicesRaw = parsed && typeof parsed === "object" ? parsed.devices : null;
        if (!Array.isArray(devicesRaw) || devicesRaw.length === 0) {
            console.warn("[cwsp-deploy-devices] manifest has no devices[]");
            return null;
        }
        /** @type {DeployDevice[]} */
        const devices = [];
        for (const entry of devicesRaw) {
            if (!entry || typeof entry !== "object") continue;
            const id = String(entry.id || "").trim();
            const ssh = String(entry.ssh || "").trim();
            const osRaw = String(entry.os || "").trim().toLowerCase();
            const os = osRaw === "windows" || osRaw === "win32" ? "windows" : "linux";
            if (!id || !ssh) continue;
            devices.push({
                id,
                os,
                ssh,
                portableConfig: String(entry.portableConfig || "").trim() || undefined,
                pathCandidates: Array.isArray(entry.pathCandidates)
                    ? entry.pathCandidates.map((x) => String(x || "").trim()).filter(Boolean)
                    : [],
                profiles: Array.isArray(entry.profiles)
                    ? entry.profiles.map((x) => String(x || "").trim().toLowerCase()).filter(Boolean)
                    : [],
                legacyProfile: String(entry.legacyProfile || "").trim().toLowerCase() || undefined,
                sshPort: entry.sshPort != null ? String(entry.sshPort).trim() : undefined
            });
        }
        return { manifestPath, devices, defaults: parsed?.defaults };
    } catch (err) {
        console.warn("[cwsp-deploy-devices] failed to read manifest:", err?.message || err);
        return null;
    }
};

export const filterDeployDevices = ({ devices, legacyHostsFilter, deviceIdsFilter }) => {
    const idsLc = parseList(Array.isArray(deviceIdsFilter) ? deviceIdsFilter.join(",") : String(deviceIdsFilter || ""));
    if (idsLc.length) {
        const set = new Set(idsLc.map((id) => id.toLowerCase()));
        return devices.filter((d) => set.has(String(d.id).toLowerCase()));
    }
    const legacy = Array.isArray(legacyHostsFilter) ? legacyHostsFilter : parseList(legacyHostsFilter || "");
    if (!legacy.length) return devices;

    /** @type {DeployDevice[]} */
    const picked = [];
    const legacyLc = legacy.map((h) => h.toLowerCase());
    for (const d of devices) {
        const leg = String(d.legacyProfile || "").toLowerCase();
        const profiles = (d.profiles || []).map((p) => p.toLowerCase());
        const match = legacyLc.some((h) => h === leg || profiles.includes(h));
        if (match) picked.push(d);
    }
    return picked.length ? picked : devices;
};

export const buildLegacySyntheticDevices = (defaultProfiles) => {
    /** @type {DeployDevice[]} */
    const out = [];
    for (const [key, profile] of Object.entries(defaultProfiles)) {
        let index = 0;
        for (const ssh of profile.sshTargets || []) {
            const id = `${key}-${++index}`;
            let portable =
                typeof profile.configFile === "string" && profile.configFile.trim()
                    ? profile.configFile.trim()
                    : undefined;
            if (key.toLowerCase() === "windows110" && /\.111\b|:111\b|\b111\b/i.test(String(ssh))) {
                portable = "config/portable.config.111.json";
            }
            out.push({
                id,
                os: profile.os === "windows" ? "windows" : "linux",
                ssh,
                portableConfig: portable,
                pathCandidates: profile.pathCandidates || [],
                profiles: [],
                legacyProfile: key.toLowerCase()
            });
        }
    }
    return out;
};

export { parseList };
