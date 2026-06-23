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
const seen = new Set();

assert(catalog.length >= 300, 'Properties catalog should include the public SHAFT property set.');

for (const property of catalog) {
  const id = `${property.targetFile}:${property.key}`;
  assert(!seen.has(id), `Duplicate property entry: ${id}`);
  seen.add(id);
  assert(property.section, `Missing section for ${id}`);
  assert(property.key, `Missing key for ${id}`);
  assert(allowedTargets.has(property.targetFile), `Unexpected target file for ${id}: ${property.targetFile}`);
  assert(property.description && property.description.length > 3, `Missing description for ${id}`);
  assert(!property.sensitive || property.defaultValue === '', `Sensitive property must not publish a default: ${id}`);
}

for (const expected of [
  ['custom.properties', 'headlessExecution'],
  ['custom.properties', 'pilot.ai.enabled'],
  ['TestNG.properties', 'setParallel'],
  ['cucumber.properties', 'cucumber.execution.dry-run'],
  ['log4j2.properties', 'appender.file.fileName'],
]) {
  assert(seen.has(`${expected[0]}:${expected[1]}`), `Missing expected property ${expected.join(':')}`);
}

console.log('Properties catalog checks passed.');
