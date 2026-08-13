---
id: ocr
title: OCR and visible-text automation
description: Recognize, assert, and interact with visible text in images, web pages, mobile apps, and desktop applications.
slug: /integrations/ocr
keywords: [SHAFT, OCR, Tesseract, visible text, image text assertion, mobile OCR, desktop OCR, shaft-ocr]
tags: [ocr, tesseract, text-recognition, image-assertion]
---

# OCR and visible-text automation

Add `io.github.shafthq:shaft-ocr` when you need to recognize text from pixels. The module runs Tesseract locally through bundled native JavaCPP libraries; it does not require a system Tesseract installation or a cloud OCR service.

## Add the module

Import the SHAFT BOM, then add `shaft-engine` and `shaft-ocr` without module versions:

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
        <artifactId>shaft-ocr</artifactId>
    </dependency>
</dependencies>
```

Without `shaft-ocr`, OCR calls fail with a message that names the missing optional dependency.

## Target visible text

Create exact or partial OCR targets through the usual locator namespace. Use the target with WebDriver, Appium, or Playwright element actions:

```java
var exactText = SHAFT.GUI.Locator.hasOcrText("Checkout");
var partialText = SHAFT.GUI.Locator.containsOcrText("Check");

driver.element().click(exactText);
driver.element().hover(partialText);
driver.element().doubleClick(exactText);
```

The default target requires one match. Select a zero-based occurrence when the same text appears more than once:

```java
driver.element().click(
    SHAFT.GUI.Locator.containsOcrText("Save").occurrence(1)
);
```

SHAFT maps recognized screenshot coordinates to the active backend. WebDriver uses the browser viewport, Appium uses touch input, and Playwright uses its page mouse. Add `shaft-sikulix` to use the same OCR targets for desktop screen actions:

```java
new SHAFT.GUI.SikuliX().element()
    .click(SHAFT.GUI.Locator.hasOcrText("Calculator"));
```

## Assert recognized text

Assert an element screenshot with the same native string assertion syntax used elsewhere in SHAFT:

```java
driver.element().assertThat(By.id("receipt"))
    .ocrText()
    .contains("Payment complete");
```

Assert an encoded image or image file directly:

```java
SHAFT.Validations.assertThat()
    .image(Path.of("test-data/receipt.png"))
    .ocrText()
    .contains("Total");

SHAFT.Validations.verifyThat()
    .image(imageBytes)
    .ocrText()
    .contains("Order number");
```

OCR recognition attaches the source image and recognition details to the report. OCR targeting also attaches the selected match, including its text, confidence, and bounds.

## Tune recognition

Start from `OcrOptions.defaults()` when asserting an image or element. Tune a target directly when interacting with visible text:

```java
var options = OcrOptions.defaults()
    .withLanguages("English", "Arabic")
    .withMinimumConfidence(0.80)
    .withPreprocessingMode(OcrPreprocessingMode.GRAYSCALE)
    .withPageSegmentationMode(OcrPageSegmentationMode.SPARSE_TEXT)
    .within(new OcrRectangle(0, 0, 900, 500));

SHAFT.Validations.assertThat()
    .image(Path.of("test-data/bilingual-receipt.png"))
    .ocrText(options)
    .contains("الإجمالي");
```

Available preprocessing modes are `AUTO`, `NONE`, `GRAYSCALE`, `BINARY`, and
`INVERT`. `AUTO` derives an Otsu threshold from the image, composites alpha onto
white, and preserves pixel coordinates. Page segmentation modes cover automatic
text, a single block, line, or word, and sparse text.

## Configure language models

English and Arabic are the default languages. Pass Tesseract three-letter model codes or supported human-readable names for other languages. SHAFT downloads missing models on first use from a pinned `tessdata_fast` revision, verifies their integrity, and stores them in the user cache.

Configure provisioning through the typed property namespace:

```java
SHAFT.Properties.ocr.set()
    .cacheDirectory("build/shaft-ocr-models")
    .downloadEnabled(false);
```

Use `shaft.ocr.cacheDirectory` and `shaft.ocr.downloadEnabled` in `custom.properties` or as system properties when code configuration is not appropriate.

:::warning
When downloads are disabled, every requested language model must already exist in the configured cache and pass integrity verification. SHAFT fails before recognition if a model is missing or altered.
:::

## Choose OCR for pixel-only text

Prefer semantic locators when the application exposes a stable DOM, accessibility tree, or native element hierarchy. Use OCR for canvases, remote desktops, streamed applications, rendered documents, screenshots, inaccessible native surfaces, and other cases where text exists only as pixels.

OCR accuracy depends on image resolution, contrast, font rendering, language models, and segmentation. Restrict the region, choose a suitable preprocessing mode, and raise the confidence threshold when the screen contains unrelated text.

## Related

- [Visual testing](./visual.md)
- [Desktop and video automation](./desktop-and-video.md)
- [Modular dependencies](../features/modules.md)
- [Mobile testing](../testing/mobile.md)
