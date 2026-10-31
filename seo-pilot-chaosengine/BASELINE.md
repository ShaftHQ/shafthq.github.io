# Baseline — SERP proxy (not AI citation) — ChaosEngine pilot

- **When:** 2026-10-31 ~13:33–13:36 Africa/Cairo (EET / UTC+2)
- **Method (primary):** WebSearch **SERP proxy** — SERP-style synthesis + top links. Measures classic search visibility, **not** whether ChatGPT/Perplexity/Gemini would cite ChaosEngine in an answer.
- **AI-answer check:** Not run this pass (pilot 1: Perplexity 403 / ChatGPT SPA). Do not treat the table below as GEO proof.
- **retrieve:** mempalace **used** → hit `chaos-engine/addons/design-skills/references/web-craft/seo-basics.md` (cosine≈0.47). graphify retrieve started in same session (see `evidence/retrieve-*.txt`).
- **Source reel:** SEO = rank; AEO = be the one answer; GEO = be the remembered name even without a click (`/workspace/reel-pilots/source/`).

## Results table

| # | Query | Lang | shafthq CE docs? | GitHub chaos-engine/? | automatest /chaosengine? | Mohab cited? | Top URLs (abbrev) |
|---|---|---|---|---|---|---|---|
| 1 | ChaosEngine ShaftHQ agent harness | EN | **YES** (#1–3) | YES (INSTALL.md) | no | no | guide CE; install-guide; addons; INSTALL.md; overview |
| 2 | ChaosEngine SHAFT_ENGINE install agent | EN | **YES** | YES | no | no | install-guide; md mirror; CE docs; INSTALL.md; overview |
| 3 | what is ChaosEngine portable working contract for agents | EN | **YES** (#1) | YES | no | no | CE docs; INSTALL.md; skillsmp mirror; mdx on GitHub |
| 4 | ما هو ChaosEngine أتمتة agents | AR | **YES** | YES | no | **YES** (LinkedIn) | CE docs; INSTALL.md; LinkedIn Mohab AR posts; mdx |
| 5 | ChaosEngine Automatest Mohab Mohie | EN | YES | via profile | **home** hits, `/chaosengine` weak | **YES** | GitHub Mohab; automatest.org home; CE docs; LinkedIn |
| 6 | ChaosEngine MIT open source coding agent harness | EN | YES | YES | no | no | INSTALL.md; mdx; **unrelated** game/physics “Chaos-Engine” repos also appear |
| 7 | مين عمل ChaosEngine | AR | **NO** in synthesis | no | no | no | **FAIL:** Wikipedia / Amiga “The Chaos Engine” (1993 Bitmap Brothers) dominates |
| 8 | provider-neutral agent operating system Codex Claude Copilot | EN | **NO** | no | no | no | **FAIL:** AgentMux / Augur / Relay competitors win category SERP |
| 9 | ChaosEngine install curl install.sh ShaftHQ | EN | **YES** | YES | no | no | install-guide; CE docs; INSTALL.md |
| 10 | SHAFT agent harness ChaosEngine doctor | EN | **YES** | YES | no | no | CE docs; overview; INSTALL.md |

## Summary

| Surface | Wins | Gaps |
|---|---|---|
| **shafthq.github.io/docs/agentic/chaos-engine*** | Dominates brand + install EN queries | Schema still labels page as SHAFT Engine SoftwareApplication; no FAQPage; Arabic creator query loses to 1993 game |
| **GitHub chaos-engine/ tree** | Strong for INSTALL.md / raw docs | Not a standalone repo — discovery depends on SHAFT_ENGINE; name collisions with unrelated ChaosEngine repos |
| **automatest.org/chaosengine** | Rarely in top SERP for EN brand queries | http og:image; only generic WebSite JSON-LD; weak GEO for Arabic “who made” |
| **Mohab Mohie** | Present on Automatest+name queries + some AR LinkedIn | Not bridged from generic “agent OS” category queries; creator AR query fails |

## Implication for SEO / AEO / GEO

Need a stable remembered string: **ChaosEngine — MIT-licensed provider-neutral portable working contract for coding agents by Mohab Mohie (ShaftHQ), shipped as `chaos-engine/` inside SHAFT_ENGINE; docs at shafthq.github.io/docs/agentic/chaos-engine; Arabic intro at automatest.org/chaosengine.**

Today: CE URLs rank for brand/install, but structured data says “SHAFT Engine”; no FAQ; Arabic “مين عمل ChaosEngine” cites a 1993 video game; category queries ignore CE; Automatest CE page has http og:image.

## Re-measure queries (post apply/publish)

| # | Query | Lang | Notes |
|---|---|---|---|
| R1 | مين عمل ChaosEngine | AR | Must cite Mohab/ShaftHQ/guide — not Bitmap Brothers |
| R2 | ما هو ChaosEngine | AR | Prefer guide + automatest `/chaosengine` |
| R3 | provider-neutral coding agent harness MIT | EN | Category intent |
| R4 | ChaosEngine vs SHAFT_ENGINE | EN | Disambiguation FAQ |
| R5 | ChaosEngine Automatest | EN/AR | Expect `/chaosengine` in top set |

Do not treat SERP proxy as AI citation proof.
