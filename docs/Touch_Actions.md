---
id: Touch_Actions
title: Touch Actions
sidebar_label: Touch Actions
---

#### We can interact with Touch Actions via the following methods: 

### performElementAction():
* We use this method to call the Element Actions within the current Touch Actions instance. For example in the following code sample we need to tap on a text box to type a string. So we call the element action that we want to perform to make a touchMethod(), which is tap(elemtent locator), then perform this action to make another touchMethod(), which is type(locator, String ""). 
* This method returns a WebDriverElementActions object.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).touchMethod(element locator).performElementAction().touchMethod(element, String "");
    }
}
```
### nativeKeyboardKeyPress():
* We use this method to send a keypress via the device soft keyboard. For example, in the following code sample, we have to determine where we want to open the soft keyboard, then press the keys that we want. 
* Needed parameters: key - the key that should be pressed.
* This method returns a self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).touchMethod(element locator).nativeKeyboardKeyPress(KeyboardKeys key);
    }
}
```

### hideNativeKeyboard():
* We use this method to hide the device native soft keyboard. 
* This method returns a self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).hideNativeKeyboard();
    }
}
```
### waitUntilElementIsVisible():
* We use this method to wait until a specific element is now visible on the current screen.
* Needed parameters: elementReferenceScreenshot - relative path to the reference image from the local object repository.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).waitUntilElementIsVisible(String elementReferenceScreenshot);
    }
}
```
### pinchToZoom():
* We use this method to  to zoom the current screen IN/ OUT in case of zoom enabled screen.
* Needed parameters: zoomDirection - ZoomDirection.IN or OUT.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).pinchToZoom(ZoomDirection zoomDirection);
    }
}
```
### activateAppFromBackground():
* We use this method to activate an app that has been previously deactivated or sent to the background.
* Needed parameters: appPackageName - the full name for the app package that you want to activate. for example [com.apple.Preferences] or [io.appium.android.apis]
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).activateAppFromBackground(String appPackageName);
    }
}
```

## tap methods:
### tap():
* We use this method to tap an element once on a touch-enabled screen. 
* Needed parameters: elementLocator - the locator of the webElement under test (By xpath, id, selector, name ...etc).
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).tap(element locator);
    }
}
```

### tap():
* We use this method to tap an element once on a touch-enabled screen. 
* Needed parameters: elementReferenceScreenshot - relative path to the reference image from the local object repository.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).tap(String elementReferenceScreenshot);
    }
}
```

### doubleTap():
* We use this method to double-taps an element on a touch-enabled screen. 
* Needed parameters: elementLocator - the locator of the webElement under test (By xpath, id, selector, name ...etc).
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).doubleTap(element locator);
    }
}
```

### longTap():
* We use this method to perform a long-tap on an element to trigger the context menu on a touch-enabled screen. 
* Needed parameters: elementLocator - the locator of the webElement under test (By xpath, id, selector, name ...etc).
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).longTap(element locator);
    }
}
```

## swipe methods: 
### 1. swipeToElement():
* We use this method to swipe the sourceElement onto the destinationElement on a touch-enabled screen.
* Needed parameters: 
    1. sourceElementLocator - the locator of the webElement that needs to be swiped (By xpath, id, selector, name ...etc).
    2. destinationElementLocator - the locator of the webElement that you'll drop the sourceElement on (By xpath, id, selector, name ...etc).
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeToElement(element sourceElementLocator, element destinationElementLocator);
    }
}
```

### 2. swipeByOffset():
* We use this method to swipe an element with the desired x and y offset. Swiping direction is determined by the positive/negative nature of the offset. Swiping destination is determined by the value of the offset.
* Needed parameters: elementLocator - the locator of the webElement under test (By xpath, id, selector, name ...etc).
    1. xOffset - the horizontal offset by which the element should be swiped. positive value is "right" and negative value is "left".
    2. yOffset - the vertical offset by which the element should be swiped. positive value is "down" and negative value is "up".
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeByOffset(element locator, int xoffset, element destinationElementLocatorint yoffset);
    }
}
```

### 3. swipeElementIntoView():
* We use this method to scroll the element into the view in case of native mobile elements.
* Needed parameters: 
    1. targetElementLocator - the locator of the webElement under test (By xpath, id, selector, name ...etc) .
    2. swipeDirection - SwipeDirection.DOWN, UP, RIGHT, or LEFT.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeElementIntoView(element locator targetElementLocator, SwipeDirection swipeDirection);
    }
}
```
### 4. swipeElementIntoView():
* We use this method to scroll element into the view using the new W3C compliant actions for android and ios and AI for image identification.
* Needed parameters: 
    1. elementReferenceScreenshot - relative path to the reference image from the local object repository. 
    2. swipeDirection - SwipeDirection.DOWN, UP, RIGHT, or LEFT.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeElementIntoView(String elementReferenceScreenshot, SwipeDirection swipeDirection);
    }
}
```
### 5. swipeElementIntoView():
* We use this method to scroll element into the view using the new W3C compliant actions for android and ios and AI for image identification.
* Needed parameters: 
    1. scrollableElementLocator - the locator of the container/view/scrollable webElement that the scroll action will be performed inside.
    2. elementReferenceScreenshot - relative path to the reference image from the local object repository. 
    3. swipeDirection - SwipeDirection.DOWN, UP, RIGHT, or LEFT.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeElementIntoView(element scrollableElementLocator, String elementReferenceScreenshot, SwipeDirection swipeDirection);
    }
}
```

### 6. swipeElementIntoView():
* We use this method to scroll element into view using the new W3C compliant actions for android and ios.
* Needed parameters: 
    1. scrollableElementLocator - the locator of the container/view/scrollable webElement that the scroll action will be performed inside.
    2. targetElementLocator - the locator of the webElement that you want to scroll to under test (By xpath, id, selector, name ...etc). 
    3. swipeDirection - SwipeDirection.DOWN, UP, RIGHT, or LEFT.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
         new TouchActions(driver).swipeElementIntoView(element scrollableElementLocator, element targetElementLocator, SwipeDirection swipeDirection);
    }
}
```

## sendAppToBackground methods:
### 1. sendAppToBackground():
* We use this method to send the currently active app to the background, and return after a certain number of seconds. 
* Needed parameters: secondsToSpendInTheBackground - number of seconds before returning to the app.
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).sendAppToBackground(int secondsToSpendInTheBackground);
    }
}
```

### 2. sendAppToBackground():
* We use this method to send the currently active app to the background and leave the app deactivated. 
* This method returns a  self-reference to be used to chain actions.

```java
import com.shaft.gui.element.TouchActions;
public class Testing {
    @Test
    public void touchActions(){
        new TouchActions(driver).sendAppToBackground();
    }
}
```