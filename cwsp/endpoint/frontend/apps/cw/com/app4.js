import { E as MOCElement, I as isInFocus, O as addEvent, _ as loadInlineStyle, a as handleStyleChange, g as loadAsAdopted, v as preloadStyle } from "../fest/dom.js";
import { c as ref, g as isUserScopePath, n as affected, o as observe, s as propRef } from "../fest/object.js";
import { G as defineElement, J as E, K as property, L as initGlobalClipboard, R as ctxMenuTrigger, W as GLitElement, Y as bindWith, _ as readFile, b as writeFile, d as getDirectoryHandle, f as getFileHandle, g as provide, h as openDirectory, l as downloadFile, m as handleIncomingEntries, p as getMimeTypeByFilename, q as H, u as getDir, v as remove, y as uploadFile } from "./app.js";
import { a as ensureStyleSheet } from "../fest/icon.js";
import { t as purify } from "../vendor/dompurify.js";
import { t as g } from "../vendor/marked.js";
import { t as src_default } from "../vendor/katex.js";
import { t as renderMathInElement } from "../vendor/katex2.js";
//#region shared/fest/fl-ui/styles/index.scss?inline
var styles_default = "@import \"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\";:host,:root,:scope{font-family:Inter,sans-serif;font-optical-sizing:auto;font-variation-settings:\"opsz\" 16}@supports (font-variation-settings:normal){:host,:root,:scope{font-family:InterVariable,sans-serif;font-optical-sizing:auto;font-variation-settings:\"opsz\" 16}}@font-feature-values InterVariable{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}@font-feature-values Inter{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}@font-feature-values InterDisplay{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}:root{--fl-ui-radius:0.5rem;--fl-ui-gap:0.75rem;--color-surface:#151d2e;--color-on-surface:#e8edf5;--color-on-surface-variant:#8b9bb8;--color-primary:#3794ff;--error-color:#f87171}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn,button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled),button:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible,button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn:disabled,button:disabled{cursor:not-allowed;opacity:.5}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:d 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon img,ui-icon svg{block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, markdown, overrides, print, print-breaks;@keyframes d{to{transform:rotate(1turn)}}@keyframes e{0%{opacity:0;translate:0 10px}to{opacity:1}}@page{size:a4;margin:2rem;@bottom-center{content:counter(page);font-family:var(--print-font-family-sans);font-size:10pt}@top-right{content:\"UC\";font-family:var(--print-font-family-sans);font-size:10pt}}@page :first{margin-block:2cm 2.5cm;margin-inline:2cm}@page :left{margin-inline:2cm}@page :right{margin-inline:2cm}@page narrow{size:a5 portrait;margin:1.5cm}@page wide{size:a4 landscape;margin:2cm}@page letter{size:letter;margin:2.5cm 2cm}@page legal{size:legal;margin:2.5cm 2cm}@page professional{size:a4;margin:2.5cm 2cm;marks:crop cross;bleed:.25cm}@page booklet{size:a5;margin:1.5cm}@page draft{size:a4;margin:2cm 1.5cm}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=right]{margin-inline-start:auto;padding-inline-start:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=left]{margin-inline-end:auto;padding-inline-end:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=center]{margin-inline:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[width]{inline-size:attr(width px,auto)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[height]{block-size:attr(height px,auto)}@layer tokens{:host,:root,:scope{--print-font-family:var(--font-family-serif,\"Times New Roman\",\"Liberation Serif\",\"Noto Serif\",serif);--print-font-family-sans:var(--font-family-sans,\"Inter\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif);--print-font-mono:var(--font-family-mono,\"Monaco\",\"Menlo\",\"Ubuntu Mono\",\"Liberation Mono\",monospace);--print-text-color:light-dark(#1a1a1a,#f3f4f6);--print-bg:light-dark(#fff,#111827);--print-border-color:light-dark(#d1d5db,#374151);--print-link-color:light-dark(#2563eb,#60a5fa)}}@layer markdown{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden]){--base-size-4:0.25em;--base-size-8:0.5em;--base-size-16:1em;--base-size-24:1.5em;--base-size-40:2.5em;--base-text-weight-normal:400;--base-text-weight-medium:500;--base-text-weight-semibold:600;--fontStack-monospace:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;--color-primary:light-dark(#5a7fff,#7ca7ff);--color-secondary:light-dark(#6b7280,#94a3b8);--color-accent:light-dark(#64748b,#94a3b8);--color-success:light-dark(#10b981,#34d399);--color-warning:light-dark(#f59e0b,#fbbf24);--color-error:light-dark(#ef4444,#f87171);--color-info:light-dark(#60a5fa,#93c5fd);--color-surface:light-dark(#fafbfc,#0f1419);--color-surface-container:light-dark(#f1f5f9,#1e293b);--color-surface-container-low:light-dark(#f8fafc,#0f172a);--color-surface-container-lowest:light-dark(#fafbfc,#0f1419);--color-surface-container-high:light-dark(#e2e8f0,#334155);--color-surface-container-highest:light-dark(#cbd5e1,#475569);--color-on-surface:light-dark(#1e293b,#f1f5f9);--color-on-surface-variant:light-dark(#64748b,#94a3b8);--color-on-primary:light-dark(#ffffff,#ffffff);--color-on-secondary:light-dark(#ffffff,#ffffff);--color-outline:light-dark(#cbd5e1,#475569);--color-outline-variant:light-dark(#94a3b8,#64748b);--hover:light-dark(#f1f5f9,#334155);--active:light-dark(#e2e8f0,#1e293b);--focus:light-dark(#dbeafe,#1e40af);--elev-0:0 0 0 0 rgba(0,0,0,0%);--elev-1:0 1px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.12);--elev-2:0 2px 4px 0 rgba(0,0,0,0.14),0 3px 6px 0 rgba(0,0,0,0.11);--elev-3:0 4px 6px 0 rgba(0,0,0,0.14),0 6px 12px 0 rgba(0,0,0,0.11);--elev-4:0 6px 8px 0 rgba(0,0,0,0.14),0 9px 18px 0 rgba(0,0,0,0.11);--motion-fast:140ms ease;--motion-normal:200ms ease;--motion-slow:300ms ease;--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.5rem;--space-2xl:2rem;--radius-xs:0.25rem;--radius-sm:0.375rem;--radius-md:0.5rem;--radius-lg:0.75rem;--radius-xl:1rem;--radius-full:9999px;--focus-outlineColor:var(--color-primary);--fgColor-default:var(--color-on-surface);--fgColor-muted:var(--color-on-surface-variant);--fgColor-accent:var(--color-accent);--fgColor-success:var(--color-success);--fgColor-attention:var(--color-warning);--fgColor-danger:var(--color-error);--fgColor-done:var(--color-info);--bgColor-default:var(--color-surface);--bgColor-muted:var(--color-surface-container);--bgColor-neutral-muted:var(--color-surface-container-high);--bgColor-attention-muted:var(--color-warning);--borderColor-default:var(--color-outline);--borderColor-muted:var(--color-outline-variant);--borderColor-neutral-muted:var(--color-outline);--borderColor-accent-emphasis:var(--color-primary);--borderColor-success-emphasis:var(--color-success);--borderColor-attention-emphasis:var(--color-warning);--borderColor-danger-emphasis:var(--color-error);--borderColor-done-emphasis:var(--color-info);--active-brightness:config(\"effects\",\"active-brightness\");--border-radius:config(\"shape\",\"border-radius\");--box-shadow:config(\"shape\",\"box-shadow\");--color-accent:light-dark(\"accent\");--color-bg:light-dark(\"bg\");--color-bg-secondary:light-dark(\"bg-secondary\");--color-link:light-dark(\"link\");--color-secondary:light-dark(\"secondary\");--color-secondary-accent:light-dark(\"secondary-accent\");--color-shadow:light-dark(\"shadow\");--color-table:light-dark(\"table\");--color-text:light-dark(\"text\");--color-text-secondary:light-dark(\"text-secondary\");--color-scrollbar:light-dark(\"scrollbar\");--font-family-emoji-flag-capable:config(\"typography\",\"font-family\",\"emoji\");--font-family:config(\"typography\",\"font-family\",\"sans\");--hover-brightness:config(\"effects\",\"hover-brightness\");--justify-important:config(\"layout\",\"justify-important\");--justify-normal:config(\"layout\",\"justify-normal\");--line-height:config(\"layout\",\"line-height\");--width-card:config(\"layout\",\"widths\",\"card\");--width-card-medium:config(\"layout\",\"widths\",\"card-medium\");--width-card-wide:config(\"layout\",\"widths\",\"card-wide\");--width-content:config(\"layout\",\"widths\",\"content\");--md-scrollbar-size:config(\"scrollbar\",\"size\")}@media print{:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])){background-color:initial;block-size:max-content;box-sizing:border-box;color-scheme:inherit;container-type:inline-size;display:block;inline-size:100%;margin:0;max-block-size:none;min-block-size:max(100%,100cqb);overflow:auto;padding:0;touch-action:manipulation;user-select:text}:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) *,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :after,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :before{box-sizing:border-box}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:light-dark(#1f2328,#e6edf3);--md-fg-muted:light-dark(#656d76,#7d8590);--md-fg-accent:light-dark(#0969da,#2f81f7);--md-bg-default:light-dark(#ffffff,#0d1117);--md-bg-subtle:light-dark(#f6f8fa,#161b22);--md-bg-code:light-dark(#eff1f3,#25292f);--md-border-default:light-dark(#d0d7de,#30363d);--md-border-subtle:light-dark(#eff1f3,#21262d);--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;font-size:inherit;pointer-events:auto;scrollbar-color:var(--color-scrollbar) transparent;scrollbar-width:thin;touch-action:manipulation;user-select:text}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar{block-size:sass(10px);inline-size:sass(10px)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-thumb{background-color:var(--color-scrollbar);border-radius:9999px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-track{background-color:initial}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){background:var(--color-surface);block-size:stretch;box-shadow:var(--elev-1);color:var(--md-fg-default);color-scheme:inherit;display:flex;flex:1;flex-direction:column;font-family:var(--md-font-body,var(--print-font-family));font-size:16px;font-weight:400;line-height:1.4;overflow:auto;overflow-wrap:break-word;padding:var(--space-2xl) var(--space-xl);transition:box-shadow var(--motion-normal);word-wrap:break-word;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;contain:inline-size layout paint style;container-type:inline-size;isolation:isolate;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):hover{box-shadow:var(--elev-2)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):focus-within{box-shadow:var(--focus-ring,var(--elev-2));outline:none}@container (max-inline-size: 768px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){border-radius:var(--radius-lg);box-shadow:none;padding:var(--space-xl) var(--space-lg)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-default);font-weight:600;letter-spacing:-.015em;line-height:1.25;margin-block:1.5em .5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 tt{font-family:var(--md-font-mono);font-size:inherit}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid var(--md-border-subtle);padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-muted)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{margin-block:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{background-color:initial;color:var(--md-fg-accent);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;transition:color var(--motion-fast),text-decoration-thickness var(--motion-fast)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:hover{text-decoration-thickness:2px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:not([href]){color:inherit;text-decoration:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:focus-visible{border-radius:var(--radius-sm);box-shadow:var(--focus-ring);outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{margin-block:0 1rem;padding-inline-start:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ul,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{margin-block:0}@container (max-inline-size: 480px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{padding-inline-start:var(--space-xl)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li{margin-block-end:.25em;overflow-wrap:break-word;word-break:normal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li+li{margin-block-start:.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li>p{margin-block-start:1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-type:disc}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{list-style-type:circle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul ul{list-style-type:square}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol{list-style-type:decimal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=a]{list-style-type:lower-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=A]{list-style-type:upper-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=i]{list-style-type:lower-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=I]{list-style-type:upper-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{border-inline-start:.25em solid var(--md-border-default);color:var(--md-fg-muted);font-style:italic;margin:0 0 1rem;padding:0 1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{font-family:var(--md-font-mono);font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background-color:var(--md-bg-code);border-radius:6px;font-size:85%;padding:.2em .4em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background-color:var(--md-bg-code);block-size:max-content!important;border-radius:6px;content-visibility:visible!important;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;font-size:85%;inline-size:stretch;line-height:1.45;margin-block:0 1rem;max-block-size:none!important;max-inline-size:stretch;min-block-size:max(100%,100cqb)!important;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;padding:1rem;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;block-size:max-content!important;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{block-size:max-content;border-collapse:collapse;border-spacing:0;contain:inline-size layout paint style;container-type:inline-size;display:table;inline-size:fit-content;margin-block-end:1rem;max-inline-size:stretch;overflow:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tbody,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table thead{block-size:max-content;inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{block-size:max-content;border:1px solid var(--md-border-default);inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:6px 13px;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{background-color:var(--md-bg-subtle);block-size:max-content;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr{background-color:var(--md-bg-default);block-size:max-content;border-block-start:1px solid var(--md-border-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr:nth-child(2n){background-color:var(--md-bg-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table img{background-color:initial;block-size:auto;border-radius:0;inline-size:fit-content;margin:0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{background-color:var(--md-border-default);block-size:.25em;border:0;box-sizing:initial;margin-block:24px;overflow:hidden;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:before{content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:after{clear:both;content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{background-color:initial;block-size:auto;border-radius:var(--radius-md);border-style:none;box-sizing:initial;inline-size:fit-content;margin:var(--space-lg) 0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd{background-color:var(--md-bg-subtle);border:1px solid var(--md-border-default);border-radius:6px;box-shadow:inset 0 -1px 0 var(--md-border-default);color:var(--md-fg-default);display:inline-block;font-size:11px;line-height:10px;padding:3px 5px;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl{margin-block:var(--space-lg) 0;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dt{color:var(--md-fg-default);font-size:1em;font-style:italic;font-weight:600;margin-block-start:1rem;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dd{color:var(--color-on-surface-variant,var(--md-fg-muted));margin-block-end:1rem;margin-inline-start:0;padding:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details{display:block}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary{cursor:pointer;display:list-item}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h6{border-block-end:0;display:inline-block;margin:0;padding-block-end:0;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) math{math-style:compact;math-shift:compact;inline-size:fit-content;math-depth:auto-add;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) span{inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{contain:strict;inline-size:fit-content!important;max-inline-size:stretch!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input[type=checkbox]{accent-color:var(--color-primary,var(--md-fg-accent));margin-inline-end:var(--space-sm)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item{list-style-type:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item input[type=checkbox]{margin:0 .2em .25em -1.6em;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes{border-block-start:1px solid var(--md-border-default);color:var(--md-fg-muted);font-size:.75em;margin-block-start:2rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes ol{padding-inline-start:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li{position:relative}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target{color:var(--md-fg-default)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target:before{border:2px solid var(--md-fg-accent);border-radius:6px;content:\"\";inset:-8px -8px -8px -24px;pointer-events:none;position:absolute}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote-ref a{color:var(--md-fg-accent);font-size:.8em;vertical-align:super}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert{border-inline-start:.25em solid var(--md-border-default);margin-block-end:1rem;padding:.5rem 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-note{border-color:var(--md-fg-accent)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-important{border-color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-warning{border-color:#bf8700}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-tip{border-color:#1a7f37}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-caution{border-color:#d1242f}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title{align-items:center;display:flex;font-weight:600;line-height:1;margin-block-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title .octicon,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title .octicon{margin-inline-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon{display:inline-block;fill:currentColor;vertical-align:text-bottom}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji{display:inline-block;font-family:Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,sans-serif;font-size:1em;font-style:normal;font-weight:400;line-height:1;min-inline-size:1ch;vertical-align:-.075em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji img{block-size:1em;inline-size:1em;object-fit:contain}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor{float:inline-start;line-height:1;margin-inline-start:-20px;padding-inline-end:4px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor:focus{outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link{color:var(--md-fg-muted);opacity:.5;visibility:hidden}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link:hover{opacity:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) :is(h1,h2,h3,h4,h5,h6):hover .anchor .octicon-link{visibility:visible}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#6e7781}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#0550ae}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#cf222e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#0a3069}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#953800}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:var(--md-fg-default);font-size:1.1em;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none}.markdown-viewer-content{animation:e .3s ease-out}.markdown-viewer-raw{background:var(--color-surface);color:var(--color-on-surface);font-family:var(--print-font-mono);font-size:var(--text-sm,.875rem);line-height:1.5;margin:0;overflow:auto;padding:var(--space-xl);tab-size:2;white-space:pre}.viewer-header{align-items:center;background:var(--color-surface-container-high);display:flex;flex-shrink:0;gap:var(--space-lg);justify-content:space-between;padding:var(--space-lg) var(--space-xl)}@container (max-inline-size: 768px){.viewer-header{gap:var(--space-md);padding:var(--space-md) var(--space-lg)}}@container (max-inline-size: 480px){.viewer-header{align-items:stretch;flex-direction:column;gap:var(--space-sm)}}.viewer-header h3{font-size:var(--text-xl,1.25rem);font-weight:600;letter-spacing:-.025em;line-height:1.25;margin:0}.viewer-header .viewer-actions{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-sm)}@container (max-inline-size: 360px){.viewer-header .viewer-actions{overflow-block:hidden;overflow-inline:auto;padding-block-end:var(--space-xs);scrollbar-width:none}.viewer-header .viewer-actions::-webkit-scrollbar{display:none}}.viewer-btn{align-items:center;background:var(--color-surface-container);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-sm,.875rem);font-weight:500;gap:var(--space-xs);min-block-size:44px;padding:0;position:relative;transition:background var(--motion-fast),box-shadow var(--motion-fast),translate var(--motion-fast);white-space:nowrap}.viewer-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);translate:0 -1px}.viewer-btn:active{box-shadow:none;translate:0}.viewer-btn:focus-visible{box-shadow:var(--focus-ring);outline:none}.viewer-btn.btn-icon{padding:var(--space-sm)}.viewer-btn.btn-icon ui-icon{flex-shrink:0;transition:color var(--motion-fast)}.viewer-btn.btn-icon:hover ui-icon{color:var(--color-primary)}@container (max-inline-size: 640px){.viewer-btn.btn-icon{padding:var(--space-xs)}.viewer-btn.btn-icon .btn-text{display:none}}.viewer-btn.loading{opacity:.7;pointer-events:none}.viewer-btn.loading:after{animation:d 1s linear infinite;block-size:16px;border:2px solid transparent;border-block-start-color:initial;border-radius:50%;content:\"\";inline-size:16px;margin-inline-start:var(--space-xs)}@media (prefers-color-scheme:dark){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#8b949e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#79c0ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#ff7b72}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#a5d6ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#ffa657}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#d2a8ff}}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host),[data-hidden] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host){color-scheme:inherit;content-visibility:auto!important}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host) :where(*){content-visibility:auto!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{color-scheme:inherit}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:flex}}}@layer overrides{:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}.katex math{font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;math-style:compact;text-transform:none;math-shift:compact;math-depth:auto-add}.footnote-backref,.footnote-ref{font-variant-caps:normal;font-variant-emoji:text;font-variant-ligatures:common-ligatures;font-variant-numeric:tabular-nums}.footnote-backref,.footnote-backref *,.footnote-ref,.footnote-ref *{inline-size:fit-content;max-inline-size:stretch;text-align:start}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-code-inline-bg:color-mix(in oklab,var(--md-bg-code) 88%,var(--md-bg-default));--md-code-inline-fg:var(--md-fg-default);--md-code-block-bg:var(--md-bg-code);--md-code-block-fg:var(--md-fg-default);--md-code-block-border:color-mix(in oklab,var(--md-border-default) 60%,transparent);text-rendering:auto;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto;color-scheme:inherit!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{hyphens:manual;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background:var(--md-code-inline-bg);border:0;box-shadow:none;color:var(--md-code-inline-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background:var(--md-code-block-bg);border:1px solid var(--md-code-block-border);box-shadow:none;color:var(--md-code-block-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;box-shadow:none;color:inherit}}}@layer print{@media print{:where(:root,html,body){background-color:#fff!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;font-family:var(--print-font-family);font-size:12pt;font-variant-emoji:text;line-height:1.4;margin:0;overflow:visible!important;padding:0;print-color-adjust:economy;scrollbar-width:none}body{block-size:max-content!important;inline-size:100%!important;max-block-size:none!important;max-inline-size:100%!important;min-block-size:max(100%,100cqb)!important;scale:1!important;text-align:start;transform:none!important;zoom:1!important}:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:#1f2328;--md-fg-muted:#656d76;--md-fg-accent:#0969da;--md-bg-default:#ffffff;--md-bg-subtle:#f6f8fa;--md-bg-code:#eff1f3;--md-border-default:#d0d7de;--md-border-subtle:#eff1f3;--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;background:#fff;block-size:max-content!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;display:block!important;flex:none!important;font-family:var(--print-font-family);font-variant-emoji:text;inline-size:100%;margin:0;max-block-size:none!important;max-inline-size:100%;min-block-size:max(100%,100cqb)!important;overflow:visible!important;padding:0;scrollbar-width:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{background-color:initial;box-shadow:none;box-sizing:border-box;font-variant-emoji:text;max-inline-size:100%;text-shadow:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#111;font-weight:700;line-height:1.25;orphans:2;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid #ccc;padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#555}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{color:#111;hyphens:auto;orphans:3;text-align:justify;widows:3;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) b,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) strong{color:#111!important;filter:none;font-weight:700!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) em,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) i{color:#111!important;filter:none;font-style:italic!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{color:#333!important;overflow-wrap:break-word;text-decoration:underline!important;word-break:break-word;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a[href]:after{content:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{background:#f5f5f5;color:#111;filter:grayscale(1);font-family:var(--print-font-mono);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code){block-size:max-content!important;border:1px solid #ddd;border-radius:.25em;contain:none!important;content-visibility:visible!important;hyphens:none;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;overflow-wrap:break-word;padding:.125em .25em;position:relative!important;word-break:break-word}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{border:1px solid #ccc;border-radius:.5rem;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;padding:1rem;white-space:pre-wrap;word-wrap:break-word;block-size:max-content!important;content-visibility:visible!important;inline-size:stretch;margin-block:1.2em;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;orphans:1;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code{border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;background:transparent;block-size:max-content!important;border:0;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{background:#fafafa;border-inline-start:4px solid #999;color:#333;filter:grayscale(1);font-style:italic;margin-block:1.2em;orphans:2;padding:.8em 1.2em;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{border:1px solid #999;border-collapse:collapse;display:table;inline-size:100%!important;max-inline-size:100%;table-layout:fixed;word-wrap:break-word;filter:grayscale(1);margin-block:1.2em;orphans:1;overflow-wrap:break-word;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{block-size:max-content;border:1px solid #999;color:#111;inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:.5em .75em;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{background:#e5e5e5;color:#333;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{block-size:0;border:none;border-block-start:1px solid #ccc;filter:grayscale(1);margin-block:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{block-size:auto;border-radius:0;display:block;filter:grayscale(1);image-rendering:pixelated;inline-size:fit-content;margin:1em auto;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg *{fill:currentColor!important;stroke:currentColor!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-position:outside;margin-block-end:1em;orphans:2;padding-inline-start:1.5rem;widows:2}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li::marker{color:#666!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) select,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) textarea{background:#fff!important;border:1px solid #999!important;color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .highlight,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .mark{background:#e6e6e6!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .reference{background:transparent!important;border-block-start:1px solid #ccc!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-]{background:#f8f8f8!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-] *{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-narrow{page:narrow}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-wide{page:wide}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-letter{page:letter}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-legal{page:legal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-professional{page:professional}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-booklet{page:booklet}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-draft{page:draft}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:last-child{margin-block-end:0}.print-view{block-size:100cqb;inline-size:100%;margin:0;overflow-inline:hidden;padding:0}.print-content{box-sizing:border-box;font-size:14pt;hyphens:auto;inline-size:100%;line-height:1.6;margin:0;padding:2rem;text-align:justify;word-wrap:break-word;overflow-wrap:break-word}}}@layer print-breaks{@media print{:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote,hr){break-after:auto;break-before:auto;break-inside:avoid}li,tr{break-inside:avoid}:where(h1,h2,h3,h4,h5,h6):has(+:where(p,ul,ol,li,table,blockquote,pre,code)){break-after:avoid}:where(p,:is(h1,h2,h3,h4,h5,h6)):has(+:where(ul,ol)){break-after:avoid!important}:where(p,:is(h1,h2,h3,h4,h5,h6))+:where(ul,ol){break-before:avoid!important}:where(h1,h2,h3,h4,h5,h6):has(+:where(table,pre,code,blockquote)){break-after:avoid!important}:where(h1,h2,h3,h4,h5,h6)+:where(table,pre,code,blockquote){break-before:avoid!important}hr:has(+:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote)){break-after:page!important}h1:first-of-type{break-before:avoid}:where(.pb,.np,.pagebreak,.newpage,.page-break,.new-page){background-color:initial;break-after:page;break-before:auto;break-inside:auto}.print-chapter{break-before:page}.print-section{break-before:avoid}:where(:heading,p,ol,ul)>:first-child{margin-block-start:0}:where(:heading,p,ol,ul)>:last-child{margin-block-end:0}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer layer.shell.faint.forms{input,select,textarea{background-repeat:no-repeat;font-size:inherit;max-inline-size:stretch;max-inline-size:100cqi;min-block-size:2.5rem;overflow:auto;scrollbar-width:none;text-overflow:ellipsis}textarea[data-multiline=true]{min-block-size:5rem;resize:vertical}}@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);container-type:inline-size;content-visibility:auto;display:grid;flex-grow:1;inline-size:stretch;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:stretch;display:grid;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,#1e1e1e);border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar button,:host(ui-file-manager) .fm-toolbar input{background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 ui-monospace,Cascadia Code,SF Mono,Consolas,monospace;inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left,:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:stretch;border-radius:0;grid-column:content-col;grid-row:2;inline-size:stretch;min-block-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);contain:none;container-type:size;display:block;grid-column:1/-1;inline-size:stretch;isolation:isolate;margin:0;overflow:auto;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:stretch;contain:strict;contain-intrinsic-size:1px 2.625rem;content-visibility:auto;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:stretch;min-block-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) a,:host(ui-file-manager-content) :where(.row) span{background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:8}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}";
//#endregion
//#region shared/fest/fl-ui/styles/font-loader.ts
/**
* Cache for Blob URLs to avoid re-creating them
*/
var blobUrlCache = /* @__PURE__ */ new Map();
/**
* Cache for FontFace instances
*/
var fontFaceCache = /* @__PURE__ */ new Map();
/**
* Decode base64 string to Uint8Array
* Uses Uint8Array.fromBase64 if available, otherwise falls back to atob
*/
function decodeBase64(base64) {
	if (typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(base64);
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
}
/**
* Decompress data using Compression Streams API
* Only used for fonts that were compressed (e.g., gzip)
* woff2 files are already compressed and don't need decompression
*/
async function decompress(data, algorithm = "gzip") {
	if (typeof CompressionStream === "undefined") throw new Error("Compression Streams API is not supported in this browser");
	const stream = new DecompressionStream(algorithm);
	const writer = stream.writable.getWriter();
	const reader = stream.readable.getReader();
	writer.write(data);
	writer.close();
	const chunks = [];
	let done = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) chunks.push(value);
	}
	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
