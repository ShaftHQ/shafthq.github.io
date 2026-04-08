---
id: iFrame_Handling
title: iFrame Handling
sidebar_label: iFrame Handling
description: "Interact with embedded iframes in SHAFT Engine — switch into iframes by locator and return to the main page with switchToDefaultContent."
keywords: [SHAFT, iframe, frame handling, switchToIframe, switchToDefaultContent, embedded content, payment form]
tags: [web, iframe, element-actions]
---

Many web applications embed content in `<iframe>` elements — including payment forms, maps, video players, and third-party widgets. SHAFT Engine provides first-class iframe support through `driver.element().switchToIframe()` and `driver.element().switchToDefaultContent()`.

---

## switchToIframe(By locator)

Switches the WebDriver context **into** the specified iframe. All subsequent element interactions will target elements inside that iframe.

```java title="iFrameHandling.java"
// Switch to an iframe by locator
driver.element().switchToIframe(By.id("payment-iframe"));
```

You can use any standard Selenium locator strategy to identify the iframe:

```java title="iFrameHandling.java"
driver.element().switchToIframe(By.cssSelector("iframe.payment-frame"));
driver.element().switchToIframe(By.xpath("//iframe[@title='Payment Form']"));
```

---

## switchToDefaultContent()

Returns the WebDriver context to the **main page** after working inside an iframe.

```java title="iFrameHandling.java"
driver.element().switchToDefaultContent();
```

---

## Complete Example: Payment Form

```java title="iFrameHandling.java"
// Switch to the payment iframe
driver.element().switchToIframe(By.id("payment-iframe"));

// Interact with elements inside the iframe
driver.element()
    .type(By.id("cardNumber"), "4111111111111111")
    .type(By.id("expiry"), "12/26")
    .type(By.id("cvv"), "123")
    .click(By.id("payBtn"));

// Switch back to the main page
driver.element().switchToDefaultContent();

// Continue interacting with main page elements
driver.assertThat(By.id("paymentStatus")).text().contains("Success").perform();
```

---

## Common Use Cases

| Scenario | iframe Locator Strategy |
|---|---|
| Payment forms (Stripe, Adyen) | `By.id("payment-iframe")` or `By.name("payment")` |
| Embedded Google Maps | `By.cssSelector("iframe[src*='maps.google.com']")` |
| YouTube / video players | `By.cssSelector("iframe[src*='youtube.com']")` |
| Rich text editors (TinyMCE) | `By.id("tinymce_iframe")` |
| Captcha widgets | `By.cssSelector("iframe[title='reCAPTCHA']")` |

---

## Full Test Example

```java title="iFrameTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class iFrameTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void processPaymentInIframe() {
        driver.browser().navigateToURL("https://example.com/checkout");

        // Interact with main page
        driver.element().click(By.id("proceedToPayment"));

        // Enter the payment iframe
        driver.element().switchToIframe(By.id("payment-iframe"));
        driver.element()
            .type(By.id("cardNumber"), "4111111111111111")
            .type(By.id("expiry"), "12/26")
            .type(By.id("cvv"), "123")
            .click(By.id("payBtn"));

        // Return to the main page
        driver.element().switchToDefaultContent();

        driver.assertThat(By.id("paymentStatus"))
            .text().contains("Success")
            .perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Always call `switchToDefaultContent()` after finishing work inside an iframe. Forgetting to switch back is a common cause of `NoSuchElementException` errors on main-page elements.
:::

:::note
Nested iframes (an iframe within an iframe) require switching into each frame in order. Call `switchToIframe()` once for each level of nesting.
:::
