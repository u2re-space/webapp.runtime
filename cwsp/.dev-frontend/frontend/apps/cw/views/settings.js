import { h as applyAirpadRuntimeFromAppSettings } from "./airpad.js";
import { Fn as loadAsAdopted, Rn as removeAdopted, S as setString, Tn as DEFAULT_INSTRUCTION_TEMPLATES, U as applyTheme, an as H, fn as ref, ht as BUILTIN_AI_MODELS, mt as saveSettings, pt as loadSettings, un as observe, v as StorageKeys } from "../com/app.js";
import { C as getInstructionRegistry, E as openAdminDoorFromCore, O as resolveAdminDoorUrls, T as updateInstruction, _ as addInstruction, v as addInstructions, w as setActiveInstruction, y as deleteInstruction } from "../com/service.js";
import { o as navigateToView } from "../shells/boot-index.js";
//#region src/frontend/views/settings/scss/Settings.scss?inline
var Settings_default = "@property --client-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --client-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --sp-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --sp-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rx{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ry{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --scroll-coef{syntax:\"<number>\";initial-value:1;inherits:true}@property --scroll-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --content-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --max-size{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:root:has([data-view=settings]),html:has([data-view=settings]){--view-layout:\"flex\";--view-sidebar-visible:true;--view-padding:var(--space-6);--view-content-max-width:none;--view-section-gap:var(--space-8);--view-field-gap:var(--space-4);--view-label-color:var(--color-text-secondary);--settings-divider:color-mix(in oklab,var(--color-outline-variant) 32%,transparent);--settings-card-surface:color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface));--settings-card-edge:color-mix(in oklab,var(--color-outline-variant) 16%,transparent);--settings-card-shadow:0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent);--settings-chip-edge:color-mix(in oklab,var(--color-outline-variant) 12%,transparent)}}@layer components{.view-settings{align-content:stretch;background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;justify-items:stretch;margin-inline:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:.25rem;row-gap:0;text-align:start}.view-settings [data-action=save]{justify-self:start}.view-settings :where(select,input,textarea,option){pointer-events:auto}.view-settings textarea{box-sizing:border-box;container-type:inline-size;inline-size:stretch;max-inline-size:stretch;resize:block}.view-settings h2{color:var(--color-on-surface);font-size:var(--text-xl,20px);font-weight:var(--font-weight-bold,700);letter-spacing:-.02em;margin:0}.view-settings h3{text-align:start}.view-settings .card{background:var(--settings-card-surface,color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface)));border:none;border-radius:var(--radius-xl,16px);box-shadow:var(--settings-card-shadow,0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent)),0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 16%,transparent));display:flex;flex-direction:column;gap:var(--spacing-md,12px);inline-size:stretch;padding:var(--spacing-md,16px)}@container (max-inline-size: 480px){.view-settings .card{border-radius:var(--radius-lg,14px);gap:var(--spacing-sm,10px);padding:var(--spacing-md,14px)}}.view-settings .card h3{color:var(--color-on-surface);font-size:var(--text-base,15px);font-weight:var(--font-weight-semibold,600);letter-spacing:-.01em;margin:0}.view-settings .card .form-select{inline-size:stretch}.view-settings .field{display:grid;flex-direction:column;font-size:var(--text-xs,12px);gap:var(--spacing-xs,6px);grid-auto-flow:row;inline-size:stretch}.view-settings .field>span{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);opacity:.85}.view-settings .field.checkbox{align-items:center;gap:var(--spacing-sm,10px);grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .mcp-actions{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;margin-block-start:var(--space-xs,8px)}.view-settings .mcp-section{display:flex;flex-direction:column;gap:var(--space-sm,8px)}.view-settings .mcp-row{background:color-mix(in oklab,var(--color-surface-container-low) 88%,var(--color-surface));border:none;border-radius:var(--radius-lg,14px);box-shadow:inset 0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 14%,transparent));display:grid;gap:var(--space-sm,8px);padding:var(--space-md,12px)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);margin:0;opacity:.85}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));display:flex;flex-direction:column;flex-shrink:0;gap:var(--space-sm);min-inline-size:0;padding-block-end:var(--space-md)}.view-settings .settings-screen__title{font-weight:var(--font-weight-semibold,600);letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;overflow-block:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:var(--space-lg);overscroll-behavior:contain;padding-block:var(--space-md);scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--color-outline-variant) 45%,transparent);border-radius:99px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb:hover{background:color-mix(in oklab,var(--color-outline) 55%,transparent)}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--color-surface-container-low,var(--color-surface-container)) 72%,var(--color-surface));border-block-start:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));box-shadow:0 -12px 28px color-mix(in oklab,var(--color-on-surface) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:var(--space-sm);inline-size:stretch;justify-content:start;margin-block-start:0;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:var(--space-xs,6px);inline-size:stretch;justify-content:flex-start;max-inline-size:stretch;overflow-x:auto;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--color-surface-container-low) 94%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface-variant);cursor:pointer;font-size:var(--text-xs,12px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem .875rem;transition:background-color var(--motion-fast),color var(--motion-fast),box-shadow var(--motion-fast)}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--color-surface-container) 92%,transparent);color:var(--color-on-surface)}.view-settings .settings-tab-btn.is-active{background:var(--color-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--color-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 40%,transparent);color:var(--color-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active{display:flex}.view-settings .btn{background:color-mix(in oklab,var(--color-surface-container) 88%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface);cursor:pointer;font-family:inherit;font-size:var(--text-sm,13px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),filter var(--motion-fast)}.view-settings .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 6%,transparent)}.view-settings .btn.primary{background:var(--color-primary);border-color:transparent;box-shadow:0 2px 14px color-mix(in oklab,var(--color-primary) 32%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 55%,transparent);color:var(--color-on-primary,#fff)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .ext-note,.view-settings .note{color:var(--color-on-surface-variant);display:block;flex-grow:0;flex-shrink:1;font-size:var(--text-xs,12px);max-inline-size:stretch;opacity:.9;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:nowrap}.view-settings .ext-note{opacity:.8}.view-settings .ext-note code{background:var(--color-surface-container-highest);border-radius:var(--radius-xs,4px);font-size:var(--text-xs,11px);padding:2px 4px}@container (max-inline-size: 1024px){.view-settings{padding:var(--space-md)}}@container (max-inline-size: 768px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{font-size:var(--text-lg,17px)}.view-settings .settings-screen__top{gap:var(--space-md)}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.375rem}.view-settings .settings-tab-btn{min-block-size:2.75rem;padding-inline:.75rem}}@container (max-inline-size: 480px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:var(--space-md);padding-block:var(--space-sm)}.view-settings .settings-screen__footer{align-items:stretch;box-shadow:0 -8px 24px color-mix(in oklab,var(--color-on-surface) 5%,transparent);flex-direction:column-reverse;gap:var(--space-sm);inline-size:stretch;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}.view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings__title{font-size:1.75rem;font-weight:var(--font-weight-bold,700);margin:0 0 2rem}.view-settings__section{border-block-end:1px solid var(--view-border,rgba(0,0,0,.1));display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings__section:last-of-type{border-block-end:none}.view-settings__section h2{color:var(--view-fg);font-size:1.125rem;font-weight:var(--font-weight-semibold,600);margin:0 0 1rem}.view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings__label>span{font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500)}.view-settings__actions{display:flex;gap:.75rem;margin-block-start:2rem}.view-settings__btn{background:transparent;border:1px solid var(--view-border,rgba(0,0,0,.15));border-radius:var(--radius-sm,6px);color:var(--view-fg);cursor:pointer;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);padding:.625rem 1.25rem;transition:background-color var(--motion-fast)}.view-settings__btn:hover{background-color:rgba(0,0,0,.05)}.view-settings__btn--primary{background-color:var(--color-primary,#007acc);border-color:var(--color-primary,#007acc);color:white}.view-settings__btn--primary:hover{filter:brightness(1.1)}.settings-group{display:grid;gap:var(--space-lg);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.settings-section{background:var(--color-surface-container-high);border-radius:var(--radius-xl);box-shadow:var(--elev-2);overflow:hidden;padding:var(--space-xl);position:relative;transition:all var(--motion-normal)}@container (max-inline-size: 1024px){.settings-section{border-radius:var(--radius-lg);padding:var(--space-lg)}}@container (max-inline-size: 768px){.settings-section{padding:var(--space-md)}}@container (max-inline-size: 480px){.settings-section{border-radius:var(--radius-md);padding:var(--space-sm)}}.settings-section:hover{box-shadow:var(--elev-3);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.settings-section:hover{transform:none}}.settings-section:before{background:linear-gradient(135deg,color-mix(in oklab,var(--color-tertiary) 2%,transparent) 0,transparent 100%);border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute}.settings-section>*{position:relative;z-index:1}.settings-section .settings-header{margin-block-end:var(--space-lg);padding-block-end:var(--space-md)}.settings-section .settings-header h3{align-items:start;color:var(--color-on-surface);display:flex;font-size:var(--text-lg);font-weight:var(--font-weight-semibold);gap:var(--space-sm);margin:0}@container (max-inline-size: 768px){.settings-section .settings-header h3{font-size:var(--text-base)}}.settings-section .settings-header h3 ui-icon{margin-inline-end:var(--space-sm);opacity:.7}.settings-section .form-group{margin-block-end:var(--space-lg)}.settings-section .form-group:last-child{margin-block-end:0}.settings-section .form-group label{color:var(--color-on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-end:var(--space-sm)}.settings-section .form-group textarea{font-family:var(--font-family-mono);min-block-size:100px;resize:vertical}.settings-section .settings-actions{display:flex;flex-wrap:nowrap;gap:var(--space-md);justify-content:flex-end;margin-block-start:var(--space-xl);padding-block-start:var(--space-lg)}@container (max-inline-size: 768px){.settings-section .settings-actions{flex-direction:column;gap:var(--space-sm)}}.settings-section .settings-actions .action-btn{background:var(--color-surface-container-high);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);min-block-size:44px;padding-block:var(--space-xl);padding-inline:var(--space-sm);transition:all var(--motion-fast)}.settings-section .settings-actions .action-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);transform:translateY(-1px)}.settings-section .settings-actions .action-btn:active{box-shadow:none;transform:translateY(0)}.settings-section .settings-actions .action-btn.primary{background:var(--color-tertiary);color:var(--color-on-tertiary)}.settings-section .settings-actions .action-btn.primary:hover{background:color-mix(in oklab,var(--color-tertiary) 85%,black)}}@layer view.settings{.settings-panel{aspect-ratio:auto;block-size:stretch;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-lg,12px);display:flex;flex-direction:column;flex-wrap:nowrap;inline-size:stretch;place-content:center;justify-content:start;overflow-x:hidden;overflow-y:auto;place-items:center;align-items:center;backdrop-filter:blur(1rem);background-color:oklch(from --c2-surface(.15,var(--current,currentColor)) l c h/.9);border-radius:0;border-width:0;grid-row:1/-1;max-block-size:none;scrollbar-color:var(--surface-opacity-emphasis) transparent;scrollbar-width:thin}.settings-panel,.settings-panel :where(button,input,textarea,select){touch-action:pan-y}.settings-panel [data-shape]{pointer-events:none;touch-action:pan-y}.settings-panel .panel-header{display:grid;gap:var(--gap-xs);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;padding:var(--padding-sm);place-content:center;place-items:center;position:relative;text-align:start}.settings-panel .panel-header h2{font-size:var(--font-xl);margin:0}.settings-panel .panel-header p{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);font-size:var(--font-sm);margin:0}.settings-panel .settings-group{background-color:var(--fl-surface,#fff);block-size:max-content;border:0 transparent;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);display:flex;flex-direction:column;flex-wrap:nowrap;inline-size:stretch;justify-content:start;line-height:normal;max-block-size:none;max-inline-size:stretch;min-inline-size:fit-content;overflow:visible;padding-inline:var(--padding-xl,1.5rem);place-content:center;place-items:center;text-align:center}.settings-panel .settings-group:not(.is-collapsible){block-size:max-content;display:flex;flex-direction:column;flex-wrap:nowrap;gap:var(--gap-md);inline-size:stretch;max-block-size:none;padding:var(--padding-lg);padding-inline:var(--padding-xl,1.5rem)}.settings-panel .settings-group.is-collapsible{padding:0}.settings-panel .settings-group.is-collapsible summary{cursor:pointer;display:flex;flex-direction:column;gap:var(--gap-xs);list-style:none;outline:none;padding:var(--padding-lg)}.settings-panel .settings-group.is-collapsible .group-body{block-size:fit-content;display:grid;gap:var(--gap-md);grid-template-columns:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;padding:0 var(--padding-lg) var(--padding-lg);place-content:center;place-items:center;text-align:center}.settings-panel .settings-group .group-header{block-size:max-content;display:flex;flex-direction:column;flex-wrap:nowrap;gap:var(--gap-xs);line-height:normal;min-inline-size:0;place-content:center;place-items:center;position:relative;text-align:center}.settings-panel .settings-group .group-header h3{block-size:max-content;font-size:var(--font-md);line-height:normal;margin:0;max-block-size:none;text-align:center}.settings-panel .settings-group .group-header p{block-size:max-content;color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm);line-height:normal;margin:0;max-block-size:none}.settings-panel .settings-group .group-title{font-size:var(--font-base);font-weight:var(--font-weight-semibold)}.settings-panel .settings-group .group-note{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm)}.settings-panel .settings-group .group-body{block-size:fit-content;display:grid;gap:var(--gap-md);grid-template-columns:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;place-content:center;place-items:center;text-align:center}.settings-actions{align-items:center;display:flex;gap:var(--gap-md);grid-column:1/-1;justify-content:space-between;margin-block-start:var(--gap-sm);overflow:visible;padding:var(--padding-sm)}.settings-actions .btn.save{background:transparent;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-md,10px);color:inherit}.settings-actions .save-status{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm)}.view-settings{align-content:stretch;aspect-ratio:auto;background-color:initial;block-size:stretch;border-radius:0;display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:stretch;justify-items:stretch;max-block-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;padding:.25rem;row-gap:0;-webkit-overflow-scrolling:touch;contain:layout paint}.view-settings header{margin:0;min-inline-size:0;padding:0}.view-settings header,.view-settings header h1,.view-settings header h2,.view-settings header p,.view-settings header span,.view-settings span{block-size:max-content;line-height:normal}.settings-form{aspect-ratio:auto;block-size:max-content;border-radius:var(--radius-lg);border-style:solid;border-width:.5px;box-shadow:none;contain:inline-size layout paint style;display:flex;flex-direction:column;gap:var(--gap-xl);grid-template-rows:minmax(0,1fr) minmax(0,max-content);inline-size:fit-content;max-inline-size:stretch;min-inline-size:min(100%,40rem);padding:var(--padding-lg);place-content:center;place-items:center}.settings-form .settings-panels{display:grid;gap:var(--gap-xl);inline-size:stretch;max-inline-size:stretch;min-inline-size:0}.settings-form>*{box-sizing:border-box;inline-size:stretch;max-inline-size:stretch;min-inline-size:fit-content}.settings-hero{align-items:center;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);gap:var(--gap-lg);grid-template-columns:auto 1fr;padding:var(--padding-xl)}.settings-hero,.settings-hero .hero-icon{background-color:var(--fl-surface,#fff);display:grid}.settings-hero .hero-icon{block-size:clamp(3rem,4vw,3.5rem);border-radius:50%;color:var(--fl-on-surface,#111);inline-size:clamp(3rem,4vw,3.5rem);place-items:center}.settings-hero .hero-icon ui-icon{--icon-size:clamp(1.6rem,2.4vw,1.9rem);--icon-color:currentColor}.settings-hero .hero-body{display:grid;gap:var(--gap-sm);min-inline-size:0}.settings-hero .hero-body h1{font-size:var(--font-2xl);font-weight:var(--font-weight-bold);margin:0}.settings-hero .hero-body p{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);font-size:var(--font-base);margin:0}.settings-nav{border-radius:var(--radius-lg);display:flex;gap:var(--gap-md);overflow-block:hidden;overflow-inline:auto;padding:var(--padding-xs);scrollbar-color:oklch(from --c2-on-surface(var(--scrollbar-tint),var(--current,var(--color-on-surface,var(--md-on-surface,#1c1b1f)))) l c h/var(--scrollbar-opacity)) transparent;scrollbar-width:thin;-webkit-overflow-scrolling:touch}.settings-nav::-webkit-scrollbar{block-size:6px;inline-size:6px}.settings-nav::-webkit-scrollbar-thumb{background-color:oklch(from --c2-on-surface(var(--scrollbar-tint),var(--current,var(--color-on-surface,var(--md-on-surface,#1c1b1f)))) l c h/var(--scrollbar-opacity));border-radius:var(--radius-full)}.settings-nav::-webkit-scrollbar-track{background-color:initial}.settings-nav{scrollbar-width:none;-ms-overflow-style:none}.settings-nav::-webkit-scrollbar{display:none}.settings-nav{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.settings-nav .settings-tab{align-items:center;background:transparent;border-radius:var(--radius-full);cursor:pointer;display:flex;font-size:var(--font-sm);gap:var(--gap-sm);justify-content:center;padding:var(--padding-sm) var(--padding-lg);transition:var(--transition-colors);white-space:nowrap}.settings-nav .settings-tab ui-icon{--icon-size:var(--icon-size-md)}.settings-nav .settings-tab.is-active{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.settings-nav .settings-tab:where(:hover,:focus-visible):not(.is-active){background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.settings-actions-group{background:linear-gradient(135deg,var(--surface-opacity-subtle),var(--surface-opacity-muted));border:0 transparent;border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);overflow:visible;padding:var(--padding-sm);place-content:center;place-items:center;text-align:center}.settings-actions-group header,.settings-actions-group p{block-size:max-content;inline-size:max-content;line-height:normal;max-block-size:none;min-inline-size:0;place-content:center;place-items:center;text-align:center}.mcp-actions{background:linear-gradient(135deg,var(--surface-opacity-subtle),var(--surface-opacity-muted));border:0 transparent;border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);order:99;overflow:visible;padding:var(--padding-sm);place-content:center;place-items:center;text-align:center}.mcp-actions header,.mcp-actions p{block-size:max-content;inline-size:max-content;line-height:normal;max-block-size:none;min-inline-size:0;place-content:center;place-items:center;text-align:center}.mcp-actions .add-mcp{background:transparent;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-md,10px);color:inherit}.mcp-actions .add-mcp:active{transform:translateY(0)}.mcp-actions .add-mcp ui-icon{--icon-size:var(--icon-size-md);transition:transform var(--transition-colors)}.mcp-actions .add-mcp:where(:hover,:focus-visible) ui-icon{transform:rotate(90deg)}.color-option{--current:attr(data-color type(<color>));appearance:none;aspect-ratio:1/1;background-color:attr(data-color type(<color>))!important;block-size:2.5rem;border:2px solid transparent;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.1);cursor:pointer;font-size:0;inline-size:2.5rem;line-height:0;margin:0;max-block-size:2.5rem;max-inline-size:2.5rem;min-block-size:fit-content;min-inline-size:fit-content;outline:none;padding:1rem}.shape-palette-grid{align-items:center;display:flex;flex-wrap:wrap;gap:var(--gap-sm);justify-content:flex-start;padding:var(--padding-xs)}.shape-option{align-items:center;aspect-ratio:1/1.2;background:transparent;block-size:max-content;border:2px solid transparent;border-radius:var(--radius-md);cursor:pointer;display:flex;flex-direction:column;gap:var(--gap-xs);min-inline-size:4.5rem;padding:var(--padding-sm);transition:all var(--transition-fast) ease-out}.shape-option,.shape-option:hover{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.shape-option:hover{transform:translateY(-2px)}.shape-option.is-selected{background-color:var(--fl-surface,#fff);border-color:var(--primary,currentColor);color:var(--fl-on-surface,#111)}.shape-option .shape-preview{aspect-ratio:1/1;background-color:var(--on-surface,currentColor);block-size:2.5rem;inline-size:2.5rem;opacity:.7;transition:all var(--transition-fast) ease-out}.shape-option.is-selected .shape-preview{background-color:var(--primary,currentColor);opacity:1}.shape-option:hover .shape-preview{opacity:1}.shape-option .shape-label{color:var(--on-surface,currentColor);font-size:var(--font-xs);opacity:.7;text-align:center;white-space:nowrap}.shape-option.is-selected .shape-label{font-weight:var(--font-weight-medium);opacity:1}.mcp-config{background-color:var(--fl-surface,#fff);border:0 transparent;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);margin-block-end:var(--gap-md);order:calc(1 + sibling-index());overflow:hidden;padding:var(--padding-lg);position:relative;transition:all var(--transition-colors) ease-in-out}.mcp-config:before{background:linear-gradient(135deg,var(--primary-opacity-subtle) 0,transparent 50%,var(--secondary-opacity-subtle) 100%);content:\"\";inset:0;opacity:0;pointer-events:none;position:absolute;transition:opacity var(--transition-colors)}.mcp-config:where(:hover,:focus-visible,:focus-within){border-color:var(--primary-opacity-default);border-width:0}.mcp-config:where(:hover,:focus-visible,:focus-within):before{opacity:1}.mcp-config .mcp-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:var(--gap-md);position:relative;z-index:1}.mcp-config .mcp-header h4{align-items:center;color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);display:flex;font-size:var(--font-md);font-weight:var(--font-weight-semibold);gap:var(--gap-xs);margin:0}.mcp-config .mcp-header h4:before{content:\"🔌\";font-size:var(--font-sm);opacity:.7}.mcp-config .mcp-header .remove-mcp{border-radius:var(--radius-full);font-size:var(--font-xs);gap:var(--gap-xs);overflow:hidden;padding:var(--padding-xs) var(--padding-sm);position:relative;transition:all var(--transition-colors) ease-in-out}.mcp-config .mcp-header .remove-mcp:before{background:radial-gradient(circle,var(--danger-opacity-muted) 0,transparent 70%);content:\"\";inset:0;position:absolute;transform:scale(0);transition:transform var(--transition-colors)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible){background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111);transform:scale(1.05)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible):before{transform:scale(1)}.mcp-config .mcp-header .remove-mcp:active{transform:scale(.95)}.mcp-config .mcp-header .remove-mcp ui-icon{--icon-size:var(--icon-size-sm);transition:transform var(--transition-colors)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible) ui-icon{transform:rotate(180deg)}.mcp-config .mcp-fields{display:grid;gap:var(--gap-md);position:relative;z-index:1}.mcp-config.mcp-config-new{animation:slideInUp .3s ease-out}@media (max-width:768px){.view-settings .settings-screen__footer{align-items:stretch;flex-direction:column-reverse;gap:var(--space-sm);justify-content:start;overflow:visible}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center}.settings-hero{grid-template-columns:1fr;justify-items:center;text-align:center}.settings-nav .settings-tab{flex:1 0 auto}.settings-panel{padding:var(--padding-lg)}}.settings-form,.settings-panel{place-content:start!important;align-content:flex-start!important;justify-content:flex-start!important;place-items:stretch!important;align-items:stretch!important;text-align:start!important}.view-settings{text-align:start!important}.view-settings :where(input:not([type=checkbox]):not([type=radio]),select,textarea,button){font-size:.875rem;line-height:1.25;min-block-size:2rem}.view-settings :where(input[type=checkbox],input[type=radio]){box-sizing:border-box;min-block-size:unset;min-inline-size:unset}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{align-self:center;aspect-ratio:1;block-size:1.25rem;border-radius:var(--radius-xs,4px);flex-shrink:0;inline-size:1.25rem;min-block-size:1.25rem}.view-settings .settings-tab-actions{flex-wrap:nowrap}}@layer tokens{:root:has([data-view=settings]),html:has([data-view=settings]){--view-layout:\"flex\";--view-sidebar-visible:true;--view-padding:var(--space-6);--view-content-max-width:none;--view-section-gap:var(--space-8);--view-field-gap:var(--space-4);--view-label-color:var(--color-text-secondary);--settings-divider:color-mix(in oklab,var(--color-outline-variant) 32%,transparent);--settings-card-surface:color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface));--settings-card-edge:color-mix(in oklab,var(--color-outline-variant) 16%,transparent);--settings-card-shadow:0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent);--settings-chip-edge:color-mix(in oklab,var(--color-outline-variant) 12%,transparent)}}@layer components{.view-settings{align-content:stretch;background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;justify-items:stretch;margin-inline:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:var(--space-lg);row-gap:0;text-align:start}.view-settings :where(select,input,textarea,option){pointer-events:auto}.view-settings textarea{box-sizing:border-box;container-type:inline-size;inline-size:stretch;max-inline-size:stretch;resize:block}.view-settings h2{color:var(--color-on-surface);font-size:var(--text-xl,20px);font-weight:var(--font-weight-bold,700);letter-spacing:-.02em;margin:0}.view-settings h3{text-align:start}.view-settings .card{background:var(--settings-card-surface,color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface)));border:none;border-radius:var(--radius-xl,16px);box-shadow:var(--settings-card-shadow,0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent)),0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 16%,transparent));display:flex;flex-direction:column;gap:var(--spacing-md,12px);inline-size:stretch;padding:var(--spacing-md,16px)}@container (max-inline-size: 480px){.view-settings .card{border-radius:var(--radius-lg,14px);gap:var(--spacing-sm,10px);padding:var(--spacing-md,14px)}}.view-settings .card h3{color:var(--color-on-surface);font-size:var(--text-base,15px);font-weight:var(--font-weight-semibold,600);letter-spacing:-.01em;margin:0}.view-settings .card .form-select{inline-size:stretch}.view-settings .field{display:grid;flex-direction:column;font-size:var(--text-xs,12px);gap:var(--spacing-xs,6px);grid-auto-flow:row;inline-size:stretch}.view-settings .field>span{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);opacity:.85}.view-settings .field.checkbox{align-items:center;gap:var(--spacing-sm,10px);grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .mcp-actions{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;margin-block-start:var(--space-xs,8px)}.view-settings .mcp-section{display:flex;flex-direction:column;gap:var(--space-sm,8px)}.view-settings .mcp-row{background:color-mix(in oklab,var(--color-surface-container-low) 88%,var(--color-surface));border:none;border-radius:var(--radius-lg,14px);box-shadow:inset 0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 14%,transparent));display:grid;gap:var(--space-sm,8px);padding:var(--space-md,12px)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);margin:0;opacity:.85}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));display:flex;flex-direction:column;flex-shrink:0;gap:var(--space-sm);min-inline-size:0;padding-block-end:var(--space-md)}.view-settings .settings-screen__title{font-weight:var(--font-weight-semibold,600);letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;overflow-block:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:var(--space-lg);overscroll-behavior:contain;padding-block:var(--space-md);scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--color-outline-variant) 45%,transparent);border-radius:99px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb:hover{background:color-mix(in oklab,var(--color-outline) 55%,transparent)}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--color-surface-container-low,var(--color-surface-container)) 72%,var(--color-surface));border-block-start:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));box-shadow:0 -12px 28px color-mix(in oklab,var(--color-on-surface) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:var(--space-sm);inline-size:stretch;justify-content:start;margin-block-start:0;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:var(--space-xs,6px);inline-size:stretch;justify-content:flex-start}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--color-surface-container-low) 94%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface-variant);cursor:pointer;font-size:var(--text-xs,12px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem .875rem;transition:background-color var(--motion-fast),color var(--motion-fast),box-shadow var(--motion-fast)}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--color-surface-container) 92%,transparent);color:var(--color-on-surface)}.view-settings .settings-tab-btn.is-active{background:var(--color-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--color-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 40%,transparent);color:var(--color-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active{display:flex}.view-settings .btn{background:color-mix(in oklab,var(--color-surface-container) 88%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface);cursor:pointer;font-family:inherit;font-size:var(--text-sm,13px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),filter var(--motion-fast)}.view-settings .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 6%,transparent)}.view-settings .btn.primary{background:var(--color-primary);border-color:transparent;box-shadow:0 2px 14px color-mix(in oklab,var(--color-primary) 32%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 55%,transparent);color:var(--color-on-primary,#fff)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .ext-note,.view-settings .note{color:var(--color-on-surface-variant);display:block;flex-grow:0;flex-shrink:1;font-size:var(--text-xs,12px);max-inline-size:stretch;opacity:.9;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:nowrap}.view-settings .ext-note{opacity:.8}.view-settings .ext-note code{background:var(--color-surface-container-highest);border-radius:var(--radius-xs,4px);font-size:var(--text-xs,11px);padding:2px 4px}@container (max-inline-size: 1024px){.view-settings{padding:var(--space-md)}}@container (max-inline-size: 768px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{font-size:var(--text-lg,17px)}.view-settings .settings-screen__top{gap:var(--space-md)}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.375rem}.view-settings .settings-tab-btn{min-block-size:2.75rem;padding-inline:.75rem}}@container (max-inline-size: 480px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:var(--space-md);padding-block:var(--space-sm)}.view-settings .settings-screen__footer{align-items:stretch;box-shadow:0 -8px 24px color-mix(in oklab,var(--color-on-surface) 5%,transparent);flex-direction:column-reverse;gap:var(--space-sm);inline-size:stretch;padding-block:var(--space-sm)}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}.view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings__title{font-size:1.75rem;font-weight:var(--font-weight-bold,700);margin:0 0 2rem}.view-settings__section{border-block-end:1px solid var(--view-border,rgba(0,0,0,.1));display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings__section:last-of-type{border-block-end:none}.view-settings__section h2{color:var(--view-fg);font-size:1.125rem;font-weight:var(--font-weight-semibold,600);margin:0 0 1rem}.view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings__label>span{font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500)}.view-settings__actions{display:flex;gap:.75rem;margin-block-start:2rem}.view-settings__btn{background:transparent;border:1px solid var(--view-border,rgba(0,0,0,.15));border-radius:var(--radius-sm,6px);color:var(--view-fg);cursor:pointer;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);padding:.625rem 1.25rem;transition:background-color var(--motion-fast)}.view-settings__btn:hover{background-color:rgba(0,0,0,.05)}.view-settings__btn--primary{background-color:var(--color-primary,#007acc);border-color:var(--color-primary,#007acc);color:white}.view-settings__btn--primary:hover{filter:brightness(1.1)}.settings-group{display:grid;gap:var(--space-lg);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.settings-section{background:var(--color-surface-container-high);border-radius:var(--radius-xl);box-shadow:var(--elev-2);overflow:hidden;padding:var(--space-xl);position:relative;transition:all var(--motion-normal)}@container (max-inline-size: 1024px){.settings-section{border-radius:var(--radius-lg);padding:var(--space-lg)}}@container (max-inline-size: 768px){.settings-section{padding:var(--space-md)}}@container (max-inline-size: 480px){.settings-section{border-radius:var(--radius-md);padding:var(--space-sm)}}.settings-section:hover{box-shadow:var(--elev-3);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.settings-section:hover{transform:none}}.settings-section:before{background:linear-gradient(135deg,color-mix(in oklab,var(--color-tertiary) 2%,transparent) 0,transparent 100%);border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute}.settings-section>*{position:relative;z-index:1}.settings-section .settings-header{margin-block-end:var(--space-lg);padding-block-end:var(--space-md)}.settings-section .settings-header h3{align-items:start;color:var(--color-on-surface);display:flex;font-size:var(--text-lg);font-weight:var(--font-weight-semibold);gap:var(--space-sm);margin:0}@container (max-inline-size: 768px){.settings-section .settings-header h3{font-size:var(--text-base)}}.settings-section .settings-header h3 ui-icon{margin-inline-end:var(--space-sm);opacity:.7}.settings-section .form-group{margin-block-end:var(--space-lg)}.settings-section .form-group:last-child{margin-block-end:0}.settings-section .form-group label{color:var(--color-on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-end:var(--space-sm)}.settings-section .form-group textarea{font-family:var(--font-family-mono);min-block-size:100px;resize:vertical}.settings-section .settings-actions{display:flex;flex-wrap:nowrap;gap:var(--space-md);justify-content:flex-end;margin-block-start:var(--space-xl);padding-block-start:var(--space-lg)}@container (max-inline-size: 768px){.settings-section .settings-actions{flex-direction:column;gap:var(--space-sm)}}.settings-section .settings-actions .action-btn{background:var(--color-surface-container-high);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);min-block-size:44px;padding-block:var(--space-xl);padding-inline:var(--space-sm);transition:all var(--motion-fast)}.settings-section .settings-actions .action-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);transform:translateY(-1px)}.settings-section .settings-actions .action-btn:active{box-shadow:none;transform:translateY(0)}.settings-section .settings-actions .action-btn.primary{background:var(--color-tertiary);color:var(--color-on-tertiary)}.settings-section .settings-actions .action-btn.primary:hover{background:color-mix(in oklab,var(--color-tertiary) 85%,black)}}";
//#endregion
//#region src/frontend/shared/ts/CustomInstructionsEditor.ts
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
//#region src/frontend/views/settings/ts/Settings.ts
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
var createSettingsView = (opts) => {
	loadAsAdopted(Settings_default);
	let note = null;
	const setNote = (text) => {
		if (!note) return;
		note.textContent = text;
		if (text) setTimeout(() => note && (note.textContent = ""), 1500);
	};
	const root = H`<div class="view-settings">

    <header class="settings-screen__top">
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
    </header>

    <div class="settings-screen__body">
    <section class="card settings-tab-panel" data-tab-panel="appearance">
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
    </section>

    <section class="card settings-tab-panel" data-tab-panel="markdown">
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
    </section>

    <section class="card settings-tab-panel is-active" data-tab-panel="ai">
      <h3>AI</h3>
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
    </section>

    <section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>

    <section class="card settings-tab-panel" data-tab-panel="server">
      <h3>Server &amp; admin</h3>
      <p class="field-hint" style="margin: 0 0 0.75rem; opacity: 0.88; font-size: 0.9em;">
        Endpoint, admin doors (HTTPS :8443, HTTP :8080), and <strong>associated identity</strong> for cwsp / endpoint env
        (<code>CWS_ASSOCIATED_ID</code> / <code>CWS_ASSOCIATED_TOKEN</code>).
        When enabled below, the same User ID / User key can back AirPad transport if its overlay fields are empty.
        On <strong>Android (Capacitor cwsp)</strong>, cleartext HTTP to LAN may need <code>&lt;domain&gt;</code> rows in
        <code>resources/android/network_security_config.xml</code> (re-run <code>cap:patch:android-net</code> after <code>cap sync</code>).
        <strong>ADB WebView debug:</strong> run task <code>cwsp: adb forward WebView devtools (9222)</code>, then attach with
        <code>CWSP Android WebView (attach :9222)</code> (device default <code>192.168.0.196:5555</code>, override <code>CWS_ADB_DEVICE</code>).
      </p>
      <label class="field">
        <span>Core mode</span>
        <select class="form-select" data-field="core.mode">
          <option value="native">Native / offline-first</option>
          <option value="endpoint">Endpoint (backend sync)</option>
        </select>
      </label>
      <label class="field">
        <span>Endpoint base URL</span>
        <input class="form-input" type="url" inputmode="url" autocomplete="off" placeholder="https://host:6065 or http://localhost:6065" data-field="core.endpointUrl" />
      </label>
      <label class="field">
        <span>Associated client ID (User ID)</span>
        <input class="form-input" type="text" autocomplete="off" data-field="core.userId" placeholder="CWS_ASSOCIATED_ID / bridge client" />
      </label>
      <label class="field">
        <span>Associated token (User key)</span>
        <input class="form-input" type="password" autocomplete="off" data-field="core.userKey" placeholder="CWS_ASSOCIATED_TOKEN" />
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.useCoreIdentityForAirPad" />
        <span>Use these for AirPad when overlay Client ID / token are empty</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.preferBackendSync" />
        <span>Prefer backend sync when in endpoint mode</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.encrypt" />
        <span>Encrypt transport to endpoint (when supported)</span>
      </label>
      <label class="field">
        <span>Application client ID</span>
        <input class="form-input" type="text" autocomplete="off" placeholder="Optional instance id for this install (cwsp, PWA, …)" data-field="core.appClientId" />
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.allowInsecureTls" />
        <span>Allow insecure / self-signed TLS (native shells only; browsers ignore this for fetch)</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ops.allowUnencrypted" />
        <span>Allow unencrypted HTTP targets in operations (advanced)</span>
      </label>
      <h4>Admin doors</h4>
      <label class="field">
        <span>Admin HTTPS origin</span>
        <input class="form-input" type="url" inputmode="url" autocomplete="off" placeholder="https://localhost:8443" data-field="core.admin.httpsOrigin" />
      </label>
      <label class="field">
        <span>Admin HTTP origin</span>
        <input class="form-input" type="url" inputmode="url" autocomplete="off" placeholder="http://localhost:8080" data-field="core.admin.httpOrigin" />
      </label>
      <label class="field">
        <span>Admin path</span>
        <input class="form-input" type="text" autocomplete="off" placeholder="/" data-field="core.admin.path" />
      </label>
      <div class="mcp-actions" style="flex-wrap: wrap; gap: 0.5rem;">
        <button class="btn primary" type="button" data-action="open-admin-https">Open admin (HTTPS)</button>
        <button class="btn" type="button" data-action="open-admin-http">Open admin (HTTP)</button>
        <button class="btn" type="button" data-action="copy-admin-https">Copy HTTPS URL</button>
        <button class="btn" type="button" data-action="copy-admin-http">Copy HTTP URL</button>
      </div>
      <p class="mcp-empty-note" data-admin-preview style="margin-top: 0.75rem; word-break: break-all;"></p>
      <h4>Embedded shell (Capacitor / WebView)</h4>
      <p class="field-hint" style="margin: 0 0 0.75rem; opacity: 0.88; font-size: 0.9em;">
        Defaults for AirPad hub/tunnel and coordinator features (aligned with CWSAndroid-style toggles). Clipboard gate applies to web AirPad coordinator calls; SMS/contacts are stored for future native bridges.
        Server routing for who receives clipboard (e.g. <code>L-192.168.0.110</code> → <code>L-192.168.0.196</code>) uses cwsp <code>clients.json</code> (<code>modules.clipboard</code> <code>shareTo</code> / <code>acceptFrom</code>) or HTTPS POST <code>/clipboard</code> with <code>targets</code>, same as CWSAndroid.
      </p>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.maintainHubSocketConnection" />
        <span>Keep hub Socket.IO connected in background (cwsp / endpoint; clipboard + coordinator without opening AirPad)</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.enableRemoteClipboardBridge" />
        <span>Enable remote clipboard bridge (coordinator / server clipboard)</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.applyRemoteClipboardToDevice" />
        <span>Apply incoming remote clipboard to this device (Web or Capacitor <code>@capacitor/clipboard</code>)</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.pushLocalClipboardToLan" />
        <span>Push local clipboard to LAN peers (polls; uses targets below)</span>
      </label>
      <label class="field">
        <span>Clipboard push interval (ms)</span>
        <input class="form-input" type="number" min="800" max="60000" step="100" data-field="shell.clipboardPushIntervalMs" placeholder="2000" />
      </label>
      <label class="field">
        <span>Clipboard broadcast targets (optional)</span>
        <input class="form-input" type="text" autocomplete="off" data-field="shell.clipboardBroadcastTargets" placeholder="L-192.168.0.196, L-192.168.0.208 — overrides route target if set" />
      </label>
      <div class="mcp-actions" style="flex-wrap: wrap; gap: 0.5rem;">
        <button class="btn" type="button" data-action="open-native-app-settings">Open app settings (Android / iOS)</button>
        <button class="btn" type="button" data-action="open-native-notification-settings">Notification settings (native)</button>
      </div>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.enableNativeSms" />
        <span>Allow native SMS bridge (shell must implement)</span>
      </label>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="shell.enableNativeContacts" />
        <span>Allow native contacts bridge (shell must implement)</span>
      </label>
    </section>

    <section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${createCustomInstructionsEditor({ onUpdate: () => setNote("Instructions updated.") })}
      </div>
    </section>

    <section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>
    </div>

    <footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>
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
	const shellMaintainHubSocket = field("[data-field=\"shell.maintainHubSocketConnection\"]");
	const shellClipboard = field("[data-field=\"shell.enableRemoteClipboardBridge\"]");
	const shellApplyRemoteDevice = field("[data-field=\"shell.applyRemoteClipboardToDevice\"]");
	const shellPushClipboard = field("[data-field=\"shell.pushLocalClipboardToLan\"]");
	const shellClipboardPushMs = field("[data-field=\"shell.clipboardPushIntervalMs\"]");
	const shellClipboardTargets = field("[data-field=\"shell.clipboardBroadcastTargets\"]");
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
			const channel = new BroadcastChannel("file-explorer");
			channel.postMessage({
				type: "content-explorer",
				data: {
					action: "view",
					path
				}
			});
			channel.close();
			setNote(`Explorer: ${path}`);
		} catch (error) {
			console.warn("[Settings] Failed to open explorer path:", error);
			setNote("Failed to open Explorer path.");
		}
	};
	const createMcpRow = (cfg) => {
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
	const collectMcpConfigurations = () => {
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
	const renderMcpConfigurations = (configs) => {
		if (!mcpSection) return;
		mcpSection.replaceChildren();
		const list = Array.isArray(configs) ? configs : [];
		if (!list.length) {
			mcpSection.appendChild(H`<p class="mcp-empty-note">No MCP servers configured.</p>`);
			return;
		}
		list.forEach((cfg) => mcpSection.appendChild(createMcpRow(cfg)));
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
		if (coreAllowInsecureTls) coreAllowInsecureTls.checked = Boolean(s?.core?.allowInsecureTls);
		if (coreOpsAllowUnencrypted) coreOpsAllowUnencrypted.checked = Boolean(s?.core?.ops?.allowUnencrypted);
		if (coreAdminHttps) coreAdminHttps.value = (s?.core?.admin?.httpsOrigin || "").trim();
		if (coreAdminHttp) coreAdminHttp.value = (s?.core?.admin?.httpOrigin || "").trim();
		if (coreAdminPath) coreAdminPath.value = (s?.core?.admin?.path || "/").trim() || "/";
		if (shellMaintainHubSocket) shellMaintainHubSocket.checked = Boolean(s?.shell?.maintainHubSocketConnection);
		if (shellClipboard) shellClipboard.checked = (s?.shell?.enableRemoteClipboardBridge ?? true) !== false;
		if (shellApplyRemoteDevice) shellApplyRemoteDevice.checked = (s?.shell?.applyRemoteClipboardToDevice ?? true) !== false;
		if (shellPushClipboard) shellPushClipboard.checked = Boolean(s?.shell?.pushLocalClipboardToLan);
		if (shellClipboardPushMs) shellClipboardPushMs.value = String(s?.shell?.clipboardPushIntervalMs != null && Number.isFinite(Number(s.shell.clipboardPushIntervalMs)) ? s.shell.clipboardPushIntervalMs : 2e3);
		if (shellClipboardTargets) shellClipboardTargets.value = (s?.shell?.clipboardBroadcastTargets || "").trim();
		if (shellSms) shellSms.checked = (s?.shell?.enableNativeSms ?? true) !== false;
		if (shellContacts) shellContacts.checked = (s?.shell?.enableNativeContacts ?? true) !== false;
		refreshAdminDoorPreview();
		renderMcpConfigurations(Array.isArray(s?.ai?.mcp) ? s.ai.mcp : []);
		applyAirpadRuntimeFromAppSettings(s);
		opts.onTheme?.(theme?.value || "auto");
	}).catch(() => {
		renderMcpConfigurations([]);
	});
	showKey?.addEventListener("change", () => {
		if (!apiKey || !showKey) return;
		apiKey.type = showKey.checked ? "text" : "password";
	});
	theme?.addEventListener("change", () => {
		opts.onTheme?.(theme.value || "auto");
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
			if (mcpSection && !mcpSection.querySelector("[data-mcp-id]")) renderMcpConfigurations([]);
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
			import("../chunks/clipboard-device.js").then((m) => m.openAppClipboardRelatedSettings()).then(() => setNote("App settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-notification-settings\"]")) {
			import("../chunks/clipboard-device.js").then((m) => m.openNativeNotificationSettings?.()).then(() => setNote("Notification settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
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
					mcp: collectMcpConfigurations()
				},
				speech: { language: speechLanguage?.value || "en-US" },
				core: {
					...current.core,
					ntpEnabled: Boolean(ntpEnabled?.checked),
					mode: coreMode?.value || "native",
					endpointUrl: coreEndpointUrl?.value?.trim() || "",
					userId: coreUserId?.value?.trim() || "",
					userKey: coreUserKey?.value?.trim() || "",
					encrypt: Boolean(coreEncrypt?.checked),
					preferBackendSync: (corePreferBackendSync?.checked ?? true) !== false,
					appClientId: coreAppClientId?.value?.trim() || "",
					allowInsecureTls: Boolean(coreAllowInsecureTls?.checked),
					useCoreIdentityForAirPad: (coreUseCoreIdentityAirpad?.checked ?? true) !== false,
					admin: {
						...current.core?.admin || {},
						httpsOrigin: coreAdminHttps?.value?.trim() || "",
						httpOrigin: coreAdminHttp?.value?.trim() || "",
						path: coreAdminPath?.value?.trim() || "/"
					},
					ops: {
						...current.core?.ops || {},
						allowUnencrypted: Boolean(coreOpsAllowUnencrypted?.checked)
					}
				},
				shell: {
					...current.shell || {},
					maintainHubSocketConnection: Boolean(shellMaintainHubSocket?.checked),
					enableRemoteClipboardBridge: (shellClipboard?.checked ?? true) !== false,
					applyRemoteClipboardToDevice: (shellApplyRemoteDevice?.checked ?? true) !== false,
					pushLocalClipboardToLan: Boolean(shellPushClipboard?.checked),
					clipboardPushIntervalMs: Math.max(800, Math.min(6e4, parseNumberOrDefault(shellClipboardPushMs?.value, 2e3))),
					clipboardBroadcastTargets: shellClipboardTargets?.value?.trim() || "",
					enableNativeSms: (shellSms?.checked ?? true) !== false,
					enableNativeContacts: (shellContacts?.checked ?? true) !== false
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
			import("../chunks/hub-socket-boot.js").then((m) => m.applyHubSocketFromSettings(saved));
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
//#region src/frontend/views/settings/index.ts
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
		onMount: () => {
			this._sheet ??= loadAsAdopted(Settings_default);
		},
		onUnmount: () => {
			removeAdopted(this._sheet);
		},
		onShow: () => {
			this._sheet ??= loadAsAdopted(Settings_default);
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
		this._sheet = loadAsAdopted(Settings_default);
		this.loadSettings();
		this.element = createSettingsView({
			isExtension: false,
			initialTab: options?.params?.tab || options?.params?.focus,
			onTheme: (theme) => {
				const nextTheme = theme;
				this.applyShellTheme(nextTheme);
				this.options.onThemeChange?.(nextTheme);
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
	applyShellTheme(theme) {
		const root = this.element?.closest("[data-shell]");
		if (!root) return;
		const resolved = theme === "auto" ? globalThis?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light" : theme;
		root.dataset.theme = resolved;
		root.style.colorScheme = resolved;
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
};
function createView(options) {
	return new SettingsView(options);
}
//#endregion
export { createView as n, SettingsView as t };
