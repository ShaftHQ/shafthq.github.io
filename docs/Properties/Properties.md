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

| Category           | Property Name                               | Default Value  | Possible Values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------|---------------------------------------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ExecutionPlatform  | SHAFT.CrossBrowserMode                      | `off`          | `off`, `sequential`, `parallelized`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | • Cross Browser Mode allows SHAFT to run your test class against Chrome, Firefox, and Safari!<br/>• You need to have 'Docker Desktop' installed on your machine, and configured to use Linux images.<br/>• Off → Your tests will run normally and respect your configuration.<br/>• Sequential → Your tests will run on Chrome, Firefox, and Safari in sequence.<br/>• Parallelized → Your tests will run on Chrome, Firefox and Safari in parallel. And for each browser they will run in sequence. |
| ExecutionPlatform  | executionAddress                            | `local`        | `local`, `dockerized`, `browserstack`, `host:port`, `http://host:port/wd/hub`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | • For Appium, set the below settings and move to the Mobile tab to continue.<br/>• For BrowserStack, set the "Target Operating System" below, and the "Automation Name" in the Mobile tab, then configure the "browserStack.properties" file in your project directory.                                                                                                                                                                                                                              |
| ExecutionPlatform  | targetOperatingSystem                       | `LINUX`        | `LINUX`, `WINDOWS`, `MAC`, `ANDROID`, `IOS`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ExecutionPlatform  | com.SHAFT.proxySettings                     | ` `            | `host:port`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | • Used to configure testing behind a proxy. e.g. corporate proxy.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| WebCapabilities    | targetBrowserName                           | `chrome`       | `chrome`, `firefox`, `safari`, `MicrosoftEdge`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | headlessExecution                           | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| WebCapabilities    | mobileEmulation.isCustomDevice              | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | mobileEmulation.deviceName                  | ` `            | `blackberryZ30`, `BlackberryPlayBook`, `galaxyNote3`, `galaxyNoteII`, `galaxySIII`, `galaxyS5`, `galaxyS8`, `samsungGalaxyS8+`, `galaxyS9+`, `galaxyTabS4`, `galaxyFold`, `samsungGalaxyS20Ultra`, `samsungGalaxyA51/71`, `kindleFireHDX`, `lgOptimusL70`, `microsoftLumia550`, `microsoftLumia950`, `motoG4`, `nexus10`, `nexus4`, `nexus5`, `nexus5X`, `nexus6`, `nexus6P`, `nexus7`, `nokiaLumia520`, `nokiaN9`, `nestHub`, `nestHubMax`, `pixel2`, `pixel2XL`, `pixel3`, `pixel3XL`, `pixel4`, `pixel5`, `jioPhone2`, `iPhone4`, `iPhone5/SE`, `iPhone6/7/8`, `iPhone6/7/8Plus`, `iPhoneSE`, `iPhoneX`, `iPhoneXR`, `iPhone12Pro`, `iPad`, `iPadPro`, `iPadAir`, `iPadMini`, `surfacePro7`, `surfaceDuo` | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | mobileEmulation.width                       | ` `            | example: `360`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | mobileEmulation.height                      | ` `            | example: `600`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | mobileEmulation.pixelRatio                  | ` `            | example: `2.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | mobileEmulation.userAgent                   | ` `            | example: `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | • This only works for Chrome and Edge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| WebCapabilities    | baseURL                                     | ` `            | example: `https://github.com/ShaftHQ/SHAFT_ENGINE`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| WebCapabilities    | lightHouseExecution                         | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| WebCapabilities    | lightHouseExecution.port                    | `8080`         | example: `8080`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| MobileCapabilities | mobile_platformVersion                      | ` `            | example: `11.0, 13.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              | 
| MobileCapabilities | mobile_deviceName                           | ` `            | example: `8080`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| MobileCapabilities | mobile_automationName                       | `UIAutomator2` | `UiAutomator2`, `Espresso`, `XCUITest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| MobileCapabilities | mobile_udid                                 | ` `            | example: `RQ3005TAQP`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | • Unique device identifier of the connected physical device (leave empty if not applicable).<br/>• You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                                    |
| MobileCapabilities | mobile_browserName                          | ` `            | `chrome`, `Chromium`, `Browser`, `Safari`, `samsung`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| MobileCapabilities | MobileBrowserVersion                        | ` `            | example: `83.0.4103.39`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | • The latest version of the WebDriver executable that is compatible with the target browser. You can get it from <a href="https://www.selenium.dev/documentation/en/webdriver/driver_requirements/#quick-reference">here</a>.<br/>• You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                            |                                                                                                                                                                                                                                                                   |
| MobileCapabilities | mobile_app                                  | ` `            | `relativePath/to/myApp.apk`, `absolutePath/to/myApp.apk`, `http://myapp.com/app.ipa`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| MobileCapabilities | mobile_appPackage                           | ` `            | example: `com.example.android.myApp`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| MobileCapabilities | mobile_appActivity                          | ` `            | example: `.MainActivity`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                                              |
| PlatformFlags      | retryMaximumNumberOfAttempts                | `0`            | example: `0`, `1`, `2`, `3`, `4`, ...etc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| PlatformFlags      | autoMaximizeBrowserWindow                   | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | forceCheckForElementVisibility              | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | forceCheckElementLocatorIsUnique            | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | forceCheckTextWasTypedCorrectly             | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | attemptClearBeforeTypingUsingBackspace      | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | forceCheckNavigationWasSuccessful           | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | forceCheckStatusOfRemoteServer              | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | respectBuiltInWaitsInNativeMode             | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | clickUsingJavascriptWhenWebDriverClickFails | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | automaticallyAssertResponseStatusCode       | `true`         | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PlatformFlags      | maximumPerformanceMode                      | `0`            | `0`, `1`, `2`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | • `0` -> Disabled, `1` -> Without Headless Execution, `2` -> With Headless Execution <br/>• Enabling maximumPerformanceMode will disable all complementary features to ensure the fastest execution possible with a 400% calculated performance boost.                                                                                                                                                                                                                                               |
| PlatformFlags      | skipTestsWithLinkedIssues                   | `false`        | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • It is recommended to leave this feature disabled unless you explicitly want to skip any tests that have the @Issue or @Issues annotation.                                                                                                                                                                                                                                                                                                                                                          |
|                    |                                             | ``             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |


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