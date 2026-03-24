---
id: Custom_Capabilities
title: Custom Browser Capabilities
sidebar_label: Custom Capabilities
description: "Add custom browser capabilities and Selenium options to SHAFT Engine WebDriver for advanced browser configuration."
keywords: [SHAFT, custom capabilities, browser options, Chrome options, Firefox options, Selenium capabilities]
---

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
