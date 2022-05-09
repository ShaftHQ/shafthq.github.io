---
id: Nums
title: Numbers Validations 
sidebar_labe: Numbers Validations
---

#### We can make many assertions and verifications on numbers by using the _Class NumberValidationsBuilder_ through using the following methods:

###### 1. isEqualTo():
* We use this method to check that the actual number is equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isEqualTo((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isEqualTo((Number) expectedValue).perform();
    }
}
```

###### 2. equals():
* This method overrides the default object method equals and is the same as calling isEqualTo((Number) expectedValue).perform();* * So we use this method to check that the actual number is equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a boolean value true if passed and throws AssertionError if failed (return value can be safely ignored).

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).equals((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).equals((Number) expectedValue).perform();
    }
}
```

###### 3. doesNotEqual():
* We use this method to check that the actual number does not equal the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).doesNotEqual((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).doesNotEqual((Number) expectedValue).perform();
    }
}
```

###### 4. isGreaterThanOrEquals():
* We use this method to check that the actual number is greater than or equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isGreaterThanOrEquals((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isGreaterThanOrEquals((Number) expectedValue).perform();
    }
}
```


###### 5. isGreaterThan():
* We use this method to check that the actual number is greater than the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isGreaterThan((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isGreaterThan((Number) expectedValue).perform();
    }
}
```

###### 6. isLessThanOrEquals():
* We use this method to check that the actual number is less than or equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isLessThanOrEquals((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isLessThanOrEquals((Number) expectedValue).perform();
    }
}
```

###### 7. isLessThan():
* We use this method to check that the actual number is less than the expected value.
* expectedValue - the test data / expected value for the number under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().number((Number) actualNumber).isLessThan((Number) expectedValue).perform();
        //make verification
        Validations.verifyThat().number((Number) actualNumber).isLessThan((Number) expectedValue).perform();
    }
}
```
