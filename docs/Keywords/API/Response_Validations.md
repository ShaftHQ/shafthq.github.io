---
id: Response_Validations
title: Response Validations
sidebar_label: Response Validations
---

## SHAFT API Response Validations
Using the SHAFT API object to directly validate on the latest response directly is very convenient, let's see! <br/>
We need to use the SHAFT API Object then use the **assertThatResponse()** method (for hard assertion) or **verifyThatResponse()** method (for soft assertion) to access all the response validation methods, and ofcourse we need to add the **perform();** in the end to perform the validation correctly. <br/><br/>

### Body
Validate on the response body <br />
_* Calls the [Object validation methods](https://shafthq.github.io/SHAFT_Engine_Docusaurus/docs/Keywords/Validations/Objects) to contiue building your validation. *_

```java
api.assertThatResponse().body().contains("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
api.assertThatResponse().body().contains("Beverly Hills").perform();
```

### Extracted Json Value
Validate on an extracted value from the response body by parsing the target **JSONPath.** <br />
_* To extract the desired value, please refer to these urls for examples: <br /> 
You can learn the JSONPath Syntax from [here](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) <br />
And test your JSONPath [here](http://jsonpath.com/) *_  <br />
_* Calls the [Object validation methods](https://shafthq.github.io/SHAFT_Engine_Docusaurus/docs/Keywords/Validations/Objects) to contiue building your validation. *_

```java
api.assertThatResponse().extractedJsonValue("jsonPath").isEqualTo("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/users").perform();
api.assertThatResponse().extractedJsonValue("$[?(@.name=='Chelsey Dietrich')].id").isEqualTo("5").perform();
```

### Extracted Json Value As List
Validate on an extracted value from the response body by parsing the target **JSONPath** as list and check every item against it <br />
_* To extract the desired value, please refer to these urls for examples: <br /> 
You can learn the JSONPath Syntax from [here](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) <br />
And test your JSONPath [here](http://jsonpath.com/) *_  <br />
_* Calls the [Object validation methods](https://shafthq.github.io/SHAFT_Engine_Docusaurus/docs/Keywords/Validations/Objects) to contiue building your validation. *_

```java
api.assertThatResponse().extractedJsonValueAsList("jsonPath").isEqualTo("data").perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("https://jsonplaceholder.typicode.com");
api.get("/todos").perform();
api.verifyThatResponse().extractedJsonValueAsList("$[?(@.completed==true)].completed").isEqualTo("true").perform();
```

### Time
Validate on the response time. <br />
_* Calls the [Number validation methods](https://shafthq.github.io/SHAFT_Engine_Docusaurus/docs/Keywords/Validations/Nums) to contiue building your validation. *_

```java
api.assertThatResponse().time().isEqualTo(expectedNumberValue).perform();
```
#### Usage
```java
SHAFT.API api = new SHAFT.API("http://api.zippopotam.us/");
api.get("us/90210").perform();
api.verifyThatResponse().isGreaterThanOrEquals(1.1).perform();
api.verifyThatResponse().isLessThanOrEquals(100000).perform();
```

### Is Equal To File Content
Validate if the content of the provided actual response object is equal to the expected file content.
```java
api.assertThatResponse().isEqualToFileContent("fileRelativePath").perform();
```

### Does Not Equal File Content
Validate if the content of the provided actual response object is not equal to the expected file content.
```java
api.assertThatResponse().doesNotEqualFileContent("fileRelativePath").perform();
```

### Is Equal To File Content Ignoring Order
Validate if the content of the provided actual response object is equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().isEqualToFileContentIgnoringOrder("fileRelativePath").perform();
```

### Does Not Equal File Content Ignoring Order
Validate if the content of the provided actual response object is not equal to the expected file content while ignoring Order of the json objects.
```java
api.assertThatResponse().doesNotEqualFileContentIgnoringOrder("fileRelativePath").perform();
```

### Contains File Content
Validate if the content of the provided actual response object contains the expected file content.
```java
api.assertThatResponse().containsFileContent("fileRelativePath").perform();
```

### Does not Contain File Content
Validate if the content of the provided actual response object does not contains the expected file content.
```java
api.assertThatResponse().doesNotContainFileContent("fileRelativePath").perform();
```

### Matches Schema
Validate if the content of the provided actual response object matches the schema for the expected file content.
```java
api.assertThatResponse().matchesSchema("fileRelativePath").perform();
```

### Does Not Match Schema
Validate if the content of the provided actual response object does not match the schema for the expected file content.
```java
api.assertThatResponse().doesNotMatchSchema("fileRelativePath").perform();
```