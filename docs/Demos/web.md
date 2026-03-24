---
id: web
title: Web GUI Demo Projects
sidebar_label: Web
description: "Working demo projects for web GUI test automation with SHAFT Engine — parallel execution, ThreadLocal driver, and Page Object Model examples."
keywords: [SHAFT, web demo, parallel execution, ThreadLocal, Page Object Model, web automation example]
---
### Parallel Execution using ThreadLocal Driver

```java title="ParallelThreadLocalSampleTest"
public class ParallelThreadLocalTest {
    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    private SHAFT.TestData.JSON testData;

    @Test
    public void signOutTest() {
        new HomePage(driver.get())
                .signOut()
                .verifyUserIsSingedOut(testData.getTestData("signOutText"));
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
                .login(testData.getTestData("email"),
                        testData.getTestData("password"));
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