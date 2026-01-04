---
id: TestData_Management
title: Test Data Management
sidebar_label: Test Data
---

## Overview

Test data management is a critical aspect of test automation. SHAFT Engine provides robust support for managing test data across different file formats, making it easy to maintain, scale, and share test data across your automation projects.

SHAFT Engine supports the following test data formats:
- **JSON** - Ideal for structured data, API payloads, and complex nested data
- **CSV** - Perfect for simple tabular data and bulk test inputs
- **Excel (XLS/XLSX)** - Great for organizing test scenarios with multiple sheets
- **Properties** - Suitable for configuration data and key-value pairs

## Why Use External Test Data?

Using external test data files offers several advantages:

- **Separation of Concerns**: Keep test data separate from test logic
- **Maintainability**: Update test data without modifying code
- **Reusability**: Share test data across multiple test cases
- **Collaboration**: Non-technical team members can manage test data
- **Version Control**: Track changes to test data over time
- **Data-Driven Testing**: Run the same test with different data sets

---

## JSON Test Data

JSON (JavaScript Object Notation) is ideal for structured data with hierarchical relationships and is commonly used for API testing and complex test scenarios.

### Creating a JSON Test Data File

Create a JSON file in your test resources directory (e.g., `src/test/resources/testData/`):

```json title="TestData.json"
{
  "login": {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "welcomeText": "Welcome back!"
  },
  "search": {
    "query": "SHAFT Engine Test Automation",
    "expectedResults": "SHAFT Engine"
  },
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "email": "john.doe@example.com"
  }
}
```

### Using JSON Test Data

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class JSONTestDataExample {
    private SHAFT.TestData.JSON testData;

    @BeforeClass
    public void setupTestData() {
        // Load the JSON file
        testData = new SHAFT.TestData.JSON("testData/TestData.json");
    }

    @Test
    public void loginTest() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        // Access test data using dot notation for nested keys
        String email = testData.getTestData("login.email");
        String password = testData.getTestData("login.password");
        String welcomeText = testData.getTestData("login.welcomeText");
        
        driver.browser().navigateToURL("https://example.com/login")
            .and().element().type(By.id("email"), email)
            .and().element().type(By.id("password"), password)
            .and().element().click(By.id("loginButton"))
            .and().assertThat(By.className("welcome")).text().contains(welcomeText).perform();
        
        driver.quit();
    }

    @Test
    public void searchTest() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        String searchQuery = testData.getTestData("search.query");
        String expectedResults = testData.getTestData("search.expectedResults");
        
        driver.browser().navigateToURL("https://duckduckgo.com/")
            .and().element().type(By.name("q"), searchQuery)
            .and().element().click(By.cssSelector("button[type='submit']"))
            .and().assertThat(By.id("links")).text().contains(expectedResults).perform();
        
        driver.quit();
    }
}
```

### JSON with Arrays

You can also work with arrays in JSON:

```json title="Users.json"
{
  "users": [
    {
      "username": "user1",
      "password": "pass1"
    },
    {
      "username": "user2",
      "password": "pass2"
    }
  ]
}
```

```java
// Access array elements using index
String firstUser = testData.getTestData("users[0].username");
String firstPassword = testData.getTestData("users[0].password");
```

### Advantages of JSON
- ✅ Supports nested/hierarchical data structures
- ✅ Easy to read and understand
- ✅ Perfect for API request/response data
- ✅ Widely supported and standard format
- ✅ Can represent complex data types (arrays, objects)

### Best Practices for JSON
- Use meaningful keys that describe the data
- Group related data together using nested objects
- Keep the structure flat when possible for easier access
- Add comments in the test code to explain complex data structures
- Validate JSON syntax using online validators or IDE plugins

---

## CSV Test Data

CSV (Comma-Separated Values) is perfect for simple tabular data and is easy to create and edit using spreadsheet applications like Excel or Google Sheets.

### Creating a CSV Test Data File

Create a CSV file in your test resources directory:

```csv title="LoginData.csv"
username,password,expectedMessage
user1@test.com,Password123!,Login successful
user2@test.com,SecurePass456,Welcome back
admin@test.com,AdminPass789,Admin dashboard
```

### Using CSV Test Data

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class CSVTestDataExample {
    private SHAFT.TestData.CSV testData;

    @BeforeClass
    public void setupTestData() {
        // Load the CSV file
        testData = new SHAFT.TestData.CSV("testData/LoginData.csv");
    }

    @Test
    public void loginWithFirstUser() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        // Get data from specific row and column (0-indexed)
        // Row 0 is the header, so data starts from row 1
        String username = testData.getCellData(1, 0); // Row 1, Column 0
        String password = testData.getCellData(1, 1); // Row 1, Column 1
        String expectedMessage = testData.getCellData(1, 2); // Row 1, Column 2
        
        driver.browser().navigateToURL("https://example.com/login")
            .and().element().type(By.id("username"), username)
            .and().element().type(By.id("password"), password)
            .and().element().click(By.id("loginButton"))
            .and().assertThat(By.className("message")).text().isEqualTo(expectedMessage).perform();
        
        driver.quit();
    }
}
```

