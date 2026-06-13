# SHAFT documentation site

Canonical product documentation for [SHAFT Engine](https://github.com/ShaftHQ/SHAFT_ENGINE),
published at [shaftengine.netlify.app](https://shaftengine.netlify.app).

## Local development

Requirements: Node.js 20 and Yarn.

```bash
yarn install
yarn start
```

## Validate a change

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

Broken Markdown links fail the build. Public SHAFT behavior changes should update
this repository in the same delivery as the engine change.

## Content rules

- Keep one canonical page per concept.
- Put reusable commands and dependency snippets in `src/components/DocSnippets`.
- Put user documentation under `docs/`; retain historical records under the
  unlisted `docs/archive/` tree.
- Do not add unsupported adoption, performance, or compatibility claims.
- Use source-verified examples and link evidence for public claims.

Netlify builds with `yarn build` and publishes `build/`.
