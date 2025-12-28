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

async function syncArticles() {
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
coverImage: "${fields.CoverImage || ''}"
---

${fields.Content || ''}
`;

    const filename = `${fields.Slug}.md`;
    const filepath = path.join(postsDir, filename);
    
    fs.writeFileSync(filepath, frontmatter);
    console.log(`✅ Creato/aggiornato: ${filename}`);
  }

  console.log('✨ Sincronizzazione completata!');
}

syncArticles().catch(console.error);