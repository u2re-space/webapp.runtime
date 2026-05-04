# CWSP portable image. Build context: this directory (`runtime/`).
#   docker build -t cwsp-runtime -f Dockerfile .
# Chrome extension (host): npm run cwsp:pack-extension from runtime/ → pack/crx (Load unpacked).
#
# Multi-stage: compile portable bundle + frontend inside the image, then a slim runtime.
FROM node:24-bookworm-slim AS builder
WORKDIR /build/cwsp
COPY cwsp/package.json ./
RUN npm install --include=dev --no-audit --no-fund
COPY cwsp/ ./
# Replace `scripts` symlink (→ ../scripts) with real files so Node runs build from /build/cwsp and resolves esbuild.
RUN rm -rf scripts && mkdir -p scripts
COPY scripts/build-portable.mjs scripts/bundle-portable-extra.mjs scripts/resolve-cwsp-root.mjs scripts/sync-frontend.mjs ./scripts/
COPY frontend ../frontend
COPY endpoint/endpoint/config /build/endpoint/endpoint/config/
COPY endpoint/endpoint/portable /build/endpoint/endpoint/portable/
COPY endpoint/endpoint/portable.config.json /build/endpoint/endpoint/portable.config.json
COPY endpoint/endpoint/portable.config.110.json /build/endpoint/endpoint/portable.config.110.json
COPY endpoint/endpoint/portable.config.vds.json /build/endpoint/endpoint/portable.config.vds.json
RUN npm run build:portable

FROM node:24-bookworm-slim AS runner
WORKDIR /opt/cwsp
COPY --from=builder /build/cwsp/dist/portable/ ./
USER node
EXPOSE 8080 8443 80 443
ENV NODE_ENV=production
CMD ["node", "cwsp.mjs"]
