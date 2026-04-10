import React from 'react';
import { renderToString } from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function render() {
  try {
     const componentRelativePath = process.argv[2];
     if (!componentRelativePath) {
        console.error("No component path provided.");
        process.exit(1);
     }
     
     const componentPath = path.resolve(process.cwd(), componentRelativePath);
     if (!fs.existsSync(componentPath)) {
        console.error(`File not found: ${componentPath}`);
        process.exit(1);
     }

     const module = await import(componentPath);
     const Component = module.default || module;
     
     // Note: Some complex components using context/providers may fail rendering to string directly.
     // This uses a minimal wrapper if needed.
     const html = renderToString(React.createElement(Component));
     console.log(html);
  } catch(e) {
     console.error(e);
     process.exit(1);
  }
}

render();
