---
id: setup_api
title: Setup API Testing Project
sidebar_label: API Setup
---

## Setting up an API Testing Project

This guide walks you through setting up a new SHAFT project for API testing using RestAssured.

### Using IntelliJ IDEA (Recommended)

1. Open IntelliJ IDEA and select **New Project**
2. Select **Maven Archetype** from the left panel
3. Click **Add Archetype** and enter these details:
   ```text
   GroupId: io.github.shafthq
   ArtifactId: testng-archetype
   Version: (use the latest version from releases)
   ```
   :::info[**Latest Version**]
   Check **[the latest SHAFT_Engine: TestNG Archetype version](https://github.com/ShaftHQ/testng-archetype/releases/latest)** and use that version number.
   :::

4. Select the archetype you just added and click **Next**
5. Enter your project details:
   - **GroupId**: Your organization/group ID (e.g., `com.mycompany`)
   - **ArtifactId**: Your project name (e.g., `api-automation-tests`)
6. Click **Create**

### Using Command Line

```shell
mvn archetype:generate "-DarchetypeGroupId=io.github.shafthq" "-DarchetypeArtifactId=testng-archetype" "-DarchetypeVersion=LATEST_VERSION" "-DinteractiveMode=false" "-DgroupId=com.mycompany" "-DartifactId=api-automation-tests"
```

:::info[**Customize**]
- Replace `LATEST_VERSION` with **[the latest version](https://github.com/ShaftHQ/testng-archetype/releases/latest)**
- Replace `com.mycompany` and `api-automation-tests` with your desired values
:::

### Essential Properties for API Testing

Create or update `src/main/resources/properties/custom.properties`:

```properties
# Target platform
targetPlatform=API

# API configuration
baseURL=https://api.example.com

# Timeouts
apiSocketTimeout=30000
apiConnectionTimeout=30000
apiConnectionManagerTimeout=30000

# Swagger validation (optional)
swagger.validation.enabled=true
swagger.validation.url=https://api.example.com/swagger.json
```

### Your First API Test

Here's a simple example of an API test using SHAFT:

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class ApiTests {
    private SHAFT.API api;
    
    @BeforeClass
    public void setup() {
        api = new SHAFT.API("https://jsonplaceholder.typicode.com");
    }
    
    @Test
    public void testGetRequest() {
        api.get("/posts/1")
           .perform();
           
        api.verifyThatResponse()
           .extractedJsonValue("$.userId")
           .isEqualTo("1")
           .perform();
    }
    
    @Test
    public void testPostRequest() {
        String requestBody = """
            {
                "title": "Test Post",
                "body": "Test Body",
                "userId": 1
            }
            """;
            
        api.post("/posts")
           .setRequestBody(requestBody)
           .setContentType("application/json")
           .perform();
           
        api.verifyThatResponse()
           .statusCode()
           .isEqualTo(201)
           .perform();
    }
}
```

### Run Your API Tests

```shell
mvn test
```

Or run from IntelliJ IDEA by right-clicking on the test class and selecting **Run**.

### Next Steps

- Review the [API Request Builder](/docs/Keywords/API/Request_Builder) documentation
- Learn about [API Response Getters](/docs/Keywords/API/Response_Getters)
- Check out [API Response Validations](/docs/Keywords/API/Response_Validations)
- Explore [API Properties](/docs/Properties/PropertiesList#api)

---

**Ready for the next step?** 
- [View Support & Community →](/docs/Getting_Started/support)
- [View All Integrations →](/docs/Getting_Started/integrations)
- [Back to Mobile Setup ←](/docs/Getting_Started/setup_mobile)
