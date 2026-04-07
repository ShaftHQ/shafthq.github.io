---
id: Custom_Report_Messages
title: Custom Report Messages
sidebar_label: Custom Report Messages
description: "Add custom messages to Allure report steps and validations using SHAFT Engine's withCustomReportMessage() and SHAFT.Report API."
keywords: [SHAFT, custom report messages, allure, report API, validation messages, test reporting, SHAFT.Report]
tags: [reporting, allure, validations]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

SHAFT gives you two complementary ways to enrich your Allure report with human-readable context: **custom validation messages** (via `withCustomReportMessage()`) and the **SHAFT.Report programmatic API** (via `SHAFT.Report.log()`, `report()`, and `attach()`).

---

## Custom Messages on Validations

Every SHAFT validation chain supports an optional `withCustomReportMessage()` call that replaces the default auto-generated step name in the Allure report with a meaningful, business-readable description. This makes failing reports immediately understandable without digging into low-level logs.

### Syntax

Add `withCustomReportMessage()` anywhere in the validation chain, before the terminal `.perform()` call:

```java title="CustomMessageExample.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

driver.assertThat()
    .browser().title()
    .contains("Dashboard")
    .withCustomReportMessage("User should be redirected to the Dashboard after a successful login")
    .perform();
```

### Browser Validations

```java title="BrowserValidationMessages.java"
// Assert page title with a business context message
driver.assertThat()
    .browser().title()
    .isEqualTo("My App — Dashboard")
    .withCustomReportMessage("Dashboard page title must match the design spec")
    .perform();

// Assert URL after navigation
driver.assertThat()
    .browser().url()
    .contains("/dashboard")
    .withCustomReportMessage("URL must contain /dashboard after successful login")
    .perform();
```

### Element Validations

```java title="ElementValidationMessages.java"
import org.openqa.selenium.By;

// Assert account balance is displayed correctly
driver.assertThat()
    .element(By.id("account-balance")).text()
    .contains("$1,000")
    .withCustomReportMessage("Account balance should display correctly after the deposit")
    .perform();

// Assert a confirmation message is visible
driver.assertThat()
    .element(By.cssSelector(".alert-success")).attribute("class")
    .contains("alert-success")
    .withCustomReportMessage("Success alert must be shown after order submission")
    .perform();
```

### API Response Validations

```java title="ApiValidationMessages.java"
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://api.example.com");
api.get("/users/1").setTargetStatusCode(200).performRequest();

api.assertThatResponse()
    .extractedJsonValue("$.name")
    .isEqualTo("John Doe")
    .withCustomReportMessage("GET /users/1 must return the correct user name")
    .perform();
```

---

## SHAFT.Report Programmatic API

The `SHAFT.Report` class lets you insert custom steps, log messages, and file/image attachments directly into the Allure report timeline — independent of any validation or action chain.

### Log a Message

```java title="ReportLog.java"
import com.shaft.driver.SHAFT;

SHAFT.Report.log("Starting the checkout flow for a premium user");
```

Use `log()` to mark the beginning of logical groups of steps or to add narrative checkpoints that are visible in the Allure report.

### Report a Step

```java title="ReportStep.java"
import com.shaft.driver.SHAFT;

SHAFT.Report.report("Verified shopping cart contains exactly 3 items");
```

`report()` adds a discrete, named step entry to the Allure timeline — useful for documenting manual verifications or computed outcomes that don't go through a SHAFT action.

### Attach Content

Attachments appear as expandable entries in the Allure report and can hold any content type:

```java title="ReportAttach.java"
import com.shaft.driver.SHAFT;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

// Attach plain text (e.g., an API response body)
String responseBody = api.getResponse().body().asString();
SHAFT.Report.attach("text/plain", "API Response Body", responseBody);

// Attach a screenshot captured as bytes
byte[] screenshotBytes = driver.browser().captureScreenshotAsBytes();
InputStream screenshotStream = new ByteArrayInputStream(screenshotBytes);
SHAFT.Report.attach("image/png", "Checkout Page Screenshot", screenshotStream);

// Attach an HTML page snapshot
String htmlContent = driver.browser().getCurrentPageSource();
SHAFT.Report.attach("text/html", "Page Source", htmlContent);
```

---

## Combining Both Approaches

The most readable reports combine `withCustomReportMessage()` on validations with `SHAFT.Report.log()` markers around logical sections:

```java title="CombinedReportingExample.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

@Test
void checkoutFlow() {
    SHAFT.Report.log("Step 1 — Add item to cart");

    driver.browser().navigateToURL("https://shop.example.com/product/42");
    driver.element().click(By.id("add-to-cart-btn"));

    driver.assertThat()
        .element(By.id("cart-count")).text()
        .isEqualTo("1")
        .withCustomReportMessage("Cart badge must show 1 item after adding the product")
        .perform();

    SHAFT.Report.log("Step 2 — Proceed to checkout");

    driver.element().click(By.id("checkout-btn"));

    driver.assertThat()
        .browser().url()
        .contains("/checkout")
        .withCustomReportMessage("Browser must navigate to the checkout page")
        .perform();

    SHAFT.Report.report("Checkout flow completed successfully");
}
```

---

## Best Practices

- **Write messages from a business perspective** — describe *what* should be true, not *how* the assertion works.
- **Keep messages concise** — one sentence is ideal; the Allure UI truncates long strings.
- **Use `log()` as section headers** — call it at the start of each logical step group to create a readable narrative.
- **Attach evidence on failures** — capture page source or API responses before a known fragile assertion to provide instant context.
- **Avoid duplicating the assertion value** — SHAFT already shows the expected vs. actual values; the message should explain the business rule.

---

## Related Pages

- [Reporting](./reporting.mdx) — Configure Allure, video recording, and execution summary reports.
- [Validations Overview](../Keywords/Validations/Overview.md) — Full reference for all SHAFT validation types.
