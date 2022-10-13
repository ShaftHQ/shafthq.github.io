---
id: Browser_Actions
title: Browser Actions
sidebar_label: Browser Actions
---

## Web Driver

-   In order to interact with web pages you will need an instance of [WebDriver]

```java
driver = new SHAFT.GUI.WebDriver();
```

Upon Executing this line SHAFT ENGINE will detect your desired configuration from the [properties files], if you have not set those don't worry, SHAFT has a set of
[default configurations] that will be used and you can always [edit configurations] .<br/>
Execution environment is defaulted to Local i.e tests will be run on your own machine, so SHAFT will use [webdrivermanager] to auto-detect your operating system and the version of the default browser , searches for the appropriate WebDriver version on your machine and download it if it can't be found,and finally run it which is openning a new browser window.

-   in order to close all running driver instances use

```java
driver.quit();
```

## Browser Actions

The [BrowserActions] class handles browser actions like navigation and window controls

## Navigation

### Navigate To URL

```java
driver.browser().navigateToURL("https://www.google.com");
```

-   Navigates to the specified URL if it's different from the current URL, else refreshes the current page.
-   To confirm successful navigation to target URL you can add a string parameter containing text that should exist in the URL after navigation like this:

```java
driver.browser().navigateToURL("https://www.google.com/","google");
```

### Navigate Back

```java
driver.browser().navigateBack();
```

Navigates one step back from the browsers history

### Navigate Forward

```java
driver.browser().navigateForward();
```

Navigates one step forward from the browsers history

### Refresh page

```java
driver.browser().refreshCurrentPage();
```

Refresh the current page.

### Get Current Url

```java
driver.browser().getCurrentURL();
```

Returns the URL of the current page as a string

## Browser Windows' Manipulation

### Full Screen Window

```java
driver.browser().fullScreenWindow();
```

Resizes the current window to become full screen

### Close Current Window

```java
driver.browser().closeCurrentWindow​();
```

Closes the current browser window

### Get Window Title

```java
driver.browser().getCurrentWindowTitle();
```

Returnss the current window title as a string

### Maximize Window

```java
driver.browser().maximizeWindow();
```

Maximizes current window size based on screen size minus 5%

### Resize Window

```java
int width = 1440; // specify wanted window width
int height =900; // specify wanted window height
driver.browser().setWindowSize​(width,height);
```

Resizes the current window size based on the provided width and height

### Get Window Size

```java
String windowSize = driver.browser().getWindowSize();
```

Returnss the current window size as a string

### Switching Windows or tabs

```java
String windowHandle = driver.browser().getWindowHandle​(); //store the current window handle
/*
some code that opens a new window
*/

driver.browser().switchToWindow(windowHandle); // switch back to the original window
```

The method getWindowHandle​() returns a String containing the window handle, which is a unique identifier to that window and is used to move between tabs and windows

### Get Page Source​

```java
String pageSource = driver.browser().getPageSource();
```

Gets the current page source and returns it as a string

As you skim through the console output you will notice the awesome reporting SHAFT provides for each performed action, and it gets even better, please see the [reporting] section for more on that.

[webdriver]: https://www.selenium.dev/documentation/en/webdriver/
[default configurations]: #
[properties files]: #
[edit configurations]: #
[driverfactory]: #
[reporting]: #
[webdrivermanager]: https://github.com/bonigarcia/webdrivermanager
[browseractions]: https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/browser/BrowserActions.html
[elementactions]: https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/com/shaft/gui/element/ElementActions.html
[by methods]: https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/By.html
[reporting]: #
[verification]: #
[getcssproperty​]: #get-the-value-of-a-css-property
