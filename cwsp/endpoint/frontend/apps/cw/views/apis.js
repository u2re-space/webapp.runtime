//#region src/frontend/views/apis/channel-actions.ts
/**
* Canonical channel action strings for {@link ChannelInvokableView.invokeChannelApi}.
* Align with UnifiedMessaging `type` / share-target flows where possible.
*/
/** Markdown / binary hand-off into Work Center or from Viewer. */
var FileAttachmentApiAction = {
	ViewerPushToWorkcenter: "viewer.attach-to-workcenter",
	WorkcenterAttach: "attach-files",
	WorkcenterFileAttach: "file-attach",
	WorkcenterShare: "content-share"
};
/** Home / speed-dial / wallpaper (StateStorage; helpers in `shared/routing/workspace-files-api`). */
var FileWorkspaceUseAction = {
	WallpaperSet: "workspace.wallpaper-set",
	WallpaperFromFile: "workspace.wallpaper-from-file",
	SpeedDialPinHref: "workspace.speed-dial-pin-href",
	SpeedDialPinFile: "workspace.speed-dial-pin-file"
};
/** explorer + FL-UI `ui-file-manager` wiring */
var ExplorerChannelAction = {
	NavigatePath: "navigate-path",
	ContentExplorer: "content-explorer",
	Navigate: "navigate",
	GetPath: "get-path",
	FileSave: "file-save",
	RequestUpload: "explorer-request-upload",
	RequestPaste: "explorer-request-paste",
	RequestUse: "explorer-request-use"
};
var ViewerChannelAction = {
	ContentView: "content-view",
	ContentLoad: "content-load",
	SetContent: "set-content",
	OpenUrl: "open-url",
	OpenMarkdownUrl: "open-markdown-url",
	AttachToWorkcenter: FileAttachmentApiAction.ViewerPushToWorkcenter
};
var SettingsChannelAction = {
	Patch: "patch",
	SettingsUpdate: "settings-update"
};
var AirpadChannelAction = {
	Start: "start",
	AirpadStart: "airpad-start",
	Retry: "retry"
};
var HomeChannelAction = {
	Navigate: "navigate",
	OpenView: "open-view",
	...FileWorkspaceUseAction
};
var HistoryChannelAction = {
	Reload: "reload",
	Refresh: "refresh"
};
var EditorChannelAction = {
	ContentLoad: "content-load",
	SetContent: "set-content",
	ContentEdit: "content-edit"
};
//#endregion
export { HomeChannelAction as a, HistoryChannelAction as i, EditorChannelAction as n, SettingsChannelAction as o, ExplorerChannelAction as r, ViewerChannelAction as s, AirpadChannelAction as t };
