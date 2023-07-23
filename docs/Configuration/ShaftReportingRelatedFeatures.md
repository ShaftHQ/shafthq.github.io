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

## Generate Allure Report Archive:
- Enabling this setting will create a stand-alone report archive that can be easily shared with others.
- this feature is disabled by default
- you can enable By setting the **generateAllureReportArchive** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().generateAllureReportArchive(true);
```
**Custom Property File**
```java
generateAllureReportArchive=true
```

## Automatically Open Allure Report:
- Enabling this setting will serve and open the allure report automatically after every test run.
- this feature is disabled by default
- you can enable By setting the **openAllureReportAfterExecution** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().openAllureReportAfterExecution(true);
```
**Custom Property File**
```java
openAllureReportAfterExecution=true
```

## Generate Emailable Report:
- Enabling this setting will create an emailable extent report html file after every test execution.
- this feature is enabled by default
- you can disable By setting the **generateExtentReports** property to false
**Hard Coded**
```java
SHAFT.Properties.reporting.set().generateExtentReports(false);
```
**Custom Property File**
```java
generateExtentReports=false
```

## Reset Extent Reports:
- Enabling this setting will reset the extent report before every test run, while disabling it will allow you to keep track of your old reports.
- this feature is enabled by default
- you can disable By setting the **cleanExtentReportsDirectoryBeforeExecution** property to false
**Hard Coded**
```java
SHAFT.Properties.reporting.set().cleanExtentReportsDirectoryBeforeExecution(false);
```
**Custom Property File**
```java
cleanExtentReportsDirectoryBeforeExecution=false
```
## Attach Extent Report To Allure Report
- Enabling this setting will Attach extent report to allure report in the tear down "Attaching Reports" section.
- this feature is disabled by default
- you can enable By setting the **attachExtentReportToAllureReport** property to true

**Hard Coded**
```java
SHAFT.Properties.reporting.set().attachExtentReportToAllureReport(true);
```
**Custom Property File**
```java
attachExtentReportToAllureReport=true
```

## Open Execution Summary Report
- Enabling this setting will open a lightweight summary report html file after every test execution with the most important info.
- this feature is enabled by default
- you can disable By setting the **openExecutionSummaryReportAfterExecution** property to false

**Hard Coded**
```java
SHAFT.Properties.reporting.set().openExecutionSummaryReportAfterExecution(false);
```

**Custom Property File**
```java
openExecutionSummaryReportAfterExecution=false
```


