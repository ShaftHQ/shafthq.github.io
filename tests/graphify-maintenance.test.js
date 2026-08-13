#!/usr/bin/env node

const assert = require('assert');
const {spawnSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTROLLER = path.join(ROOT, 'tools', 'repository-map', 'graphify_maintenance.py');
const RESOLVER = path.join(ROOT, 'tools', 'repository-map', 'resolve_graph_out.py');

function findPython() {
  const candidates = process.platform === 'win32'
    ? [['py', ['-3']], ['python', []], ['python3', []]]
    : [['python3', []], ['python', []]];
  for (const [command, prefix] of candidates) {
    const result = spawnSync(command, [...prefix, '--version'], {encoding: 'utf8'});
    if (result.status === 0) return {command, prefix};
  }
  throw new Error('Python 3 is required for the Graphify maintenance contract');
}

function runPython(script, args, cwd = ROOT) {
  const python = findPython();
  return spawnSync(python.command, [...python.prefix, script, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function runGit(root, ...args) {
  const result = spawnSync('git', args, {cwd: root, encoding: 'utf8'});
  assert.strictEqual(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function initializeRepository(root) {
  runGit(root, 'init');
  runGit(root, 'config', 'user.email', 'graphify@example.invalid');
  runGit(root, 'config', 'user.name', 'Graphify Contract');
  fs.writeFileSync(path.join(root, 'source.js'), 'const clean = true;\n');
  runGit(root, 'add', 'source.js');
  runGit(root, 'commit', '-m', 'fixture');
}

function writeFreshMarker(root, schemaVersion = 1) {
  const graphOut = path.join(root, 'graphify-out');
  const manifest = fs.readFileSync(path.join(graphOut, 'manifest.json'));
  const crypto = require('crypto');
  fs.writeFileSync(path.join(graphOut, '.shaft-source-revision.json'), JSON.stringify({
    schema_version: schemaVersion,
    indexed_revision: runGit(root, 'rev-parse', 'HEAD'),
    manifest_sha256: crypto.createHash('sha256').update(manifest).digest('hex'),
  }));
}

function writeCache(root, paths, covered) {
  const graphOut = path.join(root, 'graphify-out');
  fs.mkdirSync(graphOut, {recursive: true});
  const manifest = Object.fromEntries(paths.map(source => [source, {
    ast_hash: '',
    semantic_hash: '',
  }]));
  const graph = {
    nodes: covered.map((source, index) => ({id: `node-${index}`, source_file: source})),
    links: [],
  };
  fs.writeFileSync(path.join(graphOut, 'manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(graphOut, 'graph.json'), JSON.stringify(graph));
}

assert.ok(fs.existsSync(CONTROLLER), 'repository-owned Graphify controller is missing');
assert.ok(fs.existsSync(RESOLVER), 'repository-owned Graphify cache resolver is missing');

const graphifyIgnore = fs.readFileSync(path.join(ROOT, '.graphifyignore'), 'utf8');
const graphifyIgnorePatterns = new Set(graphifyIgnore.split(/\r?\n/));
for (const pattern of ['*.yml', '*.yaml', '*.txt', '*.html', '*.svg', '*.png', '*.jpg', '*.jpeg', '*.webp', '*.gif', '*.ico']) {
  assert.ok(graphifyIgnorePatterns.has(pattern), `missing corpus exclusion: ${pattern}`);
}

const gitignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
assert.match(gitignore, /^\/graphify-out\/$/m, 'Graphify runtime cache must be ignored as one directory');
const trackedCache = spawnSync('git', ['ls-files', 'graphify-out'], {cwd: ROOT, encoding: 'utf8'});
assert.strictEqual(trackedCache.status, 0, trackedCache.stderr);
assert.strictEqual(trackedCache.stdout.trim(), '', 'Graphify runtime cache must not be tracked');

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'shaft-guide-graphify-'));
try {
  writeCache(temporary, ['src/covered.ts', 'data/config.json'], ['src\\covered.ts']);
  let result = runPython(CONTROLLER, ['audit', '--root', temporary]);
  assert.strictEqual(result.status, 0, result.stderr);
  let report = JSON.parse(result.stdout);
  assert.deepStrictEqual(report.covered, ['src/covered.ts']);
  assert.deepStrictEqual(report.expected_data_only, ['data/config.json']);
  assert.deepStrictEqual(report.missing_optional_parser, []);
  assert.deepStrictEqual(report.unexpected_parser_gap, []);

  writeCache(temporary, ['src/covered.ts', 'data/config.json', 'src/gap.ts', 'config/site.yaml'], ['src/covered.ts']);
  result = runPython(CONTROLLER, ['audit', '--root', temporary]);
  assert.strictEqual(result.status, 1, 'supported and unexcluded sibling gaps must fail closed');
  report = JSON.parse(result.stdout);
  assert.deepStrictEqual(report.expected_data_only, ['data/config.json']);
  assert.deepStrictEqual(report.unexpected_parser_gap, ['config/site.yaml', 'src/gap.ts']);
} finally {
  fs.rmSync(temporary, {recursive: true, force: true});
}

const freshnessRepository = fs.mkdtempSync(path.join(os.tmpdir(), 'shaft-guide-graphify-freshness-'));
try {
  initializeRepository(freshnessRepository);
  writeCache(freshnessRepository, ['source.js'], ['source.js']);
  writeFreshMarker(freshnessRepository);
  let result = runPython(RESOLVER, ['--check'], freshnessRepository);
  assert.strictEqual(result.status, 0, result.stderr);

  fs.writeFileSync(path.join(freshnessRepository, 'source.js'), 'const clean = false;\n');
  result = runPython(RESOLVER, ['--check'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'unstaged tracked source changes must make the cache stale');
  assert.match(result.stderr, /tracked source changes/);
  result = runPython(CONTROLLER, ['refresh', '--root', freshnessRepository], freshnessRepository);
  assert.strictEqual(result.status, 1, 'refresh must reject unstaged tracked source changes');
  assert.match(result.stderr, /clean tracked sources/);
  fs.rmSync(path.join(freshnessRepository, 'graphify-out', '.shaft-source-revision.json'));
  result = runPython(RESOLVER, ['--record-current'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'record-current must reject unstaged tracked source changes');
  assert.match(result.stderr, /clean tracked sources/);
  assert.ok(!fs.existsSync(path.join(freshnessRepository, 'graphify-out', '.shaft-source-revision.json')));

  runGit(freshnessRepository, 'add', 'source.js');
  result = runPython(RESOLVER, ['--check'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'staged tracked source changes must make the cache stale');
  assert.match(result.stderr, /tracked source changes/);
  result = runPython(CONTROLLER, ['refresh', '--root', freshnessRepository], freshnessRepository);
  assert.strictEqual(result.status, 1, 'refresh must reject staged tracked source changes');
  assert.match(result.stderr, /clean tracked sources/);
  result = runPython(RESOLVER, ['--record-current'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'record-current must reject staged tracked source changes');
  assert.match(result.stderr, /clean tracked sources/);
  assert.ok(!fs.existsSync(path.join(freshnessRepository, 'graphify-out', '.shaft-source-revision.json')));

  runGit(freshnessRepository, 'reset', '--hard', 'HEAD');
  writeFreshMarker(freshnessRepository, true);
  result = runPython(RESOLVER, ['--check'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'boolean schema aliases must fail closed');
  assert.match(result.stderr, /schema is unsupported/);

  fs.writeFileSync(path.join(freshnessRepository, 'graphify-out', '.shaft-source-revision.json'), '{');
  result = runPython(RESOLVER, ['--check'], freshnessRepository);
  assert.strictEqual(result.status, 1, 'malformed markers must fail closed');
  assert.match(result.stderr, /marker is unreadable/);
} finally {
  fs.rmSync(freshnessRepository, {recursive: true, force: true});
}

const controllerSource = fs.readFileSync(CONTROLLER, 'utf8');
const refreshSource = controllerSource.slice(
  controllerSource.indexOf('def refresh('),
  controllerSource.indexOf('def parser('),
);
const build = refreshSource.indexOf('"build"');
const audit = refreshSource.indexOf('run_audit(');
const cluster = refreshSource.indexOf('run_stage("cluster"');
const record = refreshSource.indexOf('"record"');
assert.ok(build >= 0 && build < audit && audit < cluster && cluster < record,
  'refresh must preserve build -> audit -> cluster -> marker ordering');
assert.match(controllerSource, /"--code-only"/);

const maintainerGuide = fs.readFileSync(path.join(ROOT, 'docs', 'maintainers', 'agent-tooling.md'), 'utf8');
assert.match(maintainerGuide, /root `\.graphifyignore`/);
assert.match(maintainerGuide, /YAML, plain-text, standalone HTML, SVG, and raster media/);
assert.match(maintainerGuide, /credential-free code\/configuration corpus/);
assert.match(maintainerGuide, /clean tracked sources/);

console.log('Graphify maintenance contract passed');
