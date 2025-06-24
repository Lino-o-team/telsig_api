#!/bin/bash

# Script de déploiement pour O2switch
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Démarrage du déploiement..."

# Variables
PROJECT_NAME="telsig-mail-server"
PM2_APP_NAME="telsig-mail-server"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Le fichier package.json n'a pas été trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Sauvegarder les variables d'environnement
if [ -f ".env" ]; then
    log_info "Sauvegarde du fichier .env..."
    cp .env .env.backup
fi

# Récupérer les dernières modifications
log_info "Récupération des dernières modifications..."
git fetch origin
git reset --hard origin/main

# Restaurer les variables d'environnement
if [ -f ".env.backup" ]; then
    log_info "Restauration du fichier .env..."
    mv .env.backup .env
fi

# Installer les dépendances de production
log_info "Installation des dépendances de production..."
npm ci --only=production

# Construire le projet
log_info "Construction du projet..."
npm run build

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    log_warn "PM2 n'est pas installé. Installation..."
    npm install -g pm2
fi

# Redémarrer ou démarrer l'application avec PM2
log_info "Démarrage/redémarrage de l'application avec PM2..."
if pm2 list | grep -q "$PM2_APP_NAME"; then
    log_info "Redémarrage de l'application existante..."
    pm2 restart "$PM2_APP_NAME"
else
    log_info "Démarrage d'une nouvelle instance..."
    pm2 start ecosystem.config.js --env production
fi

# Sauvegarder la configuration PM2
log_info "Sauvegarde de la configuration PM2..."
pm2 save

# Afficher le statut
log_info "Statut de l'application :"
pm2 status

# Afficher les logs récents
log_info "Logs récents :"
pm2 logs "$PM2_APP_NAME" --lines 10

echo ""
log_info "✅ Déploiement terminé avec succès !"
log_info "L'application est accessible sur le port configuré dans votre fichier .env" 