#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${1:-$ROOT_DIR/.env.local}"
load_env_file "$ENV_FILE"

require_command "curl"
require_command "jq"

API_BASE="${VITE_API_BASE_URL:-http://localhost:5240/api}"
if [[ "$API_BASE" != */api ]]; then
  API_BASE="${API_BASE%/}/api"
fi

info "Using API base: $API_BASE"

EMAIL="bash-check-$(date +%s)@example.com"
PASSWORD="Password123!"
NAME="Bash Check User"

info "Registering temporary user..."
REGISTER_RESPONSE="$(curl -sS -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"

TOKEN="$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')"
if [[ -z "$TOKEN" ]]; then
  err "Failed to retrieve token from /auth/register response."
  err "Response: $REGISTER_RESPONSE"
  exit 1
fi
ok "Received auth token from /auth/register."

info "Checking /auth/me..."
ME_STATUS="$(curl -sS -o /tmp/babel-me.json -w "%{http_code}" "$API_BASE/auth/me" \
  -H "Authorization: Bearer $TOKEN")"
if [[ "$ME_STATUS" != "200" ]]; then
  err "/auth/me failed with status $ME_STATUS"
  cat /tmp/babel-me.json
  exit 1
fi
ok "/auth/me returned 200."

info "Checking market endpoints..."
for endpoint in "market/watchlist?symbols=AAPL,MSFT" "market/movers" "market/news?symbols=AAPL,MSFT"; do
  status="$(curl -sS -o /tmp/babel-market.json -w "%{http_code}" "$API_BASE/$endpoint" \
    -H "Authorization: Bearer $TOKEN")"
  if [[ "$status" != "200" ]]; then
    err "$endpoint failed with status $status"
    cat /tmp/babel-market.json
    exit 1
  fi
  ok "$endpoint returned 200."
done

ok "API checks passed."
