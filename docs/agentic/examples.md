---
id: examples
title: Pilot examples
description: Credential-free Capture, Doctor, repair, MCP, and provider examples.
slug: /agentic/examples
sidebar_position: 8
tags: [pilot, examples]
---

# Pilot examples

Use the canonical [MCP command reference](/docs/agentic/mcp#mcp-command-reference)
for Capture, Doctor, repair, and Streamable HTTP commands. This page keeps the
example assets and review boundaries in one place without duplicating runnable
MCP commands.

```text
MCP commands live on /docs/agentic/mcp#mcp-command-reference
```

## No-AI Capture to TestNG

Follow the Capture commands on [Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference),
then review the generated Java source, externalized data, and generation
report before committing anything.

## No-AI Doctor analysis

Use the Doctor command on [Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference).
The output remains credential-free and deterministic unless a provider is
explicitly enabled.

## Optional local Ollama advisory

Load [`providers/ollama.properties`](/examples/shaft-pilot/providers/ollama.properties)
as SHAFT properties and enable provider analysis only after reviewing the
[provider controls](/docs/agentic/providers). The deterministic diagnosis
remains the baseline if Ollama is unavailable or returns invalid output.

## Reviewed repair proposal

Use [`doctor/repair-input.json`](/examples/shaft-pilot/doctor/repair-input.json)
only after replacing its paths and content with a reviewed change. Doctor repair
creates an isolated worktree and does not publish to GitHub without a separate
approval token.

Download the credential-free Doctor example:

- [Doctor chat invocations](/examples/shaft-pilot/mcp/doctor-analyze-invocations.json)

## Related

- [Overview](/docs/agentic/overview)
- [MCP](/docs/agentic/mcp)
- [Pilot](/docs/agentic/pilot)
- [Doctor](/docs/agentic/doctor)
