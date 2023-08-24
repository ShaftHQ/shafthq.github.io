---
id: PropertiesList
title: Properties List
sidebar_label: List
---

Here's a list of all the supported properties *(Work In Progress)*

### Platform

- These set of properties control the basic target execution platform settings, like execution location and target operating system.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var targetPlatform = SHAFT.Properties.platform.targetPlatform();

    //set
    import org.openqa.selenium.Platform;
    SHAFT.Properties.platform.set().targetPlatform(Platform.WINDOWS.name());
    ```

| Property Name           | Default Value | Possible Values                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHAFT.CrossBrowserMode  | `off`         | `off`, `sequential`, `parallelized`                                           | • Cross Browser Mode allows SHAFT to run your test class against Chrome, Firefox, and Safari!<br/>• You need to have 'Docker Desktop' installed on your machine, and configured to use Linux images.<br/>• Off → Your tests will run normally and respect your configuration.<br/>• Sequential → Your tests will run on Chrome, Firefox, and Safari in sequence.<br/>• Parallelized → Your tests will run on Chrome, Firefox and Safari in parallel. And for each browser they will run in sequence. |
| executionAddress        | `local`       | `local`, `dockerized`, `browserstack`, `host:port`, `http://host:port/wd/hub` | • For Appium, set the below settings and move to the Mobile tab to continue.<br/>• For BrowserStack, set the "Target Operating System" below, and the "Automation Name" in the Mobile tab, then configure the "browserStack.properties" file in your project directory.                                                                                                                                                                                                                              |
| targetOperatingSystem   | `LINUX`       | `LINUX`, `WINDOWS`, `MAC`, `ANDROID`, `IOS`                                   |
| com.SHAFT.proxySettings | ` `           | `host:port`                                                                   | • Used to configure testing behind a proxy. e.g. corporate proxy.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| driverProxySettings | `true`           | `true`, `false`                                                                   | • To enable or disable the driver proxy.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| jvmProxySettings | `true`           | `true`, `false`                                                                   | • To enable or disable the JVM proxy.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Web

- These set of properties control web GUI test automation settings, like target browser, headless execution, and mobile emulation.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var targetBrowserName = SHAFT.Properties.web.targetBrowserName();

    //set
    import org.openqa.selenium.remote.Browser;
    SHAFT.Properties.web.set().targetBrowserName(Browser.CHROME.browserName());
    ```

| Property Name                  | Default Value | Possible Values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Description                            |
| ------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| targetBrowserName              | `chrome`      | `chrome`, `firefox`, `safari`, `MicrosoftEdge`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| headlessExecution              | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| isMobileEmulation | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • This only works for Chrome and Edge. |
| mobileEmulation.isCustomDevice | `false`       | `true`, `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • This only works for Chrome and Edge. |
| mobileEmulation.deviceName     | ` `           | `blackberryZ30`, `BlackberryPlayBook`, `galaxyNote3`, `galaxyNoteII`, `galaxySIII`, `galaxyS5`, `galaxyS8`, `samsungGalaxyS8+`, `galaxyS9+`, `galaxyTabS4`, `galaxyFold`, `samsungGalaxyS20Ultra`, `samsungGalaxyA51/71`, `kindleFireHDX`, `lgOptimusL70`, `microsoftLumia550`, `microsoftLumia950`, `motoG4`, `nexus10`, `nexus4`, `nexus5`, `nexus5X`, `nexus6`, `nexus6P`, `nexus7`, `nokiaLumia520`, `nokiaN9`, `nestHub`, `nestHubMax`, `pixel2`, `pixel2XL`, `pixel3`, `pixel3XL`, `pixel4`, `pixel5`, `jioPhone2`, `iPhone4`, `iPhone5/SE`, `iPhone6/7/8`, `iPhone6/7/8Plus`, `iPhoneSE`, `iPhoneX`, `iPhoneXR`, `iPhone12Pro`, `iPad`, `iPadPro`, `iPadAir`, `iPadMini`, `surfacePro7`, `surfaceDuo` | • This only works for Chrome and Edge. |
| mobileEmulation.width          | ` `           | example: `360`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.height         | ` `           | example: `600`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.pixelRatio     | ` `           | example: `2.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | • This only works for Chrome and Edge. |
| mobileEmulation.userAgent      | ` `           | example: `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | • This only works for Chrome and Edge. |
| baseURL                        | ` `           | example: `https://github.com/ShaftHQ/SHAFT_ENGINE`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| browserWindowWidth                        | `1920`           |                                               | • Won't work if autoMaximizeBrowserWindow is enabled
| browserWindowHeight                        | `1080`           |                                               | • Won't work if autoMaximizeBrowserWindow is enabled

