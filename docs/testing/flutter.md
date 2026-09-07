---
id: flutter
title: Flutter testing guide
sidebar_label: Flutter
description: SHAFT Flutter guide with Locator.flutter factories and tap/type/assert sample.
keywords: [SHAFT, Flutter, Appium, flutterKey, FlutterIntegration, mobile]
tags: [mobile, flutter, appium]
---

# Flutter testing guide

Specialized guide for automating Flutter apps with SHAFT Engine and the
Appium Flutter Integration driver. For broader mobile setup, see
[Mobile and Flutter testing](/docs/testing/mobile).

## Prerequisites

Requires JDK 17+, Appium Flutter Integration driver, emulator or BrowserStack, and a debug APK.

## Obtain or build the demo APK

Prefer the SHAFT CI pin of AppiumTestDistribution/appium-flutter-server:

- Repository: https://github.com/AppiumTestDistribution/appium-flutter-server
- Pin: 78ba97a6146091b944335d0db3330f74416f3ac7
- Sparse checkout must include both demo-app and server (gotcha)

Clone that pin, build a debug APK from demo-app, then assembleDebug with the
Integration Server dart entrypoint under integration_test/appium.dart (same
recipe as e2eTests.yml). Copy app-debug.apk to
shaft-engine/src/test/resources/testDataFiles/apps/flutter-demo.apk.

Release APKs are unsupported and fail with Flutter server is not started.

## Locator reference

Prefer SHAFT.GUI.Locator.flutter* over raw AppiumBy.flutter* in new tests:

| Factory | Finds by | Example |
| --- | --- | --- |
| flutterKey | Key / ValueKey | SHAFT.GUI.Locator.flutterKey("LoginButton") |
| flutterText | Exact text | SHAFT.GUI.Locator.flutterText("Please Login") |
| flutterTextContaining | Partial text | SHAFT.GUI.Locator.flutterTextContaining("Please") |
| flutterType | Widget type | SHAFT.GUI.Locator.flutterType("TextField") |
| flutterSemanticsLabel | Semantics label | SHAFT.GUI.Locator.flutterSemanticsLabel("login_button") |
| flutterDescendant / flutterAncestor | Hierarchy | Pass AppiumBy.FlutterBy args |

The Locators enum (XPATH/CSS) is only the relation-builder strategy enum, not a
full By catalog. Cucumber ElementSteps accepts mobile/Flutter type strings such
as flutterkey and accessibilityid; the Java API remains the primary Flutter path.

## Copy-paste runnable sample

Matches testPackage.appium.FlutterTest against the pinned demo-app Login screen.

```java
package testPackage.appium;

import com.shaft.driver.SHAFT;
import io.appium.java_client.remote.AutomationName;
import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class FlutterLoginSample {
    private SHAFT.GUI.WebDriver driver;

    private static final By PLEASE_LOGIN = SHAFT.GUI.Locator.flutterText("Please Login");
    private static final By USERNAME = SHAFT.GUI.Locator.flutterKey("username_text_field");
    private static final By PASSWORD = SHAFT.GUI.Locator.flutterKey("password");
    private static final By LOGIN = SHAFT.GUI.Locator.flutterKey("LoginButton");
    private static final By HOME_TITLE = SHAFT.GUI.Locator.flutterText("Samples List");

    @BeforeMethod
    public void setup() {
        SHAFT.Properties.platform.set().targetPlatform(Platform.ANDROID.name());
        SHAFT.Properties.mobile.set().automationName(AutomationName.FLUTTER_INTEGRATION);
        SHAFT.Properties.mobile.set().browserName("");
        SHAFT.Properties.platform.set().executionAddress("127.0.0.1:4723");
        SHAFT.Properties.mobile.set().app("src/test/resources/testDataFiles/apps/flutter-demo.apk");
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void tapTypeAssertText() {
        driver.assertThat().element(PLEASE_LOGIN).exists();
        driver.element().type(USERNAME, "admin");
        driver.element().type(PASSWORD, "1234");
        driver.element().assertThat(USERNAME).text().isEqualTo("admin");
        driver.element().click(LOGIN);
        driver.assertThat().element(HOME_TITLE).exists();
        driver.element().assertThat(HOME_TITLE).text().contains("Samples");
    }

    @AfterMethod(alwaysRun = true)
    public void teardown() {
        if (driver != null) { driver.quit(); }
    }
}
```

### Run locally

1. Start Appium on 127.0.0.1:4723 with the Flutter Integration driver available.
2. Attach an emulator or device.
3. From the SHAFT_ENGINE checkout, run Maven against FlutterTest with:
   `-Dshaft.enableFlutterE2E=true`
   `-DexecutionAddress=127.0.0.1:4723`
   `-Dmobile_app=src/test/resources/testDataFiles/apps/flutter-demo.apk`

Without `-Dshaft.enableFlutterE2E=true`, FlutterTest throws SkipException so
PR-gate unit jobs stay green with no emulator.

## Common pitfalls

| Pitfall | Fix |
| --- | --- |
| Release APK | Rebuild debug/profile with Integration Server target |
| Sparse-checkout missing server | Include both demo-app and server |
| Wrong driver package | Use appium-flutter-integration-driver + FlutterIntegration |
| Confusing enable flags | shaft.enableFlutterE2E unskips FlutterTest; enableFlutterEmulatorE2E is a legacy workflow_dispatch input (nightly already selects the job) |
| Flutter in GLOBAL_TESTING_SCOPE | Keep Flutter on dedicated Android_Flutter_Emulator_E2E only |
| Old counter-app locators | CI demo-app is the Appium Testing App login flow |

## Related

- Engine sample: shaft-engine/src/test/java/testPackage/appium/FlutterTest.java
- Workflow: .github/workflows/e2eTests.yml (Flutter_Demo_App_Build, Android_Flutter_Emulator_E2E)
- Locator tips: [Locators and Self-Healing](/docs/reference/actions/GUI/Locators_And_Self_Healing)
- Issue: https://github.com/ShaftHQ/SHAFT_ENGINE/issues/5638

