---
id: API_Authentication
title: API Authentication
sidebar_label: API Authentication
description: "Configure BASIC, FORM, OAuth2, API Key, cookie, and session authentication for API tests in SHAFT Engine using setAuthentication and addHeader."
keywords: [SHAFT, API authentication, basic auth, form auth, OAuth2, bearer token, API key, cookie auth, REST API]
tags: [api, authentication, security, rest-assured]
---

Use `setAuthentication()` for BASIC or FORM authentication. For bearer tokens, API keys, and cookies, add the relevant header before calling `perform()`.

---

## BASIC Authentication

Pass a username and password using `AuthenticationType.BASIC`:

```java title="APIAuthentication.java"
import com.shaft.driver.SHAFT;
import com.shaft.api.RequestBuilder.AuthenticationType;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.get("/secure/data")
   .setAuthentication("username", "password", AuthenticationType.BASIC)
   .setTargetStatusCode(200)
   .perform();
```

---

## FORM Authentication

Submit credentials as form parameters using `AuthenticationType.FORM`:

```java title="APIAuthentication.java"
api.post("/login")
   .setAuthentication("user@example.com", "password123", AuthenticationType.FORM)
   .setTargetStatusCode(200)
   .perform();
```

---

## OAuth2 Bearer Token

Add the `Authorization` header with a `Bearer` token prefix:

```java title="APIAuthentication.java"
api.get("/oauth/resource")
   .addHeader("Authorization", "Bearer your-oauth-token")
   .setTargetStatusCode(200)
   .perform();
```

---

## API Key Authentication

### API Key in Header

```java title="APIAuthentication.java"
api.get("/data")
   .addHeader("X-API-Key", "your-api-key")
   .setTargetStatusCode(200)
   .perform();
```

### API Key in Query Parameter

```java title="APIAuthentication.java"
api.get("/data")
   .setUrlArguments("api_key=your-api-key")
   .setTargetStatusCode(200)
   .perform();
```

---

## Cookie-Based Authentication

Pass a session cookie using `addHeader`:

```java title="APIAuthentication.java"
api.get("/profile")
   .addHeader("Cookie", "session_id=abc123xyz; token=your-session-token")
   .setTargetStatusCode(200)
   .perform();
```

---

## Persistent headers and cookies

Use `addHeader()` or `addCookie()` on `SHAFT.API` when a token or cookie should be sent with later requests:

```java title="APIAuthentication.java"
SHAFT.API api = new SHAFT.API("https://api.example.com");

api.addHeader("Authorization", "Bearer your-oauth-token");
api.addCookie("session_id", "your-session-id");
api.get("/users").setTargetStatusCode(200).perform();
```

---

## Complete Test Example

```java title="APIAuthTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.api.RequestBuilder.AuthenticationType;
import org.testng.annotations.Test;

public class APIAuthTest {

    @Test
    public void testBasicAuth() {
        SHAFT.API api = new SHAFT.API("https://httpbin.org");
        api.get("/basic-auth/user/pass")
           .setAuthentication("user", "pass", AuthenticationType.BASIC)
           .setTargetStatusCode(200)
           .perform();

        api.assertThatResponse()
           .extractedJsonValue("$.authenticated")
           .isEqualTo("true");
    }

    @Test
    public void testBearerToken() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");
        api.get("/protected")
           .addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
           .setTargetStatusCode(200)
           .perform();
    }
}
```

---

:::tip
Store authentication credentials in SHAFT property files or environment variables — never hardcode tokens or passwords directly in test code.
:::

:::warning
OAuth2 tokens expire. For CI/CD pipelines, implement a token-refresh step before your test suite runs or retrieve the token programmatically as part of test setup.
:::

## Related

- [Request Builder](/docs/reference/actions/API/Request_Builder)
- [Response Validations](/docs/reference/actions/API/Response_Validations)
- [API](/docs/testing/api)
