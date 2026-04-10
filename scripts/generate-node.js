import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide a component or page name. Usage: npm run generate:node <Type> <Name>');
  console.error('   Example: npm run generate:node component SovereignCard');
  console.error('   Example: npm run generate:node page Dashboard');
  process.exit(1);
}

const type = args[0].toLowerCase();
const name = args[1];

if (!['component', 'page'].includes(type) || !name) {
  console.error('❌ Invalid arguments. Type must be "component" or "page", followed by the Name.');
  process.exit(1);
}

const isPage = type === 'page';
const targetDir = path.join(process.cwd(), 'src', isPage ? 'pages' : 'components', isPage ? '' : 'ui');
const componentDir = path.join(targetDir, name);

if (fs.existsSync(componentDir)) {
  console.error(`❌ ${type === 'page' ? 'Page' : 'Component'} ${name} already exists at ${componentDir}`);
  process.exit(1);
}

// 1. Create Directory
fs.mkdirSync(componentDir, { recursive: true });

// 2. Component/Page Template
const componentContent = `import React from 'react';
import { tracker } from '@/core/tracker';

interface ${name}Props {
  /** Optional standard styling */
  className?: string;
}

/**
 * ${name} ${isPage ? 'Page Node' : 'Component Node'}
 * Antigravity SSOT Component Generated via CLI
 */
export const ${name} = ({ className }: ${name}Props) => {
  // useEffect(() => { tracker.track('${isPage ? 'page_view' : 'component_mount'}', { node: '${name}' }); }, []);

  return (
    <div className={className}>
      <h1>${name}</h1>
    </div>
  );
};
`;

// 3. Test Template
const testContent = `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${name} } from './${name}';

describe('${name} ${isPage ? 'Page' : 'Component'}', () => {
  it('renders natively without crashing', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});
`;

// 4. Storybook Template
const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: '${isPage ? 'Pages' : 'UI'}/${name}',
  component: ${name},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
`;

// Write files
fs.writeFileSync(path.join(componentDir, `${name}.tsx`), componentContent);
fs.writeFileSync(path.join(componentDir, `${name}.test.tsx`), testContent);
fs.writeFileSync(path.join(componentDir, `${name}.stories.tsx`), storyContent);
fs.writeFileSync(path.join(componentDir, `index.ts`), `export * from './${name}';\n`);

console.log(`✅ Antigravity Node Built => ${isPage ? 'Pages' : 'UI'} > ${name}`);
console.log(`   📂 Path: ${componentDir}`);
console.log(`   📄 Created: ${name}.tsx, ${name}.test.tsx, ${name}.stories.tsx, index.ts`);
