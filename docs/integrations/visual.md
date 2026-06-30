---
id: visual
title: Visual testing
description: Add reference-image assertions and image-based touch operations.
slug: /integrations/visual
sidebar_position: 2
tags: [visual, opencv, applitools]
---

# Visual testing

`io.github.shafthq:shaft-visual` supplies the optional
`VisualProcessingProvider` implementation and its OpenCV, Applitools Eyes, and
Selenium Shutterbug dependencies.

## Add the module

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>shaft-bom</artifactId>
            <version>${shaft.version}</version>
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
    <dependency>
        <groupId>io.github.shafthq</groupId>
        <artifactId>shaft-visual</artifactId>
    </dependency>
</dependencies>
```

No initialization call is required. Java `ServiceLoader` discovers the provider.

## Dependency decision

```mermaid
flowchart TD
    Start["What does the test do?"] --> Ref{"Reference-image assertion<br/>or image-path touch action?"}
    Ref -- Yes --> Visual["Add shaft-visual"]
    Ref -- No --> Core{"Only capture, attach, highlight,<br/>GIF, or compare folders?"}
    Core -- Yes --> Engine["shaft-engine is sufficient"]
    Core -- No --> Check["Check the method table below"]
```

## Requires `shaft-visual`

| API                                                            | Functionality                                                |
|----------------------------------------------------------------|--------------------------------------------------------------|
| `matchesReferenceImage()`                                      | Reference-image comparison. WebDriver/Appium default to Shutterbug; Playwright uses OpenCV screenshot-byte comparison. |
| `matchesReferenceImage(VisualValidationEngine)`                | OpenCV, Shutterbug, or Eyes comparison selected by the enum. Playwright routes `Locator.screenshot()` bytes through the provider; Shutterbug requests fall back to OpenCV because Shutterbug is Selenium-backed. |
| `doesNotMatchReferenceImage()` and its overload                | Negative OpenCV/visual-engine comparison.                    |
| `TouchActions.tap(String)`                                     | Finds and taps an image inside the current screen.           |
| `TouchActions.type(String, ...)`                               | Finds an image, taps it, then types into the active field.   |
| `TouchActions.waitUntilElementIsVisible(String)`               | Waits for an image match.                                    |
| `TouchActions.waitUntilElementIsNotVisible(String)`            | Waits until an image match disappears from the screen.       |
| `TouchActions.swipeElementIntoView(String, ...)`               | Swipes until the reference image is found.                   |
| `ImageProcessingActions.findImageWithinCurrentPage(...)`       | Direct OpenCV-backed image lookup.                           |
| `ImageProcessingActions.compareAgainstBaseline(...)`           | Direct baseline comparison.                                  |
| `ImageProcessingActions.loadOpenCV()`                          | Explicit provider/native-library loading.                    |
| Built-in Cucumber OpenCV, Shutterbug, and Eyes assertion steps | Delegates to the same provider.                              |

Image-path touch actions compare against viewport screenshots and return
viewport-relative coordinates for Selenium/Appium pointer actions. OpenCV
matching is scale-tolerant, so a cropped reference image can be captured at a
different DPI or display scale than the current app screenshot.

The bundled TestNG/JUnit web samples use:

```java
driver.browser().navigateToURL(targetUrl)
        .and().element().assertThat(logo).matchesReferenceImage();
```

The bundled Cucumber sample uses:

```gherkin
Then I Assert that the element found by "xpath": "//div[contains(@class,'container_fullWidth__1H_L8')]//img", exactly matches with the expected reference image using AI OpenCV
```

Both styles require `shaft-visual`.

`SHAFT.GUI.Playwright` supports the same element visual assertion surface. The
Playwright backend captures `Locator.screenshot()` bytes and compares them
through `shaft-visual`:

```java title="PlaywrightVisualValidation.java"
driver.assertThat().element(By.id("logo"))
      .matchesReferenceImage(ValidationEnums.VisualValidationEngine.EXACT_OPENCV);
```

The no-argument Playwright overload uses `EXACT_OPENCV`. Applitools Eyes engines
also receive Playwright screenshot bytes. Selenium Shutterbug remains available
for WebDriver/Appium visual checks.

## Remains in `shaft-engine`

| API/functionality                                                 | Implementation                        |
|-------------------------------------------------------------------|---------------------------------------|
| WebDriver/Appium screenshots and report attachments               | Selenium/Appium plus SHAFT reporting. |
| `ImageProcessingActions.highlightElementInScreenshot(...)`        | JDK `BufferedImage`/`Graphics2D`.     |
| `ImageProcessingActions.compareImageFolders(...)`                 | JDK `ImageIO` and data buffers.       |
| `formatElementLocatorToImagePath(...)`                            | Baseline naming only.                 |
| `getReferenceImage(...)` and `getShutterbugDifferencesImage(...)` | Baseline file reads only.             |
| Animated GIF generation                                           | Core image/reporting implementation.  |
| Locator-based touch methods such as `tap(By)`                     | Selenium/Appium locator execution.    |
| Healenium                                                         | Independent integration.              |

Without `shaft-visual`, provider-dependent methods throw an
`IllegalStateException` that names the missing Maven coordinate. Core screenshot
and image-file operations continue to work.

## Related

- [Modules](/docs/features/modules)
- [Upgrade](/docs/start/upgrade)
- [Browserstack](/docs/integrations/browserstack)
- [Video](/docs/integrations/video)
