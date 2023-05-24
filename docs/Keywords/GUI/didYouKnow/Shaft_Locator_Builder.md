---
id: Shaft_Locator_Builder
title: Shaft Locator Builder
sidebar_label: Shaft Locator Builder
---

- welcome to the new era of locating elements , with SHAFT Locator Builder you can locate element as if you were writing a story , you don't need to worry about xpath or css selector anymore
you can use it in multiple ways as below , 
```java
By locator = SHAFT.GUI.Locator.hasTagName("String value of desired Tag name").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name").build();
By locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name" , "string value of the attribute").build();
```
you can discover more options like containsText , containsId , containsClass 

#### Example 

below element has **tag name** "Button" , and has **attribute** "data-test" and **attribute value** is "add-to-cart-sauce-labs-backpack"

![Screenshot 2023-05-22 231141](https://github.com/ShaftHQ/shafthq.github.io/assets/65794900/a73f1e68-2476-4367-abbf-637b303089ac)

using SHAFT Locator Builder you can locate this element like below

```java
By buttonLocator = SHAFT.GUI.Locator.hasTagName("button").hasAttribute("test-data" , "add-to-cart-sauce-labs-backpack").build();
```
for more examples visit [LocatorBuilderTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java) on Github.

