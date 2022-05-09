---
id: Files
title: Files Validations 
sidebar_labe: Files Validations
---

#### We can make many assertions and verifications on files by using the _Class FileValidationsBuilder_ through using the following methods:

###### 1. exists():
* We use this method to check if a certain file exists.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().file(folderRelativePath, file name).exists().perform();
        //make verification
        Validations.verifyThat().file(folderRelativePath, file name).exists().perform();
    }
}
```

###### 2. doesNotExist():
* We use this method to check if a certain file does not exist.
* This method returns a ValidationsExecutor object to set your custom validation message (if needed) and then perform() your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().file(folderRelativePath, file name).doesNotExist().perform();
        //make verification
        Validations.verifyThat().file(folderRelativePath, file name).doesNotExist().perform();
    }
}
```

###### 3. checksum():
* We use this method to calculate and check a certain file checksum to confirm if it has the exact same content or not.
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().file(folderRelativePath, file name).checksum().perform();
        //make verification
        Validations.verifyThat().file(folderRelativePath, file name).checksum().perform();
    }
}
```

###### 4. content():
* We use this method to attempt to read and validate a certain file content (works for PDF and TEXT files).
* This method returns a NativeValidationsBuilder object to continue building your validation.

```java
import com.shaft.validation.Validations;
public class Testing {
    @Test
    public void testValidations(){
        //make assertion
        Validations.assertThat().file(folderRelativePath, file name).content().perform();
        //make verification
        Validations.verifyThat().file(folderRelativePath, file name).content().perform();
    }
}
```

