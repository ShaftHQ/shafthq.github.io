---
id: first_steps_2
title: "How SHAFT Extends Selenium WebDriver"
sidebar_label: SHAFT & Selenium
description: "Learn how SHAFT builds on Selenium WebDriver to add auto-synchronization, fluent APIs, built-in reporting, and support for TestNG, JUnit 5, and Cucumber."
keywords: [selenium webdriver wrapper, selenium java framework, selenium auto wait, selenium fluent api, selenium page object model, W3C WebDriver, WebDriver BiDi]
---

# How SHAFT Extends Selenium WebDriver

SHAFT is built **on top of** Selenium WebDriver — not a replacement for it. Everything you know about Selenium still applies.

## Full Selenium Compatibility

- Compatible with the official **[Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)** API.
- Fully supports **[W3C WebDriver](https://www.w3.org/standards/)** and **[WebDriver BiDi](https://w3c.github.io/webdriver-bidi/)** standards.
- Backed by the largest test automation community in the world.

## What SHAFT Adds on Top

| Capability | Native Selenium | With SHAFT |
|-----------|----------------|------------|
| **Auto-wait** | Manual explicit waits required | Built-in intelligent synchronization |
| **Reporting** | None (bring your own) | Allure reports with screenshots & video |
| **Driver management** | Manual or Selenium Manager | Fully automatic — local, remote, or Docker |
| **Element interaction** | Separate call per action | Fluent chaining: `.type().click().assertThat()` |
| **Configuration** | Hard-coded in test code | Externalized via [properties](../Properties/PropertyTypes) |
| **Multi-platform** | Web only | Web + Mobile + API + CLI + Database |

## Test Runner Support

SHAFT works with all three major Java test runners:

- **[TestNG](https://testng.org/)** — Rich annotations, built-in parallel execution, data providers
- **[JUnit 5](https://junit.org/junit5/)** — Modern Java testing features, parameterized tests
- **[Cucumber](https://cucumber.io/)** — BDD with Gherkin for non-technical stakeholders

Use any design pattern you prefer — **Page Object Model**, **Fluent Design**, **Screenplay**, or your own.

## Direct Access to Underlying APIs

SHAFT never locks you in:

```java
// Get a native Selenium WebDriver object at any point
WebDriver nativeDriver = driver.getDriver();

// Get a native Appium driver
AppiumDriver appiumDriver = (AppiumDriver) driver.getDriver();

// Get a native REST Assured Response object
Response response = api.getResponse();
```

No forced syntax. No limitations. Full control over your code.