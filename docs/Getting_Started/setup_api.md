---
id: setup_api
title: "REST API Test Automation with SHAFT and REST Assured"
sidebar_label: API Testing
description: "Automate REST API testing using SHAFT Engine. Build requests, validate responses, extract JSON values, and integrate with CI/CD — all with a fluent Java API."
keywords: [api test automation, rest assured java, api testing framework, rest api testing, json validation, api automation tutorial, http request testing]
tags: [api, setup, rest-assured]
---

# REST API Test Automation with SHAFT

SHAFT wraps **REST Assured** to provide a fluent API for HTTP request building, response validation, and JSON/XML extraction.

## Your First API Test

```java title="src/test/java/tests/UserApiTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class UserApiTest {
    private SHAFT.API api;

    @Test
    public void getUserById() {
        api.get("/users/1")
           .setTargetStatusCode(200)
           .perform();

        api.assertThatResponse()
           .extractedJsonValue("name")
           .isEqualTo("Leanne Graham")
           .withCustomReportMessage("GET /users/1 should return the correct user name")
           .perform();
    }

    @Test
    public void createUser() {
        String body = """
                {
                    "name": "Alice",
                    "job": "engineer"
                }""";

        api.post("/users")
           .setRequestBody(body)
           .setContentType("application/json")
           .setTargetStatusCode(201)
           .perform();

        api.assertThatResponse()
           .extractedJsonValue("name")
           .isEqualTo("Alice")
           .perform();
    }

    @BeforeMethod
    public void setUp() {
        api = new SHAFT.API("https://jsonplaceholder.typicode.com");
    }
}
```

## Request Building

### HTTP Methods

```java title="HttpMethods.java"
// GET
api.get("/users").perform();

// POST with JSON body
api.post("/users")
   .setContentType("application/json")
   .setRequestBody("{\"name\": \"Jane\", \"email\": \"jane@example.com\"}")
   .perform();

// PUT / PATCH / DELETE
api.put("/users/1").setRequestBody(body).perform();
api.patch("/users/1").setRequestBody(body).perform();
api.delete("/users/1").perform();
```

### Query Parameters

Use `setUrlArguments()` for simple query strings, or `setParameters()` for structured lists:

```java title="QueryParams.java"
import com.shaft.api.RestActions;
import java.util.Arrays;
import java.util.List;

// Simple query string
api.get("/comments").setUrlArguments("postId=1&userId=2").perform();

// Structured query parameters
List<List<Object>> params = Arrays.asList(
    Arrays.asList("page",  "1"),
    Arrays.asList("limit", "20")
);
api.get("/posts")
   .setParameters(params, RestActions.ParametersType.QUERY)
   .perform();
```

### Path Parameters

```java title="PathParams.java"
import java.util.Map;

// Named placeholders
api.get("/posts/{postId}/comments/{commentId}")
   .setPathParameters(Map.of("postId", 1, "commentId", 1))
   .perform();

// Ordered values
api.get("/posts/{postId}/comments/{commentId}")
   .setPathParameters("1", "1")
   .perform();
```

### Request Body

```java title="RequestBody.java"
import io.restassured.http.ContentType;
import org.json.simple.JSONObject;
import java.util.HashMap;

// String (text block)
String body = """
        {
            "name": "morpheus",
            "job": "leader"
        }""";
api.post("/users").setRequestBody(body).setContentType(ContentType.JSON).perform();

// HashMap
HashMap<String, Object> map = new HashMap<>();
map.put("name", "morpheus");
map.put("job", "leader");
api.post("/users").setRequestBody(map).setContentType(ContentType.JSON).perform();

// JSONObject
JSONObject json = new JSONObject();
json.put("name", "morpheus");
json.put("job", "leader");
api.post("/users").setRequestBody(json).setContentType(ContentType.JSON).perform();

// From file
api.post("/users")
   .setRequestBodyFromFile("src/test/resources/testDataFiles/createUser.json")
   .setContentType(ContentType.JSON)
   .perform();
```

### Headers

