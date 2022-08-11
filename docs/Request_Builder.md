---
id: Request_Builder
title: Request Builder
sidebar_label: Request Builder
---

## SHAFT API

In order to interact with APIs, you need an instance of SHAFT.API class and give it the base serviceURI

```java
api = new SHAFT.API("https://jsonplaceholder.typicode.com");
```
Now you have api object with the base serviceURI to start working with it with the Request Builder

## Request Builder

Now you can start building your request with the request builder and add the methods you need from the below methods.
Then you need to add the **perform()** method at the end to trigger the request and get back the response object.

**Note:** A request usually has only one of the following: urlArguments, parameters+type, or body

### Request Method
Add the request method and give it the serviceName

#### Get
```java
api.get("/posts").perform();
```
#### Post
```java
api.post("/posts").perform();
```
#### Put
```java
api.put("/posts/1").perform();
```
#### Patch
```java
api.patch("/posts/1").perform();
```
#### Delete
```java
api.delete("/posts/1").perform();
```

### Set Authentication
Set the authentication method that will be used by the API request that you're currently building. By default, this value is set to AuthenticationType.NONE but you can change it by calling this method. If you use thie method the authentication token will be saved automatically for all the following requests using the same session.

#### Authentication Type NONE
```java
api.setAuthentication("username", "password", AuthenticationType.NONE).perform();
```

#### Authentication Type FORM
```java
api.setAuthentication("username", "password", AuthenticationType.FORM).perform();
```

#### Authentication Type BASIC
```java
api.setAuthentication("username", "password", AuthenticationType.BASIC).perform();
```

### Add Cookie
Append a cookie to the current session to be used in the current and all the following requests. This feature is commonly used for authentication cookies.
```java
api.addCookie("session_id", "1234").perform();
```

### Set Target Status Code
Sets the expected target status code for the API request that you're currently building. By default, this value is set to 200, but you can change it by calling the **setTargetStatusCode** method.
```java
api.setTargetStatusCode(200).perform();
```

### Set Content Type
Sets the content type for the API request that you're currently building. 
By default, this value is set to **ContentType.ANY** but you can change it by calling the **setContentType** method and giving it the enum value you want.

contentType Enumeration of common [IANA](http://www.iana.org/assignments/media-types/media-types.xhtml) content-types. This may be used to specify a request or response content-type more easily than specifying the full string each time. Example: **ContentType.JSON**
```java
api.setContentType(ContentType.JSON).perform();
```

### Add Header
Append a header to the current session to be used in the current and all the following requests.
This feature is commonly used for authentication tokens
```java
api.addHeader("Accept-Charset", "utf-8").perform();
```

### Set Request Body
Sets the body (if any) for the API request that you're currently building.
#### String Body
```java
String body = """
         {
            "name": "adam",
            "job": "engineer"
        }""";
api.setRequestBody(body).perform();
```
#### String Hash Map
```java
HashMap body = new HashMap<>();
body.put("name", "adam");
body.put("job", "engineer");
api.setRequestBody(body).perform();
```
#### String JSONObject
```java
JSONObject body = new JSONObject();
body.put("name", "adam");
body.put("job", "engineer");
api.setRequestBody(body).perform();
```

### Set Parameters
Sets the parameters (if any) for the API request that you're currently building.

#### Parameters Type FORM
```java
List<List<Object>> parameters = Arrays.asList(Arrays.asList("username", "john"), Arrays.asList("password","1234"));
api.setParameters(parameters, RestActions.ParametersType.FORM).perform();
```
#### Parameters Type QUERY
```java
List<List<Object>> parameters = Arrays.asList(Arrays.asList("search", "john"), Arrays.asList("orderBy","desc"));
api.setParameters(parameters, RestActions.ParametersType.QUERY).perform();
```

### Set URL Arguments
Sets the url arguments (if any) for the API request that you're currently building.
```java
api.setUrlArguments("username=john&password=1234").perform();
```

### Add Config
Append a config to the current session to be used in the current and all the following requests.
```java
RestAssured.config = RestAssured.config().redirect(RedirectConfig.redirectConfig().followRedirects(false));
api.addConfig(RestAssured.config).perform();
```

### Enable URL Encoding
Tells whether REST Assured should automatically encode the URI if not defined explicitly. Note that this does not affect multipart form data. Default is true.
```java
api.enableUrlEncoding(false).perform();
```

### Use Relaxed HTTPS Validation
set useRelaxedHTTPSValidation configuration to trust all hosts regardless if the SSL certificate is invalid in the request builder 'SSL' is the protocol name by default

```java
api.useRelaxedHTTPSValidation().perform();
```
```java
api.useRelaxedHTTPSValidation("SSL").perform();
```

### Append Default Content Charset To Content Type If Undefined
Tells whether REST Assured should automatically append the content charset to the content-type header if not defined explicitly. Note that this does not affect multipart form data. Default is true.
```java
api.appendDefaultContentCharsetToContentTypeIfUndefined(false).perform();
```
<br/><br/>

#### _** \*Please check the [Response Validations](https://shafthq.github.io/SHAFT_Engine_Docusaurus/docs/Response) as we can make many assertions and verifications on API response by using the Class [RestValidationsBuilder](https://shafthq.github.io/SHAFT_ENGINE/apidocs/com/shaft/validation/RestValidationsBuilder.html)\* **_  

## Sample Code Snippet
```java
public class Test_Api {
    SHAFT.API driver;

    @Test
    public void test_get() {
        driver = new SHAFT.API("https://jsonplaceholder.typicode.com");
        driver.get("/users").perform();
        driver.assertThatResponse().extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id").isEqualTo("5").perform();
    }
    
    @Test
    public void test_post() {
        driver = new SHAFT.API("https://reqres.in/");
        String body = """
                {
                    "name": "morpheus",
                    "job": "leader"
                }""";
        driver.post("api/users").setRequestBody(body).setTargetStatusCode(201).setContentType(ContentType.JSON).perform();
        driver.assertThatResponse().extractedJsonValue("name").isEqualTo("morpheus").withCustomReportMessage("Check that Morpheus exists.").perform();
    }

}
```
