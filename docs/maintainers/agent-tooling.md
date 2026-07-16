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
| headroom | Context-compression proxy fronting Claude Code | pip `headroom-ai`, docker preset |
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
gbrain sync --all
gbrain autopilot --install --repo <SHAFT_ENGINE checkout>
```

Autopilot runs sync plus the `dream` maintenance cycle (fact extraction,
consolidation, take proposals, embeddings, orphan checks) continuously;
`gbrain dream --dry-run` previews a cycle. Health and recommendations:
`gbrain doctor`, `gbrain features`, `gbrain stats`.

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
  field as its own page slug and reports `SLUG_MISMATCH` — the fix would
  rewrite published routes.
- **Migration 0.32.2** refuses to run while a registered source has
  uncommitted git changes; commit first, then re-run
  `gbrain apply-migrations --yes`.
- gbrain **supplements** `.memory/` and grep; it never replaces them. The
  `retrieval-reflex` policy skill in SHAFT_ENGINE (`skills/retrieval-reflex/`)
  defines when agents should query it.

## headroom

### Install / update

```bash
pip install -U headroom-ai
headroom install apply --preset persistent-docker --scope provider \
  --providers manual --target claude --port 8787 --backend anthropic \
  --mode token --no-telemetry
curl http://127.0.0.1:8787/readyz   # expect status healthy
```

- `--scope provider` is required: any other scope reports success but
  silently skips the `~/.claude/settings.json` `ANTHROPIC_BASE_URL` wiring.
- `--no-telemetry` keeps the aggregate-stats beacon off; re-state it on every
  re-apply.
- The `persistent-task` preset (schtasks) requires an elevated shell because
  it registers an `ONSTART` task; the `persistent-docker` preset installs
  without elevation and persists via Docker's restart policy. The container
  must publish on `127.0.0.1` only (verify with `docker inspect`).
- Upgrading in place: stop/disable any old scheduled tasks first if migrating
  from `persistent-task` — pip cannot replace a locked `headroom.exe`.
- Revert everything with `headroom install unwrap claude`
  (pre-change backup: `~/.claude/settings.json.pre-headroom.bak`).
- Live stats: `http://127.0.0.1:8787/stats`. Note that managed/desktop agent
  sessions may pin their own `ANTHROPIC_BASE_URL` and bypass the proxy;
  `api_requests` only counts sessions that inherit the global settings.

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
curl http://127.0.0.1:8787/readyz       # headroom healthy
docker ps --format '{{.Names}} {{.Status}}' | grep -E 'gbrain-ollama|headroom'
py -3 scripts/ci/validate_agent_setup.py   # in SHAFT_ENGINE
```
