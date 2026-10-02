# Test Data Management

Manage test data from JSON, Excel, CSV, and YAML files using SHAFT Engine's test data management API.

Canonical HTML: https://shafthq.github.io/docs/reference/actions/TestData_Management
Guide index: https://shafthq.github.io/llms.txt

## Overview

Test data management is a critical aspect of test automation. SHAFT Engine supports managing test data across different file formats, making it easy to maintain, scale, and share test data across your automation projects.

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
 .and().assertThat(By.className("welcome")).text().contains(welcomeText);
 
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
 .and().assertThat(By.id("links")).text().contains(expectedResults);
 
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
 .and().assertThat(By.className("message")).text().isEqualTo(expectedMessage);
 
 driver.quit();
 }
}
```

### Data-Driven Testing with CSV

Use CSV files for data-driven testing with TestNG DataProvider:

```java

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
 
 for (int i = 1; i items = testData.getListAs("items", String.class);
```

### Advantages of YAML

- Human-readable with minimal syntax noise
- Supports comments (`#`) — helpful for documenting test data
- Handles nested structures and lists natively
- Ideal replacement for properties files when you need hierarchy
- Works with SHAFT's type-safe API

### Best Practices for YAML

- Use `.yaml` (not `.yml`) extension for consistency with SHAFT conventions
- Store YAML files under `src/test/resources/testData/`
- Keep sensitive values (passwords, tokens) in environment variables or encrypted files
- Use comments in YAML to explain the purpose of each section

---

## Comparison of Test Data Formats

| Feature | JSON | CSV | Excel | Properties | YAML |
|:--------|:-----|:----|:------|:-----------|:-----|
| **Structure** | Hierarchical | Tabular | Tabular | Key-Value | Hierarchical |
| **Complexity** | High | Low | Medium | Low | Medium |
| **Best For** | APIs, Complex data | Bulk data | Test scenarios | Configuration | Config & nested data |
| **Readability** | Good | Excellent | Excellent | Excellent | Excellent |
| **Non-tech Friendly** | Medium | High | High | High | High |
| **Multi-sheet Support** | N/A | No | Yes | No | No |
| **Nested Data** | Yes | No | No | No | Yes |
| **File Size** | Small | Small | Large | Small | Small |
| **Supports Comments** | No | No | No | No | Yes |
| **Edit Tools** | Text editor, IDE | Excel, Text editor | Excel | Text editor | Text editor, IDE |

---

## Best Practices for Test Data Management

### 1. Organize Test Data Files

```
src/test/resources/testData/
├── json/
│ ├── users.json
│ ├── products.json
│ └── orders.json
├── csv/
│ ├── login-credentials.csv
│ └── test-users.csv
├── excel/
│ └── test-scenarios.xlsx
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
 private ThreadLocal driver = new ThreadLocal<>();
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
 .contains(testData.getTestData("user.welcomeMessage"));
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
 .setTargetStatusCode(201);
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

SHAFT Engine provides these test data management capabilities:

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

By following these guidelines and examples, you can build a maintainable test data management strategy for your SHAFT Engine automation projects.

---

## Full test data reader reference 

| Reader | Methods |
| --- | --- |
| `SHAFT.TestData.CSV` | `getRows()`, `getColumns()`, `getColumnsWithData()` (column name to row values), `getFirstColumn()`, `getLastColumn()`, `getSpecificColumnName(int)`, `getSpecificColumnData(String or int)`, `getCellCount(String or int)`, `getMaxCellValue(String or int)` and `getMinCellValue(String or int)`. |
| `SHAFT.TestData.EXCEL` | `getColumnNameUsingRowNameAndCellData([sheetName,] rowName, cellData)` finds the column holding a value in a row, and `getLastColumnNumber([sheetName])` returns the last header column (zero based). |
| `SHAFT.TestData.JSON` | `getTestDataAsJson(String jsonPath)`, `getTestDataAsList(String jsonPath)` and `getTestDataAsMap(String jsonPath)` read an object, list or map at a JSONPath. |
| `SHAFT.TestData.YAML` | `getDate(key)`, `getDouble(key)`, `getLong(key)` and `getMapAs(key, Class )`; nested keys use dots, for example `"user.address.city"`. |

## Related

- [File Actions](/docs/reference/actions/CLI/File_Actions) - Reading and writing files programmatically
- [File validations](/docs/reference/actions/Validations#file-validations) - Validating file content and existence
- [API Request Builder](/docs/reference/actions/API/Request_Builder) - Building API requests with test data
- [Parallel Execution](/docs/reference/configuration/parallelExecution) - Using test data in parallel tests
- [Properties List](/docs/reference/properties/PropertiesList) - SHAFT configuration properties
