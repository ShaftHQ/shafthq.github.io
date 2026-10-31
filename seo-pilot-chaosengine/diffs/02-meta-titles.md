# SEO — titles / meta / og:image

## Guide — `docs/agentic/chaos-engine.mdx` (live 2026-10-31)

| Field | Live | Proposal |
|---|---|---|
| `<title>` | Install and operate ChaosEngine \| SHAFT User Guide | **Keep** (already strong; matches H1) |
| `description` / `og:description` | Install, inspect, recover, and understand the project-local SHAFT agent harness. | **Replace** with canonical: `MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE.` |
| `keywords` | ChaosEngine, agent harness, install, upgrade, Codex, Claude, Gemini, Grok, Copilot | Keep; optional add `provider-neutral`, `working contract` |
| `og:image` | `https://shafthq.github.io/img/shaft-social-card.png` | **Keep** (already https). Optional later: CE-specific social card — out of scope unless design ships asset |
| canonical | https://shafthq.github.io/docs/agentic/chaos-engine | Keep |

### Frontmatter patch sketch

```yaml
description: MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE.
```

## Guide — install-guide / addons

- Keep page-specific titles (Install guide / Add optional skills).
- Align `description` to mention ChaosEngine + point to main CE URL for entity questions.
- og:image already https via site default.

## Automatest — `https://www.automatest.org/chaosengine` (Coach apply)

| Field | Live | Proposal |
|---|---|---|
| title | ChaosEngine — Automatest | Keep |
| description | ChaosEngine: portable working contract for agents. Evidence first, research before edit, owned delivery — from Automatest and ShaftHQ. | Align to canonical EN (may keep “from Automatest and ShaftHQ” suffix) **or** use `MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE.` |
| **og:image** | `http://static1.squarespace.com/.../og-chaosengine.png?format=1500w` | **BLOCKING:** change to **https://** same host/path (pilot1 lesson). Twitter image too. |
| JSON-LD | Site-wide WebSite only | See `01` + Coach: add CE `@graph` or link to guide entity; do not leave only empty-description WebSite |

## SHAFT_ENGINE README (`chaos-engine/README.md`) — separate repo apply

- Tagline already: “A portable working contract that turns software agents into disciplined engineering partners.”
- Add one-line canonical description near the top matching `MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE.` (or keep tagline + add “MIT · ShaftHQ/SHAFT_ENGINE/chaos-engine · docs URL”).
- Identity for that commit: **ChaosEngine** `<chaosengine@mail.grokbot.com>` on ShaftHQ/SHAFT_ENGINE (out of this guide branch — note only).
