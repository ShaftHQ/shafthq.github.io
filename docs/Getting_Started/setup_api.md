---
id: setup_api
title: "REST API Test Automation with SHAFT and REST Assured"
sidebar_label: API Testing
description: "Automate REST API testing using SHAFT Engine. Build requests, validate responses, extract JSON values, and integrate with CI/CD — all with a fluent Java API."
keywords: [api test automation, rest assured java, api testing framework, rest api testing, json validation, api automation tutorial, http request testing]
---

# REST API Test Automation with SHAFT

SHAFT wraps **REST Assured** to provide a fluent API for HTTP request building, response validation, and JSON/XML extraction.

## Your First API Test

```java
public class ApiTest {
    private SHAFT.API api;

    @Test
    public void getUserById() {
        api.get("https://jsonplaceholder.typicode.com/users/1")
           .perform();

        api.verifyThatResponse()
           .statusCode().isEqualTo(200)
           .perform();

        api.assertThatResponse()
           .extractedJsonValue("name")
           .isEqualTo("Leanne Graham")
           .perform();
    }

    @BeforeMethod
    public void setUp() {
        api = new SHAFT.API("https://jsonplaceholder.typicode.com");
    }
}
```

## Request Building

```java
// GET with query parameters
api.get("/users")
   .setParameter("page", "1")
   .setParameter("limit", "10")
   .perform();

// POST with JSON body
api.post("/users")
   .setContentType("application/json")
   .setRequestBody("""
       {"name": "Jane", "email": "jane@example.com"}
   """)
   .perform();

// PUT, PATCH, DELETE
api.put("/users/1").setRequestBody(body).perform();
api.patch("/users/1").setRequestBody(body).perform();
api.delete("/users/1").perform();
```

## Response Validation

```java
// Status code
api.verifyThatResponse()
   .statusCode().isEqualTo(200)
   .perform();

// Response body content
api.verifyThatResponse()
   .body().contains("Leanne Graham")
   .perform();

// Response time
api.verifyThatResponse()
   .time().isLessThan(2000)
   .perform();

// JSON path extraction
String email = api.getResponseJSONValue("email");
String city = api.getResponseJSONValue("address.city");
```

## Authentication

```java
// Basic auth
api.get("/secure/resource")
   .setAuthentication("username", "password", "basic")
   .perform();

// Bearer token
api.get("/secure/resource")
   .setRequestHeader("Authorization", "Bearer " + token)
   .perform();
```

## Properties for API Testing

```properties
# Timeout (milliseconds)
apiSocketTimeout=30000

# Log all API responses in reports
alwaysLogAPIResponse=true
```

## Learn More

- [Request Builder reference →](../Keywords/API/Request_Builder)
- [Response Getters reference →](../Keywords/API/Response_Getters)
- [Response Validations reference →](../Keywords/API/Response_Validations)
