---
id: Architecture
title: "Test Automation Architecture"
sidebar_label: Architecture
description: "Understand common test automation architectures and where SHAFT Engine fits in the technology stack."
keywords: [SHAFT, test automation architecture, framework layers, Selenium, Appium, REST Assured, architecture diagram]
---

A well-designed test automation architecture separates concerns into layers, making tests easier to write, maintain, and scale. This page explains the common layers and where SHAFT Engine fits.

---

## The Layers of Test Automation

```
┌────────────────────────────────────┐
│         Test Scripts / Specs       │  ← Your test classes and methods
├────────────────────────────────────┤
│        Page Objects / Models       │  ← UI/API abstractions (your code)
├────────────────────────────────────┤
│      Test Automation Engine        │  ← SHAFT Engine sits here
├────────────────────────────────────┤
│       Core Libraries               │  ← Selenium, Appium, REST Assured
├────────────────────────────────────┤
│    Drivers / Protocols              │  ← ChromeDriver, GeckoDriver, W3C WebDriver
├────────────────────────────────────┤
│   Application Under Test           │  ← Web app, mobile app, API server
└────────────────────────────────────┘
```

---

## What Each Layer Does

### Test Scripts

The top layer is **your code** — test methods that describe what to verify:

```java title="LoginTest.java"
@Test(description = "Verify login with valid credentials")
public void testValidLogin() {
    loginPage.login("user@example.com", "password");
    dashboardPage.verifyWelcomeMessage("Welcome, user");
}
```

### Page Objects / Models

The abstraction layer that maps your application's UI or API to reusable classes:

```java title="LoginPage.java"
public class LoginPage {
    private final SHAFT.GUI.WebDriver driver;
    private final By usernameInput = By.id("username");
    private final By passwordInput = By.id("password");
    private final By loginButton = By.id("login-btn");

    public LoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public void login(String username, String password) {
        driver.element()
            .type(usernameInput, username)
            .and().type(passwordInput, password)
            .and().click(loginButton);
    }
}
```

### Test Automation Engine (SHAFT)

SHAFT sits between your page objects and the core libraries. It provides:

- **Smart element handling** — automatic waits, retries, scrolling, and highlighting
- **Unified API** — one consistent interface for web, mobile, API, CLI, and database testing
- **Built-in reporting** — Allure integration with screenshots, videos, and step-by-step logs
- **Configuration management** — property-based configuration with file/code/CLI override hierarchy
- **Validation framework** — fluent assertions with custom report messages

### Core Libraries

SHAFT wraps and enhances these industry-standard libraries:

| Library | Purpose |
|---|---|
| **Selenium WebDriver** | Web browser automation |
| **Appium** | Mobile app automation (Android and iOS) |
| **REST Assured** | REST API testing |
| **TestNG / JUnit 5** | Test execution and lifecycle management |
| **Allure** | Test reporting |

### Drivers / Protocols

The browser and device drivers that translate commands into actions on the application:

- ChromeDriver, GeckoDriver, EdgeDriver for browsers
- Appium Server for mobile devices
- HTTP client for API calls

---

## Where SHAFT Saves You Work

Without SHAFT, you would need to build and maintain these capabilities yourself:

| Capability | Without SHAFT | With SHAFT |
|---|---|---|
| Wait strategy | Manual `WebDriverWait` configuration | Automatic smart waits |
| Element not found handling | Custom retry logic | Built-in retry with configurable attempts |
| Screenshot capture | Manual `TakesScreenshot` code | Automatic at validation points |
| Reporting | Manual Allure setup and step annotations | Automatic step logging and report generation |
| Configuration | Custom properties loading | Property hierarchy with file/code/CLI support |
| Cross-browser | Manual driver management | Automatic driver management |

---

## Architecture Decision: Engine vs. Framework

| Concept | Description |
|---|---|
| **Test Automation Engine** | Provides capabilities (SHAFT). Your code calls it. |
| **Test Automation Framework** | Imposes structure and conventions. Your code plugs into it. |

SHAFT is an **engine**, not a framework. It does not dictate how you structure your tests — you can use Page Object Model, fluent design, or any pattern you prefer. SHAFT provides the building blocks; you decide how to assemble them.

:::info
This flexibility means SHAFT works with your team's existing architecture and conventions. You adopt it gradually — one test at a time — without rewriting your entire suite.
:::
