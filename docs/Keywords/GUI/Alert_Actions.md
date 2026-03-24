---
id: Alert_Actions
title: Alert Actions
sidebar_label: Alert
description: "Handle browser alert dialogs — accept, dismiss, read text, and type into prompt alerts using SHAFT Engine."
keywords: [SHAFT, alert actions, JavaScript alert, confirm dialog, prompt dialog, browser alerts, web automation]
tags: [web, alerts, actions, javascript]
---

Alerts are dialog boxes that appear in the browser to notify or prompt the user. SHAFT provides the `AlertActions` class to interact with these dialogs.

## Accessing Alert Actions

Use `driver.alert()` to access alert actions:

```java title="AlertAccess.java"
driver.alert().acceptAlert();
```

## acceptAlert()

Accepts the currently displayed alert dialog (equivalent to clicking "OK").

```java title="AcceptAlert.java"
driver.alert().acceptAlert();
```

## dismissAlert()

Dismisses the currently displayed alert dialog (equivalent to clicking "Cancel").

```java title="DismissAlert.java"
driver.alert().dismissAlert();
```

## getAlertText()

Retrieves the text message displayed in the currently active alert dialog.

```java title="GetAlertText.java"
String alertMessage = driver.alert().getAlertText();
```

## typeIntoPromptAlert()

Types text into a prompt alert dialog before accepting or dismissing it.

```java title="TypeIntoPrompt.java"
driver.alert().typeIntoPromptAlert("your text");
```

## isAlertPresent()

Checks whether an alert dialog is currently present on the page. Returns `true` if an alert is present, `false` otherwise.

```java title="IsAlertPresent.java"
boolean alertPresent = driver.alert().isAlertPresent();
```

## Complete Example

```java title="AlertDemo.java"
import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AlertDemo {
    private SHAFT.GUI.WebDriver driver;
    private By jsAlertButton = By.xpath("//button[text()='Click for JS Alert']");
    private By jsConfirmButton = By.xpath("//button[text()='Click for JS Confirm']");
    private By jsPromptButton = By.xpath("//button[text()='Click for JS Prompt']");

    @BeforeMethod
    public void setup() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://the-internet.herokuapp.com/javascript_alerts");
    }

    @Test
    public void handleSimpleAlert() {
        driver.element().click(jsAlertButton);

        if (driver.alert().isAlertPresent()) {
            String alertText = driver.alert().getAlertText();
            System.out.println("Alert message: " + alertText);
            driver.alert().acceptAlert();
        }
    }

    @Test
    public void handleConfirmAlert() {
        driver.element().click(jsConfirmButton);
        driver.alert().dismissAlert();
    }

    @Test
    public void handlePromptAlert() {
        driver.element().click(jsPromptButton);
        driver.alert().typeIntoPromptAlert("SHAFT Engine");
        driver.alert().acceptAlert();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```
