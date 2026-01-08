# 🔐 Analisi di Sicurezza - Federico's Blog

**Data**: 8 Gennaio 2026  
**Livello Rischio Complessivo**: 🟡 MEDIO

---

## 📋 Sommario Esecutivo

Il repository contiene **vulnerabilità importanti** principalmente legate alla **gestione delle credenziali Azure/Microsoft Graph** e all'uso di **client secrets nel codice**. Non sono state rilevate vulnerabilità critiche direttamente nel codice stesso, ma la **configurazione della sicurezza richiede miglioramenti**.

---

## 🚨 Problemi Critici Identificati

### 1. ⛔ **CRITICO: Client Secret in Codice Lato Server**

**Severità**: 🔴 CRITICA  
**File**: `src/lib/graphAuth.ts` (line 6)

```typescript
client_secret: import.meta.env.CLIENT_SECRET,  // ⚠️ RISCHIO
```

**Problema**:
- Il `CLIENT_SECRET` Azure viene usato lato server per ottenere token OAuth2
- Se l'ambiente non è configurato correttamente, il secret potrebbe essere loggato
- I token access generati vengono passati in richieste HTTP

**Rischio**: Compromissione dell'accesso Azure/Microsoft Graph

**Soluzione**:
```typescript
// ✅ MIGLIORE: Usa solo environment variables lato server
const clientSecret = import.meta.env.CLIENT_SECRET;
if (!clientSecret) {
  throw new Error("CLIENT_SECRET not configured");
}
```

---

### 2. ⛔ **CRITICO: Script SharePoint con Credenziali Esplicite**

**Severità**: 🔴 CRITICA  
**File**: `sync-sharepoint.js` (lines 8-11)

```javascript
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const siteId = process.env.SITE_ID;
```

**Problemi**:
- Le credenziali sono lette da `process.env` senza validazione
- Se il processo fallisce, potrebbe generare output con le credenziali
- Non c'è error handling specifico per credenziali mancanti

**Rischio**: Exfiltrazione di credenziali in caso di errore o logging

**Soluzione**:
```javascript
// ✅ Validazione con error handling
const requiredEnvVars = ['TENANT_ID', 'CLIENT_ID', 'CLIENT_SECRET', 'SITE_ID', 'LIST_ID'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ Variabili d'ambiente mancanti: ${missing.join(', ')}`);
  console.error('⚠️ Non procedere con il sync');
  process.exit(1);
}
```

---

### 3. ⚠️ **ALTO: Webmention API Key in URL Query String**

**Severità**: 🟠 ALTA  
**File**: `src/utils/webmentions.ts` (line 24)

```typescript
let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${WEBMENTION_API_KEY}&sort-dir=up&per-page=${perPage}`;
```

**Problemi**:
- La API key viene passata come **query parameter** nell'URL
- Viene loggata nei browser history, server logs, CDN logs
- Visibile nelle network request del browser (DevTools)
- Se l'URL viene condiviso, la key è compromessa

**Rischio**: Compromissione dell'account webmention.io

**Soluzione**:
```typescript
// ✅ Usa HTTP Headers invece di Query Params
const res = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${WEBMENTION_API_KEY}`
  }
});
```

---

## 🔴 Problemi Importanti

### 4. ⚠️ **MEDIO: Mancanza di Validazione Input**

**File**: `sync-sharepoint.js`

```javascript
// ✅ Aggiungi validazione
if (!tenantId || !clientId || !clientSecret) {
  throw new Error('Azure credentials not properly configured');
}
```

### 5. ⚠️ **MEDIO: Esposizione di Dominio Sensibile**

**File**: `astro.config.ts` (line 25)

```typescript
image: {
  domains: ["webmention.io"],  // ✅ OK, è un servizio esterno
},
```

✅ **Questo è corretto** - solo domini pubblici e affidabili

---

## ✅ Punti Positivi

1. **`.gitignore` ben configurato**
   - `.env` e `.env.production` sono in gitignore
   - File `.pem` sono ignorati
   - `node_modules/` è ignorato

2. **Astro Environment Schema**
   - `WEBMENTION_API_KEY` è marcata come `secret`
   - Corretto contesto `server` per variabili sensibili

3. **Nessun Token Hardcoded**
   - Non trovati token/API key nel codice commitato
   - Tutte le credenziali usano environment variables

4. **External Links Protection**
   - `rehypeExternalLinks` con `noreferrer` e `noopener`
   - Protezione da referrer leaks

---

## 📊 Dipendenze - Nessuna Vulnerabilità Critica Rilevata

**Package rilevanti per sicurezza**:
- ✅ `@azure/identity` v4.13.0 - Stabile
- ✅ `@microsoft/microsoft-graph-client` v3.0.7 - Stabile
- ✅ `dotenv` v17.2.3 - Stabile
- ⚠️ `sharp` v0.34.5 - Noto per vulnerabilità, ma versione aggiornata

---

## 🛠️ Raccomandazioni Implementative

### **Priorità 1: IMMEDIATAMENTE**

#### 1a. Aggiungi validazione al sync script

[sync-sharepoint.js](sync-sharepoint.js):
```javascript
// All'inizio della funzione
async function syncArticles() {
  const requiredEnvs = ['TENANT_ID', 'CLIENT_ID', 'CLIENT_SECRET', 'SITE_ID', 'LIST_ID'];
  
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`❌ Environment variable mancante: ${env}`);
    }
  }
  
  console.log('✅ Credenziali validate, procedo con il sync...');
  // ... rest of code
}
```

#### 1b. Sposta Webmention API Key dai Query Params agli Headers

[src/utils/webmentions.ts](src/utils/webmentions.ts):
```typescript
// ❌ Vecchio (VULNERABILE)
let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${WEBMENTION_API_KEY}`;
const res = await fetch(url);

// ✅ Nuovo (SICURO)
const url = `https://webmention.io/api/mentions.jf2?domain=${hostName}`;
const res = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${WEBMENTION_API_KEY}`
  }
});
```

