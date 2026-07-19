---
id: pilot
title: SHAFT Pilot
description: Capture, generation, diagnosis, reviewed repairs, and MCP interoperability — plus downloadable credential-free Pilot example assets.
slug: /agentic/pilot
sidebar_position: 3
keywords: [SHAFT, pilot, capture, doctor, mcp, examples, pilot examples, credential-free, repair proposal, ollama advisory]
tags: [pilot, capture, doctor, mcp, examples]
---

# SHAFT Pilot

SHAFT Pilot combines deterministic browser Capture, TestNG generation, failure
diagnosis, reviewed repair proposals, and MCP interoperability.
AI is optional and disabled by default.
Capture, generation, Doctor, and MCP remain usable without a provider account,
API key, model, or network call.

## Modules

| Module | Purpose |
| --- | --- |
| `shaft-pilot-core` | Approval, redaction, budget, schema, audit, and deterministic fallback contracts. |
| `shaft-capture` | Managed Chrome/Edge recording and deterministic TestNG generation. |
| `shaft-doctor` | Portable evidence, deterministic diagnosis, and isolated reviewed repair proposals. |
| `shaft-ai` | Optional direct OpenAI, Anthropic, Gemini, GitHub Models, and Ollama adapters. |
| `shaft-mcp` | Executable stdio and Streamable HTTP server plus Capture and Doctor CLI. |

