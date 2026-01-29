---
id: first_steps_3
title: SHAFT vs. Native Selenium
sidebar_label: 3. SHAFT vs Native
---
We all know that **["Selenium Vs ... " blog posts are mainly click-bait]** per this insightful article from the Selenium user guide.
<br/>Our objective here is not to make claims or comparisons, it is rather to analyze the differences and commonalities between the two.
<br/>To do that, let's examine some code sample and share our observations as we go along ...

### Selenium WebDriver Native Code
- Below is a realistic WebDriver code block demonstrating a simple search test:
```java showLineNumbers title="SeleniumNativeTest.java"
    WebDriver driver;

    @Test
    public void searchTest(){
        driver.navigate().to("https://duckduckgo.com/");
        driver.findElement(By.name("q")).clear();
        driver.findElement(By.name("q")).sendKeys("SHAFT Engine Test Automation");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        
        Wait<WebDriver> wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(d -> d.findElement(By.id("links")).isDisplayed());
        
        String pageTitle = driver.getTitle();
        Assert.assertTrue(pageTitle.contains("SHAFT Engine"));
    }

    @BeforeMethod
    void beforeMethod(){
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @AfterMethod
    void afterMethod(){
        driver.quit();
    }
  ```
#### Description / Observations:
- line [1] is for driver instance declaration. This is the object that we will use for the rest of our test.
- lines [19-21] is for Chrome driver initialization and window setup. This is where Selenium will download the browser/driver based on the provided configuration (the latest by default).
:::warning[**Browser type is hard-coded**]
For that we would need to write boilerplate code to manage different browser types, execution location (local, remote), and other settings related to driver initialization.
:::
- lines [5-8] is where we perform our actions: navigate to a search engine, enter a search query, and click the search button.
:::warning[**Batteries Required but not included**]
This is a pain point that the Selenium WebDriver team are aware of and working to mitigate with their *Batteries Included* initiative. Previously we needed to import WebDriverManager to download driver binaries, and now we don't, but we still do need to import extra libraries for assertions, dealing with test data, logging, reporting, and many more. Making boilerplate code a requirement for an effective and efficient test automation solution.
:::
:::warning[**Explicit waits are required**]
If we do not implement an explicit wait (lines [10-11]), the test will fail because Selenium won't wait for the search results to load after clicking. This is the default and documented behavior of Selenium WebDriver's click action.
:::
:::warning[**Repetitive element location**]
Notice how we need to locate the search box element twice (lines [6-7]) - once to clear it and once to type in it. Each action requires finding the element again with no fluent API.
:::
- line [25] is for Chrome driver termination

### SHAFT Code

```java showLineNumbers title="ShaftTest.java"
    SHAFT.GUI.WebDriver driver;

    @Test
    public void searchTest(){
        driver.browser().navigateToURL("https://duckduckgo.com/")
                .and().element().type(By.name("q"), "SHAFT Engine Test Automation")
                .and().element().click(By.cssSelector("button[type='submit']"))
                .and().assertThat(By.id("links")).exists().perform()
                .and().assertThat().browser().title().contains("SHAFT Engine").perform();
    }

    @BeforeMethod
    void beforeMethod(){
        driver = new SHAFT.GUI.WebDriver();
    }

    @AfterMethod
    void afterMethod(){
        driver.quit();
    }
  ```
#### Description / Observations
- line [1] is for SHAFT's GUI WebDriver instance declaration. This is the object that we will use for the rest of our test.
:::tip[**Batteries included**]
There are many drivers within SHAFT that you can use to automate Web, Mobile, API, Database, and CLI actions.
:::
- line [14] is for Chrome driver initialization. This is where SHAFT will use Selenium Manager (or WebDriverManager when needed) to download the browser/driver/docker container based on the provided properties.
:::tip[**Dynamic Properties**]
Browser Type is not hard-coded, there is no boilerplate code required, and you can configure it by referencing our [Property Types](../Properties/PropertyTypes) and [Properties List](../Properties/PropertiesList).
:::
- lines [6-9] is where we perform our actions: navigate to a search engine, enter a search query, click the search button, and validate the results appear and the page title is correct.
:::tip[**No Boilerplate code**]
We do not need to configure an explicit wait as SHAFT will wait automatically for any actions to complete loading. This is all configurable via our [Properties List](../Properties/PropertiesList) to ensure that there is no *Magic* in your code.
:::
:::tip[**Fluent API & Chaining**]
You only need to type `driver.` once at the start of your code block. Then you can easily chain [Browser Actions](../Keywords/GUI/Browser_Actions), [Element Actions](../Keywords/GUI/Element_Actions), and [Validations](../Keywords/GUI/Element_Validations) using `.and()`. Notice how we type once and never need to locate the same element twice!
:::
- line [19] is for SHAFT driver termination.
:::tip[**Intuitive & Familiar**]
In most cases, just typing `driver.` will be enough for anyone to find the action they want to perform, and in the off chance it's not, everything is documented, and our user guide is searchable to make finding what you need all the more simple.
:::

["Selenium Vs ... " blog posts are mainly click-bait]: <https://www.selenium.dev/blog/2024/selenium-vs-blog-posts/>
---

[← Previous: SHAFT & Selenium](./first_steps_2) | [Next: Prerequisites →](./first_steps_4)
