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

const sitemap = path.join(buildDir, 'sitemap.xml');
if (!fs.existsSync(sitemap)) {
  console.error(`Missing ${sitemap}; run yarn build first.`);
  process.exit(2);
}
const paths = [...fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/')
  .filter((p) => !skipPath(p));

const browser = await chromium.launch();
const violations = {};
const errors = {};
const overflow = {};
const record = (theme, page, result) => {
  for (const violation of result.violations) {
    const entry = (violations[`${theme}:${violation.id}`] ??= {
      rule: violation.id, theme, impact: violation.impact, help: violation.helpUrl, nodes: 0, pages: {}, samples: [],
    });
    entry.nodes += violation.nodes.length;
    entry.pages[page] = violation.nodes.length;
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
      errors[`${theme} ${p}`] = String(error).slice(0, 200);
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
      if (extra > 0) overflow[p] = extra;
    } catch (error) {
      errors[`320 ${p}`] = String(error).slice(0, 200);
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

const totalNodes = Object.values(violations).reduce((sum, entry) => sum + entry.nodes, 0);
const report = {base, pageCount: paths.length, themes: ['light', 'dark'], totalNodes, violations, overflow320: overflow, errors};
fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
const lines = [
  `# Full-site accessibility scan`,
  '',
  `Scanned ${paths.length} pages in light and dark themes (axe-core, WCAG 2.2 A/AA tags) plus a 320px overflow sweep.`,
  '',
  `- Violation nodes: **${totalNodes}**`,
  `- Pages with page-level horizontal scroll at 320px: **${Object.keys(overflow).length}**`,
  `- Pages that failed to load: **${Object.keys(errors).length}**`,
  '',
];
if (totalNodes) {
  lines.push('| Theme | Rule | Impact | Nodes | Pages | Example |', '| --- | --- | --- | --- | --- | --- |');
  for (const entry of Object.values(violations)) {
    lines.push(`| ${entry.theme} | [${entry.rule}](${entry.help}) | ${entry.impact} | ${entry.nodes} | ${Object.keys(entry.pages).length} | \`${entry.samples[0] ?? ''}\` |`);
  }
  lines.push('');
}
for (const [p, extra] of Object.entries(overflow)) lines.push(`- 320px overflow: \`${p}\` (+${extra}px)`);
for (const [p, error] of Object.entries(errors)) lines.push(`- Load error: \`${p}\`: ${error}`);
const markdown = `${lines.join('\n')}\n`;
if (markdownFile) fs.writeFileSync(markdownFile, markdown);
console.log(markdown);
process.exit(totalNodes || Object.keys(overflow).length || Object.keys(errors).length ? 1 : 0);
