const fs = require('fs');
const os = require('os');
const path = require('path');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'src', 'pages', 'index.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'pages', 'index.module.css'), 'utf8');
const config = fs.readFileSync(path.join(root, 'docusaurus.config.js'), 'utf8');
const imgbotConfig = JSON.parse(fs.readFileSync(path.join(root, '.imgbotconfig'), 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(index.includes('Release decisions backed by inspectable evidence.'), 'Homepage must lead with the approved evidence proposition.');
assert(index.includes('<main data-testid="landing-main">') && index.includes('<h1>Release decisions backed by inspectable evidence.</h1>'), 'Homepage must retain a semantic main landmark and one primary evidence proposition.');
assert(index.includes('landing-${suffix}-create-project') && index.includes('landing-${suffix}-documentation') && index.includes('landing-${suffix}-star'), 'Homepage must expose stable CTA hooks at both hero and final placements.');
for (const [href, label] of [['/project-generator', 'Create new project'], ['/docs/start/overview', 'Explore documentation'], ['https://github.com/ShaftHQ/SHAFT_ENGINE', 'Star on GitHub']]) assert(index.includes(href) && index.includes(label), `Homepage must ship ${label}.`);
assert(!/io\.github\.shafthq\s*:\s*shaft-engine|<artifactId>shaft-engine<\/artifactId>|landing-dependency-snippet/.test(index), 'Homepage must not prescribe a direct Maven dependency.');
for (const image of ['allure-passed-evidence.png', 'allure-failed-evidence.png', 'allure-visual-diff-evidence.png']) {
  assert(index.includes(`/img/evidence/${image}`), `Homepage must render authentic evidence image ${image}.`);
  assert(fs.existsSync(path.join(root, 'static', 'img', 'evidence', image)), `Evidence asset ${image} must ship.`);
}
for (const [image, minimumWidth, minimumHeight] of [['visual-expected.png', 1024, 1024], ['visual-actual.png', 1024, 1024], ['visual-difference.png', 1024, 1024]]) {
  const asset = fs.readFileSync(path.join(root, 'static', 'img', 'evidence', image));
  assert(asset.readUInt32BE(16) >= minimumWidth && asset.readUInt32BE(20) >= minimumHeight, `${image} must be at least ${minimumWidth}x${minimumHeight}.`);
  assert(index.includes(`/img/evidence/${image}`), `${image} must render in the visual evidence plate.`);
}
for (const [image, minimumWidth, minimumHeight] of [['allure-passed-evidence.png', 1920, 1080], ['allure-failed-evidence.png', 1920, 1080], ['allure-visual-diff-evidence.png', 1920, 1080]]) {
  const asset = fs.readFileSync(path.join(root, 'static', 'img', 'evidence', image));
  assert(asset.readUInt32BE(16) >= minimumWidth && asset.readUInt32BE(20) >= minimumHeight, `${image} must be at least ${minimumWidth}x${minimumHeight}.`);
}
assert(index.includes('loading="lazy"'), 'Below-fold evidence images must lazy-load.');
assert(index.includes('landing_conversion') && index.includes('cta_name') && index.includes('placement') && index.includes('destination'), 'CTA analytics must use the approved optional gtag event contract.');
assert(index.includes('typeof window') && index.includes('browser.gtag?.'), 'CTA analytics must be SSR-safe and no-op without gtag.');
assert(index.includes('Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.'), 'Homepage must disclose reported-use provenance.');
for (const sponsor of ['JetBrains', 'BrowserStack', 'LambdaTest / TestMu', 'Applitools']) assert(index.includes(sponsor), `Homepage must include sponsor ${sponsor}.`);
for (const logo of ['jetbrains.svg', 'browserstack.svg', 'testmu.svg', 'applitools.svg']) {
  assert(index.includes(`/img/supporters/${logo}`), `Homepage must render supporter logo ${logo}.`);
  assert(fs.existsSync(path.join(root, 'static', 'img', 'supporters', logo)), `Supporter logo ${logo} must ship locally.`);
}
assert(index.includes('Community-reported use'), 'Homepage must separate reported-use organizations from sponsors.');
const reportedOrganizations = ['vois', 'get-group', 'momah', 'vodafone-egypt', 'solutions-by-stc', 'giza-systems', 'euronet', 'terkwaz', 'incorta', 'bayantech', 'adam-ai', 'act', 'elmenus', 'idemia', 'ihorizons', 'robusta', 'paymob', 'jahez', 'salt-bank', 'baianat', 'dxc', 'efg-holding'];
for (const organization of reportedOrganizations) {
  const logoPattern = new RegExp(`/img/community/${organization}\\.(?:svg|png|webp|ico)`);
  assert(logoPattern.test(index), `Homepage must render the ${organization} community logo.`);
  assert(fs.readdirSync(path.join(root, 'static', 'img', 'community')).some((file) => new RegExp(`^${organization}\\.(?:svg|png|webp|ico)$`).test(file)), `${organization} must ship as a local graphical logo.`);
}
const logoProvenance = JSON.parse(fs.readFileSync(path.join(root, 'static', 'img', 'community', 'provenance.json'), 'utf8'));
assert(logoProvenance.organizations.length === reportedOrganizations.length, 'Logo provenance must cover all 22 reported organizations.');
for (const entry of logoProvenance.organizations) {
  assert(entry.name && /^https:\/\//.test(entry.sourceUrl) && /^\d{4}-\d{2}-\d{2}$/.test(entry.retrieved), `Logo provenance for ${entry.name || 'unknown'} must include source URL and retrieval date.`);
}
assert(index.includes("'https://github.com/ShaftHQ/SHAFT_ENGINE/actions'") && index.includes("'#evidence-heading'"), 'Homepage proof statements must link readers to their exact primary evidence destinations.');
for (const section of ['landing-trust', 'landing-audiences', 'landing-guides', 'landing-surfaces', 'landing-product-gallery', 'landing-architecture', 'landing-adoption', 'landing-evidence-loop']) assert(index.includes(`data-testid="${section}"`), `Homepage must restore ${section}.`);
for (const icon of ['faTerminal', 'faBookOpen', 'faStar']) assert(index.includes(icon), `Homepage CTA buttons must render ${icon}.`);
assert(index.includes('technicalOrbit') && index.includes('aria-hidden="true"'), 'Homepage must use a decorative technical orbit.');
assert(index.includes('<dialog') && index.includes('evidence-lightbox') && index.includes('showModal()'), 'Evidence must open in an accessible native dialog.');
assert(styles.includes('.logoPlate') && styles.includes('backdrop-filter'), 'SHAFT mark must sit on a contrasting translucent plate.');
assert(styles.includes('.evidenceMedia') && styles.includes('overflow: hidden'), 'Evidence zoom must stay inside a stable media frame.');
assert(styles.includes('prefers-reduced-motion: reduce'), 'Homepage motion must respect reduced-motion.');
assert(!index.includes('IntersectionObserver') && !index.includes('data-reveal'), 'Homepage must not hide content behind scroll reveals.');
assert(!styles.includes("data-reveal-state='rolled-back'"), 'Homepage must not restore rollback reveal styling.');

assert(config.includes("content: siteAsset('/img/shaft-social-card.png')"), 'Open Graph metadata must use the deterministic SHAFT product social card.');
assert(imgbotConfig.ignoredFiles.includes('shaft-social-card.png'), 'ImgBot must ignore the deterministic social-card filename.');
assert(/property: 'og:image:width',[\s\S]{0,80}content: '1200'/.test(config), 'Open Graph metadata width must match the 1200px shipped card.');
assert(/property: 'og:image:height',[\s\S]{0,80}content: '630'/.test(config), 'Open Graph metadata height must match the 630px shipped card.');
const socialCardPath = path.join(root, 'static', 'img', 'shaft-social-card.png');
const socialCard = fs.readFileSync(socialCardPath);
assert(socialCard.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', 'The shipped social card must have the complete PNG signature.');
assert(socialCard.readUInt32BE(16) === 1200 && socialCard.readUInt32BE(20) === 630, 'The shipped social card must be exactly 1200x630.');
const socialCardGenerator = fs.readFileSync(path.join(root, 'scripts', 'generate-homepage-social-card.mjs'), 'utf8');
assert(socialCardGenerator.includes('drawScaledContain(reportDashboard'), 'The social card must preserve the report aspect ratio.');
assert(!/chromium|font-family|Arial|Helvetica|Consolas/.test(socialCardGenerator), 'Social-card bytes must not depend on a browser or host-installed font renderer.');
const socialCardTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shaft-social-card-'));
try {
  const generatorPath = path.join(root, 'scripts', 'generate-homepage-social-card.mjs');
  const inspectPng = (file) => JSON.parse(execFileSync(process.execPath, [generatorPath, '--inspect', file], {encoding: 'utf8'}));
  const regeneratedPath = path.join(socialCardTempDir, 'regenerated.png');
  execFileSync(process.execPath, [generatorPath, regeneratedPath]);
  const shippedPixels = inspectPng(socialCardPath);
  const regeneratedPixels = inspectPng(regeneratedPath);
  assert(shippedPixels.width === 1200 && shippedPixels.height === 630 && shippedPixels.bitDepth === 8 && shippedPixels.colorType === 6, 'The shipped social card must decode as 1200x630 8-bit RGBA.');
  assert(shippedPixels.pixelHash === regeneratedPixels.pixelHash, 'The shipped social card must pixel-match generated RGBA output.');
  const recompressedPath = path.join(socialCardTempDir, 'recompressed.png');
  execFileSync(process.execPath, [generatorPath, '--reencode', regeneratedPath, recompressedPath, '1']);
  assert(!fs.readFileSync(regeneratedPath).equals(fs.readFileSync(recompressedPath)), 'The compression mutation must produce different PNG bytes.');
  assert(inspectPng(recompressedPath).pixelHash === regeneratedPixels.pixelHash, 'Equivalent PNG compression must preserve decoded pixels.');
  const pixelMutatedPath = path.join(socialCardTempDir, 'pixel-mutated.png');
  execFileSync(process.execPath, [generatorPath, '--mutate-first-pixel', regeneratedPath, pixelMutatedPath]);
  assert(inspectPng(pixelMutatedPath).pixelHash !== regeneratedPixels.pixelHash, 'A decoded-pixel mutation must fail the social-card pixel contract.');
} finally {
  fs.rmSync(socialCardTempDir, {recursive: true, force: true});
}
