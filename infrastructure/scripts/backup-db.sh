#!/bin/bash
# Daily PostgreSQL backup script
# Add to crontab: 0 2 * * * /path/to/backup-db.sh

set -euo pipefail

BACKUP_DIR="/opt/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETAIN_DAYS=14

mkdir -p "$BACKUP_DIR"

# Dump the database from the Docker container
docker compose -f /opt/adc/docker-compose.yml exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-strapi}" -d "${POSTGRES_DB:-strapi}" \
  --format=custom --compress=9 \
  > "$BACKUP_DIR/strapi_${TIMESTAMP}.dump"

echo "Backup created: strapi_${TIMESTAMP}.dump"

# Remove backups older than RETAIN_DAYS
find "$BACKUP_DIR" -name "strapi_*.dump" -mtime +"$RETAIN_DAYS" -delete

echo "Old backups cleaned up (retained last $RETAIN_DAYS days)"
