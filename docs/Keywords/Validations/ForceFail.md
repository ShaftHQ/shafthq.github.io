---
id: ForceFail
title: Force Fail
sidebar_label: Force Fail
description: "Intentionally fail a test with a custom message using SHAFT Engine's forceFail validation."
keywords: [SHAFT, force fail, custom assertion, test failure, custom report message]
---

Use `forceFail()` to intentionally fail a test with a custom message. This is useful for marking incomplete tests, flagging known issues, or creating conditional failures.

## forceFail()

Forces a test failure and reports it in the execution report.

```java title="ForceFailExample.java"
// Force fail with a custom message
Validations.assertThat().forceFail()
    .withCustomReportMessage("This feature is not yet implemented")
    .perform();

// Soft force fail — collects the failure and continues execution
Validations.verifyThat().forceFail()
    .withCustomReportMessage("Known issue: JIRA-1234")
    .perform();
```

## withCustomReportMessage()

Sets a business-readable message that appears in the Allure execution report instead of the default technical log message.

```java title="CustomMessageExample.java"
// Works with any validation type
Validations.assertThat().object(actualValue)
    .isEqualTo(expectedValue)
    .withCustomReportMessage("Verify user name matches expected value")
    .perform();

driver.assertThat().element(loginButton)
    .isVisible()
    .withCustomReportMessage("Verify login button is displayed")
    .perform();
```

## perform()

Executes the validation. **Every validation chain must end with `.perform()`** — without it, the validation will not run.

```java title="PerformExample.java"
// All these validations require .perform() at the end
Validations.assertThat().file("src/test/resources", "data.json").exists().perform();
Validations.assertThat().number(count).isGreaterThan(0).perform();
Validations.assertThat().object(name).isEqualTo("John").perform();
driver.assertThat().element(locator).exists().perform();
```

:::warning
Forgetting to call `.perform()` is a common mistake. The validation will appear to pass because it was never actually executed.
:::