### Mobile

- These set of properties control web and/or native mobile GUI test automation settings, like target platform version, path to the app under test, and the activity name that you want to start testing.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var app = SHAFT.Properties.mobile.app();

    //set
    SHAFT.Properties.mobile.set().app(SHAFT.Properties.paths.testData() + "apps/BStackSampleApp.ipa");
    ```

| Property Name                | Default Value  | Possible Values                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mobile_platformVersion       | ` `            | example: `11.0, 13.0`                                                                | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_deviceName            | ` `            | example: `ANDROID_EMULATOR`                                                          | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_automationName        | `UIAutomator2` | `UiAutomator2`, `Espresso`, `XCUITest`                                               | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_udid                  | ` `            | example: `RQ3005TAQP`                                                                | • Unique device identifier of the connected physical device (leave empty if not applicable).<br/>• You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                  |  |
| mobile_browserName           | ` `            | `chrome`, `Chromium`, `Browser`, `Safari`, `samsung`                                 | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| MobileBrowserVersion         | ` `            | example: `83.0.4103.39`                                                              | • The latest version of the WebDriver executable that is compatible with the target browser. You can get it from <a href="https://www.selenium.dev/documentation/en/webdriver/driver_requirements/#quick-reference">here</a>.<br/>• You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix. |  |
| mobile_app                   | ` `            | `relativePath/to/myApp.apk`, `absolutePath/to/myApp.apk`, `http://myapp.com/app.ipa` | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_appPackage            | ` `            | example: `com.example.android.myApp`                                                 | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| mobile_appActivity           | ` `            | example: `.MainActivity`                                                             | • You can add any property from the <a href="https://appium.io/docs/en/2.0/guides/caps/">List of Appium Capabilities</a> directly to your .property files or via CLI arguments, just make sure to add `mobile_` as a prefix.                                                                                                                                                                                                                                   |
| selfManaged                  | `false`        |                                                                                      |
| selfManagedAndroidSDKVersion | `31`           |                                                                                      |


### Flags

- These set of properties control generic platform flags, like the number of test retry attemps, atomaximization of web browser window, and any other built-in checks or workarounds that aim to stabelize your test execution.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var clickUsingJavascriptWhenWebDriverClickFails = SHAFT.Properties.flags.clickUsingJavascriptWhenWebDriverClickFails();

    //set
    SHAFT.Properties.flags.set().clickUsingJavascriptWhenWebDriverClickFails(true);
    ```

| Property Name                               | Default Value | Possible Values                          | Description                                                                                                                                                                                                                                            |
| ------------------------------------------- | ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| retryMaximumNumberOfAttempts                | `0`           | example: `0`, `1`, `2`, `3`, `4`, ...etc |
| autoMaximizeBrowserWindow                   | `true`        | `true`, `false`                          |
| forceCheckForElementVisibility              | `true`        | `true`, `false`                          |
| forceCheckElementLocatorIsUnique            | `true`        | `true`, `false`                          |
| attemptToClickBeforeTyping                  | `false`       | `true`, `false`                          |
| attemptClearBeforeTypingUsingBackspace      | `false`       | `true`, `false`                          |
| forceCheckTextWasTypedCorrectly             | `true`        | `true`, `false`                          |
| forceCheckNavigationWasSuccessful           | `true`        | `true`, `false`                          |
| respectBuiltInWaitsInNativeMode             | `true`        | `true`, `false`                          |
| forceCheckStatusOfRemoteServer              | `false`       | `true`, `false`                          |
| clickUsingJavascriptWhenWebDriverClickFails | `false`       | `true`, `false`                          |
| autoCloseDriverInstance                     | `true`        | `true`, `false`                          |
| automaticallyAssertResponseStatusCode       | `true`        | `true`, `false`                          |
| maximumPerformanceMode                      | `0`           | `0`, `1`, `2`                            | • `0` -> Disabled, `1` -> Without Headless Execution, `2` -> With Headless Execution <br/>• Enabling maximumPerformanceMode will disable all complementary features to ensure the fastest execution possible with a 400% calculated performance boost. |
| skipTestsWithLinkedIssues                   | `false`       | `true`, `false`                          | • It is recommended to leave this feature disabled unless you explicitly want to skip any tests that have the @Issue or @Issues annotation.                                                                                                            |
| disableCache                   | `false`       | `true`, `false`                          | • To disable the cache in a browser session.                                                                                                            |
| enableTrueNativeMode                   | `false`       | `true`, `false`                          | •                                      |

### Reporting

- These set of properties control the engine's built-in reporting capabilities, like whether or not to capture the element name in the report to make it more readible, capturing webdriver logs for more debugging, and the behavior of our different reports before and after test execution.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var openAllureReportAfterExecution = SHAFT.Properties.reporting.openAllureReportAfterExecution();

    //set
    SHAFT.Properties.reporting.set().openAllureReportAfterExecution(true);
    ```

