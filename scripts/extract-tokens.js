import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcRoot = path.resolve(__dirname, '..', 'src');
const tokenFile = path.resolve(__dirname, '..', 'src/config/designTokens.ts');

// 1. Load existing designTokens
let designTokens = { colors: {}, spacing: {}, fonts: {} };
if (fs.existsSync(tokenFile)) {
  const content = fs.readFileSync(tokenFile, 'utf8');
  const colorsMatch = content.match(/colors:\s*{([^}]+)}/);
  if (colorsMatch) {
    colorsMatch[1].split(',').forEach(line => {
      const parts = line.split(':');
      if (parts.length > 1) {
        const key = parts[0].trim();
        const val = parts[1].trim().replaceAll(/['"]/g, '');
        if (key && val) designTokens.colors[key] = val;
      }
    });
  }
}

// 2. Walk the src tree and collect raw hex codes
const hexRegex = /#([0-9a-fA-F]{3,6})/g;
const tokenMap = new Map(); // hex -> tokenName
Object.entries(designTokens.colors).forEach(([key, val]) => {
  tokenMap.set(val.toString().toUpperCase(), key);
});

let tokenIndex = Object.keys(designTokens.colors).length + 1;

function generateTokenName(hex) {
  const base = `color${tokenIndex}`;
  tokenIndex += 1;
  return base;
}

function processFileContent(filePath, content) {
  let newContent = content;
  const foundHexes = new Set();
  let match;
  
  // Reset regex index for safety
  hexRegex.lastIndex = 0;
  while ((match = hexRegex.exec(content)) !== null) {
    foundHexes.add(`#${match[1]}`);
  }

  for (const rawHex of foundHexes) {
    const upperHex = rawHex.toUpperCase();
    let tokenName = tokenMap.get(upperHex);
    if (!tokenName) {
      tokenName = generateTokenName(upperHex);
      tokenMap.set(upperHex, tokenName);
      designTokens.colors[tokenName] = upperHex;
    }
    
    // Replacement logic
    newContent = newContent.split(rawHex.toLowerCase()).join(`var(--${tokenName})`);
    newContent = newContent.split(upperHex).join(`var(--${tokenName})`);
  }
  return newContent;
}

function processFile(filePath) {
  if (filePath === tokenFile) return;
  if (!filePath.match(/\.(tsx|ts|css)$/)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = processFileContent(filePath, content);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.lstatSync(full).isDirectory()) {
      walk(full);
    } else {
      processFile(full);
    }
  }
}

walk(srcRoot);

// 3. Persist updated designTokens.ts
let newTokensContent = `export const designTokens = {\n  colors: {\n`;
for (const [key, val] of Object.entries(designTokens.colors)) {
  newTokensContent += `    ${key}: '${val}',\n`;
}
newTokensContent += `  },\n  fonts: {\n    heading: 'Outfit',\n    body: 'Inter',\n  },\n  spacing: {\n    '0': '0rem',\n    '1': '0.25rem',\n    '2': '0.5rem',\n    '3': '0.75rem',\n    '4': '1rem',\n  }\n};\n`;

fs.writeFileSync(tokenFile, newTokensContent, 'utf8');
console.log('✅ Design tokens extracted & files updated.');
