---
id: basicConfig2
title: Basic configuration for Mobile GUI
sidebar_label: Mobile GUI
---

- Given that you already have an Appium server up and running, and some real or virtual mobile devices connected and configured, you can start configuring SHAFT to execute your tests against these devices.

:::tip[**Tip**]
    - You can refer to the official **[appium user guide]** to set up your appium server and configure any needed prerequisites.
    - You can also consider using cloud device farms like **[BrowserStack]** or **[LambdaTest]** to execute your tests remotely.
:::

- Here are some basic properties you need to including in your `custom.properties` file to run against an Appium Server for any kind of mobile execution:
```properties showLineNumbers title="src/main/resources/properties/custom.properties"
# you can set the value here to point to your appium server instance
# this is the default value for local appium servers
executionAddress=localhost:4723

# use this property to choose your target OS, it supports both `ANDROID` or `IOS`
targetOperatingSystem=ANDROID

# use this property to configure your automation name as per the appium user guide.
# this property supports `UiAutomator2`, `Espresso` for Android, or `XCUITest` for iOS.
mobile_automationName=UiAutomator2
```

- For Mobile Web Execution, you can configure any of the same properties mentioned in the **[Web GUI basic config]** guide.
- For Mobile Native Execution, you need to configure the following:
```properties showLineNumbers title="src/main/resources/properties/custom.properties"
# you can either set the path to your apk or ipa file to do a fresh installation
# before your test run, which is the recommended approach
mobile_app=relativePath/to/myApp.apk

# or you can use the package/activity combination to launch an already installed
# app if you prefer, which is not recommended
mobile_appPackage=com.example.android.myApp
mobile_appActivity=.MainActivity
```

:::tip[**Tip**]
You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::

[appium user guide]: <https://appium.io/docs/en/latest/>
[Web GUI basic config]: <../Basic_Config/basicConfig>
[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>
[BrowserStack]: <https://www.browserstack.com/>
[LambdaTest]: <https://www.lambdatest.com/>