import { c as observe, d as stringRef, l as propRef, o as isObservable, t as computed } from "../fest/object.js";
import { B as navigate, D as writeFile, U as M, V as H, W as Q, _ as getDirectoryHandle, i as writeFilesToDir, n as handleDataTransferFiles, r as postCommitAnalyze, s as generateEntityId, x as mountAsRoot } from "./app3.js";
import { t as JSOX } from "../vendor/jsox.js";
import { n as writeFileSmart } from "./service8.js";
import { t as canParseURL } from "./service9.js";
import { i as saveSettings, n as currentWebDav, r as loadSettings } from "./service11.js";
import { g as snapshotSpeedDialItem, t as NAVIGATION_SHORTCUTS } from "./app4.js";
import { i as writeText, r as readText } from "../core/clipboard.js";
import { i as showSuccess, r as showError } from "./app5.js";
import { n as triggerDebugTaskGeneration, t as parseDateCorrectly } from "./service16.js";
//#region src/core/workers/GeoLocation.ts
var broadcastChannel = new BroadcastChannel("geolocation");
var broadcast = (coords) => {
	broadcastChannel.postMessage({
		timestamp: coords?.timestamp || Date.now(),
		coords: coords?.toJSON?.() || "{}"
	});
};
var watchId = null;
var startTracking = async () => {
	if (!("geolocation" in navigator)) return;
	watchId = navigator?.geolocation?.watchPosition?.((pos) => broadcast(pos), (err) => console.error(err), {
		enableHighAccuracy: true,
		maximumAge: 1e4,
		timeout: 2e4
	});
	return getGeolocation();
};
var stopTracking = async () => {
	if (watchId) navigator?.geolocation?.clearWatch?.(watchId);
	broadcastChannel.postMessage({ type: "stop" });
	return getGeolocation();
};
broadcastChannel.addEventListener("message", (e) => {
	if (e.data.type === "start") startTracking?.()?.catch?.(console.warn.bind(console));
	else if (e.data.type === "stop") stopTracking?.()?.catch?.(console.warn.bind(console));
});
var getGeolocation = async () => {
	const location = new Promise((resolve, reject) => navigator?.geolocation?.getCurrentPosition?.(resolve, reject));
	location?.then?.(broadcast)?.catch?.(console.warn.bind(console));
	return location;
};
//#endregion
//#region src/core/workers/AskToPlan.ts
var loadPlanSource = async () => {
	try {
		return (await loadSettings())?.timeline?.source || null;
	} catch (e) {
		console.warn(e);
		return null;
	}
};
var generateNewPlan = async (speechPrompt = null) => {
	const settings = await loadSettings();
	if (!settings || !settings?.ai || !settings.ai?.apiKey) return;
	try {
		startTracking?.()?.catch?.(console.warn.bind(console));
	} catch (e) {
		console.warn(e);
	}
	try {
		let source = await loadPlanSource();
		const timelineForm = new FormData();
		timelineForm.append("source", source || "");
		timelineForm.append("text", speechPrompt?.trim?.() || "");
		return fetch("/make-timeline", {
			method: "POST",
			priority: "auto",
			keepalive: true,
			body: timelineForm
		})?.catch?.(console.warn.bind(console));
	} catch (e) {
		console.warn(e);
	}
};
//#endregion
//#region shared/fest/fl-ui/ui/items/editor/DateEdit.ts
var jsonOutputTypeFormat = [
	{
		value: "iso_date",
		label: "ISO Date",
		write_as: { iso_date: "string" }
	},
	{
		value: "date",
		label: "Date String",
		write_as: { date: "string" }
	},
	{
		value: "timestamp",
		label: "Timestamp String",
		write_as: { timestamp: "number" }
	},
	{
		value: "text",
		label: "Plain Date String",
		write_as: "string"
	},
	{
		value: "number",
		label: "Plain Timestamp",
		write_as: "number"
	}
];
var FIND_BY_EXISTS = (date) => {
	if (typeof date == "string") return "text";
	if (typeof date == "number") return "timestamp";
	if (typeof date == "object") switch (Object.keys(date)?.[0]) {
		case "iso_date": return "iso_date";
		case "date": return "date";
		case "timestamp": return "timestamp";
		case "text": return "text";
		case "number": return "number";
		default: return "iso_date";
	}
	return "iso_date";
};
var iconsBy = {
	iso_date: "calendar-check",
	date: "calendar",
	timestamp: "clock",
	text: "calendar-check",
	number: "clock"
};
var editBindings$3 = /* @__PURE__ */ new WeakMap();
var whichUsed$3 = /* @__PURE__ */ new WeakMap();
var getTimeZone = () => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
var BY_FORMAT = (value, format) => {
	if (!value) return { iso_date: "" };
	if (format == "iso_date") return { iso_date: value?.toISOString() };
	if (format == "date") return { date: value?.toLocaleString("en-GB", { timeZone: getTimeZone() }) };
	if (format == "timestamp") return { timestamp: value?.getTime() };
	if (format == "text") return value?.toLocaleString("en-GB", { timeZone: getTimeZone() });
	return { iso_date: value?.toISOString() };
};
var VALIDATE = (value, format) => {
	if (value instanceof Date) {
		if (!value) return false;
		if (value.getTime() <= 0) return false;
		return true;
	} else {
		if (!format) return false;
		if (typeof value == "string") {
			if (!value) return false;
			return true;
		}
		if (typeof value == "number") {
			if (!value) return false;
			return true;
		}
		if (typeof value == "object") {
			if (!value) return false;
			if (Object.keys(value).length == 0) return true;
			return true;
		}
	}
	return true;
};
var normalizeISOByTimeZone = (date) => {
	const time = date.toISOString();
	date = new Date(time);
	date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset() % 60);
	return date.toISOString()?.trim?.()?.slice?.(0, 16) ?? "";
};
var parseInitialDate = (value) => {
	if (!value) return null;
	if (value instanceof Date) return value;
	if (typeof value === "object") {
		if (value.iso_date) return parseDateCorrectly(value.iso_date);
		if (value.timestamp) return parseDateCorrectly(value.timestamp);
		if (value.date) return parseDateCorrectly(value.date);
	}
	try {
		const parsed = parseDateCorrectly(value);
		return isNaN(parsed?.getTime() ?? NaN) ? null : parsed;
	} catch {
		return null;
	}
};
var unshiftByLocalTimezone = (date) => {
	if (!date) return null;
	return date;
};
var GET_INPUT_DATE = (rifEl) => {
	return rifEl?.valueAsDate ?? unshiftByLocalTimezone(parseDateCorrectly(rifEl?.value)) ?? null;
};
var DateEntryEdit = ({ object, key }) => {
	if (!key) return {
		block: null,
		saveEvent: () => {}
	};
	const refEl = Q(($h) => $h);
	const rifEl = Q(($h) => $h);
	const initialValue = object[key];
	const initialDate = parseInitialDate(initialValue);
	const initialFormat = FIND_BY_EXISTS(initialValue ?? {});
	const dynamicIcon = stringRef(iconsBy[initialFormat] || "calendar-check");
	const selectedFormat = stringRef(initialFormat);
	const block = H`<div class="date-field-layout" data-key=${key}>
        <div class="date-field-layout-input">
            <input
                ref=${rifEl}
                type="datetime-local"
                prop:valueAsDate=${initialDate}
                value=${initialDate ? normalizeISOByTimeZone(initialDate) : ""}
                data-invalid=${!VALIDATE(initialDate, initialFormat)}
            />
        </div>
        <div class="date-field-layout-format">
            <label for=${"format-" + key}>Output Format</label>
            <ui-icon icon=${dynamicIcon}></ui-icon>
            <select ref=${refEl} prop:value=${selectedFormat} id=${"format-" + key}>
                ${M(jsonOutputTypeFormat, (item) => H`<option value=${item.value}>${item.label}</option>`)}
            </select>
        </div>
    </div>`;
	const saveEvent = (value) => {
		const dateValue = value ?? GET_INPUT_DATE(rifEl);
		if (VALIDATE(dateValue, refEl.value)) object[key] = BY_FORMAT(dateValue, refEl.value);
	};
	rifEl?.addEventListener("change", (ev) => {
		if (VALIDATE(GET_INPUT_DATE(rifEl), refEl.value)) saveEvent(GET_INPUT_DATE(rifEl));
	});
	refEl?.addEventListener("change", (ev) => {
		selectedFormat.value = ev.target.value;
		dynamicIcon.value = iconsBy[ev.target.value] || "calendar-check";
		saveEvent(GET_INPUT_DATE(rifEl));
	});
	whichUsed$3.set(block, {
		key,
		object
	});
	editBindings$3.set(object, {
		key,
		field: new WeakRef(block)
	});
	return {
		block,
		saveEvent
	};
};
//#endregion
//#region shared/fest/fl-ui/ui/items/editor/DescriptionEdit.ts
var editBindings$2 = /* @__PURE__ */ new WeakMap();
var whichUsed$2 = /* @__PURE__ */ new WeakMap();
var DescriptionEdit = ({ object, key, parts }) => {
	if (!key && !parts) return {
		block: null,
		saveEvent: () => {}
	};
	if (parts != null && (!isObservable(parts) || !Array.isArray(parts))) parts = observe(!Array.isArray(parts) ? [parts] : parts);
	parts ??= observe([]);
	const loadIfNotExists = () => {
		if (key != null && object?.[key] != null && parts?.length <= 0) if (Array.isArray(object[key])) parts?.push(...object[key].map((item) => {
			if (typeof item == "object" && (item != null || "value" in item)) return item.value;
			else return String(item);
		}));
		else if (typeof object[key] == "object" && (object[key] != null || "value" in object[key])) parts?.push(object[key].value);
		else parts?.push(object[key]);
	};
	loadIfNotExists();
	const onChangeEv = (ev) => {
		saveEvent(ev.target.value, parseInt(ev.target.dataset.index ?? "-1"));
	};
	const $partRender = (part, index) => {
		if (index < 0 || index == null || typeof index != "number" || part == null) return;
		const refByIndex = part;
		return H`<div class="descriptor-edit-part" data-index=${index} style=${{
			order: index,
			"--index": index
		}}><textarea name=${"part-" + index} on:change=${onChangeEv} prop:value=${refByIndex}></textarea></div>`;
	};
	const block = H`<div class="descriptor-edit">
        <div class="descriptor-edit-parts">${M(parts, $partRender)}</div>
        <button type="button" on:click=${(ev) => addPartEvent?.()}>Add Part</button>
    </div>`;
	const saveEvent = (value, index) => {
		if (typeof value == "object" && (value != null || "value" in value)) value = value.value;
		else if (typeof value == "object" && value != null) value = JSOX.stringify(value);
		console.log("saveEvent", value, index);
		if (index !== -1 && Array.isArray(parts)) {
			if (typeof parts[index] == "string") parts[index] = value;
			if (typeof parts[index] == "object" && (parts[index] != null || "value" in parts[index])) parts[index].value = value;
		} else if (!Array.isArray(parts)) {
			if (typeof parts == "object" && (parts != null || "value" in parts)) parts.value = value;
			else if (key != null) object[key] = value;
		}
	};
	const addPartEvent = () => {
		parts.push("");
	};
	block?.addEventListener("click", (ev) => {
		if (ev.target.tagName == "TEXTAREA") saveEvent(ev.target.value, parseInt(ev.target.dataset.index ?? "-1"));
	});
	whichUsed$2.set(block, {
		key: key ?? "",
		object
	});
	editBindings$2.set(object, {
		key: key ?? "",
		field: new WeakRef(block)
	});
	return {
		block,
		saveEvent,
		addPartEvent
	};
};
//#endregion
//#region shared/fest/fl-ui/ui/items/editor/InputListEdit.ts
var editBindings$1 = /* @__PURE__ */ new WeakMap();
var whichUsed$1 = /* @__PURE__ */ new WeakMap();
var HTMLInputTypeByVirtualType = /* @__PURE__ */ new Map();
HTMLInputTypeByVirtualType.set("phone", "tel");
HTMLInputTypeByVirtualType.set("email", "email");
HTMLInputTypeByVirtualType.set("url", "url");
var formattingRegistry = /* @__PURE__ */ new Map();
var formatPhoneString = (phone) => {
	return phone?.replace?.(/\+7/g, "8")?.replace?.(/\s+/g, "")?.replace?.(/[^0-9]/g, "");
};
var formatEmailString = (email) => {
	return email?.trim?.();
};
var formatUrlString = (url) => {
	return url?.trim?.();
};
formattingRegistry.set("phone", formatPhoneString);
formattingRegistry.set("email", formatEmailString);
formattingRegistry.set("url", formatUrlString);
var URL_BY_TYPE = (value, description) => {
	switch (description?.type ?? "text") {
		case "phone": return `tel:${value}`;
		case "email": return `mailto:${value}`;
		case "url": return value;
	}
	return `https://${value}`;
};
var IS_URL = (value) => {
	if (canParseURL(value?.trim?.() || "")) return true;
	return value.startsWith("http") || value.startsWith("//") || value.startsWith("www.") || value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("https:") || value.startsWith("ftp:") || value.startsWith("file:") || value.startsWith("data:");
};
var FORMAT_AS_URL = (value, description) => {
	const un_url = (description?.format ?? formattingRegistry.get(description?.type ?? "text"))?.(value) ?? value;
	return IS_URL(un_url) ? un_url : URL_BY_TYPE(un_url, description);
};
var InputListEdit = ({ object, key, parts }, description) => {
	if (!key && !parts) return {
		block: null,
		saveEvent: () => {}
	};
	if (parts != null && (!isObservable(parts) || !Array.isArray(parts))) parts = observe(!Array.isArray(parts) ? [parts] : parts);
	parts ??= observe([]);
	const ars = parts;
	description ??= {
		label: "Part",
		type: "text"
	};
	const loadIfNotExists = () => {
		if (key != null && object?.[key] != null && ars?.length <= 0) if (Array.isArray(object[key])) ars?.push(...object[key].map((item) => {
			if (typeof item == "object" && (item != null || "value" in item)) return item.value;
			else return String(item);
		}));
		else if (typeof object[key] == "object" && (object[key] != null || "value" in object[key])) ars?.push(object[key].value);
		else ars?.push(object[key]);
	};
	loadIfNotExists();
	const onChangeEv = (ev) => {
		const rawValue = ev.target.value;
		saveEvent((description?.format ?? formattingRegistry.get(description?.type ?? "text"))?.(rawValue) ?? rawValue, parseInt(ev.target.dataset.index ?? "-1"));
	};
	const onPreviewEv = (ev) => {
		if (ev.target.tagName == "A") ev.target.href = FORMAT_AS_URL(ars[parseInt(ev.target.dataset.index ?? "-1") ?? 0], description);
	};
	const onCheckboxEv = (ev) => {
		if (ev.target.type === "checkbox") {
			const partContainer = ev.target.closest(".field-list-edit-part");
			if (partContainer) partContainer.toggleAttribute("data-show-preview", ev.target.checked);
		}
	};
	const addPartEvent = () => {
		ars.push("");
	};
	const removePartEvent = (index) => {
		if (index >= 0 && index < ars.length) ars.splice(index, 1);
	};
	const $partRender = (part, index) => {
		const refByIndex = propRef(ars, index);
		if (index < 0 || index == null || typeof index != "number" || part == null) return;
		const partName = "part-" + index;
		const block = H`<div class="field-list-edit-part" data-index=${index} style=${{
			order: index,
			"--index": index
		}}>
            <input
                autocomplete="off"
                name=${partName}
                type=${HTMLInputTypeByVirtualType.get(description?.type ?? "text") ?? "text"}
                data-index=${index}
                data-format=${description?.type ?? "text"}
                on:change=${onChangeEv}
                prop:value=${(description?.format ?? formattingRegistry.get(description?.type ?? "text"))?.(part) ?? part}
            ></input>

            <button data-type="remove" data-index="${index}" type="button">x</button>
            <input type="checkbox" name=${"show-part-" + index} on:change=${onCheckboxEv} data-index=${index} data-type="show-password-or-url"></input>
            <label aria-hidden="true" for=${"part-" + index}>${description?.label ?? "Part"}</label>
            <a aria-hidden="true" ref=${aRefEl} on:click=${onPreviewEv} data-type="preview" data-index=${index} href=${computed(refByIndex, (v) => FORMAT_AS_URL(v, description))} target="_blank">${refByIndex}</a>

        </div>`;
		block?.querySelector?.("button")?.addEventListener?.("click", (ev) => {
			removePartEvent(parseInt(ev.target.dataset.index ?? "-1"));
		});
		return block;
	};
	const aRefEl = Q(($a) => $a);
	const block = H`<div class="field-list-edit" data-type=${description?.type ?? "text"}>
        <div class="field-list-edit-parts">${M(parts, $partRender)}</div>
        <button data-type="add" type="button" on:click=${(ev) => addPartEvent?.()}>Add ${description?.label ?? "Part"}</button>
    </div>`;
	const saveEvent = (value, index) => {
		if (typeof value == "object" && (value != null || "value" in value)) value = value.value;
		else if (typeof value == "object" && value != null) value = JSOX.stringify(value);
		console.log("saveEvent", value, index);
		if (index !== -1 && (Array.isArray(parts) || parts instanceof Set)) {
			if (typeof ars[index] == "string") ars[index] = value;
			if (typeof ars[index] == "object" && ars != null && (ars[index] != null || "value" in ars?.[index])) ars[index].value = value;
		} else if (!Array.isArray(parts) && !(parts instanceof Set)) {
			if (typeof parts == "object" && (parts != null || "value" in parts)) parts.value = value;
			else if (key != null) object[key] = value;
		}
	};
	whichUsed$1.set(block, {
		key: key ?? "",
		object
	});
	editBindings$1.set(object, {
		key: key ?? "",
		field: new WeakRef(block)
	});
	return {
		block,
		saveEvent
	};
};
//#endregion
//#region shared/fest/fl-ui/ui/items/editor/SelectEdit.ts
var editBindings = /* @__PURE__ */ new WeakMap();
var whichUsed = /* @__PURE__ */ new WeakMap();
var SelectEdit = ({ object, key }, config) => {
	if (!key || !object) return {
		block: null,
		saveEvent: () => {}
	};
	const { options = [], label = "Select", required = false, placeholder } = config;
	if (!options || options.length === 0) {
		console.warn(`SelectEdit: No options provided for field "${key}"`);
		return {
			block: null,
			saveEvent: () => {}
		};
	}
	const selectRef = Q(($select) => $select);
	const initialValue = object[key] || options[0]?.value || "";
	const fieldValue = stringRef(initialValue);
	const block = H`<div class="modal-field" data-key=${key} data-type="select">
        <label class="label" for=${key}>${label}${required ? " *" : ""}</label>
        <select
            ref=${selectRef}
            name=${key}
            prop:value=${fieldValue}
            id=${key}
            data-required=${required}
        >
            ${placeholder ? H`<option value="" disabled>${placeholder}</option>` : null}
            ${M(options, (opt) => H`<option value=${opt.value} selected=${opt.value === initialValue}>${opt.label}</option>`)}
        </select>
    </div>`;
	const saveEvent = () => {
		if (selectRef && object && key) object[key] = selectRef.value;
	};
	selectRef?.addEventListener("change", (ev) => {
		saveEvent();
		fieldValue.value = selectRef.value;
	});
	whichUsed.set(block, {
		key,
		object
	});
	editBindings.set(object, {
		key,
		field: new WeakRef(block)
	});
	return {
		block,
		saveEvent
	};
};
//#endregion
//#region shared/fest/fl-ui/ui/items/editor/EntityEdit.ts
var objectExcludeNotExists = (object) => {
	if (!object) return object;
	if (typeof object == "object" || typeof object == "function") return Object.fromEntries([...Object.entries(object)].filter(([key, value]) => value !== null && value !== void 0));
	return object;
};
var makePath = (entityItem, entityDesc) => {
	const fileId = entityItem?.id || entityItem?.name;
	return entityItem?.__path || `${entityDesc.DIR}${(fileId || entityItem?.title)?.toString?.()?.toLowerCase?.()?.replace?.(/\s+/g, "-")?.replace?.(/[^a-z0-9_\-+#&]/g, "-")}.json`;
};
var GENERAL_FIELDS = [
	{
		key: "id",
		label: "ID",
		type: "text",
		required: true
	},
	{
		key: "description",
		label: "Description",
		type: "textarea",
		multiline: true
	},
	{
		key: "title",
		label: "Title",
		type: "text"
	},
	{
		key: "name",
		label: "Name",
		type: "text"
	},
	{
		key: "tags",
		label: "Tags",
		type: "tags"
	}
];
var PROPERTIES_FIELD_CONFIGS_BY_TYPE = {
	task: [
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "pending",
					label: "Pending"
				},
				{
					value: "in-progress",
					label: "In Progress"
				},
				{
					value: "completed",
					label: "Completed"
				},
				{
					value: "cancelled",
					label: "Cancelled"
				},
				{
					value: "on-hold",
					label: "On Hold"
				}
			]
		},
		{
			key: "begin_time",
			label: "Begin Time",
			type: "date"
		},
		{
			key: "end_time",
			label: "End Time",
			type: "date"
		},
		{
			key: "location",
			label: "Location",
			type: "text"
		},
		{
			key: "contacts",
			label: "Contacts",
			type: "contacts"
		}
	],
	event: [
		{
			key: "begin_time",
			label: "Begin Time",
			type: "date"
		},
		{
			key: "end_time",
			label: "End Time",
			type: "date"
		},
		{
			key: "location",
			label: "Location",
			type: "text"
		},
		{
			key: "contacts",
			label: "Contacts",
			type: "contacts"
		}
	],
	person: [
		{
			key: "home",
			label: "Home",
			type: "text"
		},
		{
			key: "biography",
			label: "Biography",
			type: "textarea",
			multiline: true
		},
		{
			key: "contacts",
			label: "Contacts",
			type: "contacts"
		}
	],
	service: [{
		key: "location",
		label: "Location",
		type: "text"
	}, {
		key: "contacts",
		label: "Contacts",
		type: "contacts"
	}],
	item: [{
		key: "price",
		label: "Price",
		type: "number"
	}, {
		key: "quantity",
		label: "Quantity",
		type: "number"
	}],
	skill: [{
		key: "level",
		label: "Level",
		type: "text"
	}]
};
var getFieldsForType = (type) => {
	return PROPERTIES_FIELD_CONFIGS_BY_TYPE[type];
};
var validateField = (value, config) => {
	if (config.required && (!value || typeof value === "string" && !value.trim())) return false;
	return true;
};
var createFieldElement = (entityItem, config) => {
	const key = config.key;
	if (config.type === "date") return DateEntryEdit({
		object: entityItem,
		key
	});
	if (config.type === "textarea" || config.key === "description") return DescriptionEdit({
		object: entityItem,
		key
	});
	if (config.type === "phone" || config.type === "email" || config.type === "url") return InputListEdit({
		object: entityItem,
		key
	}, {
		label: config.label,
		type: config.type
	});
	if (config.type === "tags") {
		entityItem[key] = entityItem[key] || [];
		return InputListEdit({
			object: entityItem,
			key,
			parts: entityItem[key]
		}, {
			label: "Tag",
			type: "text"
		});
	}
	if (config.type === "contacts") {
		entityItem[key] = entityItem[key] || {};
		const contactsObj = entityItem[key];
		contactsObj.email = contactsObj.email || [];
		contactsObj.phone = contactsObj.phone || [];
		contactsObj.links = contactsObj.links || [];
		const emailEditor = InputListEdit({
			object: contactsObj,
			key: "email",
			parts: contactsObj.email
		}, {
			label: "Email",
			type: "email"
		});
		const phoneEditor = InputListEdit({
			object: contactsObj,
			key: "phone",
			parts: contactsObj.phone
		}, {
			label: "Phone",
			type: "phone"
		});
		const linksEditor = InputListEdit({
			object: contactsObj,
			key: "links",
			parts: contactsObj.links
		}, {
			label: "Link",
			type: "url"
		});
		return {
			block: H`<div class="modal-field modal-field-contacts" data-key=${key}>
            <label class="label">${config.label}</label>
            <div class="contacts-group">
                ${emailEditor.block}
                ${phoneEditor.block}
                ${linksEditor.block}
            </div>
        </div>`,
			saveEvent: null
		};
	}
	if (config.type === "select" && config.options) return SelectEdit({
		object: entityItem,
		key
	}, {
		options: config.options,
		label: config.label,
		required: config.required
	});
	const inputRef = Q(($input) => $input);
	const fieldValue = stringRef(entityItem[key] || "");
	const inputType = config.type === "number" ? "number" : "text";
	const block = H`<div class="modal-field" data-key=${key}>
        <label class="label" for=${key}>${config.label}${config.required ? " *" : ""}</label>
        <input
            ref=${inputRef}
            type=${inputType}
            name=${key}
            prop:value=${fieldValue}
            data-multiline=${config.multiline ? "true" : "false"}
            id=${key}
        />
    </div>`;
	const saveEvent = () => {
		entityItem[key] = config.type === "number" ? Number(inputRef.value) : inputRef.value;
	};
	inputRef?.addEventListener("change", saveEvent);
	inputRef?.addEventListener("input", saveEvent);
	return {
		block,
		saveEvent
	};
};
var makeEntityEdit = async (entityItem, entityDesc, options = {}) => {
	const editableEntity = { ...entityItem };
	const editableEntityProperties = { ...entityItem.properties };
	if (options.autoGenerateId && !editableEntity.id) editableEntity.id = generateEntityId(editableEntity.type || entityDesc.type);
	const propertiesFields = getFieldsForType(entityDesc.type || options.entityType || "task");
	const fieldElements = GENERAL_FIELDS?.map?.((config) => {
		return {
			config,
			...createFieldElement(editableEntity, config)
		};
	}) || [];
	fieldElements.push(...propertiesFields?.map?.((config) => {
		return {
			config,
			...createFieldElement(editableEntityProperties, config)
		};
	}) || []);
	const backdropRef = Q(($backdrop) => $backdrop);
	const modalFormRef = Q(($form) => $form);
	const validationErrors = observe({});
	const generalFieldEls = fieldElements?.slice?.(0, GENERAL_FIELDS?.length || 0);
	const propertyFieldEls = fieldElements?.slice?.(GENERAL_FIELDS?.length || 0);
	const modalContent = H`<div class="rs-modal-backdrop" ref=${backdropRef}>
        <form class="modal-form" ref=${modalFormRef}>
            <header class="modal-header">
                <h2 class="modal-title">Edit ${entityDesc.label || "Entity"}</h2>
                ${options.description ? H`<p class="modal-description">${options.description}</p>` : null}
            </header>

            <div class="modal-fields">
                <section class="modal-section">
                    <h3 class="modal-section-title">General Information</h3>
                    <div class="modal-section-fields">
                        ${M(generalFieldEls, (fieldEl) => fieldEl.block)}
                    </div>
                </section>

                ${propertyFieldEls?.length > 0 ? H`<section class="modal-section">
                    <h3 class="modal-section-title">${entityDesc.label || "Entity"} Details</h3>
                    <div class="modal-section-fields">
                        ${M(propertyFieldEls, (fieldEl) => fieldEl.block)}
                    </div>
                </section>` : null}
            </div>

            <footer class="modal-actions">
                <div class="modal-actions-left">
                    <button type="button" class="btn cancel" data-action="cancel">Cancel</button>
                </div>
                <div class="modal-actions-right">
                    <button type="button" class="btn save" data-action="save">${options.submitLabel || "Save"}</button>
                </div>
            </footer>
        </form>
    </div>`;
	document.body.appendChild(modalContent);
	modalFormRef?.addEventListener("submit", (ev) => {
		ev.preventDefault();
	});
	return new Promise((resolve, reject) => {
		const handleSave = async (ev) => {
			ev?.preventDefault();
			let isValid = true;
			for (const { config } of fieldElements) if (!validateField(editableEntity[config.key], config)) {
				validationErrors[config.key] = `${config.label} is required`;
				isValid = false;
			}
			if (!isValid) {
				console.warn("Validation errors:", validationErrors);
				return;
			}
			for (const { saveEvent } of fieldElements) try {
				if (saveEvent) saveEvent();
			} catch (e) {
				console.debug("Field auto-save handled:", e);
			}
			editableEntity.properties = objectExcludeNotExists(editableEntityProperties);
			try {
				await writeFile(null, makePath(editableEntity, entityDesc), JSOX.stringify(editableEntity, void 0, 2));
				Object.assign(entityItem, editableEntity);
				modalContent?.remove();
				resolve(editableEntity);
			} catch (error) {
				console.error("Failed to save entity:", error);
				reject(error);
			}
		};
		const handleCancel = () => {
			modalContent?.remove();
			resolve(null);
		};
		modalContent?.addEventListener("click", (ev) => {
			const target = ev.target;
			const closestEl = target?.closest?.("[data-action]");
			const action = target?.dataset?.action || closestEl?.dataset?.action;
			if (action === "save") handleSave();
			else if (action === "cancel") handleCancel();
		});
		backdropRef?.addEventListener("click", (ev) => {
			if (ev.target === backdropRef) handleCancel();
		});
		const handleEscape = (ev) => {
			if (ev.key === "Escape") {
				handleCancel();
				document.removeEventListener("keydown", handleEscape);
			}
		};
		document.addEventListener("keydown", handleEscape);
	});
};
//#endregion
//#region src/core/storage/FileOps.ts
/**
* UI-facing filesystem operations.
*
* These helpers connect browser picker/clipboard/drop interactions with the
* higher-level storage and recognition pipelines so views do not have to know
* about OPFS handles or import-heavy recognition modules directly.
*/
var analyzeRecognizeUnifiedRef = null;
var getAnalyzeRecognizeUnified = async () => {
	if (!analyzeRecognizeUnifiedRef) analyzeRecognizeUnifiedRef = (await import("./service27.js").then((n) => n.t)).analyzeRecognizeUnified;
	return analyzeRecognizeUnifiedRef;
};
var clipboardRw = null;
var getClipboardRw = async () => {
	if (!clipboardRw) {
		const m = await import("../core/clipboard.js").then((n) => n.t);
		clipboardRw = {
			readText: m.readText,
			writeText: m.writeText
		};
	}
	return clipboardRw;
};
/** Open a native file picker and write the selected files into the target directory. */
var openPickerAndWrite = async (dir, accept = "*/*", multiple = true) => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = accept;
	input.multiple = multiple;
	return await new Promise((resolve) => {
		input.onchange = async () => {
			dir = dir?.trim?.();
			dir = dir?.endsWith?.("/") ? dir : dir + "/";
			try {
				resolve(await writeFilesToDir(dir, input.files || []));
			} catch {
				resolve(0);
			}
		};
		input.click();
	});
};
/** Open a picker and route the selected files into the analyze pipeline. */
var openPickerAndAnalyze = async (dir, accept = "*/*", multiple = true) => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = accept;
	input.multiple = multiple;
	return await new Promise((resolve) => {
		input.onchange = async () => {
			dir = dir?.trim?.();
			dir = dir?.endsWith?.("/") ? dir : dir + "/";
			try {
				resolve(await handleDataTransferFiles(input.files || [], postCommitAnalyze));
			} catch {
				resolve();
			}
		};
		input.click();
	});
};
/** Download a file that already exists in OPFS by path. */
var downloadByPath = async (path, suggestedName) => {
	const lastSlash = path.lastIndexOf("/");
	const dir = path.slice(0, Math.max(0, lastSlash + 1));
	const name = suggestedName || path.slice(lastSlash + 1);
	const file = await (await (await getDirectoryHandle(null, dir)).getFileHandle(name, { create: false })).getFile();
	const url = URL.createObjectURL(file);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
/** Recognize clipboard content and write the recognized text back to the clipboard. */
var pasteIntoClipboardWithRecognize = async () => {
	try {
		const analyzeRecognizeUnified = await getAnalyzeRecognizeUnified();
		const { readText, writeText } = await getClipboardRw();
		if (typeof navigator !== "undefined" && navigator.clipboard?.read) {
			const items = await navigator.clipboard.read();
			for (const item of items) for (const type of item.types) {
				const blob = await item.getType(type);
				if (blob) {
					const data = await analyzeRecognizeUnified(blob)?.then?.((res) => res?.data)?.catch?.(console.warn.bind(console));
					if (data) return (await writeText(data)).ok;
				}
			}
		}
		const readResult = await readText();
		const text = readResult.ok ? String(readResult.data || "").trim() : "";
		if (text) {
			const data = await analyzeRecognizeUnified(text)?.then?.((res) => res?.data)?.catch?.(console.warn.bind(console));
			if (data) return (await writeText(data)).ok;
		}
	} catch (e) {
		console.warn(e);
		return false;
	}
};
var pasteAndAnalyze = async () => {
	try {
		const { readText } = await getClipboardRw();
		if (typeof navigator !== "undefined" && navigator.clipboard?.read) {
			const items = await navigator.clipboard.read();
			for (const item of items) for (const type of item.types) {
				const blob = await item.getType(type);
				if (blob) {
					if (await postCommitAnalyze({ file: blob })?.then?.((res) => res?.data)?.catch?.(console.warn.bind(console))) return true;
				}
			}
		}
		const readResult = await readText();
		const text = readResult.ok ? String(readResult.data || "").trim() : "";
		if (text) {
			if (await postCommitAnalyze({ text })?.then?.((res) => res?.data)?.catch?.(console.warn.bind(console))) return true;
		}
	} catch (e) {
		console.warn(e);
		return false;
	}
	return false;
};
//#endregion
//#region src/core/utils/Actions.ts
var SERVICE_UUID = "12345678-1234-5678-1234-5678abcdef01";
var CHAR_UUID = "12345678-1234-5678-1234-5678abcdef02";
var characteristic;
async function connect() {
	characteristic = await (await (await (await navigator?.bluetooth?.requestDevice?.({ filters: [{ services: [SERVICE_UUID] }] })?.catch?.(console.warn.bind(console)))?.gatt?.connect?.()?.catch?.(console.warn.bind(console)))?.getPrimaryService?.(SERVICE_UUID)?.catch?.(console.warn.bind(console)))?.getCharacteristic?.(CHAR_UUID)?.catch?.(console.warn.bind(console));
	return characteristic;
}
async function startListening() {
	characteristic ??= await connect()?.catch?.(console.warn.bind(console)) ?? characteristic;
	characteristic?.addEventListener?.("characteristicvaluechanged", async (event) => {
		const value = event?.target?.value;
		const result = await writeText(new TextDecoder().decode(value.buffer));
		if (!result.ok) console.error("Clipboard write failed:", result.error);
	});
	await characteristic?.startNotifications?.();
	return true;
}
var whenPasteInto = async () => {
	if (!characteristic) await connect();
	const result = await readText();
	if (result.ok && result.data) {
		const data = new TextEncoder().encode(String(result.data));
		await characteristic?.writeValue?.(data);
	}
};
/** Visual icon mapping for action ids rendered by shortcut and entity UIs. */
var iconsPerAction = new Map([
	["bluetooth-enable-acceptance", "bluetooth"],
	["bluetooth-share-clipboard", "bluetooth"],
	["share-clipboard", "share"],
	["add", "file-plus"],
	["upload", "cube-focus"],
	["generate", "magic-wand"],
	["record-speech-recognition", "microphone"],
	["debug-gen", "bug"],
	["paste-and-recognize", "asterisk"],
	["paste-and-analyze", "clipboard"],
	["snip-and-recognize", "crop"],
	["file-refresh", "arrows-clockwise"],
	["file-mount", "screwdriver"],
	["file-download", "download"],
	["file-upload", "upload"],
	["apply-settings", "gear-six"],
	["import-settings", "upload-simple"],
	["export-settings", "download-simple"],
	["open-link", "arrow-square-out"],
	["copy-link", "link"],
	["copy-state-desc", "file-code"],
	["open-view", "compass"]
]);
/** Human-facing labels derived from action ids and optional entity metadata. */
var labelsPerAction = new Map([
	["bluetooth-enable-acceptance", () => "Enable Bluetooth acceptance"],
	["bluetooth-share-clipboard", () => "Paste data into Bluetooth"],
	["share-clipboard", () => "Share clipboard"],
	["file-upload", (entityDesc) => `Upload file`],
	["file-download", (entityDesc) => `Download file`],
	["file-mount", (entityDesc) => `Mount directory`],
	["file-refresh", (entityDesc) => `Refresh`],
	["add", (entityDesc) => `Add ${entityDesc.label}`],
	["upload", (entityDesc) => `Upload and recognize`],
	["generate", (entityDesc) => `Generate ${entityDesc.label}`],
	["record-speech-recognition", (entityDesc) => `Record speech recognition`],
	["debug-gen", (entityDesc) => `Generate debug tasks for ${entityDesc.label}`],
	["paste-and-analyze", (entityDesc) => "Paste and analyze"],
	["paste-and-recognize", (entityDesc) => "Recognize from/to clipboard"],
	["snip-and-recognize", (entityDesc) => "Snip and recognize"],
	["apply-settings", (entityDesc) => "Save settings"],
	["import-settings", () => "Import settings"],
	["export-settings", () => "Export settings"],
	["open-link", (entityDesc) => entityDesc?.label ? `Open ${entityDesc.label}` : "Open link"],
	["copy-link", () => "Copy link"],
	["copy-state-desc", () => "Copy shortcut JSON"],
	["open-view", (entityDesc) => `Open ${entityDesc?.label || "view"}`]
]);
/** Unified clipboard copy helper with API/fallback handling. */
var copyTextToClipboard = async (text) => {
	if (!text?.length) throw new Error("empty");
	const result = await writeText(text);
	if (!result.ok) throw new Error(result.error || "clipboard write failed");
	return true;
};
var ensureHashNavigation = (view, viewMaker, props) => {
	if (!view || typeof window === "undefined") return;
	if (viewMaker) viewMaker?.(view, props);
	else {
		const hash = `#${view?.replace?.(/^#/, "") ?? view}`;
		if (location.hash !== hash) navigate(hash);
	}
};
/** Use the Web Share API when the current browser/runtime supports the supplied payload. */
var clientShare = async (data) => {
	if (navigator?.canShare) return navigator?.canShare?.(data) ? navigator?.share?.(data) : false;
	return false;
};
Promise.try(async () => {
	if (!(typeof SpeechRecognition != "undefined" ? new SpeechRecognition() : null)) {
		showError("Speech recognition is not supported by this browser");
		return null;
	}
	let diagnostic = "";
	SpeechRecognition?.available?.({ langs: [navigator.language] })?.then?.((result) => {
		if (result === "unavailable") diagnostic = `${navigator.language} not available to download at this time. Sorry!`;
		else if (result === "available") console.log("Ready to receive a color command.");
		else {
			diagnostic = `${navigator.language} language pack downloading`;
			SpeechRecognition?.install?.({ langs: [navigator.language] })?.then?.((result) => {
				if (result) diagnostic = `${navigator.language} language pack downloaded. Try again.`;
				else diagnostic = `${navigator.language} language pack failed to download. Try again later.`;
				console.log(diagnostic);
			})?.catch?.(console.warn.bind(console));
		}
		console.log(diagnostic);
	});
});
/** Start speech recognition and return the final recognized text when available. */
var recordSpeechRecognition = async (userInputHoldUntilStop = true) => {
	const recognition = typeof SpeechRecognition != "undefined" ? new SpeechRecognition() : null;
	if (!recognition) {
		showError("Speech recognition is not supported by this browser");
		return null;
	}
	recognition.lang = (await loadSettings())?.speech?.language || navigator?.language || "ru-RU";
	recognition.interimResults = false;
	recognition.continuous = true;
	recognition.alterations = .8;
	recognition.maxAlternatives = 1;
	const promised = Promise.withResolvers();
	const writingRef = stringRef("");
	let prepare = [];
	recognition.onresult = (event) => {
		prepare.push(event.results[0][0].transcript);
	};
	recognition.onend = () => {
		const result = prepare?.join?.(" ")?.trim?.();
		writingRef.value = result?.split?.(/\s+/)?.length >= 2 ? result : "";
		console.log("writingRef.value", writingRef.value);
		console.log("prepare", prepare);
		promised.resolve(writingRef.value);
	};
	recognition.onerror = (event) => {
		promised.reject(event.error);
	};
	const endOnPointerEnd = () => {
		if (!userInputHoldUntilStop) return;
		recognition.stop()?.catch?.(console.warn.bind(console));
	};
	document.addEventListener("pointerup", endOnPointerEnd, {
		once: true,
		capture: false
	});
	document.addEventListener("pointercancel", endOnPointerEnd, {
		once: true,
		capture: false
	});
	recognition.start()?.catch?.(console.warn.bind(console));
	return {
		stop() {
			recognition.stop();
		},
		writing: writingRef.value,
		recognized: promised.promise,
		promise: promised.promise
	};
};
var lastSpeechRecogTime = 0;
function isSameOrigin(url) {
	return new URL(url, globalThis?.location?.href).origin === globalThis?.location?.origin;
}
var throttleToRun = (cb, timeout = 1e3) => {
	let lastTime = 0;
	return async (...args) => {
		const now = Date.now();
		if (now - lastTime > timeout) {
			lastTime = now;
			return await cb(...args);
		}
		return null;
	};
};
var actionRegistry = new Map([
	["bluetooth-enable-acceptance", async () => {
		try {
			await startListening()?.catch?.(console.warn.bind(console));
		} catch (e) {
			console.warn(e);
			showError("Failed to enable Bluetooth acceptance");
		}
	}],
	["bluetooth-share-clipboard", async () => {
		try {
			await whenPasteInto()?.catch?.(console.warn.bind(console));
			showSuccess("Pasted data into Bluetooth");
		} catch (e) {
			console.warn(e);
			showError("Failed to paste from Bluetooth");
		}
	}],
	["paste-and-recognize", async () => {
		try {
			if (!await pasteIntoClipboardWithRecognize()?.catch?.(console.warn.bind(console))) {
				showError("Failed to paste for recognition");
				return false;
			}
			showSuccess("Pasted data for recognition");
			return true;
		} catch (e) {
			console.warn(e);
			showError("Failed to paste for recognition");
			return false;
		}
	}],
	["share-clipboard", async () => {
		const items = await navigator?.clipboard?.read?.()?.catch?.(console.warn.bind(console));
		let fileToShare = null;
		if (!items?.length) {
			fileToShare = await navigator?.clipboard?.readText?.()?.catch?.(console.warn.bind(console));
			if (!fileToShare) {
				showError("Clipboard is empty.");
				return false;
			}
		}
		let multipleFiles = [];
		for (const item of items || []) {
			if (fileToShare) break;
			for (const type of item?.types || []) if (type === "image/png" || type === "image/jpeg") {
				const file = await item?.getType?.(type)?.catch?.(console.warn.bind(console));
				if (file && (file instanceof File || file instanceof Blob)) multipleFiles.push(file instanceof File ? file : new File([file], `clipboard-image-${Date.now()}.${type.split("/")[1]}`, { type: file.type }));
				break;
			}
		}
		if (!multipleFiles?.length && !fileToShare) {
			fileToShare = await navigator?.clipboard?.readText?.()?.catch?.(console.warn.bind(console));
			if (!fileToShare) {
				showError("Clipboard is empty.");
				return false;
			}
		}
		if (!navigator?.canShare) {
			showError("This browser cannot share files via Web Share API.");
			return false;
		}
		if (multipleFiles?.length && navigator?.canShare?.({ files: multipleFiles })) return clientShare({
			title: "Shared by CW from clipboard...",
			files: multipleFiles
		})?.catch?.(console.warn.bind(console));
		else if (fileToShare) if (fileToShare instanceof URL || canParseURL(fileToShare?.trim?.() || "")) return clientShare({ url: fileToShare?.href ?? fileToShare })?.catch?.(console.warn.bind(console));
		else return clientShare({ text: fileToShare })?.catch?.(console.warn.bind(console));
	}],
	["apply-settings", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const forms = viewPage.forms;
		const tabsState = viewPage.tabsState;
		if (forms) forms.get(tabsState.value)?.requestSubmit?.();
	}],
	["export-settings", async () => {
		try {
			const settings = await loadSettings();
			const blob = new Blob([JSOX.stringify(settings)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `crossword-settings-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1e3);
			showSuccess("Settings exported");
		} catch (e) {
			console.warn(e);
			showError("Failed to export settings");
		}
	}],
	["import-settings", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			try {
				const text = await file.text();
				const json = JSOX.parse(text);
				if (typeof json !== "object") throw new Error("Invalid JSON");
				await saveSettings(json);
				if (viewPage && viewPage.reloadSettings) await viewPage.reloadSettings(json);
				else showSuccess("Settings imported (reload required)");
			} catch (e) {
				console.warn(e);
				showError("Failed to import settings");
			}
		};
		input.click();
	}],
	["open-link", throttleToRun(async (context, entityDesc) => {
		const item = context?.items?.find?.((item) => item?.id === context?.id) || null;
		const href = (item?.meta || context?.meta?.get?.(item?.id || context?.id) || null)?.href || item?.href || context?.shortcut?.href || context?.href;
		if (!href) {
			showError("Link is missing");
			return;
		}
		const target = isSameOrigin(href) ? "_self" : "_blank";
		try {
			window?.open?.(href, target, "noopener,noreferrer");
		} catch (error) {
			console.warn(error);
			showError("Unable to open link");
		}
	}, 100)],
	["copy-link", async (context, entityDesc) => {
		const item = context?.items?.find?.((item) => item?.id === context?.id) || null;
		const href = (item?.meta || context?.meta?.get?.(item?.id || context?.id) || null)?.href || item?.href || context?.shortcut?.href || context?.href;
		if (!href) {
			showError("Nothing to copy");
			return;
		}
		try {
			await copyTextToClipboard(href);
			showSuccess("Link copied");
		} catch (error) {
			console.warn(error);
			showError("Failed to copy link");
		}
	}],
	["copy-state-desc", async (context) => {
		const snapshot = snapshotSpeedDialItem(context?.items?.find?.((item) => item?.id === context?.id) || null);
		if (!snapshot) {
			showError("Nothing to copy");
			return;
		}
		if (snapshot.desc && snapshot.desc.meta && snapshot.desc.action && !snapshot.desc.meta.action) snapshot.desc.meta.action = snapshot.desc.action;
		try {
			await copyTextToClipboard(JSOX.stringify(snapshot));
			showSuccess("Shortcut saved to clipboard");
		} catch (error) {
			console.warn(error);
			showError("Failed to copy shortcut");
		}
	}],
	["open-view", async (context, entityDesc) => {
		const item = context?.items?.find?.((item) => item?.id === context?.id) || null;
		const targetView = (item?.meta || context?.meta?.get?.(item?.id || context?.id) || null)?.view || entityDesc?.view || entityDesc?.type;
		if (!targetView) {
			showError("No view target");
			return;
		}
		ensureHashNavigation(targetView, context?.viewMaker, context?.meta);
	}],
	["file-upload", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const viewer = viewPage?.querySelector("ui-file-manager");
		openPickerAndWrite(viewer?.path, "text/markdown,text/plain,.md", true)?.then?.(() => {
			showSuccess("Uploaded");
			currentWebDav?.sync?.upload?.();
		}).catch((e) => {
			showError("Upload failed");
			console.warn(e);
		});
	}],
	["file-mount", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const viewer = viewPage?.querySelector("ui-file-manager");
		getDirectoryHandle(null, viewer?.path, { create: true })?.then?.(async () => {
			await mountAsRoot("user", true)?.catch?.(console.warn.bind(console));
			showSuccess("Mounted");
		}).catch((e) => {
			showError("Mount failed");
			console.warn(e);
		});
	}],
	["file-download", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const viewer = viewPage?.querySelector("ui-file-manager");
		downloadByPath(viewer?.path)?.then?.(() => {
			showSuccess("Downloaded");
		}).catch((e) => {
			showError("Download failed");
			console.warn(e);
		});
	}],
	["file-refresh", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		const viewer = viewPage?.querySelector("ui-file-manager");
		currentWebDav?.sync?.download?.(viewer?.path)?.then?.(() => {
			viewer?.loadPath?.(viewer?.path);
			showSuccess("Refreshed");
		}).catch((e) => {
			showError("Refresh failed");
			console.warn(e);
		});
	}],
	["debug-gen", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		try {
			const results = await triggerDebugTaskGeneration(3);
			if (results && results.length > 0) showSuccess(`Generated ${results.length} debug tasks for testing`);
			else showError(`Failed to generate debug tasks`);
		} catch (error) {
			console.warn("Debug task generation failed:", error);
			showError(`Failed to generate debug tasks`);
		}
	}],
	["record-speech-recognition", async (entityItem, entityDesc, viewPage) => {
		if (Date.now() - lastSpeechRecogTime < 1e3) {
			console.warn("Speech recognition throttled");
			return;
		}
		lastSpeechRecogTime = Date.now();
		viewPage = await viewPage;
		const recognition = await recordSpeechRecognition();
		if (!recognition) {
			showError("Failed to record speech recognition");
			return;
		}
		const content = (await recognition.promise?.catch?.(console.warn.bind(console)))?.trim?.() || null;
		try {
			recognition?.stop?.();
		} catch (e) {
			console.warn(e);
		}
		if (content) {
			if (!await generateNewPlan(content)) {
				showError(`Failed to generate ${entityDesc.label}`);
				return;
			}
			showSuccess(`Plan generated...`);
		} else showError("No content to generate");
	}],
	["generate", async (entityItem, entityDesc, viewPage) => {
		setTimeout(async () => {
			if (Date.now() - lastSpeechRecogTime < 1e3) {
				console.warn("Timeline generation throttled");
				return;
			}
			lastSpeechRecogTime = Date.now();
			viewPage = await viewPage;
			if (!await generateNewPlan()) {
				showError(`Failed to generate ${entityDesc.label}`);
				return;
			}
			showSuccess(`Plan generated...`);
		}, 100);
	}],
	["add", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		try {
			const result = await makeEntityEdit(entityItem, entityDesc, {
				allowLinks: true,
				entityType: entityDesc.type,
				description: `Describe the ${entityDesc.label} and link related entities (actions, bonuses, etc.).`
			});
			if (!result) return;
			const fname = (`${entityDesc.type}-${crypto.randomUUID()}`.replace(/\s+/g, "-").toLowerCase() || entityDesc.type || "unknown")?.toString?.()?.toLowerCase?.()?.replace?.(/\s+/g, "-")?.replace?.(/[^a-z0-9_\-+#&]/g, "-")?.trim?.()?.replace?.(/\/\/+/g, "/")?.replace?.(/\/$/, "");
			const path = `${entityDesc.DIR || "/"}${fname}.json`.trim()?.replace?.(/\/\/+/g, "/")?.replace?.(/\/$/, "");
			result.__path = path;
			await writeFileSmart(null, path, new File([JSOX.stringify(result)], `${fname}.json`.trim()?.replace?.(/\/\/+/g, "/")?.replace?.(/\/$/, ""), { type: "application/json" }), {
				ensureJson: true,
				sanitize: true
			});
			showSuccess(`${entityDesc.label} saved`);
		} catch (e) {
			console.warn(e);
			showError(`Failed to save ${entityDesc.label}`);
		}
	}],
	["upload", async (entityItem, entityDesc, viewPage) => {
		viewPage = await viewPage;
		try {
			await openPickerAndAnalyze(entityDesc.DIR || "/", "text/markdown,text/plain,.json,image/*", true);
			showSuccess(`${entityDesc.label} uploaded`);
		} catch (e) {
			console.warn(e);
			showError(`Failed to upload ${entityDesc.label}`);
		}
	}],
	["paste-and-analyze", async () => {
		try {
			if (!await pasteAndAnalyze()?.catch?.(console.warn.bind(console))) {
				showError("Failed to paste and recognize");
				return false;
			}
			showSuccess("Pasted data for analyze");
			return true;
		} catch (e) {
			console.warn(e);
			showError("Failed to paste and recognize");
		}
	}],
	["snip-and-recognize", async () => {
		showError("Snip and analyze is not implemented yet");
		return false;
	}]
]);
var registerNavigationActions = () => {
	NAVIGATION_SHORTCUTS.forEach((shortcut) => {
		const actionId = `open-view-${shortcut.view}`;
		if (!iconsPerAction.has(actionId)) iconsPerAction.set(actionId, shortcut.icon);
		if (!labelsPerAction.has(actionId)) labelsPerAction.set(actionId, () => `Open ${shortcut.label}`);
		if (!actionRegistry.has(actionId)) actionRegistry.set(actionId, async (context) => {
			const nextContext = context || {};
			nextContext.meta = {
				...nextContext.meta || {},
				view: shortcut.view
			};
			return actionRegistry.get("open-view")?.(nextContext, {
				label: shortcut.label,
				type: shortcut.view,
				DIR: "/"
			});
		});
	});
};
registerNavigationActions();
//#endregion
export { iconsPerAction as n, labelsPerAction as r, actionRegistry as t };
