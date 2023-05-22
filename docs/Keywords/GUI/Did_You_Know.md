---
id: Did_You_Know
title: Did you know
sidebar_label: Did you know 
---
## Native selenium WebDriver
- Did you know that you can use native selenium webdriver with SHAFT whenever you need it 
```java
driver = new SHAFT.GUI.WebDriver();  
nativeDriver = driver.getDriver() ; 
```
Example
```java
driver = new SHAFT.GUI.WebDriver();  
nativeDriver = driver.getDriver() ;
nativeDriver.findElement(By.id("lname"));

```

## Custom Capabilities
- Did you know that you can use your own custom capabilities with SHAFT

```java
driver = new SHAFT.GUI.WebDriver(BrowserType, customOptions);
```
Example
```java
ChromeOptions options = new ChromeOptions();
		options.addArguments("--remote-allow-origins=*");
		driver = new SHAFT.GUI.WebDriver(DriverType.CHROME , options);
```

## SHAFT Locator Builder 
- welcome to the new era of locating elements , with SHAFT Locator Builder you can locate element as if you were writing a story , you don't need to worry about xpath or css selector anymore
you can use it in multiple ways as below , 
```java
By locator = SHAFT.GUI.Locator.hasTagName("String value of desired Tag name").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name" , "string value of the attribute").build();
```
you can discover more options like containsText , containsId , containsClass 

Example 
below element has **tag name** "Button" , and has **attribute** "data-test" and **attribute value** is "add-to-cart-sauce-labs-backpack"

![Screenshot 2023-05-22 231141](https://github.com/ShaftHQ/shafthq.github.io/assets/65794900/a73f1e68-2476-4367-abbf-637b303089ac)

using SHAFT Locator Builder you can locate this element like below

```java
By buttonLocator = SHAFT.GUI.Locator.hasTagName("button").hasAttribute("test-data" , "add-to-cart-sauce-labs-backpack").build();
```
		
		
