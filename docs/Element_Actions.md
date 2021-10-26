---
id: Element_Actions
title: Element Actions
sidebar_label: Element Actions
---

## Element Actions
The [ElementActions] class is responsible for handling interactions with web elements. <br/>
### Click on an Element
In order to interact with elements appearing on web page you'll first need to locate the element using one of WebDriver's locating strategies([By methods]) like ID, Class Name,
XPath, CSS Selectors, link Text, Partial link text, Name, or Tag name.

 ````java
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

//get a WebDriver instance 
WebDriver driver = DriverFactory.getDriver();
//a By object is used to store the locator to your element
private By elementLocator = By.id("sign_in_btn");
//click on target element
ElementActions.click(driver,elementLocator);
````
The method click will wait for your target element to be interactable and then attempts to click on it using Selenium WebDriver, if that didn't work it will
attempt to click using JavaScript
### Click And Hold
````java
import org.openqa.selenium.By;

ElementActions.clickAndHold(driver,By.cssSelector("div.hold_counter"));
````
Waits for the element to be clickable, and then clicks and holds it.
### Double Click​
````java
import org.openqa.selenium.By;

//store the locator to your element
By elementLocator = By.className("double_click_btn");
//Double click target element
ElementActions.doubleClick(driver,elementLocator);
````
### Hover
````java
import org.openqa.selenium.By;
//The locator to your element
By elementLocator = By.tagName("span");
//Hover over target element
ElementActions.hover(driver,elementLocator);
````
### Hover and click
- Hover over an element to show hover menue then click on one of the displayed options
````java
By clickable = By.xpath("//a[contains(text(),'Video Games ') ] ");
By hoverItem = By.linkText("Popular Toys");
 
ElementActions.hoverAndClick(driver, hoverItem, clickable);
````
- for multi-level hover menus You need to hover on the category, then hover on a subcategory, and so on until you finally click on the clickable item.
````java
public class HoverAndClickDemo {
	List<By> hoverLocators =new ArrayList<By>();
	By clickable = By.linkText("Car");

