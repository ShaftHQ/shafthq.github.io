const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'src', 'pages', 'index.tsx'), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const block = index.slice(index.indexOf('const reportedUse'), index.indexOf('function track'));
const logos = [...block.matchAll(/'([^']*\/img\/community\/[^']+)'/g)].map((m) => m[1]);
assert(logos.length === 29, `expected 29 community logos, got ${logos.length}`);
assert(!index.includes("filter: 'grayscale(1)'"), 'community logos must not be flattened to gray');
for (const logo of logos) {
  const file = path.join(root, 'static', logo);
  assert(fs.existsSync(file), `missing ${logo}`);
  assert(fs.statSync(file).size > 80, `${logo} is empty`);
  assert(!logo.endsWith('.ico'), `${logo} is a favicon, not a readable mark`);
}
const salt = fs.readFileSync(path.join(root, 'static', 'img', 'community', 'salt-bank.svg'), 'utf8');
assert(!salt.includes('#102a31'), 'Salt Bank must not sit on the deep plate');
assert(!salt.includes('#7BFD80'), 'Salt Bank gradient must not use the pale green that disappears on white');

console.log('community-logo-files.test.js: OK');
