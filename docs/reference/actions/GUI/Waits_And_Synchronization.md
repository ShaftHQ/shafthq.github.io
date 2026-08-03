---
id: Waits_And_Synchronization
title: "Tips: Waits and Synchronization"
sidebar_label: Waits & Synchronization
description: "SHAFT Engine synchronization tips — explicit element and browser wait strategies, custom condition waits, and clipboard action sequencing."
keywords: [SHAFT, explicit waits, wait strategies, waitUntil, lazy loading, synchronization, clipboard actions, tips]
tags: [web, waits, synchronization, tips, element-actions]
---

Use these patterns when an application state needs more than SHAFT's automatic element waits.

## Explicit waits {/* #explicit-waits */}

SHAFT retries normal element lookups with `defaultElementIdentificationTimeout`. For a specific condition, use the generic `driver.element().waitUntil(...)`. Browser sessions also expose `waitForLazyLoading()` for page content that arrives after the initial load:

```java title="ExplicitWaits.java"
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

driver.element().waitUntil(ExpectedConditions.textToBePresentInElementLocated(
    By.id("status"), "Complete"));
driver.element().waitUntil(ExpectedConditions.attributeContains(
    By.id("progress"), "style", "width: 100%"));
driver.element().waitUntil(ExpectedConditions.numberOfElementsToBeMoreThan(
    By.cssSelector(".result"), 0));
driver.element().waitUntil(ExpectedConditions.elementToBeSelected(By.id("checkbox")));
driver.element().waitUntil(ExpectedConditions.presenceOfAllElementsLocatedBy(
    By.cssSelector(".row")));

driver.browser().waitForLazyLoading();
```

:::info
Configure the default custom UI condition wait via `SHAFT.Properties.timeouts.set().waitForUiStateTimeout(600)`. See [Programmatic Configuration](/docs/reference/properties/Programmatic_Config).
:::

### Custom condition waits (lambda)

`driver.element().waitUntil()` accepts a Selenium condition or lambda. Without an explicit `Duration`, it uses `waitForUiStateTimeout` (default 600 seconds):

```java title="CustomConditionWait.java"
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.JavascriptExecutor;

// Lambda: wait until a specific element has a non-empty text value
driver.element().waitUntil(webDriver -> {
    String text = webDriver.findElement(By.id("priceLabel")).getText();
    return text != null && !text.isEmpty();
});

// Built-in ExpectedCondition
driver.element().waitUntil(ExpectedConditions.invisibilityOfElementLocated(By.id("spinner")));

// Wait until a JavaScript variable is set to true
driver.element().waitUntil(webDriver -> (Boolean) ((JavascriptExecutor) webDriver)
    .executeScript("return window.appReady === true;"));
```

:::tip
Prefer a built-in `ExpectedConditions` predicate when one expresses the state clearly. Use a lambda when the condition depends on application-specific state.
:::

:::warning
Avoid combining excessive explicit waits with a high implicit timeout — this multiplies the worst-case wait time and slows down failure detection. Set the implicit timeout conservatively and rely on explicit waits for specific conditions.
:::

## Clipboard actions {/* #clipboard-actions */}

`driver.element().clipboardActions(locator, ClipboardAction)` performs copy/cut/paste/select-all operations on an element via the `ClipboardAction` enum (`COPY`, `CUT`, `PASTE`, `SELECT_ALL`) — no raw keyboard shortcuts required. Getting the order right matters: some browsers require the field to be focused and its content selected *before* a `CUT`/`COPY` will capture the right data, so treat clipboard actions as a small synchronization sequence rather than a single call.

```java title="ClipboardActions.java"
import com.shaft.enums.internal.ClipboardAction;

// Copy from a read-only source field, then paste into the target
driver.element()
    .clipboardActions(By.id("generatedToken"), ClipboardAction.COPY)
    .clipboardActions(By.id("tokenInput"), ClipboardAction.PASTE);

// Select all existing content before cutting/overwriting a field
driver.element()
    .clipboardActions(By.id("commentBox"), ClipboardAction.SELECT_ALL)
    .clipboardActions(By.id("commentBox"), ClipboardAction.CUT);
```

:::tip
`clipboardActions()` returns the element actions builder, so operations chain fluently. Prefer it over `typeAppend()` for copy-from-read-only scenarios. Clipboard operations use the OS-level clipboard — running parallel tests on the same machine can race; prefer isolated environments (Docker/Grid) for clipboard-intensive parallel tests.
:::

## Related

- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Async Element Actions](/docs/reference/actions/GUI/Async_Element_Actions)
- [Flakiness](/docs/testing/flakiness)
- [Web](/docs/testing/web)
