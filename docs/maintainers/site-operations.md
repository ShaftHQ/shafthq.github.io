---
id: site-operations
title: Documentation site operations
description: Develop, validate, and deploy the canonical SHAFT documentation site.
slug: /maintainers/site-operations
sidebar_position: 2
tags: [maintainers, docusaurus, cloudflare-workers, github-pages]
---

# Documentation site operations

The Docusaurus repository is the canonical source for SHAFT product,
architecture, usage, migration, and maintainer documentation. The canonical
public URL is
[shafthq.github.io](https://shafthq.github.io).

GitHub Pages publishes the public guide for users. Cloudflare Workers hosts the
`/api/gemini-proxy` backend API that AutoBot calls from the browser and can also
serve the same static build as an operational mirror. Do not change Squarespace
DNS for this GitHub Pages recovery path.

## Local development

Use Node.js 20 and Yarn:

```bash
yarn install
yarn start
```

Cloudflare Workers Builds uses `wrangler.toml`, builds with `yarn build`,
uploads `build/` through `[assets]`, and routes `/api/gemini-proxy` through
`worker/index.js`. Set `YARN_VERSION=1.22.22` and `GEMINI_API_KEY` in
Cloudflare environment variables; do not commit secrets.

GitHub Pages uses `.github/workflows/deploy.yml` and publishes `build/` as the
canonical public guide at `https://shafthq.github.io/`.

## Egypt accessibility

If Egyptian users cannot open the guide, test both providers before changing
site code:

```bash
curl -4 -I https://shafthq.github.io/
curl -4 -I https://shaft-engine.mohab-mohieeldeen.workers.dev/autobot-index.json
curl -4 -i -X OPTIONS https://shaft-engine.mohab-mohieeldeen.workers.dev/api/gemini-proxy \
  -H "Origin: https://shafthq.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

On 2026-06-23, Cairo probes on Link Egypt timed out against Netlify while
Cloudflare and GitHub Pages returned HTTP 200. The recovery path is to keep
users on `https://shafthq.github.io/` and let AutoBot call the Cloudflare Worker
API with CORS enabled for that origin.

## Validation

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

The build fails on broken Markdown links and duplicated long prose or code
blocks. The Playwright suite covers desktop and mobile rendering, canonical
routes, code copying, and dark mode.

## Search and AutoBot

Local search runs on `@easyops-cn/docusaurus-search-local` (migrated from
`@cmfcmf/docusaurus-search-local` in issue #865 for better result relevance).
Exclusions are now declared at the source level via the plugin's `ignoreFiles`
option in `docusaurus.config.js`, instead of the old
`scripts/prune-search-index.mjs` post-build step (removed): it excludes only
`docs/archive/` from `build/search-index.json`. Maintainer docs stay indexed,
matching the #795 decision ("make docs/maintainers/ fully public").
Because search is static, it works anywhere the Docusaurus assets load.

AutoBot indexes Markdown and MDX by route and heading at startup, retrieves the
eight best chunks for each question, and caps injected documentation context at
80,000 characters. `yarn build` writes `static/autobot-index.json`; the
Cloudflare function fetches that static index at runtime, so AutoBot does not
depend on GitHub Pages server-side code.
`EXCLUDED_DIRECTORIES` in `shared/docs-loader.mjs` excludes
`archive/` and `superpowers/` only -- `docs/maintainers/` is intentionally
included per #795 ("make docs/maintainers/ fully public"), and
`tests/docs-loader.test.js` asserts that inclusion; local search's
`ignoreFiles` matches. The public HTTP request and response contract remains
unchanged.

## Content changes

- Keep one canonical page per concept.
- Reuse commands and dependency snippets from `src/components/DocSnippets`.
- Put historical records under `docs/archive/`; archive routes are unlisted and
  emit `noindex`.
- Add redirects to the `plugin-client-redirects` config in
  `docusaurus.config.js` when replacing a public route.
- Coordinate public behavior changes with a linked SHAFT_ENGINE pull request.
