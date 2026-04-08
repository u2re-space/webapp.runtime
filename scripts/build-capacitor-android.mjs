#!/usr/bin/env node
/**
 * Capacitor Android APK: `build:capacitor` then Gradle in cwsp/android.
 * APKs are mirrored under dist/capacitor/android/ (same idea as CWSAndroid → dist/electron/android).
 *
 * Env:
 *   CWS_CAPACITOR_GRADLEW_TASK   Gradle task (default :app:assembleDebug)
 *   CWS_CAPACITOR_DIST_OUT       Relative to cwsp: APK copy dest (default dist/capacitor/android)
 *   CWS_SKIP_CAPACITOR_DIST_COPY Set to 1 to skip APK mirror
 * Options:
 *   --skip-portable   Passed to web sync (reuse dist/portable/frontend)
 *   --skip-sync       Skip build-capacitor.mjs; only Gradle + copy (android/ and dist/capacitor must exist)
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname as pathDirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";
import { patchCapacitorAndroidNetwork } from "./patch-capacitor-android-network.mjs";

const __dirname = pathDirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);

const argv = new Set(process.argv.slice(2));
const skipPortable = argv.has("--skip-portable");
const skipSync = argv.has("--skip-sync");
const help = argv.has("--help") || argv.has("-h");

if (help) {
    console.log(`build-capacitor-android.mjs

  Capacitor WebView APK (cwsp/android), outputs mirrored to dist/capacitor/android/.

Options:
  --skip-portable   Do not run full portable build before copying frontend
  --skip-sync       Do not run cap sync (only Gradle + APK copy)
  --help, -h        This text

Env:
  CWS_CAPACITOR_GRADLEW_TASK      (default :app:assembleDebug)
  CWS_CAPACITOR_DIST_OUT          (default dist/capacitor/android)
  CWS_SKIP_CAPACITOR_DIST_COPY    Set to 1 to skip copying APKs into dist/
  ANDROID_HOME or ANDROID_SDK_ROOT  Android SDK (used to auto-write android/local.properties)
  CWS_ANDROID_SDK_ROOT            Optional explicit SDK path (overrides env detection)

Compare: Kotlin CWSAndroid → npm run build:cws-android (apps/CWSAndroid).`);
    process.exit(0);
}

const gradleTask = (process.env.CWS_CAPACITOR_GRADLEW_TASK || ":app:assembleDebug").trim();
const androidRoot = resolve(pkgRoot, "android");
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const gradlewPath = resolve(androidRoot, gradlew);

/** @param {string} dir */
const looksLikeAndroidSdk = (dir) =>
    existsSync(dir) && existsSync(join(dir, "platforms")) && existsSync(join(dir, "build-tools"));

/**
 * Resolve Android SDK root for Gradle (local.properties sdk.dir).
 * @returns {string | null}
 */
const resolveAndroidSdkRoot = () => {
    const explicit = process.env.CWS_ANDROID_SDK_ROOT?.trim();
    if (explicit && looksLikeAndroidSdk(explicit)) return resolve(explicit);
    for (const key of ["ANDROID_HOME", "ANDROID_SDK_ROOT"]) {
        const v = process.env[key]?.trim();
        if (v && looksLikeAndroidSdk(v)) return resolve(v);
    }
    const home = process.env.HOME || process.env.USERPROFILE || "";
    const candidates = [
        join(home, "Android", "Sdk"),
        join(home, "Library", "Android", "sdk"),
        join(process.env.LOCALAPPDATA || "", "Android", "Sdk")
    ];
    for (const c of candidates) {
        if (c && looksLikeAndroidSdk(c)) return resolve(c);
    }
    return null;
};

/**
 * Ensure android/local.properties has sdk.dir (Gradle does not always honor ANDROID_HOME alone).
 * @returns {boolean}
 */
const ensureLocalProperties = () => {
    const lp = join(androidRoot, "local.properties");
    let existing = "";
    if (existsSync(lp)) {
        try {
            existing = readFileSync(lp, "utf8");
            if (/^\s*sdk\.dir\s*=/m.test(existing)) return true;
        } catch {
            /* fall through */
        }
    }
    const sdk = resolveAndroidSdkRoot();
    if (!sdk) return false;
    const sdkDirProp = sdk.replace(/\\/g, "/");
    const line = `sdk.dir=${sdkDirProp}\n`;
    writeFileSync(lp, existing.trimEnd() ? `${existing.trimEnd()}\n${line}` : line, "utf8");
    console.log(`[build:capacitor:android] Wrote android/local.properties → sdk.dir=${sdkDirProp}`);
    return true;
};

