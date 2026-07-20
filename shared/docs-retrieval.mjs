const MAX_RETRIEVAL_CHARACTERS = 80_000;
const MAX_RETRIEVAL_CHUNKS = 8;
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how',
  'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'use',
  'what', 'when', 'where', 'which', 'with', 'your',
]);

function tokenize(value) {
  return [
    ...new Set(
      value
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/gu, ' ')
        .split(/\s+/u)
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
    ),
  ];
}

function scoreChunk(chunk, query, queryTokens) {
  const pathAndHeading = `${chunk.path} ${chunk.heading}`.toLowerCase();
  let score = 0;

  if (query && chunk.searchText.includes(query)) score += 30;
  for (const token of queryTokens) {
    if (pathAndHeading.includes(token)) score += 8;
    if (chunk.searchText.includes(token)) score += 2;
  }
  if (
    queryTokens.length > 0
    && queryTokens.every((token) => chunk.searchText.includes(token))
  ) {
    score += 20;
  }

  if (chunk.path === 'start/overview.mdx') score += 0.5;
  return score;
}

export function retrieveFromIndex(index, query, options = {}) {
  const maxCharacters = options.maxCharacters ?? MAX_RETRIEVAL_CHARACTERS;
  const maxChunks = options.maxChunks ?? MAX_RETRIEVAL_CHUNKS;
  const normalizedQuery = String(query || 'SHAFT overview').trim().toLowerCase();
  const queryTokens = tokenize(normalizedQuery);

  const ranked = index
    .map((chunk) => ({...chunk, score: scoreChunk(chunk, normalizedQuery, queryTokens)}))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score || left.path.localeCompare(right.path));

  const selected = [];
  let characters = 0;
  for (const chunk of ranked) {
    const rendered = `## ${chunk.heading}\nSource: /docs/${chunk.path.replace(/\.(?:md|mdx)$/u, '')}\n\n${chunk.content}`;
    if (selected.length >= maxChunks) break;
    if (characters + rendered.length > maxCharacters) continue;
    selected.push({...chunk, rendered});
    characters += rendered.length;
  }

  return selected;
}

export function loadDocumentationFromIndex(index, query = 'SHAFT overview') {
  const selected = retrieveFromIndex(index, query);
  const sections = selected.map((chunk) => chunk.rendered).join('\n\n---\n\n');
  return `# SHAFT Engine official documentation\n\nRetrieved for: ${query}\n\n${sections}`;
}
