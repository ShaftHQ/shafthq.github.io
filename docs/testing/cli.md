---
id: cli
title: CLI testing
description: Execute and validate local, Docker, and SSH commands with SHAFT.
slug: /testing/cli
sidebar_position: 4
tags: [cli, terminal, docker, ssh]
---

# CLI testing

SHAFT provides terminal, Docker, SSH, and file actions with the same reporting
model used by browser and API tests.

```mermaid
flowchart LR
    Test --> Terminal["Terminal action"]
    Terminal --> Local["Local process"]
    Terminal --> Docker["Docker"]
    Terminal --> SSH["SSH"]
    Local --> Report["Allure evidence"]
    Docker --> Report
    SSH --> Report
```

Open the [terminal actions reference](/docs/reference/actions/CLI/Terminal_Actions)
for executable examples and result handling.
