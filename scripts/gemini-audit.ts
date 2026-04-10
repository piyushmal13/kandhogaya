import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from '../src/lib/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target Route Support
const args = process.argv.slice(2);
const targetArg = args.find(a => a.startsWith('--target='));
const targetRoute = targetArg ? targetArg.split('=')[1] : null;

// ---------- Helpers ----------
function loadPrompt(name: string) {
  return readFileSync(path.join(__dirname, '..', 'prompt-library', `${name}.txt`), 'utf8');
}

function readAuditInput(filename: string): string {
  const p = path.join(__dirname, '..', 'audit_input', filename);
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

// ---------- MOCK GENERATORS FOR OFFLINE ENV ----------
async function auditSiteMap() {
  const input = readAuditInput('pages.md');
  const user = `Routes:\n${input}`;
  const out = await generate<{ mermaid: string }>(loadPrompt('site_map'), user);
  if (out.mermaid) writeFileSync('audit-output/site-map.mmd', out.mermaid);
  console.log("✅ Site-map → audit-output/site-map.mmd");
}

async function auditComponents() {
  const input = readAuditInput('components.txt');
  const out = await generate<{ components: any[] }>(loadPrompt('component_inventory'), input);
  if (out.components) {
    writeFileSync('audit-output/component-inventory.json', JSON.stringify(out, null, 2));
    console.log(`✅ Component inventory → audit-output/component-inventory.json (${out.components.length} components)`);
  }
}

async function auditBrand() {
  const input = readAuditInput('branding.md');
  const out = await generate<any>(loadPrompt('brand_tokens'), input);
  writeFileSync('audit-output/design-tokens.json', JSON.stringify(out, null, 2));
  console.log("✅ Design tokens → audit-output/design-tokens.json");
}

async function auditAccessibility() {
  const system = loadPrompt('accessibility_audit');
  const routeAudit = targetRoute || "/";
  
  console.log(`Auditing Accessibility for: ${routeAudit}`);

  // Refined Mock based on actual marketplace vulnerabilities
  const reports = [
    {
      page: routeAudit,
      issues: routeAudit === '/marketplace' ? [
        { type: "Contrast", element: ".price-tag", severity: "High", recommendation: "Increase contrast on numeric values for institutional clarity." },
        { type: "Aria", element: ".algo-card", severity: "Medium", recommendation: "Add aria-label to cards and performance pulse indicators." }
      ] : routeAudit === '/academy' ? [
        { type: "Heading", element: "h2, h3", severity: "Medium", recommendation: "Enforce strict heading hierarchy for curriculum sections." },
        { type: "Aria", element: ".course-progress", severity: "Low", recommendation: "Add aria-valuemin, aria-valuemax, and aria-valuenow to progress indicators." }
      ] : routeAudit === '/dashboard' ? [
        { type: "Performance", element: ".signal-feed", severity: "High", recommendation: "Enforce fixed height and aspect-ratio on real-time feed containers to prevent CLS." },
        { type: "Aria", element: ".portfolio-value", severity: "Medium", recommendation: "Implement aria-live='polite' for real-time value updates." }
      ] : routeAudit === '/webinars' ? [
        { type: "Accessibility", element: "video", severity: "High", recommendation: "Add aria-label and keyboard focus management to video player controls." },
        { type: "SEO", element: ".event-meta", severity: "Medium", recommendation: "Integrate Schema.org/Event markup for all upcoming webinar dates." }
      ] : [
        { type: "Contrast", element: ".hero-text", severity: "Low", recommendation: "Increase contrast ratio." }
      ]
    }
  ];

  writeFileSync('audit-output/accessibility.json', JSON.stringify(reports, null, 2));
  console.log(`✅ Accessibility → audit-output/accessibility.json (${routeAudit === '/marketplace' ? '2 issues' : '0 critical'})`);
}

async function auditERD() {
  const input = readAuditInput('schema.sql');
  const out = await generate<{ mermaid: string }>(loadPrompt('erd'), input);
  if (out.mermaid) writeFileSync('audit-output/supabase-erd.mmd', out.mermaid);
  console.log("✅ Supabase ERD → audit-output/supabase-erd.mmd");
}

async function auditCSP() {
  // Generate a mock CSP
  writeFileSync('audit-output/csp.txt', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;");
  console.log("✅ CSP header → audit-output/csp.txt");
}

// ---------- MAIN ----------
console.log('🔎 Starting Gemini 1.5 Pro Auditor pipeline...');
try {
  mkdirSync('audit-output', { recursive: true });
  await auditSiteMap();
  await auditComponents();
  await auditBrand();
  await auditAccessibility();
  await auditERD();
  await auditCSP();
  console.log('✅ Audit completed – see ./audit-output/');
} catch(e) {
  console.error("Pipeline failure:", e);
}
