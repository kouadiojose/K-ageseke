#!/usr/bin/env node

/**
 * Script d'initialisation automatique de la base de données K-Ageseke
 * S'exécute au démarrage et vérifie si la migration est nécessaire
 */

import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log('⚠️  DATABASE_URL non définie, skip de l\'initialisation DB');
  process.exit(0);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAndInitialize() {
  try {
    console.log('🔍 Vérification de la base de données...');
    await client.connect();

    // Vérifier si les tables existent déjà
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    const tablesExist = result.rows[0].exists;

    if (tablesExist) {
      // Vérifier s'il y a des données
      const countResult = await client.query('SELECT COUNT(*) as count FROM users');
      const userCount = parseInt(countResult.rows[0].count);

      if (userCount > 0) {
        console.log('✅ Base de données déjà initialisée avec', userCount, 'utilisateur(s)');
        console.log('⏭️  Skip de la migration');
        await client.end();
        process.exit(0);
      }
    }

    console.log('📦 Base de données vide, lancement de la migration...');
    await client.end();

    // Exécuter le script de migration
    const { spawn } = await import('child_process');
    const migrate = spawn('node', ['migrate.js'], {
      stdio: 'inherit',
      env: process.env
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Migration terminée avec succès!');
      } else {
        console.error('❌ Erreur lors de la migration, code:', code);
      }
      process.exit(code);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);

    // Si la table n'existe pas, lancer la migration
    if (error.message.includes('does not exist') || error.message.includes('relation')) {
      console.log('📦 Tables non trouvées, lancement de la migration...');
      await client.end();

      const { spawn } = await import('child_process');
      const migrate = spawn('node', ['migrate.js'], {
        stdio: 'inherit',
        env: process.env
      });

      migrate.on('close', (code) => {
        process.exit(code);
      });
    } else {
      await client.end();
      process.exit(1);
    }
  }
}

checkAndInitialize();
