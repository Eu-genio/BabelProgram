#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${1:-$ROOT_DIR/.env.local}"
load_env_file "$ENV_FILE"

info "Checking required environment variables..."

FAILED=0

require_env() {
  local name="$1"
  local value="${!name:-}"
  if [[ -z "$value" ]]; then
    err "$name is not set."
    FAILED=1
  else
    ok "$name is set ($(mask_value "$value"))."
  fi
}

require_env "Jwt__Key"
require_env "Jwt__Issuer"
require_env "Jwt__Audience"
require_env "Finnhub__ApiKey"
require_env "VITE_API_BASE_URL"

if [[ $FAILED -eq 1 ]]; then
  err "Environment validation failed."
  exit 1
fi

ok "Environment validation passed."
