import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { a as generateInstructionId } from "./service7.js";
import "./service10.js";
import { i as saveSettings, r as loadSettings } from "./service11.js";
//#region src/com/service/instructions/CustomInstructions.ts
var CustomInstructions_exports = /* @__PURE__ */ __exportAll({
	addInstruction: () => addInstruction,
	addInstructions: () => addInstructions,
	deleteInstruction: () => deleteInstruction,
	getActiveInstruction: () => getActiveInstruction,
	getActiveInstructionText: () => getActiveInstructionText,
	getCustomInstructions: () => getCustomInstructions,
	getInstructionRegistry: () => getInstructionRegistry,
	setActiveInstruction: () => setActiveInstruction,
	updateInstruction: () => updateInstruction
});
/** Defer read of `generateInstructionId` until call — avoids TDZ when workcenter ↔ com-app chunks cycle. */
var generateId = () => generateInstructionId();
var byOrderAndLabel = (a, b) => {
	const ao = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER;
	const bo = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER;
	if (ao !== bo) return ao - bo;
	return (a.label || "").localeCompare(b.label || "");
};
var normalizeInstructions = (items) => [...items || []].sort(byOrderAndLabel);
var pickActiveInstruction = (instructions, activeId) => {
	if (!activeId) return null;
	return instructions.find((i) => i.id === activeId) || null;
};
var getInstructionRegistry = async () => {
	const settings = await loadSettings();
	const instructions = normalizeInstructions(settings?.ai?.customInstructions);
	const activeInstruction = pickActiveInstruction(instructions, settings?.ai?.activeInstructionId);
	return {
		instructions,
		activeId: activeInstruction?.id || "",
		activeInstruction
	};
};
var getCustomInstructions = async () => {
	return (await getInstructionRegistry()).instructions;
};
var getActiveInstruction = async () => {
	try {
		const snapshot = await getInstructionRegistry();
		if (!snapshot.activeId) return null;
		if (!snapshot.activeInstruction) console.warn("[CustomInstructions] activeInstructionId not found:", snapshot.activeId);
		return snapshot.activeInstruction;
	} catch (e) {
		console.error("[CustomInstructions] Error in getActiveInstruction:", e);
		return null;
	}
};
var getActiveInstructionText = async () => {
	return (await getActiveInstruction())?.instruction || "";
};
var setActiveInstruction = async (id) => {
	const settings = await loadSettings();
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			activeInstructionId: id || ""
		}
	});
};
var addInstruction = async (label, instruction) => {
	const settings = await loadSettings();
	const instructions = settings?.ai?.customInstructions || [];
	const newInstruction = {
		id: generateId(),
		label: label.trim() || "Untitled",
		instruction: instruction.trim(),
		enabled: true,
		order: instructions.length
	};
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: [...instructions, newInstruction]
		}
	});
	return newInstruction;
};
/**
* Add multiple instructions at once (avoids race conditions from parallel saves)
*/
var addInstructions = async (items) => {
	if (!items.length) return [];
	const settings = await loadSettings();
	const instructions = settings?.ai?.customInstructions || [];
	const newInstructions = items.map((item, index) => ({
		id: generateId(),
		label: item.label.trim() || "Untitled",
		instruction: item.instruction.trim(),
		enabled: item.enabled ?? true,
		order: instructions.length + index
	}));
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: [...instructions, ...newInstructions]
		}
	});
	return newInstructions;
};
var updateInstruction = async (id, updates) => {
	const settings = await loadSettings();
	const instructions = settings?.ai?.customInstructions || [];
	const index = instructions.findIndex((i) => i.id === id);
	if (index === -1) return false;
	instructions[index] = {
		...instructions[index],
		...updates
	};
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: instructions
		}
	});
	return true;
};
var deleteInstruction = async (id) => {
	const settings = await loadSettings();
	const instructions = settings?.ai?.customInstructions || [];
	const filtered = instructions.filter((i) => i.id !== id);
	if (filtered.length === instructions.length) return false;
	const newActiveId = settings.ai?.activeInstructionId === id ? "" : settings.ai?.activeInstructionId || "";
	await saveSettings({
		...settings,
		ai: {
			...settings.ai,
			customInstructions: filtered,
			activeInstructionId: newActiveId
		}
	});
	return true;
};
//#endregion
export { getCustomInstructions as a, updateInstruction as c, deleteInstruction as i, addInstruction as n, getInstructionRegistry as o, addInstructions as r, setActiveInstruction as s, CustomInstructions_exports as t };
