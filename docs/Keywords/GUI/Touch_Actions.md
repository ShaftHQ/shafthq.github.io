---
id: Touch_Actions
title: Touch Actions
sidebar_label: Touch
description: "Automate mobile touch interactions — tap, swipe, pinch to zoom, long press, and app background management using SHAFT Engine."
keywords: [SHAFT, touch actions, mobile automation, tap, swipe, pinch zoom, Appium, mobile testing]
---

SHAFT provides touch action methods for mobile app automation. Access them through `driver.touch()`.

## Tap Actions

### tap()

Taps an element once on a touch-enabled screen.

```java title="TapExample.java"
By loginButton = By.id("login_btn");
driver.touch().tap(loginButton);
```

### doubleTap()

Double-taps an element on a touch-enabled screen.

```java title="DoubleTapExample.java"
By imageElement = By.id("photo");
driver.touch().doubleTap(imageElement);
```

### longTap()

Performs a long press on an element to trigger the context menu.

```java title="LongTapExample.java"
By listItem = By.id("item_1");
driver.touch().longTap(listItem);
```

## Swipe Actions

### swipeToElement()

Swipes from a source element to a destination element.

```java title="SwipeToElementExample.java"
By sourceElement = By.id("card_1");
By destinationElement = By.id("drop_zone");
driver.touch().swipeToElement(sourceElement, destinationElement);
```

### swipeByOffset()

Swipes an element by a specified horizontal and vertical offset. Positive x-offset swipes right, negative swipes left. Positive y-offset swipes down, negative swipes up.

```java title="SwipeByOffsetExample.java"
By element = By.id("slider");
driver.touch().swipeByOffset(element, 200, 0); // swipe right by 200px
```

### swipeElementIntoView()

Scrolls until the target element is visible. Useful for finding elements in long scrollable lists.

```java title="SwipeIntoViewExample.java"
By targetElement = By.id("item_at_bottom");
driver.touch().swipeElementIntoView(targetElement, TouchActions.SwipeDirection.DOWN);
```

You can also specify a scrollable container:

```java title="SwipeIntoViewContainerExample.java"
By scrollableContainer = By.id("list_view");
By targetElement = By.id("item_50");
driver.touch().swipeElementIntoView(scrollableContainer, targetElement, TouchActions.SwipeDirection.DOWN);
```

## Keyboard Actions

### nativeKeyboardKeyPress()

Sends a key press via the device soft keyboard.

```java title="KeyPressExample.java"
driver.touch().nativeKeyboardKeyPress(TouchActions.KeyboardKeys.ENTER);
```

### hideNativeKeyboard()

Hides the device native soft keyboard.

```java title="HideKeyboardExample.java"
driver.touch().hideNativeKeyboard();
```

## Zoom Actions

### pinchToZoom()

Zooms the current screen in or out.

```java title="PinchToZoomExample.java"
driver.touch().pinchToZoom(TouchActions.ZoomDirection.IN);
driver.touch().pinchToZoom(TouchActions.ZoomDirection.OUT);
```

## App Management

### sendAppToBackground()

Sends the currently active app to the background.

```java title="BackgroundAppExample.java"
// Send to background and return after 5 seconds
driver.touch().sendAppToBackground(5);

// Send to background and leave deactivated
driver.touch().sendAppToBackground();
```

### activateAppFromBackground()

Activates an app that has been previously deactivated or sent to the background.

```java title="ActivateAppExample.java"
driver.touch().activateAppFromBackground("com.example.myapp");
```

## Visual Element Detection

### waitUntilElementIsVisible()

Waits until a specific element is visible on the screen using image-based detection.

```java title="WaitForVisualElement.java"
driver.touch().waitUntilElementIsVisible("path/to/reference-screenshot.png");
```

## Complete Example

```java title="MobileTouchActionsDemo.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class MobileTouchActionsDemo {
    private SHAFT.GUI.WebDriver driver;

    @BeforeMethod
    public void setup() {
        SHAFT.Properties.platform.set().targetPlatform("ANDROID");
        SHAFT.Properties.mobile.set().automationName("UiAutomator2");
        driver = new SHAFT.GUI.WebDriver();
    }

    @Test
    public void testTouchActions() {
        By usernameField = By.accessibilityId("username");
        By passwordField = By.accessibilityId("password");
        By loginButton = By.accessibilityId("login");

        driver.touch().tap(usernameField);
        driver.element().type(usernameField, "admin");
        driver.touch().tap(passwordField);
        driver.element().type(passwordField, "password");
        driver.touch().tap(loginButton);
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```
