---
id: Network_Mocking
title: Network Mocking and Request Interception
sidebar_label: Network Mocking
description: "Mock API responses and intercept network requests in SHAFT Engine using Selenium DevTools — test error states, offline mode, and slow networks reliably."
keywords: [SHAFT, network mocking, request interception, Selenium DevTools, CDP, mock API, offline testing]
tags: [web, network, devtools, mocking]
---

SHAFT Engine exposes Selenium's Chrome DevTools Protocol (CDP) integration via `driver.browser().mock()` and `driver.browser().intercept()`. This allows you to **replace API responses** with controlled test data and **block or modify outgoing requests** — all without changing your application code.

:::info
Network mocking relies on the Chrome DevTools Protocol. Use a Chromium-based browser (Chrome or Edge) when running tests that require this feature.
:::

---

## Use Cases

| Scenario | Recommended approach |
|---|---|
| Test error states (500, 404) | `mock()` with a custom status code |
| Test empty states (no data) | `mock()` with empty JSON body |
| Block analytics / tracking calls | `intercept()` with 204 response |
| Simulate offline mode | `intercept()` all requests with network error |
| Inject controlled test data | `mock()` with fixed JSON payload |

---

## mock() — Replace Responses

Use `mock()` to intercept requests matching a condition and return a **custom HTTP response** instead of the real one.

```java title="NetworkMocking.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.devtools.v85.fetch.model.RequestPattern;
import org.openqa.selenium.remote.http.Contents;
import org.openqa.selenium.remote.http.HttpResponse;

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();

// Mock an API response
driver.browser().mock(
    request -> request.getUri().contains("/api/users"),
    new HttpResponse()
        .setStatus(200)
        .addHeader("Content-Type", "application/json")
        .setContent(Contents.utf8String("{\"users\": [{\"name\": \"Mock User\"}]}"))
);

// Navigate to the page that calls the mocked API
driver.browser().navigateToURL("https://example.com/dashboard");
```

---

## intercept() — Block or Modify Requests

Use `intercept()` to **block or silently replace** outbound requests — for example, to suppress analytics calls or simulate unavailable services.

```java title="NetworkMocking.java"
// Intercept and silence analytics calls
driver.browser().intercept(
    request -> request.getUri().contains("/api/analytics"),
    new HttpResponse().setStatus(204)
);

// Intercept and simulate a server error
driver.browser().intercept(
    request -> request.getUri().contains("/api/checkout"),
    new HttpResponse()
        .setStatus(500)
        .addHeader("Content-Type", "application/json")
        .setContent(Contents.utf8String("{\"error\": \"Internal Server Error\"}"))
);
```

---

## Complete Example

```java title="NetworkMockingTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.http.Contents;
import org.openqa.selenium.remote.http.HttpResponse;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class NetworkMockingTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void testEmptyUserList() {
        driver.browser().mock(
            request -> request.getUri().contains("/api/users"),
            new HttpResponse()
                .setStatus(200)
                .addHeader("Content-Type", "application/json")
                .setContent(Contents.utf8String("{\"users\": []}"))
        );
        driver.browser().navigateToURL("https://example.com/users");
        driver.assertThat(By.id("emptyState")).text().contains("No users found").perform();
    }

    @Test
    public void testServerErrorHandling() {
        driver.browser().mock(
            request -> request.getUri().contains("/api/users"),
            new HttpResponse().setStatus(500)
        );
        driver.browser().navigateToURL("https://example.com/users");
        driver.assertThat(By.id("errorBanner")).text().contains("Something went wrong").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Register mocks **before** navigating to the page. The browser must have the intercept rules in place before any requests are made.
:::

:::note
Mocks and intercepts registered via `mock()` and `intercept()` are scoped to the current browser session and are cleared when the driver is quit.
:::
