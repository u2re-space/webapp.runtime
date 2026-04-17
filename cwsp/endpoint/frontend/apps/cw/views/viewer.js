import { h as loadAsAdopted, v as removeAdopted } from "../fest/dom.js";
import { r as affected, u as ref } from "../fest/object.js";
import { t as requestOpenView } from "./api.js";
import { C as provide, I as defineElement, S as openDirectory, V as H, d as isBase64Like, f as normalizeDataAsset, p as parseDataUrl, u as decodeBase64ToBytes } from "../com/app3.js";
import { o as ensureStyleSheet, s as reinitializeRegistry } from "../fest/icon.js";
import { t as __decorate } from "../chunks/decorate.js";
import { r as loadSettings } from "../com/service11.js";
import { i as writeText } from "../core/clipboard.js";
import { t as purify } from "../vendor/dompurify.js";
import { t as renderMathInElement } from "../vendor/katex2.js";
import { t as createViewState } from "../chunks/types.js";
import { t as BaseElement_default } from "./base.js";
//#region src/frontend/views/viewer/index.scss?inline
var viewer_default = "@import \"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\";@layer tokens, markdown, overrides, print, print-breaks;@property --client-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --client-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-x{initial-value:0;syntax:\"<number>\";inherits:true}@property --page-y{initial-value:0;syntax:\"<number>\";inherits:true}@property --sp-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --sp-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ds-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rx{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --ry{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-x{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --rs-y{initial-value:0px;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-shift-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-x{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --limit-drag-y{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --bound-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-inline-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --initial-block-size{initial-value:100%;syntax:\"<length-percentage>\";inherits:true}@property --scroll-coef{syntax:\"<number>\";initial-value:1;inherits:true}@property --scroll-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --content-size{syntax:\"<number>\";initial-value:0;inherits:true}@property --max-size{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@keyframes i{to{transform:rotate(1turn)}}@keyframes j{0%{opacity:0;translate:0 10px}to{opacity:1}}@page{size:a4;margin:2rem;@bottom-center{content:counter(page);font-family:var(--print-font-family-sans);font-size:10pt}@top-right{content:\"UC\";font-family:var(--print-font-family-sans);font-size:10pt}}@page :first{margin-block:2cm 2.5cm;margin-inline:2cm}@page :left{margin-inline:2cm}@page :right{margin-inline:2cm}@page narrow{size:a5 portrait;margin:1.5cm}@page wide{size:a4 landscape;margin:2cm}@page letter{size:letter;margin:2.5cm 2cm}@page legal{size:legal;margin:2.5cm 2cm}@page professional{size:a4;margin:2.5cm 2cm;marks:crop cross;bleed:.25cm}@page booklet{size:a5;margin:1.5cm}@page draft{size:a4;margin:2cm 1.5cm}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=right]{margin-inline-start:auto;padding-inline-start:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=left]{margin-inline-end:auto;padding-inline-end:20px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[align=center]{margin-inline:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[width]{inline-size:attr(width px,auto)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img[height]{block-size:attr(height px,auto)}@layer tokens{:host,:root,:scope{--print-font-family:var(--font-family-serif,\"Times New Roman\",\"Liberation Serif\",\"Noto Serif\",serif);--print-font-family-sans:var(--font-family-sans,\"Inter\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif);--print-font-mono:var(--font-family-mono,\"Monaco\",\"Menlo\",\"Ubuntu Mono\",\"Liberation Mono\",monospace);--print-text-color:light-dark(#1a1a1a,#f3f4f6);--print-bg:light-dark(#fff,#111827);--print-border-color:light-dark(#d1d5db,#374151);--print-link-color:light-dark(#2563eb,#60a5fa)}}@layer markdown{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden]){--base-size-4:0.25em;--base-size-8:0.5em;--base-size-16:1em;--base-size-24:1.5em;--base-size-40:2.5em;--base-text-weight-normal:400;--base-text-weight-medium:500;--base-text-weight-semibold:600;--fontStack-monospace:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;--color-primary:light-dark(#5a7fff,#7ca7ff);--color-secondary:light-dark(#6b7280,#94a3b8);--color-accent:light-dark(#64748b,#94a3b8);--color-success:light-dark(#10b981,#34d399);--color-warning:light-dark(#f59e0b,#fbbf24);--color-error:light-dark(#ef4444,#f87171);--color-info:light-dark(#60a5fa,#93c5fd);--color-surface:light-dark(#fafbfc,#0f1419);--color-surface-container:light-dark(#f1f5f9,#1e293b);--color-surface-container-low:light-dark(#f8fafc,#0f172a);--color-surface-container-lowest:light-dark(#fafbfc,#0f1419);--color-surface-container-high:light-dark(#e2e8f0,#334155);--color-surface-container-highest:light-dark(#cbd5e1,#475569);--color-on-surface:light-dark(#1e293b,#f1f5f9);--color-on-surface-variant:light-dark(#64748b,#94a3b8);--color-on-primary:light-dark(#ffffff,#ffffff);--color-on-secondary:light-dark(#ffffff,#ffffff);--color-outline:light-dark(#cbd5e1,#475569);--color-outline-variant:light-dark(#94a3b8,#64748b);--hover:light-dark(#f1f5f9,#334155);--active:light-dark(#e2e8f0,#1e293b);--focus:light-dark(#dbeafe,#1e40af);--elev-0:0 0 0 0 rgba(0,0,0,0%);--elev-1:0 1px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.12);--elev-2:0 2px 4px 0 rgba(0,0,0,0.14),0 3px 6px 0 rgba(0,0,0,0.11);--elev-3:0 4px 6px 0 rgba(0,0,0,0.14),0 6px 12px 0 rgba(0,0,0,0.11);--elev-4:0 6px 8px 0 rgba(0,0,0,0.14),0 9px 18px 0 rgba(0,0,0,0.11);--motion-fast:140ms ease;--motion-normal:200ms ease;--motion-slow:300ms ease;--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.5rem;--space-2xl:2rem;--radius-xs:0.25rem;--radius-sm:0.375rem;--radius-md:0.5rem;--radius-lg:0.75rem;--radius-xl:1rem;--radius-full:9999px;--focus-outlineColor:var(--color-primary);--fgColor-default:var(--color-on-surface);--fgColor-muted:var(--color-on-surface-variant);--fgColor-accent:var(--color-accent);--fgColor-success:var(--color-success);--fgColor-attention:var(--color-warning);--fgColor-danger:var(--color-error);--fgColor-done:var(--color-info);--bgColor-default:var(--color-surface);--bgColor-muted:var(--color-surface-container);--bgColor-neutral-muted:var(--color-surface-container-high);--bgColor-attention-muted:var(--color-warning);--borderColor-default:var(--color-outline);--borderColor-muted:var(--color-outline-variant);--borderColor-neutral-muted:var(--color-outline);--borderColor-accent-emphasis:var(--color-primary);--borderColor-success-emphasis:var(--color-success);--borderColor-attention-emphasis:var(--color-warning);--borderColor-danger-emphasis:var(--color-error);--borderColor-done-emphasis:var(--color-info);--active-brightness:config(\"effects\",\"active-brightness\");--border-radius:config(\"shape\",\"border-radius\");--box-shadow:config(\"shape\",\"box-shadow\");--color-accent:light-dark(\"accent\");--color-bg:light-dark(\"bg\");--color-bg-secondary:light-dark(\"bg-secondary\");--color-link:light-dark(\"link\");--color-secondary:light-dark(\"secondary\");--color-secondary-accent:light-dark(\"secondary-accent\");--color-shadow:light-dark(\"shadow\");--color-table:light-dark(\"table\");--color-text:light-dark(\"text\");--color-text-secondary:light-dark(\"text-secondary\");--color-scrollbar:light-dark(\"scrollbar\");--font-family-emoji-flag-capable:config(\"typography\",\"font-family\",\"emoji\");--font-family:config(\"typography\",\"font-family\",\"sans\");--hover-brightness:config(\"effects\",\"hover-brightness\");--justify-important:config(\"layout\",\"justify-important\");--justify-normal:config(\"layout\",\"justify-normal\");--line-height:config(\"layout\",\"line-height\");--width-card:config(\"layout\",\"widths\",\"card\");--width-card-medium:config(\"layout\",\"widths\",\"card-medium\");--width-card-wide:config(\"layout\",\"widths\",\"card-wide\");--width-content:config(\"layout\",\"widths\",\"content\");--md-scrollbar-size:config(\"scrollbar\",\"size\")}@media print{:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])){background-color:initial;block-size:max-content;box-sizing:border-box;color-scheme:inherit;container-type:inline-size;display:block;inline-size:100%;margin:0;max-block-size:none;min-block-size:max(100%,100cqb);overflow:auto;padding:0;touch-action:manipulation;user-select:text}:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) *,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :after,:where(html,body):has(:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not([hidden])) :before{box-sizing:border-box}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:light-dark(#1f2328,#e6edf3);--md-fg-muted:light-dark(#656d76,#7d8590);--md-fg-accent:light-dark(#0969da,#2f81f7);--md-bg-default:light-dark(#ffffff,#0d1117);--md-bg-subtle:light-dark(#f6f8fa,#161b22);--md-bg-code:light-dark(#eff1f3,#25292f);--md-border-default:light-dark(#d0d7de,#30363d);--md-border-subtle:light-dark(#eff1f3,#21262d);--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;font-size:inherit;pointer-events:auto;scrollbar-color:var(--color-scrollbar) transparent;scrollbar-width:thin;touch-action:manipulation;user-select:text}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar{block-size:sass(10px);inline-size:sass(10px)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-thumb{background-color:var(--color-scrollbar);border-radius:9999px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)::-webkit-scrollbar-track{background-color:initial}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){background:var(--color-surface);block-size:stretch;box-shadow:var(--elev-1);color:var(--md-fg-default);color-scheme:inherit;display:flex;flex:1;flex-direction:column;font-family:var(--md-font-body,var(--print-font-family));font-size:16px;font-weight:400;line-height:1.4;overflow:auto;overflow-wrap:break-word;padding:var(--space-2xl) var(--space-xl);transition:box-shadow var(--motion-normal);word-wrap:break-word;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;contain:inline-size layout paint style;container-type:inline-size;isolation:isolate;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):hover{box-shadow:var(--elev-2)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref):focus-within{box-shadow:var(--focus-ring,var(--elev-2));outline:none}@container (max-inline-size: 768px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){border-radius:var(--radius-lg);box-shadow:none;padding:var(--space-xl) var(--space-lg)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-default);font-weight:600;letter-spacing:-.015em;line-height:1.25;margin-block:1.5em .5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5 tt,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6 tt{font-family:var(--md-font-mono);font-size:inherit}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid var(--md-border-subtle);padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:var(--md-fg-muted)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{margin-block:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{background-color:initial;color:var(--md-fg-accent);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;transition:color var(--motion-fast),text-decoration-thickness var(--motion-fast)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:hover{text-decoration-thickness:2px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:not([href]){color:inherit;text-decoration:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a:focus-visible{border-radius:var(--radius-sm);box-shadow:var(--focus-ring);outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{margin-block:0 1rem;padding-inline-start:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol ul,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{margin-block:0}@container (max-inline-size: 480px){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{padding-inline-start:var(--space-xl)}}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li{margin-block-end:.25em;overflow-wrap:break-word;word-break:normal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li+li{margin-block-start:.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li>p{margin-block-start:1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-type:disc}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul{list-style-type:circle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul ul ul{list-style-type:square}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol{list-style-type:decimal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=a]{list-style-type:lower-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=A]{list-style-type:upper-alpha}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=i]{list-style-type:lower-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol[type=I]{list-style-type:upper-roman}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{border-inline-start:.25em solid var(--md-border-default);color:var(--md-fg-muted);font-style:italic;margin:0 0 1rem;padding:0 1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote>:last-child{margin-block-end:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{font-family:var(--md-font-mono);font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background-color:var(--md-bg-code);border-radius:6px;font-size:85%;padding:.2em .4em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background-color:var(--md-bg-code);block-size:max-content!important;border-radius:6px;content-visibility:visible!important;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;font-size:85%;inline-size:stretch;line-height:1.45;margin-block:0 1rem;max-block-size:none!important;max-inline-size:stretch;min-block-size:max(100%,100cqb)!important;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;padding:1rem;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;block-size:max-content!important;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{block-size:max-content;border-collapse:collapse;border-spacing:0;contain:inline-size layout paint style;container-type:inline-size;display:table;inline-size:fit-content;margin-block-end:1rem;max-inline-size:stretch;overflow:auto}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tbody,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table thead{block-size:max-content;inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{block-size:max-content;border:1px solid var(--md-border-default);inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:6px 13px;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table th{background-color:var(--md-bg-subtle);block-size:max-content;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr{background-color:var(--md-bg-default);block-size:max-content;border-block-start:1px solid var(--md-border-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table tr:nth-child(2n){background-color:var(--md-bg-subtle)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table img{background-color:initial;block-size:auto;border-radius:0;inline-size:fit-content;margin:0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{background-color:var(--md-border-default);block-size:.25em;border:0;box-sizing:initial;margin-block:24px;overflow:hidden;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:before{content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr:after{clear:both;content:\"\";display:table}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{background-color:initial;block-size:auto;border-radius:var(--radius-md);border-style:none;box-sizing:initial;inline-size:fit-content;margin:var(--space-lg) 0;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) kbd{background-color:var(--md-bg-subtle);border:1px solid var(--md-border-default);border-radius:6px;box-shadow:inset 0 -1px 0 var(--md-border-default);color:var(--md-fg-default);display:inline-block;font-size:11px;line-height:10px;padding:3px 5px;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl{margin-block:var(--space-lg) 0;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dt{color:var(--md-fg-default);font-size:1em;font-style:italic;font-weight:600;margin-block-start:1rem;padding:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) dl dd{color:var(--color-on-surface-variant,var(--md-fg-muted));margin-block-end:1rem;margin-inline-start:0;padding:0 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details{display:block}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary{cursor:pointer;display:list-item}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) details summary h6{border-block-end:0;display:inline-block;margin:0;padding-block-end:0;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) math{math-style:compact;math-shift:compact;inline-size:fit-content;math-depth:auto-add;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) span{inline-size:fit-content;max-inline-size:stretch}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{contain:strict;inline-size:fit-content!important;max-inline-size:stretch!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input[type=checkbox]{accent-color:var(--color-primary,var(--md-fg-accent));margin-inline-end:var(--space-sm)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item{list-style-type:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .task-list-item input[type=checkbox]{margin:0 .2em .25em -1.6em;vertical-align:middle}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes{border-block-start:1px solid var(--md-border-default);color:var(--md-fg-muted);font-size:.75em;margin-block-start:2rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes ol{padding-inline-start:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li{position:relative}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target{color:var(--md-fg-default)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnotes li:target:before{border:2px solid var(--md-fg-accent);border-radius:6px;content:\"\";inset:-8px -8px -8px -24px;pointer-events:none;position:absolute}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote-ref a{color:var(--md-fg-accent);font-size:.8em;vertical-align:super}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert{border-inline-start:.25em solid var(--md-border-default);margin-block-end:1rem;padding:.5rem 1rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-note{border-color:var(--md-fg-accent)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-important{border-color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-warning{border-color:#bf8700}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-tip{border-color:#1a7f37}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-caution{border-color:#d1242f}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title{align-items:center;display:flex;font-weight:600;line-height:1;margin-block-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert .markdown-alert-title .octicon,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .markdown-alert.markdown-alert-title .octicon{margin-inline-end:.5rem}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon{display:inline-block;fill:currentColor;vertical-align:text-bottom}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji{display:inline-block;font-family:Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,sans-serif;font-size:1em;font-style:normal;font-weight:400;line-height:1;min-inline-size:1ch;vertical-align:-.075em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) g-emoji img{block-size:1em;inline-size:1em;object-fit:contain}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor{float:inline-start;line-height:1;margin-inline-start:-20px;padding-inline-end:4px}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .anchor:focus{outline:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link{color:var(--md-fg-muted);opacity:.5;visibility:hidden}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .octicon-link:hover{opacity:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) :is(h1,h2,h3,h4,h5,h6):hover .anchor .octicon-link{visibility:visible}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#6e7781}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#0550ae}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#cf222e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#0a3069}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#953800}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#8250df}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:var(--md-fg-default);font-size:1.1em;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none}.markdown-viewer-content{animation:j .3s ease-out}.markdown-viewer-raw{background:var(--color-surface);color:var(--color-on-surface);font-family:var(--print-font-mono);font-size:var(--text-sm,.875rem);line-height:1.5;margin:0;overflow:auto;padding:var(--space-xl);tab-size:2;white-space:pre}.viewer-header{align-items:center;background:var(--color-surface-container-high);display:flex;flex-shrink:0;gap:var(--space-lg);justify-content:space-between;padding:var(--space-lg) var(--space-xl)}@container (max-inline-size: 768px){.viewer-header{gap:var(--space-md);padding:var(--space-md) var(--space-lg)}}@container (max-inline-size: 480px){.viewer-header{align-items:stretch;flex-direction:column;gap:var(--space-sm)}}.viewer-header h3{font-size:var(--text-xl,1.25rem);font-weight:600;letter-spacing:-.025em;line-height:1.25;margin:0}.viewer-header .viewer-actions{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-sm)}@container (max-inline-size: 360px){.viewer-header .viewer-actions{overflow-block:hidden;overflow-inline:auto;padding-block-end:var(--space-xs);scrollbar-width:none}.viewer-header .viewer-actions::-webkit-scrollbar{display:none}}.viewer-btn{align-items:center;background:var(--color-surface-container);border:none;border-radius:var(--radius-lg);color:var(--color-on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-sm,.875rem);font-weight:500;gap:var(--space-xs);min-block-size:44px;padding:0;position:relative;transition:background var(--motion-fast),box-shadow var(--motion-fast),translate var(--motion-fast);white-space:nowrap}.viewer-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1);translate:0 -1px}.viewer-btn:active{box-shadow:none;translate:0}.viewer-btn:focus-visible{box-shadow:var(--focus-ring);outline:none}.viewer-btn.btn-icon{padding:var(--space-sm)}.viewer-btn.btn-icon ui-icon{flex-shrink:0;transition:color var(--motion-fast)}.viewer-btn.btn-icon:hover ui-icon{color:var(--color-primary)}@container (max-inline-size: 640px){.viewer-btn.btn-icon{padding:var(--space-xs)}.viewer-btn.btn-icon .btn-text{display:none}}.viewer-btn.loading{opacity:.7;pointer-events:none}.viewer-btn.loading:after{animation:i 1s linear infinite;block-size:16px;border:2px solid transparent;border-block-start-color:initial;border-radius:50%;content:\"\";inline-size:16px;margin-inline-start:var(--space-xs)}@media (prefers-color-scheme:dark){:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c{color:#8b949e}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-c1{color:#79c0ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-k{color:#ff7b72}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-s{color:#a5d6ff}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-v{color:#ffa657}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .pl-en{color:#d2a8ff}}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host),[data-hidden] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host){color-scheme:inherit;content-visibility:auto!important}[data-dragging] :where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host) :where(*){content-visibility:auto!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{color-scheme:inherit}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:flex}}}@layer overrides{:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}.katex math{font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;math-style:compact;text-transform:none;math-shift:compact;math-depth:auto-add}.footnote-backref,.footnote-ref{font-variant-caps:normal;font-variant-emoji:text;font-variant-ligatures:common-ligatures;font-variant-numeric:tabular-nums}.footnote-backref,.footnote-backref *,.footnote-ref,.footnote-ref *{inline-size:fit-content;max-inline-size:stretch;text-align:start}@media screen{:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-code-inline-bg:color-mix(in oklab,var(--md-bg-code) 88%,var(--md-bg-default));--md-code-inline-fg:var(--md-fg-default);--md-code-block-bg:var(--md-bg-code);--md-code-block-fg:var(--md-fg-default);--md-code-block-border:color-mix(in oklab,var(--md-border-default) 60%,transparent);text-rendering:auto;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto;color-scheme:inherit!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{user-select:auto;-webkit-user-drag:none;-webkit-touch-callout:default;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(0,0,0,0)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{hyphens:manual;text-align:start}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp:not(pre samp),:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt:not(pre tt){background:var(--md-code-inline-bg);border:0;box-shadow:none;color:var(--md-code-inline-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{background:var(--md-code-block-bg);border:1px solid var(--md-code-block-border);box-shadow:none;color:var(--md-code-block-fg)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre tt{background:transparent;border:0;box-shadow:none;color:inherit}}}@layer print{@media print{:where(:root,html,body){background-color:#fff!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;font-family:var(--print-font-family);font-size:12pt;font-variant-emoji:text;line-height:1.4;margin:0;overflow:visible!important;padding:0;print-color-adjust:economy;scrollbar-width:none}body{block-size:max-content!important;inline-size:100%!important;max-block-size:none!important;max-inline-size:100%!important;min-block-size:max(100%,100cqb)!important;scale:1!important;text-align:start;transform:none!important;zoom:1!important}:is(.katex,.katex:not(:has(math)) *,.katex :not(math) :not(math)){font-family:\"Noto Sans Math\",\"Cambria Math\",\"STIX Two Math\",\"Latin Modern Math\",var(--print-font-family),serif;font-variant:normal;font-variant-caps:normal;font-variant-ligatures:normal;text-transform:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref){--md-fg-default:#1f2328;--md-fg-muted:#656d76;--md-fg-accent:#0969da;--md-bg-default:#ffffff;--md-bg-subtle:#f6f8fa;--md-bg-code:#eff1f3;--md-border-default:#d0d7de;--md-border-subtle:#eff1f3;--md-font-body:\"Noto Serif\",\"Noto Serif Display\",\"PT Serif\",\"IBM Plex Serif\",\"Literata\",\"Merriweather\",\"Source Serif 4\",\"Georgia\",\"Cambria\",\"Palatino Linotype\",\"Times New Roman\",\"Times\",serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Noto Sans\",Helvetica,Arial,sans-serif,var(--font-family-emoji-flag-capable);--md-font-mono:\"ui-monospace\",\"SFMono-Regular\",\"SF Mono\",\"Menlo\",\"Consolas\",\"Liberation Mono\",\"monospace\";--md-radius:8px;background:#fff;block-size:max-content!important;border:none;box-shadow:none;color:#111;color-scheme:light;contain:none;container-type:normal;display:block!important;flex:none!important;font-family:var(--print-font-family);font-variant-emoji:text;inline-size:100%;margin:0;max-block-size:none!important;max-inline-size:100%;min-block-size:max(100%,100cqb)!important;overflow:visible!important;padding:0;scrollbar-width:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) *{background-color:initial;box-shadow:none;box-sizing:border-box;font-variant-emoji:text;max-inline-size:100%;text-shadow:none}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-btn,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .viewer-header{display:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#111;font-weight:700;line-height:1.25;orphans:2;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5:first-child,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1{font-size:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{font-size:1.5em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h3{font-size:1.25em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h4{font-size:1em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h5{font-size:.875em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{font-size:.85em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h1,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h2{border-block-end:1px solid #ccc;padding-block-end:.3em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) h6{color:#555}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) p{color:#111;hyphens:auto;orphans:3;text-align:justify;widows:3;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) b,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) strong{color:#111!important;filter:none;font-weight:700!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) em,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) i{color:#111!important;filter:none;font-style:italic!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a{color:#333!important;overflow-wrap:break-word;text-decoration:underline!important;word-break:break-word;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) a[href]:after{content:none!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) samp,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) tt{background:#f5f5f5;color:#111;filter:grayscale(1);font-family:var(--print-font-mono);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) code:not(pre code){block-size:max-content!important;border:1px solid #ddd;border-radius:.25em;contain:none!important;content-visibility:visible!important;hyphens:none;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;overflow-wrap:break-word;padding:.125em .25em;position:relative!important;word-break:break-word}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre{border:1px solid #ccc;border-radius:.5rem;flex-basis:max-content!important;flex-grow:1!important;flex-shrink:0!important;padding:1rem;white-space:pre-wrap;word-wrap:break-word;block-size:max-content!important;content-visibility:visible!important;inline-size:stretch;margin-block:1.2em;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;orphans:1;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre code{border-radius:0;color:inherit;font-size:inherit;margin:0;padding:0;white-space:pre;word-wrap:normal;background:transparent;block-size:max-content!important;border:0;contain:none!important;content-visibility:visible!important;inline-size:stretch;max-block-size:none!important;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden!important;overflow-block:hidden!important;overflow-inline:hidden!important;position:relative!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) blockquote{background:#fafafa;border-inline-start:4px solid #999;color:#333;filter:grayscale(1);font-style:italic;margin-block:1.2em;orphans:2;padding:.8em 1.2em;widows:2;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) table{border:1px solid #999;border-collapse:collapse;display:table;inline-size:100%!important;max-inline-size:100%;table-layout:fixed;word-wrap:break-word;filter:grayscale(1);margin-block:1.2em;orphans:1;overflow-wrap:break-word;widows:1}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) td,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{block-size:max-content;border:1px solid #999;color:#111;inline-size:fit-content;max-inline-size:stretch;overflow:hidden;overflow-wrap:break-word;padding:.5em .75em;text-align:start;vertical-align:top}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) th{background:#e5e5e5;color:#333;font-weight:600}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) hr{block-size:0;border:none;border-block-start:1px solid #ccc;filter:grayscale(1);margin-block:2em}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) img{block-size:auto;border-radius:0;display:block;filter:grayscale(1);image-rendering:pixelated;inline-size:fit-content;margin:1em auto;max-inline-size:stretch;object-fit:contain;object-position:center}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) svg *{fill:currentColor!important;stroke:currentColor!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ol,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) ul{list-style-position:outside;margin-block-end:1em;orphans:2;padding-inline-start:1.5rem;widows:2}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) li::marker{color:#666!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) input,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) select,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) textarea{background:#fff!important;border:1px solid #999!important;color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .highlight,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .mark{background:#e6e6e6!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .footnote,:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .reference{background:transparent!important;border-block-start:1px solid #ccc!important}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .katex{color:#111!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-]{background:#f8f8f8!important;filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) pre[class*=language-] *{filter:grayscale(1)}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-narrow{page:narrow}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-wide{page:wide}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-letter{page:letter}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-legal{page:legal}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-professional{page:professional}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-booklet{page:booklet}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref) .print-draft{page:draft}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:first-child{margin-block-start:0}:where(:host,.markdown-body,#markdown,md-view,#raw-md,.markdown-viewer,.print-view,.markdown-viewer-container .viewer-content .markdown-viewer-content,.cw-view-viewer__prose,:host):not(.katex,.footnote-ref,.footnote-backref)>:last-child{margin-block-end:0}.print-view{block-size:100cqb;inline-size:100%;margin:0;overflow-inline:hidden;padding:0}.print-content{box-sizing:border-box;font-size:14pt;hyphens:auto;inline-size:100%;line-height:1.6;margin:0;padding:2rem;text-align:justify;word-wrap:break-word;overflow-wrap:break-word}}}@layer print-breaks{@media print{:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote,hr){break-after:auto;break-before:auto;break-inside:avoid}li,tr{break-inside:avoid}:where(h1,h2,h3,h4,h5,h6):has(+:where(p,ul,ol,li,table,blockquote,pre,code)){break-after:avoid}:where(p,:is(h1,h2,h3,h4,h5,h6)):has(+:where(ul,ol)){break-after:avoid!important}:where(p,:is(h1,h2,h3,h4,h5,h6))+:where(ul,ol){break-before:avoid!important}:where(h1,h2,h3,h4,h5,h6):has(+:where(table,pre,code,blockquote)){break-after:avoid!important}:where(h1,h2,h3,h4,h5,h6)+:where(table,pre,code,blockquote){break-before:avoid!important}hr:has(+:where(h1,h2,h3,h4,h5,h6,p,pre,table,img,blockquote)){break-after:page!important}h1:first-of-type{break-before:avoid}:where(.pb,.np,.pagebreak,.newpage,.page-break,.new-page){background-color:initial;break-after:page;break-before:auto;break-inside:auto}.print-chapter{break-before:page}.print-section{break-before:avoid}:where(:heading,p,ol,ul)>:first-child{margin-block-start:0}:where(:heading,p,ol,ul)>:last-child{margin-block-end:0}}}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, view-transitions, overrides;@layer viewer.tokens{:root:has([data-view=viewer]),html:has([data-view=viewer]){--view-layout:\"flex\";--view-content-max-width:800px;--view-padding:clamp(1rem,3cqw,1.75rem);--view-font-size-base:1rem;--view-line-height-base:1.6;--view-prose-font-size:var(--text-base);--view-prose-line-height:1.75;--view-prose-heading-margin:var(--space-6);color-scheme:light dark;--view-toolbar-btn-pad-block:0.4rem;--view-toolbar-btn-pad-inline:0.65rem;--view-code-font-size:0.9em}}@layer viewer.base{.cw-view-viewer-shell{--viewer-shell-container-type:inline-size;--viewer-shell-contain:layout style paint;--viewer-shell-inline-size:100%;--viewer-shell-block-size:100%;block-size:var(--viewer-shell-block-size,100%);contain:var(--viewer-shell-contain,layout style paint);contain-intrinsic-size:auto 1000px;container-type:var(--viewer-shell-container-type,inline-size);inline-size:var(--viewer-shell-inline-size,100%);isolation:isolate;max-block-size:none;max-inline-size:none}.cw-view-viewer-shell,.view-viewer{box-sizing:border-box;display:flex;flex-direction:column;min-block-size:max(100%,100cqb);min-inline-size:0}.view-viewer{background-color:var(--view-bg);block-size:max-content;color:var(--view-fg);inline-size:100%;max-block-size:stretch;overflow:hidden}.cw-view-viewer-shell:not([data-raw]) .view-viewer{flex:0 0 auto}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default) .view-viewer,.cw-view-viewer-shell[data-raw]:not(:has(.cw-view-viewer__slot-default)) .view-viewer{flex:1 1 auto;min-block-size:0;min-inline-size:0}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default) .view-viewer__content{block-size:100%;display:flex;flex:1 1 auto;flex-direction:column;min-block-size:0;min-inline-size:0;overflow:hidden}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-raw,.cw-view-viewer-shell:has(.cw-view-viewer__slot-default)[data-raw] .cw-view-viewer__slot-default{display:none!important}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default>slot{block-size:100%;display:block;inline-size:100%;min-block-size:0;min-inline-size:0}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default>slot::slotted([data-render-target]){block-size:100%;display:block;inline-size:100%;max-block-size:none;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default)[data-raw] .cw-view-viewer__slot-raw{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default))[data-raw] .cw-view-viewer__prose{display:none!important}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)):not([data-raw]) .view-viewer__content{display:none}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)):not([data-raw]) .cw-view-viewer__prose{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default))[data-raw] .view-viewer__content{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer viewer.components{.view-viewer>cw-markdown-toolbar-frame{box-sizing:border-box;display:block;flex:0 0 auto;inline-size:100%;min-block-size:0;min-inline-size:0}.view-viewer__toolbar{--view-toolbar-icon-size:1.25rem;--view-toolbar-ph-icon-size:var(--view-toolbar-icon-size);--view-picon-fill:var(--color-on-surface,var(--view-fg));--view-picon-fill-hover:var(--color-primary,var(--color-on-surface,var(--view-fg)));--view-picon-fill-active:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 82%,var(--color-primary,#007acc) 18%);--view-picon-fill-disabled:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 40%,transparent);--view-toolbar-row-pad-block:0.2rem;--view-toolbar-row-pad-inline:0.2rem;--view-toolbar-gap:0.125rem;align-items:center;background:var(--view-toolbar-bg,var(--color-surface-container-high));border-block-end:none;box-shadow:0 10px 28px -22px color-mix(in oklab,var(--view-fg) 16%,transparent);display:grid;flex-shrink:0;gap:var(--view-toolbar-gap);grid-template-columns:max-content minmax(0,1fr) max-content;min-block-size:2rem;overflow-block:hidden;overflow-inline:auto;padding:.2rem .75rem;position:relative;scrollbar-color:transparent transparent;scrollbar-width:none;-webkit-overflow-scrolling:touch;box-sizing:border-box;contain:layout style paint;container-type:inline-size;inline-size:100%;max-inline-size:100%;min-inline-size:0;white-space:nowrap}.view-viewer__toolbar button.view-viewer__btn>ui-icon.view-viewer__toolbar-icon{box-sizing:border-box;order:-1;vertical-align:middle;--icon-size:var(--view-toolbar-ph-icon-size,1.25rem);--icon-padding:0;--icon-color:var(--view-picon-fill);aspect-ratio:1/1;block-size:1rem;inline-size:1rem;min-block-size:max-content;min-inline-size:max-content;pointer-events:none;transition:color var(--motion-fast,.12s ease)}.view-viewer__toolbar:before{background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);content:\"\";inset:0;pointer-events:none;position:absolute}.view-viewer__toolbar>*{position:relative;z-index:1}.view-viewer__toolbar::-webkit-scrollbar{display:none}@container (max-inline-size: 1024px){.view-viewer__toolbar{min-block-size:2.125rem;padding:.15rem}}@container (max-inline-size: 768px){.view-viewer__toolbar{min-block-size:2.25rem;padding:.15rem}}.view-viewer__toolbar-center{align-items:center;display:flex;flex:1 1 auto;justify-content:center;min-block-size:0;min-inline-size:0;padding-inline:.35rem;pointer-events:none}.view-viewer__toolbar-title{color:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 88%,transparent);display:block;font-size:var(--text-sm,.8125rem);font-weight:var(--font-weight-medium,500);letter-spacing:.02em;line-height:1.25;max-inline-size:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap}.view-viewer__toolbar-title:empty{display:none}.view-viewer__toolbar-left,.view-viewer__toolbar-right{align-items:center;display:flex;flex-basis:max-content;flex-grow:0;flex-shrink:0;flex-wrap:nowrap;gap:.15rem;inline-size:max-content;max-inline-size:100%;min-inline-size:0;overflow:hidden;padding:.1rem 0}.view-viewer__toolbar-left{justify-content:flex-start}.view-viewer__toolbar-right{justify-content:flex-end}.view-viewer__btn{align-content:safe center;align-items:safe center;appearance:none;background:var(--color-surface,transparent);border:none;border-radius:var(--view-toolbar-btn-radius,.625rem);color:var(--color-on-surface,var(--view-fg));cursor:pointer;display:inline-flex;font-family:inherit;font-size:var(--text-xs,.75rem);font-weight:var(--font-weight-medium,500);gap:.3rem;justify-content:safe center;justify-items:safe center;letter-spacing:.01em;line-height:1.2;min-block-size:max-content;padding-block:var(--view-toolbar-btn-pad-block,.375rem);padding-inline:var(--view-toolbar-btn-pad-inline,.5625rem);white-space:nowrap;-webkit-tap-highlight-color:transparent;box-sizing:border-box;contain:none;container-type:normal;flex-grow:0;overflow:visible;transition:background-color var(--motion-fast,.12s ease),color var(--motion-fast,.12s ease),box-shadow var(--motion-fast,.12s ease)}.view-viewer__btn,.view-viewer__btn span{flex-basis:max-content;flex-shrink:0;inline-size:max-content;min-inline-size:max-content}.view-viewer__btn span{display:inline-block;flex-grow:1;font-size:.625rem;font-weight:400;letter-spacing:.03em;line-height:1.15;max-inline-size:none;opacity:.88;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}.view-viewer__btn:hover{background:var(--color-surface-container-high,var(--view-btn-hover-bg))}.view-viewer__btn:hover span{opacity:1}.view-viewer__btn:hover>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-hover)}.view-viewer__btn:active{background:color-mix(in oklab,var(--color-surface-container-high,var(--view-btn-hover-bg)) 92%,var(--color-on-surface,currentColor) 8%)}.view-viewer__btn:active>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-active)}.view-viewer__btn:disabled>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-disabled);opacity:.55}.view-viewer__btn:focus-visible{box-shadow:var(--focus-ring,0 0 0 2px var(--color-primary,#007acc));outline:none}@container (max-inline-size: 1024px){.view-viewer__btn{gap:.2rem;min-block-size:1.75rem;padding-block:max(.3rem,var(--view-toolbar-btn-pad-block,.375rem));padding-inline:max(.45rem,var(--view-toolbar-btn-pad-inline,.5625rem))}}@container (max-inline-size: 768px){.view-viewer__btn{gap:0;min-block-size:1.875rem;min-inline-size:1.875rem;padding-block:var(--view-toolbar-btn-pad-block,.4rem);padding-inline:var(--view-toolbar-btn-pad-block,.4rem)}.view-viewer__btn span{display:none}}.view-viewer__md-loading{align-items:center;color:var(--view-fg);display:flex;font-size:.9rem;gap:.75rem;opacity:.9;padding:1.25rem 1rem}.view-viewer__md-loading:before{animation:k .75s linear infinite;block-size:1.25rem;border:2px solid var(--view-border);border-block-start-color:var(--view-link-color);border-radius:50%;content:\"\";flex-shrink:0;inline-size:1.25rem}.view-viewer__content{background-color:var(--view-bg);box-sizing:border-box;display:flex;flex-direction:column;inline-size:100%;min-inline-size:0;padding:0}.view-viewer__content.dragover{background-color:rgba(0,122,204,.05);outline:2px dashed rgba(0,122,204,.3);outline-offset:-8px}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)) .view-viewer__content{overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell.dragover{background-color:rgba(0,122,204,.05);outline:2px dashed rgba(0,122,204,.3);outline-offset:-8px}.cw-view-viewer-shell [data-render-target],.cw-view-viewer-shell [data-render-target] *,cw-view-viewer [data-render-target],cw-view-viewer [data-render-target] *{pointer-events:auto;user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}cw-view-viewer [data-render-target]{block-size:100%;box-sizing:border-box;display:block;max-block-size:none;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell .markdown-viewer-raw,.cw-view-viewer-shell pre[data-raw-target]{background-color:var(--view-bg);border:none;color:var(--view-fg);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.8125rem;line-height:1.5;margin:0;padding:var(--view-padding);white-space:pre-wrap;word-break:break-word}.cw-view-viewer-shell .cw-view-viewer__prose.markdown-body,.cw-view-viewer-shell [data-render-target].markdown-body,cw-view-viewer [data-render-target].cw-view-viewer__prose,cw-view-viewer [data-render-target].markdown-body{background-color:var(--view-bg);color:var(--view-fg);padding:var(--view-padding)}.cw-view-viewer-shell .markdown-body h1,cw-view-viewer .markdown-body h1{color:var(--view-fg);font-size:clamp(1.5rem,4.5cqw,2.125rem);font-weight:600;letter-spacing:-.02em;line-height:1.2;margin-block:0 .75em}}@layer viewer.utilities{@keyframes k{to{transform:rotate(1turn)}}@media print{.cw-view-viewer-shell,.view-viewer{block-size:max-content!important;display:block!important;inline-size:100%!important;max-block-size:none!important;min-block-size:max(100%,100cqb)!important;overflow:visible!important}.view-viewer{background:transparent!important;color:#000!important}.view-viewer__toolbar{display:none!important}.view-viewer__content{padding:0!important}.cw-view-viewer__prose,.view-viewer__content{block-size:max-content!important;display:block!important;inline-size:100%!important;max-block-size:none!important;min-block-size:max(100%,100cqb)!important;overflow:visible!important}.cw-view-viewer__prose{contain:none!important}.cw-view-viewer__slot-default,.cw-view-viewer__slot-raw,.markdown-body,.markdown-viewer-content,.result-content,[data-render-target]{block-size:max-content!important;display:block!important;inline-size:100%!important;max-block-size:none!important;min-block-size:max(100%,100cqb)!important;overflow:visible!important}.markdown-body,.markdown-viewer-content,.result-content,[data-render-target]{background:transparent!important;color:#000!important;opacity:1!important;visibility:visible!important}}}@layer layer.view.common, layer.view.viewer;@layer layer.view.common{:where([data-cw-view-host=true]){block-size:100%;display:block;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer layer.view.viewer{.cw-view-viewer-shell{display:flex;flex-direction:column;max-block-size:none;min-block-size:max(100%,100cqb)}.cw-view-viewer-shell,.view-viewer{block-size:100%;inline-size:100%;min-inline-size:0}.view-viewer{background:var(--view-bg,var(--color-surface,light-dark(#f4f6fa,#060d17)));color:var(--view-fg,var(--color-on-surface,light-dark(#1a1a1a,#e5e7eb)));display:grid;flex:1 1 0%;grid-template-rows:[toolbar-row] max-content [content-row] minmax(0,1fr);min-block-size:0}.view-viewer__toolbar{align-items:center;background:var(--view-toolbar-bg,light-dark(color-mix(in oklab,var(--color-surface-container,#e2e8f0) 88%,transparent),color-mix(in oklab,var(--color-surface-container,#0f1a2b) 88%,transparent)));border-block-end:none;box-shadow:0 12px 32px -20px color-mix(in oklab,#000 45%,transparent);box-sizing:border-box;display:flex;gap:.5rem;grid-row:toolbar-row;justify-content:space-between;min-inline-size:100%;padding:.45rem .65rem}.view-viewer__toolbar-left,.view-viewer__toolbar-right{align-items:center;display:inline-flex;gap:.4rem;min-inline-size:0}.view-viewer__toolbar-center{align-items:center;display:flex;flex:1 1 auto;justify-content:center;min-inline-size:0;padding-inline:.35rem;pointer-events:none}.view-viewer__toolbar-title{color:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 88%,transparent);display:block;font-size:.8125rem;font-weight:500;line-height:1.25;max-inline-size:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap}.view-viewer__toolbar-title:empty{display:none}.view-viewer__toolbar-group{align-items:center;display:inline-flex;gap:.25rem;min-inline-size:0}.view-viewer__btn{align-items:center;background:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 6%,transparent);border:none;border-radius:var(--view-toolbar-btn-radius,.625rem);color:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 82%,transparent);cursor:pointer;display:inline-flex;font:inherit;font-size:.78rem;gap:.35rem;line-height:1;padding-block:var(--view-toolbar-btn-pad-block,.4375rem);padding-inline:var(--view-toolbar-btn-pad-inline,.6875rem);transition:background-color var(--motion-fast,.14s ease),color var(--motion-fast,.14s ease);white-space:nowrap}.view-viewer__btn:hover{background:color-mix(in oklab,var(--color-on-surface,light-dark(#334155,#e5e7eb)) 11%,transparent);color:var(--color-on-surface,light-dark(#0f172a,#f8fafc))}.view-viewer__toolbar-icon{block-size:1rem;inline-size:1rem}.view-viewer__content{grid-row:content-row;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;position:relative}}@layer view.viewer{.viewer-loading-indicator{align-items:center;backdrop-filter:blur(8px);background-color:oklch(from var(--surface-container-high) l c h/.9);border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);inset-block-start:var(--padding-md);inset-inline-end:var(--padding-md);opacity:0;padding:var(--padding-xs) var(--padding-sm);pointer-events:none;position:absolute;transform:translateY(-4px);transition:opacity var(--transition-fast),transform var(--transition-fast);z-index:4}.viewer-loading-indicator[data-state=loading]{opacity:1;pointer-events:auto;transform:translateY(0)}.viewer-loading-indicator .loading-spinner{animation:viewer-spinner .8s linear infinite;block-size:1rem;border:2px solid oklch(from var(--primary) l c h/.2);border-block-start-color:var(--primary);border-radius:var(--radius-full);inline-size:1rem}.viewer-loading-indicator .loading-text{font-family:var(--font-family-base)}.viewer-loading-indicator .loading-text:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}.viewer-loading-indicator .loading-text{color:var(--on-surface-variant)}.viewer-section{position:relative}.viewer-section[data-loading-state=loading]:before{animation:viewer-skeleton-shimmer 1.5s ease-in-out infinite;background:linear-gradient(90deg,transparent 0,oklch(from var(--primary) l c h/.05) 50%,transparent 100%);background-size:200% 100%;border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute;z-index:1}.viewer-section[data-loading-state=loaded] .viewer-tab-content-body{animation:viewer-fade-in .3s ease-out}.viewer-section[data-loading-state=error]:after{background-color:oklch(from var(--error) l c h/.1);border-radius:var(--radius-md);color:var(--error);content:attr(data-error);font-family:var(--font-family-base);inset-block-end:var(--padding-md);inset-inline:var(--padding-md);padding:var(--padding-sm) var(--padding-md);position:absolute}.viewer-section[data-loading-state=error]:after:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}.viewer-section[data-loading-state=error]:after{text-align:center;z-index:4}[data-type=bonuses],[data-type=contacts],[data-type=services],[data-type=tasks]{align-items:start;column-fill:balance;contain:strict;content-visibility:auto;display:grid;grid-auto-flow:row;grid-auto-rows:minmax(0,max-content);grid-template-columns:repeat(auto-fill,minmax(260px,1fr));inline-size:stretch;max-inline-size:stretch;overflow-y:auto;perspective:1000;transform:translateZ(0)}[data-type=bonuses]>*,[data-type=contacts]>*,[data-type=services]>*,[data-type=tasks]>*{animation:viewer-slide-in .25s ease-out backwards}[data-type=bonuses]>:first-child,[data-type=contacts]>:first-child,[data-type=services]>:first-child,[data-type=tasks]>:first-child{animation-delay:30ms}[data-type=bonuses]>:nth-child(2),[data-type=contacts]>:nth-child(2),[data-type=services]>:nth-child(2),[data-type=tasks]>:nth-child(2){animation-delay:60ms}[data-type=bonuses]>:nth-child(3),[data-type=contacts]>:nth-child(3),[data-type=services]>:nth-child(3),[data-type=tasks]>:nth-child(3){animation-delay:90ms}[data-type=bonuses]>:nth-child(4),[data-type=contacts]>:nth-child(4),[data-type=services]>:nth-child(4),[data-type=tasks]>:nth-child(4){animation-delay:.12s}[data-type=bonuses]>:nth-child(5),[data-type=contacts]>:nth-child(5),[data-type=services]>:nth-child(5),[data-type=tasks]>:nth-child(5){animation-delay:.15s}[data-type=bonuses]>:nth-child(6),[data-type=contacts]>:nth-child(6),[data-type=services]>:nth-child(6),[data-type=tasks]>:nth-child(6){animation-delay:.18s}[data-type=bonuses]>:nth-child(7),[data-type=contacts]>:nth-child(7),[data-type=services]>:nth-child(7),[data-type=tasks]>:nth-child(7){animation-delay:.21s}[data-type=bonuses]>:nth-child(8),[data-type=contacts]>:nth-child(8),[data-type=services]>:nth-child(8),[data-type=tasks]>:nth-child(8){animation-delay:.24s}[data-type=bonuses]>:nth-child(9),[data-type=contacts]>:nth-child(9),[data-type=services]>:nth-child(9),[data-type=tasks]>:nth-child(9){animation-delay:.27s}[data-type=bonuses]>:nth-child(10),[data-type=contacts]>:nth-child(10),[data-type=services]>:nth-child(10),[data-type=tasks]>:nth-child(10){animation-delay:.3s}[data-type=bonuses]>:nth-child(11),[data-type=contacts]>:nth-child(11),[data-type=services]>:nth-child(11),[data-type=tasks]>:nth-child(11){animation-delay:.33s}[data-type=bonuses]>:nth-child(12),[data-type=contacts]>:nth-child(12),[data-type=services]>:nth-child(12),[data-type=tasks]>:nth-child(12){animation-delay:.36s}section{background-color:initial}ui-file-manager{backdrop-filter:blur(1rem);background-color:oklch(from --c2-surface(.15,var(--current,currentColor)) l c h/.9)}ui-tabbed-box{block-size:stretch;gap:0;grid-column:1/-1;grid-row:1/-1;inline-size:stretch}@container (max-inline-size: 1024px){ui-tabbed-box{grid-column:1/-1;order:3}}ui-tabbed-box[data-loading=loading] .viewer-tab-content{opacity:.7;pointer-events:none}ui-tabbed-box .viewer-tab-content{border-radius:0;display:grid;gap:var(--gap-xs);padding:var(--padding-sm);--md3-elevation-level:1;align-content:start;backdrop-filter:blur(1rem);background-color:oklch(from --c2-surface(.15,var(--current,currentColor)) l c h/.9);block-size:stretch;box-shadow:none;box-sizing:border-box;contain:strict;content-visibility:auto;inline-size:stretch;max-block-size:none;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow-wrap:break-word;overflow-x:hidden;overflow-y:auto;perspective:1000;pointer-events:auto;scrollbar-gutter:auto;text-overflow:ellipsis;touch-action:manipulation;transform:translateZ(0);transition:opacity var(--transition-normal)}ui-tabbed-box .viewer-tab-content:empty:after{color:var(--on-surface-variant);content:\"No items to display\";display:flex;font-family:var(--font-family-base);min-block-size:120px;place-content:center;place-items:center}ui-tabbed-box .viewer-tab-content:empty:after:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}ui-tabbed-box .viewer-tab-content:empty:after{opacity:.6}ui-tabbed-box .viewer-tab-content .viewer-tab-content-header{font-family:var(--font-family-base);text-align:center}ui-tabbed-box .viewer-tab-content .viewer-tab-content-header:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}ui-tabbed-box .viewer-tab-content .viewer-tab-content-header{background-color:initial;border-radius:var(--radius-sm);color:color-mix(in oklch,var(--on-surface,currentColor) var(--surface-opacity-muted,8%),transparent);padding:var(--padding-xs);pointer-events:none}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body{block-size:max-content;box-shadow:none;content-visibility:auto;display:grid;gap:var(--gap-xs);inline-size:stretch;max-block-size:none;max-inline-size:stretch;min-block-size:0;min-inline-size:0;perspective:1000;pointer-events:none;transform:translateZ(0)}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>*{animation:viewer-slide-in .2s ease-out backwards}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:first-child{animation-delay:40ms}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(2){animation-delay:80ms}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(3){animation-delay:.12s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(4){animation-delay:.16s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(5){animation-delay:.2s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(6){animation-delay:.24s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(7){animation-delay:.28s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body>:nth-child(8){animation-delay:.32s}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loading]:empty{display:grid;min-block-size:80px;place-content:center}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loading]:empty:after{animation:viewer-spinner .8s linear infinite;block-size:32px;border:2px solid oklch(from var(--primary) l c h/.2);border-block-start-color:var(--primary);border-radius:var(--radius-full);content:\"\";inline-size:32px}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=empty]:empty,ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loaded]:empty{display:grid;min-block-size:80px;place-content:center}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=empty]:empty:after,ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loaded]:empty:after{color:var(--on-surface-variant);content:\"No items to display\";font-family:var(--font-family-base)}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=empty]:empty:after:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active),ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loaded]:empty:after:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=empty]:empty:after,ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=loaded]:empty:after{animation:viewer-fade-in .3s ease-out;opacity:.6}ui-tabbed-box .viewer-tab-content .viewer-tab-content-body[data-load-state=pending]:empty{display:grid;min-block-size:40px;opacity:.4;place-content:center}.subgroup{animation:viewer-slide-in .25s ease-out backwards;text-align:center}.subgroup,.subgroup .subgroup-items{display:grid;gap:var(--gap-xs);pointer-events:none}.subgroup .subgroup-items{padding:var(--padding-xs)}.subgroup .subgroup-items>*{animation:viewer-slide-in .2s ease-out backwards}.subgroup .subgroup-items>:first-child{animation-delay:25ms}.subgroup .subgroup-items>:nth-child(2){animation-delay:50ms}.subgroup .subgroup-items>:nth-child(3){animation-delay:75ms}.subgroup .subgroup-items>:nth-child(4){animation-delay:.1s}.subgroup .subgroup-items>:nth-child(5){animation-delay:125ms}.subgroup .subgroup-items>:nth-child(6){animation-delay:.15s}.subgroup .subgroup-items>:nth-child(7){animation-delay:175ms}.subgroup .subgroup-items>:nth-child(8){animation-delay:.2s}.subgroup .subgroup-items>:nth-child(9){animation-delay:225ms}.subgroup .subgroup-items>:nth-child(10){animation-delay:.25s}.subgroup .subgroup-items>:nth-child(11){animation-delay:275ms}.subgroup .subgroup-items>:nth-child(12){animation-delay:.3s}.subgroup .subgroup-items:empty{display:none}.subgroup .subgroup-header{font-family:var(--font-family-base);text-transform:uppercase}.subgroup .subgroup-header:where(:-webkit-autofill,:autofill,:-webkit-autofill:hover,:-webkit-autofill:focus,:-webkit-autofill:active){font-family:var(--font-family-base)}.subgroup .subgroup-header{backdrop-filter:blur(2px);background-color:oklch(from var(--surface-color) l c h/.6);border-radius:var(--radius-sm);color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-primary,92%),transparent);inline-size:fit-content;inset-block-start:0;justify-self:center;padding:var(--padding-xs);pointer-events:none;position:sticky;text-align:center;z-index:3}.subgroup[data-collapsed=true] .subgroup-items{content-visibility:hidden;display:none}.viewer-section,.viewer-tab-content,.viewer-tab-content-body{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){.viewer-section,.viewer-tab-content,.viewer-tab-content-body{scroll-behavior:auto}.viewer-section *,.viewer-section :after,.viewer-section :before,.viewer-tab-content *,.viewer-tab-content :after,.viewer-tab-content :before,.viewer-tab-content-body *,.viewer-tab-content-body :after,.viewer-tab-content-body :before{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}.viewer-tab-content-body>*{contain-intrinsic-size:auto 80px;content-visibility:auto}}@view-transition{navigation:auto}@layer view-transitions{[data-shell-content]>[data-view]:not([hidden]){view-transition-name:active-view}[data-shell] nav[role=navigation]{contain:layout;view-transition-name:shell-nav}:root{--vt-duration:260ms;--vt-easing:cubic-bezier(0.4,0,0.2,1);--vt-old-anim:vt-fade-out;--vt-new-anim:vt-fade-in}:root[data-vt-direction=forward]{--vt-old-anim:vt-slide-out-left;--vt-new-anim:vt-slide-in-right}:root[data-vt-direction=backward]{--vt-old-anim:vt-slide-out-right;--vt-new-anim:vt-slide-in-left}::view-transition-old(active-view){animation:var(--vt-old-anim) var(--vt-duration) var(--vt-easing) both}::view-transition-new(active-view){animation:var(--vt-new-anim) var(--vt-duration) var(--vt-easing) both}::view-transition-new(shell-nav),::view-transition-old(shell-nav){animation:none;mix-blend-mode:normal}@media (prefers-reduced-motion:reduce){::view-transition-new(active-view),::view-transition-old(active-view){animation-duration:.001ms!important}}}@layer tokens{:root{--view-nav-height-base:56px;--view-nav-height:48px;--view-sidebar-width:240px;--view-sidebar-collapsed:64px;--view-status-height:24px;--view-toolbar-height:40px;--view-tab-height:36px;--view-content-gutter:1rem;--view-max-width:100%;--view-content-max-width:960px;--view-padding:var(--space-4);--view-padding-x:var(--space-6);--view-padding-y:var(--space-4);--view-accent:var(--color-primary);--view-accent-hover:var(--color-primary-hover);--view-bg:var(--color-surface);--view-bg-secondary:var(--color-surface-elevated);--view-border:var(--color-border);--view-border-color:var(--color-border);--view-divider-color:var(--color-border);--view-fg:var(--color-on-surface);--view-fg-muted:var(--color-on-surface-muted);--view-hover-bg:var(--color-surface-hover);--view-nav-bg:var(--color-surface-elevated);--view-nav-border:var(--color-outline-variant);--view-nav-fg:var(--color-on-surface);--view-selected-bg:var(--color-surface-active);--view-selected-border:var(--color-border-focus);--view-sidebar-bg:var(--color-surface);--view-sidebar-fg:var(--color-on-surface);--view-status-bg:var(--color-surface-elevated);--view-status-fg:var(--color-text-secondary);--view-transition:var(--transition-normal) var(--ease-in-out)}html{background-color:var(--color-background,Canvas)}:is(html,body):has([data-shell=minimal] [data-view=workcenter]){--view-sidebar-position:\"right\";--view-toolbar-alignment:\"end\"}:is(html,body):has([data-shell=faint] [data-view=viewer]){--view-tab-active:true}:is(:root,html):has([data-shell=faint] [data-view=viewer]){--view-content-max-width:720px;--view-padding-x:var(--space-8)}:is(:root,html):has([data-shell=base] [data-view=viewer]),:is(:root,html):has([data-shell=minimal] [data-view=viewer]){--view-content-max-width:800px;--view-padding-x:var(--space-6)}:is(:root,html):has([data-shell=base] [data-view=airpad]),:is(:root,html):has([data-shell=minimal] [data-view=airpad]){--view-content-max-width:none;--view-padding:0;--view-padding-x:0;--view-padding-y:0}:is(:root,html):has([data-shell=raw] [data-view=home]){--view-content-max-width:100%;--view-padding:var(--space-4)}:is(:root,html):has([data-view=debug]){--view-content-max-width:none;--view-debug-bg:#1a1a2e;--view-debug-border:#333366;--view-debug-fg:#00ff00;--view-debug-font:var(--font-mono);--view-debug-font-size:var(--text-sm);--view-padding:var(--space-4)}@media (prefers-contrast:more){:root{--view-fg:light-dark(#000,#fff);--view-nav-border:light-dark(#000,#fff)}}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0s;--transition-normal:0s;--transition-slow:0s}}@media (max-inline-size:768px){:root{--view-padding:var(--space-3);--view-padding-x:var(--space-4);--view-padding-y:var(--space-3)}:is(:root,html):has([data-shell=faint]){--view-sidebar-width:0}:is(:root,html):has([data-shell=minimal]){--view-nav-height:52px}body:has([data-shell=faint]){margin-inline-start:0}}@media (max-inline-size:480px){:root{--view-padding:var(--space-2);--view-padding-x:var(--space-3)}}@media print{:root{--view-bg:white;--view-fg:black;--view-nav-height:0;--view-sidebar-width:0;--view-status-height:0}body:has([data-shell]){margin:0;padding:0}}}@layer shell{[data-shell-content]>[hidden],[data-shell-content][data-current-view=airpad]>[data-view]:not([data-view=airpad]),[data-shell-content][data-current-view=editor]>[data-view]:not([data-view=editor]),[data-shell-content][data-current-view=explorer]>[data-view]:not([data-view=explorer]),[data-shell-content][data-current-view=history]>[data-view]:not([data-view=history]),[data-shell-content][data-current-view=home]>[data-view]:not([data-view=home]),[data-shell-content][data-current-view=print]>[data-view]:not([data-view=print]),[data-shell-content][data-current-view=settings]>[data-view]:not([data-view=settings]),[data-shell-content][data-current-view=viewer]>[data-view]:not([data-view=viewer]),[data-shell-content][data-current-view=workcenter]>[data-view]:not([data-view=workcenter]),[data-shell-content][data-current-view]>:not([data-view]){display:none!important}}@layer components{.custom-instructions-editor,.custom-instructions-panel{display:grid;gap:var(--gap-md);inline-size:stretch;max-inline-size:stretch;text-align:start}.custom-instructions-editor .cip-select-row,.custom-instructions-panel .cip-select-row{display:grid;gap:var(--gap-xs)}.custom-instructions-editor .cip-select-row .cip-select,.custom-instructions-panel .cip-select-row .cip-select{inline-size:stretch}.custom-instructions-editor .cip-list,.custom-instructions-panel .cip-list{display:grid;gap:var(--gap-sm)}.custom-instructions-editor .cip-empty,.custom-instructions-panel .cip-empty{border-radius:var(--radius-md);color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-muted,60%),transparent);font-size:var(--font-sm);padding:var(--padding-lg);text-align:center}.custom-instructions-editor .cip-item,.custom-instructions-panel .cip-item{border-radius:var(--radius-md);padding:var(--padding-md)}.custom-instructions-editor .cip-item.is-active,.custom-instructions-panel .cip-item.is-active{border:1px solid var(--primary-opacity-default)}.custom-instructions-editor .cip-item .cip-item-header,.custom-instructions-panel .cip-item .cip-item-header{align-items:center;display:flex;gap:var(--gap-md);justify-content:space-between}.custom-instructions-editor .cip-item .cip-item-label,.custom-instructions-panel .cip-item .cip-item-label{flex:1;font-size:var(--font-sm);font-weight:var(--font-weight-medium);min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.custom-instructions-editor .cip-item .cip-item-actions,.custom-instructions-panel .cip-item .cip-item-actions{align-items:center;display:flex;flex-shrink:0;gap:var(--gap-xs)}.custom-instructions-editor .cip-item .cip-badge,.custom-instructions-panel .cip-item .cip-badge{background-color:var(--primary-opacity-default);border-radius:var(--radius-full);color:var(--on-primary,currentColor);font-size:var(--font-xs);font-weight:var(--font-weight-medium);letter-spacing:.03em;padding:var(--padding-xs) var(--padding-sm);text-transform:uppercase}.custom-instructions-editor .cip-item .cip-item-preview,.custom-instructions-panel .cip-item .cip-item-preview{border-radius:var(--radius-sm);color:color-mix(in oklch,var(--on-surface,currentColor) var(--text-tint-secondary,74%),transparent);font-size:var(--font-xs);line-height:1.5;margin-block-start:var(--gap-sm);padding:var(--padding-sm);white-space:pre-wrap;word-break:break-word}.custom-instructions-editor .cip-item .cip-edit-form,.custom-instructions-panel .cip-item .cip-edit-form{display:grid;gap:var(--gap-sm);margin-block-start:var(--gap-md)}.custom-instructions-editor .cip-add-form,.custom-instructions-panel .cip-add-form{border:1px dashed var(--outline-opacity-default);border-radius:var(--radius-md);display:grid;gap:var(--gap-sm);padding:var(--padding-md)}.custom-instructions-editor .cip-form-actions,.custom-instructions-panel .cip-form-actions{display:flex;gap:var(--gap-xs);justify-content:flex-end}.custom-instructions-editor .cip-toolbar,.custom-instructions-panel .cip-toolbar{border-radius:var(--radius-md);display:flex;gap:var(--gap-sm);justify-content:center;padding:var(--padding-sm)}.custom-instructions-editor .cip-input,.custom-instructions-editor .cip-textarea,.custom-instructions-panel .cip-input,.custom-instructions-panel .cip-textarea{font-family:inherit;inline-size:stretch}.custom-instructions-editor .cip-textarea,.custom-instructions-panel .cip-textarea{min-block-size:4rem;resize:vertical}.custom-instructions-editor .ci-row,.custom-instructions-panel .ci-row{display:flex;flex-direction:row;gap:var(--space-sm,4px);place-content:center;align-content:stretch;justify-content:space-between;place-items:center;align-items:start}.custom-instructions-editor .ci-header,.custom-instructions-panel .ci-header{block-size:max-content;display:grid;flex-basis:min-content;flex-grow:1;flex-shrink:1;gap:var(--spacing-xs,4px);inline-size:fit-content;max-inline-size:max-content;min-inline-size:min-content}.custom-instructions-editor .ci-header h4,.custom-instructions-panel .ci-header h4{color:var(--color-on-surface);font-size:var(--text-sm,13px);font-weight:var(--font-weight-semibold,600);margin:0}.custom-instructions-editor .ci-header .ci-desc,.custom-instructions-panel .ci-header .ci-desc{color:var(--color-on-surface-variant);font-size:var(--text-xs,11px);line-height:1.5;margin:0;opacity:.8}.custom-instructions-editor .ci-active-select,.custom-instructions-panel .ci-active-select{flex-basis:min-content;flex-grow:0;flex-shrink:1;inline-size:fit-content;max-inline-size:stretch;min-inline-size:min-content}.custom-instructions-editor .ci-active-select label,.custom-instructions-panel .ci-active-select label{display:grid;font-size:var(--text-xs,12px);gap:var(--spacing-xs,6px);inline-size:fit-content}.custom-instructions-editor .ci-active-select label span,.custom-instructions-panel .ci-active-select label span{color:var(--color-on-surface-variant);opacity:.9}.custom-instructions-editor .ci-active-select select,.custom-instructions-panel .ci-active-select select{flex-basis:fit-content;flex-grow:1;flex-shrink:1;inline-size:calc-size(max-content,clamp(8rem,size,100%));max-inline-size:stretch;min-inline-size:fit-content}.custom-instructions-editor .ci-list,.custom-instructions-panel .ci-list{display:grid;gap:var(--spacing-sm,8px)}.custom-instructions-editor .ci-list .ci-empty,.custom-instructions-panel .ci-list .ci-empty{background:var(--color-surface-container);border-radius:var(--radius-md,10px);color:var(--color-on-surface-variant);font-size:var(--text-xs,12px);opacity:.7;padding:var(--spacing-md,16px);text-align:center}.custom-instructions-editor .ci-item,.custom-instructions-panel .ci-item{background:var(--color-surface-container);border:1px solid transparent;border-radius:var(--radius-md,10px);padding:var(--spacing-sm,10px)}.custom-instructions-editor .ci-item.active,.custom-instructions-panel .ci-item.active{background:color-mix(in oklab,var(--color-primary) 8%,var(--color-surface-container));border-color:color-mix(in oklab,var(--color-primary) 25%,transparent)}.custom-instructions-editor .ci-item .ci-item-header,.custom-instructions-panel .ci-item .ci-item-header{align-items:center;display:flex;gap:var(--spacing-xs,8px);justify-content:space-between}.custom-instructions-editor .ci-item .ci-item-label,.custom-instructions-panel .ci-item .ci-item-label{color:var(--color-on-surface);flex:1;font-size:var(--text-xs,12px);font-weight:var(--font-weight-medium,500);min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.custom-instructions-editor .ci-item .ci-item-actions,.custom-instructions-panel .ci-item .ci-item-actions{align-items:center;display:flex;flex-shrink:0;gap:var(--spacing-xs,4px)}.custom-instructions-editor .ci-item .ci-badge,.custom-instructions-panel .ci-item .ci-badge{background:var(--color-surface-container-highest);border-radius:var(--radius-sm,6px);color:var(--color-on-surface-variant);font-size:var(--text-xs,10px);font-weight:var(--font-weight-medium,500);letter-spacing:.03em;padding:2px 8px;text-transform:uppercase}.custom-instructions-editor .ci-item .ci-badge.active,.custom-instructions-panel .ci-item .ci-badge.active{background:color-mix(in oklab,var(--color-primary) 20%,transparent);color:var(--color-primary)}.custom-instructions-editor .ci-item .ci-item-preview,.custom-instructions-panel .ci-item .ci-item-preview{background:var(--color-surface-container-highest);border-radius:var(--radius-sm,8px);color:var(--color-on-surface-variant);font-size:var(--text-xs,11px);line-height:1.5;margin-block-start:var(--spacing-xs,8px);padding:var(--spacing-xs,8px);white-space:pre-wrap;word-break:break-word}.custom-instructions-editor .ci-item .ci-edit-form,.custom-instructions-panel .ci-item .ci-edit-form{display:grid;gap:var(--spacing-xs,8px);margin-block-start:var(--spacing-sm,10px)}.custom-instructions-editor .ci-input,.custom-instructions-editor .ci-textarea,.custom-instructions-panel .ci-input,.custom-instructions-panel .ci-textarea{--view-control-padding-y:var(--spacing-xs,8px);--view-control-padding-x:var(--spacing-sm,10px);--view-control-radius:var(--radius-sm,8px);--view-control-font-size:var(--text-xs,12px);--view-control-bg:var(--color-surface-container-highest);--view-control-hover-bg:var(--color-surface-container-high);--view-control-focus-bg:var(--color-surface-container-high);--view-control-border-color:var(--color-outline-variant);--view-control-focus-border-color:var(--color-primary)}.custom-instructions-editor .ci-textarea,.custom-instructions-panel .ci-textarea{line-height:1.5;min-block-size:60px;resize:vertical}.custom-instructions-editor .ci-add-actions,.custom-instructions-editor .ci-edit-actions,.custom-instructions-panel .ci-add-actions,.custom-instructions-panel .ci-edit-actions{display:flex;gap:var(--spacing-xs,6px);justify-content:flex-end}.custom-instructions-editor .ci-add-form,.custom-instructions-panel .ci-add-form{background:color-mix(in oklab,var(--color-surface-container-high) 50%,transparent);border:1px dashed var(--color-outline-variant);border-radius:var(--radius-md,10px);display:grid;gap:var(--spacing-xs,8px);padding:var(--spacing-sm,12px)}.custom-instructions-editor .ci-actions,.custom-instructions-panel .ci-actions{display:flex;flex-wrap:wrap;gap:var(--spacing-xs,8px);place-content:center;place-items:center}.custom-instructions-editor .btn.small,.custom-instructions-editor .btn.tiny,.custom-instructions-panel .btn.small,.custom-instructions-panel .btn.tiny{background:transparent;border:1px solid var(--color-outline-variant);color:var(--color-on-surface);cursor:pointer;transition:all var(--motion-fast)}.custom-instructions-editor .btn.small:hover,.custom-instructions-editor .btn.tiny:hover,.custom-instructions-panel .btn.small:hover,.custom-instructions-panel .btn.tiny:hover{background:color-mix(in oklab,var(--color-on-surface) 5%,transparent)}.custom-instructions-editor .btn.tiny,.custom-instructions-panel .btn.tiny{border-radius:var(--radius-sm,6px);font-size:var(--text-xs,10px);padding:4px 8px}.custom-instructions-editor .btn.tiny.danger,.custom-instructions-panel .btn.tiny.danger{border-color:var(--color-error,#c62828);color:var(--color-error,#c62828)}.custom-instructions-editor .btn.tiny.danger:hover,.custom-instructions-panel .btn.tiny.danger:hover{background:color-mix(in oklab,var(--color-error,#c62828) 15%,transparent)}.custom-instructions-editor .btn.small,.custom-instructions-panel .btn.small{border-radius:var(--radius-sm,8px);font-size:var(--text-xs,11px);padding:6px 12px}.custom-instructions-editor .form-select,.custom-instructions-editor__select,.custom-instructions-panel .form-select,.custom-instructions-panel__select{appearance:auto;cursor:pointer}.custom-instructions-editor .form-checkbox,.custom-instructions-editor__checkbox,.custom-instructions-panel .form-checkbox,.custom-instructions-panel__checkbox{align-items:center;cursor:pointer;display:flex;gap:.625rem}.custom-instructions-editor .form-checkbox input[type=checkbox],.custom-instructions-editor__checkbox input[type=checkbox],.custom-instructions-panel .form-checkbox input[type=checkbox],.custom-instructions-panel__checkbox input[type=checkbox]{accent-color:var(--color-primary);block-size:18px;border-radius:var(--radius-xs,4px);cursor:pointer;inline-size:18px}.custom-instructions-editor .form-checkbox span,.custom-instructions-editor__checkbox span,.custom-instructions-panel .form-checkbox span,.custom-instructions-panel__checkbox span{font-size:var(--text-sm,.875rem)}.view-error,.view-loading{align-items:center;display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem;text-align:center}.view-loading{color:var(--view-fg);opacity:.6}.view-loading__spinner{animation:k .8s linear infinite;block-size:32px;border:3px solid rgba(128,128,128,.2);border-block-start-color:var(--color-primary,#007acc);border-radius:50%;inline-size:32px}.view-error__icon{font-size:3rem}.view-error__title{color:#d32f2f;font-size:1.25rem;font-weight:600;margin:0}.view-error__message{color:var(--view-fg);margin:0;opacity:.7}.view-error__retry{background-color:var(--color-primary,#007acc);border:none;border-radius:6px;color:#ffffff;cursor:pointer;font-size:.875rem;font-weight:500;padding:.5rem 1rem}.view-error__retry:hover{filter:brightness(1.1)}}@layer base{@keyframes i{to{transform:rotate(1turn)}}@keyframes l{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}}@layer layout{.toolbar{align-items:center;background:var(--color-surface-container-high);block-size:max-content;box-shadow:var(--elev-1);contain:strict;display:flex;inline-size:stretch;justify-content:space-between;max-inline-size:none;min-block-size:4rem;min-inline-size:fit-content;overflow:hidden auto;padding:var(--space-md) var(--space-xl);position:relative;scrollbar-color:transparent;scrollbar-width:none;-webkit-overflow-scrolling:touch;grid-row:toolbar-row}.toolbar:before{background:linear-gradient(90deg,color-mix(in oklab,var(--color-primary) 2%,transparent) 0,transparent 50%,color-mix(in oklab,var(--color-primary) 2%,transparent) 100%);content:\"\";inset:0;pointer-events:none;position:absolute}.toolbar>*{position:relative;z-index:1}.toolbar::-webkit-scrollbar{display:none}.toolbar .left,.toolbar .right{align-items:center;display:flex;gap:var(--space-md)}.toolbar .left .toolbar-btn,.toolbar .right .toolbar-btn{align-items:center;background:var(--color-surface);block-size:max-content;border-radius:var(--radius-md);color:var(--color-on-surface);cursor:pointer;display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs);inline-size:max-content;min-block-size:36px;min-inline-size:calc-size(fit-content,max(size,25px) + .5rem + var(--icon-size,1rem));padding:var(--space-xs) var(--space-md);transition:all var(--motion-fast);white-space:nowrap}.toolbar .left .toolbar-btn:hover,.toolbar .right .toolbar-btn:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1);transform:translateY(-1px)}.toolbar .left .toolbar-btn:active,.toolbar .right .toolbar-btn:active{box-shadow:none;transform:translateY(0)}.toolbar .left .toolbar-btn:focus-visible,.toolbar .right .toolbar-btn:focus-visible{box-shadow:var(--focus-ring);outline:none}.toolbar .left .toolbar-btn.toolbar-btn-icon,.toolbar .right .toolbar-btn.toolbar-btn-icon{padding:var(--space-xs)}.toolbar .left .toolbar-btn.toolbar-btn-icon ui-icon,.toolbar .right .toolbar-btn.toolbar-btn-icon ui-icon{transition:color var(--motion-fast)}.toolbar .left .toolbar-btn.toolbar-btn-icon:hover ui-icon,.toolbar .right .toolbar-btn.toolbar-btn-icon:hover ui-icon{color:var(--color-primary)}@container (max-inline-size: 1024px){.toolbar .left .toolbar-btn.toolbar-btn-icon .toolbar-btn-text,.toolbar .right .toolbar-btn.toolbar-btn-icon .toolbar-btn-text{display:none}}.toolbar .left .toolbar-btn.primary,.toolbar .right .toolbar-btn.primary{background:var(--color-primary);color:var(--color-on-primary)}.toolbar .left .toolbar-btn.primary:hover,.toolbar .right .toolbar-btn.primary:hover{background:color-mix(in oklab,var(--color-primary) 85%,black)}.toolbar .left .toolbar-btn.loading,.toolbar .right .toolbar-btn.loading{opacity:.7;pointer-events:none}.toolbar .left .toolbar-btn.loading:after,.toolbar .right .toolbar-btn.loading:after{animation:i 1s linear infinite;block-size:14px;border:2px solid transparent;border-block-start:2px solid currentColor;border-radius:50%;content:\"\";inline-size:14px;margin-inline-start:var(--space-xs)}@container (max-inline-size: 1024px){.toolbar .left,.toolbar .right{gap:var(--space-sm)}.toolbar .left .toolbar-btn,.toolbar .right .toolbar-btn{font-size:var(--text-xs);min-block-size:32px;min-inline-size:calc-size(fit-content,max(size,32px) + .5rem + var(--icon-size,1rem));padding:0}}@container (max-inline-size: 768px){.toolbar .left,.toolbar .right{gap:var(--space-xs)}.toolbar .left .toolbar-btn,.toolbar .right .toolbar-btn{min-block-size:28px;min-inline-size:calc-size(fit-content,max(size,28px) + .5rem + var(--icon-size,1rem));padding:2px var(--space-xs)}.toolbar .left .toolbar-btn-icon,.toolbar .right .toolbar-btn-icon{padding:4px}}@container (max-inline-size: 480px){.toolbar .left,.toolbar .right{gap:2px}}@container (max-inline-size: 1024px){.toolbar{min-block-size:3.5rem;padding:var(--space-sm) var(--space-lg)}}@container (max-inline-size: 768px){.toolbar{min-block-size:3rem;padding:var(--space-xs) var(--space-md)}}@container (max-inline-size: 480px){.toolbar{flex-direction:column;min-block-size:2.75rem;padding:var(--space-xs)}}.content{background-color:initial;block-size:stretch;box-shadow:var(--elev-1);contain:strict;flex:1;grid-row:content-row;overflow:auto;padding:0;position:relative;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin;transition:all var(--motion-normal)}.content:before{border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute}.content>*{position:relative;z-index:1}.content:focus-within,.content:hover{box-shadow:var(--elev-2)}.content::-webkit-scrollbar{block-size:6px;inline-size:6px}.content::-webkit-scrollbar-track{background:transparent}.content::-webkit-scrollbar-thumb{background:var(--color-outline-variant);border-radius:3px}.content::-webkit-scrollbar-thumb:hover{background:var(--color-outline)}.content:has(>.view-settings){display:flex;flex-direction:column;min-block-size:0;overflow:hidden}.content>.view-settings{align-self:stretch;flex:1 1 auto;min-block-size:0}.content,.view-settings,.workcenter-view{animation:l .4s ease-out;block-size:stretch}.status{align-items:center;background:var(--color-surface-container-low);color:var(--color-on-surface-variant);display:flex;font-size:var(--text-xs);font-weight:var(--font-weight-medium);gap:var(--space-sm);inline-size:stretch;max-inline-size:stretch;min-block-size:20px;padding:var(--space-sm) var(--space-xl)}.status:before{content:\"ℹ️\";font-size:var(--text-sm);opacity:.7}.status.error ui-icon,.status.success ui-icon,.status.warning ui-icon{margin-inline-end:var(--space-xs)}.status.success{background:color-mix(in oklab,var(--color-success) 10%,var(--color-surface-container-low));color:var(--color-success)}.status.warning{background:color-mix(in oklab,var(--color-warning) 10%,var(--color-surface-container-low));color:var(--color-warning)}.status.error{background:color-mix(in oklab,var(--color-error) 10%,var(--color-surface-container-low));color:var(--color-error)}@container (max-inline-size: 1024px){.status{padding:var(--space-xs) var(--space-lg)}}@container (max-inline-size: 768px){.status{font-size:11px;padding:var(--space-xs) var(--space-md)}}@container (max-inline-size: 480px){.status{gap:var(--space-xs);padding:var(--space-xs)}}.file-input{display:none}@media (max-inline-size:768px){.status{font-size:11px;padding:var(--space-xs) var(--space-md)}}}@layer components{.markdown-editor{block-size:100%;display:grid;gap:var(--space-xl);grid-template-columns:1fr 300px}.editor-section{display:flex;flex-direction:column;gap:var(--space-md)}.preview-section{background:var(--color-surface-container);border-radius:var(--radius-lg);box-shadow:var(--elev-1);overflow:auto;padding:var(--space-lg)}.history-view{display:flex;flex-direction:column;gap:var(--space-lg);max-block-size:none;overflow:auto}.history-header{align-items:center;background:var(--color-surface-container);border-radius:var(--radius-xl);box-shadow:var(--elev-1);display:flex;justify-content:space-between;margin-block-end:0;padding:var(--space-lg)}.history-header h3{color:var(--color-on-surface);font-size:var(--text-2xl);font-weight:var(--font-weight-bold);margin:0}.history-header .history-actions{align-items:center;display:flex;gap:var(--space-sm)}.history-header .history-actions .btn{background:var(--color-surface-container);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);font-weight:var(--font-weight-medium);padding:var(--space-sm) var(--space-lg)}.history-header .history-actions .btn:hover{background:var(--color-surface-container-high)}.history-stats{background:var(--color-surface-container);border-radius:var(--radius-xl);box-shadow:var(--elev-1);padding:var(--space-lg)}.stats-grid{display:grid;gap:var(--space-md);grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}.stats-grid .stat-item{align-items:center;background:var(--color-surface-container-low);border-radius:var(--radius-lg);display:flex;flex-direction:column;gap:var(--space-xs);padding:var(--space-md)}.stats-grid .stat-item .stat-value{color:var(--color-on-surface);font-size:var(--text-2xl);font-weight:var(--font-weight-bold)}.stats-grid .stat-item .stat-value.success{color:var(--color-primary)}.stats-grid .stat-item .stat-value.error{color:var(--color-error,#d32f2f)}.stats-grid .stat-item .stat-label{color:var(--color-on-surface-variant);font-size:var(--text-sm);text-align:center}.history-list{display:flex;flex-direction:column;gap:var(--space-sm)}.history-item{align-items:center;background:var(--color-surface-container);border-radius:var(--radius-xl);box-shadow:var(--elev-0);cursor:pointer;display:flex;gap:var(--space-md);padding:var(--space-lg)}.history-item:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1)}.history-item .meta{align-items:center;display:flex;font-size:12px;gap:10px;opacity:.9}.history-item .actions{display:flex;gap:8px;justify-content:flex-end}.tag{align-items:center;background:var(--color-surface-container-high);block-size:22px;border-radius:var(--radius-full);display:inline-flex;font-weight:700;padding:0 8px}.tag.ok{background:color-mix(in oklab,var(--color-success) 18%,transparent)}.tag.fail{background:color-mix(in oklab,var(--color-error) 18%,transparent)}.empty{opacity:.8;padding:12px}.markdown-editor-container,.markdown-viewer-container{block-size:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:var(--space-lg);max-block-size:none}.markdown-editor-container>*,.markdown-viewer-container>*{box-sizing:border-box}.editor-header,.viewer-header{align-items:center;background:var(--color-surface-container);display:flex;justify-content:space-between;padding:var(--space-md)}.editor-header h3,.viewer-header h3{color:var(--color-on-surface);font-size:var(--text-xl);font-weight:var(--font-weight-semibold);margin:0}.viewer-header{margin-block-end:var(--space-lg)}.editor-actions,.viewer-actions{display:flex;gap:var(--space-sm)}.editor-layout{display:grid;flex:1;gap:var(--space-lg);grid-template-columns:1fr 1fr;min-block-size:0}.editor-panel,.preview-panel{background:var(--color-surface-container);display:flex;flex-direction:column;overflow:hidden}.editor-toolbar{background:var(--color-surface-container-high);display:flex;gap:var(--space-md);padding:var(--space-md)}.toolbar-group{display:flex;gap:var(--space-xs)}.markdown-textarea{background:transparent;border:none;color:var(--color-on-surface);flex:1;font-family:var(--font-family-mono);font-size:var(--text-base);line-height:var(--leading-relaxed);min-block-size:400px;outline:none;padding:var(--space-lg);resize:none}.markdown-textarea::placeholder{color:var(--color-on-surface-variant);opacity:.7}.editor-footer{align-items:center;background:var(--color-surface-container-low);display:flex;justify-content:space-between;padding:var(--space-md)}.editor-stats{color:var(--color-on-surface-variant);display:flex;font-size:var(--text-sm);gap:var(--space-lg)}.editor-stats span{font-weight:var(--font-weight-medium)}.editor-mode{border-radius:var(--radius-lg);display:flex;gap:var(--space-xs);overflow:hidden}.editor-mode .btn{border:none;border-radius:0;margin:0}.editor-mode .btn.active{background:var(--color-primary);color:var(--color-on-primary)}.preview-panel .preview-header{background:var(--color-surface-container-high);padding:var(--space-md)}.preview-panel .preview-header h4{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0}.preview-panel .preview-content{background:var(--color-surface);flex:1;overflow:auto;padding:var(--space-lg)}.viewer-content{background:var(--color-surface-container);border-radius:var(--radius-xl);flex:1;overflow:auto;padding:var(--space-lg)}.modal-overlay{align-items:center;backdrop-filter:blur(8px);background:color-mix(in oklab,black 60%,transparent);display:flex;inset:0;justify-content:center;padding:var(--space-lg);position:fixed;z-index:5}.modal-content{background:var(--color-surface-container-low);border-radius:var(--radius-2xl);box-shadow:var(--elev-3);inline-size:100%;max-block-size:85vh;max-inline-size:700px;overflow:auto;padding:var(--space-2xl)}.card-header,.modal-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:var(--space-lg);padding-block-end:var(--space-md)}.card-title,.modal-title{color:var(--color-on-surface);font-size:var(--text-xl);font-weight:var(--font-weight-semibold);letter-spacing:.01em;margin:0}.modal-title{font-size:var(--text-2xl)}.modal-body{margin-block-end:var(--space-xl)}.card-actions,.modal-actions{display:flex;gap:var(--space-md);justify-content:flex-end}.card{background:var(--color-surface-container);border-radius:var(--radius-xl);box-shadow:var(--elev-1);padding:var(--space-xl);transition:all var(--motion-normal)}.card-content{flex:1}.card-actions{gap:var(--space-sm);margin-block-start:var(--space-lg);padding-block-start:var(--space-md)}.form-group{display:flex;flex-direction:column;gap:var(--space-sm)}.form-label{color:var(--color-on-surface);font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-end:var(--space-xs)}.form-field{position:relative}.form-field.error{--form-field-state-color:var(--color-error)}.form-field.success{--form-field-state-color:var(--color-success)}.form-field.error .form-input,.form-field.error .form-select,.form-field.error .form-textarea,.form-field.success .form-input,.form-field.success .form-select,.form-field.success .form-textarea{background:color-mix(in oklab,var(--form-field-state-color) 5%,var(--color-surface-container-high))}.form-field.error .form-input:focus,.form-field.error .form-select:focus,.form-field.error .form-textarea:focus,.form-field.success .form-input:focus,.form-field.success .form-select:focus,.form-field.success .form-textarea:focus{box-shadow:0 0 0 3px color-mix(in oklab,var(--form-field-state-color) 35%,transparent)}.ci-input,.ci-select,.ci-textarea,.cip-input,.cip-select,.cip-textarea,.form-input,.form-select,.form-textarea,select{--_view-control-padding-y:var(--view-control-padding-y,var(--space-md));--_view-control-padding-x:var(--view-control-padding-x,var(--space-lg));--_view-control-radius:var(--view-control-radius,var(--radius-lg));--_view-control-font-size:var(--view-control-font-size,var(--text-base));--_view-control-bg:var(--view-control-bg,var(--color-surface-container-high));--_view-control-hover-bg:var(--view-control-hover-bg,var(--color-surface-container-highest));--_view-control-focus-bg:var(--view-control-focus-bg,var(--color-surface-container));--_view-control-border-color:var(--view-control-border-color,transparent);--_view-control-focus-border-color:var(--view-control-focus-border-color,transparent);accent-color:var(--color-primary);background:var(--_view-control-bg);border:1px solid var(--_view-control-border-color);border-radius:var(--_view-control-radius);box-shadow:var(--elev-0);color:var(--color-on-surface);font-family:var(--font-family);font-size:var(--_view-control-font-size);font-weight:var(--font-weight-medium);inline-size:100%;outline:none;padding:var(--_view-control-padding-y) var(--_view-control-padding-x)}.ci-input:hover,.ci-select:hover,.ci-textarea:hover,.cip-input:hover,.cip-select:hover,.cip-textarea:hover,.form-input:hover,.form-select:hover,.form-textarea:hover,select:hover{background:var(--_view-control-hover-bg);box-shadow:var(--elev-1)}.ci-input:focus,.ci-select:focus,.ci-textarea:focus,.cip-input:focus,.cip-select:focus,.cip-textarea:focus,.form-input:focus,.form-select:focus,.form-textarea:focus,select:focus{background:var(--_view-control-focus-bg);border-color:var(--_view-control-focus-border-color);box-shadow:var(--focus-ring)}.ci-input::placeholder,.ci-select::placeholder,.ci-textarea::placeholder,.cip-input::placeholder,.cip-select::placeholder,.cip-textarea::placeholder,.form-input::placeholder,.form-select::placeholder,.form-textarea::placeholder,select::placeholder{color:var(--color-on-surface-variant);opacity:.7}.ci-input:disabled,.ci-select:disabled,.ci-textarea:disabled,.cip-input:disabled,.cip-select:disabled,.cip-textarea:disabled,.form-input:disabled,.form-select:disabled,.form-textarea:disabled,select:disabled{background:var(--color-surface-container-low);cursor:not-allowed;opacity:.5}.btn,button:not(.toolbar-btn){align-content:safe center;align-items:safe center;background:var(--color-surface-container-high);border:1px solid transparent;border-radius:var(--radius-lg);box-shadow:var(--elev-0);color:var(--color-on-surface);cursor:pointer;display:inline-flex;flex-basis:max-content;flex-grow:1;flex-shrink:0;font-family:var(--font-family);font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs);inline-size:max-content;justify-content:safe center;justify-items:safe center;line-height:1.2;max-inline-size:none;min-inline-size:max-content;position:relative;transition:all var(--motion-fast)}.btn:hover,button:not(.toolbar-btn):hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1)}.btn:focus-visible,button:not(.toolbar-btn):focus-visible{box-shadow:var(--focus-ring);outline:none}.btn:disabled,button:not(.toolbar-btn):disabled{cursor:not-allowed;opacity:.5}.form-textarea{font-family:var(--font-family-mono);line-height:var(--leading-relaxed);min-block-size:120px;resize:vertical}.form-textarea.monospace{font-family:var(--font-family-mono);font-size:var(--text-sm)}.ci-select,.cip-select,.form-select,select{appearance:none;appearance:base-select;block-size:max-content;cursor:pointer;display:inline-grid;flex-direction:row;flex-wrap:nowrap;grid-template-columns:[content] minmax(max-content,1fr) [icon] minmax(1.5rem,max-content);grid-template-rows:minmax(0,max-content);inline-size:max-content;overflow:hidden;padding-inline:var(--space-sm);padding-inline-start:var(--space-md);place-content:center;place-items:center;justify-items:start;min-inline-size:fit-content;text-align:start;text-wrap:nowrap;word-break:keep-all}.ci-select::-ms-expand,.cip-select::-ms-expand,.form-select::-ms-expand,select::-ms-expand{display:none}.ci-select option,.cip-select option,.form-select option,select option{background:var(--color-surface);color:var(--color-on-surface)}.ci-select::picker-icon,.cip-select::picker-icon,.form-select::picker-icon,select::picker-icon{aspect-ratio:1/1;background-color:var(--color-on-surface);block-size:1.5em;box-sizing:border-box;content:\"\";display:inline-flex;grid-column:icon;inline-size:1.5em;mask-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\");mask-position:center center;mask-repeat:no-repeat;mask-size:1.5em 1.5em;overflow:hidden;place-content:center;place-items:center;text-align:center}.form-checkbox,.form-radio{align-items:center;color:var(--color-on-surface);cursor:pointer;display:flex;font-size:var(--text-base);font-weight:var(--font-weight-medium);gap:.625rem}.form-checkbox span,.form-radio span{font-size:var(--text-sm,.875rem)}.form-checkbox input[type=checkbox],.form-checkbox input[type=radio],.form-radio input[type=checkbox],.form-radio input[type=radio]{accent-color:var(--color-primary);appearance:none;aspect-ratio:1;background:var(--color-surface-container-highest);block-size:20px;border:none;box-shadow:var(--elev-0);cursor:pointer;inline-size:20px;min-block-size:unset;position:relative;transition:all var(--motion-fast)}.form-checkbox input[type=checkbox]:focus,.form-checkbox input[type=radio]:focus,.form-radio input[type=checkbox]:focus,.form-radio input[type=radio]:focus{box-shadow:var(--focus-ring);outline:none}.form-checkbox input[type=checkbox]:disabled,.form-checkbox input[type=radio]:disabled,.form-radio input[type=checkbox]:disabled,.form-radio input[type=radio]:disabled{cursor:not-allowed;opacity:.5}.form-checkbox input[type=checkbox]{border-radius:var(--radius-sm)}.form-checkbox input[type=checkbox]:checked{background:var(--color-primary);box-shadow:var(--elev-1)}.form-checkbox input[type=checkbox]:checked:after{color:var(--color-on-primary);content:\"✓\";font-size:12px;font-weight:700;inset-block-start:50%;inset-inline-start:50%;position:absolute;transform:translate(-50%,-50%)}.form-radio input[type=radio]{border-radius:50%}.form-radio input[type=radio]:checked{background:var(--color-primary);box-shadow:var(--elev-1)}.form-radio input[type=radio]:checked:after{background:var(--color-on-primary);block-size:8px;border-radius:50%;content:\"\";inline-size:8px;inset-block-start:50%;inset-inline-start:50%;position:absolute;transform:translate(-50%,-50%)}.form-error,.form-hint,.form-success{font-size:var(--text-sm);font-weight:var(--font-weight-medium);margin-block-start:var(--space-xs)}.form-error,.form-success{align-items:center;display:flex;gap:var(--space-xs)}.form-error{color:var(--color-error)}.form-error:before{content:\"⚠\";font-size:var(--text-base)}.form-success{color:var(--color-success)}.form-success:before{content:\"✓\";font-size:var(--text-base)}.form-hint{color:var(--color-on-surface-variant);opacity:.8}@media (max-inline-size:1024px){.editor-layout{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.editor-toolbar{flex-wrap:wrap}.toolbar-group{flex:1;justify-content:center;min-inline-size:120px}.markdown-editor{grid-template-rows:1fr auto}.markdown-editor,.settings-group{grid-template-columns:1fr}.editor-panel,.preview-panel{max-block-size:50vh}}@media (max-inline-size:768px){.editor-footer{align-items:stretch;flex-direction:column;gap:var(--space-md)}.editor-stats{flex-wrap:wrap}.editor-mode,.editor-stats{justify-content:center}.toolbar-group{align-items:stretch;flex-direction:column}.toolbar-group .btn{justify-content:center}.modal-content{margin:var(--space-sm);padding:var(--space-lg)}.editor-header,.viewer-header{align-items:flex-start;flex-direction:column;gap:var(--space-md)}.editor-actions,.viewer-actions{inline-size:100%;justify-content:stretch}.form-input,.form-select,.form-textarea{font-size:var(--text-sm);padding:var(--space-md)}.form-textarea{min-block-size:100px}.form-checkbox,.form-radio{font-size:var(--text-sm)}}@media (max-inline-size:480px){.editor-toolbar{padding:var(--space-sm)}.markdown-textarea{font-size:var(--text-sm)}.history-item,.markdown-textarea,.viewer-content{padding:var(--space-md)}.history-item{align-items:flex-start;flex-direction:column;gap:var(--space-sm)}.card{padding:var(--space-lg)}.modal-content{margin:var(--space-xs);padding:var(--space-md)}.markdown-editor-container,.markdown-viewer-container{gap:var(--space-md);padding:var(--space-sm)}}}@layer utilities{.grid{display:grid;gap:var(--space-lg)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.grid-auto-fit{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.grid-auto-fill{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.flex{display:flex}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.justify-end{justify-content:flex-end}.gap-sm{gap:var(--space-sm)}.gap-md{gap:var(--space-md)}.gap-lg{gap:var(--space-lg)}.gap-xl{gap:var(--space-xl)}.p-sm{padding:var(--space-sm)}.p-md{padding:var(--space-md)}.p-lg{padding:var(--space-lg)}.p-xl{padding:var(--space-xl)}.m-sm{margin:var(--space-sm)}.m-md{margin:var(--space-md)}.m-lg{margin:var(--space-lg)}.m-xl{margin:var(--space-xl)}.mb-sm{margin-block-end:var(--space-sm)}.mb-md{margin-block-end:var(--space-md)}.mb-lg{margin-block-end:var(--space-lg)}.mb-xl{margin-block-end:var(--space-xl)}.mt-sm{margin-block-start:var(--space-sm)}.mt-md{margin-block-start:var(--space-md)}.mt-lg{margin-block-start:var(--space-lg)}.mt-xl{margin-block-start:var(--space-xl)}@media (max-inline-size:1024px){.grid-cols-3,.grid-cols-4{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-inline-size:768px){.grid-cols-2,.grid-cols-3,.grid-cols-4{grid-template-columns:1fr}}}@layer overrides{@media (max-inline-size:768px){.toolbar{block-size:auto;min-block-size:3rem;padding:var(--space-sm)}.toolbar .left,.toolbar .right{flex-wrap:nowrap;gap:var(--space-xs);justify-content:flex-start;min-inline-size:0}.toolbar .left .btn,.toolbar .right .btn{flex-shrink:0;font-size:var(--text-sm);inline-size:max-content;min-block-size:2.5rem;min-inline-size:calc-size(fit-content,max(size,2.5rem) + .5rem + var(--icon-size,1rem));padding:var(--space-xs) var(--space-sm)}}@media (max-inline-size:768px) and (max-inline-size:480px){.toolbar{padding:var(--space-xs)}.toolbar .left,.toolbar .right{align-items:center}.toolbar .left .btn,.toolbar .right .btn{font-size:var(--text-xs);padding:var(--space-xs)}.toolbar .left .toolbar-btn-icon,.toolbar .right .toolbar-btn-icon{min-inline-size:calc-size(fit-content,max(size,2.5rem) + .5rem + var(--icon-size,1rem));padding:var(--space-xs)}.toolbar .left .btn:not([title*=Rich]):after,.toolbar .right .btn:not([title*=Voice]):after{background:var(--color-surface-container-high);border-radius:var(--radius-sm);color:var(--color-on-surface);content:attr(title);font-size:var(--text-xs);inset-block-start:-2.5rem;inset-inline-start:50%;max-inline-size:150px;opacity:0;padding:var(--space-xs);pointer-events:none;position:absolute;transform:translateX(-50%);transition:opacity var(--motion-fast);white-space:nowrap;z-index:5;word-wrap:break-word;text-align:center}.toolbar .left .btn:focus:after,.toolbar .left .btn:hover:after,.toolbar .right .btn:focus:after,.toolbar .right .btn:hover:after{opacity:1}}}@layer print{@media print{[data-app-layer=canvas],[data-app-layer=orient],[data-app-layer=overlay],[data-window-dock],[data-window-status],cw-app-dock,cw-status-bar{display:none!important;opacity:0!important;pointer-events:none!important;visibility:hidden!important}[data-app-layer=shell]{background:transparent!important;background-color:initial!important;overflow:visible!important}:is(html,body):has([data-shell=base]),:is(html,body):has([data-shell=minimal]){background:#fff!important;color:#000!important;overflow:visible!important}.cw-view-viewer-shell,.cw-view-viewer__prose,.markdown-body,.markdown-viewer-content,.result-content,.view-viewer,.view-viewer__content,[data-cw-view-host=true][data-view-id=viewer],[data-cw-viewer-prose],[data-render-target],[data-viewer-content],markdown-viewer,md-view{block-size:max-content!important;break-after:auto!important;break-before:auto!important;contain:none!important;container-type:normal!important;content-visibility:visible!important;display:block!important;inline-size:100%!important;inset:auto!important;max-block-size:none!important;max-inline-size:none!important;min-block-size:max(100%,100cqb)!important;opacity:1!important;overflow:visible!important;position:static!important;visibility:visible!important}.view-viewer__toolbar,[data-viewer-toolbar]{display:none!important}.view-explorer,.view-explorer__content,ui-file-manager{block-size:auto!important;contain:none!important;max-block-size:none!important;overflow:visible!important}}}@layer layer.view.viewer{.view-viewer__toolbar{--view-toolbar-icon-size:1.125rem;--view-toolbar-ph-icon-size:var(--view-toolbar-icon-size);--view-picon-fill:var(--color-on-surface,var(--view-fg));--view-picon-fill-hover:var(--color-primary,var(--color-on-surface,var(--view-fg)));--view-picon-fill-active:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 80%,var(--color-primary,#007acc) 20%);--view-picon-fill-disabled:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 40%,transparent);align-items:center;align-self:stretch;box-sizing:border-box;display:flex;flex-direction:row;flex-shrink:0;flex-wrap:nowrap;gap:var(--view-toolbar-gap,.5rem);inline-size:100%;justify-content:flex-start;max-inline-size:100%;min-block-size:2.5rem;min-inline-size:0;overflow-block:hidden;overflow-inline:auto;overscroll-behavior-inline:contain;padding-block:var(--view-toolbar-pad-block);padding-inline:var(--view-toolbar-pad-inline);position:relative;scrollbar-color:color-mix(in oklab,var(--view-fg) 18%,transparent) transparent;scrollbar-width:thin;z-index:2;-webkit-overflow-scrolling:touch;background:var(--color-surface-container-high,var(--view-toolbar-surface));border-block-end:none;box-shadow:var(--view-toolbar-shadow);container-type:inline-size;isolation:isolate;touch-action:pan-x}.view-viewer__toolbar .view-viewer__btn>ui-icon.view-viewer__toolbar-icon,.view-viewer__toolbar button.view-viewer__btn>ui-icon.view-viewer__toolbar-icon{box-sizing:border-box;flex:0 0 auto;order:-1;--icon-size:var(--view-toolbar-ph-icon-size,1.125rem);--icon-padding:0;--icon-color:var(--view-picon-fill);aspect-ratio:1;block-size:var(--view-toolbar-icon-size);inline-size:var(--view-toolbar-icon-size);pointer-events:none;transition:color var(--motion-fast,.12s ease)}.view-viewer__toolbar>*{position:relative;z-index:1}.view-viewer__toolbar::-webkit-scrollbar{block-size:4px}.view-viewer__toolbar::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--view-fg) 22%,transparent);border-radius:4px}@container (max-inline-size: 520px){.view-viewer__toolbar{--view-toolbar-pad-inline:0.4rem;min-block-size:2.375rem}}.view-viewer__toolbar-center{align-self:stretch;flex:1 1 0%;min-block-size:0;min-inline-size:0;pointer-events:none}.view-viewer__toolbar-left,.view-viewer__toolbar-right{align-items:center;box-sizing:border-box;display:flex;flex:0 0 auto;flex-direction:row;flex-wrap:nowrap;gap:var(--view-toolbar-gap,.5rem)}.view-viewer__toolbar-group{align-items:center;display:flex;flex:0 0 auto;flex-direction:row;flex-wrap:nowrap;gap:var(--view-toolbar-group-gap,.125rem)}.view-viewer__toolbar-left .view-viewer__toolbar-group+.view-viewer__toolbar-group,.view-viewer__toolbar-right .view-viewer__toolbar-group+.view-viewer__toolbar-group{margin-inline-start:0;padding-inline-start:calc(var(--view-toolbar-gap, .5rem) + .15rem)}.view-viewer__toolbar-left{justify-content:flex-start}.view-viewer__toolbar-right{justify-content:flex-end;margin-inline-start:0;padding-inline-start:calc(var(--view-toolbar-gap, .5rem) + .25rem)}button.view-viewer__btn{align-items:center;appearance:none;background:transparent;border:none;border-radius:var(--view-toolbar-btn-radius,.625rem);color:var(--color-on-surface,var(--view-fg));cursor:pointer;display:inline-flex;flex-direction:row;font-family:inherit;font-size:var(--text-xs,.75rem);font-weight:var(--font-weight-medium,500);gap:.375rem;justify-content:center;letter-spacing:.01em;line-height:1.2;min-block-size:2.125rem;padding-block:var(--view-toolbar-btn-pad-block,.4375rem);padding-inline:var(--view-toolbar-btn-pad-inline,.6875rem);white-space:nowrap;-webkit-tap-highlight-color:transparent;box-sizing:border-box;contain:none;container-type:normal;flex:0 0 auto;transition:background-color var(--motion-fast,.14s ease),color var(--motion-fast,.14s ease),box-shadow var(--motion-fast,.14s ease)}button.view-viewer__btn span{flex-shrink:0;font-size:.6875rem;font-weight:500;letter-spacing:.04em;line-height:1.2;opacity:.78;text-transform:uppercase}button.view-viewer__btn:hover{background:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 9%,transparent)}button.view-viewer__btn:hover span{opacity:.95}button.view-viewer__btn:hover>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-hover)}button.view-viewer__btn:active{background:color-mix(in oklab,var(--color-on-surface,var(--view-fg)) 13%,transparent)}button.view-viewer__btn:active>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-active)}button.view-viewer__btn:disabled>ui-icon.view-viewer__toolbar-icon{--icon-color:var(--view-picon-fill-disabled);opacity:.55}button.view-viewer__btn:focus-visible{box-shadow:var(--focus-ring,0 0 0 2px color-mix(in oklab,var(--color-primary,#007acc) 45%,transparent));outline:none}button.view-viewer__btn[aria-pressed=true]{background:color-mix(in oklab,var(--color-primary,#007acc) 16%,transparent)}@container (max-inline-size: 720px){button.view-viewer__btn{gap:.25rem;min-block-size:2.25rem;padding-block:.375rem;padding-inline:.5625rem}}@container (max-inline-size: 560px){button.view-viewer__btn{border-radius:var(--view-toolbar-btn-radius,.75rem);gap:0;min-block-size:2.5rem;min-inline-size:2.5rem;padding-block:.45rem;padding-inline:.45rem;position:relative}button.view-viewer__btn span{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}}.view-viewer__md-loading{align-items:center;color:var(--view-fg);display:flex;font-size:.9rem;gap:.75rem;opacity:.9;padding:1.25rem 1rem}.view-viewer__md-loading:before{animation:k .75s linear infinite;block-size:1.25rem;border:2px solid var(--view-border);border-block-start-color:var(--view-link-color);border-radius:50%;content:\"\";flex-shrink:0;inline-size:1.25rem}.view-viewer__content{box-sizing:border-box;display:flex;flex-direction:column;grid-row:content-row;inline-size:100%;min-inline-size:0;padding:0}.view-viewer__content.dragover{background-color:rgba(0,122,204,.05);outline:2px dashed rgba(0,122,204,.3);outline-offset:-8px}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)) .view-viewer__content{overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell.dragover{background-color:rgba(0,122,204,.05);outline:2px dashed rgba(0,122,204,.3);outline-offset:-8px}.cw-view-viewer-shell [data-render-target],.cw-view-viewer-shell [data-render-target] *,cw-view-viewer [data-render-target],cw-view-viewer [data-render-target] *{pointer-events:auto;user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}cw-view-viewer [data-render-target]{block-size:stretch;box-sizing:border-box;display:flex;flex-direction:column;max-block-size:none;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell [data-render-target] .view-viewer__md-root,cw-view-viewer [data-render-target] .view-viewer__md-root{flex:1 1 auto;min-block-size:0;min-inline-size:0}.view-viewer__outline{background:color-mix(in oklab,var(--view-bg) 92%,var(--view-toolbar-surface) 8%);border-block-end:1px solid var(--view-border);flex:0 0 auto;font-size:var(--text-xs,.75rem);inset-block-start:0;line-height:1.35;margin:0;max-block-size:min(33vh,14rem);overflow:auto;overscroll-behavior:contain;padding:.5rem .75rem .65rem;position:sticky;z-index:1}.view-viewer__outline[hidden]{display:none!important}.view-viewer__outline-empty{font-style:italic;opacity:.75;padding:.15rem 0}.view-viewer__outline-list{display:flex;flex-direction:column;gap:.2rem;list-style:none;margin:0;padding:0}.view-viewer__outline-item{margin:0;padding:0}.view-viewer__outline-item a{border-radius:var(--radius-sm,4px);color:var(--view-link-color);display:block;margin-inline:-.35rem;padding:.2rem .35rem;text-decoration:none}.view-viewer__outline-item a:hover{background:color-mix(in oklab,var(--view-btn-hover-bg) 80%,transparent);color:var(--view-link-hover)}.view-viewer__outline--h1{font-weight:650}.view-viewer__outline--h2{padding-inline-start:.35rem}.view-viewer__outline--h3{opacity:.95;padding-inline-start:.7rem}.view-viewer__outline--h4{opacity:.9;padding-inline-start:1.05rem}.view-viewer__outline--h5,.view-viewer__outline--h6{opacity:.85;padding-inline-start:1.35rem}:root:has([data-view=viewer]),cw-view-viewer[data-view-id=viewer],cw-view-viewer[data-view=viewer],html:has([data-view=viewer]){--view-layout:\"flex\";--view-content-max-width:800px;--view-padding:var(--space-6);--view-font-size-base:1rem;--view-line-height-base:1.6;--view-prose-font-size:var(--text-base);--view-prose-line-height:1.75;--view-prose-heading-margin:var(--space-6);color-scheme:light dark;--view-bg:var(--color-surface,light-dark(#f4f6fa,#0b0d12));--view-fg:var(--color-on-surface,light-dark(#1a1a1a,#e8eaef));--view-border:var(\n        --color-border,light-dark(rgba(0,0,0,0.12),rgba(255,255,255,0.07))\n    );--view-toolbar-bg:light-dark(rgba(0,0,0,0.03),rgba(255,255,255,0.05));--view-btn-hover-bg:light-dark(rgba(0,0,0,0.07),rgba(255,255,255,0.08));--view-code-bg:light-dark(#f0f2f5,#161a22);--view-code-fg:light-dark(var(--color-text,#1a1a1a),#d8dce6);--view-code-border:var(\n        --color-border,light-dark(rgba(0,0,0,0.1),rgba(255,255,255,0.08))\n    );--view-blockquote-border:var(\n        --color-primary,light-dark(#2563eb,#5b8cff)\n    );--view-blockquote-bg:light-dark(rgba(0,0,0,0.03),rgba(255,255,255,0.04));--view-link-color:var(--color-link,light-dark(#06c,#7eb8ff));--view-link-hover:var(--color-link-hover,light-dark(#005fa3,#a8d0ff));--color-surface:transparent;--color-on-surface:light-dark(#2d3748,#c4c9d4);--color-surface-container-high:var(--view-btn-hover-bg);--color-primary:light-dark(#2563eb,#8ab4ff);--view-toolbar-pad-block:0.375rem;--view-toolbar-pad-inline:0.625rem;--view-toolbar-gap:0.5rem;--view-toolbar-group-gap:0.125rem;--view-toolbar-divider:color-mix(in oklab,var(--view-border) 35%,transparent);--view-toolbar-btn-radius:0.625rem;--view-toolbar-btn-pad-block:0.4375rem;--view-toolbar-btn-pad-inline:0.6875rem;--view-toolbar-surface:light-dark(color-mix(in oklab,var(--color-surface-container-high,#ececec) 92%,var(--color-surface,#fff) 8%),color-mix(in oklab,var(--color-surface-container-high,#2a2a2a) 88%,var(--color-surface,#121212) 12%));--view-toolbar-shadow:light-dark(0 10px 28px -18px color-mix(in oklab,var(--color-on-surface,#1a1a1a) 12%,transparent),0 14px 36px -22px color-mix(in oklab,#000 50%,transparent));--view-code-font-size:0.9em}:is(html:has([data-shell=base]),html:has([data-shell=minimal])) cw-view-viewer[data-cw-view-host=true]{display:block;inline-size:100%;max-inline-size:100%}.cw-view-viewer-shell{--viewer-shell-container-type:inline-size;--viewer-shell-contain:layout style paint;--viewer-shell-inline-size:100%;--viewer-shell-block-size:100%;align-self:stretch;block-size:var(--viewer-shell-block-size,100%);contain:var(--viewer-shell-contain,layout style paint);contain-intrinsic-size:auto 1000px;container-type:var(--viewer-shell-container-type,inline-size);inline-size:var(--viewer-shell-inline-size,100%);isolation:isolate;max-block-size:none;max-inline-size:100%;width:100%}.cw-view-viewer-shell,.view-viewer{box-sizing:border-box;display:flex;flex-direction:column;min-block-size:0;min-inline-size:0}.view-viewer{background-color:var(--view-bg);block-size:100%;color:var(--view-fg);inline-size:100%;overflow:hidden}.cw-view-viewer-shell:not([data-raw]) .view-viewer{flex:0 0 auto}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default) .view-viewer,.cw-view-viewer-shell[data-raw]:not(:has(.cw-view-viewer__slot-default)) .view-viewer{flex:1 1 auto;min-block-size:0;min-inline-size:0}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default) .view-viewer__content{block-size:100%;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0;overflow:hidden}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-raw,.cw-view-viewer-shell:has(.cw-view-viewer__slot-default)[data-raw] .cw-view-viewer__slot-default{display:none!important}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default>slot{block-size:100%;display:block;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer layer.view.viewer{}@layer layer.view.viewer{}@layer layer.view.viewer{.cw-view-viewer-shell:has(.cw-view-viewer__slot-default):not([data-raw]) .cw-view-viewer__slot-default>slot::slotted([data-render-target]){block-size:100%;display:flex;flex-direction:column;inline-size:100%;max-block-size:none;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:has(.cw-view-viewer__slot-default)[data-raw] .cw-view-viewer__slot-raw{block-size:100%;box-sizing:border-box;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default))[data-raw] .cw-view-viewer__prose{display:none!important}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)):not([data-raw]) .view-viewer__content{display:none}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default)):not([data-raw]) .cw-view-viewer__prose{block-size:100%;box-sizing:border-box;display:flex;flex:1 1 auto;flex-direction:column;inline-size:100%;min-block-size:0;min-inline-size:0;overflow-block:auto;overflow-inline:hidden;overscroll-behavior:contain}.cw-view-viewer-shell:not(:has(.cw-view-viewer__slot-default))[data-raw] .view-viewer__content{block-size:100%;flex:1 1 auto;inline-size:100%;min-block-size:0;min-inline-size:0}}@layer layer.view.viewer{@keyframes k{to{transform:rotate(1turn)}}@media print{@page{margin:12mm}.cw-view-viewer-shell{contain:none!important;container-type:normal!important}.cw-view-viewer-shell,.view-viewer{block-size:auto!important;display:block!important;inline-size:100%!important;overflow:visible!important}.view-viewer{background:transparent!important;color:#000!important}.view-viewer__outline,.view-viewer__toolbar{display:none!important}.view-viewer__content{padding:0!important}.cw-view-viewer__prose,.view-viewer__content{block-size:auto!important;display:block!important;inline-size:100%!important;overflow:visible!important}.cw-view-viewer__prose{contain:none!important}.cw-view-viewer__slot-default,.cw-view-viewer__slot-raw,.markdown-body,.markdown-viewer-content,.result-content,[data-render-target]{block-size:auto!important;display:block!important;inline-size:100%!important;overflow:visible!important}.markdown-body,.markdown-viewer-content,.result-content,[data-render-target]{background:transparent!important;color:#000!important;min-block-size:100%!important;opacity:1!important;visibility:visible!important}.markdown-viewer-content,[data-render-target]{break-after:auto!important;break-before:auto!important;break-inside:auto!important;page-break-before:auto!important;page-break-after:auto!important;page-break-inside:auto!important;orphans:3;widows:3}.markdown-viewer-content h1,.markdown-viewer-content h2,.markdown-viewer-content h3,.markdown-viewer-content h4,.markdown-viewer-content h5,.markdown-viewer-content h6{break-after:avoid-page;page-break-after:avoid;break-inside:avoid;page-break-inside:avoid}.markdown-viewer-content blockquote,.markdown-viewer-content figure,.markdown-viewer-content img,.markdown-viewer-content li,.markdown-viewer-content ol,.markdown-viewer-content pre,.markdown-viewer-content table,.markdown-viewer-content ul{break-inside:avoid-page;page-break-inside:avoid}}}";
//#endregion
//#region src/frontend/views/viewer/index.ts
/**
* Markdown Viewer View
*
* Shell-agnostic markdown viewer component.
* **Standalone** `render()`: shell in light DOM (legacy editor preview).
* **`cw-view-viewer` host** (`renderIntoWebComponentHost`): shadow = mount → shell → view-viewer (toolbar +
*   `__content` wrapping `<slot name="raw">` + default `<slot>`); light DOM = `<pre slot="raw">` + prose `[data-render-target]`.
*/
var markedParserPromise = null;
var VIEWER_OUTLINE_SESSION_KEY = "rs-viewer-outline";
var MATH_DELIMITER_PATTERN = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|(?<!\$)\$[^$\n]+\$|\\\([\s\S]*?\\\)/;
/** KaTeX preprocess: keep markdown as text (not innerHTML) before auto-render — HTML parsing breaks `{`, `\\`, `<` in math. */
var VIEWER_MAX_KATEX_PREPROCESS_CHARS = 35e4;
/** Assigning multi‑MB strings to a <pre> synchronously freezes the tab; defer past this threshold. */
var VIEWER_RAW_TEXTCONTENT_DEFER_CHARS = 96e3;
/** Raw panel cap (content still fully in memory via ref; only DOM text is truncated). */
var VIEWER_RAW_DISPLAY_MAX_CHARS = 12e5;
/** Clipboard read / paste file construction — avoid reading multi‑MB blobs on the main thread. */
var VIEWER_CLIPBOARD_READ_TEXT_MAX_BYTES = 2 * 1024 * 1024;
/** `isBase64Like` / `parseDataUrl` on megabyte strings can stall; plain paste above this skips probe. */
var VIEWER_INGEST_BASE64_PROBE_MAX = 48e4;
/** `innerText` on a huge rendered DOM is extremely expensive. */
var VIEWER_MAX_RENDERED_COPY_CHARS = 6e5;
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
var DEFAULT_MARKDOWN_EXTENSION_FLAGS = "g";
var VIEWER_CSS_LAYER_ORDER = [
	"rs-md-base",
	"rs-md-system",
	"rs-md-modules",
	"rs-md-user",
	"rs-md-print",
	"rs-md-user-print"
];
var viewerIconRuntimeInitialized = false;
var ensureViewerIconRuntime = () => {
	if (viewerIconRuntimeInitialized) return;
	try {
		ensureStyleSheet();
		reinitializeRegistry();
		viewerIconRuntimeInitialized = true;
	} catch (error) {
		console.warn("[Viewer] Failed to initialize icon runtime:", error);
	}
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
var getMarkedParser = async () => {
	if (markedParserPromise) return markedParserPromise;
	markedParserPromise = (async () => {
		const [{ marked }, { default: markedKatex }] = await Promise.all([import("../vendor/marked.js").then((n) => n.n), import("../vendor/marked-katex-extension.js").then((n) => n.n)]);
		marked?.use?.(markedKatex({
			throwOnError: false,
			nonStandard: true,
			output: "mathml",
			strict: false
		}), { hooks: { preprocess: (markdown) => {
			if (markdown.length > VIEWER_MAX_KATEX_PREPROCESS_CHARS) return markdown;
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
		return async (markdown) => {
			return await marked.parse(markdown ?? "");
		};
	})();
	return markedParserPromise;
};
/** Warm marked + KaTeX chunk from the app entry; safe no-op if import fails. */
function warmViewerMarkdownEngine() {
	getMarkedParser().catch(() => {});
}
var STORAGE_KEY = "rs-viewer-state";
var DEFAULT_CONTENT = `# This is content`;
var ViewerView = class ViewerView extends BaseElement_default {
	id = "viewer";
	name = "Viewer";
	icon = "eye";
	options;
	shellContext;
	element = null;
	/** When mounted under `cw-view-viewer`, slotted raw/prose are light children of this host. */
	slotProjectingHost = null;
	contentRef = ref("");
	renderSeq = 0;
	stateManager = createViewState(STORAGE_KEY);
	_sheet = null;
	pasteController = null;
	isViewVisible = false;
	isPointerInView = false;
	sourceUrl = null;
	customSheet = null;
	userStyleModules = {
		screenCss: "",
		printCss: ""
	};
	markdownSettings = {
		preset: "default",
		fontFamily: "system",
		fontSizePx: 16,
		lineHeight: 1.7,
		contentMaxWidthPx: 860,
		printScale: 1,
		page: {
			size: "auto",
			orientation: "portrait",
			marginMm: 12
		},
		modules: {
			typography: true,
			lists: true,
			tables: true,
			codeBlocks: true,
			blockquotes: true,
			media: true,
			printBreaks: true
		},
		plugins: {
			smartTypography: false,
			softBreaksAsBr: false,
			externalLinksNewTab: true
		},
		customCss: "",
		printCss: "",
		extensions: []
	};
	markdownSettingsPromise = null;
	/** Table of contents for rendered markdown; persisted for the tab session. */
	outlineVisible = false;
	lifecycle = {
		onMount: () => this.onMount(),
		onUnmount: () => this.onUnmount(),
		onShow: () => this.onShow(),
		onHide: () => this.onHide(),
		onRefresh: () => this.onRefresh()
	};
	constructor(options = {}) {
		super();
		this.options = options;
		this.shellContext = options.shellContext;
		this.sourceUrl = this.normalizeSourceUrl(options.source);
		this.applyRouteParams(options.params);
		this.markdownSettingsPromise = this.loadMarkdownSettings();
		try {
			this.outlineVisible = globalThis.sessionStorage?.getItem(VIEWER_OUTLINE_SESSION_KEY) === "1";
		} catch {
			this.outlineVisible = false;
		}
		const savedState = this.stateManager.load();
		this.contentRef.value = options.initialContent || savedState?.content || DEFAULT_CONTENT;
		if (!options.initialContent) {
			const fromParams = (options.params?.content || "").trim();
			if (fromParams) this.contentRef.value = fromParams;
		}
	}
	render = function(options) {
		ensureViewerIconRuntime();
		this.slotProjectingHost = null;
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
			this.applyRouteParams(options.params);
		}
		this._sheet = loadAsAdopted(viewer_default);
		this.element = this.createViewerShellElement();
		const renderTarget = this.element.querySelector("[data-render-target]");
		const rawTarget = this.element.querySelector("[data-raw-target]");
		this.setupEventHandlers(rawTarget || void 0);
		this.syncOutlineToolbarState();
		this.syncToolbarDocumentTitle();
		if (renderTarget && rawTarget) this.renderMarkdown(this.contentRef.value, renderTarget, rawTarget);
		affected(this.contentRef, () => {
			if (renderTarget && rawTarget) this.renderMarkdown(this.contentRef.value, renderTarget, rawTarget);
			this.saveState();
		});
		return this.element;
	};
	/**
	* Mount under `<cw-view-viewer>`: chrome in shadow, raw + rendered bodies in light DOM (slotted).
	*/
	renderIntoWebComponentHost(host, options) {
		ensureViewerIconRuntime();
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
			this.applyRouteParams(options.params);
		}
		this.slotProjectingHost = host;
		this._sheet ??= loadAsAdopted(viewer_default);
		this.element = this.createViewerShellElement();
		host.replaceChildren(this.element);
		const pre = host.querySelector("[data-raw-target]");
		const prose = host.querySelector("[data-render-target]");
		host.setAttribute("data-view-id", "viewer");
		host.toggleAttribute("data-cw-view-host", true);
		this.syncAdoptedSheetsToShadow();
		const renderTarget = prose;
		const rawTarget = pre;
		this.setupEventHandlers(rawTarget);
		this.syncOutlineToolbarState();
		this.syncToolbarDocumentTitle();
		if (renderTarget && rawTarget) this.renderMarkdown(this.contentRef.value, renderTarget, rawTarget);
		affected(this.contentRef, () => {
			if (renderTarget && rawTarget) this.renderMarkdown(this.contentRef.value, renderTarget, rawTarget);
			this.saveState();
		});
	}
	getToolbar() {
		return null;
	}
	/**
	* Update the displayed content
	*/
	setContent(content, filename, source) {
		this.contentRef.value = content;
		if (filename) this.options.filename = filename;
		if (source !== void 0) {
			this.sourceUrl = this.normalizeSourceUrl(source);
			this.options.source = source || void 0;
		}
		this.syncToolbarDocumentTitle();
	}
	/**
	* Get current content
	*/
	getContent() {
		return this.contentRef.value;
	}
	createViewerShellElement() {
		return H`
            <div class="cw-view-viewer-shell">
                <div class="view-viewer">
                    <div
                        class="view-viewer__toolbar"
                        data-viewer-toolbar
                        role="toolbar"
                        aria-label="Markdown document actions"
                    >
                        <div class="view-viewer__toolbar-left" role="group" aria-label="Document">
                            <button class="view-viewer__btn" data-action="open" type="button" title="Open file">
                                <ui-icon class="view-viewer__toolbar-icon" icon="folder-open" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Open</span>
                            </button>
                            <button class="view-viewer__btn" data-action="toggle-raw" type="button" title="Toggle raw/rendered view">
                                <ui-icon class="view-viewer__toolbar-icon" icon="code" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Raw</span>
                            </button>
                            <button class="view-viewer__btn" data-action="copy" type="button" title="Copy raw content">
                                <ui-icon class="view-viewer__toolbar-icon" icon="copy" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Copy</span>
                            </button>
                            <button class="view-viewer__btn" data-action="paste" type="button" title="Paste from clipboard (mobile-friendly)" aria-label="Paste from clipboard">
                                <ui-icon class="view-viewer__toolbar-icon" icon="clipboard-text" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Paste</span>
                            </button>
                            <button class="view-viewer__btn" data-action="download" type="button" title="Download as markdown">
                                <ui-icon class="view-viewer__toolbar-icon" icon="download" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Download</span>
                            </button>
                        </div>
                        <div class="view-viewer__toolbar-center" role="presentation">
                            <span class="view-viewer__toolbar-title" data-viewer-toolbar-title></span>
                        </div>
                        <div class="view-viewer__toolbar-right" role="group" aria-label="Output and workspace">
                            <button class="view-viewer__btn" data-action="attach" type="button" title="Attach to Work Center">
                                <ui-icon class="view-viewer__toolbar-icon" icon="paperclip" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Attach</span>
                            </button>
                            <button class="view-viewer__btn" data-action="open-style-settings" type="button" title="Markdown styling, modules, plugins">
                                <ui-icon class="view-viewer__toolbar-icon" icon="paint-roller" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Style</span>
                            </button>
                            <button class="view-viewer__btn" data-action="copy-rendered" type="button" title="Copy rendered text">
                                <ui-icon class="view-viewer__toolbar-icon" icon="text-t" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Copy text</span>
                            </button>
                            <button class="view-viewer__btn" data-action="export-docx" type="button" title="Export as DOCX">
                                <ui-icon class="view-viewer__toolbar-icon" icon="file-doc" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>DOCX</span>
                            </button>
                            <button class="view-viewer__btn" data-action="print" type="button" title="Print content">
                                <ui-icon class="view-viewer__toolbar-icon" icon="printer" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                                <span>Print</span>
                            </button>
                        </div>
                    </div>
                    <div class="view-viewer__content" data-viewer-content>
                        <pre class="markdown-viewer-raw" data-raw-target aria-label="Raw content" hidden></pre>
                        <div class="cw-view-viewer__prose markdown-body markdown-viewer-content result-content" data-render-target data-cw-viewer-prose></div>
                    </div>
                </div>
            </div>
        `;
	}
	adoptViewerStylesIntoShadowRoot(shadow) {
		const sheet = this._sheet;
		if (!sheet || typeof shadow.adoptedStyleSheets === "undefined") return;
		if (!shadow.adoptedStyleSheets.includes(sheet)) shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
	}
	syncAdoptedSheetsToShadow() {
		const shadow = this.slotProjectingHost?.shadowRoot;
		if (!shadow || typeof shadow.adoptedStyleSheets === "undefined") return;
		const push = (s) => {
			if (!s) return;
			if (!shadow.adoptedStyleSheets.includes(s)) shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, s];
		};
		push(this._sheet);
		push(this.customSheet ?? null);
	}
	queryViewerSlotted(sel) {
		const fromHost = this.slotProjectingHost?.querySelector(sel);
		if (fromHost) return fromHost;
		return this.element?.querySelector(sel) ?? null;
	}
	viewBranchesContain(node) {
		if (!node) return false;
		if (this.slotProjectingHost?.contains(node)) return true;
		return Boolean(this.element?.contains(node));
	}
	viewBranchesHover() {
		return Boolean(this.slotProjectingHost?.matches(":hover")) || Boolean(this.element?.matches(":hover"));
	}
	/** Syncs raw/rendered layout: shell + content `data-raw` drives CSS (toolbar + raw vs slotted markdown). */
	syncViewerRawMode(raw) {
		const shell = this.element;
		if (!shell?.classList.contains("cw-view-viewer-shell")) return;
		shell.toggleAttribute("data-raw", raw);
		this.slotProjectingHost?.toggleAttribute("data-raw", raw);
		const content = shell.querySelector("[data-viewer-content]");
		if (raw) content?.setAttribute("data-raw", "");
		else content?.removeAttribute("data-raw");
	}
	syncOutlineToolbarState() {
		const btn = (this.element?.querySelector("[data-viewer-toolbar]"))?.querySelector("[data-action=\"toggle-outline\"]");
		if (btn) btn.setAttribute("aria-pressed", this.outlineVisible ? "true" : "false");
	}
	slugifyHeadingId(text, used) {
		const base = (text || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u00c0-\u024f-]+/gi, "-").replace(/^-+|-+$/g, "") || "section";
		let id = base;
		let n = 0;
		while (used.has(id)) {
			n += 1;
			id = `${base}-${n}`;
		}
		used.add(id);
		return id;
	}
	refreshDocumentOutline(nav, proseRoot) {
		nav.hidden = !this.outlineVisible;
		nav.innerHTML = "";
		if (!this.outlineVisible) return;
		const headings = Array.from(proseRoot.querySelectorAll("h1,h2,h3,h4,h5,h6"));
		if (headings.length === 0) {
			nav.innerHTML = `<div class="view-viewer__outline-empty" role="status">No headings in document</div>`;
			return;
		}
		const used = /* @__PURE__ */ new Set();
		const list = document.createElement("ul");
		list.className = "view-viewer__outline-list";
		for (const h of headings) {
			let id = (h.id || "").trim();
			if (!id) {
				id = this.slugifyHeadingId(h.textContent || "", used);
				h.id = id;
			} else used.add(id);
			const li = document.createElement("li");
			li.className = `view-viewer__outline-item view-viewer__outline--h${h.tagName.slice(1)}`;
			const a = document.createElement("a");
			a.href = `#${id}`;
			a.textContent = (h.textContent || "").trim() || id;
			li.appendChild(a);
			list.appendChild(li);
		}
		nav.appendChild(list);
	}
	setOutlineVisible(visible) {
		this.outlineVisible = visible;
		try {
			if (visible) globalThis.sessionStorage?.setItem(VIEWER_OUTLINE_SESSION_KEY, "1");
			else globalThis.sessionStorage?.removeItem(VIEWER_OUTLINE_SESSION_KEY);
		} catch {}
		const renderTarget = this.queryViewerSlotted("[data-render-target]");
		if (renderTarget) {
			const nav = renderTarget.querySelector(":scope > nav.view-viewer__outline");
			const root = renderTarget.querySelector(":scope > .view-viewer__md-root");
			if (nav && root) this.refreshDocumentOutline(nav, root);
			else if (nav) nav.hidden = !visible;
		}
		this.syncOutlineToolbarState();
	}
	renderMarkdown(content, renderTarget, rawTarget) {
		if (!renderTarget) return;
		const seq = ++this.renderSeq;
		const looksLikeHtmlDocument = (text) => {
			const t = (text || "").trimStart().toLowerCase();
			if (t.startsWith("<!doctype html")) return true;
			if (t.startsWith("<html")) return true;
			if (t.startsWith("<head")) return true;
			if (t.startsWith("<body")) return true;
			if (t.startsWith("<?xml") && t.includes("<html")) return true;
			return false;
		};
		const endBusy = () => {
			if (seq !== this.renderSeq) return;
			renderTarget.removeAttribute("aria-busy");
			renderTarget.removeAttribute("data-md-state");
		};
		if (rawTarget) {
			const c = content || "";
			const assignRaw = () => {
				if (seq !== this.renderSeq) return;
				if (c.length > VIEWER_RAW_DISPLAY_MAX_CHARS) rawTarget.textContent = `${c.slice(0, VIEWER_RAW_DISPLAY_MAX_CHARS)}\n\n… [truncated — open in editor for full source]`;
				else rawTarget.textContent = c;
			};
			if (c.length > VIEWER_RAW_TEXTCONTENT_DEFER_CHARS) globalThis.setTimeout(assignRaw, 0);
			else assignRaw();
		}
		if (!String(content ?? "").trim()) {
			if (seq !== this.renderSeq) return;
			this.syncViewerRawMode(false);
			renderTarget.hidden = false;
			if (rawTarget) rawTarget.hidden = true;
			renderTarget.removeAttribute("aria-busy");
			renderTarget.setAttribute("data-md-state", "empty");
			renderTarget.innerHTML = `<div class="view-viewer__md-empty" role="status">Empty document</div>`;
			this.syncToolbarDocumentTitle();
			return;
		}
		if (this.element?.querySelector(".view-viewer__content") && looksLikeHtmlDocument(content || "")) {
			this.syncViewerRawMode(true);
			if (rawTarget) rawTarget.hidden = false;
			renderTarget.hidden = true;
			this.syncToolbarDocumentTitle();
			endBusy();
			return;
		}
		this.syncViewerRawMode(false);
		renderTarget.hidden = false;
		if (rawTarget) rawTarget.hidden = true;
		renderTarget.setAttribute("aria-busy", "true");
		renderTarget.setAttribute("data-md-state", "preparing");
		renderTarget.innerHTML = `<div class="view-viewer__md-loading" role="status">Rendering preview…</div>`;
		queueMicrotask(() => {
			if (seq !== this.renderSeq) return;
			try {
				const handleParsed = (html) => {
					if (seq !== this.renderSeq) return;
					const sanitized = purify?.sanitize?.((html || "")?.trim?.() || "", SANITIZE_OPTIONS) || "";
					renderTarget.replaceChildren();
					const outlineNav = document.createElement("nav");
					outlineNav.className = "view-viewer__outline";
					outlineNav.setAttribute("aria-label", "Document outline");
					const mdRoot = document.createElement("div");
					mdRoot.className = "view-viewer__md-root";
					mdRoot.innerHTML = sanitized;
					renderTarget.append(outlineNav, mdRoot);
					this.resolveRelativeResourceUrls(mdRoot);
					this.applyRenderedLinkBehavior(mdRoot);
					this.refreshDocumentOutline(outlineNav, mdRoot);
					this.syncOutlineToolbarState();
					this.syncToolbarDocumentTitle(mdRoot);
					endBusy();
					console.log("[ViewerView] Markdown rendered successfully");
				};
				const handleError = (error) => {
					if (seq !== this.renderSeq) return;
					console.error("[ViewerView] Error rendering markdown:", error);
					renderTarget.innerHTML = `<div style="color: red; padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px;">Error parsing markdown: ${error?.message}</div>`;
					endBusy();
				};
				const pluginProcessed = this.applyMarkdownPlugins((content || "")?.trim?.() || "");
				const processedContent = this.applyCustomMarkdownExtensions(pluginProcessed);
				getMarkedParser().then((parse) => parse(processedContent)).then(handleParsed).catch(handleError);
			} catch (error) {
				console.error("[ViewerView] Error rendering markdown:", error);
				renderTarget.innerHTML = `<div style="color: red; padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px;">Error parsing markdown: ${error?.message}</div>`;
				endBusy();
			}
		});
	}
	normalizeSourceUrl(source) {
		const raw = (source || "").trim();
		if (!raw) return null;
		try {
			return new URL(raw, globalThis.location.href).toString();
		} catch {
			return null;
		}
	}
	applyRouteParams(params) {
		if (!params) return;
		const detachKey = String(params.detachKey || "").trim();
		if (detachKey) try {
			const payloadRaw = globalThis?.sessionStorage?.getItem?.(detachKey) || "";
			if (payloadRaw) {
				const payload = JSON.parse(payloadRaw);
				const detachedContent = String(payload?.content || "");
				if (detachedContent.trim()) this.contentRef.value = detachedContent;
				if (payload?.filename) this.options.filename = String(payload.filename);
				const detachedSource = String(payload?.source || "");
				if (detachedSource) {
					this.sourceUrl = this.normalizeSourceUrl(detachedSource);
					this.options.source = detachedSource;
				}
			}
			globalThis?.sessionStorage?.removeItem?.(detachKey);
		} catch (error) {
			console.warn("[Viewer] Failed to restore detached payload:", error);
		}
		const sourceParam = params.source || params.src || params.path || params.url;
		if (sourceParam) {
			this.sourceUrl = this.normalizeSourceUrl(sourceParam);
			this.options.source = sourceParam;
		}
		const filenameParam = params.filename || params.name;
		if (filenameParam) this.options.filename = filenameParam;
		const contentParam = String(params.content || "");
		if (contentParam.trim()) this.contentRef.value = contentParam;
		if (this.element) this.syncToolbarDocumentTitle();
	}
	/** Toolbar center title span stays empty (no document label in chrome). */
	syncToolbarDocumentTitle(_mdRoot) {
		const titleEl = this.element?.querySelector("[data-viewer-toolbar-title]");
		if (!titleEl) return;
		titleEl.textContent = "";
		titleEl.removeAttribute("title");
	}
	isUnsafeProtocol(value) {
		return /^(?:javascript|vbscript|data:text\/html)/i.test((value || "").trim());
	}
	/**
	* Markdown/HTML sometimes emits bare base64 (no `data:` scheme). Resolving that against
	* `chrome-extension://…/viewer.html` produces bogus URLs and net::ERR_FILE_NOT_FOUND.
	*/
	normalizeBareBase64Candidate(raw) {
		const trimmed = (raw || "").trim();
		if (!trimmed || parseDataUrl(trimmed)) return null;
		const candidates = [
			trimmed,
			trimmed.replace(/[\s>]+$/g, ""),
			trimmed.replace(/[^A-Za-z0-9+/=_-]/g, "")
		];
		for (const c of candidates) {
			const t = c.trim();
			if (t.length >= 8 && isBase64Like(t)) return t;
		}
		return null;
	}
	sniffImageMimeFromBytes(bytes) {
		const n = bytes.byteLength;
		if (n >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "image/png";
		if (n >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
		if (n >= 6 && bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 56) return "image/gif";
		if (n >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70) return "image/webp";
		if (n >= 2 && bytes[0] === 66 && bytes[1] === 77) return "image/bmp";
		const t = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, Math.min(400, n))).trimStart();
		if (t.startsWith("<svg") || t.startsWith("<?xml")) return "image/svg+xml";
		return "image/png";
	}
	/** `undefined` = not bare base64; `null` = looked like base64 but decode failed (do not resolve as path). */
	coerceBareBase64ToDataUrl(value) {
		const bare = this.normalizeBareBase64Candidate(value);
		if (!bare) return void 0;
		try {
			const bytes = decodeBase64ToBytes(bare);
			return `data:${this.sniffImageMimeFromBytes(bytes)};base64,${bare.replace(/\s/g, "")}`;
		} catch {
			return null;
		}
	}
	resolveUrlAgainstSource(rawValue) {
		const value = (rawValue || "").trim();
		if (!value) return null;
		if (value.startsWith("#")) return value;
		if (this.isUnsafeProtocol(value)) return null;
		if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) || value.startsWith("//")) try {
			return new URL(value, globalThis.location.href).toString();
		} catch {
			return value;
		}
		const dataFromBare = this.coerceBareBase64ToDataUrl(value);
		if (dataFromBare !== void 0) return dataFromBare;
		if (!this.sourceUrl) return value;
		try {
			return new URL(value, this.sourceUrl).toString();
		} catch {
			return value;
		}
	}
	resolveRelativeResourceUrls(root) {
		const extPage = globalThis.location?.protocol === "chrome-extension:";
		const fileBacked = Boolean(this.sourceUrl?.startsWith("file:"));
		const apply = (selector, attr, mode) => {
			const nodes = Array.from(root.querySelectorAll(selector));
			for (const node of nodes) {
				const current = (node.getAttribute(attr) || "").trim();
				if (!current) continue;
				const resolved = this.resolveUrlAgainstSource(current);
				if (!resolved) {
					node.removeAttribute(attr);
					continue;
				}
				if (extPage && fileBacked && /^file:/i.test(resolved)) {
					if (mode === "link") {
						if (!(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(current) || current.startsWith("//"))) continue;
						node.removeAttribute(attr);
						continue;
					}
					node.removeAttribute(attr);
					continue;
				}
				if (resolved !== current) node.setAttribute(attr, resolved);
			}
		};
		apply("img[src]", "src", "media");
		apply("source[src]", "src", "media");
		apply("video[src]", "src", "media");
		apply("audio[src]", "src", "media");
		apply("track[src]", "src", "media");
		apply("a[href]", "href", "link");
	}
	isLikelyMarkdownUrl(value) {
		const raw = (value || "").trim();
		if (!raw) return false;
		const noQuery = raw.split("#")[0].split("?")[0];
		return /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/i.test(noQuery);
	}
	isLikelyBinaryAssetUrl(value) {
		const raw = (value || "").trim();
		if (!raw) return false;
		const noQuery = raw.split("#")[0].split("?")[0];
		return /\.(?:png|jpe?g|gif|webp|bmp|svg|ico|pdf|zip|rar|7z|gz|mp4|webm|mp3|wav|ogg|avi|mov)$/i.test(noQuery);
	}
	async fetchMarkdownFromUrl(source) {
		const src = (source || "").trim();
		if (!src) return null;
		if (/^file:/i.test(src)) return null;
		try {
			const response = await fetch(src, {
				credentials: "include",
				cache: "no-store"
			});
			if (!response.ok) return null;
			const text = await response.text();
			const lowered = (text || "").trimStart().toLowerCase();
			if (lowered.startsWith("<!doctype html") || lowered.startsWith("<html") || lowered.startsWith("<head") || lowered.startsWith("<body")) return null;
			return text;
		} catch (error) {
			console.warn("[ViewerView] Failed to load markdown URL:", error);
			return null;
		}
	}
	async openMarkdownSource(source, filename) {
		const renderTarget = this.queryViewerSlotted("[data-render-target]");
		if (renderTarget) {
			renderTarget.setAttribute("aria-busy", "true");
			renderTarget.setAttribute("data-md-state", "fetching");
			renderTarget.innerHTML = `<div class="view-viewer__md-loading" role="status">Loading document…</div>`;
		}
		const normalizedSource = this.normalizeSourceUrl(source);
		if (!normalizedSource) return false;
		const markdown = await this.fetchMarkdownFromUrl(normalizedSource);
		if (markdown === null) return false;
		this.setContent(markdown, filename, normalizedSource);
		this.showMessage(filename ? `Opened ${filename}` : "Opened markdown link");
		return true;
	}
	setupEventHandlers(rawElement) {
		if (!this.element) return;
		const toolbar = this.element.querySelector("[data-viewer-toolbar]");
		const content = this.element.querySelector("[data-viewer-content]");
		const shell = this.element.classList.contains("cw-view-viewer-shell") ? this.element : null;
		const renderTarget = this.queryViewerSlotted("[data-render-target]");
		let showRaw = false;
		toolbar?.addEventListener("click", (e) => {
			const button = e.target.closest("[data-action]");
			if (!button) return;
			switch (button.dataset.action) {
				case "open":
					this.handleOpen();
					break;
				case "paste":
					this.handlePasteFromToolbar();
					break;
				case "copy":
					this.handleCopy();
					break;
				case "toggle-raw":
					showRaw = !showRaw;
					if (renderTarget) renderTarget.hidden = showRaw;
					if (rawElement) rawElement.hidden = !showRaw;
					this.syncViewerRawMode(showRaw);
					break;
				case "copy-rendered":
					if (renderTarget) this.handleCopyRendered(renderTarget);
					break;
				case "download":
					this.handleDownload();
					break;
				case "export-docx":
					this.handleExportDocx();
					break;
				case "print":
					if (renderTarget) this.handlePrint(renderTarget);
					break;
				case "open-style-settings":
					this.handleOpenStyleSettings();
					break;
				case "toggle-outline":
					this.setOutlineVisible(!this.outlineVisible);
					break;
				case "attach":
					this.handleAttachToWorkCenter();
					break;
			}
		});
		const dropZone = shell || content;
		if (dropZone) {
			dropZone.addEventListener("mouseenter", () => {
				this.isPointerInView = true;
			});
			dropZone.addEventListener("mouseleave", () => {
				this.isPointerInView = false;
			});
			dropZone.addEventListener("dragover", (e) => {
				e.preventDefault();
				(shell ?? content)?.classList.add("dragover");
			});
			dropZone.addEventListener("dragleave", () => {
				(shell ?? content)?.classList.remove("dragover");
			});
			dropZone.addEventListener("drop", (e) => {
				e.preventDefault();
				(shell ?? content)?.classList.remove("dragover");
				this.handleFileDrop(e);
			});
		}
		this.pasteController?.abort();
		this.pasteController = new AbortController();
		document.addEventListener("paste", (e) => {
			this.handlePaste(e);
		}, { signal: this.pasteController.signal });
		renderTarget?.addEventListener("click", (e) => {
			const link = e.target?.closest?.("a[href]");
			if (!link) return;
			const href = (link.getAttribute("href") || "").trim();
			if (!href || href.startsWith("#")) return;
			if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
			const resolved = this.resolveUrlAgainstSource(href);
			if (!resolved) return;
			const rawLinkLooksRelative = !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href) && !href.startsWith("//");
			if (!(this.isLikelyMarkdownUrl(resolved) || rawLinkLooksRelative && !this.isLikelyBinaryAssetUrl(resolved))) return;
			e.preventDefault();
			this.openMarkdownSource(resolved).then((ok) => {
				if (!ok) this.showMessage("Failed to open markdown link");
			});
		});
	}
	handleOpen() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".md,.markdown,.txt,text/markdown,text/plain";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) try {
				const content = await file.text();
				this.setContent(content, file.name, null);
				this.showMessage(`Opened ${file.name}`);
			} catch (error) {
				console.error("[ViewerView] Failed to read file:", error);
				this.showMessage("Failed to read file");
			}
		};
		input.click();
	}
	async handleCopy() {
		const raw = this.contentRef.value || "";
		if (!raw.trim()) {
			this.showMessage("No content to copy");
			return;
		}
		try {
			const result = await Promise.race([writeText(raw), new Promise((resolve) => globalThis.setTimeout(() => resolve({
				ok: false,
				error: "Clipboard timeout"
			}), 3500))]);
			if (!result.ok) throw new Error(result.error || "Clipboard write failed");
			this.showMessage("Copied raw content to clipboard");
			this.options.onCopy?.(raw);
		} catch (error) {
			console.error("[ViewerView] Failed to copy:", error);
			this.showMessage("Failed to copy to clipboard");
		}
	}
	async handleCopyRendered(renderTarget) {
		await new Promise((r) => {
			if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => r());
			else globalThis.setTimeout(() => r(), 0);
		});
		const text = (renderTarget.querySelector(":scope > .view-viewer__md-root")?.textContent || renderTarget?.textContent || "").trim();
		if (!text) {
			this.showMessage("No content to copy");
			return;
		}
		if (text.length > VIEWER_MAX_RENDERED_COPY_CHARS) {
			this.showMessage("Rendered page is too large to copy as text — use Copy (raw) instead");
			return;
		}
		try {
			const result = await Promise.race([writeText(text), new Promise((resolve) => globalThis.setTimeout(() => resolve({
				ok: false,
				error: "Clipboard timeout"
			}), 3500))]);
			if (!result.ok) throw new Error(result.error || "Clipboard write failed");
			this.showMessage("Copied rendered text to clipboard");
		} catch {
			this.showMessage("Failed to copy rendered text");
		}
	}
	handleDownload() {
		const content = this.contentRef.value;
		const filename = this.options.filename || `document-${Date.now()}.md`;
		const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 250);
		this.showMessage(`Downloaded ${filename}`);
		this.options.onDownload?.(content, filename);
	}
	async handleExportDocx() {
		const content = this.contentRef.value;
		if (!content.trim()) {
			this.showMessage("No content to export");
			return;
		}
		try {
			const { downloadMarkdownAsDocx } = await import("../com/service19.js").then((n) => n.t);
			await downloadMarkdownAsDocx(content, {
				title: this.options.filename || "Markdown Content",
				filename: `document-${Date.now()}.docx`
			});
			this.showMessage("Exported as DOCX successfully");
		} catch (error) {
			console.error("[ViewerView] Failed to export DOCX:", error);
			this.showMessage("Failed to export as DOCX");
		}
	}
	handlePrint(renderTarget) {
		try {
			const rawTarget = this.queryViewerSlotted("[data-raw-target]");
			const printTarget = Boolean(rawTarget && !rawTarget.hidden) ? rawTarget : renderTarget;
			if (!printTarget || !(printTarget.textContent || "").trim()) {
				this.showMessage("No content to print");
				return;
			}
			printTarget.setAttribute("data-print", "true");
			globalThis?.print?.();
			setTimeout(() => {
				printTarget.removeAttribute("data-print");
			}, 1e3);
			this.options.onPrint?.(this.contentRef.value);
		} catch (error) {
			console.error("[ViewerView] Error printing content:", error);
			this.showMessage("Failed to print");
		}
	}
	async handleAttachToWorkCenter() {
		const content = this.contentRef.value || "";
		if (!content.trim()) {
			this.showMessage("No content to attach");
			return;
		}
		const initialMessage = {
			type: "content-share",
			contentType: "markdown",
			data: {
				text: content,
				content,
				filename: this.options.filename || `viewer-${Date.now()}.md`,
				source: "viewer-attach"
			}
		};
		if (this.shellContext && [
			"window",
			"tabbed",
			"environment"
		].includes(this.shellContext.shellId)) try {
			requestOpenView({
				viewId: "workcenter",
				target: "window",
				body: initialMessage,
				contentType: "application/json"
			});
			this.showMessage("Content attached to Work Center");
			return;
		} catch (error) {
			console.warn("[Viewer] windowed workcenter attach failed:", error);
		}
		await Promise.resolve(this.shellContext?.navigate("workcenter"));
		try {
			const { ViewRegistry } = await import("../com/app2.js").then((n) => n.s);
			const workcenter = ViewRegistry.getLoaded("workcenter") || await ViewRegistry.load("workcenter", { shellContext: this.shellContext });
			if (workcenter?.handleMessage) {
				await workcenter.handleMessage(initialMessage);
				this.showMessage("Content attached to Work Center");
				return;
			}
		} catch (error) {
			console.warn("[Viewer] direct workcenter attach failed:", error);
		}
		this.showMessage("Attach failed — open Work Center and try again");
	}
	handleOpenStyleSettings() {
		try {
			this.shellContext?.navigate("settings", {
				tab: "markdown",
				focus: "style"
			});
			this.showMessage("Opened Markdown style settings");
		} catch (error) {
			console.warn("[Viewer] Failed to open style settings:", error);
			this.showMessage("Failed to open style settings");
		}
	}
	handleFileDrop(e) {
		const file = e.dataTransfer?.files?.[0];
		if (file && (file.type.includes("text") || file.name.endsWith(".md"))) file.text().then((content) => {
			this.setContent(content);
			this.showMessage(`Loaded ${file.name}`);
		}).catch(() => {
			this.showMessage("Failed to read dropped file");
		});
	}
	async handlePaste(e) {
		if (!this.shouldHandlePaste(e)) return;
		if (!e.clipboardData) return;
		const itemFiles = Array.from(e.clipboardData.items || []).map((item) => item.kind === "file" && item.getAsFile ? item.getAsFile() : null).filter((file) => !!file);
		const files = itemFiles.length > 0 ? itemFiles : Array.from(e.clipboardData.files || []);
		const text = e.clipboardData.getData("text/plain");
		if (files.length === 0 && (!text || !text.trim())) return;
		e.preventDefault();
		e.stopPropagation();
		await this.ingestPastedPayload(files, text);
	}
	/**
	* Mobile / no-keyboard: read clipboard via Async Clipboard API (user gesture from toolbar tap).
	*/
	async handlePasteFromToolbar() {
		if (!this.element || !this.isViewVisible) {
			this.showMessage("Open the Viewer tab to paste");
			return;
		}
		if (document.visibilityState !== "visible") return;
		if (this.shellContext?.navigationState?.currentView && this.shellContext.navigationState.currentView !== this.id) {
			this.showMessage("Open the Viewer tab to paste");
			return;
		}
		try {
			const { files, text } = await this.readSystemClipboard();
			if (files.length === 0 && (!text || !text.trim())) {
				this.showMessage("Clipboard is empty or access denied");
				return;
			}
			await this.ingestPastedPayload(files, text);
		} catch (error) {
			console.error("[ViewerView] Paste from toolbar failed:", error);
			this.showMessage("Could not read clipboard — check permissions");
		}
	}
	async readSystemClipboard() {
		const files = [];
		let text;
		if (typeof navigator === "undefined" || !navigator.clipboard) return {
			files,
			text
		};
		try {
			if (typeof navigator.clipboard.read === "function") {
				const items = await Promise.race([navigator.clipboard.read(), new Promise((resolve) => globalThis.setTimeout(() => resolve([]), 3500))]);
				let mdNameIndex = 0;
				for (const item of items) for (const type of item.types) {
					const lower = type.toLowerCase();
					if (lower === "text/html") continue;
					let blob;
					try {
						blob = await item.getType(type);
					} catch {
						continue;
					}
					if (!blob || blob.size === 0) continue;
					if (lower === "text/plain") {
						if (blob.size > VIEWER_CLIPBOARD_READ_TEXT_MAX_BYTES) continue;
						const t = await blob.text();
						if (t) text = text ?? t;
						continue;
					}
					if (lower.startsWith("image/")) {
						const ext = lower.split("/")[1] || "img";
						files.push(new File([blob], `paste.${ext}`, { type }));
						continue;
					}
					if (lower === "text/markdown" || lower === "text/x-markdown" || lower === "text/md" || lower.includes("markdown")) {
						if (blob.size > VIEWER_CLIPBOARD_READ_TEXT_MAX_BYTES) continue;
						files.push(new File([blob], `pasted-${mdNameIndex++}.md`, { type: "text/markdown" }));
						continue;
					}
					if (lower.startsWith("text/")) {
						if (blob.size > VIEWER_CLIPBOARD_READ_TEXT_MAX_BYTES) continue;
						files.push(new File([blob], `pasted-${mdNameIndex++}.md`, { type }));
						continue;
					}
					const sniffed = await this.sniffBlobAsUtf8MarkdownFile(blob, mdNameIndex);
					if (sniffed) {
						files.push(sniffed);
						mdNameIndex++;
					}
				}
				if (files.length > 0 || text && text.trim()) return {
					files,
					text
				};
			}
		} catch {}
		try {
			const t = await navigator.clipboard.readText();
			if (t) text = text ?? t;
		} catch {}
		return {
			files,
			text
		};
	}
	/**
	* Clipboard sometimes exposes a copied file as application/octet-stream; if bytes look like UTF-8 text, open as .md.
	*/
	async sniffBlobAsUtf8MarkdownFile(blob, nameIndex) {
		if (blob.size > 4 * 1024 * 1024) return null;
		const sampleSize = Math.min(blob.size, 24576);
		const sample = blob.slice(0, sampleSize);
		const buf = new Uint8Array(await sample.arrayBuffer());
		if (buf.length === 0) return null;
		if (buf.includes(0)) return null;
		let printable = 0;
		for (let i = 0; i < buf.length; i++) {
			const c = buf[i];
			if (c === 9 || c === 10 || c === 13 || c >= 32 && c < 127 || c >= 160) printable++;
		}
		if (printable / buf.length < .9) return null;
		return new File([blob], `pasted-${nameIndex}.md`, { type: "text/markdown" });
	}
	async ingestPastedPayload(files, textPlain) {
		if (files.length > 0) {
			const textFile = files.find((file) => this.isTextLikeFile(file)) || files[0];
			try {
				if (!this.isTextLikeFile(textFile)) {
					this.showMessage(`Unsupported file type for viewer: ${textFile.name || textFile.type || "binary file"}`);
					return;
				}
				const content = await textFile.text();
				this.setContent(content, textFile.name);
				this.showMessage(`Opened ${textFile.name || "pasted document"}`);
				return;
			} catch (error) {
				console.error("[ViewerView] Failed to read pasted file:", error);
				this.showMessage("Failed to read pasted file");
				return;
			}
		}
		const text = textPlain;
		if (!text || !text.trim()) return;
		try {
			const raw = text.trim();
			if (raw.length <= VIEWER_INGEST_BASE64_PROBE_MAX && (parseDataUrl(raw) || isBase64Like(raw))) {
				const asset = await normalizeDataAsset(raw, {
					namePrefix: "pasted-doc",
					uriComponent: true
				});
				if (!this.isTextLikeFile(asset.file)) {
					this.showMessage("Pasted data is not a text/markdown document");
					return;
				}
				const content = await asset.file.text();
				this.setContent(content, asset.file.name, null);
				this.showMessage("Opened pasted encoded document");
				return;
			}
			this.setContent(raw, void 0, null);
			this.showMessage("Content pasted");
		} catch (error) {
			console.error("[ViewerView] Failed to process pasted data:", error);
			this.showMessage("Failed to process pasted content");
		}
	}
	isTextLikeFile(file) {
		const name = (file.name || "").toLowerCase();
		const type = (file.type || "").toLowerCase();
		if (!type || type.startsWith("text/")) return true;
		if (type.includes("markdown") || type.includes("json") || type.includes("xml")) return true;
		return [
			".md",
			".markdown",
			".txt",
			".json",
			".xml",
			".html",
			".htm",
			".css",
			".js",
			".ts",
			".tsx",
			".yml",
			".yaml"
		].some((ext) => name.endsWith(ext));
	}
	shouldHandlePaste(e) {
		if (!this.element || !this.isViewVisible) return false;
		if (document.visibilityState !== "visible") return false;
		if (this.shellContext?.navigationState?.currentView && this.shellContext.navigationState.currentView !== this.id) return false;
		const target = e.target;
		if (!target) return false;
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return false;
		const hasFocusWithinView = this.viewBranchesContain(document.activeElement);
		const targetInView = this.viewBranchesContain(target);
		const hoverWithinView = this.isPointerInView || this.viewBranchesHover();
		return targetInView || hasFocusWithinView || hoverWithinView;
	}
	saveState() {
		this.stateManager.save({
			content: this.contentRef.value,
			filename: this.options.filename
		});
	}
	showMessage(message) {
		if (this.shellContext) this.shellContext.showMessage(message);
		else console.log(`[Viewer] ${message}`);
	}
	normalizeMarkdownExtensionFlags(rawFlags) {
		return (rawFlags || DEFAULT_MARKDOWN_EXTENSION_FLAGS).split("").filter((flag, index, array) => /[dgimsuvy]/.test(flag) && array.indexOf(flag) === index).join("") || DEFAULT_MARKDOWN_EXTENSION_FLAGS;
	}
	applyCustomMarkdownExtensions(markdown) {
		const source = markdown || "";
		const rules = Array.isArray(this.markdownSettings.extensions) ? this.markdownSettings.extensions : [];
		if (rules.length === 0 || !source) return source;
		let result = source;
		for (const rule of rules) {
			if (!rule || rule.enabled === false) continue;
			const pattern = (rule.pattern || "").trim();
			if (!pattern) continue;
			try {
				const regex = new RegExp(pattern, this.normalizeMarkdownExtensionFlags(rule.flags));
				result = result.replace(regex, rule.replacement ?? "");
			} catch (error) {
				console.warn("[Viewer] Skipping invalid markdown extension rule:", {
					id: rule.id,
					pattern,
					flags: rule.flags,
					error
				});
			}
		}
		return result;
	}
	applyMarkdownPlugins(markdown) {
		let result = markdown || "";
		if (!result) return result;
		if (this.markdownSettings.plugins.smartTypography) result = result.replace(/\.\.\./g, "&hellip;").replace(/(^|[^\-])---([^\-]|$)/g, "$1&mdash;$2").replace(/(^|[^\-])--([^\-]|$)/g, "$1&ndash;$2");
		if (this.markdownSettings.plugins.softBreaksAsBr) result = result.replace(/([^\n])\n(?!\n)/g, "$1  \n");
		return result;
	}
	getFontFamilyFromPreset() {
		const preset = this.markdownSettings.fontFamily;
		if (preset === "serif") return "Georgia, Cambria, 'Times New Roman', Times, serif";
		if (preset === "mono") return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
		if (preset === "sans") return "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
		return "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
	}
	applyRenderedLinkBehavior(root) {
		const links = Array.from(root.querySelectorAll("a[href]"));
		for (const link of links) {
			const href = (link.getAttribute("href") || "").trim();
			if (!href) continue;
			const isHash = href.startsWith("#");
			const isExternal = /^(https?:)?\/\//i.test(href);
			if (this.markdownSettings.plugins.externalLinksNewTab && isExternal && !isHash) {
				link.target = "_blank";
				link.rel = "noopener noreferrer";
			} else {
				if (link.target === "_blank") link.removeAttribute("target");
				if (link.rel === "noopener noreferrer") link.removeAttribute("rel");
			}
		}
	}
	createLayerBlock(layerName, cssText) {
		const body = (cssText || "").trim();
		if (!body) return "";
		return `@layer ${layerName} {\n${body}\n}`;
	}
	normalizeUserCssForLayer(layerName, cssText) {
		const trimmed = (cssText || "").trim();
		if (!trimmed) return "";
		if (trimmed.startsWith("@layer")) return trimmed;
		return this.createLayerBlock(layerName, trimmed);
	}
	getPresetVariablesCss() {
		const preset = this.markdownSettings.preset;
		if (preset === "classic") return `
                --md-letter-spacing: 0;
                --md-h1-size: 2.05em;
                --md-h2-size: 1.65em;
                --md-p-margin: 1.05em;
            `;
		if (preset === "compact") return `
                --md-letter-spacing: -0.01em;
                --md-h1-size: 1.8em;
                --md-h2-size: 1.45em;
                --md-p-margin: 0.72em;
            `;
		if (preset === "paper") return `
                --md-letter-spacing: 0.005em;
                --md-h1-size: 2em;
                --md-h2-size: 1.6em;
                --md-p-margin: 0.95em;
            `;
		return `
            --md-letter-spacing: 0;
            --md-h1-size: 1.95em;
            --md-h2-size: 1.55em;
            --md-p-margin: 0.9em;
        `;
	}
	buildCustomStyleText() {
		const pageSize = this.markdownSettings.page.size || "auto";
		const pageOrientation = this.markdownSettings.page.orientation || "portrait";
		const pageMargin = Number.isFinite(this.markdownSettings.page.marginMm) ? Math.max(5, Math.min(40, this.markdownSettings.page.marginMm)) : 12;
		const printScale = Number.isFinite(this.markdownSettings.printScale) ? Math.max(.5, Math.min(1.5, this.markdownSettings.printScale)) : 1;
		const fontSizePx = Number.isFinite(this.markdownSettings.fontSizePx) ? Math.max(12, Math.min(26, this.markdownSettings.fontSizePx)) : 16;
		const lineHeight = Number.isFinite(this.markdownSettings.lineHeight) ? Math.max(1.1, Math.min(2.2, this.markdownSettings.lineHeight)) : 1.7;
		Number.isFinite(this.markdownSettings.contentMaxWidthPx) && Math.max(500, Math.min(1400, this.markdownSettings.contentMaxWidthPx));
		const systemCss = `
            .cw-view-viewer-shell .markdown-viewer-content {
                font-family: ${this.getFontFamilyFromPreset()};
                font-size: ${fontSizePx}px;
                line-height: ${lineHeight};
                letter-spacing: var(--md-letter-spacing, 0);
                padding: 1rem 1.1rem 3rem;
            }

            .cw-view-viewer-shell .markdown-viewer-content h1 { font-size: var(--md-h1-size, 1.95em); }
            .cw-view-viewer-shell .markdown-viewer-content h2 { font-size: var(--md-h2-size, 1.55em); }
            .cw-view-viewer-shell .markdown-viewer-content p,
            .cw-view-viewer-shell .markdown-viewer-content li {
                margin-block: var(--md-p-margin, 0.9em);
            }

            .cw-view-viewer-shell .markdown-viewer-content {
                ${this.getPresetVariablesCss()}
            }
        `;
		const modulesCss = `
            ${this.markdownSettings.modules.typography ? "" : `
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root p,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root li,
            .cw-view-viewer-shell .markdown-viewer-content p,
            .cw-view-viewer-shell .markdown-viewer-content li {
                margin-block: 0.35em;
            }
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root h1,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root h2,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root h3,
            .cw-view-viewer-shell .markdown-viewer-content h1,
            .cw-view-viewer-shell .markdown-viewer-content h2,
            .cw-view-viewer-shell .markdown-viewer-content h3 {
                margin-block: 0.45em;
            }`}

            ${this.markdownSettings.modules.lists ? `
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root ul,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root ol {
                margin-block: 0.65em;
                padding-inline-start: 1.35em;
            }
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root li {
                margin-block: 0.28em;
            }
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root li > ul,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root li > ol {
                margin-block: 0.4em;
            }` : `
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root ul,
            .cw-view-viewer-shell .markdown-viewer-content .view-viewer__md-root ol {
                padding-inline-start: 1.15em;
            }`}

            ${this.markdownSettings.modules.codeBlocks ? `
            .cw-view-viewer-shell .markdown-viewer-content pre {
                border-radius: 10px;
                padding: 0.8rem 1rem;
                overflow-x: auto;
            }
            .cw-view-viewer-shell .markdown-viewer-content code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
                font-size: 0.92em;
            }` : ""}

            ${this.markdownSettings.modules.tables ? `
            .cw-view-viewer-shell .markdown-viewer-content table {
                inline-size: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
            }
            .cw-view-viewer-shell .markdown-viewer-content th,
            .cw-view-viewer-shell .markdown-viewer-content td {
                border: 1px solid color-mix(in oklab, currentColor 18%, transparent);
                padding: 0.45rem 0.6rem;
                text-align: left;
                vertical-align: top;
            }` : ""}

            ${this.markdownSettings.modules.blockquotes ? `
            .cw-view-viewer-shell .markdown-viewer-content blockquote {
                border-inline-start: 4px solid color-mix(in oklab, currentColor 30%, transparent);
                padding-inline: 1rem;
                margin-inline: 0;
            }` : ""}

            ${this.markdownSettings.modules.media ? `
            .cw-view-viewer-shell .markdown-viewer-content img,
            .cw-view-viewer-shell .markdown-viewer-content video {
                max-inline-size: 100%;
                border-radius: 8px;
                display: block;
                margin-inline: auto;
            }` : ""}
        `;
		const builtInPrintCss = `
            @media print {
                .cw-view-viewer-shell .markdown-viewer-content {
                    zoom: ${printScale};
                }
                ${this.markdownSettings.modules.printBreaks ? `
                .cw-view-viewer-shell .markdown-viewer-content h1,
                .cw-view-viewer-shell .markdown-viewer-content h2,
                .cw-view-viewer-shell .markdown-viewer-content h3 {
                    break-after: avoid-page;
                    break-inside: avoid;
                }
                .cw-view-viewer-shell .markdown-viewer-content pre,
                .cw-view-viewer-shell .markdown-viewer-content table,
                .cw-view-viewer-shell .markdown-viewer-content blockquote {
                    break-inside: avoid;
                }` : ""}
            }
        `;
		const screenCss = [this.userStyleModules.screenCss, (this.markdownSettings.customCss || "").trim()].map((value) => (value || "").trim()).filter(Boolean).join("\n\n");
		const userPrintCss = [this.userStyleModules.printCss, (this.markdownSettings.printCss || "").trim()].map((value) => (value || "").trim()).filter(Boolean).join("\n\n");
		const pageCss = pageSize !== "auto" ? `@page { size: ${pageSize} ${pageOrientation}; margin: ${pageMargin}mm; }` : "";
		return [
			`@layer ${VIEWER_CSS_LAYER_ORDER.join(", ")};`,
			this.createLayerBlock("rs-md-system", systemCss),
			this.createLayerBlock("rs-md-modules", modulesCss),
			this.normalizeUserCssForLayer("rs-md-user", screenCss),
			this.createLayerBlock("rs-md-print", `${builtInPrintCss}\n${pageCss}`),
			this.normalizeUserCssForLayer("rs-md-user-print", userPrintCss ? `@media print {\n${userPrintCss}\n}` : "")
		].filter(Boolean).join("\n\n");
	}
	async loadUserStyleModules() {
		const result = {
			screenCss: "",
			printCss: ""
		};
		try {
			const dir = openDirectory(null, "/user/styles/", { create: true });
			await dir;
			const names = (await Array.fromAsync(dir.entries?.() ?? [])).map((entry) => String(entry?.[0] || "").trim()).filter((name) => !!name && name.toLowerCase().endsWith(".css")).sort((a, b) => a.localeCompare(b));
			const screenChunks = [];
			const printChunks = [];
			for (const name of names) {
				const file = await provide(`/user/styles/${name}`).catch(() => null);
				const cssText = file ? await file.text().catch(() => "") : "";
				if (!cssText.trim()) continue;
				if (name.toLowerCase().endsWith(".print.css")) printChunks.push(`/* ${name} */\n${cssText}`);
				else screenChunks.push(`/* ${name} */\n${cssText}`);
			}
			result.screenCss = screenChunks.join("\n\n").trim();
			result.printCss = printChunks.join("\n\n").trim();
		} catch (error) {
			console.warn("[Viewer] Failed to load /user/styles modules:", error);
		}
		this.userStyleModules = result;
	}
	applyCustomStyles() {
		if (this.customSheet) {
			removeAdopted(this.customSheet);
			this.customSheet = null;
		}
		const styleText = this.buildCustomStyleText();
		if (!styleText) return;
		try {
			this.customSheet = loadAsAdopted(styleText);
		} catch (error) {
			console.warn("[Viewer] Failed to load custom markdown styles:", error);
			this.customSheet = null;
		}
		this.syncAdoptedSheetsToShadow();
	}
	async loadMarkdownSettings() {
		try {
			const markdown = (await loadSettings())?.appearance?.markdown;
			this.markdownSettings = {
				preset: markdown?.preset || "default",
				fontFamily: markdown?.fontFamily || "system",
				fontSizePx: Number(markdown?.fontSizePx ?? 16),
				lineHeight: Number(markdown?.lineHeight ?? 1.7),
				contentMaxWidthPx: Number(markdown?.contentMaxWidthPx ?? 860),
				printScale: Number(markdown?.printScale ?? 1),
				page: {
					size: markdown?.page?.size || "auto",
					orientation: markdown?.page?.orientation || "portrait",
					marginMm: Number(markdown?.page?.marginMm ?? 12)
				},
				modules: {
					typography: (markdown?.modules?.typography ?? true) !== false,
					lists: (markdown?.modules?.lists ?? true) !== false,
					tables: (markdown?.modules?.tables ?? true) !== false,
					codeBlocks: (markdown?.modules?.codeBlocks ?? true) !== false,
					blockquotes: (markdown?.modules?.blockquotes ?? true) !== false,
					media: (markdown?.modules?.media ?? true) !== false,
					printBreaks: (markdown?.modules?.printBreaks ?? true) !== false
				},
				plugins: {
					smartTypography: Boolean(markdown?.plugins?.smartTypography),
					softBreaksAsBr: Boolean(markdown?.plugins?.softBreaksAsBr),
					externalLinksNewTab: (markdown?.plugins?.externalLinksNewTab ?? true) !== false
				},
				customCss: (markdown?.customCss || "").trim(),
				printCss: (markdown?.printCss || "").trim(),
				extensions: Array.isArray(markdown?.extensions) ? markdown.extensions : []
			};
			await this.loadUserStyleModules();
			this.applyCustomStyles();
			this.onRefresh();
		} catch (error) {
			console.warn("[Viewer] Failed to load markdown settings:", error);
		}
	}
	onMount() {
		console.log("[Viewer] Mounted");
		ensureViewerIconRuntime();
		this._sheet ??= loadAsAdopted(viewer_default);
		this.applyCustomStyles();
		this.markdownSettingsPromise;
		this.isViewVisible = true;
	}
	onUnmount() {
		console.log("[Viewer] Unmounting");
		this.saveState();
		this.isViewVisible = false;
		this.isPointerInView = false;
		this.pasteController?.abort();
		this.pasteController = null;
		if (this.customSheet) {
			removeAdopted(this.customSheet);
			this.customSheet = null;
		}
		removeAdopted(this._sheet);
		this.element = null;
		this.slotProjectingHost = null;
	}
	onShow() {
		this._sheet ??= loadAsAdopted(viewer_default);
		this.applyCustomStyles();
		this.markdownSettingsPromise = this.loadMarkdownSettings();
		this.isViewVisible = true;
		console.log("[Viewer] Shown");
	}
	onHide() {
		this.saveState();
		this.isViewVisible = false;
		this.isPointerInView = false;
		console.log("[Viewer] Hidden");
	}
	onRefresh() {
		const renderTarget = this.queryViewerSlotted("[data-render-target]");
		const rawTarget = this.queryViewerSlotted("[data-raw-target]");
		if (renderTarget && rawTarget) this.renderMarkdown(this.contentRef.value, renderTarget, rawTarget);
	}
	canHandleMessage(messageType) {
		return [
			"content-view",
			"content-load",
			"markdown-content",
			"content-share",
			"share-target-input"
		].includes(messageType);
	}
	async handleMessage(message) {
		const msg = message;
		if (msg.data?.text || msg.data?.content) {
			const content = msg.data.text || msg.data.content || "";
			const source = msg.data.source || msg.data.src || msg.data.path;
			this.setContent(content, msg.data.filename, source);
			return;
		}
		if (msg.data?.url) {
			const source = msg.data.source || msg.data.src || msg.data.path || msg.data.url;
			if (!await this.openMarkdownSource(source, msg.data.filename)) {
				const fallbackContent = `> Failed to load markdown from:\n> ${source}`;
				this.setContent(fallbackContent, msg.data.filename, source);
			}
			return;
		}
		const fileCandidate = msg.data?.file instanceof File ? msg.data.file : Array.isArray(msg.data?.files) ? msg.data?.files.find((f) => f instanceof File) : null;
		if (fileCandidate) try {
			const text = await fileCandidate.text();
			const source = msg.data?.source || msg.data?.src || msg.data?.path || fileCandidate.name;
			this.setContent(text || "", msg.data?.filename || fileCandidate.name, source);
		} catch (error) {
			console.warn("[Viewer] Failed to read markdown file payload:", error);
		}
	}
};
ViewerView = __decorate([defineElement("cw-viewer-view")], ViewerView);
/**
* Create a viewer view instance
*/
function createView(options) {
	return new ViewerView(options);
}
/** Alias for createView */
var createMarkdownView = createView;
/**
* <md-view> Web Component and MarkdownViewer API
*
* Unified markdown rendering service that provides both:
* - Web Component API: <md-view src="..." content="..."></md-view>
*   Parsed HTML is rendered into a light-DOM `.markdown-body` child (default slot); shadow DOM holds layout/chrome only.
* - Class-based API: createMarkdownViewer({ content: "...", ... })
*
* Usage:
*   // Web Component
*   <md-view content="# Hello World"></md-view>
*   <md-view src="/path/to/file.md"></md-view>
*
*   // Class-based API
*   import { createMarkdownViewer } from "fest/fl-ui/services/markdown-view";
*   const viewer = createMarkdownViewer({ content: "# Hello", showActions: true });
*   document.body.append(viewer.render());
*
* See fest/fl-ui/services/markdown-view/Markdown for implementation.
*/
//#endregion
export { ViewerView, createMarkdownView, createView, createView as default, warmViewerMarkdownEngine };
