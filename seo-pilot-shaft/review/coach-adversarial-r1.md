# REVIEW — SEO/AEO/GEO pilot 2 (shafthq.github.io) — Coach adversarial r1

- **Reviewer:** NEW independent adversarial (no prior involvement on this pilot)
- **Subject:** branch `seo-pilot-shaft` @ `e49f1ea605aa961a9e18bd9b67e9569b804e04c2`
- **Pack:** `seo-pilot-shaft/` (+ durable `/workspace/checkpoints/seo-pilot-shaft/`)
- **When:** 2026-10-31 13:25 Africa/Cairo (EET / UTC+2)
- **Scope:** plan + diffs only (no live publish; no PR)
- **Carl REVIEW.md:** not trusted; re-measured
- **retrieve:** used → graphify (hits: `build-llms-txt.mjs`, `seo-ai-visibility.test.js`, …); mempalace skipped(no-relevant-hits)
- **CE:** entry --full OK; doctor hosts recovery-required (pre-existing drift) — docs-only review proceeded

## Verdict: **FAIL**

One blocker in proposed schema copy. Facts, FAQ byte-match within the pack, identity, hard-rules, and llms preamble shape otherwise OK for a plan+diffs pack.

## Checklist

| Gate | Result | Notes |
|---|---|---|
| (1) Fact verification vs live | PASS w/ WARN | Live `gh` 2026-10-31 ~13:25 Africa/Cairo: stars **418**, latest **10.4.20261031**, releases.totalCount **228** — matches `evidence/gh-live-2026-10-31.json`. Maven Central `io.github.shafthq:shaft-engine` latest **10.4.20261031**. Legacy `SHAFT_ENGINE` POM is relocation-only (verified). MIT, Selenium ecosystem listing (Mohab Mohie), upgrade journey 200, creator on `/blog/welcome` — OK. **WARN:** entity page hardcodes stars/release numerics (`diffs/04-entity-page.md:22-23`); dated + “refresh on publish”, but prefer non-numeric / auto badge at apply. |
| (2) FAQ byte-match + tech | PASS | `check-faq-byte-match.py` OK. Live defect confirmed: visible Q2 ends with “Upgrade a project.” while `src/data/homepage-faqs.ts` answerText omits it — proposed answerText folds the phrase in (`05-homepage-faqs.ts:28-30`). Single-source rule documented. Answers match live install/upgrade/Maven docs (Java 25 via `project-signals`/`releases.json`; `shaft-bom`; relocation). **Apply must** render `{answerText}` (or linkify-without-mutate) or Q2 drift returns. |
| (3) `@graph` JSON-LD | **FAIL** | Parses; types Organization / Person / SoftwareApplication / SoftwareSourceCode / FAQPage; no HowTo; no aggregateRating; Offer price 0 only. **Blocker:** `SoftwareSourceCode.description` omits **desktop** while Organization, SoftwareApplication, FAQ Q1, and proposed llms preamble include desktop — see Defects. Dup `headTags` removal is notes-only (`01-apply-notes.md`); **build not run** (no `node_modules`); residual apply risk. |
| (4) llms.txt / llmstxt.org | PASS | Proposed preamble: H1 + blockquote summary + bullet links (product/source/Maven/creator) — fits llmstxt.org shape; no star totals in header (correct). Live llms.txt still thin / no Person — gap the patch targets. |
| (5) Clients / prices / secrets | PASS | No new client names beyond exclusion lists; no trainee counts; no secrets; OSS Offer 0 only. Existing community grid untouched. |
| (6) Arabic | N/A + gap | No AR copy in diffs. BASELINE AR query 6 (“أفضل إطار…”) still uncovered; EN entity/FAQ won’t close that SERP gap. |
| (7) Commit identity | PASS | Pilot commits `d708276d16`, `d6dab55ae1`, `e49f1ea605` all `ChaosEngine <chaosengine@mail.grokbot.com>`. Diff vs `origin/master` (`68d18cdf`) = `seo-pilot-shaft/**` only. |

## Defects (blocking)

1. **`seo-pilot-shaft/diffs/01-jsonld-graph.json:71`** — `SoftwareSourceCode.description` = “Web, Mobile, API, CLI, and Database” (no desktop). Sibling nodes + FAQ Q1 + `03-llms-header.md` include desktop. Align SourceCode description with the six-surface list before re-review.

## Nits / residual (non-blocking for re-review after #1)

1. **`diffs/04-entity-page.md:22-23`** — numeric stars/release will age; keep as-of **and** prefer shields/badge or build-time inject at apply (`09-project-signals.md` path).
2. **`PLAN.md:5` / `01-apply-notes.md:5`** — claimed base `f2509320a3` (#1167) is **not** on `origin/master`; actual merge-base is `68d18cdf`. headTags still ~L106–176 on current tree — fix the cited base SHA.
3. **Apply residual:** replace hardcoded FAQ `<p>` in `src/pages/index.tsx:261-263` with single-source `answerText`; remove config `headTags` JSON-LD when page `@graph` lands; `yarn build` + Rich Results after apply.
4. **AR SERP gap** unchanged (no AR FAQ/entity). Optional later.
5. **Channel strings** (`07`) human-only — OK.
6. Pack correctly **no HowTo**; robots AI ALLOW keep — OK.
7. Baseline correctly labelled **SERP proxy**, not AI-citation — OK.

## Measure log

```
gh api repos/ShaftHQ/SHAFT_ENGINE → stars 418
gh releases/latest → 10.4.20261031
graphql releases.totalCount → 228
Maven metadata shaft-engine latest → 10.4.20261031
SHAFT_ENGINE POM → distributionManagement.relocation → shaft-engine
json.loads 01-jsonld-graph.json → OK (5 types)
check-faq-byte-match.py → OK
live home FAQ Q2 visible ≠ answerText (drift) → confirmed
rg clients/prices/HowTo/ratings in diffs → exclusions + Offer 0 only
origin/master..HEAD authors → ChaosEngine ×3
git diff --name-only origin/master...HEAD → seo-pilot-shaft/** only
yarn build → skipped (no node_modules; proposal-only)
```

## Re-review ask

Fix Defect #1 only (SourceCode description desktop). Re-run flagged item. Then Coach can consider PASS for plan+diffs (publish still needs Mohab OK; apply still needs build proof).
