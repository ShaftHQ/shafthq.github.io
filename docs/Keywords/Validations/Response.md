---
id: Response
title: API
sidebar_labe: API
---

#### We can make many assertions and verifications on API response by using the _Class RestValidationsBuilder_ through using the following methods:

###  isEqualToFileContent():
* We use this method to check if the content of the provided actual response object is equal to the expected file content.
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).isEqualToFileContent(String fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).isEqualToFileContent(String fileRelativePath).perform();
    }
}
```

###  doesNotEqualFileContent():
* We use this method to check if the content of the provided actual response object is not equal to the expected file content. 
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).doesNotEqualFileContent(String fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).doesNotEqualFileContent(String fileRelativePath).perform();
    }
}
```

###  containsFileContent():
* We use this method to check if the content of the provided actual response object contains the expected file content. 
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).containsFileContent(String fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).containsFileContent(String fileRelativePath).perform();
    }
}
```


###  doesNotContainFileContent():
* We use this method to check if the content of the provided actual response object does not contain the expected file content. 
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).doesNotContainFileContent(String fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).doesNotContainFileContent(String fileRelativePath).perform();
    }
}
```


###  extractedJsonValue():
* We use this method to to extract a certain value from the provided actual response object and check against it. 
* Needed parameters: jsonPath - JSONPath of the target value; the JSONPath expression that will be evaluated in order to extract the desired value [without the trailing $.] , please refer to these urls for examples: https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html http://jsonpath.com/.
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).extractedJsonValue(String jsonPath).perform();
        //make verification
        Validations.verifyThat().response(Object response).extractedJsonValue(String jsonPath).perform();
    }
}
```


###  matchesSchema():
* We use this method to check if the content of the provided actual response object matches the schema for the expected file content. 
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat(.response(Object response).matchesSchema(String  fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).matchesSchema(String fileRelativePath).perform();
    }
}
```


###  doesNotMatchSchema():
* We use this method to check if the content of the provided actual response object matches the schema for the expected file content. 
* Needed parameters: fileRelativePath - relative path to the target expected response file.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().response(Object response).doesNotMatchSchema(String fileRelativePath).perform();
        //make verification
        Validations.verifyThat().response(Object response).doesNotMatchSchema(String fileRelativePath).perform();
    }
}
```

