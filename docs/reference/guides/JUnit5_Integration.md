---
id: JUnit5_Integration
title: JUnit 5 Integration
sidebar_label: JUnit 5 Integration
description: "Run SHAFT Engine tests with JUnit 5 — set up test classes with @BeforeEach, @AfterEach, @Test, and @Order annotations alongside the SHAFT WebDriver."
keywords: [SHAFT, JUnit 5, JUnit Jupiter, test setup, BeforeEach, AfterEach, TestMethodOrder, integration]
tags: [getting-started, junit5, test-setup]
---

SHAFT Engine supports **JUnit 5 (Jupiter)** as a first-class test runner alongside TestNG. All SHAFT APIs, reporting, and properties configuration work identically regardless of which test framework you choose.

---

## Maven Dependency

Add the JUnit 5 Jupiter engine to your `pom.xml`:

```xml title="pom.xml"
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
</dependency>
```

:::info
SHAFT Engine's `pom.xml` may already include JUnit 5 transitively. Check your dependency tree with `mvn dependency:tree` before adding it manually.
:::

---

## Test Class Structure

```java title="WebTestJUnit5.java"
import com.shaft.driver.SHAFT;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WebTestJUnit5 {
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
        driver.assertThat().browser().url().contains("q=SHAFT").perform();
    }

    @AfterEach
    void afterEach() {
        driver.quit();
    }
}
```

---

## JUnit 5 vs TestNG Comparison

| Feature | JUnit 5 | TestNG |
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

```java title="SharedDriverJUnit5.java"
import com.shaft.driver.SHAFT;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SharedDriverJUnit5 {
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
        driver.assertThat().browser().url().contains("/dashboard").perform();
    }

    @Test
    @Order(2)
    void verifyUserNameDisplayed() {
        driver.assertThat(By.id("userName")).text().contains("Test User").perform();
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
SHAFT's `JunitListener` is automatically registered via the Java ServiceLoader mechanism — you do not need to add `@ExtendWith` annotations to enable SHAFT reporting for JUnit 5 tests.
:::
