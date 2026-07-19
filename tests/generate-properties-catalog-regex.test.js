// Pins the @Key/@DefaultValue getter-extraction behavior of
// scripts/generate-properties-catalog.mjs's parseJavaSource() against a representative Java
// snippet, and proves the propertyRe regex (line ~242) no longer exhibits the exponential
// backtracking CodeQL flagged (js/redos, HIGH) on comment/blank-line runs between
// @DefaultValue(...) and the getter it decorates.
//
// Regression guard for the two CodeQL js/redos alerts on generate-properties-catalog.mjs:242 --
// "may cause exponential backtracking on strings starting with '@Key("")\n@DefaultValue(A)\n//'
// and containing many repetitions of '\t\n//'" (and the same for '\t\n' alone).

const assert = require('node:assert');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

async function main() {
  const modUrl = pathToFileURL(path.join(__dirname, '..', 'scripts', 'generate-properties-catalog.mjs')).href;
  const {parseJavaSource} = await import(modUrl);
  assert.ok(typeof parseJavaSource === 'function', 'generate-properties-catalog.mjs must export parseJavaSource for testing');

  // --- Behavioral pinning: representative snippet covering the exact shape CodeQL's alert
  // targets -- a `//` line comment between `@DefaultValue(...)` and the getter -- plus a blank
  // line + extra annotation between them, plus a plain adjacent getter with no gap at all.
  const snippet = `package com.shaft.properties.internal;

public interface TestSection extends EngineProperties<TestSection> {
    /**
     * @return whether headless mode is enabled.
     */
    @Key("headlessExecution")
    @DefaultValue("false")
    // legacy flag, kept for backward compatibility
    boolean headlessExecution();

    @Key("retry.count")
    @DefaultValue("3")

    @Deprecated
    int retryCount();

    @Key("browser.name")
    @DefaultValue("chrome")
    String browserName();
}
`;

  const {interfaceName, properties} = parseJavaSource(snippet);
  assert.strictEqual(interfaceName, 'TestSection', `Expected interface name 'TestSection', got '${interfaceName}'`);
  assert.strictEqual(properties.length, 3, `Expected 3 extracted properties, got ${properties.length}: ${JSON.stringify(properties.map((p) => p.key))}`);

  const [headless, retry, browser] = properties;

  assert.strictEqual(headless.key, 'headlessExecution');
  assert.strictEqual(headless.defaultValue, 'false');
  assert.strictEqual(headless.type, 'boolean');
  assert.strictEqual(headless.javadocDescription, 'Whether headless mode is enabled.',
    `Javadoc @return description must survive the comment line between @DefaultValue and the getter, got '${headless.javadocDescription}'`);

  assert.strictEqual(retry.key, 'retry.count');
  assert.strictEqual(retry.defaultValue, '3');
  assert.strictEqual(retry.type, 'number',
    'A blank line + @Deprecated annotation between @DefaultValue and the getter must still be skipped');

  assert.strictEqual(browser.key, 'browser.name');
  assert.strictEqual(browser.defaultValue, 'chrome');
  assert.strictEqual(browser.type, 'text');

  // --- ReDoS regression guard: CodeQL's exact adversarial shapes must resolve in linear time,
  // not blow up exponentially. The unfixed regex took ~400ms at n=20 reps and >8s at n=25; a
  // linear-time regex resolves n=200 in low single-digit milliseconds. No terminating getter, so
  // the engine is forced through the full non-match path -- worst case for a vulnerable regex.
  for (const filler of ['\t\n//', '\t\n']) {
    const adversarial = '@Key("")\n@DefaultValue(A)\n' + filler.repeat(200);
    const start = process.hrtime.bigint();
    const result = parseJavaSource(`public interface Adversarial extends EngineProperties<Adversarial> {\n${adversarial}\n}`);
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    assert.ok(ms < 2000, `parseJavaSource must resolve the '${JSON.stringify(filler)}' x200 adversarial input in well under 2s (linear time); took ${ms.toFixed(1)}ms -- exponential backtracking regression`);
    assert.strictEqual(result.properties.length, 0, 'Adversarial snippet has no valid getter and must simply fail to match, not hang');
  }

  console.log('generate-properties-catalog regex extraction + ReDoS regression checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
