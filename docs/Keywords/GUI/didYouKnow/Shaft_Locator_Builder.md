---
id: Shaft_Locator_Builder
title: SHAFT Locator Builder
sidebar_label: SHAFT Locator Builder
description: "Build element locators fluently with SHAFT's Locator Builder — combine tag, attribute, text, class, and image conditions for readable, maintainable locators without writing XPath or CSS selectors."
keywords: [SHAFT, locator builder, fluent locator, element identification, CSS selector alternative, XPath alternative, by locator java]
tags: [web, locator, fluent-api]
---

`SHAFT.GUI.Locator` lets you describe elements in plain English instead of writing XPath expressions or CSS selectors. The builder composes a standard Selenium `By` locator under the hood, so it works everywhere a `By` is accepted.

## Basic Syntax

```java title="LocatorSyntax.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// Start with a tag name or use any tag
By button  = SHAFT.GUI.Locator.hasTagName("button").build();
By anyElem = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("data-testid").build();
```

Always call `.build()` at the end to produce the `By` locator.

---

## Available Builder Methods

| Method | Description | Example |
|--------|-------------|---------|
| `hasTagName(tag)` | Matches elements with this HTML tag | `hasTagName("button")` |
| `hasAnyTagName()` | Matches any HTML tag | `hasAnyTagName()` |
| `hasAttribute(name)` | Element has an attribute (any value) | `.hasAttribute("disabled")` |
| `hasAttribute(name, value)` | Element has attribute with exact value | `.hasAttribute("type", "submit")` |
| `hasText(text)` | Element's visible text equals the string | `.hasText("Login")` |
| `containsText(text)` | Element's visible text contains the string | `.containsText("Add to cart")` |
| `containsId(id)` | Element's `id` attribute contains the string | `.containsId("submit")` |
| `containsClass(cls)` | Element's `class` attribute contains the string | `.containsClass("btn-primary")` |
| `hasImage(imagePath)` | Locate element visually using a reference screenshot | `.hasImage("ref/login-btn.png")` |

---

## Examples

### By Tag and Attribute Value

```java title="LoginButtonLocator.java"
// Locate: <button data-test="add-to-cart-sauce-labs-backpack">
By addToCart = SHAFT.GUI.Locator
    .hasTagName("button")
    .hasAttribute("data-test", "add-to-cart-sauce-labs-backpack")
    .build();

driver.element().click(addToCart);
```

### By Tag and Text Content

```java title="NavLinkLocator.java"
// Locate: <a>My Account</a>
By myAccountLink = SHAFT.GUI.Locator
    .hasTagName("a")
    .hasText("My Account")
    .build();

driver.element().click(myAccountLink);
```

### By Any Tag Containing Text

```java title="AlertMessageLocator.java"
// Locate any element that shows a success banner
By successBanner = SHAFT.GUI.Locator
    .hasAnyTagName()
    .containsText("Order placed successfully")
    .build();

driver.assertThat(successBanner).isDisplayed().perform();
```

### By Class and Tag

```java title="PrimaryButtonLocator.java"
// Locate: <button class="btn btn-primary">Submit</button>
By submitBtn = SHAFT.GUI.Locator
    .hasTagName("button")
    .containsClass("btn-primary")
    .hasText("Submit")
    .build();

driver.element().click(submitBtn);
```

### Chain Multiple Conditions

Conditions are ANDed together — all must match:

```java title="ChainedConditions.java"
// <input type="email" id="user-email-field" placeholder="Enter email">
By emailInput = SHAFT.GUI.Locator
    .hasTagName("input")
    .hasAttribute("type", "email")
    .containsId("email")
    .build();

driver.element().type(emailInput, "alice@example.com");
```

### Visual Locator — hasImage()

Locate an element by matching its visual appearance against a reference screenshot. Useful when no reliable DOM attribute is available.

```java title="ImageLocator.java"
// Reference image stored in src/test/resources/dynamicObjectRepository/
By checkoutBtn = SHAFT.GUI.Locator
    .hasAnyTagName()
    .hasImage("dynamicObjectRepository/checkout-button.png")
    .build();

driver.element().click(checkoutBtn);
```

:::tip[Where to store reference images]
Save reference screenshots in `src/test/resources/dynamicObjectRepository/`. SHAFT uses OpenCV to match them at runtime — no extra configuration required.
:::

---

## Complete Page Object Example

```java title="src/test/java/pages/ShoppingCartPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class ShoppingCartPage {
    private final SHAFT.GUI.WebDriver driver;

    // Locators built with SHAFT.GUI.Locator
    private final By addToCartBackpack = SHAFT.GUI.Locator
        .hasTagName("button")
        .hasAttribute("data-test", "add-to-cart-sauce-labs-backpack")
        .build();

    private final By cartBadge = SHAFT.GUI.Locator
        .hasTagName("span")
        .containsClass("shopping_cart_badge")
        .build();

    private final By checkoutButton = SHAFT.GUI.Locator
        .hasTagName("button")
        .containsId("checkout")
        .build();

    public ShoppingCartPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public ShoppingCartPage addBackpackToCart() {
        driver.element().click(addToCartBackpack);
        return this;
    }

    public ShoppingCartPage verifyCartCount(String expected) {
        driver.assertThat(cartBadge).text().isEqualTo(expected).perform();
        return this;
    }

    public void proceedToCheckout() {
        driver.element().click(checkoutButton);
    }
}
```

---

## When to Use SHAFT.GUI.Locator vs XPath / CSS

| Use case | Recommendation |
|----------|----------------|
| Element has a `data-*` test attribute | ✅ `hasAttribute("data-test", "...")` |
| Locating by visible button text | ✅ `hasTagName("button").hasText("...")` |
| Complex ancestor/sibling navigation | 🔶 XPath may be clearer |
| Visual match when no DOM attribute exists | ✅ `hasImage("ref.png")` |
| Standard `id` or `class` selectors | Both work equally well |

For more locator strategies see:
- [Shadow DOM Locators →](./Shadow_Dom_Locator_Builder)
- [Smart Locators →](./Smart_Locators)
- [ARIA Locators →](./ARIA_Locators)
- [Self-Healing Locators →](./Self_Healing_Locators)
- [LocatorBuilderTest examples on GitHub →](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java)