Library consumers should import `shaft-bom` and add only the modules they use:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.github.shafthq</groupId>
      <artifactId>shaft-bom</artifactId>
      <version>${shaft.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-capture</artifactId>
  </dependency>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-doctor</artifactId>
  </dependency>
</dependencies>
```

Add `shaft-ai` only for direct provider calls. External ChatGPT, Codex,
Claude, Gemini, and GitHub Copilot clients use SHAFT through MCP and keep their
own authentication.

## Install the MCP server

Use [Connect shaft-mcp](/docs/agentic/mcp) for installer, client
configuration, local command, and Streamable HTTP setup. The
[MCP command reference](/docs/agentic/mcp#mcp-command-reference) is the only
page that carries runnable MCP command examples.

## Capture example

Start a privacy-filtered recording from the
[MCP command reference](/docs/agentic/mcp#mcp-command-reference). Omit
`--headless` when a person will drive the browser locally. Drive the visible
browser or the automation controlling the headless session, optionally add a
checkpoint, then stop and generate from the same canonical command page.

Generation writes Java source, externalized ordinary test data, and
`target/shaft-capture/generation-report.json`. Passwords, configured sensitive
fields, credential-shaped values, private paths, and unsafe locator evidence
are excluded or redacted. Replay succeeds only when the generated project
compiles, passes, and produces populated Allure result JSON.

During recording, SHAFT writes actions incrementally so a cross-domain
navigation does not discard earlier steps. Text entry is consolidated into a
single type action until it is committed or followed by a special key, while
keys such as Enter and Tab remain separate actions. The recorder overlay lets
you edit, delete, reorder, and add visible assertions for captured steps, and
deleting a typed step also removes its externalized test-data reference. Each
action keeps sanitized page context and a DOM snapshot so code generation can
rank semantic, stable locators and honor a pinned locator preference. Stopping
the recording closes the managed browser, saves the session, and returns the
next code-generation request as a fenced block, ready to send.

## Doctor example

Analyze only explicitly allowed evidence with the Doctor command on
[Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference).

Outputs include `doctor-evidence.json`, `doctor-report.json`, and
`doctor-report.md`. The deterministic rules classify product, test, locator,
data, timing/synchronization, environment/configuration, infrastructure, and
unknown failures. Empty and retry-only evidence remains visible instead of
being converted into a false success.

## Reviewed repair example

Create a complete reviewed input based on
`examples/shaft-pilot/doctor/repair-input.json`, then use the reviewed repair
commands from [Connect shaft-mcp](/docs/agentic/mcp#mcp-command-reference).

Doctor creates and validates a temporary isolated worktree. It does not modify
the current branch or write to GitHub. After reviewing the diff and validation
result, publish only a draft pull request with the exact returned token.

The MCP equivalents are `doctor_propose_fix` and
`doctor_publish_draft_pr`. Publication cannot merge, bypass branch protection,
or proceed without separate explicit approval.

## MCP clients

For Codex, Claude, or GitHub Copilot, choose the matching application command
in [Connect shaft-mcp](/docs/agentic/mcp). The installer resolves the latest
Maven Central release, verifies the JAR, and updates the per-user local stdio
configuration without requiring you to edit a client configuration file.

Use the [remote-client section](/docs/agentic/mcp#remote-clients) for
Streamable HTTP setup. The endpoint is `/mcp` and the default port is `8081`.
ChatGPT developer mode/apps and cloud agents cannot launch a local JAR, so
deploy the container and expose `/mcp` over HTTPS. GitHub Copilot is an MCP
client integration; it is not a direct provider API-key adapter.

External client capabilities were verified against official documentation on
June 12, 2026:

| Client | Supported SHAFT connection | Current limitation or control |
| --- | --- | --- |
| ChatGPT apps/developer mode | Public HTTPS Streamable HTTP `/mcp`. See [Connect from ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt). | Hosted ChatGPT cannot start the local JAR; workspace plan and administrator controls apply. |
| Codex CLI and IDE extension | Local stdio or Streamable HTTP, configured by CLI or shared `config.toml`. See [Codex MCP](https://developers.openai.com/codex/mcp). | Tool approval remains a Codex client policy. |
| Claude Code and Desktop | Local stdio; Claude Code also supports HTTP and can import Desktop configuration. See [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp). | The Claude Messages API uses its separate remote [MCP connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector). |
| Gemini CLI | Local stdio, SSE, or Streamable HTTP through `settings.json`. See [Gemini CLI MCP](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md). | Server trust and tool confirmation are controlled by Gemini CLI. |
| GitHub Copilot | MCP-capable IDEs and CLI can use local or remote servers; cloud agent uses repository MCP configuration. See [GitHub Copilot MCP](https://docs.github.com/en/copilot/concepts/context/mcp). | Cloud agent/code review currently consume tools only, and organization policy may restrict MCP. |

## Optional providers

Safe defaults:

```properties
pilot.ai.enabled=false
pilot.ai.provider=none
pilot.ai.consent.local=false
pilot.ai.consent.remote=false
pilot.ai.allowedEvidenceCategories=
```

Download the
[OpenAI](/examples/shaft-pilot/providers/openai.properties),
[Anthropic](/examples/shaft-pilot/providers/anthropic.properties),
[Gemini](/examples/shaft-pilot/providers/gemini.properties),
[GitHub Models](/examples/shaft-pilot/providers/github.properties), or
[Ollama](/examples/shaft-pilot/providers/ollama.properties) example. Remote
providers read credentials only from their configured environment variable
names. Ollama needs no credential but still requires local consent.
Remote consent, local consent, and every evidence category are denied unless
explicitly enabled.

Provider output is advisory. It cannot replace deterministic diagnosis, apply
a Capture enrichment without review, or publish a repair without a second
approval. Timeout, rate limit, authentication, malformed JSON, schema failure,
budget exhaustion, and provider unavailability all preserve deterministic
output.

## Privacy and security

- Review recordings, externalized data, Doctor bundles, and repair manifests
  before sharing them.
- Screenshots and page snapshots are excluded from Doctor unless explicitly
  requested.
- Remote provider sharing requires explicit consent after minimization and
  redaction.
- Credentials remain in environment variables or provider-native client
  authentication and must not be stored in SHAFT properties, examples, logs,
  generated tests, or Allure attachments.
- Pilot audit events contain provider/model identifiers, redaction counts,
  duration, and status, but not prompts, evidence, credentials, or raw model
  responses.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| MCP process exits or prints non-protocol output | Use Java 25, launch with the installer-generated argfile or thin classpath, and keep stdio logs on stderr. |
| HTTP client cannot connect | Start with `--spring.profiles.active=http`, expose port `8081`, and use `/mcp`. |
| Capture cannot start | Confirm Chrome or Edge is installed, no prior Capture session owns the runtime directory, and use `--headless` in CI. |
| Generated test does not replay | Read `generation-report.json`; fix missing external data or an unsupported/ambiguous locator before regenerating. |
| Doctor reports incomplete evidence | Provide populated `*-result.json` Allure files and set the correct `--allowed-root`. |
| Provider is unavailable | Keep the deterministic result; verify enablement, consent, model, endpoint, budget, and environment variable name before retrying. |
| Repair proposal is rejected | Use an exact base SHA, repository-relative allowlist, complete file content, tokenized Maven commands, and a clean isolated worktree. |

See [SHAFT Capture](/docs/agentic/capture), [SHAFT Doctor](/docs/agentic/doctor),
[optional AI providers](/docs/agentic/providers), and [SHAFT MCP](/docs/agentic/mcp) for the
complete contracts.

## Example assets {/* #example-assets */}

Credential-free example assets for the commands above — review and replace
paths/content before reusing any of them:

- [`providers/ollama.properties`](/examples/shaft-pilot/providers/ollama.properties) —
  load as SHAFT properties to try the optional local Ollama advisory after
  reviewing the [provider controls](/docs/agentic/providers). The
  deterministic diagnosis remains the baseline if Ollama is unavailable or
  returns invalid output.
- [`doctor/repair-input.json`](/examples/shaft-pilot/doctor/repair-input.json) —
  use only after replacing its paths and content with a reviewed change.
  Doctor repair creates an isolated worktree and does not publish to GitHub
  without a separate approval token.
- [Doctor chat invocations](/examples/shaft-pilot/mcp/doctor-analyze-invocations.json) —
  a credential-free Doctor example.
- [OpenAI](/examples/shaft-pilot/providers/openai.properties),
  [Anthropic](/examples/shaft-pilot/providers/anthropic.properties),
  [Gemini](/examples/shaft-pilot/providers/gemini.properties), and
  [GitHub Models](/examples/shaft-pilot/providers/github.properties) property
  examples for the other optional providers.

## Related

- [Overview](/docs/agentic/overview)
- [MCP](/docs/agentic/mcp)
- [Doctor](/docs/agentic/doctor)
- [Providers](/docs/agentic/providers)
