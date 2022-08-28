---
id: Browser
title: Browser Validations 
sidebar_labe: Browser Validations
---

#### We can make many assertions and verifications on web the browser itself by using the _Class WebDriverBrowserValidationsBuilder_ through using the following methods:

## attribute():
* We use this method to check check against a certain browser attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.

###  attribute (url):
* We can use this method to validate the browser URL.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).attribute(browserAttribute "url").perform();
        //make verification
        Validations.verifyThat().browser(driver).attribute(browserAttribute "url").perform();
    }
}
```
###  attribute (title):
* We can use this method to validate the tab tilte.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).attribute(browserAttribute "title").perform();
        //make verification
        Validations.verifyThat().browser(driver).attribute(browserAttribute "title").perform();
    }
}
```