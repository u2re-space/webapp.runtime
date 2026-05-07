#!/usr/bin/env bash
# Generate HTTPS certs with SAN for LAN IPs (192.168.0.110, 192.168.0.200, localhost).
# Output: https/local/rootCA.crt, multi.key, multi.crt
# Usage: ./scripts/gen-https-certs.sh   or: bash scripts/gen-https-certs.sh
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="${1:-$ROOT_DIR/https/local}"
mkdir -p "$OUT_DIR"
cd "$OUT_DIR"
SAN_DNS="${GEN_HTTPS_SAN_DNS:-localhost}"
SAN_IP="${GEN_HTTPS_SAN_IP:-127.0.0.1,192.168.0.110,192.168.0.200}"
OPENSSL_CONF="$(mktemp)"
trap 'rm -f "$OPENSSL_CONF"' EXIT
cat > "$OPENSSL_CONF" << EOF
[req]
distinguished_name = dn
req_extensions = san
[dn]
[san]
subjectAltName = DNS:$SAN_DNS,IP:$(echo "$SAN_IP" | sed 's/,/,IP:/g')
EOF
if [ ! -f rootCA.crt ] || [ ! -f rootCA.key ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -keyout rootCA.key -out rootCA.crt -days 3650 -subj "/CN=CrossWord Endpoint Root CA"
fi
openssl req -newkey rsa:2048 -nodes -keyout multi.key -out multi.csr -subj "/CN=localhost" -config "$OPENSSL_CONF"
openssl x509 -req -in multi.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out multi.crt -days 365 -extensions san -extfile "$OPENSSL_CONF"
rm -f multi.csr
echo "Generated $OUT_DIR: rootCA.crt, multi.key, multi.crt (SAN: $SAN_DNS, $SAN_IP)"
echo "Trust: open https://192.168.0.110:8443 once and accept, or install rootCA.crt."
