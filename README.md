# SHAFT User Guide

This repository contains the canonical Docusaurus documentation site for
[SHAFT Engine](https://github.com/ShaftHQ/SHAFT_ENGINE), published at
[shaft-engine.automatest.org](https://shaft-engine.automatest.org).

The engine source of truth is
[ShaftHQ/SHAFT_ENGINE](https://github.com/ShaftHQ/SHAFT_ENGINE). This site owns
the public guide, reference material, integration docs, and maintainer runbooks.

## Local Development

Requirements:

- Node.js 20.
- Yarn.

```bash
yarn install
yarn start
```

The local Docusaurus server prints the browser URL after startup.

## Validate A Change

Run the full documentation contract before opening a pull request:

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

Broken Markdown links, duplicate content, retrieval tests, release template
checks, search exclusions, and rendering checks are release requirements.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the checkout, local setup,
validation, content, and pull request checklist.

Public SHAFT behavior changes should update this repository in the same delivery
as the engine change and link the engine pull request.

Cloudflare Pages builds with `yarn build`, publishes `build/`, and serves
`/api/gemini-proxy` for AutoBot. GitHub Pages can publish the same static output
as a fallback; Netlify can still host preview/static mirrors.
