import {
  buildDocumentationIndex,
  loadDocumentation,
  normalizeMarkdown,
  retrieveDocumentation,
} from '../netlify/functions/docs-loader.mjs';
import {loadDocumentationFromIndex} from '../netlify/functions/docs-retrieval.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const index = buildDocumentationIndex();
assert(
  index.length > 500,
  'Documentation index should preserve headings consistently across platforms.',
);
assert(
  index.some((chunk) => chunk.path.endsWith('.mdx')),
  'MDX pages must be indexed.',
);
assert(
  index.every((chunk) => !chunk.path.startsWith('archive/')),
  'Archive pages must be excluded.',
);
assert(
  index.every((chunk) => !chunk.path.startsWith('superpowers/')),
  'Superpowers plan pages must be excluded.',
);
assert(
  index.some((chunk) => chunk.path.startsWith('maintainers/')),
  'Maintainer pages must be included.',
);

const cases = [
  ['connect Codex to shaft-mcp', ['Maven Central', 'Codex MCP documentation']],
  ['run Doctor against Allure results', ['doctor analyze', 'allowed-root']],
  ['enable SHAFT Heal', ['healing.strategy=shaft-heal', 'shaft-heal']],
  ['create a web test', ['SHAFT.GUI.WebDriver', 'navigateToURL']],
  ['create a mobile Appium test', ['Appium', 'SHAFT.GUI.WebDriver']],
  ['create an API test', ['SHAFT.API', 'assertThatResponse']],
];

for (const [query, expectedTerms] of cases) {
  const context = loadDocumentation(query);
  assert(context, `Context should load for "${query}".`);
  assert(context.length <= 80_500, `Context exceeded retrieval cap for "${query}".`);
  for (const term of expectedTerms) {
    assert(
      context.toLowerCase().includes(term.toLowerCase()),
      `"${query}" context is missing "${term}".`,
    );
  }
}

const mcpSelection = retrieveDocumentation('shaft-mcp LATEST install --codex');
assert(
  mcpSelection.some(
    (chunk) => chunk.path === 'agentic/mcp.mdx'
      && chunk.content.includes('install-shaft-mcp.sh')
      && chunk.content.includes('Install-ShaftMcp')
      && chunk.content.includes('io.github.shafthq:shaft-mcp:LATEST'),
  ),
  'MCP retrieval must expand shared command components into searchable content.',
);

const staticIndexContext = loadDocumentationFromIndex(index, 'connect Codex to shaft-mcp');
assert(
  staticIndexContext.includes('Codex MCP documentation'),
  'Static AutoBot index retrieval must preserve MCP setup content.',
);

const selected = retrieveDocumentation('SHAFT MCP Doctor Heal Web Mobile API');
assert(selected.length <= 8, 'Retrieval must select no more than eight chunks.');
assert(
  selected.every((chunk) => !chunk.content.includes('Java 21 LTS')),
  'Retrieved documentation must not recommend the retired Java 21 baseline.',
);

const multiLineImportFixture = `# Heading

import {
  A,
  B,
} from '@site/src/x';

Some prose that must survive.
`;
const normalizedMultiLineImport = normalizeMarkdown(multiLineImportFixture);
assert(
  !normalizedMultiLineImport.split('\n').some((line) => line.includes("from '")),
  'Multi-line import statements must be fully stripped, including continuation lines and the closing "} from \'...\';".',
);
assert(
  normalizedMultiLineImport.includes('Some prose that must survive.'),
  'Prose following a multi-line import statement must survive normalization.',
);

console.log('Documentation retrieval checks passed.');
