# Apply notes — ChaosEngine page JSON-LD `@graph`

**Target page:** `https://shafthq.github.io/docs/agentic/chaos-engine` (`docs/agentic/chaos-engine.mdx`).  
**Optional mirrors:** install-guide + addons pages may keep BreadcrumbList only, or link FAQ to the main CE page (do not ship three divergent FAQ graphs).

## Live defect

CE docs pages currently inject the **site-wide SHAFT Engine** `SoftwareApplication` + `SoftwareSourceCode` + `Organization` headTags (see `audit/jsonld-ce-docs-*.json`). Crawlers therefore see the ChaosEngine URL as a SHAFT Java framework page. BreadcrumbList is CE-correct.

## Chosen shape

One page-level `@graph` (file `01-jsonld-graph.json`):

- Organization (ShaftHQ) — shared `@id` with pilot2
- Person (Mohab Mohie) — creator of SHAFT_ENGINE **and** ChaosEngine
- SoftwareApplication **ChaosEngine** (distinct `@id` under the CE URL)
- SoftwareSourceCode **chaos-engine** (tree URL, not a fake standalone repo)
- FAQPage — answers **byte-identical** to visible FAQ (`05`)

**No HowTo.**

## W1 — one `@graph` per CE page (dedupe)

On `/docs/agentic/chaos-engine` (and preferably `chaos-engine-install-guide`, `chaos-engine-addons`):

1. Emit the CE `@graph` from page frontmatter/`<Head>` / MDX once.
2. **Suppress or omit** the global SHAFT `SoftwareApplication` + `SoftwareSourceCode` headTags on those routes so the page is not dual-labeled as “SHAFT Engine”.
3. Keep a single BreadcrumbList (Docusaurus default is fine) **or** fold breadcrumbs into the same `@graph` — do not leave two competing SoftwareApplication names for the primary entity.
4. Do **not** paste the same FAQ graph into Squarespace `/chaosengine` without Coach (Automatest owns that surface).

## W2 — live-refresh stats before publish

- Graph ships snapshot `softwareVersion` **2026.10.31.5** (from `evidence/ce-VERSION.txt` @ 2026-10-31 13:33 Africa/Cairo). **Re-fetch VERSION at publish** and replace if newer; never leave a placeholder string in live HTML.
- Do **not** invent a ChaosEngine star count (CE is a subtree, not a separate repo). Parent SHAFT_ENGINE stars only if dated + sourced, preferably via badge.

## Riskiest assumption + check

Assumption: Docusaurus page Head can suppress config `headTags` for selected routes without breaking the homepage SHAFT graph.  
**Check after apply:** view-source on CE URL — parse all `ld+json`; expect ChaosEngine SoftwareApplication present; SHAFT Engine SoftwareApplication **absent** on that URL; FAQ answers == visible `<details>` bytes; `yarn build` smoke.
