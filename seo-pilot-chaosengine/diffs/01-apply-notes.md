# Apply notes — ChaosEngine page JSON-LD `@graph`

**Target page:** `https://shafthq.github.io/docs/agentic/chaos-engine` (`docs/agentic/chaos-engine.mdx`).  
**Mirrors:** install-guide + addons + `/entity/chaos-engine` emit the same CE `@graph` (no divergent FAQ bodies).

## Live defect (pre-fix)

CE docs pages injected the **site-wide SHAFT Engine** `SoftwareApplication` + `SoftwareSourceCode` headTags. Crawlers therefore saw the ChaosEngine URL as a SHAFT Java framework page.

## Landed mechanism (Chaos tech review PASS)

1. **Suppress:** `src/theme/ProductJsonLd.tsx` + mount from `src/theme/Root.tsx` — SHAFT SoftwareApplication + SoftwareSourceCode emit on all routes **except** `/docs/agentic/chaos-engine*` and `/entity/chaos-engine*`. Organization stays in `docusaurus.config.js` headTags (pilot2-exact `@id` / description / sameAs).
2. **Emit:** CE page `@graph` from `src/data/chaosengine-jsonld.ts` via DocItem Metadata on CE docs routes and via `<Head>` on `src/pages/entity/chaos-engine.tsx`.
3. BreadcrumbList remains from DocItem (CE-correct).
4. Do **not** paste the same FAQ graph into Squarespace `/chaosengine` without Coach.

Patch source of truth for suppress: `seo-pilot-chaosengine/build-proof/suppress-mechanism.patch` (Chaos). Keep pilot3 rebaseable on `seo-shaft-apply` (pilot2).

## Chosen `@graph` shape (`01-jsonld-graph.json`)

- Organization (ShaftHQ) — **exact pilot2** payload / `@id`
- Person (Mohab Mohie) — **exact pilot2** payload / `@id`
- SoftwareApplication **ChaosEngine** (no spaced `"Chaos Engine"` alternateName)
- SoftwareSourceCode **chaos-engine**
- FAQPage — answers **byte-identical** to visible FAQ (`05`)

**No HowTo.** Disambiguation sentence in SA/SSC/`en-what`/`en-shaft`/`en-who`/`ar-what`/`ar-who` descriptions: “ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game.”

## W2 — live-refresh stats before publish

- Graph ships snapshot `softwareVersion` **2026.10.31.5**. **Re-fetch VERSION at publish** and replace if newer (2026.10.31.6 pending); never leave a placeholder string in live HTML.
- Do **not** invent a ChaosEngine star count (CE is a subtree, not a separate repo).

## Check after apply

view-source on CE URL — parse all `ld+json`; expect ChaosEngine SoftwareApplication present; SHAFT Engine SoftwareApplication **absent** on that URL; FAQ answers == visible `<details>` bytes; homepage still has SHAFT SA; `yarn build` smoke.
