---
id: Validations
title: Validations
sidebar_label: Validations
description: "SHAFT Engine's built-in assertions and verifications — browser, element, file, object, number, and API response validation, JSON schema validation, force fail, and soft vs hard assertion strategy."
keywords: [SHAFT, validations, assertions, verifications, overview, browser validations, element validations, text validation, attribute validation, visual testing, OpenCV, file validations, object validations, number validations, api response validations, json schema validation, contract testing, force fail, soft vs hard assertions, assertThat, verifyThat]
tags: [validations, assertions, browser, element, file, object, number, response, json-schema, contract-testing, force-fail, soft-assertions, hard-assertions]
---

SHAFT Engine allows you to perform assertions and verifications easily using the `Validations` class or the fluent driver-based API.

## Overview {/* #overview */}

Assertions and verifications are essential components in test automation. Each serves a distinct purpose:

1. **Assertions (Hard Assertions)** — If the assertion condition is not met, test execution is **aborted** immediately. The remaining steps in the test case are skipped and the result is marked as **failed**. Use assertions for business-critical checkpoints.
2. **Verifications (Soft Assertions)** — Even if the verification condition is not met, test execution **continues** until the last step completes. All failures are collected and reported at the end of the test run. Use verifications when you want to validate multiple conditions in a single test.

You can perform assertions and verifications on:

