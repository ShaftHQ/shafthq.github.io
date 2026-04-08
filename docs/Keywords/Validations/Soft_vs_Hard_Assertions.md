---
id: Soft_vs_Hard_Assertions
title: Soft vs Hard Assertions
sidebar_label: Soft vs Hard Assertions
description: "Understand the difference between hard assertions (assertThat) and soft assertions (verifyThat) in SHAFT Engine — choose the right strategy for your tests."
keywords: [SHAFT, soft assertions, hard assertions, assertThat, verifyThat, test assertions, validation strategy]
tags: [validations, assertions, soft-assertions, hard-assertions]
---

SHAFT Engine provides two assertion modes: **hard assertions** that stop the test immediately on the first failure, and **soft assertions** that collect all failures and report them together at the end of the test. Choosing the right mode is key to writing effective, maintainable tests.

---

## Hard Assertions — assertThat()

`assertThat()` is a **hard assertion**. If the assertion condition is not met, test execution **stops immediately** and the test is marked as failed. Remaining steps are skipped.

Use hard assertions for **business-critical checkpoints** where proceeding with a broken state would produce meaningless results.

```java title="SoftVsHardAssertions.java"
// Hard assertion — test fails immediately on first failure
driver.assertThat().browser().title().contains("Dashboard").perform();
driver.assertThat(By.id("welcomeMsg")).text().contains("Welcome").perform();
```

---

## Soft Assertions — verifyThat()

`verifyThat()` is a **soft assertion**. If the condition is not met, the failure is **recorded but execution continues**. All accumulated failures are reported together at the end of the test.

Use soft assertions when you want to **validate multiple independent conditions** in a single test without early exit.

```java title="SoftVsHardAssertions.java"
// Soft assertion — collects failures, reports all at end of test
driver.verifyThat().element(By.id("name")).text().contains("John").perform();
driver.verifyThat().element(By.id("email")).text().contains("@").perform();
driver.verifyThat().element(By.id("role")).text().isEqualTo("Admin").perform();
// All three are verified; all failures reported together at test end
```

---

## Standalone Validations

Both modes are also available without a driver instance via `SHAFT.Validations`:

```java title="SoftVsHardAssertions.java"
import com.shaft.driver.SHAFT;

// Standalone hard assertion
SHAFT.Validations.assertThat().object("actual").isEqualTo("expected").perform();
SHAFT.Validations.assertThat().number(42).isGreaterThan(0).perform();

// Standalone soft assertions
SHAFT.Validations.verifyThat().object("actual").isEqualTo("expected").perform();
SHAFT.Validations.verifyThat().number(42).isGreaterThan(0).perform();
```

---

## Comparison

| Aspect | `assertThat()` (Hard) | `verifyThat()` (Soft) |
|---|---|---|
| On failure | Stops test immediately | Records failure, continues |
| Use case | Critical business checkpoints | Multiple independent validations |
| Report | Shows first failure only | Shows all failures together |
| Test speed | Faster on failure | Completes all steps before reporting |

---

## Complete Example

```java title="AssertionStrategyTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AssertionStrategyTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void validateUserProfile() {
        driver.browser().navigateToURL("https://example.com/profile");

        // Hard assertion: must be on the correct page before proceeding
        driver.assertThat().browser().url().contains("/profile").perform();

        // Soft assertions: validate all profile fields, collect all failures
        driver.verifyThat().element(By.id("fullName")).text().isNotEmpty().perform();
        driver.verifyThat().element(By.id("email")).text().contains("@").perform();
        driver.verifyThat().element(By.id("role")).text().isEqualTo("Admin").perform();
        driver.verifyThat().element(By.id("status")).text().isEqualTo("Active").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
A good pattern is to use **one hard assertion** to confirm the test precondition (e.g., correct page, user is logged in), then use **soft assertions** for all subsequent field validations.
:::

:::info
Soft assertion failures are accumulated per-test and reported at the end of the test method. In TestNG, SHAFT triggers a test failure after the `@AfterMethod` completes, so all soft failures for a test are visible in the Allure report.
:::
