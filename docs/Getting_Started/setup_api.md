---
id: setup_api
title: Setting Up an API Project
sidebar_label: API Projects
---

## 🔌 API Test Automation with SHAFT

This guide will help you set up a SHAFT project for **REST API test automation** using REST Assured.

---

## What You'll Build

A complete API automation project with:
- RESTful API testing capabilities
- Request/Response validation
- Authentication support (Basic, Bearer, OAuth)
- JSON/XML response parsing
- Built-in reporting with request/response logging
- Data-driven testing support

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **Java JDK**: Latest LTS version (JDK 17 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- ✅ **IDE**: IntelliJ IDEA (recommended) or Eclipse - [Download IntelliJ](https://www.jetbrains.com/idea/download/)
- ✅ **Maven**: Usually comes with your IDE
- ✅ **API to test**: Your own API or use public APIs for practice

:::tip[Knowledge Prerequisites]
Familiarity with:
- Java programming basics
- REST API concepts (HTTP methods, status codes, headers)
- JSON structure
- Maven project structure
:::

---

## Step 1: Create Your Project

### Using Maven

Create a new Maven project with the following `pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany</groupId>
    <artifactId>api-automation</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <!-- Get latest version from https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE -->
        <shaft.version><!-- Check latest version --></shaft.version>
    </properties>

    <dependencies>
        <!-- SHAFT Engine (includes REST Assured) -->
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>SHAFT_ENGINE</artifactId>
            <version>${shaft.version}</version>
        </dependency>
        
        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.8.0</version>
        </dependency>
    </dependencies>
</project>
```

Get the latest SHAFT version from [Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE)

---

## Step 2: Project Structure

Create the following directory structure:

```
api-automation/
├── src/
│   ├── main/
│   │   └── resources/
│   │       └── properties/
│   │           └── custom.properties
│   └── test/
│       ├── java/
│       │   └── com/mycompany/
│       │       ├── endpoints/     # API endpoint wrappers
│       │       ├── models/        # Request/Response models
│       │       └── tests/         # Test classes
│       └── resources/
│           └── testData/          # Test data files (JSON, etc.)
└── pom.xml
```

---

## Step 3: Configure SHAFT Properties

Create `src/main/resources/properties/custom.properties`:

```properties
# API Configuration
# Base URI for your API (can be overridden in tests)
# Example: https://api.example.com

# Timeouts
apiSocketTimeout=30000

# Logging
alwaysLogAPIResponse=true

# Reporting
alwaysTakePageSourceOnFailure=true
```

---

## Step 4: Create Your First API Test

### Example: Testing JSONPlaceholder API

We'll use the free [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API for demonstration.

### Create a Service Class

Create: `src/test/java/com/mycompany/endpoints/UserService.java`

```java
package com.mycompany.endpoints;

import com.shaft.driver.SHAFT;

public class UserService {
    private SHAFT.API apiDriver;
    private static final String BASE_URL = "https://jsonplaceholder.typicode.com";
    
    public UserService(SHAFT.API apiDriver) {
        this.apiDriver = apiDriver;
    }
    
    public SHAFT.API getAllUsers() {
        return apiDriver.get(BASE_URL + "/users");
    }
    
    public SHAFT.API getUserById(int userId) {
        return apiDriver.get(BASE_URL + "/users/" + userId);
    }
    
    public SHAFT.API createUser(String requestBody) {
        return apiDriver.post(BASE_URL + "/users")
            .setRequestBody(requestBody);
    }
    
    public SHAFT.API updateUser(int userId, String requestBody) {
        return apiDriver.put(BASE_URL + "/users/" + userId)
            .setRequestBody(requestBody);
    }
    
    public SHAFT.API deleteUser(int userId) {
        return apiDriver.delete(BASE_URL + "/users/" + userId);
    }
}
```

### Create a Test Class

Create: `src/test/java/com/mycompany/tests/UserApiTest.java`

```java
package com.mycompany.tests;

import com.mycompany.endpoints.UserService;
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class UserApiTest {
    private SHAFT.API api;
    private UserService userService;
    
    @Test(description = "Get all users")
    public void testGetAllUsers() {
        userService.getAllUsers()
            .perform();
        
        // Assertions
        api.assertThatResponse()
            .extractedJsonValue("$[0].name")
            .isEqualTo("Leanne Graham")
            .perform();
    }
    
    @Test(description = "Get user by ID")
    public void testGetUserById() {
        userService.getUserById(1)
            .perform();
        
        // Validate response
        api.verifyThatResponse()
            .statusCode().isEqualTo(200)
            .and().body().contains("Leanne Graham")
            .and().time().isLessThan(2000)
            .perform();
    }
    
    @Test(description = "Create a new user")
    public void testCreateUser() {
        String requestBody = """
            {
                "name": "John Doe",
                "username": "johndoe",
                "email": "john@example.com"
            }
            """;
        
        userService.createUser(requestBody)
            .perform();
        
        // Validate creation
        api.assertThatResponse()
            .extractedJsonValue("name")
            .isEqualTo("John Doe")
            .perform();
    }
    
    @Test(description = "Update user")
    public void testUpdateUser() {
        String requestBody = """
            {
                "name": "Jane Doe",
                "email": "jane@example.com"
            }
            """;
        
        userService.updateUser(1, requestBody)
            .perform();
        
        api.verifyThatResponse()
            .statusCode().isEqualTo(200)
            .perform();
    }
    
    @Test(description = "Delete user")
    public void testDeleteUser() {
        userService.deleteUser(1)
            .perform();
        
        api.verifyThatResponse()
            .statusCode().isEqualTo(200)
            .perform();
    }
    
    @BeforeMethod
    public void setUp() {
        api = new SHAFT.API();
        userService = new UserService(api);
    }
}
```

---

## Step 5: Common API Testing Patterns

### Request Building

```java
// GET with query parameters
api.get("https://api.example.com/users")
    .setParameter("page", "1")
    .setParameter("limit", "10")
    .perform();

// POST with headers
api.post("https://api.example.com/users")
    .setContentType("application/json")
    .setRequestHeader("Authorization", "Bearer token123")
    .setRequestBody(requestBody)
    .perform();

// Authentication
api.get("https://api.example.com/protected")
    .setAuthentication("username", "password", "basic")
    .perform();
```

### Response Validation

```java
// Status code validation
api.verifyThatResponse()
    .statusCode().isEqualTo(200)
    .perform();

// Response body validation
api.verifyThatResponse()
    .body().contains("expected text")
    .perform();

// JSON path extraction and validation
api.assertThatResponse()
    .extractedJsonValue("$.data.id")
    .isEqualTo("123")
    .perform();

// Response time validation
api.verifyThatResponse()
    .time().isLessThan(1000)  // milliseconds
    .perform();

// Header validation
api.verifyThatResponse()
    .header("Content-Type").contains("application/json")
    .perform();
```

### Working with JSON

```java
// Extract value from JSON response
String userId = api.getResponseJSONValue("id");
String email = api.getResponseJSONValue("user.email");

// Extract array values
List<String> names = api.getResponseJSONValueAsList("users[*].name");
```

---

## Step 6: Authentication

### Basic Authentication

```java
api.get("https://api.example.com/resource")
    .setAuthentication("username", "password", "basic")
    .perform();
```

### Bearer Token

```java
api.get("https://api.example.com/resource")
    .setRequestHeader("Authorization", "Bearer " + token)
    .perform();
```

### OAuth 2.0

```java
// First, get the token
api.post("https://api.example.com/oauth/token")
    .setParameter("grant_type", "client_credentials")
    .setParameter("client_id", "your_client_id")
    .setParameter("client_secret", "your_client_secret")
    .perform();

String token = api.getResponseJSONValue("access_token");

// Then use it
api.get("https://api.example.com/resource")
    .setRequestHeader("Authorization", "Bearer " + token)
    .perform();
```

---

## Step 7: Data-Driven Testing

### Using Test Data Files

Create: `src/test/resources/testData/users.json`

```json
{
  "users": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

Use in tests:

```java
@Test
public void testWithDataFile() {
    SHAFT.TestData.JSON testData = new SHAFT.TestData.JSON("testData/users.json");
    String name = testData.getTestData("users[0].name");
    String email = testData.getTestData("users[0].email");
    
    // Use in API call
    String requestBody = String.format("""
        {
            "name": "%s",
            "email": "%s"
        }
        """, name, email);
    
    userService.createUser(requestBody).perform();
}
```

---

## Step 8: Schema Validation

Validate JSON response against a schema:

```java
String jsonSchema = """
    {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "email": {"type": "string", "format": "email"}
        },
        "required": ["id", "name", "email"]
    }
    """;

api.verifyThatResponse()
    .matchesSchema(jsonSchema)
    .perform();
```

---

## Step 9: Run Your Tests

### Using IntelliJ IDEA

1. Right-click on test class or method
2. Select **Run**
3. View results in the Run panel

### Using Maven

```bash
mvn clean test
```

### View Allure Report

```bash
mvn allure:serve
```

The report will show all API requests/responses with detailed logging.

---

## Best Practices

1. **Use Service Classes**: Encapsulate API endpoints in service classes
2. **Reuse Request Bodies**: Store common request payloads as constants or in data files
3. **Validate Thoroughly**: Check status codes, response time, headers, and body
4. **Use Schema Validation**: Ensure response structure doesn't break
5. **Test Error Scenarios**: Don't just test happy paths
6. **Clean Up Test Data**: Delete created resources in @AfterMethod or @AfterClass

---

## Troubleshooting

### Issue: Connection timeout

**Solution:** Increase timeout in custom.properties:
```properties
apiSocketTimeout=60000
```

### Issue: SSL certificate errors

**Solution:** For testing environments only:
```java
api.setRelaxedHTTPSValidation();
```

### Issue: JSON parsing errors

**Solution:** Verify the response is valid JSON. Check `api.getResponseBody()` to see raw response.

---

## What's Next?

✅ **You've set up your API automation project!**

Continue your journey:

- 📚 [Learn API Request Builder](../Keywords/API/Request_Builder)
- 🔍 [Master Response Validations](../Keywords/API/Response_Validations)
- ⚙️ [Configure API Properties](../Properties/PropertiesList#api)
- 🔌 [Add Integrations](./integrations)
- 💬 [Join our Community](./support)

---

[← Back to Getting Started](./first_steps) | [Web Projects →](./setup_web) | [Mobile Projects →](./setup_mobile)
