import { g as removeAdopted, p as loadAsAdopted } from "../fest/dom.js";
import { c as ref, o as observe } from "../fest/object.js";
import { u as sendMessage } from "./UnifiedMessaging.js";
import { P as H } from "../vendor/jsox.js";
import { t as BUILTIN_AI_MODELS } from "./SettingsTypes.js";
import { n as loadSettings, r as saveSettings } from "./Settings.js";
import { n as applyTheme } from "./Theme.js";
import { i as applyAirpadRuntimeFromAppSettings } from "./config.js";
import { o as navigateToView } from "../shells/boot-index.js";
import { o as SettingsChannelAction } from "./channel-actions.js";
import { n as openAdminDoorFromCore, r as resolveAdminDoorUrls } from "./admin-doors.js";
import { c as updateInstruction, i as deleteInstruction, n as addInstruction, o as getInstructionRegistry, r as addInstructions, s as setActiveInstruction } from "./CustomInstructions.js";
import { t as DEFAULT_INSTRUCTION_TEMPLATES } from "./templates.js";
import { a as setString, t as StorageKeys } from "../com/app2.js";
//#region ../../modules/views/settings-view/src/scss/Settings.scss?inline
var Settings_default = "@layer settings-view{.view-settings{color-scheme:inherit;--sv-bg:var(--color-surface,light-dark(#eef1f6,#0f1318));--sv-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--sv-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--sv-outline:var(--color-outline-variant,light-dark(#c5cdd8,#3d4755));--sv-surface-1:var(--color-surface-container-low,light-dark(#ffffff,#171c24));--sv-surface-2:var(--color-surface-container,light-dark(#f4f6fa,#1c232d));--sv-primary:var(--color-primary,#007acc);--sv-on-primary:var(--color-on-primary,#ffffff);--sv-danger:var(--color-error,#d32f2f);--sv-divider:color-mix(in oklab,var(--sv-outline) 35%,transparent);--sv-ring:color-mix(in oklab,var(--sv-outline) 55%,transparent);--sv-elev:0 2px 14px color-mix(in oklab,var(--sv-fg) 5%,transparent);background-color:var(--sv-bg);block-size:100%;color:var(--sv-fg);display:grid;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;margin:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:clamp(.5rem,2cqi,1rem);text-align:start}.view-settings,.view-settings *,.view-settings :after,.view-settings :before{box-sizing:border-box}.view-settings :where(select,input,textarea,option,button){font-family:inherit;pointer-events:auto}.view-settings textarea{container-type:inline-size;inline-size:100%;max-inline-size:100%;resize:vertical}.view-settings h2,.view-settings h3{color:var(--sv-fg);margin:0;text-align:start}.view-settings h2{font-size:1.25rem;font-weight:700;letter-spacing:-.02em}.view-settings h3{font-size:.94rem;font-weight:600;letter-spacing:-.01em}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;flex-shrink:0;gap:.75rem;min-inline-size:0;padding-block-end:.875rem}.view-settings .settings-screen__title{font-size:clamp(1.05rem,2.5cqi,1.35rem);font-weight:600;letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:1rem;overscroll-behavior:contain;padding-block:.75rem;scrollbar-color:var(--sv-outline) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:99px}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--sv-surface-1) 85%,var(--sv-bg));border-block-start:1px solid var(--sv-divider);box-shadow:0 -10px 28px color-mix(in oklab,var(--sv-fg) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:.5rem;inline-size:stretch;justify-content:flex-start;padding-block:.75rem;padding-inline:.25rem}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:.375rem;inline-size:stretch;max-inline-size:stretch;overflow-x:auto;scrollbar-color:var(--sv-outline) transparent;scrollbar-width:thin}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--sv-surface-2) 94%,transparent);border:none;border-radius:999px;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);color:var(--sv-muted);cursor:pointer;font-size:.75rem;font-weight:500;min-block-size:2.5rem;padding:.5rem .875rem;transition:background-color .12s ease,color .12s ease,box-shadow .12s ease;white-space:nowrap}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--sv-surface-2) 100%,transparent);color:var(--sv-fg)}.view-settings .settings-tab-btn.is-active{background:var(--sv-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 40%,transparent);color:var(--sv-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active{display:flex}.view-settings .card{background:color-mix(in oklab,var(--sv-surface-2) 92%,var(--sv-bg));border:none;border-radius:16px;box-shadow:var(--sv-elev),0 0 0 1px color-mix(in oklab,var(--sv-outline) 14%,transparent);display:flex;flex-direction:column;gap:.75rem;inline-size:stretch;padding:1rem}@container (max-inline-size: 480px){.view-settings .card{border-radius:14px;padding:.875rem}}.view-settings .settings-panel-form{display:flex;flex-direction:column;gap:.75rem;inline-size:stretch}.view-settings .field{display:grid;font-size:.75rem;gap:.375rem;grid-auto-flow:row;inline-size:stretch;margin:0}.view-settings .field>span{color:var(--sv-muted);font-size:.75rem;font-weight:500}.view-settings .field.checkbox{align-items:center;gap:.625rem;grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .field-hint{color:var(--sv-muted);font-size:.85em;line-height:1.45;margin:0 0 .75rem;opacity:.95}.view-settings .form-input,.view-settings .form-select{background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:10px;color:var(--sv-fg);display:block;font-size:.875rem;inline-size:100%;line-height:1.25;min-block-size:2.5rem;outline:none;padding:.5rem .65rem;transition:border-color .12s ease,box-shadow .12s ease}.view-settings .form-input:focus-visible,.view-settings .form-select:focus-visible{border-color:color-mix(in oklab,var(--sv-primary) 55%,var(--sv-outline));box-shadow:0 0 0 3px color-mix(in oklab,var(--sv-primary) 22%,transparent)}.view-settings select.form-input,.view-settings select.form-select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--sv-muted) 50%),linear-gradient(135deg,var(--sv-muted) 50%,transparent 50%);background-position:calc(100% - 14px) calc(50% - 2px),calc(100% - 9px) calc(50% - 2px);background-repeat:no-repeat;background-size:5px 5px;padding-inline-end:2rem}.view-settings .btn{align-items:center;background:color-mix(in oklab,var(--sv-surface-2) 90%,transparent);border:none;border-radius:999px;box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent);color:var(--sv-fg);cursor:pointer;display:inline-flex;font-size:.8125rem;font-weight:500;gap:.35rem;justify-content:center;min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color .12s ease,box-shadow .12s ease,filter .12s ease}.view-settings .btn:hover{background:color-mix(in oklab,var(--sv-fg) 6%,var(--sv-surface-2))}.view-settings .btn.primary{background:var(--sv-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--sv-primary) 26%,transparent),0 0 0 1px color-mix(in oklab,var(--sv-primary) 45%,transparent);color:var(--sv-on-primary)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .btn.btn-sm,.view-settings .btn.small{font-size:.75rem;min-block-size:2rem;padding:.35rem .65rem}.view-settings .btn.btn-danger{background:color-mix(in oklab,var(--sv-danger) 92%,#000);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-danger) 35%,transparent);color:var(--sv-on-primary)}.view-settings .btn.btn-danger:hover{filter:brightness(1.08)}.view-settings .btn.tiny{font-size:.72rem;min-block-size:2rem;padding:.3rem .5rem}.view-settings .ext-note,.view-settings .note{color:var(--sv-muted);display:block;flex:0 1 auto;font-size:.75rem;max-inline-size:100%;opacity:.92;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:nowrap}.view-settings .ext-note{line-height:1.4}.view-settings .ext-note code{background:color-mix(in oklab,var(--sv-surface-2) 80%,var(--sv-bg));border-radius:4px;color:var(--sv-fg);font-size:.68rem;padding:2px 6px}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{accent-color:var(--sv-primary);block-size:1.15rem;flex-shrink:0;inline-size:1.15rem}.view-settings .mcp-section{display:flex;flex-direction:column;gap:.5rem}.view-settings .mcp-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:.5rem}.view-settings .mcp-row{background:color-mix(in oklab,var(--sv-surface-2) 88%,var(--sv-bg));border-radius:12px;box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--sv-outline) 12%,transparent);display:grid;gap:.5rem;padding:.75rem}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--sv-muted);font-size:.75rem;margin:0}.view-settings .settings-spoiler{background:color-mix(in oklab,var(--sv-surface-1) 55%,transparent);border:1px solid color-mix(in oklab,var(--sv-outline) 22%,transparent);border-radius:12px;padding:.25rem .5rem}.view-settings .settings-spoiler summary{color:var(--sv-fg);cursor:pointer;font-size:.8rem;font-weight:600;padding:.35rem .25rem}.view-settings .settings-spoiler .settings-panel-form{padding-block-end:.25rem}.view-settings .view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings .view-settings__section{border-block-end:1px solid var(--sv-divider);display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings .view-settings__section:last-of-type{border-block-end:none}.view-settings .view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings .view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings .view-settings__label>span{font-size:.8125rem;font-weight:500}.view-settings .view-settings__input,.view-settings .view-settings__select{background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 45%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.875rem;min-block-size:2.5rem;padding:.45rem .6rem}.view-settings .view-settings__checkbox{align-items:center;display:flex;font-size:.8125rem;gap:.5rem}.view-settings .view-settings__actions{display:flex;gap:.75rem;margin-block-start:1.5rem}.view-settings .view-settings__btn{background:transparent;border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:8px;color:var(--sv-fg);cursor:pointer;padding:.55rem 1.1rem}.view-settings .view-settings__btn--primary{background:var(--sv-primary);border-color:color-mix(in oklab,var(--sv-primary) 30%,#000);color:var(--sv-on-primary)}.view-settings .view-settings__btn--primary:hover{filter:brightness(1.06)}.view-settings .custom-instructions-editor,.view-settings .custom-instructions-panel{display:flex;flex-direction:column;gap:.75rem}.view-settings .ci-row,.view-settings .cip-select-row{display:flex;flex-direction:column;gap:.35rem}.view-settings .ci-header{margin-block-end:.25rem}.view-settings .ci-header h4{font-size:.88rem;margin:0 0 .25rem}.view-settings .ci-desc{color:var(--sv-muted);font-size:.78rem;line-height:1.45;margin:0}.view-settings .ci-active-select{display:flex;flex-direction:column;gap:.25rem}.view-settings .ci-select,.view-settings .cip-select{background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.8rem;min-block-size:2.35rem;padding:.4rem .55rem}.view-settings .ci-list,.view-settings .cip-list{display:flex;flex-direction:column;gap:.5rem}.view-settings .ci-item,.view-settings .cip-item{background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 16%,transparent);border-radius:12px;padding:.65rem .75rem}.view-settings .ci-item.active,.view-settings .ci-item.is-active,.view-settings .cip-item.active,.view-settings .cip-item.is-active{border-color:color-mix(in oklab,var(--sv-primary) 35%,transparent);box-shadow:0 0 0 1px color-mix(in oklab,var(--sv-primary) 18%,transparent)}.view-settings .ci-item-header,.view-settings .cip-item-header{align-items:flex-start;display:flex;gap:.5rem;justify-content:space-between}.view-settings .ci-item-label,.view-settings .cip-item-label{font-size:.8rem;font-weight:600}.view-settings .ci-item-actions,.view-settings .cip-item-actions{display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end}.view-settings .ci-badge,.view-settings .cip-badge{background:color-mix(in oklab,var(--sv-primary) 16%,transparent);border-radius:999px;color:var(--sv-fg);font-size:.65rem;padding:.15rem .4rem}.view-settings .ci-item-preview,.view-settings .cip-item-preview{color:var(--sv-muted);font-size:.75rem;line-height:1.45;margin-block-start:.35rem}.view-settings .ci-edit-form,.view-settings .cip-edit-form{display:flex;flex-direction:column;gap:.5rem;margin-block-start:.5rem}.view-settings .ci-actions,.view-settings .ci-add-actions,.view-settings .ci-edit-actions,.view-settings .cip-form-actions,.view-settings .cip-toolbar{align-items:center;display:flex;flex-wrap:wrap;gap:.5rem}.view-settings .ci-input,.view-settings .ci-textarea,.view-settings .cip-input,.view-settings .cip-textarea,.view-settings .field-control{background:var(--sv-surface-1);border:1px solid color-mix(in oklab,var(--sv-outline) 40%,transparent);border-radius:10px;color:var(--sv-fg);font-size:.8125rem;inline-size:100%;padding:.45rem .55rem}.view-settings .ci-textarea,.view-settings .cip-textarea{min-block-size:5rem}.view-settings .ci-empty,.view-settings .cip-empty{color:var(--sv-muted);font-size:.8rem;padding:.75rem;text-align:center}.view-settings .field-label{color:var(--sv-muted);font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}@container (max-inline-size: 1024px){.view-settings{padding:.65rem}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.3rem}.view-settings .settings-tab-btn{min-block-size:2.65rem;padding-inline:.7rem}}@container (max-inline-size: 480px){.view-settings{padding:.45rem}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:.75rem;padding-block:.5rem}.view-settings .settings-screen__footer{align-items:stretch;flex-direction:column-reverse;gap:.5rem}.view-settings .settings-screen__footer .btn.primary{inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}}";
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-utils.ts
var SUPPORTED_SPEECH_LANGUAGES = [
	"en",
	"ru",
	"en-GB",
	"en-US"
];
var speechLanguageLabel = (lang) => {
	if (lang === "en") return "English (generic)";
	if (lang === "ru") return "Russian";
	if (lang === "en-GB") return "English (UK)";
	return "English (US)";
};
var normalizeSpeechLanguage = (lang) => {
	const value = (lang || "").trim();
	if (!value) return null;
	if (value === "ru" || value.startsWith("ru-")) return "ru";
	if (value === "en-GB") return "en-GB";
	if (value === "en-US") return "en-US";
	if (value === "en" || value.startsWith("en-")) return "en";
	return null;
};
var buildSpeechLanguageOptions = () => {
	const ordered = /* @__PURE__ */ new Set();
	const navLanguages = typeof navigator !== "undefined" ? [...navigator.languages || [], navigator.language] : [];
	for (const navLanguage of navLanguages) {
		const normalized = normalizeSpeechLanguage(navLanguage);
		if (normalized) ordered.add(normalized);
	}
	for (const fallback of SUPPORTED_SPEECH_LANGUAGES) ordered.add(fallback);
	return Array.from(ordered);
};
var buildResponseLanguageOptions = () => {
	const ordered = new Set(["ru", "en"]);
	const navLanguages = typeof navigator !== "undefined" ? [...navigator.languages || [], navigator.language] : [];
	for (const navLanguage of navLanguages) {
		const value = (navLanguage || "").trim();
		if (!value || value === "en" || value === "ru") continue;
		ordered.add(value);
	}
	return Array.from(ordered);
};
var parseNumberOrDefault = (value, fallback) => {
	const parsed = Number((value || "").trim());
	if (!Number.isFinite(parsed)) return fallback;
	return parsed;
};
var parseFloatInRange = (value, fallback, min, max) => {
	const parsed = Number.parseFloat((value || "").trim());
	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(min, Math.min(max, parsed));
};
var readTrimmedControlValue = (control, fallback = "") => {
	return control ? control.value.trim() : fallback;
};
var readCheckboxValue = (control, fallback) => {
	return control ? Boolean(control.checked) : fallback;
};
//#endregion
//#region ../../modules/views/settings-view/src/ts/settings-mcp.ts
var createMcpRow = (cfg) => {
	const safeCfg = {
		id: (cfg?.id || `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`).trim(),
		serverLabel: (cfg?.serverLabel || "").trim(),
		origin: (cfg?.origin || "").trim(),
		clientKey: (cfg?.clientKey || "").trim(),
		secretKey: (cfg?.secretKey || "").trim()
	};
	return H`<div class="field mcp-row" data-mcp-id=${safeCfg.id}>
            <label class="field">
              <span>Server Label</span>
              <input class="form-input" type="text" data-mcp-field="serverLabel" autocomplete="off" value="${safeCfg.serverLabel}" />
            </label>
            <label class="field">
              <span>Origin</span>
              <input class="form-input" type="url" data-mcp-field="origin" autocomplete="off" placeholder="https://server.example" value="${safeCfg.origin}" />
            </label>
            <label class="field">
              <span>Client Key</span>
              <input class="form-input" type="text" data-mcp-field="clientKey" autocomplete="off" value="${safeCfg.clientKey}" />
            </label>
            <label class="field">
              <span>Secret Key</span>
              <input class="form-input" type="password" data-mcp-field="secretKey" autocomplete="off" placeholder="sk-..." value="${safeCfg.secretKey}" />
            </label>
            <button class="btn btn-danger" type="button" data-action="remove-mcp-server">Remove</button>
          </div>`;
};
var collectMcpConfigurations = (mcpSection) => {
	if (!mcpSection) return [];
	const rows = Array.from(mcpSection.querySelectorAll("[data-mcp-id]"));
	const items = [];
	for (const row of rows) {
		const id = row.getAttribute("data-mcp-id") || `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
		const serverLabel = row.querySelector("[data-mcp-field=\"serverLabel\"]")?.value?.trim() || "";
		const origin = row.querySelector("[data-mcp-field=\"origin\"]")?.value?.trim() || "";
		const clientKey = row.querySelector("[data-mcp-field=\"clientKey\"]")?.value?.trim() || "";
		const secretKey = row.querySelector("[data-mcp-field=\"secretKey\"]")?.value?.trim() || "";
		if (!serverLabel) continue;
		items.push({
			id,
			serverLabel,
			origin,
			clientKey,
			secretKey
		});
	}
	return items;
};
var renderMcpConfigurations = (mcpSection, configs) => {
	if (!mcpSection) return;
	mcpSection.replaceChildren();
	const list = Array.isArray(configs) ? configs : [];
	if (!list.length) {
		mcpSection.appendChild(H`<p class="mcp-empty-note">No MCP servers configured.</p>`);
		return;
	}
	list.forEach((cfg) => mcpSection.appendChild(createMcpRow(cfg)));
};
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsFooter.ts
var createSettingsFooter = () => H`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsHeader.ts
/** Top title + category tabs. */
var createSettingsHeader = () => H`<header class="settings-screen__top">
        <h2 class="settings-screen__title">Settings</h2>
        <div class="settings-tab-actions" data-settings-tabs data-active-tab="ai" role="tablist" aria-label="Settings categories">
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="appearance" aria-selected="false">Appearance</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="markdown" aria-selected="false">Markdown</button>
        <button class="settings-tab-btn is-active" type="button" role="tab" data-action="switch-settings-tab" data-tab="ai" aria-selected="true">AI</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="mcp" aria-selected="false">MCP</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="server" aria-selected="false">Server</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="instructions" aria-selected="false">Instructions</button>
        <button class="settings-tab-btn" type="button" role="tab" data-action="switch-settings-tab" data-tab="extension" aria-selected="false" data-extension-tab hidden>Extension</button>
        </div>
    </header>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsAppearance.ts
var createAppearanceSection = () => H`<section class="card settings-tab-panel" data-tab-panel="appearance">
      <h3>Appearance</h3>
      <label class="field">
        <span>Theme</span>
        <select class="form-select" data-field="appearance.theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
        <span>Font Size</span>
        <select class="form-select" data-field="appearance.fontSize">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsMarkdown.ts
var createMarkdownSection = () => H`<section class="card settings-tab-panel" data-tab-panel="markdown">
      <h3>Markdown Viewer</h3>
      <label class="field">
        <span>Style preset</span>
        <select class="form-select" data-field="appearance.markdown.preset">
          <option value="default">Default</option>
          <option value="classic">Classic</option>
          <option value="compact">Compact</option>
          <option value="paper">Paper</option>
        </select>
      </label>
      <label class="field">
        <span>Font family</span>
        <select class="form-select" data-field="appearance.markdown.fontFamily">
          <option value="system">System UI</option>
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </label>
      <label class="field">
        <span>Font size (px)</span>
        <input class="form-input" type="number" inputmode="numeric" min="12" max="26" step="1" data-field="appearance.markdown.fontSizePx" />
      </label>
      <label class="field">
        <span>Line height</span>
        <input class="form-input" type="number" inputmode="decimal" min="1.1" max="2.2" step="0.05" data-field="appearance.markdown.lineHeight" />
      </label>
      <label class="field">
        <span>Content max width (px)</span>
        <input class="form-input" type="number" inputmode="numeric" min="500" max="1400" step="10" data-field="appearance.markdown.contentMaxWidthPx" />
      </label>
      <label class="field">
        <span>Print scale</span>
        <input class="form-input" type="number" inputmode="decimal" min="0.5" max="1.5" step="0.05" data-field="appearance.markdown.printScale" />
      </label>
      <label class="field">
        <span>Page size</span>
        <select class="form-select" data-field="appearance.markdown.page.size">
          <option value="auto">Auto</option>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
          <option value="A5">A5</option>
        </select>
      </label>
      <label class="field">
        <span>Page orientation</span>
        <select class="form-select" data-field="appearance.markdown.page.orientation">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <label class="field">
        <span>Page margins (mm)</span>
        <input class="form-input" type="number" inputmode="numeric" min="5" max="40" step="1" data-field="appearance.markdown.page.marginMm" />
      </label>
      <h4>Style modules</h4>
      <p class="field-hint" style="margin: 0 0 0.5rem; opacity: 0.85; font-size: 0.9em;">Grouped by what they affect in the viewer. All are on by default.</p>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Type &amp; layout</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.typography" />
          <span>Typography (paragraphs, headings)</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.lists" />
          <span>Lists (bullets &amp; numbering)</span>
        </label>
      </fieldset>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Blocks &amp; media</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.tables" />
          <span>Tables</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.codeBlocks" />
          <span>Code blocks</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.blockquotes" />
          <span>Blockquotes</span>
        </label>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.media" />
          <span>Images &amp; video</span>
        </label>
      </fieldset>
      <fieldset class="field-group" style="border: 0; padding: 0; margin: 0 0 1rem;">
        <legend class="field" style="font-weight: 600; margin-bottom: 0.35rem;">Print</legend>
        <label class="field checkbox form-checkbox">
          <input type="checkbox" data-field="appearance.markdown.modules.printBreaks" />
          <span>Print breaks (avoid splits inside headings, tables, …)</span>
        </label>
      </fieldset>
      <h4>Rendering plugins</h4>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.smartTypography" />
        <span>Smart typography</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.softBreaksAsBr" />
        <span>Soft line breaks as BR</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="appearance.markdown.plugins.externalLinksNewTab" />
        <span>Open external links in new tab</span>
      </label>
      <label class="field">
        <span>Custom CSS (screen/view)</span>
        <textarea class="form-input" rows="8" data-field="appearance.markdown.customCss" placeholder=".markdown-viewer-content h1 { color: var(--color-primary); }"></textarea>
      </label>
      <label class="field">
        <span>Custom CSS (print only)</span>
        <textarea class="form-input" rows="8" data-field="appearance.markdown.printCss" placeholder=".markdown-viewer-content { font-size: 12pt; line-height: 1.5; }"></textarea>
      </label>
      <label class="field">
        <span>Markdown extensions (JSON rules)</span>
        <textarea class="form-input" rows="10" data-field="appearance.markdown.extensions" placeholder='[
  {
    "id": "highlight",
    "pattern": "==(.+?)==",
    "replacement": "<mark>$1</mark>",
    "flags": "g",
    "enabled": true
  }
]'></textarea>
      </label>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="open-user-styles">Open <code>/user/styles/</code> in Explorer</button>
        <button class="btn" type="button" data-action="open-assets-readonly">Open <code>/assets/</code> (read-only) in Explorer</button>
      </div>
      <p class="mcp-empty-note">Rules are regex replacements applied before markdown parsing. Invalid JSON is rejected on save. Custom CSS supports explicit <code>@layer</code> blocks for advanced interop.</p>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsAI.ts
var createAiSection = () => H`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
      <h3>AI</h3>
      <form class="settings-panel-form" novalidate onsubmit="return false">
      <label class="field">
        <span>Base URL</span>
        <input placeholder="https://api.proxyapi.ru/openai/v1" class="form-input" type="url" inputmode="url" autocomplete="off" data-field="ai.baseUrl" />
      </label>
      <label class="field">
        <span>API Key</span>
        <input placeholder="sk-..." class="form-input" type="password" autocomplete="off" data-field="ai.apiKey"/>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ui.showKey" />
        <span>Show API key</span>
      </label>
      <label class="field">
        <span>Model</span>
        <select class="form-select" data-field="ai.model"></select>
      </label>
      <label class="field" data-field-group="ai.customModel">
        <span>Custom model identifier</span>
        <input placeholder="provider/model-or-id" class="form-input" type="text" autocomplete="off" data-field="ai.customModel"/>
      </label>
      <label class="field">
        <span>Default reasoning effort</span>
        <select class="form-select" data-field="ai.defaultReasoningEffort">
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
      </label>
      <details class="settings-spoiler" data-advanced-ai-spoiler>
        <summary>Advanced AI settings</summary>
        <div>
          
          <label class="field">
            <span>Default verbosity</span>
            <select class="form-select" data-field="ai.defaultVerbosity">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label class="field">
            <span>Max output tokens</span>
            <input placeholder="400000" class="form-input" type="number" inputmode="numeric" data-field="ai.maxOutputTokens" />
          </label>
          <label class="field">
            <span>Context truncation</span>
            <select class="form-select" data-field="ai.contextTruncation">
              <option value="disabled">Disabled</option>
              <option value="auto">Auto</option>
            </select>
          </label>
          <label class="field">
            <span>Prompt cache retention</span>
            <select class="form-select" data-field="ai.promptCacheRetention">
              <option value="in-memory">In-memory</option>
              <option value="24h">24h</option>
            </select>
          </label>
          <label class="field">
            <span>Max tool calls</span>
            <input placeholder="8" class="form-input" type="number" inputmode="numeric" data-field="ai.maxToolCalls" />
          </label>
          <label class="field checkbox form-checkbox">
            <input type="checkbox" data-field="ai.parallelToolCalls" />
            <span>Allow parallel tool calls</span>
          </label>
          <label class="field">
            <span>Timeout low (ms)</span>
            <input placeholder="60000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.low" />
          </label>
          <label class="field">
            <span>Timeout medium (ms)</span>
            <input placeholder="300000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.medium" />
          </label>
          <label class="field">
            <span>Timeout high (ms)</span>
            <input placeholder="900000" class="form-input" type="number" inputmode="numeric" data-field="ai.requestTimeout.high" />
          </label>
          <label class="field">
            <span>Max retries</span>
            <input placeholder="2" class="form-input" type="number" inputmode="numeric" data-field="ai.maxRetries" />
          </label>
        </div>
      </details>
      <label class="field">
        <span>Share target mode</span>
        <select class="form-select" data-field="ai.shareTargetMode">
          <option value="recognize">Recognize and copy</option>
          <option value="analyze">Analyze and store</option>
        </select>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.autoProcessShared" />
        <span>Auto AI on Share Target / File Open (and copy to clipboard)</span>
      </label>
      <label class="field">
        <span>Response language</span>
        <select class="form-select" data-field="ai.responseLanguage"></select>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.translateResults" />
        <span>Translate results</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="ai.generateSvgGraphics" />
        <span>Generate SVG graphics</span>
      </label>
      <label class="field">
        <span>Speech Recognition language</span>
        <select class="form-select" data-field="speech.language"></select>
      </label>
      </form>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsMcp.ts
var createMcpSection = () => H`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsServer.ts
/** CWSP endpoint and device identity. */
var createServerSection = () => H`<section class="card settings-tab-panel" data-tab-panel="server">
      <h3>Server</h3>
      <p class="field-hint" style="margin: 0 0 0.75rem; opacity: 0.88; font-size: 0.9em;">
        Connect to the hub with server URL and client id. Optional client identifier token and TLS options below.
      </p>
      <h4>Endpoint and identity</h4>
      <form class="settings-panel-form" novalidate onsubmit="return false">
      <label class="field">
        <span>Server URL</span>
        <input class="form-input" type="url" inputmode="url" autocomplete="off" placeholder="https://192.168.0.200:8443" data-field="core.endpointUrl" />
      </label>
      <label class="field">
        <span>Associated device / client ID</span>
        <input class="form-input" type="text" autocomplete="off" data-field="core.userId" placeholder="L-192.168.0.196" />
      </label>
      <label class="field">
        <span>Client identifier token</span>
        <input class="form-input" type="password" autocomplete="off" data-field="core.userKey" placeholder="Endpoint-issued key" />
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.socket.allowAccessTokenWithoutUserKey" />
        <span>Allow access / control token without associated client identifier token</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.allowInsecureTls" />
        <span>Allow self-signed / insecure TLS</span>
      </label>
      </form>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/CustomInstructionsEditor.ts
var createCustomInstructionsEditor = (opts = {}) => {
	const state = observe({
		instructions: [],
		activeId: "",
		editingId: null,
		newLabel: "",
		newInstruction: "",
		isAdding: false
	});
	const root = H`<div class="custom-instructions-editor">
        <div class="ci-row">
            <div class="ci-header">
                <h4>Custom Instructions</h4>
                <p class="ci-desc">Define custom instructions for AI operations. These can be activated for "Recognize & Copy" and selected in the Work Center.</p>
            </div>

            <div class="ci-active-select">
                <label>
                    <span>Active instruction:</span>
                    <select class="ci-select" data-action="select-active">
                        <option value="">None (use default)</option>
                    </select>
                </label>
            </div>
        </div>

        <div class="ci-list" data-list></div>

        <div class="ci-add-form" data-add-form hidden>
            <input type="text" class="ci-input" data-field="label" placeholder="Instruction label..." />
            <textarea class="ci-textarea" data-field="instruction" placeholder="Enter your custom instruction..." rows="4"></textarea>
            <div class="ci-add-actions">
                <button class="btn small primary" type="button" data-action="save-new">Add</button>
                <button class="btn small" type="button" data-action="cancel-add">Cancel</button>
            </div>
        </div>

        <div class="ci-actions">
            <button class="btn small" type="button" data-action="add">+ Add Instruction</button>
            <button class="btn small" type="button" data-action="add-templates">Add Templates</button>
        </div>
    </div>`;
	const listEl = root.querySelector("[data-list]");
	const selectEl = root.querySelector("[data-action='select-active']");
	const addFormEl = root.querySelector("[data-add-form]");
	const labelInput = root.querySelector("[data-field='label']");
	const instructionInput = root.querySelector("[data-field='instruction']");
	const renderList = () => {
		listEl.replaceChildren();
		if (!state.instructions.length) {
			listEl.append(H`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`);
			return;
		}
		for (const instr of state.instructions) {
			const isEditing = state.editingId === instr.id;
			const isActive = state.activeId === instr.id;
			const item = H`<div class="ci-item ${isActive ? "active" : ""}" data-id="${instr.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${instr.label}</span>
                    <div class="ci-item-actions">
                        ${isActive ? H`<span class="ci-badge active">Active</span>` : H`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${isEditing ? H`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${instr.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${instr.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>` : H`<div class="ci-item-preview">${truncate(instr.instruction, 120)}</div>`}
            </div>`;
			item.addEventListener("click", (e) => {
				const action = e.target.closest("[data-action]")?.getAttribute("data-action");
				if (action === "activate") setActiveInstruction(instr.id).then(loadData).then(() => opts.onUpdate?.());
				if (action === "edit") {
					state.editingId = instr.id;
					renderList();
				}
				if (action === "delete") {
					if (confirm(`Delete "${instr.label}"?`)) deleteInstruction(instr.id).then(loadData).then(() => opts.onUpdate?.());
				}
				if (action === "save-edit") {
					const labelEl = item.querySelector("[data-edit-field='label']");
					const instrEl = item.querySelector("[data-edit-field='instruction']");
					updateInstruction(instr.id, {
						label: labelEl.value.trim() || instr.label,
						instruction: instrEl.value.trim()
					}).then(() => {
						state.editingId = null;
						return loadData();
					}).then(() => opts.onUpdate?.());
				}
				if (action === "cancel-edit") {
					state.editingId = null;
					renderList();
				}
			});
			listEl.append(item);
		}
	};
	const updateSelect = () => {
		selectEl.replaceChildren();
		selectEl.append(H`<option value="">None (use default)</option>`);
		for (const instr of state.instructions) {
			const opt = H`<option value="${instr.id}">${instr.label}</option>`;
			if (instr.id === state.activeId) opt.selected = true;
			selectEl.append(opt);
		}
	};
	const truncate = (text, maxLen) => {
		if (!text || text.length <= maxLen) return text || "";
		return text.slice(0, maxLen).trim() + "…";
	};
	const loadData = async () => {
		const snapshot = await getInstructionRegistry();
		state.instructions = snapshot.instructions;
		state.activeId = snapshot.activeId;
		renderList();
		updateSelect();
	};
	root.addEventListener("click", (e) => {
		const action = e.target.closest("[data-action]")?.getAttribute("data-action");
		if (action === "add") {
			state.isAdding = true;
			addFormEl.hidden = false;
			labelInput.value = "";
			instructionInput.value = "";
			labelInput.focus();
		}
		if (action === "cancel-add") {
			state.isAdding = false;
			addFormEl.hidden = true;
		}
		if (action === "save-new") {
			const label = labelInput.value.trim();
			const instruction = instructionInput.value.trim();
			if (!instruction) {
				instructionInput.focus();
				return;
			}
			addInstruction(label || "Custom", instruction).then((newInstr) => {
				if (!newInstr) return;
				state.isAdding = false;
				addFormEl.hidden = true;
				return loadData();
			}).then(() => opts.onUpdate?.());
		}
		if (action === "add-templates") {
			const existingLabels = new Set(state.instructions.map((i) => i.label.trim().toLowerCase()));
			const templatesToAdd = DEFAULT_INSTRUCTION_TEMPLATES.filter((t) => !existingLabels.has(t.label.trim().toLowerCase()));
			if (!templatesToAdd.length) {
				alert("All templates are already added.");
				return;
			}
			addInstructions(templatesToAdd.map((t) => ({
				label: t.label,
				instruction: t.instruction,
				enabled: t.enabled
			}))).then(loadData).then(() => opts.onUpdate?.());
		}
	});
	selectEl.addEventListener("change", () => {
		setActiveInstruction(selectEl.value || null).then(loadData).then(() => opts.onUpdate?.());
	});
	loadData();
	return root;
};
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsInstructions.ts
var createInstructionsSection = (setNote) => H`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${createCustomInstructionsEditor({ onUpdate: () => setNote("Instructions updated.") })}
      </div>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/sections/SettingsExtension.ts
var createExtensionSection = () => H`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`;
//#endregion
//#region ../../modules/views/settings-view/src/ts/Settings.ts
var createSettingsView = (opts) => {
	let note = null;
	const setNote = (text) => {
		if (!note) return;
		note.textContent = text;
		if (text) setTimeout(() => note && (note.textContent = ""), 1500);
	};
	const root = H`<div class="view-settings">
    ${createSettingsHeader()}
    <div class="settings-screen__body">
      ${createAppearanceSection()}
      ${createMarkdownSection()}
      ${createAiSection()}
      ${createMcpSection()}
      ${createServerSection()}
      ${createInstructionsSection(setNote)}
      ${createExtensionSection()}
    </div>
    ${createSettingsFooter()}
  </div>`;
	const field = (sel) => root.querySelector(sel);
	note = root.querySelector("[data-note]");
	const apiUrl = field("[data-field=\"ai.baseUrl\"]");
	const apiKey = field("[data-field=\"ai.apiKey\"]");
	const showKey = field("[data-field=\"ui.showKey\"]");
	const model = field("[data-field=\"ai.model\"]");
	const customModel = field("[data-field=\"ai.customModel\"]");
	const customModelGroup = root.querySelector("[data-field-group=\"ai.customModel\"]");
	const defaultReasoningEffort = field("[data-field=\"ai.defaultReasoningEffort\"]");
	const defaultVerbosity = field("[data-field=\"ai.defaultVerbosity\"]");
	const maxOutputTokens = field("[data-field=\"ai.maxOutputTokens\"]");
	const contextTruncation = field("[data-field=\"ai.contextTruncation\"]");
	const promptCacheRetention = field("[data-field=\"ai.promptCacheRetention\"]");
	const maxToolCalls = field("[data-field=\"ai.maxToolCalls\"]");
	const parallelToolCalls = field("[data-field=\"ai.parallelToolCalls\"]");
	const requestTimeoutLow = field("[data-field=\"ai.requestTimeout.low\"]");
	const requestTimeoutMedium = field("[data-field=\"ai.requestTimeout.medium\"]");
	const requestTimeoutHigh = field("[data-field=\"ai.requestTimeout.high\"]");
	const maxRetries = field("[data-field=\"ai.maxRetries\"]");
	const mode = field("[data-field=\"ai.shareTargetMode\"]");
	const syncCustomModelVisibility = () => {
		const isCustom = (model?.value || "").trim() === "custom";
		if (customModelGroup) customModelGroup.hidden = !isCustom;
		if (customModel) customModel.disabled = !isCustom;
	};
	if (model) {
		model.replaceChildren();
		for (const builtInModel of BUILTIN_AI_MODELS) {
			const option = document.createElement("option");
			option.value = builtInModel;
			option.textContent = builtInModel;
			model.append(option);
		}
		const customOption = document.createElement("option");
		customOption.value = "custom";
		customOption.textContent = "Custom...";
		model.append(customOption);
		model.addEventListener("change", syncCustomModelVisibility);
	}
	customModel?.addEventListener("focus", () => {
		if (!model) return;
		model.value = "custom";
		syncCustomModelVisibility();
	});
	const autoProcessShared = field("[data-field=\"ai.autoProcessShared\"]");
	const responseLanguage = field("[data-field=\"ai.responseLanguage\"]");
	const translateResults = field("[data-field=\"ai.translateResults\"]");
	const generateSvgGraphics = field("[data-field=\"ai.generateSvgGraphics\"]");
	const speechLanguage = field("[data-field=\"speech.language\"]");
	const theme = field("[data-field=\"appearance.theme\"]");
	const fontSize = field("[data-field=\"appearance.fontSize\"]");
	const markdownPreset = field("[data-field=\"appearance.markdown.preset\"]");
	const markdownFontFamily = field("[data-field=\"appearance.markdown.fontFamily\"]");
	const markdownFontSizePx = field("[data-field=\"appearance.markdown.fontSizePx\"]");
	const markdownLineHeight = field("[data-field=\"appearance.markdown.lineHeight\"]");
	const markdownContentMaxWidthPx = field("[data-field=\"appearance.markdown.contentMaxWidthPx\"]");
	const markdownPrintScale = field("[data-field=\"appearance.markdown.printScale\"]");
	const markdownPageSize = field("[data-field=\"appearance.markdown.page.size\"]");
	const markdownPageOrientation = field("[data-field=\"appearance.markdown.page.orientation\"]");
	const markdownPageMarginMm = field("[data-field=\"appearance.markdown.page.marginMm\"]");
	const markdownModuleTypography = field("[data-field=\"appearance.markdown.modules.typography\"]");
	const markdownModuleLists = field("[data-field=\"appearance.markdown.modules.lists\"]");
	const markdownModuleTables = field("[data-field=\"appearance.markdown.modules.tables\"]");
	const markdownModuleCodeBlocks = field("[data-field=\"appearance.markdown.modules.codeBlocks\"]");
	const markdownModuleBlockquotes = field("[data-field=\"appearance.markdown.modules.blockquotes\"]");
	const markdownModuleMedia = field("[data-field=\"appearance.markdown.modules.media\"]");
	const markdownModulePrintBreaks = field("[data-field=\"appearance.markdown.modules.printBreaks\"]");
	const markdownPluginSmartTypography = field("[data-field=\"appearance.markdown.plugins.smartTypography\"]");
	const markdownPluginSoftBreaks = field("[data-field=\"appearance.markdown.plugins.softBreaksAsBr\"]");
	const markdownPluginExternalLinks = field("[data-field=\"appearance.markdown.plugins.externalLinksNewTab\"]");
	const markdownCustomCss = root.querySelector("[data-field=\"appearance.markdown.customCss\"]");
	const markdownPrintCss = root.querySelector("[data-field=\"appearance.markdown.printCss\"]");
	const markdownExtensions = root.querySelector("[data-field=\"appearance.markdown.extensions\"]");
	const ntpEnabled = field("[data-field=\"core.ntpEnabled\"]");
	const coreMode = field("[data-field=\"core.mode\"]");
	const coreEndpointUrl = field("[data-field=\"core.endpointUrl\"]");
	const coreUserId = field("[data-field=\"core.userId\"]");
	const coreUserKey = field("[data-field=\"core.userKey\"]");
	const corePreferBackendSync = field("[data-field=\"core.preferBackendSync\"]");
	const coreEncrypt = field("[data-field=\"core.encrypt\"]");
	const coreAppClientId = field("[data-field=\"core.appClientId\"]");
	const coreAllowInsecureTls = field("[data-field=\"core.allowInsecureTls\"]");
	const coreOpsAllowUnencrypted = field("[data-field=\"core.ops.allowUnencrypted\"]");
	const coreAdminHttps = field("[data-field=\"core.admin.httpsOrigin\"]");
	const coreAdminHttp = field("[data-field=\"core.admin.httpOrigin\"]");
	const coreAdminPath = field("[data-field=\"core.admin.path\"]");
	const coreUseCoreIdentityAirpad = field("[data-field=\"core.useCoreIdentityForAirPad\"]");
	const coreSocketAccessToken = field("[data-field=\"core.socket.accessToken\"]");
	const coreSocketRouteTarget = field("[data-field=\"core.socket.routeTarget\"]");
	const coreSocketClientAccessToken = field("[data-field=\"core.socket.clientAccessToken\"]");
	const coreSocketAllowAccessWithoutUserKey = field("[data-field=\"core.socket.allowAccessTokenWithoutUserKey\"]");
	const shellMaintainHubSocket = field("[data-field=\"shell.maintainHubSocketConnection\"]");
	const shellClipboardBroadcastTargets = field("[data-field=\"shell.clipboardBroadcastTargets\"]");
	const shellPushLocalClipboard = field("[data-field=\"shell.pushLocalClipboardToLan\"]");
	const shellClipboardPushIntervalMs = field("[data-field=\"shell.clipboardPushIntervalMs\"]");
	const shellClipboard = field("[data-field=\"shell.enableRemoteClipboardBridge\"]");
	const shellAcceptInboundClipboard = field("[data-field=\"shell.acceptInboundClipboardData\"]");
	const shellClipboardInboundAllowIds = field("[data-field=\"shell.clipboardInboundAllowIds\"]");
	const shellAccessTokenBypassClipboardAllow = field("[data-field=\"shell.accessTokenBypassesClipboardAllowlist\"]");
	const shellClipboardShareDestIds = field("[data-field=\"shell.clipboardShareDestinationIds\"]");
	const shellApplyRemoteDevice = field("[data-field=\"shell.applyRemoteClipboardToDevice\"]");
	const shellAcceptContactsBridge = field("[data-field=\"shell.acceptContactsBridgeData\"]");
	const shellAcceptSmsBridge = field("[data-field=\"shell.acceptSmsBridgeData\"]");
	const shellSms = field("[data-field=\"shell.enableNativeSms\"]");
	const shellContacts = field("[data-field=\"shell.enableNativeContacts\"]");
	const adminPreview = root.querySelector("[data-admin-preview]");
	const mcpSection = root.querySelector("[data-mcp-section]");
	const extSection = root.querySelector("[data-section=\"extension\"]");
	const extTab = root.querySelector("[data-extension-tab]");
	if (responseLanguage) {
		responseLanguage.replaceChildren();
		const autoOption = document.createElement("option");
		autoOption.value = "auto";
		autoOption.textContent = "Auto-detect";
		responseLanguage.append(autoOption);
		const followOption = document.createElement("option");
		followOption.value = "follow";
		followOption.textContent = "Follow source/context";
		responseLanguage.append(followOption);
		for (const lang of buildResponseLanguageOptions()) {
			const option = document.createElement("option");
			option.value = lang;
			option.textContent = lang === "ru" ? "Russian" : lang === "en" ? "English" : lang;
			responseLanguage.append(option);
		}
	}
	if (speechLanguage) {
		speechLanguage.replaceChildren();
		for (const lang of buildSpeechLanguageOptions()) {
			const option = document.createElement("option");
			option.value = lang;
			option.textContent = speechLanguageLabel(lang);
			speechLanguage.append(option);
		}
	}
	root.addEventListener("input", (ev) => {
		if (ev.target?.matches?.("[data-field^=\"core.\"]")) refreshAdminDoorPreview();
	});
	root.addEventListener("change", (ev) => {
		if (ev.target?.matches?.("[data-field^=\"core.\"]")) refreshAdminDoorPreview();
	});
	const switchSettingsTab = (tab) => {
		const nextTab = tab || "ai";
		root.querySelector("[data-settings-tabs]")?.setAttribute("data-active-tab", nextTab);
		const tabButtons = root.querySelectorAll("[data-action=\"switch-settings-tab\"][data-tab]");
		for (const tabButton of Array.from(tabButtons)) {
			const btn = tabButton;
			const isActive = btn.getAttribute("data-tab") === nextTab;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-selected", String(isActive));
		}
		const panels = root.querySelectorAll("[data-tab-panel]");
		for (const panel of Array.from(panels)) {
			const el = panel;
			const isActive = el.getAttribute("data-tab-panel") === nextTab;
			if (el.hidden && isActive) continue;
			el.classList.toggle("is-active", isActive);
		}
	};
	const resolveInitialTab = (raw) => {
		const normalized = (raw || "").trim().toLowerCase();
		if (!normalized) return "ai";
		if (normalized === "style" || normalized === "styles" || normalized === "styling") return "markdown";
		return new Set([
			"appearance",
			"markdown",
			"ai",
			"mcp",
			"server",
			"instructions",
			"extension"
		]).has(normalized) ? normalized : "ai";
	};
	const buildCoreSnapshotForAdminPreview = () => ({
		mode: coreMode?.value || "native",
		endpointUrl: coreEndpointUrl?.value?.trim() || "",
		userId: coreUserId?.value?.trim() || "",
		userKey: coreUserKey?.value?.trim() || "",
		encrypt: Boolean(coreEncrypt?.checked),
		preferBackendSync: (corePreferBackendSync?.checked ?? true) !== false,
		appClientId: coreAppClientId?.value?.trim() || "",
		allowInsecureTls: Boolean(coreAllowInsecureTls?.checked),
		useCoreIdentityForAirPad: (coreUseCoreIdentityAirpad?.checked ?? true) !== false,
		socket: {
			accessToken: coreSocketAccessToken?.value?.trim() || "",
			routeTarget: coreSocketRouteTarget?.value?.trim() || "",
			selfId: "",
			clientAccessToken: coreSocketClientAccessToken?.value?.trim() || "",
			allowAccessTokenWithoutUserKey: Boolean(coreSocketAllowAccessWithoutUserKey?.checked)
		},
		admin: {
			httpsOrigin: coreAdminHttps?.value?.trim() || "",
			httpOrigin: coreAdminHttp?.value?.trim() || "",
			path: coreAdminPath?.value?.trim() || "/"
		},
		ops: { allowUnencrypted: Boolean(coreOpsAllowUnencrypted?.checked) }
	});
	const refreshAdminDoorPreview = () => {
		if (!adminPreview) return;
		const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
		adminPreview.textContent = `Resolved: ${urls.https} · ${urls.http}`;
	};
	const openExplorerPath = (path) => {
		try {
			setString(StorageKeys.EXPLORER_PATH, path);
			navigateToView("explorer");
			sendMessage({
				type: "content-explorer",
				destination: "explorer",
				data: {
					action: "view",
					path
				},
				metadata: { source: "settings" }
			});
			setNote(`Explorer: ${path}`);
		} catch (error) {
			console.warn("[Settings] Failed to open explorer path:", error);
			setNote("Failed to open Explorer path.");
		}
	};
	loadSettings().then((s) => {
		if (apiUrl) apiUrl.value = (s?.ai?.baseUrl || "").trim();
		if (apiKey) apiKey.value = (s?.ai?.apiKey || "").trim();
		const savedModel = (s?.ai?.model || "gpt-5.4").trim();
		const savedCustomModel = (s?.ai?.customModel || "").trim();
		if (model) {
			const hasBuiltin = BUILTIN_AI_MODELS.includes(savedModel);
			if (savedModel === "custom" || !hasBuiltin && !!savedModel) {
				model.value = "custom";
				if (customModel) customModel.value = savedCustomModel || savedModel;
			} else {
				model.value = hasBuiltin ? savedModel : "gpt-5.4";
				if (customModel) customModel.value = savedCustomModel;
			}
			syncCustomModelVisibility();
		}
		if (defaultReasoningEffort) defaultReasoningEffort.value = s?.ai?.defaultReasoningEffort || "medium";
		if (defaultVerbosity) defaultVerbosity.value = s?.ai?.defaultVerbosity || "medium";
		if (maxOutputTokens) maxOutputTokens.value = String(s?.ai?.maxOutputTokens ?? 4e5);
		if (contextTruncation) contextTruncation.value = s?.ai?.contextTruncation || "disabled";
		if (promptCacheRetention) promptCacheRetention.value = s?.ai?.promptCacheRetention || "in-memory";
		if (maxToolCalls) maxToolCalls.value = String(s?.ai?.maxToolCalls ?? 8);
		if (parallelToolCalls) parallelToolCalls.checked = (s?.ai?.parallelToolCalls ?? true) !== false;
		if (requestTimeoutLow) requestTimeoutLow.value = String(s?.ai?.requestTimeout?.low ?? 6e4);
		if (requestTimeoutMedium) requestTimeoutMedium.value = String(s?.ai?.requestTimeout?.medium ?? 3e5);
		if (requestTimeoutHigh) requestTimeoutHigh.value = String(s?.ai?.requestTimeout?.high ?? 9e5);
		if (maxRetries) maxRetries.value = String(s?.ai?.maxRetries ?? 2);
		if (mode) mode.value = s?.ai?.shareTargetMode || "recognize";
		if (autoProcessShared) autoProcessShared.checked = (s?.ai?.autoProcessShared ?? true) !== false;
		if (responseLanguage) responseLanguage.value = s?.ai?.responseLanguage || "auto";
		if (translateResults) translateResults.checked = Boolean(s?.ai?.translateResults);
		if (generateSvgGraphics) generateSvgGraphics.checked = Boolean(s?.ai?.generateSvgGraphics);
		if (speechLanguage) speechLanguage.value = s?.speech?.language || "en-US";
		if (theme) theme.value = s?.appearance?.theme || "auto";
		if (fontSize) fontSize.value = s?.appearance?.fontSize || "medium";
		if (markdownPreset) markdownPreset.value = s?.appearance?.markdown?.preset || "default";
		if (markdownFontFamily) markdownFontFamily.value = s?.appearance?.markdown?.fontFamily || "system";
		if (markdownFontSizePx) markdownFontSizePx.value = String(s?.appearance?.markdown?.fontSizePx ?? 16);
		if (markdownLineHeight) markdownLineHeight.value = String(s?.appearance?.markdown?.lineHeight ?? 1.7);
		if (markdownContentMaxWidthPx) markdownContentMaxWidthPx.value = String(s?.appearance?.markdown?.contentMaxWidthPx ?? 860);
		if (markdownPrintScale) markdownPrintScale.value = String(s?.appearance?.markdown?.printScale ?? 1);
		if (markdownPageSize) markdownPageSize.value = s?.appearance?.markdown?.page?.size || "auto";
		if (markdownPageOrientation) markdownPageOrientation.value = s?.appearance?.markdown?.page?.orientation || "portrait";
		if (markdownPageMarginMm) markdownPageMarginMm.value = String(s?.appearance?.markdown?.page?.marginMm ?? 12);
		if (markdownModuleTypography) markdownModuleTypography.checked = (s?.appearance?.markdown?.modules?.typography ?? true) !== false;
		if (markdownModuleLists) markdownModuleLists.checked = (s?.appearance?.markdown?.modules?.lists ?? true) !== false;
		if (markdownModuleTables) markdownModuleTables.checked = (s?.appearance?.markdown?.modules?.tables ?? true) !== false;
		if (markdownModuleCodeBlocks) markdownModuleCodeBlocks.checked = (s?.appearance?.markdown?.modules?.codeBlocks ?? true) !== false;
		if (markdownModuleBlockquotes) markdownModuleBlockquotes.checked = (s?.appearance?.markdown?.modules?.blockquotes ?? true) !== false;
		if (markdownModuleMedia) markdownModuleMedia.checked = (s?.appearance?.markdown?.modules?.media ?? true) !== false;
		if (markdownModulePrintBreaks) markdownModulePrintBreaks.checked = (s?.appearance?.markdown?.modules?.printBreaks ?? true) !== false;
		if (markdownPluginSmartTypography) markdownPluginSmartTypography.checked = Boolean(s?.appearance?.markdown?.plugins?.smartTypography);
		if (markdownPluginSoftBreaks) markdownPluginSoftBreaks.checked = Boolean(s?.appearance?.markdown?.plugins?.softBreaksAsBr);
		if (markdownPluginExternalLinks) markdownPluginExternalLinks.checked = (s?.appearance?.markdown?.plugins?.externalLinksNewTab ?? true) !== false;
		if (markdownCustomCss) markdownCustomCss.value = (s?.appearance?.markdown?.customCss || "").trim();
		if (markdownPrintCss) markdownPrintCss.value = (s?.appearance?.markdown?.printCss || "").trim();
		if (markdownExtensions) {
			const extensions = Array.isArray(s?.appearance?.markdown?.extensions) ? s.appearance?.markdown?.extensions : [];
			markdownExtensions.value = extensions.length > 0 ? JSON.stringify(extensions, null, 2) : "";
		}
		if (ntpEnabled) ntpEnabled.checked = Boolean(s?.core?.ntpEnabled);
		if (coreMode) coreMode.value = s?.core?.mode || "native";
		if (coreEndpointUrl) coreEndpointUrl.value = (s?.core?.endpointUrl || "").trim();
		if (coreUserId) coreUserId.value = (s?.core?.userId || "").trim();
		if (coreUserKey) coreUserKey.value = (s?.core?.userKey || "").trim();
		if (corePreferBackendSync) corePreferBackendSync.checked = (s?.core?.preferBackendSync ?? true) !== false;
		if (coreEncrypt) coreEncrypt.checked = Boolean(s?.core?.encrypt);
		if (coreAppClientId) coreAppClientId.value = (s?.core?.appClientId || "").trim();
		if (coreUseCoreIdentityAirpad) coreUseCoreIdentityAirpad.checked = (s?.core?.useCoreIdentityForAirPad ?? true) !== false;
		if (coreSocketAccessToken) coreSocketAccessToken.value = (s?.core?.socket?.accessToken || s?.core?.socket?.airpadAuthToken || "").trim();
		if (coreSocketRouteTarget) coreSocketRouteTarget.value = (s?.core?.socket?.routeTarget || s?.core?.socket?.selfId || "").trim();
		if (coreSocketClientAccessToken) coreSocketClientAccessToken.value = (s?.core?.socket?.clientAccessToken || "").trim();
		if (coreSocketAllowAccessWithoutUserKey) coreSocketAllowAccessWithoutUserKey.checked = (s?.core?.socket?.allowAccessTokenWithoutUserKey ?? false) === true;
		if (coreAllowInsecureTls) coreAllowInsecureTls.checked = Boolean(s?.core?.allowInsecureTls);
		if (coreOpsAllowUnencrypted) coreOpsAllowUnencrypted.checked = Boolean(s?.core?.ops?.allowUnencrypted);
		if (coreAdminHttps) coreAdminHttps.value = (s?.core?.admin?.httpsOrigin || "").trim();
		if (coreAdminHttp) coreAdminHttp.value = (s?.core?.admin?.httpOrigin || "").trim();
		if (coreAdminPath) coreAdminPath.value = (s?.core?.admin?.path || "/").trim() || "/";
		if (shellMaintainHubSocket) shellMaintainHubSocket.checked = Boolean(s?.shell?.maintainHubSocketConnection);
		if (shellClipboardBroadcastTargets) shellClipboardBroadcastTargets.value = (s?.shell?.clipboardBroadcastTargets || "").trim();
		if (shellPushLocalClipboard) shellPushLocalClipboard.checked = Boolean(s?.shell?.pushLocalClipboardToLan);
		if (shellClipboardPushIntervalMs) {
			const iv = Number(s?.shell?.clipboardPushIntervalMs);
			shellClipboardPushIntervalMs.value = String(Number.isFinite(iv) && iv >= 800 ? Math.min(Math.round(iv), 6e4) : 2e3);
		}
		if (shellClipboard) shellClipboard.checked = (s?.shell?.enableRemoteClipboardBridge ?? true) !== false;
		if (shellAcceptInboundClipboard) shellAcceptInboundClipboard.checked = (s?.shell?.acceptInboundClipboardData ?? true) !== false;
		if (shellClipboardInboundAllowIds) shellClipboardInboundAllowIds.value = (s?.shell?.clipboardInboundAllowIds || "").trim();
		if (shellAccessTokenBypassClipboardAllow) shellAccessTokenBypassClipboardAllow.checked = (s?.shell?.accessTokenBypassesClipboardAllowlist ?? false) === true;
		if (shellClipboardShareDestIds) shellClipboardShareDestIds.value = (s?.shell?.clipboardShareDestinationIds || "").trim();
		if (shellApplyRemoteDevice) shellApplyRemoteDevice.checked = (s?.shell?.applyRemoteClipboardToDevice ?? true) !== false;
		if (shellAcceptContactsBridge) shellAcceptContactsBridge.checked = (s?.shell?.acceptContactsBridgeData ?? false) === true;
		if (shellAcceptSmsBridge) shellAcceptSmsBridge.checked = (s?.shell?.acceptSmsBridgeData ?? false) === true;
		if (shellSms) shellSms.checked = (s?.shell?.enableNativeSms ?? true) !== false;
		if (shellContacts) shellContacts.checked = (s?.shell?.enableNativeContacts ?? true) !== false;
		refreshAdminDoorPreview();
		renderMcpConfigurations(mcpSection, Array.isArray(s?.ai?.mcp) ? s.ai.mcp : []);
		applyAirpadRuntimeFromAppSettings(s);
		applyTheme(s);
		opts.onTheme?.(s?.appearance?.theme || "auto");
	}).catch(() => {
		renderMcpConfigurations(mcpSection, []);
	});
	showKey?.addEventListener("change", () => {
		if (!apiKey || !showKey) return;
		apiKey.type = showKey.checked ? "text" : "password";
	});
	theme?.addEventListener("change", () => {
		const t = theme.value || "auto";
		(async () => {
			try {
				const cur = await loadSettings();
				applyTheme({
					...cur,
					appearance: {
						...cur.appearance || {},
						theme: t
					}
				});
			} catch {
				applyTheme({ appearance: {
					theme: t,
					fontSize: "medium"
				} });
			}
			opts.onTheme?.(t);
		})();
	});
	root.addEventListener("click", (e) => {
		const t = e.target;
		const tabBtn = t?.closest?.("button[data-action=\"switch-settings-tab\"]");
		if (tabBtn) {
			switchSettingsTab(tabBtn.getAttribute("data-tab") || "ai");
			return;
		}
		if (t?.closest?.("button[data-action=\"add-mcp-server\"]") && mcpSection) {
			mcpSection.querySelector(".mcp-empty-note")?.remove();
			mcpSection.appendChild(createMcpRow({
				id: `mcp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
				serverLabel: "",
				origin: "",
				clientKey: "",
				secretKey: ""
			}));
			return;
		}
		const removeMcpBtn = t?.closest?.("button[data-action=\"remove-mcp-server\"]");
		if (removeMcpBtn) {
			removeMcpBtn.closest(".mcp-row")?.remove();
			if (mcpSection && !mcpSection.querySelector("[data-mcp-id]")) renderMcpConfigurations(mcpSection, []);
			return;
		}
		if (t?.closest?.("button[data-action=\"open-user-styles\"]")) {
			openExplorerPath("/user/styles/");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-assets-readonly\"]")) {
			openExplorerPath("/assets/");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-admin-https\"]")) {
			openAdminDoorFromCore(buildCoreSnapshotForAdminPreview(), "https");
			return;
		}
		if (t?.closest?.("button[data-action=\"open-admin-http\"]")) {
			openAdminDoorFromCore(buildCoreSnapshotForAdminPreview(), "http");
			return;
		}
		if (t?.closest?.("button[data-action=\"copy-admin-https\"]")) {
			const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
			navigator.clipboard?.writeText?.(urls.https).then(() => setNote("HTTPS admin URL copied."), () => setNote("Copy failed."));
			return;
		}
		if (t?.closest?.("button[data-action=\"copy-admin-http\"]")) {
			const urls = resolveAdminDoorUrls(buildCoreSnapshotForAdminPreview());
			navigator.clipboard?.writeText?.(urls.http).then(() => setNote("HTTP admin URL copied."), () => setNote("Copy failed."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-app-settings\"]")) {
			import("./clipboard-device.js").then((m) => m.openAppClipboardRelatedSettings()).then(() => setNote("App settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-notification-settings\"]")) {
			import("./clipboard-device.js").then((m) => m.openNativeNotificationSettings?.()).then(() => setNote("Notification settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		if (!t?.closest?.("button[data-action=\"save\"]")) return;
		(async () => {
			const current = await loadSettings();
			let parsedMarkdownExtensions = [];
			const rawExtensions = markdownExtensions?.value?.trim() || "";
			if (rawExtensions) try {
				const parsed = JSON.parse(rawExtensions);
				if (!Array.isArray(parsed)) throw new Error("Markdown extensions JSON must be an array.");
				parsedMarkdownExtensions = parsed;
			} catch (error) {
				switchSettingsTab("markdown");
				setNote(error?.message || "Invalid Markdown extensions JSON.");
				return;
			}
			const saved = await saveSettings({
				ai: {
					baseUrl: apiUrl?.value?.trim?.() || "",
					apiKey: apiKey?.value?.trim?.() || "",
					model: model?.value || "gpt-5.4",
					customModel: model?.value === "custom" ? customModel?.value?.trim?.() || "" : "",
					defaultReasoningEffort: defaultReasoningEffort?.value || "medium",
					defaultVerbosity: defaultVerbosity?.value || "medium",
					maxOutputTokens: parseNumberOrDefault(maxOutputTokens?.value, 4e5),
					contextTruncation: contextTruncation?.value || "disabled",
					promptCacheRetention: promptCacheRetention?.value || "in-memory",
					maxToolCalls: parseNumberOrDefault(maxToolCalls?.value, 8),
					parallelToolCalls: (parallelToolCalls?.checked ?? true) !== false,
					requestTimeout: {
						low: parseNumberOrDefault(requestTimeoutLow?.value, 6e4),
						medium: parseNumberOrDefault(requestTimeoutMedium?.value, 3e5),
						high: parseNumberOrDefault(requestTimeoutHigh?.value, 9e5)
					},
					maxRetries: parseNumberOrDefault(maxRetries?.value, 2),
					shareTargetMode: mode?.value || "recognize",
					autoProcessShared: (autoProcessShared?.checked ?? true) !== false,
					responseLanguage: responseLanguage?.value || "auto",
					translateResults: Boolean(translateResults?.checked),
					generateSvgGraphics: Boolean(generateSvgGraphics?.checked),
					mcp: collectMcpConfigurations(mcpSection)
				},
				speech: { language: speechLanguage?.value || "en-US" },
				core: {
					...current.core,
					ntpEnabled: readCheckboxValue(ntpEnabled, Boolean(current.core?.ntpEnabled)),
					mode: readTrimmedControlValue(coreMode, current.core?.mode || "native") || "native",
					endpointUrl: readTrimmedControlValue(coreEndpointUrl, current.core?.endpointUrl || ""),
					userId: readTrimmedControlValue(coreUserId, current.core?.userId || ""),
					userKey: readTrimmedControlValue(coreUserKey, current.core?.userKey || ""),
					encrypt: readCheckboxValue(coreEncrypt, Boolean(current.core?.encrypt)),
					preferBackendSync: readCheckboxValue(corePreferBackendSync, (current.core?.preferBackendSync ?? true) !== false),
					appClientId: readTrimmedControlValue(coreAppClientId, current.core?.appClientId || ""),
					allowInsecureTls: readCheckboxValue(coreAllowInsecureTls, Boolean(current.core?.allowInsecureTls)),
					useCoreIdentityForAirPad: readCheckboxValue(coreUseCoreIdentityAirpad, (current.core?.useCoreIdentityForAirPad ?? true) !== false),
					socket: (() => {
						const prev = { ...current.core?.socket || {} };
						delete prev.airpadAuthToken;
						return {
							...prev,
							accessToken: readTrimmedControlValue(coreSocketAccessToken, current.core?.socket?.accessToken || current.core?.socket?.airpadAuthToken || ""),
							routeTarget: readTrimmedControlValue(coreSocketRouteTarget, current.core?.socket?.routeTarget || ""),
							selfId: "",
							clientAccessToken: readTrimmedControlValue(coreSocketClientAccessToken, current.core?.socket?.clientAccessToken || ""),
							allowAccessTokenWithoutUserKey: readCheckboxValue(coreSocketAllowAccessWithoutUserKey, Boolean(current.core?.socket?.allowAccessTokenWithoutUserKey))
						};
					})(),
					admin: {
						...current.core?.admin || {},
						httpsOrigin: readTrimmedControlValue(coreAdminHttps, current.core?.admin?.httpsOrigin || ""),
						httpOrigin: readTrimmedControlValue(coreAdminHttp, current.core?.admin?.httpOrigin || ""),
						path: readTrimmedControlValue(coreAdminPath, current.core?.admin?.path || "/") || "/"
					},
					ops: {
						...current.core?.ops || {},
						allowUnencrypted: readCheckboxValue(coreOpsAllowUnencrypted, Boolean(current.core?.ops?.allowUnencrypted))
					}
				},
				shell: {
					...current.shell || {},
					maintainHubSocketConnection: readCheckboxValue(shellMaintainHubSocket, Boolean(current.shell?.maintainHubSocketConnection)),
					clipboardBroadcastTargets: readTrimmedControlValue(shellClipboardBroadcastTargets, current.shell?.clipboardBroadcastTargets || ""),
					pushLocalClipboardToLan: readCheckboxValue(shellPushLocalClipboard, Boolean(current.shell?.pushLocalClipboardToLan)),
					clipboardPushIntervalMs: (() => {
						const raw = shellClipboardPushIntervalMs?.value;
						const n = parseNumberOrDefault(raw, current.shell?.clipboardPushIntervalMs ?? 2e3);
						return Math.min(6e4, Math.max(800, Math.round(n)));
					})(),
					enableRemoteClipboardBridge: readCheckboxValue(shellClipboard, (current.shell?.enableRemoteClipboardBridge ?? true) !== false),
					acceptInboundClipboardData: readCheckboxValue(shellAcceptInboundClipboard, (current.shell?.acceptInboundClipboardData ?? true) !== false),
					clipboardInboundAllowIds: readTrimmedControlValue(shellClipboardInboundAllowIds, current.shell?.clipboardInboundAllowIds || ""),
					accessTokenBypassesClipboardAllowlist: readCheckboxValue(shellAccessTokenBypassClipboardAllow, Boolean(current.shell?.accessTokenBypassesClipboardAllowlist)),
					clipboardShareDestinationIds: readTrimmedControlValue(shellClipboardShareDestIds, current.shell?.clipboardShareDestinationIds || ""),
					applyRemoteClipboardToDevice: readCheckboxValue(shellApplyRemoteDevice, (current.shell?.applyRemoteClipboardToDevice ?? true) !== false),
					acceptContactsBridgeData: readCheckboxValue(shellAcceptContactsBridge, Boolean(current.shell?.acceptContactsBridgeData)),
					acceptSmsBridgeData: readCheckboxValue(shellAcceptSmsBridge, Boolean(current.shell?.acceptSmsBridgeData)),
					enableNativeSms: readCheckboxValue(shellSms, (current.shell?.enableNativeSms ?? true) !== false),
					enableNativeContacts: readCheckboxValue(shellContacts, (current.shell?.enableNativeContacts ?? true) !== false)
				},
				appearance: {
					theme: theme?.value || "auto",
					fontSize: fontSize?.value || "medium",
					markdown: {
						preset: markdownPreset?.value || "default",
						fontFamily: markdownFontFamily?.value || "system",
						fontSizePx: parseNumberOrDefault(markdownFontSizePx?.value, 16),
						lineHeight: parseFloatInRange(markdownLineHeight?.value, 1.7, 1.1, 2.2),
						contentMaxWidthPx: parseNumberOrDefault(markdownContentMaxWidthPx?.value, 860),
						printScale: parseFloatInRange(markdownPrintScale?.value, 1, .5, 1.5),
						page: {
							size: markdownPageSize?.value || "auto",
							orientation: markdownPageOrientation?.value || "portrait",
							marginMm: parseNumberOrDefault(markdownPageMarginMm?.value, 12)
						},
						modules: {
							typography: (markdownModuleTypography?.checked ?? true) !== false,
							lists: (markdownModuleLists?.checked ?? true) !== false,
							tables: (markdownModuleTables?.checked ?? true) !== false,
							codeBlocks: (markdownModuleCodeBlocks?.checked ?? true) !== false,
							blockquotes: (markdownModuleBlockquotes?.checked ?? true) !== false,
							media: (markdownModuleMedia?.checked ?? true) !== false,
							printBreaks: (markdownModulePrintBreaks?.checked ?? true) !== false
						},
						plugins: {
							smartTypography: Boolean(markdownPluginSmartTypography?.checked),
							softBreaksAsBr: Boolean(markdownPluginSoftBreaks?.checked),
							externalLinksNewTab: (markdownPluginExternalLinks?.checked ?? true) !== false
						},
						customCss: markdownCustomCss?.value || "",
						printCss: markdownPrintCss?.value || "",
						extensions: parsedMarkdownExtensions || []
					}
				}
			});
			import("./hub-socket-boot.js").then((n) => n.n).then((m) => m.applyHubSocketFromSettings(saved));
			applyTheme(saved);
			opts.onTheme?.(saved.appearance?.theme || "auto");
			setNote("Saved.");
		})().catch((err) => setNote(String(err)));
	});
	if (opts.isExtension) {
		if (extSection) extSection.hidden = false;
		if (extTab) extTab.hidden = false;
		const extNote = H`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;
		root.append(extNote);
	}
	switchSettingsTab(resolveInitialTab(opts.initialTab));
	syncCustomModelVisibility();
	return root;
};
//#endregion
//#region ../../modules/views/settings-view/src/index.ts
var defaultSettings = {
	appearance: {
		theme: "auto",
		fontSize: "medium"
	},
	ai: { autoProcess: true },
	general: {
		autosave: true,
		notifications: true
	}
};
var SettingsView = class {
	id = "settings";
	name = "Settings";
	icon = "gear";
	options;
	shellContext;
	element = null;
	settings = ref(defaultSettings);
	_sheet = null;
	lifecycle = {
		onUnmount: () => {
			try {
				if (this._sheet) removeAdopted(this._sheet);
			} catch {}
			this._sheet = null;
		},
		onShow: () => {
			this._sheet ??= loadAsAdopted(Settings_default);
		},
		onHide: () => {
			try {
				if (this._sheet) removeAdopted(this._sheet);
			} catch {}
			this._sheet = null;
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.loadSettings();
		this.element = createSettingsView({
			isExtension: false,
			initialTab: options?.params?.tab || options?.params?.focus,
			onTheme: (theme) => {
				this.options.onThemeChange?.(theme);
			}
		});
		return this.element;
	}
	getToolbar() {
		return null;
	}
	setupEventHandlers() {}
	loadSettings() {
		this.settings.value = { ...defaultSettings };
	}
	saveSettings() {
		this.options.onSettingsChange?.(this.settings.value);
	}
	resetSettings() {
		this.settings.value = { ...defaultSettings };
		this.updateUI();
	}
	updateUI() {
		if (!this.element) return;
		const inputs = this.element.querySelectorAll("[data-setting]");
		for (const input of inputs) {
			const [section, key] = input.dataset.setting.split(".");
			const value = this.settings.value[section][key];
			if (input.type === "checkbox") input.checked = Boolean(value);
			else input.value = value || "";
		}
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	canHandleMessage(messageType) {
		return messageType === "settings-update";
	}
	async handleMessage(message) {
		const msg = message;
		if (msg.data) {
			this.settings.value = {
				...this.settings.value,
				...msg.data
			};
			this.updateUI();
		}
	}
	invokeChannelApi(action, payload) {
		if (action === SettingsChannelAction.Patch || action === SettingsChannelAction.SettingsUpdate) {
			this.handleMessage({ data: payload });
			(async () => {
				try {
					const [{ loadSettings }, { applyTheme }] = await Promise.all([import("./Settings.js").then((n) => n.t), import("./Theme.js").then((n) => n.t)]);
					const cur = await loadSettings();
					const patch = payload;
					applyTheme({
						...cur,
						...patch,
						appearance: {
							...cur.appearance || {},
							...patch.appearance || {}
						}
					});
				} catch (e) {
					console.warn("[SettingsView] channel applyTheme failed:", e);
				}
			})();
			return true;
		}
	}
};
function createView(options) {
	return new SettingsView(options);
}
//#endregion
export { SettingsView, createView, createView as default };
