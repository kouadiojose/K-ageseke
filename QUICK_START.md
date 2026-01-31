# 🚀 Guide de Démarrage Rapide - Digital Ocean

## ⚡ Déploiement Express (5 minutes)

### Option 1: App Platform (Recommandé)

1. **Push vers GitHub**
```bash
git add .
git commit -m "Ready for Digital Ocean deployment"
git push origin main
```

2. **Créer l'App sur Digital Ocean**
- Connectez-vous à Digital Ocean
- Apps → Create App → GitHub → Sélectionnez k-ageseke-platform
- Utilisez la configuration automatique dans `.do/app.yaml`

3. **Variables d'environnement** (Settings → Environment Variables)
```bash
DATABASE_URL=postgresql://...  # Auto-généré par DO
SQUARE_ACCESS_TOKEN=sq0atp-...
SQUARE_APPLICATION_ID=sq0idp-...
SQUARE_LOCATION_ID=L...
SQUARE_ENVIRONMENT=production
VITE_SQUARE_APPLICATION_ID=sq0idp-...
VITE_SQUARE_LOCATION_ID=L...
SENDGRID_API_KEY=SG...
SESSION_SECRET=your_64_char_secret
```

4. **Déployer** → L'app sera disponible sur votre URL Digital Ocean

---

### Option 2: Droplet (Contrôle total)

1. **Créer un Droplet Ubuntu 22.04** (2GB RAM minimum)

2. **Configuration en 1 commande**
```bash
# Connexion SSH puis exécution
curl -sSL https://raw.githubusercontent.com/votre-username/k-ageseke-platform/main/deploy.sh | bash
```

3. **Configuration manuelle**
```bash
# Cloner et configurer
git clone https://github.com/votre-username/k-ageseke-platform.git
cd k-ageseke-platform
cp .env.example .env
nano .env  # Éditer les variables

# Déploiement Docker
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 Variables Critiques à Configurer

```bash
# Production Square (OBLIGATOIRE)
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=sq0atp-VOTRE_TOKEN_PRODUCTION
SQUARE_APPLICATION_ID=sq0idp-VOTRE_APP_ID
SQUARE_LOCATION_ID=LVOTRE_LOCATION_ID

# Base de données (Auto-configurée sur App Platform)
DATABASE_URL=postgresql://user:pass@host:port/db

# Email et sécurité
SENDGRID_API_KEY=SG.VOTRE_CLE_SENDGRID
SESSION_SECRET=un_secret_tres_long_et_securise_64_caracteres_minimum
```

---

## ✅ Vérification Post-Déploiement

1. **Health Check**: `https://votre-app.ondigitalocean.app/api/health`
2. **Application**: `https://votre-app.ondigitalocean.app`
3. **Mobile**: `https://votre-app.ondigitalocean.app/mobile.html`

---

## 📱 URLs de Production

Une fois déployé :
- **Web App**: `https://votre-app.ondigitalocean.app`
- **Mobile**: `https://votre-app.ondigitalocean.app/mobile.html`
- **Admin**: `https://votre-app.ondigitalocean.app/admin/login`
- **API**: `https://votre-app.ondigitalocean.app/api`

---

## 🆘 Problèmes Courants

### App ne démarre pas
```bash
# Vérifier les variables dans DO Console
# Logs disponibles dans App Platform → Runtime Logs
```

### Paiements échouent
```bash
# Vérifier SQUARE_ENVIRONMENT=production
# Vérifier tokens Square production (commencent par sq0atp-)
```

### Base de données inaccessible
```bash
# App Platform : base auto-configurée
# Droplet : vérifier DATABASE_URL dans .env
```

---

## 📞 Support

- Guide complet: `DEPLOYMENT_GUIDE.md`
- Architecture: `replit.md`
- Issues: GitHub Issues