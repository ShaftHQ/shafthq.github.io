---
id: mobile
title: Mobile GUI Demo Projects
sidebar_label: Mobile
description: "Working demo projects for mobile app test automation with SHAFT Engine and Appium — Android emulator setup, programmatic properties, and Page Object Model examples."
keywords: [SHAFT, mobile demo, Appium demo, Android automation, mobile testing example, Appium sample, UiAutomator2]
tags: [mobile, demo, appium, android]
---

The demos below are runnable, real-world examples for Android native app automation with SHAFT Engine + Appium.

---

## Android Native App — Programmatic Setup

Configure Appium properties in code using `@BeforeClass`, then run your test methods with a clean driver per method.

```java title="src/test/java/tests/AppiumSampleTests.java"
import com.shaft.driver.SHAFT;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.github.appium.uiautomator2.AutomationName;
import com.shaft.enums.internal.Platform;
import org.testng.annotations.*;

public class AppiumSampleTests {
    private SHAFT.GUI.WebDriver driver;
    private AppiumDriverLocalService service;

    @Test
    public void appiumDemo() {
        new HomePage(driver)
            .navigateToViews();
        new ViewsPage(driver)
            .navigateToSpinner();
        new SpinnerPage(driver)
            .verifyColorFieldExists();
    }

    @BeforeClass
    public void beforeClassSetUp() {
        // Start the local Appium server programmatically
        service = new AppiumServiceBuilder()
            .usingPort(4723)
            .withIPAddress("127.0.0.1")
            .withArgument(() -> "--use-drivers", "uiautomator2")
            .build();
        service.start();

        // Configure SHAFT properties for this run
        SHAFT.Properties.mobile.set()
            .automationName(AutomationName.ANDROID_UIAUTOMATOR2)
            .app("src/test/resources/apps/ApiDemos-debug.apk")
            .deviceName("Medium Phone API 35")
            .autoGrantPermissions("true");

        SHAFT.Properties.platform.set()
            .targetPlatform(Platform.ANDROID.name())
            .executionAddress("127.0.0.1:4723");
    }

    @BeforeMethod
    public void beforeMethodSetUp() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    public void afterMethodTearDown() {
        driver.quit();
    }

    @AfterClass
    public void afterClassTearDown() {
        if (service != null && service.isRunning()) {
            service.stop();
        }
    }
}
```

:::tip
Instead of starting Appium from Java, you can start it from the command line (`appium`) and set `executionAddress=127.0.0.1:4723` in your `custom.properties` file — no `AppiumServiceBuilder` required.
:::

---

## Page Objects for Mobile

SHAFT's Page Object Model works identically on mobile. Pass the driver instance via the constructor and use Appium locator strategies.

```java title="src/test/java/pages/HomePage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class HomePage {
    private final SHAFT.GUI.WebDriver driver;

    // Use AccessibilityId, XPath, or UiAutomator2 selectors
    private final By viewsMenuItem = By.xpath("//android.widget.TextView[@text='Views']");

    public HomePage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public ViewsPage navigateToViews() {
        driver.element().click(viewsMenuItem);
        return new ViewsPage(driver);
    }
}
```

```java title="src/test/java/pages/ViewsPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class ViewsPage {
    private final SHAFT.GUI.WebDriver driver;

    private final By spinnerMenuItem = By.xpath("//android.widget.TextView[@text='Spinner']");

    public ViewsPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public SpinnerPage navigateToSpinner() {
        driver.element().click(spinnerMenuItem);
        return new SpinnerPage(driver);
    }
}
```

```java title="src/test/java/pages/SpinnerPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class SpinnerPage {
    private final SHAFT.GUI.WebDriver driver;

    private final By colorSpinner = By.id("io.appium.android.apis:id/spinner1");

    public SpinnerPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public void verifyColorFieldExists() {
        driver.assertThat(colorSpinner)
              .isVisible()
              .withCustomReportMessage("Color spinner must be visible on the Spinner page")
              .perform();
    }
}
```

---

## Properties-Based Setup (No Code Changes)

For CI/CD pipelines, configure everything in `custom.properties` so no code changes are needed between environments:

```properties title="src/main/resources/properties/custom.properties"
executionAddress=127.0.0.1:4723
targetOperatingSystem=ANDROID
mobile_automationName=UiAutomator2
mobile_app=src/test/resources/apps/ApiDemos-debug.apk
mobile_deviceName=Medium Phone API 35
mobile_autoGrantPermissions=true
```

Override from CI command line:

```bash
mvn test -Dmobile_deviceName="Pixel_9_API_35" -DexecutionAddress="127.0.0.1:4723"
```

---

:::info
Visit this repository for a complete demo on mobile GUI automation with SHAFT Engine:
### [BasicMobile_Demo](https://github.com/ShaftHQ/ShaftEngine-Appium.git)
:::