```java title="Headers.java"
String token = System.getenv("API_TOKEN");

// Single header on a request
api.get("/secure/data")
   .addHeader("Authorization", "Bearer " + token)
   .perform();

// Multiple headers
api.post("/events")
   .addHeader("Authorization", "Bearer " + token)
   .addHeader("X-Correlation-ID", "test-run-001")
   .perform();

// Persistent header for all subsequent requests in the session
api.addHeader("Authorization", "Bearer " + token);
api.get("/users").perform();    // header included automatically
api.get("/orders").perform();   // header included automatically
```

## Response Validation

```java title="ResponseValidations.java"
// Validate status code via the request builder (recommended)
api.get("/users/1").setTargetStatusCode(200).perform();

// Validate response body contains a string
api.assertThatResponse()
   .body().contains("Leanne Graham")
   .perform();

// Validate a JSONPath value
api.assertThatResponse()
   .extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id")
   .isEqualTo("5")
   .perform();

// Validate response time (milliseconds)
api.assertThatResponse()
   .time().isLessThan(3000)
   .perform();

// Soft assertion — does not stop the test on failure
api.verifyThatResponse()
   .body().contains("expected-text")
   .perform();
```

## Extracting Response Values

```java title="ResponseExtraction.java"
// Get full response body as string
String body = api.getResponseBody();

// Get status code
int statusCode = api.getResponseStatusCode();

// Get response time in milliseconds
long ms = api.getResponseTime();

// Extract a single JSONPath value
String email = api.getResponseJSONValue("$[0].email");

// Extract a list of values
List<Object> names = api.getResponseJSONValueAsList("$[*].name");

// Extract an XML value
String xmlValue = api.getResponseXMLValue("//user/name");
```

## Authentication

```java title="Authentication.java"
import com.shaft.api.RestActions.AuthenticationType;

// Basic auth
api.get("/basic-auth/user/pass")
   .setAuthentication("user", "pass", AuthenticationType.BASIC)
   .setTargetStatusCode(200)
   .perform();

// Bearer token (add as header)
api.get("/protected")
   .addHeader("Authorization", "Bearer " + System.getenv("API_TOKEN"))
   .perform();

// API key in header
api.get("/data")
   .addHeader("X-API-Key", System.getenv("API_KEY"))
   .perform();

// API key as query parameter
api.get("/data").setUrlArguments("api_key=" + System.getenv("API_KEY")).perform();
```

## Complete End-to-End Example

```java title="src/test/java/tests/PostsApiTest.java"
import com.shaft.driver.SHAFT;
import io.restassured.http.ContentType;
import org.testng.annotations.*;

public class PostsApiTest {
    private SHAFT.API api;

    @BeforeClass
    public void setUp() {
        api = new SHAFT.API("https://jsonplaceholder.typicode.com");
    }

    @Test(description = "Create a new post and verify it was persisted")
    public void createAndVerifyPost() {
        // Create
        String body = """
                {
                    "title":  "foo",
                    "body":   "bar",
                    "userId": 1
                }""";
        api.post("/posts")
           .setRequestBody(body)
           .setContentType(ContentType.JSON)
           .setTargetStatusCode(201)
           .perform();

        api.assertThatResponse()
           .extractedJsonValue("title")
           .isEqualTo("foo")
           .withCustomReportMessage("Created post should have the correct title")
           .perform();

        // Fetch and verify
        api.get("/posts/1").setTargetStatusCode(200).perform();

        api.assertThatResponse()
           .extractedJsonValue("userId")
           .isEqualTo("1")
           .perform();
    }

    @Test(description = "List all posts returns a non-empty array")
    public void listAllPosts() {
        api.get("/posts").setTargetStatusCode(200).perform();

        SHAFT.Validations.assertThat()
             .number(api.getResponseJSONValueAsList("$[*].id").size())
             .isGreaterThan(0)
             .withCustomReportMessage("Posts list should not be empty")
             .perform();
    }
}
```

## Properties for API Testing

```properties title="src/main/resources/properties/custom.properties"
# Request timeout (milliseconds)
apiSocketTimeout=30000

# Log all API responses in reports (useful for debugging)
alwaysLogAPIResponse=true
```

## Learn More

- [Request Builder reference →](../Keywords/API/Request_Builder)
- [Response Getters reference →](../Keywords/API/Response_Getters)
- [Response Validations reference →](../Keywords/API/Response_Validations)
- [GraphQL Testing →](../Keywords/API/GraphQL_Testing)
- [API Authentication →](../Keywords/API/API_Authentication)
