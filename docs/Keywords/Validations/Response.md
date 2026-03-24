---
id: Response
title: API Response Validations
sidebar_label: API Response
description: "Validate API responses including JSON values, file content comparison, and schema matching using SHAFT Engine."
keywords: [SHAFT, API validations, response validation, JSON, schema validation, REST API testing]
---

You can perform assertions and verifications on API responses using the `RestValidationsBuilder`. Access it through the `SHAFT.API` instance or the standalone `Validations` class.

## isEqualToFileContent()

Checks that the response body is equal to the content of an expected file.

```java title="ResponseFileEqualValidation.java"
// Using SHAFT.API instance (recommended)
api.assertThatResponse().isEqualToFileContent("src/test/resources/expected-response.json").perform();
api.verifyThatResponse().isEqualToFileContent("src/test/resources/expected-response.json").perform();

// Using standalone validation
Validations.assertThat().response(response).isEqualToFileContent("src/test/resources/expected-response.json").perform();
```

## doesNotEqualFileContent()

Checks that the response body is not equal to the content of an expected file.

```java title="ResponseFileNotEqualValidation.java"
api.assertThatResponse().doesNotEqualFileContent("src/test/resources/old-response.json").perform();
```

## containsFileContent()

Checks that the response body contains the content of an expected file.

```java title="ResponseContainsFileValidation.java"
api.assertThatResponse().containsFileContent("src/test/resources/partial-response.json").perform();
```

## doesNotContainFileContent()

Checks that the response body does not contain the content of an expected file.

```java title="ResponseNotContainsFileValidation.java"
api.assertThatResponse().doesNotContainFileContent("src/test/resources/excluded-content.json").perform();
```

## extractedJsonValue()

Extracts a value from the JSON response using a JSONPath expression and validates it. Chain a comparison method such as `.isEqualTo()`, `.contains()`, or `.matchesRegex()`.

```java title="ResponseJsonExtractValidation.java"
// Validate extracted JSON value
api.assertThatResponse().extractedJsonValue("data.name").isEqualTo("John").perform();
api.verifyThatResponse().extractedJsonValue("data.items[0].id").isEqualTo("123").perform();
```

:::info
JSONPath expressions should be provided **without** the leading `$.` prefix. For example, use `"data.name"` instead of `"$.data.name"`. SHAFT uses the [Jayway JsonPath](https://github.com/json-path/JsonPath) library (the standard Java JSONPath implementation) for expression evaluation.
:::

## extractedJsonValueAsList()

Extracts a list of values from the JSON response using a JSONPath expression and validates it.

```java title="ResponseJsonListExtractValidation.java"
api.assertThatResponse().extractedJsonValueAsList("data.items").isNotNull().perform();
```

## matchesSchema()

Checks that the response body matches a JSON schema defined in an expected file.

```java title="ResponseSchemaValidation.java"
api.assertThatResponse().matchesSchema("src/test/resources/response-schema.json").perform();
api.verifyThatResponse().matchesSchema("src/test/resources/response-schema.json").perform();
```

## doesNotMatchSchema()

Checks that the response body does not match a JSON schema defined in an expected file.

```java title="ResponseSchemaNotMatchValidation.java"
api.assertThatResponse().doesNotMatchSchema("src/test/resources/wrong-schema.json").perform();
```

:::tip
When using `SHAFT.API`, the response from the last request is automatically passed to the validation builder. You don't need to pass it explicitly.
:::
