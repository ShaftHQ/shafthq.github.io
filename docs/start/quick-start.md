---
id: quick-start
title: Quick start
description: Create and run a SHAFT project, then choose the right testing surface.
slug: /start/quick-start
sidebar_position: 3
tags: [quick-start, example]
---

# Quick start

Get started with SHAFT Engine in minutes. The correct path depends on whether
you are creating a project or upgrading one.

## Create a new project

> [!TIP]
> The SHAFT Project Generator is the only recommended way to create a new
> project.

- The fastest way to create a new SHAFT project with your preferred test runner and platform.
- Use the embedded [SHAFT Project Generator](/docs/start/installation) to generate your project in seconds.
- Choose your test runner (TestNG, JUnit, or Cucumber), select your platform (Web, Mobile, or API), and download a ready-to-use project.
- Optionally includes GitHub Actions workflow and Dependabot configuration.

## Upgrade an existing project

> [!TIP]
> The automated upgrade tool is the only recommended way to migrate Selenium,
> Appium, REST Assured, or older SHAFT projects to the latest modular SHAFT
> release.

Run the transactional `upgrade_to_modular_shaft.py` script from the
[upgrade guide](/docs/start/upgrade)
from the existing project:

```bash
python3 upgrade_to_modular_shaft.py --project .
```

The script resolves the latest modular SHAFT release, imports `shaft-bom`, adds
`shaft-engine`, scans legacy projects for optional BrowserStack, visual, and
desktop-video modules, and runs Maven `test-compile`. If compilation fails, it
restores all changed files. An optional `OPENAI_API_KEY` enables up to three
constrained repair-and-recompile attempts before rollback.

Read the complete
[automated upgrade and rollback guide](/docs/start/upgrade) before
running it on a production repository.

## Create your first tests

### TestNG

- Create a new Package ```testPackage``` under ```src/test/java```
- Create a new Java class ```TestClass``` under your newly created `testPackage`.
- Copy the below imports into your newly created `TestClass` after the line that contains `package testPackage`.

```java
import com.shaft.driver.SHAFT;
import com.shaft.gui.internal.locator.Locator;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
```

- Copy the below code snippet into the body of your `TestClass` after the line that contains `public class TestClass {`.

```java
SHAFT.GUI.WebDriver driver;
SHAFT.TestData.JSON testData;

String targetUrl = "https://duckduckgo.com/";

By logo = By.xpath("//div[contains(@class,'container_fullWidth__1H_L8')]//img");
By searchBox = Locator.hasAnyTagName().hasAttribute("name", "q").build(); // synonym to By.name("q");
By firstSearchResult = Locator.hasTagName("article").isFirst().build(); // synonym to By.xpath("(//article)[1]");

@Test
public void navigateToDuckDuckGoAndAssertBrowserTitleIsDisplayedCorrectly() {
  driver.browser().navigateToURL(targetUrl)
          .and().assertThat().title().contains(testData.get("expectedTitle"));
}

@Test
public void navigateToDuckDuckGoAndAssertLogoIsDisplayedCorrectly() {
  driver.browser().navigateToURL(targetUrl)
          .and().element().assertThat(logo).matchesReferenceImage();
}

@Test
public void searchForQueryAndAssert() {
  driver.browser().navigateToURL(targetUrl)
          .and().element().type(searchBox, testData.get("searchQuery") + Keys.ENTER)
          .and().assertThat(firstSearchResult).text().doesNotEqual(testData.get("unexpectedInFirstResult"));
}

@BeforeClass
public void beforeClass() {
  testData = new SHAFT.TestData.JSON("simpleJSON.json");
}

@BeforeMethod
public void beforeMethod() {
  driver = new SHAFT.GUI.WebDriver();
}

@AfterMethod
public void afterMethod(){
  driver.quit();
}
```

### JUnit 5

- Create a new Package ```testPackage``` under ```src/test/java```
- Create a new Java class ```TestClass``` under your newly created `testPackage`.
- SHAFT-generated JUnit projects enable the SHAFT listener and extension through
  `src/test/resources/junit-platform.properties`. Existing projects should keep
  `junit.jupiter.extensions.autodetection.enabled=true` in that file.
