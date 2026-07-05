---
id: Self_Healing_Locators
title: Self-Healing Locators
sidebar_label: Self-Healing Locators
description: "Recover broken web locators in SHAFT Engine with SHAFT Heal, with legacy Healenium configuration documented for compatibility."
keywords: [SHAFT, self-healing locators, SHAFT Heal, Healenium, broken locators, test maintenance, flaky tests, DOM changes]
tags: [web, self-healing, healenium, locators]
---

For current SHAFT projects, start with
[SHAFT Heal](/docs/agentic/heal): add `shaft-heal` and opt in with
`healing.strategy=shaft-heal`. SHAFT Heal is deterministic, explainable,
disabled by default, and writes reviewable locator recovery reports.

This page keeps the legacy Healenium path documented for projects that already
use it or explicitly need Healenium backend integration.

:::info
Healenium remains opt-in through `healing.strategy=healenium`, or through the
legacy `heal-enabled=true` flag when no explicit SHAFT Heal strategy is set. It
requires a **backend server** running alongside your tests. See the
[Healenium documentation](https://healenium.io/docs/) for server setup
instructions using Docker.
:::

---

## Legacy Healenium flow

1. When an element cannot be found by its locator, Healenium intercepts the failure.
2. It queries the Healenium backend server, which analyses the last known DOM snapshot.
3. The backend returns a ranked list of candidate elements scored by similarity.
4. If a candidate exceeds the configured `scoreCap`, the action proceeds on the healed element.
5. A healing report is generated so you can update your locators proactively.

---

## Legacy Healenium configuration

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

## Legacy Healenium properties

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

        driver.assertThat().browser().url().contains("/dashboard");
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```

---

:::tip
Prefer SHAFT Heal for new locator recovery work. For legacy Healenium suites,
review the Healenium healing report after each test run and update your
locators to the healed versions. Self-healing is a safety net, not a substitute
for maintaining accurate locators.
:::

:::warning
Disable Healenium for performance-sensitive test suites or when running in environments where the Healenium backend server is not available.
:::

## Related

- [SHAFT Heal](/docs/agentic/heal)
- [Did You Know](/docs/reference/actions/GUI/Did_You_Know)
- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Web](/docs/testing/web)
