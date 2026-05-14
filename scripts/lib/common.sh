#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
  printf "${BLUE}[INFO]${NC} %s\n" "$1"
}

warn() {
  printf "${YELLOW}[WARN]${NC} %s\n" "$1"
}

ok() {
  printf "${GREEN}[OK]${NC} %s\n" "$1"
}

err() {
  printf "${RED}[ERROR]${NC} %s\n" "$1" >&2
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Missing required command: $cmd"
    exit 1
  fi
}

load_env_file() {
  local env_file="${1:-.env.local}"
  if [[ -f "$env_file" ]]; then
    info "Loading env file: $env_file"
    # shellcheck disable=SC1090
    set -a && source "$env_file" && set +a
  else
    warn "Env file not found: $env_file (continuing with current environment)"
  fi
}

mask_value() {
  local value="$1"
  local len=${#value}
  if (( len <= 8 )); then
    printf "********"
  else
    printf "%s****%s" "${value:0:4}" "${value: -4}"
  fi
}
