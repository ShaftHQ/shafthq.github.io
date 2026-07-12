---
id: cli
title: shaft-cli command line
description: Run all shaft-mcp tools from the command line with one-shot commands or a persistent session.
slug: /agentic/cli
sidebar_position: 3
tags: [cli, mcp, agents, guide, capture, doctor]
---

# shaft-cli command line

`shaft-cli` is an MCP client and command-line interface to
[shaft-mcp](/docs/agentic/mcp). It brings the full shaft-mcp tool set to the
command line with zero tool-logic duplication, operating in two modes:
stateless one-shot commands and a persistent session mode for stateful tools.

## Install

Pass `--install-shaft-cli` to the shaft-mcp installer (the copy-paste command
on the [Connect shaft-mcp page](/docs/agentic/mcp)) to also install shaft-cli —
no local Java or Python required; the installer bootstraps whatever is missing.
The flag is independent of `--client`, so it can be combined with any MCP
client target, or run on its own.

The installer downloads and SHA-256-verifies `shaft-cli-<version>.jar` from
Maven Central, then writes a runnable launcher (`shaft-cli` on macOS/Linux,
`shaft-cli.cmd` on Windows) plus a `shaft-cli.args` Java argfile next to it,
under the platform's application-data root:

- Windows: `%LOCALAPPDATA%\ShaftHQ\shaft-cli\versions\<version>\`
- macOS: `~/Library/Application Support/ShaftHQ/shaft-cli/versions/<version>/`
- Linux: `${XDG_DATA_HOME:-~/.local/share}/shafthq/shaft-cli/versions/<version>/`

shaft-mcp is a prerequisite; install it with the same command. shaft-cli
locates it in this order:

1. The `SHAFT_MCP_JAR` environment variable
2. The installer's versions directory
3. A sibling `../shaft-mcp/target` (development checkout)

## Modes

**One-shot mode** (default): each command spawns an ephemeral shaft-mcp child
process over stdio, runs a single tool call, and exits. Suitable for stateless
tools like guide search and doctor analysis.

**Session mode**: `shaft-cli session start` launches a persistent shaft-mcp
daemon (HTTP on a localhost port) and records the session endpoint to
`~/.shaft/cli-session.json`. Subsequent commands connect over HTTP, preserving
browser and device state across invocations. Commands that need live state
(`browser`, `element`, `capture`) fail fast when no session is running, unless
`--stdio-ok` is passed.

Routing: if a live session exists, commands use HTTP; otherwise a one-shot
stdio child is spawned.

## Commands

All commands support `-h`/`--help`; the root supports `-V`/`--version`.

**`shaft-cli tools [--json]`** — list all available tools (name and first
sentence of description). `--json` outputs the raw `tools/list` result.

**`shaft-cli call <TOOL> [key=value ...] [--args '<json>'] [--json]
[--stdio-ok]`** — invoke any tool by name. Arguments come from repeated
`key=value` pairs (values are coerced: `true`/`false` to booleans,
integers/decimals to numbers, `{...}`/`[...]` to JSON, otherwise strings)
and/or `--args '{"k":"v"}'` (`key=value` overrides keys from `--args`).
`--json` outputs the raw JSON-RPC result instead of rendered text.

**`shaft-cli session start | status | stop`** — manage the daemon. `start`
prints the port and pid; `status` prints
`running — port <port>, pid <pid>, started <iso-8601>`.

**Curated aliases** (same options as `call`):

- `shaft-cli browser navigate|screenshot|dom|url` (session required)
- `shaft-cli element click|type|hover` (session required)
- `shaft-cli capture start|stop|status|code` (session required)
- `shaft-cli guide search` (stateless)
- `shaft-cli doctor analyze|suggest` (stateless)

## Examples

```text
shaft-cli tools
# trace_latest — returns recent persisted SHAFT trace indexes from target/shaft-traces
# [...]

shaft-cli session start
# shaft-cli session started on port 12345 (pid 9876).

shaft-cli session status
# running — port 12345, pid 9876, started 2025-12-20T14:30:45Z

shaft-cli call shaft_guide_search query='click element' maxResults=1
# [JSON guide-search result]

shaft-cli guide search query='click element' --stdio-ok
# [guide search works with no session]
```

## Exit codes

- **0**: success
- **1**: tool error, transport error, or `--json` result with `isError`
- **2**: unknown alias action

## Related

- [MCP](/docs/agentic/mcp)
- [Overview](/docs/agentic/overview)
- [Capture](/docs/agentic/capture)
- [Doctor](/docs/agentic/doctor)
