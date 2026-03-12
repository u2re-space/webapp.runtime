import { Buffer } from "node:buffer";
import { isKeyboardMessage, isMouseMessage, parseBinaryMessage } from "../../../server/io/message.ts";

export type BinaryAssetInput =
    | ArrayBuffer
    | ArrayBufferView
    | Blob
    | File
    | URL
    | string;

export type BinaryAssetDescriptor = {
    buffer: Buffer;
    hash: string;
    mimeType: string;
    name: string;
    size: number;
    source: string;
};

export type ParsedBinaryEnvelope = BinaryAssetDescriptor & {
    isKeyboard: boolean;
    isMouse: boolean;
    message: ReturnType<typeof parseBinaryMessage>;
};

const loadNormalizeDataAsset = async () => {
    const moduleUrl = new URL("../../../../../modules/projects/lur.e/src/extension/core/Base64Data.ts", import.meta.url);
    const module = await import(moduleUrl.href);
    return module.normalizeDataAsset as (
        input: Blob | File | URL | string,
        options?: { mimeType?: string; namePrefix?: string }
    ) => Promise<{
        file: File;
        hash: string;
        name: string;
        size: number;
        source: string;
        type: string;
    }>;
};

const toBinaryAssetInput = (input: BinaryAssetInput): Blob | File | URL | string => {
    if (typeof input === "string" || input instanceof URL || input instanceof Blob || input instanceof File) {
        return input;
    }
    if (ArrayBuffer.isView(input)) {
        const sourceBytes = new Uint8Array(input.buffer as ArrayBuffer, input.byteOffset, input.byteLength);
        const bytes = new Uint8Array(sourceBytes.length);
        bytes.set(sourceBytes);
        return new Blob([bytes], { type: "application/octet-stream" });
    }
    return new Blob([input], { type: "application/octet-stream" });
};

export const normalizeBinaryAsset = async (
    input: BinaryAssetInput,
    options: {
        mimeType?: string;
        namePrefix?: string;
    } = {}
): Promise<BinaryAssetDescriptor> => {
    const normalizeDataAsset = await loadNormalizeDataAsset();
    const asset = await normalizeDataAsset(toBinaryAssetInput(input), {
        mimeType: options.mimeType || "application/octet-stream",
        namePrefix: options.namePrefix || "binary"
    });
    const buffer = Buffer.from(await asset.file.arrayBuffer());

    return {
        buffer,
        hash: asset.hash,
        mimeType: asset.type,
        name: asset.name,
        size: asset.size,
        source: asset.source
    };
};

export const parseBinaryEnvelope = async (
    input: BinaryAssetInput,
    options: {
        mimeType?: string;
        namePrefix?: string;
    } = {}
): Promise<ParsedBinaryEnvelope> => {
    const asset = await normalizeBinaryAsset(input, options);
    const message = parseBinaryMessage(asset.buffer);

    return {
        ...asset,
        isKeyboard: isKeyboardMessage(message),
        isMouse: isMouseMessage(message),
        message
    };
};
