# Copilot Instructions for SHAFT User Guide

> These instructions guide GitHub Copilot and AI agents when generating or modifying content in this Docusaurus-based documentation site for the [SHAFT test automation engine](https://github.com/ShaftHQ/SHAFT_ENGINE).

---

## 1. Modern Design

- Use clean, minimal layouts with generous whitespace and clear visual hierarchy.
- Prefer Docusaurus built-in components (`Tabs`, `TabItem`, `Admonitions`, `CodeBlock`) over raw HTML.
- Use MDX for interactive documentation pages; prefer `.mdx` over `.md` when React components are needed.
- Use responsive, mobile-first design patterns; never use fixed pixel widths for content containers.
- Follow the site's existing color system defined in `src/css/custom.css`:
  - Light mode primary: `#2e8555` (green palette).
  - Dark mode primary: `#25c2a0` (teal palette).
- Ensure all new components and styles support both light and dark themes using CSS custom properties (`var(--ifm-*)`).
- Use semantic HTML elements (`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`) over generic `<div>` wrappers.

## 2. Consistent Design Language

- Follow the Infima CSS framework conventions used by Docusaurus throughout the entire site.
- Reuse existing CSS classes and variables from `src/css/custom.css` rather than adding inline styles or new classes.
- Maintain consistent heading hierarchy across all documentation pages: `#` for page title, `##` for sections, `###` for subsections.
- Use the same admonition styles (`:::tip`, `:::info`, `:::warning`, `:::danger`, `:::note`) for callouts across all pages.
- Use the same code block formatting: always include the `language` identifier and use the `title` attribute for file names (e.g., `java title="MyTest.java"` after the opening triple backticks).
- Maintain consistent front matter structure across doc pages (`title`, `description`, `sidebar_label`, `keywords`).
- Follow the existing sidebar structure defined in `sidebars.js`; keep the category hierarchy and naming conventions intact.
- Use the same tab patterns when showing configuration alternatives (file-based, CLI-based, code-based).

## 3. Official Source Code Verification

- **Always check the official SHAFT_ENGINE source code** at [https://github.com/ShaftHQ/SHAFT_ENGINE](https://github.com/ShaftHQ/SHAFT_ENGINE) before writing or modifying any code samples.
- Verify class names, method signatures, package paths, and API contracts against the latest source code in the `master` branch.
- Cross-reference property names and default values with the actual property interfaces under `src/main/java/com/shaft/properties/internal/` in the SHAFT_ENGINE repository.
- When documenting a SHAFT API, confirm the method exists and its parameters match the current implementation.
- If a code sample references a Maven dependency, verify the latest version from [Maven Central](https://central.sonatype.com/) or the SHAFT_ENGINE `pom.xml`.
- Never invent or assume API methods, class names, or configuration keys; always validate against the source.

## 4. Code Sample Maintenance

- When modifying any documentation page, **review and update all code samples on that page**, even if the code samples are not the focus of the change.
- Ensure all code samples compile and follow current SHAFT_ENGINE API conventions.
- Use consistent import statements; prefer explicit imports over wildcards.
- Use the latest recommended patterns from SHAFT_ENGINE (e.g., `SHAFT.GUI.WebDriver`, `SHAFT.API`, `SHAFT.CLI`).
- Include the `title` attribute on all code blocks to indicate the file name or context.
- Ensure code samples use proper Java conventions: camelCase for methods/variables, PascalCase for classes.
- When showing Maven/Gradle dependencies, use the latest stable SHAFT_ENGINE version.
- Remove any deprecated API usage from code samples when updating pages.

## 5. File Naming Conventions

- Use `PascalCase` for documentation file names and directory names (e.g., `Browser_Actions.md`, `Getting_Started/`).
- Use underscores (`_`) to separate words in file names for readability (e.g., `Element_Identification.md`).
- Keep file names descriptive and self-documenting; they should clearly indicate the content of the page.
- Match file names to sidebar labels where possible for easy navigation.
- Use lowercase with hyphens for non-documentation assets (images, scripts, CSS files).
- Static assets should be organized in meaningful subdirectories under `static/img/`.
- If a file name does not make sense for its content, rename it and update all references (sidebar, links, imports).

## 6. SEO Best Practices

- Include comprehensive front matter on every documentation page:
  ```yaml
  ---
  title: "Descriptive Page Title"
  description: "Concise description (150-160 characters) for search engines."
  keywords: [keyword1, keyword2, keyword3]
  ---
  ```
- Write unique, descriptive `title` and `description` for each page; never duplicate across pages.
- Use descriptive, keyword-rich headings that match common search queries.
- Include alt text on all images describing their content.
- Use internal links between related documentation pages to improve crawlability.
- Structure content with clear heading hierarchy (H1 → H2 → H3) for search engine parsing.
- Use descriptive anchor text for links; avoid generic "click here" or "read more" phrasing.
- Ensure the `keywords` meta tag in `docusaurus.config.js` stays aligned with the site's content scope.

## 7. UX Design Best Practices

- Put the most important information first; use progressive disclosure for advanced topics.
- Include a brief introduction or summary at the top of every documentation page.
- Use step-by-step formatting with numbered lists for procedural content.
- Provide copy-to-clipboard code blocks for all command-line instructions and code samples.
- Use tabs (`Tabs`/`TabItem`) to show alternatives side by side (e.g., Maven vs. Gradle, TestNG vs. JUnit).
- Include visual aids (screenshots, diagrams) to supplement text-heavy documentation.
- Ensure navigation flows logically; each page should link to the natural next step.
- Keep paragraphs short (3-4 sentences maximum) for scannability.
- Use admonitions to highlight prerequisites, warnings, tips, and important notes.

## 8. Virality and Maximum Reach Best Practices

- Write clear, compelling page titles that work well when shared on social media.
- Ensure Open Graph and Twitter Card metadata is present at the site level (`docusaurus.config.js`) and enriched per page via front matter.
- Create content that is easy to reference and link to; use descriptive URL slugs.
- Include practical, real-world code examples that developers can immediately use and share.
- Write in an accessible, jargon-light style that welcomes newcomers while respecting experts.
- Highlight unique SHAFT_ENGINE features and differentiators over generic testing framework content.
- Encourage community contributions with clear "Edit this page" links (already configured).

## 9. Agentic AI Best Practices

- Structure documentation in a machine-readable, well-organized format that AI agents can parse and reference.
- Use consistent Markdown/MDX formatting so AI-powered tools can reliably extract code samples, headings, and metadata.
- Maintain clear separation between conceptual explanations, API references, and code examples on each page.
- Include complete, self-contained code samples that AI agents can suggest to users without additional context.
- Use descriptive file paths and sidebar labels so AI coding assistants can map user intent to the correct documentation page.
- Keep front matter structured and predictable so AI tools can use metadata for contextual suggestions.
- When documenting APIs, provide method signatures, parameter descriptions, return types, and usage examples in a consistent format.
- Avoid ambiguous language; be explicit about method behavior, required parameters, and expected outcomes.

---

## 10. Current Version & Runtime Requirements

- The current stable SHAFT_ENGINE version is **`10.2.20260501`** — always use this version in dependency snippets unless instructed otherwise.
- SHAFT requires **Java 21 LTS** (virtual threads are used by `driver.async()`). Never suggest Java 8, 11, or 17 as the compile target.
- The latest TestNG Maven archetype version is **`10.1.20260331`** — use this when showing archetype generation commands.

## 11. Verified API Patterns — Do Not Invent

Use **only** the following verified patterns. Never guess method names.

### GUI — correct entry points
```java
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser()  // BrowserActions
driver.element()  // ElementActions
driver.touch()    // TouchActions   ← NOT driver.element().tap()
driver.alert()    // AlertActions
driver.async().element()  // AsyncElementActions (Java 21 virtual threads)
```

### GUI — touch actions are on driver.touch(), never driver.element()
```java
driver.touch().tap(locator);          // correct
driver.touch().longTap(locator);      // correct
driver.touch().swipeToElement(src, dst);  // correct
// driver.element().tap(locator);     // WRONG — does not exist
```

### CLI — use SHAFT.CLI factory, not direct instantiation
```java
TerminalActions terminal = SHAFT.CLI.terminal();   // correct
FileActions      file    = SHAFT.CLI.file();        // correct
// new TerminalActions() is also valid but SHAFT.CLI.terminal() is preferred
```

### API — correct methods
```java
// Add header (persists for all subsequent requests)
api.addHeader("Authorization", "Bearer " + token);
api.post("/endpoint").addHeader("X-Custom", "value").perform();

// Parameters — use setParameters() with a list, NOT setParameter()
List<List<Object>> params = Arrays.asList(Arrays.asList("key", "value"));
api.get("/search").setParameters(params, RestActions.ParametersType.QUERY).perform();

// Simple query string — use setUrlArguments()
api.get("/comments").setUrlArguments("postId=1").perform();

// Status-code assertion — set it on the request, not the response chain
api.get("/users").setTargetStatusCode(200).perform();

// Response assertions — use extractedJsonValue, body, or time; there is NO statusCode() chain
api.assertThatResponse().extractedJsonValue("$.name").isEqualTo("Alice").perform();
api.assertThatResponse().body().contains("Alice").perform();
api.assertThatResponse().time().isLessThan(3000).perform();
```

### DB — prefer DatabaseType constructor for built-in databases
```java
// DatabaseType values: MY_SQL, SQL_SERVER, POSTGRES_SQL, ORACLE, ORACLE_SERVICE_NAME, IBM_DB2
SHAFT.DB db = new SHAFT.DB(DatabaseActions.DatabaseType.MY_SQL, "localhost", "3306", "mydb", "user", "pass");
SHAFT.DB db = new SHAFT.DB(DatabaseActions.DatabaseType.POSTGRES_SQL, "localhost", "5432", "testdb", "admin", "admin123");

// Custom JDBC string — for databases not in the enum
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb?useSSL=false");

// Factory methods (same options)
SHAFT.DB db = SHAFT.DB.getInstance(DatabaseActions.DatabaseType.MY_SQL, "localhost", "3306", "mydb", "user", "pass");
```

### Report API
```java
SHAFT.Report.log("Section heading for report");          // discrete log entry
SHAFT.Report.report("Verification passed: cart = 3");    // named step entry
SHAFT.Report.attach("text/plain", "Response", body);     // attachment
```

---

## Quick Reference

| Area | Key Rule |
|---|---|
| Design | Use Docusaurus components, support light/dark themes, follow Infima CSS |
| Consistency | Reuse existing CSS variables and component patterns across all pages |
| Code Samples | Verify against [SHAFT_ENGINE source](https://github.com/ShaftHQ/SHAFT_ENGINE) before writing |
| Code Updates | Update all code samples on any page you modify |
| File Names | PascalCase with underscores; descriptive and content-aligned |
| SEO | Front matter with title, description, keywords on every page |
| UX | Progressive disclosure, step-by-step lists, tabs for alternatives |
| Reach | Social-friendly titles, practical examples, accessible language |
| Agentic AI | Structured format, self-contained examples, explicit API docs |
| Version | Always use SHAFT `10.2.20260501`, Java 21, archetype `10.1.20260331` |
| API | Never invent method names — verify against section 11 above |
| Existing Pages | Do NOT wholesale rewrite pages recently added by other agents (see list below) |

## 12. Pages Added by Other Agents — Do Not Wholesale Rewrite

The following pages were created or significantly revised by other Copilot sessions and should only receive **targeted, surgical updates** rather than full rewrites:

**High-priority pages added in April 2026 (PR #442):**
- `docs/Keywords/GUI/didYouKnow/Accessibility_Testing.md`
- `docs/Keywords/GUI/didYouKnow/Async_Element_Actions.md`
- `docs/Keywords/GUI/didYouKnow/Network_Mocking.md`
- `docs/Keywords/GUI/didYouKnow/Visual_Testing.md`
- `docs/Keywords/GUI/didYouKnow/Self_Healing_Locators.md`
- `docs/Keywords/GUI/didYouKnow/ARIA_Locators.md`
- `docs/Keywords/GUI/didYouKnow/Smart_Locators.md`
- `docs/Keywords/GUI/didYouKnow/Explicit_Waits.md`
- `docs/Keywords/GUI/didYouKnow/iFrame_Handling.md`
- `docs/Keywords/API/API_Authentication.md`
- `docs/Keywords/API/GraphQL_Testing.md`
- `docs/Keywords/Validations/JSON_Schema_Validation.md`
- `docs/Keywords/Validations/Soft_vs_Hard_Assertions.md`
- `docs/Properties/Programmatic_Config.md`
- `docs/Getting_Started/JUnit5_Integration.md`
- `docs/Best_Practices/Cucumber_BDD_Steps.md`

**Medium-priority pages added in April 2026 (PR #444):**
- `docs/Keywords/GUI/Async_Element_Actions.md`
- `docs/Keywords/GUI/didYouKnow/Mobile_Emulation.md`
- `docs/Keywords/TestData_Management.md` ← already has YAML section; do not replace

**Low-priority pages added in April 2026 (PR #446):**
- `docs/Keywords/CLI/Docker_Terminal.md`
- `docs/Keywords/CLI/SSH_Terminal.md`
- `docs/Keywords/GUI/didYouKnow/Clipboard_Actions.md`
- `docs/Keywords/GUI/didYouKnow/Kubernetes_Selenium_Grid.md`
- `docs/Reporting/Custom_Report_Messages.md`

**Pages fixed by another agent in April 2026 (PR #456):**
- `docs/Keywords/GUI/Browser_Actions.md`
- `docs/Keywords/GUI/Element_Actions.md`

## 13. CI Verification for Workflow/Release Automation Changes

- For changes to GitHub workflows, release automation, generated blog posts, or content that affects deployment checks, always wait for the related CI checks to finish before finalizing.
- For PRs in this repository, verify Netlify checks pass when applicable (especially `Pages changed - shaftengine`, `Header rules - shaftengine`, and `Redirect rules - shaftengine`).
- Do not consider the task complete until required checks have completed successfully or any failures are explicitly investigated and fixed.
