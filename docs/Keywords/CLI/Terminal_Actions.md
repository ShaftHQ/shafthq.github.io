---
id: Terminal_Actions
title: Terminal Actions
sidebar_label: Terminal
---

## Terminal / CLI Driver

-   In order to interact with the command line interface (CLI) and execute terminal commands, you will need an instance of TerminalActions

```java
import com.shaft.cli.TerminalActions;

TerminalActions terminal = new TerminalActions();
```

Upon executing this line, SHAFT ENGINE will prepare the terminal automation environment. You can then execute shell commands, batch files, or any command-line operations as part of your automated test flows.

## Terminal Actions

The TerminalActions class handles command-line interface automation, allowing you to execute commands and validate their outputs.

## Execute Single Command

### executeCommand

```java
String result = terminal.executeCommand("echo Hello SHAFT");
```

-   Executes a single terminal command and returns the output as a string.
-   You can use this method to run any OS-level command such as bash commands on Linux/Mac or CMD commands on Windows.
-   The command output is captured and can be used for validation or further processing.

**Example - Linux/Mac:**
```java
String result = terminal.executeCommand("ls -la");
System.out.println(result); // Prints directory listing
```

**Example - Windows:**
```java
String result = terminal.executeCommand("dir");
System.out.println(result); // Prints directory listing
```

## Execute Multiple Commands

### performTerminalCommands

```java
List<String> commands = Arrays.asList(
    "mkdir test_folder",
    "echo Test content > test_folder/test.txt"
);
String output = terminal.performTerminalCommands(commands);
```

-   Executes multiple terminal commands in sequence.
-   Takes a list of command strings and executes them one after another.
-   Returns the combined output from all executed commands.
-   Useful for batch operations or complex setup/teardown procedures.

## Common Use Cases

### Setup and Teardown

You can use terminal actions to prepare the test environment or clean up after tests:

```java
@BeforeMethod
void setupEnvironment() {
    terminal.executeCommand("mkdir -p test_data");
    terminal.executeCommand("chmod 755 test_data");
}

@AfterMethod
void cleanupEnvironment() {
    terminal.executeCommand("rm -rf test_data");
}
```

### Validation

Validate system states or file operations:

```java
@Test
void validateFileCreation() {
    // Create a file through application
    app.createFile("output.txt");
    
    // Validate using terminal
    String result = terminal.executeCommand("ls output.txt");
    Assert.assertTrue(result.contains("output.txt"));
}
```

### DevOps Integration

Execute infrastructure scripts or DevOps commands:

```java
@Test
void deployApplication() {
    String result = terminal.executeCommand("./deploy.sh production");
    Assert.assertTrue(result.contains("Deployment successful"));
}
```

## Cross-Platform Compatibility

SHAFT ENGINE's terminal actions work across different operating systems:

-   **Linux/Mac**: Execute bash commands, shell scripts
-   **Windows**: Execute CMD commands, PowerShell scripts, batch files

Make sure to use appropriate commands for your target operating system, or implement platform-specific logic when needed.

## Best Practices

-   **Capture Output**: Always capture and validate command output for better test reliability
-   **Error Handling**: Check for error messages in command output
-   **Permissions**: Ensure your test execution environment has necessary permissions
-   **Platform Awareness**: Consider OS differences when writing cross-platform tests
-   **Timeouts**: Be aware that long-running commands may need additional timeout configuration

As you skim through the console output, you will notice the awesome reporting SHAFT provides for each performed action, including terminal command execution and results.

[reporting]: #
