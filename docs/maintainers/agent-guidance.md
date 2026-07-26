---
id: agent-guidance
title: Agent guidance maintenance
description: Keep repository agent instructions concise, validated, and current.
slug: /maintainers/agent-guidance
tags: [maintainers, agents]
---

# Agent guidance maintenance

## Goal

Keep automatically loaded guidance small, stable, and repository-specific.
Executable configuration is authoritative; volatile details and long
procedures belong in runbooks or skills.

## Ownership

This repository's own canonical guidance lives here:

| Content | Canonical location |
|---|---|
| Repository identity, defaults, content rules, validation | `AGENTS.md` |
| Style authority: palette, typography tokens, prose rules | `DESIGN_LANGUAGE.md` |
| Host-only behavior | `.github/copilot-instructions.md` |
| Product and maintainer documentation | Docusaurus routes under `docs/` |
| Executable behavior and history | `ShaftHQ/SHAFT_ENGINE` (a separate repository) configuration, source, and Git history |

`ShaftHQ/SHAFT_ENGINE` keeps its own agent-guidance layout, referenced above
but not present in this repository:

| Content | Canonical location in `SHAFT_ENGINE` |
|---|---|
| Repository identity, global safety, routing, validation | `AGENTS.md` |
| Host-only behavior | `CLAUDE.md` |
| Codex skill discovery metadata | `.agents/skills/*/SKILL.md` |
| Production and test Java rules | `.github/instructions/*.instructions.md` |
| CI, flaky-test, and release workflows | `.github/skills/*/SKILL.md` |

Codex bridge skills in `SHAFT_ENGINE` contain frontmatter and a link to one
canonical rule file; they do not copy the canonical body into
`.agents/skills/`.

## Update Rules

1. Add a durable rule only when it is recurring, repository-specific, and not
   already enforced by executable configuration.
2. Put it in the narrowest owning surface. Keep generic agent behavior out of
   repository guidance.
3. Replace or remove an existing rule instead of adding another version.
4. Keep dates, incidents, volatile versions, long examples, and session logs
   outside automatically loaded files.
5. Use task skills for procedures and path-scoped instructions for Java rules.
6. Update a Codex bridge description when its trigger changes, but keep the
   bridge body minimal.
7. Link a documentation-site pull request for public behavior changes. Do not
   add public guides or non-root READMEs to SHAFT_ENGINE.

## Audit

This repository's own checks run via `yarn test` (including
`tests/docs-quality.test.js`, which enforces the admonition vocabulary and
content style guide rules from `DESIGN_LANGUAGE.md`), `yarn typecheck`, and
`yarn build`:

```bash
yarn test
yarn typecheck
yarn build
```

`ShaftHQ/SHAFT_ENGINE` runs a separate audit against its own agent-guidance
corpus, not present in this repository:

```bash
python3 scripts/ci/validate_agent_guidance.py
python3 -m unittest tests.scripts.test_validate_agent_guidance
git diff --check
```

Budgets and routing rules for that audit live in
`scripts/ci/agent_guidance_budget.json` in `SHAFT_ENGINE`. It checks file and
host context budgets, both skill roots, local links, path scopes, stale
references, costly mandates, duplicate paragraphs, and the manual
paid-refresh gate; its refresh workflow runs only by manual dispatch, and
invokes paid AI review only when the deterministic audit fails or a
maintainer supplies a reason and forces review.
