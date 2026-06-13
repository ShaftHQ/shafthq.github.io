---
id: Overview
title: Validations Overview
sidebar_label: Overview
description: "Learn how to use SHAFT Engine's built-in assertions and verifications for browser, element, object, number, file, and API response validation."
keywords: [SHAFT, validations, assertions, verifications, test automation, hard assertion, soft assertion]
tags: [validations, assertions, overview]
---

SHAFT Engine allows you to perform assertions and verifications easily using the `Validations` class or the fluent driver-based API.

## Assertions vs. Verifications

Assertions and verifications are essential components in test automation. Each serves a distinct purpose:

1. **Assertions (Hard Assertions)** — If the assertion condition is not met, test execution is **aborted** immediately. The remaining steps in the test case are skipped and the result is marked as **failed**. Use assertions for business-critical checkpoints.
2. **Verifications (Soft Assertions)** — Even if the verification condition is not met, test execution **continues** until the last step completes. All failures are collected and reported at the end of the test run. Use verifications when you want to validate multiple conditions in a single test.

## Supported Validation Targets

You can perform assertions and verifications on:

1. **[Browser](Browser)** — URL, title, and other browser attributes
2. **[Elements](Elements)** — Existence, visibility, text, attributes, and visual matching
3. **[Objects](Objects)** — Equality, containment, regex matching, null checks, and boolean checks
4. **[Numbers](Nums)** — Equality and comparison operators
5. **[Files](Files)** — Existence, checksum, and content validation
6. **[API Response](Response)** — JSON/XML extraction, file content comparison, and schema matching
7. **[Force Fail](ForceFail)** — Intentionally fail a test with a custom report message

## Usage Patterns

SHAFT provides two ways to write validations:

### Standalone Validations

```java title="StandaloneValidationExample.java"
import com.shaft.validation.Validations;

// Hard assertion — fails immediately if condition is not met
Validations.assertThat().object(actualValue).isEqualTo(expectedValue).perform();

// Soft assertion — collects failures and reports at the end
Validations.verifyThat().object(actualValue).isEqualTo(expectedValue).perform();
```

### Driver-Based Validations

```java title="DriverValidationExample.java"
// Assert using the driver instance
driver.assertThat().element(locator).text().isEqualTo("Expected Text").perform();

// Verify using the driver instance
driver.verifyThat().element(locator).exists().perform();
```

:::tip
Always call `.perform()` at the end of your validation chain. Without it, the validation will **not** execute.
:::

