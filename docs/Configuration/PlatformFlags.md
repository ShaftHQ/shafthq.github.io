---
id: ShaftPlatformFlags
title: Platform Flags
sidebar_label: Platform Flags
---
# Flags
These set of properties control generic platform flags, like the number of test retry attemps, automaximization of web browser window, and any other built-in checks or workarounds that aim to stabelize your test execution.

## Automatically Retry Failed Tests
- Automatically retry failed test for predefiend number of times
- 0 means disabled , 1 means retry failed test one more time , 2 two times , etc..
- this feature is disabled by default
- you can enable By setting the **retryMaximumNumberOfAttempts** property to number of times you need

**Hard Coded**
```java
SHAFT.Properties.flags.set().retryMaximumNumberOfAttempts(1);
```
**Custom Property File**
```java
retryMaximumNumberOfAttempts=1
```

## Maximum Performance Mode
- Enabling maximumPerformanceMode will disable all complementary features to ensure the fastest execution possible with a 400% calculated performance boost.
- maximumPerformanceMode = 0 means disabled 
- 0 -> Disabled, 1 -> Without Headless Execution, 2 -> With Headless Execution
- this feature is disabled by default
- you can enable By setting the **maximumPerformanceMode** property to 1 or 2
 **Hard Coded**
```java
SHAFT.Properties.flags.set().maximumPerformanceMode(1);
```
**Custom Property File**
```java
maximumPerformanceMode=1
```

## Skip Tests With Linked Issues
- skip any test that annotated By @issue or @issues
- It is recommended to leave this feature disabled unless you explicitly want to skip any tests that have the @Issue or @Issues annotation.
- this feature is disabled by default
- you can enable By setting **skipTestsWithLinkedIssues** to true
 **Hard Coded**
```java
SHAFT.Properties.flags.set().skipTestsWithLinkedIssues(true);
```
**Custom Property File**
```java
skipTestsWithLinkedIssues=true
```

## Auto maximize browser window
- auto maximize Browser window when test launchh
- this feature is enabled by default
- you can disable By setting **autoMaximizeBrowserWindow** to false
 **Hard Coded**
```java
SHAFT.Properties.flags.set().autoMaximizeBrowserWindow(false);
```
**Custom Property File**
```java
autoMaximizeBrowserWindow=false
```

## Attempt clearing text before typing using backspace
- this feature clears text field using back space
- this feature is disabled By default
- you can enable By setting **attemptClearBeforeTypingUsingBackspace** to true
```java
SHAFT.Properties.flags.set().attemptClearBeforeTypingUsingBackspace(true);
```
**Custom Property File**
```java
attemptClearBeforeTypingUsingBackspace=true
```
- يهسشلامثي 
## Click using JavaScript if WebDriver Click Fails
- if native selenium click method fails for some exceptions such as element not innteractable in poin x , y or element not in the view port
  shaft tries to click using java script before failing the test
- this feature disabled by default
-  you can enable By setting **clickUsingJavascriptWhenWebDriverClickFails** to true
 ```java
SHAFT.Properties.flags.set().clickUsingJavascriptWhenWebDriverClickFails(true);
```
**Custom Property File**
```java
clickUsingJavascriptWhenWebDriverClickFails=true
``` 
## Force check remote server is reachable
## Force check element locator is unique
## Force check for element visibility
## Force check text was typed correctly
## Force check navigation was successful
## Respect SHAFT's built-in waits in native mode
## Automatically Assert Response Status Code
## Auto Close Driver Instance
## Attempt To Click Before Typing


