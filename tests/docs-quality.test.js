import {readFileSync, readdirSync} from 'fs';
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
const sidebars = readFileSync(sidebarsPath, 'utf8');

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

console.log('Documentation quality checks passed.');
