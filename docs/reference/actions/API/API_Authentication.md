---
id: API_Authentication
title: API Authentication
sidebar_label: API Authentication
description: "Configure BASIC, DIGEST, OAuth2, API Key, cookie, and session authentication for API tests in SHAFT Engine using setAuthentication and addHeader."
keywords: [SHAFT, API authentication, basic auth, digest auth, OAuth2, bearer token, API key, cookie auth, REST API]
tags: [api, authentication, security, rest-assured]
---

SHAFT Engine supports multiple API authentication strategies through `setAuthentication()` and the fluent request builder. All authentication methods integrate seamlessly with the existing `SHAFT.API` request-building API.

---

## BASIC Authentication

Pass a username and password using `AuthenticationType.BASIC`:

```java title="APIAuthentication.java"
import com.shaft.driver.SHAFT;
import com.shaft.api.RestActions.AuthenticationType;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.get("/secure/data")
   .setAuthentication("username", "password", AuthenticationType.BASIC)
   .setTargetStatusCode(200)
   .performRequest();
```

---

## DIGEST Authentication

Use `AuthenticationType.DIGEST` for digest-challenge protected endpoints:

```java title="APIAuthentication.java"
api.get("/digest-auth/data")
   .setAuthentication("user", "pass", AuthenticationType.DIGEST)
   .setTargetStatusCode(200)
   .performRequest();
```

---

## FORM Authentication

Submit credentials as form parameters using `AuthenticationType.FORM`:

```java title="APIAuthentication.java"
api.post("/login")
   .setAuthentication("user@example.com", "password123", AuthenticationType.FORM)
   .setTargetStatusCode(200)
   .performRequest();
```

---

## OAuth2 Bearer Token

Add the `Authorization` header with a `Bearer` token prefix:

```java title="APIAuthentication.java"
api.get("/oauth/resource")
   .addHeader("Authorization", "Bearer your-oauth-token")
   .setTargetStatusCode(200)
   .performRequest();
```

---

## API Key Authentication

### API Key in Header

```java title="APIAuthentication.java"
api.get("/data")
   .addHeader("X-API-Key", "your-api-key")
   .setTargetStatusCode(200)
   .performRequest();
```

### API Key in Query Parameter

```java title="APIAuthentication.java"
api.get("/data")
   .addUrlParameter("api_key", "your-api-key")
   .setTargetStatusCode(200)
   .performRequest();
```

---

## Cookie-Based Authentication

Pass a session cookie using `addHeader`:

```java title="APIAuthentication.java"
api.get("/profile")
   .addHeader("Cookie", "session_id=abc123xyz; token=your-session-token")
   .setTargetStatusCode(200)
   .performRequest();
```

---

## Persistent Session Authentication

When `setAuthentication()` is called, the credentials are saved for all subsequent requests in the same `SHAFT.API` session:

```java title="APIAuthentication.java"
SHAFT.API api = new SHAFT.API("https://api.example.com");

// Authenticate once — credentials reused for all subsequent requests
api.get("/login")
   .setAuthentication("user", "password", AuthenticationType.BASIC)
   .performRequest();

// These requests automatically include the authentication credentials
api.get("/users").setTargetStatusCode(200).performRequest();
api.get("/orders").setTargetStatusCode(200).performRequest();
api.get("/profile").setTargetStatusCode(200).performRequest();
```

---

## Complete Test Example

```java title="APIAuthTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.api.RestActions.AuthenticationType;
import org.testng.annotations.Test;

public class APIAuthTest {

    @Test
    public void testBasicAuth() {
        SHAFT.API api = new SHAFT.API("https://httpbin.org");
        api.get("/basic-auth/user/pass")
           .setAuthentication("user", "pass", AuthenticationType.BASIC)
           .setTargetStatusCode(200)
           .performRequest();

        api.assertThatResponse()
           .extractedJsonValue("authenticated")
           .isEqualTo("true")
           .perform();
    }

    @Test
    public void testBearerToken() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");
        api.get("/protected")
           .addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
           .setTargetStatusCode(200)
           .performRequest();
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
