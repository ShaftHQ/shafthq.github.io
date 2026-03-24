---
id: Native_selenium_Webdriver
title: Native Selenium WebDriver Access
sidebar_label: Native Selenium WebDriver
description: "Access the native Selenium WebDriver instance from SHAFT for advanced use cases and custom Selenium interactions."
keywords: [SHAFT, native Selenium, WebDriver access, custom Selenium, advanced Selenium, driver instance]
tags: [web, selenium, native-driver]
---

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

