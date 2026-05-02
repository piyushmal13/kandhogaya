#!/usr/bin/env node
/**
 * scripts/gen-sitemap.js
 *
 * Generates public/sitemap.xml from:
 *   1. Static routes (hardcoded)
 *   2. Dynamic webinar slugs fetched from Supabase
 *
 * Run: node scripts/gen-sitemap.js
 * Add to Vite prebuild: "prebuild": "node scripts/gen-sitemap.js"
 *
 * Env vars required (already in .env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← server-side only, never in VITE_*
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dir, '../.env') });

const BASE_URL  = 'https://ifxtrades.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const looksConfigured = (value) => {
  return Boolean(value) &&
    !/^(your-|placeholder|sk_live_\.{3}|sk_test_\.{3}|whsec_\.{3})/i.test(value) &&
    !value.includes('your-project');
};

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

// ─── Static Routes ────────────────────────────────────────────────────────────
const STATIC_URLS = [
  { loc: '/',            changefreq: 'daily',   priority: '1.0' },
  { loc: '/academy',     changefreq: 'weekly',  priority: '0.95' },
  { loc: '/webinars',    changefreq: 'daily',   priority: '0.95' },
  { loc: '/marketplace', changefreq: 'weekly',  priority: '0.9' },
  { loc: '/signals',     changefreq: 'hourly',  priority: '0.9' },
  { loc: '/results',     changefreq: 'weekly',  priority: '0.85' },
  { loc: '/blog',        changefreq: 'daily',   priority: '0.85' },
  { loc: '/travel',      changefreq: 'weekly',  priority: '0.75' },
  { loc: '/about',       changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact',     changefreq: 'monthly', priority: '0.7' },
  { loc: '/hiring',      changefreq: 'monthly', priority: '0.6' },
  { loc: '/privacy',     changefreq: 'yearly',  priority: '0.4' },
  { loc: '/terms',       changefreq: 'yearly',  priority: '0.4' },
  { loc: '/risk',        changefreq: 'yearly',  priority: '0.4' },
  { loc: '/cookies',     changefreq: 'yearly',  priority: '0.3' },
];

// ─── Dynamic Routes from Supabase ─────────────────────────────────────────────
async function fetchDynamicRoutes() {
  if (!looksConfigured(SUPABASE_URL) || !looksConfigured(SERVICE_KEY)) {
    console.warn('[sitemap] Supabase credentials missing — skipping dynamic routes.');
    return [];
  }

  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const routes = [];

  // Webinars
  const { data: webinars, error: wErr } = await sb
    .from('webinars')
    .select('id')
    .eq('status', 'published')
    .order('id', { ascending: false });

  if (wErr) {
    console.warn('[sitemap] Webinar fetch skipped:', wErr.message);
  } else {
    (webinars ?? []).forEach(w => {
      routes.push({
        loc:        `/webinars/${w.id}`,
        changefreq: 'weekly',
        priority:   '0.8'
      });
    });
  }

  return routes;
}

// ─── XML Builder ──────────────────────────────────────────────────────────────
function buildXml(urls) {
  const entries = urls.map(u => `
  <url>
    <loc>${escapeXml(BASE_URL + u.loc)}</loc>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>${u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}
</urlset>`;
}

// ─── Entry Point ──────────────────────────────────────────────────────────────
console.log('[sitemap] Generating…');
const dynamic = await fetchDynamicRoutes();
const all     = [...STATIC_URLS, ...dynamic];
const xml     = buildXml(all);
const outPath = resolve(__dir, '../public/sitemap.xml');

writeFileSync(outPath, xml, 'utf-8');
console.log(`[sitemap] ✔  Written ${all.length} URLs → public/sitemap.xml`);
