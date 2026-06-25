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

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
        !(assertionChain.test(statement) && /\.perform\s*\(\s*\)/.test(statement)),
        `${relativePath} has .perform() on an assertion or verification example.`,
      );
    }
  }
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
