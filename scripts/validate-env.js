#!/usr/bin/env node
/**
 * Validate that all required environment variables are configured
 * Run this before starting the development server or building
 * 
 * Usage:
 *   node scripts/validate-env.js          (for dev/build - Azure credentials optional)
 *   node scripts/validate-env.js --sync   (for sync - Azure credentials required)
 */

const isSyncMode = process.argv.includes('--sync');

// Credenziali obbligatorie solo per il sync
const syncRequiredEnvs = {
  TENANT_ID: 'Azure Tenant ID',
  CLIENT_ID: 'Azure Client ID',
  CLIENT_SECRET: 'Azure Client Secret',
  SITE_ID: 'SharePoint Site ID',
  LIST_ID: 'SharePoint List ID',
};

// Credenziali opzionali per dev/build
const optionalEnvs = {
  WEBMENTION_API_KEY: 'Webmention.io API Key (optional for webmentions)',
};

console.log('\n🔍 Verificando configurazione ambiente...\n');

if (isSyncMode) {
  console.log('📡 Modalità: SYNC (tutte le credenziali Azure richieste)\n');
} else {
  console.log('🏗️  Modalità: BUILD/DEV (credenziali Azure opzionali)\n');
}

let isValid = true;
const missing = [];
const configured = [];

// Check sync-required variables (only in sync mode)
if (isSyncMode) {
  for (const [env, description] of Object.entries(syncRequiredEnvs)) {
    if (!process.env[env]) {
      console.error(`❌ Mancante: ${env}`);
      console.error(`   ${description}`);
      missing.push(env);
      isValid = false;
    } else {
      console.log(`✅ ${env} configurato`);
      configured.push(env);
    }
  }
} else {
  // In dev/build mode, Azure credentials are optional
  console.log('📋 Credenziali Azure (opzionali per dev/build):');
  for (const [env, description] of Object.entries(syncRequiredEnvs)) {
    if (process.env[env]) {
      console.log(`✅ ${env} configurato`);
      configured.push(env);
    } else {
      console.log(`⚠️  ${env} non configurato`);
      console.log(`   ${description}`);
    }
  }
  console.log('');
}

// Check optional variables
console.log('📋 Variabili opzionali:');
for (const [env, description] of Object.entries(optionalEnvs)) {
  if (process.env[env]) {
    console.log(`✅ ${env} configurato`);
  } else {
    console.log(`⚠️  ${env} non configurato`);
    console.log(`   ${description}`);
  }
}

console.log('\n' + '='.repeat(50));

if (!isValid) {
  console.error(`\n❌ ERRORE: ${missing.length} variabile/e d'ambiente mancante/e per il SYNC\n`);
  console.error('Per risolvere:');
  console.error('1. Copia .env.example a .env');
  console.error('2. Riempi i valori mancanti:');
  missing.forEach(env => {
    console.error(`   - ${env}`);
  });
  console.error('\n💡 Guida: leggi il file .env.example per sapere come trovare i valori\n');
  process.exit(1);
} else {
  if (isSyncMode) {
    console.log('\n✅ Tutte le variabili per il SYNC sono configurate!\n');
    console.log(`   Configurate: ${configured.length} variabili`);
    console.log('');
    console.log('🚀 Puoi procedere con pnpm sync\n');
  } else {
    console.log('\n✅ Configurazione verificata!\n');
    if (configured.length > 0) {
      console.log(`   Credenziali Azure configurate: ${configured.length}`);
      console.log('   Il sync con SharePoint sarà disponibile');
    } else {
      console.log('   ⚠️  Credenziali Azure non configurate');
      console.log('   Il sync con SharePoint non sarà disponibile');
      console.log('   Il blog funzionerà comunque regolarmente');
    }
    console.log('');
    console.log('🚀 Puoi procedere con npm start o npm run build\n');
  }
  process.exit(0);
}
