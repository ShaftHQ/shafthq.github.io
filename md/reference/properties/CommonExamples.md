# Common Configuration Examples

Practical configuration examples for SHAFT Engine — web, mobile, API, parallel execution, cloud platforms, and CI/CD pipeline setup.

Canonical HTML: https://shafthq.github.io/docs/reference/properties/CommonExamples
Guide index: https://shafthq.github.io/llms.txt

Here are common scenarios and how to configure SHAFT properties for them. Each example shows three ways to configure properties: **File-based**, **CLI-based**, and **Code-based**.

## Example 1: Run tests in headless mode on Firefox browser

To run tests in headless mode on Firefox, you need to set both `targetBrowserName` and `headlessExecution` properties:

 
 

```properties title="src/main/resources/properties/custom.properties"
targetBrowserName=firefox
headlessExecution=true
```

 
 

```bash
mvn test -DtargetBrowserName=firefox -DheadlessExecution=true
```

 
 

```java

SHAFT.Properties.web.set()
 .targetBrowserName(Browser.FIREFOX.browserName())
 .headlessExecution(true);
```

 
 

---

## Example 2: Run tests on Chrome with mobile emulation

 
 

```properties title="src/main/resources/properties/custom.properties"
targetBrowserName=chrome
isMobileEmulation=true
mobileEmulation.deviceName=iPhone12Pro
```

 
 

```bash
mvn test -DtargetBrowserName=chrome -DisMobileEmulation=true -DmobileEmulation.deviceName=iPhone12Pro
```

 
 

```java

SHAFT.Properties.web.set()
 .targetBrowserName(Browser.CHROME.browserName())
 .isMobileEmulation(true)
 .mobileEmulationDeviceName("iPhone12Pro");
```

 
 

---

## Example 3: Remote execution on Selenium Grid

For remote execution on a Selenium Grid, you need to configure the execution address, target OS, and optionally enable headless mode:

