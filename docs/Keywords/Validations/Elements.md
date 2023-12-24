---
id: Elements
title: Element 
sidebar_labe: Element
---

#### We can make many assertions and verifications on web elements by using the _Class WebDriverElementValidationsBuilder_ through using the following methods:

###  exists():
* We use this method to check that the target element exists. 
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation. 

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        driver.element().assertThat(locator).exists().perform();
        //make verification
        driver.element().verifyThat(locator).exists().perform();
    }
}
```
###  doesNotExist():
* We use this method to check that the target element does not exist. 
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        driver.element().assertThat(locator).doesNotExist().perform();
        //make verification
        driver.element().verifyThat(locator).doesNotExist().perform();
    }
}
```

###  matchesReferenceImage():
* We use this method to check that the target element matches a reference image (using the Artificial Intelligence library OpenCV). On the first test run this method will take a screenshot of the target element and the test will pass, and on following runs the element will be compared against that reference image. The reference images are stored under src/test/resources/DynamicObjectRepository for later maintenance. This method returns.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        driver.element().assertThat(locator).matchesReferenceImage().perform();
        //make verification
        driver.element().verifyThat(locator).matchesReferenceImage().perform();
    }
}
```

###  doesNotMatchReferenceImage():
* We use this method to check that the target element does not match a reference image (using the Artificial Intelligence library OpenCV). On the first test run this method will take a screenshot of the target element and the test will pass, and on following runs the element will be compared against that reference image. The reference images are stored under src/test/resources/DynamicObjectRepository for later maintenance.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        driver.element().assertThat(locator).doesNotMatchReferenceImage().perform();
        //make verification
        driver.element().verifyThat(locator).doesNotMatchReferenceImage().perform();
    }
}
```

###  attribute():
* We use this method to check against a certain element attribute if it is isEqualTo, Contians, equals, doesNotEqual, doesNotContain, isTrue, isFalse, ...
* Needed parameters: elementAttribute - the target element attribute that will be checked against.
* This method returns a NativeValidationsBuilder object to continue building your validation. 
* Note that we can make other validations upon the attribute like:
_isTrue_ , _isFalse_, _isEqualTo_, _doseNotEqualTo_, _equals_, _contains_, _doseNotContain_, _isNull_, _isNotNull_, etc. 
```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        driver.element().assertThat(locator).attribute(attributeName).perform();
        //make verification
        driver.element().verifyThat(locator).attribute(attributeName).perform();
    }         
}     
```

###  isSelected():
* We use this method to check against the provided elements selected attribute
* This method returns a NativeValidationsBuilder object to continue building your validation
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isSelected().perform();
            //make verification
            driver.element().verifyThat(locator).isSelected().perform();
        }
}
```

###  isChecked():
* We use this method to check against the provided elements checked attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isChecked().perform();
            //make verification
            driver.element().verifyThat(locator).isChecked().perform();
        }
}
```

###  isVisible():
* We use this method to check against the provided elements hidden attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isVisible().perform();
            //make verification
            driver.element().verifyThat(locator).isVisible().perform();
        }
}
```
    
###  isEnabled():
* We use this method to check against the provided elements disabled attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isEnabled().perform();
            //make verification
            driver.element().verifyThat(locator).isEnabled().perform();
        }
}
```
    
###  isNotSelected():
* We use this method to check against the provided elements selected attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isNotSelected().perform();
            //make verification
            driver.element().verifyThat(locator).isNotSelected().perform();
        }
}
```

###  isNotChecked():
* We use this method to check against the provided elements checked attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isNotChecked().perform();
            //make verification
            driver.element().verifyThat(locator).isNotChecked().perform();
        }
}
```

###  isHidden():
* We use this method to check against the provided elements hidden attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isHidden().perform();
            //make verification
            driver.element().verifyThat(locator).isHidden().perform();
    }
}
```

###  isDisabled():
* We use this method to check against the provided elements disabled attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
            public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).isDisabled().perform();
            //make verification
            driver.element().verifyThat(locator).isDisabled().perform();
    }
}
```
###  text():
* We use this method to check against the provided elements text attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
* Note that we can make other validations upon the attribute like:
_isTrue_ , _isFalse_, _isEqualTo_, _doseNotEqualTo_, _equals_, _contains_, _doseNotContain_, _isNull_, _isNotNull_, etc.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
            public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).text().perform();
            //make verification
            driver.element().verifyThat(locator).text().perform();
        }
}
```
###  textTrimmed():
* We Use this to check against the provided elements text attribute after it's trimmed (all leading and trailing space removed).
* This method returns a NativeValidationsBuilder object to continue building your validation.
* Note that we can make other validations upon the attribute like:
_isTrue_ , _isFalse_, _isEqualTo_, _doseNotEqualTo_, _equals_, _contains_, _doseNotContain_, _isNull_, _isNotNull_, etc.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
            public void testValidations(){
            //make assertion
            driver.element().assertThat(locator).textTrimmed().perform();
            //make verification
            driver.element().verifyThat(locator).textTrimmed().perform();
        }
}
```

    

    


 
