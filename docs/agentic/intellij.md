---
id: intellij
title: IntelliJ IDEA plugin
description: Use SHAFT Assistant, MCP tools, Recorder, Doctor, Healer, Inspector, Projects, and Guide search from IntelliJ IDEA.
slug: /agentic/intellij
sidebar_position: 3
tags: [intellij, idea, mcp, recorder, doctor, healer, inspector, projects, assistant]
---

# IntelliJ IDEA plugin

The SHAFT IntelliJ IDEA plugin is a stable JetBrains Marketplace plugin for Java
test projects. It is a thin IDE shell over `shaft-mcp`: SHAFT engine behavior,
local CLI agent routing, direct provider adapters, Doctor, Healer, Capture, and
Inspector logic stay in the engine modules.

Install the plugin from JetBrains Marketplace when it is published, then open
**Tools | SHAFT | Open SHAFT**. If you install a plugin ZIP from disk, restart
IntelliJ IDEA when the IDE prompts for restart so the SHAFT tool window and
actions are fully registered. First run shows a three-step setup inside the tool
window:

1. Click **Install / Update SHAFT MCP**.
2. Select the Assistant family and runtime: Codex, Claude, or Copilot with CLI,
   IDE plugin, or desktop app where supported.
3. Click **Test connection**.

After the test succeeds, setup disappears and the tool window opens directly on
the Assistant view. The plugin starts the configured stdio command when it
invokes tools; it does not embed the SHAFT engine or manage provider model
traffic itself.

## Tool window

Open **Tools | SHAFT | Open SHAFT** to show the tool window. The plugin opens on
the **Assistant** workflow. Use the **Workflow** selector at the top of the tool
window to switch between **Guided**, **Recorder**, **Inspector**, **Triage**,
**Evidence**, **Projects**, and **Advanced**. The selector is used instead of a
crowded tab strip so the controls stay readable in the narrow right-side
IntelliJ tool window.

## Assistant

The **Assistant** workflow is a chat-style view with Ask, Plan, and Agent modes
in the bottom composer. Local CLI prompts call the MCP
`autobot_local_agent_run` tool, which delegates to the engine-side local agent
service in `shaft-pilot-core`. Cloud Ask and Plan prompts call
`autobot_provider_chat` with the selected provider and model.

Supported local routes are:

| Client | Default local command | API key required by SHAFT |
| --- | --- | --- |
| Codex CLI | `codex exec --sandbox read-only -` for Ask/Plan; workspace-write only after Agent approval | No |
| Claude Code | `claude --print`; Plan adds `--permission-mode plan` | No |
| Copilot CLI | `copilot ask`, `copilot plan`, or `copilot agent` | No |

Cloud providers are OpenAI, Anthropic, Gemini, and GitHub Models. Their keys
are stored in IntelliJ Password Safe; only the selected cloud provider key is
passed to the MCP process. Cloud `AGENT` mode is disabled because direct
provider chat cannot mutate the local workspace.

Use `Ctrl+Enter` to send a prompt. Local Agent mode is blocked from source
mutation until the user explicitly approves it for that request. A custom local
agent command can be supplied for non-standard CLI installations, but the
request still flows through `shaft-mcp`.

The Assistant also supports a small slash-command surface:

| Command | MCP tool |
| --- | --- |
| `/guide <query>` | `shaft_guide_search` |
| `/scenarios <intent>` | `test_automation_scenarios` |
| `/guardrails <code>` | `test_code_guardrails_check` |
| `/clients` | `autobot_local_agent_clients` |
| `/help` | Local command help |

Responses render as Markdown. JSON payloads and Java snippets are shown in
fenced code blocks, while standard MCP `content[].text` envelopes are unwrapped
before display. Use **Copy response** for the rendered Markdown, **Copy raw** for
support diagnostics, or **Copy all** for the full transcript.

## Workflows

The workflow selector exposes curated MCP requests for common automation jobs:

- Recorder: Capture start, status, checkpoints, stop, code blocks,
  record-at-target snippets, Playwright recording controls, and replay code
  generation.
- Inspector: browser and Playwright DOM snapshots, screenshots, mobile
  toolchain status, wrapped Appium Inspector recording, mobile screenshots, and
  accessibility trees.
- Evidence: failed Allure analysis, trace discovery, trace analysis, trace
  summarization, report remediation, guarded reruns, and review-only locator
  proposals.
- Projects: create new SHAFT example projects and preview or apply the modular
  SHAFT upgrader against the open Java project.
- Advanced Tools: WebDriver, Playwright, and mobile playback flows, scenario
  catalog prompts, generated-code guardrail checks, local Assistant client
  discovery, and official SHAFT guide search.

Each category provides editable JSON arguments and calls the matching MCP tool.
This keeps generated code and source edits reviewable in the IDE instead of
hidden inside plugin code.

```json
{"tool": "shaft_project_upgrade", "arguments": {"projectRoot": ".", "upgradeType": "basic", "dryRun": true, "approve": false}}
```

## Record in Java code

Use **Tools | SHAFT | Record SHAFT Flow Here** from a Java file to prepare a
`capture_record_at_target_code_blocks` request for the caret's package, class,
method, and source path. Replace the capture session path with a real recording
before running it.

Use **Settings | SHAFT** later to install or update `shaft-mcp`, retest the MCP
connection, change Assistant Local/Cloud routing, connect the selected local
runtime MCP client, configure GitHub Copilot for IntelliJ MCP, or edit the
advanced stdio command manually.

Optional OpenAI, Anthropic, Gemini, and GitHub tokens are stored in IntelliJ
Password Safe and can be passed as MCP process environment variables for the
selected provider. Settings also lets you select the configured SHAFT AI
provider and model used by MCP tools that explicitly request provider
assistance. Direct provider calls remain controlled by `shaft-ai` and the
[provider controls](/docs/agentic/providers); the plugin only selects and
passes the provider configuration.

Settings show whether each provider key is stored, provide explicit clear
buttons, and keep a **Test MCP** action for validating the current stdio command
before using the Assistant or workflows.

## Publishing

The engine repository publishes stable builds through the `Publish IntelliJ
Plugin` GitHub Actions workflow after the Maven Central release workflow,
or manually by maintainers. The workflow signs the plugin, verifies it with the
IntelliJ Plugin Verifier, and publishes to the JetBrains Marketplace Stable
channel.

## Related

- [MCP](/docs/agentic/mcp)
- [Pilot](/docs/agentic/pilot)
- [Providers](/docs/agentic/providers)
