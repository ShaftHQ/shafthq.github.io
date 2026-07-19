---
id: Response_Validations
title: Response Validations
sidebar_label: Response Validations
description: "Validate API responses — status codes, JSON values, response body, schema matching, and response time using SHAFT Engine."
keywords: [SHAFT, API validation, response validation, JSON validation, schema validation, REST API testing]
tags: [api, validation, response, json]
---

## SHAFT API Response Validations
Using the SHAFT API object to directly validate the latest response is very convenient. Use `assertThatResponse()` for hard assertions or `verifyThatResponse()` for soft assertions. Response validations execute eagerly when the validation condition is selected.

### Body
Validate on the response body.
Chains to JSON/body validation methods, including structural JSON equality that ignores array/object ordering.

```java
api.assertThatResponse().body().contains("data");
api.assertThatResponse().body()
   .equalsIgnoringOrder("{\"roles\":[\"admin\",\"tester\"]}");
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210");
api.assertThatResponse().body().contains("Beverly Hills");
```

### Extracted Json Value
Validate an extracted value from the response body by parsing the target **JSONPath**.

:::info
You can learn the JSONPath syntax from the [JSONPath documentation](https://github.com/json-path/JsonPath) and test your expressions at [jsonpath.com](http://jsonpath.com/).
:::

Chains to [Object validation methods](../Validations#object-validations) to continue building your validation.

```java
api.assertThatResponse().extractedJsonValue("jsonPath").isEqualTo("data");
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users");
api.assertThatResponse().extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id").isEqualTo("5");
```

### Extracted Json Value As List
Validate an extracted value from the response body by parsing the target **JSONPath** as a list and check every item against it.

Chains to [Object validation methods](../Validations#object-validations) to continue building your validation.

```java
api.assertThatResponse().extractedJsonValueAsList("jsonPath").isEqualTo("data");
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/todos");
api.verifyThatResponse().extractedJsonValueAsList("$[?(@.completed==true)].completed").isEqualTo("true");
```

### Time
Validate on the response time.
Chains to [Number validation methods](../Validations#number-validations) to continue building your validation.

```java
api.assertThatResponse().time().isEqualTo(expectedNumberValue);
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210");
api.verifyThatResponse().time().isGreaterThanOrEquals(100);
api.verifyThatResponse().time().isLessThanOrEquals(100000);
```

### Is Equal To File Content
Validate if the content of the provided actual response object is equal to the expected file content.
```java
api.assertThatResponse().isEqualToFileContent("fileRelativePath");
```

### Does Not Equal File Content
Validate if the content of the provided actual response object is not equal to the expected file content.
```java
api.assertThatResponse().doesNotEqualFileContent("fileRelativePath");
```

### Is Equal To File Content Ignoring Order
Validate if the content of the provided actual response object is equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().isEqualToFileContentIgnoringOrder("fileRelativePath");
```

### Does Not Equal File Content Ignoring Order
Validate if the content of the provided actual response object is not equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().doesNotEqualFileContentIgnoringOrder("fileRelativePath");
```

### Contains File Content
Validate if the content of the provided actual response object contains the expected file content.
```java
api.assertThatResponse().containsFileContent("fileRelativePath");
```

### Does Not Contain File Content
Validate if the content of the provided actual response object does not contain the expected file content.
```java
api.assertThatResponse().doesNotContainFileContent("fileRelativePath");
```

### Matches Schema
Validate if the content of the provided actual response object matches the schema for the expected file content.
```java
api.assertThatResponse().matchesSchema("fileRelativePath");
```

### Does Not Match Schema
Validate if the content of the provided actual response object does not match the schema for the expected file content.
```java
api.assertThatResponse().doesNotMatchSchema("fileRelativePath");
```

## Related

- [Request Builder](/docs/reference/actions/API/Request_Builder)
- [API Authentication](/docs/reference/actions/API/API_Authentication)
- [API](/docs/testing/api)
