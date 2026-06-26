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
| **Screenshots** | Attached inside `allure-results/` | Captured on failures by default; validation and every-action screenshots depend on `evidenceLevel` or granular screenshot policy |
| **Videos** | Generated under `video.folder`, attached inside `allure-results/` | When `evidenceLevel=CUSTOM` and `videoParams_recordVideo=true`, or when `evidenceLevel=FULL` |
| **Animated GIFs** | Generated under `video.folder`, attached inside `allure-results/` | When `evidenceLevel=CUSTOM` and `createAnimatedGif=true`, when `evidenceLevel=FULL`, or on retry evidence capture |
| **Failure trace viewer** | Attached inside `allure-results/` | `SHAFT Trace Report.html`, `shaft-trace.json`, and `shaft-trace.zip` on failed tests by default |
| **Failure brief** | Attached inside `allure-results/` | `SHAFT Failure Brief.html`, `shaft-failure-brief.json`, and `shaft-attachments-manifest.json` on failed or broken tests |

:::info
All paths are relative to your project root directory.
:::

---

## Allure Report

The Allure report is the **primary artifact** from every SHAFT test run. It contains:

- Step-by-step action logs
- Screenshots according to the selected evidence profile
- Video recordings and animated GIFs (when enabled)
- Failure trace viewer attachments for failed tests
- Failure brief and attachment manifest for first-pass triage
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
| `evidenceLevel` | `FAILURE_ONLY` | Profile-level evidence control. Profiles except `CUSTOM` override the granular controls below. |
| `screenshotParams_whenToTakeAScreenshot` | `ValidationPointsOnly` | Granular screenshot policy: `Always`, `ValidationPointsOnly`, `FailuresOnly`, or `Never` |
| `videoParams_recordVideo` | `false` | Granular video policy |
| `createAnimatedGif` | `false` | Granular GIF policy; retry attempts can enable GIFs automatically |
| `allure.generateArchive` | `false` | Generate a portable ZIP archive of the report |
| `shaft.trace.mode` | `failure` | Attach failure trace viewer artifacts on `failure`, `retry`, or `always` |

For the full list of reporting properties, see the
[Properties List](/docs/reference/properties/PropertiesList).

## Related

- [Solution Design](/docs/reference/guides/Solution_Design)
- [Test Structure](/docs/reference/guides/Test_Structure)
- [Ci Cd Integration](/docs/reference/guides/CI_CD_Integration)
- [Quick Start](/docs/start/quick-start)
