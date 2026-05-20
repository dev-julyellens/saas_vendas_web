#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${1:-.env}"
COMPOSE_FILES="-f docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  cp .env.example "$ENV_FILE"
  echo "Criado $ENV_FILE — ajuste APP_KEY, JWT_SECRET e senhas."
fi

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

echo "==> Parando containers antigos do projeto (se existirem)..."
docker compose --env-file "$ENV_FILE" $COMPOSE_FILES down --remove-orphans 2>/dev/null || true

echo "==> Subindo stack Docker..."
docker compose --env-file "$ENV_FILE" $COMPOSE_FILES up -d --build

echo "==> Aguardando API..."
sleep 10

echo "==> Ajustando permissoes de storage..."
docker compose --env-file "$ENV_FILE" exec -u root -T api /usr/local/bin/docker-entrypoint.sh true 2>/dev/null || true

docker compose --env-file "$ENV_FILE" exec -T api sh -c "
  git config --global --add safe.directory /var/www/html 2>/dev/null || true
  composer install --no-interaction
  php artisan key:generate --force --no-interaction
  php artisan jwt:secret --force --no-interaction 2>/dev/null || true
  php artisan migrate --force --seed --no-interaction
  php artisan config:clear
"

echo "==> Healthcheck..."
"$ROOT/scripts/healthcheck.sh" || true

echo ""
echo "Stack pronto:"
echo "  App:  http://localhost:${HTTP_PORT:-8080}"
echo "  API:  http://localhost:${HTTP_PORT:-8080}/api/v1"
echo "  Health: http://localhost:${HTTP_PORT:-8080}/health"
