---
id: Elements
title: Elements Validations 
sidebar_labe: Element Validations
---

#### We can make many assertions and verifications on web elements by using the _Class WebDriverElementValidationsBuilder_ through using the following methods:

###### 1. exists():
* We use this method to check that the target element exists. 
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation. 

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().element(driver, locator).exists().perform();
        //make verification
        Validations.verifyThat().element(driver, locator).exists().perform();
    }
}
```
###### 2. doesNotExist():
* We use this method to check that the target element does not exist. 
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().element(driver, locator).doesNotExist().perform();
        //make verification
        Validations.verifyThat().element(driver, locator).doesNotExist().perform();
    }
}
```

###### 3. matchesReferenceImage():
* We use this method to check that the target element matches a reference image (using the Artificial Intelligence library OpenCV). On the first test run this method will take a screenshot of the target element and the test will pass, and on following runs the element will be compared against that reference image. The reference images are stored under src/test/resources/DynamicObjectRepository for later maintenance. This method returns.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().element(driver, locator).matchesReferenceImage().perform();
        //make verification
        Validations.verifyThat().element(driver, locator).matchesReferenceImage().perform();
    }
}
```

###### 4. doesNotMatchReferenceImage():
* We use this method to check that the target element does not match a reference image (using the Artificial Intelligence library OpenCV). On the first test run this method will take a screenshot of the target element and the test will pass, and on following runs the element will be compared against that reference image. The reference images are stored under src/test/resources/DynamicObjectRepository for later maintenance.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().element(driver, locator).doesNotMatchReferenceImage().perform();
        //make verification
        Validations.verifyThat().element(driver, locator).doesNotMatchReferenceImage().perform();
    }
}
```

###### 5. attribute():
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
        Validations.assertThat().element(driver, locator).attribute(attributeName).perform();
        //make verification
        Validations.verifyThat().element(driver, locator).attribute(attributeName).perform();
    }         
}     
```

###### 6. isSelected():
* We use this method to check against the provided elements selected attribute
* This method returns a NativeValidationsBuilder object to continue building your validation
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isSelected().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isSelected().perform();
        }
}
```

###### 7. isChecked():
* We use this method to check against the provided elements checked attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isChecked().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isChecked().perform();
        }
}
```

###### 8. isVisible():
* We use this method to check against the provided elements hidden attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isVisible().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isVisible().perform();
        }
}
```
    
###### 9. isEnabled():
* We use this method to check against the provided elements disabled attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
import com.shaft.validation.Validations;
public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isEnabled().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isEnabled().perform();
        }
}
```
    
###### 10. isNotSelected():
* We use this method to check against the provided elements selected attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isNotSelected().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isNotSelected().perform();
    }
}
```

###### 11. isNotChecked():
* We use this method to check against the provided elements checked attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isNotChecked().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isNotChecked().perform();
    }
}
```

###### 12. isHidden():
* We use this method to check against the provided elements hidden attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
        public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isHidden().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isHidden().perform();
    }
}
```

###### 13. isDisabled():
* We use this method to check against the provided elements disabled attribute.
* This method returns a NativeValidationsBuilder object to continue building your validation.
```java
    import com.shaft.validation.Validations;
    public class Testing {
        @Test
            public void testValidations(){
            //make assertion
            Validations.assertThat().element(driver, locator).isDisabled().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).isDisabled().perform();
    }
}
```
###### 14. text():
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
            Validations.assertThat().element(driver, locator).text().perform();
            //make verification
            Validations.verifyThat().element(driver, locator).text().perform();
    }
}
```

    

    


 