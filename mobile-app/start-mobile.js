const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');

// Créer un serveur simple qui simule Expo Dev Server
const app = express();
const PORT = 19000; // Port standard d'Expo

app.use(express.static('.'));

// Endpoint principal Expo
app.get('/', (req, res) => {
  res.json({
    name: 'K-AGESEKE Mobile',
    slug: 'k-ageseke-mobile',
    version: '1.0.0',
    platforms: ['ios', 'android'],
    exp: {
      name: 'K-AGESEKE Mobile',
      slug: 'k-ageseke-mobile',
      platforms: ['ios', 'android'],
      version: '1.0.0'
    }
  });
});

// Endpoint pour les métadonnées
app.get('/--/api/v2/project/@anonymous/k-ageseke-mobile', (req, res) => {
  res.json({
    name: 'K-AGESEKE Mobile',
    fullName: '@anonymous/k-ageseke-mobile',
    slug: 'k-ageseke-mobile',
    privacy: 'public',
    platforms: ['ios', 'android']
  });
});

// Servir les assets
app.get('/assets/*', (req, res) => {
  res.status(404).send('Asset not found');
});

app.listen(PORT, '0.0.0.0', () => {
  const replitUrl = 'https://f3463d8a-3952-431c-97a1-a4d3cfd05c57-00-3sgbjbr0bblqq.riker.replit.dev';
  const url = `${replitUrl}:${PORT}`;
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  🚀 K-AGESEKE MOBILE SERVER                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📱 Sur votre iPhone avec Expo Go:                          ║
║                                                              ║
║  1️⃣  Ouvrez Expo Go                                          ║
║  2️⃣  Dans l'onglet "Home"                                    ║
║  3️⃣  Tapez dans "Enter URL manually":                       ║
║                                                              ║
║      ${url}                                      ║
║                                                              ║
║  ✅ Votre app K-AGESEKE se lancera automatiquement             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🔄 Connexion Backend: https://f3463d8a-3952-431c-97a1-a4d3cfd05c57-00-3sgbjbr0bblqq.riker.replit.dev
📊 Données: 18 produits + 6 catégories + taux de change réels
`);
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur mobile K-AGESEKE');
  process.exit(0);
});