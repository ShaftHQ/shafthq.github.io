import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname));
const repoRoot = path.resolve(root, '..');

const {allowlistedDocsBase} = await import(pathToFileURL(path.join(repoRoot, 'scripts/run-shaft-tests.mjs')).href);
const {resolveInsideRoot} = await import(pathToFileURL(path.join(repoRoot, 'scripts/generate-homepage-social-card.mjs')).href);
const {resolveEnginePropertiesDir, resolveJavaPropertyFile} = await import(
  pathToFileURL(path.join(repoRoot, 'scripts/generate-properties-catalog.mjs')).href
);
const {safeReportKey} = await import(pathToFileURL(path.join(repoRoot, 'scripts/a11y-sitewide.mjs')).href);
const {parsePalette} = await import(pathToFileURL(path.join(repoRoot, 'tests/design-contrast.test.js')).href);

const local = allowlistedDocsBase('http://127.0.0.1:3000/docs');
assert.equal(local, 'http://127.0.0.1:3000/');
const localhost = allowlistedDocsBase('http://localhost:3000/docs');
assert.equal(localhost, 'http://127.0.0.1:3000/');
const published = allowlistedDocsBase('https://shafthq.github.io/docs/intro');
assert.equal(published, 'https://shafthq.github.io/');
assert.throws(() => allowlistedDocsBase('https://example.com/'), /not allowlisted/);
assert.throws(() => allowlistedDocsBase('http://169.254.169.254/latest'), /not allowlisted/);
assert.throws(() => allowlistedDocsBase('file:///etc/passwd'), /http or https|not allowlisted|not a URL/);

const inside = resolveInsideRoot(repoRoot, 'static/img/shaft-social-card.png');
assert.equal(inside, path.join(repoRoot, 'static', 'img', 'shaft-social-card.png'));
assert.throws(() => resolveInsideRoot(repoRoot, '../SHAFT_ENGINE/pom.xml'), /escapes/);
assert.throws(() => resolveInsideRoot(repoRoot, '/etc/passwd'), /escapes/);

const engineDir = path.join(os.tmpdir(), 'shaft-engine', 'src', 'main', 'java', 'com', 'shaft', 'properties', 'internal');
const resolvedEngine = resolveEnginePropertiesDir(engineDir);
assert.equal(resolvedEngine, path.resolve(engineDir));
assert.throws(() => resolveEnginePropertiesDir('/etc'), /must end at/);
assert.throws(() => resolveEnginePropertiesDir(path.join(engineDir, '..', '..', '..', '..', '..', '..', '..', 'etc')), /must end at/);
const javaFile = resolveJavaPropertyFile(resolvedEngine, 'Web.java');
assert.equal(javaFile, path.join(resolvedEngine, 'Web.java'));
assert.throws(() => resolveJavaPropertyFile(resolvedEngine, '../Web.java'), /rejected properties source name/);
assert.throws(() => resolveJavaPropertyFile(resolvedEngine, 'Web.java/../../passwd'), /rejected properties source name/);

assert.equal(safeReportKey('/docs/intro'), '/docs/intro');
assert.equal(safeReportKey('light:color-contrast'), 'light:color-contrast');
assert.throws(() => safeReportKey('__proto__'), /rejected report key/);
assert.throws(() => safeReportKey('constructor'), /rejected report key/);
assert.throws(() => safeReportKey('prototype'), /rejected report key/);

const palette = parsePalette(`--site-color-primary: #006ebf;\n--site-color-constructor: #000000;\n--site-color-__proto__: #ffffff;\n`);
assert.equal(palette.get('primary'), '#006ebf');
assert.equal(palette.has('constructor'), false);
assert.equal(palette.has('__proto__'), false);
assert.equal(Object.prototype.polluted, undefined);

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'shaft-graph-guard-'));
try {
  for (const args of [
    ['init'],
    ['config', 'user.email', 'graphify@example.invalid'],
    ['config', 'user.name', 'Graphify Contract'],
  ]) {
    const git = spawnSync('git', args, {cwd: fixture, encoding: 'utf8'});
    assert.equal(git.status, 0, git.stderr);
  }
  fs.writeFileSync(path.join(fixture, 'source.js'), 'const clean = true;\n');
  for (const args of [['add', 'source.js'], ['commit', '-m', 'fixture']]) {
    const git = spawnSync('git', args, {cwd: fixture, encoding: 'utf8'});
    assert.equal(git.status, 0, git.stderr);
  }
  const probe = spawnSync('python3', ['-c', `
import os, sys
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(path.join(repoRoot, 'tools', 'repository-map'))})
import resolve_graph_out as resolver
import graphify_maintenance as maintenance

root = Path(${JSON.stringify(fixture)}).resolve()
expected = (root / "graphify-out").resolve()
os.environ.pop("SHAFT_GRAPHIFY_OUT", None)
assert resolver.find_shared_graph_out(root) == expected

os.environ["SHAFT_GRAPHIFY_OUT"] = str(expected)
assert resolver.find_shared_graph_out(root) == expected

os.environ["SHAFT_GRAPHIFY_OUT"] = "/tmp/not-the-cache"
try:
    resolver.find_shared_graph_out(root)
except RuntimeError as error:
    assert "primary checkout" in str(error)
else:
    raise SystemExit("outside graphify-out was accepted")

os.environ["SHAFT_GRAPHIFY_OUT"] = "/tmp/not-the-cache"
try:
    maintenance.refresh(root, expected)
except ValueError as error:
    assert "must match" in str(error)
else:
    raise SystemExit("refresh accepted an outside SHAFT_GRAPHIFY_OUT")
print("python-guards-ok")
`], {encoding: 'utf8'});
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);
  assert.match(probe.stdout, /python-guards-ok/);
} finally {
  fs.rmSync(fixture, {recursive: true, force: true});
}
console.log('codeql sink guards passed');
