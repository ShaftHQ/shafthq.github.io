import { createAutobotResponse } from '../../netlify/functions/autobot-core.mjs';
import { getGitHubRepositoryContext } from '../../netlify/functions/github-context.mjs';
import { loadDocumentationFromIndex } from '../../netlify/functions/docs-retrieval.mjs';

let cachedIndex = null;
let cachedGitHubContext = null;

async function loadIndex(context) {
  if (cachedIndex) return cachedIndex;

  const indexUrl = new URL('/autobot-index.json', context.request.url);
  const response = context.env.ASSETS
    ? await context.env.ASSETS.fetch(indexUrl)
    : await fetch(indexUrl);
  if (!response.ok) {
    throw new Error(`Could not load AutoBot index: ${response.status}`);
  }
  cachedIndex = await response.json();
  return cachedIndex;
}

async function getDocumentationContext(message, context) {
  if (!cachedGitHubContext) {
    cachedGitHubContext = getGitHubRepositoryContext();
  }

  const index = await loadIndex(context);
  return {
    documentation: loadDocumentationFromIndex(index, message),
    githubContext: cachedGitHubContext,
  };
}

export async function onRequest(context) {
  return createAutobotResponse(context.request, {
    apiKey: context.env.GEMINI_API_KEY,
    getDocumentationContext: (message) => getDocumentationContext(message, context),
    serviceName: 'Cloudflare AutoBot',
  });
}
