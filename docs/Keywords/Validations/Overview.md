---
id: Overview
title: Overview
sidebar_label: Overview
---

#### Shaft Engine allows you to make assertions and verifications easily via using Validations class. 

##### Difference between Assertions and Verifications:
Assertions and Verification testing are important components in GUI automation testing. Each one them performs a specific role: 
1. In **Assertions**, if the assert is not met, TC execution will be **aborted** and the rest of the of TCs will be skipped and the TC execution result will be **failed**. Assertions are used as checkpoints for testing or validating business-critical transactions. This type of assertiosn is called **Hard Assertion**
 1. In **Verifications**, even if ther verifications is not met, TC execution will continue to run until the last test is executed. The errors that may be found will be reported the end of the test suite. This type of verification is called **Soft Assertion**

##### We can make assertions and verifications on:
 1. Browser
 2. Elements
 3. Objects
 4. Numbers 
 5. Files
 6. Response
 7. Force Fail

