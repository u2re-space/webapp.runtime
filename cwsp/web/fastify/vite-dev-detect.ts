/**
 * Vite dev index.html is not servable on CWSP (no transform, no /src/ pipeline).
 * Keep heuristics aligned with scripts/sync-frontend.mjs.
 */
export const looksLikeViteDevIndexHtml = (html) => {
    if (!html || typeof html !== "string") return false;
    if (/\/src\/index\.(tsx?|jsx?)/.test(html)) return true;
    if (html.includes("@vite-plugin-pwa")) return true;
    if (html.includes("html-proxy")) return true;
    if (html.includes('href="/src/') && html.includes("manifest.json")) return true;
    return false;
};

const esc = (s) =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const buildWrongIndexHelpHtml = (frontendDir) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CWSP — use built frontend, not Vite dev</title>
<style>
body{margin:0;min-height:100vh;font:15px/1.5 system-ui,sans-serif;background:#0f1115;color:#e8eaef;padding:24px}
.box{max-width:720px;margin:0 auto;padding:20px 22px;border:1px solid #2b3141;border-radius:12px;background:#151b27}
h1{font-size:1.15rem;margin:0 0 12px;color:#c4b5fd}
p{margin:10px 0;color:#b8c0d0}
code,pre{font-family:ui-monospace,Menlo,monospace;font-size:13px;background:#0b0e14;padding:2px 6px;border-radius:4px;color:#a8c8ff}
pre{padding:12px;overflow:auto;white-space:pre-wrap;word-break:break-all}
ul{margin:8px 0;padding-left:1.2rem;color:#b8c0d0}
</style>
</head>
<body>
<div class="box">
<h1>This index.html is a Vite dev shell</h1>
<p>CWSP serves <strong>static files only</strong>. It cannot compile <code>/src/*.ts</code>, <code>html-proxy</code>, or <code>@vite-plugin-pwa</code> dev hooks.</p>
<p>Resolved frontend directory:</p>
<pre>${esc(frontendDir)}</pre>
<ul>
<li>Build the PWA, then point CWSP at the output, e.g. <code>(cd apps/CrossWord &amp;&amp; npm run build:pwa)</code></li>
<li>Set <code>CWS_FRONTEND_DIR</code> or <code>CWS_FRONTEND_SRC</code> to that <strong>dist</strong> folder (see <code>runtime/cwsp/scripts/dev.env</code>)</li>
<li>Unregister the old service worker for this origin (Chrome → Application → Service workers)</li>
</ul>
<p>To force serving this file anyway (still broken in browser): <code>CWS_ALLOW_VITE_DEV_HTML=true</code></p>
</div>
</body>
</html>`;

export const buildViteDevAssetTrapHtml = () => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>Not available on CWSP</title></head>
<body style="font-family:system-ui,sans-serif;padding:1.5rem;max-width:42rem">
<p><strong>503</strong> — This path is part of the <strong>Vite dev server</strong>, not static files.</p>
<p>Build the app and set <code>CWS_FRONTEND_DIR</code> / <code>CWS_FRONTEND_SRC</code> to the built <code>dist</code> output.</p>
</body>
</html>`;
