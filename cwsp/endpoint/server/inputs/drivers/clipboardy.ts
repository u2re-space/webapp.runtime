import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type ClipboardyModule = {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
};

let clipboardyModulePromise: Promise<ClipboardyModule | null> | null = null;
let memoryClipboard = "";
let ahkReadScriptPath = "";
let ahkWriteScriptPath = "";
const DEFAULT_AHK_PATH = "C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey64.exe";

const isHeadlessClipboardError = (error: unknown): boolean => {
    const msg = String((error as any)?.message || error || "").toLowerCase();
    return (
        msg.includes("can't open display") ||
        msg.includes("requires a display server") ||
        msg.includes("x11") ||
        msg.includes("wayland") ||
        msg.includes("xsel")
    );
};

const loadClipboardy = async (): Promise<ClipboardyModule | null> => {
    if (!clipboardyModulePromise) {
        clipboardyModulePromise = import("clipboardy")
            .then((module) => ((module as any)?.default || module) as ClipboardyModule)
            .catch(() => null);
    }
    return clipboardyModulePromise;
};

const getAhkPath = (): string => String(process.env.CWS_AUTOHOTKEY_PATH || DEFAULT_AHK_PATH).trim();

const ensureAhkScript = (kind: "read" | "write"): string => {
    const existing = kind === "read" ? ahkReadScriptPath : ahkWriteScriptPath;
    if (existing && fs.existsSync(existing)) return existing;
    const scriptPath = path.join(os.tmpdir(), `cwsp-clipboard-${kind}.ahk`);
    const script =
        kind === "read"
            ? `#Requires AutoHotkey v2.0
FileEncoding("UTF-8")
FileAppend(A_Clipboard, "*", "UTF-8")
`
            : `#Requires AutoHotkey v2.0
FileEncoding("UTF-8")
stdin := FileOpen("*", "r", "UTF-8")
text := stdin.Read()
A_Clipboard := text
ClipWait(1)
`;
    fs.writeFileSync(scriptPath, script, "utf8");
    if (kind === "read") ahkReadScriptPath = scriptPath;
    else ahkWriteScriptPath = scriptPath;
    return scriptPath;
};

const readViaAutoHotkey = async (): Promise<string> => {
    const ahkPath = getAhkPath();
    if (!ahkPath || !fs.existsSync(ahkPath)) {
        throw new Error(`AutoHotkey executable not found: ${ahkPath || "(empty path)"}`);
    }
    const result = spawnSync(ahkPath, [ensureAhkScript("read")], {
        encoding: "utf8",
        windowsHide: true
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || "AHK clipboard read failed").trim());
    return String(result.stdout || "");
};

const writeViaAutoHotkey = async (text: string): Promise<void> => {
    const ahkPath = getAhkPath();
    if (!ahkPath || !fs.existsSync(ahkPath)) {
        throw new Error(`AutoHotkey executable not found: ${ahkPath || "(empty path)"}`);
    }
    const result = spawnSync(ahkPath, [ensureAhkScript("write")], {
        input: text,
        encoding: "utf8",
        windowsHide: true
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || "AHK clipboard write failed").trim());
};

const readViaPowerShell = async (): Promise<string> => {
    const result = spawnSync("powershell", ["-NoProfile", "-Command", "Get-Clipboard"], {
        encoding: "utf8"
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || "Get-Clipboard failed").trim());
    return String(result.stdout || "").replace(/\r?\n$/, "");
};

const writeViaPowerShell = async (text: string): Promise<void> => {
    const result = spawnSync("powershell", ["-NoProfile", "-Command", "Set-Clipboard -Value ([Console]::In.ReadToEnd())"], {
        input: text,
        encoding: "utf8"
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || "Set-Clipboard failed").trim());
};

export const clipboardyDriver = {
    read: async (): Promise<string> => {
        try {
            if (process.platform === "win32") {
                const value = await readViaAutoHotkey();
                memoryClipboard = String(value ?? "");
                return memoryClipboard;
            }
            const clipboardy = await loadClipboardy();
            if (clipboardy) {
                const value = await clipboardy.read();
                memoryClipboard = String(value ?? "");
                return memoryClipboard;
            }
        } catch (error) {
            if (process.platform === "win32") {
                try {
                    const value = await readViaPowerShell();
                    memoryClipboard = String(value ?? "");
                    return memoryClipboard;
                } catch {
                    try {
                        const clipboardy = await loadClipboardy();
                        const value = clipboardy ? await clipboardy.read() : memoryClipboard;
                        memoryClipboard = String(value ?? "");
                        return memoryClipboard;
                    } catch {
                        // keep default fallback path below
                    }
                }
            }
            if (!isHeadlessClipboardError(error)) {
                // Preserve resilience: don't crash socket handlers on clipboard backend faults.
                console.warn("[clipboardyDriver] read failed, using memory fallback:", String((error as any)?.message || error));
            }
        }
        return memoryClipboard;
    },
    write: async (text: string): Promise<string> => {
        const value = String(text ?? "");
        memoryClipboard = value;
        try {
            if (process.platform === "win32") {
                await writeViaAutoHotkey(value);
                return value;
            }
            const clipboardy = await loadClipboardy();
            if (clipboardy) {
                await clipboardy.write(value);
                return value;
            }
        } catch (error) {
            if (process.platform === "win32") {
                try {
                    await writeViaPowerShell(value);
                    return value;
                } catch {
                    try {
                        const clipboardy = await loadClipboardy();
                        if (clipboardy) {
                            await clipboardy.write(value);
                            return value;
                        }
                        return value;
                    } catch {
                        // keep default fallback path below
                    }
                }
            }
            if (!isHeadlessClipboardError(error)) {
                console.warn("[clipboardyDriver] write failed, using memory fallback:", String((error as any)?.message || error));
            }
        }
        return value;
    },
    clear: async (): Promise<void> => {
        await clipboardyDriver.write("");
    }
} as const;

export default clipboardyDriver;
