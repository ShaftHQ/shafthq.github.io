import {existsSync, readFileSync, readdirSync} from 'fs';
import {extname, join, relative} from 'path';
import {fileURLToPath} from 'url';

const docsRoot = fileURLToPath(new URL('../docs/', import.meta.url));
const sidebarsPath = fileURLToPath(new URL('../sidebars.js', import.meta.url));
const publicDirectories = new Set(['start', 'testing', 'agentic', 'features', 'integrations', 'reference']);
const relatedHeading =
  /^##\s+(Related|Related Pages|Related Documentation|Related Locator Pages|Additional Resources|Next Steps|See Also|Continue|Learn More)\b/im;
const exampleFence =
  /```(?:java|bash|shell|powershell|xml|properties|json|yaml|yml|gherkin|sql|dockerfile|text|javascript|js|typescript|ts)\b[\s\S]*?```/i;
const internalLink = /\[[^\]]+\]\((?!https?:|mailto:|#)(?!\/docs\/(?:archive|maintainers)\/)[^)]+\)/i;
const assertionChain =
  /(?:\bassertThat(?:Response)?\s*\(|\bverifyThat(?:Response)?\s*\(|\.assertThat\s*\(|\.verifyThat\s*\(|SHAFT\.Validations\.(?:assertThat|verifyThat)\s*\(|\bValidations\.(?:assertThat|verifyThat)\s*\()/;
const legacyExecutionSuffix = new RegExp(`\\.${'per' + 'form'}\\s*\\(\\s*\\)`);

// WS-D: content-quality rules driven by DESIGN_LANGUAGE.md's "Admonition severity
// vocabulary" and "Content style guide" sections.
const bannedLinkText = new Set(['here', 'click here', 'this', 'link']);
const markdownLink = /\[([^\]]+)\]\([^)]*\)/g;
const standaloneNavLine = /^\s*\[[^\]]+\]\([^)]+\)(?:\s*·\s*\[[^\]]+\]\([^)]+\)){1,}\s*$/;
const admonitionOpen = /^:::([a-zA-Z]+)/gm;
const allowedAdmonitions = new Set(['tip', 'note', 'info', 'warning', 'danger']);
const markdownImage = /!\[([^\]]*)\]\([^)]*\)/g;
const genericAltText = new Set(['image', 'screenshot', 'img']);
const headingLine = /^(#{1,6})\s+/gm;

// #4048: DESIGN_LANGUAGE.md Content style guide rules 7-8, re-expressed from
// blader/humanizer (MIT, Copyright (c) 2025 Siqi Chen).
const inflatedVocabulary = /\b(seamlessly?|robust|comprehensive|leverage|essential)\b/i;
// Ratchet, not a rewrite mandate: the measured worst public-docs file today
// is 37 em dashes (agentic/intellij.md). This locks in that ceiling instead
// of demanding a 300+-instance corpus rewrite for zero functional gain.
const EM_DASH_MAX_PER_FILE = 40;
const emojiChar = /\p{Extended_Pictographic}/u;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Blank out fenced code blocks while preserving line numbers/offsets, so example
// code (which may itself contain markdown-ish text) never trips prose-only rules.
function withoutFences(content) {
  return content.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '));
}

function lineAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

// Blank out table rows too, for the em-dash density check only — table cells
// are an explicit exemption in DESIGN_LANGUAGE.md's Content style guide #7.
function withoutTableRows(content) {
  return content
    .split('\n')
    .map((line) => (/^\s*\|.*\|\s*$/.test(line) ? line.replace(/[^\n]/g, ' ') : line))
    .join('\n');
}

function publicDocs(directory = docsRoot, files = []) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      publicDocs(fullPath, files);
      continue;
    }
    if (!entry.isFile() || !['.md', '.mdx'].includes(extname(entry.name))) continue;

    const relativePath = relative(docsRoot, fullPath).replaceAll('\\', '/');
    if (publicDirectories.has(relativePath.split('/')[0])) files.push({fullPath, relativePath});
  }
  return files;
}

