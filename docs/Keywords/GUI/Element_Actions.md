---
id: Element_Actions
title: Element Actions
sidebar_label: Element
description: "Interact with web elements using SHAFT Engine — click, type, drag and drop, select from dropdowns, handle iframes, and more."
keywords: [SHAFT, element actions, click, type, drag and drop, select, iframe, web automation, Selenium]
---

To interact with web elements, use `driver.element()` followed by the desired action. All element actions require a `By` locator to identify the target element.

## Typing

### type()

Clears the text field and types the specified text.

```java title="TypeExample.java"
By usernameField = By.id("username_textbox");
driver.element().type(usernameField, "john.doe");
```

### typeAppend()

Types text without clearing the field first — appends to existing content.

```java title="TypeAppendExample.java"
By textBox = By.id("username_textbox");
driver.element().type(textBox, "SHAFT");
driver.element().typeAppend(textBox, " Engine"); // field now contains "SHAFT Engine"
```

### typeSecure()

Types text in a secure manner — the value is masked in reports for sensitive data like passwords.

```java title="TypeSecureExample.java"
By passwordField = By.id("password_field");
driver.element().typeSecure(passwordField, "mySecretPassword");
```

### typeFileLocationForUpload()

Sets a file path for file upload input elements.

```java title="FileUploadExample.java"
By fileInput = By.xpath("//form//input[@type='file']");
driver.element().typeFileLocationForUpload(fileInput, "src/test/resources/testDataFiles/testUpload.txt");
```

### clear()

Clears text from a text field or text area.

```java title="ClearExample.java"
By textBox = By.id("username_textbox");
driver.element().clear(textBox);
```

## Clicking

### click()

Waits for the target element to be interactable, then clicks on it. Falls back to JavaScript click if the standard Selenium click fails.

```java title="ClickExample.java"
By signInButton = By.id("sign_in_btn");
driver.element().click(signInButton);
```

### clickAndHold()

Waits for the element to be clickable, then clicks and holds it.

```java title="ClickAndHoldExample.java"
driver.element().clickAndHold(elementLocator);
```

### clickUsingJavascript()

Clicks an element using JavaScript. Useful when the standard click fails due to element positioning or overlay issues.

```java title="ClickJsExample.java"
driver.element().clickUsingJavascript(elementLocator);
```

### doubleClick()

Performs a double click on the target element.

```java title="DoubleClickExample.java"
By doubleClickButton = By.className("double_click_btn");
driver.element().doubleClick(doubleClickButton);
```

## Hovering

### hover()

Hovers over the target element.

```java title="HoverExample.java"
By menuItem = By.tagName("span");
driver.element().hover(menuItem);
```

### hoverAndClick()

Hovers over an element to reveal a dropdown or menu, then clicks on a visible option.

```java title="HoverAndClickExample.java"
By hoverItem = By.linkText("Popular Toys");
By clickable = By.xpath("//a[contains(text(),'Video Games')]");
driver.element().hoverAndClick(hoverItem, clickable);
```

For multi-level hover menus, pass a list of locators to hover through before clicking:

```java title="MultiLevelHoverExample.java"
List<By> hoverLocators = new ArrayList<>();
hoverLocators.add(By.linkText("Popular Toys"));
hoverLocators.add(By.xpath("//a[contains(text(),'Video Games')]"));

By clickable = By.linkText("Car");
driver.element().hoverAndClick(hoverLocators, clickable);
```

## Scrolling

### scrollToElement()

Scrolls the page to bring the target element into view.

```java title="ScrollExample.java"
By footer = By.xpath("//a[@href='https://twitter.com/saucelabs']");
driver.element().scrollToElement(footer);
```

## Screenshots

### captureScreenshot()

Captures a screenshot of a specific element and attaches it to the report.

```java title="ElementScreenshotExample.java"
By element = By.id("chart");
driver.element().captureScreenshot(element);
```

## Drag and Drop

### Drag to Another Element

```java title="DragToElementExample.java"
By source = By.id("draggable");
By target = By.id("destination");
driver.element().dragAndDrop(source, target);
```

### Drag to a Position

```java title="DragToPositionExample.java"
By source = By.id("draggable");
driver.element().dragAndDrop(source, 500, 500);
```

### Drag by Offset

```java title="DragByOffsetExample.java"
By source = By.id("draggable");
driver.element().dragAndDropByOffset(source, 100, 50);
```

## Element Information

### getTagName()

