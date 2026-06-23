# SHAFT User Guide

This repository contains the canonical Docusaurus documentation site for
[SHAFT Engine](https://github.com/ShaftHQ/SHAFT_ENGINE), published at
[shafthq.github.io](https://shafthq.github.io).

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

GitHub Pages publishes the public guide at `https://shafthq.github.io/`.
Cloudflare Workers hosts the AutoBot backend API and can serve the same static
build as a mirror; Netlify can still host preview/static mirrors.
