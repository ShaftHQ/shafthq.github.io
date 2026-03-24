---
id: Browser
title: Browser Validations
sidebar_label: Browser
description: "Validate browser attributes such as URL and title using SHAFT Engine's WebDriverBrowserValidationsBuilder."
keywords: [SHAFT, browser validations, URL validation, title validation, web driver, assertions, verifications]
tags: [validations, browser, url, title]
---

You can perform assertions and verifications on the browser itself using the `WebDriverBrowserValidationsBuilder`. Access it through the driver instance or the standalone `Validations` class.

## attribute()

Use this method to validate a specific browser attribute. It returns a `NativeValidationsBuilder` to continue building your validation chain.

### Validate Browser URL

```java title="BrowserUrlValidation.java"
// Using driver-based validation (recommended)
driver.assertThat().browser().attribute("url").isEqualTo("https://example.com").perform();
driver.verifyThat().browser().attribute("url").contains("example").perform();

// Using standalone validation
Validations.assertThat().browser(driver.getDriver()).attribute("url").isEqualTo("https://example.com").perform();
Validations.verifyThat().browser(driver.getDriver()).attribute("url").contains("example").perform();
```

### Validate Browser Title

```java title="BrowserTitleValidation.java"
// Using driver-based validation (recommended)
driver.assertThat().browser().attribute("title").isEqualTo("My Page Title").perform();
driver.verifyThat().browser().attribute("title").contains("Page").perform();

// Using standalone validation
Validations.assertThat().browser(driver.getDriver()).attribute("title").isEqualTo("My Page Title").perform();
Validations.verifyThat().browser(driver.getDriver()).attribute("title").contains("Page").perform();
```

:::tip
After calling `.attribute()`, you can chain any of the following comparison methods: `.isEqualTo()`, `.contains()`, `.doesNotContain()`, `.matchesRegex()`, `.isNull()`, `.isNotNull()`, and more.
:::