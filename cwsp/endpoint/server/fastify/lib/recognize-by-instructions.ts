/**
 * Server-side recognizeByInstructions — OpenAI-compatible chat completions.
 * Replaces the old @rs-core/service/AI-ops/RecognizeData import for Fastify/CWSP.
 */

export type RecognizeByInstructionsOptions = {
    customInstruction?: string;
    useActiveInstruction?: boolean;
    recognitionEffort?: "none" | "low" | "medium" | "high";
    recognitionVerbosity?: "low" | "medium" | "high";
    maxRetries?: number;
    timeoutMs?: number;
    enableCaching?: boolean;
    temperature?: number;
    maxTokens?: number;
};

export type AIConfigOverlay = {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
};

export type RecognitionPipelineResult = {
    ok: boolean;
    data: unknown;
    errors: string[];
    warnings: string[];
    verbose_data: unknown;
    keywords_and_tags: unknown[];
    suggested_type: unknown;
    processing_time_ms?: number;
    confidence?: number;
    source_kind?: string;
    responseId?: string;
};

const DEFAULT_MODEL = "gpt-4o-mini";

const effortToMaxTokens = (effort?: string, explicit?: number): number => {
    if (typeof explicit === "number" && explicit > 0) return explicit;
    switch (effort) {
        case "none":
            return 512;
        case "medium":
            return 4096;
        case "high":
            return 8192;
        case "low":
        default:
            return 2048;
    }
};

const isDataUrl = (s: string): boolean => /^data:[^;]+;base64,/i.test(String(s).trim());

const unwrapCodeFences = (text: string): string => {
    const t = text.trim();
    const m = t.match(/^```(?:json|markdown|text)?\s*([\s\S]*?)```$/i);
    return m ? m[1].trim() : t;
};

const resolveCredentials = (config?: AIConfigOverlay) => {
    const apiKey =
        (config?.apiKey && String(config.apiKey).trim()) ||
        String(process.env.CWS_AI_API_KEY || process.env.OPENAI_API_KEY || "").trim();
    const rawBase =
        (config?.baseUrl && String(config.baseUrl).trim()) ||
        String(
            process.env.CWS_AI_BASE_URL ||
                process.env.OPENAI_BASE_URL ||
                process.env.OPENAI_API_URL ||
                "https://api.openai.com/v1"
        ).trim();
    const baseUrl = rawBase.replace(/\/+$/, "");
    const model =
        (config?.model && String(config.model).trim()) ||
        String(process.env.CWS_AI_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL).trim();
    return { apiKey, baseUrl, model };
};

type ChatMessage = { role: "system" | "user" | "assistant"; content: string | unknown[] };

/** Turn a single user/content payload into text or multimodal OpenAI content parts. */
function contentToUserPayload(content: unknown): string | unknown[] {
    if (content == null) {
        return "";
    }
    if (typeof content === "string") {
        if (isDataUrl(content)) {
            return [
                {
                    type: "text",
                    text: "Apply the system instructions to this image or file payload."
                },
                { type: "image_url", image_url: { url: content } }
            ];
        }
        return content;
    }
    if (Array.isArray(content)) {
        return JSON.stringify(content);
    }
    if (typeof content === "object") {
        return JSON.stringify(content);
    }
    return String(content);
}

function normalizeOpenAIRole(role: string): "user" | "assistant" {
    const r = role.toLowerCase();
    if (r === "assistant") return "assistant";
    return "user";
}

/**
 * Build full message list: merged system + chat rows from [{ role, content }, ...] or one user turn.
 */
function buildMessagesFromInput(input: unknown, systemContent: string): ChatMessage[] {
    if (Array.isArray(input) && input.length > 0) {
        const chatRows = input.every(
            (x) => x != null && typeof x === "object" && typeof (x as Record<string, unknown>).role === "string"
        );
        if (chatRows) {
            let mergedSystem = systemContent;
            const tail: ChatMessage[] = [];
            for (const row of input as Record<string, unknown>[]) {
                const role = String(row.role);
                const raw = row.content;
                if (role.toLowerCase() === "system") {
                    const block =
                        typeof raw === "string" ? raw : raw != null ? JSON.stringify(raw) : "";
                    mergedSystem = mergedSystem ? `${mergedSystem}\n\n${block}` : block;
                    continue;
                }
                const r = normalizeOpenAIRole(role);
                tail.push({ role: r, content: contentToUserPayload(raw) });
            }
            return [{ role: "system", content: mergedSystem }, ...tail];
        }
    }

    if (input == null) {
        return [{ role: "system", content: systemContent }, { role: "user", content: "" }];
    }

    if (typeof input === "string" || typeof input === "object") {
        if (typeof input === "object" && input !== null && !Array.isArray(input)) {
            const o = input as Record<string, unknown>;
            if (typeof o.text === "string") {
                return [
                    { role: "system", content: systemContent },
                    { role: "user", content: contentToUserPayload(o.text) }
                ];
            }
            if ("content" in o) {
                return [
                    { role: "system", content: systemContent },
                    { role: "user", content: contentToUserPayload(o.content) }
                ];
            }
        }
        return [
            { role: "system", content: systemContent },
            { role: "user", content: contentToUserPayload(input) }
        ];
    }

    return [
        { role: "system", content: systemContent },
        { role: "user", content: JSON.stringify(input) }
    ];
}

