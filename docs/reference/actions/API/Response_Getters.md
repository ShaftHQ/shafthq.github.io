---
id: Response_Getters
title: Response Getters
sidebar_label: Response Parsing
description: "Extract and parse API response data — body, typed JSON objects, status code, response time, JSON values, and XML values using SHAFT Engine."
keywords: [SHAFT, API response, response parsing, typed response, JSONPath, XML, status code, response time, REST API]
tags: [api, response, parsing, json]
---

## SHAFT API Getters
After getting back the [REST-Assured response](https://www.javadoc.io/doc/io.rest-assured/rest-assured/3.0.1/io/restassured/response/Response.html) object, we can use the getters to continue working with it when needed.

### Get Response Body
Extracts the response body and returns it as a plain string

```java
String body = api.getResponseBody();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
String body = api.getResponseBody();
SHAFT.Validations.assertThat().object(body).contains("Beverly Hills");
```

### Map JSON Response To Types
Maps the latest JSON response body to a Java class, record, list, or generic `TypeReference`.

```java
User user = api.getResponseAs(User.class);
List<User> users = api.getResponseAsList(User.class);
List<User> usersByType = api.getResponseAs(new TypeReference<List<User>>() {});
```

#### Usage
```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record User(int id, String name) {}

SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");

api.get("/users/1").setTargetStatusCode(200).perform();
User user = api.getResponseAs(User.class);

api.get("/users").setTargetStatusCode(200).perform();
List<User> users = api.getResponseAsList(User.class);

List<User> usersByType = api.getResponseAs(new TypeReference<List<User>>() {});
```

Typed mapping expects a JSON response content type and a non-empty body. SHAFT throws clear exceptions for empty bodies, non-JSON responses, and mapping failures.

### Get Response Status Code
Extracts the response status code as integer

```java
int statusCode = api.getResponseStatusCode();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
int statusCode = api.getResponseStatusCode();
SHAFT.Validations.assertThat().number(statusCode).isEqualTo(200);
```

### Get Response Time
Extracts the response time as long

```java
long responseTime = api.getResponseTime();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
long responseTime = api.getResponseTime();
SHAFT.Validations.verifyThat().number(responseTime).isGreaterThanOrEquals(1.1);
SHAFT.Validations.verifyThat().number(responseTime).isLessThanOrEquals(10000);
```

### Get Response JSON Value
Extracts a string value from the response body by parsing the target **JSONPath.** <br />
_* To extract the desired value, please refer to these urls for examples: <br /> 
You can learn the JSONPath Syntax from [here](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) <br />
And test your JSONPath [here](http://jsonpath.com/) *_
```java
String value = api.getResponseJSONValue("jsonPath");
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").perform();
String value = api.getResponseJSONValue("$[?(@.name=='Ervin Howell')].address.street");
SHAFT.Validations.assertThat().object(value).isEqualTo("Victor Plains");
```

### Get Response JSON Value As List
Extracts the response as list by parsing the target **JSONPath.**
```java
String value = api.getResponseJSONValueAsList("jsonPath");
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/todos").perform();
List<Object> completedList = api.getResponseJSONValueAsList("$[?(@.completed==true)].completed");
for (Object completed : completedList) {
    SHAFT.Validations.verifyThat().object(completed.toString()).isEqualTo("true");
}
```

### Get Response XML Value
```java
String value = api.getResponseXMLValue("xmlPath");
```

### Get Response XML Value As List
```java
List<Object> value = api.getResponseXMLValueAsList("xmlPath");
```

## Related

- [Request Builder](/docs/reference/actions/API/Request_Builder)
- [Response Validations](/docs/reference/actions/API/Response_Validations)
- [API Authentication](/docs/reference/actions/API/API_Authentication)
- [API](/docs/testing/api)
