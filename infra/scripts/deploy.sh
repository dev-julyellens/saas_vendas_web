#!/usr/bin/env bash
# Deploy — staging | production
set -euo pipefail

ENVIRONMENT="${1:-staging}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

case "$ENVIRONMENT" in
  staging)
    ENV_FILE=".env.staging"
    COMPOSE="-f docker-compose.yml -f docker-compose.staging.yml"
    export API_BUILD_TARGET=production
    ;;
  production|prod)
    ENV_FILE=".env.production"
    COMPOSE="-f docker-compose.yml -f docker-compose.prod.yml"
    export API_BUILD_TARGET=production
    ;;
  *)
    echo "Uso: $0 [staging|production]"
    exit 1
    ;;
esac

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Arquivo $ENV_FILE não encontrado. Copie de .env.example"
  exit 1
fi

echo "==> Deploy $ENVIRONMENT"
docker compose --env-file "$ENV_FILE" $COMPOSE pull 2>/dev/null || true
docker compose --env-file "$ENV_FILE" $COMPOSE build --no-cache web api queue scheduler
docker compose --env-file "$ENV_FILE" $COMPOSE up -d --remove-orphans

docker compose --env-file "$ENV_FILE" exec -T api php artisan migrate --force --no-interaction
docker compose --env-file "$ENV_FILE" exec -T api php artisan config:cache
docker compose --env-file "$ENV_FILE" exec -T api php artisan route:cache
docker compose --env-file "$ENV_FILE" exec -T api php artisan view:cache 2>/dev/null || true

WORKERS="${QUEUE_WORKERS:-2}"
docker compose --env-file "$ENV_FILE" $COMPOSE up -d --scale "queue=$WORKERS"

echo "==> Verificando saúde..."
"$ROOT/scripts/healthcheck.sh" "$ENV_FILE"

echo "Deploy $ENVIRONMENT concluído."
