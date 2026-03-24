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
const rootPath = path.join(__dirname, '..', 'src', 'theme', 'Root.tsx');
const roiCalculatorPath = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'RoiCalculator',
  'index.tsx',
);

const indexPage = fs.readFileSync(indexPagePath, 'utf8');
const particleBackground = fs.readFileSync(particleBackgroundPath, 'utf8');
const workerFile = fs.readFileSync(workerPath, 'utf8');
const mascot = fs.readFileSync(mascotPath, 'utf8');
const rootFile = fs.readFileSync(rootPath, 'utf8');
const roiCalculator = fs.readFileSync(roiCalculatorPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const lazyImportPattern = /React\.lazy\([\s\S]*import\('@site\/src\/components\/ParticleBackground'\)/;
  const lazyFeaturesPattern = /React\.lazy\([\s\S]*import\('@site\/src\/components\/HomepageFeatures'\)/;
  const lazyRoiPattern = /React\.lazy\([\s\S]*import\('@site\/src\/components\/RoiCalculator'\)/;
  const workerInitPattern = /new Worker\(\s*new URL\('\.\/particleWorker\.ts',\s*import\.meta\.url\),[\s\S]*type:\s*'module'/;
  const multiWorkerPattern = /workerCount[\s\S]*!prefersReducedMotion[\s\S]*hardwareConcurrency\s*>=\s*4[\s\S]*\?\s*2\s*:\s*1/;
  const chestTextPattern = />\s*SHAFT\s*</;

  assert(
    lazyImportPattern.test(indexPage),
    'Landing page should lazy load ParticleBackground using React.lazy import().',
  );

  assert(
    indexPage.includes('function SectionParticles') &&
      indexPage.includes('className={styles.ctaParticles}') &&
      indexPage.includes('className={styles.staticParticles}') &&
      indexPage.includes('motionScale={0.45}') &&
      indexPage.includes('motionScale={0.4}'),
    'Landing page should render subtle particle backgrounds in CTA and static (grey) sections with low-motion settings.',
  );

  assert(
    indexPage.includes('MOBILE_VIEWPORT_MEDIA_QUERY') &&
      indexPage.includes('MOBILE_CANVAS_FALLBACK_TIMEOUT_MS') &&
      indexPage.includes('window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches'),
    'Landing page hero particles should mount earlier on mobile viewports so animation remains visible as expected.',
  );

  assert(
    roiCalculator.includes('ParticleBackground') &&
      roiCalculator.includes('particleCount={14}') &&
      roiCalculator.includes('connectionDistance={85}') &&
      roiCalculator.includes('motionScale={0.45}') &&
      roiCalculator.includes('heroMode'),
    'ROI hero section should include a subtle particle background with heroMode for the secondary blue block.',
  );

  assert(
    workerInitPattern.test(particleBackground),
    'ParticleBackground should initialize a dedicated module worker for particle updates.',
  );

  assert(
    multiWorkerPattern.test(particleBackground) &&
      particleBackground.includes('workersRef') &&
      particleBackground.includes('workerFramesRef') &&
      particleBackground.includes('mergedParticles.push') &&
      particleBackground.includes('pointerRef') &&
      particleBackground.includes('motionScale') &&
      particleBackground.includes('heroMode') &&
      particleBackground.includes('isLighthouseSession') &&
      particleBackground.includes('MOBILE_MAX_WIDTH_MEDIA_QUERY') &&
      particleBackground.includes('MOBILE_PARTICLE_MULTIPLIER'),
    'ParticleBackground should support heroMode, multiple workers with merged frame rendering and pointer-reactive particle behavior.',
  );

  assert(
    lazyFeaturesPattern.test(indexPage) && lazyRoiPattern.test(indexPage),
    'Landing page should lazy load HomepageFeatures and RoiCalculator to reduce initial blocking work.',
  );

  assert(
    indexPage.includes('DeferredSection') &&
      indexPage.includes('requestIdleCallback') &&
      indexPage.includes('IntersectionObserver'),
    'Landing page should defer dynamic section hydration until intersection/idle to reduce time-to-interact.',
  );

  assert(
    workerFile.includes('self.onmessage') &&
      workerFile.includes("if (type === 'tick')") &&
      workerFile.includes('postFrame();') &&
      workerFile.includes('workerId') &&
      workerFile.includes('pointerActive') &&
      workerFile.includes('type: \'frame\''),
    'Worker should handle tick events, pointer-reactive updates, and post frame data back to the main thread.',
  );

  assert(
    mascot.includes('FontAwesomeIcon') &&
      mascot.includes('icon={faRobot}') &&
      mascot.includes('src="/img/shaft_white.svg"') &&
      !chestTextPattern.test(mascot),
    'Mascot should use AutoBot robot visual style with SHAFT chest logo image and no text label.',
  );

  assert(
    rootFile.includes('requestIdleCallback') &&
      rootFile.includes('<DeferredAutoBot />') &&
      rootFile.includes('LazyAutoBot') &&
      rootFile.includes('setShouldRender(true)'),
    'AutoBot widget should be lazy loaded and deferred to idle/intent time to reduce main-thread blocking on initial load.',
  );

  console.log('✅ Homepage performance and mascot checks passed.');
} catch (error) {
  console.error('❌ Homepage performance and mascot checks failed.');
  console.error(error.message);
  process.exit(1);
}
