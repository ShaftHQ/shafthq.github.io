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
`SHAFT_MCP-<version>.jar` has been downloaded from Maven Central or built from
the monorepo.

## No-AI Capture to TestNG

```bash
java -jar SHAFT_MCP-<version>.jar capture start \
  --url https://example.test --browser chrome \
  --output recordings/example.json --headless
java -jar SHAFT_MCP-<version>.jar capture status
java -jar SHAFT_MCP-<version>.jar capture stop
java -jar SHAFT_MCP-<version>.jar capture generate \
  --session recordings/example.json \
  --output-dir generated-tests --replay
```

## No-AI Doctor analysis

```bash
java -jar SHAFT_MCP-<version>.jar doctor analyze \
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

Download the credential-free MCP configurations:

- [Codex TOML](/examples/shaft-pilot/mcp/codex-config.toml)
- [Claude Desktop JSON](/examples/shaft-pilot/mcp/claude-desktop.json)
- [Gemini CLI JSON](/examples/shaft-pilot/mcp/gemini-settings.json)
- [GitHub Copilot / VS Code JSON](/examples/shaft-pilot/mcp/vscode-mcp.json)
- [Doctor chat invocations](/examples/shaft-pilot/mcp/doctor-analyze-invocations.json)
