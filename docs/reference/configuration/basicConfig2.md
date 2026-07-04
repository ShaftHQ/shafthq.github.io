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

# Optional: launch an already-installed iOS app by bundle identifier
mobile_bundleId=com.example.ios.myApp
```

---

## BrowserStack Native Apps

When `executionAddress=browserstack`, SHAFT can start native mobile sessions from either a BrowserStack app URL or a remote app value in `mobile_app`:

```properties title="src/main/resources/properties/custom.properties"
executionAddress=browserstack
targetOperatingSystem=ANDROID
mobile_automationName=UiAutomator2
mobile_deviceName=Google Pixel 7
mobile_platformVersion=13.0

# Preferred when you already know the uploaded BrowserStack app URL
browserStack.appUrl=bs://<uploaded-app-id>

# Also supported for remote app references when browserStack.appUrl is not set
# mobile_app=bs://<uploaded-app-id>
# mobile_app=https://example.com/apps/MyApp.apk
```

If both `browserStack.appUrl` and `mobile_app` point to remote app values, `browserStack.appUrl` takes precedence. Use local `mobile_app` paths when SHAFT should upload the app for you.

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

## SHAFT MCP Mobile Automation

`shaft-mcp` can start mobile sessions through the same SHAFT Engine setup:

- `mobile_initialize_web_emulation` runs a resized desktop browser in mobile compatibility mode.
- `mobile_initialize_native` starts an Appium-backed Android or iOS native session using the configured Appium server and device name, UDID, app, app package/activity, or iOS bundle ID.
- `mobile_take_screenshot` captures the current mobile screen, and `mobile_get_accessibility_tree` returns the active Appium page source/accessibility XML so the MCP client can understand the screen before acting.
- `mobile_record_start`, `mobile_record_stop`, `mobile_replay_recording`, `mobile_recording_code_blocks`, and `mobile_record_at_target_code_blocks` support record/playback, Page Object handoff, and copy-pasteable SHAFT action snippets.

---

:::tip
You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::

[appium user guide]: <https://appium.io/docs/en/latest/>
[Web GUI basic config]: <../Basic_Config/basicConfig>
[property types]: /docs/reference/properties/PropertyTypes
[full list of supported properties]: /docs/reference/properties/PropertiesList
[BrowserStack]: <https://www.browserstack.com/>
[LambdaTest]: <https://www.lambdatest.com/>

## Related

- [Property Types](/docs/reference/properties/PropertyTypes)
- [Properties List](/docs/reference/properties/PropertiesList)
- [Common Examples](/docs/reference/properties/CommonExamples)
