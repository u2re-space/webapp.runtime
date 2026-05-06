/**
 * API Routes Module
 *
 * Handles all API endpoints for CrossWord backend
 */

import fs from "fs/promises";
import path from "node:path";

import { fetchIconProxyCached, getCachedPhosphorAsset, warmPhosphorItems } from "./lib/phosphor-upstream.ts";
import {
    recognizeByInstructions,
    type RecognitionPipelineResult,
    type RecognizeByInstructionsOptions
} from "./lib/recognize-by-instructions.ts";

const BOOT_AT_MS = Date.now();
const SERVICE_NAME = "runtime-fastify";
const SERVICE_VERSION = String(process.env.npm_package_version || "unknown");

const applyNoStore = (reply) => {
    reply.header('Cache-Control', 'no-store');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
};

export async function registerAPIRoutes(fastify, _options = {}) {
    // ========================================================================
    // API ROUTES
    // ========================================================================

    // Health check endpoint
    fastify.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

    // Production/deploy probes
    fastify.get('/healthz', async (_req, reply) => {
        applyNoStore(reply);
        return reply.code(200).send({
            ok: true,
            service: SERVICE_NAME,
            status: 'healthy',
            version: SERVICE_VERSION,
            timestamp: new Date().toISOString(),
        });
    });

    fastify.get('/readyz', async (_req, reply) => {
        const diagnostics = {
            hasFetch: typeof fetch === 'function',
            hasBroadcastChannel: typeof BroadcastChannel !== 'undefined',
            hasCacheApi: typeof caches !== 'undefined',
        };
        const ready = diagnostics.hasFetch;
        applyNoStore(reply);
        return reply.code(ready ? 200 : 503).send({
            ok: ready,
            service: SERVICE_NAME,
            status: ready ? 'ready' : 'degraded',
            version: SERVICE_VERSION,
            diagnostics,
            timestamp: new Date().toISOString(),
        });
    });

    fastify.get('/api/system/status', async (_req, reply) => {
        const now = Date.now();
        applyNoStore(reply);
        return reply.code(200).send({
            ok: true,
            service: SERVICE_NAME,
            version: SERVICE_VERSION,
            uptimeMs: now - BOOT_AT_MS,
            pid: process.pid,
            node: process.version,
            timestamp: new Date(now).toISOString(),
        });
    });

    // Local Network Access / Private Network Access probe endpoint.
    // Useful for browser permission/preflight warm-up before local control channels.
    fastify.options('/lna-probe', async (req, reply) => {
        const origin = String(req?.headers?.origin || '');
        if (origin) reply.header('Access-Control-Allow-Origin', origin);
        reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'Content-Type');
        reply.header('Access-Control-Max-Age', '600');
        if (String(req?.headers?.['access-control-request-private-network'] || '').toLowerCase() === 'true') {
            reply.header('Access-Control-Allow-Private-Network', 'true');
            reply.header('Vary', 'Origin, Access-Control-Request-Private-Network');
        } else if (origin) {
            reply.header('Vary', 'Origin');
        }
        return reply.code(204).send();
    });

    fastify.get('/lna-probe', async (req, reply) => {
        const origin = String(req?.headers?.origin || '');
        if (origin) {
            reply.header('Access-Control-Allow-Origin', origin);
            reply.header('Vary', 'Origin');
        }
        reply.header('Cache-Control', 'no-store');
        return reply.code(204).send();
    });

    // Test route to verify API routing
    fastify.get('/api/test', async (req, reply) => {
        console.log('[API Test] Backend is responding');
        return reply.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            route: 'api-test',
            source: 'backend'
        });
    });

    // ========================================================================
    // UNIFIED AI PROCESSING ENDPOINT
    // ========================================================================

    // Main processing endpoint for unified AI operations
    fastify.post('/api/processing', async (req, reply) => {
        try {
            const {
                content,
                contentType,
                processingType,
                options = {},
                metadata = {}
            } = req.body || {};

            console.log('[Processing API] Request received:', {
                contentType,
                processingType,
                contentLength: content?.length || 0,
                metadata
            });

            // Validate input
            if (!content) {
                return reply.code(400).send({
                    error: 'Content is required',
                    code: 'MISSING_CONTENT'
                });
            }

            if (!contentType) {
                return reply.code(400).send({
                    error: 'Content type is required',
                    code: 'MISSING_CONTENT_TYPE'
                });
            }

            // Determine processing instruction based on type
            let instruction = '';
            const processingOptions = {
                maxRetries: 3,
                timeoutMs: 30000,
                enableCaching: true,
                ...options
            };

            switch (processingType) {
                case 'solve-and-answer':
                    instruction = `
Solve equations, answer questions, and explain mathematical or logical problems from the provided content.

For equations and math problems:
- Show step-by-step solutions
- Provide final answers clearly marked
- Explain reasoning for each step

For general questions:
- Provide accurate, well-reasoned answers
- Include relevant context and explanations

Always respond in the specified language and format results clearly.
                    `;
                    break;

                case 'write-code':
                    instruction = `
Write clean, efficient, and well-documented code based on the provided description, requirements, or image.

Code requirements:
- Use appropriate programming language for the task
- Follow language-specific best practices and conventions
- Include proper error handling
- Add meaningful comments and documentation

Always provide complete, working code.
                    `;
                    break;

                case 'extract-css':
                    instruction = `
Extract and generate clean, modern CSS from the provided content, image, or description.

CSS requirements:
- Use modern CSS features and best practices
- Generate semantic, maintainable stylesheets
- Include responsive design considerations

Always provide well-structured, production-ready CSS.
                    `;
                    break;

                case 'recognize-content':
                    instruction = `
Analyze and recognize content from images, documents, or structured data.

Recognition requirements:
- Extract text content accurately
- Identify document structure and formatting
- Preserve important visual elements
- Provide confidence scores for recognition accuracy

Provide detailed, structured output with confidence metrics.
                    `;
                    break;

                default:
                    instruction = `
Process and analyze the provided content using appropriate AI capabilities.

General processing requirements:
- Understand context and intent
- Provide relevant analysis or transformation
- Use appropriate tools and methods
- Maintain content quality and accuracy

Apply the most suitable processing approach based on content characteristics.
                    `;
            }

            // Prepare input for AI processing
            let input;
            if (contentType === 'file' || contentType === 'blob') {
                // Handle file/blob content
                input = content; // Assume it's already in the right format
            } else if (contentType === 'base64') {
                // Convert base64 to blob-like format
                input = content;
            } else {
                // Handle text content
                input = [{
                    role: 'user',
                    content: content
                }];
            }

            // Process with AI (OpenAI-compatible chat; see lib/recognize-by-instructions.ts)
            console.log('[Processing API] Starting AI processing...');
            const aiOptions: RecognizeByInstructionsOptions = {
                maxRetries: processingOptions.maxRetries,
                timeoutMs: processingOptions.timeoutMs,
                enableCaching: processingOptions.enableCaching,
                temperature: (processingOptions as { temperature?: number }).temperature
            };
            const result: RecognitionPipelineResult = await recognizeByInstructions(
                input,
                instruction,
                undefined,
                undefined,
                aiOptions
            );
            if (!result) {
                return reply.code(500).send({
                    error: 'Processing failed',
                    message: 'No result from recognizeByInstructions',
                    code: 'PROCESSING_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
            console.log('[Processing API] AI processing completed:', {
                ok: result.ok,
                hasData: !!result.data,
                processingTime: result?.processing_time_ms ?? 0,
                confidence: result?.confidence ?? 0,
                sourceKind: result?.source_kind ?? 'unknown'
            });

            // Return unified response format
            return reply.send({
                success: result.ok,
                data: result.data,
                metadata: {
                    processingType,
                    contentType,
                    processingTimeMs: result?.processing_time_ms ?? 0,
                    confidence: result?.confidence ?? 0,
                    sourceKind: result?.source_kind ?? 'unknown',
                    timestamp: new Date().toISOString(),
                    ...metadata
                },
                errors: result.errors || [],
                warnings: result.warnings || [],
                verboseData: result.verbose_data,
                keywordsAndTags: result.keywords_and_tags,
                suggestedType: result.suggested_type
            });

        } catch (error) {
            console.error('[Processing API] Error:', error);
            return reply.code(500).send({
                error: 'Processing failed',
                message: error instanceof Error ? error.message : String(error),
                code: 'PROCESSING_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    });

    // Content analysis endpoint (lighter processing for quick analysis)
    fastify.post('/api/analyze', async (req, reply) => {
        try {
            const { content, contentType, options = {} } = req.body || {};

            if (!content) {
                return reply.code(400).send({
                    error: 'Content is required',
                    code: 'MISSING_CONTENT'
                });
            }

            // Quick analysis instruction
            const instruction = `
Analyze the provided content and provide a brief summary of what it contains.
Identify the content type, main topics, and key information.
Keep the response concise but informative.
            `;

            const input = [{
                role: 'user',
                content: content
            }];

            const analyzeOptions: RecognizeByInstructionsOptions = {
                timeoutMs: typeof options.timeoutMs === 'number' ? options.timeoutMs : 60_000,
                recognitionEffort: 'low',
                recognitionVerbosity: 'low'
            };

            const result = await recognizeByInstructions(
                input,
                instruction,
                undefined,
                undefined,
                analyzeOptions
            );

            if (!result) {
                return reply.code(500).send({
                    error: 'Analysis failed',
                    message: 'No result from recognizeByInstructions',
                    code: 'ANALYSIS_ERROR',
                    timestamp: new Date().toISOString()
                });
            }

            return reply.send({
                success: result.ok,
                analysis: result.data,
                contentType: contentType,
                metadata: {
                    processingTimeMs: result.processing_time_ms,
                    timestamp: new Date().toISOString()
                },
                errors: result.errors,
                warnings: result.warnings
            });

        } catch (error) {
            console.error('[Analysis API] Error:', error);
            return reply.code(500).send({
                error: 'Analysis failed',
                message: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================================================
    // PHOSPHOR ICONS PROXY (for CORS-free icon loading)
    // ========================================================================

    // Proxy Phosphor icons (in-process LRU + parallel jsDelivr/unpkg racing)
    fastify.get('/assets/icons/phosphor/*', async (req, reply) => {
        try {
            const iconPath = req.params['*'];

            let fixedIconPath = iconPath;
            const pathParts = iconPath.split('/');
            if (pathParts.length >= 2) {
                const iconStyle = pathParts[0];
                const iconFile = pathParts[1];

                if (iconStyle === 'duotone' && !iconFile.includes('-duotone')) {
                    fixedIconPath = `${iconStyle}/${iconFile.replace('.svg', '-duotone.svg')}`;
                } else if (iconStyle !== 'regular' && !iconFile.includes(`-${iconStyle}`)) {
                    fixedIconPath = `${iconStyle}/${iconFile.replace('.svg', `-${iconStyle}.svg`)}`;
                }
            }

            const { body, contentType } = await getCachedPhosphorAsset(fixedIconPath);

            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=86400');
            reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
            reply.header('Access-Control-Allow-Origin', '*');
            reply.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            reply.header('Access-Control-Allow-Headers', '*');

            return reply.send(body);
        } catch (error) {
            console.error('[Phosphor Icons] Proxy error:', error?.message || error);
            return reply.code(502).type('application/json').send({
                error: 'Failed to fetch icon',
                message: error?.message || String(error)
            });
        }
    });

    fastify.post('/api/assets/warm-phosphor', async (req, reply) => {
        const items = req.body?.items;
        if (!Array.isArray(items)) {
            return reply.code(400).send({ ok: false, error: 'items[] required' });
        }
        const conc = Number(req.body?.concurrency);
        const result = await warmPhosphorItems(items, Number.isFinite(conc) ? conc : undefined);
        return { ok: true, ...result };
    });

    // Same-origin SVG proxy for icons (fixes CSS CORS issues with external CDNs).
    // Example:
    //   /api/icon-proxy?url=https%3A%2F%2Funpkg.com%2F%40phosphor-icons%2Fcore%402%2Fassets%2Fduotone%2Ffile-duotone.svg
    fastify.get('/api/icon-proxy', async (req, reply) => {
        const urlParam = req?.query?.url;
        if (typeof urlParam !== 'string' || !urlParam) {
            return reply.code(400).type('text/plain; charset=utf-8').send('Missing "url" query param');
        }

        let target;
        try {
            target = new URL(urlParam);
        } catch {
            return reply.code(400).type('text/plain; charset=utf-8').send('Invalid "url" query param');
        }

        // Restrict proxy to known icon CDNs + phosphor asset paths only.
        const allowedHosts = new Set(['cdn.jsdelivr.net', 'unpkg.com']);
        if (!allowedHosts.has(target.hostname)) {
            return reply.code(403).type('text/plain; charset=utf-8').send('Forbidden host');
        }

        const allowedPrefixes = [
            // jsDelivr npm assets
            '/npm/@phosphor-icons/core@2/assets/',
            // unpkg assets
            '/@phosphor-icons/core@2/assets/',
        ];
        const allowed = allowedPrefixes.some((p) => target.pathname.startsWith(p));
        if (!allowed || !target.pathname.endsWith('.svg')) {
            return reply.code(403).type('text/plain; charset=utf-8').send('Forbidden path');
        }

        try {
            const { body, contentType } = await fetchIconProxyCached(target);

            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=31536000, immutable');
            reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
            reply.header('Access-Control-Allow-Origin', '*');
            reply.header('Vary', 'Accept-Encoding, Origin');

            return reply.send(body);
        } catch (e) {
            return reply.code(502).type('text/plain; charset=utf-8').send(`Proxy fetch failed: ${e?.message || e}`);
        }
    });
}