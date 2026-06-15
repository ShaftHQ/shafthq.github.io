import {
  buildDocumentationIndex,
  loadDocumentation,
  retrieveDocumentation,
} from '../netlify/functions/docs-loader.mjs';

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
  index.every((chunk) => !chunk.path.startsWith('maintainers/')),
  'Maintainer pages must be excluded.',
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
      && chunk.content.includes('shaft-mcp:LATEST'),
  ),
  'MCP retrieval must expand shared command components into searchable content.',
);

const selected = retrieveDocumentation('SHAFT MCP Doctor Heal Web Mobile API');
assert(selected.length <= 8, 'Retrieval must select no more than eight chunks.');
assert(
  selected.every((chunk) => !chunk.content.includes('Java 21 LTS')),
  'Retrieved documentation must not recommend the retired Java 21 baseline.',
);

console.log('Documentation retrieval checks passed.');
