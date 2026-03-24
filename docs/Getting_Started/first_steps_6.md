---
id: first_steps_6
title: "Migrate Existing Selenium Projects to SHAFT"
sidebar_label: Existing Projects
description: "Upgrade your existing Selenium, Appium, or REST Assured project to use SHAFT Engine. Step-by-step migration guide with pom.xml changes."
keywords: [migrate selenium to shaft, upgrade selenium project, selenium migration guide, convert selenium tests, shaft engine migration]
tags: [getting-started, migration, selenium]
---

# Upgrading an Existing Project to SHAFT

Already have a Selenium, Appium, or REST Assured project? You can add SHAFT incrementally — no need to rewrite your tests.

## Step 1: Add the SHAFT Dependency

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>SHAFT_ENGINE</artifactId>
    <!-- Replace with the latest version from Maven Central -->
    <version>RELEASE</version>
</dependency>
```

:::info
Check [Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE) for the latest SHAFT version.
:::

## Step 2: Start Using SHAFT Drivers

Replace native driver initialization with SHAFT drivers:

```java
// Before — native Selenium
WebDriver driver = new ChromeDriver();

// After — SHAFT (browser type configured via properties)
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

Your existing `By` locators and test logic remain unchanged.

## Step 3: Leverage SHAFT Features Incrementally

You don't need to migrate everything at once. Start with:

1. **Replace driver init** — Let SHAFT manage browser/driver lifecycle
2. **Use built-in waits** — Remove explicit `WebDriverWait` calls
3. **Add validations** — Use `driver.assertThat()` for built-in assertions with reporting
4. **Externalize config** — Move hard-coded values to [properties files](../Properties/PropertyTypes)

## Full Migration Guide

For detailed migration steps, see the **[complete migration guide on GitHub](https://github.com/shafthq/SHAFT_ENGINE?tab=readme-ov-file#-quick-start-guide)**.