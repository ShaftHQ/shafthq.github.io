---
id: Files
title: File Validations
sidebar_label: File
description: "Validate file existence, checksum, and content using SHAFT Engine's FileValidationsBuilder."
keywords: [SHAFT, file validations, file exists, checksum, PDF validation, text file validation]
---

You can perform assertions and verifications on files using the `FileValidationsBuilder`.

## exists()

Checks that a file exists at the specified path.

```java title="FileExistsValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json").exists().perform();
Validations.verifyThat().file("src/test/resources", "testData.json").exists().perform();
```

## doesNotExist()

Checks that a file does not exist at the specified path.

```java title="FileDoesNotExistValidation.java"
Validations.assertThat().file("src/test/resources", "deleted.json").doesNotExist().perform();
Validations.verifyThat().file("src/test/resources", "deleted.json").doesNotExist().perform();
```

## checksum()

Calculates and validates the file checksum to confirm whether it has the exact same content. Chain a comparison method such as `.isEqualTo()` after calling `.checksum()`.

```java title="FileChecksumValidation.java"
Validations.assertThat().file("src/test/resources", "testData.json")
    .checksum()
    .isEqualTo("expectedChecksumValue")
    .perform();
```

## content()

Reads and validates the file content. Works for PDF and text files. Chain a comparison method such as `.isEqualTo()`, `.contains()`, or `.matchesRegex()` after calling `.content()`.

```java title="FileContentValidation.java"
Validations.assertThat().file("src/test/resources", "report.txt")
    .content()
    .contains("Test Passed")
    .perform();
```

:::tip
You can add a custom report message to any file validation:
```java
Validations.assertThat().file("src/test/resources", "config.json")
    .exists()
    .withCustomReportMessage("Verify config file is present")
    .perform();
```
:::
