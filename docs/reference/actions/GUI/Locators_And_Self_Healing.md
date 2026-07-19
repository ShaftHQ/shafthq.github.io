---
id: Locators_And_Self_Healing
title: "Tips: Locators and Self-Healing"
sidebar_label: Locators & Self-Healing
description: "SHAFT Engine locator tips — ARIA role-based locators, self-healing locators (SHAFT Heal and legacy Healenium), Shadow DOM, the SHAFT Locator Builder, Smart Locators, and iframe handling."
keywords: [SHAFT, ARIA locators, self-healing locators, SHAFT Heal, Healenium, Shadow DOM, locator builder, smart locators, inputField, clickableField, iframe, tips]
tags: [web, locator, tips, self-healing, shadow-dom, aria, iframe]
---

Deeper locator tips beyond the [Element Identification](/docs/reference/actions/GUI/Element_Identification) reference — resilient locator strategies and recovery from broken locators.

## ARIA role-based locators {/* #aria-locators */}

`SHAFT.GUI.Locator.hasRole()` finds elements by their semantic ARIA role rather than fragile IDs or CSS classes, using the `Role` enum (`BUTTON`, `SEARCHBOX`, `NAVIGATION`, `DIALOG`, `ALERT`, `CHECKBOX`, `LINK`, `LISTBOX`, `TEXTBOX`, and more):

```java title="ARIALocators.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.Role;

By submitButton = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasText("Submit").build();
By searchInput = SHAFT.GUI.Locator.hasRole(Role.SEARCHBOX).build();
By errorAlert = SHAFT.GUI.Locator.hasRole(Role.ALERT).containsText("error").build();

driver.element().click(submitButton);
driver.element().type(searchInput, "test query");
```

