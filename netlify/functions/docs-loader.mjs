import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { SHAFT_GITHUB_ORG, SHAFT_GITHUB_REPO, SHAFT_GITHUB_ISSUES, SHAFT_GITHUB_DISCUSSIONS } from './constants.mjs';

// Get current file's directory for path resolution
const currentFileUrl = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFileUrl);

/**
 * Recursively read all markdown files from a directory
 */
function readMarkdownFiles(dirPath, baseDir, files = []) {
  const entries = readdirSync(dirPath);
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      readMarkdownFiles(fullPath, baseDir, files);
    } else if (entry.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      const relativePath = relative(baseDir, fullPath);
      files.push({
        path: relativePath,
        content: content
      });
    }
  }
  
  return files;
}

/**
 * Load all documentation files and compile them into a knowledge base
 */
export function loadDocumentation() {
  try {
    // Path to docs directory (two levels up from functions directory, then into docs)
    const docsPath = join(currentDir, '..', '..', 'docs');
    
    const docFiles = readMarkdownFiles(docsPath, docsPath);
    
    // Compile all documentation into a single string with clear section markers
    let compiledDocs = '# SHAFT Engine User Guide - Complete Documentation\n\n';
    compiledDocs += 'This is the complete, official SHAFT Engine documentation. Use ONLY this information to answer user questions.\n\n';
    compiledDocs += '---\n\n';
    
    for (const file of docFiles) {
      compiledDocs += `## Document: ${file.path}\n\n`;
      compiledDocs += file.content;
      compiledDocs += '\n\n---\n\n';
    }
    
    console.log(`[Documentation Loader] Successfully loaded ${docFiles.length} documentation files`);
    
    return compiledDocs;
  } catch (error) {
    console.error('[Documentation Loader] Error loading documentation:', error);
    return null;
  }
}

/**
 * Get GitHub repository information for SHAFT_ENGINE
 * This provides context about the official source code repository
 */
export function getGitHubRepositoryContext() {
  return `
# SHAFT Engine Official GitHub Repository

Repository: ${SHAFT_GITHUB_REPO}
Organization: ${SHAFT_GITHUB_ORG}

For source code references, API documentation, or implementation details not covered in the user guide,
users should refer to:
- GitHub Repository: ${SHAFT_GITHUB_REPO}
- GitHub Issues: ${SHAFT_GITHUB_ISSUES}
- GitHub Discussions: ${SHAFT_GITHUB_DISCUSSIONS}
- API JavaDocs: Available in the repository

When users ask about specific implementation details or source code:
1. First check if the information is available in the user guide above
2. If not, direct them to the appropriate GitHub resource
3. Never make up or assume implementation details

The main SHAFT packages are located at:
- com.shaft.driver.SHAFT - Main entry point
- com.shaft.api - API testing capabilities
- com.shaft.gui - Web/GUI testing capabilities
- com.shaft.cli - CLI testing capabilities
- com.shaft.db - Database testing capabilities
- com.shaft.validation - Validation and assertion utilities
`;
}
