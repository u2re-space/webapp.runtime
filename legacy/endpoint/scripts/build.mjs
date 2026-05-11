import { build } from "esbuild";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runBuild() {
    console.log("[build] Building CWSP Portable...");
    try {
        await build({
            entryPoints: [resolve(__dirname, "../cwsp/server/index.ts")],
            bundle: true,
            platform: "node",
            target: "node24",
            outfile: resolve(__dirname, "../portable/cwsp.cjs"),
            external: ["clipboardy", "fastify", "@fastify/cors", "@fastify/formbody", "socket.io"],
            format: "cjs",
        });
        console.log("[build] CWSP Portable build complete: runtime/portable/cwsp.cjs");
    } catch (err) {
        console.error("[build] Build failed:", err);
        process.exit(1);
    }
}

runBuild();
