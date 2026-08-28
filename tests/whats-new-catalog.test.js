import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const catalogPath = join(root, 'src/data/whats-new-catalog.json');
assert(existsSync(catalogPath), 'Shared What\'s New catalog must exist.');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const groupIds = new Set(catalog.groups.map(({id}) => id));
const visibleGoals = new Set(['set-up', 'record', 'agentic', 'evidence', 'web', 'mobile', 'api', 'audit', 'validate']);
const featureIds = new Set();

assert.deepEqual(
  [...groupIds],
  ['platform', 'capture', 'agentic', 'evidence', 'testing', 'modules', 'missed'],
  'Catalog must expose every approved capability group in journey order.',
);
assert(catalog.features.length >= 40, 'Parity catalog must include at least 40 capability-level entries.');

for (const feature of catalog.features) {
  assert(!featureIds.has(feature.id), `Duplicate feature id: ${feature.id}`);
  featureIds.add(feature.id);
  assert(groupIds.has(feature.group), `${feature.id} references unknown group ${feature.group}.`);
  assert(feature.goals.length > 0, `${feature.id} needs at least one goal.`);
  for (const goal of feature.goals) assert(visibleGoals.has(goal), `${feature.id} uses hidden goal ${goal}.`);
  for (const field of ['title', 'what', 'why', 'configure', 'use', 'guide']) {
    assert(feature[field]?.trim(), `${feature.id} needs ${field}.`);
  }
  assert(/^\/docs\//.test(feature.guide), `${feature.id} guide must be an internal docs link.`);
  const [route, anchor] = feature.guide.slice('/docs/'.length).split('#');
  const candidates = [join(root, 'docs', `${route}.md`), join(root, 'docs', `${route}.mdx`)];
  const guidePath = candidates.find(existsSync);
  assert(guidePath, `${feature.id} guide route does not exist: ${feature.guide}`);
  if (anchor) {
    const guide = readFileSync(guidePath, 'utf8');
    const explicitAnchor = new RegExp(`\\{\\/\\*\\s*#${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*\\/\\}`);
    const headingAnchors = [...guide.matchAll(/^#{1,6}\s+(.+?)(?:\s+\{\/\*.*)?$/gm)].map(([, heading]) => heading
      .replace(/[`*_]/g, '').trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
    assert(explicitAnchor.test(guide) || headingAnchors.includes(anchor), `${feature.id} guide anchor does not exist: ${feature.guide}`);
  }
}

for (const required of [
  'managed-local-ai', 'android-appium', 'ios-windows-appium', 'selenium-grid',
  'healenium', 'reportportal', 'browserstack-local', 'playwright-browsers',
  'lighthouse', 'browser-recording', 'api-recording', 'mobile-api-capture',
  'scenario-to-code', 'soft-verification-evidence', 'sharded-report-merge',
  'graphql', 'openapi-coverage', 'network-interception', 'storage-state-har',
  'flutter-api', 'android-performance', 'localization-assertions',
  'coverage-planning', 'natural-language-actions', 'locator-health',
  'flake-profiler', 'allure-overview', 'native-playwright-traces', 'remote-terminal',
]) {
  assert(featureIds.has(required), `Parity catalog missing ${required}.`);
}

for (const group of catalog.groups) {
  assert(existsSync(join(root, `docs/features/whats-new/${group.id}.md`)), `Missing group page for ${group.id}.`);
}

console.log(`Validated ${catalog.features.length} What\'s New catalog entries.`);
