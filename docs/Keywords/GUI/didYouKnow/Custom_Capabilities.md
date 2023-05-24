---
id: Custom_Capabilities
title: Custom capabilities
sidebar_label: Custom capabilities
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
