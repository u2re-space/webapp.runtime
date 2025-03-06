const warningCode = `
<div id="vital-test-fail-warning">
    <h1>Browser features check failed!</h1>
    <p>Your browser does not support some required CSS features:</p>
    <ul>
        <li>- <code>@container</code> with custom properties</li>
        <li>- <code>:host-context()</code> (in shadow DOM)</li>
    </ul>
    <p>We currently do not provide a fallback for these features.</p>
    <!--<button id="continue-button">Continue Anyway</button>-->
</div>
`;

const warningCSS = `
body { user-select: none; pointer-events: none; overflow: visible; content-visibility: visible; contain: none; }
#vital-test-fail-warning {
    visibility: visible;
    content-visibility: visible;
    box-sizing: border-box;
    display: flex !important;
    position: fixed;
    inset: 0px;
    inline-size: 100% !important;
    block-size: max(100%, 100dvb) !important;
    background-color: darkblue;
    color: white !important;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    z-index: 1000;
    user-select: none;
    pointer-events: auto;
    place-items: center;
    place-content: center;
    flex-direction: column;
}

#vital-test-fail-warning * {
    color: white;
    content-visibility: visible;
    opacity: 1;
    user-select: none;
    pointer-events: none;
    list-style-type: none;
}

#vital-test-fail-warning ul {
    text-align: start;
    inline-size: max-content;
    display: inline-block;
}
`

//
const cssCode = `
body { container-name: body; --vital-flag: 1; overflow: visible; content-visibility: visible; contain: none; }
#vital-test-container { display: none !important; color: red; opacity: 0 !important; position: fixed !important; inset: 0px !important; inline-size: 1px !important; block-size: 1px !important; }
@container body style(--vital-flag: 1) { #vital-test-container { color: green; } }
`

//
export const doTest = ()=>{
    const style = document.createElement("style");
    const test = document.createElement("div");

    //
    style.innerHTML = cssCode;
    test.id = "vital-test-container";

    //
    document.head.appendChild(style);
    document.body.appendChild(test);

    //
    const status = (CSS.supports("selector(:host-context(body))") && getComputedStyle(test).color == "rgb(0, 128, 0)");

    //
    document.head.removeChild(style);
    document.body.removeChild(test);

    //
    if (!status) { console.error("CRITICAL FEATURES DOESN'T SUPPORTED!"); };

    //
    return status;
}

//
export const placeCSSCompatWarning = ()=>{
    if (doTest()) return true;

    //
    const parser = new DOMParser();
    const doc = parser.parseFromString(warningCode, 'text/html');
    const style = document.createElement("style");
    style.innerHTML = warningCSS;
    document.head.appendChild(style);

    //
    const element = doc.body.firstChild;
    if (element) {
        doc.body.removeChild(element);
        document.body.appendChild(element);
    }
    return false;
}
