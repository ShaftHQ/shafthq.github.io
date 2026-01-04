---
id: File_Actions
title: File Actions
sidebar_label: File
---

## File Actions Driver

-   In order to perform file operations programmatically, you will need an instance of FileActions

```java
import com.shaft.cli.FileActions;

FileActions fileActions = FileActions.getInstance();
```

Upon executing this line, SHAFT ENGINE provides you with a singleton instance to perform various file manipulation operations. This is essential for test data management, file-based validations, and automated file handling workflows.

## File Actions

The FileActions class handles file system operations, allowing you to create, read, write, copy, and delete files as part of your automated test flows.

## Read File

### readFromFile

```java
String content = fileActions.readFromFile("/path/to/file.txt");
```

-   Reads and returns the complete contents of a file as a string.
-   Works with text files, configuration files, and other readable file formats.
-   The file path can be absolute or relative to your project directory.

**Example:**
```java
String testData = fileActions.readFromFile("src/test/resources/testData.txt");
System.out.println(testData);
```

## Write to File

### writeToFile

```java
fileActions.writeToFile("/path/to/file.txt", "File content here");
```

-   Writes the specified content to a file.
-   Creates a new file if it doesn't exist.
-   Overwrites the file content if it already exists.
-   Takes two parameters: file path and content string.

**Example:**
```java
String reportData = "Test Results: All tests passed";
fileActions.writeToFile("reports/test_summary.txt", reportData);
```

## Copy File

### copyFile

```java
fileActions.copyFile("/path/to/source.txt", "/path/to/destination.txt");
```

-   Copies a file from the source path to the destination path.
-   Creates destination directories if they don't exist.
-   Useful for backing up files or duplicating test data.
-   Takes two parameters: source file path and destination file path.

**Example:**
```java
// Backup configuration before test
fileActions.copyFile("config/settings.json", "config/settings.backup.json");
```

## Delete File

### deleteFile

```java
fileActions.deleteFile("/path/to/file.txt");
```

-   Deletes the file at the specified path.
-   Useful for cleanup operations or removing temporary files.
-   No error is thrown if the file doesn't exist (safe deletion).

**Example:**
```java
// Cleanup after test
fileActions.deleteFile("temp/temp_data.txt");
```

## Common Use Cases

### Test Data Management

Use file actions to manage test data files:

```java
@BeforeClass
void setupTestData() {
    // Copy fresh test data for each test run
    fileActions.copyFile(
        "src/test/resources/original_data.json",
        "target/test_data.json"
    );
}

@Test
void processTestData() {
    String testData = fileActions.readFromFile("target/test_data.json");
    // Process and use test data
    processData(testData);
}

@AfterClass
void cleanupTestData() {
    fileActions.deleteFile("target/test_data.json");
}
```

### Configuration File Handling

Read and modify configuration files:

```java
@Test
void updateConfiguration() {
    // Read current config
    String config = fileActions.readFromFile("config/app.properties");
    
    // Modify config
    String updatedConfig = config.replace("debug=false", "debug=true");
    
    // Write updated config
    fileActions.writeToFile("config/app.properties", updatedConfig);
}
```

### Report Generation

Generate custom reports or logs:

```java
@AfterMethod
void generateTestReport(ITestResult result) {
    String reportContent = String.format(
        "Test: %s\nStatus: %s\nTime: %s\n",
        result.getName(),
        result.getStatus(),
        new Date()
    );
    
    fileActions.writeToFile(
        "reports/" + result.getName() + "_report.txt",
        reportContent
    );
}
```

### File Validation

Combine with file validations to verify file operations:

```java
@Test
void validateFileOperations() {
    // Create a file
    String content = "Test content";
    fileActions.writeToFile("test.txt", content);
    
    // Validate file exists and has correct content
    Validations.assertThat()
        .file(".", "test.txt")
        .exists()
        .perform();
    
    String readContent = fileActions.readFromFile("test.txt");
    Validations.assertThat()
        .object(readContent)
        .isEqualTo(content)
        .perform();
    
    // Cleanup
    fileActions.deleteFile("test.txt");
}
```

## Working with Different File Types

### Text Files

```java
// Read and write plain text
String text = fileActions.readFromFile("data.txt");
fileActions.writeToFile("output.txt", "Plain text content");
```

### Configuration Files

```java
// Handle properties, JSON, XML, YAML files
String properties = fileActions.readFromFile("config.properties");
String jsonData = fileActions.readFromFile("data.json");
String xmlData = fileActions.readFromFile("config.xml");
```

### Test Data Files

```java
// Read test data from various formats
String csvData = fileActions.readFromFile("testData.csv");
String testScript = fileActions.readFromFile("testScript.sql");
```

## File Path Handling

### Absolute Paths

```java
fileActions.readFromFile("/home/user/project/data/file.txt");  // Linux/Mac
fileActions.readFromFile("C:\\Users\\username\\project\\data\\file.txt");  // Windows
```

### Relative Paths

```java
fileActions.readFromFile("src/test/resources/data.txt");
fileActions.readFromFile("target/reports/summary.txt");
```

### Project-relative Paths

```java
// Relative to project root
fileActions.readFromFile("testData/input.txt");
fileActions.writeToFile("output/results.txt", data);
```

## Best Practices

-   **File Path Validation**: Ensure file paths are correct and accessible
-   **Error Handling**: Wrap file operations in try-catch blocks for production code
-   **Resource Cleanup**: Always delete temporary files after test execution
-   **Path Separators**: Use forward slashes (/) for cross-platform compatibility, or use `File.separator`
-   **Encoding**: Be aware of file encoding when reading/writing non-ASCII characters
-   **File Permissions**: Ensure your test execution environment has necessary file system permissions
-   **Backup Important Files**: Use `copyFile` to backup files before modifying them in tests

## Integration with File Validations

File Actions work seamlessly with SHAFT's File Validations:

```java
// Perform file action
fileActions.writeToFile("test.txt", "Hello SHAFT");

// Validate the result
Validations.assertThat()
    .file(".", "test.txt")
    .exists()
    .perform();

Validations.assertThat()
    .file(".", "test.txt")
    .content()
    .contains("Hello SHAFT")
    .perform();
```

For more information on file validations, see the [File Validations](../Validations/Files.md) section.

As you skim through the console output, you will notice the comprehensive reporting SHAFT provides for each file operation, making it easy to track and debug file-related test activities.

[reporting]: #
[file validations]: ../Validations/Files.md
