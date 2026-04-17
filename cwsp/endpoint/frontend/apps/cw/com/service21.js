//#region src/core/storage/FileHandling.ts
var FileHandler = class {
	options;
	dragOverElements = /* @__PURE__ */ new Set();
	constructor(options) {
		this.options = { ...options };
	}
	/**
	* Programmatically add files into the same pipeline as UI selection / DnD / paste.
	* Used by PWA share-target and launchQueue ingestion.
	*/
	addFiles(files) {
		if (!Array.isArray(files) || files.length === 0) return;
		return this.options.onFilesAdded(files);
	}
	/**
	* Set up file input element with file selection
	*/
	setupFileInput(container, accept = "*") {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.accept = accept;
		fileInput.style.display = "none";
		fileInput.addEventListener("change", (e) => {
			const files = Array.from(e.target.files || []);
			if (files.length > 0) this.options.onFilesAdded(files);
			fileInput.value = "";
		});
		container.append(fileInput);
		return fileInput;
	}
	/**
	* Set up drag and drop handling for an element
	*/
	setupDragAndDrop(element) {
		element.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.addDragOver(element);
		});
		element.addEventListener("dragleave", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeDragOver(element);
		});
		element.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeDragOver(element);
			const files = Array.from(e.dataTransfer?.files || []);
			if (files.length > 0) this.options.onFilesAdded(files);
		});
	}
	/**
	* Set up paste handling for an element
	*/
	setupPasteHandling(element) {
		element.addEventListener("paste", (e) => {
			const files = Array.from(e.clipboardData?.files || []);
			if (files.length > 0) {
				e.preventDefault();
				this.options.onFilesAdded(files);
			}
		});
	}
	/**
	* Set up all file handling for a container (file input button, drag & drop, paste)
	*/
	setupCompleteFileHandling(container, fileSelectButton, dropZone, accept = "*") {
		const fileInput = this.setupFileInput(container, accept);
		fileSelectButton.addEventListener("click", () => {
			fileInput.click();
		});
		if (dropZone) this.setupDragAndDrop(dropZone);
		this.setupPasteHandling(container);
	}
	/**
	* Validate file types and sizes
	*/
	validateFiles(files, options = {}) {
		const { maxSize, allowedTypes, maxFiles } = options;
		const valid = [];
		const invalid = [];
		if (maxFiles && files.length > maxFiles) {
			invalid.push(...files.slice(maxFiles).map((file) => ({
				file,
				reason: `Too many files. Maximum ${maxFiles} files allowed.`
			})));
			files = files.slice(0, maxFiles);
		}
		for (const file of files) {
			let isValid = true;
			let reason = "";
			if (maxSize && file.size > maxSize) {
				isValid = false;
				reason = `File too large. Maximum size is ${this.formatFileSize(maxSize)}.`;
			}
			if (allowedTypes && allowedTypes.length > 0) {
				if (!allowedTypes.some((type) => {
					if (type.includes("*")) return file.type.startsWith(type.replace("/*", "/"));
					return file.type === type;
				})) {
					isValid = false;
					reason = reason || `File type not allowed. Allowed types: ${allowedTypes.join(", ")}.`;
				}
			}
			if (isValid) valid.push(file);
			else invalid.push({
				file,
				reason
			});
		}
		return {
			valid,
			invalid
		};
	}
	/**
	* Read file content as text
	*/
	async readFileAsText(file, onProgress) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			if (onProgress) reader.onprogress = (e) => {
				if (e.lengthComputable) onProgress(e.loaded, e.total);
			};
			reader.readAsText(file);
		});
	}
	/**
	* Read file content as ArrayBuffer
	*/
	async readFileAsArrayBuffer(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			reader.readAsArrayBuffer(file);
		});
	}
	/**
	* Read file content as Data URL
	*/
	async readFileAsDataURL(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to read file: ${file.name}`));
			reader.readAsDataURL(file);
		});
	}
	/**
	* Read multiple files as text
	*/
	async readFilesAsText(files, onProgress) {
		const results = [];
		for (const file of files) try {
			const content = await this.readFileAsText(file, (loaded, total) => {
				onProgress?.(file, loaded, total);
			});
			results.push({
				file,
				content
			});
		} catch (error) {
			console.warn(`Failed to read file ${file.name}:`, error);
		}
		return results;
	}
	/**
	* Get file icon based on MIME type
	*/
	getFileIcon(mimeType) {
		if (mimeType.startsWith("image/")) return "🖼️";
		if (mimeType === "application/pdf") return "📄";
		if (mimeType.includes("json")) return "📋";
		if (mimeType.includes("text") || mimeType.includes("markdown")) return "📝";
		if (mimeType.includes("javascript") || mimeType.includes("typescript")) return "📜";
		if (mimeType.includes("css")) return "🎨";
		if (mimeType.includes("html")) return "🌐";
		if (mimeType.startsWith("video/")) return "🎥";
		if (mimeType.startsWith("audio/")) return "🎵";
		if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
		return "📄";
	}
	/**
	* Format file size for display
	*/
	formatFileSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	}
	/**
	* Check if a file is likely a markdown file
	*/
	isMarkdownFile(file) {
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".mdown") || name.endsWith(".mkd") || name.endsWith(".mkdn") || name.endsWith(".mdtxt") || name.endsWith(".mdtext") || type.includes("markdown") || type.includes("text");
	}
	/**
	* Check if a file is an image
	*/
	isImageFile(file) {
		return file.type.startsWith("image/");
	}
	/**
	* Check if a file is a text file
	*/
	isTextFile(file) {
		return file.type.startsWith("text/") || this.isMarkdownFile(file) || file.type.includes("javascript") || file.type.includes("typescript") || file.type.includes("css") || file.type.includes("html") || file.type.includes("json") || file.type.includes("xml");
	}
	/**
	* Check if a file is a binary file
	*/
	isBinaryFile(file) {
		return !this.isTextFile(file) && !this.isImageFile(file);
	}
	/**
	* Get file metadata
	*/
	getFileMetadata(file) {
		const extension = file.name.split(".").pop()?.toLowerCase() || "";
		const isText = this.isTextFile(file);
		const isImage = this.isImageFile(file);
		const isBinary = this.isBinaryFile(file);
		return {
			name: file.name,
			extension,
			size: file.size,
			type: file.type,
			lastModified: file.lastModified,
			isText,
			isImage,
			isBinary,
			formattedSize: this.formatFileSize(file.size),
			icon: this.getFileIcon(file.type)
		};
	}
	/**
	* Get files metadata for multiple files
	*/
	getFilesMetadata(files) {
		return files.map((file) => this.getFileMetadata(file));
	}
	addDragOver(element) {
		if (!this.dragOverElements.has(element)) {
			this.dragOverElements.add(element);
			element.classList.add("drag-over");
		}
	}
	removeDragOver(element) {
		if (this.dragOverElements.has(element)) {
			this.dragOverElements.delete(element);
			element.classList.remove("drag-over");
		}
	}
	/**
	* Manually trigger file processing with the provided files
	*/
	processFiles(files) {
		this.options.onFilesAdded(files);
	}
	/**
	* Create a downloadable file from content
	*/
	createDownloadableFile(content, filename, mimeType) {
		let blob;
		if (content instanceof Blob) blob = content;
		else if (content instanceof ArrayBuffer) blob = new Blob([content], { type: mimeType || "application/octet-stream" });
		else blob = new Blob([content], { type: mimeType || "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(() => URL.revokeObjectURL(url), 100);
	}
	/**
	* Create a shareable file URL
	*/
	createFileURL(file) {
		return URL.createObjectURL(file);
	}
	/**
	* Revoke a file URL to free memory
	*/
	revokeFileURL(url) {
		URL.revokeObjectURL(url);
	}
	/**
	* Clean up event listeners and references
	*/
	destroy() {
		this.dragOverElements.clear();
	}
};
/**
* Utility function to create a file handler with default options
*/
function createFileHandler(options) {
	return new FileHandler(options);
}
//#endregion
export { createFileHandler as t };
