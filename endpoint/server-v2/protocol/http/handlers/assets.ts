import { readFile } from "node:fs/promises";
import path from "node:path";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ADMIN_DIR } from "../../utils/paths.ts";

const PHOSPHOR_STYLES = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;
type PhosphorStyle = (typeof PHOSPHOR_STYLES)[number];

const ADMIN_FALLBACK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2a2.6 2.6 0 0 1 2.6 2.6V7.4l4.1 2.1c.6.3 1 1 1 1.7v4.6c0 .7-.4 1.4-1 1.7l-4.1 2.1v1.6c0 1.4-1.2 2.6-2.6 2.6H6.6C5.2 21 4 19.8 4 18.4V13.2c0-.7.4-1.4 1-1.7l4.2-2.1V4.6A2.6 2.6 0 0 1 11.8 2H12Zm-1 12.1v4.8c0 .5.4.9.9.9h6.1c.5 0 .9-.4.9-.9V13l-.2-.1l-3.6-1.8V11h-4v3.1Zm-1-8.5V19c0 .4-.3.7-.7.7h-.6c-.4 0-.7-.3-.7-.7v-1.6L4.4 14.7A.6.6 0 0 1 4 14.1V8.9a.6.6 0 0 1 .4-.6L10 5.3V8h2V3.6c0-.4-.3-.8-.8-.8H11.7c-.4 0-.7.3-.7.7Z"/>
</svg>`;

const isValidPhosphorStyle = (value: string): value is PhosphorStyle => {
    return (PHOSPHOR_STYLES as readonly string[]).includes(value);
};

const isValidPhosphorIconName = (value: string): boolean => /^[a-z0-9-]+$/i.test(value);

const withStyleSuffix = (style: PhosphorStyle, iconName: string): string => {
    if (style === "duotone") return `${iconName}-duotone`;
    if (style === "regular") return iconName;
    return `${iconName}-${style}`;
};

const phosphorCdnUrl = (style: PhosphorStyle, iconName: string): string => {
    const fileName = withStyleSuffix(style, iconName);
    return `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/${style}/${fileName}.svg`;
};

const proxyPhosphorIcon = async (reply: FastifyReply, style: string, iconRaw: string) => {
    const iconName = iconRaw.replace(/\.svg$/i, "").trim().toLowerCase();
    const normalizedStyle = style.trim().toLowerCase();

    if (!isValidPhosphorStyle(normalizedStyle)) {
        return reply.code(400).send({ ok: false, error: `Invalid phosphor style: ${style}` });
    }
    if (!isValidPhosphorIconName(iconName)) {
        return reply.code(400).send({ ok: false, error: `Invalid icon name: ${iconRaw}` });
    }

    const upstreamUrl = phosphorCdnUrl(normalizedStyle, iconName);
    try {
        const res = await fetch(upstreamUrl, {
            method: "GET",
            headers: { accept: "image/svg+xml,text/plain,*/*" }
        });
        if (!res.ok) {
            return reply.code(res.status).send({
                ok: false,
                error: "Icon not found in upstream source",
                style: normalizedStyle,
                icon: iconName
            });
        }

        const svg = await res.text();
        reply.header("Content-Type", "image/svg+xml; charset=utf-8");
        reply.header("Cache-Control", "public, max-age=604800");
        return reply.send(svg);
    } catch (error) {
        return reply.code(502).send({
            ok: false,
            error: "Failed to fetch upstream icon",
            details: String(error)
        });
    }
};

const sendAdminIcon = (reply: FastifyReply) => {
    return reply
        .type("image/svg+xml; charset=utf-8")
        .header("Cache-Control", "public, max-age=604800")
        .send(ADMIN_FALLBACK_ICON);
};

export const registerAssetsHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    app.get("/admin", async (_req, reply) => {
        reply.header("Content-Type", "text/html; charset=utf-8");
        reply.header("Cache-Control", "public, max-age=3600");
        return reply.send(await readFile(path.resolve(ADMIN_DIR, "index.html"), { encoding: "utf-8" }));
    });

    app.get("/admin/icon.svg", async (_req, reply) => sendAdminIcon(reply));
    app.get("/icon.svg", async (_req, reply) => sendAdminIcon(reply));

    app.get("/assets/icons/phosphor", async () => ({
        ok: true,
        source: "@phosphor-icons/core@2",
        styles: PHOSPHOR_STYLES
    }));

    app.get("/assets/icons/phosphor/:style/:icon", async (request: FastifyRequest<{ Params: { style: string; icon: string } }>, reply) => {
        return proxyPhosphorIcon(reply, request.params.style, request.params.icon);
    });

    app.get("/assets/icons/duotone", async () => ({
        ok: true,
        aliasOf: "/assets/icons/phosphor/duotone/:icon",
        styles: ["duotone"]
    }));

    app.get("/assets/icons/duotone/:icon", async (request: FastifyRequest<{ Params: { icon: string } }>, reply) => {
        return proxyPhosphorIcon(reply, "duotone", request.params.icon);
    });

    app.get("/assets/icons", async () => ({
        ok: true,
        source: "@phosphor-icons/core@2",
        defaultStyle: "duotone",
        styles: PHOSPHOR_STYLES,
        aliases: {
            duotone: "/assets/icons/duotone/:icon",
            style: "/assets/icons/:style/:icon",
            default: "/assets/icons/:icon"
        }
    }));

    app.get("/assets/icons/:style/:icon", async (request: FastifyRequest<{ Params: { style: string; icon: string } }>, reply) => {
        return proxyPhosphorIcon(reply, request.params.style, request.params.icon);
    });

    app.get("/assets/icons/:icon", async (request: FastifyRequest<{ Params: { icon: string } }>, reply) => {
        return proxyPhosphorIcon(reply, "duotone", request.params.icon);
    });
};