:::tip
Pair ARIA locators with [Smart Locators](#smart-locators) for the most readable and maintainable locator strategy.
:::

## Self-healing locators {/* #self-healing-locators */}

For current SHAFT projects, start with [SHAFT Heal](/docs/agentic/heal): add `shaft-heal` and opt in with `healing.strategy=shaft-heal`. It is deterministic, explainable, disabled by default, and writes reviewable locator recovery reports.

Legacy **Healenium** integration remains opt-in through `healing.strategy=healenium` (or the legacy `heal-enabled=true` flag) for projects that already run a Healenium backend server:

```java title="SelfHealingLocators.java"
import com.shaft.driver.SHAFT;

SHAFT.Properties.healenium.set()
    .healEnabled(true)
    .recoveryTries(3)
    .scoreCap("0.7")
    .serverHost("localhost")
    .serverPort(7878);
```

Once enabled, no test-code changes are needed — locators automatically self-heal when the DOM changes. A healing report is generated so you can update your locators proactively; self-healing is a safety net, not a substitute for maintaining accurate locators.

## Shadow DOM locator builder {/* #shadow-dom-locator-builder */}

Elements inside a Shadow Root are not reachable by regular `By.id()`, `By.cssSelector()`, or `By.xpath()` because they live in an encapsulated DOM tree. SHAFT's Locator Builder resolves this with `.insideShadowDom()` — no JavaScript execution required:

```java title="ShadowDomBasic.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// 1. Locate the shadow host (the custom element that owns the shadow root)
By shadowHost = SHAFT.GUI.Locator.hasTagName("my-component").build();

// 2. Build a locator that targets an element INSIDE that shadow root
By shadowElement = SHAFT.GUI.Locator
    .hasTagName("button")
    .hasText("Submit")
    .insideShadowDom(shadowHost)
    .build();

driver.element().click(shadowElement);
```

For nested shadow roots, chain `.insideShadowDom()` calls from the outermost host inward:

```java title="ShadowDomNested.java"
By outerHost = SHAFT.GUI.Locator.hasTagName("app-shell").build();

By innerHost = SHAFT.GUI.Locator.hasTagName("user-card")
    .insideShadowDom(outerHost)
    .build();

By editButton = SHAFT.GUI.Locator.hasTagName("button")
    .hasText("Edit Profile")
    .insideShadowDom(innerHost)
    .build();
```

All regular Locator Builder methods (`hasAttribute()`, `hasText()`, `containsText()`, `containsClass()`, `containsId()`, and more) work the same way inside `.insideShadowDom()`.

:::tip
Use Chrome DevTools (Elements panel → expand `#shadow-root`) to inspect shadow root structure and identify host tag names before writing your locators.
:::

## SHAFT Locator Builder {/* #shaft-locator-builder */}

`SHAFT.GUI.Locator` describes elements in plain English instead of raw XPath or CSS. The builder composes a standard Selenium `By` locator under the hood, so it works everywhere a `By` is accepted. Call `.build()` at the end.

| Method | Description | Example |
|--------|-------------|---------|
| `hasTagName(tag)` | Matches elements with this HTML tag | `hasTagName("button")` |
| `hasAnyTagName()` | Matches any HTML tag | `hasAnyTagName()` |
| `hasAttribute(name[, value])` | Attribute present, optionally with an exact value | `.hasAttribute("type", "submit")` |
| `hasText(text)` / `containsText(text)` | Visible text equals / contains the string | `.hasText("Login")` |
| `containsId(id)` / `containsClass(cls)` | `id` / `class` attribute contains the string | `.containsClass("btn-primary")` |
| `hasImage(imagePath)` | Locate visually using a reference screenshot | `.hasImage("ref/login-btn.png")` |
| `byAxis()` | Fluent XPath axis navigation — `parent()`, `ancestor(tag)`, `child(tag)`, `followingSibling(tag)`, `precedingSibling(tag)` | `.byAxis().followingSibling("input")` |

Conditions are ANDed together — all must match:

```java title="ChainedConditions.java"
// <button class="btn btn-primary" data-test="checkout">Submit</button>
By submitBtn = SHAFT.GUI.Locator
    .hasTagName("button")
    .containsClass("btn-primary")
    .hasAttribute("data-test", "checkout")
    .hasText("Submit")
    .build();

driver.element().click(submitBtn);
```

Visual locators match against a reference screenshot when no reliable DOM attribute exists, using OpenCV — save reference images under `src/test/resources/dynamicObjectRepository/`:

```java title="ImageLocator.java"
By checkoutBtn = SHAFT.GUI.Locator
    .hasAnyTagName()
    .hasImage("dynamicObjectRepository/checkout-button.png")
    .build();
```

XPath axis navigation lets you walk DOM relationships without writing raw XPath:

```java title="XPathAxisLabelToInput.java"
// Find the input field that follows the "Email" label
By emailInput = SHAFT.GUI.Locator.hasTagName("label")
    .hasText("Email")
    .byAxis().followingSibling("input")
    .build();
```

For more locator strategies, see [LocatorBuilderTest examples on GitHub](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java).

## Smart locators {/* #smart-locators */}

`inputField()` and `clickableField()` find elements by their **user-facing meaning** — labels, placeholders, button text — rather than technical attributes. For the order of locator choices in a new web test, start with the [web locator strategy](/docs/testing/web#locator-strategy).

```java title="SmartLocators.java"
import com.shaft.driver.SHAFT;

// inputField(): matches label text, placeholder, name attribute, or aria-label, in that order
By emailField = SHAFT.GUI.Locator.inputField("Email");
By passwordField = SHAFT.GUI.Locator.inputField("Password");

// clickableField(): matches visible text, value attribute, or aria-label
// on <button>, <input type="submit">, <a>, and role="button" elements
By loginButton = SHAFT.GUI.Locator.clickableField("Log In");

driver.element()
      .type(emailField, "user@example.com")
      .and().type(passwordField, "secret")
      .and().click(loginButton);
```

| Approach | Example | Resilience |
|---|---|---|
| ID / CSS class | `By.id("btn-login-123")` | Low |
| XPath | `//button[@data-testid='login']` | Medium |
| Smart Locator | `clickableField("Log In")` | High |

:::note
When multiple elements match the same label or text, Smart Locators return the first match in DOM order. Use a more specific locator (e.g., scoped to a parent container) when disambiguation is needed.
:::

## iFrame handling {/* #iframe-handling */}

`driver.element().switchToIframe(locator)` switches WebDriver's context into an `<iframe>` so subsequent interactions target elements inside it; `driver.element().switchToDefaultContent()` returns to the main page:

```java title="iFrameHandling.java"
driver.element().switchToIframe(By.id("payment-iframe"));

driver.element()
    .type(By.id("cardNumber"), "4111111111111111")
    .type(By.id("cvv"), "123")
    .click(By.id("payBtn"));

driver.element().switchToDefaultContent();
```

Nested iframes require switching into each level in order. See [Element Identification → Interacting with IFrames](/docs/reference/actions/GUI/Element_Identification) for the full walkthrough, including nested-frame and index-based switching examples.

:::warning
Always call `switchToDefaultContent()` after finishing work inside an iframe — forgetting to switch back is a common cause of `NoSuchElementException` on main-page elements.
:::

## Related

- [Element Identification](/docs/reference/actions/GUI/Element_Identification)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [SHAFT Heal](/docs/agentic/heal)
- [Web](/docs/testing/web)
