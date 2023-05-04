---
id: Element_Actions
title: Element Actions
sidebar_label: Element
---

### Type

```java

//a By object is used to store the locator to your element
private By elementLocator = By.id("username_textbox");
//click on target element
driver.element().type(elementLocator, "query");
```

### TypeAppend
this method used for typing without clearing the texbox first  
```java

//a By object is used to store the locator to your element
private By textBoxLocator = By.id("username_textbox");
// type to empty textbox
driver.element().type(textBoxLocator, "Shaft");
// continue typing without erasing what was typed in the same field 
driver.element().typeAppend(textBoxLocator , " engine");
```

### TypeSecure

```java

//a By object is used to store the locator to your element
private By elementLocator = By.id("username_textbox");
//click on target element
driver.element().typeSecure(elementLocator, "query");
```

### TypeFileLocationForUpload

```java
//locator of browse button or choose file button  
	 By chooseFileButtonLocator = By.xpath("//form//input[@type='file']");
//typeFileLocationForUplaod method takes element locator and file path 	 
	 driver.element().typeFileLocationForUpload(chooseFileButtonLocator, "src/test/resources/testDataFiles/testUpload.txt);
	 
 }

```


### Click on an Element

In order to interact with elements appearing on web page you'll first need to locate the element using one of WebDriver's locating strategies([By methods]) like ID, Class Name,
XPath, CSS Selectors, link Text, Partial link text, Name, or Tag name.

```java

//a By object is used to store the locator to your element
private By elementLocator = By.id("sign_in_btn");
//click on target element
driver.element().click(elementLocator);
```

The method click will wait for your target element to be interactable and then attempts to click on it using Selenium WebDriver, if that didn't work it will
attempt to click using JavaScript

### Click And Hold

```java
driver.element().clickAndHold(elementLocator);
```

Waits for the element to be clickable, and then clicks and holds it.

### Double Click​

```java

//store the locator to your element
By elementLocator = By.className("double_click_btn");
//Double click target element
driver.element().doubleClick(elementLocator);
```

### Hover

```java
import org.openqa.selenium.By;
//The locator to your element
By elementLocator = By.tagName("span");
//Hover over target element
driver.element().hover(elementLocator);
```

### Hover and click

-   Hover over an element to show hover menue then click on one of the displayed options

```java
By clickable = By.xpath("//a[contains(text(),'Video Games ') ] ");
By hoverItem = By.linkText("Popular Toys");

driver.element().hoverAndClick(hoverItem, clickable);
```

-   for multi-level hover menus You need to hover on the category, then hover on a subcategory, and so on until you finally click on the clickable item.

```java
public class HoverAndClickDemo {
	List<By> hoverLocators =new ArrayList<By>();
	By clickable = By.linkText("Car");

	@Test
	public void demo() {
		hoverLocators.add(By.linkText("Popular Toys"));
		hoverLocators.add(By.xpath("//a[contains(text(),'Video Games ') ] "));

  		driver = new SHAFT.GUI.WebDriver();
		driver.browser().navigateToURL("https://phppot.com/demo/multilevel-dropdown-menu-with-pure-css/");
		driver.element().hoverAndClick(hoverLocators, clickable);
	}
}
```

