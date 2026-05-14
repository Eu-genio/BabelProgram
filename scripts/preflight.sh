#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${1:-$ROOT_DIR/.env.local}"

info "Running preflight checks..."
"$SCRIPT_DIR/check-env.sh" "$ENV_FILE"
"$SCRIPT_DIR/check-api.sh" "$ENV_FILE"

ok "Preflight complete. Environment and API look good."
