---
id: first_steps_6
title: "Install, Upgrade, and Migrate to SHAFT Engine"
sidebar_label: Install & Upgrade
description: "Step-by-step guide to install SHAFT Engine in a new project, upgrade an existing SHAFT project to the latest version, or migrate from native Selenium/Appium/REST Assured."
keywords: [install shaft engine, upgrade shaft engine, migrate selenium to shaft, shaft maven dependency, shaft version, java 21 test automation]
tags: [getting-started, migration, installation, upgrade, selenium]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install, Upgrade & Migrate

This guide covers three scenarios:

| Scenario | Section |
|----------|---------|
| **Fresh install** into a blank Maven project | [→ Fresh Install](#fresh-install) |
| **Upgrade** an existing SHAFT project to the latest version | [→ Upgrading SHAFT](#upgrading-shaft) |
| **Migrate** a native Selenium / Appium / REST Assured project | [→ Migrating from Native Selenium](#migrating-from-native-selenium) |

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Java** | Java 21 LTS | Java 21 LTS |
| **Maven** | 3.8+ | Latest stable |
| **IDE** | IntelliJ IDEA, Eclipse | [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) |
| **OS** | Windows, macOS, Linux | Any |

:::info[Why Java 21?]
SHAFT uses **Java 21 virtual threads** to power `driver.async().element()` — non-blocking parallel element actions. Java 21 is the current LTS release and is required. Set `<java.version>21</java.version>` in your `pom.xml`.
:::

---

## Fresh Install

### Step 1 — Add the Dependency

Add SHAFT to your `pom.xml`:

```xml title="pom.xml"
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>

<dependencies>
    <dependency>
        <groupId>io.github.shafthq</groupId>
        <artifactId>SHAFT_ENGINE</artifactId>
        <version>10.2.20260501</version>
    </dependency>
</dependencies>
```

:::tip[Always use a pinned version]
Replace `10.2.20260501` with the [latest release from Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE). Using `RELEASE` is not recommended for reproducible builds.
:::

### Step 2 — Add a Properties File

Create `src/main/resources/properties/custom.properties` (SHAFT auto-creates the directory on first run but you can pre-create it):

```properties title="src/main/resources/properties/custom.properties"
# Browser (chrome | firefox | microsoftedge | safari)
targetBrowserName=chrome

# Run headless in CI
headlessExecution=false

# Screenshots
screenshotParams_whenToTakeAScreenshot=ValidationPointsOnly
```

### Step 3 — Write Your First Test

```java title="src/test/java/tests/MyFirstTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class MyFirstTest {
    private SHAFT.GUI.WebDriver driver;

    @Test
    public void searchOnDuckDuckGo() {
        driver.browser().navigateToURL("https://duckduckgo.com/")
              .and().element().type(By.name("q"), "SHAFT Engine test automation")
              .and().element().click(By.cssSelector("button[type='submit']"))
              .and().assertThat().browser().title().contains("SHAFT").perform();
    }

    @BeforeMethod
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}
```

### Step 4 — Run

```bash title="Terminal"
mvn test
```

The Allure report opens automatically in your browser when all tests finish.

---

## Upgrading SHAFT

### Find the Latest Version

Check [Maven Central](https://central.sonatype.com/artifact/io.github.shafthq/SHAFT_ENGINE) or the [GitHub Releases page](https://github.com/ShaftHQ/SHAFT_ENGINE/releases/latest) for the latest version.

Current latest: **`10.2.20260501`**

### Update `pom.xml`

```xml title="pom.xml — update the version tag"
<dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>SHAFT_ENGINE</artifactId>
    <version>10.2.20260501</version>  <!-- update this line -->
</dependency>
```

### Refresh Dependencies

<Tabs>
  <TabItem value="idea" label="IntelliJ IDEA" default>

Right-click `pom.xml` → **Maven** → **Reload Project**, or click the **🔄 Load Maven Changes** notification.

  </TabItem>
  <TabItem value="cli" label="Terminal">

```bash
mvn dependency:resolve
```

  </TabItem>
</Tabs>

### Upgrade Checklist

After updating the version, run through this checklist:

- [ ] **Run the full test suite** — `mvn test` — to catch any compatibility issues.
- [ ] **Review the [release notes](https://github.com/ShaftHQ/SHAFT_ENGINE/releases)** for breaking changes in the new version.
- [ ] **Update property files** if any new properties were introduced (SHAFT writes updated defaults on first run).
- [ ] **Check deprecated API usage** — IntelliJ will highlight strikethrough methods. Follow the Javadoc for the replacement.
- [ ] **Verify Java version** — confirm `<java.version>21</java.version>` is set in your `pom.xml`.

### Version History (Recent)

| Version | Released | Highlights |
|---------|----------|-----------|
| `10.2.20260501` | 2026-05-01 | Fix `waitUntil` lambda expressions, fix Equals on incomparable types, CI improvements, httpclient5 security fix |
| `10.2.20260411` | 2026-04-11 | Selenium 4.43, dependency tree cleanup, removed all deprecated methods |
| `10.1.20260331` | 2026-03-31 | Stability improvements, Dependabot updates |

For older version history see the [GitHub Releases archive](https://github.com/ShaftHQ/SHAFT_ENGINE/releases).

---

## Migrating from Native Selenium

Already have a Selenium, Appium, or REST Assured project? Add SHAFT incrementally — your existing `By` locators and test logic stay unchanged.

### Step 1 — Add the SHAFT Dependency

Same as [Fresh Install Step 1](#step-1--add-the-dependency) above.

### Step 2 — Replace Driver Initialization

<Tabs>
  <TabItem value="web" label="Web (Selenium)" default>

```java title="Before — native Selenium"
WebDriver driver = new ChromeDriver();
driver.manage().window().maximize();
```

```java title="After — SHAFT (browser configured via properties)"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
// browser type, size, and capabilities are in custom.properties — no code change needed
```

  </TabItem>
  <TabItem value="mobile" label="Mobile (Appium)">

```java title="Before — native Appium"
DesiredCapabilities caps = new DesiredCapabilities();
caps.setCapability("platformName", "Android");
caps.setCapability("automationName", "UiAutomator2");
caps.setCapability("app", "/path/to/app.apk");
AppiumDriver driver = new AndroidDriver(new URL("http://localhost:4723"), caps);
```

```java title="After — SHAFT (capabilities in custom.properties)"
// custom.properties:
// targetPlatform=ANDROID
// executionAddress=127.0.0.1:4723
// mobile_automationName=UIAUTOMATOR2
// mobile_app=src/test/resources/apps/MyApp.apk

SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

  </TabItem>
  <TabItem value="api" label="API (REST Assured)">

```java title="Before — native REST Assured"
Response response = given()
    .header("Authorization", "Bearer " + token)
    .when()
    .get("https://api.example.com/users/1")
    .then()
    .statusCode(200)
    .extract().response();
```

```java title="After — SHAFT API"
SHAFT.API api = new SHAFT.API("https://api.example.com");
api.get("/users/1")
   .addHeader("Authorization", "Bearer " + token)
   .setTargetStatusCode(200)
   .perform();

api.assertThatResponse()
   .extractedJsonValue("$.name")
   .isEqualTo("Alice")
   .perform();
```

  </TabItem>
</Tabs>

### Step 3 — Remove Manual Waits

SHAFT auto-waits for every element action. Remove `WebDriverWait` and `Thread.sleep()` calls:

```java title="Before"
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
driver.findElement(By.id("submit")).click();
```

```java title="After — SHAFT waits automatically"
driver.element().click(By.id("submit"));
```

The default timeout is configurable via:
```properties title="custom.properties"
elementIdentificationTimeout=5   # seconds to wait for element
```

### Step 4 — Switch to SHAFT Assertions

Replace TestNG/JUnit assertions with SHAFT's built-in validation chain for rich report output:

```java title="Before"
Assert.assertEquals(driver.getTitle(), "Dashboard | My App");
Assert.assertTrue(driver.findElement(By.id("welcome")).isDisplayed());
```

```java title="After — SHAFT assertions with Allure reporting"
driver.assertThat().browser().title().isEqualTo("Dashboard | My App").perform();
driver.assertThat(By.id("welcome")).isDisplayed().perform();
```

### Step 5 — Externalize Configuration

Move hard-coded browser, URL, and credential values to `custom.properties`:

```java title="Before — hard-coded"
driver.get("https://staging.myapp.com");
```

```java title="After — value from environment or property"
// In custom.properties or set via CLI: -DbaseUrl=https://staging.myapp.com
String baseUrl = SHAFT.Properties.flags.baseURL();
driver.browser().navigateToURL(baseUrl);
```

### Migration Pace

You do **not** need to migrate everything at once. A safe incremental order is:

1. Replace driver initialization → let SHAFT manage browser lifecycle
2. Remove explicit waits → rely on SHAFT auto-wait
3. Replace assertions → use `driver.assertThat()` / `SHAFT.Validations`
4. Externalize configuration → properties files or CLI flags
5. Adopt fluent chaining → use `.and()` to chain actions

:::tip[Keep native access when needed]
At any point you can drop back to the underlying Selenium `WebDriver`:
```java
WebDriver nativeDriver = driver.getDriver();
```
SHAFT never locks you in.
:::

---

## Related Pages

- [New Project Setup →](./first_steps_5) — interactive generator or archetype
- [Web Testing Guide →](./setup_web) — TestNG, JUnit 5, Cucumber
- [Properties Reference →](../Properties/PropertiesList) — all configurable settings
- [Integrations →](./integrations) — BrowserStack, LambdaTest, Jira, Healenium