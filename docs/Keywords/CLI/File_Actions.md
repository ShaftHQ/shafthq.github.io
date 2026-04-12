---
id: File_Actions
title: File Actions
sidebar_label: File
description: "Manage files and directories programmatically — read, write, copy, move, and delete files using SHAFT Engine."
keywords: [SHAFT, file actions, file management, read file, write file, copy file, automation]
tags: [cli, file, actions]
---

## Getting a File Actions Instance

Use `SHAFT.CLI.file()` to get a `FileActions` instance:

```java title="FileActionsSetup.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.FileActions;

FileActions file = SHAFT.CLI.file();
```

You can also use the legacy `FileActions.getInstance()` in existing projects.

## Read File

### readFromFile()

Reads and returns the complete contents of a file as a string.

```java title="ReadFile.java"
FileActions file = SHAFT.CLI.file();

String content = file.readFromFile("src/test/resources/testData/users.json");
```

**Practical example — load test data before a test:**

```java title="LoadTestDataExample.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.FileActions;
import org.testng.annotations.*;

public class UserImportTest {
    private SHAFT.API api;
    private String usersPayload;

    @BeforeClass
    public void loadTestData() {
        usersPayload = SHAFT.CLI.file()
                           .readFromFile("src/test/resources/testDataFiles/users.json");
    }

    @Test
    public void importUsersFromFile() {
        api.post("/users/import")
           .setRequestBody(usersPayload)
           .setContentType("application/json")
           .setTargetStatusCode(200)
           .perform();
    }

    @BeforeMethod
    public void setUp() {
        api = new SHAFT.API("https://api.example.com");
    }
}
```

## Write to File

### writeToFile()

Writes content to a file. Creates the file (and parent directories) if they do not exist; overwrites if the file already exists.

```java title="WriteFile.java"
FileActions file = SHAFT.CLI.file();

file.writeToFile("target/reports/execution-summary.txt", "All 42 tests passed.");
```

**Practical example — save API response for later comparison:**

```java title="SaveResponseExample.java"
SHAFT.API api = new SHAFT.API("https://api.example.com");
api.get("/config").setTargetStatusCode(200).perform();

// Persist the baseline configuration
SHAFT.CLI.file().writeToFile("src/test/resources/baseline/config.json", api.getResponseBody());
```

## Copy File

### copyFile()

Copies a file from a source path to a destination path.

```java title="CopyFile.java"
FileActions file = SHAFT.CLI.file();

// Back up a config file before the test modifies it
file.copyFile("config/app.properties", "config/app.properties.bak");
```

## Delete File

### deleteFile()

Deletes the file at the specified path. Safe to call even if the file does not exist.

```java title="DeleteFile.java"
FileActions file = SHAFT.CLI.file();

// Clean up a temporary file after the test
file.deleteFile("target/temp/downloaded-report.pdf");
```

## Complete Example: Download, Validate, and Clean Up

```java title="src/test/java/tests/ReportDownloadTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.FileActions;
import org.openqa.selenium.By;
import org.testng.annotations.*;

public class ReportDownloadTest {
    private SHAFT.GUI.WebDriver driver;
    private FileActions file;
    private static final String DOWNLOAD_PATH = "target/downloads/report.pdf";

    @Test
    public void downloadAndVerifyReport() {
        driver.browser().navigateToURL("https://example.com/reports")
              .and().element().click(By.id("download-report-btn"));

        // Give the download a moment to complete, then read and validate
        String content = file.readFromFile(DOWNLOAD_PATH);
        SHAFT.Validations.assertThat()
             .object(content)
             .isNotNull()
             .withCustomReportMessage("Downloaded report file should not be empty")
             .perform();
    }

    @BeforeMethod
    public void setUp() {
        driver = new SHAFT.GUI.WebDriver();
        file   = SHAFT.CLI.file();
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
        file.deleteFile(DOWNLOAD_PATH);
    }
}
```

## File Path Handling

| Style | Example |
|-------|---------|
| **Relative (from project root)** | `src/test/resources/data.json` |
| **Relative (target output)** | `target/reports/result.txt` |
| **Absolute — Linux / macOS** | `/home/runner/work/data/file.txt` |
| **Absolute — Windows** | `C:\\Users\\user\\data\\file.txt` |

Use forward slashes (`/`) for cross-platform compatibility; Java handles them on Windows too.

## Integration with File Validations

File Actions pair naturally with SHAFT's file validation chain:

```java title="FileValidationIntegration.java"
FileActions file = SHAFT.CLI.file();

// Create a file
file.writeToFile("target/output.txt", "Hello SHAFT");

// Validate it exists
SHAFT.Validations.assertThat()
     .file("target", "output.txt")
     .exists()
     .perform();

// Validate its content
SHAFT.Validations.assertThat()
     .file("target", "output.txt")
     .content().contains("Hello SHAFT")
     .perform();

// Clean up
file.deleteFile("target/output.txt");
```

For the full file validation API see the [File Validations →](../Validations/Files.md) reference.

## Best Practices

- **Use relative paths** from the project root for portability across machines and CI environments.
- **Back up before modifying** — use `copyFile()` to save a copy before overwriting configuration files.
- **Clean up in teardown** — delete temporary files in `@AfterMethod` or `@AfterClass` to keep the workspace clean.
- **Never store secrets in files committed to version control** — use environment variables instead.
