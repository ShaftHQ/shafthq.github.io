---
id: Docker_Terminal
title: Docker Container Terminal
sidebar_label: Docker Terminal
description: "Execute commands inside running Docker containers using SHAFT Engine's TerminalActions with the Docker constructor."
keywords: [SHAFT, docker terminal, container commands, CLI, TerminalActions, docker exec, automation]
tags: [cli, terminal, docker, containers]
---

SHAFT's `TerminalActions` class supports **Docker container execution** out of the box. Using the Docker-specific constructor, you can run shell commands inside any running container and capture the output — no external tooling required.

---

## Prerequisites

- Docker must be installed and running on the test execution machine.
- The target container must already be running before `TerminalActions` is instantiated.

---

## Create a Docker Terminal

Pass the container name (or container ID) and the user to run commands as:

```java title="DockerTerminalSetup.java"
import com.shaft.cli.TerminalActions;

// Connect to a running container named "my-app-container" as root
TerminalActions docker = new TerminalActions("my-container-name", "root");
```

You can verify that the terminal is operating inside a Docker container:

```java title="VerifyDockerContext.java"
assertTrue(docker.isDockerizedTerminal(),
    "Terminal should be connected to the Docker container");
```

---

## Execute Commands

### Single Command

```java title="DockerSingleCommand.java"
// List files in the application directory
String listing = docker.performTerminalCommand("ls -la /app");
System.out.println(listing);

// Read a configuration file
String config = docker.performTerminalCommand("cat /app/config/application.yml");

// Check a running process
String processes = docker.performTerminalCommand("ps aux | grep java");
```

### Multiple Commands in Sequence

```java title="DockerMultipleCommands.java"
import java.util.List;

String result = docker.performTerminalCommands(
    List.of(
        "cd /app",
        "cat config.json",
        "ls logs/"
    )
);
System.out.println(result);
```

---

## Common Use Cases

### Validate Application State Inside a Container

```java title="ValidateContainerState.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

@Test
void verifyApplicationHealthInsideContainer() {
    TerminalActions docker = new TerminalActions("backend-service", "root");

    // Check that the application process is running
    String processes = docker.performTerminalCommand("ps aux | grep java");
    SHAFT.Validations.assertThat()
        .object(processes)
        .contains("java")
        .withCustomReportMessage("Java process must be running inside the backend container")
        .perform();
}
```

### Verify a Log File

```java title="VerifyContainerLogs.java"
TerminalActions docker = new TerminalActions("my-app", "root");

// Tail the last 50 lines of the application log
String logs = docker.performTerminalCommand("tail -n 50 /var/log/app/application.log");

SHAFT.Validations.assertThat()
    .object(logs)
    .doesNotContain("ERROR")
    .withCustomReportMessage("No ERROR entries should appear in the last 50 log lines")
    .perform();
```

### Read a Generated File from the Container

```java title="ReadFileFromContainer.java"
TerminalActions docker = new TerminalActions("report-generator", "root");

// Trigger report generation inside the container
docker.performTerminalCommand("./generate-report.sh");

// Read the generated report content
String reportContent = docker.performTerminalCommand("cat /tmp/report.json");

// Attach to Allure report for evidence
SHAFT.Report.attach("application/json", "Generated Report", reportContent);
```

### Database Seed / Cleanup via Container

```java title="ContainerDatabaseOps.java"
TerminalActions docker = new TerminalActions("postgres-db", "postgres");

@BeforeMethod
void seedDatabase() {
    docker.performTerminalCommand("psql -U testuser -d testdb -f /scripts/seed.sql");
}

@AfterMethod
void cleanupDatabase() {
    docker.performTerminalCommand("psql -U testuser -d testdb -c 'TRUNCATE TABLE users CASCADE;'");
}
```

---

## Combining Docker Terminal with SHAFT.API

Use Docker terminal commands to prepare the environment, then validate the results through the application API:

```java title="ContainerAndApiTest.java"
import com.shaft.cli.TerminalActions;
import com.shaft.driver.SHAFT;

@Test
void createUserViaDbAndVerifyThroughApi() {
    // Insert a user directly into the database container
    TerminalActions db = new TerminalActions("postgres-db", "postgres");
    db.performTerminalCommand(
        "psql -U testuser -d testdb -c " +
        "\"INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');\""
    );

    // Verify through the REST API
    SHAFT.API api = new SHAFT.API("https://api.example.com");
    api.get("/users?email=test@example.com")
       .setTargetStatusCode(200)
       .performRequest();

    api.assertThatResponse()
        .extractedJsonValue("$[0].name")
        .isEqualTo("Test User")
        .withCustomReportMessage("Newly created user should be retrievable via the API")
        .perform();
}
```

---

## Best Practices

- **Use specific container names** — avoid relying on container IDs which change between runs; use named containers in your `docker-compose.yml`.
- **Scope your user** — run as the least-privileged user that can execute the required commands.
- **Capture and validate output** — always store command output in a variable and assert on it rather than ignoring the return value.
- **Attach output as evidence** — use `SHAFT.Report.attach()` to include command output in the Allure report for traceability.
- **Ensure idempotency** — teardown commands in `@AfterMethod` should be safe to run even if the test failed mid-way.

---

## Related Pages

- [Terminal Actions](./Terminal_Actions.md) — Local terminal execution overview and common patterns.
- [SSH Remote Terminal](./SSH_Terminal.md) — Execute commands on remote servers via SSH.
- [File Actions](./File_Actions.md) — Copy files between local and remote/container filesystems.
