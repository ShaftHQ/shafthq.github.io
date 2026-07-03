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
actions are fully registered. The core Assistant tool window can load without
IntelliJ's Java plugin; Java-specific actions are registered only when Java
support is available. First run shows a four-section setup inside the tool window:

1. Confirm the **Project** row is configured for the open IntelliJ project.
2. In **MCP**, click **Install / Update SHAFT MCP**.
3. In **Runtime**, select the Assistant family and runtime: Codex, Claude, or
   Copilot with CLI, IDE plugin, or desktop app where supported.
4. In **Assist**, click **Test connection and start chatting**.

![SHAFT IntelliJ MCP setup flow](/img/agentic/intellij-plugin-mcp-setup.png)

Setup rows show **Configured**, **Not configured**, **Connecting**, or **Error**
states for Project, MCP, Runtime, and Assist. Install and test failures stay
inline with diagnostic output, and the retry action remains enabled.

![SHAFT IntelliJ MCP setup success](/img/agentic/intellij-plugin-mcp-setup-success.png)

![SHAFT IntelliJ MCP setup error](/img/agentic/intellij-plugin-mcp-setup-error-dark.png)

After the test succeeds, setup disappears and the tool window opens directly on
the Assistant view. The success message includes the effective MCP workspace,
`user.dir`, `shaft.mcp.workspaceRoot`, and `SHAFT_MCP_WORKSPACE_ROOT`, so you can
confirm that tools are scoped to the open IntelliJ project. The plugin also
pre-fills a one-time Assistant prompt that asks the selected agent to audit its
guidance and memory files for SHAFT MCP tool usage that keeps generated code
aligned with the official guide. The plugin starts the configured stdio command
when it invokes tools; it does not embed the SHAFT engine or manage provider
model traffic itself.

## Tool window

Open **Tools | SHAFT | Open SHAFT** to show the tool window. The plugin opens on
the **Assistant** workflow. Use the **Workflow** selector at the top of the tool
window to switch between **Guided**, **Recorder**, **Inspector**, **Triage**,
**Evidence**, **Projects**, and **Advanced**. The selector is used instead of a
crowded tab strip so the controls stay readable in the narrow right-side
IntelliJ tool window.

## Assistant

The **Assistant** workflow is a chat-style view with an Ask, Plan, and Agent
switch in the bottom composer. Local CLI prompts call the MCP
`autobot_local_agent_run` tool, which delegates to the engine-side local agent
service in `shaft-pilot-core`. Cloud Ask and Plan prompts call
`autobot_provider_chat` with the selected provider and model.

Supported local routes are:

| Client | Default local command | API key required by SHAFT |
| --- | --- | --- |
| Codex CLI | `codex exec --sandbox read-only -` for Ask/Plan and no-source Agent; workspace-write only with `Allow source edits` | No |
| Claude Code | `claude --print`; Plan and no-source Agent use `--permission-mode plan`; source-edit Agent uses `acceptEdits` | No |
| Copilot CLI | `copilot ask`, `copilot plan`; source-edit Agent uses `copilot agent` | No |

Cloud providers are OpenAI, Anthropic, Gemini, and GitHub Models. Their keys
are stored in IntelliJ Password Safe; only the selected cloud provider key is
passed to the MCP process. If Cloud routing is selected while the composer is in
`AGENT` mode, the plugin switches back to `PLAN` because direct provider chat
cannot mutate the local workspace.

Use `Ctrl+Enter` or Ctrl-click in the prompt box to send a prompt. The Send icon
is anchored at the bottom-right of the composer and advertises both shortcuts in
its tooltip. Newly sent prompts scroll into view immediately, so the chat shows
visible feedback before a long-running response finishes. Assistant controls are
icon-only, keep JetBrains-style glyphs, use borderless button and chat-bubble
surfaces, and retain accessible names and tooltips. While a prompt runs, the
submit icon becomes an animated spinner; hovering it changes the same square
control into cancel. If you cancel, the Cancel action changes into Kill; click it
again to terminate the active process immediately. A canceled request ends with a
dedicated final transcript entry and no capture-generated output is finalized.
Local Agent mode is blocked from
source mutation until the user explicitly approves it for that request. For
browser-only tasks, leave `Allow source edits` off; enable it when the request
requires applying code or source edits. A custom local agent command can be
supplied for non-standard CLI installations; broad Ask, Plan, and Agent prompts
keep using the selected local route.

For code writing and conversion prompts, the Assistant gives the selected route
only the currently open editor file as source context. In Ask mode, it recommends
the migrated SHAFT-syntax code in the chat without IDE edits. In Agent mode, it
can suggest changes directly inside the open class when source edits are
approved. When the user asks for code that performs a site action, the prompt
requires a confirmed target URL, a real WebDriver session, live page inspection,
verified element actions, and final generated-code guardrails before returning
locators or Java.

Assistant chats are persisted per IntelliJ project. Use the chat selector to
reopen recent contexts, the New chat icon to start a separate context, and the
Clear icon to clear only the active chat.

