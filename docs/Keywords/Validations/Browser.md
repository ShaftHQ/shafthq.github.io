---
id: Browser
title: Browser 
sidebar_labe: Browser
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
        driver.browser().assertThat().attribute(browserAttribute "url").perform();
        driver.browser().assertThat().title().perform();
        //make verification
        driver.browser().verifyThat().attribute(browserAttribute "url").perform();
        driver.browser().verifyThat().title().perform();
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
        driver.browser().assertThat().attribute(browserAttribute "title").perform();
        driver.browser().assertThat().url().perform();
        //make verification
        driver.browser().verifyThat().attribute(browserAttribute "title").perform();
        driver.browser().assertThat().url().perform();
    }
    
}
```