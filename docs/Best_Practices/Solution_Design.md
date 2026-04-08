---
id: Solution_Design
title: "Test Automation Solution Design Patterns"
sidebar_label: Solution Design
description: "Compare test automation design patterns — Page Object Model, fluent design, anonymous classes, inheritance, and base classes — with SHAFT Engine examples."
keywords: [SHAFT, design patterns, Page Object Model, POM, fluent design, base class, inheritance, test architecture]
tags: [best-practices, design-patterns, page-object-model, architecture]
---

How you design your test automation solution determines its readability, maintainability, and scalability. This page compares the most common patterns and shows how each works with SHAFT Engine.

---

## Page Object Model (POM)

The **Page Object Model** encapsulates each page (or component) of your application in a dedicated class. Locators and actions live together, and test classes call page object methods.

```java title="LoginPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class LoginPage {
    private final SHAFT.GUI.WebDriver driver;
    private final By usernameInput = By.id("username");
    private final By passwordInput = By.id("password");
    private final By loginButton = By.id("login-btn");

    public LoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public void navigateTo() {
        driver.browser().navigateToURL("https://example.com/login");
    }

    public void login(String username, String password) {
        driver.element()
            .type(usernameInput, username)
            .and().type(passwordInput, password)
            .and().click(loginButton);
    }
}
```

```java title="LoginTest.java"
@Test(description = "Verify login with valid credentials")
public void testValidLogin() {
    LoginPage loginPage = new LoginPage(driver);
    loginPage.navigateTo();
    loginPage.login("admin", "password123");
}
```

:::tip
**POM is the most widely used pattern** and is recommended as the default approach. It provides a clean separation between test logic and page structure.
:::

---

## Fluent Page Object (Method Chaining)

A variation of POM where page object methods return `this`, enabling method chaining:

```java title="FluentLoginPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class FluentLoginPage {
    private final SHAFT.GUI.WebDriver driver;
    private final By usernameInput = By.id("username");
    private final By passwordInput = By.id("password");
    private final By loginButton = By.id("login-btn");

    public FluentLoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public FluentLoginPage navigateTo() {
        driver.browser().navigateToURL("https://example.com/login");
        return this;
    }

    public FluentLoginPage enterUsername(String username) {
        driver.element().type(usernameInput, username);
        return this;
    }

    public FluentLoginPage enterPassword(String password) {
        driver.element().type(passwordInput, password);
        return this;
    }

    public FluentLoginPage clickLogin() {
        driver.element().click(loginButton);
        return this;
    }
}
```

```java title="FluentLoginTest.java"
@Test(description = "Verify login with fluent page objects")
public void testValidLogin() {
    new FluentLoginPage(driver)
        .navigateTo()
        .enterUsername("admin")
        .enterPassword("password123")
        .clickLogin();
}
```

---

## Anonymous / Inline Style

For simple tests or quick prototypes, you can skip page objects entirely and call SHAFT actions directly in the test:

```java title="InlineTest.java"
@Test(description = "Quick login verification")
public void testLogin() {
    driver.browser().navigateToURL("https://example.com/login");
    driver.element()
        .type(By.id("username"), "admin")
        .and().type(By.id("password"), "password123")
        .and().click(By.id("login-btn"));
    driver.assertThat(By.id("welcome"))
        .text().contains("Welcome, admin")
        .perform();
}
```

:::warning
The anonymous style is convenient for small tests and prototypes, but it does not scale well. Locators are duplicated, and changes to the UI require updating every test that references the affected elements.
:::

---

## Base Class with Inheritance

A common pattern for sharing setup, teardown, and utility methods across test classes:

```java title="BaseTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
    protected SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void baseSetup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    public void baseTeardown() {
        driver.quit();
    }
}
```

```java title="LoginTest.java"
public class LoginTest extends BaseTest {
    @Test(description = "Verify login with valid credentials")
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo();
        loginPage.login("admin", "password123");
    }
}
```

:::tip
Keep your base class **thin** — only shared setup/teardown and truly universal utilities. Avoid putting test-specific logic in the base class.
:::

---

## Pattern Comparison

| Pattern | Readability | Reusability | Maintenance | Best For |
|---|---|---|---|---|
| **Page Object Model** | High | High | Low cost | Most projects (recommended default) |
| **Fluent Page Object** | Very high | High | Low cost | Teams that value readable test code |
| **Anonymous / Inline** | Moderate | None | High cost | Prototypes, one-off tests |
| **Base Class + Inheritance** | High | Moderate | Moderate | Shared setup across test classes |

---

## Combining Patterns

In practice, most teams combine several patterns:

1. **Base class** for shared driver setup/teardown.
2. **Page Object Model** for page-level abstractions.
3. **Fluent chaining** within page object methods (using SHAFT's built-in fluent API).
4. **Anonymous style** for quick, isolated tests that do not warrant a full page object.

```java title="CombinedExample.java"
// Base class provides driver lifecycle
public class CheckoutTest extends BaseTest {

    @Test(description = "Complete checkout flow")
    public void testCheckout() {
        // POM for structured page interactions
        new LoginPage(driver).navigateTo().login("user", "pass");
        new ProductPage(driver).addToCart("Laptop");

        // Inline for simple assertions
        driver.assertThat(By.id("cart-count")).text().isEqualTo("1").perform();
    }
}
```

---

## Best Practices

1. **Start with POM** — it is the industry standard and scales well.
2. **Use a base class** for driver setup/teardown, but keep it thin.
3. **Leverage SHAFT's fluent API** inside your page object methods for readability.
4. **Avoid deep inheritance hierarchies** — prefer composition over inheritance when sharing behavior between page objects.
5. **Choose one primary pattern and be consistent** across your project — mixing too many patterns creates confusion.
