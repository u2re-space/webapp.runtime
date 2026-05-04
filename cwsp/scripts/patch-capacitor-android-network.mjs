#!/usr/bin/env node
/**
 * After `cap sync`, inject Android network security config so the WebView can:
 * - Use cleartext HTTP to localhost / emulator (admin :8080, dev servers).
 * - Trust user-installed CAs (helps self-signed HTTPS :8443 when the cert is installed on device).
 *
 * CrossWord UI: Settings → Server (endpoint URL, admin origins) must still use reachable hosts;
 * for arbitrary LAN HTTP, extend resources/android/network_security_config.xml with <domain> entries.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const parseCsv = (value) =>
    String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
const sanitizeHost = (value) => String(value || "").trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/:\d+$/, "");

/**
 * @param {string} pkgRoot - cwsp package root (parent of android/)
 */
export function patchCapacitorAndroidNetwork(pkgRoot) {
    const manifestPath = resolve(pkgRoot, "android/app/src/main/AndroidManifest.xml");
    const xmlDir = resolve(pkgRoot, "android/app/src/main/res/xml");
    const destXml = resolve(xmlDir, "network_security_config.xml");
    const srcXml = resolve(pkgRoot, "resources/android/network_security_config.xml");

    if (!existsSync(manifestPath)) {
        console.log("[cap-net] No AndroidManifest — skip (add platform: npm run cap:add:android)");
        return;
    }
    if (!existsSync(srcXml)) {
        console.warn(`[cap-net] Missing template ${srcXml}`);
        return;
    }

    mkdirSync(xmlDir, { recursive: true });
    copyFileSync(srcXml, destXml);
    let xml = readFileSync(destXml, "utf8");
    const extraDomains = parseCsv(process.env.CWS_CAP_CLEAR_DOMAINS)
        .map(sanitizeHost)
        .filter(Boolean);
    if (extraDomains.length > 0) {
        const uniqueDomains = Array.from(new Set(extraDomains));
        const injectedDomains = uniqueDomains
            .map((host) => `        <domain includeSubdomains="false">${host}</domain>`)
            .join("\n");
        if (/<\/domain-config>/.test(xml)) {
            xml = xml.replace(/<\/domain-config>/, `${injectedDomains}\n    </domain-config>`);
            writeFileSync(destXml, xml, "utf8");
            console.log(`[cap-net] Added cleartext domains from CWS_CAP_CLEAR_DOMAINS: ${uniqueDomains.join(", ")}`);
        }
    }
    console.log(`[cap-net] Wrote ${destXml}`);

    let manifest = readFileSync(manifestPath, "utf8");
    if (/android:networkSecurityConfig\s*=/.test(manifest)) {
        console.log("[cap-net] AndroidManifest already has networkSecurityConfig");
        return;
    }

    if (!/<application\s/.test(manifest)) {
        console.warn("[cap-net] Unexpected AndroidManifest — no <application tag; skip manifest patch");
        return;
    }

    manifest = manifest.replace(/<application\s/, '<application android:networkSecurityConfig="@xml/network_security_config" ');
    writeFileSync(manifestPath, manifest, "utf8");
    console.log(`[cap-net] Patched ${manifestPath} (networkSecurityConfig)`);
}

const _entry = process.argv[1];
let isMain = false;
if (_entry) {
    try {
        isMain = resolve(fileURLToPath(import.meta.url)) === resolve(_entry);
    } catch {
        /* ignore */
    }
}
if (isMain) {
    const pkgRoot = resolveCwspPackageRoot(__dirname);
    patchCapacitorAndroidNetwork(pkgRoot);
}
