---
id: Properties
title: Properties
sidebar_label: Properties
---

Please note that the Configuration Manager will be deprecated, and you can now refer to this page to configure your execution properties.

### 1. File-based properties

This is the traditional way of configuring SHAFT properties, using this approach you can simply create your own properties file under `src/main/resources/properties/custom.properties`.
Here's a sample of what a properties file can look like:

```properties
baseURL=http://www.mytestdomain.com
executionAddress=local
targetOperatingSystem=WINDOWS
targetBrowserName=firefox
headlessExecution=true
createAnimatedGif=true
videoParams_recordVideo=true
```
You can add all your custom properties in one or more files as you see fit. And you can refer to the below table for a full list of supported properties.

### 2. Code-based properties

If you're on the latest SHAFT version you can now set any property programmatically as well to easily read/write properties during runtime.

To write values:
```java
SHAFT.Properties.browserStack.set().username(username);
SHAFT.Properties.browserStack.set().accessKey(accessKey);
SHAFT.Properties.browserStack.set().platformVersion(platformVersion);
SHAFT.Properties.browserStack.set().deviceName(deviceName);
SHAFT.Properties.browserStack.set().appUrl(appUrl);
SHAFT.Properties.browserStack.set().customID(customID);
SHAFT.Properties.browserStack.set().appName(appName);
```

To read values:
```java
username = SHAFT.Properties.browserStack.username();
accessKey = SHAFT.Properties.browserStack.accessKey();
platformVersion = SHAFT.Properties.browserStack.platformVersion();
deviceName = SHAFT.Properties.browserStack.deviceName();
appUrl = SHAFT.Properties.browserStack.appUrl();
customID = SHAFT.Properties.browserStack.customID();
appName = SHAFT.Properties.browserStack.appName();
```

Note that it's recommended to set any static values that won't change during execution, or values that you wish to later override from your CLI execution (CI/CD server) in external property files using the first approach.

### 3. CLI-based properties

This is the third and final way to set/override SHAFT's existing default configuration. You will usually use this to execute your tests from a CI/CD pipeline.
CLI properties override the engine's defaults, and any properties that you've already defined in your files.

Here's a sample to set values from your test command:
```commandline
mvn -e test "-DretryMaximumNumberOfAttempts=2" "-DexecutionAddress=localhost:4444" "-DtargetOperatingSystem=LINUX" "-DtargetBrowserName=firefox" "-DheadlessExecution=true" "-DgenerateAllureReportArchive=true" "-Dtest=${GLOBAL_TESTING_SCOPE}"
```

### Priorities

Since there are many ways to set SHAFT properties you need to know how the priorities work. The value on the left overrides the value on the right.
`Hard-coded > CLI > Files > Defaults`

### Supported Properties

Here's a list of all the supported properties *(Work In Progress)*

| Category           | Property Name                               | Default Value  | Description |
|--------------------|---------------------------------------------|----------------|-------------|
| ExecutionPlatform  | SHAFT.CrossBrowserMode                      | `off`          |             |
| ExecutionPlatform  | executionAddress                            | `local`        |             |
| ExecutionPlatform  | targetOperatingSystem                       | `LINUX`        |             |
| ExecutionPlatform  | com.SHAFT.proxySettings                     | ` `            |             |
| WebCapabilities    | targetBrowserName                           | `chrome`       |             |
| WebCapabilities    | headlessExecution                           | `false`        |             |
| WebCapabilities    | mobileEmulation.isCustomDevice              | `false`        |             |
| WebCapabilities    | mobileEmulation.deviceName                  | ` `            |             |
| WebCapabilities    | mobileEmulation.width                       | ` `            |             |
| WebCapabilities    | mobileEmulation.height                      | ` `            |             |
| WebCapabilities    | mobileEmulation.pixelRatio                  | ` `            |             |
| WebCapabilities    | mobileEmulation.userAgent                   | ` `            |             |
| WebCapabilities    | baseURL                                     | ` `            |             |
| WebCapabilities    | lightHouseExecution                         | `false`        |             |
| WebCapabilities    | lightHouseExecution.port                    | `8080`         |             |
| MobileCapabilities | mobile_platformVersion                      | ` `            |             |
| MobileCapabilities | mobile_deviceName                           | ` `            |             |
| MobileCapabilities | mobile_automationName                       | `UIAutomator2` |             |
| MobileCapabilities | mobile_udid                                 | ` `            |             |
| MobileCapabilities | mobile_browserName                          | ` `            |             |
| MobileCapabilities | MobileBrowserVersion                        | ` `            |             |
| MobileCapabilities | mobile_app                                  | ` `            |             |
| MobileCapabilities | mobile_appPackage                           | ` `            |             |
| MobileCapabilities | mobile_appActivity                          | ` `            |             |
| PlatformFlags      | retryMaximumNumberOfAttempts                | `0`            |             |
| PlatformFlags      | autoMaximizeBrowserWindow                   | `true`         |             |
| PlatformFlags      | forceCheckForElementVisibility              | `true`         |             |
| PlatformFlags      | forceCheckElementLocatorIsUnique            | `true`         |             |
| PlatformFlags      | forceCheckTextWasTypedCorrectly             | `true`         |             |
| PlatformFlags      | attemptClearBeforeTypingUsingBackspace      | `false`        |             |
| PlatformFlags      | forceCheckNavigationWasSuccessful           | `true`         |             |
| PlatformFlags      | forceCheckStatusOfRemoteServer              | `false`        |             |
| PlatformFlags      | respectBuiltInWaitsInNativeMode             | `true`         |             |
| PlatformFlags      | clickUsingJavascriptWhenWebDriverClickFails | `false`        |             |
| PlatformFlags      | automaticallyAssertResponseStatusCode       | `true`         |             |
| PlatformFlags      | maximumPerformanceMode                      | `0`            |             |
| PlatformFlags      | skipTestsWithLinkedIssues                   | `false`        |             |
|                    |                                             | ``             |             |


