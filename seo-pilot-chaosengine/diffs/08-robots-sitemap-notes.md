# robots / sitemap notes

## shafthq.github.io (live 2026-10-31)

- `robots.txt`: AI bots (GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, …) **Allow: /** with **Disallow: /assets/** only — **KEEP**.
- Sitemap already lists:
  - https://shafthq.github.io/docs/agentic/chaos-engine
  - https://shafthq.github.io/docs/agentic/chaos-engine-install-guide
  - https://shafthq.github.io/docs/agentic/chaos-engine-addons
- **After publish:** add `https://shafthq.github.io/entity/chaos-engine` to sitemap (Docusaurus pages usually auto-include).

## automatest.org (Coach)

- robots: path Disallows only; AI bot UAs share rules — already ALLOW (pilot1 decision: keep).
- Ensure `/chaosengine` remains in Squarespace sitemap.
- When `/entity` (Automatest) ships from pilot1, cross-link ChaosEngine facts; do not create doorway duplicates.

## No changes that sitewide Disallow AI crawlers.
