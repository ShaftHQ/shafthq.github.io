#!/usr/bin/env node
// Generates src/data/properties-catalog.json from the SHAFT_ENGINE Java source of truth:
// shaft-engine/src/main/java/com/shaft/properties/internal/*.java (@Key / @DefaultValue getters).
//
// This is a maintainer-run refresh tool, not a build step (the docs site build does not depend
// on a sibling engine checkout). Run it whenever engine properties change:
//
//   node scripts/generate-properties-catalog.mjs [--engine-path=<path>] [--check]
//
// --check: do not write the file; exit non-zero if the generated catalog would differ from the
//          committed one (used by tests/properties-catalog.test.js to catch drift in CI).
//
// Source-of-truth order, most to least authoritative:
//   1. Java @Key/@DefaultValue getters in shaft-engine/.../properties/internal/*.java -- structural
//      guarantee of full coverage; this is what SHAFT.Properties.* actually reads.
//   2. docs/reference/properties/PropertiesList.mdx "Default Values" tables -- richer hand-written
//      prose descriptions/possibleValues, reused when present instead of discarded.
//   3. Java Javadoc on the getter, when mdx has no row for that key.
//   4. A tiny manual overrides map below, for the handful of properties with neither (see
//      MANUAL_DESCRIPTIONS). Kept short and printed on every run so drift here stays visible.

import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(REPO_ROOT, 'src', 'data', 'properties-catalog.json');
const PROPERTIES_LIST_MDX = path.join(REPO_ROOT, 'docs', 'reference', 'properties', 'PropertiesList.mdx');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const engineArg = args.find((a) => a.startsWith('--engine-path='));
const ENGINE_PROPERTIES_DIR = engineArg
  ? path.resolve(REPO_ROOT, engineArg.slice('--engine-path='.length))
  : path.resolve(
      process.env.SHAFT_ENGINE_PATH ?? path.join(REPO_ROOT, '..', 'SHAFT_ENGINE'),
      'shaft-engine', 'src', 'main', 'java', 'com', 'shaft', 'properties', 'internal',
    );

// True only when this file is run directly (`node scripts/generate-properties-catalog.mjs`), not
// when imported as a module (e.g. by tests/generate-properties-catalog-regex.test.js, which needs
// parseJavaSource without requiring a sibling SHAFT_ENGINE checkout or writing the catalog file).
const isMainModule = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule && !existsSync(ENGINE_PROPERTIES_DIR)) {
  console.error(`Cannot find the SHAFT_ENGINE properties source directory:\n  ${ENGINE_PROPERTIES_DIR}\n`
    + 'Pass --engine-path=<path to shaft-engine/src/main/java/com/shaft/properties/internal>, or set '
    + 'SHAFT_ENGINE_PATH to the SHAFT_ENGINE checkout root, or run this next to a sibling SHAFT_ENGINE checkout.');
  process.exit(1);
}

// Section display-name overrides for interfaces whose class name isn't already a good label.
const SECTION_NAME_OVERRIDES = {
  NaturalActions: 'Natural Actions',
};

// Section order mirrors PropertiesList.mdx today, with Pilot appended (it has no section there
// yet -- see design/properties-generator.md §2/§6 and the follow-up issue filed alongside this).
const SECTION_ORDER = [
  'Platform', 'Web', 'Playwright', 'Mobile', 'API', 'Capture', 'Flags', 'Reporting', 'Allure',
  'Timeouts', 'Visuals', 'Jira', 'Cucumber', 'Healenium', 'Healing', 'Natural Actions', 'Pilot',
  'Paths', 'Pattern', 'Tinkey', 'Internal', 'BrowserStack', 'LambdaTest', 'Performance', 'TestNG',
  'Log4j',
];

