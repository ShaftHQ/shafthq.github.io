---
id: junit5_setup
title: JUnit5 Setup Guide
sidebar_label: JUnit5 Setup
---

# JUnit5 Integration with SHAFT_Engine

This guide will help you set up SHAFT with JUnit5 for your test automation projects.

## Prerequisites

- Java 11 or higher
- Maven 3.6+ or Gradle 6+
- IDE with JUnit5 support (IntelliJ IDEA, Eclipse, VS Code)

## Maven Dependencies

Add the following dependencies to your `pom.xml`:

```xml showLineNumbers title="pom.xml"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>shaft-junit5-tests</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <shaft.version>8.2.20241201</shaft.version>
        <junit.version>5.10.1</junit.version>
    </properties>
    
    <dependencies>
        <!-- SHAFT Engine -->
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>SHAFT_ENGINE</artifactId>
            <version>${shaft.version}</version>
        </dependency>
        
        <!-- JUnit5 Dependencies -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        
        <!-- Optional: JUnit5 Parameterized Tests -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-params</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <!-- Maven Surefire Plugin for JUnit5 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*Tests.java</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Gradle Dependencies

Add the following to your `build.gradle`:

```gradle showLineNumbers title="build.gradle"
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '11'

repositories {
    mavenCentral()
}

dependencies {
    // SHAFT Engine
    testImplementation 'io.github.shafthq:SHAFT_ENGINE:8.2.20241201'
    
    // JUnit5 Dependencies
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.1'
    testImplementation 'org.junit.jupiter:junit-jupiter-params:5.10.1'
}

test {
    useJUnitPlatform()
    
    // Optional: Configure test execution
    testLogging {
        events "passed", "skipped", "failed"
    }
}
```

## Basic Test Class Structure

### Simple Web Test Example

```java showLineNumbers title="src/test/java/tests/BasicWebTest.java"
package tests;

import SHAFT.GUI.WebDriver;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

@DisplayName("Basic Web Tests with SHAFT and JUnit5")
public class BasicWebTest {
    
    private WebDriver driver;
    
    @BeforeEach
    @DisplayName("Setup WebDriver before each test")
    void setUp() {
        driver = new WebDriver();
    }
    
    @Test
    @DisplayName("Verify GitHub SHAFT Engine page title")
    void testGitHubPageTitle() {
        driver.browser().navigateToURL("https://github.com/ShaftHQ/SHAFT_ENGINE")
              .and().assertThat().title().contains("SHAFT_ENGINE").perform();
    }
    
    @Test
    @DisplayName("Navigate to documentation and verify content")
    void testDocumentationNavigation() {
        driver.browser().navigateToURL("https://shafthq.github.io/")
              .and().element().click(By.linkText("Docs"))
              .and().assertThat(By.tagName("h1")).text().isEqualTo("First Steps").perform();
    }
    
    @Test
    @DisplayName("Search functionality test")
    void testSearchFunctionality() {
        driver.browser().navigateToURL("https://github.com/ShaftHQ/SHAFT_ENGINE")
              .and().element().type(By.name("q"), "selenium automation")
              .and().element().keyPress(By.name("q"), "ENTER")
              .and().assertThat().url().contains("search").perform();
    }
    
