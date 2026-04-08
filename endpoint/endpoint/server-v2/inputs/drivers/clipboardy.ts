import { spawnSync } from "node:child_process";

type ClipboardyModule = {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
};

let clipboardyModulePromise: Promise<ClipboardyModule | null> | null = null;
let memoryClipboard = "";

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
            const clipboardy = await loadClipboardy();
            if (clipboardy) {
                const value = await clipboardy.read();
                memoryClipboard = String(value ?? "");
                return memoryClipboard;
            }
            if (process.platform === "win32") {
                const value = await readViaPowerShell();
                memoryClipboard = String(value ?? "");
                return memoryClipboard;
            }
        } catch (error) {
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
            const clipboardy = await loadClipboardy();
            if (clipboardy) {
                await clipboardy.write(value);
                return value;
            }
            if (process.platform === "win32") {
                await writeViaPowerShell(value);
                return value;
            }
        } catch (error) {
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
