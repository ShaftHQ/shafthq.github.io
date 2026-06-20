---
id: Nums
title: Number Validations
sidebar_label: Number
description: "Validate numbers for equality and comparison using SHAFT Engine's NumberValidationsBuilder."
keywords: [SHAFT, number validations, numeric assertions, comparison, greater than, less than]
tags: [validations, numbers, comparison]
---

You can perform assertions and verifications on numbers using the `NumberValidationsBuilder`.

## isEqualTo()

Checks that the actual number is equal to the expected value.

```java title="NumberEqualValidation.java"
Validations.assertThat().number(actualNumber).isEqualTo(expectedNumber);
Validations.verifyThat().number(actualNumber).isEqualTo(expectedNumber);
```

## doesNotEqual()

Checks that the actual number is not equal to the expected value.

```java title="NumberNotEqualValidation.java"
Validations.assertThat().number(actualNumber).doesNotEqual(expectedNumber);
```

## isGreaterThan()

Checks that the actual number is strictly greater than the expected value.

```java title="NumberGreaterThanValidation.java"
Validations.assertThat().number(actualNumber).isGreaterThan(expectedNumber);
```

## isGreaterThanOrEquals()

Checks that the actual number is greater than or equal to the expected value.

```java title="NumberGreaterThanOrEqualsValidation.java"
Validations.assertThat().number(actualNumber).isGreaterThanOrEquals(expectedNumber);
```

## isLessThan()

Checks that the actual number is strictly less than the expected value.

```java title="NumberLessThanValidation.java"
Validations.assertThat().number(actualNumber).isLessThan(expectedNumber);
```

## isLessThanOrEquals()

Checks that the actual number is less than or equal to the expected value.

```java title="NumberLessThanOrEqualsValidation.java"
Validations.assertThat().number(actualNumber).isLessThanOrEquals(expectedNumber);
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

## Related

- [Overview](/docs/reference/actions/Validations/Overview)
- [Soft Vs Hard Assertions](/docs/reference/actions/Validations/Soft_vs_Hard_Assertions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
