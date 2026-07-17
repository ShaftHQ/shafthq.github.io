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
| graphify | Deterministic repository map (structure queries, pre-search file selection) | pip `graphifyy` (CLI `graphify`) |
| context7 | Post-cutoff library docs MCP | `npx @upstash/context7-mcp` (project `.mcp.json`) |
| maven-tools-mcp | Live Maven Central facts MCP | Docker `arvindand/maven-tools-mcp` (project `.mcp.json`) |
| Claude Code plugins | jdtls-lsp, design, frontend-design, mcp-server-dev, example-skills, fable, superpowers | Auto-installed from `.claude/settings.json` marketplaces |

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
has no Windows target** (launchd/systemd/cron only) — on Windows run the
source-controlled installer from the SHAFT_ENGINE checkout:

```powershell
powershell -ExecutionPolicy Bypass -File tools\agent-infra\install-agent-tasks.ps1
```

It registers two user-level Scheduled Tasks pointing at the repo's
`tools/agent-infra/` scripts (source-controlled; logs stay machine-local in
`~/.gbrain/autopilot/`): `gbrain-autosync` every 30 min runs `gbrain sync
--all --no-pull --skip-failed --no-hard-deadline` (`--no-pull` never touches
working-repo git state; `--skip-failed` so one unparseable file cannot wedge
the sync bookmark), and `gbrain-dream` daily at 05:00 runs `gbrain dream` —
the full maintenance cycle (sync, fact extraction, consolidation, take
proposals, embeddings, orphan checks) — then rebuilds and re-clusters the
graphify repository map. `gbrain dream --dry-run` previews a cycle. Health
and recommendations: `gbrain doctor`, `gbrain features`, `gbrain stats`.
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
  requires the local `C:/Users/Mohab/gbrain` checkout on the
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
py -3 -m pip install --user graphifyy==0.9.17   # CLI command is 'graphify'
cd <SHAFT_ENGINE checkout>
graphify .                                       # builds gitignored graphify-out/
```

Agents resolve the shared cache with
`py -3 tools/repository-map/resolve_graph_out.py --check` (worktrees read the
main checkout's cache; a guard-hook nudge reminds sessions to consult it
before broad searches). The nightly `gbrain-dream` scheduled task also
rebuilds `graphify-out/` so the map tracks the repo automatically; details in
`tools/repository-map/README.md`.

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
