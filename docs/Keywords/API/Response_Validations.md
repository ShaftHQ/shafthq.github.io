---
id: Response_Validations
title: Response Validations
sidebar_label: Validations
description: "Validate API responses — status codes, JSON values, response body, schema matching, and response time using SHAFT Engine."
keywords: [SHAFT, API validation, response validation, JSON validation, schema validation, REST API testing]
---

## SHAFT API Response Validations
Using the SHAFT API object to directly validate the latest response is very convenient. Use `assertThatResponse()` for hard assertions or `verifyThatResponse()` for soft assertions, and always call `.perform()` at the end to execute the validation.

### Body
Validate on the response body.
Chains to [Object validation methods](../Validations/Objects) to continue building your validation.

```java
api.assertThatResponse().body().contains("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
api.assertThatResponse().body().contains("Beverly Hills").perform();
```

### Extracted Json Value
Validate an extracted value from the response body by parsing the target **JSONPath**.

:::info
You can learn the JSONPath syntax from the [JSONPath documentation](https://github.com/json-path/JsonPath) and test your expressions at [jsonpath.com](http://jsonpath.com/).
:::

Chains to [Object validation methods](../Validations/Objects) to continue building your validation.

```java
api.assertThatResponse().extractedJsonValue("jsonPath").isEqualTo("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").perform();
api.assertThatResponse().extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id").isEqualTo("5").perform();
```

### Extracted Json Value As List
Validate an extracted value from the response body by parsing the target **JSONPath** as a list and check every item against it.

Chains to [Object validation methods](../Validations/Objects) to continue building your validation.

```java
api.assertThatResponse().extractedJsonValueAsList("jsonPath").isEqualTo("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/todos").perform();
api.verifyThatResponse().extractedJsonValueAsList("$[?(@.completed==true)].completed").isEqualTo("true").perform();
```

### Time
Validate on the response time.
Chains to [Number validation methods](../Validations/Nums) to continue building your validation.

```java
api.assertThatResponse().time().isEqualTo(expectedNumberValue).perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
api.verifyThatResponse().time().isGreaterThanOrEquals(100).perform();
api.verifyThatResponse().time().isLessThanOrEquals(100000).perform();
```

### Is Equal To File Content
Validate if the content of the provided actual response object is equal to the expected file content.
```java
api.assertThatResponse().isEqualToFileContent("fileRelativePath").perform();
```

### Does Not Equal File Content
Validate if the content of the provided actual response object is not equal to the expected file content.
```java
api.assertThatResponse().doesNotEqualFileContent("fileRelativePath").perform();
```

### Is Equal To File Content Ignoring Order
Validate if the content of the provided actual response object is equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().isEqualToFileContentIgnoringOrder("fileRelativePath").perform();
```

### Does Not Equal File Content Ignoring Order
Validate if the content of the provided actual response object is not equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().doesNotEqualFileContentIgnoringOrder("fileRelativePath").perform();
```

### Contains File Content
Validate if the content of the provided actual response object contains the expected file content.
```java
api.assertThatResponse().containsFileContent("fileRelativePath").perform();
```

### Does Not Contain File Content
Validate if the content of the provided actual response object does not contain the expected file content.
```java
api.assertThatResponse().doesNotContainFileContent("fileRelativePath").perform();
```

### Matches Schema
Validate if the content of the provided actual response object matches the schema for the expected file content.
```java
api.assertThatResponse().matchesSchema("fileRelativePath").perform();
```

### Does Not Match Schema
Validate if the content of the provided actual response object does not match the schema for the expected file content.
```java
api.assertThatResponse().doesNotMatchSchema("fileRelativePath").perform();
```
