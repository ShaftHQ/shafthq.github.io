---
id: Test_Structure
title: "Test Structure: Cases vs. Scenarios"
sidebar_label: Test Structure
description: "Understand the difference between isolated test cases and dependent test scenarios, and why you should avoid using priority to order tests."
keywords: [SHAFT, test structure, test cases, test scenarios, test priority, dependsOnMethods, isolated tests, TestNG]
tags: [best-practices, test-structure, testng, junit5]
---

How you structure your tests has a major impact on reliability, maintainability, and debugging speed. This page covers the two main approaches — **isolated test cases** and **dependent test scenarios** — and explains why you should avoid using `priority` to control execution order.

---

## Test Cases: Isolated and Independent

An **isolated test case** is self-contained. It sets up its own data, performs its action, validates the result, and cleans up — without depending on any other test.

```java title="IsolatedTestCase.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://example.com/login");
    }

    @Test(description = "Verify login with valid credentials")
    public void testValidLogin() {
        driver.element()
            .type(By.id("username"), "validUser")
            .and().type(By.id("password"), "validPass")
            .and().click(By.id("login-btn"));
        driver.assertThat(By.id("welcome")).text().contains("Welcome").perform();
    }

    @Test(description = "Verify login with invalid password")
    public void testInvalidPassword() {
        driver.element()
            .type(By.id("username"), "validUser")
            .and().type(By.id("password"), "wrongPass")
            .and().click(By.id("login-btn"));
        driver.assertThat(By.id("error")).text().contains("Invalid credentials").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

:::tip
**Isolated tests are the default recommendation.** They can run in any order, in parallel, and a failure in one test never cascades to others.
:::

---

## Test Scenarios: Dependent Steps

A **test scenario** models a multi-step business flow where each step depends on the previous one. Use `dependsOnMethods` to express this dependency explicitly:

```java title="DependentTestScenario.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class CheckoutScenario {
    private SHAFT.GUI.WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test(description = "Step 1: Login to the store")
    public void login() {
        driver.browser().navigateToURL("https://example.com/login");
        driver.element()
            .type(By.id("username"), "shopper@example.com")
            .and().type(By.id("password"), "password123")
            .and().click(By.id("login-btn"));
    }

    @Test(description = "Step 2: Add item to cart", dependsOnMethods = "login")
    public void addToCart() {
        driver.element().click(By.cssSelector("[data-product='laptop'] .add-to-cart"));
        driver.assertThat(By.id("cart-count")).text().isEqualTo("1").perform();
    }

    @Test(description = "Step 3: Complete checkout", dependsOnMethods = "addToCart")
    public void checkout() {
        driver.element().click(By.id("checkout-btn"));
        driver.element()
            .type(By.id("card-number"), "4111111111111111")
            .and().click(By.id("pay-btn"));
        driver.assertThat(By.id("confirmation")).text().contains("Order confirmed").perform();
    }

    @AfterClass
    public void teardown() {
        driver.quit();
    }
}
```

When `login` fails, TestNG automatically **skips** `addToCart` and `checkout`, giving you a clear signal that the root cause is in the login step.

---

## Why Not Use `priority`?

TestNG's `@Test(priority = N)` attribute controls execution order, but it has important pitfalls:

| `priority` | `dependsOnMethods` |
|---|---|
| Controls order but does **not** skip dependents on failure | Explicitly skips dependent tests when a prerequisite fails |
| All tests still run even if early ones fail | Failing early stops the chain — saves time and avoids noise |
| Implicit relationship — hard to understand at a glance | Explicit dependency — self-documenting |
| Fragile when tests are added or reordered | Robust — dependencies are declared by name |

:::danger
Using `priority` to order tests creates a hidden dependency. If a test with `priority=1` fails, the test with `priority=2` still runs — often producing confusing, cascading failures that waste debugging time.
:::

### What `priority` Is Good For

The `priority` attribute is appropriate **only** for controlling the order of truly independent tests — for example, running smoke tests before regression tests. It should never be used as a substitute for `dependsOnMethods`.

---

## When to Use Each Approach

| Approach | Use When |
|---|---|
| **Isolated test cases** | Testing a single feature, input validation, edge cases, API endpoints |
| **Dependent test scenarios** | End-to-end business flows where steps build on each other (e.g., login → add to cart → checkout) |

---

## Best Practices

1. **Default to isolated tests.** They are more reliable, parallelizable, and easier to debug.
2. **Use `dependsOnMethods` for multi-step scenarios** — never `priority`.
3. **Keep scenarios short** — 3 to 5 steps maximum. Longer scenarios are harder to debug.
4. **Use `@BeforeClass` / `@AfterClass` for scenario-level setup/teardown** and `@BeforeMethod` / `@AfterMethod` for isolated test setup/teardown.
5. **Name test methods clearly** so that `dependsOnMethods` references are self-explanatory.
