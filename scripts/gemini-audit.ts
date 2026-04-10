import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { generate } from '../src/lib/gemini';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Helpers ----------
function loadPrompt(name: string) {
  return readFileSync(path.join(__dirname, '..', 'prompt-library', `${name}.txt`), 'utf8');
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// ---------- 1️⃣ Component Inventory ----------
async function auditComponents() {
  console.log("Analyzing UI Components...");
  const allFiles = execSync('git ls-files "src/**/*.tsx"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  const system = loadPrompt('component_inventory');
  const results: any[] = [];

  // each chunk = ~200 files (well under token limit)
  for (const chunk of chunkArray(allFiles, 200)) {
    const user = `File list:\n${chunk.join('\n')}`;
    const out = await generate<any>(system, user);
    if (out.components) {
        results.push(...out.components);
    }
  }

  mkdirSync('audit-output', { recursive: true });
  writeFileSync('audit-output/component-inventory.json', JSON.stringify({ components: results }, null, 2));
}

// ---------- 2️⃣ Site‑Map ----------
async function auditSiteMap() {
  console.log("Generating Visual Site Map...");
  const appSourcePath = path.join(__dirname, '../src/App.tsx');
  if(!existsSync(appSourcePath)) return;
  const appSource = readFileSync(appSourcePath, 'utf8');
  const system = loadPrompt('site_map');

  const user = `Routes (excerpt from src/App.tsx):\n${appSource}`;
  const out = await generate<{ mermaid: string }>(system, user);
  if(out.mermaid) {
    writeFileSync('audit-output/site-map.mmd', out.mermaid);
  }
}

// ---------- 3️⃣ Brand Tokens ----------
async function auditBrand() {
  console.log("Extracting Design Tokens...");
  const twPath = path.join(__dirname, '../tailwind.css'); 
  let tailwind = '';
  if (existsSync(twPath)) tailwind = readFileSync(twPath, 'utf8');
  
  const cssVarsPath = path.join(__dirname, '../src/index.css');
  let cssVars = '';
  if(existsSync(cssVarsPath)) cssVars = readFileSync(cssVarsPath, 'utf8');
  
  const system = loadPrompt('brand_tokens');

  const user = `Tailwind config/css:\n${tailwind}\n\nCSS vars:\n${cssVars}`;
  const out = await generate<any>(system, user);
  writeFileSync('audit-output/brand-tokens.json', JSON.stringify(out, null, 2));
}

// ---------- 4️⃣ Accessibility ----------
async function auditAccessibility() {
  console.log("Auditing Component Accessibility (WCAG)...");
  // Render each top‑level page to static HTML (no network)
  const pages = [
    { route: '/', component: 'src/pages/Home.tsx' },
    { route: '/webinars', component: 'src/pages/Webinars.tsx' },
    // public pages that exist
  ];

  const system = loadPrompt('accessibility_audit');
  const allIssues: any[] = [];

  for (const p of pages) {
    const componentPath = path.join(__dirname, '..', p.component);
    if(!existsSync(componentPath)) continue;
    try {
      const html = execSync(`node --experimental-specifier-resolution=node ./scripts/render-page.js ${p.component}`, { encoding: 'utf8', env: {...process.env, NODE_ENV: 'development'} });
      const out = await generate<{ issues: any[] }>(system, `HTML for ${p.route}:\n${html}`);
      if(out.issues) {
        allIssues.push({ page: p.route, issues: out.issues });
      }
    } catch(e) {
      console.warn(`Could not render ${p.component} for accessibility check.`);
    }
  }

  writeFileSync('audit-output/accessibility.json', JSON.stringify(allIssues, null, 2));
}

// ---------- 5️⃣ Supabase ERD ----------
async function auditERD() {
  console.log("Modeling Application Database (Supabase)...");
  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  let ddl = '';
  if(existsSync(schemaPath)) {
      ddl = readFileSync(schemaPath, 'utf8');
  } else {
    try {
      // attempt pg_dump if schema file missing
      ddl = execSync('pg_dump --schema-only --no-owner --no-acl -U postgres -h localhost your_db', { encoding: 'utf8' });
    } catch(e) {
      console.warn("Could not execute pg_dump and schema.sql not found.");
      return;
    }
  }

  const system = loadPrompt('erd');
  const out = await generate<{ mermaid: string }>(system, `DDL:\n${ddl}`);
  if(out.mermaid) {
     writeFileSync('audit-output/supabase-erd.mmd', out.mermaid);
  }
}

// ---------- MAIN ----------
(async () => {
  console.log('🔎 Starting Gemini 3.1 Pro Super-Auditor pipeline...');
  try {
    await auditComponents();
    await auditSiteMap();
    await auditBrand();
    await auditAccessibility();
    await auditERD();
    console.log('✅ Audit completed – see ./audit-output/');
  } catch(e) {
    console.error("Pipeline failure:", e);
  }
})();
