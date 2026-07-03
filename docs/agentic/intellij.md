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
support is available. First run shows a four-step setup inside the tool window:

1. **Choose assistant** defaults to Codex CLI and shows
   `Runtime: Codex CLI selected`.
2. **Install MCP** shows a multi-line installer command. Copy the installer
   command and run it in a terminal.
3. **Detect command** infers the local stdio command from the installed
   `shaft-mcp.args`. Manual setup stays behind **Show manual MCP install target**.
4. **Test connection** verifies the stdio command. Success shows
   `Runtime: Codex CLI verified` and reveals **Start chatting with SHAFT Assistant**.

The Marketplace plugin does not download or execute installer scripts at
runtime. It only helps you choose the installer target, copy the terminal
installer command, infer the local stdio command from the installed
`shaft-mcp.args`, then stores and starts that local command.
After a command has passed setup, opening SHAFT shows the Assistant view.
Without a configured MCP command, the landing view keeps the runtime,
installer, inference, and test steps visible.

![SHAFT IntelliJ MCP setup flow](/img/agentic/intellij-plugin-mcp-setup.png)

Setup rows show **Configured**, **Not configured**, **Connecting**, or **Error**
states for the runtime, MCP command, and connection test. The default Install
step builds the Codex CLI terminal command and inference action; other manual
targets remain hidden until **Show manual MCP install target** is selected.
Test failures stay inline with categorized troubleshooting, client-specific
next steps, copyable diagnostic command/output actions, and the retry action
remains enabled.

![SHAFT IntelliJ MCP setup success](/img/agentic/intellij-plugin-mcp-setup-success.png)

![SHAFT IntelliJ MCP setup error](/img/agentic/intellij-plugin-mcp-setup-error-dark.png)

Troubleshooting details distinguish the failure type when the plugin can infer
it:

- **Java/runtime**: install or select a Java runtime that can run `shaft-mcp`,
  then retry.
- **Maven artifact resolution**: check Maven Central or proxy access for
  `io.github.shafthq:shaft-mcp`, then retry.
- **Client configuration**: confirm the selected client can write and read its
  MCP configuration file.
- **Client runtime**: install the selected client CLI or add it to `PATH`, then
  retry.
- **MCP command**: rerun the terminal installer, infer the installed stdio
  command, or paste a local SHAFT MCP stdio command generated outside IntelliJ.
- **MCP probe**: run the copied stdio command in a terminal to confirm it starts
  outside IntelliJ.

The setup pane includes a command builder, one-click actions for copying the
installer command, inferring the stdio command, and copying diagnostic
command/output. Codex users should verify `codex mcp list`, Claude users should
verify `claude mcp list` or restart Claude Desktop after desktop config changes,
GitHub Copilot users should check the Copilot MCP configuration and
organization MCP policy, and SHAFT IntelliJ plugin users should run the
`intellij-plugin` target before using inference.

After the test succeeds, setup stays visible long enough to show the verified
runtime and **Start chatting with SHAFT Assistant** action. The success message
includes the effective MCP workspace, `user.dir`, `shaft.mcp.workspaceRoot`, and
`SHAFT_MCP_WORKSPACE_ROOT`, so you can confirm that tools are scoped to the open
IntelliJ project. The plugin starts the configured stdio command when it invokes
tools; it does not embed the SHAFT engine or manage provider model traffic
itself.

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
| Codex CLI | `codex exec --sandbox read-only -` for Ask/Plan and no-source Agent; workspace-write only with `Allow source edits` | No |
| Claude Code | `claude --print`; Plan and no-source Agent use `--permission-mode plan`; source-edit Agent uses `acceptEdits` | No |
| Copilot CLI | `copilot ask`, `copilot plan`; source-edit Agent uses `copilot agent` | No |

Cloud providers are OpenAI, Anthropic, Gemini, and GitHub Models. Their keys
are stored in IntelliJ Password Safe; only the selected cloud provider key is
passed to the MCP process. Cloud `AGENT` mode is disabled because direct
provider chat cannot mutate the local workspace.

Use `Ctrl+Enter` to send a prompt. Newly sent prompts scroll into view
immediately, so the chat shows visible feedback before a long-running response
finishes. The selected local agent appears as compact text such as `Codex CLI`;
hover it for the full route, for example `Agent: Local / Codex / CLI`.
Assistant controls are icon-only, keep JetBrains-style glyphs, use borderless
button and chat-bubble surfaces, and retain accessible names and tooltips.
While a prompt runs, the submit icon becomes an animated spinner;
hovering it changes the same square control into cancel. If you cancel, the
request ends with a dedicated final transcript entry and no capture-generated
output is finalized.
Local Agent mode is blocked from
source mutation until the user explicitly approves it for that request. For
browser-only tasks, leave `Allow source edits` off; enable it when the request
requires applying code or source edits. A custom local agent command can be
supplied for non-standard CLI installations; broad Ask, Plan, and Agent prompts
keep using the selected local route.

Assistant chats are persisted per IntelliJ project. Use the chat selector to
reopen recent contexts, the New chat icon to start a separate context, and the
Clear icon to clear only the active chat. Persisted chats keep rendered
messages only; raw MCP payloads and common token/key values are not stored.

