---
id: gRPC_Testing
title: gRPC API Testing
sidebar_label: gRPC Testing
description: "Call gRPC services from SHAFT Engine without generated stubs, using server reflection or a descriptor set, and assert on JSON responses."
keywords: [SHAFT, gRPC, API testing, reflection, descriptor set, SHAFT.API.grpc]
tags: [api, grpc]
---

Use `SHAFT.API.grpc(target)` to make unary gRPC calls without generated stubs. SHAFT resolves message types through server reflection, or through a descriptor set you provide. Requests and responses are JSON, so the usual JSON assertions work on the result.

## Unary call with server reflection

```java
GrpcActions.Response response = SHAFT.API.grpc("localhost:50051")
        .unary("grpc.health.v1.Health/Check", "{\"service\":\"\"}");
SHAFT.Validations.assertThat().object(response.json("$.status")).isEqualTo("SERVING").perform();
```

## Descriptor set instead of reflection

Build the set with `protoc --include_imports --descriptor_set_out=services.desc ...`, then:

```java
SHAFT.API.grpc("localhost:50051")
        .withDescriptorSet(Path.of("services.desc"))
        .withTimeout(10)
        .unary("shop.Orders/Get", "{\"id\":42}");
```

## Status codes and errors

A non-OK status is returned rather than thrown: check `response.statusCode()` (for example `NOT_FOUND`) and `response.description()`. Each call is reported as an Allure step with the request, the response and the status code. For TLS or in-process channels, pass your own `io.grpc.Channel` to `SHAFT.API.grpc(channel)`.

## Related

- [Request Builder](/docs/reference/actions/API/Request_Builder)
- [Response Validations](/docs/reference/actions/API/Response_Validations)
- [GraphQL Testing](/docs/reference/actions/API/GraphQL_Testing)
- [API](/docs/testing/api)
