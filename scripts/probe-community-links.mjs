#!/usr/bin/env node
// Probes landing community-reported-use hrefs. Soft-warn on timeout; fail on 4xx/5xx/TLS.
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const TIMEOUT_MS = 12_000;
const src = await readFile(fileURLToPath(new URL('../src/pages/index.tsx', import.meta.url)), 'utf8');
const block = src.match(/const reportedUse = \[([\s\S]*?)\];/)?.[1];
if (!block) {
  console.error('reportedUse array not found');
  process.exit(2);
}
const hrefs = [...block.matchAll(/'https?:\/\/[^']+'/g)].map((m) => m[0].slice(1, -1));
const soft = [];
const hard = [];
for (const href of hrefs) {
  try {
    const response = await fetch(href, {
      method: 'GET',
      redirect: 'follow',
      headers: {'User-Agent': 'shafthq.github.io-community-probe'},
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status >= 400) hard.push(`${href} -> HTTP ${response.status}`);
    else console.log(`OK ${response.status} ${href}`);
  } catch (error) {
    const message = String(error.message || error);
    if (/timeout|aborted|TimeoutError/i.test(message)) soft.push(`${href} -> timeout (${message})`);
    else hard.push(`${href} -> ${message}`);
  }
}
for (const row of soft) console.warn(`WARN ${row}`);
if (hard.length) {
  for (const row of hard) console.error(`FAIL ${row}`);
  process.exit(1);
}
console.log(`community-links: ${hrefs.length} probed, ${soft.length} soft-warn, 0 hard-fail`);