1. **[Browser validations](#browser-validations)** — URL, title, and other browser attributes
2. **[Element validations](#element-validations)** — Existence, visibility, text, attributes, and visual matching
3. **[File validations](#file-validations)** — Existence, checksum, and content validation
4. **[Object validations](#object-validations)** — Equality, containment, regex matching, null checks, and boolean checks
5. **[Number validations](#number-validations)** — Equality and comparison operators
6. **[API response validations](#response-validations)** — JSON/XML extraction, file content comparison, and schema matching
7. **[Force fail](#force-fail)** — Intentionally fail a test with a custom report message

SHAFT provides two ways to write validations:

```java title="StandaloneValidationExample.java"
import com.shaft.validation.Validations;

// Hard assertion — fails immediately if condition is not met
Validations.assertThat().object(actualValue).isEqualTo(expectedValue);

// Soft assertion — collects failures and reports at the end
Validations.verifyThat().object(actualValue).isEqualTo(expectedValue);
```

```java title="DriverValidationExample.java"
// Assert using the driver instance
driver.assertThat().element(locator).text().isEqualTo("Expected Text");

// Verify using the driver instance
driver.verifyThat().element(locator).exists();
```

:::tip
Assertion and verification chains execute eagerly when the validation condition is selected, so examples do not require a terminal method call to execute.
:::

## Browser validations {/* #browser-validations */}

You can perform assertions and verifications on the browser itself using the `WebDriverBrowserValidationsBuilder`. Access it through the driver instance or the standalone `Validations` class.

### attribute()

Use this method to validate a specific browser attribute. It returns a `NativeValidationsBuilder` to continue building your validation chain.

```java title="BrowserUrlValidation.java"
// Using driver-based validation (recommended)
driver.assertThat().browser().attribute("url").isEqualTo("https://example.com");
driver.verifyThat().browser().attribute("url").contains("example");

// Using standalone validation
Validations.assertThat().browser(driver.getDriver()).attribute("url").isEqualTo("https://example.com");
Validations.verifyThat().browser(driver.getDriver()).attribute("url").contains("example");
```

```java title="BrowserTitleValidation.java"
// Using driver-based validation (recommended)
driver.assertThat().browser().attribute("title").isEqualTo("My Page Title");
driver.verifyThat().browser().attribute("title").contains("Page");
```

:::tip
After calling `.attribute()`, you can chain any of the following comparison methods: `.isEqualTo()`, `.contains()`, `.doesNotContain()`, `.matchesRegex()`, `.isNull()`, `.isNotNull()`, and more.
:::

## Element validations {/* #element-validations */}

You can perform assertions and verifications on web elements using the `WebDriverElementValidationsBuilder`. Access it through the driver instance or the standalone `Validations` class.

### exists() / doesNotExist()

```java title="ElementExistsValidation.java"
driver.assertThat().element(locator).exists();
driver.verifyThat().element(locator).exists();
driver.assertThat().element(locator).doesNotExist();
```

### matchesReferenceImage() / doesNotMatchReferenceImage()

Checks that the target element matches (or does not match) a reference image using OpenCV. On the first run, a screenshot of the element is captured and saved as the reference. Subsequent runs compare the element against this reference. Reference images are stored under `src/test/resources/DynamicObjectRepository`.

```java title="VisualValidation.java"
driver.assertThat().element(locator).matchesReferenceImage();
driver.verifyThat().element(locator).doesNotMatchReferenceImage();
```

`SHAFT.GUI.Playwright` supports the same element visual assertions when
`shaft-visual` is on the runtime classpath. Playwright captures
`Locator.screenshot()` bytes; the no-argument overload uses OpenCV, while
explicit OpenCV and Applitools Eyes engines use the selected visual provider.
See [Visual testing](/docs/integrations/visual) for engine options.

### attribute()

Checks a specific element attribute against an expected value. After calling `.attribute()`, chain a comparison method such as `.isEqualTo()`, `.contains()`, `.doesNotContain()`, `.matchesRegex()`, and more.

```java title="ElementAttributeValidation.java"
driver.assertThat().element(locator).attribute("class").contains("active");
driver.verifyThat().element(locator).attribute("href").isEqualTo("https://example.com");
```

### text() / textTrimmed()

```java title="ElementTextValidation.java"
driver.assertThat().element(locator).text().isEqualTo("Welcome");
driver.assertThat().element(locator).textTrimmed().isEqualTo("Hello World");
```

### cssProperty()

```java title="ElementCssValidation.java"
driver.assertThat().element(locator).cssProperty("color").contains("rgb(0, 128, 0)");
```

### State validations

`isVisible()`, `isHidden()`, `isEnabled()`, `isDisabled()`, `isSelected()`, `isNotSelected()`, `isChecked()`, and `isNotChecked()` check the target element's current state:

```java title="ElementStateValidation.java"
driver.assertThat().element(locator).isVisible();
driver.assertThat().element(locator).isEnabled();
driver.assertThat().element(locator).isSelected();
```

:::tip
All the state validation methods above execute eagerly when the condition is selected. You can optionally add a custom report message to the chain:
```java
driver.assertThat().element(locator).isVisible()
    .withCustomReportMessage("Verify login button is visible");
```
:::

### Complete example

```java title="src/test/java/tests/CheckoutValidationTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class CheckoutValidationTest {
    private SHAFT.GUI.WebDriver driver;

    private final By addToCartBtn  = By.cssSelector("[data-test='add-to-cart']");
    private final By cartBadge     = By.className("shopping_cart_badge");
    private final By checkoutBtn   = By.id("checkout");
    private final By orderSummary  = By.id("order-summary");
    private final By placeOrderBtn = By.id("place-order");

    @Test
    public void checkoutFlow() {
        driver.browser().navigateToURL("https://example.com/products");

        // Add item and check badge
        driver.element().click(addToCartBtn);
        driver.assertThat(cartBadge)
              .text().isEqualTo("1")
              .withCustomReportMessage("Cart badge must show 1 after adding an item");

        // Proceed to checkout
        driver.element().click(checkoutBtn);
        driver.assertThat().browser().url().contains("/checkout");

        // Verify order summary is displayed
        driver.assertThat(orderSummary)
              .isVisible()
              .withCustomReportMessage("Order summary must be visible on checkout page");

        // Verify place order button is enabled
        driver.assertThat(placeOrderBtn)
              .isEnabled()
              .withCustomReportMessage("Place Order button must be enabled");
    }

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

## File validations {/* #file-validations */}

You can perform assertions and verifications on files using the `FileValidationsBuilder`.

### exists() / doesNotExist()

```java title="FileExistsValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json").exists();
Validations.assertThat().file("src/test/resources", "deleted.json").doesNotExist();
```

### checksum()

Calculates and validates the file checksum to confirm whether it has the exact same content. Chain a comparison method such as `.isEqualTo()` after calling `.checksum()`.

```java title="FileChecksumValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json")
    .checksum()
    .isEqualTo("expectedChecksumValue");
```

### content()

Reads and validates the file content. Works for PDF and text files. Chain a comparison method such as `.isEqualTo()`, `.contains()`, or `.matchesRegex()` after calling `.content()`.

```java title="FileContentValidation.java"
Validations.assertThat().file("src/test/resources", "report.txt")
    .content()
    .contains("Test Passed");
```

## Object validations {/* #object-validations */}

You can perform assertions and verifications on objects using the `NativeValidationsBuilder`: `isEqualTo()`, `doesNotEqual()`, `contains()`, `doesNotContain()`, `matchesRegex()`, `doesNotMatchRegex()`, `equalsIgnoringCaseSensitivity()`, `doesNotEqualIgnoringCaseSensitivity()`, `isNull()`, `isNotNull()`, `isTrue()`, and `isFalse()`.

```java title="ObjectEqualValidation.java"
Validations.assertThat().object(actualValue).isEqualTo(expectedValue);
Validations.verifyThat().object(actualValue).isEqualTo(expectedValue);
```

```java title="ObjectContainsValidation.java"
Validations.assertThat().object(actualText).contains("expected substring");
Validations.assertThat().object(actualValue).matchesRegex("\\d{3}-\\d{4}");
Validations.assertThat().object("Hello World").equalsIgnoringCaseSensitivity("hello world");
Validations.assertThat().object(actualValue).isNotNull();
```

:::tip
You can add a custom report message to any object validation:
```java
Validations.assertThat().object(username)
    .isEqualTo("admin")
    .withCustomReportMessage("Verify username is 'admin'");
```
:::

## Number validations {/* #number-validations */}

You can perform assertions and verifications on numbers using the `NumberValidationsBuilder`: `isEqualTo()`, `doesNotEqual()`, `isGreaterThan()`, `isGreaterThanOrEquals()`, `isLessThan()`, and `isLessThanOrEquals()`.

```java title="NumberValidation.java"
Validations.assertThat().number(actualNumber).isEqualTo(expectedNumber);
Validations.assertThat().number(actualNumber).isGreaterThan(expectedNumber);
```

:::tip
Number validations are useful for checking response times, element counts, and other numeric test data:
```java
// Validate API response time is under 2 seconds
Validations.assertThat().number(api.getResponseTime()).isLessThan(2000);

// Validate the number of search results
Validations.assertThat().number(resultCount).isGreaterThan(0);
```
:::

## Response validations {/* #response-validations */}

You can perform assertions and verifications on API responses using the `RestValidationsBuilder`. Access it through the `SHAFT.API` instance or the standalone `Validations` class.

### isEqualToFileContent() / doesNotEqualFileContent() / containsFileContent() / doesNotContainFileContent()

```java title="ResponseFileValidation.java"
// Using SHAFT.API instance (recommended)
api.assertThatResponse().isEqualToFileContent("src/test/resources/expected-response.json");
api.assertThatResponse().containsFileContent("src/test/resources/partial-response.json");

// Using standalone validation
Validations.assertThat().response(response).isEqualToFileContent("src/test/resources/expected-response.json");
```

### extractedJsonValue() / extractedJsonValueAsList()

Extracts a value (or list of values) from the JSON response using a JSONPath expression and validates it. Chain a comparison method such as `.isEqualTo()`, `.contains()`, or `.matchesRegex()`.

```java title="ResponseJsonExtractValidation.java"
api.assertThatResponse().extractedJsonValue("data.name").isEqualTo("John");
api.verifyThatResponse().extractedJsonValue("data.items[0].id").isEqualTo("123");
api.assertThatResponse().extractedJsonValueAsList("data.items").isNotNull();
```

:::info
JSONPath expressions should be provided **without** the leading `$.` prefix. For example, use `"data.name"` instead of `"$.data.name"`. SHAFT uses the [Jayway JsonPath](https://github.com/json-path/JsonPath) library (the standard Java JSONPath implementation) for expression evaluation.
:::

:::tip
When using `SHAFT.API`, the response from the last request is automatically passed to the validation builder. You don't need to pass it explicitly.
:::

## JSON schema validation {/* #json-schema-validation */}

SHAFT Engine supports **JSON Schema validation** for API responses through `matchesSchema()` and `doesNotMatchSchema()` on the response assertion builder. This enables **contract testing** — ensuring your API responses conform to an agreed-upon structure as your system evolves.

| Benefit | Description |
|---|---|
| Contract testing | Catch breaking API changes before they reach consumers |
| Type safety | Verify field types (string, integer, boolean) are correct |
| Required fields | Assert mandatory fields are always present in responses |
| Format validation | Validate email, date-time, URI, and other formats |

Place your schema files under `src/test/resources/schemas/`:

```json title="user-schema.json"
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  }
}
```

### matchesSchema() / doesNotMatchSchema()

```java title="JSONSchemaValidation.java"
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.get("/users/1")
   .setTargetStatusCode(200);

// Assert the response body matches the schema
api.assertThatResponse()
   .matchesSchema("src/test/resources/schemas/user-schema.json");

// Assert the response body does NOT match a given schema (negative testing)
api.assertThatResponse()
   .doesNotMatchSchema("src/test/resources/schemas/admin-schema.json");
```

:::tip
Commit your schema files to source control alongside your tests. When a deliberate API contract change is made, update the schema and create a PR — making API contract changes explicit and reviewable.
:::

:::note
SHAFT uses the [JSON Schema Validator](https://github.com/java-json-tools/json-schema-validator) library under the hood, which supports JSON Schema Draft 4, 6, and 7.
:::

## Force fail {/* #force-fail */}

Use `forceFail()` to intentionally fail a test with a custom message. This is useful for marking incomplete tests, flagging known issues, or creating conditional failures.

```java title="ForceFailExample.java"
// Force fail with a custom message
Validations.assertThat().forceFail()
    .withCustomReportMessage("This feature is not yet implemented");

// Soft force fail — collects the failure and continues execution
Validations.verifyThat().forceFail()
    .withCustomReportMessage("Known issue: JIRA-1234");
```

### withCustomReportMessage()

Sets a business-readable message that appears in the Allure execution report instead of the default technical log message. It works with any validation type:

```java title="CustomMessageExample.java"
Validations.assertThat().object(actualValue)
    .isEqualTo(expectedValue)
    .withCustomReportMessage("Verify user name matches expected value");

driver.assertThat().element(loginButton)
    .isVisible()
    .withCustomReportMessage("Verify login button is displayed");
```

Validation chains execute eagerly when the validation condition is selected, eliminating the need for a terminal method call:

```java title="PerformExample.java"
Validations.assertThat().file("src/test/resources", "data.json").exists();
Validations.assertThat().number(count).isGreaterThan(0);
driver.assertThat().element(locator).exists();
```

## Soft vs hard assertions {/* #soft-vs-hard-assertions */}

SHAFT Engine provides two assertion modes: **hard assertions** that stop the test immediately on the first failure, and **soft assertions** that collect all failures and report them together at the end of the test. Choosing the right mode is key to writing effective, maintainable tests.

### Hard assertions — assertThat()

`assertThat()` is a **hard assertion**. If the assertion condition is not met, test execution **stops immediately** and the test is marked as failed. Remaining steps are skipped. Use hard assertions for **business-critical checkpoints** where proceeding with a broken state would produce meaningless results.

```java title="SoftVsHardAssertions.java"
// Hard assertion — test fails immediately on first failure
driver.assertThat().browser().title().contains("Dashboard");
driver.assertThat(By.id("welcomeMsg")).text().contains("Welcome");
```

### Soft assertions — verifyThat()

`verifyThat()` is a **soft assertion**. If the condition is not met, the failure is **recorded but execution continues**. All accumulated failures are reported together at the end of the test. Use soft assertions when you want to **validate multiple independent conditions** in a single test without early exit.

```java title="SoftVsHardAssertions.java"
// Soft assertion — collects failures, reports all at end of test
driver.verifyThat().element(By.id("name")).text().contains("John");
driver.verifyThat().element(By.id("email")).text().contains("@");
driver.verifyThat().element(By.id("role")).text().isEqualTo("Admin");
// All three are verified; all failures reported together at test end
```

Both modes are also available without a driver instance via `SHAFT.Validations`:

```java title="StandaloneSoftVsHardAssertions.java"
import com.shaft.driver.SHAFT;

SHAFT.Validations.assertThat().object("actual").isEqualTo("expected");
SHAFT.Validations.verifyThat().number(42).isGreaterThan(0);
```

| Aspect | `assertThat()` (Hard) | `verifyThat()` (Soft) |
|---|---|---|
| On failure | Stops test immediately | Records failure, continues |
| Use case | Critical business checkpoints | Multiple independent validations |
| Report | Shows first failure only | Shows all failures together |
| Test speed | Faster on failure | Completes all steps before reporting |

:::tip
A good pattern is to use **one hard assertion** to confirm the test precondition (e.g., correct page, user is logged in), then use **soft assertions** for all subsequent field validations.
:::

:::info
Soft assertion failures are accumulated per-test and reported at the end of the test method. In TestNG, SHAFT triggers a test failure after the `@AfterMethod` completes, so all soft failures for a test are visible in the Allure report.
:::

## Related

- [Custom Report Messages](/docs/reference/reporting/Custom_Report_Messages) — enrich Allure reports with business context
- [Element Actions](/docs/reference/actions/GUI/Element_Actions) — available interactions before validating
- [Element Identification](/docs/reference/actions/GUI/Element_Identification) — locate the elements you validate
- [Testing: Web](/docs/testing/web) — locator strategy and web testing guide
