---
id: Quick_Start
title: Quick Start Guide 🏃
sidebar_label: Quick Start Guide
---

## Start Here

-   Create a new Java/Maven project using Eclipse, IntelliJ[^1] or your favourite IDE.
-   Copy the highlighted contents of this [pom.xml](https://github.com/MohabMohie/using_SHAFT_ENGINE/blob/7bfc918b00dfd2bd674c349a07bcec3fa98913a6/pom.xml#L12-L79) file into yours inside the `<project>` tag.
-   Create the following file `src/test/resources/testDataFiles/simpleJSON.json`.
-   Copy the below code snippet into your newly created json file.

```json
{
    "searchQuery": "SHAFT_Engine"
}
```

-   Create a new Package under `src/test/java` and create a new Java Class under that package.
-   Copy the below code snippet into your newly created java class.

```java
public class Test_Wizard_GUI {
    SHAFT.GUI.WebDriver driver;
    SHAFT.TestData.JSON testData;

    By searchBox = By.name("q");
    By resultStats = By.id("result-stats");

    @Test
    public void test() {
        driver.browser().navigateToURL("https://www.google.com/");
        driver.verifyThat().browser().title().isEqualTo("Google").perform();
        driver.element().type(searchBox, testData.getTestData("searchQuery"))
                .keyPress(searchBox, Keys.ENTER);
        driver.assertThat().element(resultStats).text().doesNotEqual("")
                .withCustomReportMessage("Check that result stats is not empty").perform();
    }

    @BeforeClass
    public void beforeClass() {
        driver = new SHAFT.GUI.WebDriver();
        testData = new SHAFT.TestData.JSON("simpleJSON.json");
    }

    @AfterClass
    public void afterClass() {
        driver.quit();
    }
}
```

-   Run it as a TestNG Test Class.
-   The execution report will open automatically in your default web browser after the test run is completed.
-   You can change the target browser, operating system, timeouts, and other configurations using the ⚙️ [Configuration Manager](https://mohabmohie.github.io/SHAFT_ENGINE/).
