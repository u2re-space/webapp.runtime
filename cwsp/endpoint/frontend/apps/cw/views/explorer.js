import { C as setString, Gn as removeAdopted, Hn as loadAsAdopted, Q as ensureSpeedDialMeta, X as createEmptySpeedDialItem, Y as addSpeedDialItem, at as persistSpeedDialMeta, cn as H, ct as speedDialItems, it as persistSpeedDialItems, j as FileManager_default, x as getString } from "../com/app.js";
import { i as sendViewProtocolMessage } from "../com/service.js";
//#region src/frontend/views/explorer/CwViewExplorer.ts
/**
* Semantic host for the Explorer file tree. Renders the standard shell layout
* and a single <ui-file-manager> child (OPFS + virtual /assets).
*/
console.log(FileManager_default);
var TAG = "cw-view-explorer";
var CwViewExplorer = class extends HTMLElement {
	connectedCallback() {
		if (this.querySelector(".view-explorer")) return;
		const shell = document.createElement("div");
		shell.className = "view-explorer";
		shell.setAttribute("aria-label", "File explorer");
		const content = document.createElement("div");
		content.className = "view-explorer__content";
		content.setAttribute("data-explorer-content", "");
		const fm = document.createElement("ui-file-manager");
		fm.setAttribute("view-mode", "list");
		content.append(fm);
		shell.append(content);
		this.append(shell);
	}
};
var ensureCwViewExplorerDefined = () => {
	if (typeof customElements === "undefined") return;
	if (!customElements?.get?.(TAG)) customElements?.define?.(TAG, CwViewExplorer);
};
//#endregion
//#region src/frontend/views/explorer/scss/index.scss?inline
var scss_default = "@layer animations{@keyframes n{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}}@layer base{@property --ui-gap{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-pad{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-pad-x{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-pad-y{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-radius{syntax:\"<length-percentage>\";inherits:true;initial-value:0px}@property --ui-border-w{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-min-h{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-font-size{syntax:\"<length>\";inherits:true;initial-value:0}@property --ui-opacity{syntax:\"<number>\";inherits:true;initial-value:1}@property --ui-bg{syntax:\"<color>\";inherits:true;initial-value:transparent}@property --ui-fg{syntax:\"<color>\";inherits:true;initial-value:currentColor}@property --ui-border{syntax:\"<color>\";inherits:true;initial-value:transparent}@property --ui-bg-hover{syntax:\"<color>\";inherits:true;initial-value:transparent}@property --ui-border-hover{syntax:\"<color>\";inherits:true;initial-value:transparent}@property --ui-ring{syntax:\"<color>\";inherits:true;initial-value:transparent}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@property --client-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --client-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --sp-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --sp-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rx{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ry{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --scroll-coef{syntax:\"<number>\";initial-value:1;inherits:true}@property --scroll-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --content-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --max-size{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){display:flex;flex-direction:column}:host(.flex-columns) ::slotted(::slotted(*)){display:flex;flex-direction:column}.flex-columns>*{display:flex;flex-direction:column}:host(.flex-columns) ::slotted(*){display:flex;flex-direction:column}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer ux-shapes{.shaped{aspect-ratio:1/1;border-radius:1.5rem;clip-path:var(--clip-path,none);contain:strict;display:flex;overflow:hidden;padding:1.25rem;place-content:center;place-items:center;pointer-events:auto;transition:--background-tone-shift .2s ease-in-out,--icon-color .2s ease-in-out;transition-behavior:allow-discrete;user-select:none;z-index:1}.shaped,.shaped span,.shaped ui-icon{block-size:stretch;inline-size:stretch}[data-dragging]{z-index:calc(100 + var(--z-index, 0))!important}:not(.shaped) .shaped,:not(.shaped)>*,:not(:has(.shaped)){--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape],:not(.shaped)>[data-shape],:not(:has(.shaped))[data-shape]{aspect-ratio:1/1;border-radius:var(--border-radius,var(--radius-md));clip-path:var(--clip-path,none);contain:strict;overflow:hidden;pointer-events:auto;touch-action:none}:not(.shaped) .shaped[data-shape=square],:not(.shaped)>[data-shape=square],:not(:has(.shaped))[data-shape=square]{--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape=squircle],:not(.shaped)>[data-shape=squircle],:not(:has(.shaped))[data-shape=squircle]{--border-radius:28%;--clip-path:none}:not(.shaped) .shaped[data-shape=circle],:not(.shaped)>[data-shape=circle],:not(:has(.shaped))[data-shape=circle]{--border-radius:50%;--clip-path:none}:not(.shaped) .shaped[data-shape=rounded],:not(.shaped)>[data-shape=rounded],:not(:has(.shaped))[data-shape=rounded]{--border-radius:var(--radius-xl);--clip-path:none}:not(.shaped) .shaped[data-shape=blob],:not(.shaped)>[data-shape=blob],:not(:has(.shaped))[data-shape=blob]{--border-radius:60% 40% 30% 70%/60% 30% 70% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=hexagon],:not(.shaped)>[data-shape=hexagon],:not(:has(.shaped))[data-shape=hexagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)}:not(.shaped) .shaped[data-shape=diamond],:not(.shaped)>[data-shape=diamond],:not(:has(.shaped))[data-shape=diamond]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 50%,50% 100%,0% 50%)}:not(.shaped) .shaped[data-shape=star],:not(.shaped)>[data-shape=star],:not(:has(.shaped))[data-shape=star]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,61% 35%,98% 38%,68% 59%,79% 95%,50% 75%,21% 95%,32% 59%,2% 38%,39% 35%)}:not(.shaped) .shaped[data-shape=badge],:not(.shaped)>[data-shape=badge],:not(:has(.shaped))[data-shape=badge]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 0%,100% 0%,100% 70%,50% 100%,0% 70%)}:not(.shaped) .shaped[data-shape=heart],:not(.shaped)>[data-shape=heart],:not(:has(.shaped))[data-shape=heart]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 100%,10% 65%,0% 45%,0% 30%,5% 15%,18% 3%,35% 0%,50% 12%,65% 0%,82% 3%,95% 15%,100% 30%,100% 45%,90% 65%)}:not(.shaped) .shaped[data-shape=clover],:not(.shaped)>[data-shape=clover],:not(:has(.shaped))[data-shape=clover]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,60% 30%,70% 30%,100% 50%,70% 70%,60% 70%,50% 100%,40% 70%,30% 70%,0% 50%,30% 30%,40% 30%)}:not(.shaped) .shaped[data-shape=flower],:not(.shaped)>[data-shape=flower],:not(:has(.shaped))[data-shape=flower]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,58% 25%,85% 15%,68% 40%,100% 50%,68% 60%,85% 85%,58% 75%,50% 100%,42% 75%,15% 85%,32% 60%,0% 50%,32% 40%,15% 15%,42% 25%)}:not(.shaped) .shaped[data-shape=triangle],:not(.shaped)>[data-shape=triangle],:not(:has(.shaped))[data-shape=triangle]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 87%,0% 87%)}:not(.shaped) .shaped[data-shape=pentagon],:not(.shaped)>[data-shape=pentagon],:not(:has(.shaped))[data-shape=pentagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,97.5% 35%,79.5% 95%,20.5% 95%,2.5% 35%)}:not(.shaped) .shaped[data-shape=octagon],:not(.shaped)>[data-shape=octagon],:not(:has(.shaped))[data-shape=octagon]{--border-radius:0;--clip-path:polygon(round 0.25rem,30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)}:not(.shaped) .shaped[data-shape=cross],:not(.shaped)>[data-shape=cross],:not(:has(.shaped))[data-shape=cross]{--border-radius:0;--clip-path:polygon(round 0.375rem,35% 0%,65% 0%,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0% 65%,0% 35%,35% 35%)}:not(.shaped) .shaped[data-shape=arrow],:not(.shaped)>[data-shape=arrow],:not(:has(.shaped))[data-shape=arrow]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 20%,60% 20%,60% 0%,100% 50%,60% 100%,60% 80%,0% 80%)}:not(.shaped) .shaped[data-shape=egg],:not(.shaped)>[data-shape=egg],:not(:has(.shaped))[data-shape=egg]{--border-radius:50% 50% 50% 50%/60% 60% 40% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=tear],:not(.shaped)>[data-shape=tear],:not(:has(.shaped))[data-shape=tear]{--border-radius:50cqmin 50cqmin 5rem 50cqmin;--clip-path:none;border-end-end-radius:5rem;border-end-start-radius:50cqmin;border-start-end-radius:50cqmin;border-start-start-radius:50cqmin}:not(.shaped) .shaped[data-shape=wavy],:not(.shaped)>[data-shape=wavy],:not(:has(.shaped))[data-shape=wavy]{--border-radius:calc(var(--icon-size, 100%) * 0.5)}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:n 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon img,ui-icon svg{block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer view-explorer{@layer tokens{:root:has([data-view=explorer]),html:has([data-view=explorer]){--view-layout:\"flex\";--view-content-max-width:none}[data-view=explorer]{--view-border:color-mix(in oklab,var(--color-outline-variant,#888) 45%,transparent);--view-fg-muted:color-mix(in oklab,var(--color-on-surface,#ccc) 72%,transparent);--view-hover-bg:color-mix(in oklab,var(--color-primary,#3794ff) 12%,transparent);--view-selected-bg:color-mix(in oklab,var(--color-primary,#3794ff) 18%,transparent);--view-selected-border:var(--color-primary,#3794ff);--explorer-menu-radius:0.75rem;--explorer-menu-pad:0.35rem}}@layer shell{:where(.app-shell__content)>[data-view=explorer]{block-size:100%!important;display:flex!important;flex-direction:column!important;max-block-size:100%!important;min-block-size:0!important;overflow:hidden!important}:host:has(.view-explorer){background:var(--color-surface,var(--view-bg,#1e1e1e));block-size:100%;color:var(--color-on-surface,var(--view-fg,#e8e8e8));contain:layout style;display:flex;flex-direction:column;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:.875rem;line-height:1.5;min-block-size:0}cw-view-explorer{box-sizing:border-box}.view-explorer,cw-view-explorer{block-size:100%;display:flex;flex:1 1 0;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0}.view-explorer{background:var(--color-surface,var(--view-bg));border:none;border-radius:0;color:var(--color-on-surface,var(--view-fg));overflow:hidden}.view-explorer__content{background:transparent;box-sizing:border-box;color:inherit;display:flex;flex:1 1 0;flex-direction:column;margin:0;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0}.view-explorer__content>ui-file-manager{block-size:100%;flex:1 1 0;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer components{.view-explorer__error,.view-explorer__loading{align-items:center;block-size:100%;display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-explorer__loading{color:var(--color-on-surface);opacity:.65}.view-explorer__spinner{animation:n .8s linear infinite;block-size:32px;border:3px solid var(--view-border,color-mix(in oklab,var(--color-on-surface,#888) 18%,transparent));border-block-start-color:var(--color-primary,#3794ff);border-radius:50%;inline-size:32px}.view-explorer__error p{color:var(--color-error,#f2b8b5);margin:0}.view-explorer__error button{background:var(--color-primary,#3794ff);border:none;border-radius:.375rem;color:var(--color-on-primary,#fff);cursor:pointer;padding:.5rem 1rem}.view-explorer__error button:hover{filter:brightness(1.08)}.view-explorer__fallback{block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:.75rem;overflow:auto;padding:1rem 1.125rem}.view-explorer__fallback h3{font-size:1rem;font-weight:600;margin:0}.view-explorer__fallback p{color:var(--view-fg-muted,var(--color-on-surface-variant));font-size:.875rem;line-height:1.45;margin:0}.view-explorer__fallback-actions{display:flex;flex-wrap:wrap;gap:.5rem}.view-explorer__fallback-actions button{background:color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);border:none;border-radius:999px;color:inherit;cursor:pointer;font-size:.8125rem;font-weight:500;padding:.5rem 1rem}.view-explorer__fallback-actions button:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 13%,transparent)}.view-explorer__fallback-actions button:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 60%,transparent);outline-offset:1px}.view-explorer__fallback-files{color:var(--color-on-surface-variant);display:grid;font-size:.8125rem;gap:.35rem;margin:.5rem 0 0;padding-inline-start:1.125rem}.rs-explorer-context-menu{backdrop-filter:blur(12px);background:color-mix(in oklab,var(--color-surface-container-high,#2a2d33) 92%,#000 8%);border:none;border-radius:var(--explorer-menu-radius,.75rem);box-shadow:0 8px 28px rgba(0,0,0,.38),0 0 0 1px color-mix(in oklab,var(--color-on-surface,#fff) 8%,transparent);color:var(--color-on-surface,#eee);display:flex;flex-direction:column;gap:.2rem;min-inline-size:12rem;padding:var(--explorer-menu-pad,.35rem);position:fixed;z-index:10050}.rs-explorer-context-menu__item{align-items:center;background:transparent;border:none;border-radius:calc(var(--explorer-menu-radius, .75rem) - .15rem);box-sizing:border-box;color:inherit;cursor:pointer;display:flex;font:inherit;font-size:.8125rem;gap:.5rem;inline-size:100%;justify-content:flex-start;line-height:1.25;min-block-size:2.25rem;padding:.5rem .7rem;text-align:start}.rs-explorer-context-menu__item:hover{background:color-mix(in oklab,var(--color-on-surface,#fff) 9%,transparent)}.rs-explorer-context-menu__item:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 65%,transparent);outline-offset:0}}@layer animations{@keyframes n{to{transform:rotate(1turn)}}}}";
//#endregion
//#region src/frontend/views/explorer/index.ts
/**
* Explorer View
*
* Shell-agnostic file explorer component.
* Uses the <view-explorer> web component for encapsulated rendering.
*/
ensureCwViewExplorerDefined();
var openExplorerContextMenu = (x, y, items) => {
	const menu = document.createElement("div");
	menu.className = "rs-explorer-context-menu";
	menu.setAttribute("role", "menu");
	const closeMenu = () => {
		document.removeEventListener("click", onDocClick, true);
		document.removeEventListener("keydown", onKey, true);
		menu.remove();
	};
	const onDocClick = (ev) => {
		if (!menu.contains(ev.target)) closeMenu();
	};
	const onKey = (ev) => {
		if (ev.key === "Escape") {
			ev.preventDefault();
			closeMenu();
		}
	};
	for (const item of items) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "rs-explorer-context-menu__item";
		button.textContent = item.label;
		button.addEventListener("click", () => {
			item.action();
			closeMenu();
		});
		menu.append(button);
	}
	document.body.append(menu);
	const pad = 8;
	const vw = globalThis.innerWidth;
	const vh = globalThis.innerHeight;
	let left = x;
	let top = y;
	const rect = menu.getBoundingClientRect();
	if (left + rect.width > vw - pad) left = Math.max(pad, vw - rect.width - pad);
	if (top + rect.height > vh - pad) top = Math.max(pad, vh - rect.height - pad);
	menu.style.left = `${left}px`;
	menu.style.top = `${top}px`;
	requestAnimationFrame(() => {
		const r2 = menu.getBoundingClientRect();
		let l2 = left;
		let t2 = top;
		if (l2 + r2.width > vw - pad) l2 = Math.max(pad, vw - r2.width - pad);
		if (t2 + r2.height > vh - pad) t2 = Math.max(pad, vh - r2.height - pad);
		menu.style.left = `${l2}px`;
		menu.style.top = `${t2}px`;
	});
	queueMicrotask(() => {
		document.addEventListener("click", onDocClick, true);
	});
	document.addEventListener("keydown", onKey, true);
};
var requestOpenView = (request) => {
	const viewId = String(request?.viewId || "").trim().toLowerCase();
	if (!viewId) return;
	globalThis?.dispatchEvent?.(new CustomEvent("cw:view-open-request", { detail: {
		viewId,
		target: request?.target || "window",
		params: request?.params || {}
	} }));
};
var TEXT_FILE_EXTENSIONS = new Set([
	"md",
	"markdown",
	"txt",
	"text",
	"json",
	"xml",
	"yml",
	"yaml",
	"html",
	"htm",
	"css",
	"js",
	"mjs",
	"cjs",
	"ts",
	"tsx",
	"jsx",
	"log",
	"ini",
	"conf",
	"cfg",
	"csv"
]);
var buildExplorerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `explorer-${String(path || "root").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "root"}-${stamp}-${suffix}`;
};
var extOf = (filename = "") => {
	const next = String(filename).trim().toLowerCase();
	const idx = next.lastIndexOf(".");
	if (idx <= 0 || idx >= next.length - 1) return "";
	return next.slice(idx + 1);
};
var isTextLikeFile = (file) => {
	if (!file) return false;
	const type = String(file.type || "").toLowerCase();
	if (!type || type.startsWith("text/")) return true;
	if (type.includes("markdown") || type.includes("json") || type.includes("xml")) return true;
	return TEXT_FILE_EXTENSIONS.has(extOf(file.name || ""));
};
var buildViewerProcessId = (path) => {
	const suffix = Math.random().toString(36).slice(2, 8);
	const stamp = Date.now().toString(36);
	return `viewer-${String(path || "viewer").replace(/[^a-z0-9_-]/gi, "-").slice(0, 18) || "viewer"}-${stamp}-${suffix}`;
};
var guessNextShortcutCell = () => {
	const occupied = new Set((speedDialItems || []).map((item) => `${Math.round(item?.cell?.[0] || 0)}:${Math.round(item?.cell?.[1] || 0)}`));
	const maxRows = 12;
	const maxCols = 8;
	for (let row = 0; row < maxRows; row += 1) for (let col = 0; col < maxCols; col += 1) {
		const key = `${col}:${row}`;
		if (!occupied.has(key)) return [col, row];
	}
	return [0, 0];
};
var ExplorerView = class {
	id = "explorer";
	name = "Explorer";
	icon = "folder";
	options;
	shellContext;
	element = null;
	explorer = null;
	initialPath = null;
	_sheet = null;
	lifecycle = {
		onMount: () => {
			this.loadLastPath();
			this._sheet ??= loadAsAdopted(scss_default);
		},
		onUnmount: () => {
			removeAdopted(this._sheet);
			this.saveCurrentPath();
		},
		onShow: () => {
			this._sheet ??= loadAsAdopted(scss_default);
		},
		onHide: () => {
			this.saveCurrentPath();
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
		this.initialPath = options.params?.path ? String(options.params.path) : null;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
			if (options.params?.path) this.initialPath = String(options.params.path);
		}
		this._sheet = loadAsAdopted(scss_default);
		this.element = Boolean(customElements.get("ui-file-manager")) ? H`
                <cw-view-explorer></cw-view-explorer>
            ` : H`
                <div class="view-explorer">
                    <div class="view-explorer__content" data-explorer-content>
                        <div class="view-explorer__fallback">
                            <h3>Explorer fallback mode</h3>
                            <p>File manager component is unavailable; use local files below.</p>
                            <div class="view-explorer__fallback-actions">
                                <button type="button" data-action="pick-files">Open files</button>
                                <button type="button" data-action="open-workcenter">Open Work Center</button>
                            </div>
                            <ul class="view-explorer__fallback-files" data-fallback-files></ul>
                        </div>
                    </div>
                </div>
            `;
		this.explorer = this.element.querySelector("ui-file-manager");
		if (this.explorer) {
			this.explorer.removeAttribute("hidden");
			this.explorer.style.display = "block";
			this.setupExplorerEvents();
		} else this.setupFallbackExplorerEvents();
		return this.element;
	}
	getToolbar() {
		return null;
	}
	setupExplorerEvents() {
		if (!this.explorer) return;
		const explorer = this.explorer;
		const readFileDetail = (event) => {
			const detail = event.detail || {};
			return {
				item: detail?.item,
				path: detail?.path
			};
		};
		const openFileInViewer = async (item, fullPath, target = "window") => {
			const file = item?.file;
			if (!file || !isTextLikeFile(file)) return false;
			const sourcePath = String(fullPath || "");
			if (target === "base") {
				requestOpenView({
					viewId: "viewer",
					target: "base",
					params: {
						src: sourcePath,
						filename: file.name || "",
						processId: buildViewerProcessId(sourcePath)
					}
				});
				return true;
			}
			const processId = buildViewerProcessId(sourcePath);
			requestOpenView({
				viewId: "viewer",
				target: "window",
				params: {
					processId,
					src: sourcePath,
					filename: file.name || ""
				}
			});
			try {
				if (!await sendViewProtocolMessage({
					type: "content-view",
					source: "explorer",
					destination: "viewer",
					contentType: file.type || "text/plain",
					attachments: [{
						data: file,
						source: "explorer-viewer-open"
					}],
					data: {
						filename: file.name,
						path: sourcePath,
						source: sourcePath
					},
					metadata: {
						processId,
						openTarget: "window"
					}
				})) this.showMessage("Viewer is not ready yet, retrying in background");
			} catch (error) {
				console.warn("[Explorer] Failed to send viewer payload:", error);
			}
			return true;
		};
		const attachToWorkCenter = async (item, mode) => {
			const file = item?.file;
			if (!file) {
				this.showMessage("No file selected");
				return;
			}
			const sourcePath = `${this.explorer?.path || "/"}${item?.name || file.name}`;
			if (mode === "headless") requestOpenView({
				viewId: "workcenter",
				target: "headless",
				params: {
					queue: "1",
					mode: "headless",
					sourcePath
				}
			});
			else if (mode === "active") requestOpenView({
				viewId: "workcenter",
				target: "window"
			});
			else requestOpenView({
				viewId: "workcenter",
				target: "window",
				params: {
					minimized: "1",
					queue: "1",
					sourcePath
				}
			});
			if (await sendViewProtocolMessage({
				type: "content-share",
				source: "explorer",
				destination: "workcenter",
				contentType: file.type || "application/octet-stream",
				attachments: [{
					data: file,
					source: "explorer-workcenter-attach"
				}],
				data: {
					filename: file.name,
					path: sourcePath,
					source: "explorer-attach",
					queued: mode !== "active"
				},
				metadata: {
					queueState: mode === "active" ? "awaiting" : mode === "queued" ? "pending" : "queued",
					mode,
					sourcePath
				}
			})) this.showMessage(mode === "active" ? `Attached ${file.name} to Work Center` : `Queued ${file.name} for Work Center (${mode})`);
			else this.showMessage("Work Center queue is unavailable");
		};
		const pinToHome = (item) => {
			const file = item?.file;
			const name = String(item?.name || file?.name || "").trim();
			if (!name) {
				this.showMessage("Nothing to pin");
				return;
			}
			const path = `${this.explorer?.path || "/"}${name}`;
			const shortcut = createEmptySpeedDialItem(guessNextShortcutCell());
			shortcut.label.value = name;
			shortcut.icon.value = item?.kind === "directory" ? "folder" : "file-text";
			shortcut.action = "open-link";
			addSpeedDialItem(shortcut);
			const meta = ensureSpeedDialMeta(shortcut.id, { action: "open-link" });
			meta.action = "open-link";
			meta.href = path;
			meta.description = `Pinned from Explorer: ${path}`;
			persistSpeedDialItems();
			persistSpeedDialMeta();
			this.showMessage(`Pinned ${name} to Home`);
		};
		const onFileOpen = async (e) => {
			const { item, path } = readFileDetail(e);
			if (item?.kind !== "file" || !item?.file) return;
			if (!await openFileInViewer(item, path, "window")) requestOpenView({
				viewId: "workcenter",
				target: "window"
			});
		};
		explorer.addEventListener("open-item", onFileOpen);
		explorer.addEventListener("open", onFileOpen);
		explorer.addEventListener("rs-open", onFileOpen);
		explorer.addEventListener("rs-navigate", () => {
			this.saveCurrentPath();
		});
		const getItemPath = (item) => `${this.explorer?.path || "/"}${item?.name || ""}`;
		const contextActionHandlers = {
			view: async (item) => {
				await openFileInViewer(item, getItemPath(item), "window");
			},
			"view-base": async (item) => {
				await openFileInViewer(item, getItemPath(item), "base");
			},
			"attach-workcenter": (item) => attachToWorkCenter(item, "active"),
			"attach-workcenter-queued": (item) => attachToWorkCenter(item, "queued"),
			"attach-workcenter-headless": (item) => attachToWorkCenter(item, "headless"),
			"pin-home": (item) => pinToHome(item)
		};
		explorer.addEventListener("context-action", async (event) => {
			const detail = event.detail || {};
			const action = String(detail.action || "");
			const item = detail.item;
			if (!action) return;
			const handler = contextActionHandlers[action];
			if (!handler) return;
			await handler(item);
		});
		explorer.addEventListener("contextmenu", (event) => {
			if ((event.composedPath?.() || []).some((node) => {
				const el = node;
				if (!el || typeof el.classList?.contains !== "function") return false;
				return el.classList.contains("row") || el.classList.contains("action-btn") || el.classList.contains("ctx-menu");
			})) return;
			event.preventDefault();
			const path = this.explorer?.path || "/";
			openExplorerContextMenu(event.clientX, event.clientY, [
				{
					id: "refresh",
					label: "Refresh",
					icon: "arrows-clockwise",
					action: () => {
						if (!this.explorer) return;
						this.explorer.navigate(path);
					}
				},
				{
					id: "open-new-explorer",
					label: "New Explorer window",
					icon: "books",
					action: () => requestOpenView({
						viewId: "explorer",
						target: "window",
						params: {
							path,
							processId: buildExplorerProcessId(path)
						}
					})
				},
				{
					id: "open-home",
					label: "Go to Home",
					icon: "house",
					action: () => this.shellContext?.navigate("home")
				}
			]);
		});
	}
	setupFallbackExplorerEvents() {
		if (!this.element) return;
		const filesList = this.element.querySelector("[data-fallback-files]");
		const pickBtn = this.element.querySelector("[data-action=\"pick-files\"]");
		const workBtn = this.element.querySelector("[data-action=\"open-workcenter\"]");
		if (!pickBtn || !filesList) return;
		const input = document.createElement("input");
		input.type = "file";
		input.multiple = true;
		input.accept = ".md,.markdown,.txt,.json,.xml,.yaml,.yml,.csv,.log,text/*";
		input.style.display = "none";
		this.element.append(input);
		pickBtn.addEventListener("click", () => input.click());
		workBtn?.addEventListener("click", () => requestOpenView({
			viewId: "workcenter",
			target: "window"
		}));
		input.addEventListener("change", async () => {
			const files = Array.from(input.files || []);
			filesList.replaceChildren();
			if (files.length === 0) return;
			for (const file of files) {
				const li = document.createElement("li");
				li.textContent = file.name;
				filesList.append(li);
			}
			const firstTextLike = files.find((file) => isTextLikeFile(file));
			if (firstTextLike) {
				requestOpenView({
					viewId: "viewer",
					target: "window"
				});
				if (!await sendViewProtocolMessage({
					type: "content-view",
					source: "explorer-fallback",
					destination: "viewer",
					contentType: firstTextLike.type || "text/plain",
					attachments: [{
						data: firstTextLike,
						source: "explorer-fallback"
					}],
					data: {
						filename: firstTextLike.name,
						source: "explorer-fallback"
					}
				})) this.showMessage("Viewer is not ready yet");
			}
		});
	}
	loadLastPath() {
		if (this.explorer) {
			if (this.initialPath && this.initialPath.trim()) {
				this.explorer.path = this.initialPath.trim();
				return;
			}
			const persisted = String(getString("view-explorer-path", "/user/") || "").trim();
			const nextPath = !persisted || persisted === "/" ? "/user/" : persisted;
			this.explorer.path = nextPath;
		}
	}
	saveCurrentPath() {
		if (this.explorer) setString("view-explorer-path", this.explorer.path || "/user/");
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	canHandleMessage(messageType) {
		return [
			"file-save",
			"navigate-path",
			"content-explorer"
		].includes(messageType);
	}
	async handleMessage(message) {
		const msg = message;
		const targetPath = msg.data?.path || msg.data?.into;
		if (targetPath && this.explorer) this.explorer.navigate(targetPath);
	}
};
function createView(options) {
	return new ExplorerView(options);
}
/** Alias for createView */
var createExplorerView = createView;
//#endregion
export { createExplorerView as n, createView as r, ExplorerView as t };
