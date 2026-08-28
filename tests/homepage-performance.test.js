const fs = require('fs');
const os = require('os');
const path = require('path');
const {execFileSync} = require('child_process');

const root = path.join(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const index = fs.readFileSync(path.join(root, 'src', 'pages', 'index.tsx'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'src', 'components', 'ImageViewer.tsx'), 'utf8');
const tabsPath = path.join(root, 'src', 'components', 'AccessibleTabs.tsx');
const tabs = fs.existsSync(tabsPath) ? fs.readFileSync(tabsPath, 'utf8') : '';
const styles = fs.readFileSync(path.join(root, 'src', 'pages', 'index.module.css'), 'utf8');
const config = fs.readFileSync(path.join(root, 'docusaurus.config.js'), 'utf8');
const imgbotConfig = JSON.parse(fs.readFileSync(path.join(root, '.imgbotconfig'), 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function webpDimensions(asset) {
  assert(asset.subarray(0, 4).toString('ascii') === 'RIFF' && asset.subarray(8, 12).toString('ascii') === 'WEBP', 'Preview must be a WebP RIFF asset.');
  const type = asset.subarray(12, 16).toString('ascii');
  if (type === 'VP8 ') return {width: asset.readUInt16LE(26) & 0x3fff, height: asset.readUInt16LE(28) & 0x3fff};
  if (type === 'VP8X') return {width: asset.readUIntLE(24, 3) + 1, height: asset.readUIntLE(27, 3) + 1};
  throw new Error(`Unsupported WebP preview encoding: ${type}`);
}

assert(index.includes('<main data-testid="landing-main">') && index.includes('<h1>Release decisions backed by inspectable evidence.</h1>'), 'Homepage must retain one semantic main landmark and the approved H1.');
assert(index.includes('Run one Java project across web, mobile, API, database, and CLI. Keep native engine control, then connect Capture, Doctor, Heal, and MCP when they add evidence.'), 'Hero must lead with the approved task-first proposition.');
assert(index.includes('snippets.firstRunCommand') && index.includes('Generate project') && index.includes('Inspect report'), 'Hero proof rail must render the reusable first-run command.');
assert(index.includes('See agent-to-evidence workflow') && index.includes('href="#agent-workflow"'), 'Hero must link directly to the workflow.');
assert(index.includes("placement === 'final'") && index.includes('landing-${suffix}-star'), 'GitHub CTA must remain only in the final CTA cluster.');
assert(index.includes('view_agent_workflow') && index.includes('landing_conversion'), 'Workflow anchor analytics must preserve the CTA event shape.');
assert(!/io\.github\.shafthq\s*:\s*shaft-engine|<artifactId>shaft-engine<\/artifactId>|landing-dependency-snippet/.test(index), 'Homepage must not prescribe a direct Maven dependency.');

assert(index.includes('data-testid="landing-agent-workflow"') && index.includes('From intent to reviewable Java and evidence.'), 'Homepage must consolidate agent evidence into the workflow section.');
for (const name of ['capture_start', 'capture_stop', 'capture_generate_replay', 'doctor_analyze_failed_allure', 'doctor_analyze_trace']) assert(index.includes(name), `Workflow must name verified ${name}.`);
assert(index.includes('Model choice remains with the MCP client. Tests remain ordinary Java. Proposals do not silently edit, approve, or merge.'), 'Workflow must state the model, Java, and proposal boundaries.');
for (const removed of ['landing-evidence', 'landing-product-gallery', 'landing-architecture', 'landing-audiences', 'landing-guides', 'landing-adoption', 'landing-evidence-loop']) assert(!index.includes(`data-testid="${removed}"`), `Superseded ${removed} section must not remain.`);

assert(index.includes('data-testid="landing-outcomes"'), 'Homepage must expose the outcome router.');
for (const outcome of ['Start a new suite', 'Migrate an existing suite', 'Add another testing surface', 'Diagnose a failed run']) assert(index.includes(outcome), `Outcome router must include ${outcome}.`);
assert(index.includes('data-testid="landing-surfaces"') && index.includes('One evidence model across five test surfaces'), 'Homepage must expose the five-surface explorer.');
for (const surface of ['Web', 'Mobile', 'API', 'Database', 'CLI']) assert(index.includes(`label: '${surface}'`), `Surface explorer must include ${surface}.`);
assert((index.match(/<AccessibleTabs/g) || []).length === 2, 'Workflow and surface explorer must reuse one tab primitive.');
assert(tabs.includes('role="tablist"') && tabs.includes('role="tab"') && tabs.includes('role="tabpanel"'), 'Tab primitive must expose native tab semantics.');
assert(tabs.includes('ArrowLeft') && tabs.includes('ArrowRight') && tabs.includes("case 'Home'") && tabs.includes("case 'End'") && tabs.includes("case 'Enter'") && tabs.includes("case ' '"), 'Tab primitive must support roving keyboard navigation and activation.');
assert(tabs.includes('aria-controls') && tabs.includes('aria-labelledby') && tabs.includes('tabIndex={selected ? 0 : -1}'), 'Tab primitive must link controls, panels, and roving tabindex.');

assert(index.includes("import releases from '../data/releases.json'"), 'Trust ledger must use the checked-in release data.');
for (const ledger of ['SHAFT release', 'Java baseline', 'MIT license', 'CI gate', 'Security policy', 'Release history', 'Selenium ecosystem']) assert(index.includes(ledger), `Trust ledger must include ${ledger}.`);
assert(index.includes('<details') && index.includes('View community-reported use') && index.includes('Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.'), 'Community reported use must be a native disclosure with provenance.');
for (const sponsor of ['JetBrains', 'BrowserStack', 'LambdaTest / TestMu', 'Applitools']) assert(index.includes(sponsor), `Homepage must keep verified supporter ${sponsor} separate.`);

const imagePreviews = [
  ['allure-passed-evidence', true],
  ['allure-failed-evidence', false],
  ['allure-visual-diff-evidence', false],
  ['capture-locator-picker', false],
  ['intellij-plugin-assistant', false],
];
for (const [name, hero] of imagePreviews) {
  for (const width of [480, 960]) {
    const previewPath = path.join(root, 'static', 'img', 'evidence', 'previews', `${name}-${width}.webp`);
    assert(fs.existsSync(previewPath), `${name} must ship its ${width}px WebP preview.`);
    const preview = fs.readFileSync(previewPath);
    const dimensions = webpDimensions(preview);
    assert(dimensions.width === width, `${name} ${width}px preview must preserve its declared width.`);
    assert(preview.length <= (hero ? 150 : 120) * 1024, `${name} ${width}px preview exceeds its byte budget.`);
  }
}
assert(viewer.includes('preview: string') && viewer.includes('previewSrcSet: string') && viewer.includes('previewSizes: string'), 'ProductImage must distinguish preview source, srcSet, and sizes from the original.');
assert(viewer.includes('src={item.preview}') && viewer.includes('srcSet={item.previewSrcSet}') && viewer.includes('sizes={item.previewSizes}'), 'In-page image elements must load previews responsively.');
assert(viewer.includes('items.map(({image, alt, width, height}) => ({src: image, alt, width, height}))'), 'Lightbox must retain original full-resolution sources.');
assert(viewer.includes("React.lazy(async ()") && viewer.includes("import('yet-another-react-lightbox')") && viewer.includes('maxZoomPixelRatio: 64'), 'Deep zoom must still lazy-load after activation.');
assert(packageJson.dependencies['yet-another-react-lightbox'] === '3.32.2', 'Homepage must keep the approved lightbox dependency version.');

assert(index.includes('EvidenceTrail') && !index.includes('TechnicalOrbit'), 'Hero must replace the generic orbit with a product-specific trail.');
assert(styles.includes('3.6s') && !styles.includes('infinite') && styles.includes('.evidenceTrail { display: none; }'), 'Trail must run once under four seconds and disappear for reduced motion.');
assert(styles.includes('180ms') && styles.includes('240ms'), 'Interactive transitions must stay within the approved duration range.');
assert(!/stroke-dash|transition:[^;]*(?:color|background)/.test(styles), 'Homepage must animate only transform and opacity.');
assert(styles.includes('.workflowGrid :global(.token.function)') && styles.includes('.surfacePanel :global(.token.string)') && styles.includes('.surfaceSection .eyebrow'), 'Landing code and dark-surface labels must retain tokenized contrast overrides.');
assert(!/IntersectionObserver|data-reveal|Lottie|three\.js|parallax|cursor chase|counter/.test(`${index}\n${styles}`), 'Homepage must not add forbidden animation or runtime patterns.');

assert(config.includes("content: siteAsset('/img/shaft-social-card.png')"), 'Open Graph metadata must use the deterministic SHAFT product social card.');
assert(imgbotConfig.ignoredFiles.includes('shaft-social-card.png'), 'ImgBot must ignore the deterministic social-card filename.');
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
  assert(shippedPixels.pixelHash === regeneratedPixels.pixelHash, 'The shipped social card must pixel-match generated RGBA output.');
} finally {
  fs.rmSync(socialCardTempDir, {recursive: true, force: true});
}