:::tip
Learn how to set up your own local Selenium Grid in the
[Local Selenium Grid Execution](/docs/reference/actions/GUI/Infrastructure_Network_And_Visual#local-selenium-grid)
guide.
:::

 
 

```properties title="src/main/resources/properties/custom.properties"
executionAddress=192.168.1.100:4444
targetOperatingSystem=Linux
headlessExecution=true
targetBrowserName=chrome
```

 
 

```bash
mvn test -DexecutionAddress=192.168.1.100:4444 -DtargetOperatingSystem=Linux -DheadlessExecution=true -DtargetBrowserName=chrome
```

 
 

```java

SHAFT.Properties.platform.set()
 .executionAddress("192.168.1.100:4444")
 .targetPlatform(Platform.LINUX.name());
 
SHAFT.Properties.web.set()
 .targetBrowserName(Browser.CHROME.browserName())
 .headlessExecution(true);
```

 
 

---

## Example 4: BrowserStack execution

For running tests on BrowserStack cloud platform:

 
 

```properties title="src/main/resources/properties/custom.properties"
executionAddress=browserstack
targetOperatingSystem=Windows
targetBrowserName=chrome
browserStack.userName=your_username
browserStack.accessKey=your_access_key
browserStack.osVersion=11
```

 
 

```bash
mvn test -DexecutionAddress=browserstack -DtargetOperatingSystem=Windows -DtargetBrowserName=chrome
```

Note: For CLI execution, configure `browserStack.userName` and `browserStack.accessKey` in your properties file for security.

 
 

```java

SHAFT.Properties.platform.set()
 .executionAddress("browserstack")
 .targetPlatform(Platform.WINDOWS.name());
 
SHAFT.Properties.web.set()
 .targetBrowserName(Browser.CHROME.browserName());
 
SHAFT.Properties.browserStack.set()
 .userName("your_username")
 .accessKey("your_access_key")
 .osVersion("11");
```

 
 

---

## Example 5: Native mobile app testing (Android)

For testing native Android applications using Appium:

 
 

```properties title="src/main/resources/properties/custom.properties"
targetOperatingSystem=ANDROID
executionAddress=localhost:4723
mobile_platformVersion=13.0
mobile_deviceName=emulator-5554
mobile_automationName=UiAutomator2
mobile_app=src/test/resources/apps/ApiDemos-debug.apk
mobile_appPackage=io.appium.android.apis
mobile_appActivity=.view.Controls1
```

 
 

```bash
mvn test -DtargetOperatingSystem=ANDROID -DexecutionAddress=localhost:4723 -Dmobile_platformVersion=13.0 -Dmobile_deviceName=emulator-5554 -Dmobile_automationName=UiAutomator2 -Dmobile_app=src/test/resources/apps/ApiDemos-debug.apk
```

 
 

```java

@BeforeClass
public void beforeClass() {
 SHAFT.Properties.platform.set()
 .targetPlatform(Platform.ANDROID.name())
 .executionAddress("localhost:4723");
 
 SHAFT.Properties.mobile.set()
 .platformVersion("13.0")
 .deviceName("emulator-5554")
 .automationName(AutomationName.ANDROID_UIAUTOMATOR2)
 .app("src/test/resources/apps/ApiDemos-debug.apk")
 .appPackage("io.appium.android.apis")
 .appActivity(".view.Controls1");
}

@Test
public void testNativeAndroidApp() {
 driver = new SHAFT.GUI.WebDriver();
 driver.element().type(AppiumBy.accessibilityId("Views"), "Test Input");
 // Your test code here
}
```

 
 

---

## Example 6: Mobile web testing

For testing web applications on mobile browsers using Appium:

 
 

```properties title="src/main/resources/properties/custom.properties"

# Android Mobile Web
targetOperatingSystem=ANDROID
executionAddress=localhost:4723
mobile_platformVersion=13.0
mobile_deviceName=emulator-5554
mobile_automationName=UiAutomator2
browserName=chrome

# iOS Mobile Web (uncomment for iOS)

# targetOperatingSystem=IOS

# mobile_platformVersion=16.0

# mobile_deviceName=iPhone 14

# mobile_automationName=XCUITest

# browserName=safari
```

 
 

```bash

# Android
mvn test -DtargetOperatingSystem=ANDROID -DexecutionAddress=localhost:4723 -Dmobile_platformVersion=13.0 -Dmobile_deviceName=emulator-5554 -DbrowserName=chrome

# iOS
mvn test -DtargetOperatingSystem=IOS -DexecutionAddress=localhost:4723 -Dmobile_platformVersion=16.0 -Dmobile_deviceName="iPhone 14" -DbrowserName=safari
```

 
 

```java

@BeforeClass
public void beforeClass() {
 // Android Mobile Web
 SHAFT.Properties.platform.set()
 .targetPlatform(Platform.ANDROID.name())
 .executionAddress("localhost:4723");
 
 SHAFT.Properties.mobile.set()
 .platformVersion("13.0")
 .deviceName("emulator-5554")
 .automationName(AutomationName.ANDROID_UIAUTOMATOR2)
 .browserName("chrome");
 
 // For iOS Mobile Web, uncomment below:
 // SHAFT.Properties.platform.set()
 // .targetPlatform(Platform.IOS.name())
 // .executionAddress("localhost:4723");
 // 
 // SHAFT.Properties.mobile.set()
 // .platformVersion("16.0")
 // .deviceName("iPhone 14")
 // .automationName(AutomationName.IOS_XCUI_TEST)
 // .browserName("safari");
}

@Test
public void testMobileWeb() {
 driver = new SHAFT.GUI.WebDriver();
 driver.browser().navigateToURL("https://example.com");
 driver.element().type(By.id("username"), "testuser");
 // Your test code here
}
```

 
 

---

## Example 7: Enable maximum performance mode

Choose a maximum performance mode to reduce optional work during execution:

 
 

```properties title="src/main/resources/properties/custom.properties"
maximumPerformanceMode=2
```

 
 

```bash
mvn test -DmaximumPerformanceMode=2
```

 
 

```java

SHAFT.Properties.flags.set().maximumPerformanceMode(2);
```

 
 

**Performance Mode Values:**
- `0` = Disabled (default)
- `1` = Enabled without headless execution
- `2` = Enabled with headless execution (fastest, ~400% performance boost)

---

## Example 8: Cross-browser testing

Run the same test across multiple browsers sequentially or in parallel:

 
 

```properties title="src/main/resources/properties/custom.properties"

# Sequential execution across Chrome, Firefox, and Safari
SHAFT.CrossBrowserMode=sequential

# Parallel execution (requires Docker Desktop)

# SHAFT.CrossBrowserMode=parallelized
```

 
 

```bash
mvn test -DSHAFT.CrossBrowserMode=sequential
```

 
 

```java

SHAFT.Properties.platform.set().crossBrowserMode("sequential");
// or for parallel: .crossBrowserMode("parallelized");
```

 
 

**Cross-Browser Mode Values:**
- `off` = Normal execution with configured browser (default)
- `sequential` = Tests run on Chrome, Firefox, and Safari in sequence
- `parallelized` = Tests run on all three browsers in parallel

:::note
Cross-browser mode requires Docker Desktop to be installed and configured to use Linux images.
:::

---

## Example 9: API testing with Swagger validation and OpenAPI coverage

Enable Swagger/OpenAPI contract validation and operation coverage reporting for API tests:

 
 

```properties title="src/main/resources/properties/custom.properties"
swagger.validation.enabled=true
swagger.validation.url=https://petstore.swagger.io/v2/swagger.json
openapi.coverage.report.enabled=true
openapi.coverage.threshold=80
```

 
 

```bash
mvn test -Dswagger.validation.enabled=true -Dswagger.validation.url=https://petstore.swagger.io/v2/swagger.json -Dopenapi.coverage.report.enabled=true -Dopenapi.coverage.threshold=80
```

 
 

```java

SHAFT.Properties.api.set()
 .swaggerValidationEnabled(true)
 .swaggerValidationUrl("https://petstore.swagger.io/v2/swagger.json")
 .openApiCoverageReportEnabled(true)
 .openApiCoverageThreshold(80);
```

 
 

The coverage report lists exercised operations, untested operations, requests without a matching contract entry, and validation failures linked to operation IDs.

---

## Example 10: Screenshot and video recording configuration

Configure when and how to capture screenshots and videos:

 
 

```properties title="src/main/resources/properties/custom.properties"
evidenceLevel=CUSTOM

# Screenshot configuration
screenshotParams_whenToTakeAScreenshot=Always
screenshotParams_screenshotType=FullPage
screenshotParams_highlightElements=true
screenshotParams_watermark=true

# Video recording
videoParams_recordVideo=true
videoParams_scope=DriverSession

# Animated GIF creation
createAnimatedGif=true
animatedGif_frameDelay=500
```

 
 

```bash
mvn test -DevidenceLevel=CUSTOM -DscreenshotParams_whenToTakeAScreenshot=Always -DvideoParams_recordVideo=true -DcreateAnimatedGif=true
```

 
 

```java

SHAFT.Properties.reporting.set().evidenceLevel("CUSTOM");
SHAFT.Properties.visuals.set()
 .screenshotParamsWhenToTakeAScreenshot("Always")
 .screenshotParamsScreenshotType("FullPage")
 .screenshotParamsHighlightElements(true)
 .videoParamsRecordVideo(true)
 .createAnimatedGif(true);
```

 
 

---

## More Resources

For a complete list of all available properties, their default values, and descriptions, visit:
- [Properties Types](PropertyTypes.md) - Learn about the three ways to configure properties
- [Properties List](PropertiesList.mdx) - Complete reference of all SHAFT properties

## Related

- [Property Types](/docs/reference/properties/PropertyTypes)
- [Properties List](/docs/reference/properties/PropertiesList)
- [Programmatic Config](/docs/reference/properties/Programmatic_Config)
