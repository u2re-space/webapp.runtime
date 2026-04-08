#!/usr/bin/env node
/**
 * Kotlin **CWSAndroid** APK build (not Electron). The npm name `build:electron:android` is legacy only.
 *
 * Gradle must run inside the Android project (`apps/CWSAndroid`); APKs are emitted under
 * `app/build/outputs/apk/...` there. After a successful build, `.apk` files are **copied** into
 * `cwsp/dist/electron/android/` (same `dist/electron` family as desktop packaging) for one place
 * to collect artifacts. Override with `CWS_ANDROID_DIST_OUT`.
 *
 * @see https://github.com/u2re-space/CWSAndroid — submodule `apps/CWSAndroid`
 *
 * 1. Refreshes portable bundle (Fastify + frontend + config) unless --skip-portable
 * 2. Runs `./gradlew` assemble (default `:app:assembleCwsDebug`; `CWS_ANDROID_PRODUCT_FLAVOR=cwsp` → `assembleCwspDebug`)
 * 3. Copies `*.apk` from `app/build/outputs/apk/**` → `dist/electron/android/**`
 */
import { spawnSync } from "node:child_process";
import { cp, copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname as pathDirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = pathDirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

const argv = new Set(process.argv.slice(2));
const skipPortable = argv.has("--skip-portable");
const withCapacitorWeb = argv.has("--with-capacitor-web");
const help = argv.has("--help") || argv.has("-h");

if (help) {
    console.log(`build-cws-android.mjs

  Android .apk via Kotlin CWSAndroid (Gradle), same product family as CWSP portable.

Options:
  --skip-portable       Do not run build:portable first
  --with-capacitor-web  Run build-capacitor-web.mjs first so dist/capacitor exists (Capacitor shell in Kotlin app)
  --help, -h            This text

Env:
  CWS_ANDROID_ROOT         Path to CWSAndroid repo (default: ../../apps/CWSAndroid from cwsp)
  CWS_GRADLEW_TASK         Gradle task (default: :app:assembleCwsDebug or :app:assembleCwspDebug)
  CWS_ANDROID_PRODUCT_FLAVOR  cws | cwsp — default assemble when CWS_GRADLEW_TASK unset (cwsp = Capacitor appId space.u2re.cwsp)
  CWS_ANDROID_FRONTEND_DIR Optional: sync dist/portable/frontend into this folder
  CWS_ANDROID_DIST_OUT     Relative to cwsp package: APK copy destination (default: dist/electron/android)
  CWS_SKIP_ANDROID_DIST_COPY  Set to 1 to skip copying APKs into dist/
`);
    process.exit(0);
}

const defaultAndroidRoot = resolve(pkgRoot, "../../apps/CWSAndroid");
const androidRoot = resolve(process.env.CWS_ANDROID_ROOT || defaultAndroidRoot);
const productFlavor = (process.env.CWS_ANDROID_PRODUCT_FLAVOR || "cws").trim().toLowerCase();
const defaultGradleAssemble =
    productFlavor === "cwsp" ? ":app:assembleCwspDebug" : ":app:assembleCwsDebug";
const gradleTask = (process.env.CWS_GRADLEW_TASK || defaultGradleAssemble).trim();
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const gradlewPath = resolve(androidRoot, gradlew);

const runPortable = () => {
    const r = spawnSync(process.execPath, [resolve(__dirname, "build-portable.mjs")], {
        cwd: pkgRoot,
        stdio: "inherit"
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
};

const runCapacitorWeb = () => {
    const r = spawnSync(process.execPath, [resolve(__dirname, "build-capacitor-web.mjs")], {
        cwd: pkgRoot,
        stdio: "inherit"
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
};

/** @param {string} dir @param {string} base @param {{ full: string; rel: string }[]} acc */
const walkApks = (dir, base, acc) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, ent.name);
        if (ent.isDirectory()) walkApks(full, base, acc);
        else if (ent.isFile() && ent.name.endsWith(".apk")) acc.push({ full, rel: relative(base, full) });
    }
};

const copyApksToDist = (androidProjectRoot) => {
    if (["1", "true", "yes", "on"].includes(String(process.env.CWS_SKIP_ANDROID_DIST_COPY || "").trim().toLowerCase())) {
        console.log("[build:cws-android] Skip APK copy (CWS_SKIP_ANDROID_DIST_COPY)");
        return;
    }
    const apkRoot = resolve(androidProjectRoot, "app/build/outputs/apk");
    if (!existsSync(apkRoot)) {
        console.warn(`[build:cws-android] No Gradle output at ${apkRoot}; skip dist copy`);
        return;
    }
    const found = [];
    walkApks(apkRoot, apkRoot, found);
    if (!found.length) {
        console.warn(`[build:cws-android] No .apk under ${apkRoot}; skip dist copy`);
        return;
    }
    const relOut = (process.env.CWS_ANDROID_DIST_OUT || "dist/electron/android").trim().replace(/^\/+/, "");
    const distAndroid = resolve(pkgRoot, relOut);
    for (const { full, rel } of found) {
        const dest = join(distAndroid, rel);
        mkdirSync(pathDirname(dest), { recursive: true });
        copyFileSync(full, dest);
    }
    console.log(`[build:cws-android] Copied ${found.length} APK(s) -> ${distAndroid}`);
};

const syncFrontendToAndroid = () => {
    const dest = process.env.CWS_ANDROID_FRONTEND_DIR?.trim();
    if (!dest) return;
    const absDest = resolve(dest);
    const src = resolve(pkgRoot, "dist/portable/frontend");
    if (!existsSync(src)) {
        console.warn(`[build:cws-android] Skip frontend sync: missing ${src}`);
        return;
    }
    mkdirSync(pathDirname(absDest), { recursive: true });
    if (existsSync(absDest)) rmSync(absDest, { recursive: true, force: true });
    cp(src, absDest, { recursive: true, force: true });
    console.log(`[build:cws-android] Synced frontend ${src} -> ${absDest}`);
};

const main = () => {
    if (!existsSync(androidRoot)) {
        console.error(
            `[build:cws-android] CWSAndroid not found at:\n  ${androidRoot}\n\n` +
                `Init the submodule from the monorepo root:\n` +
                `  git submodule update --init apps/CWSAndroid\n\n` +
                `Or set CWS_ANDROID_ROOT to a clone of https://github.com/u2re-space/CWSAndroid`
        );
        process.exit(1);
    }

    if (!existsSync(gradlewPath)) {
        console.error(`[build:cws-android] Missing ${gradlewPath} — is CWSAndroid checked out completely?`);
        process.exit(1);
    }

    if (!skipPortable) {
        console.log("[build:cws-android] Running build:portable (server + frontend + config)…");
        runPortable();
    } else {
        console.log("[build:cws-android] Skipping portable build (--skip-portable)");
    }

    syncFrontendToAndroid();

    if (withCapacitorWeb) {
        console.log("[build:cws-android] Running build-capacitor-web.mjs (dist/capacitor for CapacitorWebActivity)…");
        runCapacitorWeb();
    }

    console.log(`[build:cws-android] Gradle in ${androidRoot}: ${gradlew} ${gradleTask}`);
    const shell = process.platform === "win32";
    const r = spawnSync(gradlewPath, [gradleTask], {
        cwd: androidRoot,
        stdio: "inherit",
        shell,
        env: { ...process.env }
    });

    if (r.status !== 0) {
        process.exit(r.status ?? 1);
    }

    copyApksToDist(androidRoot);

    console.log(
        "[build:cws-android] Gradle output (source of truth):\n" +
            `  ${resolve(androidRoot, "app/build/outputs/apk/")}\n` +
            `Mirror under cwsp: ${resolve(pkgRoot, (process.env.CWS_ANDROID_DIST_OUT || "dist/electron/android").trim().replace(/^\/+/, ""))}\n` +
            "Set JAVA_HOME and ANDROID_HOME if Gradle failed (see apps/CWSAndroid/AGENTS.md)."
    );
};

main();
