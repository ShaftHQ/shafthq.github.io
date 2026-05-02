---
id: basicConfig
title: Basic Configuration for Web GUI
sidebar_label: Web GUI
description: "Configure SHAFT Engine properties for web browser automation — browser type, headless mode, timeouts, proxy, and visual reporting."
keywords: [SHAFT, web configuration, browser settings, headless mode, proxy settings, Chrome, Firefox, Selenium configuration]
tags: [web, configuration, selenium, browser]
---

SHAFT auto-generates a default `custom.properties` file on your first test run. Use it to tailor browser selection, timeouts, and reporting without touching your test code.

:::tip
All properties can also be set programmatically or overridden via Maven `-D` flags. See [Programmatic Config](../Properties/Programmatic_Config) and [Properties Reference](../Properties/PropertiesList) for the full list.
:::

---

## Target Browser

```properties title="src/main/resources/properties/custom.properties"
# Supported values: CHROME | FIREFOX | SAFARI | MICROSOFTEDGE
targetBrowserName=CHROME

# Run without a visible browser window (faster, ideal for CI/CD)
headlessExecution=true
```

Override from the command line without changing the file:

```bash
mvn test -DtargetBrowserName=FIREFOX -DheadlessExecution=true
```

---

## Base URL and Timeouts

```properties title="src/main/resources/properties/custom.properties"
# Used as a prefix when you call driver.browser().navigateToURL("/path")
baseURL=https://staging.example.com

# Time (seconds) SHAFT will retry finding an element before failing
defaultElementIdentificationTimeout=30

# Time (seconds) to wait for a page navigation to complete
browserNavigationTimeout=60

# Time (seconds) to wait for the full page DOM to load
pageLoadTimeout=60
```

---

## Visual Reporting

```properties title="src/main/resources/properties/custom.properties"
# Generate an animated GIF of each test in the Allure report
createAnimatedGif=true

# Record a full MP4 video of each test execution
videoParams_recordVideo=true
```

---

## Reliability & Retries

```properties title="src/main/resources/properties/custom.properties"
# Automatically retry failed tests up to N times
retryMaximumNumberOfAttempts=3

# Loosen the built-in pre-action checks if your app has unusual rendering
forceCheckForElementVisibility=false
forceCheckElementLocatorIsUnique=false
forceCheckTextWasTypedCorrectly=false
forceCheckNavigationWasSuccessful=false

# Use JavaScript click as a fallback when a WebDriver click fails
clickUsingJavascriptWhenWebDriverClickFails=true
```

---

## Proxy

Only needed if you are behind a corporate proxy:

```properties title="src/main/resources/properties/custom.properties"
com.SHAFT.proxySettings=proxy.corp.example.com:8080
```

---

[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>