import fs from 'fs';
import path from 'path';
import j from 'jscodeshift';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_ROOT = path.resolve(__dirname, '..', 'src');

function transformFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  let root;
  try {
    root = j(src, { parser: 'tsx' });
  } catch (e) {
    return; // Parse error, skip
  }

  const hasButton = root.find(j.JSXElement, {
    openingElement: { name: { name: 'button' } },
  }).size() > 0;

  if (!hasButton) return;

  let modified = false;

  root
    .find(j.JSXElement, { openingElement: { name: { name: 'button' } } })
    .forEach(nodePath => {
      const opening = nodePath.node.openingElement;
      const attrs = opening.attributes?.reduce((acc, a) => {
        if (a.type !== 'JSXAttribute') return acc;
        const name = a.name.name;
        if (['onClick', 'disabled', 'className', 'type', 'aria-label', 'aria-describedby'].includes(name)) {
          acc[name] = a;
        }
        return acc;
      }, {}) || {};

      const newAttrs = [
        j.jsxAttribute(j.jsxIdentifier('variant'), j.literal('primary')),
        attrs.onClick && attrs.onClick,
        attrs.disabled && attrs.disabled,
        attrs.className && j.jsxAttribute(j.jsxIdentifier('className'), attrs.className.value),
        attrs['aria-label'] && attrs['aria-label'],
        attrs['aria-describedby'] && attrs['aria-describedby'],
        j.jsxAttribute(
          j.jsxIdentifier('trackingEvent'),
          j.literal(`cta_${path.basename(filePath, '.tsx').toLowerCase()}`)
        ),
      ].filter(Boolean);

      const newEl = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('SovereignButton'), newAttrs, false),
        null,
        nodePath.node.children,
        false
      );

      j(nodePath).replaceWith(newEl);
      modified = true;
    });

  if (modified) {
    const hasImport = root.find(j.ImportDeclaration, {
      source: { value: '@/components/ui/Button' },
    }).size() > 0;
    
    if (!hasImport) {
      const importDecl = j.importDeclaration(
        [j.importSpecifier(j.identifier('Button'), j.identifier('SovereignButton'))],
        j.literal('@/components/ui/Button')
      );
      const program = root.find(j.Program).get();
      if (program.node.body) {
        program.node.body.unshift(importDecl);
      }
    }

    const output = root.toSource({ quote: 'single' });
    fs.writeFileSync(filePath, output, 'utf8');
    console.log(`Updated CTAs in: ${filePath}`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.lstatSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.tsx') && !full.includes('Button.tsx')) transformFile(full);
  });
}

walk(SRC_ROOT);
console.log('✅ CTA migration completed');
