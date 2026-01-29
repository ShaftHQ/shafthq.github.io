---
id: setup_web_cucumber
title: Web Project with Cucumber
sidebar_label: Cucumber (BDD)
---

## 🟣 Setting Up a Web Project with Cucumber

This guide walks you through creating a SHAFT web automation project using **Cucumber** for Behavior-Driven Development (BDD).

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
    <artifactId>web-automation-cucumber</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <!-- Get latest version from https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE -->
        <shaft.version><!-- Check latest version --></shaft.version>
        <cucumber.version>7.15.0</cucumber.version>
    </properties>

    <dependencies>
        <!-- SHAFT Engine -->
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>SHAFT_ENGINE</artifactId>
            <version>${shaft.version}</version>
        </dependency>
        
        <!-- Cucumber -->
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-java</artifactId>
            <version>${cucumber.version}</version>
        </dependency>
        
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-testng</artifactId>
            <version>${cucumber.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <includes>
                        <include>**/TestRunner.java</include>
                    </includes>
                </configuration>
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
web-automation-cucumber/
├── src/
│   ├── main/
│   │   └── resources/
│   │       └── properties/
│   │           └── custom.properties
│   └── test/
│       ├── java/
│       │   └── com/mycompany/
│       │       ├── pages/         # Page Objects
│       │       ├── steps/         # Step Definitions
│       │       └── runners/       # Test Runners
│       └── resources/
│           └── features/          # Feature files (.feature)
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

## Step 4: Create Your First Feature

### Create a Feature File

Create: `src/test/resources/features/GoogleSearch.feature`

```gherkin
Feature: Google Search
  As a user
  I want to search on Google
  So that I can find information about SHAFT Engine

  Scenario: Search for SHAFT Engine
    Given I am on Google homepage
    When I search for "SHAFT Engine Test Automation"
    Then I should see "SHAFT" in the page title

  Scenario Outline: Search for multiple terms
    Given I am on Google homepage
    When I search for "<searchTerm>"
    Then I should see "<expectedText>" in the page title

    Examples:
      | searchTerm                       | expectedText |
      | SHAFT Engine Test Automation     | SHAFT        |
      | Selenium WebDriver               | Selenium     |
      | Test Automation Framework        | automation   |
```

---

## Step 5: Create Page Objects

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
    public GoogleHomePage navigateToGoogle() {
        driver.browser().navigateToURL("https://www.google.com");
        return this;
    }
    
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

---

## Step 6: Create Step Definitions

Create: `src/test/java/com/mycompany/steps/GoogleSearchSteps.java`

```java
package com.mycompany.steps;

import com.mycompany.pages.GoogleHomePage;
import com.shaft.driver.SHAFT;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class GoogleSearchSteps {
    private SHAFT.GUI.WebDriver driver;
    private GoogleHomePage googleHomePage;
    
    @Before
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
        googleHomePage = new GoogleHomePage(driver);
    }
    
    @Given("I am on Google homepage")
    public void iAmOnGoogleHomepage() {
        googleHomePage.navigateToGoogle();
    }
    
    @When("I search for {string}")
    public void iSearchFor(String searchTerm) {
        googleHomePage.search(searchTerm);
    }
    
    @Then("I should see {string} in the page title")
    public void iShouldSeeInThePageTitle(String expectedText) {
        googleHomePage.verifySearchResults(expectedText);
    }
    
    @After
    public void tearDown() {
        driver.quit();
    }
}
```

---

## Step 7: Create Test Runner

Create: `src/test/java/com/mycompany/runners/TestRunner.java`

```java
package com.mycompany.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.mycompany.steps",
    plugin = {
        "pretty",
        "html:target/cucumber-reports/cucumber.html",
        "json:target/cucumber-reports/cucumber.json"
    },
    monochrome = true
)
public class TestRunner extends AbstractTestNGCucumberTests {
}
```

---

## Step 8: Run Your Tests

### Using IntelliJ IDEA

1. Install the **Cucumber for Java** plugin (Settings → Plugins)
2. Right-click on `TestRunner.java` or a feature file
3. Select **Run**
4. View results in the Run panel

### Using Maven Command Line

```bash
mvn clean test
```

### View Reports

**Cucumber HTML Report:**
```bash
# Open target/cucumber-reports/cucumber.html in your browser
```

**Allure Report:**
```bash
mvn allure:serve
```

---

## Cucumber Concepts

### Feature Files
Written in **Gherkin** syntax, feature files describe test scenarios in natural language.

**Structure:**
- `Feature`: High-level description
- `Scenario`: Individual test case
- `Given`: Initial context
- `When`: Action/event
- `Then`: Expected outcome

### Step Definitions
Java methods that implement the steps from feature files.

**Annotations:**
- `@Given` - Setup/precondition
- `@When` - Action
- `@Then` - Assertion/verification
- `@And` / `@But` - Additional steps

### Parameters

**String Parameters:**
```gherkin
When I search for "SHAFT Engine"
```

```java
@When("I search for {string}")
public void iSearchFor(String searchTerm) {
    // Implementation
}
```

**Integer Parameters:**
```gherkin
Then I should see 5 results
```

```java
@Then("I should see {int} results")
public void iShouldSeeResults(int count) {
    // Implementation
}
```

---

## Advanced Cucumber Features

### Background

Run common steps before each scenario:

```gherkin
Feature: Google Search

  Background:
    Given I am on Google homepage

  Scenario: Search for SHAFT
    When I search for "SHAFT Engine"
    Then I should see "SHAFT" in the page title

  Scenario: Search for Selenium
    When I search for "Selenium"
    Then I should see "Selenium" in the page title
```

### Data Tables

Pass complex data to steps:

```gherkin
Scenario: Search with multiple criteria
  When I search with the following criteria:
    | Field    | Value                  |
    | Query    | SHAFT Engine          |
    | Language | English               |
    | Region   | Worldwide             |
  Then I should see relevant results
```

```java
@When("I search with the following criteria:")
public void iSearchWithCriteria(io.cucumber.datatable.DataTable dataTable) {
    Map<String, String> data = dataTable.asMap(String.class, String.class);
    String query = data.get("Query");
    // Use the data
}
```

### Tags

Organize and filter scenarios:

```gherkin
@smoke @regression
Scenario: Critical search test
  Given I am on Google homepage
  When I search for "SHAFT Engine"
  Then I should see "SHAFT" in the page title

@slow
Scenario: Performance test
  # This scenario takes longer
```

Run specific tags:
```java
@CucumberOptions(
    tags = "@smoke and not @slow"
)
```

---

## Parallel Execution

For parallel execution with Cucumber, update your TestNG configuration or use Cucumber parallel plugin.

### Option 1: TestNG Parallel

Create `testng.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Cucumber Suite" parallel="tests" thread-count="2">
    <test name="Test 1">
        <classes>
            <class name="com.mycompany.runners.TestRunner"/>
        </classes>
    </test>
</suite>
```

### Option 2: Cucumber Parallel Plugin

Add to `pom.xml`:
```xml
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-junit-platform-engine</artifactId>
    <version>7.15.0</version>
    <scope>test</scope>
</dependency>
```

---

## Best Practices

1. **Keep scenarios independent** - Each scenario should be able to run on its own
2. **Use meaningful step names** - Steps should read like natural language
3. **Reuse step definitions** - Don't duplicate steps across different files
4. **Keep feature files simple** - Focus on business logic, not implementation details
5. **Use Page Objects** - Separate test logic from page interactions

---

## Troubleshooting

### Issue: Undefined steps

**Solution:** Ensure step definitions match the Gherkin steps exactly. Use the snippets generated by Cucumber as a starting point.

### Issue: Glue not found

**Solution:** Check that the `glue` path in `@CucumberOptions` matches your step definitions package.

### Issue: Feature files not found

**Solution:** Verify the `features` path in `@CucumberOptions` points to the correct directory.

---

## What's Next?

✅ **You've created your first Web + Cucumber project!**

Continue your journey:

- 📚 [Learn Browser Actions](../Keywords/GUI/Browser_Actions)
- 🔍 [Master Element Identification](../Keywords/GUI/Element_Identification)
- ⚙️ [Configure Advanced Properties](../Properties/PropertiesList)
- 🔌 [Add Integrations](./integrations) (BrowserStack, Slack, etc.)
- 💬 [Join our Community](./support)

---

[← Back to Web Projects](./setup_web) | [TestNG Setup →](./setup_web_testng) | [JUnit 5 Setup →](./setup_web_junit5)
