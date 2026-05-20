#!/usr/bin/env bash
# Escala workers de fila horizontalmente
set -euo pipefail

REPLICAS="${1:-2}"
ENV_FILE="${2:-.env}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"
echo "Escalando queue para $REPLICAS réplicas..."
docker compose --env-file "$ENV_FILE" up -d --scale "queue=$REPLICAS" --no-recreate
docker compose --env-file "$ENV_FILE" ps queue