/**
* Get or create a Blob URL from font data
* Caches the URL to avoid re-creating Blobs
*/
async function getBlobUrl(fontData, cacheKey, mimeType = "font/woff2") {
	if (blobUrlCache.has(cacheKey)) return blobUrlCache.get(cacheKey);
	const blob = new Blob([fontData], { type: mimeType });
	const url = URL.createObjectURL(blob);
	blobUrlCache.set(cacheKey, url);
	return url;
}
/**
* Load a font from base64-encoded, compressed data
*/
async function loadFont(metadata) {
	const { base64, family, style = "normal", weight = "normal", compressed = false } = metadata;
	const cacheKey = `${family}-${style}-${weight}`;
	if (fontFaceCache.has(cacheKey)) return fontFaceCache.get(cacheKey);
	const encodedData = decodeBase64(base64);
	const blobUrl = await getBlobUrl(compressed ? await decompress(encodedData) : encodedData, cacheKey, compressed ? "application/octet-stream" : "font/woff2");
	const fontFace = new FontFace(family, `url(${blobUrl}) format('woff2')`, {
		style,
		weight: typeof weight === "string" ? weight : `${weight}`,
		display: "swap"
	});
	await fontFace.load();
	document.fonts.add(fontFace);
	fontFaceCache.set(cacheKey, fontFace);
	return fontFace;
}
/**
* Load multiple fonts
*/
async function loadFonts(metadataArray) {
	const promises = metadataArray.map((metadata) => loadFont(metadata));
	return Promise.all(promises);
}
var loadingFontRegistry = null;
async function loadFontRegistry() {
	if (loadingFontRegistry) return loadingFontRegistry;
	loadingFontRegistry = import("./app5.js")?.catch?.((error) => {
		console.error("Failed to load font registry:", error);
	});
	return loadingFontRegistry;
}
/**
* Load all fonts from the registry
*/
async function loadAllFonts() {
	const fontRegistry = await loadFontRegistry();
	return loadFonts(Object.values(fontRegistry.fontRegistry));
}
/**
* Font data registry (populated by Vite plugin)
* Import from generated font-registry module
*/
//#endregion
//#region shared/fest/fl-ui/styles/index.ts
/**
* Veela.CSS TypeScript Module
*
* Exports font loading utilities and type definitions.
* Runtime styles and initialization are in ../scss/runtime/index.ts
*/
var fontStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;
var loader = async () => {
	await loadAsAdopted(fontStyles)?.catch(() => void 0);
	await loadAllFonts().catch(() => void 0);
	await loadAsAdopted(styles_default)?.catch(() => void 0);
};
//#endregion
//#region \0@oxc-project+runtime@0.123.0/helpers/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region shared/fest/fl-ui/ui/base/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor() {
		super();
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
var UIElement_default = UIElement;
//#endregion
//#region shared/fest/fl-ui/ui/navigation/statusbar/StatusBar.ts
var styled$4 = preloadStyle("@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}");
var StatusBar = class StatusBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$4;
	render = () => {
		return H`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`;
	};
};
StatusBar = __decorate([defineElement("ui-statusbar")], StatusBar);
//#endregion
//#region shared/fest/fl-ui/ui/navigation/taskbar/element/TaskBar.ts
var styled$3 = preloadStyle("@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}");
var UITaskBar = class UITaskBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$3;
	render = () => H`<div part="taskbar" class="taskbar"><slot></slot></div>`;
};
UITaskBar = __decorate([defineElement("ui-taskbar")], UITaskBar);
//#endregion
//#region shared/fest/fl-ui/ui/navigation/taskbar/element/Task.ts
var styled$2 = preloadStyle("@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}:host(ui-task),:host(ui-task) *{box-sizing:border-box;touch-action:manipulation;user-select:none;-webkit-user-drag:none;-webkit-tap-highlight-color:transparent;border:0 transparent;gap:0;margin:0;padding:0}:host(ui-task){box-shadow:none;filter:none;pointer-events:auto;user-select:none}:host(ui-task)>*{pointer-events:none}:host(ui-task:hover){--background-tone-shift:0.1;background-color:--c2-surface(var(--background-tone-shift,0),var(--current))}:host(ui-task[data-focus]){border-block-end-color:--c2-on-surface(0,var(--current))!important}:host(ui-task:not([data-active])){opacity:.6}");
var UITask = class UITask extends UIElement_default {
	title = "Task";
	icon = "github";
	constructor() {
		super();
	}
	styles = () => styled$2;
	render = function() {
		return H`
            <div part="icon" class="task-icon c2-contrast c2-transparent"><ui-icon class="c2-contrast c2-transparent" part="icon" icon="${this.icon}"></ui-icon></div>
            <div part="title" class="task-title c2-contrast c2-transparent">${this.title}</div>
        `;
	};
};
__decorate([property({ source: "attr" })], UITask.prototype, "title", void 0);
__decorate([property({ source: "attr" })], UITask.prototype, "icon", void 0);
UITask = __decorate([defineElement("ui-task")], UITask);
//#endregion
//#region shared/fest/fl-ui/ui/navigation/appearance/Desktop.ts
preloadStyle("ui-taskbar[data-type=desktop]>ui-task[data-focus]{background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]){background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}");
//#endregion
//#region shared/fest/fl-ui/ui/navigation/appearance/Mobile.ts
preloadStyle("ui-taskbar[data-type=mobile]>ui-task[data-focus]{background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]){background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}");
//#endregion
//#region shared/fest/fl-ui/ui/misc/Toast.ts
var DEFAULT_CONFIG = {
	containerId: "rs-toast-layer",
	position: "bottom",
	maxToasts: 5,
	zIndex: 2147483647
};
var DEFAULT_DURATION = 3e3;
var TRANSITION_DURATION = 200;
/** Suppress the same toast repeating within this window (main thread + broadcast). */
var DEDUPE_WINDOW_MS = 400;
var lastToastFingerprint = "";
var lastToastFingerprintAt = 0;
var toastFingerprint = (opts) => `${opts.kind || "info"}\0${opts.position || DEFAULT_CONFIG.position}\0${opts.message}`;
var hasVisibleDuplicate = (layer, message, kind) => {
	for (const el of Array.from(layer?.children ?? [])) if (el instanceof HTMLElement && el.classList.contains("rs-toast") && el.getAttribute("data-kind") === kind && el.textContent === message) return true;
	return false;
};
var TOAST_STYLES = `
@layer viewer-toast {
    .rs-toast-layer {
        position: fixed;
        z-index: var(--shell-toast-z, 2147483647);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        gap: 0.5rem;
        max-block-size: 80dvb;
        overflow: hidden;
        box-sizing: border-box;
    }

    .rs-toast-layer[data-position="bottom"],
    .rs-toast-layer:not([data-position]) {
        inset-block-end: 10dvb;
        inset-inline: 0;
        justify-content: flex-end;
    }

    .rs-toast-layer[data-position="top"] {
        inset-block-start: 10dvb;
        inset-inline: 0;
        justify-content: flex-start;
    }

    .rs-toast-layer[data-position="top-left"] {
        inset-block-start: 10dvb;
        inset-inline-start: 0;
        align-items: flex-start;
    }

    .rs-toast-layer[data-position="top-right"] {
        inset-block-start: 10dvb;
        inset-inline-end: 0;
        align-items: flex-end;
    }

    .rs-toast-layer[data-position="bottom-left"] {
        inset-block-end: 10dvb;
        inset-inline-start: 0;
        align-items: flex-start;
    }

    .rs-toast-layer[data-position="bottom-right"] {
        inset-block-end: 10dvb;
        inset-inline-end: 0;
        align-items: flex-end;
    }

    .rs-toast {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        max-inline-size: min(90vw, 32rem);
        inline-size: fit-content;

        border-radius: var(--toast-radius, 0.5rem);
        background-color: var(--toast-bg, light-dark(#fafbfc, #1e293b));
        box-shadow: var(--toast-shadow, 0 6px 14px rgba(0, 0, 0, 0.45));
        backdrop-filter: blur(12px) saturate(140%);
        color: var(--toast-text, light-dark(#000000, #ffffff));

        font-family: var(--toast-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        font-size: var(--toast-font-size, 0.875rem);
        font-weight: var(--toast-font-weight, 500);
        letter-spacing: 0.01em;
        line-height: 1.4;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;

        pointer-events: auto;
        user-select: none;
        cursor: default;

        opacity: 0;
        transform: translateY(100%) scale(0.9);
        transition:
            opacity 160ms ease-out,
            transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 100ms ease;
    }

    .rs-toast[data-visible] {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .rs-toast:active {
        transform: scale(0.98);
    }

    .rs-toast[data-kind="success"] {
        --toast-bg: var(--color-success, var(--color-success, #22c55e));
    }

    .rs-toast[data-kind="warning"] {
        --toast-bg: var(--color-warning, var(--color-warning, #f59e0b));
    }

    .rs-toast[data-kind="error"] {
        --toast-bg: var(--color-error, var(--color-error, #ef4444));
    }

    @media (prefers-reduced-motion: reduce) {
        .rs-toast,
        .rs-toast[data-visible] {
            transition-duration: 0ms;
            transform: none;
        }
    }

    @media print {
        .rs-toast-layer, .rs-toast {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            inset: 0 !important;
            z-index: -1 !important;
            inline-size: 0 !important;
            block-size: 0 !important;
            max-inline-size: 0 !important;
            max-block-size: 0 !important;
            min-inline-size: 0 !important;
            min-block-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            overflow: hidden !important;
        }
    }
}
`;
var injectedDocs = /* @__PURE__ */ new WeakSet();
var toastLayers = /* @__PURE__ */ new Map();
/**
* Ensure styles are injected into the document
*/
var ensureStyles = (doc = document) => {
	if (injectedDocs.has(doc)) return;
	const style = doc.createElement("style");
	style.id = "__rs-toast-styles__";
	style.textContent = TOAST_STYLES;
	(doc.head || doc.documentElement).appendChild(style);
	injectedDocs.add(doc);
};
/**
* Get or create a toast layer container
*/
var getToastLayer = (config, doc = document) => {
	const key = `${config.containerId}-${config.position}`;
	if (toastLayers.has(key)) {
		const existing = toastLayers.get(key);
		if (existing.isConnected) return existing;
		toastLayers.delete(key);
	}
	ensureStyles(doc);
	let layer = doc.getElementById(config.containerId);
	if (!layer) {
		layer = doc.createElement("div");
		layer.id = config.containerId;
		layer.className = "rs-toast-layer";
		layer.setAttribute("aria-live", "polite");
		layer.setAttribute("aria-atomic", "true");
		(doc.body || doc.documentElement).appendChild(layer);
	}
	layer.setAttribute("data-position", config.position);
	layer.style.setProperty("--shell-toast-z", String(config.zIndex));
	toastLayers.set(key, layer);
	return layer;
};
/**
* Broadcast toast to all clients (for service worker context)
*/
var broadcastToast = (options) => {
	try {
		const channel = new BroadcastChannel("rs-toast");
		channel.postMessage({
			type: "show-toast",
			options
		});
		channel.close();
	} catch (e) {
		console.warn("[Toast] Broadcast failed:", e);
	}
};
/**
* Create and show a toast notification
*
* @param options - Toast options object or message string
* @returns The created toast element, or null if in service worker context
*/
var showToast = (options) => {
	const opts = typeof options === "string" ? { message: options } : options;
	const { message, kind = "info", duration = DEFAULT_DURATION, persistent = false, position = DEFAULT_CONFIG.position, onClick } = opts;
	if (!message) return null;
	const fp = toastFingerprint(opts);
	const now = Date.now();
	if (fp === lastToastFingerprint && now - lastToastFingerprintAt < DEDUPE_WINDOW_MS) return null;
	if (typeof document === "undefined") {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		broadcastToast(opts);
		return null;
	}
	const config = {
		...DEFAULT_CONFIG,
		position
	};
	const layer = getToastLayer(config);
	if (hasVisibleDuplicate(layer, message, kind)) {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		return null;
	}
	lastToastFingerprint = fp;
	lastToastFingerprintAt = now;
	while (layer.children.length >= config.maxToasts) layer.firstChild?.remove();
	const toast = document.createElement("div");
	toast.className = "rs-toast";
	toast.setAttribute("data-kind", kind);
	toast.setAttribute("role", kind === "error" || kind === "warning" ? "alert" : "status");
	toast.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
	toast.textContent = message;
	layer.appendChild(toast);
	globalThis?.requestAnimationFrame?.(() => {
		toast.setAttribute("data-visible", "");
	});
	let hideTimer = null;
	const removeToast = () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		toast.removeAttribute("data-visible");
		globalThis?.setTimeout?.(() => {
			toast.remove();
			if (!layer.childElementCount) {
				const key = `${config.containerId}-${config.position}`;
				toastLayers.delete(key);
			}
		}, TRANSITION_DURATION);
	};
	if (!persistent) hideTimer = globalThis?.setTimeout?.(removeToast, duration);
	toast.addEventListener("click", () => {
		onClick?.();
		removeToast();
	});
	toast.addEventListener("pointerdown", () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		removeToast();
	}, { once: true });
	return toast;
};
/**
* Listen for toast broadcasts (call in main thread contexts)
*
* @returns Cleanup function to stop listening
*/
var listenForToasts = () => {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const channel = new BroadcastChannel("rs-toast");
	const handler = (event) => {
		if (event.data?.type === "show-toast" && event.data?.options) showToast(event.data.options);
	};
	channel.addEventListener("message", handler);
	return () => {
		channel.removeEventListener("message", handler);
		channel.close();
	};
};
/**
* Initialize toast listener for receiving broadcasts
* Call this in main thread contexts (content scripts, popup, etc.)
*
* @returns Cleanup function to stop listening
*/
var initToastReceiver = () => {
	return listenForToasts();
};
//#endregion
//#region shared/fest/fl-ui/ui/misc/Canvas-2.ts
var WALLPAPER_STORAGE_KEY = "rs-wallpaper-image";
var DEFAULT_WALLPAPER_URL = "/assets/wallpaper.jpg";
var initializeAppCanvasLayer = (container) => {
	const root = container;
	root.replaceChildren();
	root.style.position = "absolute";
	root.style.inset = "0";
	root.style.overflow = "hidden";
	root.style.background = "radial-gradient(circle at 18% 12%, #1b2a45 0%, #0f1728 42%, #060910 100%)";
	const glow = document.createElement("div");
	glow.className = "app-canvas__glow";
	glow.style.position = "absolute";
	glow.style.inset = "-20%";
	glow.style.pointerEvents = "none";
	glow.style.opacity = "0.7";
	glow.style.background = "radial-gradient(circle at 15% 20%, rgba(145,185,255,0.45) 0%, transparent 40%), radial-gradient(circle at 75% 72%, rgba(91,134,235,0.35) 0%, transparent 43%)";
	const canvas = document.createElement("canvas", { is: "ui-canvas" });
	canvas.className = "app-canvas__image";
	canvas.style.position = "absolute";
	canvas.style.inset = "0";
	canvas.style.pointerEvents = "none";
	canvas.style.inlineSize = "100%";
	canvas.style.blockSize = "100%";
	canvas.style.maxInlineSize = "100%";
	canvas.style.maxBlockSize = "100%";
	canvas.style.opacity = "0.88";
	canvas.style.mixBlendMode = "normal";
	canvas.setAttribute("is", "ui-canvas");
	root.append(glow, canvas);
	const wallpaper = loadWallpaperUrl();
	canvas.setAttribute("data-src", wallpaper);
	return {
		root,
		canvas,
		glow
	};
};
var setAppWallpaper = (wallpaperUrl) => {
	const value = String(wallpaperUrl || "").trim() || DEFAULT_WALLPAPER_URL;
	try {
		localStorage.setItem(WALLPAPER_STORAGE_KEY, value);
	} catch {}
	document.querySelectorAll("[data-app-layer=\"canvas\"] canvas[is=\"ui-canvas\"]").forEach((canvas) => canvas.setAttribute("data-src", value));
};
var loadWallpaperUrl = () => {
	try {
		const value = localStorage.getItem(WALLPAPER_STORAGE_KEY);
		return value && value.trim() ? value.trim() : DEFAULT_WALLPAPER_URL;
	} catch {
		return DEFAULT_WALLPAPER_URL;
	}
};
//#endregion
//#region shared/fest/fl-ui/styles/ui/_markdown.scss?inline
var _markdown_default = "@import \"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\";@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens, markdown, overrides, print, print-breaks;@layer tokens{:host,:root,:scope{color-scheme:light dark;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(#ffffff,var(--color-surface-container-high));--view-files-bg:light-dark(rgba(0,0,0,0.02),var(--color-surface-container-low));--view-file-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--view-results-bg:light-dark(rgba(0,0,0,0.01),var(--color-surface-container-low));--view-result-bg:light-dark(rgba(0,0,0,0.03),var(--color-surface-container-lowest,var(--color-surface-container-low)));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-primary-active:color-mix(in oklab,var(--color-primary) 65%,black);--color-accent:var(--color-secondary);--color-accent-hover:color-mix(in oklab,var(--color-secondary) 80%,black);--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:color-mix(in oklab,var(--color-primary) 80%,black);--color-success-light:color-mix(in oklab,var(--color-success) 60%,white);--color-success-dark:color-mix(in oklab,var(--color-success) 70%,black);--color-warning-light:color-mix(in oklab,var(--color-warning) 60%,white);--color-warning-dark:color-mix(in oklab,var(--color-warning) 70%,black);--color-error-light:color-mix(in oklab,var(--color-error) 60%,white);--color-error-dark:color-mix(in oklab,var(--color-error) 70%,black);--color-info-light:color-mix(in oklab,var(--color-info) 60%,white);--color-info-dark:color-mix(in oklab,var(--color-info) 70%,black);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs)}@media (prefers-color-scheme:dark){:host,:root,:scope{--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}}[data-theme=light]{color-scheme:light;--color-primary:#5a7fff;--color-on-primary:#ffffff;--color-secondary:#6b7280;--color-on-secondary:#ffffff;--color-tertiary:#64748b;--color-on-tertiary:#ffffff;--color-error:#ef4444;--color-on-error:#ffffff;--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:#fafbfc;--color-on-background:#1e293b;--color-surface:#fafbfc;--color-on-surface:#1e293b;--color-surface-variant:#f1f5f9;--color-on-surface-variant:#64748b;--color-outline:#cbd5e1;--color-outline-variant:#94a3b8;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 96%,var(--color-primary) 4%);--color-surface-container:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent)}[data-theme=dark]{color-scheme:dark;--color-primary:#7ca7ff;--color-on-primary:#0f172a;--color-secondary:#94a3b8;--color-on-secondary:#1e293b;--color-tertiary:#94a3b8;--color-on-tertiary:#0f172a;--color-error:#f87171;--color-on-error:#450a0a;--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:#0f1419;--color-on-background:#f1f5f9;--color-surface:#0f1419;--color-on-surface:#f1f5f9;--color-surface-variant:#1e293b;--color-on-surface-variant:#cbd5e1;--color-outline:#475569;--color-outline-variant:#334155;--color-surface-container-low:color-mix(in oklab,var(--color-surface) 92%,var(--color-primary) 8%);--color-surface-container:color-mix(in oklab,var(--color-surface) 88%,var(--color-primary) 12%);--color-surface-container-high:color-mix(in oklab,var(--color-surface) 84%,var(--color-primary) 16%);--color-surface-container-highest:color-mix(in oklab,var(--color-surface) 80%,var(--color-primary) 20%);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent)}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@keyframes d{to{transform:rotate(1turn)}}@keyframes e{0%{opacity:0;translate:0 10px}to{opacity:1}}@page{size:a4;margin:2rem;@bottom-center{content:counter(page);font-family:var(--print-font-family-sans);font-size:10pt}@top-right{content:\"UC\";font-family:var(--print-font-family-sans);font-size:10pt}}@page :first{margin-block:2cm 2.5cm;margin-inline:2cm}@page :left{margin-inline:2cm}@page :right{margin-inline:2cm}@page narrow{size:a5 portrait;margin:1.5cm}@page wide{size:a4 landscape;margin:2cm}@page letter{size:letter;margin:2.5cm 2cm}@page legal{size:legal;margin:2.5cm 2cm}@page professional{size:a4;margin:2.5cm 2cm;marks:crop cross;bleed:.25cm}@page booklet{size:a5;margin:1.5cm}@page draft{size:a4;margin:2cm 1.5cm}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=right]{margin-inline-start:auto;padding-inline-start:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=left]{margin-inline-end:auto;padding-inline-end:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=center]{margin-inline:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[width]{inline-size:attr(width px,auto)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[height]{block-size:attr(height px,auto)}@layer tokens{:host,:root,:scope{--print-font-family:var(--font-family-serif,\"Times New Roman\",\"Liberation Serif\",\"Noto Serif\",serif);--print-font-family-sans:var(--font-family-sans,\"Inter\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif);--print-font-mono:var(--font-family-mono,\"Monaco\",\"Menlo\",\"Ubuntu Mono\",\"Liberation Mono\",monospace);--print-text-color:light-dark(#1a1a1a,#f3f4f6);--print-bg:light-dark(#fff,#111827);--print-border-color:light-dark(#d1d5db,#374151);--print-link-color:light-dark(#2563eb,#60a5fa)}}@layer markdown{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden]){--base-size-4:0.25em;--base-size-8:0.5em;--base-size-16:1em;--base-size-24:1.5em;--base-size-40:2.5em;--base-text-weight-normal:400;--base-text-weight-medium:500;--base-text-weight-semibold:600;--fontStack-monospace:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;--color-primary:light-dark(#5a7fff,#7ca7ff);--color-secondary:light-dark(#6b7280,#94a3b8);--color-accent:light-dark(#64748b,#94a3b8);--color-success:light-dark(#10b981,#34d399);--color-warning:light-dark(#f59e0b,#fbbf24);--color-error:light-dark(#ef4444,#f87171);--color-info:light-dark(#60a5fa,#93c5fd);--color-surface:light-dark(#fafbfc,#0f1419);--color-surface-container:light-dark(#f1f5f9,#1e293b);--color-surface-container-low:light-dark(#f8fafc,#0f172a);--color-surface-container-lowest:light-dark(#fafbfc,#0f1419);--color-surface-container-high:light-dark(#e2e8f0,#334155);--color-surface-container-highest:light-dark(#cbd5e1,#475569);--color-on-surface:light-dark(#1e293b,#f1f5f9);--color-on-surface-variant:light-dark(#64748b,#94a3b8);--color-on-primary:light-dark(#ffffff,#ffffff);--color-on-secondary:light-dark(#ffffff,#ffffff);--color-outline:light-dark(#cbd5e1,#475569);--color-outline-variant:light-dark(#94a3b8,#64748b);--hover:light-dark(#f1f5f9,#334155);--active:light-dark(#e2e8f0,#1e293b);--focus:light-dark(#dbeafe,#1e40af);--elev-0:0 0 0 0 rgba(0,0,0,0%);--elev-1:0 1px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.12);--elev-2:0 2px 4px 0 rgba(0,0,0,0.14),0 3px 6px 0 rgba(0,0,0,0.11);--elev-3:0 4px 6px 0 rgba(0,0,0,0.14),0 6px 12px 0 rgba(0,0,0,0.11);--elev-4:0 6px 8px 0 rgba(0,0,0,0.14),0 9px 18px 0 rgba(0,0,0,0.11);--motion-fast:140ms ease;--motion-normal:200ms ease;--motion-slow:300ms ease;--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.5rem;--space-2xl:2rem;--radius-xs:0.25rem;--radius-sm:0.375rem;--radius-md:0.5rem;--radius-lg:0.75rem;--radius-xl:1rem;--radius-full:9999px;--focus-outlineColor:var(--color-primary);--fgColor-default:var(--color-on-surface);--fgColor-muted:var(--color-on-surface-variant);--fgColor-accent:var(--color-accent);--fgColor-success:var(--color-success);--fgColor-attention:var(--color-warning);--fgColor-danger:var(--color-error);--fgColor-done:var(--color-info);--bgColor-default:var(--color-surface);--bgColor-muted:var(--color-surface-container);--bgColor-neutral-muted:var(--color-surface-container-high);--bgColor-attention-muted:var(--color-warning);--borderColor-default:var(--color-outline);--borderColor-muted:var(--color-outline-variant);--borderColor-neutral-muted:var(--color-outline);--borderColor-accent-emphasis:var(--color-primary);--borderColor-success-emphasis:var(--color-success);--borderColor-attention-emphasis:var(--color-warning);--borderColor-danger-emphasis:var(--color-error);--borderColor-done-emphasis:var(--color-info);--active-brightness:config(\"effects\",\"active-brightness\");--border-radius:config(\"shape\",\"border-radius\");--box-shadow:config(\"shape\",\"box-shadow\");--color-accent:light-dark(\"accent\");--color-bg:light-dark(\"bg\");--color-bg-secondary:light-dark(\"bg-secondary\");--color-link:light-dark(\"link\");--color-secondary:light-dark(\"secondary\");--color-secondary-accent:light-dark(\"secondary-accent\");--color-shadow:light-dark(\"shadow\");--color-table:light-dark(\"table\");--color-text:light-dark(\"text\");--color-text-secondary:light-dark(\"text-secondary\");--color-scrollbar:light-dark(\"scrollbar\");--font-family-emoji-flag-capable:config(\"typography\",\"font-family\",\"emoji\");--font-family:config(\"typography\",\"font-family\",\"sans\");--hover-brightness:config(\"effects\",\"hover-brightness\");--justify-important:config(\"layout\",\"justify-important\");--justify-normal:config(\"layout\",\"justify-normal\");--line-height:config(\"layout\",\"line-height\");--width-card:config(\"layout\",\"widths\",\"card\");--width-card-medium:config(\"layout\",\"widths\",\"card-medium\");--width-card-wide:config(\"layout\",\"widths\",\"card-wide\");--width-content:config(\"layout\",\"widths\",\"content\");--md-scrollbar-size:config(\"scrollbar\",\"size\")}@media print{:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])){background-color:initial;block-size:max-content;box-sizing:border-box;color-scheme:inherit;container-type:inline-size;display:block;inline-size:100%;margin:0;max-block-size:none;min-block-size:max(100%,100cqb);overflow:auto;padding:0;touch-action:manipulation;user-select:text}:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) *,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :after,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :before{box-sizing:border-box}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:light-dark(#1f2328,#e6edf3);--md-fg-muted:light-dark(#656d76,#7d8590);--md-fg-accent:light-dark(#0969da,#2f81f7);--md-bg-default:light-dark(#ffffff,#0d1117);--md-bg-subtle:light-dark(#f6f8fa,#161b22);--md-bg-code:light-dark(#eff1f3,#25292f);--md-border-default:light-dark(#d0d7de,#30363d);--md-border-subtle:light-dark(#eff1f3,#21262d);--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;font-size:inherit;pointer-events:auto;scrollbar-color:var(--color-scrollbar) transparent;scrollbar-width:thin;touch-action:manipulation;user-select:text}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar{block-size:sass(10px);inline-size:sass(10px)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-thumb{background-color:var(--color-scrollbar);border-radius:9999px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-track{background-color:initial}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){background:var(--color-surface);block-size:stretch;box-shadow:var(--elev-1);color:var(--md-fg-default);color-scheme:inherit;display:flex;flex:1;flex-direction:column;font-family:var(--md-font-body,var(--print-font-family));font-size:16px;font-weight:400;line-height:1.4;overflow:auto;overflow-wrap:break-word;padding:var(--space-2xl) var(--space-xl);transition:box-shadow var(--motion-normal);word-wrap:break-word;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;contain:inline-size layout paint style;container-type:inline-size;isolation:isolate;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):hover{box-shadow:var(--elev-2)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):focus-within{box-shadow:var(--focus-ring,var(--elev-2));outline:none}@container (max-inline-size: 768px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){border-radius:var(--radius-lg);box-shadow:none;padding:var(--space-xl) var(--space-lg)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-default);font-weight:600;letter-spacing:-.015em;line-height:1.25;margin-block:1.5em .5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 tt{font-family:var(--md-font-mono);font-size:inherit}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid var(--md-border-subtle);padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-muted)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{margin-block:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{background-color:initial;color:var(--md-fg-accent);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;transition:color var(--motion-fast),text-decoration-thickness var(--motion-fast)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:hover{text-decoration-thickness:2px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:not([href]){color:inherit;text-decoration:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:focus-visible{border-radius:var(--radius-sm);box-shadow:var(--focus-ring);outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{margin-block:0 1rem;padding-inline-start:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ul,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{margin-block:0}@container (max-inline-size: 480px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{padding-inline-start:var(--space-xl)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li{margin-block-end:.25em;overflow-wrap:break-word;word-break:normal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li+li{margin-block-start:.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li>p{margin-block-start:1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-type:disc}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{list-style-type:circle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul ul{list-style-type:square}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol{list-style-type:decimal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=a]{list-style-type:lower-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=A]{list-style-type:upper-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=i]{list-style-type:lower-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=I]{list-style-type:upper-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{border-inline-start:.25em solid var(--md-border-default);color:var(--md-fg-muted);font-style:italic;margin:0 0 1rem;padding:0 1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{font-family:var(--md-font-mono);font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background-color:var(--md-bg-code);border-radius:6px;font-size:85%;padding:.2em .4em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background-color:var(--md-bg-code);block-size:max-content!important;border-radius:6px;content-visibility:visible!important;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;font-size:85%;inline-size:stretch;line-height:1.45;margin-block:0 1rem;max-block-size:none!important;max-inline-size:stretch;min-block-size:max(100%,100cqb)!important;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;padding:1rem;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;block-size:max-content!important;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{block-size:max-content;border-collapse:collapse;border-spacing:0;contain:inline-size layout paint style;container-type:inline-size;display:table;inline-size:fit-content;margin-block-end:1rem;max-inline-size:stretch;overflow:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tbody,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table thead{block-size:max-content;inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{block-size:max-content;border:1px solid var(--md-border-default);inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:6px 13px;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{background-color:var(--md-bg-subtle);block-size:max-content;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr{background-color:var(--md-bg-default);block-size:max-content;border-block-start:1px solid var(--md-border-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr:nth-child(2n){background-color:var(--md-bg-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table img{background-color:initial;block-size:auto;border-radius:0;inline-size:fit-content;margin:0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{background-color:var(--md-border-default);block-size:.25em;border:0;box-sizing:initial;margin-block:24px;overflow:hidden;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:before{content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:after{clear:both;content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{background-color:initial;block-size:auto;border-radius:var(--radius-md);border-style:none;box-sizing:initial;inline-size:fit-content;margin:var(--space-lg) 0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd{background-color:var(--md-bg-subtle);border:1px solid var(--md-border-default);border-radius:6px;box-shadow:inset 0 -1px 0 var(--md-border-default);color:var(--md-fg-default);display:inline-block;font-size:11px;line-height:10px;padding:3px 5px;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl{margin-block:var(--space-lg) 0;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dt{color:var(--md-fg-default);font-size:1em;font-style:italic;font-weight:600;margin-block-start:1rem;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dd{color:var(--color-on-surface-variant,var(--md-fg-muted));margin-block-end:1rem;margin-inline-start:0;padding:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details{display:block}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary{cursor:pointer;display:list-item}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h6{border-block-end:0;display:inline-block;margin:0;padding-block-end:0;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) math{math-style:compact;math-shift:compact;inline-size:fit-content;math-depth:auto-add;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) span{inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{contain:strict;inline-size:fit-content!important;max-inline-size:stretch!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input[type=checkbox]{accent-color:var(--color-primary,var(--md-fg-accent));margin-inline-end:var(--space-sm)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item{list-style-type:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item input[type=checkbox]{margin:0 .2em .25em -1.6em;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes{border-block-start:1px solid var(--md-border-default);color:var(--md-fg-muted);font-size:.75em;margin-block-start:2rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes ol{padding-inline-start:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li{position:relative}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target{color:var(--md-fg-default)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target:before{border:2px solid var(--md-fg-accent);border-radius:6px;content:\"\";inset:-8px -8px -8px -24px;pointer-events:none;position:absolute}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote-ref a{color:var(--md-fg-accent);font-size:.8em;vertical-align:super}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert{border-inline-start:.25em solid var(--md-border-default);margin-block-end:1rem;padding:.5rem 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-note{border-color:var(--md-fg-accent)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-important{border-color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-warning{border-color:#bf8700}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-tip{border-color:#1a7f37}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-caution{border-color:#d1242f}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title{align-items:center;display:flex;font-weight:600;line-height:1;margin-block-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title .octicon,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title .octicon{margin-inline-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon{display:inline-block;fill:currentColor;vertical-align:text-bottom}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji{display:inline-block;font-family:Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,sans-serif;font-size:1em;font-style:normal;font-weight:400;line-height:1;min-inline-size:1ch;vertical-align:-.075em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji img{block-size:1em;inline-size:1em;object-fit:contain}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor{float:inline-start;line-height:1;margin-inline-start:-20px;padding-inline-end:4px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor:focus{outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link{color:var(--md-fg-muted);opacity:.5;visibility:hidden}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link:hover{opacity:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) :is(h1,h2,h3,h4,h5,h6):hover .anchor .octicon-link{visibility:visible}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#6e7781}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#0550ae}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#cf222e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#0a3069}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#953800}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:var(--md-fg-default);font-size:1.1em;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none}.markdown-viewer-content{animation:e .3s ease-out}.markdown-viewer-raw{background:var(--color-surface);color:var(--color-on-surface);font-family:var(--print-font-mono);font-size:var(--text-sm,.875rem);line-height:1.5;margin:0;overflow:auto;padding:var(--space-xl);tab-size:2;white-space:pre}.viewer-header{align-items:center;background:var(--color-surface-container-high);display:flex;flex-shrink:0;gap:var(--space-lg);justify-content:space-between;padding:var(--space-lg) var(--space-xl)}@container (max-inline-size: 768px){.viewer-header{gap:var(--space-md);padding:var(--space-md) var(--space-lg)}}@container (max-inline-size: 480px){.viewer-header{align-items:stretch;flex-direction:column;gap:var(--space-sm)}}.viewer-header h3{font-size:var(--text-xl,1.25rem);font-weight:600;letter-spacing:-.025em;line-height:1.25;margin:0}.viewer-header .viewer-actions{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-sm)}@container (max-inline-size: 360px){.viewer-header .viewer-actions{overflow-block:hidden;overflow-inline:auto;padding-block-end:var(--space-xs);scrollbar-width:none}.viewer-header .viewer-actions::-webkit-scrollbar{display:none}}.viewer-btn{align-items:center;background:var(--color-surface-container);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-sm,.875rem);font-weight:500;gap:var(--space-xs);min-block-size:44px;padding:0;position:relative;transition:background var(--motion-fast),box-shadow var(--motion-fast),translate var(--motion-fast);white-space:nowrap}.viewer-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);translate:0 -1px}.viewer-btn:active{box-shadow:none;translate:0}.viewer-btn:focus-visible{box-shadow:var(--focus-ring);outline:none}.viewer-btn.btn-icon{padding:var(--space-sm)}.viewer-btn.btn-icon ui-icon{flex-shrink:0;transition:color var(--motion-fast)}.viewer-btn.btn-icon:hover ui-icon{color:var(--color-primary)}@container (max-inline-size: 640px){.viewer-btn.btn-icon{padding:var(--space-xs)}.viewer-btn.btn-icon .btn-text{display:none}}.viewer-btn.loading{opacity:.7;pointer-events:none}.viewer-btn.loading:after{animation:d 1s linear infinite;block-size:16px;border:2px solid transparent;border-block-start-color:initial;border-radius:50%;content:\"\";inline-size:16px;margin-inline-start:var(--space-xs)}@media (prefers-color-scheme:dark){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#8b949e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#79c0ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#ff7b72}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#a5d6ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#ffa657}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#d2a8ff}}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host),[data-hidden] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host){color-scheme:inherit;content-visibility:auto!important}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host) :where(*){content-visibility:auto!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{color-scheme:inherit}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:flex}}}@layer overrides{:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}.katex math{font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;math-style:compact;text-transform:none;math-shift:compact;math-depth:auto-add}.footnote-backref,.footnote-ref{font-variant-caps:normal;font-variant-emoji:text;font-variant-ligatures:common-ligatures;font-variant-numeric:tabular-nums}.footnote-backref,.footnote-backref *,.footnote-ref,.footnote-ref *{inline-size:fit-content;max-inline-size:stretch;text-align:start}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-code-inline-bg:color-mix(in oklab,var(--md-bg-code) 88%,var(--md-bg-default));--md-code-inline-fg:var(--md-fg-default);--md-code-block-bg:var(--md-bg-code);--md-code-block-fg:var(--md-fg-default);--md-code-block-border:color-mix(in oklab,var(--md-border-default) 60%,transparent);text-rendering:auto;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto;color-scheme:inherit!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{hyphens:manual;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background:var(--md-code-inline-bg);border:0;box-shadow:none;color:var(--md-code-inline-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background:var(--md-code-block-bg);border:1px solid var(--md-code-block-border);box-shadow:none;color:var(--md-code-block-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;box-shadow:none;color:inherit}}}@layer print{@media print{:where(:root,html,body){background-color:#fff!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;font-family:var(--print-font-family);font-size:12pt;font-variant-emoji:text;line-height:1.4;margin:0;overflow:visible!important;padding:0;print-color-adjust:economy;scrollbar-width:none}body{block-size:max-content!important;inline-size:100%!important;max-block-size:none!important;max-inline-size:100%!important;min-block-size:max(100%,100cqb)!important;scale:1!important;text-align:start;transform:none!important;zoom:1!important}:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:#1f2328;--md-fg-muted:#656d76;--md-fg-accent:#0969da;--md-bg-default:#ffffff;--md-bg-subtle:#f6f8fa;--md-bg-code:#eff1f3;--md-border-default:#d0d7de;--md-border-subtle:#eff1f3;--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;background:#fff;block-size:max-content!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;display:block!important;flex:none!important;font-family:var(--print-font-family);font-variant-emoji:text;inline-size:100%;margin:0;max-block-size:none!important;max-inline-size:100%;min-block-size:max(100%,100cqb)!important;overflow:visible!important;padding:0;scrollbar-width:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{background-color:initial;box-shadow:none;box-sizing:border-box;font-variant-emoji:text;max-inline-size:100%;text-shadow:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#111;font-weight:700;line-height:1.25;orphans:2;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid #ccc;padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#555}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{color:#111;hyphens:auto;orphans:3;text-align:justify;widows:3;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) b,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) strong{color:#111!important;filter:none;font-weight:700!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) em,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) i{color:#111!important;filter:none;font-style:italic!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{color:#333!important;overflow-wrap:break-word;text-decoration:underline!important;word-break:break-word;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a[href]:after{content:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{background:#f5f5f5;color:#111;filter:grayscale(1);font-family:var(--print-font-mono);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code){block-size:max-content!important;border:1px solid #ddd;border-radius:.25em;contain:none!important;content-visibility:visible!important;hyphens:none;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;overflow-wrap:break-word;padding:.125em .25em;position:relative!important;word-break:break-word}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{border:1px solid #ccc;border-radius:.5rem;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;padding:1rem;white-space:pre-wrap;word-wrap:break-word;block-size:max-content!important;content-visibility:visible!important;inline-size:stretch;margin-block:1.2em;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;orphans:1;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code{border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;background:transparent;block-size:max-content!important;border:0;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{background:#fafafa;border-inline-start:4px solid #999;color:#333;filter:grayscale(1);font-style:italic;margin-block:1.2em;orphans:2;padding:.8em 1.2em;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{border:1px solid #999;border-collapse:collapse;display:table;inline-size:100%!important;max-inline-size:100%;table-layout:fixed;word-wrap:break-word;filter:grayscale(1);margin-block:1.2em;orphans:1;overflow-wrap:break-word;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{block-size:max-content;border:1px solid #999;color:#111;inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:.5em .75em;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{background:#e5e5e5;color:#333;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{block-size:0;border:none;border-block-start:1px solid #ccc;filter:grayscale(1);margin-block:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{block-size:auto;border-radius:0;display:block;filter:grayscale(1);image-rendering:pixelated;inline-size:fit-content;margin:1em auto;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg *{fill:currentColor!important;stroke:currentColor!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-position:outside;margin-block-end:1em;orphans:2;padding-inline-start:1.5rem;widows:2}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li::marker{color:#666!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) select,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) textarea{background:#fff!important;border:1px solid #999!important;color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .highlight,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .mark{background:#e6e6e6!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .reference{background:transparent!important;border-block-start:1px solid #ccc!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-]{background:#f8f8f8!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-] *{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-narrow{page:narrow}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-wide{page:wide}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-letter{page:letter}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-legal{page:legal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-professional{page:professional}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-booklet{page:booklet}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-draft{page:draft}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:last-child{margin-block-end:0}.print-view{block-size:100cqb;inline-size:100%;margin:0;overflow-inline:hidden;padding:0}.print-content{box-sizing:border-box;font-size:14pt;hyphens:auto;inline-size:100%;line-height:1.6;margin:0;padding:2rem;text-align:justify;word-wrap:break-word;overflow-wrap:break-word}}}@layer print-breaks{@media print{:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote,hr){break-after:auto;break-before:auto;break-inside:avoid}li,tr{break-inside:avoid}:where(h1,h2,h3,h4,h5,h6):has(+:where(p,ul,ol,li,table,blockquote,pre,code)){break-after:avoid}:where(p,:is(h1,h2,h3,h4,h5,h6)):has(+:where(ul,ol)){break-after:avoid!important}:where(p,:is(h1,h2,h3,h4,h5,h6))+:where(ul,ol){break-before:avoid!important}:where(h1,h2,h3,h4,h5,h6):has(+:where(table,pre,code,blockquote)){break-after:avoid!important}:where(h1,h2,h3,h4,h5,h6)+:where(table,pre,code,blockquote){break-before:avoid!important}hr:has(+:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote)){break-after:page!important}h1:first-of-type{break-before:avoid}:where(.pb,.np,.pagebreak,.newpage,.page-break,.new-page){background-color:initial;break-after:page;break-before:auto;break-inside:auto}.print-chapter{break-before:page}.print-section{break-before:avoid}:where(:heading,p,ol,ul)>:first-child{margin-block-start:0}:where(:heading,p,ol,ul)>:last-child{margin-block-end:0}}}";
//#endregion
//#region shared/fest/fl-ui/ui/markdown/Markdown.ts
var MATH_DELIMITER_PATTERN = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|(?<!\$)\$[^$\n]+\$|\\\([\s\S]*?\\\)/;
var FENCED_CODE_PATTERN = /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
var INLINE_CODE_PATTERN = /`[^`\n]+`/g;
var SANITIZE_OPTIONS = {
	USE_PROFILES: {
		html: true,
		mathMl: true,
		svg: true
	},
	FORBID_TAGS: [
		"script",
		"style",
		"iframe",
		"object",
		"embed",
		"applet",
		"link",
		"meta",
		"base",
		"form",
		"noscript",
		"template"
	],
	FORBID_CONTENTS: [
		"script",
		"style",
		"iframe",
		"object",
		"embed",
		"applet",
		"noscript",
		"template"
	]
};
function maskCodeSegments(markdown) {
	const maskedValues = [];
	const tokenPrefix = "__MD_MASK_";
	const tokenSuffix = "__";
	const mask = (value) => value.replace(FENCED_CODE_PATTERN, (segment) => {
		const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
		maskedValues.push(segment);
		return token;
	});
	const maskInline = (value) => value.replace(INLINE_CODE_PATTERN, (segment) => {
		const token = `${tokenPrefix}${maskedValues.length}${tokenSuffix}`;
		maskedValues.push(segment);
		return token;
	});
	return {
		masked: maskInline(mask(markdown)),
		restore: (value) => value.replace(/__MD_MASK_(\d+)__/g, (_, index) => maskedValues[Number(index)] ?? "")
	};
}
g?.use?.(src_default({
	throwOnError: false,
	nonStandard: true,
	output: "mathml",
	strict: false
}), { hooks: { preprocess: (markdown) => {
	if (!MATH_DELIMITER_PATTERN.test(markdown)) return markdown;
	const { masked, restore } = maskCodeSegments(markdown);
	const katexNode = document.createElement("div");
	katexNode.textContent = masked;
	renderMathInElement(katexNode, {
		throwOnError: false,
		nonStandard: true,
		output: "mathml",
		strict: false,
		delimiters: [
			{
				left: "$$",
				right: "$$",
				display: true
			},
			{
				left: "\\[",
				right: "\\]",
				display: true
			},
			{
				left: "$",
				right: "$",
				display: false
			},
			{
				left: "\\(",
				right: "\\)",
				display: false
			}
		]
	});
	return restore(katexNode.innerHTML);
} } });
/** One document-level injection: markdown typography targets `.markdown-body`, `md-view`, etc. (see veela tokens). */
var MD_TYPOGRAPHY_STYLE_ID = "fl-md-view-typography";
function ensureMarkdownTypographyStyles() {
	if (typeof document === "undefined") return;
	if (document.getElementById(MD_TYPOGRAPHY_STYLE_ID)) return;
	const el = document.createElement("style");
	el.id = MD_TYPOGRAPHY_STYLE_ID;
	el.setAttribute("data-fl-md-view", "");
	el.textContent = _markdown_default;
	document.head.prepend(el);
}
/** Layout + slot chrome only; rendered markdown lives in light DOM (slotted `.markdown-body`). */
var MD_VIEW_SHADOW_STYLES = `
:host {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-block-size: 0;
    box-sizing: border-box;
}
*, *::before, *::after { box-sizing: border-box; }
.md-view__shell {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    min-block-size: 0;
    min-inline-size: 0;
}
.md-view__chrome {
    flex-shrink: 0;
}
.md-view__chrome:empty {
    display: none;
}
.md-view__frame {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    min-block-size: 0;
    min-inline-size: 0;
}
::slotted(.markdown-body) {
    flex: 1 1 auto;
    min-height: 0;
    min-block-size: 0;
    min-inline-size: 0;
}
`;
var waitForClipboardFrame$1 = () => new Promise((resolve) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(() => resolve());
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => resolve();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => resolve(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => resolve());
		return;
	}
	resolve();
});
var MarkdownView = class MarkdownView extends UIElement_default {
	src = "";
	content = "";
	showActions = false;
	showTitle = false;
	title = "Markdown Viewer";
	#content = "";
	#showActions = false;
	#showTitle = false;
	#title = "Markdown Viewer";
	constructor(options = {}) {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		const self = this;
		self.loadStyleLibrary(ensureMarkdownTypographyStyles());
		self.style.setProperty("pointer-events", "auto");
		self.style.setProperty("touch-action", "manipulation");
		self.style.setProperty("user-select", "text");
		self.#ensureBodyElement();
		const src = self.getAttribute("src");
		const content = self.getAttribute("content");
		if (content) this.setContent(content);
		else if (src) this.renderMarkdown(src);
		else this.loadFromCache().then((cached) => {
			if (cached) this.setContent(cached);
		}).catch(console.warn.bind(console));
	}
	/**
	* Set content directly
	*/
	async setContent(content) {
		this.#content = content || "";
		await this.writeToCache(this.#content).catch(console.warn.bind(console));
		return this.setHTML(await g.parse((this.#content || "")?.trim?.() || "")).catch(console.warn.bind(console));
	}
	/**
	* Get current content
	*/
	getContent() {
		return this.#content;
	}
	/**
	* Set HTML content in the view
	*/
	async setHTML(doc = "") {
		const view = this.#ensureBodyElement();
		const html = await doc;
		view.innerHTML = purify?.sanitize?.((html || "")?.trim?.() || "", SANITIZE_OPTIONS) || view.innerHTML || "";
		document.dispatchEvent(new CustomEvent("ext-ready", {}));
	}
	/** Light-DOM root for parsed markdown (projected through the default slot). */
	#ensureBodyElement() {
		const self = this;
		let body = self.querySelector(":scope > .markdown-body");
		if (!body) {
			body = E("div.markdown-body", { dataset: { print: "" } })?.element;
			self.appendChild(body);
		}
		return body;
	}
	/**
	* Load content from cache (supports both localStorage and OPFS)
	*/
	async loadFromCache() {
		try {
			if (navigator?.storage) try {
				const cachedFile = await provide("/user/cache/last.md");
				if (cachedFile) {
					const text = await cachedFile.text?.();
					if (text) return text;
				}
			} catch (error) {}
			return localStorage.getItem("$cached-md$");
		} catch (error) {
			console.warn("[MarkdownView] Failed to load from cache:", error);
			return null;
		}
	}
	/**
	* Write content to cache (supports both localStorage and OPFS)
	*/
	async writeToCache(content) {
		if (typeof content !== "string") content = await content.text();
		try {
			if (navigator?.storage) try {
				const forWrite = await provide("/user/cache/last.md", true);
				if (forWrite?.write) {
					await forWrite.write(content);
					await forWrite.close?.();
					return;
				}
			} catch (error) {}
			localStorage.setItem("$cached-md$", content);
		} catch (error) {
			console.warn("[MarkdownView] Failed to write to cache:", error);
		}
	}
	/**
	* Render markdown from file path, URL, or content
	*/
	async renderMarkdown(file) {
		const renderMarkdownText = async (text) => {
			await this.writeToCache(text).catch(console.warn.bind(console));
			return this.setContent(text).catch(console.warn.bind(console));
		};
		if (!file) {
			const cached = await this.loadFromCache();
			if (cached) return this.renderMarkdown(cached).catch(console.warn.bind(console));
			return;
		}
		if (typeof file === "string") {
			const fileStr = file.trim();
			if (URL.canParse(fileStr) || fileStr.startsWith("blob:") || fileStr.startsWith("/user/") || fileStr.startsWith("./") || fileStr.startsWith("../")) try {
				const fetched = await provide(fileStr);
				if (fetched) {
					const text = await fetched.text?.();
					if (text) return renderMarkdownText(text).catch(console.warn.bind(console));
				}
			} catch (error) {
				console.warn("[MarkdownView] Failed to fetch file:", error);
				if (!fileStr.includes("\n") && fileStr.length < 100) return;
			}
			return renderMarkdownText(fileStr).catch(console.warn.bind(console));
		}
		if (file instanceof File || file instanceof Blob || file instanceof Response) try {
			return renderMarkdownText(await file.text()).catch(console.warn.bind(console));
		} catch (error) {
			console.error("[MarkdownView] Error reading file:", error);
		}
	}
	/**
	* Handle attribute changes
	*/
	attributeChangedCallback(name, oldValue, newValue) {
		super.attributeChangedCallback?.(name, oldValue, newValue);
		if (oldValue === newValue) return;
		switch (name) {
			case "src":
				if (newValue) this.renderMarkdown(newValue).catch(console.warn.bind(console));
				break;
			case "content":
				if (newValue) this.setContent(newValue).catch(console.warn.bind(console));
				break;
			case "show-actions":
				this.#showActions = newValue !== null;
				break;
			case "show-title":
				this.#showTitle = newValue !== null;
				break;
			case "title":
				this.#title = newValue || "Markdown Viewer";
				break;
		}
	}
	/**
	* Shadow root: optional chrome + default slot. Markdown body is a light-DOM child (`.markdown-body`).
	*/
	createShadowRoot() {
		if (this.shadowRoot?.querySelector?.(".md-view__shell") && this.shadowRoot) return this.shadowRoot;
		const shadowRoot = super.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" });
		const chromeStyle = document.createElement("style");
		chromeStyle.textContent = MD_VIEW_SHADOW_STYLES;
		const shell = document.createElement("div");
		shell.className = "md-view__shell";
		const chrome = document.createElement("div");
		chrome.className = "md-view__chrome";
		chrome.setAttribute("part", "chrome");
		const frame = document.createElement("div");
		frame.className = "md-view__frame";
		const slot = document.createElement("slot");
		frame.append(slot);
		shell.append(chrome, frame);
		shadowRoot.append(chromeStyle, shell);
		return shadowRoot;
	}
};
__decorate([property({ source: "attr" })], MarkdownView.prototype, "src", void 0);
__decorate([property({ source: "attr" })], MarkdownView.prototype, "content", void 0);
__decorate([property({ source: "attr" })], MarkdownView.prototype, "showActions", void 0);
__decorate([property({ source: "attr" })], MarkdownView.prototype, "showTitle", void 0);
__decorate([property({ source: "attr" })], MarkdownView.prototype, "title", void 0);
MarkdownView = __decorate([defineElement("md-view")], MarkdownView);
var MarkdownViewer = class MarkdownViewer extends UIElement_default {
	options;
	element = null;
	content = "";
	constructor(options = {}) {
		super();
		this.options = {
			content: "",
			title: "Markdown Viewer",
			showTitle: true,
			showActions: true,
			...options
		};
		this.content = this.options.content || "";
	}
	lifecycle = {
		onMount: () => this.onMount(),
		onUnmount: () => this.onUnmount(),
		onShow: () => this.onShow(),
		onHide: () => this.onHide()
	};
	onMount() {
		console.log("[MarkdownViewer] Mounted");
	}
	onUnmount() {
		console.log("[MarkdownViewer] Unmounted");
	}
	onShow() {
		console.log("[MarkdownViewer] Shown");
	}
	onHide() {
		console.log("[MarkdownViewer] Hidden");
	}
	onRefresh() {
		console.log("[MarkdownViewer] Refreshed");
	}
	/**
	* Render the markdown viewer
	*/
	render = function() {
		const container = H`<div class="markdown-viewer-container">
            ${this.options.showTitle ? H`<div class="viewer-header">
                <h3>${this.options.title}</h3>
                ${this.options.showActions ? H`<div class="viewer-actions">
                    <button class="btn btn-icon" data-action="open" title="Open markdown file" aria-label="Open markdown file">
                        <ui-icon icon="folder-open" size="20" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Open</span>
                    </button>
                    <button class="btn btn-icon" data-action="copy" title="Copy content" aria-label="Copy content">
                        <ui-icon icon="copy" size="20" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Copy</span>
                    </button>
                    <button class="btn btn-icon" data-action="download" title="Download as markdown" aria-label="Download as markdown">
                        <ui-icon icon="download" size="20" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Download</span>
                    </button>
                    <button class="btn btn-icon" data-action="print" title="Print content" aria-label="Print content">
                        <ui-icon icon="printer" size="20" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Print</span>
                    </button>
                </div>` : ""}
            </div>` : ""}
            <div class="viewer-content">
                <md-view content="${this.content}"></md-view>
            </div>
        </div>`;
		this.element = container?.querySelector?.("md-view");
		if (this.options.showActions) container?.addEventListener?.("click", (e) => {
			switch ((e.target?.closest?.("[data-action]"))?.getAttribute("data-action")) {
				case "open":
					this.options.onOpen?.();
					break;
				case "copy":
					this.copyContent();
					break;
				case "download":
					this.downloadContent();
					break;
				case "print":
					this.printContent();
					break;
			}
		});
		return container;
	};
	/**
	* Set content to display
	*/
	setContent(content) {
		this.content = content;
		if (this.element) this.element.setContent(content);
	}
	/**
	* Get current content
	*/
	getContent() {
		return this.content;
	}
	/**
	* Copy content to clipboard
	*/
	async copyContent() {
		try {
			await waitForClipboardFrame$1();
			await navigator.clipboard.writeText(this.content);
			this.options.onCopy?.(this.content);
		} catch (error) {
			console.warn("Failed to copy content:", error);
			const textArea = document.createElement("textarea");
			textArea.value = this.content;
			document.body.append(textArea);
			textArea.select();
			textArea.remove();
			this.options.onCopy?.(this.content);
		}
	}
	/**
	* Download content as markdown file
	*/
	downloadContent() {
		const blob = new Blob([this.content], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `markdown-content-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.md`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
		this.options.onDownload?.(this.content);
	}
	/**
	* Print content
	*/
	printContent() {
		const self = this;
		try {
			const viewElement = self.element?.querySelector?.(":scope > .markdown-body");
			if (!viewElement) {
				console.error("[MarkdownViewer] Could not find markdown content for printing");
				return;
			}
			const printUrl = new URL("/print", globalThis?.location?.origin);
			printUrl.searchParams.set("content", viewElement.innerHTML);
			printUrl.searchParams.set("title", this.options.title || "Markdown Content");
			if (!globalThis?.open(printUrl.toString(), "_blank", "width=800,height=600")) {
				console.warn("[MarkdownViewer] Failed to open print window - popup blocked?");
				globalThis?.print();
				return;
			}
			this.options.onPrint?.(this.content);
		} catch (error) {
			console.error("[MarkdownViewer] Error printing content:", error);
			globalThis?.print();
		}
	}
};
MarkdownViewer = __decorate([defineElement("cw-markdown-viewer")], MarkdownViewer);
//#endregion
//#region shared/fest/fl-ui/ui/explorer/FileManagerContent.scss?inline
var FileManagerContent_default$1 = ":root{--fl-ui-radius:0.5rem;--fl-ui-gap:0.75rem;--color-surface:#151d2e;--color-on-surface:#e8edf5;--color-on-surface-variant:#8b9bb8;--color-primary:#3794ff;--error-color:#f87171}@layer ux-file-manager-content{:host(ui-file-manager-content),:host(ui-file-manager-content) :where(*){overflow:hidden;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none}:host(ui-file-manager-content){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);contain:none;container-type:size;display:block;grid-column:1/-1;inline-size:stretch;isolation:isolate;margin:0;overflow:auto;perspective:1000;pointer-events:auto;position:relative;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid{align-content:start;block-size:100%;display:grid;grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden;pointer-events:none;row-gap:0;scrollbar-color:transparent transparent;scrollbar-gutter:auto;scrollbar-width:none;touch-action:manipulation}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid{grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}}:host(ui-file-manager-content) .fm-grid-rows{align-content:start;block-size:stretch;contain:strict;contain-intrinsic-size:1px 2.625rem;content-visibility:auto;display:grid;gap:.25rem;grid-auto-rows:2.625rem;grid-column:1/-1;grid-template-columns:subgrid;inline-size:stretch;min-block-size:0;overflow:auto;pointer-events:auto;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-gutter:stable;scrollbar-width:thin;touch-action:manipulation;z-index:1}:host(ui-file-manager-content) .fm-grid-rows slot{display:contents!important}:host(ui-file-manager-content) :where(.row){background-color:color-mix(in oklab,var(--color-on-surface,#fff) 3%,transparent);block-size:2.625rem;border:none;border-radius:.625rem;color:var(--color-on-surface);cursor:pointer;display:grid;grid-column:1/-1;grid-template-rows:minmax(0,2.625rem)!important;inline-size:stretch;min-block-size:0;order:var(--order,1)!important;place-content:center;place-items:center;justify-items:start;padding:0 .65rem;place-self:stretch;pointer-events:auto;touch-action:manipulation;user-drag:none;-webkit-user-drag:none;flex-wrap:nowrap;gap:.35rem;letter-spacing:normal;overflow:hidden;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}@media (hover:hover) and (pointer:fine){:host(ui-file-manager-content) :where(.row){user-drag:element;-webkit-user-drag:element}}:host(ui-file-manager-content) :where(.row) ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem;place-content:center;place-items:center}:host(ui-file-manager-content) :where(.row) a,:host(ui-file-manager-content) :where(.row) span{background-color:initial!important}:host(ui-file-manager-content) :where(.row)>*{background-color:initial!important;block-size:auto;min-block-size:0}:host(ui-file-manager-content) .row:hover{background-color:color-mix(in oklab,var(--color-on-surface) 8%,transparent)}:host(ui-file-manager-content) .row:active{background-color:color-mix(in oklab,var(--color-on-surface) 11%,transparent)}:host(ui-file-manager-content) .row:focus-visible{outline:2px solid var(--color-primary,#3794ff);outline-offset:-2px}:host(ui-file-manager-content) .c{block-size:auto;color:inherit;display:flex;flex-direction:row;inline-size:auto;min-inline-size:0;overflow:hidden;place-content:center;justify-content:start;min-block-size:0;place-items:center;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}:host(ui-file-manager-content) .icon{grid-column:icon;place-content:center;place-items:center}:host(ui-file-manager-content) .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .actions{grid-column:actions}:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,7.5rem) [actions] minmax(6.75rem,max-content)}@container (inline-size <= 600px){:host(ui-file-manager-content) .fm-grid,:host(ui-file-manager-content) .fm-grid-header,:host(ui-file-manager-content) .row,:host(ui-file-manager-content) ::slotted(.row){grid-template-columns:[icon] minmax(0,2.5rem) [name] minmax(0,1fr) [size] minmax(4.5rem,6rem) [date] minmax(0,0) [actions] minmax(6.75rem,max-content)}:host(ui-file-manager-content) .date{display:none!important}}:host(ui-file-manager-content) .actions{background-color:color-mix(in oklab,var(--color-on-surface,#fff) 5%,transparent);block-size:2.125rem;border:none;border-radius:999px;color:var(--color-on-surface);display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:stretch;padding:.2rem;place-content:center;justify-content:flex-end;place-items:center;place-self:center;justify-self:end;overflow:visible;pointer-events:none}:host(ui-file-manager-content) .action-btn{appearance:none;aspect-ratio:1;background-color:initial;block-size:1.85rem;border:none;border-radius:999px;box-shadow:none;color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-shrink:0;inline-size:1.85rem;min-block-size:1.85rem;min-inline-size:1.85rem;overflow:hidden;padding:0;place-content:center;place-items:center;pointer-events:auto;position:relative;transition:background .14s ease,transform .1s ease}:host(ui-file-manager-content) .action-btn:hover{background-color:color-mix(in oklab,var(--color-on-surface) 12%,transparent)}:host(ui-file-manager-content) .action-btn:active{transform:scale(.94)}:host(ui-file-manager-content) .action-btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager-content) .action-btn ui-icon{block-size:1.0625rem;inline-size:1.0625rem;min-block-size:1.0625rem;min-inline-size:1.0625rem}:host(ui-file-manager-content) .fm-grid-header{background:color-mix(in oklab,var(--color-on-surface,#fff) 3.5%,transparent);border:none;border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);color:var(--color-on-surface-variant);display:grid;font-size:.6875rem;font-weight:600;gap:.35rem;grid-column:1/-1;inset-block-start:0;letter-spacing:.04em;min-block-size:2rem;opacity:1;padding:.4rem .65rem;place-content:center;justify-content:start;place-items:center;justify-items:start;pointer-events:auto;position:sticky!important;text-align:start;text-transform:uppercase;touch-action:manipulation;z-index:2}:host(ui-file-manager-content) .fm-grid-header>*{inline-size:auto}:host(ui-file-manager-content) .fm-grid-header .c{font-weight:600}:host(ui-file-manager-content) .fm-grid-header .icon{grid-column:icon}:host(ui-file-manager-content) .fm-grid-header .name{grid-column:name;inline-size:stretch}:host(ui-file-manager-content) .fm-grid-header .size{grid-column:size;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .date{grid-column:date;justify-content:end;text-align:end}:host(ui-file-manager-content) .fm-grid-header .actions{block-size:fit-content;border-radius:0;box-shadow:none;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.25rem;grid-column:actions;inline-size:stretch;max-inline-size:stretch;overflow:hidden;padding:0;place-content:center;justify-content:flex-end;place-items:center;justify-items:end;justify-self:end;text-align:end;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}}";
//#endregion
//#region shared/fest/fl-ui/ui/explorer/Operative.ts
var handleCache = /* @__PURE__ */ new WeakMap();
var waitForClipboardFrame = () => new Promise((resolve) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(() => resolve());
		return;
	}
	if (typeof MessageChannel !== "undefined") {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => resolve();
		channel.port2.postMessage(void 0);
		return;
	}
	if (typeof setTimeout === "function") {
		setTimeout(() => resolve(), 16);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(() => resolve());
		return;
	}
	resolve();
});
var ASSETS_ROOT = "/assets/";
var ASSET_SEED_PATHS = [
	"/assets/crossword.css",
	"/assets/icons/",
	"/assets/imgs/",
	"/assets/wallpapers/"
];
var ASSET_ICON_STYLES = [
	"thin",
	"light",
	"regular",
	"bold",
	"fill",
	"duotone"
];
var ASSET_ICON_FALLBACK_NAMES = [
	"copy",
	"clipboard",
	"trash",
	"folder",
	"folder-open",
	"download",
	"upload",
	"arrow-up",
	"arrow-clockwise",
	"code",
	"eye",
	"gear",
	"printer",
	"file-doc",
	"file-text",
	"lightning",
	"pencil",
	"clock-counter-clockwise"
];
var normalizeDirectoryPath = (input) => {
	const value = (input || "/").trim() || "/";
	const withLeading = value.startsWith("/") ? value : `/${value}`;
	return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
};
var isAssetsPath = (path) => normalizeDirectoryPath(path).startsWith(ASSETS_ROOT);
var isVirtualRootPath = (path) => normalizeDirectoryPath(path) === "/";
var isReadonlyPath = (path) => isAssetsPath(path) || isVirtualRootPath(path);
var isIconsPath = (path) => normalizeDirectoryPath(path).startsWith("/assets/icons/");
var isUserPath = (path) => isUserScopePath(normalizeDirectoryPath(path));
var buildVirtualAssetPaths = (path) => {
	const target = normalizeDirectoryPath(path);
	const paths = /* @__PURE__ */ new Set();
	if (!isIconsPath(target)) return [];
	paths.add("/assets/icons/");
	paths.add("/assets/icons/phosphor/");
	paths.add("/assets/icons/duotone/");
	for (const style of ASSET_ICON_STYLES) {
		paths.add(`/assets/icons/phosphor/${style}/`);
		paths.add(`/assets/icons/${style}/`);
	}
	const addIconFiles = (base) => {
		for (const iconName of ASSET_ICON_FALLBACK_NAMES) paths.add(`${base}${iconName}.svg`);
	};
	if (target === "/assets/icons/" || target === "/assets/icons/duotone/") addIconFiles("/assets/icons/duotone/");
	if (target.startsWith("/assets/icons/phosphor/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 4) {
			const style = parts[3];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/phosphor/${style}/`);
		}
	}
	if (target.startsWith("/assets/icons/")) {
		const parts = target.split("/").filter(Boolean);
		if (parts.length >= 3) {
			const style = parts[2];
			if (ASSET_ICON_STYLES.includes(style)) addIconFiles(`/assets/icons/${style}/`);
		}
	}
	return Array.from(paths);
};
var FileOperative = class {
	#entries = ref([]);
	#loading = ref(false);
	#error = ref("");
	#fsRoot = null;
	#dirProxy = null;
	#loadLock = false;
	#clipboard = null;
	#subscribed = null;
	#loaderDebounceTimer = null;
	#readonly = ref(false);
	host = null;
	pathRef = ref("/");
	get path() {
		return this.pathRef?.value || "/";
	}
	set path(value) {
		if (this.pathRef) this.pathRef.value = value || "/";
	}
	get entries() {
		return this.#entries;
	}
	get readonly() {
		return this.#readonly?.value === true;
	}
	constructor() {
		this.#entries = ref([]);
		this.pathRef ??= ref("/");
		affected(this.pathRef, (path) => {
			this.#readonly.value = isReadonlyPath(path || "/");
			this.loadPath(path || "/");
		});
		navigator?.storage?.getDirectory?.()?.then?.((h) => {
			this.#fsRoot = h;
			this.refreshList(this.path || "/");
		});
	}
	async listAssetEntries(path) {
		const target = normalizeDirectoryPath(path);
		const knownPaths = new Set(ASSET_SEED_PATHS);
		for (const virtualPath of buildVirtualAssetPaths(target)) knownPaths.add(virtualPath);
		try {
			const cacheNames = await caches.keys();
			for (const cacheName of cacheNames) try {
				const requests = await (await caches.open(cacheName)).keys();
				for (const req of requests) {
					const pathname = new URL(req.url).pathname;
					if (pathname.startsWith(ASSETS_ROOT)) knownPaths.add(pathname);
				}
			} catch {}
		} catch {}
		const dirs = /* @__PURE__ */ new Set();
		const files = [];
		for (const full of knownPaths) {
			const normalized = full.startsWith("/") ? full : `/${full}`;
			if (!normalized.startsWith(target)) continue;
			const remainder = normalized.slice(target.length);
			if (!remainder) continue;
			const [firstSegment, ...rest] = remainder.split("/").filter(Boolean);
			if (!firstSegment) continue;
			if (rest.length > 0 || normalized.endsWith("/")) dirs.add(firstSegment);
			else files.push(firstSegment);
		}
		const directoryEntries = Array.from(dirs).sort((a, b) => a.localeCompare(b)).map((name) => observe({
			name,
			kind: "directory"
		}));
		const fileEntries = Array.from(new Set(files)).filter((name) => !dirs.has(name)).sort((a, b) => a.localeCompare(b)).map((name) => {
			const item = observe({
				name,
				kind: "file"
			});
			item.type = getMimeTypeByFilename?.(name);
			return item;
		});
		return [...directoryEntries, ...fileEntries];
	}
	listVirtualRootEntries() {
		return [observe({
			name: "user",
			kind: "directory"
		}), observe({
			name: "assets",
			kind: "directory"
		})];
	}
	detachDirectoryObservers() {
		if (this.#loaderDebounceTimer) {
			clearTimeout(this.#loaderDebounceTimer);
			this.#loaderDebounceTimer = null;
		}
		if (typeof this.#subscribed === "function") {
			this.#subscribed();
			this.#subscribed = null;
		}
		if (this.#dirProxy?.dispose) this.#dirProxy.dispose();
		this.#dirProxy = null;
	}
	async collectDirectoryEntries() {
		const source = await this.#dirProxy?.entries?.();
		let pairs = [];
		if (Array.isArray(source)) pairs = source;
		else if (source && typeof source[Symbol.iterator] === "function") pairs = Array.from(source);
		else if (source && typeof source[Symbol.asyncIterator] === "function") for await (const pair of source) pairs.push(pair);
		return (await Promise.all((pairs || []).map(async ($pair) => {
			return Promise.try(async () => {
				const [name, handle] = $pair;
				return handleCache?.getOrInsertComputed?.(handle, async () => {
					const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
					const item = observe({
						name,
						kind,
						handle
					});
					if (kind === "file") {
						item.type = getMimeTypeByFilename?.(name);
						try {
							const f = await handle?.getFile?.();
							item.file = f;
							item.size = f?.size;
							item.lastModified = f?.lastModified;
							item.type = f?.type || item.type;
						} catch {}
					}
					return item;
				});
			})?.catch?.(console.warn.bind(console));
		})))?.filter?.(($item) => $item != null) || [];
	}
	async getDirectoryHandleByPath(path, create = false) {
		const root = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		if (!root) return null;
		const parts = normalizeDirectoryPath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	normalizeUserRelativePath(path) {
		const normalized = normalizeDirectoryPath(path);
		if (normalized === "/user/") return "/";
		if (normalized.startsWith("/user/")) return normalized.slice(5);
		return normalized;
	}
	async getOpfsRootHandle() {
		this.#fsRoot = this.#fsRoot || await navigator?.storage?.getDirectory?.();
		return this.#fsRoot;
	}
	async getUserDirHandle(path, create = false) {
		const root = await this.getOpfsRootHandle();
		if (!root) return null;
		const parts = this.normalizeUserRelativePath(path).split("/").filter(Boolean);
		let current = root;
		for (const part of parts) current = await current.getDirectoryHandle(part, { create });
		return current;
	}
	async writeUserFile(file, destPath = this.path) {
		const dir = await this.getUserDirHandle(destPath, true);
		if (!dir) return;
		const safeName = (file?.name || `file-${Date.now()}`).trim().replace(/\s+/g, "-");
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(file);
		await writable.close();
	}
	/**
	* Imperative save API for shells/channels — writes into the OPFS-backed workspace folder.
	* Defaults to {@link FileOperative.path}; optional `destPath` overrides the parent directory.
	*/
	async ingestFileIntoWorkspace(file, destPath) {
		await this.writeUserFile(file, destPath ?? this.path);
	}
	async removeUserEntry(absPath, recursive = true) {
		const root = await this.getOpfsRootHandle();
		if (!root) return false;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return false;
		const name = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		await dir.removeEntry(name, { recursive });
		return true;
	}
	async renameUserFile(absPath, newName) {
		const root = await this.getOpfsRootHandle();
		if (!root) return;
		const parts = this.normalizeUserRelativePath(absPath).replace(/\/+$/g, "").split("/").filter(Boolean);
		if (!parts.length) return;
		const oldName = parts.pop();
		let dir = root;
		for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: false });
		const oldFile = await (await dir.getFileHandle(oldName, { create: false })).getFile();
		const safeName = (newName || "").trim().replace(/\s+/g, "-");
		if (!safeName || safeName === oldName) return;
		const writable = await (await dir.getFileHandle(safeName, { create: true })).createWritable();
		await writable.write(oldFile);
		await writable.close();
		await dir.removeEntry(oldName);
	}
	async extractFilesFromData(data) {
		const files = [];
		const now = Date.now();
		const extByMime = (mime) => {
			const m = (mime || "").toLowerCase();
			if (m.includes("css")) return "css";
			if (m.includes("json")) return "json";
			if (m.includes("markdown")) return "md";
			if (m.includes("svg")) return "svg";
			if (m.includes("png")) return "png";
			if (m.includes("jpeg") || m.includes("jpg")) return "jpg";
			if (m.includes("gif")) return "gif";
			if (m.includes("webp")) return "webp";
			if (m.includes("plain")) return "txt";
			return "bin";
		};
		const nativeFiles = Array.from(data?.files ?? []).filter((f) => f instanceof File);
		files.push(...nativeFiles);
		const items = Array.from(data?.items ?? []);
		for (const item of items) {
			if (item?.kind === "file" && typeof item?.getAsFile === "function") {
				const f = item.getAsFile();
				if (f instanceof File) files.push(f);
				continue;
			}
			const types = Array.from(item?.types ?? []);
			if (typeof item?.getType === "function" && types.length > 0) {
				const type = String(types[0] || "");
				try {
					const blob = await item.getType(type);
					if (!blob) continue;
					const ext = extByMime(blob.type || type);
					files.push(new File([blob], `clipboard-${now}-${files.length}.${ext}`, {
						type: blob.type || type,
						lastModified: now
					}));
				} catch {}
			}
		}
		return files;
	}
	async readEntriesFromDirectory(dir) {
		if (!dir) return [];
		const entries = [];
		for await (const [name, handle] of dir.entries()) {
			const kind = handle?.kind || (name?.endsWith?.("/") ? "directory" : "file");
			const item = observe({
				name,
				kind,
				handle
			});
			if (kind === "file") {
				item.type = getMimeTypeByFilename?.(name);
				try {
					const f = await handle?.getFile?.();
					item.file = f;
					item.size = f?.size;
					item.lastModified = f?.lastModified;
					item.type = f?.type || item.type;
				} catch {}
			}
			entries.push(item);
		}
		return entries;
	}
	async listUserEntriesDirect(path, createIfMissing = false) {
		const normalized = normalizeDirectoryPath(path);
		const strippedPath = normalized.replace(/^\/user\/?/, "/");
		const legacyPath = normalized;
		const dirs = [];
		const tryPush = (dir) => {
			if (!dir) return;
			if (!dirs.includes(dir)) dirs.push(dir);
		};
		tryPush(await this.getDirectoryHandleByPath(strippedPath, false).catch(() => null));
		if (legacyPath !== strippedPath) tryPush(await this.getDirectoryHandleByPath(legacyPath, false).catch(() => null));
		if (!dirs.length && createIfMissing) tryPush(await this.getDirectoryHandleByPath(strippedPath, true).catch(() => null));
		const merged = /* @__PURE__ */ new Map();
		for (const dir of dirs) {
			const chunk = await this.readEntriesFromDirectory(dir);
			for (const entry of chunk) {
				if (!entry?.name) continue;
				const key = `${entry.kind}:${entry.name}`;
				if (!merged.has(key)) merged.set(key, entry);
			}
		}
		return Array.from(merged.values());
	}
	applyEntries(entries) {
		const unique = /* @__PURE__ */ new Map();
		for (const entry of entries || []) {
			if (!entry || !entry.name) continue;
			const key = `${entry.kind}:${entry.name}`;
			if (!unique.has(key)) unique.set(key, entry);
		}
		this.#entries.value = Array.from(unique.values());
		this.dispatchEvent(new CustomEvent("entries-updated", {
			detail: {
				path: this.path,
				count: unique.size
			},
			bubbles: true,
			composed: true
		}));
	}
	async itemAction(item) {
		const self = this;
		const detail = {
			path: (self.path || "/") + item?.name,
			item,
			originalEvent: null
		};
		const event = new CustomEvent("open-item", {
			detail,
			bubbles: true,
			composed: true,
			cancelable: true
		});
		this.host?.dispatchEvent(event);
		if (event.defaultPrevented) return;
		if (item?.kind === "directory") self.path = (self.path?.endsWith?.("/") ? self.path : self.path + "/") + item?.name + "/";
		else {
			const abs = (self.path || "/") + (item?.name || "");
			if (!item?.file && isAssetsPath(abs)) {
				item.file = await provide(abs).catch(() => null);
				if (item.file) {
					item.size = item.file.size;
					item.lastModified = item.file.lastModified;
					item.type = item.file.type || item.type;
				}
			}
			const openEvent = new CustomEvent("open", {
				detail,
				bubbles: true,
				composed: true
			});
			this.host?.dispatchEvent(openEvent);
		}
	}
	async requestUse() {}
	async refreshList(path = this.path) {
		await this.loadPath(path);
		return this;
	}
	async loadPath(path = this.path) {
		if (this.#loadLock) {
			if (typeof globalThis.requestIdleCallback === "function") return globalThis.requestIdleCallback(() => this.loadPath(path), { timeout: 1e3 });
			return globalThis.setTimeout(() => this.loadPath(path), 0);
		}
		this.#loadLock = true;
		try {
			this.#loading.value = true;
			this.#error.value = "";
			const rel = normalizeDirectoryPath(path?.value || path || this.path || "/");
			this.detachDirectoryObservers();
			if (isVirtualRootPath(rel)) {
				this.applyEntries(this.listVirtualRootEntries());
				return this;
			}
			if (isAssetsPath(rel)) {
				this.applyEntries(await this.listAssetEntries(rel));
				return this;
			}
			if (isUserPath(rel)) {
				const entries = await this.listUserEntriesDirect(rel, true);
				this.applyEntries(entries);
				return this;
			}
			try {
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: false });
				await this.#dirProxy;
			} catch (openErr) {
				if (!isUserPath(rel)) throw openErr;
				this.#dirProxy = openDirectory(this.#fsRoot, rel, { create: true });
				await this.#dirProxy;
			}
			console.log("rel", rel);
			const loader = async () => {
				const entries = await this.collectDirectoryEntries();
				if (entries?.length != null && entries?.length >= 0 && typeof entries?.length == "number") this.applyEntries(entries);
			};
			const debouncedLoader = () => {
				if (this.#loaderDebounceTimer) clearTimeout(this.#loaderDebounceTimer);
				this.#loaderDebounceTimer = setTimeout(() => loader(), 50);
			};
			await loader()?.catch?.(console.warn.bind(console));
			this.#subscribed = affected(await this.#dirProxy?.getMap?.() ?? [], debouncedLoader);
		} catch (e) {
			this.#error.value = e?.message || String(e || "");
			this.applyEntries([]);
			console.warn(e);
		} finally {
			this.#loading.value = false;
			this.#loadLock = false;
		}
		return this;
	}
	onRowClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item);
	};
	onRowDblClick = (item, ev) => {
		ev.preventDefault();
		this.itemAction(item);
	};
	onRowDragStart = (item, ev) => {
		if (!ev.dataTransfer) return;
		ev.dataTransfer.effectAllowed = "copyMove";
		const abs = (this.path || "/") + (item?.name || "");
		ev.dataTransfer.setData("text/plain", abs);
		ev.dataTransfer.setData("text/uri-list", abs);
		if (item?.file) {
			ev.dataTransfer.setData("DownloadURL", item?.file?.type + ":" + item?.file?.name + ":" + URL.createObjectURL(item?.file));
			ev.dataTransfer.items.add(item?.file);
		}
	};
	async onMenuAction(item, actionId, ev) {
		try {
			const itemName = item?.name;
			if (!actionId) return;
			const abs = (this.path || "/") + (itemName || "");
			switch (actionId) {
				case "delete":
				case "rename":
				case "movePath":
					if (this.readonly || isReadonlyPath(abs)) {
						this.dispatchEvent(new CustomEvent("readonly-blocked", {
							detail: {
								action: actionId,
								path: abs
							},
							bubbles: true,
							composed: true
						}));
						break;
					}
					if (actionId === "delete") {
						if (isUserPath(abs)) await this.removeUserEntry(abs, true);
						else await remove(this.#fsRoot, abs);
						await this.refreshList(this.path);
						break;
					}
					if (actionId === "rename") {
						if (item?.kind === "file") {
							const next = prompt("Rename to:", itemName);
							if (next && next !== itemName) {
								if (isUserPath(abs)) await this.renameUserFile(abs ?? "", next ?? "");
								else await this.renameFile(abs ?? "", next ?? "");
								await this.refreshList(this.path);
							}
						}
						break;
					}
					break;
				case "open":
					await this.itemAction(item);
					break;
				case "view":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "view",
						item
					} }));
					break;
				case "attach-workcenter":
					this.dispatchEvent(new CustomEvent("context-action", { detail: {
						action: "attach-workcenter",
						item
					} }));
					break;
				case "download":
					Promise.try(async () => {
						if (isAssetsPath(abs)) {
							const file = await provide(abs);
							if (file) await downloadFile(file);
							return;
						}
						if (item?.kind === "file") await downloadFile(await getFileHandle(this.#fsRoot, abs, { create: false }));
						else await downloadFile(await getDirectoryHandle(this.#fsRoot, abs, { create: false }));
					}).catch(console.warn);
					break;
				case "copyPath":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
				case "copy":
					this.#clipboard = {
						items: [abs],
						cut: false
					};
					try {
						await waitForClipboardFrame();
						await navigator.clipboard?.writeText?.(abs);
					} catch {}
					break;
			}
		} catch (e) {
			console.warn(e);
			this.#error.value = e?.message || String(e || "");
		}
	}
	async renameFile(oldName, newName) {
		const file = await (await getFileHandle(this.#fsRoot, oldName, { create: false }))?.getFile?.();
		if (!file) return;
		if (!await getFileHandle(this.#fsRoot, newName, { create: true }).catch(() => null)) await writeFile(this.#fsRoot, this.path + newName, file);
		else await writeFile(this.#fsRoot, this.path + newName, file);
		await remove(this.#fsRoot, this.path + oldName);
	}
	async requestUpload() {
		if (this.readonly || isReadonlyPath(this.path)) return;
		try {
			const picker = window?.showOpenFilePicker;
			if (picker && isUserPath(this.path)) {
				const handles = await picker({ multiple: true }).catch(() => []);
				for (const handle of handles || []) {
					const file = await handle?.getFile?.();
					if (file instanceof File) await this.writeUserFile(file, this.path);
				}
			} else await uploadFile(this.path, null);
			await this.refreshList(this.path);
		} catch (e) {
			console.warn(e);
		}
	}
	async requestPaste() {
		if (this.readonly || isReadonlyPath(this.path)) return;
		try {
			try {
				await waitForClipboardFrame();
				const clipboardItems = await navigator.clipboard.read();
				if (clipboardItems && clipboardItems.length > 0) {
					const files = await this.extractFilesFromData(clipboardItems);
					if (files.length > 0 && isUserPath(this.path)) {
						for (const file of files) await this.writeUserFile(file, this.path);
						await this.refreshList(this.path);
						return;
					}
				}
			} catch (e) {}
			let systemText = "";
			try {
				await waitForClipboardFrame();
				systemText = await navigator.clipboard?.readText?.();
			} catch {}
			const internalItems = this.#clipboard?.items || [];
			if (systemText) {
				await handleIncomingEntries({ getData: (type) => type === "text/plain" ? systemText : "" }, this.path || "/");
				await this.refreshList(this.path);
				return;
			}
			if (internalItems.length > 0) {
				const txt = internalItems.join("\n");
				if (isUserPath(this.path) && internalItems.every((x) => String(x || "").startsWith("/user/"))) {
					for (const src of internalItems) {
						const file = await readFile(this.#fsRoot, src).catch(() => null);
						if (file instanceof File) {
							await this.writeUserFile(file, this.path);
							if (this.#clipboard?.cut) await this.removeUserEntry(src, true).catch(() => null);
						}
					}
					if (this.#clipboard?.cut) this.#clipboard = null;
				} else await handleIncomingEntries({ getData: (type) => type === "text/plain" ? txt : "" }, this.path || "/");
				await this.refreshList(this.path);
			}
		} catch (e) {
			console.warn(e);
		}
	}
	onPaste(ev) {
		if (this.readonly || isReadonlyPath(this.path)) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			Promise.try(async () => {
				const payload = ev.clipboardData || ev.dataTransfer;
				const files = await this.extractFilesFromData(payload);
				if (files.length > 0 && isUserPath(this.path)) for (const file of files) await this.writeUserFile(file, this.path);
				else await handleIncomingEntries(payload, this.path || "/");
				await this.refreshList(this.path);
			}).catch(console.warn);
			return;
		}
		this.requestPaste();
	}
	onCopy(ev) {}
	async onDrop(ev) {
		if (this.readonly || isReadonlyPath(this.path)) return;
		ev.preventDefault();
		if (ev.clipboardData || ev.dataTransfer) {
			const payload = ev.clipboardData || ev.dataTransfer;
			const files = await this.extractFilesFromData(payload);
			if (files.length > 0 && isUserPath(this.path)) for (const file of files) await this.writeUserFile(file, this.path);
			else await handleIncomingEntries(payload, this.path || "/");
			await this.refreshList(this.path);
			return;
		}
	}
	dispatchEvent(event) {
		this.host?.dispatchEvent(event);
	}
};
//#endregion
//#region shared/fest/fl-ui/ui/explorer/ContextMenu.ts
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var styleMounted = false;
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var ensureStyle = () => {
	if (styleMounted) return;
	styleMounted = true;
	const style = document.createElement("style");
	style.id = "cw-unified-context-menu-style";
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: 2000;
            pointer-events: none;
        }

        .cw-context-menu {
            position: fixed;
            min-inline-size: 220px;
            max-inline-size: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            border: none;
            background: color-mix(in oklab, #0c1018 88%, #1a2842 12%);
            box-shadow:
                0 14px 36px rgba(0, 0, 0, 0.45),
                0 0 0 1px rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(14px);
            pointer-events: auto;
            user-select: none;
        }

        .cw-context-menu.cw-context-menu--compact {
            min-inline-size: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            justify-items: stretch;
            text-align: left;
        }

        .cw-context-menu__item {
            inline-size: 100%;
            display: grid;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto;
            align-items: center;
            gap: 0.55rem;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #eaf0ff;
            padding: 0.5rem 0.6rem;
            min-block-size: 2.35rem;
            font-size: 0.8125rem;
            line-height: 1.25;
            text-align: start !important;
            cursor: pointer;
            justify-items: start;
        }

        .cw-context-menu__item:hover,
        .cw-context-menu__item:focus-visible {
            outline: none;
            background: rgba(137, 176, 255, 0.14);
        }

        .cw-context-menu__item[disabled] {
            opacity: 0.45;
            cursor: default;
        }

        .cw-context-menu__item--danger {
            color: #ff9da1;
        }

        .cw-context-menu__icon {
            justify-self: center;
            inline-size: 1.375rem;
            block-size: 1.375rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem;
            pointer-events: none;
        }

        .cw-context-menu__label {
            justify-self: stretch;
            text-align: start !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-inline-size: 0;
        }

        .cw-context-menu__chevron {
            justify-self: end;
            opacity: 0.72;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem;
            pointer-events: none;
        }
    `;
	document.head.appendChild(style);
};
var getOverlayHost = () => {
	return document.querySelector("[data-app-layer=\"overlay\"]") || document.body;
};
var clearCleanup = () => {
	for (const fn of cleanupFns) try {
		fn();
	} catch {}
	cleanupFns = [];
};
var clearTimersFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuOpenTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuOpenTimers.delete(key);
	}
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var placeMenu = (menu, x, y) => {
	menu.style.left = `${x}px`;
	menu.style.top = `${y}px`;
	const rect = menu.getBoundingClientRect();
	const maxX = Math.max(8, window.innerWidth - rect.width - 8);
	const maxY = Math.max(8, window.innerHeight - rect.height - 8);
	menu.style.left = `${Math.min(Math.max(8, x), maxX)}px`;
	menu.style.top = `${Math.min(Math.max(8, y), maxY)}px`;
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var placeSubmenuWithFallback = (submenu, anchor) => {
	const rect = anchor.getBoundingClientRect();
	placeMenu(submenu, Math.round(rect.right + 4), Math.round(rect.top));
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		placeSubmenuWithFallback(submenu, anchorButton);
	};
	const scheduleOpenSubmenu = (item, anchorButton, nextDepth) => {
		const existingOpen = submenuOpenTimers.get(nextDepth);
		if (existingOpen) clearTimeout(existingOpen);
		cancelScheduledCloseFromDepth(nextDepth);
		const timer = setTimeout(() => {
			submenuOpenTimers.delete(nextDepth);
			openSubmenu(item, anchorButton, nextDepth);
		}, SUBMENU_HOVER_OPEN_MS);
		submenuOpenTimers.set(nextDepth, timer);
	};
	const scheduleCloseSubmenuFromDepth = (nextDepth) => {
		const existingClose = submenuCloseTimers.get(nextDepth);
		if (existingClose) clearTimeout(existingClose);
		const timer = setTimeout(() => {
			submenuCloseTimers.delete(nextDepth);
			closeSubmenusFromDepth(nextDepth);
		}, SUBMENU_HOVER_CLOSE_MS);
		submenuCloseTimers.set(nextDepth, timer);
	};
	for (const item of entries) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `cw-context-menu__item${item.danger ? " cw-context-menu__item--danger" : ""}`;
		button.setAttribute("role", "menuitem");
		button.disabled = Boolean(item.disabled);
		const hasChildren = Boolean(item.children?.length);
		button.innerHTML = `
            <span class="cw-context-menu__icon">${item.icon ? `<ui-icon icon="${item.icon}"></ui-icon>` : ""}</span>
            <span class="cw-context-menu__label">${item.label}</span>
            <span class="cw-context-menu__chevron">${hasChildren ? `<ui-icon icon="caret-right"></ui-icon>` : ""}</span>
        `;
		if (hasChildren) {
			const nextDepth = depth + 1;
			button.setAttribute("aria-haspopup", "menu");
			button.addEventListener("pointerenter", () => scheduleOpenSubmenu(item, button, nextDepth));
			button.addEventListener("pointerleave", () => scheduleCloseSubmenuFromDepth(nextDepth));
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (session !== menuSession || !rootMenu?.isConnected) return;
				cancelScheduledCloseFromDepth(nextDepth);
				const existing = submenuByDepth.get(nextDepth);
				const activeAnchor = submenuAnchorByDepth.get(nextDepth);
				if (existing?.isConnected && activeAnchor === button) {
					closeSubmenusFromDepth(nextDepth);
					return;
				}
				openSubmenu(item, button, nextDepth);
			});
		} else button.addEventListener("click", async (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (session !== menuSession || !rootMenu?.isConnected) return;
			closeUnifiedContextMenu();
			if (item.disabled) return;
			await item.action();
		});
		const li = document.createElement("li");
		li.appendChild(button);
		list.appendChild(li);
	}
	menu.addEventListener("pointerenter", () => cancelScheduledCloseFromDepth(depth));
	menu.addEventListener("pointerleave", () => {
		if (depth > 0) {
			const existingClose = submenuCloseTimers.get(depth);
			if (existingClose) clearTimeout(existingClose);
			const timer = setTimeout(() => {
				submenuCloseTimers.delete(depth);
				closeSubmenusFromDepth(depth);
			}, SUBMENU_HOVER_CLOSE_MS);
			submenuCloseTimers.set(depth, timer);
		}
	});
	return menu;
};
var closeUnifiedContextMenu = () => {
	clearCleanup();
	clearTimersFromDepth(0);
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	rootMenu?.remove();
	rootMenu = null;
	menuLayer?.remove();
	menuLayer = null;
	menuSession += 1;
};
var openUnifiedContextMenu = (request) => {
	const entries = (request.items || []).filter((item) => item && item.id && item.label);
	if (!entries.length) {
		closeUnifiedContextMenu();
		return;
	}
	ensureStyle();
	closeUnifiedContextMenu();
	const session = menuSession;
	const overlayHost = getOverlayHost();
	overlayHost.style.pointerEvents = overlayHost.style.pointerEvents || "none";
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	menuLayer = layer;
	overlayHost.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		const target = event.target;
		if (target && menuLayer.contains(target)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		const parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem) {
			closeSubmenusFromDepth(1);
			return;
		}
		if (!(parentItem.getAttribute("aria-haspopup") === "menu")) closeSubmenusFromDepth(1);
	};
	const onEscape = (event) => {
		if (session !== menuSession) return;
		if (event.key === "Escape") closeUnifiedContextMenu();
	};
	const close = () => closeUnifiedContextMenu();
	document.addEventListener("pointerdown", onPointerDown, { capture: true });
	document.addEventListener("contextmenu", onPointerDown, { capture: true });
	document.addEventListener("keydown", onEscape);
	menu.addEventListener("click", onMenuInternalClick, { capture: true });
	window.addEventListener("resize", close, { passive: true });
	window.addEventListener("blur", close, { passive: true });
	cleanupFns.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));
	cleanupFns.push(() => document.removeEventListener("contextmenu", onPointerDown, { capture: true }));
	cleanupFns.push(() => document.removeEventListener("keydown", onEscape));
	cleanupFns.push(() => menu.removeEventListener("click", onMenuInternalClick, { capture: true }));
	cleanupFns.push(() => window.removeEventListener("resize", close));
	cleanupFns.push(() => window.removeEventListener("blur", close));
};
var disconnectRegistry = new FinalizationRegistry((ctxMenu) => {});
var makeFileActionOps = () => {
	return [
		{
			id: "open",
			label: "Open",
			icon: "function"
		},
		{
			id: "view",
			label: "View",
			icon: "eye"
		},
		{
			id: "view-base",
			label: "View (Base tab)",
			icon: "arrow-square-out"
		},
		{
			id: "attach-workcenter",
			label: "Attach to Work Center",
			icon: "lightning"
		},
		{
			id: "attach-workcenter-queued",
			label: "Queue attach (pending)",
			icon: "clock-counter-clockwise"
		},
		{
			id: "attach-workcenter-headless",
			label: "Queue attach (headless)",
			icon: "wave-sine"
		},
		{
			id: "pin-home",
			label: "Pin to Home Screen",
			icon: "push-pin-simple"
		},
		{
			id: "download",
			label: "Download",
			icon: "download"
		}
	];
};
var makeFileSystemOps = () => {
	return [
		{
			id: "delete",
			label: "Delete",
			icon: "trash"
		},
		{
			id: "rename",
			label: "Rename",
			icon: "pencil"
		},
		{
			id: "copyPath",
			label: "Copy Path",
			icon: "copy"
		},
		{
			id: "movePath",
			label: "Move Path",
			icon: "hand-withdraw"
		}
	];
};
var makeContextMenu = () => {
	const ctxMenu = H`<ul class="round-decor ctx-menu ux-anchor" style="position: fixed; z-index: 99999;" data-hidden></ul>`;
	const overlay = document.querySelector("[data-app-layer=\"overlay\"]");
	const basicApp = document.querySelector(".basic-app");
	(overlay || basicApp || document.body).append(ctxMenu);
	return ctxMenu;
};
var createItemCtxMenu = async (fileManager, onMenuAction, entries) => {
	const ctxMenuDesc = {
		openedWith: null,
		items: [makeFileActionOps(), makeFileSystemOps()],
		defaultAction: (initiator, menuItem, ev) => {
			const rowFromCompose = Array.from(ev?.composedPath?.() || []).find((element) => element?.classList?.contains?.("row")) || MOCElement(initiator, ".row");
			onMenuAction?.((entries?.value ?? entries)?.find?.((item) => item?.name === rowFromCompose?.getAttribute?.("data-id")), menuItem?.id, ev);
		}
	};
	const initiatorElement = fileManager;
	const ctxMenu = makeContextMenu();
	ctxMenuTrigger(initiatorElement, ctxMenuDesc, ctxMenu);
	disconnectRegistry.register(initiatorElement, ctxMenu);
	return ctxMenu;
};
//#endregion
//#region shared/fest/fl-ui/ui/explorer/utils.ts
/**
* Get icon name by MIME type
*/
var iconByMime = (mime, def = "file") => {
	if (!mime) return def;
	if (mime.startsWith("image/")) return "image";
	if (mime.startsWith("audio/")) return "music";
	if (mime.startsWith("video/")) return "video";
	if (mime === "application/pdf") return "file-text";
	if (mime.includes("zip") || mime.includes("7z") || mime.includes("rar")) return "file-archive";
	if (mime.includes("json")) return "brackets-curly";
	if (mime.includes("csv")) return "file-spreadsheet";
	if (mime.includes("xml")) return "code";
	if (mime.startsWith("text/")) return "file-text";
	return def;
};
/**
* Extension to icon mapping
*/
var EXTENSION_ICON_MAP = {
	md: "file-text",
	txt: "file-text",
	pdf: "file-pdf",
	doc: "file-doc",
	docx: "file-doc",
	png: "file-image",
	jpg: "file-image",
	jpeg: "file-image",
	gif: "file-image",
	svg: "file-image",
	webp: "file-image",
	js: "file-js",
	ts: "file-ts",
	jsx: "file-jsx",
	tsx: "file-tsx",
	html: "file-html",
	css: "file-css",
	scss: "file-css",
	json: "file-json",
	zip: "file-zip",
	tar: "file-zip",
	gz: "file-zip",
	rar: "file-zip",
	mp3: "file-audio",
	wav: "file-audio",
	mp4: "file-video",
	mov: "file-video",
	webm: "file-video"
};
/**
* Get icon name by file extension
*/
var getFileIcon = (filename) => {
	return EXTENSION_ICON_MAP[filename.split(".").pop()?.toLowerCase() || ""] || "file";
};
/**
* Get icon for file entry item (unified function)
* Handles FileEntry objects and string types.
*/
var iconFor = (item, type) => {
	if (typeof item === "string") return item === "directory" ? "folder" : iconByMime(type || item || "");
	if (item?.kind === "directory") return "folder";
	return iconByMime(item?.type) || getFileIcon(item?.name || "");
};
var dateCache = /* @__PURE__ */ new Map();
/**
* Format date with caching
*/
var formatDate = (timestamp) => {
	if (timestamp === void 0 || timestamp === null) return "";
	const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	if (dateCache.has(ts)) return dateCache.get(ts);
	const formatted = new Date(ts).toLocaleString("en-US", {
		dateStyle: "short",
		timeStyle: "short"
	});
	dateCache.set(ts, formatted);
	return formatted;
};
//#endregion
//#region shared/fest/fl-ui/ui/explorer/FileManagerContent.ts
initGlobalClipboard();
var styled$1 = preloadStyle(FileManagerContent_default$1);
var FileManagerContent = class FileManagerContent extends UIElement {
	gridRowsEl;
	gridEl;
	operativeInstance = null;
	operativeInstanceRef = ref(null);
	#rowsContainer = null;
	get entries() {
		return this.operativeInstance?.entries ?? [];
	}
	get path() {
		return this.operativeInstance?.path || "/";
	}
	set path(value) {
		if (this.operativeInstance) this.operativeInstance.path = value || "/";
	}
	get pathRef() {
		return this.operativeInstance?.pathRef;
	}
	refreshList() {
		if (this.gridRowsEl) this.gridRowsEl.innerHTML = ``;
		if (this.gridEl) this.gridEl.innerHTML = ``;
		if (this.operativeInstance) this.operativeInstance.refreshList(this.path || "/").then(() => this.syncRows()).catch(console.warn);
	}
	onInitialize() {
		return super.onInitialize() ?? this;
	}
	bindDropHandlers() {
		const container = this;
		if (!container) return;
		addEvent(container, "dragover", (ev) => {
			if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
				ev?.preventDefault?.();
				if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
			}
		});
		addEvent(container, "drop", (ev) => {
			if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
				ev?.preventDefault?.();
				ev?.stopPropagation?.();
				this.operativeInstance?.onDrop?.(ev);
			}
		});
	}
	onPaste(ev) {
		if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
			if (this.operativeInstance) this.operativeInstance.onPaste(ev);
		}
	}
	onCopy(ev) {
		if (isInFocus(ev?.target, "ui-file-manager-content, ui-file-manager")) {
			if (this.operativeInstance) this.operativeInstance.onCopy(ev);
		}
	}
	byFirstTwoLetterOrName(name) {
		return ((name?.substring?.(0, 2)?.toUpperCase?.())?.charCodeAt?.(0) || 65) - 65;
	}
	constructor() {
		super();
		this.operativeInstance ??= new FileOperative();
		this.operativeInstance.host = this;
		this.addEventListener("entries-updated", () => this.syncRows());
		this.refreshList();
	}
	syncRows() {
		let rows = this.#rowsContainer;
		if (!rows || !rows.isConnected) {
			rows = this.shadowRoot?.querySelector?.(".fm-grid:last-of-type .fm-grid-rows") ?? null;
			this.#rowsContainer = rows;
		}
		const operative = this.operativeInstance;
		if (!rows || !operative) return;
		const rawEntries = operative.entries;
		const currentEntries = Array.isArray(rawEntries) ? rawEntries : Array.isArray(rawEntries?.value) ? rawEntries.value : [];
		const safeEntries = Array.isArray(currentEntries) ? currentEntries : [];
		const seen = /* @__PURE__ */ new Set();
		rows.innerHTML = "";
		const fragment = document.createDocumentFragment();
		for (const item of safeEntries) {
			if (!item || typeof item !== "object" || item.name == null) continue;
			const dedupeKey = `${item.kind}:${item.name}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);
			fragment.append(this.makeListElement(item, operative));
		}
		rows.append(fragment);
	}
	makeListElement(item, operative) {
		const op = operative;
		const isFile = item?.kind === "file" || item?.file;
		const itemEl = H`<div draggable="${isFile}" class="row c2-surface"
            on:click=${(ev) => requestAnimationFrame(() => op.onRowClick?.(item, ev))}
            on:dblclick=${(ev) => requestAnimationFrame(() => op.onRowDblClick?.(item, ev))}
            on:dragstart=${(ev) => op.onRowDragStart?.(item, ev)}
            data-id=${item?.name || ""}
        >
            <div style="pointer-events: none; background-color: transparent;" class="c icon"><ui-icon icon=${iconFor(item)} /></div>
            <div style="pointer-events: none; background-color: transparent;" class="c name" title=${item?.name || ""}>${item?.name || ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c size">${isFile ? item?.size ?? "" : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c date">${isFile ? formatDate(item?.lastModified ?? 0) : ""}</div>
            <div style="pointer-events: none; background-color: transparent;" class="c actions">
                <button class="action-btn" title="Copy Path" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copyPath", ev));
		}}>
                    <ui-icon icon="copy" />
                </button>
                <button class="action-btn" title="Copy" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "copy", ev));
		}}>
                    <ui-icon icon="clipboard" />
                </button>
                <button class="action-btn" title="Delete" on:click=${(ev) => {
			ev.stopPropagation();
			requestAnimationFrame(() => op.onMenuAction?.(item, "delete", ev));
		}}>
                    <ui-icon icon="trash" />
                </button>
            </div>
        </div>`;
		bindWith(itemEl, "--order", this.byFirstTwoLetterOrName(item?.name ?? ""), handleStyleChange);
		return itemEl;
	}
	styles = () => styled$1;
	render = function() {
		const self = this;
		const fileHeader = H`<div class="fm-grid-header">
            <div class="c icon">@</div>
            <div class="c name">Name</div>
            <div class="c size">Size</div>
            <div class="c date">Modified</div>
            <div class="c actions">Actions</div>
        </div>`;
		const operative = self.operativeInstance;
		if (!operative) return "";
		const fileRows = H`<div class="fm-grid-rows" style="will-change: contents;"></div>`;
		this.#rowsContainer = fileRows;
		createItemCtxMenu?.(fileRows, operative.onMenuAction.bind(operative), self.entries);
		queueMicrotask(() => {
			self.bindDropHandlers();
			const root = self.shadowRoot;
			const grids = Array.from(root?.querySelectorAll?.(".fm-grid") || []);
			if (grids.length > 1) {
				const latest = grids.at(-1);
				for (const extra of grids) if (extra !== latest) extra.remove();
				self.#rowsContainer = latest.querySelector(".fm-grid-rows");
			}
			self.syncRows();
		});
		return H`<div class="fm-grid" part="grid">
            ${fileHeader}
            ${fileRows}
        </div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManagerContent.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManagerContent.prototype, "gridEl", void 0);
FileManagerContent = __decorate([defineElement("ui-file-manager-content")], FileManagerContent);
var FileManagerContent_default = FileManagerContent;
//#endregion
//#region shared/fest/fl-ui/ui/explorer/FileManager.ts
var styled = preloadStyle(":root{--fl-ui-radius:0.5rem;--fl-ui-gap:0.75rem;--color-surface:#151d2e;--color-on-surface:#e8edf5;--color-on-surface-variant:#8b9bb8;--color-primary:#3794ff;--error-color:#f87171}@layer ux-file-manager{:host(ui-file-manager),:host(ui-file-manager) :where(*){box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}:host(ui-file-manager){background-color:var(--color-surface);block-size:stretch;border-radius:0;color:var(--color-on-surface);container-type:inline-size;content-visibility:auto;display:grid;flex-grow:1;inline-size:stretch;line-height:normal;margin:0;max-block-size:none;max-inline-size:none;min-block-size:0;min-inline-size:0;overflow:hidden;perspective:1000}:host(ui-file-manager) .fm-root{block-size:stretch;display:grid;gap:0;grid-template-columns:[content-col] minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;min-block-size:0;overflow:hidden}:host(ui-file-manager) .fm-toolbar{background:var(--color-surface,#1e1e1e);border-radius:0;box-shadow:0 1px 0 color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);display:grid;gap:.625rem;grid-auto-flow:column;grid-column:1/-1;grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);grid-template-rows:minmax(0,1fr);line-height:normal;padding:.5rem .75rem;place-content:center;place-items:center}:host(ui-file-manager) .fm-toolbar button,:host(ui-file-manager) .fm-toolbar input{background-color:initial;color:var(--color-on-surface)}:host(ui-file-manager) .fm-toolbar input{background:color-mix(in oklab,var(--color-on-surface,#fff) 6%,transparent);block-size:stretch;border:none;border-radius:999px;font:.8125rem/1.35 ui-monospace,Cascadia Code,SF Mono,Consolas,monospace;inline-size:stretch;outline:none;overflow:auto;padding:.45rem .85rem}:host(ui-file-manager) .fm-toolbar input:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary,#3794ff) 45%,transparent)}:host(ui-file-manager) .fm-toolbar .btn{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;block-size:2.5rem;border:0;border-radius:999px;cursor:pointer;display:inline-flex;inline-size:2.5rem;justify-content:center;padding:0;transition:background .14s ease,transform .1s ease}:host(ui-file-manager) .fm-toolbar .btn ui-icon{block-size:1.25rem;flex-shrink:0;inline-size:1.25rem}:host(ui-file-manager) .fm-toolbar .btn:hover{background:color-mix(in oklab,var(--color-on-surface) 9%,transparent)}:host(ui-file-manager) .fm-toolbar .btn:active{transform:scale(.96)}:host(ui-file-manager) .fm-toolbar .btn:focus-visible{outline:2px solid color-mix(in oklab,var(--color-primary,#3794ff) 55%,transparent);outline-offset:1px}:host(ui-file-manager) .fm-toolbar>*{align-items:center;block-size:fit-content;display:flex;flex-direction:row;flex-wrap:nowrap;gap:.2rem;min-block-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left{grid-column:1}:host(ui-file-manager) .fm-toolbar .fm-toolbar-left,:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);border-radius:999px;padding:.2rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center{background:color-mix(in oklab,var(--color-on-surface,#fff) 5.5%,transparent);block-size:fit-content;border-radius:999px;flex-grow:1;grid-column:2;inline-size:stretch;min-block-size:2.5rem;overflow:hidden;padding:0;place-content:stretch;justify-content:start;place-items:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center>*{block-size:stretch;inline-size:stretch}:host(ui-file-manager) .fm-toolbar .fm-toolbar-center input{background:transparent;inline-size:stretch;padding-inline:.9rem}:host(ui-file-manager) .fm-toolbar .fm-toolbar-right{grid-column:3}:host(ui-file-manager) .fm-sidebar{align-content:start;border-radius:.5rem;display:none;gap:.5rem;grid-column:sidebar-col;grid-row:2;justify-content:start;justify-items:start;line-height:normal;padding:.5rem;text-align:start}:host(ui-file-manager) .fm-sidebar .sec{display:grid;gap:.25rem;place-content:start;justify-content:start;place-items:start;justify-items:start}:host(ui-file-manager) .fm-sidebar .sec-title{font-weight:600;opacity:.8;padding-block:.25rem;place-self:start}:host(ui-file-manager) .fm-sidebar .link{appearance:none;border:0;border-radius:.375rem;cursor:pointer;line-height:normal;padding:.25rem .375rem;text-align:start}:host(ui-file-manager) .fm-content{block-size:stretch;border-radius:0;grid-column:content-col;grid-row:2;inline-size:stretch;min-block-size:0;overflow:hidden;padding:0 .35rem .45rem;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 22%,transparent) transparent;scrollbar-width:thin}:host(ui-file-manager) .status{opacity:.8;padding:.5rem}:host(ui-file-manager) .status.error{color:var(--error-color,crimson)}@container (inline-size < 520px){:host(ui-file-manager) .fm-content{grid-column:1/-1}:host(ui-file-manager) .fm-root{grid-column:1/-1}:host(ui-file-manager) .fm-grid{grid-column:1/-1}:host(ui-file-manager) .fm-root[data-with-sidebar=true]{grid-template-columns:[content-col] minmax(0,1fr)}:host(ui-file-manager) .fm-sidebar{display:none!important}}}");
var FileManager = class FileManager extends UIElement {
	gridRowsEl;
	gridEl;
	sidebar = "auto";
	inlineSize;
	styles = () => styled;
	#pathWatcherDisposer = null;
	constructor() {
		super();
	}
	get content() {
		return this?.querySelector?.("ui-file-manager-content");
	}
	get operative() {
		return this.content?.operativeInstance;
	}
	get pathRef() {
		return this.operative?.pathRef;
	}
	get path() {
		return this.content?.path || this.operative?.path || "/";
	}
	set path(value) {
		if (this.content) this.content.path = value || "/";
		if (this.operative) this.operative.path = value || "/";
	}
	get input() {
		return this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
	}
	get inputValue() {
		return this.input?.value || "/";
	}
	set inputValue(value) {
		if (this.input) this.input.value = value || "/";
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		const existingContents = Array.from(self.querySelectorAll("ui-file-manager-content"));
		const primaryContent = existingContents[0] ?? document.createElement("ui-file-manager-content");
		if (!existingContents.length) self.append(primaryContent);
		if (existingContents.length > 1) for (const extra of existingContents.slice(1)) extra?.remove?.();
		queueMicrotask(() => {
			this.#pathWatcherDisposer?.();
			this.#pathWatcherDisposer = null;
			if (!this.pathRef) return;
			this.#pathWatcherDisposer = affected(this.pathRef, (path) => {
				const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
				if (input && input instanceof HTMLInputElement && input.value != path) input.value = path || "/";
			});
		});
		return self;
	}
	onRender() {
		super.onRender();
		const weak = new WeakRef(this);
		const onEnter = (ev) => {
			if (ev.key === "Enter") {
				const self = weak.deref();
				const val = (self?.querySelector?.("input[name=\"address\"]"))?.value?.trim?.() || "";
				if (val) self?.navigate(val);
			}
		};
		addEvent(this, "keydown", onEnter);
	}
	get showSidebar() {
		const force = String(this.sidebar ?? "auto").toLowerCase();
		if (force === "true" || force === "1") return true;
		if (force === "false" || force === "0") return false;
		return (propRef(this, "inlineSize")?.value ?? this.inlineSize ?? 0) >= 720;
	}
	async navigate(toPath) {
		this.path = getDir(toPath) || this.path || "/";
		const input = this?.shadowRoot?.querySelector?.("input[name=\"address\"]");
		if (input && input instanceof HTMLInputElement && input.value != this.path) input.value = this.path || "/";
	}
	async goUp() {
		const parts = (this.path || this.content?.path || "/").replace(/\/+$/g, "").split("/").filter(Boolean);
		if (parts.length <= 1) {
			this.navigate(this.path = "/");
			return;
		}
		const clean = getDir("/" + parts.slice(0, -1).join("/") + "/");
		this.navigate(this.path = clean || "/");
	}
	requestUpload() {
		this.operative?.requestUpload?.();
	}
	requestPaste() {
		this.operative?.requestPaste?.();
	}
	requestUse() {
		this.operative?.requestUse?.();
	}
	render = function() {
		const self = this;
		const sidebarVisible = self.showSidebar;
		const content = H`<div part="content" class="fm-content"><slot></slot></div>`;
		return H`<div part="root" class="fm-root" data-with-sidebar=${sidebarVisible}>${H`<div part="toolbar" class="fm-toolbar">
            <div class="fm-toolbar-left">
                <button class="btn" title="Up" on:click=${() => requestAnimationFrame(() => self.goUp())}><ui-icon icon="arrow-up"/></button>
                <button class="btn" title="Refresh" on:click=${() => requestAnimationFrame(() => self.navigate(self.inputValue || self.path || "/"))}><ui-icon icon="arrow-clockwise"/></button>
            </div>
            <div class="fm-toolbar-center"><form style="display: contents;" onsubmit="return false;">
                <input class="address c2-surface" autocomplete="off" type="text" name="address" value=${self.path || "/"} />
            </form></div>
            <div class="fm-toolbar-right">
                <button class="btn" title="Add" on:click=${() => requestAnimationFrame(() => self.requestUpload?.())}><ui-icon icon="upload"/></button>
                <button class="btn" title="Paste" on:click=${() => requestAnimationFrame(() => self.requestPaste?.())}><ui-icon icon="clipboard"/></button>
                <button class="btn" title="Use" on:click=${() => requestAnimationFrame(() => self.requestUse?.())}><ui-icon icon="hand-withdraw"/></button>
            </div>
        </div>`}${content}</div>`;
	};
};
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid-rows"
})], FileManager.prototype, "gridRowsEl", void 0);
__decorate([property({
	source: "query-shadow",
	name: ".fm-grid"
})], FileManager.prototype, "gridEl", void 0);
__decorate([property({
	source: "attr",
	name: "sidebar"
})], FileManager.prototype, "sidebar", void 0);
__decorate([property({ source: "inline-size" })], FileManager.prototype, "inlineSize", void 0);
FileManager = __decorate([defineElement("ui-file-manager")], FileManager);
//#endregion
//#region shared/fest/fl-ui/index.ts
/**
* FL.UI - UI Components Library
*
* This is the default entry point that uses veela-advanced for styling.
*
* Entry points by style variant:
* - `fest/fl-ui` - Default (veela-advanced)
* - `fest/fl-ui/core` - Basic styles only (no veela)
* - `fest/fl-ui/veela` - Alias for veela-advanced
* - `fest/fl-ui/veela-basic` - Veela basic styles
* - `fest/fl-ui/veela-advanced` - Veela advanced styles
* - `fest/fl-ui/veela-beercss` - Beer CSS compatible styles
*
* @example
* ```ts
* // Default (veela-advanced)
* import { Button, Card } from "fest/fl-ui";
*
* // With specific variant
* import { Button } from "fest/fl-ui/veela-basic";
* ```
*/
(async () => {
	await loader();
	await loadInlineStyle(styles_default);
})()?.catch?.(() => void 0);
//#endregion
export { initializeAppCanvasLayer as a, showToast as c, openUnifiedContextMenu as i, UIElement as l, FileManagerContent_default as n, setAppWallpaper as o, closeUnifiedContextMenu as r, initToastReceiver as s, FileManager as t, __decorate as u };