| Property Name                              | Default Value | Possible Values | Description |
| ------------------------------------------ | ------------- | --------------- | ----------- |
| captureElementName                         | `true`        | `true`, `false` |
| captureWebDriverLogs                       | `false`       | `true`, `false` |
| alwaysLogDiscreetly                        | `false`       | `true`, `false` |
| debugMode                                  | `false`       | `true`, `false` |
| cleanAllureResultsDirectoryBeforeExecution | `true`        | `true`, `false` |
| generateAllureReportArchive                | `false`       | `true`, `false` |
| openAllureReportAfterExecution             | `false`       | `true`, `false` |
| generateExtentReports                      | `true`        | `true`, `false` |
| cleanExtentReportsDirectoryBeforeExecution | `true`        | `true`, `false` |
| openExtentReportAfterExecution             | `false`       | `true`, `false` |             |
| attachExtentReportsToAllureReport          | `false`       | `true`, `false` |
| openLighthouseReportWhileExecution         | `true`        | `true`, `false` |
| openExecutionSummaryReportAfterExecution   | `true`        | `true`, `false` |             |

### Timeouts

- These set of properties control the engine's built-in synchronization capabilities, such as waiting for lazy loading, element identification timeout, API connection timeout, database query timeout, and shell session timeout.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var elementIdentificationTimeout = SHAFT.Properties.timeouts.defaultElementIdentificationTimeout();

    //set
    SHAFT.Properties.timeouts.set().defaultElementIdentificationTimeout(5);
    ```

| Property Name                       | Default Value | Possible Values | Description                                                                        |
| ----------------------------------- | ------------- | --------------- | ---------------------------------------------------------------------------------- |
| waitForLazyLoading                  | `true`        | `true`, `false` | Especially useful for modern/responsive web apps using React, Vue, Angular, ...etc |
| lazyLoadingTimeout                  | `30`          |
| browserNavigationTimeout            | `60`          |
| pageLoadTimeout                     | `60`          |
| scriptExecutionTimeout              | `30`          |
| defaultElementIdentificationTimeout | `60`          |
| apiSocketTimeout                    | `30`          |
| apiConnectionTimeout                | `30`          |
| apiConnectionManagerTimeout         | `30`          |
| shellSessionTimeout                 | `30`          |
| dockerCommandTimeout                | `30`          |
| databaseLoginTimeout                | `30`          |
| databaseNetworkTimeout              | `30`          |
| databaseQueryTimeout                | `30`          |
| waitForRemoteServerToBeUp           | `false`       | `true`, `false` |                                                                                    |
| timeoutForRemoteServerToBeUp        | `10`          |                 |                                                                                    |
| remoteServerInstanceCreationTimeout | `10`          |                 |                                                                                    |

### Visuals

- These set of properties control the engine's built-in visual validation and AI capabilities, such as the visual matching threshhold for AI powered element identification, when to take screenshots, screenshot types, videos, animated GIFs, and complete page snapshots.
- You can configure these properties by adding them to your `custom.properties` file or programmatically like this:
    ```java
    //get
    var visualMatchingThreshold = SHAFT.Properties.visuals.visualMatchingThreshold();

    //set
    SHAFT.Properties.visuals.set().visualMatchingThreshold(0.7);
    ```

| Property Name                                  | Default Value          | Possible Values                              | Description |
| ---------------------------------------------- | ---------------------- | -------------------------------------------- | ----------- |
| visualMatchingThreshold                        | `0.90`                 | any decimal value between `0.00` and `1.00`  |             |
| screenshotParams_scalingFactor                 | `1`                    |                                              |             |
| screenshotParams_whenToTakeAScreenshot         | `ValidationPointsOnly` | `Always, ValidationPointsOnly, FailuresOnly` |             |
| screenshotParams_screenshotType                | `FullPage`             |                                              |             |
| screenshotParams_highlightElements             | `true`                 | `true`, `false`                              |             |
| screenshotParams_highlightMethod               | `AI`                   |                                              |             |
| screenshotParams_skippedElementsFromScreenshot | ``                     |                                              |             |
| screenshotParams_watermark                     | `true`                 | `true`, `false`                              |             |
| screenshotParams_watermarkOpacity              | `0.2`                  |                                              |             |
| createAnimatedGif                              | `false`                | `true`, `false`                              |             |
| animatedGif_frameDelay                         | `500`                  |                                              |             |
| videoParams_recordVideo                        | `false`                | `true`, `false`                              |             |
| videoParams_scope                              | `DriverSession`        |                                              |             |
| whenToTakePageSourceSnapshot                   | `Never`                |                                              |             |

### Jira

- These set of properties control the engine's built-in Jira and Xray integrations for test management and defect reporting.
- You can configure these properties by adding them to your `custom.properties` file. Ideally you wouldn't need to configure these properties programatically, but if you ever need to, you can do it like this:
    ```java
    //get
    var reportBugs = SHAFT.Properties.jira.reportBugs();

    //set
    SHAFT.Properties.jira.set().reportBugs(true);
    ```

| Property Name              | Default Value                                | Possible Values | Description |
| -------------------------- | -------------------------------------------- | --------------- | ----------- |
| jiraInteraction            | `false`                                      | `true`, `false` |             |
| jiraUrl                    | `https://`                                   |                 |             |
| projectKey                 | ``                                           |                 |             |
| authorization              | `:`                                          |                 |             |
| reportTestCasesExecution   | `false`                                      | `true`, `false` |             |
| reportPath                 | `target/surefire-reports/testng-results.xml` |                 |             |
| ExecutionName              | ``                                           |                 |             |
| ExecutionDescription       | ``                                           |                 |             |
| ReportBugs                 | `false`                                      | `true`, `false` |             |
| assignee                   | ``                                           |                 |             |
| allure.link.tms.pattern    | `https:///{}`                                |                 |             |
| allure.link.custom.pattern | `{}`                                         |                 |             |

