#!/usr/bin/env bash
#
# Сборка и выкладка на VDS (CrossWord PWA frontend + CWSP portable).
# Запуск: из любой директории, скрипт сам находит корень U2RE.space.
#
#   ./runtime/scripts/copy-to-vds.sh [tls|frontend|cwsp|all]
#
# Переменные окружения:
#   U2RE_SPACE_ROOT   — корень монорепо (по умолчанию: два уровня вверх от этого скрипта)
#   VDS_SSH            — user@host (по умолчанию root@45.150.9.153)
#   VDS_PORT           — SSH порт (22)
#   VDS_FRONTEND_REMOTE — каталог PWA на сервере
#   VDS_CWSP_REMOTE    — каталог CWSP portable на сервере
#   SSH_IDENTITY_FILE  — ключ (по умолчанию ~/.ssh/id_ecdsa если файл есть)
#   SKIP_TLS=1         — не генерировать сертификаты
#   SKIP_CRX=1         — не собирать CRX после frontend
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
U2RE="${U2RE_SPACE_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

VDS_SSH="${VDS_SSH:-root@45.150.9.153}"
VDS_PORT="${VDS_PORT:-22}"
VDS_FRONTEND_REMOTE="${VDS_FRONTEND_REMOTE:-/root/webapp/frontend/apps/cw}"
VDS_CWSP_REMOTE="${VDS_CWSP_REMOTE:-/root/cwsp-portable}"
SSH_IDENTITY_FILE="${SSH_IDENTITY_FILE:-$HOME/.ssh/id_ecdsa}"

MODE="${1:-all}"

ssh_opts=(-p "$VDS_PORT")
if [[ -f "$SSH_IDENTITY_FILE" ]]; then
    ssh_opts+=(-i "$SSH_IDENTITY_FILE")
fi

run_tls() {
    if [[ "${SKIP_TLS:-}" == "1" ]]; then
        echo "[copy-to-vds] SKIP_TLS=1 — сертификаты не трогаем"
        return 0
    fi
    bash "$SCRIPT_DIR/ensure-lan-tls.sh" "$U2RE/runtime/cwsp/https/local"
    # Дублируем в endpoint-дерево, чтобы bundle-portable-extra подхватил при сборке
    local ep="$U2RE/runtime/endpoint/endpoint/https/local"
    if [[ -d "$(dirname "$ep")" ]]; then
        mkdir -p "$ep"
        cp -f "$U2RE/runtime/cwsp/https/local/multi.key" "$ep/" 2>/dev/null || true
        cp -f "$U2RE/runtime/cwsp/https/local/multi.crt" "$ep/" 2>/dev/null || true
        echo "[copy-to-vds] Скопировано в $ep (если каталог есть)"
    fi
}

run_frontend() {
    echo "[copy-to-vds] npm run build:pwa (CrossWord)…"
    (cd "$U2RE/apps/CrossWord" && npm run build:pwa)
    local LOCAL_DIST="$U2RE/apps/CrossWord/dist"
    if [[ ! -d "$LOCAL_DIST" ]]; then
        echo "[copy-to-vds] Ошибка: нет $LOCAL_DIST" >&2
        exit 2
    fi
    echo "[copy-to-vds] tar → ssh $VDS_SSH:$VDS_FRONTEND_REMOTE"
    # shellcheck disable=SC2029
    tar -C "$LOCAL_DIST" -chpf - . \
        | ssh "${ssh_opts[@]}" "$VDS_SSH" "rm -rf '${VDS_FRONTEND_REMOTE}'/* && mkdir -p '${VDS_FRONTEND_REMOTE}' && cd '${VDS_FRONTEND_REMOTE}' && tar xpf -"

    if [[ "${SKIP_CRX:-}" != "1" ]]; then
        echo "[copy-to-vds] npm run build:crx…"
        (cd "$U2RE/apps/CrossWord" && npm run build:crx) || true
    fi
}

run_cwsp() {
    echo "[copy-to-vds] npm run build:portable (CWSP)…"
    (cd "$U2RE/runtime/cwsp" && npm run build:portable)
    echo "[copy-to-vds] deploy-cwsp-portable.mjs → $VDS_SSH:$VDS_CWSP_REMOTE"
    export CWSP_DEPLOY_SSH="$VDS_SSH"
    export CWSP_DEPLOY_DIR="$VDS_CWSP_REMOTE"
    export CWSP_SSH_PORT="$VDS_PORT"
    export CWSP_SSH_IDENTITY="${SSH_IDENTITY_FILE}"
    node "$SCRIPT_DIR/deploy-cwsp-portable.mjs"
    echo ""
    echo "[copy-to-vds] На VDS выполните (один раз после первого выката или при смене deps):"
    echo "  ssh ${ssh_opts[*]} $VDS_SSH \"cd '$VDS_CWSP_REMOTE' && npm install --omit=dev --no-audit --no-fund && pm2 restart cwsp\""
}

case "$MODE" in
    tls)      run_tls ;;
    frontend) run_frontend ;;
    cwsp)     run_tls; run_cwsp ;;
    all)      run_tls; run_frontend; run_cwsp ;;
    *)
        echo "Использование: $0 [tls|frontend|cwsp|all]" >&2
        exit 1
        ;;
esac

echo "[copy-to-vds] Готово ($MODE)."
