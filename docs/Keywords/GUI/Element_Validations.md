---
id: Element_Validations
title: Element Validations
sidebar_label: Element Validations
---

## Difference between assertThat() and verifyThat():

Assertions and Verification testing are important components in GUI automation testing. Each one performs a specific role: 
1. In **Assertions**, if the assert is not met, test case execution will be **aborted** and the rest of the test cases will be skipped, with the test case execution result marked as **failed**. Assertions are used as checkpoints for testing or validating business-critical transactions. This type of assertion is called **Hard Assertion**.
2. In **Verifications**, even if the verification is not met, test case execution will continue to run until the last test is executed. The errors that may be found will be reported at the end of the test suite. This type of verification is called **Soft Assertion**.

### Text Validations 

#### text().isEqualTo()
Validates that the text of the element exactly matches the expected value.

```java
driver.element().assertThat(elementLocator).text().isEqualTo("Expected Text").perform();
driver.element().verifyThat(elementLocator).text().isEqualTo("Expected Text").perform();
```

#### text().equalsIgnoringCaseSensitivity()
Validates that the text of the element matches the expected value without considering case sensitivity (capital or lowercase letters).

```java
driver.element().assertThat(elementLocator).text().equalsIgnoringCaseSensitivity("Expected Text").perform();
driver.element().verifyThat(elementLocator).text().equalsIgnoringCaseSensitivity("Expected Text").perform();
```

#### textTrimmed()
Validates against the provided element's text attribute after it's trimmed (all leading and trailing whitespace removed).

```java
driver.element().assertThat(elementLocator).textTrimmed().equalsIgnoringCaseSensitivity("Expected Text").perform();
driver.element().verifyThat(elementLocator).textTrimmed().equalsIgnoringCaseSensitivity("Expected Text").perform();
```

### Element Existence
#### exists()
Use this to check that the target element exists

```java
driver.element().assertThat(elementLocator).exists().perform();
driver.element().verifyThat(elementLocator).exists().perform();
```

#### doesNotExist()
Use this to check that the target element does not exist

```java
driver.element().assertThat(elementLocator).doesNotExist().perform();
driver.element().verifyThat(elementLocator).doesNotExist().perform();
```
### Element States

#### isChecked()
Use this to check against the provided elements checked attribute

```java
driver.element().assertThat(elementLocator).isChecked().perform();
driver.element().verifyThat(elementLocator).isChecked().perform();
```

#### isNotChecked()
Use this to check against the provided elements checked attribute

```java
driver.element().assertThat(elementLocator).isNotChecked().perform();
driver.element().verifyThat(elementLocator).isNotChecked().perform();
```

#### isDisabled()
Use this to check that the element is disabled.

```java
driver.element().assertThat(elementLocator).isDisabled().perform();
driver.element().verifyThat(elementLocator).isDisabled().perform();
```

#### isEnabled()
Use this to check that the element is enabled.

```java
driver.element().assertThat(elementLocator).isEnabled().perform();
driver.element().verifyThat(elementLocator).isEnabled().perform();
```

#### isVisible()
Use this to check that the element is visible.

```java
driver.element().assertThat(elementLocator).isVisible().perform();
driver.element().verifyThat(elementLocator).isVisible().perform();
```
#### isHidden()
Use this to check that the element is hidden.

```java
driver.element().assertThat(elementLocator).isHidden().perform();
driver.element().verifyThat(elementLocator).isHidden().perform();
```

#### isSelected()
Use this to check against the provided elements selected attribute

```java
driver.element().assertThat(elementLocator).isSelected().perform();
driver.element().verifyThat(elementLocator).isSelected().perform();
```

#### isNotSelected()
Use this to check against the provided elements selected attribute

```java
driver.element().assertThat(elementLocator).isNotSelected().perform();
driver.element().verifyThat(elementLocator).isNotSelected().perform();
```

### Attributes Validations

#### attribute()
Use this to check against a certain element attribute

```java
driver.element().assertThat(elementLocator).attribute("name").isEqualTo("expected value").perform();
driver.element().verifyThat(elementLocator).attribute("name").isEqualTo("expected value").perform();
```




[webdriver]: https://www.selenium.dev/documentation/en/webdriver/
[default configurations]: #
[properties files]: #
[edit configurations]: #
[driverfactory]: #
[reporting]: #
[webdrivermanager]: https://github.com/bonigarcia/webdrivermanager
[browseractions]: https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/browser/BrowserActions.html
[elementactions]: https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/element/ElementActions.html
[by methods]: https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/By.html
[reporting]: #
[verification]: #
[getcssproperty​]: #get-the-value-of-a-css-property
