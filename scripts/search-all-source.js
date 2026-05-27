import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchDir(full);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.toLowerCase().includes('talent') || content.toLowerCase().includes('recruit')) {
        console.log(`[File Match] ${full}`);
      }
    }
  });
}

searchDir('C:\\Users\\Piyush\\.gemini\\antigravity\\scratch\\kandhogaya\\src');
