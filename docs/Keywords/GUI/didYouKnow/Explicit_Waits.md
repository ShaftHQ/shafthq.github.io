---
id: Explicit_Waits
title: Explicit Wait Strategies
sidebar_label: Explicit Waits
description: "Control wait behaviour in SHAFT Engine — use explicit element and browser waits for dynamic content, lazy loading, and condition-based synchronization."
keywords: [SHAFT, explicit waits, wait strategies, waitUntil, lazy loading, element visibility, synchronization]
tags: [web, waits, synchronization, element-actions]
---

SHAFT Engine handles **implicit waits** automatically using the `defaultElementIdentificationTimeout` property, so most element interactions will retry until the element is available. For scenarios requiring **condition-specific synchronization**, SHAFT exposes a rich set of explicit wait methods on both `driver.element()` and `driver.browser()`.

:::info
Configure the default element identification timeout via `SHAFT.Properties.timeouts.set().defaultElementIdentificationTimeout(30)`. See [Programmatic Configuration](../../../Properties/Programmatic_Config) for details.
:::

---

## Element-Level Waits

### waitUntilElementTextToBe

Waits until the text content of an element equals the specified value exactly.

```java title="ExplicitWaits.java"
driver.element().waitUntilElementTextToBe(By.id("status"), "Complete");
```

### waitUntilAttributeContains

Waits until an element's attribute contains the specified substring.

```java title="ExplicitWaits.java"
driver.element().waitUntilAttributeContains(By.id("progress"), "style", "width: 100%");
```

### waitUntilNumberOfElementsToBe / MoreThan / LessThan

Waits until the count of elements matching a locator reaches a specific condition.

```java title="ExplicitWaits.java"
// Exact count
driver.element().waitUntilNumberOfElementsToBe(By.cssSelector(".item"), 5);

// More than N
driver.element().waitUntilNumberOfElementsToBeMoreThan(By.cssSelector(".result"), 0);

// Less than N
driver.element().waitUntilNumberOfElementsToBeLessThan(By.cssSelector(".loading"), 1);
```

### waitUntilElementToBeSelected

Waits until a checkbox or radio button is in the selected state.

```java title="ExplicitWaits.java"
driver.element().waitUntilElementToBeSelected(By.id("checkbox"));
```

### waitUntilPresenceOfAllElementsLocatedBy

Waits until all elements matching the locator are present in the DOM.

```java title="ExplicitWaits.java"
driver.element().waitUntilPresenceOfAllElementsLocatedBy(By.cssSelector(".row"));
```

---

## Browser-Level Waits

### waitUntilUrlContains

Waits until the current browser URL contains the specified substring.

```java title="ExplicitWaits.java"
driver.browser().waitUntilUrlContains("/dashboard");
```

### waitUntilTitleContains

Waits until the browser title contains the specified substring.

```java title="ExplicitWaits.java"
driver.browser().waitUntilTitleContains("Dashboard");
```

### waitForLazyLoading

Waits for the page's lazy-loaded content to finish loading (detects scroll-triggered content).

```java title="ExplicitWaits.java"
driver.browser().waitForLazyLoading();
```

---

## Complete Example

```java title="ExplicitWaitsTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ExplicitWaitsTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void waitForAsyncOperation() {
        driver.browser().navigateToURL("https://example.com/process");
        driver.element().click(By.id("startBtn"));

        // Wait for async processing to complete
        driver.element().waitUntilElementTextToBe(By.id("statusLabel"), "Complete");
        driver.element().waitUntilNumberOfElementsToBe(By.cssSelector(".result-item"), 3);

        driver.assertThat(By.id("summary")).text().contains("3 items processed").perform();
    }

    @Test
    public void waitForNavigation() {
        driver.browser().navigateToURL("https://example.com");
        driver.element().click(By.id("goToDashboard"));
        driver.browser().waitUntilUrlContains("/dashboard");
        driver.browser().waitUntilTitleContains("Dashboard");
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## Custom Condition Wait (Lambda)

`driver.element().waitUntil()` accepts any Selenium `ExpectedCondition<Boolean>` — including lambda expressions — for cases not covered by the named wait methods above.

```java title="CustomConditionWait.java"
import org.openqa.selenium.support.ui.ExpectedConditions;

// Wait until a specific element has a non-empty text value
driver.element().waitUntil(
    webDriver -> {
        String text = webDriver.findElement(By.id("priceLabel")).getText();
        return text != null && !text.isEmpty();
    }
);

// Wait using a built-in ExpectedCondition
driver.element().waitUntil(
    ExpectedConditions.invisibilityOfElementLocated(By.id("spinner"))
);

// Wait until the page title starts with a specific prefix
driver.browser().waitUntil(
    webDriver -> webDriver.getTitle().startsWith("Order Confirmed")
);
```

### When to Use Custom Conditions

| Scenario | Recommended |
|---|---|
| Text/attribute not empty | `waitUntil()` with lambda |
| Spinner disappears | `waitUntil(ExpectedConditions.invisibilityOf...)` |
| JS flag becomes true | `waitUntil()` with `(JavascriptExecutor)` cast |
| Named method exists | Use named method — it's more readable |

```java title="JavaScriptConditionWait.java"
import org.openqa.selenium.JavascriptExecutor;

// Wait until a JavaScript variable is set to true
driver.element().waitUntil(
    webDriver -> (Boolean) ((JavascriptExecutor) webDriver)
        .executeScript("return window.appReady === true;")
);
```

---

:::tip
Prefer `waitUntilNumberOfElementsToBeMoreThan(locator, 0)` over `waitUntilPresenceOfAllElementsLocatedBy` when you only need to confirm that **at least one** result has loaded.
:::

:::warning
Avoid combining excessive explicit waits with a high implicit timeout — this multiplies the worst-case wait time and slows down failure detection. Set the implicit timeout conservatively and rely on explicit waits for specific conditions.
:::
