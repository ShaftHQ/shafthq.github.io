---
id: Shadow_Dom_Locator_Builder
title: Shadow Dom Locator Builder
sidebar_label: Shadow Dom Locator Builder 
---


## Shadow Dom Locator Builder
an advanced application and advantage of [SHAFT Locator Builder ](/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder.md) is locating elements inside shadow dom.

#### Example 

![Screenshot 2023-05-23 235203](https://github.com/ShaftHQ/shafthq.github.io/assets/65794900/1d1fb006-0c35-4613-b0a6-b42a391b5bc4)

to locate the element with tagName "a" inside the nested shadow root you can follow the below code : 

```java
 public void shadowDomLocatorTest() {
 driver = new SHAFT.GUI.WebDriver();
 By shadowHost = SHAFT.GUI.Locator.hasTagName("shop-app").build();
 By shadowElement = SHAFT.GUI.Locator.hasTagName("a")
                                     .hasAttribute("href", "/list/mens_outerwear")
                                     .insideShadowDom(shadowHost)
				     .build();    
driver.browser().navigateToURL("https://shop.polymer-project.org/");        
driver.element().click(shadowElement);
}		    
```

for more examples visit [ShadowDomTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java) on Github.

