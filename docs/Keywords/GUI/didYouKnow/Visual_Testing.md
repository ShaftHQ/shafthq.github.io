---
id: Visual_Testing
title: Visual Testing and Image Comparison
sidebar_label: Visual Testing
description: "Detect visual regressions in SHAFT Engine using built-in image comparison engines — OpenCV, ExactEyes, StrictEyes, ContentEyes, and LayoutEyes."
keywords: [SHAFT, visual testing, image comparison, visual regression, OpenCV, screenshot comparison, VisualValidationEngine]
tags: [web, visual-testing, image-comparison]
---

SHAFT Engine provides built-in visual regression testing through the `matchesReferenceImage()` assertion. On the **first run**, SHAFT captures and stores a baseline screenshot. On **subsequent runs**, it compares the current state against the baseline using the selected comparison engine.

:::info
Visual baseline images are stored in `src/test/resources/DynamicObjectRepository/` by default. Commit these files to source control so all team members and CI/CD pipelines share the same baseline.
:::

---

## Comparison Engines

SHAFT supports five visual validation engines through the `VisualValidationEngine` enum:

| Engine | Description | Best For |
|---|---|---|
| `EXACT_EYES` | Pixel-perfect comparison | Static assets, logos, icons |
| `STRICT_EYES` | High-sensitivity comparison with minor tolerance | UI components |
| `CONTENT_EYES` | Compares content while ignoring minor rendering differences | Text-heavy pages |
| `LAYOUT_EYES` | Compares layout structure, ignores content changes | Page layout regression |
| `OPENCV` | Uses OpenCV for flexible image matching | Complex scenarios, partial matching |

---

## matchesReferenceImage()

### Default Engine

```java title="VisualTesting.java"
// Assert element matches a reference image (stores baseline on first run)
driver.element().assertThat(By.id("logo"))
      .matchesReferenceImage();
```

### Specific Engine

```java title="VisualTesting.java"
import com.shaft.enums.internal.VisualValidationEngine;

// Visual regression with a specific engine
driver.element().assertThat(By.id("chart"))
      .matchesReferenceImage(VisualValidationEngine.STRICT_EYES);

// Layout comparison — ignores content, checks structure
driver.element().assertThat(By.id("productCard"))
      .matchesReferenceImage(VisualValidationEngine.LAYOUT_EYES);
```

---

## Complete Example

```java title="VisualRegressionTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.VisualValidationEngine;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class VisualRegressionTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void assertLogoMatchesBaseline() {
        driver.browser().navigateToURL("https://example.com");
        driver.element().assertThat(By.id("logo"))
              .matchesReferenceImage();
    }

    @Test
    public void assertChartMatchesBaseline() {
        driver.browser().navigateToURL("https://example.com/reports");
        driver.element().assertThat(By.id("salesChart"))
              .matchesReferenceImage(VisualValidationEngine.STRICT_EYES);
    }

    @Test
    public void assertPageLayoutMatchesBaseline() {
        driver.browser().navigateToURL("https://example.com/home");
        driver.element().assertThat(By.tagName("body"))
              .matchesReferenceImage(VisualValidationEngine.LAYOUT_EYES);
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## Updating Baselines

When an intentional UI change is made, delete the relevant baseline image from `src/test/resources/DynamicObjectRepository/` and run the test once to regenerate it.

:::tip
Run visual tests in a consistent environment (same OS, browser version, screen resolution) to prevent false positives caused by rendering differences across platforms.
:::

:::warning
Avoid running visual tests in headless mode if your baselines were captured in headed mode — subtle rendering differences between the two modes will cause false failures.
:::
