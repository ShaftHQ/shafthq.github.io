---
id: agent-tooling
title: Agent tooling
description: Install, operate, and update the third-party agent stack used for SHAFT maintenance.
slug: /maintainers/agent-tooling
tags: [maintainers, agents]
---

# Agent tooling

## Goal

One page to (re)install, operate, and update the third-party tools that back
agent-assisted SHAFT maintenance. Repository guidance (`AGENTS.md`,
`CONTRIBUTING.md`) references this runbook instead of restating it.

## Inventory

| Tool | Role | Install source |
|---|---|---|
| memory CLI | Durable repo memory in `.memory/` | npm `@aictx/memory@0.1.55` (pin in `scripts/ci/validate_agent_setup.py`) |
| gbrain | Semantic repo index, knowledge graph, MCP server | Local git checkout, built with Bun |
| gbrain-ollama | Embedding backend for gbrain | Docker `ollama/ollama` + `nomic-embed-text` model |
| graphify | Deterministic repository map (structure queries, pre-search file selection) | Repository controller using an isolated uv tool environment |
| context7 | Post-cutoff library docs MCP | `npx @upstash/context7-mcp` (project `.mcp.json`) |
| maven-tools-mcp | Live Maven Central facts MCP | Docker `arvindand/maven-tools-mcp` (project `.mcp.json`) |
| Claude Code plugins | jdtls-lsp, frontend-design, mcp-server-dev | Auto-installed from `.claude/settings.json` `enabledPlugins` |

The `fable` and `superpowers` plugins were removed in the 2026-07-17 harness
consolidation: `act-as-fable` (a repo skill, not a plugin — see
`.claude/skills/act-as-fable/`) is now the sole methodology authority, and
UI evidence gathering moved from `webapp-testing`/`accessibility-review`/
`chrome-devtools-mcp` to shaft-mcp's own browser tools (screenshots,
`browser_accessibility_audit`, `browser_network_requests`). User-level
config (`~/.claude`) now deploys from the source-controlled
`.claude/user-harness/` via `scripts/agents/sync_user_harness.py`
(`--check`/`--apply`) instead of being hand-maintained.

## memory CLI

```bash
npm install -g @aictx/memory@0.1.55
memory check
```

Keep the version pinned to the value in `scripts/ci/validate_agent_setup.py`
(`MEMORY_PACKAGE`). Saves use intent-first JSON on stdin
(`memory remember --stdin`); never mirror durable facts outside `.memory/`.

## gbrain

### Install / update

gbrain is installed from a local git checkout and built with Bun (the public
npm package named `gbrain` is an unrelated project — do not install it):

```bash
cd <gbrain-checkout>   # e.g. ~/gbrain
git pull && bun install
gbrain apply-migrations --yes --non-interactive
gbrain doctor
```

On Windows, Bun's postinstall hook currently fails on a shell-redirect parse
bug; running `gbrain apply-migrations --yes` manually afterwards is the
documented workaround. `gbrain upgrade` / `gbrain check-update` automate this
flow where the release channel is reachable.

Brain home is `~/.gbrain/` (PGLite database, `config.json`). Required config:

```json
{
  "engine": "pglite",
  "embedding_model": "ollama:nomic-embed-text",
  "embedding_dimensions": 768
}
```

Inline embedding through Ollama is mandatory on PGLite: the background
jobs-work queue is Postgres-only and never drains on PGLite, so without the
`ollama:` model syncs import unembedded, invisible chunks.

### Embedding backend

```bash
docker run -d --name gbrain-ollama --restart unless-stopped \
  -p 127.0.0.1:11434:11434 ollama/ollama
docker exec gbrain-ollama ollama pull nomic-embed-text
curl http://127.0.0.1:11434/api/tags   # must list nomic-embed-text
```

The `unless-stopped` restart policy matters: without it the container stays
down after a reboot and every sync silently loses embedding coverage.

### Sources and continuous operation

Register both repos once, then let autopilot keep the brain fresh:

```bash
gbrain sources add shaft-engine --path <SHAFT_ENGINE checkout>
gbrain sources add shaft-userguide --path <shafthq.github.io checkout>
gbrain sync --all --no-hard-deadline   # first full sync outlives the 1h watchdog
```

Continuous operation: on macOS/Linux, `gbrain autopilot --install --repo
<checkout>` registers the self-maintaining daemon. **`autopilot --install`
has no Windows target** (launchd/systemd/cron only). The SHAFT_ENGINE Windows
installer manages Graphify only; operate gbrain separately on Windows.

The source-controlled installer registers the daily Graphify refresh task:

```powershell
cd <SHAFT_ENGINE checkout>
powershell -ExecutionPolicy Bypass -File tools\agent-infra\install-agent-tasks.ps1
```

It points the user-level `graphify-refresh` Scheduled Task at the repository's
thin `tools/agent-infra/graphify-refresh.cmd` adapter. The adapter derives its
repository root, then calls the same portable Python controller used by
maintainers. Logs stay machine-local under `~/.agent-infra/logs/`. For gbrain,
`gbrain dream --dry-run` previews a maintenance cycle. Health and
recommendations: `gbrain doctor`, `gbrain features`, `gbrain stats`.
Embed backlogs queued as jobs never drain on PGLite (no worker); cancel the
job (`gbrain jobs cancel <id>`) and run `gbrain embed --stale`, or let the
nightly dream absorb them.

Enabled quality probes (doctor recommendations):

