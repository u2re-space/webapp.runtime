//#region src/com/config/SettingsTypes.ts
var BUILTIN_AI_MODELS = [
	"gpt-5.1",
	"gpt-5.2",
	"gpt-5.3",
	"gpt-5.4",
	"gpt-5.2-chat-latest",
	"gpt-5.3-chat-latest",
	"gpt-5.4-chat-latest",
	"gpt-5.3-instant"
];
var defaultSpeechLanguage = () => {
	const fallback = "en-US";
	if (typeof navigator === "undefined") return fallback;
	const normalized = (navigator.language || "").trim();
	if (normalized === "ru" || normalized.startsWith("ru-")) return "ru";
	if (normalized === "en-GB") return "en-GB";
	if (normalized === "en-US") return "en-US";
	if (normalized === "en" || normalized.startsWith("en-")) return "en";
	return fallback;
};
var DEFAULT_SETTINGS = {
	core: {
		mode: "native",
		endpointUrl: "http://localhost:6065",
		userId: "",
		userKey: "",
		encrypt: false,
		preferBackendSync: true,
		ntpEnabled: false,
		appClientId: "",
		useCoreIdentityForAirPad: true,
		allowInsecureTls: false,
		network: {
			listenPortHttps: 8443,
			listenPortHttp: 8080,
			bridgeEnabled: true,
			reconnectMs: 3e3,
			destinations: []
		},
		socket: {
			protocol: "auto",
			routeTarget: "",
			selfId: "",
			accessToken: "",
			transportMode: "plaintext",
			transportSecret: "",
			signingSecret: ""
		},
		interop: {
			ipcProtocol: "uniform",
			platformInterop: true,
			preferNativeIpc: true,
			preferNativeWebsocket: true
		},
		admin: {
			httpsOrigin: "https://localhost:8443",
			httpOrigin: "http://localhost:8080",
			path: "/"
		},
		ops: {
			allowUnencrypted: false,
			httpTargets: [],
			wsTargets: [],
			syncTargets: []
		}
	},
	shell: {
		preferNativeWebsocket: true,
		maintainHubSocketConnection: true,
		enableRemoteClipboardBridge: true,
		applyRemoteClipboardToDevice: true,
		pushLocalClipboardToLan: false,
		clipboardPushIntervalMs: 2e3,
		clipboardBroadcastTargets: "",
		enableNativeSms: true,
		enableNativeContacts: true
	},
	ai: {
		apiKey: "",
		baseUrl: "",
		model: "gpt-5.2",
		customModel: "",
		defaultReasoningEffort: "medium",
		defaultVerbosity: "medium",
		maxOutputTokens: 4e5,
		contextTruncation: "disabled",
		promptCacheRetention: "in-memory",
		maxToolCalls: 8,
		parallelToolCalls: true,
		mcp: [],
		shareTargetMode: "recognize",
		autoProcessShared: true,
		customInstructions: [],
		activeInstructionId: "",
		responseLanguage: "auto",
		translateResults: false,
		generateSvgGraphics: false,
		requestTimeout: {
			low: 60,
			medium: 300,
			high: 900
		},
		maxRetries: 2
	},
	webdav: {
		url: "http://localhost:6065",
		username: "",
		password: "",
		token: ""
	},
	timeline: { source: "" },
	appearance: {
		theme: "auto",
		fontSize: "medium",
		color: "",
		markdown: {
			customCss: "",
			printCss: "",
			extensions: [],
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
			}
		}
	},
	speech: { language: defaultSpeechLanguage() },
	grid: {
		columns: 4,
		rows: 8,
		shape: "square"
	}
};
//#endregion
export { DEFAULT_SETTINGS as n, BUILTIN_AI_MODELS as t };
