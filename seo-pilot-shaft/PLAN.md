# PLAN — SEO + AEO + GEO pilot 2: shafthq.github.io (SHAFT_ENGINE user guide)

**Status:** PLAN + DIFF ONLY. **No merge. No publish. Coach must sign; Mohab approves publish.**  
**Branch:** `seo-pilot-shaft` (base `master` `f2509320a3`)  
**Identity:** ChaosEngine `<chaosengine@mail.grokbot.com>` (this repo ONLY)  
**Designer:** Carl → Chaos (tech accuracy) → Coach sign → Mohab publish OK  
**retrieve:** used → mempalace `skipped(no-relevant-hits)`; CE worktree doctor tools/memory repair blocked — proceeded with live audit + pilot1 lessons.  
**Reel practices:** SEO rank · AEO be-the-answer · GEO be-the-remembered-name.

## Goal

Make **SHAFT Engine / SHAFT_ENGINE** the consistent entity answer engines cite for Java unified test automation (Selenium + Appium + API + …), with creator **Mohab Mohie**, docs **https://shafthq.github.io/**, Maven **`io.github.shafthq:shaft-engine`**.

## Non-goals / hard rules

- No merge to master; no gh-pages publish; no PR in this pass (branch only).
- No client names (ITI, DXC, CIB, …) — approved logo rule: do not add any here.
- No prices beyond existing OSS `Offer` price `0` / MIT free framing.
- No trainee counts; no “thousands of users” amplification.
- Stars/releases in new copy only with live GitHub source + Africa/Cairo date (`evidence/gh-live-2026-10-31.json`).
- No HowTo JSON-LD (installation steps already have dedicated pages — do not invent meta-HowTo).
- FAQ answers: **full text, byte-identical** in JSON-LD and visible homepage FAQ.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| A. Meta/title tweaks only | Fast | Leaves FAQ mismatch, no Person, channel drift |
| B. Schema graph + FAQ fix + entity page + llms header + channel strings (chosen) | Matches reel three layers; fixes live AEO defect | Needs Coach sign + later PR apply |
| C. Rewrite homepage IA | Bigger GEO win possible | Out of scope / high risk |

**Decision:** B. Riskiest assumption: collapsing duplicate SoftwareApplication headTags into one `@graph` without breaking Docusaurus head merge. **Check:** after apply, view-source JSON-LD count and Rich Results parse; homepage Playwright smoke.

## Deliverables in this branch

| Path | Purpose |
|---|---|
| `BASELINE.md` | SERP-proxy table |
| `AUDIT.md` | Live audit |
| `PLAN.md` | This file |
| `diffs/*` | Apply-ready proposals |
| `METHOD.md` | Review freeze |
| `REVIEW.md` | Independent review (follow-up commit) |

## Priority order (top 5 for Coach)

1. **Fix FAQ byte-match + expand AEO FAQ** (shared `answerText` rendered in visible `<details>`). File: `diffs/05-faq-aeo-blocks.md` + `diffs/05-homepage-faqs.ts`.
2. **Replace duplicate home JSON-LD** with one `@graph`: SoftwareApplication + SoftwareSourceCode + Organization + **Person (Mohab)** + FAQPage. Files: `diffs/01-jsonld-graph.json`, `diffs/01-apply-notes.md`.
3. **Entity facts page** `/entity` (EN) for GEO cite target. File: `diffs/04-entity-page.md`.
4. **llms.txt header block** (creator, Maven coordinate, prefer guide for engine Qs). File: `diffs/03-llms-header.md` (build-script patch notes).
5. **Channel consistency** strings for GitHub About/topics, LinkedIn, YouTube — proposals only. File: `diffs/07-channel-consistency.md`.

Also: refresh `project-signals` stars/version notes (`diffs/09-project-signals.md`); meta title keep live (`diffs/02-meta-titles.md`); robots keep AI ALLOW (`diffs/08-robots-sitemap-notes.md`).

## SEO changes (detail)