### Data-Driven Testing with CSV

Use CSV files for data-driven testing with TestNG DataProvider:

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class CSVDataDrivenTest {
    private SHAFT.TestData.CSV testData;

    @BeforeClass
    public void setupTestData() {
        testData = new SHAFT.TestData.CSV("testData/LoginData.csv");
    }

    @DataProvider(name = "loginData")
    public Object[][] getLoginData() {
        int rowCount = testData.getRowCount();
        Object[][] data = new Object[rowCount - 1][3]; // Exclude header row
        
        for (int i = 1; i < rowCount; i++) {
            data[i - 1][0] = testData.getCellData(i, 0); // username
            data[i - 1][1] = testData.getCellData(i, 1); // password
            data[i - 1][2] = testData.getCellData(i, 2); // expectedMessage
        }
        
        return data;
    }

    @Test(dataProvider = "loginData")
    public void loginTest(String username, String password, String expectedMessage) {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        driver.browser().navigateToURL("https://example.com/login")
            .and().element().type(By.id("username"), username)
            .and().element().type(By.id("password"), password)
            .and().element().click(By.id("loginButton"))
            .and().assertThat(By.className("message")).text().contains(expectedMessage).perform();
        
        driver.quit();
    }
}
```

### Advantages of CSV
- ✅ Simple and lightweight format
- ✅ Easy to create and edit in Excel or any text editor
- ✅ Great for large datasets
- ✅ Fast to read and parse
- ✅ Universally supported

### Best Practices for CSV
- Always include a header row with column names
- Avoid special characters in data (or properly escape them)
- Use consistent delimiters (commas by default)
- Keep one record per row for clarity
- Enclose text with commas or quotes in double quotes

---

## Excel Test Data

Excel files (XLS/XLSX) are ideal when you need to organize test data in multiple sheets, use different data types, or need a format that's familiar to non-technical team members.

### Creating an Excel Test Data File

Create an Excel file with multiple sheets:

**Sheet: LoginData**
| Username | Password | Role | ExpectedURL |
|----------|----------|------|-------------|
| admin@test.com | Admin123! | admin | /dashboard |
| user@test.com | User123! | user | /home |

**Sheet: ProductData**
| ProductID | ProductName | Price | Category |
|-----------|-------------|-------|----------|
| P001 | Laptop | 999.99 | Electronics |
| P002 | Mouse | 25.50 | Accessories |

### Using Excel Test Data

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class ExcelTestDataExample {
    private SHAFT.TestData.EXCEL loginData;
    private SHAFT.TestData.EXCEL productData;

    @BeforeClass
    public void setupTestData() {
        // Load Excel file with specific sheet
        loginData = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "LoginData");
        productData = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "ProductData");
    }

    @Test
    public void loginAsAdmin() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        // Get data from specific row and column (0-indexed, including header)
        String username = loginData.getCellData(1, 0); // Row 1 (first data row), Column 0
        String password = loginData.getCellData(1, 1);
        String expectedURL = loginData.getCellData(1, 3);
        
        driver.browser().navigateToURL("https://example.com/login")
            .and().element().type(By.id("username"), username)
            .and().element().type(By.id("password"), password)
            .and().element().click(By.id("loginButton"))
            .and().assertThat().browser().url().contains(expectedURL).perform();
        
        driver.quit();
    }

    @Test
    public void verifyProductDetails() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        String productName = productData.getCellData(1, 1); // First product name
        String productPrice = productData.getCellData(1, 2); // First product price
        
        driver.browser().navigateToURL("https://example.com/products")
            .and().element().click(By.linkText(productName))
            .and().assertThat(By.className("price")).text().contains(productPrice).perform();
        
        driver.quit();
    }
}
```

