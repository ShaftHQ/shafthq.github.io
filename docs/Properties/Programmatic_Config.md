---
id: Programmatic_Config
title: Programmatic Properties Configuration
sidebar_label: Programmatic Config
description: "Configure SHAFT Engine properties in code at runtime — thread-safe programmatic configuration for browser, timeouts, visuals, and behaviour flags."
keywords: [SHAFT, programmatic configuration, SHAFT.Properties, runtime config, thread-safe properties, dynamic configuration]
tags: [properties, configuration, setup]
---

SHAFT Engine properties can be configured **programmatically in code** instead of (or in addition to) property files. Programmatic configuration is **thread-safe**, takes effect immediately, and overrides any values set in property files or system properties.

:::info
**Precedence order**: Programmatic (`SHAFT.Properties.x.set()`) > Property files (`.properties`) > System properties (`-Dproperty=value`) > Built-in defaults.
:::

---

## Web / Browser Properties

```java title="ProgrammaticConfig.java"
import com.shaft.driver.SHAFT;

// Configure browser and web properties
SHAFT.Properties.web.set()
    .targetBrowserName("chrome")
    .headlessExecution(true)
    .baseURL("https://staging.example.com");
```

---

## Timeout Properties

```java title="ProgrammaticConfig.java"
// Configure timeouts (values in seconds)
SHAFT.Properties.timeouts.set()
    .defaultElementIdentificationTimeout(30)
    .browserNavigationTimeout(60);
```

---

## Visual Reporting Properties

```java title="ProgrammaticConfig.java"
// Configure screenshots and video recording
SHAFT.Properties.visuals.set()
    .screenshotParamsWhenActionIsPerformedPassedOrFailed("ELEMENT")
    .recordVideo(true);
```

---

## Behaviour Flags

```java title="ProgrammaticConfig.java"
// Configure test behaviour flags
SHAFT.Properties.flags.set()
    .retryMaximumNumberOfAttempts(2)
    .autoMaximizeBrowserWindow(true)
    .forceCheckForElementVisibility(true);
```

---

## Reading Current Values

Access the current value of any property by calling the getter **without** `.set()`:

```java title="ProgrammaticConfig.java"
// Read current property values
String browser = SHAFT.Properties.web.targetBrowserName();
int timeout = SHAFT.Properties.timeouts.defaultElementIdentificationTimeout();
boolean isHeadless = SHAFT.Properties.web.headlessExecution();
```

---

## Complete Example

```java title="ProgrammaticConfigTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ProgrammaticConfigTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        // Configure all properties before creating the driver
        SHAFT.Properties.web.set()
            .targetBrowserName("chrome")
            .headlessExecution(true)
            .baseURL("https://staging.example.com");

        SHAFT.Properties.timeouts.set()
            .defaultElementIdentificationTimeout(30)
            .browserNavigationTimeout(60);

        SHAFT.Properties.visuals.set()
            .screenshotParamsWhenActionIsPerformedPassedOrFailed("ELEMENT");

        SHAFT.Properties.flags.set()
            .retryMaximumNumberOfAttempts(2)
            .autoMaximizeBrowserWindow(true);

        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void navigateAndVerify() {
        driver.browser().navigateToURL("/login");
        driver.element().type(By.id("email"), "test@example.com");
        driver.assertThat(By.id("email")).attribute("value").isEqualTo("test@example.com").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## Dynamic Configuration Use Case

Programmatic configuration is ideal for parameterized test runs where the target environment is determined at runtime:

```java title="DynamicConfigExample.java"
String targetEnv = System.getenv("TARGET_ENV"); // "staging" or "production"
String baseUrl = "staging".equals(targetEnv)
    ? "https://staging.example.com"
    : "https://example.com";

SHAFT.Properties.web.set().baseURL(baseUrl);
```

---

:::tip
Set all properties in `@BeforeMethod` (or `@BeforeClass` for class-scoped drivers) **before** creating the `SHAFT.GUI.WebDriver` instance. Properties configured after driver creation only apply to subsequent driver instances.
:::

:::warning
Avoid setting properties in parallel test methods without careful thread-isolation — use `@BeforeMethod` (which is per-thread in TestNG) to keep configuration thread-safe.
:::
