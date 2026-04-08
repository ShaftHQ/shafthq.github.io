---
id: Mobile_Emulation
title: Mobile Emulation
sidebar_label: Mobile Emulation
description: "Emulate mobile devices in Chrome using SHAFT Engine — preset devices like iPhone and Android, or custom screen dimensions and user-agent strings."
keywords: [SHAFT, mobile emulation, Chrome DevTools, responsive testing, device emulation, mobile browser testing, viewport]
tags: [web, mobile, emulation, chrome, responsive]
---

## Overview

SHAFT supports **Chrome DevTools mobile emulation** to render your web application as it would appear on a real mobile device — without needing a physical device or Appium. You simply configure a few properties before creating the driver instance.

Mobile emulation is ideal for:
- Verifying responsive layouts without dedicated mobile infrastructure
- Running quick smoke tests for mobile viewports
- Reproducing mobile-specific bugs in CI

---

## Preset Device Emulation

Use a named device from Chrome's built-in device list (the same list shown in Chrome DevTools → Device Toolbar):

```java title="PresetDeviceEmulation.java"
import com.shaft.driver.SHAFT;

// Configure before creating the driver
SHAFT.Properties.web.set()
     .isMobileEmulation(true)
     .mobileEmulationIsCustomDevice(false)
     .mobileEmulationDeviceName("iPhone 12 Pro");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://example.com");
// The page renders as it would on an iPhone 12 Pro
```

### Popular Preset Device Names

| Device | Name String |
|:-------|:------------|
| iPhone SE | `"iPhone SE"` |
| iPhone 12 Pro | `"iPhone 12 Pro"` |
| iPhone 14 Pro Max | `"iPhone 14 Pro Max"` |
| Pixel 7 | `"Pixel 7"` |
| Samsung Galaxy S20 Ultra | `"Samsung Galaxy S20 Ultra"` |
| iPad Air | `"iPad Air"` |
| iPad Mini | `"iPad Mini"` |

:::tip
The full list of supported device names is identical to the list in **Chrome DevTools → More tools → Sensors → Device**. Any device name that works there will work with SHAFT.
:::

---

## Custom Device Emulation

For a device not in Chrome's preset list, or to test an exact viewport, define your own dimensions:

```java title="CustomDeviceEmulation.java"
SHAFT.Properties.web.set()
     .isMobileEmulation(true)
     .mobileEmulationIsCustomDevice(true)
     .mobileEmulationWidth(390)
     .mobileEmulationHeight(844)
     .mobileEmulationPixelRatio(3.0)
     .mobileEmulationUserAgent(
         "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
         + "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
     );

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://example.com");
```

| Property | Description |
|:---------|:------------|
| `mobileEmulationWidth` | Viewport width in CSS pixels |
| `mobileEmulationHeight` | Viewport height in CSS pixels |
| `mobileEmulationPixelRatio` | Device pixel ratio (e.g. `3.0` for Retina) |
| `mobileEmulationUserAgent` | UA string sent to the server |

---

## Via Properties File

You can also configure mobile emulation in `src/main/resources/properties/web.properties`:

```properties title="src/main/resources/properties/web.properties"
isMobileEmulation=true
mobileEmulationIsCustomDevice=false
mobileEmulationDeviceName=Pixel 7
```

Or pass values on the command line:

```bash
mvn test -DisMobileEmulation=true -DmobileEmulationDeviceName="iPhone 12 Pro"
```

---

## Complete Test Example

```java title="MobileEmulationTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class MobileEmulationTest {
    SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        SHAFT.Properties.web.set()
             .isMobileEmulation(true)
             .mobileEmulationIsCustomDevice(false)
             .mobileEmulationDeviceName("iPhone 12 Pro");

        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void mobileMenuIsVisibleOnSmallScreen() {
        driver.browser().navigateToURL("https://example.com");

        // On mobile, the hamburger menu should be visible
        driver.assertThat().element(By.cssSelector(".hamburger-menu"))
              .isDisplayed()
              .perform();

        // Desktop navigation should be hidden
        driver.assertThat().element(By.cssSelector(".desktop-nav"))
              .isHidden()
              .perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

## Best Practices

1. **Always reset emulation settings** in `@AfterMethod` or use separate driver instances per test to avoid cross-test pollution.
2. **Prefer preset device names** over custom dimensions for consistency with real device behaviour (the UA string and pixel ratio are set automatically).
3. **Combine with `headlessExecution=true`** in CI to run mobile emulation tests without a display.
4. **Use SHAFT's screenshot capabilities** (`driver.browser().captureScreenshot()`) to attach mobile-viewport screenshots to the Allure report for visual review.

---

## Related

- [Properties List](../../../Properties/PropertiesList) — full reference for all `web.*` properties
- [Cross-Platform Strategy](../../../Best_Practices/Cross_Platform_Strategy) — how to structure tests across desktop and mobile