// Properties consumed directly by a third-party library / bootstrap step (Cucumber's own
// ConfigurationOptions, testng.xml wiring, Log4j2's own config loader) or read before the
// generic folder-merge runs (Internal), so they must live in their own named file. Every other
// interface's properties are folder-merged into System properties by
// PropertyFileManager.readPropertyFiles before OWNER resolves anything, so "custom.properties"
// (or literally any *.properties file in the folder) works for them -- see design doc §2 and
// PropertyFileManager.java:256-314 in the engine.
const FILE_ONLY_TARGETS = {
  Cucumber: 'cucumber.properties',
  TestNG: 'TestNG.properties',
  Log4j: 'log4j2.properties',
  Internal: 'internal.properties',
};
const DEFAULT_TARGET_FILE = 'custom.properties';

// @DefaultValue arguments that aren't a plain string literal (a static field reference instead).
const DEFAULT_VALUE_CONSTANTS = {
  'AutomationName.ANDROID_UIAUTOMATOR2': 'UiAutomator2',
};

// Keys with neither an mdx "Default Values" row nor Javadoc to source a description from.
// Kept intentionally small -- each one is a real coverage gap in PropertiesList.mdx today.
const MANUAL_DESCRIPTIONS = {
  'recovery-tries': 'Number of Healenium self-healing recovery attempts before giving up on a broken locator.',
  'score-cap': 'Minimum Healenium similarity score (0.0-1.0) required to accept a healed locator candidate.',
  'heal-enabled': 'Enables the Healenium self-healing proxy for this run.',
  'serverHost': 'Hostname of the Healenium server that scores locator-healing candidates.',
  'serverPort': 'Port of the Healenium server that scores locator-healing candidates.',
  'imitatePort': 'Local port SHAFT points the browser at to imitate the real Selenium server so Healenium can intercept traffic.',
  'ariaSnapshotFolderPath': 'Folder that holds saved ARIA-snapshot baselines used for accessibility-tree comparisons; regenerate with -Dshaft.updateSnapshots=true.',

  // Log4j2 is a standard third-party config surface with no per-property Javadoc in Log4j.java
  // and only a handful of rows documented in PropertiesList.mdx's Log4j table.
  'name': 'Log4j2 configuration name, used internally as this configuration\'s identifier.',
  'appender.console.type': 'Log4j2 appender type for the console output target (Console).',
  'appender.console.name': 'Reference name of the console appender, used by rootLogger and other loggers to attach to it.',
  'appender.console.layout.type': 'Log4j2 layout implementation used to format console log lines (PatternLayout).',
  'appender.console.layout.disableAnsi': 'Disables ANSI color codes in console log output.',
  'appender.console.layout.noConsoleNoAnsi': 'Automatically disables ANSI colors when output isn\'t attached to a real console (e.g. redirected to a file).',
  'appender.console.layout.charset': 'Character encoding used when writing console log output.',
  'appender.console.filter.threshold.type': 'Log4j2 filter type applied to the console appender (ThresholdFilter).',
  'appender.console.filter.threshold.level': 'Minimum log level written to the console; messages below this level are suppressed.',
  'appender.file.type': 'Log4j2 appender type for the rolling log file (RollingFile).',
  'appender.file.name': 'Reference name of the file appender, used by rootLogger and other loggers to attach to it.',
  'appender.file.fileName': 'Path to the active log file that SHAFT writes execution logs to.',
  'appender.file.layout.type': 'Log4j2 layout implementation used to format file log lines (PatternLayout).',
  'appender.file.layout.pattern': 'Log4j2 PatternLayout string controlling the format of each file log line.',
  'appender.file.layout.charset': 'Character encoding used when writing the log file.',
  'appender.file.filter.threshold.type': 'Log4j2 filter type applied to the file appender (ThresholdFilter).',
  'appender.file.filter.threshold.level': 'Minimum log level written to the log file; messages below this level are suppressed.',
  'logger.app.name': 'Fully qualified logger name whose level is overridden by logger.app.level (defaults to a noisy third-party logger).',
  'logger.app.level': 'Log level applied to the logger named by logger.app.name, used to quiet noisy third-party libraries.',

  'platformName': 'Raw Appium platformName capability (e.g. Android, iOS). Usually derived automatically from targetOperatingSystem; set this to override it directly.',

  'testDataColumnNamePrefix': 'Prefix used when naming generated data-provider parameters in test reports.',
  'allure.link.issue.pattern': 'URL pattern used to turn @Issue/@Issues annotation values into clickable links in the Allure report; use {} as the issue-ID placeholder.',

  'shaft.trace.includeDomSnapshots': 'Include DOM snapshots in the SHAFT failure trace bundle when available.',
  'shaft.trace.includeScreenshots': 'Include screenshots in the SHAFT failure trace bundle when available.',

  'setParallel': 'TestNG parallel execution mode (maps to the generated suite\'s parallel attribute).',
  'setParallelMode': 'Selects how setThreadCount is applied: STATIC uses it as-is, DYNAMIC multiplies it by the available processor cores.',
  'setVerbose': 'TestNG verbose logging level for the generated suite (0 = silent).',
  'setPreserveOrder': 'Preserve declaration order of test methods/classes instead of TestNG\'s default ordering.',
  'setGroupByInstances': 'Group parallel test methods by instance instead of running them independently.',
  'setDataProviderThreadCount': 'Number of threads TestNG uses to run @DataProvider-fed test invocations in parallel.',

  'tinkey.keysetFilename': 'Path to the Google Tink keyset file used to encrypt/decrypt sensitive test data.',
  'tinkey.kms.serverType': 'Key Management Service provider backing the Tink keyset (e.g. gcp-kms, aws-kms).',
  'tinkey.kms.credentialPath': 'Path to the KMS provider credential file used to access the remote master key.',
  'tinkey.kms.masterKeyUri': 'URI of the remote KMS master key used to encrypt/decrypt the local Tink keyset.',

  'shaft.updateSnapshots': 'When true, regenerates visual and ARIA-snapshot baselines instead of comparing new captures against the existing ones.',
};

