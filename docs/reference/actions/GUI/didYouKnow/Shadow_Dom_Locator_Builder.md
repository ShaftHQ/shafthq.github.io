---
id: Shadow_Dom_Locator_Builder
title: Shadow DOM Locator Builder
sidebar_label: Shadow DOM Locator Builder
description: "Locate and interact with elements inside Shadow DOM using SHAFT Engine's Locator Builder — no JavaScript execution needed, supports nested shadow roots."
keywords: [SHAFT, Shadow DOM, locator builder, web components, shadow root, encapsulated DOM, custom elements]
tags: [web, shadow-dom, locator]
---

Modern web applications built with Web Components encapsulate their DOM inside **Shadow Roots**, which standard Selenium locators cannot pierce. SHAFT's Locator Builder handles Shadow DOM natively through the `.insideShadowDom()` modifier — no JavaScript execution required.

---

## Why Shadow DOM Is Tricky

Elements inside a shadow root are not reachable by regular `By.id()`, `By.cssSelector()`, or `By.xpath()` selectors because they live in a separate, encapsulated DOM tree. SHAFT's Locator Builder resolves this by building a locator that walks through the shadow host to reach the target element.

---

## Basic Syntax

```java title="ShadowDomBasic.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// 1. Locate the shadow host element (the custom element that owns the shadow root)
By shadowHost = SHAFT.GUI.Locator.hasTagName("my-component").build();

// 2. Build a locator that targets an element INSIDE that shadow root
By shadowElement = SHAFT.GUI.Locator
    .hasTagName("button")
    .hasText("Submit")
    .insideShadowDom(shadowHost)
    .build();

driver.element().click(shadowElement);
```

---

## Single-Level Shadow DOM

```java title="ShadowDomSingleLevel.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// Shadow host: <shop-app>
By shopApp = SHAFT.GUI.Locator.hasTagName("shop-app").build();

// Target: <a href="/list/mens_outerwear"> inside shop-app's shadow root
By mensOuterwearLink = SHAFT.GUI.Locator
    .hasTagName("a")
    .hasAttribute("href", "/list/mens_outerwear")
    .insideShadowDom(shopApp)
    .build();

driver.browser().navigateToURL("https://shop.polymer-project.org/");
driver.element().click(mensOuterwearLink);
```

---

## Nested Shadow DOM

When elements are nested inside multiple shadow roots, chain `.insideShadowDom()` calls from the outermost host inward:

```java title="ShadowDomNested.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// Level 1 — outer host
By outerHost = SHAFT.GUI.Locator.hasTagName("app-shell").build();

// Level 2 — inner host inside the outer shadow root
By innerHost = SHAFT.GUI.Locator
    .hasTagName("user-card")
    .insideShadowDom(outerHost)
    .build();

// Target element inside the inner shadow root
By editButton = SHAFT.GUI.Locator
    .hasTagName("button")
    .hasText("Edit Profile")
    .insideShadowDom(innerHost)
    .build();

driver.element().click(editButton);
```

---

## Interacting with Form Inputs in Shadow DOM

```java title="ShadowDomForm.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class ShadowDomFormTest {
    private SHAFT.GUI.WebDriver driver;

    @Test
    public void fillFormInsideShadowDom() {
        By checkoutForm = SHAFT.GUI.Locator.hasTagName("checkout-form").build();

        By emailInput = SHAFT.GUI.Locator
            .hasTagName("input")
            .hasAttribute("name", "email")
            .insideShadowDom(checkoutForm)
            .build();

        By submitButton = SHAFT.GUI.Locator
            .hasTagName("button")
            .hasText("Place Order")
            .insideShadowDom(checkoutForm)
            .build();

        driver.browser().navigateToURL("https://example.com/checkout");
        driver.element()
              .type(emailInput, "buyer@example.com")
              .and().element().click(submitButton);

        By successMsg = SHAFT.GUI.Locator
            .hasAnyTagName()
            .containsText("Order confirmed")
            .insideShadowDom(checkoutForm)
            .build();

        driver.assertThat(successMsg).isDisplayed().perform();
    }

    @BeforeMethod
    public void setup() { driver = new SHAFT.GUI.WebDriver(); }

    @AfterMethod
    public void teardown() { driver.quit(); }
}
```

---

## Combined Locator Conditions Inside Shadow DOM

All regular Locator Builder methods work inside `.insideShadowDom()`:

| Condition | Example |
|-----------|---------|
| Tag name | `hasTagName("input")` |
| Attribute exact match | `hasAttribute("type", "checkbox")` |
| Attribute presence | `hasAttribute("disabled")` |
| Text equals | `hasText("Save")` |
| Text contains | `containsText("Save changes")` |
| Class contains | `containsClass("primary-btn")` |
| ID contains | `containsId("submit")` |

```java title="ShadowDomCombined.java"
By submitBtn = SHAFT.GUI.Locator
    .hasTagName("button")
    .containsClass("btn-primary")
    .hasText("Submit")
    .insideShadowDom(SHAFT.GUI.Locator.hasTagName("my-form").build())
    .build();
```

---

:::tip
Use Chrome DevTools (Elements panel → expand `#shadow-root`) to inspect shadow root structure and identify host tag names before writing your locators.
:::

:::note
For more Shadow DOM examples see [ShadowDomTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java) on GitHub.
:::

---

## Related Locator Pages

- [SHAFT Locator Builder →](./Shaft_Locator_Builder)
- [Smart Locators →](./Smart_Locators)
- [ARIA Locators →](./ARIA_Locators)
