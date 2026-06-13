---
id: reporting
title: Reporting and evidence
description: How SHAFT records actions, screenshots, logs, and Allure results.
slug: /features/reporting
sidebar_position: 3
tags: [reporting, allure, screenshots, evidence]
---

# Reporting and evidence

SHAFT records test actions as structured Allure steps and attaches the evidence
needed to understand failures.

```mermaid
flowchart LR
    Action["Test action"] --> Step["Allure step"]
    Step --> Logs["Logs"]
    Step --> Screenshot["Screenshot when relevant"]
    Step --> Request["API / command evidence"]
    Logs --> Result["allure-results"]
    Screenshot --> Result
    Request --> Result
    Result --> Report["Allure report"]
    Result --> Doctor["SHAFT Doctor"]
```

Use [reporting configuration](/docs/reference/reporting) and
[custom report messages](/docs/reference/reporting/Custom_Report_Messages) for
detailed controls.
