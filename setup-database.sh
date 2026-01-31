#!/bin/bash

# Script de configuration de la base de données pour K-AGESEKE
# Usage: ./setup-database.sh [production|development]

set -e

ENVIRONMENT=${1:-development}

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[DB-SETUP]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Configuration de la base de données K-AGESEKE - Environnement: $ENVIRONMENT"

# Charger les variables d'environnement
if [ -f .env ]; then
    source .env
    log_info "Variables d'environnement chargées depuis .env"
else
    log_warn "Fichier .env non trouvé, utilisation des variables par défaut"
fi

# Configuration par défaut pour le développement
DB_HOST=${PGHOST:-localhost}
DB_PORT=${PGPORT:-5432}
DB_NAME=${PGDATABASE:-k-ageseke}
DB_USER=${PGUSER:-k-ageseke_user}
DB_PASSWORD=${PGPASSWORD:-}

if [ -z "$DB_PASSWORD" ]; then
    log_error "PGPASSWORD doit être défini dans .env"
    exit 1
fi

# Fonction pour tester la connexion à la base de données
test_connection() {
    local max_attempts=30
    local attempt=1
    
    log_info "Test de connexion à la base de données..."
    
    while [ $attempt -le $max_attempts ]; do
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" >/dev/null 2>&1; then
            log_info "✅ Connexion à la base de données réussie"
            return 0
        fi
        
        log_warn "Tentative $attempt/$max_attempts - Attente de la base de données..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "❌ Impossible de se connecter à la base de données après $max_attempts tentatives"
    return 1
}

# Fonction pour exécuter les migrations Drizzle
run_migrations() {
    log_info "Exécution des migrations Drizzle..."
    
    if npm run db:push; then
        log_info "✅ Migrations Drizzle appliquées avec succès"
    else
        log_error "❌ Échec des migrations Drizzle"
        return 1
    fi
}

# Fonction pour importer les données de base
import_base_data() {
    log_info "Import des données de base..."
    
    if [ -f "database_export.sql" ]; then
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database_export.sql; then
            log_info "✅ Données de base importées avec succès"
        else
            log_warn "⚠️ Problème lors de l'import des données (peut être normal si déjà importées)"
        fi
    else
        log_warn "⚠️ Fichier database_export.sql non trouvé, saut de l'import des données"
    fi
}

# Fonction pour configurer les index et optimisations
setup_optimizations() {
    log_info "Configuration des optimisations de base de données..."
    
    if [ -f "db-init/02-create-tables.sql" ]; then
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db-init/02-create-tables.sql; then
            log_info "✅ Optimisations appliquées avec succès"
        else
            log_warn "⚠️ Problème lors de l'application des optimisations"
        fi
    fi
    
    # Configuration spécifique à la production
    if [ "$ENVIRONMENT" = "production" ] && [ -f "db-init/03-production-config.sql" ]; then
        log_info "Application de la configuration de production..."
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db-init/03-production-config.sql || true
    fi
}

# Fonction pour vérifier l'état de la base de données
check_database_status() {
    log_info "Vérification de l'état de la base de données..."
    
    # Compter les tables principales
    local tables_count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | tr -d ' ')
    
    if [ "$tables_count" -gt 0 ]; then
        log_info "📊 Nombre de tables trouvées: $tables_count"
        
        # Vérifier quelques tables critiques
        local critical_tables=("users" "transfers" "orders" "products" "categories")
        for table in "${critical_tables[@]}"; do
            local count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ' || echo "0")
            log_info "  - $table: $count enregistrements"
        done
    else
        log_warn "⚠️ Aucune table trouvée dans la base de données"
    fi
}

# Exécution principale
main() {
    log_info "🚀 Démarrage de la configuration de la base de données"
    
    # Test de connexion
    if ! test_connection; then
        exit 1
    fi
    
    # Exécution des migrations
    if ! run_migrations; then
        log_error "Échec des migrations, arrêt du script"
        exit 1
    fi
    
    # Import des données de base
    import_base_data
    
    # Configuration des optimisations
    setup_optimizations
    
    # Vérification finale
    check_database_status
    
    log_info "✅ Configuration de la base de données terminée avec succès!"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "🔒 Base de données configurée pour la production"
        log_info "📋 N'oubliez pas de:"
        echo "  - Configurer les sauvegardes automatiques"
        echo "  - Surveiller les performances"
        echo "  - Mettre à jour les certificats SSL si nécessaire"
    fi
}

# Vérification des prérequis
if ! command -v psql >/dev/null 2>&1; then
    log_error "psql (client PostgreSQL) n'est pas installé"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    log_error "npm n'est pas installé"
    exit 1
fi

# Exécution
main