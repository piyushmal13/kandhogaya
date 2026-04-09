#!/usr/bin/env node
/**
 * scripts/altCheck.js
 * Scans all .tsx / .jsx files in src/ for <img> tags that are missing an `alt` attribute.
 * Run: node scripts/altCheck.js
 * Add to CI: "alt-check": "node scripts/altCheck.js"
 */
import { readFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,jsx}');

let failures = 0;

files.forEach((file) => {
  const content = readFileSync(file, 'utf-8');
  const imgTags = [...content.matchAll(/<img[^>]*>/g)];

  imgTags.forEach(([imgTag]) => {
    if (!/\balt=/.test(imgTag)) {
      console.warn(`\x1b[33m⚠️  Missing alt in ${file}:\x1b[0m`);
      console.warn(`   ${imgTag.slice(0, 120)}`);
      failures++;
    }
  });
});

if (failures > 0) {
  console.error(`\n\x1b[31m✖ ${failures} image(s) missing alt attribute.\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✔  All images have alt attributes.\x1b[0m`);
}
