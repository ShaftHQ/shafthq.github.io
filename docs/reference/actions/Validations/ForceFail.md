---
id: ForceFail
title: Force Fail
sidebar_label: Force Fail
description: "Intentionally fail a test with a custom message using SHAFT Engine's forceFail validation."
keywords: [SHAFT, force fail, custom assertion, test failure, custom report message]
tags: [validations, force-fail]
---

Use `forceFail()` to intentionally fail a test with a custom message. This is useful for marking incomplete tests, flagging known issues, or creating conditional failures.

## forceFail()

Forces a test failure and reports it in the execution report.

```java title="ForceFailExample.java"
// Force fail with a custom message
Validations.assertThat().forceFail()
    .withCustomReportMessage("This feature is not yet implemented");

// Soft force fail — collects the failure and continues execution
Validations.verifyThat().forceFail()
    .withCustomReportMessage("Known issue: JIRA-1234");
```

## withCustomReportMessage()

Sets a business-readable message that appears in the Allure execution report instead of the default technical log message.

```java title="CustomMessageExample.java"
// Works with any validation type
Validations.assertThat().object(actualValue)
    .isEqualTo(expectedValue)
    .withCustomReportMessage("Verify user name matches expected value");

driver.assertThat().element(loginButton)
    .isVisible()
    .withCustomReportMessage("Verify login button is displayed");
```

## Eager execution

Validation chains execute eagerly when the validation condition is selected. A terminal `.perform()` call is no longer required for assertions or verifications.

```java title="PerformExample.java"
Validations.assertThat().file("src/test/resources", "data.json").exists();
Validations.assertThat().number(count).isGreaterThan(0);
Validations.assertThat().object(name).isEqualTo("John");
driver.assertThat().element(locator).exists();
```

## Related

- [Overview](/docs/reference/actions/Validations/Overview)
- [Soft Vs Hard Assertions](/docs/reference/actions/Validations/Soft_vs_Hard_Assertions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
