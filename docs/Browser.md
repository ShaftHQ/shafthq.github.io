---
id: Browser
title: Browser Validations 
sidebar_labe: Browser Validations
---

#### We can make many assertions and verifications on web the browser itself by using the _Class WebDriverBrowserValidationsBuilder_ through using the following methods:

###### attribute():
* We use this method to check check against a certain browser attribute.
* Needed parameters: browserAttribute - the target browser attribute that will be checked against. So we can pass as a string the required browser attribute like url or tilte
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).attribute(browserAttribute "url").perform();
        Validations.assertThat().browser(driver).attribute(browserAttribute "title").perform();
        //make verification
        Validations.verifyThat().browser(driver).attribute(browserAttribute "url").perform();
        Validations.verifyThat().browser(driver).attribute(browserAttribute "title").perform();
    }
}
```