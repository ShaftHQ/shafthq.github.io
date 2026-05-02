---
id: Element_Validations
title: Element Validations
sidebar_label: Element Validations
description: "Validate element text, attributes, existence, visibility, state, and visual appearance using SHAFT Engine's fluent validation API."
keywords: [SHAFT, element validations, text validation, attribute validation, visibility, checkbox, assertThat, verifyThat]
tags: [web, element, validations]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## assertThat vs verifyThat

| | `assertThat` (Hard) | `verifyThat` (Soft) |
|---|---|---|
| Failure behaviour | Stops the test immediately | Continues; collects all failures |
| Use for | Business-critical checkpoints | Multiple validations in one test |

:::tip
Always call `.perform()` at the end of every validation chain — without it the validation will not execute.
:::

---

## Text Validations

### text().isEqualTo()

```java title="TextEquals.java"
driver.assertThat(locator).text().isEqualTo("Add to cart").perform();
driver.verifyThat(locator).text().isEqualTo("Add to cart").perform();
```

### text().contains()

```java title="TextContains.java"
driver.assertThat(locator).text().contains("Welcome").perform();
```

### text().equalsIgnoringCaseSensitivity()

```java title="TextEqualsIgnoreCase.java"
driver.assertThat(locator).text().equalsIgnoringCaseSensitivity("SHAFT ENGINE").perform();
```

### textTrimmed()

Validates text after stripping leading and trailing whitespace:

```java title="TextTrimmed.java"
driver.assertThat(locator).textTrimmed().isEqualTo("Hello World").perform();
```

---

## Existence & Visibility

### exists() / doesNotExist()

```java title="Existence.java"
driver.assertThat(locator).exists().perform();
driver.assertThat(locator).doesNotExist().perform();
```

### isVisible() / isHidden()

```java title="Visibility.java"
driver.assertThat(locator).isVisible().perform();
driver.assertThat(locator).isHidden().perform();
```

---

## Element State

### isEnabled() / isDisabled()

```java title="EnabledDisabled.java"
driver.assertThat(locator).isEnabled().perform();
driver.assertThat(locator).isDisabled().perform();
```

### isSelected() / isNotSelected()

```java title="SelectedNotSelected.java"
driver.assertThat(locator).isSelected().perform();
driver.assertThat(locator).isNotSelected().perform();
```

### isChecked() / isNotChecked()

```java title="CheckedNotChecked.java"
driver.assertThat(locator).isChecked().perform();
driver.assertThat(locator).isNotChecked().perform();
```

---

## Attribute & CSS Validations

### attribute()

```java title="Attribute.java"
driver.assertThat(locator).attribute("class").contains("active").perform();
driver.assertThat(locator).attribute("href").isEqualTo("https://example.com").perform();
driver.assertThat(locator).attribute("aria-label").contains("Submit").perform();
```

### cssProperty()

```java title="CssProperty.java"
driver.assertThat(locator).cssProperty("color").contains("rgb(0, 128, 0)").perform();
driver.assertThat(locator).cssProperty("display").isEqualTo("none").perform();
```

---

## Visual Validation

### matchesReferenceImage()

On the first run, SHAFT saves a baseline screenshot. On subsequent runs it compares against the baseline.

```java title="VisualValidation.java"
driver.assertThat(locator).matchesReferenceImage().perform();
driver.assertThat(locator).doesNotMatchReferenceImage().perform();
```

Baseline images are saved in `src/test/resources/DynamicObjectRepository/`. See [Visual Testing →](./didYouKnow/Visual_Testing) for engine options.

---

## Custom Report Messages

Add a business-readable message to any validation:

```java title="CustomMessage.java"
driver.assertThat(By.id("cart-badge"))
      .text().isEqualTo("3")
      .withCustomReportMessage("Cart should contain exactly 3 items after adding the product")
      .perform();
```

---

## Complete Example

```java title="src/test/java/tests/CheckoutValidationTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class CheckoutValidationTest {
    private SHAFT.GUI.WebDriver driver;

    private final By addToCartBtn  = By.cssSelector("[data-test='add-to-cart']");
    private final By cartBadge     = By.className("shopping_cart_badge");
    private final By checkoutBtn   = By.id("checkout");
    private final By orderSummary  = By.id("order-summary");
    private final By placeOrderBtn = By.id("place-order");

    @Test
    public void checkoutFlow() {
        driver.browser().navigateToURL("https://example.com/products");

        // Add item and check badge
        driver.element().click(addToCartBtn);
        driver.assertThat(cartBadge)
              .text().isEqualTo("1")
              .withCustomReportMessage("Cart badge must show 1 after adding an item")
              .perform();

        // Proceed to checkout
        driver.element().click(checkoutBtn);
        driver.assertThat().browser().url().contains("/checkout").perform();

        // Verify order summary is displayed
        driver.assertThat(orderSummary)
              .isVisible()
              .withCustomReportMessage("Order summary must be visible on checkout page")
              .perform();

        // Verify place order button is enabled
        driver.assertThat(placeOrderBtn)
              .isEnabled()
              .withCustomReportMessage("Place Order button must be enabled")
              .perform();
    }

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## See Also

- [Validations Overview →](../Validations/Overview) — All validation targets and usage patterns
- [Element Actions →](./Element_Actions) — Available interactions before validating
- [Custom Report Messages →](../../Reporting/Custom_Report_Messages) — Enrich Allure reports with business context
