---
id: Network_Mocking
title: Network Mocking and Request Interception
sidebar_label: Network Mocking
description: "Mock API responses, intercept browser network requests, and validate real responses in SHAFT Engine using Selenium DevTools."
keywords: [SHAFT, network mocking, request interception, Selenium DevTools, CDP, mock API, offline testing]
tags: [web, network, devtools, mocking]
---

SHAFT Engine exposes browser network interception through `driver.browser().interceptRequest()`. Use it to match outgoing browser requests, replace responses with controlled test data, or let real responses continue and validate them with SHAFT API validations.

:::info
Network interception relies on Selenium DevTools support. Use a DevTools-capable browser, such as Chrome or Edge, when running tests that require this feature.
:::

---

## Use Cases

| Scenario | Recommended approach |
|---|---|
| Test error states (500, 404) | `.respond().statusCode(500).perform()` |
| Test empty states (no data) | `.respond().jsonBody("{\"items\":[]}").perform()` |
| Block analytics / tracking calls | Match the analytics URL and return a 204 response |
| Validate real API responses from the browser | `.assertResponse(...)` or `.verifyResponse(...)` |
| Inject controlled test data | Match the request and return a fixed JSON payload |

---

## Mock Responses

Build the request matcher first, then configure the mocked response. Register the rule before navigating to the page that sends the request.

```java title="NetworkMocking.java"
import com.shaft.driver.SHAFT;

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();

driver.browser()
        .interceptRequest()
        .get()
        .urlContains("/api/users")
        .queryParam("role", "admin")
        .header("X-Test", "yes")
        .respond()
        .statusCode(200)
        .jsonBody("{\"users\":[{\"name\":\"Mock User\"}]}")
        .perform();

driver.browser().navigateToURL("https://example.com/dashboard");
```

---

## Validate Real Responses

Use `assertResponse()` for hard assertions or `verifyResponse()` for soft verifications. The real request continues to the server, then SHAFT validates the received response.

```java title="NetworkValidation.java"
driver.browser()
        .interceptRequest()
        .get()
        .pathEquals("/api/users")
        .assertResponse(response -> response
                .extractedJsonValue("users.size()")
                .isEqualTo("1")
                .perform());
```

---

## Request Matchers

Use the built-in matchers for common request fields:

```java title="RequestMatchers.java"
driver.browser()
        .interceptRequest()
        .post()
        .pathContains("/api/checkout")
        .urlMatches("https://example.com/.*/checkout")
        .queryParam("source", "web")
        .header("Content-Type", "application/json")
        .bodyContains("\"coupon\":\"SUMMER\"")
        .matching(request -> request.getUri().contains("/api/"))
        .respond()
        .statusCode(202)
        .perform();
```

---

## Complete Example

```java title="NetworkMockingTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
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
        driver.browser()
                .interceptRequest()
                .get()
                .urlContains("/api/users")
                .respond()
                .statusCode(200)
                .jsonBody("{\"users\":[]}")
                .perform();

        driver.browser().navigateToURL("https://example.com/users");
        driver.assertThat(By.id("emptyState")).text().contains("No users found").perform();
    }

    @Test
    public void testServerErrorHandling() {
        driver.browser()
                .interceptRequest()
                .get()
                .urlContains("/api/users")
                .respond()
                .statusCode(500)
                .jsonBody("{\"error\":\"Internal Server Error\"}")
                .perform();

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

## Advanced Predicate API

`mock()` and `intercept()` remain available for advanced use cases that need direct Selenium `HttpRequest` predicates and `HttpResponse` objects.

```java title="PredicateApi.java"
import org.openqa.selenium.remote.http.Contents;
import org.openqa.selenium.remote.http.HttpResponse;

driver.browser().mock(
        request -> request.getUri().contains("/api/users"),
        new HttpResponse()
                .setStatus(200)
                .addHeader("Content-Type", "application/json")
                .setContent(Contents.utf8String("{\"users\":[]}"))
);
```

:::note
Interception rules are scoped to the current browser session. They are cleared automatically when the driver is quit, or explicitly with `driver.browser().clearNetworkInterceptors()`. If multiple rules match the same request, the latest registered rule wins.
:::
