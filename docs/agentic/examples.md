---
id: examples
title: Pilot examples
description: Credential-free Capture, Doctor, repair, MCP, and provider examples.
slug: /agentic/examples
sidebar_position: 8
tags: [pilot, examples]
---

# Pilot examples

These examples contain no credentials and assume the executable
`shaft-mcp-<version>.jar` has been downloaded from Maven Central or built from
the monorepo.

## No-AI Capture to TestNG

```bash
java -jar shaft-mcp-<version>.jar capture start \
  --url https://example.test --browser chrome \
  --output recordings/example.json --headless
java -jar shaft-mcp-<version>.jar capture status
java -jar shaft-mcp-<version>.jar capture stop
java -jar shaft-mcp-<version>.jar capture generate \
  --session recordings/example.json \
  --output-dir generated-tests --replay
```

## No-AI Doctor analysis

```bash
java -jar shaft-mcp-<version>.jar doctor analyze \
  --input allure-results --allowed-root "$PWD" \
  --output-dir target/shaft-doctor
```

## Optional local Ollama advisory

Load [`providers/ollama.properties`](/examples/shaft-pilot/providers/ollama.properties)
as SHAFT properties, start Ollama locally,
and add `--ai` to the Doctor command. The deterministic diagnosis remains the
baseline if Ollama is unavailable or returns invalid output.

## Reviewed repair proposal

Use [`doctor/repair-input.json`](/examples/shaft-pilot/doctor/repair-input.json)
only after replacing its paths and content with a
reviewed change. `doctor propose-fix` creates an isolated worktree and does not
publish to GitHub. Publishing requires a second command with the exact approval
token returned by the proposal.

Use the single self-configuring prompt in
[Connect shaft-mcp](/docs/agentic/mcp) instead of editing a client
configuration manually.

Download the credential-free Doctor example:

- [Doctor chat invocations](/examples/shaft-pilot/mcp/doctor-analyze-invocations.json)
