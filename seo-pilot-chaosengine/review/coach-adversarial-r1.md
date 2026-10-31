# Coach adversarial review — seo-pilot-chaosengine r1

**Verdict: FAIL**  
**Reviewer:** Coach (fresh independent adversarial; Carl `review/indep-r1.md` not trusted)  
**When:** 2026-10-31 13:44 Africa/Cairo (EET / UTC+2)  
**Tip under test:** `2f001e055e9c910cb3fa27e1a0c8e3131e6b919a` (`seo-pilot-chaosengine`)  
**Claimed base:** `f2509320a39b1d794dd382cafd948d293c58b9fc`  
**Real merge-base vs `origin/master`:** `f2509320a39b1d794dd382cafd948d293c58b9fc` (**matches claim**; prior “f2509320 not on origin/master” is stale — it is now `origin/master` HEAD)  
**Diff vs `origin/master`:** **only** `seo-pilot-chaosengine/**` (81 files). **No unrelated site/source changes.**  
**Identity:** all 6 tip commits `ChaosEngine <chaosengine@mail.grokbot.com>` — PASS  
**Mode:** plan + diffs only (no applied Docusaurus/MDX patch on tip)  
**retrieve:** used (mempalace + graphify) at review start; live `chaos-engine/VERSION` + GitHub API re-checked this turn.

## Checklist

| # | Criterion | Result |
|---|---|---|
| 1 | CE facts vs live `chaos-engine/` (VERSION 2026.10.31.x, features, license) | **PASS** (facts OK; see nits) |
| 2 | 8 EN+AR FAQ byte-equal JSON-LD vs source; tech OK; natural AR; no unsourced superlatives | **PASS** byte-match + content; **FAIL** disambiguation gap → B1 |
| 3 | CE `@graph` valid; CE routes no SHAFT `SoftwareApplication`; Org `@id` consistent with pilot2 | **FAIL** — B2 + B3 |
| 4 | AR SERP gap / 1993 game handled by disambiguation text, not misleading | **FAIL** — B1 |
| 5 | llms.txt / entity proposals | **PASS** shape; **FAIL** missing disambiguation in proposed user-facing blurbs → B1 |
| 6 | `yarn build` / docusaurus build exit 0 on tip; count `ld+json` per CE route | **PASS** build; **FAIL** route payload still SHAFT-only → B3 |
| 7 | No clients/prices/secrets; ChaosEngine identity | **PASS** |
| 8 | `diffs/06` Automatest og:image = proposal only (nothing applied to Squarespace) | **PASS** |

## Blockers

### B1 — 1993-game disambiguation absent from user-facing copy (check 4 / 2 / 5)

**Required by pack itself:** `diffs/07-channel-consistency.md:24-26` says every long-form blurb must state (1) not the 1993 Bitmap Brothers game, (2) not chaos-engineering / fault-injection, (3) not a standalone ShaftHQ repo.

**Actual user-facing proposals — zero hits** for `1993|Bitmap|The Chaos Engine|chaos-engineering|fault-injection` in:

- `diffs/05-faqs.json` (all 8 answers) — including **`ar-who`** which is explicitly aimed at BASELINE query “مين عمل ChaosEngine” (game Wikipedia wins)
- `diffs/05-chaosengine-faqs.ts` (same strings)
- `diffs/01-jsonld-graph.json` SoftwareApplication / SoftwareSourceCode / FAQPage texts
- `diffs/04-entity-page.md` H1/lead/body table (only the *why-path* meta sentence mentions 1993; not the citeable lead)
- `diffs/03-llms-header.md` proposed `## ChaosEngine` block

**Aggravator:** `01-jsonld-graph.json:36-39` / `:63-66` set `alternateName` to `"Chaos Engine"` (spaced), which **increases** collision with the game title without any disambiguation sentence beside it.

**Fix:** Add one explicit disambiguation sentence (EN + AR) into: entity lead, llms block, JSON-LD `description`s, and at least `en-what` + `ar-what` + `ar-who` FAQ answers (then re-run byte-match). Drop or qualify spaced `"Chaos Engine"` alternateName unless disambiguation is present.

### B2 — Shared `@id` payloads conflict with pilot2 (check 3)

Same `@id`s as signed pilot2, different bodies:

| Node | `@id` | pilot2 | pilot3 |
|---|---|---|---|
| Organization | `https://shafthq.github.io/#organization` | SHAFT-only description; sameAs includes Maven Central + Selenium | description adds ChaosEngine; drops Maven/Selenium sameAs (`01-jsonld-graph.json:5-17`) |
| Person | `https://shafthq.github.io/#person-mohab-mohie` | url `/entity`; jobTitle “Creator of SHAFT_ENGINE”; SHAFT-only description | url `/entity/chaos-engine` (`:22`); jobTitle includes ChaosEngine (`:23`); CE-inclusive description (`:24`) |

