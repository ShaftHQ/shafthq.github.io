---
slug: release-history
title: "📚 SHAFT Release History (through 10.2.20260618)"
authors: [autobot]
tags: [shaft_engine, release, changelog, release-history]
---

Every SHAFT release used to get its own standalone blog post. That was great for
day-of-release visibility, but it made the blog archive noisy once dozens of
releases piled up. Starting now, releases older than one month are folded into
this single, chronological history post (newest first); recent releases (the
last month) keep their own dedicated post as before.

This page consolidates every release announcement published before
2026-06-19 — from the very first automated release in 2023 through
`10.2.20260618`. Nothing was removed: version numbers, dates, highlights,
breaking-change notes, and links to the original GitHub release/changelog are
all preserved below, just without each release's repeated boilerplate
(contributor avatar walls, identical "how to upgrade"/"join the conversation"
sections, etc.).

<!-- truncate -->

## How to upgrade to any historical version

All 10.x releases are consumed the same way — swap in the version you need:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.github.shafthq</groupId>
      <artifactId>shaft-bom</artifactId>
      <version>REPLACE_WITH_VERSION</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-engine</artifactId>
  </dependency>
</dependencies>
```

Releases before the modular BOM split (10.1.x and earlier) used a single
artifact instead:

```xml
<dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>SHAFT_ENGINE</artifactId>
    <version>REPLACE_WITH_VERSION</version>
