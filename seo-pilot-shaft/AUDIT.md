# Live audit — https://shafthq.github.io/ (2026-10-31 Africa/Cairo)

Fetched via curl; evidence under `seo-pilot-shaft/audit/` and `evidence/gh-live-2026-10-31.json`. **No live site edits. No merge.**

## Platform

- Builder: Docusaurus v3.10.2 (meta generator); GitHub Pages.
- Canonical host: `https://shafthq.github.io/` (`html lang=en-US`).
- Homepage is SSR’d with meta + JSON-LD in initial HTML (good for bots).

## Titles & meta (home)

| Field | Live value | Notes |
|---|---|---|
| `<title>` | SHAFT: Java test automation with built-in evidence \| SHAFT User Guide | Strong EN keyword title |
| meta description | Write the test. SHAFT does the rest. One open-source Java engine for web, mobile, API, CLI, database, and desktop, with an Allure report on every run. | Good; no prices/clients |
| canonical | https://shafthq.github.io/ | OK |
| og:title / og:description | match title/desc | OK |
| og:image | `https://shafthq.github.io/img/shaft-social-card.png` | **https** (200 verified) — pilot1 lesson already satisfied |
| og:image:width/height | 1200 / 630 | OK |
| twitter:card | summary_large_image | OK |
| twitter:image | (inherits / same social card via Docusaurus defaults) | Confirm in apply if explicit tag desired |
| robots meta | index, follow | OK |
| og:locale | en_US | OK |

## Headings (home)

- H1: Write the test. SHAFT does the rest.
- H2/H3 include proof, usage, video, agent workflow, surfaces, trust, **Common questions** FAQ.

## Structured data (home) — 5 LD+JSON scripts

| # | @type | Quality / issues |
|---|---|---|
| 0 (page Head) | SoftwareApplication | Has `softwareVersion` from `project-signals` (**stale 10.4.20261013** vs live latest **10.4.20261031** 2026-10-31); `offers` price 0 USD (OSS free — keep); **no Person creator** |
| 1 (page Head) | FAQPage | 3 Qs; **Q2 Answer.text ≠ visible body** (visible adds “Upgrade a project” link text) |
| 2 (config headTags) | SoftwareApplication | **Duplicate** of #0 without softwareVersion; author Organization only |
| 3 (config) | Organization | ShaftHQ; sameAs: GitHub org, FB Automatest group, Maven Central, Selenium ecosystem. **Missing** YouTube, LinkedIn person/org, Mohab GitHub |
| 4 (config) | SoftwareSourceCode | Good alternateName + Maven identifier; author Organization only — **no Person** |

## FAQ byte-match (live defect)

| Q | JSON-LD Answer.text | Visible `<details>` text | Match? |
|---|---|---|---|
| Is SHAFT free to use? | Yes. SHAFT is open source under the MIT license. | same (MIT license is a link) | YES |
| Do I have to rewrite my Selenium tests? | No. Move an existing Maven suite onto current SHAFT and run one test first. | same **+** “Upgrade a project” | **NO** |
| Which Java version do I need? | Java 25. Installation lists the rest. | same (Installation is a link) | YES |

Source: `src/data/homepage-faqs.ts` vs `src/pages/index.tsx` FAQ `<details>` (hardcoded answer paragraphs, not `answerText`).

## Sitemap / robots / llms

| Asset | Status |
|---|---|
| robots.txt | 200; path `Disallow: /assets/` only; **AI bots explicitly ALLOW** (GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, Claude-SearchBot, Applebot-Extended, bingbot). Keep ALLOW. |
| sitemap.xml | 200 at audit time; **387** `<loc>` URLs (docs/blog/pages). Home included. Sample retained as `audit/sitemap-sample.xml` (full dump dropped for pack size). |
| llms.txt | 200 ~24 KB; solid journey index; **no Person/creator entity block**, no FAQ cites, no Maven coordinate one-liner at top beyond generic blurb |
| llms-full.txt | 200 ~1.1 MB; build-generated corpus |

## Usage / version signals (committed vs live)

| Signal | In-repo (`src/data/*`) | Live 2026-10-31 Africa/Cairo |
|---|---|---|
| stars | 417 (`project-signals.json`) | **418** (GitHub API) |
| engineVersion | 10.4.20261013 | latest release **10.4.20261031** |
| releases count | 227 (`usage-metrics.json` asOf 2026-10-29) | GraphQL releases.totalCount **228** |
| javaVersion | 25 | 25 (keep; matches installation) |

Cite stars/releases in **new** copy only with live source + date (`evidence/gh-live-2026-10-31.json`).

## Cross-channel name/description (current)

| Surface | Current | Issue |
|---|---|---|
| Guide meta | “SHAFT: Java test automation with built-in evidence…” / Write-the-test blurb | Canonical marketing string |
| GitHub SHAFT_ENGINE About | “Java test automation framework for web, mobile, API, CLI, database, and desktop E2E testing with a fluent API and built-in reporting.” | No Mohab/creator; no Maven coordinate; slightly different wording |
| GitHub shafthq.github.io About | “SHAFT_Engine's official user guide, powered by Docusaurus 3.x” | OK for docs repo; not product entity |
| ShaftHQ org | empty description | Weak org entity |
| Welcome blog | Mohab Mohie — “SHAFT_Engine creator”; also “thousands of users / hundreds of projects” | Creator claim OK; **user-count claim unverified for new copy** — omit |
| GitHub Sponsors @MohabMohie | “400+ students”; “MEA region” | Trainee counts conflict with other surfaces — **omit from guide copy** |
| LinkedIn person | Creator of SHAFT_Engine; lists client names in experience | **Do not import client names** into guide |

## Policy / spam risk notes

- No doorway pages; docs are substantive.
- No prices in meta (OSS Offer price 0 in schema is standard free software — keep).
- Client names not on guide marketing pages (good). Do not add.
- Welcome blog “thousands of users” — do not amplify in new schema/llms.

## AEO readiness

- FAQ schema: yes, thin (3 Qs) + **byte-match fail on Q2**.
- Visible FAQ: yes (Common questions).
- Missing: “What is SHAFT?”, “Maven coordinate?”, “Who created SHAFT?”, “Does SHAFT replace Selenium?”.
- Featured-snippet candidate: lead paragraph is strong; entity page would harden GEO.
