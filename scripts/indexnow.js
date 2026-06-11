import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dir, '../public');

const HOST = 'ifxtrades.com';

// ─── 1. Generate & Write Verification Key ───────────────────────────────────
function getOrGenerateKey() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Look for existing key file
  const files = fs.readdirSync(PUBLIC_DIR);
  const existingKeyFile = files.find(f => f.startsWith('indexnow-') && f.endsWith('.txt'));

  if (existingKeyFile) {
    const key = existingKeyFile.replace('indexnow-', '').replace('.txt', '');
    return key;
  }

  // Generate a fresh random key (hex string)
  const key = crypto.randomBytes(16).toString('hex');
  const keyFileName = `indexnow-${key}.txt`;
  const keyFilePath = path.join(PUBLIC_DIR, keyFileName);

  // Write key value into key file
  fs.writeFileSync(keyFilePath, key, 'utf-8');
  console.log(`✅ [SEO] IndexNow key file generated: public/${keyFileName}`);
  
  return key;
}

const key = getOrGenerateKey();

// ─── 2. Parse Sitemap URLs ──────────────────────────────────────────────────
const sitemapPath = path.resolve(__dir, '../public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ [SEO] sitemap.xml not found! Please run "npm run sitemap" first.');
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

console.log(`[SEO] Loaded ${urls.length} URLs for IndexNow submission.`);

// ─── 3. Submit URL List to IndexNow ──────────────────────────────────────────
async function submitToIndexNow() {
  const payload = {
    host: HOST,
    key: key,
    keyLocation: `https://${HOST}/indexnow-${key}.txt`,
    urlList: urls
  };

  try {
    console.log(`[SEO] Pinging IndexNow API (Bing/Yandex/Yahoo) for ${urls.length} URLs...`);
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('🎉 [SEO] IndexNow submission successful! Search engines notified for crawling.');
    } else {
      const errText = await response.text();
      console.error(`❌ [SEO] IndexNow submission failed: ${response.status} ${errText}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ [SEO] IndexNow network connection failed:', err.message);
    process.exit(1);
  }
}

submitToIndexNow();