const docs = publicDocs();

for (const {fullPath, relativePath} of docs) {
  const content = readFileSync(fullPath, 'utf8');
  const fences = content.match(/```/g) ?? [];
  assert(fences.length % 2 === 0, `${relativePath} has an unbalanced fenced code block.`);
  assert(!/Work In Progress/i.test(content), `${relativePath} must not publish Work In Progress placeholders.`);
  assert(
    !/github\.com\/ShaftHQ\/SHAFT_ENGINE\/(?:blob|tree)\/master\//i.test(content),
    `${relativePath} links to the retired SHAFT_ENGINE master branch.`,
  );
  assert(
    !/github\.com\/ShaftHQ\/SHAFT_ENGINE\/(?:blob|tree)\/main\/src\/(?:main|test)\//i.test(content),
    `${relativePath} links to a pre-modularization SHAFT_ENGINE source path.`,
  );
  assert(exampleFence.test(content), `${relativePath} needs a fenced usage example.`);
  assert(relatedHeading.test(content), `${relativePath} needs a dedicated related-links section.`);

  const relatedStart = content.search(relatedHeading);
  assert(
    relatedStart >= 0 && internalLink.test(content.slice(relatedStart)),
    `${relativePath} related section needs at least one public internal docs link.`,
  );

  const codeBlocks = content.match(/```[\w-]*[\s\S]*?```/g) ?? [];
  for (const block of codeBlocks) {
    for (const statement of block.split(';')) {
      assert(
        !(
          assertionChain.test(statement) &&
          legacyExecutionSuffix.test(statement)
        ),
        `${relativePath} has a legacy execution suffix on an assertion or verification example.`,
      );
    }
  }

  const proseOnly = withoutFences(content);

  // Rule 1: descriptive link text (Content style guide #1).
  for (const match of proseOnly.matchAll(markdownLink)) {
    const linkText = match[1].trim().toLowerCase();
    assert(
      !bannedLinkText.has(linkText),
      `${relativePath}:${lineAt(content, match.index)} uses non-descriptive link text "${match[1].trim()}" — describe the destination instead.`,
    );
  }

  // Rule 2: a single end-of-page navigation pattern — no inline "A · B" nav lines
  // outside of "## Related" (Content style guide #2).
  for (const line of proseOnly.split('\n')) {
    assert(
      !standaloneNavLine.test(line),
      `${relativePath} has a standalone inline-nav line ("${line.trim()}"); fold these destinations into "## Related" instead.`,
    );
  }

  // Rule 3: admonition severity vocabulary — no legacy ":::caution", and only the
  // {tip, note, info, warning, danger} types (DESIGN_LANGUAGE.md Admonition severity vocabulary).
  for (const match of content.matchAll(admonitionOpen)) {
    const type = match[1].toLowerCase();
    if (type === 'caution') {
      assert(false, `${relativePath}:${lineAt(content, match.index)} uses ":::caution", a legacy alias — convert it to ":::warning".`);
    }
    assert(
      allowedAdmonitions.has(type),
      `${relativePath}:${lineAt(content, match.index)} uses unsupported admonition type ":::${match[1]}" — use one of tip, note, info, warning, danger.`,
    );
  }

  // Rule 4: image alt text must be present and specific.
  for (const match of proseOnly.matchAll(markdownImage)) {
    const alt = match[1].trim().toLowerCase();
    assert(
      alt !== '' && !genericAltText.has(alt),
      `${relativePath}:${lineAt(content, match.index)} has an empty or generic image alt text ("${match[1]}") — describe what the image shows.`,
    );
  }

  // Rule 5: heading hierarchy must not skip a level going down. The frontmatter
  // title stands in for H1, so a body may open at H2 but not deeper.
  let previousLevel = 1;
  for (const match of proseOnly.matchAll(headingLine)) {
    const level = match[1].length;
    assert(
      level <= previousLevel + 1,
      `${relativePath}:${lineAt(content, match.index)} heading level jumps from H${previousLevel} to H${level} — do not skip heading levels.`,
    );
    previousLevel = level;
  }

  // Rule 6: no emoji in headings (DESIGN_LANGUAGE.md is already clean here;
  // this is a regression lock, not a rewrite. blog/ is a separate corpus and
  // this scan never reaches it — its release-note emoji headings are a
  // deliberate convention, not slop).
  for (const line of proseOnly.split('\n')) {
    if (/^#{1,6}\s+/.test(line) && emojiChar.test(line)) {
      assert(false, `${relativePath} has an emoji in a heading ("${line.trim()}") — keep headings emoji-free.`);
    }
  }

  // Rule 7: no inflated-vocabulary praise words (Content style guide #8).
  for (const line of proseOnly.split('\n')) {
    const match = line.match(inflatedVocabulary);
    if (match) {
      assert(false, `${relativePath} uses inflated vocabulary word "${match[0]}" in "${line.trim()}" — say what the thing does instead (Content style guide #8).`);
    }
  }

  // Rule 8: em-dash density ratchet (Content style guide #7).
  const emDashCount = (withoutTableRows(proseOnly).match(/—/g) || []).length;
  assert(
    emDashCount <= EM_DASH_MAX_PER_FILE,
    `${relativePath} has ${emDashCount} em dashes (ratchet max ${EM_DASH_MAX_PER_FILE} per page) — prefer a period, comma, colon, or parentheses (Content style guide #7).`,
  );
}

