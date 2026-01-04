---
id: setup_web_junit5
title: Web Project with JUnit 5
sidebar_label: JUnit 5
---

## 🔵 Setting Up a Web Project with JUnit 5

This guide walks you through creating a SHAFT web automation project using **JUnit 5 (Jupiter)** as the test runner.

---

## Step 1: Create Your Project

### Using IntelliJ IDEA

1. Create a new **Maven** project in IntelliJ IDEA

2. Update your `pom.xml` with the following dependencies:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany</groupId>
    <artifactId>web-automation-junit5</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <shaft.version><!-- Check latest version --></shaft.version>
    </properties>

    <dependencies>
        <!-- SHAFT Engine -->
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>SHAFT_ENGINE</artifactId>
            <version>${shaft.version}</version>
        </dependency>
        
        <!-- JUnit 5 -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.1</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.2</version>
            </plugin>
        </plugins>
    </build>
</project>
```

3. Get the latest SHAFT version from [Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE)

---

## Step 2: Project Structure

Create the following directory structure:

```
web-automation-junit5/
├── src/
│   ├── main/
│   │   └── resources/
│   │       └── properties/
│   │           └── custom.properties
│   └── test/
│       ├── java/
│       │   └── com/mycompany/
│       │       ├── pages/         # Page Objects
│       │       └── tests/         # Test Classes
│       └── resources/
│           └── testData/          # Test data files
└── pom.xml
```

---

## Step 3: Configure SHAFT Properties

Create `src/main/resources/properties/custom.properties`:

```properties
# Browser configuration
targetBrowserName=chrome
headlessExecution=false

# Timeouts
browserNavigationTimeout=60
elementIdentificationTimeout=5

# Reporting
alwaysTakePageSourceOnFailure=true
createAnimatedGif=true
```

---

## Step 4: Create Your First Test

### Create a Page Object

Create: `src/test/java/com/mycompany/pages/GoogleHomePage.java`

```java
package com.mycompany.pages;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class GoogleHomePage {
    private SHAFT.GUI.WebDriver driver;
    
    // Locators
    private By searchBox = By.name("q");
    private By searchButton = By.name("btnK");
    
    // Constructor
    public GoogleHomePage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }
    
    // Actions
    public GoogleHomePage search(String query) {
        driver.element().type(searchBox, query);
        driver.element().click(searchButton);
        return this;
    }
    
    // Validations
    public GoogleHomePage verifySearchResults(String expectedText) {
        driver.assertThat().browser().title().contains(expectedText).perform();
        return this;
    }
}
```

### Create a Test Class

Create: `src/test/java/com/mycompany/tests/GoogleSearchTest.java`

```java
package com.mycompany.tests;

import com.mycompany.pages.GoogleHomePage;
import com.shaft.driver.SHAFT;
import org.junit.jupiter.api.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GoogleSearchTest {
    private SHAFT.GUI.WebDriver driver;
    
    @Test
    @DisplayName("Search for SHAFT Engine on Google")
    @Order(1)
    public void searchForShaft() {
        // Navigate to Google
        driver.browser().navigateToURL("https://www.google.com");
        
        // Perform search
        new GoogleHomePage(driver)
            .search("SHAFT Engine Test Automation")
            .verifySearchResults("SHAFT");
    }
    
    @BeforeEach
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
    }
    
    @AfterEach
    public void tearDown() {
        driver.quit();
    }
}
```

---

## Step 5: JUnit 5 Annotations Explained

JUnit 5 uses different annotations than JUnit 4:

| JUnit 5 | JUnit 4 (Old) | Purpose |
|---------|---------------|---------|
| `@Test` | `@Test` | Marks a test method |
| `@BeforeEach` | `@Before` | Runs before each test method |
| `@AfterEach` | `@After` | Runs after each test method |
| `@BeforeAll` | `@BeforeClass` | Runs once before all tests in the class |
| `@AfterAll` | `@AfterClass` | Runs once after all tests in the class |
| `@DisplayName` | - | Custom test name for reports |
| `@Disabled` | `@Ignore` | Disable a test |

---

## Step 6: Run Your Tests

### Using IntelliJ IDEA

1. Right-click on the test class or test method
2. Select **Run 'GoogleSearchTest'**
3. View results in the Run panel

### Using Maven Command Line

```bash
mvn clean test
```

### View Allure Report

```bash
mvn allure:serve
```

---

## Advanced JUnit 5 Features

### Parameterized Tests

Test with multiple data sets:

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

@ParameterizedTest
@CsvSource({
    "SHAFT Engine, SHAFT",
    "Selenium, Selenium",
    "Test Automation, automation"
})
public void searchWithMultipleQueries(String query, String expectedText) {
    driver.browser().navigateToURL("https://www.google.com");
    new GoogleHomePage(driver)
        .search(query)
        .verifySearchResults(expectedText);
}
```

### Test Lifecycle

Control test execution with lifecycle hooks:

```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LifecycleTest {
    private SHAFT.GUI.WebDriver driver;
    
    @BeforeAll
    public void setUpOnce() {
        // Runs once before all tests
        System.out.println("Starting test suite");
    }
    
    @BeforeEach
    public void setUp() {
        // Runs before each test
        driver = new SHAFT.GUI.WebDriver();
    }
    
    @AfterEach
    public void tearDown() {
        // Runs after each test
        driver.quit();
    }
    
    @AfterAll
    public void tearDownOnce() {
        // Runs once after all tests
        System.out.println("Test suite completed");
    }
}
```

### Conditional Test Execution

Run tests conditionally:

```java
import org.junit.jupiter.api.condition.*;

@Test
@EnabledOnOs(OS.WINDOWS)
public void testOnWindowsOnly() {
    // Only runs on Windows
}

@Test
@EnabledIfEnvironmentVariable(named = "ENV", matches = "prod")
public void testInProdOnly() {
    // Only runs when ENV=prod
}
```

---

## Parallel Execution

Configure parallel execution in `junit-platform.properties` (create in `src/test/resources/`):

```properties
junit.jupiter.execution.parallel.enabled=true
junit.jupiter.execution.parallel.mode.default=concurrent
junit.jupiter.execution.parallel.config.strategy=fixed
junit.jupiter.execution.parallel.config.fixed.parallelism=4
```

---

## Troubleshooting

### Issue: Tests don't run

**Solution:** Ensure you're using `org.junit.jupiter.api.Test`, not the JUnit 4 annotation.

### Issue: @BeforeClass not working

**Solution:** JUnit 5 uses `@BeforeAll` instead. Make sure the method is static or use `@TestInstance(Lifecycle.PER_CLASS)`.

### Issue: Parallel tests interfere with each other

**Solution:** Use `ThreadLocal` for the driver:

```java
private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();

@BeforeEach
public void setUp() {
    driver.set(new SHAFT.GUI.WebDriver());
}

@Test
public void test() {
    driver.get().browser().navigateToURL("...");
}
```

---

## What's Next?

✅ **You've created your first Web + JUnit 5 project!**

Continue your journey:

- 📚 [Learn Browser Actions](../Keywords/GUI/Browser_Actions)
- 🔍 [Master Element Identification](../Keywords/GUI/Element_Identification)
- ⚙️ [Configure Advanced Properties](../Properties/PropertiesList)
- 🔌 [Add Integrations](./integrations) (BrowserStack, Slack, etc.)
- 💬 [Join our Community](./support)

---

[← Back to Web Projects](./setup_web) | [TestNG Setup →](./setup_web_testng) | [Cucumber Setup →](./setup_web_cucumber)
