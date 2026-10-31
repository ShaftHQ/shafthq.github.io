# Live-refresh signals (ChaosEngine)

CE is a **subtree**, not a Maven artifact and not a standalone repo.

| Signal | Where to read at apply time | Pilot snapshot (Africa/Cairo) |
|---|---|---|
| Version | `https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/main/chaos-engine/VERSION` | **2026.10.31.5** @ 2026-10-31 13:33; **refresh at publish** (2026.10.31.6 pending) |
| License | `chaos-engine/LICENSE` → MIT | MIT |
| Latest CE-named release asset | GitHub Releases filter `chaosengine` | `chaosengine-install-video-20261004` published 2026-10-04 |
| Parent repo stars | SHAFT_ENGINE stargazers_count | **418** @ 2026-10-31 13:33 — label as parent repo, not CE |

## Apply rule

- Inject `softwareVersion` from VERSION at publish time (currently snapshot 2026.10.31.5 in `01-jsonld-graph.json` / `src/data/chaosengine-jsonld.ts`).
- Prefer shields/badges over hardcoded stars.
- Evidence file: `evidence/gh-live-2026-10-31.json`, `evidence/ce-VERSION.txt`.