![hoverAndClick](https://live.staticflickr.com/65535/51627720576_1bd0cf9c6f_z.jpg) <br/>

### Scroll To Element 

```java
By elementLocator = By.xpath("//a[@href='https://twitter.com/saucelabs']);

driver.element().scrollToElement(elementLocator);
```

### Capture Screenshot

```java
By elementLocator = By.xpath("//a[@href='https://twitter.com/saucelabs']);

driver.element().captureScreenshot(elementLocator);
```

### Drag and drop

-   Drag an element into a target element

```java
By sourceElement = By.id("draggable");    // Locator to the element you want to drag
By targetElement = By.id("destination");  // Locator to the destination element

driver.element().dragAndDrop(sourceElement,targetElement);
```

-   Drag an element to a specified position

```java
By sourceElement = By.id("draggable");    // Locator to the element you want to drag
int xPos= 500;
int yPos= 500;

driver.element().dragAndDrop(sourceElement,xPos,yPos);
```

### Get Tag name

```java
String TagName = driver.element().getTagName(ElementLocator);
```

Retrieves tag name from the target element and returns it as a string value.

### Get the value of an element attribute

```java
//The locator to your element
By googleSearchBox = By.cssSelector(".gLFyf.gsfi");
//get the value of the 'name' attribute
String attributeValue = driver.element().getAttribute(googleSearchBox, "name");
```

Returns the value of the given attribute as a String,you will allso be able to see something like this
![report](https://live.staticflickr.com/65535/51492494310_076bca3fdc.jpg) <br/>
in the automatically generated Allure report, for more on that see [Reporting].

### Get the value of a CSS property

```java
String propertyValue = driver.element().getCSSProperty​(elementLocator, "width");
```

### Get context handle\s

<!---
Needs further auditing
-->

you need to get the context handle in order to be able to switch back to it

-   Return the handle for currently active context.

```java
String currentContext = driver.element().getContext();
```

-   Return a list of unique handles for all the currently open contexts.

```java
driver.element().getContextHandles();
```

### Switching focus to a different context

```java
driver.element().setContext(currentContext);
```

### Get window handle\s

you need to get the window handle in order to be able to switch back to it

-   Return the handle for currently active window.

```java
String currentWindow = driver.element().getWindowHandle();
```

-   Return a list of unique handles for all the currently open windows.

```java
driver.element().getWindowHandles();
```

### Switching focus to a different window

switch driver's focus to a different window using its name or handle

```java
driver.element().switchToWindow();
```

### Handling IFrames

In order to interact with elements within IFrames you neeed to first change driver's focus to the IFrame, once done you will need to switch back to the original content

-   Switching focus to an IFrame

```java
By iFrameLocator = By.id("ifr_id");
driver.element().switchToIframe(iFrameLocator );
```

-   switching back to default content

```java
driver.element().switchToDefaultContent();
```

### Insert text into a text field

-   clear text inside a text field (if any), and insert new text value

```java
driver.element().type(textFieldLocator, "any text you would like to type");
```

-   Append to existing text

```java
driver.element().typeAppend(textFieldLocator, "text added to the end");
```

### Perform Clipboard action

copy,cut or paste text

```java
driver.element().clipboardActions(textFieldLocator, "copy");
```

supports the following actions "copy", "paste", "cut", "select all", "unselect"

## Sample Code Snippet

```java

public class TypingDemo {
	By textField = By.id("tinymce");
	By textIFrame = By.id("mce_0_ifr");

	@Test
	void type() {
  		driver = new SHAFT.GUI.WebDriver();
		driver.browser().navigateToURL("https://the-internet.herokuapp.com/tinymce");
		// switch focus to IFrame containing the text field
		driver.element().switchToIframe(textIFrame );
		//append text to the end
		driver.element().typeAppend(textField, "this is added text");
		// copy the whole paragraph
		driver.element().clipboardActions(textField,"select all");
		driver.element().clipboardActions(textField, "copy");
		//replace original text using type
		driver.element().type(textField, "new text that overrides old content , ");
		//paste previously copied paragraph
		driver.element().clipboardActions(textField, "paste");

	}
}

```

### Get elements count

to find the number of elements matching a specific locator

```java
int numOfElements = driver.element().getElementsCount(locatorToMultipleElements);
```

## Sample Code Snippet

```java

public class Demo {
	private By searchBox = By.name("q");
	private By results = By.cssSelector("h3.LC20lb");

	@Test
	public void method() {
		driver = new SHAFT.GUI.WebDriver();
		driver.browser().navigateToURL("https://www.google.com");
		driver.element().type(searchBox, "SHAFT_ENGINE");
		driver.element().keyPress(searchBox, "ENTER");
		int num = driver.element().getElementsCount(results);
		System.out.println(num);

	}
}
```

### Get selected option from a drop down

```java
//Locator to the Drop Down element
By dropDown = By.id("dropdown");
//Retrieve selected text and store it in a string variable
String SelectedItem = driver.element().getAttribute(googleSearchBox, "name");
```

Retrieves the selected text from the target drop-down list element and returns it as a string value.

### Select an option from a drop down list

```java
//Locator to the Drop Down element
By dropDown = By.id("dropdown");
//Retrieve selected text and store it in a string variable
driver.element().select(dropDown, "Option 1");
```

## Sample Code Snippet

```java


public class DropDownDemo {

	private By dropDown = By.id("dropdown");

	@Test
	public void method() {
		driver = new SHAFT.GUI.WebDriver();
		driver.browser().navigateToURL(driver, "https://the-internet.herokuapp.com/dropdown");
		driver.element().getSelectedText( dropDown);
		driver.element().select(dropDown, "Option 1");
		driver.element().getSelectedText(dropDown);

	}

}
```

-   To verify the results you can use traditional String variables, check SHAFT results in the Allure report (as shown in the image below), or
    you can use other [verification] techniques.
    ![report_2](https://live.staticflickr.com/65535/51492098708_dd5f557495_z.jpg) <br/>

### Get size of an element

```java
String elementSize = driver.element().getSize(TargetElementLocator);
```

Retrieves element size from the target element and returns it as a string value.

-   An alternative to using [getCSSProperty​] to get width and height values separately

### Get elements text

Retrieves text from the target text field and returns it as a string value.

```java
String text = driver.element().getText(textBox);
```

### Get state of an element

-   Check if an element is clickable

```java
public class DynamicControlsDemo {
	By textField=By.xpath("//form[@id='input-example']/input");
	By changeState=By.xpath("//form[@id='input-example']/button");

	@Test
	public void alternate() {
		driver = new SHAFT.GUI.WebDriver();
		driver.browser().navigateToURL(driver, "https://the-internet.herokuapp.com/dynamic_controls");
		//--1-- check that initially the text box is not clickable
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		//--2-- press the button to enable the text box
		driver.element().click(changeState);
		//--3-- check again whether the text box is clickable
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		//--4-- attempt to click on the text box
		driver.element().click(textField);
		//--5-- finally verify the state of the check box
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		driver.element().type( textField, "SHAFT is awesome !");
	}
}
```

![clickable](https://live.staticflickr.com/65535/51628756225_c75d0b22c3_z.jpg) <br/>

The text field is disabled by default,directly after clicking the enable button the isElementClickable method still returns false because the switching takes some time, <b>the click method waits for target element to be clickable</b> and places the cursor inside the text field, by then the text field is naturally clicable as shown in the previous image captured from the Allure report.

-   Check if an element is displayed

```java
System.out.println(driver.element().isElementDisplayed(elementLocator));
```

returns a boolean indicating whether the element is displayed

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
