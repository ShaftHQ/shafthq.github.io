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

## Process PDF documents

Use `PdfFileManager` to read native text and recognize text from scanned or mixed pages in the same PDF. SHAFT processes every page, keeps native positioned text when it is available, and calls `shaft-ocr` with a whole-page render only for pages that need pixel recognition.

```java
var document = new PdfFileManager("test-data/invoice.pdf").process();

String text = document.fullText();
var firstPage = document.pages().getFirst();

System.out.println(firstPage.source());      // NATIVE, OCR, or HYBRID
System.out.println(firstPage.confidence());
System.out.println(firstPage.tables());
```

Each page result contains page, block, paragraph, line, and word geometry. It also reports any applied orientation or deskew correction, inferred tables, confidence, and warnings. Result lists are immutable. Table inference uses aligned word geometry; validate irregular, borderless, or merged-cell results before using them as structured data.

Request exports explicitly. SHAFT writes each export through a temporary sibling file and then moves it into place:

```java
Files.createDirectories(Path.of("build"));

var result = new PdfFileManager("test-data/scanned-invoice.pdf").process(
    PdfExportRequest.to(PdfExportFormat.SEARCHABLE_PDF, Path.of("build/invoice-searchable.pdf")),
    PdfExportRequest.to(PdfExportFormat.HOCR, Path.of("build/invoice.hocr")),
    PdfExportRequest.to(PdfExportFormat.TSV, Path.of("build/invoice.tsv")),
    PdfExportRequest.to(PdfExportFormat.JSON, Path.of("build/invoice.json"))
);

result.exports().forEach(export ->
    System.out.println(export.output() + " " + export.sha256())
);
```

Existing output files are rejected by default. Call `replacingExisting()` on an export request when replacement is intentional. Searchable export of a signed PDF is also rejected because changing the document invalidates its signatures; call `allowingSignatureInvalidation()` only when that consequence is acceptable.

Process independent PDFs as an ordered batch:

```java
var requests = List.of(
    PdfDocumentRequest.of(Path.of("test-data/one.pdf")),
    PdfDocumentRequest.of(Path.of("test-data/two.pdf"))
);

PdfBatchResult batch = PdfFileManager.processAll(
    requests,
    new PdfBatchOptions(4, 256L * 1024 * 1024, false)
);

batch.items().forEach(item ->
    System.out.println(item.source() + " successful=" + item.successful())
);
```

The batch keeps request order and records item failures without discarding successful results. Set `failFast` to `true` to stop before later requests can publish exports; fail-fast execution is serial for that reason.

Set per-call recognition and safety limits through `PdfDocumentOptions`:

```java
var options = PdfDocumentOptions.defaults()
    .withRenderDpi(240)
    .withResourceLimits(100L * 1024 * 1024, 250, 20_000_000)
    .withPageTimeout(Duration.ofSeconds(60))
    .withAllureEvidence(false);

var document = new PdfFileManager("test-data/archive.pdf").process(options);
```

PDF processing attaches a JSON document summary and page-level recognition details to Allure by default. Those details can contain recognized document text, geometry, tables, warnings, and the source path. Disable them with `withAllureEvidence(false)` when the document is sensitive. `shaft.ocr.document.maximumAllureArtifactBytes` controls whether explicit export files are attached or represented by a size and checksum manifest; it does not cap page-level JSON details.

:::warning
SHAFT accepts PDF input only; it does not add Tabula or an ML table runtime. It rejects encrypted PDFs, inputs and page counts above their limits, and individually oversized rendered pages. Concurrent raster work is throttled by the batch byte budget. Treat OCR page timeouts as caller-side bounds: a native OCR library call may finish in its background thread after the timed operation has returned.
:::

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
    .downloadEnabled(false)
    .documentRenderDpi(300)
    .documentMaximumPages(500)
    .documentMaximumInFlightRasterBytes(256L * 1024 * 1024);
```

Use the matching `shaft.ocr.*` keys in `custom.properties` or as system properties when code configuration is not appropriate. Document options passed to `process(...)` override the defaults for that call.

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
