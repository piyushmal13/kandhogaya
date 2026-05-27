import fs from 'fs';
import path from 'path';

const logPath = 'C:\\Users\\Piyush\\.gemini\\antigravity\\brain\\9a3dd4f0-b068-443c-81e3-05014a0b11eb\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  const userMessages = [];
  lines.forEach((line) => {
    if (!line.trim()) return;
    try {
      const obj = JSON.parse(line);
      if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
        const text = obj.content || '';
        if (text.toLowerCase().includes('footer') || text.toLowerCase().includes('talent')) {
          userMessages.push(obj);
        }
      }
    } catch (e) {}
  });
  
  console.log(`Found ${userMessages.length} user inputs matching "footer" or "talent":`);
  userMessages.forEach((msg, idx) => {
    console.log(`\n=== Match ${idx + 1} (Step ${msg.step_index}) ===`);
    console.log(msg.content);
  });
} else {
  console.log("Log path does not exist:", logPath);
}
