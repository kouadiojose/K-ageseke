#!/bin/bash

# Script de sauvegarde automatique pour K-AGESEKE
# Usage: ./backup.sh

set -e

# Configuration
BACKUP_DIR="/home/k-ageseke/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="k-ageseke_backup_${DATE}.sql"
APP_BACKUP_FILE="k-ageseke_app_backup_${DATE}.tar.gz"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Créer le dossier de sauvegarde
mkdir -p "$BACKUP_DIR"

log_info "Démarrage de la sauvegarde K-AGESEKE - $DATE"

# Sauvegarde de la base de données
log_info "Sauvegarde de la base de données..."
if docker-compose exec -T postgres pg_dump -U k-ageseke_user k-ageseke > "$BACKUP_DIR/$DB_BACKUP_FILE"; then
    log_info "✅ Base de données sauvegardée: $DB_BACKUP_FILE"
else
    log_error "❌ Échec de la sauvegarde de la base de données"
    exit 1
fi

# Sauvegarde des fichiers uploadés
log_info "Sauvegarde des fichiers uploadés..."
if tar -czf "$BACKUP_DIR/uploads_backup_${DATE}.tar.gz" uploads/ 2>/dev/null; then
    log_info "✅ Fichiers uploadés sauvegardés"
else
    log_warn "⚠️ Aucun fichier uploadé à sauvegarder"
fi

# Sauvegarde de la configuration
log_info "Sauvegarde de la configuration..."
tar -czf "$BACKUP_DIR/$APP_BACKUP_FILE" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=uploads \
    --exclude=dist \
    --exclude=.env \
    . 2>/dev/null

if [ $? -eq 0 ]; then
    log_info "✅ Configuration sauvegardée: $APP_BACKUP_FILE"
else
    log_error "❌ Échec de la sauvegarde de la configuration"
fi

# Nettoyage des anciennes sauvegardes (garder 7 jours)
log_info "Nettoyage des anciennes sauvegardes..."
find "$BACKUP_DIR" -name "k-ageseke_*" -type f -mtime +7 -delete 2>/dev/null || true

# Statistiques
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/k-ageseke_backup_*.sql 2>/dev/null | wc -l)

log_info "📊 Statistiques de sauvegarde:"
echo "  - Taille totale: $BACKUP_SIZE"
echo "  - Nombre de sauvegardes: $BACKUP_COUNT"
echo "  - Dernière sauvegarde: $DB_BACKUP_FILE"

log_info "✅ Sauvegarde terminée avec succès !"

# Envoyer une notification par email si configuré
if [ ! -z "$BACKUP_NOTIFICATION_EMAIL" ]; then
    echo "Sauvegarde K-AGESEKE terminée - $DATE" | mail -s "Backup Success" "$BACKUP_NOTIFICATION_EMAIL" 2>/dev/null || true
fi