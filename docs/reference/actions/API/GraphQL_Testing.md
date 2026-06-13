---
id: GraphQL_Testing
title: GraphQL API Testing
sidebar_label: GraphQL Testing
description: "Test GraphQL APIs in SHAFT Engine — send queries, mutations, and subscriptions with variables, fragments, and authentication headers using sendGraphQlRequest."
keywords: [SHAFT, GraphQL, API testing, GraphQL query, variables, fragments, mutations, sendGraphQlRequest]
tags: [api, graphql, rest-assured]
---

SHAFT Engine provides first-class GraphQL support through `RestActions.sendGraphQlRequest()` and its overloads. You can send **queries**, **mutations**, and **subscriptions** with or without variables, fragments, and custom authentication headers — all with the same fluent assertion API used for REST requests.

---

## Simple Query

Send a basic GraphQL query and validate the response:

```java title="GraphQLTesting.java"
import com.shaft.api.RestActions;
import io.restassured.response.Response;

// Simple GraphQL query
Response response = RestActions.sendGraphQlRequest(
    "https://api.example.com/graphql",
    "{ users { id name email } }"
);

// Assert HTTP 200
response.then().statusCode(200);
```

---

## Query with Variables

Pass a variables JSON string alongside the query:

```java title="GraphQLTesting.java"
// GraphQL query with variables
String query = "query GetUser($id: ID!) { user(id: $id) { name email } }";
String variables = "{\"id\": \"123\"}";

Response response = RestActions.sendGraphQlRequest(
    "https://api.example.com/graphql",
    query,
    variables
);
```

---

## Query with Fragment

Use GraphQL fragments for reusable field selections:

```java title="GraphQLTesting.java"
String fragment = "fragment UserFields on User { id name email role }";

Response response = RestActions.sendGraphQlRequest(
    "https://api.example.com/graphql",
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

Response response = RestActions.sendGraphQlRequestWithHeader(
    "https://api.example.com/graphql",
    "{ users { ...UserFields } }",
    null,
    fragment,
    "Authorization", "Bearer mytoken123"
);
```

---

## Complete Test Example

```java title="GraphQLTest.java"
import com.shaft.api.RestActions;
import io.restassured.response.Response;
import org.testng.annotations.Test;

public class GraphQLTest {

    @Test
    public void queryAllUsers() {
        Response response = RestActions.sendGraphQlRequest(
            "https://api.example.com/graphql",
            "{ users { id name email } }"
        );
        response.then()
            .statusCode(200)
            .body("data.users", org.hamcrest.Matchers.not(org.hamcrest.Matchers.empty()));
    }

    @Test
    public void queryUserById() {
        String query = "query GetUser($id: ID!) { user(id: $id) { name email } }";
        String variables = "{\"id\": \"1\"}";

        Response response = RestActions.sendGraphQlRequest(
            "https://api.example.com/graphql",
            query,
            variables
        );
        response.then()
            .statusCode(200)
            .body("data.user.email", org.hamcrest.Matchers.notNullValue());
    }

    @Test
    public void createUserMutation() {
        String mutation = "mutation CreateUser($input: CreateUserInput!) { "
            + "createUser(input: $input) { id name email } }";
        String variables = "{\"input\": {\"name\": \"Jane\", \"email\": \"jane@example.com\"}}";

        Response response = RestActions.sendGraphQlRequest(
            "https://api.example.com/graphql",
            mutation,
            variables
        );
        response.then()
            .statusCode(200)
            .body("data.createUser.id", org.hamcrest.Matchers.notNullValue());
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
   .setTargetStatusCode(200)
   .performRequest();

api.assertThatResponse()
   .extractedJsonValue("data.users[0].name")
   .isEqualTo("John Doe")
   .perform();
```

---

:::tip
Use the `variables` parameter instead of string interpolation in GraphQL queries to avoid injection issues and improve readability.
:::

:::note
GraphQL APIs typically return HTTP 200 even when errors occur — always validate the `errors` field in the response body alongside the status code.
:::
