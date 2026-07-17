import {readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDirectory = path.join(root, 'build');
const excludedPrefixes = ['/docs/archive/', '/docs/superpowers/'];

const files = (await readdir(buildDirectory))
  .filter((name) => name.startsWith('search-index-docs-') && name.endsWith('.json'));

if (files.length === 0) {
  throw new Error('No generated documentation search index was found.');
}

let removed = 0;

for (const name of files) {
  const file = path.join(buildDirectory, name);
  const payload = JSON.parse(await readFile(file, 'utf8'));
  const excludedIds = new Set(
    payload.documents
      .filter((document) =>
        excludedPrefixes.some((prefix) => document.sectionRoute.startsWith(prefix)),
      )
      .map((document) => String(document.id)),
  );

  removed += excludedIds.size;
  payload.documents = payload.documents.filter(
    (document) => !excludedIds.has(String(document.id)),
  );
  payload.index.fieldVectors = payload.index.fieldVectors.filter((entry) => {
    const reference = String(entry[0]).split('/').at(-1);
    return !excludedIds.has(reference);
  });

  for (const [, posting] of payload.index.invertedIndex) {
    for (const field of payload.index.fields) {
      if (!posting[field]) continue;
      for (const id of excludedIds) {
        delete posting[field][id];
      }
    }
  }

  const leakedRoute = payload.documents.find((document) =>
    excludedPrefixes.some((prefix) => document.sectionRoute.startsWith(prefix)),
  );
  if (leakedRoute) {
    throw new Error(`Excluded route remains in search: ${leakedRoute.sectionRoute}`);
  }

  await writeFile(file, JSON.stringify(payload));
}

console.log(`Removed ${removed} archive and superpowers sections from local search.`);
