---
id: Touch_Actions
title: Touch Actions
sidebar_label: Touch
description: "Automate mobile touch interactions — tap, swipe, pinch to zoom, long press, and app background management using SHAFT Engine."
keywords: [SHAFT, touch actions, mobile automation, tap, swipe, pinch zoom, Appium, mobile testing]
tags: [mobile, touch, actions, appium]
---

SHAFT provides touch action methods for mobile app automation. Access them through `driver.touch()`.

For trust-gated natural-language touch workflows such as
`driver.act("tap Continue")`, see
[Natural Language Actions](./Natural_Language_Actions).

## Tap Actions

### tap()

Taps an element once on a touch-enabled screen.

```java title="TapExample.java"
By loginButton = By.id("login_btn");
driver.touch().tap(loginButton);
```

Reference-image taps use `shaft-visual` to find the image in the current
viewport, then execute a Selenium/Appium pointer action at the matched center:

```java title="ImageTapExample.java"
driver.touch().tap("src/test/resources/dynamicObjectRepository/login-button.png");
```

### type()

Taps a field found by reference image, then types into the focused field.

```java title="ImageTypeExample.java"
driver.touch().type("src/test/resources/dynamicObjectRepository/search-field.png", "SHAFT Engine");
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

Image-path overloads scroll until the reference image is visible in the
viewport. Selenium sessions use headless-safe page or element scrolling; Appium
native sessions use Appium scroll gestures.

```java title="ImageSwipeIntoViewExample.java"
driver.touch().swipeElementIntoView(
        "src/test/resources/dynamicObjectRepository/pay-now.png",
        TouchActions.SwipeDirection.DOWN);
```

### swipeToEndOfView()

Swipes until the current Appium view can no longer scroll in the requested direction.

```java title="SwipeToEndExample.java"
driver.touch().swipeToEndOfView(TouchActions.SwipeDirection.DOWN);
```

You can also limit the gesture to a scrollable container:

```java title="SwipeContainerToEndExample.java"
By scrollableContainer = By.id("list_view");
driver.touch().swipeToEndOfView(scrollableContainer, TouchActions.SwipeDirection.UP);
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

Image-path touch actions support cropped reference screenshots captured at a
different DPI or display scale than the current app screenshot when
`shaft-visual` is on the runtime classpath.

### waitUntilElementIsVisible()

Waits until a specific element is visible on the screen using image-based detection.

```java title="WaitForVisualElement.java"
driver.touch().waitUntilElementIsVisible("path/to/reference-screenshot.png");
```

### waitUntilElementIsNotVisible()

Waits until a reference image is no longer visible on the screen.

```java title="WaitForVisualElementToDisappear.java"
driver.touch().waitUntilElementIsNotVisible("path/to/reference-screenshot.png");
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

## Related

- [Browser Actions](/docs/reference/actions/GUI/Browser_Actions)
- [Element Actions](/docs/reference/actions/GUI/Element_Actions)
- [Element Identification](/docs/reference/actions/GUI/Element_Identification)
- [Web](/docs/testing/web)
