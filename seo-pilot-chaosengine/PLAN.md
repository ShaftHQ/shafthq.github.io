# PLAN — SEO + AEO + GEO pilot 3: ChaosEngine

**Status:** PLAN + DIFF ONLY. **No merge. No publish. No PR in this pass.** Coach must sign; Chaos tech-checks; Mohab approves publish.  
**Branch:** `seo-pilot-chaosengine` (merge-base `origin/master` **`f2509320a3`**)  
**Identity:** ChaosEngine `<chaosengine@mail.grokbot.com>` (ShaftHQ/shafthq.github.io ONLY for this commit)  
**Designer:** Carl → Chaos (tech accuracy) → Coach sign (Automatest bits) → Mohab publish OK  
**retrieve:** used → mempalace hit `seo-basics.md`; see `evidence/retrieve-mempalace.txt`.  
**Reel practices:** SEO rank · AEO be-the-answer · GEO be-the-remembered-name.

## Goal

Make **ChaosEngine** the consistent entity answer engines cite for:  
**“MIT-licensed provider-neutral portable working contract / agent harness by Mohab Mohie (ShaftHQ), shipped as `chaos-engine/` inside SHAFT_ENGINE — not a chaos-engineering tool and not the 1993 game.”**

Canonical description:

> MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE.

## Non-goals / hard rules

- No merge to master; no gh-pages publish; no PR in this pass (branch only).
- No client names; no prices beyond OSS `Offer` price `0`; no trainee counts; no bio weekly-user claims; no “أول وأكبر”.
- Version in new copy only with live `chaos-engine/VERSION` + Africa/Cairo date (`evidence/`).
- No HowTo JSON-LD (install steps already have dedicated pages — do not invent meta-HowTo).
- FAQ answers: **full text, byte-identical** in JSON-LD and visible FAQ.
- One `@graph` per CE page (W1); live-refresh VERSION (W2).
- Do not invent a standalone ShaftHQ/ChaosEngine repository.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| A. Meta description tweak only | Fast | Leaves wrong SHAFT schema on CE URL; no FAQ; Arabic creator SERP still fails |
| B. CE `@graph` + FAQ + entity page + llms block + Automatest https/og notes + README note (chosen) | Matches reel three layers; fixes live schema defect; disambiguates game/category | Needs Coach for Squarespace; needs suppress of global SHAFT headTags on CE routes |
| C. Split CE to its own GitHub repo + site | Cleaner product SEO | Out of scope / irreversible product decision |

**Decision:** B. Riskiest assumption: suppressing site-wide SHAFT headTags on CE routes without breaking homepage SHAFT graph. **Check:** view-source CE URL vs home after apply; Rich Results parse; `yarn build`.

## Deliverables in this branch

| Path | Purpose |
|---|---|
| `BASELINE.md` | SERP-proxy table EN+AR |
| `AUDIT.md` | Live multi-surface audit |
| `PLAN.md` | This file |
| `diffs/*` | Apply-ready proposals |
| `METHOD.md` | Review freeze |
| `review/indep-r1.md` | Independent adversarial self-check |
| `evidence/*` | VERSION + GitHub snapshot |

## Priority order (top 5 for Coach / Chaos)

1. **Replace CE-page JSON-LD** with one ChaosEngine `@graph` (SoftwareApplication + SoftwareSourceCode + Organization + Person + FAQPage). Files: `diffs/01-jsonld-graph.json`, `diffs/01-apply-notes.md`. **W1** suppress SHAFT SoftwareApplication/SourceCode headTags on CE routes.
2. **Add visible FAQ (EN+AR)** with answers byte-identical to FAQPage — especially AR “مين عمل ChaosEngine؟”. Files: `diffs/05-*`.
3. **Entity facts page** `/entity/chaos-engine`. File: `diffs/04-entity-page.md`.
4. **llms.txt ChaosEngine block** + meta description → canonical. Files: `diffs/03-llms-header.md`, `diffs/02-meta-titles.md`.
5. **Automatest `/chaosengine`:** https og:image + CE schema/meta align (Coach). File: `diffs/06-automatest-chaosengine.md`.

Also: channel consistency (`07`); robots/sitemap keep AI ALLOW (`08`); VERSION refresh (`09`); README cross-repo note (`10`).

## SEO changes (detail)

- Keep live CE title.
- Replace meta description with canonical string.
- Deduplicate wrong SHAFT schema on CE URLs; emit CE SoftwareApplication/SourceCode.
- og:image guide already https; Automatest must go https.
- Parent stars only as dated parent-repo metric if shown at all.

## AEO changes (detail)

- Single source `05-faqs.json` → visible `<details>` + FAQPage.
- Eight FAQs (5 EN + 3 AR) covering what / free / vs SHAFT / install pointer / who.
- No HowTo schema.
- YT/Automatest training Q&As stay on automatest pilot — do not duplicate trainee-oriented answers here.

## GEO changes (detail)

- llms ChaosEngine block with creator + tree URL + disambiguation handoffs.
- `/entity/chaos-engine` stable cite target (separate from pilot2 `/entity` for SHAFT).
- Same name/description across guide meta, README note, Automatest proposal, channels.
- robots: keep AI ALLOW on guide; Automatest keep path-only Disallows.

## Verified facts allowed in copy (sources)

| Fact | Source |
|---|---|
| ChaosEngine = provider-neutral portable working contract / agent harness | README; guide transcript/body; INSTALL.md |
| MIT license | chaos-engine/LICENSE |
| Ships as `chaos-engine/` inside ShaftHQ/SHAFT_ENGINE (not standalone ShaftHQ repo) | GitHub tree; org search total_count 0 for ChaosEngine |
| Docs URL https://shafthq.github.io/docs/agentic/chaos-engine | live canonical + sitemap |
| Arabic intro https://www.automatest.org/chaosengine | live 200 |
| Hosts: Codex, Claude, Gemini, Grok, GitHub Copilot | guide + README |
| Creator Mohab Mohie / ShaftHQ | github.com/MohabMohie profile text; repo ownership |
| VERSION **2026.10.31.5** as of 2026-10-31 13:33 Africa/Cairo | raw VERSION + evidence |
| Parent SHAFT_ENGINE stars **418** same fetch | GitHub API — parent only |

## Explicitly excluded

- Trainee / student headcounts; “thousands of users”; LinkedIn weekly-user claims.
- Client / employer names.
- Prices / paid support.
- “أول وأكبر” / unsourced best-of claims.
- HowTo JSON-LD.
- Treating unrelated GitHub “ChaosEngine” game repos as this product.

## Apply path (after Coach sign + Mohab publish OK)

1. Implement FAQ single-source on `chaos-engine.mdx` (`05`).
2. Page `@graph` per `01`; suppress global SHAFT Software* headTags on CE routes (W1).
3. Add `/entity/chaos-engine` from `04`; link from CE docs footer/llms.
4. Patch `scripts/build-llms-txt.mjs` header/section per `03`; rebuild.
5. Set description frontmatter per `02`; refresh VERSION into schema (`09`).
6. Coach: Automatest https og:image + CE meta/schema (`06`).
7. Optional follow-up PR on SHAFT_ENGINE README (`10`) with ChaosEngine identity.
8. `yarn build` + smoke; schema validator; re-run SERP-proxy baseline R1–R5.

## Post-check

- view-source CE URL: JSON-LD parses; ChaosEngine SoftwareApplication present; SHAFT Engine SoftwareApplication absent on that URL; FAQ visible == schema byte-for-byte.
- og:image https 200 (guide + Automatest).
- llms.txt 200 with CE block.
- robots unchanged (AI ALLOW).
- No client names / trainee counts / superlatives / HowTo introduced.
