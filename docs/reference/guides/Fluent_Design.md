---
id: Fluent_Design
title: "Fluent Design: Chaining Actions and Validations"
sidebar_label: Fluent Design
description: "Learn how to use SHAFT Engine's fluent API to chain actions and validations for readable, maintainable test code."
keywords: [SHAFT, fluent design, method chaining, fluent API, readable tests, test design, chaining actions]
tags: [best-practices, fluent-api, chaining, test-design]
---

SHAFT Engine provides a **fluent API** that lets you chain actions and validations in a single, readable statement. Instead of writing one action per line, you can express an entire test step as a flowing sentence.

---

## Why Fluent Design?

Traditional test code often looks like a sequence of disconnected commands:

```java title="TraditionalStyle.java"
driver.browser().navigateToURL("https://example.com/register");
driver.element().type(emailInput, "user@example.com");
driver.element().type(passwordInput, "securePass123");
driver.element().type(confirmPasswordInput, "securePass123");
driver.element().click(registerButton);
```

With SHAFT's fluent API, the same logic reads like a natural sentence:

```java title="FluentStyle.java"
driver.browser().navigateToURL("https://example.com/register")
    .and().element()
        .type(emailInput, "user@example.com")
        .and().type(passwordInput, "securePass123")
        .and().type(confirmPasswordInput, "securePass123")
        .and().click(registerButton);
```

---

## How It Works

Every SHAFT action method returns the same action object, allowing you to call the next method directly on the result. The `.and()` method is syntactic sugar that returns `this` — it exists purely for readability.

| Method | Returns | Purpose |
|---|---|---|
| `driver.element().click(locator)` | `Actions` | Perform click, continue chaining |
| `driver.element().type(locator, text)` | `Actions` | Type text, continue chaining |
| `.and()` | Same instance | Readability connector |
| `driver.browser().navigateToURL(url)` | `BrowserActions` | Navigate, continue chaining |

---

## Chaining Actions with Validations

The real power of fluent design is combining actions and validations in a single chain:

```java title="FluentActionsAndValidations.java"
driver.browser().navigateToURL("https://example.com/register")
    .and().element()
        .type(emailInput, validEmail)
        .and().type(passwordInput, validPassword)
        .and().type(confirmPasswordInput, validPassword)
        .and().click(registerButton)
    .and().assertThat(confirmationLabel)
        .text().contains("Registration successful")
        .withCustomReportMessage("Verify registration completed with correct data")
        .perform();
```

:::tip
The `.withCustomReportMessage()` method adds a descriptive label in the Allure report, making it easy to understand what each validation checks.
:::

---

## Switching Between Action Types

You can switch between browser actions, element actions, and validations within the same chain:

```java title="SwitchingActionTypes.java"
driver.browser().navigateToURL("https://example.com/login")
    .and().element()
        .type(usernameInput, "admin")
        .and().type(passwordInput, "password")
        .and().click(loginButton)
    .and().browser()
        .navigateToURL("https://example.com/dashboard")
    .and().assertThat(welcomeMessage)
        .text().contains("Welcome, admin")
        .perform();
```

---

## Best Practices

1. **Use `.and()` for readability** — It does nothing functionally, but it makes chains read like English.
2. **Keep chains focused** — One chain should represent one logical test step or user action.
3. **Add custom report messages** — Use `.withCustomReportMessage()` on validations so your Allure report tells a clear story.
4. **Indent for clarity** — Align chained calls to visually group related actions together.

:::info
Fluent design is not just syntactic sugar — it encourages you to think about tests as user stories, which leads to more maintainable test suites.
:::
