---
id: Response_Getters
title: Response Getters
sidebar_label: Response Getters
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
SHAFT.Validations.assertThat().object(body).contains("Beverly Hills").perform();
```

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
SHAFT.Validations.assertThat().number(statusCode).isEqualTo(200).perform();
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
SHAFT.Validations.verifyThat().number(responseTime).isGreaterThanOrEquals(1.1).perform();
SHAFT.Validations.verifyThat().number(responseTime).isLessThanOrEquals(10000).perform();
```

### Get Response JSON Value
Extracts a string value from the response body by parsing the target **JSONPath.** <br />
_* To extract the desired value, please refer to these urls for examples: <br /> 
You can learn the JSONPath Syntax from [here](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) <br />
And test your JSONPath [here](http://jsonpath.com/) *_
```java
String value = api.getResponseJSONValue;
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").perform();
String value = api.getResponseJSONValue("$[?(@.name=='Ervin Howell')].address.street");
SHAFT.Validations.assertThat().object(value).isEqualTo("Victor Plains").perform();
```

### Get Response JSON Value As List
Extracts the response as list by parsing the target **JSONPath.**
```java
String value = api.getResponseJSONValueAsList();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/todos").perform();
List<Object> value = api.getResponseJSONValueAsList("$[?(@.completed==true)].completed");
for (Object completed : completedList) {
    SHAFT.Validations.verifyThat().object(completed.toString()).isEqualTo("true").perform();
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