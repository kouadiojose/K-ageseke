# 🏦 Configuration CinetPay - Guide Complet

## 📋 Variables d'Environnement Requises

Pour que votre application K-AGESEKE fonctionne correctement sur Digital Ocean App Platform, vous devez configurer les variables CinetPay suivantes :

### Variables Obligatoires

```bash
# CinetPay Production
CINETPAY_API_KEY=69528412765f9bbf5cb3ac6.86470919
CINETPAY_SITE_ID=105897933
CINETPAY_ENVIRONMENT=production
```

---

## 🔑 Comment Obtenir vos Clés CinetPay

### 1. Créer un Compte CinetPay
1. Rendez-vous sur [cinetpay.com](https://cinetpay.com)
2. Créez un compte marchand
3. Vérifiez votre identité avec les documents requis

### 2. Configuration du Compte
1. **Tableau de bord** → **Paramètres API**
2. Notez votre `SITE_ID` (affiché dans le tableau de bord)
3. Générez votre `API_KEY` de production

### 3. Activation Production
- Complétez la vérification KYC (Know Your Customer)
- Activez votre compte pour la production
- Obtenez l'approbation pour les paiements en ligne

---

## ⚙️ Configuration dans Digital Ocean

### Dans App Settings → Environment Variables :

```bash
# CinetPay Configuration (OBLIGATOIRE)
CINETPAY_API_KEY=69528412765f9bbf5cb3ac6.86470919
CINETPAY_SITE_ID=105897933
CINETPAY_ENVIRONMENT=production
```

**Important** : Assurez-vous que `CINETPAY_ENVIRONMENT` est défini sur `production` pour éviter l'erreur de démarrage.

---

## 🌍 Pays Supportés par CinetPay

CinetPay prend en charge les paiements dans plusieurs pays africains :

### Pays Principaux
- **Côte d'Ivoire** - Orange Money, MTN Money, Moov Money
- **Burkina Faso** - Orange Money, MTN Money, Moov Money  
- **Bénin** - MTN Money, Moov Money
- **Sénégal** - Orange Money, Wave, Free Money
- **Mali** - Orange Money, MTN Money, Moov Money
- **Niger** - Orange Money, MTN Money, Moov Money
- **Cameroun** - Orange Money, MTN Money, EU Mobile
- **République Centrafricaine** - Orange Money, MTN Money

### Méthodes de Paiement
- **Mobile Money** - Orange Money, MTN Money, Moov Money, Wave
- **Cartes Bancaires** - Visa, Mastercard
- **Virements Bancaires** - Banques locales africaines

---

## 🔧 Test de Configuration

### Vérification des Variables

Votre script `app-platform-check.js` vérifiera automatiquement que toutes les variables CinetPay sont configurées :

```bash
node app-platform-check.js
```

### Test de Connectivité

Une fois déployé, vous pouvez tester la connectivité CinetPay via l'interface de votre application.

---

## 📞 Support CinetPay

### Documentation Officielle
- **Site Web** : [cinetpay.com](https://cinetpay.com)
- **Documentation API** : [docs.cinetpay.com](https://docs.cinetpay.com)
- **Support** : support@cinetpay.com

### Assistance Intégration
- Support technique disponible
- Documentation API complète
- Exemples de code fournis

---

## 🚨 Résolution d'Erreurs Communes

### "CinetPay configuration missing: API_KEY and SITE_ID are required"

**Cause** : Variables d'environnement CinetPay manquantes

**Solution** :
1. Vérifiez que `CINETPAY_API_KEY` et `CINETPAY_SITE_ID` sont définis dans Digital Ocean
2. Confirmez que les valeurs ne contiennent pas d'espaces ou caractères spéciaux
3. Redéployez l'application après ajout des variables

### Variables Mal Configurées

```bash
# ❌ Incorrect
CINETPAY_API_KEY=
CINETPAY_SITE_ID=

# ✅ Correct  
CINETPAY_API_KEY=votre_vraie_cle_api
CINETPAY_SITE_ID=123456
CINETPAY_ENVIRONMENT=production
```

### Erreurs de Production vs Sandbox

Assurez-vous que :
- Les clés API sont pour l'environnement correct (production)
- `CINETPAY_ENVIRONMENT=production` est défini
- Votre compte CinetPay est approuvé pour la production

---

## 💡 Recommandations

### Sécurité
- Ne jamais exposer vos clés API dans le code source
- Utilisez uniquement les variables d'environnement
- Régénérez les clés si elles sont compromises

### Monitoring
- Surveillez les transactions dans le tableau de bord CinetPay
- Configurez des webhooks pour les notifications de paiement
- Vérifiez régulièrement les logs de transactions

### Performance
- Les paiements CinetPay sont généralement instantanés
- Prévoyez un délai de 30 secondes maximum pour les confirmations
- Implémentez des mécanismes de retry pour les transactions

---

**Une fois configuré correctement, CinetPay permettra à vos utilisateurs africains de payer facilement via Mobile Money et cartes bancaires locales !**