The Assistant understands explicit feature intent and direct commands from the
same chat box. For example, "start mobile recording" maps to
`mobile_record_start`, while `/mobile-record start recordings/mobile.json` runs
the same feature deterministically. Browser control defaults to WebDriver; use
`playwright` in the prompt or command when that backend is required.
After capture approval, the local Agent run shows completion feedback in the
final transcript so you can confirm generation status, outputs, and next
workflow step before continuing.

An empty transcript suggests `/guide`, `/browser`, `/record`, and `/doctor`.
The run timeline and action controls stay hidden until the current prompt,
selected tool, running, approval, completion, cancellation, or failure state
makes them useful. Type `@` in the prompt to insert supported
workflow/tool/project starters, or `#` to insert the current file or known
project artifacts when that context exists.

A single JetBrains-style command-help icon appears in the composer. Hover it to
view the tested command families without filling the chat with command
documentation. The visible palette includes `/codegen`, `/record-web`,
`/record-mobile`, `/doctor`, `/guide`, `/guardrails`, `/browser`, `/mobile`, and
`/project`.

![SHAFT IntelliJ Assistant command hint and chat composer](/img/agentic/intellij-plugin-assistant.png)

| Feature | Canonical command | Synonyms | Primary MCP tools |
| --- | --- | --- | --- |
| Command help | `/commands` | `/help`, `/mcp-help`, `/shaft-help` | Local help |
| Assistant routing | `/assistant` | `/agent`, `/ask`, `/plan`, `/clients` | `autobot_local_agent_run`, `autobot_provider_chat`, `autobot_local_agent_clients` |
| Browser control | `/browser` | `/web`, `/browse`, `/page`, `/inspect`, `/locator` | `driver_initialize`, `browser_open_intent`, `browser_get_page_dom`, `browser_take_screenshot`, `playwright_initialize`, `playwright_browser_navigate` |
| Browser recording and codegen | `/record` | `/rec`, `/capture`, `/codegen`, `/generate`, `/gen`, `/generateTest` | `capture_start`, `capture_stop`, `capture_code_blocks`, `playwright_record_start`, `playwright_recording_code_blocks` |
| Mobile control and inspection | `/mobile` | `/appium`, `/device`, `/phone`, `/emulator` | `mobile_toolchain_status`, `mobile_initialize_native`, `mobile_initialize_web_emulation`, `mobile_get_accessibility_tree`, `mobile_take_screenshot` |
| Mobile recording and codegen | `/mobile-record` | `/app-record`, `/inspector-record`, `/mobile-codegen`, `/app-codegen`, `/mobile-replay` | `mobile_record_start`, `mobile_record_stop`, `mobile_recording_code_blocks`, `mobile_replay_recording`, `mobile_inspector_record_prepare` |
| Failure analysis | `/doctor` | `/allure`, `/triage`, `/fixTestFailure`, `/failure`, `/fix` | `doctor_analyze_failed_allure`, `playwright_doctor_analyze_failed_allure`, `doctor_suggest_fix`, `doctor_analyze_trace` |
| Productivity and raw MCP | `/mcp` | `/tool`, `/call`, `/guide`, `/docs`, `/scenarios`, `/guardrails`, `/project`, `/upgrade` | `shaft_guide_search`, `test_automation_scenarios`, `test_code_guardrails_check`, `shaft_project_upgrade` preview, explicit raw tool calls |

`/assistant` and its aliases (`/agent`, `/ask`, `/plan`, `/clients`) discover
Assistant routes and local clients. Broad local and cloud prompts stay on the
selected Assistant route. Direct feature commands such as `/guide`, `/browser`,
`/record`, `/doctor`, `/project upgrade`, and `/mcp` are MCP-backed; if MCP is
not configured, the Assistant shows the SHAFT MCP setup prompt before it runs
that feature command. Project creation from chat returns a review instruction;
run **Create SHAFT Project** from Projects or Guided so the confirmed workflow
gate is used before files are written.

Common examples:

```text
/browser open https://example.com sign in
/browser playwright open https://example.com
/record https://example.com
/codegen recordings/intellij-capture.json
/mobile status Android
/mobile native Android emulator-5554
/mobile-record inspector Android recordings/inspector.json
/mobile-codegen recordings/mobile.json
/doctor target/allure-results
/doctor fix target/shaft-doctor/doctor-report.json
/mcp browser_get_title {}
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
- Guided: starter templates for recording a browser flow and generating Page
  Object code, analyzing failed Allure results, converting Selenium snippets to
  SHAFT syntax, creating a new SHAFT project, and inspecting current page
  locators. Templates prefill MCP arguments only; they do not run tools or write
  source by themselves.
- Advanced Tools: WebDriver, Playwright, and mobile playback flows, scenario
  catalog prompts, generated-code guardrail checks, local Assistant client
  discovery, and official SHAFT guide search.

Each category provides editable JSON arguments and calls the matching MCP tool.
This keeps generated code and source edits reviewable in the IDE instead of
hidden inside plugin code.

![SHAFT IntelliJ Guided workflow templates](/img/agentic/intellij-plugin-guided.png)

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

Use **Settings | SHAFT** later to paste or edit the stdio command, retest the
MCP connection, or change Assistant Local/Cloud routing. Configure Codex,
Claude, GitHub Copilot, and other MCP clients outside the plugin from the
[SHAFT MCP guide](/docs/agentic/mcp). Settings are grouped by **Connection**,
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
