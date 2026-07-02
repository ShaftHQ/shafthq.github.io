---
id: SSH_Terminal
title: SSH Remote Terminal
sidebar_label: SSH Terminal
description: "Execute commands on remote servers via SSH using SHAFT Engine's TerminalActions with the SSH constructor."
keywords: [SHAFT, SSH terminal, remote server, CLI, TerminalActions, SSH execution, remote commands, automation]
tags: [cli, terminal, ssh, remote]
---

SHAFT's `TerminalActions` class supports **SSH remote execution** natively. Use the `SHAFT.CLI.remoteTerminal(...)` facade for reusable SSH sessions, command execution, port forwarding, and SFTP transfers.

---

## Prerequisites

- The remote machine must be reachable from the test execution machine (check firewall rules and SSH port access).
- An SSH key pair must be available; **key-based authentication is the current shipped path** for the string-based `remoteTerminal(...)` overloads.
- The SSH private key file must be accessible to the test execution process.
- Keep **one JSch artifact** on the classpath. SHAFT ships [`com.github.mwiede:jsch`](https://github.com/mwiede/jsch); do not add the legacy `com.jcraft:jsch` coordinate alongside it.

For strict host-key validation, password auth, and keyboard-interactive flows, see [#3130](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3130) and the upcoming `SshConnectionOptions` guide update.

---

## Create an SSH Terminal

```java title="SshTerminalSetup.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

TerminalActions remote = SHAFT.CLI.remoteTerminal(
    "192.168.1.100",    // SSH host (IP or hostname)
    22,                 // SSH port (default: 22)
    "deploy-user",      // SSH username
    "~/.ssh/",          // Directory containing the private key
    "id_rsa"            // SSH private key file name
);
```

You can verify the terminal is connected as a remote SSH session:

```java title="VerifySshContext.java"
assertTrue(remote.isRemoteTerminal(),
    "Terminal should be connected to the remote server via SSH");
```

---

## Reusable Session Lifecycle

Create **one** `TerminalActions` instance, run multiple commands or transfers on it, then call `quit()` in teardown. `quit()` disconnects the reusable JSch session, cancels the idle-timeout task, and removes active port forwards.

```java title="ReusableRemoteSession.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

TerminalActions remote = SHAFT.CLI.remoteTerminal(
    System.getenv("TEST_SSH_HOST"),
    Integer.parseInt(System.getenv("TEST_SSH_PORT")),
    System.getenv("TEST_SSH_USERNAME"),
    System.getenv("TEST_SSH_KEY_FOLDER"),
    System.getenv("TEST_SSH_KEY_NAME"),
    true // optional verbose streaming of command output lines
);

try {
    String whoami = remote.performTerminalCommand("whoami");
    String withEnv = remote.performTerminalCommand(
        "sh -c 'printf %s $SHAFT_REMOTE_MARKER'",
        Map.of("SHAFT_REMOTE_MARKER", "docs-demo")
    );

    String remoteFile = remote.uploadFile("target/demo.txt", "/tmp/shaft-demo.txt");
    String localFile = remote.downloadFile(remoteFile, "target/ssh-demo/shaft-demo.txt");
    String localPort = remote.forwardLocalPort(0, "127.0.0.1", 22);

    SHAFT.Validations.assertThat().object(whoami).doesNotEqual("").perform();
    SHAFT.Validations.assertThat().object(withEnv).contains("docs-demo").perform();
    SHAFT.Validations.assertThat().object(localFile).contains("shaft-demo.txt").perform();
    SHAFT.Validations.assertThat().object(localPort).doesNotEqual("").perform();
} finally {
    remote.quit();
}
```

`TerminalActions` also implements `AutoCloseable`; `close()` delegates to `quit()` when you prefer try-with-resources.

---

## Execute Commands

### Single Command

```java title="SshSingleCommand.java"
// Check disk usage on the remote server
String diskUsage = remote.performTerminalCommand("df -h");

// Check available memory
String memory = remote.performTerminalCommand("free -m");

// View a remote configuration file
String config = remote.performTerminalCommand("cat /etc/app/config.yaml");
```

Each call returns the combined command output log for assertions and reporting.

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
```

### Environment Variables

Pass remote environment variables through the map overload:

```java title="SshCommandWithEnv.java"
import java.util.Map;

String output = remote.performTerminalCommand(
    "sh -c 'printf %s $APP_ENV'",
    Map.of("APP_ENV", "staging")
);
```

The SSH server must allow the variable names you send. OpenSSH servers typically require `AcceptEnv` entries in `sshd_config` (for example `AcceptEnv APP_ENV`). If the server rejects env requests, the command may run without the variable set.

### Verbose Streaming

Use the six-argument facade overload to log each output line while the remote command is still running:

```java title="VerboseRemoteTerminal.java"
TerminalActions remote = SHAFT.CLI.remoteTerminal(
    "192.168.1.100", 22, "deploy-user", "~/.ssh/", "id_rsa", true
);
```

---

## File Transfer

`TerminalActions` includes SFTP helpers for transferring files between the remote server and the local machine. Both methods return the destination path for assertions.

### Upload a Local File

```java title="SshUploadFile.java"
String remotePath = remote.uploadFile(
    "target/build/app.jar",
    "/tmp/app.jar"
);
// remotePath == "/tmp/app.jar"
```

Upload resolves the local source path through SHAFT file helpers. The remote destination must be writable by the SSH user.

### Download a Remote File

```java title="SshDownloadFile.java"
String localPath = remote.downloadFile(
    "/var/log/app/application.log",
    "target/logs/application.log"
);
// localPath is the absolute local destination path
```

When the local parent directory does not exist, SHAFT creates it before the download starts.

### Compute a Remote File Checksum

Use checksums to verify file integrity after deployments or transfers:

```java title="SshFileChecksum.java"
String checksum = SHAFT.CLI.file().getFileChecksum(
    remote,
    "/opt/app/",
    "build.jar"
);

SHAFT.Validations.assertThat()
    .object(checksum)
    .isEqualTo(expectedChecksum)
    .withCustomReportMessage("Deployed JAR checksum must match the expected build artifact");
```

---

## Port Forwarding

Port forwards are tied to the reusable SSH session and are removed automatically when `quit()` runs.

### Local Port Forward

Forward a local port through the SSH session to a remote host/port as seen from the SSH server:

```java title="ForwardLocalPort.java"
// Use 0 to let JSch assign an available local port
String localPort = remote.forwardLocalPort(0, "127.0.0.1", 8080);
```

The return value is the bound local port as a string.

### Remote Port Forward

Forward a remote port on the SSH server to a local host/port as seen from the SSH client machine:

```java title="ForwardRemotePort.java"
String remotePort = remote.forwardRemotePort(9000, "127.0.0.1", 3000);
```

Remote port forwarding may require server-side SSH configuration (`GatewayPorts`, `AllowTcpForwarding`, etc.).

---

## Timeouts and Keep-Alive

Two timeout properties affect reusable remote SSH sessions:

| Property | Default | Unit | Effect |
|---|---:|---|---|
| `shellSessionTimeout` | `30` | minutes | JSch channel timeout for SFTP/exec channels and local shell commands |
| `sshServerAliveInterval` | `60` | seconds | JSch `ServerAliveInterval`; values `<= 0` disable keep-alive packets |

Example `custom.properties` entries:

```properties title="src/main/resources/properties/custom.properties"
shellSessionTimeout=45
sshServerAliveInterval=120
```

Use keep-alive for long-running remote sessions so idle connections are not dropped by firewalls or SSH servers.

---

## JSch Compatibility Notes

SHAFT depends on the actively maintained [`com.github.mwiede:jsch`](https://github.com/mwiede/jsch) fork. It is API-compatible with legacy JSch but tracks modern OpenSSH algorithms.

Common connection issues:

- **Legacy `ssh-rsa` hosts** — older servers may require enabling RSA signatures in JSch config. Pass algorithm flags through `SshConnectionOptions.extraJschConfig(...)` when using the options overload ([#3130](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3130)).
- **Duplicate JSch artifacts** — exclude `com.jcraft:jsch` from transitive dependencies so only the mwiede coordinate remains.
- **Host key checking** — the string-based `remoteTerminal(...)` overloads currently disable strict host-key checking for backward compatibility. Use `SshConnectionOptions` with `knownHosts` and `strictHostKeyChecking(true)` when you need strict validation ([#3130](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3130)).

---

## Common Use Cases

### Verify Server State After Deployment

```java title="VerifyDeployment.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

@Test
void verifyApplicationDeployedSuccessfully() {
    TerminalActions remote = SHAFT.CLI.remoteTerminal(
        "prod-server.example.com", 22, "ci-user", "~/.ssh/", "id_rsa"
    );

    try {
        String processes = remote.performTerminalCommand("pgrep -a java");
        SHAFT.Validations.assertThat()
            .object(processes)
            .contains("app.jar")
            .withCustomReportMessage("Application process must be running on the remote server");

        String healthResponse = remote.performTerminalCommand(
            "curl -s http://localhost:8080/health"
        );
        SHAFT.Validations.assertThat()
            .object(healthResponse)
            .contains("\"status\":\"UP\"")
            .withCustomReportMessage("Application health endpoint must return UP status");
    } finally {
        remote.quit();
    }
}
```

### Collect Remote Logs as Test Evidence

```java title="CollectRemoteLogs.java"
TerminalActions remote = SHAFT.CLI.remoteTerminal(
    "test-server.example.com", 22, "testuser", "~/.ssh/", "id_rsa"
);

@AfterMethod
void collectLogs() {
    try {
        remote.downloadFile("/var/log/app/test-run.log", "target/logs/test-run.log");
        String recentLogs = remote.performTerminalCommand("tail -n 100 /var/log/app/test-run.log");
        SHAFT.Report.attach("text/plain", "Remote Application Logs (last 100 lines)", recentLogs);
    } finally {
        remote.quit();
    }
}
```

### Trigger Remote Scripts

```java title="TriggerRemoteScript.java"
TerminalActions remote = SHAFT.CLI.remoteTerminal(
    "build-server.example.com", 22, "build-user", "~/.ssh/", "id_rsa"
);

@BeforeClass
void prepareTestEnvironment() {
    String output = remote.performTerminalCommand("bash /opt/scripts/prepare-test-env.sh");
    SHAFT.Report.log("Remote environment setup output: " + output);
}

@AfterClass
void resetTestEnvironment() {
    try {
        remote.performTerminalCommand("bash /opt/scripts/reset-test-env.sh");
    } finally {
        remote.quit();
    }
}
```

### Check Remote Disk Space Before Tests

```java title="CheckDiskSpaceRemote.java"
TerminalActions remote = SHAFT.CLI.remoteTerminal(
    "192.168.1.50", 22, "ops-user", "~/.ssh/", "id_rsa"
);

@BeforeClass
void ensureSufficientDiskSpace() {
    try {
        String diskInfo = remote.performTerminalCommand(
            "df -BG /var/log | awk 'NR==2 {print $4}'"
        );
        int availableGB = Integer.parseInt(diskInfo.trim().replace("G", ""));

        SHAFT.Validations.assertThat()
            .number((double) availableGB)
            .isGreaterThanOrEquals(5.0)
            .withCustomReportMessage("Remote server must have at least 5 GB free on /var/log before running tests");
    } finally {
        remote.quit();
    }
}
```

---

## Best Practices

- **Use key-based authentication** — avoid embedding passwords in test code; use SSH key files stored securely outside the repository until the auth/options APIs you need are available ([#3130](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3130)).
- **Store key paths in properties or env vars** — reference credentials from environment variables in CI rather than hardcoding them:
  ```properties title="src/main/resources/properties/custom.properties"
  sshKeyFolderPath=~/.ssh/
  ```
- **Validate command output** — never silently discard return values; assert on meaningful substrings to detect unexpected failures.
- **Attach logs as evidence** — copy or tail remote log files and attach them to the Allure report when a test fails.
- **Always call `quit()` in teardown** — reusable sessions, port forwards, and idle-timeout tasks are cleaned up there.
- **Scope permissions** — use a dedicated CI/CD user with the minimum permissions required (read-only where possible).

---

## Related Pages

- [Terminal Actions](./Terminal_Actions.md) — Local terminal execution overview and common patterns.
- [Docker Terminal](./Docker_Terminal.md) — Execute commands inside running Docker containers.
- [File Actions](./File_Actions.md) — Copy files between local and remote/container filesystems.
