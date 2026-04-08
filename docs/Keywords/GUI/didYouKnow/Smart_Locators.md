---
id: Smart_Locators
title: Smart Locators
sidebar_label: Smart Locators
description: "Locate form inputs and clickable elements by semantic meaning in SHAFT Engine — use inputField() and clickableField() for readable, user-centric locators."
keywords: [SHAFT, smart locators, inputField, clickableField, semantic locators, label-based locator, placeholder locator]
tags: [web, locator, smart-locators, accessibility]
---

SHAFT Engine provides **Smart Locators** that find elements by their **user-facing meaning** — labels, placeholders, button text — rather than technical attributes like IDs or CSS classes. This produces tests that are easier to read, more resilient to implementation changes, and naturally aligned with how users interact with the application.

---

## inputField(label)

`SHAFT.GUI.Locator.inputField(label)` finds an input element by its associated **label text**, **placeholder**, **name attribute**, or **aria-label**. It searches these attributes in order and returns the first match.

```java title="SmartLocators.java"
import com.shaft.driver.SHAFT;

// Locate by label text (e.g., <label>Email</label>)
By emailField = SHAFT.GUI.Locator.inputField("Email");

// Locate by placeholder (e.g., placeholder="Password")
By passwordField = SHAFT.GUI.Locator.inputField("Password");

// Locate by aria-label (e.g., aria-label="Search query")
By searchField = SHAFT.GUI.Locator.inputField("Search query");
```

---

## clickableField(text)

`SHAFT.GUI.Locator.clickableField(text)` finds a button or link by its **visible text**, **value attribute**, or **aria-label**. It covers `<button>`, `<input type="submit">`, `<a>`, and elements with `role="button"`.

```java title="SmartLocators.java"
// Locate by button text
By loginButton = SHAFT.GUI.Locator.clickableField("Log In");

// Locate by link text
By signUpLink = SHAFT.GUI.Locator.clickableField("Sign Up");

// Locate by aria-label (e.g., aria-label="Close dialog")
By closeButton = SHAFT.GUI.Locator.clickableField("Close dialog");
```

---

## Comparison with Traditional Locators

| Approach | Example | Resilience | Readability |
|---|---|---|---|
| ID locator | `By.id("btn-login-123")` | Low | Poor |
| CSS class | `By.cssSelector(".btn.btn-primary")` | Medium | Poor |
| XPath | `//button[@data-testid='login']` | Medium | Poor |
| Smart Locator | `clickableField("Log In")` | High | Excellent |

---

## Complete Example

```java title="SmartLocatorsTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class SmartLocatorsTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void loginWithSmartLocators() {
        By emailField = SHAFT.GUI.Locator.inputField("Email");
        By passwordField = SHAFT.GUI.Locator.inputField("Password");
        By loginButton = SHAFT.GUI.Locator.clickableField("Log In");
        By signUpLink = SHAFT.GUI.Locator.clickableField("Sign Up");

        driver.browser().navigateToURL("https://example.com/login");
        driver.element()
            .type(emailField, "user@example.com")
            .type(passwordField, "secret")
            .click(loginButton);

        driver.assertThat().browser().url().contains("/dashboard").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Smart Locators are ideal for forms where labels and button text closely match the requirements specification — this makes tests almost self-documenting and understandable by non-technical stakeholders.
:::

:::note
When multiple elements match the same label or text, Smart Locators will return the first match in DOM order. Use more specific locators (e.g., with a parent container) if disambiguation is needed.
:::