### Cucumber

- These set of properties control your cucumber settings, such as the path to your feature files, the package names for your step definition classes, and any plugins you want to enable.
- You can configure these properties by editing your `src/main/resources/properties/cucumber.properties` file.

| Property Name        | Default Value                                                                                                                        | Possible Values | Description |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ----------- |
| cucumber.features    | `src/test/resources`                                                                                                                 |                 |             |
| cucumber.filter.name | ``                                                                                                                                   |                 |             |
| cucumber.filter.tags | ``                                                                                                                                   |                 |             |
| cucumber.glue        | `customCucumberSteps, com.shaft.cucumber`                                                                                            |                 |             |
| cucumber.plugin      | `pretty, json:allure-results/cucumber.json, html:allure-results/cucumberReport.html, com.shaft.listeners.CucumberTestRunnerListener` |                 |             |

### Healenium

| Property Name  | Default Value | Possible Values | Description |
| -------------- | ------------- | --------------- | ----------- |
| recovery-tries | `1`           |                 |             |
| score-cap      | `0.5`         |                 |             |
| heal-enabled   | `false`       |                 |             |
| serverHost     | `localhost`   |                 |             |
| serverPort     | `7878`        |                 |             |
| imitatePort    | `8000`        |                 |             |

### Paths

| Property Name                    | Default Value                                 | Possible Values | Description |
| -------------------------------- | --------------------------------------------- | --------------- | ----------- |
| propertiesFolderPath             | `src/main/resources/properties/`              |                 |             |
| defaultPropertiesFolderPath      | `src/main/resources/properties/default`       |                 |             |
| dynamicObjectRepositoryPath      | `src/main/resources/dynamicObjectRepository/` |                 |             |
| testDataFolderPath               | `src/test/resources/testDataFiles/`           |                 |             |
| downloadsFolderPath              | `target/downloadedFiles/`                     |                 |             |
| allureResultsFolderPath          | `allure-results/`                             |                 |             |
| extentReportsFolderPath          | `extent-reports/`                             |                 |             |
| executionSummaryReportFolderPath | `execution-summary/`                          |                 |             |
| video.folder                     | `allure-results/videos`                       |                 |             |
| servicesFolderPath               | `src/test/resources/META-INF/services/`       |                 |             |
| applitoolsApiKey                 | ``                                            |                 |             |


