---
id: Using_Cookies_In_Your_Tests
title: Using Cookies in Your Tests
sidebar_label: Using Cookies
description: "Manage browser cookies in SHAFT tests — add, read, delete cookies and use them for authentication and session management."
keywords: [SHAFT, cookies, browser cookies, session management, authentication cookies, cookie manipulation]
tags: [web, cookies, authentication]
---

You can manage cookies in your tests to maintain session state. Below is an example that demonstrates how to get a cookie value after login and reuse it in another session.

#### API login to browser session
```java
import com.shaft.driver.SHAFT;
import io.restassured.http.ContentType;

SHAFT.API api = new SHAFT.API("https://api.example.com");
api.post("/auth/login")
   .setRequestBody(credentials)
   .setContentType(ContentType.JSON);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser()
      .navigateToURL("https://app.example.com")
      .importCookiesFrom(api);
```

The browser must already be on an HTTP or HTTPS page whose domain is compatible with the imported cookies. Host-only API cookies are imported only on their original host; cross-subdomain browser reuse requires cookies issued with a shared domain such as `example.com`. Use `importCookiesFrom(api, "example.com", "/app")` to import only matching cookie domains and paths.

#### Browser login to API session
```java
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://app.example.com");

SHAFT.API api = new SHAFT.API("https://api.example.com");
api.importCookiesFrom(driver.browser());
api.get("/account");
```

#### Manual cookie reuse
```java
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

## Related

- [Browser actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element actions](/docs/reference/actions/GUI/Element_Actions)
- [Web testing](/docs/testing/web)