	@Test
	public void demo() {
		hoverLocators.add(By.linkText("Popular Toys"));
		hoverLocators.add(By.xpath("//a[contains(text(),'Video Games ') ] "));
		
		WebDriver driver = DriverFactory.getDriver();
		BrowserActions.navigateToURL(driver,"https://phppot.com/demo/multilevel-dropdown-menu-with-pure-css/");
		ElementActions.hoverAndClick(driver, hoverLocators, clickable);
	}
}
````
![hoverAndClick](https://live.staticflickr.com/65535/51627720576_1bd0cf9c6f_z.jpg) <br/>

### Drag and drop
- Drag an element into a target element
````java
By sourceElement = By.id("draggable");    // Locator to the element you want to drag
By targetElement = By.id("destination");  // Locator to the destination element

ElementActions.dragAndDrop(driver,sourceElement,targetElement);
````
- Drag an element to a specified position
````java
By sourceElement = By.id("draggable");    // Locator to the element you want to drag
int xPos= 500;
int yPos= 500;

ElementActions.dragAndDrop(driver,sourceElement,xPos,yPos);
````
### Get Tag name
````java
String TagName = ElementActions.getTagName(driver, ElementLocator);
````
Retrieves tag name from the target element and returns it as a string value.
### Get the value of an element attribute
````java
//The locator to your element
By googleSearchBox = By.cssSelector(".gLFyf.gsfi");
//get the value of the 'name' attribute
String attributeValue = ElementActions.getAttribute(driver, googleSearchBox, "name");
````
Returns the value of the given attribute as a String,you will allso be able to see something like this
![report](https://live.staticflickr.com/65535/51492494310_076bca3fdc.jpg) <br/>
in the automatically generated Allure report, for more on that see [Reporting].

### Get the value of a CSS property
````java
String propertyValue = ElementActions.getCSSProperty​(driver, elementLocator, "width");
````
### Get context handle\s
<!---
Needs further auditing
-->
you need to get the context handle in order to be able to switch back to it
- Return the handle for currently active context.
````java
String currentContext = ElementActions.getContext(driver);
````
- Returns a list of unique handles for all the currently open contexts.
````java
ElementActions.getContextHandles(driver);
````
### Switching focus to a different context
````java
ElementActions.setContext(currentContext);
````
### Insert text into a text field
- clear text inside a text field (if any), and insert new text value
````java
ElementActions.type(driver, textFieldLocator, "any text you would like to type");
````
- Append to existing text
````java
ElementActions.typeAppend(driver, textFieldLocator, "text added to the end");
````
### Get elements count
to find the number of elements matching a specific locator
````java
int numOfElements = ElementActions.getElementsCount(driver, locatorToMultipleElements);
````
## Sample Code Snippet
````java
package shaftDemo;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

import com.shaft.driver.DriverFactory;
import com.shaft.gui.browser.BrowserActions;
import com.shaft.gui.element.ElementActions;

public class Demo {
	private By searchBox = By.name("q");
	private By results = By.cssSelector("h3.LC20lb");
    
	@Test
	public void method() {
		WebDriver driver = DriverFactory.getDriver();
		BrowserActions.navigateToURL(driver, "https://www.google.com");
		ElementActions.type(driver, searchBox, "SHAFT_ENGINE");
		ElementActions.keyPress(driver, searchBox, "ENTER");
		int num = ElementActions.getElementsCount(driver, results);
		System.out.println(num);
		
	}
}
````
### Get selected option from a drop down
````java
//Locator to the Drop Down element
By dropDown = By.id("dropdown");
//Retrieve selected text and store it in a string variable
String SelectedItem = ElementActions.getAttribute(driver, googleSearchBox, "name");
````
Retrieves the selected text from the target drop-down list element and returns it as a string value.

### Select an option from a drop down list
````java
//Locator to the Drop Down element
By dropDown = By.id("dropdown");
//Retrieve selected text and store it in a string variable
ElementActions.select(driver, dropDown, "Option 1");
````
## Sample Code Snippet
````java
package shaftDemo;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

import com.shaft.driver.DriverFactory;
import com.shaft.gui.browser.BrowserActions;
import com.shaft.gui.element.ElementActions;

public class DropDownDemo {

	private By dropDown = By.id("dropdown");
	
	@Test
	public void method() {
		WebDriver driver = DriverFactory.getDriver();
		BrowserActions.navigateToURL(driver, "https://the-internet.herokuapp.com/dropdown");
		ElementActions.getSelectedText(driver, dropDown);
		ElementActions.select(driver, dropDown, "Option 1");
		ElementActions.getSelectedText(driver, dropDown);
		
	}
		
}
````
* To verify the results you can use traditional String variables, check SHAFT results in the Allure report (as shown in the image below), or
  you can use other [verification] techniques.
  ![report_2](https://live.staticflickr.com/65535/51492098708_dd5f557495_z.jpg) <br/>

### Get size of an element
````java
String elementSize = ElementActions.getSize(driver, TargetElementLocator);
````
Retrieves element size from the target element and returns it as a string value.
* An alternative to using [getCSSProperty​] to get width and height values separately
### Get elements text
Retrieves text from the target text field and returns it as a string value.
````java
String text = ElementActions.getText(driver, textBox);
````
### Get state of an element

- Check if an element is clickable

````java
public class DynamicControlsDemo {
	By textField=By.xpath("//form[@id='input-example']/input");
	By changeState=By.xpath("//form[@id='input-example']/button");
    
	@Test
	public void alternate() {
		WebDriver driver = DriverFactory.getDriver();
		BrowserActions.navigateToURL(driver, "https://the-internet.herokuapp.com/dynamic_controls");
		//--1-- check that initially the text box is not clickable
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		//--2-- press the button to enable the text box
		ElementActions.click(driver, changeState);
		//--3-- check again whether the text box is clickable
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		//--4-- attempt to click on the text box
		ElementActions.click(driver, textField);
		//--5-- finally verify the state of the check box
		ReportManager.log(String.valueOf(ElementActions.isElementClickable(driver, textField)));
		ElementActions.type(driver, textField, "SHAFT is awesome !");
	}
}
````
![clickable](https://live.staticflickr.com/65535/51628756225_c75d0b22c3_z.jpg) <br/>

The text field is disabled by default,directly after clicking the enable button the isElementClickable method still returns false because the switching takes some time, <b>the click method waits for target element to be clickable</b> and places the cursor inside the text field, by then the text field is naturally clicable as shown in the previous image captured from the Allure report.
- Check if an element is displayed
````java
System.out.println(ElementActions.isElementDisplayed(driver, elementLocator));
````
returns a boolean indicating whether the element is displayed

[comment]: <> (### wait for state of an element to change)


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