#!/usr/bin/env node

// Script de vérification pour Digital Ocean App Platform
// Vérifie que tout est prêt pour le déploiement

import fs from 'fs';
import path from 'path';

console.log('🔍 [CHECK] Vérification de la configuration App Platform...\n');

// Vérifications des fichiers requis
const requiredFiles = [
  '.do/app.yaml',
  'package.json',
  'start-prod.js',
  'server/index.ts',
  'database_export.sql'
];

console.log('📁 Fichiers requis :');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    allFilesExist = false;
  }
});

// Vérification du package.json
console.log('\n📦 Dépendances critiques :');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const criticalDeps = [
    'express',
    'drizzle-orm',
    '@neondatabase/serverless',
    'bcrypt',
    'jsonwebtoken'
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep}`);
    } else {
      console.log(`  ❌ ${dep} - MANQUANT`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('  ❌ Impossible de lire package.json');
  allFilesExist = false;
}

// Vérification de la configuration App Platform
console.log('\n⚙️ Configuration App Platform :');
try {
  const appYaml = fs.readFileSync('.do/app.yaml', 'utf8');
  
  if (appYaml.includes('k-ageseke-platform')) {
    console.log('  ✅ Nom d\'application configuré');
  } else {
    console.log('  ⚠️ Nom d\'application à vérifier');
  }
  
  if (appYaml.includes('node start-prod.js')) {
    console.log('  ✅ Commande de démarrage configurée');
  } else {
    console.log('  ❌ Commande de démarrage manquante');
  }
  
  if (appYaml.includes('PG')) {
    console.log('  ✅ Base de données PostgreSQL configurée');
  } else {
    console.log('  ❌ Base de données non configurée');
  }
  
  if (appYaml.includes('/api/health')) {
    console.log('  ✅ Health check configuré');
  } else {
    console.log('  ❌ Health check manquant');
  }
  
} catch (error) {
  console.log('  ❌ Impossible de lire .do/app.yaml');
  allFilesExist = false;
}

// Variables d'environnement à configurer
console.log('\n🔐 Variables d\'environnement à configurer dans Digital Ocean :');
const envVars = [
  'SQUARE_ACCESS_TOKEN (sq0atp-...)',
  'SQUARE_APPLICATION_ID (sq0idp-...)', 
  'SQUARE_LOCATION_ID (L...)',
  'SQUARE_ENVIRONMENT=production',
  'VITE_SQUARE_APPLICATION_ID',
  'VITE_SQUARE_LOCATION_ID',
  'SENDGRID_API_KEY (SG....)',
  'CINETPAY_API_KEY',
  'CINETPAY_SITE_ID', 
  'CINETPAY_ENVIRONMENT=production',
  'SESSION_SECRET (64+ caractères)'
];

envVars.forEach(envVar => {
  console.log(`  📝 ${envVar}`);
});

console.log('\n  ℹ️ DATABASE_URL sera automatiquement générée par Digital Ocean');

// Checklist finale
console.log('\n📋 Checklist finale :');
const checklist = [
  'Code poussé sur GitHub',
  'Repository public ou accès DO configuré',
  'Tokens Square en mode PRODUCTION',
  'Variables d\'environnement préparées',
  'Tests locaux réussis'
];

checklist.forEach(item => {
  console.log(`  🔲 ${item}`);
});

// Résultat final
console.log('\n🎯 RÉSULTAT :');
if (allFilesExist) {
  console.log('✅ Configuration prête pour Digital Ocean App Platform !');
  console.log('\n🚀 Prochaines étapes :');
  console.log('  1. git push origin main');
  console.log('  2. Digital Ocean → App Platform → Create App');
  console.log('  3. Configurer les variables d\'environnement');
  console.log('  4. Déployer !');
} else {
  console.log('❌ Configuration incomplète - Vérifiez les erreurs ci-dessus');
  process.exit(1);
}

console.log('\n📚 Guides disponibles :');
console.log('  - DO_APP_PLATFORM_GUIDE.md (Guide complet)');
console.log('  - APP_PLATFORM_QUICK_START.md (Démarrage rapide)');
console.log('  - DATABASE_SETUP.md (Configuration base de données)');