// Sensitive-field detection: EngineProperties.maskSensitiveValue's own substrings (password,
// secret, token, accesskey/access_key, apikey/api_key, uuid) plus a few more that the *existing*
// hand-maintained catalog already treats as sensitive even though the Java defaults aren't blank
// (browserStack.userName/accessKey ship a shared demo-account value) -- see design doc §2.
const SENSITIVE_SUBSTRINGS = [
  'password', 'secret', 'token', 'accesskey', 'access_key', 'apikey', 'api_key', 'uuid',
  'username', 'authorization', 'credential',
];

// Non-sensitive allowlist: keys containing sensitive substrings (e.g. "token") that are purely
// numeric token-count limits or similar non-secret numeric properties, not credentials.
// Regression fix for #3717: pilot.ai.maxInputTokens and pilot.ai.maxOutputTokens must not be
// blanked or flagged sensitive, as they are numeric configuration values, not credentials.
const NON_SENSITIVE_ALLOWLIST = [
  'pilot.ai.maxInputTokens',
  'pilot.ai.maxOutputTokens',
];

// Credential-pointer suffixes: a key ending in one of these names *references* where a secret
// lives (an environment-variable name, an HTTP header name, a header-value prefix) rather than
// holding the secret itself, so it matches the "apikey" substring above without being one.
// Regression fix for #829: the Pilot pilot.ai.<provider>.apiKeyEnvironmentVariable / .apiKeyHeader
// / .apiKeyPrefix properties default to real, non-secret values (env-var names like
// OPENAI_API_KEY, header names like Authorization, prefixes like "Bearer ") that must not be
// blanked. Suffix-based (not a per-provider allowlist) so it covers every current and future
// Pilot provider without needing an entry per provider.
const NON_SENSITIVE_KEY_SUFFIXES = [
  'apiKeyEnvironmentVariable',
  'apiKeyHeader',
  'apiKeyPrefix',
];

export function isSensitive(key) {
  // Check allowlist first: these keys match a sensitive substring but are not sensitive
  if (NON_SENSITIVE_ALLOWLIST.includes(key)) {
    return false;
  }
  if (NON_SENSITIVE_KEY_SUFFIXES.some((suffix) => key.endsWith(suffix))) {
    return false;
  }
  const lower = key.toLowerCase();
  return SENSITIVE_SUBSTRINGS.some((needle) => lower.includes(needle));
}

