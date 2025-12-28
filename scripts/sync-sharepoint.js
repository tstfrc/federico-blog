import 'dotenv/config';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import fs from 'fs';
import path from 'path';

// Configurazione dalle variabili d'ambiente
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const siteId = process.env.SITE_ID;
const listId = process.env.LIST_ID;

// Debug: verifica che le variabili siano caricate
console.log('Configuration check:');
console.log('- TENANT_ID:', tenantId ? '✓' : '✗');
console.log('- CLIENT_ID:', clientId ? '✓' : '✗');
console.log('- CLIENT_SECRET:', clientSecret ? '✓' : '✗');
console.log('- SITE_ID:', siteId ? '✓' : '✗');
console.log('- LIST_ID:', listId ? '✓' : '✗');
console.log('');

async function syncArticles() {
  console.log('🔄 Start SharePoint sync...');

  try {
    // Autenticazione
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });

    const client = Client.initWithMiddleware({ authProvider });

    // Recupera gli articoli con IsPublished = "Publish"
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
      .expand('fields')
      .filter("fields/IsPublished eq 'Publish'")
      .get();

    console.log(`📝 Found ${response.value.length} published articles`);

    // Cartella dove salvare i post
    const postsDir = path.join(process.cwd(), 'src', 'content', 'post');
    
    // Crea la cartella se non esiste
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Converti ogni articolo in file markdown
    for (const item of response.value) {
      const fields = item.fields;
      
      // Gestisci coverImage dalla colonna Image di SharePoint
      let coverImageYaml = '';
      if (fields.CoverImage) {
        // Se CoverImage è una stringa JSON, parsala
        let imageUrl = '';
        try {
          if (typeof fields.CoverImage === 'string') {
            const imageData = JSON.parse(fields.CoverImage);
            imageUrl = imageData.serverUrl || imageData.serverRelativeUrl || '';
          } else if (fields.CoverImage.serverUrl) {
            imageUrl = fields.CoverImage.serverUrl;
          } else if (fields.CoverImage.serverRelativeUrl) {
            imageUrl = fields.CoverImage.serverRelativeUrl;
          }
        } catch (e) {
          // Se non è JSON, usalo direttamente come stringa
          imageUrl = fields.CoverImage;
        }
        
        if (imageUrl) {
          coverImageYaml = `coverImage:
  src: "${imageUrl}"
  alt: "${fields.Title}"`;
        }
      }
      
      const frontmatter = `---
title: "${fields.Title}"
description: "${fields.Excerpt || ''}"
publishDate: "${fields.PublishedDate || new Date().toISOString()}"
${coverImageYaml}
tags: ${JSON.stringify(fields.Tags || [])}
---

${fields.Content || ''}
`;

      const filename = `${fields.Slug}.md`;
      const filepath = path.join(postsDir, filename);
      
      fs.writeFileSync(filepath, frontmatter);
      console.log(`✅ Article created: ${filename}`);
    }

    console.log('✅ Sync completed!');
  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    throw error;
  }
}

syncArticles().catch(console.error);