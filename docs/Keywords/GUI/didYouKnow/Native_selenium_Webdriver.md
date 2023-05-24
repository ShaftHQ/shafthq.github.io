---
id: Native_selenium_Webdriver
title: Native selenium WebDriver
sidebar_label: Native selenium WebDriver
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

