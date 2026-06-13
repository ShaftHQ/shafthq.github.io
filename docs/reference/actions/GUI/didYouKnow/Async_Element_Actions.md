---
id: Async_Element_Actions
title: Async Element Actions with Virtual Threads
sidebar_label: Async Element Actions
description: "Speed up tests with non-blocking element actions in SHAFT Engine using Java virtual threads."
keywords: [SHAFT, async actions, virtual threads, parallel element actions, Java 25, non-blocking, concurrency]
tags: [web, async, virtual-threads, performance]
---

SHAFT Engine exposes an async API via `driver.async().element()` that leverages
virtual threads on the Java 25 baseline to perform element actions concurrently
without blocking the main test thread.

:::info
Async element actions require the repository's **Java 25** baseline. Ensure
your project targets `--release 25` in its compiler configuration.
:::

---

## When to Use Async Actions

Use async actions when:

- You need to fill in multiple form fields that are all already visible on screen.
- You want to run parallel interactions that do not depend on each other's results.
- You are optimising test execution time in long form-filling or data-entry scenarios.

:::warning
Do **not** use async actions for sequential interactions where the result of one action must precede the next (for example, typing in a field that only appears after clicking a button).
:::

---

## Available Actions

The `driver.async().element()` fluent API supports the same actions as the synchronous `driver.element()` API, including:

- `type(By locator, String text)`
- `click(By locator)`
- `select(By locator, String option)`
- `captureScreenshot(By locator)`

---

## Synchronizing Async Actions

After scheduling async actions you **must** call one of the synchronization methods to wait for completion before proceeding:

| Method | Description |
|---|---|
| `synchronize()` | Waits for all scheduled async actions to finish |
| `join()` | Alias for `synchronize()` |
| `sync()` | Alias for `synchronize()` |

---

## Examples

### Parallel Form Fill

```java title="AsyncActions.java"
// Perform multiple actions in parallel using virtual threads
driver.async().element()
    .type(By.id("firstName"), "John")
    .type(By.id("lastName"), "Doe")
    .type(By.id("email"), "john.doe@example.com")
    .select(By.id("country"), "United States")
    .synchronize(); // Wait for all async actions to complete
```

### Click and Screenshot

```java title="AsyncActions.java"
// Alternative sync methods: .join() or .sync()
driver.async().element()
    .click(By.id("submitBtn"))
    .captureScreenshot(By.id("confirmationMessage"))
    .join();
```

### Complete Test Example

```java title="AsyncFormTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AsyncFormTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void fillRegistrationFormAsync() {
        driver.browser().navigateToURL("https://example.com/register");

        // Fill all visible fields concurrently
        driver.async().element()
            .type(By.id("firstName"), "John")
            .type(By.id("lastName"), "Doe")
            .type(By.id("email"), "john.doe@example.com")
            .type(By.id("phone"), "+1234567890")
            .select(By.id("country"), "United States")
            .synchronize();

        // Continue with sequential actions
        driver.element().click(By.id("submitBtn"));
        driver.assertThat(By.id("successMsg")).text().contains("Registration complete").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Pair async element actions with SHAFT's fluent assertion API after synchronization to keep your tests both fast and readable.
:::
