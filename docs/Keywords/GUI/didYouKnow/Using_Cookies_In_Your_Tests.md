---
id: Using_Cookies_In_Your_Tests
title: Using Cookies in Your Tests
sidebar_label: Using Cookies
description: "Manage browser cookies in SHAFT tests — add, read, delete cookies and use them for authentication and session management."
keywords: [SHAFT, cookies, browser cookies, session management, authentication cookies, cookie manipulation]
---

You can manage cookies in your tests to maintain session state. Below is an example that demonstrates how to get a cookie value after login and reuse it in another session.

#### Example
```java
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