### Working with Multiple Sheets

```java
@BeforeClass
public void setupMultipleSheets() {
    // Load different sheets from the same Excel file
    SHAFT.TestData.EXCEL usersSheet = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "Users");
    SHAFT.TestData.EXCEL ordersSheet = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "Orders");
    SHAFT.TestData.EXCEL productsSheet = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "Products");
}
```

### Data-Driven Testing with Excel

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class ExcelDataDrivenTest {
    private SHAFT.TestData.EXCEL testData;

    @BeforeClass
    public void setupTestData() {
        testData = new SHAFT.TestData.EXCEL("testData/TestData.xlsx", "LoginData");
    }

    @DataProvider(name = "excelLoginData")
    public Object[][] getExcelLoginData() {
        int rowCount = testData.getRowCount();
        int colCount = 4; // username, password, role, expectedURL
        Object[][] data = new Object[rowCount - 1][colCount]; // Exclude header
        
        for (int i = 1; i < rowCount; i++) {
            for (int j = 0; j < colCount; j++) {
                data[i - 1][j] = testData.getCellData(i, j);
            }
        }
        
        return data;
    }

    @Test(dataProvider = "excelLoginData")
    public void loginTest(String username, String password, String role, String expectedURL) {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        driver.browser().navigateToURL("https://example.com/login")
            .and().element().type(By.id("username"), username)
            .and().element().type(By.id("password"), password)
            .and().element().click(By.id("loginButton"))
            .and().assertThat().browser().url().contains(expectedURL).perform();
        
        driver.quit();
    }
}
```

### Advantages of Excel
- ✅ Familiar to non-technical users
- ✅ Supports multiple sheets in one file
- ✅ Can handle different data types (numbers, dates, formulas)
- ✅ Visual organization with colors and formatting
- ✅ Good for complex test scenarios

### Best Practices for Excel
- Use meaningful sheet names
- Include header rows for clarity
- One test scenario per row
- Use separate sheets for different test types
- Keep data organized and well-formatted
- Avoid merged cells and complex formulas

---

## Properties Test Data

Properties files are ideal for configuration data, environment-specific settings, and simple key-value pairs.

### Creating a Properties Test Data File

Create a properties file in your test resources directory:

```properties title="test.properties"
# Application URLs
app.url=https://example.com
app.api.url=https://api.example.com
app.admin.url=https://admin.example.com

# User Credentials
user.email=user@test.com
user.password=TestPassword123!
admin.email=admin@test.com
admin.password=AdminPassword123!

# Test Configuration
test.timeout=30
test.browser=chrome
test.headless=true

# API Settings
api.timeout=60
api.retry=3
```

### Using Properties Test Data

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;
import java.io.FileInputStream;
import java.util.Properties;

public class PropertiesTestDataExample {
    private Properties testData;

    @BeforeClass
    public void setupTestData() throws Exception {
        testData = new Properties();
        FileInputStream file = new FileInputStream("src/test/resources/testData/test.properties");
        testData.load(file);
        file.close();
    }

    @Test
    public void loginTest() {
        SHAFT.GUI.WebDriver driver = new SHAFT.GUI.WebDriver();
        
        // Access properties
        String appUrl = testData.getProperty("app.url");
        String userEmail = testData.getProperty("user.email");
        String userPassword = testData.getProperty("user.password");
        
        driver.browser().navigateToURL(appUrl + "/login")
            .and().element().type(By.id("email"), userEmail)
            .and().element().type(By.id("password"), userPassword)
            .and().element().click(By.id("loginButton"))
            .and().assertThat(By.className("welcome")).exists().perform();
        
        driver.quit();
    }

    @Test
    public void apiTest() {
        String apiUrl = testData.getProperty("app.api.url");
        int timeout = Integer.parseInt(testData.getProperty("api.timeout"));
        
        SHAFT.API api = new SHAFT.API(apiUrl);
        api.get("/users")
            .setTargetStatusCode(200)
            .perform();
    }
}
```

### Environment-Specific Properties

Create multiple properties files for different environments:

```properties title="test-dev.properties"
app.url=https://dev.example.com
db.url=jdbc:mysql://dev-db.example.com:3306/testdb
```

```properties title="test-prod.properties"
app.url=https://example.com
db.url=jdbc:mysql://db.example.com:3306/proddb
```

