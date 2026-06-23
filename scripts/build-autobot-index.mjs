import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDocumentationIndex} from '../netlify/functions/docs-loader.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'static', 'autobot-index.json');
const index = buildDocumentationIndex();

await mkdir(path.dirname(outputPath), {recursive: true});
await writeFile(outputPath, JSON.stringify(index), 'utf8');

console.log(`Wrote ${index.length} AutoBot retrieval chunks to static/autobot-index.json.`);
