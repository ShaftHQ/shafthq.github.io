---
id: ShaftReportingRelatedFeatures
title: Logging & Reporting
sidebar_label: Logging & Reporting
---
## Default Log Level:

## Report Clicked Element Text:
- Automatically capture element name and create a more descriptive report message
- this feature is enabled by default
- you can disable By setting the **captureElementName** property to false

**Hard Coded**
```java
SHAFT.Properties.reporting.set().captureElementName(false);
```
**Custom Property File**
```java
captureElementName=false
```


## WebDriver Logs:
- Automatically capture all WebDriver logs from any Selenium/Appium test execution and attach them to the report.
- this feature is disabled by default
- you can enable By setting the **captureWebDriverLogs** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().captureWebDriverLogs(true);
```
**Custom Property File**
```java
captureWebDriverLogs=true
```

## Discrete Logging:
- Any built-in steps are added as logs, and only explicitly called ReportManager.log actions are added as steps to the report.
- this feature is disabled by default
- you can enable By setting the **alwaysLogDiscreetly** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().alwaysLogDiscreetly(true);
```
**Custom Property File**
```java
alwaysLogDiscreetly=true
```

## Debug Mode:
- All attachment contents are logged to standard out for debugging API/CLI/DB actions
- this feature is disabled by default
- you can enable By setting the **debugMode** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().debugMode(true);
```
**Custom Property File**
```java
debugMode=true
```
 

## Reset Allure Results:
- Enabling this setting will reset the allure report before every test run, while disabling it will allow execution data to accumulate.
- this feature is enabled by default
- you can disable By setting the **cleanAllureResultsDirectoryBeforeExecution** property to false
**Hard Coded**
```java
SHAFT.Properties.reporting.set().cleanAllureResultsDirectoryBeforeExecution(false);
```
**Custom Property File**
```java
cleanAllureResultsDirectoryBeforeExecution=false
```

### Generate Allure Report Archive:

### Automatically Open Allure Report:

### Generate Emailable Report:

### Reset Extent Reports:
