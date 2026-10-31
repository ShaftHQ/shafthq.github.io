# GEO — Entity facts page (`/entity/chaos-engine`)

**Landed:** `src/pages/entity/chaos-engine.tsx` at `https://shafthq.github.io/entity/chaos-engine`.
Emits CE page `@graph` (same payload as docs) after ProductJsonLd suppress.

**Why a separate path:** Pilot2 proposes `/entity` for SHAFT Engine. ChaosEngine needs its own stable cite target so answer engines do not collapse CE into the 1993 Bitmap Brothers game or into SHAFT the Java engine.

## H1

ChaosEngine — entity facts

## Lead (canonical)

**MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game.**

Also state: not chaos-engineering / fault-injection; not a standalone ShaftHQ repo.

## Body table (verified only)

| Fact | Value | Source |
|---|---|---|
| Name | ChaosEngine (`chaos-engine`) | Guide + README + LICENSE |
| Type | Provider-neutral agent harness / portable working contract | README; guide |
| License | MIT | `chaos-engine/LICENSE`; GitHub contents API |
| Source tree | https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine | GitHub (not a standalone repo) |
| Docs | https://shafthq.github.io/docs/agentic/chaos-engine | live canonical |
| Install guide | https://shafthq.github.io/docs/agentic/chaos-engine-install-guide | live |
| Arabic intro | https://www.automatest.org/chaosengine | live Automatest |
| Creator | Mohab Mohie (ShaftHQ) | github.com/MohabMohie profile (“create and maintain SHAFT_ENGINE and the ChaosEngine overlay”); LinkedIn posts (cite carefully — no superlatives) |
| Version | **Prefer live** from `chaos-engine/VERSION`. Pilot snapshot: **2026.10.31.5** as of 2026-10-31; **refresh at publish** (2026.10.31.6 pending) | `evidence/ce-VERSION.txt` |
| Parent product | SHAFT_ENGINE (separate entity) | repo README + guide “Is ChaosEngine the same…?” FAQ |

Do **not** hardcode undated parent-repo star counts as ChaosEngine metrics.

## FAQ excerpt

Reuse the same `answerText` strings from `05-faqs.json` (EN + AR; byte-identical). AR: `dir="rtl" lang="ar"`.

## Out of scope

- Prices, client names, trainee counts, “thousands of users”, “أول وأكبر”.
- HowTo steps (link install guide).
- Claiming a separate GitHub repository named ChaosEngine under ShaftHQ (none exists — total_count 0 on org search 2026-10-31).
