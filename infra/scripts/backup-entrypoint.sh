#!/bin/sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION="${BACKUP_RETENTION_DAYS:-14}"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"

mkdir -p "$BACKUP_DIR"

run_backup() {
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  FILE="$BACKUP_DIR/${PGDATABASE}_${TIMESTAMP}.sql.gz"
  echo "[backup] Gerando $FILE ..."
  pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE" | gzip > "$FILE"
  echo "[backup] Concluído: $(du -h "$FILE" | cut -f1)"
  find "$BACKUP_DIR" -name "*.sql.gz" -mtime +"$RETENTION" -delete 2>/dev/null || true
}

echo "[backup] Agendador iniciado (intervalo ${INTERVAL}s, retenção ${RETENTION} dias)"
run_backup
while true; do
  sleep "$INTERVAL"
  run_backup
done
