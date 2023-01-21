---
id: ForceFail
title: Force Fail 
sidebar_labe: Force Fail
---

#### We can make a customized messages on reports and execute the perform() method via using the forceFails by using the _Class ValidationsExecutor_ through using the following methods:

###  withCustomReportMessage():
* We use this method to set a customized business-readable message that will appear in the execution report instead of the technical log message which will be nested under it.
* Needed parameters: customReportMessage - the message that you would like to describe this validation in the execution report.
* This method returns the current ValidationsExecutor object so that you can call the "perform()" method and execute this validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().forceFail().withCustomReportMessage(String customReportMessage).perform();
        //make verification
        Validations.verifyThat().forceFail().withCustomReportMessage(String customReportMessage).perform();
    }
}
```

####  perform():
* We use this method to Execute this validation as without using perform() method the validation method will note be executed regardless on which level we are trying to execute the validation; browser, element, object, number, etc. like previously noticed in the all last examples. 

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //file
        //make assertion
        Validations.assertThat().file(folderRelativePath, file name).doesNotExist().perform();
        //make verification
        Validations.verifyThat().file(folderRelativePath, file name).doesNotExist().perform();

        //number
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isEqualTo((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isEqualTo((Number) expectedValue).perform();

        //object
        //make assertion
        Validations.assertThat().object((Object) actualObject).isEqualTo((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isEqualTo((Object) expectedValue)).per
        
        //element
        //make assertion
        Validations.assertThat().element(driver, locator).exists().perform();
        //make verification
        Validations.verifyThat().element(driver, locator).exists().perform();
    }
}
```