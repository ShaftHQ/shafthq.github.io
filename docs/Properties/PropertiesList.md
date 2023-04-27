---
id: PropertiesList
title: Properties List
sidebar_label: List
---

Here's a list of all the supported properties *(Work In Progress)*

### ExecutionPlatform

| Property Name           | Default Value | Possible Values                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------|---------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SHAFT.CrossBrowserMode  | `off`         | `off`, `sequential`, `parallelized`                                           | • Cross Browser Mode allows SHAFT to run your test class against Chrome, Firefox, and Safari!<br/>• You need to have 'Docker Desktop' installed on your machine, and configured to use Linux images.<br/>• Off → Your tests will run normally and respect your configuration.<br/>• Sequential → Your tests will run on Chrome, Firefox, and Safari in sequence.<br/>• Parallelized → Your tests will run on Chrome, Firefox and Safari in parallel. And for each browser they will run in sequence. |
| executionAddress        | `local`       | `local`, `dockerized`, `browserstack`, `host:port`, `http://host:port/wd/hub` | • For Appium, set the below settings and move to the Mobile tab to continue.<br/>• For BrowserStack, set the "Target Operating System" below, and the "Automation Name" in the Mobile tab, then configure the "browserStack.properties" file in your project directory.                                                                                                                                                                                                                              |
| targetOperatingSystem   | `LINUX`       | `LINUX`, `WINDOWS`, `MAC`, `ANDROID`, `IOS`                                   |
| com.SHAFT.proxySettings | ` `           | `host:port`                                                                   | • Used to configure testing behind a proxy. e.g. corporate proxy.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### WebCapabilities

| Property Name                  | Default Value | Possible Values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Description                            |
|--------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| targetBrowserName              | `chrome`      | `chrome`, `firefox`, `safari`, `MicrosoftEdge`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| headlessExecution              | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| mobileEmulation.isCustomDevice | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • This only works for Chrome and Edge. |
| mobileEmulation.deviceName     | ` `           | `blackberryZ30`, `BlackberryPlayBook`, `galaxyNote3`, `galaxyNoteII`, `galaxySIII`, `galaxyS5`, `galaxyS8`, `samsungGalaxyS8+`, `galaxyS9+`, `galaxyTabS4`, `galaxyFold`, `samsungGalaxyS20Ultra`, `samsungGalaxyA51/71`, `kindleFireHDX`, `lgOptimusL70`, `microsoftLumia550`, `microsoftLumia950`, `motoG4`, `nexus10`, `nexus4`, `nexus5`, `nexus5X`, `nexus6`, `nexus6P`, `nexus7`, `nokiaLumia520`, `nokiaN9`, `nestHub`, `nestHubMax`, `pixel2`, `pixel2XL`, `pixel3`, `pixel3XL`, `pixel4`, `pixel5`, `jioPhone2`, `iPhone4`, `iPhone5/SE`, `iPhone6/7/8`, `iPhone6/7/8Plus`, `iPhoneSE`, `iPhoneX`, `iPhoneXR`, `iPhone12Pro`, `iPad`, `iPadPro`, `iPadAir`, `iPadMini`, `surfacePro7`, `surfaceDuo` | • This only works for Chrome and Edge. |
| mobileEmulation.width          | ` `           | example: `360`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.height         | ` `           | example: `600`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.pixelRatio     | ` `           | example: `2.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.userAgent      | ` `           | example: `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | • This only works for Chrome and Edge. |
| baseURL                        | ` `           | example: `https://github.com/ShaftHQ/SHAFT_ENGINE`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| lightHouseExecution            | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| lightHouseExecution.port       | `8080`        | example: `8080`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### MobileCapabilities

| Property Name          | Default Value   | Possible Values                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|------------------------|-----------------|--------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mobile_platformVersion | ` `             | example: `11.0, 13.0`                                                                | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   | 
| mobile_deviceName      | ` `             | example: `8080`                                                                      | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_automationName  | `UIAutomator2`  | `UiAutomator2`, `Espresso`, `XCUITest`                                               | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_udid            | ` `             | example: `RQ3005TAQP`                                                                | • Unique device identifier of the connected physical device (leave empty if not applicable).<br/>• You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                  |                                                                                                                                                                                                                                                                                                                                                                                                    |
| mobile_browserName     | ` `             | `chrome`, `Chromium`, `Browser`, `Safari`, `samsung`                                 | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| MobileBrowserVersion   | ` `             | example: `83.0.4103.39`                                                              | • The latest version of the WebDriver executable that is compatible with the target browser. You can get it from <a href="https://www.selenium.dev/documentation/en/webdriver/driver_requirements/#quick-reference">here</a>.<br/>• You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix. |                                                                                                                                                                                                                                                                   |
| mobile_app             | ` `             | `relativePath/to/myApp.apk`, `absolutePath/to/myApp.apk`, `http://myapp.com/app.ipa` | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_appPackage      | ` `             | example: `com.example.android.myApp`                                                 | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_appActivity     | ` `             | example: `.MainActivity`                                                             | • You can add any property from the <a href="http://appium.io/docs/en/writing-running-appium/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |

### PlatformFlags

| Property Name                               | Default Value  | Possible Values                          | Description                                                                                                                                                                                                                                            |
|---------------------------------------------|----------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| retryMaximumNumberOfAttempts                | `0`            | example: `0`, `1`, `2`, `3`, `4`, ...etc |
| autoMaximizeBrowserWindow                   | `true`         | `true`, `false`                          |
| forceCheckForElementVisibility              | `true`         | `true`, `false`                          |
| forceCheckElementLocatorIsUnique            | `true`         | `true`, `false`                          |
| forceCheckTextWasTypedCorrectly             | `true`         | `true`, `false`                          |
| attemptClearBeforeTypingUsingBackspace      | `false`        | `true`, `false`                          |
| forceCheckNavigationWasSuccessful           | `true`         | `true`, `false`                          |
| forceCheckStatusOfRemoteServer              | `false`        | `true`, `false`                          |
| respectBuiltInWaitsInNativeMode             | `true`         | `true`, `false`                          |
| clickUsingJavascriptWhenWebDriverClickFails | `false`        | `true`, `false`                          |
| automaticallyAssertResponseStatusCode       | `true`         | `true`, `false`                          |
| maximumPerformanceMode                      | `0`            | `0`, `1`, `2`                            | • `0` -> Disabled, `1` -> Without Headless Execution, `2` -> With Headless Execution <br/>• Enabling maximumPerformanceMode will disable all complementary features to ensure the fastest execution possible with a 400% calculated performance boost. |
| skipTestsWithLinkedIssues                   | `false`        | `true`, `false`                          | • It is recommended to leave this feature disabled unless you explicitly want to skip any tests that have the @Issue or @Issues annotation.                                                                                                            |
|                                             |                | ``                                       |                                                                                                                                                                                                                                                        |


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
