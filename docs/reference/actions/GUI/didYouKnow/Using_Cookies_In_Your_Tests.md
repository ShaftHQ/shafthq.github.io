---
id: Using_Cookies_In_Your_Tests
title: Using Cookies in Your Tests
sidebar_label: Using Cookies
description: "Manage browser cookies in SHAFT tests — add, read, delete cookies, reuse storage state across browser and API sessions, and cache logins with SHAFT.Auth."
keywords: [SHAFT, cookies, browser cookies, session management, authentication cookies, cookie manipulation, storage state, SHAFT.Auth]
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

#### API session seeded from a saved storage-state file

`SHAFT.API` also accepts a storage-state JSON path directly in its constructor — the same file produced by `driver.browser().saveStorageState(path)` on either `SHAFT.GUI.WebDriver` or `SHAFT.GUI.Playwright`:

```java
SHAFT.API api = new SHAFT.API("https://api.example.com", "target/auth-state.json");
api.get("/account");
```

#### API session cookies back into the browser

Use `exportCookiesTo(...)` to mirror `importCookiesFrom(...)` in the other direction, copying cookies from an `SHAFT.API` session into a browser session:

```java
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://app.example.com");

SHAFT.API api = new SHAFT.API("https://api.example.com");
api.post("/auth/login").setRequestBody(credentials).setContentType(ContentType.JSON);
api.exportCookiesTo(driver.browser());

driver.browser().refreshCurrentPage();
```

Like `importCookiesFrom`, `exportCookiesTo(browserActions, domainFilter, pathFilter)` accepts optional exact domain and path filters to export only matching cookies.

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

## Cached Authentication with SHAFT.Auth

`SHAFT.Auth.setup(name, flow)` is a Playwright-style cached-authentication helper: it runs a login `flow` once per `name` and caches the resulting browser storage state to disk, so later calls — including from other tests, classes, or threads — reuse the cached session instead of repeating the UI login.

```java title="AuthSetup.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

// Once per suite, e.g. in a @BeforeSuite:
SHAFT.Auth.setup("standardUser", driver -> {
    driver.browser().navigateToURL("https://example.com/login");
    driver.element().type(By.id("username"), "standard_user");
    driver.element().type(By.id("password"), "secret_sauce");
    driver.element().click(By.id("login-button"));
});

// In every test, reuse the cached session instead of logging in again:
SHAFT.Properties.web.set().storageStatePath(SHAFT.Auth.stateFile("standardUser"));
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

- The cache file is written in the same JSON schema as `saveStorageState(path)`, stored under `SHAFT.Properties.paths.authCache()` (default `target/auth-cache/`), one file per `name`.
- **Staleness policy** is deliberately simple: the cache is valid as long as the file exists, with no TTL/max-age check. Call `SHAFT.Auth.stateFile(name)` to get the cache path and delete that file to force a re-login on the next `setup()` call.
- **Thread-safety:** concurrent `setup()` calls for the *same* `name` are serialized on a per-name lock — only the first caller runs `flow`; every other concurrent caller blocks until it finishes, then reuses the now-cached file. Calls for different names never block each other.
- Feed `SHAFT.Auth.stateFile(name)` to `SHAFT.Properties.web.set().storageStatePath(...)` (auto-loaded on the next driver init — see [Auto-load storage state on driver init](/docs/reference/actions/GUI/Browser_Actions#auto-load-storage-state-on-driver-init)) or directly to `driver.browser().loadStorageState(...)`.

## Related

- [Browser actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element actions](/docs/reference/actions/GUI/Element_Actions)
- [Web testing](/docs/testing/web)
