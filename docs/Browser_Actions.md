---
id: Browser_Actions
title: Browser Actions
sidebar_label: Browser Actions
---

## Web Driver
- In order to interact with web pages you will need an instance of [WebDriver]
````java
 import org.openqa.selenium.WebDriver;

	WebDriver driver = DriverFactory.getDriver();
````
Upon Executing this line [DriverFactory] will detect your desired configuration from the [properties files], if you have not set those don't worry, SHAFT has a set of
 [default configurations] that will be used and you can always [edit configurations] .<br/>
Execution environment is defaulted to Local i.e tests will be run on your own machine, so SHAFT will use [webdrivermanager] to auto-detect your operating system and the version of the default browser , searches for the appropriate WebDriver version on your machine and download it if it can't be found,and finally run it which is openning a new browser window.
- in order to close all running driver instances use
````java
	DriverFactory.closeAllDrivers();
````
## Browser Actions 
The [BrowserActions] class handles browser actions like navigation and window controls
## Navigation

### Navigate To URL
   ````java
 BrowserActions.navigateToURL(driver,"https://www.google.com/");
````
- Navigates to the specified URL if it's different from the current URL, else refreshes the current page.
- To confirm successful navigation to target URL you can add a string parameter containing text that should exist in the URL after navigation like this:

````java
 BrowserActions.navigateToURL(driver,"https://www.google.com/","google");
````

### Navigate Back
   ````java
 BrowserActions.navigateBack(driver);
````
Navigates one step back from the browsers history
### Navigate Forward
   ````java
 BrowserActions.navigateForward(driver);
````
Navigates one step forward from the browsers history
### Refresh page
   ````java
 BrowserActions.refreshCurrentPage(driver);
````
Refresh the current page.
### Get Current Url
   ````java
 BrowserActions.getCurrentURL(driver);
````
Returns the URL of the current page  as a string
## Browser Windows' Manipulation

### Full Screen Window
 ````java
 BrowserActions.fullScreenWindow(driver);
````
Resizes the current window to become full screen
### Close Current Window
 ````java
 BrowserActions.closeCurrentWindow​(driver);
````
Closes the current browser window
### Get Window Title
 ````java
 BrowserActions.getCurrentWindowTitle(driver);
````
Returnss the current window title as a string
### Maximize Window
 ````java
 BrowserActions.maximizeWindow(driver);
````
Maximizes current window size based on screen size minus 5%
### Resize Window
 ````java
 int width = 1440; // specify wanted window width
 int height =900; // specify wanted window height
 BrowserActions.setWindowSize​(driver,width,height);
 
````
Resizes the current window size based on the provided width and height
### Get Window Size
 ````java
 String windowSize = BrowserActions.getWindowSize(driver);
````
Returnss the current window size as a string
### Switching Windows or tabs
 ````java
 String windowHandle = BrowserActions.getWindowHandle​(driver); //store the current window handle
 /*
 some code that opens a new window
 */
 
 driver.switchTo().window(windowHandle); // switch back to the original window
 
````
The method getWindowHandle​() returns a String containing the window handle, which is a unique identifier to that window and is used to move between tabs and windows
### Get Page Source​
 ````java
 String pageSource = BrowserActions.getPageSource(driver);
````
Gets the current page source and returns it as a string
## Browser Actions Sample Code Snippet
 ````java
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

import com.shaft.driver.DriverFactory;
import com.shaft.gui.browser.BrowserActions;

public class ShaftDemo {

	int width = 515; 
	int height =500; 
	
	@Test
	public void browserActions_Demo() {
		WebDriver driver = DriverFactory.getDriver();
		BrowserActions.navigateToURL(driver,"https://www.google.com/","google");
		System.out.println(BrowserActions.getCurrentURL(driver));
		BrowserActions.navigateToURL(driver,"https://www.youtube.com/");
		System.out.println(BrowserActions.getCurrentWindowTitle(driver));
		BrowserActions.navigateBack(driver);
		BrowserActions.navigateForward(driver);
		BrowserActions.setWindowSize(driver, width, height);
		System.out.println(BrowserActions.getWindowSize(driver));
	    DriverFactory.closeAllDrivers();
	
	}
}
````
As you skim through the console output you will notice the awesome reporting SHAFT provides for each performed action, and it gets even better, please see the [reporting] section for more on that.


[WebDriver]:<https://www.selenium.dev/documentation/en/webdriver/>
[default configurations]:<#>
[properties files]:<#>
[edit configurations]:<#>
[DriverFactory]:<#>
[reporting]:<#>
[webdrivermanager]:<https://github.com/bonigarcia/webdrivermanager>
[BrowserActions]:<https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/browser/BrowserActions.html>
[ElementActions]:<https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/element/ElementActions.html>
[By methods]:<https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/By.html>
[Reporting]:<#>
[verification]:<#>
[getCSSProperty​]:<#get-the-value-of-a-css-property>