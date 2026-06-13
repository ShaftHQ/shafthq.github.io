---
id: site-operations
title: Documentation site operations
description: Develop, validate, and deploy the canonical SHAFT documentation site.
slug: /maintainers/site-operations
sidebar_position: 2
tags: [maintainers, docusaurus, netlify]
---

# Documentation site operations

The Docusaurus repository is the canonical source for SHAFT product,
architecture, usage, migration, and maintainer documentation. Netlify publishes
it at [shaftengine.netlify.app](https://shaftengine.netlify.app). GitHub Pages
serves only a redirect to that URL.

## Local development

Use Node.js 20 and Yarn:

```bash
yarn install
yarn start
```

Netlify uses `yarn build`, publishes `build/`, and serves functions from
`netlify/functions/`. `GEMINI_API_KEY` belongs in the Netlify environment; it
must never be embedded in the browser bundle.

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

Local search indexes public product documentation. A post-build integrity step
removes `/docs/archive/` and `/docs/maintainers/` entries.

AutoBot indexes Markdown and MDX by route and heading at startup, retrieves the
eight best chunks for each question, and caps injected documentation context at
80,000 characters. Archive and maintainer routes are excluded. The public HTTP
request and response contract remains unchanged.

## Content changes

- Keep one canonical page per concept.
- Reuse commands and dependency snippets from `src/components/DocSnippets`.
- Put historical records under `docs/archive/`; archive routes are unlisted and
  emit `noindex`.
- Add redirects in `netlify.toml` when replacing a public route.
- Coordinate public behavior changes with a linked SHAFT_ENGINE pull request.
