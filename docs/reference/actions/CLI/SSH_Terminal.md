---
id: SSH_Terminal
title: SSH Remote Terminal
sidebar_label: SSH Terminal
description: "Execute commands on remote servers via SSH using SHAFT Engine's TerminalActions with the SSH constructor."
keywords: [SHAFT, SSH terminal, remote server, CLI, TerminalActions, SSH execution, remote commands, automation]
tags: [cli, terminal, ssh, remote]
---

SHAFT's `TerminalActions` class supports **SSH remote execution** natively. Using the SSH-specific constructor, you can connect to any remote machine, run shell commands, and transfer files — all from within your test code.

---

## Prerequisites

- The remote machine must be reachable from the test execution machine (check firewall rules and SSH port access).
- An SSH key pair must be available; SHAFT uses key-based authentication.
- The SSH private key file must be accessible to the test execution process.

---

## Create an SSH Terminal

```java title="SshTerminalSetup.java"
import com.shaft.cli.TerminalActions;

TerminalActions remote = new TerminalActions(
    "192.168.1.100",    // SSH host (IP or hostname)
    22,                 // SSH port (default: 22)
    "deploy-user",      // SSH username
    "~/.ssh/",          // Directory containing the private key
    false               // isKeyRecursive — set to true for recursive key search
);
```

You can verify the terminal is connected as a remote SSH session:

```java title="VerifySshContext.java"
assertTrue(remote.isRemoteTerminal(),
    "Terminal should be connected to the remote server via SSH");
```

---

## Execute Commands

### Single Command

```java title="SshSingleCommand.java"
// Check disk usage on the remote server
String diskUsage = remote.performTerminalCommand("df -h");
System.out.println(diskUsage);

// Check available memory
String memory = remote.performTerminalCommand("free -m");

// View a remote configuration file
String config = remote.performTerminalCommand("cat /etc/app/config.yaml");
```

### Multiple Commands in Sequence

```java title="SshMultipleCommands.java"
import java.util.List;

String result = remote.performTerminalCommands(
    List.of(
        "cd /opt/app",
        "./health-check.sh",
        "tail -n 20 /var/log/app.log"
    )
);
System.out.println(result);
```

---

## File Transfer

SHAFT's `FileActions` class integrates with SSH terminals to transfer files between the remote server and the local machine.

### Download a File from the Remote Server

```java title="SshDownloadFile.java"
import com.shaft.cli.TerminalActions;
import com.shaft.tools.io.FileActions;

TerminalActions remote = new TerminalActions(
    "192.168.1.100", 22, "deploy-user", "~/.ssh/", false
);

// Copy a remote log file to the local target directory
FileActions.getInstance().copyFileToLocalMachine(
    remote,
    "/var/log/app/application.log",   // remote file path
    "target/logs/"                     // local destination directory
);
```

### Compute a Remote File Checksum

Use checksums to verify file integrity after deployments or transfers:

```java title="SshFileChecksum.java"
String checksum = FileActions.getInstance().getFileChecksum(
    remote,
    "/opt/app/build.jar",   // remote file path
    "SHA-256"               // algorithm
);

SHAFT.Validations.assertThat()
    .object(checksum)
    .isEqualTo(expectedChecksum)
    .withCustomReportMessage("Deployed JAR checksum must match the expected build artifact")
    .perform();
```

---

## Common Use Cases

### Verify Server State After Deployment

```java title="VerifyDeployment.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

@Test
void verifyApplicationDeployedSuccessfully() {
    TerminalActions remote = new TerminalActions(
        "prod-server.example.com", 22, "ci-user", "~/.ssh/", false
    );

    // Check the process is running
    String processes = remote.performTerminalCommand("pgrep -a java");
    SHAFT.Validations.assertThat()
        .object(processes)
        .contains("app.jar")
        .withCustomReportMessage("Application process must be running on the remote server")
        .perform();

    // Check the health endpoint is responding locally on the server
    String healthResponse = remote.performTerminalCommand(
        "curl -s http://localhost:8080/health"
    );
    SHAFT.Validations.assertThat()
        .object(healthResponse)
        .contains("\"status\":\"UP\"")
        .withCustomReportMessage("Application health endpoint must return UP status")
        .perform();
}
```

### Collect Remote Logs as Test Evidence

```java title="CollectRemoteLogs.java"
TerminalActions remote = new TerminalActions(
    "test-server.example.com", 22, "testuser", "~/.ssh/", false
);

@AfterMethod
void collectLogs() {
    // Download the log file from the remote server
    FileActions.getInstance().copyFileToLocalMachine(
        remote,
        "/var/log/app/test-run.log",
        "target/logs/"
    );

    // Also attach recent log tail directly to the Allure report
    String recentLogs = remote.performTerminalCommand("tail -n 100 /var/log/app/test-run.log");
    SHAFT.Report.attach("text/plain", "Remote Application Logs (last 100 lines)", recentLogs);
}
```

### Trigger Remote Scripts

```java title="TriggerRemoteScript.java"
TerminalActions remote = new TerminalActions(
    "build-server.example.com", 22, "build-user", "~/.ssh/", false
);

@BeforeClass
void prepareTestEnvironment() {
    // Run a setup script on the remote server
    String output = remote.performTerminalCommand("bash /opt/scripts/prepare-test-env.sh");
    SHAFT.Report.log("Remote environment setup output: " + output);
}

@AfterClass
void resetTestEnvironment() {
    remote.performTerminalCommand("bash /opt/scripts/reset-test-env.sh");
}
```

### Check Remote Disk Space Before Tests

```java title="CheckDiskSpaceRemote.java"
TerminalActions remote = new TerminalActions(
    "192.168.1.50", 22, "ops-user", "~/.ssh/", false
);

@BeforeClass
void ensureSufficientDiskSpace() {
    // Get available disk space for /var/log partition
    String diskInfo = remote.performTerminalCommand(
        "df -BG /var/log | awk 'NR==2 {print $4}'"
    );
    int availableGB = Integer.parseInt(diskInfo.trim().replace("G", ""));

    SHAFT.Validations.assertThat()
        .number((double) availableGB)
        .isGreaterThanOrEquals(5.0)
        .withCustomReportMessage("Remote server must have at least 5 GB free on /var/log before running tests")
        .perform();
}
```

---

## Best Practices

- **Use key-based authentication** — avoid embedding passwords in test code; use SSH key files stored securely outside the repository.
- **Store key paths in properties** — reference the key folder via a SHAFT property or environment variable rather than hardcoding it:
  ```properties title="src/main/resources/properties/custom.properties"
  sshKeyFolderPath=~/.ssh/
  ```
- **Validate command output** — never silently discard return values; assert on meaningful substrings to detect unexpected failures.
- **Attach logs as evidence** — copy or tail remote log files and attach them to the Allure report when a test fails.
- **Close sessions explicitly** — if your tests create long-lived SSH sessions, ensure they are closed in teardown to avoid connection exhaustion.
- **Scope permissions** — use a dedicated CI/CD user with the minimum permissions required (read-only where possible).

---

## Related Pages

- [Terminal Actions](./Terminal_Actions.md) — Local terminal execution overview and common patterns.
- [Docker Terminal](./Docker_Terminal.md) — Execute commands inside running Docker containers.
- [File Actions](./File_Actions.md) — Copy files between local and remote/container filesystems.