function displaySection(interfaceName) {
  return SECTION_NAME_OVERRIDES[interfaceName] ?? interfaceName;
}

function targetFileFor(interfaceName) {
  return FILE_ONLY_TARGETS[interfaceName] ?? DEFAULT_TARGET_FILE;
}

function stripJavadocMarkup(text) {
  return text
    // {@code X} / {@link X} / {@return X} -> X
    .replace(/\{@(?:code|link|linkplain)\s+([^}]+)\}/gu, '$1')
    .replace(/\{@return\s+([^}]+)\}/gu, '$1')
    .replace(/<\/?(?:p|ul|ol|li|b|strong|em|i|pre|code)\s*>/giu, ' ')
    .replace(/<a\s+href="[^"]*"[^>]*>([^<]*)<\/a>/giu, '$1')
    .replace(/&gt;/gu, '>').replace(/&lt;/gu, '<').replace(/&amp;/gu, '&')
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * Extracts a one-sentence description from a raw `/** ... *\/` Javadoc block: prefers an
 * `@return` line's text (or a `{@return ...}` inline short form), falls back to the first
 * sentence of the block, dropping `<p>`-separated property-key/default boilerplate lines.
 */
function descriptionFromJavadoc(rawJavadoc) {
  if (!rawJavadoc) return '';
  // Trim fully (not just trailing) so single-line `/** @return X */` blocks -- whose content
  // never had a leading " * " continuation marker to strip -- don't leave stray indentation that
  // stops the "^@return" anchor below from matching.
  const lines = rawJavadoc.split('\n').map((l) => l.replace(/^\s*\*\s?/u, '').trim());
  const returnLine = lines.find((l) => /^@return\b/u.test(l));
  if (returnLine) {
    const text = stripJavadocMarkup(returnLine.replace(/^@return\s*/u, ''));
    if (text) return capitalizeSentence(text);
  }
  // {@return ...} short form embedded in a one-line block.
  const inlineReturn = rawJavadoc.match(/\{@return\s+([^}]+)\}/u);
  if (inlineReturn) {
    const text = stripJavadocMarkup(inlineReturn[1]);
    if (text) return capitalizeSentence(text);
  }
  const meaningful = lines
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('@') && !/^Property key:/u.test(l));
  if (meaningful.length > 0) {
    const text = stripJavadocMarkup(meaningful.join(' ')).split(/(?<=[.!?])\s/u)[0];
    if (text) return capitalizeSentence(text);
  }
  return '';
}

function capitalizeSentence(text) {
  const trimmed = text.trim().replace(/\s+/gu, ' ');
  if (!trimmed) return '';
  const withCase = /^[a-z]/u.test(trimmed) ? trimmed[0].toUpperCase() + trimmed.slice(1) : trimmed;
  return /[.!?]$/u.test(withCase) ? withCase : `${withCase}.`;
}

