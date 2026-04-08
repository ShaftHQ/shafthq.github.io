---
id: CI_CD_Integration
title: "Running Tests in CI/CD Pipelines"
sidebar_label: CI/CD Integration
description: "How to run SHAFT Engine tests in CI/CD pipelines — configuring properties, headless execution, and pipeline integration tips."
keywords: [SHAFT, CI/CD, continuous integration, pipeline, Jenkins, GitHub Actions, headless, Maven, properties]
tags: [best-practices, cicd, pipeline, jenkins, github-actions]
---

Running your SHAFT tests in a CI/CD pipeline is straightforward. SHAFT's [property system](../Properties/PropertyTypes) lets you override any configuration from the command line, making it easy to adapt tests for unattended pipeline execution.

---

## Basic Pipeline Command

The simplest way to run SHAFT tests in any CI/CD system is with Maven:

```bash title="Pipeline command"
mvn -e test \
  -DheadlessExecution=true \
  -Dallure.automaticallyOpen=false \
  -Dallure.generateArchive=true
```

| Property | Why |
|---|---|
| `headlessExecution=true` | No display available in CI — run the browser without a GUI |
| `allure.automaticallyOpen=false` | Do not try to open a browser to show the report |
| `allure.generateArchive=true` | Generate a portable ZIP of the Allure report for artifact publishing |

---

## Recommended CI/CD Properties

Create a `custom.properties` file with sensible defaults for CI, then override individual values from the CLI as needed:

```properties title="src/main/resources/properties/custom.properties"
# CI/CD defaults
headlessExecution=true
allure.automaticallyOpen=false
allure.generateArchive=true
retryMaximumNumberOfAttempts=2
createAnimatedGif=false
videoParams_recordVideo=false
```

:::info
Remember the [property priority hierarchy](../Properties/PropertyTypes): **Code-based > CLI-based > File-based > Defaults**. CLI parameters always override file-based values, so your pipeline can fine-tune any property.
:::

---

## GitHub Actions Example

```yaml title=".github/workflows/tests.yml"
name: Run Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Run tests
        run: |
          mvn -e test \
            -DheadlessExecution=true \
            -Dallure.automaticallyOpen=false \
            -Dallure.generateArchive=true

      - name: Upload Allure report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: allure-report-archive/
```

---

## Jenkins Pipeline Example

```groovy title="Jenkinsfile"
pipeline {
    agent any
    tools {
        maven 'Maven-3.9'
        jdk 'JDK-21'
    }
    stages {
        stage('Test') {
            steps {
                sh '''
                    mvn -e test \
                      -DheadlessExecution=true \
                      -Dallure.automaticallyOpen=false \
                      -Dallure.generateArchive=true
                '''
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'allure-report-archive/**', allowEmptyArchive: true
        }
    }
}
```

---

## Running Specific Tests

Use Maven Surefire parameters to control which tests run:

```bash title="Run a specific test class"
mvn test -Dtest=LoginTest
```

```bash title="Run a specific method"
mvn test -Dtest=LoginTest#testValidLogin
```

```bash title="Run all tests in a package"
mvn test -Dtest="com.example.tests.**"
```

---

## Parameterizing for Multiple Environments

Use CI/CD pipeline variables to switch between environments:

```bash title="Parameterized execution"
mvn test \
  -DbaseURL=${TARGET_URL} \
  -DtargetBrowserName=${BROWSER} \
  -DexecutionAddress=${GRID_URL} \
  -DtargetOperatingSystem=${OS}
```

This lets you run the same test suite against staging, production, or different browser/OS combinations by changing pipeline variables.

---

## Best Practices

1. **Always use headless mode** in pipelines — there is no display server.
2. **Disable auto-opening reports** — set `allure.automaticallyOpen=false`.
3. **Generate report archives** — use `allure.generateArchive=true` and publish them as pipeline artifacts.
4. **Set retry attempts** — `retryMaximumNumberOfAttempts=2` helps with flaky tests in CI environments.
5. **Parameterize everything** — use CLI properties so the same test suite works across environments.
6. **Archive test artifacts** — always upload reports and logs, even on failure (use `if: always()` in GitHub Actions or `post { always { } }` in Jenkins).
