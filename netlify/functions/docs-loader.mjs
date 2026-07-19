import {readFileSync, readdirSync} from 'fs';
import {dirname, extname, join, relative, sep} from 'path';
import {fileURLToPath} from 'url';
import {
  loadDocumentationFromIndex,
  retrieveFromIndex,
} from './docs-retrieval.mjs';
export { getGitHubRepositoryContext } from './github-context.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const snippets = JSON.parse(
  readFileSync(join(currentDir, '..', '..', 'src', 'data', 'snippets.json'), 'utf-8'),
);
const MCP_COMMAND_SYSTEMS = ['windows', 'macos', 'linux'];
const EXCLUDED_DIRECTORIES = new Set(['archive', 'superpowers']);

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

function countOccurrences(text, char) {
  return text.split(char).length - 1;
}

// Strips `import`/`export` statements line-by-line rather than with a single regex, so that
// brace-destructured imports spanning multiple lines (e.g. `import {\n  A,\n} from '...';`) are
// removed in full, including their continuation lines and closing `} from '...';`. Tracks brace
// balance instead of scanning ahead for a terminating `;`, which keeps this linear-time and avoids
// any unbounded lookahead that could eat unrelated prose or trigger catastrophic backtracking.
function stripImportExportStatements(content) {
  const kept = [];
  let braceBalance = 0;

  for (const line of content.split('\n')) {
    if (braceBalance > 0) {
      braceBalance += countOccurrences(line, '{') - countOccurrences(line, '}');
      continue;
    }

    if (/^(?:import|export)\s+/u.test(line)) {
      braceBalance = countOccurrences(line, '{') - countOccurrences(line, '}');
      continue;
    }

    kept.push(line);
  }

  return kept.join('\n');
}

export function normalizeMarkdown(content) {
  const withoutFrontmatter = content
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
    .replace(/^---[\s\S]*?---\s*/u, '');

  return stripImportExportStatements(withoutFrontmatter)
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/gu, ' ')
    .replace(/[ \t]+/gu, ' ')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
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

export function retrieveDocumentation(query, options = {}) {
  return retrieveFromIndex(buildDocumentationIndex(), query, options);
}

export function loadDocumentation(query = 'SHAFT overview') {
  try {
    return loadDocumentationFromIndex(buildDocumentationIndex(), query);
  } catch (error) {
    console.error('[Documentation Loader] Error loading documentation:', error);
    return null;
  }
}