Returns the HTML tag name of the target element.

```java title="GetTagNameExample.java"
String tagName = driver.element().getTagName(elementLocator);
```

### getAttribute()

Returns the value of a specific attribute.

```java title="GetAttributeExample.java"
By searchBox = By.cssSelector(".gLFyf.gsfi");
String nameAttr = driver.element().getAttribute(searchBox, "name");
```

### getCSSProperty()

Returns the value of a CSS property.

```java title="GetCssPropertyExample.java"
String width = driver.element().getCSSProperty(elementLocator, "width");
```

### getText()

Returns the visible text content of the target element.

```java title="GetTextExample.java"
String text = driver.element().getText(textElement);
```

### getSize()

Returns the size of the target element as a string.

```java title="GetSizeExample.java"
String elementSize = driver.element().getSize(elementLocator);
```

### getElementsCount()

Returns the number of elements matching a locator.

```java title="GetElementsCountExample.java"
int resultCount = driver.element().getElementsCount(By.cssSelector("h3.LC20lb"));
```

### isElementDisplayed()

Returns whether the element is currently displayed.

```java title="IsDisplayedExample.java"
boolean isVisible = driver.element().isElementDisplayed(elementLocator);
```

### isElementClickable()

Returns whether the element is clickable (visible and enabled).

```java title="IsClickableExample.java"
boolean isClickable = driver.element().isElementClickable(elementLocator);
```

## Dropdowns

### select()

Selects an option from a dropdown list by visible text.

```java title="SelectExample.java"
By dropdown = By.id("dropdown");
driver.element().select(dropdown, "Option 1");
```

### getSelectedText()

Returns the currently selected option text from a dropdown.

```java title="GetSelectedTextExample.java"
By dropdown = By.id("dropdown");
String selected = driver.element().getSelectedText(dropdown);
```

## IFrames

### switchToIframe()

Switches driver focus to an iframe.

```java title="SwitchToIframeExample.java"
By iframeLocator = By.id("ifr_id");
driver.element().switchToIframe(iframeLocator);
```

### switchToDefaultContent()

Switches driver focus back to the main page content.

```java title="SwitchToDefaultExample.java"
driver.element().switchToDefaultContent();
```

## Clipboard Actions

Performs clipboard operations on a text field. Supported actions: `"copy"`, `"paste"`, `"cut"`, `"select all"`, `"unselect"`.

```java title="ClipboardExample.java"
driver.element().clipboardActions(textFieldLocator, "select all");
driver.element().clipboardActions(textFieldLocator, "copy");
```

## JavaScript Actions

### setValueUsingJavaScript()

Sets the value of an element using JavaScript — useful when the standard `type()` method does not work.

```java title="SetValueJsExample.java"
By inputField = By.id("username");
driver.element().setValueUsingJavaScript(inputField, "myUsername");
```

### submitFormUsingJavaScript()

Submits a form programmatically using JavaScript.

```java title="SubmitFormJsExample.java"
By formElement = By.id("loginForm");
driver.element().submitFormUsingJavaScript(formElement);
```

## Wait Methods

SHAFT provides several wait methods to handle synchronization:

```java title="WaitMethodExamples.java"
// Wait until element text matches
driver.element().waitUntilElementTextToBe(locator, "Success");

// Wait until attribute contains value
driver.element().waitUntilAttributeContains(locator, "class", "complete");

// Wait until element is selected
driver.element().waitUntilElementToBeSelected(locator);

// Wait for specific number of elements
driver.element().waitUntilNumberOfElementsToBe(locator, 5);
driver.element().waitUntilNumberOfElementsToBeLessThan(locator, 10);
driver.element().waitUntilNumberOfElementsToBeMoreThan(locator, 0);

// Wait until all elements are present
driver.element().waitUntilPresenceOfAllElementsLocatedBy(locator);
```

## Table Data Extraction

Extracts table row data into a list of maps, where each map key is the column header.

```java title="TableDataExample.java"
List<Map<String, String>> tableData = driver.element().getTableRowsData(tableLocator);
```

:::note
This works with standard HTML tables that use `<thead>` with `<th>` elements for column headers and `<tbody>` with `<td>` elements for row data.
:::

## Fluent Chaining

All element actions support fluent chaining with `.and()`:

```java title="FluentChainingExample.java"
driver.element()
    .type(usernameField, "admin")
    .and().type(passwordField, "password")
    .and().click(loginButton);
```
