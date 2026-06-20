---
id: Objects
title: Object Validations
sidebar_label: Object
description: "Validate objects for equality, containment, regex matching, null checks, and boolean values using SHAFT Engine."
keywords: [SHAFT, object validations, assertions, equality, regex, null check, boolean validation]
tags: [validations, objects, equality]
---

You can perform assertions and verifications on objects using the `NativeValidationsBuilder`.

## isEqualTo()

Checks that the actual object is equal to the expected value.

```java title="ObjectEqualValidation.java"
Validations.assertThat().object(actualValue).isEqualTo(expectedValue);
Validations.verifyThat().object(actualValue).isEqualTo(expectedValue);
```

## doesNotEqual()

Checks that the actual object is not equal to the expected value.

```java title="ObjectNotEqualValidation.java"
Validations.assertThat().object(actualValue).doesNotEqual(expectedValue);
Validations.verifyThat().object(actualValue).doesNotEqual(expectedValue);
```

## contains()

Checks that the actual object contains the expected value.

```java title="ObjectContainsValidation.java"
Validations.assertThat().object(actualText).contains("expected substring");
Validations.verifyThat().object(actualText).contains("expected substring");
```

## doesNotContain()

Checks that the actual object does not contain the expected value.

```java title="ObjectNotContainsValidation.java"
Validations.assertThat().object(actualText).doesNotContain("unwanted text");
```

## matchesRegex()

Checks that the actual object matches the expected regular expression.

```java title="ObjectRegexValidation.java"
Validations.assertThat().object(actualValue).matchesRegex("\\d{3}-\\d{4}");
```

## doesNotMatchRegex()

Checks that the actual object does not match the expected regular expression.

```java title="ObjectNotRegexValidation.java"
Validations.assertThat().object(actualValue).doesNotMatchRegex("\\d+");
```

## equalsIgnoringCaseSensitivity()

Checks that the actual object equals the expected value, ignoring case sensitivity.

```java title="ObjectCaseInsensitiveValidation.java"
Validations.assertThat().object("Hello World").equalsIgnoringCaseSensitivity("hello world");
```

## doesNotEqualIgnoringCaseSensitivity()

Checks that the actual object does not equal the expected value, ignoring case sensitivity.

```java title="ObjectCaseInsensitiveNotEqualValidation.java"
Validations.assertThat().object("Hello").doesNotEqualIgnoringCaseSensitivity("world");
```

## isNull()

Checks that the actual object is null.

```java title="ObjectNullValidation.java"
Validations.assertThat().object(actualValue).isNull();
```

## isNotNull()

Checks that the actual object is not null.

```java title="ObjectNotNullValidation.java"
Validations.assertThat().object(actualValue).isNotNull();
```

## isTrue()

Checks that the actual object evaluates to true.

```java title="ObjectTrueValidation.java"
Validations.assertThat().object(actualValue).isTrue();
```

## isFalse()

Checks that the actual object evaluates to false.

```java title="ObjectFalseValidation.java"
Validations.assertThat().object(actualValue).isFalse();
```

:::tip
You can add a custom report message to any object validation:
```java
Validations.assertThat().object(username)
    .isEqualTo("admin")
    .withCustomReportMessage("Verify username is 'admin'");
```
:::

## Related

- [Overview](/docs/reference/actions/Validations/Overview)
- [Soft Vs Hard Assertions](/docs/reference/actions/Validations/Soft_vs_Hard_Assertions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
