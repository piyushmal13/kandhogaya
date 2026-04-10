import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '..', 'src');
const tokenFile = path.resolve(__dirname, '..', 'src/config/designTokens.ts');

const allowedTokens = new Set();
const tokenContent = fs.readFileSync(tokenFile, 'utf8');
const tokenMatch = tokenContent.match(/colors:\s*{([^}]+)}/);

if (tokenMatch) {
  const colorsBlock = tokenMatch[1];
  colorsBlock.split(',').forEach(line => {
    const parts = line.split(':');
    if (parts.length > 1) {
      const hex = parts[1].trim();
      if (hex) allowedTokens.add(hex.replaceAll(/['"]/g, '').toLowerCase());
    }
  });
}

const hexRegex = /#([0-9a-fA-F]{3,6})/g;
let hasError = false;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.lstatSync(full).isDirectory()) return walk(full);
    // Ignore designTokens itself to prevent false positives
    if (!full.match(/\.(tsx|css|scss)$/) || full.endsWith('designTokens.ts')) return;

    const content = fs.readFileSync(full, 'utf8');
    let match;
    while ((match = hexRegex.exec(content)) !== null) {
      const hex = `#${match[1]}`.toLowerCase();
      // Relaxed check: we want to ban exact hardcodes unless they're from tokens, 
      // but in the actual codebase, there are a lot of custom grays. 
      // For this script, we'll just flag them but not exit(1) aggressively right away.
      if (!allowedTokens.has(hex)) {
        console.error(`🚨 Raw non-token colour ${hex} found in ${full.replace(srcDir, 'src')}`);
        hasError = true;
        // Comment out process.exitCode = 1 to let it run gracefully first
        // process.exitCode = 1;
      }
    }
  });
}

walk(srcDir);
if (hasError) {
   console.error('❌ Token linter aborted: Non-compliant hardcoded hex strings found.');
   process.exit(1);
} else {
   console.log('✅ Token linter passed. No disallowed raw colours.');
}
