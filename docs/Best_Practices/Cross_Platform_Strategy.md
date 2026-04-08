---
id: Cross_Platform_Strategy
title: "Cross-Platform Strategy: Android and iOS"
sidebar_label: Cross-Platform Strategy
description: "When to combine Android and iOS tests in one project vs. separate projects, and how to handle platform-specific locators with SHAFT Engine."
keywords: [SHAFT, cross-platform, Android, iOS, mobile testing, platform strategy, locator strategy, Appium]
tags: [best-practices, mobile, cross-platform, android, ios, appium]
---

One of the most common questions in mobile test automation is: **should Android and iOS tests live in the same project or in separate projects?** The answer depends on how similar the apps are.

---

## Same Project: When and Why

Combine both platforms in a **single project** when:

- The Android and iOS apps share the **same user flows and screens**.
- The business logic and test scenarios are **identical** across platforms.
- You want to **maximize code reuse** for test logic, utilities, and data.

### How It Works

Keep your test logic in shared classes and isolate platform differences in the **page object locators**:

```java title="LoginPage.java"
import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import com.shaft.driver.SHAFT;

public class LoginPage {
    private final SHAFT.GUI.WebDriver driver;

    public LoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    // Platform-specific locators
    private By getUsernameInput() {
        return isAndroid()
            ? By.id("com.example:id/username")
            : By.name("username_field");
    }

    private By getPasswordInput() {
        return isAndroid()
            ? By.id("com.example:id/password")
            : By.name("password_field");
    }

    private By getLoginButton() {
        return isAndroid()
            ? By.id("com.example:id/login_btn")
            : By.xpath("//XCUIElementTypeButton[@name='Login']");
    }

    // Shared test logic
    public void login(String username, String password) {
        driver.element()
            .type(getUsernameInput(), username)
            .and().type(getPasswordInput(), password)
            .and().click(getLoginButton());
    }

    private boolean isAndroid() {
        return SHAFT.Properties.platform.targetPlatform()
            .equals(Platform.ANDROID.name());
    }
}
```

Your test class stays completely platform-agnostic:

```java title="LoginTest.java"
@Test(description = "Verify successful login")
public void testLogin() {
    new LoginPage(driver).login("user@example.com", "password123");
    // Validations work the same way on both platforms
}
```

:::tip
Switch platforms by changing a single property — no code changes needed:
```properties title="src/main/resources/properties/custom.properties"
targetPlatform=ANDROID
```
Or override it from the command line:
```bash
mvn test -DtargetPlatform=IOS
```
:::

---

## Separate Projects: When and Why

Use **separate projects** when:

- The Android and iOS apps have **significantly different UIs, flows, or features**.
- Each platform has **unique screens or interactions** that the other does not have.
- The teams maintaining Android and iOS tests are **different** and work independently.
- You need **different dependency versions** or build configurations for each platform.

### Shared Utilities as a Library

Even with separate projects, you can share common utilities (API clients, data generators, helper methods) by extracting them into a shared Maven/Gradle module:

```
my-company-tests/
├── shared-utils/          ← Common utilities module
│   └── src/main/java/
├── android-tests/         ← Android test project
│   └── pom.xml           (depends on shared-utils)
└── ios-tests/             ← iOS test project
    └── pom.xml           (depends on shared-utils)
```

---

## Decision Guide

| Factor | Same Project | Separate Projects |
|---|---|---|
| Identical user flows | ✅ Best fit | Overhead |
| Different UIs per platform | Complexity | ✅ Best fit |
| Shared test logic | ✅ Maximum reuse | Partial (via shared library) |
| Independent team ownership | Coordination needed | ✅ Best fit |
| CI/CD simplicity | ✅ One pipeline, parameterized | Two pipelines |

---

## Recommended Approach

For most teams, starting with a **single project** is the best default. You get maximum code reuse and a single source of truth for your test scenarios. If the apps diverge significantly over time, you can always split later.

:::info
SHAFT Engine's property-based platform switching makes it easy to run the same tests against both platforms from a single project. Just parameterize `targetPlatform` in your CI/CD pipeline.
:::
