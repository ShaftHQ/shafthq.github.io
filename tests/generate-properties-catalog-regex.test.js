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
  const {parseJavaSource, isSensitive, parseMdxDefaultsTablesFromContent} = await import(modUrl);
  assert.ok(typeof parseJavaSource === 'function', 'generate-properties-catalog.mjs must export parseJavaSource for testing');
  assert.ok(typeof isSensitive === 'function', 'generate-properties-catalog.mjs must export isSensitive for testing');
  assert.ok(typeof parseMdxDefaultsTablesFromContent === 'function', 'generate-properties-catalog.mjs must export parseMdxDefaultsTablesFromContent for testing');

  // --- Regression guard: PropertiesList.mdx's section headers are `## Name` (h2), not `### Name`
  // (h3) -- confirmed unchanged back to the commit that introduced this generator (#819). A
  // section-header regex anchored on `###` never matches any section, so parseMdxDefaultsTables's
  // per-section "Default Values" table lookup is silently empty and the generator falls back to
  // humanized/javadoc descriptions for every property instead of reusing the richer hand-written
  // mdx prose it exists to reuse (see this file's own header comment, source-of-truth order #2).
  const mdxSnippet = `## Platform

- Platform properties.

<Tabs groupId="PropertyTypes" queryString="Platform">
  <TabItem value="defaults" label="Default Values">

| Property Name | Default Value | Possible Values | Description |
| -------------- | -------------- | ---------------- | ------------------------------ |
| SHAFT.CrossBrowserMode | \`off\` | \`off\`, \`sequential\` | Rich hand-written description reused from mdx. |

  </TabItem>
</Tabs>

## Web

<Tabs groupId="PropertyTypes" queryString="Web">
  <TabItem value="defaults" label="Default Values">

| Property Name | Default Value | Possible Values | Description |
| -------------- | -------------- | ---------------- | ------------------------------ |
| baseURL | \` \` | | Base URL description. |

  </TabItem>
</Tabs>
`;
  const mdxLookup = parseMdxDefaultsTablesFromContent(mdxSnippet);
  assert.strictEqual(mdxLookup.size, 2, `Expected 2 rows parsed from '## '-headed mdx sections, got ${mdxLookup.size} -- the section-header regex must match '## Name' (h2), not '### Name' (h3)`);
  assert.strictEqual(mdxLookup.get('SHAFT.CrossBrowserMode')?.description, 'Rich hand-written description reused from mdx.',
    'parseMdxDefaultsTablesFromContent must capture the Default Values row for a key under an h2 (## ) section header');

  // --- Regression guard for #829: isSensitive() flags any key containing "apikey", which wrongly
  // blanked the catalog defaultValue for Pilot's *.apiKeyEnvironmentVariable / apiKeyHeader /
  // apiKeyPrefix properties -- their real Java @DefaultValue is an env-var/header *name*
  // (OPENAI_API_KEY, Authorization, "Bearer ", ...), a credential *pointer*, not the credential
  // itself. These must NOT be flagged sensitive, across every current Pilot provider.
  for (const nonSecretKey of [
    'pilot.ai.openai.apiKeyEnvironmentVariable',
    'pilot.ai.anthropic.apiKeyEnvironmentVariable',
    'pilot.ai.gemini.apiKeyEnvironmentVariable',
    'pilot.ai.github.apiKeyEnvironmentVariable',
    'pilot.ai.ollama.apiKeyEnvironmentVariable',
    'pilot.ai.ollama.apiKeyHeader',
    'pilot.ai.ollama.apiKeyPrefix',
  ]) {
    assert.strictEqual(isSensitive(nonSecretKey), false,
      `${nonSecretKey} references where a credential lives (env var/header/prefix name), not the credential itself -- must not be flagged sensitive (#829)`);
  }

  // Genuine secret-valued keys must still be blanked -- this fix must not weaken real detection.
  for (const secretKey of [
    'applitoolsApiKey', 'browserStack.accessKey', 'browserStack.userName', 'LambdaTest.accessKey',
    'ga4ApiSecret', 'authorization', 'tinkey.kms.credentialPath',
  ]) {
    assert.strictEqual(isSensitive(secretKey), true,
      `${secretKey} holds/points at a genuine credential and must still be flagged sensitive`);
  }

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
