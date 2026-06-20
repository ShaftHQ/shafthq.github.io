---
id: Files
title: File Validations
sidebar_label: File
description: "Validate file existence, checksum, and content using SHAFT Engine's FileValidationsBuilder."
keywords: [SHAFT, file validations, file exists, checksum, PDF validation, text file validation]
tags: [validations, file, checksum]
---

You can perform assertions and verifications on files using the `FileValidationsBuilder`.

## exists()

Checks that a file exists at the specified path.

```java title="FileExistsValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json").exists();
Validations.verifyThat().file("src/test/resources", "testData.json").exists();
```

## doesNotExist()

Checks that a file does not exist at the specified path.

```java title="FileDoesNotExistValidation.java"
Validations.assertThat().file("src/test/resources", "deleted.json").doesNotExist();
Validations.verifyThat().file("src/test/resources", "deleted.json").doesNotExist();
```

## checksum()

Calculates and validates the file checksum to confirm whether it has the exact same content. Chain a comparison method such as `.isEqualTo()` after calling `.checksum()`.

```java title="FileChecksumValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json")
    .checksum()
    .isEqualTo("expectedChecksumValue");
```

## content()

Reads and validates the file content. Works for PDF and text files. Chain a comparison method such as `.isEqualTo()`, `.contains()`, or `.matchesRegex()` after calling `.content()`.

```java title="FileContentValidation.java"
Validations.assertThat().file("src/test/resources", "report.txt")
    .content()
    .contains("Test Passed");
```

:::tip
You can add a custom report message to any file validation:
```java
Validations.assertThat().file("src/test/resources", "config.json")
    .exists()
    .withCustomReportMessage("Verify config file is present");
```
:::

## Related

- [Overview](/docs/reference/actions/Validations/Overview)
- [Soft Vs Hard Assertions](/docs/reference/actions/Validations/Soft_vs_Hard_Assertions)
- [Element Validations](/docs/reference/actions/GUI/Element_Validations)