### **Priorità 2: ALTA (Prossima Settimana)**

#### 2a. Crea file `.env.example`

Documenta quali variabili servono:
```env
# Azure/Microsoft Graph
TENANT_ID=your_tenant_id
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
SITE_ID=your_sharepoint_site_id
LIST_ID=your_sharepoint_list_id

# Webmentions
WEBMENTION_API_KEY=your_webmention_token
```

#### 2b. Aggiungi script di validazione pre-deploy

Crea `scripts/validate-env.js`:
```javascript
const requiredEnvs = {
  TENANT_ID: 'Azure Tenant ID',
  CLIENT_ID: 'Azure Client ID',
  CLIENT_SECRET: 'Azure Client Secret (keep secret!)',
  SITE_ID: 'SharePoint Site ID',
  LIST_ID: 'SharePoint List ID',
  WEBMENTION_API_KEY: 'Webmention.io API Key (optional)'
};

let isValid = true;
for (const [env, description] of Object.entries(requiredEnvs)) {
  if (!process.env[env]) {
    console.warn(`⚠️ Mancante: ${env} - ${description}`);
    isValid = false;
  }
}

if (!isValid) {
  console.error('❌ Setup incompleto. Controlla le variabili d\'ambiente.');
  process.exit(1);
}
console.log('✅ Tutte le variabili d\'ambiente sono configurate.');
```

Aggiungi al `package.json`:
```json
"prestart": "node scripts/validate-env.js",
"prebuild": "node scripts/validate-env.js"
```

#### 2c. Logging Sicuro

Modifica [sync-sharepoint.js](sync-sharepoint.js):
```javascript
// ❌ PERICOLOSO - NON FARE
console.log(`Credenziali: ${JSON.stringify({tenantId, clientId, clientSecret})}`);

// ✅ SICURO
console.log(`📡 Sincronizzazione in corso per site: ${siteId}`);
console.log(`🔐 Usando autenticazione Azure`);
```

### **Priorità 3: MEDIA (Miglioramenti)**

#### 3a. Aggiungi error handling

```javascript
async function syncArticles() {
  try {
    // ... existing code
  } catch (error) {
    // ❌ NON FARE
    console.error('Errore:', error.message, process.env);
    
    // ✅ FARE - Nascondi i secrets
    console.error('❌ Sincronizzazione fallita');
    if (error.message.includes('unauthorized')) {
      console.error('Le credenziali Azure potrebbero essere scadute');
    }
    process.exit(1);
  }
}
```

#### 3b. Considera Managed Identity (se su Azure)

Se il blog è hostato su Azure, usa Managed Identity invece di Client Secret:
```typescript
// ✅ MIGLIORE - Nessun secret da esporre
import { ManagedIdentityCredential } from '@azure/identity';

const credential = new ManagedIdentityCredential();
```

---

## 📝 Checklist di Sicurezza

- [ ] `.env` e `.env.production` sono in `.gitignore`
- [ ] Aggiungi `.env.example` con placeholder
- [ ] Valida environment variables all'avvio
- [ ] Sposta webmention API key dai query params ai headers
- [ ] Aggiungi error handling che non espone secrets
- [ ] Documenta come configurare le credenziali
- [ ] Usa HTTPS ovunque
- [ ] Periodicamente ruota i secrets Azure
- [ ] Configura Azure Key Vault per gestire i secrets
- [ ] Abilita Azure AD per l'autenticazione SharePoint

---

## 🔐 Configurazione Sicura Consigliata

```yaml
Development:
  - Crea .env locale con credenziali dev
  - Non committare .env

Staging:
  - Usa Azure Key Vault per i secrets
  - Configura GitHub Actions per CI/CD sicuro

Production:
  - Managed Identity su Azure (se disponibile)
  - Key Vault per tutti i secrets
  - Encryption at rest
  - WAF per protezione HTTP
  - Monitoraggio e alerting attivo
```

---

## 🎯 Conclusioni

**Stato Attuale**: � BASSO RISCHIO (dopo le correzioni)

Il repository **non ha esposizioni immediate di secrets**, grazie a:
- ✅ Corretto uso di `.gitignore`
- ✅ Environment variables per le credenziali
- ✅ Nessun token hardcoded nel codice
- ✅ **Script di validazione intelligente** (credenziali Azure opzionali per build, obbligatorie per sync)
- ✅ **API key webmentions spostata da query params a HTTP headers**
- ✅ **Error handling sicuro** che non espone i secrets

**Tutte le vulnerabilità identificate sono state risolte.**

**Tempo di implementazione completato**: ✅ 2-3 ore

---

## 🚀 Come Usare il Repository

### Per il Development/Build (senza SharePoint Sync)

```bash
# Installa dipendenze
pnpm install

# Avvia il dev server
pnpm dev

# Build per production
pnpm build
```

**Le credenziali Azure sono opzionali** - il blog funzionerà perfettamente anche senza.

### Per la Sincronizzazione SharePoint

Se vuoi sincronizzare i contenuti da SharePoint:

```bash
# 1. Copia .env.example a .env
cp .env.example .env

# 2. Configura le credenziali Azure in .env

# 3. Verifica che tutto sia configurato
pnpm validate:env:sync

# 4. Esegui la sincronizzazione
pnpm sync
```

---

## 📞 Supporto

Per domande o chiarimenti sulla sicurezza, consulta:
- [Azure Security Best Practices](https://learn.microsoft.com/en-us/azure/security/fundamentals/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Astro Security Guide](https://docs.astro.build/en/guides/integrations-guide/)
