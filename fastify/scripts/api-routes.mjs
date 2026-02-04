/**
 * API Routes Module
 *
 * Handles all API endpoints for CrossWord backend
 */

import fs from "fs/promises";
import path from "node:path";

// Import AI processing functions dynamically when needed
const getRecognizeByInstructions = async () => {
    const { recognizeByInstructions } = await import('@rs-core/service/AI-ops/RecognizeData');
    return recognizeByInstructions;
};

// Utility function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export async function registerAPIRoutes(fastify, options = {}) {
    // ========================================================================
    // API ROUTES
    // ========================================================================

    // Health check endpoint
    fastify.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

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

            const recognizeByInstructions = await getRecognizeByInstructions();

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

            // Process with AI
            console.log('[Processing API] Starting AI processing...');
            const result = await recognizeByInstructions(input, instruction, undefined, undefined, processingOptions);

            console.log('[Processing API] AI processing completed:', {
                ok: result.ok,
                hasData: !!result.data,
                processingTime: result.processing_time_ms
            });

            // Return unified response format
            return reply.send({
                success: result.ok,
                data: result.data,
                metadata: {
                    processingType,
                    contentType,
                    processingTimeMs: result.processing_time_ms,
                    confidence: result.confidence,
                    sourceKind: result.source_kind,
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
                message: error.message,
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

            const recognizeByInstructions = await getRecognizeByInstructions();

            const input = [{
                role: 'user',
                content: content
            }];

            const result = await recognizeByInstructions(input, instruction, undefined, undefined, {
                maxRetries: 2,
                timeoutMs: 15000,
                ...options
            });

            return reply.send({
                success: result.ok,
                analysis: result.data,
                contentType: contentType,
                metadata: {
                    processingTimeMs: result.processing_time_ms,
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error('[Analysis API] Error:', error);
            return reply.code(500).send({
                error: 'Analysis failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================================================
    // PHOSPHOR ICONS PROXY (for CORS-free icon loading)
    // ========================================================================

    // Proxy Phosphor icons to avoid CORS issues during development
    fastify.get('/api/phosphor-icons/*', async (req, reply) => {
        try {
            const iconPath = req.params['*']; // Get the wildcard path

            // Fix the icon filename - add the style suffix for duotone and other styles
            let fixedIconPath = iconPath;
            const pathParts = iconPath.split('/');
            if (pathParts.length >= 2) {
                const iconStyle = pathParts[0];
                const iconFile = pathParts[1];

                if (iconStyle === 'duotone' && !iconFile.includes('-duotone')) {
                    fixedIconPath = `${iconStyle}/${iconFile.replace('.svg', '-duotone.svg')}`;
                } else if (iconStyle !== 'regular' && !iconFile.includes(`-${iconStyle}`)) {
                    // For other styles like bold, fill, etc., add the style suffix if not present
                    fixedIconPath = `${iconStyle}/${iconFile.replace('.svg', `-${iconStyle}.svg`)}`;
                }
            }

            // Construct the full CDN URL
            const cdnUrl = `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${fixedIconPath}`;

            console.log(`[Phosphor Icons] Request received: ${req.method} ${req.url}`);
            console.log(`[Phosphor Icons] Icon path: ${iconPath}`);
            console.log(`[Phosphor Icons] Proxying to: ${cdnUrl}`);

            // Fetch from CDN with proper headers
            const response = await fetch(cdnUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'CrossWord-PWA/1.0',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                console.warn(`[Phosphor Icons] CDN request failed: ${response.status} ${response.statusText}`);
                return reply.code(response.status).send({
                    error: 'Icon not found',
                    status: response.status,
                    url: cdnUrl
                });
            }

            // Get content type and body
            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const body = await response.arrayBuffer();

            // Set appropriate headers
            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
            reply.header('Access-Control-Allow-Origin', '*');
            reply.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            reply.header('Access-Control-Allow-Headers', '*');

            return reply.send(Buffer.from(body));
        } catch (error) {
            console.error('[Phosphor Icons] Proxy error:', error.message);
            return reply.code(502).type('application/json').send({
                error: 'Failed to fetch icon',
                message: error.message
            });
        }
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
            const upstream = await fetch(target.href, {
                redirect: 'follow',
                headers: {
                    'accept': 'image/svg+xml,*/*;q=0.8',
                    'user-agent': 'u2re-icon-proxy/1.0',
                },
            });

            if (!upstream.ok) {
                return reply
                    .code(502)
                    .type('text/plain; charset=utf-8')
                    .send(`Upstream error: ${upstream.status} ${upstream.statusText}`);
            }

            const arrayBuffer = await upstream.arrayBuffer();
            const contentType = upstream.headers.get('content-type') || 'image/svg+xml; charset=utf-8';
            const etag = upstream.headers.get('etag');

            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=31536000, immutable');
            reply.header('Vary', 'Accept-Encoding');
            if (etag) {
                reply.header('ETag', etag);
            }

            return reply.send(Buffer.from(arrayBuffer));
        } catch (e) {
            return reply.code(502).type('text/plain; charset=utf-8').send(`Proxy fetch failed: ${e?.message || e}`);
        }
    });
}