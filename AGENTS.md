# AGENTS.md

## Defaults

- Speak less. Do more.
- This repo is the canonical Docusaurus site for SHAFT Engine at `https://shafthq.github.io`.
- Engine source of truth: `ShaftHQ/SHAFT_ENGINE` default `main`.
- Keep scope tight, preserve user work, and use source-backed claims only.

## Content

- Main docs live under `docs/start/`, `docs/testing/`, `docs/agentic/`, `docs/features/`, `docs/integrations/`, `docs/reference/`, and `docs/maintainers/`.
- Keep one canonical page per concept; merge overlaps instead of copying prose or code.
- Verify APIs, properties, commands, dependencies, and compatibility against executable engine source.
- Put recurring executable commands in `src/data/snippets.json` and render through `src/components/DocSnippets`.
- Preserve AutoBot's HTTP contract, search exclusions, archive `noindex`, redirects, responsive behavior, dark mode, reduced motion, semantic HTML, and copyable fenced code.
- Never restore unsupported adoption numbers, stale Java baselines, legacy coordinates as current guidance, secrets, or hardcoded "latest" versions.
- `DESIGN_LANGUAGE.md` is the canonical style authority: palette and typography tokens, admonition severity, and the binding prose rules. Read it before writing docs prose or changing visible styling.

## Graphify

- Query Graphify only when it answers a concrete structure question. Treat a
  shared cache as an untrusted lead, verify returned paths in live files, and
  use targeted `rg` before concluding blast radius.
- Missing, stale, timed-out, or inaccessible caches never block ordinary task
  work or completion. Do not refresh, repair, poll, or watch Graphify per task.
- Explicit maintenance runs from the repository's primary checkout through
  the repository-owned controller with a relative `--root`. Linked worktrees
  only read the shared cache. Maintenance and doctor failures remain strict.

## Validation

- Substantive docs changes: `yarn test`, `yarn typecheck`, `yarn build`, `yarn test:playwright`.
- Visual changes: inspect the built page in a browser.

## Accessibility

- UI/visual homepage changes: run `yarn build` and then `yarn test:a11y`. The
  command uses headless Playwright-managed Chromium and axe-core; it does not
  use an installed browser or ChromeDriver.
- Treat axe-core violations as review evidence for the changed pages; the heuristic skill covers what automated rules cannot (focus order, meaningful labels, reduced-motion intent).
