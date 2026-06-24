---
unlisted: true
tags: [superpowers-plan]
---

# Flakiness Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one source-backed public guide explaining how SHAFT reduces common UI and execution flakiness.

**Architecture:** Keep the guide in the existing `Testing` section and link to detailed reference pages for Smart Locators, ARIA locators, natural-language actions, explicit waits, retry configuration, reporting, and SHAFT Heal. Avoid new components; a Mermaid flow diagram satisfies the feature-page visual requirement.

**Tech Stack:** Docusaurus Markdown/MDX, Mermaid, existing docs tests.

---

### Task 1: Add The Guide

**Files:**
- Create: `docs/testing/flakiness.mdx`
- Modify: `sidebars.js`

- [ ] **Step 1: Create the flakiness guide**

Create `docs/testing/flakiness.mdx` with front matter, a Mermaid flow, source-backed explanation, Java and properties examples, and related links.

- [ ] **Step 2: Add it to the Testing sidebar**

Add `testing/flakiness` after `testing/web` in `sidebars.js`.

- [ ] **Step 3: Run focused docs validation**

Run: `yarn test:docs`

Expected: documentation loader, retrieval, quality, properties, and duplicate checks pass.

- [ ] **Step 4: Run full docs contract**

Run:

```bash
yarn test
yarn typecheck
yarn build
yarn test:playwright
```

Expected: all commands exit 0. If Playwright cannot run because browsers or local ports are unavailable, report the blocker with the earlier passing checks.
