#!/usr/bin/env node
// Full-site accessibility scan: axe-core (WCAG 2.2 A/AA tags) on every page in
// build/sitemap.xml, in the light and dark themes, plus a 320px page-level
// horizontal-overflow sweep (WCAG 1.4.10).
//
// Usage: node scripts/a11y-sitewide.mjs --base http://127.0.0.1:3000 [--build build]
//          [--out a11y-report.json] [--markdown a11y-report.md]
// Exit code: 0 when clean, 1 when any violation or overflow is found, 2 on setup error.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from '@playwright/test';
import AxeBuilderModule from '@axe-core/playwright';

const AxeBuilder = AxeBuilderModule.default ?? AxeBuilderModule;
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
    return pairs;
  }, []),
);
const base = (args.base ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const buildDir = args.build ?? 'build';
const outFile = args.out ?? 'a11y-report.json';
const markdownFile = args.markdown;
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];
// Third-party widgets excluded from the scan. Keep this list short and justified.
// Mermaid renders SVG diagrams whose internal markup the site does not control.
const excluded = ['.docusaurus-mermaid-container'];
// Generated listing pages duplicate the post/doc pages they list.
const skipPath = (p) =>
  p.startsWith('/docs/archive') || p.startsWith('/blog/tags') || p.startsWith('/blog/page') ||
  p.startsWith('/search') || p.includes('/blog/archive') || p.includes('/blog/authors');

const blockedPropertyNames = new Set(['__proto__', 'constructor', 'prototype']);

/** Sitemap and axe keys may be stored only when they cannot become an object prototype write. */
export function safeReportKey(key) {
  if (typeof key !== 'string' || key.length === 0 || key.length > 300) throw new Error('rejected report key');
  if (blockedPropertyNames.has(key) || key.split(/[:\s/]/).some((part) => blockedPropertyNames.has(part))) {
    throw new Error('rejected report key');
  }
  if (!/^(?:\/[A-Za-z0-9._~/-]*|[A-Za-z0-9][A-Za-z0-9_.: /~-]*)$/.test(key) || key.includes('..')) {
    throw new Error('rejected report key');
  }
  return key;
}

function publicRecord(map) {
  const out = Object.create(null);
  for (const [key, value] of map) {
    const safe = safeReportKey(key);
    out[safe] = value instanceof Map ? publicRecord(value) : value;
  }
  return out;
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
const sitemap = path.join(buildDir, 'sitemap.xml');
if (!fs.existsSync(sitemap)) {
  console.error(`Missing ${sitemap}; run yarn build first.`);
  process.exit(2);
}
const paths = [...fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/')
  .filter((p) => !skipPath(p));

const browser = await chromium.launch();
const violations = new Map();
const errors = new Map();
const overflow = new Map();
const record = (theme, page, result) => {
  const pageKey = safeReportKey(page);
  for (const violation of result.violations) {
    const groupKey = safeReportKey(`${theme}:${violation.id}`);
    const entry = violations.get(groupKey) ?? {
      rule: violation.id, theme, impact: violation.impact, help: violation.helpUrl, nodes: 0, pages: new Map(), samples: [],
    };
    violations.set(groupKey, entry);
    entry.nodes += violation.nodes.length;
    entry.pages.set(pageKey, violation.nodes.length);
    for (const node of violation.nodes.slice(0, 2)) {
      if (entry.samples.length < 8) entry.samples.push(`${page} ${node.target.join(' ')}`);
    }
  }
};
const axeWorker = async (theme, list) => {
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  const page = await context.newPage();
  for (const p of list) {
    try {
      await page.goto(`${base}${p}?docusaurus-theme=${theme}`, {waitUntil: 'load', timeout: 30_000});
      await page.waitForTimeout(150);
      let builder = new AxeBuilder({page}).withTags(wcagTags);
      for (const selector of excluded) builder = builder.exclude(selector);
      record(theme, p, await builder.analyze());
    } catch (error) {
      errors.set(safeReportKey(`${theme} ${p}`), String(error).slice(0, 200));
    }
  }
  await context.close();
};
const overflowWorker = async (list) => {
  const context = await browser.newContext({viewport: {width: 320, height: 700}, reducedMotion: 'reduce'});
  const page = await context.newPage();
  for (const p of list) {
    try {
      await page.goto(`${base}${p}`, {waitUntil: 'load', timeout: 30_000});
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (extra > 0) overflow.set(safeReportKey(p), extra);
    } catch (error) {
      errors.set(safeReportKey(`320 ${p}`), String(error).slice(0, 200));
    }
  }
  await context.close();
};
const split = (list, n) => Array.from({length: n}, (_, i) => list.filter((_, j) => j % n === i));
await Promise.all([
  ...split(paths, 3).map((list) => axeWorker('light', list)),
  ...split(paths, 3).map((list) => axeWorker('dark', list)),
  ...split(paths, 2).map((list) => overflowWorker(list)),
]);
await browser.close();

const totalNodes = [...violations.values()].reduce((sum, entry) => sum + entry.nodes, 0);
const violationReport = Object.create(null);
for (const [key, entry] of violations) {
  violationReport[safeReportKey(key)] = {
    rule: entry.rule, theme: entry.theme, impact: entry.impact, help: entry.help,
    nodes: entry.nodes, pages: publicRecord(entry.pages), samples: entry.samples,
  };
}
const report = {
  base, pageCount: paths.length, themes: ['light', 'dark'], totalNodes,
  violations: violationReport, overflow320: publicRecord(overflow), errors: publicRecord(errors),
};
fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
const lines = [
  `# Full-site accessibility scan`,
  '',
  `Scanned ${paths.length} pages in light and dark themes (axe-core, WCAG 2.2 A/AA tags) plus a 320px overflow sweep.`,
  '',
  `- Violation nodes: **${totalNodes}**`,
  `- Pages with page-level horizontal scroll at 320px: **${overflow.size}**`,
  `- Pages that failed to load: **${errors.size}**`,
  '',
];
if (totalNodes) {
  lines.push('| Theme | Rule | Impact | Nodes | Pages | Example |', '| --- | --- | --- | --- | --- | --- |');
  for (const entry of violations.values()) {
    lines.push(`| ${entry.theme} | [${entry.rule}](${entry.help}) | ${entry.impact} | ${entry.nodes} | ${entry.pages.size} | \`${entry.samples[0] ?? ''}\` |`);
  }
  lines.push('');
}
for (const [p, extra] of overflow) lines.push(`- 320px overflow: \`${p}\` (+${extra}px)`);
for (const [p, error] of errors) lines.push(`- Load error: \`${p}\`: ${error}`);
const markdown = `${lines.join('\n')}\n`;
if (markdownFile) fs.writeFileSync(markdownFile, markdown);
console.log(markdown);
process.exit(totalNodes || overflow.size || errors.size ? 1 : 0);
}