    @AfterEach
    @DisplayName("Cleanup WebDriver after each test")
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

### API Testing Example

```java showLineNumbers title="src/test/java/tests/APITest.java"
package tests;

import SHAFT.API.RestActions;
import org.junit.jupiter.api.*;

@DisplayName("API Tests with SHAFT and JUnit5")
public class APITest {
    
    private RestActions api;
    
    @BeforeEach
    void setUp() {
        api = new RestActions("https://jsonplaceholder.typicode.com");
    }
    
    @Test
    @DisplayName("Verify GET request returns valid user data")
    void testGetUser() {
        api.buildNewRequest("/users/1", RestActions.RequestType.GET)
           .performRequest()
           .assertThatResponse().body().contains("Leanne Graham")
           .and().assertThatResponse().statusCode().isEqualTo(200).perform();
    }
    
    @Test
    @DisplayName("Verify POST request creates new user")
    void testCreateUser() {
        String userData = """
            {
                "name": "Test User",
                "username": "testuser",
                "email": "test@example.com"
            }
            """;
            
        api.buildNewRequest("/users", RestActions.RequestType.POST)
           .setRequestBody(userData)
           .setContentType("application/json")
           .performRequest()
           .assertThatResponse().statusCode().isEqualTo(201)
           .and().assertThatResponse().body().contains("Test User").perform();
    }
}
```

## Parameterized Tests

JUnit5 provides excellent support for parameterized tests, which work seamlessly with SHAFT:

```java showLineNumbers title="src/test/java/tests/ParameterizedTest.java"
package tests;

import SHAFT.GUI.WebDriver;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import org.openqa.selenium.By;
import java.util.stream.Stream;

@DisplayName("Parameterized Tests with SHAFT and JUnit5")
public class ParameterizedWebTest {
    
    private WebDriver driver;
    
    @BeforeEach
    void setUp() {
        driver = new WebDriver();
    }
    
    @ParameterizedTest(name = "Search for ''{0}'' on GitHub")
    @ValueSource(strings = {"selenium", "automation", "testing", "java"})
    @DisplayName("Search with different keywords")
    void testSearchWithDifferentKeywords(String searchTerm) {
        driver.browser().navigateToURL("https://github.com")
              .and().element().type(By.name("q"), searchTerm)
              .and().element().keyPress(By.name("q"), "ENTER")
              .and().assertThat().url().contains("search")
              .and().assertThat().url().contains(searchTerm).perform();
    }
    
    @ParameterizedTest(name = "Test browser navigation to {0}")
    @CsvSource({
        "https://github.com, GitHub",
        "https://stackoverflow.com, Stack Overflow",
        "https://selenium.dev, Selenium"
    })
    @DisplayName("Navigate to different websites")
    void testMultipleWebsites(String url, String expectedTitle) {
        driver.browser().navigateToURL(url)
              .and().assertThat().title().contains(expectedTitle).perform();
    }
    
    @ParameterizedTest
    @MethodSource("userCredentialsProvider")
    @DisplayName("Login with different user credentials")
    void testLoginWithDifferentCredentials(String username, String password, boolean shouldSucceed) {
        driver.browser().navigateToURL("https://example.com/login")
              .and().element().type(By.id("username"), username)
              .and().element().type(By.id("password"), password)
              .and().element().click(By.id("loginButton"));
              
        if (shouldSucceed) {
            driver.assertThat().url().contains("dashboard").perform();
        } else {
            driver.assertThat(By.className("error")).text().contains("Invalid").perform();
        }
    }
    
    static Stream<Arguments> userCredentialsProvider() {
        return Stream.of(
            Arguments.of("validuser", "validpass", true),
            Arguments.of("invaliduser", "wrongpass", false),
            Arguments.of("", "", false)
        );
    }
    
    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

## Test Lifecycle and Hooks

JUnit5 provides comprehensive lifecycle management that integrates well with SHAFT:

```java showLineNumbers title="src/test/java/tests/TestLifecycleExample.java"
package tests;

import SHAFT.GUI.WebDriver;
import org.junit.jupiter.api.*;

@DisplayName("Test Lifecycle Management")
public class TestLifecycleExample {
    
    private static WebDriver staticDriver;
    private WebDriver instanceDriver;
    
    @BeforeAll
    @DisplayName("One-time setup for all tests")
    static void setUpAll() {
        // Global setup - runs once before all tests
        System.out.println("Setting up test environment...");
        // You can set global properties here
        System.setProperty("shaft.properties.path", "src/test/resources/properties");
    }
    
    @BeforeEach
    @DisplayName("Setup before each test")
    void setUp(TestInfo testInfo) {
        System.out.println("Starting test: " + testInfo.getDisplayName());
        instanceDriver = new WebDriver();
        
        // Optional: Configure driver based on test annotations
        if (testInfo.getTags().contains("headless")) {
            // Configure for headless execution
            System.setProperty("headlessExecution", "true");
        }
    }
    
    @Test
    @Tag("smoke")
    @DisplayName("Smoke test for main functionality")
    void smokeTest() {
        instanceDriver.browser().navigateToURL("https://shafthq.github.io/")
                     .and().assertThat().title().contains("SHAFT").perform();
    }
    
    @Test
    @Tag("headless")
    @DisplayName("Test that runs in headless mode")
    void headlessTest() {
        instanceDriver.browser().navigateToURL("https://github.com/ShaftHQ/SHAFT_ENGINE")
                     .and().assertThat().url().contains("SHAFT_ENGINE").perform();
    }
    
    @AfterEach
    @DisplayName("Cleanup after each test")
    void tearDown(TestInfo testInfo) {
        if (instanceDriver != null) {
            instanceDriver.quit();
        }
        System.out.println("Completed test: " + testInfo.getDisplayName());
    }
    
    @AfterAll
    @DisplayName("Final cleanup after all tests")
    static void tearDownAll() {
        System.out.println("All tests completed. Cleaning up environment...");
        if (staticDriver != null) {
            staticDriver.quit();
        }
    }
}
```

## Configuration and Properties

Create a properties file for SHAFT configuration:

```properties showLineNumbers title="src/test/resources/properties/custom.properties"
# Browser Configuration
targetBrowserName=CHROME
headlessExecution=false

# Execution Configuration
baseURL=https://shafthq.github.io/
retryMaximumNumberOfAttempts=2

# Reporting Configuration
createAnimatedGif=true
videoParams_recordVideo=false

# Wait Configuration
defaultElementIdentificationTimeout=10
pageLoadTimeout=30

# JUnit5 specific configurations
# Enable/disable automatic screenshots on test failure
automaticallyGenerateAllureReport=true
```

## Advanced Features

### Conditional Test Execution

```java showLineNumbers title="src/test/java/tests/ConditionalTests.java"
package tests;

import SHAFT.GUI.WebDriver;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.*;

@DisplayName("Conditional Test Execution")
public class ConditionalTests {
    
