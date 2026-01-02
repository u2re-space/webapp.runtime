import"./fest/dom.js";import"./fest/core.js";import{f as t}from"./fest/object.js";import{H as e}from"./fest/lure.js";import{D as s,r as a,s as i,w as n,e as o}from"./RecognizeData.js";import{l as r,s as l}from"./RuntimeSettings.js";import{addInstruction as c,addInstructions as d,setActiveInstruction as u,deleteInstruction as p,updateInstruction as h}from"./CustomInstructions.js";import"./fest/icon.js";import{m}from"./vendor/marked.js";import{m as v}from"./vendor/marked-katex-extension.js";import{D as g}from"./vendor/isomorphic-dompurify.js";import{e as y}from"./GPT-Responses.js";import{M as b,c as w}from"./MarkdownViewer.js";import{Q as f}from"./vendor/quill.js";m?.use?.(v({throwOnError:!1,nonStandard:!0,output:"mathml",strict:!1}));class S{state;deps;constructor(t){this.deps=t,this.state={files:[],selectedFiles:[],currentPrompt:"",autoAction:!1,selectedInstruction:"",outputFormat:"markdown",selectedLanguage:"auto",voiceRecording:!1,promptTemplates:this.loadPromptTemplates(),lastRawResult:null,recognizedContent:null,contentSource:null}}getState(){return this.state}renderWorkCenterView(){const t=e`<div class="workcenter-view">
      <div class="workcenter-header">
        <h2>AI Work Center</h2>
        <div class="control-selectors">
          <div class="format-selector">
            <label>Output Format:</label>
            <select class="format-select">
              <option value="markdown" ${"markdown"===this.state.outputFormat?"selected":""}>Markdown</option>
              <option value="json" ${"json"===this.state.outputFormat?"selected":""}>JSON</option>
              <option value="text" ${"text"===this.state.outputFormat?"selected":""}>Plain Text</option>
              <option value="html" ${"html"===this.state.outputFormat?"selected":""}>HTML</option>
            </select>
          </div>
          <div class="language-selector">
            <label>Language:</label>
            <select class="language-select">
              <option value="auto" ${"auto"===this.state.selectedLanguage?"selected":""}>Auto</option>
              <option value="en" ${"en"===this.state.selectedLanguage?"selected":""}>English</option>
              <option value="ru" ${"ru"===this.state.selectedLanguage?"selected":""}>Русский</option>
            </select>
          </div>
        </div>
      </div>

      <div class="workcenter-content">
        <div class="left-panel">
          <div class="input-section">
            <div class="file-input-area" data-dropzone>
              <div class="file-drop-zone">
                <div class="drop-zone-content">
                  <ui-icon icon="folder" size="4rem" icon-style="duotone" class="drop-icon"></ui-icon>
                  <div class="drop-text">Drop files here or click to browse</div>
                  <div class="drop-hint">Supports: Images, Documents, Text files, PDFs</div>
                  <button class="btn file-select-btn" data-action="select-files">Choose Files</button>
                </div>
              </div>
              <div class="file-list" data-file-list></div>
              ${this.state.recognizedContent?e`<div class="recognized-status">
                <ui-icon icon="check-circle" size="16" icon-style="duotone" class="status-icon"></ui-icon>
                <span>Content recognized - ready for actions</span>
                <button class="btn small clear-recognized" data-action="clear-recognized">Clear</button>
              </div>`:""}
            </div>
          </div>

          <div class="history-section">
            <div class="history-header">
              <h3>Recent Activity</h3>
              <button class="btn" data-action="view-full-history">View All History</button>
            </div>
            <div class="recent-history" data-recent-history></div>
          </div>
        </div>

        <div class="right-panel">
          <div class="output-section">
            <div class="output-header">
              <h3>Results</h3>
              <div class="output-actions">
                <button class="btn btn-icon" data-action="copy-results" title="Copy results">
                  <ui-icon icon="copy" size="18" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Copy</span>
                </button>
                <button class="btn btn-icon" data-action="clear-results" title="Clear results">
                  <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Clear</span>
                </button>
              </div>
            </div>
            <div class="output-content" data-output></div>
          </div>

          <div class="prompt-section">
            <div class="prompt-input-group">
              <div class="prompt-controls">
                <select class="template-select">
                  <option value="">Select Template...</option>
                  ${this.state.promptTemplates.map(t=>e`<option value="${t.prompt}">${t.name}</option>`)}
                </select>
                <button class="btn btn-icon" data-action="edit-templates" title="Edit Templates">
                  <ui-icon icon="gear" size="18" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Templates</span>
                </button>
              </div>
              <textarea
                class="prompt-input"
                placeholder="Describe what you want to do with the content... (or use voice input)"
                rows="3"
              >${this.state.currentPrompt}</textarea>
              <div class="prompt-actions">
                <button class="btn voice-btn ${this.state.voiceRecording?"recording":""}" data-action="voice-input">
                  🎤 ${this.state.voiceRecording?"Recording...":"Hold for Voice"}
                </button>
                <button class="btn clear-btn" data-action="clear-prompt">Clear</button>
              </div>
            </div>
          </div>

          <div class="action-section">
            <div class="action-controls">
              <label class="auto-action-label">
                <input type="checkbox" class="auto-action-checkbox" ${this.state.autoAction?"checked":""}>
                Auto-action (use last successful)
              </label>
              <div class="action-buttons">
                <button class="btn primary action-btn" data-action="execute">
                  <ui-icon icon="brain" size="20" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Recognize & Take Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;return this.setupWorkCenterEvents(t),this.updateFileList(t),this.updateRecentHistory(t),t}setupWorkCenterEvents(t){const s=t.querySelector('[data-action="select-files"]'),a=e`<input type="file" multiple accept="image/*,.pdf,.txt,.md,.json,.html,.css,.js,.ts" style="display:none">`;t.append(a),s.addEventListener("click",()=>a.click()),a.addEventListener("change",e=>{const s=Array.from(e.target.files||[]);this.state.files.push(...s),this.clearRecognizedContent(),this.updateFileList(t)});const i=t.querySelector("[data-dropzone]");i.addEventListener("dragover",t=>{t.preventDefault(),i.classList.add("drag-over")}),i.addEventListener("dragleave",()=>{i.classList.remove("drag-over")}),i.addEventListener("drop",e=>{e.preventDefault(),i.classList.remove("drag-over");const s=Array.from(e.dataTransfer?.files||[]);this.state.files.push(...s),this.clearRecognizedContent(),this.updateFileList(t)}),t.addEventListener("paste",e=>{const s=Array.from(e.clipboardData?.files||[]);s.length>0&&(e.preventDefault(),this.state.files.push(...s),this.clearRecognizedContent(),this.updateFileList(t))});const n=t.querySelector(".template-select");n.addEventListener("change",()=>{const e=n.value;e&&(this.state.currentPrompt=e,this.updatePromptInput(t))});const o=t.querySelector(".prompt-input");o.addEventListener("input",()=>{this.state.currentPrompt=o.value});const r=t.querySelector('[data-action="voice-input"]');r.addEventListener("mousedown",()=>this.startVoiceRecording(t)),r.addEventListener("mouseup",()=>this.stopVoiceRecording(t)),r.addEventListener("mouseleave",()=>this.stopVoiceRecording(t));const l=t.querySelector(".format-select");l.addEventListener("change",()=>{const e=l.value;if(this.state.outputFormat=e,this.state.lastRawResult){const s=t.querySelector("[data-output]"),a=this.formatResult(this.state.lastRawResult,e);s.innerHTML=`<div class="result-content">${a}</div>`}});const c=t.querySelector(".language-select");c.addEventListener("change",()=>{this.state.selectedLanguage=c.value});const d=t.querySelector(".auto-action-checkbox");d.addEventListener("change",()=>{this.state.autoAction=d.checked}),t.addEventListener("click",async e=>{const s=e.target,a=s.closest("[data-action]")?.getAttribute("data-action");if(a)switch(a){case"edit-templates":this.showTemplateEditor(t);break;case"clear-prompt":this.state.currentPrompt="",this.updatePromptInput(t);break;case"copy-results":await this.copyResults(t);break;case"clear-results":this.clearResults(t);break;case"view-full-history":this.deps.state.view="history",this.deps.render();break;case"execute":await this.executeUnifiedAction(t);break;case"clear-recognized":this.clearRecognizedContent();const e=t.querySelector(".recognized-status");e&&e.remove()}})}updateFileList(t){const s=t.querySelector("[data-file-list]");s.innerHTML="",0!==this.state.files.length?this.state.files.forEach((a,i)=>{const n=e`<div class="file-item">
        <div class="file-info">
          <span class="file-icon">${this.createFileIconElement(a.type)}</span>
          <span class="file-name">${a.name}</span>
          <span class="file-size">(${this.formatFileSize(a.size)})</span>
        </div>
        <button class="btn small remove-btn" data-remove="${i}">✕</button>
      </div>`;n.querySelector(".remove-btn")?.addEventListener("click",()=>{this.state.files.splice(i,1),this.clearRecognizedContent(),this.updateFileList(t)}),s.append(n)}):s.innerHTML='<div class="no-files">No files selected</div>'}updatePromptInput(t){t.querySelector(".prompt-input").value=this.state.currentPrompt}updateRecentHistory(t){const s=t.querySelector("[data-recent-history]");s.innerHTML="";const a=this.deps.history.slice(-3).reverse();0!==a.length?a.forEach(a=>{const i=e`<div class="history-item-compact">
        <div class="history-meta">
          <span class="history-status ${a.ok?"success":"error"}">${a.ok?"✓":"✗"}</span>
          <span class="history-prompt">${a.prompt.substring(0,50)}${a.prompt.length>50?"...":""}</span>
        </div>
        <button class="btn small" data-restore="${this.deps.history.indexOf(a)}">Use</button>
      </div>`;i.querySelector("button")?.addEventListener("click",()=>{this.state.currentPrompt=a.prompt,this.updatePromptInput(t)}),s.append(i)}):s.innerHTML='<div class="no-history">No recent activity</div>'}async startVoiceRecording(t){if(!this.state.voiceRecording){this.state.voiceRecording=!0,this.updateVoiceButton(t);try{const e=await this.deps.getSpeechPrompt();e&&(this.state.currentPrompt=e,this.updatePromptInput(t))}catch(e){console.warn("Voice recording failed:",e)}finally{this.state.voiceRecording=!1,this.updateVoiceButton(t)}}}stopVoiceRecording(t){this.state.voiceRecording=!1,this.updateVoiceButton(t)}updateVoiceButton(t){const e=t.querySelector('[data-action="voice-input"]');e.textContent=this.state.voiceRecording?"🎤 Recording...":"🎤 Hold for Voice",e.classList.toggle("recording",this.state.voiceRecording)}async executeUnifiedAction(t){if(0===this.state.files.length&&!this.state.currentPrompt.trim()&&!this.state.recognizedContent)return void this.deps.showMessage("Please select files or enter a prompt first");const e=t.querySelector("[data-output]");let s="Processing...";this.state.recognizedContent&&"recognized"===this.state.contentSource?s="Processing recognized content...":this.state.files.length>0&&(s=`Processing ${this.state.files.length} file${this.state.files.length>1?"s":""}...`),e.innerHTML=`<div class="processing">${s}</div>`;try{let t,s=this.state.currentPrompt.trim()||(this.state.autoAction?this.getLastSuccessfulPrompt():"Analyze and process the provided content intelligently");if("auto"!==this.state.selectedLanguage&&(s=`${"ru"===this.state.selectedLanguage?"Please respond in Russian language.":"Please respond in English language."} ${s}`),this.state.recognizedContent&&"recognized"===this.state.contentSource)t=await a(this.state.recognizedContent,s,void 0,void 0,{customInstruction:s,useActiveInstruction:!this.state.currentPrompt.trim()}),this.state.contentSource="recognized";else if(this.state.files.length>0){const e=await Promise.all(this.state.files.map(async t=>t.type.startsWith("image/")?t:await t.text()));let i;i=1===e.length?e[0]:e.map((t,e)=>`File ${e+1} (${this.state.files[e].name}):\n${t}`).join("\n\n---\n\n"),t=await a(i,s,void 0,void 0,{customInstruction:s,useActiveInstruction:!this.state.currentPrompt.trim()}),t?.ok&&"string"==typeof i&&(this.state.recognizedContent=i,this.state.contentSource="files")}else t=await a(s,"Analyze and respond to the following request",void 0,void 0,{customInstruction:s,useActiveInstruction:!1});this.state.lastRawResult=t;const i=this.formatResult(t,this.state.outputFormat);e.innerHTML=`<div class="result-content">${i}</div>`,this.addToHistory(s,i,!0)}catch(i){const t=i instanceof Error?i.message:String(i);e.innerHTML=`<div class="error">Error: ${t}</div>`,this.addToHistory(this.state.currentPrompt,t,!1)}this.updateRecentHistory(t)}getLastSuccessfulPrompt(){const t=this.deps.history.find(t=>t.ok);return t?.prompt||"Process the provided content"}formatResult(t,e){const s=this.normalizeResultData(t);if(!s)return'<div class="no-result">No result</div>';switch(e){case"json":return this.renderAsJSON(s);case"html":return this.renderAsHTML(s);case"text":return this.renderAsText(s);default:return this.renderAsMarkdown(s)}}normalizeResultData(t){if(!t)return null;let e=y(t)?.data||t;if(e&&"object"==typeof e&&(void 0!==e.data&&(e=e.data),"string"==typeof e))try{const t=JSON.parse(e);t&&"object"==typeof t&&(e=t)}catch{}return"object"==typeof e&&null!==e||(e={recognized_data:[String(e)]}),e}renderAsJSON(t){try{return`<pre class="json-result">${this.escapeHtml(JSON.stringify(t,null,2))}</pre>`}catch(e){return`<div class="error">Failed to format JSON: ${e}</div>`}}renderAsHTML(t){const e=this.extractContentItems(t).map(t=>this.renderContentItem(t,"html")).join("");return e?`<div class="html-result">${e}</div>`:`<div class="html-result">${this.convertMathToHTML(this.extractTextContent(t))}</div>`}renderAsText(t){const e=this.extractContentItems(t).map(t=>this.renderContentItem(t,"text")).join("\n\n");return e.trim()?`<pre class="text-result">${this.escapeHtml(e)}</pre>`:`<pre class="text-result">${this.escapeHtml(this.extractTextContent(t))}</pre>`}renderAsMarkdown(t){const e=this.extractContentItems(t).map(t=>this.renderContentItem(t,"markdown")).join("\n\n");if(!e.trim())try{const e=this.extractTextContent(t),s=m.parse(e);return g.sanitize(s)}catch(s){return console.warn("Markdown parsing failed, falling back to simple rendering:",s),this.renderMathContent(textContent)}try{const t=m.parse(e);return g.sanitize(t)}catch(s){return console.warn("Markdown parsing failed, falling back to simple rendering:",s),this.renderMathContent(e)}}extractContentItems(t){const e=[];if(t.recognized_data){const s=Array.isArray(t.recognized_data)?t.recognized_data:[t.recognized_data];e.push(...s.map(t=>String(t)))}if(t.verbose_data&&e.push(String(t.verbose_data)),0===e.length){const s=["content","text","message","result","response","description"];for(const a of s)if(t[a]){const s=Array.isArray(t[a])?t[a]:[t[a]];e.push(...s.map(t=>String(t)));break}}if(0===e.length){const s=this.extractTextContent(t);s&&e.push(s)}return e}renderContentItem(t,e){switch(e){case"html":return`<div class="recognized-item">${this.renderMathAsHTML(t)}</div>`;case"text":return this.stripMarkdown(t);default:return t}}renderMathAsHTML(t){let e=t;return e=e.replace(/\$\$([^$]+)\$\$/g,(t,e)=>{try{return m.parse(`$$${e}$$`).replace(/<p>|<\/p>/g,"").trim()}catch{return`<span class="math-display">${this.escapeHtml(`$$${e}$$`)}</span>`}}),e=e.replace(/\$([^$]+)\$/g,(t,e)=>{try{return m.parse(`$${e}$`).replace(/<p>|<\/p>/g,"").trim()}catch{return`<span class="math-inline">${this.escapeHtml(`$${e}$`)}</span>`}}),e=e.replace(/\n/g,"<br>"),e}stripMarkdown(t){return t.replace(/#{1,6}\s*/g,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`(.*?)`/g,"$1").replace(/^\s*[-*+]\s+/gm,"").replace(/^\s*\d+\.\s+/gm,"").replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1").replace(/!\[([^\]]+)\]\([^\)]+\)/g,"$1").trim()}extractTextContent(t){if(null==t)return"";if("string"==typeof t)return t;if("number"==typeof t||"boolean"==typeof t)return String(t);if(Array.isArray(t))return t.map(t=>this.extractTextContent(t)).join("\n");if("object"==typeof t){const e=["verbose_data","recognized_data","content","text","message","result","response","data"];for(const s of e)if(null!=t[s]){const e=this.extractTextContent(t[s]);if(e)return e}try{return JSON.stringify(t,null,2)}catch{return"[Complex Object]"}}return String(t)}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}addToHistory(t,e,s){const a={ts:Date.now(),prompt:t,before:this.state.files.map(t=>t.name).join(", ")||"text input",after:e,ok:s};this.deps.history.push(a);try{localStorage.setItem("rs-basic-history",JSON.stringify(this.deps.history))}catch(i){console.warn("Failed to save history:",i)}}async copyResults(t){let e="";if("markdown"!==this.state.outputFormat&&"html"!==this.state.outputFormat||!this.state.lastRawResult)if("json"===this.state.outputFormat&&this.state.lastRawResult){const t=this.normalizeResultData(this.state.lastRawResult);e=this.extractContentItems(t).join("\n\n")}else e=t.querySelector("[data-output]").textContent||"";else{const t=this.normalizeResultData(this.state.lastRawResult);e=this.extractContentItems(t).join("\n\n")}if(e.trim()){const{writeText:t}=await import("./index.js").then(t=>t.C);await t(e.trim()),this.deps.showMessage("Results copied to clipboard")}}clearResults(t){t.querySelector("[data-output]").innerHTML='<div class="empty-results">Results cleared</div>',this.state.lastRawResult=null}clearRecognizedContent(){this.state.recognizedContent=null,this.state.contentSource=null}showTemplateEditor(t){const s=e`<div class="template-editor-modal">
      <div class="modal-content">
        <h3>Prompt Templates</h3>
        <div class="template-list">
          ${this.state.promptTemplates.map((t,s)=>e`<div class="template-item">
              <input type="text" class="template-name" value="${t.name}" data-index="${s}">
              <textarea class="template-prompt" data-index="${s}">${t.prompt}</textarea>
              <button class="btn small remove-template" data-index="${s}">Remove</button>
            </div>`)}
        </div>
        <div class="modal-actions">
          <button class="btn" data-action="add-template">Add Template</button>
          <button class="btn primary" data-action="save-templates">Save</button>
          <button class="btn" data-action="close-editor">Close</button>
        </div>
      </div>
    </div>`;s.addEventListener("click",e=>{const a=e.target,i=a.getAttribute("data-action"),n=a.getAttribute("data-index");if("add-template"===i)this.state.promptTemplates.push({name:"New Template",prompt:"Enter your prompt here..."}),s.remove(),this.showTemplateEditor(t);else if("save-templates"===i){const e=s.querySelectorAll(".template-name"),a=s.querySelectorAll(".template-prompt");this.state.promptTemplates=Array.from(e).map((t,e)=>({name:t.value,prompt:a[e].value})),this.savePromptTemplates(),s.remove(),this.updateTemplateSelect(t)}else"close-editor"===i?s.remove():a.classList.contains("remove-template")&&n&&(this.state.promptTemplates.splice(parseInt(n),1),s.remove(),this.showTemplateEditor(t))}),t.append(s)}updateTemplateSelect(t){const e=t.querySelector(".template-select"),s=e.value;e.innerHTML='<option value="">Select Template...</option>'+this.state.promptTemplates.map(t=>`<option value="${t.prompt.replace(/"/g,"&quot;")}">${t.name}</option>`).join(""),e.value=s}getFileIcon(t){return t.startsWith("image/")?"🖼️":"application/pdf"===t?"📄":t.includes("json")?"📋":t.includes("text")||t.includes("markdown")?"📝":"📄"}createFileIconElement(t){const s=this.getFileIconName(t);return e`<ui-icon icon="${s}" size="20" icon-style="duotone" class="file-type-icon"></ui-icon>`}getFileIconName(t){return t.startsWith("image/")?"image":"application/pdf"===t?"file-pdf":t.includes("json")||t.includes("text")||t.includes("markdown")?"file-text":"file"}formatFileSize(t){return t<1024?`${t} B`:t<1048576?`${(t/1024).toFixed(1)} KB`:`${(t/1048576).toFixed(1)} MB`}loadPromptTemplates(){return((t,e)=>{if(!t)return e;try{return JSON.parse(t)??e}catch{return e}})(localStorage.getItem("rs-workcenter-templates"),[{name:"Analyze & Extract",prompt:"Analyze the provided content and extract key information, formulas, data, and insights. Identify the main topics, recognize any mathematical expressions or equations, and provide a structured summary."},{name:"Solve Equations",prompt:"Find and solve any mathematical equations, problems, or calculations in the content. Show your work step-by-step and provide the final answers."},{name:"Generate Code",prompt:"Based on the description or requirements in the content, generate appropriate code. Include comments and explain the implementation."},{name:"Extract Styles",prompt:"Analyze the visual content or design description and extract/generate CSS styles, color schemes, and layout information."},{name:"Document Analysis",prompt:"Perform a comprehensive analysis of the document, including structure, key points, relationships, and actionable insights."},{name:"Data Processing",prompt:"Process and transform the provided data. Extract structured information, identify patterns, and present results in a clear format."}])}savePromptTemplates(){try{localStorage.setItem("rs-workcenter-templates",JSON.stringify(this.state.promptTemplates))}catch(t){console.warn("Failed to save prompt templates:",t)}}}class k{options;dragOverElements=/* @__PURE__ */new Set;constructor(t){this.options=t}setupFileInput(t,e="*"){const s=document.createElement("input");return s.type="file",s.multiple=!0,s.accept=e,s.style.display="none",s.addEventListener("change",t=>{const e=Array.from(t.target.files||[]);e.length>0&&this.options.onFilesAdded(e),s.value=""}),t.append(s),s}setupDragAndDrop(t){t.addEventListener("dragover",e=>{e.preventDefault(),e.stopPropagation(),this.addDragOver(t)}),t.addEventListener("dragleave",e=>{e.preventDefault(),e.stopPropagation(),this.removeDragOver(t)}),t.addEventListener("drop",e=>{e.preventDefault(),e.stopPropagation(),this.removeDragOver(t);const s=Array.from(e.dataTransfer?.files||[]);s.length>0&&this.options.onFilesAdded(s)})}setupPasteHandling(t){t.addEventListener("paste",t=>{const e=Array.from(t.clipboardData?.files||[]);e.length>0&&(t.preventDefault(),this.options.onFilesAdded(e))})}setupCompleteFileHandling(t,e,s,a="*"){const i=this.setupFileInput(t,a);e.addEventListener("click",()=>{i.click()}),s&&this.setupDragAndDrop(s),this.setupPasteHandling(t)}validateFiles(t,e={}){const{maxSize:s,allowedTypes:a,maxFiles:i}=e,n=[],o=[];i&&t.length>i&&(o.push(...t.slice(i).map(t=>({file:t,reason:`Too many files. Maximum ${i} files allowed.`}))),t=t.slice(0,i));for(const r of t){let t=!0,e="";s&&r.size>s&&(t=!1,e=`File too large. Maximum size is ${this.formatFileSize(s)}.`),a&&a.length>0&&(a.some(t=>t.includes("*")?r.type.startsWith(t.replace("/*","/")):r.type===t)||(t=!1,e=e||`File type not allowed. Allowed types: ${a.join(", ")}.`)),t?n.push(r):o.push({file:r,reason:e})}return{valid:n,invalid:o}}async readFileAsText(t){return new Promise((e,s)=>{const a=new FileReader;a.onload=()=>e(a.result),a.onerror=()=>s(new Error(`Failed to read file: ${t.name}`)),a.readAsText(t)})}async readFilesAsText(t){const e=[];for(const a of t)try{const t=await this.readFileAsText(a);e.push({file:a,content:t})}catch(s){console.warn(`Failed to read file ${a.name}:`,s)}return e}getFileIcon(t){return t.startsWith("image/")?"🖼️":"application/pdf"===t?"📄":t.includes("json")?"📋":t.includes("text")||t.includes("markdown")?"📝":t.includes("javascript")||t.includes("typescript")?"📜":t.includes("css")?"🎨":t.includes("html")?"🌐":t.startsWith("video/")?"🎥":t.startsWith("audio/")?"🎵":t.includes("zip")||t.includes("rar")?"📦":"📄"}formatFileSize(t){return t<1024?`${t} B`:t<1048576?`${(t/1024).toFixed(1)} KB`:t<1073741824?`${(t/1048576).toFixed(1)} MB`:`${(t/1073741824).toFixed(1)} GB`}isMarkdownFile(t){const e=t.name.toLowerCase(),s=t.type.toLowerCase();return e.endsWith(".md")||e.endsWith(".markdown")||e.endsWith(".mdown")||e.endsWith(".mkd")||e.endsWith(".mkdn")||e.endsWith(".mdtxt")||e.endsWith(".mdtext")||s.includes("markdown")||s.includes("text")}isImageFile(t){return t.type.startsWith("image/")}isTextFile(t){return t.type.startsWith("text/")||this.isMarkdownFile(t)||t.type.includes("javascript")||t.type.includes("typescript")||t.type.includes("css")||t.type.includes("html")||t.type.includes("json")||t.type.includes("xml")}addDragOver(t){this.dragOverElements.has(t)||(this.dragOverElements.add(t),t.classList.add("drag-over"))}removeDragOver(t){this.dragOverElements.has(t)&&(this.dragOverElements.delete(t),t.classList.remove("drag-over"))}destroy(){this.dragOverElements.clear()}}class x{recognition=null;isListening=!1;options;constructor(t={}){this.options={language:"en-US",continuous:!1,interimResults:!1,maxAlternatives:1,...t},this.initializeRecognition()}initializeRecognition(){const t=window.SpeechRecognition||window.webkitSpeechRecognition;t?(this.recognition=new t,this.recognition.lang=this.options.language,this.recognition.continuous=this.options.continuous,this.recognition.interimResults=this.options.interimResults,this.recognition.maxAlternatives=this.options.maxAlternatives):console.warn("Speech recognition not supported in this browser")}isSupported(){return null!==this.recognition}startListening(){return new Promise((t,e)=>{if(!this.recognition)return void e(new Error("Speech recognition not supported"));if(this.isListening)return void e(new Error("Already listening"));let s=!1;const a=a=>{if(!s){s=!0,this.isListening=!1;try{this.recognition.stop()}catch{}a?t(a):e(new Error("No speech detected"))}};this.recognition.onresult=t=>{const e=String(t?.results?.[0]?.[0]?.transcript||"").trim();a(e||null)},this.recognition.onerror=()=>a(null),this.recognition.onend=()=>a(null);try{this.isListening=!0,this.recognition.start()}catch(i){this.isListening=!1,e(i)}})}stopListening(){if(this.recognition&&this.isListening){try{this.recognition.stop()}catch{}this.isListening=!1}}getIsListening(){return this.isListening}setLanguage(t){this.options.language=t,this.recognition&&(this.recognition.lang=t)}getAvailableLanguages(){return["en-US","en-GB","en-AU","en-CA","en-IN","en-IE","es-ES","es-US","es-MX","es-AR","es-CO","es-CL","fr-FR","fr-CA","de-DE","it-IT","pt-BR","pt-PT","ru-RU","ja-JP","ko-KR","zh-CN","zh-TW","ar-SA","hi-IN","nl-NL","sv-SE","no-NO","da-DK","fi-FI"]}destroy(){this.stopListening(),this.recognition=null}}async function C(t={}){const{timeout:e=1e4,...s}=t,a=new x(s);if(!a.isSupported())return console.warn("Speech recognition not supported"),null;try{const t=a.startListening(),s=new Promise((t,s)=>{setTimeout(()=>{a.stopListening(),s(new Error("Speech recognition timeout"))},e)});return await Promise.race([t,s])}catch(i){return console.warn("Speech recognition failed:",i),null}finally{a.destroy()}}class T{storageKey;templates=[];defaultTemplates;constructor(t={}){this.storageKey=t.storageKey||"rs-prompt-templates",this.defaultTemplates=t.defaultTemplates||this.getDefaultTemplates(),this.loadTemplates()}getAllTemplates(){return[...this.templates]}getTemplateById(t){return this.templates.find(e=>e.id===t)}addTemplate(t){const e={...t,id:this.generateId(),createdAt:Date.now(),updatedAt:Date.now(),usageCount:0};return this.templates.push(e),this.saveTemplates(),e}updateTemplate(t,e){const s=this.templates.findIndex(e=>e.id===t);return-1!==s&&(this.templates[s]={...this.templates[s],...e,updatedAt:Date.now()},this.saveTemplates(),!0)}removeTemplate(t){const e=this.templates.findIndex(e=>e.id===t);return-1!==e&&(this.templates.splice(e,1),this.saveTemplates(),!0)}incrementUsageCount(t){const e=this.templates.find(e=>e.id===t);e&&(e.usageCount=(e.usageCount||0)+1,this.saveTemplates())}searchTemplates(t){const e=t.toLowerCase();return this.templates.filter(t=>t.name.toLowerCase().includes(e)||t.prompt.toLowerCase().includes(e)||t.tags?.some(t=>t.toLowerCase().includes(e)))}getTemplatesByCategory(t){return this.templates.filter(e=>e.category===t)}getMostUsedTemplates(t=5){return this.templates.sort((t,e)=>(e.usageCount||0)-(t.usageCount||0)).slice(0,t)}exportTemplates(){return JSON.stringify(this.templates,null,2)}importTemplates(t){try{const e=JSON.parse(t);if(!Array.isArray(e))throw new Error("Invalid template data: not an array");for(const t of e)if(!t.name||!t.prompt)throw new Error("Invalid template: missing name or prompt");const s=e.map(t=>({...t,id:this.generateId(),createdAt:t.createdAt||Date.now(),updatedAt:Date.now()}));return this.templates.push(...s),this.saveTemplates(),!0}catch(e){return console.error("Failed to import templates:",e),!1}}resetToDefaults(){this.templates=this.defaultTemplates.map(t=>({...t,id:this.generateId(),createdAt:Date.now(),updatedAt:Date.now(),usageCount:0})),this.saveTemplates()}createTemplateEditor(t,s){const a=e`<div class="template-editor-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Prompt Templates</h3>
          </div>

          <div class="template-list">
            ${this.templates.map((t,s)=>e`<div class="template-item">
                <div class="template-header">
                  <input type="text" class="template-name" value="${t.name}" data-index="${s}" placeholder="Template name">
                  <button class="btn small remove-template" data-index="${s}" title="Remove template">✕</button>
                </div>
                <textarea class="template-prompt" data-index="${s}" placeholder="Enter your prompt template...">${t.prompt}</textarea>
                <div class="template-meta">
                  ${t.usageCount?e`<span class="usage-count">Used ${t.usageCount} times</span>`:""}
                  ${t.category?e`<span class="category">${t.category}</span>`:""}
                </div>
              </div>`)}
          </div>

          <div class="modal-actions">
            <button class="btn" data-action="add-template">Add Template</button>
            <button class="btn" data-action="reset-defaults">Reset to Defaults</button>
            <button class="btn primary" data-action="save-templates">Save Changes</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;a.addEventListener("click",e=>{const i=e.target,n=i.getAttribute("data-action"),o=i.getAttribute("data-index");if("add-template"===n)this.addTemplate({name:"New Template",prompt:"Enter your prompt template here...",category:"Custom"}),a.remove(),this.createTemplateEditor(t,s);else if("reset-defaults"===n)confirm("Are you sure you want to reset all templates to defaults? This will remove all custom templates.")&&(this.resetToDefaults(),a.remove(),this.createTemplateEditor(t,s));else if("save-templates"===n){const t=a.querySelectorAll(".template-name"),e=a.querySelectorAll(".template-prompt");this.templates=Array.from(t).map((t,s)=>{const a=parseInt(t.getAttribute("data-index")||"0");return{...this.templates[a],name:t.value.trim()||"Untitled Template",prompt:e[s].value.trim()||"Enter your prompt...",updatedAt:Date.now()}}),this.saveTemplates(),a.remove(),s?.()}else if("close-editor"===n)a.remove();else if(i.classList.contains("remove-template")&&null!==o){const e=parseInt(o),i=this.templates[e];confirm(`Remove template "${i.name}"?`)&&(this.removeTemplate(i.id),a.remove(),this.createTemplateEditor(t,s))}}),t.append(a)}createTemplateSelect(t){const e=document.createElement("select");e.className="template-select";const s=document.createElement("option");return s.value="",s.textContent="Select Template...",e.append(s),this.templates.forEach(t=>{const s=document.createElement("option");s.value=t.prompt,s.textContent=t.name,t.category&&(s.textContent+=` (${t.category})`),e.append(s)}),t&&(e.value=t),e}getDefaultTemplates(){return[{name:"Recognize Content",prompt:"Recognize and extract information from the provided content",category:"Analysis",tags:["recognition","extraction","analysis"]},{name:"Analyze Document",prompt:"Analyze this document and provide a summary with key insights",category:"Analysis",tags:["analysis","summary","insights"]},{name:"Solve Problems",prompt:"Solve any equations, problems, or questions in the content",category:"Problem Solving",tags:["math","problems","solutions"]},{name:"Generate Code",prompt:"Generate code based on the requirements or description provided",category:"Development",tags:["code","programming","development"]},{name:"Extract CSS",prompt:"Extract or generate CSS from the content or images",category:"Design",tags:["css","styling","design"]},{name:"Summarize Text",prompt:"Provide a concise summary of the following text",category:"Writing",tags:["summary","writing","concise"]},{name:"Translate Content",prompt:"Translate the following content to English",category:"Translation",tags:["translate","language","english"]},{name:"Generate Ideas",prompt:"Generate creative ideas based on the provided topic or content",category:"Creative",tags:["ideas","creative","brainstorming"]}]}generateId(){return`template_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}loadTemplates(){try{const t=localStorage.getItem(this.storageKey);if(t){const e=JSON.parse(t);this.templates=e.map(t=>({...t,id:t.id||this.generateId(),createdAt:t.createdAt||Date.now(),updatedAt:t.updatedAt||Date.now(),usageCount:t.usageCount||0}))}else this.resetToDefaults()}catch(t){console.warn("Failed to load templates from storage:",t),this.resetToDefaults()}}saveTemplates(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.templates))}catch(t){console.warn("Failed to save templates to storage:",t)}}}class ${storageKey;maxEntries;autoSave;entries=[];constructor(t={}){this.storageKey=t.storageKey||"rs-basic-history",this.maxEntries=t.maxEntries||100,this.autoSave=!1!==t.autoSave,this.loadHistory()}addEntry(t){const e={...t,id:this.generateId(),ts:Date.now()};return this.entries.unshift(e),this.entries.length>this.maxEntries&&(this.entries=this.entries.slice(0,this.maxEntries)),this.autoSave&&this.saveHistory(),e}getAllEntries(){return[...this.entries]}getRecentEntries(t=10){return this.entries.slice(0,t)}getEntryById(t){return this.entries.find(e=>e.id===t)}removeEntry(t){const e=this.entries.findIndex(e=>e.id===t);return-1!==e&&(this.entries.splice(e,1),this.autoSave&&this.saveHistory(),!0)}clearHistory(){this.entries=[],this.autoSave&&this.saveHistory()}searchEntries(t){const e=t.toLowerCase();return this.entries.filter(t=>t.prompt.toLowerCase().includes(e)||t.before.toLowerCase().includes(e)||t.after.toLowerCase().includes(e))}getSuccessfulEntries(){return this.entries.filter(t=>t.ok)}getFailedEntries(){return this.entries.filter(t=>!t.ok)}getStatistics(){const t=this.entries.length,e=this.entries.filter(t=>t.ok).length;return{total:t,successful:e,failed:t-e,successRate:t>0?e/t*100:0,averageDuration:this.entries.filter(t=>t.duration).reduce((t,e)=>t+(e.duration||0),0)/Math.max(1,this.entries.filter(t=>t.duration).length)||0}}exportHistory(){return JSON.stringify(this.entries,null,2)}importHistory(t){try{const e=JSON.parse(t);if(!Array.isArray(e))throw new Error("Invalid history data: not an array");for(const t of e)if("number"!=typeof t.ts||"string"!=typeof t.prompt)throw new Error("Invalid history entry: missing required fields");const s=e.map(t=>({...t,id:t.id||this.generateId()})),a=new Set(this.entries.map(t=>t.id)),i=s.filter(t=>!a.has(t.id));return this.entries.unshift(...i),this.entries.length>this.maxEntries&&(this.entries=this.entries.slice(0,this.maxEntries)),this.autoSave&&this.saveHistory(),!0}catch(e){return console.error("Failed to import history:",e),!1}}createHistoryView(t){const s=e`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${0===this.entries.length?e`<div class="empty-history">No history yet. Start processing some content!</div>`:this.entries.map(e=>this.createHistoryItem(e,t))}
      </div>
    </div>`;return s.addEventListener("click",e=>{const a=e.target,i=a.getAttribute("data-action"),n=a.getAttribute("data-entry-id");if("clear-history"===i){if(confirm("Are you sure you want to clear all history?")){this.clearHistory();const e=this.createHistoryView(t);s.replaceWith(e)}}else if("export-history"===i)this.exportHistoryToFile();else if("use-entry"===i&&n){const e=this.getEntryById(n);e&&t?.(e)}}),s}createRecentHistoryView(t=3,s){const a=this.getRecentEntries(t),i=e`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${0===a.length?e`<div class="no-recent">No recent activity</div>`:a.map(t=>this.createCompactHistoryItem(t,s))}
    </div>`;return i.addEventListener("click",t=>{const e=t.target,a=e.getAttribute("data-action"),i=e.getAttribute("data-entry-id");if("view-full-history"===a)console.log("View full history requested");else if("use-entry"===a&&i){const t=this.getEntryById(i);t&&s?.(t)}}),i}createStatsDisplay(){const t=this.getStatistics();return e`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${t.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${t.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${t.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${t.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`}createHistoryItem(t,s){const a=new Date(t.ts).toLocaleString(),i=t.duration?` (${(t.duration/1e3).toFixed(1)}s)`:"";return e`<div class="history-item ${t.ok?"success":"error"}">
      <div class="history-meta">
        <span class="history-status ${t.ok?"success":"error"}">
          ${t.ok?"✓":"✗"}
        </span>
        <span class="history-time">${a}${i}</span>
        ${t.model?e`<span class="history-model">${t.model}</span>`:""}
      </div>

      <div class="history-content">
        <div class="history-prompt">${t.prompt}</div>
        <div class="history-input">Input: ${t.before}</div>
        ${t.error?e`<div class="history-error">Error: ${t.error}</div>`:""}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${t.id}">Use Prompt</button>
        ${t.ok?e`<button class="btn small" data-action="view-result" data-entry-id="${t.id}">View Result</button>`:""}
      </div>
    </div>`}createCompactHistoryItem(t,s){const a=new Date(t.ts).toLocaleString(),i=t.prompt.length>40?t.prompt.substring(0,40)+"...":t.prompt;return e`<div class="history-item-compact ${t.ok?"success":"error"}">
      <div class="history-meta">
        <span class="history-status ${t.ok?"success":"error"}">${t.ok?"✓":"✗"}</span>
        <span class="history-prompt">${i}</span>
      </div>
      <div class="history-time">${a}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${t.id}">Use</button>
    </div>`}exportHistoryToFile(){const t=this.exportHistory(),e=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(e),a=document.createElement("a");a.href=s,a.download=`ai-history-${/* @__PURE__ */(new Date).toISOString().split("T")[0]}.json`,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(s)}generateId(){return`history_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}loadHistory(){try{const t=localStorage.getItem(this.storageKey);if(t){const e=JSON.parse(t);this.entries=e.map(t=>({...t,id:t.id||this.generateId()}))}}catch(t){console.warn("Failed to load history from storage:",t),this.entries=[]}}saveHistory(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.entries))}catch(t){console.warn("Failed to save history to storage:",t)}}}class E{options;container=null;editor=null;preview=null;autoSaveTimeout=null;constructor(t={}){this.options={initialContent:"",placeholder:"Start writing your markdown here...",autoSave:!0,autoSaveDelay:1e3,...t}}render(){return this.container=e`<div class="markdown-editor-container">
      <div class="editor-header">
        <h3>Markdown Editor</h3>
        <div class="editor-actions">
          <button class="btn" data-action="clear">Clear</button>
          <button class="btn primary" data-action="save">Save</button>
        </div>
      </div>

      <div class="editor-layout">
        <div class="editor-panel">
          <div class="editor-toolbar">
            <div class="toolbar-group">
              <button class="btn small" data-action="bold" title="Bold">**bold**</button>
              <button class="btn small" data-action="italic" title="Italic">*italic*</button>
              <button class="btn small" data-action="code" title="Code">\`code\`</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="link" title="Link">[link](url)</button>
              <button class="btn small" data-action="image" title="Image">![alt](url)</button>
              <button class="btn small" data-action="list" title="List">- item</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="heading" title="Heading"># Heading</button>
              <button class="btn small" data-action="quote" title="Quote">> quote</button>
              <button class="btn small" data-action="codeblock" title="Code Block">\`\`\`</button>
            </div>
          </div>

          <textarea
            class="markdown-textarea"
            placeholder="${this.options.placeholder}"
            spellcheck="false"
          >${this.options.initialContent}</textarea>

          <div class="editor-footer">
            <div class="editor-stats">
              <span class="char-count">0 characters</span>
              <span class="word-count">0 words</span>
              <span class="line-count">0 lines</span>
            </div>
            <div class="editor-actions">
              <button class="btn small" data-action="print" title="Print content">
                <ui-icon icon="printer" size="16" icon-style="duotone"></ui-icon>
                Print
              </button>
            </div>
            <div class="editor-mode">
              <button class="btn small active" data-mode="edit">Edit</button>
              <button class="btn small" data-mode="preview">Preview</button>
              <button class="btn small" data-mode="split">Split</button>
            </div>
          </div>
        </div>

        <div class="preview-panel">
          <div class="preview-header">
            <h4>Live Preview</h4>
          </div>
          <div class="preview-content"></div>
        </div>
      </div>
    </div>`,this.initializeEditor(this.container),this.container}getContent(){return this.editor?.value||""}printContent(){if(this.getContent().trim())try{const t=this.container?.querySelector(".markdown-viewer-content");if(!t)return void console.error("[MarkdownEditor] Could not find preview content for printing");const e=new URL("/print",window.location.origin);if(e.searchParams.set("content",t.innerHTML),e.searchParams.set("title","Markdown Editor Content"),!window.open(e.toString(),"_blank","width=800,height=600"))return console.warn("[MarkdownEditor] Failed to open print window - popup blocked?"),void this.printCurrentContent();console.log("[MarkdownEditor] Print window opened successfully")}catch(t){console.error("[MarkdownEditor] Error printing content:",t),this.printCurrentContent()}else console.warn("[MarkdownEditor] No content to print")}printCurrentContent(){const t=this.container?.querySelector(".markdown-viewer-content");t&&(t.setAttribute("data-print","true"),window.print(),setTimeout(()=>{t.removeAttribute("data-print")},1e3))}setContent(t){this.editor&&(this.editor.value=t,this.updatePreview(),this.updateStats())}focus(){this.editor?.focus()}clear(){this.setContent(""),this.options.onContentChange?.("")}save(){const t=this.getContent();this.options.onSave?.(t)}initializeEditor(t){this.editor=t.querySelector(".markdown-textarea");const e=t.querySelector(".preview-content");this.preview=new b({showTitle:!1,showActions:!1});const s=this.preview.render();e.append(s),this.setupEventListeners(t),this.updatePreview(),this.updateStats()}setupEventListeners(t){this.editor&&(this.editor.addEventListener("input",()=>{this.handleContentChange()}),this.editor.addEventListener("change",()=>{this.handleContentChange()}),this.editor.addEventListener("keydown",t=>{this.handleKeyboardShortcuts(t)}),t.addEventListener("click",t=>{const e=t.target.getAttribute("data-action");e&&(t.preventDefault(),this.handleToolbarAction(e))}),t.addEventListener("click",t=>{const e=t.target.getAttribute("data-mode");e&&this.switchMode(e)}))}handleContentChange(){const t=this.getContent();this.updatePreview(),this.updateStats(),this.options.onContentChange?.(t),this.options.autoSave&&this.scheduleAutoSave()}handleKeyboardShortcuts(t){return t.ctrlKey&&"s"===t.key?(t.preventDefault(),void this.save()):"Tab"===t.key?(t.preventDefault(),void this.insertText("\t")):t.ctrlKey&&"b"===t.key?(t.preventDefault(),void this.handleToolbarAction("bold")):t.ctrlKey&&"i"===t.key?(t.preventDefault(),void this.handleToolbarAction("italic")):void 0}handleToolbarAction(t){const e=this.editor;if(!e)return;const s=e.selectionStart,a=e.selectionEnd,i=e.value.substring(s,a);let n="";switch(t){case"bold":n=i?`**${i}**`:"**bold text**";break;case"italic":n=i?`*${i}*`:"*italic text*";break;case"code":n=i?`\`${i}\``:"`code`";break;case"link":n=i?`[${i}](url)`:"[link text](url)";break;case"image":n=i?`![${i}](image-url)`:"![alt text](image-url)";break;case"list":n=i?`- ${i}`:"- list item";break;case"heading":n=i?`# ${i}`:"# Heading";break;case"quote":n=i?`> ${i}`:"> quote";break;case"codeblock":n=i?`\`\`\`\n${i}\n\`\`\``:"```\ncode block\n```";break;case"clear":return void this.clear();case"save":return void this.save();case"print":return void this.printContent()}n&&this.insertText(n,s,a)}insertText(t,e,s){const a=this.editor;a&&(a.setRangeText(t,e??a.selectionStart,s??a.selectionEnd,"end"),a.focus(),a.dispatchEvent(new Event("input",{bubbles:!0})))}switchMode(t){const e=this.editor?.closest(".markdown-editor-container");if(!e)return;const s=e.querySelector(".editor-panel"),a=e.querySelector(".preview-panel");e.querySelectorAll("[data-mode]").forEach(t=>t.classList.remove("active"));const i=e.querySelector(`[data-mode="${t}"]`);switch(i?.classList.add("active"),t){case"edit":s.style.display="block",a.style.display="none",this.editor?.focus();break;case"preview":s.style.display="none",a.style.display="block";break;case"split":s.style.display="block",a.style.display="block",this.editor?.focus()}}updatePreview(){this.preview&&this.editor&&this.preview.setContent(this.editor.value)}updateStats(){const t=this.editor?.closest(".markdown-editor-container");if(!t||!this.editor)return;const e=this.editor.value,s=e.length,a=e.trim()?e.trim().split(/\s+/).length:0,i=e.split("\n").length,n=t.querySelector(".char-count"),o=t.querySelector(".word-count"),r=t.querySelector(".line-count");n&&(n.textContent=`${s} characters`),o&&(o.textContent=`${a} words`),r&&(r.textContent=`${i} lines`)}scheduleAutoSave(){this.autoSaveTimeout&&clearTimeout(this.autoSaveTimeout),this.autoSaveTimeout=window.setTimeout(()=>{this.save()},this.options.autoSaveDelay)}}class L{options;quill=null;container=null;autoSaveTimeout=null;content="";constructor(t={}){this.options={initialContent:"",placeholder:"Start writing...",theme:"snow",toolbar:[[{header:[1,2,3,4,5,6,!1]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{align:[]}],["blockquote","code-block"],["link","image","video"],["clean"]],autoSave:!0,autoSaveDelay:2e3,...t},this.content=this.options.initialContent||""}render(){const t=e`<div class="quill-editor-container">
      <div class="editor-header">
        <h3>Rich Text Editor</h3>
        <div class="editor-actions">
          <button class="btn btn-icon" data-action="clear" title="Clear content" aria-label="Clear content">
            <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Clear</span>
          </button>
          <button class="btn btn-icon primary" data-action="save" title="Save content" aria-label="Save content">
            <ui-icon icon="floppy-disk" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Save</span>
          </button>
          <button class="btn btn-icon" data-action="export-html" title="Export as HTML" aria-label="Export as HTML">
            <ui-icon icon="code" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">HTML</span>
          </button>
          <button class="btn btn-icon" data-action="export-text" title="Export as text" aria-label="Export as text">
            <ui-icon icon="file-text" size="18" icon-style="duotone"></ui-icon>
            <span class="btn-text">Text</span>
          </button>
        </div>
      </div>

      <div class="quill-wrapper">
        <div class="quill-editor" data-editor></div>
      </div>

      <div class="editor-footer">
        <div class="editor-stats">
          <span class="word-count">0 words</span>
          <span class="char-count">0 characters</span>
        </div>
        <div class="editor-info">
          <span class="format-indicator">Rich Text</span>
        </div>
      </div>
    </div>`;return this.initializeQuill(t),t}getContent(){return this.quill?this.quill.root.innerHTML:this.content}getText(){return this.quill?this.quill.getText():""}getContents(){return this.quill?this.quill.getContents():null}setContent(t){this.content=t,this.quill&&(this.quill.root.innerHTML=t,this.updateStats())}setContents(t){this.quill&&(this.quill.setContents(t),this.updateStats())}focus(){this.quill&&this.quill.focus()}clear(){this.quill&&(this.quill.setContents([]),this.content="",this.updateStats(),this.options.onContentChange?.(""))}save(){const t=this.getContent();this.content=t,this.options.onSave?.(t)}exportHTML(){const t=this.getContent();this.downloadContent(t,"rich-text-content.html","text/html")}exportText(){const t=this.getText();this.downloadContent(t,"rich-text-content.txt","text/plain")}initializeQuill(t){const e=t.querySelector("[data-editor]");e?(this.quill=new f(e,{theme:this.options.theme,placeholder:this.options.placeholder,modules:{toolbar:this.options.toolbar}}),this.content&&(this.quill.root.innerHTML=this.content),this.setupEventListeners(t),this.updateStats()):console.error("Quill editor element not found")}setupEventListeners(t){this.quill&&(this.quill.on("text-change",()=>{this.handleContentChange()}),t.addEventListener("click",t=>{const e=t.target.getAttribute("data-action");e&&(t.preventDefault(),this.handleAction(e))}),this.quill.on("selection-change",()=>{this.updateStats()}))}handleContentChange(){const t=this.getContent();this.content=t,this.updateStats(),this.options.onContentChange?.(t),this.options.autoSave&&this.scheduleAutoSave()}handleAction(t){switch(t){case"clear":this.clear();break;case"save":this.save();break;case"export-html":this.exportHTML();break;case"export-text":this.exportText()}}updateStats(){if(!this.quill||!this.container)return;const t=this.quill.getText(),e=t.trim()?t.trim().split(/\s+/).length:0,s=t.length,a=this.container.querySelector(".word-count"),i=this.container.querySelector(".char-count");a&&(a.textContent=`${e} words`),i&&(i.textContent=`${s} characters`)}scheduleAutoSave(){this.autoSaveTimeout&&clearTimeout(this.autoSaveTimeout),this.autoSaveTimeout=window.setTimeout(()=>{this.save()},this.options.autoSaveDelay)}downloadContent(t,e,s){const a=new Blob([t],{type:s}),i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=e,document.body.append(n),n.click(),n.remove(),URL.revokeObjectURL(i)}destroy(){this.autoSaveTimeout&&clearTimeout(this.autoSaveTimeout),this.quill&&(this.quill=null)}}const A="rs-basic-last-src",R="# CrossWord (Basic)\n\nOpen a markdown file or paste content here.\n",I=/\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i,q=t=>{try{localStorage.setItem(A,t)}catch{}},z=()=>{try{return"undefined"!=typeof chrome&&Boolean(chrome?.runtime?.id)&&"chrome-extension:"===window.location.protocol}catch{return!1}},F=(t,e)=>{const s="undefined"!=typeof window&&window.matchMedia?.("(prefers-color-scheme: dark)")?.matches,a="dark"===e?"dark":"light"===e?"light":s?"dark":"light";t.dataset.theme=a;try{t.style.colorScheme=a}catch{}};function D(m,v={}){const g=new URLSearchParams(window.location.search),y=g.get("markdown-content");if(g.get("markdown-filename"),y){console.log("[Basic] Loading markdown content from URL parameters"),v.initialView="markdown-viewer",v.initialMarkdown=y;const t=new URL(window.location.href);t.searchParams.delete("markdown-content"),t.searchParams.delete("markdown-filename"),window.history.replaceState({},"",t.pathname+t.hash)}((m,v={})=>{const g=e`<div class="basic-app" />`;m.replaceChildren(g);const y=z(),b=new S({state:{},history:[],getSpeechPrompt:C,showMessage:t=>{M.message=t,W(),setTimeout(()=>{M.message="",W()},3e3)},render:()=>G()}),f=function(t){return new k(t)}({onFilesAdded:t=>{"workcenter"===M.view&&(b.getState().files.push(...t),G())},onError:t=>{M.message=t,W()}}),x=new T(void 0),D=new $(void 0),M={view:v.initialView||"markdown-viewer",markdown:localStorage.getItem("rs-basic-markdown")??v.initialMarkdown??R,editing:!1,busy:!1,message:"",history:D.getAllEntries(),lastSavedTheme:"auto",workCenterManager:b,fileHandler:f,templateManager:x,historyManager:D};b.deps.state=M,b.deps.history=M.history;const P=()=>{try{M.markdown&&localStorage.setItem("rs-basic-markdown",M.markdown)}catch{}},H=()=>{try{localStorage.setItem("rs-basic-history",JSON.stringify(M.history.slice(-50)))}catch{}},j=()=>e`<div class="toolbar">
      <div class="left">
        <button class="btn ${"markdown-viewer"===M.view?"active":""}" data-action="view-markdown-viewer" type="button" title="Markdown Viewer">📖 Viewer</button>
        <button class="btn ${"markdown-editor"===M.view?"active":""}" data-action="view-markdown-editor" type="button" title="Markdown Editor">✏️ Editor</button>
        <button class="btn ${"rich-editor"===M.view?"active":""}" data-action="view-rich-editor" type="button" title="Rich Text Editor">🖊️ Rich Editor</button>
        <button class="btn ${"workcenter"===M.view?"active":""}" data-action="view-workcenter" type="button" title="AI Work Center">⚡ Work Center</button>
        <button class="btn ${"settings"===M.view?"active":""}" data-action="view-settings" type="button" title="Settings">⚙️ Settings</button>
        <button class="btn ${"history"===M.view?"active":""}" data-action="view-history" type="button" title="History">📚 History</button>
      </div>
      <div class="right">
        ${"markdown-editor"===M.view?e`<button class="btn btn-icon" data-action="open-md" type="button" title="Open Markdown File">
          <ui-icon icon="folder-open" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Open</span>
        </button>
        <button class="btn btn-icon" data-action="save-md" type="button" title="Save to File">
          <ui-icon icon="floppy-disk" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Save</span>
        </button>
        <button class="btn btn-icon" data-action="export-md" type="button" title="Export as Markdown">
          <ui-icon icon="download" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Export</span>
        </button>`:""}
        ${"markdown-viewer"===M.view||"markdown-editor"===M.view?e`<button class="btn" data-action="voice" type="button" title="Voice Input">🎤 Voice</button>`:""}
        ${"workcenter"===M.view?e`<button class="btn" data-action="solve" type="button" title="Solve equations & answer questions">🧮 Solve</button>
        <button class="btn" data-action="code" type="button" title="Generate code">💻 Code</button>
        <button class="btn" data-action="css" type="button" title="Extract CSS">🎨 CSS</button>`:""}
        ${y?e`<button class="btn" data-action="snip" type="button" title="Screen Capture">📸 Snip</button>`:""}
      </div>
    </div>`;let O=j();const N=e`<div class="status" aria-live="polite"></div>`,U=e`<div class="content"></div>`;g.append(O,N,U);const B=e`<input class="file-input" type="file" accept=".md,text/markdown,text/plain" />`;B.style.display="none",g.append(B),M.fileHandler.setupCompleteFileHandling(g,e`<button style="display:none">File Select</button>`,void 0,"*");const W=()=>{N.textContent=M.message||(M.busy?"Working…":""),g.toggleAttribute("data-busy",M.busy)},V=()=>w({content:M.markdown||R,title:"Markdown Viewer",onCopy:t=>{M.message="Content copied to clipboard",W(),setTimeout(()=>{M.message="",W()},2e3)},onDownload:t=>{M.message="Content downloaded as markdown file",W(),setTimeout(()=>{M.message="",W()},2e3)}}).render(),K=()=>{const t=new Blob([M.markdown||""],{type:"text/markdown;charset=utf-8"}),e=URL.createObjectURL(t),s=document.createElement("a");s.href=e,s.download=`crossword-${Date.now()}.md`,s.rel="noopener",s.click(),setTimeout(()=>URL.revokeObjectURL(e),250)},J=async(t,e)=>{if(!t.trim())return;M.busy=!0,M.message=e?"Processing…":"Generating markdown…",W();const s=M.markdown||"",i=[{role:"user",content:`Prompt:\n${t}\n\nCurrent markdown:\n${s}`}];try{const n=e?await e(i,{useActiveInstruction:!0}):await a(i,"Generate a NEW markdown document.\nRequirements:\n- Output ONLY markdown.\n- Use the prompt and the current markdown as context.\n- Keep it concise, structured with headings and lists.\n- If you need to keep prior content, integrate it rather than repeating verbatim.\n"),o=n?.ok&&n?.data?String(n.data):"";M.history.push({ts:Date.now(),prompt:t,before:s,after:o||s,ok:Boolean(n?.ok&&o),error:n?.ok?void 0:n?.error||"Failed"}),H(),o?(M.markdown=o,P(),q(""),M.message="Done."):M.message=n?.error||"No output."}catch(n){M.history.push({ts:Date.now(),prompt:t,before:s,after:s,ok:!1,error:String(n)}),H(),M.message=String(n)}finally{M.busy=!1,W(),G(),setTimeout(()=>{"Done."===M.message&&(M.message="",W())},1200)}},G=async()=>{const a=j();if(O.replaceWith(a),O=a,_(),U.replaceChildren(),"settings"===M.view){const a=(a=>{const i=e`<div class="basic-settings">
    <h2>Settings</h2>

    <section class="card">
      <h3>AI</h3>
      <label class="field">
        <span>Base URL</span>
        <input type="url" inputmode="url" autocomplete="off" data-field="ai.baseUrl" placeholder="https://api.proxyapi.ru/openai/v1" />
      </label>
      <label class="field">
        <span>API Key</span>
        <input type="password" autocomplete="off" data-field="ai.apiKey" placeholder="sk-..." />
      </label>
      <label class="field checkbox">
        <input type="checkbox" data-field="ui.showKey" />
        <span>Show API key</span>
      </label>
      <label class="field">
        <span>Share target mode</span>
        <select data-field="ai.shareTargetMode">
          <option value="recognize">Recognize and copy</option>
          <option value="analyze">Analyze and store</option>
        </select>
      </label>
      <label class="field">
        <span>Response language</span>
        <select data-field="ai.responseLanguage">
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="ru">Russian</option>
        </select>
      </label>
      <label class="field checkbox">
        <input type="checkbox" data-field="ai.translateResults" />
        <span>Translate results</span>
      </label>
      <label class="field checkbox">
        <input type="checkbox" data-field="ai.generateSvgGraphics" />
        <span>Generate SVG graphics</span>
      </label>
    </section>

    <section class="card" data-section="instructions">
      <h3>Recognition Instructions</h3>
      <div data-custom-instructions></div>
    </section>

    <section class="card">
      <h3>Appearance</h3>
      <label class="field">
        <span>Theme</span>
        <select data-field="appearance.theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>
    </section>

    <section class="card" data-section="extension" hidden>
      <h3>Extension</h3>
      <label class="field checkbox">
        <input type="checkbox" data-field="core.ntpEnabled" />
        <span>Enable New Tab Page (offline Basic)</span>
      </label>
    </section>

    <section class="actions">
      <button class="btn primary" type="button" data-action="save">Save</button>
      <span class="note" data-note></span>
    </section>
  </div>`,n=t=>i.querySelector(t),o=i.querySelector("[data-note]"),m=n('[data-field="ai.baseUrl"]'),v=n('[data-field="ai.apiKey"]'),g=n('[data-field="ui.showKey"]'),y=n('[data-field="ai.shareTargetMode"]'),b=n('[data-field="ai.responseLanguage"]'),w=n('[data-field="ai.translateResults"]'),f=n('[data-field="ai.generateSvgGraphics"]'),S=n('[data-field="appearance.theme"]'),k=n('[data-field="core.ntpEnabled"]'),x=i.querySelector('[data-section="extension"]'),C=t=>{o&&(o.textContent=t,t&&setTimeout(()=>o.textContent="",1500))};if(r().then(t=>{m&&(m.value=(t?.ai?.baseUrl||"").trim()),v&&(v.value=(t?.ai?.apiKey||"").trim()),y&&(y.value=t?.ai?.shareTargetMode||"recognize"),b&&(b.value=t?.ai?.responseLanguage||"auto"),w&&(w.checked=Boolean(t?.ai?.translateResults)),f&&(f.checked=Boolean(t?.ai?.generateSvgGraphics)),S&&(S.value=t?.appearance?.theme||"auto"),k&&(k.checked=Boolean(t?.core?.ntpEnabled)),a.onTheme?.(S?.value||"auto")}).catch(()=>{}),g?.addEventListener("change",()=>{v&&g&&(v.type=g.checked?"text":"password")}),S?.addEventListener("change",()=>{a.onTheme?.(S.value||"auto")}),i.addEventListener("click",t=>{const e=t.target,s=e?.closest?.('button[data-action="save"]');s&&(async()=>{const t={ai:{baseUrl:m?.value?.trim?.()||"",apiKey:v?.value?.trim?.()||"",shareTargetMode:y?.value||"recognize",responseLanguage:b?.value||"auto",translateResults:Boolean(w?.checked),generateSvgGraphics:Boolean(f?.checked)},core:{ntpEnabled:Boolean(k?.checked)},appearance:{theme:S?.value||"auto"}};await l(t),C("Saved.")})().catch(t=>C(String(t)))}),a.isExtension){x&&(x.hidden=!1);const t=e`<div class="ext-note">Extension mode: settings are stored in <code>chrome.storage.local</code>.</div>`;i.append(t)}const T=i.querySelector("[data-custom-instructions]");if(T){const a=((a={})=>{const i=t({instructions:[],activeId:"",editingId:null,newLabel:"",newInstruction:"",isAdding:!1}),n=e`<div class="custom-instructions-editor">
        <div class="ci-header">
            <h4>Custom Instructions</h4>
            <p class="ci-desc">Define custom instructions to apply during "Recognize & Copy" operations.</p>
        </div>

        <div class="ci-active-select">
            <label>
                <span>Active instruction:</span>
                <select class="ci-select" data-action="select-active">
                    <option value="">None (use default)</option>
                </select>
            </label>
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
    </div>`,o=n.querySelector("[data-list]"),l=n.querySelector("[data-action='select-active']"),m=n.querySelector("[data-add-form]"),v=n.querySelector("[data-field='label']"),g=n.querySelector("[data-field='instruction']"),y=()=>{if(o.replaceChildren(),i.instructions.length)for(const t of i.instructions){const s=i.activeId===t.id,n=e`<div class="ci-item ${s?"active":""}" data-id="${t.id}">
                <div class="ci-item-header">
                    <span class="ci-item-label">${t.label}</span>
                    <div class="ci-item-actions">
                        ${s?e`<span class="ci-badge active">Active</span>`:e`<button class="btn tiny" type="button" data-action="activate">Use</button>`}
                        <button class="btn tiny" type="button" data-action="edit">Edit</button>
                        <button class="btn tiny danger" type="button" data-action="delete">×</button>
                    </div>
                </div>
                ${i.editingId===t.id?e`<div class="ci-edit-form">
                        <input type="text" class="ci-input" data-edit-field="label" value="${t.label}" />
                        <textarea class="ci-textarea" data-edit-field="instruction" rows="4">${t.instruction}</textarea>
                        <div class="ci-edit-actions">
                            <button class="btn small primary" type="button" data-action="save-edit">Save</button>
                            <button class="btn small" type="button" data-action="cancel-edit">Cancel</button>
                        </div>
                    </div>`:e`<div class="ci-item-preview">${w(t.instruction,120)}</div>`}
            </div>`;n.addEventListener("click",e=>{const s=e.target,o=s.closest("[data-action]")?.getAttribute("data-action");if("activate"===o&&u(t.id).then(()=>{i.activeId=t.id,y(),b(),a.onUpdate?.()}),"edit"===o&&(i.editingId=t.id,y()),"delete"===o&&confirm(`Delete "${t.label}"?`)&&p(t.id).then(()=>{i.instructions=i.instructions.filter(e=>e.id!==t.id),i.activeId===t.id&&(i.activeId=""),y(),b(),a.onUpdate?.()}),"save-edit"===o){const e=n.querySelector("[data-edit-field='label']"),s=n.querySelector("[data-edit-field='instruction']");h(t.id,{label:e.value.trim()||t.label,instruction:s.value.trim()}).then(()=>{t.label=e.value.trim()||t.label,t.instruction=s.value.trim(),i.editingId=null,y(),b(),a.onUpdate?.()})}"cancel-edit"===o&&(i.editingId=null,y())}),o.append(n)}else o.append(e`<div class="ci-empty">No custom instructions. Add one or use templates.</div>`)},b=()=>{l.replaceChildren(),l.append(e`<option value="">None (use default)</option>`);for(const t of i.instructions){const s=e`<option value="${t.id}">${t.label}</option>`;t.id===i.activeId&&(s.selected=!0),l.append(s)}},w=(t,e)=>!t||t.length<=e?t||"":t.slice(0,e).trim()+"…";return n.addEventListener("click",t=>{const e=t.target,n=e.closest("[data-action]")?.getAttribute("data-action");if("add"===n&&(i.isAdding=!0,m.hidden=!1,v.value="",g.value="",v.focus()),"cancel-add"===n&&(i.isAdding=!1,m.hidden=!0),"save-new"===n){const t=v.value.trim(),e=g.value.trim();if(!e)return void g.focus();c(t||"Custom",e).then(t=>{i.instructions.push(t),i.isAdding=!1,m.hidden=!0,y(),b(),a.onUpdate?.()})}if("add-templates"===n){const t=new Set(i.instructions.map(t=>t.label)),e=s.filter(e=>!t.has(e.label));if(!e.length)return void alert("All templates are already added.");d(e.map(t=>({label:t.label,instruction:t.instruction,enabled:t.enabled}))).then(t=>{i.instructions.push(...t),y(),b(),a.onUpdate?.()})}}),l.addEventListener("change",()=>{const t=l.value||"";u(t||null).then(()=>{i.activeId=t,y(),a.onUpdate?.()})}),(async()=>{const t=await r();i.instructions=t?.ai?.customInstructions||[],i.activeId=t?.ai?.activeInstructionId||"",y(),b()})(),n})({onUpdate:()=>C("Instructions updated.")});T.append(a)}return i})({isExtension:z(),onTheme:t=>F(g,t)});return U.append(a),void W()}return"history"===M.view?(U.append(M.historyManager.createHistoryView(t=>{"workcenter"===M.view&&(M.workCenterManager.getState().currentPrompt=t.prompt,G())})),void W()):"markdown-viewer"===M.view?(U.append(V()),void W()):"markdown-editor"===M.view?(U.append(await(async()=>{const t=function(t){return new E(t)}({initialContent:M.markdown||"",onContentChange:t=>{M.markdown=t,P()},onSave:t=>{M.markdown=t,P(),M.message="Content saved",W(),setTimeout(()=>{M.message="",W()},2e3)},placeholder:"Start writing your markdown here...",autoSave:!0,autoSaveDelay:2e3});return t.render()})()),void W()):"rich-editor"===M.view?(U.append(await(async()=>{const t=function(t){return new L(t)}({initialContent:M.markdown||"",onContentChange:t=>{M.markdown=t,P()},onSave:t=>{M.markdown=t,P(),M.message="Content saved",W(),setTimeout(()=>{M.message="",W()},2e3)},placeholder:"Start writing your rich text here...",autoSave:!0,autoSaveDelay:2e3});return t.render()})()),void W()):"workcenter"===M.view?(U.append(M.workCenterManager.renderWorkCenterView()),void W()):(U.append(V()),void W())},_=()=>{O.addEventListener("click",async t=>{const e=t.target,s=e?.closest?.("button[data-action]"),a=s?.dataset?.action;if(a){if("view-markdown-viewer"===a&&(M.view="markdown-viewer"),"view-markdown-editor"===a&&(M.view="markdown-editor"),"view-rich-editor"===a&&(M.view="rich-editor"),"view-workcenter"===a&&(M.view="workcenter"),"view-settings"===a&&(M.view="settings"),"view-history"===a&&(M.view="history"),"open-md"===a&&B.click(),"save-md"===a&&(async()=>{const t=M.markdown;if(t?.trim())try{if("showSaveFilePicker"in window){const e=await window.showSaveFilePicker({suggestedName:"document.md",types:[{description:"Markdown Files",accept:{"text/markdown":[".md"]}}]}),s=await e.createWritable();await s.write(t),await s.close(),M.message="File saved successfully!",W(),setTimeout(()=>{M.message="",W()},3e3)}else K()}catch(e){console.error("Failed to save file:",e),"AbortError"!==e.name&&K()}})(),"export-md"===a&&K(),"toggle-edit"===a){if("markdown"!==M.view)return;M.editing=!M.editing}if("snip"===a){if(!y)return;try{chrome.tabs.query({active:!0,lastFocusedWindow:!0,currentWindow:!0},t=>{const e=t?.[0]?.id;null!=e&&chrome.tabs.sendMessage(e,{type:"START_SNIP"})?.catch?.(()=>{});try{window.close?.()}catch{}})}catch{}}"solve"===a&&await J("Solve equations and answer questions from the content above",i),"code"===a&&await J("Generate code based on the description or requirements above",n),"css"===a&&await J("Extract or generate CSS from the content or image above",o),"voice"===a&&(async()=>{const t=await C();t&&await J(t)})(),G()}})};_(),B.addEventListener("change",()=>{const t=B.files?.[0];t&&t.text().then(t=>{M.markdown=t||"",P(),q(""),M.view="markdown",G()}).catch(()=>{}).finally(()=>{B.value=""})}),r().then(t=>{M.lastSavedTheme=t?.appearance?.theme||"auto",F(g,M.lastSavedTheme)}).catch(()=>F(g,"auto"));const Q=(()=>{try{return localStorage.getItem(A)||""}catch{return""}})();Q&&(async t=>{const e=t.trim();if(!e)return null;try{const t=new URL(e);if(!I.test(t.pathname))return null;const s=await fetch(t.href,{credentials:"include",cache:"no-store"});return s.ok?await s.text():null}catch{return null}})(Q).then(t=>{t&&(M.markdown=t,P(),G())}),G()})(m,v)}export{D as default};