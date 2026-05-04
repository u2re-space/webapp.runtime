#!/usr/bin/env bash
# Self-signed TLS for CWSP portable / LAN + u2re.space (browsers must trust once per device).
# Usage: ./ensure-lan-tls.sh [output_dir]
#   output_dir default: <repo>/runtime/cwsp/https/local
# Env: FORCE_TLS_REGEN=1 — перезаписать существующие multi.key / multi.crt
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
U2RE="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUT_DIR="${1:-$U2RE/runtime/cwsp/https/local}"
KEY="$OUT_DIR/multi.key"
CRT="$OUT_DIR/multi.crt"
DAYS="${TLS_CERT_DAYS:-825}"

mkdir -p "$OUT_DIR"

if [[ -f "$KEY" && -f "$CRT" && "${FORCE_TLS_REGEN:-}" != "1" ]]; then
    echo "[ensure-lan-tls] Уже есть: $CRT (FORCE_TLS_REGEN=1 чтобы пересоздать)"
    exit 0
fi

echo "[ensure-lan-tls] Генерация $CRT (SAN: u2re.space, LAN 192.168.0.110/200, localhost)…"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

cat >"$TMP" <<'EOF'
[req]
distinguished_name = req_dn
x509_extensions = v3_req
prompt = no

[req_dn]
CN = u2re.space
O = U2RE LAN

[v3_req]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = u2re.space
DNS.2 = www.u2re.space
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.0.110
IP.3 = 192.168.0.200
EOF

openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$KEY" -out "$CRT" -days "$DAYS" \
    -config "$TMP" -extensions v3_req

chmod 600 "$KEY" 2>/dev/null || true
echo "[ensure-lan-tls] Готово. Импортируйте $CRT в телефон/ПК как доверенный (или свой root CA)."
echo "[ensure-lan-tls] Доп. IP/DNS: отредактируйте alt_names в $SCRIPT_DIR/ensure-lan-tls.sh и FORCE_TLS_REGEN=1"
