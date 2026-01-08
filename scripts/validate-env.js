#!/usr/bin/env node
/**
 * Validate that all required environment variables are configured
 * Run this before starting the development server or building
 */

const requiredEnvs = {
  TENANT_ID: 'Azure Tenant ID',
  CLIENT_ID: 'Azure Client ID',
  CLIENT_SECRET: 'Azure Client Secret',
  SITE_ID: 'SharePoint Site ID',
  LIST_ID: 'SharePoint List ID',
};

const optionalEnvs = {
  WEBMENTION_API_KEY: 'Webmention.io API Key (optional for webmentions)',
};

console.log('\n🔍 Verificando configurazione ambiente...\n');

let isValid = true;
const missing = [];
const configured = [];

// Check required variables
for (const [env, description] of Object.entries(requiredEnvs)) {
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

// Check optional variables
console.log('\n📋 Variabili opzionali:');
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
  console.error(`\n❌ ERRORE: ${missing.length} variabile/e d'ambiente mancante/e\n`);
  console.error('Per risolvere:');
  console.error('1. Copia .env.example a .env');
  console.error('2. Riempi i valori mancanti:');
  missing.forEach(env => {
    console.error(`   - ${env}`);
  });
  console.error('\n💡 Guida: leggi il file .env.example per sapere come trovare i valori\n');
  process.exit(1);
} else {
  console.log('\n✅ Tutte le variabili obbligatorie sono configurate!\n');
  console.log(`   Configurate: ${configured.length} variabili`);
  console.log('');
  console.log('🚀 Puoi procedere con npm start o npm run build\n');
  process.exit(0);
}