// Zero-arg getters only (setters in the nested *SetProperty class all take one argument, so
// the empty-parens anchor naturally excludes them without needing to bound the scan by class).
//
// The gap between `@DefaultValue(...)` and the annotation/type that follows -- optional blank
// lines and `//` line comments -- used to be `(?:[ \t]*\r?\n[ \t]*(?:\/\/[^\r\n]*)?)*`. Each
// repetition had its own leading *and* trailing `[ \t]*` either side of the mandatory `\r?\n`, so
// a run of tabs sitting between two newlines could be attributed to the trailing half of one
// repetition or the leading half of the next in 2^n equivalent ways for n tabs -- classic
// overlapping-quantifier ReDoS (CodeQL js/redos, generate-properties-catalog.mjs:242). Every one
// of those splits reaches the same total match, so the engine only discovers that after trying
// them all, which is exponential when the overall match ultimately fails (e.g. a genuinely
// malformed/adversarial run with no terminating getter).
//
// Fixed shape: `(?:[ \t]*(?:\/\/[^\r\n]*)?\r?\n)*` consumes indent, optional comment, and the
// newline that ends *that same line* in one repetition, so each repetition's boundary is pinned
// to a `\r?\n` it alone owns -- the next repetition's indent starts strictly after that newline
// and can never re-claim characters the previous repetition already consumed. That removes the
// combinatorial choice while matching the identical total span (any leftover indentation on the
// following line is absorbed by the `[ \t]*` immediately after this group -- deliberately *not*
// `\s*`, since `\s*` also matches `\r?\n` and would reopen the same kind of overlap with this
// group's own newline-consuming loop, which showed up as quadratic -- not exponential, but still
// avoidable -- blowup on long comment-free blank-line runs during verification).
const propertyRe = /@Key\(\s*"((?:\\.|[^"\\])*)"\s*\)\s*\r?\n\s*@DefaultValue\(\s*(?:"((?:\\.|[^"\\])*)"|([A-Za-z_][\w.]*))\s*\)((?:[ \t]*(?:\/\/[^\r\n]*)?\r?\n)*)[ \t]*(?:@\w+(?:\([^)]*\))?[ \t]*\r?\n[ \t]*)*(?:private\s+)?(boolean|Boolean|int|Integer|long|Long|double|float|String)\s+([A-Za-z_]\w*)\s*\(\s*\)\s*;/gu;

/** Parses one interface file's `@Key`/`@DefaultValue` getters, in source order (pure -- no I/O). */
export function parseJavaSource(content) {
  const interfaceMatch = content.match(/public interface (\w+)\s+extends EngineProperties</u);
  if (!interfaceMatch) return {interfaceName: null, properties: []};
  const interfaceName = interfaceMatch[1];

  // All `/** ... */` blocks with their end offsets, to find each getter's "adjacent" javadoc.
  const javadocBlocks = [];
  const javadocRe = /\/\*\*([\s\S]*?)\*\//gu;
  let jd;
  while ((jd = javadocRe.exec(content)) !== null) {
    javadocBlocks.push({text: jd[1], start: jd.index, end: jd.index + jd[0].length});
  }

  const properties = [];
  propertyRe.lastIndex = 0;
  let m;
  while ((m = propertyRe.exec(content)) !== null) {
    const [full, key, quotedDefault, constDefault, , returnType, methodName] = m;
    const rawDefault = quotedDefault ?? DEFAULT_VALUE_CONSTANTS[constDefault] ?? constDefault ?? '';
    if (constDefault !== undefined && !(constDefault in DEFAULT_VALUE_CONSTANTS)) {
      console.warn(`  ! unresolved @DefaultValue constant "${constDefault}" for ${interfaceName}.${key} -- add it to DEFAULT_VALUE_CONSTANTS`);
    }

    // Nearest javadoc block that ends before this match and has nothing but blank lines /
    // single-line annotations between it and the @Key.
    const matchStart = m.index;
    let javadoc = '';
    for (let i = javadocBlocks.length - 1; i >= 0; i -= 1) {
      const block = javadocBlocks[i];
      if (block.end > matchStart) continue;
      const between = content.slice(block.end, matchStart);
      if (/^(?:[ \t]*\r?\n|[ \t]*@\w+(?:\([^)]*\))?[ \t]*\r?\n)*[ \t]*$/u.test(between)) {
        javadoc = block.text;
      }
      break;
    }

    properties.push({
      interfaceName,
      key,
      defaultValue: rawDefault,
      type: returnType === 'boolean' || returnType === 'Boolean' ? 'boolean'
        : returnType === 'String' ? 'text' : 'number',
      javadocDescription: descriptionFromJavadoc(javadoc),
      sourceOrder: matchStart,
    });
    void full; void methodName;
  }
  return {interfaceName, properties};
}

/** Reads one interface file from disk and parses it via parseJavaSource. */
function parseJavaFile(filePath) {
  return parseJavaSource(readFileSync(filePath, 'utf8'));
}

/** Reads PropertiesList.mdx from disk and parses it via parseMdxDefaultsTablesFromContent. */
function parseMdxDefaultsTables(mdxPath) {
  return parseMdxDefaultsTablesFromContent(readFileSync(mdxPath, 'utf8'));
}