function docsContaining(pattern) {
  return docs
    .filter(({fullPath}) => pattern.test(readFileSync(fullPath, 'utf8')))
    .map(({relativePath}) => relativePath);
}

assert(
  docsContaining(/\b(?:MCP_CP|MCP_MAIN)\b/).every((relativePath) => relativePath === 'agentic/mcp.mdx'),
  'Only agentic/mcp.mdx may contain runnable MCP classpath command snippets.',
);
assert(
  docsContaining(/upgrade_to_modular_shaft\.py/).every((relativePath) => relativePath === 'start/upgrade.mdx'),
  'Only start/upgrade.mdx may contain the upgrade script name or commands.',
);
assert(
  docsContaining(/\/project-generator/).every((relativePath) => relativePath === 'start/installation.mdx'),
  'Only start/installation.mdx may embed or link directly to the Project Generator route.',
);

const pillarsGuide = readFileSync(join(docsRoot, 'features/test-automation-pillars.mdx'), 'utf8');
const skillsPath = join(docsRoot, 'agentic/skills.mdx');
const agenticOverview = readFileSync(join(docsRoot, 'agentic/overview.mdx'), 'utf8');
const modulesGuide = readFileSync(join(docsRoot, 'features/modules.md'), 'utf8');
const maintainersOverview = readFileSync(join(docsRoot, 'maintainers/overview.md'), 'utf8');
const sidebars = readFileSync(sidebarsPath, 'utf8');

assert(existsSync(skillsPath), 'The public guide must include agentic/skills.mdx.');
const skillsGuide = readFileSync(skillsPath, 'utf8');
assert(
  skillsGuide.includes('<SkillsInstallerCommands />'),
  'agentic/skills.mdx must use the canonical installer command snippet.',
);
assert(
  !agenticOverview.includes('--install-shaft-skills'),
  'agentic/overview.mdx must delegate skill installation commands to agentic/skills.mdx.',
);