### Pattern

| Property Name             | Default Value | Possible Values | Description |
| ------------------------- | ------------- | --------------- | ----------- |
| testDataColumnNamePrefix  | `Data`        |                 |             |
| allure.link.issue.pattern | ``            |                 |             |

### Tinkey

| Property Name             | Default Value | Possible Values | Description |
| ------------------------- | ------------- | --------------- | ----------- |
| tinkey.keysetFilename     | ``            |                 |             |
| tinkey.kms.serverType     | ``            |                 |             |
| tinkey.kms.credentialPath | ``            |                 |             |
| tinkey.kms.masterKeyUri   | ``            |                 |             |

### BrowserStack

| Property Name                    | Default Value | Possible Values | Description                                                                                           |
| -------------------------------- | ------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| browserStack.username            | ``            |                 |                                                                                                       |
| browserStack.accessKey           | ``            |                 |                                                                                                       |
| browserStack.platformVersion     | ``            |                 |                                                                                                       |
| browserStack.deviceName          | ``            |                 |                                                                                                       |
| browserStack.appUrl              | ``            |                 | Use appUrl to test a previously uploaded app file                                                     |
| browserStack.customID            | ``            |                 | Use customID to test the latest uploaded version as the above url expires regularly                   |
| browserStack.appName             | ``            |                 |                                                                                                       |
| browserStack.appRelativeFilePath | ``            |                 |                                                                                                       |
| browserStack.osVersion           | ``            |                 | In case of Desktop web testing you must also set the `targetOperatingSystem`, and `targetBrowserName` |
| browserStack.browserVersion      | ``            |                 | optional, uses random by default                                                                      |
| browserStack.local               | `false`       | `true`, `false` |                                                                                                       |

### LambdaTest