```bash
gbrain config set autopilot.nightly_quality_probe.enabled true
gbrain config set autopilot.conversation_parser_probe.enabled true
```

### Operating caveats

- **PGLite is single-writer.** A running `gbrain serve` (Claude Code MCP
  session) holds the database lock; concurrent CLI commands time out. Stop
  the MCP process or run CLI maintenance between sessions.
- **Never run `gbrain frontmatter validate --fix` against the docs repo.**
  Docusaurus `slug:` frontmatter defines public site URLs; gbrain reads the
  field as its own page slug and would otherwise reject it as `SLUG_MISMATCH`
  — the fix would rewrite published routes, so this stays permanently
  off-limits regardless of the flag below.
- **This source has opted in to `gbrain sources trust-frontmatter-slug
  shaft-userguide`** (upstream PR:
  [garrytan/gbrain#2899](https://github.com/garrytan/gbrain/pull/2899),
  tracked as [SHAFT_ENGINE#3618](https://github.com/ShaftHQ/SHAFT_ENGINE/issues/3618)).
  Sync now honors the Docusaurus-declared slug for mismatched files instead of
  skipping them — the 83 previously-unindexed blog posts and custom-route docs
  pages import cleanly. Re-run `gbrain sources trust-frontmatter-slug
  shaft-userguide` after any brain re-init (the flag lives in
  `sources.config`, not in this repo). `gbrain doctor`'s `frontmatter_integrity`
  check still WARNs on these files — that's a separate lint pass unaffected by
  the trust flag, not a regression. Until the upstream PR merges, the flag
  requires the local `<gbrain-checkout>` on the
  `feature/trust-frontmatter-slug` branch (or any branch built from it).
- **Migration 0.32.2** refuses to run while a registered source has
  uncommitted git changes; commit first, then re-run
  `gbrain apply-migrations --yes`.
- gbrain **supplements** `.memory/` and grep; it never replaces them. The
  `retrieval-reflex` policy skill in SHAFT_ENGINE (`skills/retrieval-reflex/`)
  defines when agents should query it.

## graphify

Deterministic repository map, complementary to gbrain — graphify answers
*structure* (which files/modules relate, zero DB locking, works offline);
gbrain answers *meaning* (semantic retrieval). Both stay.

```powershell
py -3 tools/repository-map/graphify_maintenance.py refresh --root .
```

Run the controller from the repository's primary checkout. It resolves the
explicit `--root`, builds the gitignored `graphify-out/` cache, audits
extraction coverage, clusters the graph, and records the freshness marker in
this fixed order:

```text
build -> audit -> cluster -> marker
```

The marker binds the completed cache to the exact Git revision and manifest
that Graphify indexed. A failed build, audit, or cluster stage leaves no
current marker, so readers cannot accept a partial cache. Linked worktrees must
not refresh or record the shared cache.

The controller runs Graphify through this isolated uv tool invocation:

```powershell
uv tool run --with tree-sitter-sql --from graphifyy graphify
```

`graphifyy` is the distribution name, while `graphify` is its command. The
ephemeral `tree-sitter-sql` dependency enables SQL parsing without changing a
persistent global tool installation.

Audit an existing cache without modifying it:

```powershell
py -3 tools/repository-map/graphify_maintenance.py audit --root .
```

The audit compares every normalized manifest path with graph node sources and
reports four classifications:

| Classification | Meaning | Result |
|---|---|---|
| `covered` | Graphify emitted at least one node for the source | Pass |
| `expected_data_only` | A JSON data file emitted no code node | Visible in the report, but nonfatal |
| `missing_optional_parser` | A SQL source emitted no node | Actionable failure |
| `unexpected_parser_gap` | Any other source emitted no node | Actionable failure |

Zero-node JSON files remain visible because they are expected data inputs, not
proof of parser coverage. Zero-node SQL or other source files fail the audit;
fix the parser or upstream extraction gap before accepting the cache.

Only one refresh may run for a repository at a time. The controller holds a
nonblocking advisory operating-system lock across build, audit, cluster, and
marker recording. A contender fails before cache mutation. The operating
system releases the lock if the process exits or is killed, so there is no
stale lock file to delete.

Agents check the shared cache with
`py -3 tools/repository-map/resolve_graph_out.py --check`. The command exits
successfully only when the marker matches the revision being inspected.
Missing caches report `absent`; unmarked, changed, or revision-mismatched
caches report `stale`. In either degraded mode, use targeted `rg` and Memory
instead of treating the map as current evidence.

The daily `graphify-refresh` Scheduled Task uses the same controller and safety
rules. See the
[repository-map runbook](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/tools/repository-map/README.md)
for the executable shared-cache contract.

## MCP servers and plugins

Project-scoped servers live in SHAFT_ENGINE `.mcp.json` (context7 via npx,
maven-tools-mcp via Docker) and need Node and Docker present. The gbrain MCP
server is user-scoped (`~/.claude.json`): `gbrain serve` over stdio. Claude
Code plugins install themselves from `.claude/settings.json`
`enabledPlugins`/`extraKnownMarketplaces` on first session start.

## Health checklist

```bash
memory check
gbrain doctor --fast
curl http://127.0.0.1:11434/api/tags    # ollama up, nomic-embed-text present
docker ps --format '{{.Names}} {{.Status}}' | grep gbrain-ollama
py -3 scripts/ci/validate_agent_setup.py   # in SHAFT_ENGINE
```

## Related

- [Maintainer overview](/docs/maintainers/overview)
- [Agent guidance maintenance](/docs/maintainers/agent-guidance)
