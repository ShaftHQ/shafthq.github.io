---
id: setup_mobile
title: Setup Mobile Automation Project
sidebar_label: Mobile Setup
---

## Setting up a Mobile Automation Project

This guide walks you through setting up a new SHAFT project for Mobile (Android/iOS) automation using Appium.

### Prerequisites for Mobile Testing

Before starting, ensure you have:
- **Java JDK** (latest LTS version)
- **Android Studio** (for Android testing) or **Xcode** (for iOS testing on macOS)
- **Node.js** (for Appium)
- **Appium** server installed globally: `npm install -g appium`

### Using IntelliJ IDEA (Recommended)

1. Open IntelliJ IDEA and select **New Project**
2. Select **Maven Archetype** from the left panel
3. Click **Add Archetype** and enter these details:
   ```text
   GroupId: io.github.shafthq
   ArtifactId: testng-archetype
   Version: (use the latest version from releases)
   ```
   :::info[**Latest Version**]
   Check **[the latest SHAFT_Engine: TestNG Archetype version](https://github.com/ShaftHQ/testng-archetype/releases/latest)** and use that version number.
   :::

4. Select the archetype you just added and click **Next**
5. Enter your project details:
   - **GroupId**: Your organization/group ID (e.g., `com.mycompany`)
   - **ArtifactId**: Your project name (e.g., `mobile-automation-tests`)
6. Click **Create**

### Using Command Line

```shell
mvn archetype:generate "-DarchetypeGroupId=io.github.shafthq" "-DarchetypeArtifactId=testng-archetype" "-DarchetypeVersion=LATEST_VERSION" "-DinteractiveMode=false" "-DgroupId=com.mycompany" "-DartifactId=mobile-automation-tests"
```

:::info[**Customize**]
- Replace `LATEST_VERSION` with **[the latest version](https://github.com/ShaftHQ/testng-archetype/releases/latest)**
- Replace `com.mycompany` and `mobile-automation-tests` with your desired values
:::

### Essential Properties for Mobile Testing (Android)

Create or update `src/main/resources/properties/custom.properties`:

```properties
# Target platform
targetPlatform=ANDROID

# Execution settings
executionAddress=local
mobile.automationName=UIAUTOMATOR2

# Device configuration
mobile.deviceName=Your_Device_Name
mobile.platformVersion=11.0

# App configuration
mobile.app=path/to/your/app.apk
mobile.appPackage=com.example.app
mobile.appActivity=.MainActivity

# Auto-grant permissions
mobile.autoGrantPermissions=true
```

### Essential Properties for Mobile Testing (iOS)

```properties
# Target platform
targetPlatform=IOS

# Execution settings
executionAddress=local
mobile.automationName=XCUITEST

# Device configuration
mobile.deviceName=iPhone 14
mobile.platformVersion=16.0

# App configuration
mobile.app=path/to/your/app.app
mobile.bundleId=com.example.app

# Auto-accept alerts
mobile.autoAcceptAlerts=true
```

### Starting Appium Server

Before running your tests, start the Appium server:

```shell
appium --port 4723
```

Or use SHAFT to start the service programmatically (see the [Mobile Demo](/docs/Demos/mobile) for examples).

### Your First Mobile Test

Check out our **[Mobile Demo Project](https://github.com/ShaftHQ/ShaftEngine-Appium)** for complete examples of mobile automation.

### Next Steps

- Review the [Mobile Demo](/docs/Demos/mobile) for working examples
- Check out [Touch Actions](/docs/Keywords/GUI/Touch_Actions) documentation
- Learn about [Mobile Properties](/docs/Properties/PropertiesList#mobile)
- Explore mobile-specific validations

---

**Ready for the next step?** 
- [Setup API Project →](/docs/Getting_Started/setup_api)
- [Back to Web Setup ←](/docs/Getting_Started/setup_web_testng)
- [View All Integrations →](/docs/Getting_Started/integrations)