```java
@BeforeClass
public void setupTestData() throws Exception {
    testData = new Properties();
    String environment = System.getProperty("env", "dev"); // Default to dev
    String fileName = "test-" + environment + ".properties";
    FileInputStream file = new FileInputStream("src/test/resources/testData/" + fileName);
    testData.load(file);
    file.close();
}
```

Run tests with different environments:
```bash
# Run with dev environment (default)
mvn test

# Run with production environment
mvn test -Denv=prod
```

### Advantages of Properties Files
- ✅ Simple key-value format
- ✅ Perfect for configuration data
- ✅ Easy to maintain and version control
- ✅ Support for comments
- ✅ Fast to load and parse
- ✅ Standard Java format

### Best Practices for Properties
- Use hierarchical keys with dots (e.g., `app.url`, `app.api.url`)
- Add comments to explain complex configurations
- Group related properties together
- Use separate files for different environments
- Avoid sensitive data (use environment variables instead)
- Keep keys lowercase with dots and underscores

---

## Comparison of Test Data Formats

| Feature | JSON | CSV | Excel | Properties |
|:--------|:-----|:----|:------|:-----------|
| **Structure** | Hierarchical | Tabular | Tabular | Key-Value |
| **Complexity** | High | Low | Medium | Low |
| **Best For** | APIs, Complex data | Bulk data | Test scenarios | Configuration |
| **Readability** | Good | Excellent | Excellent | Excellent |
| **Non-tech Friendly** | Medium | High | High | High |
| **Multi-sheet Support** | N/A | No | Yes | No |
| **Nested Data** | Yes | No | No | No |
| **File Size** | Small | Small | Large | Small |
| **Edit Tools** | Text editor, IDE | Excel, Text editor | Excel | Text editor |

---

## Best Practices for Test Data Management

### 1. Organize Test Data Files

```
src/test/resources/testData/
├── json/
│   ├── users.json
│   ├── products.json
│   └── orders.json
├── csv/
│   ├── login-credentials.csv
│   └── test-users.csv
├── excel/
│   └── test-scenarios.xlsx
└── properties/
    ├── test-dev.properties
    ├── test-staging.properties
    └── test-prod.properties
```

### 2. Separate Test Data from Test Logic

```java
// Good Practice
@BeforeClass
public void setupTestData() {
    testData = new SHAFT.TestData.JSON("testData/users.json");
}

@Test
public void loginTest() {
    String email = testData.getTestData("user.email");
    // Use email in test
}

// Avoid hardcoding data in tests
@Test
public void loginTest() {
    String email = "hardcoded@test.com"; // Bad practice
}
```

### 3. Use Meaningful Names

```java
// Good
testData.getTestData("login.validUser.email");
testData.getTestData("checkout.invalidCard.number");

// Not ideal
testData.getTestData("data1");
testData.getTestData("test");
```

### 4. Version Control Your Test Data

- Commit test data files to version control
- Track changes to test data
- Use meaningful commit messages for data changes
- Review test data changes in pull requests

### 5. Handle Sensitive Data Securely

```java
// Don't store passwords in plain text
// Use environment variables or secure vaults

@Test
public void loginTest() {
    String username = testData.getTestData("user.username");
    String password = System.getenv("TEST_USER_PASSWORD"); // From env variable
}
```

### 6. Keep Test Data Clean

- Remove obsolete test data regularly
- Update test data when application changes
- Use consistent data formats
- Document complex test data structures

### 7. Load Test Data Efficiently

```java
// Good - Load once per test class
private SHAFT.TestData.JSON testData;

@BeforeClass
public void setupTestData() {
    testData = new SHAFT.TestData.JSON("testData.json");
}

// Avoid - Loading in every test method
@Test
public void test1() {
    SHAFT.TestData.JSON data = new SHAFT.TestData.JSON("testData.json"); // Inefficient
}
```

---

## Common Use Cases

### Use Case 1: Multi-Language Testing

```json title="messages.json"
{
  "en": {
    "welcome": "Welcome",
    "logout": "Logout"
  },
  "es": {
    "welcome": "Bienvenido",
    "logout": "Cerrar sesión"
  },
  "fr": {
    "welcome": "Bienvenue",
    "logout": "Déconnexion"
  }
}
```

