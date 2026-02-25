import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import fs from 'fs';
import path from 'path';

// Configurazione dalle variabili d'ambiente
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const siteId = process.env.SITE_ID;
const listId = process.env.LIST_ID;

// Validazione ambiente
function validateEnvironment() {
  const requiredEnvs = ['TENANT_ID', 'CLIENT_ID', 'CLIENT_SECRET', 'SITE_ID', 'LIST_ID'];
  const missing = requiredEnvs.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error(`❌ Errore: variabili d'ambiente mancanti: ${missing.join(', ')}`);
    console.error('⚠️  Controlla il file .env.example per sapere cosa configurare');
    process.exit(1);
  }
}

async function syncArticles() {
  try {
    // Valida le credenziali prima di procedere
    validateEnvironment();
    console.log('✅ Credenziali verificate');
    console.log('🔄 Inizio sincronizzazione con SharePoint...');

  // Autenticazione
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
  });

  const client = Client.initWithMiddleware({ authProvider });

  // Recupera gli articoli pubblicati
  const response = await client
    .api(`/sites/${siteId}/lists/${listId}/items`)
    .expand('fields')
    .filter('fields/IsPublished eq true')
    .get();

  console.log(`📝 Trovati ${response.value.length} articoli pubblicati`);

  // Cartella dove salvare i post
  const postsDir = path.join(process.cwd(), 'src', 'content', 'post');
  
  // Crea la cartella se non esiste
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

    // Converti ogni articolo in file markdown
    for (const item of response.value) {
      const fields = item.fields;
      
      const frontmatter = `---
title: "${fields.Title}"
description: "${fields.Excerpt || ''}"
publishDate: "${fields.PublishedDate || new Date().toISOString()}"
tags: ${JSON.stringify(fields.Tags || [])}
---

${fields.Content || ''}
`;

      const filename = `${fields.Slug}.md`;
      const filepath = path.join(postsDir, filename);
      
      fs.writeFileSync(filepath, frontmatter);
      console.log(`✅ Creato/aggiornato: ${filename}`);
    }

    console.log('✨ Sincronizzazione completata!');
  } catch (error) {
    // Error handling che non espone le credenziali
    console.error('❌ Sincronizzazione fallita');
    
    if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
      console.error('⚠️  Errore di autenticazione - verifica le credenziali Azure');
    } else if (error.message?.includes('not found') || error.message?.includes('404')) {
      console.error('⚠️  Errore: SharePoint site/list non trovato - verifica SITE_ID e LIST_ID');
    } else {
      console.error(`⚠️  Errore: ${error.message}`);
    }
    
    process.exit(1);
  }
}

syncArticles();