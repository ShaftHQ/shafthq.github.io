---
id: GraphQL_Testing
title: GraphQL API Testing
sidebar_label: GraphQL Testing
description: "Test GraphQL APIs in SHAFT Engine — send queries, mutations, and subscriptions with variables, fragments, and authentication headers using SHAFT.API."
keywords: [SHAFT, GraphQL, API testing, GraphQL query, variables, fragments, mutations, sendGraphQlRequest]
tags: [api, graphql, rest-assured]
---

SHAFT Engine provides first-class GraphQL support through `SHAFT.API.sendGraphQlRequest()`. It returns the normal request builder, so **queries**, **mutations**, variables, fragments, authentication headers, status checks, and response assertions all use the same fluent API as REST requests.

---

## Simple Query

Send a basic GraphQL query and validate the response:

```java title="GraphQLTesting.java"
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.sendGraphQlRequest(
    "/graphql",
    "{ users { id name email } }"
);

// Assert response content
api.assertThatResponse().extractedJsonValue("data.users").isNotNull();
```

---

## Query with Variables

Pass a variables JSON string alongside the query:

```java title="GraphQLTesting.java"
// GraphQL query with variables
String query = "query GetUser($id: ID!) { user(id: $id) { name email } }";
String variables = "{\"id\": \"123\"}";

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.sendGraphQlRequest(
    "/graphql",
    query,
    variables
);
```

---

## Query with Fragment

Use GraphQL fragments for reusable field selections:

```java title="GraphQLTesting.java"
String fragment = "fragment UserFields on User { id name email role }";

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.sendGraphQlRequest(
    "/graphql",
    "{ users { ...UserFields } }",
    null,
    fragment
);
```

---

## Query with Authentication Header

Add a custom header (e.g., Bearer token) alongside the query:

```java title="GraphQLTesting.java"
// GraphQL with fragment and auth header
String fragment = "fragment UserFields on User { id name email role }";

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.sendGraphQlRequest(
    "/graphql",
    "{ users { ...UserFields } }",
    null,
    fragment
).addHeader("Authorization", "Bearer mytoken123");
```

---

## Complete Test Example

```java title="GraphQLTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.Test;

public class GraphQLTest {

    @Test
    public void queryAllUsers() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");

        api.sendGraphQlRequest("/graphql", "{ users { id name email } }");

        api.assertThatResponse().extractedJsonValue("data.users").isNotNull();
    }

    @Test
    public void queryUserById() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");
        String query = "query GetUser($id: ID!) { user(id: $id) { name email } }";
        String variables = "{\"id\": \"1\"}";

        api.sendGraphQlRequest("/graphql", query, variables);

        api.assertThatResponse().extractedJsonValue("data.user.email").isNotNull();
    }

    @Test
    public void createUserMutation() {
        SHAFT.API api = new SHAFT.API("https://api.example.com");
        String mutation = "mutation CreateUser($input: CreateUserInput!) { "
            + "createUser(input: $input) { id name email } }";
        String variables = "{\"input\": {\"name\": \"Jane\", \"email\": \"jane@example.com\"}}";

        api.sendGraphQlRequest("/graphql", mutation, variables);

        api.assertThatResponse().extractedJsonValue("data.createUser.id").isNotNull();
    }
}
```

---

## Asserting with SHAFT Validations

You can also use SHAFT's built-in response validation for GraphQL responses:

```java title="GraphQLValidation.java"
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://api.example.com");

api.post("/graphql")
   .setRequestBody("{\"query\": \"{ users { id name } }\"}")
   .addHeader("Content-Type", "application/json")
   .setTargetStatusCode(200);

api.assertThatResponse()
   .extractedJsonValue("data.users[0].name")
   .isEqualTo("John Doe");
```

---

:::tip
Use the `variables` parameter instead of string interpolation in GraphQL queries to avoid injection issues and improve readability.
:::

:::note
GraphQL APIs typically return HTTP 200 even when errors occur — always validate the `errors` field in the response body alongside the status code.
:::

## Related

- [Request Builder](/docs/reference/actions/API/Request_Builder)
- [Response Validations](/docs/reference/actions/API/Response_Validations)
- [API Authentication](/docs/reference/actions/API/API_Authentication)
- [API](/docs/testing/api)
