# AGENTS.md

## Repository

This repository is the canonical Docusaurus site for SHAFT Engine, published at
`https://shaft-engine.automatest.org`. The engine source of truth is
`ShaftHQ/SHAFT_ENGINE` on its default `main` branch.

Primary content lives under:

- `docs/start/`, `docs/testing/`, `docs/agentic/`
- `docs/features/`, `docs/integrations/`, `docs/reference/`
- `docs/maintainers/` for operational guidance
- `docs/archive/` for historical, unlisted material

## Content Rules

- Keep one canonical page per concept. Merge overlapping material instead of
  copying prose or code blocks.
- Verify APIs, properties, commands, dependencies, and compatibility claims
  against executable engine source before documenting them.
- Read current releases from `src/data/releases.json`. Put recurring executable
  commands in `src/data/snippets.json` and render them through
  `src/components/DocSnippets`; do not duplicate those literals in pages.
- Use lowercase, hyphenated routes within the existing information
  architecture. Add redirects whenever a published route is replaced.
- Put historical records in `docs/archive/` with `unlisted: true`. Archive and
  maintainer content must remain excluded from public search and AutoBot;
  archive pages must emit `noindex, nofollow`.
- Preserve AutoBot's HTTP contract. Retrieval indexes Markdown and MDX by
  route, heading, and body, selects at most eight chunks, and caps context at
  80,000 characters. Normalize line endings and expand shared snippet
  components so retrieval behaves identically on Windows and Linux.
- Use source-backed claims only. Never restore unsupported adoption numbers,
  stale Java baselines, legacy coordinates as current guidance, secrets, or
  hardcoded "latest" versions.
- Before PRs, refresh graphify in this repo and `C:\Users\Mohab\IdeaProjects\SHAFT_ENGINE`
  when files or relationships change; use incremental if a graph exists,
  otherwise full extraction, and report backend/key blockers.

## Experience

- Lead with the shortest executable path, then progressively disclose detail.
- Prefer Docusaurus components, Mermaid, SVG, and real product evidence over
  decorative or text-heavy sections.
- Every major feature page should contain a useful diagram, screenshot, or
  compact comparison. Add descriptive alt text and captions.
- Preserve responsive layouts, dark mode, reduced-motion behavior, semantic
  HTML, and copyable language-tagged code blocks.

## Validation

Run the full documentation contract before finalizing substantive changes:

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

Broken Markdown links, duplicate-content checks, retrieval tests, release
template tests, desktop/mobile rendering, redirects, search exclusions, and
archive metadata are release requirements. For visual changes, inspect the
built page in a browser as well.

For coordinated engine changes, publish and verify the documentation deploy
preview first. Merge/deploy this site and confirm affected production routes
return HTTP 200 before merging dependent removal of engine-local documentation.