/**
 * Parses PropertiesList.mdx's per-section "Default Values" GFM tables into a key -> row map
 * (pure -- no I/O, exported for testing). Section headers in PropertiesList.mdx are `## Name`
 * (h2, one level below the page's own h1 title) -- e.g. `## Platform`, `## Timeouts`.
 */
export function parseMdxDefaultsTablesFromContent(content) {
  const lookup = new Map();
  const sectionRe = /^## .+$/gmu;
  const sectionStarts = [...content.matchAll(sectionRe)].map((mm) => mm.index);
  sectionStarts.push(content.length);

  for (let s = 0; s < sectionStarts.length - 1; s += 1) {
    const sectionText = content.slice(sectionStarts[s], sectionStarts[s + 1]);
    // Match everything up to the closing </TabItem> rather than anchoring on an exact blank-line
    // shape: some "blank" separator lines in this file are CRLF + trailing spaces, not truly
    // empty, which breaks a strict \n\n anchor. Table rows are filtered out below instead.
    const tabMatch = sectionText.match(/label="Default Values">([\s\S]*?)<\/TabItem>/u);
    if (!tabMatch) continue;
    const rows = tabMatch[1].split(/\r?\n/u).filter((l) => l.trim().startsWith('|'));
    if (rows.length < 2) continue;
    const header = splitRow(rows[0]);
    const descIdx = header.length - 1;
    const possibleIdx = header.findIndex((h) => /possible values/iu.test(h));
    for (const row of rows.slice(2)) {
      const cells = splitRow(row);
      if (cells.length < 2) continue;
      const key = cleanCell(cells[0]);
      if (!key) continue;
      lookup.set(key, {
        description: cleanCell(cells[descIdx] ?? ''),
        possibleValues: possibleIdx >= 0 ? cleanCell(cells[possibleIdx] ?? '') : '',
      });
    }
  }
  return lookup;
}

