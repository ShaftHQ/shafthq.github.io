---
id: overview
title: Maintainer runbooks
description: Build, release, CI, agent guidance, and repository maintenance procedures.
slug: /maintainers/overview
sidebar_position: 1
tags: [maintainers, release, ci]
---

# Maintainer runbooks

These pages document repository operations. They are not required to consume
SHAFT as a test framework.

- [Maven reactor](/docs/maintainers/reactor)
- [Documentation site operations](/docs/maintainers/site-operations)
- [Maven Central publication](/docs/maintainers/publication)
- [Pilot release](/docs/maintainers/pilot-release)
- [MCP publication and deployment](/docs/maintainers/mcp-deployment)
- [CI failure investigation](/docs/maintainers/ci-failure-investigation)
- [Agent guidance maintenance](/docs/maintainers/agent-guidance)
- [Agent tooling](/docs/maintainers/agent-tooling)
- [Visual provider boundary](/docs/maintainers/visual-provider)
- [Repository history rewrite](/docs/maintainers/history-rewrite)

## Repository-local operating contracts

Volatile instructions stay beside the scripts and configuration they govern.
Use these source files instead of copying their inventories into this guide:

- [Agent skills map](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/.agents/skills/README.md)
- [GitHub Actions workflow inventory](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/.github/workflows/README.md)
- [SHAFT skill evaluation contract](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/agent-plugins/shaft-skills/evals/README.md)
- [IntelliJ capture validation runbook](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/tools/intellij-plugin-recording/README.md)
- [Graphify repository-map runbook](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/tools/repository-map/README.md)
