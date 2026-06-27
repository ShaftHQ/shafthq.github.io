# User Guide Landing UI Revamp Proposal

> **For agentic workers:** REQUIRED SUB-SKILL: Use `shaft-ui-design` before implementation. Use the existing homepage, CSS module, particle canvas, and tests before adding anything new.

**Goal:** Turn the user guide landing page into a memorable SHAFT entry point for technical evaluators and business stakeholders while preserving the established SHAFT color tokens.

**Architecture:** Keep the current Docusaurus page at `src/pages/index.tsx`. Reuse `ParticleBackground`, `useScrollReveal`, existing Font Awesome icons, existing test hooks, and `src/data/snippets.json`. Do not add a design system, chart library, or animation dependency.

**Current read:**
- The page already has pointer-reactive particles, scroll reveal, GitHub star hooks, onboarding CTAs, and proof links.
- The first viewport is clear but conservative: the right-side proof grid explains SHAFT, but it does not feel like a distinctive SHAFT product visual.
- Most lower sections are text-card grids. They scan well, but they do not show the technical flow or business value visually.
- Fast anchor jumps can briefly show a blank viewport while reveal opacity transitions in. The revamp should animate visible content, not hide whole sections until observers settle.
- Mobile keeps the hero readable, but removes the proof visual and turns lower content into large stacked cards.

## Proposed Direction

### Signature Visual: Evidence Command Center

Replace the hero proof card with a full-bleed evidence command center built from CSS and the existing canvas:
- left lane: engineer path from native tool call to SHAFT action to Allure evidence;
- right lane: business path from release risk to diagnosable evidence to faster decision;
- center: animated SHAFT evidence graph with Web, Mobile, API, DB, CLI, Doctor, and Heal nodes.

Keep particles reactive to pointer movement on desktop and touch/pointer movement on mobile. Use the existing canvas as the interaction layer; draw the command-center structure with semantic HTML and CSS so text stays selectable, accessible, and testable.

### Narrative Flow

1. Hero: "Ship automation evidence, not test plumbing."
2. Audience split: "For engineers" and "For leaders" with equal visual weight.
3. Visual charts:
   - surface coverage matrix for Web, Mobile, API, DB, CLI;
   - plumbing removed from test code: waits, config, reporting, screenshots, recovery;
   - evidence loop: fail, diagnose, heal, report.
4. Start path: generate project, run first test, inspect report.
5. Star moment: ask for the GitHub star after the user sees the successful first-run evidence.

### Interaction Rules

- Reveal content from `opacity: 1` with transform/detail enhancement, not from hidden blank sections.
- Respect `prefers-reduced-motion`; keep particles static and show all content immediately.
- Keep charts as deterministic CSS/HTML. Use no fake adoption numbers. Use sourced trust links only.
- Keep cards at 8px radius or less and avoid nested cards.
- Preserve the current color schema: `--site-color-primary`, `--site-color-deep`, `--site-color-deep-alt`, `--site-color-muted`, and dark-mode variants.

## Implementation Tasks

- [ ] Refactor `src/pages/index.tsx` hero into a full-bleed command-center layout.
- [ ] Add CSS-only chart sections in `src/pages/index.module.css`.
- [ ] Reuse `ParticleBackground`; only adjust props or event handling if mobile pointer reactivity needs a small fix.
- [ ] Change reveal styling so content never starts invisible during anchor jumps.
- [ ] Update homepage tests for the new CTAs, chart/test hooks, and mobile viewport checks.
- [ ] Capture desktop and mobile screenshots before and after implementation.

## Acceptance Criteria

- First viewport speaks to both engineers and business stakeholders without unsupported claims.
- Desktop and mobile hero show an actual SHAFT-specific visual, not only text cards.
- Scroll reveal and particles work on desktop and mobile and respect reduced motion.
- Getting-started flow ends in a clear GitHub star prompt after the first-run success path.
- `yarn test:homepage`, `yarn typecheck`, and rendered browser screenshots pass before PR review.
