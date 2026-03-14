---
id: Alert_Actions
title: Alert Actions
sidebar_label: Alert
---

Alerts are dialog boxes that appear in the browser to notify or prompt the user. SHAFT provides the `AlertActions` class to interact with these dialogs.

### Get an AlertActions Instance

Use `driver.element().performAlertAction()` to obtain an `AlertActions` instance:

```java
AlertActions alert = driver.element().performAlertAction();
```

### acceptAlert()

Accepts the currently displayed alert dialog (equivalent to clicking "OK").

```java
AlertActions alert = driver.element().performAlertAction();
alert.acceptAlert();
```

### dismissAlert()

Dismisses the currently displayed alert dialog (equivalent to clicking "Cancel").

```java
AlertActions alert = driver.element().performAlertAction();
alert.dismissAlert();
```

### getAlertText()

Retrieves the text message displayed in the currently active alert dialog.

```java
AlertActions alert = driver.element().performAlertAction();
String alertMessage = alert.getAlertText();
```

### typeIntoPromptAlert()

Types text into a prompt alert dialog before accepting or dismissing it.

- Needed parameters: `text` - the text to be entered into the prompt.

```java
AlertActions alert = driver.element().performAlertAction();
alert.typeIntoPromptAlert("your text");
```

### isAlertPresent()

Checks whether an alert dialog is currently present on the page. Returns `true` if an alert is present, `false` otherwise.

```java
AlertActions alert = driver.element().performAlertAction();
boolean alertPresent = alert.isAlertPresent();
```

## Sample Code Snippet

```java
import com.shaft.driver.SHAFT;
import com.shaft.gui.element.AlertActions;
import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AlertDemo {
    private SHAFT.GUI.WebDriver driver;

    // Locators for buttons that trigger alerts on the demo page
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
        // Trigger the alert by clicking the button
        driver.element().click(jsAlertButton);

        AlertActions alert = driver.element().performAlertAction();

        // Check if an alert is present before interacting with it
        if (alert.isAlertPresent()) {
            // Retrieve and log the alert text
            String alertText = alert.getAlertText();
            System.out.println("Alert message: " + alertText);

            // Accept the alert
            alert.acceptAlert();
        }
    }

    @Test
    public void handleConfirmAlert() {
        // Trigger the confirm dialog
        driver.element().click(jsConfirmButton);

        AlertActions alert = driver.element().performAlertAction();

        // Dismiss the confirm dialog (equivalent to clicking "Cancel")
        alert.dismissAlert();
    }

    @Test
    public void handlePromptAlert() {
        // Trigger the prompt dialog
        driver.element().click(jsPromptButton);

        AlertActions alert = driver.element().performAlertAction();

        // Type text into the prompt alert and then accept it
        alert.typeIntoPromptAlert("SHAFT Engine");
        alert.acceptAlert();
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
```