When both pilots apply, crawlers see **conflicting JSON-LD for the same `@id`**. Carl’s open Q2 acknowledges this; it is still a **sign blocker**.

**Fix:** One unified Organization + Person payload shared by pilot2+3 (or CE page must not re-emit Org/Person with divergent fields — reference SHAFT Org `@id` only).

### B3 — W1 not implemented; tip CE routes still emit SHAFT Engine schema (check 3 / 6)

- Tip is **plan+diffs only** — no `docusaurus.config.js` / MDX Head change on branch.
- Independent build this turn: `./node_modules/.bin/docusaurus build` → **exit 0** (`evidence/yarn-build-tip-2f001e05.log`).
- Built CE routes (`build/docs/agentic/chaos-engine.html`, `-install-guide.html`, `-addons.html`): **`ld+json` count = 4** each:
  1. BreadcrumbList (CE-correct)
  2. **SoftwareApplication name=`SHAFT Engine`**
  3. Organization ShaftHQ
  4. **SoftwareSourceCode name=`SHAFT_ENGINE`**
- **ChaosEngine SoftwareApplication count = 0** on all three CE routes.
- Live audit snapshots agree (`audit/jsonld-ce-docs-1.json` etc.).
- Apply notes ask *how* to suppress (`01-apply-notes.md` + Carl Q1) but ship **no concrete patch**. Claiming “Fixes: CE docs emit SHAFT schema → CE `@graph`” is **not true of tip as built**.

**Fix:** Land an implementable suppress (route filter or page Head override) + CE `@graph` emission in-repo; re-build; prove CE routes have ChaosEngine SA and **no** SHAFT Engine SA / SHAFT FAQPage; keep homepage SHAFT graph intact.

## Non-blocking nits

- N1 — EN article: “a MIT-licensed” → “an MIT-licensed” (`01-jsonld-graph.json:42`, FAQ `en-what`, etc.). Same slip exists in pilot2.
- N2 — AR register drift: FAQ uses Egyptian `بيثبّت` / `بيتشحن`; channel one-liner (`07:8`) uses `يثبّت` without `بـ`. Pick one register.
- N3 — FAQ `en-install` phrase “Full silent step loops” is awkward; prefer “full step-by-step loops” / point at install-guide title only.
- N4 — Large Squarespace HTML under `audit/` (weight only).
- N5 — `softwareVersion` snapshot `2026.10.31.5` matches live `chaos-engine/VERSION` and raw GitHub **this turn**; keep W2 re-fetch-at-publish rule.

## Checks that passed (evidence)

1. **Facts:** VERSION `2026.10.31.5`; MIT (`chaos-engine/LICENSE`); hosts Codex/Claude/Gemini/Grok/GitHub Copilot in README/INSTALL; ships as subtree (no standalone ShaftHQ/ChaosEngine repo claimed); Mohab GitHub bio matches creator FAQ wording; parent stars 418 dated in evidence only (not as CE metric). Offer `price:0` only.
2. **FAQ byte-match:** independent re-run — 8/8 question+answer strings equal across `05-faqs.json`, `05-chaosengine-faqs.ts`, and FAQPage in `01-jsonld-graph.json`. No HowTo. No “أول وأكبر” / trainee / client leakage in proposed copy (exclusion lines only).
3. **Arabic:** colloquial Egyptian, readable, no unsourced superlatives.
5. **llms/entity:** proposed paths and canonical blurb consistent with pack goal; entity correctly refuses CE star count.
6. **Build:** exit 0 on tip (see evidence log). Counts above document remaining SHAFT labeling.
7. **Identity / secrets:** ChaosEngine author on all tip commits; no secrets/credentials in pack.
8. **`diffs/06-automatest-chaosengine.md`:** explicitly Coach-owned proposal; “this guide branch only proposes copy”; no Squarespace apply claimed or evidenced.

## Base / scope note

Prior review warned `f2509320` missing from `origin/master`. **As of this review** `origin/master` == `f2509320`; merge-base matches Carl’s claim; tip introduces **no** unrelated files outside `seo-pilot-chaosengine/`.

## Open questions (Carl) — reviewer stance

1. Suppress method — **must be answered with code before sign** (B3).
2. Unify Org `@id` — **required** (B2).
3. `/entity/chaos-engine` vs section — path OK once B1/B2 fixed; keep separate from pilot2 `/entity`.
4. Automatest schedule — out of this branch; `06` stays proposal (PASS for check 8).
5. SE README blurb (`10`) — separate CE-identity PR; OK as note-only.

## Verdict

**FAIL** — fix B1, B2, B3; re-review flagged items only.

**Review commit target:** this file on `review/seo-pilot-chaosengine-r1` (local only, no push).  
**Durable copy:** `/workspace/checkpoints/seo-pilot-chaosengine/review/coach-adversarial-r1.md`
