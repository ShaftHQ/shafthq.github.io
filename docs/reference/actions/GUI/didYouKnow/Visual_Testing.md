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

---

## matchesScreenshot()

`matchesScreenshot()` is a lighter-weight, OpenCV-only pixel-diff assertion built into `shaft-engine` (no `shaft-visual` dependency required). Like every other SHAFT assertion it runs immediately — no `perform()` is needed. Pass a `VisualComparisonOptions` object to tune the diff budget and masks, mirroring Playwright's `toHaveScreenshot()` options:

```java title="ScreenshotBaseline.java"
driver.element().assertThat(By.id("logo"))
      .matchesScreenshot(VisualComparisonOptions.create()
          .maxDiffPixelRatio(0.01)
          .mask(By.id("timestamp")));
```

For a straight comparison with default settings, call `matchesScreenshot()` with no arguments.

### Per-browser/OS baseline naming

Baselines are stored per browser and platform, with a sanitized `_<browser>_<platform>` suffix appended to the hashed baseline file name (for example, `<hash>_chrome_windows.png`). The suffix is built from `SHAFT.Properties.web.targetBrowserName()` and `SHAFT.Properties.platform.targetPlatform()`, lowercased with non-alphanumeric characters stripped, so cross-browser and cross-OS runs no longer share (and fight over) a single baseline image.

If no per-browser/OS baseline exists yet, SHAFT falls back to a legacy unsuffixed baseline when one is present, logging a one-line notice, so baselines captured before this change keep working. New baselines — and any run with `-Dshaft.updateSnapshots=true` — always write to the new per-browser/OS path.

The IntelliJ plugin's **Visual Baselines** panel lists pending `*_diff.png` comparisons and lets you Accept or Reject each one without leaving the IDE — see the [IntelliJ IDEA plugin](/docs/agentic/intellij) guide.

## Related

- [Did You Know](/docs/reference/actions/GUI/Did_You_Know)
- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Web](/docs/testing/web)
