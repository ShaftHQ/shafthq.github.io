---
id: JUnit_Integration
title: JUnit Integration
sidebar_label: JUnit Integration
description: "Run SHAFT Engine tests with JUnit — set up test classes with @BeforeEach, @AfterEach, @Test, and @Order annotations alongside the SHAFT WebDriver."
keywords: [SHAFT, JUnit, JUnit Jupiter, test setup, BeforeEach, AfterEach, TestMethodOrder, integration]
tags: [getting-started, junit, test-setup]
---

SHAFT Engine supports **JUnit (Jupiter)** as a first-class test runner alongside TestNG. All SHAFT APIs, reporting, and properties configuration work identically regardless of which test framework you choose.

---

## Maven Dependency

Add the JUnit Jupiter engine to your `pom.xml`:

```xml title="pom.xml"
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
</dependency>
```

:::info
SHAFT Engine's `pom.xml` may already include JUnit transitively. Check your dependency tree with `mvn dependency:tree` before adding it manually.
:::

---

## Runtime Registration

SHAFT Engine registers its JUnit support through the Java ServiceLoader
mechanism:

- `com.shaft.listeners.JunitListener` is registered as a JUnit Platform
  `LauncherSessionListener`.
- `com.shaft.listeners.JunitExtension` is registered as a Jupiter extension.
- `junit.jupiter.extensions.autodetection.enabled=true` is supplied through
  `junit-platform.properties`.

Generated JUnit projects also create or update
`src/test/resources/junit-platform.properties` without replacing existing
settings. If you maintain that file yourself, keep this line in it:

```properties title="src/test/resources/junit-platform.properties"
junit.jupiter.extensions.autodetection.enabled=true
```

You do not need to add `@ExtendWith` to ordinary SHAFT JUnit tests.

The listener and extension together provide the same SHAFT lifecycle behavior
that TestNG users get: engine setup and teardown, Allure attachments, execution
summary rows, telemetry, Jira/Xray handoff, retries, fail-fast skips, linked
issue skips, setup/teardown failure reporting, and soft-verification failures
that fail the JUnit run.

:::note
TestNG remains supported. TestNG XML suite shaping and TestNG retry analyzer
binding are still TestNG runner features. For JUnit cross-browser coverage, use
JUnit parameterized tests and SHAFT per-thread properties instead of relying on
TestNG XML cloning.
:::

---

## Test Class Structure

```java title="WebTestJUnit.java"
import com.shaft.driver.SHAFT;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WebTestJUnit {
    private static SHAFT.GUI.WebDriver driver;

    @BeforeEach
    void beforeEach() {
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    @Order(1)
    void navigateAndAssertTitle() {
        driver.browser().navigateToURL("https://duckduckgo.com/")
              .and().assertThat().browser().title().contains("DuckDuckGo");
    }

    @Test
    @Order(2)
    void searchAndVerifyResults() {
        driver.browser().navigateToURL("https://duckduckgo.com/");
        driver.element().type(By.id("searchbox_input"), "SHAFT Engine");
        driver.element().click(By.id("search_button_homepage"));
        driver.assertThat().browser().url().contains("q=SHAFT");
    }

    @AfterEach
    void afterEach() {
        driver.quit();
    }
}
```

---

## JUnit vs TestNG Comparison

| Feature | JUnit | TestNG |
|---|---|---|
| Setup annotation | `@BeforeEach` | `@BeforeMethod` |
| Teardown annotation | `@AfterEach` | `@AfterMethod` |
| Class-level setup | `@BeforeAll` | `@BeforeClass` |
| Test ordering | `@TestMethodOrder` + `@Order` | `priority` on `@Test` |
| Test annotation | `@Test` (Jupiter) | `@Test` (TestNG) |
| Parameterized tests | `@ParameterizedTest` | `@DataProvider` |

---

## Class-Level Driver (Shared Instance)

Use `@BeforeAll` / `@AfterAll` with a `static` driver for tests that share a single browser session:

```java title="SharedDriverJUnit.java"
import com.shaft.driver.SHAFT;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SharedDriverJUnit {
    private static SHAFT.GUI.WebDriver driver;

    @BeforeAll
    static void setupAll() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://example.com/login");
        driver.element()
            .type(By.id("email"), "test@example.com")
            .type(By.id("password"), "secret")
            .click(By.id("loginBtn"));
    }

    @Test
    @Order(1)
    void verifyDashboardLoaded() {
        driver.assertThat().browser().url().contains("/dashboard");
    }

    @Test
    @Order(2)
    void verifyUserNameDisplayed() {
        driver.assertThat(By.id("userName")).text().contains("Test User");
    }

    @AfterAll
    static void teardownAll() {
        driver.quit();
    }
}
```

---

:::tip
Use `@BeforeEach` / `@AfterEach` (fresh driver per test) for **independent test isolation**. Use `@BeforeAll` / `@AfterAll` (shared driver) for **ordered workflow tests** where each step builds on the previous one.
:::

:::note
SHAFT's JUnit listener and extension are automatically registered via the Java
ServiceLoader mechanism.
:::

## Related

- [Solution Design](/docs/reference/guides/Solution_Design)
- [Test Structure](/docs/reference/guides/Test_Structure)
- [Ci Cd Integration](/docs/reference/guides/CI_CD_Integration)
- [Quick Start](/docs/start/quick-start)

