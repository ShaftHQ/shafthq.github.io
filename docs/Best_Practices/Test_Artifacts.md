---
id: Test_Artifacts
title: "Test Artifacts and Report Paths"
sidebar_label: Test Artifacts
description: "Where to find SHAFT Engine test artifacts — Allure reports, execution summaries, and how to publish them from CI/CD pipelines."
keywords: [SHAFT, test artifacts, allure report, execution summary, CI/CD artifacts, report paths, archive]
tags: [best-practices, reporting, artifacts, cicd]
---

After a test run, SHAFT generates several artifacts that you can use for debugging, reporting, and auditing. This page explains where to find them and how to publish them from your CI/CD pipeline.

---

## Artifact Locations

| Artifact | Path | Description |
|---|---|---|
| **Allure results** | `allure-results/` | Raw Allure result files (JSON, attachments) |
| **Allure report** | `allure-report/` | Generated HTML report (after `generate_allure_report.sh`) |
| **Allure archive** | `allure-report-archive/` | Portable ZIP when `allure.generateArchive=true` |
| **Execution summary** | `execution-summary/` | Lightweight HTML summary report |
| **Screenshots** | Attached inside `allure-results/` | Automatically captured on validation and failure |
| **Videos** | Attached inside `allure-results/` | When `videoParams_recordVideo=true` |
| **Animated GIFs** | Attached inside `allure-results/` | When `createAnimatedGif=true` |

:::info
All paths are relative to your project root directory.
:::

---

## Allure Report

The Allure report is the **primary artifact** from every SHAFT test run. It contains:

- Step-by-step action logs
- Screenshots attached at each validation point
- Video recordings and animated GIFs (when enabled)
- Test history and trend graphs across multiple runs
- Environment metadata

### Generating the Report Locally

SHAFT writes convenience scripts to your project root on first run:

```bash title="macOS / Linux"
./generate_allure_report.sh
```

```bash title="Windows"
generate_allure_report.bat
```

### Generating a Portable Archive for CI/CD

Enable the archive property to create a ZIP file you can publish as a pipeline artifact:

```properties title="src/main/resources/properties/custom.properties"
allure.generateArchive=true
allure.automaticallyOpen=false
```

The archive is written to `allure-report-archive/` and contains a self-contained HTML report.

---

## Execution Summary

The execution summary is a lightweight, fast HTML report. Enable it with:

```properties title="src/main/resources/properties/custom.properties"
openExecutionSummaryReportAfterExecution=true
```

The generated file is written to the `execution-summary/` directory.

---

## Publishing Artifacts in CI/CD

### GitHub Actions

```yaml title=".github/workflows/tests.yml"
- name: Upload Allure report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report-archive/

- name: Upload execution summary
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: execution-summary
    path: execution-summary/
```

### Jenkins

```groovy title="Jenkinsfile"
post {
    always {
        archiveArtifacts artifacts: 'allure-report-archive/**', allowEmptyArchive: true
        archiveArtifacts artifacts: 'execution-summary/**', allowEmptyArchive: true
    }
}
```

:::tip
Always use `if: always()` (GitHub Actions) or `post { always { } }` (Jenkins) so that artifacts are uploaded even when tests fail — that is when you need them the most.
:::

---

## Controlling What Gets Captured

| Property | Default | Description |
|---|---|---|
| `screenshotParams_whenToTakeAScreenshot` | `ValidationPointsOnly` | `Always`, `ValidationPointsOnly`, or `Never` |
| `videoParams_recordVideo` | `false` | Record video of each test session |
| `createAnimatedGif` | `false` | Create an animated GIF from captured screenshots |
| `allure.generateArchive` | `false` | Generate a portable ZIP archive of the report |

For the full list of reporting properties, see the [Properties List](../Properties/PropertiesList.mdx) page.
