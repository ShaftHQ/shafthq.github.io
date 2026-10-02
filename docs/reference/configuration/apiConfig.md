---
id: apiConfig
title: Basic Configuration for API
sidebar_label: API
description: "Configure SHAFT Engine properties for REST API testing — proxy, timeouts, retry settings, and Swagger/OpenAPI schema validation."
keywords: [SHAFT, API configuration, REST API settings, Swagger validation, OpenAPI, API timeout, proxy configuration]
tags: [api, configuration, rest-assured]
---

The properties below apply to all `SHAFT.API` (REST Assured) test executions. Place them in your `custom.properties` file to adjust connectivity, timeouts, and contract validation.

---

## Connection & Timeouts

```properties title="src/main/resources/properties/custom.properties"
# Timeout (seconds) for reading data from the server socket
apiSocketTimeout=30

# Timeout (seconds) to establish a TCP connection
apiConnectionTimeout=30

# Timeout (seconds) to acquire a connection from the pool
apiConnectionManagerTimeout=30
```

- These timeouts are read when each request runs, so a `SHAFT.Properties.timeouts.set()` call after `new SHAFT.API(...)` still applies. They are per thread.
- `0` means no timeout. The maximum is `2147483` seconds.
- Empty, non-numeric, or out-of-range values fail fast with the key, the value, and a `Fix:` line.

---

## Status Code Assertions

By default, SHAFT asserts that every response has a `2xx` status code.

```properties title="src/main/resources/properties/custom.properties"
# Disables only the implicit 2xx check for requests that set no target status code
automaticallyAssertResponseStatusCode=false
```

- An explicit `setTargetStatusCode(n)` is **always** asserted, whatever this flag says. For negative tests, set the expected `4xx`/`5xx` status instead of turning the flag off.
- `setTargetStatusCode(0)` means "no explicit target". Any other value must be a three-digit status (`100`–`999`); anything else fails fast with a `Fix:` line.
- The flag is read when each request runs, so `SHAFT.Properties.flags.set()` after `new SHAFT.API(...)` applies.
- Booleans accept `true`/`false` in any case, with surrounding whitespace. Invalid or empty values fail with the key, the value, and a `Fix:` line.
- A failure with no target reads `Expected a 2xx status but found N`.
- A status mismatch is an `AssertionError` (an `Error`, not an `Exception`), so Failsafe or retry policies that handle only `Exception` will not retry it.

---

## Proxy

Only needed if you are behind a corporate proxy:

```properties title="src/main/resources/properties/custom.properties"
com.SHAFT.proxySettings=proxy.corp.example.com:8080
```

---

## Test Retries

```properties title="src/main/resources/properties/custom.properties"
# Example: allow three additional attempts after the first failure
retryMaximumNumberOfAttempts=3
```

The default is `0`, so retries are opt-in.

---

## Swagger / OpenAPI Contract Validation

Enable automatic schema validation against a Swagger/OpenAPI specification file to ensure your API communication complies with the defined contract.

```properties title="src/main/resources/properties/custom.properties"
# Enable/disable Swagger schema validation
swagger.validation.enabled=true

# URL or file path to your Swagger / OpenAPI specification
swagger.validation.url=https://petstore.swagger.io/v2/swagger.json

# Include an end-of-run operation coverage report
openapi.coverage.report.enabled=true

# Optional minimum operation coverage percentage; 0 disables threshold enforcement
openapi.coverage.threshold=80
```

When validation is enabled, every request and response is validated against the schema automatically. If `swagger.validation.enabled=true` or `openapi.coverage.report.enabled=true` and `swagger.validation.url` is missing or blank, the run fails with a `Fix:` line. Invalid values for `swagger.validation.enabled`, `openapi.coverage.report.enabled`, and `openapi.coverage.threshold` fail with the key, the value, and a `Fix:` line. When coverage reporting is enabled, SHAFT also summarizes exercised operations, untested operations, unmatched requests, and validation failures by operation ID at the end of the run.

---

:::tip
You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::

[property types]: /docs/reference/properties/PropertyTypes
[full list of supported properties]: /docs/reference/properties/PropertiesList

## Related

- [Property Types](/docs/reference/properties/PropertyTypes)
- [Properties List](/docs/reference/properties/PropertiesList)
- [Common Examples](/docs/reference/properties/CommonExamples)
