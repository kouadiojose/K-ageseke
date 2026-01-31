# 🌊 Guide de Déploiement Digital Ocean - K-AGESEKE

Ce guide vous accompagne étape par étape pour déployer votre application K-AGESEKE sur Digital Ocean.

## 🎯 Méthodes de Déploiement

### Option 1: App Platform (Recommandé - Plus Simple)
### Option 2: Droplet avec Docker (Plus de Contrôle)

---

## 🚀 Option 1: Digital Ocean App Platform

### Étape 1: Préparation du Code

Votre code est déjà prêt avec tous les fichiers nécessaires :
- ✅ `Dockerfile` optimisé pour la production
- ✅ `docker-compose.yml` pour l'orchestration
- ✅ `.env.example` template
- ✅ Health check endpoint `/health`

### Étape 2: Créer une App sur Digital Ocean

1. **Connectez-vous à Digital Ocean**
2. **Allez dans "Apps" → "Create App"**
3. **Connectez votre GitHub** (poussez d'abord votre code sur GitHub)
4. **Sélectionnez votre dépôt** `k-ageseke-platform`
5. **Configurez l'application** :

```yaml
# Configuration App Platform
name: k-ageseke-platform
services:
- name: web
  source_dir: /
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 5000
  routes:
  - path: /
  health_check:
    http_path: /health
```

### Étape 3: Variables d'Environnement

Dans App Platform, allez dans Settings → Environment Variables :

```bash
# Base de données (utilisez Managed Database DO)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Square Configuration
SQUARE_ACCESS_TOKEN=your_production_token
SQUARE_APPLICATION_ID=your_app_id
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=production
VITE_SQUARE_APPLICATION_ID=your_app_id
VITE_SQUARE_LOCATION_ID=your_location_id

# Email
SENDGRID_API_KEY=your_sendgrid_key

# Session
SESSION_SECRET=your_very_secure_secret_64_chars_minimum

# Application
NODE_ENV=production
PORT=5000
```

### Étape 4: Base de Données Managed

1. **Créez une Managed Database PostgreSQL**
2. **Notez les informations de connexion**
3. **Ajoutez l'URL dans les variables d'environnement**
4. **Importez vos données** :

```bash
# Connectez-vous à votre base via le client psql
psql "postgresql://user:password@host:port/dbname" < database_export.sql
```

---

## 🐳 Option 2: Droplet avec Docker

### Étape 1: Créer un Droplet

1. **Créez un Droplet Ubuntu 22.04**
2. **Taille recommandée**: 2 GB RAM, 1 vCPU (ou plus selon vos besoins)
3. **Activez les backups automatiques**

### Étape 2: Configuration du Serveur

```bash
# Connexion SSH
ssh root@your_droplet_ip

# Mise à jour du système
apt update && apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installation de Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Installation de Git
apt install git -y

# Création d'un utilisateur pour l'application
adduser k-ageseke
usermod -aG docker k-ageseke
su - k-ageseke
```

### Étape 3: Déploiement de l'Application

```bash
# Cloner votre dépôt
git clone https://github.com/votre-username/k-ageseke-platform.git
cd k-ageseke-platform

# Copier et configurer les variables d'environnement
cp .env.example .env
nano .env  # Éditez avec vos vraies valeurs

# Variables critiques à configurer :
DATABASE_URL=postgresql://user:password@postgres:5432/k-ageseke
SQUARE_ACCESS_TOKEN=your_production_token
SQUARE_APPLICATION_ID=your_app_id
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=production
SENDGRID_API_KEY=your_sendgrid_key
SESSION_SECRET=your_secure_secret
```

### Étape 4: Lancement avec Docker

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh

# Ou manuellement :
docker-compose up -d
```

### Étape 5: Configuration Nginx et SSL

```bash
# Installation de Certbot pour SSL
sudo apt install certbot python3-certbot-nginx -y

# Générer certificat SSL (remplacez votre-domaine.com)
sudo certbot --nginx -d votre-domaine.com

# Le certificat sera automatiquement renouvelé
```

---

## 🔧 Configuration de Production

### Variables d'Environnement Critiques

```bash
# Production - NE JAMAIS utiliser les valeurs sandbox
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=your_PRODUCTION_access_token

# Base de données avec SSL
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Session sécurisée (64 caractères minimum)
SESSION_SECRET=your_extremely_secure_session_secret_64_characters_minimum

# Email production
SENDGRID_API_KEY=your_production_sendgrid_key
```

### Sécurité

```bash
# Firewall (si Droplet)
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable

# Désactiver l'accès root SSH
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh
```

---

## 📊 Monitoring et Maintenance

### Health Check

Votre application expose automatiquement un endpoint de monitoring :

```bash
# Vérifier l'état de l'application
curl https://votre-domaine.com/health

# Réponse attendue :
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "services": "operational",
  "version": "1.0.0",
  "environment": "production"
}
```

### Logs

```bash
# Voir les logs de l'application
docker-compose logs -f app

