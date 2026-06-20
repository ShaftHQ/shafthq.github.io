import {readFileSync, readdirSync} from 'fs';
import {extname, join, relative} from 'path';
import {fileURLToPath} from 'url';

const docsRoot = fileURLToPath(new URL('../docs/', import.meta.url));
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

for (const {fullPath, relativePath} of publicDocs()) {
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

console.log('Documentation quality checks passed.');
