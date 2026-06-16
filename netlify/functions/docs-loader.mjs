import {readFileSync, readdirSync} from 'fs';
import {dirname, extname, join, relative, sep} from 'path';
import {fileURLToPath} from 'url';
import {
  SHAFT_GITHUB_DISCUSSIONS,
  SHAFT_GITHUB_ISSUES,
  SHAFT_GITHUB_ORG,
  SHAFT_GITHUB_REPO,
} from './constants.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const snippets = JSON.parse(
  readFileSync(join(currentDir, '..', '..', 'src', 'data', 'snippets.json'), 'utf-8'),
);
const MCP_COMMAND_SYSTEMS = ['windows', 'macos', 'linux'];
const MAX_RETRIEVAL_CHARACTERS = 80_000;
const MAX_RETRIEVAL_CHUNKS = 8;
const EXCLUDED_DIRECTORIES = new Set(['archive', 'maintainers']);
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how',
  'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'use',
  'what', 'when', 'where', 'which', 'with', 'your',
]);

let cachedIndex = null;

function readDocumentationFiles(dirPath, baseDir, files = []) {
  for (const entry of readdirSync(dirPath, {withFileTypes: true})) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      readDocumentationFiles(fullPath, baseDir, files);
      continue;
    }

    if (!entry.isFile() || !['.md', '.mdx'].includes(extname(entry.name).toLowerCase())) continue;

    const relativePath = relative(baseDir, fullPath);
    const pathSegments = relativePath.split(sep);
    if (EXCLUDED_DIRECTORIES.has(pathSegments[0])) continue;

    const content = readFileSync(fullPath, 'utf-8');
    if (/^---[\s\S]*?\bunlisted:\s*true\b[\s\S]*?---/i.test(content)) continue;

    files.push({path: relativePath.replaceAll(sep, '/'), content});
  }

  return files;
}

function normalizeMarkdown(content) {
  return content
    .replace(/\r\n?/gu, '\n')
    .replace(
      /<McpApplications\s*\/>/gu,
      snippets.mcpInstaller.applications
        .flatMap((application) => MCP_COMMAND_SYSTEMS
          .filter((system) => application.platforms.includes(system))
          .map((system) => `${application.name} (${system}): \`${snippets.mcpInstaller.commandTemplates[system]
            .replace('{agentFlag}', application.flag)
            .replace('{client}', application.id)}\``))
        .join('\n'),
    )
    .replace(/<DoctorCommand\s*\/>/gu, `\`${snippets.doctor}\``)
    .replace(/<HealCommand\s*\/>/gu, `\`${snippets.heal}\``)
    .replace(/^---[\s\S]*?---\s*/u, '')
    .replace(/^(?:import|export)\s+.*$/gmu, '')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/gu, ' ')
    .replace(/[ \t]+/gu, ' ')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
}

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

function splitIntoChunks(file) {
  const normalized = normalizeMarkdown(file.content);
  const lines = normalized.split('\n');
  const chunks = [];
  let heading = file.path.replace(/\.(?:md|mdx)$/u, '');
  let body = [];

  const flush = () => {
    const content = body.join('\n').trim();
    if (!content) return;
    chunks.push({
      path: file.path,
      heading,
      content,
      searchText: `${file.path} ${heading} ${content}`.toLowerCase(),
    });
  };

  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+)$/u);
    if (match) {
      flush();
      heading = match[1].replace(/[`*_]/gu, '').trim();
      body = [line];
    } else {
      body.push(line);
    }
  }
  flush();
  return chunks;
}

export function buildDocumentationIndex() {
  if (cachedIndex) return cachedIndex;

  const docsPath = join(currentDir, '..', '..', 'docs');
  const files = readDocumentationFiles(docsPath, docsPath);
  cachedIndex = files.flatMap(splitIntoChunks);
  console.log(
    `[Documentation Loader] Indexed ${files.length} files into ${cachedIndex.length} chunks`,
  );
  return cachedIndex;
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

export function retrieveDocumentation(query, options = {}) {
  const maxCharacters = options.maxCharacters ?? MAX_RETRIEVAL_CHARACTERS;
  const maxChunks = options.maxChunks ?? MAX_RETRIEVAL_CHUNKS;
  const normalizedQuery = String(query || 'SHAFT overview').trim().toLowerCase();
  const queryTokens = tokenize(normalizedQuery);

  const ranked = buildDocumentationIndex()
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

export function loadDocumentation(query = 'SHAFT overview') {
  try {
    const selected = retrieveDocumentation(query);
    const sections = selected.map((chunk) => chunk.rendered).join('\n\n---\n\n');
    return `# SHAFT Engine official documentation\n\nRetrieved for: ${query}\n\n${sections}`;
  } catch (error) {
    console.error('[Documentation Loader] Error loading documentation:', error);
    return null;
  }
}

export function getGitHubRepositoryContext() {
  return `
# SHAFT Engine official GitHub repository

Repository: ${SHAFT_GITHUB_REPO}
Organization: ${SHAFT_GITHUB_ORG}

Use these official resources when a question is outside the retrieved guide:
- Issues: ${SHAFT_GITHUB_ISSUES}
- Discussions: ${SHAFT_GITHUB_DISCUSSIONS}
- JavaDocs: https://shafthq.github.io/SHAFT_ENGINE/

Never invent implementation details that are absent from the retrieved
documentation.`;
}
