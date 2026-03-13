import { spawnSync } from "node:child_process";

type ClipboardyModule = {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
};

let clipboardyModulePromise: Promise<ClipboardyModule | null> | null = null;

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
        const clipboardy = await loadClipboardy();
        if (clipboardy) return await clipboardy.read() ?? "";
        if (process.platform === "win32") return await readViaPowerShell();
        throw new Error("Clipboard driver unavailable");
    },
    write: async (text: string): Promise<string> => {
        const clipboardy = await loadClipboardy();
        if (clipboardy) {
            await clipboardy.write(text);
            return text;
        }
        if (process.platform === "win32") {
            await writeViaPowerShell(text);
            return text;
        }
        throw new Error("Clipboard driver unavailable");
    },
    clear: async (): Promise<void> => {
        await clipboardyDriver.write("");
    }
} as const;

export default clipboardyDriver;
