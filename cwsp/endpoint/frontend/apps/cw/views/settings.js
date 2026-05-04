import { g as loadAsAdopted, y as removeAdopted } from "../fest/dom.js";
import { c as ref, o as observe } from "../fest/object.js";
import { t as DEFAULT_INSTRUCTION_TEMPLATES } from "../chunks/templates.js";
import { u as sendMessage } from "../chunks/UnifiedMessaging.js";
import { t as applyTheme } from "../chunks/Theme.js";
import { t as BUILTIN_AI_MODELS } from "../chunks/SettingsTypes.js";
import { q as H } from "../com/app.js";
import { n as loadSettings, r as saveSettings } from "../chunks/Settings.js";
import { i as applyAirpadRuntimeFromAppSettings } from "./airpad.js";
import { o as navigateToView } from "../com/app3.js";
import { o as SettingsChannelAction } from "./apis.js";
import { a as setString, t as StorageKeys } from "../com/app6.js";
import { c as updateInstruction, i as deleteInstruction, n as addInstruction, o as getInstructionRegistry, r as addInstructions, s as setActiveInstruction } from "../chunks/CustomInstructions.js";
//#region src/frontend/views/settings/scss/Settings.scss?inline
var Settings_default = "@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:root:has([data-view=settings]),html:has([data-view=settings]){--view-layout:\"flex\";--view-sidebar-visible:true;--view-padding:var(--space-6);--view-content-max-width:none;--view-section-gap:var(--space-8);--view-field-gap:var(--space-4);--view-label-color:var(--color-text-secondary);--settings-divider:color-mix(in oklab,var(--color-outline-variant) 32%,transparent);--settings-card-surface:color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface));--settings-card-edge:color-mix(in oklab,var(--color-outline-variant) 16%,transparent);--settings-card-shadow:0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent);--settings-chip-edge:color-mix(in oklab,var(--color-outline-variant) 12%,transparent)}}@layer components{.view-settings{align-content:stretch;background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;justify-items:stretch;margin-inline:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:.25rem;row-gap:0;text-align:start}.view-settings [data-action=save]{justify-self:start}.view-settings :where(select,input,textarea,option){pointer-events:auto}.view-settings textarea{box-sizing:border-box;container-type:inline-size;inline-size:stretch;max-inline-size:stretch;resize:block}.view-settings h2{color:var(--color-on-surface);font-size:var(--text-xl,20px);font-weight:var(--font-weight-bold,700);letter-spacing:-.02em;margin:0}.view-settings h3{text-align:start}.view-settings .card{background:var(--settings-card-surface,color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface)));border:none;border-radius:var(--radius-xl,16px);box-shadow:var(--settings-card-shadow,0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent)),0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 16%,transparent));display:flex;flex-direction:column;gap:var(--spacing-md,12px);inline-size:stretch;padding:var(--spacing-md,16px)}@container (max-inline-size: 480px){.view-settings .card{border-radius:var(--radius-lg,14px);gap:var(--spacing-sm,10px);padding:var(--spacing-md,14px)}}.view-settings .card h3{color:var(--color-on-surface);font-size:var(--text-base,15px);font-weight:var(--font-weight-semibold,600);letter-spacing:-.01em;margin:0}.view-settings .card .form-select{inline-size:stretch}.view-settings .field{display:grid;flex-direction:column;font-size:var(--text-xs,12px);gap:var(--spacing-xs,6px);grid-auto-flow:row;inline-size:stretch}.view-settings .field>span{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);opacity:.85}.view-settings .field.checkbox{align-items:center;gap:var(--spacing-sm,10px);grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .mcp-actions{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;margin-block-start:var(--space-xs,8px)}.view-settings .mcp-section{display:flex;flex-direction:column;gap:var(--space-sm,8px)}.view-settings .mcp-row{background:color-mix(in oklab,var(--color-surface-container-low) 88%,var(--color-surface));border:none;border-radius:var(--radius-lg,14px);box-shadow:inset 0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 14%,transparent));display:grid;gap:var(--space-sm,8px);padding:var(--space-md,12px)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);margin:0;opacity:.85}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));display:flex;flex-direction:column;flex-shrink:0;gap:var(--space-sm);min-inline-size:0;padding-block-end:var(--space-md)}.view-settings .settings-screen__title{font-weight:var(--font-weight-semibold,600);letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;overflow-block:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:var(--space-lg);overscroll-behavior:contain;padding-block:var(--space-md);scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--color-outline-variant) 45%,transparent);border-radius:99px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb:hover{background:color-mix(in oklab,var(--color-outline) 55%,transparent)}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--color-surface-container-low,var(--color-surface-container)) 72%,var(--color-surface));border-block-start:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));box-shadow:0 -12px 28px color-mix(in oklab,var(--color-on-surface) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:var(--space-sm);inline-size:stretch;justify-content:start;margin-block-start:0;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:var(--space-xs,6px);inline-size:stretch;justify-content:flex-start;max-inline-size:stretch;overflow-x:auto;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--color-surface-container-low) 94%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface-variant);cursor:pointer;font-size:var(--text-xs,12px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem .875rem;transition:background-color var(--motion-fast),color var(--motion-fast),box-shadow var(--motion-fast)}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--color-surface-container) 92%,transparent);color:var(--color-on-surface)}.view-settings .settings-tab-btn.is-active{background:var(--color-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--color-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 40%,transparent);color:var(--color-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active{display:flex}.view-settings .btn{background:color-mix(in oklab,var(--color-surface-container) 88%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface);cursor:pointer;font-family:inherit;font-size:var(--text-sm,13px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),filter var(--motion-fast)}.view-settings .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 6%,transparent)}.view-settings .btn.primary{background:var(--color-primary);border-color:transparent;box-shadow:0 2px 14px color-mix(in oklab,var(--color-primary) 32%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 55%,transparent);color:var(--color-on-primary,#fff)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .ext-note,.view-settings .note{color:var(--color-on-surface-variant);display:block;flex-grow:0;flex-shrink:1;font-size:var(--text-xs,12px);max-inline-size:stretch;opacity:.9;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:nowrap}.view-settings .ext-note{opacity:.8}.view-settings .ext-note code{background:var(--color-surface-container-highest);border-radius:var(--radius-xs,4px);font-size:var(--text-xs,11px);padding:2px 4px}@container (max-inline-size: 1024px){.view-settings{padding:var(--space-md)}}@container (max-inline-size: 768px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{font-size:var(--text-lg,17px)}.view-settings .settings-screen__top{gap:var(--space-md)}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.375rem}.view-settings .settings-tab-btn{min-block-size:2.75rem;padding-inline:.75rem}}@container (max-inline-size: 480px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:var(--space-md);padding-block:var(--space-sm)}.view-settings .settings-screen__footer{align-items:stretch;box-shadow:0 -8px 24px color-mix(in oklab,var(--color-on-surface) 5%,transparent);flex-direction:column-reverse;gap:var(--space-sm);inline-size:stretch;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}.view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings__title{font-size:1.75rem;font-weight:var(--font-weight-bold,700);margin:0 0 2rem}.view-settings__section{border-block-end:1px solid var(--view-border,rgba(0,0,0,.1));display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings__section:last-of-type{border-block-end:none}.view-settings__section h2{color:var(--view-fg);font-size:1.125rem;font-weight:var(--font-weight-semibold,600);margin:0 0 1rem}.view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings__label>span{font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500)}.view-settings__actions{display:flex;gap:.75rem;margin-block-start:2rem}.view-settings__btn{background:transparent;border:1px solid var(--view-border,rgba(0,0,0,.15));border-radius:var(--radius-sm,6px);color:var(--view-fg);cursor:pointer;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);padding:.625rem 1.25rem;transition:background-color var(--motion-fast)}.view-settings__btn:hover{background-color:rgba(0,0,0,.05)}.view-settings__btn--primary{background-color:var(--color-primary,#007acc);border-color:var(--color-primary,#007acc);color:white}.view-settings__btn--primary:hover{filter:brightness(1.1)}.settings-group{display:grid;gap:var(--space-lg);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.settings-section{background:var(--color-surface-container-high);border-radius:var(--radius-xl);box-shadow:var(--elev-2);overflow:hidden;padding:var(--space-xl);position:relative;transition:all var(--motion-normal)}@container (max-inline-size: 1024px){.settings-section{border-radius:var(--radius-lg);padding:var(--space-lg)}}@container (max-inline-size: 768px){.settings-section{padding:var(--space-md)}}@container (max-inline-size: 480px){.settings-section{border-radius:var(--radius-md);padding:var(--space-sm)}}.settings-section:hover{box-shadow:var(--elev-3);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.settings-section:hover{transform:none}}.settings-section:before{background:linear-gradient(135deg,color-mix(in oklab,var(--color-tertiary) 2%,transparent) 0,transparent 100%);border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute}.settings-section>*{position:relative;z-index:1}.settings-section .settings-header{margin-block-end:var(--space-lg);padding-block-end:var(--space-md)}.settings-section .settings-header h3{align-items:start;color:var(--color-on-surface);display:flex;font-size:var(--text-lg);font-weight:var(--font-weight-semibold);gap:var(--space-sm);margin:0}@container (max-inline-size: 768px){.settings-section .settings-header h3{font-size:var(--text-base)}}.settings-section .settings-header h3 ui-icon{margin-inline-end:var(--space-sm);opacity:.7}.settings-section .form-group{margin-block-end:var(--space-lg)}.settings-section .form-group:last-child{margin-block-end:0}.settings-section .form-group label{color:var(--color-on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-end:var(--space-sm)}.settings-section .form-group textarea{font-family:var(--font-family-mono);min-block-size:100px;resize:vertical}.settings-section .settings-actions{display:flex;flex-wrap:nowrap;gap:var(--space-md);justify-content:flex-end;margin-block-start:var(--space-xl);padding-block-start:var(--space-lg)}@container (max-inline-size: 768px){.settings-section .settings-actions{flex-direction:column;gap:var(--space-sm)}}.settings-section .settings-actions .action-btn{background:var(--color-surface-container-high);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);min-block-size:44px;padding-block:var(--space-xl);padding-inline:var(--space-sm);transition:all var(--motion-fast)}.settings-section .settings-actions .action-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);transform:translateY(-1px)}.settings-section .settings-actions .action-btn:active{box-shadow:none;transform:translateY(0)}.settings-section .settings-actions .action-btn.primary{background:var(--color-tertiary);color:var(--color-on-tertiary)}.settings-section .settings-actions .action-btn.primary:hover{background:color-mix(in oklab,var(--color-tertiary) 85%,black)}}@layer view.settings{.settings-panel{aspect-ratio:auto;block-size:stretch;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-lg,12px);display:flex;flex-direction:column;flex-wrap:nowrap;inline-size:stretch;place-content:center;justify-content:start;overflow-x:hidden;overflow-y:auto;place-items:center;align-items:center;backdrop-filter:blur(1rem);background-color:oklch(from --c2-surface(.15,var(--current,currentColor)) l c h/.9);border-radius:0;border-width:0;grid-row:1/-1;max-block-size:none;scrollbar-color:var(--surface-opacity-emphasis) transparent;scrollbar-width:thin}.settings-panel,.settings-panel :where(button,input,textarea,select){touch-action:pan-y}.settings-panel [data-shape]{pointer-events:none;touch-action:pan-y}.settings-panel .panel-header{display:grid;gap:var(--gap-xs);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;padding:var(--padding-sm);place-content:center;place-items:center;position:relative;text-align:start}.settings-panel .panel-header h2{font-size:var(--font-xl);margin:0}.settings-panel .panel-header p{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);font-size:var(--font-sm);margin:0}.settings-panel .settings-group{background-color:var(--fl-surface,#fff);block-size:max-content;border:0 transparent;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);display:flex;flex-direction:column;flex-wrap:nowrap;inline-size:stretch;justify-content:start;line-height:normal;max-block-size:none;max-inline-size:stretch;min-inline-size:fit-content;overflow:visible;padding-inline:var(--padding-xl,1.5rem);place-content:center;place-items:center;text-align:center}.settings-panel .settings-group:not(.is-collapsible){block-size:max-content;display:flex;flex-direction:column;flex-wrap:nowrap;gap:var(--gap-md);inline-size:stretch;max-block-size:none;padding:var(--padding-lg);padding-inline:var(--padding-xl,1.5rem)}.settings-panel .settings-group.is-collapsible{padding:0}.settings-panel .settings-group.is-collapsible summary{cursor:pointer;display:flex;flex-direction:column;gap:var(--gap-xs);list-style:none;outline:none;padding:var(--padding-lg)}.settings-panel .settings-group.is-collapsible .group-body{block-size:fit-content;display:grid;gap:var(--gap-md);grid-template-columns:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;padding:0 var(--padding-lg) var(--padding-lg);place-content:center;place-items:center;text-align:center}.settings-panel .settings-group .group-header{block-size:max-content;display:flex;flex-direction:column;flex-wrap:nowrap;gap:var(--gap-xs);line-height:normal;min-inline-size:0;place-content:center;place-items:center;position:relative;text-align:center}.settings-panel .settings-group .group-header h3{block-size:max-content;font-size:var(--font-md);line-height:normal;margin:0;max-block-size:none;text-align:center}.settings-panel .settings-group .group-header p{block-size:max-content;color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm);line-height:normal;margin:0;max-block-size:none}.settings-panel .settings-group .group-title{font-size:var(--font-base);font-weight:var(--font-weight-semibold)}.settings-panel .settings-group .group-note{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm)}.settings-panel .settings-group .group-body{block-size:fit-content;display:grid;gap:var(--gap-md);grid-template-columns:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;place-content:center;place-items:center;text-align:center}.settings-actions{align-items:center;display:flex;gap:var(--gap-md);grid-column:1/-1;justify-content:space-between;margin-block-start:var(--gap-sm);overflow:visible;padding:var(--padding-sm)}.settings-actions .btn.save{background:transparent;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-md,10px);color:inherit}.settings-actions .save-status{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm)}.view-settings{align-content:stretch;aspect-ratio:auto;background-color:initial;block-size:stretch;border-radius:0;display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:stretch;justify-items:stretch;max-block-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden;padding:.25rem;row-gap:0;-webkit-overflow-scrolling:touch;contain:layout paint}.view-settings header{margin:0;min-inline-size:0;padding:0}.view-settings header,.view-settings header h1,.view-settings header h2,.view-settings header p,.view-settings header span,.view-settings span{block-size:max-content;line-height:normal}.settings-form{aspect-ratio:auto;block-size:max-content;border-radius:var(--radius-lg);border-style:solid;border-width:.5px;box-shadow:none;contain:inline-size layout paint style;display:flex;flex-direction:column;gap:var(--gap-xl);grid-template-rows:minmax(0,1fr) minmax(0,max-content);inline-size:fit-content;max-inline-size:stretch;min-inline-size:min(100%,40rem);padding:var(--padding-lg);place-content:center;place-items:center}.settings-form .settings-panels{display:grid;gap:var(--gap-xl);inline-size:stretch;max-inline-size:stretch;min-inline-size:0}.settings-form>*{box-sizing:border-box;inline-size:stretch;max-inline-size:stretch;min-inline-size:fit-content}.settings-hero{align-items:center;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);gap:var(--gap-lg);grid-template-columns:auto 1fr;padding:var(--padding-xl)}.settings-hero,.settings-hero .hero-icon{background-color:var(--fl-surface,#fff);display:grid}.settings-hero .hero-icon{block-size:clamp(3rem,4vw,3.5rem);border-radius:50%;color:var(--fl-on-surface,#111);inline-size:clamp(3rem,4vw,3.5rem);place-items:center}.settings-hero .hero-icon ui-icon{--icon-size:clamp(1.6rem,2.4vw,1.9rem);--icon-color:currentColor}.settings-hero .hero-body{display:grid;gap:var(--gap-sm);min-inline-size:0}.settings-hero .hero-body h1{font-size:var(--font-2xl);font-weight:var(--font-weight-bold);margin:0}.settings-hero .hero-body p{color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);font-size:var(--font-base);margin:0}.settings-nav{border-radius:var(--radius-lg);display:flex;gap:var(--gap-md);overflow-block:hidden;overflow-inline:auto;padding:var(--padding-xs);scrollbar-color:oklch(from --c2-on-surface(var(--scrollbar-tint),var(--current,var(--color-on-surface,var(--md-on-surface,#1c1b1f)))) l c h/var(--scrollbar-opacity)) transparent;scrollbar-width:thin;-webkit-overflow-scrolling:touch}.settings-nav::-webkit-scrollbar{block-size:6px;inline-size:6px}.settings-nav::-webkit-scrollbar-thumb{background-color:oklch(from --c2-on-surface(var(--scrollbar-tint),var(--current,var(--color-on-surface,var(--md-on-surface,#1c1b1f)))) l c h/var(--scrollbar-opacity));border-radius:var(--radius-full)}.settings-nav::-webkit-scrollbar-track{background-color:initial}.settings-nav{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111);scrollbar-width:none}.settings-nav .settings-tab{align-items:center;background:transparent;border-radius:var(--radius-full);cursor:pointer;display:flex;font-size:var(--font-sm);gap:var(--gap-sm);justify-content:center;padding:var(--padding-sm) var(--padding-lg);transition:var(--transition-colors);white-space:nowrap}.settings-nav .settings-tab ui-icon{--icon-size:var(--icon-size-md)}.settings-nav .settings-tab.is-active{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.settings-nav .settings-tab:where(:hover,:focus-visible):not(.is-active){background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.settings-actions-group{background:linear-gradient(135deg,var(--surface-opacity-subtle),var(--surface-opacity-muted));border:0 transparent;border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);overflow:visible;padding:var(--padding-sm);place-content:center;place-items:center;text-align:center}.settings-actions-group header,.settings-actions-group p{block-size:max-content;inline-size:max-content;line-height:normal;max-block-size:none;min-inline-size:0;place-content:center;place-items:center;text-align:center}.mcp-actions{background:linear-gradient(135deg,var(--surface-opacity-subtle),var(--surface-opacity-muted));border:0 transparent;border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);order:99;overflow:visible;padding:var(--padding-sm);place-content:center;place-items:center;text-align:center}.mcp-actions header,.mcp-actions p{block-size:max-content;inline-size:max-content;line-height:normal;max-block-size:none;min-inline-size:0;place-content:center;place-items:center;text-align:center}.mcp-actions .add-mcp{background:transparent;border:1px solid var(--surface-opacity-emphasis,rgba(0,0,0,.12));border-radius:var(--radius-md,10px);color:inherit}.mcp-actions .add-mcp:active{transform:translateY(0)}.mcp-actions .add-mcp ui-icon{--icon-size:var(--icon-size-md);transition:transform var(--transition-colors)}.mcp-actions .add-mcp:where(:hover,:focus-visible) ui-icon{transform:rotate(90deg)}.color-option{--current:attr(data-color type(<color>));appearance:none;aspect-ratio:1/1;background-color:attr(data-color type(<color>))!important;block-size:2.5rem;border:2px solid transparent;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.1);cursor:pointer;font-size:0;inline-size:2.5rem;line-height:0;margin:0;max-block-size:2.5rem;max-inline-size:2.5rem;min-block-size:fit-content;min-inline-size:fit-content;outline:none;padding:1rem}.shape-palette-grid{align-items:center;display:flex;flex-wrap:wrap;gap:var(--gap-sm);justify-content:flex-start;padding:var(--padding-xs)}.shape-option{align-items:center;aspect-ratio:1/1.2;background:transparent;block-size:max-content;border:2px solid transparent;border-radius:var(--radius-md);cursor:pointer;display:flex;flex-direction:column;gap:var(--gap-xs);min-inline-size:4.5rem;padding:var(--padding-sm);transition:all var(--transition-fast) ease-out}.shape-option,.shape-option:hover{background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111)}.shape-option:hover{transform:translateY(-2px)}.shape-option.is-selected{background-color:var(--fl-surface,#fff);border-color:var(--primary,currentColor);color:var(--fl-on-surface,#111)}.shape-option .shape-preview{aspect-ratio:1/1;background-color:var(--on-surface,currentColor);block-size:2.5rem;inline-size:2.5rem;opacity:.7;transition:all var(--transition-fast) ease-out}.shape-option.is-selected .shape-preview{background-color:var(--primary,currentColor);opacity:1}.shape-option:hover .shape-preview{opacity:1}.shape-option .shape-label{color:var(--on-surface,currentColor);font-size:var(--font-xs);opacity:.7;text-align:center;white-space:nowrap}.shape-option.is-selected .shape-label{font-weight:var(--font-weight-medium);opacity:1}.mcp-config{background-color:var(--fl-surface,#fff);border:0 transparent;border-radius:var(--radius-lg);color:var(--fl-on-surface,#111);margin-block-end:var(--gap-md);order:calc(1 + sibling-index());overflow:hidden;padding:var(--padding-lg);position:relative;transition:all var(--transition-colors) ease-in-out}.mcp-config:before{background:linear-gradient(135deg,var(--primary-opacity-subtle) 0,transparent 50%,var(--secondary-opacity-subtle) 100%);content:\"\";inset:0;opacity:0;pointer-events:none;position:absolute;transition:opacity var(--transition-colors)}.mcp-config:where(:hover,:focus-visible,:focus-within){border-color:var(--primary-opacity-default);border-width:0}.mcp-config:where(:hover,:focus-visible,:focus-within):before{opacity:1}.mcp-config .mcp-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:var(--gap-md);position:relative;z-index:1}.mcp-config .mcp-header h4{align-items:center;color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);display:flex;font-size:var(--font-md);font-weight:var(--font-weight-semibold);gap:var(--gap-xs);margin:0}.mcp-config .mcp-header h4:before{content:\"🔌\";font-size:var(--font-sm);opacity:.7}.mcp-config .mcp-header .remove-mcp{border-radius:var(--radius-full);font-size:var(--font-xs);gap:var(--gap-xs);overflow:hidden;padding:var(--padding-xs) var(--padding-sm);position:relative;transition:all var(--transition-colors) ease-in-out}.mcp-config .mcp-header .remove-mcp:before{background:radial-gradient(circle,var(--danger-opacity-muted) 0,transparent 70%);content:\"\";inset:0;position:absolute;transform:scale(0);transition:transform var(--transition-colors)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible){background-color:var(--fl-surface,#fff);color:var(--fl-on-surface,#111);transform:scale(1.05)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible):before{transform:scale(1)}.mcp-config .mcp-header .remove-mcp:active{transform:scale(.95)}.mcp-config .mcp-header .remove-mcp ui-icon{--icon-size:var(--icon-size-sm);transition:transform var(--transition-colors)}.mcp-config .mcp-header .remove-mcp:where(:hover,:focus-visible) ui-icon{transform:rotate(180deg)}.mcp-config .mcp-fields{display:grid;gap:var(--gap-md);position:relative;z-index:1}.mcp-config.mcp-config-new{animation:slideInUp .3s ease-out}.view-settings .settings-screen__footer{align-items:stretch;flex-direction:column-reverse;gap:var(--space-sm);justify-content:start;overflow:visible}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center}.settings-hero{grid-template-columns:1fr;justify-items:center;text-align:center}.settings-nav .settings-tab{flex:1 0 auto}.settings-panel{padding:var(--padding-lg)}.settings-form,.settings-panel{place-content:start!important;align-content:flex-start!important;justify-content:flex-start!important;place-items:stretch!important;align-items:stretch!important;text-align:start!important}.view-settings{text-align:start!important}.view-settings :where(input:not([type=checkbox]):not([type=radio]),select,textarea,button){font-size:.875rem;line-height:1.25;min-block-size:2rem}.view-settings :where(input[type=checkbox],input[type=radio]){box-sizing:border-box;min-block-size:unset;min-inline-size:unset}.view-settings .form-checkbox input[type=checkbox],.view-settings label.field.checkbox input[type=checkbox]{align-self:center;aspect-ratio:1;block-size:1.25rem;border-radius:var(--radius-xs,4px);flex-shrink:0;inline-size:1.25rem;min-block-size:1.25rem}.view-settings .settings-tab-actions{flex-wrap:nowrap}}@layer tokens{:root:has([data-view=settings]),html:has([data-view=settings]){--view-layout:\"flex\";--view-sidebar-visible:true;--view-padding:var(--space-6);--view-content-max-width:none;--view-section-gap:var(--space-8);--view-field-gap:var(--space-4);--view-label-color:var(--color-text-secondary);--settings-divider:color-mix(in oklab,var(--color-outline-variant) 32%,transparent);--settings-card-surface:color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface));--settings-card-edge:color-mix(in oklab,var(--color-outline-variant) 16%,transparent);--settings-card-shadow:0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent);--settings-chip-edge:color-mix(in oklab,var(--color-outline-variant) 12%,transparent)}}@layer components{.view-settings{align-content:stretch;background-color:var(--view-bg,var(--color-surface,#ffffff));block-size:100%;color:var(--view-fg,var(--color-on-surface,#1a1a1a));display:grid;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;inline-size:100%;justify-items:stretch;margin-inline:0;max-block-size:100%;min-block-size:0;overflow:hidden;padding:var(--space-lg);row-gap:0;text-align:start}.view-settings :where(select,input,textarea,option){pointer-events:auto}.view-settings textarea{box-sizing:border-box;container-type:inline-size;inline-size:stretch;max-inline-size:stretch;resize:block}.view-settings h2{color:var(--color-on-surface);font-size:var(--text-xl,20px);font-weight:var(--font-weight-bold,700);letter-spacing:-.02em;margin:0}.view-settings h3{text-align:start}.view-settings .card{background:var(--settings-card-surface,color-mix(in oklab,var(--color-surface-container) 92%,var(--color-surface)));border:none;border-radius:var(--radius-xl,16px);box-shadow:var(--settings-card-shadow,0 2px 20px color-mix(in oklab,var(--color-on-surface) 5%,transparent)),0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 16%,transparent));display:flex;flex-direction:column;gap:var(--spacing-md,12px);inline-size:stretch;padding:var(--spacing-md,16px)}@container (max-inline-size: 480px){.view-settings .card{border-radius:var(--radius-lg,14px);gap:var(--spacing-sm,10px);padding:var(--spacing-md,14px)}}.view-settings .card h3{color:var(--color-on-surface);font-size:var(--text-base,15px);font-weight:var(--font-weight-semibold,600);letter-spacing:-.01em;margin:0}.view-settings .card .form-select{inline-size:stretch}.view-settings .field{display:grid;flex-direction:column;font-size:var(--text-xs,12px);gap:var(--spacing-xs,6px);grid-auto-flow:row;inline-size:stretch}.view-settings .field>span{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);opacity:.85}.view-settings .field.checkbox{align-items:center;gap:var(--spacing-sm,10px);grid-auto-columns:max-content 1fr;grid-auto-flow:column}.view-settings .mcp-actions{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;margin-block-start:var(--space-xs,8px)}.view-settings .mcp-section{display:flex;flex-direction:column;gap:var(--space-sm,8px)}.view-settings .mcp-row{background:color-mix(in oklab,var(--color-surface-container-low) 88%,var(--color-surface));border:none;border-radius:var(--radius-lg,14px);box-shadow:inset 0 0 0 1px var(--settings-card-edge,color-mix(in oklab,var(--color-outline-variant) 14%,transparent));display:grid;gap:var(--space-sm,8px);padding:var(--space-md,12px)}.view-settings .mcp-row .field{margin:0}.view-settings .mcp-empty-note{color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);margin:0;opacity:.85}.view-settings .settings-screen__top{align-items:stretch;border-block-end:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));display:flex;flex-direction:column;flex-shrink:0;gap:var(--space-sm);min-inline-size:0;padding-block-end:var(--space-md)}.view-settings .settings-screen__title{font-weight:var(--font-weight-semibold,600);letter-spacing:-.015em}@media (min-width:720px){.view-settings .settings-screen__top{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between}.view-settings .settings-screen__top .settings-tab-actions{flex:1;justify-content:flex-end}}.view-settings .settings-screen__body{min-block-size:0;min-inline-size:0;overflow:auto;overflow-block:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:var(--space-lg);overscroll-behavior:contain;padding-block:var(--space-md);scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.view-settings .settings-screen__body::-webkit-scrollbar{inline-size:6px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--color-outline-variant) 45%,transparent);border-radius:99px}.view-settings .settings-screen__body::-webkit-scrollbar-thumb:hover{background:color-mix(in oklab,var(--color-outline) 55%,transparent)}.view-settings .settings-screen__footer{align-items:center;background:color-mix(in oklab,var(--color-surface-container-low,var(--color-surface-container)) 72%,var(--color-surface));border-block-start:1px solid var(--settings-divider,color-mix(in oklab,var(--color-outline-variant) 32%,transparent));box-shadow:0 -12px 28px color-mix(in oklab,var(--color-on-surface) 4%,transparent);display:flex;flex-shrink:0;flex-wrap:wrap;gap:var(--space-sm);inline-size:stretch;justify-content:start;margin-block-start:0;padding-block:var(--space-md,.25rem);padding-inline:var(--space-lg,.5rem)}.view-settings .settings-tab-actions{align-items:center;container-type:inline-size;display:flex;flex-wrap:nowrap;gap:var(--space-xs,6px);inline-size:stretch;justify-content:flex-start}.view-settings .settings-tab-btn{background:color-mix(in oklab,var(--color-surface-container-low) 94%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface-variant);cursor:pointer;font-size:var(--text-xs,12px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem .875rem;transition:background-color var(--motion-fast),color var(--motion-fast),box-shadow var(--motion-fast)}.view-settings .settings-tab-btn:hover{background:color-mix(in oklab,var(--color-surface-container) 92%,transparent);color:var(--color-on-surface)}.view-settings .settings-tab-btn.is-active{background:var(--color-primary);box-shadow:0 2px 12px color-mix(in oklab,var(--color-primary) 28%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 40%,transparent);color:var(--color-on-primary)}.view-settings .settings-tab-panel{display:none}.view-settings .settings-tab-panel.is-active{display:flex}.view-settings .btn{background:color-mix(in oklab,var(--color-surface-container) 88%,transparent);border:none;border-radius:var(--radius-full,999px);box-shadow:0 0 0 1px var(--settings-chip-edge,color-mix(in oklab,var(--color-outline-variant) 12%,transparent));color:var(--color-on-surface);cursor:pointer;font-family:inherit;font-size:var(--text-sm,13px);font-weight:var(--font-weight-medium,500);min-block-size:2.5rem;padding:.5rem 1.125rem;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),filter var(--motion-fast)}.view-settings .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 6%,transparent)}.view-settings .btn.primary{background:var(--color-primary);border-color:transparent;box-shadow:0 2px 14px color-mix(in oklab,var(--color-primary) 32%,transparent),0 0 0 1px color-mix(in oklab,var(--color-primary) 55%,transparent);color:var(--color-on-primary,#fff)}.view-settings .btn.primary:hover{filter:brightness(1.06)}.view-settings .ext-note,.view-settings .note{color:var(--color-on-surface-variant);display:block;flex-grow:0;flex-shrink:1;font-size:var(--text-xs,12px);max-inline-size:stretch;opacity:.9;overflow:hidden;pointer-events:none;text-overflow:ellipsis;white-space:nowrap}.view-settings .ext-note{opacity:.8}.view-settings .ext-note code{background:var(--color-surface-container-highest);border-radius:var(--radius-xs,4px);font-size:var(--text-xs,11px);padding:2px 4px}@container (max-inline-size: 1024px){.view-settings{padding:var(--space-md)}}@container (max-inline-size: 768px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{font-size:var(--text-lg,17px)}.view-settings .settings-screen__top{gap:var(--space-md)}}@container (max-inline-size: 560px){.view-settings .settings-tab-actions{gap:.375rem}.view-settings .settings-tab-btn{min-block-size:2.75rem;padding-inline:.75rem}}@container (max-inline-size: 480px){.view-settings{padding:var(--space-sm)}.view-settings .settings-screen__title{display:none}.view-settings .settings-screen__body{gap:var(--space-md);padding-block:var(--space-sm)}.view-settings .settings-screen__footer{align-items:stretch;box-shadow:0 -8px 24px color-mix(in oklab,var(--color-on-surface) 5%,transparent);flex-direction:column-reverse;gap:var(--space-sm);inline-size:stretch;padding-block:var(--space-sm)}.view-settings .settings-screen__footer .btn.primary{align-items:center;display:inline-flex;inline-size:100%;justify-content:center;min-block-size:2.75rem}.view-settings .settings-screen__footer .note{text-align:center;white-space:normal}}.view-settings__content{inline-size:100%;max-inline-size:clamp(640px,90%,800px)}.view-settings__title{font-size:1.75rem;font-weight:var(--font-weight-bold,700);margin:0 0 2rem}.view-settings__section{border-block-end:1px solid var(--view-border,rgba(0,0,0,.1));display:flex;flex-direction:column;margin-block-end:2rem;padding-block-end:2rem}.view-settings__section:last-of-type{border-block-end:none}.view-settings__section h2{color:var(--view-fg);font-size:1.125rem;font-weight:var(--font-weight-semibold,600);margin:0 0 1rem}.view-settings__group{display:flex;flex-direction:column;gap:1rem}.view-settings__label{display:flex;flex-direction:column;gap:.375rem}.view-settings__label>span{font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500)}.view-settings__actions{display:flex;gap:.75rem;margin-block-start:2rem}.view-settings__btn{background:transparent;border:1px solid var(--view-border,rgba(0,0,0,.15));border-radius:var(--radius-sm,6px);color:var(--view-fg);cursor:pointer;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);padding:.625rem 1.25rem;transition:background-color var(--motion-fast)}.view-settings__btn:hover{background-color:rgba(0,0,0,.05)}.view-settings__btn--primary{background-color:var(--color-primary,#007acc);border-color:var(--color-primary,#007acc);color:white}.view-settings__btn--primary:hover{filter:brightness(1.1)}.settings-group{display:grid;gap:var(--space-lg);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.settings-section{background:var(--color-surface-container-high);border-radius:var(--radius-xl);box-shadow:var(--elev-2);overflow:hidden;padding:var(--space-xl);position:relative;transition:all var(--motion-normal)}@container (max-inline-size: 1024px){.settings-section{border-radius:var(--radius-lg);padding:var(--space-lg)}}@container (max-inline-size: 768px){.settings-section{padding:var(--space-md)}}@container (max-inline-size: 480px){.settings-section{border-radius:var(--radius-md);padding:var(--space-sm)}}.settings-section:hover{box-shadow:var(--elev-3);transform:translateY(-2px)}@media (prefers-reduced-motion:reduce){.settings-section:hover{transform:none}}.settings-section:before{background:linear-gradient(135deg,color-mix(in oklab,var(--color-tertiary) 2%,transparent) 0,transparent 100%);border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute}.settings-section>*{position:relative;z-index:1}.settings-section .settings-header{margin-block-end:var(--space-lg);padding-block-end:var(--space-md)}.settings-section .settings-header h3{align-items:start;color:var(--color-on-surface);display:flex;font-size:var(--text-lg);font-weight:var(--font-weight-semibold);gap:var(--space-sm);margin:0}@container (max-inline-size: 768px){.settings-section .settings-header h3{font-size:var(--text-base)}}.settings-section .settings-header h3 ui-icon{margin-inline-end:var(--space-sm);opacity:.7}.settings-section .form-group{margin-block-end:var(--space-lg)}.settings-section .form-group:last-child{margin-block-end:0}.settings-section .form-group label{color:var(--color-on-surface);display:block;font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-end:var(--space-sm)}.settings-section .form-group textarea{font-family:var(--font-family-mono);min-block-size:100px;resize:vertical}.settings-section .settings-actions{display:flex;flex-wrap:nowrap;gap:var(--space-md);justify-content:flex-end;margin-block-start:var(--space-xl);padding-block-start:var(--space-lg)}@container (max-inline-size: 768px){.settings-section .settings-actions{flex-direction:column;gap:var(--space-sm)}}.settings-section .settings-actions .action-btn{background:var(--color-surface-container-high);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);min-block-size:44px;padding-block:var(--space-xl);padding-inline:var(--space-sm);transition:all var(--motion-fast)}.settings-section .settings-actions .action-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);transform:translateY(-1px)}.settings-section .settings-actions .action-btn:active{box-shadow:none;transform:translateY(0)}.settings-section .settings-actions .action-btn.primary{background:var(--color-tertiary);color:var(--color-on-tertiary)}.settings-section .settings-actions .action-btn.primary:hover{background:color-mix(in oklab,var(--color-tertiary) 85%,black)}}";
//#endregion
//#region src/shared/config/admin-doors.ts
var trimTrailingSlashes = (value) => value.replace(/\/+$/u, "") || "";
var normalizeAdminPath = (raw) => {
	const t = (raw ?? "/").trim() || "/";
	return t.startsWith("/") ? t : `/${t}`;
};
var hostFromEndpointUrl = (endpointUrl) => {
	const ep = (endpointUrl || "").trim();
	if (!ep) return null;
	try {
		return new URL(ep).hostname || null;
	} catch {
		return null;
	}
};
var resolveControlDoorUrls = (core, pathOverride) => {
	const path = normalizeAdminPath(pathOverride ?? core?.admin?.path);
	let httpsOrigin = (core?.admin?.httpsOrigin || "").trim();
	let httpOrigin = (core?.admin?.httpOrigin || "").trim();
	const host = hostFromEndpointUrl(core?.endpointUrl);
	if (host) {
		if (!httpsOrigin) httpsOrigin = `https://${host}:8443`;
		if (!httpOrigin) httpOrigin = `http://${host}:8080`;
	}
	if (!httpsOrigin) httpsOrigin = "https://localhost:8443";
	if (!httpOrigin) httpOrigin = "http://localhost:8080";
	const join = (origin) => {
		const base = trimTrailingSlashes(origin);
		if (path === "/") return `${base}/`;
		return `${base}${path}`;
	};
	return {
		https: join(httpsOrigin),
		http: join(httpOrigin)
	};
};
/**
* Resolves HTTPS (default :8443) and HTTP (default :8080) admin/control URLs for the CWS / cwsp endpoint.
* When `core.admin.*` is empty, uses `endpointUrl` hostname with standard ports, then localhost.
*/
function resolveAdminDoorUrls(core) {
	return resolveControlDoorUrls(core);
}
function openAdminDoorUrl(url, target = "_blank") {
	try {
		globalThis.open?.(url, target, "noopener,noreferrer");
	} catch {}
}
function openAdminDoorFromCore(core, protocol) {
	const urls = resolveAdminDoorUrls(core);
	openAdminDoorUrl(protocol === "https" ? urls.https : urls.http);
}
//#endregion
//#region src/frontend/views/settings/ts/settings-utils.ts
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
//#region src/frontend/views/settings/ts/settings-mcp.ts
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
//#region src/frontend/views/settings/sections/SettingsFooter.ts
var createSettingsFooter = () => H`<footer class="settings-screen__footer">
        <button class="btn primary" type="button" data-action="save">Save</button>
        <span class="note" data-note></span>
    </footer>`;