function splitRow(row) {
  const trimmed = row.trim().replace(/^\|/u, '').replace(/\|$/u, '');
  const cells = [];
  let depth = 0;
  let current = '';
  let prevChar = '';
  for (const ch of trimmed) {
    if (ch === '<') depth += 1;
    if (ch === '>') depth = Math.max(0, depth - 1);
    // A `\|` inside a cell (e.g. a literal pipe embedded in a log pattern string) is an escaped
    // separator, not a real column boundary -- GFM table syntax for a literal pipe character.
    if (ch === '|' && depth === 0 && prevChar !== '\\') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
    prevChar = ch;
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

function cleanCell(cell) {
  return cell
    // mdx joins multiple "• sentence" bullets with <br/> inside one table cell; flattened to a
    // single-line description, the bullet markers are noise once <br/> is no longer a real
    // line break -- drop them entirely rather than leaving a stray leading/mid-sentence "•".
    .replace(/<br\s*\/?>/giu, ' ')
    .replace(/•\s*/gu, '')
    .replace(/<a\s+href="[^"]*"[^>]*>([^<]*)<\/a>/giu, '$1')
    .replace(/<\/?(?:p|ul|ol|li|b|strong|em|i)\s*>/giu, ' ')
    .replace(/&gt;/gu, '>').replace(/&lt;/gu, '<').replace(/&amp;/gu, '&')
    .replace(/\\\|/gu, '|')
    .replace(/`/gu, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/\s+/gu, ' ')
    .trim();
}

function buildCatalog() {
  const javaFiles = readdirSync(ENGINE_PROPERTIES_DIR).filter((f) => f.endsWith('.java')).sort();
  const mdxLookup = existsSync(PROPERTIES_LIST_MDX) ? parseMdxDefaultsTables(PROPERTIES_LIST_MDX) : new Map();
  if (!existsSync(PROPERTIES_LIST_MDX)) {
    console.warn(`! PropertiesList.mdx not found at ${PROPERTIES_LIST_MDX}; descriptions will fall back to Javadoc/manual only.`);
  }

  const bySection = new Map();
  const usedManualOrFallback = [];
  const seenKeys = new Map();

  for (const file of javaFiles) {
    const {interfaceName, properties} = parseJavaFile(path.join(ENGINE_PROPERTIES_DIR, file));
    if (!interfaceName || properties.length === 0) continue;

    const section = displaySection(interfaceName);
    const targetFile = targetFileFor(interfaceName);
    if (!bySection.has(section)) bySection.set(section, []);

    for (const prop of properties) {
      if (seenKeys.has(prop.key)) {
        throw new Error(`Duplicate property key "${prop.key}" found in ${interfaceName} and ${seenKeys.get(prop.key)}. Property keys must be globally unique.`);
      }
      seenKeys.set(prop.key, interfaceName);

      const mdxRow = mdxLookup.get(prop.key);
      let description = mdxRow?.description || prop.javadocDescription;
      let possibleValues = mdxRow?.possibleValues || '';

      if (!description) {
        description = MANUAL_DESCRIPTIONS[prop.key] || '';
        if (description) usedManualOrFallback.push({key: prop.key, source: 'manual override'});
      }
      if (!description) {
        description = humanize(prop.key);
        usedManualOrFallback.push({key: prop.key, source: 'humanized key (no mdx/javadoc/manual source)'});
      }

      if (prop.type === 'boolean') {
        possibleValues = 'true, false';
      }

      const sensitive = isSensitive(prop.key);
      const entry = {
        section,
        key: prop.key,
        targetFile,
        type: prop.type,
        defaultValue: sensitive ? '' : prop.defaultValue,
        possibleValues,
        description,
      };
      if (sensitive) entry.sensitive = true;
      bySection.get(section).push({...entry, sourceOrder: prop.sourceOrder, interfaceName});
    }
  }

  const orderedSections = [
    ...SECTION_ORDER.filter((s) => bySection.has(s)),
    ...[...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s)).sort(),
  ];
  const missingFromOrder = [...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s));
  if (missingFromOrder.length > 0) {
    console.warn(`! New section(s) not in SECTION_ORDER, appended alphabetically: ${missingFromOrder.join(', ')}. Add to SECTION_ORDER in this script to control placement.`);
  }

  const catalog = [];
  for (const section of orderedSections) {
    const entries = bySection.get(section).sort((a, b) => a.sourceOrder - b.sourceOrder);
    for (const {sourceOrder, interfaceName, ...entry} of entries) {
      void sourceOrder; void interfaceName;
      catalog.push(entry);
    }
  }

  if (usedManualOrFallback.length > 0) {
    console.log(`\n${usedManualOrFallback.length} propert${usedManualOrFallback.length === 1 ? 'y uses' : 'ies use'} a non-mdx/non-javadoc description source:`);
    for (const {key, source} of usedManualOrFallback) console.log(`  - ${key}: ${source}`);
  }

  return catalog;
}

function humanize(key) {
  const words = key
    .replace(/[._-]+/gu, ' ')
    .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
  if (words.length === 0) return key;
  const label = words.map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase())).join(' ');
  return `${label}.`;
}

// Only run the CLI's generate/check side effects (filesystem writes, process.exit) when this
// file is executed directly, not when imported as a module (see isMainModule above).
if (isMainModule) {
  runCli();
}

function runCli() {
  const catalog = buildCatalog();
  const json = `${JSON.stringify(catalog, null, 2)}\n`;

  console.log(`\nGenerated catalog: ${catalog.length} properties across ${new Set(catalog.map((p) => p.section)).size} sections.`);

  if (checkOnly) {
    const existing = existsSync(CATALOG_PATH) ? readFileSync(CATALOG_PATH, 'utf8') : '';
    if (existing !== json) {
      console.error(`\n${CATALOG_PATH} is out of date. Run: node scripts/generate-properties-catalog.mjs`);
      process.exit(1);
    }
    console.log('properties-catalog.json is up to date.');
  } else {
    writeFileSync(CATALOG_PATH, json, 'utf8');
    console.log(`Wrote ${CATALOG_PATH}`);
  }
}
