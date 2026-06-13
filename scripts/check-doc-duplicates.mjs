import {readFileSync, readdirSync, statSync} from 'fs';
import {extname, join, relative} from 'path';
import {fileURLToPath} from 'url';

const root = fileURLToPath(new URL('../docs/', import.meta.url));
const canonicalDirectories = new Set(['start', 'testing', 'agentic', 'features', 'integrations']);
const blocks = new Map();

function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      visit(fullPath);
      continue;
    }
    if (!['.md', '.mdx'].includes(extname(entry))) continue;

    const relativePath = relative(root, fullPath).replaceAll('\\', '/');
    if (!canonicalDirectories.has(relativePath.split('/')[0])) continue;

    const content = readFileSync(fullPath, 'utf8')
      .replace(/^---[\s\S]*?---\s*/u, '')
      .replace(/^import .*$/gmu, '');

    for (const rawBlock of content.split(/\n\s*\n/u)) {
      const normalized = rawBlock.replace(/\s+/gu, ' ').trim().toLowerCase();
      if (normalized.length < 700) continue;
      const paths = blocks.get(normalized) ?? [];
      paths.push(relativePath);
      blocks.set(normalized, paths);
    }
  }
}

visit(root);
const duplicates = [...blocks.values()].filter((paths) => new Set(paths).size > 1);
if (duplicates.length) {
  console.error('Duplicated long-form documentation blocks found:');
  for (const paths of duplicates) console.error(`- ${[...new Set(paths)].join(', ')}`);
  process.exit(1);
}

console.log('No duplicated long-form canonical documentation blocks found.');
