#!/usr/bin/env bash
set -euo pipefail

# --- Configuration Defaults ---
APP_DIR="/root/webapp"
APP_PORT="443"
APP_HOST="0.0.0.0"
INTERNAL_PORT="443"
TZ_VAL="Asia/Krasnoyarsk"
NODE_IMAGE="${NODE_IMAGE:-node:25-alpine}"
WITH_CADDY="0"
DOMAIN=""
ACME_EMAIL=""
GIT_URL=""
GIT_BRANCH=""

usage() {
  cat <<EOF
Usage: $0 [--dir ${APP_DIR}] [--port ${APP_PORT}] [--tz Asia/Krasnoyarsk]
          [--git <repo_url>] [--branch <branch>]
          [--with-caddy --domain example.com --email you@example.com]
EOF
}

# --- Parse Arguments ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) APP_DIR="$2"; shift 2;;
    --port) APP_PORT="$2"; shift 2;;
    --tz) TZ_VAL="$2"; shift 2;;
    --git) GIT_URL="$2"; shift 2;;
    --branch) GIT_BRANCH="$2"; shift 2;;
    --with-caddy) WITH_CADDY="1"; shift;;
    --domain) DOMAIN="$2"; shift 2;;
    --email) ACME_EMAIL="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root."
  exit 1
fi

echo ">>> [1/7] Preparing environment..."

# 1. ОСТАНАВЛИВАЕМ сервис перед любыми действиями, чтобы Systemd не конфликтовал с нами.
if systemctl list-units --full -all | grep -Fq "webapp-compose.service"; then
    echo "Stopping existing service to allow updates..."
    systemctl stop webapp-compose || true
fi

# 2. Установим curl/git только если их нет, чтобы не дергать apt лишний раз
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
if ! command -v curl >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1; then
    echo "Installing basics..."
    apt-get update -q && apt-get install -y -q curl git ca-certificates ufw
fi

# 3. БЕЗОПАСНАЯ УСТАНОВКА DOCKER
# Если docker УЖЕ есть, мы пропускаем этот шаг полностью.
# Это спасает от удаления docker-ce при попытке apt обновить плагины.
if command -v docker >/dev/null 2>&1; then
    echo "Docker is already installed. Skipping installation to avoid conflicts."
else
    echo ">>> [2/7] Installing Docker Engine..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi

mkdir -p "$APP_DIR"

# --- UFW Configuration ---
echo ">>> [3/7] Checking Firewall..."
if command -v ufw >/dev/null 2>&1; then
    # Не делаем reset, просто открываем порты, если они закрыты
    ufw allow 22/tcp >/dev/null
    ufw allow 80/tcp >/dev/null
    ufw allow 443/tcp >/dev/null
    # Включаем только если выключен
    if ! ufw status | grep -q "Status: active"; then
        echo "y" | ufw enable
    fi
fi

# --- Git Logic ---
if [[ -n "$GIT_URL" ]]; then
  echo ">>> [4/7] Updating source code..."
  if [[ ! -d "$APP_DIR/.git" ]]; then
    git clone "$GIT_URL" "$APP_DIR"
    cd "$APP_DIR"
    [[ -n "$GIT_BRANCH" ]] && git checkout "$GIT_BRANCH"
  else
    cd "$APP_DIR"
    # Сброс изменений локально и подтягивание свежего
    git fetch origin
    if [[ -n "$GIT_BRANCH" ]]; then
        git checkout "$GIT_BRANCH"
    fi
    git reset --hard "origin/${GIT_BRANCH:-$(git branch --show-current)}" || git pull
  fi
else
  cd "$APP_DIR"
fi

#
docker compose down --rmi all
chmod 777 -R ./
echo ">>> [5/7] Generating configs..."

# .dockerignore
cat > .dockerignore <<'EOF'
node_modules
npm-debug.log
Dockerfile*
docker-compose*
.git
.env
data
config
EOF

# Dockerfile
cat > Dockerfile <<EOF
# syntax=docker/dockerfile:1
ARG NODE_IMAGE=${NODE_IMAGE}
FROM \${NODE_IMAGE} AS deps
WORKDIR /app
COPY package*.json ./
RUN node -v && npm -v \
 && npm config list \
 && npm install --include=dev --verbose --no-audit --no-fund