    private WebDriver driver;
    
    @BeforeEach
    void setUp() {
        driver = new WebDriver();
    }
    
    @Test
    @EnabledOnOs(OS.WINDOWS)
    @DisplayName("Test that runs only on Windows")
    void windowsOnlyTest() {
        driver.browser().navigateToURL("https://microsoft.com")
              .and().assertThat().title().contains("Microsoft").perform();
    }
    
    @Test
    @EnabledOnJre(JRE.JAVA_11)
    @DisplayName("Test that runs only on Java 11")
    void java11OnlyTest() {
        // Test specific to Java 11 features
        driver.browser().navigateToURL("https://openjdk.java.net/")
              .and().assertThat().title().contains("OpenJDK").perform();
    }
    
    @Test
    @EnabledIf("isHeadlessEnabled")
    @DisplayName("Test that runs only in headless mode")
    void headlessOnlyTest() {
        driver.browser().navigateToURL("https://example.com")
              .and().assertThat().url().contains("example").perform();
    }
    
    boolean isHeadlessEnabled() {
        return "true".equals(System.getProperty("headlessExecution"));
    }
    
    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

### Custom Test Extensions

```java showLineNumbers title="src/test/java/extensions/ScreenshotExtension.java"
package extensions;

import SHAFT.GUI.WebDriver;
import org.junit.jupiter.api.extension.*;

public class ScreenshotExtension implements TestWatcher {
    
    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        // Take screenshot on test failure
        WebDriver driver = getDriverFromContext(context);
        if (driver != null) {
            // SHAFT automatically handles screenshots, but you can add custom logic here
            System.out.println("Test failed: " + context.getDisplayName());
            System.out.println("Screenshot captured automatically by SHAFT");
        }
    }
    
    private WebDriver getDriverFromContext(ExtensionContext context) {
        // Implementation to get driver instance from test context
        // This is a simplified example
        return null;
    }
}
```

Use the extension in your tests:

```java
@ExtendWith(ScreenshotExtension.class)
@DisplayName("Tests with Screenshot Extension")
public class ExtendedTest {
    // Test implementation
}
```

## Running Tests

### Command Line Execution

```bash
# Run all tests
mvn clean test

# Run specific test class
mvn clean test -Dtest=BasicWebTest

# Run tests with specific tag
mvn clean test -Dgroups="smoke"

# Run tests in headless mode
mvn clean test -DheadlessExecution=true
```

### IDE Configuration

#### IntelliJ IDEA
1. Right-click on test class → "Run"
2. Use Test runner window for detailed results
3. Configure run configurations for different scenarios

#### Eclipse
1. Right-click on test class → "Run As" → "JUnit Test"
2. View results in JUnit view
3. Use launch configurations for custom settings

## Best Practices

### 1. Test Organization
- Use descriptive test class and method names
- Group related tests in the same class
- Use `@DisplayName` for clear test descriptions
- Organize tests with tags for easy filtering

### 2. Test Data Management
- Use parameterized tests for data-driven testing
- Store test data in external files (JSON, CSV)
- Use test-specific data to avoid dependencies

### 3. Assertions and Validations
- Use SHAFT's fluent assertion API
- Combine multiple assertions when logical
- Provide meaningful error messages

### 4. Resource Management
- Always clean up WebDriver instances in `@AfterEach`
- Use try-with-resources when applicable
- Handle exceptions gracefully

### 5. Test Independence
- Each test should be independent
- Avoid shared state between tests
- Use fresh data for each test

## Troubleshooting

### Common Issues

#### Tests not discovered by JUnit5
**Problem:** Tests are not being executed
**Solution:** Ensure you're using JUnit5 annotations (`@Test` from `org.junit.jupiter.api`) not JUnit4

#### WebDriver not closing properly
**Problem:** Browser instances remain open
**Solution:** Always use `@AfterEach` to close the driver

#### Properties not loading
**Problem:** SHAFT properties not being applied
**Solution:** Check properties file location and naming

#### Parallel execution issues
**Problem:** Tests interfering with each other
**Solution:** Configure parallel execution properly and ensure test independence

For more troubleshooting tips, visit the **[SHAFT Troubleshooting Guide](../Properties/PropertiesList)**.

## Next Steps

- Explore **[Advanced SHAFT Features](../Keywords/GUI/Element_Actions)**
- Learn about **[Mobile Testing with SHAFT](../Basic_Config/basicConfig2)**
- Check out **[API Testing capabilities](../Basic_Config/basicConfig3)**
- Read about **[Test Data Management](../Properties/PropertyTypes)**

---

:::tip[**Pro Tip**]
JUnit5's `@DisplayName` annotation works perfectly with SHAFT's reporting features to create clear, readable test reports that stakeholders can easily understand.
:::
