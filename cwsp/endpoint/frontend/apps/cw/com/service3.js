import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import "./service2.js";
//#region src/com/service/instructions/templates.ts
var templates_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_INSTRUCTION_TEMPLATES: () => DEFAULT_INSTRUCTION_TEMPLATES,
	DEFAULT_TEMPLATES: () => DEFAULT_TEMPLATES
});
var DEFAULT_TEMPLATES = [
	{
		name: "Recognize Content",
		prompt: "Recognize and extract information from the provided content",
		category: "Analysis",
		tags: [
			"recognition",
			"extraction",
			"analysis"
		]
	},
	{
		name: "Analyze Document",
		prompt: "Analyze this document and provide a summary with key insights",
		category: "Analysis",
		tags: [
			"analysis",
			"summary",
			"insights"
		]
	},
	{
		name: "Solve Problems",
		prompt: "Solve any equations, problems, or questions in the content",
		category: "Problem Solving",
		tags: [
			"math",
			"problems",
			"solutions"
		]
	},
	{
		name: "Generate Code",
		prompt: "Generate code based on the requirements or description provided",
		category: "Development",
		tags: [
			"code",
			"programming",
			"development"
		]
	},
	{
		name: "Extract CSS",
		prompt: "Extract or generate CSS from the content or images",
		category: "Design",
		tags: [
			"css",
			"styling",
			"design"
		]
	},
	{
		name: "Summarize Text",
		prompt: "Provide a concise summary of the following text",
		category: "Writing",
		tags: [
			"summary",
			"writing",
			"concise"
		]
	},
	{
		name: "Translate to Language",
		prompt: "Translate the following content to the selected language. Maintain the original formatting and structure where possible. If the content is already in the target language, provide a natural rephrasing or improvement instead.",
		category: "Translation",
		tags: [
			"translate",
			"language",
			"dynamic"
		]
	},
	{
		name: "Translate Content",
		prompt: "Translate the following content to English",
		category: "Translation",
		tags: [
			"translate",
			"language",
			"english"
		]
	},
	{
		name: "Generate Ideas",
		prompt: "Generate creative ideas based on the provided topic or content",
		category: "Creative",
		tags: [
			"ideas",
			"creative",
			"brainstorming"
		]
	}
];
var DEFAULT_INSTRUCTION_TEMPLATES = [
	{
		label: "Markdown & KaTeX",
		instruction: `Format the output as GitHub-compatible Markdown with KaTeX.

Structure rules:
- Use headings for structure:
  - Main sections: start from ### (H3) minimum
  - Subsections: #### / ##### when needed
- Avoid long paragraphs: prefer lists and sub-lists.

KaTeX / math rules:
- Prefer inline formulas: $...$ (use this most of the time).
- Avoid $$...$$ blocks; only use block math if strictly necessary.
  - Prefer block math as \\[ ... \\] instead of $$...$$.
- Inside KaTeX, write a vertical bar as \\| (example: $A \\| B$).

Tables:
- Use strict GitHub Markdown table syntax.
- Inside table cells:
  - Use <br> for line breaks (no real newlines inside cells).
  - If source data uses ';' as a separator, replace ';' with <br>.

Colon / key-value formatting:
- For "key: value" style lines, make the part before ':' bold:
  - **Key**: value

General:
- Use bullet lists (-) or numbered steps (1., 2., 3.) where appropriate.
- Keep formatting consistent and readable in dark themes.
- Preserve meaning and math accuracy.`,
		enabled: true,
		order: 0
	},
	{
		label: "Solve & Answer",
		instruction: `Solve problems or answer questions. Auto-detect the type:
• Math equations → Solve step-by-step with KaTeX
• Quiz/test questions → Provide correct answer with explanation
• Homework problems → Solve and explain reasoning

Format:
**Problem/Question:** <content, use $KaTeX$ for math>
**Solution/Answer:** <step-by-step or direct answer>
**Explanation:** <clear reasoning>

For multiple choice: identify correct option + explain why.
For math: prefer $inline$; avoid $$block$$ and prefer \\[block\\] only if strictly necessary.
Show all work and simplify the final answer.`,
		enabled: true,
		order: 1
	},
	{
		label: "Solve with Graphics",
		instruction: `Solve problems and generate visual representations when applicable.

For functions, graphs, diagrams, geometric shapes, or data visualizations:
Generate inline SVG code as a data URI: \`![Graph](data:image/svg+xml,<encoded_svg>)\`

SVG Generation Rules:
1. Use encodeURIComponent() encoding for the SVG content
2. Keep SVG minimal but accurate (viewBox, paths, text labels)
3. Use appropriate colors: #2563eb (blue) for main, #dc2626 (red) for secondary
4. Include axis labels, grid lines, and legends where helpful
5. Size: viewBox="0 0 400 300" for standard graphs

When to generate SVG:
• Function plots: y = f(x), parametric curves, polar plots
• Geometric diagrams: triangles, circles, angles, constructions
• Data charts: bar, line, pie charts
• Flowcharts and simple diagrams
• Number lines and coordinate systems

Format:
**Problem:** <description>
**Solution:** <step-by-step with $KaTeX$>
**Visualization:**
![<title>](data:image/svg+xml,<encodeURIComponent_svg>)

Always provide both the mathematical solution AND the visual when graphics are suitable.`,
		enabled: true,
		order: 2
	},
	{
		label: "Write code",
		instruction: `Generate code based on the recognized request/description.

Format:
**Request:** <what the code should do>
**Language:** <programming language>
**Code:**
\`\`\`<lang>
<code>
\`\`\`

Write clean, functional code with meaningful names and brief comments.`,
		enabled: true,
		order: 3
	},
	{
		label: "Extract CSS",
		instruction: `Generate CSS that matches the visual appearance of the content.

Extract:
- Colors (oklch, hex, rgb)
- Typography (font, size, weight)
- Spacing (padding, margin, gap)
- Layout (flex, grid)
- Effects (shadow, radius, gradients)

Use CSS custom properties and modern syntax.
Include responsive considerations.`,
		enabled: true,
		order: 4
	},
	{
		label: "Generate Diagram",
		instruction: `Generate SVG diagrams, charts, or visual representations from descriptions.

Output as inline data URI: ![<title>](data:image/svg+xml,<encoded_svg>)

Diagram Types:
• Flowcharts: processes, algorithms, decision trees
• Charts: bar, line, pie, scatter plots
• Diagrams: UML, ER, network, architecture
• Graphs: mathematical functions, data visualization
• Geometric: shapes, constructions, proofs

SVG Requirements:
1. Use encodeURIComponent() for the SVG string
2. viewBox="0 0 600 400" (adjust as needed)
3. Clean, minimal SVG with proper structure
4. Colors: #3b82f6 primary, #10b981 secondary, #f59e0b accent
5. Include labels, arrows, and legends
6. Use <text> for readable annotations

Example output format:
**Diagram:** <description>
![<title>](data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%3E...%3C%2Fsvg%3E)`,
		enabled: true,
		order: 5
	},
	{
		label: "Extract contacts",
		instruction: "Focus on extracting contact information: phone numbers, emails, addresses, and names. Format phone numbers in E.164 format.",
		enabled: true,
		order: 6
	},
	{
		label: "Summarize content",
		instruction: "Provide a brief summary of the recognized content. Include key points and main takeaways.",
		enabled: true,
		order: 7
	},
	{
		label: "Extract URLs and links",
		instruction: "Focus on extracting all URLs, links, and web addresses. Validate and normalize them.",
		enabled: true,
		order: 8
	},
	{
		label: "Code extraction",
		instruction: "Focus on extracting code snippets. Detect the programming language and format appropriately with syntax highlighting markers.",
		enabled: true,
		order: 9
	},
	{
		label: "Table extraction",
		instruction: "Focus on extracting tabular data. Format as proper Markdown tables with headers.",
		enabled: true,
		order: 10
	}
];
//#endregion
export { DEFAULT_TEMPLATES as n, templates_exports as r, DEFAULT_INSTRUCTION_TEMPLATES as t };
