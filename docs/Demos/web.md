---
id: web
title: Web GUI Demo Projects
sidebar_label: Web
description: "Working demo projects for web GUI test automation with SHAFT Engine — parallel execution, ThreadLocal driver, and Page Object Model examples."
keywords: [SHAFT, web demo, parallel execution, ThreadLocal, Page Object Model, web automation example]
tags: [web, demo, selenium, parallel]
---

The demos below are runnable, real-world examples showing common SHAFT patterns. Use them as starting templates for your own test projects.

---

## Parallel Execution with ThreadLocal Driver

When running tests in parallel (e.g., with TestNG's `parallel="methods"` or `parallel="classes"`), each thread needs its own `SHAFT.GUI.WebDriver` instance. `ThreadLocal` guarantees complete thread isolation.

```java title="src/test/java/tests/ParallelThreadLocalTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

@Test(threadPoolSize = 3, invocationCount = 1)
public class ParallelThreadLocalTest {
    private final ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    private SHAFT.TestData.JSON testData;

    @Test
    public void signOutTest() {
        new HomePage(driver.get())
            .signOut()
            .verifyUserIsSignedOut(testData.getTestData("signOutText"));
    }

    @Test
    public void buttonClickTest() {
        new HomePage(driver.get())
            .clickMe()
            .verifyButtonIsClicked(testData.getTestData("buttonClickedText"));
    }

    @BeforeClass
    public void beforeClassSetup() {
        testData = new SHAFT.TestData.JSON("TestData.json");
    }

    @BeforeMethod
    public void beforeMethodSetUp() {
        driver.set(new SHAFT.GUI.WebDriver());
        driver.get().browser().navigateToURL(SHAFT.Properties.paths.testData() + "loginPage.html");
        new LoginPage(driver.get())
            .login(
                testData.getTestData("email"),
                testData.getTestData("password")
            );
        new HomePage(driver.get())
            .verifyUserIsOnHomePage(testData.getTestData("welcomeMessageText"));
    }

    @AfterMethod
    public void afterMethodTearDown() {
        driver.get().quit();
    }
}
```

:::info
Visit this repository for a complete demo on parallel execution with SHAFT Engine:
### [ParallelExecution_Demo](https://github.com/MustafaAgamy/ShaftEngine-ParellelWithThreadLocal.git)
:::

---

## Page Object Model Pattern

SHAFT integrates cleanly with the Page Object Model (POM). Each page class receives the driver instance via its constructor so tests remain driver-agnostic.

```java title="src/test/java/pages/LoginPage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class LoginPage {
    private final SHAFT.GUI.WebDriver driver;

    private final By emailField    = By.id("email");
    private final By passwordField = By.id("password");
    private final By loginButton   = By.id("loginBtn");

    public LoginPage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public HomePage login(String email, String password) {
        driver.element()
              .type(emailField, email)
              .type(passwordField, password)
              .click(loginButton);
        return new HomePage(driver);
    }
}
```

```java title="src/test/java/pages/HomePage.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class HomePage {
    private final SHAFT.GUI.WebDriver driver;

    private final By welcomeBanner = By.id("welcomeBanner");
    private final By signOutButton = By.id("signOutBtn");
    private final By clickMeButton = By.id("clickMeBtn");

    public HomePage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }

    public HomePage verifyUserIsOnHomePage(String expectedText) {
        driver.assertThat(welcomeBanner).text().contains(expectedText).perform();
        return this;
    }

    public LoginPage signOut() {
        driver.element().click(signOutButton);
        return new LoginPage(driver);
    }

    public HomePage clickMe() {
        driver.element().click(clickMeButton);
        return this;
    }

    public HomePage verifyButtonIsClicked(String expectedText) {
        driver.assertThat(By.id("clickResult")).text().isEqualTo(expectedText).perform();
        return this;
    }

    public void verifyUserIsSignedOut(String expectedText) {
        driver.assertThat(By.id("signOutMessage")).text().contains(expectedText).perform();
    }
}
```

```java title="src/test/java/tests/LoginTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class LoginTest {
    private SHAFT.GUI.WebDriver driver;
    private SHAFT.TestData.JSON testData;

    @Test
    public void successfulLoginTest() {
        new LoginPage(driver)
            .login(testData.getTestData("email"), testData.getTestData("password"))
            .verifyUserIsOnHomePage(testData.getTestData("welcomeMessageText"));
    }

    @BeforeMethod
    public void setup() {
        testData = new SHAFT.TestData.JSON("TestData.json");
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL(SHAFT.Properties.paths.testData() + "loginPage.html");
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```
