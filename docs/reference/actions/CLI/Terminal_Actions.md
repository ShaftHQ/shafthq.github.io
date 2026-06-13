---
id: Terminal_Actions
title: Terminal Actions
sidebar_label: Terminal
description: "Execute terminal commands and shell scripts programmatically using SHAFT Engine's CLI terminal actions."
keywords: [SHAFT, terminal actions, CLI, command line, shell commands, automation]
tags: [cli, terminal, actions, shell]
---

## Getting a Terminal Instance

Use `SHAFT.CLI.terminal()` to get a `TerminalActions` instance:

```java title="TerminalSetup.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.TerminalActions;

TerminalActions terminal = SHAFT.CLI.terminal();
```

You can also instantiate directly for legacy projects: `new TerminalActions()`.

## Execute a Single Command

### executeCommand()

Executes a terminal command and returns the standard output as a string.

```java title="SingleCommand.java"
TerminalActions terminal = SHAFT.CLI.terminal();

String output = terminal.executeCommand("echo Hello SHAFT");
SHAFT.Validations.assertThat().object(output).contains("Hello SHAFT").perform();
```

**Linux / macOS:**
```java title="LinuxCommands.java"
String files   = terminal.executeCommand("ls -la /tmp");
String diskUse = terminal.executeCommand("df -h /");
String uptime  = terminal.executeCommand("uptime");
```

**Windows:**
```java title="WindowsCommands.java"
String dir       = terminal.executeCommand("dir C:\\");
String processes = terminal.executeCommand("tasklist");
```

## Execute Multiple Commands

### performTerminalCommands()

Executes a list of commands in sequence and returns the combined output.

```java title="MultipleCommands.java"
import java.util.Arrays;
import java.util.List;

TerminalActions terminal = SHAFT.CLI.terminal();

List<String> commands = Arrays.asList(
    "mkdir -p /tmp/shaft_test",
    "echo 'test data' > /tmp/shaft_test/data.txt",
    "cat /tmp/shaft_test/data.txt"
);
String output = terminal.performTerminalCommands(commands);
SHAFT.Validations.assertThat().object(output).contains("test data").perform();
```

## Common Use Cases

### Test Environment Setup and Teardown

```java title="EnvironmentLifecycle.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.TerminalActions;
import org.testng.annotations.*;

public class DatabaseSeedTest {
    private TerminalActions terminal;

    @BeforeClass
    public void setUp() {
        terminal = SHAFT.CLI.terminal();
        // Seed the database before the test class
        terminal.executeCommand("psql -U testuser -d testdb -f src/test/resources/seed.sql");
    }

    @Test
    public void verifyRecordsWereSeeded() {
        String result = terminal.executeCommand("psql -U testuser -d testdb -c \"SELECT COUNT(*) FROM users;\"");
        SHAFT.Validations.assertThat().object(result).contains("10").perform();
    }

    @AfterClass
    public void tearDown() {
        // Clean up test data
        terminal.executeCommand("psql -U testuser -d testdb -c \"DELETE FROM users WHERE email LIKE '%test%';\"");
    }
}
```

### Build and Deployment Validation

```java title="DeploymentTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.TerminalActions;
import org.testng.annotations.Test;

public class DeploymentTest {

    @Test
    public void applicationDeployedSuccessfully() {
        TerminalActions terminal = SHAFT.CLI.terminal();

        // Trigger deployment
        String deployOutput = terminal.executeCommand("./scripts/deploy.sh staging");
        SHAFT.Validations.assertThat()
             .object(deployOutput)
             .contains("Deployment successful")
             .withCustomReportMessage("Deploy script should report success")
             .perform();

        // Verify the service is running
        String healthCheck = terminal.executeCommand("curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/health");
        SHAFT.Validations.assertThat()
             .object(healthCheck)
             .isEqualTo("200")
             .withCustomReportMessage("Application health endpoint should return HTTP 200")
             .perform();
    }
}
```

### File System Validation

```java title="FileSystemValidation.java"
import com.shaft.driver.SHAFT;
import com.shaft.cli.TerminalActions;
import org.testng.annotations.Test;

public class FileSystemTest {

    @Test
    public void exportGeneratesCorrectFile() {
        TerminalActions terminal = SHAFT.CLI.terminal();

        // Trigger the export via your application's API or UI …
        // Then validate the generated file
        String exists = terminal.executeCommand("test -f /tmp/export.csv && echo 'found' || echo 'missing'");
        SHAFT.Validations.assertThat().object(exists).contains("found").perform();

        String lineCount = terminal.executeCommand("wc -l < /tmp/export.csv");
        SHAFT.Validations.assertThat()
             .object(lineCount.trim()).isNotNull().perform();
    }
}
```

## Cross-Platform Compatibility

| OS | Shell | Example command |
|----|-------|----------------|
| **Linux / macOS** | bash | `ls -la`, `chmod 755 script.sh`, `./deploy.sh` |
| **Windows** | cmd | `dir`, `tasklist`, `powershell -Command "..."` |

When writing cross-platform tests, guard with a platform check:

```java title="CrossPlatformCommand.java"
String os = System.getProperty("os.name").toLowerCase();
String listCmd = os.contains("win") ? "dir" : "ls -la";
String output = terminal.executeCommand(listCmd);
```

## Best Practices

- **Always capture and validate output** — don't fire-and-forget; check the command succeeded.
- **Use absolute paths** — relative paths depend on the working directory and are fragile.
- **Avoid secrets in commands** — use environment variables rather than inline passwords.
- **Clean up after yourself** — delete temporary files and directories in `@AfterMethod` / `@AfterClass`.
- **Check for error keywords** — scan output for `error`, `failed`, or non-zero exit signals.
