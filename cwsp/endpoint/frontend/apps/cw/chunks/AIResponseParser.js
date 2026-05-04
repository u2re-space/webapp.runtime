import { t as JSOX } from "../vendor/jsox.js";
//#region src/shared/document/AIResponseParser.ts
/**
* Robust AI Response Parser
*
* Handles extraction of JSON from AI responses that may include:
* - Pure JSON strings
* - JSON wrapped in markdown code blocks (```json ... ```)
* - Multiple JSON code blocks (returns first valid one)
* - JSON with trailing/leading whitespace
* - JSON with BOM characters
* - Partial or malformed JSON (best-effort recovery)
*
* @see https://platform.openai.com/docs/api-reference/responses
*/
/**
* Regex patterns for extracting JSON from various formats.
* Ordered by specificity - most specific patterns first.
*/
var JSON_EXTRACTION_PATTERNS = [
	/```json\s*\n?([\s\S]*?)\n?```/i,
	/```toon\s*\n?([\s\S]*?)\n?```/i,
	/```\s*\n?([\s\S]*?)\n?```/,
	/(\{[\s\S]*\})/,
	/(\[[\s\S]*\])/
];
/**
* Clean raw text from common issues before parsing.
*/
var cleanRawText = (text) => {
	if (!text || typeof text !== "string") return "";
	return text.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
};
/**
* Attempt to fix common JSON issues.
*/
var attemptJSONRecovery = (text) => {
	let cleaned = text;
	cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");
	cleaned = cleaned.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
		return `: "${p1}\\n${p2}"`;
	});
	cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
	return cleaned;
};
/**
* Try to parse JSON using multiple strategies.
*/
var tryParseJSON = (text) => {
	if (!text) return {
		ok: false,
		error: "Empty input"
	};
	try {
		return {
			ok: true,
			data: JSOX.parse(text)
		};
	} catch {}
	try {
		return {
			ok: true,
			data: JSON.parse(text)
		};
	} catch {}
	try {
		const recovered = attemptJSONRecovery(text);
		return {
			ok: true,
			data: JSOX.parse(recovered)
		};
	} catch {}
	try {
		const match = text.match(/^[^{[]*([{\[][\s\S]*[}\]])[^}\]]*$/);
		if (match?.[1]) return {
			ok: true,
			data: JSOX.parse(match[1])
		};
	} catch {}
	return {
		ok: false,
		error: "Failed to parse JSON with all strategies"
	};
};
/**
* Extract JSON from AI response text.
* Handles markdown code blocks, raw JSON, and various edge cases.
*
* @param response - Raw AI response string
* @returns ParseResult with extracted data or error
*/
var extractJSONFromAIResponse = (response) => {
	if (response == null) return {
		ok: false,
		error: "Response is null or undefined"
	};
	if (typeof response !== "string") {
		if (typeof response === "object") return {
			ok: true,
			data: response,
			source: "direct"
		};
		return {
			ok: false,
			error: `Expected string, got ${typeof response}`
		};
	}
	const cleaned = cleanRawText(response);
	if (!cleaned) return {
		ok: false,
		error: "Response is empty after cleaning",
		raw: response
	};
	const directResult = tryParseJSON(cleaned);
	if (directResult.ok) return {
		ok: true,
		data: directResult.data,
		raw: response,
		source: "direct"
	};
	for (const pattern of JSON_EXTRACTION_PATTERNS) {
		const match = cleaned.match(pattern);
		if (match?.[1]) {
			const result = tryParseJSON(cleanRawText(match[1]));
			if (result.ok) return {
				ok: true,
				data: result.data,
				raw: response,
				source: "markdown_block"
			};
		}
	}
	const jsonLikeMatch = cleaned.match(/(\{[\s\S]+\}|\[[\s\S]+\])/);
	if (jsonLikeMatch?.[1]) {
		const result = tryParseJSON(attemptJSONRecovery(jsonLikeMatch[1]));
		if (result.ok) return {
			ok: true,
			data: result.data,
			raw: response,
			source: "recovered"
		};
	}
	return {
		ok: false,
		error: "Could not extract valid JSON from response",
		raw: response
	};
};
/**
* Strict JSON instructions to include in AI prompts.
* Following OpenAI Responses API best practices.
*
* @see https://platform.openai.com/docs/api-reference/responses
*/
var STRICT_JSON_INSTRUCTIONS = `
CRITICAL OUTPUT FORMAT REQUIREMENTS:

1. Your response MUST be ONLY valid JSON - no markdown, no explanations, no prose.
2. Do NOT wrap the JSON in code blocks (\`\`\`json or \`\`\`).
3. Do NOT include any text before or after the JSON object.
4. The response must start with { or [ and end with } or ].
5. All strings must be properly escaped (newlines as \\n, quotes as \\").
6. Use null for missing/unknown values, not undefined or empty strings.
7. Numbers should be unquoted. Booleans should be true/false (lowercase).
8. Arrays should not have trailing commas.
9. The JSON must be parseable by JSON.parse() without modification.

If you cannot provide the requested data, return: {"error": "description of the issue", "ok": false}
`;
//#endregion
export { extractJSONFromAIResponse as n, STRICT_JSON_INSTRUCTIONS as t };
