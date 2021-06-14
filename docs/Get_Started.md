---
id: Get_Started
title: Get Started
sidebar_label: Get Started
---

## Web Driver
In order to interact with web pages you will need an instance of WebDriver
    
    WebDriver driver = DriverFactory.getDriver();
when this line gets executed [DriverFactory] will detect your desired configuration from the [properties files], if you have not set those don't worry, SHAFT has a set of
 [default configurations] that will be used and you can always [edit configurations] .<br/>
Execution environment is defaulted to Local i.e tests will be run on your own machine, so SHAFT will auto-detect your operating system and the version of the default browser , searches for the appropriate WebDriver version and download it if it can't be found,and finally run it which is openning a new browser window.
## Browser Actions 
The [BrowserActions] class handles browser actions like navigation and window controls
#### navigateToURL
    BrowserActions.navigateToURL(driver,"https://www.google.com/");

    
[default configurations]:<todo>
 [properties files]:<todo>
  [edit configurations]:<todo>
  [DriverFactory]:<todo>
  [BrowserActions]:<https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/browser/BrowserActions.html>