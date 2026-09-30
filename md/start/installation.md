# Install SHAFT

Generate a new SHAFT project or upgrade an existing automation project.

Canonical HTML: https://shafthq.github.io/docs/start/installation
Guide index: https://shafthq.github.io/llms.txt

# Install SHAFT

Use this page to get a SHAFT project running on your machine: check the
requirements, generate a project, run the first test, and confirm the report.
Adding SHAFT to an existing Maven project or upgrading an older suite is covered
further down.

## Requirements

## Create a new project

The **SHAFT Project Generator is the only recommended way to create a new
project**. Choose the test runner and testing surfaces you need, then download
the ready-to-run project.

 

:::tip Generator not visible?
Open the [SHAFT Project Generator in a new tab](/project-generator).
:::

The generated project includes the selected test runner, configuration, sample
tests, reporting setup, optional CI files, and shared IntelliJ IDEA run
configuration templates that use `@argFiles` for direct IDE runs.

Run the generated project from its root:

 

Expected first-run outcome:

- Maven downloads the selected SHAFT modules and test runner dependencies.
- The generated sample test runs with its default local configuration.
- SHAFT creates or refreshes runtime configuration under
 `src/main/resources/properties`.
- Evidence is written to .

If that works, before moving on. It is the shortest way to
find the framework again when your team starts expanding the suite.

Common first-run blockers:

| Symptom | Check |
|---|---|
| Java version error | Install the Java version listed in Requirements above. |
| Maven cannot resolve SHAFT | Check proxy settings, repository access, and Maven Central connectivity. |
| Browser session does not start | Confirm the selected browser is installed or use the generated headless defaults. |
| Report does not open automatically | Open the generated report from the project target output or rerun from an interactive desktop session. |
| Build passes but `Total: 0` tests ran | Your pom is missing the TestNG Surefire provider — see [Adding SHAFT to an existing Maven project](#adding-shaft-to-an-existing-maven-project) below. Generated projects already include it. |

## Adding SHAFT to an existing Maven project

Generated projects come pre-wired, but if you add the `shaft-engine` dependency
to a hand-written pom, one extra block is required: SHAFT ships the JUnit
Platform, so a bare pom makes Maven Surefire auto-detect the JUnit provider and
**silently run zero TestNG tests** (the build still "passes"). SHAFT prints a
loud warning when this happens. Configure Surefire with the TestNG provider
explicitly:

```xml
 
 
 
 org.apache.maven.plugins 
 maven-surefire-plugin 
 3.5.5 
 
 
 org.apache.maven.surefire 
 surefire-testng 
 3.5.5 
 
 
 
 
 
```

## Upgrade an existing project

Do not recreate or manually reconfigure an existing automation project. Use the
[automated upgrade tool](/docs/start/upgrade) for:

- Selenium projects
- Appium projects
- REST Assured projects
- Cucumber projects
- Projects using an older SHAFT version

The upgrader detects the project type, applies the modular SHAFT dependencies,
validates the result with Maven, and rolls back its changes if compilation
fails.

## Related

- [Quick start](/docs/start/quick-start)
- [Set up local infrastructure](/docs/start/local-infrastructure)
- [Upgrade an existing project](/docs/start/upgrade)
- [Features and modules](/docs/features/modules)