```java
@Test(dataProvider = "languages")
public void testInMultipleLanguages(String language) {
    String welcomeMessage = testData.getTestData(language + ".welcome");
    // Verify UI displays correct message
}
```

### Use Case 2: Cross-Browser Testing with Test Data

```java
public class CrossBrowserTestWithData {
    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    private SHAFT.TestData.JSON testData;

    @BeforeClass
    public void setupTestData() {
        testData = new SHAFT.TestData.JSON("testData/users.json");
    }

    @Test
    public void loginTest() {
        driver.get().browser().navigateToURL(testData.getTestData("app.url"))
            .and().element().type(By.id("email"), testData.getTestData("user.email"))
            .and().element().type(By.id("password"), testData.getTestData("user.password"))
            .and().element().click(By.id("loginButton"))
            .and().assertThat(By.className("welcome")).text()
                .contains(testData.getTestData("user.welcomeMessage")).perform();
    }

    @BeforeMethod
    public void setup() {
        driver.set(new SHAFT.GUI.WebDriver());
    }

    @AfterMethod
    public void teardown() {
        driver.get().quit();
    }
}
```

### Use Case 3: API Testing with JSON Test Data

```json title="api-test-data.json"
{
  "createUser": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "updateUser": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

```java
@Test
public void createUserTest() {
    SHAFT.API api = new SHAFT.API("https://api.example.com");
    
    String requestBody = String.format(
        "{\"name\":\"%s\",\"email\":\"%s\",\"age\":%s}",
        testData.getTestData("createUser.name"),
        testData.getTestData("createUser.email"),
        testData.getTestData("createUser.age")
    );
    
    api.post("/users")
        .setRequestBody(requestBody)
        .setTargetStatusCode(201)
        .perform();
}
```

### Use Case 4: Database Testing with Properties

```properties title="db-config.properties"
db.url=jdbc:mysql://localhost:3306/testdb
db.username=testuser
db.password=testpass
db.driver=com.mysql.cj.jdbc.Driver
```

```java
@Test
public void databaseTest() throws Exception {
    String dbUrl = testData.getProperty("db.url");
    String username = testData.getProperty("db.username");
    String password = testData.getProperty("db.password");
    
    SHAFT.DB database = new SHAFT.DB(dbUrl, username, password);
    // Perform database operations
}
```

---

## Troubleshooting

### File Not Found

**Problem**: `FileNotFoundException` when loading test data.

**Solution**:
- Verify file path is correct relative to `src/test/resources/`
- Check file name spelling and extension
- Ensure file is in the correct directory
- Use absolute path for debugging: `new File("src/test/resources/testData.json").getAbsolutePath()`

### Invalid JSON Format

**Problem**: JSON parsing errors.

**Solution**:
- Validate JSON syntax using online validators (jsonlint.com)
- Check for missing commas, brackets, or quotes
- Use IDE plugins for JSON validation
- Ensure proper escaping of special characters

### CSV Encoding Issues

**Problem**: Special characters not displayed correctly.

**Solution**:
- Save CSV files with UTF-8 encoding
- Avoid special characters in data when possible
- Use Excel's "CSV UTF-8" format when saving

### Excel File Locked

**Problem**: Cannot read Excel file.

**Solution**:
- Close the Excel file before running tests
- Don't open Excel files while tests are running
- Use copies of Excel files for test runs

---

## Summary

SHAFT Engine provides comprehensive test data management capabilities:

1. **JSON**: Best for structured, hierarchical data and API testing
2. **CSV**: Ideal for simple tabular data and bulk test inputs
3. **Excel**: Perfect for organized test scenarios with multiple sheets
4. **Properties**: Great for configuration and environment-specific data

**Key Takeaways**:
- Choose the right format for your use case
- Keep test data separate from test logic
- Use meaningful names and organize files well
- Version control your test data
- Handle sensitive data securely
- Load test data efficiently

By following these guidelines and examples, you can build a robust and maintainable test data management strategy for your SHAFT Engine automation projects.

---

## Related Documentation

- [File Actions](../Keywords/CLI/File_Actions.md) - Reading and writing files programmatically
- [File Validations](../Keywords/Validations/Files.md) - Validating file content and existence
- [API Request Builder](../Keywords/API/Request_Builder.md) - Building API requests with test data
- [Parallel Execution](../Basic_Config/parallelExecution.md) - Using test data in parallel tests
- [Properties List](../Properties/PropertiesList.mdx) - SHAFT configuration properties
