---
id: examples
title: Pilot examples
description: Credential-free Capture, Doctor, repair, MCP, and provider examples.
slug: /agentic/examples
sidebar_position: 8
tags: [pilot, examples]
---

# Pilot examples

These examples contain no credentials and assume the thin `shaft-mcp` JAR and
runtime dependencies are on `MCP_CP`, with `MCP_MAIN` set to
`com.shaft.mcp.ShaftMcpApplication`.

## No-AI Capture to TestNG

```bash
java -cp "$MCP_CP" "$MCP_MAIN" capture start \
  --url https://example.test --browser chrome \
  --output recordings/example.json --headless
java -cp "$MCP_CP" "$MCP_MAIN" capture status
java -cp "$MCP_CP" "$MCP_MAIN" capture stop
java -cp "$MCP_CP" "$MCP_MAIN" capture generate \
  --session recordings/example.json \
  --output-dir generated-tests --replay
```

## No-AI Doctor analysis

```bash
java -cp "$MCP_CP" "$MCP_MAIN" doctor analyze \
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

Use the matching application installer in
[Connect shaft-mcp](/docs/agentic/mcp) instead of editing a client
configuration manually.

Download the credential-free Doctor example:

- [Doctor chat invocations](/examples/shaft-pilot/mcp/doctor-analyze-invocations.json)
