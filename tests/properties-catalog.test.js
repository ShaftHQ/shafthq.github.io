const catalog = require('../src/data/properties-catalog.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const allowedTargets = new Set([
  'custom.properties',
  'internal.properties',
  'cucumber.properties',
  'TestNG.properties',
  'log4j2.properties',
]);
const allowedTypes = new Set(['boolean', 'text', 'number']);

// This catalog is generated from the SHAFT_ENGINE Java source (see
// scripts/generate-properties-catalog.mjs) -- 405 properties at the time this floor was set.
// Keep this a floor, not an exact match: the engine gains properties over time and this test
// must not need touching on every unrelated engine release. Regenerate with
// `node scripts/generate-properties-catalog.mjs --engine-path=<path to SHAFT_ENGINE checkout>`.
assert(catalog.length >= 400, `Properties catalog should include the full SHAFT property set (got ${catalog.length}).`);

const seenKeys = new Set();
for (const property of catalog) {
  const id = `${property.targetFile}:${property.key}`;
  assert(!seenKeys.has(property.key), `Duplicate property key (keys must be globally unique): ${property.key}`);
  seenKeys.add(property.key);
  assert(property.section, `Missing section for ${id}`);
  assert(property.key, `Missing key for ${id}`);
  assert(allowedTargets.has(property.targetFile), `Unexpected target file for ${id}: ${property.targetFile}`);
  assert(allowedTypes.has(property.type), `Unexpected/missing type for ${id}: ${property.type}`);
  assert(property.description && property.description.length > 3, `Missing description for ${id}`);
  assert(!property.sensitive || property.defaultValue === '', `Sensitive property must not publish a default: ${id}`);
  assert(property.type !== 'boolean' || property.possibleValues === 'true, false', `Boolean property must have possibleValues "true, false": ${id}`);
  assert(typeof property.defaultValue === 'string', `defaultValue must be a string for ${id}`);
  assert(typeof property.possibleValues === 'string', `possibleValues must be a string for ${id}`);
}

for (const expected of [
  ['custom.properties', 'headlessExecution'],
  ['custom.properties', 'pilot.ai.enabled'],
  ['custom.properties', 'pilot.ai.gemini.model'],
  ['custom.properties', 'healing.strategy'],
  ['custom.properties', 'naturalActions.enabled'],
  ['custom.properties', 'ariaSnapshotFolderPath'],
  ['custom.properties', 'mobileSessionCacheFolderPath'],
  ['TestNG.properties', 'setParallel'],
  ['cucumber.properties', 'cucumber.execution.dry-run'],
  ['log4j2.properties', 'appender.file.fileName'],
  ['internal.properties', 'ga4ApiSecret'],
]) {
  const id = `${expected[0]}:${expected[1]}`;
  const property = catalog.find((p) => p.targetFile === expected[0] && p.key === expected[1]);
  assert(property, `Missing expected property ${id}`);
}

// Sensitive-field regression guard: these already ship non-blank Java defaults (shared demo
// credentials / real secrets) that must never be published as the catalog's suggested default.
for (const sensitiveKey of [
  'browserStack.userName', 'browserStack.accessKey', 'LambdaTest.username', 'LambdaTest.accessKey',
  'authorization', 'ga4ApiSecret', 'applitoolsApiKey', 'tinkey.kms.credentialPath',
]) {
  const property = catalog.find((p) => p.key === sensitiveKey);
  assert(property, `Missing expected sensitive property ${sensitiveKey}`);
  assert(property.sensitive === true, `${sensitiveKey} must be flagged sensitive`);
  assert(property.defaultValue === '', `${sensitiveKey} must publish a blank default, not its real value`);
}

console.log(`Properties catalog checks passed (${catalog.length} properties, ${new Set(catalog.map((p) => p.section)).size} sections).`);
