---
id: JSON_Schema_Validation
title: JSON Schema Validation
sidebar_label: JSON Schema Validation
description: "Validate API responses against a JSON schema in SHAFT Engine using matchesSchema and doesNotMatchSchema for contract testing and API governance."
keywords: [SHAFT, JSON schema validation, contract testing, matchesSchema, doesNotMatchSchema, API validation, schema]
tags: [validations, api, json-schema, contract-testing]
---

SHAFT Engine supports **JSON Schema validation** for API responses through `matchesSchema()` and `doesNotMatchSchema()` on the response assertion builder. This enables **contract testing** — ensuring your API responses conform to an agreed-upon structure as your system evolves.

---

## Why JSON Schema Validation?

| Benefit | Description |
|---|---|
| Contract testing | Catch breaking API changes before they reach consumers |
| Type safety | Verify field types (string, integer, boolean) are correct |
| Required fields | Assert mandatory fields are always present in responses |
| Format validation | Validate email, date-time, URI, and other formats |

---

## Creating a JSON Schema File

Place your schema files under `src/test/resources/schemas/`. Here is a sample user schema:

```json title="user-schema.json"
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  }
}
```

---

## matchesSchema()

Assert that the response body **matches** the specified JSON schema:

```java title="JSONSchemaValidation.java"
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.get("/users/1")
   .setTargetStatusCode(200)
   .performRequest();

api.assertThatResponse()
   .matchesSchema("src/test/resources/schemas/user-schema.json")
   .perform();
```

---

## doesNotMatchSchema()

Assert that the response body does **not** match a given schema (useful for negative testing):

```java title="JSONSchemaValidation.java"
api.assertThatResponse()
   .doesNotMatchSchema("src/test/resources/schemas/admin-schema.json")
   .perform();
```

---

## Complete Example

```java title="JSONSchemaValidationTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.Test;

public class JSONSchemaValidationTest {

    @Test
    public void validateUserResponseSchema() {
        SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");

        api.get("/users/1")
           .setTargetStatusCode(200)
           .performRequest();

        api.assertThatResponse()
           .matchesSchema("src/test/resources/schemas/user-schema.json")
           .perform();
    }

    @Test
    public void validateUserListResponseSchema() {
        SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");

        api.get("/users")
           .setTargetStatusCode(200)
           .performRequest();

        api.assertThatResponse()
           .matchesSchema("src/test/resources/schemas/user-list-schema.json")
           .perform();
    }

    @Test
    public void verifyResponseIsNotAdminSchema() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");

        api.get("/users/1")
           .setTargetStatusCode(200)
           .performRequest();

        // Confirm the response does not expose admin-only fields
        api.assertThatResponse()
           .doesNotMatchSchema("src/test/resources/schemas/admin-schema.json")
           .perform();
    }
}
```

---

## Schema for a List Response

```json title="user-list-schema.json"
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "name", "email"],
    "properties": {
      "id": { "type": "integer" },
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" }
    }
  }
}
```

---

:::tip
Commit your schema files to source control alongside your tests. When a deliberate API contract change is made, update the schema and create a PR — making API contract changes explicit and reviewable.
:::

:::note
SHAFT uses the [JSON Schema Validator](https://github.com/java-json-tools/json-schema-validator) library under the hood, which supports JSON Schema Draft 4, 6, and 7.
:::
