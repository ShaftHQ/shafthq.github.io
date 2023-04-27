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
