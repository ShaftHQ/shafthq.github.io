import {
  SHAFT_GITHUB_DISCUSSIONS,
  SHAFT_GITHUB_ISSUES,
  SHAFT_GITHUB_ORG,
  SHAFT_GITHUB_REPO,
} from './constants.mjs';

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
