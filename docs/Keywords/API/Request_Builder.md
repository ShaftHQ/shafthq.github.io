---
id: Request_Builder
title: Request Builder
sidebar_label: Builder
---

## SHAFT API

In order to interact with APIs, you need an instance of SHAFT.API class and give it the base serviceURI

```java
import com.shaft.driver.SHAFT;

SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
```
Now you have api object with the base serviceURI to start working with it with the Request Builder

## Request Builder

Now you can start building your request with the request builder and add the methods you need from the below methods.
Finally, you need to add the **perform()** method at the end to trigger the request and get back [REST-Assured response](https://www.javadoc.io/doc/io.rest-assured/rest-assured/3.0.1/io/restassured/response/Response.html) object to continue working with it when needed.

**Note:** A request usually has only one of the following: urlArguments, parameters+type, or body

### Request Method
Add the request method and give it the serviceName

#### Get
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/posts").perform();
```
#### Post
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.post("/posts").perform();
```
#### Put
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.put("/posts/1").perform();
```
#### Patch
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.patch("/posts/1").perform();
```
#### Delete
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.delete("/posts/1").perform();
```

### Set Authentication
Set the authentication method that will be used by the API request that you're currently building. By default, this value is set to AuthenticationType.NONE but you can change it by calling this method. If you use thie method the authentication token will be saved automatically for all the following requests using the same session.

#### Authentication Type BASIC
```java
SHAFT.API api = new SHAFT.API("https://postman-echo.com");
api.get("/basic-auth").setAuthentication("postman", "password", AuthenticationType.BASIC).perform();
```

#### Authentication Type FORM
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.get("serviceName").setAuthentication("username", "password", AuthenticationType.FORM).perform();
```

### Add Cookie
Append a cookie to the current session to be used in the current and all the following requests. This feature is commonly used for authentication cookies.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").addCookie("session_id", "1234").perform();
```
You can also use it directly without a request method to be used in all the following requests.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").perform();
api.addCookie("session_id", "1234");
```

### Set Target Status Code
Sets the expected target status code for the API request that you're currently building. By default, this value is set to 200, but you can change it by calling the **setTargetStatusCode** method.
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").setTargetStatusCode(200).perform();
```

### Set Content Type
Sets the content type for the API request that you're currently building. 
By default, this value is set to **ContentType.ANY** but you can change it by calling the **setContentType** method and giving it the enum value you want.

contentType Enumeration of common [IANA](http://www.iana.org/assignments/media-types/media-types.xhtml) content-types. This may be used to specify a request or response content-type more easily than specifying the full string each time. Example: **ContentType.JSON**
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").setContentType("application/json").perform();
```
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").setContentType(ContentType.JSON).perform();
```

### Add Header
Append a header to the current session **to be used in the current and all the following requests**.
This feature is commonly used for authentication tokens and other global headers as you need
```java
SHAFT.API api = new SHAFT.API("serviceURI");
String token = "@1234z"
api.post("serviceName").addHeader("Authorization", "Bearer " + token).perform();
```
You can add more than one header in the same request.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
String token = "@1234z"
api.post("serviceName").addHeader("Authorization", "Bearer " + token).addHeader("Accept-Charset", "utf-8").perform();
```
You can also use it directly without a request method to set the header for all the following requests.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").perform();
api.addHeader("Accept-Language", "en");
```

### Set Request Body
Sets the body (if any) for the API request that you're currently building.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").setRequestBody(body).perform();
```
#### Body as String
```java
SHAFT.API api = new SHAFT.API("https://reqres.in/");
String body = """
         {
            "name": "adam",
            "job": "engineer"
        }""";
api.post("api/users").setRequestBody(body).setContentType(ContentType.JSON).setTargetStatusCode(201).perform();
```
#### Body as Hash Map
```java
SHAFT.API api = new SHAFT.API("https://reqres.in/");
HashMap body = new HashMap<>();
body.put("name", "adam");
body.put("job", "engineer");
api.post("api/users").setRequestBody(body).setContentType(ContentType.JSON).setTargetStatusCode(201).perform();
```
#### Body as JSONObject
```java
SHAFT.API api = new SHAFT.API("https://reqres.in/");
JSONObject body = new JSONObject();
body.put("name", "adam");
body.put("job", "engineer");
api.post("api/users").setRequestBody(body).setContentType(ContentType.JSON).setTargetStatusCode(201).perform();
```

### Set Request Body From File
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").setRequestBodyFromFile("relativeFilePath").perform();
```
Having a request body as json file in this path "src/test/resources/testDataFiles/requestBody.json" like this:
```json
{
  "name": "morpheus",
  "job": "leader"
}
```
```java
SHAFT.API api = new SHAFT.API("https://reqres.in/");
api.post("api/users").setRequestBodyFromFile("src/test/resources/testDataFiles/requestBody.json").setTargetStatusCode(201).setContentType(ContentType.JSON).perform();
```

### Set Parameters
Sets the parameters (if any) for the API request that you're currently building.

#### Parameters Type FORM
Note that: Form parameter works with multipart/form-data requests.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
List<List<Object>> parameters = Arrays.asList(Arrays.asList("username", "john"), Arrays.asList("password","1234"));
api.post("serviceName").setParameters(parameters, RestActions.ParametersType.FORM).perform();
```
#### Parameters Type QUERY
```java
SHAFT.API api = new SHAFT.API("serviceURI");
List<List<Object>> parameters = Arrays.asList(Arrays.asList("search", "john"), Arrays.asList("orderBy","desc"));
api.get("serviceName").setParameters(parameters, RestActions.ParametersType.QUERY).perform();
```

### Set URL Arguments
Sets the url arguments (if any) for the API request that you're currently building.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").setUrlArguments("username=john&password=1234").perform();
```
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/comments").setUrlArguments("postId=1").setTargetStatusCode(201).perform();
```

### Add Config
Append a config to the current session to be used in the current and all the following requests.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
RestAssured.config = RestAssured.config().redirect(RedirectConfig.redirectConfig().followRedirects(false));
api.post("serviceName").addConfig(RestAssured.config).perform();
```
You can also use it directly without a request method to be used for all the following requests.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName");
RestAssured.config = RestAssured.config().redirect(RedirectConfig.redirectConfig().followRedirects(false));
api.addConfig(RestAssured.config).perform();
```

### Enable URL Encoding
Tells whether REST Assured should automatically encode the URI if not defined explicitly. Note that this does not affect multipart form data. Default is true.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").enableUrlEncoding(false).perform();
```

### Use Relaxed HTTPS Validation
set useRelaxedHTTPSValidation configuration to trust all hosts regardless if the SSL certificate is invalid in the request builder 'SSL' is the protocol name by default

```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.get("serviceName").useRelaxedHTTPSValidation().perform();
```
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.get("serviceName").useRelaxedHTTPSValidation("SSL").perform();
```

### Append Default Content Charset To Content Type If Undefined
Tells whether REST Assured should automatically append the content charset to the content-type header if not defined explicitly. Note that this does not affect multipart form data. Default is true.
```java
SHAFT.API api = new SHAFT.API("serviceURI");
api.post("serviceName").appendDefaultContentCharsetToContentTypeIfUndefined(false).perform();
```
<br/><br/>

#### _** \*Please check the [Response Validations](https://shafthq.github.io/docs/Keywords/API/Response_Validations) as we can make many assertions and verifications on API response by using the Class [RestValidationsBuilder](https://shafthq.github.io/SHAFT_ENGINE/apidocs/com/shaft/validation/RestValidationsBuilder.html)\* **_  

## Sample Code Snippet
```java
public class Test_Api {
    SHAFT.API api;

    @Test
    public void test_get() {
        api = new SHAFT.API("https://jsonplaceholder.typicode.com");
        api.get("/users").perform();
        api.assertThatResponse().extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id").isEqualTo("5").perform();
    }
    
    @Test
    public void test_post() {
        api = new SHAFT.API("https://reqres.in/");
        String body = """
                {
                    "name": "morpheus",
                    "job": "leader"
                }""";
        api.post("api/users").setRequestBody(body).setTargetStatusCode(201).setContentType(ContentType.JSON).perform();
        api.assertThatResponse().extractedJsonValue("name").isEqualTo("morpheus").withCustomReportMessage("Check that Morpheus exists.").perform();
    }

}
```
