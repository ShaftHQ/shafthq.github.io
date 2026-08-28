import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';

const budgets = [
  {directory: 'build/assets/css', prefix: 'styles.', limit: 30 * 1024, label: 'site CSS'},
  {directory: 'build/assets/js', prefix: 'main.', limit: 180 * 1024, label: 'primary JavaScript'},
  {directory: 'build/assets/js', prefix: 'runtime~main.', limit: 15 * 1024, label: 'runtime JavaScript'},
];

for (const {directory, prefix, limit, label} of budgets) {
  const matches = fs.readdirSync(directory).filter(file => file.startsWith(prefix));
  if (matches.length !== 1) throw new Error(`Expected one ${label} asset, found ${matches.length}.`);
  const size = gzipSync(fs.readFileSync(path.join(directory, matches[0]))).byteLength;
  if (size > limit) throw new Error(`${label} is ${size} gzip bytes; budget is ${limit}.`);
  console.log(`${label}: ${size}/${limit} gzip bytes`);
}
