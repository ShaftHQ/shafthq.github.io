---
id: ARIA_Locators
title: ARIA Role-Based Locators
sidebar_label: ARIA Locators
description: "Locate elements by ARIA roles in SHAFT Engine for more resilient, accessible tests — use Role enum values like BUTTON, SEARCHBOX, DIALOG, and NAVIGATION."
keywords: [SHAFT, ARIA locators, role-based locators, accessibility, BUTTON, DIALOG, NAVIGATION, SEARCHBOX, resilient locators]
tags: [web, locator, aria, accessibility]
---

SHAFT Engine supports **ARIA role-based locators** through the `SHAFT.GUI.Locator.hasRole()` builder method and the `Role` enum. These locators find elements by their semantic ARIA role rather than fragile implementation details like IDs or CSS classes, producing tests that are more resilient to UI changes and better aligned with accessibility best practices.

---

## Benefits Over Traditional Locators

| Aspect | ID / Class Locator | ARIA Role Locator |
|---|---|---|
| Resilience to UI changes | Low — breaks when IDs change | High — roles rarely change |
| Accessibility alignment | None | Directly tests accessible structure |
| Readability | Technical | Semantic and self-documenting |
| Combinability | Limited | Combine with text, label, and other conditions |

---

## Available Roles

Common values from the `Role` enum include:

| Role | HTML Elements |
|---|---|
| `BUTTON` | `<button>`, `role="button"` |
| `SEARCHBOX` | `<input type="search">`, `role="searchbox"` |
| `NAVIGATION` | `<nav>`, `role="navigation"` |
| `MAIN` | `<main>`, `role="main"` |
| `DIALOG` | `<dialog>`, `role="dialog"` |
| `ALERT` | `role="alert"` |
| `CHECKBOX` | `<input type="checkbox">`, `role="checkbox"` |
| `LINK` | `<a>`, `role="link"` |
| `LISTBOX` | `<select>`, `role="listbox"` |
| `TEXTBOX` | `<input type="text">`, `role="textbox"` |

---

## Basic Usage

```java title="ARIALocators.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.Role;

// Locate a submit button by role and text
By submitButton = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasText("Submit").build();

// Locate a search input by role
By searchInput = SHAFT.GUI.Locator.hasRole(Role.SEARCHBOX).build();

// Locate navigation, main content area, and dialog
By navigation = SHAFT.GUI.Locator.hasRole(Role.NAVIGATION).build();
By mainContent = SHAFT.GUI.Locator.hasRole(Role.MAIN).build();
By dialog = SHAFT.GUI.Locator.hasRole(Role.DIALOG).build();

driver.element().click(submitButton);
driver.element().type(searchInput, "test query");
```

---

## Combining Conditions

ARIA role locators can be combined with `.hasText()` and other locator builder conditions for precise targeting:

```java title="ARIALocators.java"
// Button with specific text
By deleteButton = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasText("Delete").build();

// Alert with specific message
By errorAlert = SHAFT.GUI.Locator.hasRole(Role.ALERT).containsText("error").build();

// Link within navigation
By homeLink = SHAFT.GUI.Locator.hasRole(Role.LINK).hasText("Home").build();
```

---

## Complete Example

```java title="ARIALocatorTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.Role;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ARIALocatorTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void searchUsingARIALocators() {
        By searchBox = SHAFT.GUI.Locator.hasRole(Role.SEARCHBOX).build();
        By searchButton = SHAFT.GUI.Locator.hasRole(Role.BUTTON).hasText("Search").build();

        driver.browser().navigateToURL("https://example.com");
        driver.element()
            .type(searchBox, "SHAFT Engine")
            .click(searchButton);

        driver.assertThat().browser().url().contains("search").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Pair ARIA locators with SHAFT's Smart Locators (`inputField` / `clickableField`) for the most readable and maintainable locator strategy. See [Smart Locators](Smart_Locators) for details.
:::
