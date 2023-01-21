---
id: Objects
title: Object 
sidebar_labe: Object
---

#### We can make many assertions and verifications on objects by using the _Class NativeValidationsBuilder_ through using the following methods:

###  isEqualTo():
* We use this method to check that the actual object is equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).isEqualTo((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isEqualTo((Object) expectedValue)).perform();
    }
}
```

###  equals():
* This method overrides the default object method equals and is the same as calling isEqualTo(expectedValue).perform();
* So we use this method to check that the actual object is equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a boolean value true if passed and throws AssertionError if failed (return value can be safely ignored).

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).equals((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).equals((Object) expectedValue)).perform();
    }
}
```

###  doesNotEqual():
* We use this method to check that the actual object is not equal to the expected value.
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).doesNotEqual((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).doesNotEqual((Object) expectedValue)).perform();
    }
}
```

###  contains():
* We use this method to check that the actual object contains the expected value.
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).contains((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).contains((Object) expectedValue)).perform();
    }
}
```

###  doesNotContain():
* We use this method to check that the actual object does not contain the expected value.
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).doesNotContain((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).doesNotContain((Object) expectedValue)).perform();
    }
}
```

###  matchesRegex():
* We use this method to check that the actual object matches the expected regular expression.
* Needed parameters: expectedValue - the test data / expected regular expression for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).matchesRegex((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).matchesRegex((Object) expectedValue)).perform();
    }
}
```

###  doesNotMatchRegex():
* We use this method to check that the actual object does not match the expected regular expression.
* Needed parameters: expectedValue - the test data / expected regular expression for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).doesNotMatchRegex((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).doesNotMatchRegex((Object) expectedValue)).perform();
    }
}
```

###  equalsIgnoringCaseSensitivity():
* We use this method to check that the actual object is equal to the expected value (ignoring case sensitivity).
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).equalsIgnoringCaseSensitivity((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).equalsIgnoringCaseSensitivity((Object) expectedValue)).perform();
    }
}
```

###  doesNotEqualIgnoringCaseSensitivity():
* We use this method to check that the actual object is not equal to the expected value (ignoring case sensitivity).
* Needed parameters: expectedValue - the test data / expected value for the object under test.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).doesNotEqualIgnoringCaseSensitivity((Object) expectedValue)).perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).doesNotEqualIgnoringCaseSensitivity((Object) expectedValue)).perform();
    }
}
```

###  isNull():
* We use this method to check that the actual object is null.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).isNull().perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isNull().perform();
    }
}
```

###  isNotNull():
* We use this method to check that the actual object is not null.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).isNotNull().perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isNotNull().perform();
    }
}
```

###  isTrue():
* We use this method to check that the actual object is true.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).isTrue().perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isTrue().perform();
    }
}
```


###### 13. isFalse():
* We use this method to check that the actual object is false.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().object((Object) actualObject).isFalse().perform();
        //make verification
        Validations.verifyThat().object((Object) actualObject).isFalse().perform();
    }
}
```