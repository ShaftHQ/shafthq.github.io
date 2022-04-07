---
id: Features
title: Features
sidebar_label: Features
---

## What ? 
SHAFT ENGINE is an open-source Test Automation Engine that allows you to perform multiple actions to test a web application's functionality, behaviour and appearance
- Interact with a web application like a normal user would through the following browsers: <br/>
*Chrome, Safari, Firfox, Edge & Internet Explorer*
- Verify the application response, through a wide variety of [verification methods].
- Document the process and produce highly-detailed [reports].

## How ? 
- SHAFT comes prepacked with various industry-standard tools and frameworks that would otherwise need to be manually installed,configured and maintained, see [SHAFT components], along with our own components that were developed and maintained over the years since shaft came to light.
- All of those are abstracted away and preconfigured to provide the smoothest user experience, once you integrate SHAFT to your project it automatically detects your environment(ie: Operating System,browser version, etc...), sets up what is necessary,sets some defaults for you, and you are all set.
- later on you might need to change those defaults, you can always [edit configurations].

## Why ? 
- Simulate real life user and browser interactions with the application. 
- Portability of tests across platforms and browsers without the need to modify the script.
- Consistent test results, thanks to our [error handling techniques] ignoring environmental test blockers enabling the "write once run many" principle of test automation.
- Easily customizable reports that gives comprehensive insight into the testing process, and are readable by people from various backgrounds.
- Saves the configuration and conflict-resolution headache.

[browsers]: <#>
[reports]: <#>
[verification methods]: <#>
[SHAFT components]: <#>
[error handling techniques]: <#>
[edit configurations]: <#>

## Sample test case:
- Shaft is an easy engine to use, just with these following lines of code you can interacte easily with web browsers, APIs, CLIs, Database. For example, on GUI level we can follow these basic lines of code: 

```java
public class SampleTest {
    private WebDriver driver = DriverFactory.getDriver();

    @Test
    public void navigateToGoogleHomeAndAssertPageTitle() {
	BrowserActions.navigateToURL(driver, "https://www.google.com/ncr", "https://www.google.com");
    Validations.assertThat().browser(driver.get()).attribute("title").isEqualTo("Google").perform();
    }
}
``` 