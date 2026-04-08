#!/usr/bin/env node
/**
 * Check endpoint status and connectivity (HTTPS).
 * Usage: node scripts/check-status.mjs [baseUrl]
 *        node scripts/check-status.mjs --local
 * Default: https://127.0.0.1:8443/ (local). Use explicit URL for remote (e.g. https://45.147.121.152:8443/).
 */
import https from "node:https";
import { URL } from "node:url";

const args = process.argv.slice(2);
const useLocal = args.includes("--local");
const urlArg = args.find((a) => !a.startsWith("--"));
const defaultUrl = "https://127.0.0.1:8443/";
const baseUrl = useLocal ? new URL(defaultUrl) : urlArg ? new URL(urlArg) : new URL(defaultUrl);

const probePath = "/health";
const url = new URL(probePath, baseUrl);

const opts = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: "GET",
    timeout: 10000,
    rejectUnauthorized: false
};

console.log(`Checking ${url.origin} (probe: ${url.pathname}) ...`);

const req = https.request(opts, (res) => {
    let body = "";
    res.on("data", (ch) => { body += ch; });
    res.on("end", () => {
        const status = res.statusCode;
        const ok = status >= 200 && status < 300;
        console.log(`Status: ${status} ${res.statusMessage || ""}`);
        if (body.trim()) {
            try {
                const json = JSON.parse(body);
                console.log("Response:", JSON.stringify(json, null, 2));
            } catch {
                console.log("Body:", body.trim());
            }
        }
        process.exit(ok ? 0 : 1);
    });
});

req.on("error", (err) => {
    const code = err.code || "UNKNOWN";
    const msg = err.message || String(err);
    if (code === "ECONNREFUSED") {
        console.error("Connection refused. No process listening on " + url.hostname + ":" + (url.port || "443") + ".");
        console.error("On this machine: pm2 list / pm2 logs cws, or start with: npm run start:direct");
        console.error("Certs (HTTPS): ./https/local/ (multi.key, multi.crt, rootCA.crt)");
        if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
            console.error("To check local only: npm run status:url -- https://127.0.0.1:8443/");
        }
    } else if (code === "ETIMEDOUT" || code === "ECONNRESET") {
        console.error("Timeout or connection reset:", msg);
    } else {
        console.error("Error:", code, msg);
    }
    process.exit(1);
});

req.on("timeout", () => {
    req.destroy();
    console.error("Request timeout.");
    process.exit(1);
});

req.end();