assert(
  pillarsGuide.includes('Pillars of successful test automation'),
  'features/test-automation-pillars.mdx must name the Pillars of successful test automation.',
);
assert(
  /```mermaid[\s\S]*Scalability[\s\S]*Reliability[\s\S]*Maintainability[\s\S]*```/.test(pillarsGuide),
  'features/test-automation-pillars.mdx must include a Mermaid visual for the three pillars.',
);
assert(
  sidebars.includes("'features/test-automation-pillars'"),
  'sidebars.js must list features/test-automation-pillars in the Features section.',
);
assert(
  sidebars.includes("'agentic/skills'"),
  'sidebars.js must list agentic/skills in the Agentic section.',
);
for (const artifact of [
  'shaft-engine',
  'shaft-pilot-core',
  'shaft-capture',
  'shaft-capture-proxy',
  'shaft-doctor',
  'shaft-ai',
  'shaft-heal',
  'shaft-mcp',
  'shaft-cli',
  'shaft-browserstack',
  'shaft-video',
  'shaft-visual',
  'shaft-sikulix',
  'shaft-bom',
]) {
  assert(modulesGuide.includes(`\`${artifact}\``), `features/modules.md must document ${artifact}.`);
}
assert(
  maintainersOverview.includes('.github/workflows/README.md'),
  'The maintainer overview must link repository-local operational README files.',
);

const officialLocatorPages = {
  elementIdentification: readFileSync(
    join(docsRoot, 'reference/actions/GUI/Element_Identification.md'),
    'utf8',
  ),
  locatorsAndSelfHealing: readFileSync(
    join(docsRoot, 'reference/actions/GUI/Locators_And_Self_Healing.md'),
    'utf8',
  ),
  web: readFileSync(join(docsRoot, 'testing/web.mdx'), 'utf8'),
  pillars: readFileSync(join(docsRoot, 'features/test-automation-pillars.mdx'), 'utf8'),
  solutionDesign: readFileSync(join(docsRoot, 'reference/guides/Solution_Design.md'), 'utf8'),
  flakiness: readFileSync(join(docsRoot, 'testing/flakiness.mdx'), 'utf8'),
};