# Logs de la base de données
docker-compose logs -f postgres

# Logs Nginx
docker-compose logs -f nginx
```

### Sauvegarde

```bash
# Sauvegarde automatique de la base de données
docker-compose exec postgres pg_dump -U k-ageseke_user k-ageseke > backup_$(date +%Y%m%d_%H%M%S).sql

# Script de sauvegarde automatique (crontab)
0 2 * * * /home/k-ageseke/k-ageseke-platform/backup.sh
```

---

## 🔄 Mise à Jour de l'Application

### Déploiement Continu (App Platform)

App Platform redéploie automatiquement à chaque push sur la branche main.

### Mise à Jour Manuelle (Droplet)

```bash
# Se connecter au serveur
ssh k-ageseke@your_droplet_ip
cd k-ageseke-platform

# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redéployer
./deploy.sh

# Ou manuellement :
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎯 URLs et Accès

Après déploiement, votre application sera accessible :

### Application Web
- **Production**: `https://votre-domaine.com`
- **Version Mobile**: `https://votre-domaine.com/mobile.html`

### API Endpoints
- **Health Check**: `https://votre-domaine.com/health`
- **API Base**: `https://votre-domaine.com/api`

### Admin Panel
- **Admin Login**: `https://votre-domaine.com/admin/login`

---

## ⚠️ Points Importants

### ✅ Avant de Déployer

- [ ] Variables d'environnement configurées
- [ ] Certificats Square en mode production
- [ ] Base de données sauvegardée
- [ ] Tests fonctionnels effectués
- [ ] DNS configuré vers votre serveur

### 🔒 Sécurité

- **JAMAIS** commiter le fichier `.env`
- Utiliser des secrets forts (64+ caractères)
- Activer HTTPS obligatoire
- Mettre à jour régulièrement les dépendances

### 📱 Mobile

L'application mobile React Native doit être buildée séparément :

```bash
cd mobile-app
expo build:android  # Pour Android
expo build:ios      # Pour iOS
```

---

## 🆘 Dépannage

### Application ne démarre pas

```bash
# Vérifier les logs
docker-compose logs app

# Problèmes courants :
# 1. Variables d'environnement manquantes
# 2. Base de données inaccessible
# 3. Ports déjà utilisés
```

### Base de données inaccessible

```bash
# Tester la connexion
docker-compose exec app npm run db:push

# Vérifier les credentials dans .env
```

### Paiements Square en erreur

```bash
# Vérifier les variables Square
echo $SQUARE_ENVIRONMENT  # Doit être "production"
echo $SQUARE_ACCESS_TOKEN # Doit commencer par "sq0atp"
```

---

## 🎉 Succès !

Votre application K-AGESEKE est maintenant déployée en production sur Digital Ocean !

**Support**: Pour toute question, contactez l'équipe de développement.

---

**K-AGESEKE** - Connecter l'Afrique au monde, une transaction à la fois.