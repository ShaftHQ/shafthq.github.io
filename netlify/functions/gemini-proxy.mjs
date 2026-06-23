import { createAutobotResponse } from './autobot-core.mjs';
import { loadDocumentation } from './docs-loader.mjs';
import { getGitHubRepositoryContext } from './github-context.mjs';

let cachedGitHubContext = null;

function getDocumentationContext(message) {
  if (!cachedGitHubContext) {
    cachedGitHubContext = getGitHubRepositoryContext();
  }
  return {
    documentation: loadDocumentation(message),
    githubContext: cachedGitHubContext,
  };
}

export default async (req) => createAutobotResponse(req, {
  apiKey: process.env.GEMINI_API_KEY,
  getDocumentationContext,
  serviceName: 'Gemini Proxy',
});