function buildSystemContent(instructions: string, options?: RecognizeByInstructionsOptions): string {
    const base = String(instructions || "").trim();
    const extra = options?.customInstruction?.trim();
    if (extra) {
        return `${base}\n\nAdditional instructions:\n${extra}`;
    }
    return base || "You are a helpful assistant.";
}

function tryParseStructuredAssistantText(raw: string): Partial<RecognitionPipelineResult> | null {
    const cleaned = unwrapCodeFences(raw);
    try {
        const parsed = JSON.parse(cleaned) as Record<string, unknown>;
        const out: Partial<RecognitionPipelineResult> = {};
        if ("recognized_data" in parsed) {
            const rd = parsed.recognized_data;
            if (Array.isArray(rd)) {
                out.data = rd.join("\n");
            } else if (typeof rd === "string") {
                out.data = rd;
            } else {
                out.data = rd != null ? JSON.stringify(rd) : null;
            }
        }
        if ("verbose_data" in parsed) out.verbose_data = parsed.verbose_data;
        if ("keywords_and_tags" in parsed && Array.isArray(parsed.keywords_and_tags)) {
            out.keywords_and_tags = parsed.keywords_and_tags;
        }
        if ("suggested_type" in parsed) out.suggested_type = parsed.suggested_type;
        if ("confidence" in parsed && typeof parsed.confidence === "number") {
            out.confidence = parsed.confidence;
        }
        if (Object.keys(out).length > 0) {
            return out;
        }
    } catch {
        /* not JSON */
    }
    return null;
}

/**
 * OpenAI-compatible recognizeByInstructions.
 * Signature matches frontend unified.ts: (input, instructions, sendResponse?, config?, options?)
 */
export async function recognizeByInstructions(
    input: unknown,
    instructions: string,
    sendResponse?: (result: RecognitionPipelineResult) => void,
    config?: AIConfigOverlay,
    options?: RecognizeByInstructionsOptions
): Promise<RecognitionPipelineResult> {
    const started = Date.now();
    const { apiKey, baseUrl, model } = resolveCredentials(config);

    const emptyFail = (errors: string[], warnings: string[] = []): RecognitionPipelineResult => {
        const r: RecognitionPipelineResult = {
            ok: false,
            data: null,
            errors,
            warnings,
            verbose_data: null,
            keywords_and_tags: [],
            suggested_type: null,
            processing_time_ms: Date.now() - started,
            source_kind: "openai-compatible"
        };
        sendResponse?.(r);
        return r;
    };

    if (!apiKey) {
        return emptyFail([
            "No API key configured. Set CWS_AI_API_KEY or OPENAI_API_KEY (optional override via request config)."
        ]);
    }

    const systemContent = buildSystemContent(instructions, options);
    const messages: ChatMessage[] = buildMessagesFromInput(input, systemContent);

    const timeoutMs = Math.max(1000, options?.timeoutMs ?? 120_000);
    const maxTokens = effortToMaxTokens(options?.recognitionEffort, options?.maxTokens);
    const temperature =
        typeof options?.temperature === "number" ? options.temperature : 0.3;

    const url = `${baseUrl}/chat/completions`;
    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: maxTokens,
                temperature
            }),
            signal: AbortSignal.timeout(timeoutMs)
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return emptyFail([`AI request failed: ${msg}`]);
    }

    let body: Record<string, unknown>;
    try {
        body = (await response.json()) as Record<string, unknown>;
    } catch {
        return emptyFail([`Invalid JSON from AI endpoint (HTTP ${response.status})`]);
    }

    if (!response.ok) {
        const errObj = body?.error as Record<string, unknown> | undefined;
        const errMsg =
            (typeof errObj?.message === "string" && errObj.message) ||
            `HTTP ${response.status} from AI endpoint`;
        return emptyFail([errMsg]);
    }

    const choices = body.choices as Array<{ message?: { content?: unknown } }> | undefined;
    const rawContent = choices?.[0]?.message?.content;
    let textOut = "";
    if (typeof rawContent === "string") {
        textOut = rawContent;
    } else if (Array.isArray(rawContent)) {
        textOut = rawContent
            .map((part: unknown) => {
                if (part && typeof part === "object" && "text" in part) {
                    return String((part as { text?: string }).text ?? "");
                }
                return typeof part === "string" ? part : JSON.stringify(part);
            })
            .join("");
    } else if (rawContent != null) {
        textOut = String(rawContent);
    }

    const structured = tryParseStructuredAssistantText(textOut);
    const data = structured?.data !== undefined ? structured.data : textOut.trim() || null;

    const result: RecognitionPipelineResult = {
        ok: Boolean(data),
        data,
        errors: data ? [] : ["Empty model response"],
        warnings: [],
        verbose_data: structured?.verbose_data ?? null,
        keywords_and_tags: structured?.keywords_and_tags ?? [],
        suggested_type: structured?.suggested_type ?? null,
        processing_time_ms: Date.now() - started,
        confidence: structured?.confidence,
        source_kind: "openai-compatible",
        responseId: typeof body.id === "string" ? body.id : undefined
    };

    if (!result.ok && result.errors.length === 0) {
        result.errors.push("No data recognized");
    }

    sendResponse?.(result);
    return result;
}
