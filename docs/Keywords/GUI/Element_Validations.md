---
id: Element_Validations
title: Element Validations
sidebar_label: Element Validations
---

### Difference between Assertions and Verifications:

Assertions and Verification testing are important components in GUI automation testing. Each one them performs a specific role: 
1. In **Assertions**, if the assert is not met, TC execution will be **aborted** and the rest of the of TCs will be skipped and the TC execution result will be **failed**. Assertions are used as checkpoints for testing or validating business-critical transactions. This type of assertiosn is called **Hard Assertion**
 1. In **Verifications**, even if ther verifications is not met, TC execution will continue to run until the last test is executed. The errors that may be found will be reported the end of the test suite. This type of verification is called **Soft Assertion**





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
