---
id: basicConfig2
title: Basic Configuration for Mobile GUI
sidebar_label: Mobile GUI
description: "Configure SHAFT Engine properties for mobile app automation with Appium — Android, iOS, native and web execution settings."
keywords: [SHAFT, mobile configuration, Appium settings, Android, iOS, mobile automation, UiAutomator2, XCUITest]
tags: [mobile, configuration, appium, android, ios]
---

SHAFT uses Appium under the hood for mobile automation. Configure the properties below to target a local Appium server or a cloud device farm.

:::tip
- Set up your Appium server following the [official Appium documentation](https://appium.io/docs/en/latest/).
- For cloud execution without managing your own devices, consider [BrowserStack](https://www.browserstack.com/) or [LambdaTest](https://www.lambdatest.com/).
:::

---

## Common Properties (Android & iOS)

```properties title="src/main/resources/properties/custom.properties"
# Address of your Appium server (default for local)
executionAddress=localhost:4723

# Target platform: ANDROID or IOS
targetOperatingSystem=ANDROID

# Automation driver — UiAutomator2 or Espresso for Android, XCUITest for iOS
mobile_automationName=UiAutomator2
```

---

## Android Native App

```properties title="src/main/resources/properties/custom.properties"
# Install a fresh APK before each run (recommended)
mobile_app=src/test/resources/apps/MyApp.apk

# Device name as reported by `adb devices`
mobile_deviceName=Pixel_7_API_34

# Android version (optional but recommended)
mobile_platformVersion=14.0
```

Alternatively, launch an already-installed app by package/activity (not recommended for clean test runs):

```properties title="src/main/resources/properties/custom.properties"
mobile_appPackage=com.example.android.myApp
mobile_appActivity=.MainActivity
```

---

## iOS Native App

```properties title="src/main/resources/properties/custom.properties"
targetOperatingSystem=IOS
mobile_automationName=XCUITest

# .app bundle for Simulator, .ipa for real device
mobile_app=src/test/resources/apps/MyApp.app

# Device name as shown in Xcode device list
mobile_deviceName=iPhone 15
mobile_platformVersion=17.0

# UDID required for real device
mobile_udid=00008110-001A23456789AB01
```

---

## Mobile Web (Browser on Device)

For mobile browser testing, configure the same properties as [Web GUI](./basicConfig) and add the mobile target:

```properties title="src/main/resources/properties/custom.properties"
executionAddress=localhost:4723
targetOperatingSystem=ANDROID
mobile_automationName=UiAutomator2
mobile_browserName=Chrome
mobile_deviceName=Pixel_7_API_34
baseURL=https://m.example.com
```

---

:::tip
You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::

[appium user guide]: <https://appium.io/docs/en/latest/>
[Web GUI basic config]: <../Basic_Config/basicConfig>
[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>
[BrowserStack]: <https://www.browserstack.com/>
[LambdaTest]: <https://www.lambdatest.com/>