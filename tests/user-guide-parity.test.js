// User-guide parity (#1099): every public SHAFT facade method in src/data/user-guide-surface.json
// must be mentioned as `name(` somewhere in docs/, or be listed in
// src/data/user-guide-parity-exclusions.json with a non-empty reason.
// Regenerate the snapshot with: SHAFT_ENGINE_PATH=<checkout> node scripts/generate-user-guide-surface.mjs

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const surface = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/user-guide-surface.json'), 'utf8'));
const exclusions = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/user-guide-parity-exclusions.json'), 'utf8'));

function docsText(dir) {
  let text = '';
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) text += docsText(full);
    else if (/\.mdx?$/.test(entry.name)) text += `\n${fs.readFileSync(full, 'utf8')}`;
  }
  return text;
}

const docs = docsText(path.join(ROOT, 'docs'));
const missing = [];
const staleExclusions = [];
for (const [label, methods] of Object.entries(surface)) {
  for (const method of methods) {
    const key = `${label}.${method}`;
    const documented = new RegExp(`\\b${method}\\(`).test(docs);
    if (key in exclusions) {
      assert.ok(String(exclusions[key]).trim(), `exclusion ${key} needs a reason`);
      if (documented) staleExclusions.push(key);
    } else if (!documented) {
      missing.push(key);
    }
  }
}
for (const key of Object.keys(exclusions)) {
  const dot = key.lastIndexOf('.');
  const methods = surface[key.slice(0, dot)];
  assert.ok(methods && methods.includes(key.slice(dot + 1)), `exclusion ${key} is not in the surface snapshot`);
}

assert.deepStrictEqual(missing, [], `Undocumented public SHAFT methods (document them or exclude with a reason):\n  ${missing.join('\n  ')}`);
assert.deepStrictEqual(staleExclusions, [], `Excluded methods are now documented; drop them from the exclusions:\n  ${staleExclusions.join('\n  ')}`);
const total = Object.values(surface).reduce((sum, list) => sum + list.length, 0);
console.log(`User-guide parity passed (${total} public methods, ${Object.keys(exclusions).length} exclusions).`);

// The generator must not read files outside the engine checkout (CodeQL js/path-injection).
import('../scripts/generate-user-guide-surface.mjs').then(({engineSourcePath}) => {
  const root = path.resolve('/tmp/engine');
  assert.strictEqual(engineSourcePath(root, 'shaft-engine/A.java'), path.join(root, 'shaft-engine', 'A.java'));
  assert.throws(() => engineSourcePath(root, '../../etc/passwd'), /escapes the engine checkout/);
}).catch((error) => { console.error(error); process.exitCode = 1; });
