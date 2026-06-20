---
id: Elements
title: Element Validations
sidebar_label: Element
description: "Validate web element properties such as existence, visibility, text, attributes, and visual appearance using SHAFT Engine."
keywords: [SHAFT, element validations, web element, assertions, verifications, visual testing, OpenCV]
tags: [validations, element, web]
---

You can perform assertions and verifications on web elements using the `WebDriverElementValidationsBuilder`. Access it through the driver instance or the standalone `Validations` class.

## exists()

Checks that the target element exists in the DOM.

```java title="ElementExistsValidation.java"
// Using driver-based validation (recommended)
driver.assertThat().element(locator).exists();
driver.verifyThat().element(locator).exists();

// Using standalone validation
Validations.assertThat().element(driver.getDriver(), locator).exists();
Validations.verifyThat().element(driver.getDriver(), locator).exists();
```

## doesNotExist()

Checks that the target element does not exist in the DOM.

```java title="ElementDoesNotExistValidation.java"
driver.assertThat().element(locator).doesNotExist();
driver.verifyThat().element(locator).doesNotExist();
```

## matchesReferenceImage()

Checks that the target element matches a reference image using OpenCV. On the first run, a screenshot of the element is captured and saved as the reference. Subsequent runs compare the element against this reference. Reference images are stored under `src/test/resources/DynamicObjectRepository`.

```java title="VisualValidation.java"
driver.assertThat().element(locator).matchesReferenceImage();
driver.verifyThat().element(locator).matchesReferenceImage();
```

## doesNotMatchReferenceImage()

Checks that the target element does not match the stored reference image.

```java title="VisualMismatchValidation.java"
driver.assertThat().element(locator).doesNotMatchReferenceImage();
driver.verifyThat().element(locator).doesNotMatchReferenceImage();
```

## attribute()

Checks a specific element attribute against an expected value. After calling `.attribute()`, chain a comparison method such as `.isEqualTo()`, `.contains()`, `.doesNotContain()`, `.matchesRegex()`, and more.

```java title="ElementAttributeValidation.java"
// Validate the "class" attribute contains "active"
driver.assertThat().element(locator).attribute("class").contains("active");

// Validate the "href" attribute equals a specific URL
driver.verifyThat().element(locator).attribute("href").isEqualTo("https://example.com");
```

## text()

Checks the text content of the target element. Chain a comparison method after calling `.text()`.

```java title="ElementTextValidation.java"
driver.assertThat().element(locator).text().isEqualTo("Welcome");
driver.verifyThat().element(locator).text().contains("Welcome");
```

## textTrimmed()

Checks the text content of the target element after trimming all leading and trailing whitespace.

```java title="ElementTextTrimmedValidation.java"
driver.assertThat().element(locator).textTrimmed().isEqualTo("Hello World");
driver.verifyThat().element(locator).textTrimmed().contains("Hello");
```

## cssProperty()

Checks a CSS property value of the target element. Chain a comparison method after calling `.cssProperty()`.

```java title="ElementCssValidation.java"
driver.assertThat().element(locator).cssProperty("color").contains("rgb(0, 128, 0)");
driver.verifyThat().element(locator).cssProperty("font-size").isEqualTo("14px");
```

## State Validations

### isVisible()

Checks that the target element is visible on the page.

```java title="ElementVisibleValidation.java"
driver.assertThat().element(locator).isVisible();
```

### isHidden()

Checks that the target element is hidden.

```java title="ElementHiddenValidation.java"
driver.assertThat().element(locator).isHidden();
```

### isEnabled()

Checks that the target element is enabled (not disabled).

```java title="ElementEnabledValidation.java"
driver.assertThat().element(locator).isEnabled();
```

### isDisabled()

Checks that the target element is disabled.

```java title="ElementDisabledValidation.java"
driver.assertThat().element(locator).isDisabled();
```

### isSelected()

Checks that the target element is selected (e.g., a checkbox or radio button).

```java title="ElementSelectedValidation.java"
driver.assertThat().element(locator).isSelected();
```

### isNotSelected()

Checks that the target element is not selected.

```java title="ElementNotSelectedValidation.java"
driver.assertThat().element(locator).isNotSelected();
```

### isChecked()

Checks that the target element is checked.

```java title="ElementCheckedValidation.java"
driver.assertThat().element(locator).isChecked();
```

### isNotChecked()

Checks that the target element is not checked.

```java title="ElementNotCheckedValidation.java"
driver.assertThat().element(locator).isNotChecked();
```

:::tip
All the state validation methods above execute eagerly when the condition is selected. You can optionally add a custom report message to the chain:
```java
driver.assertThat().element(locator).isVisible()
    .withCustomReportMessage("Verify login button is visible");
```
:::

## Related

- [Overview](/docs/reference/actions/Validations/Overview)
- [Soft Vs Hard Assertions](/docs/reference/actions/Validations/Soft_vs_Hard_Assertions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
