---
id: Async_Element_Actions
title: Async Element Actions
sidebar_label: Async Element Actions
description: "Run SHAFT element actions concurrently using Java virtual threads — improve test speed with non-blocking parallel interactions."
keywords: [SHAFT, async element actions, parallel element actions, virtual threads, concurrent selenium, non-blocking actions]
tags: [web, element, async, performance, java21]
---

## Overview

SHAFT supports non-blocking element actions via Java 21 virtual threads through `driver.async().element()`. Actions queued on the async executor run in parallel and return immediately, letting you kick off multiple interactions concurrently and synchronise at a chosen point.

This is useful when:
- Filling a long form where fields are independent and can be typed into simultaneously
- Triggering multiple UI actions that don't need to happen in strict sequence
- Reducing wall-clock test execution time without sacrificing accuracy

---

## Basic Usage

### Parallel Form Fill

```java title="AsyncFormFill.java"
// Queue multiple element actions — they start concurrently
driver.async().element()
      .type(By.id("firstName"), "Alice")
      .type(By.id("lastName"),  "Smith")
      .type(By.id("email"),     "alice@example.com")
      .select(By.id("country"), "United States")
      .synchronize(); // wait for all queued actions to finish
```

### Parallel Click and Screenshot

```java title="AsyncClickAndCapture.java"
driver.async().element()
      .click(By.id("submitBtn"))
      .captureScreenshot(By.id("confirmationMessage"))
      .join(); // alternative to synchronize()
```

:::note
`.synchronize()` and `.join()` are equivalent — use whichever reads more naturally in context.
:::

---

## Synchronisation Methods

After queuing async actions, call one of the following to block until all actions complete:

| Method | Description |
|:-------|:------------|
| `.synchronize()` | Waits for all queued async actions to complete |
| `.join()` | Alias for `.synchronize()` |
| `.sync()` | Alias for `.synchronize()` |

```java title="AsyncSynchronise.java"
driver.async().element()
      .type(By.id("fieldA"), "value1")
      .type(By.id("fieldB"), "value2")
      .type(By.id("fieldC"), "value3")
      .sync(); // equivalent to .synchronize() and .join()
```

---

## Complete Example: Registration Form

```java title="AsyncRegistrationTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class AsyncRegistrationTest {
    SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void registerUserWithAsyncActions() {
        driver.browser().navigateToURL("https://example.com/register");

        // Fill all fields in parallel using virtual threads
        driver.async().element()
              .type(By.id("firstName"), "Alice")
              .type(By.id("lastName"),  "Smith")
              .type(By.id("email"),     "alice@example.com")
              .type(By.id("phone"),     "+1-555-0100")
              .select(By.id("country"), "United States")
              .synchronize();

        // Proceed sequentially once the form is filled
        driver.element().click(By.id("submitBtn"));

        driver.assertThat().browser().url().contains("/success").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## When to Use Async vs. Synchronous Actions

| Scenario | Recommendation |
|:---------|:---------------|
| Independent form fields with no DOM side-effects | ✅ Use async |
| Fields where typing in one triggers a validation on another | ❌ Use standard sequential actions |
| Bulk data entry where order doesn't matter | ✅ Use async |
| Actions that depend on the result of a previous action | ❌ Use standard sequential actions |
| Capturing screenshots while another action runs | ✅ Use async |

:::tip
Async actions are best suited for **write** operations (type, select, click) that operate on independent elements. Avoid using them when one action's outcome affects the next element's state.
:::

---

## Additional Resources

- [Element Actions](./Element_Actions) — standard synchronous element API
- [SHAFT_ENGINE source — AsyncElementActions](https://github.com/ShaftHQ/SHAFT_ENGINE/tree/master/src/main/java/com/shaft/gui/element)
