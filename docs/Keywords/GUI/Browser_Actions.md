---
id: Browser_Actions
title: Browser Actions
sidebar_label: Browser
description: "Navigate pages, manage windows, handle cookies, capture screenshots, and control the browser using SHAFT Engine's BrowserActions API."
keywords: [SHAFT, browser actions, navigation, window management, cookies, screenshots, Selenium, web automation]
tags: [web, browser, actions, navigation]
---

## Getting Started

To interact with web pages, create an instance of `SHAFT.GUI.WebDriver`:

```java title="DriverSetup.java"
SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
```

SHAFT detects your configuration from [property files](../../Properties/PropertyTypes). If no properties are set, SHAFT uses sensible defaults: local execution, Chrome browser, and automatic driver management via Selenium Manager.

To close all running driver instances:

```java title="DriverTeardown.java"
driver.quit();
```

## Navigation

### Navigate to URL

```java title="NavigateToURL.java"
driver.browser().navigateToURL("https://www.google.com");
```

Navigates to the specified URL. If the URL matches the current page, it refreshes instead. You can optionally verify the target URL after navigation:

```java title="NavigateToURLWithVerification.java"
driver.browser().navigateToURL("https://www.google.com/", "google");
```

### Navigate to URL in a New Tab or Window

```java title="NavigateNewTab.java"
import org.openqa.selenium.WindowType;

driver.browser().navigateToURL("https://www.google.com", WindowType.TAB);
driver.browser().navigateToURL("https://www.google.com", WindowType.WINDOW);
```

### Navigate Back

```java title="NavigateBack.java"
driver.browser().navigateBack();
```

Navigates one step back in the browser history.

### Navigate Forward

```java title="NavigateForward.java"
driver.browser().navigateForward();
```

Navigates one step forward in the browser history.

### Refresh Page

```java title="RefreshPage.java"
driver.browser().refreshCurrentPage();
```

Refreshes the current page.

### Get Current URL

```java title="GetCurrentURL.java"
String currentUrl = driver.browser().getCurrentURL();
```

Returns the URL of the current page.

## Window Management

### Maximize Window

```java title="MaximizeWindow.java"
driver.browser().maximizeWindow();
```

Maximizes the current browser window.

### Full Screen Window

```java title="FullScreenWindow.java"
driver.browser().fullScreenWindow();
```

Sets the current window to full screen mode.

### Resize Window

```java title="ResizeWindow.java"
driver.browser().setWindowSize(1440, 900);
```

Resizes the current window to the specified width and height.

### Get Window Size

```java title="GetWindowSize.java"
String windowSize = driver.browser().getWindowSize();
```

Returns the current window size as a string.

### Get Window Title

```java title="GetWindowTitle.java"
String title = driver.browser().getCurrentWindowTitle();
```

Returns the current window title.

### Close Current Window

```java title="CloseWindow.java"
driver.browser().closeCurrentWindow();
```

Closes the current browser window.

### Switch Windows or Tabs

```java title="SwitchWindows.java"
String windowHandle = driver.browser().getWindowHandle();
// ... code that opens a new window ...
driver.browser().switchToWindow(windowHandle); // switch back to the original window
```

The `getWindowHandle()` method returns a unique identifier for the current window, which can be used to switch between tabs and windows.

### Get Page Source

```java title="GetPageSource.java"
String pageSource = driver.browser().getPageSource();
```

Returns the current page source as a string.

## Cookies

### Add Cookie

```java title="AddCookie.java"
driver.browser().addCookie("cookieName", "cookieValue");
```

### Get Cookie

```java title="GetCookie.java"
Cookie cookie = driver.browser().getCookie("cookieName");
```

### Get All Cookies

```java title="GetAllCookies.java"
Set<Cookie> cookies = driver.browser().getAllCookies();
```

### Get Cookie Value

```java title="GetCookieValue.java"
String cookieValue = driver.browser().getCookieValue("cookieName");
```

### Get Cookie Domain

```java title="GetCookieDomain.java"
String cookieDomain = driver.browser().getCookieDomain("cookieName");
```

### Get Cookie Path

```java title="GetCookiePath.java"
String cookiePath = driver.browser().getCookiePath("cookieName");
```

### Delete Cookie

```java title="DeleteCookie.java"
driver.browser().deleteCookie("cookieName");
```

### Delete All Cookies

```java title="DeleteAllCookies.java"
driver.browser().deleteAllCookies();
```

## Screenshots and Snapshots

### Capture Screenshot

```java title="CaptureScreenshot.java"
driver.browser().captureScreenshot();
```

Captures a screenshot and attaches it to the Allure report.

### Capture Page Snapshot

```java title="CaptureSnapshot.java"
driver.browser().captureSnapshot();
```

Captures a full page snapshot including the page source.

## Wait Actions

### Wait for Lazy Loading

```java title="WaitForLazyLoading.java"
driver.browser().waitForLazyLoading();
```

Waits for lazy-loaded content to finish loading on the page.

### Wait Until Title Is

```java title="WaitUntilTitle.java"
driver.browser().waitUntilTitleIs("Expected Title");
driver.browser().waitUntilTitleContains("Partial Title");
driver.browser().waitUntilTitleNotContains("Old Title");
```

### Wait Until URL Matches

```java title="WaitUntilURL.java"
driver.browser().waitUntilUrlToBe("https://example.com/dashboard");
driver.browser().waitUntilUrlContains("dashboard");
driver.browser().waitUntilUrlNotContains("login");
driver.browser().waitUntilUrlMatches(".*dashboard.*");
```

### Wait Until Number of Windows

```java title="WaitUntilWindows.java"
driver.browser().waitUntilNumberOfWindowsToBe(2);
```

## Network Interception

### Mock HTTP Requests

```java title="MockRequest.java"
import java.io.ByteArrayInputStream;
import org.openqa.selenium.remote.http.HttpRequest;
import org.openqa.selenium.remote.http.HttpResponse;

driver.browser().mock(
    request -> request.getUri().contains("/api/data"),
    new HttpResponse().setStatus(200).setContent(() -> new ByteArrayInputStream("{}".getBytes()))
);
```

Intercepts HTTP requests matching the predicate and returns the mocked response.

### Intercept HTTP Requests

```java title="InterceptRequest.java"
import java.io.ByteArrayInputStream;

driver.browser().intercept(
    request -> request.getUri().contains("/api/data"),
    new HttpResponse().setStatus(200).setContent(() -> new ByteArrayInputStream("{}".getBytes()))
);
```

## Mobile Context

### Get and Set Context

```java title="MobileContext.java"
String context = driver.browser().getContext();
driver.browser().setContext("WEBVIEW_1");
```

### Get Context Handles

```java title="ContextHandles.java"
List<String> contexts = driver.browser().getContextHandles();
```

## Fluent Chaining

All browser actions support fluent chaining with `.and()`:

```java title="FluentChaining.java"
driver.browser()
    .navigateToURL("https://www.google.com")
    .and().maximizeWindow()
    .and().captureScreenshot();
```

:::tip
SHAFT provides automatic reporting for every browser action. Check the **Reporting** section in the sidebar for details on the rich reports generated for each action.
:::
