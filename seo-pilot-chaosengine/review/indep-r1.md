# Independent adversarial self-check — seo-pilot-chaosengine (indep-r1)

**Reviewer:** Carl (spawn-free self-check; not Chaos/Coach)  
**Pack freeze under test:** commit before this review file (plan+diffs). Remediation for version placeholder included in same follow-up commit as this file.  
**Method:** `seo-pilot-chaosengine/METHOD.md`  
**When:** 2026-10-31 ~13:40 Africa/Cairo

## Measures run

```text
jsonld OK
OK — 8 FAQ answers byte-match; no HowTo
rg hard-rule terms → hits only inside exclusion / do-not-copy lines
rg HowTo on 01-jsonld-graph.json → none
http://static1.squarespace flagged as BLOCKING in diffs/02 + diffs/06 (Automatest Coach path)
SoftwareApplication.description == SoftwareSourceCode.description
Host names Codex/Claude/Gemini/Grok/Copilot present in live ce-docs.html audit
MIT present in audited README raw
```

## Checklist

| # | Criterion | Result |
|---|---|---|
| 1 | Fact sources for proposed copy | **PASS** — GUIDE/README/LICENSE/GitHub profile/VERSION evidence cited; Offer price 0 only |
| 2 | Spam / doorway / stuffing | **PASS** — single entity page proposal; disambiguation required; no scaled thin pages |
| 3 | Schema shape + FAQ byte-match + no HowTo | **PASS** after remediation (see Findings) |
| 4 | Hard-rule scan | **PASS** — forbidden tokens only in “do not copy” lines |
| 5 | Identity / no publish claim | **PASS** — ChaosEngine identity on shafthq.github.io; Automatest/README noted as out-of-branch |
| 6 | Pilot lessons carried | **PASS** — SERP-proxy label; https og flag; W1/W2; robots AI allow keep |
| 7 | Surfaces map honest | **PASS** — no invented ShaftHQ/ChaosEngine standalone repo |

## Findings

### F1 — `softwareVersion` placeholder (blocking → fixed)

**Was:** `REFRESH_AT_APPLY_FROM_chaos-engine/VERSION` in `01-jsonld-graph.json` (not paste-safe).  
**Fix:** snapshot **2026.10.31.5** from evidence; apply notes require re-fetch at publish.  
**Status:** remediated in follow-up commit with this review.

### F2 — Organization.description drift vs pilot2 (non-blocking)

CE pack Organization.description mentions ChaosEngine; pilot2 SHAFT pack describes SHAFT surfaces only.  
**Risk:** two pilots disagree on shared `@id` `https://shafthq.github.io/#organization`.  
**Ask Coach/Chaos:** unify Organization blurb when both apply, or keep SHAFT-only Org and attach CE only via `creator`/`isRelatedTo`.

### F3 — `programmingLanguage` as JSON array (non-blocking)

Used `["Python","Shell","JavaScript"]`. Schema.org allows Text; multi-value arrays are common in JSON-LD.  
**Optional:** collapse to `"Python"` primary if Rich Results warn.

### F4 — FAQ question “How do I install ChaosEngine?” (non-blocking)

Not a HowTo type; answer points at guide one-liner + install-guide. Acceptable under pack rule. Do **not** add HowTo JSON-LD without Coach.

### F5 — Automatest https og:image (blocking for Automatest apply; out of this repo)

Correctly filed under Coach-owned `06`; guide og:image already https. Not a guide-branch apply blocker.

### F6 — Audit weight (nit)

`audit/` includes full HTML captures (incl. large Squarespace page). Fine for evidence; optional prune later — not a content defect.

## Verdict

**PASS** (with F1 remediated; F2 open for Coach/Chaos coordination).

## Open questions for Coach / Chaos / Mohab

1. Suppress global SHAFT `SoftwareApplication`/`SoftwareSourceCode` headTags on CE routes — confirm Docusaurus approach (route-based filter vs page Head override).
2. Unify Organization `@id` description across pilot2 + pilot3.
3. Confirm `/entity/chaos-engine` path (vs section on `/entity`) before implement.
4. Coach: schedule Automatest `/chaosengine` https og:image + CE schema align.
5. Whether SHAFT_ENGINE README blurb (`10`) ships in the same publish wave or a later CE-identity PR.
6. Re-measure SERP-proxy R1 (`مين عمل ChaosEngine`) only after FAQ+entity are live — expect game Wikipedia until then.
