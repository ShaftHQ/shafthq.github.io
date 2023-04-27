---
id: PropertyTypes
title: Property Types
sidebar_label: Types
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
**Example** : 

you want to set targetBrowserName to MicrosoftEdge insted of default value chrome
in your before method or before you initiate your driver you should do like below 
```java
	  
	@BeforeMethod
	public void beforeMethod() {
    	SHAFT.Properties.web.set().targetBrowserName("MicrosoftEdge");
        driver = new SHAFT.GUI.WebDriver();
	}
```
you can replace "MicrosoftEdge" with any property from table below .


**OR**
you can use Browser library from selenium as following
```java
	import com.shaft.driver.SHAFT;
	import org.openqa.selenium.remote.Browser;
	import org.testng.annotations.BeforeMethod;
	
	@BeforeMethod
	public void beforeMethod() {
        SHAFT.Properties.web.set().targetBrowserName(Browser.EDGE.browserName()); ;
        driver = new SHAFT.GUI.WebDriver();
	}
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
