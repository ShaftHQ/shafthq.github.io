# User Guide Growth Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the SHAFT user guide so first-time visitors understand the value fast, start successfully, and have clear reasons to star the GitHub project.

**Architecture:** Keep the existing Docusaurus site and visual language. Prefer focused MDX/content changes, existing React components, and existing tests over new systems.

**Tech Stack:** Docusaurus 3, React 19, MDX/Markdown, existing docs quality tests, Playwright/SHAFT site smoke tests.

---

## User Stories and Acceptance Criteria

### Story 1: Complete the Properties Reference

As a SHAFT user configuring a project, I want every properties reference section to avoid unfinished placeholders so I can trust the guide.

Acceptance criteria:
- `docs/reference/properties/PropertiesList.mdx` contains no `Work In Progress` text.
- Each replaced tab gives either a runnable `-Dkey=value` example, a file-based `.properties` example, a code-based example, or a clear `N/A` explanation.
- `yarn test:docs` passes.

### Story 2: Improve the First-Run Path

As a new evaluator, I want installation to tell me what happens after generation so I can complete the first run without guessing.

Acceptance criteria:
- `docs/start/installation.mdx` explains expected `mvn test` outcome, generated report location, first-run generated files, and common blockers.
- The page still embeds the Project Generator and links to quick start, upgrade, and modules.
- The page includes at least one fenced command/example and related links.

### Story 3: Expand Thin Task Guides

As a first-time tester, I want the Web/API/CLI/DB task guides to show the first useful flow before sending me into reference pages.

Acceptance criteria:
- `docs/testing/web.mdx`, `docs/testing/api.mdx`, `docs/testing/cli.md`, and `docs/testing/database.md` each include setup, run, evidence/result, troubleshooting, and next-step guidance.
- Each page keeps focused examples and does not duplicate large reference content.
- `yarn test:docs` passes.

### Story 4: Refactor the Upgrade Guide for Scanning

As a maintainer upgrading an existing suite, I want the safest path, decision tree, rollback promise, and module map near the top.

Acceptance criteria:
- `docs/start/upgrade.mdx` starts with a compact decision section before deep reference material.
- The first screen includes the recommended command path and rollback behavior.
- Existing detailed sections remain available lower on the page.

### Story 5: Turn Reference Overview Into a Real Hub

As a user who knows what I want to do but not which reference page owns it, I want the reference overview to route me by task.

Acceptance criteria:
- `docs/reference/overview.md` includes an "I want to..." task router for browser, API, data, reporting, configuration, and flakiness work.
- The existing reference area table remains or is improved.
- The page keeps a fenced SHAFT example and public related links.

### Story 6: Source-Verify Java and Version Wording

As a user checking prerequisites, I want SHAFT's Java 25 baseline and third-party version requirements to be clearly separated.

Acceptance criteria:
- Public docs no longer imply SHAFT's current baseline is Java 8, 11, 17, or 21.
- Oracle/Grid/technology pages distinguish SHAFT runtime requirements from third-party driver compatibility.
- `src/data/releases.json` remains the single visible source for current SHAFT engine, Java, and Maven baseline snippets.

### Story 7: Consolidate Locator Reliability Guidance

As a web tester, I want one clear locator strategy path before choosing Smart Locators, Locator Builder, Playwright, or Heal.

Acceptance criteria:
- `docs/testing/web.mdx` includes a concise locator strategy section.
- Related locator pages link back to the canonical strategy or are linked from it.
- The guidance recommends semantic locators first, precise locator builder next, waits/retries as evidence, and Heal only after deterministic strategies.

### Story 8: Centralize Reusable Snippets

As a docs maintainer, I want recurring commands and dependency snippets centralized so release/version drift is harder.

Acceptance criteria:
- `src/data/snippets.json` and `src/components/DocSnippets/index.tsx` expose reusable snippets for first-run Maven, browser selection, Allure report path, and GitHub star URL.
- Start/testing pages use these snippets where they repeat commands or URLs.
- `yarn typecheck` passes.

### Story 9: Make the First Viewport Convert

As a first-time visitor, I want the first viewport to tell me what SHAFT is, why it beats plain tool wiring, and where to click next.

Acceptance criteria:
- The homepage hero includes a stronger "Create your first SHAFT project" CTA, a visible GitHub star CTA, proof/trust links, and a small before/after code comparison.
- Existing homepage tests still pass or are updated to assert the new conversion copy.
- Desktop and mobile screenshots show no clipping or overlap in the first viewport.

### Story 10: Add a Star-Worthy Quick Win Path

As an evaluator who just got a test running, I want a short success path that ends with evidence and a clear GitHub star prompt.

Acceptance criteria:
- The quick start includes a "3-minute useful test" or equivalent path with a real outcome: command, expected report/evidence, and next action.
- The success moment includes a clear GitHub star prompt without blocking the technical flow.
- Screenshot evidence is captured for the quick-start path and homepage star prompt for the PR.

## Implementation Tasks

- [x] Create reusable snippets for repeated first-run commands and URLs.
- [x] Update homepage hero copy, CTA structure, and responsive CSS.
- [x] Update start pages: overview, installation, quick start, and upgrade scanning intro.
- [x] Update testing pages: web, API, CLI, and database first-task guidance.
- [x] Update reference hub and targeted properties/version/locator content.
- [x] Add or update tests that assert growth CTAs, no properties WIP text, and important guide routes.
- [x] Run docs, typecheck, build, and rendered browser verification.
- [x] Capture screenshot evidence for all 10 stories.
- [ ] Open a PR whose description lists these 10 stories, acceptance criteria, and screenshot evidence.
