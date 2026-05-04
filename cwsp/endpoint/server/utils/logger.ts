import fs from "node:fs";
import path from "node:path";
import { CONFIG_DIR } from "./paths.ts";

const LOG_FILE_PATH = path.join(CONFIG_DIR, "endpoint.log");

export const logStructured = (marker: string, data: Record<string, any>, message?: string) => {
    const timestamp = new Date().toISOString();
    
    // File-based structured JSON logging
    const logEntry = {
        timestamp,
        marker,
        message,
        ...data
    };
    
    try {
        fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(logEntry) + "\n", "utf8");
    } catch (e) {
        // Ignore file write errors to prevent crashing
    }

    // Human-readable, table-like terminal output
    process.stdout.write(`\n${timestamp} ${marker} ${message ? `- ${message}` : ""}\n`);
    
    if (Object.keys(data).length > 0) {
        const tableData = Object.entries(data).map(([key, value]) => {
            const displayValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            return { Key: key, Value: displayValue.length > 80 ? displayValue.substring(0, 77) + "..." : displayValue };
        });
        console.table(tableData);
    }
};

export const logger = {
    info: (marker: string, data: Record<string, any> = {}, message?: string) => logStructured(marker, data, message),
    error: (marker: string, data: Record<string, any> = {}, message?: string) => logStructured(marker, { level: "error", ...data }, message),
    warn: (marker: string, data: Record<string, any> = {}, message?: string) => logStructured(marker, { level: "warn", ...data }, message)
};
