#!/usr/bin/env node
/**
 * Fail the build if cwsp.mjs is suspiciously small (corrupt/partial copy).
 */
import { readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCwspPackageRoot } from "./resolve-cwsp-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolveCwspPackageRoot(__dirname);
const file = resolve(pkgRoot, "dist/portable/cwsp.mjs");

/** Esbuild server bundle only (deps external). Below this likely truncated. */
const MIN_BYTES = 80_000;
const st = statSync(file);
if (st.size < MIN_BYTES) {
    console.error(
        `[verify-portable] ${file} is only ${st.size} bytes (expected >= ${MIN_BYTES}). ` +
            `Rebuild may have wrong esbuild externals.`
    );
    process.exit(1);
}

const raw = readFileSync(file, "utf8");
if (!/socket\.io|createCWSPRuntime|registerIoPlugin/i.test(raw)) {
    console.error(`[verify-portable] ${file} missing expected CWSP markers — bundle suspect.`);
    process.exit(1);
}

console.log(`[verify-portable] OK ${file} — ${Math.round(st.size / 1024)} KiB`);