RUN ls -la /app && ls -la /app/node_modules || true

FROM \${NODE_IMAGE} AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p /app/node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN adduser -D -H app
# chown -R app:app /app
USER app
# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:${INTERNAL_PORT}/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
# Start command overriding via compose
CMD ["node"] 
EOF

# .env
cat > .env <<EOF
NODE_ENV=production
TZ=${TZ_VAL}
PORT=${INTERNAL_PORT}
EOF

# docker-compose.yml
# Определяем секцию портов
if [[ "$WITH_CADDY" == "1" ]]; then
    # Если Caddy включен, приложение не светится наружу (только localhost для дебага)
    PORT_MAPPING="127.0.0.1:8080:${INTERNAL_PORT}"
else
    # Если без Caddy, светим наружу как заказали
    PORT_MAPPING="${APP_HOST}:${APP_PORT}:${INTERNAL_PORT}"
fi

cat > docker-compose.yml <<EOF
version: "3.8"
services:
  app:
    container_name: webapp-compose
    build:
      context: .
      args:
        NODE_IMAGE: ${NODE_IMAGE}
    dns:
      - 1.1.1.1
      - 8.8.8.8
    env_file: .env
    restart: unless-stopped
    ports:
      - "${PORT_MAPPING}"
    volumes:
      - .:/app
      - app_data:/app/data
      - app_config:/config
      - /etc/localtime:/etc/localtime:ro
    command: node ./fastify/scripts/index.mjs --port ${INTERNAL_PORT} --address 0.0.0.0 --esm
    logging:
      driver: "json-file"
      options:
        max-size: "10m"

  # Dev profile (optional)
  dev:
    profiles: ["dev"]
    image: ${NODE_IMAGE}
    working_dir: /app
    env_file: .env
    ports:
      - "${PORT_MAPPING}"
    volumes:
      - .:/app
    command: sh -c "npm i && npx nodemon server.js"

EOF

# Дописываем Caddy, если нужно
if [[ "$WITH_CADDY" == "1" && -n "$DOMAIN" ]]; then
cat >> docker-compose.yml <<EOF

  caddy:
    image: caddy:2-alpine
    depends_on:
      - app
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
EOF

cat > Caddyfile <<EOF
{
  email ${ACME_EMAIL}
}
${DOMAIN} {
  reverse_proxy app:${INTERNAL_PORT}
}
EOF
fi

# Volumes section
cat >> docker-compose.yml <<EOF

volumes:
  app_data: {}
  app_config: {}
  caddy_data: {}
  caddy_config: {}
EOF

mkdir -p data config

# --- Systemd Unit ---
# Определяем путь к docker СЕЙЧАС, когда мы уверены, что он установлен
DOCKER_BIN=$(which docker)
if [[ -z "$DOCKER_BIN" ]]; then
    echo "CRITICAL ERROR: Docker binary not found after install step."
    exit 1
fi

echo ">>> [6/7] Installing Systemd Service..."

cat > /etc/systemd/system/webapp-compose.service <<EOF
[Unit]
Description=WebApp Docker Compose
# Ждем сеть и сам докер
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
# 1. Удаляем старые контейнеры перед стартом (чистка)
ExecStartPre=-${DOCKER_BIN} compose down --remove-orphans
# 2. Запускаем в foreground
ExecStart=${DOCKER_BIN} compose up --build
# 3. Останавливаем корректно
ExecStop=${DOCKER_BIN} compose down
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF

# Обновляем Systemd
systemctl daemon-reload
systemctl enable webapp-compose

echo ">>> [7/7] Starting..."
systemctl restart webapp-compose

# Wait a bit to show status
sleep 2
systemctl status webapp-compose --no-pager | head -n 15

#
echo ""
echo "-----------------------------------------------------"
echo "Setup Complete."
if [[ "$WITH_CADDY" == "1" ]]; then
    echo "URL: https://${DOMAIN}"
else
    echo "URL: http://${APP_HOST}:${APP_PORT}"
fi
echo "Logs: journalctl -u webapp-compose -f"

#
sleep 4

#
docker compose -f docker-compose.yml up -d
