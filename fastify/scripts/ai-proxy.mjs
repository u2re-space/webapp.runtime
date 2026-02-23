/**
 * AI Proxy Routes for Fastify Runtime
 *
 * These routes provide server-side AI processing fallback when:
 * - Service worker is not loaded or broken
 * - Direct API access is needed from server
 *
 * Proxies requests to the backend AI service or directly to OpenAI-compatible APIs.
 */

// Default AI endpoint (can be overridden by env)
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8080';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1';

/**
 * Safe JSON parse
 */
const safeParseJSON = (text) => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

/**
 * Make request to AI backend
 */
const proxyToBackend = async (endpoint, body, headers = {}) => {
    try {
        const response = await fetch(`${AI_BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return { ok: response.ok, data, statusCode: response.status };
    } catch (error) {
        console.error('[AI Proxy] Backend request failed:', error.message);
        return { ok: false, error: error.message, statusCode: 502 };
    }
};

/**
 * Direct OpenAI-compatible API request
 */
const directAIRequest = async (apiKey, baseUrl, model, messages, options = {}) => {
    const url = baseUrl || OPENAI_API_URL;
    const endpoint = `${url}/chat/completions`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'gpt-4o-mini',
                messages,
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature ?? 0.7,
                ...options.extra
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                ok: false,
                error: data?.error?.message || `API error: ${response.status}`,
                statusCode: response.status
            };
        }

        // Extract content from response
        const content = data?.choices?.[0]?.message?.content || '';
        return {
            ok: true,
            data: content,
            usage: data?.usage,
            model: data?.model
        };
    } catch (error) {
        console.error('[AI Proxy] Direct API request failed:', error.message);
        return { ok: false, error: error.message, statusCode: 502 };
    }
};

/**
 * Build recognition prompt
 */
const buildRecognizePrompt = (input, customInstruction) => {
    const basePrompt = customInstruction ||
        `You are a data recognition assistant. Analyze the following content and extract structured information. ` +
        `Return JSON with "recognized_data" array containing the extracted items and "verbose_data" with a brief summary.`;

    return [
        { role: 'system', content: basePrompt },
        { role: 'user', content: typeof input === 'string' ? input : JSON.stringify(input) }
    ];
};

/**
 * Build analysis prompt
 */
const buildAnalyzePrompt = (input, customInstruction) => {
    const basePrompt = customInstruction ||
        `You are a content analysis assistant. Analyze the following content and provide insights. ` +
        `Identify key entities, themes, and relevant information. Return structured JSON.`;

    return [
        { role: 'system', content: basePrompt },
        { role: 'user', content: typeof input === 'string' ? input : JSON.stringify(input) }
    ];
};

/**
 * Register AI proxy routes
 */
export const registerAIProxyRoutes = async (fastify) => {
    // ========================================================================
    // PROXY TO BACKEND AI SERVICE
    // ========================================================================

    /**
     * Proxy recognize request to backend
     * POST /api/ai/recognize
     */
    fastify.post('/api/ai/recognize', async (req, reply) => {
        const { userId, userKey, text, url, title, customInstruction, apiKey, baseUrl, model } = req.body || {};

        // If API key provided, use direct API
        if (apiKey) {
            const input = text || url || '';
            if (!input.trim()) {
                return reply.code(400).send({ ok: false, error: 'Missing text or url' });
            }

            const messages = buildRecognizePrompt(input, customInstruction);
            const result = await directAIRequest(apiKey, baseUrl, model, messages);

            return reply.code(result.ok ? 200 : (result.statusCode || 500)).send(result);
        }

        // Otherwise proxy to backend
        if (!userId || !userKey) {
            return reply.code(401).send({ ok: false, error: 'Missing credentials' });
        }

        const result = await proxyToBackend('/core/ai/recognize', req.body);
        return reply.code(result.ok ? 200 : (result.statusCode || 500)).send(result.data || result);
    });

    /**
     * Proxy analyze request to backend
     * POST /api/ai/analyze
     */
    fastify.post('/api/ai/analyze', async (req, reply) => {
        const { userId, userKey, text, url, customInstruction, apiKey, baseUrl, model, mode } = req.body || {};

        // If API key provided, use direct API
        if (apiKey) {
            const input = text || url || '';
            if (!input.trim()) {
                return reply.code(400).send({ ok: false, error: 'Missing text or url' });
            }

            const messages = buildAnalyzePrompt(input, customInstruction);
            const result = await directAIRequest(apiKey, baseUrl, model, messages);

            return reply.code(result.ok ? 200 : (result.statusCode || 500)).send(result);
        }

        // Otherwise proxy to backend
        if (!userId || !userKey) {
            return reply.code(401).send({ ok: false, error: 'Missing credentials' });
        }

        const result = await proxyToBackend('/core/ai/analyze', req.body);
        return reply.code(result.ok ? 200 : (result.statusCode || 500)).send(result.data || result);
    });

    /**
     * Simple health check for AI proxy
     * GET /api/ai/health
     */
    fastify.get('/api/ai/health', async (req, reply) => {
        // Try to reach backend
        try {
            const backendHealth = await fetch(`${AI_BACKEND_URL}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            }).then(r => r.json()).catch(() => null);

            return reply.send({
                ok: true,
                proxy: 'running',
                backend: backendHealth ? 'connected' : 'unavailable',
                timestamp: Date.now()
            });
        } catch {
            return reply.send({
                ok: true,
                proxy: 'running',
                backend: 'unavailable',
                timestamp: Date.now()
            });
        }
    });

    /**
     * Share target AI processing endpoint
     * POST /api/share/process
     *
     * Fallback endpoint for processing share target data when SW is unavailable
     */
    fastify.post('/api/share/process', async (req, reply) => {
        const { title, text, url: sharedUrl, files, apiKey, baseUrl, model, customInstruction, mode } = req.body || {};

        if (!apiKey) {
            return reply.code(400).send({
                ok: false,
                error: 'API key required for share processing'
            });
        }

        // Build input from share data
        const inputParts = [];
        if (title) inputParts.push(`Title: ${title}`);
        if (text) inputParts.push(`Text: ${text}`);
        if (sharedUrl) inputParts.push(`URL: ${sharedUrl}`);
        if (files?.length) inputParts.push(`Files: ${files.length} file(s) attached`);

        const input = inputParts.join('\n\n');

        if (!input.trim()) {
            return reply.code(400).send({ ok: false, error: 'No content to process' });
        }

        const isAnalyze = mode === 'analyze';
        const messages = isAnalyze
            ? buildAnalyzePrompt(input, customInstruction)
            : buildRecognizePrompt(input, customInstruction);

        const result = await directAIRequest(apiKey, baseUrl, model, messages);

        return reply.code(result.ok ? 200 : (result.statusCode || 500)).send({
            ...result,
            mode: isAnalyze ? 'analyze' : 'recognize',
            processed: true
        });
    });

    console.log('[AI Proxy] Routes registered: /api/ai/recognize, /api/ai/analyze, /api/ai/health, /api/share/process');
};

export default registerAIProxyRoutes;
