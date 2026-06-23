---
id: site-operations
title: Documentation site operations
description: Develop, validate, and deploy the canonical SHAFT documentation site.
slug: /maintainers/site-operations
sidebar_position: 2
tags: [maintainers, docusaurus, cloudflare-pages, github-pages, netlify]
---

# Documentation site operations

The Docusaurus repository is the canonical source for SHAFT product,
architecture, usage, migration, and maintainer documentation. The canonical
public URL is
[shaft-engine.automatest.org](https://shaft-engine.automatest.org).

Cloudflare Pages publishes the static guide and the `/api/gemini-proxy`
function for this domain. Netlify and GitHub Pages may still serve mirrors, but
the custom domain must not CNAME to Netlify while Egyptian consumer ISPs cannot
reach Netlify edge IPs.

## Local development

Use Node.js 20 and Yarn:

```bash
yarn install
yarn start
```

Cloudflare Pages uses `wrangler.toml`, builds with `yarn build`, publishes
`build/`, and serves `functions/api/gemini-proxy.js` at `/api/gemini-proxy`.
Set `GEMINI_API_KEY` in Cloudflare Pages environment variables; do not commit it.

Netlify uses `yarn build`, publishes `build/`, and serves functions from
`netlify/functions/`. `GEMINI_API_KEY` belongs in the Netlify environment; it
must never be embedded in the browser bundle.

GitHub Pages uses `.github/workflows/deploy.yml` and publishes `build/` as a
static-only fallback at `https://shafthq.github.io/`.

## Egypt accessibility

If Egyptian users cannot open the guide, test both providers before changing
site code:

```bash
curl -4 -I https://shaft-engine.automatest.org/
curl -4 -I https://shafthq.github.io/
```

On 2026-06-23, Cairo probes on Link Egypt timed out against Netlify while
Cloudflare and GitHub Pages returned HTTP 200. The recovery path is to publish
the guide and `/api/gemini-proxy` on Cloudflare Pages and point DNS for
`shaft-engine.automatest.org` at Cloudflare, not at the Netlify default
hostname.

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
removes `/docs/archive/` and `/docs/maintainers/` entries. Because search is
static, it works anywhere the Docusaurus assets load.

AutoBot indexes Markdown and MDX by route and heading at startup, retrieves the
eight best chunks for each question, and caps injected documentation context at
80,000 characters. `yarn build` writes `static/autobot-index.json`; the
Cloudflare function fetches that static index at runtime, so AutoBot does not
depend on Netlify filesystem access. Archive and maintainer routes are
excluded. The public HTTP request and response contract remains unchanged.

## Content changes

- Keep one canonical page per concept.
- Reuse commands and dependency snippets from `src/components/DocSnippets`.
- Put historical records under `docs/archive/`; archive routes are unlisted and
  emit `noindex`.
- Add redirects in `netlify.toml` when replacing a public route.
- Coordinate public behavior changes with a linked SHAFT_ENGINE pull request.
