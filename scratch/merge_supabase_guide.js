import fs from 'fs';

const mainGuide = fs.readFileSync('main_supabase.md', 'utf8');
const markdownSchemas = fs.readFileSync('scratch/markdown_schemas.md', 'utf8');

const mainLines = mainGuide.split('\n');

// Keep lines before section 2 (up to line 18, which is index 17 in 0-indexed array)
const header = mainLines.slice(0, 18).join('\n');

// Find where section 3 starts
const section3Index = mainLines.findIndex(line => line.startsWith('## 3. Storage Buckets & Policies'));
if (section3Index === -1) {
  throw new Error("Could not find Section 3 header!");
}

const footer = mainLines.slice(section3Index).join('\n');

const merged = `${header}\n\n## 2. Table Registry & Schemas\n\n${markdownSchemas}\n${footer}`;

fs.writeFileSync('main_supabase.md', merged, 'utf8');
console.log("SUCCESS: main_supabase.md merged successfully!");
