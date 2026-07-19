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

// Non-sensitive numeric token-count regression guard: these contain "token" in their key name but are
// purely numeric token-count limits with real numeric defaults that should NOT be blanked or marked sensitive.
// Regression for issue #3717: refined sensitivity heuristic to exclude numeric token-count keys.
for (const [tokenCountKey, expectedDefault, expectedType] of [
  ['pilot.ai.maxInputTokens', '16000', 'number'],
  ['pilot.ai.maxOutputTokens', '2000', 'number'],
]) {
  const property = catalog.find((p) => p.key === tokenCountKey);
  assert(property, `Missing expected non-sensitive numeric property ${tokenCountKey}`);
  assert(property.sensitive !== true, `${tokenCountKey} must NOT be flagged sensitive (it is a numeric token count, not a credential)`);
  assert(property.defaultValue === expectedDefault, `${tokenCountKey} must publish its real numeric default '${expectedDefault}', got '${property.defaultValue}'`);
  assert(property.type === expectedType, `${tokenCountKey} must have type '${expectedType}', got '${property.type}'`);
}

// Non-sensitive credential-pointer regression guard for #829: these keys contain "apikey" but
// hold the *name* of an environment variable/header/prefix that points at a credential, not the
// credential itself, so their real Java defaults must be published, not blanked.
for (const [pointerKey, expectedDefault] of [
  ['pilot.ai.openai.apiKeyEnvironmentVariable', 'OPENAI_API_KEY'],
  ['pilot.ai.anthropic.apiKeyEnvironmentVariable', 'ANTHROPIC_API_KEY'],
  ['pilot.ai.gemini.apiKeyEnvironmentVariable', 'GEMINI_API_KEY'],
  ['pilot.ai.github.apiKeyEnvironmentVariable', 'GITHUB_TOKEN'],
  ['pilot.ai.ollama.apiKeyHeader', 'Authorization'],
  ['pilot.ai.ollama.apiKeyPrefix', 'Bearer '],
]) {
  const property = catalog.find((p) => p.key === pointerKey);
  assert(property, `Missing expected non-sensitive credential-pointer property ${pointerKey}`);
  assert(property.sensitive !== true, `${pointerKey} must NOT be flagged sensitive (#829): it names where a credential lives, not the credential itself`);
  assert(property.defaultValue === expectedDefault, `${pointerKey} must publish its real default '${expectedDefault}', got '${property.defaultValue}'`);
}

// Lazy-loading readiness properties shipped by SHAFT_ENGINE #3775 (layered JS + advisory BiDi
// readiness, and the explicit scrollToLoadAll() scroll sweep) must be present with their defaults.
for (const [lazyKey, expectedDefault] of [
  ['waitForLazyLoadingTimeout', '30'],
  ['lazyLoadingPollingIntervalMillis', '200'],
  ['lazyLoadingDomStabilityQuietWindowMillis', '0'],
  ['lazyLoadingScrollSweepMaxSteps', '20'],
]) {
  const property = catalog.find((p) => p.key === lazyKey);
  assert(property, `Missing expected lazy-loading property ${lazyKey} (SHAFT_ENGINE #3775)`);
  assert(property.defaultValue === expectedDefault, `${lazyKey} must publish its real default '${expectedDefault}', got '${property.defaultValue}'`);
}

console.log(`Properties catalog checks passed (${catalog.length} properties, ${new Set(catalog.map((p) => p.section)).size} sections).`);