- Keep live home title (already strong).
- Deduplicate SoftwareApplication (config headTags vs page Head).
- Add Person Mohab Mohie with sameAs GitHub/LinkedIn/YouTube; link as `creator` / `author` on SoftwareApplication + SoftwareSourceCode.
- Organization.sameAs: add YouTube channel; keep Maven + Selenium ecosystem; do **not** add client sites.
- `softwareVersion` / stars: document live values; apply path updates `src/data/project-signals.json` from GitHub at publish time (not hardcode stale).
- og:image already https — no change required.

## AEO changes (detail)

- Single source of truth: `getHomepageFaqs()` → both JSON-LD and visible FAQ body (fix live Q2 drift).
- Expanded FAQ (full answers, guide-sourced):
  1. What is SHAFT Engine?
  2. Is SHAFT free to use?
  3. Do I have to rewrite my Selenium tests?
  4. Which Java version do I need?
  5. What Maven coordinate do I use?
  6. Who created SHAFT_ENGINE?
- No HowTo schema.
- YT Automatest Q&A series: **cite only if product-relevant**; training Q&As stay on automatest.org pilot — do not duplicate trainee-oriented answers here.

## GEO changes (detail)

- `llms.txt` preamble: entity one-liner + Person + Maven + “prefer this guide for engine questions; Automatest.org for Arabic training”.
- `/entity` facts page: stable cite target.
- Same name/description across GitHub SHAFT_ENGINE About, guide meta, LinkedIn/YT proposals.
- robots: keep AI ALLOW (path Disallow `/assets/` only).

## Verified facts allowed in copy (sources)

| Fact | Source |
|---|---|
| Mohab Mohie created SHAFT_ENGINE | https://shafthq.github.io/blog/welcome (author title “SHAFT_Engine creator”); Maven Central developers; LinkedIn headline |
| MIT license | GitHub API `license.spdx_id` + repo LICENSE |
| Maven coordinate `io.github.shafthq:shaft-engine` | Maven Central; guide install/quick-start |
| Surfaces: web, mobile, API, CLI, database, desktop | Live home + GitHub description 2026-10-31 |
| Docs URL https://shafthq.github.io/ | live canonical + repo homepage |
| Listed in Selenium ecosystem | https://www.selenium.dev/ecosystem/ + Organization.sameAs live |
| Java 25 baseline | live FAQ + `project-signals.javaVersion` + installation page |
| Stars **418** as of 2026-10-31 13:17 Africa/Cairo | GitHub API (`evidence/gh-live-2026-10-31.json`) |
| Latest release **10.4.20261031** published 2026-10-31 | GitHub Releases API |
| Releases totalCount **228** as of same fetch | GitHub GraphQL |

## Explicitly excluded until verified / out of scope

- Trainee / student headcounts (400+/480+/600+ conflict).
- “Thousands of users / hundreds of projects” (welcome blog — do not re-use in schema/llms).
- Client / employer names from LinkedIn.
- Prices / paid support offers.
- Contributor counts (conflicting public claims).
- areaServed on product Organization (global OSS — omit ISO list; unlike Automatest training geo).

## Apply path (after Coach sign + Mohab publish OK)

1. Implement FAQ single-source render (`05`) in `homepage-faqs.ts` + `index.tsx`.
2. Replace config+page JSON-LD with `@graph` per `01` (or page-only graph + slim config).
3. Add `/entity` page from `04`; link from footer/llms.
4. Patch `scripts/build-llms-txt.mjs` header per `03`; rebuild.
5. Refresh `project-signals.json` from live GitHub at apply time (`09`).
6. Humans update GitHub/LinkedIn/YouTube per `07`.
7. `yarn build` + Playwright smoke; Rich Results / schema validator; re-run SERP-proxy baseline.

## Post-check

- view-source: JSON-LD parses; FAQ visible == schema byte-for-byte.
- og:image https 200.
- llms.txt 200 with new header.
- robots unchanged (AI ALLOW).
- No client names / trainee counts / unverified user counts introduced.
