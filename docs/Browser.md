---
id: Browser
title: Browser Validations 
sidebar_labe: Browser Validations
---

#### We can make many assertions and verifications on web the browser itself by using the _Class WebDriverBrowserValidationsBuilder_ through using the following methods:

###### 1. attribute():
* We use this method to check check against a certain browser attribute.
* Needed parameters: browserAttribute - the target browser attribute that will be checked against.
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).attribute().perform();
        //make verification
        Validations.verifyThat().browser(driver).attribute().perform();
    }
}
```

###### 2. url():
* We use this method to check against the current page URL.
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).
        //make verification
        Validations.verifyThat().browser(driver).
    }
}
```

###### 3. title():
* We use this method to check check against the current page title.
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().browser(driver).
        //make verification
        Validations.verifyThat().browser(driver).
    }
}
```