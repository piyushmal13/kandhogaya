import fs from 'fs';
import path from 'path';

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /agent
Disallow: /api/

Sitemap: https://ifxtrades.com/sitemap.xml
`;

function generateRobots() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(filePath, ROBOTS_TXT);
  console.log('✅ [SEO] robots.txt generated successfully.');
}

generateRobots();