//#endregion
//#region src/frontend/views/settings/sections/SettingsHeader.ts
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
//#region src/frontend/views/settings/sections/SettingsAppearance.ts
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
//#region src/frontend/views/settings/sections/SettingsMarkdown.ts
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
//#region src/frontend/views/settings/sections/SettingsAI.ts
var createAiSection = () => H`<section class="card settings-tab-panel is-active" data-tab-panel="ai">
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
    </section>`;
//#endregion
//#region src/frontend/views/settings/sections/SettingsMcp.ts
var createMcpSection = () => H`<section class="card settings-tab-panel" data-tab-panel="mcp">
      <h3>MCP</h3>
      <div class="mcp-section" data-mcp-section></div>
      <div class="mcp-actions">
        <button class="btn" type="button" data-action="add-mcp-server">Add MCP server</button>
      </div>
    </section>`;
//#endregion
//#region src/frontend/views/settings/sections/SettingsServer.ts
/** CWSP endpoint and device identity. */
var createServerSection = () => H`<section class="card settings-tab-panel" data-tab-panel="server">
      <h3>Server</h3>
      <p class="field-hint" style="margin: 0 0 0.75rem; opacity: 0.88; font-size: 0.9em;">
        Connect to the hub with server URL and client id. Optional client identifier token and TLS options below.
      </p>
      <h4>Endpoint and identity</h4>
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
    </section>`;
