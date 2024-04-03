---
id: first_steps_3
title: SHAFT vs. Native
sidebar_label: SHAFT vs. Native
---
We all know that **["Selenium Vs ... " blog posts are mainly click-bait]** per this insightful article from the Selenium user guide.
<br/>Our objective here is not to make claims or comparisons, it is rather to analyze the differences and commonalities between the two.
<br/>To do that, let's examine some code sample and share our observations as we go along ...

### Selenium WebDriver Native Code
- Below is a realistic WebDriver code block to be later examined alongside its SHAFT counterpart:
```java showLineNumbers title="SeleniumNativeTest.java"
    WebDriver driver;

    @Test
    public void basicWebBrowserInteractions(){
        driver.navigate().to("https://github.com/shafthq/SHAFT_ENGINE");
        var handle1 = driver.getWindowHandle();
        driver.findElement(By.xpath("//h2/following-sibling::div//a[@title='https://shafthq.github.io/']")).click();
        var handles = driver.getWindowHandles();
        handles.remove(handle1);
        var handle2 = handles.stream().toList().getLast();
        driver.switchTo().window(handle2);
        driver.findElement(By.xpath("(//a[contains(text(),'Upgrade Now')])[last()]")).click();
        Wait<WebDriver> wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(d -> driver.getCurrentUrl().contains("docs"));
        Assert.assertEquals(driver.findElement(By.tagName("h1")).getText(), "First Steps");
    }

    @BeforeMethod
    void beforeMethod(){
        driver = new ChromeDriver();
    }

    @AfterMethod
    void afterMethod(){
        driver.quit();
    }
  ```
#### Description / Observations:
- line [1] is for driver instance declaration. This is the object that we will use for the rest of our test.
- line [20] is for chrome driver initialization. This is where selenium will go to download the browser/driver based on the provided configuration (the latest by default)
:::warning[**Browser type is hard-coded**]
For that we would need to write a boilerplate code to manage the different browser types, execution location (local, remote), and other settings related to driver initialization.
:::
- lines [5] > [15] is where we perform our actions, we navigate to a link, click another link that opens in a new window, switch to the new window, click a button, and then validate the text value of an element on that page.
:::warning[**Batteries Required but not included**]
This is a pain point that the Selenium WebDriver team are aware of and working to mitigate with their *Batteries Included* initiative. Previously we needed to import WebDriverManager to download driver binaries, and now we don't, but we still do need to import extra libraries for assertions, dealing with test data, logging, reporting, and many more. Making boilerplate code a requirement for an effective and efficient test automation solution.
:::
:::warning[**Explicit waits are required**]
If we do not implement an explicit wait, the above test will fail because it simply will not wait for the navigation (triggered by the click) to conclude. This is the default and documented behavior of Selenium WebDriver's click action.
:::
:::warning[**One action per line**]
To do anything we need to start the line by typing `driver.` and each line ends after performing one element action with no fluent API implementation.
:::
- line [25] is for chrome driver termination

### SHAFT Code

```java showLineNumbers title="ShaftTest.java"
    SHAFT.GUI.WebDriver driver;

    public void basicWebBrowserInteractions(){
        var handle1 = driver.browser().navigateToURL("https://github.com/shafthq/SHAFT_ENGINE").getWindowHandle();
        var handles = driver.element().click(By.xpath("//h2/following-sibling::div//a[@title='https://shafthq.github.io/']")).and().browser().getWindowHandles();
        handles.remove(handle1);
        var handle2 = handles.getLast();
        driver.browser().switchToWindow(handle2)
                .and().element().click(SHAFT.GUI.Locator.hasTagName("a").containsText("Upgrade Now").isLast().build())
                .and().assertThat(By.tagName("h1")).text().isEqualTo("First Steps").perform();
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
- line [15] is for chrome driver initialization. This is where SHAFT will use Selenium Manager (or WebDriverManager when needed) to download the browser/driver/docker container based on the provided properties.
:::tip[**Dynamic Properties**]
Browser Type is not hard-coded, there is no boilerplate code required, and you can configure it with a look at our [Property Types](../Properties/PropertyTypes) and [Properties List](../Properties/PropertiesList).
:::
- lines [4] > [10] is where we perform our actions, we navigate to a link, click another link that opens in a new window, switch to the new window, click a button, and then validate the text value of an element on that page.
:::tip[**No Boilerplate code**]
We do not need to configure an explicit wait as SHAFT will wait automatically for any actions to continue loading. This is all configurable via our [Properties List](../Properties/PropertiesList) to ensure that there is no *Magic* in your code.
:::
:::tip[**Fluent API**]
You only need to type `driver.` once at the start of your code block, and you can easily chain [Browser Actions](../Keywords/GUI/Browser_Actions), [Element Actions](../Keywords/GUI/Element_Actions), and [Validations](../Keywords/GUI/Element_Validations).
:::
- line [20] is for shaft driver termination
:::tip[**Intuitive & Familiar**]
In most cases just typing `driver.` will be enough for anyone to find the action they want to perform, and in the off chance it's not everything is documented, and our user guide is searchable to make finding what you need all the more simple.
:::

["Selenium Vs ... " blog posts are mainly click-bait]: <https://www.selenium.dev/blog/2024/selenium-vs-blog-posts/>