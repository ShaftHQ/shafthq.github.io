const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const managedPreviewStart = '<!-- managed-ocr-preview:start -->';
const managedPreviewEnd = '<!-- managed-ocr-preview:end -->';
const managedPreviewPages = [
  'docs/start/local-infrastructure.mdx',
  'docs/integrations/ocr.md',
];
const currentGuidanceFiles = [
  'docs/features/modules.md',
  'docs/integrations/ocr.md',
  'docs/reference/properties/PropertiesList.mdx',
  'docs/start/local-infrastructure.mdx',
  'docs/testing/mobile.md',
  'src/data/properties-catalog.json',
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function splitPreview(relativePath) {
  const content = read(relativePath);
  const start = content.indexOf(managedPreviewStart);
  const end = content.indexOf(managedPreviewEnd);
  assert(start >= 0 && end > start,
    `${relativePath} must bound unavailable managed OCR setup guidance with preview markers.`);
  return {
    current: content.slice(0, start) + content.slice(end + managedPreviewEnd.length),
    preview: content.slice(start + managedPreviewStart.length, end),
  };
}

const splitPages = new Map(managedPreviewPages.map((file) => [file, splitPreview(file)]));
const currentByFile = new Map(currentGuidanceFiles.map((file) => {
  const content = splitPages.has(file) ? splitPages.get(file).current : read(file);
  return [file, content];
}));
const currentGuidance = currentGuidanceFiles.map((file) => {
  const content = currentByFile.get(file);
  return `\n<!-- ${file} -->\n${content}`;
}).join('\n');

assert(!/--profile\s+OCR/.test(currentGuidance),
  'Executable OCR setup commands must not appear in current guidance before release.');
assert(!/SetupSelection/.test(currentGuidance),
  'The unreleased selection-aware Java API must appear only inside marked preview guidance.');
assert(!/Managed installation is currently available[^.]*\bOCR\b/s.test(currentGuidance),
  'Current guidance must not claim that managed OCR installation is available.');
assert(!/missing models? (?:still )?require(?:s)? (?:an )?(?:explicitly )?reviewed setup/i.test(currentGuidance),
  'Current OCR property guidance must retain the released first-use download behavior.');

const ocrGuide = currentByFile.get('docs/integrations/ocr.md');
assert.match(ocrGuide, /:::warning\[Preview: module not released\]/,
  'The OCR guide must visibly identify the module itself as unreleased.');
assert.match(ocrGuide, /not included in the\s+current published SHAFT release/i,
  'The OCR guide must state that no current release contains shaft-ocr.');
assert(ocrGuide.indexOf('Preview: module not released') < ocrGuide.indexOf('## Add the module'),
  'The module-release warning must appear before dependency instructions.');

const moduleGuide = currentByFile.get('docs/features/modules.md');
const publishedArtifactMap = moduleGuide.slice(
  moduleGuide.indexOf('## Published artifact map'),
  moduleGuide.indexOf('## Feature-to-module map'));
assert(!publishedArtifactMap.includes('| `shaft-ocr` |'),
  'The published artifact map must not list unreleased shaft-ocr.');
assert.match(moduleGuide, /shaft-ocr[^\n]*unreleased preview/i,
  'The module guide must label shaft-ocr as an unreleased preview.');

for (const [file, {preview}] of splitPages) {
  assert.match(preview, /^## Preview: managed OCR setup$/m,
    `${file} must render a dedicated managed OCR preview heading.`);
  assert.match(preview, /:::warning\[Not released\]/,
    `${file} must render the preview in a warning titled "Not released".`);
  assert.match(preview, /not (?:yet )?(?:available|released)/i,
    `${file} must state that its commands and APIs are not currently available.`);
  assert.match(preview, /shaft-cli setup plan --profile OCR/,
    `${file} must retain the future CLI planning workflow inside its preview.`);
  assert.match(preview, /shaft-cli setup install --plan/,
    `${file} must retain the future reviewed CLI installation workflow inside its preview.`);
  assert.match(preview, /shaft-cli setup verify --profile OCR/,
    `${file} must retain the future CLI verification workflow inside its preview.`);
}

const ocrPreview = splitPages.get('docs/integrations/ocr.md').preview;
assert.match(ocrPreview, /SetupSelection/,
  'The future selection-aware Java workflow must remain documented inside the preview.');
const selectionWorkflow = ocrPreview.slice(ocrPreview.indexOf('SetupSelection'));
for (const operation of ['plan', 'status', 'verify', 'install']) {
  assert(selectionWorkflow.includes(`SHAFT.Infrastructure.${operation}`),
    `The future selection-aware Java workflow must retain SHAFT.Infrastructure.${operation}.`);
}
assert.match(splitPages.get('docs/start/local-infrastructure.mdx').preview,
  /current OCR first-use model flow/,
  'The infrastructure preview must route current users to executable OCR guidance.');

assert.match(ocrGuide,
  /downloads?\s+missing\s+models?\s+on\s+first\s+use/i,
  'The OCR guide must explain the current first-use model download behavior.');
const mobileGuide = currentByFile.get('docs/testing/mobile.md');
assert.match(mobileGuide,
  /downloads?\s+missing\s+pinned\s+models?\s+on\s+first\s+use/i,
  'The mobile guide must retain an executable current OCR cache-warmup path.');
assert.match(mobileGuide, /unreleased source-preview OCR runtime/i,
  'The mobile guide must label its OCR runtime workflow as an unreleased source preview.');
assert.match(mobileGuide, /only for source-build evaluation[\s\S]*containing SHAFT release is published/i,
  'The mobile guide must prevent released-project use before a containing release.');
assert.match(currentByFile.get('docs/reference/properties/PropertiesList.mdx'),
  /shaft\.ocr\.downloadEnabled[^\n]*Allows[^\n]*download/i,
  'The property reference must describe current download consent accurately.');

const catalog = JSON.parse(currentByFile.get('src/data/properties-catalog.json'));
const downloadProperty = catalog.find((property) =>
  property.section === 'Ocr' && property.key === 'shaft.ocr.downloadEnabled');
assert(downloadProperty, 'The generated catalog must include shaft.ocr.downloadEnabled.');
assert.match(downloadProperty.description, /Allows[^.]*download/i,
  'The generated catalog must describe current download consent accurately.');

console.log('OCR documentation release contract checks passed.');
