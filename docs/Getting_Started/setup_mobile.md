---
id: setup_mobile
title: Setting Up a Mobile Project
sidebar_label: Mobile Projects
---

## 📱 Mobile Test Automation with SHAFT

This guide will help you set up a SHAFT project for **Mobile app test automation** using Appium.

---

## What You'll Build

A complete mobile automation project with:
- Native and Hybrid app automation (Android & iOS)
- Real device and emulator/simulator support
- Cloud execution support (BrowserStack, LambdaTest)
- Built-in reporting with screenshots
- Parallel execution ready

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **Java JDK**: Latest LTS version (JDK 17 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- ✅ **IDE**: IntelliJ IDEA (recommended) or Eclipse - [Download IntelliJ](https://www.jetbrains.com/idea/download/)
- ✅ **Maven**: Usually comes with your IDE
- ✅ **Appium**: Version 2.0+ - [Install Guide](https://appium.io/docs/en/2.0/quickstart/install/)
- ✅ **Android SDK** (for Android testing) - [Download Android Studio](https://developer.android.com/studio)
- ✅ **Xcode** (for iOS testing, macOS only) - [Download from App Store](https://apps.apple.com/app/xcode/id497799835)

:::tip[Knowledge Prerequisites]
Familiarity with:
- Java programming basics
- Mobile app structure (Activities, ViewControllers)
- Basic Appium concepts (locators, capabilities)
- Maven project structure
:::

---

## Platform-Specific Setup

### Android Setup

1. **Install Android Studio** (includes Android SDK)
2. **Set Environment Variables:**
   
   **macOS/Linux:**
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   # or export ANDROID_HOME=$HOME/Android/Sdk      # Linux
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
   
   **Windows:**
   ```cmd
   set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   set PATH=%PATH%;%ANDROID_HOME%\emulator
   set PATH=%PATH%;%ANDROID_HOME%\tools
   set PATH=%PATH%;%ANDROID_HOME%\platform-tools
   ```

3. **Install Appium UIAutomator2 Driver:**
   ```bash
   appium driver install uiautomator2
   ```

4. **Create an Emulator** (optional, if not using real device):
   - Open Android Studio → AVD Manager → Create Virtual Device

### iOS Setup (macOS only)

1. **Install Xcode** from the App Store

2. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```

3. **Install Appium XCUITest Driver:**
   ```bash
   appium driver install xcuitest
   ```

4. **Install Carthage** (dependency manager):
   ```bash
   brew install carthage
   ```

5. **Install iOS Simulator** (if using simulator)

---

## Step 1: Create Your Project

### Using Maven

Create a new Maven project with the following `pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany</groupId>
    <artifactId>mobile-automation</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <!-- Get latest version from https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE -->
        <shaft.version><!-- Check latest version --></shaft.version>
    </properties>

    <dependencies>
        <!-- SHAFT Engine -->
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>SHAFT_ENGINE</artifactId>
            <version>${shaft.version}</version>
        </dependency>
        
        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.8.0</version>
        </dependency>
    </dependencies>
</project>
```

---

## Step 2: Configure SHAFT for Mobile

Create `src/main/resources/properties/custom.properties`:

### For Android:

```properties
# Platform
targetPlatform=ANDROID

# Execution
executionAddress=127.0.0.1:4723

# Mobile specific
mobile_automationName=UIAUTOMATOR2
mobile_app=/path/to/your/app.apk
mobile_deviceName=Your Device Name

# Optional
mobile_autoGrantPermissions=true
mobile_noReset=false
mobile_fullReset=false
```

### For iOS:

```properties
# Platform
targetPlatform=IOS

# Execution
executionAddress=127.0.0.1:4723

# Mobile specific
mobile_automationName=XCUITEST
mobile_app=/path/to/your/app.app
mobile_deviceName=iPhone 15
mobile_platformVersion=17.0

# Optional
mobile_autoAcceptAlerts=true
mobile_noReset=false
```

---

## Step 3: Start Appium Server

Before running tests, start the Appium server:

```bash
appium
```

Or start it programmatically in your tests (see example below).

---

## Step 4: Create Your First Mobile Test

### Create a Page Object

Create: `src/test/java/com/mycompany/pages/LoginPage.java`

```java
package com.mycompany.pages;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class LoginPage {
    private SHAFT.GUI.WebDriver driver;
    
    // Locators - Android
    private By usernameField = By.id("com.example.app:id/username");
    private By passwordField = By.id("com.example.app:id/password");
    private By loginButton = By.id("com.example.app:id/login");
    
    // Constructor
    public LoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }
    
    // Actions
    public LoginPage enterUsername(String username) {
        driver.element().type(usernameField, username);
        return this;
    }
    
    public LoginPage enterPassword(String password) {
        driver.element().type(passwordField, password);
        return this;
    }
    
    public LoginPage clickLogin() {
        driver.element().click(loginButton);
        return this;
    }
    
    public LoginPage login(String username, String password) {
        return enterUsername(username)
            .enterPassword(password)
            .clickLogin();
    }
}
```

### Create a Test Class

Create: `src/test/java/com/mycompany/tests/LoginTest.java`

```java
package com.mycompany.tests;

import com.mycompany.pages.LoginPage;
import com.shaft.driver.SHAFT;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import org.testng.annotations.*;

public class LoginTest {
    private SHAFT.GUI.WebDriver driver;
    private AppiumDriverLocalService service;
    
    @Test(description = "User can login successfully")
    public void testLogin() {
        new LoginPage(driver)
            .login("testuser@example.com", "password123");
        
        // Add assertion for successful login
        // driver.assertThat(By.id("home_screen")).exists().perform();
    }
    
    @BeforeClass
    public void startAppiumServer() {
        // Start Appium server programmatically (optional)
        service = new AppiumServiceBuilder()
            .usingPort(4723)
            .build();
        service.start();
    }
    
    @BeforeMethod
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
    }
    
    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
    
    @AfterClass
    public void stopAppiumServer() {
        if (service != null) {
            service.stop();
        }
    }
}
```

---

## Step 5: Finding Mobile Elements

### Appium Inspector

Use [Appium Inspector](https://github.com/appium/appium-inspector) to identify elements:

1. Download and install Appium Inspector
2. Start your Appium server
3. Configure capabilities in Inspector
4. Start session and inspect elements

### Common Mobile Locator Strategies

**Android:**
```java
By.id("com.example.app:id/element_id")
By.xpath("//android.widget.TextView[@text='Login']")
By.className("android.widget.Button")
By.accessibilityId("login_button")
```

**iOS:**
```java
By.id("login_button")
By.xpath("//XCUIElementTypeButton[@name='Login']")
By.className("XCUIElementTypeTextField")
By.accessibilityId("login_button")
```

**Cross-platform (using accessibility ID):**
```java
By.accessibilityId("login_button")  // Works on both Android and iOS
```

---

## Step 6: Mobile-Specific Actions

### Touch Actions

```java
// Swipe
driver.element().swipe(fromElement, toElement);

// Scroll to element
driver.element().scrollToElement(elementLocator);

// Tap
driver.element().tap(elementLocator);

// Long press
driver.element().longPress(elementLocator);
```

### App Management

```java
// Install app
driver.browser().installApp("/path/to/app.apk");

// Launch app
driver.browser().launchApp();

// Close app
driver.browser().closeApp();

// Reset app
driver.browser().resetApp();
```

---

## Cloud Execution

### BrowserStack

```properties
# BrowserStack mobile execution
targetPlatform=ANDROID
executionAddress=https://hub.browserstack.com/wd/hub
browserStack.user=YOUR_USERNAME
browserStack.key=YOUR_ACCESS_KEY
mobile_device=Google Pixel 7
mobile_os_version=13.0
mobile_app=bs://your_app_id
```

### LambdaTest

```properties
# LambdaTest mobile execution
targetPlatform=ANDROID
executionAddress=https://mobile-hub.lambdatest.com/wd/hub
lambdaTest.user=YOUR_USERNAME
lambdaTest.accessKey=YOUR_ACCESS_KEY
mobile_deviceName=Galaxy S21
mobile_platformVersion=11
mobile_app=lt://your_app_id
```

---

## Troubleshooting

### Issue: Appium server not starting

**Solution:** 
- Check if port 4723 is already in use: `lsof -i :4723`
- Install Appium: `npm install -g appium@next`

### Issue: App not installing on device

**Solution:**
- Verify the app path is correct
- For Android, enable developer mode and USB debugging
- For iOS, ensure the app is signed correctly

### Issue: Elements not found

**Solution:**
- Use Appium Inspector to verify locators
- Add explicit waits if elements load slowly
- Check if you're using correct platform-specific locators

---

## What's Next?

✅ **You've set up your mobile automation project!**

Continue your journey:

- 📚 [Learn Touch Actions](../Keywords/GUI/Touch_Actions)
- 🔍 [Master Element Identification](../Keywords/GUI/Element_Identification)
- ⚙️ [Configure Mobile Properties](../Properties/PropertiesList#mobile)
- 🔌 [Add Cloud Integrations](./integrations)
- 💬 [Join our Community](./support)

---

[← Back to Getting Started](./first_steps) | [Web Projects →](./setup_web) | [API Projects →](./setup_api)
