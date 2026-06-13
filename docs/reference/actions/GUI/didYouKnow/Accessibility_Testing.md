---
id: Accessibility_Testing
title: Accessibility Testing with axe-core
sidebar_label: Accessibility Testing
description: "Automate accessibility audits in SHAFT Engine using axe-core — assert no critical violations, enforce minimum scores, and ignore specific rules."
keywords: [SHAFT, accessibility testing, axe-core, WCAG, a11y, accessibility audit, accessibility violations]
tags: [web, accessibility, axe-core]
---

SHAFT Engine integrates [axe-core](https://github.com/dequelabs/axe-core) to run automated accessibility audits directly within your existing WebDriver tests. No separate tooling is required — simply chain `.accessibility()` onto your browser actions to start auditing pages for WCAG compliance.

:::info
Accessibility testing helps ensure your application is usable by people with disabilities and meets legal requirements such as WCAG 2.1.
:::

---

## Enabling axe-core

Add the axe-core Selenium dependency to your `pom.xml`:

```xml title="pom.xml"
<dependency>
    <groupId>com.deque.html.axe-core</groupId>
    <artifactId>selenium</artifactId>
    <version>4.10.0</version>
    <scope>test</scope>
</dependency>
```

---

## Available Methods

### assertNoCriticalViolations

Asserts that the current page has **no critical accessibility violations**. The test fails immediately if any critical-severity issues are found.

```java title="AccessibilityTesting.java"
driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .assertNoCriticalViolations("Home Page");
```

### assertAccessibilityScoreAtLeast

Asserts that the page meets a **minimum accessibility score** (0–100). Use this to enforce a progressive improvement policy.

```java title="AccessibilityTesting.java"
driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .assertAccessibilityScoreAtLeast("Home Page", 90.0);
```

### analyzeWithIgnoredRules

Runs an accessibility audit while **ignoring specific axe-core rules**. Useful when known false positives or accepted deviations exist.

```java title="AccessibilityTesting.java"
driver.browser().navigateToURL("https://example.com")
      .accessibility()
      .analyzeWithIgnoredRules("Home Page", List.of("color-contrast", "image-alt"));
```

---

## Complete Example

```java title="AccessibilityAuditTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import java.util.List;

public class AccessibilityAuditTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void assertNoAccessibilityViolations() {
        driver.browser().navigateToURL("https://example.com")
              .accessibility()
              .assertNoCriticalViolations("Home Page");
    }

    @Test
    public void enforceMinimumAccessibilityScore() {
        driver.browser().navigateToURL("https://example.com")
              .accessibility()
              .assertAccessibilityScoreAtLeast("Home Page", 90.0);
    }

    @Test
    public void auditWithKnownExclusions() {
        driver.browser().navigateToURL("https://example.com")
              .accessibility()
              .analyzeWithIgnoredRules("Home Page", List.of("color-contrast", "image-alt"));
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## When to Use

:::tip
Run accessibility audits as part of your CI/CD pipeline to catch regressions early. Integrate them into smoke tests so every deployment is checked.
:::

| Scenario | Recommended Method |
|---|---|
| Strict compliance gate | `assertNoCriticalViolations()` |
| Progressive improvement | `assertAccessibilityScoreAtLeast()` |
| Known accepted deviations | `analyzeWithIgnoredRules()` |

:::note
Accessibility audit results are automatically included in the SHAFT Allure report, showing the page name, score, and details of any violations found.
:::
