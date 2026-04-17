//#region src/frontend/shells/print/index.ts
var PrintView = class {
	id = "print";
	name = "Print";
	icon = "printer";
	options;
	constructor(options = {}) {
		this.options = options;
	}
	render() {
		const root = document.createElement("section");
		root.className = "view-print";
		const heading = document.createElement("h1");
		heading.textContent = this.options.title || "Print Preview";
		const content = document.createElement("pre");
		content.className = "view-print__content";
		content.textContent = String(this.options.content || "");
		root.append(heading, content);
		return root;
	}
};
function createPrintView(options) {
	return new PrintView(options);
}
//#endregion
export { PrintView, createPrintView, createPrintView as default };