const generatedHasTextForm = /hasRole\([^)]*\)\.hasText\(/;
for (const {fullPath, relativePath} of docs) {
  const content = readFileSync(fullPath, 'utf8');
  assert(
    !generatedHasTextForm.test(content),
    `${relativePath} must not teach hasRole(...).hasText( as the generated/repo form; use hasNormalizedText.`,
  );
}

function titledJavaFences(content, titlePattern) {
  return content.match(new RegExp('```java title="' + titlePattern + '"[\\s\\S]*?```', 'g')) || [];
}

for (const [name, content] of Object.entries(officialLocatorPages)) {
  assert(
    !/Prefer ID locators|most reliable and fastest/i.test(content),
    `${name} must not rank raw ID as fastest or preferred over the generated locator policy.`,
  );
}

assert(
  !/Avoid XPath when possible/i.test(officialLocatorPages.elementIdentification),
  'Element_Identification.md must not tell readers to prefer CSS over native relative xpath.',
);
assert(
  !/CSS selectors are generally faster/i.test(officialLocatorPages.elementIdentification),
  'Element_Identification.md must not rank CSS faster than native relative xpath.',
);
assert(
  !/SHAFT\.GUI\.Locator\.hasId\(/.test(officialLocatorPages.elementIdentification),
  'Element_Identification.md must start unique ids at hasAnyTagName().hasId(...), not Locator.hasId(.',
);
assert(
  !/By\.xpath\("\/\/input\[@id='username'\]"\)/.test(officialLocatorPages.elementIdentification),
  'Element_Identification.md must not show xpath-by-id after saying use xpath only when there is no unique id.',
);
assert(
  !/By elementLocator = By\.id\("username"\)/.test(officialLocatorPages.elementIdentification),
  'Element_Identification.md catalog must not present By.id("username") as the generated form.',
);

const elementIdentificationLoginPages = titledJavaFences(
  officialLocatorPages.elementIdentification,
  'LoginPage\\.java',
);
assert(
  elementIdentificationLoginPages.length === 1,
  'Element_Identification.md must keep one titled LoginPage.java sample.',
);
assert(
  /private final By loginButton = SHAFT\.GUI\.Locator\.hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Log In"\)\.build\(\);/.test(
    elementIdentificationLoginPages[0],
  ),
  'Element_Identification.md LoginPage loginButton must use hasRole + hasNormalizedText.',
);
assert(
  !/private final By loginButton = By\.cssSelector/.test(elementIdentificationLoginPages[0]),
  'Element_Identification.md LoginPage must not recommend raw By.cssSelector as the generated form.',
);
assert(
  /hasAnyTagName\(\)\.hasId\("username"\)/.test(elementIdentificationLoginPages[0]),
  'Element_Identification.md LoginPage must use the SHAFT locator builder for a unique author-written id.',
);

const dynamicLocators = titledJavaFences(
  officialLocatorPages.elementIdentification,
  'DynamicLocators\\.java',
);
assert(dynamicLocators.length === 1, 'Element_Identification.md must keep a DynamicLocators.java sample.');
assert(
  !/By\.cssSelector/.test(dynamicLocators[0]),
  'Element_Identification.md DynamicLocators.java must not lead with By.cssSelector.',
);

assert(
  /hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Create Account"\)/.test(officialLocatorPages.web),
  'web.mdx official second rung must use hasNormalizedText.',
);
assert(
  !/hasRole\(Role\.BUTTON\)\.hasText\("Create Account"\)/.test(officialLocatorPages.web),
  'web.mdx official second rung must not teach hasText.',
);

assert(
  /hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Log in"\)/.test(officialLocatorPages.pillars),
  'test-automation-pillars.mdx login click must use hasNormalizedText.',
);
assert(
  !/hasRole\(Role\.BUTTON\)\.hasText\("Log in"\)/.test(officialLocatorPages.pillars),
  'test-automation-pillars.mdx login click must not teach hasText.',
);

const solutionLoginPages = titledJavaFences(
  officialLocatorPages.solutionDesign,
  '[^"]*LoginPage\\.java',
);
assert(
  solutionLoginPages.length >= 1,
  'Solution_Design.md must keep a titled LoginPage.java sample.',
);
for (const fence of solutionLoginPages) {
  assert(
    !/\bBy\.id\(/.test(fence),
    'Solution_Design.md titled LoginPage.java samples must not teach raw By.id as the generated/repo form.',
  );
  assert(
    /hasAnyTagName\(\)\.hasId\(/.test(fence),
    'Solution_Design.md titled LoginPage.java samples must use the SHAFT locator builder for unique author-written ids.',
  );
}

assert(
  !/ARIA role \| `SHAFT\.GUI\.Locator\.hasRole\(Role\.BUTTON\)\.hasText\("Log In"\)\.build\(\)`/.test(
    officialLocatorPages.locatorsAndSelfHealing,
  ),
  'Locators_And_Self_Healing.md ranking table must not teach hasText as the official second rung.',
);
assert(
  /hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Log In"\)/.test(officialLocatorPages.locatorsAndSelfHealing),
  'Locators_And_Self_Healing.md ranking table must show hasNormalizedText.',
);

const ariaLocators = titledJavaFences(
  officialLocatorPages.locatorsAndSelfHealing,
  'ARIALocators\\.java',
);
assert(
  ariaLocators.length === 1,
  'Locators_And_Self_Healing.md must keep a titled ARIALocators.java sample.',
);
assert(
  /hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Submit"\)/.test(ariaLocators[0]),
  'ARIALocators.java must use hasNormalizedText as the generated second rung.',
);
assert(
  !generatedHasTextForm.test(ariaLocators[0]),
  'ARIALocators.java must not teach hasRole(...).hasText( as the generated form.',
);

const semanticLocators = titledJavaFences(
  officialLocatorPages.flakiness,
  'SemanticLocators\\.java',
);
assert(
  semanticLocators.length === 1,
  'flakiness.mdx must keep a titled SemanticLocators.java sample.',
);
assert(
  /hasRole\(Role\.BUTTON\)\.hasNormalizedText\("Apply filter"\)/.test(semanticLocators[0]),
  'SemanticLocators.java must use hasNormalizedText as the generated second rung.',
);
assert(
  !generatedHasTextForm.test(semanticLocators[0]),
  'SemanticLocators.java must not teach hasRole(...).hasText( as the generated form.',
);

console.log('Documentation quality checks passed.');
