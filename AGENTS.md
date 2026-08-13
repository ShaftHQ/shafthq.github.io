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

- Before PRs, refresh Graphify for every changed repository from that
  repository's primary checkout. Use the repository-owned maintenance
  controller with an explicit, relative `--root`; linked worktrees only read
  the shared cache. Report tool, parser, and cache blockers.

## Validation

- Substantive docs changes: `yarn test`, `yarn typecheck`, `yarn build`, `yarn test:playwright`.
- Visual changes: inspect the built page in a browser.

## Accessibility

- UI/visual homepage changes: run `yarn build` and then `yarn test:a11y`. The
  command uses headless Playwright-managed Chromium and axe-core; it does not
  use an installed browser or ChromeDriver.
- Treat axe-core violations as review evidence for the changed pages; the heuristic skill covers what automated rules cannot (focus order, meaningful labels, reduced-motion intent).
