---
id: web
title: Demo Projects For Web GUI
sidebar_label: Web
---
### Parallel Execution using ThreadLocal Driver

```java title="ParallelThreadLocalSampleTest"
public class ParallelThreadLocalTest {
    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    private SHAFT.TestData.JSON testData;

    @Test
    public void signOutTest() {
        new HomePage(driver.get())
                .signOut();
    }

    @Test
    public void buttonClickTest() {
        new HomePage(driver.get())
                .clickMe();
    }

    @BeforeMethod
    public void beforeMethodSetUp() {
        driver.set(new SHAFT.GUI.WebDriver());
        driver.get().browser().navigateToURL("url");
    }

    @AfterMethod
    public void afterMethodTearDown() {
        driver.get().quit();
    }
}
```

:::info
You can visit this Repository to for a Demo on how to set Parallel Execution in SHAFT_ENGINE
### [ParallelExecution_Demo](https://github.com/MustafaAgamy/ShaftEngine-ParellelWithThreadLocal.git)
:::