- Copy the below imports into your newly created `TestClass` after the line that contains `package testPackage`.

```java
import com.shaft.driver.SHAFT;
import com.shaft.gui.internal.locator.Locator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
```

- Copy the below code snippet into the body of your `TestClass` after the line that contains `public class TestClass {`.

```java
private SHAFT.GUI.WebDriver driver;
private static SHAFT.TestData.JSON testData;

String targetUrl = "https://duckduckgo.com/";

By logo = By.xpath("//div[contains(@class,'container_fullWidth__1H_L8')]//img");
By searchBox = Locator.hasAnyTagName().hasAttribute("name", "q").build(); // synonym to By.name("q");
By firstSearchResult = Locator.hasTagName("article").isFirst().build(); // synonym to By.xpath("(//article)[1]");

@Test
public void navigateToDuckDuckGoAndAssertBrowserTitleIsDisplayedCorrectly() {
  driver.browser().navigateToURL(targetUrl)
          .and().assertThat().title().contains(testData.get("expectedTitle"));
}

@Test
public void navigateToDuckDuckGoAndAssertLogoIsDisplayedCorrectly() {
  driver.browser().navigateToURL(targetUrl)
          .and().element().assertThat(logo).matchesReferenceImage();
}

@Test
public void searchForQueryAndAssert() {
  driver.browser().navigateToURL(targetUrl)
          .and().element().type(searchBox, testData.get("searchQuery") + Keys.ENTER)
          .and().assertThat(firstSearchResult).text().doesNotEqual(testData.get("unexpectedInFirstResult"));
}

@BeforeAll
public static void beforeAll() {
  testData = new SHAFT.TestData.JSON("simpleJSON.json");
}

@BeforeEach
public void beforeEach() {
  driver = new SHAFT.GUI.WebDriver();
}

@AfterEach
public void afterEach(){
  driver.quit();
}
```

### Cucumber

- Create the following directory structure: ```src/test/java/cucumberTestRunner``` and ```src/test/java/customCucumberSteps```
- Create a new Java class ```CucumberTests.java``` under `cucumberTestRunner`.
- Copy the below code into your `CucumberTests.java`:

```java
package cucumberTestRunner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import org.testng.annotations.Listeners;

@Listeners({com.shaft.listeners.TestNGListener.class})
public class CucumberTests extends AbstractTestNGCucumberTests {
}
```

- Create a new Java class ```StepDefinitions.java``` under `customCucumberSteps`.
- Copy the below code into your `StepDefinitions.java`:

```java
package customCucumberSteps;

import com.shaft.driver.SHAFT;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;

public class StepDefinitions {
    private SHAFT.GUI.WebDriver driver;
    private SHAFT.TestData.JSON testData;
    
    @Given("I open the target browser")
    public void i_open_the_target_browser() {
        driver = new SHAFT.GUI.WebDriver();
        testData = new SHAFT.TestData.JSON("simpleJSON.json");
    }
    
    @When("I navigate to {string}")
    public void i_navigate_to(String url) {
        driver.browser().navigateToURL(url);
    }
    
    @When("I search for {string}")
    public void i_search_for(String query) {
        By searchBox = By.name("q");
        driver.element().type(searchBox, query + Keys.ENTER);
    }
    
    @Then("I should see the page title contains {string}")
    public void i_should_see_the_page_title_contains(String expectedTitle) {
        driver.assertThat().browser().title().contains(expectedTitle).perform();
    }
    
    @Then("I close the browser")
    public void i_close_the_browser() {
        driver.quit();
    }
}
```

- Create the following directory: ```src/test/resources/features```
- Create a new file ```search.feature``` under `features` directory:

```gherkin
Feature: Search functionality

  Scenario: Verify DuckDuckGo search
    Given I open the target browser
    When I navigate to "https://duckduckgo.com/"
    Then I should see the page title contains "DuckDuckGo"
    When I search for "SHAFT_Engine"
    Then I close the browser
```

