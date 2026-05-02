---
id: Custom_Capabilities
title: Custom Browser Capabilities
sidebar_label: Custom Capabilities
description: "Add custom browser capabilities and Selenium options to SHAFT Engine WebDriver — Chrome options, Firefox options, mobile emulation, proxy settings, and extension loading."
keywords: [SHAFT, custom capabilities, browser options, ChromeOptions, FirefoxOptions, Selenium capabilities, headless, mobile emulation]
tags: [web, capabilities, chrome, firefox]
---

SHAFT supports passing a `MutableCapabilities` or browser-specific options object directly to the `SHAFT.GUI.WebDriver` constructor. This lets you configure any capability that Selenium supports — browser arguments, experimental options, proxies, extensions, and more.

```java title="CustomCapabilitiesBasic.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.DriverType;
import org.openqa.selenium.chrome.ChromeOptions;

ChromeOptions options = new ChromeOptions();
options.addArguments("--remote-allow-origins=*");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

---

## Chrome Examples

### Disable Extensions and Notifications

```java title="ChromeOptions.java"
import org.openqa.selenium.chrome.ChromeOptions;
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.DriverType;

ChromeOptions options = new ChromeOptions();
options.addArguments("--disable-extensions");
options.addArguments("--disable-notifications");
options.addArguments("--disable-popup-blocking");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

### Load a Chrome Extension

```java title="ChromeExtension.java"
import java.io.File;
import org.openqa.selenium.chrome.ChromeOptions;

ChromeOptions options = new ChromeOptions();
options.addExtensions(new File("src/test/resources/extensions/my-extension.crx"));

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

### Set a Custom Download Directory

```java title="ChromeDownloadDir.java"
import java.util.HashMap;
import org.openqa.selenium.chrome.ChromeOptions;

HashMap<String, Object> prefs = new HashMap<>();
prefs.put("download.default_directory", System.getProperty("user.dir") + "/target/downloads");
prefs.put("download.prompt_for_download", false);
prefs.put("safebrowsing.enabled", true);

ChromeOptions options = new ChromeOptions();
options.setExperimentalOption("prefs", prefs);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

### Configure HTTP Proxy

```java title="ChromeProxy.java"
import org.openqa.selenium.Proxy;
import org.openqa.selenium.chrome.ChromeOptions;

Proxy proxy = new Proxy();
proxy.setHttpProxy("proxy.example.com:8080");
proxy.setSslProxy("proxy.example.com:8080");

ChromeOptions options = new ChromeOptions();
options.setProxy(proxy);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
```

---

## Firefox Examples

### Disable JavaScript

```java title="FirefoxOptions.java"
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.DriverType;

FirefoxProfile profile = new FirefoxProfile();
profile.setPreference("javascript.enabled", false);

FirefoxOptions options = new FirefoxOptions();
options.setProfile(profile);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.FIREFOX, options);
```

### Set a Custom Download Directory

```java title="FirefoxDownload.java"
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;

FirefoxProfile profile = new FirefoxProfile();
profile.setPreference("browser.download.folderList", 2);
profile.setPreference("browser.download.dir", System.getProperty("user.dir") + "/target/downloads");
profile.setPreference("browser.download.useDownloadDir", true);
profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/pdf,application/octet-stream");

FirefoxOptions options = new FirefoxOptions();
options.setProfile(profile);

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.FIREFOX, options);
```

---

## Edge Example

```java title="EdgeOptions.java"
import org.openqa.selenium.edge.EdgeOptions;
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.DriverType;

EdgeOptions options = new EdgeOptions();
options.addArguments("--disable-extensions");
options.addArguments("--inprivate");

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver(DriverType.MICROSOFT_EDGE, options);
```

---

## Complete Test Example

```java title="CustomCapabilitiesTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.DriverType;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.*;

public class CustomCapabilitiesTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        driver = new SHAFT.GUI.WebDriver(DriverType.CHROME, options);
    }

    @Test
    public void loginWithoutNotificationPopup() {
        driver.browser().navigateToURL("https://example.com/login")
              .and().element().type(By.id("email"), "user@example.com")
              .and().element().type(By.id("password"), "secret")
              .and().element().click(By.id("loginBtn"))
              .and().assertThat().browser().url().contains("/dashboard").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
For simple browser configuration (headless mode, browser type, window size), prefer [SHAFT Properties](../../../Properties/PropertyTypes) over custom capabilities — they are environment-portable and don't require code changes.

Use custom capabilities only for browser-specific settings that are not exposed as SHAFT properties.
:::

:::note
When running on Selenium Grid or cloud platforms (BrowserStack, LambdaTest), custom capabilities are merged with the platform-level capabilities defined in your properties file.
:::