</dependency>
```

> We support only the latest release. If you hit an issue on an older
> version, please upgrade to the [latest release](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/latest)
> first before filing a bug report.

---

## 10.2.20260618 — June 18, 2026

- Optimized Maven Central artifact packaging.
- Restored element-highlight screenshots on native mobile (flatten alpha before JPEG encode).
- Leaner assertion Allure reporting and optimized animated GIF generation.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260618) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260617...10.2.20260618)

## 10.2.20260617 — June 17, 2026

- Completed SHAFT Heal hardening and shipped trust-gated natural actions with healing reports.
- Completed SHAFT MCP AI and mobile support; added standalone/local MCP installer scripts.
- Optimized SHAFT performance hot paths and improved browser session initialization diagnostics/CI performance.
- Enforced JaCoCo uploads for test workflows; refreshed engine logging and full log attachments.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260617) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260615...10.2.20260617)

## 10.2.20260615 — June 15, 2026

- Renamed the SHAFT MCP module to `shaft-mcp` and restored its runtime images.
- Added command environment variables to the remote terminal.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260615) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260614...10.2.20260615)

## 10.2.20260614 — June 14, 2026

- Added the deterministic SHAFT Heal module and consolidated documentation on Docusaurus.
- Added SFTP upload/download and SSH port forwarding to the remote terminal.
- Restored Codecov uploads after every test run; fixed canonical documentation links.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260614) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260612...10.2.20260614)

## 10.2.20260612 — June 12, 2026

- Introduced **SHAFT Pilot**: deterministic Capture (recording), reliable TestNG generation from Capture sessions, deterministic Doctor diagnosis, reviewed repair proposals, and MCP interoperability.
- AI features are optional and disabled by default — direct OpenAI, Anthropic, Gemini, or Ollama access requires explicit enablement and consent; Microsoft/GitHub Copilot integrates through MCP rather than a generic provider API-key adapter.
- Imported `shaft-mcp` history into SHAFT_ENGINE and integrated it into the reactor/release lifecycle.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260612) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260610...10.2.20260612)

## 10.2.20260610 — June 10, 2026

- Shipped **Shaft modularization** and added aggregate JaCoCo/reactor quality support.
- Bumped multiple stable dependencies (Cucumber, Google libraries, BrowserStack, GraalVM, JaCoCo).
- Fixed Maven Central aggregate SBOM signing.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260610) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260605...10.2.20260610)

## 10.2.20260605 — June 5, 2026

- Refactored engine bootstrap and properties; centralized version BOMs and updated dependencies.
- Bumped Allure/Jackson/BrowserStack versions.
- Replaced `httpbin.org` calls in `BasicAPITests` with a local in-process fixture.
- Made native click failure reporting deterministic when the JS fallback is disabled.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260605) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260530...10.2.20260605)

## 10.2.20260506 — May 6, 2026

- Improved project hygiene: `.gitignore` and Maven metadata management updates.
- Expanded test coverage across file managers, validation builders, and REST utilities.
- Added Allure 2 compatibility mode and fixed the Allure 3 real-time monitoring watch command.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260506) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260505...10.2.20260506)

## 10.2.20260505 — May 5, 2026

- Dropped the initial engine download size by over 70%, making quick starts faster.
- Added localization-aware text assertions (direction + language) for element and browser validations.
- Added the Netty BOM dependency for transitive security updates; fixed broken links surfaced by the docs audit.
- Added opt-in enforcement for the configured Allure 3 CLI version; added maintainer-safe history-flatten tooling.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260505) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260501...10.2.20260505)

## 10.2.20260501 — May 2, 2026

- Focused on workflow stability, runtime reliability, and quality updates across SHAFT_ENGINE.
- Fixed `Actions.waitUntil` to accept Selenium truthy non-Boolean conditions; replaced the broad async idle monitor with a parallel XHR/fetch quiet-window to eliminate an execution-time regression.
- **Security fix:** pinned `httpclient5` to `5.6.1` for Dependabot alert #35.
- Added 3 GitHub Copilot skills: CI Failure Investigator, Flaky Test Stabilizer, Release & Dependency Guard.
- No other breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260501) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.2.20260424...10.2.20260501)

## 10.1.20260331 — March 31, 2026

- Replaced the XHR-only lazy-load wait with a full async idle monitor.
- Fixed BrowserStack remote endpoint handling, SDK YAML ordering, and app URL resolution for Android native sessions.
- Fixed Appium 2 session URL and APK badging caps; skipped Maven CD on forks.
- Bumped `log4j2` (2.25.3 → 2.25.4) and `browserstack-java-sdk` (1.56.1 → 1.56.3).
- First-time contributor: [@Mochxd](https://github.com/Mochxd).
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.1.20260331) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.1.20260324...10.1.20260331)

## 10.1.20260324 — March 24, 2026

- Fixed relative path resolution failing on Linux CI (#2347).
- Bumped `jackson-datatype-jdk8` (2.21.1 → 2.21.2) and `browserstack-java-sdk` (1.55.0 → 1.56.1).
- Added missing JavaDocs for the `CheckpointCounter` public API.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.1.20260324) · [Full changelog](https://github.com/ShaftHQ/SHAFT_ENGINE/compare/10.1.20260319...10.1.20260324)

## 7.1.20230309 — March 10, 2023

SHAFT_ENGINE's first release after implementing fully automated continuous
releases.

- Fixed the [Chrome 111+ Netty handler issue](https://github.com/SeleniumHQ/selenium/issues/11750).
- Major performance enhancement for the `Type` element action: previously SHAFT
  performed 21+ WebDriver calls per `Type` (accessible name, current text/
  textContent/value lookups, clear, send keys, and re-validation, each wrapped
  in a fluent `findElement`/`findElements` wait). Starting with this release,
  SHAFT captures the target element's full HTML once via [jsoup](https://mvnrepository.com/artifact/org.jsoup/jsoup)
  to resolve text/textContent/value and validate typing, cutting the call
  count down to just 3 WebDriver calls while preserving full functionality.
  The change was validated against roughly 1700 E2E test scenarios across
  platforms before shipping. The same call-reduction approach was later
  rolled out to `Click()` and other element actions.
- No breaking changes noted.
- 🔗 [Release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/7.1.20230309)

---

## Community & links

- ⭐ [Star SHAFT on GitHub](https://github.com/ShaftHQ/SHAFT_ENGINE) — it helps more than you think
- 💡 [Start a Discussion](https://github.com/ShaftHQ/SHAFT_ENGINE/discussions) — share feedback or ideas
- 🐛 [Report an Issue](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/new) — help us squash bugs faster
- 📖 [Read the Docs](https://shafthq.github.io/docs/start/overview) — dive deeper into SHAFT
- 💬 [Join our Slack](https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw)

Looking for a more recent release? Check the [blog](/blog) for the latest
standalone release posts (last month and newer).
