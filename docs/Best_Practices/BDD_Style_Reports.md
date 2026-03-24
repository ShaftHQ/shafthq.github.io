---
id: BDD_Style_Reports
title: "BDD-Style Reports with Allure Annotations"
sidebar_label: BDD-Style Reports
description: "Use Allure annotations to generate business-readable BDD-style reports without Cucumber — simpler setup, better maintainability."
keywords: [SHAFT, Allure annotations, BDD reports, business-readable, Epic, Feature, Story, Description, Cucumber alternative]
---

Many teams adopt Cucumber or similar BDD frameworks to produce **business-readable reports**. However, you can achieve the same report output using **Allure annotations** directly in your Java tests — without the overhead of maintaining `.feature` files, step definitions, and glue code.

---

## Why Allure Annotations Over Cucumber?

| Aspect | Cucumber BDD | Allure Annotations |
|---|---|---|
| Report readability | ✅ Business-readable | ✅ Business-readable |
| Maintenance overhead | High — feature files, step defs, glue | Low — annotations on test methods |
| Refactoring support | Poor — string matching between files | Full IDE support — rename, find usages |
| Debugging | Harder — extra abstraction layer | Direct — standard Java test methods |
| Setup complexity | Cucumber plugin + runner + config | Just Allure (already included in SHAFT) |

:::tip
SHAFT Engine includes Allure out of the box. You do not need any additional dependencies or plugins to use these annotations.
:::

---

## The Allure BDD Annotations

Allure provides a hierarchy of annotations that map directly to BDD concepts:

| Annotation | BDD Equivalent | Purpose |
|---|---|---|
| `@Epic("...")` | Epic / Theme | Top-level business capability |
| `@Feature("...")` | Feature | Specific feature being tested |
| `@Story("...")` | User Story | Individual user story |
| `@Description("...")` | Scenario description | Given/When/Then narrative |
| `@Step("...")` | Step | Individual test step |

---

## Example: BDD-Style Test with Allure

```java title="RegistrationTest.java"
import com.shaft.driver.SHAFT;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import io.qameta.allure.Description;
import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Epic("User Management")
@Feature("Registration")
public class RegistrationTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Story("Successful registration")
    @Description("Given I am on the registration page\n"
        + "When I fill in valid registration details\n"
        + "Then I should see a confirmation message")
    @Test(description = "Verify new user registration")
    public void testSuccessfulRegistration() {
        navigateToRegistration();
        fillRegistrationForm("user@example.com", "securePass123");
        verifyRegistrationSuccess();
    }

    @Step("Navigate to the registration page")
    private void navigateToRegistration() {
        driver.browser().navigateToURL("https://example.com/register");
    }

    @Step("Fill in the registration form with email: {email}")
    private void fillRegistrationForm(String email, String password) {
        driver.element()
            .type(By.id("email"), email)
            .and().type(By.id("password"), password)
            .and().type(By.id("confirm-password"), password)
            .and().click(By.id("register-btn"));
    }

    @Step("Verify registration success message is displayed")
    private void verifyRegistrationSuccess() {
        driver.assertThat(By.id("confirmation"))
            .text().contains("Registration successful")
            .withCustomReportMessage("Confirming registration completed successfully")
            .perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## What the Report Looks Like

The Allure report groups tests by **Epic → Feature → Story**, producing a hierarchy that stakeholders can navigate:

```
📁 User Management (Epic)
  📁 Registration (Feature)
    📄 Successful registration (Story)
      ✅ Verify new user registration
         → Navigate to the registration page
         → Fill in the registration form with email: user@example.com
         → Verify registration success message is displayed
```

The `@Description` text appears in the test detail view, giving business stakeholders the familiar **Given / When / Then** narrative without requiring Cucumber.

---

## Best Practices

1. **Use `@Epic` and `@Feature` at the class level** to group related tests.
2. **Use `@Story` at the method level** to tie each test to a user story.
3. **Write `@Description` in Given/When/Then format** for stakeholder readability.
4. **Extract steps into `@Step`-annotated private methods** to keep test methods clean and reports detailed.
5. **Use `@Step` parameter substitution** (e.g., `{email}`) to make step names dynamic in the report.

:::info
This approach gives you the best of both worlds: business-readable reports that map to user stories, and simple Java code that is easy to maintain, refactor, and debug.
:::
