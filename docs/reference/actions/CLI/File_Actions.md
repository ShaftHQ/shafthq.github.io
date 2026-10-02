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

### readFile()

Reads and returns the complete contents of a file as a string.

```java title="ReadFile.java"
FileActions file = SHAFT.CLI.file();

String content = file.readFile("src/test/resources/testData/users.json");
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
                           .readFile("src/test/resources/testDataFiles/users.json");
    }

    @Test
    public void importUsersFromFile() {
        api.post("/users/import")
           .setRequestBody(usersPayload)
           .setContentType("application/json")
           .setTargetStatusCode(200);
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

SHAFT reports the target path and byte count for write operations; it does not attach raw byte payloads as action output.

**Practical example — save API response for later comparison:**

```java title="SaveResponseExample.java"
SHAFT.API api = new SHAFT.API("https://api.example.com");
api.get("/config").setTargetStatusCode(200);

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
        String content = file.readFile(DOWNLOAD_PATH);
        SHAFT.Validations.assertThat()
             .object(content)
             .isNotNull()
             .withCustomReportMessage("Downloaded report file should not be empty");
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
     .exists();

// Validate its content
SHAFT.Validations.assertThat()
     .file("target", "output.txt")
     .content().contains("Hello SHAFT");

// Clean up
file.deleteFile("target/output.txt");
```

For the full file validation API see the [File validations →](../Validations#file-validations) reference.

## Best Practices

- **Use relative paths** from the project root for portability across machines and CI environments.
- **Back up before modifying** — use `copyFile()` to save a copy before overwriting configuration files.
- **Clean up in teardown** — delete temporary files in `@AfterMethod` or `@AfterClass` to keep the workspace clean.
- **Never store secrets in files committed to version control** — use environment variables instead.

## More file actions {/* #more-file-actions */}

| Method | What it does |
| --- | --- |
| `createFile(String folderPath, String fileName)` / `createFolder(String folderPath)` | Creates an empty file or a folder. |
| `renameFile(String filePath, String newFileName)` | Renames a file in place. |
| `copyFolder(String sourceFolderPath, String destinationFolderPath)` / `deleteFolder(String folderPath)` | Copies or deletes a folder. |
| `copyFileFromJar(String sourceFolderPath, String destinationFolderPath, String fileName)` / `copyFolderFromJar(String sourceFolderPath, String destinationFolderPath)` | Extracts a file or folder from the running JAR's resources to disk. |
| `copyFileToLocalMachine(TerminalActions terminalSession, String targetFileFolderPath, String targetFileName, String... pathToTempDirectoryOnRemoteMachine)` | Copies a file from a remote or dockerized machine to the local machine and returns its local path. |
| `doesFileExist(String targetFile)` / `doesFileExist(String fileFolderName, String fileName, int numberOfRetries)` | Checks whether a file exists, optionally retrying. |
| `listFilesInDirectory(String targetDirectory)` / `listFilesInDirectory(String, TrueFileFilter)` / `listFilesInDirectory(TerminalActions, String)` | Returns the file names in a directory, locally or through a terminal session. |
| `getFileList(String targetDirectory)` | Returns the files in a directory as a `Collection<File>`. |
| `readFileAsByteArray(String path)` | Reads a file as bytes. |
| `readPDF(String relativeFilePath)` / `readPDF(String fileFolderName, String fileName)` | Extracts the text of a PDF file. |
| `zipFiles(String srcFolder, String destZipFile)` | Zips a folder and returns whether it succeeded. |
| `unpackArchive(URL url, String destinationFolderPath)` / `unpackArchive(File theFile, File targetDir)` | Downloads (when given a URL) and extracts an archive. |

## Related

- [Terminal Actions](/docs/reference/actions/CLI/Terminal_Actions)
- [Docker Terminal](/docs/reference/actions/CLI/Docker_Terminal)
- [CLI](/docs/testing/cli)
