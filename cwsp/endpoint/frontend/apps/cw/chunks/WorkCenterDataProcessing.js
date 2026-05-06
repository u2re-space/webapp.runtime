import { r as __exportAll } from "./rolldown-runtime.js";
import { k as writeText } from "../vendor/jsox.js";
import "./Clipboard.js";
import { t as purify } from "../vendor/dompurify.js";
import { t as g } from "../vendor/marked.js";
import { n as extractJSONFromAIResponse } from "./AIResponseParser.js";
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterDataProcessing.ts
var WorkCenterDataProcessing_exports = /* @__PURE__ */ __exportAll({ WorkCenterDataProcessing: () => WorkCenterDataProcessing });
var WorkCenterDataProcessing = class {
	formatResult(result, format, outputFormat) {
		if (format === "auto") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data || data.keywords_and_tags || data.suggested_type)) {
				const content = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					content.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) content.push(String(data.verbose_data));
				if (data.keywords_and_tags && Array.isArray(data.keywords_and_tags) && data.keywords_and_tags.length > 0) content.push(`\n**Keywords:** ${data.keywords_and_tags.join(", ")}`);
				if (data.confidence || data.suggested_type) {
					const info = [];
					if (data.confidence) info.push(`Confidence: ${Math.round(data.confidence * 100)}%`);
					if (data.suggested_type) info.push(`Type: ${data.suggested_type}`);
					if (info.length > 0) content.push(`\n*${info.join(" • ")}*`);
				}
				if (content.length > 0) return `<div class="markdown-result structured-content">${content.join("\n\n")}</div>`;
			}
			if (data && typeof data === "object") return this.formatResult(result, "json");
			return this.formatResult(result, "markdown");
		}
		if (format === "json") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			return this.renderAsJSON(data);
		}
		if (format === "markdown") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data || data.keywords_and_tags || data.suggested_type)) {
				const content = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					content.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) content.push(String(data.verbose_data));
				if (data.keywords_and_tags && Array.isArray(data.keywords_and_tags) && data.keywords_and_tags.length > 0) content.push(`\n**Keywords:** ${data.keywords_and_tags.join(", ")}`);
				if (data.confidence || data.suggested_type) {
					const info = [];
					if (data.confidence) info.push(`Confidence: ${Math.round(data.confidence * 100)}%`);
					if (data.suggested_type) info.push(`Type: ${data.suggested_type}`);
					if (info.length > 0) content.push(`\n*${info.join(" • ")}*`);
				}
				if (content.length > 0) return `<div class="markdown-result structured-content">${content.join("\n\n")}</div>`;
			}
		}
		const normalizedData = this.normalizeResultData(result);
		if (!normalizedData) return "<div class=\"no-result\">No result</div>";
		switch (format) {
			case "code": return this.renderAsCode(normalizedData);
			case "raw": return this.renderAsRaw(result?.rawData || result);
			case "html": return this.renderAsHTML(normalizedData);
			case "text": return this.renderAsText(normalizedData);
			default: return this.renderAsMarkdown(normalizedData);
		}
	}
	normalizeResultData(result) {
		if (!result) return null;
		let data = extractJSONFromAIResponse(result)?.data || result;
		if (data && typeof data === "object") {
			if (data.data !== void 0) data = data.data;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
		}
		if (typeof data !== "object" || data === null) data = { recognized_data: [String(data)] };
		return data;
	}
	renderAsJSON(data) {
		try {
			const createFormattedJSON = (obj, indent = 0) => {
				const spaces = "  ".repeat(indent);
				if (obj === null) return "null";
				if (typeof obj === "boolean") return obj ? "true" : "false";
				if (typeof obj === "number") return String(obj);
				if (typeof obj === "string") {
					if (obj.includes("<math") || obj.includes("class=\"katex\"") || obj.includes("<span>")) {
						const placeholder = `__HTML_CONTENT_${Math.random().toString(36).substr(2, 9)}__`;
						htmlPlaceholders[placeholder] = obj;
						return `"${placeholder}"`;
					}
					return JSON.stringify(obj);
				}
				if (Array.isArray(obj)) {
					if (obj.length === 0) return "[]";
					const items = obj.map((item) => createFormattedJSON(item, indent + 1));
					return `[\n${"  ".repeat(indent + 1)}${items.join(`,\n${"  ".repeat(indent + 1)}`)}\n${spaces}]`;
				}
				if (typeof obj === "object") {
					const keys = Object.keys(obj);
					if (keys.length === 0) return "{}";
					const items = keys.map((key) => {
						const formattedValue = createFormattedJSON(obj[key], indent + 1);
						return `${JSON.stringify(key)}: ${formattedValue}`;
					});
					return `{\n${"  ".repeat(indent + 1)}${items.join(`,\n${"  ".repeat(indent + 1)}`)}\n${spaces}}`;
				}
				return String(obj);
			};
			const htmlPlaceholders = {};
			let finalHTML = `<div class="json-result"><pre>${createFormattedJSON(data)}</pre></div>`;
			for (const [placeholder, htmlContent] of Object.entries(htmlPlaceholders)) {
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = htmlContent;
				const renderedHTML = tempDiv.innerHTML;
				finalHTML = finalHTML.replace(`"${placeholder}"`, `<span class="json-html-content">${renderedHTML}</span>`);
			}
			return finalHTML;
		} catch (error) {
			return `<div class="error">Failed to format JSON: ${error}</div>`;
		}
	}
	renderAsHTML(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "html")).join("");
		if (!renderedContent) return `<div class="html-result">${this.renderMathAsHTML(this.extractTextContent(data))}</div>`;
		return `<div class="html-result">${renderedContent}</div>`;
	}
	renderAsText(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "text")).join("\n\n");
		if (!renderedContent.trim()) return `<pre class="text-result">${this.escapeHtml(this.extractTextContent(data))}</pre>`;
		return `<pre class="text-result">${this.escapeHtml(renderedContent)}</pre>`;
	}
	renderAsRaw(data) {
		let rawText = "";
		if (typeof data === "string") rawText = data;
		else try {
			rawText = JSON.stringify(data, null, 2);
		} catch {
			rawText = String(data ?? "");
		}
		return `<pre class="raw-result">${this.escapeHtml(rawText)}</pre>`;
	}
	renderAsCode(data) {
		const content = this.extractContentItems(data).join("\n\n").trim() || this.extractTextContent(data);
		const code = this.extractLikelyCode(content);
		const language = this.detectCodeLanguage(content);
		return `<pre class="code-result"><code data-lang="${this.escapeHtml(language)}">${this.escapeHtml(code)}</code></pre>`;
	}
	renderAsMarkdown(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "markdown")).join("\n\n");
		if (!renderedContent.trim()) try {
			const textContent = this.extractTextContent(data);
			const html = g.parse(textContent);
			return purify.sanitize(html);
		} catch (error) {
			console.warn("Markdown parsing failed, falling back to simple rendering:", error);
			return this.renderMathAsHTML(renderedContent);
		}
		try {
			const html = g.parse(renderedContent);
			return purify.sanitize(html);
		} catch (error) {
			console.warn("Markdown parsing failed, falling back to simple rendering:", error);
			return this.renderMathAsHTML(renderedContent);
		}
	}
	extractContentItems(data) {
		const items = [];
		if (data.recognized_data) {
			const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
			items.push(...recognized.map((item) => String(item)));
		}
		if (data.verbose_data) items.push(String(data.verbose_data));
		if (items.length === 0) {
			for (const field of [
				"content",
				"text",
				"message",
				"result",
				"response",
				"description"
			]) if (data[field]) {
				const content = Array.isArray(data[field]) ? data[field] : [data[field]];
				items.push(...content.map((item) => String(item)));
				break;
			}
		}
		if (items.length === 0) {
			const textContent = this.extractTextContent(data);
			if (textContent) items.push(textContent);
		}
		return items;
	}
	renderContentItem(item, format) {
		switch (format) {
			case "html": return `<div class="recognized-item">${this.renderMathAsHTML(item)}</div>`;
			case "text": return this.stripMarkdown(item);
			case "markdown": return item;
			default: return item;
		}
	}
	renderMathAsHTML(content) {
		let result = content;
		result = result.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
			try {
				return g.parse(`$$${math}$$`).replace(/<p>|<\/p>/g, "").trim();
			} catch {
				return `<span class="math-display">${this.escapeHtml(`$$${math}$$`)}</span>`;
			}
		});
		result = result.replace(/\$([^$]+)\$/g, (match, math) => {
			try {
				return g.parse(`$${math}$`).replace(/<p>|<\/p>/g, "").trim();
			} catch {
				return `<span class="math-inline">${this.escapeHtml(`$${math}$`)}</span>`;
			}
		});
		result = result.replace(/\n/g, "<br>");
		return result;
	}
	stripMarkdown(content) {
		return content.replace(/#{1,6}\s*/g, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/^\s*[-*+]\s+/gm, "").replace(/^\s*\d+\.\s+/gm, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/!\[([^\]]+)\]\([^\)]+\)/g, "$1").trim();
	}
	extractLikelyCode(content) {
		const fenced = content.match(/```[\t ]*([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
		if (fenced?.[2]) return fenced[2].trim();
		return content;
	}
	detectCodeLanguage(content) {
		const fencedLanguage = content.match(/```[\t ]*([a-zA-Z0-9_-]+)?\n/)?.[1];
		if (fencedLanguage) return fencedLanguage.toLowerCase();
		if (/\b(interface|type|const|let|=>|import\s+type)\b/.test(content)) return "typescript";
		if (/\b(function|const|let|var|import|export)\b/.test(content)) return "javascript";
		if (/\b(def |import |from |class )/.test(content)) return "python";
		if (/\b<[^>]+>/.test(content)) return "html";
		return "text";
	}
	extractTextContent(data) {
		if (data == null) return "";
		if (typeof data === "string") return data;
		if (typeof data === "number" || typeof data === "boolean") return String(data);
		if (Array.isArray(data)) return data.map((item) => this.extractTextContent(item)).join("\n");
		if (typeof data === "object") {
			for (const field of [
				"verbose_data",
				"recognized_data",
				"content",
				"text",
				"message",
				"result",
				"response",
				"data"
			]) if (data[field] != null) {
				const content = this.extractTextContent(data[field]);
				if (content) return content;
			}
			try {
				return JSON.stringify(data, null, 2);
			} catch {
				return "[Complex Object]";
			}
		}
		return String(data);
	}
	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}
	copyResultsToClipboard(result, format) {
		let textToCopy = "";
		if (format === "auto" && result) {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data)) {
				const contentItems = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					contentItems.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) contentItems.push(String(data.verbose_data));
				textToCopy = contentItems.join("\n\n");
			} else {
				const normalizedData = this.normalizeResultData(result);
				textToCopy = this.extractContentItems(normalizedData).join("\n\n");
			}
		} else if ((format === "markdown" || format === "html") && result) {
			const normalizedData = this.normalizeResultData(result);
			textToCopy = this.extractContentItems(normalizedData).join("\n\n");
		} else if (format === "json" && result) {
			const normalizedData = this.normalizeResultData(result);
			textToCopy = this.extractContentItems(normalizedData).join("\n\n");
		} else if ((format === "raw" || format === "code") && result) {
			const rawData = result?.rawData || result;
			textToCopy = typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2);
		} else textToCopy = result?.textContent || "";
		return writeText(textToCopy).then((result) => {
			if (!result.ok) throw new Error(result.error || "Clipboard write failed");
		});
	}
};
//#endregion
export { WorkCenterDataProcessing_exports as n, WorkCenterDataProcessing as t };
