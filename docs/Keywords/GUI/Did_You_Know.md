---
id: Did_You_Know
title: Tips and Tricks
sidebar_label: Tips & Tricks
description: "Discover advanced SHAFT Engine features — native Selenium access, custom capabilities, Locator Builder, Shadow DOM, and cookie management."
keywords: [SHAFT, tips, tricks, native Selenium, custom capabilities, locator builder, Shadow DOM, cookies]
---

## Native Selenium WebDriver

You can access the native Selenium WebDriver instance from SHAFT whenever you need it:

```java title="NativeDriverAccess.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
WebDriver nativeDriver = driver.getDriver();
nativeDriver.findElement(By.id("lname"));
```

## Custom Capabilities

You can pass your own custom capabilities when creating a SHAFT WebDriver:

```java title="CustomCapabilities.java"
ChromeOptions options = new ChromeOptions();
options.addArguments("--remote-allow-origins=*");
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverFactory.DriverType.CHROME, options);
```

## SHAFT Locator Builder

The SHAFT Locator Builder lets you locate elements using a fluent, readable API — no need to worry about XPath or CSS selectors:

```java title="LocatorBuilderBasics.java"
By locator = SHAFT.GUI.Locator.hasTagName("button").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("data-test").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("data-test", "add-to-cart").build();
```

You can also use `containsText()`, `containsId()`, and `containsClass()` for partial matching.

### Example

For an element with tag name `button`, attribute `data-test`, and value `add-to-cart-sauce-labs-backpack`:

```java title="LocatorBuilderExample.java"
By buttonLocator = SHAFT.GUI.Locator.hasTagName("button")
    .hasAttribute("data-test", "add-to-cart-sauce-labs-backpack")
    .build();
```

For more examples, visit [LocatorBuilderTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java) on GitHub.

## Shadow DOM Locator Builder

An advanced use of the SHAFT Locator Builder is locating elements inside Shadow DOM:

```java title="ShadowDomExample.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
By shadowHost = SHAFT.GUI.Locator.hasTagName("shop-app").build();
By shadowElement = SHAFT.GUI.Locator.hasTagName("a")
    .hasAttribute("href", "/list/mens_outerwear")
    .insideShadowDom(shadowHost)
    .build();

driver.browser().navigateToURL("https://shop.polymer-project.org/");
driver.element().click(shadowElement);
```

For more examples, visit [ShadowDomTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java) on GitHub.

## Using Cookies in Your Tests

You can manage cookies in your tests to maintain session state. Here is an example that demonstrates how to get a cookie value after login and reuse it in another session:

```java title="CookieExample.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class CookieExample {
    private SHAFT.GUI.WebDriver driver;
    private String cookieValue;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://demo.nopcommerce.com/");
        driver.element().click(By.xpath("//*[@class='ico-login']"));
        driver.element().type(By.id("Email"), "kn@test.com");
        driver.element().type(By.id("Password"), "123456");
        driver.element().click(By.xpath("//*[@class='button-1 login-button']"));

        cookieValue = driver.browser().getCookieValue(".Nop.Authentication");
        driver.quit();
    }

    @Test
    public void testCookies() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://demo.nopcommerce.com/");
        driver.browser().addCookie(".Nop.Authentication", cookieValue);
        driver.browser().refreshCurrentPage();
    }
}
```
