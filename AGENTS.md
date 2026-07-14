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

## Graphify

- Before PRs, refresh graphify here and in `C:\Users\Mohab\IdeaProjects\SHAFT_ENGINE` when files or relationships change; use incremental if a graph exists, otherwise full extraction, and report backend/key blockers.

## Validation

- Substantive docs changes: `yarn test`, `yarn typecheck`, `yarn build`, `yarn test:playwright`.
- Visual changes: inspect the built page in a browser.

## Accessibility

- UI/visual doc-page changes: run the `a11ymcp` MCP server (configured in `.mcp.json`, npm `a11y-mcp-server`, axe-core based) against the affected built pages, complementing the heuristic `accessibility-review` skill.
- Treat axe-core violations as review evidence for the changed pages; the heuristic skill covers what automated rules cannot (focus order, meaningful labels, reduced-motion intent).
