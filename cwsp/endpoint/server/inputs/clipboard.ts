/**
 * Minimal legacy clipboard helpers used by HTTP transport (`/clipboard` local-write)
 * and `utils/routes.ts`. Full peer polling lives in Socket.IO coordinator + Airpad.
 */
import { createClipboardAccess } from "./access/clipboard.ts";

let broadcastSuppressedUntil = 0;
let suppressedClipboardText = "";
const access = createClipboardAccess();

export function setBroadcasting(value: boolean, suppressMs = 2000, text?: string): void {
    if (value) {
        if (typeof text === "string") suppressedClipboardText = String(text);
        broadcastSuppressedUntil = Math.max(broadcastSuppressedUntil, Date.now() + Math.max(0, suppressMs));
    } else {
        broadcastSuppressedUntil = 0;
        suppressedClipboardText = "";
    }
}

export function isClipboardBroadcasting(): boolean {
    return broadcastSuppressedUntil > Date.now();
}

export function getSuppressedClipboardText(): string {
    return suppressedClipboardText;
}

export async function writeClipboard(text: string): Promise<boolean> {
    try {
        await access.write(String(text ?? ""));
        return true;
    } catch {
        return false;
    }
}
