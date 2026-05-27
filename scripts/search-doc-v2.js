import fs from 'fs';
import path from 'path';

const docPath = 'C:\\Users\\Piyush\\.gemini\\antigravity\\brain\\9a3dd4f0-b068-443c-81e3-05014a0b11eb\\institutional_audit_and_blueprints.md';

if (fs.existsSync(docPath)) {
  const content = fs.readFileSync(docPath, 'utf8');
  console.log("File read successfully, size:", content.length);
  const lines = content.split('\n');
  let count = 0;
  lines.forEach((line, idx) => {
    const l = line.toLowerCase();
    if (l.includes('footer') || l.includes('sitemap') || l.includes('talent') || l.includes('recruit')) {
      count++;
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
  console.log(`Total matches found: ${count}`);
} else {
  console.log("File does not exist at:", docPath);
}
