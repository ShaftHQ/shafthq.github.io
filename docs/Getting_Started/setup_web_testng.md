---
id: setup_web_testng
title: Web Project with TestNG
sidebar_label: TestNG
---

## 🟢 Setting Up a Web Project with TestNG

This guide walks you through creating a SHAFT web automation project using **TestNG** as the test runner.

---

## Step 1: Create Your Project

### Option A: Using IntelliJ IDEA (Recommended)

1. Open IntelliJ IDEA and select **New Project**

2. Select **Maven Archetype** from the left sidebar

3. Click **Add Archetype** and enter:
   ```text
   GroupId: io.github.shafthq
   ArtifactId: testng-archetype
   Version: (see step 4 for latest version)
   ```

4. Get the latest version from [SHAFT TestNG Archetype Releases](https://github.com/ShaftHQ/testng-archetype/releases/latest) and use it in the Version field above

5. Fill in your project details:
   - **Name**: Your project name (e.g., `MyWebTests`)
   - **GroupId**: Your organization (e.g., `com.mycompany`)
   - **ArtifactId**: Your project ID (e.g., `web-automation`)

6. Click **Create** and wait for Maven to download dependencies

### Option B: Using Command Line

1. Open a terminal and navigate to your workspace directory

2. Run the following command (replace `${archetype.version}` with the latest version):
   ```bash
   mvn archetype:generate \
     -DarchetypeGroupId=io.github.shafthq \
     -DarchetypeArtifactId=testng-archetype \
     -DarchetypeVersion=${archetype.version} \
     -DgroupId=com.mycompany \
     -DartifactId=web-automation \
     -DinteractiveMode=false
   ```

3. Open the generated project in your IDE

---

## Step 2: Project Structure Overview

Your project will have the following structure:

```
web-automation/
├── src/
│   ├── main/
│   │   └── resources/
│   │       └── properties/
│   │           └── custom.properties
│   └── test/
│       ├── java/
│       │   └── com/mycompany/
│       │       ├── pages/         # Page Objects
│       │       └── tests/         # Test Classes
│       └── resources/
│           ├── testData/          # Test data files
│           └── testng.xml         # TestNG configuration
├── pom.xml                         # Maven dependencies
└── README.md
```

---

## Step 3: Understand the Key Files

### pom.xml
Contains SHAFT dependency and project configuration:
```xml
<dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>SHAFT_ENGINE</artifactId>
    <version><!-- Latest SHAFT version --></version>
</dependency>
```

### testng.xml
Configures test execution:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Web Automation Suite" parallel="tests" thread-count="2">
    <test name="Sample Test">
        <classes>
            <class name="com.mycompany.tests.SampleTest"/>
        </classes>
    </test>
</suite>
```

### custom.properties
Configures SHAFT behavior:
```properties
# Browser configuration
targetBrowserName=chrome
headlessExecution=false

# Timeouts
browserNavigationTimeout=60
elementIdentificationTimeout=5

# Reporting
alwaysTakePageSourceOnFailure=true
createAnimatedGif=true
```

---

## Step 4: Create Your First Test

### Create a Page Object

Create a new file: `src/test/java/com/mycompany/pages/GoogleHomePage.java`

```java
package com.mycompany.pages;

import com.shaft.driver.SHAFT;
import org.openqa.selenium.By;

public class GoogleHomePage {
    private SHAFT.GUI.WebDriver driver;
    
    // Locators
    private By searchBox = By.name("q");
    private By searchButton = By.name("btnK");
    
    // Constructor
    public GoogleHomePage(SHAFT.GUI.WebDriver driver) {
        this.driver = driver;
    }
    
    // Actions
    public GoogleHomePage search(String query) {
        driver.element().type(searchBox, query);
        driver.element().click(searchButton);
        return this;
    }
    
    // Validations
    public GoogleHomePage verifySearchResults(String expectedText) {
        driver.assertThat().browser().title().contains(expectedText).perform();
        return this;
    }
}
```

### Create a Test Class

Create a new file: `src/test/java/com/mycompany/tests/GoogleSearchTest.java`

```java
package com.mycompany.tests;

import com.mycompany.pages.GoogleHomePage;
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class GoogleSearchTest {
    private SHAFT.GUI.WebDriver driver;
    
    @Test(description = "Search for SHAFT Engine on Google")
    public void searchForShaft() {
        // Navigate to Google
        driver.browser().navigateToURL("https://www.google.com");
        
        // Perform search
        new GoogleHomePage(driver)
            .search("SHAFT Engine Test Automation")
            .verifySearchResults("SHAFT");
    }
    
    @BeforeMethod
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
    }
    
    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}
```

---

## Step 5: Run Your Tests

### Using IntelliJ IDEA

1. Right-click on `testng.xml`
2. Select **Run 'testng.xml'**
3. View results in the TestNG tab at the bottom

### Using Maven Command Line

```bash
mvn clean test
```

### View Allure Report

After test execution:
```bash
mvn allure:serve
```

This opens an interactive HTML report with screenshots, logs, and detailed test information.

---

## Step 6: Common Configurations

### Run Tests in Different Browsers

Edit `src/main/resources/properties/custom.properties`:
```properties
# Chrome (default)
targetBrowserName=chrome

# Firefox
targetBrowserName=firefox

# Edge
targetBrowserName=microsoftedge

# Safari (macOS only)
targetBrowserName=safari
```

### Run Tests in Headless Mode

```properties
headlessExecution=true
```

### Enable Parallel Execution

Edit `testng.xml`:
```xml
<suite name="Web Automation Suite" parallel="methods" thread-count="4">
```

Options for `parallel`:
- `tests` - Run test tags in parallel
- `classes` - Run test classes in parallel
- `methods` - Run test methods in parallel

---

## Troubleshooting

### Issue: Browser doesn't launch

**Solution:** Ensure the browser is installed and update your browser version. SHAFT uses Selenium Manager to auto-download drivers.

### Issue: Tests are flaky

**Solution:** Increase timeouts in `custom.properties`:
```properties
elementIdentificationTimeout=10
browserNavigationTimeout=90
```

### Issue: Can't find elements

**Solution:** Verify your locators using browser DevTools (F12). Use more specific locators like IDs when possible.

---

## What's Next?

✅ **You've created your first Web + TestNG project!**

Continue your journey:

- 📚 [Learn Browser Actions](../Keywords/GUI/Browser_Actions)
- 🔍 [Master Element Identification](../Keywords/GUI/Element_Identification)
- ⚙️ [Configure Advanced Properties](../Properties/PropertiesList)
- 🔌 [Add Integrations](./integrations) (BrowserStack, Slack, etc.)
- 💬 [Join our Community](./support)

---

[← Back to Web Projects](./setup_web) | [JUnit 5 Setup →](./setup_web_junit5) | [Cucumber Setup →](./setup_web_cucumber)