The Assistant understands explicit feature intent and direct commands from the
same chat box. For example, "start mobile recording" maps to
`mobile_record_start`, while `/record-mobile start recordings/mobile.json` runs
the same feature deterministically. Natural browser-control prompts default to
WebDriver; use `playwright` in the prompt when that backend is required.
After capture approval, the local Agent run shows completion feedback in the
final transcript so you can confirm generation status, outputs, and next
workflow step before continuing.

A JetBrains-style command info icon appears directly beside the command dropdown.
Hover it to view the tested command families and examples without filling the
chat with command documentation; click it to post the same help into the
transcript. Dark-mode code blocks use a distinct panel color and border so
generated Java stays readable under Darcula-style themes.

![SHAFT IntelliJ Assistant command hint and chat composer](/img/agentic/intellij-plugin-assistant.png)

| Feature | Command | Primary MCP tools |
| --- | --- | --- |
| Code generation | `/codegen` | `capture_code_blocks`, `playwright_recording_code_blocks`, `mobile_recording_code_blocks`, `test_automation_scenarios` |
| Web recording | `/record-web` | `capture_start`, `capture_stop`, `playwright_record_start`, `playwright_record_stop` |
| Mobile recording | `/record-mobile` | `mobile_record_start`, `mobile_record_stop`, `mobile_recording_code_blocks`, `mobile_inspector_record_prepare` |
| Failure analysis | `/doctor` | `doctor_analyze_failed_allure`, `playwright_doctor_analyze_failed_allure`, `doctor_suggest_fix`, `doctor_analyze_trace` |

The visible command list intentionally starts with `/codegen`, `/record-web`,
`/record-mobile`, and `/doctor`. Broad local and cloud prompts stay on the
selected Assistant route, and supported natural feature intent still maps to MCP
when configured. If MCP is not configured, these command families show the SHAFT
MCP setup prompt before running.

Common examples:

```text
/codegen recordings/intellij-capture.json
/record-web https://example.com
/record-mobile inspector Android recordings/inspector.json
/doctor target/allure-results
```

Responses render as Markdown. Known SHAFT responses, including local agent runs,
provider chat, local client discovery, MCP `content[].text` envelopes, JSON
payloads, and Java snippets, are parsed into readable sections, tables, or
fenced code blocks. Unknown structured responses are formatted through the
selected Assistant route when possible; if no formatter is available, the plugin
falls back to a local Markdown-safe JSON/code rendering. Use the copy actions
for rendered Markdown, raw support diagnostics, or the full transcript plus
current-session tool evidence when exporting for issue review.

## Onboarding recording notes

Use this preferred launch path for the recording workflow from a clean, disposable
IntelliJ sandbox/profile so onboarding state stays isolated:

`gradle -p shaft-intellij runIde --args C:/Users/Mohab/IdeaProjects/SHAFT_ENGINE`

On Windows JDK21 onboarding, SHAFT now ensures `%JAVA_HOME%\Packages` exists
before instrumentation starts. The flow shows explicit diagnostics for missing,
invalid, or unwritable `JAVA_HOME` values instead of opaque startup failures.

Use the same onboarding MCP flow: CODEX + CLI, Route = LOCAL, and Mode = AGENT.
`Allow source edits` stays off for DuckDuckGo/browser flow and is enabled when the run
must change source files. If the step is expressed as "open the first result,"
use the scoped 1-indexed XPath (`(//article[@data-testid='result'])[1]//a[@data-testid='result-title-a']`) for the first result.
For deterministic verification, finish with a final page title and page-specific
text check after opening that result before approving generated capture output.
Use `discard recording` or `re-record` when a focus or click mistake pollutes
the capture; the Assistant stops the current Capture session with
`discard=true` before restarting.

For recordings, dismiss sandbox-only low-memory or script-launcher warning balloons
without suppressing normal production IDE warnings. IntelliJ Trust Project may
preselect Windows Defender exclusions; leave them unchecked unless exclusions are
explicitly required for that environment.

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
before running it. After review approval, keep the same capture session path so
generation preserves the reviewed browser journey instead of rerunning capture.
This action is available only in IDE installations with Java support enabled.

Use **Settings | SHAFT** later to install or update `shaft-mcp`, retest the MCP
connection, change Assistant Local/Cloud routing, connect the selected local
runtime MCP client, configure GitHub Copilot for IntelliJ MCP, or edit the
advanced stdio command manually. Settings are grouped by **Connection**,
**Execution**, **Advanced**, and **Credentials** so setup, routing, provider,
and key-storage controls stay separate.

Optional OpenAI, Anthropic, Gemini, and GitHub tokens are stored in IntelliJ
Password Safe and can be passed as MCP process environment variables for the
selected provider. Settings also lets you select the configured SHAFT AI
provider and model used by MCP tools that explicitly request provider
assistance. Direct provider calls remain controlled by `shaft-ai` and the
[provider controls](/docs/agentic/providers); the plugin only selects and
passes the provider configuration.

Settings show whether each provider key is stored, provide explicit clear
controls, and keep a test action for validating the current stdio command before
using the Assistant or workflows.

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
