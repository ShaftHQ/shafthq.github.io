---
id: PropertyTypes
title: Property Types
sidebar_label: Types
---

### Priority Heirarchy

Since there are many ways to configure SHAFT properties you need to know how the priorities work.
Simply put, the values to the left override the values to the right.

[Code-based](#code-based) > [CLI-based](#cli-based) > [File-based](#file-based) > [Default Values](PropertiesList)


### File-based

This is the traditional way of configuring SHAFT properties, using this approach you can simply create your own custom properties file.

:::tip
You should use this approach if you have some properties that are global and not expected to change during execution, or properties that you wish to later override from your CLI execution (CI/CD server).
:::

Here's what it can look like:

**Example**: Setting up properties for basic web browser automation
```properties showLineNumbers title="src/main/resources/properties/custom.properties"
baseURL=http://www.mytestdomain.com
executionAddress=local
targetOperatingSystem=WINDOWS
targetBrowserName=firefox
headlessExecution=true
createAnimatedGif=true
videoParams_recordVideo=true
```
You can add all your custom properties in one or more files as you see fit. For more info you can refer to our [full list of supported properties](PropertiesList).


### Code-based

You can read/write any property programmatically to provide more flexibility and control during runtime.

:::tip
You should use this approach if you have some properties that are specific for a certain test class/method or to a specific part of your test. For global properties it is recommended to use the [File-based approach](#file-based).
:::

**Example**: Setting up properties for basic mobile automation
```java showLineNumbers title="src/test/java/testPackage/TestClass.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.BeforeMethod;
import org.openqa.selenium.Platform;
import io.appium.java_client.remote.AutomationName;

private SHAFT.GUI.WebDriver driver;

@BeforeMethod
public void setup(){
	SHAFT.Properties.platform.set().targetPlatform(Platform.ANDROID.name());
	SHAFT.Properties.mobile.set().automationName(AutomationName.ANDROID_UIAUTOMATOR2);
	SHAFT.Properties.platform.set().executionAddress("localhost:4723");
	SHAFT.Properties.mobile.set().app("src/test/resources/testDataFiles/apps/ApiDemos-debug.apk");
	driver = new SHAFT.GUI.WebDriver();
}
```

**Example**: Reading values used for BrowserStack integration
```java showLineNumbers title="src/test/java/testPackage/TestClass.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.BeforeClass;

@BeforeClass
public void beforeClass(){
	var username = SHAFT.Properties.browserStack.username();
	var accessKey = SHAFT.Properties.browserStack.accessKey();
	var platformVersion = SHAFT.Properties.browserStack.platformVersion();
	var deviceName = SHAFT.Properties.browserStack.deviceName();
	var appUrl = SHAFT.Properties.browserStack.appUrl();
	var customID = SHAFT.Properties.browserStack.customID();
	var appName = SHAFT.Properties.browserStack.appName();
}
```

:::note
Note that per the above examples we prefer to use [AutomationName](https://appium.github.io/java-client/io/appium/java_client/remote/AutomationName.html) and [Platform](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/Platform.html) to ensure setting the relevant values correctly. You can also use [Browser](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/remote/Browser.html) to set the `targetBrowserName` property programattically.
```java showLineNumbers title="src/test/java/testPackage/TestClass.java"
import org.openqa.selenium.remote.Browser;

SHAFT.Properties.web.set().targetBrowserName(Browser.FIREFOX.browserName());
```
:::


### CLI-based

This is the third and final way to configure SHAFT's properties.

:::tip
You should use this approach if you want to override some specifc properties for the current test run from CLI. This is usually relevant for unattended CI/CD pipeline execution. You would usually need to use the [File-based approach](#file-based) to set these properties first, and then override them via CLI.
:::

Here's a sample command that you can execute from your terminal window to parameterize your test command:
```powershell
mvn -e test "-DretryMaximumNumberOfAttempts=2" "-DexecutionAddress=localhost:4444" "-DtargetOperatingSystem=LINUX" "-DtargetBrowserName=firefox" "-DheadlessExecution=true" "-DgenerateAllureReportArchive=true" "-Dtest=${GLOBAL_TESTING_SCOPE}"
```

:::note
Note that you can refer to [the official Maven Surefire guide](https://maven.apache.org/surefire/maven-surefire-plugin/examples/single-test.html) to learn how to run certain test classes or packages.
:::
