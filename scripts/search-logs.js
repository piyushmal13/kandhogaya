import fs from 'fs';
import path from 'path';

const logPath = 'C:\\Users\\Piyush\\.gemini\\antigravity\\brain\\9a3dd4f0-b068-443c-81e3-05014a0b11eb\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  console.log(`Read ${lines.length} lines from transcript.`);
  
  const matches = [];
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('footer')) {
      matches.push({ index: idx, line: line.substring(0, 1000) });
    }
  });
  
  console.log(`Found ${matches.length} lines referencing "footer".`);
  // Print the last 15 matches to see what the user discussed recently about the footer
  const slice = matches.slice(-15);
  slice.forEach(m => {
    console.log(`\n--- Line ${m.index} ---`);
    console.log(m.line);
  });
} else {
  console.log("Log path does not exist:", logPath);
}
