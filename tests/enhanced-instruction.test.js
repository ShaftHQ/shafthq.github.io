import {loadDocumentation, getGitHubRepositoryContext} from '../netlify/functions/docs-loader.mjs';
import {MAX_SYSTEM_INSTRUCTION_LENGTH} from '../netlify/functions/constants.mjs';

const documentation = loadDocumentation('How do I connect Codex to SHAFT MCP?');
const githubContext = getGitHubRepositoryContext();
const originalSystemInstruction = 'You are AutoBot, a helpful assistant.';
const enhancedSystemInstruction = `${documentation}\n\n${githubContext}\n\n---\n\n${originalSystemInstruction}`;

if (!documentation?.includes('codex mcp add')) {
  throw new Error('Enhanced instruction is missing the requested MCP setup.');
}
if (!githubContext.includes('github.com/ShaftHQ/SHAFT_ENGINE')) {
  throw new Error('Enhanced instruction is missing official repository context.');
}
if (enhancedSystemInstruction.length > MAX_SYSTEM_INSTRUCTION_LENGTH) {
  throw new Error('Enhanced instruction exceeds the configured request limit.');
}

console.log('Enhanced instruction retrieval checks passed.');