> [!TIP]
> In case you are planning to use Cucumber with IntelliJ IDEA, due to a known issue with IntelliJ you need to edit your run configuration template before running your tests by following these steps:
> <br/>- Open 'Edit Run/Debug Configurations' dialog > Edit Configurations... > Edit configuration templates...
> <br/>- Select <b>Cucumber Java</b> > Program Arguments > and add this argument:
> <br/>`--plugin com.shaft.listeners.CucumberFeatureListener`
> <br/>- After saving the changes, remember to delete any old runs you may have triggered by mistake before adding the needed config.


### Manage test data
- Create the following file ```src/test/resources/testDataFiles/simpleJSON.json```.
- Copy the below code snippet into your newly created json file.
```json
{
  "searchQuery": "SHAFT_Engine",
  "expectedTitle": "DuckDuckGo",
  "unexpectedInFirstResult": "Nope"
}
```

### Run tests
- Run your ```TestClass.java``` either from the side menu or by pressing the run button.
- On the first test run: 
  - SHAFT will create a new folder ```src/main/resources/properties``` and generate some default properties files.
  - SHAFT will run in `minimalistic test run` mode and will self-configure its listeners under the `src/test/resources/META-INF/services` directory.
> [!NOTE]
> In case you get the following error message when trying to execute your first run:
> 
> ![image](https://github.com/user-attachments/assets/6b894234-e365-4fdd-a1d2-abd06ead7e98)
> 
> And you don't see the option ```Shorten the command line and rerun```:
>  - From Intellij IDEA main menu, go to Help/Edit Custom VM Options
>  - Add the following line and click save ```-Didea.dynamic.classpath=true```
>  - Restart IntelliJ to apply the changes

> [!TIP]
> Use the [properties reference](/docs/reference/properties/PropertiesList) to
> configure SHAFT.
- On all following test runs:
  - After the run is complete, the Allure execution report will open automatically in your default web browser.
- <b>Join</b> our ![GitHub Repo stars](https://img.shields.io/github/stars/shafthq/shaft_engine?logoColor=black&style=social) to get notified by email when a new release is pushed out.
> [!NOTE]
> After upgrading your Engine to a new major release it is sometimes recommended to delete the properties
> folder ```src\main\resources\properties``` and allow SHAFT to regenerate the defaults by running any test method.

## Optional modular integrations

The TestNG, JUnit, and Cucumber web samples call a reference-image assertion,
so their POMs include `shaft-visual`:

```java
driver.browser().navigateToURL(targetUrl)
        .and().element().assertThat(logo).matchesReferenceImage();
```

This method, its engine overloads, negative reference-image assertions, and
image-path touch actions require `shaft-visual`. Ordinary screenshots,
highlighted report screenshots, API tests, Appium locator actions, database
tests, and CLI tests need only `shaft-engine`.

Add `shaft-browserstack` only for BrowserStack SDK interception/orchestration;
direct BrowserStack sessions work through `shaft-engine`. Add `shaft-video`
only for local non-headless desktop recording; Appium-native recording remains
in `shaft-engine`. Add `shaft-heal` and set
`healing.strategy=shaft-heal` only when deterministic web locator recovery is
required. See the [SHAFT Heal guide](/docs/agentic/heal).

Use the [module selection and migration guide](/docs/start/upgrade)
for the complete method matrix.

For a no-AI browser-recording workflow, use the `shaft-mcp` installer or put the
thin JAR and runtime dependencies on `MCP_CP`, then run:

```bash
MCP_MAIN="com.shaft.mcp.ShaftMcpApplication"
java -cp "$MCP_CP" "$MCP_MAIN" capture start \
  --url https://example.test --browser chrome \
  --output recordings/example.json --headless
java -cp "$MCP_CP" "$MCP_MAIN" capture stop
java -cp "$MCP_CP" "$MCP_MAIN" capture generate \
  --session recordings/example.json \
  --output-dir generated-tests --replay
```

See the [SHAFT Pilot guide](/docs/agentic/pilot) for Doctor analysis, reviewed
repairs, MCP clients, optional provider configuration, privacy controls, and
troubleshooting.

---

[Overview](/docs/start/overview) · [Features](/docs/features/modules)
