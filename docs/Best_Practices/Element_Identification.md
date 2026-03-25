---
id: Element_Identification
title: "Element Identification Best Practices"
sidebar_label: Element Identification
description: "Best practices for element identification in SHAFT Engine — By objects, dynamic locators, cross-platform locators, and why to avoid @FindBy."
keywords: [SHAFT, element identification, By locator, dynamic locator, cross-platform, Android, iOS, FindBy]
---

Choosing the right element identification strategy is critical to building stable, maintainable tests. SHAFT Engine encourages the use of standard Selenium `By` objects and its own [Locator Builder](../Keywords/GUI/didYouKnow/Shaft_Locator_Builder) over alternatives like `@FindBy`.

---

## Use `By` Objects, Not `@FindBy`

The `@FindBy` annotation (from Selenium's `PageFactory`) has several drawbacks:

| `@FindBy` | `By` Objects |
|---|---|
| Evaluated at runtime via reflection — errors appear late | Evaluated immediately — compile-time safety |
| Cannot be reused across methods easily | Standard Java objects — pass, store, and compose freely |
| Tied to `PageFactory.initElements()` lifecycle | No initialization ceremony required |
| Hard to make dynamic or conditional | Easy to build dynamically with logic |

:::warning
`@FindBy` with `PageFactory` can lead to `StaleElementReferenceException` issues and adds unnecessary complexity. SHAFT's built-in element handling with `By` objects already provides smart waits, auto-scrolling, and retry logic.
:::

### Recommended Pattern

Define your locators as `By` constants in your Page Object class:

```java title="LoginPage.java"
import org.openqa.selenium.By;

public class LoginPage {
    // Locators as By objects
    private final By usernameInput = By.id("username");
    private final By passwordInput = By.id("password");
    private final By loginButton = By.cssSelector("button[type='submit']");
    private final By errorMessage = By.className("error-message");
}
```

---

## Dynamic Element Identification

Sometimes a locator depends on runtime data — a product name, a row index, or a user-provided value. With `By` objects you can build locators dynamically:

```java title="DynamicLocators.java"
public By getProductAddToCartButton(String productName) {
    return By.cssSelector("div[data-product='" + productName + "'] button.add-to-cart");
}

public By getTableCell(int row, int col) {
    return By.cssSelector("table tr:nth-child(" + row + ") td:nth-child(" + col + ")");
}
```

### Using SHAFT Locator Builder for Dynamic Locators

The [SHAFT Locator Builder](../Keywords/GUI/didYouKnow/Shaft_Locator_Builder) provides a fluent, readable API for building locators without writing raw XPath or CSS:

```java title="LocatorBuilderDynamic.java"
public By getProductButton(String productName) {
    return SHAFT.GUI.Locator.hasTagName("button")
        .hasAttribute("data-product", productName)
        .build();
}
```

---

## Cross-Platform Locators (Android and iOS)

When testing the same app on both Android and iOS, the locators are often different. The recommended pattern is to use a helper method or enum that returns the correct locator based on the current platform:

```java title="CrossPlatformLocators.java"
import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import com.shaft.driver.SHAFT;

public class LoginPage {
    private By getUsernameInput() {
        if (SHAFT.Properties.platform.targetPlatform().equals(Platform.ANDROID.name())) {
            return By.id("com.example.app:id/username_input");
        } else {
            return By.name("username_field");
        }
    }

    private By getLoginButton() {
        if (SHAFT.Properties.platform.targetPlatform().equals(Platform.ANDROID.name())) {
            return By.id("com.example.app:id/login_btn");
        } else {
            return By.xpath("//XCUIElementTypeButton[@name='Login']");
        }
    }
}
```

:::tip
For a cleaner approach, you can centralize platform-specific locators in a constants file or use an enum-based strategy to avoid `if-else` blocks throughout your page objects. See the [Cross-Platform Strategy](Cross_Platform_Strategy) page for more details.
:::

---

## Best Practices Summary

1. **Use `By` objects** — They are simple, composable, and work naturally with SHAFT's element handling.
2. **Avoid `@FindBy` / `PageFactory`** — It adds complexity without benefits when using SHAFT.
3. **Build locators dynamically** when they depend on runtime data.
4. **Use SHAFT Locator Builder** for readable, maintainable locators without raw XPath or CSS.
5. **Abstract platform differences** behind helper methods when supporting both Android and iOS.
