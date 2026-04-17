import { a as writeTimelineTask, o as fixEntityId } from "./app3.js";
//#region src/core/utils/DebugTaskGenerator.ts
var DEBUG_ENABLED = true;
var TASK_TEMPLATES = [
	{
		kind: "job",
		name: "Debug Job Task",
		description: "This is a debug job task generated for testing purposes. It includes all necessary properties and follows the entity structure.",
		status: "pending",
		icon: "briefcase",
		variant: "blue"
	},
	{
		kind: "action",
		name: "Debug Action Task",
		description: "This is a debug action task generated for testing. It simulates a typical action that might be part of a daily routine.",
		status: "in_progress",
		icon: "play-circle",
		variant: "green"
	},
	{
		kind: "other",
		name: "Debug Other Task",
		description: "This is a debug task of 'other' kind. It represents miscellaneous tasks that don't fit into specific categories.",
		status: "under_consideration",
		icon: "play-circle",
		variant: "orange"
	}
];
var SAMPLE_LOCATIONS = [
	"Office",
	"Home",
	"Gym",
	"Coffee Shop",
	"Library",
	"Park",
	"Shopping Mall",
	"Restaurant"
];
var SAMPLE_CONTACTS = [{
	email: ["debug@example.com"],
	phone: ["+1234567890"],
	links: ["https://example.com"]
}, {
	email: ["test@example.com"],
	phone: ["+0987654321"]
}];
/**
* Generates a random debug task with realistic properties
*/
var generateDebugTask = () => {
	const now = /* @__PURE__ */ new Date();
	const template = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
	const daysOffset = Math.floor(Math.random() * 7);
	const hoursOffset = Math.floor(Math.random() * 24);
	const minutesOffset = Math.floor(Math.random() * 60);
	const beginTime = new Date(now);
	beginTime.setDate(beginTime.getDate() + daysOffset);
	beginTime.setHours(beginTime.getHours() + hoursOffset);
	beginTime.setMinutes(beginTime.getMinutes() + minutesOffset);
	const durationHours = 1 + Math.floor(Math.random() * 3);
	const endTime = new Date(beginTime);
	endTime.setHours(endTime.getHours() + durationHours);
	const location = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];
	const contacts = SAMPLE_CONTACTS[Math.floor(Math.random() * SAMPLE_CONTACTS.length)];
	const task = {
		type: "task",
		kind: template.kind,
		name: `${template.name} ${Date.now()}`,
		title: template.name,
		description: template.description,
		icon: template.icon,
		variant: template.variant,
		properties: {
			status: template.status,
			begin_time: {
				timestamp: beginTime.getTime(),
				iso_date: beginTime.toISOString()
			},
			end_time: {
				timestamp: endTime.getTime(),
				iso_date: endTime.toISOString()
			},
			location,
			contacts,
			members: [],
			events: []
		}
	};
	fixEntityId(task, { mutate: true });
	return task;
};
/**
* Generates multiple debug tasks
*/
var generateDebugTasks = (count = 3) => {
	const tasks = [];
	for (let i = 0; i < count; i++) tasks.push(generateDebugTask());
	return tasks;
};
/**
* Writes debug tasks to the timeline
*/
var writeDebugTasks = async (taskCount = 1) => {
	const tasks = generateDebugTasks(taskCount);
	const results = [];
	for (const task of tasks) try {
		const result = await writeTimelineTask(task);
		results.push(result);
		console.log("Debug task written:", task.name, task.id);
	} catch (error) {
		console.warn("Failed to write debug task:", error);
	}
	return results;
};
/**
* Manual trigger for debug task generation
*/
var triggerDebugTaskGeneration = (count = 1) => {
	return writeDebugTasks(count);
};
/**
* Enable or disable debug mode
*/
var setDebugMode = (enabled) => {
	globalThis.DEBUG_ENABLED = enabled;
	console.log(`Debug mode ${enabled ? "enabled" : "disabled"}`);
};
/**
* Get current debug mode status
*/
var isDebugModeEnabled = () => {
	return DEBUG_ENABLED;
};
if (typeof globalThis !== "undefined") globalThis.debugTaskGenerator = {
	generate: triggerDebugTaskGeneration,
	setMode: setDebugMode,
	isEnabled: isDebugModeEnabled
};
//#endregion
//#region src/core/time/index.ts
/**
* Check if string is pure HH:MM format
*/
function isPureHHMM(str) {
	if (!str) return false;
	return /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(str).trim());
}
/**
* Parse date from various formats
*/
function parseDateCorrectly(str) {
	if (!str) return /* @__PURE__ */ new Date();
	if (str instanceof Date) return new Date(str);
	if (typeof str == "object" && str?.timestamp) return parseDateCorrectly(str.timestamp);
	if (typeof str == "object" && str?.iso_date) return parseDateCorrectly(str.iso_date);
	if (typeof str == "object" && str?.date) return parseDateCorrectly(str.date);
	if (typeof str == "number") {
		if (str >= 0xe8d4a51000) return new Date(str);
		const multiplier = Math.pow(10, 11 - (String(str | 0)?.length || 11)) | 0;
		return new Date(str * multiplier);
	}
	if (typeof str == "string" && isPureHHMM(str)) {
		const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(str.trim());
		if (!m) return /* @__PURE__ */ new Date();
		const [, hh, mm] = m;
		const now = /* @__PURE__ */ new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hh), Number(mm), 0, 0);
	}
	return new Date(String(str));
}
//#endregion
export { triggerDebugTaskGeneration as n, parseDateCorrectly as t };
