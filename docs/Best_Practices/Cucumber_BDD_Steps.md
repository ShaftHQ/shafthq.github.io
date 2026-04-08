---
id: Cucumber_BDD_Steps
title: Built-in Cucumber BDD Step Definitions
sidebar_label: Cucumber BDD Steps
description: "Use SHAFT Engine's 500+ pre-built Gherkin step definitions for browser, element, and assertion steps — integrate Cucumber without writing boilerplate glue code."
keywords: [SHAFT, Cucumber, BDD, Gherkin, step definitions, feature file, CucumberTestRunner, com.shaft.cucumber]
tags: [best-practices, cucumber, bdd, gherkin]
---

SHAFT Engine ships with **500+ pre-built Gherkin step definitions** covering browser navigation, element actions, and assertions. You can write feature files and start running BDD tests immediately — without authoring glue code from scratch.

:::tip
This page describes how to **use Cucumber with SHAFT**. If you prefer a simpler BDD approach without `.feature` files, see [BDD-Style Reports with Allure Annotations](BDD_Style_Reports).
:::

---

## Maven Dependency

Add the SHAFT Cucumber integration dependency to your `pom.xml`:

```xml title="pom.xml"
<dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>SHAFT_ENGINE</artifactId>
    <!-- Use your current SHAFT version -->
</dependency>
```

SHAFT's built-in Cucumber steps are included in the core engine — no separate artifact is required.

---

## Test Runner Setup

Create a runner class using JUnit Platform Suite:

```java title="CucumberTestRunner.java"
import org.junit.platform.suite.api.*;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(
    key = "cucumber.glue",
    value = "com.shaft.cucumber,your.steps.package"
)
@ConfigurationParameter(
    key = "cucumber.plugin",
    value = "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"
)
public class CucumberTestRunner { }
```

:::info
Always include **both** `com.shaft.cucumber` (SHAFT's built-in steps) and your own steps package in the `cucumber.glue` value. Separate them with a comma.
:::

---

## Feature File Examples

### Browser Navigation and Element Interaction

```gherkin title="login.feature"
Feature: User Login

  Scenario: Successful login with valid credentials
    Given I open the target browser
    When I navigate to "https://example.com/login"
    And I type "testuser" into the element found by "id" "username"
    And I type "password123" into the element found by "id" "password"
    And I click the element found by "id" "loginBtn"
    Then I assert that the "title" attribute of the browser, equals "Dashboard"
    And I assert that the element found by "id" "welcomeMsg", exists
```

### Assertions and Validations

```gherkin title="profile.feature"
Feature: User Profile

  Scenario: Profile page displays correct user information
    Given I open the target browser
    And I navigate to "https://example.com/profile"
    Then I assert that the element found by "id" "fullName", text contains "John Doe"
    And I assert that the element found by "id" "email", text equals "john@example.com"
    And I assert that the element found by "id" "role", is visible
    And I close the current browser
```

---

## Available Step Packages

SHAFT's built-in steps are organised into the following packages under `com.shaft.cucumber`:

| Package | Steps Provided |
|---|---|
| `BrowserSteps` | Open/close browser, navigation, URL and title assertions |
| `ElementSteps` | Type, click, select, scroll, hover, drag-and-drop |
| `AssertionSteps` | Assert element existence, visibility, text, and attributes |
| `AlertSteps` | Accept, dismiss, and interact with browser alerts |
| `APISteps` | Send requests and validate responses in Gherkin |

---

## Adding Custom Step Definitions

Create your own step definitions in a separate package and include it in `cucumber.glue`:

```java title="CustomSteps.java"
package your.steps.package;

import com.shaft.driver.SHAFT;
import io.cucumber.java.en.*;
import org.openqa.selenium.By;

public class CustomSteps {
    private SHAFT.GUI.WebDriver driver;

    @Given("I am logged in as {string}")
    public void loginAs(String username) {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://example.com/login");
        driver.element()
            .type(By.id("username"), username)
            .type(By.id("password"), "defaultPassword")
            .click(By.id("loginBtn"));
    }

    @Then("I should see the dashboard")
    public void verifyDashboard() {
        driver.assertThat().browser().url().contains("/dashboard").perform();
    }
}
```

---

:::warning
Do not remove `com.shaft.cucumber` from the `cucumber.glue` configuration. Removing it disables all of SHAFT's built-in steps and will cause step-not-found errors.
:::

:::note
Allure reporting for Cucumber is enabled by adding `io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm` to `cucumber.plugin`. This produces the same rich Allure report as non-Cucumber SHAFT tests.
:::
