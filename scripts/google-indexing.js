import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const KEY_PATH = path.resolve(__dir, '../google-service-account.json');

// Check if credentials JSON exists
if (!fs.existsSync(KEY_PATH)) {
  console.log(`
==============================================================================
⚠️  [SEO] Google Indexing API Credentials Missing!
==============================================================================

To enable automated, real-time Google indexing for IFX Trades, follow these steps:

1. Create a Google Cloud Project:
   - Go to Google Cloud Console (https://console.cloud.google.com).
   - Create a new project or select an existing one.

2. Enable the Indexing API:
   - Go to APIs & Services > Library.
   - Search for "Web Search Indexing API" and click "Enable".

3. Create a Service Account:
   - Go to IAM & Admin > Service Accounts.
   - Click "Create Service Account", enter a name, and click "Create".
   - Select role: Project > Owner (or keep it standard).
   - In the Service Accounts list, click on the newly created account.
   - Go to the "Keys" tab, click "Add Key" > "Create New Key".
   - Select "JSON" and download the file.

4. Add the Key to this Repository:
   - Rename the downloaded JSON file to: "google-service-account.json".
   - Place it in the root folder of this workspace:
     ${path.resolve(__dir, '..')}

5. Link with Google Search Console (Crucial!):
   - Open Google Search Console (https://search.google.com/search-console).
   - Select your property: https://ifxtrades.com.
   - Go to Settings > Users and permissions.
   - Click "Add User".
   - Enter the service account email (found in your downloaded JSON as "client_email").
   - Set Permission to "Owner" (Owner permission is required for Indexing API submissions).

Once these steps are completed, run:
  npm run indexing:ping

==============================================================================
`);
  process.exit(0);
}

// ─── Read Sitemap URLs ────────────────────────────────────────────────────────
const sitemapPath = path.resolve(__dir, '../public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ [SEO] public/sitemap.xml not found! Please run "npm run sitemap" first.');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const urlRegex = /<loc>(https:\/\/ifxtrades\.com[^<]+)<\/loc>/g;
const urls = [];
let match;
while ((match = urlRegex.exec(sitemapContent)) !== null) {
  urls.push(match[1]);
}

if (urls.length === 0) {
  console.warn('⚠️ [SEO] No URLs found in sitemap.xml.');
  process.exit(0);
}

console.log(`[SEO] Loaded ${urls.length} URLs from sitemap.xml for indexing.`);

// ─── OAuth2 Authentication ───────────────────────────────────────────────────
async function getAccessToken(credentials) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat,
  };

  const base64UrlEncode = (obj) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;

  // Sign using Node's crypto
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(credentials.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  // Exchange JWT for Access Token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    throw new Error(`OAuth token exchange failed: ${tokenResponse.status} ${errText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// ─── Submit URL to Google Indexing API ───────────────────────────────────────
async function notifyUrl(url, accessToken) {
  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      url: url,
      type: 'URL_UPDATED',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return { success: false, status: response.status, error: errText };
  }

  const data = await response.json();
  return { success: true, data };
}

// ─── Main Execution ──────────────────────────────────────────────────────────
async function main() {
  try {
    const credentials = JSON.parse(fs.readFileSync(KEY_PATH, 'utf-8'));
    console.log('[SEO] Authenticating with Google OAuth2 server...');
    const token = await getAccessToken(credentials);
    console.log('✅ [SEO] Access token acquired.');

    console.log(`[SEO] Notifying Google Indexing API for ${urls.length} URLs...`);
    
    const maxUrls = Math.min(urls.length, 150); // Keep well within the 200/day daily quota limit
    let successCount = 0;
    
    for (let i = 0; i < maxUrls; i++) {
      const url = urls[i];
      const result = await notifyUrl(url, token);
      if (result.success) {
        console.log(`  [${i + 1}/${maxUrls}] Indexed: ${url}`);
        successCount++;
      } else {
        console.error(`  [${i + 1}/${maxUrls}] Failed: ${url} (${result.status})`);
      }
      // Brief sleep to avoid hitting rate limits
      await new Promise(r => setTimeout(r, 100));
    }
    
    console.log(`\n🎉 [SEO] Finished. Successfully queued ${successCount}/${maxUrls} URLs for real-time indexing.`);
  } catch (err) {
    console.error('❌ [SEO] Google indexing execution failed:', err.message);
    process.exit(1);
  }
}

main();