//#endregion
//#region src/frontend/views/settings/sections/CustomInstructionsEditor.ts
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
//#region src/frontend/views/settings/sections/SettingsInstructions.ts
var createInstructionsSection = (setNote) => H`<section class="card settings-tab-panel" data-tab-panel="instructions" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions="editor">
        ${createCustomInstructionsEditor({ onUpdate: () => setNote("Instructions updated.") })}
      </div>
    </section>`;
//#endregion
//#region src/frontend/views/settings/sections/SettingsExtension.ts
var createExtensionSection = () => H`<section class="card settings-tab-panel" data-tab-panel="extension" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox form-checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>`;
//#endregion
//#region src/frontend/views/settings/ts/Settings.ts
var createSettingsView = (opts) => {
	loadAsAdopted(Settings_default);
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
		opts.onTheme?.(theme?.value || "auto");
	}).catch(() => {
		renderMcpConfigurations(mcpSection, []);
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
			import("../chunks/clipboard-device.js").then((n) => n.t).then((m) => m.openAppClipboardRelatedSettings()).then(() => setNote("App settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
			return;
		}
		if (t?.closest?.("button[data-action=\"open-native-notification-settings\"]")) {
			import("../chunks/clipboard-device.js").then((n) => n.t).then((m) => m.openNativeNotificationSettings?.()).then(() => setNote("Notification settings opened (native shell only).")).catch(() => setNote("Native settings unavailable in this context."));
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
			import("../chunks/hub-socket-boot.js").then((n) => n.n).then((m) => m.applyHubSocketFromSettings(saved));
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
	invokeChannelApi(action, payload) {
		if (action === SettingsChannelAction.Patch || action === SettingsChannelAction.SettingsUpdate) {
			this.handleMessage({ data: payload });
			return true;
		}
	}
};
function createView(options) {
	return new SettingsView(options);
}
//#endregion
export { SettingsView, createView, createView as default };
