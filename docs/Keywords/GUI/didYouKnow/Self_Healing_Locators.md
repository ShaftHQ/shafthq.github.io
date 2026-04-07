---
id: Self_Healing_Locators
title: Self-Healing Locators with Healenium
sidebar_label: Self-Healing Locators
description: "Automatically recover from broken locators in SHAFT Engine using Healenium — configure self-healing properties and reduce test maintenance overhead."
keywords: [SHAFT, self-healing locators, Healenium, broken locators, test maintenance, flaky tests, DOM changes]
tags: [web, self-healing, healenium, locators]
---

SHAFT Engine integrates [Healenium](https://healenium.io/) to automatically recover from broken element locators caused by DOM changes. When a locator fails to find an element, Healenium analyses the current DOM and attempts to locate the best matching element — reducing test maintenance overhead.

:::info
Healenium requires a **backend server** running alongside your tests. See the [Healenium documentation](https://healenium.io/docs/) for server setup instructions using Docker.
:::

---

## How It Works

1. When an element cannot be found by its locator, Healenium intercepts the failure.
2. It queries the Healenium backend server, which analyses the last known DOM snapshot.
3. The backend returns a ranked list of candidate elements scored by similarity.
4. If a candidate exceeds the configured `scoreCap`, the action proceeds on the healed element.
5. A healing report is generated so you can update your locators proactively.

---

## Configuration

Configure Healenium properties programmatically using `SHAFT.Properties.healenium.set()`:

```java title="SelfHealingLocators.java"
import com.shaft.driver.SHAFT;

// Enable Healenium self-healing locators
SHAFT.Properties.healenium.set()
    .healEnabled(true)
    .recoveryTries(3)
    .scoreCap("0.7")
    .serverHost("localhost")
    .serverPort(7878);
```

Alternatively, set these properties in `src/main/resources/properties/Healenium.properties`:

```properties title="Healenium.properties"
heal-enabled=true
recovery-tries=3
score-cap=0.7
healenium.server.host=localhost
healenium.server.port=7878
```

---

## Available Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `healEnabled` | boolean | `false` | Enable or disable self-healing |
| `recoveryTries` | int | `1` | Number of healing attempts before failing |
| `scoreCap` | String | `"0.5"` | Minimum similarity score (0.0–1.0) to accept a healed locator |
| `serverHost` | String | `"localhost"` | Healenium backend server host |
| `serverPort` | int | `7878` | Healenium backend server port |

---

## Usage Example

Once Healenium is enabled, no changes are needed in your test code. Locators will automatically self-heal when the DOM changes:

```java title="SelfHealingTest.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class SelfHealingTest {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        SHAFT.Properties.healenium.set()
            .healEnabled(true)
            .recoveryTries(3)
            .scoreCap("0.7");

        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void testLoginWithSelfHealing() {
        driver.browser().navigateToURL("https://example.com/login");

        // If the DOM changes and "oldButtonId" no longer exists,
        // Healenium will attempt to find the best matching element
        driver.element()
            .type(By.id("username"), "testuser")
            .type(By.id("password"), "secret")
            .click(By.id("loginBtn")); // auto-heals if ID changed

        driver.assertThat().browser().url().contains("/dashboard").perform();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Review the Healenium healing report after each test run and update your locators to the healed versions. Self-healing is a safety net, not a substitute for maintaining accurate locators.
:::

:::warning
Disable Healenium for performance-sensitive test suites or when running in environments where the Healenium backend server is not available.
:::
