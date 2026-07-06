---
slug: swagger-contract-validation
title: New Feature Announcement - Swagger Contract Validation
authors: [kyrillos]
tags: [shaft_engine, swagger, openapi, contract_testing]
---

# 🚀 SHAFT_Engine Now Supports Swagger/OpenAPI Contract Validation!

<a href="https://github.com/ShaftHQ/SHAFT_ENGINE" target="_blank">
  <img src="https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/master/src/main/resources/images/shaft.png" alt="SHAFT_Engine" height="50px" />
</a>

### Say goodbye to manual schema checks—contract testing is now automated and built right into SHAFT!

---

## 🛡️ What is Contract Validation?

**Contract testing** ensures your API requests and responses follow the defined structure (contract), helping prevent:
- Unexpected field changes
- Data type mismatches
- Missing or extra fields
- Runtime errors in API consumers

With the latest release, SHAFT now integrates Swagger/OpenAPI schema validation for all API tests. It will **fail your test automatically** if the request or response doesn’t match the OpenAPI spec you provide. 🔥

---

## 🔧 How to Enable It

### 📂 Via `custom.properties`

```properties showLineNumbers title="src/main/resources/properties/custom.properties"
swagger.validation.enabled=true
swagger.validation.url=https://petstore.swagger.io/v2/swagger.json
```

### 🧪 Or via Code

```java showLineNumbers
SHAFT.Properties.api.set().swaggerValidationEnabled(true);
SHAFT.Properties.api.set().swaggerValidationUrl("https://petstore.swagger.io/v2/swagger.json");
```

You can toggle validation dynamically per test or test class.

---

## ✅ What Gets Validated?

- Request structure (body, headers, parameters)
- Response structure (status, body schema)
- Alignment with your OpenAPI/Swagger definition

---

## 📄 Sample Test

```java showLineNumbers
@Test
public void testCreateUserWithContractValidation() {
    SHAFT.API api = new SHAFT.API("https://petstore.swagger.io/v2");

    String invalidPayload = "[{\"id\":\"INVALID_ID\"}]";

    api.post("/user/createWithList")
       .setRequestBody(invalidPayload)
       .setContentType("application/json");

    api.assertThatResponse().statusCode().isEqualTo(400);
}
```

> SHAFT will automatically validate the above request and response against the Swagger schema. ❌ If anything is off, your test will fail and report the contract violation.

---

## 🧐 Why It Matters

| Benefit              | Description                                                  |
|---------------------|--------------------------------------------------------------|
| 🧪 Test reliability  | Ensure tests align with backend changes                     |
| 🔁 Catch regressions | CI/CD-ready contract enforcement                            |
| ❌ Reduce flakiness  | Eliminate schema mismatch failures                          |
| 🔍 API governance    | Hold your APIs to their contract                            |

---
