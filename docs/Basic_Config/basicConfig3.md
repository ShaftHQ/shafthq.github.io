---
id: basicConfig3
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

---

## Automatic Status Code Check

By default, SHAFT asserts that every response has a `2xx` status code. Disable this if you need to test non-2xx responses:

```properties title="src/main/resources/properties/custom.properties"
# Set to false if you want to test 4xx / 5xx responses without an automatic failure
automaticallyAssertResponseStatusCode=false
```

---

## Proxy

Only needed if you are behind a corporate proxy:

```properties title="src/main/resources/properties/custom.properties"
com.SHAFT.proxySettings=proxy.corp.example.com:8080
```

---

## Test Retries

```properties title="src/main/resources/properties/custom.properties"
# Retry a failed API test up to N times before marking it failed
retryMaximumNumberOfAttempts=3
```

---

## Swagger / OpenAPI Contract Validation

Enable automatic schema validation against a Swagger/OpenAPI specification file to ensure your API communication complies with the defined contract.

```properties title="src/main/resources/properties/custom.properties"
# Enable/disable Swagger schema validation
swagger.validation.enabled=true

# URL or file path to your Swagger / OpenAPI specification
swagger.validation.url=https://petstore.swagger.io/v2/swagger.json
```

When enabled, every request and response is validated against the schema automatically — no extra code needed in your tests.

---

:::tip
You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::

[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>