import { r as __exportAll } from "./rolldown-runtime.js";
import { n as getUnifiedMessaging$1, r as createProtocolEnvelope } from "../fest/uniform.js";
import { d as getDestinationAliases, i as BROADCAST_CHANNELS, l as createDestinationChannelMappings, n as toUnifiedInteropMessage, o as CONTENT_TYPES, p as normalizeDestination, s as DESTINATIONS, t as createInteropEnvelope } from "./UniformInterop.js";
//#region ../../modules/projects/subsystem/src/service/instructions/core.ts
var AI_INSTRUCTIONS = {
	SOLVE_AND_ANSWER: `
Solve equations, answer questions, and explain mathematical or logical problems from the provided content.

For equations and math problems:
- Show step-by-step solutions
- Provide final answers clearly marked
- Explain reasoning for each step

For general questions:
- Provide accurate, well-reasoned answers
- Include relevant context and explanations
- If multiple interpretations possible, address them

For quizzes and tests:
- Show the correct answer with explanation
- Explain why other options are incorrect

Always respond in the specified language and format results clearly.
`,
	WRITE_CODE: `
Write clean, efficient, and well-documented code based on the provided description, requirements, or image.

Code requirements:
- Use appropriate programming language for the task
- Follow language-specific best practices and conventions
- Include proper error handling
- Add meaningful comments and documentation
- Make code readable and maintainable

If generating from an image or visual description:
- Analyze the visual elements and requirements
- Implement the described functionality
- Ensure code compiles and runs correctly

Always respond in the specified language and provide complete, working code.
`,
	EXTRACT_CSS: `
Extract and generate clean, modern CSS from the provided content, image, or description.

CSS requirements:
- Use modern CSS features and best practices
- Generate semantic, maintainable stylesheets
- Include responsive design considerations
- Use appropriate selectors and specificity
- Follow CSS naming conventions
- Optimize for performance and maintainability

If extracting from an image:
- Analyze the visual design and layout
- Generate corresponding CSS rules
- Identify colors, fonts, spacing, and layout
- Create reusable CSS classes and components

Always respond in the specified language and provide complete, working CSS.
`,
	RECOGNIZE_CONTENT: `
Recognize and extract information from images, documents, or other visual content.

Recognition requirements:
- Identify text content accurately
- Extract structured information
- Recognize tables, forms, and structured data
- Preserve formatting where possible
- Handle different languages and scripts
- Provide confidence scores for extracted content

For document analysis:
- Extract key information and metadata
- Identify document type and structure
- Recognize important sections and headings

For image analysis:
- Describe visual content
- Extract text from images (OCR)
- Identify objects, scenes, and visual elements

Always respond in the specified language and format extracted information clearly.
`,
	CONVERT_DATA: `
Convert data between different formats while preserving structure and meaning.

Conversion requirements:
- Maintain data integrity and relationships
- Preserve formatting and structure where possible
- Handle different data types appropriately
- Provide clear mapping between source and target formats
- Validate conversion accuracy

Supported conversions:
- CSV ↔ JSON ↔ XML
- Markdown ↔ HTML
- Text ↔ Structured data
- Image data ↔ Text representations

Ensure accurate, lossless conversion where possible.
`,
	EXTRACT_ENTITIES: `
Extract named entities, keywords, and structured information from content.

Entity extraction requirements:
- Identify people, organizations, locations
- Extract dates, numbers, and measurements
- Find keywords and important terms
- Recognize relationships and connections
- Provide confidence scores and context

Output structured data with:
- Entity types and values
- Position and context information
- Confidence scores
- Relationship mappings

Focus on accuracy and comprehensive coverage.
`,
	TRANSLATE_TO_LANGUAGE: `
Translate content to the specified target language while preserving meaning, tone, and formatting.

Translation requirements:
- Maintain original meaning and intent
- Preserve formatting, structure, and markdown syntax
- Adapt cultural references appropriately
- Use natural, fluent language in the target language
- Handle technical terms, proper names, and brand names correctly
- Maintain appropriate formality and tone
- Preserve code blocks, mathematical expressions, and technical content

For content already in the target language:
- Provide natural rephrasing or improvement
- Enhance clarity and readability
- Maintain professional quality

Supported languages:
- English (en)
- Russian (ru)
- Other languages as requested

Ensure high-quality, natural translations that feel native to the target language.
`,
	GENERAL_PROCESSING: `
Process and analyze content using appropriate AI capabilities.

General processing requirements:
- Understand context and intent
- Provide relevant analysis or transformation
- Use appropriate tools and methods
- Maintain content quality and accuracy
- Adapt to different content types and requirements

Focus on providing useful, accurate results that meet user needs.
`,
	CRX_SOLVE_AND_ANSWER: `
Solve the problem or answer the question presented in the content.

Auto-detect the type of content:
- Mathematical equation/expression → Solve step-by-step
- Quiz/test question → Provide correct answer
- Homework problem → Solve and explain
- General question → Answer with explanation

Format output as:

**Problem/Question:**
<recognized content - use $KaTeX$ for math>

**Solution/Answer:**
<step-by-step solution or direct answer>

**Explanation:**
<clear explanation of the reasoning>

---

For MATH problems:
- Use single $ for inline math: $x = 5$
- Use double $$ for display equations: $$\\int_0^1 f(x) dx$$
- Show all intermediate steps
- Simplify the final answer
- For systems: solve all variables
- For inequalities: use interval notation

For MULTIPLE CHOICE:
- Identify correct option (A, B, C, D)
- Explain why it's correct
- Note why others are wrong

For TRUE/FALSE:
- State True or False clearly
- Provide justification

For SHORT ANSWER/ESSAY:
- Provide concise, complete answer
- Include key facts and reasoning

For CODING problems:
- Write the solution code
- Explain the logic

If multiple problems/questions present, solve each separately.
If unsolvable or unclear, explain why.
`,
	CRX_WRITE_CODE: `
You are an expert software developer. Analyze the provided content and generate high-quality, working code.

Code Generation Requirements:
- Choose the best programming language for the task
- Write clean, efficient, and well-documented code
- Include proper error handling and input validation
- Add meaningful comments explaining complex logic
- Follow language-specific best practices and conventions
- Ensure code is readable, maintainable, and follows standard patterns

For each code generation task:
1. **Analyze Requirements**: Understand what the code needs to do
2. **Choose Language**: Select appropriate programming language
3. **Design Solution**: Plan the code structure and logic
4. **Write Code**: Provide complete, working code with comments
5. **Explain Logic**: Describe how the code works and key decisions

Provide complete, runnable code that solves the described problem.
`,
	CRX_EXTRACT_CSS: `
You are an expert CSS developer. Analyze the provided content and extract/generate the corresponding CSS styles.

CSS Extraction Requirements:
- Analyze visual elements, layout, and design patterns
- Generate modern, clean CSS using current standards
- Use semantic class names and proper CSS architecture
- Include responsive design considerations
- Optimize for performance and maintainability
- Follow CSS best practices and conventions

For CSS extraction:
1. **Analyze Design**: Identify colors, typography, spacing, layout
2. **Generate Rules**: Create appropriate CSS rules and selectors
3. **Organize Code**: Group related styles logically
4. **Add Comments**: Explain complex or important style decisions
5. **Ensure Compatibility**: Use widely supported CSS properties

Provide complete, well-organized CSS that recreates the described design.
`
};
AI_INSTRUCTIONS.SOLVE_AND_ANSWER;
AI_INSTRUCTIONS.WRITE_CODE;
AI_INSTRUCTIONS.EXTRACT_CSS;
AI_INSTRUCTIONS.RECOGNIZE_CONTENT;
AI_INSTRUCTIONS.CONVERT_DATA;
AI_INSTRUCTIONS.EXTRACT_ENTITIES;
AI_INSTRUCTIONS.TRANSLATE_TO_LANGUAGE;
AI_INSTRUCTIONS.GENERAL_PROCESSING;
AI_INSTRUCTIONS.CRX_SOLVE_AND_ANSWER;
AI_INSTRUCTIONS.CRX_WRITE_CODE;
AI_INSTRUCTIONS.CRX_EXTRACT_CSS;
//#endregion
//#region ../../modules/projects/subsystem/src/routing/channel/UnifiedAIConfig.ts
var UNIFIED_PROCESSING_RULES = {
	"share-target": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: true
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"url"
		],
		defaultOverrideFactors: []
	},
	"launch-queue": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: true
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: []
	},
	"crx-snip": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: false
		},
		supportedContentTypes: ["text", "image"],
		defaultOverrideFactors: ["force-processing"]
	},
	"paste": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"text": ["user-action"],
			"markdown": ["user-action"]
		}
	},
	"drop": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"file": ["user-action"],
			"blob": ["user-action"]
		}
	},
	"button-attach-workcenter": {
		processingUrl: "/api/processing",
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-workcenter",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"file"
		],
		defaultOverrideFactors: ["explicit-workcenter"],
		associationOverrides: {
			"markdown": ["explicit-workcenter"],
			"text": ["explicit-workcenter"],
			"image": ["explicit-workcenter"],
			"file": ["explicit-workcenter"]
		}
	}
};
Object.fromEntries(Object.entries(UNIFIED_PROCESSING_RULES).map(([key, config]) => [key, {
	processingUrl: config.processingUrl,
	contentAction: config.contentAction,
	...config.supportedContentTypes && { supportedContentTypes: config.supportedContentTypes }
}]));
//#endregion
//#region ../../modules/projects/subsystem/src/routing/channel/ContentAssociations.ts
var normalizeContentType = (t) => {
	const v = String(t || "").toLowerCase().trim();
	if (!v) return CONTENT_TYPES.OTHER;
	if (v === "md") return CONTENT_TYPES.MARKDOWN;
	if (v === "markdown") return CONTENT_TYPES.MARKDOWN;
	if (v === "txt") return CONTENT_TYPES.TEXT;
	if (v === "text") return CONTENT_TYPES.TEXT;
	if (v === "url") return CONTENT_TYPES.URL;
	if (v === "image") return CONTENT_TYPES.IMAGE;
	if (v === "file" || v === "blob") return CONTENT_TYPES.FILE;
	if (v === "pdf") return CONTENT_TYPES.PDF;
	if (v === "html") return CONTENT_TYPES.HTML;
	if (v === "json") return CONTENT_TYPES.JSON;
	if (v === "base64") return CONTENT_TYPES.FILE;
	if (new Set(Object.values(CONTENT_TYPES)).has(v)) return v;
	return CONTENT_TYPES.OTHER;
};
var coerceOverrideFactors = (factors) => {
	const out = [];
	const list = Array.isArray(factors) ? factors : [];
	for (const f of list) {
		const v = String(f || "").trim();
		if (!v) continue;
		out.push(v);
	}
	return out;
};
var pickExplicitDestination = (factors) => {
	if (factors.includes("explicit-explorer")) return "explorer";
	if (factors.includes("explicit-workcenter")) return "workcenter";
	if (factors.includes("explicit-viewer")) return "viewer";
	return null;
};
var defaultDestinationForType = (normalizedContentType) => {
	switch (normalizedContentType) {
		case CONTENT_TYPES.TEXT:
		case CONTENT_TYPES.MARKDOWN:
		case CONTENT_TYPES.HTML:
		case CONTENT_TYPES.JSON: return "viewer";
		case CONTENT_TYPES.URL: return "workcenter";
		case CONTENT_TYPES.IMAGE:
		case CONTENT_TYPES.PDF:
		case CONTENT_TYPES.FILE:
		case CONTENT_TYPES.OTHER:
		default: return "workcenter";
	}
};
var mergeRuleOverrideFactors = (intent, normalizedContentType) => {
	const base = coerceOverrideFactors(intent.overrideFactors);
	const src = String(intent.processingSource || "").trim();
	if (!src) return base;
	const rule = UNIFIED_PROCESSING_RULES[src];
	if (!rule) return base;
	const merged = [];
	merged.push(...rule.defaultOverrideFactors || []);
	const perType = rule.associationOverrides?.[normalizedContentType] || rule.associationOverrides?.[String(intent.contentType || "")] || [];
	merged.push(...perType);
	merged.push(...base);
	return merged;
};
function resolveAssociation(intent) {
	const normalizedContentType = normalizeContentType(intent.contentType);
	const mergedFactors = mergeRuleOverrideFactors(intent, normalizedContentType);
	const explicit = pickExplicitDestination(mergedFactors);
	if (explicit) return {
		destination: explicit,
		normalizedContentType,
		overrideFactors: mergedFactors
	};
	return {
		destination: defaultDestinationForType(normalizedContentType),
		normalizedContentType,
		overrideFactors: mergedFactors
	};
}
function resolveAssociationPipeline(intent) {
	const primary = resolveAssociation(intent);
	const factors = primary.overrideFactors;
	const pipeline = [];
	if (factors.includes("explicit-explorer")) pipeline.push("explorer");
	if (factors.includes("explicit-workcenter")) pipeline.push("workcenter");
	if (factors.includes("explicit-viewer")) pipeline.push("viewer");
	if (pipeline.length === 0) pipeline.push(primary.destination);
	if ((factors.includes("force-attachment") || factors.includes("force-processing")) && !pipeline.includes("workcenter")) pipeline.push("workcenter");
	const unique = [];
	for (const d of pipeline) if (!unique.includes(d)) unique.push(d);
	return {
		...primary,
		pipeline: unique
	};
}
//#endregion
//#region ../../modules/projects/subsystem/src/routing/channel/UnifiedMessaging.ts
/**
* Unified Messaging System for CrossWord
* Extends fest/uniform messaging with app-specific configuration
*/
var UnifiedMessaging_exports = /* @__PURE__ */ __exportAll({
	createMessageWithOverrides: () => createMessageWithOverrides,
	createProtocolEnvelope: () => createProtocolEnvelope,
	enqueuePendingMessage: () => enqueuePendingMessage,
	getUnifiedMessaging: () => getUnifiedMessaging,
	hasPendingMessages: () => hasPendingMessages,
	initializeComponent: () => initializeComponent,
	processInitialContent: () => processInitialContent,
	registerComponent: () => registerComponent,
	registerHandler: () => registerHandler,
	replayQueuedMessagesForDestination: () => replayQueuedMessagesForDestination,
	sendMessage: () => sendMessage,
	sendProtocolMessage: () => sendProtocolMessage,
	unifiedMessaging: () => unifiedMessaging,
	unregisterHandler: () => unregisterHandler
});
var APP_CHANNEL_MAPPINGS = {
	...createDestinationChannelMappings(),
	[DESTINATIONS.WORKCENTER]: BROADCAST_CHANNELS.WORK_CENTER,
	[DESTINATIONS.CLIPBOARD]: BROADCAST_CHANNELS.CLIPBOARD
};
var appMessagingInstance = null;
/**
* Get the app-configured UnifiedMessagingManager
*/
function getUnifiedMessaging() {
	if (!appMessagingInstance) appMessagingInstance = getUnifiedMessaging$1({
		channelMappings: APP_CHANNEL_MAPPINGS,
		queueOptions: {
			dbName: "CrossWordMessageQueue",
			storeName: "messages",
			maxRetries: 3,
			defaultExpirationMs: 1440 * 60 * 1e3
		},
		pendingStoreOptions: {
			storageKey: "rs-unified-messaging-pending",
			maxMessages: 200,
			defaultTTLMs: 1440 * 60 * 1e3
		}
	});
	return appMessagingInstance;
}
var unifiedMessaging = getUnifiedMessaging();
/**
* Send a message using the app-configured manager
*/
function sendMessage(message) {
	return unifiedMessaging.sendMessage(toUnifiedInteropMessage({
		...message,
		source: message.source ?? "unified-messaging"
	}));
}
function sendProtocolMessage(message) {
	const interop = createInteropEnvelope({
		...message,
		source: message.source ?? "crossword-unified-messaging",
		protocol: message.protocol ?? "window",
		purpose: message.purpose ?? "mail",
		srcChannel: message.srcChannel ?? message.source ?? "crossword-unified-messaging",
		dstChannel: message.dstChannel ?? message.destination
	});
	const envelope = createProtocolEnvelope({
		...interop,
		source: interop.source,
		destination: interop.destination,
		data: interop.data,
		payload: interop.payload,
		metadata: interop.metadata,
		protocol: interop.protocol,
		purpose: interop.purpose,
		srcChannel: interop.srcChannel,
		dstChannel: interop.dstChannel,
		redirect: interop.redirect,
		flags: interop.flags,
		op: interop.op,
		timestamp: interop.timestamp,
		result: interop.result,
		error: interop.error ? String(interop.error) : void 0
	});
	return unifiedMessaging.sendMessage(envelope);
}
/**
* Register a handler using the app-configured manager
*/
function registerHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.registerHandler(name, handler);
}
function unregisterHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.unregisterHandler(name, handler);
}
function initializeComponent(componentId) {
	return unifiedMessaging.initializeComponent(componentId);
}
function hasPendingMessages(destination) {
	return unifiedMessaging.hasPendingMessages(normalizeDestination(destination) || destination);
}
function enqueuePendingMessage(destination, message) {
	const dest = normalizeDestination(destination) || String(destination ?? "").trim();
	if (!dest || !message) return;
	unifiedMessaging.enqueuePendingMessage(dest, message);
}
/**
* Replay IndexedDB-backed queued messages for a destination (mail/deferred pipeline).
* Safe after handlers register — implicit view bridge calls this post-bind.
*/
function replayQueuedMessagesForDestination(destination) {
	return unifiedMessaging.processQueuedMessages(destination);
}
function registerComponent(componentId, destination) {
	unifiedMessaging.registerComponent(componentId, normalizeDestination(destination) || destination);
}
function processInitialContent(content) {
	const contentType = String(content?.contentType ?? content?.type ?? CONTENT_TYPES.OTHER);
	const contentMetadata = content?.metadata ?? {};
	const resolved = resolveAssociationPipeline({
		contentType,
		context: content?.context,
		processingSource: content?.processingSource,
		overrideFactors: content?.overrideFactors ?? contentMetadata.overrideFactors
	});
	const payload = content?.content ?? content?.data ?? content;
	const meta = contentMetadata;
	const source = String(content?.source ?? meta?.source ?? "content-association");
	const tasks = resolved.pipeline.map((dest) => {
		if (dest === DESTINATIONS.VIEWER) return sendMessage({
			type: "content-view",
			source,
			destination: DESTINATIONS.VIEWER,
			contentType: resolved.normalizedContentType,
			data: {
				content: payload?.text ?? payload?.content ?? payload,
				text: payload?.text,
				filename: payload?.filename ?? meta?.filename
			},
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
		if (dest === DESTINATIONS.EXPLORER) return sendMessage({
			type: "content-explorer",
			source,
			destination: DESTINATIONS.EXPLORER,
			contentType: resolved.normalizedContentType,
			data: {
				action: "save",
				...payload
			},
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
		return sendMessage({
			type: "content-share",
			source,
			destination: DESTINATIONS.WORKCENTER,
			contentType: resolved.normalizedContentType,
			data: payload,
			metadata: {
				...meta,
				overrideFactors: resolved.overrideFactors,
				context: content?.context,
				processingSource: content?.processingSource
			}
		});
	});
	return Promise.allSettled(tasks).then(() => {});
}
function createMessageWithOverrides(type, source, contentType, data, overrideFactors = [], processingSource) {
	const resolved = resolveAssociation({
		contentType,
		context: processingSource,
		processingSource,
		overrideFactors
	});
	return {
		id: crypto.randomUUID(),
		type,
		source,
		destination: resolved.destination === DESTINATIONS.VIEWER ? DESTINATIONS.VIEWER : resolved.destination === DESTINATIONS.EXPLORER ? DESTINATIONS.EXPLORER : DESTINATIONS.WORKCENTER,
		contentType,
		data,
		metadata: {
			timestamp: Date.now(),
			overrideFactors,
			processingSource,
			priority: "normal"
		}
	};
}
//#endregion
export { initializeComponent as a, registerHandler as c, sendProtocolMessage as d, unifiedMessaging as f, hasPendingMessages as i, replayQueuedMessagesForDestination as l, createMessageWithOverrides as n, processInitialContent as o, unregisterHandler as p, enqueuePendingMessage as r, registerComponent as s, UnifiedMessaging_exports as t, sendMessage as u };