| Property Name                   | Default Value  | Possible Values | Description                                                              |
| ------------------------------- | -------------- | --------------- | ------------------------------------------------------------------------ |
| LambdaTest.username             | ``             |                 |                                                                          |
| LambdaTest.accessKey            | ``             |                 |                                                                          |
| LambdaTest.platformVersion      | ``             |                 |                                                                          |
| LambdaTest.deviceName           | ``             |                 |                                                                          |
| LambdaTest.appUrl               | ``             |                 |                                                                          |
| LambdaTest.appProfiling         | `false`        | `true`, `false` |                                                                          |
| LambdaTest.osVersion            | ``             |                 |                                                                          |
| LambdaTest.visual               | `false`        | `true`, `false` |                                                                          |
| LambdaTest.video                | `false`        | `true`, `false` |                                                                          |
| LambdaTest.appName              | ``             |                 | Use appName and appRelativeFilePath to upload a new app file and test it |
| LambdaTest.appRelativeFilePath  | ``             |                 | Use appName and appRelativeFilePath to upload a new app file and test it |
| LambdaTest.resolution           | ``             |                 |                                                                          |
| LambdaTest.headless             | `false`        | `true`, `false` |                                                                          |
| LambdaTest.timezone             | ``             |                 |                                                                          |
| LambdaTest.project              | `SHAFT_Engine` |                 |                                                                          |
| LambdaTest.build                | `Build Name`   |                 |                                                                          |
| LambdaTest.selenium_version     | ``             |                 |                                                                          |
| LambdaTest.driver_version       | ``             |                 |                                                                          |
| LambdaTest.w3c                  | `true`         | `true`, `false` |                                                                          |
| LambdaTest.browserVersion       | ``             |                 | optional, uses random by default                                         |
| LambdaTest.geoLocation          | `EG`           |                 | Optional extra settings                                                  |
| LambdaTest.debug                | `false`        | `true`, `false` | Optional extra settings                                                  |
| LambdaTest.acceptInsecureCerts  | `true`         | `true`, `false` | Optional extra settings                                                  |
| LambdaTest.networkLogs          | `false`        | `true`, `false` | Optional extra settings                                                  |
| LambdaTest.appiumVersion        | `2.0.0`        |                 | Optional extra settings                                                  |
| LambdaTest.autoGrantPermissions | `true`         | `true`, `false` |                                                                          |
| LambdaTest.autoAcceptAlerts     | `true`         | `true`, `false` |                                                                          |
| LambdaTest.isRealMobile         | `true`         | `true`, `false` |                                                                          |
| LambdaTest.console              | `false`        | `true`, `false` |                                                                          |
| LambdaTest.customID             | ``             |                 |                                                                          |

### Performance

| Property Name            | Default Value | Possible Values | Description |
| ------------------------ | ------------- | --------------- | ----------- |
| lightHouseExecution      | `false`       |                 |             |
| lightHouseExecution.port | `8888`        |                 |             |

### TestNG

- These set of properties control your TestNG parallelization settings.
- You can configure these properties by editing your `src/main/resources/properties/testng.properties` file.

| Property Name              | Default Value | Possible Values                      | Description |
| -------------------------- | ------------- | ------------------------------------ | ----------- |
| setParallel                | `NONE`        | `METHODS, CLASSES, TESTS, INSTANCES` |             |
| setThreadCount             | `1`           |                                      |             |
| setVerbose                 | `1`           |                                      |             |
| setPreserveOrder           | `true`        | `true`, `false`                      |             |
| setGroupByInstances        | `true`        | `true`, `false`                      |             |
| setDataProviderThreadCount | `1`           |                                      |             |

### Log4j

- These set of properties control your Log4j2 logging settings.
- You can configure these properties by editing your `src/main/resources/properties/Log4j2.properties` file.

| Property Name                           | Default Value                                                                                                                                                                          | Possible Values                          | Description                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| appender.console.layout.pattern         | `%highlight{[%p]}{FATAL=red blink, ERROR=red bold, WARN=yellow bold, INFO=fg_#0060a8 bold, DEBUG=fg_#43b02a bold, TRACE=black} %style{%m} %style{\| @%d{hh:mm:ss a}}{bright_black} %n` |                                          | [Click here to learn more about log4j2 pattern layouts](https://logging.apache.org/log4j/2.x/manual/layouts.html#pattern-layout) |
| appender.console.filter.threshold.level | `info`                                                                                                                                                                                 | `fatal, error, warn, info, debug, trace` |                                                                                                                                  |
| appender.file.fileName                  | `target/logs/log4j.log`                                                                                                                                                                |                                          |                                                                                                                                  |
| appender.file.layout.pattern            | `[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %c{1} - %msg%n`                                                                                                                           |                                          |                                                                                                                                  |
| appender.file.filter.threshold.level    | `debug`                                                                                                                                                                                | `fatal, error, warn, info, debug, trace` |                                                                                                                                  |
