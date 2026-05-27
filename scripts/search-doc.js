import fs from 'fs';
import path from 'path';

const docPath = 'C:\\Users\\Piyush\\.gemini\\antigravity\\brain\\9a3dd4f0-b068-443c-81e3-05014a0b11eb\\institutional_audit_and_blueprints.md';

if (fs.existsSync(docPath)) {
  const content = fs.readFileSync(docPath, 'utf8');
  const lines = content.split('\n');
  const matches = [];
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('footer') || line.toLowerCase().includes('sitemap') || line.toLowerCase().includes('talent')) {
      matches.push({ index: idx + 1, content: line });
    }
  });
  console.log(`Found ${matches.length} matches in institutional_audit_and_blueprints.md:`);
  matches.forEach(m => console.log(`Line ${m.index}: ${m.content}`));
} else {
  console.log("Document does not exist");
}
