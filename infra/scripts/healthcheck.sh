#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

PORT="${HTTP_PORT:-8080}"
BASE="http://localhost:${PORT}"

echo "Gateway: $BASE/health"
curl -sf "$BASE/health" | head -c 80 && echo ""

echo "API (Laravel): $BASE/up"
curl -sf "$BASE/up" | head -c 120 && echo ""

echo "API interna:"
docker compose --env-file "$ENV_FILE" exec -T api php artisan health:check

echo "OK — todos os checks passaram."
