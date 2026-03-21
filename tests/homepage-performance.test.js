#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const indexPagePath = path.join(__dirname, '..', 'src', 'pages', 'index.tsx');
const particleBackgroundPath = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'ParticleBackground',
  'index.tsx',
);
const workerPath = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'ParticleBackground',
  'particleWorker.ts',
);
const mascotPath = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'ShaftRobot',
  'index.tsx',
);

const indexPage = fs.readFileSync(indexPagePath, 'utf8');
const particleBackground = fs.readFileSync(particleBackgroundPath, 'utf8');
const workerFile = fs.readFileSync(workerPath, 'utf8');
const mascot = fs.readFileSync(mascotPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const lazyImportPattern = /React\.lazy\([\s\S]*import\('@site\/src\/components\/ParticleBackground'\)/;
  const workerInitPattern = /new Worker\(\s*new URL\('\.\/particleWorker\.ts',\s*import\.meta\.url\),[\s\S]*type:\s*'module'/;
  const chestTextPattern = />\s*SHAFT\s*</;

  assert(
    lazyImportPattern.test(indexPage),
    'Landing page should lazy load ParticleBackground using React.lazy import().',
  );

  assert(
    workerInitPattern.test(particleBackground),
    'ParticleBackground should initialize a dedicated module worker for particle updates.',
  );

  assert(
    workerFile.includes('self.onmessage') &&
      workerFile.includes("if (type === 'tick')") &&
      workerFile.includes('postFrame();'),
    'Worker should handle tick events and post frame data back to the main thread.',
  );

  assert(
    mascot.includes('FontAwesomeIcon') &&
      mascot.includes('icon={faRobot}') &&
      mascot.includes('src="/img/shaft_white.svg"') &&
      !chestTextPattern.test(mascot),
    'Mascot should use AutoBot robot visual style with SHAFT logo image on chest and no text label.',
  );

  console.log('✅ Homepage performance and mascot checks passed.');
} catch (error) {
  console.error('❌ Homepage performance and mascot checks failed.');
  console.error(error.message);
  process.exit(1);
}
