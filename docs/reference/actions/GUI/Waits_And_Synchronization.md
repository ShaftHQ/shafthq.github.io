---
id: Waits_And_Synchronization
title: "Tips: Waits and Synchronization"
sidebar_label: Waits & Synchronization
description: "SHAFT Engine synchronization tips — explicit element and browser wait strategies, custom condition waits, and clipboard action sequencing."
keywords: [SHAFT, explicit waits, wait strategies, waitUntil, lazy loading, synchronization, clipboard actions, tips]
tags: [web, waits, synchronization, tips, element-actions]
---

Deeper synchronization tips beyond SHAFT's automatic implicit waits — condition-specific waiting and correctly-sequenced element actions.

## Explicit waits {/* #explicit-waits */}

SHAFT handles **implicit waits** automatically via `defaultElementIdentificationTimeout`, so most element interactions retry until the element is available. For **condition-specific synchronization**, `driver.element()` and `driver.browser()` expose a rich set of explicit wait methods:

```java title="ExplicitWaits.java"
// Element-level
driver.element().waitUntilElementTextToBe(By.id("status"), "Complete");
driver.element().waitUntilAttributeContains(By.id("progress"), "style", "width: 100%");
driver.element().waitUntilNumberOfElementsToBeMoreThan(By.cssSelector(".result"), 0);
driver.element().waitUntilElementToBeSelected(By.id("checkbox"));
driver.element().waitUntilPresenceOfAllElementsLocatedBy(By.cssSelector(".row"));

// Browser-level
driver.browser().waitUntilUrlContains("/dashboard");
driver.browser().waitUntilTitleContains("Dashboard");
driver.browser().waitForLazyLoading();
```

:::info
Configure the default custom UI condition wait via `SHAFT.Properties.timeouts.set().waitForUiStateTimeout(600)`. See [Programmatic Configuration](/docs/reference/properties/Programmatic_Config).
:::

### Custom condition waits (lambda)

`driver.element().waitUntil()` and `driver.browser().waitUntil()` accept any Selenium `ExpectedCondition<Boolean>` — including lambda expressions — for cases the named wait methods don't cover. Without an explicit `Duration`, it uses `waitForUiStateTimeout` (default 600 seconds):

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
Prefer `waitUntilNumberOfElementsToBeMoreThan(locator, 0)` over `waitUntilPresenceOfAllElementsLocatedBy` when you only need to confirm that **at least one** result has loaded. Prefer a named wait method over a lambda whenever one exists — it reads better.
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
