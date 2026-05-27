import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Piyush\\.gemini\\antigravity\\brain\\9a3dd4f0-b068-443c-81e3-05014a0b11eb';

if (fs.existsSync(brainDir)) {
  const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.md'));
  console.log(`Found md files: ${files.join(', ')}`);
  
  files.forEach(file => {
    const fullPath = path.join(brainDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    let count = 0;
    
    lines.forEach((line, idx) => {
      const l = line.toLowerCase();
      if (l.includes('footer') || l.includes('sitemap') || l.includes('talent') || l.includes('recruit') || l.includes('hiring')) {
        count++;
        console.log(`[${file}] Line ${idx + 1}: ${line.trim()}`);
      }
    });
    console.log(`[${file}] Total matches: ${count}\n`);
  });
} else {
  console.log("Brain dir does not exist");
}