/** @param {string} dir @param {string} base @param {{ full: string; rel: string }[]} acc */
const walkApks = (dir, base, acc) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, ent.name);
        if (ent.isDirectory()) walkApks(full, base, acc);
        else if (ent.isFile() && ent.name.endsWith(".apk")) acc.push({ full, rel: relative(base, full) });
    }
};

const copyApksToDist = () => {
    if (["1", "true", "yes", "on"].includes(String(process.env.CWS_SKIP_CAPACITOR_DIST_COPY || "").trim().toLowerCase())) {
        console.log("[build:capacitor:android] Skip APK copy (CWS_SKIP_CAPACITOR_DIST_COPY)");
        return;
    }
    const apkRoot = resolve(androidRoot, "app/build/outputs/apk");
    if (!existsSync(apkRoot)) {
        console.warn(`[build:capacitor:android] No Gradle output at ${apkRoot}; skip dist copy`);
        return;
    }
    const found = [];
    walkApks(apkRoot, apkRoot, found);
    if (!found.length) {
        console.warn(`[build:capacitor:android] No .apk under ${apkRoot}; skip dist copy`);
        return;
    }
    const relOut = (process.env.CWS_CAPACITOR_DIST_OUT || "dist/capacitor/android").trim().replace(/^\/+/, "");
    const distAndroid = resolve(pkgRoot, relOut);
    for (const { full, rel } of found) {
        const dest = join(distAndroid, rel);
        mkdirSync(pathDirname(dest), { recursive: true });
        copyFileSync(full, dest);
    }
    console.log(`[build:capacitor:android] Copied ${found.length} APK(s) -> ${distAndroid}`);
};

const runCapSync = () => {
    const args = [resolve(__dirname, "build-capacitor.mjs")];
    if (skipPortable) args.push("--skip-portable");
    const r = spawnSync(process.execPath, args, { cwd: pkgRoot, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
};

const main = () => {
    if (!skipSync) {
        runCapSync();
    } else {
        const webDir = resolve(pkgRoot, "dist/capacitor");
        if (!existsSync(webDir)) {
            console.error(`[build:capacitor:android] --skip-sync requires existing ${webDir}`);
            process.exit(1);
        }
    }

    if (!existsSync(androidRoot)) {
        console.error(
            `[build:capacitor:android] Missing ${androidRoot}\n` +
                `Run: npm run cap:add:android   (or npm run build:capacitor without --skip-sync)`
        );
        process.exit(1);
    }
    if (!existsSync(gradlewPath)) {
        console.error(`[build:capacitor:android] Missing ${gradlewPath}`);
        process.exit(1);
    }

    patchCapacitorAndroidNetwork(pkgRoot);

    if (!ensureLocalProperties()) {
        console.error(
            `[build:capacitor:android] Android SDK not found for Gradle.\n\n` +
                `Do one of:\n` +
                `  • Install Android Studio / cmdline-tools and set:\n` +
                `      export ANDROID_HOME="$HOME/Android/Sdk"   # typical Linux path\n` +
                `  • Or create ${join(androidRoot, "local.properties")} with one line:\n` +
                `      sdk.dir=/absolute/path/to/Android/sdk\n` +
                `  • Or set CWS_ANDROID_SDK_ROOT to that path for this build only.\n`
        );
        process.exit(1);
    }

    console.log(`[build:capacitor:android] Gradle in ${androidRoot}: ${gradlew} ${gradleTask}`);
    const shell = process.platform === "win32";
    const r = spawnSync(gradlewPath, [gradleTask], {
        cwd: androidRoot,
        stdio: "inherit",
        shell,
        env: { ...process.env }
    });
    if (r.status !== 0) process.exit(r.status ?? 1);

    copyApksToDist();

    const relOut = (process.env.CWS_CAPACITOR_DIST_OUT || "dist/capacitor/android").trim().replace(/^\/+/, "");
    console.log(
        "[build:capacitor:android] Gradle APK output:\n" +
            `  ${resolve(androidRoot, "app/build/outputs/apk/")}\n` +
            `Mirror under cwsp: ${resolve(pkgRoot, relOut)}\n` +
            "Set JAVA_HOME if compile failed; SDK path is taken from android/local.properties (auto-filled from ANDROID_HOME when possible)."
    );
};

main();
