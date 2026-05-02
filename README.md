<div align="center">
  <img src="https://shaftengine.netlify.app/img/shaft.svg" alt="SHAFT Engine Logo" width="120" />
  <h1>SHAFT Engine — User Guide</h1>
  <p><strong>Stop reinventing the wheel. Start using SHAFT.</strong></p>
  <p>
    The unified, open-source test automation engine for Web · Mobile · API · CLI · Database.<br/>
    Built on Selenium, Appium, and REST Assured — zero boilerplate required.
  </p>

  <!-- 1. BADGES -->
  [![GitHub Stars](https://img.shields.io/github/stars/ShaftHQ/SHAFT_ENGINE?style=social)](https://github.com/ShaftHQ/SHAFT_ENGINE/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/ShaftHQ/SHAFT_ENGINE?style=social)](https://github.com/ShaftHQ/SHAFT_ENGINE/network/members)
  [![Maven Central](https://img.shields.io/maven-central/v/io.github.shafthq/shaft_engine?label=Maven%20Central&color=blue)](https://central.sonatype.com/artifact/io.github.shafthq/shaft_engine)
  [![License](https://img.shields.io/github/license/ShaftHQ/SHAFT_ENGINE)](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/master/LICENSE)
  [![Java 21](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://adoptium.net/)
  [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://shaftengine.netlify.app/)

  <br/>

  [📖 Read the Docs](https://shaftengine.netlify.app/docs/Getting_Started/first_steps) &nbsp;·&nbsp;
  [🚀 Quick Start](#-quick-start) &nbsp;·&nbsp;
  [💬 Join Slack](https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw) &nbsp;·&nbsp;
  [🐛 Report Bug](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/new/choose) &nbsp;·&nbsp;
  [✨ Request Feature](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/new/choose)
</div>

---

## 📋 Table of Contents

- [What is SHAFT?](#-what-is-shaft)
- [Why SHAFT?](#-why-shaft)
- [Platform Coverage](#-platform-coverage)
- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
- [Community & Support](#-community--support)
- [Contributing to the Docs](#-contributing-to-the-docs)
- [AutoBot (AI Chatbot)](#-autobot-ai-chatbot)
- [Local Development](#-local-development)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🔍 What is SHAFT?

**SHAFT** (Selenium/Appium/REST Assured Framework for Hackers of Technology) is a **battle-tested, open-source Java test automation engine** that wraps industry-standard tools into a clean, unified API.

Instead of wiring together Selenium, Appium, REST Assured, TestNG, Allure, and a dozen helper libraries yourself, SHAFT gives you a **single dependency** with zero boilerplate — so you write tests, not infrastructure.

> This repository is the **official user guide** (Docusaurus site) for SHAFT Engine, live at **[shaftengine.netlify.app](https://shaftengine.netlify.app)**. The engine source lives at [ShaftHQ/SHAFT_ENGINE](https://github.com/ShaftHQ/SHAFT_ENGINE).

---

## 🏆 Why SHAFT?

| Pain Point | Without SHAFT | With SHAFT |
|---|---|---|
| Driver management | Manual WebDriverManager setup | ✅ Automatic |
| Cross-browser/mobile | Separate configs per platform | ✅ One fluent API |
| Smart waits | Write `WebDriverWait` boilerplate | ✅ Built-in intelligent waits |
| Reporting | Wire up Allure/Extent manually | ✅ Beautiful reports out-of-the-box |
| Self-healing locators | Fragile XPaths break on change | ✅ AI-powered self-healing |
| CI/CD integration | Custom scripts per pipeline | ✅ Works in any CI out of the box |
| Test parallelism | Thread-safety nightmares | ✅ Java 21 virtual threads via `driver.async()` |

---

## 🌐 Platform Coverage

| Platform | Powered By | Status |
|---|---|---|
| 🌍 Web (Chrome, Firefox, Edge, Safari) | Selenium 4 | ✅ Stable |
| 📱 Android & iOS | Appium 2 | ✅ Stable |
| 🔗 REST / SOAP APIs | REST Assured | ✅ Stable |
| 💻 CLI / Terminal | Custom SHAFT CLI | ✅ Stable |
| 🗄️ Databases (MySQL, Postgres, Oracle…) | JDBC | ✅ Stable |
| 🎭 Visual Testing | AI screenshot diff | ✅ Stable |

---

## 🚀 Quick Start

Get your first automated test running in under 5 minutes.

### 1. Generate a project from the Maven archetype

```shell
mvn archetype:generate \
  -DarchetypeGroupId=io.github.shafthq \
  -DarchetypeArtifactId=shaft_engine-archetype-testng \
  -DarchetypeVersion=10.1.20260331 \
  -DgroupId=com.example \
  -DartifactId=my-tests \
  -Dversion=1.0.0-SNAPSHOT \
  -DinteractiveMode=false
```

### 2. Write your first test

```java
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class MyFirstTest {

    SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void googleSearchTest() {
        driver.browser().navigateToURL("https://www.google.com");
        driver.element().type(By.name("q"), "SHAFT Engine");
        driver.element().keyPress(By.name("q"), "ENTER");
        driver.assertThat().element(By.id("search")).text().contains("SHAFT").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

### 3. Run it

```shell
cd my-tests && mvn test
```

📖 **Full guide →** [Getting Started](https://shaftengine.netlify.app/docs/Getting_Started/first_steps)

---

## ✨ Key Features

- **🤖 Zero-boilerplate API** — one fluent call does the work of 10 Selenium lines
- **🔄 Self-healing locators** — AI automatically updates broken element selectors
- **⚡ Async testing** — Java 21 virtual threads via `driver.async().element()`
- **📊 Allure reports** — rich, shareable test reports with screenshots & videos
- **🌐 Cross-platform** — Web, Mobile, API, CLI, and DB in a single dependency
- **🧩 TestNG & JUnit 5** — use your preferred test runner
- **🥒 Cucumber / BDD** — first-class Gherkin step support
- **🏗️ CI/CD ready** — runs on GitHub Actions, Jenkins, GitLab CI, and more
- **🧠 AutoBot** — AI-powered chatbot for instant answers from the official docs
- **🔑 Secure** — no secrets ever embedded in client-side bundles

---

## 💬 Community & Support

We'd love to have you in the community! Choose the channel that suits you best:

| Channel | Link |
|---|---|
| 💬 Slack | [Join the workspace](https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw) |
| 👥 Facebook Group | [Automatest Community](https://www.facebook.com/groups/Automatest) |
| 🐛 Bug Reports | [GitHub Issues](https://github.com/ShaftHQ/SHAFT_ENGINE/issues) |
| 💡 Feature Requests | [GitHub Discussions](https://github.com/ShaftHQ/SHAFT_ENGINE/discussions) |
| ❤️ Sponsor | [GitHub Sponsors](https://github.com/sponsors/MohabMohie/) |
| 📖 JavaDocs | [API Reference](https://shafthq.github.io/SHAFT_ENGINE/) |

---

## 🤝 Contributing to the Docs

This repository powers the official SHAFT User Guide. Contributions of all kinds are welcome — from fixing typos to writing whole new pages.

**Quick contribution steps:**

1. **Fork** this repository
2. **Clone** your fork:
   ```shell
   git clone https://github.com/<your-username>/shafthq.github.io.git
   cd shafthq.github.io
   ```
3. **Install** dependencies:
   ```shell
   yarn install
   ```
4. **Start** the local dev server:
   ```shell
   yarn start
   ```
5. **Edit** or add `.md` / `.mdx` files under `docs/` or `blog/`
6. **Register** new pages in `sidebars.js` if needed
7. Open a **Pull Request** — Netlify will create a live preview automatically

> 💡 Use [dillinger.io](https://dillinger.io/) or any Markdown editor to draft content offline.

---

## 🤖 AutoBot (AI Chatbot)

AutoBot is the AI-powered assistant embedded in the docs site. It answers questions **exclusively** from the official SHAFT documentation — no hallucinations from pre-trained knowledge.

**How it works:**
- Reads all `/docs` Markdown files at build time
- Routes user questions to Google Gemini with a multi-model failsafe chain
- API key is **server-side only** (Netlify Function) — never in the browser bundle

### Enable AutoBot Locally

1. Get a free API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Copy the example env file:
   ```shell
   cp .env.example .env
   ```
3. Add your key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Install Netlify CLI (once):
   ```shell
   npm install -g netlify-cli
   ```
5. Start the full stack:
   ```shell
   netlify dev
   ```

> ⚠️ Plain `yarn start` won't activate AutoBot — use `netlify dev` for full local functionality.

### AutoBot Model Failsafe Chain

AutoBot tries each model in order until one responds successfully:

1. `gemini-3-flash` → `gemini-2.5-flash` → `gemini-2.5-flash-lite`
2. `gemma-3-27b` → `gemma-3-12b` → `gemma-3-4b` → `gemma-3-2b` → `gemma-3-1b`

### Testing AutoBot

```shell
# Run all tests
npm test

# Run only chat history tests
npm run test:history

# Run only API tests (requires GEMINI_API_KEY)
npm run test:api
```

For detailed test setup instructions see [CHATBOT_TESTING.md](CHATBOT_TESTING.md).

### Production Deployment (Netlify)

1. Sign up for a free [Netlify](https://www.netlify.com/) account
2. Connect this GitHub repository
3. Set build settings:
   - **Build command:** `yarn build`
   - **Publish directory:** `build`
4. Add `GEMINI_API_KEY` under **Site settings → Environment variables**
5. Deploy — the Netlify Function handles all Gemini API calls securely

For CI (GitHub Actions), add `GEMINI_API_KEY` as a repository secret under **Settings → Secrets and variables → Actions**.

---

## 💻 Local Development

```shell
# Install dependencies
yarn install

# Start live-reload dev server (docs & blog only — no AutoBot)
yarn start

# Production build
yarn build

# Run tests
npm test
```

Most changes to `docs/` are reflected live without restarting the server.

---

## 🚢 Deployment

The site is deployed to **Netlify** at **[shaftengine.netlify.app](https://shaftengine.netlify.app)**:

- Push to `master` → Netlify automatically builds and publishes
- Pull requests receive live preview deployments for review
- AutoBot chatbot is served securely via Netlify Functions

**GitHub Pages** (`https://shafthq.github.io/`) redirects all visitors to the Netlify URL. This redirect is maintained by the GitHub Actions workflow at `.github/workflows/deploy.yml`.

---

## 📜 License

SHAFT Engine and this documentation site are released under the [MIT License](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/master/LICENSE).<br/>
Copyright © 2024–present [ShaftHQ](https://github.com/ShaftHQ). Built with [Docusaurus 3](https://docusaurus.io/).

---

<div align="center">
  <sub>If SHAFT saves you time, please ⭐ <a href="https://github.com/ShaftHQ/SHAFT_ENGINE">star the engine repo</a> — it helps more teams discover the project!</sub>
</div>
