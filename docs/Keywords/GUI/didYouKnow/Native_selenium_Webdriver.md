---
id: Native_selenium_Webdriver
title: Native Selenium WebDriver Access
sidebar_label: Native Selenium WebDriver
description: "Access the native Selenium WebDriver instance from SHAFT for advanced use cases, and learn how to wrap an existing WebDriver with SHAFT capabilities."
keywords: [SHAFT, native Selenium, WebDriver access, custom Selenium, advanced Selenium, driver instance, wrap WebDriver]
tags: [web, selenium, native-driver]
---

## Accessing the Native Selenium WebDriver

Did you know that you can use the native Selenium WebDriver with SHAFT whenever you need it?

```java title="NativeDriverAccess.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
WebDriver nativeDriver = driver.getDriver();
```

**Example:**

```java title="NativeDriverExample.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
WebDriver nativeDriver = driver.getDriver();

// Use native Selenium directly when needed
nativeDriver.findElement(By.id("lname")).sendKeys("Smith");
```

---

## Wrapping an Existing WebDriver Instance

You can wrap any existing `org.openqa.selenium.WebDriver` instance with SHAFT capabilities. This is useful when migrating from plain Selenium to SHAFT incrementally, or when a third-party library hands you a raw driver.

```java title="WrapExistingWebDriver.java"
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import com.shaft.driver.SHAFT;

// Start with a plain Selenium driver
WebDriver rawDriver = new ChromeDriver();
rawDriver.get("https://example.com");

// Wrap it — all SHAFT fluent actions, smart waits, and reporting now apply
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(rawDriver);

driver.assertThat().browser().title().contains("Example").perform();
driver.element().click(By.id("ctaButton"));

driver.quit();
```

### Why Wrap a Driver?

| Benefit | Description |
|:--------|:------------|
| **Fluent API** | Chain browser, element, and validation actions |
| **Smart waits** | Auto-wait for elements to be interactable |
| **Allure reporting** | Steps and screenshots captured automatically |
| **Incremental migration** | Introduce SHAFT into existing Selenium projects gradually |

:::tip
After wrapping, call `driver.quit()` (not `rawDriver.quit()`) to ensure SHAFT's lifecycle hooks run correctly and the Allure report is finalised.
:::
