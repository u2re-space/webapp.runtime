import clipboardy from "clipboardy";

export const clipboardyDriver = {
    read: async (): Promise<string> => {
        return await clipboardy.read() ?? "";
    },
    write: async (text: string): Promise<string> => {
        await clipboardy.write(text);
        return text;
    },
    clear: async (): Promise<void> => {
        await clipboardy.write("");
    }
} as const;

export default clipboardyDriver;