[//]: # ()
[//]: # (Reporting)

[//]: # (captureElementName=true)

[//]: # (captureWebDriverLogs=false)

[//]: # (alwaysLogDiscreetly=false)

[//]: # (debugMode=false)

[//]: # (cleanAllureResultsDirectoryBeforeExecution=true)

[//]: # (generateAllureReportArchive=false)

[//]: # (openAllureReportAfterExecution=false)

[//]: # (generateExtentReports=true)

[//]: # (cleanExtentReportsDirectoryBeforeExecution=true)

[//]: # (attachExtentReportsToAllureReport=false)

[//]: # (openLighthouseReportWhileExecution=true)

[//]: # (openExecutionSummaryReportAfterExecution=true)

[//]: # ()
[//]: # (Timeouts)

[//]: # (waitForLazyLoading=true)

[//]: # (lazyLoadingTimeout=30)

[//]: # (browserNavigationTimeout=60)

[//]: # (pageLoadTimeout=60)

[//]: # (scriptExecutionTimeout=30)

[//]: # (defaultElementIdentificationTimeout=60)

[//]: # (apiSocketTimeout=30)

[//]: # (apiConnectionTimeout=30)

[//]: # (apiConnectionManagerTimeout=30)

[//]: # (shellSessionTimeout=30)

[//]: # (dockerCommandTimeout=30)

[//]: # (databaseLoginTimeout=30)

[//]: # (databaseNetworkTimeout=30)

[//]: # (databaseQueryTimeout=30)

[//]: # (waitForRemoteServerToBeUp=false)

[//]: # (timeoutForRemoteServerToBeUp=10)

[//]: # (remoteServerInstanceCreationTimeout=10)

[//]: # ()
[//]: # (VisualValidations)

[//]: # (screenshotParams_scalingFactor=1)

[//]: # (screenshotParams_whenToTakeAScreenshot=ValidationPointsOnly)

[//]: # (screenshotParams_screenshotType=FullPage)

[//]: # (screenshotParams_highlightElements=true)

[//]: # (screenshotParams_highlightMethod=AI)

[//]: # (screenshotParams_skippedElementsFromScreenshot=)

[//]: # (screenshotParams_watermark=true)

[//]: # (screenshotParams_watermarkOpacity=0.2)

[//]: # (createAnimatedGif=false)

[//]: # (animatedGif_frameDelay=500)

[//]: # (videoParams_recordVideo=false)

[//]: # (videoParams_scope=DriverSession)

[//]: # (whenToTakePageSourceSnapshot=Never)

[//]: # ()
[//]: # (JiraXRay)

[//]: # (jiraInteraction=false)

[//]: # (jiraUrl=https://)

[//]: # (projectKey=)

[//]: # (authorization=:)

[//]: # (reportTestCasesExecution=false)

[//]: # (reportPath=target/surefire-reports/testng-results.xml)

[//]: # (ExecutionName=)

[//]: # (ExecutionDescription=)

[//]: # (ReportBugs=false)

[//]: # (assignee=)

[//]: # (allure.link.tms.pattern=https:///{})

[//]: # (allure.link.custom.pattern={})

[//]: # ()
[//]: # (browserStack)

[//]: # (cucumber)

[//]: # (customWebdriverCapabilities)

[//]: # (healenium)

[//]: # (path)

[//]: # (pattern)

[//]: # (tinkey)