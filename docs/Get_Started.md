---
id: Get_Started
title: Get Started
sidebar_label: Usage
---

## Web Driver
In order to interact with web pages you will need an instance of [WebDriver]
````java
	WebDriver driver = DriverFactory.getDriver();
````
Upon Executing this line [DriverFactory] will detect your desired configuration from the [properties files], if you have not set those don't worry, SHAFT has a set of
 [default configurations] that will be used and you can always [edit configurations] .<br/>
Execution environment is defaulted to Local i.e tests will be run on your own machine, so SHAFT will auto-detect your operating system and the version of the default browser , searches for the appropriate WebDriver version on your machine and download it if it can't be found,and finally run it which is openning a new browser window.
## Browser Actions 
The [BrowserActions] class handles browser actions like navigation and window controls
### Navigation

#### Navigate To URL
   ````java
 BrowserActions.navigateToURL(driver,"https://www.google.com/");
````
- Navigates to the specified URL if it's different from the current URL, else refreshes the current page.
- To confirm successful navigation to target URL you can add a string parameter containing text that should exist in the URL after navigation like this:

````java
 BrowserActions.navigateToURL(driver,"https://www.google.com/","google");
````

#### Navigate Back
   ````java
 BrowserActions.navigateBack(driver);
````
Navigates one step back from the browsers history
#### Navigate Forward
   ````java
 BrowserActions.navigateForward(driver);
````
Navigates one step forward from the browsers history
#### Refresh page
   ````java
 BrowserActions.refreshCurrentPage(driver);
````
Refresh the current page.
#### Get Current Url
   ````java
 BrowserActions.getCurrentURL(driver);
````
Returns the URL of the current page  as a string
### Browser Windows' Manipulation

#### Full Screen Window
 ````java
 BrowserActions.fullScreenWindow(driver);
````
Resizes the current window to become full screen
#### Close Current Window
 ````java
 BrowserActions.closeCurrentWindow​(driver);
````
Closes the current browser window
#### Get Window Title
 ````java
 BrowserActions.getCurrentWindowTitle(driver);
````
Returnss the current window title as a string
#### Maximize Window
 ````java
 BrowserActions.maximizeWindow(driver);
````
Maximizes current window size based on screen size minus 5%
#### Resize Window
 ````java
 int width = 1440; // specify wanted window width
 int height =900; // specify wanted window height
 BrowserActions.setWindowSize​(driver,width,height);
 
````
Resizes the current window size based on the provided width and height
#### Switching Windows
 ````java
 String windowHandle = BrowserActions.getWindowHandle​(driver); //store the current window handle
 /*
 some code that opens a new window
 */
 
 driver.switchTo().window(windowHandle); // switch back to the original window
 
````
The method getWindowHandle​() returns a String containing the window handle, which is a unique identifier to that window


[WebDriver]:<todo>
[default configurations]:<todo>
 [properties files]:<todo>
  [edit configurations]:<todo>
  [DriverFactory]:<todo>
  [BrowserActions]:<https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/browser/BrowserActions.html>